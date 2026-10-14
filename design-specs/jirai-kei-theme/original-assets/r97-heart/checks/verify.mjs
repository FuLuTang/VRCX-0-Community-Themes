// R9.7 Q7 brand-heart verification. Usage:
//   PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node verify.mjs <r97-bundle.css> <r96-bundle.css>
import fs from 'node:fs/promises';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import {createRequire} from 'node:module';
import {hearts,colors} from './hearts.mjs';
const sharp=createRequire(import.meta.url)('/tmp/dsh-theme-tools/node_modules/sharp');
const D='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const html=await fs.readFile(D+'/runtime/checks/r9-brand-heart/fixture.html','utf8');
const [css97,css96]=await Promise.all([fs.readFile(process.argv[2],'utf8'),fs.readFile(process.argv[3],'utf8')]);
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const expect=[['9x7','1px 1px'],['9x7','1px 1px'],['10x8','1px 1px'],['11x9','0px 0px'],['10x8','1px 1px']];
const b=await chromium.launch();const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
async function page(css,{t=null,extra='',dpr=1,reduce=false}={}){
  const p=await b.newPage({viewport:{width:900,height:700},deviceScaleFactor:dpr,reducedMotion:reduce?'reduce':'no-preference'});
  await p.setContent(html);await p.addStyleTag({content:css});
  if(t!==null)await p.addStyleTag({content:`.vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after{animation-delay:-${t}s!important;animation-play-state:paused!important}`});
  if(extra)await p.addStyleTag({content:extra});
  await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(60);return p;}
const geo=p=>p.evaluate(()=>{const e=[...document.querySelectorAll('.vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand')].find(e=>!e.closest('.static-demo'));
  const s=getComputedStyle(e,'::after');const br=e.getBoundingClientRect();const tr=e.closest('[data-slot="menubar-trigger"]').getBoundingClientRect();const help=document.getElementById('help-trigger').getBoundingClientRect();
  const w=parseFloat(s.width),h=parseFloat(s.height),right=parseFloat(s.right);const m=new DOMMatrix(s.transform==='none'?undefined:s.transform);
  const boxLeft=br.right+(-right)-w, boxTop=br.top+parseFloat(s.top)+m.f;
  return {tr:s.transform,an:s.animationName,ps:s.animationPlayState,size:s.backgroundSize,pos:s.backgroundPosition,img:s.backgroundImage.slice(0,60),mask:s.maskImage,bg:s.backgroundColor,rend:s.imageRendering,pe:s.pointerEvents,w,h,right,
    boxLeft,boxTop,brand:[br.left,br.top,br.width,br.height],trig:[tr.left,tr.top,tr.width,tr.height],help:[help.left,help.top,help.width,help.height]}});
// pixel-exact match of the ASCII grid inside the screenshot at the snapped box origin + background-position
async function match(p,g,name,posPx){
  const rows=hearts[name];const X=Math.round(g.boxLeft)+posPx[0],Y=Math.round(g.boxTop)+posPx[1];
  const buf=await p.screenshot({clip:{x:X-2,y:Y-2,width:rows[0].length+4,height:rows.length+4}});
  const {data,info}=await sharp(buf).raw().toBuffer({resolveWithObject:true});let bad=0;
  rows.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='.')return;const want=hex(colors[c]);const o=((y+2)*info.width+(x+2))*info.channels;if(want.some((v,k)=>Math.abs(v-data[o+k])>2))bad++;}));
  return bad;}
