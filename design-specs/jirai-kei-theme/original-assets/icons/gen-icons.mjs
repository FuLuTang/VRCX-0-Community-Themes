// Pixel icon set derived from lucide (ISC). Each used icon is rasterised onto a 16x16 grid,
// thresholded to 1-bit, and written as a single-colour crispEdges SVG (row runs merged).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = path.dirname(fileURLToPath(import.meta.url));
const LUCIDE = process.env.LUCIDE_ICONS_DIR || path.join(path.dirname(require.resolve('lucide-react/package.json')), 'dist/esm/icons');
const GRID = Number(process.env.GRID || 16), STROKE = Number(process.env.STROKE || 2.6), TH = Number(process.env.TH || 0.45);
const outDir = path.join(root, process.env.OUT || 'src');
await fs.mkdir(outDir, { recursive: true });
const used = JSON.parse(await fs.readFile(process.env.LIST || path.join(root, 'used-icons.json'), 'utf8'));
const esc = (v) => String(v).replace(/"/g, '&quot;');
async function iconData(kebab) {
  let file = path.join(LUCIDE, kebab + '.mjs');
  for (let i = 0; i < 3; i++) {
    const txt = await fs.readFile(file, 'utf8');
    const m = txt.match(/export \{ default \} from '\.\/(.+?)\.mjs'/);
    if (!m) break; file = path.join(LUCIDE, m[1] + '.mjs');
  }
  return (await import(pathToFileURL(file).href)).__iconData;
}
const results = [], grids = {};
for (const { kebab } of used) {
  const d = await iconData(kebab);
  const body = d.node.map(([tag, a]) => `<${tag} ${Object.entries(a).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}/>`).join('');
  const src = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${GRID * 8}" height="${GRID * 8}" fill="none" stroke="#000" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const { data } = await sharp(Buffer.from(src)).ensureAlpha().resize(GRID, GRID, { kernel: 'cubic' }).raw().toBuffer({ resolveWithObject: true });
  const rows = [];
  for (let y = 0; y < GRID; y++) { let r = ''; for (let x = 0; x < GRID; x++) r += data[(y * GRID + x) * 4 + 3] / 255 >= TH ? 'X' : '.'; rows.push(r); }
  // merge identical runs on consecutive rows into rectangles, then emit with relative moves
  const rects = [], open = new Map();
  rows.forEach((row, y) => {
    const now = new Map();
    for (let x = 0; x < GRID;) { if (row[x] !== 'X') { x++; continue; } let e = x; while (row[e] === 'X') e++;
      const k = x + ':' + e, r = open.get(k);
      if (r && r.y + r.h === y) { r.h++; now.set(k, r); } else { const nr = { x, y, w: e - x, h: 1 }; rects.push(nr); now.set(k, nr); }
      x = e; }
    open.clear(); for (const [k, v] of now) open.set(k, v);
  });
  let p = '', cx = 0, cy = 0;
  for (const r of rects) { p += (p ? `m${r.x - cx} ${r.y - cy}` : `M${r.x} ${r.y}`) + `h${r.w}v${r.h}h${-r.w}`; cx = r.x; cy = r.y + r.h; }
  p = p.replace(/ -/g, '-');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}" shape-rendering="crispEdges"><path fill="#000" d="${p}"/></svg>\n`;
  await fs.writeFile(path.join(outDir, `${d.name}.svg`), svg);
  grids[d.name] = rows;
  results.push({ used: kebab, cls: d.name, bytes: Buffer.byteLength(svg) });
}
await fs.writeFile(path.join(outDir, '_grids.json'), JSON.stringify(grids, null, 0));
await fs.writeFile(path.join(outDir, '_index.json'), JSON.stringify({ grid: GRID, stroke: STROKE, threshold: TH, icons: results }, null, 1));
console.log(outDir, results.length, 'icons', results.reduce((n, r) => n + r.bytes, 0), 'bytes');
