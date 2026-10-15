# Toggle-group 普查（luna）

> 范围：仅 group 容器及其组合规则，不复查 toggle 单项状态。按任务给定命名 `P1-G2`；注意 inventory 实际把两条 `toggle-group` 记录标为 **family=G1**（而非 G2），需修正对 family 的口径，记录本身以组件名筛出。

## 1. Inventory 记录与 variants

| primaryContext | 变体/尺寸 | 观察数 | 指纹数 | 采集到的 group computedStyle 差异 |
|---|---:|---:|---:|---|
| `surface:main-content`（context trail 指向 page-toolbar） | outline / default | 10 | 1 | 背景 `rgb(32,25,54)`；四边 border `0.8px solid rgb(108,92,224)`；box-shadow `inset 1px 1px rgb(253,244,255), inset -1px -1px rgb(122,63,109)`；clip-path 为 2px 切角 polygon；圆角、gap、padding、高度：未采集 |
| `surface:main-content`（context trail 指向 page-scaffold） | outline / sm | 3 | 1 | 背景同上；四边 border `0.8px solid rgb(22,17,42)`；box-shadow `none`；同一 2px 切角 polygon；圆角、gap、padding、高度：未采集 |

Inventory 行号：2483–2542（10 obs），2544–2601（3 obs）。两个记录均 `tag=div`；观察数合计 13、指纹数分别为 1。差异主要是外框色/阴影，以及 size metadata；后者不能据此推断几何尺寸。routes：toolbar 记录 `/activity`、`/feed`、`/friends-locations`、`/game-log`、`/login`、`/my-avatars`；scaffold 记录 `/community-themes`、`/themes`、`/tools/inventory`。

## 2. 样式层命中规则

| 所在 / variant | 文件、SECTION、行 | 选择器 / 实际声明（摘要逐项列出） |
|---|---|---|
| toolbar / default | `13-toolbar-overlays-and-pages.css`，`fields-toolbar-r10`，54–65 | group：`display:flex; gap:2px; padding:0; max-width:100%`。直接子 toggle：`min-height:28px; border:1px solid #6c5ce0; border-radius:0; background:#211a33; color:#d6c8ee;` 双向 inset 阴影。hover、pressed、focus、disabled 分别在 61–65 行；pressed 粉底。 |
| 全局 / outline | `06-panels-and-settings.css`，分段组注释 `(6)④`（该文件未见 SECTION 标签），148–155 | group：`border:1px solid #16112a; border-radius:0; background-color:#201936; gap:0; clip-path:var(--jk-px-cut)`。直接子 toggle/tooltip-trigger：`border:0; border-radius:0; background-color:#201936; color:#b9add9;` 有 inset 双向阴影；`:before` 方角；hover/pressed/focus 状态。显式 separator：`width:2px; background-color:#16112a`，并禁用 separator 的 `::before`。 |
| toolbar / outline | `11-controls-and-pages.css`，`controls-r9`，50–86 | `.vrcx-0-main-content .vrcx-0-page-toolbar` 下 group：`gap:0; padding:0; border:1px solid #6c5ce0; border-radius:0; background-color:#201936; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`。子项恢复 border-color `#6c5ce0`、方角、背景/字色，取消 box-shadow；hover/pressed/focus 覆盖；separator 背景 `#6c5ce0`。 |

以上是样式层对 `toggle-group` 字符串的全部命中（直接组选择器及其子项/状态规则）。`13` 行 52 的注释明确指出 default 是 multi-select chip row，而不是 segmented switch；`06` 行 141–146 注释记录 outline 的 SettingsField 用法与 tooltip-trigger 包装。

## 3. 核心判断（以可见规则为证据）

