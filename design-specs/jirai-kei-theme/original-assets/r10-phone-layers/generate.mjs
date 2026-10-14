import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');

const assetDir = path.dirname(fileURLToPath(import.meta.url));
const themeRoot = path.resolve(assetDir, '../..');
const sourcePath = path.join(themeRoot, 'art-references/nso-fandom-desktop-icons-sheet.png');
const checksDir = path.join(themeRoot, 'runtime/checks/r10-phone-layers');
const sourceScale = 4;
const sourceBackground = '#f8f0fa';
const canvas = { width: 24, height: 20 };
const cropOrigins = { phone: {x:302,y:450}, happy: {x:442,y:450}, shock: {x:582,y:450}, awkward: {x:722,y:450} };
const colorHex = (rgb) => `#${rgb.map(v => v.toString(16).padStart(2,'0')).join('')}`;

await fs.mkdir(assetDir, {recursive:true});
await fs.mkdir(checksDir, {recursive:true});
const sourceBuffer = await fs.readFile(sourcePath);
const sourceMeta = await sharp(sourceBuffer).metadata();
if (sourceMeta.width !== 1120 || sourceMeta.height !== 700 || sourceMeta.channels !== 3) throw new Error('Unexpected source sheet size or color model');
const {data: sourceRaw, info: sourceInfo} = await sharp(sourceBuffer).removeAlpha().raw().toBuffer({resolveWithObject:true});
const sample = (x,y) => {
  const i = (y * sourceInfo.width + x) * sourceInfo.channels;
  return colorHex([...sourceRaw.slice(i,i+3)]);
};
function sourceGrid(origin) {
  const rows=[];
  for(let y=0;y<canvas.height;y++){
    const row=[];
    for(let x=0;x<canvas.width;x++){
      const rgb=sample(origin.x+x*sourceScale+2,origin.y+y*sourceScale+2);
      for(let dy=0;dy<sourceScale;dy++)for(let dx=0;dx<sourceScale;dx++){
        if(sample(origin.x+x*sourceScale+dx,origin.y+y*sourceScale+dy)!==rgb)throw new Error(`Non-uniform 4x source cell at (${x},${y}) from crop ${origin.x},${origin.y}`);
      }
      row.push(rgb===sourceBackground?null:rgb);
    }
    rows.push(row);
  }
  return rows;
}
const grids=Object.fromEntries(Object.entries(cropOrigins).map(([name,origin])=>[name,sourceGrid(origin)]));
const phone=grids.phone;

// The front object follows the visible phone body. Rows 10..19 span x=17..23: x=17 is the
// phone's left bezel (symmetric with the x=23 right bezel and the centred ear bumps at x=18..22).
// r3: (18,8) is the phone's left-ear cell AND the hair outline; it is now owned by BOTH layers so that
// the tap frame (phone shifted +1) still has a complete 2-wide left ear instead of a hole at (19,8).
const r1Mask=new Set();
for(const x of [19,21,22])r1Mask.add(`${x},8`);
for(let x=18;x<=22;x++)r1Mask.add(`${x},9`);
for(let y=10;y<20;y++)for(let x=18;x<24;x++)r1Mask.add(`${x},${y}`);
const r2Mask=new Set(r1Mask);
for(let y=10;y<20;y++)r2Mask.add(`17,${y}`);
const sharedEarCell='18,8';
const phoneMask=new Set(r2Mask);
phoneMask.add(sharedEarCell);
const legacyPhoneMask=r1Mask; // round-1 mask, only used for the before/after comparison
const keyOf=(x,y)=>`${x},${y}`;
const sortedKeys=set=>[...set].sort((a,b)=>{const [ax,ay]=a.split(',').map(Number),[bx,by]=b.split(',').map(Number);return ay-by||ax-bx;});
const phoneFront=Array.from({length:canvas.height},()=>Array(canvas.width).fill(null));
for(const key of phoneMask){const [x,y]=key.split(',').map(Number);if(phone[y][x])phoneFront[y][x]=phone[y][x];}

// ---- Braid / hidden-cell restoration: "at least TWO other poses agree on the same hair colour" ----
// Row alignment of each reference to the phone pose. happy/shock: identity. awkward: head+braid sit one
// row lower for y=6..14 (braid rows 15..17 are identical either way), identity elsewhere.
const poseRow={happy:y=>y,shock:y=>y,awkward:y=>(y>=6&&y<=14)?y+1:y};
const poses=['happy','shock','awkward'];
const guardCols=[15,16];
// evidence only (not part of the decision any more): visible braid columns x=15,16 equal at the mapped row
const guard={},guardNoShiftAwkward={};
for(const p of poses)for(let y=6;y<20;y++){
  guard[`${p},${y}`]=guardCols.every(x=>grids[p][poseRow[p](y)][x]===phone[y][x]);
  if(p==='awkward')guardNoShiftAwkward[y]=guardCols.every(x=>grids[p][y][x]===phone[y][x]);
}
// Effect palette: any colour a pose shows at x>=17 that is not a hair colour of the phone pose's visible braid.
const braidPalette=new Set();
for(let y=6;y<20;y++)for(const x of [15,16]){if(phone[y][x])braidPalette.add(phone[y][x]);}
for(let y=0;y<=9;y++)for(let x=13;x<=17;x++)if(phone[y][x])braidPalette.add(phone[y][x]);
const effectByPose={};
for(const p of poses){
  const found=new Set();
  for(let y=0;y<20;y++)for(let x=17;x<24;x++){const c=grids[p][y][x];if(c&&!braidPalette.has(c))found.add(c);}
  effectByPose[p]=[...found].sort();
}
const effectPalette=[...new Set(Object.values(effectByPose).flat())].sort();
const phoneVisibleFarColors=new Set();
for(let y=0;y<20;y++)for(let x=13;x<24;x++){const c=phone[y][x];if(c&&!phoneMask.has(`${x},${y}`))phoneVisibleFarColors.add(c);}
for(const c of effectPalette)if(phoneVisibleFarColors.has(c))throw new Error(`Effect colour ${c} also appears in visible phone-pose hair/head cells`);
function poseVote(pose,x,y){
  const c=grids[pose][poseRow[pose](y)][x];
  if(c===null)return {pose,kind:'bg',value:null};
  if(effectPalette.includes(c))return {pose,kind:'effect',value:c};
  return {pose,kind:'color',value:c};
}
// consensus(x,y): colour with >=2 identical non-effect votes; otherwise bg when >=2 bg votes; otherwise unresolved.
function consensus(x,y){
  const votes=poses.map(p=>poseVote(p,x,y));
  const counts=new Map();
  for(const v of votes)if(v.kind==='color')counts.set(v.value,(counts.get(v.value)||0)+1);
  const colorVotes=votes.filter(v=>v.kind==='color').length,bgVotes=votes.filter(v=>v.kind==='bg').length,effectVotes=votes.filter(v=>v.kind==='effect').length;
  let color=null,agree=0;
  for(const [c,n] of counts)if(n>agree){agree=n;color=c;}
  let verdict;
  if(agree>=2)verdict='restore';
  else if(colorVotes===1)verdict='single-vote';
  else if(colorVotes>=2)verdict='conflict';
  else verdict='empty';
  return {votes,counts:Object.fromEntries(counts),colorVotes,bgVotes,effectVotes,agree,color:agree>=2?color:(colorVotes===1?votes.find(v=>v.kind==='color').value:null),verdict,bgConsensus:bgVotes>=2&&agree<2};
}
// Round-2 "union" rule (kept only to audit it against the >=2 rule): guard-gated, any colour + no bg dissent.
function oldUnionVerdict(x,y){
  const votes=poses.map(p=>{
    if(!guard[`${p},${y}`])return {kind:'guard-fail',value:null};
    const v=poseVote(p,x,y);return v;
  });
  const colorVotes=votes.filter(v=>v.kind==='color').map(v=>v.value),bgVotes=votes.filter(v=>v.kind==='bg').length;
  if(colorVotes.length&&bgVotes===0&&colorVotes.every(v=>v===colorVotes[0]))return {verdict:'restore',color:colorVotes[0],colorVotes:colorVotes.length};
  if(colorVotes.length)return {verdict:'conflict',color:null,colorVotes:colorVotes.length};
  if(bgVotes)return {verdict:'empty-confirmed',color:null,colorVotes:0};
  return {verdict:'unknown-all-effect',color:null,colorVotes:0};
}
const charBack=phone.map(row=>row.slice());
for(const key of phoneMask){const [x,y]=key.split(',').map(Number);charBack[y][x]=null;}
const braidCells=[];
for(const key of sortedKeys(phoneMask)){
  const [x,y]=key.split(',').map(Number),c=consensus(x,y),old=oldUnionVerdict(x,y);
  let fill=null,final=c.verdict;
  if(c.verdict==='restore')fill=c.color;
  else if(c.verdict==='single-vote'){ // default policy: keep the single visible hair colour only when no pose says "empty"
    if(c.bgVotes===0)fill=c.color;
    else final='single-vote-dropped';
  }
  braidCells.push({x,y,phone:phone[y][x],votes:c.votes,counts:c.counts,colorVotes:c.colorVotes,agree:c.agree,verdict:final,color:fill,old,inLegacyMask:legacyPhoneMask.has(key),shared:key===sharedEarCell});
  if(fill)charBack[y][x]=fill;
}
const restored=braidCells.filter(c=>c.color&&c.verdict==='restore');
const singleVote=braidCells.filter(c=>c.verdict==='single-vote'||c.verdict==='single-vote-dropped');
const unresolved=braidCells.filter(c=>c.verdict==='conflict');
const oldRestored=braidCells.filter(c=>c.old.verdict==='restore');
const ruleDiff={
  oldRestoreCount:oldRestored.length,newRestoreCount:restored.length,
  oldRestoreButNotTwoAgree:oldRestored.filter(c=>c.agree<2).map(c=>({x:c.x,y:c.y,color:c.old.color,colorVotes:c.old.colorVotes})),
  twoAgreeButNotOldRestore:restored.filter(c=>c.old.verdict!=='restore').map(c=>({x:c.x,y:c.y,color:c.color,agree:c.agree,oldVerdict:c.old.verdict})),
  oldRestoreWithOnlyTwoVotes:oldRestored.filter(c=>c.agree===2).map(c=>({x:c.x,y:c.y,color:c.color})),
  oldRestoreWithThreeVotes:oldRestored.filter(c=>c.agree===3).length
};
// Cells that need the awkward row-shift to reach two votes (would drop to one vote if the awkward alignment were wrong)
const awkwardDependent=restored.filter(c=>{const others=['happy','shock'].filter(p=>c.votes.find(v=>v.pose===p).kind==='color'&&c.votes.find(v=>v.pose===p).value===c.color).length;return others<2;}).map(c=>({x:c.x,y:c.y,color:c.color}));
const braidConsensus=restored.map(c=>({x:c.x,y:c.y,color:c.color,agree:c.agree}));
// Whole-canvas hole scan: any cell that stays transparent in char-back while >=2 poses give the same hair colour
const holeScan={};
const transparentWithConsensus=[];
for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
  if(charBack[y][x]!==null)continue;
  const c=consensus(x,y);
  if(c.agree>=2)transparentWithConsensus.push({x,y,color:c.color,agree:c.agree});
}
holeScan.wholeCanvasHoles=transparentWithConsensus;
// Left-edge region scan x=14..19, y=6..19 (row-by-row evidence table)
const leftScan=[];
for(let y=6;y<20;y++)for(let x=14;x<=19;x++){
  const c=consensus(x,y),back=charBack[y][x],front=phoneFront[y][x];
  let status;
  if(back!==null)status=phoneMask.has(`${x},${y}`)?(c.agree>=2&&c.color===back?'filled-by-consensus':'filled'):'visible-source';
  else status=c.agree>=2?'HOLE':(c.bgConsensus||c.verdict==='empty'?'bg-confirmed':'transparent-no-consensus');
  leftScan.push({x,y,phone:phone[y][x],back,front,consensus:c.agree>=2?c.color:(c.bgConsensus?'bg':null),agree:c.agree,bgVotes:c.bgVotes,status});
}
holeScan.leftRegion={x:[14,19],y:[6,19],cells:leftScan.length,holes:leftScan.filter(c=>c.status==='HOLE').length,statusCounts:leftScan.reduce((m,c)=>(m[c.status]=(m[c.status]||0)+1,m),{})};

