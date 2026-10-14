import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const width = 120, height = 120, frameCount = 4, frameDelayMs = 250, loop = 0;
const framePaths = Array.from({length:frameCount},(_,i)=>path.join(here,`frame-${i+1}.png`));
const frames = [];
for(const file of framePaths){
  const image=sharp(file).ensureAlpha();
  const meta=await image.metadata();
  if(meta.width!==width||meta.height!==height)throw new Error(`Frame must be ${width}×${height}: ${file} ${meta.width}×${meta.height}`);
  frames.push(await image.raw().toBuffer());
}
const rgbaFrames=frames.map(buf=>({buf,width,height,channels:4}));
const colors=new Map([['0,0,0,0',0]]);
for(const frame of frames){for(let i=0;i<frame.length;i+=4){if(frame[i+3]===0)continue;const key=`${frame[i]},${frame[i+1]},${frame[i+2]},255`;if(!colors.has(key))colors.set(key,colors.size);}}
if(colors.size>256)throw new Error(`Indexed PNG palette exceeds 256 colors: ${colors.size}`);
const palette=[...colors.keys()].sort((a,b)=>colors.get(a)-colors.get(b)).map(key=>key.split(',').map(Number));
const paletteIndex=new Map([...colors.entries()].map(([key,index])=>[key,index]));
const encodeRow=(frame,y,leftOffset=0,totalWidth=width)=>{
  const row=Buffer.alloc(totalWidth+1); row[0]=0; // PNG filter 0: exact pixels, no resampling.
  for(let x=0;x<width;x+=1){const i=(y*width+x)*4;const alpha=frame[i+3];const key=alpha===0?'0,0,0,0':`${frame[i]},${frame[i+1]},${frame[i+2]},255`;row[1+leftOffset+x]=paletteIndex.get(key);}
  return row;
};
const deflateRows=(rowBuffers)=>{
  // Node's built-in zlib avoids adding codec dependencies to this internal-only check.
  return import('node:zlib').then(({deflateSync})=>deflateSync(Buffer.concat(rowBuffers),{level:9}));
};
const crcTable=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
const crc32=buffer=>{let crc=0xffffffff;for(const byte of buffer)crc=crcTable[(crc^byte)&0xff]^(crc>>>8);return (crc^0xffffffff)>>>0;};
const pngChunk=(type,data)=>{const typeBuf=Buffer.from(type,'ascii'),len=Buffer.alloc(4),crc=Buffer.alloc(4);len.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([typeBuf,data])));return Buffer.concat([len,typeBuf,data,crc]);};
const pngSignature=Buffer.from([137,80,78,71,13,10,26,10]);
const ihdr=(w,h,colorType=3)=>{const b=Buffer.alloc(13);b.writeUInt32BE(w,0);b.writeUInt32BE(h,4);b[8]=8;b[9]=colorType;b[10]=0;b[11]=0;b[12]=0;return pngChunk('IHDR',b);};
const plte=pngChunk('PLTE',Buffer.from(palette.flatMap(c=>c.slice(0,3))));
const trns=pngChunk('tRNS',Buffer.from(palette.map(c=>c[3])));
const paletteChunks=[plte,trns];
const makeIndexedPng=async(w,h,rows)=>Buffer.concat([pngSignature,ihdr(w,h,3),...paletteChunks,pngChunk('IDAT',await deflateRows(rows)),pngChunk('IEND',Buffer.alloc(0))]);

// CSS-controlled PNG strip, matching the current theme's horizontal palette-PNG + steps model.
const spriteRows=[];
for(let y=0;y<height;y+=1){
  const row=Buffer.alloc(width*frameCount+1);row[0]=0;
  for(let f=0;f<frameCount;f+=1){
    const frame=frames[f];
    for(let x=0;x<width;x+=1){const i=(y*width+x)*4;const key=frame[i+3]===0?'0,0,0,0':`${frame[i]},${frame[i+1]},${frame[i+2]},255`;row[1+f*width+x]=paletteIndex.get(key);}
  }
  spriteRows.push(row);
}
const pngSprite=await makeIndexedPng(width*frameCount,height,spriteRows);
const pngSpritePath=path.join(here,'sprite-4frame-palette.png');await fs.writeFile(pngSpritePath,pngSprite);

