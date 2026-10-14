/* exclusion-migration / migrate2.mjs — generates the "ideal refactor" of the runtime CSS from a pristine baseline.
 *
 *   node migrate2.mjs --in <baseline runtime dir (css files)> --out <dir for rewritten css files>
 *                    --analysis <exclusions.before.json produced by analyze.mjs>
 *
 * What it does (selector text only, declarations untouched, except the explicit EDITS list at the bottom):
 *   1. a `:not(<ctx> *)` exclusion for one of the three contexts (login-page / entity-dialog / settings w-44 rail) is removed
 *      when analyze.mjs + decide.mjs classify that (rule, context) pair as a Drop — a real visible release (stage 3), or a
 *      vacuous / dead clause (stage 2) once --drop-stage2 is passed.
 *      - action "keep"  (machine Keep, or a manual adjudication)  -> the clause STAYS: a context-specific rule already gives
 *        that subtree a deliberately different look, and dropping the clause would break it (e.g. the 2px range hit-box shift
 *        in the user dialog).
 *      - stage 2        (vacuous clause / dead clause)            -> the clause can never fire in the real DOM (body-portalled
 *        popups are never nested inside `.entity-dialog`; the old `.w-44` rail hook no longer exists). It used to be HELD BACK
 *        because the layer checks (r9-popups / r10-overlays / r10-buttons-badges / r9-dialogs) asserted on a synthetic
 *        "popup nested inside a dialog" structure that only existed in those fixtures. Those fixtures now build the real
 *        portal structure, so `--drop-stage2` lifts the hold and removes the clause as well (pure byte-level cleanup: zero
 *        runtime effect). Without the flag the stage-2 hold is preserved for reproducing the R9.8 result.
 *      - stage 3        (visible release)                         -> the clause is REMOVED: the generic rule now reaches a
 *        surface that previously fell back to the shadcn/browser default. This is the actual gap-fix (Base UI checkbox inside
 *        `.entity-dialog`, native radio everywhere, ...).
 *      The "other" exclusions (page-toolbar / bg-popover/70 / card-sm / titlebar / #chart / page-scaffold) are never touched.
 *   2. generic control rules that actually lost at least one clause (form-controls-r9.css, fields-toolbar-r10.css generic
 *      block) are wrapped in `:where(...)` (specificity 0; pseudo-elements stay outside the :where) so that context override
 *      rules win by specificity + source order. Rules that kept every clause are left byte-identical.
 *   3. explicit EDITS: radio gap, comments, volatile-class replacements, entity range margin ... (see EDITS).
 * No production file is touched: --in is read-only, --out is a scratch dir. */
import fs from 'node:fs';
import path from 'node:path';
import {postcss, rewriteSelector, listClauses, CONTEXT_KINDS, splitSelectorList} from './common.mjs';
import {decide} from './decide.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const IN = path.resolve(opt('in')), OUT = path.resolve(opt('out'));
const ANALYSIS = opt('analysis', '');
/* stage-2 clauses (vacuous / dead hook) are held back by default so the R9.8 result stays reproducible;
 * --drop-stage2 removes them too. Safe only because the four layer fixtures that used to assert the synthetic
 * "popup nested inside a dialog" structure now build the real body-portalled structure instead. */
const DROP_STAGE2 = argv.includes('--drop-stage2');
const analysisById = new Map();
if (ANALYSIS) {
  const an = JSON.parse(fs.readFileSync(ANALYSIS, 'utf8'));
  for (const r of an.rules) analysisById.set(r.id, r);
  console.error(`analysis: ${an.rules.length} exclusion rules loaded from ${ANALYSIS} (tag=${an.meta && an.meta.tag})`);
}
fs.mkdirSync(OUT, {recursive: true});
for (const f of fs.readdirSync(IN)) if (f.endsWith('.css')) fs.copyFileSync(path.join(IN, f), path.join(OUT, f));

/* files whose context-excluded rules are GENERIC control rules -> wrap in :where() after removing the exclusions */
const WRAP_FILES = {
  'form-controls-r9.css': () => true,
  /* fields-toolbar-r10.css lines 7-26 are the toolbar-scoped `.vrcx-0-main-content .vrcx-0-page-toolbar ...` rules (no context exclusions) */
  'fields-toolbar-r10.css': (rule) => !/^\.vrcx-0-(main-content|page-toolbar)/.test(rule.selector.trim())
};

const PSEUDO_ELEMENT_TAIL = /((?:::[\w-]+(?:\([^)]*\))?)+)$/;
export function wrapWhere(selector) {
  return splitSelectorList(selector).map(s => {
    const m = s.match(PSEUDO_ELEMENT_TAIL);
    const tail = m ? m[1] : '';
    const head = m ? s.slice(0, m.index) : s;
    return `:where(${head.trim()})${tail}`;
  }).join(',');
}

