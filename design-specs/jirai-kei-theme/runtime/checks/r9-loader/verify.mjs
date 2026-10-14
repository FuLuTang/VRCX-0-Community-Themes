/* NOT WINDOWS: render the loader at three source-frame sizes and verify its real CSS playback. */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';

const require=createRequire(import.meta.url);
const sharp=require('/tmp/dsh-theme-tools/node_modules/sharp');
const root='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const out=`${root}/runtime/checks/r9-loader`;
const source='/tmp/ngod-probe/320x240.gif';
const builder=`${root}/runtime/tools/build-loader-sprite.mjs`;
const loaderCssPath=`${root}/runtime/loader-r9.css`;
const builtThemeDir=path.resolve(process.env.JIRAI_OUT||`${root}/runtime/preview-package/jirai-kei-theme`);
const builtThemePath=path.join(builtThemeDir,'theme.css');
const fixturePath=`${out}/fixture.html`;
const profiles=[
  {name:'48x62',width:48,height:62},
  {name:'56x72',width:56,height:72},
  {name:'64x82',width:64,height:82}
];
const assert=(ok,message)=>{if(!ok)throw new Error(message)};
await fs.mkdir(out,{recursive:true});
const sourceStat=await fs.stat(source);
const sourceMeta=await sharp(source,{animated:true}).metadata();
assert(sourceStat.size===121377&&sourceMeta.pages===11&&sourceMeta.delay?.length===11&&sourceMeta.delay.every((n)=>n===100),`Unexpected source GIF metadata: ${JSON.stringify({bytes:sourceStat.size,pages:sourceMeta.pages,delay:sourceMeta.delay})}`);

// Each profile is rasterized from the original GIF pages by the production builder.
const tempDir=await fs.mkdtemp(path.join(os.tmpdir(),'jirai-r9-loader-'));
const variants=[];
for(const profile of profiles){
  const cssPath=path.join(tempDir,`${profile.name}.css`);
  execFileSync(process.execPath,[builder,source,cssPath,profile.name],{env:{...process.env,SHARP_MODULE:'/tmp/dsh-theme-tools/node_modules/sharp'},stdio:'pipe'});
  const css=await fs.readFile(cssPath,'utf8');
  const match=css.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
  assert(match,`Builder emitted no PNG palette data URI for ${profile.name}`);
  const png=Buffer.from(match[1],'base64');
  const metadata=await sharp(png).metadata();
  const sheetWidth=profile.width*11;
  assert(metadata.format==='png'&&metadata.isPalette===true&&metadata.width===sheetWidth&&metadata.height===profile.height,`Unexpected ${profile.name} sheet metadata: ${JSON.stringify(metadata)}`);
  assert(!css.includes('data:image/gif')&&!css.includes('data:image/webp'),`Non-PNG animation format emitted for ${profile.name}`);
  await fs.writeFile(`${out}/sprite-sheet-${profile.name}.png`,png);
  variants.push({...profile,css,png,base64:match[1],sheetWidth,metadata,pngBytes:png.length,base64Chars:match[1].length});
}

