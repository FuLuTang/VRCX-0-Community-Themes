/* Generates patches/gap-A-D-fallback.css from the baseline form-controls-r9.css rules (declarations copied verbatim,
 * selectors: all exclusion clauses removed, scoped to the context). Re-run if the generic rules change. */
import fs from 'node:fs';
import path from 'node:path';
import {postcss, rewriteSelector, splitSelectorList, here} from './common.mjs';
const IN = process.argv[2];
const css = fs.readFileSync(path.join(IN, 'form-controls-r9.css'), 'utf8');
const root = postcss.parse(css);
const ENT = '.entity-dialog', LOGIN = '[data-vrcx-0-surface="login-page"]';
/* rule line -> contexts that need the fallback. Entity <input type=range> is deliberately NOT here (user-dialog-r8 owns it). */
const PLAN = {3: [ENT, LOGIN], 19: [ENT, LOGIN], 24: [ENT, LOGIN], 32: [ENT, LOGIN], 33: [ENT, LOGIN],
  37: [LOGIN], 45: [LOGIN], 50: [LOGIN], 56: [LOGIN], 60: [LOGIN], 64: [LOGIN],
  68: [ENT, LOGIN], 73: [ENT, LOGIN], 76: [ENT, LOGIN], 81: [ENT, LOGIN]};
const out = [`/* ==== R10 exclusion-migration, stage 1: gap A (Base UI/native checkbox in .entity-dialog) + gap D (fallback for native-checkbox,
   native-range and Base UI slider in login-page / entity-dialog). Additive; declarations are copies of the generic rules above.
   Context rules that already exist (login-r8 .. , user-dialog-r8 entity range) keep winning by specificity.
   Superseded (and removed again) when stage 3 drops the exclusions. ==== */`];
root.walkRules(rule => {
  const ctxs = PLAN[rule.source.start.line]; if (!ctxs) return;
  const body = rule.nodes.map(n => '  ' + n.toString() + ';').join('\n');
  const sels = splitSelectorList(rule.selector).map(s => rewriteSelector(s, ['login-page', 'entity-dialog', 'settings-tabs']));
  const full = [];
  for (const c of ctxs) for (const s of sels) full.push(`:where(${c}) ${s}`);
  out.push(`${full.join(',\n')} {\n${body}\n}`);
});
fs.mkdirSync(path.join(here, 'patches'), {recursive: true});
fs.writeFileSync(path.join(here, 'patches', 'gap-A-D-fallback.css'), out.join('\n') + '\n');
console.log(out.length - 1, 'rules');
