import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';

const root = '/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const appDist = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets';
const out = `${root}/runtime/checks/r8-motion`;
const sharedCss = await Promise.all([
  `${appDist}/index-Cckb3vVG.css`,
  `${appDist}/App-C2mIqNXI.css`,
  `${root}/runtime/preview-package/jirai-kei-theme/theme.css`,
  `${root}/original-assets/r5/assets-r5.css`,
  `${root}/runtime/navigation-r7.css`,
  `${root}/runtime/chrome-r8.css`,
  `${root}/runtime/motion-r5.css`,
  `${root}/runtime/motion-r7.css`
].map((file) => fs.readFile(file, 'utf8')));
const motionCss = await fs.readFile(`${root}/runtime/motion-r8.css`, 'utf8');
const videoDir = `${out}/video-temp`;
await fs.mkdir(videoDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const rectSelectors = ['.frame','.vrcx-0-titlebar','.vrcx-0-sidebar-surface','[data-sidebar="footer"]','.vrcx-0-main-content','.vrcx-0-side-panel','.vrcx-0-statusbar','[data-sidebar="menu-button"][data-active]'];
const protectedSelectors = [
  ['.vrcx-0-main-content','::before'],
  ['.vrcx-0-main-content','::after'],
  ['.vrcx-0-statusbar','::after'],
  ['.vrcx-0-side-panel','::after']
];
function readVint(bytes, offset, isSize) {
  const first=bytes[offset]; let length=1;
  for(let bit=0x80;!(first&bit)&&length<8;bit>>=1) length++;
  let value=isSize ? first & (0xff >>> length) : first;
  for(let i=1;i<length;i++) value=value*256+bytes[offset+i];
  return { length, value };
}
function readElements(bytes, start, end) {
  const list=[]; let cursor=start;
  while(cursor<end) {
    const id=readVint(bytes,cursor,false), size=readVint(bytes,cursor+id.length,true);
    const data=cursor+id.length+size.length, next=data+size.value;
    if(next>end) break;
    list.push({ id:id.value, data, size:size.value, next }); cursor=next;
  }
  return list;
}
function webmDurationSeconds(bytes) {
  const segment=readElements(bytes,0,bytes.length).find((item)=>item.id===0x18538067);
  const info=readElements(bytes,segment.data,segment.next).find((item)=>item.id===0x1549a966);
  let scale=1000000, duration=0;
  for(const item of readElements(bytes,info.data,info.next)) {
    if(item.id===0x2ad7b1) { scale=0; for(let i=0;i<item.size;i++) scale=scale*256+bytes[item.data+i]; }
    if(item.id===0x4489) duration=item.size===8 ? bytes.readDoubleBE(item.data) : bytes.readFloatBE(item.data);
  }
  return duration*scale/1e9;
}

async function addStyles(page) {
  await page.goto(`file://${out}/fixture.html`);
  for (const css of sharedCss) await page.addStyleTag({ content: css });
}
async function rects(page) {
  return page.evaluate((selectors) => selectors.map((selector) => {
    const r=document.querySelector(selector).getBoundingClientRect(); return [r.x,r.y,r.width,r.height];
  }), rectSelectors);
}
async function protectedState(page) {
  return page.evaluate((selectors) => selectors.map(([selector,pseudo]) => {
    const s=getComputedStyle(document.querySelector(selector),pseudo);
    return [selector,pseudo,s.content,s.position,s.width,s.height,s.backgroundImage,s.backgroundColor,s.backgroundSize,s.pointerEvents,s.animationName,s.animationDuration];
  }), protectedSelectors);
}
// A real-time 6.0s target take at the requested 1600×1024 viewport (setup overhead included).
const recContext = await browser.newContext({
  viewport: { width: 1600, height: 1024 },
  deviceScaleFactor: 1,
  recordVideo: { dir: videoDir, size: { width: 1600, height: 1024 } }
});
const page = await recContext.newPage();
await addStyles(page);
const protectedBefore = await protectedState(page);
const rectsBefore = await rects(page);
await page.addStyleTag({ content: motionCss });
const protectedAfter = await protectedState(page);
if (JSON.stringify(protectedBefore) !== JSON.stringify(protectedAfter)) {
  throw new Error(`R8 altered protected pseudo-elements/status paint: ${JSON.stringify({ protectedBefore, protectedAfter })}`);
}
const rectsAfter = await rects(page);
if (JSON.stringify(rectsBefore) !== JSON.stringify(rectsAfter)) throw new Error('R8 insertion changed layout bounds');
await page.hover('#window-hover');
const selectorSet = [
  ['.vrcx-0-titlebar .vrcx-0-brand','::after'],
  ['.vrcx-0-statusbar','::before'],
  ['.vrcx-0-sidebar-surface [data-sidebar="menu-button"][data-active]','::before'],
  ['#window-hover','::after'],
  ['.vrcx-0-sidebar-surface [data-sidebar="content"]','::after']
];
const normal = await page.evaluate((pairs) => pairs.map(([selector,pseudo]) => {
  const style=getComputedStyle(document.querySelector(selector),pseudo);
  return { selector:`${selector}${pseudo}`, animationName:style.animationName, pointerEvents:style.pointerEvents, opacity:Number.parseFloat(style.opacity), width:Number.parseFloat(style.width), height:Number.parseFloat(style.height) };
}), selectorSet);
if (normal.some((entry) => entry.animationName === 'none' || entry.pointerEvents !== 'none' || entry.opacity < .55)) throw new Error(`Normal animation/pointer/visibility check failed: ${JSON.stringify(normal)}`);
const legacyPanelArt = await page.evaluate(() => {
  const s=getComputedStyle(document.querySelector('.vrcx-0-side-panel'),'::after');
  return { content:s.content, animationName:s.animationName, pointerEvents:s.pointerEvents };
});
if (legacyPanelArt.animationName !== 'r7-corner-twinkle' || legacyPanelArt.pointerEvents !== 'none') throw new Error(`R7 SOCIAL art was unexpectedly changed: ${JSON.stringify(legacyPanelArt)}`);
const runningAnimations = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => ({
  name: a.animationName,
  target: a.effect?.target?.getAttribute?.('aria-label') || a.effect?.target?.className || a.effect?.target?.tagName,
  pseudo: a.effect?.pseudoElement || ''
})));
if (runningAnimations.length > 6) throw new Error(`More than six simultaneous animations: ${JSON.stringify(runningAnimations)}`);
await page.evaluate(()=>{
  const animation=document.getAnimations().find((a)=>a.animationName==='r8-lace-flow');
  if(!animation) throw new Error('Missing r8-lace-flow animation');
  animation.currentTime=0;
});
const laceNormalBefore = await page.evaluate(()=>getComputedStyle(document.querySelector('.vrcx-0-statusbar'),'::before').backgroundPosition);
await page.waitForTimeout(2500);
const laceNormalAfter = await page.evaluate(()=>getComputedStyle(document.querySelector('.vrcx-0-statusbar'),'::before').backgroundPosition);
if(laceNormalBefore!=='0px 50%'||laceNormalAfter!=='10px 50%') throw new Error(`Lace background-position should step 0px→10px in normal mode: ${laceNormalBefore} -> ${laceNormalAfter}`);
await page.screenshot({ path: `${out}/normal.png` });
await page.waitForTimeout(2200);
const reducedBefore = await rects(page);
await page.emulateMedia({ reducedMotion: 'reduce' });
const reduced = await page.evaluate((pairs) => pairs.map(([selector,pseudo]) => {
  const style=getComputedStyle(document.querySelector(selector),pseudo);
  return { selector:`${selector}${pseudo}`, animationName:style.animationName, pointerEvents:style.pointerEvents, opacity:Number.parseFloat(style.opacity), width:Number.parseFloat(style.width), height:Number.parseFloat(style.height) };
}), selectorSet);
if (reduced.some((entry) => entry.animationName !== 'none' || entry.pointerEvents !== 'none' || entry.opacity < .55)) throw new Error(`Reduced motion check failed: ${JSON.stringify(reduced)}`);
const laceReducedBefore = await page.evaluate(()=>getComputedStyle(document.querySelector('.vrcx-0-statusbar'),'::before').backgroundPosition);
await page.waitForTimeout(600);
const laceReducedAfter = await page.evaluate(()=>getComputedStyle(document.querySelector('.vrcx-0-statusbar'),'::before').backgroundPosition);
if(laceReducedBefore!==laceReducedAfter) throw new Error(`Lace background-position changed under reduced motion: ${laceReducedBefore} -> ${laceReducedAfter}`);
const reducedAfter = await rects(page);
if (JSON.stringify(reducedBefore) !== JSON.stringify(reducedAfter)) throw new Error('Layout bounds changed while entering reduced-motion mode');
await page.screenshot({ path: `${out}/reduced.png` });
const legacyPanelArtReduced = await page.evaluate(() => getComputedStyle(document.querySelector('.vrcx-0-side-panel'),'::after').animationName);
if (legacyPanelArtReduced !== 'none') throw new Error(`Reduced-motion did not stop legacy R7 SOCIAL animation: ${legacyPanelArtReduced}`);
const videoHandle = page.video();
await page.close();
const recordedPath = await videoHandle.path();
await recContext.close();
const finalVideo = `${out}/r8-motion-demo.webm`;
await fs.rename(recordedPath, finalVideo);
const durationSeconds = webmDurationSeconds(await fs.readFile(finalVideo));
if (durationSeconds < 6 || durationSeconds > 8) throw new Error(`WebM duration out of 6–8s bounds: ${durationSeconds}`);
const catRecipe = normal.find((entry) => entry.selector === '.vrcx-0-sidebar-surface [data-sidebar="content"]::after');
if (!catRecipe || catRecipe.animationName !== 'r8-cat-hop' || catRecipe.opacity < .55 || catRecipe.width !== 36 || catRecipe.height !== 36) throw new Error(`Selected 36px nav-pocket cat motion failed: ${JSON.stringify(catRecipe)}`);

