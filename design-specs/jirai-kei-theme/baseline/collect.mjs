#!/usr/bin/env node
/*
 * collect.mjs — Step 2: freeze the baseline computed-style snapshot.
 *
 * WHY THIS EXISTS
 * ---------------
 * The refactor's acceptance criterion is "the new CSS renders byte-identically to the
 * old one". That is undecidable by reading CSS: the artifact carries 838 `!important`
 * declarations and 55 sections' worth of later-overrides-earlier cascades, so what
 * actually paints an element is only knowable from getComputedStyle(). This script
 * captures that ground truth once, before any edit, so every later step can diff
 * against it mechanically.
 *
 * WHAT IT CAPTURES
 * ----------------
 * For each route: every element in the document, with
 *   - a stable locator (DOM path + identity attributes, deliberately NOT class-only)
 *   - a fixed subset of computed-style properties (COMPUTED_PROPS below)
 * plus a viewport screenshot.
 *
 * THE PROPERTY SUBSET IS FROZEN ON PURPOSE
 * ----------------------------------------
 * COMPUTED_PROPS must not change between the baseline run and the final verification
 * run, or the two snapshots are not comparable. Add nothing mid-refactor. If it must
 * change, re-freeze the baseline and say so.
 *
 * SAFETY
 * ------
 * This drives the REAL app the user is running, over CDP (connectOverCDP). It is
 * It changes location.hash, pauses animations, reads styles, and writes local route
 * fixtures (DOM + inline stylesheet text). Fixtures may contain account data, so the
 * generated snapshot/fixture/screenshot directories are gitignored. It never clicks
 * anything that mutates data, never activates the native window, and NEVER calls
 * browser.close() — that would tear down the user's live app.
 *
 * USAGE
 *   node collect.mjs                      # all routes -> ./snapshot, ./screens
 *   node collect.mjs --routes /feed,/tools
 *   node collect.mjs --out /tmp/probe     # write elsewhere (for idempotency checks)
 *   CDP_URL=http://127.0.0.1:9222 node collect.mjs
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {gzipSync} from 'node:zlib';

const here = path.dirname(fileURLToPath(import.meta.url));
const themeDir = path.dirname(here); // design-specs/jirai-kei-theme

/* ─────────────────────────── playwright resolution ─────────────────────────── */

function loadPlaywright() {
  const bases = [
    process.env.PW_MODULE,
    path.join(themeDir, 'tools'),
    '/tmp/dsh-theme-tools',
  ].filter(Boolean);
  const errors = [];
  for (const base of bases) {
    try {
      const req = createRequire(path.join(base, 'package.json'));
      return req('playwright');
    } catch (error) {
      errors.push(`${base}: ${error.code || error.message}`);
    }
  }
  throw new Error(
    'cannot resolve playwright. Run `npm install` in design-specs/jirai-kei-theme/tools, ' +
      'or set PW_MODULE to a directory whose node_modules contains it.\n  tried:\n    ' +
      errors.join('\n    '),
  );
}

/* ───────────────────────────── frozen property set ─────────────────────────── */
/*
 * 163 frozen properties covering everything the theme actually manipulates: paints, borders
 * (incl. the Win98 bevels built from box-shadow), spacing, box sizing, typography,
 * layout, transforms and motion. Deliberately excludes volatile computed values that
 * depend on live layout geometry in a way that legitimately shifts (scrollbars etc.).
 */
