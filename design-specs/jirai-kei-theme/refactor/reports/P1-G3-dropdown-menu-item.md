# P1-G3 dropdown-menu-item 组件普查

## 1. Inventory 记录与 styleVariants

`family=G3` 中只有一条 `dropdown-menu-item` 记录：tag `div`、variant `default`、size `null`，primaryContext=`overlay:dropdown-menu-content`，observations=2，stateCount=1，styleFingerprintCount=2，route `/feed`（inventory 9125–9138）。这两种 fingerprint 是同一 context 下各观察 1 次，不是两种组件 variant。

| primaryContext | 观察数 | 指纹数 | fingerprint / 观察数 | 差异 computedStyle（仅列可见差异） |
|---|---:|---:|---|---|
| `overlay:dropdown-menu-content` | 2 | 2 | `73faa2f189f72703` / 1；`3a26c496669abd1f` / 1 | 前者 color `rgb(22,17,42)`、background `rgb(255,184,230)`、clip-path `polygon(6px 0px,100% 0px,calc(100% - 6px) 100%,0px 100%)`，box-shadow `rgb(255,217,238) 0px 1px ... inset, rgb(217,127,198) 0px -1px ... inset`；后者 color `rgb(242,235,255)`、background 透明、clip-path none、box-shadow none。 |

来源为 inventory 9128–9204。两 fingerprint 的 font-size 均 14px，font-weight 400；computedStyle 不包含 padding、gap、border-radius，均为**未采集**。边框四边宽度均 0，border-top-style solid；inventory 记录的其余边框色均 `rgb(108,92,224)`（9123–9203）。因此观察到的实质差异是普通/未高亮与粉色高亮外观，指纹数量不等于结构变体数量。

## 2. 样式层命中规则

在 16 个 `refactor/src/style/*.css` 中以具体 slot 与角色关键词检索，所有直接命中都集中在 `11-controls-and-pages.css` 的 `SECTION popups-r9`（216 起）。规则以浮层容器为祖先，作用于 menu / select / combobox 等多类，非仅 dropdown menu。

| 文件 / SECTION / 行 | 选择器（原样） | 实际声明 |
|---|---|---|
| `11-controls-and-pages.css` / `popups-r9` / 242–248 | `:is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-slot$="menu-item"],[data-slot$="menu-checkbox-item"],[data-slot$="menu-radio-item"],[data-slot$="menu-sub-trigger"],[data-slot="select-item"],[data-slot="combobox-item"],[data-slot="button"][data-variant="ghost"][class~="h-auto"][class~="justify-start"][class~="p-0"])` | `background:transparent; color:#f2ebff; border-radius:0; animation:none!important; transition:none!important` |
| 同上 / 249–256 | 同一容器与 item 组 + `:is(:hover,:focus-visible,[data-highlighted],[data-popup-open]):not([data-disabled]):not(:disabled):not([aria-disabled="true"])` | `background:#ffb8e6!important; color:#16112a!important; clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%); box-shadow:inset 0 1px 0 #ffd9ee,inset 0 -1px 0 #d97fc6` |
| 同上 / 257 | 容器后代 `:is(:focus-visible,[data-highlighted],[data-popup-open],[data-slot$="-item"]:hover,[data-slot$="-trigger"]:hover,[data-slot="button"][class~="h-auto"]:hover):not(disabled...)` 的 `.text-muted-foreground` 与 `[data-slot$="menu-shortcut"]` | `color:#2a1d6e!important` |
| 同上 / 258–262 | 容器后代 `[data-variant="destructive"]`（及其后代）；高亮 destructive 与其全部后代 | 默认 `color:#ff7fae!important`；高亮 `color:#16112a!important`，后代同色 |
| 同上 / 263–267 | 容器后代 `:is([data-disabled],[aria-disabled="true"],:disabled)` 及 `.text-muted-foreground` | item `color:#b9add9!important; background:transparent!important; opacity:1; clip-path:none; box-shadow:none`；muted 子元素同色 |
| 同上 / 279 | 容器后代 `:is([data-slot$="menu-item"],[data-slot="button"]):has(...)` | 对有 profile/avatar decoration 的菜单行 `clip-path:none!important`，防止裁切外部装饰 |

浮层边框契约仍是容器级，不应误记为 item 边框：同文件 220–230，容器 `border:1px solid #6c5ce0; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e`。

未检索到以 `role="menuitem"` 或 `dropdown-menu-item` 字面值单独匹配的额外样式规则；菜单家族靠 slot 后缀选择器覆盖：`menu-item`、`menu-checkbox-item`、`menu-radio-item`、`menu-sub-trigger`。主题没有对这些 item 另设 padding / gap / 图标尺寸规则。代码注释说明 wrappers 提供 6px content padding（249–250）；item 自身内边距并非主题在上述 item 规则中设置，来源应视为组件/utility 类（如运行时 `px-*` / `py-*`），本库存样式无法据此给出具体数值。icon 没有统一尺寸/颜色专属规则；继承文本色属于级联效果，不是图标槽规范。

