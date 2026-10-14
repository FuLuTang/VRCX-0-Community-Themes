// ASCII source of truth: O=#34316a outline, P=#ffb8e6 body, H=#fdf4ff highlight, .=transparent
export const hearts={
 '9x7':[
  '.OOO.OOO.',
  'OHPPOPPPO',
  'OHPPPPPPO',
  '.OPPPPPO.',
  '..OPPPO..',
  '...OPO...',
  '....O....'],
 '10x8':[
  '.OOO..OOO.',
  'OHHPOOPPPO',
  'OHPPPPPPPO',
  'OPPPPPPPPO',
  '.OPPPPPPO.',
  '..OPPPPO..',
  '...OPPO...',
  '....OO....'],
 '11x9':[
  '.OOO...OOO.',
  'OHHPO.OPPPO',
  'OHPPPOPPPPO',
  'OPPPPPPPPPO',
  '.OPPPPPPPO.',
  '..OPPPPPO..',
  '...OPPPO...',
  '....OPO....',
  '.....O.....'],
};
export const colors={O:'#34316a',P:'#ffb8e6',H:'#fdf4ff'};
export function paths(rows){const out={};for(const k of 'OPH'){const rects=[];rows.forEach((r,y)=>{for(let x=0;x<r.length;){const m=c=>c===k||(k==='P'&&c==='H');if(!m(r[x])){x++;continue}let e=x;while(e<r.length&&m(r[e]))e++;const prev=rects.find(q=>q.x===x&&q.w===e-x&&q.y+q.h===y);if(prev)prev.h++;else rects.push({x,y,w:e-x,h:1});x=e;}});out[k]=rects.map(q=>`M${q.x} ${q.y}h${q.w}v${q.h}h-${q.w}z`).join('')}return out}
export function svg(name,rows,full){const w=rows[0].length,h=rows.length;const p=paths(rows);
 const head=full?`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><title>R9.7 ${w}x${h} pixel heart</title><desc>Independent ${w} by ${h} native pixel grid: one-pixel #34316a outline, #ffb8e6 body, upper-left #fdf4ff highlight.</desc>\n`:`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' shape-rendering='crispEdges'>`;
 const q=full?'"':"'";
 const body=[...'OPH'].map(k=>`<path fill=${q}${colors[k]}${q} d=${q}${p[k]}${q}/>`).join(full?'\n':'');
 return head+body+(full?'\n':'')+'</svg>'+(full?'\n':'');}
export const uri=s=>'url("data:image/svg+xml,'+s.replace(/</g,'%3C').replace(/>/g,'%3E').replace(/#/g,'%23')+'")';
