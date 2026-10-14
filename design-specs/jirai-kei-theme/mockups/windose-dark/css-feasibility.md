# windose-dark 效果图 × 纯 CSS 社区主题可行性核对

- 核对对象：`design-specs/jirai-kei-theme/mockups/windose-dark/`（`index.html` / `windose-dark.css` / `layout.css` / 两张截图）
- 真实应用源码：`/home/fulutang/Documents/Github/VRCX-0-jirai/src`（**只读**，未运行应用、未构建、未执行 git）
- 主题形态前提：单个纯 CSS 文件，以 `<style>` 注入；不能加 HTML、不能跑 JS、相对路径 `url()` 不解析（图案只能是 data URI 或 https 绝对地址）
- 加载顺序前提：内置应用 CSS → 官方背景 CSS → 已安装主题快照 → 用户覆盖 CSS（`docs/css-hooks.md:7-17`），因此同特异性下主题规则胜出；但 Tailwind 的 `hover:`/`data-*:` 变体特异性更高，需要靠变量或提高特异性
- 结论口径：**能** = 现有 DOM/变量钩子可稳定表达；**部分** = 能做出视觉近似，但依赖脆弱选择器、或只能命中一部分元素；**不能** = 真实应用没有对应 DOM/状态，改效果图才有解
- 未在本仓库源码中直接确认的推断，一律标注 **未确认**；不猜测

## 0. 统计

| 结论 | 项数 | 编号 |
| --- | --- | --- |
| 能 | 24 | 1-9、11、12、15、16、18a、19、20、22、24、25、26、27、28、29、30 |
| 部分 | 6 | 10、14、17、21、23、33 |
| 不能 | 4 | 13、18b、31、32 |

（编号见下表；同一编号不重复计数。总核对项 34 条：编号 1-33，其中 18 拆为 18a/18b 两条。）

## 1. 总表

