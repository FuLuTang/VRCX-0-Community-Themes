/* NOT WINDOWS: verify the real TitleBarButton > BellIcon + Badge selector against the isolated R9 build. */
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const require=createRequire(import.meta.url);
const sharp=require('/tmp/dsh-theme-tools/node_modules/sharp');

const root='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const out=`${root}/runtime/checks/r9-badge`;
const cssPath='/tmp/jirai-r9-out-badge/jirai-kei-theme/theme.css';
const css=await fs.readFile(cssPath,'utf8');
const fixture=await fs.readFile(`${out}/fixture.html`,'utf8');
const browser=await chromium.launch({headless:true,args:['--disable-lcd-text']});
const page=await browser.newPage({viewport:{width:1280,height:320},deviceScaleFactor:1});
await page.setContent(fixture);
await page.addStyleTag({content:css});
await page.evaluate(()=>document.fonts.ready);
const aaVariants=await page.evaluate(()=>['baseline','opacity','will-change'].map((kind)=>{
  const badge=document.querySelector(`#aa-${kind}-badge`),button=badge.closest('button'),s=getComputedStyle(badge),r=badge.getBoundingClientRect(),b=button.getBoundingClientRect();
  return {kind,text:badge.textContent.trim(),width:r.width,height:r.height,minWidth:s.minWidth,maxWidth:s.maxWidth,widthProperty:s.width,fontFamily:s.fontFamily,fontSize:s.fontSize,scrollWidth:badge.scrollWidth,clientWidth:badge.clientWidth,relativeX:r.left-b.left,relativeY:r.top-b.top,opacity:s.opacity,willChange:s.willChange,animationName:s.animationName};
}));
const aaReference=aaVariants[0];
if(aaVariants.some((v)=>v.width!==24||v.height!==13||v.relativeX!==aaReference.relativeX||v.relativeY!==aaReference.relativeY||v.animationName!=='none'))throw new Error(`AA promotion candidates changed badge geometry or animation count: ${JSON.stringify(aaVariants)}`);
if(aaVariants[0].opacity!=='1'||aaVariants[0].willChange!=='auto'||aaVariants[1].opacity!=='0.999'||aaVariants[1].willChange!=='auto'||aaVariants[2].opacity!=='1'||aaVariants[2].willChange!=='opacity')throw new Error(`AA fixture did not isolate baseline / opacity / will-change modes: ${JSON.stringify(aaVariants)}`);
await page.locator('#aa-options').screenshot({path:`${out}/aa-options-lcd-disabled.png`});
const badgeSelector='.vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot="badge"]';
const icons=await page.evaluate(()=>{
  const button=document.querySelector('#notification-button');
  const svg=button?.querySelector(':scope > svg.lucide-bell');
  return {
    directBellSvg:Boolean(svg),
    buttonHasSelector:button?.matches(':has(> svg.lucide-bell)')===true,
    svgDisplay:svg?getComputedStyle(svg).display:null,
    svgVisibility:svg?getComputedStyle(svg).visibility:null,
    svgSize:svg?{width:parseFloat(getComputedStyle(svg).width),height:parseFloat(getComputedStyle(svg).height)}:null,
    svgRenderedBounds:svg?{width:svg.getBoundingClientRect().width,height:svg.getBoundingClientRect().height}:null,
    badgeMatches:Boolean(document.querySelector('.vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot="badge"]')),
    iconCssVariable:svg?getComputedStyle(svg).getPropertyValue('--px').trim()!=='':false
  };
});
if(!icons.directBellSvg||!icons.buttonHasSelector||!icons.badgeMatches||icons.svgDisplay==='none'||icons.svgVisibility==='hidden'||icons.svgSize.width<=0||icons.svgSize.height<=0) {
  throw new Error(`Theme icon layer broke BellIcon/:has(): ${JSON.stringify(icons)}`);
}
const pixelFontLoaded=await page.evaluate(()=>document.fonts.check('400 12px "WD Pixel"','99+'));
if(!pixelFontLoaded)throw new Error('WD Pixel ASCII font did not load for badge digits');

