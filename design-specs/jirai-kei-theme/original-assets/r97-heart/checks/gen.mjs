import fs from 'node:fs';import {hearts,svg,uri} from './hearts.mjs';
const A='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/original-assets/r97-heart';
for(const [n,rows] of Object.entries(hearts)){
 // sanity: rectangular + mirror symmetry of outline/body (ignoring highlight)
 const w=rows[0].length;rows.forEach(r=>{if(r.length!==w)throw Error(n+' row len');const m=r.replace(/H/g,'P');if(m!==[...m].reverse().join(''))throw Error(n+' asym '+r)});
 fs.writeFileSync(`${A}/heart-${n}.svg`,svg(n,rows,true));
 const u=uri(svg(n,rows,false));fs.writeFileSync(`/tmp/jirai-r97-q7/uri-${n}.txt`,u);
 console.log(n,'file',fs.statSync(`${A}/heart-${n}.svg`).size,'uri',u.length);
}
