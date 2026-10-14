import fs from 'node:fs/promises';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.cjs';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';

const [beforeCssPath, afterCssPath, outPath] = process.argv.slice(2);
if (!beforeCssPath || !afterCssPath || !outPath) {
  throw new Error('usage: node verify-css-consolidation.mjs <before.css> <after.css> <comparison.png>');
}
const appCssPaths = [
  '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css',
  '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/App-C2mIqNXI.css',
];
const appCss = (await Promise.all(appCssPaths.map(path => fs.readFile(path, 'utf8')))).join('\n');
const fixture = `<!doctype html><html class="dark"><head><meta charset="utf-8"><style>
*{box-sizing:border-box} body{margin:0;padding:16px;background:#171326;color:#f2ebff;font:14px sans-serif}
#fixture{width:1168px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.sample{min-height:124px;padding:10px;border:1px solid #45345e;background:#201936;overflow:hidden}
.title{grid-column:1/-1;padding:0;min-height:36px}.status{grid-column:1/-1;padding:0;min-height:44px}
.row{display:flex;align-items:center;gap:8px}.sidebar{height:155px}.main{height:250px}.dialog{height:190px}.toast{height:120px}.chart-demo{margin-top:8px;padding:6px;border:1px solid #45345e}
[data-slot=toast-content]{display:flex;gap:8px;align-items:center;background:#241c38;padding:8px;margin:4px}
[data-slot=card-header]{position:relative;height:150px}.entity-dialog .relative{position:relative;height:120px}
[data-slot=button][class*=aspect-\\[4\\/3\\]]{width:220px;height:120px;position:relative;background:#2b2242}
</style></head><body><div id="fixture">
<header class="sample title vrcx-0-titlebar flex h-9 shrink-0 items-center" data-app-titlebar="true" data-vrcx-0-surface="titlebar">
 <div class="row" data-slot="menubar"><button data-slot="menubar-trigger" class="rounded-none"><span class="vrcx-0-brand">VRCX-0-jirai</span></button>
 <button id="quick" data-slot="button" class="vrcx-0-toolbar-control" data-vrcx-0-control="toolbar">Search</button>
 <button id="win" data-slot="button" class="h-full w-9 rounded-none border-0">□</button>
 <button id="close" data-slot="button" data-variant="destructive" class="h-full w-9 rounded-none border-0 destructive">×</button></div>
</header>
<footer class="sample status vrcx-0-statusbar" data-vrcx-0-surface="statusbar"><div class="min-h-6 flex flex-col"><span class="text-content-primary">Connected</span><button data-slot="button">Status action</button></div></footer>
<aside class="sample sidebar vrcx-0-sidebar-surface"><div data-slot="sidebar" data-state="expanded"><div data-slot="sidebar-inner"><div data-sidebar="content">Navigation entries</div></div></div><div class="vrcx-0-side-panel">SOCIAL <button data-slot="button">＋</button></div></aside>
<main class="sample main vrcx-0-main-content"><div class="row"><input data-slot="input" value="field"><select><option>select</option></select><div data-slot="input-group"><input data-slot="input" value="group"></div></div>
 <div data-slot="tabs"><button data-slot="tabs-tab" data-active="true">Active tab</button></div>
 <section class="chart-demo vrcx-0-page-scaffold" id="chart"><div class="vrcx-0-page-toolbar row"><div data-vrcx-0-control="toolbar" data-slot="input-group" id="tools-toolbar"><span data-slot="input-group-addon">⌕</span><input data-slot="input-group-control" class="h-8 w-56" placeholder="Tools toolbar"></div></div><div class="relative mt-4"><div data-slot="tabs" data-orientation="vertical"><div data-slot="tabs-list" data-orientation="vertical"></div></div></div></section>
 </main>
<section class="sample dialog entity-dialog" data-slot="dialog-content"><div data-slot="card-header"><div class="relative"><button data-slot="button" aria-label="world banner" class="aspect-[4/3]"><span class="relative size-full"></span></button><div class="absolute bottom-3 left-3 z-30 size-16"></div></div></div></section>
<section class="sample toast"><div data-slot="toast-viewport"><div data-type="info"><div data-slot="toast-content"><div data-slot="toast-icon"><svg width="16" height="16"></svg></div><span>Info</span></div></div><div data-type="warning"><div data-slot="toast-content"><div data-slot="toast-icon"><svg width="16" height="16"></svg></div><span>Warning</span></div></div></div></section>
</div></body></html>`;

