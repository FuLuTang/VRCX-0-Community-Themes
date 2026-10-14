import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('/tmp/dsh-theme-tools/node_modules/sharp');
const checksDir=path.dirname(fileURLToPath(import.meta.url));
const themeRoot=path.resolve(checksDir,'../../..');
const assetDir=path.join(themeRoot,'original-assets/r10-phone-layers');
const sourcePath=path.join(themeRoot,'art-references/nso-fandom-desktop-icons-sheet.png');
const manifest=JSON.parse(await fs.readFile(path.join(assetDir,'manifest.json'),'utf8'));
const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
const colorHex=rgb=>`#${rgb.map(v=>v.toString(16).padStart(2,'0')).join('')}`;
const toRgb=hex=>hex.slice(1).match(/../g).map(v=>parseInt(v,16));
const sourceBg='#f8f0fa',W=24,H=20,PW=25; // PW: SOCIAL canvas minimum width (phone-front moves right by 1 cell)
const lin=v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;};
function labOf(hex){const [r,g,b]=toRgb(hex).map(lin);const X=(0.4124564*r+0.3575761*g+0.1804375*b)/0.95047,Y=0.2126729*r+0.7151522*g+0.0721750*b,Z=(0.0193339*r+0.1191920*g+0.9503041*b)/1.08883;const f=t=>t>216/24389?Math.cbrt(t):(24389/27*t+16)/116;return [116*f(Y)-16,500*(f(X)-f(Y)),200*(f(Y)-f(Z))];}
const Lstar=hex=>labOf(hex)[0];
const dE76=(a,b)=>{const A=labOf(a),B=labOf(b);return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]);};
const {data:sourceRaw,info:sourceInfo}=await sharp(sourcePath).removeAlpha().raw().toBuffer({resolveWithObject:true});
const sample=(x,y)=>{const i=(y*sourceInfo.width+x)*sourceInfo.channels;return colorHex([...sourceRaw.slice(i,i+3)]);};
function readGrid(origin){const grid=[];for(let y=0;y<H;y++){const row=[];for(let x=0;x<W;x++){const c=sample(origin.x+x*4+2,origin.y+y*4+2);for(let dy=0;dy<4;dy++)for(let dx=0;dx<4;dx++)assert(sample(origin.x+x*4+dx,origin.y+y*4+dy)===c,`Non-uniform source cell ${x},${y}`);row.push(c===sourceBg?null:c);}grid.push(row);}return grid;}
const origins={phone:{x:302,y:450},happy:{x:442,y:450},shock:{x:582,y:450},awkward:{x:722,y:450}};
const sourceGrids=Object.fromEntries(Object.entries(origins).map(([name,origin])=>[name,readGrid(origin)]));
const phone=sourceGrids.phone;
function chunks(png){let o=8,found={};while(o+12<=png.length){const len=png.readUInt32BE(o),name=png.toString('ascii',o+4,o+8),data=png.subarray(o+8,o+8+len);found[name]=data;o+=len+12;if(name==='IEND')break;}return found;}
const hueSat=hex=>{const [r,g,b]=toRgb(hex).map(v=>v/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360;}return {h,s:mx?d/mx:0};};
// opaque layers: alpha must be 0/255 -> grid of hex | null. Glow layers: alpha gradient -> grid of {hex,a} | null (a>0)
function imageGrid(data,info){const grid=Array.from({length:info.height},()=>Array(info.width).fill(null));for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const i=(y*info.width+x)*4,a=data[i+3];assert(a===0||a===255,`Non-binary alpha at ${x},${y}: ${a}`);if(a)grid[y][x]=colorHex([data[i],data[i+1],data[i+2]]);}return grid;}
function glowImageGrid(data,info){const grid=Array.from({length:info.height},()=>Array(info.width).fill(null));for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const i=(y*info.width+x)*4,a=data[i+3];if(a)grid[y][x]={hex:colorHex([data[i],data[i+1],data[i+2]]),a};}return grid;}
function placeCrop(crop,offset){const grid=Array.from({length:H},()=>Array(PW).fill(null));for(let y=0;y<crop.length;y++)for(let x=0;x<crop[y].length;x++){const dx=x+offset.x,dy=y+offset.y;assert(dx<PW&&dy<H,'layer exceeds the 25x20 preview/SOCIAL canvas');grid[dy][dx]=crop[y][x];}return grid;}
const glowNames=['glow-dim','glow-bright'];
const decoded={},pngInfos={},byteRows=[];
for(const [name,meta] of Object.entries(manifest.layers)){
  const isGlow=glowNames.includes(name);
  const bytes=await fs.readFile(path.join(assetDir,meta.file));
  const pngChunks=chunks(bytes),header=pngChunks.IHDR;
  assert(header&&header[9]===3,`${meta.file} is not indexed-color PNG (color type 3); the glow encoding comparison in the manifest says ${JSON.stringify(meta.encoding||null)}`);
  const depth=header[8],plte=pngChunks.PLTE,trns=pngChunks.tRNS;
  assert(plte&&plte.length%3===0,`Missing/invalid palette in ${meta.file}`);
  assert(trns?.length&&trns[0]===0,`Missing transparent palette entry in ${meta.file}`);
  const metaSharp=await sharp(bytes).metadata();
  assert(metaSharp.format==='png'&&metaSharp.isPalette===true,`${meta.file} was not decoded as indexed PNG`);
  assert(metaSharp.width===meta.width&&metaSharp.height===meta.height,`${meta.file} dimensions do not match manifest`);
  const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const crop=isGlow?glowImageGrid(data,info):imageGrid(data,info);
  const full=placeCrop(crop,meta.bboxOffset);
  decoded[name]=full;
  const trnsAlphas=[...trns];while(trnsAlphas.length<plte.length/3)trnsAlphas.push(255);
  pngInfos[name]={bytes:bytes.length,base64Bytes:bytes.toString('base64').length,bitDepth:depth,colorType:header[9],paletteEntries:plte.length/3,paletteHex:Array.from({length:plte.length/3},(_,i)=>colorHex([...plte.subarray(i*3,i*3+3)])),paletteAlpha:trnsAlphas,trnsBytes:trns.length,metadataPalette:metaSharp.isPalette};
  byteRows.push({layer:name,pngBytes:bytes.length,base64Bytes:bytes.toString('base64').length,dimensions:`${meta.width}x${meta.height}`,offset:`(${meta.bboxOffset.x},${meta.bboxOffset.y})`,paletteColors:meta.colors,indexed:metaSharp.palette,bitDepth:depth});
  let minX=PW,minY=H,maxX=-1,maxY=-1;for(let y=0;y<H;y++)for(let x=0;x<PW;x++)if(full[y][x]){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  assert(minX===meta.bboxOffset.x&&minY===meta.bboxOffset.y&&maxX-minX+1===meta.width&&maxY-minY+1===meta.height,`${name} is not cropped to the minimum non-transparent bbox`);
  const svg=await fs.readFile(path.join(assetDir,meta.svgFile),'utf8');
  assert(svg.includes(`width="${meta.width}" height="${meta.height}"`)&&svg.includes('shape-rendering="crispEdges"')&&!svg.includes('data:image/'),`${meta.svgFile} is not a review-only crisp SVG`);
  const svgCells=new Map();for(const m of svg.matchAll(/<path fill="(#[0-9a-f]{6})"(?: fill-opacity="([0-9.]+)")? d="([^"]+)"/g)){const a=m[2]===undefined?255:Math.round(parseFloat(m[2])*255);if(m[2]!==undefined)assert(isGlow,`${meta.svgFile} has fill-opacity but is not a glow layer`);for(const c of m[3].matchAll(/M(\d+) (\d+)h1v1h-1z/g))svgCells.set(`${c[1]},${c[2]}`,`${m[1]}@${a}`);}
  let pngCount=0;for(let y=0;y<crop.length;y++)for(let x=0;x<crop[y].length;x++)if(crop[y][x]){pngCount++;const want=isGlow?`${crop[y][x].hex}@${crop[y][x].a}`:`${crop[y][x]}@255`;assert(svgCells.get(`${x},${y}`)===want,`${meta.svgFile} differs from PNG at ${x},${y}: svg ${svgCells.get(`${x},${y}`)} png ${want}`);}
  assert(svgCells.size===pngCount,`${meta.svgFile} has extra pixels`);
  assert(meta.pngBytes===bytes.length&&meta.base64Bytes===bytes.toString('base64').length,`${meta.file} byte counts differ from manifest`);
}
assert(pngInfos['char-back'].paletteHex.join(',')===pngInfos['phone-front'].paletteHex.join(','),'char-back and phone-front do not share the exact same palette');
assert(pngInfos['char-back'].paletteHex.length===19,'Expected 18 exact source colors plus transparent palette index');
for(const name of ['char-back','phone-front'])assert(pngInfos[name].trnsBytes===1,`${name} must keep a 1-byte tRNS (alpha 0/255)`);
// ---- glow PNG structure: indexed 4-bit, transparent + 8 gradient levels + H1 catch-light = 10 entries ----
for(const name of glowNames){
  const info=pngInfos[name];
  assert(info.bitDepth===4&&info.paletteEntries===10,`${name} must be a 4-bit indexed PNG with 10 palette entries (got depth ${info.bitDepth}, ${info.paletteEntries} entries)`);
  const expectedTrnsBytes=name==='glow-dim'?10:9;
  assert(info.trnsBytes===expectedTrnsBytes,`${name} tRNS should carry ${expectedTrnsBytes} alpha bytes (${name==='glow-dim'?'the H1 dim highlight alpha 128 must be explicit':'the opaque bright highlight alpha 255 is implicit'}), got ${info.trnsBytes}`);
  const peak=name==='glow-dim'?64:128,highlightAlpha=name==='glow-dim'?128:255;
  const expectedAlpha=[0,...Array.from({length:8},(_,i)=>Math.round(peak*(i+1)/8)),highlightAlpha];
  assert(info.paletteAlpha.join()===expectedAlpha.join(),`${name} palette alpha ladder is ${info.paletteAlpha.join()}, expected ${expectedAlpha.join()}`);
  assert(info.paletteHex.slice(0,9).every(h=>h==='#eef6ff')&&info.paletteHex[9]==='#f8fcff',`${name} palette colours must be #eef6ff (overlay, all 8 levels) and #f8fcff (highlight)`);
}
// indexed+tRNS must be the smaller of the two encodings (re-measured here with the same sharp RGBA encoder)
for(const name of glowNames){
  const meta=manifest.layers[name],{data,info}=await sharp(await fs.readFile(path.join(assetDir,meta.file))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const rgbaBytes=(await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).png({compressionLevel:9,adaptiveFiltering:true,palette:false}).toBuffer()).length;
  assert(pngInfos[name].bytes<=rgbaBytes,`${name}: indexed PNG ${pngInfos[name].bytes} B is larger than the RGBA PNG ${rgbaBytes} B`);
  assert(meta.encoding.chosen==='indexed+tRNS'&&meta.encoding.indexedTrnsBytes===pngInfos[name].bytes,`${name}: manifest encoding comparison is stale`);
  pngInfos[name].rgbaBytes=rgbaBytes;
}

// ---- phone mask: x=17 left bezel, plus the shared left-ear cell (18,8) ----
const phoneMask=new Set();for(const x of [18,19,21,22])phoneMask.add(`${x},8`);for(let x=18;x<=22;x++)phoneMask.add(`${x},9`);for(let y=10;y<20;y++)for(let x=17;x<24;x++)phoneMask.add(`${x},${y}`);
assert(phoneMask.size===79&&manifest.phoneFront.maskSize===79,'phone mask must have 79 cells');
const r2Mask=new Set([...phoneMask].filter(k=>k!=='18,8'));
const legacyMask=new Set([...r2Mask].filter(k=>Number(k.split(',')[0])!==17));
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const front=decoded['phone-front'][y][x],back=decoded['char-back'][y][x],actual=front??back,expected=phone[y][x];
  assert(actual===expected,`char-back + phone-front composite mismatch at (${x},${y}): ${actual} !== ${expected}`);
  if(front!==null){assert(phoneMask.has(`${x},${y}`),`phone-front contains a pixel outside its mask at ${x},${y}`);assert(front===expected,`phone-front changed source cell at ${x},${y}`);}
  if(!phoneMask.has(`${x},${y}`))assert(front===null,`phone-front has non-transparent pixel outside mask at ${x},${y}`);
  if(front!==null&&back!==null)assert(phoneMask.has(`${x},${y}`),`char-back pixel under phone-front outside mask at ${x},${y}`);
}
for(let y=0;y<H;y++)assert(decoded['char-back'][y][24]===null&&decoded['phone-front'][y][24]===null,'x=24 must be empty in the base layers');
assert(decoded['phone-front'][8][18]===phone[8][18]&&decoded['char-back'][8][18]===phone[8][18],'(18,8) must be owned by both char-back and phone-front (shared ear/outline cell)');
assert(manifest.layers['phone-front'].width===7&&manifest.layers['phone-front'].height===12&&manifest.layers['phone-front'].bboxOffset.x===17&&manifest.layers['phone-front'].bboxOffset.y===8,'phone-front bbox must stay 7x12 @(17,8)');

