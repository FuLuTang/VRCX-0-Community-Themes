// Shared helpers for the theme convergence tools. Import only; not a CLI.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

export const TOOLS = path.dirname(fileURLToPath(import.meta.url));
export const JK = path.dirname(TOOLS);
export const REPO = path.resolve(JK, '../..');
export const RUNTIME = path.join(JK, 'runtime');
export const BASELINE = path.join(JK, 'baseline');
export const APP = process.env.VRCX_APP || '/home/fulutang/Documents/Github/VRCX-0-jirai';
export const DEFAULT_THEME = path.join(RUNTIME, 'preview-package/jirai-kei-theme/theme.css');
export const LIMIT = 1048576;
export const toolRequire = createRequire(path.join(TOOLS, 'package.json'));

// ---------- CLI ----------
// spec: {usage, options: {'--name': {arg?: 'VALUE', desc, default?, repeat?}}}
export function cli(spec, argv = process.argv.slice(2)) {
  const help = () => {
    const lines = [spec.usage, ''];
    for (const [k, o] of Object.entries(spec.options || {})) lines.push(`  ${(k + (o.arg ? ' ' + o.arg : '')).padEnd(30)} ${o.desc}${o.default !== undefined ? `（默认 ${o.default}）` : ''}`);
    return lines.join('\n');
  };
  const opts = {}, rest = [];
  for (const [k, o] of Object.entries(spec.options || {})) if (o.default !== undefined) opts[k.slice(2)] = o.default;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { console.log(help()); process.exit(0); }
    if (!a.startsWith('--')) { rest.push(a); continue; }
    const o = spec.options?.[a];
    if (!o) { console.error(`未知参数 ${a}\n\n${help()}`); process.exit(2); }
    const key = a.slice(2);
    if (!o.arg) { opts[key] = true; continue; }
    const v = argv[++i];
    if (v === undefined) { console.error(`${a} 需要参数 ${o.arg}`); process.exit(2); }
    if (o.repeat) (opts[key] = Array.isArray(opts[key]) ? opts[key] : []).push(v); else opts[key] = v;
  }
  return {opts, rest, help};
}
export function die(msg, code = 2) { console.error(msg); process.exit(code); }

// ---------- files / hashing ----------
export const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
export const mkTmp = (prefix = 'jk-tool-') => fs.mkdtempSync(path.join(os.tmpdir(), prefix));
export const fmtBytes = (n) => `${n.toLocaleString('en-US')} B`;
export const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

// ---------- theme build ----------
// Builds the theme from a repository root (the live repo or an extracted git ref) into `out`.
// Never touches the source tree: JIRAI_OUT redirects every artifact, including build-report.json.
export function buildTheme(out, root = REPO) {
  fs.mkdirSync(out, {recursive: true});
  const script = path.join(root, 'design-specs/jirai-kei-theme/runtime/build-runtime.mjs');
  const env = {...process.env, JIRAI_OUT: out, SHARP_MODULE: path.join(TOOLS, 'node_modules/sharp')};
  const r = spawnSync(process.execPath, [script], {cwd: root, env, encoding: 'utf8', maxBuffer: 64 << 20});
  fs.writeFileSync(path.join(out, 'build.log'), (r.stdout || '') + (r.stderr || ''));
  if (r.status !== 0) throw new Error(`构建失败（${root}）：\n${(r.stderr || r.stdout || '').slice(-2000)}`);
  const css = fs.readFileSync(path.join(out, 'theme.css'));
  return {dir: out, cssPath: path.join(out, 'theme.css'), bytes: css.length, sha256: sha256(css)};
}

// Extracts the files a build needs from a git ref into a temp root (worktree untouched).
export function exportGitRef(ref, dest = mkTmp('jk-ref-')) {
  const paths = ['design-specs/jirai-kei-theme/runtime', 'design-specs/jirai-kei-theme/original-assets', 'design-specs/jirai-kei-theme/fonts', 'design-specs/jirai-kei-theme/mockups', 'themes/jirai-kei-theme'];
  const list = spawnSync('git', ['ls-tree', '-r', '--name-only', ref, '--', ...paths], {cwd: REPO, encoding: 'utf8', maxBuffer: 64 << 20});
  if (list.status !== 0) throw new Error(`git ls-tree 失败：${list.stderr}`);
  const files = list.stdout.split('\n');
  const existing = paths.filter((p) => files.some((f) => f.startsWith(p + '/')));
  const r = spawnSync('bash', ['-c', 'git archive --format=tar "$0" -- "$@" | tar -x -C "$DEST"', ref, ...existing], {cwd: REPO, env: {...process.env, DEST: dest}, encoding: 'utf8'});
  if (r.status !== 0) throw new Error(`git archive 失败：${r.stderr}`);
  return dest;
}

