/* heart-11x10-soft: cap3 vs soft X vs soft Y comparison + assertions.
   Compares the user-selected cap3 11x10 heart with two softened variants of its two notch-side cap cells
   (4,0) and (6,0):  X = existing shade color S #cc5282 (no new color);  Y = O/P channel-average transition color T.
   Writes only previews + verify-report.json under this checks directory. Never rewrites any SVG/asset. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const checksDir = path.dirname(fileURLToPath(import.meta.url));
const themeRoot = path.resolve(checksDir, '../../../..');
const assetRoot = path.join(themeRoot, 'original-assets/r10-heart-reference');
const softDir = path.join(assetRoot, 'heart-11x10-soft');
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const sha256 = (data) => createHash('sha256').update(data).digest('hex');

const bgPink = '#d97fc6', bgDark = '#201936';
const base = { O: '#ae387d', H: '#ffcced', P: '#ff87c6', S: '#cc5282' };
// Transition color for variant Y: per-channel average of O and P, rounded half-up (214.5, 95.5, 161.5 -> 215, 96, 162).
const hexToRgb = (hex) => hex.slice(1).match(/.{2}/g).map((v) => parseInt(v, 16));
const rgbToHex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
const midRgbExact = hexToRgb(base.O).map((v, i) => (v + hexToRgb(base.P)[i]) / 2);
const transition = rgbToHex(midRgbExact.map((v) => Math.floor(v + 0.5)));
assert(transition === '#d760a2', `unexpected transition color ${transition}`);
const palettes = { original: base, X: base, Y: { ...base, T: transition } };

const cap3 = ['..OOO.OOO..', '.OPPO.OHPO.', 'OHPPPOPHPPO', 'OPPPPPPPPSO', 'OPPPPPPPSSO', '.OPPPPPPSO.', '..OPPPPSO..', '...OPPSO...', '....OSO....', '.....O.....'];
const softCells = [[4, 0], [6, 0]];
const soften = (rows, code) => rows.map((row, y) => [...row].map((c, x) => softCells.some(([sx, sy]) => sx === x && sy === y) ? code : c).join(''));
const matrices = { original: cap3, X: soften(cap3, 'S'), Y: soften(cap3, 'T') };
const files = {
  original: 'heart-11x10-cap3-original.svg',
  X: 'heart-11x10-soft-X.svg',
  Y: 'heart-11x10-soft-Y.svg'
};
// Frozen rollback copy: byte-identical to the formal heart-11x10.svg as it was before the soft change.
const ORIGINAL_SHA256 = '052a58d39ed24859f42d5e3c3f169c9a9a889d221d70bf87dfc59bfd1cba6d28';
const WIDTH = 11, HEIGHT = 10;

function parseSvg(svg, palette, label) {
  assert(svg.startsWith(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" shape-rendering="crispEdges">`), `${label}: root must be native ${WIDTH}x${HEIGHT} with viewBox and shape-rendering="crispEdges"`);
  assert(!/<(image|path|circle|ellipse|polygon|use|filter|linearGradient|radialGradient)\b|transform=|opacity=|stroke|preserveAspectRatio/.test(svg), `${label}: only plain 1x1 integer rects allowed`);
  const byFill = Object.fromEntries(Object.entries(palette).map(([code, hex]) => [hex, code]));
  const grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill('.'));
  let rectCount = 0;
  const groupFills = [];
  for (const group of svg.matchAll(/<g fill="(#[0-9a-f]{6})">((?:<rect [^>]*\/>)+)<\/g>/g)) {
    const code = byFill[group[1]];
    assert(code, `${label}: group fill ${group[1]} is not in this variant's palette`);
    groupFills.push(group[1]);
    for (const rect of group[2].matchAll(/<rect x="(\d+)" y="(\d+)" width="1" height="1"\/>/g)) {
      const x = Number(rect[1]), y = Number(rect[2]);
      assert(x < WIDTH && y < HEIGHT, `${label}: rect outside grid at ${x},${y}`);
      assert(grid[y][x] === '.', `${label}: overlapping rect at ${x},${y}`);
      grid[y][x] = code; rectCount += 1;
    }
  }
  assert(rectCount === (svg.match(/<rect /g) || []).length, `${label}: every <rect> must be a plain integer 1x1 rect in a palette <g>`);
  assert(new Set(groupFills).size === groupFills.length, `${label}: duplicate color group`);
  return { rows: grid.map((r) => r.join('')), rectCount, groupFills };
}
function outlineComponents(rows) {
  const seen = new Set(), key = (x, y) => `${x},${y}`;
  let components = 0;
  for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) {
    if (rows[y][x] !== 'O' || seen.has(key(x, y))) continue;
    components += 1;
    const stack = [[x, y]]; seen.add(key(x, y));
    while (stack.length) {
      const [cx, cy] = stack.pop();
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        const nx = cx + dx, ny = cy + dy;
        if ((dx || dy) && rows[ny]?.[nx] === 'O' && !seen.has(key(nx, ny))) { seen.add(key(nx, ny)); stack.push([nx, ny]); }
      }
    }
  }
  return components;
}
const luminance = (hex) => {
  const lin = hexToRgb(hex).map((v) => v / 255).map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
};
const contrast = (a, b) => { const la = luminance(a), lb = luminance(b); return Number(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(2)); };
const coordList = (rows) => { const out = []; rows.forEach((r, y) => [...r].forEach((c, x) => { if (c !== '.') out.push([x, y]); })); return out; };

// ---- read + parse the three SVGs ----
const svgs = {}, parsed = {};
for (const [id, file] of Object.entries(files)) {
  svgs[id] = await fs.readFile(path.join(softDir, file), 'utf8');
  parsed[id] = parseSvg(svgs[id], palettes[id], file);
  assert(JSON.stringify(parsed[id].rows) === JSON.stringify(matrices[id]), `${file} rects do not match the expected ${id} matrix`);
}
assert(sha256(svgs.original) === ORIGINAL_SHA256, 'heart-11x10-cap3-original.svg is not the frozen rollback copy of the original cap3');
// cap3 original must still equal the user-selected domed cap3 matrix.
const domedCap3 = parseSvg(await fs.readFile(path.join(assetRoot, 'heart-v1-domed/heart-v1-domed-cap3.svg'), 'utf8'), base, 'heart-v1-domed-cap3.svg');
assert(JSON.stringify(domedCap3.rows) === JSON.stringify(parsed.original.rows), 'cap3 original must equal heart-v1-domed-cap3.svg matrix');

// ---- shape mask unchanged ----
const mask = (rows) => rows.map((r) => [...r].map((c) => c === '.' ? '.' : '#').join('')).join('\n');
for (const id of ['X', 'Y']) assert(mask(parsed[id].rows) === mask(parsed.original.rows), `${id}: silhouette mask changed`);
// ---- only the two cells differ ----
const diffCells = (a, b) => { const d = []; for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) if (a[y][x] !== b[y][x]) d.push({ x, y, from: a[y][x], to: b[y][x] }); return d; };
const diffs = {};
for (const [id, code] of [['X', 'S'], ['Y', 'T']]) {
  diffs[id] = diffCells(parsed.original.rows, parsed[id].rows);
  assert(JSON.stringify(diffs[id]) === JSON.stringify([{ x: 4, y: 0, from: 'O', to: code }, { x: 6, y: 0, from: 'O', to: code }]), `${id}: must differ from cap3 in exactly (4,0)/(6,0) O->${code}: ${JSON.stringify(diffs[id])}`);
}
// ---- colors ----
const colorSet = (rows) => [...new Set(rows.join('').replaceAll('.', ''))].sort().join('');
assert(colorSet(parsed.original.rows) === 'HOPS' && colorSet(parsed.X.rows) === 'HOPS', 'original/X must use exactly four colors H/O/P/S');
assert(colorSet(parsed.Y.rows) === 'HOPST', 'Y must use the four colors plus exactly one transition color T');
const tCells = coordList(parsed.Y.rows).filter(([x, y]) => parsed.Y.rows[y][x] === 'T');
assert(JSON.stringify(tCells) === JSON.stringify([[4, 0], [6, 0]]), 'Y: T may appear only at (4,0)/(6,0)');
assert(palettes.Y.T === transition && transition === rgbToHex(midRgbExact.map((v) => Math.floor(v + 0.5))), 'T must be the rounded channel-average of O and P');
assert(!Object.values(base).includes(transition), 'T must be a genuinely new color');
// X adds S only at the two cells: S count 7 -> 9
const count = (rows, c) => rows.join('').split(c).length - 1;
assert(count(parsed.original.rows, 'S') === 7 && count(parsed.X.rows, 'S') === 9 && count(parsed.X.rows, 'O') === 24, 'X counts must be O24 S9');
assert(count(parsed.Y.rows, 'O') === 24 && count(parsed.Y.rows, 'T') === 2 && count(parsed.Y.rows, 'S') === 7, 'Y counts must be O24 T2 S7');
// ---- outline still connected ----
const connectivity = Object.fromEntries(Object.entries(parsed).map(([id, p]) => [id, outlineComponents(p.rows)]));
for (const [id, n] of Object.entries(connectivity)) assert(n === 1, `${id}: O outline must stay a single 8-connected component, got ${n}`);
// Softened cells must stay on the outer boundary and touch the remaining O outline (they replace outline cells, not interior).
for (const [x, y] of softCells) {
  const touchesO = [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, 1]].some(([dx, dy]) => parsed.X.rows[y + dy]?.[x + dx] === 'O');
  assert(touchesO, `soft cell (${x},${y}) must remain adjacent to O outline`);
}
// ---- native raster: only palette colors (+transparent), cell-by-cell ====
const rgbaKey = (hex) => `${hexToRgb(hex).join(',')},255`;
for (const id of Object.keys(files)) {
  const raw = await sharp(Buffer.from(svgs[id]), { density: 72 }).resize(WIDTH, HEIGHT, { fit: 'fill', kernel: 'nearest' }).ensureAlpha().raw().toBuffer();
  const byRgba = Object.fromEntries(Object.entries(palettes[id]).map(([c, h]) => [rgbaKey(h), c]));
  for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) {
    const o = (y * WIDTH + x) * 4, rgba = `${raw[o]},${raw[o + 1]},${raw[o + 2]},${raw[o + 3]}`;
    assert((rgba === '0,0,0,0' ? '.' : byRgba[rgba]) === matrices[id][y][x], `${id}: raster mismatch/interpolation at ${x},${y} (${rgba})`);
  }
}
// ---- which variant is the formal heart-11x10.svg now? ----
const formalSvg = await fs.readFile(path.join(assetRoot, 'heart-11x10.svg'), 'utf8');
const formalParsed = parseSvg(formalSvg, palettes.Y, 'heart-11x10.svg');
const formalMatches = ['original', 'X', 'Y'].filter((id) => JSON.stringify(formalParsed.rows) === JSON.stringify(parsed[id].rows));
assert(formalMatches.length === 1, `heart-11x10.svg must equal exactly one of cap3/X/Y matrices, matches: ${formalMatches}`);

// ---- contrast report ----
const colorContrast = Object.fromEntries(Object.entries(palettes.Y).map(([code, hex]) => [code, { hex, onPink: contrast(hex, bgPink), onDark: contrast(hex, bgDark), vsBodyP: contrast(hex, base.P) }]));

// ---- previews ----
const checkPng = async (file) => {
  const m = await sharp(file).metadata();
  assert(m.width <= 2000 && m.height <= 2000, `${path.basename(file)} exceeds 2000px`);
  return { file: path.basename(file), width: m.width, height: m.height };
};
const render = (svg, w, h) => sharp(Buffer.from(svg), { density: 72 }).resize(w, h, { fit: 'fill', kernel: 'nearest' }).png().toBuffer();
const svgData = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);
const entries = [['original', 'cap3 (original)'], ['X', `X · S ${base.S}`], ['Y', `Y · T ${transition}`]];

async function comparison(bg, label) {
  const factors = [1, 2, 4, 6], labelW = 50, colW = 150, headerH = 32, rowGap = 2;
  const rows = factors.map((f) => ({ f, maxH: HEIGHT * f, height: HEIGHT * f + 26 }));
  const width = labelW + colW * entries.length;
  const height = headerH + rows.reduce((n, r) => n + r.height + rowGap, 0) + 2;
  const ink = label === 'pink' ? '#16112a' : '#fdf4ff';
  const headerFill = label === 'pink' ? '#e997d1' : '#171326';
  const headings = entries.map(([, title], i) => `<text x="${labelW + i * colW + colW / 2}" y="20" text-anchor="middle" fill="${ink}" font-family="sans-serif" font-size="11">${title}</text>`).join('');
  let y = headerH, deco = '';
  const layers = [];
  for (const row of rows) {
    deco += `<text x="10" y="${y + 17}" fill="${ink}" font-family="monospace" font-size="11">${row.f}×</text><line x1="0" y1="${y + row.height}" x2="${width}" y2="${y + row.height}" stroke="${ink}" opacity=".22"/>`;
    for (let i = 0; i < entries.length; i++) {
      const [id] = entries[i], w = WIDTH * row.f, h = HEIGHT * row.f;
      const left = labelW + i * colW + Math.floor((colW - w) / 2), top = y + 20 + Math.floor((row.maxH - h) / 2);
      if (row.f === 1) {
        const sx = left + Math.floor((w - 14) / 2), sy = top + Math.floor((h - 14) / 2);
        deco += `<rect x="${sx + .5}" y="${sy + .5}" width="13" height="13" fill="none" stroke="${ink}" stroke-opacity=".4" stroke-dasharray="1 1"/>`;
      }
      layers.push({ input: await render(svgs[id], w, h), left, top });
    }
    y += row.height + rowGap;
  }
  const bgSvg = svgData(width, height, `<rect width="100%" height="100%" fill="${bg}"/><rect width="100%" height="${headerH}" fill="${headerFill}"/>${headings}${deco}<text x="${width - 6}" y="${height - 4}" text-anchor="end" fill="${ink}" opacity=".72" font-family="monospace" font-size="8">${label.toUpperCase()} · ${bg.toUpperCase()} · dashed = 14px slot</text>`);
  const file = path.join(checksDir, `comparison-${label}.png`);
  await sharp(bgSvg).composite(layers).png().toFile(file);
  return checkPng(file);
}

// Native-pixel mock of a 32px titlebar with the 14px brand slot; built pixel by pixel (no antialiasing), then 4x nearest.
async function titlebarSlot() {
  const cellW = 52, barH = 32, bands = [[bgPink, '#16112a'], [bgDark, '#fdf4ff']];
  const W = cellW * entries.length, H = barH * bands.length;
  const buf = Buffer.alloc(W * H * 4);
  const put = (x, y, rgb) => { const o = (y * W + x) * 4; buf[o] = rgb[0]; buf[o + 1] = rgb[1]; buf[o + 2] = rgb[2]; buf[o + 3] = 255; };
  bands.forEach(([bg, ink], b) => {
    for (let y = 0; y < barH; y++) for (let x = 0; x < W; x++) put(x, b * barH + y, hexToRgb(bg));
    entries.forEach(([id], i) => {
      const slotX = i * cellW + 6, slotY = b * barH + 9;   // 14x14 slot
      for (let k = 0; k < 14; k++) for (const [px, py] of [[k, 0], [k, 13], [0, k], [13, k]]) if ((px + py) % 2 === 0) put(slotX + px, slotY + py, hexToRgb(ink).map((v, j) => Math.round((v + hexToRgb(bg)[j] * 2) / 3)));
      // heart at native 11x10, explicit integer offset (1px,2px) inside the slot, per the integration notes
      matrices[id].forEach((row, y) => [...row].forEach((c, x) => { if (c !== '.') put(slotX + 1 + x, slotY + 2 + y, hexToRgb(palettes.Y[c])); }));
      // placeholder "brand text" bars next to the slot
      for (let k = 0; k < 22; k++) for (let h = 0; h < 3; h++) put(i * cellW + 24 + k, b * barH + 13 + h, hexToRgb(ink).map((v, j) => Math.round((v + hexToRgb(bg)[j] * 3) / 4)));
    });
  });
  const mag = 4, headerH = 26;
  const scaled = await sharp(buf, { raw: { width: W, height: H, channels: 4 } }).resize(W * mag, H * mag, { kernel: 'nearest' }).png().toBuffer();
  const heads = entries.map(([, t], i) => `<text x="${(i * cellW + cellW / 2) * mag}" y="17" text-anchor="middle" fill="#fdf4ff" font-family="sans-serif" font-size="12">${t}</text>`).join('');
  const header = svgData(W * mag, headerH, `<rect width="100%" height="100%" fill="#171326"/>${heads}`);
  const foot = svgData(W * mag, 18, `<rect width="100%" height="100%" fill="#171326"/><text x="8" y="13" fill="#fdf4ff" opacity=".75" font-family="monospace" font-size="10">native 14px slot, heart 11x10 at (1,2), shown 4× nearest · top ${bgPink} · bottom ${bgDark}</text>`);
  const file = path.join(checksDir, 'titlebar-slot-4x.png');
  await sharp({ create: { width: W * mag, height: headerH + H * mag + 18, channels: 4, background: '#000' } }).composite([{ input: header, left: 0, top: 0 }, { input: scaled, left: 0, top: headerH }, { input: foot, left: 0, top: headerH + H * mag }]).png().toFile(file);
  return { ...(await checkPng(file)), nativeSlotCssPx: '14x14', mag };
}

const outputs = { comparisonPink: await comparison(bgPink, 'pink'), comparisonDark: await comparison(bgDark, 'dark'), titlebarSlot4x: await titlebarSlot() };
const report = {
  scope: 'cap3 vs softened notch-side cap cells (4,0)/(6,0). X = existing S, Y = O/P midpoint. Previews + this report only; no assets rewritten.',
  matrices: matrices,
  legend: { '.': 'transparent', ...palettes.Y },
  transitionColor: { hex: transition, rule: 'per-channel average of O #ae387d and P #ff87c6, rounded half-up (214.5/95.5/161.5 -> 215/96/162); the brief quoted ~#d85fa1, which is within +-1 per channel', exactMean: midRgbExact },
  changedCells: diffs,
  counts: Object.fromEntries(Object.entries(parsed).map(([id, p]) => [id, Object.fromEntries([...new Set(p.rows.join('').replaceAll('.', ''))].sort().map((c) => [c, count(p.rows, c)]))])),
  outlineComponents8: connectivity,
  contrast: colorContrast,
  formalHeart11x10Currently: formalMatches[0],
  files: Object.fromEntries(Object.entries(files).map(([id, f]) => [id, { file: f, sha256: sha256(svgs[id]), bytes: Buffer.byteLength(svgs[id]) }])),
  outputs
};
await fs.writeFile(path.join(checksDir, 'verify-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ transition, contrast: colorContrast, counts: report.counts, connectivity, formalHeart11x10Currently: formalMatches[0], outputs }, null, 2));
console.log('PASS: mask unchanged / only (4,0),(6,0) differ (X: O->S, Y: O->T) / T only on those 2 cells / O outline single 8-connected / integer 1x1 crispEdges rects / native raster exact / rollback copy frozen / previews <=2000px');
