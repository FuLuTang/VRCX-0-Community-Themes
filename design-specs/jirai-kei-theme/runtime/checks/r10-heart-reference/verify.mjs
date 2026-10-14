/* Internal-only transcription and pixel preview checks for the R10 heart reference.
   Formal tiers: 7x6 (base) / 9x8 (mid) / 11x10 (large, user-selected V1 domed cap3 with soft-Y notch corners).
   Old 11x9 V1/V2 and the A/B/C candidates are deprecated, comparison-only and frozen by SHA-256 below. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const checksDir = path.dirname(fileURLToPath(import.meta.url));
const themeRoot = path.resolve(checksDir, '../../..');
const assetDir = path.join(themeRoot, 'original-assets/r10-heart-reference');
const sourcePath = path.join(themeRoot, 'art-references/nso-fandom-desktop-icons-sheet.png');
const sourceBox = { x: 510, y: 494, cellSourcePx: 4, width: 7, height: 6 };
const palette = { O: '#ae387d', H: '#ffcced', P: '#ff87c6', S: '#cc5282' };
// 11x10 only: one transition color T = per-channel average of O and P (214.5/95.5/161.5 rounded half-up), allowed ONLY at the two softened cells.
const transitionHex = `#${[1,3,5].map((i) => Math.floor((parseInt(palette.O.slice(i,i+2),16) + parseInt(palette.P.slice(i,i+2),16)) / 2 + 0.5).toString(16).padStart(2,'0')).join('')}`;
const palette11x10 = { ...palette, T: transitionHex };
const softCells = [[4,0],[6,0]];
const titlebar = '#d97fc6';
const darkBg = '#201936';
const sourceHeartRows = [
  '.OO.OO.',
  'OHPOHPO',
  'OPPPPSO',
  '.OPSSO.',
  '..OSO..',
  '...O...'
];
const sourceRawCellColors = [
  ['#ddbfee','#ae387d','#ae387d','#f8f0fa','#ae387d','#ae387d','#f8f0fa'],
  ['#ae387d','#ffcced','#ff87c6','#ae387d','#ffcced','#ff87c6','#ae387d'],
  ['#ae387d','#ff87c6','#ff87c6','#ff87c6','#ff87c6','#cc5282','#ae387d'],
  ['#c4a3ef','#ae387d','#ff87c6','#cc5282','#cc5282','#ae387d','#f8f0fa'],
  ['#c4a3ef','#7b5f80','#ae387d','#cc5282','#ae387d','#f8f0fa','#f8f0fa'],
  ['#c4a3ef','#7b5f80','#f8f0fa','#ae387d','#f8f0fa','#f8f0fa','#f8f0fa']
];
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const hexOf = (data, offset) => `#${[0,1,2].map((k) => data[offset+k].toString(16).padStart(2,'0')).join('')}`;
const sourceBuffer = await fs.readFile(sourcePath);
const sourceSha256 = createHash('sha256').update(sourceBuffer).digest('hex');
const sourceMeta = await sharp(sourceBuffer).metadata();
assert(sourceMeta.width === 1120 && sourceMeta.height === 700, `Unexpected reference sheet dimensions ${sourceMeta.width}x${sourceMeta.height}`);
const { data: sourceRaw, info: sourceInfo } = await sharp(sourceBuffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
function readSourceCell(cx, cy) {
  const x0 = sourceBox.x + cx * sourceBox.cellSourcePx;
  const y0 = sourceBox.y + cy * sourceBox.cellSourcePx;
  const found = new Set();
  for (let y = 0; y < sourceBox.cellSourcePx; y += 1) {
    for (let x = 0; x < sourceBox.cellSourcePx; x += 1) {
      found.add(hexOf(sourceRaw, ((y0+y) * sourceInfo.width + x0+x) * 3));
    }
  }
  assert(found.size === 1, `Reference source cell (${cx},${cy}) is not a uniform 4x4 pixel block: ${[...found]}`);
  return [...found][0];
}
const sampledSourceMatrix = Array.from({ length: sourceBox.height }, (_, y) => Array.from({ length: sourceBox.width }, (_, x) => readSourceCell(x,y)));
for (let y = 0; y < sourceBox.height; y += 1) {
  for (let x = 0; x < sourceBox.width; x += 1) {
    const code = sourceHeartRows[y][x];
    const actual = sampledSourceMatrix[y][x];
    if (code === '.') {
      assert(actual === sourceRawCellColors[y][x], `Source underlay mismatch at transparent heart cell ${x},${y}: ${actual}`);
      assert(!Object.values(palette).includes(actual), `Heart-colored source pixel omitted at ${x},${y}`);
    } else {
      assert(actual === palette[code], `Source heart pixel mismatch at ${x},${y}: expected ${palette[code]}, got ${actual}`);
    }
  }
}

const masks = {
  '9x8': [
    '.###.###.',
    '#########',
    '#########',
    '#########',
    '.#######.',
    '..#####..',
    '...###...',
    '....#....'
  ]
};
// V1 is preserved in report/comparison previews only; never rewrite the original 7x6 or 9x8 assets.
const old11x9Rows = [
  '.OOOO.OOOO.',
  'OHPPPOPHPPO',
  'OPPPPPPPPSO',
  'OPPPPPPPSSO',
  '.OPPPPPPSO.',
  '..OPPPPSO..',
  '...OPPSO...',
  '....OSO....',
  '.....O.....'
];
// V2 rounds the lobes, expands 4/7/9/11 to its shoulders, then tapers 9/7/5/3/1 symmetrically.
const round11x9Rows = [
  '...OO.OO...',
  '..OHPOPHO..',
  '.OPPPPPPPO.',
  'OPPPPPPPPPO',
  '.OPSPPPSPO.',
  '..OPSPSPO..',
  '...OPSPO...',
  '....OPO....',
  '.....O.....'
];
// Original user-selected cap3 (V1 shifted down one row + 3-cell outline caps), kept for the diff assertions.
const cap3Rows = [
  '..OOO.OOO..',
  '.OPPO.OHPO.',
  'OHPPPOPHPPO',
  'OPPPPPPPPSO',
  'OPPPPPPPSSO',
  '.OPPPPPPSO.',
  '..OPPPPSO..',
  '...OPPSO...',
  '....OSO....',
  '.....O.....'
];
// Formal large heart: cap3 with the two notch-side cap cells (4,0)/(6,0) softened O -> T (soft variant Y).
const heart11x10Rows = [
  '..OOT.TOO..',
  '.OPPO.OHPO.',
  'OHPPPOPHPPO',
  'OPPPPPPPPSO',
  'OPPPPPPPSSO',
  '.OPPPPPPSO.',
  '..OPPPPSO..',
  '...OPPSO...',
  '....OSO....',
  '.....O.....'
];
function makeExpandedGrid(mask, highlights, shades) {
  const height = mask.length, width = mask[0].length;
  assert(mask.every((row) => row.length === width), 'Mask rows must be same width');
  const highlightSet = new Set(highlights.map(([x,y]) => `${x},${y}`));
  const shadeSet = new Set(shades.map(([x,y]) => `${x},${y}`));
  return mask.map((row,y) => [...row].map((cell,x) => {
    if (cell === '.') return '.';
    const boundary = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => mask[y+dy]?.[x+dx] !== '#');
    if (boundary) return 'O';
    if (highlightSet.has(`${x},${y}`)) return 'H';
    if (shadeSet.has(`${x},${y}`)) return 'S';
    return 'P';
  }).join(''));
}
const grids = {
  '7x6': sourceHeartRows,
  '9x8': makeExpandedGrid(masks['9x8'], [[1,1],[5,1]], [[7,2],[6,3],[7,3],[6,4],[5,5],[4,6]]),
  '11x9': round11x9Rows,
  '11x10': heart11x10Rows
};
const dims = { '7x6': [7,6], '9x8': [9,8], '11x9': [11,9], '11x9-v1': [11,9], '11x10': [11,10] };
const formalTiers = ['7x6', '9x8', '11x10'];
const deprecatedGrids = ['11x9', '11x9-v1'];
function validateGrid(name, rows) {
  const [width,height] = dims[name];
  assert(rows.length === height && rows.every((row) => row.length === width), `${name} grid has wrong dimensions`);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const code = rows[y][x];
      assert((name === '11x10' ? '.OHPST' : '.OHPS').includes(code), `Unknown pixel code ${code} in ${name}`);
      if (code === 'T') assert(name === '11x10' && softCells.some(([sx,sy]) => sx === x && sy === y), `T may only appear at the two soft cells of 11x10 (found at ${name} ${x},${y})`);
      if (code === '.') continue;
      const boundary = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => rows[y+dy]?.[x+dx] === undefined || rows[y+dy][x+dx] === '.');
      if (boundary) assert(code === 'O' || code === 'T', `Visible edge must be one-pixel outline at ${name} (${x},${y})`);
      if (code === 'H' || code === 'S' || (code === 'T' && !softCells.some(([sx,sy]) => sx === x && sy === y))) assert(!boundary, `${code} must remain inside the outline at ${name} (${x},${y})`);
    }
  }
  return { width, height, rows, filledPixels: rows.join('').replaceAll('.','').length, outlinePixels: rows.join('').split('O').length - 1 };
}
const gridStats = Object.fromEntries(Object.entries(grids).map(([name, rows]) => [name, validateGrid(name,rows)]));
const previousLargeStats = validateGrid('11x9-v1', old11x9Rows);
assert(new Set(Object.values(gridStats).map((grid) => `${grid.width}x${grid.height}`)).size === 4, 'All hearts must be separate native grid sizes');
assert(new Set(formalTiers.map((name) => `${gridStats[name].width}x${gridStats[name].height}`)).size === 3, 'Formal tiers must be three distinct native grids');
assert(round11x9Rows.every((row) => row === [...row].reverse().join('')), 'Revised 11x9 must be horizontally balanced at every color cell');
const roundWidths = round11x9Rows.map((row) => [...row].filter((cell) => cell !== '.').length);
assert(JSON.stringify(roundWidths) === JSON.stringify([4,7,9,11,9,7,5,3,1]), `Revised 11x9 has an uneven lobe/shoulder/taper profile: ${roundWidths}`);
assert(round11x9Rows[0] === '...OO.OO...' && round11x9Rows[8] === '.....O.....', 'Revised 11x9 must retain rounded twin lobes and a single-pixel tip');
assert(gridStats['11x9'].filledPixels === 56, 'Revised 11x9 silhouette pixel count changed unexpectedly');

// ---- 11x10 formal-large assertions ----
assert(heart11x10Rows.length === 10 && heart11x10Rows.every((row) => row.length === 11), '11x10 matrix must be 11 wide x 10 tall');
assert(heart11x10Rows.slice(1).join('\n') !== old11x9Rows.join('\n'), '11x10 must not simply equal the old V1 matrix');
function outlineComponents(rows, connectivity = 8) {
  const seen = new Set(), key = (x, y) => `${x},${y}`;
  const nbr = connectivity === 8 ? [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]] : [[1,0],[-1,0],[0,1],[0,-1]];
  let components = 0;
  for (let y = 0; y < rows.length; y += 1) for (let x = 0; x < rows[y].length; x += 1) {
    if (rows[y][x] !== 'O' || seen.has(key(x, y))) continue;
    components += 1;
    const stack = [[x, y]]; seen.add(key(x, y));
    while (stack.length) {
      const [cx, cy] = stack.pop();
      for (const [dx, dy] of nbr) {
        const nx = cx + dx, ny = cy + dy;
        if (rows[ny]?.[nx] === 'O' && !seen.has(key(nx, ny))) { seen.add(key(nx, ny)); stack.push([nx, ny]); }
      }
    }
  }
  return components;
}
assert(outlineComponents(heart11x10Rows, 8) === 1, '11x10 O outline must be a single 8-connected component');
// Shape sanity: lobes capped on row 0, single-cell tip on last row, outline never touches the 11x10 box on a blank row.
assert(heart11x10Rows[0] === '..OOT.TOO..' && heart11x10Rows[9] === '.....O.....', '11x10 must keep 3-cell lobe caps (inner cell softened to T) and a single-cell tip');
// Soft-Y contract vs the original cap3: same silhouette, exactly the two cells (4,0)/(6,0) change O -> T.
{
  const maskOf = (rows) => rows.map((r) => [...r].map((c) => c === '.' ? '.' : '#').join('')).join('\n');
  assert(maskOf(heart11x10Rows) === maskOf(cap3Rows), '11x10 silhouette must equal cap3');
  const changed = [];
  for (let y = 0; y < 10; y += 1) for (let x = 0; x < 11; x += 1) if (heart11x10Rows[y][x] !== cap3Rows[y][x]) changed.push(`${x},${y}:${cap3Rows[y][x]}>${heart11x10Rows[y][x]}`);
  assert(JSON.stringify(changed) === JSON.stringify(['4,0:O>T','6,0:O>T']), `11x10 must differ from cap3 in exactly (4,0)/(6,0) O->T, got ${changed}`);
  assert([...new Set(heart11x10Rows.join('').replaceAll('.',''))].sort().join('') === 'HOPST', '11x10 must use exactly H/O/P/S plus the single transition color T');
  assert(heart11x10Rows.join('').split('T').length - 1 === 2, 'T must occur exactly twice (only the two soft cells)');
  for (const name of ['7x6','9x8','11x9']) assert(!grids[name].join('').includes('T'), `${name} must stay four-color (no T)`);
}
assert(heart11x10Rows.every((row) => /[^.]/.test(row)), '11x10 must have no blank row (exact 10 rows of ink)');
assert([0,10].every((col) => heart11x10Rows.some((row) => row[col] !== '.')), '11x10 must use both outer columns (exact 11 columns of ink)');
const outlineConnectivity = Object.fromEntries(Object.entries(grids).map(([name, rows]) => [name, { components8: outlineComponents(rows, 8), components4: outlineComponents(rows, 4) }]));

// ---- SVG parsing (independent of svgFor) ----
function parseSvgToMatrix(svg, width, height, label, pal = palette) {
  assert(svg.startsWith(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`), `${label}: root must be native ${width}x${height} with viewBox and shape-rendering="crispEdges"`);
  assert(!/<(image|path|circle|ellipse|polygon|use|filter|linearGradient|radialGradient)\b|transform=|opacity=|stroke/.test(svg), `${label}: only plain 1x1 rects allowed (no path/transform/opacity/stroke/gradients)`);
  const byFill = Object.fromEntries(Object.entries(pal).map(([code, hex]) => [hex, code]));
  const grid = Array.from({ length: height }, () => Array(width).fill('.'));
  let rectCount = 0;
  for (const group of svg.matchAll(/<g fill="(#[0-9a-f]{6})">((?:<rect [^>]*\/>)+)<\/g>/g)) {
    const code = byFill[group[1]];
    assert(code, `${label}: group fill ${group[1]} is not one of the allowed palette colors`);
    for (const rect of group[2].matchAll(/<rect x="(\d+)" y="(\d+)" width="1" height="1"\/>/g)) {
      const x = Number(rect[1]), y = Number(rect[2]);
      assert(x < width && y < height, `${label}: rect outside grid at ${x},${y}`);
      assert(grid[y][x] === '.', `${label}: overlapping rect at ${x},${y}`);
      grid[y][x] = code; rectCount += 1;
    }
  }
  assert(rectCount === (svg.match(/<rect /g) || []).length, `${label}: every <rect> must be a plain integer 1x1 rect inside a palette <g>`);
  return { rows: grid.map((r) => r.join('')), rectCount };
}

function svgFor(name, rows) {
  const [width,height] = dims[name];
  const cells = [];
  for (let y=0; y<height; y++) for (let x=0; x<width; x++) {
    const code = rows[y][x];
    if (code !== '.') cells.push({ x,y,code });
  }
  const pal = name === '11x10' ? palette11x10 : palette;
  const groups = Object.keys(pal).map((code) => {
    const rects = cells.filter((cell) => cell.code === code).map(({x,y}) => `<rect x="${x}" y="${y}" width="1" height="1"/>`).join('');
    return rects ? `<g fill="${pal[code]}">${rects}</g>` : '';
  }).join('');
  const sourceDescription = name === '7x6' ? 'Transcribed from 4x4 source-sheet cells at x=510,y=494; transparent cells reveal character underlay in the flattened source.' : name === '11x9' ? 'Revised symmetric large heart: rounded twin lobes, 11-cell shoulders, then smooth 9/7/5/3/1 taper.' : name === '11x9-v1' ? 'Previous 11x9 draft kept in comparisons only; not the current large asset.' : name === '11x10' ? 'Formal large brand heart, user-selected V1 domed cap3 with its two notch-side cap cells (4,0)/(6,0) softened to the outline/body transition color (soft variant Y): V1 11x9 shifted down one row with a 1px-high 3-cell outline cap on each lobe.' : 'Independently drawn native pixel grid expanding the source 7x6 silhouette.';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><title>R10 heart ${name}</title><desc>${sourceDescription} Palette: outline ${palette.O}, highlight ${palette.H}, body ${palette.P}, shade ${palette.S}${name === '11x10' ? `, transition ${palette11x10.T}` : ''}.</desc>${groups}</svg>\n`;
}
const svgPaths = {
  '7x6': path.join(assetDir, 'heart-7x6.svg'),
  '9x8': path.join(assetDir, 'heart-9x8.svg'),
  '11x9': path.join(assetDir, 'heart-11x9.svg'),
  '11x10': path.join(assetDir, 'heart-11x10.svg')
};
const svgs = {};
// This script never writes asset files: every SVG on disk must equal its generated form byte-for-byte.
for (const [name, rows] of Object.entries(grids)) {
  const generated = svgFor(name, rows);
  const existing = await fs.readFile(svgPaths[name], 'utf8');
  assert(existing === generated, `Reference asset ${name} differs from its generated form; verify.mjs does not rewrite assets`);
  svgs[name] = existing;
}
svgs['11x9-v1'] = svgFor('11x9-v1', old11x9Rows);

// ---- heart-11x10.svg vs cap3 matrix / native rect structure ----
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const parsed11x10 = parseSvgToMatrix(svgs['11x10'], 11, 10, 'heart-11x10.svg', palette11x10);
assert(JSON.stringify(parsed11x10.rows) === JSON.stringify(heart11x10Rows), 'heart-11x10.svg rects do not match the cap3+soft-Y matrix');
assert(parsed11x10.rectCount === heart11x10Rows.join('').replaceAll('.', '').length, 'heart-11x10.svg rect count mismatch');
const cap3Path = path.join(assetDir, 'heart-v1-domed/heart-v1-domed-cap3.svg');
const cap3Svg = await fs.readFile(cap3Path, 'utf8');
const cap3Parsed = parseSvgToMatrix(cap3Svg, 11, 10, 'heart-v1-domed-cap3.svg');
assert(JSON.stringify(cap3Parsed.rows) === JSON.stringify(cap3Rows), 'heart-v1-domed-cap3.svg must equal the recorded cap3 matrix');
{
  // heart-11x10.svg = cap3 + soft Y: only (4,0)/(6,0) change O -> T (the pure, unsoftened cap3 is kept as heart-11x10-soft/heart-11x10-cap3-original.svg for rollback).
  const changed = [];
  for (let y = 0; y < 10; y += 1) for (let x = 0; x < 11; x += 1) if (cap3Parsed.rows[y][x] !== parsed11x10.rows[y][x]) changed.push(`${x},${y}:${cap3Parsed.rows[y][x]}>${parsed11x10.rows[y][x]}`);
  assert(JSON.stringify(changed) === JSON.stringify(['4,0:O>T','6,0:O>T']), `heart-11x10.svg must differ from heart-v1-domed-cap3.svg only at (4,0)/(6,0) O->T, got ${changed}`);
  const softDir = path.join(assetDir, 'heart-11x10-soft');
  const rollback = parseSvgToMatrix(await fs.readFile(path.join(softDir, 'heart-11x10-cap3-original.svg'), 'utf8'), 11, 10, 'heart-11x10-cap3-original.svg');
  assert(JSON.stringify(rollback.rows) === JSON.stringify(cap3Rows), 'rollback copy heart-11x10-cap3-original.svg must be the original cap3 matrix');
  const softY = parseSvgToMatrix(await fs.readFile(path.join(softDir, 'heart-11x10-soft-Y.svg'), 'utf8'), 11, 10, 'heart-11x10-soft-Y.svg', palette11x10);
  assert(JSON.stringify(softY.rows) === JSON.stringify(parsed11x10.rows), 'heart-11x10.svg must equal the soft-Y matrix it was selected from');
}
assert(/shape-rendering="crispEdges"/.test(svgs['11x10']) && !/preserveAspectRatio|<image/.test(svgs['11x10']), 'heart-11x10.svg must be pure crispEdges vector');
assert(gridStats['11x10'].filledPixels === 72 && gridStats['11x10'].outlinePixels === 24, `11x10 pixel counts changed: ${gridStats['11x10'].filledPixels}/${gridStats['11x10'].outlinePixels}`);

// ---- Protected (deprecated / untouched) assets: frozen SHA-256 ----
const frozenAssets = {
  'heart-7x6.svg': '935c91838130dac9ab5944e664765f83f0d44ec5954a657741dfe627c2e20389',
  'heart-9x8.svg': '92950f4311e06747175a6d086b07ad2414e9f8261b9f2de1bae2d0f381932e21',
  'heart-11x9.svg': 'c253761d6f26f49823f8ef03ec390ba7172102e10bee3bc911f4b5a7ef7f2e23',
  'heart-11x9-candidates/A-wide-round-13x11.svg': '22213d954a2cddf362abe9474cb689aaa9c55d6c7459c457a86d9cc33db06961',
  'heart-11x9-candidates/B-tall-classic-13x13.svg': '580ea03d38a86a6d57f4a049d18bf4f4872163942dc5ff4750036d56df3ba966',
  'heart-11x9-candidates/C-shallow-soft-15x13.svg': 'bc8ad80005a510d18f01d708bb1b5a38035b1ed3a84966094a1376829aa5cacd',
  'heart-v1-domed/heart-v1-domed-cap2.svg': 'f00908fa06b3fbe8a52411775af0eb9d1b75b360a442894673e613df6bf56f7f',
  'heart-v1-domed/heart-v1-domed-cap3.svg': '3eee277d7df6b414a2f29f5822ad3ab0e1d8763e67b3d8dae5029a986023f113',
  'heart-v1-domed/heart-v1-domed-cap4.svg': '52bbfc6360cd67b5fdc086928bde8badeee4a4ad24d2b538f3da5a00b7d37f37'
};
const frozenReport = {};
for (const [rel, expected] of Object.entries(frozenAssets)) {
  const actual = sha256(await fs.readFile(path.join(assetDir, rel)));
  assert(actual === expected, `Protected old asset ${rel} was modified (sha256 ${actual})`);
  frozenReport[rel] = actual;
}

// ---- CSS data-URI bridge ----
const bridgePath = path.join(assetDir, 'heart-assets-r10.css');
const bridgeCss = await fs.readFile(bridgePath, 'utf8');
const bridgeVars = {};
for (const m of bridgeCss.matchAll(/^[ \t]*(--jk-r10-heart-[\d-]+):url\("data:image\/svg\+xml,([^"]*)"\);[ \t]*$/gm)) {
  assert(!(m[1] in bridgeVars), `Duplicate bridge variable ${m[1]}`);
  bridgeVars[m[1]] = { declaration: m[0].trim(), payload: m[2], decoded: decodeURIComponent(m[2]), declarationSha256: sha256(m[0]) };
}
assert(JSON.stringify(Object.keys(bridgeVars)) === JSON.stringify(['--jk-r10-heart-7-6','--jk-r10-heart-9-8','--jk-r10-heart-11-9','--jk-r10-heart-11-10']), `Unexpected bridge variables: ${Object.keys(bridgeVars)}`);
for (const [variable, name] of [['--jk-r10-heart-7-6','7x6'],['--jk-r10-heart-9-8','9x8'],['--jk-r10-heart-11-10','11x10']]) {
  assert(bridgeVars[variable].decoded === svgs[name], `${variable} decodes differently from heart-${name}.svg`);
  assert(encodeURIComponent(bridgeVars[variable].decoded) === bridgeVars[variable].payload, `${variable} payload is not canonical encodeURIComponent output`);
}
// 7x6 / 9x8 declarations must be byte-identical to the pre-task bridge; 11-9 stays V1 and byte-identical.
const frozenBridge = {
  '--jk-r10-heart-7-6': '56bba21eac08d84baffcbe486fa44d57aea3488a115191d4af6f90e8e0d35b56',
  '--jk-r10-heart-9-8': 'ab7cc031fd989a89a47b1da05869912c177f20aaefec407f3fa32e75abfd4e20',
  '--jk-r10-heart-11-9': '051b0617b0c7b310de7296685ae597b20d3993e7ba3b9ee829279e8928ab7a0c'
};
for (const [variable, expected] of Object.entries(frozenBridge)) assert(bridgeVars[variable].declarationSha256 === expected, `${variable} declaration changed`);
const bridgeV1 = parseSvgToMatrix(bridgeVars['--jk-r10-heart-11-9'].decoded, 11, 9, '--jk-r10-heart-11-9');
assert(JSON.stringify(bridgeV1.rows) === JSON.stringify(old11x9Rows), '--jk-r10-heart-11-9 must still embed the old V1 matrix');
const deprecatedNoteIdx = bridgeCss.indexOf('--jk-r10-heart-11-9:');
assert(/DEPRECATED[^\n]*已弃用，勿用/.test(bridgeCss.slice(bridgeCss.lastIndexOf('/*', deprecatedNoteIdx), deprecatedNoteIdx)), '--jk-r10-heart-11-9 must carry a deprecated (已弃用，勿用) comment right above it');
const bridgeReport = Object.fromEntries(Object.entries(bridgeVars).map(([variable, v]) => [variable, {
  payloadBytes: Buffer.byteLength(v.payload),
  declarationBytes: Buffer.byteLength(v.declaration),
  decodedBytes: Buffer.byteLength(v.decoded),
  decodedMatchesSvg: variable === '--jk-r10-heart-11-9' ? 'deprecated old V1 (matrix verified, no SVG on disk)' : true,
  status: variable === '--jk-r10-heart-11-9' ? 'deprecated: old V1, do not use' : 'formal'
}]));

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((v) => parseInt(v,16)/255);
  const lin = channels.map((c) => c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055)**2.4);
  return 0.2126*lin[0] + 0.7152*lin[1] + 0.0722*lin[2];
}
function contrast(fg,bg) {
  const a=luminance(fg),b=luminance(bg);
  return Number(((Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)).toFixed(2));
}
const contrastReport = Object.fromEntries(Object.entries(palette11x10).map(([code,hex]) => [code, {
  hex,
  onTitlebar: contrast(hex,titlebar),
  onDark: contrast(hex,darkBg),
  pixelCountBySize: Object.fromEntries(Object.entries(grids).map(([name,rows]) => [name, rows.join('').split(code).length-1]))
}]));

const render = (svg,width,height) => sharp(Buffer.from(svg),{density:72}).resize(width,height,{fit:'fill',kernel:'nearest'}).png().toBuffer();
const svgData = (width,height,body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${body}</svg>`);
const checkPng = async (file) => {
  const metadata=await sharp(file).metadata();
  assert(metadata.width<=2000&&metadata.height<=2000,`${path.basename(file)} exceeds 2000px`);
  return {file:path.basename(file),width:metadata.width,height:metadata.height};
};
// Task-56 must not rewrite the existing source-crop previews; only inspect their metadata.
const sourceContextPath = path.join(checksDir,'source-context.png');
const sourceCropPath = path.join(checksDir,'source-crop-7x6.png');
const sourceHeartPath = path.join(checksDir,'source-heart-isolated.png');

async function comparison(bg, label) {
  // Three formal tiers only. Old 11x9 V1/V2 are deprecated and no longer drawn here.
  const entries=[['7x6','BASE 7x6'],['9x8','MID 9x8'],['11x10','LARGE 11x10']];
  const factors=[1,2,4,6], labelW=50, colW=135, headerH=30, rowGap=2;
  const rows=factors.map((factor) => ({factor,maxHeight:10*factor,height:10*factor+26}));
  const width=labelW+colW*entries.length;
  const height=headerH+rows.reduce((n,row)=>n+row.height+rowGap,0)+2;
  const labelColor=label==='pink'?'#16112a':'#fdf4ff';
  const headerFill=label==='pink'?'#e997d1':'#171326';
  const headings=entries.map(([key,title],i)=>`<text x="${labelW+i*colW+colW/2}" y="20" text-anchor="middle" fill="${labelColor}" font-family="sans-serif" font-size="11">${title}</text>`).join('');
  let y=headerH, rowLabels='', layers=[];
  for(const row of rows){
    rowLabels+=`<text x="10" y="${y+17}" fill="${labelColor}" font-family="monospace" font-size="11">${row.factor}×</text><line x1="0" y1="${y+row.height}" x2="${width}" y2="${y+row.height}" stroke="${labelColor}" opacity=".22"/>`;
    for(let i=0;i<entries.length;i++){
      const [name]=entries[i], [nativeW,nativeH]=dims[name], w=nativeW*row.factor,h=nativeH*row.factor;
      const left=labelW+i*colW+Math.floor((colW-w)/2), top=y+20+Math.floor((row.maxHeight-h)/2);
      if(row.factor===1){
        // 1x row: dashed 14x14 titlebar slot so the native footprint (and its spare margin) is visible.
        const sx=left+Math.floor((w-14)/2), sy=top+Math.floor((h-14)/2);
        rowLabels+=`<rect x="${sx+.5}" y="${sy+.5}" width="13" height="13" fill="none" stroke="${labelColor}" stroke-opacity=".4" stroke-dasharray="1 1"/>`;
      }
      layers.push({input:await render(svgs[name],w,h),left,top});
    }
    y+=row.height+rowGap;
  }
  const heightLabel=`${label.toUpperCase()} · ${bg.toUpperCase()} · dashed = 14px slot`;
  const background=svgData(width,height,`<rect width="100%" height="100%" fill="${bg}"/><rect width="100%" height="${headerH}" fill="${headerFill}"/>${headings}${rowLabels}<text x="${width-6}" y="${height-4}" text-anchor="end" fill="${labelColor}" opacity=".72" font-family="monospace" font-size="8">${heightLabel}</text>`);
  const file=path.join(checksDir,`comparison-${label}.png`);
  await sharp(background).composite(layers).png().toFile(file);
  return checkPng(file);
}

async function displaySizes() {
  // 5/7/9px study for the formal small/medium/large tiers; the 9px large column is a reduced-size study of the 11x10,
  // and the last column shows the native 11x10 (1x) inside the 14px slot, which is the intended production size.
  const variants=[
    {name:'7x6',width:5,height:4,label:'7x6 at 5x4px'},
    {name:'9x8',width:7,height:6,label:'9x8 at 7x6px'},
    {name:'11x10',width:9,height:8,label:'11x10 at 9x8px (study)'},
    {name:'11x10',width:11,height:10,label:'11x10 native 11x10px'}
  ];
  const labelW=68,colW=220,headerH=30,rowH=94,width=labelW+colW*variants.length+24,height=headerH+2*rowH;
  const layers=[];let markup=`<rect width="100%" height="100%" fill="${darkBg}"/><rect width="100%" height="${headerH}" fill="#171326"/>`;
  for(let i=0;i<variants.length;i++)markup+=`<text x="${labelW+i*colW+colW/2}" y="20" text-anchor="middle" fill="#fdf4ff" font-family="sans-serif" font-size="11">${variants[i].label}</text>`;
  for(let r=0;r<2;r++){
    const bg=r===0?titlebar:darkBg,fg=r===0?'#16112a':'#fdf4ff',y=headerH+r*rowH;
    markup+=`<rect x="0" y="${y}" width="100%" height="${rowH}" fill="${bg}"/><text x="8" y="${y+16}" fill="${fg}" font-family="monospace" font-size="9">${r===0?'PINK':'DARK'}</text>`;
    for(let i=0;i<variants.length;i++){
      const item=variants[i],x=labelW+i*colW;
      const actual=await render(svgs[item.name],item.width,item.height);
      const zoom=await render(svgs[item.name],item.width*8,item.height*8);
      markup+=`<rect x="${x+8}" y="${y+32}" width="14" height="14" fill="none" stroke="${fg}" stroke-opacity=".45" stroke-dasharray="1 1"/><text x="${x+8}" y="${y+60}" fill="${fg}" font-family="monospace" font-size="8">14px slot</text><text x="${x+138}" y="${y+40}" fill="${fg}" font-family="sans-serif" font-size="10">${item.width}x${item.height}px display</text><text x="${x+138}" y="${y+54}" fill="${fg}" font-family="monospace" font-size="9">×8 nearest</text>`;
      layers.push({input:actual,left:x+8+Math.floor((14-item.width)/2),top:y+32+Math.floor((14-item.height)/2)});
      layers.push({input:zoom,left:x+44,top:y+13+Math.floor((72-item.height*8)/2)});
    }
  }
  const file=path.join(checksDir,'display-5-7-9.png');
  await sharp(svgData(width,height,markup)).composite(layers).png().toFile(file);
  return checkPng(file);
}
const comparisonPink=await comparison(titlebar,'pink');
const comparisonDark=await comparison(darkBg,'dark');
const displayReport=await displaySizes();
await checkPng(sourceContextPath);
await checkPng(sourceCropPath);
await checkPng(sourceHeartPath);

// Verify that a native render contains only the source palette plus fully transparent cells.
const rgbaKey=(hex)=>`${hex.slice(1).match(/.{2}/g).map((v)=>parseInt(v,16)).join(',')},255`;
const allowedBase=new Set([...Object.values(palette).map(rgbaKey),'0,0,0,0']);
const allowed11x10=new Set([...Object.values(palette11x10).map(rgbaKey),'0,0,0,0']);
for(const [name,svg] of Object.entries(svgs)){
  const [w,h]=dims[name];
  const allowed=name==='11x10'?allowed11x10:allowedBase;
  const raw=await sharp(Buffer.from(svg),{density:72}).resize(w,h,{fit:'fill',kernel:'nearest'}).ensureAlpha().raw().toBuffer();
  for(let i=0;i<raw.length;i+=4)assert(allowed.has(`${raw[i]},${raw[i+1]},${raw[i+2]},${raw[i+3]}`),`Interpolated/unexpected native pixel in ${name}`);
}
// The native 11x10 raster must also match the cap3+soft-Y matrix cell-by-cell (not only via the SVG text).
{
  const raw=await sharp(Buffer.from(svgs['11x10']),{density:72}).resize(11,10,{fit:'fill',kernel:'nearest'}).ensureAlpha().raw().toBuffer();
  const byRgba=Object.fromEntries(Object.entries(palette11x10).map(([c,h])=>[rgbaKey(h),c]));
  for(let y=0;y<10;y++)for(let x=0;x<11;x++){
    const o=(y*11+x)*4, rgba=`${raw[o]},${raw[o+1]},${raw[o+2]},${raw[o+3]}`;
    assert((rgba==='0,0,0,0'?'.':byRgba[rgba])===heart11x10Rows[y][x],`11x10 raster mismatch at ${x},${y}`);
  }
}

const tierRole={'7x6':'formal-base','9x8':'formal-mid','11x10':'formal-large'};
const withStatus=(name,stats)=>({...stats,status:tierRole[name]||'deprecated',deprecated:deprecatedGrids.includes(name)});
const slotFootprint={
  slotCssPx:'14x14',
  tiers:{
    '7x6':{native1xCssPx:'7x6',backgroundSize:'7px 6px',spareInSlot:'7x8',integerPosition:'3px 4px'},
    '9x8':{native1xCssPx:'9x8',backgroundSize:'9px 8px',spareInSlot:'5x6',integerPosition:'2px 3px'},
    '11x10':{native1xCssPx:'11x10',backgroundSize:'11px 10px',spareInSlot:'3x4',integerPosition:'1px 2px',integerMultiples:['11x10 (1x)','22x20 (2x)','33x30 (3x)','44x40 (4x)']}
  },
  note:'11x10 is one row taller than the deprecated 11x9; a 14px slot has 3px horizontal / 4px vertical spare, so 1x fits. Odd native widths in an even slot give half-pixel centering; use explicit integer background-position per frame instead of "center". Recommended: size the pseudo box to 11x10 and position frames at 2px 2px (7x6) / 1px 1px (9x8) / 0 0 (11x10). background-size must be an integer multiple of 11x10 (never 11x9 or fractional).'
};
const matrixWithLegend=Object.fromEntries(Object.entries(grids).map(([name,rows])=>[name,rows]));
const v2Draft={rows:round11x9Rows,...gridStats['11x9'],deprecated:true,comparisonOnly:true,shapeWidths:roundWidths,horizontallySymmetric:round11x9Rows.every((row)=>row===[...row].reverse().join(''))};
const v1Draft={rows:old11x9Rows,...previousLargeStats,deprecated:true,comparisonOnly:true};
const report={
  scope:'Formal brand-heart set: 7x6 (base) / 9x8 (mid) / 11x10 (large, user-selected V1 domed cap3 + soft-Y transition color on (4,0)/(6,0)). Old 11x9 V1/V2 and A/B/C candidates are deprecated comparison-only assets, frozen by SHA-256. No runtime CSS, builder or preview package was changed; verify.mjs never rewrites assets.',
  source:{file:'art-references/nso-fandom-desktop-icons-sheet.png',sha256:sourceSha256,dimensions:`${sourceMeta.width}x${sourceMeta.height}`,cellCrop:{x:sourceBox.x,y:sourceBox.y,sourceCellPx:sourceBox.cellSourcePx,width:sourceBox.width,height:sourceBox.height,sourceBoxPixels:`${sourceBox.width*sourceBox.cellSourcePx}x${sourceBox.height*sourceBox.cellSourcePx}`},sampledCellColors:sampledSourceMatrix,baseMatrix:sourceHeartRows,underlayNote:'Transparent cells in the flattened collage expose hair colors #ddbfee/#c4a3ef/#7b5f80; these are not heart pixels and are omitted from the isolated SVG.'},
  legend:{'.':'transparent','O':palette.O,'H':palette.H,'P':palette.P,'S':palette.S,'T':`${palette11x10.T} (11x10 only; transition = O/P channel average, only at (4,0),(6,0))`},
  formalTiers:{
    base:'7x6',mid:'9x8',large:'11x10',
    large11x10:{file:'heart-11x10.svg',bridgeVariable:'--jk-r10-heart-11-10',origin:'heart-v1-domed/heart-v1-domed-cap3.svg (user-selected) + soft variant Y on (4,0),(6,0)',softening:{variant:'Y',cells:[[4,0],[6,0]],change:'O->T',transitionColor:palette11x10.T,rule:'per-channel average of O #ae387d and P #ff87c6, rounded half-up (214.5/95.5/161.5 -> 215/96/162)',unsoftenedRollbackFile:'heart-11x10-soft/heart-11x10-cap3-original.svg',compareFiles:['heart-11x10-soft/heart-11x10-soft-X.svg','heart-11x10-soft/heart-11x10-soft-Y.svg']},...gridStats['11x10'],differsFromCap3Only:['4,0:O>T','6,0:O>T'],fileBytes:Buffer.byteLength(svgs['11x10']),rectCount:parsed11x10.rectCount,distinctColors:5,colorCounts:Object.fromEntries(Object.keys(palette11x10).map((c)=>[c,heart11x10Rows.join('').split(c).length-1])),outlineConnectivity:outlineConnectivity['11x10']},
    rhythm:{'0%':'7x6','20%':'7x6','40%':'9x8','60%':'11x10','80%':'9x8',reducedMotionStatic:'9x8'}
  },
  matrices:matrixWithLegend,
  matrixStatus:Object.fromEntries(Object.keys(grids).map((name)=>[name,tierRole[name]||'deprecated (old 11x9 V2, comparison only)'])),
  dimensions:Object.fromEntries(Object.entries(gridStats).map(([name,stats])=>[name,withStatus(name,stats)])),
  outlineConnectivity,
  slotFootprint,
  deprecated:{
    note:'Old 11x9 V1/V2, A/B/C candidates and non-selected domed caps are deprecated; kept for comparison only and not drawn in the regenerated previews.',
    previous11x9V1:{...v1Draft,bridgeVariable:'--jk-r10-heart-11-9 (embeds this V1; deprecated, do not use)'},
    revised11x9V2:{...v2Draft,file:'heart-11x9.svg'},
    protectedSha256:frozenReport
  },
  comparisonDrafts:{deprecated:true,previous11x9V1:v1Draft,revised11x9V2:v2Draft},
  cssBridge:{file:'heart-assets-r10.css',variables:bridgeReport,unchangedDeclarationSha256:frozenBridge,note:'--jk-r10-heart-7-6 and --jk-r10-heart-9-8 are byte-identical to the pre-11x10 bridge; --jk-r10-heart-11-9 is the old V1, deprecated; --jk-r10-heart-11-10 decodes byte-identically to heart-11x10.svg.'},
  paletteContrast:Object.fromEntries(Object.entries(palette11x10).map(([code,hex])=>[code,{hex,onPinkTitlebar:contrast(hex,titlebar),onDarkWindow:contrast(hex,darkBg),pixelCountBySize:Object.fromEntries(Object.entries(grids).map(([name,rows])=>[name,rows.join('').split(code).length-1]))}])),
  contrastNote:'7x6 and 9x8 keep the four source colors. 11x10 additionally uses the transition color T only at (4,0)/(6,0) (T on pink 1.28:1, on dark 4.85:1). No individual color reaches 3:1 on titlebar pink #d97fc6; outline 2.13:1.',
  backgrounds:{pink:titlebar,dark:darkBg},
  displaySizes:{note:'5/7/9px nearest-neighbor study of the formal tiers (11x10 shown reduced at 9x8 in the 9px column, plus native 11x10 in the 14px slot). Deprecated 11x9 drafts are no longer drawn. Main comparisons show 7x6 / 9x8 / 11x10 at 1x/2x/4x/6x.',frames:[{grid:'7x6',cssDisplay:'5x4px'},{grid:'9x8',cssDisplay:'7x6px'},{grid:'11x10 (study)',cssDisplay:'9x8px'},{grid:'11x10 (native)',cssDisplay:'11x10px'}]},
  outputs:{sourceContext:await checkPng(sourceContextPath),sourceCellCrop:await checkPng(sourceCropPath),sourceHeartIsolated:await checkPng(sourceHeartPath),comparisonPink,comparisonDark,displaySizes:displayReport}
};
await fs.writeFile(path.join(checksDir,'pixel-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
console.log('PASS: exact source 7x6 / 9x8 unchanged / 11x10 == cap3 matrix + soft Y on (4,0),(6,0) only (O->T; four colors + one transition color confined to those cells), 1x1 crispEdges rects, 8-connected O outline / CSS bridge decodes to SVG / old assets frozen / integer nearest previews / all outputs <=2000px');
