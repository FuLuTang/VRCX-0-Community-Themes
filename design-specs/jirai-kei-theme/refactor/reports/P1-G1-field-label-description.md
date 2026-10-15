# P1-G1 — field-label / field-description 双槽位普查

## 结论摘要

采样中 `field-label` 与 `field-description` 都只有一种指纹；前者 17 次观察、后者 11 次。层级主要靠颜色而非字号：label `#e3d2f5`、14px/500；description `#b9add9`、14px/400。没有证据显示主题为两个 slot 设置字号、字重或间距；inventory 是 computed style，14px/500 与 14px/400 是最终值，不等于主题规则的来源。样式层确实只为其设置颜色，字号/字重应视为交由 app/Tailwind/默认样式，而不是 CSS 重构漏抄：现有代码没有可抄录的字号声明，且规则只显式着色。错误态另有 `field-error`，不得并入普通辅助说明。

## Inventory：完整记录与 styleVariants

以下是 inventory 中这两个 component 的全部记录（每个 component 各一条）。`line-height`、`margin` 在 computedStyle 中没有键，故标记“未采集”。

### `field-label`（inventory 第 448–558 行）

| context / primaryContext | observations | 指纹数 | styleVariants（全部） |
|---|---:|---:|---|
| `surface:main-content`（primaryContext；contextTrail 同值） | 17 | 1 | `2a2de1c73b12976f`：17 observations；color `rgb(227, 210, 245)`；font-size `14px`；font-weight `500`；line-height 未采集；margin 未采集。 |

记录元数据：`family=G1`、`tag=label`、`variant=null`、`size=null`、`stateCount=1`、route `/settings`（第 506–516 行）。具体 fingerprint 与 computedStyle 位于第 518–549 行；字体属性见第 544–548 行。

### `field-description`（inventory 第 448–501 行）

| context / primaryContext | observations | 指纹数 | styleVariants（全部） |
|---|---:|---:|---|
| `surface:main-content`（primaryContext；contextTrail 同值） | 11 | 1 | `225cae7274cf0cb2`：11 observations；color `rgb(185, 173, 217)`；font-size `14px`；font-weight `400`；line-height 未采集；margin 未采集。 |

记录元数据：`family=G1`、`tag=p`、`variant=null`、`size=null`、`stateCount=1`、route `/settings`（第 450–460 行）。具体 fingerprint 与 computedStyle 位于第 462–493 行；颜色见第 466 行，字体属性见第 488–492 行。

### 普通 `label` 参照组（不是 field-label 的额外变体）

inventory 有两条 `component=label` 记录：`overlay:popover-content` 2 observations（第 1682–1732 行）与 `surface:main-content` 2 observations（第 1738–1789 行）；各 1 指纹，fingerprint 均为 `2a2de1c73b12976f`，color `rgb(227, 210, 245)`、14px/500（前者第 1695–1724 行，后者第 1751–1780 行）。因此普通 label 和 field-label 的采样视觉值相同，但组件记录仍分别统计。

## 样式层命中规则

对 `refactor/src/style/*.css` 全文搜寻 slot 命中。命中 field-label/description 的规则只有如下两条；没有它们的字号、间距规则。行号均为文件内行号。

| 类型 | 文件 / SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|---|
| 颜色 | `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 48 | `:where([data-slot="field-label"]), :where([data-slot="label"])` | `color: #e3d2f5` |
| 颜色 | `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 49 | `:where([data-slot="field-description"])` | `color: #b9add9` |

该 SECTION 起始于文件第 1 行；两条规则是第 48–49 行。没有字号规则、间距规则或对它们的 line-height 声明。相邻第 50 行是 error 颜色，不属于普通 label/description：`:where([data-slot="field-error"]:not([data-vrcx-0-surface="login-page"] *)){color:#ff8fae}`。

## 三者视觉层级与错误态