const COMPUTED_PROPS = [
  // paint
  'color',
  'background-color',
  'background-image',
  'background-size',
  'background-position',
  'background-repeat',
  'background-clip',
  'background-origin',
  'background-blend-mode',
  // borders
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'border-image-source',
  'border-image-slice',
  'border-image-repeat',
  'outline-width',
  'outline-style',
  'outline-color',
  'outline-offset',
  // spacing / box
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'box-sizing',
  'aspect-ratio',
  // typography
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'font-variant-numeric',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'text-align',
  'text-transform',
  'text-decoration-line',
  'text-decoration-color',
  'text-decoration-style',
  'text-decoration-thickness',
  'text-underline-offset',
  'text-shadow',
  'text-overflow',
  'white-space',
  'word-break',
  'overflow-wrap',
  'writing-mode',
  'vertical-align',
  // layout
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'z-index',
  'float',
  'clear',
  'overflow-x',
  'overflow-y',
  'flex-direction',
  'flex-wrap',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'justify-content',
  'align-items',
  'align-content',
  'align-self',
  'order',
  'gap',
  'row-gap',
  'column-gap',
  'grid-template-columns',
  'grid-template-rows',
  'grid-auto-flow',
  'grid-column',
  'grid-row',
  // effects / motion
  'box-shadow',
  'opacity',
  'visibility',
  'filter',
  'backdrop-filter',
  'mix-blend-mode',
  'isolation',
  'transform',
  'transform-origin',
  'translate',
  'rotate',
  'scale',
  'transition-property',
  'transition-duration',
  'transition-timing-function',
  'transition-delay',
  'animation-name',
  'animation-duration',
  'animation-timing-function',
  'animation-delay',
  'animation-iteration-count',
  'animation-direction',
  'animation-fill-mode',
  'animation-play-state',
  // misc
  'cursor',
  'pointer-events',
  'user-select',
  'appearance',
  'image-rendering',
  'object-fit',
  'object-position',
  'clip-path',
  'mask-image',
  'list-style-type',
  'list-style-position',
  'content',
  'quotes',
  'resize',
  'scrollbar-width',
  'caption-side',
  'table-layout',
  'border-collapse',
  'border-spacing',
  'direction',
  'unicode-bidi',
  'tab-size',
  'caret-color',
  'accent-color',
  'color-scheme',
  'forced-color-adjust',
  'print-color-adjust',
  'shape-rendering',
  'vector-effect',
  'fill',
  'fill-opacity',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'stroke-dashoffset',
  'flood-color',
  'stop-color',
];

/* ────────────────────────────── identity extraction ────────────────────────── */

/*
 * Runs in the page. Produces, per element:
 *   - `path`: a positional path from <html>, using nth-of-type so it survives
 *     sibling reordering less badly than nth-child, and is stable across reloads.
 *   - `attrs`: the identity-bearing attributes. class is included but is NOT the
 *     primary key: Tailwind conditional classes churn, data-slot/data-* do not.
 */