// ---- hidden-cell restoration: independent ">=2 identical colours" recompute ----
const poseRow={happy:y=>y,shock:y=>y,awkward:y=>(y>=6&&y<=14)?y+1:y};
const poseNames=['happy','shock','awkward'];
const braidPalette=new Set();for(let y=6;y<20;y++)for(const x of [15,16])if(phone[y][x])braidPalette.add(phone[y][x]);for(let y=0;y<=9;y++)for(let x=13;x<=17;x++)if(phone[y][x])braidPalette.add(phone[y][x]);
const effectPalette=new Set();for(const p of poseNames)for(let y=0;y<H;y++)for(let x=17;x<W;x++){const c=sourceGrids[p][y][x];if(c&&!braidPalette.has(c))effectPalette.add(c);}
assert([...effectPalette].sort().join(',')===manifest.hairEvidence.effectPalette.all.join(','),'effect palette differs from manifest');
const phoneVisibleFar=new Set();for(let y=0;y<H;y++)for(let x=13;x<W;x++){const c=phone[y][x];if(c&&!phoneMask.has(`${x},${y}`))phoneVisibleFar.add(c);}
for(const c of effectPalette)assert(!phoneVisibleFar.has(c),`effect colour ${c} appears in visible phone-pose cells (not a pure overlay colour)`);
// awkward alignment evidence: the +1 shift matches the visible braid columns on more rows than no shift
{let withShift=0,noShift=0;for(let y=6;y<=14;y++){if([15,16].every(x=>sourceGrids.awkward[y+1][x]===phone[y][x]))withShift++;if([15,16].every(x=>sourceGrids.awkward[y][x]===phone[y][x]))noShift++;}
  assert(withShift===9&&noShift<withShift,`awkward +1 alignment evidence unexpected: shift ${withShift}/9 vs none ${noShift}/9`);}
function tally(x,y){
  const per=poseNames.map(p=>{const c=sourceGrids[p][poseRow[p](y)][x];return c===null?'bg':effectPalette.has(c)?'fx':c;});
  const colours={};for(const v of per)if(v.startsWith('#'))colours[v]=(colours[v]||0)+1;
  const top=Object.entries(colours).sort((a,b)=>b[1]-a[1])[0];
  return {per,colours,topColour:top?top[0]:null,topCount:top?top[1]:0,colourVotes:per.filter(v=>v.startsWith('#')).length,bgVotes:per.filter(v=>v==='bg').length};
}
const restoredNow=[],singleNow=[];
for(const key of phoneMask){
  const [x,y]=key.split(',').map(Number),t=tally(x,y),back=decoded['char-back'][y][x];
  const m=manifest.hairEvidence.cells.find(c=>c.x===x&&c.y===y);
  assert(m,`manifest evidence missing (${x},${y})`);
  if(t.topCount>=2){
    restoredNow.push({x,y,color:t.topColour,agree:t.topCount});
    assert(back===t.topColour,`>=2-agree cell (${x},${y}) is not copied into char-back (got ${back}, expected ${t.topColour})`);
    assert(m.verdict==='restore'&&m.color===t.topColour&&m.agree===t.topCount,`manifest evidence differs for (${x},${y})`);
    assert(decoded['phone-front'][y][x]!==null,`filled cell (${x},${y}) is not concealed by phone-front`);
  }else if(t.colourVotes===1){
    singleNow.push({x,y,color:t.topColour});
    // single-vote policy: kept only when no pose says empty; always reported separately
    assert(back===(t.bgVotes===0?t.topColour:null),`single-vote cell (${x},${y}) policy violated`);
  }else{
    assert(back===null,`hidden cell (${x},${y}) has <2 agreeing votes but is filled in char-back (${back})`);
    assert(m.verdict==='empty','manifest verdict mismatch for an empty cell');
  }
}
assert(restoredNow.length===manifest.hairEvidence.restoredCount,'restored count differs from manifest');
assert(JSON.stringify(singleNow)===JSON.stringify(manifest.hairEvidence.singleVoteCells.map(c=>({x:c.x,y:c.y,color:c.color})))||singleNow.length===manifest.hairEvidence.singleVoteCells.length,'single-vote list differs from manifest');
assert(manifest.hairEvidence.cells.length===phoneMask.size,'manifest evidence cell count differs from mask size');
assert(restoredNow.length===21&&singleNow.length===0,`expected 21 >=2-agree cells and 0 single-vote cells, got ${restoredNow.length}/${singleNow.length}`);
// every char-back cell under the mask must come from a >=2-agree verdict (no cell filled on weaker evidence)
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const b=decoded['char-back'][y][x];if(b!==null&&phoneMask.has(`${x},${y}`))assert(restoredNow.some(c=>c.x===x&&c.y===y),`char-back fills (${x},${y}) without a >=2-agree verdict`);}
// r2 audit: the r2 union rule restored exactly the same set; none of the r2 cells is a single-vote cell
assert(manifest.hairEvidence.r2RuleAudit.oldRestoreButNotTwoAgree.length===0&&manifest.hairEvidence.r2RuleAudit.twoAgreeButNotOldRestore.length===0,'r2 union rule and >=2-agree rule disagree somewhere (see manifest.hairEvidence.r2RuleAudit)');
for(const [x,y,c] of [[18,10,'#d94cb4'],[19,10,'#7b5f80'],[18,15,'#7b5f80'],[18,16,'#7b5f80'],[18,17,'#7b5f80']])assert(decoded['char-back'][y][x]===c,`round-1 restored cell (${x},${y}) lost`);
for(const c of restoredNow)assert(pngInfos['char-back'].paletteHex.includes(c.color),`restored colour ${c.color} not in shared palette`);
const hairRegion={x:0,y:0,width:18,height:8};
function hairAlignment(name){let best={matches:-1,dx:0,dy:0,total:0};for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){let matches=0,total=0;for(let y=0;y<hairRegion.height;y++)for(let x=0;x<hairRegion.width;x++){const sx=x+dx,sy=y+dy;if(sx<0||sx>=W||sy<0||sy>=H)continue;total++;if(phone[y][x]===sourceGrids[name][sy][sx])matches++;}if(matches>best.matches)best={matches,dx,dy,total};}let exact=0;for(let y=0;y<hairRegion.height;y++)for(let x=0;x<hairRegion.width;x++)if(phone[y][x]===sourceGrids[name][y][x])exact++;return {zeroOffsetMatches:exact,total:hairRegion.width*hairRegion.height,bestShift:best};}
const hairEvidence=Object.fromEntries(poseNames.map(name=>[name,hairAlignment(name)]));
for(const [name,evidence] of Object.entries(hairEvidence)){assert(evidence.bestShift.dx===0&&evidence.bestShift.dy===0,`${name} head region appears translated`);assert(evidence.zeroOffsetMatches===manifest.hairEvidence.alignments[name].zeroOffsetMatches,`${name} hair evidence differs from manifest`);}
assert(hairEvidence.happy.zeroOffsetMatches===144&&hairEvidence.shock.zeroOffsetMatches===144,'happy/shock unoccluded head must be exactly aligned');

// ---- left-edge region x=14..19, y=6..19: no transparent hole in char-back where >=2 poses agree on a colour ----
const holes=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(decoded['char-back'][y][x]!==null)continue;const t=tally(x,y);if(t.topCount>=2)holes.push({x,y,color:t.topColour});}
assert(holes.length===0,`char-back has transparent holes where >=2 poses agree: ${JSON.stringify(holes)}`);
assert(manifest.leftEdgeScan.leftRegion.holes===0&&manifest.leftEdgeScan.wholeCanvasHoles.length===0,'manifest reports holes');
let leftRegionCells=0;
for(let y=6;y<20;y++)for(let x=14;x<=19;x++){
  leftRegionCells++;
  const back=decoded['char-back'][y][x],t=tally(x,y);
  if(phoneMask.has(`${x},${y}`)){ // hidden under the phone: either >=2 agree -> copied, or confirmed empty
    assert(t.topCount>=2?back===t.topColour:back===null,`left-region hidden cell (${x},${y}) wrong`);
  }else assert(back===phone[y][x],`left-region visible cell (${x},${y}) differs from the phone pose`);
}
assert(leftRegionCells===84,'left-region scan size');
// x=16 / x=17 columns: char-back x=16 equals the phone pose; x=17 rows 8..9 are visible source, rows 10..18 come from consensus
for(let y=6;y<20;y++)assert(decoded['char-back'][y][16]===phone[y][16],`char-back column x=16 differs from the phone pose at y=${y}`);