const browser = await chromium.launch({headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
async function render(cssPath, pngPath) {
  const page = await browser.newPage({viewport:{width:1200,height:600}, deviceScaleFactor:1, reducedMotion:'reduce'});
  await page.setContent(fixture, {waitUntil:'load'});
  await page.addStyleTag({content:appCss});
  await page.addStyleTag({content:await fs.readFile(cssPath,'utf8')});
  await page.evaluate(()=>document.fonts.ready.then(()=>true));
  const computed = await page.evaluate(()=>{
    const out=[];
    const props=['background-color','background-image','background-position','background-size','border-color','border-radius','border-width','box-shadow','color','content','display','height','inset','mask','mask-image','mask-size','-webkit-mask-image','-webkit-mask-size','opacity','outline','outline-offset','padding','position','transform','width'];
    const valuesOf=(s)=>{const v={};for(const p of props)v[p]=s.getPropertyValue(p);const active=[v['mask-image'],v['-webkit-mask-image']].some(x=>x&&x!=='none');if(!active){for(const p of ['mask','mask-size','-webkit-mask-size'])v[p]='(inactive: no mask image)'}return v};
    for(const [i,el] of [...document.querySelectorAll('#fixture *')].entries()){
      const name=el.id||el.getAttribute('data-slot')||el.className?.toString().split(' ')[0]||el.tagName.toLowerCase();
      const values=valuesOf(getComputedStyle(el));
      const pseudos={}; for(const pseudo of ['::before','::after'])pseudos[pseudo]=valuesOf(getComputedStyle(el,pseudo));
      out.push({i,name,values,pseudos});
    }
    return out;
  });
  await page.screenshot({path:pngPath, fullPage:true});
  await page.close();
  return computed;
}
const beforePath='/tmp/jirai-css-before.png', afterPath='/tmp/jirai-css-after.png';
const [before,after]=await Promise.all([render(beforeCssPath,beforePath),render(afterCssPath,afterPath)]);
let styleDiffs=0;const examples=[];
for(let i=0;i<Math.max(before.length,after.length);i++){
  if(JSON.stringify(before[i])!==JSON.stringify(after[i])){styleDiffs++;if(examples.length<12)examples.push({index:i,before:before[i],after:after[i]});}
}
const [a,b]=await Promise.all([sharp(beforePath).ensureAlpha().raw().toBuffer({resolveWithObject:true}),sharp(afterPath).ensureAlpha().raw().toBuffer({resolveWithObject:true})]);
let pixelDiffs=0;if(a.info.width!==b.info.width||a.info.height!==b.info.height)pixelDiffs=-1;else for(let i=0;i<a.data.length;i++)if(a.data[i]!==b.data[i])pixelDiffs++;
const label=(text)=>Buffer.from(`<svg width="1200" height="42"><rect width="100%" height="100%" fill="#211a33"/><text x="20" y="29" fill="#f2ebff" font-family="sans-serif" font-size="20">${text}</text></svg>`);
const top=42, width=2400, height=top+Math.max(a.info.height,b.info.height);
const left=await sharp(beforePath).png().toBuffer(), right=await sharp(afterPath).png().toBuffer();
await sharp({create:{width,height,channels:4,background:'#171326'}}).composite([
  {input:label('Before · compiled theme') ,left:0,top:0},{input:label('After · consolidated CSS'),left:1200,top:0},
  {input:left,left:0,top},{input:right,left:1200,top},
]).png().toFile(outPath);
await browser.close();
console.log(JSON.stringify({elements:before.length,styleDiffs,pixelChannelDiffs:pixelDiffs,beforeScreenshot:beforePath,afterScreenshot:afterPath,comparisonImage:outPath,examples},null,2));
if(styleDiffs||pixelDiffs)process.exitCode=1;