// ---- tap-frame audit (frames 3 and 5): phone-front shifted +1 on a 25-wide canvas ----
const PW=25;
function composeGrid(glowGrid=null,dx=0,front=phoneFront){
  const out=Array.from({length:canvas.height},(_,y)=>[...charBack[y],...Array(PW-canvas.width).fill(null)]);
  if(glowGrid)for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(glowGrid[y][x])out[y][x]=glowGrid[y][x];
  for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){const c=front[y][x];if(c){if(x+dx>=PW)throw new Error('phone clipped by 25-wide canvas');out[y][x+dx]=c;}}
  return out;
}
function tapAudit(frontGrid){
  const tap=composeGrid(null,1,frontGrid),issues=[],checked={x14to17:0,coveredByPhone:0,transparentExplained:0};
  const covered=(x,y)=>x-1>=0&&frontGrid[y][x-1]!==null;
  for(let y=6;y<canvas.height;y++)for(let x=14;x<PW;x++){
    const got=tap[y][x];
    if(covered(x,y)){checked.coveredByPhone++;if(got!==frontGrid[y][x-1])issues.push({x,y,kind:'phone-shift-mismatch',got});continue;}
    if(x>=canvas.width)continue; // x=24 never exists in the base layer
    const c=consensus(x,y),exp=c.agree>=2?c.color:(c.bgConsensus||c.verdict==='empty'&&c.bgVotes>=2?null:phone[y][x]);
    if(x<=17)checked.x14to17++;
    if(got!==exp&&!(c.agree<2&&!c.bgConsensus&&got===phone[y][x]))issues.push({x,y,kind:got===null?'background-show-through':'unexpected-pixel',got,expected:exp,agree:c.agree});
    if(got===null)checked.transparentExplained++;
  }
  // left ear: tap row 8 must show a complete 2-wide left ear (cells 19,20) next to the hair outline at 18
  const earOk=tap[8][19]===phone[8][18]&&tap[8][20]===phone[8][19];
  // column x=17 remnant check: x=17 must be char-back only; phone bezel colour may appear only at the braid-end outline (17,18)
  const bezel=phone[11][17],col17=[];
  for(let y=8;y<20;y++){col17.push(tap[y][17]);if(tap[y][17]!==charBack[y][17])issues.push({x:17,y,kind:'column-17-not-char-back',got:tap[y][17]});}
  const bezelOnCol17=[];for(let y=8;y<20;y++)if(tap[y][17]===bezel)bezelOnCol17.push(y);
  const col16Changed=[];for(let y=6;y<20;y++)if(tap[y][16]!==phone[y][16])col16Changed.push(y);
  return {tap,issues,checked,earOk,column17:col17,bezelColourRowsOnX17:bezelOnCol17,column16ChangedRows:col16Changed};
}
const tapNow=tapAudit(phoneFront);
const r2Front=phone.map((row,y)=>row.map((c,x)=>r2Mask.has(`${x},${y}`)?c:null));
const tapR2=tapAudit(r2Front);
if(tapNow.issues.length)throw new Error('tap audit issues: '+JSON.stringify(tapNow.issues));
if(!tapNow.earOk)throw new Error('tap-frame left ear is incomplete');

