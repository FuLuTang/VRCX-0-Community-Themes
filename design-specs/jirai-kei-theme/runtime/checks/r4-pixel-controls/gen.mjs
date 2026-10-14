/* Generates runtime/pixel-controls.css from ASCII pixel art. Original art; NOT WINDOWS. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),out=path.resolve(here,'../../pixel-controls.css');
const enc=s=>`url("data:image/svg+xml,${s.replace(/#/g,'%23').replace(/</g,'%3C').replace(/>/g,'%3E')}")`;
/* ASCII grid -> one <path> per colour made of horizontal runs (crispEdges). */
function art(rows,pal){const w=rows[0].length,h=rows.length,runs={};rows.forEach((r,y)=>{if(r.length!==w)throw Error('row '+y);for(let x=0;x<w;){const c=r[x];let n=1;while(r[x+n]===c)n++;if(c!=='.')(runs[c]??=[]).push(`M${x} ${y}h${n}v1h-${n}z`);x+=n;}});
 return enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' shape-rendering='crispEdges'>${Object.entries(runs).map(([c,d])=>`<path fill='${pal[c]}' d='${d.join('')}'/>`).join('')}</svg>`);}
/* R4b: user asked for the original raised bevel knob with the icon painted ON it.
   18x18 knob = 1px ink frame + light/dark bevel + lilac face; 14x14 icon area. */
const KF={k:'#16112a',L:'#fdf4ff',D:'#7a3f6d',F:'#cdb0e8'};
const knob=(icon,pal)=>{const rows=[];for(let y=0;y<18;y++){let r='';for(let x=0;x<18;x++){let c='F';
  if(x===0||y===0||x===17||y===17)c='k';else if(x===1||y===1)c='L';else if(x===16||y===16)c='D';
  const ix=x-2,iy=y-2;if(ix>=0&&iy>=0&&ix<14&&iy<14&&icon[iy][ix]!=='.')c=icon[iy][ix];r+=c;}rows.push(r);}
  return art(rows,{...KF,...pal});};
/* ON: pixel heart, centred in the 14x14 icon area. */
const heart=knob([
'..............',
'..............',
'..kkk...kkk...',
'.kllpk.kpppk..',
'kllwpppppppdk.',
'klwpppppppppdk',
'kwpppppppppdk.',
'.kpppppppppdk.',
'..kpppppppdk..',
'...kppppppk...',
'....kppppk....',
'.....kpdk.....',
'......kk......',
'..............'].map(r=>r.padEnd(14,'.').slice(0,14)),{k:'#7a2e5e',p:'#ff7fcf',l:'#ffb8e6',w:'#fdf4ff',d:'#d4509f'});
/* OFF: two tan sticking plasters crossed into an X (5px-wide strips, rounded ends,
   vent dots, gauze pad on top strip), after common pixel band-aid references. */
import bandGrid from './bandage-grid.mjs';
const plaster=knob(bandGrid,{o:'#5a2e18',t:'#e6a463',h:'#f8cc96',s:'#cf8b4f',d:'#99532c',g:'#fbeed4',G:'#e9c79a',b:'#d48f52',H:'#eab27c',S:'#b97540'});
/* Win98-style grip: three dark/light line pairs centred on the scroll thumb. */
const gripV=art(['DDDDDD','LLLLLL','......','DDDDDD','LLLLLL','......','DDDDDD','LLLLLL'],{D:'#7a3f6d',L:'#fdf4ff'});
const gripH=art(['DL.DL.DL','DL.DL.DL','DL.DL.DL','DL.DL.DL','DL.DL.DL','DL.DL.DL'],{D:'#7a3f6d',L:'#fdf4ff'});
/* ON / OFF lamp lettering as 5px pixel glyphs (crisp under ClearType; no font dependency) */
const on=art([
'.##..#..#',
'#..#.##.#',
'#..#.#.##',
'#..#.#..#',
'.##..#..#'],{'#':'#ff7fcf'});
const off=art([
'.##..###.###',
'#..#.#...#..',
'#..#.##..##.',
'#..#.#...#..',
'.##..#...#..'],{'#':'#b9add9'});
/* 14x14 Win-style button: ink frame, light/dark bevel, lilac face, ink pixel triangle. */
const btn=d=>enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' shape-rendering='crispEdges' fill='#16112a'><path d='M0 0h14v14H0z'/><path fill='#fdf4ff' d='M1 1h12v12H1z'/><path fill='#7a3f6d' d='M2 2h11v11H2z'/><path fill='#cdb0e8' d='M2 2h10v10H2z'/><path d='${d}'/></svg>`);
const up=btn('M6 5h2v1h1v1h1v1H4V7h1V6h1z'),dn=btn('M4 6h6v1H9v1H8v1H6V8H5V7H4z'),lt=btn('M5 6h1V5h1V4h1v6H7V9H6V8H5z'),rt=btn('M6 4h1v1h1v1h1v2H8v1H7v1H6z');
/* 10x8 progress cell: 8x8 block (highlight top, shade bottom) + 2px gap; tiled, never stretched. */
const cell=art([
'llllllll..',
'pppppppp..',
'pppppppp..',
'pppppppp..',
'pppppppp..',
'pppppppp..',
'pppppppp..',
'dddddddd..'],{l:'#ffb8e6',p:'#ff7fcf',d:'#b35aa0'});
const css=`/* R4 pixel controls: Switch / scrollbars / Progress. Original pixel art, data: URIs only. Source-evidenced selectors (see research/pixel-controls-r4.md). */
:root{--pc-up:${up};--pc-dn:${dn};--pc-lt:${lt};--pc-rt:${rt}}
/* Switch: Windose sunken slot + ON/OFF lamp, plaster-X knob (off) / heart knob (on) */
[data-slot=switch]{width:46px;height:22px;border:1px solid #16112a;border-radius:0;background:#120d22;box-shadow:inset 1px 1px #000,inset -1px -1px #8f7fe0;transition:none}
[data-slot=switch][data-size=sm]{width:44px;height:20px}
[data-slot=switch]::before{content:"";position:absolute;top:7px;right:6px;width:12px;height:5px;background:${off} 0 0/12px 5px no-repeat;pointer-events:none}
[data-slot=switch][data-checked]::before{right:auto;left:8px;width:9px;background:${on} 0 0/9px 5px no-repeat}
[data-slot=switch][data-size=sm]::before{top:6px;right:5px}
[data-slot=switch][data-size=sm][data-checked]::before{right:auto;left:7px}
[data-slot=switch-thumb]{width:18px;height:18px;margin-left:1px;border-radius:0;box-shadow:none;background:${plaster} 0 0/18px 18px no-repeat;translate:0;transition:translate .16s steps(3,end)}
[data-slot=switch-thumb][data-checked]{background-image:${heart};translate:24px 0}
[data-size=sm]>[data-slot=switch-thumb]{margin-left:0}
[data-size=sm]>[data-slot=switch-thumb][data-checked]{translate:24px 0}
[data-slot=switch][data-disabled]{opacity:.45;filter:saturate(.35)}
[data-slot=switch]:focus-visible{outline:2px solid #ffb8e6;outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-slot=switch-thumb]{transition:none}}
/* Native scrollbars: app sets scrollbar-width/color on *, which disables ::-webkit-scrollbar in Chromium 121+ */
*:not(.no-scrollbar,.base-ui-disable-scrollbar){scrollbar-width:auto;scrollbar-color:auto}
::-webkit-scrollbar{width:14px;height:14px;background:#2a2147}
::-webkit-scrollbar-track{background:#2a2147;box-shadow:inset 0 0 0 1px #6c5ce0}
::-webkit-scrollbar-thumb{background:#ff7fcf ${gripV} 50% 50%/6px 8px no-repeat;border:1px solid #16112a;border-radius:0;box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d}
::-webkit-scrollbar-thumb:horizontal{background-image:${gripH};background-size:8px 6px}
::-webkit-scrollbar-thumb:hover{background-color:#ffb8e6}
::-webkit-scrollbar-corner{background:#201936}
::-webkit-scrollbar-button{display:none}
::-webkit-scrollbar-button:single-button{display:block;width:14px;height:14px;background:var(--pc-up) 0 0/14px 14px no-repeat}
::-webkit-scrollbar-button:single-button:vertical:increment{background-image:var(--pc-dn)}
::-webkit-scrollbar-button:single-button:horizontal:decrement{background-image:var(--pc-lt)}
::-webkit-scrollbar-button:single-button:horizontal:increment{background-image:var(--pc-rt)}
/* Base UI ScrollArea: padding reserves the arrow cells (Base UI subtracts scrollbar padding from thumb travel) */
[data-slot=scroll-area-scrollbar]{border:0;border-radius:0;background:#2a2147;box-shadow:inset 0 0 0 1px #6c5ce0}
[data-slot=scroll-area-scrollbar][data-orientation=vertical]{width:14px;padding:14px 0;background:var(--pc-up) 0 0/14px 14px no-repeat,var(--pc-dn) 0 100%/14px 14px no-repeat,#2a2147}
[data-slot=scroll-area-scrollbar][data-orientation=horizontal]{height:14px;padding:0 14px;background:var(--pc-lt) 0 0/14px 14px no-repeat,var(--pc-rt) 100% 0/14px 14px no-repeat,#2a2147}
[data-slot=scroll-area-thumb]{border-radius:0;background:#ff7fcf ${gripV} 50% 50%/6px 8px no-repeat;border:1px solid #16112a;box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d}
[data-orientation=horizontal]>[data-slot=scroll-area-thumb]{background-image:${gripH};background-size:8px 6px}
[data-slot=scroll-area-thumb]:hover{background-color:#ffb8e6}
/* Progress: sunken slot + fixed-size pink cells (tile 10x8, no stretching) */
[data-slot=progress-track]{box-sizing:content-box;height:12px;padding:0 2px;border:1px solid #16112a;border-radius:0;background:#120d22;box-shadow:inset 1px 1px #000,inset -1px -1px #8f7fe0}
[data-slot=progress-indicator]{border-radius:0;background:${cell} 0 50%/10px 8px repeat-x}
.indeterminate-progress [data-slot=progress-indicator]{animation-timing-function:steps(10,end)}
[data-slot=skeleton]{animation-timing-function:steps(3,end)}
[data-slot=spinner]{animation-timing-function:steps(8,end)}
`;
await fs.writeFile(out,css);console.log(out,Buffer.byteLength(css),'B');
