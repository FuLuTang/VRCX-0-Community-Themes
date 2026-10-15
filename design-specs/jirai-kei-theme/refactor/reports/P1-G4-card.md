# P1-G4 Card 组件普查

## 1. 范围与 Inventory

仅取 `family=G4, component=card, tag=div`。数据来自 inventory（2026-10-15；theme.css SHA256 `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`）。inventory 中共 2 条记录，`primaryContext` 字符串都为 `surface:main-content`，观察数合计 76，5 个 styleVariants。

| primaryContext | 区分线索（routes） | 观察数 | 指纹数 | styleVariants（指纹：观察数） |
|---|---|---:|---:|---|
| `surface:main-content` | `/community-themes`, `/themes`, `/tools/gallery`, `/tools/inventory` | 50 | 2 | `7eebb52d1175418d`:28；`359fbd61779f4e6d`:22 |
| `surface:main-content` | `/dashboard/:placeholder`, `/settings`, `/tools` | 26 | 3 | `2c9b6faf544d1721`:20；`cdb00b7e8cec7441`:5；`9fba98862ee8087a`:1 |

**重要：** 两记录的 primaryContext 完全相同，不能伪造不同 context 名称；表中用 routes 区分两条 inventory 记录。contextTrails 两者均是 page-scaffold，未细分卡片实例类型。fingerprint 是完整绘制属性串，不等于视觉上每个都独立成族：同色同边、只差采样到的 shadow 或边框宽度者，需结合用途判定。

### 指纹视觉归并与属性

| 指纹 | 观察数 | 视觉解读 | 背景 | 边框 | 阴影 | 圆角 | 内边距 |
|---|---:|---|---|---|---|---|---|
| `7eebb52d1175418d` | 28 | 深色面、明暗斜切边与三层硬阴影；独立 beveled panel 视觉 | `rgb(32,25,54)` | 四边 `0.8px solid`；上/左 `rgb(162,148,200)`，右/下 `rgb(16,11,30)` | `rgb(227,210,245) 1px 1px 0 0 inset, rgb(75,58,99) -1px -1px 0 0 inset, rgb(16,11,30) 1px 1px 0 0` | 未采集 | 未采集 |
| `359fbd61779f4e6d` | 22 | 同背景但均匀紫色边框，柔和顶边与硬投影；可作通用窗口卡表面 | `rgb(32,25,54)` | 四边 `0.8px solid rgb(108,92,224)` | `rgba(253,244,255,.14) 1px 1px 0 0 inset, rgb(22,17,42) -1px -1px 0 0 inset, rgb(16,11,30) 2px 2px 0 0` | 未采集 | 未采集 |
| `2c9b6faf544d1721` | 20 | 基础平面、无边框无阴影（如 settings/tool section 的 card 本体） | `rgb(32,25,54)` | 四边 `0px solid rgb(108,92,224)` | `none` | 未采集 | 未采集 |
| `cdb00b7e8cec7441` | 5 | 同平面主题、1px 边框；与上项仅边框宽度差异，作为同一 plain-panel 家族的边框状态/小样本差别 | `rgb(32,25,54)` | 四边 `0.8px solid rgb(108,92,224)` | `none` | 未采集 | 未采集 |
| `9fba98862ee8087a` | 1 | 基本同 plain-panel，附 1px 低对比 outline 型 ring；极小样本，勿独立扩成全局皮肤 | `rgb(32,25,54)` | 四边 `0px solid rgb(108,92,224)` | 透明层叠 + `oklab(0.951386 0.0145837 -0.0234703 / .1) 0 0 0 1px` | 未采集 | 未采集 |

inventory paint fingerprint 不采集 padding、布局尺寸；边框圆角仅有 `border-radius` 属性，但以上各对象在 computedStyle 中该值为 `None`（即本次未采集/未提供），不能推断实际盒模型内距或圆角。

## 2. 视觉家族与职责归并

