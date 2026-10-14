/* Re-rasterise one lucide glyph at several stroke widths on the checked-in 16x16
   grid (threshold .45, same algorithm as gen-icons.mjs) so a human can pick a
   chunkier pencil. Read-only w.r.t. the app checkout; writes nothing. */
import {createRequire} from 'node:module';
import path from 'node:path';
const require=createRequire('/tmp/dsh-theme-tools/node_modules/playwright/index.mjs');
const sharp=require('sharp');
const appReq=createRequire('/home/fulutang/Documents/Github/VRCX-0-jirai/package.json');
const LUCIDE=path.dirname(appReq.resolve('lucide-react/package.json'))+'/dist/esm/icons';
const GRID=16,TH=0.45;
const esc=v=>String(v).replace(/"/g,'&quot;');
async function iconData(kebab){
  let file=path.join(LUCIDE,kebab+'.mjs');
  for(let i=0;i<3;i++){const txt=await (await import('node:fs/promises')).readFile(file,'utf8');
    const m=txt.match(/export \{ default \} from '\.\/(.+?)\.mjs'/);if(!m)break;file=path.join(LUCIDE,m[1]+'.mjs');}
  return (await import('node:url')).pathToFileURL? (await import(file)).__iconData : null;
}
const {readFile}=await import('node:fs/promises');
const {pathToFileURL}=await import('node:url');
async function data(kebab){
  let file=path.join(LUCIDE,kebab+'.mjs');
  for(let i=0;i<3;i++){const txt=await readFile(file,'utf8');
    const m=txt.match(/export \{ default \} from '\.\/(.+?)\.mjs'/);if(!m)break;file=path.join(LUCIDE,m[1]+'.mjs');}
  return (await import(pathToFileURL(file).href)).__iconData;
}
for(const kebab of process.argv.slice(2,3).length?process.argv.slice(2):['pencil-line']){
  const d=await data(kebab);
  const body=d.node.map(([tag,a])=>`<${tag} ${Object.entries(a).filter(([k])=>k!=='key').map(([k,v])=>`${k}="${esc(v)}"`).join(' ')}/>`).join('');
  for(const STROKE of [2.6,3.0,3.4,3.8,4.2]){
    const src=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="128" height="128" fill="none" stroke="#000" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
    const {data:px}=await sharp(Buffer.from(src)).ensureAlpha().resize(GRID,GRID,{kernel:'cubic'}).raw().toBuffer({resolveWithObject:true});
    const rows=[];
    for(let y=0;y<GRID;y++){let r='';for(let x=0;x<GRID;x++)r+=px[(y*GRID+x)*4+3]/255>=TH?'X':'.';rows.push(r);}
    console.log('---',d.name,'stroke',STROKE,'fill',rows.join('').split('').filter(c=>c==='X').length+'/256');
    console.log(rows.map((r,i)=>String(i).padStart(2)+' '+r.replace(/\./g,'·')).join('\n'));
  }
}
