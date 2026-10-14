#!/usr/bin/env node
/*
 * Replay frozen route DOM fixtures and recalculate their computed styles.
 *
 * This is the deterministic comparison surface: the fixture is captured once from
 * the live React app; baseline CSS and every candidate CSS are evaluated against the
 * same inert DOM. No React, Rust bridge, live API polling, or user interaction runs
 * inside the iframe. The app's actual window is never foregrounded or closed.
 *
 * Usage:
 *   node replay-fixtures.mjs [--routes /feed,/settings] [--out <dir>]
 *
 * Reads ./fixtures/<slug>.html.gz and ./snapshot/<slug>.json (for the frozen property
 * list/viewport); writes <out>/<slug>.json. Generated fixture/output directories are
 * gitignored because the captured DOM can contain private account data.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {gunzipSync} from 'node:zlib';

const here = path.dirname(fileURLToPath(import.meta.url));
const themeDir = path.dirname(here);
function loadPlaywright() {
  for (const base of [process.env.PW_MODULE, path.join(themeDir, 'tools'), '/tmp/dsh-theme-tools'].filter(Boolean)) {
    try { return createRequire(path.join(base, 'package.json'))('playwright'); } catch {}
  }
  throw new Error('cannot resolve playwright; install design-specs/jirai-kei-theme/tools dependencies or set PW_MODULE');
}
const {chromium} = loadPlaywright();
const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(name);
  return i < 0 ? undefined : argv[i + 1];
};
const only = flag('--routes')?.split(',').map((s) => s.trim()).filter(Boolean);
const fixtureDir = path.join(here, 'fixtures');
const snapshotDir = path.join(here, 'snapshot');
const outDir = flag('--out') || snapshotDir;
const candidateCssPath = flag('--theme-css');
const candidateCss = candidateCssPath ? fs.readFileSync(candidateCssPath, 'utf8') : null;
const candidateCssSha256 = candidateCss ? crypto.createHash('sha256').update(candidateCss).digest('hex') : null;
const baselineManifest = JSON.parse(fs.readFileSync(path.join(here, 'MANIFEST.json'), 'utf8'));
const effectiveCssSha256 = candidateCssSha256 || baselineManifest.themeCss.sha256;
fs.mkdirSync(outDir, {recursive: true});

function slug(route) {
  return route.replace(/^\//, '').replace(/[/:?]/g, '_') || 'root';
}

const browser = await chromium.connectOverCDP(process.env.CDP_URL || 'http://127.0.0.1:9222');
const page = browser.contexts().flatMap((c) => c.pages())[0];
if (!page) throw new Error('no page found on CDP connection');
const baselineFiles = fs.readdirSync(snapshotDir).filter((f) => f.endsWith('.json')).sort();
let routes = baselineFiles.map((file) => ({file, data: JSON.parse(fs.readFileSync(path.join(snapshotDir, file), 'utf8'))}));
if (only) routes = routes.filter(({data}) => only.includes(data.route));
let failures = 0;

for (const {file, data} of routes) {
  const started = Date.now();
  try {
    const fixturePath = path.join(fixtureDir, `${file.replace(/\.json$/, '')}.html.gz`);
    if (!fs.existsSync(fixturePath)) throw new Error(`missing fixture ${fixturePath}`);
    let html = gunzipSync(fs.readFileSync(fixturePath)).toString('utf8');
    if (candidateCss) {
      const layerStyle = /(<style\b[^>]*\bdata-vrcx-0-css-layer=(["'])local-theme-preview\2[^>]*>)[\s\S]*?(<\/style>)/i;
      let replacements = 0;
      html = html.replace(layerStyle, (_whole, open, _quote, close) => {
        replacements++;
        return open + candidateCss + close;
      });
      if (replacements !== 1) throw new Error(`expected exactly one local-theme-preview style tag in ${file}, found ${replacements}`);
    }
    // Freeze CSS animations before body parsing so one-shot `animate-in` effects
    // cannot finish on one replay and remain at t=0 on another. CSS declarations
    // (animation-name/duration/etc.) remain observable; animated output properties
    // are sampled deterministically at the paused start frame.
    const animationFreeze = '<style data-baseline-animation-freeze>*,:before,:after{animation-play-state:paused!important}</style>';
    if (html.includes('</head>')) html = html.replace('</head>', `${animationFreeze}</head>`);
    const width = data.viewport.innerWidth;
    const height = data.viewport.innerHeight;
    const result = await page.evaluate(async ({html, width, height, props}) => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.cssText = `position:fixed;left:-20000px;top:0;width:${width}px;height:${height}px;border:0;visibility:hidden;`;
      const loaded = new Promise((resolve, reject) => {
        iframe.onload = async () => {
          try {
            const doc = iframe.contentDocument;
            if (!doc) throw new Error('fixture iframe document unavailable');
            let base = doc.querySelector('base');
            if (!base) {
              base = doc.createElement('base');
              base.href = 'http://localhost:9000/';
              doc.head.prepend(base);
            }
            if (doc.fonts?.ready) await Promise.race([doc.fonts.ready, new Promise((r) => setTimeout(r, 4000))]);
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
            for (const animation of doc.getAnimations?.() || []) {
              try { animation.pause(); animation.currentTime = 0; } catch {}
            }
            function pathOf(el) {
              const parts = [];
              let node = el;
              while (node && node.nodeType === 1 && node !== doc.body) {
                const tag = node.tagName.toLowerCase();
                const parent = node.parentElement;
                if (!parent) break;
                const sameTag = Array.from(parent.children).filter((c) => c.tagName === node.tagName);
                const idx = sameTag.indexOf(node) + 1;
                parts.unshift(sameTag.length > 1 ? `${tag}:nth-of-type(${idx})` : tag);
                node = parent;
              }
              return el === doc.body ? 'body' : 'body>' + parts.join('>');
            }
            const elements = [];
            for (const el of [doc.body, ...doc.body.querySelectorAll('*')]) {
              const computed = doc.defaultView.getComputedStyle(el);
              const styles = {};
              for (const prop of props) styles[prop] = computed.getPropertyValue(prop);
              const attrs = Object.fromEntries(Array.from(el.attributes, (a) => [a.name, a.value]));
              elements.push({path: pathOf(el), tag: el.tagName.toLowerCase(), attrs, styles});
            }
            const interactiveTargets = Array.from(doc.querySelectorAll('button,[role="button"],[aria-haspopup],[data-slot$="trigger"]')).map((el) => ({
              path: pathOf(el),
              tag: el.tagName.toLowerCase(),
              attrs: Object.fromEntries(Array.from(el.attributes).filter((a) => ['id','data-slot','data-state','data-variant','role','aria-label','aria-haspopup','aria-controls','type','disabled'].includes(a.name)).map((a) => [a.name,a.value])),
            }));
            const openOverlays = Array.from(doc.querySelectorAll('dialog[open],[role="alertdialog"],[role="dialog"][aria-modal="true"],[role="menu"],[role="listbox"],[role="tooltip"],[data-state="open"][data-slot$="-content"]')).map((el) => ({path:pathOf(el),tag:el.tagName.toLowerCase(),role:el.getAttribute('role'),slot:el.getAttribute('data-slot'),state:el.getAttribute('data-state')}));
            resolve({elements, elementCount: elements.length, interactiveTargets, openOverlays});
          } catch (e) { reject(e); }
        };
      });
      iframe.srcdoc = html;
      document.body.append(iframe);
      try { return await loaded; } finally { iframe.remove(); }
    }, {html, width, height, props: data.propertySet});

    const output = {
      route: data.route,
      sourceFixture: path.relative(here, fixturePath),
      capturedAt: new Date().toISOString(),
      viewport: data.viewport,
      propertySet: data.propertySet,
      themeCssSha256: effectiveCssSha256,
      candidateCssPath: candidateCssPath || null,
      stateId: data.stateId || null,
      trigger: data.trigger || null,
      elementCount: result.elementCount,
      interactiveTargets: result.interactiveTargets,
      openOverlays: result.openOverlays,
      elements: result.elements,
    };
    fs.writeFileSync(path.join(outDir, file), JSON.stringify(output));
    console.log(`ok ${data.route.padEnd(38)} ${result.elementCount} elements ${Date.now() - started} ms`);
  } catch (error) {
    failures++;
    console.error(`FAIL ${data.route}: ${error?.stack || error}`);
  }
}
console.log(`\n${routes.length - failures}/${routes.length} fixtures replayed`);
// CDP browser object is a connection to the user's app: do not close it.
process.exit(failures === 0 ? 0 : 1);