// ---- tap frames (3 and 5): phone-front +1 on a 25-wide canvas ----
const front=decoded['phone-front'],back=decoded['char-back'];
const blendHex=(base,over,a)=>colorHex(toRgb(base).map((v,i)=>Math.round(v*(1-a/255)+toRgb(over)[i]*a/255)));
function composeLayers(glow=null,phoneDx=0,frontGrid=front){const out=back.map(r=>r.slice());if(glow){const gg=typeof glow==='string'?decoded[glow]:glow;for(let y=0;y<H;y++)for(let x=0;x<PW;x++){const g=gg[y][x];if(!g)continue;assert(out[y][x],`glow cell (${x},${y}) has no character pixel below it`);out[y][x]=blendHex(out[y][x],g.hex,g.a);}}for(let y=0;y<H;y++)for(let x=0;x<PW;x++){const c=frontGrid[y][x];if(!c)continue;const dx=x+phoneDx;assert(dx>=0&&dx<PW,'phone-front would be clipped by the 25-cell canvas');out[y][dx]=c;}return out;}
const tapFrame=composeLayers(null,1);
const tapProblems=[];
for(let y=6;y<H;y++)for(let x=14;x<PW;x++){
  const got=tapFrame[y][x],srcFront=x-1>=0?front[y][x-1]:null;
  if(srcFront!==null){if(got!==srcFront)tapProblems.push(`phone shift mismatch (${x},${y})`);continue;}
  if(x>=W)continue;
  const t=tally(x,y);
  let expected;
  if(t.topCount>=2)expected=t.topColour;else if(t.bgVotes>=2)expected=null;else expected=phone[y][x];
  if(got!==expected)tapProblems.push(`tap frame (${x},${y}) is ${got}, expected ${expected} (${t.per.join('/')})`);
}
assert(tapProblems.length===0,'tap-frame audit failed: '+tapProblems.join('; '));
// no ghost of the left bezel: x=17 in the tap frame is char-back only; the bezel colour appears only at the legit braid-end outline (17,18)
const bezelColour=phone[11][17];
for(let y=8;y<20;y++)assert(tapFrame[y][17]===back[y][17],`x=17 ghost at y=${y}`);
const bezelRows=[];for(let y=8;y<20;y++)if(tapFrame[y][17]===bezelColour)bezelRows.push(y);
assert(bezelRows.join()==='18',`bezel colour on x=17 only allowed at (17,18), got rows ${bezelRows}`);
for(let y=6;y<20;y++)assert(tapFrame[y][16]===phone[y][16],`x=16 changed in the tap frame at y=${y}`);
// no background show-through: every transparent cell x=17..24,y=8..19 is a >=2-poses background cell or outside the original phone silhouette gap
const transparentTap=[];for(let y=8;y<20;y++)for(let x=17;x<PW;x++)if(tapFrame[y][x]===null)transparentTap.push([x,y]);
for(const [x,y] of transparentTap){if(x>=W)continue;const t=tally(x,y);assert(t.bgVotes>=2,`tap frame shows background at (${x},${y}) although poses have colour (${t.per.join('/')})`);}
// complete left ear in the tap frame: (18,8) hair outline + shifted ear cells (19,8),(20,8); r2 (without the shared cell) left (19,8) empty
assert(tapFrame[8][19]===phone[8][18]&&tapFrame[8][20]===phone[8][19]&&tapFrame[8][18]===phone[8][18],'tap-frame left ear incomplete');
const r2Front=front.map((row,y)=>row.map((c,x)=>r2Mask.has(`${x},${y}`)?c:null));
const tapR2=composeLayers(null,1,r2Front);
assert(tapR2[8][19]===null&&manifest.leftEdgeScan.tapAudit.r2PhoneFrontEarGap.leftEarComplete===false,'expected r2 to have the (19,8) ear gap in the tap frame');
assert(manifest.leftEdgeScan.tapAudit.issues.length===0&&manifest.leftEdgeScan.tapAudit.leftEarComplete===true,'manifest tap audit mismatch');
// right edge not clipped
assert(front.some((row,y)=>row[23]&&tapFrame[y][24]===row[23]),'tap frame phone-front is clipped at the right edge');

// ---- char-back / phone-front are frozen: the exact r3 bytes must still be on disk ----
const sha256=async file=>(await import('node:crypto')).createHash('sha256').update(await fs.readFile(path.join(assetDir,file))).digest('hex');
const frozen={'char-back.png':'f442b6e476f4db53d71d7bed6bb292287c5a3eb122459cf184a6755fd2bb4670','phone-front.png':'5bb53ddea178a70e28b4ffb89226f115072bcae995512cec8c6b981d0f668950','char-back.svg':'462f60c8fd2457b37eb5e11543e0c2d990653232c34ef979ea1dc8f1a44de789','phone-front.svg':'6e80f83b881fc52a11c4db9e0e826e24eb6f46caa5fd758c8ea4ad665c4f2179'};
for(const [file,hash] of Object.entries(frozen))assert(await sha256(file)===hash,`${file} changed (it is frozen since r3)`);

// ---- glow (r4): independent recompute of the translucent cold-white overlay ----
const gl=manifest.glow;
assert(JSON.stringify(gl.lightCentre.cells)==='[[10,14],[11,14]]'&&gl.lightCentre.lineX===10.5,'light centre must be (10,14)/(11,14) on x=10.5');
const GR=9,GN=8,centres=[[10,14],[11,14]],peakAlpha={'glow-dim':64,'glow-bright':128};
assert(gl.formula.radius===GR&&gl.formula.levels===GN&&gl.formula.peakAlpha.dim===64&&gl.formula.peakAlpha.bright===128,'manifest formula parameters differ from the verify constants');
const dist=(x,y)=>Math.min(...centres.map(([cx,cy])=>Math.hypot(x-cx,y-cy)));   // Euclid to the nearest centre cell
const fall=d=>d>=GR?0:0.5*(1+Math.cos(Math.PI*d/GR));                               // raised cosine
const DARK=['#7b5f80','#6673aa'],MID=['#87a5d9'];
const kOf=o=>DARK.includes(o)?0.3:MID.includes(o)?0.6:1;
const eyeBoxes=[[7,9,11,14],[12,14,11,14]];
assert(eyeBoxes[0][0]+eyeBoxes[1][1]===21&&eyeBoxes[0][1]+eyeBoxes[1][0]===21,'eye boxes are not mirror images about x=10.5');
// expected level map straight from the source pose (the phone-covered cells and transparent cells never glow)
const expLevel=Array.from({length:H},()=>Array(PW).fill(0)),expInfo=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const o=phone[y][x];if(!o||phoneMask.has(`${x},${y}`))continue;
  const d=dist(x,y),f=fall(d),raw=GN*f*kOf(o);
  if(f>0)assert(Math.abs(raw-Math.floor(raw)-0.5)>1e-6,`rounding tie at (${x},${y})`);
  const level=Math.round(raw);if(level>0){expLevel[y][x]=level;expInfo.push({x,y,o,d,f,k:kOf(o),level});}
}
// iris cells and highlight cells from the actual pixels
const irisCols=['#6673aa','#87a5d9','#bbddff'];
const irisBlocks=eyeBoxes.map(([x0,x1,y0,y1])=>{const cells=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(irisCols.includes(phone[y][x]))cells.push([x,y]);return cells;});
for(const b of irisBlocks){assert(b.length===6,'iris block must be 2x3 cells');const xs=b.map(c=>c[0]),ys=b.map(c=>c[1]);assert(Math.max(...xs)-Math.min(...xs)===1&&Math.min(...ys)===12&&Math.max(...ys)===14,'iris block must be 2 wide, rows 12..14');}
assert(irisBlocks[1][0][0]-irisBlocks[0][0][0]===5,'right iris must be the left iris translated by +5 cells');
const hlCells=irisBlocks.map(b=>[Math.max(...b.map(c=>c[0])),Math.min(...b.map(c=>c[1]))]);
assert(JSON.stringify(hlCells)==='[[9,12],[14,12]]'&&JSON.stringify(gl.highlight.cells)==='[[9,12],[14,12]]','highlight cells must be the upper-right iris cell (9,12) and (14,12)');
const hlKey=new Set(hlCells.map(c=>c.join(',')));
const originalWhite=[];for(const [x0,x1,y0,y1] of eyeBoxes)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(phone[y][x]&&Lstar(phone[y][x])>=85&&!irisCols.includes(phone[y][x]))originalWhite.push([x,y,phone[y][x]]);
for(const [x,y] of hlCells){assert(phone[y][x]==='#6673aa'&&Lstar(phone[y][x])<60,`highlight (${x},${y}) must sit on a dark iris pixel`);assert(!originalWhite.some(c=>c[0]===x&&c[1]===y),'highlight overwrote an original white eye pixel');}
// per-layer decode + checks
const lv={};            // level maps decoded from the PNG alpha (non-highlight cells)
const hexSet=new Set();
for(const name of glowNames){
  const g=decoded[name],step=peakAlpha[name]/GN,expectedHighlightAlpha=name==='glow-dim'?128:255;lv[name]=Array.from({length:H},()=>Array(PW).fill(0));
  for(let y=0;y<H;y++)for(let x=0;x<PW;x++){
    const c=g[y][x],key=`${x},${y}`;
    if(!c){assert(expLevel[y][x]===0&&!hlKey.has(key),`${name}: missing glow at (${x},${y}) (expected level ${expLevel[y][x]})`);continue;}
    assert(x<W&&phone[y][x]!==null,`${name}: glow cell (${x},${y}) lies on a transparent source pixel`);
    assert(!phoneMask.has(key),`${name}: glow cell (${x},${y}) lies under the phone`);
    hexSet.add(c.hex);
    if(hlKey.has(key)){assert(c.a===expectedHighlightAlpha&&c.hex==='#f8fcff',`${name}: eye highlight at (${x},${y}) must be #f8fcff@${expectedHighlightAlpha}, got ${c.hex}@${c.a}`);continue;}
    assert(c.a%step===0&&c.hex==='#eef6ff',`${name}: cell (${x},${y}) alpha ${c.a} is not on the ${step}-step ladder or colour ${c.hex} is not the overlay`);
    lv[name][y][x]=c.a/step;
    assert(lv[name][y][x]===expLevel[y][x],`${name}: level at (${x},${y}) is ${lv[name][y][x]}, independent recompute says ${expLevel[y][x]}`);
  }
  for(const [x,y] of hlCells)assert(g[y][x]&&g[y][x].a===expectedHighlightAlpha,`${name}: highlight (${x},${y}) missing expected alpha ${expectedHighlightAlpha}`);
  const fullOpaqueHighlights=g.flat().filter(c=>c&&c.a===255).length;
  assert(fullOpaqueHighlights===(name==='glow-dim'?0:2),`${name}: expected ${name==='glow-dim'?0:2} alpha=255 eye-highlight pixels, got ${fullOpaqueHighlights}`);
}
const dimHighlightAlpha=decoded['glow-dim'][hlCells[0][1]][hlCells[0][0]].a;
const brightHighlightAlpha=decoded['glow-bright'][hlCells[0][1]][hlCells[0][0]].a;
assert(dimHighlightAlpha>=80&&dimHighlightAlpha<=160,`Selected H1 dim highlight alpha ${dimHighlightAlpha} is outside 80..160`);
assert(dimHighlightAlpha<brightHighlightAlpha,`Dim highlight alpha ${dimHighlightAlpha} must be strictly below bright highlight alpha ${brightHighlightAlpha}`);
for(const [x,y] of hlCells)assert(decoded['glow-dim'][y][x].a>=80&&decoded['glow-dim'][y][x].a<=160&&decoded['glow-dim'][y][x].a<decoded['glow-bright'][y][x].a,`H1 alpha guard failed at (${x},${y})`);
assert([...hexSet].sort().join()==='#eef6ff,#f8fcff','glow layers must only use the overlay #eef6ff and the highlight #f8fcff');
// the lit-cell set must also equal the recompute (no extra/missing cells), the highlight cells excepted
const litKeys=[];for(let y=0;y<H;y++)for(let x=0;x<PW;x++)if(expLevel[y][x]>0||hlKey.has(`${x},${y}`))litKeys.push(`${x},${y}`);
for(const name of glowNames)assert(JSON.stringify(decoded[name].flatMap((r,y)=>r.map((c,x)=>c?`${x},${y}`:null)).filter(Boolean))===JSON.stringify(litKeys),`${name} lit-cell set differs`);
assert(JSON.stringify(gl.dim.cells.map(c=>c.join(',')).sort())===JSON.stringify(expInfo.map(c=>`${c.x},${c.y}`).sort()),'manifest dim cells differ from the recompute');
assert(gl.bright.cells.length===expInfo.length&&gl.cellTable.length===expInfo.length,'manifest bright cell count differs');
// same shape in both layers, bright strictly >= dim cell by cell, bright == 2 x dim
for(let y=0;y<H;y++)for(let x=0;x<PW;x++){
  const a=decoded['glow-dim'][y][x],b=decoded['glow-bright'][y][x];
  if(!a&&!b)continue;assert(a&&b,`dim/bright cell sets differ at (${x},${y})`);
  assert(b.a>=a.a,`bright alpha < dim alpha at (${x},${y})`);
  if(!hlKey.has(`${x},${y}`))assert(b.a===2*a.a,`bright alpha is not 2x dim at (${x},${y})`);
}
// peaks / ladder
const levelsUsed=[...new Set(expInfo.map(c=>c.level))].sort((a,b)=>a-b);
assert(levelsUsed.join()==='1,2,3,4,5,6,7,8','all eight alpha levels must be used');
const gradCells=expInfo.filter(c=>!hlKey.has(`${c.x},${c.y}`));// catch-lights have their own H1 alphas (dim 128 / bright 255), independent of the gradient
const peakDim=Math.max(...gradCells.map(c=>decoded['glow-dim'][c.y][c.x].a))/255,peakBright=Math.max(...gradCells.map(c=>decoded['glow-bright'][c.y][c.x].a))/255;
assert(peakDim>=0.20&&peakDim<=0.28,`dim peak alpha ${peakDim.toFixed(3)} outside 0.20..0.28`);
assert(peakBright>=0.45&&peakBright<=0.55,`bright peak alpha ${peakBright.toFixed(3)} outside 0.45..0.55`);
for(const name of glowNames){const vals=[...new Set(gradCells.map(c=>decoded[name][c.y][c.x].a))].sort((a,b)=>a-b);assert(vals.length>=6&&vals.length<=8,`${name} uses ${vals.length} alpha levels`);const steps=vals.map((v,i)=>v-(vals[i-1]??0));assert(Math.max(...steps)<=16,`${name} adjacent alpha step ${Math.max(...steps)}/255 too coarse (banding)`);}
// the maximum is at the centre cells and only within d<=1.5
for(const [cx,cy] of centres)assert(expLevel[cy][cx]===GN,`centre cell (${cx},${cy}) must carry the peak level`);
assert(expInfo.filter(c=>c.level===GN).every(c=>c.d<=1.5),'peak level leaks beyond d<=1.5');
// monotone: among normal-class cells the level never rises with distance (checked on the decoded levels)
{const normal=expInfo.filter(c=>c.k===1).sort((a,b)=>a.d-b.d);let prev=GN;for(const c of normal){const l=lv['glow-bright'][c.y][c.x];assert(l<=prev,`alpha rises with distance at (${c.x},${c.y}): level ${l} after ${prev}`);prev=l;}
  // and the same relation for every pair of normal cells at strictly different distance
  for(const a of normal)for(const b of normal)if(a.d<b.d-1e-9)assert(lv['glow-bright'][a.y][a.x]>=lv['glow-bright'][b.y][b.x],`non-monotone pair (${a.x},${a.y}) vs (${b.x},${b.y})`);}
