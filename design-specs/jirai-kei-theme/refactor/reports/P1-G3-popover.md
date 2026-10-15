# P1-G3：popover-content 普查

## 范围与 inventory

只统计 `family=G3, component=popover-content`；同族 `popover-trigger` 是触发/开合入口，不是面板表面，不能把 trigger 的按钮状态并入 content 变体。inventory 唯一记录：`tag=div`、`variant/size=null`、`primaryContext=overlay:popover-content`、`observations=1`、`stateCount=1`、route `/browse-history`、`styleFingerprintCount=1`。证据：`baseline/reports/component-variant-inventory.json:9270–9285`。

| primaryContext | 观察数 | 指纹数 | 观察到的样式差异（computedStyle） |
|---|---:|---:|---|
| overlay:popover-content | 1 | 1 | 没有同 context 内部的差异。该唯一指纹：背景 `rgb(33, 26, 51)`；四边 `0.8px solid rgb(108, 92, 224)`；阴影 `inset 1px 1px 0 rgb(105,85,124), inset -1px -1px 0 rgb(122,63,109), 3px 3px 0 rgb(16,11,30)`；前景 `rgb(242,235,255)`。证据：`...json:9286–9315`。 |

内边距、最大宽/高、overflow、动画属性均**未采集**：inventory 的 fingerprint property 列表没有这些字段（`:8–36`），不能从这条样本外推。样本里阴影及边框与共用浮层规则完全吻合。

## 样式层命中规则

以下列出所有对 popover 组件本身/其子内容有实际影响的规则；大量规则以浮层 selector group 同时支持 menu/select/combobox，不能误读成 popover 独有。此处 `SECTION` 为文件内注释段名；无专段的注明无显式 SECTION。

| 文件 / SECTION / 行 | 选择器（简写注明） | 声明 / 作用 |
|---|---|---|
| `11-controls-and-pages.css` / `popups-r9` / 220–230 | `:is([data-slot$="menu-content"], [data-slot$="menu-sub-content"], [data-slot="popover-content"], [data-slot="select-content"], [data-slot="combobox-content"])` | `--radius:0`；背景 `#211a33 !important`、文字 `#f2ebff`、opacity 1；1px `#6c5ce0` 边框、方角；内凸边 + 3px 硬投影；禁 backdrop-filter、animation、transition。**无 padding/max-width/overflow 声明**。 |
| 同上 / 242–247 | 浮层 group 内 menu/select/combobox 项目及特定 ghost button | 透明底、浅字、方角；禁 item 动画/transition。 |
| 同上 / 251–255 | 同 group 内可交互 item 的 hover/focus/highlight | 粉底深字、斜边 clip-path、内阴影。 |
| 同上 / 257–267 | 同 group 内焦点文本、destructive、disabled 项 | 状态色及禁用状态覆盖。 |
| 同上 / 273–279、285–288 | 同 group 内头像与 avatar-image、浮层根（reduce-motion） | 头像/头像图片修整及静态化；没有 popover 根进入动画，根动画直接关闭。 |
| 同上 / 282 | `[data-slot="popover-content"] [data-slot="scroll-area"] ...` | Room-history 内 UserPickerRow 圆形头像改像素切角；这是子内容专项，不设面板滚动行为。 |
| 同上 / 640–650 | 同 group 内 `.rounded-md/.rounded-lg` avatar/image | 保留群组头像的圆角例外和子图继承半径。 |
| `14-buttons-and-data.css` / 日历段（见注释 185）/ 186–220 | `:is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"])` 及其后代 | 日历月份标题、日期格、选中/范围/today/focus/disabled 状态；是 popover 内日历的内容层规则，不是面板尺寸规则。 |
| `16-final-navigation.css` / `portal-button-roles-b073-b100` / 194–228 | `:where(...,[data-slot="popover-content"],...) button[data-variant]` 组合及嵌套变体 | popover portal 内按钮的形状、variant、hover/pressed/focus/disabled 状态；明确保留按钮几何尺寸/padding 为 source-owned（注释 197–199）。 |
| 同文件 / 同 SECTION / 229–249 | `:where(...,[data-slot="popover-content"],...)` 后代按钮 | 列表/identity/disclosure 行按钮扁平化与状态样式；不重画面板根。 |

精确证据全文：`11-controls-and-pages.css:220–230,242–288,640–650`；`14-buttons-and-data.css:185–220`；`16-final-navigation.css:194–249`。样式层对 `data-slot="popover-trigger"`、`data-slot="popover-arrow"` 没有单独规则（全 16 个 style 文件检索；popover 名称只出现在上列规则/按钮与 calendar 子规则，以及 token 中的 `--popover`）。

## 核心判断

- **Content 面板根只有共享浮层皮肤，没有 popover 专属 padding、max-width/height、滚动容器或进入动画。** 根复用 `popups-r9`（220–230）；而动画/transition 被显式置为 none。padding / max 尺寸 / overflow 不是 inventory 采集字段，也没有该 content 的专属规则证据，因此不可臆测。
- **箭头：主题没有隐藏或重绘 `popover-arrow` 的规则。** 没有 `display:none`、箭头伪元素覆盖或箭头背景图规则；因此只能结论为“主题未处理，保持组件/宿主原状”，不能进一步断言运行时必定显示。注意 11 文件 218 行强调不碰 positioner/select-content 的 `::after`；233 行的 `::before` 只限定 menu/select/combobox，没有 popover。这些注释进一步表明未对 popover 箭头下手。
- **Portal specificity 风险：根 selector 是全局 attribute selector，不要求 `[data-vrcx-0CssLayer]` 或 `.vrcx-0-main-content` 祖先。** `:is(...)` 中 `[data-slot="popover-content"]` 使它能匹配 body 直属 portal；specificity 由 `:is()` 内最高分支决定，此分支相当于一个属性选择器（0-1-0），不是靠 DOM 祖先限定。背景、圆角还带 `!important`（222、226），可压过普通 utility；但若对方也用 important，仍按 specificity/顺序竞争。portal 根样式可靠命中，但全局选择器有跨页面覆盖风险，宜维持严格 slot 白名单，勿改成泛 `div.bg-popover`。

## 合并建议 / 收敛结论

**收敛为 1 种 popover-content 面板外观**：复用统一浮层根 selector 的方角、紫色边框、内凸边及 3px 硬投影；不要因为唯一采样就另造一份 popover 特例。必须保留的是子内容职责：popover 内的日历状态、列表/头像处理、按钮交互状态，以及产品组件自身对内容 padding/尺寸/overflow 的定义；这些不是可和根面板边框合并的属性。

CSS 骨架可保持 `:is([data-slot$="menu-content"], ..., [data-slot="popover-content"], ...) { border; border-radius; box-shadow; background; animation:none; transition:none }`，再用 `[data-slot="popover-content"] [data-slot="calendar"]`、portal root 内 button 的独立选择器处理内容。若将当前 `:is(...)` 拆成各 slot 单独 selector，specificity 基本仍为单属性级；若改成 `.vrcx-0-main-content [data-slot="popover-content"]`，会提高 specificity 且无法命中 body 直属 portal，不能这样收敛。触发器只负责开启/关闭和 trigger 按钮状态；content 才负责浮层容器及内部内容。
