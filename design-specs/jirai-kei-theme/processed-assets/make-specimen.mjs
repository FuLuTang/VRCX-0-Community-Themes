import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';
const root='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/processed-assets';
const ids=['heart','dots','checker','lines-square','lines-diamond'];
const labels={heart:'Pack 1 · #75 · heart',dots:'Pack 1 · #70 · polka dot',checker:'Pack 1 · #15 · checker', 'lines-square':'Pack 2 · #0000 · square lattice','lines-diamond':'Pack 2 · #0004 · diamond lattice'};
const files=[];
for(const id of ids){
 const row=[];
 for(const file of [`tiles/${id}/alpha-white.png`,`tiles/${id}/pink-black.png`,`tiles/${id}/pink-gray.png`]) row.push(`data:image/png;base64,${(await fs.readFile(path.join(root,file))).toString('base64')}`);
 files.push(row);
}
const W=1280,H=1000, left=270, cellW=305, gap=16, top=92, rowH=171;
let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><pattern id="checkbg" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#302d34"/><rect width="8" height="8" fill="#45414a"/><rect x="8" y="8" width="8" height="8" fill="#45414a"/></pattern>`;
for(let i=0;i<files.length;i++)for(let j=0;j<3;j++)svg+=`<pattern id="p${i}_${j}" width="112" height="112" patternUnits="userSpaceOnUse"><image href="${files[i][j]}" x="0" y="0" width="112" height="112"/></pattern>`;
svg+='</defs><rect width="100%" height="100%" fill="#17141a"/><text x="28" y="39" fill="#f2eaf0" font-family="sans-serif" font-size="24" font-weight="700">Kenney pattern tile processing · static candidates only</text><text x="28" y="66" fill="#bbaab7" font-family="sans-serif" font-size="14">Unapproved experiment · each panel shows repeated tile periods, not UI mockups or final palette</text>';
const heads=['WHITE RGBA / ALPHA MASK','LOW-CONTRAST PINK × BLACK','LOW-CONTRAST PINK × GRAY'];
for(let j=0;j<3;j++)svg+=`<text x="${left+j*(cellW+gap)}" y="83" fill="#e6d9e3" font-family="sans-serif" font-size="13" font-weight="700">${heads[j]}</text>`;
for(let i=0;i<ids.length;i++){
 let y=top+i*rowH;
 svg+=`<text x="28" y="${y+26}" fill="#f2eaf0" font-family="sans-serif" font-size="15" font-weight="700">${labels[ids[i]]}</text><text x="28" y="${y+50}" fill="#bbaab7" font-family="sans-serif" font-size="12">512 × 512 tile</text>`;
 for(let j=0;j<3;j++){
   let x=left+j*(cellW+gap);
   svg+=`<rect x="${x}" y="${y}" width="${cellW}" height="132" rx="8" fill="${j===0?'url(#checkbg)':j===1?'#171319':'#302a31'}" stroke="#675964"/><rect x="${x}" y="${y}" width="${cellW}" height="132" rx="8" fill="url(#p${i}_${j})"/><rect x="${x+cellW-53}" y="${y+99}" width="53" height="33" fill="${j===1?'#171319':j===2?'#302a31':'#302d34'}"/><text x="${x+cellW-43}" y="${y+121}" fill="#c9bdc7" font-family="sans-serif" font-size="10">repeat</text>`;
 }
}
svg+='</svg>';
await sharp(Buffer.from(svg)).webp({quality:92,effort:6}).toFile(path.join(root,'pattern-candidate-specimen.webp'));
const m=JSON.parse(await fs.readFile(path.join(root,'assets-manifest.json'),'utf8'));
m.sampleSheet={file:'pattern-candidate-specimen.webp',purpose:'single material specimen sheet only; tile repeat preview, not a UI/theme proposal',width:W,height:H,bytes:(await fs.stat(path.join(root,'pattern-candidate-specimen.webp'))).size,views:['white RGBA alpha over checker background','pink-black low contrast tile','pink-gray low contrast tile']};
let pairs=0; const problems=[];
for(const id of ids) for(const stem of ['alpha-white','pink-black','pink-gray']){
 const pngPath=`tiles/${id}/${stem}.png`,webpPath=`tiles/${id}/${stem}.webp`;
 const [png,webp]=await Promise.all([sharp(path.join(root,pngPath)).ensureAlpha().raw().toBuffer({resolveWithObject:true}),sharp(path.join(root,webpPath)).ensureAlpha().raw().toBuffer({resolveWithObject:true})]);
 if(png.info.width!==512||png.info.height!==512||webp.info.width!==512||webp.info.height!==512)problems.push(`${id}/${stem}: dimension mismatch`);
 for(let i=0;i<png.data.length;i+=4){if(png.data[i+3]!==webp.data[i+3]||(png.data[i+3]!==0&&(png.data[i]!==webp.data[i]||png.data[i+1]!==webp.data[i+1]||png.data[i+2]!==webp.data[i+2]))){problems.push(`${id}/${stem}: alpha/visible RGB mismatch`);break;}}
 for(const f of [pngPath,webpPath]){const bytes=(await fs.stat(path.join(root,f))).size;const entry=m.processing.checkedOutputs.find(x=>x.file===f);if(!entry||entry.bytes!==bytes)problems.push(`${f}: byte size does not match manifest`);}
 pairs++;
}
if(problems.length)throw new Error(problems.join('; '));
m.validation={library:'sharp',patternTiles:ids.length,pngWebpPairs:pairs,outputFiles:pairs*2,dimensions:'all 512x512',pixelComparison:'PNG and lossless WebP alpha channels and visible RGB values match exactly; transparent RGB is ignored because WebP may canonicalize hidden transparent color channels',manifestByteCountsMatch:true,allPass:true};
await fs.writeFile(path.join(root,'assets-manifest.json'),JSON.stringify(m,null,2)+'\n');
console.log(JSON.stringify(m.sampleSheet));