const stateFor=async()=>page.evaluate((selector)=>{
  const badge=document.querySelector(selector);
  if(!badge)return null;
  const s=getComputedStyle(badge),r=badge.getBoundingClientRect();
  const titlebar=document.querySelector('.vrcx-0-titlebar').getBoundingClientRect();
  const outlinePx=s.outlineStyle==='none'?0:(parseFloat(s.outlineWidth)||0);
  const visual={left:r.left-outlinePx,top:r.top-outlinePx,right:r.right+outlinePx,bottom:r.bottom+outlinePx};
  visual.width=visual.right-visual.left;visual.height=visual.bottom-visual.top;
  const svg=document.querySelector('#notification-button > svg.lucide-bell');
  const iconVisual=svg.getBoundingClientRect(),iconStyle=getComputedStyle(svg);
  const iconRendered={left:iconVisual.left,top:iconVisual.top,right:iconVisual.right,bottom:iconVisual.bottom,width:iconVisual.width,height:iconVisual.height};
  const iconWidth=parseFloat(iconStyle.width),iconHeight=parseFloat(iconStyle.height);
  const icon={left:iconVisual.left+(iconVisual.width-iconWidth)/2,top:iconVisual.top+(iconVisual.height-iconHeight)/2,width:iconWidth,height:iconHeight};
  icon.right=icon.left+icon.width;icon.bottom=icon.top+icon.height;
  const next=document.querySelector('#next-action').getBoundingClientRect();
  const search=document.querySelector('#quick-search').getBoundingClientRect();
  const overlapWidth=Math.max(0,Math.min(visual.right,icon.right)-Math.max(visual.left,icon.left));
  const overlapHeight=Math.max(0,Math.min(visual.bottom,icon.bottom)-Math.max(visual.top,icon.top));
  const overlapArea=overlapWidth*overlapHeight;
  const overlapRatio=overlapArea/(icon.width*icon.height);
  const range=document.createRange();range.selectNodeContents(badge);
  const t=range.getBoundingClientRect();
  return {
    text:badge.textContent.trim(),
    rect:{x:r.x,y:r.y,width:r.width,height:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom},
    textRect:{x:t.x,y:t.y,width:t.width,height:t.height,left:t.left,right:t.right,top:t.top,bottom:t.bottom},textCenterOffset:{x:Math.round(((t.left+t.right)/2-(r.left+r.width/2))*100)/100,y:Math.round(((t.top+t.bottom)/2-(r.top+r.height/2))*100)/100},
    geometry:{iconRect:icon,iconRenderedRect:iconRendered,iconArea:icon.width*icon.height,visualRect:visual,overlapArea:Math.round(overlapArea*100)/100,overlapRatio:Math.round(overlapRatio*10000)/10000,titlebarRect:titlebar.toJSON(),withinTitlebar:visual.left>=titlebar.left&&visual.top>=titlebar.top&&visual.right<=titlebar.right&&visual.bottom<=titlebar.bottom,clearOfQuickSearch:visual.left>=search.right,clearOfNextAction:visual.right<=next.left},


    background:s.backgroundColor,color:s.color,borderColor:s.borderTopColor,borderWidth:s.borderTopWidth,
    outlineColor:s.outlineColor,outlineWidth:s.outlineStyle==='none'?'0px':s.outlineWidth,outlineStyle:s.outlineStyle,boxShadow:s.boxShadow,radius:s.borderTopLeftRadius,
    fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,fontSynthesis:s.fontSynthesis,letterSpacing:s.letterSpacing,lineHeight:s.lineHeight,textAlign:s.textAlign,opacity:s.opacity,willChange:s.willChange,whiteSpace:s.whiteSpace,textOverflow:s.textOverflow,
    overflow:s.overflow,scrollWidth:badge.scrollWidth,clientWidth:badge.clientWidth,
    position:s.position,top:s.top,right:s.right,
    animationName:s.animationName,animationDuration:s.animationDuration,animationTimingFunction:s.animationTimingFunction,
    transitionDuration:s.transitionDuration
  };
},badgeSelector);
const assert=(ok,message)=>{if(!ok)throw new Error(message)};
const hex=(r,g,b)=>'#'+[r,g,b].map((v)=>v.toString(16).padStart(2,'0')).join('');
const screenshotPixels=async(buffer,textRect)=>{
  const {data,info}=await sharp(buffer).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const left=Math.max(0,Math.floor(textRect.left)),top=Math.max(0,Math.floor(textRect.top));
  const right=Math.min(info.width,Math.ceil(textRect.right)),bottom=Math.min(info.height,Math.ceil(textRect.bottom));
  const counts=new Map();
  for(let y=top;y<bottom;y++)for(let x=left;x<right;x++){
    const i=(y*info.width+x)*info.channels,c=hex(data[i],data[i+1],data[i+2]);
    counts.set(c,(counts.get(c)||0)+1);
  }
  const colors=[...counts].map(([color,count])=>({color,count})).sort((a,b)=>b.count-a.count);
  const base=new Set(['#21132d','#ffd9ee']);
  const transitions=colors.filter(({color})=>!base.has(color));
  return {rect:{left,top,right,bottom,width:right-left,height:bottom-top},colorCount:colors.length,baseColorsPresent:[...base].filter((c)=>counts.has(c)),transitionColorCount:transitions.length,colors};
};
const saveZoom=async(buffer,name,rect)=>{
  const left=Math.max(0,Math.floor(rect.left-2)),top=Math.max(0,Math.floor(rect.top-2));
  const right=Math.ceil(rect.right+2),bottom=Math.ceil(rect.bottom+2);
  await sharp(buffer).extract({left,top,width:right-left,height:bottom-top}).resize({width:(right-left)*8,height:(bottom-top)*8,kernel:'nearest'}).png().toFile(`${out}/zoom-${name}.png`);
};
const counts=[['one-digit','5'],['two-digit','42'],['ninety-nine-plus','99+']];
const samples={};
await page.locator('#unread-badge').evaluate((el)=>{el.textContent='99+';});
await page.locator('#fixture-count').evaluate((el)=>{el.textContent='NOT WINDOWS · BEFORE B · unread 99+';});
const bStyle=await page.addStyleTag({content:`#notification-button > [data-slot='badge']{width:23px!important;min-width:23px!important;max-width:23px!important;height:13px!important;padding:0!important;top:-2px!important;right:-3px!important;overflow:hidden!important;white-space:nowrap!important;border:1px solid #16112a!important;outline:none!important;box-shadow:inset 0 0 0 1px #ffe4f2!important;background:#21132d!important;color:#ffd9ee!important;font:400 9px/9px 'WD Pixel'!important;letter-spacing:0!important;animation:none!important;}`});
const beforeBShot=await page.screenshot({path:`${out}/before-b.png`});
await bStyle.evaluate((el)=>el.remove());
for(const [name,count] of counts){
  await page.locator('#unread-badge').evaluate((el,value)=>{el.textContent=value;},count);
  const reset=await page.evaluate(()=>{
    const animation=document.getAnimations().find((a)=>a.animationName==='r9-notification-badge-flash');
    if(animation)animation.currentTime=0;
    const badge=document.querySelector('#unread-badge');
    const s=getComputedStyle(badge);
    return {hasAnimation:Boolean(animation),width:badge.getBoundingClientRect().width,height:badge.getBoundingClientRect().height,animationName:s.animationName};
  });
  const sample=await stateFor();
  assert(reset.hasAnimation&&reset.animationName==='r9-notification-badge-flash',`Unread ${count} has no badge animation`);
  const expectedOuterWidth={'one-digit':14,'two-digit':18,'ninety-nine-plus':24}[name];
   assert([sample.rect.x,sample.rect.y,sample.rect.width,sample.rect.height].every(Number.isInteger),`Badge box must land on integer device-independent pixels for ${count}: ${JSON.stringify(sample.rect)}`);
  assert(sample.geometry.visualRect.width===expectedOuterWidth&&sample.geometry.visualRect.height===13,`Badge C must be ${expectedOuterWidth}x13 including its inset rim for ${count}: ${JSON.stringify(sample.geometry)}`);
  assert(sample.borderWidth==='1px'&&sample.outlineWidth==='0px'&&sample.boxShadow.includes('0px 0px 0px 1px')&&sample.radius==='0px',`C's dark border/inset pale rim is missing for ${count}: ${JSON.stringify(sample)}`);
  assert(sample.position==='absolute'&&sample.top==='-2.5px'&&sample.right==='-3px',`Badge C must stay at the top-right anchor for ${count}: ${JSON.stringify(sample)}`);
  assert(sample.geometry.overlapRatio<=0.375,`Badge C covers more than 37.5% of the bell icon for ${count}: ${JSON.stringify(sample.geometry)}`);
  assert(sample.geometry.withinTitlebar,`Badge C is clipped by titlebar bounds for ${count}: ${JSON.stringify(sample.geometry)}`);
  assert(sample.geometry.clearOfQuickSearch&&sample.geometry.clearOfNextAction,`Badge C overlaps an adjacent action for ${count}: ${JSON.stringify(sample.geometry)}`);
  const allowedTextOverflow=name==='ninety-nine-plus'?2:0;
  assert(sample.whiteSpace==='nowrap'&&sample.overflow==='hidden'&&sample.textOverflow==='clip'&&sample.scrollWidth<=sample.clientWidth+allowedTextOverflow,`Badge text clips beyond its pixel sidebearing allowance for ${count}: ${JSON.stringify(sample)}`);
  assert(sample.fontFamily.startsWith('"WD Pixel"')&&!sample.fontFamily.includes('WD Pixel CJK')&&sample.fontSize==='12px'&&sample.fontWeight==='400'&&sample.fontSynthesis==='none',`Badge C must use unsynthesized 12px WD Pixel regular: ${JSON.stringify(sample)}`);
  assert(sample.lineHeight==='11px'&&sample.textAlign==='center'&&Math.abs(sample.textCenterOffset.x)<=1&&Math.abs(sample.textCenterOffset.y)<=1&&sample.letterSpacing==='-1px',`Badge C lost its 12px glyph/99+ tracking metrics: ${JSON.stringify(sample)}`);
  assert(sample.transitionDuration==='0s',`Badge uses a smooth transition for ${count}`);
  assert(sample.opacity==='0.999'&&sample.willChange==='auto',`Badge must use the chosen opacity AA layer, not persistent will-change: ${JSON.stringify({opacity:sample.opacity,willChange:sample.willChange})}`);
  if(name==='two-digit')assert(sample.rect.width>=samples['one-digit'].rect.width,`Two-digit badge shrank: ${JSON.stringify({one:samples['one-digit'],two:sample})}`);
  if(name==='ninety-nine-plus')assert(sample.rect.width>=samples['two-digit'].rect.width,`99+ badge width did not fit: ${JSON.stringify({two:samples['two-digit'],max:sample})}`);
  await page.locator('#fixture-count').evaluate((el,value)=>{el.textContent=`NOT WINDOWS · unread ${value}`;},count);
  const shot=await page.screenshot({path:`${out}/${name}.png`});
  if(name==='ninety-nine-plus')await fs.writeFile(`${out}/after-c.png`,shot);
  const badgeShot=await page.locator('#unread-badge').screenshot({animations:'allow'});
  const localTextRect={left:sample.textRect.left-sample.rect.left,top:sample.textRect.top-sample.rect.top,right:sample.textRect.right-sample.rect.left,bottom:sample.textRect.bottom-sample.rect.top};
  const pixelAudit=await screenshotPixels(badgeShot,localTextRect);
  const z={left:Math.min(sample.geometry.visualRect.left,sample.geometry.iconRenderedRect.left),top:Math.min(sample.geometry.visualRect.top,sample.geometry.iconRenderedRect.top),right:Math.max(sample.geometry.visualRect.right,sample.geometry.iconRenderedRect.right),bottom:Math.max(sample.geometry.visualRect.bottom,sample.geometry.iconRenderedRect.bottom)};
  await saveZoom(shot,name,z);
  assert(pixelAudit.baseColorsPresent.length===2&&pixelAudit.colorCount<=16,`1x badge lost the dark/pale pixel palette: ${JSON.stringify(pixelAudit)}`);
  samples[name]={...sample,zoomRect:z,pixelAudit};
}

