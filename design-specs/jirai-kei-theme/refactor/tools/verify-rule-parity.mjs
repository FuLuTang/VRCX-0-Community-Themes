#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const baselinePath = path.join(root, 'refactor/reference/baseline-theme.css');
const tempBuild = path.join('/tmp', `jk-rule-parity-${process.pid}.css`);
execFileSync(process.execPath, [path.join(root, 'refactor/tools/build-theme.mjs'), '--out', tempBuild], { stdio: 'ignore' });
const baseline = fs.readFileSync(baselinePath, 'utf8');
const built = fs.readFileSync(tempBuild, 'utf8');

function sections(css) {
  const markers = [...css.matchAll(/\/\* SECTION ([^*]+?) \*\//g)];
  const out = new Map();
  for (let i = 0; i < markers.length; i++) {
    const name = markers[i][1].trim().replace(/:.*$/, '');
    const start = markers[i].index + markers[i][0].length;
    const end = markers[i + 1]?.index ?? css.length;
    if (!out.has(name)) out.set(name, []);
    out.get(name).push(css.slice(start, end));
  }
  return out;
}
function stripComments(s) { return s.replace(/\/\*[\s\S]*?\*\//g, ''); }
function balancedRemove(s, re) {
  let m;
  while ((m = re.exec(s))) {
    const open = s.indexOf('{', m.index);
    if (open < 0) break;
    let depth = 0, end = open;
    for (; end < s.length; end++) { if (s[end] === '{') depth++; else if (s[end] === '}' && --depth === 0) break; }
    if (end >= s.length) break;
    s = s.slice(0, m.index) + s.slice(end + 1);
    re.lastIndex = 0;
  }
  return s;
}
function canonical(s) {
  s = stripComments(s);
  s = balancedRemove(s, /@keyframes\s+[\w-]+/g);
  s = balancedRemove(s, /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/gi);
  // Explicit equivalent expansions allowed for the finite suffix-selector rewrites.
  const aliases = [
    [/\[data-slot\$="menu-separator"\]/g, '[data-slot="dropdown-menu-separator"]'],
    [/\[data-slot\$="menu-item"\]/g, '[data-slot="context-menu-item"],[data-slot="dropdown-menu-item"],[data-slot="sidebar-menu-item"]'],
    [/\[data-slot\$="menu-content"\]/g, '[data-slot="context-menu-content"],[data-slot="dropdown-menu-content"]'],
    [/\[data-slot\$="menu-sub-content"\]/g, '[data-slot="context-menu-sub-content"],[data-slot="dropdown-menu-sub-content"]'],
    [/\[data-slot\$="menu-checkbox-item"\]/g, '[data-slot="context-menu-checkbox-item"],[data-slot="dropdown-menu-checkbox-item"]'],
    [/\[data-slot\$="menu-radio-item"\]/g, '[data-slot="context-menu-radio-item"],[data-slot="dropdown-menu-radio-item"]'],
    [/\[data-slot\$="menu-sub-trigger"\]/g, '[data-slot="context-menu-sub-trigger"],[data-slot="dropdown-menu-sub-trigger"]'],
    [/\[data-slot\$="dialog-content"\]/g, '[data-slot="alert-dialog-content"],[data-slot="dialog-content"]'],
    [/\[data-slot\$="dialog-header"\]/g, '[data-slot="alert-dialog-header"],[data-slot="dialog-header"]'],
    [/\[data-slot\$="title"\]/g, '[data-slot="alert-dialog-title"],[data-slot="alert-title"],[data-slot="card-title"],[data-slot="dialog-title"],[data-slot="empty-title"],[data-slot="sheet-title"],[data-slot="toast-title"]'],
    [/\[data-slot\$="description"\]/g, '[data-slot="alert-description"],[data-slot="card-description"],[data-slot="empty-description"],[data-slot="field-description"],[data-slot="toast-description"]'],
    [/\[data-slot\$="-item"\]/g, '[data-slot="combobox-item"],[data-slot="context-menu-item"],[data-slot="dropdown-menu-item"],[data-slot="menubar-item"],[data-slot="pagination-item"],[data-slot="select-item"],[data-slot="sidebar-menu-item"],[data-slot="timeline-item"]'],
    [/\[data-slot\$="-trigger"\]/g, '[data-slot="combobox-trigger"],[data-slot="context-menu-trigger"],[data-slot="dropdown-menu-trigger"],[data-slot="hover-card-trigger"],[data-slot="menubar-trigger"],[data-slot="popover-trigger"],[data-slot="select-trigger"],[data-slot="sheet-trigger"],[data-slot="tooltip-trigger"]'],
  ];
  for (const [re, value] of aliases) s = s.replace(re, value);
  return s.replace(/\s+/g, '').replace(/;}/g, '}');
}
const a = sections(baseline), b = sections(built);
const names = ['motion','motion-r7','motion-r8','badge-r9','popups-r9','tools-ui-r9','avatars-status-r9','loader-r9','brand-heart-r97','cat-motion-r96','dialog-header-r97','nav-phone-r10','entity-button-roles-b054-b072','form-controls-r9','fields-toolbar-r10'];
let pass = true;
const differences = [];
for (const name of names) {
  const left = canonical((a.get(name) ?? []).join('\n'));
  const right = canonical((b.get(name) ?? []).join('\n'));
  const equal = left === right;
  console.log(`SECTION ${name}: ${equal ? 'PASS' : 'DIFF'} (baseline=${(a.get(name) ?? []).length ? 'present' : 'missing'}, build=${(b.get(name) ?? []).length ? 'present' : 'missing'})`);
  if (!equal) {
    pass = false;
    differences.push({ section: name, baselineLength: left.length, buildLength: right.length, baselineExcerpt: left.slice(0, 220), buildExcerpt: right.slice(0, 220) });
  }
}
// Cross-section audit for the permitted extraction: report keyframe names and reduced-motion rule counts.
const keyNames = s => [...stripComments(s).matchAll(/@keyframes\s+([\w-]+)/g)].map(m => m[1]).sort();
const reducedCount = s => [...s.matchAll(/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/gi)].length;
const ka = keyNames(baseline), kb = keyNames(built);
const motionAudit = JSON.stringify(ka) === JSON.stringify(kb) && reducedCount(baseline) === reducedCount(built);
console.log(`KNOWN EXTRACTION audit: keyframes baseline=${ka.length}, build=${kb.length}, name-set=${JSON.stringify(ka) === JSON.stringify(kb) ? 'equal' : 'DIFF'}; reduced-motion blocks baseline=${reducedCount(baseline)}, build=${reducedCount(built)}; ${motionAudit ? 'PASS' : 'DIFF'}`);
if (!motionAudit) { pass = false; differences.push({ section: 'cross-section keyframes/reduced-motion extraction', baselineKeyframes: ka, buildKeyframes: kb, baselineReducedMotion: reducedCount(baseline), buildReducedMotion: reducedCount(built) }); }
if (differences.length) console.log(`UNEXPLAINED DIFFERENCES: ${JSON.stringify(differences, null, 2)}`);
console.log(`RESULT: ${pass ? 'PASS' : 'FAIL'}`);
process.exitCode = pass ? 0 : 1;