| # | 元素 | 结论 | 关键真实选择器（源码位置） | 实现手法 | 主要风险 |
| --- | --- | --- | --- | --- | --- |
| 1 | 三区域窗框描边 | 能 | `[data-slot="sidebar-container"]`（`src/ui/shadcn/sidebar.tsx:269-283`）、`[data-vrcx-0-surface="main-content"]`（`AppShellLayout.tsx:158-166`）、`[data-vrcx-0-surface="side-panel"]`（`SidePanel.tsx:381-393`） | `border: 1px solid var(--frame)` + `box-shadow: inset 0 0 0 1px var(--frame-inner)` | `border` 会吃掉 1px 内容宽（border-box，可接受）；中区/右栏被 `.vrcx-0-workspace` 统一描边包住，须先 `--vrcx-0-main-content-edge: transparent`（`src/styles/globals.css:835-846`） |
| 2 | 顶部标题条（方块 + start/vrcx-0/friends + 右侧三点） | 能 | 左：`[data-slot="sidebar-inner"]`（`sidebar.tsx:285-290`）；右：`.vrcx-0-side-panel`；中：`.vrcx-0-page-scaffold`（`PageScaffold.tsx:44-56`） | `::before` + `content:"start"` 等生成内容 + `background-image` 多层画方块/三点；**中区不能用 `.vrcx-0-main-content::before/::after`——已被应用占用**（wallpaper 层 `globals.css:922-934`、导航 resize 高亮 `:897-907`） | 三点/方块需用 background 层叠，不可用负 inset（会被 `overflow-hidden` 裁）；文案为 CSS 生成字符串，不参与 i18n |
| 3 | 标题条/底条的额外高度不破坏布局 | 能 | 同上三容器，均为 flex 列 + 内部可滚动子区（`sidebar.tsx:424-433`、`PageScaffold.tsx:48`、`SidePanel.tsx:399-401`） | `padding-top: 24px; padding-bottom: 6px` + `::before/::after` 绝对定位贴边 | 会压缩内部可视高度（预期内）；`PageScaffold` 默认 `p-4`，需覆写 `padding-top`；中区底部还叠着 feed 页脚计数 |
| 4 | 三区域之间 12px 间距 | 能 | `--vrcx-0-main-content-gutter: 0.75rem`（`globals.css:210-213`）、`--vrcx-0-side-panel-resizer-width: 0.5rem`（`globals.css:225`）、`[data-slot="sidebar-container"]` | 改 gutter / resizer 变量；左栏竖直内缩用 `[data-slot="sidebar-container"]{ top:12px; bottom:12px; height:auto; }` | 左栏是 `absolute h-auto`（`AppSidebar.tsx:185-193`）+ `inset-y-0 h-svh`，覆写 top/bottom 必须同时改 `height`；resizer 里 1px 分隔线（`globals.css:869-881`）需要设透明 |
| 5 | 中区标题条激活粉、左/右灰紫 | 能 | 标题条由本主题自绘，用 `[data-vrcx-0-surface="main-content"]` 与 `[data-vrcx-0-surface="sidebar"|"side-panel"]` 分别上色 | 固定配色 | 真实应用没有"窗口激活"概念（只有 `data-window-blurred`，`AppTitleBar.tsx:93`），粉色是装饰常亮，不随焦点变化（可用 `:has([data-window-blurred])` 做失焦变灰） |
| 6 | 标题栏 h-8 方块/配色/底部描边 | 能 | `.vrcx-0-titlebar` / `[data-vrcx-0-surface="titlebar"]`（`AppTitleBar.tsx:95-96`、`globals.css:823-825`） | `::before` 方块 + `--vrcx-0-titlebar-surface` + `border-bottom` | 标题栏无伪元素占用；`h-8` 为 32px（`AppTitleBar.tsx:96`），border-box 下加 border 不改高度 |
| 7 | 快速搜索框样式 | 能 | `[data-slot="button"].vrcx-0-toolbar-control[data-vrcx-0-control="toolbar"]`（`useTitleBarActions.tsx:475-496`、`globals.css:998-1009`），专属变量 `--vrcx-0-toolbar-control-*`（`globals.css:168-179`） | 直接改变量（surface/border/hover-surface） | 宽度由 Tailwind 断点类控制（`min-[640px]:w-44 min-[960px]:w-56`），想固定 224px 需覆写宽度并承担断点差异 |
| 8 | 窗口按钮 hover 危险色 | 能 | 关闭按钮已内置 `hover:bg-destructive! hover:text-destructive-foreground!`（`AppTitleBar.tsx:141-172`，行号引自 `vrcx-layout-reference.md:153`） | 改 `--destructive` / `--destructive-foreground` | 无（应用自己就用了 destructive 变量）；但会同时影响所有危险按钮/徽章 |
| 9 | 左栏激活项整行底色 + 左侧 3px 粉条 | 能 | `[data-slot="sidebar-menu-button"][data-active]`（`sidebar.tsx:539`，`data-active=""`，见 `AppNavMenuSections.test.tsx:22`） | `background: var(--wd-select)` + `box-shadow: inset 3px 0 0 pink` | 按钮自带 `overflow-hidden`，只能用 `inset` 阴影，不能用外侧伪元素 |
| 10 | 左栏激活项右侧像素爱心（mask 伪元素） | 部分 | 同上按钮，用 `::after` | `-webkit-mask/mask: url("data:image/svg+xml,…")`（`original-assets/dist/jirai-assets.css` 里的 `--jk-mask-s8-body` 已是内联 data URI，可直接搬进主题） | 与 `SidebarMenuBadge` 重叠：badge 定位 `absolute right-1 top-1.5 h-5 min-w-5`（`sidebar.tsx:661`），底部「设置 / 收起导航栏」的快捷键徽章、以及 `AppNavMenuEntryItems.tsx:429` 的徽章项会与爱心叠在一起；爱心须限定"无徽章项"或让位（如 `right: 30px`）；`overflow-hidden` 下不能溢出按钮 |
| 11 | feed 表头底色 + 2px 薄荷下边线 | 能 | 表头 viewport `div.shrink-0.overflow-hidden.border-b.bg-[var(--vrcx-0-table-header-surface)]`（`VirtualHistoryList.tsx:117-122`）、表头行 `div.grid.h-[var(--vrcx-0-table-header-height)]`（`FeedVirtualListShell.tsx:95-98`） | 改 `--vrcx-0-table-header-surface`（注意 `.vrcx-0-data-table` 会把它改写成 main-content 色，`globals.css:980-986`）；下边线用 `.vrcx-0-data-table > div:first-child`（表头 viewport 恒为该容器第一个子节点，`:117`）或更抗改动的 `.vrcx-0-data-table > div:has(> .grid)` `{ border-bottom: 2px solid mint }` | 下边线选择器依赖结构位置或 `:has()`；`.vrcx-0-data-table` 的局部变量覆盖需要在同作用域重设 |
| 12 | feed 行点线分隔 | 能 | `[data-feed-list-summary]` 行（`FeedVirtualListShell.tsx:173-177`，含 `border-b border-[var(--vrcx-0-table-divider)]`） | `.vrcx-0-data-table [data-feed-list-summary]{ border-bottom-style: dotted }` + 改 `--vrcx-0-table-divider` | 颜色走变量稳定，样式需覆写 Tailwind `border-b` 的 solid（特异性足够） |
| 13 | feed 选中行整行填色 | **不能** | feed 行只有 hover（`hover:bg-[var(--vrcx-0-table-row-hover-surface)]`）与展开态；`data-[state=selected]` 只存在于通用 DataTable（`dataTableStyles.ts:4`），feed 是自绘 grid 行，没有 selected 状态 | — | 真实 feed 表格点行是打开用户详情/展开，没有"选中行"；只能用 `:hover`（不可持久）或改为"展开态"（`--vrcx-0-table-row-expanded-surface`）示意 |
| 14 | 类型列前的彩色小方块，按类型上色 | 部分 | `FeedTypeIndicator`（`src/components/feed/FeedTypeIndicator.tsx:15-51`）：lucide 图标 + 文本 span，**没有 data-type**；可区分的 class 只有 `text-sky-500`(GPS) / `text-[var(--status-online)]`(Online) / `text-slate-400`(Offline) / `text-muted-foreground opacity-70`(Status、Avatar、Bio **三者共用**) | 用 `[class*="text-sky-500"]` 一类 Tailwind 任意值属性选择器 + `:has()` 上色 | ① Status / Avatar / Bio 无法区分；② 依赖 Tailwind 生成类名，极脆弱；③ 理论上可用 `:has(svg.lucide-map-pin)` 按图标形状精确区分 6 类（应用自身已依赖 `.lucide` 类，`AppNavMenuIcons.tsx:14`），但 `lucide-<name>` 后缀是否稳定输出 **未确认** |
| 15 | 右栏自己行右上角点阵云 | 能 | `.vrcx-0-side-panel-self`（`SidePanelSelfHeader.tsx:206-210`） | `::after` + mask data URI（`--jk-mask-s10`）+ `opacity` | 该 div 无 `overflow-hidden`，云不能越出侧栏（父 `.vrcx-0-side-panel` 是 `overflow-hidden`，`SidePanel.tsx:389`）；装饰必须 `pointer-events: none` |
| 16 | 右栏分组标题前小方块 | 能 | `ListSectionHeader`（`src/components/layout/ListSectionHeader.tsx:25-63`）→ `[data-slot="collapsible"]` + 其内 `[data-slot="button"][data-variant="ghost"]` | `::before` 方块，选择器可用 `[data-vrcx-0-surface="side-panel"] [data-slot="collapsible"] [data-slot="button"]::before` | 该按钮内含标题 + Badge 计数 + Chevron，方块要配合 `padding-left`；计数徽章样式（`h-5 min-w-5 … tabular-nums`）由 Badge 提供，另需改 `[data-slot="badge"]` |
| 17 | 同房间分组头 | 部分 | `InstanceHeaderRow`（`FriendsSidebarHeaders.tsx:41-83`）：`div.text-muted-foreground.mb-1.flex.min-w-0.items-center.px-1.5.text-xs` + 内部 `StaticSidebarLocation` + `[data-slot="badge"]` + `svg.lucide-map-pin` | 只能靠 `.vrcx-0-side-panel div:has(> .text-muted-foreground)` 或 `:has([data-slot="badge"])` 之类结构/子元素选择器 | 该行**没有**任何 data hook，行高 26px 由虚拟列表估算（`FriendsSidebarHeaders.tsx:13`），选择器极易被结构改动打破 |
| 18a | 好友行悬停 | 能 | 好友行 button `[data-slot="button"][data-variant="ghost"]`（`FriendsSidebarFriendRow.tsx:241-256`） | `:hover` + 覆盖 ghost 变体底色 | 无（`:hover` 是真实状态） |
| 18b | 好友行选中（效果图 Friend_B 高亮） | **不能** | 好友行没有任何 selected/active/aria-current 属性（`FriendsSidebarFriendRow.tsx:241-256`；全库 sidebar 目录无 `aria-selected`/`data-state=selected`） | — | 只能退化为 `:hover` 或 `:focus-visible`；持久选中态在真实应用不存在，需改效果图 |
| 19 | 竖向 rail 激活项 | 能 | `.vrcx-0-side-panel-rail`（`SidePanel.tsx:499`）+ `TabsTrigger[data-active]`（`SidePanel.tsx:507-516`、`TabsTrigger` 定义 `src/ui/shadcn/tabs.tsx:94`） | `[data-active]` 上底色 + `box-shadow: inset 2px 0 0 pink` | rail 宽 `w-9`（36px），左侧 inset 条与图标间距需实测；rail 上的计数是 `span.text-[10px]`（`SidePanel.tsx:593-597`），无独立 hook |
| 20 | 头像描边圈 | 能 | `UserStatusAvatar` 内层 `span.bg-muted.relative.rounded-full.border`（`src/components/UserStatusAvatar.tsx:20-45`） | `border-color` + `box-shadow: 0 0 0 npx` | 该 span 没有 data 属性，只能靠 Tailwind 类组合（`span.rounded-full.border`）或 `[data-slot="button"] > span > span:first-child`，属脆弱选择器；状态点 `size-3.75` 由 `UserStatusDot` 决定 |
| 21 | 状态栏任务按钮（小方块前缀 + 边框） | 部分 | `StatusSegment`（`src/components/layout/status-bar/StatusBarParts.tsx:59-182`）：无 `onClick` 时渲染 `div.flex.h-6.min-w-0.shrink-0.items-center.gap-1.5.px-2`；VRChat / SteamVR 段（`StatusBarFooter.tsx:381-479`）与"服务器状态/实时连接"段共用同一结构 | 只能 `[data-vrcx-0-surface="statusbar"] .flex.h-6 { … }` 统一加边框 + `::before` 方块 | CSS 无法按文本选中，也无法区分"任务按钮"与"状态指示段"；`nth-child` 会随可见性配置变化（`AppStatusBar.tsx:53-64`）。要精确命中必须改应用给 `StatusSegment` 加 hook |
| 22 | 状态栏时钟凹陷框 | 能 | 时钟按钮 `Button variant=ghost size=sm`（`StatusBarFooter.tsx:673-700`），内含 `ClockIcon` | `[data-vrcx-0-surface="statusbar"] [data-slot="button"]:has(.lucide-clock)` + `border` + `box-shadow: inset` | 依赖 lucide 的 `.lucide-clock` 类（应用已依赖 `.lucide`）；边框会改变按钮 `h-6` 的视觉高度（border-box 不变） |
| 23 | 弹窗顶部粉色标题条 | 部分 | 真实弹窗 = `[data-slot="dialog-content"].entity-dialog`（`src/components/hosts/DialogHost.tsx:87-98`），**没有标题条 DOM**；`dialog-content` 的伪元素未被应用占用（`globals.css` 无该选择器） | 方案 A：`::before` + `padding-top`；方案 B：多层 `background-image`（定位 top、不随滚动移动）+ `padding-top` | 风险来自滚动：shadcn 默认 `overflow-y-auto`（`src/ui/shadcn/dialog.tsx:74`），`DialogHost` 又传 `overflow-hidden`（`DialogHost.tsx:90`），二者合并后的最终值 **未确认**（未运行应用）。若实际可滚动，`::before` 绝对定位会随内容滚走 → 应用方案 B（背景条），但背景条无法承载"user"文本与小方块文字，需再叠一层 `::before` 只放不随滚动不可行 → 建议效果图把标题条内的文字去掉，或接受滚动时标题条移动 |
| 24 | 弹窗横幅底部像素心条 | 能 | 横幅 `Button.bg-muted.aspect-[4/3].overflow-hidden.rounded-lg.border`（`UserDialogHeaderMedia.tsx:50-70`），其根容器 `div.relative`（`:48`） | 给横幅 Button 加 `::after`（贴底、mask data URI） | Button 是 `overflow-hidden`，心条只能用 `inset: auto 0 0 0`；横幅是真实图片，心条颜色要有对比（效果图里是半透明白） |
| 25 | 弹窗头部深蓝信息区 | 能 | 头部卡片 `EntityOverviewCard`→`[data-slot="card"]`（`EntityDialogScaffold.tsx:103-135`、`UserDialogHeaderSection.tsx:676-708`） | `[data-slot="dialog-content"] [data-slot="card"]:first-of-type { background: … }` | 弹窗内所有 Card 都会命中，必须用 `:first-of-type`/`:has()` 限定；`[data-slot="card"]` 自带 `overflow-hidden rounded-xl ring-1`（`src/ui/shadcn/card.tsx:12-15`），蓝区会被圆角裁切 |
| 26 | 弹窗标签页激活态粉底 + 薄荷下边线 | 能 | `TabsList`（`EntityDialogScaffold.tsx:159-162`，`border-b` + `h-11`）、`TabsTrigger`（`:164-168`，带 `data-active`）；`data-slot="tabs-list"`/`"tabs-tab"`（`src/ui/shadcn/tabs.tsx:56,94`） | `[data-slot="tabs-tab"][data-active]{ background: pink }` + `[data-slot="tabs-list"]{ border-bottom: 2px solid mint }` | 标签条是 `overflow-x-auto`，窄窗时激活粉块会随滚动位移（正常）；标签文案顺序与效果图不同（见修改建议） |
| 27 | 弹窗信息卡片小标题条 | 能 | `CardHeader`/`CardTitle`：`[data-slot="card-header"]`、`[data-slot="card-title"]`（`card.tsx:26,39`） | `::before` 小方块 + `background` 条 | `[data-slot="card"]` 的 `overflow-hidden` 会裁掉越界装饰；卡片间距由 `--card-spacing` 控制 |
| 28 | 紫色蒙层 | 能 | `[data-slot="dialog-overlay"]`（`src/ui/shadcn/dialog.tsx:42-56`，`.vrcx-0-app-overlay` + `bg-black/10 backdrop-blur-xs`） | `background: rgb(36 18 66 / .62)` 覆写 | 定位尺寸由 `.vrcx-0-app-overlay` 决定（`globals.css:686-693`），只改颜色安全；`backdrop-blur-xs` 保留与否是设计选择 |
| 29 | 双色滚动条 | 能 | 应用已定义 `*::-webkit-scrollbar{,-track,-thumb,-corner}`（`globals.css:570-593`） | 用同选择器后加载覆盖；双色用 `linear-gradient` + 去圆角 | 需要覆写应用自带的 `border-radius: 9999px / border: 1px solid transparent / background-clip: content-box`，否则双色块会被缩进成圆条；`scrollbar-width: thin`（Firefox 语法）在 WebView2 无影响 |
| 30 | 桌面像素锯齿底纹 | 能 | `.vrcx-0-app-root`（`globals.css:705-709`；其 `::before` 已被壁纸占用，`:804-816`） | 直接给 `.vrcx-0-app-root` 设 `background-image` + `background-repeat/size`（mask 图案来自 `--jk-mask-s9`，已是 data URI） | 必须让覆盖它的表面透出：`--vrcx-0-sidebar-inset-surface: transparent`（`globals.css:951-953`）、必要时 `--vrcx-0-main-surface`；若用户启用官方壁纸，`app-root::before` 壁纸层会盖住底纹 |
| 31 | 中区工具条右侧 4 个图标（表格/列/刷新/更多） | **不能** | feed 工具条实际只有 `FeedViewModeToggle`(ToolbarSegmented) + `ToolbarFilterChips` + `FeedTypeFilterMenu` + `FeedSearchBox`（`src/features/feed/components/FeedToolbar.tsx:179-236`） | — | 表格模式下这些按钮**不存在**；`ToolbarViewMenu` 只在分栏模式的列头（`FeedColumnsMode.tsx:145`），`ToolbarRefreshButton` 只在游戏日志页（`GameLogToolbar.tsx:292`）。只能在效果图里删掉，或把这一组画到"游戏日志页"效果图上 |
| 32 | 中区类型 chips 常显 7 个 | **不能** | `ToolbarFilterChips`（`src/components/layout/ToolbarControls.tsx:298-322`）：`visibleOptions = options.filter(o => value.includes(o.value))`，且无选中时整块返回 `null` | — | 默认状态**一个 chip 都不显示**，选中后才出现对应 chip；"全部"这一项在真实 UI 里对应的是 `FeedTypeFilterMenu` 下拉（`FeedToolbar.tsx:202-210`）。效果图需要改成"默认无 chips"，或画"已选中若干筛选"的状态 |
| 33 | 左栏「＋新建仪表板」常显 | 部分 | `AppNavCreateDashboardHeader`（`src/components/layout/AppNavMenuSections.tsx:43-63`），仅当存在 dashboard 时渲染 | 样式可写（虚线边框按钮），但**是否出现由数据决定** | 用户没有任何 dashboard 时这块 DOM 不存在，标题条下方会出现空档 |