function collectInPage(props) {
  const IDENTITY_ATTRS = [
    'id',
    'data-slot',
    'data-variant',
    'data-size',
    'data-state',
    'data-side',
    'data-align',
    'data-orientation',
    'data-disabled',
    'data-active',
    'data-selected',
    'data-vrcx-0-surface',
    'data-vrcx-0-css-layer',
    'data-ui-role',
    'data-testid',
    'role',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-expanded',
    'aria-selected',
    'aria-checked',
    'aria-disabled',
    'aria-hidden',
    'aria-modal',
    'aria-haspopup',
    'type',
    'href',
    'name',
    'value',
    'placeholder',
    'title',
    'alt',
    'src',
    'for',
    'lang',
    'dir',
    'tabindex',
    'disabled',
    'checked',
    'readonly',
    'hidden',
    'open',
  ];

  /*
   * Paths are rooted at <body>, NOT <html>.
   *
   * We only ever style body content, and <head> is actively hostile to positional
   * paths: its <script>/<style>/<link> set is rebuilt on every document load and its
   * ordering differs run to run. Including head shifted every index after it, which
   * showed up as thousands of bogus "element differs" rows in the idempotency check.
   * Elements outside <body> are skipped entirely (see the loop in collectInPage).
   */
  function pathOf(el) {
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.body) {
      const tag = node.tagName.toLowerCase();
      const parent = node.parentElement;
      if (!parent) {
        parts.unshift(tag);
        break;
      }
      const sameTag = Array.from(parent.children).filter(
        (c) => c.tagName === node.tagName,
      );
      const idx = sameTag.indexOf(node) + 1;
      parts.unshift(sameTag.length > 1 ? `${tag}:nth-of-type(${idx})` : tag);
      node = parent;
    }
    return el === document.body ? 'body' : 'body>' + parts.join('>');
  }

  function attrsOf(el) {
    const out = {};
    for (const name of IDENTITY_ATTRS) {
      if (el.hasAttribute(name)) out[name] = el.getAttribute(name);
    }
    // Class list as a sorted array so ordering churn does not create false diffs.
    if (el.classList.length > 0) out.class = Array.from(el.classList).sort();
    return out;
  }

  const elements = [];
  const all = document.querySelectorAll('*');
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    // <head> contents (script/style/link/title) and inert body scripts are not
    // rendered controls. Head ordering is unstable between loads; scripts are
    // omitted from the fixture so they cannot execute. See the note on pathOf().
    if (!document.body || !document.body.contains(el) || el.tagName === 'SCRIPT') continue;
    const cs = getComputedStyle(el);
    const styles = {};
    for (const prop of props) styles[prop] = cs.getPropertyValue(prop);
    elements.push({
      path: pathOf(el),
      tag: el.tagName.toLowerCase(),
      attrs: attrsOf(el),
      styles,
    });
  }

  // Freeze the rendered route as inert HTML. This is the deterministic replay input:
  // all later CSS candidates are applied to this exact captured DOM, not to a live
  // React tree whose data, selection and async rows keep changing.
  const fixtureRoot = document.documentElement.cloneNode(true);
  for (const script of fixtureRoot.querySelectorAll('script')) script.remove();

  // Reflect live form state into markup because cloneNode copies attributes, not the
  // current value/checked/selected properties. The fixture stays local and ignored.
  const liveInputs = document.querySelectorAll('input');
  const copyInputs = fixtureRoot.querySelectorAll('input');
  for (let i = 0; i < Math.min(liveInputs.length, copyInputs.length); i++) {
    const live = liveInputs[i], copy = copyInputs[i];
    if (live.type === 'checkbox' || live.type === 'radio') {
      if (live.checked) copy.setAttribute('checked', '');
      else copy.removeAttribute('checked');
    } else {
      copy.setAttribute('value', live.value);
    }
  }
  const liveTextareas = document.querySelectorAll('textarea');
  const copyTextareas = fixtureRoot.querySelectorAll('textarea');
  for (let i = 0; i < Math.min(liveTextareas.length, copyTextareas.length); i++) {
    copyTextareas[i].textContent = liveTextareas[i].value;
  }
  const liveOptions = document.querySelectorAll('option');
  const copyOptions = fixtureRoot.querySelectorAll('option');
  for (let i = 0; i < Math.min(liveOptions.length, copyOptions.length); i++) {
    if (liveOptions[i].selected) copyOptions[i].setAttribute('selected', '');
    else copyOptions[i].removeAttribute('selected');
  }
  const liveDetails = document.querySelectorAll('details');
  const copyDetails = fixtureRoot.querySelectorAll('details');
  for (let i = 0; i < Math.min(liveDetails.length, copyDetails.length); i++) {
    if (liveDetails[i].open) copyDetails[i].setAttribute('open', '');
    else copyDetails[i].removeAttribute('open');
  }
  const fixtureHtml = `<!doctype html>\n${fixtureRoot.outerHTML}`;

  return {
    fixtureHtml,
    elementCount: elements.length,
    viewport: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    },
    documentElement: {
      class: document.documentElement.className,
      attrs: (() => {
        const o = {};
        for (const a of document.documentElement.attributes) o[a.name] = a.value;
        return o;
      })(),
    },
    styleTags: Array.from(document.querySelectorAll('style')).map((s) => ({
      id: s.id || null,
      bytes: s.textContent.length,
      layer: s.getAttribute('data-vrcx-0-css-layer'),
    })),
    elements,
  };
}

/* ────────────────────────────────── driving ───────────────────────────────── */

