#!/usr/bin/env node
// hand-batch2.mjs — 手工逐格修整的 16x16 像素图标（batch 2）
// 底稿来自 /tmp/icon-top-grids.json（Lucide, ISC）；本文件内为此批修整后的最终网格。
// 风格约定：线宽以 2 格为主（细节处 1 格），去毛刺、无孤立点、左右对称图形保持对称、四周留 0~1 格。
//
// 运行：
//   node hand-batch2.mjs             -> 在本目录 src-hand/ 下写出 <name>.svg
//   node hand-batch2.mjs --compare   -> 额外生成 ../screenshots/icon-polish-batch2.png（底稿 vs 修后，6x 并排）
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { grids as R8_GRIDS } from './hand-r8.mjs';

// 'X' = 实心格, '.' = 透明
const ICONS = {
  // 右侧面板 + 指向左的箭头；框 2 格线，箭头 2 格宽斜线（原底稿箭头端点有单格毛刺）
  'panel-right-open': [
    '................',
    '..XXXXXXXXXXXX..',
    '.XXXXXXXXXXXXXX.',
    '.XX......XX..XX.',
    '.XX......XX..XX.',
    '.XX...XX.XX..XX.',
    '.XX..XX..XX..XX.',
    '.XX.XX...XX..XX.',
    '.XX.XX...XX..XX.',
    '.XX..XX..XX..XX.',
    '.XX...XX.XX..XX.',
    '.XX......XX..XX.',
    '.XX......XX..XX.',
    '.XXXXXXXXXXXXXX.',
    '..XXXXXXXXXXXX..',
    '................',
  ],
  // 左箭头 + 右侧竖线；斜臂由 3 格台阶收成 2 格宽，去锯齿
  'arrow-left-from-line': [
    '................',
    '................',
    '................',
    '.............XX.',
    '....XX.......XX.',
    '...XX........XX.',
    '..XX.........XX.',
    '.XXXXXXXXXXXXXX.',
    '.XXXXXXXXXXXXXX.',
    '..XX.........XX.',
    '...XX........XX.',
    '....XX.......XX.',
    '.............XX.',
    '................',
    '................',
    '................',
  ],
  'arrow-right-to-line': [
    '................',
    '................',
    '................',
    '.XX.............',
    '.XX.......XX....',
    '.XX........XX...',
    '.XX.........XX..',
    '.XXXXXXXXXXXXXX.',
    '.XXXXXXXXXXXXXX.',
    '.XX.........XX..',
    '.XX........XX...',
    '.XX.......XX....',
    '.XX.............',
    '................',
    '................',
    '................',
  ],
  // 单横杠：与 plus 的横杠同长（10 格），居中对称
  'minus': [
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '...XXXXXXXXXX...',
    '...XXXXXXXXXX...',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
  ],
  // 底稿已合格：2 格线 + 1 格切角的圆角方框，保持原样
  'square': [
    '................',
    '..XXXXXXXXXXXX..',
    '.XXXXXXXXXXXXXX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XXXXXXXXXXXXXX.',
    '..XXXXXXXXXXXX..',
    '................',
  ],
  // 两张错位纸：后纸只留「顶边 + 左边」，前纸完整圆角框（原底稿两纸糊在一起）
  'copy': [
    '................',
    '..XXXXXXXXX.....',
    '.XXXXXXXXXXX....',
    '.XX.............',
    '.XX.............',
    '.XX...XXXXXXXX..',
    '.XX..XXXXXXXXXX.',
    '.XX..XX......XX.',
    '.XX..XX......XX.',
    '.XX..XX......XX.',
    '.XX..XX......XX.',
    '.XX..XX......XX.',
    '.XX..XX......XX.',
    '.....XXXXXXXXXX.',
    '......XXXXXXXX..',
    '................',
  ],
  // 交叉线统一 2 格宽，中心自然收成 2 格
  'x': [
    '................',
    '................',
    '................',
    '...XX......XX...',
    '....XX....XX....',
    '.....XX..XX.....',
    '......XXXX......',
    '.......XX.......',
    '.......XX.......',
    '......XXXX......',
    '.....XX..XX.....',
    '....XX....XX....',
    '...XX......XX...',
    '................',
    '................',
    '................',
  ],
  // 人（头 8x8 圆 + 左肩弧）+ 右下放大镜（1 格线细节）
  'user-search': [
    '................',
    '...XXXX.........',
    '..XX..XX........',
    '.XX....XX.......',
    '.XX....XX.......',
    '.XX....XX.......',
    '.XX....XX.......',
    '..XX..XX..XX....',
    '...XXXX..X..X...',
    '........X....X..',
    '...XXXX.X....X..',
    '..XX..XX.X..X...',
    '.XX....XX.XXXX..',
    '.XX....XX....XX.',
    '.XX....XX.......',
    '................',
  ],
  // 圆头 + 宽半圆肩；肩比 user 更宽更圆以作区分
  'user-round': [
    '................',
    '......XXXX......',
    '.....XX..XX.....',
    '....XX....XX....',
    '....XX....XX....',
    '....XX....XX....',
    '....XX....XX....',
    '.....XX..XX.....',
    '......XXXX......',
    '................',
    '.....XXXXXX.....',
    '...XX......XX...',
    '..XX........XX..',
    '.XX..........XX.',
    '.XX..........XX.',
    '................',
  ],
  // 三条轨道（左右端对齐）+ 三个 2 格宽手柄，手柄高度统一 6 格并错落分布
  'sliders-horizontal': [
    '................',
    '.........XX.....',
    '.........XX.....',
    '.XXXXXXX.XX.XXX.',
    '.XXXXXXX.XX.XXX.',
    '....XX...XX.....',
    '....XX...XX.....',
    '.XX.XX.XXXXXXXX.',
    '.XX.XX.XXXXXXXX.',
    '....XX....XX....',
    '....XX....XX....',
    '.XXXXXXXX.XX.XX.',
    '.XXXXXXXX.XX.XX.',
    '..........XX....',
    '..........XX....',
    '................',
  ],
  // 底稿已合格：10x10 十字，横竖各 2 格，居中，保持原样
  'plus': [
    '................',
    '................',
    '................',
    '.......XX.......',
    '.......XX.......',
    '.......XX.......',
    '.......XX.......',
    '...XXXXXXXXXX...',
    '...XXXXXXXXXX...',
    '.......XX.......',
    '.......XX.......',
    '.......XX.......',
    '.......XX.......',
    '................',
    '................',
    '................',
  ],
  'chevron-down': [
    '................',
    '................',
    '................',
    '................',
    '................',
    '...XX......XX...',
    '....XX....XX....',
    '.....XX..XX.....',
    '......XXXX......',
    '.......XX.......',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
  ],
  'chevron-up': [
    '................',
    '................',
    '................',
    '................',
    '................',
    '.......XX.......',
    '......XXXX......',
    '.....XX..XX.....',
    '....XX....XX....',
    '...XX......XX...',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
  ],
  'chevron-right': [
    '................',
    '................',
    '................',
    '.....XX.........',
    '......XX........',
    '.......XX.......',
    '........XX......',
    '.........XX.....',
    '.........XX.....',
    '........XX......',
    '.......XX.......',
    '......XX........',
    '.....XX.........',
    '................',
    '................',
    '................',
  ],
  'chevron-left': [
    '................',
    '................',
    '................',
    '.........XX.....',
    '........XX......',
    '.......XX.......',
    '......XX........',
    '.....XX.........',
    '.....XX.........',
    '......XX........',
    '.......XX.......',
    '........XX......',
    '.........XX.....',
    '................',
    '................',
    '................',
  ],
  // R8: 两段相对顺时针弧箭头，右上向下/左下向上；避免旧缺口圆像炸弹。
  'refresh-cw': R8_GRIDS['refresh-cw'],
  // 三个 2x2 点，等距对称居中（原底稿中间点 2 格、两侧 3 格，不统一）
  'ellipsis': [
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '.XX....XX....XX.',
    '.XX....XX....XX.',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
  ],
  // 对勾：短臂 + 长臂均 2 格宽，去掉右上单格毛刺
  'check': [
    '................',
    '................',
    '................',
    '................',
    '................',
    '...........XX...',
    '..XX.....XX.....',
    '...XX...XX......',
    '....XX.XX.......',
    '.....XXXX.......',
    '......XX........',
    '................',
    '................',
    '................',
    '................',
    '................',
  ],
  // 外圆环 + 竖直椭圆经线（上下收窄）+ 赤道 2 格
  'globe': [
    '................',
    '.....XXXXXX.....',
    '...XX......XX...',
    '..XX..XXXX..XX..',
    '.XX..XX..XX..XX.',
    '.XX..XX..XX..XX.',
    '.XX..XX..XX..XX.',
    '.XXXXXXXXXXXXXX.',
    '.XXXXXXXXXXXXXX.',
    '.XX..XX..XX..XX.',
    '.XX..XX..XX..XX.',
    '.XX..XX..XX..XX.',
    '..XX..XXXX..XX..',
    '...XX......XX...',
    '.....XXXXXX.....',
    '................',
  ],
  // 心形：实心外廓内缩 2 格得到 2 格宽描边，顶部凹陷、底部收尖
  'heart': [
    '................',
    '...XX......XX...',
    '..XXXX....XXXX..',
    '.XX..XX..XX..XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '.XX..........XX.',
    '..XX........XX..',
    '...XX......XX...',
    '....XX....XX....',
    '.....XX..XX.....',
    '......XXXX......',
    '.......XX.......',
    '................',
    '................',
  ],
  // 四块仪表盘面板：左上高、右上扁、左下扁、右下高（左列与右列上下错开）
  'layout-dashboard': [
    '................',
    '..XXXX....XXXX..',
    '.XXXXXX..XXXXXX.',
    '.XX..XX..XX..XX.',
    '.XX..XX..XXXXXX.',
    '.XX..XX...XXXX..',
    '.XX..XX.........',
    '.XXXXXX...XXXX..',
    '..XXXX...XXXXXX.',
    '.........XX..XX.',
    '..XXXX...XX..XX.',
    '.XXXXXX..XX..XX.',
    '.XX..XX..XX..XX.',
    '.XXXXXX..XXXXXX.',
    '..XXXX....XXXX..',
    '................',
  ],
  // 开口方框（右上留缺口）+ 右上角 L 形箭头 + 2 格宽斜杆
  'external-link': [
    '................',
    '.........XXXXX..',
    '.........XXXXX..',
    '............XX..',
    '..XXXXXXX..XXX..',
    '.XXXXXXXX.XX....',
    '.XX......XX.....',
    '.XX.....XX......',
    '.XX....XX.......',
    '.XX...XX....XX..',
    '.XX..XX.....XX..',
    '.XX.........XX..',
    '.XX.........XX..',
    '.XXXXXXXXXXXXX..',
    '..XXXXXXXXXXX...',
    '................',
  ],
  // 垃圾桶：1 格线提手 + 2 格盖 + 2 格桶身 + 两条 1 格竖纹
  'trash': [
    '................',
    '......XXXX......',
    '......X..X......',
    '......X..X......',
    '.XXXXXXXXXXXXXX.',
    '.XXXXXXXXXXXXXX.',
    '..XX........XX..',
    '..XX........XX..',
    '..XX..X..X..XX..',
    '..XX..X..X..XX..',
    '..XX..X..X..XX..',
    '..XX..X..X..XX..',
    '..XX..X..X..XX..',
    '..XXXXXXXXXXXX..',
    '..XXXXXXXXXXXX..',
    '................',
  ],
  // 小人：8x8 圆头 + 拱门肩（肩顶 8 格宽）
  'user': [
    '................',
    '......XXXX......',
    '.....XX..XX.....',
    '....XX....XX....',
    '....XX....XX....',
    '....XX....XX....',
    '....XX....XX....',
    '.....XX..XX.....',
    '......XXXX......',
    '................',
    '....XXXXXXXX....',
    '...XX......XX...',
    '..XX........XX..',
    '..XX........XX..',
    '..XX........XX..',
    '................',
  ],
  // 眼睛：椭圆眼眶 2 格 + 4x4 切角瞳孔
  'eye': [
    '................',
    '................',
    '................',
    '......XXXX......',
    '....XX....XX....',
    '..XX........XX..',
    '.XX....XX....XX.',
    '.XX...XXXX...XX.',
    '.XX...XXXX...XX.',
    '.XX....XX....XX.',
    '..XX........XX..',
    '....XX....XX....',
    '......XXXX......',
    '................',
    '................',
    '................',
  ],
};

