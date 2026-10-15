# P2-G4 数据与容器族收敛表

| 簇名 | 包含哪些组件 | 判据 | 必须保留的例外 | 建议选择器骨架 | 证据（文件:行号） |
|---|---|---|---|---|---|
| 真表格基底与行状态 | `table`、`table-row` | 真 `<table>` 仅一条 inventory 记录、两路由；皮肤集中在 data-table scope，容器透明，行分隔/状态属于子层，不拆多套 skin | 表头与 body divider 不同；普通行 `#51436d` solid 与表头 `#70518f` dotted 分开；selected、expanded、hover、focus 顺序/语义保留；不启用 zebra；少数行无边线 | `:where(.vrcx-0-main-content) :is(.vrcx-0-data-table,.app-data-table)`；后代 `[data-slot="table-row"],[data-vrcx-0-table-row]` 按状态分层 | `P1-G4-table.md:9,25–36,45,62`；`P1-G4-table-row.md:9–10,30–42` |
| 表头子层 | `table-head` | 一套 raised 表头；header 容器承担背景，header `tr` 承担 dotted 下沿，`th` 承担文字/单元格语义 | sticky/高度/列宽与组件布局保留；排序/分组结构不能凭空加主题状态；不把普通行 divider 合并进来 | 同上容器下 `[data-slot="table-header"]`, `[data-slot="table-header"] > tr`, `[data-slot="table-head"]` | `P1-G4-table.md:27–30,39`；`P1-G4-table-head.md:19–22,29–34,40–50` |
| Card 面板基底 | `card` 与视觉相近的 panel/card 宿主 | 相同 `#201936` 窗口底色、frame/bevel 语言可共享 tokens；收为 raised 与 plain 两种基底，不等于把不同 DOM/交互写成一个宽泛选择器 | TileShell selectable、dashboard/chart、activity/history、feed column、login/form 几何、dialog 外框各保留结构/状态；plain 的边线/ring 局部差异留作 modifier | `:where(.vrcx-0-main-content) [data-slot="card"]` 基底；raised/plain modifier；语义宿主仍各自限定 | `P1-G4-card.md:18–22,30–36,44–57,61–71` |
| 标题带 | `card-header`；Settings/Tools titlebar | 默认透明 dotted header 与 raised title-band 是两种真实视觉角色；Settings/Tools 可共享 title-band 声明 | login-page 粉色 header 及 margin/padding/form 网格契约独立；装饰与 trigger 留子层；普通 card root 不代画 header | `[data-slot="card-header"]` 基底；`:is(.vertical-tabs-scope,[data-tools-section]) [data-slot="card-header"]` title-band；login 原 scope | `P1-G4-card-header.md:15–17,25,28,30–37,45–47` |
| 静态空状态 | `empty`、`empty-icon`、`empty-title`、`empty-description` | 共用一个带 spinner 排除的静态 root；四槽位职责不同但属一族；description 12px 为尺寸例外而非新皮肤 | `:not(:has([data-slot="spinner"]))` 必须保留；icon 独立方块皮肤；按钮/标题-only 等内容组合保持可表达 | `:where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"]))` + 各子槽位 | `P1-G4-empty.md:9–24,42–48,59`；`P1-G4-empty-slots.md:20–34,52–63` |
| 日历及日期状态 | `calendar` | 一套容器基底；状态选择器消费 wd tokens，不按主内容/popover 拆 skin | 单选/范围端点、范围中段、今日、禁用、focus 各自保留；weekday、多月、周数栏不臆造规则；不用 `.rdp-*` | `:is(:where(.vrcx-0-main-content) [data-slot="calendar"],:where([data-slot="popover-content"]) [data-slot="calendar"])` + `[data-day]` 状态 | `P1-G4-calendar.md:9–17,21–31,37–50` |
| Disclosure 触发器 | `collapsible-trigger` | 平面 disclosure 基底与侧栏紧凑胶囊两族；Settings/Tools header 内 trigger 可共用局部几何/hover | 侧栏 ghost/sm 胶囊、outline-sm 与默认字号差异；嵌套层级/点击边界；无箭头组件不得强加箭头；open/closed 仅在确认宿主机制后处理 | `:where([data-slot="collapsible-trigger"])` 基底；card-header 子选择器与 side-panel `:has(> svg.lucide-chevron-down)` modifier | `P1-G4-collapsible-trigger.md:9–16,22–31,35–49` |
| 可拖拽分隔柄 | `resizable-handle` | 共用柄色/状态 tokens，但保持通用握纹、pixel grip、Favorites grip 几何分型 | 横纵方向、hover/active/focus、4/8px命中区与装饰线区分；Favorites 4×28握纹/hit strip；不能并入静态 separator | `[data-slot="resizable-handle"]` 基础；`[aria-orientation="horizontal"]::before`；Favorites splitter 宿主限定 `> [data-slot="resizable-handle"] > div` | `P1-G4-resizable-handle.md:18–26,33–45,58–70` |

## 1. 现状中的重复

