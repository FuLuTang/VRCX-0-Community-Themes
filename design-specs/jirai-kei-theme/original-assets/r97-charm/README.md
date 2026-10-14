# R97 Q5 · 设置卡片标题挂饰候选（只出候选板，等用户选）

对象：`runtime/settings-pixel.css:80` 设置卡片标题栏的 `[data-slot=collapsible-trigger]::before`（`left:7px; top:calc(50% - 8px); 24×16`，现为 `background-color:#ffb8e6` + `mask:var(--jk-mask-s6)`）。这一轮**没有改动任何 runtime CSS**。

对比板：[candidates.png](<candidates.png>)（1320×1354）。每行左边是 1× 实际像素，右边是同一张截图的 4× 最近邻放大；场景按真实 CSS 搭：#2f2552 标题栏、1px #fdf4ff 顶高光、1px #16112a 底线，标题“外观”用 WD Pixel CJK 12px，挂饰盒在 left:7px。

## 为什么现版看起来“高清”

`--jk-mask-s6` 的来源是 [s6-bow-24x16.svg](<../src/s6-bow-24x16.svg>)，dist 里同一份是 [s6-bow-24x16.svg](<../dist/s6-bow-24x16.svg>)。它是一个**矢量剪影**：路径用的是三次贝塞尔（`C/c`）和斜线段，顶点也不在整数网格上，而且**没有** `shape-rendering="crispEdges"`。所以浏览器给它做了抗锯齿，24×16 的盒子里实测出现 **70 种颜色**，其中 **98 个像素**不在调色板里。周围全是硬边像素，它的软边轮廓就成了“高清贴纸”。

顺带一提，同一批里 `s1`（扇贝蕾丝）、`s2`、`s4`、`s5`、`s7`/`s7-s`（心）也是同样的非网格矢量。其中 `--jk-mask-s1-s` 就是同一张设置卡 `::after` 的蕾丝，`window-chrome.css` 里也在用；`s7-s` 和 `s4` 也在使用中。Q4 改蕾丝时值得一起看。

## 候选表

| # | 名称 | 文件 | 原生尺寸 | 来源 | 主题内已用 | 色彩 / 接入 |
|---|---|---|---|---|---|---|
| 对照 | 现版 s6 蝴蝶结 | — | 24×16（矢量） | src/s6-bow-24x16.svg | 是，仅 settings-pixel.css:80 | 单色 mask #ffb8e6，带抗锯齿 |
| 1 | 像素蝴蝶结 | [cand-1-pixel-bow.svg](<cand-1-pixel-bow.svg>) | 24×16 | r5/src/bow.svg（24×24）重绘 | 否（`--r5-bow` 0 处引用） | 多色 6 色 · background-image |
| 2 | 天使翼心 | [cand-2-angel-heart.svg](<cand-2-angel-heart.svg>) | 24×16 | r5/src/angel-heart.svg（28×20）重绘 | 否（`--r5-angel-heart` 0 处） | 多色 6 色 · background-image |
| 3 | 双色药丸 | [cand-3-pill.svg](<cand-3-pill.svg>) | 16×8 | dist/s21-pixel-pill-12x8.svg（单色剪影）重绘 | 否（`--jk-mask-s21` 0 处） | 多色 5 色 · background-image |
| 4 | 心锁 | [cand-4-lock-heart.svg](<cand-4-lock-heart.svg>) | 16×16 | r5/src/lock-heart.svg（20×24）重绘 | 否（`--r5-lock-heart` 0 处） | 多色 6 色 · background-image |
| 5 | 对话框心 | [cand-5-heart-bubble.svg](<cand-5-heart-bubble.svg>) | 16×14 | r5/src/bubble.svg（24×20）重绘 | 否（`--r5-bubble` 0 处） | 多色 5 色 · background-image |
| 6 | 缎带十字 | [cand-6-ribbon-cross.svg](<cand-6-ribbon-cross.svg>) | 12×16 | r5/src/cross.svg（16×20）重绘 | 否（`--r5-cross` 0 处） | 多色 6 色 · background-image |

