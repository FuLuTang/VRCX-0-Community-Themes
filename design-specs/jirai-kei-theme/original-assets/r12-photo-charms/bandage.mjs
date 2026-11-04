// 原创 45° 像素创可贴（"/" 方向：左下→右上），参数化。输出 RGBA 像素格 + PNG。
import { toolRequire } from '../../tools/common.mjs';
export const PAL={
 line:[0xd9,0x84,0xad,255],      // 浅描边（粉玫）
 tape:[0xff,0xd3,0xd8,255],      // 肤粉胶带
 tapeHi:[0xff,0xec,0xee,255],    // 胶带左上高光
 tapeLo:[0xf4,0xb2,0xc8,255],    // 胶带右下暗部
 hole:[0xe9,0x9d,0xb8,255],      // 透气孔
 pad:[0xff,0xf8,0xfb,255],       // 纱布垫
 padLine:[0xee,0xb9,0xcd,255],   // 垫边
 padDot:[0xf6,0xd6,0xe2,255],    // 垫纹
 shadow:[0x22,0x14,0x44,72],     // 阴影
 stripe:[0xc7,0x8a,0xf0,255]     // 紫色小点缀（地雷系）
};
export function make({N,T,L,r,PL,PW,hole=true,shadow=[2,2],stripe=true}){
 const S=Math.SQRT2,cx=N/2,cy=N/2;
 const geo=(x,y)=>{const px=x+.5-cx,py=y+.5-cy;return {u:(px-py)/S,v:(px+py)/S};};
 const inside=(x,y)=>{const {u,v}=geo(x,y);const qx=Math.abs(u)-(L/2-r),qy=Math.abs(v)-(T/2-r);const sd=Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-r;return sd<=0;};
 const M=Array.from({length:N},(_,y)=>Array.from({length:N},(_,x)=>inside(x,y)));
 const get=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&M[y][x];
 const out=Array.from({length:N},()=>Array(N).fill(null));
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  if(!M[y][x])continue;
  const {u,v}=geo(x,y);
  const edge=!(get(x+1,y)&&get(x-1,y)&&get(x,y+1)&&get(x,y-1));
  if(edge){out[y][x]=PAL.line;continue;}
  // 内圈（离轮廓 1 格）：上/左 高光，下/右 暗部
  const hiEdge=!(get(x-1,y-1)&&get(x+1,y-1)&&get(x-1,y+1)&&get(x+1,y+1));
  let c=PAL.tape;
  if(hiEdge){c=(v<0&&true)?PAL.tapeHi:PAL.tapeLo;}
  // 纱布垫
  const inPad=Math.abs(u)<=PL/2&&Math.abs(v)<=PW/2;
  if(inPad){
   const padEdge=Math.abs(u)>PL/2-1.2||Math.abs(v)>PW/2-1.2;
   if(padEdge)c=PAL.padLine;
   else c=((x%3===1&&y%3===1)||((x+1)%3===1&&(y+1)%3===1&&false))?PAL.padDot:PAL.pad;
   if(!padEdge&&((x+y)%3===0&&(x-y+99)%3===0))c=PAL.padDot;
  } else if(hole&&Math.abs(v)<T/2-3){
   // 透气孔：两排交错，沿 u 每 8 格
   const s=x+y-(N),d=x-y;
   if(((s===-4||s===-5)&&0)||false){}
   const row1=(x+y===N-4)&&(((d%8)+8)%8===0), row2=(x+y===N+2)&&(((d%8)+8)%8===4), row0=(x+y===N-1)&&(((d%8)+8)%8===2);
   if(T>=14?(row1||row2):row0)c=PAL.hole;
  }
  out[y][x]=c;
 }
 // 紫色小点缀：两端各一条细条纹（胶带端部）
 if(stripe){for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!out[y][x]||out[y][x]===PAL.line)continue;const {u,v}=geo(x,y);if(Math.abs(u)>PL/2+3&&Math.abs(Math.abs(u)-(L/2-r-3))<.8&&Math.abs(v)<T/2-2.5&&out[y][x]===PAL.tape)out[y][x]=PAL.stripe;}}
 // 阴影
 if(shadow){const [dx,dy]=shadow;for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(out[y][x])continue;const sx=x-dx,sy=y-dy;if(sx>=0&&sy>=0&&sx<N&&sy<N&&M[sy][sx])out[y][x]=PAL.shadow;}}
 return out;
}
export function bbox(g){let x0=1e9,y0=1e9,x1=-1,y1=-1;g.forEach((r,y)=>r.forEach((c,x)=>{if(c&&c!==PAL.shadow){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}}));return {x0,y0,x1,y1};}
export function crop(g,m=0){const b=bbox(g);const w=b.x1-b.x0+1+3,h=b.y1-b.y0+1+3; // +3 留阴影
 return Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>g[b.y0+y]?.[b.x0+x]??null));}
export async function png(g,scale,file){const sharp=toolRequire('sharp');const h=g.length,w=g[0].length;const buf=Buffer.alloc(w*h*4);
 g.forEach((r,y)=>r.forEach((c,x)=>{if(!c)return;const o=(y*w+x)*4;buf[o]=c[0];buf[o+1]=c[1];buf[o+2]=c[2];buf[o+3]=c[3];}));
 let s=sharp(buf,{raw:{width:w,height:h,channels:4}});if(scale>1)s=s.resize(w*scale,h*scale,{kernel:'nearest'});await s.png({palette:true,compressionLevel:9,effort:10,colours:32,dither:0}).toFile(file);}
