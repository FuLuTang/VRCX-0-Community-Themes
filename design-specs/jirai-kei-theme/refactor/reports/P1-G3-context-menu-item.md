# P1-G3 context-menu-item 组件普查

## 1. Inventory 记录与 styleVariants

`family=G3` 中只有一条 `context-menu-item`：tag `div`、variant `default`、size `null`，primaryContext=`overlay:context-menu-content`，observations=1、stateCount=1、styleFingerprintCount=1（inventory 9012–9029）。

| primaryContext | 观察数 | 指纹数 | fingerprint / 观察数 | computedStyle |
|---|---:|---:|---|---|
| `overlay:context-menu-content` | 1 | 1 | `3a26c496669abd1f` / 1 | color `rgb(242,235,255)`；background 透明；font-size `14px`；border 四边宽度 `0px`；box-shadow `none`。padding、gap 未采集；computedStyle 未提供 border-radius。 |

来源 inventory 9026–9065。该样本是默认态；只有一条记录，不能由此断言右键菜单所有交互态均相同。

## 2. 样式层命中规则与 dropdown 并排比较

在全部 16 个 `refactor/src/style/*.css` 中检索 context-menu item / checkbox / radio / sub-trigger、menu-shortcut 及 role 菜单项，item 样式命中集中于 `11-controls-and-pages.css` 的 `SECTION popups-r9`。没有 `[data-slot="context-menu-item"]` 或 `[role="menuitem"]` 的专属规则；右键菜单靠后缀规则命中。

| 类型 | 文件 / SECTION / 行 | 选择器要点 | 实际声明 |
|---|---|---|---|
| 基础行（context + dropdown 共用） | `11-controls-and-pages.css` / `popups-r9` / 242–248 | 容器 `:is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"])` 后代 `:is([data-slot$="menu-item"],[data-slot$="menu-checkbox-item"],[data-slot$="menu-radio-item"],[data-slot$="menu-sub-trigger"],...)` | `background:transparent; color:#f2ebff; border-radius:0; animation:none!important; transition:none!important` |
| 高亮（同一 item 组） | 同上 / 251–256 | 同一容器和 item 组 + `:is(:hover,:focus-visible,[data-highlighted],[data-popup-open]):not([data-disabled]):not(:disabled):not([aria-disabled="true"])` | `background:#ffb8e6!important; color:#16112a!important; clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%); box-shadow:inset 0 1px 0 #ffd9ee,inset 0 -1px 0 #d97fc6` |
| 快捷键文字 / muted 后代 | 同上 / 257 | 容器后代高亮状态下 `:is(.text-muted-foreground,[data-slot$="menu-shortcut"])` | `color:#2a1d6e!important` |
| destructive | 同上 / 258–262 | 容器后代 `[data-variant="destructive"]` 及其后代；高亮 destructive 及后代 | 默认 `color:#ff7fae!important`；高亮为 `#16112a!important` |
| disabled | 同上 / 263–267 | 容器后代 `:is([data-disabled],[aria-disabled="true"],:disabled)` | `color:#b9add9!important; background:transparent!important; opacity:1; clip-path:none; box-shadow:none`；muted 子项同色 |
| 外部头像装饰例外 | 同上 / 279 | 容器后代 `:is([data-slot$="menu-item"],[data-slot="button"]):has(...)` | `clip-path:none!important`；context 与 dropdown 两类 slot 均可命中 |

所列完整选择器与声明可复核 `11-controls-and-pages.css:242–267,279`。容器本身的 3px 硬投影边框不是 item 规则：`11-controls-and-pages.css:220–228`（本段浮层容器 border、radius 与 box-shadow）。

## 3. 核心问题与证据

### 区分程度：无独立外观规则，通用选择器共同覆盖

基础/高亮选择器的 item 分支原文包含 `[data-slot$="menu-item"]`，而非分别列出 context 与 dropdown；同理包含 `[data-slot$="menu-checkbox-item"]`、`[data-slot$="menu-radio-item"]`、`[data-slot$="menu-sub-trigger"]`（242、251）。因此 `[data-slot="context-menu-item"]` 和 `[data-slot="dropdown-menu-item"]` 都被同一后缀分支命中。context-menu 没有专属 item 规则，主题在结构上把它们合并了。容器选择器也以 `[data-slot$="menu-content"]` / `menu-sub-content` 覆盖对应 context 与 dropdown 浮层（242、251、258、264）。

