import {toolRequire} from '../../tools/common.mjs';
import {GRIDS,ORDER,PAL} from './family.mjs';
const sharp=toolRequire('sharp');
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
export function layout(){let y=0;const off={};for(const n of ORDER){off[n]=y;y+=GRIDS[n].length}return {off,H:y,W:16}}
export async function buildPng(names=ORDER){
  const {off,H,W}=layout();const buf=Buffer.alloc(W*H*4);
  for(const n of names){GRIDS[n].forEach((row,y)=>[...row].forEach((c,x)=>{if(c==='.')return;const [r,g,b]=hex(PAL[c]);const i=((off[n]+y)*W+x)*4;buf[i]=r;buf[i+1]=g;buf[i+2]=b;buf[i+3]=255}))}
  const png=await sharp(buf,{raw:{width:W,height:H,channels:4}}).png({palette:true,colours:32,compressionLevel:9,effort:10,dither:0}).toBuffer();
  return {png,W,H,off,uri:'data:image/png;base64,'+png.toString('base64')}}