// connectivity: all alpha>0 cells (highlights included) form ONE 8-connected blob that contains the centre
const litSet=new Set(litKeys);
{const seen=new Set(),stack=['10,14'];while(stack.length){const k=stack.pop();if(seen.has(k))continue;seen.add(k);const [x,y]=k.split(',').map(Number);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const n=`${x+dx},${y+dy}`;if(litSet.has(n)&&!seen.has(n))stack.push(n);}}
  assert(seen.size===litSet.size,`glow is not a single 8-connected blob (${seen.size}/${litSet.size})`);}
// no rebound: every lit cell has a lit, strictly closer 8-neighbour whose level is at most ONE step lower (alpha climbs <= 1 step along the way to the centre)
const levelAt=(x,y)=>expLevel[y]?.[x]??0;
for(const c of expInfo){if(c.d===0)continue;let ok=false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const n=expInfo.find(e=>e.x===c.x+dx&&e.y===c.y+dy);if(n&&n.d<c.d&&c.level<=n.level+1)ok=true;}assert(ok,`cell (${c.x},${c.y}) level ${c.level} has no closer lit neighbour within one level (broken ring / rebound)`);}
// soft edge: a lit cell that touches an unlit visible cell (not transparent, not phone-covered) is at most level 2 -- no hard radius, except next to suppressed dark cells
let maxEdgeLevel=0;const edgeCells=[];
for(const c of expInfo){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=c.x+dx,ny=c.y+dy;if(nx<0||ny<0||nx>=W||ny>=H||(!dx&&!dy))continue;const o=phone[ny][nx];if(!o||phoneMask.has(`${nx},${ny}`))continue;if(expLevel[ny][nx]===0&&!hlKey.has(`${nx},${ny}`)){if(kOf(o)<1)continue;maxEdgeLevel=Math.max(maxEdgeLevel,c.level);edgeCells.push([c.x,c.y,c.level]);}}}
assert(maxEdgeLevel<=2,`glow edge is hard: a level-${maxEdgeLevel} cell touches an unlit normal cell`);
// coverage: whole face, no colour skipped: every visible cell within d<=5 is lit, plus the phone-side bangs/braid strands
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const o=phone[y][x];if(!o||phoneMask.has(`${x},${y}`))continue;if(dist(x,y)<=5)assert(expLevel[y][x]>0,`face cell (${x},${y}) ${o} inside d<=5 is not lit`);}
for(const [x,y] of [[13,8],[14,8],[15,8],[14,9],[15,9],[16,9],[15,12],[16,12],[15,14],[16,14],[15,16],[16,16],[15,18],[16,18]])assert(expLevel[y][x]>0,`phone-side bang/braid cell (${x},${y}) is not lit`);
const colourSet=new Set(expInfo.map(c=>c.o));assert(colourSet.size>=10,`glow only covers ${colourSet.size} source colours`);
// dark cells (outlines, lashes, dark iris) are attenuated, never cut out
for(const c of expInfo.filter(c=>DARK.includes(c.o))){assert(c.level<=Math.round(GN*c.f*0.4),`dark cell (${c.x},${c.y}) is not attenuated (level ${c.level})`);}
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const o=phone[y][x];if(!o||phoneMask.has(`${x},${y}`)||!DARK.includes(o))continue;const d=dist(x,y),f=fall(d);if(f>=0.5)assert(expLevel[y][x]>=1,`dark cell (${x},${y}) f=${f.toFixed(2)} became a hole`);}
const darkCellsLit=expInfo.filter(c=>DARK.includes(c.o)).length,darkCellsAll=expInfo.length;
// colour: cold white only
for(const hex of [...hexSet]){const {h,s}=hueSat(hex);assert((h>=190&&h<=230&&s<=0.12)||s<0.02,`${hex} is not cold white (hue ${h.toFixed(0)}, sat ${s.toFixed(3)})`);assert(toRgb(hex)[2]>=toRgb(hex)[0]&&toRgb(hex)[2]>=toRgb(hex)[1],`${hex} has a warm/pink component`);}
// not a mask: skin keeps its pink; peak blend of the overlay on #ffebfa
const blend=(base,over,a)=>toRgb(base).map((v,i)=>Math.round(v*(1-a/255)+toRgb(over)[i]*a/255));
const labRgb=rgb=>labOf(colorHex(rgb));
const skinBase='#ffebfa',skinBright=blend(skinBase,'#eef6ff',128),skinDim=blend(skinBase,'#eef6ff',64);
const skinLab0=labOf(skinBase),skinLabB=labRgb(skinBright),skinLabD=labRgb(skinDim);
const chroma=l=>Math.hypot(l[1],l[2]),dE=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
assert(skinLabB[1]>0&&chroma(skinLabB)>=5,`skin at bright peak lost its pink: a*=${skinLabB[1].toFixed(2)} C*=${chroma(skinLabB).toFixed(2)}`);
assert(dE(skinLab0,skinLabB)<=8&&dE(skinLab0,skinLabB)>=3,`skin dE76 at the bright peak ${dE(skinLab0,skinLabB).toFixed(2)} outside 3..8 (r3 white mask was 10.6)`);
assert(dE(skinLab0,skinLabD)>=1.5&&dE(skinLab0,skinLabD)<dE(skinLab0,skinLabB),'dim must be perceptible but weaker than bright on the skin');
const glowMathV={skinBase,skinDim:colorHex(skinDim),skinBright:colorHex(skinBright),dE76:{dim:+dE(skinLab0,skinLabD).toFixed(2),bright:+dE(skinLab0,skinLabB).toFixed(2)},chromaSkin:+chroma(skinLab0).toFixed(2),chromaBright:+chroma(skinLabB).toFixed(2),aStarBright:+skinLabB[1].toFixed(2)};
const levelCounts=levelsUsed.map(l=>({level:l,alphaDim:Math.round(64*l/GN),alphaBright:Math.round(128*l/GN),cells:expInfo.filter(c=>c.level===l).length}));
// manifest table agrees
assert(JSON.stringify(gl.levelTable.map(r=>[r.level,r.alphaDim,r.alphaBright,r.cells]))===JSON.stringify(levelCounts.map(r=>[r.level,r.alphaDim,r.alphaBright,r.cells])),'manifest level table differs from the recompute');
const brightSet=new Set(expInfo.map(c=>`${c.x},${c.y}`)),dimSet=brightSet;
const glowDeltaByClass=gl.perClass;