- **容器自身画外框：画。** outline 全局规则直接给 group `border:1px solid`、背景、切角（06:148）；toolbar outline 又单独给 group border、底色、bevel（11:50–56）。因此它不是“只靠内部 toggle 拼出外框”。toolbar default 则没有 group border（13:54–56），是每个 item 自己带 `1px solid`（13:57–59）。
- **相邻分隔线 / 双重边框：** outline 的 group gap 为 0（06:148、11:51），子项 border 在全局 outline 被置零（06:149），故相邻项没有各自边框相贴形成双线；存在实际 separator 子项时，06:154–155 专门设 2px 深色 divider 并关闭伪元素，toolbar override 再把该 divider 染成紫色（11:79–81）。未发现 toggle-group 的 `::before` separator 画线；单项 `::before` 是另行处理而非 group 分隔线（06:150、11:76–78）。default group gap 2px 且每项完整 1px 边框（13:55–59）：相邻描边分离，不是无缝拼接，视觉上会看到两侧边框，严格说不是重叠双描边。
- **首尾角：** 容器和子项均 `border-radius:0`（06:148–150、11:53–60、13:58），并未发现 `:first-child` / `:last-child` 规则（全样式层搜索命中中没有）。group 的切角只在容器 clip-path；子项不按首尾裁角。因此首尾需保留方角/容器切角轮廓，不要额外添加圆角；clip-path 边角可能遮切外层方角。
- **default vs outline：** default 是有 2px gap、每项独立完整边框的多选 chip row；outline 是 gap=0、group 外框+连续组面、子项 border 归零，必要时用显式 separator 分段。不能把它们当成同一种连续 segment 样式（13:52–59；06:148–155）。
- **尺寸契约：** toolbar default 明确由子 toggle `min-height:28px` 定高（13:57）；group 仅 `max-width:100%`，没有 height。outline group/子项规则都未声明 height/min-height（06:148–155、11:50–86）。 inventory 的 computedStyle 是 paint fingerprint，不含 gap/padding/height 等 layout 数据，故相应几何除 CSS 声明外标为未采集；不能推断 outline 高度。
- **重复定义与合并可能：** outline group 的基础规则在 06 全局与 11 toolbar 各一套（同时改 border 色、阴影）；toolbar outline 子状态亦较完整重复覆盖 06 的全局状态。可合并公共的 gap=0、方角和子项无边框/基础状态；**必须保留** toolbar outline 的局部外框色/阴影、separator 紫色，以及 default chip 的 gap/尺寸/多选状态。合并前须处理 specificity：11 的 `.vrcx-0-main-content .vrcx-0-page-toolbar ...` 明显高于 06 的属性选择器（且 pressed 使用 `!important`），单纯把后者移至低优先级共用规则会被覆盖；建议以 `:where()` 降低共用基线权重，再留高权重 context override，或显式同权重统一 selectors。

## 4. 收敛建议

建议收敛为 **两种 group 视觉契约**：① `data-variant=default`：松散 chip 多选，2px gap，每项独立 1px border、子项 28px min-height；② `data-variant=outline`：连续 outline 段控件，零 gap，group 外框/切角、子项无外边框，separator 单独负责分段。outline 的全局基线与 toolbar 外观差异可抽成公共骨架+toolbar token/context 修饰，不合并成同一条具体颜色/阴影定义。CSS 骨架：`[data-slot=toggle-group][data-variant=outline]` 管 `gap/border/clip-path/background`，直接子 `:is(toggle,tooltip-trigger)` 管 `border:0` 与方角，`[data-slot=separator]` 管 divider；toolbar 范围仅覆写外框色、bevel 与 divider 色。default 保持独立的 `.vrcx-0-page-toolbar ...[data-variant=default]` 组/项规则。group 是容器样式复用；单选/多选语义仍由组件 `type`/pressed 状态承担，不能因视觉合并改语义。

## 5. HTML 可视化说明

配套 `../preview/P1-G2-toggle-group.html` 为纯静态自包含演示，含 toolbar 图标组、panel 选项组、文字 outline 三场景；每场景均有未选/中选/首选/末选四态，边界子项与 separator 都可见。演示 CSS 不依赖项目文件或脚本，直接双击打开即可。
