# P2-G2 导航与控件族收敛表

口径：综合本目录 G2 组件普查与 `P1-G2-all-triggers.md`；inventory 指纹不等同独立皮肤，未采集的尺寸/盒模型不推断。输入框统一采用已定 B3 四边斜面（`#2a2147`、2px 斜面及配套 2px inset）；滑条统一通用款。

| 簇名 | 包含哪些组件 | 判据 | 必须保留的例外 | 建议选择器骨架 | 证据（文件:行号） |
|---|---|---|---|---|---|
| 像素 tabs 底槽与 tab 状态 | tabs、tabs-list、tabs-tab、tab-indicator | tabs 只负责布局；list 画暗底方角轨道；tab 自身负责 hover/active/focus。横向、普通 embedded 与竖向共享色板/状态。 | Settings 竖 rail 留白、clip/lace；Chart rail 的间距/后置 lace；SidePanel folder rail 用真实 `[role=tab]`、面板融合和右粉脊，独立分支。indicator 隐藏仅限已证实的 pixel 作用域。 | `[data-slot=tabs-list]`；直接子 `[data-slot=tabs-tab]` 的 `:hover`/`:is([data-active],[aria-selected=true])`/`:focus-visible`；方向 modifier；`.vrcx-0-side-panel-rail [role=tab]` 独立 | `P1-G2-tabs.md:83–97`; `P1-G2-tabs-tab.md:66–78`; `P1-G2-tabs-list.md:40–60`; `P1-G2-tab-indicator.md:23–47` |
| Toggle 与分段组 | toggle、toggle-group、组内 separator | standalone/toolbar toggle 状态色可共用 token；group 管组框、间隙和分段方式。 | outline 连续组（gap 0、外框、separator）；default chip row（gap 2、单项边框/28px min-height）；禁用不被 hover/pressed 覆盖；toolbar outline 局部边框/bevel。toggle-group inventory 实际标 G1，按组件而非 family 纳入此簇。 | `[data-slot=toggle]` 状态轴；`[data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger])`；组内 separator 独立 | `P1-G2-toggle.md:46–53`; `P1-G2-toggle-group.md:24–35` |
| Button 基底与语义态 | button（含 toolbar/icon 几何） | ghost 透明、outline/secondary 凹面、default 粉凸面、danger、link 属少数语义族；尺寸/disabled/focus 是正交轴。 | titlebar/close、tile/object-row 整面按钮、selected、link、语义色、icon hit-area；不可把所有 trigger 当 button。 | `[data-slot=button][data-variant]`；尺寸另用 `[data-size^=icon]`；状态由 aria/data 属性 | `P1-G2-button.md:89–110`; `P1-G2-all-triggers.md:46–68` |
| Badge 与独立标记 | badge、feed region/status chips、language badge | 普通 badge 共用方角/bevel 基底，variant 控粉色 default、紫色 secondary、中性 outline。 | titlebar unread counter 的定位/反相闪烁/reduced-motion；language 条纹底线；feed region/status 语义/结构；danger、trust、online/offline 色。 | `[data-slot=badge][data-variant]`；计数器 `[data-ui-role=notification-count]`；chip 继续精确 class/结构 | `P1-G2-badge.md:25–36`; `P1-G2-badge.md:55–74` |
| 静态 separator 与 splitter 分界 | separator、toggle-group/toolbar 内 separator | 普通横纵点线共享颜色/点距 token，方向改 gradient。 | popup/menu separator 保留 popup scope；组内窄槽 2px；resizable-handle 是交互 splitter，不是 separator；容器边框和 lace 不并入。 | `[data-slot=separator][data-orientation=…]`；popup 宿主单独限定；`[data-slot=resizable-handle]` 不并入 | `P1-G2-separator.md:28–38`; `P1-G2-separator.md:66–78` |
| Pagination | pagination-content/link | 单一采集指纹；content gap、link 方角、active 粉底、focus outline 可归一。 | toolbar/popover/sm-card/object-row 排除；尺寸仍继承 Button，不扩成所有分页子槽按钮。 | `[data-slot=pagination-content]`；`[data-slot=pagination-link]` + active/current/focus | `P1-G2-pagination.md:13–24`; `P1-G2-pagination.md:33–35` |
| Toolbar dropdown trigger | dropdown-menu-trigger | 仅明确的 toolbar icon-xs trigger 有基础与 expanded 状态，可并成一个小规则组。 | 不与 `[data-slot=button]` 通用皮肤合并；列表/卡片触发器局部规则保留。 | `.vrcx-0-page-toolbar [data-slot=dropdown-menu-trigger][aria-expanded]`，基础与 expanded 分层 | `P1-G2-all-triggers.md:39–40`; `P1-G2-all-triggers.md:65–68` |
| Tooltip trigger 情境组 | tooltip-trigger | 不是统一按钮皮肤；仅 toggle-group、toolbar pressed 等联合选择器有状态定义。 | 键帽、圆点及其它提示锚点异构用途；hover-card 内部 badge 规则不是 trigger 皮肤。 | `:is([data-slot=toggle],[data-slot=tooltip-trigger])` 限定组；toolbar/键帽/圆点各自精确 scope | `P1-G2-all-triggers.md:41–46`; `P1-G2-all-triggers.md:53–68` |
| 其它浮层触发器（不新增皮肤） | context-menu-trigger、popover-trigger、sheet-trigger、sheet-close、hover-card-trigger | slot 不同即不命中 button 基底；inventory 出现不代表主题有专属覆盖。 | context-menu 仅祖先条件影响其子项；hover-card-trigger 的内部 badge 后代特例留原处。 | 不建通用 trigger selector；仅在确有后代需求时以组件宿主限定 | `P1-G2-all-triggers.md:36–51`; `P1-G2-all-triggers.md:59–68` |
| B3 输入框与通用滑条（决策并入） | 输入框外框；所有滑条 | 按已定决策统一结构，避免各上下文重复外观；本次 G2 报告未给出可验证滑条规则数。 | 输入语义/尺寸和可访问焦点状态仍保留；禁止据本组报告虚构现有滑条覆盖范围。 | 输入框既有稳定组件契约 + B3 token；滑条统一通用组件契约（具体属性待确认） | 决策依据：本任务已定前提；G2 滑条证据待确认 |

