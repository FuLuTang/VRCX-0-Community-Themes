/* NOT WINDOWS: verifies the two corner decorations render where requested. */
import fs from 'node:fs/promises';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const root=new URL('../../',import.meta.url),out=new URL('./',import.meta.url);
const app='/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/';
const css=await Promise.all([fs.readFile(app+'index-Cckb3vVG.css','utf8'),fs.readFile(app+'App-C2mIqNXI.css','utf8'),fs.readFile(new URL('preview-package/jirai-kei-theme/theme.css',root),'utf8')]);
const html=`<!doctype html><html class="dark"><body style="margin:0"><div class="vrcx-0-app-root" style="display:flex;height:100vh">
<div data-slot="sidebar" data-state="expanded" style="width:200px;flex:none"><div data-slot="sidebar-inner" class="vrcx-0-sidebar-surface flex h-full flex-col"><div data-sidebar="content" class="flex flex-1 flex-col"></div><div data-sidebar="footer"></div></div></div>
<main class="vrcx-0-main-content" style="position:relative;flex:1">
 <div class="vrcx-0-data-table" style="height:100%;padding:16px;color:#f2ebff;font:14px monospace">NOT WINDOWS · main content fixture<br>corner art must stay behind this transparent table</div>
</main>
<div class="vrcx-0-side-panel" style="width:220px;flex:none"></div></div></body></html>`;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:760}});
await p.setContent(html);for(const c of css)await p.addStyleTag({content:c});await p.evaluate(()=>document.fonts.ready);
const state=await p.evaluate(()=>{const s=getComputedStyle(document.querySelector('.vrcx-0-main-content'));
 const imgs=s.backgroundImage.match(/data:image\/png/g)?.length??0;
 return {layers:s.backgroundImage.split(/,(?=url|linear|radial|none)/).length,dataUrls:imgs,position:s.backgroundPosition,size:s.backgroundSize,repeat:s.backgroundRepeat};});
console.log(JSON.stringify(state,null,1));
if(state.dataUrls!==2)throw Error('expected both corner images inline');
// Chromium serialises `left bottom` / `right bottom` as `0px 100%` / `100% 100%`.
const pos=state.position.split(',').map(s=>s.trim());
if(pos[0]!=='0px 100%')throw Error('big icon must sit bottom-left, got: '+pos[0]);
if(pos[1]!=='100% 100%')throw Error('small icon must sit bottom-right, got: '+pos[1]);
// Both corners must be the SAME size now, and larger than the earlier 100/128 pair.
const sizes=state.size.split(',').map(s=>s.trim());
if(sizes[0]!=='200px 200px')throw Error('bottom-left art must be 200px, got: '+sizes[0]);
if(sizes[1]!=='200px 200px')throw Error('bottom-right art must be 200px, got: '+sizes[1]);
if(sizes[0]!==sizes[1])throw Error('both corners must match in size');
await p.screenshot({path:new URL('compact-1200.png',out).pathname});
await p.setViewportSize({width:760,height:600});await p.waitForTimeout(120);
const narrow=await p.evaluate(()=>getComputedStyle(document.querySelector('.vrcx-0-main-content')).backgroundSize);
await p.screenshot({path:new URL('compact-760.png',out).pathname});
console.log('narrow size:',narrow);
await b.close();console.log('PASS: R7 corner backgrounds');
