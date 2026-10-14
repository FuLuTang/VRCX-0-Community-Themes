// Renders every dist SVG at 4x, tiled three periods wide (two for large tiles),
// on a light row and a dark row, so shapes and seams can be inspected.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
const out = path.join(root, 'screenshots', 'assets-4x-sheet.png');
const SCALE = 4, PAD = 24, LABEL = 22;
const rows = [
  { name: 'light', bg: '#f6eef3', fg: '#3a3236', hi: '#ffffff' },
  { name: 'dark', bg: '#211b25', fg: '#f3dbe7', hi: '#ff8fc4' },
];
const files = (await fs.readdir(dist)).filter((f) => f.endsWith('.svg')).sort();
const cells = [];
for (const f of files) {
  const text = await fs.readFile(path.join(dist, f), 'utf8');
  const [, w, h] = text.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
  const reps = w >= 64 ? 2 : 3;
  const vreps = /lacing-column/.test(f) ? 3 : 1;
  cells.push({ f, text, w, h, reps, vreps, cw: w * SCALE * reps, ch: h * SCALE * vreps });
}
const colW = Math.max(...cells.map((c) => c.cw)) + PAD * 2;
const cols = 4;
const gridRows = Math.ceil(cells.length / cols);
const rowH = Math.max(...cells.map((c) => c.ch)) + PAD * 2 + LABEL;
const sectionH = gridRows * rowH;
const W = cols * colW, H = sectionH * rows.length;
const comps = [];
const labels = [];
for (const [ri, row] of rows.entries()) {
  comps.push({ input: { create: { width: W, height: sectionH, channels: 4, background: row.bg } }, left: 0, top: ri * sectionH });
  for (const [i, c] of cells.entries()) {
    const color = /highlight/.test(c.f) ? row.hi : row.fg;
    const svg = c.text.replace(/fill="#000"/g, `fill="${color}"`);
    // density chosen so the rendered tile is exactly SCALE x its viewBox
    const tile = await sharp(Buffer.from(svg), { density: 72 * SCALE }).resize(c.w * SCALE, c.h * SCALE).png().toBuffer();
    const x0 = (i % cols) * colW + PAD, y0 = ri * sectionH + Math.floor(i / cols) * rowH + PAD;
    for (let v = 0; v < c.vreps; v++) for (let k = 0; k < c.reps; k++) comps.push({ input: tile, left: x0 + k * c.w * SCALE, top: y0 + v * c.h * SCALE });
    labels.push(`<text x="${x0}" y="${y0 + c.ch + 18}" font-family="sans-serif" font-size="14" fill="${row.fg}">${c.f.replace('.svg', '')}</text>`);
  }
}
comps.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${labels.join('')}</svg>`), left: 0, top: 0 });
await sharp({ create: { width: W, height: H, channels: 4, background: '#000' } }).composite(comps).png().toFile(out);
console.log(out, W, H);
