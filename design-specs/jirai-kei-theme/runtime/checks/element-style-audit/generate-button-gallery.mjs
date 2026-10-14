import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const defaultRepo = '/home/fulutang/Documents/Github/VRCX-0-jirai';
const SRC = path.resolve(process.env.AUDIT_SRC || path.join(defaultRepo, 'src'));
const APP_DIST = path.resolve(process.env.AUDIT_APP_DIST || path.join(defaultRepo, 'dist/assets'));
const OUT = path.resolve(process.env.BUTTON_GALLERY_OUT || path.join(here, 'button-gallery.html'));
const THEME_CSS = path.resolve(process.env.JIRAI_THEME_CSS || path.join(runtime, 'preview-package/jirai-kei-theme/theme.css'));
process.env.AUDIT_SRC = SRC;

const [{PRIMS, CONTEXTS, CTX_ORDER}, {scanSources}] = await Promise.all([
  import('./primitives.mjs'), import('./scan.mjs')
]);
const scan = await scanSources(SRC);
const buttonPrim = PRIMS.find(p => p.id === 'button');
if (!buttonPrim) throw new Error('PRIMS registry has no button entry');
const sites = scan.sites.filter(s => s.prim === 'button');
if (!sites.length) throw new Error(`No button sites found under ${SRC}`);

const STYLE_AUDIT_JSON = path.join(here, 'all-elements-overlap.json');
const styleAudit = JSON.parse(await fs.readFile(STYLE_AUDIT_JSON, 'utf8'));
if (path.resolve(styleAudit.summary.sourceRoot) !== SRC) throw new Error(`Style-code index sourceRoot differs from gallery source. Rerun audit-all-elements.mjs with AUDIT_SRC_ROOT=${SRC}`);
if (path.resolve(styleAudit.summary.theme) !== THEME_CSS) throw new Error(`Style-code index theme differs from gallery theme. Rerun audit-all-elements.mjs for ${THEME_CSS}`);
if (!styleAudit.styleCodeGroups?.every(group => Array.isArray(group.matchedElements))) throw new Error('Style-code index lacks matchedElements. Rerun audit-all-elements.mjs before generating the gallery.');
const siteKey = site => `${site.file}:${site.line}`;
const buttonCodeIdsBySite = new Map();
for (const group of styleAudit.styleCodeGroups) for (const element of group.matchedElements) {
  if (element.tag !== 'Button' || element.domTag !== 'button' || element.slot !== 'button') continue;
  const key = element.site;
  // StatusBarFooter popover actions render in a React portal, not beneath the statusbar.
  // Keep the source heuristic from claiming JCSS-0472 for those non-trigger sites.
  if (group.id === 'JCSS-0472' && /^components\/layout\/status-bar\/StatusBarFooter\.tsx:(801|816|836)$/.test(key)) continue;
  if (!buttonCodeIdsBySite.has(key)) buttonCodeIdsBySite.set(key, new Set());
  buttonCodeIdsBySite.get(key).add(group.id);
}
const uncoveredButtonSites = new Set((styleAudit.uncoveredGroup?.sites || []).filter(element => element.tag === 'Button' && element.domTag === 'button' && element.slot === 'button').map(element => element.site));

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groupsByContext = new Map();
const globalBySignature = new Map();
for (const site of sites) {
  const sig = buttonPrim.signature(site);
  if (!globalBySignature.has(sig)) globalBySignature.set(sig, site);
}
const representativeSignature = buttonPrim.signature(sites[0]);
let sampleCount = 0;
for (const context of CTX_ORDER) {
  const contextSites = sites.filter(site => site.ctx === context);
  const grouped = new Map();
  for (const site of contextSites) {
    const sig = buttonPrim.signature(site);
    if (!grouped.has(sig)) grouped.set(sig, []);
    grouped.get(sig).push(site);
  }
  const hasSites = contextSites.length > 0;
  if (!hasSites) grouped.set(representativeSignature, []);
  const items = [];
  for (const [sig, groupSites] of grouped) {
    const sample = groupSites[0] || globalBySignature.get(sig) || null;
    const [variant, size] = sig.split('|');
    const variants = buttonPrim.variants(sample, sig);
    for (const v of variants) {
      const id = `B${String(sampleCount + 1).padStart(3, '0')}`;
      const label = `${variant} · ${size}${v.tag ? ` · ${v.tag}` : ''}`;
      const count = groupSites.length;
      const codeIds = new Set();
      const uncoveredSiteKeys = [];
      const unmappedSiteKeys = [];
      const uniqueSites = new Map(groupSites.map(site => [siteKey(site), site]));
      for (const key of uniqueSites.keys()) {
        const matches = buttonCodeIdsBySite.get(key);
        if (matches?.size) for (const codeId of matches) codeIds.add(codeId);
        else if (uncoveredButtonSites.has(key)) uncoveredSiteKeys.push(key);
        else unmappedSiteKeys.push(key);
      }
      const codeGroupIds = [...codeIds].sort();
      const siteClassProfiles = new Set([...uniqueSites.values()].map(site => site.props?.className || ''));
      const heterogeneous = siteClassProfiles.size > 1;
      const sourceRows = [...uniqueSites.values()].map(site => `<li><code>${esc(site.file)}:${site.line}</code>${site.props?.className ? ` <small>${esc(site.props.className)}</small>` : ''}</li>`).join('');
      const sourceDetails = count
        ? `<details class="source-sites"><summary>${count} 个源码使用点${heterogeneous ? ' · ⚠ site classes heterogeneous' : ''}</summary>${heterogeneous ? '<p class="profile-status uncovered">同一 B ID 聚合的 callsite className 不同；下方仅为共享 primitive 基线，不能代表所有源点的属性/子树匹配。</p>' : ''}<ul>${sourceRows}</ul></details>`
        : '<small class="representative-note">无真实使用点；此按钮仅为审计代表样本</small>';
      items.push({id, sig, variant, size, label, count, codeGroupIds, uncoveredSiteKeys, unmappedSiteKeys, html: v.html, sourceDetails});
      sampleCount++;
    }
  }
  groupsByContext.set(context, {context, sites: contextSites.length, hasSites, items});
}

