# R4 · 动态列表图标与徽标（feed-badges）

日期：2026-10-11 · 范围：`runtime/feed-badges.css`（+ 一条手绘图标源）
主应用 `/home/fulutang/Documents/Github/VRCX-0-jirai` 全程只读；未运行应用、未做 git/构建、未连 Windows。
所有断言来自 SSR 渲染 + 真实编译 CSS 的 Chromium fixture，脚本在 `runtime/checks/r4-feed-badges/`。

---

## 0. 一句话结论

**(5a) 不是"CSS 选择器漏项"，而是"图标盒不在 16 栅格上"。**
249 个生产 import 名归并出的 257 个标识符，SSR 出来的 class **100% 落在 `jirai-icons.css` 的
`svg.lucide:is(...)` 并集里**（唯一例外 `grid-3x3` 只在 jsdom 测试里用）。用户看到铅笔"没像素化"，
是因为 `FeedTypeIndicator` 用 `size-3.5`（14px）渲染 16×16 的像素 mask：0.875 重采样把 1px 稀疏
图形丢掉约 27% 亮像素，铅笔这种"细斜线"图形因此退化回普通 lucide 观感，而实心图形（位置针、
小人）看不出来。修法两条：图标盒回到 16px 整数栅格；铅笔字形手工加粗成 2px 块。

---

## 1. (5a) 证据链

### 1.1 全量 SSR class → CSS 命中审计（`ssr-icon-hits.mjs` / `ssr-icon-hits.json`）

`createRequire('<app>/package.json')` 加载 react / react-dom/server / lucide-react(1.46.0)，
对 `src/**/*.{ts,tsx}` 里每个 `lucide-react` import 标识符（排除类型 `LucideIcon`）
`renderToStaticMarkup` 出真实 `<svg class="...">`，再与 `jirai-icons.css` 的
`svg.lucide:is(...)` 并集（243 个选择器）比对：

| 指标 | 值 |
|---|---|
| 源码 import 标识符 | 257（全部可 SSR 渲染，0 个无法解析） |
| CSS `:is()` 并集 | 243 |
| `--px` 声明 | 243 |
| **未命中** | **1 = `grid-3x3`**，仅 `src/components/layout/ToolbarControls.test.tsx` 引用 |

点名 4 个 feed 图标全部命中：`LogInIcon→lucide-log-in`、`LogOutIcon→lucide-log-out`、
`PencilLineIcon→lucide-pencil-line`、`PersonStandingIcon→lucide-person-standing`
（源码 `src/components/feed/FeedTypeIndicator.tsx:15-28`）。
⇒ **上一轮"249 引用名→243 图形全覆盖"在生产路径上成立，本条不是漏项。**

### 1.2 实机截图复核：铅笔确实已经被 mask 渲染

把用户截图裁切放大 8×（`user-shot-icons-8x.png`）：铅笔是**硬边阶梯像素块**（斜笔身＋下划线），
不是 lucide 原生的抗锯齿圆头描边。所以 mask 生效，问题在观感不在管线。

### 1.3 量化：14px 盒丢像素（`sharpness.mjs` / `sharpness.json`）

deviceScaleFactor=1（模拟 Windows 100%），同一 glyph 分别 14px / 16px，数"纯前景像素"：

| glyph | 14px 实心像素 | 16px 实心像素 | 损失 |
|---|---|---|---|
| pencil-line | 58 | 79 | −27% |
| map-pin | 55 | 78 | −29% |
| log-in | 66 | 78 | −15% |
| file-text | 96 | 122 | −21% |

**中间插值像素 = 0**：Chromium 的 mask 缩放不产生灰边，而是**抽样丢块**。
粗实心图形丢几块仍像像素画；1px 斜线丢 27% 就断成"普通描边"。
这也解释了为什么用户只点名铅笔。

### 1.4 243 个字形的"块状度"分布（`audit-grids.mjs` / `grid-blockiness.json`）

对 `original-assets/icons/src/_grids.json` 的 243 个 16×16 栅格统计水平行程均值 avgRun：

