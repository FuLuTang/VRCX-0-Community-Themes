import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
process.env.PLAYWRIGHT_BROWSERS_PATH||='/tmp/dsh-theme-browsers';
const {chromium}=await import('/tmp/dsh-theme-tools/node_modules/playwright/index.mjs');
const here=path.dirname(fileURLToPath(import.meta.url));
const repo='/home/fulutang/Documents/Github/VRCX-0-jirai';
const theme=await fs.readFile(path.resolve(here,'../../preview-package/jirai-kei-theme/theme.css'),'utf8');
const old=theme.split('/* SECTION portal-button-roles-b073-b100 */')[0];
const assets=(await fs.readdir(path.join(repo,'dist/assets'))).filter(n=>/^(index|App)-.*\.css$/.test(n)).sort((a,b)=>a.startsWith('index')?-1:1);
const css=await Promise.all(assets.map(n=>fs.readFile(path.join(repo,'dist/assets',n),'utf8')));
// Exact responsibility subtree from UserDialogHeaderMedia.tsx:54–105; no business
// state, image-fetching or authenticated route is claimed by this source DOM fixture.
const markup=`<div data-slot="dialog-content" class="entity-dialog"><div data-slot="card-header"><div class="relative"><button id="banner" data-slot="button" data-variant="ghost" data-size="default" aria-label="Banner" class="bg-muted aspect-[4/3] h-auto w-full overflow-hidden rounded-lg border p-0 disabled:pointer-events-none disabled:opacity-100"><span class="relative size-full"><img class="absolute inset-0 size-full object-cover"/></span></button><div class="absolute bottom-3 left-3 z-30 size-16"><button id="avatar" data-slot="button" data-variant="ghost" data-size="default" aria-label="Avatar" class="bg-background/90 relative z-0 size-full overflow-hidden rounded-full p-0 shadow-md border-2 border-white"><img class="size-full object-cover"/></button></div></div></div></div>`;
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:800,height:700}});
await page.setContent('<html class="dark"><head>'+css.map(c=>'<style>'+c+'</style>').join('')+'<style id="theme">'+old+'</style><style>*{transition:none!important;animation:none!important}[data-slot="dialog-content"]{position:static!important;transform:none!important;translate:none!important;width:400px!important}</style></head><body>'+markup+'</body></html>');
const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const {root}=await cdp.send('DOM.getDocument',{depth:-1});
const properties=['backgroundColor','backgroundImage','borderRadius','borderWidth','borderColor','boxShadow','clipPath','maskImage','maskSize','opacity','transform','outline','width','height','zIndex','content'];
async function sample(text){await page.locator('#theme').evaluate((e,text)=>e.textContent=text,text);const out={};for(const id of ['banner','avatar']){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'#'+id});out[id]={};for(const state of ['base','hover','active','focus-visible','disabled']){await page.locator('#'+id).evaluate((e,state)=>{state==='disabled'?e.setAttribute('disabled',''):e.removeAttribute('disabled')},state);await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:state==='base'||state==='disabled'?[]:[state]});out[id][state]=await page.locator('#'+id).evaluate((e,props)=>Object.fromEntries([['host',null],['before','::before'],['after','::after']].map(([name,pseudo])=>{const s=getComputedStyle(e,pseudo);return[name,Object.fromEntries(props.map(p=>[p,s[p]]))]})),properties)}await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:[]})}out.outerFrame=await page.locator('[data-slot="card-header"]>div.relative').evaluate((e,props)=>Object.fromEntries(props.map(p=>[p,getComputedStyle(e,'::before')[p]])),properties);return out}
const before=await sample(old),after=await sample(theme);const pass=JSON.stringify(before)===JSON.stringify(after);
await fs.writeFile(path.join(here,'b073-b100-frames.json'),JSON.stringify({fixture:'Source DOM from UserDialogHeaderMedia.tsx; includes R96 stitched banner pseudo frame and cut avatar',pass,before,after},null,2)+'\n');
await page.screenshot({path:path.join(here,'shots/b073-b100-frames.png')});await browser.close();console.log(JSON.stringify({pass,states:5,targets:['banner','avatar','outerFrame']}));if(!pass)process.exitCode=1;