const appCssFiles = (await fs.readdir(APP_DIST))
  .filter(file => /^(index|App)-.*\.css$/.test(file))
  .sort((a, b) => a.startsWith('index') === b.startsWith('index') ? a.localeCompare(b) : a.startsWith('index') ? -1 : 1);
if (!appCssFiles.length) throw new Error(`No index-*.css / App-*.css assets under ${APP_DIST}`);
await fs.access(THEME_CSS);
const makeCssLinks = htmlPath => {
  const hrefFor = target => path.relative(path.dirname(htmlPath), target).split(path.sep).join('/');
  return appCssFiles.map(file => `<link rel="stylesheet" href="${esc(hrefFor(path.join(APP_DIST, file)))}" data-source="app:${esc(file)}">`).join('\n')
    + `\n<link rel="stylesheet" href="${esc(hrefFor(THEME_CSS))}" data-source="jirai-theme">`;
};
const cssLinks = makeCssLinks(OUT);
const styleProperties = new Set(['appearance','background','background-color','background-image','border','border-color','border-radius','border-style','border-width','box-shadow','clip-path','color','filter','font-family','font-size','font-weight','height','outline','text-shadow','text-transform','transform','width']);
const declarationKey = declarations => JSON.stringify(declarations.map(d => ({prop: d.prop.toLowerCase(), value: String(d.value).trim(), important: !!d.important})));
const groupByDeclarationKey = new Map(styleAudit.styleCodeGroups.map(group => [declarationKey(group.declarations), group]));
const runtimeCodeIdsByProfile = new Map();
const unmappedRuntimeRules = [];
const runtimeProbeProfiles = new Map();
for (const group of groupsByContext.values()) for (const item of group.items) {
  if (!item.count) continue;
  const key = `${group.context}\0${item.html}`;
  if (!runtimeProbeProfiles.has(key)) runtimeProbeProfiles.set(key, {key, context: group.context, nodeId: `runtime-probe-${runtimeProbeProfiles.size + 1}`, html: item.html});
}
const runtimeAuditPath = path.join(path.dirname(OUT), `.button-gallery-runtime-audit-${process.pid}-${Date.now()}.html`);
const auditContexts = CTX_ORDER.map(context => {
  const cells = [...runtimeProbeProfiles.values()].filter(probe => probe.context === context).map(probe => `<div id="${probe.nodeId}">${probe.html}</div>`).join('');
  const wrapped = CONTEXTS[context].wrap(`<div class="button-sample-grid">${cells}</div>`);
  return `<div class="audit-scene" data-prim="button" data-ctx="${esc(context)}"><div data-scene="${esc(context)}">${wrapped}</div></div>`;
}).join('\n');
const runtimeAuditHtml = `<!doctype html><html lang="zh-CN" class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark">${makeCssLinks(runtimeAuditPath)}<style>
html,body{margin:0;min-height:100%;height:auto!important;overflow-x:hidden!important;overflow-y:auto!important;background:#2a2147;color:#f2ebff}
body{display:block!important;width:auto!important;height:auto!important;overflow:visible!important;font:12px/1.4 system-ui,sans-serif}
[data-scene] [data-slot="dialog-content"],[data-scene] [data-slot="popover-content"],[data-scene] [data-slot="toast-content"],[data-scene] [data-vrcx-0-surface="privacy-lock"],[data-scene] [data-slot="toast"],[data-scene] [data-slot="toast-viewport"]{position:relative!important;inset:auto!important;transform:none!important;translate:none!important;animation:none!important;max-width:none!important;max-height:none!important;overflow:visible!important;opacity:1!important;width:auto!important;margin:0!important;height:auto!important}
[data-scene] .vrcx-0-app-root{height:auto!important;overflow:visible!important}
[data-scene="app-chrome"] .vrcx-0-titlebar{height:auto!important;min-height:2.25rem;align-items:stretch!important}
[data-scene] [data-vrcx-0-surface]:not([data-slot]){overflow:visible!important}
[data-scene] .vrcx-0-page-scaffold{height:auto!important;overflow:visible!important}
</style></head><body>${auditContexts}</body></html>`;
const codeStates = [[]];
let runtimeRuleMatchCount = 0;
let runtimeAuditFileCreated = false;
try {
  await fs.writeFile(runtimeAuditPath, runtimeAuditHtml, {encoding: 'utf8', flag: 'wx'});
  runtimeAuditFileCreated = true;
  process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/tmp/dsh-theme-browsers';
  const {chromium} = await import(process.env.AUDIT_PLAYWRIGHT || '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs');
  const browser = await chromium.launch({headless: true});
  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    await page.goto(pathToFileURL(runtimeAuditPath).href, {waitUntil: 'load'});
    const cdp = await page.context().newCDPSession(page);
    const sheetHeaders = new Map();
    cdp.on('CSS.styleSheetAdded', event => sheetHeaders.set(event.header.styleSheetId, event.header));
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const themeSheetIds = new Set([...sheetHeaders.values()].filter(header => {
      try { return path.resolve(fileURLToPath(header.sourceURL)) === THEME_CSS; } catch { return false; }
    }).map(header => header.styleSheetId));
    if (!themeSheetIds.size) throw new Error(`Runtime audit could not bind Jirai stylesheet ${THEME_CSS}`);
    const {root} = await cdp.send('DOM.getDocument', {depth: -1, pierce: true});
    for (const probe of runtimeProbeProfiles.values()) {
      const {nodeId} = await cdp.send('DOM.querySelector', {nodeId: root.nodeId, selector: `#${probe.nodeId} > button`});
      if (!nodeId) throw new Error(`Runtime audit could not find probe ${probe.nodeId} (${probe.context})`);
      const ids = new Set();
      for (const pseudoClasses of codeStates) {
        await cdp.send('CSS.forcePseudoState', {nodeId, forcedPseudoClasses: pseudoClasses});
        const matched = await cdp.send('CSS.getMatchedStylesForNode', {nodeId});
        for (const entry of matched.matchedCSSRules || []) {
          const rule = entry.rule;
          if (!themeSheetIds.has(rule.styleSheetId)) continue;
          const declarations = (rule.style.cssProperties || []).filter(property => property.range && property.text && !property.disabled)
            .map(property => ({prop: property.name.toLowerCase(), value: property.value, important: !!property.important}));
          if (!declarations.length || !declarations.some(declaration => styleProperties.has(declaration.prop))) continue;
          const codeGroup = groupByDeclarationKey.get(declarationKey(declarations));
          if (!codeGroup) {
            unmappedRuntimeRules.push({context: probe.context, selector: rule.selectorList?.text || '', declarations});
            continue;
          }
          ids.add(codeGroup.id);
          runtimeRuleMatchCount++;
        }
      }
      runtimeCodeIdsByProfile.set(probe.key, ids);
    }
    for (const group of groupsByContext.values()) for (const item of group.items) {
      if (!item.count) continue;
      const runtimeIds = runtimeCodeIdsByProfile.get(`${group.context}\0${item.html}`) || new Set();
      item.codeGroupIds = [...new Set([...item.codeGroupIds, ...runtimeIds])].sort();
    }
    await cdp.detach();
  } finally {
    await browser.close();
  }
} finally {
  if (runtimeAuditFileCreated) {
    const resolvedAuditPath = path.resolve(runtimeAuditPath);
    if (path.dirname(resolvedAuditPath) !== path.dirname(OUT) || !path.basename(resolvedAuditPath).startsWith('.button-gallery-runtime-audit-')) throw new Error(`Refusing to remove unexpected runtime audit path ${resolvedAuditPath}`);
    await fs.rm(resolvedAuditPath, {force: true});
  }
}
if (unmappedRuntimeRules.length) throw new Error(`Runtime Jirai CSS matching found ${unmappedRuntimeRules.length} visual rules with no declaration-code index; first: ${JSON.stringify(unmappedRuntimeRules[0])}`);
const codeProfileKey = item => JSON.stringify({codes: item.codeGroupIds, uncovered: item.uncoveredSiteKeys.length > 0, unmapped: item.unmappedSiteKeys.length > 0, representative: item.count === 0});
const codeProfileLabel = item => item.codeGroupIds.length
  ? `${item.codeGroupIds.join(' + ')}${item.uncoveredSiteKeys.length ? ' · 部分未覆盖' : ''}${item.unmappedSiteKeys.length ? ' · 部分未映射' : ''}`
  : item.uncoveredSiteKeys.length ? '未覆盖'
    : item.unmappedSiteKeys.length ? '未映射'
      : '代表样本（无真实使用点）';
