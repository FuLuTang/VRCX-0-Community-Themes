/* Element × context style-coverage audit for the Jirai-kei runtime theme.  NOT WINDOWS: fictional fixture only.
 *
 *   node audit.mjs [--prims native-range,base-slider,...] [--tag before-fix] [--revert-r8-slider]
 *                  [--theme /path/theme.css] [--build] [--no-shots]
 *
 * Environment (see README.md): PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers, JIRAI_OUT=<isolated build dir>.
 * The audit NEVER edits CSS or app sources; it writes only into its own directory.
 *
 * Pipeline per primitive:
 *   1. static scan of <SRC>/**.tsx  -> use sites (file:line, class summary, inferred context)
 *   2. fixture page with the real class strings in real ancestor chains per context, theme CSS split per
 *      `SECTION` into separate <style data-section> nodes (same cascade as the concatenated file)
 *   3. in-browser: for every theme selector hinting at the primitive, strip `:not(<ctx> *)` exclusion clauses,
 *      then report per cell  HIT (matches now) / EXCLUDED (matches only without the clause; culprit clause)
 *   4. computed-style fingerprints (+ CSSOM-cascade emulation for ::-webkit-slider-* , which getComputedStyle
 *      cannot read) for  no-theme baseline / themed cell / canonical themed cell
 *   5. matrix  primitive x context  ->  ✓ themed / ✗ gap / – no use site (+ latent flag)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {PRIMS, CONTEXTS, CTX_ORDER} from './primitives.mjs';
import {scanSources} from './scan.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const argv = process.argv.slice(2);
const flag = n => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };

const SRC = process.env.AUDIT_SRC || '/tmp/vrcx-win-src-r9/src';
const APP_DIST = process.env.AUDIT_APP_DIST || '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets';
const PW = process.env.AUDIT_PLAYWRIGHT || '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const OUT_DIR = process.env.JIRAI_OUT || '/tmp/jirai-elem-audit/jirai-kei-theme';
const tag = opt('tag', '');
const suffix = tag ? `.${tag}` : '';
const wanted = (opt('prims', '') || '').split(',').filter(Boolean);
const prims = PRIMS.filter(p => !wanted.length || wanted.includes(p.id));

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/tmp/dsh-theme-browsers';
process.env.TMPDIR = path.join(here, 'browser-tmp');
await fs.mkdir(process.env.TMPDIR, {recursive: true});
await fs.mkdir(path.join(here, 'shots'), {recursive: true});

if (flag('build')) {
  // isolated build only: never the default runtime/preview-package, never build-runtime.mjs edits
  execFileSync('node', ['build-runtime.mjs'], {cwd: runtime, stdio: 'ignore', env: {...process.env, JIRAI_OUT: OUT_DIR,
    PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || '/tmp/dsh-theme-browsers', SHARP_MODULE: process.env.SHARP_MODULE || '/tmp/dsh-theme-tools/node_modules/sharp'}});
}
const themePath = opt('theme', path.join(OUT_DIR, 'theme.css'));
let themeText = await fs.readFile(themePath, 'utf8');

// --revert-r8-slider: reproduce the PRE-FIX theme by textually putting the old narrow selector chain back
// into the user-dialog-r8 section only (so the pre-fix matrix can be regenerated at any time).
if (flag('revert-r8-slider')) {
  const re = /(\/\* SECTION user-dialog-r8 \*\/)([\s\S]*?)(?=\/\* SECTION [^*]+\*\/|$)/;
  const NEW = '[data-slot="dialog-content"].entity-dialog input[type="range"]';
  themeText = themeText.replace(re, (_, h, body) => h + body.split(NEW).join(NEW + '.accent-primary.min-w-16.flex-1'));
}
const sections = [];
{
  const parts = themeText.split(/(?=\/\* SECTION [^*]+\*\/)/);
  for (const p of parts) {
    const m = p.match(/^\/\* SECTION ([^*]+?) \*\//);
    sections.push({name: m ? m[1].trim() : 'preamble', css: p});
  }
}
const appCssFiles = (await fs.readdir(APP_DIST)).filter(f => /^(index|App)-.*\.css$/.test(f)).sort((a, b) => a.startsWith('index') ? -1 : 1);
const appCss = [];
for (const f of appCssFiles) appCss.push({name: f, css: await fs.readFile(path.join(APP_DIST, f), 'utf8')});

// ---------- 1. static scan ----------
const scan = await scanSources(SRC);
const sitesByPrim = Object.fromEntries(PRIMS.map(p => [p.id, scan.sites.filter(s => s.prim === p.id)]));

// ---------- fixture ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const cellsFor = new Map(); // primId -> ctxId -> [{aid, build, sites, used}]
const instances = [];
for (const p of prims) {
  const all = sitesByPrim[p.id];
  const bySig = new Map();
  for (const s of all) {
    const sig = p.signature(s);
    if (!bySig.has(sig)) bySig.set(sig, {sig, sample: s});
  }
  const rep = all.length ? p.signature(all[0]) : null;
  for (const ctxId of CTX_ORDER) {
    const inCtx = all.filter(s => s.ctx === ctxId);
    const sigs = new Map();
    for (const s of inCtx) { const sig = p.signature(s); if (!sigs.has(sig)) sigs.set(sig, []); sigs.get(sig).push(s); }
    let used = inCtx.length > 0;
    if (!used) sigs.set(rep || 'default', []);
    let n = 0;
    for (const [sig, sites] of sigs) {
      const sample = (sites[0]) || (rep && bySig.get(rep)?.sample) || null;
      const aid = `${p.id}__${ctxId}__${n++}`;
      for (const v of p.variants(sample, sig)) {
        instances.push({prim: p.id, ctx: ctxId, aid: `${aid}${v.tag ? '~' + v.tag : ''}`, group: aid, sig, used, sites: sites.map(s => `${s.file}:${s.line}`), v});
      }
    }
  }
}

const SCENE_CSS = `
html,body{margin:0;background:#2a2147}
body{padding:16px;font:12px/1.4 system-ui,sans-serif;color:#f2ebff;width:1100px}
.audit-prim{margin:0 0 24px}.audit-prim>h1{font:600 14px monospace;margin:0 0 6px;color:#ffd9ee}
.audit-scene{margin:4px 0;padding:4px 8px;border-left:3px solid #6c5ce0;position:relative}
.audit-scene>.audit-label{font:10px monospace;color:#d6b8ef;margin-bottom:2px}
.audit-cell{display:inline-block;vertical-align:top;margin:2px 10px 2px 0;min-width:40px}
[data-scene] [data-slot="dialog-content"],[data-scene] [data-slot="popover-content"],[data-scene] [data-slot="toast-content"],[data-scene] [data-vrcx-0-surface="privacy-lock"],[data-scene] [data-slot="toast"],[data-scene] [data-slot="toast-viewport"]{position:relative!important;inset:auto!important;transform:none!important;translate:none!important;animation:none!important;max-width:none!important;max-height:none!important;overflow:visible!important;opacity:1!important;width:auto!important;margin:0!important;height:auto!important}
[data-scene] .vrcx-0-app-root{height:auto!important;overflow:visible!important}
[data-scene] [data-vrcx-0-surface]:not([data-slot]){overflow:visible!important}
[data-scene] .vrcx-0-page-scaffold{height:auto!important;overflow:visible!important}
`;
function buildPage(withTheme) {
  const sceneHtml = [];
  for (const p of prims) {
    const rows = [];
    for (const ctxId of CTX_ORDER) {
      const insts = instances.filter(i => i.prim === p.id && i.ctx === ctxId);
      const cells = insts.map(i => `<div class="audit-cell" data-cell="${esc(i.aid)}">${i.v.html}</div>`).join('');
      rows.push(`<section class="audit-scene" data-prim="${p.id}" data-ctx="${ctxId}"><div class="audit-label">${p.id} · ${ctxId}${insts.some(i => i.used) ? '' : ' · (no use site: representative)'}</div><div data-scene="${ctxId}">${CONTEXTS[ctxId].wrap(cells)}</div></section>`);
    }
    sceneHtml.push(`<div class="audit-prim" data-prim-block="${p.id}"><h1>${p.id}</h1>${rows.join('')}</div>`);
  }
  const styles = appCss.map(a => `<style data-section="app:${a.name}">${a.css}</style>`).join('')
    + (withTheme ? sections.map(s => `<style data-section="${esc(s.name)}" data-theme="1">${s.css}</style>`).join('') : '')
    + `<style data-audit>${SCENE_CSS}</style>`;
  return `<!doctype html><html lang="en" class="dark"><head><meta charset="utf-8"><title>element-style-audit</title>${styles}</head><body>${sceneHtml.join('')}</body></html>`;
}

// ---------- in-page analysis (runs in the browser) ----------
const PAGE_FN = function (cfg) {
  const {INSTANCES, PROPS, POSES} = cfg;
  const out = {cells: {}, ruleCount: 0};
  // --- flatten rules
  const flat = [];
  let order = 0;
  const walk = (rules, ctx, parent = null) => {
    for (const r of rules) {
      const cn = r.constructor.name;
      if (cn === 'CSSStyleRule') {
        const selector = parent ? (r.selectorText.includes('&') ? r.selectorText.replaceAll('&', `:is(${parent})`) : `:is(${parent}) ${r.selectorText}`) : r.selectorText;
        flat.push({r, selector, ctx, order: order++});
        if (r.cssRules?.length) walk(r.cssRules, ctx, selector);
      }
      else if (cn === 'CSSMediaRule') { try { if (matchMedia(r.media.mediaText).matches) walk(r.cssRules, ctx, parent); } catch { } }
      else if (cn === 'CSSSupportsRule') { try { if (CSS.supports(r.conditionText)) walk(r.cssRules, ctx, parent); } catch { } }
      else if (cn === 'CSSLayerBlockRule') { walk(r.cssRules, {...ctx, layered: true}, parent); }
      else if (r.cssRules && cn !== 'CSSKeyframesRule' && cn !== 'CSSFontFaceRule') { walk(r.cssRules, ctx, parent); }
    }
  };
  for (const sheet of document.styleSheets) {
    const node = sheet.ownerNode;
    if (!node || node.hasAttribute('data-audit')) continue;
    walk(sheet.cssRules, {section: node.getAttribute('data-section') || '?', theme: node.hasAttribute('data-theme'), layered: false});
  }
  out.ruleCount = flat.length;
  // --- selector utils
  const splitTop = s => { const res = []; let d = 0, q = null, cur = ''; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { cur += c; if (c === q && s[i - 1] !== '\\') q = null; continue; } if (c === '"' || c === "'") { q = c; cur += c; continue; } if (c === '(' || c === '[') d++; if (c === ')' || c === ']') d--; if (c === ',' && d === 0) { res.push(cur.trim()); cur = ''; } else cur += c; } if (cur.trim()) res.push(cur.trim()); return res; };
  const specificity = sel => {
    let a = 0, b = 0, c = 0; let i = 0;
    const readParen = j => { let d = 0; let k = j; for (; k < sel.length; k++) { if (sel[k] === '(') d++; if (sel[k] === ')') { d--; if (d === 0) break; } } return k; };
    const maxOf = arg => { let best = [0, 0, 0]; for (const s of splitTop(arg)) { const x = specificity(s); if (x[0] > best[0] || (x[0] === best[0] && (x[1] > best[1] || (x[1] === best[1] && x[2] > best[2])))) best = x; } return best; };
    while (i < sel.length) {
      const ch = sel[i];
      if (ch === '#') { a++; i++; while (i < sel.length && /[\w-]/.test(sel[i])) i++; }
      else if (ch === '.') { b++; i++; while (i < sel.length && /[\w-]/.test(sel[i])) i++; }
      else if (ch === '[') { b++; let q = null; i++; while (i < sel.length && !(sel[i] === ']' && !q)) { if (q) { if (sel[i] === q) q = null; } else if (sel[i] === '"' || sel[i] === "'") q = sel[i]; i++; } i++; }
      else if (ch === ':') {
        if (sel[i + 1] === ':') { c++; i += 2; while (i < sel.length && /[\w-]/.test(sel[i])) i++; if (sel[i] === '(') i = readParen(i) + 1; continue; }
        let j = i + 1; while (j < sel.length && /[\w-]/.test(sel[j])) j++; const name = sel.slice(i + 1, j).toLowerCase();
        if (sel[j] === '(') { const k = readParen(j); const arg = sel.slice(j + 1, k);
          if (name === 'where') { /* 0 */ } else if (['not', 'is', 'matches', 'has'].includes(name)) { const m = maxOf(arg); a += m[0]; b += m[1]; c += m[2]; } else b++;
          i = k + 1; } else { b++; i = j; }
      }
      else if (/[a-zA-Z]/.test(ch)) { c++; i++; while (i < sel.length && /[\w-]/.test(sel[i])) i++; }
      else i++;
    }
    return [a, b, c];
  };
  const PSEUDO_RE = /::?(-webkit-slider-thumb|-webkit-slider-runnable-track|-moz-range-thumb|-moz-range-track|before|after|placeholder|file-selector-button|-webkit-progress-bar|-webkit-progress-value|-moz-progress-bar|marker|selection)\s*$/;
  const DYN_RE = /:(hover|active|focus-visible|focus-within|focus)(?![\w-])/g;
  // strip `:not(<anything> *)` context-exclusion clauses (arg ends with a descendant-universal)
  const stripExcl = sel => {
    const clauses = []; let res = ''; let i = 0;
    while (i < sel.length) {
      if (sel.startsWith(':not(', i)) {
        let d = 0, k = i + 4; for (; k < sel.length; k++) { if (sel[k] === '(') d++; if (sel[k] === ')') { d--; if (d === 0) break; } }
        const arg = sel.slice(i + 5, k);
        if (/\s\*\s*$/.test(arg)) { clauses.push(arg.trim()); i = k + 1; continue; }
        res += sel.slice(i, k + 1); i = k + 1; continue;
      }
      res += sel[i++];
    }
    res = res.replace(/:(where|is)\(\s*\)/g, '');
    return {core: res, clauses};
  };
  const prepared = [];
  for (const f of flat) {
    const raw = f.selector || f.r.selectorText;
    for (const sel of splitTop(raw)) {
      let base = sel, pseudo = null;
      const pm = base.match(PSEUDO_RE);
      if (pm) { pseudo = pm[1]; base = base.slice(0, pm.index); }
      const dyn = [...base.matchAll(DYN_RE)].map(m => m[1]);
      const stat = base.replace(DYN_RE, '');
      const {core, clauses} = stripExcl(stat);
      prepared.push({f, sel, base: stat, core, clauses, pseudo, dyn, spec: null, hints: null});
    }
  }
  const specOf = p => p.spec || (p.spec = specificity(p.sel.replace(PSEUDO_RE, m => '::x')));
  const safeMatches = (el, s) => { if (!s || !s.trim()) return false; try { return el.matches(s); } catch { return false; } };
  const hintCache = new Map();
  const hintRe = (src) => { if (!hintCache.has(src)) hintCache.set(src, new RegExp(src)); return hintCache.get(src); };
  const declared = (style, prop) => style.getPropertyValue(prop);
  // --- cascade emulation for UA pseudo-elements that getComputedStyle cannot read
  const EMU_PROPS = ['appearance', '-webkit-appearance', 'width', 'height', 'margin-top', 'border-top-width', 'border-top-style', 'border-top-color', 'border-top-left-radius', 'background-color', 'background-image', 'box-shadow'];
  const emuPseudo = (el, pseudo) => {
    const best = {};
    for (const p of prepared) {
      if (p.pseudo !== pseudo) continue;
      if (!safeMatches(el, p.base)) continue;
      const rule = p.f.r; const sp = specOf(p);
      for (const prop of EMU_PROPS) {
        const v = rule.style.getPropertyValue(prop); if (!v) continue;
        const imp = rule.style.getPropertyPriority(prop) === 'important' ? 1 : 0;
        const key = [imp, p.f.ctx.layered ? 0 : 1, sp[0], sp[1], sp[2], p.f.order];
        const cur = best[prop];
        if (!cur || cmp(key, cur.key) > 0) best[prop] = {v, key, sel: p.sel, section: p.f.ctx.section};
      }
    }
    const res = {}; for (const k of Object.keys(best)) res[k] = best[k].v; return res;
  };
  const cmp = (a, b) => { for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) return a[i] - b[i]; } return 0; };
  const fp = (el, props) => { const s = getComputedStyle(el); const r = {}; for (const p of props) r[p] = s[p]; const b = el.getBoundingClientRect(); r.__w = Math.round(b.width * 100) / 100; r.__h = Math.round(b.height * 100) / 100; return r; };
  const pseudoFp = (el, ps, props) => { const s = getComputedStyle(el, ps); if (s.content === 'none' || s.content === 'normal' || s.display === 'none') return null; const r = {content: s.content}; for (const p of props) r[p] = s[p]; return r; };

  for (const inst of INSTANCES) {
    const cell = document.querySelector(`[data-cell="${inst.aid}"]`);
    const cellOut = {parts: {}, rules: {}};
    out.cells[inst.aid] = cellOut;
    for (const part of inst.parts) {
      const el = cell.querySelector(`[data-apart="${part.name}"]`);
      if (!el) { cellOut.parts[part.name] = {missing: true}; continue; }
      const entry = {fp: fp(el, PROPS), pseudos: {}, emu: {}};
      for (const ps of part.pseudos || []) entry.pseudos[ps] = pseudoFp(el, ps, PROPS);
      for (const ps of part.emu || []) entry.emu[ps] = emuPseudo(el, ps);
      if (part.focus) {
        const prev = document.activeElement; if (!('keyboardPrimed' in window)) { window.keyboardPrimed = true; document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab', bubbles: true})); }
        el.focus({preventScroll: true});
        entry.focusVisible = el.matches(':focus-visible');
        entry.focus = fp(el, POSES.focusProps);
        el.blur(); if (prev && prev.focus) { }
      }
      cellOut.parts[part.name] = entry;
      // --- rule matching (HIT / EXCLUDED) for rules whose selector hints at this primitive
      const hre = hintRe(inst.hint);
      const hit = [], excl = [];
      for (const p of prepared) {
        if (!p.f.ctx.theme) continue;
        if (!hre.test(p.sel)) continue;
        const nowMatch = safeMatches(el, p.base);
        if (nowMatch) { hit.push({sel: p.sel.slice(0, 260), section: p.f.ctx.section, pseudo: p.pseudo, dyn: p.dyn}); continue; }
        if (p.clauses.length && safeMatches(el, p.core)) {
          const culprits = p.clauses.filter(c => { try { return el.matches(c); } catch { return false; } });
          if (culprits.length) excl.push({sel: p.sel.slice(0, 260), section: p.f.ctx.section, pseudo: p.pseudo, dyn: p.dyn, culprit: culprits.map(c => c.slice(0, 120))});
        }
      }
      cellOut.rules[part.name] = {hit, excl};
    }
  }
  // --- liveness of every `:not(<clause>)` context-exclusion clause: in which fixture scenes does it match anything?
  const live = {};
  for (const p of prepared) for (const c of p.clauses) {
    if (!p.f.ctx.theme) continue;
    const e = live[c] || (live[c] = {rules: 0, scenes: new Set(), sections: new Set()});
    e.rules++; e.sections.add(p.f.ctx.section);
  }
  for (const [c, e] of Object.entries(live)) {
    let n = 0; try { for (const el of document.querySelectorAll(c)) { n++; const sc = el.closest('[data-ctx]'); if (sc) e.scenes.add(sc.getAttribute('data-ctx')); } } catch { e.invalid = true; }
    e.matches = n; e.scenes = [...e.scenes]; e.sections = [...e.sections];
  }
  out.clauseLiveness = live;
  return out;
};