// Splits a built theme into its `/* SECTION name */` parts with offsets and 1-based lines.
export function sections(css) {
  const out = [], re = /^\/\* SECTION (.+?) \*\/$/gm;
  let m;
  while ((m = re.exec(css))) out.push({name: m[1], offset: m.index, bodyOffset: m.index + m[0].length + 1, line: css.slice(0, m.index).split('\n').length});
  return out;
}
export function sectionAt(secs, offset) {
  let s = null;
  for (const x of secs) { if (x.offset <= offset) s = x; else break; }
  return s;
}
// Maps a SECTION name to its source file (relative to the theme dir) using runtime/parts.json.
export function partSources() {
  const manifest = path.join(RUNTIME, 'parts.json');
  if (!fs.existsSync(manifest)) return {};
  const map = {};
  for (const p of JSON.parse(fs.readFileSync(manifest, 'utf8')).parts) map[p.name] = p.file ? path.relative(JK, path.resolve(RUNTIME, p.file)) : `（构建时生成：${p.generated}）`;
  return map;
}

// ---------- minimal CSS parser ----------
// Flat list of rules: {ctx: [enclosing at-rule / parent selector preludes], selector, decls, text, line, offset, key}.
// Handles comments, strings, nesting and at-rules. Good enough for diffing and ownership, not a validator.
export function parseCss(css) {
  const rules = [];
  const starts = [0];
  for (let k = 0; k < css.length; k++) if (css.charCodeAt(k) === 10) starts.push(k + 1);
  const lineAt = (o) => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= o) lo = mid; else hi = mid - 1; } return lo + 1; };
  let i = 0;
  const n = css.length;
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const skipComment = () => { const e = css.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; };
  const skipString = (q) => { i++; while (i < n && css[i] !== q) { if (css[i] === '\\') i++; i++; } i++; };
  const readUntil = (stops) => {
    let s = '', depth = 0;
    while (i < n) {
      const c = css[i];
      if (c === '/' && css[i + 1] === '*') { skipComment(); s += ' '; continue; }
      if (c === '"' || c === "'") { const st = i; skipString(c); s += css.slice(st, i); continue; }
      if (c === '(' || c === '[') depth++;
      else if (c === ')' || c === ']') depth--;
      else if (depth <= 0 && stops.includes(c)) return [s, c];
      s += c; i++;
    }
    return [s, ''];
  };
  const skipBlock = () => {
    let depth = 1;
    while (i < n && depth) {
      const c = css[i];
      if (c === '/' && css[i + 1] === '*') { skipComment(); continue; }
      if (c === '"' || c === "'") { skipString(c); continue; }
      if (c === '{') depth++; else if (c === '}') depth--;
      i++;
    }
  };
  // Handles one `prelude{` that was just consumed.
  const openBlock = (ctx, prelude, start) => {
    if (prelude.startsWith('@')) {
      const name = prelude.split(/[\s(]/)[0];
      if (/^@(font-face|page|property|counter-style|font-feature-values|view-transition)$/.test(name)) {
        const d = body([...ctx, prelude]);
        rules.push({ctx, selector: prelude, decls: d, text: d.join(';'), line: lineAt(start), offset: start, atRule: true});
      } else if (/^@(-webkit-)?keyframes$/.test(name)) {
        const s0 = i; skipBlock();
        rules.push({ctx, selector: prelude, decls: [], text: norm(css.slice(s0, i - 1)), line: lineAt(start), offset: start, atRule: true});
      } else {
        rules.push({ctx, selector: prelude, decls: [], text: '', line: lineAt(start), offset: start, atRule: true, group: true});
        body([...ctx, prelude]);
      }
    } else {
      const rule = {ctx, selector: prelude, decls: null, line: lineAt(start), offset: start};
      rules.push(rule);
      rule.decls = body([...ctx, prelude]);
      rule.text = rule.decls.join(';');
    }
  };
  // Reads a block body after '{' up to its '}'. Returns its own declarations.
  const body = (ctx) => {
    const decls = [];
    while (i < n) {
      while (i < n && /\s/.test(css[i])) i++;
      if (i >= n) break;
      if (css[i] === '/' && css[i + 1] === '*') { skipComment(); continue; }
      if (css[i] === '}') { i++; return decls; }
      if (css[i] === ';') { i++; continue; }
      const start = i;
      const [text, stop] = readUntil([';', '{', '}']);
      if (stop === '{') { i++; openBlock(ctx, norm(text), start); continue; }
      if (stop === ';') i++;
      const t = norm(text);
      if (t.startsWith('@')) rules.push({ctx, selector: t, decls: [], text: '', line: lineAt(start), offset: start, atRule: true, statement: true});
      else if (t) decls.push(t);
      if (stop === '}') { i++; return decls; }
    }
    return decls;
  };
  while (i < n) {
    while (i < n && /\s/.test(css[i])) i++;
    if (i >= n) break;
    if (css[i] === '/' && css[i + 1] === '*') { skipComment(); continue; }
    const start = i;
    const [text, stop] = readUntil([';', '{', '}']);
    if (stop === '}') { i++; continue; }
    if (stop === ';') { i++; const t = norm(text); if (t) rules.push({ctx: [], selector: t, decls: [], text: '', line: lineAt(start), offset: start, atRule: true, statement: true}); continue; }
    if (stop !== '{') break;
    i++;
    openBlock([], norm(text), start);
  }
  for (const r of rules) r.key = [...r.ctx, r.selector].join(' » ') + ' { ' + r.text + ' }';
  return rules;
}

