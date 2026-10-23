#!/usr/bin/env node
// 计算样式对比：同一份 DOM 先套 before.css、再换 after.css，逐元素（含 ::before/::after）比较全部计算属性。
// 可对指定组件强制 hover / 焦点 / 按下 / 选中 / 未选中 / 禁用 各比一次。外观没变 = 0 差异。
import fs from 'node:fs';
import path from 'node:path';
import {cli, die, Browser, setTheme, listFixtures, fixturesFor, selectorNeedles, loadFixture, loadPreview, mkTmp, writeJson} from './common.mjs';

const {opts} = cli({
  usage: `用法：style-diff.mjs --before A.css --after B.css [选项]
  例：style-diff.mjs --before /tmp/jk-build-compare-x/before.css --after /tmp/jk-build-compare-x/after.css --states '[data-slot="tabs-tab"],[role="tab"]'
  换皮：style-diff.mjs --before A.css --after B.css --expect '[data-slot="toggle-group"]' --states '[data-slot="toggle-group"] > button'
退出码：0 无差异（有 --expect 时：组件外无差异）；1 有差异；2 出错（页面加载失败、状态未还原）`,
  options: {
    '--before': {arg: 'CSS', desc: '改动前的完整主题 CSS'},
    '--after': {arg: 'CSS', desc: '改动后的完整主题 CSS'},
    '--fixtures': {arg: 'auto|all|none|a,b', desc: '用哪些基线快照；auto = 有 --states 时只挑含目标的快照，否则全部', default: 'auto'},
    '--preview': {arg: 'HTML', desc: '额外比较一个 build-preview.mjs 生成的预览页（可重复）', repeat: true},
    '--expect': {arg: '选择器', desc: '换皮模式：目标组件。组件内（含自身）的差异只计数，组件外的差异才算失败'},
    '--states': {arg: '选择器', desc: '对命中元素额外比较 hover / 焦点 / 按下 / 选中 / 未选中 / 禁用'},
    '--scope': {arg: '选择器', desc: '状态比较范围：从目标向上按顺序找第一个匹配的容器，比较容器内元素和祖先链（最多 400 个）', default: '[role="tablist"],[data-slot="toggle-group"],[role="radiogroup"],[role="group"],[data-slot="tabs"]'},
    '--max-targets': {arg: 'N', desc: '每页最多取多少个状态目标（每个容器最多 2 个：已选中的和未选中的）', default: '12'},
    '--no-full': {desc: '跳过整页比较，只比状态（快，但不能证明其它元素没变）'},
    '--details': {arg: 'N', desc: '每页最多展开多少条差异明细', default: '20'},
    '--out': {arg: 'JSON', desc: '报告路径（默认 /tmp 下自动生成）'},
  },
});
if (!opts.before || !opts.after) die('需要 --before 和 --after，见 --help');
const css = {before: fs.readFileSync(opts.before, 'utf8'), after: fs.readFileSync(opts.after, 'utf8')};
const maxTargets = Number(opts['max-targets']), maxDetails = Number(opts.details);
const STATES = ['hover', 'focus', 'active', 'selected', 'unselected', 'disabled'];
const PSEUDO_STATE = {hover: ['hover'], focus: ['focus', 'focus-visible', 'focus-within'], active: ['active']};

// ---------- choose documents ----------
let names = [];
if (opts.fixtures === 'all' || (opts.fixtures === 'auto' && !opts.states)) names = listFixtures();
else if (opts.fixtures === 'auto') {
  if (!selectorNeedles(opts.states).length) die('--fixtures auto 无法从 --states 提取属性，请改用 --fixtures all');
  names = fixturesFor(opts.states);
} else if (opts.fixtures !== 'none') names = opts.fixtures.split(',').map((s) => s.trim()).filter(Boolean);
const docs = [...(opts.preview || []).map((f) => () => loadPreview(f)), ...names.map((n) => () => loadFixture(n))];
if (!docs.length) die('没有可比较的页面');

