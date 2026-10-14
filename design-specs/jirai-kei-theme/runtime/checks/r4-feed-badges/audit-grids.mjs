/* Systematic audit of all 243 checked-in glyph grids: how "blocky" is each pixel
   drawing? A CSS-covered icon can still read as an ordinary lucide stroke when its
   16x16 raster is a 1px-wide diagonal outline. Produces the evidence for
   research/feed-r4.md. Read-only. */
import fs from 'node:fs/promises';
const icons='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/original-assets/icons';
const grids=JSON.parse(await fs.readFile(icons+'/src/_grids.json','utf8'));
const feed=['log-in','log-out','pencil-line','person-standing','map-pin','file-text','lock','arrow-right','chevron-right'];
const rows=[];
for(const [name,g] of Object.entries(grids)){
  const fill=g.join('').split('').filter(c=>c==='X').length;
  const runs=g.flatMap(r=>[...r.matchAll(/X+/g)].map(m=>m[0].length));
  const thin=runs.filter(n=>n<=1).length;
  rows.push({name,fill,avgRun:+(runs.reduce((a,b)=>a+b,0)/runs.length).toFixed(2),maxRun:Math.max(...runs),thinShare:+(thin/runs.length).toFixed(2)});
}
rows.sort((a,b)=>a.avgRun-b.avgRun);
const nameOf=n=>rows.find(r=>r.name===n);
const report={total:rows.length,feed:feed.map(n=>nameOf(n)||{name:n,missing:true}),
 thin25:rows.slice(0,25),median:rows[Math.floor(rows.length/2)]};
console.log('avgRun distribution: min',rows[0].avgRun,'median',report.median.avgRun,'max',rows[rows.length-1].avgRun);
console.log('\n25 thinnest glyphs (avgRun asc) — raster reads as a 1px outline, not a pixel block:');
for(const r of report.thin25)console.log('  '+r.name.padEnd(24),'avgRun',String(r.avgRun).padEnd(5),'fill',String(r.fill).padEnd(4),'maxRun',String(r.maxRun).padEnd(3),'1px-runs',r.thinShare);
console.log('\nfeed-scope glyphs:');
for(const r of report.feed)console.log('  '+r.name.padEnd(24),'avgRun',String(r.avgRun).padEnd(5),'fill',String(r.fill).padEnd(4),'maxRun',r.maxRun,'rank',rows.findIndex(x=>x.name===r.name)+1,'/'+rows.length);
await fs.writeFile(new URL('./grid-blockiness.json',import.meta.url).pathname.replace('/runtime/checks','/runtime/checks'),JSON.stringify(report,null,2)+'\n');
