// R8: Lucide ISC / Feather MIT derivatives. Preserve LUCIDE-LICENSE.txt.
// 16px grid, ~2px arcs. Clockwise tangent points down at right / up at left.
// Run AFTER older hand-batch1/2 scripts if rebuilding those historical batches.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const top=[
'................',
'.....XXXXX......',
'...XXXXXXXXX....',
'..XXX.....XXX...',
'.XXX......XXXXX.',
'.XX........XXX..',
'.XX.........X...',
'................'];
const refresh=[...top,...top.slice().reverse().map(s=>[...s].reverse().join(''))];
const rotate=[...top.slice(0,7),
'.XX.............',
'.XX.............',
'.XX..........XX.',
'.XXX........XXX.',
'..XX........XX..',
'..XXX......XXX..',
'...XXXXXXXXXX...',
'.....XXXXXX.....',
'................'];
const mirror=g=>g.map(s=>[...s].reverse().join(''));
const history=mirror(rotate).map(s=>[...s]);
// Original History/Lucide clock semantics: twelve-to-three hands, not a reset dot.
for(let y=4;y<=8;y++) for(let x=7;x<=8;x++) history[y][x]='X';
for(let y=8;y<=9;y++) for(let x=7;x<=10;x++) history[y][x]='X';
export const grids={'refresh-cw':refresh,'refresh-ccw':mirror(refresh),'rotate-cw':rotate,'rotate-ccw':mirror(rotate),'rotate-ccw-clock':history.map(s=>s.join(''))};
export function svg(grid){
 if(grid.length!==16||grid.some(s=>s.length!==16||/[^.X]/.test(s)))throw new Error('Invalid 16px grid');
 const commands=[];grid.forEach((row,y)=>{for(let x=0;x<16;){if(row[x]!== 'X'){x++;continue}const start=x;while(x<16&&row[x]==='X')x++;commands.push(`M${start} ${y}h${x-start}v1h-${x-start}Z`)}});
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#000" d="${commands.join(' ')}"/></svg>\n`;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 await fs.mkdir(path.join(root,'src-hand'),{recursive:true});
 for(const [name,grid] of Object.entries(grids))await fs.writeFile(path.join(root,'src-hand',name+'.svg'),svg(grid));
 console.log('R8 hand overrides:',Object.keys(grids).join(', '));
}
