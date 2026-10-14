/* R4 (5a) clarity probe — is the "unpixelated" pencil a masking bug, or a 14px
   fractional-grid scaling artifact? Renders the real masked lucide glyphs at the
   app's 14px (size-3.5) and at an integer 16px grid under deviceScaleFactor 1
   (Windows 100% WebView), then nearest-neighbour magnifies 10x for inspection.
   NOT Windows/WebView acceptance. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const app='/home/fulutang/Documents/Github/VRCX-0-jirai';
const theme='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const require=createRequire('/tmp/dsh-theme-tools/node_modules/playwright/index.mjs');
const sharp=require('/tmp/dsh-theme-tools/node_modules/sharp');
const req=createRequire(app+'/package.json');
const React=req('react'),{renderToStaticMarkup}=req('react-dom/server'),L=req('lucide-react');
const ICONS=[['PencilLineIcon','pencil-line','#b9add9'],['MapPinIcon','map-pin','#00b8ff'],['PersonStandingIcon','person-standing','#b9add9'],['LogInIcon','log-in','#2ed319']];
const SIZES=[14,16];
let cells='';
for(const [id,slug,color] of ICONS)for(const px of SIZES){
  const svg=renderToStaticMarkup(React.createElement(L[id],{'aria-hidden':'true'}));
  cells+=`<div class="cell" data-k="${slug}-${px}" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:#201936"><span style="display:inline-flex;color:${color}">${svg.replace('<svg','<svg style="width:'+px+'px;height:'+px+'px;flex:none"')}</span></div>`;
}
const html=`<!doctype html><html><head><meta charset="utf-8"><title>clarity probe (NOT WINDOWS)</title><style>body{margin:0;background:#16112a;display:grid;grid-template-columns:repeat(${SIZES.length},40px);gap:4px;padding:6px}.cell{outline:1px solid #6c5ce033}</style></head><body>${cells}</body></html>`;
const file=path.join(here,'clarity-fixture.html');await fs.writeFile(file,html);
const appCss=[await fs.readFile(path.join(app,'dist/assets/index-Cckb3vVG.css'),'utf8'),await fs.readFile(path.join(app,'dist/assets/App-C2mIqNXI.css'),'utf8')];
const themeCss=await fs.readFile(path.join(theme,'runtime/preview-package/jirai-kei-theme/theme.css'),'utf8');
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:200,height:400},deviceScaleFactor:1});
await page.goto('file://'+file);
for(const c of appCss)await page.addStyleTag({content:c});
await page.addStyleTag({content:themeCss});
const probe=await page.evaluate(()=>[...document.querySelectorAll('.cell')].map(c=>{const s=c.querySelector('svg'),cs=getComputedStyle(s),r=s.getBoundingClientRect();return {k:c.dataset.k,w:r.width,h:r.height,mask:cs.maskImage!=='none',maskSize:cs.maskSize};}));
const shots={};
for(const p of probe){const buf=await page.locator(`[data-k="${p.k}"]`).screenshot();shots[p.k]=await sharp(buf).resize(400,400,{kernel:'nearest'}).png().toBuffer();}
const order=ICONS.flatMap(([,,,]) => SIZES.map(px=>px));
const keys=ICONS.flatMap(([,slug])=>SIZES.map(px=>`${slug}-${px}`));
const tiles=keys.map(k=>({input:shots[k],left:0,top:0}));
const cols=SIZES.length,rows=ICONS.length,T=400,G=8;
const comp=[];keys.forEach((k,i)=>{comp.push({input:shots[k],left:(i%cols)*(T+G),top:Math.floor(i/cols)*(T+G)});});
await sharp({create:{width:cols*T+(cols-1)*G,height:rows*T+(rows-1)*G,channels:4,background:{r:22,g:17,b:42,alpha:1}}}).composite(comp).png().toFile(path.join(here,'clarity-14-vs-16.png'));
/* second pass: does image-rendering:pixelated help a 14px mask? */
await page.addStyleTag({content:`svg.lucide{image-rendering:pixelated}`});
const px=await page.evaluate(()=>[...document.querySelectorAll('.cell')].map(c=>getComputedStyle(c.querySelector('svg')).imageRendering));
await fs.writeFile(path.join(here,'clarity.json'),JSON.stringify({probe,imageRenderingAfter:px,legend:'rows: pencil-line, map-pin, person-standing, log-in | cols: 14px (app size-3.5), 16px (integer grid)'},null,2)+'\n');
console.log(JSON.stringify(probe,null,1));console.log('legend: rows=pencil-line,map-pin,person-standing,log-in cols=14px,16px');
await browser.close();