## 3. 状态与关键问题

| 状态 | 触发 / 约束 | 背景 / 文字色 / 圆角 | 证据 |
|---|---|---|---|
| 默认 | 通用 item 规则 | 透明 / `#f2ebff` / `0` | 242–248 |
| Hover / 键盘高亮 | `:hover`、`:focus-visible`、`[data-highlighted]`、`[data-popup-open]`，并排除 disabled | `#ffb8e6` / `#16112a` / `0`（切角由 clip-path 实现，不是圆角） | 249–256 |
| 禁用 | `[data-disabled]`、`[aria-disabled="true"]`、`:disabled` | 透明 / `#b9add9` / 圆角没有重置，基础规则仍为 `0`；clip/shadow 清空 | 263–267、242–245 |
| 破坏性 | `[data-variant="destructive"]` | 默认背景沿用透明，文字 `#ff7fae`；圆角沿用 `0` | 258、242–245 |
| 破坏性 + 高亮 | destructive 高亮排除 disabled | 粉底 `#ffb8e6` / `#16112a`（含后代）/ `0` | 252–259、262 |

**键盘导航高亮没有失效问题**：主题不只用 `:hover`，同一条高亮规则明确包含 `[data-highlighted]` 与 `:focus-visible`，正好覆盖 Radix/Base UI 风格的键盘导航状态（251–256）。此外含 `[data-popup-open]`；这是扩展态，不应误认为仅 hover。

**Select 重合与风险**：同一条默认/高亮规则直接把 `[data-slot="select-item"]`、`[data-slot="combobox-item"]` 纳入菜单 item 的共同规则（242、251）。这与 `select-item` 的确重合；意味着对菜单项的通用样式变更也会影响 select/combobox。选择器通过显式列举并共享 `:is()`，不是 `$="menu-item"` 自然匹配 select-item。收敛时应拆清浮层容器集合与交互行基类，保留 select 视觉契约核验；避免把 role/menu 范围扩成全局，造成 specificity 与非菜单列表误命中。

## 4. 可合并性

- **可合并为共同基础 item 外观**：普通项、带图标项、checkbox/radio 项、sub-trigger 在默认文字/透明底/方角及交互高亮上共用基线；图标与右侧箭头应作为内容槽保留，不需要独立整行底色变体。
- **必须保留结构差异**：checkbox/radio 的勾选指示器与占位槽（主题当前未定义其图标规则，不能隐藏/重排）；sub-trigger 的箭头及其打开/展开行为；destructive 的警示色与高亮时对比修正；disabled 的可读低对比状态和禁用交互语义。
- **Select/combobox 可以共用部分视觉 token，但需要单独确认语义和间距**：当前皮肤已共用，inventory select-item 的默认 fingerprint 与 dropdown item 的未高亮样式共用 `3a26c496669abd1f`（inventory 9395–9403 对 select-item 的记录；menu 9174–9203），但不能据单一样本推断所有布局细节相同。

## 5. 收敛结论与建议骨架

收敛为 **1 种基础行 + 3 种语义修饰 + 1 种交互状态**：基础行；checkbox/radio 指示位、sub-trigger 箭头、destructive 警示（其中 destructive 是颜色修饰）；统一 hover/keyboard highlighted；disabled 独立覆盖交互态。建议骨架：在浮层范围下用 `:is([data-slot$="menu-item"],[data-slot$="menu-checkbox-item"],[data-slot$="menu-radio-item"],[data-slot$="menu-sub-trigger"],[data-slot="select-item"],[data-slot="combobox-item"])` 写 `background/color/border-radius` 基础值，再以 `:is(:hover,:focus-visible,[data-highlighted],[data-popup-open]):not(...)` 定义统一高亮，最后单列 disabled 与 destructive。保留勾选/箭头子节点原样。

合并选择器时要注意 specificity：外层 `:is(...)` 的 specificity 取其参数中最高值，叠加内层容器和状态；如果改用 `:where()` 或缩短选择器会降 specificity，现有 `!important`（高亮、disabled、destructive）与组件 utility 的覆盖关系也会变化。应以实测级联为准，不要无意扩大到全局 `[role="menuitem"]`。

## 6. 可视化

[打开 dropdown-menu-item 面板预览](../preview/P1-G3-dropdown-menu-item.html)。面板复用已核实的容器硬投影；含普通、图标、勾选、子菜单、禁用、破坏性项目，粉色高亮项展示 hover / keyboard highlighted 的共同表现。
