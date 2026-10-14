#!/usr/bin/env node
/*
 * extract-shadow-sections.mjs — Step 1 of the CSS refactor.
 *
 * WHY THIS EXISTS
 * ---------------
 * Three sections in the shipped artifact exist ONLY in the artifact: they are not
 * in runtime/*.css and not in build-runtime.mjs's `parts` array. They got there
 * because checks/element-style-audit/patch-shared-button-states.mjs rewrites the
 * tail of an already-built theme.css in place. Result: `node build-runtime.mjs`
 * silently reproduces a theme.css that is 8345 bytes short of the CSS the real
 * app is running, and 42 rules (34 + 8) vanish without any error.
 *
 * This script recovers those three blocks from the artifact so they can live in
 * the source tree like every other section, after which the build reproduces the
 * artifact byte-for-byte (sha256 6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260).
 *
 * WHAT IT DOES
 * ------------
 * Splits the artifact on `/* SECTION <name>` boundaries and writes the three
 * shadow blocks to plain .css files next to the other parts.
 *
 * MARKER GOTCHA
 * -------------
 * build-runtime.mjs emits `/* SECTION <part-name> *\/` verbatim, and part names
 * are arbitrary strings. Two of the three shadow sections carry a human-readable
 * description inside the marker itself, e.g.
 *     /* SECTION entity-button-roles-b054-b072: explicit action roles share portal states. *\/
 * so the *part name* must be the full string including the description. Writing
 * only the short id would silently drop the description and break byte equality.
 * SHADOWS below therefore maps short-id -> exact marker name -> output file.
 *
 * IDEMPOTENT: re-running reads the same artifact and writes the same bytes.
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.dirname(here);
const artifact = path.join(runtime, 'preview-package', 'jirai-kei-theme', 'theme.css');

/** [shortId, exactMarkerName, outputFileName] */
const SHADOWS = [
  ['portal-button-roles-b073-b100', 'portal-button-roles-b073-b100', 'portal-button-roles-b073-b100.css'],
  [
    'entity-button-roles-b054-b072',
    'entity-button-roles-b054-b072: explicit action roles share portal states.',
    'entity-button-roles-b054-b072.css',
  ],
  [
    'auth-button-feedback',
    'auth-button-feedback: retain login-r8 / privacy-lock-r96 paint.',
    'auth-button-feedback.css',
  ],
];

const css = fs.readFileSync(artifact, 'utf8');

// Every marker in document order.
const marks = [];
{
  const re = /\/\* SECTION ([a-z0-9-]+)/g;
  let m;
  while ((m = re.exec(css))) marks.push({name: m[1], idx: m.index});
}

let wrote = 0;
for (const [shortId, markerName, fileName] of SHADOWS) {
  const i = marks.findIndex((mk) => mk.name === shortId);
  if (i < 0) throw new Error(`marker not found in artifact: ${shortId}`);

  const start = marks[i].idx;
  const end = i + 1 < marks.length ? marks[i + 1].idx : css.length;
  const block = css.slice(start, end);

  // build-runtime.mjs writes exactly this, so recovering it must be exact too.
  const markerLine = '/* SECTION ' + markerName + ' */\n';
  if (!block.startsWith(markerLine)) {
    throw new Error(
      `marker text mismatch for ${shortId}\n` +
        `  expected: ${JSON.stringify(markerLine)}\n` +
        `  actual:   ${JSON.stringify(block.slice(0, markerLine.length))}`,
    );
  }

  let body = block.slice(markerLine.length);

  // build joins parts with '\n', so every part except the last carries a trailing
  // separator that belongs to the join, not to the part's own source file.
  if (i + 1 < marks.length) {
    if (!body.endsWith('\n')) throw new Error(`missing trailing separator newline for ${shortId}`);
    body = body.slice(0, -1);
  }

  const out = path.join(runtime, fileName);
  fs.writeFileSync(out, body);
  wrote++;
  const tag = i + 1 < marks.length ? 'join-separated' : 'last-part (no join newline)';
  console.log(`${fileName.padEnd(42)} ${String(Buffer.byteLength(body)).padStart(6)} B  [${shortId}] ${tag}`);
}

console.log(`\nwrote ${wrote} shadow section source files into ${runtime}`);
