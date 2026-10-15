# P1-G1 Input Group Control 组件普查

## 1. Inventory：全部记录与 styleVariants

`family=G1, component=input-group-control, tag=input` 共 2 条记录：main-content 30 次观察、side-panel 37 次观察，总计 67 次观察；记录级 fingerprints 2+1 共 3 个。下表的每条 styleVariant 继承所属记录的 `primaryContext`。Inventory 的 paint fingerprint 字段不含 caret-color、height、padding；它也没有 placeholder 专属计算样式，因此这些项须标“未采集”，不能从主题 CSS 声明推算 computedStyle。

| primaryContext | 观察数 | styleVariants / 指纹数 | 指纹及差异 computedStyle（background / border / box-shadow / color / caret-color / font-size / height / padding） |
|---|---:|---:|---|
| `surface:main-content` | 30 | 2 | `48ff550ef2cd960f`（21）：bg `rgba(0,0,0,0)`；四边 border 宽 `0px`（style `solid`，颜色 `rgb(162,148,200)`）；shadow `none`；color `rgb(242,235,255)`；caret 未采集；font-size `14px`；height、padding 未采集。`e783a2af166ae47a`（9）：以上各项相同，唯 box-shadow 为五层透明/零尺寸阴影，其中第四层 `rgb(242,235,255) 0 0 0 0`；caret 未采集；font-size `14px`；height、padding 未采集。 |
| `surface:side-panel` | 37 | 1 | `5cd31d05b8654789`（37）：bg `rgba(0,0,0,0)`；四边 border 宽 `0px`（style `solid`，颜色 `rgb(162,148,200)`）；box-shadow 为五层透明/零尺寸阴影，其中第四层 `rgb(242,235,255) 0 0 0 0`；color `rgb(242,235,255)`；caret 未采集；font-size `12px`；height、padding 未采集。 |

因此 inventory 中有 3 个原始指纹，但可见差别只有：**零尺寸/透明 shadow 的序列是否被序列化为 `none`，以及 side-panel 字号 12px vs main-content 14px**。它们都不是 control 背景/边框皮肤差异。字体大小是被采样到的 computedStyle 差别；主题样式层中没有发现 control 的 `font-size` 声明，不能把该差异归因于主题规则。

## 2. 样式层命中规则（逐条）

下列是样式层中选择器直接包含 `[data-slot="input-group-control"]` 的全部六条规则（3 条 control 本体、3 条 placeholder）。其中 13 文件区段分别为 `fields-toolbar-r10`、`browse-history-r9`，11 文件区段为 `tools-ui-r9`。

