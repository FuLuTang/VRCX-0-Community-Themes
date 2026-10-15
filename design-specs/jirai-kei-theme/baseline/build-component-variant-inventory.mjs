#!/usr/bin/env node
/* Build a privacy-safe component/context inventory from frozen computed-style snapshots. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const themeDir = path.dirname(here);
const manifest = JSON.parse(fs.readFileSync(path.join(here, 'MANIFEST.json'), 'utf8'));
const coverage = JSON.parse(fs.readFileSync(path.join(themeDir, 'runtime/checks/r9-coverage-audit/coverage.json'), 'utf8'));
const reportDir = path.join(here, 'reports');
const snapshotDir = path.join(here, 'snapshot');
const snapshotFiles = fs.readdirSync(snapshotDir).filter((f) => f.endsWith('.json')).sort();
const paintProperties = [
  'color','background-color','border-radius',
  'border-top-width','border-top-style','border-top-color',
  'border-right-width','border-right-style','border-right-color',
  'border-bottom-width','border-bottom-style','border-bottom-color',
  'border-left-width','border-left-style','border-left-color',
  'box-shadow','outline-width','outline-style','outline-color',
  'opacity','filter','transform','clip-path','font-family','font-size','font-weight',
  'text-decoration-line','text-decoration-color',
];
const overlaySlots = new Set([
  'dialog-content','alert-dialog-content','sheet-popup','sheet-content','popover-content',
  'hover-card-content','dropdown-menu-content','context-menu-content','tooltip-content',
  'toast-content','toast-viewport','select-content','combobox-content','command-dialog-content',
]);
const areaTokens = new Set([
  'vrcx-0-main-content','vrcx-0-side-panel','vrcx-0-titlebar','vrcx-0-statusbar',
  'vrcx-0-page-scaffold','vrcx-0-page-toolbar','object-row','entity-dialog','owner-dialog',
  'login-page','privacy-lock','vrcx-0-data-table','app-data-table','vrcx-0-page-content',
]);
const groupNames = {
  G1:'字段、输入、工具栏、键盘提示、筛选和选择器',
  G2:'按钮变体、徽章、分页、浮条、alert 与非主内容 tabs/toggle',
  G3:'浮层与弹窗上下文：tooltip、hover-card、toast、menu、popover、sheet、dialog',
  G4:'表格、空状态、日历、面板、TileShell、列表选中与图表表面',
  G5:'头像、avatar-group、状态灯和方形群组头像例外',
};
const groupSlots = {
  G1:/^(input|textarea|input-group|input-group-control|input-group-addon|input-group-button|field|field-label|field-description|field-error|label|kbd|kbd-group|input-otp|input-otp-slot|toggle-group|combobox-chips|combobox-chip|select-trigger|combobox-trigger|checkbox|slider)$/,
  G2:/^(button|badge|pagination|pagination-link|separator|alert|tabs|tabs-list|tabs-tab|tab-indicator|toggle)$/,
  G3:/^(tooltip-content|hover-card-content|toast-content|toast-viewport|sheet-popup|sheet-content|popover-content|dialog-content|alert-dialog-content|dropdown-menu-content|context-menu-content|menubar-content|select-content|combobox-content|command-content|dropdown-menu-item|context-menu-item|menubar-item|select-item|combobox-item|command-item|select-scroll-up-button|select-scroll-down-button|message|bubble)$/,
  G4:/^(table|table-header|table-head|table-row|table-footer|table-caption|empty|empty-icon|empty-title|empty-description|calendar|resizable-handle|card|card-header|card-footer|collapsible-trigger|progress|tile-shell|activity-skin)$/,
  G5:/^(avatar|avatar-image|avatar-fallback|avatar-badge|avatar-group|avatar-group-count)$/,
};
function familyFor(attrs, tag) {
  const slot=attrs['data-slot']||'';
  for(const [family,re] of Object.entries(groupSlots)) if(re.test(slot)) return family;
  const cls=new Set(String(attrs.class||'').split(/\s+/));
  if(attrs['data-ui-role']==='tile') return 'G4';
  if(cls.has('user-status-indicator') || (slot==='skeleton' && cls.has('rounded-full'))) return 'G5';
  if(tag==='img' && (cls.has('rounded-full') || cls.has('rounded-lg'))) return 'G5';
  if(['img','input','textarea','select','button'].includes(tag)) {
    if(tag==='input' && ['range','checkbox','radio','color','file'].includes(attrs.type)) return 'G1';
    if(tag==='button' && attrs['data-variant']) return 'G2';
  }
  return null;
}
function primaryContext(el, ancestors) {
  const chain=[...ancestors,el];
  for(let i=chain.length-1;i>=0;i--) {
    const n=chain[i], a=n.attrs||{};
    const slot=a['data-slot']||'';
    if(overlaySlots.has(slot)) return `overlay:${slot}`;
  }
  for(let i=chain.length-1;i>=0;i--) {
    const a=chain[i].attrs||{};
    if(a['data-vrcx-0-surface']) return `surface:${a['data-vrcx-0-surface']}`;
  }
  for(let i=chain.length-1;i>=0;i--) {
    const classes=new Set(String(chain[i].attrs?.class||'').split(/\s+/));
    for(const token of ['vrcx-0-titlebar','vrcx-0-statusbar','vrcx-0-side-panel','vrcx-0-main-content','vrcx-0-page-toolbar','vrcx-0-page-scaffold','vrcx-0-data-table','app-data-table','object-row','entity-dialog','owner-dialog']) {
      if(classes.has(token)) return `area:${token}`;
    }
  }
  return 'route-root';
}
function contextTrail(ancestors, el) {
  const found=[];
  for(const n of [...ancestors,el]) {
    const a=n.attrs||{}, slot=a['data-slot']||'';
    if(overlaySlots.has(slot)) found.push(`overlay:${slot}`);
    if(a['data-vrcx-0-surface']) found.push(`surface:${a['data-vrcx-0-surface']}`);
    const classes=new Set(String(a.class||'').split(/\s+/));
    for(const token of areaTokens) if(classes.has(token)) found.push(`area:${token}`);
  }
  return [...new Set(found)];
}
function fingerprint(styles) {
  const values=Object.fromEntries(paintProperties.filter((p)=>p in styles).map((p)=>[p,styles[p]]));
  const raw=JSON.stringify(values);
  return {hash:crypto.createHash('sha256').update(raw).digest('hex').slice(0,16),values};
}
const groups=new Map();
let totalElements=0;
for(const file of snapshotFiles) {
  const snapshot=JSON.parse(fs.readFileSync(path.join(snapshotDir,file),'utf8'));
  const stateId=snapshot.stateId || file.replace(/\.json$/,'');
  const elements=snapshot.elements||[];
  totalElements+=elements.length;
  const byPath=new Map(elements.map((e)=>[e.path,e]));
  for(const el of elements) {
    const attrs=el.attrs||{}, tag=el.tag||'unknown';
    const family=familyFor(attrs,tag);
    if(!family) continue;
    const slot=attrs['data-slot']||`native:${tag}`;
    const variant=attrs['data-variant']||'';
    const size=attrs['data-size']||'';
    const variantKey=`${family}|${slot}|${variant}|${size}`;
    const parts=el.path.split('>');
    const ancestors=[];
    for(let i=1;i<parts.length;i++) {
      const parentPath=parts.slice(0,i).join('>');
      const parent=byPath.get(parentPath);
      if(parent) ancestors.push(parent);
    }
    const primary=primaryContext(el,ancestors);
    const trail=contextTrail(ancestors,el);
    const key=`${variantKey}|${primary}`;
    if(!groups.has(key)) groups.set(key,{
      family,component:slot,tag,variant:variant||null,size:size||null,primaryContext:primary,
      observations:0,states:new Set(),routes:new Set(),contextTrails:new Map(),styleVariants:new Map(),
    });
    const g=groups.get(key);g.observations++;g.states.add(stateId);g.routes.add(String(snapshot.route||'').replace(/^\/dashboard\/[^/]+/,'/dashboard/:placeholder'));
    const trailKey=trail.join(' > ')||'(none)';g.contextTrails.set(trailKey,(g.contextTrails.get(trailKey)||0)+1);
    const fp=fingerprint(el.styles||{});
    if(!g.styleVariants.has(fp.hash))g.styleVariants.set(fp.hash,{count:0,sample:fp.values});
    g.styleVariants.get(fp.hash).count++;
  }
}
const variants=[...groups.values()].map((g)=>({
  family:g.family,familyName:groupNames[g.family],component:g.component,tag:g.tag,
  variant:g.variant,size:g.size,primaryContext:g.primaryContext,
  observations:g.observations,stateCount:g.states.size,routes:[...g.routes].filter(Boolean).sort(),
  styleFingerprintCount:g.styleVariants.size,
  styleVariants:[...g.styleVariants].map(([fingerprint,v])=>({fingerprint,observations:v.count,computedStyle:v.sample})).sort((a,b)=>b.observations-a.observations).slice(0,8),
  contextTrails:[...g.contextTrails].map(([context,count])=>({context,observations:count})).sort((a,b)=>b.observations-a.observations).slice(0,8),
})).sort((a,b)=>a.family.localeCompare(b.family)||a.component.localeCompare(b.component)||a.primaryContext.localeCompare(b.primaryContext)||String(a.variant).localeCompare(String(b.variant)));
const familySummary={};
for(const family of Object.keys(groupNames)) {
  const items=variants.filter((v)=>v.family===family);
  familySummary[family]={name:groupNames[family],componentContexts:items.length,observations:items.reduce((n,v)=>n+v.observations,0),components:[...new Set(items.map((v)=>v.component))].length,stylesWithMultipleFingerprints:items.filter((v)=>v.styleFingerprintCount>1).length};
}
const report={
  generatedAt:new Date().toISOString(),appCommit:manifest.appCommit,themeCssSha256:manifest.themeCss.sha256,
  routeCount:manifest.routeCount,stateCount:snapshotFiles.length,observedElementRecords:totalElements,
  paintFingerprintProperties:paintProperties,familySummary,variants,
  sourceTaxonomy:{generated:coverage.meta.generated,note:'R9 rows supply audit categories/source anchors; current runtime observations are from the Step 2 frozen DOMs. Verify Windows-authoritative source before editing a selector.'},
};
fs.mkdirSync(reportDir,{recursive:true});
fs.writeFileSync(path.join(reportDir,'component-variant-inventory.json'),JSON.stringify(report,null,2)+'\n');
const md=[
  '# Component and context variant inventory',
  '',
  `- Frozen app states: ${snapshotFiles.length} (${manifest.routeCount} routes + ${manifest.interactionStateCount} interaction states); observed element records: ${totalElements}.`,
  `- Theme CSS SHA-256: \`${manifest.themeCss.sha256}\`; app commit: \`${manifest.appCommit}\`.`,
  `- Computed style fingerprint uses ${paintProperties.length} paint/geometry properties. It is a context-variation signal, not a request to force every fingerprint equal.`,
  '- Component families G1–G5 mirror the existing read-only R9 audit taxonomy; route/context counts come from the 42 frozen DOM snapshots. G3 includes dialog DOM for context visibility only; CSS ownership remains with dialogs-r9.',
  '- A selector not observed in these states is not automatically a defect. It may be a dormant page, an untriggered state, a pseudo-state, or a selector whose component is absent from the capture.',
  '',
  '## Family summary',
  '',
  '| Family | Component/context groups | Components | Element observations | Groups with >1 computed fingerprint |',
  '|---|---:|---:|---:|---:|',
  ...Object.entries(familySummary).map(([id,s])=>`| ${id} — ${s.name} | ${s.componentContexts} | ${s.components} | ${s.observations} | ${s.stylesWithMultipleFingerprints} |`),
  '',
  '## Context variants (route and surface level)',
  '',
  '| Family | Component | Variant/size | Context | States | Observations | Style fingerprints |',
  '|---|---|---|---|---:|---:|---:|',
  ...variants.map((v)=>`| ${v.family} | ${v.component} (${v.tag}) | ${v.variant||'—'} / ${v.size||'—'} | ${v.primaryContext} | ${v.stateCount} | ${v.observations} | ${v.styleFingerprintCount} |`),
  '',
  'The machine-readable JSON contains representative computed-style values and context trails. It intentionally omits element text, user names, IDs, and paths so account data is not copied into the report.',
  '',
  '## Editing guardrail',
  '',
  'Use this inventory to formulate one component batch at a time. Before any CSS edit, present the exact component scope, included/excluded contexts, suspected shared declarations, and expected baseline proof; wait for user confirmation. Preserve different computed fingerprints until evidence proves a difference is caused only by data/size rather than intended context styling.',
  '',
];
fs.writeFileSync(path.join(reportDir,'component-variant-inventory.md'),md.join('\n'));
console.log(JSON.stringify({stateCount:snapshotFiles.length,observedElementRecords:totalElements,familySummary,variantGroups:variants.length},null,2));