## 2. 逐项说明（补充细节）

### 2.1 三区域窗框与标题条（#1-#4）

- 真实骨架：`AppShellLayout.tsx:143-199` = `[flex-1] > AppSidebar > (Sidebar + SidebarInset > main-shell > workspace > (main-content + resizer + SidePanel))`，最下面是 `AppStatusBar`。三块区域的 `data-vrcx-0-surface` 分别是 `sidebar`、`main-content`、`side-panel`，这是本主题最稳的钩子。
- 中区与右栏**同处** `.vrcx-0-workspace` 内，而 workspace 自带 12px 外边距 + 圆角 + 1px 描边（`globals.css:835-846`）。效果图要的是"三个独立窗框"，所以必须把 workspace 归零（`--vrcx-0-main-content-edge: transparent`、`--vrcx-0-main-content-radius: 0`、`--vrcx-0-main-content-surface: transparent`），改为 main-content / side-panel 各自描边——这正是 12px 间距的来源。
- **伪元素预算表**（决定每个容器能画什么）：
  - `.vrcx-0-main-content`：`::before` = 主内容壁纸层，`::after` = 左栏拖拽高亮 → **两个都被占用**，标题条/底条只能在子元素 `.vrcx-0-page-scaffold` 上做。
  - `.vrcx-0-app-root`：`::before` = 壁纸层 → 底纹用 `background-image`，不用伪元素。
  - `[data-vrcx-0-resize="side-panel"]`：`::before` = 分隔线。
  - `.vrcx-0-side-panel`、`[data-slot="sidebar-inner"]`、`.vrcx-0-page-scaffold`、`[data-slot="dialog-content"]`、`.vrcx-0-titlebar`、`.vrcx-0-side-panel-self`：伪元素空闲，可用。