- 全集中位数 **3.25**，最细 1.8（`code`），最粗 10
- feed 用到的：`log-in/log-out` 3.55、`file-text` 3.49、`person-standing` 3.14、
  **`pencil-line` 2.93（第 72 细 / 243）**、`map-pin` 2.73（第 50）、`chevron-right` 2.80
- 结论：铅笔**不是最细的**，但它是唯一"细且形状本身就是一条斜线"的，视觉上最容易被判为"未处理"。

### 1.5 修复

1. **图标盒回 16px**（`runtime/feed-badges.css` 第 1 节）：
   `span.inline-flex.min-w-0.items-center.gap-1.5:has(>svg.lucide[aria-hidden='true'])>svg.lucide[aria-hidden='true']`
   → `width/height:16px; mask-size:16px 16px`（1:1 blit，不再重采样）。
   锚点是组件写死的 wrapper + 它渲染的 `aria-hidden` svg（`FeedTypeIndicator.tsx:39-45`）；
   `FeedStatusBadge` 用同一组 wrapper class 但没有 svg 子节点，不会被误伤。
   **同一 `...TypeIndicator` 族的 4 个孪生组件**（`GameLogTypeIndicator.tsx:40`、
   `FriendLogViewParts.tsx:100`、`ModerationViewParts.tsx:53`、`MyAvatarsViewParts.tsx:169`，
   结构与图标 class 逐字相同）会一起走上 16 栅格——同一套图标不应在一个应用里有两个尺寸。
2. **铅笔字形手工加粗**（新增 `original-assets/icons/src-hand/pencil-line.svg`，387 B）：
   保持 lucide 铅笔形状，把 1px 轮廓水平膨胀成 2px 块（avgRun 2.93 → 4.04，fill 79 → 105），
   仍是 16×16 栅格 / `crispEdges` / 单色 `#000`（mask 继承 `currentColor`）。
   `build-icons.mjs:16` 优先读 `src-hand/`，重跑后 `dist/jirai-icons.css` **只有 pencil-line 一行变化、字节数不变**（110865 → 110865）。
   对比图：`pencil-ab.png`（上=原字形，下=加粗；左=14px，右=16px）。

---

## 2. (5b) 详情列 ●→● 圆点 → 像素方块

- 真实组件：`src/components/feed/FeedStatusBadge.tsx:15-27`，圆点是
  `size-2.5 shrink-0 rounded-full` + 状态色 class（`feedRows.ts` 的 `resolveFeedStatusMeta`），
  由 `FeedDetailCell.tsx:45-49` 渲染 `● → ●`；展开行 `FeedExpandedRow.tsx:131-146` 复用同一组件。
- 侧栏头像方块的既有实现：`windose-runtime.css:104-106` 把 rail 里 `size-3.75` 状态点
  `border-radius:0`（其 `border-3 border-background` 即深色环）。
- 主题改动：`border-radius:0` + `box-shadow:0 0 0 1px #16112a`（`box-shadow` 不是 border，
  10px 盒子尺寸与行高完全不变）。状态色不动。
- 实测：圆点 `radius 0px`、`10×10`、`box-shadow rgb(22,17,42) 0 0 0 1px`、填充仍为
  `rgb(46,211,25)` / `rgb(233,124,3)`。
- **反例对照**（防误伤）：`AccentColorPicker.tsx:82,101` 的色板圆点与
  `charts/components/mutual-friends/*` 的社区圆点父级是 `Button`，不匹配本选择器，
  实测仍为 `border-radius:3.35e7px`（圆）。

---

## 3. (5c) 区域小徽标 JP / USE

- 真实组件：`src/components/location/RegionCodeBadge.tsx:32-42`（`us/use/usw/eu/jp` → 文本），
  使用方 `WorldRoomsSidebar.tsx:246`、`FriendsSidebarLocation.tsx:346`、
  `LocationDisplay.tsx:110`、`InstanceLocationSummary.tsx:210`、
  `FriendsLocationsWorldSection.tsx:233`、`FeedLocationLink`→`Location`。
