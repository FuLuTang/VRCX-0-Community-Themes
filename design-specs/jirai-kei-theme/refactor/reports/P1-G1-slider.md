# P1-G1 Slider 组件普查

## 1. Inventory 全量记录与 styleVariants

筛选条件为 `family=G1`、`component=slider`、`tag=div`（inventory 中 slider 没有 `span` 记录），共 **2 条组件记录、9 次观察、4 个 fingerprint**。注意：这些 computedStyle 是 slider 根 `div` 的样式，不是 track/range/thumb 子件；inventory 没采集这些部件的颜色、尺寸或阴影，不能把透明根背景误读为轨道外观。`routes` 是记录级，不会细分到各 fingerprint。

| primaryContext | 观察数 | 指纹数 | 记录路由 | fingerprint / observations | 轨道背景 / 已填充部分颜色 / 滑块尺寸 / 边框 / 阴影（inventory） |
|---|---:|---:|---|---|---|
| `overlay:sheet-popup` | 4 | 1 | `/charts/mutual` | `432850898dcd7eea` ×4 | 未采集 / 未采集 / 未采集 / 根 div 四边 0px（颜色 rgb(108, 92, 224)）/ 根 div `none` |
| `surface:main-content` | 5 | 3 | `/charts`、`/charts/mutual`、`/charts/timeline` | `1c4308b8ac99d4ac` ×3；`3a26c496669abd1f` ×1；`c30718c0ccb9a8b0` ×1 | 未采集 / 未采集 / 未采集 / 根 div 四边 0px（均 rgb(108, 92, 224)）/ 根 div `none` |

全部 4 个 variant 的根背景均为 `rgba(0,0,0,0)`，边框宽均 0、box-shadow 均 none；三项差异仅是继承/上下文文字属性：`1c430…` 与 `432850…` 的 color `rgb(242,235,255)`；`3a26…` 同色但 font-size 14px（常见 12px）；`c307…` color 与 text-decoration-color `rgb(185,173,217)`（且 12px）。所以**可观测的 inventory 数据没有任何霓虹轨道/填充/thumb 的证据**。`stateCount` 分别 1、4，但不代表皮肤态数。

## 2. theme.css 命中规则

以下是全文件中命中 range / slider 部件的规则。行号按当前 `theme.css`（5283 行）计。1993 组位于 `user-dialog-r8` 区段（该区段标题在 1961 行），通用组位于 `form-controls-r9`（3206 行）。

| SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `user-dialog-r8` / 1993–1999 | `[data-slot="dialog-content"].entity-dialog input[type="range"]` | `-webkit-appearance:none; appearance:none; height:16px; background:transparent; cursor:pointer`（明确不设 width/min-width，保留命中区域） |
| 同 / 2000–2005 | `[data-slot="dialog-content"].entity-dialog input[type="range"]::-webkit-slider-runnable-track` | `height:8px; background:#100b1e; border:1px solid #4b3a63; box-shadow:inset 0 1px 3px rgb(0 0 0 / 55%)` |
| 同 / 2006–2015 | `[data-slot="dialog-content"].entity-dialog input[type="range"]::-webkit-slider-thumb` | `appearance:none; width:16px; height:16px; margin-top:-5px; border:1px solid #21132d; border-radius:0; background:#ffd9ee; box-shadow:inset 0 0 0 2px #d97fc6, 0 1px 0 #f3add9` |
| 同 / 2016–2019 | `[data-slot="dialog-content"].entity-dialog input[type="range"]:focus-visible` | `outline:2px dashed #d6b8ef; outline-offset:3px` |
| `form-controls-r9` / 3258–3265 | `:where(input[type="range"]:not(.entity-dialog *))` | `appearance:none; -webkit-appearance:none; height:18px; margin:0; background:transparent; accent-color:#ffb8e6; cursor:pointer` |
| 同 / 3266–3270 | `:where(input[type="range"]:not(.entity-dialog *))::-webkit-slider-runnable-track` | `height:6px; border:1px solid #6c5ce0; border-radius:0; background:repeating-linear-gradient(90deg,#332650 0 3px,#211a33 3px 5px); box-shadow:inset 1px 1px #16112a` |
| 同 / 3271–3276 | `:where(input[type="range"]:not(.entity-dialog *))::-webkit-slider-thumb` | `appearance:none; -webkit-appearance:none; width:12px; height:12px; margin-top:-3px; border:1px solid #6c5ce0; border-radius:0; background:#ffb8e6; box-shadow:inset 1px 1px #fff0fa,inset -1px -1px #a44a8c` |
| 同 / 3277–3280 | `:where(input[type="range"])::-moz-range-track` | `height:4px; border:1px solid #6c5ce0; border-radius:0; background:repeating-linear-gradient(90deg,#332650 0 3px,#211a33 3px 5px)` |
| 同 / 3281–3284 | `:where(input[type="range"])::-moz-range-thumb` | `width:10px; height:10px; border:1px solid #6c5ce0; border-radius:0; background:#ffb8e6; box-shadow:inset 1px 1px #fff0fa,inset -1px -1px #a44a8c` |
| 同 / 3285–3290 | `:where([data-slot="slider-track"])` | `height:6px!important; border:1px solid #6c5ce0; border-radius:0!important; background:repeating-linear-gradient(90deg,#332650 0 3px,#211a33 3px 5px)!important; box-shadow:inset 1px 1px #16112a` |
| 同 / 3291–3293 | `:where([data-slot="slider-range"])` | `background:repeating-linear-gradient(90deg,#ffb8e6 0 3px,#f37fc4 3px 5px)!important` |
| 同 / 3294–3298 | `:where([data-slot="slider-thumb"])` | `width:12px!important; height:12px!important; border:1px solid #6c5ce0!important; border-radius:0!important; background:#ffb8e6!important; box-shadow:inset 1px 1px #fff0fa,inset -1px -1px #a44a8c!important` |
| 同 / 3301–3309（聚焦组） | `:where(... input[type="range"]:not(.entity-dialog *):focus-visible, [data-slot="slider"]:focus-visible [data-slot="slider-thumb"])` | `outline:2px solid #ff7fcf; outline-offset:2px` |

