# P1-G3 select-item 组件普查

## 1. Inventory：全部记录与 styleVariants

G3 中 `select-item` 只有一条组件记录：tag `div`、variant/size 为 `null`、primaryContext=`overlay:select-content`、4 次观察、stateCount=1、2 个 style fingerprint，路由 `/favorites/worlds`（inventory 9382–9395）。其完整 variants 位于 9396–9462；同一 primaryContext 的 contextTrail 记录 4 次（9464–9469）。

| primaryContext | 观察数 | 指纹数 | fingerprint / 观察数 | 有差异的 computedStyle |
|---|---:|---:|---|---|
| `overlay:select-content` | 4 | 2 | `3a26c496669abd1f` / 3；`73faa2f189f72703` / 1 | `3a…` 普通：color `rgb(242, 235, 255)`、background 透明、box-shadow none、clip-path none；`73…` 高亮：color `rgb(22, 17, 42)`、background `rgb(255, 184, 230)`、box-shadow 粉色上下内线、clip-path `polygon(6px 0px, 100% 0px, calc(100% - 6px) 100%, 0px 100%)`（9398–9461）。两者 font-size 均 14px、font-weight 400；边框各边均 0px。 |

`padding`、`gap`、`border-radius`、图标尺寸：**未采集**（inventory paintFingerprintProperties 仅含 paint/font 等属性，8–37；variants 的 computedStyle 也无这些键）。因此不能由指纹反推布局或子图标尺寸。指纹差异与菜单前作观察一致，表现为常态/高亮，不足以证明独立视觉变体。

## 2. 样式层命中规则与 menu 并排

全 16 个 `refactor/src/style/*.css` 中，直接涉及 select item 的通用规则集中在 `11-controls-and-pages.css`，SECTION `popups-r9`。下表同时列出前作列举的 menu-item 规则，便于核对（行号为当前文件行号）。

| 行 | 选择器范围 | 声明 / 对 select-item 的意义 |
|---|---|---|
| 242–248 | 浮层容器 `:is(menu-content, menu-sub-content, popover-content, select-content, combobox-content)` 下，item `:is(menu-item, menu-checkbox-item, menu-radio-item, menu-sub-trigger, select-item, combobox-item, 特定 ghost button)` | `background:transparent; color:#f2ebff; border-radius:0; animation:none!important; transition:none!important`。select/menu **完全共享同一条规则**。 |
| 251–256 | 同一容器、同一 item 集合；`:is(:hover,:focus-visible,[data-highlighted],[data-popup-open])`，排除 disabled | `background:#ffb8e6!important; color:#16112a!important; clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%); box-shadow:inset 0 1px 0 #ffd9ee,inset 0 -1px 0 #d97fc6`。四种状态钩子共同命中 select/menu。 |
| 257 | 容器内 focus/highlight/open/hover 子树中的 `.text-muted-foreground`、`[data-slot$="menu-shortcut"]` | `color:#2a1d6e!important`。其中 shortcut 是 menu 专属语义；对 select 内匹配到的 muted 子元素同样会影响颜色。 |
| 258–262 | 容器内 `[data-variant="destructive"]` 及其后代；destructive 的 hover/focus/highlight | 默认 `color:#ff7fae!important`；高亮色与全部后代 `#16112a!important`。选择器不是 menu-item 专属，若 select item 带该 variant 也会命中；inventory 没有证据显示实际 select destructive 项。 |
| 263–267 | 容器内 `[data-disabled]`、`[aria-disabled="true"]`、`:disabled` | item `color:#b9add9!important; background:transparent!important; opacity:1; clip-path:none; box-shadow:none`，muted 子元素同色。menu/select 共用。 |
| 273–276、285 | 五类浮层容器内 avatar / avatar-image | avatar 壳方角、透明、清影；未带外部装饰的 image/fallback 用 `--wd-avatar-cut-sm`（`data-size="lg"` 用 `--wd-avatar-cut`）；avatar-image 禁动画。适用于 select-content，所以 select 的头像也被裁切，但没有尺寸设置。 |
| 279 | 浮层内 `:is([data-slot$="menu-item"],[data-slot="button"]):has(外部 profile decoration)` | `clip-path:none!important`，避免行裁掉成员装饰。**不含 `[data-slot="select-item"]`**，属于 menu item 例外；select-item 带同类装饰时，行级高亮 clip-path 可能裁掉内容。 |

浮层边框是容器级（220–230），不是 item 规则：`border:1px solid #6c5ce0; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e`。

