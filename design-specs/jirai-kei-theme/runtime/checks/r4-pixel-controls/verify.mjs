/* R4 pixel controls fixture: real Base UI SSR markup + app source classNames + app compiled CSS + built theme + pixel-controls.css.
   DOM FIXTURE / NOT WINDOWS / NOT WebView2. Base UI ScrollArea thumb size is emulated with the formula from ScrollAreaViewport.js:162-180. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const sharp=createRequire('/tmp/dsh-theme-tools/package.json')('sharp');
const here=path.dirname(fileURLToPath(import.meta.url)),app='/home/fulutang/Documents/Github/VRCX-0-jirai',runtime=path.resolve(here,'../..');
const req=createRequire(app+'/package.json'),React=req('react'),{renderToStaticMarkup:r}=req('react-dom/server'),h=React.createElement;
const {Switch}=req('@base-ui/react/switch'),{Progress}=req('@base-ui/react/progress'),{ScrollArea}=req('@base-ui/react/scroll-area');
const src=f=>fs.readFile(path.join(app,'src/ui/shadcn',f),'utf8');
const [swSrc,prSrc,saSrc]=await Promise.all(['switch.tsx','progress.tsx','scroll-area.tsx'].map(src));
const cls={swRoot:swSrc.match(/'(peer group\/switch[^']+)'/)[1],swThumb:swSrc.match(/className="([^"]+)"/)[1],prTrack:prSrc.match(/'(bg-muted relative[^']+)'/)[1],prInd:prSrc.match(/'(bg-primary h-full[^']+)'/)[1],sbar:saSrc.match(/'(flex touch-none[^']+)'/)[1],sthumb:saSrc.match(/className="(bg-border[^"]+)"/)[1]};
const sw=(id,p,size='default')=>h('span',{id,style:{display:'inline-flex'}},h(Switch.Root,{'data-slot':'switch','data-size':size,className:cls.swRoot,...p},h(Switch.Thumb,{'data-slot':'switch-thumb',className:cls.swThumb})));
const pr=(id,v,extra='')=>h(Progress.Root,{id,'data-slot':'progress',value:v,className:'flex flex-wrap gap-3 '+extra},h(Progress.Track,{'data-slot':'progress-track',className:cls.prTrack},h(Progress.Indicator,{'data-slot':'progress-indicator',className:cls.prInd})));
const lines=n=>Array.from({length:n},(_,i)=>`<div style="height:20px;white-space:nowrap">示例行 Sample row ${i+1} ────────────────────────────────</div>`).join('');
const sa=id=>r(h(ScrollArea.Root,{id,'data-slot':'scroll-area',className:'relative',style:{height:150,width:200}},h(ScrollArea.Viewport,{'data-slot':'scroll-area-viewport',className:'size-full rounded-[inherit] outline-none'},h('div',{dangerouslySetInnerHTML:{__html:lines(20)}})),h(ScrollArea.Scrollbar,{'data-slot':'scroll-area-scrollbar','data-orientation':'vertical',orientation:'vertical',keepMounted:true,className:cls.sbar},h(ScrollArea.Thumb,{'data-slot':'scroll-area-thumb',className:cls.sthumb}))));
const box='display:inline-block;padding:10px;margin:4px;background:#201936;vertical-align:top';
const html=`<!doctype html><html class="dark"><meta charset="utf-8"><title>R4 pixel controls — DOM FIXTURE / NOT WINDOWS</title>
<link rel="stylesheet" href="file://${app}/dist/assets/index-Cckb3vVG.css"><link rel="stylesheet" href="file://${app}/dist/assets/App-C2mIqNXI.css">
<body style="margin:0;background:#16112a;color:#f2ebff"><p style="margin:4px 10px;font-size:12px">DOM FIXTURE / NOT WINDOWS · 中性示例</p>
<div id="switches" style="${box}"><div style="display:grid;grid-template-columns:repeat(4,auto);gap:10px 18px;align-items:center">
${r(sw('sw-off',{}))}${r(sw('sw-on',{defaultChecked:true}))}${r(sw('sw-dis-off',{disabled:true}))}${r(sw('sw-dis-on',{disabled:true,defaultChecked:true}))}
${r(sw('sw-sm-off',{},'sm'))}${r(sw('sw-sm-on',{defaultChecked:true},'sm'))}<span id="focus-cell" style="padding:4px">${r(sw('sw-focus',{defaultChecked:false}))}</span><span>${r(sw('sw-focus-on',{defaultChecked:true}))}</span></div></div>
<div id="native" style="${box};display:inline-flex;gap:8px">${['top','mid','bot'].map(k=>`<div id="n-${k}" style="height:150px;width:130px;overflow:auto;background:#201936">${lines(20)}</div>`).join('')}<div id="n-x" style="height:150px;width:130px;overflow:auto"><div style="width:400px">${lines(20)}</div></div></div>
<div id="baseui" style="${box};display:inline-flex;gap:8px">${sa('sa-top')}${sa('sa-mid')}${sa('sa-bot')}</div>
<div id="progress" style="${box};width:260px;display:inline-flex;flex-direction:column;gap:10px">${r(pr('p0',0))}${r(pr('p45',45))}${r(pr('p100',100))}${r(pr('p-ind',null,'indeterminate-progress'))}</div>
</body></html>`;
const file=path.join(here,'fixture.html');await fs.writeFile(file,html);
const theme=await fs.readFile(path.join(runtime,'preview-package/jirai-kei-theme/theme.css'),'utf8'),mine=await fs.readFile(path.join(runtime,'pixel-controls.css'),'utf8');
const browser=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});
const page=await browser.newPage({viewport:{width:1100,height:640},deviceScaleFactor:1});
await page.goto('file://'+file);
const before=await page.evaluate(()=>{const s=document.querySelector('#sw-off [data-slot=switch]');return {w:s.getBoundingClientRect().width,h:s.getBoundingClientRect().height,nativeSb:document.querySelector('#n-top').offsetWidth-document.querySelector('#n-top').clientWidth};});
await page.addStyleTag({content:theme});await page.addStyleTag({content:mine});
await page.evaluate(async()=>{await document.fonts.load('8px "WD Pixel"','ONF');await document.fonts.ready;});await page.waitForTimeout(500);
await page.evaluate(()=>{
 const set=(id,f)=>{const e=document.getElementById(id);e.scrollTop=(e.scrollHeight-e.clientHeight)*f;};set('n-top',0);set('n-mid',.5);set('n-bot',1);
 [['sa-top',0],['sa-mid',.5],['sa-bot',1]].forEach(([id,f])=>{const root=document.getElementById(id),vp=root.querySelector('[data-slot=scroll-area-viewport]'),sb=root.querySelector('[data-slot=scroll-area-scrollbar]'),th=sb.firstElementChild,cs=getComputedStyle(sb);
  vp.scrollTop=(vp.scrollHeight-vp.clientHeight)*f;const pad=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom),hgt=Math.max(16,(vp.clientHeight-pad)*vp.clientHeight/vp.scrollHeight);
  const off=vp.scrollTop/(vp.scrollHeight-vp.clientHeight)*(sb.offsetHeight-hgt-pad);sb.style.setProperty('--scroll-area-thumb-height',hgt+'px');th.style.visibility='visible';th.style.transform=`translate3d(0,${off}px,0)`;});
});
await page.focus('#sw-focus [data-slot=switch]');await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
const m=await page.evaluate(()=>{
 const q=s=>document.querySelector(s),rect=e=>{const b=e.getBoundingClientRect();return {x:+b.x.toFixed(2),y:+b.y.toFixed(2),w:+b.width.toFixed(2),h:+b.height.toFixed(2)};};
 const swi=id=>{const e=q('#'+id+' [data-slot=switch]'),t=e.firstElementChild,c=getComputedStyle(e),b=getComputedStyle(e,'::before'),tc=getComputedStyle(t);return {attrs:[...e.attributes].map(a=>a.name).filter(n=>n.startsWith('data-')||n.startsWith('aria-')),root:rect(e),thumb:rect(t),thumbTranslate:tc.translate,thumbBg:tc.backgroundImage.slice(0,40),before:{content:b.content,color:b.color,left:b.left,right:b.right,width:b.width,font:b.fontFamily,pe:b.pointerEvents},opacity:c.opacity,filter:c.filter,outline:c.outlineStyle+' '+c.outlineWidth+' '+c.outlineColor,focusVisible:e.matches(':focus-visible'),transition:tc.transition};};
 const ind=id=>{const t=q('#'+id+' [data-slot=progress-track]'),i=t.firstElementChild,cs=getComputedStyle(i);return {track:rect(t),ind:rect(i),bgSize:cs.backgroundSize,bgRepeat:cs.backgroundRepeat,radius:getComputedStyle(t).borderRadius,anim:cs.animationTimingFunction};};
 const n=q('#n-top');const sa=q('#sa-mid [data-slot=scroll-area-scrollbar]');
 return {switches:Object.fromEntries(['sw-off','sw-on','sw-dis-off','sw-dis-on','sw-sm-off','sw-sm-on','sw-focus'].map(i=>[i,swi(i)])),
  native:{offsetMinusClient:n.offsetWidth-n.clientWidth,scrollbarWidthProp:getComputedStyle(n).scrollbarWidth,scrollbarColor:getComputedStyle(n).scrollbarColor},
  baseui:{bar:rect(sa),padding:getComputedStyle(sa).padding,thumb:rect(sa.firstElementChild),bars:['sa-top','sa-bot'].map(i=>{const s=q('#'+i+' [data-slot=scroll-area-scrollbar]');return {bar:rect(s),thumb:rect(s.firstElementChild)};})},
  progress:Object.fromEntries(['p0','p45','p100','p-ind'].map(i=>[i,ind(i)]))};
});
m.before=before;m.cssBytes=Buffer.byteLength(mine);m.fixtureOnly='NOT WINDOWS';
const shots={};
for(const [name,sel] of [['switches','#switches'],['native-scrollbars','#native'],['baseui-scrollarea','#baseui'],['progress','#progress']]){const buf=await page.locator(sel).screenshot();const meta=await sharp(buf).metadata();const p=path.join(here,`${name}-x4.png`);await sharp(buf).resize(meta.width*4,meta.height*4,{kernel:'nearest'}).png().toFile(p);shots[name]=p;}
await page.emulateMedia({reducedMotion:'reduce'});m.reducedMotionThumbTransition=await page.evaluate(()=>getComputedStyle(document.querySelector('#sw-on [data-slot=switch-thumb]')).transitionDuration);
m.shots=shots;await fs.writeFile(path.join(here,'report.json'),JSON.stringify(m,null,2)+'\n');console.log(JSON.stringify(m,null,1));await browser.close();
