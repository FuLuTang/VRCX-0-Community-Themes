# P1-G1 Input Group 组件普查

## 1. Inventory 变体

Inventory 中 `family=G1`、`component=input-group`、`tag=div` 共两组记录：main-content 30 次观察、side-panel 37 次观察；两组各自记录 3 / 1 个 fingerprint，共计 4 个记录指纹。`styleVariants` 不含单独的 `primaryContext`，下表按所属记录补充上下文；routes/contextTrails 也只属于该记录，不能分摊到单个指纹。

| Fingerprint | 观察数 | primaryContext | 关键 computedStyle（背景 / 边框 / 阴影 / radius / padding） |
|---|---:|---|---|
| `35ddaff64aebcb1e` | 25 | `surface:main-content` | 背景 `rgb(32,25,54)`；四边均 `0.8px solid rgb(108,92,224)`；阴影 `inset 1px 1px rgb(22,17,42), inset -1px -1px rgb(162,148,200)`；radius、padding 未记录。 |
| `f874a968c0ad6a24` | 3 | `surface:main-content` | 背景 `oklab(0.697332 0.034437 -0.0683353 / 0.3)`；边框上/左 `0.8px solid rgb(105,85,124)`、右/下 `0.8px solid rgb(253,244,255)`；阴影同上；radius、padding 未记录。 |
| `49418c4883c25e13` | 2 | `surface:main-content` | 背景 `rgb(32,25,54)`；四边斜面与上一项一致（上/左 #69557c、右/下 #fdf4ff）；阴影同上；radius、padding 未记录。 |
| `707ddf98a55cde40` | 37 | `surface:side-panel` | 背景 `rgb(42,33,71)`（#2a2147）；四边斜面（上/左 #69557c、右/下 #fdf4ff）；阴影同上；radius、padding 未记录。 |

记录级 routes：main-content 包含 `/browse-history`、`/charts/two-person`、Favorites、feed、history、login、search、social、tools 等 22 条；side-panel 包含 activity、charts、community-themes、dashboard、Favorites、feed、history、login、settings、themes、tools 等 30 条。两组不能据此推断具体某个 fingerprint 出现在哪条路由。

**重要：** inventory 是采集基线，不等同于当前 CSS 产物。它确实记录到旧斜面边框与 `#2a2147`，但当前 runtime artifact 已把 input-group 外框统一为 `1px solid #6c5ce0`、`#201936`，见下节。

## 2. 当前 theme.css 命中规则

按当前 artifact 中明确命中 input-group 的规则整理；不把仅涉及普通 input、select 或 addon/button 本身的规则误算成外框规则。选择器很长处以完整上下文骨架标明，关键声明照录。

| SECTION / 行 | 选择器 | 实际声明 / 作用 |
|---|---|---|
| `tools-ui-r9` / 2808–2811 | `#chart` 工具页的专属 Toolbar `...[data-vrcx-0-control="toolbar"][data-slot="input-group"]` | `color:#e3d2f5; transition:none`；注释明确外框由 `fields-toolbar-r10` 提供。 |
| `tools-ui-r9` / 2812–2816 | 同一工具页组 `:focus-within` | `outline:2px solid #ff7fcf; outline-offset:1px; z-index:2`。 |
| `tools-ui-r9` / 2817–2819 | 同一组的 `[data-slot="input-group-addon"]` | `color:#d6b8ef`。 |
| `tools-ui-r9` / 2820–2827 | 同一组的 `[data-slot="input-group-control"]` | `border-radius:0; background-color:transparent; color:#f2ebff; caret-color:#ffb8e6; outline:none; box-shadow:none`。 |
| `tools-ui-r9` / 2828–2831 | 同一 control 的 `::placeholder` | `color:#b9add9; opacity:1`。 |
| `tools-ui-r9` / 2832–2841 | 同一组的 `[data-slot="button"]` 及 `:focus-visible` | button: `border-radius:0; color:#16112a; background-color:#ffb8e6; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`；焦点 outline 粉色 2px、offset 1px。 |
| `fields-toolbar-r10` / 3528–3534 | 普通 page-toolbar `[data-vrcx-0-control="toolbar"][data-slot="input-group"]`，排除上述垂直分类工具页 | `color:#e3d2f5; transition:none`；`:focus-within` 粉色 outline、offset 1px、`z-index:2`。 |
| `fields-toolbar-r10` / 3535 | 同一组 addon | `color:#d6b8ef`。 |
| `fields-toolbar-r10` / 3536–3539 | 同一组 control / placeholder | control 透明背景、无阴影/outline、方角，前景和 caret 色；placeholder `#b9add9`。 |
| `fields-toolbar-r10` / 3540–3543 | 同一组 `[data-slot="input-group-button"]` / focus | 粉色按钮、深色字、inset bevel；focus 粉色 outline。 |
| `fields-toolbar-r10` / 3546–3553 | toolbar input-group 内 addon 的紧凑 dropdown trigger | 常态 `1px solid #8c71b0; background:#332650`、bevel；展开时紫蓝边框、暗底并反转阴影。 |
| `fields-toolbar-r10` / 3561 | `:where([data-slot="input-group"]:focus-within)` | 通用粉色 focus outline，offset 1px。对 `:where` 而言 specificity 为 0；上面的 chart / toolbar 上下文焦点规则优先级更高。 |
| `fields-toolbar-r10` / 3582–3584 | main-content toolbar 内含直接子 `combobox-chips` 的组 | `color:#e3d2f5`。 |
| `fields-toolbar-r10` / 3587–3593 | `:where([data-slot="input-group"])`（与 standalone fields 共享规则） | **当前外框：** `background-color:#201936; border:1px solid #6c5ce0; border-radius:0; box-shadow:var(--jk-field-inset)`；该变量为 `inset 1px 1px #16112a,inset -1px -1px #a294c8`。这确认当前不是四边斜面外框。 |
| `fields-toolbar-r10` / 3596–3597 | toolbar chip group `:has(> [data-slot="combobox-chips"]):focus-within` / chip container | focus outline + `z-index:2`；chips 本体清除边框/背景/阴影，透明嵌入外框。 |
| `browse-history-r9` / 4067–4081 | Browse History 专属 toolbar group（嵌套 SCSS） | group 保留 toolbar ink/motion 与 focus；addon/control/placeholder 使用与 toolbar 同色；inline-end button 有独立 dark frame、hover/focus 处理。外框仍来自 3588 通用规则。 |