// 1) five frames
const shots=[],frames=[];
for(const [i,t] of [0.25,0.75,1.25,1.75,2.25].entries()){
  const p=await page(css97,{t});const g=await geo(p);const [name,pos]=expect[i];const [w,h]=name.split('x');
  ok(g.size===`${w}px ${h}px`,`frame${i} size ${g.size}`);ok(g.pos===pos,`frame${i} pos ${g.pos}`);ok(g.an==='r97-brand-heart-pixels'&&g.ps==='paused',`frame${i} anim`);
  ok(g.mask==='none'&&g.bg==='rgba(0, 0, 0, 0)'&&g.rend==='pixelated'&&g.pe==='none',`frame${i} paint props`);
  const bad=await match(p,g,name,pos.split(' ').map(parseFloat));ok(bad===0,`frame${i} pixel mismatch ${bad}`);
  frames.push({t,name,size:g.size,pos:g.pos,box:[g.w,g.h,g.right],boxLeftMinusBrandRight:g.boxLeft-(g.brand[0]+g.brand[2]),boxTop:g.boxTop,pixelMismatch:bad});
  const cx=Math.round(g.brand[0]+g.brand[2]),cy=Math.round(g.brand[1]+g.brand[3]/2);
  const buf=await p.screenshot({clip:{x:cx-24,y:cy-12,width:46,height:24}});shots.push(await sharp(buf).resize({width:46*8,kernel:'nearest'}).png().toBuffer());
  if(i===0)frames.geo97=g;await p.close();
}
const FW=46*8,FH=24*8,G=12;
await sharp({create:{width:FW*5+G*6,height:FH+G*2,channels:3,background:'#100b1e'}}).composite(shots.map((s,i)=>({input:s,left:G+i*(FW+G),top:G}))).png().toFile(D+'/original-assets/r97-heart/frames.png');
// 2) geometry vs r96 (same t): brand / trigger / help identical, pseudo left edge identical
const p96=await page(css96,{t:0.25});const g96=await geo(p96);await p96.close();const g97=frames.geo97;
for(const k of ['brand','trig','help'])ok(JSON.stringify(g96[k])===JSON.stringify(g97[k]),`${k} moved ${g96[k]} -> ${g97[k]}`);
ok(Math.abs(g96.boxLeft-g97.boxLeft)<1e-6,`left edge ${g96.boxLeft} -> ${g97.boxLeft}`);
// r96 centred its 13px box on the 12px brand line (+6, via a -6.5px translate); r97 sits the 9px box on the
// 9px cap-height ink (+2..+10), centre +6.5, with no transform (integer, layout-snapped).
ok(Math.abs(g96.boxTop+g96.h/2-g96.brand[1]-6)<1e-6&&Math.abs(g97.boxTop-g97.brand[1]-2)<1e-6&&g97.tr==='none','vertical placement');
// 3) static: prefers-reduced-motion and html.reduce-effects -> medium 10x8
const statics=[];
for(const mode of ['prm','reduce-effects']){
  const p=await page(css97,{reduce:mode==='prm'});if(mode==='reduce-effects')await p.evaluate(()=>document.documentElement.classList.add('reduce-effects'));await p.waitForTimeout(30);
  const g=await geo(p);ok(g.an==='none'&&g.size==='10px 8px'&&g.pos==='1px 1px',`${mode} static ${g.an} ${g.size} ${g.pos}`);
  const bad=await match(p,g,'10x8',[1,1]);ok(bad===0,`${mode} pixel mismatch ${bad}`);statics.push({mode,an:g.an,size:g.size,pos:g.pos,pixelMismatch:bad});await p.close();}
// 4) fractional layout offsets (titlebar not on an integer y): grid must still be pixel-exact
const frac=[];
for(const dy of [0.25,0.5,0.75]){for(const [t,name,pos] of [[0.25,'9x7',[1,1]],[1.25,'10x8',[1,1]],[1.75,'11x9',[0,0]]]){
  const p=await page(css97,{t,extra:`#animated-card{margin-top:${dy}px}`});const g=await geo(p);const bad=await match(p,g,name,pos);
  ok(bad===0,`frac ${dy} ${name} mismatch ${bad} (boxTop ${g.boxTop})`);frac.push({dy,name,boxTop:g.boxTop,pixelMismatch:bad});await p.close();}}
await b.close();
console.log(JSON.stringify({frames:frames.map(({...f})=>f),geometry:{r96:{w:g96.w,h:g96.h,right:g96.right,boxLeft:g96.boxLeft,boxTop:g96.boxTop,brand:g96.brand,trig:g96.trig,help:g96.help},r97:{w:g97.w,h:g97.h,right:g97.right,boxLeft:g97.boxLeft,boxTop:g97.boxTop,brand:g97.brand,trig:g97.trig,help:g97.help}},statics,frac,fails,pass:fails.length===0},null,1));
if(fails.length)process.exit(1);
