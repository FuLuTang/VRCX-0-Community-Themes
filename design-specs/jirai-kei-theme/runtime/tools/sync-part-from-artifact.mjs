#!/usr/bin/env node
/*
 * sync-part-from-artifact.mjs — audit (and optionally repair) source drift.
 *
 * WHY THIS EXISTS
 * ---------------
 * The built artifact (preview-package/jirai-kei-theme/theme.css) is the CSS the real
 * app runs, and it is the refactor target. It can drift ahead of runtime/*.css when a
 * change is made straight in the artifact (e.g. checks/element-style-audit/
 * patch-shared-button-states.mjs rewrites the tail in place) or on another machine.
 *
 * Drift is dangerous for two reasons:
 *   1. `node build-runtime.mjs` silently produces a *different* stylesheet, so any
 *      verification you run against a rebuild is measuring the wrong thing.
 *   2. Step 1's acceptance criterion is byte equality with the artifact, so the drift
 *      must be either repaired or consciously rejected — never ignored.
 *
 * USAGE
 *   node tools/sync-part-from-artifact.mjs <section-id> <source-file>            # dry run
 *   node tools/sync-part-from-artifact.mjs <section-id> <source-file> --write    # repair
 *
 * Default is read-only: it prints whether the two agree and, when they differ, the
 * byte counts and the first divergence point. --write copies the artifact's section
 * text into the source file.
 *
 * The section text is reconstructed exactly the way build-runtime.mjs assembles it:
 *   `/* SECTION <name> *\/\n` + source-text, joined across parts with '\n'.
 * Every part except the last therefore owns a trailing '\n' from the join, which is
 * stripped before comparing or writing.
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.dirname(here);
const artifactPath = path.join(runtime, 'preview-package', 'jirai-kei-theme', 'theme.css');

const argv = process.argv.slice(2);
const write = argv.includes('--write');
const positional = argv.filter((a) => !a.startsWith('--'));
const [sectionId, fileName] = positional;

if (!sectionId || !fileName) {
  console.error('usage: node tools/sync-part-from-artifact.mjs <section-id> <source-file> [--write]');
  console.error('example: node tools/sync-part-from-artifact.mjs buttons-badges-r10 buttons-badges-r10.css');
  process.exit(2);
}

const css = fs.readFileSync(artifactPath, 'utf8');
const marks = [];
{
  const re = /\/\* SECTION ([a-z0-9-]+)/g;
  let m;
  while ((m = re.exec(css))) marks.push({name: m[1], idx: m.index});
}

const i = marks.findIndex((mk) => mk.name === sectionId);
if (i < 0) throw new Error(`section not found in artifact: ${sectionId}`);

const start = marks[i].idx;
const end = i + 1 < marks.length ? marks[i + 1].idx : css.length;
const isLast = i + 1 >= marks.length;

// The marker text is everything up to the first newline after the marker start.
const nl = css.indexOf('\n', start);
const markerLine = css.slice(start, nl + 1);
let body = css.slice(nl + 1, end);
if (!isLast) {
  if (!body.endsWith('\n')) throw new Error(`expected join separator for ${sectionId}`);
  body = body.slice(0, -1);
}

const filePath = path.join(runtime, fileName);
const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;

console.log(`section      : ${sectionId}  (marker index ${i + 1}/${marks.length}${isLast ? ', last part' : ''})`);
console.log(`marker line  : ${JSON.stringify(markerLine)}`);
console.log(`source file  : ${fileName}`);
console.log(`artifact body: ${Buffer.byteLength(body)} B`);
console.log(`source body  : ${current === null ? '(missing)' : Buffer.byteLength(current) + ' B'}`);

if (current === body) {
  console.log('\nIN SYNC — no drift.');
  process.exit(0);
}

// Report the first divergence so the drift is inspectable without a full dump.
let d = 0;
const max = Math.min(current ? current.length : 0, body.length);
while (d < max && current[d] === body[d]) d++;
const context = (s, from) => JSON.stringify(s.slice(from, from + 120));

console.log('\nDRIFT DETECTED');
if (current !== null) {
  console.log(`  common prefix     : ${d} chars (identical up to there)`);
  console.log(`  source   at diff  : ${context(current, d)}`);
}
console.log(`  artifact at diff  : ${context(body, d)}`);

if (!write) {
  console.log('\n(dry run — nothing written; re-run with --write to copy the artifact version into the source file)');
  process.exit(1);
}

fs.writeFileSync(filePath, body);
console.log(`\nWROTE ${fileName} from artifact (${Buffer.byteLength(body)} B).`);