const codeProfileHeading = item => item.codeGroupIds.length
  ? `${item.codeGroupIds.map(id => `<code>${esc(id)}</code>`).join(' <span class="code-plus">+</span> ')}${item.uncoveredSiteKeys.length ? ' <span class="profile-status uncovered">部分未覆盖</span>' : ''}${item.unmappedSiteKeys.length ? ' <span class="profile-status unmapped">部分未映射</span>' : ''}`
  : item.uncoveredSiteKeys.length ? '<code class="profile-status uncovered">未覆盖</code>'
    : item.unmappedSiteKeys.length ? '<code class="profile-status unmapped">未映射</code>'
      : '<code>代表样本（无真实使用点）</code>';
const buttonCodeGroupCount = new Set([...groupsByContext.values()].flatMap(group => group.items.filter(item => item.count > 0).flatMap(item => item.codeGroupIds))).size;
const matchedButtonSourceCount = sites.filter(site => buttonCodeIdsBySite.has(siteKey(site))).length;
const uncoveredButtonSourceCount = sites.filter(site => uncoveredButtonSites.has(siteKey(site))).length;
const unmappedButtonSourceCount = sites.length - matchedButtonSourceCount - uncoveredButtonSourceCount;
const uniqueButtonCodeProfiles = new Set([...groupsByContext.values()].flatMap(group => group.items.filter(item => item.count > 0).map(codeProfileKey))).size;

