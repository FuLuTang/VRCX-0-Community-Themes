/* Lead R5 motion check: built theme + app CSS, normal vs reduced motion. NOT WINDOWS. */
import fs from 'node:fs/promises';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const app='/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/';
const css=[await fs.readFile(app+'index-Cckb3vVG.css','utf8'),await fs.readFile(app+'App-C2mIqNXI.css','utf8'),await fs.readFile(new URL('../../preview-package/jirai-kei-theme/theme.css',import.meta.url),'utf8')];
const html=`<div class="vrcx-0-app-root"><header data-app-titlebar class="vrcx-0-titlebar h-8 flex"><span class="vrcx-0-brand relative">VRCX</span></header>
<div data-slot="sidebar" data-state="expanded"><div data-slot="sidebar-inner" class="vrcx-0-sidebar-surface" style="height:600px;width:200px"></div></div>
<main class="vrcx-0-main-content" style="height:300px"></main><aside class="vrcx-0-side-panel" style="height:300px;width:240px"></aside>
<div data-slot="tabs"><button data-slot="tabs-tab" data-active>Tab</button></div><footer data-vrcx-0-surface="statusbar" class="vrcx-0-statusbar">s</footer></div>`;
const b=await chromium.launch();const out={};
for(const mode of ['no-preference','reduce']){const p=await b.newPage({reducedMotion:mode});await p.setContent(html);for(const c of css)await p.addStyleTag({content:c});
 out[mode]=await p.evaluate(()=>{const g=(s,ps)=>{const c=getComputedStyle(document.querySelector(s),ps);return {anim:c.animationName,pe:c.pointerEvents,w:c.width,content:c.content};};
  return {brandHeart:g('.vrcx-0-brand','::after'),lace:g('.vrcx-0-statusbar','::before'),pendant:g('.vrcx-0-sidebar-surface','::after'),sparkles:g('.vrcx-0-side-panel','::after'),glint:g('[data-slot=tabs-tab]','::after'),mainAfter:g('.vrcx-0-main-content','::after')};});await p.close();}
await b.close();console.log(JSON.stringify(out,null,1));
const n=out['no-preference'],r=out.reduce,keys=['brandHeart','lace','pendant','sparkles','glint'];
if(!keys.every(k=>n[k].anim!=='none'&&r[k].anim==='none'&&n[k].pe==='none'))throw Error('motion/reduced/pointer-events regression');
if(n.mainAfter.w!=='2px'||n.mainAfter.anim!=='none')throw Error('app resize accent pseudo was repurposed');
console.log('PASS');