这是有意可复用但也确实由 `$=` 后缀匹配实现的共享：`[data-slot$="menu-item"]` 会命中 `context-menu-item`、`dropdown-menu-item` 等所有以该后缀结束的 slot。当前样式层可确认的精确 slot 名为以上两项（inventory 9015、9128）；不要把它误写成显式限定这两类。若未来出现 `foo-menu-item`，同样会命中，存在扩大范围/误伤风险。另三项后缀分支分别会命中 `context-menu-checkbox-item` / `dropdown-menu-checkbox-item`、`context-menu-radio-item` / `dropdown-menu-radio-item`、`context-menu-sub-trigger` / `dropdown-menu-sub-trigger`。它们是不同后缀，不会被 `menu-item` 这一分支本身匹配，而由各自分支覆盖。

### 状态覆盖、勾选位、图标与快捷键

- **destructive：有规则且两族共用。** 右键内容容器在范围内时，`[data-variant="destructive"]` 默认警示色、高亮反差修正分别见 258–262；选择器没有限定 dropdown。
- **disabled：有规则且两族共用。** `[data-disabled]` / `aria-disabled` / `:disabled` 覆盖见 263–267；高亮规则明确排除禁用状态（251）。
- **`[data-highlighted]`：有规则且两族共用。** 与 hover、focus-visible、popup-open 共用粉色高亮（251–256）。
- **radio / checkbox：行本身有通用基线、高亮；未找到专门的勾选指示器（checked 标记/图标）规则。** 242、251 列入两类 slot，但没有 `[data-state="checked"]` 或 indicator 选择器；因此保留组件自带 indicator，不要据主题 CSS 推断勾选呈现。
- **图标槽：未找到统一尺寸规则或针对菜单图标槽的颜色规则。** 行的 `color` 可能通过继承影响图标，但这不是专门图标规范（242–248）。
- **快捷键提示：有局部规则。** `[data-slot$="menu-shortcut"]` 在高亮行下被设为 `#2a1d6e!important`（257）；没有搜到其尺寸、间距或默认色专属声明。
- **padding / gap：样式层未设置。** inventory 未采集这两项（9030–9058）；242–248 的声明也没有 padding/gap。由组件结构/utility 提供，具体值未采集，不能臆测。注释称 wrappers 提供 6px content padding（249–250），并非 item 的 padding。

### 与 dropdown 的对照

dropdown inventory 的记录为 observations=2、styleFingerprintCount=2，primaryContext=`overlay:dropdown-menu-content`（inventory 9125–9139）：默认指纹 `3a26c496669abd1f`，与 context-menu 唯一指纹一致；另一指纹 `73faa2f189f72703` 是粉色高亮态（9141–9204）。context-menu 只采到默认态，因此只能确认默认样式指纹相同、规则结构共用，不能称 inventory 已观测到 context-menu 的高亮指纹。

## 4. 可合并性

- **可合并**：右键与下拉普通行、图标行的基础色/透明底/方角，以及 hover、键盘 highlighted 的共同外观；两者现有 CSS 就已通过 `$=` 共用这些声明。快捷键高亮色也在共同浮层范围内。
- **必须保留语义结构**：checkbox/radio indicator 与其占位布局、sub-trigger 的箭头与展开行为都应保留；主题目前没有定义 indicator/图标尺寸，不能因合并基线而隐藏它们。
- **必须保留状态修饰**：destructive 的警示色和高亮时对比修正、disabled 的低对比与交互语义应保留；不可让 destructive hover 颜色覆盖对比修复，也不可让 disabled 吃到高亮样式。
- **差异目前不是两族视觉分叉**：右键菜单操作语义（尤其破坏性操作、勾选、子菜单）需要其结构/状态存在，但现有基础皮肤没有为右键菜单单开一套样式。

## 5. 收敛结论

收敛为 **1 套共享基础行视觉 + 3 类结构槽（图标、radio/checkbox indicator、子菜单箭头）+ destructive/disabled 状态修饰**；不是两套 context-vs-dropdown 皮肤。建议在 popup 容器范围内显式列举 `[data-slot="context-menu-item"]` 与 `[data-slot="dropdown-menu-item"]`（及需要共享的 checkbox/radio/sub-trigger slot），基础声明维护 `color/background/border-radius/animation/transition`，状态层分别维护 highlight、destructive、disabled。若坚持 `$=`，必须列出可预测的 slot 族并约束容器边界；`[data-slot$="menu-item"]` 会隐式纳入未来任意 `*-menu-item`，有误伤风险。

合并或改 selector 时注意 specificity：`:is()` 的 specificity 取参数中最高项，再叠加祖先容器/状态；换成 `:where()`、缩短容器链或改成显式 class 会降低 specificity，可能改变 utility 覆盖关系。高亮、destructive、disabled 有 `!important`（251–267），但不能因此假设所有属性级联不变。

## 6. 可视化

[打开 context-menu 与 dropdown-menu 并排预览](../preview/P1-G3-context-menu-item.html)。两侧共用同一组行状态与硬投影外框，呈现普通、图标、勾选、子菜单、禁用和破坏性项。
