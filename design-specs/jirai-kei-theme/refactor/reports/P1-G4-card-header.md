# P1-G4 card-header 组件普查

## 范围与 inventory 证据

数据来自 `component-variant-inventory.json`（generatedAt 2026-10-15；theme.css SHA256 `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`）。筛选 `family=G4, component=card-header, tag=div`，inventory **只有 1 条记录**：`primaryContext=surface:main-content`、63 次观察、7 个状态、3 个 styleVariants；routes 为 `/community-themes`、`/dashboard/:placeholder`、`/friends-locations`、`/settings`、`/themes`、`/tools`。`contextTrails` 也只有共同的 `page-scaffold` 路径（63 次），没有按容器/路由将每个指纹分组。因此不能把某个指纹精确归属到某条路由或容器。

| primaryContext | 区分线索（该记录 routes） | 观察数 | 指纹数 | fingerprint（观察数） |
|---|---|---:|---:|---|
| `surface:main-content` | `/community-themes`, `/dashboard/:placeholder`, `/friends-locations`, `/settings`, `/themes`, `/tools` | 63 | 3 | `4ba2ac07d5c1aba5`（37）；`114efd3ba3ea6efe`（25）；`58aae87d14b762b5`（1） |

下表列 paint fingerprint 中与任务相关且确实采集的 computedStyle。所有 3 个 variant 的 color 均为 `rgb(242, 235, 255)`（#f2ebff）；border-top/right/left 均 0px solid；outline-width 2.4px 但 outline-style 为 none。**padding 不在采集属性中，记为未采集。字号是 14px。**

| 指纹 / 观察 | 背景 | 边框（下边） | 阴影 | 内边距 | 字号 | 其他差异 |
|---|---|---|---|---|---|---|
| `4ba2ac07d5c1aba5` / 37 | 透明 `rgba(0,0,0,0)` | `0.8px dotted rgb(112,81,143)`（#70518f） | none | 未采集 | 14px | opacity 1 |
| `114efd3ba3ea6efe` / 25 | `rgb(47,37,82)`（#2f2552） | `0.8px solid rgb(22,17,42)`（#16112a） | `inset 0 1px 0 0 rgb(253,244,255)`（#fdf4ff） | 未采集 | 14px | opacity 1 |
| `58aae87d14b762b5` / 1 | 透明 `rgba(0,0,0,0)` | `0.8px dotted rgb(112,81,143)`（#70518f） | none | 未采集 | 14px | opacity 0.6；paint 与首项相同，单独差异是 opacity |

## 样式层命中规则

按 `refactor/src/style/*.css` 对 `card-header` 的全文命中核查。以下包含直接定义 header paint/布局的规则，以及命中 header 内后代、伪元素的局部规则；后者不是 header 本身的 paint。SECTION 来自对应文件注释。

| 文件 / SECTION / 行 | 选择器 | 实际声明与分类 |
|---|---|---|
| `02-foundation.css` / runtime / 69 | `[data-slot="card-header"]` | **通用**：`background-image:none; border-bottom:1px dotted #70518f`。不设背景色/阴影。 |
| `02-foundation.css` / runtime / 82–90 | `.entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]` 及 `::before`、`::after` | dialog 内 header 的横幅按钮定位与装饰：`position:relative`；伪元素 `content:""; position:absolute; z-index:1; pointer-events:none`，设置 mask。**容器限定的后代装饰**，不定义 header 面板。 |
| `02-foundation.css` / runtime / 98–101 | `.entity-dialog [data-slot="card-header"] div.absolute.bottom-3.left-3 [data-slot="button"]:not(.border-0)` 及其 `img` | dialog header 内头像按钮清边框/阴影/outline，图片方角与像素 clip。**后代样式**。 |
| `06-panels-and-settings.css` / settings / 178 | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header]` | **容器限定**：`background-color:#2f2552; border-bottom:1px solid #16112a; box-shadow:inset 0 1px #fdf4ff`。与 inventory 的 title-band 指纹吻合（computed border 0.8px，CSS 声明 1px 在布局像素/缩放采样上有差异）。 |
| `06-panels-and-settings.css` / settings / 180–185 | 同上 header 下的 `[data-slot=collapsible-trigger]`、`:hover`、`::before`、`::after` | header 内触发器 padding-left 36px/right 10px、方角、字色；hover 背景；charm 与 lace 伪元素。**header 子内容/装饰**，非 header 的 padding。 |
| `10-login-and-dialogs.css` / login-r8 / 65–79 | `[data-vrcx-0-surface="login-page"] [data-slot="card"] > [data-slot="card-header"]` | **登录容器限定**：负 margin 抵消卡片 padding；padding-block/inline 按 `--card-spacing` 补偿；polygon clip；移除边框再设底边 `1px solid var(--wd-frame)`；圆角、粉色 `--wd-title-active` 背景、无背景图、深色字与像素字体。布局契约不可视为纯 paint。 |
| `10-login-and-dialogs.css` / login-r8 / 82–90 | `[data-vrcx-0-surface="login-page"] [data-slot="card"]:has(> [data-slot="card-content"] form) > [data-slot="card-header"]` | **登录表单限定**：`margin-block-start:-0.5rem; padding-block:0; min-height:3.1875rem; grid-template-columns/rows; align-items:center; gap:0`。覆盖上条几何，用于单行 form header。 |
| `10-login-and-dialogs.css` / login-r8 / 91–102、103–117 | form header 的 link/title 子节点；一般 login header 内 title/link（含 hover） | 标题/链接网格位置、颜色、字体、下划线 hover。**后代规则**，非 header 外框。 |
| `10-login-and-dialogs.css` / login-r8 / 250–256、280–294 | `.entity-dialog [data-slot="card-header"]...` | dialog header 横幅、头像按钮与图片的样式/伪元素。**容器限定的内部图像装饰**，不定义 header 背景/分隔线。 |
| `09-motion-and-user-surfaces.css` / user-surfaces / 193–197 | `.entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::before/::after` | dialog banner 装饰伪元素；与 02/10 相同目标范围的重复/后续装饰声明。非 header 本体。 |
| `15-late-components.css` / banner-frame-r96 / 2–6 | `.entity-dialog [data-slot="card-header"]>div.relative...` 及 banner descendants | 高限定 dialog banner 的 lace frame、`::before/after` 颜色与层级。**内容装饰**，不改变 header 面板 paint。 |
| `15-late-components.css` / cards-r97 / 151 | `[data-tools-section] [data-slot=card-header]` | **容器限定**：与 Settings 相同的 `#2f2552`、底边 `1px solid #16112a`、inset 高光。 |
| `15-late-components.css` / cards-r97 / 154–161 | tools/vertical-tabs header 内 trigger，以及两者合并的 `:is(...) [data-slot=card-header]` / `::after` | trigger 几何/hover；共享 charm；header `position:relative; z-index:1`；挂 lace `::after`。**子内容和标题栏装饰**；`::after` 规则覆盖两类容器。 |

