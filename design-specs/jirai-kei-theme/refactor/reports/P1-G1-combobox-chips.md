# P1-G1 Combobox Chips 组件普查

## 1. Inventory 记录与变体

筛选 `family=G1`：inventory 只有 `combobox-chips` 两条记录；`combobox-chip`、`combobox-chip-input`、`combobox-chip-remove` 均无记录（全文搜索无匹配），所以不能从 inventory 声称采集到了 chip 子元素的 computedStyle。两条 chips 记录各只有一个 fingerprint，共 2 个不同指纹。

| primaryContext | 观察数 | 指纹数 | fingerprint | computedStyle（背景 / 边框 / 圆角 / padding / gap / min-height / 文字色） |
|---|---:|---:|---|---|
| `overlay:sheet-popup` | 1 | 1 | `a083d025993a3738` | `oklab(0.697332 0.034437 -0.0683353 / 0.3)`；四边各 `0.8px solid rgb(162,148,200)`；圆角未采集；padding 未采集；gap 未采集；min-height 未采集；`rgb(242,235,255)`。inventory 行 245–299（computedStyle 263–290）。 |
| `surface:main-content` | 6 | 1 | `0b0861d8b1e7b44a` | 透明 `rgba(0,0,0,0)`；四边 `0px / none`；圆角未采集；padding 未采集；gap 未采集；min-height 未采集；`rgb(242,235,255)`。inventory 行 301–357（computedStyle 320–347）。 |

记录级 routes：overlay 记录是 `/charts/mutual`；main-content 记录列 `/feed`、`/login`（inventory 行 255–257、311–314）。因此采集到的 chips 不只 Feed；routes 属于记录级，不足以把每个 fingerprint 精确映射到单一路由。

## 2. 样式层命中规则

以下为 style 层中匹配 chips/chip/chip-input/chip-remove 的规则（按要求只审计这组组件；头像子元素另列）。文件 [13-toolbar-overlays-and-pages.css](../src/style/13-toolbar-overlays-and-pages.css) 属 `SECTION fields-toolbar-r10`（第 1 行）。

| 行 | 选择器 | 实际声明 |
|---:|---|---|
| 68–70 | `.vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="input-group"]:has(> [data-slot="combobox-chips"])` | `color:#e3d2f5`。 |
| 82 | 同一 input-group `:focus-within` | `outline:2px solid #ff7fcf; outline-offset:1px; z-index:2`。 |
| 83 | `.vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="combobox-chips"]` | `border:0; border-radius:0; background:transparent; color:#f2ebff; box-shadow:none`。 |
| 84–88 | toolbar 中 chips 下的 `[data-slot="combobox-chip"]` | `min-height:21px; border:1px solid #8c71b0; border-radius:0; background:#332650; color:#f2ebff; align-items:center; justify-content:center; line-height:1; box-shadow:inset 1px 1px rgb(253 244 255/.12), inset -1px -1px #16112a`。**未声明 padding、font-size**。 |
| 89–91 | `.vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="combobox-chip-remove"]` | `width/height/min-width:24px; border:1px solid #6c5ce0; border-radius:0; background:#211a33; color:#ffb8e6`。 |
| 92 | 同一 remove `:focus-visible` | 粉色 `2px` outline，offset `1px`。 |
| 93 | toolbar 中 `[data-slot="combobox-chip-input"]` | `min-height:20px; border:0; background:transparent; color:#f2ebff; outline:none; box-shadow:none`。 |
| 94 | 同一 chip-input `::placeholder` | `color:#b9add9; opacity:1`。 |

[11-controls-and-pages.css](../src/style/11-controls-and-pages.css)，`SECTION controls-r9`；第 602–608 行命中 chip 内头像 span：`border-radius:0; border-width:0; box-shadow:none; outline:none; clip-path:var(--wd-avatar-cut-sm)`；第 609–615 行对其 `img` 做相同重置与裁切。另，[16-final-navigation.css](../src/style/16-final-navigation.css) 第 201 行的长 `:where(:not(...))` 排除列表含 `[data-slot="combobox-chip-remove"]`，意图是让通用弹层按钮规则不覆盖 chip 删除按钮；该处无 chip 皮肤声明。

## 3. 核心问题