// ---------- run browser ----------
const {chromium} = await import(PW);
const browser = await chromium.launch({headless: true});
const PROPS = ['display', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'borderBottomWidth', 'backgroundColor', 'backgroundImage', 'color', 'boxShadow', 'appearance', 'clipPath', 'fontFamily', 'textTransform', 'cursor', 'accentColor', 'outlineStyle', 'outlineWidth', 'outlineColor', 'outlineOffset', 'textShadow', 'filter', 'imageRendering'];
const FOCUS_PROPS = ['outlineStyle', 'outlineWidth', 'outlineColor', 'outlineOffset', 'boxShadow', 'borderTopColor'];
const results = {};
try {
  for (const withTheme of [false, true]) {
    const page = await browser.newPage({viewport: {width: 1200, height: 900}, deviceScaleFactor: 1});
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.setContent(buildPage(withTheme), {waitUntil: 'load'});
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const cfgInstances = instances.map(i => ({aid: i.aid, hint: PRIMS.find(p => p.id === i.prim).hint, parts: i.v.parts}));
    const res = await page.evaluate(`(${PAGE_FN.toString()})(${JSON.stringify({INSTANCES: cfgInstances, PROPS, POSES: {focusProps: FOCUS_PROPS}})})`);
    results[withTheme ? 'themed' : 'base'] = res;
    if (errs.length) console.error('page errors', errs);
    if (withTheme && !flag('no-shots')) {
      for (const p of prims) {
        const el = page.locator(`[data-prim-block="${p.id}"]`);
        const dsf = p.shotScale || 1;
        const b = await el.boundingBox();
        if (!b) continue;
        await page.setViewportSize({width: 1200, height: Math.min(8000, Math.ceil(b.height + b.y + 40))});
        await el.screenshot({path: path.join(here, 'shots', `${p.id}${suffix}.png`)});
      }
    }
    await page.close();
  }
} finally { await browser.close(); }

