#!/usr/bin/env node
/* Compare a candidate-CSS replay directory against the frozen canonical baseline. */
import fs from 'node:fs';
import path from 'node:path';

const [baselineDir, candidateDir] = process.argv.slice(2);
if (!baselineDir || !candidateDir) {
  console.error('usage: node compare-snapshots.mjs <baseline-snapshot-dir> <candidate-snapshot-dir>');
  process.exit(2);
}
const list = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
const baseFiles = list(baselineDir), candidateFiles = list(candidateDir);
const baseSet = new Set(baseFiles), candidateSet = new Set(candidateFiles);
const names = [...new Set([...baseFiles, ...candidateFiles])].sort();
let failedRoutes = 0;
let totalStyleDiffs = 0;

console.log('state'.padEnd(44), 'elements B/C', 'missing B/C', 'identity', 'style diffs', 'result');
console.log('-'.repeat(112));
for (const file of names) {
  if (!baseSet.has(file) || !candidateSet.has(file)) {
    failedRoutes++;
    console.log(file.replace(/\.json$/, '').padEnd(44), '—', '—', '—', '—', 'MISSING SNAPSHOT');
    continue;
  }
  const baseline = JSON.parse(fs.readFileSync(path.join(baselineDir, file), 'utf8'));
  const candidate = JSON.parse(fs.readFileSync(path.join(candidateDir, file), 'utf8'));
  const a = new Map(baseline.elements.map((e) => [e.path, e]));
  const b = new Map(candidate.elements.map((e) => [e.path, e]));
  const duplicateA = baseline.elements.length - a.size;
  const duplicateB = candidate.elements.length - b.size;
  let onlyA = 0, onlyB = 0, identityDiffs = 0, styleDiffs = 0;
  const propertyCounts = new Map();
  const samples = [];
  for (const [locator, ea] of a) {
    const eb = b.get(locator);
    if (!eb) { onlyA++; continue; }
    if (ea.tag !== eb.tag || JSON.stringify(ea.attrs) !== JSON.stringify(eb.attrs)) identityDiffs++;
    for (const prop of baseline.propertySet) {
      if (ea.styles[prop] !== eb.styles[prop]) {
        styleDiffs++;
        propertyCounts.set(prop, (propertyCounts.get(prop) || 0) + 1);
        if (samples.length < 5) samples.push(`${prop} @ ${locator.slice(-65)}: ${JSON.stringify(ea.styles[prop])} -> ${JSON.stringify(eb.styles[prop])}`);
      }
    }
  }
  for (const locator of b.keys()) if (!a.has(locator)) onlyB++;
  const propertySetDiff = JSON.stringify(baseline.propertySet) !== JSON.stringify(candidate.propertySet);
  const ok = !onlyA && !onlyB && !identityDiffs && !styleDiffs && !duplicateA && !duplicateB && !propertySetDiff;
  totalStyleDiffs += styleDiffs;
  if (!ok) failedRoutes++;
  console.log(
    file.replace(/\.json$/, '').padEnd(44),
    `${baseline.elementCount}/${candidate.elementCount}`.padStart(11),
    `${onlyA}/${onlyB}`.padStart(11),
    String(identityDiffs).padStart(8),
    String(styleDiffs).padStart(11),
    ok ? 'PASS' : 'FAIL',
  );
  for (const sample of samples) console.log(`  ${sample}`);
  if (propertyCounts.size) {
    console.log(`  properties: ${[...propertyCounts].sort((x, y) => y[1] - x[1]).map(([k,v]) => `${k}=${v}`).join(', ')}`);
  }
}
console.log('-'.repeat(112));
console.log(`${names.length - failedRoutes}/${names.length} states byte-comparable across the frozen property set; ${totalStyleDiffs} style differences`);
process.exit(failedRoutes ? 1 : 0);
