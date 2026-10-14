import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const srcDir=path.join(root,'src'), distDir=path.join(root,'dist');
const paletteFile=process.argv[2]??path.join(root,'palettes.json');
await fs.mkdir(distDir,{recursive:true});
const palettes=JSON.parse(await fs.readFile(paletteFile,'utf8'));
for(const [name,color] of Object.entries(palettes))if(!/^[0-9a-fA-F]{6}$/.test(color.replace(/^#/,'')))throw new Error(`Invalid hex palette value: ${name}`);
const names=(await fs.readdir(srcDir)).filter(x=>x.endsWith('.svg')).sort();
if(names.length<23)throw new Error(`Expected at least 23 source SVGs, got ${names.length}`);
const tokenMap={'s1-scallop-16x8.svg':'s1-s','s1-scallop-24x12.svg':'s1-l','s2-fan-lace-20x12.svg':'s2','s3-stitch-8x4.svg':'s3','s4-lacing-column-16x16.svg':'s4','s5-lacing-end-knot-24x16.svg':'s5','s6-bow-24x16.svg':'s6','s6-bow-32x20.svg':'s6-l','s7-heart-12x12.svg':'s7-s','s7-heart-16x16.svg':'s7','s8-pixel-heart-body-12x8.svg':'s8-body','s8-pixel-heart-highlight-12x8.svg':'s8-hi','s9-pixel-zigzag-16x8.svg':'s9','s10-dither-cloud-64x32.svg':'s10','s11-symbol-sprinkle-96x96.svg':'s11','s12-pixel-star-8x8.svg':'s12','s13-pixel-starfield-64x64.svg':'s13',
's15-pixel-wings-cross-32x12.svg':'s15','s16-pixel-gem-heart-16x16.svg':'s16','s16-pixel-gem-heart-hi-16x16.svg':'s16-hi','s19-pixel-alert-badge-12x12.svg':'s19','s20-pixel-burst-24x24.svg':'s20','s21-pixel-pill-12x8.svg':'s21','s22-pixel-big-heart-outline-32x28.svg':'s22','s23-pixel-sparkle-12x12.svg':'s23','s24-pixel-bunny-charm-16x20.svg':'s24','s25-pixel-dither-fade-16x16.svg':'s25','s26-pixel-checker-band-16x8.svg':'s26','s27-pixel-cloud-small-24x12.svg':'s27','s28-pixel-diamond-lattice-16x16.svg':'s28'};
const token=s=>tokenMap[s]??(s.match(/^s14-pixel-icon-([a-z]+)-/)?.[1] ? 'i-'+s.match(/^s14-pixel-icon-([a-z]+)-/)[1] : null)??s.replace(/\.svg$/,'').replace(/[^a-zA-Z0-9-]/g,'-');
// Mode B (baked colour) is only needed for edge strips used on scrolling containers such as
// dialog-content and table headers; everything else is consumed through mode M masks.
const BAKE=new Set(['s1-s','s1-l','s2','s3']);
const minify=s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/>\s+</g,'><').replace(/\s{2,}/g,' ').replace(/\s*(=)\s*/g,'$1').trim();
const encode=s=>encodeURIComponent(s).replace(/[!'()*]/g,c=>`%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const byteLen=s=>Buffer.byteLength(s,'utf8');
const entries=[];
const css=[];
for(const filename of names){
 const source=await fs.readFile(path.join(srcDir,filename),'utf8');
 const view=source.match(/viewBox=["']0\s+0\s+(\d+)\s+(\d+)["']/i);
 if(!view)throw new Error(`${filename}: viewBox must begin at 0 0 and use integer dimensions`);
 const [w,h]=view.slice(1).map(Number); if(w%4||h%4)throw new Error(`${filename}: dimensions ${w}x${h} must both be multiples of four`);
 if(/<(?:text|image|filter|script|foreignObject|linearGradient|radialGradient)\b|\b(?:stroke|href|style)\s*=|url\(/i.test(source))throw new Error(`${filename}: forbidden SVG text/image/filter/stroke/URL/style`);
 const fills=[...source.matchAll(/fill=["']([^"']+)["']/g)].map(m=>m[1]);
 if(!fills.length||fills.some(v=>v.toLowerCase()!=='#000'&&v.toLowerCase()!=='#000000'))throw new Error(`${filename}: source must be single-color fill #000`);
 if(!/<svg\b[^>]*shape-rendering=["']crispEdges["']/i.test(source)&&/pixel|dither|star|icon/i.test(filename))throw new Error(`${filename}: pixel art must set crispEdges`);
 const compact=minify(source);const url=`data:image/svg+xml,${encode(compact)}`;const key=token(filename);
 await fs.writeFile(path.join(distDir,filename),compact+'\n');
 css.push(`--jk-mask-${key}:url("${url}")`);
 const baked={};
 for(const [palette,colorRaw] of BAKE.has(key)?Object.entries(palettes):[]){
  const color=colorRaw.startsWith('#')?colorRaw:`#${colorRaw}`;
  const svg=compact.replace(/fill="#000"/g,`fill="${color}"`);
  const data=`data:image/svg+xml,${encode(svg)}`;
  const varName=`--jk-bg-${palette}-${key}`;
  css.push(`${varName}:url("${data}")`);
  baked[palette]={fill:color,encodedUrlBytes:byteLen(data)};
 }
 entries.push({file:filename,token:key,viewBox:`0 0 ${w} ${h}`,dimensions:[w,h],compressedSvgBytes:byteLen(compact),maskUrlBytes:byteLen(url),bakedColors:baked,totalInlineBytes:byteLen(url)+Object.values(baked).reduce((n,x)=>n+x.encodedUrlBytes,0)});
}
const cssText=`:root{${css.join(';')}}`;await fs.writeFile(path.join(distDir,'jirai-assets.css'),cssText);
const report={sourceCount:names.length,palettes,entries,totalCompressedSvgBytes:entries.reduce((n,e)=>n+e.compressedSvgBytes,0),totalMaskUrlBytes:entries.reduce((n,e)=>n+e.maskUrlBytes,0),totalBakedUrlBytes:entries.reduce((n,e)=>n+Object.values(e.bakedColors).reduce((m,c)=>m+c.encodedUrlBytes,0),0),totalInlineUriBytes:entries.reduce((n,e)=>n+e.totalInlineBytes,0),cssBytes:byteLen(cssText),withinPerAssetLimit:entries.every(e=>e.compressedSvgBytes<1536),withinTotalInlineUriLimit:entries.reduce((n,e)=>n+e.totalInlineBytes,0)<20*1024};
await fs.writeFile(path.join(distDir,'assets-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
