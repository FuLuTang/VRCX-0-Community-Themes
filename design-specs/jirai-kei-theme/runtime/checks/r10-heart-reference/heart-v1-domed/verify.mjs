/* V1 11x9 brand heart + 1px "dome cap" on each lobe (cap widths 2/3/4) -> 11x10.
   Writes only heart-v1-domed/ folders (assets + checks). V1/V2/A/B/C/7x6/9x8/CSS are read-only. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const checksDir = path.dirname(fileURLToPath(import.meta.url));
const parentChecks = path.resolve(checksDir, '..');
const assetsDir = path.resolve(checksDir, '../../../../original-assets/r10-heart-reference/heart-v1-domed');
const palette = { O:'#ae387d', H:'#ffcced', P:'#ff87c6', S:'#cc5282' };
const bgPink = '#d97fc6', bgDark = '#201936';
const titlebarHeightPx = 32, slotPx = 14, previewMagnification = 4;
const assert = (ok, message) => { if (!ok) throw new Error(message); };

const report0 = JSON.parse(await fs.readFile(path.join(parentChecks, 'pixel-report.json'), 'utf8'));
const V1 = report0.comparisonDrafts.previous11x9V1.rows;
const W = 11, H1 = 9;
// Reviewed V1 (hard-coded copy) must equal the report, so the task text and report cannot drift apart.
const V1_EXPECTED = ['.OOOO.OOOO.','OHPPPOPHPPO','OPPPPPPPPSO','OPPPPPPPSSO','.OPPPPPPSO.','..OPPPPSO..','...OPPSO...','....OSO....','.....O.....'];
assert(JSON.stringify(V1) === JSON.stringify(V1_EXPECTED), 'V1 in pixel-report.json differs from the task matrix');
assert(V1.length === H1 && V1.every((r) => r.length === W), 'V1 must be 11x9');

// Cap placement (x ranges, inclusive), on the new top row y=0. V1 is shifted down by 1.
const variants = [
  { id:'cap2', width:2, left:[2,3], right:[7,8] },
  { id:'cap3', width:3, left:[2,4], right:[6,8] },
  { id:'cap4', width:4, left:[1,4], right:[6,9] }
];

const inGrid = (g, x, y) => y >= 0 && y < g.length && x >= 0 && x < g[0].length;
const isInk = (g, x, y) => inGrid(g, x, y) && g[y][x] !== '.';
const N4 = [[1,0],[-1,0],[0,1],[0,-1]];
const N8 = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
const boundary = (g, x, y) => isInk(g, x, y) && N4.some(([dx,dy]) => !isInk(g, x+dx, y+dy));

function build(v) {
  const g = Array.from({ length: H1 + 1 }, (_, y) => y === 0 ? Array(W).fill('.') : [...V1[y-1]]);
  const added = [], converted = [];
  for (const [a,b] of [v.left, v.right]) for (let x=a; x<=b; x++) { assert(g[0][x] === '.', 'cap overlap'); g[0][x] = 'O'; added.push({x,y:0,from:'.',to:'O'}); }
  // Old V1 top-row O (now y=1) that became interior -> colour of V1's next row (now y=2). Still-outer ones stay O.
  for (let x=0; x<W; x++) {
    if (g[1][x] === 'O' && !boundary(g, x, 1)) {
      const to = g[2][x]; assert('HP'.includes(to), `unexpected next-row colour at ${x},2: ${to}`);
      g[1][x] = to; converted.push({x,y:1,from:'O',to});
    }
  }
  return { rows: g.map((r) => r.join('')), added, converted };
}

function components(g, pred) {
  const seen = new Set(); let n = 0;
  for (let y=0; y<g.length; y++) for (let x=0; x<g[0].length; x++) if (pred(g[y][x]) && !seen.has(`${x},${y}`)) {
    n++; const q=[[x,y]]; seen.add(`${x},${y}`);
    for (let i=0; i<q.length; i++) for (const [dx,dy] of N8) { const nx=q[i][0]+dx, ny=q[i][1]+dy, k=`${nx},${ny}`; if (inGrid(g,nx,ny) && pred(g[ny][nx]) && !seen.has(k)) { seen.add(k); q.push([nx,ny]); } }
  }
  return n;
}
const cnt = (rows) => Object.fromEntries(Object.keys(palette).map((c) => [c, rows.join('').split(c).length-1]));
const mirror = (s) => [...s].reverse().join('');

function verifyVariant(v, rows, added, converted) {
  const g = rows.map((r) => [...r]); const h = rows.length;
  const res = {};
  assert(h === 10 && rows.every((r) => r.length === 11), `${v.id}: must be 11x10`); res.size11x10 = true;
  for (const r of rows) for (const c of r) assert('.OHPS'.includes(c), `${v.id}: unknown code ${c}`);
  // one-cell outline: every ink cell touching transparency 4-wise is O, and every O touches transparency 4-wise
  // (transparent cells enclosed by ink would also count; check there are no enclosed holes).
  for (let y=0; y<h; y++) for (let x=0; x<W; x++) if (g[y][x] !== '.') assert((g[y][x] === 'O') === boundary(g, x, y), `${v.id}: outline cell mismatch at ${x},${y} (${g[y][x]})`);
  res.outlineExactlyOneCell = true;
  // no enclosed transparent holes: flood the exterior (4-conn, padded)
  const ext = new Set(); const q=[[-1,-1]]; ext.add('-1,-1');
  for (let i=0; i<q.length; i++) for (const [dx,dy] of N4) { const nx=q[i][0]+dx, ny=q[i][1]+dy, k=`${nx},${ny}`; if (nx>=-1&&nx<=W&&ny>=-1&&ny<=h&&!ext.has(k)&&!isInk(g,nx,ny)) { ext.add(k); q.push([nx,ny]); } }
  for (let y=0; y<h; y++) for (let x=0; x<W; x++) if (g[y][x]==='.') assert(ext.has(`${x},${y}`), `${v.id}: enclosed transparent hole at ${x},${y}`);
  res.noEnclosedHoles = true;
  assert(components(g, (c) => c === 'O') === 1, `${v.id}: O outline must be a single 8-connected component`); res.outline8Connected = true;
  assert(components(g, (c) => c !== '.') === 1, `${v.id}: heart must be a single component`);
  for (let y=0; y<h; y++) for (let x=0; x<W; x++) if (g[y][x] !== '.') assert(N8.some(([dx,dy]) => isInk(g,x+dx,y+dy)), `${v.id}: isolated pixel at ${x},${y}`);
  for (let y=0; y<h; y++) for (let x=0; x<W; x++) if (g[y][x] === 'O') assert(N8.some(([dx,dy]) => g[y+dy]?.[x+dx] === 'O'), `${v.id}: isolated O at ${x},${y}`);
  res.noIsolatedPixels = true;
  const maskRow = (r, f) => [...r].map((c) => f(c) ? '1' : '0').join('');
  for (const [name, f] of [['shape', (c) => c !== '.'], ['outline', (c) => c === 'O'], ['fill', (c) => 'HPS'.includes(c)]])
    for (const r of rows) assert(maskRow(r, f) === mirror(maskRow(r, f)), `${v.id}: ${name} mask not left-right symmetric`);
  res.shapeOutlineFillMasksSymmetric = true;
  const counts = cnt(rows); assert(Object.values(counts).every((n) => n > 0), `${v.id}: all four colours must appear`); res.allFourColoursUsed = true;
  // H only in left half of its lobe region / upper area, S lower-right: same cells as V1 (shifted); checked via diff below.
  // diff vs V1-shifted: only listed cells differ
  const diff = [];
  for (let y=0; y<h; y++) for (let x=0; x<W; x++) { const base = y === 0 ? '.' : V1[y-1][x]; if (base !== g[y][x]) diff.push({x,y,from:base,to:g[y][x]}); }
  const listed = [...added, ...converted].map((d) => `${d.x},${d.y},${d.from},${d.to}`).sort();
  assert(JSON.stringify(diff.map((d) => `${d.x},${d.y},${d.from},${d.to}`).sort()) === JSON.stringify(listed), `${v.id}: diff list mismatch`);
  assert(diff.every((d) => (d.y===0 && d.to==='O') || (d.y===1 && d.from==='O' && 'HP'.includes(d.to))), `${v.id}: unexpected kind of change`);
  res.restMatchesV1ShiftedDown1 = true; res.diff = diff;
  // H/S positions identical to V1 (shifted), except H copied into converted cells (listed)
  const sCells = rows.join('').split('S').length-1; assert(sCells === V1.join('').split('S').length-1, `${v.id}: S count changed`);
  return { checks: res, counts };
}

function svgFor(title, description, rows) {
  const h = rows.length, w = rows[0].length;
  const groups = Object.entries(palette).map(([code,color]) => {
    const cells = [];
    for (let y=0; y<h; y++) for (let x=0; x<w; x++) if (rows[y][x] === code) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    return cells.length ? `<g fill="${color}">${cells.join('')}</g>` : '';
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><title>${title}</title><desc>${description} Palette: outline ${palette.O}, highlight ${palette.H}, body ${palette.P}, shade ${palette.S}.</desc>${groups}</svg>\n`;
}
function gridFromSvg(svg) {
  const m = svg.match(/<svg[^>]*width="(\d+)" height="(\d+)"/); assert(m, 'cannot read svg size');
  assert(/shape-rendering="crispEdges"/.test(svg), 'svg missing crispEdges');
  const w = +m[1], h = +m[2], byColor = Object.fromEntries(Object.entries(palette).map(([c,col]) => [col,c]));
  const g = Array.from({ length: h }, () => Array(w).fill('.'));
  for (const grp of svg.matchAll(/<g fill="(#[0-9a-fA-F]{6})">([\s\S]*?)<\/g>/g)) {
    const code = byColor[grp[1].toLowerCase()]; assert(code, `unexpected colour ${grp[1]}`);
    for (const r of grp[2].matchAll(/<rect x="(\d+)" y="(\d+)" width="1" height="1"\/>/g)) { assert(g[+r[2]][+r[1]] === '.', 'duplicate cell'); g[+r[2]][+r[1]] = code; }
  }
  return { w, h, rows: g.map((r) => r.join('')) };
}

// ---- build + verify ----
const items = [{ id:'V1', label:'V1 · 11×9', width:11, height:9, rows:V1, svg:svgFor('V1 · 11x9','Comparison-only copy of the V1 matrix from pixel-report.json.', V1) }];
const built = [];
for (const v of variants) {
  const b = build(v), vr = verifyVariant(v, b.rows, b.added, b.converted);
  const svg = svgFor(`heart-v1-domed ${v.id} · 11x10`, `V1 11x9 brand heart shifted down one row with a 1px-high outline cap of width ${v.width} on each lobe.`, b.rows);
  Object.assign(v, b, vr, { svg });
  built.push(v);
  items.push({ id:v.id, label:`${v.id} · 11×10`, width:11, height:10, rows:b.rows, svg });
}
await fs.mkdir(assetsDir, { recursive: true });
for (const v of built) {
  const f = path.join(assetsDir, `heart-v1-domed-${v.id}.svg`);
  await fs.writeFile(f, v.svg);
  const saved = await fs.readFile(f, 'utf8'), p = gridFromSvg(saved);
  assert(saved === v.svg && p.w === 11 && p.h === 10 && JSON.stringify(p.rows) === JSON.stringify(v.rows), `${v.id}: written SVG differs from matrix`);
  assert((saved.match(/<rect/g)||[]).length === v.rows.join('').replace(/\./g,'').length, `${v.id}: rect count != ink cells`);
  v.svgFile = path.basename(f);
}

// ---- README ----
const fmt = (d) => `(${d.x},${d.y}) ${d.from === '.' ? '透明' : d.from}→${d.to}`;
let md = `# heart-v1-domed · V1 11×9 加“帽”变体 (11×10)\n\n以 V1 11×9 品牌心为底，在两个心瓣最顶上各加一截 1 像素高的描边“帽”，让顶部更圆；V1 整体下移 1 行，新增顶行 y=0 放帽。其余格不动。仅为对比稿，未写入任何正式资产/CSS/runtime。\n\n`;
md += `## 调色板\n\n| 代码 | 含义 | 颜色 |\n|---|---|---|\n| O | 描边 | ${palette.O} |\n| H | 高光 | ${palette.H} |\n| P | 主体 | ${palette.P} |\n| S | 阴影 | ${palette.S} |\n| . | 透明 | — |\n\n`;
md += `## V1 原矩阵 (11×9，来自 pixel-report.json comparisonDrafts.previous11x9V1)\n\n\`\`\`\n${V1.join('\n')}\n\`\`\`\n\n`;
md += `## 规则\n\n- 坐标 (x,y)，x 0–10，y 0–9；V1 第 r 行 = 新矩阵第 r+1 行。\n- 帽用 O，放在新顶行 y=0。\n- 帽下方原 V1 顶行 O（现 y=1）若四邻都在心内（已变为内部），改为 V1 下一行（现 y=2）同列的 P/H，避免双层描边；仍贴着外部透明（如心瓣外侧、中央凹口两侧）的 O 保留。\n- 因此三个变体里 (1,1)、(4,1)、(6,1)、(9,1) 都保留 O：它们分别紧贴心瓣外侧或中央凹口 (5,1) 的透明格，仍在外边界上（尤其 (4,1)/(6,1) 若改成 P，凹口底部的 O (5,2) 会与轮廓断开）。只有帽正下方的 (2,1)(3,1)(7,1)(8,1) 转为内部色。\n\n`;
for (const v of built) {
  md += `## ${v.id} · 帽宽 ${v.width}（左 x${v.left[0]}–${v.left[1]} / 右 x${v.right[0]}–${v.right[1]}）\n\n文件：[${v.svgFile}](${v.svgFile})\n\n\`\`\`\n${v.rows.join('\n')}\n\`\`\`\n\n`;
  md += `色格统计：O ${v.counts.O} / H ${v.counts.H} / P ${v.counts.P} / S ${v.counts.S}。\n\n`;
  md += `改动清单（相对“V1 下移 1 行”）：新增帽 ${v.added.length} 格；内部化转换 ${v.converted.length} 格；共 ${v.checks.diff.length} 格。\n\n- 新增 O：${v.added.map((d) => `(${d.x},${d.y})`).join(' ')}\n- O→P/H：${v.converted.map(fmt).join('、')}\n\n`;
}
md += `## 注意\n\n- 右瓣 V1 的 H 在 x=7；按“取 V1 下一行颜色”规则，cap2/cap3/cap4 里 (7,1) 都变成 H，右瓣高光因此竖着两格 H，而左瓣 H 仍只有 (1,2) 一格。这是 V1 高光位置本身左右不对称的结果，本稿未擅自改动。\n- 高光 H 只在左上、阴影 S 只在右下与 V1 一致；对称性只断言形状/描边/填充掩码。\n\n重新生成：\n\n\`\`\`sh\nnode design-specs/jirai-kei-theme/runtime/checks/r10-heart-reference/heart-v1-domed/verify.mjs\n\`\`\`\n`;
await fs.writeFile(path.join(assetsDir, 'README.md'), md);

// ---- previews ----
const renderSvg = (svg, w, h) => sharp(Buffer.from(svg), { density:72 }).resize(w, h, { fit:'fill', kernel:'nearest' }).png().toBuffer();
const previewDims = [];
async function scaleSheet(bg, fileName) {
  const factors=[1,2,4,6], labelW=46, colW=104, headerH=32, gap=2;
  const rowHeights = factors.map((f) => Math.max(...items.map((it) => it.height*f)) + 24);
  const width = labelW + colW*items.length, height = headerH + rowHeights.reduce((a,b) => a+b+gap, 0);
  const fg = bg === bgPink ? '#211a33' : '#fdf4ff', header = bg === bgPink ? '#e997d1' : '#171326';
  let mk = `<rect width="100%" height="100%" fill="${bg}"/><rect width="100%" height="${headerH}" fill="${header}"/>`;
  items.forEach((it,i) => { mk += `<text x="${labelW+i*colW+colW/2}" y="21" text-anchor="middle" fill="${fg}" font-family="sans-serif" font-size="10">${it.label}</text>`; });
  const layers = []; let y = headerH;
  for (let ri=0; ri<factors.length; ri++) {
    const f = factors[ri], rowH = rowHeights[ri];
    mk += `<text x="9" y="${y+18}" fill="${fg}" font-family="monospace" font-size="10">${f}×</text><line x1="0" y1="${y+rowH}" x2="${width}" y2="${y+rowH}" stroke="${fg}" opacity=".2"/>`;
    for (let i=0; i<items.length; i++) { const it=items[i], w=it.width*f, h=it.height*f; layers.push({ input: await renderSvg(it.svg,w,h), left: labelW+i*colW+Math.floor((colW-w)/2), top: y+Math.floor((rowH-h)/2) }); }
    y += rowH + gap;
  }
  const file = path.join(checksDir, fileName);
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${mk}</svg>`)).composite(layers).png().toFile(file);
  const m = await sharp(file).metadata(); previewDims.push({ file:fileName, width:m.width, height:m.height });
  return { file:fileName, width:m.width, height:m.height, background:bg, scales:factors };
}
async function titlebar() {
  const labelW=104, barW=306, sectionH=25, rowStep=38, width=labelW+barW;
  const sections=[{bg:bgPink,name:'PINK · #d97fc6',fg:'#211a33'},{bg:bgDark,name:'DARK · #201936',fg:'#fdf4ff'}];
  const height = sections.length*(sectionH+items.length*rowStep);
  let mk = `<rect width="100%" height="100%" fill="#171326"/>`; const layers=[]; let y=0;
  for (const s of sections) {
    mk += `<rect x="0" y="${y}" width="${width}" height="${sectionH}" fill="#171326"/><text x="8" y="${y+17}" fill="#fdf4ff" font-family="monospace" font-size="9">${s.name} · 32px titlebar</text>`; y += sectionH;
    for (const it of items) {
      const rowY=y, barX=labelW, slotX=barX+12, slotY=rowY+Math.floor((titlebarHeightPx-slotPx)/2);
      mk += `<rect x="0" y="${rowY}" width="${labelW}" height="${titlebarHeightPx}" fill="#201936"/><text x="8" y="${rowY+20}" fill="#f2ebff" font-family="sans-serif" font-size="8">${it.label}</text><rect x="${barX}" y="${rowY}" width="${barW}" height="${titlebarHeightPx}" fill="${s.bg}"/><rect x="${slotX}" y="${slotY}" width="${slotPx}" height="${slotPx}" fill="none" stroke="${s.fg}" stroke-opacity=".65" stroke-dasharray="1 1"/><text x="${slotX+22}" y="${rowY+21}" fill="${s.fg}" font-family="sans-serif" font-size="12">VRCX-0-jirai</text>`;
      layers.push({ input: await renderSvg(it.svg,it.width,it.height), left: slotX+Math.round((slotPx-it.width)/2), top: rowY+Math.floor((titlebarHeightPx-it.height)/2) });
      y += rowStep;
    }
  }
  const composed = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${mk}</svg>`)).composite(layers).png().toBuffer();
  const file = path.join(checksDir, 'titlebar-occupancy.png');
  await sharp(composed).resize(width*previewMagnification, height*previewMagnification, { kernel:'nearest' }).png().toFile(file);
  const m = await sharp(file).metadata(); previewDims.push({ file:'titlebar-occupancy.png', width:m.width, height:m.height });
  return { file:'titlebar-occupancy.png', width:m.width, height:m.height, titlebarHeightPx, slotPx, previewMagnification, cellSizeCssPx:1, occupancy: items.map((it) => ({ id:it.id, logicalSize:`${it.width}x${it.height}`, fitsSlot: it.width<=slotPx && it.height<=slotPx })) };
}
const pink = await scaleSheet(bgPink, 'comparison-pink.png');
const dark = await scaleSheet(bgDark, 'comparison-dark.png');
const tb = await titlebar();
assert(previewDims.every((p) => p.width<=2000 && p.height<=2000), 'a preview exceeds 2000px');

const report = {
  scope:'V1 + domed caps. Comparison/design only; V1/V2/A/B/C/7x6/9x8/heart-11x9.svg/CSS untouched.',
  palette, v1: V1,
  variants: built.map((v) => ({ id:v.id, capWidth:v.width, left:v.left, right:v.right, rows:v.rows, colorCounts:v.counts, added:v.added, converted:v.converted, diff:v.checks.diff, checks:v.checks })),
  previews:{ pink, dark, titlebar:tb, allEdgesAtMost2000:true }
};
await fs.writeFile(path.join(checksDir, 'verify-report.json'), JSON.stringify(report, null, 2) + '\n');
for (const v of built) console.log(`${v.id} (cap ${v.width})\n${v.rows.join('\n')}\ncounts ${JSON.stringify(v.counts)}\nadded ${v.added.length}, converted: ${v.converted.map(fmt).join(', ')}\n`);
console.log(JSON.stringify({ previews: previewDims }));
console.log('PASS: 11x10 / one-cell outline / O 8-connected / no isolated / masks symmetric / 4 colours / rest == V1 shifted / SVG round-trip / previews <=2000px');