const frames=await page.evaluate(()=>{
  const badge=document.querySelector('#unread-badge');
  const animation=document.getAnimations().find((a)=>a.animationName==='r9-notification-badge-flash');
  const sample=(time)=>{
    animation.currentTime=time;
    const s=getComputedStyle(badge);
    return {background:s.backgroundColor,color:s.color,border:s.borderTopColor,rim:s.boxShadow,opacity:s.opacity,transform:s.transform};
  };
  const before=sample(0),after=sample(1500);
  const timing=animation.effect.getTiming();
  const style=getComputedStyle(badge);
  const frames=animation.effect.getKeyframes().map((f)=>({offset:f.computedOffset,background:f.backgroundColor,color:f.color,border:f.borderColor,rim:f.boxShadow,opacity:f.opacity,transform:f.transform}));
  const distinct=new Set(frames.map((f)=>JSON.stringify([f.background,f.color,f.border,f.rim]))).size;
  return {duration:timing.duration,iterationCount:timing.iterations,timingFunction:style.animationTimingFunction,before,after,frames,distinctPaletteFrames:distinct};
});
assert(frames.duration===2800&&frames.iterationCount===Infinity,`Badge period should be 2.8s infinite: ${JSON.stringify(frames)}`);
assert(/^steps\(2(?:, end)?\)$/.test(frames.timingFunction),`Badge animation must use steps(2,end): ${frames.timingFunction}`);
assert(frames.before.background!==frames.after.background&&frames.before.color!==frames.after.color,`Two hard-swap color states were not observed: ${JSON.stringify(frames)}`);
assert(frames.distinctPaletteFrames===2,`Expected exactly two unique badge palettes: ${frames.distinctPaletteFrames}`);
assert(frames.frames.every((f)=>f.opacity===undefined&&f.transform===undefined),`Badge keyframes must not fade/transform: ${JSON.stringify(frames.frames)}`);
const contrast=await page.evaluate(()=>{
  const lum=(hex)=>{const c=hex.match(/[0-9a-f]{2}/gi).map((x)=>parseInt(x,16)/255).map((x)=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
  const ratio=(a,b)=>{const l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)};
  return {darkTextOnLight:ratio('#21132d','#ffd9ee'),lightTextOnDark:ratio('#ffd9ee','#21132d')};
});
assert(contrast.darkTextOnLight>=7&&contrast.lightTextOnDark>=7,`Badge contrast lower than expected: ${JSON.stringify(contrast)}`);

const normalBudget=await page.evaluate(()=>{
  const running=document.getAnimations().filter((a)=>a.playState==='running');
  return {count:running.length,names:running.map((a)=>a.animationName)};
});
assert(normalBudget.count<=6,`R8+R9 exceeds six simultaneous animations: ${JSON.stringify(normalBudget)}`);
assert(normalBudget.names.includes('r9-notification-badge-flash'),`Badge is not in the normal animation budget: ${JSON.stringify(normalBudget)}`);
await page.locator('#window-control').hover();
const hoverBudget=await page.evaluate(()=>{
  const running=document.getAnimations().filter((a)=>a.playState==='running');
  return {count:running.length,names:running.map((a)=>a.animationName),badgeAnimation:getComputedStyle(document.querySelector('#unread-badge')).animationName};
});
assert(hoverBudget.count<=6&&hoverBudget.names.includes('r8-window-press')&&hoverBudget.badgeAnimation==='none',`Hover did not trade the badge slot for the R8 hover cue: ${JSON.stringify(hoverBudget)}`);
await page.mouse.move(5,290);
await page.locator('#unread-badge').evaluate((el)=>{el.textContent='99+';});
await page.evaluate(()=>{const a=document.getAnimations().find((x)=>x.animationName==='r9-notification-badge-flash');if(a)a.currentTime=0;});
await page.emulateMedia({reducedMotion:'reduce'});
const reduced=await stateFor();
const reducedBudget=await page.evaluate(()=>({name:getComputedStyle(document.querySelector('#unread-badge')).animationName,running:document.getAnimations().filter((a)=>a.playState==='running').map((a)=>a.animationName)}));
assert(reduced.animationName==='none'&&reduced.background==='rgb(33, 19, 45)'&&reduced.color==='rgb(255, 217, 238)'&&reduced.boxShadow.includes('rgb(255, 228, 242)'),`Reduced-motion badge should stay in its readable dark frame: ${JSON.stringify(reduced)}`);
assert(!reducedBudget.running.includes('r9-notification-badge-flash'),`R9 animation persists in reduced-motion: ${JSON.stringify(reducedBudget)}`);
await page.screenshot({path:`${out}/reduced-motion.png`});
await page.emulateMedia({reducedMotion:'no-preference'});
await page.evaluate(()=>document.documentElement.classList.add('reduce-effects'));
const reducedEffects=await stateFor();
assert(reducedEffects.animationName==='none'&&reducedEffects.background==='rgb(33, 19, 45)'&&reducedEffects.boxShadow.includes('rgb(255, 228, 242)'),`html.reduce-effects did not freeze badge: ${JSON.stringify(reducedEffects)}`);
await page.evaluate(()=>{
  const badge=document.querySelector('#unread-badge');badge.remove();
});
await page.waitForTimeout(60);
const absent=await page.evaluate(()=>({badgeExists:Boolean(document.querySelector('#notification-button > [data-slot="badge"]')),runningR9:document.getAnimations().filter((a)=>a.playState==='running'&&a.animationName==='r9-notification-badge-flash').length}));
assert(!absent.badgeExists&&absent.runningR9===0,`Badge-less zero-unread state has residual decoration: ${JSON.stringify(absent)}`);

const defaultBrowser=await chromium.launch({headless:true});
const defaultPage=await defaultBrowser.newPage({viewport:{width:1280,height:320},deviceScaleFactor:1});
await defaultPage.setContent(fixture);
await defaultPage.addStyleTag({content:css});
await defaultPage.evaluate(()=>document.fonts.ready);
await defaultPage.locator('#unread-badge').evaluate((el)=>{el.textContent='99+';});
await defaultPage.locator('#fixture-count').evaluate((el)=>{el.textContent='NOT WINDOWS · unread 99+';});
await defaultPage.evaluate(()=>{const a=document.getAnimations().find((x)=>x.animationName==='r9-notification-badge-flash');if(a)a.currentTime=0;});
const defaultShot=await defaultPage.screenshot({path:`${out}/after-c-no-lcd-disable.png`});
await defaultPage.locator('#aa-options').screenshot({path:`${out}/aa-options-no-lcd-disable.png`});
const defaultZoom=await defaultPage.evaluate(()=>{const b=document.querySelector('#unread-badge').getBoundingClientRect(),i=document.querySelector('#notification-button > svg.lucide-bell').getBoundingClientRect();return {left:Math.min(b.left,i.left),top:Math.min(b.top,i.top),right:Math.max(b.right,i.right),bottom:Math.max(b.bottom,i.bottom)};});
await saveZoom(defaultShot,'ninety-nine-plus-no-lcd-disable',defaultZoom);
const defaultAA=await defaultPage.evaluate(()=>({rasterizerFlag:'no --disable-lcd-text',fontLoaded:document.fonts.check('400 12px "WD Pixel"','99+'),badgeOpacity:getComputedStyle(document.querySelector('#unread-badge')).opacity,animationName:getComputedStyle(document.querySelector('#unread-badge')).animationName}));
await defaultPage.close();
await defaultBrowser.close();

const report={
  fixture:'NOT WINDOWS; source-shaped notification trigger and 15-row R8 animation-budget scaffold',
  pixelAuditRasterizer:'Chromium --disable-lcd-text; 1x badge palette audit',
  aaComparison:{candidates:aaVariants,defaultChromium:defaultAA,disableLcdScreenshot:'aa-options-lcd-disabled.png',defaultFlagsScreenshots:['after-c-no-lcd-disable.png','aa-options-no-lcd-disable.png','zoom-ninety-nine-plus-no-lcd-disable.png'],caveat:'Default Linux headless Chromium is not Windows ClearType; use screenshots as structure/variant comparison, then confirm on Windows WebView2.'},
  buildCss:cssPath,
  bellIconProbe:icons,
  pixelFontLoaded,
  badgeSelector,
  badgePlacement:'C: top:-2.5px/right:-3px; 12px WD Pixel, centered 11px line-height; integer box coordinates; opacity .999 AA layer; outer sizes 14x13 / 18x13 / 24x13; 99+ overlap is capped at 37.5% and keeps 2px before the next button',
  beforeB:'before-b.png (9px comparison profile)',
  afterC:'after-c.png',
  screenshots:['after-c.png','zoom-ninety-nine-plus.png','aa-options-lcd-disabled.png','after-c-no-lcd-disable.png','aa-options-no-lcd-disable.png','zoom-ninety-nine-plus-no-lcd-disable.png','reduced-motion.png'],
  samples,
  animation:{name:'r9-notification-badge-flash',durationMs:frames.duration,steps:frames.timingFunction,uniqueFrames:frames.distinctPaletteFrames,before:frames.before,after:frames.after,contrast,normalBudget,hoverBudget},
  reducedMotion:{animationName:reduced.animationName,background:reduced.background,color:reduced.color,running:reducedBudget.running},
  reduceEffects:{animationName:reducedEffects.animationName,background:reducedEffects.background},
  zeroUnread:absent
};
await fs.writeFile(`${out}/verify-output.json`,JSON.stringify(report,null,2)+'\n');
await page.close();
await browser.close();
console.log(JSON.stringify(report,null,2));
console.log('PASS: integer centered badge / opacity vs will-change AA / default+disable-LCD screenshots / two-frame steps / budget ≤6 / reduced motion / zero badge');