const contextsMarkup = CTX_ORDER.map((context, index) => {
  const group = groupsByContext.get(context);
  const n = group.items.length;
  const profiles = new Map();
  for (const item of group.items) {
    const key = codeProfileKey(item);
    if (!profiles.has(key)) profiles.set(key, {key, items: []});
    profiles.get(key).items.push(item);
  }
  const profileGroups = [...profiles.values()].sort((a, b) => b.items.length - a.items.length || codeProfileLabel(a.items[0]).localeCompare(codeProfileLabel(b.items[0])));
  const profileMarkup = profileGroups.map(profile => {
    const first = profile.items[0];
    const sourceCount = profile.items.reduce((sum, item) => sum + item.count, 0);
    const cells = profile.items.map(item => {
      const codeSearch = [...item.codeGroupIds, ...(item.uncoveredSiteKeys.length ? ['uncovered', '未覆盖'] : []), ...(item.unmappedSiteKeys.length ? ['unmapped', '未映射'] : [])].join(' ');
      const search = `${item.id} ${context} ${item.variant} ${item.size} ${item.sig} ${codeSearch}`.toLowerCase();
      const title = `${item.id} · ${item.label} · ${item.count ? `${item.count} 个源码使用点` : '仅审计代表样本'} · ${codeProfileLabel(item)}`;
      return `<div class="audit-cell" id="sample-${item.id}" data-button-id="${item.id}" data-index="${item.id}" data-signature="${esc(item.sig)}" data-code-groups="${esc(item.codeGroupIds.join(' '))}" data-search="${esc(search)}" title="${esc(title)}">${item.html}</div>`;
    }).join('');
    const profileKind = first.codeGroupIds.length ? 'matched' : first.uncoveredSiteKeys.length ? 'uncovered' : first.unmappedSiteKeys.length ? 'unmapped' : 'representative';
    return `<section class="button-code-group" data-profile-kind="${profileKind}" data-code-profile="${esc(profile.key)}">
      <header class="button-code-heading"><h3>${codeProfileHeading(first)}</h3><p>${profile.items.length} 个样本 · ${sourceCount} 个源码使用点</p></header>
      <div class="button-sample-grid">${cells}</div>
    </section>`;
  }).join('');
  const wrapped = CONTEXTS[context].wrap(`<div class="button-profile-list">${profileMarkup}</div>`);
  const sources = group.items.map(item => `<li><strong><code>${item.id}</code> · ${esc(item.label)}</strong> — ${item.count} sites${item.sourceDetails}</li>`).join('');
  return `<section class="gallery-context" id="context-${esc(context)}" data-context="${esc(context)}" data-site-count="${group.sites}">
    <header class="context-heading"><div><span class="context-index">${String(index + 1).padStart(2, '0')}</span><h2>${esc(context)}</h2></div>
      <p>${group.sites} 个源码使用点 · ${n} 个矩阵样本${group.hasSites ? '' : ' · 无真实使用点'}</p></header>
    <div class="audit-scene" data-prim="button" data-ctx="${esc(context)}"><div class="audit-label">button · ${esc(context)}${group.hasSites ? '' : ' · (no use site: representative)'}</div><div data-scene="${esc(context)}">${wrapped}</div></div>
    <details class="context-sources"><summary>查看 variant / size 与源码站点（${n} 组）</summary><ul>${sources}</ul></details>
  </section>`;
}).join('\n');

