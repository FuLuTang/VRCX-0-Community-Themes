#!/usr/bin/env node
// 前后构建对比：改动前先 save，改完后 diff。字节相同即可直接通过；不同则给出规则级差异摘要。
import fs from 'node:fs';
import path from 'node:path';
import {cli, die, buildTheme, exportGitRef, mkTmp, sha256, fmtBytes, writeJson, parseCss, sections, sectionAt, partSources, LIMIT} from './common.mjs';

const {opts, rest} = cli({
  usage: `用法：
  build-compare.mjs save [--label 名称]
      构建当前工作树，保存为“改动前”，输出到 /tmp/jk-before-<名称>/（并更新 /tmp/jk-before-latest）
  build-compare.mjs diff [--before 来源] [--after 来源] [--list N] [--out 目录]
      来源可以是：css 文件、含 theme.css 的目录、git ref（如 HEAD）、或 worktree（当前工作树，after 的默认值）
      --before 默认 /tmp/jk-before-latest
退出码：0 字节完全相同；1 有差异；2 出错`,
  options: {
    '--label': {arg: '名称', desc: 'save 时的名称'},
    '--before': {arg: '来源', desc: '改动前', default: '/tmp/jk-before-latest'},
    '--after': {arg: '来源', desc: '改动后', default: 'worktree'},
    '--list': {arg: 'N', desc: '每类差异最多列出几条', default: '15'},
    '--out': {arg: '目录', desc: 'JSON 报告目录（默认自动建在 /tmp）'},
  },
});
const cmd = rest[0];

function resolve(spec, label) {
  if (spec === 'worktree') { const b = buildTheme(mkTmp(`jk-${label}-`)); return {...b, source: '当前工作树'}; }
  if (fs.existsSync(spec)) {
    const p = fs.statSync(spec).isDirectory() ? path.join(spec, 'theme.css') : spec;
    if (!fs.existsSync(p)) die(`${spec} 里没有 theme.css`);
    const css = fs.readFileSync(p);
    return {cssPath: p, bytes: css.length, sha256: sha256(css), source: p};
  }
  const root = exportGitRef(spec);
  const b = buildTheme(mkTmp(`jk-${label}-`), root);
  return {...b, source: `git ${spec}`};
}

if (cmd === 'save') {
  const name = (opts.label || new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)).replace(/[^\w.-]/g, '_');
  const dir = `/tmp/jk-before-${name}`;
  fs.rmSync(dir, {recursive: true, force: true});
  const b = buildTheme(dir);
  fs.rmSync('/tmp/jk-before-latest', {force: true});
  fs.symlinkSync(dir, '/tmp/jk-before-latest');
  console.log(`已保存“改动前”构建：${dir}\n  ${fmtBytes(b.bytes)}  sha256 ${b.sha256}\n  /tmp/jk-before-latest → ${dir}`);
  process.exit(0);
}
if (cmd !== 'diff') die('需要子命令 save 或 diff，见 --help');

const before = resolve(opts.before, 'before');
const after = resolve(opts.after, 'after');
const N = Number(opts.list);
const out = opts.out || mkTmp('jk-build-compare-');
fs.mkdirSync(out, {recursive: true});
const report = {before: {source: before.source, bytes: before.bytes, sha256: before.sha256}, after: {source: after.source, bytes: after.bytes, sha256: after.sha256}, identical: before.sha256 === after.sha256, overLimit: after.bytes > LIMIT};

console.log(`改动前  ${fmtBytes(before.bytes).padStart(14)}  ${before.sha256}  （${before.source}）`);
console.log(`改动后  ${fmtBytes(after.bytes).padStart(14)}  ${after.sha256}  （${after.source}）`);
console.log(`体积变化 ${after.bytes - before.bytes >= 0 ? '+' : ''}${after.bytes - before.bytes} B；上限余量 ${LIMIT - after.bytes} B${report.overLimit ? '  ⚠ 超过 1 MiB 上限' : ''}`);

if (report.identical) {
  console.log('结果：逐字节完全相同。');
} else {
  const sources = partSources();
  const load = (p) => { const css = fs.readFileSync(p, 'utf8'); return {rules: parseCss(css), secs: sections(css)}; };
  const A = load(before.cssPath), B = load(after.cssPath);
  const where = (side, r) => {
    const s = sectionAt(side.secs, r.offset);
    if (!s) return `第 ${r.line} 行`;
    const file = sources[s.name] || s.name;
    return `${file}:${r.line - s.line}`;
  };
  // Pair equal rules by key and occurrence; unpaired = added/removed; paired but out of order = moved (LIS).
  const pool = new Map();
  A.rules.forEach((r, idx) => { const k = r.key; if (!pool.has(k)) pool.set(k, []); pool.get(k).push(idx); });
  const pairs = [], added = [];
  B.rules.forEach((r, idx) => { const q = pool.get(r.key); if (q?.length) pairs.push([q.shift(), idx]); else added.push(idx); });
  const removed = [...pool.values()].flat().sort((x, y) => x - y);
  const seq = pairs.map((p) => p[0]);
  const tails = [], prev = new Array(seq.length), tailIdx = [];
  seq.forEach((v, k) => {
    let lo = 0, hi = tails.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < v) lo = m + 1; else hi = m; }
    tails[lo] = v; tailIdx[lo] = k; prev[k] = lo ? tailIdx[lo - 1] : -1;
  });
  const keep = new Set();
  for (let k = tailIdx[tails.length - 1]; k !== undefined && k >= 0; k = prev[k]) keep.add(k);
  const moved = pairs.filter((_, k) => !keep.has(k));
  const brief = (r) => `${[...r.ctx, r.selector].join(' » ')}`.slice(0, 150);
  report.rules = {before: A.rules.length, after: B.rules.length, added: added.length, removed: removed.length, moved: moved.length};
  report.added = added.map((k) => ({at: where(B, B.rules[k]), rule: brief(B.rules[k]), text: B.rules[k].text.slice(0, 300)}));
  report.removed = removed.map((k) => ({at: where(A, A.rules[k]), rule: brief(A.rules[k]), text: A.rules[k].text.slice(0, 300)}));
  report.moved = moved.map(([a, b]) => ({from: where(A, A.rules[a]), to: where(B, B.rules[b]), rule: brief(A.rules[a])}));
  console.log(`结果：字节不同。规则 ${A.rules.length} → ${B.rules.length}；新增 ${added.length}，删除 ${removed.length}，仅移动位置 ${moved.length}。`);
  const show = (title, list, fmt) => { if (!list.length) return; console.log(`\n${title}（${list.length}）`); for (const x of list.slice(0, N)) console.log('  ' + fmt(x)); if (list.length > N) console.log(`  …其余 ${list.length - N} 条见报告`); };
  show('新增', report.added, (x) => `${x.at}  ${x.rule}`);
  show('删除', report.removed, (x) => `${x.at}  ${x.rule}`);
  show('移动', report.moved, (x) => `${x.from} → ${x.to}  ${x.rule}`);
  if (!added.length && !removed.length) console.log('\n内容完全相同，只是顺序变了。是否影响外观要用 style-diff.mjs 验证。');
}
fs.copyFileSync(before.cssPath, path.join(out, 'before.css'));
fs.copyFileSync(after.cssPath, path.join(out, 'after.css'));
writeJson(path.join(out, 'report.json'), report);
console.log(`\n报告与两份 CSS：${out}/{report.json,before.css,after.css}`);
process.exit(report.identical ? 0 : 1);
