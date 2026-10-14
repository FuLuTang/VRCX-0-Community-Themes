/* Hand-refine candidate for the feed "status/signature change" pencil.
   Reads the checked-in 16x16 grid of `pencil-line`, thickens its 1px stroke into
   2px blocks (same 16x16 grid, crispEdges, single black fill -> mask inherits
   currentColor), and re-emits the path with gen-icons.mjs' exact run-merging
   algorithm. Preview only: writes nothing into the icon source tree. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const icons='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/original-assets/icons';
const grids=JSON.parse(await fs.readFile(path.join(icons,'src/_grids.json'),'utf8'));
const base=grids['pencil-line'];
const G=16;
const toRows=s=>s.split('\n').map(r=>r.replace(/·/g,'.'));
const show=rows=>rows.map((r,i)=>String(i).padStart(2)+' '+r.replace(/\./g,'·')).join('\n');
function dilate(rows,dx,dy){
  const out=Array.from({length:G},()=>Array(G).fill('.'));
  for(let y=0;y<G;y++)for(let x=0;x<G;x++){
    if(rows[y][x]!=='X')continue;
    for(const [ax,ay] of [[0,0],[dx,dy],[dx,0],[0,dy]]){
      const nx=x+ax,ny=y+ay;if(nx>=0&&nx<G&&ny>=0&&ny<G)out[ny][nx]='X';
    }
  }
  return out.map(r=>r.join(''));
}
function toPath(rows){
  const rects=[],open=new Map();
  rows.forEach((row,y)=>{
    const now=new Map();
    for(let x=0;x<G;){if(row[x]!=='X'){x++;continue;}let e=x;while(row[e]==='X')e++;
      const k=x+':'+e,r=open.get(k);
      if(r&&r.y+r.h===y){r.h++;now.set(k,r);}else{const nr={x,y,w:e-x,h:1};rects.push(nr);now.set(k,nr);}
      x=e;}
    open.clear();for(const [k,v] of now)open.set(k,v);
  });
  let p='',cx=0,cy=0;
  for(const r of rects){p+=(p?`m${r.x-cx} ${r.y-cy}`:`M${r.x} ${r.y}`)+`h${r.w}v${r.h}h${-r.w}`;cx=r.x;cy=r.y+r.h;}
  return p.replace(/ -/g,'-');
}
const variants={
  base,
  h: dilate(base,1,0),
  h2: dilate(dilate(base,1,0),1,0),
  hv: dilate(base,1,1)
};
const report={};
for(const [k,v] of Object.entries(variants)){
  const fill=v.join('').split('').filter(c=>c==='X').length;
  const runs=v.flatMap(r=>[...r.matchAll(/X+/g)].map(m=>m[0].length));
  const avg=runs.reduce((a,b)=>a+b,0)/runs.length;
  report[k]={fill,avgRun:+avg.toFixed(2),maxRun:Math.max(...runs),path:toPath(v)};
  console.log('### '+k+' fill='+fill+' avgRun='+avg.toFixed(2)+' maxRun='+Math.max(...runs));
  console.log(show(v));
}
await fs.writeFile(path.join(here,'pencil-variants.json'),JSON.stringify(report,null,2)+'\n');
for(const [k,v] of Object.entries(report)){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#000" d="${v.path}"/></svg>\n`;
  await fs.writeFile(path.join(here,'candidate-pencil-line-'+k+'.svg'),svg);
}
console.log('base avgRun',report.base.avgRun,'-> h',report.h.avgRun);
