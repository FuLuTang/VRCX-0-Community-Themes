/* Task-58 equation-driven large-heart candidates. Writes only the two candidate folders. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const checksDir = path.dirname(fileURLToPath(import.meta.url));
const parentChecks = path.resolve(checksDir, '..');
const parentAssets = path.resolve(checksDir, '../../../../original-assets/r10-heart-reference');
const candidateAssets = path.join(parentAssets, 'heart-11x9-candidates');
const sourceReport = JSON.parse(await fs.readFile(path.join(parentChecks, 'pixel-report.json'), 'utf8'));
const palette = { O:'#ae387d', H:'#ffcced', P:'#ff87c6', S:'#cc5282' };
const bgPink = '#d97fc6', bgDark = '#201936';
const titlebarHeightPx = 32, slotPx = 14, previewMagnification = 4;
const assert = (ok, message) => { if (!ok) throw new Error(message); };

function validateRows(label, rows, width, height, requireSymmetry=true) {
  assert(rows.length === height && rows.every((row) => row.length === width), `${label}: matrix dimensions mismatch`);
  for (const row of rows) for (const c of row) assert('.OHPS'.includes(c), `${label}: unknown matrix code ${c}`);
  if(requireSymmetry)assert(rows.every((row) => row === [...row].reverse().join('')), `${label}: color matrix is not horizontally symmetric`);
}
function gridFromSvg(svg) {
  const size = svg.match(/<svg[^>]*width="(\d+)" height="(\d+)"/);
  assert(size, 'Could not read current 11x9 SVG dimensions');
  const width = Number(size[1]), height = Number(size[2]);
  const codeByColor = Object.fromEntries(Object.entries(palette).map(([code, color]) => [color, code]));
  const rows = Array.from({ length: height }, () => Array(width).fill('.'));
  for (const group of svg.matchAll(/<g fill="(#[0-9a-fA-F]{6})">([\s\S]*?)<\/g>/g)) {
    const code = codeByColor[group[1].toLowerCase()];
    assert(code, `Unexpected color in current large SVG: ${group[1]}`);
    for (const rect of group[2].matchAll(/<rect x="(\d+)" y="(\d+)" width="1" height="1"\/>/g)) {
      const x = Number(rect[1]), y = Number(rect[2]);
      assert(x < width && y < height && rows[y][x] === '.', 'Duplicate or out-of-grid SVG cell');
      rows[y][x] = code;
    }
  }
  return { width, height, rows:rows.map((row)=>row.join('')) };
}
const originalV1 = sourceReport.comparisonDrafts.previous11x9V1.rows;
const currentV2 = sourceReport.matrices['11x9'];
const currentSvgPath = path.join(parentAssets, 'heart-11x9.svg');
const currentSvg = await fs.readFile(currentSvgPath, 'utf8');
const parsedV2 = gridFromSvg(currentSvg);
validateRows('V1 comparison', originalV1, 11, 9, false);
validateRows('current V2', currentV2, 11, 9);
assert(parsedV2.width === 11 && parsedV2.height === 9 && JSON.stringify(parsedV2.rows) === JSON.stringify(currentV2), 'The protected current 11x9 SVG and report differ');

// Coordinates are cell centers: x = column - (W-1)/2, y = row. Each silhouette is the union of two upper ellipses and a downward half-ellipse; C adds an elliptical lower cap.
const candidates = [
  {
    id:'A', key:'A-wide-round-13x11', label:'A · wide round lobes', description:'Broad round twin lobes, shallow-to-medium cleft, broad shoulders, short oval taper.',
    width:13, height:11,
    lobes:{ offset:3.5, centerY:1.4, rx:3.0, ry:2.4 },
    body:{ startY:2, rx:6.2, ry:8 },
    equation:'Union of ((x+3.5)/3.0)^2+((y-1.4)/2.4)^2≤1, ((x-3.5)/3.0)^2+((y-1.4)/2.4)^2≤1, and y≥2 with (x/6.2)^2+((y-2)/8)^2≤1.'
  },
  {
    id:'B', key:'B-tall-classic-13x13', label:'B · tall classic waist', description:'Taller classic heart, deeper cleft, narrower lobes and a longer controlled taper.',
    width:13, height:13,
    lobes:{ offset:2.9, centerY:1.4, rx:2.8, ry:2.6 },
    body:{ startY:3, rx:6.2, ry:9 },
    equation:'Union of ((x+2.9)/2.8)^2+((y-1.4)/2.6)^2≤1, ((x-2.9)/2.8)^2+((y-1.4)/2.6)^2≤1, and y≥3 with (x/6.2)^2+((y-3)/9)^2≤1.'
  },
  {
    id:'C', key:'C-shallow-soft-15x13', label:'C · shallow cleft / soft base', description:'Very shallow cleft, broad open crown, then a smoother 5/5/3/1 rounded lower cap.',
    width:15, height:13,
    lobes:{ offset:3.2, centerY:1.2, rx:3.5, ry:2.2 },
    body:{ startY:1.5, rx:7.2, ry:7.2, stopY:8 },
    cap:{ centerY:9, rx:2.5, ry:3, startY:8 },
    equation:'Union of ((x+3.2)/3.5)^2+((y-1.2)/2.2)^2≤1, ((x-3.2)/3.5)^2+((y-1.2)/2.2)^2≤1, body ellipse y∈[1.5,8] with (x/7.2)^2+((y-1.5)/7.2)^2≤1, and lower cap y≥8 with (x/2.5)^2+((y-9)/3)^2≤1.'
  }
];
const eqEllipse = (x, y, cx, cy, rx, ry) => ((x-cx)/rx)**2 + ((y-cy)/ry)**2 <= 1;
function rasterMask(spec) {
  const cx = (spec.width - 1) / 2;
  return Array.from({ length: spec.height }, (_, y) => Array.from({ length: spec.width }, (_, col) => {
    const x = col - cx, l = spec.lobes, b = spec.body;
    const lobeLeft = eqEllipse(x, y, -l.offset, l.centerY, l.rx, l.ry);
    const lobeRight = eqEllipse(x, y, l.offset, l.centerY, l.rx, l.ry);
    const inBody = y >= b.startY && (b.stopY === undefined || y <= b.stopY) && eqEllipse(x, y, 0, b.startY, b.rx, b.ry);
    const cap = spec.cap && y >= spec.cap.startY && eqEllipse(x, y, 0, spec.cap.centerY, spec.cap.rx, spec.cap.ry);
    return lobeLeft || lobeRight || inBody || Boolean(cap);
  }));
}
function lowerHalfWidth(spec, y) {
  if (spec.cap && y >= spec.cap.startY) {
    const t = (y-spec.cap.centerY)/spec.cap.ry;
    return spec.cap.rx * Math.sqrt(Math.max(0, 1-t*t));
  }
  const b = spec.body;
  if (y < b.startY || (b.stopY !== undefined && y > b.stopY)) return 0;
  const t = (y-b.startY)/b.ry;
  return b.rx * Math.sqrt(Math.max(0, 1-t*t));
}
function colorize(spec, mask) {
  const cx = (spec.width - 1) / 2, { lobes } = spec;
  const rows = mask.map((row, y) => row.map((inside, col) => {
    if (!inside) return '.';
    const x = col - cx;
    const boundary = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => !mask[y+dy]?.[col+dx]);
    if (boundary) return 'O';
    const hiLeft = eqEllipse(x, y, -lobes.offset, lobes.centerY+0.2, 1.25, 1.0);
    const hiRight = eqEllipse(x, y, lobes.offset, lobes.centerY+0.2, 1.25, 1.0);
    if (hiLeft || hiRight) return 'H';
    const halfWidth = lowerHalfWidth(spec, y);
    if (y >= (spec.height-1)*0.54 && halfWidth > 0 && Math.abs(x) >= halfWidth*0.48) return 'S';
    return 'P';
  }).join(''));
  return rows;
}
function profile(mask) {
  const spans=[], inkCounts=[];
  for (const row of mask) {
    const xs=row.map((v,i)=>v?i:-1).filter((v)=>v>=0);
    spans.push(xs.length ? xs.at(-1)-xs[0]+1 : 0);
    inkCounts.push(xs.length);
  }
  return { rowSpanWidths:spans, rowInkCounts:inkCounts };
}
function connectedComponents(mask) {
  const h=mask.length,w=mask[0].length,seen=new Set();let count=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(mask[y][x]&&!seen.has(`${x},${y}`)){
    count++;const queue=[[x,y]];seen.add(`${x},${y}`);
    for(let q=0;q<queue.length;q++)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const nx=queue[q][0]+dx,ny=queue[q][1]+dy,key=`${nx},${ny}`;
      if(nx>=0&&nx<w&&ny>=0&&ny<h&&mask[ny][nx]&&!seen.has(key)){seen.add(key);queue.push([nx,ny]);}
    }
  }
  return count;
}
function colorCounts(rows) {
  return Object.fromEntries(Object.keys(palette).map((c)=>[c,rows.join('').split(c).length-1]));
}
function svgFor(title, description, rows) {
  const h=rows.length,w=rows[0].length;
  const groups=Object.entries(palette).map(([code,color])=>{
    const cells=[];
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(rows[y][x]===code)cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    return cells.length?`<g fill="${color}">${cells.join('')}</g>`:'';
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><title>${title}</title><desc>${description} Palette: outline ${palette.O}, highlight ${palette.H}, body ${palette.P}, shade ${palette.S}.</desc>${groups}</svg>\n`;
}
function referenceSvg(title, rows) { return svgFor(title, 'Comparison-only matrix from the existing report; not written over any reference asset.', rows); }

const generated = {};
for (const spec of candidates) {
  const mask = rasterMask(spec), rows=colorize(spec, mask), p=profile(mask), counts=colorCounts(rows);
  validateRows(spec.key, rows, spec.width, spec.height);
  assert(connectedComponents(mask)===1, `${spec.key}: silhouette must be one 8-connected heart`);
  assert(Object.values(counts).every((n)=>n>0), `${spec.key}: all four colors must appear`);
  for(let y=0;y<spec.height;y++)for(let x=0;x<spec.width;x++){
    const boundary=mask[y][x]&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>!mask[y+dy]?.[x+dx]);
    assert(mask[y][x]?((rows[y][x]==='O')===boundary):rows[y][x]==='.', `${spec.key}: one-cell boundary mismatch at ${x},${y}`);
  }
  spec.matrixRows=rows; spec.profile=p; spec.colorCounts=counts; spec.filledCells=mask.flat().filter(Boolean).length;
  spec.svg=svgFor(`${spec.id} · ${spec.width}x${spec.height}`, `${spec.description} Rasterized from the recorded ellipse equations at native logical-cell centers.`, rows);
  generated[spec.id]=spec.svg;
}

const expectedProfiles = {
  A:[11,13,13,13,13,11,11,9,9,7,1],
  B:[11,11,11,13,13,13,11,11,11,9,7,5,1],
  C:[13,13,15,15,13,13,11,9,7,5,5,3,1]
};
for(const spec of candidates)assert(JSON.stringify(spec.profile.rowSpanWidths)===JSON.stringify(expectedProfiles[spec.id]),`${spec.id}: equation-derived width profile changed`);

// Preserve old V1 and current V2 as in-memory comparison references; do not write either formal SVG.
const references=[
  { id:'V1', key:'previous11x9V1', label:'V1 · original 11×9', width:11, height:9, rows:originalV1, svg:referenceSvg('V1 · original 11x9',originalV1) },
  { id:'V2', key:'current11x9V2', label:'V2 · current 11×9', width:11, height:9, rows:currentV2, svg:currentSvg }
];
for(const ref of references)validateRows(ref.id,ref.rows,ref.width,ref.height,ref.id!=='V1');
const comparisonItems=[...references,...candidates.map((c)=>({id:c.id,label:`${c.id} · ${c.width}×${c.height}`,width:c.width,height:c.height,rows:c.matrixRows,svg:c.svg}))];
const renderSvg = async (svg, width, height) => sharp(Buffer.from(svg),{density:72}).resize(width,height,{fit:'fill',kernel:'nearest'}).png().toBuffer();
const previewDimensions=[];
async function createScaleComparison(background, fileName) {
  const factors=[1,2,4,6], labelW=46, colW=166, headerH=32, gap=2;
  const rowHeights=factors.map((f)=>Math.max(...comparisonItems.map((it)=>it.height*f))+24);
  const width=labelW+colW*comparisonItems.length;
  const height=headerH+rowHeights.reduce((a,b)=>a+b+gap,0);
  const fg=background===bgPink?'#211a33':'#fdf4ff', header=background===bgPink?'#e997d1':'#171326';
  let markup=`<rect width="100%" height="100%" fill="${background}"/><rect width="100%" height="${headerH}" fill="${header}"/>`;
  for(let i=0;i<comparisonItems.length;i++)markup+=`<text x="${labelW+i*colW+colW/2}" y="21" text-anchor="middle" fill="${fg}" font-family="sans-serif" font-size="10">${comparisonItems[i].label}</text>`;
  const layers=[];let y=headerH;
  for(let ri=0;ri<factors.length;ri++){
    const factor=factors[ri],rowH=rowHeights[ri];
    markup+=`<text x="9" y="${y+18}" fill="${fg}" font-family="monospace" font-size="10">${factor}×</text><line x1="0" y1="${y+rowH}" x2="${width}" y2="${y+rowH}" stroke="${fg}" opacity=".2"/>`;
    for(let i=0;i<comparisonItems.length;i++){
      const item=comparisonItems[i],w=item.width*factor,h=item.height*factor;
      layers.push({input:await renderSvg(item.svg,w,h),left:labelW+i*colW+Math.floor((colW-w)/2),top:y+Math.floor((rowH-h)/2)});
    }
    y+=rowH+gap;
  }
  const file=path.join(checksDir,fileName);
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${markup}</svg>`)).composite(layers).png().toFile(file);
  const meta=await sharp(file).metadata(); previewDimensions.push({file:fileName,width:meta.width,height:meta.height,background,scales:factors});
  return {file:fileName,width:meta.width,height:meta.height,background,scales:factors,method:'native grids at integer nearest-neighbor scale; no candidate is a scaled copy'};
}

// AppTitleBar is h-8 (32px); the existing heart display study marks a 14px square slot. Each icon is shown at 1 CSS px per logical cell; only the preview sheet itself is enlarged 4x for inspection.
async function createTitlebarOccupancy() {
  const items=comparisonItems,labelW=104,barW=306,sectionH=25,rowStep=38,width=labelW+barW;
  const sections=[{bg:bgPink,name:'PINK · #d97fc6',fg:'#211a33'},{bg:bgDark,name:'DARK · #201936',fg:'#fdf4ff'}];
  const height=sections.length*(sectionH+items.length*rowStep);
  let markup=`<rect width="100%" height="100%" fill="#171326"/>`;
  const layers=[];let y=0;
  for(const section of sections){
    markup+=`<rect x="0" y="${y}" width="${width}" height="${sectionH}" fill="#171326"/><text x="8" y="17" fill="#fdf4ff" font-family="monospace" font-size="9">${section.name} · 32px titlebar</text>`;
    y+=sectionH;
    for(const item of items){
      const rowY=y,barX=labelW,slotX=barX+12,slotY=rowY+Math.floor((titlebarHeightPx-slotPx)/2);
      markup+=`<rect x="0" y="${rowY}" width="${labelW}" height="${titlebarHeightPx}" fill="#201936"/><text x="8" y="${rowY+20}" fill="#f2ebff" font-family="sans-serif" font-size="8">${item.label}</text><rect x="${barX}" y="${rowY}" width="${barW}" height="${titlebarHeightPx}" fill="${section.bg}"/><rect x="${slotX}" y="${slotY}" width="${slotPx}" height="${slotPx}" fill="none" stroke="${section.fg}" stroke-opacity=".65" stroke-dasharray="1 1"/><text x="${slotX+22}" y="${rowY+21}" fill="${section.fg}" font-family="sans-serif" font-size="12">VRCX-0-jirai</text>`;
      const left=slotX+Math.round((slotPx-item.width)/2),top=rowY+Math.floor((titlebarHeightPx-item.height)/2);
      layers.push({input:await renderSvg(item.svg,item.width,item.height),left,top});
      y+=rowStep;
    }
  }
  const file=path.join(checksDir,'titlebar-occupancy.png');
  const base=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${markup}</svg>`);
  const composed=await sharp(base).composite(layers).png().toBuffer();
  await sharp(composed).resize(width*previewMagnification,height*previewMagnification,{kernel:'nearest'}).png().toFile(file);
  const meta=await sharp(file).metadata();previewDimensions.push({file:'titlebar-occupancy.png',width:meta.width,height:meta.height});
  return {file:'titlebar-occupancy.png',width:meta.width,height:meta.height,titlebarHeightPx,slotPx,previewMagnification,cellSizeCssPx:1,sourceEvidence:{titlebar:'VRCX-0-jirai/src/components/layout/AppTitleBar.tsx:96 class h-8 (32px)',slot:'Existing 14px slot in runtime/checks/r10-heart-reference/display-5-7-9.png and verify.mjs display study'},occupancy:items.map((item)=>({id:item.id,logicalSize:`${item.width}x${item.height}`,overflowWidthPx:Math.max(0,item.width-slotPx),overflowHeightPx:Math.max(0,item.height-slotPx),placementRule:item.width>slotPx?`overflows the 14px slot by ${item.width-slotPx}px at native size`:'fits within the 14px slot at native size'}))};
}

await fs.mkdir(candidateAssets,{recursive:true});
for(const spec of candidates){
  const target=path.join(candidateAssets,`${spec.key}.svg`);
  await fs.writeFile(target,spec.svg);
  const saved=await fs.readFile(target,'utf8'),parsed=gridFromSvg(saved);
  assert(saved===spec.svg&&parsed.width===spec.width&&parsed.height===spec.height&&JSON.stringify(parsed.rows)===JSON.stringify(spec.matrixRows),`${spec.key}: written SVG differs from equation matrix`);
  assert((saved.match(/<rect/g)||[]).length===spec.filledCells,`${spec.key}: SVG must contain one 1x1 rect per filled cell`);
}
const pinkPreview=await createScaleComparison(bgPink,'comparison-pink.png');
const darkPreview=await createScaleComparison(bgDark,'comparison-dark.png');
const titlebarPreview=await createTitlebarOccupancy();

const report={
  scope:'Task-58 design candidates only. Existing 7x6, 9x8, current 11x9 V2, V1 report, and CSS/runtime are read-only. Internal preview; source license unclear.',
  palette,
  construction:{sampling:'Cell centers x=column-(width-1)/2, y=row. Include a cell when it lies inside the union of the recorded upper-lobe ellipse(s) and lower-body ellipse equation(s).',outline:'One-cell four-neighbor boundary in O; H spots near both upper ellipse centers; S on lower inner shoulders; P fills remaining interior.',rasterization:'Each candidate is drawn on its own native integer grid; no SVG is copied/scaled from another size.'},
  sourceReferences:{originalV1:{rows:originalV1,width:11,height:9,source:'pixel-report.json comparisonDrafts.previous11x9V1'},currentV2:{rows:currentV2,width:11,height:9,source:'heart-11x9.svg, byte-derived and checked against pixel-report.json'}},
  candidates:candidates.map(({id,key,label,description,width,height,lobes,body,cap,equation,matrixRows,profile,colorCounts,filledCells})=>({id,key,label,description,width,height,equation,parameters:{lobes,body,cap:cap??null},rowSpanWidths:profile.rowSpanWidths,rowInkCounts:profile.rowInkCounts,filledCells,colorCounts,horizontallySymmetric:true,matrixRows})),
  titlebarContext:titlebarPreview,
  previews:{pink:pinkPreview,dark:darkPreview,titlebar:titlebarPreview,scales:[1,2,4,6],comparisonOrder:['V1 original 11x9','V2 current 11x9','A 13x11','B 13x13','C 15x13'],backgrounds:{pink:bgPink,dark:bgDark}},
  verification:{currentV2AssetMatchesReport:true,candidateSvgsMatchMatrices:true,allCandidateMatricesSymmetric:true,allCandidates8Connected:true,allColorsUsed:true,equationProfilesMatchAssertions:true,allCandidateSvgCellsNative1x1:true,allPreviewEdgesAtMost2000:previewDimensions.every((p)=>p.width<=2000&&p.height<=2000)}
};
assert(report.verification.allPreviewEdgesAtMost2000,'A candidate preview exceeds 2000px');
await fs.writeFile(path.join(checksDir,'candidate-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({candidateProfiles:Object.fromEntries(candidates.map((c)=>[c.id,{size:`${c.width}x${c.height}`,rowSpanWidths:c.profile.rowSpanWidths,rowInkCounts:c.profile.rowInkCounts,colorCounts:c.colorCounts}])),titlebar:titlebarPreview,previews:[pinkPreview,darkPreview],pass:true},null,2));
console.log('PASS: ellipse-derived symmetric native grids / V1 and V2 read-only comparisons / 14px titlebar occupancy / all previews <=2000px');
