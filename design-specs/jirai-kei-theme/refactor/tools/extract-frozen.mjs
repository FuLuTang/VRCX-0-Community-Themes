#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const refactor = path.resolve(here, '..');
const artifact = path.resolve(refactor, '../runtime/preview-package/jirai-kei-theme/theme.css');
const outputDir = path.join(refactor, 'src/frozen');
const reportPath = path.join(refactor, 'reports/P2B-1-resources.md');
// This array is the authoritative concatenation order; never infer it from filenames.
const sections = [
  { name: 'fonts', file: '01-fonts.css', expected: 480309 },
  { name: 'native-icons', file: '02-native-icons.css', expected: 9008 },
  { name: 'icons', file: '03-icons.css', expected: 111152 },
  { name: 'assets', file: '04-assets.css', expected: 25582 },
  { name: 'assets-r5', file: '05-assets-r5.css', expected: 79362 },
  { name: 'assets-r7', file: '06-assets-r7.css', expected: 3866 },
];

const source = await readFile(artifact);
const marker = Buffer.from('/* SECTION ');
const starts = [];
for (let pos = 0; (pos = source.indexOf(marker, pos)) !== -1; pos += marker.length) {
  const nl = source.indexOf(0x0a, pos);
  if (nl === -1) throw new Error(`Section marker lacks terminating newline at byte ${pos}`);
  const line = source.subarray(pos, nl).toString('utf8');
  const match = /^\/\* SECTION ([^*]+) \*\/$/.exec(line);
  if (match) starts.push({ name: match[1], pos });
}
const slices = new Map();
for (let i = 0; i < starts.length; i++) {
  const end = i + 1 < starts.length ? starts[i + 1].pos : source.length;
  slices.set(starts[i].name, source.subarray(starts[i].pos, end));
}

await mkdir(outputDir, { recursive: true });
await mkdir(path.dirname(reportPath), { recursive: true });
const extracted = [];
for (const section of sections) {
  const bytes = slices.get(section.name);
  if (!bytes) throw new Error(`Missing section: ${section.name}`);
  await writeFile(path.join(outputDir, section.file), bytes);
  extracted.push({ ...section, bytes, actual: bytes.length, sha: createHash('sha256').update(bytes).digest('hex') });
}
const expectedConcat = Buffer.concat(extracted.map(x => x.bytes));
const actualConcat = Buffer.concat(await Promise.all(sections.map(s => readFile(path.join(outputDir, s.file)))));
const concatSame = expectedConcat.equals(actualConcat);
const concatSha = createHash('sha256').update(actualConcat).digest('hex');
const concatBytes = actualConcat.length;

// Audit custom-property references/definitions across only these six frozen sections.
const definitions = new Map();
const references = [];
for (const item of extracted) {
  const text = item.bytes.toString('utf8');
  for (const m of text.matchAll(/(--[\w-]+)\s*:/g)) {
    const list = definitions.get(m[1]) ?? new Set(); list.add(item.name); definitions.set(m[1], list);
  }
  for (const m of text.matchAll(/var\(\s*(--[\w-]+)/g)) references.push({ variable: m[1], section: item.name });
}
const varIssues = references.filter(r => !definitions.has(r.variable));
const crossVars = references.filter(r => [...(definitions.get(r.variable) ?? [])].some(s => s !== r.section));

// Also detect cross-section animation-name usage and declared font-family usage.
const keyframes = new Map(); const animationRefs = [];
for (const item of extracted) {
  const text = item.bytes.toString('utf8');
  for (const m of text.matchAll(/@keyframes\s+([\w-]+)/g)) keyframes.set(m[1], item.name);
  for (const m of text.matchAll(/(?:animation(?:-name)?\s*:\s*)[^;{}]*/g)) {
    const names = [...m[0].matchAll(/\b([\w-]+)\b/g)].map(x => x[1]);
    for (const name of names) if (keyframes.has(name)) animationRefs.push({ name, section: item.name, definedIn: keyframes.get(name) });
  }
}
const fontDefs = new Map(); const fontUses = [];
for (const item of extracted) {
  const text = item.bytes.toString('utf8');
  for (const m of text.matchAll(/font-family\s*:\s*([^;{}]+)/g)) fontDefs.set(m[1].trim().replace(/^['"]|['"]$/g, ''), item.name);
  for (const m of text.matchAll(/font-family\s*:\s*([^;{}]+)/g)) fontUses.push({ family: m[1].trim().replace(/^['"]|['"]$/g, ''), section: item.name });
}
const crossFonts = fontUses.filter(x => fontDefs.has(x.family) && fontDefs.get(x.family) !== x.section);
const sameSizes = extracted.every(x => x.actual === x.expected);

const lines = [
  '# P2B-1 资源段冻结提取报告', '',
  `源 artifact：\`${path.relative(process.cwd(), artifact)}\``,
  '提取方式：按 `/* SECTION <name> */` 起始字节边界截取至下一 section 标记前，原始 Buffer 写出；不做文本格式化。', '',
  '| Section | 期望字节 | 实测字节 | SHA-256 | 一致 |',
  '|---|---:|---:|---|:---:|',
  ...extracted.map(x => `| \`${x.name}\` | ${x.expected} | ${x.actual} | \`${x.sha}\` | ${x.expected === x.actual ? '是' : '否'} |`), '',
  `拼接顺序：${sections.map(x => `\`${x.file}\``).join(' → ')}`, 
  `拼接总字节：${concatBytes}；SHA-256：\`${concatSha}\`。`,
  `与 artifact 同序所取 6 段拼接逐字节相同：**${concatSame ? '是' : '否'}**。`,
  `所有段字节数符合预期：**${sameSizes ? '是' : '否'}**。`, '',
  '## 跨段依赖检查', '',
  `CSS 自定义属性 var(--...) 引用：${varIssues.length ? `有未在这六段定义的引用：${varIssues.map(x => `\`${x.variable}\`（${x.section}）`).join('、')}` : '所有引用均可在本段或这六段中的其他段找到定义'}。`,
  crossVars.length ? `跨段自定义属性引用：${[...new Set(crossVars.map(x => `${x.variable}: ${x.section} → ${[...(definitions.get(x.variable) ?? [])].filter(s => s !== x.section).join(', ')}`))].map(x => `\`${x}\``).join('；')}。` : '未发现跨段自定义属性引用。',
  crossFonts.length ? `跨段字体族引用：${crossFonts.map(x => `\`${x.family}\`（${x.section}，定义于 ${fontDefs.get(x.family)}）`).join('；')}。` : '未发现可识别的跨段字体族引用。',
  animationRefs.length ? `跨段动画名引用：${animationRefs.filter(x => x.section !== x.definedIn).map(x => `\`${x.name}\`（${x.section} → ${x.definedIn}）`).join('；') || '未发现。'}` : '未发现跨段动画名引用。',
  '', '依赖审计范围仅限上述六个冻结段；未修改 artifact 或任何现有 CSS。', ''
];
await writeFile(reportPath, lines.join('\n'), 'utf8');
if (!sameSizes || !concatSame || varIssues.length || crossVars.length) process.exitCode = 1;
console.log(`Wrote ${extracted.length} sections; ${concatBytes} bytes; sha256 ${concatSha}; byte-identical=${concatSame}; expected-sizes=${sameSizes}`);
