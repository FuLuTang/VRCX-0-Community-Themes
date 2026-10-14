/* exclusion-migration / migrate.mjs — generates the staged migration into ISOLATED copies of runtime/*.css.
 *   node migrate.mjs --analysis exclusions.before.json --in <baseline runtime> --out <dir> --stage 1|2|3
 * stage 1: additive patches only (gap A checkbox/indicator, gap D fallbacks, gap B base-ui radio)
 * stage 2: stage 1 + delete clauses that cannot fire (settings dead clause C, scope/portal-vacuous login/entity clauses)
 * stage 3: stage 2 + drop the clauses that really exclude (Drop/Partial) ; the temporary A/D fallback block is removed again
 * Only selector text is rewritten (postcss); declarations are never touched. */
import fs from 'node:fs';
import path from 'node:path';
import {postcss, rewriteSelector, listClauses, CONTEXT_KINDS, splitSelectorList} from './common.mjs';
import {decide} from './decide.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const ANALYSIS = JSON.parse(fs.readFileSync(opt('analysis'), 'utf8'));
const IN = opt('in'), OUT = opt('out'), STAGE = Number(opt('stage', '3'));
fs.mkdirSync(OUT, {recursive: true});
const files = fs.readdirSync(IN).filter(f => f.endsWith('.css'));
for (const f of files) fs.copyFileSync(path.join(IN, f), path.join(OUT, f));

/* ---- stage 2/3: selector rewrites ---- */
const byFile = {};
for (const r of ANALYSIS.rules) (byFile[r.file] ||= []).push(r);
const report = {removed: 0, kept: 0, rules: 0};
if (STAGE >= 2) for (const [file, rs] of Object.entries(byFile)) {
  const p = path.join(OUT, file);
  const root = postcss.parse(fs.readFileSync(p, 'utf8'), {from: file});
  const byLine = {}; for (const r of rs) byLine[r.line] = r;
  root.walkRules(rule => {
    const r = byLine[rule.source.start.line]; if (!r) return;
    const kinds = [];
    for (const [K, c] of Object.entries(r.contexts)) {
      const d = decide(r, K, c);
      if (d.action === 'remove' && d.stage <= STAGE) kinds.push(K); else report.kept++;
    }
    if (!kinds.length) return;
    const next = splitSelectorList(rule.selector).map(s => rewriteSelector(s, kinds));
    rule.selector = next.join(rule.selector.includes('\n') ? ',\n' : ',');
    report.removed += kinds.length; report.rules++;
  });
  fs.writeFileSync(p, root.toString());
}

/* ---- stage 1 only: additive patches ---- */
if (STAGE === 1 || STAGE === 2) {
  const fc = path.join(OUT, 'form-controls-r9.css');
  let css = fs.readFileSync(fc, 'utf8');
  css += '\n' + fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'patches', 'gap-A-D-fallback.css'), 'utf8');
  fs.writeFileSync(fc, css);
}
if (STAGE >= 1) {
  const fc = path.join(OUT, 'form-controls-r9.css');
  let css = fs.readFileSync(fc, 'utf8');
  css += '\n' + fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'patches', 'gap-B-radio.css'), 'utf8');
  fs.writeFileSync(fc, css);
}
console.log(JSON.stringify({stage: STAGE, ...report}));
