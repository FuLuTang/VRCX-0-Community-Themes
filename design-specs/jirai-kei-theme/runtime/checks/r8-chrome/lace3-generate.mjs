// task-47 · lace3 · 真镂空 + 内描边 状态栏顶边蕾丝。
// 只写 checks/r8-chrome/lace3-* ；不改 runtime/*.css。
// 坐标 = SVG 原始坐标（x 0..19，y 0..7）。window-chrome.css 的 ::before 是
// bottom:100%; height:8px; transform:scaleY(-1)，所以 SVG 第 0 行渲染在最下面、贴住状态栏，
// 第 7 行（扇贝尖）朝上伸进深色窗底。
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../../');
const W = 20, H = 8;
export const FACE = '#f9d1e7', STROKE_A = '#d97fc6', STROKE_B = '#f3add9';

// 旧版 tile 基线：Lead 已把 A 档接入 chrome-r8.css（R9.6c），所以基线改为读存档 lace3-current.svg，
// 不再从 chrome-r8.css 实时读取（否则“旧版应失败”的对照会读到新 tile）。
export const currentSvg = (await fs.readFile(path.join(here, 'lace3-current.svg'), 'utf8')).trim();
if (!currentSvg.includes('<g fill="#f9d1e7">')) throw new Error('lace3-current.svg 不是旧版存档');
void runtime;

// 现版“布面 ∪ 外描边”的外轮廓（r96-queue.md §2 像素图的 o 与 # 合并）。新布面 = 这个包络，不更大。
export const ENVELOPE = [
  '####################',
  '####################',
  '####################',
  '####################',
  '.##################.',
  '...##############...',
  '...##############...',
  '........####........',
];
// 孔眼：每个 2×2，沿用现版孔位（左 (5,3)(6,3)(5,4)、中 (9,4)(10,4)(9,5)(10,5)、右 (13,3)(14,3)(14,4)）。
export const HOLES = [[5, 3, 2, 2], [9, 4, 2, 2], [13, 3, 2, 2]];

const face = ENVELOPE.map(r => [...r].map(c => c === '#'));
const isHole = Array.from({ length: H }, () => Array(W).fill(false));
for (const [x, y, w, h] of HOLES) for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
  face[y + j][x + i] = false; isHole[y + j][x + i] = true;
}
// 内描边：布面像素若 4 邻域（水平方向按 20px 周期环绕；y=8 视为外侧）有透明像素 → 描边色。
// 第 0 行贴状态栏，不描。描边只改布面像素颜色，不碰透明像素，故外轮廓与孔径都不变。
const grid = [];
for (let y = 0; y < H; y++) {
  let s = '';
  for (let x = 0; x < W; x++) {
    if (!face[y][x]) { s += '.'; continue; }
    if (y === 0) { s += 'o'; continue; }
    const nb = [[(x + W - 1) % W, y], [(x + 1) % W, y], [x, y - 1], [x, y + 1]];
    s += nb.some(([a, b]) => b >= H || !face[b][a]) ? '#' : 'o';
  }
  grid.push(s);
}
export const GRID = grid;