## 1. 现状中的重复

- Button 通用方角/焦点：`02-foundation.css:674–675` 与 `buttons-badges-r10` 集中规则（`P1-G2-button.md:74,80`）；同一变体外观在 chart HUD `4263–4274` 重写（`P1-G2-button.md:80,87`）。
- Button 凹面 outline/secondary 与粉色 default 在 login `2210–2235` 复现通用变体外观；popover 特例 `4306–4307` 再覆粉色主操作（`P1-G2-button.md:76,87`）。titlebar R3/R8 多段迭代重复 bevel/hover/focus，但 close hover/window 语义仍应留例外（`P1-G2-button.md:75,87`）。
- Toggle-group outline 基础/状态重复于全局与 toolbar：`06-panels-and-settings.css:148–155`、`11-controls-and-pages.css:50–86`；toolbar default 是另一结构，不算重复基底（`P1-G2-toggle-group.md:18–31`）。
- Tabs 横向/Chart 纵向/embedded 重写相同底槽与 tab 状态：`11-controls-and-pages.css:8–36,405–439`、`14-buttons-and-data.css:58–62`；只合并共同色板/状态，方向与 scope 例外仍在（`P1-G2-tabs-list.md:28–34,56–60`）。
- Badge 的 reduced-effects 分支重复静态停止态，`badge-r9:2416,2421–2439`；抽静态声明，不合并闪烁动画（`P1-G2-badge.md:47,53`）。
- Pagination 仅一条记录、separator 同指纹跨 context，报告未指出相同组件皮肤的多处重复定义；不把相似边框、lace 或 splitter 算重复（`P1-G2-pagination.md:5–11`; `P1-G2-separator.md:66–82`）。

