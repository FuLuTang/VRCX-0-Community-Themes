# P1-G2 Tabs 组件普查

> 范围：inventory 中 `family=G2, tag=div` 的 `tabs` 与 `tabs-list`；`tabs-tab` / `tab-indicator` 用于说明职责契约。Inventory 是 computed paint fingerprint，不采集盒模型尺寸，故未记录的高度、padding、radius 不作推断。

## 1. Inventory 记录与 styleVariants

### tabs 容器（1 fingerprint）

| primaryContext | 观察数 | 指纹数 | styleVariants |
|---|---:|---:|---|
| `surface:main-content` | 14 | 1 | `432850898dcd7eea` ×14 |
| `surface:side-panel` | 37 | 1 | `432850898dcd7eea` ×37 |

两条记录 computedStyle 相同：`color:rgb(242,235,255)`，背景透明，四边 border `0px solid`（border-color `rgb(108,92,224)`），`box-shadow:none`，outline `2.4px none`；字体 WD Pixel CJK，16px/400。指纹只描述 paint 属性，不含 layout 尺寸。

### tabs-list（每个 context 的 styleVariants 全量）

| primaryContext | 观察数 | 指纹数 | 全部 styleVariants（指纹 × 观察） |
|---|---:|---:|---|
| `surface:main-content` | 14 | 3 | `f9444e172a98963f` ×11；`c5e0e90cd5306c85` ×2；`046276fffcbc8566` ×1 |
| `surface:side-panel` | 37 | 1 | `f9444e172a98963f` ×37 |

`f944…`：背景 `rgb(32,25,54)`、四边 `0.8px solid rgb(108,92,224)`、bevel `rgb(253,244,255) 1px 1px inset / rgb(122,63,109) -1px -1px inset`、颜色 `rgb(227,210,245)`、outline `2.4px none`、字体16px/400。`c5e…` 与其绘制属性相同，仅 `clip-path` 不同：polygon 对 tab 下缘作阶梯/向下凸出的裁切；`046…` 再仅有颜色差异（`oklab(0.772417 0.0291363 -0.056142 / 0.72)`），并保留相同 clip-path。三个指纹在 computedStyle 上不含 radius、padding、高度。

按 context 的观察数/指纹数汇总即上表：main-content 14/3，side-panel 37/1；tabs 容器 main-content 14/1，side-panel 37/1。主内容的 3 个指纹不是 3 个底槽方案：两条仅为装饰 clip-path/颜色的附加差异。

## 2. 视觉家族与关键属性

| 视觉家族 | 对应上下文/用途 | 背景、边框、圆角、padding、高度（inventory / CSS） |
|---|---|---|
| 主内容水平页面 tabs | page-scaffold 下 `tabs-list`，14 observations；包括多条业务路由 | Inventory list 背景 `rgb(32,25,54)`、边框 `0.8px solid rgb(108,92,224)`；radius/padding/高度未采集。theme.css 当前显式：方角 `border-radius:0`、padding `1px`，底槽像素 bevel。选项本身透明底，选中粉底。 |
| 主内容竖向设置/图表分类 rail | Settings、chart 页面垂直分类 | Inventory 颜色 fingerprint 与水平类似，但方向信息不在 styleVariants；CSS 当前竖 rail 方角像素窗框，Settings 特例有 lace 装饰。padding/高度 inventory 未采集；规则 padding `3px 3px 12px`（Settings）或 `1px`（Chart 分类 rail）。 |
| 侧栏内嵌 tabs / 侧面板 rail | `surface:side-panel` 37 observations | tabs 容器指纹同主内容。SidePanel rail 使用真实 `[role=tab]`（Tooltip 包装会覆写 data-slot），选中融入面板并加粉色侧脊；其列表横向 padding 清零。未采集圆角/高度。 |
| Toolbar / 页面内嵌控件 tabs | page-toolbar、entity dialog、内容卡片等 | Inventory 的 main-content context trail 有 6 次位于 toolbar，但 tabs-list primaryContext 仍归 main-content；无法据此构造单独指纹。Embedded selector 排除 PageScaffold/PageToolbar 等，采用像素方角样式；entity dialog 仅在真实 tabs-list 行内增加心形装饰，不是新皮肤。 |
| 分段控件 segmented | outline toggle-group 等非 tabs 组件 | 不是 `tabs-list` inventory 记录。它有自己的圆角/群组语义可能性，但本 theme 的可见像素风横向 tabs 规则明确方角。不得把 button-toggle 的圆角样式无条件套给 tabs。 |

## 3. theme.css 命中规则

以下按真正触及 tabs 容器/list/tab/indicator 的选择器列出；行号为当前 theme.css。未把仅仅在 `:has()` 里探测 tabs、实际声明作用于 card/toolbar 的无关规则当作 tabs 外观规则。

| SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `runtime` / 618–621 | `[data-slot="tabs-tab"]`（与 chrome 选择器组） | `font-family:"WD Pixel CJK", var(--vrcx-app-font-family,system-ui),sans-serif; font-synthesis:none; font-size:12px` |
| `runtime` / 676 | `[data-slot="tabs-tab"][data-active]` | `background-color:var(--wd-pink); color:#16112a` |
| `runtime` / 689–692 | `.entity-dialog [data-slot="tabs-list"][class~="h-11"]::before` | 插入 16×16 心形装饰，`flex:none`、margin、粉色 mask；非底槽皮肤 |
| `side-panel` / 1063–1067 | `.vrcx-0-side-panel [data-slot='tabs'] > div:not(.vrcx-0-side-panel-rail)` | 面板内层 `background-color:var(--wd-raised); outline:1px solid var(--wd-frame); outline-offset:-1px` |
| `side-panel` / 1074–1076 | `.vrcx-0-side-panel .vrcx-0-side-panel-rail [data-slot='tabs-list']` | `padding-inline:0` |
| `side-panel` / 1078–1083 | `.vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab']` | `border-radius:0; border-color:transparent; background-color:#1d1631; color:var(--wd-faint)` |
| `side-panel` / 1085–1088 | rail `[role='tab']:hover` | `background-color:var(--wd-select); color:var(--wd-text)` |
| `side-panel` / 1092–1097 | rail `[role='tab'][data-active]` | 三边 frame（左透明）、面板 raised 底、粉色文字 |
| `side-panel` / 1101–1110 | rail active `::after` | 右侧 3px 粉色 spine |
| `settings` / 1298 | 竖向 settings `[data-slot=tabs]… > [data-slot=tabs-list]` | `position:relative; padding:3px 3px 12px; gap:1px; border:1px solid #6c5ce0; border-radius:0; background-color:#201936;` inset bevel；`clip-path:var(--jk-px-cut)` |
| `settings` / 1300 | 同 list `::after` | 底部 lace fringe，高8px、mask 绘制 |
| `settings` / 1303 | 同 list > `[data-slot=tab-indicator]` | `display:none` |
| `settings` / 1304–1309 | 同 list > `[data-slot=tabs-tab]` 及 hover/active/focus | tab 透明底方角；hover 紫底；active 粉底、暗字、bevel；focus 粉 outline |
| `runtime` / 1420 | 非 side-panel rail 的 active tab `::after` | 初始化伪元素：`content`、`position:absolute`、`z-index:1`、`opacity:0`、`pointer-events:none` |
| `motion-r7` / 1575–1580 | `@keyframes r7-tab-edge` | 0–60% 隐藏且 background-position -24px；68–80% 亮度 .65 并从 0 滑到24px；90% .45 到48px；100% 隐藏到72px |
| `motion-r7` / 1582–1592 | 同 active tab `::after` | 定位在底边，宽100%、高2px；背景 `linear-gradient(#ffe4f5,#ffe4f5)`，背景尺寸24×2、no-repeat；`animation:r7-tab-edge 6s steps(4,end) infinite` |
| `motion-r7` / 1595–1598 | reduced-motion 同伪元素 | `animation:none !important` |
| `bio-diff-r8` / 1901–1903 | 非 rail active tab `::after` | `animation:none !important`（冻结 R7 伪元素，不改其内容/几何） |
| `controls-r9` / 2448–2456 | `.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"])` | 横向页面 tabs：`gap:2px; padding:1px; border:1px solid #6c5ce0; border-radius:0; background-color:#201936; color:#e3d2f5;` inset bevel |
| `controls-r9` / 2457–2459 | 同 list 后代 `[data-slot="tab-indicator"]` | `display:none` |
| `controls-r9` / 2460–2467 | list 直接子 tabs-tab | 方角、transparent border/bg、淡粉文字、无阴影/transition |
| `controls-r9` / 2468–2470 | 同 tab hover | `background-color:#3b2c55; color:#f2ebff` |
| `controls-r9` / 2472–2477 | 同 tab active/selected | 粉底 `#ffb8e6`、暗字、紫边、双 inset bevel；声明含 `!important` |
| `controls-r9` / 2478–2483 | tab 内最后一个 span / active span | 修正图标/标签文字颜色，active span 为 `#2a1d6e` |
| `controls-r9` / 2484–2488 | 同 tab `:focus-visible` | z-index2、粉色 2px outline，offset -2px |
| `tools-ui-r9` / 2845–2853 | Chart 分类纵向 tabs-list | `gap:2px; padding:1px; border:1px solid #6c5ce0; radius:0; background:#201936; color:#e3d2f5;` bevel |
| `tools-ui-r9` / 2854–2856 | 同 list > tab-indicator | `display:none` |
| `tools-ui-r9` / 2857–2864 | 同 list > tabs-tab | 方角、透明底、淡粉字、无阴影/transition |
| `tools-ui-r9` / 2865–2868 | 同 tab hover | 紫底、亮字 |
| `tools-ui-r9` / 2869–2874 | 同 tab active/selected | 粉底、暗字、紫边、双 bevel |
| `tools-ui-r9` / 2875–2879 | 同 tab focus | z-index2、粉 outline |
| `buttons-badges-r10` / 4292 | 排除 page-scaffold/toolbar/popover/card 等后的 embedded tabs-list | `gap:2px; padding:1px; border:1px solid #6c5ce0; radius:0; background:#201936; color:#e3d2f5;` inset bevel |
| `buttons-badges-r10` / 4293 | embedded list direct tabs-tab | 方角、`background:#211a33; color:#f2ebff; box-shadow:none` |
| `buttons-badges-r10` / 4294 | embedded active/selected tab | 紫边、粉底、暗字、双 bevel |
| `buttons-badges-r10` / 4295 | embedded list > tab-indicator | `display:none` |