- 所有候选都是逐格手绘的整数网格（每格 1px、`shape-rendering="crispEdges"`），每个颜色一条 path，只由水平游程组成。网格源码在 [grids.mjs](<grids.mjs>)。我没有缩放 r5 原图：r5 原图的 1px 描边压在整数坐标上，会跨半像素，1× 栅格出来是脏的，所以全部按原风格重画。
- 调色板沿用 r5 贴纸色：描边 #16112a、#ff7fcf、#ffb8e6、#d97fc6、#7a3f6d、#fdf4ff、#cdb0e8、#6c5ce0、#b9add9、#8f7fe0。
- 晶格审计（[build-board.mjs](<build-board.mjs>) 会自动统计）：在真实场景 24×16 盒内，6 个候选的**非调色板像素都是 0**。现版是 98。
- 已用情况的统计口径：grep `runtime/*.css` 里的 `var(--…)` 引用，覆盖 dist 的 `--jk-mask-*` 和 r5 的 `--r5-*`。现在实际在用的只有 s1-s、s2、s4、s6、s7-s、s16，以及 r5 的 heart、pixel-mascot、ribbon-pendant、star、pattern-heart-check。

### 盘点过但没入选的

- dist 单色：`s8` 小心 12×8、`s12` 星 8×8、`s23` 十字星 12×12、`s19` 警示章、`s15` 翼十字 32×12（太宽）、`s24` 兔子 16×20（太高）、`s16` 宝石心（已在 windose-runtime 使用）。
- r9 的 5/7/9 像素心（`--jk-r9-*` 未用）：和标题栏的品牌跳动心重复。
- r5 的 candy 24×16（风格偏甜品，地雷感弱）、bunny 20×28（太高）。
- icons：都是 Lucide 派生的功能图标，不适合当装饰挂件。

## 推荐

1. **#2 天使翼心（首推）**：地雷系辨识度最高（翼 + 心）。24×16 刚好填满现有挂饰盒，布局零改动。1× 下白翼 + 粉心在深紫底上很醒目，而且和标题栏的品牌心（无翼、会跳）能区分开。
2. **#1 像素蝴蝶结（保守）**：保留“蝴蝶结挂饰 + 蕾丝”这套原设计语义，只是换成真像素版，同样 24×16，替换后观感变化最小。用户嫌的是“高清”而不是“蝴蝶结”的话，选它最稳。

备选里 #4 心锁 16×16 也很合适，keyhole 在 1× 下能看清。#3 药丸最小、最安静。

## 接入方式（选定后再做）

保持盒子不动（`left:7px; top:calc(50% - 8px); width:24px; height:16px`），只换绘制方式。多色候选**不能**用 mask，要去掉 `background-color` 和 `mask`，改成：

```css
…[data-slot=collapsible-trigger]::before{
  content:"";position:absolute;left:7px;top:calc(50% - 8px);width:24px;height:16px;pointer-events:none;
  background:url("data:image/svg+xml,<所选 cand-*.svg 内容, URL 编码>") center/<W>px <H>px no-repeat;
  image-rendering:pixelated}
```

- `<W>×<H>` 填原生尺寸：#1/#2 24×16，#3 16×8，#4 16×16，#5 16×14，#6 12×16。宽高差都是偶数，`center` 落点一定是整数像素。
- 只能 1:1 显示，不要用非整数缩放。如果某张卡标题栏高度是奇数，`50% - 8px` 会落在 .5 像素上，可以改成 `top:round(down, 50% - 8px, 1px)`（Chromium 125+ 支持），或者给标题栏一个偶数高度。
- 如果坚持单色 mask，可以用 `toSvg(rows, title, true)` 导出剪影，配 `background-color:#ffb8e6`。不过 #1/#2/#4/#5 的内部细节（高光、羽层、锁孔、对话框白底）会全部丢掉，只有 #3、#6 的剪影还能认出来。不推荐。
- 选 16 宽的候选时，可以把 trigger 的 `padding-left:36px` 收到 `28px`（盒子改 16 宽），让字和挂饰的间距跟现在一致。这一点交给实现时决定。

## 重建

```bash
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node build-board.mjs
```

这个命令会重写 `cand-*.svg` 和 `candidates.png`，并输出审计 JSON。工具链：`/tmp/dsh-theme-tools` 里的 sharp + playwright；字体用 `fonts/fusion-pixel-zh-subset.woff2`。