| 收敛视觉族 | 代表指纹/覆盖观察 | 覆盖 context / routes | 关键 paint 与 CSS 对照 |
|---|---|---|---|
| **立体通用面板** | `7eebb52d1175418d`（28）；近邻 `359fbd61779f4e6d`（22），共 50 | main-content；community-themes、themes、gallery、inventory | 深紫背景 `#201936`；边框/阴影细节见上表。CSS 多处采用 `--wd-window`、frame + inset/hard-shadow。内距未采集。可归为一套 raised-panel token，允许 selector/use-case variation。 |
| **平面设置/工具分组卡** | `2c9b6faf544d1721`（20）、`cdb00b7e8cec7441`（5）、`9fba98862ee8087a`（1），共 26 | main-content；dashboard、settings、tools | 同一 `#201936`，通常无 shadow，边框 0 或 0.8px；特殊 1 例额外 ring。Settings/Tools 专用标题栏另外由 card-header 子层着色、分隔、挂 lace/charm。内距未采集。 |
| **紧凑可选 TileShell 卡** | inventory 的 card 记录未单独映射到 TileShell；CSS 证据来自 gallery/inventory/MyGroupCard selector，不作为额外 inventory 数 | Gallery/Inventory/My Groups 的 `[data-size=sm][group/tile][rounded-object]` | square panel + `--jk-panel-edge`、`--wd-window`、`--jk-panel-raised`；hover/selected 状态需要保留。不是仅靠卡片“外观”的普通内容卡。 |
| **图表/仪表板面板** | inventory 记录仅覆盖 dashboard 那条中的 card fingerprints；CSS 专项还包含非 `data-slot=card` 节点 | dashboard workspace；chart/activity 的图表面板/历史条目 | Dashboard panel 是边框 frame、window 背景、inset bevel；activity-card 与两人关系历史条目各有独立组件结构及交互，不应套成任意 card。内距未采集。 |
| **对话框/登录内容卡** | inventory 未提供独立 dialog-card primaryContext；这是 CSS 层职责，不冒充 inventory 观察 | login-page card、entity dialog 内部 card-header/内容 | login 的 card 需保留表单、标题、响应式/紧凑布局契约；entity-dialog 的外层 dialog-content 自身是 popup surface，不等于 card。padding 观测未采集。 |

feed 的 `.group/feed-column` 是 feed column 自身，不是该 inventory 中 `component=card` 的记录；它和通用 raised 面板 paint 接近，但列头/新条目提示属于 feed 语义层，应保留。侧栏面板也不是 card inventory 样本，不要将整个 side-panel 包装误称 card。

## 3. theme.css 命中规则（只读检索）

行号按当前 `theme.css`。此处列代表 card 本体和相邻语义卡容器规则；像 `.entity-dialog [data-slot=card-header]` 下的头像/横幅装饰属于 header 内容，不把它们伪装成 card 外框规则。

| SECTION / 行 | 选择器 | 实际声明 / 作用 |
|---|---|---|
| `runtime` 663 | `[data-slot="card"]` | `border-color:var(--wd-frame); border-radius:2px`。全局基线只设边色和圆角。 |
| `settings` 1315–1317 | 纵向 tabs 下的 `[data-slot=card]` / `card-header` / `card-content` | card：1px `#6c5ce0`、方角、`#201936`、无 shadow、`clip-path:var(--jk-px-cut)`；header：`#2f2552`、深底线、inset 高光；content 方角。 |
| `login-r8` 2098–2108、2121–2126 等 | `[data-vrcx-0-surface="login-page"] [data-slot="card"]` 与其 header | 登录卡的窗口框/色彩，以及 header 负外边距与相应补偿 padding；后续 2121+ 对含 form 卡片专门收紧 header 标题行。是几何与表单布局，不是可一刀合并的纯 paint 重复。 |
| `tools-ui-r9` 2529–2536 | `.activity-skin section.activity-card` | `1px solid #6c5ce0`、方角、`#201936 !important`、禁 backdrop、inset bevel + `2px` 硬阴影。图表表面例外需保留。 |
| `favorites-r9` 4486–4493 | `[data-slot="card-footer"]`（受 page scope 限制） | dotted 顶边、raised 背景/前景；footer 子槽职责，不是 card 根重复写。 |
| `favorites-r9` 4495–4523 | TileShell 的 `[data-slot=card][data-size=sm][group/tile][rounded-object]` | 基础 `--jk-panel-edge`、`--wd-window`、`--jk-panel-raised`；hover/selected/focus 各有状态。与一般 card 可共享 tokens，状态规则须保留。 |
| `favorites-r9` 4525–4546 | `.group/feed-column` / `.group/feed-column-header` | column: frame、方角、window 背景、inset + hard shadow；header dotted 分隔、raised 背景。视觉近似 raised panel，但不是 `[data-slot=card]`。 |
| `favorites-r9` 4566–4589 | `.friend-view [data-slot=card][data-size=sm]` | window 背景、panel edge/raised shadow；hover/focus border/pseudo-child 状态。 |
| `favorites-r9` 4625–4637 | dashboard 的 `section.bg-muted/5...` 与 `.bg-card...` | frame、方角、window 背景、inset bevel；带 pressed 子按钮时切 `--wd-select`、粉色边、ring。 |
| `favorites-r9` 4671–4685 | `#chart button.group...` | 两人关系历史条目独立卡样式及 hover/focus。按钮语义与交互不可按普通展示卡抹掉。 |
| `cards-r97` 4883 起、4900–4913 | Settings/Tools card 与 header | Tools 用与 Settings 相同 face（原注释如此）：card 无 shadow、像素裁角、额外 `::after` 1px 边框；header raised 颜色、底线与高光；两个入口共享 charm/lace trigger/header decoration。 |
| `data-surfaces-r10` 约 4313 段后 | 卡片类与面板 selector 之外的 tokens / data-surface rules | 提供通用颜色与面板变量；不等于另外一套 card DOM。 |