// ---------- in-page helpers ----------
const IN_PAGE = () => {
  const cyrb = (s) => { let h1 = 0xdeadbeef, h2 = 0x41c6ce57; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); } h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909); return (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36); };
  const PSEUDO = [null, '::before', '::after'];
  const TOUCHED = ['aria-selected', 'aria-pressed', 'data-active', 'data-pressed', 'data-disabled', 'aria-disabled', 'disabled'];
  const X = window.__jkd = {
    props: [], els: [], index: new Map(), targets: [], waves: [],
    inside: '',
    init(statesSel, scopeSel, maxTargets, expectSel) {
      const cs = getComputedStyle(document.documentElement);
      for (let i = 0; i < cs.length; i++) if (!cs[i].startsWith('--')) X.props.push(cs[i]);
      X.props.sort();
      X.els = [document.documentElement, ...document.querySelectorAll('body, body *')];
      X.els.forEach((e, i) => X.index.set(e, i));
      if (expectSel) X.inside = X.els.map((e) => (e.closest(expectSel) ? '1' : '0')).join('');
      if (statesSel) {
        const all = [...document.querySelectorAll(statesSel)].filter((e) => X.index.has(e));
        const scopeSels = scopeSel.split(/,(?![^[]*\])/).map((s) => s.trim());
        const scopeOf = (t) => { for (const s of scopeSels) { const r = t.closest(s); if (r) return r; } return t.parentElement || t; };
        const isOn = (e) => e.getAttribute('aria-selected') === 'true' || e.getAttribute('aria-pressed') === 'true' || e.hasAttribute('data-active') || e.hasAttribute('data-pressed');
        const byScope = new Map();
        for (const t of all) { const r = scopeOf(t); if (!byScope.has(r)) byScope.set(r, []); byScope.get(r).push(t); }
        // Wave 0 = one target per container (selected first), wave 1 = a second one. Targets in a wave share no container,
        // so their states are applied together: one relayout per state instead of one per target.
        const picks = [];
        for (const [root, ts] of byScope) { ts.sort((a, b) => isOn(b) - isOn(a)); ts.slice(0, 2).forEach((t, w) => picks.push({t, w, root})); }
        picks.sort((a, b) => a.w - b.w);
        const chosen = picks.slice(0, maxTargets);
        X.targets = chosen.map((p) => p.t);
        for (const w of [0, 1]) {
          const ks = chosen.map((p, k) => (p.w === w ? k : -1)).filter((k) => k >= 0);
          if (!ks.length) continue;
          const set = new Set();
          for (const k of ks) {
            const {t, root} = chosen[k];
            for (let a = root; a; a = a.parentElement) set.add(a);
            for (const e of t.querySelectorAll('*')) set.add(e);
            let n = 0;
            for (const e of root.querySelectorAll('*')) { if (++n > 400) break; set.add(e); }
          }
          X.waves.push({targets: ks, list: [...set].filter((e) => X.index.has(e)).map((e) => X.index.get(e)).sort((a, b) => a - b)});
        }
        X.targets.forEach((t, i) => t.setAttribute('data-jkd-target', String(i)));
        X.saved = X.targets.map((t) => TOUCHED.map((a) => [a, t.getAttribute(a)]));
      }
      return {elements: X.els.length, props: X.props.length, targets: X.targets.length, available: statesSel ? document.querySelectorAll(statesSel).length : 0, waves: X.waves.map((w) => w.targets), insideCount: X.inside.split('1').length - 1};
    },
    settleSync() {
      void document.documentElement.offsetWidth;
      for (const a of document.getAnimations()) { try { if (a instanceof CSSTransition) a.finish(); else { a.pause(); a.currentTime = 0; } } catch {} }
    },
    rec(el, p) {
      const cs = getComputedStyle(el, PSEUDO[p]);
      if (p) { const c = cs.getPropertyValue('content'); if (c === 'none' || c === 'normal') return 'content:none'; }
      let s = '';
      for (const k of X.props) s += cs.getPropertyValue(k) + '\u0001';
      return s;
    },
    hashRange(from, to) { const out = []; for (let i = from; i < Math.min(to, X.els.length); i++) for (let p = 0; p < 3; p++) out.push(cyrb(X.rec(X.els[i], p))); return out; },
    hashWave(w) { X.settleSync(); const out = []; for (const i of X.waves[w].list) for (let p = 0; p < 3; p++) out.push(cyrb(X.rec(X.els[i], p))); return out; },
    detail(i, p) { X.settleSync(); const s = X.rec(X.els[i], p); if (s === 'content:none') return {content: 'none'}; const v = s.split('\u0001'), o = {}; X.props.forEach((k, j) => { o[k] = v[j]; }); return o; },
    label(i) {
      const parts = [];
      for (let e = X.els[i], d = 0; e && d < 4; e = e.parentElement, d++) {
        let s = e.tagName.toLowerCase();
        const slot = e.getAttribute('data-slot'), role = e.getAttribute('role');
        if (slot) s += `[data-slot=${slot}]`; else if (role) s += `[role=${role}]`;
        else { const c = [...e.classList].filter((x) => /^(vrcx|jk|r\d|entity|object|demo)/.test(x)).slice(0, 2); if (c.length) s += '.' + c.join('.'); }
        if (e.parentElement) { const sib = [...e.parentElement.children].filter((x) => x.tagName === e.tagName); if (sib.length > 1) s += `:nth(${sib.indexOf(e) + 1})`; }
        parts.unshift(s);
        if (slot && d) break;
      }
      return parts.join(' > ');
    },
    applyAttrs(w, state) {
      for (const k of X.waves[w].targets) {
        const t = X.targets[k];
        const tab = t.hasAttribute('aria-selected') || t.getAttribute('role') === 'tab';
        const press = t.hasAttribute('aria-pressed');
        if (state === 'selected') {
          if (tab || !press) { t.setAttribute('aria-selected', 'true'); t.setAttribute('data-active', ''); }
          if (press) { t.setAttribute('aria-pressed', 'true'); t.setAttribute('data-pressed', ''); }
        } else if (state === 'unselected') {
          t.removeAttribute('data-active'); t.removeAttribute('data-pressed');
          if (tab) t.setAttribute('aria-selected', 'false');
          if (press) t.setAttribute('aria-pressed', 'false');
        } else if (state === 'disabled') {
          t.setAttribute('data-disabled', ''); t.setAttribute('aria-disabled', 'true');
          if ('disabled' in t) t.setAttribute('disabled', '');
        }
      }
    },
    restore(w) { for (const k of X.waves[w].targets) { const t = X.targets[k]; for (const [a, v] of X.saved[k]) { if (v === null) t.removeAttribute(a); else t.setAttribute(a, v); } } },
  };
};

