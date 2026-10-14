# lace3 · 状态栏顶边蕾丝：真镂空 + 内描边（task-47）

用户原话（权威）：“底边蕾丝的问题是，蕾丝遮罩，别朝外加肉粉描边，而是朝内，要不洞洞都不镂空了”。
叠加旧要求：去底线、去竖缝、填充与状态栏同色。

## 朝向依据

- `window-chrome.css:151-163`：`.vrcx-0-statusbar[data-vrcx-0-surface='statusbar']::before { position:absolute; left:0; right:0; bottom:100%; height:8px; transform:scaleY(-1) }`
  → 8px 条整个在状态栏**上方**，且竖直翻转。
- `chrome-r8.css:119-128` 只换 paint（background-image 平铺 20×8，`mask:none`），没有覆盖 transform；
  `motion-r5/r7/r8.css` 只动 `background-position` / mask-position，也不碰 transform。
- 所以 SVG **第 0 行渲染在最下面、贴住状态栏**（bottom:100% 落在 padding-box 顶，第 0 行压在状态栏 1px 同色 border-top 上），
  **第 7 行（扇贝尖）朝上**伸进深色窗底。浏览器实测：见 `lace3-verify.mjs` 的场景断言。

## 像素图

图例：`o`=布面 #f9d1e7，`#`=内描边（A=#d97fc6 / B=#f3add9），`.`=完全透明（孔眼与扇贝外侧，透出窗底）。

### 新版（A/B 同形，只差描边色）· SVG 原始坐标（y=0 在上）

```
  x    0         1
       01234567890123456789
y=0    oooooooooooooooooooo
y=1    oooooooooooooooooooo
y=2    ooooo##oooooo##ooooo
y=3    #ooo#..#o##o#..#ooo#
y=4    .##o#..##..##..#o##.
y=5    ...#o##o#..#o##o#...
y=6    ...#####o##o#####...
y=7    ........####........
```

### 新版 · 实际渲染朝向（scaleY(-1) 后，上=深色窗底，下=状态栏），3 个周期

```
........####................####................####........
...#####o##o#####......#####o##o#####......#####o##o#####...
...#o##o#..#o##o#......#o##o#..#o##o#......#o##o#..#o##o#...
.##o#..##..##..#o##..##o#..##..##..#o##..##o#..##..##..#o##.
#ooo#..#o##o#..#ooo##ooo#..#o##o#..#ooo##ooo#..#o##o#..#ooo#
ooooo##oooooo##oooooooooo##oooooo##oooooooooo##oooooo##ooooo
oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
████████████████████████████████████████████████████████████  ← 状态栏 #f9d1e7
```

### 现版 · 实际渲染朝向（对照，来自 r96-queue.md §2 并按 scaleY(-1) 翻转）

```
........####................####................####........
...#####oooo#####......#####oooo#####......#####oooo#####...
...#ooooo##ooooo#......#ooooo##ooooo#......#ooooo##ooooo#...
.##oo#ooo##ooo#oo##..##oo#ooo##ooo#oo##..##oo#ooo##ooo#oo##.
#oooo##oooooo##oooo##oooo##oooooo##oooo##oooo##oooooo##oooo#
ooooooooo##oooooooooooooooooo##oooooooooooooooooo##ooooooooo
#oooooooooooooooooo##oooooooooooooooooo##oooooooooooooooooo#
oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
```

## 改了什么

1. **描边朝内**：新布面 = 现版“布面 ∪ 外描边”的外轮廓（同大，不更大）；描边只是把布面最外一圈像素改色，轮廓不外扩。
2. **真镂空**：3 个 2×2 孔眼 = 左 (5..6,3..4)、中 (9..10,4..5)、右 (13..14,3..4)，与现版孔位重合（现版涂实的 (5,3)(6,3)(5,4)、(9,4)(10,4)(9,5)(10,5)、(13,3)(14,3)(14,4) 全部包含在内），alpha=0；孔周一圈布面像素改描边色，孔径不变。共 12 个孔眼像素，46 个描边像素。
   现版中孔的 (9,2)(10,2) 只有 2×1，达不到 ≥2×2 且会贴近接缝，故并入下方 2×2 孔，不单独保留。
3. **无竖纹**：y=1/2 的 x0、x19 现为普通布面色（现版 (0,1)(19,1) 的描边点删除）；y=3 的 x0/x19 描边是扇贝谷底轮廓线，跟 (1,4)(2,4)/(17,4)(18,4) 斜向连成一条线，不是孤立点。
4. **无底线**：贴状态栏的第 0 行满宽布面色、不描；扇贝外侧透明，无横线。

## 体积

