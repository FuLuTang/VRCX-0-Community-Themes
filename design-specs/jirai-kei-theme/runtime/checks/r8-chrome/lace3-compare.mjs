// task-47 · lace3 对比图：现版 / A / B。
// 场景用真实 ::before 几何（window-chrome.css:151-163 + chrome-r8.css:119-128）在 Chromium DPR1 下渲染，
// 再用 sharp 最近邻放大 6×。输出 lace3-compare.png（任一边 ≤2000px）。
// 运行：PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node lace3-compare.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import { currentSvg, svgA, svgB } from './lace3-generate.mjs';

const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const here = path.dirname(fileURLToPath(import.meta.url));
// 单引号：要放进 style="" 属性里
const uri = s => `url('data:image/svg+xml;base64,${Buffer.from(s).toString('base64')}')`;

export const SCENE_W = 80, SCENE_H = 26, BAR_H = 10; // 4 个 20px 周期；状态栏 10px（含 1px 同色 border-top）
export const VARIANTS = [
  { id: 'current', label: '现版 CURRENT · 外描边 + 孔眼涂实 + 竖纹', svg: currentSvg },
  { id: 'A', label: 'A · 内描边 #D97FC6 · 孔眼镂空（默认）', svg: svgA },
  { id: 'B', label: 'B · 内描边 #F3ADD9 · 孔眼镂空（备选）', svg: svgB },
];
export function sceneHtml(offset = 0) {
  return `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;background:#000}
.win{position:relative;width:${SCENE_W}px;height:${SCENE_H}px;background:#201936;overflow:hidden;margin:0 0 4px}
.vrcx-0-statusbar{position:absolute;left:0;right:0;bottom:0;height:${BAR_H}px;box-sizing:border-box;background:#f9d1e7;border-top:1px solid #f9d1e7}
/* window-chrome.css:151-163 几何 */
.vrcx-0-statusbar::before{content:'';position:absolute;right:0;bottom:100%;left:0;height:8px;pointer-events:none;transform:scaleY(-1);
/* chrome-r8.css:119-128 paint */
background-color:transparent;background-image:var(--tile);background-repeat:repeat-x;background-position:${offset}px center;background-size:20px 8px;image-rendering:pixelated;-webkit-mask:none;mask:none}
</style>${VARIANTS.map(v => `<div class="win" id="${v.id}"><div class="vrcx-0-statusbar" style="--tile:${uri(v.svg)}"></div></div>`).join('')}`;
}
export async function renderScenes(offset = 0) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 200, height: 200 }, deviceScaleFactor: 1 });
    await page.setContent(sceneHtml(offset), { waitUntil: 'load' });
    await page.waitForTimeout(400); // data: 背景图异步解码，等它画上
    const out = {};
    for (const v of VARIANTS) out[v.id] = await page.locator('#' + v.id).screenshot({ animations: 'disabled' });
    return out;
  } finally { await browser.close(); }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const shots = await renderScenes(0);
  const S = 6, PAD = 16, LABEL_H = 22, GAP = 16;
  const bigW = SCENE_W * S, bigH = SCENE_H * S;
  const rowH = LABEL_H + bigH;
  const W = PAD + SCENE_W + GAP + bigW + PAD, Hh = PAD + 24 + VARIANTS.length * (rowH + PAD);
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const comps = [];
  let text = `<text x="${PAD}" y="${PAD + 12}" fill="#fff1f8" font-size="13" font-family="sans-serif">上=窗底 #201936 · 下=状态栏 #f9d1e7 · 左 1× 右 6× · 真实 ::before 几何</text>`;
  for (const [i, v] of VARIANTS.entries()) {
    const y0 = PAD + 24 + i * (rowH + PAD);
    text += `<text x="${PAD}" y="${y0 + 15}" fill="#f3add9" font-size="13" font-family="sans-serif">${esc(v.label)}</text>`;
    comps.push({ input: shots[v.id], left: PAD, top: y0 + LABEL_H });
    const big = await sharp(shots[v.id]).resize(bigW, bigH, { kernel: 'nearest' }).png().toBuffer();
    comps.push({ input: big, left: PAD + SCENE_W + GAP, top: y0 + LABEL_H });
    // 6× 图下方标出 20px 周期边界（x=0/20/40/60）刻度，便于检查竖纹
    for (let p = 0; p <= SCENE_W; p += 20) text += `<rect x="${PAD + SCENE_W + GAP + p * S - (p === SCENE_W ? 1 : 0)}" y="${y0 + LABEL_H + bigH + 1}" width="1" height="5" fill="#8a7aa8"/>`;
  }
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Hh}">${text}</svg>`);
  const outPath = path.join(here, 'lace3-compare.png');
  await sharp({ create: { width: W, height: Hh, channels: 4, background: '#100c1b' } })
    .composite([{ input: overlay, left: 0, top: 0 }, ...comps]).png().toFile(outPath);
  for (const v of VARIANTS) await fs.writeFile(path.join(here, `lace3-scene-${v.id}-1x.png`), shots[v.id]);
  const meta = await sharp(outPath).metadata();
  if (meta.width > 2000 || meta.height > 2000) throw new Error(`对比图超 2000px: ${meta.width}×${meta.height}`);
  console.log(JSON.stringify({ outPath, width: meta.width, height: meta.height }));
}
