# P1-G4 table-row 组件普查

## 范围与 inventory 变体

限定 `family=G4, component=table-row, tag=tr`。Inventory 中共 2 条记录、72 次观察：`surface:data-table` 70 次、2 个 fingerprint；`surface:table-header` 2 次、1 个 fingerprint。两条记录路由均为 `/game-log`、`/social/friend-list`。

| primaryContext | 观察数 | 指纹数 | Fingerprint / 关键差异 |
|---|---:|---:|---|
| `surface:data-table` | 70 | 2 | `f97e21712034aa3c`（68）：背景 `rgba(0,0,0,0)`，颜色 `rgb(242,235,255)`，底边 `0.8px solid rgb(81,67,109)`；`35d5e25f912f1b8d`（2）：背景及颜色相同，底边宽度 `0px`（style solid、颜色仍 `rgb(81,67,109)`）。 |
| `surface:table-header` | 2 | 1 | `34077af1e389ff39`（2）：背景 `rgba(0,0,0,0)`，颜色 `rgb(242,235,255)`，底边 `0.8px solid rgb(81,67,109)`。 |

inventory 采集字段里有 background/color/border-width/style/color；height **未采集**。两种 data-table fingerprint 的 paint 差异仅底边宽度；header context 的 row 文字字号为 12px，而 data-table 为 14px，非 row 背景皮肤差异。证据：inventory 10925–11070。

## 样式层命中规则

| 文件 / SECTION / 行 | 选择器 | 声明及作用 |
|---|---|---|
| `14-buttons-and-data.css` / `data-surfaces-r10` / 109–112 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-header"] > tr` | `border-bottom-style:dotted; border-bottom-color:#70518f`。这是 header 内的 `tr` 下沿，并非 body row divider。 |
| 同上 / 130–132 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) :is([data-slot="table-row"], [data-vrcx-0-table-row]):hover:where(:not([data-state="selected"]):not([data-state="expanded"]):not(:has([aria-expanded="true"])))` | `background-color:var(--vrcx-0-table-row-hover-surface)`；token 在 91 行定义为 `#302650`。 |
| 同上 / 133–140 | 同容器下 `[data-slot="table-row"][data-state="selected"]` 与 `[data-vrcx-0-table-row][data-state="selected"]` | 背景 `var(--wd-select)`；背景图 `linear-gradient(to right,var(--wd-square) 0 3px,transparent 3px)`，不重复、铺满；文字 `var(--wd-text)`。 |
| 同上 / 141–144 | selected row 的首个 `[data-slot="table-cell"]` | `box-shadow:inset 3px 0 var(--wd-square)`。 |
| 同上 / 145–148 | selected row `:hover`（两种 row 标记） | `background-color:var(--vrcx-0-table-row-selected-hover-surface)`，token 为 `#58458f`（94 行）。 |
| 同上 / 149–152 | row `:has([aria-expanded="true"])` 或 `[data-state="expanded"]` | `background-color:var(--vrcx-0-table-row-expanded-surface)`，token 为 `#332650`（94 行）。 |
| 同上 / 153–156 | row `:focus-visible` | `outline:2px dashed var(--wd-pink); outline-offset:-2px`。 |

没有找到给 body row 直接设置 divider 的规则；样本实际 0.8px `border-bottom` 与独立样式层职责应区分，不要把 header `tr` 的 dotted 下沿误当作 body row 线。样式层也没有命中 `[aria-selected]` 的 row 选择器。

## 视觉职责核实

- **分隔线**：inventory 的 68 个 data-table 样本和 2 个 header-context 样本观察到 `border-bottom:0.8px solid rgb(81,67,109)`，另 2 个 data-table 观察为 0px；`box-shadow:none`。因此证据支持 border-bottom，不是 box-shadow。样式层 body row 没有画此线的规则；header `tr` 是另一条 dotted `#70518f` 下沿（109–112）。没有证据称渐变画 divider；选中态的渐变仅是左侧强调条（136–138）。
- **hover**：仅改背景色为 `#302650`（130–132）；不改边框/文字。基础 hover 明确排除 selected、expanded、含展开控件的行。
- **selected**：`[data-state="selected"]`（非 `[aria-selected]`）设置背景 `var(--wd-select)`、文字色，并通过 row 背景渐变及首 cell inset shadow 画 3px 左侧 `var(--wd-square)` 强调线（133–144）。hover 时背景改为 selected-hover token `#58458f`（145–148），强调条仍保留。
- **expanded**：`[data-state="expanded"]` 或含 `[aria-expanded="true"]` 子元素时背景 `#332650`（149–152）；属于独立状态背景。
- **zebra**：再次检索整个样式层，未发现 `nth-child`/`nth-of-type` 与 table row stripe 组合规则。只有预留 token `--vrcx-0-table-row-striped-surface:#241b3c`（95 行）及 `--vrcx-0-table-striped-divider:#49385f`（98 行），没有实际应用选择器；非注释规则，也没有可判定为被覆盖的 zebra 规则。故 CSS 里存在 token 能力位，但没有启用 zebra 样式。此前 inventory 也未采到条纹背景，参见前作 `P1-G4-table.md` 15、45 行。

## 合并判断与状态优先级

可合并为一套 row 基底与统一交互状态；不应把 0px 与 0.8px 的边线差别硬做第二套皮肤，交由组件原有边界（如末行）或保留条件处理，因为观察数据只说明存在例外，未给出其语义。header 下沿独立保留。Hover 的通用规则排除 selected/expanded；selected-hover 是明确特例。Expanded 规则排在 selected-hover 后且未排除 selected，因此 selected + expanded 同时出现时，expanded 背景因同等优先级下后置而胜出；selected 的左强调仍在。含展开控件的 hover 同样不触发普通 hover，但若没有 expanded 标记则无额外 hover 底色。建议按显式状态优先级整理为 expanded > selected-hover > selected > hover > base，并明确写出互斥/组合语义，避免依赖源码偶然顺序。当前样式没有 zebra，预览中展示 zebra 仅作为“未启用能力”的对照。

## 收敛结论 / specificity

收敛为**一条基础 row 规则 + 交互状态规则（hover、selected、selected-hover、expanded、focus）**；body divider 作为现有组件边界属性保留而不是新造通用线规则。CSS 骨架沿用 data-table scope 下 `:is([data-slot="table-row"],[data-vrcx-0-table-row])`，状态用 `[data-state="selected"/"expanded"]` 与 `:has([aria-expanded="true"])`；zebra 先不写。若最终合并成裸 `tr`，其 specificity 是 `(0,0,1)`，可能输给组件 utility/slot 规则，存在与 button/img 同类覆盖风险；保留容器和 slot 的低权重限定，避免改为过强的长链。

## 可视化

独立预览：[P1-G4-table-row.html](../preview/P1-G4-table-row.html)。其中默认/hover/selected/expanded 使用样式层实值；zebra 卡片刻意标注为未启用 token 示意，不代表已观测或项目中实际启用。
