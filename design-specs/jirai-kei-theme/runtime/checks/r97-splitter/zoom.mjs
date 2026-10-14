// 6x nearest-neighbour grip close-ups: before row / after row, vertical + horizontal grips, 4 states each.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const here = path.dirname(fileURLToPath(import.meta.url));
const rep = JSON.parse(await fs.readFile(path.join(here, 'verify-output.json'), 'utf8'));
const S = 6, CW = 28, CH = 28, cols = ['vh-inactive', 'vh-hover', 'vh-active', 'vh-focus', 'hh-inactive', 'hh-hover', 'hh-active', 'hh-focus'];
const tiles = [];
for (const [ri, tag] of ['before', 'after'].entries()) for (const [ci, id] of cols.entries()) {
  const g = rep[tag === 'before' ? 'before' : 'after'][id];
  const [x, y, w, h] = g.sep, horiz = w > h;
  const cx = horiz ? x + Math.floor(w / 2) : x, cy = horiz ? y : y + Math.floor(h / 2);
  let src = path.join(here, tag + '.png'), ox = 0, oy = 0;
  if (id.endsWith('focus')) { const f = (tag === 'before' ? rep.beforeFocus : rep.focus)[id]; src = f.shot; [ox, oy] = f.clip; }
  const left = Math.round(cx - CW / 2 - ox), top = Math.round(cy - CH / 2 - oy);
  const buf = await sharp(src).extract({ left, top, width: CW, height: CH }).resize(CW * S, CH * S, { kernel: 'nearest' }).png().toBuffer();
  tiles.push({ input: buf, left: 10 + ci * (CW * S + 10), top: 30 + ri * (CH * S + 34) });
}
const W = 10 + cols.length * (CW * S + 10), H = 30 + 2 * (CH * S + 34);
const lab = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><style>text{font:13px monospace;fill:#f2ebff}</style>`
  + cols.map((c, i) => `<text x="${10 + i * (CW * S + 10)}" y="20">${c}</text>`).join('')
  + `<text x="10" y="${30 + CH * S + 22}">↑ before (current bundle) · ↓ after (+splitter-r97) · 6x nearest</text></svg>`;
await sharp({ create: { width: W, height: H, channels: 3, background: '#0c0918' } }).composite([{ input: Buffer.from(lab) }, ...tiles]).png().toFile(path.join(here, 'grip-6x.png'));
console.log('grip-6x.png', W, H);
