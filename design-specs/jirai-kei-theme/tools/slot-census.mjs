#!/usr/bin/env node
// 组件普查（收敛流程第②步）：一个组件在 42 个基线快照里出现在哪、有哪些属性组合、处在什么容器里，
// 以及在当前合并主题下实际渲染出几种样式。只输出结构信息，不输出页面文字（快照里有个人数据）。
import fs from 'node:fs';
import path from 'node:path';
import {cli, die, Browser, listFixtures, fixturesFor, loadFixture, mkTmp, writeJson, DEFAULT_THEME} from './common.mjs';

const {opts, rest} = cli({
  usage: `用法：slot-census.mjs <组件> [选项]
  <组件> 可写 data-slot 名（toggle-group）或任意 CSS 选择器（'[data-slot="toggle-group"] > button'）
  例：slot-census.mjs toggle-group
      slot-census.mjs tabs-list --theme /tmp/jk-build-compare-x/after.css`,
  options: {
    '--theme': {arg: 'CSS', desc: '用哪份完整主题渲染', default: DEFAULT_THEME},
    '--fixtures': {arg: 'all|a,b', desc: '只看部分快照', default: 'all'},
    '--item': {arg: '选择器', desc: '组件内“子项”的选择器（相对组件根，:scope 开头），也给它们做样式指纹', default: ':scope > *'},
    '--props': {arg: 'a,b', desc: '样式指纹包含的属性前缀（不含宽高位置，避免同款不同尺寸被拆开）', default: 'background,border,color,font,padding,box-shadow,outline,opacity,text-,letter-spacing,line-height,gap,clip-path,mask,filter,cursor,display'},
    '--out': {arg: 'JSON', desc: '报告路径（默认 /tmp 下自动生成）'},
  },
});
const target = rest[0];
if (!target) die('需要组件名或选择器，见 --help');
const selector = /^[\w-]+$/.test(target) ? `[data-slot="${target}"]` : target;
const css = fs.readFileSync(opts.theme, 'utf8');
const prefixes = opts.props.split(',').map((s) => s.trim()).filter(Boolean);
const names = fixturesFor(selector, opts.fixtures === 'all' ? listFixtures() : opts.fixtures.split(','));

const PROBE = ([selector, itemSel, prefixes]) => {
  const OVERLAY = ['dialog-content', 'alert-dialog-content', 'sheet-content', 'popover-content', 'dropdown-menu-content', 'context-menu-content', 'menubar-content', 'select-content', 'combobox-content', 'hover-card-content', 'tooltip-content', 'command'];
  const AREA = ['entity-dialog', 'owner-dialog', 'vrcx-0-titlebar', 'vrcx-0-statusbar', 'vrcx-0-side-panel', 'vrcx-0-page-toolbar', 'vrcx-0-data-table', 'app-data-table', 'object-row', 'vrcx-0-page-scaffold', 'vrcx-0-main-content'];
  const props = [];
  const cs0 = getComputedStyle(document.documentElement);
  for (let i = 0; i < cs0.length; i++) if (prefixes.some((p) => cs0[i].startsWith(p))) props.push(cs0[i]);
  props.sort();
  const fp = (el) => { const cs = getComputedStyle(el); const o = {}; for (const k of props) o[k] = cs.getPropertyValue(k); return o; };
  const attrs = (el) => {
    const o = {tag: el.tagName.toLowerCase()};
    for (const a of el.attributes) {
      if (a.name.startsWith('data-jkd')) continue;
      if (a.name === 'data-slot' || a.name === 'role' || a.name === 'type' || a.name === 'disabled' || /^data-(variant|size|orientation|multiple|disabled|state|align|side|pressed|active|inset|vrcx-0-control)$/.test(a.name) || /^aria-(pressed|selected|orientation|checked|expanded|disabled|haspopup)$/.test(a.name)) o[a.name] = a.value;
    }
    return o;
  };
  const context = (el) => {
    const parts = [];
    let overlay = null, area = null, field = false;
    for (let a = el.parentElement; a; a = a.parentElement) {
      const slot = a.getAttribute('data-slot');
      if (!overlay && slot && OVERLAY.includes(slot)) overlay = slot;
      if (!field && (slot === 'field' || slot === 'field-set')) field = true;
      if (!area) for (const c of AREA) if (a.classList.contains(c)) { area = c; break; }
    }
    if (overlay) parts.push(overlay);
    if (area) parts.push(area);
    if (field) parts.push('field');
    return parts.join(' / ') || '页面根部';
  };
  const parentChain = (el) => { const out = []; for (let a = el.parentElement; a && out.length < 3; a = a.parentElement) { const s = a.getAttribute('data-slot'); if (s) out.push(s); } return out.join(' < '); };
  return [...document.querySelectorAll(selector)].map((el) => {
    const items = [...el.querySelectorAll(itemSel)];
    const r = el.getBoundingClientRect();
    return {
      attrs: attrs(el), context: context(el), parents: parentChain(el), visible: r.width > 0 && r.height > 0,
      children: items.map((c) => { const a = attrs(c); return [a.tag, a['data-slot'] || a.role || ''].filter(Boolean).join(':'); }),
      style: fp(el), itemStyles: items.slice(0, 8).map((c) => ({attrs: attrs(c), style: fp(c)})),
    };
  });
};

