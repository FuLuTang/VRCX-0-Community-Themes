// task-47 · lace3 逐像素断言。
// 运行：PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node lace3-verify.mjs
// 1) SVG 光栅（sharp，20×8）层面：孔眼 alpha=0、外轮廓 ⊆ 现版、描边全部在布面内且只在内缘、
//    x0/x19 无孤立描边、贴状态栏行满宽布面色、体积。
// 2) Chromium 真实 ::before 几何（bottom:100%;height:8px;scaleY(-1)）场景：逐像素 = 翻转后的 tile 叠在 #201936 上，
//    证明 SVG 第 0 行贴状态栏、扇贝尖朝上；并在动画半周期偏移 10px 时同样成立。
// 现版 tile 也跑同一套 tile 断言，预期失败（证明断言能抓到旧错误）。
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { FACE, STROKE_A, STROKE_B, HOLES, GRID, currentSvg, svgA, svgB } from './lace3-generate.mjs';
import { renderScenes, VARIANTS, SCENE_W, SCENE_H, BAR_H } from './lace3-compare.mjs';

const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const here = path.dirname(fileURLToPath(import.meta.url));
const W = 20, H = 8;
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const WIN = '#201936';

async function raster(svg) {
  const { data, info } = await sharp(Buffer.from(svg), { density: 72 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== W || info.height !== H) throw new Error(`栅格尺寸 ${info.width}×${info.height}`);
  return (x, y) => { const i = (y * W + x) * 4; return [data[i], data[i + 1], data[i + 2], data[i + 3]]; };
}
const same = (p, h) => p[3] === 255 && hex(h).every((v, i) => p[i] === v);
const wrap = x => (x + W) % W;

async function checkTile(name, svg, stroke) {
  const px = await raster(svg);
  const cur = await raster(currentSvg);
  const results = [];
  const ok = (id, pass, detail = '') => results.push({ id, pass: !!pass, detail });
  const cls = (x, y) => { const p = px(x, y); return p[3] === 0 ? '.' : same(p, FACE) ? 'o' : same(p, stroke) ? '#' : '?'; };
  const rows = [...Array(H).keys()].map(y => [...Array(W).keys()].map(x => cls(x, y)).join(''));
  const opaque = (x, y) => y >= 0 && y < H && px(wrap(x), y)[3] > 0;

  ok('palette-only', !rows.join('').includes('?') && [...Array(H * W).keys()].every(i => { const a = px(i % W, (i / W) | 0)[3]; return a === 0 || a === 255; }),
    '每个像素只能是 布面/描边/全透明，alpha 只有 0 或 255');
  // 孔眼
  const holePx = HOLES.flatMap(([x, y, w, h]) => [...Array(w * h).keys()].map(k => [x + (k % w), y + ((k / w) | 0)]));
  const badHole = holePx.filter(([x, y]) => px(x, y)[3] !== 0);
  ok('holes-alpha-0', badHole.length === 0, badHole.length ? `不透明孔眼像素 ${JSON.stringify(badHole)}` : `${holePx.length} 个孔眼像素 alpha=0`);
  // 孔眼 ≥2×2 且被布面四面包住（不是外侧缺口），描边后孔径不变 = 孔眼像素全透明 + 孔周第一圈全不透明
  const ringBad = [];
  for (const [x0, y0, w, h] of HOLES) {
    if (w < 2 || h < 2) ringBad.push(`hole ${x0},${y0} 小于 2×2`);
    for (let x = x0; x < x0 + w; x++) { if (!opaque(x, y0 - 1)) ringBad.push([x, y0 - 1]); if (!opaque(x, y0 + h)) ringBad.push([x, y0 + h]); }
    for (let y = y0; y < y0 + h; y++) { if (!opaque(x0 - 1, y)) ringBad.push([x0 - 1, y]); if (!opaque(x0 + w, y)) ringBad.push([x0 + w, y]); }
  }
  ok('holes-2x2-enclosed-size-kept', ringBad.length === 0, ringBad.length ? JSON.stringify(ringBad) : '3 个 2×2 孔，四周都是布面（孔径未被描边吃掉、也没被扩大）');
  // 现版孔位沿用
  const oldGroups = { left: [[5, 3], [6, 3], [5, 4]], center: [[9, 2], [10, 2], [9, 4], [10, 4], [9, 5], [10, 5]], right: [[13, 3], [14, 3], [14, 4]] };
  const groupHit = Object.fromEntries(Object.entries(oldGroups).map(([k, g]) => [k, g.filter(([x, y]) => px(x, y)[3] === 0).length + '/' + g.length]));
  ok('old-hole-positions-reused', Object.values(groupHit).every(s => !s.startsWith('0/')), JSON.stringify(groupHit));
  // 外轮廓不大于现版
  const grow = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (px(x, y)[3] > 0 && cur(x, y)[3] === 0) grow.push([x, y]);
  ok('outline-not-larger-than-current', grow.length === 0, grow.length ? `比现版多出 ${JSON.stringify(grow)}` : '不透明区域 ⊆ 现版（布面∪外描边）');
  // 描边只在布面内缘：每个描边像素不透明且 4 邻（水平环绕，y=8 视为外侧）有透明像素；第 0 行不描
  const strokeBad = [], interiorStroke = [], missingStroke = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = rows[y][x];
    const edge = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some(([a, b]) => b < 0 ? false : !opaque(a, b));
    if (c === '#' && px(x, y)[3] !== 255) strokeBad.push([x, y]);
    if (c === '#' && (!edge || y === 0)) interiorStroke.push([x, y]);
    if (c === 'o' && edge && y > 0) missingStroke.push([x, y]);
  }
  ok('stroke-inside-cloth', strokeBad.length === 0 && interiorStroke.length === 0,
    `描边像素全部不透明且位于布面最内缘：越界 ${JSON.stringify(strokeBad)}，非边缘描边 ${JSON.stringify(interiorStroke)}`);
  ok('stroke-ring-complete', missingStroke.length === 0, missingStroke.length ? `漏描 ${JSON.stringify(missingStroke)}` : '布面外缘与孔周一圈全部为描边色（第 0 行除外）');
  // x0/x19 无孤立描边（竖纹）：这两列的描边像素必须在 tile 内部就贴着透明像素（真实轮廓），且在 tile 内有 8 邻描边相连
  const seamBad = [];
  for (const x of [0, W - 1]) for (let y = 0; y < H; y++) {
    if (rows[y][x] !== '#') continue;
    const inTileEdge = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some(([a, b]) => a >= 0 && a < W && b < H && b >= 0 && px(a, b)[3] === 0 || b >= H);
    const linked = [-1, 0, 1].some(dy => [-1, 0, 1].some(dx => (dx || dy) && x + dx >= 0 && x + dx < W && y + dy >= 0 && y + dy < H && rows[y + dy][x + dx] === '#'));
    if (!inTileEdge || !linked) seamBad.push([x, y]);
  }
  ok('no-seam-stripe-x0-x19', seamBad.length === 0, seamBad.length ? `孤立/非轮廓描边 ${JSON.stringify(seamBad)}` : `x0 列 ${rows.map(r => r[0]).join('')} / x19 列 ${rows.map(r => r[W - 1]).join('')}`);
  // 贴状态栏行（SVG y=0）满宽布面色；无底线
  ok('seam-row-full-face', [...Array(W).keys()].every(x => same(px(x, 0), FACE)), `y=0: ${rows[0]}`);
  ok('no-bottom-line', !rows.some(r => /^#+$/.test(r)), '没有整行描边');
  // 源码约束
  const paths = svg.match(/<path /g) || [];
  ok('svg-crisp-one-path-per-color', /shape-rendering="crispEdges"/.test(svg) && paths.length === 2, `${paths.length} 个 path`);
  const b64 = Buffer.from(svg).toString('base64').length;
  ok('base64-le-1200', b64 <= 1200, `base64 ${b64} 字符，SVG ${Buffer.byteLength(svg)} B`);
  return { name, rows, results, pass: results.every(r => r.pass) };
}

async function checkScene(offset) {
  const shots = await renderScenes(offset);
  const out = {};
  const seamY = SCENE_H - BAR_H; // 状态栏 border-top 行；::before 底边落在 padding-box 顶 = seamY+1，故 tile 第 0 行在 seamY
  for (const v of VARIANTS) {
    const tile = await raster(v.svg);
    const { data, info } = await sharp(shots[v.id]).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const at = (x, y) => { const i = (y * info.width + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
    const bad = [];
    for (let r = 0; r < H; r++) for (let x = 0; x < SCENE_W; x++) {
      const t = tile(wrap(x - offset), r);
      const exp = t[3] === 0 ? hex(WIN) : t.slice(0, 3);
      const got = at(x, seamY - r);
      if (got.some((c, i) => Math.abs(c - exp[i]) > 1)) bad.push({ x, y: seamY - r, r, exp, got });
    }
    const above = [...Array(SCENE_W).keys()].every(x => at(x, seamY - H).every((c, i) => c === hex(WIN)[i]));
    const below = [...Array(SCENE_W).keys()].every(x => at(x, seamY + 1).every((c, i) => c === hex(FACE)[i]));
    out[v.id] = { flippedTileMatches: bad.length === 0, mismatches: bad.slice(0, 5), rowAboveLaceIsWindow: above, rowBelowSeamIsBar: below };
  }
  return out;
}

const tiles = [await checkTile('A', svgA, STROKE_A), await checkTile('B', svgB, STROKE_B), await checkTile('current(预期失败)', currentSvg, STROKE_A)];
const gridMatch = tiles[0].rows.join('\n') === GRID.join('\n');
const scenes = { offset0: await checkScene(0), offset10: await checkScene(10) };
const sceneOk = Object.values(scenes).every(s => ['A', 'B'].every(k => s[k].flippedTileMatches && s[k].rowAboveLaceIsWindow && s[k].rowBelowSeamIsBar));
const report = {
  pass: tiles[0].pass && tiles[1].pass && !tiles[2].pass && gridMatch && sceneOk,
  gridMatchesGenerator: gridMatch,
  tiles: tiles.map(t => ({ name: t.name, pass: t.pass, rows: t.rows, failed: t.results.filter(r => !r.pass).map(r => r.id), results: t.results })),
  scenes,
  orientation: 'Chromium DPR1：场景第 (seamY-r) 行 = SVG 第 r 行（scaleY(-1)），seamY=状态栏 border-top 行；SVG y=0 贴状态栏，y=7 扇贝尖朝上。',
};
await fs.writeFile(path.join(here, 'lace3-verify.json'), JSON.stringify(report, null, 1) + '\n');
for (const t of tiles) {
  console.log(`\n[${t.pass ? 'PASS' : 'FAIL'}] ${t.name}`);
  for (const r of t.results) console.log(`  ${r.pass ? '✔' : '✘'} ${r.id} — ${r.detail}`);
}
console.log('\nscene:', JSON.stringify(Object.fromEntries(Object.entries(scenes).map(([k, s]) => [k, Object.fromEntries(Object.entries(s).map(([v, o]) => [v, o.flippedTileMatches && o.rowAboveLaceIsWindow && o.rowBelowSeamIsBar]))]))));
console.log(`\nOVERALL ${report.pass ? 'PASS' : 'FAIL'}`);
process.exitCode = report.pass ? 0 : 1;