// ---------- analysis ----------
const shapeOf = p => new Set(p.shapeProps);
const diffKeys = (a, b, keys) => keys.filter(k => (a?.[k] ?? null) !== (b?.[k] ?? null));
const rows = [];       // per cell
for (const inst of instances) {
  const p = PRIMS.find(x => x.id === inst.prim);
  const base = results.base.cells[inst.aid], th = results.themed.cells[inst.aid];
  rows.push({inst, p, base, th});
}
const byGroup = new Map();
for (const r of rows) { const k = `${r.inst.prim}|${r.inst.ctx}`; if (!byGroup.has(k)) byGroup.set(k, []); byGroup.get(k).push(r); }

// themed-property set T for a primitive part: shape props that canonical changes vs no-theme baseline
function shapeFp(entry, part) {
  // flatten shape props of host fp, ::pseudo fps and emulated pseudo declarations into a single dictionary
  const d = {};
  const f = entry.fp || {};
  for (const k of part.shape || []) d[k] = f[k] ?? null;
  for (const [ps, v] of Object.entries(entry.pseudos || {})) for (const k of part.pseudoShape || []) d[`${ps}.${k}`] = v ? v[k] : '(none)';
  // emulated UA pseudo: an undeclared radius equals the UA default 0, so `border-radius:0` is not a themed difference
  for (const [ps, v] of Object.entries(entry.emu || {})) for (const k of Object.keys(v)) { if (/radius$/.test(k) && /^0(px)?$/.test(v[k])) continue; d[`${ps}.${k}`] = v[k]; }
  return d;
}
function fullFp(entry) {
  const d = {};
  for (const [k, v] of Object.entries(entry.fp || {})) if (!k.startsWith('__')) d[k] = v;
  for (const [ps, v] of Object.entries(entry.pseudos || {})) if (v) for (const [k, x] of Object.entries(v)) d[`${ps}.${k}`] = x;
  for (const [ps, v] of Object.entries(entry.emu || {})) for (const [k, x] of Object.entries(v)) { if (/radius$/.test(k) && /^0(px)?$/.test(x)) continue; d[`${ps}.${k}`] = x; }
  if (entry.focus) for (const [k, x] of Object.entries(entry.focus)) d[`:focus.${k}`] = x;
  return d;
}
const matrix = {}, details = [];
for (const p of prims) {
  matrix[p.id] = {};
  // canonical per instance-group index within canonical ctx: use first instance of each sig-variant tag
  const canonCtx = p.canonical || 'main-content';
  const canonRows = byGroup.get(`${p.id}|${canonCtx}`) || [];
  // does the theme restyle this primitive's shape at all (canonical themed cell vs no-theme baseline)?
  let canonChangedCount = 0;
  for (const c of canonRows) for (const part of c.inst.v.parts) {
    const t = c.th.parts[part.name], b = c.base.parts[part.name]; if (!t || !b || t.missing) continue;
    const st = shapeFp(t, part), sb = shapeFp(b, part);
    canonChangedCount += Object.keys({...st, ...sb}).filter(k => (st[k] ?? null) !== (sb[k] ?? null)).length;
  }
  p.__canonChanged = canonChangedCount;
  for (const ctxId of CTX_ORDER) {
    const grp = byGroup.get(`${p.id}|${ctxId}`) || [];
    const used = grp.some(r => r.inst.used);
    const cell = {status: '–', used, notes: [], instances: []};
    let worst = 0; // 0 ok,1 diff,2 gap
    for (const r of grp) {
      const parts = r.inst.v.parts;
      const instOut = {aid: r.inst.aid, variant: r.inst.v.tag || '', sig: r.inst.sig, sites: r.inst.sites, parts: {}, rules: {}};
      // canonical counterpart: same variant tag, matching sig-variant if present else first
      const canon = canonRows.find(c => (c.inst.v.tag || '') === (r.inst.v.tag || '') && c.inst.sig === r.inst.sig) || canonRows.find(c => (c.inst.v.tag || '') === (r.inst.v.tag || ''));
      let gap = false, partial = false, differs = [], geo = [];
      for (const part of parts) {
        const b = r.base.parts[part.name], t = r.th.parts[part.name], cn = canon?.th.parts[part.name], cb = canon?.base.parts[part.name];
        if (!b || !t || b.missing || t.missing) continue;
        const sb = shapeFp(b, part), st = shapeFp(t, part);
        const scT = cn ? shapeFp(cn, part) : null, scB = cb ? shapeFp(cb, part) : null;
        // T = keys the canonical themed cell changed relative to ITS no-theme baseline
        const T = scT ? Object.keys({...scT, ...scB}).filter(k => (scT[k] ?? null) !== (scB[k] ?? null)) : [];
        const unchanged = T.filter(k => (st[k] ?? null) === (sb[k] ?? null));
        const changed = T.filter(k => (st[k] ?? null) !== (sb[k] ?? null));
        const notEqCanon = changed.filter(k => (st[k] ?? null) !== (scT[k] ?? null));
        // primary = what makes the pixel look (corner cut / UA-control repaint). Secondary keys (box-shadow, border style …)
        // are reported but never decide ✓/✗, because several contexts own their own bevel/palette on purpose.
        const prim = new RegExp(part.primary || '(radius|clip-?path|slider|progress|::)', 'i');
        const Tp = T.filter(k => prim.test(k)), changedP = Tp.filter(k => changed.includes(k));
        let state = 'themed';
        if (Tp.length) { if (!changedP.length) state = 'unthemed'; else if (changedP.length < Tp.length) state = 'partial'; }
        else if (T.length && !changed.length) state = 'unthemed';
        const unchangedP = Tp.filter(k => !changedP.includes(k));
        const secondaryUnchanged = unchanged.filter(k => !prim.test(k));
        // focus ring
        let focusNote = null;
        if (part.focus && t.focus && b.focus && cn?.focus && cb?.focus) {
          const fT = diffKeys(cn.focus, cb.focus, FOCUS_PROPS), fChanged = diffKeys(t.focus, b.focus, FOCUS_PROPS);
          if (fT.length && !fChanged.length) { state = state === 'themed' ? 'partial' : state; focusNote = `focus ring unthemed (canonical changes ${fT.join(',')})`; }
        }
        // geometry: themed vs no-theme baseline of the very same cell
        const dw = (t.fp.__w - b.fp.__w), dh = (t.fp.__h - b.fp.__h);
        if (Math.abs(dw) > 2 || Math.abs(dh) > 2) geo.push(`${part.name}: ${b.fp.__w}x${b.fp.__h} → ${t.fp.__w}x${t.fp.__h}`);
        const fullT = fullFp(t), fullC = cn ? fullFp(cn) : {};
        const eqCanonFull = Object.keys({...fullT, ...fullC}).filter(k => (fullT[k] ?? null) !== (fullC[k] ?? null));
        instOut.parts[part.name] = {state, changedShape: changed, unchangedShape: unchangedP, secondaryUnchanged, shapeDiffersFromCanonical: notEqCanon, allDiffFromCanonical: eqCanonFull, focusNote, geometry: {dw, dh}};
        if (part.gate !== false && (state === 'unthemed' || state === 'partial')) { gap = true; if (state === 'partial') partial = true; }
        if (notEqCanon.length) differs.push(`${part.name}: ${notEqCanon.slice(0, 6).join(', ')}`);
      }
      const rules = {};
      for (const part of parts) { const rr = r.th.rules[part.name]; if (rr) rules[part.name] = {hit: rr.hit.length, excluded: rr.excl.length, hitSample: rr.hit.slice(0, 6), exclSample: rr.excl.slice(0, 6), gapStatic: rr.excl.length > 0 && rr.hit.length === 0}; }
      instOut.rules = rules;
      instOut.verdict = gap ? (partial ? 'partial' : 'gap') : 'ok';
      instOut.differsFromCanonical = differs;
      instOut.geometry = geo;
      cell.instances.push(instOut);
      worst = Math.max(worst, gap ? 2 : (differs.length ? 1 : 0));
      if (geo.length) cell.notes.push(`geometry>2px: ${geo.join('; ')}`);
    }
    if (!used) {
      cell.status = '–';
      cell.latent = worst === 2;
    } else cell.status = worst === 2 ? '✗' : (p.__canonChanged ? '✓' : '○');
    cell.diffs = [...new Set(cell.instances.flatMap(i => i.differsFromCanonical))];
    cell.gapSites = used && worst === 2 ? [...new Set(cell.instances.filter(i => i.verdict !== 'ok').flatMap(i => i.sites))] : [];
    matrix[p.id][ctxId] = cell;
  }
}