| 文件 | SVG 字节 | base64 字符 |
|---|---:|---:|
| 现版（chrome-r8.css:14） | 1454 | 1940 |
| [lace3-tile-A.svg](lace3-tile-A.svg)（#d97fc6，默认） | 651 | 868 |
| [lace3-tile-B.svg](lace3-tile-B.svg)（#f3add9，备选） | 651 | 868 |

## SVG 源

A：
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="8" shape-rendering="crispEdges"><path fill="#f9d1e7" d="M0 0h20v2h-20zM0 2h5v1h-5zM7 2h6v1h-6zM15 2h5v1h-5zM1 3h3v1h-3zM8 3h1v1h-1zM11 3h1v1h-1zM16 3h3v1h-3zM3 4h1v1h-1zM16 4h1v1h-1zM4 5h1v1h-1zM7 5h1v1h-1zM12 5h1v1h-1zM15 5h1v1h-1zM8 6h1v1h-1zM11 6h1v1h-1z"/><path fill="#d97fc6" d="M5 2h2v1h-2zM13 2h2v1h-2zM0 3h1v1h-1zM4 3h1v2h-1zM7 3h1v2h-1zM9 3h2v1h-2zM12 3h1v2h-1zM15 3h1v2h-1zM19 3h1v1h-1zM1 4h2v1h-2zM8 4h1v2h-1zM11 4h1v2h-1zM17 4h2v1h-2zM3 5h1v2h-1zM5 5h2v2h-2zM13 5h2v2h-2zM16 5h1v2h-1zM4 6h1v1h-1zM7 6h1v1h-1zM9 6h2v2h-2zM12 6h1v1h-1zM15 6h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1z"/></svg>
```
B：
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="8" shape-rendering="crispEdges"><path fill="#f9d1e7" d="M0 0h20v2h-20zM0 2h5v1h-5zM7 2h6v1h-6zM15 2h5v1h-5zM1 3h3v1h-3zM8 3h1v1h-1zM11 3h1v1h-1zM16 3h3v1h-3zM3 4h1v1h-1zM16 4h1v1h-1zM4 5h1v1h-1zM7 5h1v1h-1zM12 5h1v1h-1zM15 5h1v1h-1zM8 6h1v1h-1zM11 6h1v1h-1z"/><path fill="#f3add9" d="M5 2h2v1h-2zM13 2h2v1h-2zM0 3h1v1h-1zM4 3h1v2h-1zM7 3h1v2h-1zM9 3h2v1h-2zM12 3h1v2h-1zM15 3h1v2h-1zM19 3h1v1h-1zM1 4h2v1h-2zM8 4h1v2h-1zM11 4h1v2h-1zM17 4h2v1h-2zM3 5h1v2h-1zM5 5h2v2h-2zM13 5h2v2h-2zM16 5h1v2h-1zM4 6h1v1h-1zM7 6h1v1h-1zM9 6h2v2h-2zM12 6h1v1h-1zM15 6h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1z"/></svg>
```

## 文件

- `lace3-generate.mjs`：生成 SVG / README / CSS 片段（`lace3-generate.prev.mjs` 为前任半成品备份）。
- `lace3-compare.mjs` → `lace3-compare.png`：现版 / A / B，真实 ::before 几何（Chromium，DPR1），1× 与 6× 最近邻。
- `lace3-verify.mjs`：逐像素断言 + 浏览器场景断言，结果写 `lace3-verify.json`。
- `lace3-css-snippet.css`：替换 chrome-r8.css 第 14 行。

## 断言结果（`lace3-verify.mjs` → `lace3-verify.json`）

- A、B 各 12 项全过：仅三色且 alpha∈{0,255}；12 个孔眼像素 alpha=0；3 个 2×2 孔四周皆布面（孔径不变）；沿用现版孔位（左 3/3、中 4/6、右 3/3）；不透明区 ⊆ 现版“布面∪外描边”；描边全在布面最内缘、内缘无漏描；x0/x19 列自上而下 = `ooo#....`（仅 y=3 谷底轮廓，与 (1,4)/(18,4) 相连，非孤立）；y=0 满宽 #f9d1e7；无整行底线；crispEdges + 每色 1 个 path；base64 868 ≤ 1200。
- 现版跑同一套断言，预期失败 6 项（孔眼涂实、(0,1)(19,1) 孤立竖纹、非边缘描边、体积 1940 等），证明断言有效。
- Chromium 场景（DPR1，真实 ::before 几何，background-position 0 与 10px 两帧）：场景第 (seamY−r) 行逐像素 = SVG 第 r 行叠在 #201936 上；蕾丝上方一行是窗底、接缝下方一行是状态栏 → SVG y=0 贴状态栏、y=7 扇贝尖朝上，孔眼实际透出 #201936。
