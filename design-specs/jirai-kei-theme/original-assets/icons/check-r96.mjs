// R96 task-48 settings-gear evidence + verification. Needs only sharp (SHARP_MODULE or /tmp/dsh-theme-tools).
// Baseline lives in checks-r96-settings/before-settings.svg + before.css (do not overwrite).
import fs from 'node:fs/promises'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict'; import { createRequire } from 'node:module';
import { grids } from './hand-r96.mjs';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || '/tmp/dsh-theme-tools/node_modules/sharp');
const root = path.dirname(fileURLToPath(import.meta.url)), out = path.join(root, 'checks-r96-settings');
const read = f => fs.readFile(path.join(root, f), 'utf8');
const source = async n => { try { return await read('src-hand/' + n + '.svg'); } catch { return read('src/' + n + '.svg'); } };
const before = await fs.readFile(path.join(out, 'before-settings.svg'), 'utf8'), after = await source('settings');

// ---- grid checks: D4 symmetry, single component, transparent closed hole
const g = grids.settings, at = (x, y) => g[y][x];
for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
  const v = at(x, y); assert.equal(v, at(15 - x, y)); assert.equal(v, at(x, 15 - y)); assert.equal(v, at(y, x));
}
const flood = (ch, sx, sy) => { const seen = new Set, q = [[sx, sy]]; while (q.length) { const [x, y] = q.pop(); if (x < 0 || y < 0 || x > 15 || y > 15 || g[y][x] !== ch || seen.has(y * 16 + x)) continue; seen.add(y * 16 + x); q.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); } return seen; };
const filled = g.join('').split('').filter(c => c === 'X').length;
assert.equal(flood('X', 6, 1).size, filled, 'gear must be one 4-connected piece');
const hole = flood('.', 7, 7); assert.ok(![...hole].some(k => k % 16 === 0 || k < 16), 'hole must not leak to the border');

// ---- dist: only the settings rule may differ
const oldCSS = await fs.readFile(path.join(out, 'before.css'), 'utf8'), newCSS = await read('dist/jirai-icons.css');
const a = oldCSS.split('\n'), b = newCSS.split('\n'); assert.equal(a.length, b.length);
const changed = a.map((l, i) => l === b[i] ? null : i).filter(i => i !== null);
assert.deepEqual(changed.map(i => b[i].slice(0, b[i].indexOf('{'))), ['svg.lucide-settings']);

// ---- images
const alpha = async svg => { const s = svg.trim().replace('<svg ', '<svg width="16" height="16" ');
  const { data } = await sharp(Buffer.from(s)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return Uint8Array.from({ length: 256 }, (_, i) => data[i * 4 + 3]); };
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const tile = (a, k, fg, bg) => { const W = 16 * k, buf = Buffer.alloc(W * W * 4), F = hex(fg), B = hex(bg);
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { const al = a[Math.floor(y / k) * 16 + Math.floor(x / k)] / 255, o = (y * W + x) * 4;
    for (let c = 0; c < 3; c++) buf[o + c] = Math.round(B[c] * (1 - al) + F[c] * al); buf[o + 3] = 255; }
  return { input: buf, raw: { width: W, height: W, channels: 4 } }; };
const text = (t, x, y, fill, size = 13) => `<text x="${x}" y="${y}" font-family="DejaVu Sans, sans-serif" font-size="${size}" fill="${fill}">${t}</text>`;
const themes = [['dark', '#201936', '#f2ebff'], ['pink', '#ffb8e6', '#16112a']];
const scales = [1, 2, 4, 12], colX = [110, 160, 220, 320], rowH = 230, PW = 540;
const neighbours = ['settings', 'globe', 'wrench', 'sliders-horizontal', 'bell', 'search', 'user'];
const A = { before: await alpha(before), after: await alpha(after) };
const nb = await Promise.all(neighbours.map(async n => n === 'settings' ? A.after : alpha(await source(n))));
const nbBefore = [A.before, ...nb.slice(1)];
async function panel([name, bg, fg], file) {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${70 + rowH * 2 + 90}"><rect width="100%" height="100%" fill="${bg}"/>`;
  svg += text(`settings · ${name} ${bg} / icon ${fg}`, 14, 26, fg, 16);
  scales.forEach((k, i) => svg += text(k + '×', colX[i], 56, fg, 12));
  const layers = [];
  ['before', 'after'].forEach((st, r) => { const y = 70 + r * rowH; svg += text(st, 14, y + 20, fg, 15);
    scales.forEach((k, i) => layers.push({ ...tile(A[st], k, fg, bg), left: colX[i], top: y })); });
  const ry = 70 + rowH * 2; svg += text('in-row 1× / 2× (before | after): ' + neighbours.join(' '), 14, ry + 6, fg, 11);
  [nbBefore, nb].forEach((set, r) => set.forEach((a, i) => { layers.push({ ...tile(a, 1, fg, bg), left: 14 + i * 24, top: ry + 18 + r * 22 });
    layers.push({ ...tile(a, 2, fg, bg), left: 200 + i * 44, top: ry + 14 + r * 38 }); }));
  svg += '</svg>';
  await sharp(Buffer.from(svg)).composite(layers).png().toFile(path.join(out, file));
}
for (const t of themes) await panel(t, `settings-${t[0]}.png`);
await sharp({ create: { width: PW * 2 + 8, height: 70 + rowH * 2 + 90, channels: 4, background: '#000000' } })
  .composite([{ input: path.join(out, 'settings-dark.png'), left: 0, top: 0 }, { input: path.join(out, 'settings-pink.png'), left: PW + 8, top: 0 }])
  .png().toFile(path.join(out, 'before-after.png'));

// ---- family audit sheet (no edits, evidence only)
const family = ['settings', 'settings-2', 'server-cog', 'sliders-horizontal', 'wrench', 'sun', 'loader-circle'];
let fsvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${family.length * 120 + 20}" height="190"><rect width="100%" height="100%" fill="#201936"/>`; const fl = [];
for (const [i, n] of family.entries()) { const s = await source(n), x = 20 + i * 120, file = (await fs.access(path.join(root, 'src-hand', n + '.svg')).then(() => 'hand', () => 'gen'));
  fsvg += text(n, x, 22, '#f2ebff', 11) + text(file, x, 180, '#b9a6e0', 10);
  const a = await alpha(s); fl.push({ ...tile(a, 1, '#f2ebff', '#201936'), left: x, top: 34 }, { ...tile(a, 6, '#f2ebff', '#201936'), left: x, top: 60 }); }
await sharp(Buffer.from(fsvg + '</svg>')).composite(fl).png().toFile(path.join(out, 'family.png'));

const report = { task: 'task-48', glyph: 'settings', changedRules: ['svg.lucide-settings'], cssVariable: '--px',
  distBytes: { before: Buffer.byteLength(oldCSS), after: Buffer.byteLength(newCSS), delta: Buffer.byteLength(newCSS) - Buffer.byteLength(oldCSS) },
  ruleBytes: { before: Buffer.byteLength(a[changed[0]]), after: Buffer.byteLength(b[changed[0]]) },
  unchangedLines: a.length - changed.length, filledPixels: filled, holePixels: hole.size, symmetry: 'D4', components: 1 };
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