// Splits a selector list at top-level commas.
export function splitList(sel) {
  const out = [];
  let depth = 0, cur = '', q = '';
  for (let k = 0; k < sel.length; k++) {
    const c = sel[k];
    if (q) { cur += c; if (c === '\\') cur += sel[++k] ?? ''; else if (c === q) q = ''; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === '(' || c === '[') depth++;
    if (c === ')' || c === ']') depth--;
    if (c === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
// Splits a complex selector into compounds: [{combinator, compound}], combinator precedes its compound.
export function compounds(sel) {
  const out = [];
  let depth = 0, cur = '', q = '', comb = '';
  const push = () => { if (cur.trim()) { out.push({combinator: comb, compound: cur.trim()}); cur = ''; comb = ''; } };
  for (let k = 0; k < sel.length; k++) {
    const c = sel[k];
    if (q) { cur += c; if (c === '\\') cur += sel[++k] ?? ''; else if (c === q) q = ''; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === '(' || c === '[') depth++;
    if (c === ')' || c === ']') depth--;
    if (depth === 0 && (c === '>' || c === '+' || c === '~')) { push(); comb = c; continue; }
    if (depth === 0 && /\s/.test(c)) { if (cur.trim()) { push(); comb = ' '; } continue; }
    cur += c;
  }
  push();
  return out;
}

// ---------- baseline fixtures ----------
export const THEME_STYLE_RE = /(<style\b[^>]*\bdata-vrcx-0-css-layer=(["'])local-theme-preview\2[^>]*>)[\s\S]*?(<\/style>)/i;
export function listFixtures() {
  return fs.readdirSync(path.join(BASELINE, 'fixtures')).filter((f) => f.endsWith('.html.gz')).map((f) => f.slice(0, -8)).sort();
}
export function fixtureHtml(name) {
  return zlib.gunzipSync(fs.readFileSync(path.join(BASELINE, 'fixtures', name + '.html.gz'))).toString('utf8');
}
// Fixture markup only (no <style>/<script> text), for "does this page contain X" prefilters.
// The fixtures embed the old theme CSS, whose selectors mention every component, so raw html matches everything.
const markupCache = new Map();
export function fixtureMarkup(name) {
  if (!markupCache.has(name)) markupCache.set(name, fixtureHtml(name).replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, ''));
  return markupCache.get(name);
}
// Removes :not(...) arguments: an excluded component must not count as "what we are looking for".
export function stripNot(selector) {
  let out = '', i = 0;
  while (i < selector.length) {
    if (selector.startsWith(':not(', i)) { let d = 0; for (; i < selector.length; i++) { if (selector[i] === '(') d++; else if (selector[i] === ')' && --d === 0) { i++; break; } } continue; }
    out += selector[i++];
  }
  return out;
}
// Attribute needles (name="value" or name) a fixture must contain at least one of to possibly match `selector`.
export function selectorNeedles(selector) {
  return [...stripNot(selector).matchAll(/\[\s*([\w-]+)\s*(?:[~|^$*]?=\s*(["']?)([^"'\]]+)\2)?\s*\]/g)].map((m) => (m[3] ? `${m[1]}="${m[3]}"` : m[1]));
}
export function fixturesFor(selector, names = listFixtures()) {
  const needles = selectorNeedles(selector);
  if (!needles.length) return names;
  return names.filter((n) => { const h = fixtureMarkup(n); return needles.some((t) => h.includes(t)); });
}
// Fixture html with scripts removed and the theme style emptied and tagged id="jk-theme".
export function loadFixture(name) {
  const snap = JSON.parse(fs.readFileSync(path.join(BASELINE, 'snapshot', name + '.json'), 'utf8'));
  let count = 0;
  const html = fixtureHtml(name).replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(THEME_STYLE_RE, (_, open, _q, close) => { count++; return open.replace('<style', '<style id="jk-theme"') + close; });
  if (count !== 1) throw new Error(`${name}：主题 style 标签数量为 ${count}`);
  const v = snap.viewport || {};
  return {name, html, viewport: {width: v.innerWidth || 1280, height: v.innerHeight || 800, dpr: v.devicePixelRatio || 1}};
}
// A standalone preview html (built by build-preview.mjs, with <style id="merged-theme">), prepared the same way.
export function loadPreview(file) {
  let count = 0;
  const html = fs.readFileSync(file, 'utf8').replace(/(<style\b[^>]*\bid=(["'])merged-theme\2[^>]*>)[\s\S]*?(<\/style>)/i, (_, open, _q, close) => { count++; return open.replace(/\bid=(["'])merged-theme\1/, 'id="jk-theme"') + close; });
  if (count !== 1) throw new Error(`${file}：缺少 <style id="merged-theme">`);
  return {name: 'preview:' + path.basename(file), html, viewport: {width: 1380, height: 1100, dpr: 1}, preview: true};
}
export const escStyle = (s) => s.replace(/<\/style/gi, '<\\/style');

// ---------- browser ----------
// One headless Chromium, relaunched after crashes; every document gets its own context.
export class Browser {
  constructor() { this.browser = null; }
  async ensure() {
    if (this.browser?.isConnected()) return this.browser;
    const {chromium} = toolRequire('playwright');
    this.browser = await chromium.launch({headless: true, args: ['--disable-gpu']});
    return this.browser;
  }
  async open(doc, css) {
    const b = await this.ensure();
    const ctx = await b.newContext({viewport: {width: doc.viewport.width, height: doc.viewport.height}, deviceScaleFactor: doc.viewport.dpr});
    await ctx.route(/^https?:/, (r) => r.abort());
    const page = await ctx.newPage();
    await page.setContent(doc.html, {waitUntil: 'load', timeout: 90000});
    if (doc.preview) await page.waitForFunction(() => document.querySelector('#preview-root')?.children.length > 0, null, {timeout: 30000});
    await setTheme(page, css);
    await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 4000))]));
    await settle(page);
    return {page, ctx};
  }
  // Runs fn({page, ctx}) on a fresh context; relaunches the browser and retries after a crash.
  async withPage(doc, css, fn, retries = 1) {
    for (let attempt = 0; ; attempt++) {
      let h;
      try { h = await this.open(doc, css); return await fn(h); }
      catch (e) {
        const crashed = !this.browser?.isConnected() || /Target .*closed|crash/i.test(e.message);
        if (attempt >= retries || !crashed) throw e;
        try { await this.browser?.close(); } catch {}
        this.browser = null;
      } finally { await h?.ctx.close().catch(() => {}); }
    }
  }
  async close() { await this.browser?.close().catch(() => {}); }
}
// Swaps the theme stylesheet text in place (same DOM), then settles animations and transitions.
export async function setTheme(page, css) {
  await page.evaluate((text) => {
    const s = document.getElementById('jk-theme');
    if (!s) throw new Error('jk-theme style missing');
    s.textContent = text;
  }, css);
  await settle(page);
}
export async function settle(page) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      try { if (a instanceof CSSTransition) a.finish(); else { a.pause(); a.currentTime = 0; } } catch {}
    }
  });
}
