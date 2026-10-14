// R97 Q5 — writes cand-*.svg and candidates.png (comparison board).
// Run: PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node build-board.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import { CANDIDATES, PAL, toSvg } from './grids.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(here, '..');
const design = path.resolve(assets, '..');
const sharp = createRequire(import.meta.url)('/tmp/dsh-theme-tools/node_modules/sharp');

const uri = svg => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
const font = (await fs.readFile(path.join(design, 'fonts/fusion-pixel-zh-subset.woff2'))).toString('base64');
const s6 = await fs.readFile(path.join(assets, 'dist/s6-bow-24x16.svg'), 'utf8');

// 1) candidate SVGs
for (const c of CANDIDATES) {
  c.w = c.rows[0].length; c.h = c.rows.length;
  c.svg = toSvg(c.rows, `R97 charm candidate ${c.id}: ${c.en} ${c.w}x${c.h}`);
  c.file = `cand-${c.id}-${c.slug}.svg`;
  c.colors = new Set(c.rows.join('').replace(/\./g, '')).size;
  await fs.writeFile(path.join(here, c.file), c.svg + '\n');
}

// 2) 1x scenes (real CSS: same box as settings-pixel.css:80, only the paint differs)
const BAR_W = 168, BAR_H = 32;
const sceneCss = `
@font-face{font-family:"WD Pixel CJK";src:url(data:font/woff2;base64,${font})}
*{box-sizing:border-box;margin:0}
body{background:#16112a;padding:8px;font-smooth:never;-webkit-font-smoothing:none}
.card{width:${BAR_W + 2}px;border:1px solid #6c5ce0;background:#201936}
.hd{position:relative;height:${BAR_H}px;background:#2f2552;border-bottom:1px solid #16112a;box-shadow:inset 0 1px #fdf4ff;
  padding-left:36px;display:flex;align-items:center;color:#f2ebff;font:12px/12px "WD Pixel CJK";}
.hd::before{content:"";position:absolute;left:7px;top:calc(50% - 8px);width:24px;height:16px;pointer-events:none}
.cur::before{background-color:#ffb8e6;-webkit-mask:url(${uri(s6)}) 0 0/24px 16px no-repeat;mask:url(${uri(s6)}) 0 0/24px 16px no-repeat}
${CANDIDATES.map(c => `.c${c.id}::before{background:url(${uri(c.svg)}) center/${c.w}px ${c.h}px no-repeat;image-rendering:pixelated}`).join('\n')}
`;
const browser = await chromium.launch({ args: ['--disable-lcd-text', '--font-render-hinting=none'] });
const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 400, height: 200 } });
const scenes = {};
for (const key of ['cur', ...CANDIDATES.map(c => 'c' + c.id)]) {
  await page.setContent(`<style>${sceneCss}</style><div class="card"><div class="hd ${key}">外观</div></div>`);
  await page.evaluate(() => document.fonts.ready);
  scenes[key] = await page.locator('.card').screenshot();
}

// crispness audit: inside the 24x16 charm box only palette / bar colours may appear
const allowed = new Set([...Object.values(PAL), '#2f2552', '#fdf4ff'].map(s => s.toLowerCase()));
const audit = {};
for (const [key, png] of Object.entries(scenes)) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const top = 1 + Math.floor(BAR_H / 2) - 8, left = 1 + 7; // +1 card border
  const seen = new Set(); let foreign = 0;
  for (let y = top; y < top + 16; y++) for (let x = left; x < left + 24; x++) {
    const i = (y * info.width + x) * 3;
    const hex = '#' + [0, 1, 2].map(j => data[i + j].toString(16).padStart(2, '0')).join('');
    seen.add(hex); if (!allowed.has(hex)) foreign++;
  }
  audit[key] = { distinctColours: seen.size, offPalettePixels: foreign };
}