// ---------- output ----------
const autoFix = (p, ctxId, exclHints, owned) => {
  const sel = CONTEXTS[ctxId]?.sel || ctxId;
  if (exclHints.length) {
    const m = exclHints[0].match(/^([\w-]+): (.*?) ⟵ excluded by (.*)$/);
    return `${m ? m[1] : 'form-controls/r10'} 里对「${p.id}」的规则被 \`:not(${m ? m[3] : ''})\` 在 ${ctxId} 排除，且无替代规则 → 在该上下文补一条同形替代规则（选择器以 \`${sel}\` 起头，只改外观、不碰宽高/命中区），或把排除子句改成只排除已有专用皮肤的子树。`;
  }
  return `主题里没有任何规则命中 ${ctxId} 的「${p.id}」→ 在 ${ctxId} 范围新增对应规则（\`${sel} ${p.hint}\` 相关选择器）。`;
};
const gapList = [];
for (const p of prims) for (const ctxId of CTX_ORDER) {
  const c = matrix[p.id][ctxId];
  if (c.status === '✗' || c.latent) {
    const bad = c.instances.filter(i => i.verdict !== 'ok');
    const why = [...new Set(bad.flatMap(i => Object.entries(i.parts).filter(([, v]) => v.state !== 'themed').map(([n, v]) => `${n}:${v.state}${v.unchangedShape.length ? ' (unchanged ' + v.unchangedShape.slice(0, 4).join(',') + ')' : ''}${v.focusNote ? ' ' + v.focusNote : ''}`)))];
    const exclHints = [...new Set(bad.flatMap(i => Object.values(i.rules).flatMap(r => r.exclSample.map(e => `${e.section}: ${e.sel.slice(0, 110)} ⟵ excluded by ${e.culprit.join(' | ')}`))))].slice(0, 3);
    const ownedBy = [...new Set(bad.flatMap(i => Object.values(i.rules).flatMap(r => r.hitSample.map(h => h.section))))];
    gapList.push({primitive: p.id, context: ctxId, latent: c.status !== '✗', sites: c.gapSites.length ? c.gapSites : (sitesByPrim[p.id].filter(s => s.ctx === ctxId).map(s => `${s.file}:${s.line}`)), why, exclHints, hitSections: ownedBy, fix: p.fixHint?.(ctxId, c) || autoFix(p, ctxId, exclHints, ownedBy)});
  }
}
const sevOrder = g => (g.latent ? 3 : (['main-content', 'entity-dialog', 'dialog', 'popover', 'side-panel', 'settings-vertical-tabs'].includes(g.context) ? 0 : 1));
gapList.sort((a, b) => sevOrder(a) - sevOrder(b));