// APNG: one shared indexed palette, four full-canvas lossless frames, 250ms/frame, infinite loop.
const apngChunks=[ihdr(width,height,3),...paletteChunks];
const actl=Buffer.alloc(8);actl.writeUInt32BE(frameCount,0);actl.writeUInt32BE(loop,4);apngChunks.push(pngChunk('acTL',actl));
let sequence=0;
const apngCompressed=[];
for(let f=0;f<frameCount;f+=1){
  const fctl=Buffer.alloc(26);fctl.writeUInt32BE(sequence++,0);fctl.writeUInt32BE(width,4);fctl.writeUInt32BE(height,8);fctl.writeUInt32BE(0,12);fctl.writeUInt32BE(0,16);fctl.writeUInt16BE(frameDelayMs,20);fctl.writeUInt16BE(1000,22);fctl[24]=0;fctl[25]=0;
  apngChunks.push(pngChunk('fcTL',fctl));
  const compressed=await deflateRows(Array.from({length:height},(_,y)=>encodeRow(frames[f],y)));
  apngCompressed.push(compressed);
  if(f===0)apngChunks.push(pngChunk('IDAT',compressed));
  else {const fd=Buffer.alloc(4+compressed.length);fd.writeUInt32BE(sequence++,0);compressed.copy(fd,4);apngChunks.push(pngChunk('fdAT',fd));}
}
apngChunks.push(pngChunk('IEND',Buffer.alloc(0)));
const apng=Buffer.concat([pngSignature,...apngChunks]);
const apngPath=path.join(here,'animation-4frame-250ms.apng');await fs.writeFile(apngPath,apng);

