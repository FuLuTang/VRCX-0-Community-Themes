# CONV-1 · 输入框族现状清点

> 只读审计。权威规则源为 `refactor/reference/baseline-theme.css`；下面列的是该文件物理行号和 SECTION。可视化 HTML 是按声明重建的离线示意，不是应用截图。

## 现状家族

按独立可见盒型归纳，当前有 **4 个已定义视觉家族**，另有一类未设主题皮肤的原生输入：

1. **普通凹陷字段**：共享一个 standalone selector，覆盖 `[data-slot="input"]`、`[data-slot="textarea"]`、原生 `textarea` 与 `input[type="time"]`。本体规则在 `fields-toolbar-r10` / 3537–3543（基础边框、底色及文字状态）、3570–3574（方角、四边色、inset shadow）；focus / invalid 在 3581–3582。视觉为 1px `#6c5ce0`、`#16112a` 底色、方角、`--jk-field-inset`（`inset 1px 1px #16112a,inset -1px -1px #a294c8`）。placeholder `#b9add9`，disabled opacity `.65`。
2. **Input group 外框 + 透明内控件**：外框在 `fields-toolbar-r10` / 3517–3526、3575–3579；外框指定 1px `#6c5ce0`、`#201936`，方角和共享 inset shadow。工具页 Chart group 的上下文规则在 `tools-ui-r9` / 2808–2827（见下方控制器规则），BrowseHistory 相关规则在 `browse-history-r9` / 4052 起。普通 toolbar control 在 3528–3531 透明、方角、无 outline / shadow；Chart control 在 2812–2823；BrowseHistory control 在 4061–4062。Addon 本体未设边框/底色/阴影，普通 toolbar 色值规则位于 3527，Chart 在 2817–2819，BrowseHistory 在 4060。可见边界属于 group，不属于 addon/control。
3. **Login recessed**：`login-r8` / 2230–2252。Login input 本体 1px `#8c71b0`、2px radius、`#16112a` 底色，双层 recessed shadow；placeholder 为 `#c5b5e1`。focus 时粉色 border/outline 且 radius 改 0；invalid 使用 `#ff5a83`。它不是普通字段声明的简单重复。
4. **原生专属子部件皮肤**：`fields-toolbar-r10` / 3610–3618。Color 本体、swatch wrapper、swatch 分别 3610–3612；file 只样式化 `::file-selector-button`（3613–3617）；time indicator（3618）另有 runtime / 708–710 规则。此家族的子部件规则不等同文本框盒型。
5. **未设专属字段皮肤的原生类型**：未找到 `input[type="search"]`、`number`、`date`、`datetime-local` 规则；上述类型也不在共享 standalone selector 中。其外观由浏览器 UA / 宿主组件样式等决定，不能用本 CSS 报告推断统一结果。

## 逐组件位置与快照存在性

| 组件 | 基线规则位置与现状 | 冻结快照观察 |
|---|---|---|
| `[data-slot="input"]` | 普通字段 3537–3543、3570–3574；login 独立覆盖 2230–2252 | 10 个 slot elements |
| `[data-slot="textarea"]` | 普通字段共享 selector：3537–3543、3570–3574 | 未找到该 slot |
| `input[type="time"]` | 普通字段共享规则 3537–3543、3570–3574；indicator 3618、以及 runtime 708–710 | 未记录此 type |
| `input[type="search"]` | 未找到专属规则，也未纳入共享字段 selector | 未记录此 type |
| 原生 `textarea` | 普通字段共享规则 3537–3543、3570–3574 | 未由此统计确认裸 textarea 元素（快照 slot 统计无 textarea slot） |
| `input[type="file"]` | 仅 `::file-selector-button` 3613–3617 | 3 个 file input |
| `input[type="color"]` | 本体 + swatch 子部件 3610–3612 | 2 个 color input |
| `input[type="number"]` | 未找到专属规则；不在共享字段 selector | 未记录此 type |
| `input[type="date"]` / `datetime-local` | 未找到专属规则；不在共享字段 selector | 两类均未记录 |
| `[data-slot="input-group"]` | 外框 3517–3526、3575–3579；工具 Chart 独立部分 2808–2827；BrowseHistory 4052 起 | 67 个 slot elements |
| `input-group-control` | 普通 toolbar 3528–3531；Chart 2812–2823；BrowseHistory 4061–4062。透明/无 shadow/无 outline，但 CSS 未显式 `border:0` | 67 个 slot elements |
| `input-group-addon` | 普通 toolbar 色值 3527；Chart 2817–2819；BrowseHistory 4060；addon 本体未找到 border/background/shadow 声明 | 77 个 slot elements |
| Login 字段 | `login-r8` / 2230–2252；placeholder、focus、invalid 分态 | login 快照中的 slot 统计与所有冻结快照总统计口径未按页面分开重算；不要据此视为全量登录输入状态 |

