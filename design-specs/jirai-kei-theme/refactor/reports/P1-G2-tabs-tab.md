# P1-G2 tabs-tab 组件普查

> 范围：仅 `family=G2, component=tabs-tab`，补充前作 tabs/tabs-list 的职责契约。inventory 统计 paint fingerprint，不包含 padding/height；缺项明确记为未采集。样式层只读。

## 1. Inventory 全量记录与变体

Inventory 只有一条 tabs-tab 记录：`tag=button, variant=null, size=default`，`primaryContext=surface:main-content`，总观察数 67、状态数 14、指纹数 4（[inventory:7917–7942](../../baseline/reports/component-variant-inventory.json#L7917-L7942)）。其 contextTrails 分布为 page-scaffold 45、page-scaffold > page-toolbar 22（同文件 8076–8085）。所以 primaryContext 按记录汇总只有一行；下面附列观察到的细分 trail，不能误读为另有 primaryContext 记录。

| primaryContext / trail | 观察数 | 指纹数 | 说明 |
|---|---:|---:|---|
| `surface:main-content`（记录主上下文） | 67 | 4 | inventory 唯一 primaryContext |
| `… > area:vrcx-0-page-scaffold` | 45 | — | trail 子集 |
| `… > area:vrcx-0-page-scaffold > area:vrcx-0-page-toolbar` | 22 | — | trail 子集，非独立 inventory 记录 |

全部 styleVariants（关键差异为 computedStyle 原值；未列出的 paint 项在这四种指纹中相同：`outline-width:2.4px; outline-style:none; opacity:1; filter:none; transform:none; clip-path:none`，字体均为 WD Pixel CJK 栈、12px、weight 500）：

| 指纹 × 观察数 | 背景 / 文字 | 边框（四边相同，除最后一行） | 阴影 | padding / 高度 |
|---|---|---|---|---|
| `8d5dca682b301b53` ×44 | 透明 / `rgb(227,210,245)` | 0.8px solid transparent | none | 未采集 / 未采集 |
| `f15687375390a205` ×13 | `rgb(255,184,230)` / `rgb(22,17,42)` | 0.8px solid `rgb(108,92,224)` | inset `rgb(253,244,255) 2px 2px`、`rgb(122,63,109) -2px -2px` | 未采集 / 未采集 |
| `bdebf4ddee87b730` ×9 | 透明 / `rgb(185,173,217)` | 0.8px solid transparent | none | 未采集 / 未采集 |
| `e412db1ad6bf4694` ×1 | `rgb(255,184,230)` / `rgb(22,17,42)` | 0.8px solid `rgb(22,17,42)` | 同上双 inset bevel | 未采集 / 未采集 |

详见 [inventory:7942–8073](../../baseline/reports/component-variant-inventory.json#L7942-L8073)。指纹是跨上下文/交互采样结果，不等于四套组件皮肤：44+9 是普通/淡化的透明态，13+1 是选中态，最后一条只是边框色异常的单次观察。Computed `color`/`background-color`/border/box-shadow/font-weight 的差异是真实采样差异；padding 与高度不在采集字段内，不能由此推断。

## 2. 样式层命中规则

以下是 style 层中直接给 tab、indicator 或其状态绘制的规则；行号为对应新样式文件。颜色按 CSS 实际声明（变量未展开时保留变量）。

| 文件 / SECTION / 行 | 选择器 | 实际声明与效果 |
|---|---|---|
| `02-foundation.css` / `runtime` / 18–25 | `[data-slot="tabs-tab"]`（选择器组） | 字体 `"WD Pixel CJK"`、`font-synthesis:none`、`font-size:12px`。 |
| 同 / 80 | `[data-slot="tabs-tab"][data-active]` | `background-color:var(--wd-pink); color:#16112a`；通用 active 面。 |
| `11-controls-and-pages.css` / `controls-r9` / 17–19 | 主内容横向 list 后代 `[data-slot="tab-indicator"]` | `display:none`。 |
| 同 / 20–27 | page-scaffold 横向 list 直接子 `[data-slot="tabs-tab"]` | 方角、透明边框/背景、`color:#e3d2f5`、无阴影、无 transition。 |
| 同 / 28–31 | 上述 tab `:hover:not([data-disabled]):not([aria-disabled="true"])` | `background-color:#3b2c55; color:#f2ebff`。禁用态不触发 hover 提亮。 |
| 同 / 32–37 | 上述 tab `:is([data-active],[aria-selected="true"])` | 紫边、粉底 `#ffb8e6 !important`、暗字 `#16112a !important`、双 inset bevel `!important`。 |
| 同 / 38–43 | tab 内最后一个 span，active span | 普通文字 `#e3d2f5`，active span `#2a1d6e`。 |
| 同 / 44–48 | 横向 tab `:focus-visible` | `z-index:2`，2px 粉色 outline、offset -2px。 |
| `06-panels-and-settings.css` / section (6)① / 165 | Settings vertical list 直接子 indicator | `display:none`，注释明确是避免和 selected face 双画。 |
| 同 / 166–167 | Settings vertical list 直接子 tab | 透明底、淡紫字、透明边框、无阴影、方角；lucide 图标继承文字色。 |
| 同 / 168 | 上述 tab `:hover` | 紫底 `#4a3784`、紫框 `#6c5ce0`、亮字 `#f2ebff`。 |
| 同 / 169 | 上述 tab `[data-active]` | 粉底、暗框/暗字、双 inset bevel。 |
| 同 / 170–171 | focus-visible，active focus-visible | 粉 outline；active 时 outline 改暗色。 |
| `05-navigation.css` / R4-9 / 84–92 | SidePanel rail list 与 `[role='tab']` | list `padding-inline:0`；tab 方角透明边框、底 `#1d1631`、字 `var(--wd-faint)`。Tooltip wrapper 改写 data-slot，故真实 tab 以 role 选择。 |
| 同 / 95–98 | SidePanel `[role='tab']:hover` | raised/选中紫底 `var(--wd-select)`，亮字 `var(--wd-text)`。 |
| 同 / 102–107 | SidePanel `[role='tab'][data-active]` | 三边 frame，左边透明；raised 面 `var(--wd-raised)`，粉字 `var(--wd-pink)`。 |
| 同 / 111–120 | SidePanel active `::after` | 右侧 3px 粉色 spine；不是滑动 indicator。 |
| 同 / 126–135 | SidePanel active `::before` | 左侧覆盖面板边线的 raised 色补片，使 tab 与内容面板融合。 |
| `02-foundation.css` / runtime / 80 + `09-motion-and-user-surfaces.css` / section 5 / 62–64 | 非 SidePanel active tab `::after` | 此处仅 `animation:none !important`，静止化已冻结层 R7 的扫光伪元素，不负责滑动指示。 |
| `14-buttons-and-data.css` / buttons-badges-r10 / 60–62 | embedded tabs-list 直接子 tab、active tab、indicator | 普通 tab `#211a33` 底、亮字、无阴影；选中粉底暗字双 bevel；list 内 indicator 隐藏。 |

> 本次重点规则之外，inventory 检出的 icon/文字 span 是子元素颜色覆写；`tab-indicator` 不参与像素 tabs 的选中面。禁用逻辑仅在横向 hover 选择器里显式排除 data-disabled/aria-disabled；样式层未发现一条统一的 tab-disabled 外观规则，因此不臆造禁用颜色/opacity。

## 3. 四者视觉契约（核心）

| 对象 | 职责 | 不应承担什么 |
|---|---|---|
| `tabs` 容器 | 逻辑/方向/布局语义；本身不画底槽或选中态。 | 不要在容器上再叠选中背景。 |
| `tabs-list` | 像素 tabs 的轨道/底槽：暗面、方角框线、bevel、间距；Settings 竖 rail 另有底部 lace。 | 不表示当前选项；不要把底槽当 indicator。 |
| `tabs-tab` | 交互面：默认透明或暗色，hover 提亮，active/aria-selected 自己画粉色选中面（folder rail 以面板融合面+右脊表达）。 | 不依赖 indicator 才显示选中。 |
| `tab-indicator` | 原生组件的滑动指示条；若采用标准下划线 tabs，应由它唯一绘制滑动条。 | 在当前像素皮肤里隐藏，避免和 tab 自己画的 active face 重复。 |

**当前是否存在重复绘制？存在于规则设计层，已通过 `display:none` 避开实际重复渲染。** tab active 面由横向 [11-controls-and-pages.css:32–36](../src/style/11-controls-and-pages.css#L32-L36) 或竖向 [06-panels-and-settings.css:169](../src/style/06-panels-and-settings.css#L169) 绘制；对应 list 下的 indicator 在横向 [11-controls-and-pages.css:17–19](../src/style/11-controls-and-pages.css#L17-L19)、竖向 [06-panels-and-settings.css:165](../src/style/06-panels-and-settings.css#L165) 明确隐藏。若移除隐藏而保留 active face，就会出现 tab 粉色面 + indicator 滑块两次强调。R7 `::after` 是冻结动画扫光，不是 indicator（[09-motion-and-user-surfaces.css:62–64](../src/style/09-motion-and-user-surfaces.css#L62-L64)），不得把它算作第三个滑块，也不改冻结层。

## 4. 可合并性

- **可合并：**横向像素款与竖向 rail 款共享基础方角、颜色 tokens、默认/hover/active/focus 状态，可合并共同状态骨架；方向差异用 `[data-orientation=vertical]` modifier 保留 list 的 padding/gap、装饰和局部布局。标准横向 page/toolbar 的 active 也统一覆盖 `data-active` 与 `aria-selected="true"`。
- **必须保留：**横向与竖向的轨道布局不同（不能把方向规则合并成无条件同一 padding）；Settings rail 的 lace/clip-path 属局部装饰；侧栏 folder rail 是独立融合结构，真实 `[role=tab]`、面板接缝、右侧粉脊不可并入普通 tabs-tab slot 样式；禁用态必须保留，不得 hover 提亮或 active 覆盖禁用元素。禁用态视觉数据未采集，需沿用应用语义/后续单独验证，不能凭空规定颜色。
- 最后一条 `e412…` 单次黑边与默认 active 的 `f156…` 不构成新家族；复核来源后作为局部例外，而不是拆第四种样式。

## 5. 收敛结论与 CSS 骨架

以**tab 状态规则**计，四者契约建议收敛为 **4 条**：① list 底槽；② tab 默认与 hover；③ tab active（`data-active` / `aria-selected` 共用）；④ indicator 在像素方案隐藏。垂直方向和 folder rail 是作用域 modifier/例外，不计作第五套通用规则。

骨架：`[data-slot=tabs-list]` 画 track；其直接子 `[data-slot=tabs-tab]` 管基础/`:hover:not([data-disabled],[aria-disabled=true])`/`:is([data-active],[aria-selected=true])`/`:focus-visible`；像素上下文的 `[data-slot=tab-indicator]` 设 `display:none`。vertical 用方向选择器覆盖轨道间距/装饰，SidePanel 保留 `.vrcx-0-side-panel-rail [role=tab]` 独立分支。

**Specificity 风险：**现有规则包含 `.vrcx-0-main-content .vrcx-0-page-scaffold …`、`:has()` 垂直 Settings scope 及 SidePanel 多段祖先选择器，优先级远高于裸 `[data-slot=…]`。若合并成 `:where()` 低 specificity 骨架，现有状态/utility 可能反压；保留结构 scope 或分层校验 cascade，再逐步降权。当前 active 横向声明含 `!important`，合并时不可默默删掉，否则背景、文字和 bevel 可能被旧规则覆盖。

## 6. 可视化

[打开 tabs-tab 状态预览](../preview/P1-G2-tabs-tab.html)：横向像素款、竖向 rail 款各显示默认未选中、hover、选中与 indicator 位置（标注“隐藏”）；纯内嵌 CSS，可离线双击浏览器打开。