- 标题条文字（start / vrcx-0 / friends / 三点）用 `content:` 字符串实现；这是纯 CSS 允许的手段，但注意它是固定英文串，不参与 i18n，也无法响应窗口宽度隐藏。

### 2.2 左栏（#9-#10）

- 激活态钩子：`SidebarMenuButton` 走 shadcn `data-active`（空字符串属性），因此选择器写 `[data-active]`（不要写 `="true"`；`docs/css-hooks.md:157` 的示例写成 `="true"` 与源码不符，属文档偏差——**实测应以源码为准**，见 `sidebar.tsx:539` 与 `AppNavMenuSections.test.tsx:22`）。
- 像素爱心与徽章冲突是实测风险：底部两项（设置 / 收起导航栏）用 `SidebarMenuBadge` 放快捷键徽章（`AppNavMenuSections.tsx:196-200`、`:226-230`），徽章定位 `right-1 top-1.5`（`sidebar.tsx:661`）。爱心放在 `right: 8px` 会与"正好处于激活态且有徽章"的项重叠。建议：爱心写死 `right: 8px` 但用 `:not(:has([data-slot="sidebar-menu-badge"]))` 排除带徽章项，或直接改效果图把爱心移到左端/去掉。

### 2.3 feed 表格（#11-#14）

