/* Internal-only source-sprite extraction, pixel-outline, alpha, and preview checks. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const checksDir = path.dirname(fileURLToPath(import.meta.url));
const themeRoot = path.resolve(checksDir, '../../..');
const assetDir = path.join(themeRoot, 'original-assets/r10-status-toast-icons');
const previousReportPath = path.join(checksDir, 'pixel-alpha-report.json');
const previousReport = JSON.parse(await fs.readFile(previousReportPath, 'utf8'));
const sourcePath = path.join(themeRoot, 'art-references/nso-fandom-desktop-icons-sheet.png');
const sourcePixelScale = 4;
const sourceBackground = '#f8f0fa';
const successColor = '#2ed319';
const errorColor = '#ff6b8a';
const toastSurface = '#211a33';
const sourceRegions = {
  phone: { x: 302, y: 450, width: 96, height: 80, label: 'phone pose' },
  'heart-happy': { x: 442, y: 450, width: 96, height: 80, label: 'heart-happy pose' },
  'awkward-lines': { x: 722, y: 450, width: 96, height: 80, label: 'awkward-lines pose plus accent bars' }
};
const shockExcluded = { x: 582, y: 450, width: 96, height: 80, reason: 'yellow shocked pose; user has not assigned it a use' };
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const hexOf = (data, i) => `#${[0,1,2].map((k) => data[i+k].toString(16).padStart(2,'0')).join('')}`;
const sourceBuffer = await fs.readFile(sourcePath);
const sourceSha256 = createHash('sha256').update(sourceBuffer).digest('hex');
const sourceMeta = await sharp(sourceBuffer).metadata();
assert(sourceMeta.width === 1120 && sourceMeta.height === 700 && sourceMeta.channels === 3 && !sourceMeta.hasAlpha, 'Unexpected source-sheet metadata');
const { data: sourceRaw, info: sourceInfo } = await sharp(sourceBuffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const sourceSample = (x,y) => hexOf(sourceRaw, (y*sourceInfo.width+x)*3);
assert(sourceSample(0,0) === sourceBackground, `Expected uniform source backdrop ${sourceBackground}, found ${sourceSample(0,0)}`);

function componentsInRegion(region) {
  const { x,y,width,height } = region;
  const mask = new Uint8Array(width*height);
  for (let py=0; py<height; py++) for(let px=0; px<width; px++) mask[py*width+px] = sourceSample(x+px,y+py) === sourceBackground ? 0 : 1;
  const seen = new Uint8Array(mask.length), components=[];
  for(let i=0;i<mask.length;i++){
    if(!mask[i]||seen[i]) continue;
    const queue=[i];seen[i]=1;let minX=width,maxX=-1,minY=height,maxY=-1,area=0;
    for(let q=0;q<queue.length;q++){
      const p=queue[q],px=p%width,py=(p-px)/width;area++;
      minX=Math.min(minX,px);maxX=Math.max(maxX,px);minY=Math.min(minY,py);maxY=Math.max(maxY,py);
      for(const n of [px>0?p-1:-1,px+1<width?p+1:-1,py>0?p-width:-1,py+1<height?p+width:-1]) if(n>=0&&mask[n]&&!seen[n]){seen[n]=1;queue.push(n)}
    }
    components.push({x:x+minX,y:y+minY,width:maxX-minX+1,height:maxY-minY+1,area});
  }
  return components.sort((a,b)=>a.x-b.x||a.y-b.y);
}
const componentEvidence = {
  phone: componentsInRegion({x:280,y:430,width:140,height:120}),
  'heart-happy': componentsInRegion({x:420,y:430,width:140,height:120}),
  'awkward-lines': componentsInRegion({x:700,y:430,width:140,height:120}),
  'yellow-shock-excluded': componentsInRegion({x:560,y:430,width:140,height:120})
};
assert(JSON.stringify(componentEvidence.phone.map(({x,y,width,height})=>({x,y,width,height}))) === JSON.stringify([{x:302,y:450,width:96,height:80}]), 'Phone crop bbox does not match source foreground');
assert(JSON.stringify(componentEvidence['heart-happy'].map(({x,y,width,height})=>({x,y,width,height}))) === JSON.stringify([{x:442,y:450,width:96,height:80}]), 'Heart-happy crop bbox does not match source foreground');
const awkwardBoxes=componentEvidence['awkward-lines'].map(({x,y,width,height})=>({x,y,width,height}));
assert(JSON.stringify(awkwardBoxes) === JSON.stringify([{x:722,y:450,width:80,height:80},{x:806,y:462,width:4,height:24},{x:814,y:466,width:4,height:24}]), `Awkward character/accent component boxes changed: ${JSON.stringify(awkwardBoxes)}`);

function extractCellGrid(region) {
  assert(region.x % sourcePixelScale === 2 && region.y % sourcePixelScale === 2, 'Crop is not aligned to the 4x source-cell lattice');
  assert(region.width % sourcePixelScale === 0 && region.height % sourcePixelScale === 0, 'Crop dimensions must be integer grid cells');
  const width=region.width/sourcePixelScale,height=region.height/sourcePixelScale,rows=[];
  const colorCounts={};
  for(let gy=0;gy<height;gy++){
    const row=[];
    for(let gx=0;gx<width;gx++){
      const colors=new Set();
      for(let dy=0;dy<sourcePixelScale;dy++)for(let dx=0;dx<sourcePixelScale;dx++)colors.add(sourceSample(region.x+gx*sourcePixelScale+dx,region.y+gy*sourcePixelScale+dy));
      assert(colors.size===1,`Mixed colors within source logical pixel at ${region.x+gx*sourcePixelScale},${region.y+gy*sourcePixelScale}: ${[...colors]}`);
      const color=[...colors][0];row.push(color===sourceBackground?null:color);
      if(color!==sourceBackground)colorCounts[color]=(colorCounts[color]||0)+1;
    }
    rows.push(row);
  }
  // A flat source-background cell may be keyed to transparency only when connected to crop exterior.
  const nulls=new Set();for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(rows[y][x]===null)nulls.add(y*width+x);
  const queue=[];for(let x=0;x<width;x++)for(const y of [0,height-1]){const p=y*width+x;if(nulls.has(p))queue.push(p)}for(let y=0;y<height;y++)for(const x of [0,width-1]){const p=y*width+x;if(nulls.has(p))queue.push(p)}
  const reached=new Set(queue);for(let i=0;i<queue.length;i++){const p=queue[i],x=p%width,y=(p-x)/width;for(const n of [x>0?p-1:-1,x+1<width?p+1:-1,y>0?p-width:-1,y+1<height?p+width:-1])if(n>=0&&nulls.has(n)&&!reached.has(n)){reached.add(n);queue.push(n)}}
  assert(reached.size===nulls.size,`An enclosed source-background cell is present in crop ${region.x},${region.y}; do not key it without review`);
  assert(rows.some((r)=>r.some((c)=>c!==null)),'Crop contains no foreground');
  assert(rows[0].some((c)=>c!==null)&&rows[height-1].some((c)=>c!==null),'Crop seems padded at top/bottom');
  assert(rows.some((r)=>r[0]!==null)&&rows.some((r)=>r[width-1]!==null),'Crop seems padded at left/right');
  return {width,height,rows,colorCounts,transparentCells:nulls.size,opaqueCells:width*height-nulls.size};
}
const sourceGrids=Object.fromEntries(Object.entries(sourceRegions).map(([name,region])=>[name,extractCellGrid(region)]));
const sourceColors=[...new Set(Object.values(sourceGrids).flatMap(({rows})=>rows.flat()).filter(Boolean))].sort();
assert(!sourceColors.includes(successColor)&&!sourceColors.includes(errorColor),'Outline color must not be confused with a source color');
const allColors=[...new Set([...sourceColors,successColor,errorColor])];
const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
assert(allColors.length<chars.length,'Need more legend characters');
const codeByColor=Object.fromEntries(allColors.map((color,i)=>[color,chars[i]]));
const colorByCode=Object.fromEntries(allColors.map((color,i)=>[chars[i],color]));
function addTouchingOutline(grid,color){
  const width=grid.width+2,height=grid.height+2,out=Array.from({length:height},()=>Array(width).fill(null));
  for(let y=0;y<grid.height;y++)for(let x=0;x<grid.width;x++)if(grid.rows[y][x]!==null)out[y+1][x+1]=grid.rows[y][x];
  let outlineCells=0;
  for(let y=0;y<grid.height;y++)for(let x=0;x<grid.width;x++)if(grid.rows[y][x]!==null){
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      if(dx===0&&dy===0)continue;
      const ox=x+1+dx,oy=y+1+dy;
      if(out[oy][ox]===null){out[oy][ox]=color;outlineCells++}
    }
  }
  assert(out.flat().filter((c)=>c===color).length===outlineCells&&outlineCells>0,`Touching outline missing for ${color}`);
  return {width,height,rows:out,outlineCells,color};
}
function addGappedOutline(grid,color){
  const gap=1,ring=1,pad=gap+ring,width=grid.width+2*pad,height=grid.height+2*pad;
  const sourceCells=[];
  for(let y=0;y<grid.height;y++)for(let x=0;x<grid.width;x++)if(grid.rows[y][x]!==null)sourceCells.push({x:x+pad,y:y+pad,color:grid.rows[y][x]});
  const rows=Array.from({length:height},()=>Array(width).fill(null)),distance=Array.from({length:height},()=>Array(width).fill(Infinity));
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)for(const cell of sourceCells){
    const d=Math.max(Math.abs(x-cell.x),Math.abs(y-cell.y));if(d<distance[y][x])distance[y][x]=d;
  }
  let outlineCells=0,gapCells=0,sourceOpaqueCells=0;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    if(distance[y][x]===0){const cell=sourceCells.find((c)=>c.x===x&&c.y===y);rows[y][x]=cell.color;sourceOpaqueCells++;}
    else if(distance[y][x]===1){gapCells++;assert(rows[y][x]===null,'Transparent gap cell was occupied');}
    else if(distance[y][x]===2){rows[y][x]=color;outlineCells++;}
  }
  assert(sourceOpaqueCells===grid.opaqueCells,`Original foreground cell count changed: ${sourceOpaqueCells} vs ${grid.opaqueCells}`);
  assert(outlineCells>0&&rows.flat().filter((c)=>c===color).length===outlineCells,`Gapped one-cell ring missing for ${color}`);
  // All source colored cells must remain the same color at their exact +2,+2 offset.
  for(let y=0;y<grid.height;y++)for(let x=0;x<grid.width;x++)if(grid.rows[y][x]!==null)assert(rows[y+pad][x+pad]===grid.rows[y][x],`Source pixel changed at ${x},${y}`);
  // A colored ring cell is exactly two Chebyshev cells from source foreground; distance-1 is the transparent gap.
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(rows[y][x]===color)assert(distance[y][x]===2,`Ring not exactly one gap + one ring cell at ${x},${y}`);
  return {width,height,rows,outlineCells,gapCells,color,sourceCellOffset:pad,sourceOpaqueCells,distanceMetric:'Chebyshev'};
}
const oldVariants={
  'heart-happy':{grid:addTouchingOutline(sourceGrids['heart-happy'],successColor),stroke:successColor,slug:'toast-success-heart-happy'},
  'awkward-lines':{grid:addTouchingOutline(sourceGrids['awkward-lines'],errorColor),stroke:errorColor,slug:'toast-error-awkward-lines'}
};
const variants={
  phone:{grid:sourceGrids.phone,stroke:null,slug:'social-phone'},
  'heart-happy':{grid:addGappedOutline(sourceGrids['heart-happy'],successColor),stroke:successColor,slug:'toast-success-heart-happy'},
  'awkward-lines':{grid:addGappedOutline(sourceGrids['awkward-lines'],errorColor),stroke:errorColor,slug:'toast-error-awkward-lines'}
};
for(const name of ['heart-happy','awkward-lines'])assert(variants[name].grid.width===sourceGrids[name].width+4&&variants[name].grid.height===sourceGrids[name].height+4,`Expected two-cell total padding for ${name}`);
function svgFor(name,variant,spacing='gapped'){
  const {grid}=variant,{width,height,rows}=grid;
  const groups={};
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const color=rows[y][x];if(color===null)continue;
    (groups[color]??=[]).push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
  }
  const body=Object.entries(groups).sort(([a],[b])=>a.localeCompare(b)).map(([color,rects])=>`<g fill="${color}">${rects.join('')}</g>`).join('');
  const title=`${name} sprite ${width}x${height} logical pixels`;
  const desc=name==='phone'?'Source-cropped pink-haired character holding a phone; transparent background keyed from the flat source-sheet backdrop; no added outline.':spacing==='touching'?(name==='heart-happy'?'Source-cropped heart-happy character; one 4x4-source-pixel-grid outer stroke in the app success icon color #2ed319.':'Source-cropped awkward-lines character plus its two separated accent bars; one 4x4-source-pixel-grid outer stroke in user-requested #ff6b8a.'):(name==='heart-happy'?'Source-cropped heart-happy character; original foreground pixels unchanged; one transparent logical-cell gap followed by a one-cell #2ed319 ring.':'Source-cropped awkward-lines character plus its two separated accent bars; original foreground pixels unchanged; one transparent logical-cell gap followed by a one-cell #ff6b8a ring.');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><title>${title}</title><desc>${desc}</desc>${body}</svg>\n`;
}
const oldSvgTexts={},previousEvidence={};
for(const [name,variant] of Object.entries(oldVariants)){
  const baselineFiles=previousReport.previousTouchingCandidates?.files??previousReport.files;
  const baseline=baselineFiles?.[name];assert(baseline,`Missing preserved task-54 matrix/hash for ${name}`);
  const expectedOldSvg=svgFor(name,variant,'touching'),svgBuffer=Buffer.from(expectedOldSvg),svgSha256=createHash('sha256').update(svgBuffer).digest('hex');
  const matrixRows=variant.grid.rows.map((row)=>row.map((color)=>color===null?'.':codeByColor[color]).join(''));
  assert(svgSha256===baseline.svgSha256,`Reconstructed old SVG hash changed for ${name}`);
  assert(JSON.stringify(matrixRows)===JSON.stringify(baseline.matrixRows),`Reconstructed old candidate matrix changed for ${name}`);
  const pngBuffer=await sharp(svgBuffer,{density:72}).resize(variant.grid.width*sourcePixelScale,variant.grid.height*sourcePixelScale,{fit:'fill',kernel:'nearest'}).png().toBuffer();
  const pngSha256=createHash('sha256').update(pngBuffer).digest('hex');
  assert(pngSha256===baseline.pngSha256,`Reconstructed old PNG hash changed for ${name}`);
  const meta=await sharp(pngBuffer).metadata();assert(meta.hasAlpha,`Previous ${name} PNG lost its alpha channel`);
  const {data,info}=await sharp(pngBuffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const oldAlphaValues=new Set();for(let i=3;i<data.length;i+=4)oldAlphaValues.add(data[i]);
  assert([...oldAlphaValues].every((a)=>a===0||a===255),`Previous ${name} PNG contains partial alpha`);
  for(let gy=0;gy<variant.grid.height;gy++)for(let gx=0;gx<variant.grid.width;gx++)for(let dy=0;dy<sourcePixelScale;dy++)for(let dx=0;dx<sourcePixelScale;dx++){
    const i=((gy*sourcePixelScale+dy)*info.width+gx*sourcePixelScale+dx)*4,actual=data[i+3]===0?null:`#${[0,1,2].map((k)=>data[i+k].toString(16).padStart(2,'0')).join('')}`;
    assert(actual===variant.grid.rows[gy][gx],`Previous PNG differs from preserved matrix ${name} (${gx},${gy})`);
  }
  const archiveSvg=`task54-touching-${name}.svg`,archivePng=`task54-touching-${name}.png`;
  for(const [file,buffer] of [[archiveSvg,svgBuffer],[archivePng,pngBuffer]]){
    const target=path.join(checksDir,file);
    try{const existing=await fs.readFile(target);assert(existing.equals(buffer),`Archived previous candidate changed: ${file}`)}catch(error){if(error.code==='ENOENT')await fs.writeFile(target,buffer);else throw error;}
  }
  oldSvgTexts[name]=expectedOldSvg;
  previousEvidence[name]={svgSha256,pngSha256,logicalSize:`${variant.grid.width}x${variant.grid.height}`,pngSize:`${info.width}x${info.height}`,pngHasAlpha:meta.hasAlpha,alphaValues:[...oldAlphaValues].sort((a,b)=>a-b),matrixRows,archiveSvg,archivePng};
}
const svgTexts={},outputs={};
for(const [name,variant] of Object.entries(variants)){
  const slug=variant.slug,svg=svgFor(name,variant),svgPath=path.join(assetDir,`${slug}.svg`),pngPath=path.join(assetDir,`${slug}.png`);
  if(name==='phone'){
    const existing=await fs.readFile(svgPath,'utf8');assert(existing===svg,'Phone SVG must remain unchanged in task-57');svgTexts[name]=existing;
  }else{svgTexts[name]=svg;await fs.writeFile(svgPath,svg);}
  const {width,height}=variant.grid;
  if(name!=='phone')await sharp(Buffer.from(svg),{density:72}).resize(width*sourcePixelScale,height*sourcePixelScale,{fit:'fill',kernel:'nearest'}).png().toFile(pngPath);
  const pngMeta=await sharp(pngPath).metadata();assert(pngMeta.hasAlpha,`${name} PNG must contain an alpha channel`);
  const {data,info}=await sharp(pngPath).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert(info.width===width*sourcePixelScale&&info.height===height*sourcePixelScale,`Wrong PNG size for ${name}`);
  const allowed=new Set([...Object.keys(variant.grid.rows.flat().reduce((o,c)=>{if(c)o[c]=1;return o},{})).map((hex)=>`${hex.slice(1).match(/.{2}/g).map((v)=>parseInt(v,16)).join(',')},255`),'0,0,0,0']);
  const colorCountsRaster={};let alphaTransparent=0,alphaOpaque=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
    const i=(y*info.width+x)*4,alpha=data[i+3];
    assert(alpha===0||alpha===255,`Partial alpha in ${name} at ${x},${y}: ${alpha}`);
    const value=`${data[i]},${data[i+1]},${data[i+2]},${alpha}`;
    assert(allowed.has(value),`Unexpected/interpolated PNG color ${value} in ${name}`);
    if(alpha===0)alphaTransparent++;else{alphaOpaque++;const hex=`#${[0,1,2].map((k)=>data[i+k].toString(16).padStart(2,'0')).join('')}`;colorCountsRaster[hex]=(colorCountsRaster[hex]||0)+1;}
  }
  for(let gy=0;gy<height;gy++)for(let gx=0;gx<width;gx++){
    const expected=variant.grid.rows[gy][gx];
    for(let dy=0;dy<sourcePixelScale;dy++)for(let dx=0;dx<sourcePixelScale;dx++){
      const i=((gy*sourcePixelScale+dy)*info.width+gx*sourcePixelScale+dx)*4;
      const actual=data[i+3]===0?null:`#${[0,1,2].map((k)=>data[i+k].toString(16).padStart(2,'0')).join('')}`;
      assert(actual===expected,`PNG pixel does not match logical grid ${name} (${gx},${gy})`);
    }
  }
  outputs[name]={slug,svg:`${slug}.svg`,png:`${slug}.png`,logicalSize:`${width}x${height}`,pngSize:`${info.width}x${info.height}`,pngChannels:pngMeta.channels,pngHasAlpha:pngMeta.hasAlpha,sourceCrop:sourceRegions[name],outlineColor:variant.stroke,outlineGridCells:variant.grid.outlineCells??0,transparentGapCells:variant.grid.gapCells??0,sourceOpaqueCellsPreserved:variant.grid.sourceOpaqueCells??variant.grid.opaqueCells,spacing:name==='phone'?'none':'one transparent logical cell + one status-color cell',transparentRasterPixels:alphaTransparent,opaqueRasterPixels:alphaOpaque,rasterColorCounts:colorCountsRaster};
}

async function renderAt(name,scale){
  const {width,height}=variants[name].grid;
  return sharp(Buffer.from(svgTexts[name]),{density:72}).resize(width*scale,height*scale,{fit:'fill',kernel:'nearest'}).png().toBuffer();
}
const sceneNames=['phone','heart-happy','awkward-lines'];
const sceneLabels={phone:'PHONE · source colors', 'heart-happy':'SUCCESS · #2ed319 / 1-cell gap','awkward-lines':'ERROR · #ff6b8a / 1-cell gap'};
async function createContextPreview(){
  const surfaces=[{name:'NEUTRAL TOAST',bg:toastSurface,fg:'#f2ebff'},{name:'GREEN ACCENT SWATCH',bg:successColor,fg:'#16112a'},{name:'ERROR ACCENT SWATCH',bg:errorColor,fg:'#16112a'}];
  const labelW=164,colW=156,headerH=34,rowH=132,width=labelW+colW*3,height=headerH+rowH*3;
  const layers=[];let markup=`<rect width="100%" height="100%" fill="#171326"/>`;
  for(let c=0;c<3;c++)markup+=`<text x="${labelW+c*colW+colW/2}" y="22" text-anchor="middle" fill="#fdf4ff" font-family="sans-serif" font-size="10">${sceneLabels[sceneNames[c]]}</text>`;
  for(let r=0;r<3;r++){
    const y=headerH+r*rowH,s=surfaces[r];
    markup+=`<rect x="0" y="${y}" width="${labelW}" height="${rowH}" fill="#201936"/><rect x="${labelW}" y="${y}" width="${colW*3}" height="${rowH}" fill="${s.bg}"/><text x="10" y="${y+22}" fill="#f2ebff" font-family="sans-serif" font-size="10">${s.name}</text><text x="10" y="${y+38}" fill="#d6c8e6" font-family="monospace" font-size="9">${s.bg}</text>`;
    for(let c=0;c<3;c++){
      const name=sceneNames[c],w=variants[name].grid.width*4,h=variants[name].grid.height*4;
      layers.push({input:await renderAt(name,4),left:labelW+c*colW+Math.floor((colW-w)/2),top:y+44+Math.floor((76-h)/2)});
    }
  }
  const file=path.join(checksDir,'status-context-comparison.png');
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${markup}</svg>`)).composite(layers).png().toFile(file);
  return {file:path.basename(file),...(await sharp(file).metadata())};
}
async function createScalePreview(){
  const scales=[1,2,4],labelW=160,colW=150,headerH=32,rowH=132,width=labelW+colW*3,height=headerH+rowH*3;
  const layers=[];let markup=`<rect width="100%" height="100%" fill="${toastSurface}"/><rect width="100%" height="${headerH}" fill="#171326"/>`;
  for(let c=0;c<scales.length;c++)markup+=`<text x="${labelW+c*colW+colW/2}" y="21" text-anchor="middle" fill="#fdf4ff" font-family="monospace" font-size="11">${scales[c]}× nearest</text>`;
  for(let r=0;r<3;r++){
    const y=headerH+r*rowH,name=sceneNames[r];
    markup+=`<rect x="0" y="${y}" width="${labelW}" height="${rowH}" fill="#201936"/><text x="10" y="${y+24}" fill="#f2ebff" font-family="sans-serif" font-size="10">${sceneLabels[name]}</text><text x="10" y="${y+42}" fill="#d6c8e6" font-family="monospace" font-size="9">${variants[name].grid.width}×${variants[name].grid.height} px grid</text>`;
    for(let c=0;c<3;c++){
      const scale=scales[c],w=variants[name].grid.width*scale,h=variants[name].grid.height*scale;
      layers.push({input:await renderAt(name,scale),left:labelW+c*colW+Math.floor((colW-w)/2),top:y+32+Math.floor((96-h)/2)});
    }
  }
  const file=path.join(checksDir,'integer-nearest-scale-study.png');
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${markup}</svg>`)).composite(layers).png().toFile(file);
  return {file:path.basename(file),...(await sharp(file).metadata())};
}
async function createSpacingComparison(){
  const rows=[{name:'heart-happy',label:'SUCCESS · #2ed319'},{name:'awkward-lines',label:'ERROR · #ff6b8a'}];
  const labelW=156,colW=180,headerH=36,rowH=136,width=labelW+2*colW,height=headerH+2*rowH,scale=4;
  const layers=[];let markup=`<rect width="100%" height="100%" fill="${toastSurface}"/><rect x="0" y="0" width="${labelW}" height="${headerH}" fill="#171326"/><rect x="${labelW}" y="0" width="${2*colW}" height="${headerH}" fill="#171326"/><text x="${labelW+colW/2}" y="23" text-anchor="middle" fill="#fdf4ff" font-family="sans-serif" font-size="10">OLD · TOUCHING RING</text><text x="${labelW+colW+colW/2}" y="23" text-anchor="middle" fill="#fdf4ff" font-family="sans-serif" font-size="10">NEW · 1 GAP + 1 RING</text>`;
  for(let r=0;r<rows.length;r++){
    const row=rows[r],y=headerH+r*rowH;markup+=`<rect x="0" y="${y}" width="${labelW}" height="${rowH}" fill="#201936"/><text x="10" y="${y+24}" fill="#f2ebff" font-family="sans-serif" font-size="10">${row.label}</text>`;
    const old=oldVariants[row.name].grid,newGrid=variants[row.name].grid;
    const oldSvg=oldSvgTexts[row.name],newSvg=svgTexts[row.name];
    const oldImage=await sharp(Buffer.from(oldSvg),{density:72}).resize(old.width*scale,old.height*scale,{fit:'fill',kernel:'nearest'}).png().toBuffer();
    const newImage=await sharp(Buffer.from(newSvg),{density:72}).resize(newGrid.width*scale,newGrid.height*scale,{fit:'fill',kernel:'nearest'}).png().toBuffer();
    layers.push({input:oldImage,left:labelW+Math.floor((colW-old.width*scale)/2),top:y+Math.floor((rowH-old.height*scale)/2)});
    layers.push({input:newImage,left:labelW+colW+Math.floor((colW-newGrid.width*scale)/2),top:y+Math.floor((rowH-newGrid.height*scale)/2)});
  }
  const file=path.join(checksDir,'touching-vs-gapped-outline.png');
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${markup}</svg>`)).composite(layers).png().toFile(file);
  return {file:path.basename(file),...(await sharp(file).metadata()),scale,background:toastSurface};
}
// Regenerate source context crop deterministically for review; the yellow pose is evidence only and is never used as an asset.
const sourceStripPath=path.join(checksDir,'source-state-strip.png');
await sharp(sourceBuffer).extract({left:210,top:320,width:750,height:300}).resize(1500,600,{kernel:'nearest'}).png().toFile(sourceStripPath);
const contextPreview=await createContextPreview();
const scalePreview=await createScalePreview();
const spacingComparison=await createSpacingComparison();

const glyphs={'.':'transparent / alpha 0',...Object.fromEntries(Object.entries(codeByColor).map(([color,code])=>[code,color]))};
const matrixRows=Object.fromEntries(Object.entries(variants).map(([name,variant])=>[name,variant.grid.rows.map((row)=>row.map((color)=>color===null?'.':codeByColor[color]).join(''))]));
const sourceMatrixRows=Object.fromEntries(Object.entries(sourceGrids).map(([name,grid])=>[name,grid.rows.map((row)=>row.map((color)=>color===null?'.':codeByColor[color]).join(''))]));
const oldMatrixRows=Object.fromEntries(Object.entries(oldVariants).map(([name,variant])=>[name,variant.grid.rows.map((row)=>row.map((color)=>color===null?'.':codeByColor[color]).join(''))]));
const report={
  scope:'Internal local candidates only. Task-57 updates success/error only; phone is verified unchanged; no production CSS/runtime modified. Source art license unknown; do not publicly redistribute.',
  source:{file:'art-references/nso-fandom-desktop-icons-sheet.png',sha256:sourceSha256,dimensions:'1120x700',channels:sourceMeta.channels,hasAlpha:sourceMeta.hasAlpha,sourceBackground:sourceBackground,sourceCellGrid:`${sourcePixelScale}x${sourcePixelScale} source image pixels per logical sprite pixel`,sourceCellOriginModulo:{x:2,y:2},cellUniformity:'all sampled source cells uniform; no anti-alias colors detected',backgroundKeying:'exact #f8f0fa source-sheet background cells are converted to alpha=0; all are border-connected, no enclosed cells in selected crops',componentEvidence,
    successColorEvidence:{icon:'CircleCheckIcon',selector:'src/ui/shadcn/toast.tsx:20,25 maps success to var(--status-online)',token:'src/styles/globals.css:117,348 defines --status-online:#2ed319',color:successColor},
    errorColorEvidence:{value:errorColor,source:'user instruction; existing theme remap in runtime/build-runtime.mjs maps legacy #ff8899 to #ff6b8a'},
    excluded:{yellowShock:shockExcluded,reason:'user has not decided its use; not included in assets'}},
  legend:glyphs,
  sourceMatrices:sourceMatrixRows,
  outputMatrices:matrixRows,
  previousTouchingCandidates:{description:'Task-54 candidates with status ring immediately adjacent to source foreground; retained as a matrix/hash and shown next to the revised files in the spacing preview.',matrixRows:oldMatrixRows,files:previousEvidence},
  outlineSpacing:{logicalSourceCellPixels:sourcePixelScale,transparentGapCells:1,statusRingWidthCells:1,metric:'Chebyshev distance',sourceToRingDistance:2,successColor,errorColor},
  palette:{sourceColors,sourceColorCounts:Object.fromEntries(Object.entries(sourceGrids).map(([name,grid])=>[name,grid.colorCounts])),addedOutlineColors:{success:successColor,error:errorColor}},
  assets:outputs,
  previews:{context:contextPreview,integerScaleStudy:scalePreview,spacingComparison,sourceStrip:{file:path.basename(sourceStripPath),width:1500,height:600},scales:[1,2,4],method:'SVG logical-cell rects rendered with sharp nearest; all preview scale factors are positive integers. Green/error surfaces are accent-swatch stress tests, not proposed toast background colors.',neutralToastSurface:toastSurface},
  validation:{sourceForegroundCellColorsPreserved:true,ringCellsOnlyAtDistance2:true,distance1GapCellsTransparent:true,ringWidthLogicalCells:1,pngAlphaValues:[0,255],pngBlocksUniformAt4x:true,phoneAssetUnchanged:true,allPreviewEdgesAtMost2000:true}
};
for(const p of [contextPreview,scalePreview,spacingComparison,{file:path.basename(sourceStripPath),...(await sharp(sourceStripPath).metadata())}])assert(p.width<=2000&&p.height<=2000,`${p.file} exceeds 2000px`);
await fs.writeFile(path.join(checksDir,'pixel-alpha-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
console.log('PASS: source colors preserved / one transparent cell gap + one-cell status ring / old candidates archived and hash-verified / RGBA alpha 0|255 / integer nearest previews');