### 是否 inventory 与 CSS 同一批元素？

不是完整同一批。Inventory 的一条聚合记录只覆盖 main-content 下采集到的 63 次观察、6 条 route，且 trail 只到通用 page-scaffold；它不是“CSS 每个 selector 命中的所有 DOM 元素”的清单。CSS 明确为 Settings/Tools、vertical-tabs、login-page、entity-dialog 分别写了 header 规则，而 inventory route 列表**没有 login route**，因此 login-page header 至少是样式层专门覆盖、inventory 未观测的实例（很可能该 surface 不在这批 route/state 采集内）。entity-dialog 的实际 header 即使出现在 friends-locations 等采集路由，也不能从聚合 inventory 证明其被采到或对应哪个指纹；dialog 是按需出现的状态，可能未纳入采集状态。反过来，inventory 的 37 个 dotted 头部观察可能涵盖不同语义容器，因没有指纹到 route/context 的映射，不能断言它们全来自某个特定组件。CSS 中的 login/dialog 后代 banner/avatar 规则更不是额外 inventory header 观测数。结论：inventory 和 CSS selector 命中集合**有交集但不可等同**；不要用 63 作为 CSS 覆盖总量，也不要把 CSS 专项规则伪装成 inventory 观察。

## 合并判断与收敛结论

建议 **2 种 header 基础皮肤**：①默认/内容头：透明背景、dotted `#70518f` 底线、无 shadow；②raised title-band：`#2f2552` 背景、`#16112a` 实线底边、`inset 0 1px #fdf4ff` 高光。Inventory 中 37+1 观察可合为第一种 paint；opacity 0.6 的单例保留为状态修饰，不扩成第三种皮肤。25 观察的 title-band 是真实 paint 差异，不能并入默认头。login-page 的粉色 header 是 CSS 专项且 inventory 未覆盖的独立语义变体，应作为**第三个容器特例**保留，不纳入 inventory 的“两种 observed skin”计数；其负 margin、补偿 padding、form 单行网格必须原样保留。entity-dialog header 当前命中规则主要装饰其后代，不构成额外 header paint skin。

可用骨架：通用 `[data-slot="card-header"] { background-image:none; border-bottom:...dotted... }`；Settings/Tools 可合并为 `:is(.vertical-tabs-scope,[data-tools-section]) [data-slot="card-header"] { background:#2f2552; border-bottom:1px solid #16112a; box-shadow:inset 0 1px #fdf4ff }`，将 charm/lace 仍作为独立子层；login 用原 `[data-vrcx-0-surface="login-page"] ...` scope 保留几何与颜色例外。Specificity 风险：vertical-tabs selector 的多个属性与 `:has()`、login 的 `:has()` 及层级都比通用 `[data-slot]` 高；Settings 与 Tools 现有 selector 不完全同形。若抽成低特异性共享类或 `:where()`，可能被现有组件/Tailwind 声明反压；需要先统一 cascade layer/清理旧规则，并检查 login 特例优先级，不能只删旧规则后期待相同结果。

## 可视化

[打开 card-header 并排预览](../preview/P1-G4-card-header.html)。该静态 HTML 以实际背景、底边和阴影展示默认 header、raised title-band、login 特例及对应内容区分隔；示意尺寸和文案不是 inventory 采样数据。
