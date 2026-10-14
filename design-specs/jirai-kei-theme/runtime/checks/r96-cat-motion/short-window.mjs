import fs from 'node:fs/promises';import { createRequire } from 'node:module';const require=createRequire(import.meta.url);const sharp=require('/tmp/dsh-theme-tools/node_modules/sharp');
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const out='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/r96-cat-motion';
const fx=await fs.readFile(out+'/fixture.html','utf8');const app=await fs.readFile('/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css','utf8');const th=await fs.readFile('/tmp/jirai-r96-cat/theme.css','utf8');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1360,height:720}});await p.setContent(fx);await p.addStyleTag({content:app});await p.addStyleTag({content:th});
const S='.vrcx-0-sidebar-surface [data-sidebar="content"]';await p.evaluate(s=>{const e=document.querySelector(s);e.scrollTop=e.scrollHeight},S);
const bufs=[];for(const t of [0.05,0.25,0.56]){await p.addStyleTag({content:`${S}::after{animation-delay:${-t}s!important;animation-play-state:paused!important}`});await p.evaluate(s=>{const el=document.querySelector(s);for(const a of document.getAnimations())if(a.effect.target===el&&a.effect.pseudoElement==='::after'){a.pause();a.currentTime=0}},S);
const r=await p.evaluate(s=>{const g=document.querySelector(s+' [data-sidebar="group"]').getBoundingClientRect();return g.bottom},S);bufs.push(await p.screenshot({clip:{x:150,y:Math.round(r)-30,width:90,height:72}}));}
const c=[];for(const [i,x] of bufs.entries())c.push({input:await sharp(x).resize(360,288,{kernel:'nearest'}).png().toBuffer(),left:i*364,top:0});
await sharp({create:{width:1088,height:288,channels:4,background:'#000'}}).composite(c).png().toFile(out+'/short-720-scrolled-ground-peak-6.png');await b.close();