// ---- 网格自检：16 行 x 16 列，只允许 X 和 . ----
for (const [name, rows] of Object.entries(ICONS)) {
  if (rows.length !== 16) throw new Error(`${name}: 需要 16 行，实际 ${rows.length}`);
  rows.forEach((row, y) => {
    if (row.length !== 16) throw new Error(`${name} 第 ${y} 行: 需要 16 列，实际 ${row.length}`);
    if (/[^X.]/.test(row)) throw new Error(`${name} 第 ${y} 行: 含非法字符`);
  });
}

// 每行的连续 'X' 段 -> M{x} {y}h{w}v1h-{w}
function toPath(rows) {
  const segs = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] === 'X') {
        let w = 1;
        while (x + w < row.length && row[x + w] === 'X') w++;
        segs.push(`M${x} ${y}h${w}v1h-${w}`);
        x += w;
      } else {
        x++;
      }
    }
  });
  return segs.join(' ');
}

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'src-hand');
mkdirSync(outDir, { recursive: true });

for (const [name, rows] of Object.entries(ICONS)) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">' +
    `<path fill="#000" d="${toPath(rows)}"/></svg>`;
  writeFileSync(join(outDir, `${name}.svg`), svg);
}
console.log(`hand-batch2: wrote ${Object.keys(ICONS).length} icons -> ${outDir}`);