const fixture=await fs.readFile(fixturePath,'utf8');
const loaderCss=await fs.readFile(loaderCssPath,'utf8');
const builtThemeCss=await fs.readFile(builtThemePath,'utf8');
const loaderSectionMarker='/* SECTION loader-r9 */\n';
const loaderSectionStart=builtThemeCss.indexOf(loaderSectionMarker);
assert(loaderSectionStart>=0&&builtThemeCss.includes('/* SECTION icons */')&&builtThemeCss.includes('svg.lucide:is(')&&builtThemeCss.includes('svg.lucide-loader-circle{--px:url('),`Expected full built theme CSS with jirai-icons and loader-r9 sections: ${builtThemePath}`);
const loaderBodyStart=loaderSectionStart+loaderSectionMarker.length;
const nextSectionStart=builtThemeCss.indexOf('/* SECTION ',loaderBodyStart);
const loaderBodyEnd=nextSectionStart<0?builtThemeCss.length:nextSectionStart;
const builtLoaderCss=builtThemeCss.slice(loaderBodyStart,loaderBodyEnd).trim();
assert(builtLoaderCss===loaderCss.trim(),'JIRAI_OUT loader-r9 section is stale versus runtime/loader-r9.css');
const beforeThemeCss=builtThemeCss.slice(0,loaderSectionStart)+builtThemeCss.slice(loaderBodyEnd);
const productionMatch=loaderCss.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
assert(productionMatch,'loader-r9.css has no embedded PNG');
const productionPng=Buffer.from(productionMatch[1],'base64');
const productionMeta=await sharp(productionPng).metadata();
const productionVars=loaderCss.match(/--jk-loader-frame-w:\s*(\d+)px;[\s\S]*?--jk-loader-frame-h:\s*(\d+)px;[\s\S]*?--jk-loader-frames:\s*(\d+);[\s\S]*?--jk-loader-duration:\s*(\d+)ms;/);
assert(productionVars,'Could not read frame variables from loader-r9.css');
const selected={width:Number(productionVars[1]),height:Number(productionVars[2]),frames:Number(productionVars[3]),durationMs:Number(productionVars[4])};
assert(selected.width===56&&selected.height===72&&selected.frames===11&&selected.durationMs===1100,`Production loader must be selected 56x72 / 11 x 100ms: ${JSON.stringify(selected)}`);
assert(productionMeta.format==='png'&&productionMeta.isPalette===true&&productionMeta.width===616&&productionMeta.height===72,`Production CSS did not embed the 56x72 palette render: ${JSON.stringify(productionMeta)}`);
assert(productionMatch[1].length===variants.find((v)=>v.name==='56x72').base64Chars,'Production data URI differs from source-rendered 56x72 profile');
assert(/to\s*\{\s*background-position:\s*-616px\s+0\s*;\s*\}/.test(loaderCss),'Production keyframe endpoint must be -616px, not a scaled 2x offset');
assert(/steps\(var\(--jk-loader-frames\),\s*end\)/.test(loaderCss),'Loader should step exactly one frame at a time');
const exactRowPrefix='.vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"])';
assert(loaderCss.split(exactRowPrefix).length-1===5,'All five loader/reduced-motion selectors must use the exact page-only Empty + direct Spinner row prefix');
const staleDirectRowPrefix='.vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"])';
assert(!loaderCss.includes(staleDirectRowPrefix),'A stale selector still assumes the LoadingState row is a direct child of Empty');
assert(!/(^|\n)\s*\[data-slot="empty"\]\s*>\s*div\.flex\.items-center\.gap-2/.test(loaderCss),'An unscoped global Empty row selector remains');
assert(!/spinner\]\s*\)\s*>\s*\*/.test(loaderCss),'Malformed extra parenthesis remains in the SVG-child selector');

const browser=await chromium.launch({headless:true,args:['--disable-lcd-text']});
const dataForPage=variants.map(({name,width,height,sheetWidth,base64,pngBytes,base64Chars})=>({name,width,height,sheetWidth,base64,pngBytes,base64Chars,physical150:{width:width*1.5,height:height*1.5}}));
const populateComparison=async(page)=>page.evaluate((data)=>{
  const grid=document.querySelector('#size-grid');grid.replaceChildren();
  for(const item of data){
    const card=document.createElement('article');card.className='card';
    card.innerHTML=`<h2>${item.name}</h2><div class="meta">Palette PNG ${item.pngBytes.toLocaleString()} B · inline ${item.base64Chars.toLocaleString()} chars</div><div class="sample"><div class="sample-sprite" aria-hidden="true"></div></div><div class="caption">1× ${item.width}×${item.height} CSS px · 150% ${item.physical150.width}×${item.physical150.height} physical px</div>`;
    const sprite=card.querySelector('.sample-sprite');
    sprite.style.width=`${item.width}px`;sprite.style.height=`${item.height}px`;
    sprite.style.backgroundImage=`url("data:image/png;base64,${item.base64}")`;
    sprite.style.backgroundSize=`${item.sheetWidth}px ${item.height}px`;
    sprite.style.backgroundPosition='0 0';
    grid.append(card);
  }
},dataForPage);
const addOrdinarySpinners=async(page)=>page.evaluate(()=>{
  const rack=document.querySelector('#ordinary-spinner-rack');
  for(let index=0;index<112;index++){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.dataset.slot='spinner';svg.classList.add('lucide','lucide-loader-circle','native-spinner','size-4','animate-spin');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M12 2v4');svg.append(path);rack.append(svg);
  }
});
const loaderPrefix='.vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0)';
const pageRowSelector=`${loaderPrefix} > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"])`;