// ---- byte budget ----
const fourLayerBase64=byteRows.reduce((s,r)=>s+r.base64Bytes,0),fourLayerPngBytes=byteRows.reduce((s,r)=>s+r.pngBytes,0);
assert(fourLayerBase64<=2500,`Four indexed PNGs exceed 2.5KB base64 (${fourLayerBase64} bytes)`);
const cssNames={'char-back':'social-phone-char-back','phone-front':'social-phone-front','glow-dim':'social-phone-glow-dim','glow-bright':'social-phone-glow-bright'};
const declarations=[];for(const [layer,name] of Object.entries(cssNames)){const png=await fs.readFile(path.join(assetDir,manifest.layers[layer].file));declarations.push(`  --${name}: url("data:image/png;base64,${png.toString('base64')}");`);}
const prospectiveCssBytes=Buffer.byteLength(declarations.join('\n')+'\n','utf8');
assert(prospectiveCssBytes<=2500,`prospective data-URI declarations ${prospectiveCssBytes} B exceed 2.5KB`);

// ---- previews ----
const gridW=g=>g[0].length;
function fullRgba(grid){const w=gridW(grid),bytes=Buffer.alloc(w*H*4);for(let y=0;y<H;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,c=grid[y][x];if(c){const rgb=toRgb(c);bytes[i]=rgb[0];bytes[i+1]=rgb[1];bytes[i+2]=rgb[2];bytes[i+3]=255;}}return bytes;}
async function nearestPng(grid,scale){return sharp(fullRgba(grid),{raw:{width:gridW(grid),height:H,channels:4}}).resize(gridW(grid)*scale,H*scale,{kernel:'nearest'}).png().toBuffer();}
const pad=g=>g.map(r=>r.length>=PW?r.slice():[...r,...Array(PW-r.length).fill(null)]);
const legacyCharBackVisual=pad(phone).map(r=>r.slice());for(const key of legacyMask){const [x,y]=key.split(',').map(Number);legacyCharBackVisual[y][x]=null;}for(const c of manifest.hairEvidence.legacyRestoredCells)legacyCharBackVisual[c.y][c.x]=c.color;
const r2CharBackVisual=pad(back).map(r=>r.slice());
async function board(panels,scale,outName,{rowsBg=['#201936','#f8f0fa'],cellPadX=scale===1?24:8,labelH=null}={}){
  const lh=labelH??(scale===1?14:18),cellW=PW*scale+cellPadX*2,cellH=H*scale+lh+8,boardW=cellW*panels.length,boardH=cellH*rowsBg.length;
  const parts=[`<svg xmlns="http://www.w3.org/2000/svg" width="${boardW}" height="${boardH}">`];const comps=[];
  for(let row=0;row<rowsBg.length;row++)for(let col=0;col<panels.length;col++){
    const p=panels[col],x=col*cellW,y=row*cellH,dark=row===0&&rowsBg[0]==='#201936',textColor=dark?'#fdf4ff':'#30243c';
    parts.push(`<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${rowsBg[row]}"/><text x="${x+3}" y="${y+lh-5}" fill="${textColor}" font-family="monospace" font-size="${scale===1?7:11}">${p.label}</text>`);
    comps.push({input:await nearestPng(pad(p.grid),scale),left:x+cellPadX,top:y+lh});
  }
  parts.push('</svg>');const output=path.join(checksDir,outName);await sharp(Buffer.from(parts.join(''))).composite(comps).png().toFile(output);return output;
}
const compose=(glow=null,dx=0)=>composeLayers(glow,dx);
const panels=[{label:'original',grid:phone},{label:'char-back',grid:back},{label:'phone-front',grid:front},{label:'glow-dim',grid:compose('glow-dim')},{label:'glow-bright',grid:compose('glow-bright')}];
const decomposition1x=await board(panels,1,'layer-decomposition-1x.png');
const decomposition4x=await board(panels,4,'layer-decomposition-4x.png');
// ---- r4 glow previews ----
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const glowPixels=(peak,highlightAlpha)=>{const g=Array.from({length:H},()=>Array(PW).fill(null));for(const c of expInfo)g[c.y][c.x]={hex:'#eef6ff',a:Math.round(peak*c.level/GN)};for(const [x,y] of hlCells)g[y][x]={hex:'#f8fcff',a:highlightAlpha};return g;};
for(const [name,peak,highlightAlpha] of [['glow-dim',64,128],['glow-bright',128,255]]){const g=glowPixels(peak,highlightAlpha);for(let y=0;y<H;y++)for(let x=0;x<PW;x++)assert((g[y][x]?.a??0)===(decoded[name][y][x]?.a??0),`${name} preview generator differs from the PNG at (${x},${y})`);}
const heatColours=['#440154','#482878','#3e4989','#31688e','#26828e','#1f9e89','#35b779','#6dcd59','#fde725'];
const heatCell=(x,y)=>hlKey.has(`${x},${y}`)?'#ff3df0':expLevel[y]?.[x]>0?heatColours[expLevel[y][x]]:null;
async function sheet(tiles,{cols,scale,box,outName,labelLines=1,tilePad=8,sheetBg='#ffffff',labelColor='#30243c',overlay=null,minTileW=0}){
  const w=box.x1-box.x0+1,h=box.y1-box.y0+1,tw=w*scale,th=h*scale,lh=14*labelLines+6,rows=Math.ceil(tiles.length/cols),cellW=Math.max(tw+tilePad*2,minTileW),cellH=th+lh+tilePad;
  const svg=[`<svg xmlns="http://www.w3.org/2000/svg" width="${cellW*cols}" height="${cellH*rows}">`];const comps=[];
  for(let i=0;i<tiles.length;i++){
    const t=tiles[i],cx=(i%cols)*cellW,cy=Math.floor(i/cols)*cellH,lines=Array.isArray(t.label)?t.label:[t.label];
    lines.forEach((ln,j)=>svg.push(`<text x="${cx+tilePad}" y="${cy+12+14*j}" fill="${labelColor}" font-family="monospace" font-size="${scale>=12?11:10}">${esc(ln)}</text>`));
    const buf=Buffer.alloc(w*h*4);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=t.cells(x+box.x0,y+box.y0)??t.bg,rgb=toRgb(c),i4=(y*w+x)*4;buf[i4]=rgb[0];buf[i4+1]=rgb[1];buf[i4+2]=rgb[2];buf[i4+3]=255;}
    comps.push({input:await sharp(buf,{raw:{width:w,height:h,channels:4}}).resize(tw,th,{kernel:'nearest'}).png().toBuffer(),left:cx+tilePad,top:cy+lh});
    if(overlay)svg.push(overlay(t,cx+tilePad,cy+lh,scale,box));
  }
  svg.push('</svg>');
  const out=path.join(checksDir,outName),base=await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cellW*cols}" height="${cellH*rows}"><rect width="100%" height="100%" fill="${sheetBg}"/></svg>`)).composite(comps).png().toBuffer();
  await sharp(base).composite([{input:Buffer.from(svg.join('')),left:0,top:0}]).png().toFile(out);return out;
}
const deepBg='#201936',lightBg='#cfc8dc',paperBg='#f8f0fa';
const glowOnly=(g,bg)=>(x,y)=>{const c=g[y]?.[x];return c?blendHex(bg,c.hex,c.a):null;};
const gDim=decoded['glow-dim'],gBright=decoded['glow-bright'];
// 1) glow layers alone, 8x, deep and light backdrops, dim | bright | alpha heat map
{
  const box={x0:2,x1:18,y0:6,y1:19},tiles=[];
  for(const [bg,bn] of [[deepBg,'deep'],[lightBg,'light']]){
    tiles.push({label:`glow-dim a<=64 (${bn})`,bg,cells:glowOnly(gDim,bg)},{label:`glow-bright a<=128 (${bn})`,bg,cells:glowOnly(gBright,bg)},{label:`alpha level map (${bn})`,bg,cells:heatCell});
  }
  var glowLayer8x=await sheet(tiles,{cols:3,scale:8,box,outName:'glow-layer-8x.png',sheetBg:'#ffffff',minTileW:200});
}
// 2) alpha level map 16x with numbers over the faded sprite
{
  const box={x0:2,x1:18,y0:6,y1:19};
  var glowLevels16x=await sheet([{label:['alpha level 1..8 (dim a=8L, bright a=16L)','* = eye highlight (dim a=128, bright a=255), pink dot = centre'],bg:paperBg,cells:(x,y)=>{const h=heatCell(x,y);if(h)return h;const o=phone[y]?.[x];return o&&!phoneMask.has(`${x},${y}`)?blendHex(paperBg,o,70):null;}}],{cols:1,scale:16,box,outName:'glow-alpha-levels-16x.png',labelLines:2,tilePad:6,minTileW:300,overlay:(t,left,top,scale,b)=>{const out=[];for(let y=b.y0;y<=b.y1;y++)for(let x=b.x0;x<=b.x1;x++){const lvl=expLevel[y]?.[x],px=left+(x-b.x0)*scale,py=top+(y-b.y0)*scale;if(hlKey.has(`${x},${y}`))out.push(`<text x="${px+scale/2}" y="${py+scale-4}" fill="#fff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle" stroke="#000" stroke-width="0.6">*</text>`);else if(lvl>0)out.push(`<text x="${px+scale/2}" y="${py+scale-4}" fill="${lvl>=7?'#222':'#fff'}" font-family="monospace" font-size="11" text-anchor="middle">${lvl}</text>`);if(x===10||x===11)if(y===14)out.push(`<circle cx="${px+scale/2}" cy="${py+3}" r="2" fill="#ff3df0"/>`);}return out.join('');}});
}
// 3) original / +dim / +bright: 4x and true-size 1x (1 CSS px per cell)
const glowPanels=[{label:'original',grid:phone},{label:'+glow-dim',grid:compose('glow-dim')},{label:'+glow-bright',grid:compose('glow-bright')}];
const glowCompare4x=await board(glowPanels,4,'glow-compare-4x.png');
const glowCompare1x=await board(glowPanels,1,'glow-compare-1x.png');
// 4) face zoom 16x: original | dim | bright
const faceBox={x0:2,x1:18,y0:5,y1:19};
const glowFace16x=await sheet(glowPanels.map(p=>({label:p.label==='original'?'original (16x)':p.label,bg:paperBg,cells:(x,y)=>p.grid[y]?.[x]??null})),{cols:3,scale:16,box:faceBox,outName:'glow-face-zoom-16x.png',tilePad:6});
// 5) bright-peak candidates 0.40 / 0.50 / 0.60 (+ the fixed dim for reference), face crop 8x
const candidates=[[102,'0.40'],[128,'0.50 REC'],[153,'0.60']];
const candTiles=[{label:['original',' '],bg:paperBg,cells:(x,y)=>phone[y]?.[x]??null},{label:['dim 0.25 (a=64)',`skin dE ${dE(skinLab0,skinLabD).toFixed(1)}`],bg:paperBg,cells:(x,y)=>glowPanels[1].grid[y]?.[x]??null}];
const candidateStats=[];
for(const [pk,lab] of candidates){
  const sk=blend(skinBase,'#eef6ff',pk),skl=labRgb(sk);candidateStats.push({alpha:pk,opacity:+(pk/255).toFixed(3),skinHex:colorHex(sk),skinDE76:+dE(skinLab0,skl).toFixed(2),skinChroma:+chroma(skl).toFixed(2),skinAStar:+skl[1].toFixed(2)});
  const g=composeLayers(glowPixels(pk,255),0);
  candTiles.push({label:[`bright ${lab} a=${pk}`,`skin dE ${dE(skinLab0,skl).toFixed(1)} C* ${chroma(skl).toFixed(1)}`],bg:paperBg,cells:(x,y)=>g[y]?.[x]??null});
}
const glowCandidates8x=await sheet(candTiles,{cols:5,scale:8,box:faceBox,outName:'glow-bright-candidates-8x.png',labelLines:2,tilePad:5,minTileW:176});
// 6) old (r3 pink-white replacement) vs new (r4 overlay), 4x
const legacyDir=path.join(assetDir,'legacy-r3');
const legacyOffsets={'glow-dim':{x:8,y:11},'glow-bright':{x:5,y:9}};
const legacyGrids={};
for(const [name,off] of Object.entries(legacyOffsets)){const bytes=await fs.readFile(path.join(legacyDir,`${name}.png`));const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});legacyGrids[name]=placeCrop(imageGrid(data,info),off);}
const composeLegacy=name=>{const out=composeLayers(null,0);for(let y=0;y<H;y++)for(let x=0;x<PW;x++)if(legacyGrids[name][y][x])out[y][x]=legacyGrids[name][y][x];for(let y=0;y<H;y++)for(let x=0;x<PW;x++)if(front[y][x])out[y][x]=front[y][x];return out;};
const glowOldNew4x=await board([{label:'original',grid:phone},{label:'r3 dim (old)',grid:composeLegacy('glow-dim')},{label:'r3 bright (old)',grid:composeLegacy('glow-bright')},{label:'r4 dim (new)',grid:compose('glow-dim')},{label:'r4 bright (new)',grid:compose('glow-bright')}],4,'glow-old-vs-new-4x.png');
// old-vs-new numbers (what the r3 replacement did to the skin cell vs the r4 overlay at the peak)
const oldNewSkin={r3CoreColour:'#fffdfe',r3dE76:+dE(skinLab0,labOf('#fffdfe')).toFixed(2),r3RingColour:'#fff3f8',r3RingDE76:+dE(skinLab0,labOf('#fff3f8')).toFixed(2),r4BrightPeakDE76:+dE(skinLab0,skinLabB).toFixed(2),r4DimPeakDE76:+dE(skinLab0,skinLabD).toFixed(2)};
const glowDiffusion1x=glowCompare1x,glowDiffusion4x=glowCompare4x;
// braid before/after (4x)
const marks=pad(back).map(r=>r.slice());
const legacyKeys=new Set(manifest.hairEvidence.legacyRestoredCells.map(c=>`${c.x},${c.y}`));
for(const c of restoredNow)marks[c.y][c.x]=c.x===18&&c.y===8?'#ff3df0':legacyKeys.has(`${c.x},${c.y}`)?'#00d5ff':'#ffe500';
const braidPanels=[{label:'original',grid:phone},{label:'r1 char-back',grid:legacyCharBackVisual},{label:`r3 back`,grid:back},{label:'filled marks',grid:marks},{label:'tap +1',grid:compose(null,1)}];
const braidCompare=await board(braidPanels,4,'braid-restore-compare-4x.png');
async function zoomBoard(panelsIn,outName,scale=8,box={x0:12,x1:24,y0:5,y1:19}){
  const cw=(box.x1-box.x0+1)*scale,ch=(box.y1-box.y0+1)*scale,pad2=6,lab=16;
  const parts=[`<svg xmlns="http://www.w3.org/2000/svg" width="${(cw+pad2)*panelsIn.length+pad2}" height="${ch+lab+pad2*2}"><rect width="100%" height="100%" fill="#f8f0fa"/>`];const comps=[];
  for(let i=0;i<panelsIn.length;i++){const left=pad2+i*(cw+pad2);parts.push(`<text x="${left}" y="12" fill="#30243c" font-family="monospace" font-size="10">${panelsIn[i].label}</text>`);
    const full=await nearestPng(pad(panelsIn[i].grid),scale);comps.push({input:await sharp(full).extract({left:box.x0*scale,top:box.y0*scale,width:cw,height:ch}).png().toBuffer(),left,top:lab+pad2});}
  parts.push('</svg>');const output=path.join(checksDir,outName);await sharp(Buffer.from(parts.join(''))).composite(comps).png().toFile(output);return output;
}
const braidZoom=await zoomBoard(braidPanels,'braid-restore-zoom-8x.png');
// tap frames 8x: idle | r2 tap | r3 frame 3 | r3 frame 5, with filled cells outlined
async function tapBoard(outName){
  const s=8,box={x0:12,x1:24,y0:5,y1:19},cw=(box.x1-box.x0+1)*s,ch=(box.y1-box.y0+1)*s,gap=12,lab=30,left0=20;
  const items=[{label:'idle',grid:compose(null,0)},{label:'r2 tap',grid:tapR2,r2:true},{label:'r3 f3 tap',grid:compose(null,1)},{label:'r3 f5 tap',grid:compose(null,1)}];
  const W2=left0+items.length*(cw+gap),H2=lab+ch+70;
  const parts=[`<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}"><rect width="100%" height="100%" fill="#201936"/>`];const comps=[];
  const marks=[];
  for(let i=0;i<items.length;i++){
    const it=items[i],left=left0+i*(cw+gap);
    parts.push(`<text x="${left}" y="11" fill="#fdf4ff" font-family="monospace" font-size="10">${it.label}</text>`);
    for(let x=box.x0;x<=box.x1;x++)parts.push(`<text x="${left+(x-box.x0)*s+s/2}" y="${lab-3}" fill="#bcaed8" font-family="monospace" font-size="6" text-anchor="middle">${x}</text>`);
    parts.push(`<rect x="${left}" y="${lab}" width="${cw}" height="${ch}" fill="#2d2347"/>`);
    comps.push({input:await sharp(await nearestPng(pad(it.grid),s)).extract({left:box.x0*s,top:box.y0*s,width:cw,height:ch}).png().toBuffer(),left,top:lab});
    if(i>0){
      for(const c of restoredNow){const px=left+(c.x-box.x0)*s,py=lab+(c.y-box.y0)*s,shared=c.x===18&&c.y===8;
        if(it.r2&&shared)continue;
        marks.push(`<rect x="${px+0.5}" y="${py+0.5}" width="${s-1}" height="${s-1}" fill="none" stroke="${shared?'#ff3df0':'#ffe500'}" stroke-width="1"/>`);}
      if(it.r2)marks.push(`<rect x="${left+(19-box.x0)*s+0.5}" y="${lab+(8-box.y0)*s+0.5}" width="${s-1}" height="${s-1}" fill="none" stroke="#ff4d4d" stroke-width="1"/>`);
    }
    marks.push(`<rect x="${left+(17-box.x0)*s}" y="${lab-1}" width="${s}" height="2" fill="#00d5ff"/>`);
  }
  const ylab=[];for(let y=box.y0;y<=box.y1;y++)ylab.push(`<text x="${left0-3}" y="${lab+(y-box.y0)*s+6}" fill="#bcaed8" font-family="monospace" font-size="6" text-anchor="end">${y}</text>`);
  const ty=lab+ch+13;
  parts.push(`<text x="4" y="${ty}" fill="#ffe500" font-family="monospace" font-size="9">yellow box: cell copied into char-back (>=2 poses agree)</text>`);
  parts.push(`<text x="4" y="${ty+12}" fill="#ff3df0" font-family="monospace" font-size="9">pink box: shared ear cell (18,8) (now also in phone-front)</text>`);
  parts.push(`<text x="4" y="${ty+24}" fill="#ff8a8a" font-family="monospace" font-size="9">red box in r2: (19,8) was empty = hole in the left ear</text>`);
  parts.push(`<text x="4" y="${ty+36}" fill="#00d5ff" font-family="monospace" font-size="9">cyan tick: column x=17 (char-back only when tapped)</text>`);
  parts.push(`<text x="4" y="${ty+48}" fill="#bcaed8" font-family="monospace" font-size="9">8x, x=12..24 y=5..19; frames 3 and 5 are pixel-identical</text>`);
  parts.push('</svg>');
  const out=path.join(checksDir,outName);
  const base=await sharp(Buffer.from(parts.join(''))).composite(comps).png().toBuffer();
  const overlay=await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W2}" height="${H2}">${marks.join('')}${ylab.join('')}</svg>`)).png().toBuffer();
  await sharp(base).composite([{input:overlay,left:0,top:0}]).png().toFile(out);
  return out;
}
const tapFramesPath=await tapBoard('tap-frames-8x.png');
const hairPreviewPath=path.join(checksDir,'hair-reference-alignment-4x.png');
const hairSvg=['<svg xmlns="http://www.w3.org/2000/svg" width="448" height="112"><rect width="100%" height="100%" fill="#201936"/>'];
const hairInputs=[];const hairLabels=[];
for(const [i,[name,origin]] of Object.entries(Object.entries(origins)).map(([i,pair])=>[Number(i),pair])){const x=i*112+8;hairLabels.push(`<text x="${x}" y="16" fill="#fdf4ff" font-family="monospace" font-size="9">${name} 24×20</text>`);hairInputs.push({input:await sharp(sourcePath).extract({left:origin.x,top:origin.y,width:96,height:80}).png().toBuffer(),left:x,top:24});}
hairSvg.push(...hairLabels,'</svg>');await sharp(Buffer.from(hairSvg.join(''))).composite(hairInputs).png().toFile(hairPreviewPath);