// ---- Glow layers (r4): translucent cold-white OVERLAY, alpha falls off smoothly from the face centre ----
// Both layers share ONE shape (same quantised level per cell); they differ only in the peak alpha. Nothing is
// replaced: the overlay is blended over char-back by the compositor, the original pixel colour stays visible.
const toRgbHex=hex=>hex.slice(1).match(/../g).map(v=>parseInt(v,16));
const lin=v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;};
function labOfRgb(rgb){
  const [r,g,b]=rgb.map(lin);
  const X=(0.4124564*r+0.3575761*g+0.1804375*b)/0.95047,Y=0.2126729*r+0.7151522*g+0.0721750*b,Z=(0.0193339*r+0.1191920*g+0.9503041*b)/1.08883;
  const f=t=>t>216/24389?Math.cbrt(t):(24389/27*t+16)/116;
  return [116*f(Y)-16,500*(f(X)-f(Y)),200*(f(Y)-f(Z))];
}
const labOf=hex=>labOfRgb(toRgbHex(hex));
const Lstar=hex=>labOf(hex)[0];
const dE76rgb=(a,b)=>{const A=labOfRgb(a),B=labOfRgb(b);return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]);};
const hueOf=hex=>{const [,a,b]=labOf(hex);return (Math.atan2(b,a)*180/Math.PI+360)%360;};
const chromaOfRgb=rgb=>{const [,a,b]=labOfRgb(rgb);return Math.hypot(a,b);};
const hsvOf=hex=>{const [r,g,b]=toRgbHex(hex).map(v=>v/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360;}return {h,s:mx?d/mx:0,v:mx};};
const skinColor='#ffebfa',pinkColor='#f4b7d9',screenBase='#ff7baf';
if(phone[11][18]!==screenBase)throw new Error('Unexpected screen base colour');
const glowSpec={
  centreCells:[[10,14],[11,14]],lineX:10.5,
  radius:9,levels:8,
  overlayColor:'#eef6ff',highlightColor:'#f8fcff',
  peakAlpha:{dim:64,bright:128},
  highlightAlpha:{dim:128,bright:255},
  candidateBrightPeakAlpha:[102,128,153],recommendedBrightPeakAlpha:128,
  classFactor:{outline:{colors:['#7b5f80'],factor:0.3},irisDark:{colors:['#6673aa'],factor:0.3},irisMid:{colors:['#87a5d9'],factor:0.6},other:{colors:[],factor:1}},
  highlightCells:[[9,12],[14,12]]
};
const {radius:GR,levels:GN}=glowSpec;
// distance = Euclidean distance to the nearest of the two centre cells (10,14)/(11,14): dx = 10-x (x<=10) | x-11 (x>=11), dy = y-14
const glowDist=(x,y)=>{const dx=x<=10?10-x:x-11,dy=y-14;return Math.hypot(dx,dy);};
const falloff=d=>d>=GR?0:0.5*(1+Math.cos(Math.PI*d/GR)); // raised cosine, 1 at d=0, 0 (zero slope) at d=R
const factorOf=orig=>glowSpec.classFactor.outline.colors.includes(orig)?glowSpec.classFactor.outline.factor:glowSpec.classFactor.irisDark.colors.includes(orig)?glowSpec.classFactor.irisDark.factor:glowSpec.classFactor.irisMid.colors.includes(orig)?glowSpec.classFactor.irisMid.factor:1;
const classOf=orig=>glowSpec.classFactor.outline.colors.includes(orig)?'outline':glowSpec.classFactor.irisDark.colors.includes(orig)?'irisDark':glowSpec.classFactor.irisMid.colors.includes(orig)?'irisMid':'other';
// eye (iris) cells read from the actual pixels: the blue-ramp cells #6673aa / #87a5d9 / #bbddff inside the eye boxes
const eyeBoxes=[[7,9,11,14],[12,14,11,14]]; // x0,x1,y0,y1 (lash row 11 + eye rows 12..14)
const irisColors=['#6673aa','#87a5d9','#bbddff'];
const irisCells=[];
for(const [x0,x1,y0,y1] of eyeBoxes)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(irisColors.includes(phone[y][x]))irisCells.push({x,y,orig:phone[y][x]});
const irisBlobs=[irisCells.filter(c=>c.x<=10),irisCells.filter(c=>c.x>=12)];
for(const b of irisBlobs){
  const xs=[...new Set(b.map(c=>c.x))].sort((a,c)=>a-c),ys=[...new Set(b.map(c=>c.y))].sort((a,c)=>a-c);
  if(b.length!==6||xs.length!==2||ys.join()!=='12,13,14')throw new Error('Unexpected iris shape: '+JSON.stringify(b));
}
const irisBlock=irisBlobs.map(b=>({x0:Math.min(...b.map(c=>c.x)),x1:Math.max(...b.map(c=>c.x)),y0:12,y1:14}));
if(irisBlock[1].x0-irisBlock[0].x0!==5)throw new Error('Iris translation between the eyes changed');
const highlightCells=irisBlock.map(b=>[b.x1,b.y0]); // upper-right iris cell of each eye (same relative cell in both eyes)
if(JSON.stringify(highlightCells)!==JSON.stringify(glowSpec.highlightCells))throw new Error('Highlight cells differ from the spec');
for(const [x,y] of highlightCells){
  if(phone[y][x]!=='#6673aa')throw new Error(`Highlight cell (${x},${y}) is not a dark iris pixel`);
  if(Lstar(phone[y][x])>=60)throw new Error('Highlight cell is not dark');
}
// original near-white pixels inside the eye boxes (existing highlight / sclera) - the new highlight must not replace them
const originalWhiteInEye=[];
for(const [x0,x1,y0,y1] of eyeBoxes)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(phone[y][x]&&Lstar(phone[y][x])>=85&&!irisColors.includes(phone[y][x]))originalWhiteInEye.push({x,y,color:phone[y][x],L:+Lstar(phone[y][x]).toFixed(1)});
const glowCells=[],levelGrid=Array.from({length:canvas.height},()=>Array(canvas.width).fill(0)),tieMargin=[];
for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
  const orig=phone[y][x];if(!orig||phoneMask.has(keyOf(x,y)))continue;
  const d=glowDist(x,y),f=falloff(d),k=factorOf(orig),raw=GN*f*k,level=Math.round(raw);
  if(f>0)tieMargin.push(Math.abs(raw-Math.floor(raw)-0.5));
  if(level>0){levelGrid[y][x]=level;glowCells.push({x,y,orig,d:+d.toFixed(4),f:+f.toFixed(5),k,cls:classOf(orig),raw:+raw.toFixed(4),level});}
}
if(Math.min(...tieMargin)<1e-6)throw new Error('A glow cell sits on a rounding tie: '+Math.min(...tieMargin));
glowCells.sort((a,b)=>a.d-b.d||a.y-b.y||a.x-b.x);
const alphaFor=(peak,level)=>Math.round(peak*level/GN);
const glowEntry=(hex,a)=>`${hex}@${a}`;
function glowGridFor(peak,highlightAlpha){
  const grid=Array.from({length:canvas.height},()=>Array(canvas.width).fill(null));
  for(const c of glowCells)grid[c.y][c.x]=glowEntry(glowSpec.overlayColor,alphaFor(peak,c.level));
  for(const [x,y] of highlightCells)grid[y][x]=glowEntry(glowSpec.highlightColor,highlightAlpha);
  return grid;
}
const glowPalette=(peak,highlightAlpha)=>[glowEntry(glowSpec.overlayColor,0),...Array.from({length:GN},(_,i)=>glowEntry(glowSpec.overlayColor,alphaFor(peak,i+1))),glowEntry(glowSpec.highlightColor,highlightAlpha)];

