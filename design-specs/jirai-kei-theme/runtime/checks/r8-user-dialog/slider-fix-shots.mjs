/* NOT WINDOWS: fictional fixture. 4x before/after screenshots for the entity-dialog native range fix.
   "before" = current theme.css with the user-dialog-r8 slider selectors textually reverted to the old
   `.accent-primary.min-w-16.flex-1` chain (only that section is touched); "after" = theme.css as built.
   Usage: JIRAI_OUT=/tmp/jirai-elem-audit/jirai-kei-theme PLAYWRIGHT_BROWSERS_PATH=... node slider-fix-shots.mjs */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const runtime=path.resolve(here,'../..');
process.env.TMPDIR=path.join(here,'browser-tmp');await fs.mkdir(process.env.TMPDIR,{recursive:true});
const outputDir=path.resolve(process.env.JIRAI_OUT||path.join(runtime,'preview-package/jirai-kei-theme'));
const [html,theme]=await Promise.all([fs.readFile(path.join(here,'fixture.html'),'utf8'),fs.readFile(path.join(outputDir,'theme.css'),'utf8')]);
const sectionRe=/(\/\* SECTION user-dialog-r8 \*\/)([\s\S]*?)(?=\/\* SECTION [^*]+\*\/|$)/;
const m=theme.match(sectionRe);if(!m)throw new Error('theme.css has no user-dialog-r8 section');
const NEW='[data-slot="dialog-content"].entity-dialog input[type="range"]';
if(!m[2].includes(NEW))throw new Error('current theme does not contain the widened slider selector');
const OLD_CHAIN='.accent-primary.min-w-16.flex-1';
const preFixSection=m[2].split(NEW).join(NEW+OLD_CHAIN);
const preFix=theme.replace(sectionRe,(_,h)=>h+preFixSection);
// R9 supersedes R8 banner/avatar values; drop it exactly like verify.mjs so the slider is the only variable.
const noR9=t=>t.replace(/\/\* SECTION user-dialog-r9 \*\/[\s\S]*?(?=\/\* SECTION [^*]+\*\/|$)/g,'');
const shots=[
 ['status','[data-status-distribution]',{padL:150,padR:16,padT:12,padB:12}],
 ['bio','.bio-slider .range-wrap',{padL:20,padR:20,padT:8,padB:2}]
];
const browser=await chromium.launch({headless:true});
const report={mode:'pre-fix=old narrow selector; after=current',shots:{}};
try{
 for(const [label,css] of [['before',noR9(preFix)],['after',noR9(theme)]]){
  const page=await browser.newPage({viewport:{width:1360,height:1500},deviceScaleFactor:4});
  await page.setContent(html,{waitUntil:'domcontentloaded'});
  await page.addStyleTag({content:css});
  for(const [name,sel,pad] of shots){
   const box=await page.locator(sel).first().boundingBox();
   let x=Math.max(0,box.x-pad.padL),y=Math.max(0,box.y-pad.padT);
   const w=Math.min(480,box.width+pad.padL+pad.padR),h=box.height+pad.padT+pad.padB;
   // status row is right-aligned in a wide dialog: anchor the crop on the right edge so the slider + zoom icons + label are centred in <=2000px
   if(name==='status'){x=Math.max(0,box.x+box.width-w+pad.padR);}
   const file=`slider-${name}-${label}-4x.png`;
   await page.screenshot({path:path.join(here,file),clip:{x,y,width:w,height:h}});
   report.shots[file]={cssClip:{x,y,w,h},px:{w:w*4,h:h*4}};
  }
  const geo=await page.evaluate(()=>[...document.querySelectorAll('.entity-dialog input[type=range]')].map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {cls:e.className,w:r.width,h:r.height,appearance:s.appearance,cursor:s.cursor}}));
  report[label]=geo;await page.close();
 }
}finally{await browser.close()}
await fs.writeFile(path.join(here,'slider-fix-shots-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
