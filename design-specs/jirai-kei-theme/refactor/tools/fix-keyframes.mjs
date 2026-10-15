#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const refactor = path.resolve(here, '..');
const artifactPath = path.resolve(refactor, '../runtime/preview-package/jirai-kei-theme/theme.css');
const outputPath = path.join(refactor, 'src/frozen/07-keyframes.css');
const reportPath = path.join(refactor, 'reports/P2B-2b-keyframes-fix.md');
const expected = [
  ['r5-charm-swing',127], ['r5-dialog-step-in',62], ['r5-spinner-step',62], ['r5-progress-flow',67],
  ['r7-tab-edge',274], ['r8-lace-flow',112], ['r8-nav-cursor',99], ['r8-window-press',147],
  ['r8-cat-hop',146], ['r9-notification-badge-flash',318], ['jk-loader-dance',107],
  ['r97-brand-heart-pixels',340], ['r96-nav-cat',306], ['r96-social-cat',395],
  ['r10-nav-phone-loop',8827], ['r10-nav-phone-float',114],
];
const source = await readFile(artifactPath);
const sourceText = source.toString('utf8');
const starts = [...sourceText.matchAll(/@keyframes[ \t]+[A-Za-z0-9_-]+/g)].map(m => ({
  char: m.index,
  byte: Buffer.byteLength(sourceText.slice(0, m.index), 'utf8'),
  name: /@keyframes[ \t]+([A-Za-z0-9_-]+)/.exec(m[0])[1],
}));
const blocks = [];
for (const start of starts) {
  let depth = 0, opened = false, end = -1;
  for (let i = start.byte; i < source.length; i++) {
    if (source[i] === 0x7b) { depth++; opened = true; }
    else if (source[i] === 0x7d) {
      depth--;
      if (opened && depth === 0) { end = i + 1; break; }
      if (depth < 0) throw new Error(`Unbalanced close brace in ${start.name}`);
    }
  }
  if (end < 0) throw new Error(`No balanced block terminator for ${start.name}`);
  blocks.push({ name: start.name, start: start.byte, end, bytes: source.subarray(start.byte, end) });
}
const failures = [];
if (blocks.length !== 16) failures.push(`期望 16 块，实测 ${blocks.length}`);
for (let i = 0; i < expected.length; i++) {
  const [name, size] = expected[i], block = blocks[i];
  if (!block || block.name !== name) failures.push(`第 ${i + 1} 块名：期望 ${name}，实测 ${block?.name ?? '缺失'}`);
  if (block && block.bytes.length !== size) failures.push(`${name} 字节数：期望 ${size}，实测 ${block.bytes.length}`);
}
const total = blocks.reduce((n, b) => n + b.bytes.length, 0);
if (total !== 11503) failures.push(`块字节总数期望 11503，实测 ${total}`);
for (const b of blocks) {
  const first = source.indexOf(b.bytes), second = source.indexOf(b.bytes, first + 1);
  if (first !== b.start || second !== -1) failures.push(`${b.name} indexOf 唯一性失败（首命中 ${first}，扫描起点 ${b.start}，第二命中 ${second}）`);
}
for (let i = 1; i < blocks.length; i++) if (blocks[i - 1].end > blocks[i].start) failures.push(`区间重叠：${blocks[i-1].name} / ${blocks[i].name}`);
const gapBytes = source.length - total;
const residualGapBytes = gapBytes - 709279;
if (source.length !== 1044718) failures.push(`artifact 字节数期望 1044718，实测 ${source.length}`);
if (residualGapBytes !== 323936) failures.push(`剔除资源段后区间空隙应为 323936，实测 ${residualGapBytes}`);
const joined = Buffer.concat(blocks.map(b => b.bytes));
const sha = createHash('sha256').update(joined).digest('hex');
const output = Buffer.concat(blocks.flatMap((b, i) => i ? [Buffer.from('\n'), b.bytes] : [b.bytes]));
let opens = 0, closes = 0;
for (const byte of output) { if (byte === 0x7b) opens++; if (byte === 0x7d) closes++; }
if (opens !== closes) failures.push(`输出花括号不平衡：{=${opens} }=${closes}`);
const phone = blocks.find(b => b.name === 'r10-nav-phone-loop')?.bytes.toString('utf8') ?? '';
const frameRules = [...phone.matchAll(/(?:^|\n)\s*([^{}]+?)\s*\{([^{}]*)\}/g)].map(m => ({ selector: m[1].trim(), body: m[2] }));
const percentFrames = frameRules.filter(r => /(?:^|,)\s*\d+(?:\.\d+)?%/.test(r.selector));
const selectors = percentFrames.flatMap(r => r.selector.split(',').map(s => s.trim())).filter(s => /^\d+(?:\.\d+)?%$/.test(s));
const everyFrameHasBg = percentFrames.length > 0 && percentFrames.every(r => /background-position\s*:/.test(r.body));
const everyBgOnSingleLine = percentFrames.length > 0 && percentFrames.every(r => r.body.split(/\r?\n/).filter(line => /background-position\s*:/.test(line)).length === 1);
const variableRefs = [...new Set([...phone.matchAll(/var\(\s*(--[\w-]+)/g)].map(m => m[1]))];
const stepsRefs = [...phone.matchAll(/steps\([^)]*\)/g)].map(m => m[0]);
const report = [
  '# P2B-2b Keyframes 冻结层修复报告', '',
  `源 artifact：\`${path.relative(process.cwd(), artifactPath)}\`（${source.length.toLocaleString('en-US')} B）`,
  '提取：正则定位 `@keyframes[ \\t]+[A-Za-z0-9_-]+`，随后逐字节扫描花括号并在首度归零处闭合；块文本按原始 Buffer 保留。',
  '块间分隔：每块之间恰好一个 LF（0x0A），拼接 SHA-256 与字节总数校验排除这些分隔符。', '',
  '## 校验结果', '',
  '| 动画名 | 期望 B | 实测 B | artifact 唯一命中 |', '|---|---:|---:|:---:|',
  ...blocks.map((b, i) => `| \`${b.name}\` | ${expected[i]?.[1] ?? '—'} | ${b.bytes.length} | ${source.indexOf(b.bytes) === b.start && source.indexOf(b.bytes, b.start + 1) === -1 ? '是（1 次）' : '否'} |`), '',
  `a) 总块字节：**${total.toLocaleString('en-US')} B**（期望 11,503 B）；逐块长度符合表格：**${blocks.length === 16 && blocks.every((b,i)=>b.name===expected[i][0]&&b.bytes.length===expected[i][1]) ? '是' : '否'}**。`,
  `b) 写出文件花括号：**{ ${opens}，} ${closes}，${opens === closes ? '相等' : '不等'}**。`,
  `c) 16 块各在 artifact 中精确命中 1 次；互不重叠：**${blocks.every((b,i)=>source.indexOf(b.bytes)===b.start&&source.indexOf(b.bytes,b.start+1)===-1&&(i===0||blocks[i-1].end<=b.start)) ? '是' : '否'}**。`,
  `d) 16 块顺序拼接（不计 LF 分隔）SHA-256：\`${sha}\`。`,
  `e) artifact 区间互不重叠：**${blocks.every((b,i)=>i===0||blocks[i-1].end<=b.start) ? '是' : '否'}**；所有非块字节间隙合计 ${gapBytes.toLocaleString('en-US')} B，扣除资源段 709,279 B 后为 **${residualGapBytes.toLocaleString('en-US')} B**（目标 323,936 B）。`, '',
  '## `r10-nav-phone-loop` 结构', '',
  `完整大小 8,827 B；识别到 ${percentFrames.length} 个含百分比选择器的关键帧规则，选择器中共 ${selectors.length} 个百分比点。每帧均有且仅有一条 background-position，声明所在行为单行（与同帧其他属性共行）：**${everyFrameHasBg && everyBgOnSingleLine ? '是' : '否'}**。引用 CSS 变量 ${variableRefs.length} 个：${variableRefs.map(x=>'`'+x+'`').join('、')}。使用 steps() 时间函数：${stepsRefs.length ? `是，共 ${stepsRefs.length} 次，函数为 ${[...new Set(stepsRefs)].map(x=>'`'+x+'`').join('、')}` : '否'}。规则体统计基于完整块内关键帧规则。`,
  '', '## 旧文件问题与边界', '',
  '旧版 `07-keyframes.css` 在每个动画仅写入第一行/第一条关键帧声明，并在下一个 `@keyframes` 起点截断，导致所有定义缺少剩余关键帧与闭合结构；首块在 artifact 中因此无法精确命中。',
  '本脚本只写本报告与 `src/frozen/07-keyframes.css`；artifact、runtime 及其他冻结文件均不改。', '',
  failures.length ? `**失败，未写 CSS：** ${failures.join('；')}` : '**所有强制校验通过。**', ''
].join('\n');
if (failures.length) {
  await writeFile(reportPath, report, 'utf8');
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  await writeFile(outputPath, output);
  await writeFile(reportPath, report, 'utf8');
  console.log(`Validated ${blocks.length} blocks; ${total} B; braces ${opens}/${closes}; gaps ${residualGapBytes} B; sha256 ${sha}`);
}
