/* NOT WINDOWS: fictional user-dialog / avatar fixture; app checkout and screenshots stay read-only. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const runtime=path.resolve(here,'../..');
// Authority: /tmp/vrcx-win-src/src; source utility geometry is fixture-only.
process.env.TMPDIR=path.join(here,'browser-tmp');await fs.mkdir(process.env.TMPDIR,{recursive:true});
const outputDir=path.resolve(process.env.JIRAI_OUT||path.join(runtime,'preview-package/jirai-kei-theme'));
const cssFiles=[path.join(outputDir,'theme.css')];
const [html,...loaded]=await Promise.all([fs.readFile(path.join(here,'fixture.html'),'utf8'),...cssFiles.map(f=>fs.readFile(f,'utf8'))]);
// R9 intentionally supersedes R8 banner/avatar values (checked by checks/r9-user-dialog); judge R8 without that later layer.
loaded.splice(0,loaded.length,...loaded.map(t=>t.replace(/\/\* SECTION user-dialog-r9 \*\/[\s\S]*?(?=\/\* SECTION [^*]+\*\/|$)/g,'')));
// Before omits only these reviewed sections; after is the current compiled
// theme, not an overlay of source fixes on an already-fixed baseline.
const stripReviewedLayers=text=>text.replace(/\/\* SECTION (?:bio-diff-r8|user-dialog-r8) \*\/[\s\S]*?(?=\/\* SECTION [^*]+\*\/|$)/g,'');
for(const name of ['bio-diff-r8','user-dialog-r8'])if(!loaded.some(s=>s.includes(`/* SECTION ${name} */`)))throw new Error(`Current package missing section ${name}; rebuild before verifying`);
const baselineCss=loaded.map(stripReviewedLayers);
const bioCss=await fs.readFile(path.join(runtime,'bio-diff-r8.css'),'utf8');
const dialogCss=await fs.readFile(path.join(runtime,'user-dialog-r8.css'),'utf8');
const cssBytes=Buffer.byteLength(dialogCss),bioCssBytes=Buffer.byteLength(bioCss);
if(cssBytes>10*1024)throw new Error(`user-dialog CSS budget exceeded: ${cssBytes} bytes`);
for(const [name,text] of [['bio-diff-r8.css',bioCss],['user-dialog-r8.css',dialogCss]])if(/@import|url\((?!["']?data:)/i.test(text))throw new Error(`${name} uses @import or a non-data URL`);

const parseColor=s=>{const m=s?.match(/rgba?\((\d+(?:\.\d+)?)[, ]+\s*(\d+(?:\.\d+)?)[, ]+\s*(\d+(?:\.\d+)?)(?:[, /]+\s*(\d+(?:\.\d+)?))?\)/);if(!m)return null;return [Number(m[1]),Number(m[2]),Number(m[3]),m[4]===undefined?1:Number(m[4])];};
const linear=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4};
const luminance=c=>.2126*linear(c[0])+.7152*linear(c[1])+.0722*linear(c[2]);
const ratio=(fg,bg)=>{const a=luminance(fg),b=luminance(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1360,height:960},deviceScaleFactor:1});
 const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
 await page.setContent(html,{waitUntil:'domcontentloaded'});
 const baselineStyles=[];for(const content of baselineCss)baselineStyles.push(await page.addStyleTag({content}));
 const metric=()=>page.evaluate(()=>{
  const style=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {color:s.color,bg:s.backgroundColor,borderRadius:s.borderRadius,borderColor:s.borderColor,borderWidth:s.borderWidth,clipPath:s.clipPath,opacity:s.opacity,position:s.position,top:s.top,right:s.right,bottom:s.bottom,left:s.left,x:r.x,y:r.y,width:r.width,height:r.height,transform:s.transform,outline:s.outline,outlineOffset:s.outlineOffset,appearance:s.appearance,boxShadow:s.boxShadow,textDecoration:s.textDecorationLine,borderBottom:s.borderBottomWidth}};
  const q=s=>document.querySelector(s);
  const avatarImages=selector=>[...document.querySelectorAll(selector)].map(style);
  const avatarDots=selector=>[...document.querySelectorAll(selector)].map(style);
   const avatarPseudoRings=selector=>[...document.querySelectorAll(selector)].flatMap(el=>['::before','::after'].map(p=>{const s=getComputedStyle(el,p);return {pseudo:p,content:s.content,display:s.display,visibility:s.visibility,opacity:s.opacity,borderWidth:s.borderWidth,backgroundColor:s.backgroundColor,backgroundImage:s.backgroundImage,maskImage:s.maskImage}}));
  const banner=q('.entity-dialog [data-slot="button"][class*="aspect-[4/3]"]');
  const range=q('.entity-dialog input[type="range"].min-w-16');const statusRange=q('.entity-dialog input[type="range"][data-status-range]');
  const history=q('.entity-dialog .history-scroll > pre > pre.leading-5');
  const add=history.querySelector('span[class~="bg-emerald-500/15"]');
  const del=history.querySelector('span[class~="bg-rose-500/15"]');
  const header=q('[data-header-status]');
  const pseudo=(el,p)=>{const s=getComputedStyle(el,p);return {opacity:s.opacity,inset:s.inset,height:s.height,maskSize:s.maskSize,backgroundColor:s.backgroundColor}};
  const pseudoRules=suffix=>[...document.styleSheets].flatMap(sheet=>{try{return [...sheet.cssRules]}catch{return []}}).filter(rule=>rule.selectorText?.includes(suffix)).map(rule=>({selector:rule.selectorText,hostMatches:range.matches(rule.selectorText.split('::')[0]),statusMatches:statusRange.matches(rule.selectorText.split('::')[0]),declarations:rule.style.cssText}));
  const media={track:pseudoRules('::-webkit-slider-runnable-track'),thumb:pseudoRules('::-webkit-slider-thumb')};
  return {
   avatarCuts:{large:(()=>{const e=document.createElement('i');e.style.cssText='position:fixed;width:1px;height:1px;clip-path:var(--wd-avatar-cut)';document.documentElement.append(e);const v=getComputedStyle(e).clipPath;e.remove();return v})(),small:(()=>{const e=document.createElement('i');e.style.cssText='position:fixed;width:1px;height:1px;clip-path:var(--wd-avatar-cut-sm)';document.documentElement.append(e);const v=getComputedStyle(e).clipPath;e.remove();return v})()},sidebarImages:avatarImages('.vrcx-0-side-panel .avatar-root > .avatar-image'),dialogImages:avatarImages('.entity-dialog .avatar-root > .avatar-image'),worldDialogImage:style(q('.world-dialog .avatar-image')),sidebarAvatarPseudoRings:avatarPseudoRings('.vrcx-0-side-panel .avatar-root'),dialogAvatarPseudoRings:avatarPseudoRings('[data-slot="dialog-content"] .avatar-root'),worldDialogDot:style(q('.world-dialog .status-dot')),worldDialogNotEntity:!!q('.world-dialog').closest('[data-slot="dialog-content"]')&&!q('.world-dialog').closest('.entity-dialog'),
   sidebarDots:avatarDots('.vrcx-0-side-panel .status-dot[data-status]'),dialogDots:avatarDots('[data-slot="dialog-content"] .status-dot[data-status]'),
   appFrame:q('[data-profile-frame]')?style(q('[data-profile-frame]')):null,iconFrame:q('[data-app-icon-frame]')?style(q('[data-app-icon-frame]')):null,
   sidebarActiveRing:style(q('.vrcx-0-side-panel [data-active-ring]')),dialogActiveRing:style(q('.entity-dialog [data-active-ring]')),
   headerStatus:style(header),range:style(range),statusRange:style(statusRange),statusRangeBox:(()=>{const s=getComputedStyle(statusRange);return {appearance:s.appearance,backgroundColor:s.backgroundColor,cursor:s.cursor}})(),rangeMedia:media,history:{pre:style(history),added:style(add),deleted:style(del),addedText:add.textContent,deletedText:del.textContent},
   tooltip:style(q('.entity-dialog .range-wrap > .range-tooltip')),bannerBefore:pseudo(banner,'::before'),bannerAfter:pseudo(banner,'::after'),
   modalAvatarOutsideMain:!q('[data-slot="dialog-content"] .avatar-root > .avatar-image').closest('.vrcx-0-main-content')
  };
 });
 const sourceShape=await page.evaluate(()=>{const dot=document.querySelector('[data-header-status]'),inner=document.querySelector('.history-scroll > pre > pre.leading-5');return {titleHasNoCardHeader:dot.closest('[data-slot="card-header"]')===null,titleHasCardTitle:!!dot.closest('[data-slot="card-title"]'),nestedPre:inner?.parentElement.tagName==='PRE',newInlineDotSelectorHits:dot.matches('[data-slot="dialog-content"].entity-dialog [data-slot="card-title"] > span.flex.size-4.shrink-0.items-center.justify-center > span.rounded-full.inline-block[class~="size-2.5"]')};});if(!sourceShape.titleHasNoCardHeader||!sourceShape.titleHasCardTitle||!sourceShape.nestedPre||!sourceShape.newInlineDotSelectorHits)throw new Error('Fixture must mirror ordinary nameplate CardTitle and nested TextScroll pre');
  const dotMetrics=()=>page.locator('[data-inline-active],[data-group-dot],[data-nonentity-dot]').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {id:e.hasAttribute('data-inline-active')?'active':e.hasAttribute('data-group-dot')?'group':'nonentity',radius:s.borderRadius,borderWidth:s.borderWidth,borderColor:s.borderColor,bg:s.backgroundColor,width:r.width,height:r.height}}));const dotBefore=await dotMetrics();
  const before=await metric();if(before.history.added.color!=='rgb(52, 211, 153)'||before.history.added.bg!=='rgba(16, 185, 129, 0.15)')throw new Error('Fixture must render the actual emerald pre-fix diff utility');
 await page.screenshot({path:path.join(here,'before.png'),fullPage:true});
 for(const node of baselineStyles)await node.evaluate(e=>e.remove());
 for(const content of loaded)await page.addStyleTag({content});
 const after=await metric();
 await page.screenshot({path:path.join(here,'after.png'),fullPage:true});
 const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);const dotAfter=await dotMetrics();if(!eq(dotBefore.slice(1),dotAfter.slice(1)))throw new Error('GroupDialog/non-entity title status decoys changed');const a=dotBefore[0],b=dotAfter[0];if(b.radius!=='0px'||a.bg!==b.bg||a.borderColor!==b.borderColor||a.borderWidth!==b.borderWidth||a.width!==b.width||a.height!==b.height)throw new Error('Inline active border-2 colored ring must remain intact while squaring');if(before.headerStatus.borderRadius===after.headerStatus.borderRadius)throw new Error('Fix must demonstrably hit title outside card-header');
 if(before.dialogImages.length!==6||after.dialogImages.length!==6||before.sidebarImages.length!==6)throw new Error('Expected six matched fictional avatar samples in both surfaces');
 if(!after.modalAvatarOutsideMain)throw new Error('Dialog avatar fixture must live in a body-level portal outside main content');
 const expectedAvatarCut=after.avatarCuts.large,expectedSidebarCut=after.avatarCuts.small;if(!expectedAvatarCut.startsWith('polygon')||!expectedSidebarCut.startsWith('polygon')||!after.worldDialogNotEntity||after.worldDialogImage.clipPath!==expectedAvatarCut||after.worldDialogImage.borderRadius!=='0px'||after.worldDialogImage.borderWidth!=='0px'||after.worldDialogDot.borderRadius!=='0px'||before.worldDialogDot.bg!==after.worldDialogDot.bg)throw new Error(`Non-entity dialog avatar must use --wd-avatar-cut without a theme border, while its status lamp stays square and unchanged: ${JSON.stringify({image:after.worldDialogImage,dot:after.worldDialogDot,expectedAvatarCut})}`);
  for(let i=0;i<6;i++){
  const a=after.sidebarImages[i],b=after.dialogImages[i];
  if(a.clipPath!==expectedSidebarCut||b.clipPath!==expectedAvatarCut)throw new Error(`Avatar cut must match --wd-avatar-cut at index ${i}: ${JSON.stringify({a,b,expectedAvatarCut})}`);
  if(a.borderWidth!=='0px'||b.borderWidth!=='0px'||a.borderRadius!=='0px'||b.borderRadius!=='0px')throw new Error(`Avatar image must be squared and free of theme borders at index ${i}: ${JSON.stringify({a,b})}`);
  if(after.dialogDots[i].borderRadius!=='0px'||before.dialogDots[i].bg!==after.dialogDots[i].bg)throw new Error(`Dialog status light radius/fill regression at index ${i}`);
 }
 const avatarRings=[...after.sidebarAvatarPseudoRings,...after.dialogAvatarPseudoRings];const avatarPseudoRingVisible=r=>r.content!=='none'&&r.display!=='none'&&r.visibility!=='hidden'&&r.opacity!=='0'&&!(r.backgroundColor==='rgba(0, 0, 0, 0)'&&r.backgroundImage==='none'&&r.maskImage==='none');if(avatarRings.some(r=>r.borderWidth!=='0px'||avatarPseudoRingVisible(r)))throw new Error(`Theme-owned avatar pseudo ring remains: ${JSON.stringify(avatarRings.filter(r=>r.borderWidth!=='0px'||avatarPseudoRingVisible(r)))}`);if(after.dialogActiveRing.borderRadius!=='0px'||after.dialogActiveRing.borderColor!==after.sidebarActiveRing.borderColor||before.dialogActiveRing.borderColor!==after.dialogActiveRing.borderColor)throw new Error(`Active status inner ring must square up without recoloring: ${JSON.stringify({before:before.dialogActiveRing,after:after.dialogActiveRing,sidebar:after.sidebarActiveRing})}`);
  if(after.appFrame===null||!eq(before.appFrame,after.appFrame))throw new Error('ProfileAvatarFrame node computed style changed');
 if(after.iconFrame===null||!eq(before.iconFrame,after.iconFrame))throw new Error('Application/VRChat iconFrame node computed style changed');
 if(after.headerStatus.borderRadius!=='0px'||after.headerStatus.borderWidth!=='1px'||after.headerStatus.borderColor!=='rgb(33, 19, 45)'||before.headerStatus.width!==after.headerStatus.width||before.headerStatus.height!==after.headerStatus.height||before.headerStatus.bg!==after.headerStatus.bg||after.headerStatus.bg!=='rgb(244, 224, 94)')throw new Error(`Header status dot must be square/keylined without recoloring: ${JSON.stringify(after.headerStatus)}`);
 if(before.range.height!==after.range.height||before.range.width!==after.range.width)throw new Error(`Range hit-area size changed: ${before.range.width}x${before.range.height} -> ${after.range.width}x${after.range.height}`);
 const trackRule=after.rangeMedia.track.find(rule=>rule.hostMatches),thumbRule=after.rangeMedia.thumb.find(rule=>rule.hostMatches);
 if(!trackRule||!trackRule.declarations.includes('height: 8px')||!trackRule.declarations.includes('border: 1px solid rgb(75, 58, 99)'))throw new Error(`Range track rule missing/mismatched: ${JSON.stringify({range:after.range,track:after.rangeMedia.track})}`);
 if(!thumbRule||!thumbRule.declarations.includes('width: 16px')||!thumbRule.declarations.includes('height: 16px')||!thumbRule.declarations.includes('border: 1px solid rgb(33, 19, 45)'))throw new Error(`Range thumb rule missing/mismatched: ${JSON.stringify({range:after.range,thumb:after.rangeMedia.thumb})}`);
 if(after.range.appearance!=='none'||after.range.height!==before.range.height||before.range.height!==16)throw new Error(`Range input geometry/appearance mismatch: ${JSON.stringify({before:before.range,after:after.range})}`);
 await page.locator('.entity-dialog input[type="range"].min-w-16').focus();
 const focus=await page.locator('.entity-dialog input[type="range"].min-w-16').evaluate(e=>{const s=getComputedStyle(e);return {visible:e.matches(':focus-visible'),outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,outlineOffset:s.outlineOffset}});
 if(!focus.visible||focus.outlineStyle!=='dashed'||focus.outlineWidth!=='2px'||focus.outlineOffset!=='3px')throw new Error(`Missing focus-visible pixel outline: ${JSON.stringify(focus)}`);
 await page.locator('.entity-dialog input[type="range"].min-w-16').evaluate(e=>e.blur());
 // R9.8x regression: status-distribution range (`.accent-primary.w-28`, no min-w-16/flex-1) must get the same pixel slider with an unchanged box.
 if(!after.rangeMedia.track.some(r=>r.statusMatches&&r.declarations.includes('height: 8px'))||!after.rangeMedia.thumb.some(r=>r.statusMatches&&r.declarations.includes('width: 16px')))throw new Error(`Status-distribution range escapes the user-dialog-r8 slider rules: ${JSON.stringify(after.rangeMedia)}`);
 if(before.statusRange.width!==112||after.statusRange.width!==112||before.statusRange.height!==after.statusRange.height||before.statusRange.height!==16||before.statusRange.x!==after.statusRange.x||before.statusRange.y!==after.statusRange.y)throw new Error(`Status range box must stay 112x16 and not move: ${JSON.stringify({before:before.statusRange,after:after.statusRange})}`);
 // getComputedStyle(el,'::-webkit-slider-*') returns the HOST style in Chromium, so pseudo parts are judged from the matching CSSOM rules.
 const sb=after.statusRangeBox,bb=before.statusRangeBox;
 const statusTrack=after.rangeMedia.track.filter(r=>r.statusMatches),statusThumb=after.rangeMedia.thumb.filter(r=>r.statusMatches),bioTrack=after.rangeMedia.track.filter(r=>r.hostMatches),bioThumb=after.rangeMedia.thumb.filter(r=>r.hostMatches);
 if(sb.appearance!=='none'||bb.appearance==='none'||sb.cursor!=='pointer'||sb.backgroundColor!=='rgba(0, 0, 0, 0)')throw new Error(`Status range host must be de-chromed vs unthemed baseline: ${JSON.stringify({before:bb,after:sb})}`);
 if(!statusTrack.some(r=>r.declarations.includes('height: 8px')&&r.declarations.includes('border: 1px solid rgb(75, 58, 99)'))||!statusThumb.some(r=>r.declarations.includes('width: 16px')&&r.declarations.includes('border-radius: 0px')&&r.declarations.includes('background: rgb(255, 217, 238)')))throw new Error(`Status range pseudo rules missing/mismatched: ${JSON.stringify({statusTrack,statusThumb})}`);
 if(!eq(statusTrack.map(r=>r.selector+r.declarations),bioTrack.map(r=>r.selector+r.declarations))||!eq(statusThumb.map(r=>r.selector+r.declarations),bioThumb.map(r=>r.selector+r.declarations)))throw new Error('Status and bio-history sliders must be painted by the very same track/thumb rules');
 const bioBox=await page.evaluate(()=>{const s=getComputedStyle(document.querySelector('.entity-dialog input[type="range"].min-w-16'));return {appearance:s.appearance,backgroundColor:s.backgroundColor,cursor:s.cursor}});
 for(const k of ['appearance','backgroundColor','cursor'])if(bioBox[k]!==sb[k])throw new Error(`Status and bio-history sliders disagree on ${k}`);
 await page.locator('[data-status-range]').focus();
 const statusFocus=await page.locator('[data-status-range]').evaluate(e=>{const s=getComputedStyle(e);return {visible:e.matches(':focus-visible'),outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,outlineOffset:s.outlineOffset}});
 if(!statusFocus.visible||statusFocus.outlineStyle!=='dashed'||statusFocus.outlineWidth!=='2px'||statusFocus.outlineOffset!=='3px')throw new Error(`Status range missing focus-visible pixel outline: ${JSON.stringify(statusFocus)}`);
 await page.locator('[data-status-range]').evaluate(e=>e.blur());
 const narrowedSelectors=[...after.rangeMedia.track,...after.rangeMedia.thumb].filter(r=>/accent-primary|min-w-16|flex-1/.test(r.selector));if(narrowedSelectors.length)throw new Error(`Slider rules re-narrowed to utility classes: ${JSON.stringify(narrowedSelectors)}`);
 if(after.tooltip.borderRadius!=='0px'||after.tooltip.bg!=='rgb(33, 26, 51)')throw new Error('Date tooltip did not become a square pixel card');
 const contrast={};for(const [key,x] of [['added',after.history.added],['deleted',after.history.deleted]]){const fg=parseColor(x.color),bg=parseColor(x.bg);if(!fg||!bg)throw new Error(`Cannot measure bio diff ${key}`);contrast[key]=Number(ratio(fg,bg).toFixed(2));if(contrast[key]<4.5)throw new Error(`Bio diff contrast failed (${key}): ${contrast[key]}:1`)}
 // bio-diff-r8.css (changed after the original R8 report) deliberately drops the addition underline; the non-color cue is now removal=line-through vs addition=no decoration.
 if(parseFloat(after.history.added.borderBottom)!==0||after.history.added.textDecoration.includes('line-through')||!after.history.deleted.textDecoration.includes('line-through'))throw new Error('Diff needs removal line-through and undecorated additions as non-color cues');
 if(!after.history.addedText.includes('Added')||!after.history.deletedText.includes('Removed'))throw new Error('Fictional diff segment text missing');
 const beforeBanner=before.bannerBefore,afterBanner=after.bannerBefore;
 if(Number(afterBanner.opacity)>=0.2||!afterBanner.inset.includes('0px')||parseFloat(after.bannerAfter.height)!==4)throw new Error(`Theme-owned banner lace/hem was not subdued: ${JSON.stringify({afterBanner,after:after.bannerAfter})}`);
 if(pageErrors.length)throw new Error(`Browser page errors: ${pageErrors.join('; ')}`);
 const files={};for(const f of ['before.png','after.png','comparison.png']){try{const s=await fs.stat(path.join(here,f));files[f]={bytes:s.size}}catch{}}
 const beforePath=path.join(here,'before.png'),afterPath=path.join(here,'after.png'),comparisonPath=path.join(here,'comparison.png');
 const bm=await sharp(beforePath).metadata(),am=await sharp(afterPath).metadata();if(bm.width!==am.width||bm.height!==am.height)throw new Error('Before/after screenshot dimensions differ');
 const labelH=36,svg=Buffer.from(`<svg width="${bm.width*2}" height="${labelH}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#100b1e"/><text x="18" y="24" fill="#ffd9ee" font-family="sans-serif" font-size="18">BEFORE · sidebar cut-sm; R8 dialog baseline</text><text x="${bm.width+18}" y="24" fill="#ffd9ee" font-family="sans-serif" font-size="18">AFTER · selector-audited cut tiers</text></svg>`);
 await sharp({create:{width:bm.width*2,height:bm.height+labelH,channels:4,background:'#100b1e'}}).composite([{input:svg,left:0,top:0},{input:beforePath,left:0,top:labelH},{input:afterPath,left:bm.width,top:labelH}]).png().toFile(comparisonPath);
 for(const f of ['before.png','after.png','comparison.png'])files[f]={bytes:(await fs.stat(path.join(here,f))).size};
 const report={result:'PASS',authoritySources:['/tmp/vrcx-win-src/src/components/dialogs/user-dialog/components/UserDialogHeaderSection.tsx:709-734','/tmp/vrcx-win-src/src/components/UserStatusDot.tsx:26-35','/tmp/vrcx-win-src/src/components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:254-282'],actualSourceStructureHit:sourceShape,groupDialogAndNonEntityDecoysUnchanged:eq(dotBefore.slice(1),dotAfter.slice(1)),inlineActiveRingPreserved:{before:dotBefore[0],after:dotAfter[0]},headerDotBeforeAfter:{before:before.headerStatus,after:after.headerStatus},fixture:'NOT WINDOWS · fictional names and solid-color data-URI images only',loadedCssFiles:cssFiles.map(f=>path.basename(f)),missingTailwindUtilitiesSuppliedInFixture:['bg-emerald-500/15','bg-rose-500/15','text-emerald-700','dark:text-emerald-400','text-rose-700','dark:text-rose-400'],portalOutsideMain:after.modalAvatarOutsideMain,worldDialogUsesLargeCut:after.worldDialogImage.clipPath===expectedAvatarCut,avatarCutTiers:{sidebarSmall:after.sidebarImages.map(x=>x.clipPath===expectedSidebarCut),dialogLarge:after.dialogImages.map(x=>x.clipPath===expectedAvatarCut),worldDialogLarge:after.worldDialogImage.clipPath===expectedAvatarCut},frameNodesUnchanged:{ProfileAvatarFrame:eq(before.appFrame,after.appFrame),profileIconFrame:eq(before.iconFrame,after.iconFrame)},statusFillColorsUnchanged:before.dialogDots.map((x,i)=>x.bg===after.dialogDots[i].bg),activeInnerStatusRingAfter:{radius:after.dialogActiveRing.borderRadius,borderColor:after.dialogActiveRing.borderColor,unchanged:before.dialogActiveRing.borderColor===after.dialogActiveRing.borderColor},headerStatusAfter:{background:after.headerStatus.bg,borderRadius:after.headerStatus.borderRadius,border:after.headerStatus.borderWidth,borderColor:after.headerStatus.borderColor,size:{width:after.headerStatus.width,height:after.headerStatus.height}},statusRange:{width:after.statusRange.width,height:after.statusRange.height,boxUnchanged:true,look:after.statusRangeBox,baselineLook:before.statusRangeBox,focus:statusFocus},range:{widthBefore:before.range.width,widthAfter:after.range.width,heightBefore:before.range.height,heightAfter:after.range.height,track:after.rangeMedia,focus},bioDiffContrastWCAG:contrast,bioDiffNonColorCues:{addUnderlinePx:parseFloat(after.history.added.borderBottom),removeLineThrough:after.history.deleted.textDecoration.includes('line-through')},themeDecorationSourcesAndTreatment:{dialogAvatarPixelCut:'theme-authored windose-runtime.css avatar cut/frame rules; extended side-panel/data-table selectors to all dialog-content portals, including generic world dialogs',avatarThemeRings:'removed; pseudo-elements are absent/invisible and border-width is 0; paired profile/avatar image cuts follow the selector-specific cut/cut-sm tokens',bannerCrossStitch:'theme-authored windose-runtime.css ::before; margins narrowed and opacity lowered to 0.12',bannerScallop:'theme-authored windose-runtime.css ::after; height 4px and opacity 0.68',profileAvatarFrame:'application/VRChat ProfileAvatarFrame sibling, computed style unchanged; not clipped/covered by dialog avatar selectors',profileIconFrame:'application/VRChat profileAppearance.iconFrame sibling, computed style unchanged and original border-0 protection retained'},cssBytes:{'user-dialog-r8.css':cssBytes,'bio-diff-r8.css':bioCssBytes,limit:10240},files};
 await fs.writeFile(path.join(here,'verify-report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