// ---- 可选自检图：底稿 vs 修后，6x nearest，左右并排 ----
if (process.argv.includes('--compare')) {
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
  const DRAFT = JSON.parse(readFileSync('/tmp/icon-top-grids.json', 'utf8'));

  const S = 6;
  const GAP = 12;
  const PAD = 12;
  const COLS = 5;
  const pairW = 16 * S * 2 + GAP;
  const pairH = 16 * S;
  const names = Object.keys(ICONS);
  const rowsN = Math.ceil(names.length / COLS);
  const W = PAD + COLS * (pairW + PAD);
  const H = PAD + rowsN * (pairH + PAD);

  const BG = [0x20, 0x19, 0x36];
  const FG = [0xf2, 0xeb, 0xff];
  const buf = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    buf[i * 3] = BG[0];
    buf[i * 3 + 1] = BG[1];
    buf[i * 3 + 2] = BG[2];
  }
  const blit = (grid, ox, oy) => {
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        if (grid[y] === undefined || grid[y][x] !== 'X') continue;
        for (let dy = 0; dy < S; dy++) {
          for (let dx = 0; dx < S; dx++) {
            const px = ox + x * S + dx;
            const py = oy + y * S + dy;
            const i = (py * W + px) * 3;
            buf[i] = FG[0];
            buf[i + 1] = FG[1];
            buf[i + 2] = FG[2];
          }
        }
      }
    }
  };

  names.forEach((name, i) => {
    const cx = PAD + (i % COLS) * (pairW + PAD);
    const cy = PAD + Math.floor(i / COLS) * (pairH + PAD);
    blit(DRAFT[name], cx, cy); // 左：底稿
    blit(ICONS[name], cx + 16 * S + GAP, cy); // 右：修后
  });

  const shotDir = join(here, '..', 'screenshots');
  mkdirSync(shotDir, { recursive: true });
  const outPng = join(shotDir, 'icon-polish-batch2.png');
  await sharp(buf, { raw: { width: W, height: H, channels: 3 } }).png().toFile(outPng);
  console.log(`hand-batch2: wrote compare sheet -> ${outPng} (${W}x${H}, 左=底稿 右=修后)`);
}
