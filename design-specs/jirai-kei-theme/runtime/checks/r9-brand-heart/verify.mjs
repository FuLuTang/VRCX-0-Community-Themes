/* NOT WINDOWS: check R8-to-R9 brand-heart replacement, frame sizes and help-button spacing. */
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const require=createRequire(import.meta.url);
const sharp=require('/tmp/dsh-theme-tools/node_modules/sharp');
const root='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const out=`${root}/runtime/checks/r9-brand-heart`;
const baseCssPath='/tmp/jirai-r9-out-badge/jirai-kei-theme/theme.css';
const r9CssPath=`${root}/runtime/brand-heart-r9.css`;
const fixturePath=`${out}/fixture.html`;
const assert=(ok,message)=>{if(!ok)throw new Error(message)};
const baseCss=await fs.readFile(baseCssPath,'utf8');
const r9Css=await fs.readFile(r9CssPath,'utf8');
const fixture=await fs.readFile(fixturePath,'utf8');
const browser=await chromium.launch({headless:true,args:['--disable-lcd-text']});
const page=await browser.newPage({viewport:{width:1200,height:560},deviceScaleFactor:1});
await page.setContent(fixture);
// The checked-in generated fixture bundle may already append a prior R9 draft; strip that section so the baseline truly measures R8.
await page.addStyleTag({content:baseCss.split('/* SECTION brand-heart-r9 */')[0]});
await page.evaluate(()=>document.fonts.ready);

const before=await page.evaluate(()=>{
  const brand=document.querySelector('#brand-trigger'),help=document.querySelector('#help-trigger');
  const pseudo=getComputedStyle(document.querySelector('#animated-brand'),'::after');
  const br=brand.getBoundingClientRect(),hr=help.getBoundingClientRect();
  return {paddingRight:getComputedStyle(brand).paddingRight,brandWidth:br.width,helpLeft:hr.left,helpRight:hr.right,helpWidth:hr.width,gap:hr.left-br.right,pseudo:{width:pseudo.width,height:pseudo.height,animationName:pseudo.animationName,animationDuration:pseudo.animationDuration,maskSize:pseudo.maskSize,transform:pseudo.transform,transformOrigin:pseudo.transformOrigin,pointerEvents:pseudo.pointerEvents}};
});
assert(before.paddingRight==='17px'&&before.pseudo.animationName==='r8-heart-beat'&&before.pseudo.width==='12px'&&before.pseudo.height==='12px',`R8 baseline did not load as expected: ${JSON.stringify(before)}`);
await page.locator('#help-trigger').hover();
const hoverBefore=await page.locator('#help-trigger').evaluate((el)=>({background:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color}));
await page.mouse.move(1180,520);

await page.addStyleTag({content:r9Css});
const after=await page.evaluate(()=>{
  const brand=document.querySelector('#brand-trigger'),help=document.querySelector('#help-trigger');
  const pseudo=getComputedStyle(document.querySelector('#animated-brand'),'::after');
  const staticPseudo=getComputedStyle(document.querySelector('#static-brand'),'::after');
  const br=brand.getBoundingClientRect(),hr=help.getBoundingClientRect();
  const row=document.querySelector('[data-tauri-drag-region]');
  return {paddingRight:getComputedStyle(brand).paddingRight,brandWidth:br.width,brandLeft:br.left,brandRight:br.right,helpLeft:hr.left,helpRight:hr.right,helpWidth:hr.width,gap:hr.left-br.right,
    pseudo:{width:pseudo.width,height:pseudo.height,animationName:pseudo.animationName,animationDuration:pseudo.animationDuration,animationTimingFunction:pseudo.animationTimingFunction,maskSize:pseudo.maskSize,maskPosition:pseudo.maskPosition,transform:pseudo.transform,transformOrigin:pseudo.transformOrigin,pointerEvents:pseudo.pointerEvents,maskImage:pseudo.maskImage},
    staticPseudo:{width:staticPseudo.width,height:staticPseudo.height,animationName:staticPseudo.animationName,maskSize:staticPseudo.maskSize},dragRegion:Boolean(row&&row.hasAttribute('data-tauri-drag-region'))};
});
assert(after.paddingRight==='21px'&&Math.abs(after.brandWidth-before.brandWidth-4)<0.01,`Brand trigger should gain only 4px of right padding: ${JSON.stringify({before,after})}`);
assert(after.gap>=0&&Math.abs(after.helpWidth-before.helpWidth)<0.01&&Math.abs(after.helpLeft-before.helpLeft-4)<0.01,`Help trigger was squeezed/overlapped: ${JSON.stringify({before,after})}`);
assert(after.pseudo.width==='14px'&&after.pseudo.height==='14px'&&after.pseudo.transformOrigin==='7px 7px'&&after.pseudo.pointerEvents==='none'&&after.pseudo.maskImage!=='none',`14x14 fixed heart box or mask was lost: ${JSON.stringify(after.pseudo)}`);
assert(after.pseudo.animationName==='r9-brand-heart-size'&&after.pseudo.animationDuration==='2.5s'&&/^steps\(1(?:,\s*end)?\)$/.test(after.pseudo.animationTimingFunction),`R9 must replace R8 with one discrete animation: ${JSON.stringify(after.pseudo)}`);
assert(after.staticPseudo.animationName==='none'&&after.staticPseudo.maskSize==='12px 12px',`Static fixture should show the centered medium frame: ${JSON.stringify(after.staticPseudo)}`);
assert(after.dragRegion,`Tauri drag region was removed from the fixture`);

