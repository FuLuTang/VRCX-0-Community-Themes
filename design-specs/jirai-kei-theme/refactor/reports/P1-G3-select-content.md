# P1-G3 Select-content 组件普查

## 1. Inventory 变体

Inventory 中 `family=G3` 的 `select-content` 是 `div`，组件级观察 1 次、1 个 fingerprint，路由 `/favorites/worlds`，上下文 `overlay:select-content`。注意：该组件本身只有一条 variant；相邻的 `select-item` 是另一个组件，不计入本表。

| Fingerprint | 观察数 | primaryContext | 背景 | 边框 | 阴影 | 圆角 | 内边距 | 最大高度 | z-index |
|---|---:|---|---|---|---|---|---|---|---|
| `876e4321a6f50b50` | 1 | `overlay:select-content` | `rgb(33, 26, 51)` | 四边 `0.8px solid rgb(108, 92, 224)` | `inset 1px 1px 0 rgb(105,85,124), inset -1px -1px 0 rgb(122,63,109), 3px 3px 0 rgb(16,11,30)` | computedStyle 未提供 | computedStyle 未提供 | 未提供 | 未提供 |

其他可用 computedStyle：文字色 `rgb(242,235,255)`、`opacity:1`、`transform:none`、`filter:none`、`clip-path:none`、字体 `16px / 400`。该单样本不能证明所有弹出上下文有相同实现，但现有主题已为 select 与 combobox 共用浮层皮肤。

## 2. theme.css 命中规则

在 `theme.css` 中搜索 `select-content` / `combobox-content` 及相关 item、label、separator 槽。命中样式集中于 `SECTION popups-r9`；由于浮层可以 portal 到 `body`，这些规则以全局 data-slot 为入口，不依赖页面 surface 祖先。以下列出该组中直接作用于 select/combobox 浮层及其子元素的规则；同一选择器组还包含 menu/popover 伙伴，故保留原选择器形状。

| SECTION / 行 | 选择器（原样或简写） | 实际声明 |
|---|---|---|
| `popups-r9` / 2660–2671 | `:is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"])` | `--radius:0px; background:#211a33!important; color:#f2ebff; opacity:1; border:1px solid #6c5ce0; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e; backdrop-filter:none; animation:none!important; transition:none!important` |
| 同 / 2673 | select/combobox/menu content `::before` | `backdrop-filter:none; border-radius:0` |
| 同 / 2675–2681 | select/combobox content 后代 label (`select-label`, `combobox-label`) | `color:#ffd9ee; background:linear-gradient(#ffb8e6,#ffb8e6) 7px center / 7px 7px no-repeat #302344; padding-left:22px; border-bottom:1px solid #6c5ce0; font-weight:600` |
| 同 / 2682–2688 | select/combobox item（及 menu item 伙伴） | `background:transparent; color:#f2ebff; border-radius:0; animation:none!important; transition:none!important` |
| 同 / 2691–2696 | item 的 `:hover,:focus-visible,[data-highlighted],[data-popup-open]`，排除 disabled | `background:#ffb8e6!important; color:#16112a!important; clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%); box-shadow:inset 0 1px 0 #ffd9ee,inset 0 -1px 0 #d97fc6` |
| 同 / 2697 | 高亮 item 内 muted text / shortcut | `color:#2a1d6e!important` |
| 同 / 2704–2707 | disabled item | `color:#b9add9!important; background:transparent!important; opacity:1; clip-path:none; box-shadow:none`；muted 后代同色 |
| 同 / 2708 | select/combobox separator | `background:repeating-linear-gradient(90deg,#8c71b0 0 1px,transparent 1px 3px); border:0` |
| 同 / 2728–2729 | `@media (prefers-reduced-motion:reduce)` 下浮层 | `animation:none!important; transition:none!important` |

动画/定位核查：`popups-r9` 的明确策略是“不添加动效”，浮层规则显式禁用 `animation` 与 `transition`。全文件没有 select/combobox content 的专属 `position`、`transform`、`@keyframes` 引用；inventory 此样本 `transform:none`。2660 附近注释特别声明不要触碰 positioner/select-content `::after`（由 host 管理），因此定位仍交给组件/positioner，不应在重构中接管。无相关 keyframes 名称可记录。通用原生滚动条规则在 `SECTION pixel-controls` / 1342–1358：全局 `::-webkit-scrollbar`、`::-webkit-scrollbar-track`（14px、暗紫轨道及内描边）与 thumb 造型，以及 `[data-slot=scroll-area-scrollbar]` 专属轨道样式；它们不是 select-content 局部规则，是否作用取决于浮层内部是否实际使用原生滚动容器或 ScrollArea。当前浮层规则未单独声明 scrollbar。

## 3. 合并判断

- **默认浮层面板：合并。** 唯一 fingerprint 与共用 CSS 面板色、边框、方角、三层阴影一致；`select-content` 与 `combobox-content` 应共用一个浮层基类。Inventory 未给 padding / max-height / z-index，不能据此追加/合并这些值；保留组件运行时的尺寸与定位职责。
- **打开态：** 这是浮层本身的存在/显隐与定位状态，不是额外皮肤变体。保持 host positioner、开合生命周期和 stacking 管理，不写新 `position` / `transform` / 动画覆盖。
- **选中项高亮：必须保留语义状态。** 当前规则把 hover、键盘 focus-visible、Base UI highlighted / popup-open 统一为粉底暗字斜切条；不要把它并入默认 item。若之后发现“已选中”由独立 `data-selected`/ARIA 属性表示，应另核实，现有样本及规则不足以推断。
- **分组标签：必须保留为子元素样式。** label 的粉色方块、标题色、底线是结构语义，不是浮层容器变体。
- **滚动条轨道：保留全局/ScrollArea 专属规则，不复制进 select-content。** 避免给不存在的滚动区域增加固定装饰；若组件实际使用原生 overflow，则全局 WebKit scrollbar 规则会自然作用。
- 当前 `!important`（面板底色、圆角和高亮色）会压过组件类/普通属性。把规则迁入低优先级的 `:where()` 或减掉 `!important` 时，务必对照运行时类声明与 portal 节点的来源层叠；否则会改变具体底色/高亮。精简 selector list 也可能改变 specificity：`:is()` 取参数中最高 specificity，因此新选择器应避免无意提升/降低竞争力。

## 4. 收敛结论与骨架

**容器收敛为 1 种基础外观**（select 与 combobox 共用），其上保留高亮交互态和 label / separator 子元素语义样式；不把这些状态误算成额外容器指纹。建议骨架：`:is([data-slot="select-content"],[data-slot="combobox-content"])` 集中面板 `background/color/border/border-radius/box-shadow/backdrop-filter`；后代 `:is([data-slot="select-item"],[data-slot="combobox-item"])` 管默认与 `:is(:hover,:focus-visible,[data-highlighted])` 高亮，label、separator 独立规则。保留 positioner 原生职责及现有必要的层叠优先级。

## 5. 可视化

[打开 select-content 浮层预览](../preview/P1-G3-select-content.html)：内嵌 CSS 的独立 HTML，展示分组标题、多个选项、选中高亮及滚动条轨道示意。
