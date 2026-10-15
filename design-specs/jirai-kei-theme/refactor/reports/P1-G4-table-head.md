# P1-G4 table-head 组件普查

## 范围与 Inventory

Inventory 生成于 `2026-10-15T00:08:29.006Z`，family G4。按 `component=table-head`、tag 为 `th/thead` 或 `table-header` 命名检索，本次仅有以下一条记录；没有额外 `thead`、`table-header` component 记录。

| component/tag | primaryContext | observations | 指纹数 | routes | styleVariants 与差异 |
|---|---|---:|---:|---|---|
| `table-head` / `th` | `surface:table-header` | 22 | 1 | `/game-log`, `/social/friend-list` | `b292b2325ed0bfc9`（22）：color `rgb(242,235,255)`；background `rgba(0,0,0,0)`；border-bottom width `0px` / style `solid` / color `rgb(112,81,143)`；font-size `12px`；font-weight `500`。其余三边宽度均 0；box-shadow none。 |

computedStyle 对需审计的背景/边框/字重/字号可直接读出如上。Inventory 没有采集 `text-align`、height、letter-spacing、text-transform、padding，均为**未采集**；不要把未采集误当作初始值或主题值。详细指纹字段见 inventory:10868–10924，记录和上下文范围见 10871–10882、10918–10923。

## 样式层命中规则

样式层全量检索原生 `th`/`thead` 及 `[data-slot="table-head"]`、`[data-slot="table-header"]`。没有裸 `th`、裸 `thead` 或通用排序表头规则；与表头相关的实际 CSS 是 `14-buttons-and-data.css` 的 `SECTION data-surfaces-r10`。该 SECTION 注释称保留 sticky header 原有 pixel font、height、sticky position 与 cell sizing（103–104）。

| 文件 / SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `14-buttons-and-data.css` / `data-surfaces-r10` / 87–101 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table)` | 定义 table 专属变量：header surface `var(--wd-raised)`、foreground `var(--wd-text)`；divider `#51436d` 等，含 hover/selected/expanded/stripe/sticky-edge 变量。此处 `--vrcx-0-table-divider:#51436d` 是 token，并非本 SECTION 给 header 下沿绘制的 solid 线。 |
| 同上 / 103–108 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) :is(.vrcx-0-table-header, [data-slot="table-header"])` | `color:var(--wd-text); background-color:var(--wd-raised); border-bottom-color:#70518f`。这是 header 容器（通常 thead）的 raised 底色与前景色；只给 border 指定颜色，没有在此指定 width/style。 |
| 同上 / 109–112 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-header"] > tr` | `border-bottom-style:dotted; border-bottom-color:#70518f`。对象是 header 下的 `tr`，不是 `th`。 |
| 同上 / 113–116 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-head"]` | `color:var(--wd-text); border-bottom-color:#70518f`。对象是每个 `th`，没有设置背景、border-bottom-style 或 border-bottom-width。 |
| `01-tokens.css` / 69–79 | `:root` data-table tokens | 初始 header surface `#2a2147`、foreground `#f2ebff`；R10 在数据表 scope 中重设为 `var(--wd-raised)` / `var(--wd-text)`（14 行 89–90）。 |

样式层未找到 `th:hover`、`[aria-sort]`、sortable、sort-arrow/icon 的表头专属规则（grep 结果仅以上 table header 规则与 tokens）。所以主题样式没有为可排序表头增加 hover 变色或箭头；若应用组件自身画了排序指示器，不属于本次主题 CSS 命中证据。

## 核心判断