const stats = {files: {}, clausesRemoved: 0, rulesTouched: 0, wrapped: 0, keptClauses: 0, stage2Held: 0, stage2Removed: 0, noAnalysis: 0, dropStage2: DROP_STAGE2};
const actionLog = [];
for (const f of fs.readdirSync(OUT).filter(f => f.endsWith('.css'))) {
  const p = path.join(OUT, f);
  const src = fs.readFileSync(p, 'utf8');
  const root = postcss.parse(src, {from: f});
  let changed = 0;
  root.walkRules(rule => {
    const sels = splitSelectorList(rule.selector);
    const clauses = sels.flatMap(s => listClauses(s).filter(c => CONTEXT_KINDS.includes(c.kind)));
    if (!clauses.length) return;
    const id = `${f}:${rule.source.start.line}`;
    const rec = analysisById.get(id);
    /* per context-kind decision: only a real, visible release (stage 3) drops the clause */
    const dropKinds = [];
    for (const K of new Set(clauses.map(c => c.kind))) {
      const c = rec && rec.contexts[K];
      if (!c) { dropKinds.push(K); stats.noAnalysis++; actionLog.push({id, K, action: 'remove', stage: 3, why: 'no analysis row'}); continue; }
      const d = decide(rec, K, c);
      if (d.action === 'keep') { stats.keptClauses++; actionLog.push({id, K, action: 'keep', cls: d.finalClass, why: d.adjudicated}); }
      else if (d.stage === 2 && !DROP_STAGE2) { stats.stage2Held++; actionLog.push({id, K, action: 'hold-stage2', cls: d.finalClass, vacuous: !!c.vacuous}); }
      else {
        dropKinds.push(K);
        if (d.stage === 2) stats.stage2Removed++;
        actionLog.push({id, K, action: 'remove', stage: d.stage, cls: d.finalClass, vacuous: !!c.vacuous});
      }
    }
    if (!dropKinds.length) return;
    const wrap = WRAP_FILES[f] && WRAP_FILES[f](rule);
    const next = sels.map(s => rewriteSelector(s, dropKinds));
    let sel = next.join(rule.selector.includes('\n') ? ',\n' : ',');
    if (wrap) { sel = wrapWhere(sel); stats.wrapped++; }
    rule.selector = sel; changed++; stats.clausesRemoved += dropKinds.length;
  });
  if (changed) { fs.writeFileSync(p, root.toString()); stats.files[f] = changed; stats.rulesTouched += changed; }
}
fs.writeFileSync(path.resolve(OUT, '..', 'migration-actions.json'), JSON.stringify(actionLog, null, 1));

/* ---------- DELETE_RULES: rules removed after the mechanical pass (selector matched on the rewritten text) ---------- */
for (const d of (await import('./edits.mjs')).DELETE_RULES) {
  const p = path.join(OUT, d.file);
  const root = postcss.parse(fs.readFileSync(p, 'utf8'), {from: d.file});
  let n = 0; root.walkRules(r => { if (d.re.test(r.selector)) { r.remove(); n++; } });
  if (n !== d.count) { console.error(`DELETE FAILED (${d.id}): matched ${n} (expected ${d.count}) in ${d.file}`); process.exitCode = 2; continue; }
  fs.writeFileSync(p, root.toString());
}
/* ---------- explicit EDITS (exact-string replace; each must match exactly once) ---------- */
const EDITS = (await import('./edits.mjs')).EDITS;
for (const e of EDITS) {
  const p = path.join(OUT, e.file);
  let t = fs.readFileSync(p, 'utf8');
  const n = t.split(e.from).length - 1;
  if (n !== (e.count ?? 1)) { console.error(`EDIT FAILED (${e.id}): "${e.from.slice(0, 70)}" matched ${n}x in ${e.file}`); process.exitCode = 2; continue; }
  t = t.split(e.from).join(e.to);
  fs.writeFileSync(p, t);
}
for (const e of (await import('./edits.mjs')).REGEX_EDITS) {
  const p = path.join(OUT, e.file);
  let t = fs.readFileSync(p, 'utf8');
  const n = (t.match(e.re) || []).length;
  if (n !== e.count) { console.error(`REGEX EDIT FAILED (${e.id}): ${e.re} matched ${n}x (expected ${e.count}) in ${e.file}`); process.exitCode = 2; continue; }
  fs.writeFileSync(p, t.replace(e.re, e.to));
}
console.log(JSON.stringify(stats));
