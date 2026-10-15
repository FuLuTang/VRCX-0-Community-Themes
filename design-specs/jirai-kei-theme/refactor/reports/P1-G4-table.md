# P1-G4 Table 组件普查

## 1. 范围与 Inventory 记录

本报告仅审计 `family=G4, component=table, tag=table`；Inventory 生成时间 `2026-10-15T00:08:29.006Z`，CSS SHA256 `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`。

| Fingerprint | 观察数 | primaryContext | 路由（组件级） | 关键 computedStyle |
|---|---:|---|---|---|
| `3a26c496669abd1f` | 2 | `surface:data-table` | `/game-log`、`/social/friend-list` | `border-collapse`、`border-spacing`、`table-layout` 未被此 inventory 的 paint fingerprint 采集，故为未记录；`background-color: rgba(0,0,0,0)`；`color: rgb(242,235,255)`；`font-size: 14px`。四边 border-width 均 0px、style solid；border-color `rgb(108,92,224)`；box-shadow none。 |

该组件只有 1 条记录、1 个 styleVariant。不能从这个观测推断 `table-layout`/collapse 等结构属性，也不应把透明 table 背景误读成无表格皮肤：皮肤实际分布在包裹层、header 与 row。

### 同族职责旁证（不是本任务扩展审计）

`table-head`（`th`）有 1 个 fingerprint `b292b2325ed0bfc9`、22 次观察，`surface:table-header`，同两路由；计算色 `rgb(242,235,255)`、背景透明、底边宽度 0、底边色 `rgb(112,81,143)`、字体 12px/500。`table-row`（`tr`）的 data-table context 有两个 fingerprint：`f97e21712034aa3c`（68 次）底边 0.8px solid `rgb(81,67,109)`，以及 `35d5e25f912f1b8d`（2 次）无底边；两者均透明背景、文字 `rgb(242,235,255)`、14px/400。另有 header context 的 row 样本 2 次，仍有 0.8px 底边。

分工结论：**容器/表格本体**负责承载透明表面与整体布局；**row (`tr`) 负责横向分隔线及交互状态背景**；**header (`thead`/`th`) 负责表头底色、文字与表头下沿强调**。不能把背景/边框全部强加在 `table` 本体，否则 hover/selected 行和 sticky header 失去独立状态层。

## 2. theme.css 命中规则

搜索了原生 `table/thead/tbody/tr/th/td` 与 table slot 结构。CSS 没有通用裸标签 `table`, `thead`, `tbody`, `tr`, `th` 皮肤规则；实际样式主要以 `.vrcx-0-data-table`、`.app-data-table` 和 `[data-slot]` 命中，因此下面列出的是实际数据表皮肤规则（而非伪表格 `div` 的通用重置）。行号基于当前 `theme.css`。

| SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `runtime` / 658–661 | `.vrcx-0-main-content .vrcx-0-data-table` | 覆盖 tokens：`--vrcx-0-table-surface:var(--wd-window); --vrcx-0-table-header-surface:var(--wd-raised)`；`background-color:transparent; background-image:none`。仅容器，明确让 header/action/row surface 保持不透明。 |
| `data-surfaces-r10` / 4321–4334 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table)` | 设置表皮肤 tokens：header `var(--wd-raised)`/`var(--wd-text)`；hover `#302650`；selected `var(--wd-select)`、selected-hover `#58458f`；expanded `#332650`；stripe `#241b3c`；border `var(--wd-frame)`；divider `#51436d`；striped divider `#49385f`；sticky edge `var(--wd-frame)`；focus `var(--wd-pink)`。 |
| `data-surfaces-r10` / 4337–4341 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) :is(.vrcx-0-table-header, [data-slot="table-header"])` | `color:var(--wd-text); background-color:var(--wd-raised); border-bottom-color:#70518f`。 |
| `data-surfaces-r10` / 4342–4345 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-header"] > tr` | `border-bottom-style:dotted; border-bottom-color:#70518f`。 |
| `data-surfaces-r10` / 4346–4349 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-head"]` | `color:var(--wd-text); border-bottom-color:#70518f`。 |
| `data-surfaces-r10` / 4350–4356 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-footer"]` | `border-top-style:dotted; border-top-color:#70518f; border-radius:0; background-color:var(--wd-raised); color:var(--wd-text)`。 |
| `data-surfaces-r10` / 4363–4365 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) :is([data-slot="table-row"],[data-vrcx-0-table-row]):hover:where(:not([data-state="selected"]):not([data-state="expanded"]):not(:has([aria-expanded="true"])))` | `background-color:var(--vrcx-0-table-row-hover-surface)`。 |
| `data-surfaces-r10` / 4366–4373 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-row"][data-state="selected"], … [data-vrcx-0-table-row][data-state="selected"]` | `background-color:var(--wd-select); background-image:linear-gradient(to right,var(--wd-square) 0 3px,transparent 3px); background-repeat:no-repeat; background-size:100% 100%; color:var(--wd-text)`。 |
| `data-surfaces-r10` / 4374–4377 | 同容器下 selected row 的首个 `[data-slot="table-cell"]` | `box-shadow:inset 3px 0 var(--wd-square)`。 |
| `data-surfaces-r10` / 4378–4380 | selected row hover（slot 与 legacy row 两组） | `background-color:var(--vrcx-0-table-row-selected-hover-surface)`。 |
| `data-surfaces-r10` / 4382–4385 | expanded row（`:has([aria-expanded="true"])` 或 `[data-state="expanded"]`） | `background-color:var(--vrcx-0-table-row-expanded-surface)`。 |
| `data-surfaces-r10` / 4386–4388 | focused row | `outline:2px dashed var(--wd-pink); outline-offset:-2px`。 |
| `language-badges-r98` / 4943–4959 | `.vrcx-0-data-table td[data-slot="table-cell"] > div.flex.flex-wrap.items-center.gap-1 > span[data-slot="tooltip-trigger"].…` | 只给语言徽章设颜色、底色、底边色、字体；不是 td/table 通用规则。 |