- Settings/Tools card 根与 title-band 近乎重复：`P1-G4-card.md:45,54,57`；对应主题规则见 `06-panels-and-settings.css:178`、`15-late-components.css:151`（header）及 `P1-G4-card.md:45,54` 所列 card 规则。可抽共同基底，但 Settings clip-path/边框落点与 Tools `::after` 不同，须留实现例外。
- 多个面板复用 `#201936`、frame、方角/inset bevel 语言：TileShell、friend-view、dashboard、activity/chart 等分别见 `P1-G4-card.md:49–53,57`；这是 token/基底重复，不足以合并为单一 selector。
- resizable handle 的绘制职责分散在通用样式、Favorites 专项、后置 splitter token：`P1-G4-resizable-handle.md:18–27,33–42`（分别 `14-buttons-and-data.css:225–250`、`13-toolbar-overlays-and-pages.css:394–430`、`15-late-components.css:163–179`）。这是重复声明/级联覆盖的明确候选，握纹尺寸与局部状态不可抹平。
- `table` 的旧 tokens 与 R10 scoped tokens 同名职责延续/覆盖，非两套已观察 skin：`P1-G4-table.md:25–30,39`；`P1-G4-table-head.md:19–23`。
- empty 四槽位规则集中一处，没有多 SECTION 重复：`P1-G4-empty.md:42–48`；card-header 的 banner 伪元素有重复/后续覆盖，但它们是 header 后代装饰而非 header 本体：`P1-G4-card-header.md:26–27,33–35`。

## 2. 冲突与待修

- **card-header 与 table-head 背景：角色可统一 token，不应直接统一实值。** Settings/Tools title-band 为 `#2f2552`，表头为 `var(--wd-raised)`=`#2a2147`；两者是标题卡带与数据表列头，且色值不同，非同一角色的两种写法。可统一由语义 tokens 管理，不能强制改成同一颜色。`P1-G4-card-header.md:16,28,36`；`P1-G4-table-head.md:20,23,29`。
- **表头线与数据行线不冲突。** 表头下沿 dotted `#70518f`；数据行 divider token `#51436d` 为 solid。分别位于不同元素/职责，必须保留差异。`P1-G4-table.md:27–29,31–36`；`P1-G4-table-head.md:29–31,44`。
- **Resizable 缺少 resize cursor：确认是主题 CSS 缺陷/待补。** 全 CSS 搜索未发现 `col-resize`、`row-resize`、`ew-resize`、`ns-resize` 或 handle cursor 声明；建议按方向在实际可拖柄上补 `cursor: col-resize` / `cursor: row-resize`（水平分隔线拖动宽度用 `col-resize`，垂直分隔线拖动高度用 `row-resize`），并以真实 `aria-orientation`/split 方向验证映射。浏览器或宿主是否另行提供未证实。`P1-G4-resizable-handle.md:44,49–52,66`。
- **Collapsible open/closed 与箭头旋转：主题层遗漏，不足以判定宿主有意接管。** 搜索未见 `[data-state=open/closed]`、`collapsible-content` 或 chevron transform/rotation；现有 CSS 只命中侧栏 chevron 结构而不改图标。应标“待确认宿主实现”，先查组件运行时是否已有状态/箭头旋转；若无则补状态与旋转规则，但不要对无箭头 trigger 强制加图标。`P1-G4-collapsible-trigger.md:29–39,45,49`。

## 3. 零覆盖清单

这里的“零覆盖”指所审主题 CSS 未找到直接规则，不代表组件一定实际出现：

- Empty 的 `empty-content`、`empty-media` 无独立 inventory 记录，也无直接主题规则；`empty-header` 有 CSS 规则但无独立 component 记录。`P1-G4-empty-slots.md:3–5,20–34,52–56`。
- Calendar weekday heading、月份导航按钮、周数栏、多月份模式无专属主题规则/观察证据；未定义 `--rdp-*`，无 `.rdp-*` selector。`P1-G4-calendar.md:15–17,23,31,42`。
- Collapsible content、open/closed 状态、chevron 尺寸/颜色/旋转无主题规则；具体组件运行时是否处理待确认。`P1-G4-collapsible-trigger.md:29–39`。
- Resizable handle 无 resize cursor，也无 `data-resizing`/`data-dragging` 规则；主题已有方向、hover/active、focus 与 grip paint。`P1-G4-resizable-handle.md:44,50–53`。
- Table 无 zebra 选择器；stripe 仅有未启用 token。`P1-G4-table.md:26,45,54`；`P1-G4-table-row.md:34`。
- Card/header inventory 未覆盖 login-page header；CSS 有专门规则。entity-dialog header 是否在聚合采样中出现无法证明，不能列作确定零覆盖。`P1-G4-card-header.md:39–41,45`。

## 4. 收敛后的规模估计

建议落为 **8 个组件簇 / 约 15 个基础视觉与必要状态规则组**，而非把每个指纹或页面 selector 保持成独立皮肤：table 1 基底+行状态约 5 组、header 1 组；card 2 基底+标题带约 2 组；empty 1 基底+4 槽约 5 组；calendar 1 基底+5 类状态约 6 组；collapsible 2 族约 2 组；resizable 3 grip 子型约 3 组。按规则组口径相加约 25 组；若只计可合并“皮肤族”，约 **12 个**（表格/表头2、card2、empty1、calendar1、trigger2、handle3）。因此估计需明确口径：**8 簇、约12族、约25组选择器规则**；不含各类状态展开后的逐条 selector、装饰伪元素及组件原有布局。依据是各前作的收敛建议：`P1-G4-table.md:62`、`P1-G4-card.md:69`、`P1-G4-card-header.md:45–47`、`P1-G4-empty.md:59`、`P1-G4-calendar.md:46`、`P1-G4-collapsible-trigger.md:49`、`P1-G4-resizable-handle.md:58–66`。