`--jk-field-edge` 当前只在 `:root` / 3522 定义，在 3313 的 `select,[data-slot="select-trigger"],[data-slot="combobox-trigger"]` 规则中作为 `border-color` 被引用（重要：该 selector 随后 3319–3322 对 button-backed triggers 以 `!important` 覆盖颜色）。另有 sidebar menu 在 1465–1470 使用 `border-color:var(--jk-field-edge)`。因此这个四边值 token **并未用于 input-group 外框**；不要因其名称或旧 inventory 误认为 input-group 仍采用斜面边框。当前 input-group 的内阴影仍复用独立的 `--jk-field-inset`。

## 3. 合并判断

| 差异 / 形态 | 判断 | 依据 |
|---|---|---|
| main-content 25 个标准紫蓝框、side-panel 37 个旧暗紫斜面框 | 合并为一个共享外框 | 当前 CSS 已统一为 #201936 + 1px #6c5ce0 + 方角 + inset 阴影；基线差异是旧采样 / 迭代前视觉，不构成现在需要保留的上下文皮肤。 |
| main-content 的 3 个半透明底、2 个斜边但暗底 fingerprint | 合并为共享外框 | 数量少且当前 artifact 明确统合边框；基线无可靠 state 信息，不能擅自解释为 hover、disabled 或错误状态。 |
| 默认与 `:focus-within` | 必须保留为状态，不算第二种静态皮肤 | focus-visible-within 的粉色 outline 是键盘/输入焦点反馈；不能由基础边框吞掉。通用与高特异性上下文规则需要合并去重而非取消状态。 |
| 内嵌 toolbar / Browse History 工具栏 | 保留组件内容层差异，不复制外框 | control 透明无框、addon 文本色、按钮皮肤以及 toolbar 过渡/焦点层级是容器组合语义；外框已经共享。Browse History 的 inline-end button hover/focus 语义应保留。 |
| 搜索 / combobox chips | 保留结构专属子元素规则 | chips 容器、chip、chip remove、chip input 分别有独立视觉职责；chips/control 必须透明嵌套以避免出现双重框。组本身依旧共用外框。 |
| 数字步进器（若为 input-group + control/addon/button 结构） | 结构可沿用共享组；按钮 / stepper 控件单独保留 | 不能把数字输入子控件的按钮、箭头或窄 addon 规则强行归并进普通文本输入；本 inventory 的 input-group 指纹并未标注 stepper 专属状态，具体 stepper 外观需由对应子组件规则承担。 |
| 普通 addon、addon 内 button、input-group-button | 子组件角色必须区分 | addon 多为标签/单位文字；按钮需要可点击 affordance、hover/focus 和 bevel，不能仅用 addon 文本色替代。 |

## 4. 收敛结论与 CSS 骨架

**input-group 外框收敛为 1 种基础视觉 + 1 个正交 focus 状态**；不是保留 inventory 的 4 种 fingerprint。形态层不另造外框：toolbar/search/chips/stepper 依其子元素结构保留必要修饰。

建议骨架：`:where([data-slot="input-group"])` 统一 `background-color / border / border-radius / box-shadow`；`:where([data-slot="input-group"]:focus-within)` 统一 outline，再以低重复的上下文 modifier 控制 addon、control、button 等内容子槽。合并时注意 specificity：`:where(...)` specificity 为零，现有 page-toolbar 与 `#chart` 的长上下文选择器 specificity 很高，会覆盖通用规则；若统一 CSS 层希望集中控制子槽，应删改旧高特异性规则或显式采用可控低 specificity（例如 `:where(.context ...)`），否则后续规则即使靠后也可能无法覆盖。

## 5. 可视化

[打开并排 input-group 预览](../preview/P1-G1-input-group.html)：含当前通用默认/聚焦框、toolbar addon + button、搜索/chips 以及数字步进器构成示例，CSS 内嵌，可独立打开。旧 inventory 斜面值另在图例中作为“已统一的历史态”对照，不作为当前外观。
