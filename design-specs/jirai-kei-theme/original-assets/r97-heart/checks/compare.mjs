import {createRequire} from 'node:module';const sharp=createRequire(import.meta.url)('/tmp/dsh-theme-tools/node_modules/sharp');
const A='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/original-assets/r97-heart';
const names=['9x7','10x8','11x9'];const scales=[1,4,8];const bgs=['#d97fc6','#16112a'];
// cell = 11*8+16 wide, 9*8+16 tall
const CW=104,CH=88,LW=0;const comps=[];
for(const [bi,bg] of bgs.entries())for(const [ni,n] of names.entries())for(const [si,s] of scales.entries()){
  const raw=await sharp(`${A}/heart-${n}.svg`,{density:72}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if(raw.info.width!==+n.split('x')[0]||raw.info.height!==+n.split('x')[1])throw Error('size '+n+JSON.stringify(raw.info));
  const img=await sharp(raw.data,{raw:raw.info}).resize({width:raw.info.width*s,kernel:'nearest'}).png().toBuffer();
  const left=(ni*3+si)*CW+8+Math.floor((11*8-raw.info.width*s)/2),top=bi*CH+8+Math.floor((9*8-raw.info.height*s)/2);
  comps.push({input:img,left,top});
}
const W=9*CW,H=2*CH;
const bgRects=bgs.map((bg,bi)=>({input:{create:{width:W,height:CH,channels:4,background:bg}},left:0,top:bi*CH}));
await sharp({create:{width:W,height:H,channels:4,background:'#000'}}).composite([...bgRects,...comps]).png().toFile(A+'/compare.png');
console.log(W,H);