- 关键认知：**feed 表不是 `<table>`**。它是 `VirtualHistoryList` 的虚拟 grid：外层 `.vrcx-0-data-table`（`VirtualHistoryList.tsx:116`）、表头 viewport `div.shrink-0.overflow-hidden.border-b`（`:117-122`）、行体 `div.overflow-auto`（`:135-137`）、行容器 `div[data-virtual-row-key]`（`:164-172`）、行 `div[data-feed-list-summary]`（`FeedVirtualListShell.tsx:173-177`）。因此 `data-slot="table-row"/"table-head"` 这套 shadcn 钩子**对 feed 无效**，别照抄现有 jirai 主题里针对 `[data-slot="table-head"]` 的规则。
- 表格尺寸/颜色变量都在 `globals.css:180-209`（`--vrcx-0-table-header-surface`、`--vrcx-0-table-row-hover-surface`、`--vrcx-0-table-divider`、行高 40/32px 等），改这些变量比改 class 稳。
- 类型列（#14）的三种可用信号：文本（CSS 选不到）、图标 class、Tailwind 颜色类。只有前两者里"颜色类"可稳定拿到 3 类；`Status/Avatar/Bio` 共享 `text-muted-foreground opacity-70`。若一定要 6 色，需要应用侧给 `FeedTypeIndicator` 加 `data-type={row.type}`（现已传到组件，`FeedTableParts`/`FeedTypeIndicator.tsx:30-38`），这是**应用改动**，不是纯 CSS。