冻结快照计数是扫描 42 个 `baseline/snapshot/*.json` 中 `elements[].attrs["data-slot"]` 和原生 `input` `attrs.type` 的聚合结果。input type 统计为 checkbox 116、无 type 属性 96、range 9、file 3、color 2；快照中未见 `time/search/number/date/datetime-local`。无 type 属性不等于未知 type 的完整清单，也不能据此推断全部输入用途。

## 重复规则与收敛条数口径

- 普通字段的基础盒型已在一个共享 selector 中表达，但基线把同一 selector 分在 3537–3543 和 3570–3574 两个代码块，合计 **2 个声明块**；focus/invalid、placeholder、disabled 是状态规则，不属于同一静态框型的重复实现。
- Group 外框存在 toolbar 场景框声明（3517–3526）和通用 slot 声明（3575–3579），另有 Chart / BrowseHistory 上下文状态或子槽规则；场景 selector specificity 不同，不能只按块数认定视觉值同源。
- Control reset 至少在普通 toolbar、Chart、BrowseHistory **3 个上下文**重复表达透明内控件职责（BrowseHistory 亦包含 placeholder），颜色/用途相近但 selector scope 不同。
- Login 本体只有一个独立框规则；file / color / time 的原生子部件分开处理，不应计入普通文本框复制数。
- 以“基础字段盒型”为合并计数单位，普通字段 CSS 可收敛为 **1 条基础规则**；若决定统一 group 与 B3，group 外框另 **1 条**，control reset **1 条**，login 若保留特例则 **1 条独立覆盖**。也就是字段/组的基础盒型最多 4 条（含 login）；状态、addon 语义、原生子部件各自另计。该数字是规则结构估算，不是逐声明机械计数；实际减少量取决于是否把 login/group 纳入相同契约及是否重写高特异性上下文 selector。

## B3 改动边界事实

已确认的 B3 契约用于单个普通输入预览：radius 0；solid 2px 四边；边色上/右/下/左 `#69557c #fdf4ff #fdf4ff #69557c`；底色 `#2a2147`；2px inset 暗/亮面；文字 `#f2ebff`。相对当前普通字段，它改边框厚度、边色、背景及阴影内缩尺寸；状态规则和原生子部件并不自动消失。

### 风险项

- 将 B3 同时匹配 group 和内层 control 会形成内外双框风险。当前 control CSS 没有显式 `border:0`，快照中的 border-width 为 0 也不能替代 CSS 声明证据。
- Group 现状由外框绘制可见边界，control 透明、无自身 shadow；外框变更不等于必须更改 control。Addon 不是框体。
- File 规则只重绘按钮子部件；Color 的 swatch 有自己边框；Number/date/search 未被统一皮肤覆盖，强制 B3 会改变 UA 当前外观，且子部件结果可能跨浏览器不同。
- Login 有独立背景、圆角、边框、shadow、focus/invalid 色。若 B3 selector 进入登录页，级联与 specificity 可能改变已有特例。
- Checkbox / radio / range 是独立控件族；baseline 的 form-controls-r9 从约 3198 起设置专属外观，不应被通用 input 文本框规则覆盖。隐藏 input/代理控件亦不等于可见字段。
- Group 和内槽存在多处长上下文选择器；低 specificity 新规则可能无法覆盖旧规则。是否修改 selector 属于实施阶段的级联决策。

## 仍待拍板的问题（仅列选项/事实）

1. B3 范围：仅独立 slot 文本字段、原生 textarea、time；或同时包含 input-group 外框？
2. Login 保留 recessed 特例，或明确迁移为 B3？
3. Search / number / date / datetime-local 是否需要纳入文本字段皮肤？若纳入，其 UA 子部件是否保留？
4. Group control 是否继续透明无框；通用字段规则是否显式排除 `input-group-control`？
5. File / color 是否只保留类型专属子部件外观，或也统一本体框？
6. Checkbox / radio / range 明确作为 B3 排除项，或另行定义其他契约？

## 抽样与未验证声明

规则位置和声明来自真基线 CSS；slot/type 存在性来自 42 份冻结快照抽样，并非产品所有可达页面的全量运行时验证。未在快照中找到 textarea slot、time、search、number、date/datetime-local；未据此声称它们在应用所有路径都不存在。HTML 为自包含 CSS 仿制，不是目标桌面应用截图，也未验证不同浏览器的原生 file/color/time/number/date 子部件视觉表现。样式层中“未找到规则”仅表示基线 CSS 搜索未发现对应类型专项或共享字段命中，不推断 UA 默认样式的具体像素外观。