const sampleAt=async(timeMs)=>page.evaluate((time)=>{
  const animation=document.getAnimations().find((a)=>a.animationName==='r9-brand-heart-size');
  if(!animation)throw new Error('R9 heart animation missing');
  animation.pause();animation.currentTime=time;
  const style=getComputedStyle(document.querySelector('#animated-brand'),'::after');
  const running=document.getAnimations().filter((a)=>a.animationName==='r8-heart-beat'||a.animationName==='r9-brand-heart-size');
  return {timeMs:time,maskSize:style.maskSize,width:style.width,height:style.height,transform:style.transform,transformOrigin:style.transformOrigin,animationName:style.animationName,animationCount:running.length};
},timeMs);
const frames=[];
for(const [name,timeMs,expected] of [['small-1',250,'10px 10px'],['small-2',750,'10px 10px'],['medium-1',1250,'12px 12px'],['large',1750,'14px 14px'],['medium-2',2250,'12px 12px']]){
  const frame=await sampleAt(timeMs);
  assert(frame.maskSize===expected&&frame.width==='14px'&&frame.height==='14px'&&frame.transform===after.pseudo.transform&&frame.transformOrigin==='7px 7px'&&frame.animationName==='r9-brand-heart-size'&&frame.animationCount===1,`Heart ${name} frame must hold ${expected} in the fixed center box: ${JSON.stringify(frame)}`);
  frames.push({name,...frame});
}

await page.locator('#geometry-report').evaluate((el,value)=>{el.textContent=value;},`Brand ${after.brandWidth}px (+4px) · right padding 21px · help gap ${after.gap}px · help width ${after.helpWidth}px (unchanged)`);
await sampleAt(2800);
await page.locator('.demo').screenshot({path:`${out}/static-vs-animated.png`,animations:'allow'});
const frameRows=[];
const heartZooms=[];
for(const frame of frames){
  await sampleAt(frame.timeMs);
  frameRows.push(await page.locator('#animated-titlebar').screenshot({animations:'allow'}));
  const placement=await page.evaluate(()=>{const brand=document.querySelector('#animated-brand');const r=brand.getBoundingClientRect();return {left:r.right+1,top:r.top+r.height/2-7};});
  const full=await page.screenshot({animations:'allow'});
  const cropLeft=Math.max(0,Math.floor(placement.left)-2),cropTop=Math.max(0,Math.floor(placement.top)-2);
  heartZooms.push(await sharp(full).extract({left:cropLeft,top:cropTop,width:18,height:18}).resize(180,180,{kernel:'nearest'}).png().toBuffer());
}
const zoomLabelHeight=26,zoomWidth=180*frames.length,zoomHeight=206;
const zoomLabels=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${zoomWidth}" height="${zoomLabelHeight*3}">${frames.map((f,i)=>`<rect x="${i*180}" y="0" width="180" height="${zoomLabelHeight}" fill="#201936"/><text x="${i*180+90}" y="18" text-anchor="middle" fill="#ffe4f2" font-family="monospace" font-size="12">${f.name.toUpperCase()} · ${f.maskSize}</text>`).join('')}</svg>`);
await sharp({create:{width:zoomWidth,height:zoomHeight,channels:4,background:{r:33,g:26,b:50,alpha:1}}})
  .composite([{input:zoomLabels,left:0,top:0},...heartZooms.map((input,index)=>({input,left:index*180,top:zoomLabelHeight}))])
  .png().toFile(`${out}/heart-frames-zoom.png`);
