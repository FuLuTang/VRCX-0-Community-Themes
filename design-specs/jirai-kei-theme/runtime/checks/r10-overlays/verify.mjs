/* NOT WINDOWS: source-shaped fixture, fictional data only. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)), runtime=path.resolve(here,'../..');
const packageCss='/tmp/jirai-r10-out-overlays/jirai-kei-theme/theme.css';
const [html,built,overlay]=await Promise.all([
  fs.readFile(path.join(here,'fixture.html'),'utf8'),
  fs.readFile(packageCss,'utf8'),
  fs.readFile(path.join(runtime,'overlays-r10.css'),'utf8')
]);
const assert=(ok,message)=>{if(!ok)throw new Error(message)};
if(!built.includes('/* SECTION popups-r9 */'))throw new Error('Expected R9 base section is missing; rebuild');
if(/@import|url\((?!["']?data:)/i.test(overlay))throw new Error('Overlay CSS has external resources');
if(/dialog-content|alert-dialog/.test(overlay))throw new Error('Dialog/alert-dialog selectors are out of scope');
const baseline=built, afterCss=`${built}\n/* R10 overlay test append */\n${overlay}`;
const rgb=s=>{const m=s.match(/[\d.]+/g);return m?.map(Number)},lin=v=>(v/=255)<=.04045?v/12.92:((v+.055)/1.055)**2.4,lum=a=>.2126*lin(a[0])+.7152*lin(a[1])+.0722*lin(a[2]),contrast=(fg,bg)=>{const a=lum(rgb(fg)),b=lum(rgb(bg));return +((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(2)};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1080,height:760},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent(html);await page.addStyleTag({content:baseline});await page.evaluate(()=>document.fonts.ready);
  const read=()=>page.evaluate(()=>{
    const style=(el,pseudo)=>{const s=getComputedStyle(el,pseudo),r=el.getBoundingClientRect();return {color:s.color,bg:s.backgroundColor,border:s.border,borderLeft:s.borderLeft,borderColor:s.borderColor,radius:s.borderRadius,shadow:s.boxShadow,opacity:s.opacity,animation:s.animationName,transition:s.transitionDuration,width:r.width,height:r.height,padding:s.padding,clip:s.clipPath,outline:s.outline}};
    const q=s=>document.querySelector(s),ids=['ordinary-tooltip','status-tooltip','hover-card','toast-root','notification-sheet','other-sheet','entity-dialog-inner','entity-hover-card'];
    return {surfaces:Object.fromEntries(ids.map(id=>[id,style(q('#'+id))])),ordinaryArrow:getComputedStyle(q('#ordinary-arrow')).display,statusArrow:getComputedStyle(q('#status-arrow')).display,statusStack:style(q('#status-tooltip .status-stack')),avatar:style(q('#hover-avatar')),avatarImage:style(q('#hover-avatar img')),sheetHeader:style(q('#notification-sheet [data-slot="sheet-header"]')),sheetTitle:style(q('#notification-sheet [data-slot="sheet-title"]')),toastTitle:style(q('#toast-root [data-slot="toast-title"]')),toastDescription:style(q('#toast-root [data-slot="toast-description"]'))};
  });
  const before=await read();await page.screenshot({path:path.join(here,'before.png'),fullPage:true});
  await page.addStyleTag({content:overlay});const after=await read();await page.screenshot({path:path.join(here,'after.png'),fullPage:true});
  const statusParts=['bg','color','border','borderColor','radius','shadow','padding','width','height','animation','transition'];
  assert(equal(statusParts.map(k=>before.surfaces['status-tooltip'][k]),statusParts.map(k=>after.surfaces['status-tooltip'][k])),'Existing statusbar tooltip visual properties changed');
  const statusMatch=await page.evaluate(()=>({body:document.body.matches(':has(.vrcx-0-statusbar [data-slot="tooltip-trigger"][data-popup-open])'),stack:document.querySelector('#status-tooltip').matches(':is(:has(> div.flex.flex-col.gap-1.text-xs),.flex.flex-col.gap-1.text-xs)'),arrow:document.querySelector('#status-arrow').matches('#status-tooltip > div[class~="rotate-45"]'),rules:[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules].filter(r=>r.selectorText?.includes('statusbar')&&r.selectorText?.includes('rotate-45')).map(r=>({selector:r.selectorText,display:r.style.display}))}catch{return[]}})}));
  assert(before.statusArrow===after.statusArrow&&after.statusArrow==='none',`Statusbar tooltip arrow rule was disturbed: before=${before.statusArrow}, after=${after.statusArrow}, matches=${JSON.stringify(statusMatch)}`);
  assert(before.ordinaryArrow!=='none'&&after.ordinaryArrow==='none','Generic tooltip arrow was not deliberately hidden');
  for(const id of ['ordinary-tooltip','hover-card','toast-root','notification-sheet']){
    const b=before.surfaces[id],a=after.surfaces[id];assert(a.bg==='rgb(33, 26, 51)',`${id}: dark opaque panel missing (${a.bg})`);assert(a.radius==='0px',`${id}: square corners missing (${a.radius})`);assert(a.animation==='none',`${id}: animation must be static`);assert(a.transition.split(',').every(v=>parseFloat(v)===0),`${id}: transition must be static`);assert(Math.abs(a.width-b.width)<=2&&Math.abs(a.height-b.height)<=2,`${id}: geometry changed >2px (${b.width}x${b.height} -> ${a.width}x${a.height})`);assert(contrast(a.color,a.bg)>=4.5,`${id}: primary text contrast ${contrast(a.color,a.bg)}`);
  }
  assert(after.surfaces['ordinary-tooltip'].border.includes('rgb(108, 92, 224)'),'Generic tooltip 1px indigo border missing');
  assert(after.surfaces['hover-card'].border.includes('rgb(108, 92, 224)'),'Hover-card 1px indigo frame missing');
  assert(after.surfaces['toast-root'].borderLeft.includes('rgb(217, 127, 198)'),'Toast left pink type stripe missing');
  assert(after.surfaces['notification-sheet'].border.includes('rgb(108, 92, 224)'),'Notification sheet indigo edge missing');
  assert(equal([before.avatar.radius,before.avatar.clip,before.avatarImage.radius,before.avatarImage.clip],[after.avatar.radius,after.avatar.clip,after.avatarImage.radius,after.avatarImage.clip]),'Hover-card avatar geometry/shape was modified');
  assert(equal(before.surfaces['other-sheet'],after.surfaces['other-sheet']),'Unrelated sheet was modified');
  /* Real structure: an entity dialog's hover card is portalled to body (Base UI FloatingPortal), so it is NOT a descendant
     of .entity-dialog. The old negative control ("hover surface nested inside the dialog stays untouched") described a DOM
     shape that never occurs; the invariant that actually matters is kept on both sides:
       - ordinary (non-popup) content inside the dialog must not be touched by the overlay layer, and
       - the portalled hover card is an ordinary popup and must take the shared pixel treatment. */
  assert(equal(before.surfaces['entity-dialog-inner'],after.surfaces['entity-dialog-inner']),'Entity-dialog internal (non-popup) content was modified');
  assert(after.surfaces['entity-hover-card'].bg==='rgb(33, 26, 51)'&&after.surfaces['entity-hover-card'].radius==='0px','Body-portalled entity hover card was not themed');
  assert(before.surfaces['entity-hover-card'].bg!==after.surfaces['entity-hover-card'].bg,'Body-portalled entity hover card must actually be reached by the overlay layer');
  assert(equal(before.surfaces['status-tooltip'],after.surfaces['status-tooltip']),'R9 statusbar tooltip hit exclusion failed');
  assert(after.sheetHeader.bg==='rgb(217, 127, 198)'&&after.sheetHeader.color==='rgb(33, 19, 45)','Notification sheet pink Win98 titlebar missing');
  const ratios={tooltip:contrast(after.surfaces['ordinary-tooltip'].color,after.surfaces['ordinary-tooltip'].bg),hoverCard:contrast(after.surfaces['hover-card'].color,after.surfaces['hover-card'].bg),toastTitle:contrast(after.toastTitle.color,after.surfaces['toast-root'].bg),toastDescription:contrast(after.toastDescription.color,after.surfaces['toast-root'].bg),sheet:contrast(after.surfaces['notification-sheet'].color,after.surfaces['notification-sheet'].bg),sheetTitle:contrast(after.sheetTitle.color,after.sheetHeader.bg)};
  for(const [k,v] of Object.entries(ratios))assert(v>=4.5,`${k} contrast ${v} < 4.5`);
  // Confirm source/host focus remains visible and motion is absent under both reduced modes.
  await page.keyboard.press('Tab');const focusTargets=[];for(let i=0;i<8;i++){const id=await page.evaluate(()=>document.activeElement?.id);if(['ordinary-trigger','toast-action','sheet-close'].includes(id)){const outline=await page.evaluate(()=>getComputedStyle(document.activeElement).outline);focusTargets.push({id,outline});}await page.keyboard.press('Tab');}
  assert(focusTargets.some(x=>x.id==='toast-action'&&x.outline!=='none')&&focusTargets.some(x=>x.id==='sheet-close'&&x.outline!=='none'),'Keyboard focus outline missing on overlay actions');
  await page.emulateMedia({reducedMotion:'reduce'});const reduced=await read();assert(['ordinary-tooltip','hover-card','toast-root','notification-sheet'].every(id=>reduced.surfaces[id].animation==='none'),'prefers-reduced-motion did not remain static');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>document.documentElement.classList.add('reduce-effects'));const reduceEffects=await read();assert(['ordinary-tooltip','hover-card','toast-root','notification-sheet'].every(id=>reduceEffects.surfaces[id].animation==='none'),'html.reduce-effects did not remain static');
  const beforePath=path.join(here,'before.png'),afterPath=path.join(here,'after.png'),bm=await sharp(beforePath).metadata(),am=await sharp(afterPath).metadata();
  await sharp({create:{width:bm.width+am.width,height:Math.max(bm.height,am.height),channels:4,background:'#100b1e'}}).composite([{input:beforePath,left:0,top:0},{input:afterPath,left:bm.width,top:0}]).png().toFile(path.join(here,'comparison.png'));
  assert(errors.length===0,`Browser errors: ${errors.join('; ')}`);
  const report={result:'PASS',fixture:'NOT WINDOWS / fictional data / source-shaped portal surface probe',packageCss,overlayCss:path.join(runtime,'overlays-r10.css'),before,after,geometryMaxDeltaPx:2,contrastWCAG:ratios,statusbarTooltipUnchanged:true,statusbarArrowUnchanged:true,genericTooltipArrowHidden:true,hoverCardAvatarUnchanged:true,entityDialogInnerUnchanged:true,bodyPortalledEntityHoverCardThemed:true,unrelatedSheetUnchanged:true,keyboardFocusVisible:focusTargets,staticMotion:{prefersReducedMotion:true,htmlReduceEffects:true},screenshots:['before.png','after.png','comparison.png'],requiresLiveConfirmation:['BaseUI portal slot/utility composition and sheet BellIcon class','viewport-edge collision and narrow-window tooltip wrapping','actual toast type mapping and swipe/stack behavior']};
  await fs.writeFile(path.join(here,'verify-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,before:undefined,after:undefined},null,2));
} finally { await browser.close(); }
