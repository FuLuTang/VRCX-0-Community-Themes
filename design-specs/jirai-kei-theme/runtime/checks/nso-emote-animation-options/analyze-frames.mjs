import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const sourcePath = path.resolve(here, '../../../art-references/nso-fandom-desktop-icons-sheet.png');
const source = await sharp(sourcePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
if (source.info.width !== 1120 || source.info.height !== 700) throw new Error(`Unexpected reference dimensions: ${source.info.width}×${source.info.height}`);
const bg = [248, 240, 250];
const cell = { width: 120, height: 120, y: 430, x0: 290, stepX: 140 };
const frames = [];
for (let index = 0; index < 4; index += 1) {
  const bounds = { left: cell.x0 + index * cell.stepX, top: cell.y, width: cell.width, height: cell.height };
  const buffer = await sharp(sourcePath).extract(bounds).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = buffer.data;
  const width = buffer.info.width, height = buffer.info.height;
  const key = new Uint8Array(width * height);
  const isBg = (x, y) => {
    const i = (y * width + x) * 4;
    return pixels[i] === bg[0] && pixels[i+1] === bg[1] && pixels[i+2] === bg[2] && pixels[i+3] === 255;
  };
  const queue = [];
  const add = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (key[idx] || !isBg(x, y)) return;
    key[idx] = 1;
    queue.push([x, y]);
  };
  for (let x=0;x<width;x+=1){ add(x,0); add(x,height-1); }
  for (let y=0;y<height;y+=1){ add(0,y); add(width-1,y); }
  for (let i=0;i<queue.length;i+=1){
    const [x,y]=queue[i];
    add(x-1,y); add(x+1,y); add(x,y-1); add(x,y+1);
  }
  let removedBg=0, retainedBg=0;
  const rgba = Buffer.from(pixels);
  let minX=width,minY=height,maxX=-1,maxY=-1,opaque=0;
  const colors = new Set();
  for (let y=0;y<height;y+=1){
    for(let x=0;x<width;x+=1){
      const idx=y*width+x, i=idx*4;
      const background= isBg(x,y);
      if (background && key[idx]) { rgba[i]=0; rgba[i+1]=0; rgba[i+2]=0; rgba[i+3]=0; removedBg++; continue; }
      if (background && !key[idx]) retainedBg++;
      if (rgba[i+3]===0) continue;
      opaque++; minX=Math.min(minX,x); minY=Math.min(minY,y); maxX=Math.max(maxX,x); maxY=Math.max(maxY,y);
      colors.add(`${rgba[i]},${rgba[i+1]},${rgba[i+2]},${rgba[i+3]}`);
    }
  }
  const png = await sharp(rgba,{raw:{width,height,channels:4}}).png({compressionLevel:9}).toBuffer();
  const framePath = path.join(here,`frame-${index+1}.png`);
  await fs.writeFile(framePath,png);
  frames.push({index:index+1,bounds,framePath,contentBounds:{left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1},opaquePixels:opaque,uniqueRgbaColors:colors.size,backgroundKeyPixelsRemoved:removedBg,enclosedExactBackgroundPixelsRetained:retainedBg,pngBytes:png.length,buffer:png});
}

// The four source cells share an aligned crop. Compare opaque silhouettes after edge-keying;
// this is evidence of a shared character, not proof that the sheet intended an animation.
const rawFrames=[];
for(const frame of frames){rawFrames.push(await sharp(frame.buffer).ensureAlpha().raw().toBuffer());}
let intersection=0,union=0,allFramesEqual=0;
for(let i=0;i<cell.width*cell.height;i+=1){
  const alphas=rawFrames.map(data=>data[i*4+3]>0);
  if(alphas.every(Boolean))intersection++;
  if(alphas.some(Boolean))union++;
  if(rawFrames.every(data=>data[i*4]===rawFrames[0][i*4]&&data[i*4+1]===rawFrames[0][i*4+1]&&data[i*4+2]===rawFrames[0][i*4+2]&&data[i*4+3]===rawFrames[0][i*4+3]))allFramesEqual++;
}
const pairwiseEqualityToFirst=rawFrames.map(data=>{
  let same=0;
  for(let i=0;i<cell.width*cell.height;i+=1){const a=i*4;if(data[a]===rawFrames[0][a]&&data[a+1]===rawFrames[0][a+1]&&data[a+2]===rawFrames[0][a+2]&&data[a+3]===rawFrames[0][a+3])same++;}
  return Number((same/(cell.width*cell.height)).toFixed(4));
});
const frameBuffers=frames.map(f=>f.buffer);
const scaled=await Promise.all(frameBuffers.map(buf=>sharp(buf).resize(480,480,{kernel:'nearest'}).png().toBuffer()));
const contact = await sharp({create:{width:1920,height:504,channels:4,background:'#16112a'}})
  .composite([
    ...scaled.map((input,index)=>({input,left:index*480,top:24})),
    {input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="24"><rect width="1920" height="24" fill="#100c1b"/><text x="8" y="16" fill="#fdf4ff" font-family="monospace" font-size="11">INTERNAL PREVIEW · 4 SOURCE CELLS · 4× NEAREST · LEFT→RIGHT ORDER · 120×120 EACH</text></svg>`),left:0,top:0}
  ]).png().toBuffer();
const contactPath=path.join(here,'frame-contact-4x.png');
await fs.writeFile(contactPath,contact);
const report={source:{path:sourcePath,width:source.info.width,height:source.info.height,backgroundRgb:bg,license:'Not established by the local reference; internal preview only, no integration or public distribution without user authorization.'},selection:{row:'second-to-last icon row',cellGrid:'120×120 cells on a 140px horizontal cadence',bounds:frames.map(f=>({index:f.index,...f.bounds})),order:'left-to-right as found in the sheet',visualEvidence:'All four cells contain the same laptop-cat silhouette and share an aligned 96×80 non-background content bounding box; the adjacent hand/prop and reaction glyphs differ. This supports a same-character four-state sample, but the source does not establish that these are animation frames or reveal their intended timing.'},backgroundRemoval:{method:'Only exact #f8f0fa pixels 4-connected to each 120×120 crop edge are made transparent; enclosed equal-color pixels are retained as possible art highlights.',frames:frames.map(f=>({index:f.index,removed:f.backgroundKeyPixelsRemoved,retainedEnclosed:f.enclosedExactBackgroundPixelsRetained}))},alignment:{frameContentBounds:frames.map(f=>f.contentBounds),opaqueSilhouetteIntersectionOverUnion:Number((intersection/union).toFixed(4)),pairwisePixelEqualityToFrame1:pairwiseEqualityToFirst,allFramesPixelAgreement:Number((allFramesEqual/(cell.width*cell.height)).toFixed(4))},frameFiles:frames.map(({index,framePath,contentBounds,opaquePixels,uniqueRgbaColors,pngBytes})=>({index,framePath,contentBounds,opaquePixels,uniqueRgbaColors,pngBytes})),contactPath,contactDimensions:[1920,504]};
await fs.writeFile(path.join(here,'source-analysis.json'),`${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify(report,null,2));