await fs.writeFile(`${out}/verify-output.json`, JSON.stringify({
  fixture: 'NOT WINDOWS; sample nickname only; chosen nav-pocket cat motion',
  viewport: '1600x1024',
  normal, reduced, laceBackgroundPosition: { normal: [laceNormalBefore,laceNormalAfter], reduced: [laceReducedBefore,laceReducedAfter] }, runningAnimations, runningCount: runningAnimations.length,
  protectedPseudoStateStable: true,
  layoutBoundsStable: true,
  legacySocialAnimationPreserved: legacyPanelArt.animationName === 'r7-corner-twinkle',
  legacySocialAnimationReducedName: legacyPanelArtReduced,
  selectedCatRect: catRecipe,
  catMotionSelector: '.vrcx-0-sidebar-surface [data-sidebar="content"]::after',
  recording: { path: finalVideo, durationSeconds }
}, null, 2) + '\n');
await browser.close();
console.log(JSON.stringify({ normal, reduced, laceBackgroundPosition: { normal: [laceNormalBefore,laceNormalAfter], reduced: [laceReducedBefore,laceReducedAfter] }, runningAnimations, runningCount: runningAnimations.length, protectedPseudoStateStable: true, layoutBoundsStable: true, legacySocialAnimationPreserved: legacyPanelArt.animationName === 'r7-corner-twinkle', legacySocialAnimationReducedName: legacyPanelArtReduced, selectedCatRect: catRecipe, video: finalVideo, durationSeconds }, null, 2));
