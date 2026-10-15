#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const artifact = path.join(root, 'runtime/preview-package/jirai-kei-theme/theme.css');
const out = path.join(os.tmpdir(), `jirai-kei-section-order-${process.pid}.css`);
execFileSync(process.execPath, [path.join(root, 'refactor/tools/build-theme.mjs'), '--out', out], { stdio: 'inherit' });
const extractSections = text => [...text.matchAll(/^\/\* SECTION ([^\r\n*]+?) \*\/$/gm)].map(m => m[1].trim());
const countRules = text => {
  // Count CSS qualified-rule blocks, excluding at-rule blocks and keyframe steps.
  const css = text.replace(/\/\*[\s\S]*?\*\//g, '');
  let i = 0, count = 0;
  function scan() {
    while (i < css.length) {
      while (/\s/.test(css[i] ?? '')) i++;
      if (i >= css.length || css[i] === '}') { i++; return; }
      const start = i;
      while (i < css.length && css[i] !== '{') i++;
      if (i >= css.length) return;
      const header = css.slice(start, i).trim(); i++;
      if (!header.startsWith('@')) count++;
      if (/^@(media|supports|container|layer|document)\b/i.test(header)) scan();
      else {
        let depth = 1;
        while (i < css.length && depth) { if (css[i] === '{') depth++; else if (css[i] === '}') depth--; i++; }
      }
    }
  }
  scan();
  return count;
};
const a = fs.readFileSync(artifact, 'utf8');
const b = fs.readFileSync(out, 'utf8');
const as = extractSections(a), bs = extractSections(b);
const sectionMatch = JSON.stringify(as) === JSON.stringify(bs);
const ar = countRules(a), br = countRules(b);
console.log(`artifact SECTION 序列 (${as.length}): ${as.join(' | ')}`);
console.log(`build    SECTION 序列 (${bs.length}): ${bs.join(' | ')}`);
if (!sectionMatch) {
  console.log('SECTION 差异:');
  for (let i = 0; i < Math.max(as.length, bs.length); i++) if (as[i] !== bs[i]) console.log(`  [${i + 1}] artifact=${as[i] ?? '<缺失>'}; build=${bs[i] ?? '<缺失>'}`);
} else console.log('SECTION 序列差异: 无');
console.log(`规则数: artifact=${ar}; build=${br}; 差异=${br - ar}`);
const ao = (a.match(/\{/g) ?? []).length, ac = (a.match(/\}/g) ?? []).length;
const bo = (b.match(/\{/g) ?? []).length, bc = (b.match(/\}/g) ?? []).length;
console.log(`括号配平: artifact ${ao === ac ? 'PASS' : 'FAIL'} (${ao}/${ac}); build ${bo === bc ? 'PASS' : 'FAIL'} (${bo}/${bc})`);
console.log(`RESULT: ${sectionMatch && ar === br ? 'PASS' : 'FAIL'}`);
if (!sectionMatch || ar !== br) process.exitCode = 1;