| 槽位 | color（inventory computed / 主题声明） | font-size（computed） | font-weight（computed） | 主题是否声明这些字体属性 |
|---|---|---:|---:|---|
| 普通 `label` | `rgb(227,210,245)` / `#e3d2f5` | 14px | 500 | 仅 color；inventory 普通 label：1682–1724、1738–1780；主题规则：13 文件第 48 行 |
| `field-label` | `rgb(227,210,245)` / `#e3d2f5` | 14px | 500 | 仅 color；inventory 506–549；主题规则：13 文件第 48 行 |
| `field-description` | `rgb(185,173,217)` / `#b9add9` | 14px | 400 | 仅 color；inventory 448–493；主题规则：13 文件第 49 行 |

**层级倒挂：没有。** 三者字号相同，label 与普通 label 字重 500，description 字重 400 且颜色更暗；description 不比标题更醒目。可确认的差异是语义加颜色/字重，不是字号。margin/line-height 未采集，不能据此宣称实际视觉间距。

**字号是否由主题设置：没有证据表明有。** 在 16 个样式文件中查找 slot 规则及 `font-size` 声明，未发现 field-label/field-description 的字号声明；对应主题规则（13 文件第 48–49 行）只有 `color`。其他 CSS 的字号声明位于无关 selector（例如 02 文件第 24/37 行、06 文件第 132 行、12 文件第 285 行），不能算作对这两个 slot 的设置。inventory 显示的 14px 是测得的 computed value（field-label 第 545 行；description 第 489 行），来源无法仅凭当前证据归因；考虑主题层规则明确只承担颜色，而没有遗漏已有的 slot 字号声明，重构时应保留由 app/Tailwind/默认样式提供字号/字重的职责，不新造字号值。此判断是针对“主题样式层”，不能反推 app 的确切 Tailwind 类名。

**错误态 slot 存在。** 通用错误文字 `[data-slot="field-error"]` 为 `#ff8fae`，来自 `13-toolbar-overlays-and-pages.css` 第 50 行；login 专属覆盖为 `#ff9eb5`，来自 `10-login-and-dialogs.css` 第 226–228 行。通用规则明确排除 login 后代，故两色并存是分区覆盖而非冲突。inventory 未出现 `field-error` 或 `field-message` component 记录（inventory component 名搜索结果只有 field-description、field-label 与普通 label；故颜色证据来自 CSS 而非该 inventory 采样）。

## 合并判断与收敛建议

- **可以合并共同语义基底**：普通 `label` 与 `field-label` 的颜色、computed 字号、字重完全相同；主题也已用同一选择器规则合并二者（13 文件第 48 行）。不必再造一份 field-label 专属颜色样式。
- **必须保留的差异**：description 是辅助说明，保留独立 slot 与较暗颜色；必填星号若存在，应作为字段标题中的独立标记/状态（不把星号语义揉进 description）；错误态 `field-error` 必须独立，且 login 颜色覆盖必须保留。inventory 未采集 required 标记，不能推断主题是否画星号；原型仅作语义示意。
- **收敛为几种**：普通文本槽位收敛为 **2 种视觉角色**：label（普通 label/field-label 共用）与 description；error 作为必需的第三种状态角色单独保留，login error 是其上下文覆盖而非新语义类别。
- **CSS 骨架**：保留 `:where([data-slot="field-label"]), :where([data-slot="label"]) { color: ... }`，并独立保留 `:where([data-slot="field-description"]) { color: ... }` 与 field-error/login 覆盖；不添加 font-size、font-weight、line-height、margin，除非新采样证实需要。
- **specificity**：现有普通规则包在 `:where()` 中，specificity 为 0；组合/合并时沿用可避免无意抬高优先级。若换成普通属性选择器或添加页面上下文，specificity 会增加，可能改变 Tailwind/app 样式覆盖关系；错误态 login selector 更具体，现有 `:not(...)` 排除关系应保留，勿把它降格/合并到 description 规则。

## 可视化

配套 HTML 为独立文件，双击可直接用浏览器打开。它展示 label（含必填星号）、输入框、description 的竖排关系，并以标注线列出实际采样字号/字重/颜色。由于 inventory 未采集 margin/line-height，原型中的组间距仅用于排版展示，不代表主题实测值；输入框视觉取样式层现有颜色/边框语汇。