### 2.4 右栏（#15-#20）

- 侧栏结构：`aside.vrcx-0-side-panel`（overflow-hidden）→ `SidePanelSelfHeader`（`vrcx-0-side-panel-self`）→ `Tabs` → 左列（筛选框 + `FriendsSidebar`）+ 右列 `.vrcx-0-side-panel-rail`。
- 好友行高 49px、分组头 38px(+16px 顶距)、房间头 26px（`FriendsSidebarHeaders.tsx:10-16`），虚拟列表按此估算——主题若给行加 padding/边框改了实际高度，会与虚拟估算错位（滚动条跳动）。**这是本项最实际的坑**：行内改动请用 `box-shadow`/`background`，不要改 `height`。
- 分组头（#16）走 `ListSectionHeader` → `Collapsible` + Button；房间头（#17）没有任何 data hook，是本次调研中最脆的一处。

### 2.5 状态栏（#21-#22）

- 结构：`footer.vrcx-0-statusbar`（`StatusBarFooter.tsx:369-376`）→ 左组容器 `div.flex.min-w-0.flex-1.items-center.gap-1`（`:379`）→ `connections`（服务器状态 + 实时连接，`:259-317`）→ VRChat / SteamVR / 队列 / 正在播放（`:381-545`）；右组单独渲染（`:548+`）。
- VRChat / SteamVR 段**没有 `onClick`**，因此 `StatusSegment` 落到 `div` 分支（`StatusBarParts.tsx:163-172`）；这与"任务按钮带边框 + 小方块前缀"的语义（可点击按钮）也不符：真实 VRChat 段是状态指示，点击无行为。建议效果图把它降级为"状态胶囊"，或改画状态栏右键菜单里的可见性配置。
- 时钟（#22）是 `PopoverTrigger` 包的真实按钮，可点击选时区，凹陷框用 `:has(.lucide-clock)` 定位可行。