const json = {
  generatedFrom: {src: SRC, theme: themePath, tag: tag || 'current', revertR8Slider: flag('revert-r8-slider'), appCss: appCssFiles, sections: sections.map(s => s.name), ruleCount: results.themed.ruleCount},
  contexts: CTX_ORDER,
  scanStats: {files: scan.fileCount, sites: scan.sites.length},
  matrix: Object.fromEntries(prims.map(p => [p.id, Object.fromEntries(CTX_ORDER.map(c => [c, {status: matrix[p.id][c].status, latent: !!matrix[p.id][c].latent, used: matrix[p.id][c].used, siteCount: sitesByPrim[p.id].filter(s => s.ctx === c).length, gapSiteCount: matrix[p.id][c].gapSites.length, diffsFromCanonical: matrix[p.id][c].diffs, notes: matrix[p.id][c].notes}]))])),
  gaps: gapList,
  primitivesWithoutShapeTheme: prims.filter(p => !p.__canonChanged).map(p => p.id),
  exclusionClauseLiveness: results.themed.clauseLiveness,
  cells: Object.fromEntries(prims.map(p => [p.id, Object.fromEntries(CTX_ORDER.map(c => [c, matrix[p.id][c].instances]))])),
  sites: Object.fromEntries(prims.map(p => [p.id, sitesByPrim[p.id].map(s => ({loc: `${s.file}:${s.line}`, ctx: s.ctx, ctxWhy: s.ctxWhy, summary: s.summary}))]))
};
await fs.writeFile(path.join(here, `table${suffix}.json`), JSON.stringify(json, null, 2) + '\n');