- **chip 本身不是裸露默认外观。** Style 层有明确的 chip 规则：背景 `#332650`、边框 `1px solid #8c71b0`、方角、内阴影、最小高度 `21px`、文字色 `#f2ebff`；padding 与字号没有在该规则声明，最终 computed 值依赖组件/基础样式，当前可审计数据未采集。见 `13-toolbar-overlays-and-pages.css:84–88`。因此“不存在 chip 规则、必然露出 shadcn 默认 chip 外观”不成立；子项未覆盖的布局/排版仍可能沿用组件默认值。
- **删除按钮有规则。** 24px 方形、紫蓝细框、深底、粉字；键盘 `:focus-visible` 有粉色 outline。见同文件 `89–92`；通用按钮规则还显式排除它，见 `16-final-navigation.css:201`。
- **容器与输入的框职责明确分层。** toolbar 的 input-group 外框由通用字段规则负责（`13-toolbar-overlays-and-pages.css:73–79`）；chips 容器清除边框/背景/阴影（`83`），chip-input 同样透明、无边框/阴影（`93`）。不会由 chips 或输入自身额外画第二个外框；框应是单一组框，不构成双框。组焦点由 `:focus-within` 的 outline 表示（`82`）。
- **使用位置不只 Feed。** Inventory 路由还含 `/login`、`/charts/mutual`，如上表；样式选择器限定 main-content page-toolbar，覆盖范围小于所有 route。
- **交互状态不完整。** 容器仅有组级 `:focus-within`；remove 只有 `:focus-visible`。chip 本身、remove hover、chip 删除中/disabled 状态都没有专属规则（上述全部 chips selector 检索仅命中这些规则）；基础按钮/组件样式可能继续提供未被覆盖的状态，但不是主题专属规则。头像 clip 见 `11-controls-and-pages.css:602–615`。

## 4. 合并判断

| 项目 | 判断 | 依据 |
|---|---|---|
| inventory 的两个容器 fingerprint（sheet-popup vs main-content） | 不宜直接当成两种最终主题皮肤；统一容器内部为透明、无框，由外层 field/group 唯一画框 | 样式层当前 toolbar chips 明确透明无框；overlay 指纹仍是半透明底+边框，基线与当前规则存在差异，不能把采样当作当前 CSS。若 sheet-popup 实际继续使用 chips，应明确纳入同一组合契约或保留一个独立 overlay modifier，不能把它的框无证据地抹掉。 |
| Feed/Login toolbar chips 与同结构 chips | 容器及 chip-input 可共享透明嵌入规则 | 二者职责相同；避免重复设置边框。 |
| chip 基础外观 | 可作为共享 chip 规则收敛 | 当前主题明确给出统一方角、紫底框、内阴影、前景色与 min-height。 |
| remove button | 必须作为独立可交互子控件保留 | 尺寸、粉色 ×、焦点反馈不同于 chip 标签；保留通用规则的排除项，避免 specificity/源序覆盖。 |
| focus 与删除反馈 | 状态层必须保留/补齐，不能并入静态皮肤 | 组级 focus 和 remove focus 已有；chip hover、remove hover、删除中/disabled 未建立主题规则。 |
| 头像裁切 | 保留独立子元素规则 | 仅针对 chip 内 avatar，不能泛化成 chip 整体裁切。 |

## 5. 收敛结论 / B3 决策

**建议收敛为 1 种 toolbar 组合皮肤（容器透明 + chip 标签 + 独立 remove/input）及正交交互状态；overlay 若确认仍需自带框，再作为 1 个显式上下文 modifier，而不是按 fingerprint 复制规则。** CSS 骨架可用 `:where([data-slot="input-group"]:has(> [data-slot="combobox-chips"]))` 管组框/焦点，chips 与 chip-input 设透明、无框，chip 与 remove 分别设 bevel/尺寸/颜色，并补齐 hover/disabled 状态。

**chips 容器不应跟随 B3 斜面改成一只自带斜面框。** 应跟随 B3 改动的是它的父级 input-group：B3 用在唯一外框，chips 容器和 chip-input 仍透明无框，否则就会出现父级 B3 外框叠内层 B3 框的双框；当前 B1 凹陷状态也是同一职责分配。当前实际 CSS 仍是旧 B1：`#201936 + 1px #6c5ce0 + 方角 + var(--jk-field-inset)`（`13-toolbar-overlays-and-pages.css:73–79`），不得误写为已改 B3。

合并时需留意 specificity：现有 selector `.vrcx-0-main-content .vrcx-0-page-toolbar ...` 特异性高于简单的 `[data-slot=...]`，而 `:where(...)` 内部特异性为零。新增低特异性规则即使写在后面也可能无法覆盖 chip/remove 旧规则；应统一迁移/删除重复旧 selector，或让上下文差异显式采用稳定且可控的 specificity。`16-final-navigation.css:201` 对 remove 的排除也要保留，除非通用按钮选择器本身改为天然不匹配。

## 6. 可视化

[打开 B1 凹陷与 B3 斜面并排预览](../preview/P1-G1-combobox-chips.html)：两种外框均含 3 个头像用户 chip、删除 × 与可输入空位；HTML 自带 CSS，无需依赖项目资源。