### 2.6 用户详情弹窗（#23-#28）

- 容器：`DialogHost.tsx:87-98` 给 `DialogContent` 加了 `entity-dialog bg-(--entity-dialog-ground)`；`--entity-dialog-ground` 是应用变量（`globals.css:993-996` 引用），主题可直接改。
- 弹窗**没有标题条 DOM**，也没有 footer 容器：底部按钮组在 `UserDialogHeaderActions`/info tab 内部（`vrcx-layout-reference.md:507-522`）。所以效果图的"顶部粉色标题条 + 关闭按钮"需要自绘：关闭按钮本身存在（`dialog.tsx:80-96` 的 `[data-slot="dialog-close"]`，但 `DialogHost` 传 `showCloseButton={false}`，`DialogHost.tsx:88` → **详情弹窗里没有关闭按钮 DOM**，这也要改效果图或接受缺失）。
- 横幅（#24）是真实图片（`aspect-[4/3]`），效果图里的渐变紫横幅只能在图片缺失时的 `fallback` 状态下出现（`UserDialogHeaderMedia.tsx:44-48`），主题无法保证"渐变横幅"。
- 弹窗标签顺序与效果图不同（真实：信息/共同好友/群组/创建的世界/收藏世界/模型/活动/JSON，`vrcx-layout-reference.md:474-487`），信息卡片顺序也不同（真实第一块是"当前状态"，`UserDialogInfoTab.tsx:363`），见修改建议。

### 2.7 滚动条与底纹（#29-#30）

- 滚动条：#29 是纯 CSS 最稳的一项（应用已用 `*::-webkit-scrollbar-*`），双色只需 `linear-gradient`，注意清掉应用的圆角与 `background-clip: content-box`。
- 底纹：#30 用 data URI 的 `mask`/`background` 即可（`jirai-assets.css` 全部图案均为内联 `data:image/svg+xml`，可直接搬进主题文件，符合"相对路径不解析"的限制）。

## 3. 效果图需要修改的地方

按"必改 → 建议改 → 可保留但需注明"排列。

**必改（真实 DOM 不存在，不改就是死图）**

1. **中区工具条右侧四个图标（表格/列/刷新/更多）删掉**。#31：feed 表格模式的工具条只有「视图切换（表格/分栏）＋筛选 chips ＋类型下拉 ＋搜索框（内嵌日期范围）」。要么删，要么把这组图标挪到"游戏日志页"效果图（那里有 `ToolbarRefreshButton`/`ToolbarViewMenu`）。
2. **类型 chips 不能常显 7 个**。#32：真实逻辑是"只显示已选中的筛选"。把效果图改成"无选中"（工具条上只有「分组好友」「类型」两个入口），或画成"已选中 位置变动 / 上线"两条 chip 的状态；「全部」在真实 UI 里是类型下拉里的默认文案，不是常驻 chip。
3. **feed 表格的"选中行"改成"悬停行"或"展开行"**。#13：feed 行没有持久选中态。建议改画 hover 态（用 `--vrcx-0-table-row-hover-surface` 上色），或点展开箭头后的展开行（`--vrcx-0-table-row-expanded-surface`）。
4. **右侧好友栏的"选中好友行"同样改掉**。#18b：好友行只有 hover/focus。改画 hover 态，或把高亮语义换成"最近有新动态"的既有信号（行内 `data-pending-offline` 闪烁，`FriendsSidebarFriendRow.tsx:253`），不要造不存在的状态。
5. **用户详情弹窗顶部标题条要么去掉，要么承认它是"装饰性 overlay"**。#23：没有标题条 DOM，且详情弹窗连关闭按钮都没渲染（`DialogHost.tsx:88`）。建议：把粉条做成"贴着弹窗顶边的 26px 装饰带 + 左上角 'user' 字样"，不要画右侧 ✕；或者干脆删掉标题条，把粉色用在标签条激活态上。
6. **弹窗横幅不要画成固定紫色渐变**。#24：横幅是用户真实图片（`aspect-[4/3]`）。建议画成"匿名化图片占位 + 底部像素心条"，或标注"仅在无横幅时的 fallback 渐变"。

**建议改（能实现，但效果图与真实不符会误导实现）**