function slug(route) {
  return route.replace(/^\//, '').replace(/[/:?]/g, '_') || 'root';
}

/*
 * Stability is judged on a fingerprint of the rendered tree.
 *
 * The first version watched only element-count + text length and stopped at 3 quiet
 * samples, which missed the two things that actually bite here:
 *   - lazy media swapping a skeleton <svg> for a real <img> (element count changes,
 *     but only once the network response lands), and
 *   - list rows arriving after first paint.
 * So we also wait for document.fonts and for every <img> to settle, and require a
 * longer quiet streak. Fingerprint includes imgsTotal so a skeleton->img swap counts
 * as a change even when the element count happens to be identical.
 */
async function waitStable(page, {timeout = 12000, quiet = 4, interval = 300} = {}) {
  const deadline = Date.now() + timeout;
  let lastKey = null;
  let sameCount = 0;
  while (Date.now() < deadline) {
    const fp = await page.evaluate(() => {
      const imgs = Array.from(document.images);
      return {
        n: document.querySelectorAll('body *').length,
        text: document.body ? document.body.innerText.length : 0,
        hash: location.hash,
        fonts: document.fonts ? document.fonts.status : 'n/a',
        imgsPending: imgs.filter((i) => !i.complete).length,
        imgsTotal: imgs.length,
      };
    });
    const settled =
      fp.fonts !== 'loading' && fp.imgsPending === 0 && fp.hash !== '';
    const key = JSON.stringify([fp.n, fp.text, fp.hash, fp.imgsTotal]);
    if (settled && key === lastKey) {
      sameCount++;
      if (sameCount >= quiet) return fp;
    } else {
      sameCount = 0;
      lastKey = key;
    }
    await page.waitForTimeout(interval);
  }
  return null;
}

/*
 * Animations make computed values time-dependent (`opacity`, `transform`), which is
 * fatal to a byte-comparable baseline.
 *
 * Pausing alone is NOT enough: a paused animation still reports whatever value it
 * held at its current time, so run 1 could sample opacity 1 while run 2 sampled
 * 0.549. Rewinding every animation to t=0 makes the sampled value a pure function of
 * the stylesheet — which is precisely what we are trying to compare.
 *
 * Deliberately does NOT inject `animation: none` / `transition: none`: rewriting the
 * cascade here would change computed style and defeat the whole exercise.
 */
async function withAnimationsPaused(page, fn) {
  const paused = await page.evaluate(() => {
    if (typeof document.getAnimations !== 'function') return 0;
    const all = document.getAnimations();
    for (const a of all) {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    return all.length;
  });
  try {
    return {result: await fn(), pausedCount: paused};
  } finally {
    await page.evaluate(() => {
      if (typeof document.getAnimations !== 'function') return;
      for (const a of document.getAnimations()) {
        try {
          a.play();
        } catch {
          /* ignore */
        }
      }
    });
  }
}

/* ─────────────────────────────────── main ─────────────────────────────────── */

const argv = process.argv.slice(2);
const getFlag = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const outDir = getFlag('--out') || here;
const onlyRoutes = getFlag('--routes')
  ? getFlag('--routes').split(',').map((s) => s.trim()).filter(Boolean)
  : null;

const routesFile = path.join(here, 'routes.json');
if (!fs.existsSync(routesFile)) throw new Error(`missing ${routesFile}`);
const routeTable = JSON.parse(fs.readFileSync(routesFile, 'utf8'));
const routes = onlyRoutes
  ? routeTable.routes.filter((r) => onlyRoutes.includes(r.route))
  : routeTable.routes;

if (routes.length === 0) throw new Error('no routes selected');

const snapshotDir = path.join(outDir, 'snapshot');
const fixtureDir = path.join(outDir, 'fixtures');
const screensDir = path.join(outDir, 'screens');
fs.mkdirSync(snapshotDir, {recursive: true});
fs.mkdirSync(fixtureDir, {recursive: true});
fs.mkdirSync(screensDir, {recursive: true});

const {chromium} = loadPlaywright();
const cdpUrl = process.env.CDP_URL || 'http://127.0.0.1:9222';
const browser = await chromium.connectOverCDP(cdpUrl);
const contexts = browser.contexts();
if (contexts.length === 0) throw new Error('no browser contexts over CDP');
const pages = contexts.flatMap((c) => c.pages());
if (pages.length === 0) throw new Error('no pages over CDP');
const page = pages[0];

// Do not bring the user's app to the foreground. CDP evaluation and screenshots
// work against the exact bound page without activating its native window.
const originalHash = await page.evaluate(() => location.hash);

const results = [];
for (const entry of routes) {
  const {route} = entry;
  const file = slug(route);
  const started = Date.now();
  let record = {
    route,
    url: `http://localhost:9000/#${route}`,
    file,
    status: 'captured',
    stability: 'pending',
    note: entry.note || null,
  };
  try {
    // Park the pointer somewhere inert first: a stale :hover left over from the
    // previous route leaks into this route's computed styles otherwise.
    await page.mouse.move(2, 2).catch(() => {});
    await page.evaluate((h) => {
      window.location.hash = h;
    }, route);

    const fp = await waitStable(page);
    record.stability = fp === null ? 'unstable-at-timeout' : 'stable';
    if (fp === null) {
      record.note = (record.note ? record.note + '; ' : '') +
        'capture continued after DOM-stability timeout; live app data/animations keep changing';
    }

    const finalHash = await page.evaluate(() => location.hash);
    record.finalHash = finalHash;
    record.redirected = finalHash !== `#${route}`;

    const {result, pausedCount} = await withAnimationsPaused(page, () =>
      page.evaluate(collectInPage, COMPUTED_PROPS),
    );
    record.animationsPaused = pausedCount;
    record.elementCount = result.elementCount;
    record.viewport = result.viewport;

    const snapshot = {
      route,
      capturedAt: new Date().toISOString(),
      requestedHash: `#${route}`,
      finalHash,
      redirected: record.redirected,
      status: record.status,
      animationCount: pausedCount,
      documentElement: result.documentElement,
      styleTags: result.styleTags,
      elementCount: result.elementCount,
      viewport: result.viewport,
      propertySet: COMPUTED_PROPS,
      elements: result.elements,
    };
    fs.writeFileSync(
      path.join(snapshotDir, `${file}.json`),
      JSON.stringify(snapshot),
    );
    const fixtureBytes = gzipSync(Buffer.from(result.fixtureHtml, 'utf8'));
    fs.writeFileSync(path.join(fixtureDir, `${file}.html.gz`), fixtureBytes);
    record.fixtureBytes = fixtureBytes.length;

    await page.screenshot({
      path: path.join(screensDir, `${file}.png`),
      animations: 'disabled',
    });
  } catch (error) {
    record.status = 'error';
    record.error = String(error && error.message ? error.message : error);
  }
  record.ms = Date.now() - started;
  results.push(record);
  console.log(
    `${record.status.padEnd(8)} ${route.padEnd(38)} ${String(record.elementCount || 0).padStart(6)} els  ${record.ms} ms` +
      (record.redirected ? `  -> ${record.finalHash}` : '') +
      (record.error ? `  !! ${record.error}` : ''),
  );
}

// Restore the route that was open when capture began, leaving the live app in place.
if (originalHash) {
  await page.evaluate((h) => { window.location.hash = h; }, originalHash).catch(() => {});
  await page.waitForTimeout(500).catch(() => {});
}

const cssPath = path.join(
  themeDir,
  'runtime',
  'preview-package',
  'jirai-kei-theme',
  'theme.css',
);
const repoRoot = path.resolve(themeDir, '../..');
let sourceCommit = process.env.SOURCE_COMMIT || null;
if (!sourceCommit) {
  try {
    sourceCommit = execFileSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    sourceCommit = null;
  }
}
const themeBytes = fs.existsSync(cssPath) ? fs.readFileSync(cssPath) : null;
let interactionStateCount = 0;
const interactionManifestPath = path.join(here, 'interaction-manifest.json');
if (fs.existsSync(interactionManifestPath)) {
  try {
    const interactionManifest = JSON.parse(fs.readFileSync(interactionManifestPath, 'utf8'));
    interactionStateCount = interactionManifest.results.filter((r) => r.status === 'captured').length;
  } catch {
    interactionStateCount = 0;
  }
}
const manifest = {
  step: 'Step 2 — freeze baseline',
  generatedAt: new Date().toISOString(),
  cdpUrl,
  outDir: path.relative(repoRoot, outDir) || '.',
  themePackCommit: sourceCommit,
  appCommit: routeTable.appCommit || null,
  outputs: {
    snapshots: path.relative(outDir, snapshotDir),
    fixtures: path.relative(outDir, fixtureDir),
    screenshots: path.relative(outDir, screensDir),
  },
  themeCss: {
    path: path.relative(repoRoot, cssPath),
    sha256: process.env.THEME_SHA256 || (themeBytes ? crypto.createHash('sha256').update(themeBytes).digest('hex') : null),
    bytes: themeBytes ? themeBytes.length : null,
  },
  propertyCount: COMPUTED_PROPS.length,
  properties: COMPUTED_PROPS,
  routeCount: results.length,
  interactionStateCount,
  stateCount: results.length + interactionStateCount,
  routes: results,
};
fs.writeFileSync(
  path.join(outDir, 'MANIFEST.json'),
  JSON.stringify(manifest, null, 2) + '\n',
);

const capturedCount = results.filter((r) => r.status === 'captured').length;
const stableCount = results.filter((r) => r.stability === 'stable').length;
const errorCount = results.filter((r) => r.status === 'error').length;
console.log(`\n${capturedCount}/${results.length} routes captured; ${stableCount} stable, ${capturedCount - stableCount} dynamically unstable, ${errorCount} errors`);
console.log(`snapshots -> ${snapshotDir}`);
console.log(`screens   -> ${screensDir}`);
console.log(`manifest  -> ${path.join(outDir, 'MANIFEST.json')}`);

// NEVER browser.close() — connectOverCDP would kill the user's live app window.
process.exit(errorCount === 0 ? 0 : 1);
