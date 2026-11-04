// 06-photo-r2：三颗像素心（沿用上版 13x10 提取结果）+ 心底加 1 格尖（啾啾）
import { toolRequire } from '../../tools/common.mjs';
export const HC = { O: '#bf628f', W: '#fef6ff', A: '#fbc4e4', B: '#f4b6d3', C: '#e999be', D: '#e48cb5', E: '#fda9d2', F: '#f5d0e3', K: '#d9679f' };
export const HEART = [
  '..OOO...OOO..',
  '.OAAAO.OAAAO.',
  'OAWFBAOABBBAO',
  'OEFABBBBBBBEO',
  'OCCCCCCCCCCCO',
  '.OECCCCCCCEO.',
  '..OEDDDDDEO..',
  '...OEDDDEO...',
  '....OEEEO....',
  '.....OOO.....'];
// 用户说的“小啾啾”=心底的尖：原心底是平的 3 格，正下方再加 1 格描边，让心尖起来
export const TIP = ['......O......'];
export const CHARM = [...HEART, ...TIP];     
export const GAP = 3;
export function row3(rows = CHARM) { return rows.map((r) => r + '.'.repeat(GAP) + r + '.'.repeat(GAP) + r); }
export async function pngOf(rows, scale, file, palette = HC) {
  const sharp = toolRequire('sharp'); const h = rows.length, w = rows[0].length; const buf = Buffer.alloc(w * h * 4);
  rows.forEach((r, y) => [...r].forEach((k, x) => { if (k === '.') return; const c = palette[k]; const o = (y * w + x) * 4; buf[o] = parseInt(c.slice(1, 3), 16); buf[o + 1] = parseInt(c.slice(3, 5), 16); buf[o + 2] = parseInt(c.slice(5, 7), 16); buf[o + 3] = 255; }));
  let s = sharp(buf, { raw: { width: w, height: h, channels: 4 } }); if (scale > 1) s = s.resize(w * scale, h * scale, { kernel: 'nearest' });
  await s.png({ palette: true, compressionLevel: 9, effort: 10, colours: 16, dither: 0 }).toFile(file);
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  await pngOf(CHARM, 1, 'assets/charm-1.png');
  await pngOf(CHARM, 12, '/tmp/final2-06-charm-x12.png');
  const sharp = toolRequire('sharp');
  await pngOf(row3(), 1, 'assets/hearts-3.png');
  const m = await sharp('assets/charm-1.png').metadata(); console.log(m.width, m.height);
}