const page=await browser.newPage({viewport:{width:1200,height:900},deviceScaleFactor:1});
await page.setContent(fixture);
await addOrdinarySpinners(page);
const spinnerClassCoverage=await page.locator('svg[data-slot="spinner"]').evaluateAll((nodes)=>{const required=['lucide','lucide-loader-circle','size-4','animate-spin'];return {total:nodes.length,withActualLucideClasses:nodes.filter((node)=>required.every((name)=>node.classList.contains(name))).length};});
assert(spinnerClassCoverage.total===117&&spinnerClassCoverage.withActualLucideClasses===117,`All fixture SVG spinners must use the real Loader2 lucide-loader-circle class: ${JSON.stringify(spinnerClassCoverage)}`);
const baseThemeStyle=await page.addStyleTag({content:beforeThemeCss});
// Capture the actual source-shaped LoadingState from the full build without loader-r9.
await page.evaluate(()=>{document.querySelector('#after-panel h2').textContent='BEFORE · Native pixel-ring spinner';document.querySelector('#after-panel p').textContent='Full built theme CSS, loader-r9 section removed';const target=document.querySelector('#loading-spinner');const a=document.getAnimations().find((x)=>x.effect?.target===target);if(a){a.pause();a.currentTime=0;}});
await page.locator('#after-panel').screenshot({path:`${out}/before.png`,animations:'allow'});
await baseThemeStyle.evaluate((style)=>{style.disabled=true;});
await page.addStyleTag({content:builtThemeCss});
await page.evaluate(()=>{document.querySelector('#after-panel h2').textContent='AFTER · CSS pixel sprite';document.querySelector('#after-panel p').textContent='源码形状：PageScaffold > Empty > EmptyContent > LoadingState row > Spinner + label';return document.fonts.ready;});
await populateComparison(page);