const nav = CTX_ORDER.map(context => `<a href="#context-${esc(context)}" data-context-link="${esc(context)}">${esc(context)}</a>`).join('');

const html = `<!doctype html>
<html lang="zh-CN" class="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Button Gallery · Jirai contexts</title>
${cssLinks}
<style>
/* Audit scene normalization is intentionally kept equivalent to audit.mjs. */
html,body{margin:0;min-height:100%;height:auto!important;overflow-x:hidden!important;overflow-y:auto!important;background:#2a2147;color:#f2ebff}
body{display:block!important;width:auto!important;height:auto!important;overflow:visible!important;font:12px/1.4 system-ui,sans-serif}
[data-scene] [data-slot="dialog-content"],[data-scene] [data-slot="popover-content"],[data-scene] [data-slot="toast-content"],[data-scene] [data-vrcx-0-surface="privacy-lock"],[data-scene] [data-slot="toast"],[data-scene] [data-slot="toast-viewport"]{position:relative!important;inset:auto!important;transform:none!important;translate:none!important;animation:none!important;max-width:none!important;max-height:none!important;overflow:visible!important;opacity:1!important;width:auto!important;margin:0!important;height:auto!important}
[data-scene] .vrcx-0-app-root{height:auto!important;overflow:visible!important}
[data-scene="app-chrome"] .vrcx-0-titlebar{height:auto!important;min-height:2.25rem;align-items:stretch!important}
[data-scene] [data-vrcx-0-surface]:not([data-slot]){overflow:visible!important}
[data-scene] .vrcx-0-page-scaffold{height:auto!important;overflow:visible!important}
#gallery-shell{width:min(1100px,calc(100vw - 32px));margin:0 auto;padding:0 0 42px}
.gallery-header{position:sticky;top:0;z-index:100;padding:14px 0 10px;background:rgb(42 33 71/.96);border-bottom:1px solid #6c5ce0;backdrop-filter:blur(8px)}
.title-row{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}
.title-row h1{margin:0;color:#ffd9ee;font:600 20px/1.2 system-ui,sans-serif;letter-spacing:.02em}
.summary{margin:5px 0 0;color:#d6b8ef;font-size:12px}
.search-row{display:flex;align-items:center;gap:8px;margin-top:10px;max-width:620px}
#filter{flex:1;min-width:160px}
.context-nav{display:flex;gap:6px;overflow:auto;padding:8px 0 2px;scrollbar-width:thin}
.context-nav a{flex:none;padding:3px 7px;border:1px solid #6c5ce0;color:#f2ebff;text-decoration:none;font:11px/1.3 ui-monospace,monospace;background:#201936}
.context-nav a:hover,.context-nav a:focus-visible{background:#332650;outline:2px solid #ff7fcf;outline-offset:1px}
.button-profile-list{display:grid;gap:10px;min-width:0}
.button-code-group{min-width:0;padding:5px 8px 8px;border:1px solid #51427f;background:rgb(32 25 54/.32)}
.button-code-group[data-profile-kind="uncovered"]{border-color:#ff7fcf}
.button-code-group[data-profile-kind="unmapped"]{border-color:#a294c8}
.button-code-heading{display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap;margin:0 0 6px;padding-bottom:4px;border-bottom:1px solid #51427f}
.button-code-heading h3{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin:0;color:#ffd9ee;font:600 11px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}
.button-code-heading h3 code{font:inherit;color:#ffb8e6}
.button-code-heading p{margin:0;color:#a294c8;font-size:10px}
.code-plus{color:#8b78bd;font-size:10px}
.profile-status.uncovered{color:#ffb8e6}
.profile-status.unmapped{color:#d6b8ef}
.gallery-context{min-width:0;margin:14px 0 20px;padding:8px 10px 10px;border:1px solid #6c5ce0;border-left:3px solid #6c5ce0;background:rgb(32 25 54/.58);scroll-margin-top:135px}
.context-heading{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:5px}
.context-heading>div{display:flex;align-items:baseline;gap:8px}
.context-heading h2{margin:0;color:#ffd9ee;font:600 15px/1.3 ui-monospace,monospace}
.context-heading p{margin:0;color:#d6b8ef;font-size:11px}
.context-index{color:#a294c8;font:11px ui-monospace,monospace}
.audit-scene{margin:4px 0;padding:4px 8px;border-left:3px solid #6c5ce0;position:relative;overflow:visible}
.audit-label{font:10px ui-monospace,monospace;color:#d6b8ef;margin-bottom:2px}
.button-sample-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:center;gap:8px 10px;min-width:0;width:100%}
.audit-cell{display:inline-block;vertical-align:top;margin:0;min-width:0}.audit-cell::before{content:attr(data-index);display:inline-block;vertical-align:middle;min-width:34px;margin-right:6px;color:#f2ebff;text-align:right;font:600 11px/1 ui-monospace,monospace}
.context-sources{margin:5px 0 0;color:#d6b8ef;font-size:11px}
.context-sources summary{cursor:pointer;color:#c7b5e2}
.context-sources>ul{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:4px 18px;margin:8px 0 0;padding-left:20px;max-height:340px;overflow:auto}
.source-sites{display:inline-block;margin-left:6px;color:#b9add9}
.source-sites summary{cursor:pointer;display:inline}
.source-sites ul{max-height:180px;overflow:auto;margin:4px 0;padding-left:18px;color:#b9add9}
.representative-note{color:#a294c8}
.empty-state{display:none;padding:18px;border:1px dashed #8c71b0;color:#d6b8ef;text-align:center}
footer{margin-top:28px;padding:12px 0;border-top:1px solid #6c5ce0;color:#b9add9;font-size:11px}
@media(max-width:640px){#gallery-shell{width:calc(100vw - 20px)}.button-sample-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.button-code-group{padding:5px}.gallery-header{padding-top:10px}.title-row h1{font-size:18px}.gallery-context{padding:7px}.context-heading{align-items:flex-start}.context-heading p{width:100%}.context-nav{margin-right:-10px}}
</style>
</head>
<body>
<div id="gallery-shell">
<header class="gallery-header">
  <div class="title-row"><div><h1>Button Gallery <span aria-hidden="true">·</span> 按钮上下文矩阵</h1>
    <p class="summary">${CTX_ORDER.length} 个上下文 · ${sites.length} 个源码使用点 · 全主题 ${styleAudit.summary.uniqueDeclarationStyleCodes} 种声明代码 · Button 命中 ${buttonCodeGroupCount} 组、归为 ${uniqueButtonCodeProfiles} 类 · 未覆盖 ${uncoveredButtonSourceCount} · 编号 B001–B${String(sampleCount).padStart(3, '0')}。</p></div></div>
  <div class="search-row"><label class="sr-only" for="filter">筛选按钮编号、JCSS 代码组、variant、size 或上下文</label><input id="filter" data-slot="input" type="search" placeholder="筛选：B001 / JCSS-0001 / context / variant / size / 未覆盖"><button id="clear-filter" data-slot="button" data-variant="outline" data-size="sm" type="button">清除</button></div>
  <nav class="context-nav" aria-label="按钮上下文跳转">${nav}</nav>
</header>
<main id="gallery">${contextsMarkup}</main>
<div class="empty-state" id="empty-state">没有匹配的按钮样本或 JCSS 代码组。</div>
<footer>
  <div>样本来源：扫描 ${scan.fileCount} 个 TSX/JSX 文件、${sites.length} 个 Button 使用点；跨上下文有 ${globalBySignature.size} 组签名、渲染 ${sampleCount} 个样本。每组显示一个代表按钮，全部源码站点可展开查看。</div>
  <div>每个上下文框内按 JCSS 声明代码组集合归组：合并源码点静态候选与 Chromium 在对应上下文中实际匹配到的基态规则；不把 VRCX variant 样式算作 Jirai CSS，也不按最终 computed style 分组。</div>
  <div>样式表按顺序加载：${appCssFiles.map(esc).join(' → ')} → ${esc(path.relative(runtime, THEME_CSS))}。源码或主题 CSS 改动后先重跑 audit-all-elements.mjs，再运行 generate-button-gallery.mjs；仅应用 CSS 哈希变化时重跑生成脚本。</div>
  <div>这是静态审计夹具，不是 VRCX route；“未覆盖”表示静态扫描无直接选择器候选，不能单凭此断言运行时无继承或 token 影响。</div>
</footer>
</div>
<script>
(() => {
  const input=document.querySelector('#filter'), clear=document.querySelector('#clear-filter');
  const sections=[...document.querySelectorAll('.gallery-context')], empty=document.querySelector('#empty-state');
  function update(){
    const q=input.value.trim().toLowerCase();let total=0;
    for(const section of sections){
      const cells=[...section.querySelectorAll('.audit-cell')];let shown=0;
      for(const cell of cells){const match=!q||cell.dataset.search.includes(q);cell.hidden=!match;if(match)shown++}
      section.hidden=shown===0;if(shown)total+=shown;
      const count=section.querySelector('.context-heading p');if(count)count.dataset.filtered=shown+'/'+cells.length+' 个样本';
    }
    empty.style.display=total?'none':'block';
  }
  input.addEventListener('input',update);clear.addEventListener('click',()=>{input.value='';update();input.focus()});
  for(const link of document.querySelectorAll('.context-nav a'))link.addEventListener('click',event=>{
    const section=document.querySelector(link.getAttribute('href'));
    if(section&&section.hidden&&link.dataset.contextLink){event.preventDefault();input.value=link.dataset.contextLink;update();section.scrollIntoView({behavior:'smooth',block:'start'})}
  });
})();
</script>
</body></html>`;

await fs.mkdir(path.dirname(OUT), {recursive:true});
await fs.writeFile(OUT, html, 'utf8');
const perContext = [...groupsByContext.values()].map(g => `${g.context}:${g.items.length}/${g.sites}`).join(', ');
console.log(JSON.stringify({output:OUT,source:SRC,scannedFiles:scan.fileCount,buttonSites:sites.length,uniqueSignatures:globalBySignature.size,contexts:CTX_ORDER.length,renderedSamples:sampleCount,totalThemeDeclarationStyles:styleAudit.summary.uniqueDeclarationStyleCodes,buttonStyleCodeGroups:buttonCodeGroupCount,buttonCodeProfiles:uniqueButtonCodeProfiles,runtimeProbeProfiles:runtimeProbeProfiles.size,runtimeMatchedRuleOccurrences:runtimeRuleMatchCount,unmappedRuntimeVisualRules:unmappedRuntimeRules.length,matchedButtonSourceSites:matchedButtonSourceCount,uncoveredButtonSourceSites:uncoveredButtonSourceCount,unmappedButtonSourceSites:unmappedButtonSourceCount,appCss:appCssFiles,themeCss:THEME_CSS,perContext},null,2));
