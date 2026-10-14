import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const root = '/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/processed-assets';
const definitions = [
  { id:'heart', source:'raw/kenney-patternpack1/kenney-patternpack1-75-512.png', pack:'Pattern Pack', selection:'75; individually inspected white repeating hearts on opaque black field' },
  { id:'dots', source:'raw/kenney-patternpack1/kenney-patternpack1-70-512.png', pack:'Pattern Pack', selection:'70; individually inspected white polka dots on opaque black field' },
  { id:'checker', source:'raw/kenney-patternpack1/kenney-patternpack1-15-512.png', pack:'Pattern Pack', selection:'15; individually inspected black/white 2x2 checker motif' },
  { id:'lines-square', source:'raw/kenney-patternpack2/kenney-patternpack2-thin-0000-512.png', sourceSvg:'raw/kenney-patternpack2/kenney-patternpack2-thin-0000.svg', pack:'Pattern Pack 2', selection:'0000; selected after visual inspection: thin square-frame lattice with fine diagonals, useful as compact panel edging' },
  { id:'lines-diamond', source:'raw/kenney-patternpack2/kenney-patternpack2-thin-0004-512.png', sourceSvg:'raw/kenney-patternpack2/kenney-patternpack2-thin-0004.svg', pack:'Pattern Pack 2', selection:'0004; selected after visual inspection: airy diagonal diamond lattice, suitable for restrained trim' },
];
const variants = [
  { id:'pink-black', bg:'#171319', fg:'#30212b', description:'Very low-contrast blush-on-ink experiment; foreground #30212b on #171319.' },
  { id:'pink-gray', bg:'#302a31', fg:'#44363f', description:'Very low-contrast dusty-pink-on-charcoal-gray experiment; foreground #44363f on #302a31.' },
];
const hex = (s) => [1,3,5].map(i=>parseInt(s.slice(i,i+2),16));
const contrast = (a,b) => {
 const l = c => { const v=c.map(x=>x/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4); return .2126*v[0]+.7152*v[1]+.0722*v[2]; };
 const x=l(hex(a)), y=l(hex(b)); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
};
await fs.mkdir(path.join(root,'tiles'),{recursive:true});
const manifest = {title:'Kenney Pattern Pack candidate processing',status:'Unapproved experimental assets; not a theme or palette approval',generatedAt:new Date().toISOString(),license:{packs:'Kenney Pattern Pack / Pattern Pack 2',author:'Kenney',license:'CC0 1.0',credit:'Attribution is not required; courtesy credit Kenney / kenney.nl.',licenseFiles:['licenses/kenney-pattern-pack-License.txt','licenses/kenney-pattern-pack2-License.txt']},processing:{method:'Source grayscale intensity becomes alpha on opaque white RGB: alpha=gray (white motif remains opaque; black source background becomes transparent). Candidate colors are then composited from this alpha mask onto explicit solid bases.',webp:'Lossless WebP, alpha preserved.',noExternalAssets:true},tiles:[]};
const seamReport = {};
for (const d of definitions) {
 const src = path.join(root,d.source);
 const decoded = await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {data,info} = decoded;
 if(info.width!==512 || info.height!==512) throw new Error(`${d.id} is not 512x512`);
 const alpha = Buffer.alloc(info.width*info.height*4);
 for(let i=0,j=0;i<data.length;i+=info.channels,j+=4){
   const gray = Math.round((data[i]*0.2126 + data[i+1]*0.7152 + data[i+2]*0.0722));
   alpha[j]=255; alpha[j+1]=255; alpha[j+2]=255; alpha[j+3]=gray;
 }
 const alphaPng = await sharp(alpha,{raw:{width:info.width,height:info.height,channels:4}}).png().toBuffer();
 const dir=path.join(root,'tiles',d.id); await fs.mkdir(dir,{recursive:true});
 const alphaPath=path.join(dir,'alpha-white.png'); await fs.writeFile(alphaPath,alphaPng);
 const alphaWebp=path.join(dir,'alpha-white.webp'); await sharp(alphaPng).webp({lossless:true,alphaQuality:100}).toFile(alphaWebp);
 const alphaPlane = new Uint8Array(info.width*info.height); for(let p=0,j=3;p<alphaPlane.length;p++,j+=4)alphaPlane[p]=alpha[j];
 const edgeStats=(horizontal)=>{
  let wrap=0,maxWrap=0,n=0,maxInterior=0;
  if(horizontal){for(let y=0;y<info.height;y++){const row=y*info.width;const w=Math.abs(alphaPlane[row+info.width-1]-alphaPlane[row]);wrap+=w;maxWrap=Math.max(maxWrap,w);for(let x=1;x<info.width;x++)maxInterior=Math.max(maxInterior,Math.abs(alphaPlane[row+x]-alphaPlane[row+x-1]));n++;}}
  else {for(let x=0;x<info.width;x++){const w=Math.abs(alphaPlane[(info.height-1)*info.width+x]-alphaPlane[x]);wrap+=w;maxWrap=Math.max(maxWrap,w);for(let y=1;y<info.height;y++)maxInterior=Math.max(maxInterior,Math.abs(alphaPlane[y*info.width+x]-alphaPlane[(y-1)*info.width+x]));n++;}}
  return {edgeMeanAbs:+(wrap/n).toFixed(3),maxEdgeDelta:maxWrap,maxIntraTileDelta:maxInterior,seamNoSharperThanExistingEdges:maxWrap<=maxInterior};
 };
 const seams={horizontal:edgeStats(true),vertical:edgeStats(false),cornerAlpha:[alphaPlane[0],alphaPlane[info.width-1],alphaPlane[(info.height-1)*info.width],alphaPlane[info.width*info.height-1]]};
 seamReport[d.id]=seams;
 const baseItem={id:d.id,source:d.source,...(d.sourceSvg?{sourceSvg:d.sourceSvg}:{}),pack:d.pack,selection:d.selection,dimensions:[512,512],derived:true,transparency:{method:'grayscale-to-alpha',opaqueWhitePixels:0,transparentBlackPixels:0,note:'Actual extrema/pixel counts recorded below; alpha is source gray intensity.'},alphaFiles:[`tiles/${d.id}/alpha-white.png`,`tiles/${d.id}/alpha-white.webp`],variants:[],seamTest:seams};
 let opaque=0,transparent=0,partial=0,minAlpha=255,maxAlpha=0; for(const a of alphaPlane){if(a===255)opaque++; else if(a===0)transparent++;else partial++; minAlpha=Math.min(minAlpha,a);maxAlpha=Math.max(maxAlpha,a);}
 baseItem.transparency={method:'grayscale-to-alpha (source luminance becomes alpha; white RGB retained)',opaquePixels:opaque,transparentPixels:transparent,partialAlphaPixels:partial,actualAlphaRange:[minAlpha,maxAlpha]};
 for(const v of variants){
  const [fr,fg,fb]=hex(v.fg),[br,bg,bb]=hex(v.bg); const rgba=Buffer.alloc(info.width*info.height*4);
  for(let p=0,j=0;p<alphaPlane.length;p++,j+=4){let a=alphaPlane[p]/255;rgba[j]=Math.round(fr*a+br*(1-a));rgba[j+1]=Math.round(fg*a+bg*(1-a));rgba[j+2]=Math.round(fb*a+bb*(1-a));rgba[j+3]=255;}
  const png=await sharp(rgba,{raw:{width:info.width,height:info.height,channels:4}}).png().toBuffer();
  const pngRel=`tiles/${d.id}/${v.id}.png`, webpRel=`tiles/${d.id}/${v.id}.webp`;
  await fs.writeFile(path.join(root,pngRel),png); await sharp(png).webp({lossless:true,alphaQuality:100}).toFile(path.join(root,webpRel));
  baseItem.variants.push({id:v.id,files:[pngRel,webpRel],background:v.bg,motif:v.fg,patternContrastRatio:+contrast(v.fg,v.bg).toFixed(3),description:v.description});
 }
 const srcBuffer=await fs.readFile(src); const srcStat=await fs.stat(src); baseItem.sourceBytes=srcStat.size; baseItem.sourceSha256=createHash('sha256').update(srcBuffer).digest('hex'); if(d.sourceSvg)baseItem.sourceSvgSha256=createHash('sha256').update(await fs.readFile(path.join(root,d.sourceSvg))).digest('hex');
 for(const f of [...baseItem.alphaFiles,...baseItem.variants.flatMap(x=>x.files)]){let st=await fs.stat(path.join(root,f));manifest.processing.checkedOutputs??=[];manifest.processing.checkedOutputs.push({file:f,bytes:st.size});}
 manifest.tiles.push(baseItem);
}
manifest.processing.sourceToAlphaSeamDiagnostics=seamReport;
manifest.processing.seamInterpretation='For every tile, wrap edge mean/max alpha delta is compared with the maximum normal one-pixel delta anywhere inside the tile; a boundary may naturally cross a hard motif edge (e.g. checker) and need not have equal opposite edge pixels. seamNoSharperThanExistingEdges means the wrap discontinuity is no sharper than a motif edge already present inside the repeated period. The single specimen also visually tiles each pattern.';
manifest.license.sha256=Object.fromEntries(await Promise.all(manifest.license.licenseFiles.map(async f=>[f,createHash('sha256').update(await fs.readFile(path.join(root,f))).digest('hex')])));
await fs.writeFile(path.join(root,'assets-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({tiles:manifest.tiles.map(t=>({id:t.id,opaque:t.transparency.opaquePixels,transparent:t.transparency.transparentPixels,partial:t.transparency.partialAlphaPixels,alphaRange:t.transparency.actualAlphaRange,seams:t.seamTest,variants:t.variants.map(v=>({id:v.id,contrast:v.patternContrastRatio}))})),files:manifest.processing.checkedOutputs.length},null,2));
