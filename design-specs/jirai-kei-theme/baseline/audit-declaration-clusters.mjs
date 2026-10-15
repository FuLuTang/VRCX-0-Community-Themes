#!/usr/bin/env node
/* CSS-only audit of exact/near declaration blocks in the frozen artifact; no source edits. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const themeDir=path.dirname(here),repoRoot=path.resolve(themeDir,'../..');
const manifest=JSON.parse(fs.readFileSync(path.join(here,'MANIFEST.json'),'utf8'));
const cssPath=path.join(repoRoot,manifest.themeCss.path),cssText=fs.readFileSync(cssPath,'utf8');
const cssSha256=crypto.createHash('sha256').update(cssText).digest('hex');
if(cssSha256!==manifest.themeCss.sha256)throw new Error(`theme CSS hash mismatch ${cssSha256}`);
const appRepo=process.env.APP_REPO||'/home/fulutang/Documents/Github/VRCX-0-jirai';
const requireApp=createRequire(path.join(appRepo,'package.json'));
const postcss=requireApp('postcss'),selectorParser=requireApp('postcss-selector-parser');
const selectorCoverage=JSON.parse(fs.readFileSync(path.join(here,'reports/selector-coverage.json'),'utf8'));
const coverageBySelector=new Map(selectorCoverage.selectors.map((s)=>[s.selector,s]));
const variantInventory=JSON.parse(fs.readFileSync(path.join(here,'reports/component-variant-inventory.json'),'utf8'));
const variantsByComponent=new Map();
for(const v of variantInventory.variants){if(!variantsByComponent.has(v.component))variantsByComponent.set(v.component,[]);variantsByComponent.get(v.component).push(v);}
const blockRecords=[];const selectorRecords=[];const exactBlockGroups=new Map();let section='preamble',qualifiedRuleCount=0;
const redactedValue=(value)=>{
  const text=String(value);
  if(text.length>220||/url\s*\(/i.test(text))return `<redacted-or-long-value len=${text.length} sha256=${crypto.createHash('sha256').update(text).digest('hex').slice(0,16)}>`;
  return text;
};
function canonicalSelector(s){return s.toString().replace(/\s+/g,' ').trim();}
function resolveNesting(selector,parent){
  if(!parent)return selector;
  const ast=selectorParser().astSync(selector),parentNode=selectorParser().astSync(`:is(${parent})`).nodes[0].nodes[0];
  for(const branch of ast.nodes){let found=false;branch.walkNesting((n)=>{found=true;n.replaceWith(parentNode.clone());});if(!found){branch.prepend(selectorParser.combinator({value:' '}));branch.prepend(parentNode.clone());}}
  return ast.toString();
}
function selectorHints(branch,sectionName){
  const slots=new Set(),classes=new Set(),tags=new Set();
  branch.walkAttributes((a)=>{if(a.attribute==='data-slot'&&a.value)slots.add(a.value.replace(/^['"]|['"]$/g,''));});
  branch.walkClasses((c)=>{if(/^(object-row|vrcx-0-[\w-]+|app-data-table|rounded-object)$/.test(c.value))classes.add(c.value);});
  branch.walkTags((t)=>{if(['button','input','textarea','select','table','tr','th','td','img'].includes(t.value.toLowerCase()))tags.add(t.value.toLowerCase());});
  const hints=[...slots].map((s)=>`slot:${s}`);
  if(!hints.length)hints.push(...[...classes].map((s)=>`class:${s}`));
  if(!hints.length&&tags.size)hints.push(...[...tags].map((s)=>`tag:${s}`));
  return hints.length?hints:[`section:${sectionName}`];
}
function coverageSummaryFor(selectors){
  const rows=selectors.map((selector)=>coverageBySelector.get(selector)).filter(Boolean);
  const safeRoute=(route)=>String(route).replace(/^\/dashboard\/[^/]+/,'/dashboard/:placeholder');
  const union=(field)=>[...new Set(rows.flatMap((r)=>r[field]||[]).map(safeRoute))].sort();
  return {
    selectorBranches:selectors.length,
    resolvedBranches:rows.length,
    directHitBranches:rows.filter((r)=>r.fullMatchStateCount>0).length,
    dynamicStructuralBranches:rows.filter((r)=>r.classification==='state-dependent-structural-hit').length,
    noHitBranches:rows.filter((r)=>r.classification==='no-match-in-frozen-dom').length,
    directMatchStateObservations:rows.reduce((n,r)=>n+(r.fullMatchStateCount||0),0),
    structuralMatchStateObservations:rows.reduce((n,r)=>n+(r.structuralMatchStateCount||0),0),
    matchedRoutes:union('fullMatchRoutes'),
    structuralRoutes:union('structuralMatchRoutes'),
  };
}
function computedContextEvidence(hints){
  const slots=[...new Set(hints.filter((h)=>h.startsWith('slot:')).map((h)=>h.slice(5)))];
  return slots.map((slot)=>({
    slot,
    observedContexts:(variantsByComponent.get(slot)||[]).map((v)=>({context:v.primaryContext,variant:v.variant,size:v.size,styleFingerprintCount:v.styleFingerprintCount,states:v.stateCount,observations:v.observations})).slice(0,12),
  }));
}
function addRule(node,currentSection,conditions,parent){
  let resolved;
  try{resolved=resolveNesting(node.selector,parent);}catch{return;}
  let ast;try{ast=selectorParser().astSync(resolved);}catch{return;}
  const declarations=(node.nodes||[]).filter(n=>n.type==='decl').map((d)=>({property:d.prop.toLowerCase(),value:d.value.trim(),important:!!d.important}));
  if(!declarations.length)return;
  qualifiedRuleCount++;
  const blockId=blockRecords.length;
  const finalProps=new Map();for(const d of declarations)finalProps.set(d.property,`${d.value}${d.important?' !important':''}`);
  const sorted=declarations.map(d=>`${d.property}:${d.value}${d.important?' !important':''}`).join(';');
  const signature=crypto.createHash('sha256').update(sorted).digest('hex');
  const branches=ast.nodes.map(canonicalSelector).filter(Boolean);
  const hints=[...new Set(ast.nodes.flatMap((branch)=>selectorHints(branch,currentSection)))];
  const record={blockId,section:currentSection,line:node.source?.start?.line||null,conditions:[...conditions],selectors:branches,declarations,finalProps:Object.fromEntries(finalProps),signature,hints,importantCount:declarations.filter(d=>d.important).length,coverage:coverageSummaryFor(branches),computedContextEvidence:computedContextEvidence(hints)};
  blockRecords.push(record);
  if(!exactBlockGroups.has(signature))exactBlockGroups.set(signature,[]);
  exactBlockGroups.get(signature).push(record);
  for(const branch of ast.nodes){
    const selector=canonicalSelector(branch);if(selector)selectorRecords.push({selector,blockId,section:currentSection,line:record.line,conditions:[...conditions],signature,hints,coverage:coverageSummaryFor([selector])});
  }
  if(node.nodes?.some(n=>n.type==='rule'||n.type==='atrule'))walk(node.nodes,currentSection,conditions,resolved);
}
function walk(nodes,initialSection='preamble',conditions=[],parent=null){
  let currentSection=initialSection;
  for(const node of nodes||[]){
    if(node.type==='comment'){const marker=node.text.match(/^\s*SECTION\s+(.+)\s*$/);if(marker)currentSection=marker[1].trim();continue;}
    if(node.type==='atrule'){
      if(/keyframes$/i.test(node.name))continue;
      if(node.nodes)walk(node.nodes,currentSection,[...conditions,`@${node.name} ${node.params}`.trim()],parent);
      continue;
    }
    if(node.type==='rule')addRule(node,currentSection,conditions,parent);
  }
}
walk(postcss.parse(cssText,{from:cssPath}).nodes);

const exactGroups=[...exactBlockGroups.values()].filter((group)=>group.length>1).map((group)=>({
  occurrences:group.length,
  sections:[...new Set(group.map(r=>r.section))].sort(),
  propertyCount:group[0].declarations.length,
  importantCount:group[0].importantCount,
  declarationSignature:group[0].declarations.map(d=>({property:d.property,value:redactedValue(d.value),important:d.important})),
  rules:group.map(r=>({section:r.section,line:r.line,conditions:r.conditions,selectors:r.selectors,hints:r.hints,coverage:r.coverage,computedContextEvidence:r.computedContextEvidence})),
})).sort((a,b)=>b.occurrences-a.occurrences||a.sections.join().localeCompare(b.sections.join()));
const selectorGroups=new Map();for(const r of selectorRecords){if(!selectorGroups.has(r.selector))selectorGroups.set(r.selector,[]);selectorGroups.get(r.selector).push(r);}
const duplicateSelectors=[...selectorGroups].filter(([,g])=>new Set(g.map(x=>x.blockId)).size>1).map(([selector,g])=>{
  const rules=[...new Map(g.map(x=>[x.blockId,x])).values()];
  return {selector,ruleCount:rules.length,sections:[...new Set(rules.map(r=>r.section))].sort(),sameDeclarationSignature:new Set(rules.map(r=>r.signature)).size===1,rules:rules.map(r=>({section:r.section,line:r.line,conditions:r.conditions,signature:r.signature,coverage:r.coverage,hints:r.hints}))};
});
const buckets=new Map();
for(const rule of blockRecords){for(const hint of rule.hints){const k=hint;if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(rule);}}
const nearPairs=new Map();
for(const [hint,items] of buckets){
  const unique=[...new Map(items.map((r)=>[r.blockId,r])).values()];
  for(let i=0;i<unique.length;i++)for(let j=i+1;j<unique.length;j++){
    const a=unique[i],b=unique[j];if(a.signature===b.signature)continue;
    const pa=new Map(Object.entries(a.finalProps)),pb=new Map(Object.entries(b.finalProps));
    if(Math.min(pa.size,pb.size)<4)continue;
    const keysA=new Set(pa.keys()),keysB=new Set(pb.keys());
    const unionKeys=new Set([...keysA,...keysB]);let sharedKeys=0,sameValues=0;
    for(const k of keysA)if(keysB.has(k)){sharedKeys++;if(pa.get(k)===pb.get(k))sameValues++;}
    const propJaccard=sharedKeys/unionKeys.size,valueAgreement=sharedKeys?sameValues/sharedKeys:0;
    const pairsA=new Set([...pa].map(([k,v])=>`${k}:${v}`)),pairsB=new Set([...pb].map(([k,v])=>`${k}:${v}`));
    const samePairs=[...pairsA].filter(x=>pairsB.has(x)).length;
    const declarationJaccard=samePairs/(pairsA.size+pairsB.size-samePairs);
    if(propJaccard<0.72||valueAgreement<0.72||declarationJaccard<0.58)continue;
    const key=[a.blockId,b.blockId].sort((x,y)=>x-y).join(':');
    const score=Number((0.5*declarationJaccard+0.3*propJaccard+0.2*valueAgreement).toFixed(4));
    if(!nearPairs.has(key)||nearPairs.get(key).score<score)nearPairs.set(key,{a,b,hint,score,propJaccard:Number(propJaccard.toFixed(4)),valueAgreement:Number(valueAgreement.toFixed(4)),declarationJaccard:Number(declarationJaccard.toFixed(4)),samePairs,propertyDiffs:[...new Set([...keysA,...keysB])].filter(k=>pa.get(k)!==pb.get(k)).map(k=>({property:k,a:pa.has(k)?redactedValue(pa.get(k)):null,b:pb.has(k)?redactedValue(pb.get(k)):null}))});
  }
}
const near= [...nearPairs.values()].sort((x,y)=>y.score-x.score||x.hint.localeCompare(y.hint)).slice(0,500).map(({a,b,...metrics})=>({
  ...metrics,
  sectionA:a.section,lineA:a.line,conditionsA:a.conditions,selectorsA:a.selectors,
  sectionB:b.section,lineB:b.line,conditionsB:b.conditions,selectorsB:b.selectors,
  importantA:a.importantCount,importantB:b.importantCount,
  coverageA:a.coverage,coverageB:b.coverage,
  computedContextEvidenceA:a.computedContextEvidence,computedContextEvidenceB:b.computedContextEvidence,
  styleContextGroupsA:a.computedContextEvidence.reduce((n,x)=>n+x.observedContexts.length,0),
  styleContextGroupsB:b.computedContextEvidence.reduce((n,x)=>n+x.observedContexts.length,0),
  sharedMatchedRoutes:a.coverage.matchedRoutes.filter((route)=>b.coverage.matchedRoutes.includes(route)), 
  crossesSection:a.section!==b.section,
  boundaryWarning:[a.section,b.section].some(s=>/login|dialog|popup|chrome|status|privacy|entity/i.test(s)),
  reviewSignals:[a.section!==b.section?'cross-section':null,[a.section,b.section].some(s=>/login|dialog|popup|chrome|status|privacy|entity/i.test(s))?'context-boundary':null,a.coverage.directHitBranches&&b.coverage.directHitBranches?'both-seen-in-frozen-dom':null].filter(Boolean),
}));
const summary={generatedAt:new Date().toISOString(),themeCssSha256:cssSha256,appCommit:manifest.appCommit,qualifiedRuleBlocks:qualifiedRuleCount,uniqueSelectorBranches:new Set(selectorRecords.map(r=>r.selector)).size,exactDuplicateDeclarationGroups:exactGroups.length,duplicateSelectorGroups:duplicateSelectors.length,redeclaredSelectorGroupsWithDifferentDeclarationSignatures:duplicateSelectors.filter(x=>!x.sameDeclarationSignature).length,nearEquivalentPairsRetained:near.length,nearThresholds:{propertyJaccardMin:0.72,valueAgreementMin:0.72,declarationJaccardMin:0.58,minProperties:4,maxPairs:500},importantDeclarations:blockRecords.reduce((n,r)=>n+r.importantCount,0)};
const report={summary,exactDuplicateBlocks:exactGroups,duplicateSelectors,nearEquivalentPairs:near};
const reportDir=path.join(here,'reports');fs.mkdirSync(reportDir,{recursive:true});
fs.writeFileSync(path.join(reportDir,'declaration-clusters.json'),JSON.stringify(report,null,2)+'\n');
const md=[
 '# Exact and near declaration-block clusters',
 '',
 `- Artifact: \`${cssSha256}\`; ${qualifiedRuleCount} qualified rule blocks with declarations; ${summary.uniqueSelectorBranches} unique resolved selector branches.`,
 `- Exact repeated declaration blocks: ${exactGroups.length} groups; selectors redeclared in multiple blocks: ${duplicateSelectors.length} groups (${summary.redeclaredSelectorGroupsWithDifferentDeclarationSignatures} have differing declarations; not automatically cascade conflicts).`,
 `- PostCSS counts ${summary.importantDeclarations} declarations with !important (older 838 estimate is not supported by these artifact bytes).\n- Near-equivalent candidate pairs: ${near.length} retained (property Jaccard ≥0.72, shared-property value agreement ≥0.72, declaration Jaccard ≥0.58, at least four properties). These thresholds produce review leads only, never automatic merge instructions.`,
 `- Pairs/groups in sections with likely hard context boundaries (login/dialog/popup/chrome/status/privacy/entity): flagged; preserve them unless the computed-style proof and source semantics support a shared rule.`,
 '',
 '## Exact declaration-block duplicates',
 '',
 ...exactGroups.slice(0,100).map((g,i)=>`### ${i+1}. ${g.occurrences} blocks · ${g.propertyCount} declarations · sections ${g.sections.join(', ')}\n\n${g.rules.map(r=>`- ${r.section}:${r.line} — ${r.selectors.join(', ')}${r.conditions.length?` (${r.conditions.join(' / ')})`:''}`).join('\n')}\n\nDeclarations: ${g.declarationSignature.map(d=>`${d.property}:${d.value}${d.important?' !important':''}`).join('; ')}`),
 '',
 '## Near-equivalent candidate pairs (top 200)',
 '',
 '| # | Score | Shared anchor | Section A | Selector A | Section B | Selector B | DOM hit branches A/B | Shared routes | Style-context groups A/B | Different properties | boundary? |',
 '|---:|---:|---|---|---|---|---|---:|---:|---:|---|---|',
 ...near.slice(0,200).map((p,i)=>`| ${i+1} | ${p.score} | ${p.hint} | ${p.sectionA}:${p.lineA} | \`${p.selectorsA.slice(0,2).join(', ')}\` | ${p.sectionB}:${p.lineB} | \`${p.selectorsB.slice(0,2).join(', ')}\` | ${p.coverageA.directHitBranches}/${p.coverageA.selectorBranches} / ${p.coverageB.directHitBranches}/${p.coverageB.selectorBranches} | ${p.sharedMatchedRoutes.length} | ${p.styleContextGroupsA}/${p.styleContextGroupsB} | ${p.propertyDiffs.map(d=>d.property).join(', ')||'—'} | ${p.boundaryWarning?'⚠':'—'} |`),
 '',
 '> Near pairs compare CSS rule blocks only. Duplicate declarations can still be intentional because selectors, conditional environments, cascade order, pseudo-state, shorthand interactions, or component ownership differ. Review source/context and use the 42-state computed-style verifier before proposing any merge.',
 '',
 'Full declaration values, exact groups, selectors, line/section context and all retained near-pairs are in `declaration-clusters.json`.',
 '',
];
fs.writeFileSync(path.join(reportDir,'declaration-clusters.md'),md.join('\n'));
console.log(JSON.stringify(summary,null,2));
