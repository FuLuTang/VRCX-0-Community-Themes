# P1-G2 Pagination 组件普查

## 口径与 inventory 全记录

筛选 inventory 中 `family=G2, component=pagination`，命中 **1 条记录**：`nav`，无 variant/size，`surface:main-content`，3 observations / 3 states，1 fingerprint。routes 为 `/game-log`、`/notification`、`/social/friend-list`（inventory 行 6578–6594）。该记录唯一 `styleVariants[]`：fingerprint `c30718c0ccb9a8b0`，3 observations（行 6595–6626）。因此是 1 个采集视觉族，不是三种样式。

| primaryContext | 观察数 | 指纹数 | 涉及 routes |
|---|---:|---:|---|
| `surface:main-content` | 3 | 1 | `/game-log`、`/notification`、`/social/friend-list` |

唯一 computedStyle（inventory 行 6598–6625）：`color rgb(185,173,217)`；`background-color rgba(0,0,0,0)`；四边 border 均 0px；`box-shadow:none`；`outline-width:2.4px; outline-style:none`；`opacity:1; filter:none; transform:none; clip-path:none`；字体 `"WD Pixel CJK", "Geist Variable", Geist, "Noto Sans SC", system-ui, sans-serif`，12px/400；text decoration none，颜色同前。其余尺寸、padding、圆角未在该指纹采集属性中记录；唯一指纹之间无 computedStyle 差异可列。

## 样式层命中规则（穷尽）

全体 `refactor/src/style/*.css` 中命中 pagination 的规则仅以下 4 条；位于 `14-buttons-and-data.css` 的 `SECTION buttons-badges-r10`（文件第 1 行）。选择器中的 scope/排除条件均照录：

| 文件 / SECTION / 行 | 选择器 | 声明 |
|---|---|---|
| `14-buttons-and-data.css` / `buttons-badges-r10` / 53 | `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="pagination-content"]` | `gap:2px` |
| 同上 / 54 | `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="pagination-link"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))` | `border-radius:0` |
| 同上 / 55 | `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="pagination-link"]:is([data-active="true"],[aria-current="page"]):where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))` | `background:#ffb8e6; color:#16112a; box-shadow:inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d` |
| 同上 / 56 | `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="pagination-link"]:focus-visible:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))` | `outline:2px solid #ff7fcf; outline-offset:1px` |

证据：CSS 第 1、52–56 行。没有针对 `[data-slot="pagination"]`、`pagination-item`、`previous`、`next` 或 `ellipsis` 的独立规则。selector 覆盖不是“零覆盖”：content gap、link 方角、active 与 focus-visible 有覆盖，但背景/边框/尺寸等常态外观主要借用 Button 基础样式。

## 实际页面与视觉判断

- inventory 实测出现页面只有上表三条 routes；是主内容中的数据表分页，与 `/search` 的 SearchPagination 浮动 pill 不应混为同一个 pagination slot。inventory 仅对采集到的组件记录负责，不证明其它状态/页面绝对不存在（inventory 行 6585–6593）。仓库已有覆盖审计将该原语定位为数据表分页，引用 `ui/shadcn/pagination.tsx:58` 与 `DataTableView.tsx:418`（`runtime/checks/r9-coverage-audit/coverage-table.md:56`）；这些源文件没有在当前可直接检索的工作树中找到，故不扩充 routes。
- 当前页在主题规则中用 `data-active="true"` 或 `aria-current="page"` 命中：粉色 `#ffb8e6` 底、深色 `#16112a` 字、2px 内凹明暗边，像素态清晰（style CSS 第 55 行）。Inventory 对 nav 容器的指纹并未采集 link 当前态，不能声称该值是该三条路由实测 computedStyle。
- 链接方角：主题明确 `border-radius:0`，但仅限主内容/侧栏且避开 toolbar、popover、sm 卡片、object-row context-action（第 54 行）。因此常规数据表 pagination link 不露 shadcn 的 2px 圆角；历史覆盖审计记录原实现仅借 Button outline/ghost、2px 圆角（`coverage-table.md:56`）。链接尺寸没有被分页规则改动；Button-rendered anchor 保留源 icon/default 尺寸，且既有 r10 fixture 验证链接至少 30×30px（`runtime/buttons-badges-r10.css:51`；`runtime/checks/r10-buttons-badges/verify.mjs:60–61`）。具体尺寸来自应用 Button 样式而非 inventory，不能把 30px 当作 inventory 的测量结果。
- 对 ellipsis / item / previous / next 的槽位无专项定制；它们若自身是 pagination-link，会受通用 link 规则与排除项影响；否则默认外观取决于源组件和类。不能从目前证据精确给出这些部件背景/圆角。

## 合并判断与收敛建议

inventory 只有一个视觉指纹，没有需要保留的跨路由皮肤差异。可合并为 **1 种主内容数据表分页样式**：content `gap:2px`；link 沿用 Button 尺寸，仅方角；active 粉底+深字+inset 像素边；focus-visible 粉色 outline。关键规则骨架可继续是 `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="pagination-link"]` 与 active/focus 伪类，content 独立设 gap；不要盲目把 `item/ellipsis/previous/next` 全部做成按钮。若简化现有选择器，须保留 `:where()` 的低 specificity 作用域和明确的例外排除；扩大到所有 link 会覆盖 toolbar / popover / 小卡片等已刻意排除的控件。当前选择器里的 `:not(...)` 与 `:is(...)` 含有非零 specificity，若收敛重写，比较最终 specificity，避免与基础 Button 类规则争优先级。

## 可视化

见同目录 `../preview/P1-G2-pagination.html`。双栏以相同分页条对照主题效果与假设的未覆盖默认效果；右栏明确是示意，圆角参照覆盖审计记载的 2px shadcn Button 圆角，非本次 inventory 实测截图。