// Applies / clears one state on every target of a wave. Pseudo-classes go through CDP, the rest are attributes.
async function setState(h, w, st, on) {
  if (st === 'base') return;
  if (PSEUDO_STATE[st]) {
    for (const k of h.info.waves[w]) await h.cdp.send('CSS.forcePseudoState', {nodeId: h.nodeIds[k], forcedPseudoClasses: on ? PSEUDO_STATE[st] : []});
  } else if (on) await h.page.evaluate(([w, st]) => window.__jkd.applyAttrs(w, st), [w, st]);
  else await h.page.evaluate((w) => window.__jkd.restore(w), w);
}
async function measure(h, wantFull) {
  const res = {full: [], waves: []};
  if (wantFull) for (let from = 0; from < h.info.elements; from += 700) res.full.push(...await h.page.evaluate(([a, b]) => window.__jkd.hashRange(a, b), [from, from + 700]));
  for (let w = 0; w < h.info.waves.length; w++) {
    const row = {base: await h.page.evaluate((w) => window.__jkd.hashWave(w), w)};
    for (const st of STATES) {
      await setState(h, w, st, true);
      row[st] = await h.page.evaluate((w) => window.__jkd.hashWave(w), w);
      await setState(h, w, st, false);
    }
    row.restored = await h.page.evaluate((w) => window.__jkd.hashWave(w), w);
    res.waves.push(row);
  }
  return res;
}
async function readDetail(h, d) {
  if (d.wave !== undefined) await setState(h, d.wave, d.state, true);
  const v = await h.page.evaluate(([i, p]) => window.__jkd.detail(i, p), [d.index, d.pseudo]);
  if (d.wave !== undefined) await setState(h, d.wave, d.state, false);
  return v;
}

