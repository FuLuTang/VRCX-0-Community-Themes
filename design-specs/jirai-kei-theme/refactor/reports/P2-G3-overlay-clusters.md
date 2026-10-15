# P2-G3 浮层族收敛表

范围：逐篇核对本目录全部 9 份 G3 报告（select-content、tooltip、toast、popover、select-item、dropdown-menu-item、context-menu-item、hover-card、overlay-bases），并以 `refactor/src/style/` 当前规则行号复核。表中“簇”是外壳/组件责任簇，不把子项状态误算成容器皮肤。

| 簇名 | 包含哪些组件 | 判据 | 必须保留的例外 | 建议选择器骨架 | 证据（文件:行号） |
|---|---|---|---|---|---|
| 共享基底 | context-menu-content、dropdown-menu-content、popover-content、select-content、combobox-content、hover-card-content | 暗紫底、紫边、方角、内凸边+3px硬影一致；menu 两种内容由 `$="menu-content"` 命中，其余明确列槽。hover-card 当前是重复独立声明，建议纳入共用声明源。 | 只合并外壳 paint；菜单/select 的 label/item/disabled/destructive/头像及 portal 子按钮继续分层；popover 日历/按钮、hover-card 头像和按钮保留各自职责。不要接管 portal 定位/尺寸。注意 hover-card 目前 background/radius/shadow 带 `!important`，合并需验证级联。 | `:is([data-slot$="menu-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"],[data-slot="hover-card-content"])`；严格保留 slot 白名单/portal 直命中 | `11-controls-and-pages.css:220–230`；`13-toolbar-overlays-and-pages.css:146–156`；`P1-G3-overlay-bases.md:79–101`；`P1-G3-hover-card.md:36–65` |
| Tooltip 普通款（3px） | 普通 tooltip-content（快捷键/截断标题/侧栏提示仅为可复用语义，不证明独立变体） | 当前普通面板独立 selector；6×12 padding、overflow-wrap:anywhere、3px影。唯一 content 样本，不足以证实其他语义提示的独立外观。 | 普通款排除多行 signature；tooltip 的 `> div.rotate-45` 箭头明确隐藏；不借用到 hover-card；定位由宿主负责。 | `[data-slot="tooltip-content"]:not(:has(> div.flex.flex-col.gap-1.text-xs)):not(.flex.flex-col.gap-1.text-xs)`；箭头隐藏规则单列 | `13-toolbar-overlays-and-pages.css:123–143`；`P1-G3-tooltip.md:32–43,59–77` |
| Tooltip statusbar 多行款（2px） | statusbar server/WebSocket 多行 tooltip-content | 两类 DOM stack signature + 已打开 statusbar trigger 的 body guard；紧凑 6×8 padding、2px影。颜色/边框等可共享 token，但结构/阴影档位不可抹平。 | active-trigger guard 和 stack signature 都要保留；箭头同样隐藏。不能合成无条件 tooltip 规则。 | `body:has(.vrcx-0-statusbar [data-slot="tooltip-trigger"][data-popup-open]) [data-slot="tooltip-content"]:is(:has(> div.flex.flex-col.gap-1.text-xs),.flex.flex-col.gap-1.text-xs)` | `11-controls-and-pages.css:333–356`；`P1-G3-overlay-bases.md:64–67`；`P1-G3-tooltip.md:47–63` |
| Toast viewport 子项卡片 | `[data-slot="toast-viewport"]` 的直接子项（Base UI Toast.Root；不是 viewport 本身） | viewport/content 的采集样式透明无边无影；主题卡片规则锚定 viewport 直子，统一暗底紫边、粉左条、三层硬影。 | title/description 色、action 焦点框、success/error/info/warning 冻结图标及 `toast-content overflow:visible` 单独保留；不得设固定高度或接管 viewport 定位/堆叠。 | `[data-slot="toast-viewport"] > *`；title/description/action/icon 后代另设 | `13-toolbar-overlays-and-pages.css:158–177`；`16-final-navigation.css:1–110`；`P1-G3-toast.md:19–33,35–70` |
| Sheet `:has(...)` 特例 | 仅包含 bell 标题图标的通知中心 `[data-slot="sheet-popup"]` | 当前无条件 sheet 外壳皮肤不存在；唯一主题外壳规则以 bell 锚点限定。样本其他 sheet 为宿主样式，不能由此泛化。 | **应保留** `:has([data-slot="sheet-title"] .lucide-bell)`，防止误刷其他 sheet；header/title/button 子规则保留。仅管 paint，不并入小浮层尺寸/定位。 | `[data-slot="sheet-popup"]:has([data-slot="sheet-title"] .lucide-bell)` | `13-toolbar-overlays-and-pages.css:179–207`；`P1-G3-overlay-bases.md:54–58,86–101` |

## 1. 现状中的重复

