#!/usr/bin/env node
// 规则来源（收敛流程第⑤步）：这个组件的样式散落在哪些片段的哪几行。
//   静态模式（默认）：扫描 parts.json 里的全部片段，按选择器结构把提到该组件的规则分成
//     “主体”（样式就加在这个组件上，应搬进 xxx.css）/“只作条件”（祖先、:has、:not 里提到，应留下）/“混合”（一条规则里两种都有，要拆）。
//   运行时模式（--runtime）：在基线快照里找到组件的实际元素，问浏览器到底命中了哪些主题规则（含伪元素、强制悬停/焦点/按下），反查到片段文件:行号。
//   两者互补：静态模式能找到快照里没出现的写法；运行时模式能找到没写组件名、却实际命中的规则（如 button、* 这类泛选择器）。
import fs from 'node:fs';
import path from 'node:path';
import {cli, die, Browser, listFixtures, loadFixture, mkTmp, writeJson, parseCss, splitList, compounds, stripNot, fixturesFor, sections, sectionAt, partSources, DEFAULT_THEME, RUNTIME, JK} from './common.mjs';

const {opts, rest} = cli({
  usage: `用法：rule-owners.mjs <组件> [选项]
  <组件> 可写 data-slot 名（toggle-group），或任意 CSS 选择器（运行时模式用来选元素；静态模式用其中的属性/类名做匹配）
  例：rule-owners.mjs toggle-group
      rule-owners.mjs toggle-group --runtime --item ':scope > button'`,
  options: {
    '--runtime': {desc: '运行时模式：问浏览器实际命中了哪些规则'},
    '--theme': {arg: 'CSS', desc: '运行时模式用哪份完整主题（必须是当前片段构建出来的，行号才对得上）', default: DEFAULT_THEME},
    '--item': {arg: '选择器', desc: '运行时模式：组件内还要检查的子元素（相对组件根）', default: ':scope > *'},
    '--fixtures': {arg: 'all|a,b', desc: '运行时模式：只看部分快照', default: 'all'},
    '--per-fixture': {arg: 'N', desc: '运行时模式：每个快照最多检查多少个元素', default: '24'},
    '--generic': {desc: '运行时模式：也列出没提到该组件的泛规则（默认只列提到它的和命中它的 [data-slot] 规则以外的前 30 条）'},
    '--out': {arg: 'JSON', desc: '报告路径（默认 /tmp 下自动生成）'},
  },
});
const target = rest[0];
if (!target) die('需要组件名或选择器，见 --help');
const selector = /^[\w-]+$/.test(target) ? `[data-slot="${target}"]` : target;
// Tokens that identify the component inside a selector: data-slot names, other attributes, classes.
const tokens = [];
for (const m of stripNot(selector).matchAll(/\[\s*([\w-]+)\s*(?:[~|^$*]?=\s*(["']?)([^"'\]]+)\2)?\s*\]/g)) tokens.push(m[3] ? {attr: m[1], value: m[3]} : {attr: m[1]});
for (const m of stripNot(selector).replace(/\[[^\]]*\]/g, '').matchAll(/\.([\w-]+)/g)) tokens.push({cls: m[1]});
if (!tokens.length) die(`无法从 ${selector} 提取属性或类名`);
const tokenRe = tokens.map((t) => t.cls ? new RegExp(`\\.${t.cls}(?![\\w-])`) : t.value ? new RegExp(`\\[\\s*${t.attr}\\s*[~|^$*]?=\\s*["']?${t.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?\\s*(?:[is]\\s*)?\\]`) : new RegExp(`\\[\\s*${t.attr}\\s*[\\]~|^$*=]`));
const mentions = (s) => tokenRe.some((re) => re.test(s));
const outFile = opts.out || path.join(mkTmp('jk-rule-owners-'), 'report.json');

// ---------- static ----------
// Classifies one complex selector: subject = the token is in the last compound outside :not()/:has().
function classify(sel) {
  const cs = compounds(sel);
  if (!cs.length) return null;
  const strip = (c) => c.replace(/:(not|has)\((?:[^()]|\([^()]*\))*\)/g, '').replace(/::?[\w-]+(\((?:[^()]|\([^()]*\))*\))?$/g, '');
  const last = cs[cs.length - 1].compound;
  // `:is(...)`/`:where(...)` in the subject keep the token in the subject.
  if (mentions(strip(last))) return 'subject';
  if (mentions(sel)) return /:not\(/.test(sel) && !mentions(sel.replace(/:not\((?:[^()]|\([^()]*\))*\)/g, '')) ? 'exclude' : 'condition';
  return null;
}
function resolveNested(ctx, sel) {
  const parents = ctx.filter((c) => !c.startsWith('@'));
  let full = [sel];
  for (const p of parents.reverse()) {
    const ps = splitList(p);
    full = full.flatMap((s) => (s.includes('&') ? ps.map((q) => s.replaceAll('&', `:is(${q})`)) : ps.map((q) => `${q} ${s}`)));
  }
  return full;
}
function staticScan() {
  const manifest = JSON.parse(fs.readFileSync(path.join(RUNTIME, 'parts.json'), 'utf8')).parts.filter((p) => p.file);
  const files = [];
  for (const p of manifest) {
    const file = path.resolve(RUNTIME, p.file);
    const rel = path.relative(JK, file);
    const rules = parseCss(fs.readFileSync(file, 'utf8')).filter((r) => !r.atRule);
    const hits = [];
    for (const r of rules) {
      const full = resolveNested(r.ctx, r.selector);
      if (!full.some(mentions)) continue;
      const kinds = splitList(r.selector).map((part) => resolveNested(r.ctx, part).map(classify).find(Boolean) || 'other');
      const set = new Set(kinds.filter((k) => k !== 'other'));
      let verdict = set.has('subject') ? (kinds.every((k) => k === 'subject') ? '主体' : '混合') : set.has('exclude') && set.size === 1 ? '只作排除' : '只作条件';
      if (verdict === '主体' && r.ctx.some((c) => !c.startsWith('@') && !mentions(c)) && !mentions(r.selector)) verdict = '只作条件';
      const layers = r.ctx.filter((c) => c.startsWith('@')).join(' ');
      hits.push({line: r.line, verdict, selector: r.selector.length > 160 ? r.selector.slice(0, 157) + '…' : r.selector, at: layers || undefined, parts: kinds.length});
    }
    if (hits.length) files.push({file: rel, part: p.name, hits});
  }
  const count = (v) => files.reduce((s, f) => s + f.hits.filter((h) => h.verdict === v).length, 0);
  console.log(`静态扫描 ${manifest.length} 个片段，提到 ${selector} 的规则：主体 ${count('主体')}，混合 ${count('混合')}，只作条件 ${count('只作条件')}，只作排除 ${count('只作排除')}\n`);
  for (const f of files) {
    console.log(`${f.file}（SECTION ${f.part}）`);
    for (const h of f.hits.sort((a, b) => a.line - b.line)) console.log(`  ${String(h.line).padStart(5)}  ${h.verdict.padEnd(4, '　')}  ${h.at ? `[${h.at}] ` : ''}${h.selector}`);
  }
  console.log('\n主体 = 搬进组件 css；混合 = 选择器列表里既有本组件又有别的组件，要拆开只搬本组件那部分；只作条件/排除 = 样式加在别的组件上，留下。');
  writeJson(outFile, {mode: 'static', selector, files});
}

// ---------- runtime ----------
async function runtimeScan() {
  const css = fs.readFileSync(opts.theme, 'utf8');
  const lines = css.split('\n');
  const secs = sections(css), sources = partSources();
  const names = fixturesFor(selector, opts.fixtures === 'all' ? listFixtures() : opts.fixtures.split(','));
  const rules = new Map(); // key: line:col
  const browser = new Browser();
  const per = Number(opts['per-fixture']);
  let checked = 0, skipped = 0;
  const seen = new Set();
  for (const name of names) {
    try {
      await browser.withPage(loadFixture(name), css, async ({page, ctx}) => {
        const cdp = await ctx.newCDPSession(page);
        const heads = [];
        cdp.on('CSS.styleSheetAdded', (e) => heads.push(e.header));
        await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
        await new Promise((r) => setTimeout(r, 200));
        const sheet = heads.find((h) => h.length === css.length);
        if (!sheet) throw new Error('找不到主题样式表');
        // Signature = element attributes + classes + ancestor chain; identical elements (the same toolbar on many pages) are checked once.
        const sigs = await page.evaluate(([sel, item, per]) => {
          const roots = [...document.querySelectorAll(sel)];
          const els = new Set();
          for (const r of roots) { els.add(r); for (const c of r.querySelectorAll(item)) els.add(c); }
          const sig = (e) => { const out = []; for (let a = e, d = 0; a && d < 12; a = a.parentElement, d++) out.push(a.tagName + [...a.attributes].filter((x) => x.name !== 'style' && !x.name.startsWith('data-jkro') && !/^(id|aria-(labelledby|controls|describedby)|for|href|src|alt|title)$/.test(x.name)).map((x) => x.name + '=' + x.value).join(',')); return out.join('<'); };
          return [...els].slice(0, per).map((e, i) => { e.setAttribute('data-jkro', String(i)); return sig(e); });
        }, [selector, opts.item, per]);
        const n = sigs.length;
        const root = (await cdp.send('DOM.getDocument', {depth: 0})).root.nodeId;
        for (let k = 0; k < n; k++) {
          if (seen.has(sigs[k])) { skipped++; continue; }
          seen.add(sigs[k]);
          checked++;
          const nodeId = (await cdp.send('DOM.querySelector', {nodeId: root, selector: `[data-jkro="${k}"]`})).nodeId;
          const desc = await page.evaluate((k) => { const e = document.querySelector(`[data-jkro="${k}"]`); return [e.tagName.toLowerCase(), e.getAttribute('data-slot') || e.getAttribute('role') || ''].filter(Boolean).join(':'); }, k);
          for (const forced of [[], ['hover'], ['focus', 'focus-visible'], ['active']]) {
            await cdp.send('CSS.forcePseudoState', {nodeId, forcedPseudoClasses: forced});
            const m = await cdp.send('CSS.getMatchedStylesForNode', {nodeId});
            const take = (matches, pseudo) => {
              for (const r of matches || []) {
                if (r.rule.styleSheetId !== sheet.styleSheetId) continue;
                const rg = r.rule.selectorList.selectors[0]?.range || r.rule.style.range;
                if (!rg) continue;
                const key = `${rg.startLine}:${rg.startColumn}`;
                if (!rules.has(key)) rules.set(key, {line: rg.startLine + 1, text: r.rule.selectorList.text, layers: (r.rule.layers || []).map((l) => l.text).join(' '), elements: new Set(), fixtures: new Set(), states: new Set(), pseudo: new Set()});
                const e = rules.get(key);
                e.elements.add(desc); e.fixtures.add(name); e.states.add(forced[0] || '常态'); if (pseudo) e.pseudo.add(pseudo);
              }
            };
            take(m.matchedCSSRules);
            for (const p of m.pseudoElements || []) take(p.matches, '::' + p.pseudoType);
          }
          await cdp.send('CSS.forcePseudoState', {nodeId, forcedPseudoClasses: []});
        }
      });
      process.stdout.write('.');
    } catch (e) { console.log(`\n✗ ${name}：${e.message.split('\n')[0]}`); }
  }
  await browser.close();
  const list = [...rules.values()].map((r) => {
    const off = lines.slice(0, r.line - 1).reduce((s, l) => s + l.length + 1, 0);
    const s = sectionAt(secs, off);
    const file = s ? (sources[s.name] || `SECTION ${s.name}`) : 'theme.css';
    return {at: s ? `${file}:${r.line - s.line}` : `theme.css:${r.line}`, file, selector: r.text, mentions: mentions(r.text), layers: r.layers || undefined, elements: [...r.elements], fixtures: r.fixtures.size, states: [...r.states], pseudo: [...r.pseudo]};
  }).sort((a, b) => (a.file === b.file ? parseInt(a.at.split(':').pop()) - parseInt(b.at.split(':').pop()) : a.file.localeCompare(b.file)));
  const named = list.filter((r) => r.mentions), generic = list.filter((r) => !r.mentions);
  console.log(`\n\n运行时：${names.length} 个快照，检查 ${checked} 个元素（另有 ${skipped} 个与已查元素完全相同，跳过；组件根 + 子项，每个都试了常态/悬停/焦点/按下），命中主题规则 ${list.length} 条：提到该组件的 ${named.length} 条，泛规则 ${generic.length} 条\n`);
  const show = (r) => console.log(`  ${r.at.padEnd(34)} ${r.layers ? `[${r.layers}] ` : ''}${r.selector.length > 120 ? r.selector.slice(0, 117) + '…' : r.selector}\n  ${''.padEnd(34)} 命中 ${r.elements.join('，')}；${r.states.join('/')}${r.pseudo.length ? '；' + r.pseudo.join(' ') : ''}；${r.fixtures} 个快照`);
  console.log('提到该组件的规则：'); named.forEach(show);
  console.log(`\n没提到该组件、但也命中它的泛规则（${generic.length} 条）${opts.generic ? '' : '，前 30 条'}：`); (opts.generic ? generic : generic.slice(0, 30)).forEach(show);
  writeJson(outFile, {mode: 'runtime', selector, theme: opts.theme, fixtures: names, checked, rules: list});
}

if (opts.runtime) await runtimeScan(); else staticScan();
console.log(`\n报告：${outFile}`);