## 3. 核心判断

### 共用程度与例外

- **完全共享**：基础项规则 242–248 与高亮规则 251–256 的同一选择器均显式包含 `[data-slot="select-item"]` 和菜单项集合；并非靠相似样式推断。禁用规则 263–267 也在 select-content/menu 容器内统一生效。menu/select 的共同状态外观可合并维护。
- **选择器层面的 menu 语义专属**：`[data-slot$="menu-shortcut"]`（257）和 `menu-item` 外部装饰裁切豁免（279）；后者必须单独保留，不能误称 select 与 menu 完全等价。
- **destructive 规则（258–262）**并未把目标限定为 menu item，因此理论上 select-item 也受其影响；但没有观察到 select 实际 destructive variant。保留此通用语义覆盖，不应据此为 select 新造变体。

### 状态、checked 与勾选指示器

menu-item 有 destructive 与 hover/focus-visible/`[data-highlighted]`/`[data-popup-open]` 状态覆盖（251–262）。select-item 在相同基础/高亮规则中也支持四种高亮钩子，并继承 disabled 规则（251–267）；没有 select-item 专有的 `[data-state="checked"]` 规则。样式层没有针对 checked 状态或勾选指示位的专门选择器/声明（popups-r9 216–285）。因此选中勾勾由组件 DOM/SVG/图标自身提供，主题没有定制它的尺寸、颜色或定位；主题色可能通过继承文本色间接影响其颜色，但没有专门规则，实际外观由组件/utility 默认决定。Inventory 不采集图标尺寸，不能定量断言。

### 左侧自定义图标/头像

没有 select-item 子图标统一尺寸或 gap 规则（242–267）；图标若继承父级文字色只是级联结果。头像不是完全无主题处理：浮层下 avatar 壳与图片裁切规则覆盖 select-content（273–276、285），但不指定头像大小。对带外部装饰的整行，菜单 `menu-item` 有免裁切例外 279，select-item 没有；合并后应明确补充 select-item 对应例外，或按 DOM 结构避免在高亮行上 clip 内容。

### Padding 来源

主题的 item 基础/状态规则均未设置 padding（242–267）；注释只说明 wrapper 提供 6px content padding（249–250）。Inventory 的 padding 未采集。故 item 自身 padding 应归组件/utility（例如运行时类）控制，而不是声称由主题指定；无法从此库存确定具体数值。

## 4. 可合并与必须保留

- **可合并**：普通行、图标内容行的整行基础外观与 hover/键盘高亮；通用 disabled 外观；方角与静态动效。这些当前已经是同一条选择器规则。
- **需保留语义分支**：checked 指示槽/勾选内容，不要把它当作整行勾选背景，且不要隐藏或重排；图标槽留给组件，不统一强改尺寸；头像基础裁切单独按 avatar 子节点规则处理；带外部装饰头像的行级免裁切需要 select-specific 覆盖；disabled 必须优先于高亮，保持透明底与可读文字；destructive 作为语义颜色修饰保留（即使 select 当前没观察到）。

## 5. 收敛结论

结论：**保留一条共同基础 item 规则，不再拆成 select/menu 两条重复基础规则**；但不要把所有例外也揉进同一 selector：checked 指示器留组件自身，头像子项规则单列，并给 select 外部装饰行补独立 `:has(...) { clip-path:none!important }` 豁免，menu shortcut/destructive/disabled 语义规则按需独立。当前共享规则显式列出 select/menu slots，优于扩大到全局 `[role]`。

建议骨架：浮层范围内 `:is([data-slot$="menu-item"], … ,[data-slot="select-item"],[data-slot="combobox-item"])` 定义 `background/color/border-radius/animation/transition`；同一个 item 集合接 `:is(:hover,:focus-visible,[data-highlighted],[data-popup-open]):not(...)` 定义高亮；disabled/destructive 独立覆盖，checked 指示器保持原组件槽位。合并或改写选择器需注意 specificity：`:is()` 取参数中最高 specificity，容器祖先和状态伪类继续叠加；若改为 `:where()` 或缩短/扩大选择器，可能降低/改变优先级，影响 utility 与现有 `!important` 覆盖顺序，必须实测级联。

## 6. 可视化

[打开 select-item 面板预览](../preview/P1-G3-select-item.html)。内含普通、勾选、图标、头像、禁用与高亮行；勾选图形仅作为示意内容呈现，不表示主题已有勾选规则。