const hash = (o) => { const s = JSON.stringify(o); let h = 5381; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); };
const browser = new Browser();
const instances = [];
for (const name of names) {
  try {
    const found = await browser.withPage(loadFixture(name), css, ({page}) => page.evaluate(PROBE, [selector, opts.item, prefixes]));
    for (const f of found) instances.push({fixture: name, ...f});
    process.stdout.write(found.length ? `${name}:${found.length} ` : '');
  } catch (e) { console.log(`\n✗ ${name}：${e.message.split('\n')[0]}`); }
}
await browser.close();
console.log('\n');
if (!instances.length) { console.log(`在 ${names.length} 个快照里没有找到 ${selector}`); process.exit(0); }

const group = (list, keyOf) => { const m = new Map(); for (const x of list) { const k = keyOf(x); if (!m.has(k)) m.set(k, []); m.get(k).push(x); } return [...m.entries()].sort((a, b) => b[1].length - a[1].length); };
const attrKey = (a) => Object.entries(a).filter(([k]) => !/^aria-(pressed|selected|checked|expanded)$|^data-(pressed|active|state)$/.test(k)).map(([k, v]) => (v === '' ? k : `${k}=${v}`)).join(' ');
const byFixture = group(instances, (x) => x.fixture);
const byAttrs = group(instances, (x) => attrKey(x.attrs));
const byContext = group(instances, (x) => x.context);
// Style variants: root fingerprint + the set of distinct item fingerprints (selected/unselected items differ legitimately).
const styleKey = (x) => hash(x.style) + '|' + [...new Set(x.itemStyles.map((i) => hash(i.style)))].sort().join(',');
const byStyle = group(instances, styleKey);
const pick = (s) => ['background-color', 'border-top-color', 'border-top-width', 'border-top-left-radius', 'color', 'font-size', 'padding-top', 'padding-left', 'box-shadow', 'gap'].filter((k) => k in s).map((k) => `${k}: ${s[k]}`).join('；');

console.log(`${selector}：${instances.length} 个实例（可见 ${instances.filter((x) => x.visible).length}），分布在 ${byFixture.length}/${names.length} 个快照里`);
console.log('\n按快照：' + byFixture.map(([k, v]) => `${k} ${v.length}`).join('，'));
console.log(`\n属性组合（${byAttrs.length} 种）：`);
for (const [k, v] of byAttrs) console.log(`  ${String(v.length).padStart(3)}×  ${k}\n        容器：${group(v, (x) => x.context).map(([c, w]) => `${c} ${w.length}`).join('，')}\n        子项：${[...new Set(v.flatMap((x) => x.children))].join('，') || '无'}`);
console.log(`\n容器（${byContext.length} 种）：` + byContext.map(([k, v]) => `${k} ${v.length}`).join('，'));
console.log(`\n当前主题下渲染出的样式（${byStyle.length} 种，按组件根 + 子项样式指纹分组）：`);
byStyle.forEach(([, v], i) => {
  const x = v[0];
  console.log(`  样式 ${i + 1}：${v.length} 个实例，代表快照 ${x.fixture}（${x.context}）\n        属性：${[...new Set(v.map((y) => attrKey(y.attrs)))].join(' | ')}\n        组件根：${pick(x.style)}`);
  const items = group(x.itemStyles, (it) => hash(it.style));
  items.forEach(([, its]) => console.log(`        子项 ×${its.length}（${attrKey(its[0].attrs)}）：${pick(its[0].style)}`));
});
const report = {selector, theme: opts.theme, fixtures: names, total: instances.length,
  attrCombos: byAttrs.map(([k, v]) => ({attrs: k, count: v.length, fixtures: [...new Set(v.map((x) => x.fixture))], contexts: Object.fromEntries(group(v, (x) => x.context).map(([c, w]) => [c, w.length]))})),
  styles: byStyle.map(([key, v]) => ({key, count: v.length, fixtures: [...new Set(v.map((x) => x.fixture))], attrs: [...new Set(v.map((y) => attrKey(y.attrs)))], root: v[0].style, items: group(v[0].itemStyles, (it) => hash(it.style)).map(([, its]) => ({count: its.length, attrs: attrKey(its[0].attrs), style: its[0].style}))})),
  instances: instances.map(({style, itemStyles, ...rest}) => ({...rest, style: styleKey({style, itemStyles})}))};
const outFile = opts.out || path.join(mkTmp('jk-census-'), 'report.json');
writeJson(outFile, report);
console.log(`\n报告：${outFile}`);