// ---- r5 glow-strength candidates: parameterised cold-white overlay profiles ----
// Same level rule as r4 (level = round(N * g(d) * k), alpha = round(peak * level / N)) and the
// same class attenuation / eye catch-light / phone occlusion rules. The only new freedom is the
// falloff shape: a tight raised-cosine core plus a wider, flatter halo, and (for c2/c3) a halo that
// reaches further on the bright frame so the lit patch visibly spreads.
//   c1 = selected baseline (single raised cosine, R=9, peaks 64/128, #eef6ff); H1 eye highlights are dim alpha 128 / bright alpha 255.
const glowCandidateSpecs={
  c2:{id:'c2',label:'medium',overlay:'#e8f2ff',highlight:glowSpec.highlightColor,levels:9,
      dim:{coreRadius:6,haloRadius:6,haloTop:0.6,haloPower:3,peakAlpha:77},
      bright:{coreRadius:6,haloRadius:10,haloTop:0.6,haloPower:3,peakAlpha:204}},
  c3:{id:'c3',label:'strong',overlay:'#e2eeff',highlight:glowSpec.highlightColor,levels:10,
      dim:{coreRadius:5,haloRadius:5,haloTop:0.52,haloPower:3,peakAlpha:90},
      bright:{coreRadius:5,haloRadius:10.5,haloTop:0.52,haloPower:3,peakAlpha:242}}
};
function glowFalloffAt(p,d){
  const core=d>=p.coreRadius?0:0.5*(1+Math.cos(Math.PI*d/p.coreRadius));
  const halo=p.haloTop>0&&d<p.haloRadius?p.haloTop*Math.max(0,1-(d/p.haloRadius)**p.haloPower):0;
  return Math.max(core,halo);
}
const glowCandidates={};
for(const [id,spec] of Object.entries(glowCandidateSpecs)){
  const frames={};
  const highlightKeys=new Set(highlightCells.map(([x,y])=>keyOf(x,y)));
  for(const which of ['dim','bright']){
    const p=spec[which];
    const grid=Array.from({length:canvas.height},()=>Array(canvas.width).fill(null));
    const list=[];
    for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
      const orig=phone[y][x];if(!orig||phoneMask.has(keyOf(x,y))||highlightKeys.has(keyOf(x,y)))continue;
      const d=glowDist(x,y),f=glowFalloffAt(p,d),k=factorOf(orig),raw=spec.levels*f*k,level=Math.round(raw);
      if(level>0)list.push({x,y,orig,d:+d.toFixed(4),f:+f.toFixed(5),k,cls:classOf(orig),raw:+raw.toFixed(4),level,alpha:Math.round(p.peakAlpha*level/spec.levels),tie:Math.abs(raw-Math.floor(raw)-0.5)<1e-9});
    }
    list.sort((a,b)=>a.d-b.d||a.y-b.y||a.x-b.x);
    for(const c of list)grid[c.y][c.x]=glowEntry(spec.overlay,c.alpha);
    for(const [x,y] of highlightCells)grid[y][x]=glowEntry(spec.highlight,255);
    frames[which]={grid,list,p,peakAlpha:p.peakAlpha};
  }
  const alphaAlphas=[...new Set(frames.bright.list.map(c=>c.alpha))].sort((a,b)=>a-b);
  const alphaAlphasDim=[...new Set(frames.dim.list.map(c=>c.alpha))].sort((a,b)=>a-b);
  // per-frame palettes keep each PLTE at <=16 entries so the PNG stays 4-bit indexed
  for(const which of ['dim','bright']){
    const used=[...new Set(frames[which].list.map(c=>c.alpha))].sort((a,b)=>a-b);
    frames[which].palette=[glowEntry(spec.overlay,0),...used.map(a=>glowEntry(spec.overlay,a)),glowEntry(spec.highlight,255)];
  }
  const palette=frames.bright.palette;
  // per-level table (dim and bright have different level maps, so report both)
  const tableFor=which=>{
    const list=frames[which].list,levels=[...new Set(list.map(c=>c.level))].sort((a,b)=>a-b);
    return levels.map(level=>{const cells=list.filter(c=>c.level===level);return {level,alpha:cells[0].alpha,opacity:+(cells[0].alpha/255).toFixed(4),cells:cells.length,dRange:[Math.min(...cells.map(c=>c.d)),Math.max(...cells.map(c=>c.d))]};});
  };
  // ring profile: average level/alpha by integer distance band
  const rings=[];
  for(let band=0;band<=Math.ceil(Math.max(spec.dim.haloRadius,spec.bright.haloRadius));band++){
    const inBand=which=>frames[which].list.filter(c=>c.d>=band&&c.d<band+1);
    const d0=inBand('dim'),b0=inBand('bright');if(!d0.length&&!b0.length)continue;
    rings.push({band,cellsBright:b0.length,cellsDim:d0.length,
      avgLevelBright:b0.length?+(b0.reduce((s,c)=>s+c.level,0)/b0.length).toFixed(2):null,
      avgLevelDim:d0.length?+(d0.reduce((s,c)=>s+c.level,0)/d0.length).toFixed(2):null,
      avgAlphaBright:b0.length?Math.round(b0.reduce((s,c)=>s+c.alpha,0)/b0.length):null,
      avgAlphaDim:d0.length?Math.round(d0.reduce((s,c)=>s+c.alpha,0)/d0.length):null});
  }
  const auditFrame=which=>{
    const list=frames[which].list;
    const normal=list.filter(c=>c.k===1).sort((a,b)=>a.d-b.d);
    let monotone=true;for(let i=1;i<normal.length;i++)if(normal[i].level>normal[i-1].level)monotone=false;
    const lit=new Map(list.map(c=>[keyOf(c.x,c.y),c]));
    const seen=new Set(),stack=[keyOf(...glowSpec.centreCells[0])];
    while(stack.length){const key=stack.pop();if(seen.has(key))continue;seen.add(key);const [x,y]=key.split(',').map(Number);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const n=keyOf(x+dx,y+dy);if(lit.has(n)&&!seen.has(n))stack.push(n);}}
    const levelAt=(x,y)=>lit.get(keyOf(x,y))?.level??0;
    let maxEdgeAlpha=0,maxEdgeLevel=0;
    for(const c of list)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=c.x+dx,ny=c.y+dy;if(nx<0||ny<0||nx>=canvas.width||ny>=canvas.height||(!dx&&!dy))continue;const o=phone[ny][nx];if(!o||phoneMask.has(keyOf(nx,ny))||levelAt(nx,ny)>0)continue;if(factorOf(o)<1)continue;maxEdgeAlpha=Math.max(maxEdgeAlpha,c.alpha);maxEdgeLevel=Math.max(maxEdgeLevel,c.level);}
    const darks=list.filter(c=>c.k<1&&factorOf(c.orig)<1);
    return {monotone,connectedBlob:seen.size===lit.size,blobCells:seen.size,litCells:list.length,
      maxEdgeAlpha,maxEdgeLevel,ticks:list.filter(c=>c.tie).length,
      minHaloAlpha:Math.min(...list.map(c=>c.alpha)),darkCells:darks.length,
      everyBrightAtLeastDim:frames.bright.list.length>=frames.dim.list.length&&frames.dim.list.every(d=>{const b=frames.bright.list.find(e=>e.x===d.x&&e.y===d.y);return b&&b.alpha>=d.alpha;})};
  };
  const audit={dim:auditFrame('dim'),bright:auditFrame('bright')};
  audit.pairwiseBrightAtLeastDim=frames.dim.list.every(d=>{const b=frames.bright.list.find(e=>e.x===d.x&&e.y===d.y);return !!b&&b.alpha>=d.alpha;});
  // colour math against the skin tone
  const skinRgb=toRgbHex(skinColor);
  const centreCell=frames.bright.list.find(c=>c.d===0)??frames.bright.list[0];
  const blendLocal=(base,over,a)=>base.map((v,i)=>Math.round(v*(1-a/255)+over[i]*a/255));
  const peakBlend=(peak,over)=>{const o=toRgbHex(over);return colorHex(blendLocal(skinRgb,o,peak));};
  const centreBrightHex=peakBlend(centreCell.alpha,spec.overlay);
  const centreDimHex=peakBlend(Math.round(spec.dim.peakAlpha*centreCell.level/spec.levels),spec.overlay);
  const haloRingBright=frames.bright.list.filter(c=>c.d>=spec.bright.coreRadius&&c.d<=spec.bright.coreRadius+2&&c.k===1);
  const haloAlphaBright=haloRingBright.length?Math.round(haloRingBright.reduce((s,c)=>s+c.alpha,0)/haloRingBright.length):null;
  const haloHexBright=haloAlphaBright!=null?peakBlend(haloAlphaBright,spec.overlay):null;
  const overlayHsvC=hsvOf(spec.overlay);
  const colourMath={
    overlay:{hex:spec.overlay,hue:+overlayHsvC.h.toFixed(1),saturation:+overlayHsvC.s.toFixed(4),L:+Lstar(spec.overlay).toFixed(2),deltaVsBaseline:spec.overlay===glowSpec.overlayColor?'same as c1':'colder/more saturated than c1 #eef6ff'},
    skinBase:skinColor,
    centreCell:{x:centreCell.x,y:centreCell.y,alphaDim:Math.round(spec.dim.peakAlpha*centreCell.level/spec.levels),alphaBright:centreCell.alpha},
    centre:{dimHex:centreDimHex,brightHex:centreBrightHex,
      dE76Dim:+dE76rgb(skinRgb,toRgbHex(centreDimHex)).toFixed(2),dE76Bright:+dE76rgb(skinRgb,toRgbHex(centreBrightHex)).toFixed(2),
      dE76DimToBright:+dE76rgb(toRgbHex(centreDimHex),toRgbHex(centreBrightHex)).toFixed(2),
      LDim:+Lstar(centreDimHex).toFixed(2),LBright:+Lstar(centreBrightHex).toFixed(2),LBase:+Lstar(skinColor).toFixed(2),
      dL:+((Lstar(centreBrightHex))-Lstar(skinColor)).toFixed(2),
      aStarBright:+labOf(centreBrightHex)[1].toFixed(2),bStarBright:+labOf(centreBrightHex)[2].toFixed(2),
      hueBright:+hueOf(centreBrightHex).toFixed(1),hueBase:+hueOf(skinColor).toFixed(1)},
    haloRing:{approach:'mean alpha of the class-1 cells with coreRadius <= d <= coreRadius+2 (the band just outside the core)',cells:haloRingBright.length,alphaBright:haloAlphaBright,brightHex:haloHexBright,
      dE76Bright:haloHexBright!=null?+dE76rgb(skinRgb,toRgbHex(haloHexBright)).toFixed(2):null,
      dE76DropVsCentre:haloHexBright!=null?+(dE76rgb(skinRgb,toRgbHex(centreBrightHex))-dE76rgb(skinRgb,toRgbHex(haloHexBright))).toFixed(2):null},
    maxAdjacentStep:Math.max(0,...alphaAlphas.map((v,i)=>i?v-alphaAlphas[i-1]:0)),
    alphaLevelsUsed:{dim:alphaAlphasDim.length,bright:alphaAlphas.length},
    unreachableNote:'A cold-white overlay cannot reach dE76 11..16 on #ffebfa: blending #ffebfa (L* 94.98, a* +9.32) with any in-spec cold white tops out at dE76 = dE76(#ffebfa, overlay) < 11.2 even at alpha 255, and r4 already caps the bright peak at dE76 <= 8 to avoid the r3 white-mask look. The perceptible signal is the dim->bright step, reported above as dE76DimToBright.'
  };
  glowCandidates[id]={id,kind:'strength-candidate',basedOn:'c1 (current glow-dim/glow-bright, unchanged)',label:spec.label,overlay:spec.overlay,highlight:spec.highlight,levels:spec.levels,
    profile:{dim:spec.dim,bright:spec.bright},
    falloff:'core: raised cosine of d/coreRadius (1 at d=0, 0 at d=coreRadius); halo: haloTop * (1-(d/haloRadius)^haloPower) for d<haloRadius, else 0; g(d) = max(core, halo); level = round(levels*g(d)*k(class)); alpha8 = round(peakAlpha*level/levels)',
    litCells:{dim:frames.dim.list.length,bright:frames.bright.list.length},
    bbox:{dim:null,bright:null},
    alphaTable:{dim:tableFor('dim'),bright:tableFor('bright')},
    rings,audit,colourMath,palette,frames};
}
const layers={
  'char-back':charBack,
  'phone-front':phoneFront,
  'glow-dim':glowGridFor(glowSpec.peakAlpha.dim,glowSpec.highlightAlpha.dim),
  'glow-bright':glowGridFor(glowSpec.peakAlpha.bright,glowSpec.highlightAlpha.bright)
};
// Candidate glow layers are written to disk but deliberately kept OUT of manifest.layers: the
// shipping four-layer set (and its 2.5KB data-URI budget) must stay exactly what it is today.
const candidateLayers=Object.fromEntries(Object.entries(glowCandidates).flatMap(([id,c])=>[[`glow-dim-${id}`,c.frames.dim.grid],[`glow-bright-${id}`,c.frames.bright.grid]]));
const glowLevelTable=Array.from({length:GN},(_,i)=>{
  const level=i+1,cells=glowCells.filter(c=>c.level===level);
  return {level,alphaDim:alphaFor(glowSpec.peakAlpha.dim,level),alphaBright:alphaFor(glowSpec.peakAlpha.bright,level),opacityDim:+(alphaFor(glowSpec.peakAlpha.dim,level)/255).toFixed(4),opacityBright:+(alphaFor(glowSpec.peakAlpha.bright,level)/255).toFixed(4),cells:cells.length,dRange:cells.length?[Math.min(...cells.map(c=>c.d)),Math.max(...cells.map(c=>c.d))]:null};
});
// colour math: what the overlay does to the main source colours at the bright peak (alpha blend in sRGB, as a browser does)
const blendRgb=(base,over,a)=>base.map((v,i)=>Math.round(v*(1-a/255)+over[i]*a/255));
const overlayRgb=toRgbHex(glowSpec.overlayColor);
const glowByClass={};
for(const [name,orig] of [['skin',skinColor],['pink',pinkColor],['cream',phone[2][8]],['lavLight','#ddbfee'],['lav','#c4a3ef'],['bow','#d94cb4'],['outline','#7b5f80']]){
  const base=toRgbHex(orig),row={original:orig,L:+Lstar(orig).toFixed(2),chroma:+chromaOfRgb(base).toFixed(2),hue:+hueOf(orig).toFixed(1)};
  for(const [label,a] of [['dimPeak',glowSpec.peakAlpha.dim],['brightPeak',glowSpec.peakAlpha.bright]]){
    const m=blendRgb(base,overlayRgb,a),mh=colorHex(m);
    row[label]={alpha:a,result:mh,dE76:+dE76rgb(base,m).toFixed(2),dL:+(Lstar(mh)-Lstar(orig)).toFixed(2),chroma:+chromaOfRgb(m).toFixed(2),hue:+hueOf(mh).toFixed(1)};
  }
  glowByClass[name]=row;
}
const overlayHsv=hsvOf(glowSpec.overlayColor),highlightHsv=hsvOf(glowSpec.highlightColor);
const glowMath={
  overlay:{hex:glowSpec.overlayColor,hue:+overlayHsv.h.toFixed(1),saturation:+overlayHsv.s.toFixed(4),L:+Lstar(glowSpec.overlayColor).toFixed(2)},
  highlight:{hex:glowSpec.highlightColor,hue:+highlightHsv.h.toFixed(1),saturation:+highlightHsv.s.toFixed(4),L:+Lstar(glowSpec.highlightColor).toFixed(2)},
  skinAfterBrightPeak:glowByClass.skin.brightPeak,
  oldR3:{ring:'#fff3f8',core:'#fffdfe',skinDE76Ring:6.2,skinDE76Core:10.6}
};
const dimCoords=glowCells.map(c=>[c.x,c.y]),brightCoords=dimCoords;
// connectivity / descent audit (also recomputed independently in verify.mjs)
{
  const lit=new Map(glowCells.map(c=>[keyOf(c.x,c.y),c]));
  const seen=new Set(),stack=[keyOf(...glowSpec.centreCells[0])];
  while(stack.length){const k=stack.pop();if(seen.has(k))continue;seen.add(k);const [x,y]=k.split(',').map(Number);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const n=keyOf(x+dx,y+dy);if(lit.has(n)&&!seen.has(n))stack.push(n);}}
  if(seen.size!==lit.size)throw new Error(`Glow is not one 8-connected blob: ${seen.size}/${lit.size}`);
  for(const c of glowCells){
    if(c.d===0)continue;
    let ok=false;
    for(let dy=-1;dy<=1&&!ok;dy++)for(let dx=-1;dx<=1&&!ok;dx++){const n=lit.get(keyOf(c.x+dx,c.y+dy));if(n&&n.d<c.d&&c.level<=n.level+1)ok=true;}
    if(!ok)throw new Error(`Glow cell (${c.x},${c.y}) has no closer lit neighbour within one level`);
  }
}

