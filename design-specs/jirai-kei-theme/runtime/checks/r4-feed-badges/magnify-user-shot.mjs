/* Magnify the type-column icons in the user's (read-only) screenshot for comparison.
   Output only into checks/r4-feed-badges/. */
import {createRequire} from 'node:module';const sharp=createRequire('/tmp/dsh-theme-tools/node_modules/playwright/index.mjs')('sharp');
const src='/home/fulutang/.dsh/attachments/v1/objects/9b/9be92b7b66e437087f8ee27876623a2921b7716a9a69418dc2d8a83fc9cf58d8';
const out='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/r4-feed-badges/user-shot-icons-8x.png';
const m=await sharp(src).metadata();
console.log('shot',m.width,m.height);
const bands=[[86,120,150,40],[86,190,150,40],[86,258,150,40],[86,120,150,40]];
const picks=[[86,120,150,40],[86,190,150,40],[86,258,150,40]];
const parts=[];
let top=0;const S=8;
const comp=[];
for(const [l,t,w,h] of picks){
  const b=await sharp(src).extract({left:l,top:t,width:w,height:h}).resize({width:w*S,height:h*S,kernel:'nearest'}).png().toBuffer();
  comp.push({input:b,left:0,top});top+=h*S+8;
}
await sharp({create:{width:150*S,height:top,channels:4,background:{r:22,g:17,b:42,alpha:1}}}).composite(comp).png().toFile(out);
console.log('wrote',out);
