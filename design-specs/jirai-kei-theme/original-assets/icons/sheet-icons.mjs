import fs from 'node:fs/promises'; import path from 'node:path'; import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('/tmp/dsh-theme-tools/node_modules/sharp');
const dirs = process.argv.slice(2, -1), out = process.argv.at(-1);
const names = (process.env.NAMES || '').split(',').filter(Boolean);
const S = Number(process.env.S || 4), cell = 16 * S + 12, cols = Number(process.env.COLS || 24);
const list = names.length ? names : (await fs.readdir(dirs[0])).filter(f => f.endsWith('.svg')).map(f => f.slice(0, -4));
const rowsPer = Math.ceil(list.length / cols), W = cols * cell, H = rowsPer * cell * dirs.length + 8 * dirs.length;
const comps = [];
for (const [di, d] of dirs.entries()) for (const [i, n] of list.entries()) {
  let svg; try { svg = await fs.readFile(path.join(d, n + '.svg'), 'utf8'); } catch { continue; }
  svg = svg.replace('fill="#000"', 'fill="#f2ebff"');
  const png = await sharp(Buffer.from(svg), { density: 72 * S }).resize(16 * S, 16 * S, { kernel: 'nearest' }).png().toBuffer();
  comps.push({ input: png, left: (i % cols) * cell + 6, top: di * (rowsPer * cell + 8) + Math.floor(i / cols) * cell + 6 });
}
await sharp({ create: { width: W, height: H, channels: 4, background: '#201936' } }).composite(comps).png().toFile(out);
console.log(out, W, H, list.length);
