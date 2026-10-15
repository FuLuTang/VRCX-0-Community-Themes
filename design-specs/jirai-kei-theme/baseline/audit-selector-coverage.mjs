#!/usr/bin/env node
/*
 * Measure every distinct compiled theme selector against the 42 frozen DOM states.
 * This is selector-to-DOM coverage only; it does not claim a selector wins the CSS
 * cascade. Dynamic pseudo-classes are reported separately because inert DOM fixtures
 * do not preserve transient :hover/:focus/:active browser state.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {gunzipSync} from 'node:zlib';

const here = path.dirname(fileURLToPath(import.meta.url));
const themeDir = path.dirname(here);
const repoRoot = path.resolve(themeDir, '../..');
const manifest = JSON.parse(fs.readFileSync(path.join(here, 'MANIFEST.json'), 'utf8'));
const cssPath = path.join(repoRoot, manifest.themeCss.path);
const cssText = fs.readFileSync(cssPath, 'utf8');
const cssSha256 = crypto.createHash('sha256').update(cssText).digest('hex');
if (cssSha256 !== manifest.themeCss.sha256) throw new Error(`theme CSS hash mismatch: manifest=${manifest.themeCss.sha256} actual=${cssSha256}`);
const appRepo = process.env.APP_REPO || '/home/fulutang/Documents/Github/VRCX-0-jirai';
const requireApp = createRequire(path.join(appRepo, 'package.json'));
const postcss = requireApp('postcss');
const selectorParser = requireApp('postcss-selector-parser');
function loadPlaywright() {
  for (const base of [process.env.PW_MODULE, path.join(themeDir, 'tools'), '/tmp/dsh-theme-tools'].filter(Boolean)) {
    try { return createRequire(path.join(base, 'package.json'))('playwright'); } catch {}
  }
  throw new Error('cannot resolve playwright; set PW_MODULE or install design-specs/jirai-kei-theme/tools dependencies');
}
const {chromium} = loadPlaywright();

const legacyPseudoElements = new Set([':before', ':after', ':first-line', ':first-letter']);
const dynamicPseudos = new Set([':hover', ':focus', ':focus-visible', ':focus-within', ':active', ':visited', ':target', ':modal', ':popover-open']);
const selectorMap = new Map();
let qualifiedRules = 0;

function normalizedSelector(branch) {
  return branch.toString().replace(/\s+/g, ' ').trim();
}
function pseudoInfo(branch) {
  const states = new Set(), pseudoElements = new Set();
  branch.walkPseudos((pseudo) => {
    if (pseudo.value.startsWith('::') || legacyPseudoElements.has(pseudo.value)) pseudoElements.add(pseudo.value);
    if (dynamicPseudos.has(pseudo.value)) states.add(pseudo.value);
  });
  return {states: [...states].sort(), pseudoElements: [...pseudoElements].sort()};
}
function selectorsForQuery(branch) {
  const exact = branch.clone();
  const structural = branch.clone();
  for (const root of [exact, structural]) {
    root.walkPseudos((pseudo) => {
      if (pseudo.value.startsWith('::') || legacyPseudoElements.has(pseudo.value)) pseudo.remove();
    });
  }
  structural.walkPseudos((pseudo) => {
    if (!dynamicPseudos.has(pseudo.value)) return;
    const parentPseudo = pseudo.parent?.type === 'pseudo' ? pseudo.parent : null;
    if (parentPseudo?.value === ':not') parentPseudo.remove();
    else pseudo.remove();
  });
  return {exact: normalizedSelector(exact), structural: normalizedSelector(structural)};
}
function resolveNesting(selector, parent) {
  if (!parent) return selector;
  const ast = selectorParser().astSync(selector);
  const parentNode = selectorParser().astSync(`:is(${parent})`).nodes[0].nodes[0];
  for (const branch of ast.nodes) {
    let found = false;
    branch.walkNesting((nesting) => {
      found = true;
      nesting.replaceWith(parentNode.clone());
    });
    if (!found) {
      branch.prepend(selectorParser.combinator({value:' '}));
      branch.prepend(parentNode.clone());
    }
  }
  return ast.toString();
}
function walkRules(nodes, section = 'preamble', conditions = [], inKeyframes = false, parent = null) {
  let currentSection = section;
  for (const node of nodes || []) {
    if (node.type === 'comment') {
      const marker = node.text.match(/^\s*SECTION\s+(.+)\s*$/);
      if (marker) currentSection = marker[1].trim();
      continue;
    }
    if (node.type === 'atrule') {
      const keyframes = /keyframes$/i.test(node.name);
      if (keyframes) continue;
      if (node.nodes) walkRules(node.nodes, currentSection, [...conditions, `@${node.name} ${node.params}`.trim()], inKeyframes, parent);
      continue;
    }
    if (node.type !== 'rule') continue;
    qualifiedRules++;
    const declarations = (node.nodes || []).filter((child) => child.type === 'decl').map((d) => ({property:d.prop.toLowerCase(), value:d.value.trim(), important:!!d.important}));
    let resolvedSelector, parsed;
    try {
      resolvedSelector = resolveNesting(node.selector, parent);
      parsed = selectorParser().astSync(resolvedSelector);
    } catch (error) { continue; }
    for (const branch of parsed.nodes) {
      const selector = normalizedSelector(branch);
      if (!selector) continue;
      const key = selector;
      if (!selectorMap.has(key)) {
        const info = pseudoInfo(branch);
        const query = selectorsForQuery(branch);
        selectorMap.set(key, {
          selector,
          queryExact: query.exact,
          queryStructural: query.structural,
          dynamicStates: info.states,
          pseudoElements: info.pseudoElements,
          pseudoElementOnly: info.pseudoElements.length > 0 && !query.structural,
          shadowOnly: /:host(?:-context)?\b/.test(selector),
          rules: [],
          sections: new Set(),
          conditions: new Set(),
          properties: new Set(),
          fullMatches: new Map(),
          structuralMatches: new Map(),
          queryErrors: [],
        });
      }
      const record = selectorMap.get(key);
      record.rules.push({section:currentSection, line:node.source?.start?.line || null, conditions, declarations});
      record.sections.add(currentSection);
      for (const condition of conditions) record.conditions.add(condition);
      for (const decl of declarations) record.properties.add(decl.property);
    }
    if (node.nodes?.some((child) => child.type === 'rule' || child.type === 'atrule')) {
      walkRules(node.nodes, currentSection, conditions, inKeyframes, resolvedSelector);
    }
  }
}
walkRules(postcss.parse(cssText, {from:cssPath}).nodes);
const selectors = [...selectorMap.values()].sort((a,b) => a.selector.localeCompare(b.selector));

const snapshotDir = path.join(here, 'snapshot');
const fixtureDir = path.join(here, 'fixtures');
const stateFiles = fs.readdirSync(snapshotDir).filter((f) => f.endsWith('.json')).sort();
const states = stateFiles.map((file) => ({
  file,
  data: JSON.parse(fs.readFileSync(path.join(snapshotDir, file), 'utf8')),
  html: gunzipSync(fs.readFileSync(path.join(fixtureDir, `${file.replace(/\.json$/, '')}.html.gz`))).toString('utf8'),
}));

const browser = await chromium.connectOverCDP(process.env.CDP_URL || 'http://127.0.0.1:9222');
const page = browser.contexts().flatMap((context) => context.pages())[0];
if (!page) throw new Error('no page found on CDP connection');
const queryBatch = selectors.map((s) => ({selector:s.selector, exact:s.queryExact, structural:s.queryStructural}));
for (const state of states) {
  const result = await page.evaluate(({html, queries}) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const run = (selector) => {
      if (!selector) return {count:0,sample:null,error:null};
      try {
        const matches=doc.querySelectorAll(selector);
        return {count:matches.length, sample:matches.length ? pathOf(matches[0]) : null, error:null};
      } catch (e) { return {count:0,sample:null,error:String(e?.message||e)}; }
    };
    function pathOf(el) {
      const parts=[];
      while (el && el.nodeType===1 && el.tagName.toLowerCase()!=='html') {
        let part=el.tagName.toLowerCase(),nth=1,prev=el.previousElementSibling;
        while(prev){if(prev.tagName===el.tagName)nth++;prev=prev.previousElementSibling;}
        part+=`:nth-of-type(${nth})`;
        parts.unshift(part);el=el.parentElement;
      }
      return parts.join('>');
    }
    return queries.map((q) => ({exact:run(q.exact),structural:run(q.structural)}));
  }, {html:state.html, queries:queryBatch});
  const stateId = state.data.stateId || state.file.replace(/\.json$/, '');
  for (let i=0;i<result.length;i++) {
    const record=selectors[i], hit=result[i];
    if (hit.exact.error) record.queryErrors.push({state:stateId,selector:record.queryExact,error:hit.exact.error});
    if (hit.exact.count) record.fullMatches.set(stateId,{route:state.data.route,count:hit.exact.count,sample:hit.exact.sample});
    if (hit.structural.error) record.queryErrors.push({state:stateId,selector:record.queryStructural,error:hit.structural.error});
    if (hit.structural.count) record.structuralMatches.set(stateId,{route:state.data.route,count:hit.structural.count,sample:hit.structural.sample});
  }
  console.log(`scanned ${state.data.route.padEnd(36)} ${stateId.padEnd(46)} ${result.length} selector branches`);
}

const finalSelectors = selectors.map((record) => {
  const fullMatches = [...record.fullMatches].map(([state, match]) => ({state, ...match}));
  const structuralMatches = [...record.structuralMatches].map(([state, match]) => ({state, ...match}));
  const fullRoutes = [...new Set(fullMatches.map((m) => m.route))];
  const structuralRoutes = [...new Set(structuralMatches.map((m) => m.route))];
  let classification;
  if (record.shadowOnly) classification = 'shadow-only';
  else if (record.pseudoElementOnly) classification = 'pseudo-element-only';
  else if (fullMatches.length) classification = 'matched-in-frozen-dom';
  else if (record.dynamicStates.length && structuralMatches.length) classification = 'state-dependent-structural-hit';
  else if (record.queryErrors.length && !structuralMatches.length) classification = 'unsupported-or-invalid';
  else if (structuralMatches.length) classification = 'structural-hit';
  else classification = 'no-match-in-frozen-dom';
  return {
    selector: record.selector,
    classification,
    dynamicStates: record.dynamicStates,
    pseudoElements: record.pseudoElements,
    pseudoElementOnly: record.pseudoElementOnly,
    shadowOnly: record.shadowOnly,
    ruleCount: record.rules.length,
    sections: [...record.sections].sort(),
    conditions: [...record.conditions].sort(),
    properties: [...record.properties].sort(),
    fullMatchStateCount: fullMatches.length,
    fullMatchRoutes: fullRoutes,
    structuralMatchStateCount: structuralMatches.length,
    structuralMatchRoutes: structuralRoutes,
    fullMatches,
    structuralMatches,
    queryErrors: record.queryErrors.slice(0, 100),
    sourceRules: record.rules,
  };
});
const counts = Object.fromEntries([...new Set(finalSelectors.map((r) => r.classification))].sort().map((key) => [key, finalSelectors.filter((r) => r.classification === key).length]));
const sectionCounts = new Map();
for (const record of finalSelectors) for (const section of record.sections) {
  if (!sectionCounts.has(section)) sectionCounts.set(section, {selectors:0, matched:0, stateful:0, noMatch:0, pseudoOnly:0, shadow:0, unsupported:0});
  const tally=sectionCounts.get(section); tally.selectors++;
  if (record.classification==='matched-in-frozen-dom'||record.classification==='structural-hit') tally.matched++;
  if (record.classification==='state-dependent-structural-hit') tally.stateful++;
  if (record.classification==='no-match-in-frozen-dom') tally.noMatch++;
  if (record.classification==='pseudo-element-only') tally.pseudoOnly++;
  if (record.classification==='shadow-only') tally.shadow++;
  if (record.classification==='unsupported-or-invalid') tally.unsupported++;
}
const summary = {
  generatedAt: new Date().toISOString(),
  themeCssSha256: cssSha256,
  appCommit: manifest.appCommit,
  routeCount: manifest.routeCount,
  frozenStateCount: states.length,
  qualifiedRuleCount: qualifiedRules,
  uniqueSelectorCount: finalSelectors.length,
  classifications: counts,
  statefulPseudoSelectorCount: finalSelectors.filter((r) => r.dynamicStates.length).length,
  selectorOccurrencesAcrossStates: finalSelectors.reduce((sum,r)=>sum+r.fullMatchStateCount,0),
};
const report = {
  summary,
  stateFiles: states.map((s) => ({file:s.file, route:s.data.route, stateId:s.data.stateId || s.file.replace(/\.json$/, '')})),
  sections: Object.fromEntries([...sectionCounts].sort((a,b)=>a[0].localeCompare(b[0]))),
  selectors: finalSelectors,
};
const reportDir = path.join(here, 'reports');
fs.mkdirSync(reportDir, {recursive:true});
fs.writeFileSync(path.join(reportDir,'selector-coverage.json'), JSON.stringify(report,null,2)+'\n');
const noMatch = finalSelectors.filter((r)=>r.classification==='no-match-in-frozen-dom');
const stateful = finalSelectors.filter((r)=>r.classification==='state-dependent-structural-hit');
const md = [
  '# Jirai theme selector coverage against frozen DOM states',
  '',
  `- Theme CSS SHA-256: \`${cssSha256}\` (app commit \`${manifest.appCommit}\`).`,
  `- Frozen states: ${states.length} (${manifest.routeCount} declared routes + ${manifest.interactionStateCount} safe interactive states).`,
  `- Compiled qualified rules: ${qualifiedRules}; unique comma-branch selectors: ${finalSelectors.length}.`,
  `- Selector/host query hits in frozen DOM: ${counts['matched-in-frozen-dom']||0}; dynamic-state selectors with a structural hit: ${counts['state-dependent-structural-hit']||0}; structural-only hit: ${counts['structural-hit']||0}; no hit: ${counts['no-match-in-frozen-dom']||0}; pseudo-element-only: ${counts['pseudo-element-only']||0}; shadow-only: ${counts['shadow-only']||0}; unsupported/invalid: ${counts['unsupported-or-invalid']||0}.`,
  `- Selectors containing transient pseudo-states (:hover/:focus/:active etc.): ${summary.statefulPseudoSelectorCount}.`,
  '',
  '> This is a DOM selector-match inventory, not a cascade/winning-declaration claim. A selector can match while losing in the cascade. For pseudo-element selectors, the report queries the originating element because `querySelectorAll` cannot return generated pseudo-elements. `no-match-in-frozen-dom` means only that no captured route/state contained a selector/host match; it can be intentional for dormant features. Dynamic pseudo-state selectors are marked separately because static HTML cannot preserve a live pointer/focus state.',
  '',
  '## By CSS section',
  '',
  '| Section | Unique selectors | Selector/host hit | Stateful potential | No hit | Pseudo-only | Shadow-only | Unsupported |',
  '|---|---:|---:|---:|---:|---:|---:|---:|',
  ...[...sectionCounts].sort((a,b)=>a[0].localeCompare(b[0])).map(([name,c])=>`| ${name.replace(/\|/g,'\\|')} | ${c.selectors} | ${c.matched} | ${c.stateful} | ${c.noMatch} | ${c.pseudoOnly} | ${c.shadow} | ${c.unsupported} |`), 
  '',
  '## No direct/structural match in captured DOM (first 150)',
  '',
  ...noMatch.slice(0,150).map((r)=>`- \`${r.selector}\` — ${r.sections.join(', ')}; ${r.sourceRules.slice(0,2).map(x=>`line ${x.line}`).join(', ')}`),
  '',
  '## Dynamic pseudo-state selectors with structural matches (first 100)',
  '',
  ...stateful.slice(0,100).map((r)=>`- \`${r.selector}\` — states ${r.dynamicStates.join(', ')}; hit states ${r.structuralMatchStateCount}; ${r.sections.join(', ')}`),
  '',
  '## Most broadly matched selectors (top 30)',
  '',
  ...finalSelectors.filter((r)=>r.fullMatchStateCount).sort((a,b)=>b.fullMatchStateCount-a.fullMatchStateCount).slice(0,30).map((r)=>`- ${r.fullMatchStateCount} states / ${r.fullMatchRoutes.length} routes — \`${r.selector}\``),
  '',
  'Full per-selector state hits, properties, source lines, conditions, and match samples: [selector-coverage.json](selector-coverage.json).',
  '',
];
fs.writeFileSync(path.join(reportDir,'selector-coverage.md'), md.join('\n'));
console.log(JSON.stringify(summary,null,2));
process.exit(0);