function bbox(grid){
  let minX=canvas.width,minY=canvas.height,maxX=-1,maxY=-1;
  for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(grid[y][x]){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  if(maxX<0)throw new Error('Cannot crop an empty layer');
  return {x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1};
}
function cropGrid(grid,box){return grid.slice(box.y,box.y+box.height).map(row=>row.slice(box.x,box.x+box.width));}
function uniqueColors(gridsToScan){return [...new Set(gridsToScan.flatMap(g=>g.flat().filter(Boolean)))].sort();}
const sourcePalette=uniqueColors([phone]);
const characterPhonePalette=[sourceBackground,...sourcePalette];
const layerPalettes={
  'char-back':characterPhonePalette,
  'phone-front':characterPhonePalette,
  'glow-dim':glowPalette(glowSpec.peakAlpha.dim,glowSpec.highlightAlpha.dim),
  'glow-bright':glowPalette(glowSpec.peakAlpha.bright,glowSpec.highlightAlpha.bright),
  ...Object.fromEntries(Object.entries(glowCandidates).flatMap(([id,c])=>[[`glow-dim-${id}`,c.frames.dim.palette],[`glow-bright-${id}`,c.frames.bright.palette]]))
};
if(characterPhonePalette.length>256)throw new Error(`Indexed character/phone palette too large: ${characterPhonePalette.length}`);

const crcTable=Uint32Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);return c>>>0;});
function crc32(buf){let c=0xffffffff;for(const b of buf)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type,'ascii'),len=Buffer.alloc(4),crc=Buffer.alloc(4);len.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([name,data])));return Buffer.concat([len,name,data,crc]);}
function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
// palette entries are 'hex' (opaque layers; only index 0 is transparent) or 'hex@alpha' (glow layers; per-index alpha via tRNS)
const palHex=entry=>entry.split('@')[0],palAlpha=(entry,i)=>entry.includes('@')?Number(entry.split('@')[1]):(i===0?0:255);
function encodeIndexedPng(grid,paletteColors,filterTypes=null){
  const height=grid.length,width=grid[0].length;
  const bitDepth=paletteColors.length<=2?1:paletteColors.length<=4?2:paletteColors.length<=16?4:8;
  const rowBytes=Math.ceil(width*bitDepth/8),index=new Map(paletteColors.map((color,i)=>[color,i]));
  const rawRows=grid.map(row=>{const packed=Buffer.alloc(rowBytes);for(let x=0;x<width;x++){const color=row[x],idx=color===null?0:index.get(color);if(idx===undefined)throw new Error(`Missing palette entry for ${color}`);const bit=x*bitDepth,byte=bit>>3,shift=8-bitDepth-(bit&7);packed[byte]|=idx<<shift;}return packed;});
  const filtered=[];let prior=Buffer.alloc(rowBytes);
  if(filterTypes&&filterTypes.length!==rawRows.length)throw new Error(`PNG forced filter schedule has ${filterTypes.length} rows, expected ${rawRows.length}`);
  for(let rowIndex=0;rowIndex<rawRows.length;rowIndex++){
    const raw=rawRows[rowIndex],forcedType=filterTypes?.[rowIndex];
    let best=null,bestScore=Infinity,bestType=0;
    const candidateTypes=forcedType===undefined?[0,1,2,3,4]:[forcedType];
    for(const type of candidateTypes){
      if(type<0||type>4)throw new Error(`Invalid PNG filter type ${type} at row ${rowIndex}`);
      const row=Buffer.alloc(rowBytes);let score=0;
      for(let x=0;x<rowBytes;x++){
        const left=x?raw[x-1]:0,up=prior[x],ul=x?prior[x-1]:0;
        const pred=type===0?0:type===1?left:type===2?up:type===3?Math.floor((left+up)/2):paeth(left,up,ul);
        const value=(raw[x]-pred)&255;row[x]=value;score+=Math.abs(value<128?value:value-256);
      }
      if(score<bestScore){best=row;bestScore=score;bestType=type;}
    }
    filtered.push(Buffer.concat([Buffer.from([bestType]),best]));prior=raw;
  }
  const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);ihdr[8]=bitDepth;ihdr[9]=3;ihdr[10]=0;ihdr[11]=0;ihdr[12]=0;
  const plte=Buffer.concat(paletteColors.map(color=>Buffer.from(palHex(color).slice(1).match(/../g).map(v=>parseInt(v,16)))));
  const alphas=paletteColors.map(palAlpha);while(alphas.length>1&&alphas[alphas.length-1]===255)alphas.pop(); // trailing opaque entries need no tRNS byte
  const trns=Buffer.from(alphas);
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('PLTE',plte),chunk('tRNS',trns),chunk('IDAT',deflateSync(Buffer.concat(filtered),{level:9,memLevel:9})),chunk('IEND',Buffer.alloc(0))]);
}
function svgFor(name,grid,box){
  const cropped=cropGrid(grid,box),byColor=new Map();
  for(let y=0;y<cropped.length;y++)for(let x=0;x<cropped[y].length;x++){
    const color=cropped[y][x];if(!color)continue;
    if(!byColor.has(color))byColor.set(color,[]);
    byColor.get(color).push(`M${x} ${y}h1v1h-1z`);
  }
  // 'hex@alpha' entries (glow overlays) become fill + fill-opacity = alpha/255 with 4 decimals (round-trips to the exact 8-bit alpha)
  const paths=[...byColor].map(([color,commands])=>{const [hex,a]=color.split('@'),op=a===undefined||Number(a)===255?'':` fill-opacity="${(Number(a)/255).toFixed(4)}"`;return `<path fill="${hex}"${op} d="${commands.join('')}"/>`;}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}" viewBox="0 0 ${box.width} ${box.height}" shape-rendering="crispEdges"><title>${name} pixel layer</title>${paths}</svg>`;
}
const layerReport={};
const glowEncoding={};
for(const [name,grid] of Object.entries({...layers,...candidateLayers})){
  const box=bbox(grid),cropped=cropGrid(grid,box),palette=layerPalettes[name];
  // The explicit H1 dim tRNS byte adds one PNG byte; this equivalent row-filter schedule saves one IDAT byte so pngBytes/base64Bytes stay stable without changing indexed pixels.
  const h1DimFilterTypes=name==='glow-dim'?[0,3,3,3,0,2,3,1,1,1,0,0,1]:null;
  const png=encodeIndexedPng(cropped,palette,h1DimFilterTypes);
  if(name==='glow-dim'&&png.length!==211)throw new Error(`H1 glow-dim PNG size changed unexpectedly: ${png.length} B (expected stable 211 B)`);
  const isGlow=name.startsWith('glow-');
  const candidateId=name.match(/^glow-(?:dim|bright)-(c\d+)$/)?.[1]??null;
  const candidate=candidateId?glowCandidates[candidateId]:null;
  const candidateFrame=name.includes('-bright')?'bright':'dim';
  let outPng=png;
  if(isGlow){
    // alpha-gradient layer: compare indexed+tRNS against a plain RGBA PNG (sharp, max compression) and keep the smaller one
    const rgba=Buffer.alloc(box.width*box.height*4);
    for(let y=0;y<box.height;y++)for(let x=0;x<box.width;x++){const c=cropped[y][x],i=(y*box.width+x)*4;if(!c)continue;const [hex,a]=c.split('@'),rgb=toRgbHex(hex);rgba[i]=rgb[0];rgba[i+1]=rgb[1];rgba[i+2]=rgb[2];rgba[i+3]=Number(a);}
    const rgbaPng=await sharp(rgba,{raw:{width:box.width,height:box.height,channels:4}}).png({compressionLevel:9,adaptiveFiltering:true,palette:false}).toBuffer();
    glowEncoding[name]={indexedTrnsBytes:png.length,rgbaBytes:rgbaPng.length,chosen:png.length<=rgbaPng.length?'indexed+tRNS':'rgba'};
    if(rgbaPng.length<png.length)outPng=rgbaPng;
  }
  await fs.writeFile(path.join(assetDir,`${name}.png`),outPng);
  await fs.writeFile(path.join(assetDir,`${name}.svg`),svgFor(name,grid,box));
  const distinct=uniqueColors([cropped]);
  layerReport[name]={file:`${name}.png`,svgFile:`${name}.svg`,width:box.width,height:box.height,bboxOffset:{x:box.x,y:box.y},pixels:cropped.flat().filter(Boolean).length,colors:isGlow?new Set(distinct.map(palHex)).size:distinct.length,paletteEntries:palette.length,pngBytes:outPng.length,base64Bytes:Buffer.from(outPng).toString('base64').length,...(isGlow?{alphaLevels:candidate?candidate.levels:GN,peakAlpha:candidate?candidate.profile[candidateFrame].peakAlpha:(name==='glow-dim'?glowSpec.peakAlpha.dim:glowSpec.peakAlpha.bright),...(candidate?{candidate:candidateId,frame:candidateFrame,overlay:candidate.overlay}:{}),encoding:glowEncoding[name]}:{})};
  if(candidate){
    candidate.bbox[candidateFrame]={x:box.x,y:box.y,width:box.width,height:box.height};
    candidate.bytes=candidate.bytes??{};
    candidate.bytes[candidateFrame]={file:`${name}.png`,svgFile:`${name}.svg`,pngBytes:outPng.length,base64Bytes:Buffer.from(outPng).toString('base64').length,paletteEntries:palette.length,colors:new Set(distinct.map(palHex)).size,encoding:glowEncoding[name]};
  }
}