另有 69–79 行 `tokens` section 的旧 table token 默认值（surface/header/hover/selected/border/divider/sticky-edge），由数据表专属 scope 的 R10 token 定义覆盖/细化；不另算皮肤。`table-head` sticky positioning 与 cell sizing 明确由组件原有实现保留（4336 注释），本样式层只改 paint。

## 3. 真表格还是伪表格；是否并行皮肤

Inventory 中 `tag=table` 的实际记录只有 `/game-log` 和 `/social/friend-list`，context 明确经过 `surface:data-table > area:vrcx-0-data-table > area:app-data-table`；`table-head` 和 `table-row` 也只在同样两路由。此证据是 HTML 语义真表格（table/th/tr）由 DataTable 包装器承载，而非只靠 div/grid 的虚构标签。CSS 同时兼容 `.vrcx-0-data-table` 与 `.app-data-table`，但本 inventory 记录到的 `table` 本体对应上述 data-table surface。`/feed`、`/charts`、`/tools/vrchat-log` 都**不在此 table 记录的 routes 中**；不可将其推断成相同真表格实例。尤其 `/tools/vrchat-log` 的 CSS 注释明确说它是 VRChat log 容器/error surface，且“不含 browser-generated table layout”（theme.css 4658），不能作为真表格规则证据。

结论是当前审计到的真 table 为**一套通用 data-table skin**（容器透明；header raised；行 divider/状态），没有观察证据支持 zebra 与像素边框两套并行皮肤。R10 token 中预留 striped surface/divider 是能力位，但不能据此宣称实际观察到斑马纹；现有 row inventory 的 background 仍透明。其它页面可能存在 CSS grid/div 伪表格或图表网格，但本次限定的 inventory 记录与 CSS selector 搜索不足以把它们归入 table 变体，宜由后续组件/页面专项审计。

## 4. 合并与必须保留

| 样式面 | 决策 | 理由 |
|---|---|---|
| table 本体（唯一 fingerprint） | 合并成一个基础容器规则 | 两次观察、仅一个指纹；透明背景/14px 正文同型。collapse/spacing/layout 未采集，不人为覆写。 |
| header (`th`) | 独立子层，不拆成第二套 table skin | 文字 12px/500 与底沿职责不同；保留 raised 背景、sticky、底边强调。 |
| 行分隔 | 保留 row 下边线 | 68/70 row 样本有 0.8px divider，少数例外无底边（如末行/分组状态），不能全局强制每行同线。边框应由 row/cell 层负责，不由 table 外框重复画。 |
| zebra | 不依据当前证据强行增加 | 虽有 token，但样本行背景透明。若产品明确启用 zebra，应作为单一 skin 的可选 `:nth-child(even)` paint token，不另造 skin。 |
| hover | 必须保留 | 与 selected/expanded 互斥排除，提供行级反馈。 |
| selected | 必须保留 | selected 底色 + 3px 左强调边及 selected-hover 特例，状态语义不可并入 hover。 |
| sticky header | 必须保留组件原有 position/高度/字体/列 sizing | 注释明确要求保留；粘性行为属布局，不应被重构覆盖。 |
| 空表 | 保留独立 empty-state 组件职责 | G4 empty 是另一组件，不要把空态边框/插画塞进 table 本体；当前只有非 spinner empty surface 的样式。 |

## 5. 收敛结论与 specificity

收敛为**1 种 table 本体基底 + 3 个语义子层（header、row states/divider、empty sibling）**，而非多套表格皮肤。CSS 骨架建议：` :where(.vrcx-0-main-content) :is(.vrcx-0-data-table,.app-data-table) > table` 只负责 `width`/`background`（仅设置确有需求且不破坏组件布局的属性）；`[data-slot="table-header"]`/`[data-slot="table-head"]` 负责 sticky header 的背景、字色和底沿；`[data-slot="table-row"]` 与 `[data-vrcx-0-table-row]` 负责 divider、hover、`[data-state="selected"]`、expanded；cell 仅承载单元格内容/列级契约。

合并 specificity 时注意：`:where()` 内部 specificity 为 0，但外层 `:is(.vrcx-0-data-table,.app-data-table)` 取最高分支（一个 class），外加 `data-slot` 属性选择器；现有选择器虽以 `:where(.vrcx-0-main-content)` 降低前缀权重，但仍凭 data-table class + slot 属性胜过单纯 `table`/`tr` 默认规则。重构若改为裸 `table`，会被组件 utility class / slot rules 反压；建议沿用限定容器与 slot 的结构，并把交互态规则排在基础 row 之后。避免提高到过长 descendant 链，以免 selected/hover 覆盖顺序难维护。

## 6. 可视化

独立可打开的收敛预览见 [P1-G4-table.html](../preview/P1-G4-table.html)：内嵌 CSS，展示 raised 表头、横向分隔、偶数行条纹、hover 行与选中行。条纹在预览中是用于评审可选能力的展示，不代表 Inventory 已观察到 zebra。