**`r7-tab-edge` 追踪（只查未改）：** 唯一 animation 引用是 `motion-r7` 第1592行，目标是非 `.vrcx-0-side-panel-rail` 的 `[data-slot="tabs-tab"][data-active]::after`。动画本体以 24px 的浅粉纯色横纹做 6 秒分步背景位置位移，在 active tab 底部 2px 高伪元素上形成间歇扫过的 glint；不是 tab-indicator 的滑块。初始化定义在 runtime 1420，motion-reduced 时停掉；`bio-diff-r8` 第1901–1903行另有 `animation:none !important`，明确将 R7 glint 静止化而非删除伪元素。动画本体属于冻结层，本次不碰。

## 4. 职责契约、合并判断

- `tabs` 是逻辑/布局容器，不负责绘制选中态；Inventory 只有透明背景与无边框，主内容、侧栏容器指纹一致。
- `tabs-list` 是视觉底槽/承载轨道：页面像素风横向、设置/图表竖 rail 由 list 画暗底、方角框线与 bevel。side-panel 的 folder rail 是独立布局语义，tab 融合面板，active 右侧粉 spine；列表底槽不能误当选中指示器。
- `tabs-tab` 是交互面：hover 提亮，选中由自身 active/aria-selected 状态画粉色面与反差文字；选中样式必须保留。`tab-indicator` 本为组件的滑动指示条；inventory 另记其 `surface:main-content` 14 observations、2 fingerprints（13+1），背景均为 `rgb(162,148,200)`，颜色仅有细微差别。主内容/竖向/embedded 像素方案都 `display:none`，以避免与 tab active face 重复。side-panel 则用 active tab 伪元素侧脊而非滑块。
- 横向主内容、toolbar 内嵌及普通 embedded pixel tabs 可并成同一基础像素家族；route/context 的差异主要是容器位置/尺寸，不是不同皮肤。Settings / Chart 竖向 rail 可复用该像素色板与 states，但保留方向、padding/lace/clip-path 的局部结构特例。
- Rounded segmented 与方角 pixel tabs 是两套**组件语义/皮肤**：当前 tabs-list 主流明确 `border-radius:0`，不要把通用 rounded segmented 覆盖进 tabs。反之 outline toggle-group 若需要圆角/分段缝隙，应由 toggle 组件另行拥有。
- side-panel folder rail 的三边框融合、左侧开口、粉色脊与真实 `[role=tab]` 选择不可和主内容横向样式合并；其 Tooltip 会改写 `data-slot`，仅匹配 tabs-tab 会失效。
- tabs-tab inventory 的 4 fingerprint（44/13/9/1）：未选中透明、选中粉底、muted 未选中、极少量选中边色异常；体现状态/局部覆盖，不支持另建 4 套家族。字号差异不等于皮肤差异。

**Specificity 风险：** 现有页面规则如 `.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]…`、Chart 超长 `:has()` 与高度具体的 SidePanel selector specificity 明显高于单独 `[data-slot=…]`。重构若把全部状态并到低 specificity 的 `:where()` 通用骨架，旧规则或 app utility 会反压；应将结构范围/状态选择器保留为独立层，确认 cascade 后逐步降级，并审视 `!important` 的 active 颜色/阴影。

## 5. 收敛结论与 CSS 骨架

**建议 tabs 收敛为 2 个视觉家族：①共享方角像素 tabs（横向页面、toolbar/embedded、设置/图表 rail 的共同色板与状态；方向和 decoration 只做局部 modifier）；②side-panel folder rail。** 若统计“皮肤+方向组合”，可记 3 个用法：pixel-horizontal、pixel-vertical、panel-folder；但基础视觉 tokens 不要拆成三份。Rounded segmented 留在 toggle/group 组件，不算 tabs 家族。

建议骨架：`[data-slot=tabs]` 只管布局容器；`[data-slot=tabs-list]` 管 `--tabs-track-bg/border/radius/padding/gap/box-shadow`；直接子 `[data-slot=tabs-tab]` 管基础、`:hover`、`:is([data-active],[aria-selected="true"])`、`:focus-visible`。竖向通过 `[data-orientation=vertical]` 覆盖方向/留白/装饰；side-panel 使用 `[role=tab][data-active]` 的独立融合规则；indicator 明确隐藏于 pixel 家族，r7 动画继续由冻结层独立管理。

## 6. 可视化

[打开 tabs 收敛预览](../preview/P1-G2-tabs.html)：包含像素横向、竖 rail、side-panel folder 三种使用形态，并呈现未选中、选中、hover 对比（静态固定伪状态，文件可直接浏览器打开）。