## 2. 冲突与待修

- **tab-indicator：保留隐藏策略，暂不整体删除。** 四条命中规则全部 `display:none`，没有外观/定位/尺寸或重新显示规则；但 inventory 有 main-content/side-panel 记录且 fingerprint 不采集 display，隐藏选择器并非全局兜底。pixel tabs 当前由 tab 自身画 active，indicator 若显示会双重强调；保留为可选组件、隐藏规则按 pixel 家族收敛，不把 R7 `::after` 扫光误作 indicator。`P1-G2-tab-indicator.md:5–7,23–47`; `P1-G2-tabs-tab.md:50–64`。
- **`$=` 后缀误伤风险：** G2 all-trigger 报告没有 `$=` 选择器证据，不能据其列出“G2 命中 slot”。相邻菜单审计记录了共享规则的已确认命中：`[data-slot$="menu-content"]` → `context-menu-content`、`dropdown-menu-content`；`[data-slot$="menu-item"]` → `context-menu-item`、`dropdown-menu-item`。此外 `menu-checkbox-item`、`menu-radio-item`、`menu-sub-trigger`、`menu-shortcut` 各自后缀分支命中对应 context/dropdown 复合 slot；`[data-slot$="-item"]` / `-trigger` 会命中所有以该尾缀结尾的值，若 selector 使用则属开放集合，存在未来组件误伤。具体实际 slot 外延须按应用 DOM 核验，待确认；避免仅凭 suffix 扩大匹配。证据：`P1-G2-all-triggers.md:37–46`（G2 中 slot 不同不会继承 button）；后缀命中列举来源 `P1-G3-context-menu-item.md:32–34`、`P1-G3-overlay-bases.md:44`、`P1-G3-select-item.md:21,34`（辅助风险核对）。
- **tabs-tab active 黑边孤例：** `e412…` 仅 1 次观察，active 粉底/暗字/bevel 与 13 次 active 指纹相同，只有 border 变为暗色；应定性为局部异常/样本例外，非新增视觉簇。追查具体 DOM/state 与来源后再决定是否保留，当前待确认，不以它覆盖通用 active 紫边。`P1-G2-tabs-tab.md:15–24,68–70`。

## 3. 零覆盖清单

按“没有直接、专属触发器皮肤规则”的严格口径，核实为：`context-menu-trigger`、`popover-trigger`、`sheet-trigger`、`sheet-close`。context-menu-trigger 虽在选择器祖先链中出现，但声明作用于子 button/badge，不是 trigger 本身；popover-content 与 dialog-close 也不匹配对应 trigger/close slot。`hover-card-trigger` 本身无按钮状态皮肤，但有内部 badge 后代特例，故不列为完全零命中。其他 trigger 的规则见表中 toolbar dropdown/情境 tooltip。证据：`P1-G2-all-triggers.md:39–51,59–68`。

## 4. 收敛后的规模估计

建议约 **9 个组件视觉簇 + 2 个已定跨族决策**：表中前九行分别为 tabs、toggle/group、button、badge、separator、pagination、dropdown-trigger、tooltip-trigger、无皮肤 trigger；B3 输入框与通用滑条是决策并入项，不计入 G2 普查可证视觉簇。规模不是规则条数：tabs 仍含横/竖/SidePanel 结构 modifier，toggle-group 有两种结构，separator 有普通/popup/窄槽三种，trigger 保留 scoped 例外；预计可共享的是基底/token/状态，而不是把每行压成单条 CSS。button 报告自身建议 6 个样式层级、badge 6 族、tabs 2 个底槽家族（3 种用法），这些不可简单相加为 CSS 规则数。依据：`P1-G2-button.md:101–110`; `P1-G2-badge.md:63–74`; `P1-G2-tabs.md:93–97`; `P1-G2-separator.md:66–78`; `P1-G2-toggle-group.md:33–35`; `P1-G2-all-triggers.md:65–68`。