const rowMeta=await sharp(frameRows[0]).metadata();
const labelHeight=18,totalHeight=(rowMeta.height+labelHeight)*frameRows.length;
const labels=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${rowMeta.width}" height="${totalHeight}">${frames.map((f,i)=>`<rect x="0" y="${i*(rowMeta.height+labelHeight)}" width="100%" height="${labelHeight}" fill="#211a32"/><text x="8" y="${i*(rowMeta.height+labelHeight)+13}" fill="#ffe4f2" font-family="monospace" font-size="11">${f.name.toUpperCase()} · mask ${f.maskSize}</text>`).join('')}</svg>`);
await sharp({create:{width:rowMeta.width,height:totalHeight,channels:4,background:{r:33,g:26,b:50,alpha:1}}})
  .composite([{input:labels,left:0,top:0},...frameRows.map((input,index)=>({input,left:0,top:index*(rowMeta.height+labelHeight)+labelHeight}))])
  .png().toFile(`${out}/five-frames.png`);
await page.locator('#animated-card').screenshot({path:`${out}/help-spacing.png`,animations:'allow'});

for(let index=0;index<4;index++)await page.keyboard.press('Tab');
const focus=await page.evaluate(()=>({activeId:document.activeElement?.id,focusVisible:document.activeElement?.matches(':focus-visible'),outline:getComputedStyle(document.activeElement).outline,outlineWidth:getComputedStyle(document.activeElement).outlineWidth,outlineOffset:getComputedStyle(document.activeElement).outlineOffset}));
assert(focus.activeId==='help-trigger'&&focus.focusVisible&&focus.outlineWidth==='2px'&&focus.outlineOffset==='-3px',`R9 changed the existing keyboard focus treatment: ${JSON.stringify(focus)}`);
await page.locator('#animated-card').screenshot({path:`${out}/focus-help.png`,animations:'allow'});
await page.locator('#help-trigger').hover();
const hoverAfter=await page.locator('#help-trigger').evaluate((el)=>({background:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color}));
assert(JSON.stringify(hoverAfter)===JSON.stringify(hoverBefore),`R9 changed help hover colors: ${JSON.stringify({hoverBefore,hoverAfter})}`);

await page.emulateMedia({reducedMotion:'reduce'});
const reduced=await page.evaluate(()=>{const s=getComputedStyle(document.querySelector('#animated-brand'),'::after');return {animationName:s.animationName,maskSize:s.maskSize,width:s.width,height:s.height};});
assert(reduced.animationName==='none'&&reduced.maskSize==='12px 12px'&&reduced.width==='14px'&&reduced.height==='14px',`Reduced motion should be static medium in the fixed box: ${JSON.stringify(reduced)}`);
await page.locator('#animated-card').screenshot({path:`${out}/reduced-motion.png`,animations:'allow'});
await page.emulateMedia({reducedMotion:'no-preference'});
await page.evaluate(()=>document.documentElement.classList.add('reduce-effects'));
const reducedEffects=await page.evaluate(()=>{const s=getComputedStyle(document.querySelector('#animated-brand'),'::after');return {animationName:s.animationName,maskSize:s.maskSize,width:s.width,height:s.height};});
assert(reducedEffects.animationName==='none'&&reducedEffects.maskSize==='12px 12px',`html.reduce-effects should be static medium: ${JSON.stringify(reducedEffects)}`);
await page.locator('#animated-card').screenshot({path:`${out}/reduce-effects.png`,animations:'allow'});

const report={fixture:'NOT WINDOWS; source-shaped VRCX titlebar brand + Help menubar trigger + drag region',baseCss:baseCssPath,r9Css:r9CssPath,before,after,hover:{before:hoverBefore,after:hoverAfter},focus,frames,reducedMotion:reduced,reduceEffects:reducedEffects,screenshots:['static-vs-animated.png','five-frames.png','heart-frames-zoom.png','help-spacing.png','focus-help.png','reduced-motion.png','reduce-effects.png']};
await fs.writeFile(`${out}/verify-output.json`,JSON.stringify(report,null,2)+'\n');
await page.close();await browser.close();
console.log(JSON.stringify(report,null,2));
console.log('PASS: replaced R8 animation / 14x14 fixed box / 10-10-12-14-12px stepped masks / +4px padding / help spacing / hover-focus / reduced motion');
