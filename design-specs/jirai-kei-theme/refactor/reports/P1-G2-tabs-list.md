# P1-G2 tabs-list 组件普查

> 范围仅限 `family=G2, component=tabs-list` 的容器外观；tab/indicator 只作为职责关系。Inventory paint fingerprint 不含盒模型，padding/gap/高度均不采集，不能从指纹臆测。

## 1. Inventory 全量记录

Inventory `variants` 中 tabs-list 共有两条记录（`component-variant-inventory.json:7695–7829, 7832–7916`）：

| primaryContext | 观察数 | 指纹数 | styleVariants（指纹 × 观察） |
|---|---:|---:|---|
| `surface:main-content` | 14 | 3 | `f9444e172a98963f` ×11；`c5e0e90cd5306c85` ×2；`046276fffcbc8566` ×1 |
| `surface:side-panel` | 37 | 1 | `f9444e172a98963f` ×37 |

主内容三个 computedStyle 的真实差异仅为 clip-path 与文字色：`f944…` clip-path `none`、color `rgb(227,210,245)`；`c5e…` 同色，clip-path 为 polygon（Inventory: 7722–7752、7755–7785）；`046…` 与 c5e…相同 polygon，但 color 为 `oklab(0.772417 0.0291363 -0.056142 / 0.72)`（7787–7817）。三者背景均 `rgb(32,25,54)`；四边均 `0.8px solid rgb(108,92,224)`；阴影均 `inset 1px 1px rgb(253,244,255), inset -1px -1px rgb(122,63,109)`。Inventory 中 padding、gap、高度：**未采集**。Side-panel 指纹同为 f944：相同背景、边框、阴影、clip-path none（7875–7907）；padding/gap/高度**未采集**。注意这些是状态/装饰差异，不足以形成三套底槽皮肤。

## 2. 样式层命中规则

以下列出样式层中直接命中 tabs-list、orientation，或专门用于 tabs-list 侧栏 rail 的规则。声明按源码压缩成逐项摘要；同规则中的 tab/indicator 子规则亦列出以明确底槽关系。

| 文件 / SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `02-foundation.css` / runtime / 93–96 | `.entity-dialog [data-slot="tabs-list"][class~="h-11"]::before` | 心形装饰：`content`、16×16、flex none、margin、粉色 mask；不画底槽 |
| `05-navigation.css` / side-panel / 84–86 | `.vrcx-0-side-panel .vrcx-0-side-panel-rail [data-slot='tabs-list']` | `padding-inline:0`，让 folder tabs 与面板齐边 |
| `06-panels-and-settings.css` / settings / 117–119 | `:root` | 定义 `--jk-px-cut` polygon |
| `06-panels-and-settings.css` / settings / 160 | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list]` | `position:relative; padding:3px 3px 12px; gap:1px; border:1px solid #6c5ce0; border-radius:0; background-color:#201936; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d; clip-path:var(--jk-px-cut)` |
| 同 / 162 | 同 list `::after` | rail 底部 lace：绝对定位，左右 3px、底 2px、高 8px，粉色半透明 mask |
| 同 / 165–170 | 同 list 子 `tab-indicator` / `tabs-tab` | indicator `display:none`；tab 静态透明、hover 紫底、active 粉底+暗边+inset bevel、focus outline（非 list 本体） |
| `11-controls-and-pages.css` / controls-r9 / 8–16 | `.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"])` | 横向：`gap:2px; padding:1px; border:1px solid #6c5ce0; border-radius:0; background-color:#201936; color:#e3d2f5; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d` |
| 同 / 17–19 | 横向 list 子 `[data-slot="tab-indicator"]` | `display:none` |
| 同 / 20–36 | 横向 list 直接子 tabs-tab、hover、active | tab 自己绘面：未选中透明；active 粉底、紫边、`inset 2px 2px #fdf4ff / -2px -2px #7a3f6d` |
| `11-controls-and-pages.css` / tools-ui-r9 / 405–413 | Chart vertical list 超长选择器（原文见源码） | `gap:2px; padding:1px; border:1px solid #6c5ce0; border-radius:0; background-color:#201936; color:#e3d2f5;` 同向凸起 inset bevel |
| 同 / 414–439 | Chart list 的 indicator / tabs-tab | indicator 隐藏；tab 透明、hover 紫、active 粉色 bevel、focus outline |
| `14-buttons-and-data.css` / buttons-badges-r10 / 58–62 | `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="tabs-list"]:where(:not(...))` | Embedded tabs list：`gap:2px; padding:1px; border:1px solid #6c5ce0; border-radius:0; background:#201936; color:#e3d2f5;` 同向凸起 bevel；排除 scaffold/toolbar/popover/sm card/context action；tab active 自己画面，indicator 隐藏 |
| `15-late-components.css` / cards-r97（文件内）/ 144–147 | 竖向 page-scaffold / chart 列表的 `:is(... )>[data-slot="tabs-list"]` | 覆写 `clip-path:var(--jk-r97-lace-cut)`；after 加 lace fringe；另在竖向 settings list 将 `padding-bottom` 改为 `3px`（147 行）。此为晚加载装饰覆盖，不改变底槽背景/边框/bevel |