// 17-frame plan: 1-2 idle; 3 tap; 4 idle; 5 tap; 6 idle; 7-8 idle; 9-10 dim; 11 bright; 12 dim; 13 idle; 14-15 dim; 16-17 idle
const framePlan=[];
for(let frame=1;frame<=17;frame++){
  const tap=frame===3||frame===5;
  const glow=frame===11?'glow-bright':[9,10,12,14,15].includes(frame)?'glow-dim':null;
  const activity=tap?'tap':glow==='glow-bright'?'bright':glow?'dim':'idle';
  framePlan.push({frame,activity,phoneDx:tap?1:0,glow});
}
const expectedActivities=['idle','idle','tap','idle','tap','idle','idle','idle','dim','dim','bright','dim','idle','dim','dim','idle','idle'];
assert(framePlan.map(f=>f.activity).join()===expectedActivities.join(),'frame plan differs from the requested table');
const frontPixels=decoded['phone-front'].flat().filter(Boolean).length;
const frameScale=4,frameW=PW*frameScale,frameH=H*frameScale,gap=4,margin=8,headH=30;
const stripW=margin*2+17*frameW+16*gap,stripH=headH+frameH+margin;
const stripSvg=[`<svg xmlns="http://www.w3.org/2000/svg" width="${stripW}" height="${stripH}"><rect width="100%" height="100%" fill="#201936"/>`];const stripInputs=[];
for(let i=0;i<framePlan.length;i++){const f=framePlan[i],x=margin+i*(frameW+gap),grid=compose(f.glow,f.phoneDx);
  assert(grid.flat().filter(Boolean).length>=frontPixels,'frame lost pixels');
  if(f.phoneDx)for(let y=6;y<H;y++)for(let xx=14;xx<PW;xx++)assert(grid[y][xx]===tapFrame[y][xx],`frame ${f.frame} differs from the audited tap frame at (${xx},${y})`);
  stripSvg.push(`<rect x="${x}" y="${headH}" width="${frameW}" height="${frameH}" fill="#2d2347"/><text x="${x}" y="13" fill="#fdf4ff" font-family="monospace" font-size="9">${String(f.frame).padStart(2,'0')} ${f.activity}</text>`);stripInputs.push({input:await nearestPng(grid,frameScale),left:x,top:headH});}