- 原样式：`rounded border bg-muted/70 text-muted-foreground font-mono text-[10px]`
  → 4px 圆角、半透明、灰底灰字。
- 改成：`border-radius:0`、`1px solid var(--wd-frame)`、`background:var(--wd-raised)`、
  `color:var(--wd-square)`、`font-family:var(--wd-body-font-family)`（Fusion，有真小写），
  并用 `clip-path` 在两个外角切 1px 阶梯角；`h-4`(16px) 不变。
- 实测：`radius 0px`、`border 1px rgb(108,92,224)`、`bg rgb(42,33,71)`、
  `color rgb(255,184,230)`、字体首项 `"WD Pixel CJK"`、高度 16px。
  宽度：JP 22.0→23.4px、USW 28.1→31.6px（Fusion 更宽），不改变行高。

---

## 4. 字节预算

| 文件 | 前 | 后 | 增量 |
|---|---|---|---|
| `runtime/feed-badges.css` | 无 | **5652 B** | ≤8000 ✅ |
| `original-assets/icons/dist/jirai-icons.css` | 110865 | 110865 | **0 B** ✅ |
| `original-assets/icons/src-hand/pencil-line.svg` | 无 | 387 B | 新增 |

主题体量：975416 + 5652 = 981068 B < 1 MiB（余量约 67KB）。
无 `@import`、无远程 URL、无位图；`dist` 只重跑 `build-icons.mjs`（不需要 sharp）。

---

## 5. 风险 / 未验证

1. **未经 Windows/WebView2 实机验证**。所有数字来自本地 Chromium + 应用编译 CSS 的
   source-shaped fixture；`crispEdges` mask 在 WebView2 的最终表现需实机截图确认。
2. **`build-runtime.mjs` 尚未包含本文件**（Leader 专属）：需把 `feed-badges` 段追加到
   `parts` 末尾（body-typography 之后）并重跑，否则新样式不会进 `preview-package/theme.css`。
   已构建的 `theme.css` 里仍是**旧铅笔字形**，需重建才会带上 1.5 的手绘 glyph。
3. **图标盒 14→16px 的横向影响**：类型列宽度由 `colgroup`/grid 固定，实测 cell 宽度 delta 全 0、
   行高 delta 全 0；但标签文字起点会右移 2px，极端窄列下截断位置会变（`truncate` 仍是省略号）。
4. **`clip-path` 阶梯角只有 1px**，2× 截图下几乎不可见；若用户要更明显的缺角，需加大到 2px
   （会吃掉更多 1px 边框）。
5. **同一选择器覆盖 4 个同族 TypeIndicator**（游戏日志 / 好友日志 / 审查 / 我的模型），
   属有意为之；若 Leader 要严格限定 feed，需要应用侧加 feed 专属 DOM 标记（列模式目前没有）。
6. `src/_grids.json` / `_index.json` 未更新（手绘 glyph 不参与光栅化统计），
   与 README 中"src-hand 的历史栅格输入不可复现"的口径一致。
7. 未验证：状态方块 1px 深框在 **hover 行**（`--vrcx-0-table-row-hover-surface`）与
   选中行上的对比是否仍足够；#16112a 与 #2a2147 的明度差较小。

---

## 6. Leader 必须实机复测项

1. 把 `runtime/feed-badges.css` 接进 `build-runtime.mjs`（最后一段）重建，确认总字节 < 1 MiB。
2. Windows 实机：好友动态（列模式 + 虚拟列表模式 + 展开行）里
   上线/下线/状态签名/模型/位置/签名 6 种类型图标是否都是 16px 硬边像素块，
   铅笔是否已明显加粗。
3. 实机核对：状态变动详情列的 ●→● 是否为方形 + 1px 深框且状态色不变；
   hover/选中行上的对比是否可接受。
4. 实机核对：JP/USE 徽标在世界名旁、好友侧栏、房间列表三处的宽度变化是否造成截断或换行。
5. 实机确认行高与虚拟列表滚动位置无变化（本地 fixture 为 40px/0 delta）。
