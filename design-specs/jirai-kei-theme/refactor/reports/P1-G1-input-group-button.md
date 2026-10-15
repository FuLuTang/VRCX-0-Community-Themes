# P1-G1：input-group-button 普查

> 范围：inventory 中 `family=G1`、`component=input-group-button`；样式层仅查找该 slot 及 input-group 内按钮规则。行号按当前 refactor/src/style 文件复核。

## Inventory 全量记录与变体

inventory 中只有 **1 条聚合记录**（JSON 行 1126–1180），没有其他 `component=input-group-button` 记录。

| primaryContext | observations | styleFingerprintCount | 变体摘要 |
|---|---:|---:|---|
| `surface:main-content` | 2 | 1 | `ghost` / `icon-xs`，route `/charts/two-person` |

此记录只有一个 `styleVariants`，fingerprint `ce80affb2779ed4b`（2 observations）。computedStyle（JSON 行 1144–1172）：文字 `rgb(185, 173, 217)`；背景透明；四边 border width 均为 `0.8px`、style `solid`、颜色透明；box-shadow 为透明/无可见阴影；outline width `2.4px`、style `none`；opacity `1`、filter/transform/clip-path 均为 none；font-size `14px`、font-weight `500`。**边框宽度存在但边框颜色透明，不等于可见边框。**尺寸（width/height）、padding、border-radius：**未采集**。因此本记录不支持推断实际像素尺寸或圆角数值。

## 命中规则与声明

下表是样式层对组件直接命中的全部专属规则，以及 input-group 后代通用 button 命中规则。前两条使用 `[data-slot="input-group-button"]`；Chart 特例以 `[data-slot="button"]` 命中（该 button 同时属于输入组中的按钮）。

| 文件 / SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 26–28 | `.vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *) [data-slot="input-group-button"]` | `border-radius:0; color:#16112a; background:#ffb8e6; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d` |
| `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 29 | 上一行同一长上下文 + `[data-slot="input-group-button"]:focus-visible` | `outline:2px solid #ff7fcf; outline-offset:1px` |
| `11-controls-and-pages.css` / SECTION（文件顶部定义）/ 392–397 | `.vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-slot="button"]` | `border-radius:0; color:#16112a; background-color:#ffb8e6; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d` |
| `11-controls-and-pages.css` / 同上 / 398–401 | Chart 长上下文 + `[data-slot="button"]:focus-visible` | `outline:2px solid #ff7fcf; outline-offset:1px` |
| `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 14–20 | page-toolbar input-group 的外框与 `:focus-within` | group 的 focus 环 `outline:2px solid #ff7fcf; outline-offset:1px; z-index:2`；组外框背景 `#201936`、`1px solid #6c5ce0`、方角及 `var(--jk-field-inset)` 见 71–79 |
| `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 47 | `:where([data-slot="input-group"]:focus-within)` | 通用 group focus 环 `outline:2px solid #ff7fcf; outline-offset:1px` |

全局按钮皮肤也会命中拥有 `[data-slot="button"][data-variant]` 的组内按钮：`14-buttons-and-data.css` 的 SECTION `buttons-badges-r10`，7–10 负责 common square corners/bevel/transition；12–25 分 default、outline/secondary、ghost、destructive、link 变体以及 hover、active、focus-visible。ghost 按钮常态透明（17），hover 为 `#392a52` / `#fff0fa` 并加 inset bevel（18）；active 使用 `var(--jk-button-pressed)` 并位移 1px（24）；focus outline 为粉色但 offset **2px**（25）。组件专属 input-group 规则则把组内按钮覆盖成粉色主按钮皮肤。按钮基础 token 定义见 `02-foundation.css:10–15`。

样式层不存在另一个“input-group 后代任意 `button`”专属规则；addon 内的 dropdown trigger 规则（`13-toolbar-overlays-and-pages.css:32–39`）是 addon 的独立按钮，不应误算作 input-group-button。Chart 特例的 input-group 子按钮按 `[data-slot="button"]` 而非 input-group-button slot 定位。

## 核心判断