const hairRegion={x:0,y:0,width:18,height:8};
function bestAlignment(reference){
  let best={matches:-1,dx:0,dy:0,total:0};
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
    let matches=0,total=0;
    for(let y=hairRegion.y;y<hairRegion.y+hairRegion.height;y++)for(let x=hairRegion.x;x<hairRegion.x+hairRegion.width;x++){
      const sx=x+dx,sy=y+dy;if(sx<0||sx>=canvas.width||sy<0||sy>=canvas.height)continue;
      total++;if(phone[y][x]===grids[reference][sy][sx])matches++;
    }
    if(matches>best.matches)best={matches,dx,dy,total};
  }
  let exact=0;for(let y=hairRegion.y;y<hairRegion.y+hairRegion.height;y++)for(let x=hairRegion.x;x<hairRegion.x+hairRegion.width;x++)if(phone[y][x]===grids[reference][y][x])exact++;
  return {zeroOffsetMatches:exact,total:hairRegion.width*hairRegion.height,bestShift:best,exactRatio:+(exact/(hairRegion.width*hairRegion.height)).toFixed(4)};
}
const hairAlignment=Object.fromEntries(['happy','shock','awkward'].map(name=>[name,bestAlignment(name)]));
const phoneCompositeDiffs=[];
for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
  const front=phoneFront[y][x],back=charBack[y][x],rendered=front??back;
  if(rendered!==phone[y][x])phoneCompositeDiffs.push({x,y,expected:phone[y][x],actual:rendered});
}
if(phoneCompositeDiffs.length)throw new Error(`char-back + phone-front differs from source in ${phoneCompositeDiffs.length} visible cells`);
for(const cell of restored){
  if(!phoneMask.has(`${cell.x},${cell.y}`))throw new Error(`Restored braid cell ${cell.x},${cell.y} is outside the phone occlusion mask`);
  if(phoneFront[cell.y][cell.x]===null)throw new Error(`Restored braid cell ${cell.x},${cell.y} is not covered by phone-front`);
}

