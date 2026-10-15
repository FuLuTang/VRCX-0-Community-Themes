# P1 搜索框样式普查

CSS 来源：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`（行号为该文件物理行号）。本次以选择器/注释命中 `search`、input-group 搜索语义及现有 input 普查报告交叉检查。**没有发现 `[data-slot="input"][type="search"]`、`input[type="search"]` 或 `search-input` 等独立搜索字段规则**；主题搜索框主要是通用工具栏 input-group，搜索相关页面规则在这些共享规则之上叠加。

## 样式清单

### S1 — 通用页面工具栏搜索组（主基准候选）
- SECTION `fields-toolbar-r10`，行 3528–3539、3581–3595；`input-group` 外框统一规则在 3587–3593。
- 选择器：`:where([data-slot="input-group"])`；内部为 `.vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"]… [data-slot="input-group-control"]`（行 3536–3539），另有 input-group button（3540–3543）。
- 完整关键声明：外框 `background-color:#201936; border:1px solid #6c5ce0; border-radius:0; box-shadow:var(--jk-field-inset)`；变量定义 `--jk-field-inset:inset 1px 1px #16112a,inset -1px -1px #a294c8`（3521–3524）。组 focus-within `outline:2px solid #ff7fcf; outline-offset:1px; z-index:2`（3532–3534、3561）。addon `color:#d6b8ef`；control `border-radius:0; background:transparent; color:#f2ebff; caret-color:#ffb8e6; outline:none; box-shadow:none`；placeholder `color:#b9add9; opacity:1`。搜索页/组件用途：各页面 ToolbarSearch / PageToolbar 搜索（工具页另见 S2）。
- 尺寸/内边距：以上样式没有指定组高度或 padding；由组件源布局提供，不能从主题 CSS 推断。

### S2 — Tools 页面工具栏搜索
- SECTION `tools-ui-r9`，行 2801–2829；注释明确 `ToolsPageContent is ToolbarSearch + vertical TabsList`（2798–2805）。
- 选择器：`.vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(...ToolbarSearch...) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]` 及其内部 addon/control（2808–2828）。
- 完整增量声明：组 `color:#e3d2f5; transition:none`；focus-within `outline:2px solid #ff7fcf; outline-offset:1px; z-index:2`；addon `color:#d6b8ef`；control `border-radius:0; background-color:transparent; color:#f2ebff; caret-color:#ffb8e6; outline:none; box-shadow:none`；placeholder `color:#b9add9; opacity:1`。外框仍由 S1 的 fields-toolbar-r10 提供（行 3587–3593），注释说明共享工具栏框架由 fields-toolbar-r10 提供（2807）。用途：Tools/#chart 的 ToolbarSearch。
- 与 S1 视觉无明显颜色/几何差异；有页面专属规则和 `transition:none`，不构成独立皮肤。

### S3 — Browse History 搜索组
- SECTION `browse-history-r9`，行 4065–4074；注释称 BrowseHistoryPage only（4066）。
- 选择器：行 4067 的 BrowseHistoryPage 结构限定下，`[data-vrcx-0-control="toolbar"][data-slot="input-group"]` 及后代 control。
- 完整关键声明：组 `color:#e3d2f5; transition:none`；focus-within `outline:2px solid #ff7fcf; outline-offset:1px; z-index:2`；addon `color:#d6b8ef`；control `border-radius:0; background-color:transparent; color:#f2ebff; caret-color:#ffb8e6; outline:none; box-shadow:none`；placeholder `color:#b9add9; opacity:1`。组外框来自通用 S1（3587–3593）。组内 inline-end 按钮另有 `border-color:#6c5ce0; border-radius:0; background-color:#201936; color:#e3d2f5; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`，hover/focus 状态见 4075–4079，不属于输入本身。
- 用途：浏览历史页面的工具栏搜索。框体样式与 S1 相同，但带有该页面专属尾端操作按钮。

### S4 — Feed 多用户芯片搜索
- SECTION `fields-toolbar-r10`，注释和规则行 3581–3584、3596–3608。
- 选择器：`.vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="input-group"]:has(> [data-slot="combobox-chips"])`，内部 `[data-slot="combobox-chips"]`、`[data-slot="combobox-chip-input"]`。
- 完整关键声明：组文字色 `#e3d2f5`；组外框沿用 S1 的 `#201936` 底、`1px solid #6c5ce0`、方角及 inset shadow；focus `outline:2px solid #ff7fcf; outline-offset:1px; z-index:2`。chips `border:0; border-radius:0; background:transparent; color:#f2ebff; box-shadow:none`；chip 输入 `min-height:20px; border:0; background:transparent; color:#f2ebff; outline:none; box-shadow:none`；placeholder `#b9add9` / opacity 1（行 3597–3608）。用途：Feed 多用户搜索，可输入并显示用户 chips。
- 与普通搜索组关键区别是多选芯片容器和内部输入的最小高度 20px（3607）；该数值只描述 chip 输入，不是外框高度。

## 视觉分组与差异

1. **普通主内容工具栏组（S1）**：统一紫色 1px 方框、暗紫底和双向内阴影；输入本体透明，边框属于外层组；焦点在组上显示 2px 粉色 outline，addon 紫粉色。无 theme 声明的高度/padding。
2. **页面专属工具栏组（S2、S3）**：均复用 S1 外框和透明内部输入，没有独立背景、边框、圆角、padding 或高度差异。S2 强调 Tools 页 transition:none；S3 带 Browse History 尾端操作按钮及其自身交互状态。
3. **Feed 多用户芯片组（S4）**：共享 S1 外框与焦点 ring；内部不是单一裸文本输入，而是透明芯片槽和透明芯片输入，输入 min-height 20px。不能误读成普通搜索框换了另一种完整边框。

## 其他搜索线索与排除

- CSS 注释 R4 记录 titlebar 的 `quick search`（行 850–869），但源元素是 `Button[data-vrcx-0-control="toolbar"]`，不是文字类输入框；其规则只保留 background-image reset、1px frame、padding-inline 7px，按钮面/墨色/压边由 Chrome R8 拥有，不纳入搜索输入样本。
- 行 325、350–351、432、439、531–533、562、579、581 的 `search` / `lucide-*-search` 是图标字典/像素图标声明，没有给搜索字段定义外观；作为图标素材线索而非独立输入样式。
- 未找到 sidebar/friends/world/log/gallery 等独立搜索选择器的主题 CSS；如这些页面使用 ToolbarSearch，则落在 S1，共享规则已经覆盖。当前 inventory 和前置 input 报告也指出搜索通常由 input-group 外框承载、内层透明无边框（P1-G1-input.md:50）。

## 级联事故判断

暂未发现明确的意外级联事故或 `!important` 搜索框覆盖。S2/S3 是有意的页面限定复述/增量规则；其样式与共享规则一致。S4 的 chip/input 透明规则是有意结构化多选搜索。它们不应作为互不兼容的基准候选，推荐用户优先从 S1（外层框架）选择。

## 样本限制说明

对照页每个样本都展示默认与聚焦态。主题没有给 input-group 本身定义高度/padding；对照页不伪造这些 CSS 值，输入字段使用浏览器原生 intrinsic 尺寸，宽度仅作 HTML 栅格展示，不代表主题值。颜色、边框、阴影、focus outline 和芯片输入 min-height 均对应上文所列 theme.css 行号。