| 分类 | 文件 / SECTION / 行 | 选择器（完整结构语义） | 实际声明 |
|---|---|---|---|
| 透明擦除型 | `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 22–24 | 普通 main-content page-toolbar input-group（`:not(#chart… *)` 排除 chart 专属组）的 `[data-slot="input-group-control"]` | `border-radius:0; background:transparent; color:#f2ebff; caret-color:#ffb8e6; outline:none; box-shadow:none`。注意：这里**没有显式 `border:0`**。 |
| 透明擦除型 | 同文件 / 同 SECTION / 25 | 同上 control 的 `::placeholder` | `color:#b9add9; opacity:1`。 |
| 透明擦除型 | `11-controls-and-pages.css` / `tools-ui-r9` / 380–387 | `#chart` 工具页 page-toolbar 下 input-group 的 `[data-slot="input-group-control"]` | `border-radius:0; background-color:transparent; color:#f2ebff; caret-color:#ffb8e6; outline:none; box-shadow:none`。无显式 `border:0`。 |
| 透明擦除型 | `13-toolbar-overlays-and-pages.css` / `browse-history-r9` / 559–560 | Browse History toolbar input-group 的嵌套 `[data-slot="input-group-control"]` 及 `::placeholder` | control：`border-radius:0; background-color:transparent; color:#f2ebff; caret-color:#ffb8e6; outline:none; box-shadow:none`；placeholder：`color:#b9add9; opacity:1`。同样未显式写 `border:0`。 |
| 透明擦除型 | `11-controls-and-pages.css` / `tools-ui-r9` / 388–391 | `#chart` control 的 `::placeholder` | `color:#b9add9; opacity:1`。 |

**自带外观型：未发现。** 没有 control 规则声明不透明背景、可见边框或非零阴影。样式层中 control 直接命中的具体规则只有上述两种上下文的本体与 placeholder。相邻 input-group 外框是另一元素的规则：`13` 文件 `:where([data-slot="input-group"])` 在 73–79 行提供 `#201936` 背景、紫边框与 inset；control 透明嵌在其上。

## 3. 核心问题与证据

- **是否全部是“擦除”？** 以“控制本体不另画表面、抑制默认轮廓/阴影并规定文字/caret”为定义，是；两条本体规则都设透明背景、`outline:none`、`box-shadow:none`、方角。严格按题目括号中的四项逐字核对，则**不是完整四项**：两条 control 规则没有写 `border:0`（13:22–24、11:380–387）。Inventory 观察到四边 border width 为 0px（inventory 1223–1235、1257–1269、1349–1361），但 CSS 声明本身没有把它归结为显式 border 清除。重构时若需要跨浏览器保证，应考虑显式 `border:0`，但当前规则中不得声称已经写了。
- **是否有例外/第二套皮肤？** 没有 control 自己画底色或边框的例外；四条命中规则皆透明型。透明 `background` 由 group 表面透出，不等于 control 另有一套皮肤。group 当前框证据在 `13-toolbar-overlays-and-pages.css:73–79`，其 focus-within 还有 `13:82`（chip group 特例）及普通 toolbar 组 `13:18–20`；chart 专属 `11:372–376`。
- **字号、高度、padding 是否由主题设定？** 命中的 control 本体声明里没有 `font-size`、`height`、`padding`（13:22–24；11:380–387）；全局样式搜索未发现 `[data-slot="input-group-control"]` 的这些属性。Inventory 只采集字号，main-content 14px、side-panel 12px；这说明浏览器最终字号有上下文差异，但不是这些 control 规则设定。Inventory 未采集 height/padding，故只能说主题命中规则没有设置它们；高度/内边距最终来自应用布局、继承/基础样式与 UA 等共同作用，不能仅凭此 inventory 断言“完全由 app 布局决定”。
- **粉色 caret 是否仅用于 control？** 在 16 个样式层 CSS 文件内对 `caret-color` 的全文检索，仅发现三个声明位置，且三处均是 control：`13:23`、`13:559`、`11:384`，值都为 `#ffb8e6`。前两处属于 13 文件普通 toolbar / 后续嵌套组规则，后一处是 chart 工具页。故样式层中 caret 粉色只赋给 input-group-control；这里是样式层规则一致性结论，不扩张为其他未检索产物的结论。
- **placeholder opacity 1 的目的？** 明确事实是主题对两种上下文的 control placeholder 显式写了 `opacity:1`（13:25；11:388–391），并设 `color:#b9add9`。这与消除 Firefox 默认 placeholder 半透明的常见兼容目的吻合；但源码未写注释说明动机，故动机判断是合理推断，不是文件内明示。其他通用 placeholder 也有 `opacity:1`（13:45），说明是主题的统一处理习惯。
- **control 自己有 focus 规则吗？** 没有命中 control 的 `:focus` / `:focus-visible` 规则。焦点由组 `:focus-within` 承担：普通 toolbar `13:18–20`；通用组规则 `13:47`；chart 工具页 `11:372–376`。control 本身 `outline:none` 避免独立环。若在 control 上另加 outline/focus shadow，聚焦时会与组的 focus-within 环叠加，出现双环；按钮另有自身 focus-visible 是另一子组件问题，不属于 control。

## 4. 合并判断

| 项目 | 判断 | 原因 |
|---|---|---|
| main-content 透明 control 与 side-panel 透明 control | 可合并一个公共透明本体规则 | 3 个 fingerprint 只有无实质表面的 shadow 序列和 12/14px computed 字号差异；当前主题未设字号，本体的显式视觉意图一致。 |
| 两组 caret / text / outline / background 规则 | 可合并共用声明 | 两处颜色与清除值完全相同；删除重复时保留 `caret-color`、`color`、透明背景、无 outline/shadow 与方角。 |
| `::placeholder` 两个上下文 | 可合并共用规则 | 均为 `#b9add9; opacity:1`。 |
| 字号 | 当前不为主题差异保留 variant | 样式层未设置字号；原 computed 12/14px 仍应作为 app/context 差异记录，不能通过合并 CSS 强制同字号。若未来设计要求主题统一字号，需另行明确决策。 |
| 可能的 border 清除 | 需决定是否补显式 `border:0` | 当前 CSS 没写 border reset，但 inventory 采样为 0px。若以“彻底擦除宿主默认外观”为目标，显式写零边框更可靠；不要与 group border 混写，group 自己持有框线。 |
| focus | 保留在 group，而非 control | 避免双环；两种 context 可合并/协调 group `:focus-within`，同时避免 control focus 规则。 |

## 5. 收敛结论与 B3 影响

**收敛为 1 种 control 本体形态 + 1 种 placeholder 文字处理；无第二套 control 皮肤。** 建议以 `:where([data-slot="input-group-control"])` 统一 `background:transparent; border:0; border-radius:0; box-shadow:none; outline:none; color; caret-color`，并以同一槽位 `::placeholder` 统一 `color`、`opacity`；如要严格复位宿主默认外观，应在重构中补上 `border:0`。控制字号/高度/内边距先由组件布局保持，不在此层硬编码。

B3 改的是 **input-group 外框**，control 无需跟着改：其背景透明、无自有边框/阴影，天然透出父 group 的新斜面表面（control reset 证据 13:22–24、11:380–387；外框规则位置 13:73–79）。改外框时不应把 B3 的边框和阴影搬到 control，否则会变成内外双框。若将本体规则合并为 `:where(...)`，其 specificity 为 0；当前 13/11 两个带长上下文的 control 选择器 specificity 很高（尤其 `#chart` 规则），单靠后置低特异性规则未必覆盖它们。要实现真正单一来源，应删除/改写旧上下文 control 声明，或将其降为低 specificity 的 `:where(...)` 包裹上下文；placeholder 规则也需相应处理。

## 6. 可视化

[打开 input-group-control B1/B3 并排预览](../preview/P1-G1-input-group-control.html)。每种框分别展示纯 control、前置图标 addon、尾部按钮；control 使用透明填充，另有半透明覆盖/注释标出输入区域，展示同一透明 control 如何透出父容器表面。