// 3) board
const metaRows = [
  { key: 'cur', no: '对照', name: '现版 s6 蝴蝶结', en: 'current --jk-mask-s6',
    src: 'dist/s6-bow-24x16.svg（贝塞尔曲线，无 crispEdges）', used: '是：settings-pixel.css:80', kind: '单色 mask #ffb8e6', size: '24×16' },
  ...CANDIDATES.map(c => ({ key: 'c' + c.id, no: '#' + c.id, name: c.name, en: c.en, src: c.source,
    used: c.used, kind: `多色 ${c.colors} 色 · background-image`, size: `${c.w}×${c.h}` })),
];
const sceneW = BAR_W + 2, sceneH = BAR_H + 2;
const img = (buf, z) => `<img src="data:image/png;base64,${buf.toString('base64')}" style="width:${sceneW * z}px;height:${sceneH * z}px">`;
const sprite = c => c ? `<img src="${uri(c.svg)}" style="width:${c.w * 4}px;height:${c.h * 4}px">` : '';
const boardHtml = `<!doctype html><meta charset=utf-8><style>
*{box-sizing:border-box;margin:0}
body{background:#16112a;color:#f2ebff;font:14px/1.45 "Noto Sans CJK SC","Noto Sans SC","Noto Serif CJK SC",sans-serif;padding:20px 24px;width:1320px}
h1{font-size:20px;color:#ffb8e6;margin-bottom:2px}
.sub{color:#b9add9;font-size:13px;margin-bottom:14px}
.row{display:grid;grid-template-columns:330px 184px 696px;gap:0 20px;align-items:center;padding:10px 0;border-top:1px dashed #4a3784}
.row.cur{background:#201936;outline:1px solid #7a3f6d}
.no{font-size:20px;color:#ff7fcf;font-weight:700}
.nm{font-size:17px;font-weight:700}.en{color:#b9add9;font-size:12px;margin-left:6px}
.meta{font-size:12px;color:#cdb0e8}.meta b{color:#fdf4ff;font-weight:600}
img{image-rendering:pixelated;display:block}
.cap{font-size:11px;color:#8f7fe0;margin-top:3px}
</style>
<h1>R97 Q5 · 设置卡片标题挂饰候选（先选再实现）</h1>
<div class="sub">场景 = 真实 CSS：深紫标题栏 #2f2552 + 1px #fdf4ff 顶高光 + 1px #16112a 底线，挂饰盒 left:7px · 24×16（候选居中于盒内），标题“外观”WD Pixel CJK 12px #f2ebff，文字 x=36px。左列 1× 实际像素，右列同一截图 4× 最近邻放大。</div>
${metaRows.map(r => `<div class="row ${r.key === 'cur' ? 'cur' : ''}">
  <div><div><span class="no">${r.no}</span> <span class="nm">${r.name}</span><span class="en">${r.en}</span></div>
  <div class="meta"><b>尺寸</b> ${r.size} · <b>${r.kind}</b></div>
  <div class="meta"><b>来源</b> ${r.src}</div>
  <div class="meta"><b>主题内已用</b> ${r.used}</div></div>
  <div>${img(scenes[r.key], 1)}<div class="cap">1× 实际</div></div>
  <div>${img(scenes[r.key], 4)}<div class="cap">4× 最近邻 · 晶格审计：盒内 ${audit[r.key].distinctColours} 色，非调色板像素 ${audit[r.key].offPalettePixels}</div></div>
</div>`).join('\n')}
`;
const board = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1320, height: 400 } });
await board.setContent(boardHtml);
await board.evaluate(() => document.fonts.ready);
const out = path.join(here, 'candidates.png');
await board.screenshot({ path: out, fullPage: true });
await browser.close();
const meta = await sharp(out).metadata();
console.log(JSON.stringify({ out, width: meta.width, height: meta.height, audit,
  files: CANDIDATES.map(c => ({ file: c.file, size: `${c.w}x${c.h}`, colours: c.colors, bytes: c.svg.length })) }, null, 2));