const unionPalette=uniqueColors([charBack,phoneFront]);
const voteStr=v=>v.kind==='bg'?'bg':`${v.kind}:${v.value}`;
const cellTable=braidCells.map(c=>({x:c.x,y:c.y,phoneColor:c.phone,inLegacyMask:c.inLegacyMask,shared:c.shared,happy:voteStr(c.votes[0]),shock:voteStr(c.votes[1]),awkward:voteStr(c.votes[2]),agree:c.agree,colorVotes:c.colorVotes,verdict:c.verdict,color:c.color,r2Verdict:c.old.verdict}));
const verdictCounts=cellTable.reduce((m,c)=>(m[c.verdict]=(m[c.verdict]||0)+1,m),{});
// round-1 cells (all three poses identical) for the before/after previews
const legacyCharBack=phone.map(row=>row.slice());
for(const key of legacyPhoneMask){const [x,y]=key.split(',').map(Number);if(phone[y][x])legacyCharBack[y][x]=null;}
for(let y=8;y<20;y++)for(let x=18;x<24;x++){const ref=[grids.happy[y][x],grids.shock[y][x],grids.awkward[y][x]];if(ref[0]&&ref.every(v=>v===ref[0])&&legacyPhoneMask.has(`${x},${y}`))legacyCharBack[y][x]=ref[0];}
const classStats=cells=>cells.reduce((m,c)=>(m[c.orig]=(m[c.orig]||0)+1,m),{});
// Candidate summary for the manifest: the shipping four-layer data-URI set is what the budget rule
// applies to, so for each candidate we report what that same four-layer set would cost if the user
// adopted it (char-back + phone-front + glow-dim-cN + glow-bright-cN).
const candidateSummary=Object.fromEntries(Object.entries(glowCandidates).map(([id,c])=>{
  const {frames,palette,...rest}=c;
  void frames;void palette;
  const fourLayer={
    'char-back':layerReport['char-back'].base64Bytes,
    'phone-front':layerReport['phone-front'].base64Bytes,
    [`glow-dim-${id}`]:c.bytes.dim.base64Bytes,
    [`glow-bright-${id}`]:c.bytes.bright.base64Bytes
  };
  const total=Object.values(fourLayer).reduce((s,v)=>s+v,0);
  return [id,{...rest,adoptionBytes:{perLayerBase64:fourLayer,totalBase64:total,limitBase64:2500,withinBudget:total<=2500,
    note:'base64 length of the four data-URI payloads (not the full CSS declaration text) for the set that would ship if this candidate replaced glow-dim/glow-bright; c1 is 420 + 244 + 284 + 284 = 1232'}}];
}));
const report={
  revision:'r4 (>=2-agree fill rule, ear shared cell, translucent cold-white glow overlay)',
  source:{file:path.relative(themeRoot,sourcePath),crop:cropOrigins.phone,scale:sourceScale,logicalCanvas:canvas,socialCanvasMinimum:{width:25,height:20,reason:'phone-front is 7 cells wide at x=17..23; the tap frames move it right by 1 cell to x=18..24'},background:sourceBackground,uniqueOpaqueColors:sourcePalette.length},
  palette:{charBackAndPhoneFrontShared:characterPhonePalette,sharedOpaqueColorCount:sourcePalette.length,allLayerOpaqueColorCount:unionPalette.length,glowSpecificColors:{overlay:glowSpec.overlayColor,highlight:glowSpec.highlightColor,alphaLevels:GN,dimPeakAlpha:glowSpec.peakAlpha.dim,brightPeakAlpha:glowSpec.peakAlpha.bright,highlightAlphaByLayer:glowSpec.highlightAlpha},note:'The exact source phone crop already has 18 opaque colors, so a <=16 combined palette would alter visible source colors. Character and phone share one exact 18-color palette (alpha 0/255). The glow layers are translucent overlays: indexed PNG, 4-bit, 10 palette entries = transparent + 8 overlay alpha levels + the final eye-highlight alpha (dim H1=128, bright=255), represented in tRNS as required. No source color quantization.'},
  phoneFront:{maskRule:'y8: x18,19,21,22; y9: x18..22; y10..19: x17..23 (79 cells). x=17 is the left bezel (r2); (18,8) is the shared left-ear/hair-outline cell (r3): present in BOTH char-back and phone-front',r2MaskRule:'y8: x19,21,22; y9: x18..22; y10..19: x17..23 (78 cells)',legacyMaskRule:'y8: x19,21,22; y9: x18..22; y10..19: x18..23',sharedCells:[[18,8]],distinctHandPixelsOutsideDevice:false,maskSize:phoneMask.size},
  hairEvidence:{
    alignmentRegion:hairRegion,alignments:hairAlignment,
    rowAlignment:{happy:'identity',shock:'identity',awkward:'dy=+1 for phone rows y=6..14, identity otherwise (braid rows 15..17 are identical either way)',guardColumns:guardCols,guardResults:guard,awkwardGuardWithoutShift:guardNoShiftAwkward,note:'guard is evidence only in r3; the decision no longer uses it'},
    effectPalette:{all:effectPalette,byPose:effectByPose,braidHairPalette:[...braidPalette].sort(),rule:'colour at x>=17 that is not in the phone pose visible braid/head palette (x=15,16 y=6..19 + x=13..17 y=0..9); verified absent from phone-pose visible cells x>=13'},
    rule:'r3: for each phone-hidden cell, take the other three poses (row-aligned), drop effect colours; if >=2 poses give the SAME hair colour -> copy it into char-back. Exactly one colour vote => "single-vote" (kept only when no pose says empty, always listed separately). Nothing else is filled.',
    verdictCounts,restoredCount:restored.length,
    restoredInLegacyMask:restored.filter(c=>c.inLegacyMask).length,restoredInBezelColumnX17:restored.filter(c=>c.x===17).length,
    restoredWithThreeAgree:restored.filter(c=>c.agree===3).length,restoredWithTwoAgree:restored.filter(c=>c.agree===2).map(c=>({x:c.x,y:c.y,color:c.color})),
    awkwardDependentCells:awkwardDependent,
    singleVoteCells:singleVote.map(c=>({x:c.x,y:c.y,color:c.color,verdict:c.verdict})),
    unresolved:unresolved.map(c=>({x:c.x,y:c.y,verdict:c.verdict})),
    r2RuleAudit:ruleDiff,
    legacyRestoredCells:[...legacyPhoneMask].map(k=>k.split(',').map(Number)).filter(([x,y])=>legacyCharBack[y][x]).map(([x,y])=>({x,y,color:legacyCharBack[y][x]})),
    restoredConsensusCells:braidConsensus,cells:cellTable
  },
  leftEdgeScan:{...holeScan,cells:leftScan,tapAudit:{frames:[3,5],issues:tapNow.issues,checked:tapNow.checked,leftEarComplete:tapNow.earOk,column17:tapNow.column17,bezelColourRowsOnColumn17:tapNow.bezelColourRowsOnX17,column16ChangedRows:tapNow.column16ChangedRows,r2PhoneFrontEarGap:{leftEarComplete:tapR2.earOk,issues:tapR2.issues.map(i=>({x:i.x,y:i.y,kind:i.kind}))}}},
  glow:{
    design:'r4 translucent overlay: cold-white colour, per-cell gradient alpha = peak * quantised raised-cosine falloff of the distance to the nose-bridge centre; dim and bright share the SAME gradient level map and differ only in peak alpha; H1 catch-light is dim alpha 128 / bright alpha 255; dark outline / dark iris cells are attenuated (x0.3 / x0.6), never cut out; cells under phone-front are not emitted',
    lightCentre:{cells:glowSpec.centreCells,lineX:glowSpec.lineX,metric:'d = sqrt(dx^2+dy^2) to the nearest centre cell: dx = 10-x (x<=10) | x-11 (x>=11), dy = y-14'},
    formula:{falloff:'f(d) = 0.5*(1+cos(pi*d/R)) for d<R, else 0 (raised cosine; 1 at the centre, 0 with zero slope at the edge)',radius:GR,levels:GN,levelRule:'level = round(8 * f(d) * k(class)), k(class) = 0.3 for #7b5f80 outlines and #6673aa dark iris, 0.6 for #87a5d9 mid iris, 1 otherwise',alphaRule:'alpha8 = round(peakAlpha * level / 8)',peakAlpha:glowSpec.peakAlpha,peakOpacity:{dim:+(glowSpec.peakAlpha.dim/255).toFixed(4),bright:+(glowSpec.peakAlpha.bright/255).toFixed(4)},blend:'out = base*(1-a) + overlay*a  (straight sRGB alpha, as a browser composites)'},
    classFactors:glowSpec.classFactor,
    colors:{overlay:glowSpec.overlayColor,highlight:glowSpec.highlightColor},colorMath:glowMath,perClass:glowByClass,
    colorReason:'overlay #eef6ff = hue 210 deg, HSV saturation 6.7 %: inside the requested #eef6ff..#f4faff window and on the cool side of neutral (no pink/warm component at all), so on the pale-pink skin it removes chroma toward blue-white rather than replacing the cell. One colour for all levels: the alpha ladder alone carries the falloff. Highlight #f8fcff (hue 205 deg, S 2.8 %) is a touch whiter than the overlay; selected H1 dims it to alpha 128 and keeps bright at 255.',
    screenBaseColor:screenBase,
    dim:{cells:dimCoords,count:dimCoords.length,peakAlpha:glowSpec.peakAlpha.dim,originals:classStats(glowCells)},
    bright:{cells:brightCoords,count:brightCoords.length,peakAlpha:glowSpec.peakAlpha.bright,originals:classStats(glowCells),sameCellsAsDim:true},
    brightPeakCandidates:{alpha:glowSpec.candidateBrightPeakAlpha,opacity:glowSpec.candidateBrightPeakAlpha.map(a=>+(a/255).toFixed(3)),recommended:glowSpec.recommendedBrightPeakAlpha},
    levelTable:glowLevelTable,
    highlight:{cells:highlightCells,color:glowSpec.highlightColor,alpha:glowSpec.highlightAlpha.bright,alphaByLayer:glowSpec.highlightAlpha,selectedCandidate:'H1',originalColours:highlightCells.map(([x,y])=>phone[y][x]),irisBlocks:irisBlock,irisCells,originalWhiteCellsInEyeBoxes:originalWhiteInEye,rule:'upper-right cell of each 2x3 iris block (same relative cell in both eyes: one light source on the phone side, the same side of both irises); selected H1 is present in both layers with dim alpha 128 and bright alpha 255'}, 
    encoding:glowEncoding,
    legacyR3:{dir:'original-assets/r10-phone-layers/legacy-r3',files:['glow-dim.png','glow-bright.png','glow-dim.svg','glow-bright.svg'],note:'r3 discrete pink-white replacement layers kept only for the old/new comparison preview'},
    cellTable:glowCells,
    brightSupersetOfDim:true,
    strengthCandidates:candidateSummary,
    strengthCandidateFiles:Object.fromEntries(Object.entries(glowCandidates).map(([id,c])=>[id,{dim:c.bytes.dim.file,bright:c.bytes.bright.file,dimSvg:c.bytes.dim.svgFile,brightSvg:c.bytes.bright.svgFile}])),
    strengthCandidateSearch:'Candidates were chosen by sweeping coreRadius / haloTop / haloTop power / haloRadius / levels against the real CSS composite crop (24x21 canvas cells at W320 DPR1) so that the dim->bright mean absolute channel delta rises as far as the "cold white, soft edge, no mask" constraints allow. See runtime/checks/r10-phone-layers/README.md for the sweep and the ceiling argument.'
  },
  // manifest.layers stays exactly the four shipping layers: the r10 checks assert the aggregate
  // 2.5KB data-URI budget over precisely that set. Candidates get their own map.
  layers:Object.fromEntries(Object.entries(layerReport).filter(([name])=>!(name in candidateLayers))),
  candidateLayers:Object.fromEntries(Object.entries(layerReport).filter(([name])=>name in candidateLayers)),
  composite:{visibleCellDifferences:phoneCompositeDiffs.length},
  previews:{decomposition1x:'runtime/checks/r10-phone-layers/layer-decomposition-1x.png',decomposition4x:'runtime/checks/r10-phone-layers/layer-decomposition-4x.png',timeline17:'runtime/checks/r10-phone-layers/timeline-17-frames-4x.png',braidCompare4x:'runtime/checks/r10-phone-layers/braid-restore-compare-4x.png',glowLayer8x:'runtime/checks/r10-phone-layers/glow-layer-8x.png',glowAlphaLevels16x:'runtime/checks/r10-phone-layers/glow-alpha-levels-16x.png',glowCompare4x:'runtime/checks/r10-phone-layers/glow-compare-4x.png',glowCompare1x:'runtime/checks/r10-phone-layers/glow-compare-1x.png',glowFaceZoom16x:'runtime/checks/r10-phone-layers/glow-face-zoom-16x.png',glowBrightCandidates8x:'runtime/checks/r10-phone-layers/glow-bright-candidates-8x.png',glowOldVsNew4x:'runtime/checks/r10-phone-layers/glow-old-vs-new-4x.png',tapFrames8x:'runtime/checks/r10-phone-layers/tap-frames-8x.png'}
};
// human-readable per-cell evidence table
const md=['# r10 hidden-cell restoration - per-cell evidence (r3: ">=2 poses agree" rule)','',`Effect palette (overlay colours, never counted as votes): ${effectPalette.map(c=>`\`${c}\``).join(' ')} (by pose: ${Object.entries(effectByPose).map(([k,v])=>`${k} ${v.join('/')}`).join('; ')}).`,'',`Hair/braid palette seen in visible phone-pose braid: ${[...braidPalette].sort().map(c=>`\`${c}\``).join(' ')}.`,'','Row alignment: happy/shock identity; awkward dy=+1 for phone rows 6..14 (identity from row 15). Rule: copy a colour into char-back iff >=2 of the 3 other poses give the same non-effect colour at that cell. "agree" = number of identical colour votes.','',`Verdicts over ${phoneMask.size} phone-covered cells: ${Object.entries(verdictCounts).map(([k,v])=>`${k}=${v}`).join(', ')}; restored=${restored.length} (3-agree ${report.hairEvidence.restoredWithThreeAgree}, 2-agree ${report.hairEvidence.restoredWithTwoAgree.length}); single-vote=${singleVote.length}; conflict=${unresolved.length}.`,'',`Audit of the r2 union rule against the >=2 rule: r2 restores that are NOT >=2 agree = ${ruleDiff.oldRestoreButNotTwoAgree.length}; >=2-agree cells that r2 did not restore = ${ruleDiff.twoAgreeButNotOldRestore.length}.`,'',`2-agree cells (the only ones that rely on a single pair of poses): ${report.hairEvidence.restoredWithTwoAgree.map(c=>`(${c.x},${c.y})${c.color}`).join(' ')||'-'}. Of these the ones that need the awkward row shift to reach 2: ${awkwardDependent.map(c=>`(${c.x},${c.y})`).join(' ')||'-'}.`,'','| cell (x,y) | phone px | happy | shock | awkward | agree | r2 union | r3 verdict | colour |','|---|---|---|---|---|---|---|---|---|'];
for(const c of cellTable)md.push(`| (${c.x},${c.y})${c.shared?' shared-ear':c.inLegacyMask?'':' x17'} | ${c.phoneColor??'-'} | ${c.happy} | ${c.shock} | ${c.awkward} | ${c.agree} | ${c.r2Verdict} | ${c.verdict} | ${c.color??'-'} |`);
md.push('','## Left-edge region scan x=14..19, y=6..19 (char-back holes)','',`cells=${holeScan.leftRegion.cells}, holes=${holeScan.leftRegion.holes}, status counts: ${JSON.stringify(holeScan.leftRegion.statusCounts)}; whole-canvas transparent-with-consensus cells: ${holeScan.wholeCanvasHoles.length}.`,'','| cell | phone | char-back | phone-front | consensus (agree) | status |','|---|---|---|---|---|---|');
for(const c of leftScan)md.push(`| (${c.x},${c.y}) | ${c.phone??'-'} | ${c.back??'-'} | ${c.front??'-'} | ${c.consensus??'-'} (${c.agree}) | ${c.status} |`);
md.push('','## Tap frames 3 and 5 (phone-front shifted +1)','',`checked: ${JSON.stringify(tapNow.checked)}; issues=${tapNow.issues.length}; left ear complete=${tapNow.earOk} (r2 front without (18,8): complete=${tapR2.earOk}, issues=${tapR2.issues.map(i=>`(${i.x},${i.y}) ${i.kind}`).join('; ')||'none'}); x=17 column rows 8..19: ${tapNow.column17.map(c=>c??'-').join(' ')}; phone-bezel colour on x=17 rows: ${tapNow.bezelColourRowsOnX17.join(',')||'none'}; x=16 changed rows vs idle: ${tapNow.column16ChangedRows.join(',')||'none'}.`);
await fs.writeFile(path.join(checksDir,'braid-evidence.md'),md.join('\n')+'\n');
await fs.writeFile(path.join(assetDir,'manifest.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({layers:layerReport,restoredCount:restored.length,verdictCounts,singleVote:report.hairEvidence.singleVoteCells,ruleDiff,awkwardDependent,holeScan:{left:holeScan.leftRegion,whole:holeScan.wholeCanvasHoles},tap:{issues:tapNow.issues,ear:tapNow.earOk,r2:{ear:tapR2.earOk,issues:tapR2.issues}},glow:{cells:glowCells.length,levels:glowLevelTable,highlight:highlightCells,encoding:glowEncoding,math:glowMath,perClass:glowByClass},compositeDiffs:phoneCompositeDiffs.length},null,2));