- **有独立 raised 表头背景**：`background-color:var(--wd-raised)` 出自 14 行 104–108 的 header 容器规则；该 token 在 01 行 40 解析为 `#2a2147`。th 自身的 inventory 背景仍透明，这是容器底色透显，并不矛盾。
- **solid `#51436d` 与 dotted `#70518f` 不是同一元素上的冲突声明。** `#51436d` 出现在 R10 数据表 divider token（14 行 96–98），用于数据行分隔体系；前作 row inventory 观测到 0.8px solid `rgb(81,67,109)` 是 row/tr 样本，不是 table-head 指纹（inventory 10868–10924 对照 10926–11071）。表头规则则是 header 容器的 `border-bottom-color:#70518f`（104–108）、header `tr` 的 `border-bottom-style:dotted; border-bottom-color:#70518f`（109–112），以及 `th` 的 `border-bottom-color:#70518f`（113–116）。**实际意图与作用范围：表头下沿 dotted `#70518f`；普通行分隔 solid `#51436d`。**
- 级联上，容器/`tr`/`th` 是不同盒子，specificity 不能跨元素互相覆盖。`tr` 规则控制行盒的 dotted style；`th` 规则控制单元格的 color。若同一 th 同时受 utility 的 bottom border width/style 影响，则主题 th selector（`:where()` 为零权重；`:is()` 取 `.vrcx-0-data-table` 的 class 权重，再加 `[data-slot=table-head]`，约 `(0,2,0)`）可压过裸 tag `th` `(0,0,1)`，但更高 specificity 的 utility/组件规则仍可能赢。Inventory 记录 th 的 computed bottom width 为 0px/style solid，表示 th 盒本身没有实线底边；行规则在 tr 上画 dotted。故不能把 tr dotted 误报为 th 的 computed border style。CSS border-collapse/绘制边界未由此 inventory 采集，具体像素合成仍取决于表格结构；但样式层明确将 dotted 规则限定在 header > tr。
- **表头文字**：Inventory 实测 color `rgb(242,235,255)`、font-size `12px`、font-weight `500`（inventory:10887–10914）。`letter-spacing`、`text-transform` 未采集；CSS 样式层没有给其设置，无法仅凭本 inventory 报称其计算值。没有大写转换规则，因此主题未要求 uppercase。
- **排序样式**：本样式层未见 sortable/`aria-sort`/排序箭头及专用 hover 规则。可排序列只需保留应用层语义/图标，不能凭主题层宣称存在排序样式。
- **内边距**：本 inventory 没采集 padding；主题层命中规则也没有 padding 声明（14 行 103–116）。所以表头 padding 不是这组主题 CSS 提供的；它由组件/Tailwind utility 或组件默认布局承担。CSS 注释还明确保留现有 cell sizing（14 行 103–104）。不应从 paint inventory 推测 padding 的具体 px 值。

## 合并与保留

| 项目 | 决策 |
|---|---|
| 普通表头视觉（raised 背景、前景色、12px/500 文字、强调下沿） | 22 次观察只有 1 指纹，合并为一套通用基础表头。 |
| 可排序表头 | 主题层没有第二种 skin；可继承基础表头。若应用层存在排序方向/箭头状态，应保留为独立语义状态，不并入普通表头，也不在本轮虚构主题规则。 |
| sticky 表头 | 保留原 position、height、字体与 cell sizing；SECTION 注释（14:103–104）要求不改布局。 |
| 分组表头 | Inventory 未见单独指纹或命名记录；若未来有 colspan/多层分组语义，应保留结构/边界例外，不能强制扁平化为单行交互状态。 |
| 下沿线 | header `tr` 的 dotted `#70518f` 与普通 data-row solid `#51436d` 职责不同，必须分开；不要合并成一条统一 row border。 |

## 收敛结论与 specificity

收敛为**1 种基础 table-head 视觉样式**，并保留排序（若组件提供）、sticky、分组结构作为结构/状态例外，而非额外皮肤。CSS 骨架可用限定容器下的 `[data-slot="table-header"]` 设置 `background-color:var(--wd-raised); color:var(--wd-text)`，`[data-slot="table-header"] > tr` 设置 dotted 下沿，`[data-slot="table-head"]` 保留字色与边线颜色；避免把行 divider token 写成 header solid border。

合并时不能将现有容器限定选择器降格成裸 `th`。单独 `th` specificity 是 `(0,0,1)`，低于组件 utility class，也可能被后续规则覆盖（与 button/img 同类风险）；现有 `:where()` 降低前缀权重，但容器 `.vrcx-0-data-table` 与 slot attribute 仍提供约 `(0,2,0)` 的约束。更稳妥是保留容器 scope + slot 语义，且按“header base → sort/state exception”排序。