const browser = new Browser();
const report = {before: opts.before, after: opts.after, states: opts.states || null, pages: [], diffs: []};
const started = Date.now();
let anyDiff = false, anyError = false;
const W = String(docs.length).length;
for (const [di, make] of docs.entries()) {
  const t0 = Date.now();
  let doc;
  try { doc = make(); } catch (e) { report.pages.push({name: String(di), error: e.message}); anyError = true; console.log(`✗ ${e.message}`); continue; }
  try {
    const r = await browser.withPage(doc, css.before, async ({page, ctx}) => {
      await page.evaluate(IN_PAGE);
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
      const info = await page.evaluate(([s, sc, m, e]) => window.__jkd.init(s, sc, m, e), [opts.states || '', opts.scope, maxTargets, opts.expect || '']);
      const rootId = (await cdp.send('DOM.getDocument', {depth: 0})).root.nodeId;
      const nodeIds = [];
      for (let k = 0; k < info.targets; k++) nodeIds.push((await cdp.send('DOM.querySelector', {nodeId: rootId, selector: `[data-jkd-target="${k}"]`})).nodeId);
      const h = {page, cdp, info, nodeIds};
      const wantFull = !opts['no-full'];
      const A = await measure(h, wantFull);
      await setTheme(page, css.after);
      const B = await measure(h, wantFull);
      const waveLists = info.waves.length ? await page.evaluate(() => window.__jkd.waves.map((w) => w.list)) : [];
      const diffs = [];
      for (let j = 0; j < A.full.length; j++) if (A.full[j] !== B.full[j]) diffs.push({state: 'page', index: Math.floor(j / 3), pseudo: j % 3});
      const restoreProblems = [];
      A.waves.forEach((ra, w) => {
        const rb = B.waves[w];
        for (const st of ['base', ...STATES]) for (let j = 0; j < ra[st].length; j++) if (ra[st][j] !== rb[st][j]) diffs.push({state: st, wave: w, index: waveLists[w][Math.floor(j / 3)], pseudo: j % 3});
        if (ra.restored.join() !== ra.base.join() || rb.restored.join() !== rb.base.join()) restoreProblems.push(w);
      });
      // With --expect, differences inside the target component are expected; only the rest fail.
      const flags = opts.expect ? await page.evaluate(() => window.__jkd.inside) : '';
      for (const d of diffs) d.inside = flags[d.index] === '1';
      const outside = diffs.filter((d) => !d.inside);
      // Expand a few differences (outside ones first): same state under each stylesheet, full property values.
      const details = [...outside, ...diffs.filter((d) => d.inside)].slice(0, maxDetails).map((d) => ({d}));
      for (const x of details) x.after = await readDetail(h, x.d);
      if (details.length) {
        await setTheme(page, css.before);
        for (const x of details) { x.before = await readDetail(h, x.d); x.label = await page.evaluate((i) => window.__jkd.label(i), x.d.index); }
      }
      return {info, diffs, outside, details, restoreProblems};
    });
    const {info, diffs, outside, details, restoreProblems} = r;
    const failing = opts.expect ? outside : diffs;
    const ms = Date.now() - t0;
    const out = details.map((x) => ({page: doc.name, state: x.d.wave === undefined ? x.d.state : `${x.d.state}（第 ${x.d.wave + 1} 组目标）`, inside: x.d.inside, element: x.label, pseudo: ['', '::before', '::after'][x.d.pseudo], changes: Object.keys({...x.before, ...x.after}).filter((k) => x.before[k] !== x.after[k]).slice(0, 12).map((k) => ({property: k, before: x.before[k], after: x.after[k]}))}));
    report.pages.push({name: doc.name, elements: info.elements, properties: info.props, targets: info.targets, targetsAvailable: info.available, differences: diffs.length, outside: opts.expect ? outside.length : undefined, insideElements: opts.expect ? info.insideCount : undefined, restoreProblems, ms});
    report.diffs.push(...out);
    if (failing.length) anyDiff = true;
    if (restoreProblems.length) anyError = true;
    console.log(`${String(di + 1).padStart(W)}/${docs.length} ${failing.length ? '✗' : '✓'} ${doc.name}  元素 ${info.elements}  状态目标 ${info.targets}/${info.available}  ${opts.expect ? `组件元素 ${info.insideCount}  组件内差异 ${diffs.length - outside.length}  组件外差异 ${outside.length}` : `差异 ${diffs.length}`}  ${(ms / 1000).toFixed(1)}s${restoreProblems.length ? '  ⚠ 状态未还原' : ''}`);
    for (const o of out.filter((x) => !opts.expect || !x.inside).slice(0, 3)) console.log(`      [${o.state}] ${o.element}${o.pseudo}  ${o.changes.slice(0, 3).map((c) => `${c.property}: ${c.before} → ${c.after}`).join('；')}`);
  } catch (e) {
    anyError = true;
    report.pages.push({name: doc.name, error: e.message.split('\n')[0], ms: Date.now() - t0});
    console.log(`${String(di + 1).padStart(W)}/${docs.length} ✗ ${doc.name}  出错：${e.message.split('\n')[0]}`);
  }
}
await browser.close();
report.totalMs = Date.now() - started;
const ok = report.pages.filter((p) => !p.error);
report.summary = {pages: report.pages.length, failed: report.pages.length - ok.length, differences: ok.reduce((s, p) => s + p.differences, 0), outside: opts.expect ? ok.reduce((s, p) => s + p.outside, 0) : undefined, avgSeconds: ok.length ? +(ok.reduce((s, p) => s + p.ms, 0) / ok.length / 1000).toFixed(1) : 0};
const outFile = opts.out || path.join(mkTmp('jk-style-diff-'), 'report.json');
writeJson(outFile, report);
console.log(`\n共 ${report.summary.pages} 页，失败 ${report.summary.failed}，${opts.expect ? `组件内差异 ${report.summary.differences - report.summary.outside}，组件外差异 ${report.summary.outside}` : `差异 ${report.summary.differences}`}；总耗时 ${(report.totalMs / 1000).toFixed(0)}s，平均每页 ${report.summary.avgSeconds}s\n报告：${outFile}`);
process.exit(anyError ? 2 : anyDiff ? 1 : 0);