const state=await page.evaluate((selectors)=>{
  const empty=document.querySelector('#empty-loading-state');
  const row=document.querySelector('#loading-row');
  const spinner=document.querySelector('#loading-spinner');
  const label=row.querySelector('.loading-label');
  const content=row.parentElement,parentEmpty=content?.parentElement;
   const s=getComputedStyle(spinner),r=spinner.getBoundingClientRect(),lr=label.getBoundingClientRect(),rs=getComputedStyle(row);
   const cr=content.getBoundingClientRect(),cs=getComputedStyle(content),rr=row.getBoundingClientRect(),panelRect=document.querySelector('#after-panel').getBoundingClientRect();
  const badge=document.querySelector('#unread-badge');
  const animations=document.getAnimations().filter((a)=>a.playState==='running');
  return {
    emptySelector:empty.matches(selectors.root),rowMatches:row.matches(selectors.row),
     pageStructure:{mainContent:!!parentEmpty?.closest('.vrcx-0-main-content'),pageScaffold:!!parentEmpty?.closest('.vrcx-0-page-scaffold'),emptySlot:parentEmpty?.getAttribute('data-slot')??null,rowParentSlot:content?.getAttribute('data-slot')??null},
     emptyContent:{width:cr.width,maxWidth:cs.maxWidth,gap:cs.rowGap,flexDirection:cs.flexDirection,alignItems:cs.alignItems},
     row:{width:rr.width,flexDirection:rs.flexDirection,gap:rs.rowGap},
    flexDirection:rs.flexDirection,gap:rs.rowGap,
    spinner:{x:r.x,y:r.y,width:r.width,height:r.height,maskImage:s.maskImage,webkitMaskImage:s.webkitMaskImage,pixelMaskDefined:s.getPropertyValue('--px').trim().startsWith('url('),backgroundColor:s.backgroundColor,animationName:s.animationName,animationDuration:s.animationDuration,animationTimingFunction:s.animationTimingFunction,backgroundPosition:s.backgroundPosition,backgroundSize:s.backgroundSize,transform:s.transform,rotate:s.rotate,display:s.display},
     panel:{x:panelRect.x,y:panelRect.y,emptyBackgroundColor:getComputedStyle(empty).backgroundColor},
    label:{top:lr.top,height:lr.height},spinnerBottom:r.bottom,
    badgeAnimation:getComputedStyle(badge).animationName,
    activeAnimationCounts:{loader:animations.filter((a)=>a.animationName==='jk-loader-dance').length,nativeSpinner:animations.filter((a)=>a.animationName!=='jk-loader-dance'&&a.effect?.target?.matches?.('svg[data-slot="spinner"]')).length}
  };
},{root:loaderPrefix,row:pageRowSelector});
assert(state.emptySelector&&state.rowMatches,`Fixture does not match the narrowed page-level LoadingState selector: ${JSON.stringify(state)}`);
assert(state.pageStructure.mainContent&&state.pageStructure.pageScaffold&&state.pageStructure.emptySlot==='empty'&&state.pageStructure.rowParentSlot==='empty-content',`Page-level fixture must mirror PageScaffold > Empty > EmptyContent > LoadingState row: ${JSON.stringify(state.pageStructure)}`);
assert(state.flexDirection==='column'&&state.gap==='10px'&&state.label.top>=state.spinnerBottom+9,`Empty LoadingState did not become a separated vertical stack: ${JSON.stringify(state)}`);
assert(Number.parseFloat(state.emptyContent.maxWidth)>=56&&state.emptyContent.width>=56&&state.emptyContent.width<=Number.parseFloat(state.emptyContent.maxWidth)&&state.emptyContent.flexDirection==='column'&&state.emptyContent.gap==='10px'&&state.row.width>=56,`Source EmptyContent max-w-sm/gap should not squeeze the 56px dancer or row: ${JSON.stringify({emptyContent:state.emptyContent,row:state.row,spinner:state.spinner})}`);
assert(state.spinner.width===56&&state.spinner.height===72&&state.spinner.animationName==='jk-loader-dance'&&state.spinner.display==='block',`56x72 sprite is not applied at native CSS size: ${JSON.stringify(state.spinner)}`);
assert(state.spinner.maskImage==='none'&&state.spinner.webkitMaskImage==='none'&&state.spinner.pixelMaskDefined&&state.spinner.backgroundColor==='rgba(0, 0, 0, 0)',`Loader SVG must clear the generic lucide pixel-ring mask but keep its --px source: ${JSON.stringify({maskImage:state.spinner.maskImage,webkitMaskImage:state.spinner.webkitMaskImage,pixelMaskDefined:state.spinner.pixelMaskDefined})}`);
assert(state.spinner.transform==='none'&&state.spinner.rotate==='none',`SVG spinner is still transformed/rotated: ${JSON.stringify(state.spinner)}`);
assert(state.badgeAnimation!=='jk-loader-dance'&&state.activeAnimationCounts.loader===2&&state.activeAnimationCounts.nativeSpinner===114,`Page and dialog block loaders should dance while 113 ordinary plus table/button miss spinners keep native animation; badge must never receive loader animation: ${JSON.stringify(state)}`);