const L = [];
L.push(`# 元素 × 上下文 样式覆盖矩阵${tag ? ` (${tag})` : ''}`);
L.push('');
L.push(`> 生成：\`audit.mjs\`；源码 \`${SRC}\`（${scan.fileCount} 个文件，${scan.sites.length} 处原语使用点）；主题 \`${themePath}\`${flag('revert-r8-slider') ? '（--revert-r8-slider：user-dialog-r8 滑条选择器还原为修复前窄链）' : ''}；${results.themed.ruleCount} 条 CSS 规则。`);
L.push('> ✓ 已主题（所有使用点的“形状属性”均相对无主题基线变化，且变化集合覆盖规范主题实例）  ✗ 缝隙（使用点上未主题化/部分主题化）  – 该上下文无使用点（`–†` = 无使用点但夹具里同样未主题化，潜在缝隙）');
L.push('');
L.push('| 原语 \\ 上下文 | ' + CTX_ORDER.map(c => c).join(' | ') + ' |');
L.push('|' + Array(CTX_ORDER.length + 1).fill('---').join('|') + '|');
for (const p of prims) {
  L.push(`| ${p.id} | ` + CTX_ORDER.map(c => { const x = matrix[p.id][c]; const n = sitesByPrim[p.id].filter(s => s.ctx === c).length; return x.status === '–' ? (x.latent ? '–†' : '–') : (x.status === '✗' ? `✗ ${x.gapSites.length}/${n}` : `${x.status}${n ? ` (${n})` : ''}${x.diffs.length ? ' ≠规范' : ''}`); }).join(' | ') + ' |');
}
L.push('');
L.push('括号内为静态扫描到的使用点数（`✗ a/b` = b 个使用点中 a 个有缝隙）；`≠规范` = 已主题化但与规范实例有属性差异（多为专用调色板/斜面变体，详见 table.json）；`○` = 主题对该原语的形状完全没有任何规则（全局未覆盖）。');
L.push('');
L.push('## 缝隙清单（按严重度）');
L.push('');
const real = gapList.filter(g => !g.latent), latent = gapList.filter(g => g.latent);
if (!real.length) L.push('（已有使用点的上下文中没有 ✗）\n');
for (const g of real) {
  L.push(`### ✗ ${g.primitive} × ${g.context}`);
  L.push(`- 使用点：${g.sites.length ? g.sites.slice(0, 12).map(s => '`' + s + '`').join(', ') + (g.sites.length > 12 ? ` …共 ${g.sites.length} 处` : '') : '（无）'}`);
  L.push(`- 现象：${g.why.join('；') || '—'}`);
  if (g.exclHints.length) L.push(`- 被排除：${g.exclHints.map(h => '`' + h + '`').join('；')}`);
  if (g.hitSections.length) L.push(`- 仍命中的规则所在段：${g.hitSections.join(', ')}`);
  L.push(`- 建议：${g.fix || '—'}`);
  L.push('');
}
const noShape = json.primitivesWithoutShapeTheme;
if (noShape.length) {
  L.push('### ○ 主题完全未覆盖的原语');
  for (const id of noShape) L.push(`- ${id}：使用点 ${sitesByPrim[id].slice(0, 6).map(s => '`' + s.file + ':' + s.line + '`').join(', ')}${sitesByPrim[id].length > 6 ? ' …' : ''}；建议新增形状规则（方角/像素边框/焦点框），并同步放进 form-controls-r9 的排除/替代链检查。`);
  L.push('');
}
L.push('### 潜在缝隙（该上下文今天无使用点，夹具里同样未主题化；未来出现使用点即成 ✗）');
L.push('');
if (!latent.length) L.push('（无）');
const byPrim = {};
for (const g of latent) (byPrim[g.primitive] ||= []).push(g);
for (const [id, gs] of Object.entries(byPrim)) L.push(`- ${id}：${gs.map(g => g.context).join('、')}（${[...new Set(gs.flatMap(g => g.exclHints.map(h => h.split(': ')[0])))].join('/') || '无规则'} 的 :not(…*) 排除，无替代规则）`);
L.push('');
L.push('## 排除子句有效性（`:not(<clause>)` 在夹具各场景中是否真能命中）');
L.push('');
L.push('| 子句 | 涉及规则数 | 所在段 | 夹具命中场景 |');
L.push('|---|---|---|---|');
for (const [c, e] of Object.entries(json.exclusionClauseLiveness || {}).sort((a, b) => a[1].matches - b[1].matches)) L.push(`| \`${c.replace(/\|/g, '\\|').slice(0, 130)}\` | ${e.rules} | ${e.sections.join(', ')} | ${e.matches ? e.scenes.join(', ') : (/tabs-list/.test(c) ? '**无 —— 夹具已按真实 DOM 构造该场景（scaffold > Tabs root > TabsList.w-44），仍不命中：`>` 直接子代写法使该子句在真实 DOM 下永不生效**' : '夹具未构造该场景（需另行确认）')} |`);
L.push('');
L.push('## 使用点（静态扫描）');
L.push('');
for (const p of prims) {
  L.push(`### ${p.id}`);
  const ss = sitesByPrim[p.id];
  if (!ss.length) { L.push('（无使用点）'); L.push(''); continue; }
  L.push('| file:line | 上下文(推断) | class/prop 摘要 |');
  L.push('|---|---|---|');
  for (const s of ss.slice(0, 80)) L.push(`| \`${s.file}:${s.line}\` | ${s.ctx}${s.ctxWhy ? ' ← ' + s.ctxWhy : ''} | ${String(s.summary).replace(/\|/g, '\\|')} |`);
  if (ss.length > 80) L.push(`| … | | 共 ${ss.length} 处，其余见 table.json |`);
  L.push('');
}
await fs.writeFile(path.join(here, `table${suffix}.md`), L.join('\n') + '\n');
console.log(L.slice(0, 6 + prims.length + 4).join('\n'));
console.log(`\nwrote table${suffix}.md / table${suffix}.json (${gapList.length} gap entries)`);
