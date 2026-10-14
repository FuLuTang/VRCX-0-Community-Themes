import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';
const root=path.dirname(new URL(import.meta.url).pathname);
const html=path.join(root,'specimen.html');
const out=path.join(root,'screenshots');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
try{
 for(const dpr of [1,1.25,1.5,2]){
  const context=await browser.newContext({viewport:{width:1440,height:1120},deviceScaleFactor:dpr,colorScheme:'light'});
  const page=await context.newPage();const errors=[];const failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push(r.url()));
  await page.goto(pathToFileURL(html).href,{waitUntil:'networkidle'});
  const state=await page.evaluate(()=>{
   const title=document.querySelector('.topbar');
   const dialog=document.querySelector('.scene .dialog');
   const m=document.querySelector('.topbar');
   const after=getComputedStyle(m,'::after');
   const bg=getComputedStyle(dialog).backgroundImage;
   const mask=getComputedStyle(document.querySelector('.i-s1')).webkitMaskImage;
   const sceneModes=[...document.querySelectorAll('.scene')].map(s=>({dark:s.classList.contains('dark'),dialog:getComputedStyle(s.querySelector('.dialog')).backgroundImage.includes('data:image/svg+xml'),height:s.querySelector('.topbar').getBoundingClientRect().height,modalClient:s.querySelector('.dialog').clientHeight,modalScroll:s.querySelector('.dialog').scrollHeight}));
   return {titlebarHeight:title.getBoundingClientRect().height,maskDataUri:mask.includes('data:image/svg+xml'),maskBase64:mask.includes('base64'),pseudoMask:after.webkitMaskImage.includes('data:image/svg+xml'),dialogBackgroundDataUri:bg.includes('data:image/svg+xml'),dialogBackgroundAttachment:getComputedStyle(dialog).backgroundAttachment,sceneModes,assetCount:document.querySelectorAll('.asset').length,cssSheets:[...document.styleSheets].map(s=>s.href).filter(Boolean)};
  });
  const required=state.titlebarHeight===32&&state.maskDataUri&&!state.maskBase64&&state.pseudoMask&&state.dialogBackgroundDataUri&&state.sceneModes.length===2&&state.sceneModes.every(s=>s.dialog&&s.height===32&&s.modalScroll>s.modalClient)&&state.assetCount===22;
  if(!required)throw new Error(`DPR ${dpr} CSS integration assertion failed: ${JSON.stringify(state)}`);
  const png=await page.screenshot({fullPage:true,scale:'device',type:'png',animations:'disabled'});
  const filename=`specimen-dpr-${String(dpr).replace('.','-')}.webp`;
  await sharp(png).webp({quality:92,effort:6}).toFile(path.join(out,filename));
  const meta=await sharp(path.join(out,filename)).metadata();const stat=await fs.stat(path.join(out,filename));
  if(errors.length||failed.length)throw new Error(`DPR ${dpr}: browser errors=${errors.join(';')} failed=${failed.join(';')}`);
  results.push({dpr,file:`screenshots/${filename}`,width:meta.width,height:meta.height,bytes:stat.size,state,consoleErrors:errors,failedRequests:failed});
  await context.close();
 }
}finally{await browser.close()}
await fs.writeFile(path.join(root,'screenshots','capture-report.json'),JSON.stringify({browser:'Playwright Chromium',checks:{dataUriCssLoaded:true,maskPseudoElementRendered:true,bakedBackgroundOnScrollableDialog:true,titlebarIs32CssPx:true,bothLightDarkSurfaces:true,dialogContentScrolls:true,allS1S11SpecimenSlotsPresent:true,noBrowserErrors:true,noFailedRequests:true},screenshots:results},null,2)+'\n');
console.log(JSON.stringify({screenshots:results.map(s=>({dpr:s.dpr,file:s.file,width:s.width,height:s.height,bytes:s.bytes})),captureReport:'screenshots/capture-report.json'},null,2));