const misses=await page.evaluate((selectors)=>{
  const inspect=(rootId,rowId,spinnerId)=>{
    const root=rootId?document.getElementById(rootId):null,row=rowId?document.getElementById(rowId):null,spinner=document.getElementById(spinnerId);
    const s=getComputedStyle(spinner),rs=row?getComputedStyle(row):null,path=spinner.querySelector('path'),content=row?.parentElement,empty=content?.parentElement;
    return {rootMatches:root?.matches(selectors.root)??false,rowMatches:row?.matches(selectors.row)??false,contentSlot:content?.getAttribute('data-slot')??null,emptySlot:empty?.getAttribute('data-slot')??null,rowDirection:rs?.flexDirection??null,rowGap:rs?.rowGap??null,width:s.width,height:s.height,backgroundImage:s.backgroundImage,maskImageApplied:s.maskImage!=='none'&&s.maskImage.includes('data:image/svg+xml'),webkitMaskImage:s.webkitMaskImage,pixelMaskDefined:s.getPropertyValue('--px').trim().startsWith('url('),animationName:s.animationName,animationDuration:s.animationDuration,pathDisplay:path?getComputedStyle(path).display:null};
  };
  const ordinary=[document.querySelector('#button-spinner'),...document.querySelectorAll('#ordinary-spinner-rack svg[data-slot="spinner"]')];
  const ordinaryUntouched=ordinary.filter((spinner)=>{const s=getComputedStyle(spinner);return s.width==='16px'&&s.height==='16px'&&s.backgroundImage==='none'&&s.animationName!=='jk-loader-dance'&&s.animationName!=='none'&&s.animationDuration==='1s';}).length;
   const ordinaryPixelMasks=ordinary.filter((spinner)=>{const s=getComputedStyle(spinner),px=s.getPropertyValue('--px').trim();return px.startsWith('url(')&&s.maskImage!=='none'&&s.maskImage.includes('data:image/svg+xml');}).length;
  return {dialog:inspect('dialog-empty','dialog-row','dialog-spinner'),table:inspect('table-empty','table-row','table-spinner'),button:inspect(null,null,'button-spinner'),ordinaryCount:ordinary.length,ordinaryUntouched,ordinaryPixelMasks};
},{root:loaderPrefix,row:pageRowSelector});
const isNativeMiss=(m,needsRow)=>!m.rootMatches&&!m.rowMatches&&(!needsRow||(m.contentSlot==='empty-content'&&m.emptySlot==='empty'&&m.rowDirection==='row'&&m.rowGap==='8px'))&&m.width==='16px'&&m.height==='16px'&&m.backgroundImage==='none'&&m.animationName!=='jk-loader-dance'&&m.animationName!=='none'&&m.animationDuration==='1s';
assert(misses.dialog.animationName==='jk-loader-dance'&&misses.dialog.width==='56px'&&misses.dialog.height==='72px'&&misses.dialog.maskImageApplied===false,`R9.7 dialog block-level Empty must use the dancer: ${JSON.stringify(misses.dialog)}`);
assert(isNativeMiss(misses.table,true),`min-h-24 table Empty must stay native and miss the page-only loader: ${JSON.stringify(misses.table)}`);
assert(isNativeMiss(misses.button,false),`Ordinary button spinner must stay native and miss the page-only loader: ${JSON.stringify(misses.button)}`);
assert(misses.ordinaryCount===113&&misses.ordinaryUntouched===113,`All 113 ordinary inline/button spinners must remain native: ${JSON.stringify(misses)}`);
assert(misses.ordinaryPixelMasks===113&&[misses.table,misses.button].every((m)=>m.maskImageApplied&&m.pixelMaskDefined)&&misses.dialog.pixelMaskDefined,`R9.7 dialog dancer clears the --px mask; table/button misses and all 113 ordinary spinners retain the jirai-icons pixel-ring mask: ${JSON.stringify({dialog:misses.dialog,table:misses.table,button:misses.button,ordinaryPixelMasks:misses.ordinaryPixelMasks})}`);

const animationFrames=[];
const frameBuffers=[];
for(let index=0;index<11;index++){
  const timeMs=50+index*100;
  const frame=await page.evaluate(async(time)=>{
    const a=document.getAnimations().find((x)=>x.animationName==='jk-loader-dance');
    if(!a)throw new Error('CSS loader animation not found');
    a.pause();a.currentTime=time;
    await new Promise(requestAnimationFrame);
    const s=getComputedStyle(document.querySelector('#loading-spinner'));
    return {position:s.backgroundPosition,transform:s.transform,rotate:s.rotate};
  },timeMs);
  const match=frame.position.match(/(-?\d+(?:\.\d+)?)px/);
  const expected=-index*56;
  assert(match&&Math.abs(Number(match[1])-expected)<0.01,`Frame ${index} should be at ${expected}px after 100ms steps, got ${JSON.stringify(frame)}`);
  assert(frame.transform==='none'&&frame.rotate==='none',`Frame ${index} is rotated: ${JSON.stringify(frame)}`);
  animationFrames.push({index,timeMs,expectedBackgroundX:expected,computedBackgroundPosition:frame.position});
}
for(let index=0;index<11;index++){
  frameBuffers.push(await sharp(productionPng).extract({left:index*56,top:0,width:56,height:72}).png().toBuffer());
}

