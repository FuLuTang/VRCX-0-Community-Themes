# P1-G1 — field 容器普查

## 范围与结论摘要

范围限定为 inventory 中 `family=G1, component=field, tag=div` 的记录，以及样式层中 field 槽位相关选择器。label、description 在此只作为容器槽位契约的证据，不扩展为它们的独立普查。结论：**实测不能证明 field 容器有任何布局声明或横向变体**；inventory 的 `computedStyle` 未采集 `display`、`flex-direction`、`gap`、margin 或 grid 属性，样式层也没有 `[data-slot="field"]` / group / set 规则。两条 fingerprint 的唯一区别是 `border-bottom-width`（0.8px vs 0px），本身不构成布局变体。

## Inventory 全记录与变体

| primaryContext | observations | fingerprint 数 | 差异 computedStyle（仅列与布局有关项） |
|---|---:|---:|---|
| `surface:main-content` | 17 | 2 | display / flex-direction / gap / margin / grid：**未采集**；两种 fingerprint 都没有这些键。 |

唯一记录：`family=G1`、`component=field`、`tag=div`、`variant=null`、`size=null`、`stateCount=1`、route `/settings`。记录在 inventory 第 358–445 行；primaryContext / observation 数 / fingerprint 数在第 361–371 行，两个变体在第 372–438 行。

| fingerprint | observations | 与另一变体实际差异 |
|---|---:|---|
| `ec19b8766bfcae2b` | 12 | `border-bottom-width: 0.8px` |
| `3a26c496669abd1f` | 5 | `border-bottom-width: 0px` |

两者其余已列 computedStyle 一致，包括透明背景、其余三边 border 宽度 0px、无 box-shadow、字体 14px / 400、文字色 `rgb(242, 235, 255)`；完整值见 inventory 第 376–403、409–437 行。这里的 `0.8px` 是采样 computed style，不应据此推断 CSS 原始声明写了 0.8px（可能是缩放或计算后的值）。

## 样式层命中规则

下列行号为对应样式文件内行号。全文搜索 16 个 `refactor/src/style/*.css` 文件后，field 槽位相关规则仅有以下命中；没有 `[data-slot="field"]`、`field-group`、`field-set` 规则。

| 文件 / SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 48 | `:where([data-slot="field-label"]), :where([data-slot="label"])` | `color:#e3d2f5` |
| 同上 / 49 | `:where([data-slot="field-description"])` | `color:#b9add9` |
| 同上 / 50 | `:where([data-slot="field-error"]:not([data-vrcx-0-surface="login-page"] *))` | `color:#ff8fae` |
| `10-login-and-dialogs.css` / `login-r8` / 226–228 | `[data-vrcx-0-surface="login-page"] [data-slot="field-error"]` | `color:#ff9eb5`（登录页专属覆盖） |

字段控件的视觉框不是 field 容器规则：`13-toolbar-overlays-and-pages.css` 第 71–79 行将输入控件与 input-group 共用背景 `#201936`、`1px solid #6c5ce0`、`border-radius:0` 和 `var(--jk-field-inset)`；变量在第 7–10 行定义。它只画 control/组框，不负责 label-control-description 的排布。

## 布局职责与槽位契约

- **display flex 还是 grid：未能由仓库证据确定。** field 容器本身没有命中样式规则；inventory 未采集 display/flex/grid 属性。不能把“常见组件库通常竖排”当作本项目事实。
- **纵向间距由谁提供、数值多少：未采集/未在样式层定义。** 未找到 field 容器、field-label 或 field-description 的 gap/margin 规则。槽位的实际间距可能来自未纳入本次数据的基础/组件默认样式或 DOM class，但现有证据无法归属或给值。
- **横向变体：没有本次 inventory 记录或样式层规则证据。** 因此无法确认实际存在；不可臆造 `data-orientation` 等标记。若后续页面实测存在，应保留为独立布局变体，而非混进默认纵向规则。
- **三个槽位的语义契约**：label 是字段名称，control 是输入/选择控件本体，description 是辅助说明；容器负责把三者组织成一个字段组，但本次代码证据没有确定具体布局实现/间距。视觉可确认的文字层级为 label `#e3d2f5`，description `#b9add9`，均是独立的颜色选择器（13 文件第 48–49 行）。
- **description 字号核实**：inventory 的 field-description 独立记录（第 448–501 行）只有一个 fingerprint、11 次 observations；`font-size` 是 **14px**，不是 12px，文字色为 `rgb(185, 173, 217)`，见第 463–493 行。样式层未对它设 `font-size`，只有第 49 行颜色规则，所以当前只能说采样 computed style 为 14px，字号看起来继承/由别处提供；颜色则由该选择器明确独立设置。

## 合并判断与收敛建议

- **可合并**：两个 field fingerprint 的布局相关样式全部缺失且已采集字段一致；如果后续证实只剩边框底线差异，建议由一个基础 field 规则承载共同布局，再用明确的上下文/状态选择器表达那条底边差异。不能把差异误当成 field 布局变体。
- **必须保留**：若确有横向 label/control 布局，应保留独立方向变体；field-group / field-set 是分组语义容器，不等同单字段，不能合并成普通 field。错误态必须保留：通用 field-error 与 login-r8 的颜色不同（`#ff8fae` vs `#ff9eb5`），且输入控件的 invalid/focus 样式另在 13 文件第 80–81 行及 10 文件第 219–224 行。
- **收敛结论**：按当前可证实的“布局”收敛为 **1 种默认 field 布局**；横向布局、field-group/set 不计入已观测变体，待有 DOM/computed layout 证据后再决定额外种类。fingerprint 的边框底线差异需单独保留为装饰/上下文差异，不足以增加布局种类。
- **CSS 骨架（待实测布局值，不伪造）**：`[data-slot="field"] { /* 依据 DOM 实测后声明 display 与 gap */ }`；`[data-slot="field-label"]` 与 `[data-slot="field-description"]` 仅承载文字层级，control 继续复用既有 input 样式；横向变体如证实再单独加方向选择器。`:where()` 会将 specificity 降到 0，新增合并规则时应优先沿用低 specificity；若用更具体的上下文选择器覆盖，需留意它会压过基础规则，错误态与 login-r8 专属颜色也应作为有意保留的覆盖关系。

## 可视化说明

配套 HTML 展示纵向字段与横向 label/control 结构，复用真实主题颜色和控件边框/阴影。由于仓库证据未提供容器 gap、横向规则或 description 的 margin，示意使用的间距仅为**明确标注的原型占位值**，不能当作项目实测值；需以目标页面 DOM/computed layout 补证后才能定稿。