**重复写入判断：** Settings 与 Tools 的 card/header paint 在 `settings` (1315–17) 和 `cards-r97` (Tools 4901–05) 两份 selector 中近乎同值，是明确的视觉重复：提取共同 token/共享低特异性基底可去重，但 Settings 现有 clip-path/边框落点与 Tools `::after` 边框实现需审视后统一，不能简单复制两份。Gallery/Inventory TileShell、friend-view 小卡、dashboard 面板、activity-card 都重复使用相同 `#201936` + frame + 方角/inset bevel 语言，是可共享 tokens/基底的重复表达；其不同结构、selected/hover、尺寸与布局不能合并成一个无限宽 selector。全局 `[data-slot=card]` 只设基础 border-color/radius，与这些 scoped rules 的职责不同，保留作基础层而不是重复声明整套视觉。

## 4. 合并与必须保留

- 可合并：两种 raised/bevel 样本统一为「raised panel」tokens（window/background、frame、inset bevel、hard shadow），按页面/尺寸作为 modifier 覆盖；plain settings/tools 三指纹收为同一个「plain section card」base，其中 0/0.8px 边线和单个 focus/ring 属状态/局部边界，不另建常驻皮肤。
- Settings 与 Tools 重复的标题卡样式可以共用结构化组件 skin；保留 header 与 body 子槽，不把 card-header 绘制移到根卡片。
- TileShell selectable card 必须保留 hover、selected、focus；feed column 保留列头/新内容语义；图表 card（activity 图表、关系历史项）保留图表自身布局/状态；dashboard panel 保留编辑/pressed 状态。
- 登录表单卡必须保留 form/header 几何补偿、密度与表单布局；dialog-content 是弹层框架，拥有 overlay/定位/尺寸等职责，card 内部内容不能替代它。entity dialog 的 card-header 画像/横幅层仅属标题内容。
- 不合并 card-header：它负责标题行、分隔线、raised title-band、装饰/折叠触发器；card 本体负责外框、背景、阴影、裁角。此项也避免将 header 的边线或装饰重复画到 card 根。

## 5. 收敛结论与 specificity

建议收敛为 **2 种基础视觉皮肤（raised、plain）+ 4 类语义 modifiers（Settings/Tools titlebar、TileShell selectable、chart/dashboard、login/dialog content）**。feed column 可共享 raised token/基底，但维持 feed 专属 selector 与 header/新条目子层。结构骨架：` :where(.vrcx-0-main-content) [data-slot="card"]` 定义 paint tokens 与默认边框；`.jk-card--raised` / `.jk-card--plain` 或既有页面 scope 消费 token；`[data-slot=card-header/content/footer]` 各自承接分层；`[data-state=...]`, `:hover`, `:focus-visible` 等单列状态层。边框/阴影应通过 token 而非复制长串声明。

Specificity 注意：当前 Settings selector 包含多个 class/属性以及 `:has()`，远高于全局 `[data-slot=card]`；Tools `. [data-tools-section] [data-slot=card]` 亦高于单纯 slot。合并若直接改成低特异性 `.jk-card`，会被 Tailwind utility 或既有 scoped rules 反压；推荐把共有属性置于低权重 `:where()` 基底、按组件规范控制 cascade layer，页面例外只保留少量 scope，并确认 utility class 是否通过 inline/class rule 覆盖。不要靠继续叠长 selector 抢赢；清理旧重复块后才能降 specificity。

## 6. 可视化

[独立预览 P1-G4-card.html](../preview/P1-G4-card.html) 并排展示通用 raised、plain settings、compact tile、dashboard/chart、login 内容卡示意；使用内嵌 CSS 与本次 theme.css 实际值。仅用于视觉对照，示意内容/尺寸不是 inventory 采集结果。