// Encode each source frame as a lossless WebP, then wrap the VP8L frame payloads in an
// animated WebP RIFF container (libwebp CLI tools are not installed on this host).
const staticWebps=await Promise.all(framePaths.map(file=>sharp(file).webp({lossless:true,quality:100,effort:6,exact:true}).toBuffer()));
function riffChunks(buffer){const chunks=[];let pos=12;while(pos+8<=buffer.length){const type=buffer.toString('ascii',pos,pos+4),len=buffer.readUInt32LE(pos+4),start=pos+8,end=start+len;if(end>buffer.length)throw new Error('Truncated WebP chunk');chunks.push({type,data:buffer.subarray(start,end)});pos=end+(len&1);}return chunks;}
const webpImageChunks=staticWebps.map((buffer,index)=>{if(buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WEBP')throw new Error(`Frame ${index+1} is not WebP`);const chunks=riffChunks(buffer);const image=chunks.filter(c=>['VP8L','VP8 ','ALPH'].includes(c.type));if(!image.some(c=>c.type==='VP8L'||c.type==='VP8 '))throw new Error(`No VP8/VP8L frame payload: ${chunks.map(c=>c.type)}`);return image;});
const webpChunk=(type,data)=>{const header=Buffer.alloc(8);header.write(type,0,'ascii');header.writeUInt32LE(data.length,4);return Buffer.concat([header,data,data.length&1?Buffer.from([0]):Buffer.alloc(0)]);};
const le24=value=>Buffer.from([value&255,(value>>>8)&255,(value>>>16)&255]);
const vp8x=Buffer.alloc(10);vp8x[0]=0x12;vp8x.writeUIntLE(width-1,4,3);vp8x.writeUIntLE(height-1,7,3);
const anim=Buffer.alloc(6);anim.writeUInt32LE(0,0);anim.writeUInt16LE(loop,4);
const webpFrameChunks=[];
for(let i=0;i<frameCount;i+=1){
  const header=Buffer.concat([le24(0),le24(0),le24(width-1),le24(height-1),le24(frameDelayMs),Buffer.from([2])]); // full-canvas replace, no disposal
  const payload=Buffer.concat(webpImageChunks[i].map(c=>webpChunk(c.type,c.data)));
  webpFrameChunks.push(webpChunk('ANMF',Buffer.concat([header,payload])));
}
const webpBody=Buffer.concat([Buffer.from('WEBP'),webpChunk('VP8X',vp8x),webpChunk('ANIM',anim),...webpFrameChunks]);
const animatedWebp=Buffer.alloc(8+webpBody.length);animatedWebp.write('RIFF',0,'ascii');animatedWebp.writeUInt32LE(webpBody.length,4);webpBody.copy(animatedWebp,8);
const webpPath=path.join(here,'animation-4frame-250ms.webp');await fs.writeFile(webpPath,animatedWebp);
const webpMeta=await sharp(animatedWebp,{animated:true}).metadata();
if(webpMeta.pages!==frameCount||webpMeta.pageHeight!==height)throw new Error(`Animated WebP container invalid: ${JSON.stringify({pages:webpMeta.pages,pageHeight:webpMeta.pageHeight,delay:webpMeta.delay})}`);

function vectorPaths(frame){
  const {buf}=frame;const paths=new Map();
  for(let y=0;y<height;y+=1){let x=0;while(x<width){let i=(y*width+x)*4;if(buf[i+3]===0){x+=1;continue;}const color=`#${[buf[i],buf[i+1],buf[i+2]].map(v=>v.toString(16).padStart(2,'0')).join('')}`;const start=x;x+=1;while(x<width){i=(y*width+x)*4;const next=buf[i+3]===0?null:`#${[buf[i],buf[i+1],buf[i+2]].map(v=>v.toString(16).padStart(2,'0')).join('')}`;if(next!==color)break;x+=1;}if(!paths.has(color))paths.set(color,[]);paths.get(color).push(`M${start} ${y}h${x-start}v1h-${x-start}z`);}}
  return `<g>${[...paths.entries()].map(([color,runs])=>`<path fill="${color}" d="${runs.join('')}"/>`).join('')}</g>`;
}
const vectorGroups=rgbaFrames.map(vectorPaths);
const svgSprite=`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="120" viewBox="0 0 480 120" shape-rendering="crispEdges">${vectorGroups.map((g,i)=>`<g transform="translate(${i*width} 0)">${g.slice(3,-4)}</g>`).join('')}</svg>`;
const svgSpritePath=path.join(here,'sprite-4frame.svg');await fs.writeFile(svgSpritePath,`${svgSprite}\n`);
const keyTimes='0;0.25;0.5;0.75;1';
const animatedSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" shape-rendering="crispEdges">${vectorGroups.map((g,i)=>{const values=Array.from({length:5},(_,j)=>(j===i||(i===0&&j===4))?'1':'0').join(';');return `<g opacity="${i===0?1:0}">${g.slice(3,-4)}<animate attributeName="opacity" dur="1s" repeatCount="indefinite" calcMode="discrete" keyTimes="${keyTimes}" values="${values}"/></g>`;}).join('')}</svg>`;
const animatedSvgPath=path.join(here,'animation-4frame-250ms.svg');await fs.writeFile(animatedSvgPath,`${animatedSvg}\n`);

const dataUri=(mime,buffer)=>`data:${mime};base64,${buffer.toString('base64')}`;
const svgDataUri=svg=>`data:image/svg+xml,${encodeURIComponent(svg)}`;
const uris={png:dataUri('image/png',pngSprite),apng:dataUri('image/png',apng),webp:dataUri('image/webp',animatedWebp),svg:svgDataUri(animatedSvg),svgSprite:svgDataUri(svgSprite)};

// Strict RGBA equivalence checks. Transparent RGB was normalized to zero during keying,
// so every channel (including alpha) should match each source crop exactly.
const diffRgba=(actual,expected)=>{
  let mismatchPixels=0,channelMismatches=0,alphaMismatches=0;
  for(let i=0;i<expected.length;i+=4){let pixelDiff=false;for(let c=0;c<4;c++)if(actual[i+c]!==expected[i+c]){pixelDiff=true;channelMismatches++;if(c===3)alphaMismatches++;}if(pixelDiff)mismatchPixels++;}
  return {pixelsCompared:expected.length/4,mismatchPixels,channelMismatches,alphaMismatches,exact:mismatchPixels===0};
};
const getSpriteFrames=({data,info})=>{
  if(info.width!==width*frameCount||info.height!==height||info.channels!==4)throw new Error(`Unexpected PNG/SVG sprite decode: ${JSON.stringify(info)}`);
  return Array.from({length:frameCount},(_,f)=>{const frame=Buffer.alloc(width*height*4);for(let y=0;y<height;y++)for(let x=0;x<width;x++){const src=(y*info.width+f*width+x)*4,dst=(y*width+x)*4;data.copy(frame,dst,src,src+4);}return frame;});
};
const pngDecoded=await sharp(pngSprite).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const pngFrameChecks=getSpriteFrames(pngDecoded).map((actual,i)=>({frame:i+1,...diffRgba(actual,frames[i])}));
const readPngChunks=buffer=>{const chunks=[];let pos=8;while(pos+12<=buffer.length){const len=buffer.readUInt32BE(pos),type=buffer.toString('ascii',pos+4,pos+8),data=buffer.subarray(pos+8,pos+8+len);chunks.push({type,data});pos+=12+len;if(type==='IEND')break;}if(pos!==buffer.length)throw new Error('Malformed PNG/APNG chunk stream');return chunks;};
const apngRecords=readPngChunks(apng),apngPalette=apngRecords.find(c=>c.type==='PLTE')?.data,apngAlpha=apngRecords.find(c=>c.type==='tRNS')?.data;
const apngFrames=[];let activeApngFrame=null;
for(const chunk of apngRecords){if(chunk.type==='fcTL'){activeApngFrame={compressed:[]};apngFrames.push(activeApngFrame);}else if(chunk.type==='IDAT'&&activeApngFrame)activeApngFrame.compressed.push(chunk.data);else if(chunk.type==='fdAT'&&activeApngFrame)activeApngFrame.compressed.push(chunk.data.subarray(4));}
const {inflateSync}=await import('node:zlib');
const apngDecodedFrames=apngFrames.map(frame=>{const raw=inflateSync(Buffer.concat(frame.compressed));const rgba=Buffer.alloc(width*height*4);for(let y=0;y<height;y++){const row=y*(width+1);if(raw[row]!==0)throw new Error(`Unexpected APNG filter ${raw[row]}`);for(let x=0;x<width;x++){const index=raw[row+1+x],dst=(y*width+x)*4;rgba[dst]=apngPalette[index*3];rgba[dst+1]=apngPalette[index*3+1];rgba[dst+2]=apngPalette[index*3+2];rgba[dst+3]=apngAlpha[index]??255;}}return rgba;});
if(apngDecodedFrames.length!==frameCount)throw new Error(`APNG frame count mismatch: ${apngDecodedFrames.length}`);
const apngFrameChecks=apngDecodedFrames.map((actual,i)=>({frame:i+1,...diffRgba(actual,frames[i])}));
const webpDecoded=await sharp(animatedWebp,{animated:true}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
if(webpDecoded.info.width!==width||webpDecoded.info.height!==height*frameCount||webpDecoded.info.channels!==4)throw new Error(`Unexpected animated WebP raw decode: ${JSON.stringify(webpDecoded.info)}`);
const webpFrameChecks=Array.from({length:frameCount},(_,f)=>{const frame=Buffer.alloc(width*height*4);webpDecoded.data.copy(frame,0,f*width*height*4,(f+1)*width*height*4);return {frame:f+1,...diffRgba(frame,frames[f])};});
const svgDecoded=await sharp(Buffer.from(svgSprite)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const svgFrameChecks=getSpriteFrames(svgDecoded).map((actual,i)=>({frame:i+1,...diffRgba(actual,frames[i])}));
const pixelComparisons={pngSprite:pngFrameChecks,apng:apngFrameChecks,animatedWebp:webpFrameChecks,svgSprite:svgFrameChecks};
for(const [format,checks] of Object.entries(pixelComparisons))if(checks.some(check=>!check.exact))throw new Error(`${format} differs from the source RGBA frames: ${JSON.stringify(checks)}`);

const previewHtml=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Internal · four emote format comparison</title><style>
*{box-sizing:border-box}body{margin:0;background:#100c1b;color:#fdf4ff;font:13px/1.45 ui-monospace,monospace;padding:20px}.note{max-width:940px;color:#cdb0e8;margin:0 0 16px}.grid{display:grid;grid-template-columns:repeat(4,180px);gap:12px}.card{background:#201936;border:1px solid #4b3a63;padding:10px}.card h2{font-size:11px;min-height:30px;margin:0 0 8px;color:#f3add9}.player{width:120px;height:120px;margin:0 auto 8px;background-repeat:no-repeat;background-position:0 0;image-rendering:pixelated}.png{background-image:url('${uris.png}');background-size:480px 120px;animation:frames 1s steps(4,end) infinite}.svg-sheet{background-image:url('${uris.svgSprite}');background-size:480px 120px;animation:frames 1s steps(4,end) infinite}.auto{display:block;width:120px;height:120px;object-fit:contain;image-rendering:pixelated;margin:0 auto 8px}.label{font-size:10px;color:#cdb0e8}.warning{margin-top:16px;padding:10px;border:1px solid #7a3f6d;color:#f8c6e3}.legend{color:#fdf4ff;margin-top:14px}@keyframes frames{to{background-position:-480px 0}}@media(prefers-reduced-motion:reduce){.png,.svg-sheet{animation:none!important;background-position:0 0!important}.auto{visibility:hidden}.card:nth-child(2)::after,.card:nth-child(3)::after{content:'Auto-play; CSS cannot pause';display:block;color:#ffb8e6;font-size:9px}.card:nth-child(4)::after{content:'SMIL auto-play';display:block;color:#ffb8e6;font-size:9px}}
</style><h1>INTERNAL PREVIEW · four aligned source cells · 120×120 px each</h1><p class="note">Left-to-right sheet order, 250 ms per frame / 4 fps / infinite loop are comparison settings only—not source timing or a claim that the reference sheet is a complete animation. Transparent backgrounds are keyed from the flat sheet canvas.</p><main class="grid"><section class="card"><h2>PNG sprite · CSS steps</h2><div class="player png" aria-label="PNG CSS sprite preview"></div><div class="label">palette PNG 480×120<br>CSS-controlled / can freeze</div></section><section class="card"><h2>APNG · 4 frames</h2><img class="auto" src="${uris.apng}" alt="APNG preview"><div class="label">120×120 · 250 ms/frame<br>auto-play / full canvas</div></section><section class="card"><h2>Animated WebP · lossless</h2><img class="auto" src="${uris.webp}" alt="animated WebP preview"><div class="label">120×120 · 250 ms/frame<br>auto-play / VP8L</div></section><section class="card"><h2>SVG SMIL · pixel runs</h2><img class="auto" src="${uris.svg}" alt="SVG SMIL preview"><div class="label">120×120 · vector exact<br>auto-play / SMIL</div></section></main><div class="legend">Source crop: second-to-last row, cells x=290/430/570/710, y=430, 120×120. Content bounds align at 96×80. Opaque silhouette IoU across all four crops: 0.7863.</div><div class="warning">Internal preview only · source attribution/license is unknown. Do not integrate or publicly redistribute without user authorization. Suggested UI placements and motion cautions are in README.md.</div></html>`;
const previewHtmlPath=path.join(here,'format-preview.html');await fs.writeFile(previewHtmlPath,previewHtml);
const browser=await chromium.launch({headless:true});let previewInfo;
try{
  const page=await browser.newPage({viewport:{width:1180,height:520},deviceScaleFactor:1,reducedMotion:'no-preference'});
  await page.setContent(previewHtml,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth===120),null,{timeout:15000});
  const selectors=[['pngSprite','.png'],['apng','img[alt="APNG preview"]'],['animatedWebp','img[alt="animated WebP preview"]'],['svgSmil','img[alt="SVG SMIL preview"]']];
  const sampleHashes=Object.fromEntries(selectors.map(([name])=>[name,[]]));
  for(let sample=0;sample<15;sample++){
    await page.waitForTimeout(100);
    const shots=await Promise.all(selectors.map(async([name,selector])=>[name,await page.locator(selector).screenshot({animations:'allow'})]));
    for(const[name,buffer]of shots)sampleHashes[name].push(createHash('sha256').update(buffer).digest('hex').slice(0,16));
  }
  const playbackChecks=Object.fromEntries(Object.entries(sampleHashes).map(([name,hashes])=>[name,{samples:hashes.length,uniqueFrames:new Set(hashes).size,changedDuringCapture:new Set(hashes).size>1}]));
  if(Object.values(playbackChecks).some(check=>check.uniqueFrames<4))throw new Error(`A preview format did not expose all four distinct frames over timed captures: ${JSON.stringify(playbackChecks)}`);
  await page.waitForTimeout(120);
  previewInfo=await page.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,imgs:[...document.images].map(img=>({alt:img.alt,w:img.naturalWidth,h:img.naturalHeight,complete:img.complete})),spriteBackgrounds:[...document.querySelectorAll('.png,.svg-sheet')].map(el=>({size:getComputedStyle(el).backgroundSize,position:getComputedStyle(el).backgroundPosition,animation:getComputedStyle(el).animationName}))}));
  previewInfo.playbackChecks=playbackChecks;
  if(previewInfo.width>2000||previewInfo.height>2000||previewInfo.imgs.some(img=>img.w!==120||img.h!==120))throw new Error(`Preview dimensions/decoding invalid: ${JSON.stringify(previewInfo)}`);
  const previewPng=path.join(here,'format-preview.png');await page.screenshot({path:previewPng,fullPage:true,scale:'css'});
  previewInfo.path=previewPng;
  await page.close();
}finally{await browser.close();}

const metadata={
  preview:{animationOrder:'left→right',frames:frameCount,frameDelayMs,totalLoopMs:frameCount*frameDelayMs,loop:'infinite in preview only',sourceSequence:'not established',previewHtml:previewHtmlPath,screenshot:previewInfo},
  frame:{width,height,contentBounds:'96×80 at x=12,y=20 in each 120×120 crop',resize:'none; preserve source pixel grid',colorsIncludingTransparency:palette.length},
  formats:[
    {format:'PNG sprite + CSS steps',file:path.basename(pngSpritePath),bytes:pngSprite.length,dataUriMime:'image/png',dataUriChars:uris.png.length,canvas:'480×120',animation:'host CSS steps(4,end), 250 ms/frame',lossless:true,displaySize:'120×120 native; image-rendering:pixelated'},
    {format:'APNG',file:path.basename(apngPath),bytes:apng.length,dataUriMime:'image/png (APNG chunks)',dataUriChars:uris.apng.length,canvas:'120×120',frames:frameCount,delayMs:Array(frameCount).fill(frameDelayMs),loop:'infinite',lossless:true,encoding:'indexed PNG with shared palette'},
    {format:'Animated WebP',file:path.basename(webpPath),bytes:animatedWebp.length,dataUriMime:'image/webp',dataUriChars:uris.webp.length,canvas:'120×120',frames:webpMeta.pages,delayMs:webpMeta.delay,loop:webpMeta.loop,lossless:true,encoding:'VP8L lossless per full-canvas frame',metadata:{pages:webpMeta.pages,pageHeight:webpMeta.pageHeight,delay:webpMeta.delay,loop:webpMeta.loop}},
    {format:'SVG SMIL',file:path.basename(animatedSvgPath),bytes:Buffer.byteLength(animatedSvg),dataUriMime:'image/svg+xml percent-encoded',dataUriChars:uris.svg.length,canvas:'120×120',frames:frameCount,delayMs:frameDelayMs,loop:'infinite',lossless:true,encoding:'integer pixel-run vector paths; SMIL opacity steps'},
    {format:'SVG sprite + CSS steps',file:path.basename(svgSpritePath),bytes:Buffer.byteLength(svgSprite),dataUriMime:'image/svg+xml percent-encoded',dataUriChars:uris.svgSprite.length,canvas:'480×120',frames:frameCount,lossless:true,animation:'host CSS steps(4,end)'}
  ],
  pixelFidelity:{pngSprite:'indexed PNG generated from the exact shared palette',apng:'same palette-index pixels, transparent index 0',webp:'VP8L lossless; decoder reports 4 frames',svg:'one crispEdges rect-run per solid row-color run',resampling:'none',rgbaComparisons:pixelComparisons,allFramesExact: Object.values(pixelComparisons).every(checks=>checks.every(check=>check.exact))},
  notes:{existingPipeline:'runtime/tools/build-loader-sprite.mjs + loader-r9.css use a horizontal PNG sprite sheet, palette compression, CSS steps(N,end), pixelated rendering, and reduced-motion freeze. This sample mirrors that control model for PNG/SVG sprite candidates while retaining native 120×120 pixel art (no Lanczos resize).',autoplay:'APNG, WebP and SMIL auto-play as image formats; an ordinary CSS animation:none does not freeze them. A production feature would need a static reduced-motion fallback or explicit playback control.',sourceRights:'The local reference sheet does not establish attribution/license. Internal preview only; do not integrate or publicly redistribute without user authorization.'},
  generatedFiles:{pngSprite:pngSpritePath,apng:apngPath,webp:webpPath,svgSprite:svgSpritePath,animatedSvg:animatedSvgPath}
};
const reportPath=path.join(here,'format-report.json');await fs.writeFile(reportPath,`${JSON.stringify(metadata,null,2)}\n`);
console.log(JSON.stringify({files:metadata.generatedFiles,formats:metadata.formats.map(({format,file,bytes,dataUriChars,canvas,frames,delayMs})=>({format,file,bytes,dataUriChars,canvas,frames,delayMs})),preview:metadata.preview,reportPath},null,2));
