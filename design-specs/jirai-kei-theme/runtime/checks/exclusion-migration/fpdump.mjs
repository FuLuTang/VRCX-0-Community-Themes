/* Full computed-style fingerprint of every element of the fixture (all primitive variants x 13 contexts + extras).
 *   node fpdump.mjs --theme <theme.css> --out <fp.json> [--shots <dir>]
 * Per element: all computed longhands, ::before/::after (if generated), emulated -webkit-slider-* declarations,
 * :focus-visible delta (outline/box-shadow/border/background). Animations/transitions are neutralised AFTER their own
 * longhands were read, so animated values can't cause noise. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {buildFixture, splitSections, loadAppCss, buildPage} from './fixture.mjs';
const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const THEME = opt('theme'), OUT = opt('out');
const PW = process.env.AUDIT_PLAYWRIGHT || '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/tmp/dsh-theme-browsers';
process.env.TMPDIR ||= '/tmp/exclusion-migration/browser-tmp';
await fs.mkdir(process.env.TMPDIR, {recursive: true});

const fixture = await buildFixture();
const sections = splitSections(await fs.readFile(THEME, 'utf8'));
const html = buildPage({fixture, sections, appCss: await loadAppCss(), withTheme: !argv.includes('--no-theme')});
const {chromium} = await import(PW);
const browser = await chromium.launch({headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox']});
const page = await browser.newPage({viewport: {width: 1200, height: 900}});
await page.setContent(html, {waitUntil: 'load'});
await page.evaluate(() => document.fonts && document.fonts.ready);
const data = await page.evaluate(() => {
  const MOTION = /^(animation|transition)/;
  const out = {};
  const els = []; document.querySelectorAll('[data-scene]').forEach(sc => sc.querySelectorAll('*').forEach(e => { if (!e.__fp) { e.__fp = 1; els.push([sc.getAttribute('data-scene'), e]); } }));
  const keyOf = (e) => { const cell = e.closest('[data-cell]'); if (!cell) return null; const idx = e === cell ? -1 : [...cell.querySelectorAll('*')].indexOf(e); return cell.getAttribute('data-cell') + '|' + idx; };
  const motion = new Map();
  for (const [, e] of els) { const cs = getComputedStyle(e); const m = {}; for (let i = 0; i < cs.length; i++) { const p = cs[i]; if (MOTION.test(p)) m[p] = cs.getPropertyValue(p); } motion.set(e, m); }
  const st = document.createElement('style'); st.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}'; document.head.appendChild(st);
  // --- cascade emulation for -webkit-slider-* (getComputedStyle cannot read UA pseudo-elements)
  const flat = []; let order = 0;
  const walk = (rules, sec) => { for (const r of rules) { const cn = r.constructor.name; if (cn === 'CSSStyleRule') flat.push({r, sec, order: order++}); else if (cn === 'CSSMediaRule') { try { if (matchMedia(r.media.mediaText).matches) walk(r.cssRules, sec); } catch {} } else if (r.cssRules && cn !== 'CSSKeyframesRule' && cn !== 'CSSFontFaceRule') walk(r.cssRules, sec); } };
  for (const sh of document.styleSheets) { const n = sh.ownerNode; if (n && !n.hasAttribute('data-audit')) walk(sh.cssRules, n.getAttribute('data-section') || '?'); }
  const splitTop = s => { const res = []; let d = 0, q = null, cur = ''; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { cur += c; if (c === q && s[i - 1] !== '\\') q = null; continue; } if (c === '"' || c === "'") { q = c; cur += c; continue; } if (c === '(' || c === '[') d++; if (c === ')' || c === ']') d--; if (c === ',' && d === 0) { res.push(cur.trim()); cur = ''; } else cur += c; } if (cur.trim()) res.push(cur.trim()); return res; };
  const spec = sel => { let a = 0, b = 0, c = 0, i = 0; const rp = j => { let d = 0, k = j; for (; k < sel.length; k++) { if (sel[k] === '(') d++; if (sel[k] === ')') { d--; if (d === 0) break; } } return k; }; const mx = arg => { let best = [0, 0, 0]; for (const s of splitTop(arg)) { const x = spec(s); if (x[0] > best[0] || (x[0] === best[0] && (x[1] > best[1] || (x[1] === best[1] && x[2] > best[2])))) best = x; } return best; };
    while (i < sel.length) { const ch = sel[i];
      if (ch === '#') { a++; i++; while (i < sel.length && /[\w-]/.test(sel[i])) i++; }
      else if (ch === '.') { b++; i++; while (i < sel.length && /[\w-]/.test(sel[i])) i++; }
      else if (ch === '[') { b++; let q = null; i++; while (i < sel.length && !(sel[i] === ']' && !q)) { if (q) { if (sel[i] === q) q = null; } else if (sel[i] === '"' || sel[i] === "'") q = sel[i]; i++; } i++; }
      else if (ch === ':') { if (sel[i + 1] === ':') { c++; i += 2; while (i < sel.length && /[\w-]/.test(sel[i])) i++; if (sel[i] === '(') i = rp(i) + 1; continue; } let j = i + 1; while (j < sel.length && /[\w-]/.test(sel[j])) j++; const name = sel.slice(i + 1, j).toLowerCase(); if (sel[j] === '(') { const k = rp(j); const arg = sel.slice(j + 1, k); if (name === 'where') {} else if (['not', 'is', 'matches', 'has'].includes(name)) { const m = mx(arg); a += m[0]; b += m[1]; c += m[2]; } else b++; i = k + 1; } else { b++; i = j; } }
      else if (/[a-zA-Z]/.test(ch)) { c++; i++; while (i < sel.length && /[\w-]/.test(sel[i])) i++; } else i++; }
    return [a, b, c]; };
  const PS = /::(-webkit-slider-thumb|-webkit-slider-runnable-track)\s*$/;
  const prepared = [];
  for (const f of flat) for (const s of splitTop(f.r.selectorText)) { const m = s.match(PS); if (m) prepared.push({f, base: s.slice(0, m.index), pseudo: m[1], spec: spec(s.replace(PS, '::x')), sel: s}); }
  const EMU = ['appearance', '-webkit-appearance', 'width', 'height', 'margin-top', 'border-top-width', 'border-top-style', 'border-top-color', 'border-top-left-radius', 'background-color', 'background-image', 'box-shadow'];
  const cmp = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };
  const emu = (el, pseudo) => { const best = {}; for (const p of prepared) { if (p.pseudo !== pseudo) continue; let ok = false; try { ok = el.matches(p.base); } catch {} if (!ok) continue; for (const prop of EMU) { const v = p.f.r.style.getPropertyValue(prop); if (!v) continue; const imp = p.f.r.style.getPropertyPriority(prop) === 'important' ? 1 : 0; const key = [imp, p.spec[0], p.spec[1], p.spec[2], p.f.order]; if (!best[prop] || cmp(key, best[prop].key) > 0) best[prop] = {v, key}; } } const r = {}; for (const k of Object.keys(best)) r[k] = best[k].v; return r; };
  const FOCUS = ['outline-style', 'outline-width', 'outline-color', 'outline-offset', 'box-shadow', 'border-top-color', 'background-color', 'border-top-left-radius'];
  let primed = false;
  const focusable = e => /^(button|input|select|textarea|a)$/i.test(e.tagName) || e.getAttribute('role') === 'checkbox' || e.getAttribute('role') === 'radio' || e.hasAttribute('tabindex');
  for (const [scene, e] of els) {
    const key = keyOf(e) || ('ctx:' + scene + '|' + els.indexOf([scene, e])); if (!keyOf(e)) continue;
    const cs = getComputedStyle(e); const rec = {p: {}, pe: {}, emu: {}, focus: null, scene};
    for (let i = 0; i < cs.length; i++) { const p = cs[i]; if (MOTION.test(p)) continue; rec.p[p] = cs.getPropertyValue(p); }
    Object.assign(rec.p, motion.get(e));
    for (const ps of ['::before', '::after']) { const c = getComputedStyle(e, ps); if (c.content && c.content !== 'none' && c.content !== 'normal') { const o = {}; for (let i = 0; i < c.length; i++) { const p = c[i]; if (!MOTION.test(p)) o[p] = c.getPropertyValue(p); } rec.pe[ps] = o; } }
    if (e.tagName === 'INPUT' && e.type === 'range') { rec.emu['-webkit-slider-thumb'] = emu(e, '-webkit-slider-thumb'); rec.emu['-webkit-slider-runnable-track'] = emu(e, '-webkit-slider-runnable-track'); }
    if (e.tagName === 'INPUT' && e.type === 'time') { }
    const ph = (e.tagName === 'INPUT' || e.tagName === 'TEXTAREA'); if (ph) { const c = getComputedStyle(e, '::placeholder'); rec.pe['::placeholder'] = {color: c.color, opacity: c.opacity}; }
    if (focusable(e) && !e.disabled) {
      if (!primed) { primed = true; document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab', bubbles: true})); }
      try { e.focus({preventScroll: true}); if (e.matches(':focus-visible')) { const f = getComputedStyle(e); rec.focus = {}; for (const p of FOCUS) rec.focus[p] = f.getPropertyValue(p); } e.blur(); } catch {}
    }
    out[key] = rec;
  }
  return out;
});
const meta = {theme: THEME, cells: fixture.cells.map(c => ({aid: c.aid, prim: c.prim, ctx: c.ctx, used: c.used, kind: c.kind}))};
await fs.mkdir(path.dirname(OUT), {recursive: true});
await fs.writeFile(OUT, JSON.stringify({meta, data}));
console.log('elements', Object.keys(data).length, '->', OUT);
if (opt('shots')) {
  await fs.mkdir(opt('shots'), {recursive: true});
  for (const blk of await page.$$('[data-prim-block]')) { const n = (await blk.getAttribute('data-prim-block')).replace(/[^\w-]/g, '_'); await blk.screenshot({path: path.join(opt('shots'), n + '.png')}).catch(() => {}); }
}
await browser.close();