- **同一套三层硬阴影完整值在 G3 外壳中逐字出现 5 次**：`inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e`。位置：共享 popup 基底 `11-controls-and-pages.css:227`；普通 tooltip `13-toolbar-overlays-and-pages.css:135`；hover-card `:152`；toast 子项 `:166`；bell sheet `:187`。后 3 处及 hover-card 带 `!important` 而基底/普通 tooltip 未带，故值相同不代表级联等价。
- 同值的 `#211a33` 背景、`#6c5ce0` 紫边、0 圆角和静态化声明也在上述外壳规则重复；共享基底与 hover-card 核心声明尤其重复（`11-controls-and-pages.css:220–230`、`13-toolbar-overlays-and-pages.css:146–156`）。toast 多 `border-left:4px solid #d97fc6`（`13-toolbar-overlays-and-pages.css:163–166`）；sheet 另有 inline-start 边框及 header（`184–205`），不应将这些特例吞并。
- statusbar tooltip 不是同一三层影：其为双层/2px `inset 1px 1px 0 #69557c, 2px 2px 0 #100b1e`（`11-controls-and-pages.css:338–352`），不可计入上述 5 次。
- G3 的主要外壳选择器当前约 **6 条/组**：popup 共用基底、普通 tooltip、statusbar tooltip、hover-card、toast 子项、bell sheet；将 hover-card 壳重复声明并入共享基底后，目标为 **5 组**。这是外壳规则组数，不是全体 G3 CSS 规则数（子项、状态、资源、箭头、减动效规则仍保留）。依据：`11-controls-and-pages.css:220–230,338–356`、`13-toolbar-overlays-and-pages.css:125–190`；既有五组口径见 `P1-G3-overlay-bases.md:79–90`。

## 2. 冲突与待修

- **`$=` 后缀误伤面**：当前规则用到 `$="menu-content"` → `context-menu-content`、`dropdown-menu-content`；`$="menu-sub-content"` → `context-menu-sub-content`、`dropdown-menu-sub-content`；`$="menu-item"` → `context-menu-item`、`dropdown-menu-item`；`$="menu-checkbox-item"` → `context-menu-checkbox-item`、`dropdown-menu-checkbox-item`；`$="menu-radio-item"` → `context-menu-radio-item`、`dropdown-menu-radio-item`；`$="menu-sub-trigger"` → `context-menu-sub-trigger`、`dropdown-menu-sub-trigger`；`$="menu-shortcut"` → `context-menu-shortcut`、`dropdown-menu-shortcut`（若宿主生成这些 slot）。其中后四组是否实际出现在所有路由未由报告样本证明，属选择器可命中名，具体运行时存在性待确认。避免把 `$="menu-item"` 当成只匹配两种已知菜单；未来任何 `*-menu-item` 均会命中。来源：`11-controls-and-pages.css:220,235,242,251,257,268,273–279`；`P1-G3-context-menu-item.md:30–35`。
- **Tooltip 两条规则可否合并？** 可抽共同 token/声明，但不应收成一个无条件选择器：普通款必须 3px/6×12 并排除 stack；statusbar 款须 active-trigger guard、多行 signature、2px/6×8。可用共同基底加两条结构覆盖，仍至少两个分支。普通背景非 important、statusbar 背景 important，合并时核对顺序与 specificity。`11-controls-and-pages.css:338–352`；`13-toolbar-overlays-and-pages.css:123–139`。
- **Sheet `:has` 是否保留？保留。** 这是通知中心专属稳定内容锚点；去掉 `:has` 会把其它 sheet 一起换肤。只要宿主标题图标结构未变就维持；结构变化需待确认再调整，不能改成全体 sheet 基底。`13-toolbar-overlays-and-pages.css:179–190`；`P1-G3-overlay-bases.md:54–58`。
- 统一外壳时勿改定位/positioner；不要用 `:where()` 无评估地降 specificity，也不要将 hover-card 的 important 声明改成普通声明。`P1-G3-select-content.md:29,33–38`；`P1-G3-hover-card.md:63–65`。

## 3. 零覆盖清单

此处“零覆盖”指本次 G3 普查检索到的主题规则中没有针对该槽位/状态的专属声明；不等于宿主无默认样式。

- **菜单 trigger 的 open 高亮没有通用主题规则**：浮层 item 的 `[data-popup-open]` 规则命中行/子触发项，不是触发菜单的外部 trigger（`11-controls-and-pages.css:251`）。portal button 状态规则的适用范围/排除项见 `16-final-navigation.css:201–228`，不能据此宣称覆盖所有菜单 trigger。尚未发现针对 `menu-trigger` / `dropdown-menu-trigger` / `context-menu-trigger` 的通用 open 外观；应作为缺口登记，待 DOM/需求确认是否需要补规则。
- checkbox/radio checked indicator、菜单/选择项图标尺寸与间距、popover-arrow、hover-card-arrow：未找到 G3 专属 indicator/箭头/尺寸规范；保留组件宿主内容，不臆造隐藏或重排。`11-controls-and-pages.css:242–279`；`P1-G3-context-menu-item.md:36–44`；`P1-G3-dropdown-menu-item.md:44–54`；`P1-G3-popover.md:30–36`；`P1-G3-hover-card.md:21,44–46`。
- tooltip 快捷键/标题替代/侧栏图标提示没有独立 content 样本或可证实的专属皮肤；作为普通款共用外壳建议，而非已观测覆盖事实。`P1-G3-tooltip.md:34–43,65–77`。
- Toast 常态 action/close button 样式、最大宽度和换行策略未被主题明确覆盖/样本未采集；只有 focus-visible 声明，勿杜撰尺寸或换行规则。`13-toolbar-overlays-and-pages.css:171–177`；`P1-G3-toast.md:30–33`。

## 4. 收敛后的规模估计

以**外壳主要规则组**计：当前 6 → 目标 5，减少 1 组（约 17%）；目标正是共享基底 1 + tooltip 2 + toast 1 + sheet 1。其余 item 高亮/disabled/destructive、label/separator、arrow hidden、toast 文本/焦点/icon、sheet header、减动效规则不纳入该数字，且不应为了数字而删除。现状基准及目标口径：`P1-G3-overlay-bases.md:79–90`，当前选择器核对：`11-controls-and-pages.css:220–356`、`13-toolbar-overlays-and-pages.css:125–224`。