7. **状态栏 VRChat / SteamVR 不要画成带边框的可点击任务按钮**。#21：真实是可点击=false 的状态段，且主题无法只命中它俩。建议画成"状态胶囊（小方块/圆点 + 文本）"，或把带边框的任务按钮样式改为对整个状态栏段的统一风格。
8. **类型列的彩色小方块只保证 3 种颜色**。#14：GPS（天蓝）/ 上线（绿）/ 下线（灰）可区分，状态·签名变动 / 模型变动 / 简介变更三者真实 class 相同。建议：方块统一用薄荷或主题色，靠 lucide 图标形状区分类型；若坚持 6 色，需应用侧补 `data-type`（属应用改动，不在纯 CSS 范围）。
9. **弹窗信息卡片的顺序与标题**：真实的卡片顺序是 当前状态 → 线上备注与本地备注 → 个人资料详情 → 个人简介 → 状态分布 → 好友关系记录 → 活动摘要（`vrcx-layout-reference.md:524-538`）；效果图把"线上备注与本地备注"放到了最后、缺少"好友关系记录"。建议按真实顺序重排，否则实现者会照着画错的顺序找选择器。
10. **弹窗标签条文案**：真实为 信息 / 共同好友 / 群组 / 创建的世界 / 收藏世界 / 模型 / 活动 / JSON（他人视角），效果图基本一致，但"收藏世界"在真实 i18n 里是 `收藏世界`（他人）——保留即可，注意标签条可横向滚动。
11. **左栏「＋新建仪表板」需要加条件说明**。#33：无 dashboard 时该 DOM 不存在，标题条下方会空一块。建议在效果图注里写明"仅当存在仪表板时显示"。
12. **左栏激活项的像素爱心**：#10 建议在效果图注里写"仅在无徽章的激活项显示"，或把爱心改到行左端，避免与 `SidebarMenuBadge`（快捷键徽章）重叠。
13. **三区域顶部/底部的额外高度**取 24px + 6px 可行，但请把"中区标题条必须挂在 `.vrcx-0-page-scaffold` 而不是 `.vrcx-0-main-content` 上"写进实现注（后者两个伪元素都被应用占用，硬写会覆盖壁纸层或拖拽高亮）。

**可保留但需注明**

14. 标题条里的 `start` / `vrcx-0` / `friends` / 三点：是 CSS `content` 生成文本，固定英文、不随语言切换。
15. 紫色蒙层（#28）、双色滚动条（#29）、桌面锯齿底纹（#30）：都能做；底纹需要把 `--vrcx-0-sidebar-inset-surface`（以及必要时 `--vrcx-0-main-surface`）改成透明才看得见，若用户启用官方壁纸会被壁纸层盖住。
16. 「Preview Build」徽章与「帮助」菜单文案：由运行时/构建状态决定，效果图恒显示可能与实机不符。

## 4. 未确认项（不猜）

- `DialogHost` 的 `overflow-hidden` 与 shadcn `DialogContent` 默认 `overflow-y-auto` 经 `cn()`（tailwind-merge）合并后的最终值（`DialogHost.tsx:90`、`dialog.tsx:74`）——决定弹窗标题条用 `::before` 是否随滚动移动。未运行应用，**未确认**。
- lucide-react 输出的类名是否稳定为 `lucide-<kebab-name>`（按图标形状给类型列上色所需）。应用 CSS 已知依赖 `.lucide`（`AppNavMenuIcons.tsx:14`），但带名字的后缀 **未确认**。
- `--entity-dialog-ground` 的默认值定义位置：本次只在 `globals.css:993-996` 见到引用，取值来源 **未确认**。
- 主题注入后与 Tailwind 变体（`hover:`、`data-active:`）的实际胜负关系未在运行的应用上验证；本文所有"能"的结论基于"主题 CSS 在应用 CSS 之后加载"这一文档前提（`docs/css-hooks.md:7-17`）。

## 5. 三条最需要改的

1. **删掉/挪走中区工具条右侧 4 个图标（表格/列/刷新/更多）**，并把常显的 7 个类型 chips 改成"无选中"或"已选中若干"——这两处真实 DOM 不存在，是纯 CSS 无解的死元素。
2. **把"选中行"语义全部改成"悬停/展开"**：feed 表格与右栏好友行都没有持久选中态，`selected` 只属于通用 DataTable，不该出现在这两处效果图里。
3. **弹窗：顶部粉色标题条不要画成带 ✕ 的完整窗口条**（没有标题条 DOM，详情弹窗也不渲染关闭按钮），横幅不要画成固定紫色渐变（真实是用户图片）；建议把粉色重心移到"标签条激活态"，粉条只保留一条 26px 装饰带 + `user` 字样。
