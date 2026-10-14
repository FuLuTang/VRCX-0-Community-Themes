/* Visual A/B: checked-in pencil-line glyph vs the thickened hand-refined
   candidate, each drawn at 14px (app size-3.5) and 16px (integer grid), nearest
   magnified 12x. Front = the glyph actually shipped by jirai-icons.css. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const mreq=createRequire('/tmp/dsh-theme-tools/node_modules/playwright/index.mjs');
const sharp=mreq('sharp');
const icons='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/original-assets/icons';
const shipped=await fs.readFile(icons+'/src/pencil-line.svg','utf8');
const cand=await fs.readFile(here+'/candidate-pencil-line-h.svg','utf8');
const uri=s=>'url("data:image/svg+xml,'+encodeURIComponent(s.trim())+'")';
const FG='#b9add9',BG='#201936';
let css='.cell i{background-color:'+FG+';-webkit-mask:var(--m) center/contain no-repeat;mask:var(--m) center/contain no-repeat}\n';
let cells='';
for(const [tag,svg] of [['shipped',shipped],['thick',cand]])for(const px of [14,16]){
  css+=`.k-${tag}-${px}{--m:${uri(svg)}}\n`;
  cells+=`<div class="cell" data-k="${tag}-${px}" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:${BG}"><i class="k-${tag}-${px}" style="display:block;width:${px}px;height:${px}px"></i></div>`;
}
const html=`<!doctype html><html><head><meta charset="utf-8"><title>pencil A/B (NOT WINDOWS)</title><style>${css}body{margin:0;background:#16112a;display:grid;grid-template-columns:repeat(2,40px);gap:4px;padding:6px}</style></head><body>${cells}</body></html>`;
const file=path.join(here,'pencil-ab.html');await fs.writeFile(file,html);
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:120,height:120},deviceScaleFactor:1});
await page.goto('file://'+file);
const S=12,T=480,G=8;
const keys=['shipped-14','shipped-16','thick-14','thick-16'];
const comp=[];
for(let i=0;i<keys.length;i++){
  const buf=await page.locator(`[data-k="${keys[i]}"]`).screenshot();
  const big=await sharp(buf).resize(T,T,{kernel:'nearest'}).png().toBuffer();
  comp.push({input:big,left:(i%2)*(T+G),top:Math.floor(i/2)*(T+G)});
}
await sharp({create:{width:2*T+G,height:2*T+G,channels:4,background:{r:22,g:17,b:42,alpha:1}}}).composite(comp).png().toFile(path.join(here,'pencil-ab.png'));
console.log('legend: row1 shipped glyph | row2 thickened hand-refined candidate ; col1 14px (app) col2 16px (integer grid)');
await browser.close();