没有独立 `[data-slot="slider"]` 皮肤声明（仅在 focus-visible 组作为祖先条件）；也没有 `slider-track/range/thumb` 的页面路由专属覆盖。组件根 div 的 inventory 样式不能替代以上子件样式证据。

## 3. “暗紫像素风 vs 霓虹亮色”核验

**本组件不成立为“某路由嵌套里霓虹风格”的证据。** `/charts/mutual` 同时有 `overlay:sheet-popup`（4 次、1 指纹）和 `surface:main-content`（包含 1 次在该路由的记录、共 3 指纹）两种采样上下文；但它们根 div 都是透明背景、无边框、无阴影，唯一显著差别只是字色/字号，不能证明同一个 slider 的部件皮肤不同。CSS 里也没有以 `/charts`、`/charts/mutual`、`.charts-*` 等页面 wrapper 限定的霓虹 slider 规则。

确实存在**上下文隔离的两套原生 range 绘制**：`.entity-dialog` 下 16px 高 hit box、8px 暗轨、16px 柔粉 thumb（1993–2019）；其余原生 input 与 Base UI slider 使用 6px 条纹暗紫轨、12px 粉色 thumb、粉色条纹填充（3258–3298）。这是 CSS 注释明示的有意设计：entity dialog 规则保留其控件盒与命中区域，通用规则显式 `:not(.entity-dialog *)` 排除它（1990–1992、3258），避免共享规则抢占。浅粉色 `#ffb8e6/#ffd9ee` 是 thumb/进度填充，不是另一套霓虹容器主题；两种仍属于同一暗紫像素视觉语言。`!important` 用于 Base UI 子件以压过其组件默认样式，不是容器间主题分叉。

## 4. 合并与保留

| 项目 | 判断 | 依据 |
|---|---|---|
| inventory 4 个根 div fingerprints | 合并为一个结构基线，不设 4 种视觉变体 | 根的背景、边框宽和阴影完全一致；差异仅文字继承色/字号。 |
| Base UI slider-track/range/thumb 与普通原生 range | 可在设计 token/外观规范上合并成同一“标准像素滑块” | 暗紫条纹槽 + 粉色条纹进度 + 方形粉色滑块；但 DOM 适配器仍应分别覆盖 data-slot 子件与 WebKit/Mozilla 伪元素。 |
| entity-dialog 内原生 range | 保留专属尺寸/轨道细节覆盖，不视作霓虹风格 | 16/8/16px 与标准 18/6/12px 不同，且存在专门 hitbox 注释；限定 wrapper 有明确意图。可复用暗紫/粉色语义色 token。 |
| track 与已填充 range | 必须分别保留 | 进度填充随 value 改变，不能把 range 填充并入静态 track。 |
| slider 与进度条、范围选择器（双端/区间） | 语义上不可仅凭本 inventory 合并 | 本次只观测到 slider 根组件，未提供 range selection/进度条证据；若它们有不同交互语义，应独立映射/覆盖，不能冒称本次已确认。 |
| focus-visible | 保留正交状态 | Base UI thumb/通用原生 range 使用亮粉 outline（3301–3309）；entity-dialog 原生 range 为虚线淡紫 outline（2016–2019）。 |

## 5. 收敛结论与 CSS 骨架

视觉层建议收敛为 **1 种标准像素 slider + 1 个 entity-dialog 几何/轨道密度覆盖**（而非“暗紫 vs 霓虹”两套主题）；再把 focus-visible 作为交互状态单独管理。标准适配器分别挂到 `:where([data-slot="slider-track/range/thumb"])` 和 `:where(input[type="range"]...)` / 浏览器伪元素，统一 `--slider-track-*`、`--slider-fill-*`、`--slider-thumb-*` 颜色和方角像素边框；`.entity-dialog input[type="range"]` 只覆盖盒高、轨道厚度/底色、thumb 尺寸与专用焦点态。

**Specificity 注意：** 当前 Base UI 子件规则全包在 `:where()` 中，specificity 为零，却依赖若干 `!important` 与组件默认样式竞争；改成普通高权重 selector 或把 `.entity-dialog` 从原生 range 排除条件删掉，可能让通用标准尺寸覆盖 dialog hitbox，也可能被组件运行时样式反盖。重构应保留显式排除/覆盖关系，并对 `!important` 做逐项验证，不能只合并选择器文本。

## 6. 可视化

[打开并排 slider 预览](../preview/P1-G1-slider.html)：内嵌 CSS，呈现标准 Base UI、标准原生 range 与 entity-dialog 原生 range 的槽、真实填充色和滑块尺寸；填充比例为示意值，不伪称 inventory 实测值。
