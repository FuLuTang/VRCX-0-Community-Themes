/* Shared helpers for the exclusion-migration tooling (read-only against production CSS / app source).
 * Everything here is pure node: CSS parsing (postcss + postcss-selector-parser from the app's node_modules),
 * exclusion-clause classification, selector rewriting (remove / replace a clause), section<->file mapping. */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const req = createRequire('/home/fulutang/Documents/Github/VRCX-0-jirai/package.json');
export const postcss = req('postcss');
export const selectorParser = req('postcss-selector-parser');
export const here = path.dirname(fileURLToPath(import.meta.url));

/* ---- exclusion clause kinds (the three contexts of this task + the "other" ones we do not touch) ---- */
export const CONTEXT_KINDS = ['login-page', 'entity-dialog', 'settings-tabs'];
export function clauseKind(arg) {
  const a = arg.replace(/\s+/g, ' ').trim();
  if (/^\.vrcx-0-main-shell\[data-vrcx-0-surface=("?)login-page\1\] \*$/.test(a)) return 'login-page';
  if (/^\[data-vrcx-0-surface=("?)login-page\1\] \*$/.test(a)) return 'login-page';
  if (a === '.entity-dialog *') return 'entity-dialog';
  if (/^\.vrcx-0-page-scaffold:has\(> \[data-slot="tabs-list"\]\[class~="w-44"\]\) \*$/.test(a)) return 'settings-tabs';
  if (a === '.vrcx-0-page-toolbar *') return 'other:page-toolbar';
  if (a === '[class~="bg-popover/70"] *') return 'other:menu-popup';
  if (a === 'article[data-slot="card"][data-size="sm"] *') return 'other:card-sm';
  if (a === '.vrcx-0-titlebar *') return 'other:titlebar';
  if (a === '.vrcx-0-page-scaffold *') return 'other:page-scaffold';
  if (/^\.vrcx-0-page-scaffold#chart/.test(a)) return 'other:tools-chart';
  return 'other:' + a.slice(0, 40);
}
/** is this `:not(...)` pseudo an exclusion clause ("<something> *")? */
export function isExclusionNot(p) {
  if (p.value.toLowerCase() !== ':not' || p.nodes.length !== 1) return false;
  const s = p.nodes[0], n = s.nodes;
  const last = n[n.length - 1];
  const prev = n[n.length - 2];
  return n.length >= 3 && last.type === 'universal' && prev && prev.type === 'combinator' && /^\s+$/.test(prev.value);
}

/** list exclusion clauses of one selector string: [{kind, text}] */
export function listClauses(selector) {
  const out = [];
  selectorParser(root => {
    root.walkPseudos(p => { if (isExclusionNot(p)) out.push({kind: clauseKind(p.nodes[0].toString()), text: p.nodes[0].toString().trim()}); });
  }).processSync(selector);
  return out;
}
/** rewrite one selector: drop every exclusion clause whose kind is in `kinds`; replacements: {kind: newArgText} replaces instead */
export function rewriteSelector(selector, kinds, replacements = {}) {
  return selectorParser(root => {
    root.walkPseudos(p => {
      if (!isExclusionNot(p)) return;
      const k = clauseKind(p.nodes[0].toString());
      if (!kinds.includes(k)) return;
      if (replacements[k]) {
        const parsed = selectorParser().astSync(replacements[k]);
        p.nodes[0].replaceWith(parsed.nodes[0]);
      } else p.remove();
    });
    // an emptied :where()/:is() would match nothing (":where()" is valid and empty) -> remove the husk
    let changed = true;
    while (changed) {
      changed = false;
      root.walkPseudos(p => {
        if (/^:(where|is)$/i.test(p.value) && p.nodes.every(s => s.nodes.length === 0)) { p.remove(); changed = true; }
      });
    }
  }).processSync(selector);
}
export function splitSelectorList(selector) {
  const out = [];
  selectorParser(root => root.each(s => out.push(s.toString().trim()))).processSync(selector);
  return out;
}

/* ---- section <-> file mapping from build-runtime.mjs ---- */
export function sectionFileMap(runtimeDir) {
  const text = fs.readFileSync(path.join(runtimeDir, 'build-runtime.mjs'), 'utf8');
  const map = {};
  for (const m of text.matchAll(/\['([^']+)',\s*await read\(path\.join\((here|design),\s*'([^']+)'\)\)\]/g)) map[m[1]] = {base: m[2], file: m[3]};
  return map; // section -> {base: here|design, file}
}
/** all runtime/*.css rules with file:line (document order, @media nested kept with their at-rule chain) */
export function loadRules(runtimeDir) {
  const smap = sectionFileMap(runtimeDir);
  const fileToSection = {};
  for (const [s, v] of Object.entries(smap)) if (v.base === 'here') fileToSection[v.file] = s;
  const rules = [];
  for (const [file, section] of Object.entries(fileToSection)) {
    const text = fs.readFileSync(path.join(runtimeDir, file), 'utf8');
    const root = postcss.parse(text, {from: file});
    let order = 0;
    root.walkRules(rule => {
      const chain = [];
      for (let p = rule.parent; p && p.type !== 'root'; p = p.parent) if (p.type === 'atrule') chain.unshift(`@${p.name} ${p.params}`);
      if (chain.some(c => /^@(-webkit-)?keyframes/.test(c))) return;
      const decls = [];
      rule.walkDecls(d => decls.push({prop: d.prop, value: d.value, important: !!d.important}));
      rules.push({id: `${file}:${rule.source.start.line}`, file: file.replace(/\.css$/, ''), fileName: file, section, line: rule.source.start.line, endLine: rule.source.end.line,
        selector: rule.selector, selectors: splitSelectorList(rule.selector), decls, atChain: chain, order: order++});
    });
  }
  return {rules, smap, fileToSection};
}
export const rel = (p, base) => path.relative(base, p);
