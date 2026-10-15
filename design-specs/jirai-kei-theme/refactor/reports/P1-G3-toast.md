# P1-G3 Toast-content / toast-viewport 组件普查

> toast-content 与 viewport 是同一机制的内容体与宿主。指定 inventory 文件与任务背景数据冲突：背景称 toast-content 222 observations / 7 fingerprints；该 JSON 实际只有 toast-content 42 / 1，toast-viewport 126 / 1。以下以指定文件实际内容为准，建议主任务确认 inventory 是否过期或版本错位。

## 1. Inventory 全部记录与 styleVariants

| primaryContext | component/tag | 观察数 | stateCount | 指纹数 | routes |
|---|---|---:|---:|---:|---|
| `overlay:toast-content` | toast-content / div | 42 | 42 | 1 | 34 条：`/activity`, `/browse-history`, `/charts`, `/charts/mutual`, `/charts/timeline`, `/charts/two-person`, `/community-themes`, `/dashboard/:placeholder`, `/favorites/avatars`, `/favorites/friends`, `/favorites/groups`, `/favorites/import/friends`, `/favorites/worlds`, `/feed`, `/friends-locations`, `/game-log`, `/instance-history`, `/login`, `/my-avatars`, `/notification`, `/player-list`, `/search`, `/settings`, `/social/friend-list`, `/social/friend-log`, `/social/moderation`, `/themes`, `/tools`, `/tools/gallery`, `/tools/group-moderation`, `/tools/inventory`, `/tools/my-groups`, `/tools/screenshot-metadata`, `/tools/vrchat-log` |
| `overlay:toast-viewport` | toast-viewport / div | 126 | 42 | 1 | 同上 34 条 |

完整 styleVariants（每记录各一项）：

| component | fingerprint | variant observations | primaryContext / contextTrail |
|---|---|---:|---|
| toast-content | `3a26c496669abd1f` | 42 | `overlay:toast-content` / `overlay:toast-viewport > overlay:toast-content` |
| toast-viewport | `432850898dcd7eea` | 126 | `overlay:toast-viewport` / `overlay:toast-viewport` |

两个 computedStyle 均为：`color:rgb(242,235,255)`；`background-color:rgba(0,0,0,0)`；四边 border width `0px`、style `solid`、color `rgb(108,92,224)`；`box-shadow:none`；`outline-width:2.4px; outline-style:none; outline-color:oklab(0.765878 0.172198 -0.0498766 / 0.5)`；`opacity:1; filter:none; transform:none; clip-path:none`；`font-family:"WD Pixel CJK", "Geist Variable", Geist, "Noto Sans SC", system-ui, sans-serif`；content `font-size:14px`，viewport `16px`；`font-weight:400; text-decoration-line:none; text-decoration-color:rgb(242,235,255)`。**未采集**圆角、最大宽度、padding、定位、语义类型、关闭按钮与换行信息；不从透明内容节点推断外壳外观。

## 2. 视觉家族及关键 computedStyle

inventory 只显示透明 content 与 viewport 的采集指纹。下表明确区分采集结果和 theme.css 的实现声明：

| 视觉家族 | 背景 / 边框 / 文字 / 阴影 / 圆角 / 最大宽度 | 说明 |
|---|---|---|
| 普通通知（Root 外壳） | 主题声明：`#211a33` / `1px solid #6c5ce0`，左侧另有 `4px solid #d97fc6` / `#f2ebff` / `inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e` / `0` / 未采集 | Base UI Toast.Root 是 viewport 直子且自身无 data-slot；标题 `#ffe4f2`，说明 `#d6c8e6`。这不是 inventory computedStyle。 |
| success / error | 外壳沿用统一值；语义色没有作为 Root 背景或文字色覆盖。圆角 `0`；最大宽度未采集 | success/error 的 icon 使用各自 ring 与 face PNG；原 SVG 隐藏。左边仍是统一粉条。 |
| info / warning | 外壳沿用统一值。圆角 `0`；最大宽度未采集 | 共用 shocked face PNG，ring 分别不同；保留语义属性。 |
| 带图标 | 外壳沿用统一值；其余视觉 computedStyle 未采集 | theme 中四类图标盒 `width/min-width/flex-basis:75.6px`，为实现声明而非 inventory 实测。无类型 icon 是否存在未采集。 |
| 关闭按钮 / action | 外壳沿用统一值；按钮常态背景、文字色、边框、圆角、尺寸均未采集 | theme 只给 viewport 内 action/button 的键盘焦点态 outline；预览中的常态按钮仅供说明。 |
| 长文本换行 | 外壳沿用统一值；最大宽度、换行属性均未采集 | toast 规则中没有 max-width 或 overflow-wrap。勿照搬 tooltip 的 anywhere；预览文本仅作示意。 |
| viewport 宿主 | inventory 采集为透明、无边框、无阴影；圆角 / 最大宽度未采集 | 主题未声明 viewport 的 position/inset/z-index/transform；定位交给 AppToaster/Base UI。 |

## 3. theme.css 命中规则

行号基于 `runtime/preview-package/jirai-kei-theme/theme.css`。变量所指 PNG data URI 是冻结资源，仅记录引用，不改动。

| SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| overlays-r10 / 3672–3684 | `[data-slot="toast-viewport"] > *` | Base UI Toast.Root 直子（Root 自身无 data-slot）。`box-sizing:border-box; background:#211a33!important; color:#f2ebff; border:1px solid #6c5ce0; border-left:4px solid #d97fc6; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e!important; backdrop-filter:none; animation:none!important; transition:none!important`。 |
| overlays-r10 / 3685 | `[data-slot="toast-viewport"] [data-slot="toast-title"]` | `color:#ffe4f2`。 |
| overlays-r10 / 3686 | `[data-slot="toast-viewport"] [data-slot="toast-description"]` | `color:#d6c8e6`。 |
| overlays-r10 / 3687–3691 | viewport 内 toast-action/button `:focus-visible` | `outline:2px solid #ffe4f2; outline-offset:-3px`。 |
| overlays-r10 / 3723–3737 | reduced-motion 与 `html.reduce-effects` 下 toast Root | `animation:none!important; transition:none!important`。 |
| status-icons-r10 / 4961–4969 | `:root` | success/error face、ring PNG 变量定义。冻结资源，不改。 |
| status-icons-r10 / 4971–4985 | viewport 内 success/error icon | `box-sizing:content-box; display:flex; flex:0 0 75.6px; width/min-width:75.6px; position:relative; background-image:none`。注释禁止设置 height，避免影响 app 的 `--toast-height` 测量。 |
| status-icons-r10 / 4988–4994、5001–5006 | success/error icon `::before` | 绝对居中 `75.6×64.8px`、pixelated；引用对应 success/error ring PNG。 |
| status-icons-r10 / 4995–5000 | `[data-slot="toast-viewport"] [data-slot="toast-content"]` | `overflow:visible`，使贴图溢出 content；不改变壳测量。 |
| status-icons-r10 / 5007–5015 | success/error icon `::after` / 子 SVG | `::after` 绝对居中 `75.6×64.8px` 并引用对应 face PNG；SVG `opacity:0!important`。 |
| status-icons-r10 / 5017–5022、5050–5068 | info/warning icon 与伪元素 | icon `flex:0 0 75.6px; width/min-width:75.6px; position:relative`；伪元素 `75.6×64.8px` 绝对定位；共享 shock face，ring 各自 PNG，pixelated。 |
| status-icons-r10 / 5047–5048 | info/warning icon 子 SVG | `opacity:0!important`。 |
| badge-r9 / 2350–2366 | `@keyframes r9-notification-badge-flash` | 动画名：闪切 unread badge 的背景/文字/边框/阴影。**属于冻结层，只查引用、不改。** |
| badge-r9 / 2368–2405 | `.vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge']` | Bell badge 自身 `animation:r9-notification-badge-flash 2.8s steps(2,end) infinite`；不是 toast。 |

toast 命中规则中没有 `toaster` class，也没有 viewport 定位声明；Root 壳以 viewport 直子为锚，title/content/icon 为后代。Badge animation 的定义和引用均只在 badge-r9。

### AppToaster.css 关系

仓库内未找到 `src/components/hosts/AppToaster.css` 实体，故不能核验其具体声明和完整层叠顺序。`research/theme-limits.md` 229 行确认它是 app reduced-motion 使用点；`runtime/checks/r9-coverage-audit/coverage-table.md` 83 行记录 toast 来源及 Root 没有 data-slot，并指出需用 `[data-slot=toast-viewport] > *` 锚定。主题现在确实通过该选择器覆盖 AppToaster 的 Root 外壳，并覆盖 title/description/focus/icon；coverage 表的“未覆盖”属于旧审计状态。可能冲突：主题背景/圆角/阴影/动画/transition 使用 `!important`，普通 app 类会输；important layer 的优先级仍要根据最终 CSS layer 与装载顺序核对。`overflow:visible` 有意覆盖 app 默认裁切以显示贴图，需同时保住 `--toast-height` 的测量约束。主题未碰 viewport 定位，因此 host 锚定与堆叠不应受影响。

## 4. 合并判断

- **可合并：**所有类型共享一种 Root 壳与标题/描述层级；content 是内部布局/资源承载节点，不另造第二种卡片皮肤。长文本不构成独立皮肤，尺寸未采集，不擅加 max-width/height/overflow。
- **必须保留：**`data-type` 的 success/error/info/warning 语义图层；关闭操作与 `:focus-visible`；viewport 的定位、堆叠交由 host。语义 icon 不能并成无类型通用图标。
- **专项例外：**content `overflow:visible` 服务贴图溢出，不等于普通内容默认放开溢出；不能设固定高度，以免破坏 host 测高。

## 5. 收敛结论与骨架

收敛为 **1 种基础容器外观 + 4 种语义 icon 状态 + 交互焦点态**，viewport 定位仍由宿主管理；不是七种容器外壳。骨架：`[data-slot="toast-viewport"] > *` 管 `background/color/border/border-radius/box-shadow`，title/description/action 分层，`[data-type] [data-slot="toast-icon"]` 管冻结贴图。避免无意改 specificity：现有 Root 选择器约为 `(0,1,0)`；改用 `:where()` 会降到零，让 app utility class 可能反压主题；新增属性条件会升高优先级；`!important` 与 cascade layer 顺序也须核验。

## 6. 可视化

[打开 Toast 视觉预览](../preview/P1-G3-toast.html)：独立 HTML 内嵌 CSS，演示普通、成功、错误、信息、警告、关闭按钮、长文本折行。符号 icon 是说明示意，不复制冻结贴图。

## 数据源定位

- Inventory：`baseline/reports/component-variant-inventory.json`，toast-content 9530–9614，toast-viewport 9619–9703。
- Theme：`runtime/preview-package/jirai-kei-theme/theme.css`，overlays-r10 3633–3737，badge-r9 2350–2414，status-icons-r10 4961–5068。
- App 结构审计：`runtime/checks/r9-coverage-audit/coverage-table.md` 83 行；App reduced-motion：`research/theme-limits.md` 229 行。

---
**提醒主任务：**用户给出的 222 / 7 fingerprints 与指定 JSON 中的 42 / 1 不符；viewport 是 126 / 1。只读 CSS；未修改动画或资源。
