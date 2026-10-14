#!/usr/bin/env node
/* Compare two static-replay snapshot directories by locator and every frozen property. */
import fs from 'node:fs';
import path from 'node:path';

const [dirA, dirB] = process.argv.slice(2);
if (!dirA || !dirB) {
  console.error('usage: node check-idempotency.mjs <snapshot-dir-a> <snapshot-dir-b>');
  process.exit(2);
}
const filesA = fs.readdirSync(dirA).filter((f) => f.endsWith('.json')).sort();
const filesB = fs.readdirSync(dirB).filter((f) => f.endsWith('.json')).sort();
const namesA = new Set(filesA);
const namesB = new Set(filesB);
const routes = [...new Set([...filesA, ...filesB])].sort();
let failCount = 0;
console.log('route'.padEnd(38), 'A/B elements', 'path missing A/B', 'identity', 'style diffs', 'result');
console.log('-'.repeat(100));
for (const file of routes) {
  if (!namesA.has(file) || !namesB.has(file)) {
    failCount++;
    console.log(file.replace(/\.json$/, '').padEnd(38), '—', '—', '—', 'MISSING FILE');
    continue;
  }
  const a = JSON.parse(fs.readFileSync(path.join(dirA, file), 'utf8'));
  const b = JSON.parse(fs.readFileSync(path.join(dirB, file), 'utf8'));
  const mapA = new Map(a.elements.map((e) => [e.path, e]));
  const mapB = new Map(b.elements.map((e) => [e.path, e]));
  const dupA = a.elements.length - mapA.size;
  const dupB = b.elements.length - mapB.size;
  let onlyA = 0, onlyB = 0, identityDiffs = 0, styleDiffs = 0;
  const samples = [];
  for (const [locator, ea] of mapA) {
    const eb = mapB.get(locator);
    if (!eb) { onlyA++; continue; }
    if (ea.tag !== eb.tag || JSON.stringify(ea.attrs) !== JSON.stringify(eb.attrs)) identityDiffs++;
    for (const prop of a.propertySet) {
      if (ea.styles[prop] !== eb.styles[prop]) {
        styleDiffs++;
        if (samples.length < 3) samples.push(`${prop} at ${locator.slice(-55)}: ${JSON.stringify(ea.styles[prop])} -> ${JSON.stringify(eb.styles[prop])}`);
      }
    }
  }
  for (const locator of mapB.keys()) if (!mapA.has(locator)) onlyB++;
  const propertySetDiff = JSON.stringify(a.propertySet) !== JSON.stringify(b.propertySet);
  const ok = !onlyA && !onlyB && !identityDiffs && !styleDiffs && !dupA && !dupB && !propertySetDiff;
  if (!ok) failCount++;
  console.log(
    file.replace(/\.json$/, '').padEnd(38),
    `${a.elementCount}/${b.elementCount}`.padStart(11),
    `${onlyA}/${onlyB}`.padStart(14),
    String(identityDiffs).padStart(8),
    String(styleDiffs).padStart(11),
    ok ? 'PASS' : `FAIL${dupA || dupB ? ` duplicates=${dupA}/${dupB}` : ''}${identityDiffs ? ` identity=${identityDiffs}` : ''}${propertySetDiff ? ' property-set-diff' : ''}`, 
  );
  for (const sample of samples) console.log(`  ${sample}`);
}
console.log('-'.repeat(100));
console.log(`${routes.length - failCount}/${routes.length} route snapshots identical`);
process.exit(failCount ? 1 : 0);
