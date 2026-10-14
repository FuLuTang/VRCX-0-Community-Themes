/* R4 (5a) quantitative sharpness probe: at deviceScaleFactor 1 (Windows 100%),
   how many pixels of a masked glyph fall between the icon colour and the panel
   colour? Those are the interpolation pixels that make a 1px pixel drawing read
   as an ordinary anti-aliased lucide stroke. Compares the app's 14px box
   (size-3.5) with an integer 16px box on the same glyphs. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const app='/home/fulutang/Documents/Github/VRCX-0-jirai';
const theme='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const req=createRequire(app+'/package.json');
const React=req('react'),{renderToStaticMarkup}=req('react-dom/server'),L=req('lucide-react');
const mreq=createRequire('/tmp/dsh-theme-tools/node_modules/playwright/index.mjs');
const sharp=mreq('sharp');
const ICONS=[['PencilLineIcon','pencil-line'],['MapPinIcon','map-pin'],['LogInIcon','log-in'],['FileTextIcon','file-text']];
const SIZES=[14,16];
const FG=[0xb9,0xad,0xd9],BG=[0x20,0x19,0x36];
let cells='';
for(const [id,slug] of ICONS)for(const px of SIZES){
  const svg=renderToStaticMarkup(React.createElement(L[id],{'aria-hidden':'true'})).replace('<svg',`<svg style="width:${px}px;height:${px}px;flex:none;color:rgb(${FG})"`);
  cells+=`<div class="cell" data-k="${slug}-${px}" style="width:${px}px;height:${px};background:rgb(${BG});overflow:hidden">${svg}</div>`;
}
const html=`<!doctype html><html><head><meta charset="utf-8"><title>sharpness probe (NOT WINDOWS)</title><style>body{margin:0;background:rgb(${BG});display:flex;gap:12px;padding:8px}</style></head><body>${cells}</body></html>`;
const file=path.join(here,'sharpness-fixture.html');await fs.writeFile(file,html);
const appCss=[await fs.readFile(path.join(app,'dist/assets/index-Cckb3vVG.css'),'utf8'),await fs.readFile(path.join(app,'dist/assets/App-C2mIqNXI.css'),'utf8')];
const themeCss=await fs.readFile(path.join(theme,'runtime/preview-package/jirai-kei-theme/theme.css'),'utf8');
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:220,height:80},deviceScaleFactor:1});
await page.goto('file://'+file);
for(const c of appCss)await page.addStyleTag({content:c});
await page.addStyleTag({content:themeCss});
const out=[];
for(const [id,slug] of ICONS)for(const px of SIZES){
  const buf=await page.locator(`[data-k="${slug}-${px}"]`).screenshot();
  const {data,info}=await sharp(buf).raw().toBuffer({resolveWithObject:true});
  let solid=0,mid=0,empty=0;
  const near=(p,c,t=14)=>Math.abs(p[0]-c[0])<=t&&Math.abs(p[1]-c[1])<=t&&Math.abs(p[2]-c[2])<=t;
  for(let i=0;i<data.length;i+=info.channels){
    const p=[data[i],data[i+1],data[i+2]];
    if(near(p,FG))solid++;else if(near(p,BG))empty++;else mid++;
  }
  out.push({icon:slug,box:px,solid,blended:mid,background:empty,blendedShare:+(mid/(solid+mid+empty)).toFixed(3)});
}
await fs.writeFile(path.join(here,'sharpness.json'),JSON.stringify(out,null,2)+'\n');
for(const r of out)console.log(String(r.icon).padEnd(12),'box',String(r.box).padEnd(3),'solid',String(r.solid).padEnd(4),'blended',String(r.blended).padEnd(4),'bg',String(r.background).padEnd(4),'blendedShare',r.blendedShare);
await browser.close();