1. **不是完全复用全局皮肤。**普通 page-toolbar 组内有专属规则，直接覆盖方角、前景色、粉色背景和 bevel（`13:26–28`）；Chart 输入组另有同等专属覆盖（`11:392–397`）。基础通用按钮规则仍提供默认交互/variant 属性，但组内静态皮肤不是单纯继承全局按钮皮肤。
2. **边框接缝目前不会形成可见双线。**外框自身画边框（B1 的 `13:74–78`），group control 被明确设为透明背景且 `box-shadow:none`（`13:22–24`）。按钮专属皮肤没有 `border` 或 `border-color` 声明（`13:26–28`；Chart `11:392–397` 也无 border）。inventory 实测按钮四边虽有 `0.8px solid`，颜色全透明（JSON `1147–1158`），因此现状没有可见的按钮边框叠加组边框。换成 B3 外框时仍应维持组内按钮无可见 border，不能让其自带实体边线。
3. **高度：本组件数据未采集到 computed height/padding。**样式层按钮专属规则没有设 height/min-height/padding（`13:26–28`、`11:392–397`）；由组件自身尺寸 utility/按钮基础样式及输入组布局决定，不能据此宣称主题显式设置了组高或按钮高度。inventory 仅记 `size=icon-xs` 标签，不代表采集了实际尺寸。
4. **焦点可能双环，属于真实的重复指示。**焦点落在输入组按钮时，group `:focus-within` 有粉环（`13:18–20` 或 `13:47`；Chart `11:372–375`），按钮自身 `:focus-visible` 也有粉色 outline（`13:29` / `11:398–401`）。另全局按钮 focus 规则也有粉色环（`14:25`），但专属选择器更长，且同色视觉效果叠在近邻偏移处。结果是 group 外缘 offset 1px + button 外缘 offset 1px 的两道轮廓，可能局部相近/拥挤；全局 focus offset 2px 在普通情况也可能加重。建议组内按钮保留清晰键盘焦点、但避免同时把 group 环和 button 环重复绘制：可选择由 group 环承载组内焦点，或只对组内按钮抑制其自身 outline；不应影响组外按钮。
5. **hover/active 不完全一致。**组内按钮的正常态被专属规则变成粉色填充，但专属规则没有 hover/active 声明，因此交互态主要由通用按钮 variant 规则处理；inventory 中该按钮是 `ghost`，全局 ghost hover 倾向深紫底（`14:17–18`），active 为按下阴影/位移（`14:24`）。工具栏独立按钮则按自身 variant 使用全局 variant 皮肤（`14:12–25`），视觉语义并不保证与组内粉色常态一致；组内粉色静态覆盖与 ghost hover 组合还可能出现跳色，需在重构时显式决定是否统一。Chart 超长选择器会覆盖静态颜色，并因 specificity 高于普通 variant 规则而可能令 hover 背景难以覆盖；要合并必须处理此特例。

## 合并边界与收敛建议

- **可合并：**普通操作型输入组按钮的共同方角、无独立边框、组高度对齐方式、focus 语义，以及默认/hover/active 的基础反馈。纯图标按钮和带文字按钮不必各造一套皮肤，可共享外观；尺寸差异应由既有 icon/text size 属性或内容布局承担，而不是再复制视觉主题规则。
- **必须保留语义差异：**破坏性“清除”若确为清空/删除动作，应保留 destructive 语义（颜色/hover 不应被普通 submit 覆盖）；提交按钮可使用默认主按钮视觉；格式栏 toggle 必须区分未选中、hover、pressed/selected 状态，不能与瞬时提交按钮合并为同一种状态模型。inventory 目前只观测到 ghost icon-xs，未覆盖这些角色，以上是保留原则，不是声称本记录已证实具体角色样式。
- **建议收敛为 3 种语义状态族：**(1) 普通/提交；(2) destructive 清除；(3) toggle（含 selected）。图标/文字是呈现形态，不增加皮肤种类。若清除只是可撤销的关闭而非破坏性动作，允许归入普通族，需由产品语义确认。
- **CSS 骨架：**以 `:where([data-slot="input-group"]) [data-slot="input-group-button"]` 统一无边框、方角、组内高度/对齐和基础 focus；再按 `[data-variant="destructive"]` 与 `:is([aria-pressed="true"],[data-pressed])` 分出危险态、toggle 态，submit/default 保留全局按钮 token。B3 只由 group 外框画四边斜面，button 继续 `border:0`/无可见边线、避免接缝双线。
- **Specificity 风险：**当前页面规则含 `.vrcx-0-main-content`、`#chart`、`:has()` 等超长上下文（`13:26`、`11:392`），specificity 远高于简短 slot 选择器；简单抽取/合并规则可能被它们盖住，尤其 Chart 的粉色底与 hover/variant。应删除/归并这些重复长规则，或在统一层明确限定/调整级联顺序；避免靠再堆更长选择器解决。

## HTML 可视化

同一组前置图标、尾部清除、尾部提交、两段按钮场景并排比较 B1 与 B3 外框；CSS 内嵌，可直接双击打开。[可视化文件](../preview/P1-G1-input-group-button.html)。