stripSvg.push('</svg>');const timelinePath=path.join(checksDir,'timeline-17-frames-4x.png');await sharp(Buffer.from(stripSvg.join(''))).composite(stripInputs).png().toFile(timelinePath);


// ---- r5 strength candidates (c2 medium / c3 strong) -------------------------------------------
// The shipping glow-dim / glow-bright stay byte-identical (frozen above); everything below only
// audits the graded candidate layers that sit beside them: an independent recompute of the level
// rule from the decoded char-back pixels, every hard constraint, the byte budget, and the
// browser-measured dim->bright visibility floor.
const candidateIds=['c2','c3'],candManifest=gl.strengthCandidates,candFiles=gl.strengthCandidateFiles;
const candidateMeasurements=JSON.parse(await fs.readFile(path.join(checksDir,'glow-strength-candidates-measurements.json'),'utf8'));
assert(candManifest&&candFiles&&candidateIds.every(id=>candManifest[id]&&candFiles[id]),'manifest.glow.strengthCandidates / strengthCandidateFiles must describe c2 and c3');
const factorOf=hex=>{for(const entry of Object.values(gl.classFactors))if(entry.colors.includes(hex))return entry.factor;return gl.classFactors.other.factor;};
const dCentre=(x,y)=>Math.min(...gl.lightCentre.cells.map(([cx,cy])=>Math.hypot(x-cx,y-cy)));
const falloffR5=(p,d)=>{const core=d>=p.coreRadius?0:0.5*(1+Math.cos(Math.PI*d/p.coreRadius));const halo=p.haloTop>0&&d<p.haloRadius?p.haloTop*Math.max(0,1-(d/p.haloRadius)**p.haloPower):0;return Math.max(core,halo);};
const charRgb=Array.from({length:H},(_,y)=>Array.from({length:PW},(_,x)=>decoded['char-back'][y][x]?toRgb(decoded['char-back'][y][x]):null));
const candidateAudit={};
for(const id of candidateIds){
  const c=candManifest[id],files=candFiles[id],cm=candidateMeasurements.dpr1.dimVsBright[id];
  assert(c.levels>=6&&c.levels<=10,`${id} must quantise into 6..10 steps`);
  const cHsv=hueSat(c.overlay),cL=Lstar(c.overlay);
  assert(cHsv.h>=190&&cHsv.h<=230&&cHsv.s<=0.13&&cL>=92,`${id} overlay ${c.overlay} is not a cold white (hue ${cHsv.h.toFixed(1)}, sat ${cHsv.s.toFixed(3)}, L* ${cL.toFixed(2)})`);
  const frames={},cells={};
  for(const which of ['dim','bright']){
    const info=c.bytes[which],box=c.bbox[which],prof=c.profile[which];
    const bytes=await fs.readFile(path.join(assetDir,info.file));
    const metaSharp=await sharp(bytes).metadata();
    assert(metaSharp.format==='png'&&metaSharp.width===box.width&&metaSharp.height===box.height,`${info.file} is ${metaSharp.width}x${metaSharp.height} ${metaSharp.format}, manifest says ${box.width}x${box.height} png`);
    assert(metaSharp.isPalette===true||info.encoding.chosen==='rgba',`${info.file} encoding disagrees with the manifest (${info.encoding.chosen})`);
    const {data,info:img}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const grid=Array.from({length:box.height},()=>Array(box.width).fill(null));
    for(let y=0;y<box.height;y++)for(let x=0;x<box.width;x++){const i=(y*box.width+x)*4,a=data[i+3];if(a)grid[y][x]={hex:colorHex([data[i],data[i+1],data[i+2]]),a};}
    frames[which]={grid,box};
    const list=[];
    for(let y=0;y<H;y++)for(let x=0;x<PW;x++){
      const orig=decoded['char-back'][y][x],cx=x-box.x,cy=y-box.y,got=cx>=0&&cy>=0&&cx<box.width&&cy<box.height?grid[cy][cx]:null;
      if(hlCells.some(([hx,hy])=>hx===x&&hy===y)){assert(got&&got.hex===gl.highlight.color&&got.a===255,`${info.file}: eye catch-light at ${x},${y} must stay ${gl.highlight.color}@255 (got ${got?`${got.hex}@${got.a}`:'nothing'})`);continue;}
      if(!orig){assert(!got,`${info.file} paints (${x},${y}) where char-back is transparent`);continue;}
      if(phoneMask.has(`${x},${y}`)){assert(!got,`${info.file} paints phone-covered cell ${x},${y}`);continue;}
      const d=dCentre(x,y),level=Math.round(c.levels*falloffR5(prof,d)*factorOf(orig)),alpha=level>0?Math.round(prof.peakAlpha*level/c.levels):0;
      if(!alpha){assert(!got,`${info.file} lights (${x},${y}) but the recomputed level is 0`);continue;}
      assert(got,`${info.file} misses (${x},${y}): recomputed alpha ${alpha}`);
      assert(got.a===alpha,`${info.file} alpha at (${x},${y}) is ${got.a}, recomputed ${alpha}`);
      assert(got.hex===c.overlay,`${info.file} colour at (${x},${y}) is ${got.hex}, expected the single overlay ${c.overlay}`);
      list.push({x,y,orig,d,level,alpha});
    }
    cells[which]=list;
    assert(list.length===c.litCells[which],`${id} ${which}: manifest litCells ${c.litCells[which]} vs decoded ${list.length}`);
    assert(info.pngBytes===bytes.length&&info.base64Bytes===bytes.toString('base64').length,`${info.file} byte counts differ from manifest`);
    const svg=await fs.readFile(path.join(assetDir,files[which==='dim'?'dimSvg':'brightSvg']),'utf8');
    assert(svg.includes('shape-rendering="crispEdges"')&&svg.includes(`width="${box.width}" height="${box.height}"`),`${files[which==='dim'?'dimSvg':'brightSvg']} is not a review-only crisp SVG`);
  }
  const brightCells=cells.bright,dimCells=cells.dim;
  const alphas=[...new Set(brightCells.map(v=>v.alpha))].sort((a,b)=>a-b);
  assert(alphas.length>=6&&alphas.length<=10,`${id} uses ${alphas.length} distinct alpha steps`);
  assert(alphas[alphas.length-1]===c.profile.bright.peakAlpha,`${id} centre alpha ${alphas[alphas.length-1]} != declared peak ${c.profile.bright.peakAlpha}`);
  assert(alphas[0]>=8&&alphas[0]<=40,`${id} outermost lit alpha ${alphas[0]} is not a soft outer value`);
  const normal=brightCells.filter(v=>factorOf(v.orig)===1).sort((a,b)=>a.d-b.d);
  for(let i=1;i<normal.length;i++)assert(normal[i].level<=normal[i-1].level,`${id} alpha rebounds at (${normal[i].x},${normal[i].y})`);
  const lit=new Map(brightCells.map(v=>[`${v.x},${v.y}`,v]));
  const seen=new Set(),stack=[`${gl.lightCentre.cells[0][0]},${gl.lightCentre.cells[0][1]}`];
  while(stack.length){const key=stack.pop();if(seen.has(key))continue;seen.add(key);const [x,y]=key.split(',').map(Number);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nk=`${x+dx},${y+dy}`;if(lit.has(nk)&&!seen.has(nk))stack.push(nk);}}
  assert(seen.size===lit.size,`${id} bright frame is not one 8-connected blob (${seen.size}/${lit.size})`);
  let maxEdgeLevel=0;
  for(const v of brightCells)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const k=`${v.x+dx},${v.y+dy}`;if(lit.has(k))continue;const row=decoded['char-back'][v.y+dy];const o=row?row[v.x+dx]:null;if(!o||phoneMask.has(k)||factorOf(o)<1)continue;maxEdgeLevel=Math.max(maxEdgeLevel,v.level);}
  assert(maxEdgeLevel<=3,`${id} touches an unlit normal cell at level ${maxEdgeLevel}, which reads as a hard edge`);
  const dimMap=new Map(dimCells.map(v=>[`${v.x},${v.y}`,v.alpha]));
  for(const v of brightCells)assert(v.alpha>=(dimMap.get(`${v.x},${v.y}`)??0),`${id} bright is dimmer than dim at (${v.x},${v.y})`);
  const darkLit=brightCells.filter(v=>factorOf(v.orig)<1).length;
  assert(darkLit>=15,`${id} attenuates too few dark outline/iris cells (${darkLit})`);
  const fourLayerBase64={'char-back':pngInfos['char-back'].base64Bytes,'phone-front':pngInfos['phone-front'].base64Bytes,[`glow-dim-${id}`]:c.bytes.dim.base64Bytes,[`glow-bright-${id}`]:c.bytes.bright.base64Bytes};
  const adoptionBase64=Object.values(fourLayerBase64).reduce((a,b)=>a+b,0);
  assert(adoptionBase64<=2500,`${id} would push the four data URIs to ${adoptionBase64} base64 bytes (limit 2500)`);
  assert(c.adoptionBytes.totalBase64===adoptionBase64,`${id} adoptionBytes in the manifest is ${c.adoptionBytes.totalBase64}, recomputed ${adoptionBase64}`);
  // real-render visibility floor (browser fixture) plus a sharp-side recompute of the same crop
  assert(cm.meanAbsRgbDelta>=4,`${id} real-render dim->bright meanAbsRgbDelta ${cm.meanAbsRgbDelta} is below the 4.0 visibility floor`);
  assert(candidateMeasurements.dpr2.dimVsBright[id].meanAbsRgbDelta===cm.meanAbsRgbDelta,`${id} DPR1 and DPR2 disagree`);
  const composited=[];
  for(const which of ['dim','bright']){
    const {grid,box}=frames[which],img=charRgb.map(r=>r.map(v=>v?v.slice():null));
    for(let y=0;y<box.height;y++)for(let x=0;x<box.width;x++){const cell=grid[y][x];if(!cell)continue;const gy=y+box.y,gx=x+box.x,base=img[gy][gx];if(!base)continue;const ov=toRgb(cell.hex);img[gy][gx]=base.map((v,i)=>Math.round(v*(1-cell.a/255)+ov[i]*cell.a/255));}
    composited.push(img);
  }
  let cropSum=0;
  // the browser fixture crop is 24x21 css px; y=20 is transparent in both frames, so summing over the
  // 20 decoded rows and dividing by 24*21*3 gives the same number the fixture reports.
  for(let y=0;y<H;y++)for(let x=0;x<=23;x++){const a=composited[0][y][x],b=composited[1][y][x];for(let i=0;i<3;i++)cropSum+=Math.abs((a?a[i]:0)-(b?b[i]:0));}
  const modelMean=+(cropSum/(24*21*3)).toFixed(3);
  assert(Math.abs(modelMean-cm.meanAbsRgbDelta)/cm.meanAbsRgbDelta<=0.2,`${id} sharp-side recompute ${modelMean} disagrees with the browser measurement ${cm.meanAbsRgbDelta} by more than 20%`);
  candidateAudit[id]={label:c.label,overlay:c.overlay,levels:c.levels,profile:c.profile,litCells:c.litCells,bbox:c.bbox,
    centreColourOverSkin:c.colourMath.centre.brightHex,centreDE76VsSkin:c.colourMath.centre.dE76Bright,
    centreDimToBrightDE76:c.colourMath.centre.dE76DimToBright,haloRingAlpha:c.colourMath.haloRing.alphaBright,
    haloRingDropDE76:c.colourMath.haloRing.dE76DropVsCentre,alphaSteps:alphas.length,outermostAlpha:alphas[0],
    maxEdgeLevel,darkCellsAttenuated:darkLit,fourLayerBase64:adoptionBase64,
    browserMeanAbsRgbDelta:cm.meanAbsRgbDelta,browserMaxChannelDelta:cm.maxChannelDelta,browserChangedPixels:cm.changedPixels,
    sharpRecomputedMeanAbsRgbDelta:modelMean,bytes:c.bytes};
}
const candidatePreviewFiles=['glow-strength-candidates-1x-8x.png','glow-strength-candidates-dpr2-8x.png','glow-strength-candidates-table.png'].map(f=>path.join(checksDir,f));
const previewFiles=[glowLayer8x,glowLevels16x,glowCompare4x,glowCompare1x,glowFace16x,glowCandidates8x,glowOldNew4x,timelinePath,decomposition1x,decomposition4x,braidCompare,braidZoom,tapFramesPath,hairPreviewPath];
for(const file of [...previewFiles,...candidatePreviewFiles]){const meta=await sharp(file).metadata();assert(meta.width<=2000&&meta.height<=2000,`${path.basename(file)} exceeds 2000px`);}
const report={
  sourceCrop:{width:W,height:H,sourceScale:4,origins,uniform4xCells:true,socialCanvasMinimum:{width:PW,height:H}},
  palette:{charBackAndPhoneFrontEntries:pngInfos['char-back'].paletteEntries,sharedPalette:true,sourceOpaqueColors:manifest.source.uniqueOpaqueColors,allLayerVisibleColors:new Set([...decoded['char-back'].flat(),...decoded['phone-front'].flat()].filter(Boolean)).size,exactSourcePreserved:true,glowDim:{paletteEntries:pngInfos['glow-dim'].paletteEntries,bitDepth:pngInfos['glow-dim'].bitDepth,tRNSBytes:pngInfos['glow-dim'].trnsBytes},glowBright:{paletteEntries:pngInfos['glow-bright'].paletteEntries,bitDepth:pngInfos['glow-bright'].bitDepth,tRNSBytes:pngInfos['glow-bright'].trnsBytes}},
  fillRule:{rule:'>=2 other poses give the same non-effect colour -> copy',alignment:{happy:'identity',shock:'identity',awkward:'+1 row for y=6..14'},maskCells:phoneMask.size,filledCells:restoredNow.length,filled:restoredNow,threeAgree:restoredNow.filter(c=>c.agree===3).length,twoAgree:restoredNow.filter(c=>c.agree===2),singleVoteCells:singleNow,unfillableCells:[],r2UnionRuleDisagreements:0,effectPalette:[...effectPalette].sort(),headAlignment:hairEvidence},
  leftEdge:{region:'x=14..19, y=6..19',cells:leftRegionCells,transparentHolesWithConsensus:holes.length,wholeCanvasHoles:0,sharedEarCell:[18,8],r2TapEarGap:[19,8]},
  tapFrames:{frames:[3,5],cellsAudited:'x=14..24,y=6..19 (phone-shifted cells compared to phone-front; the rest to the >=2 consensus)',problems:tapProblems.length,column17AllCharBack:true,bezelColourOnColumn17Rows:bezelRows,column16Unchanged:true,transparentCellsX17toX24:transparentTap.length,leftEarComplete:true},
  composition:{visibleSourceCellDifferences:0,phoneFrontMask:'y8: x18,19,21,22; y9: x18..22; y10..19: x17..23 (79 cells, (18,8) shared with char-back)'},
  glow:{revision:'r4 translucent overlay',lightCentre:gl.lightCentre,formula:gl.formula,levelTable:levelCounts,litCells:expInfo.length,dimCells:dimSet.size,brightCells:brightSet.size,peakAlpha:{dim:64,bright:128,dimOpacity:+(64/255).toFixed(4),brightOpacity:+(128/255).toFixed(4)},overlayColour:'#eef6ff',highlightColour:'#f8fcff',highlight:{cells:hlCells,alpha:255,alphaByLayer:{dim:128,bright:255},selectedCandidate:'H1',originalPixels:hlCells.map(([x,y])=>phone[y][x]),originalWhiteEyePixels:originalWhite},sameShape:true,brightIsTwiceDimOnGradientCells:true,brightGreaterThanDimOnHighlights:true,brightSuperset:true,connectivity:{eightConnectedBlobs:1,descentWithin1Level:true,maxEdgeLevelTouchingUnlitNormalCell:maxEdgeLevel},darkAttenuation:{factor:0.3,darkCellsLit:darkCellsLit,irisMidFactor:0.6},skin:glowMathV,oldVsNewSkin:oldNewSkin,candidateBrightPeaks:candidateStats,recommendedBrightPeak:{alpha:128,opacity:0.502},encoding:{dim:{indexedBytes:pngInfos['glow-dim'].bytes,rgbaBytes:pngInfos['glow-dim'].rgbaBytes},bright:{indexedBytes:pngInfos['glow-bright'].bytes,rgbaBytes:pngInfos['glow-bright'].rgbaBytes}},frozenLayersSha256:frozen},
  pngBytes:byteRows,
  aggregate:{pngBytes:fourLayerPngBytes,base64Bytes:fourLayerBase64,base64Limit:2500,prospectiveCssDeclarationsBytes:prospectiveCssBytes,svgInCss:false},
  strengthCandidates:candidateAudit,
  previews:[],
  animationFrames:framePlan
};
for(const file of [...previewFiles,...candidatePreviewFiles]){const m=await sharp(file).metadata();report.previews.push({file:path.relative(themeRoot,file),width:m.width,height:m.height});}
await fs.writeFile(path.join(checksDir,'size-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pngBytes:byteRows,aggregate:report.aggregate,fillRule:{filled:report.fillRule.filledCells,three:report.fillRule.threeAgree,two:report.fillRule.twoAgree.length,single:report.fillRule.singleVoteCells.length},leftEdge:report.leftEdge,tapFrames:report.tapFrames,glow:{lit:report.glow.litCells,levels:levelCounts,peak:report.glow.peakAlpha,skin:glowMathV,oldVsNewSkin:oldNewSkin,candidates:candidateStats,highlight:report.glow.highlight,maxEdgeLevel,edgeCells:edgeCells.length,darkCellsLit,encoding:report.glow.encoding},previews:report.previews},null,2));
console.log(JSON.stringify({strengthCandidates:candidateAudit},null,1));
console.log('PASS: exact visible composite / indexed PNG (glow: 4-bit + tRNS alpha ladder) / alpha 0|255 for base layers / tight crops / shared char+phone palette / >=2-agree fill rule (independent recompute) / no left-region holes / tap frames 3&5 no ghost, no show-through, complete ear / r4 glow overlay (independent level recompute, monotone raised-cosine alpha, one 8-connected blob, no rebound >1 level, soft edge, 6-8 alpha steps, peaks 0.25/0.50, cold-white colours only, dark cells attenuated not cut, H1 eye highlights dim alpha=128 and bright alpha=255 (dim alpha < bright guard), bright>=dim, frozen char-back/phone-front hashes) / r5 glow strength candidates c2 (medium) + c3 (strong): independent level+alpha recompute from the decoded char-back pixels, cold-white overlay (hue 190-230, sat<=0.13, L*>=92), 6-10 alpha steps, monotone falloff, one 8-connected blob, soft edge (edge level <=3), dark outline/iris attenuated, both eye catch-lights at alpha 255 in BOTH frames, bright>=dim cellwise, phone-covered cells never lit, 4-layer data-URI budget, and a browser-measured dim->bright meanAbsRgbDelta >= 4.0 reproduced by a sharp-side recomposite of the same 24x21 crop / byte budget / 17-frame 25-cell previews');