// 贪心矩形合并 → 每色一个 path
function pathFor(ch) {
  const used = grid.map(r => [...r].map(() => false));
  let d = '';
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (grid[y][x] !== ch || used[y][x]) continue;
    let w = 0; while (x + w < W && grid[y][x + w] === ch && !used[y][x + w]) w++;
    let h = 1;
    while (y + h < H && [...Array(w).keys()].every(i => grid[y + h][x + i] === ch && !used[y + h][x + i])) h++;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) used[y + j][x + i] = true;
    d += `M${x} ${y}h${w}v${h}h-${w}z`;
  }
  return d;
}
const svg = stroke => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="8" shape-rendering="crispEdges"><path fill="${FACE}" d="${pathFor('o')}"/><path fill="${stroke}" d="${pathFor('#')}"/></svg>`;
export const svgA = svg(STROKE_A), svgB = svg(STROKE_B);
const b64 = s => Buffer.from(s).toString('base64');
const uri = s => `url("data:image/svg+xml;base64,${b64(s)}")`;

if (import.meta.url === `file://${process.argv[1]}`) {
  await fs.writeFile(path.join(here, 'lace3-current.svg'), currentSvg + '\n');
  await fs.writeFile(path.join(here, 'lace3-tile-A.svg'), svgA);
  await fs.writeFile(path.join(here, 'lace3-tile-B.svg'), svgB);

  const sizes = {
    current: { svg: Buffer.byteLength(currentSvg), base64: b64(currentSvg).length },
    A: { svg: Buffer.byteLength(svgA), base64: b64(svgA).length },
    B: { svg: Buffer.byteLength(svgB), base64: b64(svgB).length },
  };
  const rendered = rows => [...rows].reverse().map(r => r + r + r);
  const holePx = isHole.flat().filter(Boolean).length;
  const strokePx = grid.join('').split('#').length - 1;

  const snippet = `/* task-47 · lace3 —— 直接替换 runtime/chrome-r8.css 第 14 行的 --r8-lace-tile 声明（放在 :root 内）。
   A 档（默认）：内描边 ${STROKE_A}；布面 ${FACE}；孔眼与扇贝外侧完全透明。SVG ${sizes.A.svg} B，base64 ${sizes.A.base64} 字符。 */
    --r8-lace-tile: ${uri(svgA)};

/* B 档（备选，内描边 ${STROKE_B}）：用下面这行替换上面那行即可。SVG ${sizes.B.svg} B，base64 ${sizes.B.base64} 字符。
    --r8-lace-tile: ${uri(svgB)};
*/

/* ::before 其他属性：无需改动。
   - window-chrome.css:151-163 的几何保持：bottom:100%; height:8px; left/right:0; transform:scaleY(-1)
     （SVG 第 0 行=满宽布面，翻转后贴住状态栏顶边；第 7 行扇贝尖朝上）。
   - chrome-r8.css:119-128 的 paint 保持：background-color:transparent（不得改成布面色，否则孔眼被填实）、
     background-repeat:repeat-x; background-size:20px 8px; -webkit-mask:none; mask:none。
   - motion-r8.css 的 r8-lace-flow（background-position 0→20px，steps(2)）照旧可用：
     20px 周期内任意整数偏移都无竖纹。 */
`;
  await fs.writeFile(path.join(here, 'lace3-css-snippet.css'), snippet);

  const readme = `# lace3 · 状态栏顶边蕾丝：真镂空 + 内描边（task-47）

用户原话（权威）：“底边蕾丝的问题是，蕾丝遮罩，别朝外加肉粉描边，而是朝内，要不洞洞都不镂空了”。
叠加旧要求：去底线、去竖缝、填充与状态栏同色。

## 朝向依据

- \`window-chrome.css:151-163\`：\`.vrcx-0-statusbar[data-vrcx-0-surface='statusbar']::before { position:absolute; left:0; right:0; bottom:100%; height:8px; transform:scaleY(-1) }\`
  → 8px 条整个在状态栏**上方**，且竖直翻转。
- \`chrome-r8.css:119-128\` 只换 paint（background-image 平铺 20×8，\`mask:none\`），没有覆盖 transform；
  \`motion-r5/r7/r8.css\` 只动 \`background-position\` / mask-position，也不碰 transform。
- 所以 SVG **第 0 行渲染在最下面、贴住状态栏**（bottom:100% 落在 padding-box 顶，第 0 行压在状态栏 1px 同色 border-top 上），
  **第 7 行（扇贝尖）朝上**伸进深色窗底。浏览器实测：见 \`lace3-verify.mjs\` 的场景断言。

## 像素图

图例：\`o\`=布面 ${FACE}，\`#\`=内描边（A=${STROKE_A} / B=${STROKE_B}），\`.\`=完全透明（孔眼与扇贝外侧，透出窗底）。

### 新版（A/B 同形，只差描边色）· SVG 原始坐标（y=0 在上）

\`\`\`
  x    0         1
       01234567890123456789
${grid.map((r, y) => `y=${y}    ${r}`).join('\n')}
\`\`\`

### 新版 · 实际渲染朝向（scaleY(-1) 后，上=深色窗底，下=状态栏），3 个周期

\`\`\`
${rendered(grid).join('\n')}
████████████████████████████████████████████████████████████  ← 状态栏 ${FACE}
\`\`\`

### 现版 · 实际渲染朝向（对照，来自 r96-queue.md §2 并按 scaleY(-1) 翻转）

\`\`\`
${rendered(['oooooooooooooooooooo','#oooooooooooooooooo#','ooooooooo##ooooooooo','#oooo##oooooo##oooo#','.##oo#ooo##ooo#oo##.','...#ooooo##ooooo#...','...#####oooo#####...','........####........']).join('\n')}
\`\`\`

## 改了什么

1. **描边朝内**：新布面 = 现版“布面 ∪ 外描边”的外轮廓（同大，不更大）；描边只是把布面最外一圈像素改色，轮廓不外扩。
2. **真镂空**：3 个 2×2 孔眼 = 左 (5..6,3..4)、中 (9..10,4..5)、右 (13..14,3..4)，与现版孔位重合（现版涂实的 (5,3)(6,3)(5,4)、(9,4)(10,4)(9,5)(10,5)、(13,3)(14,3)(14,4) 全部包含在内），alpha=0；孔周一圈布面像素改描边色，孔径不变。共 ${holePx} 个孔眼像素，${strokePx} 个描边像素。
   现版中孔的 (9,2)(10,2) 只有 2×1，达不到 ≥2×2 且会贴近接缝，故并入下方 2×2 孔，不单独保留。
3. **无竖纹**：y=1/2 的 x0、x19 现为普通布面色（现版 (0,1)(19,1) 的描边点删除）；y=3 的 x0/x19 描边是扇贝谷底轮廓线，跟 (1,4)(2,4)/(17,4)(18,4) 斜向连成一条线，不是孤立点。
4. **无底线**：贴状态栏的第 0 行满宽布面色、不描；扇贝外侧透明，无横线。

## 体积

| 文件 | SVG 字节 | base64 字符 |
|---|---:|---:|
| 现版（chrome-r8.css:14） | ${sizes.current.svg} | ${sizes.current.base64} |
| [lace3-tile-A.svg](lace3-tile-A.svg)（${STROKE_A}，默认） | ${sizes.A.svg} | ${sizes.A.base64} |
| [lace3-tile-B.svg](lace3-tile-B.svg)（${STROKE_B}，备选） | ${sizes.B.svg} | ${sizes.B.base64} |

## SVG 源

A：
\`\`\`svg
${svgA}
\`\`\`
B：
\`\`\`svg
${svgB}
\`\`\`

## 文件

- \`lace3-generate.mjs\`：生成 SVG / README / CSS 片段（\`lace3-generate.prev.mjs\` 为前任半成品备份）。
- \`lace3-compare.mjs\` → \`lace3-compare.png\`：现版 / A / B，真实 ::before 几何（Chromium，DPR1），1× 与 6× 最近邻。
- \`lace3-verify.mjs\`：逐像素断言 + 浏览器场景断言，结果写 \`lace3-verify.json\`。
- \`lace3-css-snippet.css\`：替换 chrome-r8.css 第 14 行。

## 断言结果（\`lace3-verify.mjs\` → \`lace3-verify.json\`）

- A、B 各 12 项全过：仅三色且 alpha∈{0,255}；12 个孔眼像素 alpha=0；3 个 2×2 孔四周皆布面（孔径不变）；沿用现版孔位（左 3/3、中 4/6、右 3/3）；不透明区 ⊆ 现版“布面∪外描边”；描边全在布面最内缘、内缘无漏描；x0/x19 列自上而下 = \`ooo#....\`（仅 y=3 谷底轮廓，与 (1,4)/(18,4) 相连，非孤立）；y=0 满宽 ${FACE}；无整行底线；crispEdges + 每色 1 个 path；base64 ${sizes.A.base64} ≤ 1200。
- 现版跑同一套断言，预期失败 6 项（孔眼涂实、(0,1)(19,1) 孤立竖纹、非边缘描边、体积 ${sizes.current.base64} 等），证明断言有效。
- Chromium 场景（DPR1，真实 ::before 几何，background-position 0 与 10px 两帧）：场景第 (seamY−r) 行逐像素 = SVG 第 r 行叠在 #201936 上；蕾丝上方一行是窗底、接缝下方一行是状态栏 → SVG y=0 贴状态栏、y=7 扇贝尖朝上，孔眼实际透出 #201936。
`;
  await fs.writeFile(path.join(here, 'lace3-README.md'), readme);
  console.log(JSON.stringify({ grid, sizes, holePx, strokePx }, null, 1));
}
