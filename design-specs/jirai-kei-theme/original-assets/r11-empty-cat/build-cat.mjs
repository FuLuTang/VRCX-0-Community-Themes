// 从 art-references/nso-steam-ss-04.jpg 提取右下角粉猫 → 原生像素 PNG。不使用 AI 重绘、不做模糊缩放。
// 推断：该截图是 960×540 原生画布的 2× 最近邻放大（+JPEG）。猫位于偶数相位（x=1334, y=688 起），2×2 块取均值即还原原生像素。
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JK, toolRequire} from '../../tools/common.mjs';
const sharp = toolRequire('sharp');
const dir = path.dirname(fileURLToPath(import.meta.url));
const out = (f) => path.join(dir, 'art', f);
const SRC = path.join(JK, 'art-references/nso-steam-ss-04.jpg');
const X0 = 1334, Y0 = 688, CW = 58, CH = 48, S = 2, W = CW * S, H = CH * S; // 裁切框 (1334,688) 116×96，原生 58×48 格
const K = 24; // 调色板色数
const {data} = await sharp(SRC).extract({left: X0, top: Y0, width: W, height: H}).removeAlpha().raw().toBuffer({resolveWithObject: true});
// 1) 2×2 块均值 → 原生像素
const cell = [];
for (let cy = 0; cy < CH; cy++) for (let cx = 0; cx < CW; cx++) { const v = [0, 0, 0]; for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const k = ((cy * S + y) * W + cx * S + x) * 3; for (let c = 0; c < 3; c++) v[c] += data[k + c]; } cell.push(v.map((a) => a / (S * S))); }
// 2) 背景抠除：从边缘泛洪“近白低饱和”格
const isBg = (i) => { const c = cell[i]; return Math.min(...c) >= 232 && Math.max(...c) - Math.min(...c) <= 26; };
const bg = new Uint8Array(CW * CH); const st = [];
for (let x = 0; x < CW; x++) st.push([x, 0], [x, CH - 1]); for (let y = 0; y < CH; y++) st.push([0, y], [CW - 1, y]);
while (st.length) { const [x, y] = st.pop(); if (x < 0 || y < 0 || x >= CW || y >= CH) continue; const k = y * CW + x; if (bg[k] || !isBg(k)) continue; bg[k] = 1; st.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]); }
// 3) 只保留最大连通块（去掉左上角气泡尖角残片）
const lab = new Int32Array(CW * CH).fill(-1), comps = [];
for (let i = 0; i < CW * CH; i++) { if (bg[i] || lab[i] >= 0) continue; const id = comps.length, q = [i]; lab[i] = id; let c = 0; while (q.length) { const j = q.pop(); c++; const x = j % CW, y = (j / CW) | 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= CW || ny >= CH) continue; const k = ny * CW + nx; if (!bg[k] && lab[k] < 0) { lab[k] = id; q.push(k); } } } comps.push(c); }
const big = comps.indexOf(Math.max(...comps));
const raw = Buffer.alloc(CW * CH * 4);
for (let i = 0; i < CW * CH; i++) if (lab[i] === big) { raw[i * 4] = Math.round(cell[i][0]); raw[i * 4 + 1] = Math.round(cell[i][1]); raw[i * 4 + 2] = Math.round(cell[i][2]); raw[i * 4 + 3] = 255; }
// 4) 额头近白高光会让泛洪从两耳之间漏进脸里：把脸部行(格 9..15, 列<=27)内短缺口补回
for (let y = 9; y <= 15; y++) { let f = -1, l = -1; for (let x = 0; x <= 27; x++) if (raw[(y * CW + x) * 4 + 3]) { if (f < 0) f = x; l = x; } for (let x = f; x <= l; x++) { const i = y * CW + x; if (!raw[i * 4 + 3]) { raw[i * 4] = Math.round(cell[i][0]); raw[i * 4 + 1] = Math.round(cell[i][1]); raw[i * 4 + 2] = Math.round(cell[i][2]); raw[i * 4 + 3] = 255; } } }
// 5) 裁到包围盒
let x0 = CW, y0 = CH, x1 = 0, y1 = 0; for (let k = 0; k < CW * CH; k++) if (raw[k * 4 + 3]) { const x = k % CW, y = (k / CW) | 0; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
const w = x1 - x0 + 1, h = y1 - y0 + 1;
const px = [], idx = [];
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const k = ((y + y0) * CW + x + x0) * 4; if (raw[k + 3]) { px.push([raw[k], raw[k + 1], raw[k + 2]]); idx.push(y * w + x); } }
// 6) 去 JPEG 噪点：K 色量化（最远点初始化以保住眼睛深色/高光等稀有色）
const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
let cs = [px.reduce((s, p) => [s[0] + p[0] / px.length, s[1] + p[1] / px.length, s[2] + p[2] / px.length], [0, 0, 0])];
const dm = px.map((p) => d2(p, cs[0]));
while (cs.length < K) { let bi = 0; dm.forEach((d, i) => { if (d > dm[bi]) bi = i; }); cs.push(px[bi].slice()); px.forEach((p, i) => { dm[i] = Math.min(dm[i], d2(p, px[bi])); }); }
for (let it = 0; it < 20; it++) { const sum = cs.map(() => [0, 0, 0, 0]); for (const p of px) { let b = 0, bd = 1e18; cs.forEach((c, i) => { const d = d2(c, p); if (d < bd) { bd = d; b = i; } }); sum[b][0] += p[0]; sum[b][1] += p[1]; sum[b][2] += p[2]; sum[b][3]++; } cs = sum.map((s, i) => s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : cs[i]); }
cs = cs.map((c) => c.map(Math.round));
const rgba = Buffer.alloc(w * h * 4);
px.forEach((p, i) => { let b = 0, bd = 1e18; cs.forEach((c, j) => { const d = d2(c, p); if (d < bd) { bd = d; b = j; } }); const o = idx[i] * 4; rgba[o] = cs[b][0]; rgba[o + 1] = cs[b][1]; rgba[o + 2] = cs[b][2]; rgba[o + 3] = 255; });
// 6b) 用户要求：清掉尾巴下方臀部右侧那片近 #f5e2f6 的浅色三角毛（原图自带，深底上像一块补丁）
for (let y = 22; y <= 28; y++) for (let x = 43; x < w; x++) { const o = (y * w + x) * 4; if (rgba[o + 3] && Math.hypot(rgba[o] - 0xf5, rgba[o + 1] - 0xe2, rgba[o + 2] - 0xf6) < 22) rgba[o + 3] = 0; }
const png = (buf, ww, hh) => sharp(buf, {raw: {width: ww, height: hh, channels: 4}}).png({palette: true, colours: K, compressionLevel: 9, effort: 10});
await png(rgba, w, h).toFile(out('cat-native.png'));
for (const m of [2, 4, 12]) await sharp(out('cat-native.png')).resize({width: w * m, kernel: 'nearest'}).png().toFile(out(`cat-native-${m}x.png`));
await sharp(out('cat-native.png')).flatten({background: {r: 40, g: 30, b: 70}}).resize({width: w * 12, kernel: 'nearest'}).png().toFile(out('cat-native-12x-dark.png'));
// 7) 画布 66×54：页面 2× = 132×108（同 B 的盒子），面板 1× = 66×54 居中放进 88×72 盒子
const CVW = 66, CVH = 54, OX = Math.floor((CVW - w) / 2), OY = CVH - h - 4;
const canvas = Buffer.alloc(CVW * CVH * 4);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const s = (y * w + x) * 4, d = ((y + OY) * CVW + x + OX) * 4; canvas[d] = rgba[s]; canvas[d + 1] = rgba[s + 1]; canvas[d + 2] = rgba[s + 2]; canvas[d + 3] = rgba[s + 3]; }
await png(canvas, CVW, CVH).toFile(out('cat-canvas.png'));
// 可选：脚下 1 行像素影子版本（仅评估用）
const shadow = Buffer.from(canvas); const sy = OY + h; // 脚底下一行
for (let x = OX + 10; x < OX + w - 6; x++) { const d = ((sy) * CVW + x) * 4; if (!shadow[d + 3]) { shadow[d] = 0x16; shadow[d + 1] = 0x11; shadow[d + 2] = 0x2a; shadow[d + 3] = 150; } }
await sharp(shadow, {raw: {width: CVW, height: CVH, channels: 4}}).png({palette: true, colours: K + 1, compressionLevel: 9, effort: 10}).toFile(out('cat-canvas-shadow.png'));
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(out(f)).toString('base64');
const uris = {cat: b64('cat-canvas.png'), catShadow: b64('cat-canvas-shadow.png')};
fs.writeFileSync(out('data-uris.json'), JSON.stringify(uris));
const report = {source: 'art-references/nso-steam-ss-04.jpg', crop: {left: X0, top: Y0, width: W, height: H}, nativeGrid: '2x2 (960x540 canvas)', nativeSize: [w, h], bboxInCells: [x0, y0, x1, y1], palette: cs.map((c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')), canvas: [CVW, CVH, OX, OY], bytes: {native: fs.statSync(out('cat-native.png')).size, canvas: fs.statSync(out('cat-canvas.png')).size, dataUri: uris.cat.length}};
fs.writeFileSync(out('cat-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