// Show all eleven source-rasterized frames in their actual CSS order, with numbered slots.
const contactWidth=56*11, labelHeight=20;
const labels=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${contactWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#211a32"/>${Array.from({length:11},(_,i)=>`<text x="${i*56+28}" y="14" text-anchor="middle" fill="#ffe4f2" font-family="monospace" font-size="11">${i+1}</text>`).join('')}</svg>`);
await sharp({create:{width:contactWidth,height:labelHeight+72,channels:4,background:{r:33,g:26,b:50,alpha:1}}})
  .composite([{input:labels,left:0,top:0},...frameBuffers.map((input,index)=>({input,left:index*56,top:labelHeight}))])
  .png().toFile(`${out}/frames-11.png`);

await populateComparison(page);
await page.locator('#size-grid').screenshot({path:`${out}/size-comparison-1x.png`});
await page.locator('.state-grid').screenshot({path:`${out}/before-after-1x.png`,animations:'allow'});
await page.evaluate(()=>{const a=document.getAnimations().find((x)=>x.animationName==='jk-loader-dance');if(a){a.pause();a.currentTime=50;}});
const afterPanelPng=await page.locator('#after-panel').screenshot({path:`${out}/after-1x.png`,animations:'allow'});
const sampleLeft=Math.round(state.spinner.x-state.panel.x),sampleTop=Math.round(state.spinner.y-state.panel.y);
const centerPatch=await sharp(afterPanelPng).extract({left:sampleLeft,top:sampleTop,width:56,height:72}).removeAlpha().raw().toBuffer({resolveWithObject:true});
const backgroundRgb=state.panel.emptyBackgroundColor.match(/[\d.]+/g)?.slice(0,3).map(Number);
assert(backgroundRgb?.length===3,`Cannot parse loader fixture background for pixel verification: ${state.panel.emptyBackgroundColor}`);
let centerNonBackgroundPixels=0;
for(let y=32;y<40;y++)for(let x=24;x<32;x++){const i=(y*centerPatch.info.width+x)*centerPatch.info.channels;const diff=Math.max(Math.abs(centerPatch.data[i]-backgroundRgb[0]),Math.abs(centerPatch.data[i+1]-backgroundRgb[1]),Math.abs(centerPatch.data[i+2]-backgroundRgb[2]));if(diff>=20)centerNonBackgroundPixels++;}
const spriteCenterSample={frameIndex:0,region:{left:24,top:32,width:8,height:8},backgroundRgb,nonBackgroundPixels:centerNonBackgroundPixels,totalPixels:64};
assert(centerNonBackgroundPixels>=8,`Loader sprite center region should remain visible instead of being clipped by the lucide ring mask: ${JSON.stringify(spriteCenterSample)}`);
const beforePanelPng=await fs.readFile(`${out}/before.png`);
const beforePanelMeta=await sharp(beforePanelPng).metadata(),afterPanelMeta=await sharp(afterPanelPng).metadata();
const stateCompareLabelHeight=30,stateCompareGap=20,stateCompareWidth=beforePanelMeta.width+stateCompareGap+afterPanelMeta.width,stateCompareHeight=stateCompareLabelHeight+Math.max(beforePanelMeta.height,afterPanelMeta.height);
const stateCompareLabels=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${stateCompareWidth}" height="${stateCompareHeight}"><rect width="100%" height="100%" fill="#16112a"/><text x="12" y="20" fill="#ffe4f2" font-family="monospace" font-size="14">SAME DOM · BEFORE (FULL CSS − LOADER)</text><text x="${beforePanelMeta.width+stateCompareGap+12}" y="20" fill="#ffe4f2" font-family="monospace" font-size="14">AFTER (FULL BUILT CSS)</text></svg>`);
await sharp({create:{width:stateCompareWidth,height:stateCompareHeight,channels:4,background:'#16112a'}}).composite([{input:stateCompareLabels,left:0,top:0},{input:beforePanelPng,left:0,top:stateCompareLabelHeight},{input:afterPanelPng,left:beforePanelMeta.width+stateCompareGap,top:stateCompareLabelHeight}]).png().toFile(`${out}/source-state-before-after.png`);
await page.emulateMedia({reducedMotion:'reduce'});
const reduced=await page.evaluate(()=>{const s=getComputedStyle(document.querySelector('#loading-spinner'));return {animationName:s.animationName,backgroundPosition:s.backgroundPosition,width:s.width,height:s.height};});
assert(reduced.animationName==='none'&&reduced.backgroundPosition==='0px 0px'&&reduced.width==='56px'&&reduced.height==='72px',`prefers-reduced-motion must hold frame one: ${JSON.stringify(reduced)}`);
await page.locator('#after-panel').screenshot({path:`${out}/reduced-motion.png`,animations:'allow'});
await page.emulateMedia({reducedMotion:'no-preference'});
await page.evaluate(()=>document.documentElement.classList.add('reduce-effects'));
const reducedEffects=await page.evaluate(()=>{const s=getComputedStyle(document.querySelector('#loading-spinner'));return {animationName:s.animationName,backgroundPosition:s.backgroundPosition};});
assert(reducedEffects.animationName==='none'&&reducedEffects.backgroundPosition==='0px 0px',`html.reduce-effects must hold frame one: ${JSON.stringify(reducedEffects)}`);
await page.locator('#after-panel').screenshot({path:`${out}/reduce-effects.png`,animations:'allow'});

const page150=await browser.newPage({viewport:{width:1200,height:900},deviceScaleFactor:1.5});
await page150.setContent(fixture);
await addOrdinarySpinners(page150);
await page150.addStyleTag({content:builtThemeCss});
await populateComparison(page150);
await page150.evaluate(()=>{const a=document.getAnimations().find((x)=>x.animationName==='jk-loader-dance');if(a){a.pause();a.currentTime=0;}});
await page150.locator('#size-grid').screenshot({path:`${out}/size-comparison-150.png`});
await page150.locator('#after-panel').screenshot({path:`${out}/after-150.png`,animations:'allow'});
const screenshotMeta={};
for(const name of ['before.png','before-after-1x.png','source-state-before-after.png','size-comparison-1x.png','size-comparison-150.png','after-1x.png','after-150.png','frames-11.png'])screenshotMeta[name]=await sharp(`${out}/${name}`).metadata();
const frameHashes=await Promise.all(frameBuffers.map(async(buffer)=>createHash('sha256').update(await sharp(buffer).raw().toBuffer()).digest('hex')));
const distinctFrames=new Set(frameHashes).size;
assert(distinctFrames>=10,`Unexpectedly few distinct sprite frame renders: ${distinctFrames}`);

const report={
  fixture:'NOT WINDOWS; PageScaffold > Empty > EmptyContent > LoadingState row > Spinner + label DOM shape',
  builtThemeCss:{path:builtThemePath,iconsSectionPresent:true,loaderSectionMatchesSource:true},
  fixtureSpinnerClasses:spinnerClassCoverage,
  spriteCenterSample,
  source:{path:source,bytes:sourceStat.size,width:sourceMeta.width,height:sourceMeta.height,frames:sourceMeta.pages,frameDelaysMs:sourceMeta.delay},
  variants:variants.map(({name,width,height,sheetWidth,pngBytes,base64Chars,metadata})=>({name,frameCssPixels:`${width}x${height}`,sheetPixels:`${sheetWidth}x${height}`,pngBytes,base64Chars,palette:metadata.isPalette,at1x:`${width}x${height}`,atWindows150Simulated:`${width*1.5}x${height*1.5}`})),
  selected:'56x72',selectedCSS:{...selected,sheetPixels:'616x72',pngBytes:productionPng.length,base64Chars:productionMatch[1].length,displayAt150:'84x108 physical px'},
  state,misses,frameStepPositions:animationFrames,distinctFrames,screenshotMeta,reducedMotion:reduced,reduceEffects:reducedEffects,
  screenshots:['before.png','after-1x.png','after-150.png','before-after-1x.png','source-state-before-after.png','size-comparison-1x.png','size-comparison-150.png','frames-11.png','reduced-motion.png','reduce-effects.png']
};
await fs.writeFile(`${out}/verify-output.json`,JSON.stringify(report,null,2)+'\n');
await page.close();await page150.close();await browser.close();
console.log(JSON.stringify(report,null,2));
console.log('PASS: full built CSS + jirai-icons mask override / center sprite pixels / page-only EmptyContent scope / dialog+table+button misses / 113 ordinary lucide masks preserved / 11 x 100ms / reduced-motion / no rotation');