侧栏 folder rail 还需结合 `05-navigation.css` 的真实结构与 role 规则：SECTION side-panel 60–71 说明 tabs 是右侧 folder rail、面板与 rail flush；84–86 清 inline padding；88–98 未选 tab 是 `#1d1631`、hover 用 `var(--wd-select)`；报告中核对文件 05 的后续 active 规则为三边 frame 与粉色右侧 spine。它不是普通 `[data-slot=tabs-tab]`：Tooltip 包装可能改写 slot，应保留 `[role='tab']` 语义选择器。侧栏具体 list 的背景/边框/gap 未由本层直接赋值（依赖基础组件/既有样式），故这里标为未见显式覆写，不能冒称为某个色值。

## 3. 核心结论与证据

### 视觉形态：三种用途，底槽皮肤两种

1. **横向像素款**（PageScaffold，11:8–16）：暗紫 `#201936`、紫色 1px 边框、padding 1px、gap 2px、方角、左上亮右下暗的**凸起** inset bevel。Inventory 指纹一致支持背景/边框/bevel，但不采集 padding/gap。
2. **竖向 rail 像素款**（Settings，06:160）：同底色、同紫框、`padding:3px 3px 12px`、`gap:1px`、`--jk-px-cut`，同样是凸起 bevel。Chart vertical（11:405–413）复用横向 `padding:1px; gap:2px`，其后缀 lace 修饰（15:144–147）。因此方向是必须区分的布局 modifier，竖向用途内部存在 settings 与 chart 的留白差异。
3. **SidePanel folder rail**（05:60–71,84–86）：是面板边缘的文件夹标签，列表 inline padding 0；list 本身没有本层设置的底槽背景/边框/gap，具体值未采集/未显式声明。Tab 与面板融边、右侧粉 spine 是独立结构，必须保留。不能把它误算成“第三种像素底槽”。

### clip-path 的像素切角

`--jk-px-cut` 定义于 `06-panels-and-settings.css:117–119`：polygon 在四角各切去 2×2 像素的方块阶梯，左上由 `(0,2)→(2,2)→(2,0)`，右上镜像，底部两角同理。它是以硬直角阶梯替代圆角的像素风裁切，不是圆弧；Settings list 实际使用见 06:160。它也用于 number-field-group（06:129）、outline toggle-group（06:148）、settings rail 内 card（06:177），以及 11:108、213 处带 fallback polygon 的页面控件。注意后期 15:144 又将竖向 tabs-list 的 clip-path 改成 `--jk-r97-lace-cut`，因此最终 cascade 中 lace-cut 覆盖 px-cut；变量使用状态应按上下文看。

### 凸起方向、滚动与重绘冲突

- 横向和 Settings 竖向 list bevel 完全一致：`inset 1px 1px #fdf4ff` 左上亮、`inset -1px -1px #7a3f6d` 右下暗，是凸起框，而非字段的凹陷。证据 11:8–16、06:160；inventory 7739、7772、7805、7894。
- 当前匹配样式中没有对 tabs-list 设置 `overflow` 或 `scrollbar`（全样式层 overflow 搜索结果没有 tabs-list 命中）。全局 scrollbar skin 在 06:204–220，但不等于 tabs-list 被设为可滚动。故无法从主题 CSS 证明横向 tab 过多会滚动；滚动行为应由组件/容器本身负责，不能声称由 list 规则启用。
- 没有双重 active 绘制：横向 pixel 和 embedded list 隐藏 `tab-indicator`（11:17–19；14:60–62），竖向 Settings/Chart 也隐藏（06:165；11:414–416）；list 画底槽，tab 画自身 active 面（11:32–36、06:169）。Tab 的选中边框围绕 tab 面，与 list 外框间有 gap/padding，不是同一条边重叠。侧栏 rail 另以融合三边框与 spine 呈现。

## 4. 合并判断与收敛建议

- 可合并：横向 pixel 与普通 embedded pixel 的共有色板、边框、bevel、tab state、indicator 隐藏；它们是同一底槽家族。Chart vertical 的背景、边框、bevel 也复用共同 tokens。
- 必须保留：横向/竖向方向与排布；Settings vertical 特有 3/3/12 留白和 lace 底饰；Chart vertical 的 1px/2px 尺寸与 r97 lace 覆盖；SidePanel folder rail 的 inline flush、panel 融边、真实 `[role=tab]` 及 spine。
- 建议按**三种使用形态**收敛（pixel-horizontal、pixel-vertical、panel-folder），但只有前两者共享“像素底槽”基础；panel-folder 不是第三个相同底槽。CSS 骨架：共享 `.pixel-tabs [data-slot=tabs-list]` 维护背景/边框/bevel，orientation modifier 分别管 gap/padding/clip/装饰；`.side-panel-rail [role=tab]` 独立融合样式。若将现有高 specificity scaffold/Chart 选择器降为低 specificity `:where()`，可能被旧规则或 utility 反压；必须核对 cascade，尤其 Chart `:has()` 长选择器与 late-components 144/147 覆盖，不可只靠统一低特异度选择器。

## 5. 可视化

[打开 tabs-list 三形态并排预览](../preview/P1-G2-tabs-list.html)：含 tab 与底槽关系，并放大展示阶梯切角。
