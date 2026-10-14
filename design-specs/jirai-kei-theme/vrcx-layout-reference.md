# VRCX-0 桌面主界面布局参考（Jirai 系主题效果图专用）

- 调研对象：`/home/fulutang/Documents/Github/VRCX-0-jirai`（**只读调研，未修改任何文件，未执行 git / 构建命令**）
- 技术栈：React + shadcn/ui + Tailwind v4 + Tauri 桌面应用；前端源码根 `src/`
- 用途：为 `jirai-kei-theme` 的效果图（mockup）提供真实布局、真实元素顺序、真实尺寸与 CSS 钩子
- 约定：所有行号均相对仓库根，格式 `路径:行号`；查不到的写“未找到”，不猜测

---

## 0. 结论速览（最容易被画错的 5 件事）

1. **窗口默认页是 `/feed`（好友动态）**，不是好友列表；`/` 会重定向到上次记住的页面或 `/feed`（`src/app/router.tsx:81-89`、`src/app/router.tsx:251`）。
2. **右侧 side panel 不是“好友详情/实例信息面板”，而是好友侧栏（FriendsSidebar）**，带一条竖向图标 rail 可切换到 群组房间 / 已跟踪的非好友 / 收藏集合 / 世界房间（`src/components/sidebar/SidePanel.tsx:381-693`）。用户详情是**独立对话框**，不是右侧面板。
3. **标题栏高 32px（`h-8`）**，左侧是「VRCX-0-jirai」品牌菜单 + 「帮助」菜单，右侧是快速搜索/通知/助手/主题/置顶/右栏开关等图标按钮 + 窗口控制（`src/components/layout/AppTitleBar.tsx:96`）。
4. **表格行高由 CSS 变量控制**：常规 40px、紧凑模式 32px；表头常规 32px、紧凑 28px（`src/styles/globals.css:207-208`、`src/styles/globals.css:239-243`）。
5. **好友侧栏一行 49px**（含头像 36px + 名字 + 副行/位置），不是表格行高（`src/components/sidebar/friends-sidebar/FriendsSidebarHeaders.tsx:10`）。

---

## 1. 主窗口整体结构

### 1.1 应用根容器

| 层级 | 组件 | className / 钩子 | 源码位置 |
| --- | --- | --- | --- |
| 根容器 | `AppRouterContent` 的最外层 `div` | `vrcx-0-app-root flex min-h-0 w-full flex-col overflow-hidden`、`data-vrcx-0-surface="app-root"` | `src/app/router.tsx:202-210` |
| 背景过渡层 | 空 div | `vrcx-0-background-image-transition-layer` | `src/app/router.tsx:211-214` |
| 标题栏 | `MacOverlayTitleBar` 或 `AppTitleBar` | 见 §1.2 | `src/app/router.tsx:215` |
| 路由宿主 | `div` | `vrcx-0-route-host`、`data-vrcx-0-surface="route-host"` | `src/app/router.tsx:216-219` |
| 全局宿主 | `GlobalHosts` / `MacNativeMenuActionHost` | 无 CSS 钩子 | `src/app/router.tsx:259-260` |
| 窗口缩放把手 | `WindowResizeHandles`（仅 Windows 自定义边框） | 无 | `src/app/router.tsx:262` |

- 自定义边框判定：`hasCustomWindowFrame = isWindowsHost && !window.__VRCX_SYSTEM_WINDOW_FRAME__`（`src/app/router.tsx:196-198`）；为真时用 `vrcx-0-custom-window-frame h-full`。
- macOS 上标题栏换成 `MacOverlayTitleBar`（`src/app/router.tsx:215`，组件见 `src/components/layout/MacOverlayTitleBar.tsx:34-35`，同样 `h-8`）。

### 1.2 三栏骨架（主布局）

`src/components/layout/AppShellLayout.tsx:143-199` 定义主布局，DOM 顺序为：

```
div.flex.h-full.flex-col
├── div.flex.flex-1
│   └── AppSidebar (SidebarProvider)          ← 左栏 + 主区外壳
│       ├── Sidebar（左栏导航，collapsible="icon"）
│       └── SidebarInset
│           └── div[data-vrcx-0-surface=main-shell].vrcx-0-main-shell
│               └── div[data-vrcx-0-surface=workspace].vrcx-0-workspace
│                   ├── div[data-vrcx-0-surface=main-content].vrcx-0-main-content  ← <Outlet /> 中间主区
│                   ├── div[data-vrcx-0-resize=side-panel]                        ← 右栏拖拽把手
│                   └── SidePanel                                                  ← 右侧好友侧栏
└── AppStatusBar                                                                    ← 底部状态栏
```

| 区块 | 关键 class | 源码位置 |
| --- | --- | --- |
| 主外壳 | `vrcx-0-main-shell` + `data-vrcx-0-surface="main-shell"` | `src/components/layout/AppShellLayout.tsx:147-150` |
| 工作区 | `vrcx-0-workspace` + `data-vrcx-0-surface="workspace"`（另有 `data-window-sidebar-mode`） | `src/components/layout/AppShellLayout.tsx:151-157` |
| 中间主区 | `vrcx-0-main-content` + `data-vrcx-0-surface="main-content"`，侧栏窗口模式下加 `hidden` | `src/components/layout/AppShellLayout.tsx:158-166` |
| 右栏把手 | `data-vrcx-0-resize="side-panel"`，宽 `w-(--vrcx-0-side-panel-resizer-width)` | `src/components/layout/AppShellLayout.tsx:169-175` |
| 右侧面板 | `<SidePanel />`，宽度用响应式公式 | `src/components/layout/AppShellLayout.tsx:176-191` |

右侧面板宽度规则（效果图可直接照抄比例）：

- 存储键 `VRCX_0_RightSidebarWidth`（`AppShellLayout.tsx:13`），取值被夹在 **240–700px**，无值时默认 **320px**（`AppShellLayout.tsx:19-29`）。
- 渲染宽度 = `max(15rem, min(用户宽度, 100% - 45rem - 0.5rem))`（`AppShellLayout.tsx:15-17`；变量定义见 `src/styles/globals.css:223-225`）。
- 左栏宽度由 `--sidebar-width` 驱动（`src/components/layout/AppSidebar.tsx:171`），可拖拽调整（`AppSidebar.tsx:87-164`）。

右侧面板的显示条件（`src/components/layout/useRightSidePanelVisibility.ts:48-56`）：

- 以下路由**默认隐藏**右侧面板：`/friends-locations`、`/social/friend-list`、`/charts/instance`、`/charts/mutual`（`src/components/layout/sidePanelRoutes.ts:1-6`）；
- 其余路由跟随全局 `rightSidebarOpen`（`useRightSidePanelVisibility.ts:50-56`）。

---

## 2. 标题栏（Title bar）

组件：`src/components/layout/AppTitleBar.tsx`（`h-8` = 32px，`AppTitleBar.tsx:96`）。

### 2.1 属性与状态数据

| 属性 | 含义 | 位置 |
| --- | --- | --- |
| `data-app-titlebar="true"` | 标题栏标记 | `AppTitleBar.tsx:91` |
| `data-window-docked` | 窗口贴边/停靠 | `AppTitleBar.tsx:92` |
| `data-window-blurred` | 窗口失焦 | `AppTitleBar.tsx:93` |
| `data-window-sidebar-mode` | 侧边栏窗口模式 | `AppTitleBar.tsx:94` |
| `data-vrcx-0-surface="titlebar"` / `.vrcx-0-titlebar` | 主题钩子（可换背景） | `AppTitleBar.tsx:95-96`；CSS 定义 `src/styles/globals.css:823-829` |

### 2.2 左侧：菜单

拖拽区 `data-tauri-drag-region` 包裹菜单（`AppTitleBar.tsx:98-121`）；仅在会话就绪且无隐私锁遮罩时渲染 `AppMenuBar`（`AppTitleBar.tsx:102-116`）。

**菜单 1 · 品牌菜单「VRCX-0-jirai」**（`src/components/layout/AppMenuBar.tsx:134-190`，品牌文本见 `AppMenuBar.tsx:136`，钩子 class `vrcx-0-brand`）：

| 顺序 | 项目 | i18n key | 中文 | 英文 |
| --- | --- | --- | --- | --- |
| 1 | 设置 | `app_menu.settings` | 设置 | Settings |
| 2 | 检查更新 | `app_menu.check_updates` | 检查更新 | Check for Updates |
| 3 | 重启 | `app_menu.restart` | 重启 VRCX-0 | Restart VRCX-0 |
| 4 | 后台模式 | `app_menu.start_background_mode` | 切换到后台模式 | Switch to Background Mode |
| — | 分隔线 | — | — | — |
| 5 | 退出登录（destructive） | `app_menu.logout` | 退出登录 | Sign Out |
| 6 | 退出 | `app_menu.quit` | 退出 VRCX-0 | Quit VRCX-0 |

**菜单 2 · 帮助菜单**（`AppMenuBar.tsx:192-292`，触发器文案 `app_menu.help` = 帮助 / Help，可带构建徽章 `Badge`）：

| 顺序 | 项目 | i18n key | 中文 | 英文 |
| --- | --- | --- | --- | --- |
| 1 | 更新日志 | `nav_menu.changelog` | 更新日志 | Changelog |
| 2 | 键盘快捷键 | `app_menu.keyboard_shortcuts` | 键盘快捷键 | Keyboard Shortcuts |
| — | 分隔线 | — | — | — |
| 3 | 发送反馈 | `app_menu.send_feedback` | 发送反馈 | Send Feedback |
| 4 | 报告问题 | `app_menu.report_issue` | 在 GitHub 报告问题 | Report Issue on GitHub |
| — | 分隔线 | — | — | — |
| 5 | 分组标签 `Community`（`app_menu.community` = 社区 / Community） | — | — | — |
| 6 | GitHub | 硬编码字符串 `GitHub` | GitHub | GitHub |
| 7 | Discord | 硬编码字符串 `Discord` | Discord | Discord |
| 8 | QQ 群 | `nav_menu.qq_group` | QQ群 | QQ Group |
| — | 分隔线 + 仅开发版：打开 DevTools（`app_menu.open_devtools`） | — | — | — |
| 9 | 关于 VRCX-0 + 版本号（右侧快捷键位） | `app_menu.about` | 关于 VRCX-0 | About VRCX-0 |

菜单项样式：`min-h-7 min-w-48 text-xs`（`AppMenuBar.tsx:43`）；分组小标题为 `text-[11px] uppercase`（`AppMenuBar.tsx:54`）。

### 2.3 右侧：图标按钮组

普通窗口模式（`AppTitleBar.tsx:138-140` 渲染 `actions`，定义在 `src/components/layout/useTitleBarActions.tsx:448-528`），从左到右：

| 顺序 | 元素 | 来源 | 说明 |
| --- | --- | --- | --- |
| 1 | 更新按钮 `TitleBarUpdateButton` | `useTitleBarActions.tsx:455-470` | 仅有可用更新时出现 |
| 2 | 快速搜索按钮 | `useTitleBarActions.tsx:472-506` | 文案 `app_menu.quick_search`（快速搜索 / Quick Search），快捷键 `Ctrl/⌘+K`；宽度 `h-6 min-w-7`，`min-[640px]:w-44`、`min-[960px]:w-56` |
| 3 | 通知按钮 | `useTitleBarActions.tsx:392-411`、`:507` | 文案 `side_panel.notification_center.title` |
| 4 | 助手按钮（Sparkles 图标） | `useTitleBarActions.tsx:508-514` | 文案 `assistant.title` |
| 5 | 主题切换（日/夜间） | `useTitleBarActions.tsx:413-447`、`:515` | 文案 `nav_tooltip.toggle_theme`（切换日/夜间模式 / Toggle Theme） |
| 6 | 窗口置顶 | `useTitleBarActions.tsx:268-281`、`:516` | 文案 `app_menu.always_on_top`（窗口置顶 / Always on Top） |
| 7 | 右侧栏开关 | `useTitleBarActions.tsx:517-527` | 文案 `app_menu.show_friends_sidebar` / `app_menu.hide_friends_sidebar`（显示/隐藏好友侧栏） |
| 8 | 侧边栏窗口模式开关 | `useTitleBarActions.tsx:282-295`、`:528` | 文案 `app_menu.enter_sidebar_mode` / `app_menu.restore_full_window` |

按钮尺寸：`size-7 min-w-7 rounded-md px-0`（如 `useTitleBarActions.tsx:510`、`:519`）。

侧边栏窗口模式下改为精简组：快速搜索 + 通知 + 主题切换 + 置顶 + 侧栏模式（`AppTitleBar.tsx:122-137`）。

### 2.4 最右侧：窗口控制

`AppTitleBar.tsx:141-172`，均为 `h-full w-9 rounded-none`（`AppTitleBar.tsx:43`）：

| 顺序 | 图标 | 文案 key | 中文 |
| --- | --- | --- | --- |
| 1 | `MinusIcon` | `app_menu.label.minimize_window` | 最小化 |
| 2 | `SquareIcon` / `CopyIcon`（最大化/还原） | `app_menu.label.maximize_window` / `app_menu.label.restore_window` | 最大化 / 还原 |
| 3 | `XIcon` | `app_menu.action.close_window` | 关闭 |

- 关闭按钮悬停为危险色：`hover:bg-destructive! hover:text-destructive-foreground!`（`AppTitleBar.tsx:165`）。
- 侧边栏窗口模式下隐藏“最大化”（`AppTitleBar.tsx:150`）。

---

## 3. 左侧边栏导航（Sidebar）

### 3.1 容器

| 元素 | 说明 | 位置 |
| --- | --- | --- |
| `SidebarProvider` | `data-vrcx-0-surface="sidebar-layout"`，class `vrcx-0-sidebar-layout`，内联 `--sidebar-width` | `src/components/layout/AppSidebar.tsx:167-183` |
| `Sidebar` | `side="left"`、`variant="sidebar"`、`collapsible="icon"`、`data-vrcx-0-surface="sidebar"`，class `absolute h-auto` | `src/components/layout/AppSidebar.tsx:185-193` |
| 导航拖拽把手 | `data-vrcx-0-resize="nav"`，宽 `w-(--vrcx-0-main-content-gutter)`，定位 `left: var(--sidebar-width)` | `src/components/layout/AppSidebar.tsx:195-202` |
| `SidebarInset` | `data-vrcx-0-surface="sidebar-inset"`（承载主区） | `src/components/layout/AppSidebar.tsx:203-208` |

shadcn 侧的 `data-slot` 挂载点：`sidebar-wrapper`（`src/ui/shadcn/sidebar.tsx:150`）、`sidebar`（`:199/:219/:251/:288`）、`sidebar-gap`（`:256`）、`sidebar-container`（`:270`）、`sidebar-inner`（`:287`）、`sidebar-inset`（`:360`）。

### 3.2 菜单项定义与顺序

- 默认布局数组：`src/components/layout/navMenuModel.ts:138-176`。
- 每项的定义（key / lucide 图标 / tooltip / labelKey / routeName）：`src/shared/constants/ui.ts:3-152`。
- 菜单渲染：`src/components/layout/AppNavMenuSections.tsx:105-157`（`SidebarContent` + `SidebarGroup` + `SidebarMenu`）。
- 图标组件尺寸：通知红点用 `size-4` 容器（`src/components/layout/app-nav-menu/AppNavMenuIcons.tsx:36-51`）；图标着色类 `navMenuLucideClassName`（同文件 `:12-13`）。

**左侧导航完整顺序（默认布局，顶层）**：

| # | key | 图标（lucide） | 中文 | 英文 | 路由 |
| --- | --- | --- | --- | --- | --- |
| 1 | `feed` | `Rss` | 好友动态 | Feed | `/feed` |
| 2 | `friends-locations` | `MapPin` | 好友位置 | Friend Locations | `/friends-locations` |
| 3 | `game-log` | `History` | 游戏日志 | Game Log | `/game-log` |
| 4 | `instance-history` | `TextSearch` | 房间历史 | Instance History | `/instance-history` |
| 5 | `player-list` | `Gamepad2` | 房内玩家 | Current Players | `/player-list` |
| 6 | `search` | `Search` | 搜索 | Search | `/search` |
| 7 | `browse-history` | `Footprints` | （`browse_history.title`） | — | `/browse-history` |
| 8 | **文件夹 收藏** | `Star` | 收藏 | Favorites | — |
| 9 | ↳ `favorite-friends` | `UserStar` | 好友收藏 | Favorite Friends | `/favorites/friends` |
| 10 | ↳ `favorite-groups` | `UsersRound` | （`saved_group_favorites.title`） | — | `/favorites/groups` |
| 11 | ↳ `favorite-worlds` | `MapPinned` | 世界收藏 | Favorite Worlds | `/favorites/worlds` |
| 12 | ↳ `favorite-avatars` | `PersonStanding` | 模型收藏 | Favorite Avatars | `/favorites/avatars` |
| 13 | **文件夹 社交** | `ContactRound` | 社交 | Social | — |
| 14 | ↳ `friend-log` | `Logs` | 好友日志 | Friend History | `/social/friend-log` |
| 15 | ↳ `friend-list` | `UserRoundCheck` | 好友列表 | Friends | `/social/friend-list` |
| 16 | ↳ `moderation` | `ShieldUser` | 玩家管理 | Moderation | `/social/moderation` |
| 17 | `notification` | `Bell` | 通知 | Notifications | `/notification` |
| 18 | `my-avatars` | `PersonStanding` | 我的模型 | My Avatars | `/my-avatars` |
| 19 | `activity` | `Activity` | （`view.activity.title`） | — | `/activity` |
| 20 | `charts-mutual` | `Waypoints` | （`view.charts.mutual_friend.tab_label`） | — | `/charts/mutual` |
| 21 | `charts-two-person` | `ArrowLeftRight` | （`view.charts.two_person_relationship.header`） | — | `/charts/two-person` |
| 22 | `charts-timeline` | `TrendingUp` | （`view.charts.relationship_timeline.header`） | — | `/charts/timeline` |
| 23 | `tools` | `Wrench` | 工具 | Tools | `/tools` |

（表内中文/英文取自 `src/localization/zh-CN.json`、`en.json` 的 `nav_tooltip.*`；未列出中英文的项表示未在 `nav_tooltip` 下定义，需查对应页面标题 key，标为“未在本节确认”。）
- 顺序与 icon 定义位置：`src/shared/constants/ui.ts:3-152`；默认布局顺序与文件夹归属：`src/components/layout/navMenuModel.ts:138-176`。
- 工具类条目追加在末尾（`src/shared/constants/ui.ts:151` `...toolNavDefinitions`），且**只有出现在用户布局里才可见**（`navMenuModel.ts:292-295`）。
- 通知中心模式下会隐藏 `notification` 项（`navMenuModel.ts:570-587`）。

### 3.3 侧边栏底部（Footer）

`src/components/layout/AppNavMenuSections.tsx:162-235`：

| 顺序 | 元素 | 文案 | 快捷键徽章 |
| --- | --- | --- | --- |
| 1 | 设置 | `nav_tooltip.settings`（设置 / Settings） | `,`（`AppNavMenuSections.tsx:196-200`） |
| 2 | 收起/展开导航栏 | `nav_tooltip.collapse_nav` / `nav_tooltip.expand_nav` | `B`（`AppNavMenuSections.tsx:226-230`） |

### 3.4 侧边栏顶部（可选）

仅在仪表板（dashboard）存在时出现「新建仪表板」按钮：`dashboard.new_dashboard`（`src/components/layout/AppNavMenuSections.tsx:43-63`）。

---

## 4. 中间主区（Main content）

- 容器：`vrcx-0-main-content`（`src/components/layout/AppShellLayout.tsx:158-166`），内部渲染 `<Outlet />`（`:165`）。
- 页面脚手架 `PageScaffold`（`src/components/layout/PageScaffold.tsx:44-59`）：
  - 默认（非嵌入）：`x-container x-container--auto-height p-4`；
  - 嵌入模式：`vrcx-0-page-scaffold--embedded p-3`（`:49-53`）；
  - 相关 CSS：`.vrcx-0-page-scaffold { --vrcx-0-page-pad: 1rem; }`（`src/styles/globals.css:955-961`）。
- 页面标题 `PageTitle`：`text-base leading-5 font-medium`（`PageScaffold.tsx:89-103`）。
- 工具栏 `PageToolbar`：`vrcx-0-page-toolbar`，底部外边距 0.5rem（`PageScaffold.tsx:62-76`；`globals.css:963-965`）。

**默认进入的页面 = `/feed` 好友动态**：

| 视图模式 | 构成 | 位置 |
| --- | --- | --- |
| 表格模式（默认，配置键 `feedViewMode` 默认 `'table'`） | `FeedToolbar` + `PageBody` + `FeedVirtualListShell`（表头 + 虚拟行） | `src/features/feed/FeedPage.tsx:226-277`；默认值 `src/features/feed/useFeedViewModeState.ts:21,35` |
| 分栏模式 | `FeedColumnsMode`（多列 pane，TweetDeck 式） | `src/features/feed/FeedPage.tsx:96-117` |

- Feed 分栏密度（分栏模式）：紧凑 `rowHeight: 60`、头像 32px；紧密 `rowHeight: 48`、无头像（`src/features/feed/feedColumnsDensity.ts:34-59`）。
- Feed 表格视图的页头高度与表头：`grid h-[var(--vrcx-0-table-header-height)]`（`src/features/feed/components/FeedVirtualListShell.tsx:96`），行 `grid h-[var(--vrcx-0-table-row-height)]`（同文件 `:175`）。

其他页面骨架（供对照）：

- 好友列表页：`PageScaffold embedded` + `FriendListToolbar` + `FriendListTable`（无页面大标题，`src/features/friends/FriendListPage.tsx:25-80`）。
- 游戏日志页：`PageScaffold embedded` + `GameLogToolbar` + `GameLogTableShell`（`src/features/game-log/GameLogPage.tsx:73-199`）。
- 工具页：`ToolPageHeader` = 返回「工具」按钮 + `PageTitle` + status + actions（`src/components/layout/ToolPageHeader.tsx:39-57`）。

通用工具条控件（各页面共用）：`ToolbarViews` / `ToolbarActions` / `ToolbarStatus` / `ToolbarSearch`（默认宽 `w-40 sm:w-64`，`src/components/layout/ToolbarControls.tsx:66-100`） / `ToolbarTabs` / `ToolbarSegmented` / `ToolbarFilterChips` / `ToolbarIconButton` / `ToolbarRefreshButton` / `ToolbarViewMenu` / `ToolbarOverflowMenu` / `ToolbarFilterMenu`（导出清单见 `ToolbarControls.tsx:42-596`）。

---

## 5. 右侧 side panel（好友侧栏）

### 5.1 容器

- `<aside>`：`class="vrcx-0-side-panel flex min-h-0 w-80 shrink-0 flex-col overflow-hidden"`，`data-vrcx-0-surface="side-panel"`（`src/components/sidebar/SidePanel.tsx:381-393`）。
- 侧栏窗口模式下背景用 `--vrcx-0-side-panel-surface`（`src/styles/globals.css:967-969`）。
- 实际宽度见 §1.2（240–700px，默认 320px）。

### 5.2 顶部：自己（Self header）

`src/components/sidebar/side-panel/SidePanelSelfHeader.tsx:206-379`，容器 class `vrcx-0-side-panel-self`（`:208`）：

| 顺序 | 元素 | 细节 | 位置 |
| --- | --- | --- | --- |
| 1 | （可选）铭牌特效 `ProfileNameplate` | 显示设置开关控制 | `SidePanelSelfHeader.tsx:215-220` |
| 2 | 头像 + 状态点 | `UserStatusAvatar className="size-10"`（40px） | `SidePanelSelfHeader.tsx:227-242` |
| 3 | 显示名 + 下拉箭头 | `text-sm leading-5 font-medium`，点击开账号菜单 | `SidePanelSelfHeader.tsx:257-264` |
| 4 | 状态描述（可点击行内编辑） | 无内容时显示 `dialog.user.action.edit_social_status` | `SidePanelSelfHeader.tsx:275-342` |
| 5 | 所在位置副行 | `StaticSidebarLocation`，高 `h-4 text-xs` | `SidePanelSelfHeader.tsx:343-365` |
| 6 | 右侧账号菜单按钮列 | 固定宽 `w-9` | `SidePanelSelfHeader.tsx:374-376` |

### 5.3 搜索框

- `InputGroup`，高 `h-7`，圆角 `rounded-md`，图标 `size-3.5`（`src/components/sidebar/SidePanel.tsx:403-439`）。
- 占位文案随当前标签变化（`SidePanel.tsx:273-280`）：
  - 好友：`side_panel.filter_friends` = 筛选好友 / Filter friends
  - 群组：`side_panel.filter_groups` = 筛选群组 / Filter groups
  - 世界房间：`side_panel.filter_instances` = 筛选房间 / Filter instances
  - 已跟踪非好友：`tracked_nonfriends.filter`

### 5.4 内容标签（TabsContent）

`SidePanel.tsx:441-497`：

| 标签 id | 组件 | 说明 |
| --- | --- | --- |
| `friends` | `FriendsSidebar` | 好友列表（主标签） |
| `groups` | `GroupsSidebar` | 群组房间（可隐藏） |
| `tracked-nonfriends` | `TrackedNonfriendsSidebar` | 已跟踪的非好友 |
| 收藏集合（动态 id） | `FriendsSidebar` + `favoriteCollection` | 由收藏分组生成的自定义标签 |
| 世界房间（动态 id） | `WorldRoomsSidebar` | 指定世界的房间列表 |

- 标签布局默认值：`friends`（`lucide:UserRound`）+ `groups`（`lucide:UsersRound`），见 `src/shared/utils/sidebarTabLayout.ts:58-71`；`friends` 始终可见，`groups` 可隐藏（`SidePanel.tsx:362-379`）。

### 5.5 右侧竖向图标签 rail

`SidePanel.tsx:499-692`，容器 `class="vrcx-0-side-panel-rail flex w-9 shrink-0 flex-col items-center gap-0.5 py-1.5"`（`:499`）：

| 顺序 | 元素 | 说明 | 位置 |
| --- | --- | --- | --- |
| 1 | 已跟踪非好友标签 | 图标 `UserSearchIcon size-4.5`，tooltip `tracked_nonfriends.title` | `SidePanel.tsx:504-530` |
| 2..n | 各标签图标 | `size-4.5`，激活态 `data-active:bg-secondary`；世界房间标签另带 `WorldRoomsTabRail`，收藏标签可带计数 `text-[10px]` | `SidePanel.tsx:531-639` |
| n+1 | 添加标签按钮（`PlusIcon`） | tooltip `side_panel.settings.custom_tabs.configure` | `SidePanel.tsx:641-655` |
| 底部 | 侧栏设置 Popover | `SidePanelSettingsPopover` | `SidePanel.tsx:656-691` |

### 5.6 好友侧栏行（行内结构）

- 行组件 `FriendsSidebarFriendRow`：按钮 `p-1.5 gap-2`，头像 + 名字 + 副行（`src/components/sidebar/friends-sidebar/FriendsSidebarFriendRow.tsx:241-256`）。
- 行内复用 `UserDetailContent`：头像 `UserStatusAvatar`（默认 **size-9 = 36px**，`src/components/UserStatusAvatar.tsx:20-25`），状态点 `absolute -right-0.5 -bottom-0.5 size-3.75`（`UserStatusAvatar.tsx:47-50`），名字 `text-sm leading-5 font-medium`，副行 `text-xs`（`src/components/UserDetailTile.tsx:29-55`）。
- 行高常量（虚拟列表估算）：好友行 **49px**、分组头 38px（首行）/54px（带顶部间距）、房间头 26px、收藏分组头 26px、消息/骨架 64px、页脚 16px（`src/components/sidebar/friends-sidebar/FriendsSidebarHeaders.tsx:10-38`）。
- 侧栏内容内边距：`px-1.5 pt-1 pb-2.5`（`src/components/sidebar/FriendsSidebar.tsx:823`）。

---

## 6. 底部状态栏（Status bar）

组件：`src/components/layout/status-bar/StatusBarFooter.tsx`（由 `AppStatusBar` 渲染，`src/components/layout/AppStatusBar.tsx:881-896`）。

| 形态 | 容器 | 位置 |
| --- | --- | --- |
| 普通窗口 | `<footer class="vrcx-0-statusbar @container/statusbar text-xs backdrop-blur">` + `data-vrcx-0-surface="statusbar"` | `StatusBarFooter.tsx:369-376` |
| 侧边栏窗口模式 | `<footer class="vrcx-0-statusbar ... h-8 ... border-t px-2 text-xs">` | `StatusBarFooter.tsx:351-364` |

- 背景：`--vrcx-0-statusbar-surface`（`src/styles/globals.css:971-973`）。
- 普通模式内部行高 `min-h-6`，窄容器纵向、宽容器（`@2xl/statusbar`）横向两端对齐（`StatusBarFooter.tsx:378`）。
- 背景模糊：`backdrop-blur`（`StatusBarFooter.tsx:373`）。

**左侧（信息区）顺序**（`StatusBarFooter.tsx:379-546`）：

| 顺序 | 元素 | 文案 key / 值 | 位置 |
| --- | --- | --- | --- |
| 1 | 服务器状态 | `status_bar.servers`（服务器状态 / Servers） | `:261-289` |
| 2 | 实时连接（WebSocket） | `status_bar.realtime_connection`（实时连接 / Realtime） | `:290-315` |
| 3 | VRChat 游戏状态 | 固定标签 `VRChat` | `:381-473` |
| 4 | SteamVR 状态 | 固定标签 `SteamVR` | `:474-479` |
| 5 | 排队 | `status_bar.instance_queue`（排队 / Queue） | `:480-522` |
| 6 | 正在播放 | `status_bar.now_playing`（正在播放 / Now Playing）+ 进度条 | `:523-545` |

**右侧（进度与工具区）顺序**（`StatusBarFooter.tsx:548-878` 起）：

| 顺序 | 元素 | 文案 key | 位置 |
| --- | --- | --- | --- |
| 1 | 数据目录迁移 | `data_dir_migration.*` | `:549-589` |
| 2 | 配置备份 | `profile_backup.*` | `:590-636` |
| 3 | 世界收藏导入 | `status_bar.world_collection_importing`（正在导入世界收藏（{progress}/{total}）） | `:637-645` |
| 4 | 好友详情加载 | `view.friend_list.loading.loading_friend_details`（正在加载好友详情） | `:646-663` |
| 5 | 关系图加载 | `status_bar.mutual_graph*` | `:664-672` |
| 6 | 时钟（最多 3 个，可点击选时区） | `status_bar.clocks` / `status_bar.timezone` | `:673-764` |
| 7 | 界面缩放 | `status_bar.zoom`（界面缩放 / Zoom）+ 百分比 | `:765-854` |
| 8 | 应用运行时长 | `status_bar.app_uptime_short`（运行时长 / Uptime） | `:855-878` |
| 9 | 代理指示 | `status_bar.proxy`（代理服务器 / Proxy） | `:879-919` |
| 10 | 勿扰模式菜单 | `status_bar.do_not_disturb*`（勿扰模式 / Do Not Disturb） | `AppStatusBar` → `StatusBarFooter.tsx:321` |
| 11 | 后台模式按钮 | `status_bar.start_background_mode`（切换到后台模式） | `:322-345` |

- 可见性配置项（右键状态栏可开关）：`vrchat`、`steamvr`、`proxy`、`ws`、`instanceQueue`、`nowPlaying`、`uptime`、`zoom`、`clocks`、`servers`（`src/components/layout/AppStatusBar.tsx:53-64`；右键菜单 `AppStatusBar.tsx:881-896`）。
- 文案表见 `src/localization/zh-CN.json` / `en.json` 的 `status_bar.*`。

---

## 7. 表格列定义（好友列表 / 好友动态 / 游戏日志 / 好友日志）

### 7.1 通用表格样式与密度

表行/表头 class 常量（`src/components/data-table/dataTableStyles.ts`）：

| 常量 | 值 | 行号 |
| --- | --- | --- |
| `DATA_TABLE_EMPTY_VALUE` | `—` | `:1` |
| `DATA_TABLE_ROW_CLASS_NAME` | `h-[var(--vrcx-0-table-row-height)] ...`（含悬停/选中/展开态） | `:3-4` |
| `DATA_TABLE_HEAD_CLASS_NAME` | `h-[var(--vrcx-0-table-header-height)] ... text-xs` | `:9-10` |
| `DATA_TABLE_CELL_CLASS_NAME` | `text-content-primary px-[…] py-[…] font-normal` | `:12-13` |
| `DATA_TABLE_PRIMARY_CELL_CLASS_NAME` | `font-medium`（昵称列） | `:15` |
| `DATA_TABLE_METADATA_CELL_CLASS_NAME` | `font-normal tabular-nums`（时间列） | `:17` |
| `DATA_TABLE_NUMERIC_CELL_CLASS_NAME` | `font-normal tabular-nums text-right` | `:24-25` |
| `DATA_TABLE_STICKY_ACTION_*` | 右侧固定操作列 | `:27-31` |

尺寸变量（`src/styles/globals.css`）：

| 变量 | 常规 | 紧凑（`.is-compact-table`） | 行号 |
| --- | --- | --- | --- |
| `--vrcx-0-table-header-height` | `2rem`（32px） | `1.75rem`（28px） | `:207`、`:239` |
| `--vrcx-0-table-row-height` | `2.5rem`（40px） | `2rem`（32px） | `:208`、`:240` |
| `--vrcx-0-table-cell-padding-inline` | `0.75rem` | `0.5rem` | `:209`、`:241` |
| `--vrcx-0-table-cell-padding-block` | `0.5rem` | `0.25rem` | `:232`、`:242` |
| `--vrcx-0-table-control-cell-padding-block` | `0.25rem` | `0` | `:233`、`:243` |

表格 DOM：`data-vrcx-0-table-row=""`（`src/components/data-table/DataTableView.tsx:333`）；容器 `app-data-table vrcx-0-data-table`（`DataTableView.tsx:317`）。

### 7.2 好友列表（`/social/friend-list`）

列定义：`src/features/friends/components/FriendListColumns.tsx:85-610`。

| 顺序 | 列 id | 中文（`table.friendList.*`） | 英文 | 宽度(width/size) | 备注 | 行号 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `leftSpacer` | — | — | 20 | 空占位列 | `:87-94` |
| 2 | `bulkSelect` | —（复选框） | — | 55（固定） | 批量删除模式复选框 | `:95-128` |
| 3 | `friendNumber` | 序号 | No. | 100 | 右对齐数字 | `:129-156` |
| 4 | `avatar` | 模型 | Avatar | 90（固定） | 头像图，**圆形 24px**（`size-6 rounded-full`） | `:157-195`（尺寸于 `:182`） |
| 5 | `displayName` | 昵称 | Name | 200 | `font-medium`，可随机着色 | `:196-230` |
| 6 | `rank` | 信誉等级 | Rank | 140 | 信任等级文本（带颜色类） | `:231-252` |
| 7 | `status` | 状态 | Status | 220 | **状态点 `size-2.5`** + 文本标签 | `:253-290`（点于 `:279-283`） |
| 8 | `language` | 语言 | Language | 160 | 语言代码小徽章 `h-5 min-w-8` `text-[10px]` | `:291-342` |
| 9 | `bioLink` | 社交链接 | Bio Links | 140 | favicon 按钮 `size-6` | `:343-385` |
| 10 | `joinCount` | 一起玩的次数 | Join Count | 120 | 右对齐 | `:386-407` |
| 11 | `timeTogether` | 一起玩的时长 | Time Together | 150 | 右对齐 | `:408-434` |
| 12 | `lastSeen` | 最后见面时间 | Last Seen | 180 | 等宽数字 | `:435-460` |
| 13 | `mutualFriends` | 共同好友 | Mutual Friends | 140 | 右对齐，可带“不可见”眼睛图标 | `:461-500` |
| 14 | `lastActivity` | 最后活动时间 | Last Activity | 200 | 等宽数字 | `:501-526` |
| 15 | `lastLogin` | 最后登录时间 | Last Login | 200 | 等宽数字 | `:527-552` |
| 16 | `dateJoined` | 账号创建时间 | Date Joined | 140 | 等宽数字 | `:553-570` |
| 17 | `unfriend` | 删除好友 | Unfriend | 100（固定） | 右侧操作按钮 `size-7`，危险色 | `:571-609` |

工具栏：搜索 `view.friend_list.search_placeholder`（搜索好友 / Search）、`view.friend_list.bulk_unfriend`（批量删除）、`view.friend_list.load`（拉取缺失的字段 / Load friend details）、`view.friend_list.load_mutual_friends`（加载共同好友）（`src/features/friends/components/FriendListToolbar.tsx:95-217`）。

### 7.3 好友动态 Feed（`/feed`，默认页）

- 表格视图列定义：`src/features/feed/components/FeedColumns.tsx:111-202`。

| 顺序 | 列 id | 中文（`table.feed.*`） | 英文 | 宽度 | 备注 | 行号 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `expander` | —（展开箭头） | — | 40（固定） | 可展开时显示 | `:113-127` |
| 2 | `created_at` | 时间 | Date | 自适应 | 日期+时间，tooltip 显示完整时间 | `:128-141` |
| 3 | `displayName` | 玩家 | User | 自适应 | 玩家链接（`FeedUserLink`），`font-medium` | `:142-155` |
| 4 | `type` | 类型 | Type | 自适应 | 类型指示器 `FeedTypeIndicator`，文案取 `view.feed.filters.*` | `:156-176` |
| 5 | `detail` | 详细信息 | Detail | ≥100（stretch） | 位置/世界/签名/模型/简介合并文本 | `:177-199` |

- 类型枚举中文：位置变动 GPS / 上线 Online / 下线 Offline / 状态签名变动 Status / 模型变动 Avatar / 简介变更 Bio（`src/localization/zh-CN.json` → `view.feed.filters.*`）。
- 行高：`h-[var(--vrcx-0-table-row-height)]`，表头 `h-[var(--vrcx-0-table-header-height)]`（`src/features/feed/components/FeedVirtualListShell.tsx:96,175`）。
- 视图切换文案：`view.feed.modes.table`（表格 / Table）、`view.feed.modes.columns`（分栏 / Columns）（`zh-CN.json`）。

### 7.4 游戏日志 GameLog（`/game-log`）

列定义：`src/features/game-log/components/GameLogColumns.tsx`。

| 顺序 | 列 id | 中文（`table.gameLog.*`） | 英文 | 宽度 | 行号 |
| --- | --- | --- | --- | --- | --- |
| 1 | `spacer` | — | — | 20 | `:86-94` |
| 2 | `created_at` | 时间 | Date | 140 | `:96-109` |
| 3 | `type` | 类型 | Type | 150 | `:111-160` |
| 4 | `displayName` | 玩家 | User | 200 | `:161-207` |
| 5 | `detail` | 详细信息 | Detail | minSize 150 + stretch | `:208-353` |
| 6 | `action` | 操作 | Action | 90（固定） | `:354-`（`size` 见 `:356`） |

> 表头文案取自 `table.gameLog.date/type/user/detail/action`（`src/localization/zh-CN.json`）。列宽数值见上表行号处的 `size:` 字段。

### 7.5 好友日志 FriendLog（`/social/friend-log`）

列定义：`src/features/friends/components/FriendLogColumns.tsx:45-143`。

| 顺序 | 列 id | 中文（`table.friendLog.*`） | 英文 | 宽度 | 行号 |
| --- | --- | --- | --- | --- | --- |
| 1 | `spacer` | — | — | 20 | `:47-56` |
| 2 | `created_at` | 时间 | Date | 120 | `:57-73` |
| 3 | `type` | 类型 | Type | 160 | `:74-87` |
| 4 | `displayName` | 玩家 | User | 260（stretch） | `:88-99` |
| 5 | `action` | 操作 | Action | 64（固定） | `:100-124` |
| 6 | `trailing` | — | — | 5 | `:125-132` |

- 行高同样取 `--vrcx-0-table-row-height`（`src/features/friends/components/FriendLogVirtualList.tsx:132`）；表头 `min-h-[var(--vrcx-0-table-header-height)]`（同文件 `:108`）。

---

## 8. 用户详情（对话框，非右侧面板）

**重要**：用户详情是**模态对话框**（`UserDialogContent` + `EntityDialogScaffold`），不占用右侧 side panel。

### 8.1 标签页

标签由 `buildUserDialogTabs` 生成（`src/components/dialogs/user-dialog/userDialogViewData.ts:140-196`）：

| 顺序 | value | 标签文案 | 条件 |
| --- | --- | --- | --- |
| 1 | `info` | 信息 / Info（`dialog.user.info.header`） | 总是 |
| 2 | `instance-history` | `dialog.previous_instances.header` | 仅自己 |
| 3 | `feed` | 好友动态 / Feed（`nav_tooltip.feed`） | 仅他人（不显示在标签条） |
| 4 | `mutual` | `dialog.user.mutual_friends.header` | 仅他人且未关闭共同关系 |
| 5 | `groups` | 群组 / Groups（`dialog.user.groups.header`） | 总是 |
| 6 | `worlds` | 创建的世界 / Worlds（`dialog.user.worlds.header`） | 总是 |
| 7 | `favorite-worlds` | `dialog.user.favorite_worlds.header` | 仅他人 |
| 8 | `avatars` | `dialog.user.avatars.header` | 总是 |
| 9 | `activity` | `dialog.user.activity.header` | 仅他人 |
| 10 | `json` | `dialog.user.json.header` | 总是 |

### 8.2 头部区块（`UserDialogHeaderSection`）

`src/components/dialogs/user-dialog/components/UserDialogHeaderSection.tsx:676-962`，自上而下：

| 顺序 | 区块 | 细节 | 行号 |
| --- | --- | --- | --- |
| 1 | 横幅/头像媒体 | `UserDialogHeaderMedia`（横幅可点击、头像可打开） | `:682-698` |
| 2 | 资料特效图 | 覆盖在上方 `aspect-[4/5]` | `:700-708` |
| 3 | 铭牌 + 名字行 | 名字 `text-lg leading-tight font-semibold`，左侧内联状态点 `size-2.5` | `:710-795` |
| 4 | 名字右侧操作按钮 | `UserDialogHeaderActions`（见 §8.3） | `:796-801` |
| 5 | 标记行 | `UserDialogHeaderFlags`（如平台/年龄限制等） | `:803-806` |
| 6 | 元信息行 | 在线时长（`dialog.user.info.estimated_online_for`）、平台/好友序号、人称代词（`dialog.user.pronouns`）、曾用名、语言 | `:807-887` |
| 7 | 徽章行 | `UserDialogHeaderMediaBadges`（有徽章时，前面带分隔线） | `:890-905` |
| 8 | 状态描述 | 上方分隔线 + 铅笔图标 + 文本（自己可点击编辑，`dialog.user.actions.edit_status`） | `:907-945` |
| 9 | 事实列表 | `UserDialogHeaderFacts` | `:958-961` |

### 8.3 头部操作按钮（`UserDialogHeaderActions`）

按分组（`src/components/dialogs/user-dialog/components/UserDialogHeaderActions.tsx`）：

| 分组 | 按钮 | i18n key | 中文 |
| --- | --- | --- | --- |
| 菜单/编辑 | 编辑线上备注与本地备注 | `dialog.user.actions.edit_note_memo` | 编辑线上备注与本地备注 |
| 菜单 | 显示模型信息 | `dialog.user.actions.show_avatar_author` | 显示模型信息 |
| 菜单 | 显示备用模型信息 | `dialog.user.actions.show_fallback_avatar` | 显示备用模型信息 |
| 菜单 | 显示一起加入过的房间 | `dialog.user.actions.show_previous_instances` | 显示一起加入过的房间 |
| 自己 | 编辑个人资料 / 编辑横幅和头像 | `edit_profile_details` / `edit_profile_media` | 编辑个人资料 / 编辑横幅和头像 |
| 好友关系 | 取消/发送好友申请 | `cancel_friend_request` / `send_friend_request` | 取消好友申请 / 发送好友申请 |
| 主操作 | 发送邀请 / 申请加入 / 发送戳一戳 | `invite` / `request_invite` / `send_boop` | 发送邀请 / 申请加入 / 发送戳一戳 |
| 群组 | 邀请加入群组 / 群组管理 | `group_actions`、`invite_to_group`、`group_moderation` | 群组 / 邀请加入群组 / 群组管理 |
| 玩家管理 | 屏蔽、静音、隐藏模型、聊天气泡、模型互动 | `moderation_*` | 见 `zh-CN.json` |
| 危险 | 删除好友 / 举报此玩家盗模开挂 | `unfriend` / `report_hacking` | 删除好友 / 举报此玩家盗模开挂 |

（行号：`:263`、`:272`、`:280`、`:288`、`:306`、`:313`、`:355`、`:366`、`:397`、`:420`、`:440`、`:447`、`:457`、`:464`、`:469`、`:593`、`:602`）

### 8.4 信息标签页（Info tab）区块顺序

`src/components/dialogs/user-dialog/components/UserDialogInfoTab.tsx`：

| 顺序 | 面板标题 | i18n key | 中文 | 行号 |
| --- | --- | --- | --- | --- |
| 1 | 当前状态 | `dialog.user.info.current_status` | 当前状态 | `:363` |
| 2 | 线上备注与本地备注 | `dialog.user.info.notes_memo` | 线上备注与本地备注（含线上备注 `note`、本地备注 `memo`） | `:459-482` |
| 3 | 个人资料详情 | `dialog.user.info.profile_details` | 个人资料详情（正在使用的模型、展示群组、家、用户名/ID/URL） | `:547-616` |
| 4 | 个人简介 | `dialog.user.info.bio` | 个人简介（带简介历史按钮 `bio_history`、链接 favicon、翻译按钮） | `:707-830` |
| 5 | 状态分布 | `dialog.user.info.status_distribution` | 状态分布（含刷新按钮与提示） | `:904-940` |
| 6 | 好友关系记录 | `dialog.user.info.relationship_history` | 好友关系记录 | `:1001` |
| 7 | 活动摘要 | `dialog.user.info.activity_summary` | 活动摘要（最后见面时间/最后活动时间/总在线时长/见面次数/一起游玩时长/账号创建日期） | `:1057-1109` |

其余信息字段文案（`zh-CN.json` → `dialog.user.info.*`）可直接用于效果图：最后见面时间、见面的次数、一起游玩的时长、总在线时长、最后活动时间、账号创建日期、添加为好友的时间、移除好友的时间、是否允许克隆模型、是否允许戳一戳、是否允许查看共同好友、是否允许查看绑定的 Discord 账号信息。

---

## 9. CSS 钩子清单

### 9.1 `data-vrcx-0-surface`（主题面板选择器）

| 值 | 挂载组件 | 源码位置 |
| --- | --- | --- |
| `titlebar` | `<header>` AppTitleBar | `src/components/layout/AppTitleBar.tsx:95` |
| `mac-titlebar` | MacOverlayTitleBar | `src/components/layout/MacOverlayTitleBar.tsx:34` |
| `app-root` | router 根 div | `src/app/router.tsx:203` |
| `route-host` | 路由宿主 div | `src/app/router.tsx:217` |
| `sidebar-layout` | `SidebarProvider` | `src/components/layout/AppSidebar.tsx:169`（另 `src/ui/shadcn/sidebar.tsx:151`） |
| `sidebar` | `Sidebar` | `src/components/layout/AppSidebar.tsx:189`（另 `src/ui/shadcn/sidebar.tsx:200/220/252/288`） |
| `sidebar-inset` | `SidebarInset` | `src/components/layout/AppSidebar.tsx:204`（另 `src/ui/shadcn/sidebar.tsx:361`） |
| `main-shell` | 主外壳 div | `src/components/layout/AppShellLayout.tsx:148` |
| `workspace` | 工作区 div | `src/components/layout/AppShellLayout.tsx:152` |
| `main-content` | 中间主区 div | `src/components/layout/AppShellLayout.tsx:159` |
| `side-panel` | `<aside>` SidePanel | `src/components/sidebar/SidePanel.tsx:384` |
| `statusbar` | `<footer>` StatusBarFooter（两种形态） | `src/components/layout/status-bar/StatusBarFooter.tsx:353`、`:371` |
| `data-table` | 表格容器 | `src/components/data-table/DataTableView.tsx:315` |
| `table-header` | `<thead>` | `src/ui/shadcn/table.tsx:24` |
| `login-page` | 登录页 | `src/features/auth/LoginPage.tsx:29` |
| `privacy-lock` | 隐私锁遮罩 | `src/features/privacy-lock/PrivacyLockOverlay.tsx:45` |

### 9.2 其他 `data-*` 钩子

| 属性 | 挂载点 | 位置 |
| --- | --- | --- |
| `data-app-titlebar="true"` | 标题栏 | `AppTitleBar.tsx:91` |
| `data-window-docked` / `data-window-blurred` / `data-window-sidebar-mode` | 标题栏 | `AppTitleBar.tsx:92-94` |
| `data-window-sidebar-mode` | 工作区 / 右侧面板 | `AppShellLayout.tsx:153-155`、`SidePanel.tsx:385-387` |
| `data-vrcx-0-resize="nav"` | 左栏拖拽把手 | `AppSidebar.tsx:197` |
| `data-vrcx-0-resize="side-panel"` | 右栏拖拽把手 | `AppShellLayout.tsx:171` |
| `data-vrcx-0-control="toolbar"` | 工具栏控件（标题栏搜索、ToolbarSearch、工具按钮、菜单触发器） | `useTitleBarActions.tsx:483`；`ToolbarControls.tsx:96`、`:409`、`:510`、`:580` |
| `data-vrcx-0-table-row=""` | 表格行 | `DataTableView.tsx:333` |
| `data-titlebar-interactive="true"` | 标题栏菜单包装 | `AppTitleBar.tsx:105` |

### 9.3 `data-slot` 属性

| 组件族 | data-slot 值（行号） | 文件 |
| --- | --- | --- |
| Table | `table-container`(8)、`table`(12)、`table-header`(23)、`table-body`(37)、`table-footer`(45)、`table-row`(60)、`table-head`(73)、`table-cell`(86)、`table-caption`(101) | `src/ui/shadcn/table.tsx` |
| Sidebar | `sidebar-wrapper`(150)、`sidebar`(199/219/251)、`sidebar-gap`(256)、`sidebar-container`(270)、`sidebar-inner`(287)、`sidebar-trigger`(309)、`sidebar-rail`(335)、`sidebar-inset`(360)、`sidebar-input`(377)、`sidebar-header`(388)、`sidebar-footer`(399)、`sidebar-separator`(413)、`sidebar-content`(424)、`sidebar-group`(438)、`sidebar-group-content`(508)、`sidebar-menu`(519)、`sidebar-menu-item`(530)、`sidebar-menu-badge`(658)、`sidebar-menu-skeleton`(683)、`sidebar-menu-sub`(713)、`sidebar-menu-sub-item`(730) | `src/ui/shadcn/sidebar.tsx` |
| Dialog | `dialog`(17)、`dialog-trigger`(31)、`dialog-portal`(35)、`dialog-close`(39)、`dialog-overlay`(48)、`dialog-content`(72)、`dialog-header`(105)、`dialog-footer`(124)、`dialog-title`(144)、`dialog-description`(160) | `src/ui/shadcn/dialog.tsx` |
| Sheet | `sheet`(20)、`sheet-trigger`(37)、`sheet-close`(43)、`sheet-backdrop`(56)、`sheet-viewport`(82)、`sheet-popup`(123)、`sheet-title`(199)、`sheet-description`(212) | `src/ui/shadcn/sheet.tsx` |

### 9.4 `.vrcx-0-*` class（定义位置 / 使用位置）

| class | CSS 定义（`src/styles/globals.css`） | 使用位置 |
| --- | --- | --- |
| `.vrcx-0-app-overlay` | `:686` | `src/ui/shadcn/dialog.tsx:50`、`src/ui/shadcn/sheet.tsx:53` |
| `.vrcx-0-app-drawer-viewport` | `:695` | `src/ui/shadcn/sheet.tsx:74` |
| `.vrcx-0-app-root` | `:705` | `src/app/router.tsx:205` |
| `.vrcx-0-background-image-transition-layer` | `:711`、`:724` | `src/app/router.tsx:213` |
| `.vrcx-0-custom-window-frame` | `:728`、`:743`、`:755`、`:795` | `src/app/router.tsx:207` |
| `.vrcx-0-route-host` | `:818` | `src/app/router.tsx:218` |
| `.vrcx-0-titlebar` | `:823`、`:827` | `src/components/layout/AppTitleBar.tsx:96`、`MacOverlayTitleBar.tsx:35` |
| `.vrcx-0-main-shell` | `:831` | `AppShellLayout.tsx:149`、`LoginPage.tsx:30` |
| `.vrcx-0-workspace` | `:835`、`:849`、`:853` | `AppShellLayout.tsx:156` |
| `.vrcx-0-main-content` | `:860`、`:883`、`:922`、`:936` | `AppShellLayout.tsx:161` |
| `.vrcx-0-sidebar-layout` | `:941`、`:848` | `AppSidebar.tsx:170`、`src/ui/shadcn/sidebar.tsx:163` |
| `.vrcx-0-sidebar-surface` | `:942`、`:946` | `src/ui/shadcn/sidebar.tsx:202`、`:222`、`:289` |
| `.vrcx-0-sidebar-inset` | `:951` | `src/ui/shadcn/sidebar.tsx:363` |
| `.vrcx-0-page-scaffold` | `:955` | `src/components/layout/PageScaffold.tsx:48` |
| `.vrcx-0-page-scaffold--embedded` | `:959` | `PageScaffold.tsx:50` |
| `.vrcx-0-page-toolbar` | `:963` | `PageScaffold.tsx:69` |
| `.vrcx-0-side-panel` | `:967` | `src/components/sidebar/SidePanel.tsx:389` |
| `.vrcx-0-side-panel-self` | 未找到（仅组件上有 class） | `SidePanelSelfHeader.tsx:208` |
| `.vrcx-0-side-panel-rail` | 未找到（仅组件上有 class） | `SidePanel.tsx:499` |
| `.vrcx-0-statusbar` | `:971` | `StatusBarFooter.tsx:355`、`:373` |
| `.app-data-table` / `.vrcx-0-data-table` | `:975`、`:980`、`:988`、`:993` | `DataTableView.tsx:317`、`VirtualHistoryList.tsx:116`、`PreviousInstancesViewParts.tsx:585` |
| `.vrcx-0-table-header` | `:1077` | `src/ui/shadcn/table.tsx:26`、`PreviousInstancesListTable.tsx:224` |
| `.vrcx-0-table-sticky-action` | `:1086` 起 | `dataTableStyles.ts:28-31` |
| `.vrcx-0-toolbar-control` | `:998` 起 | `ToolbarControls.tsx`、`useTitleBarActions.tsx:484` |
| `.vrcx-0-brand` | 未找到（globals.css 无该选择器） | `src/components/layout/AppMenuBar.tsx:136` |

### 9.5 主题变量入口（`:root`）

- `:root` 变量块：`src/styles/globals.css:9-235`；紧凑表格覆盖：`:237-244`；深色：`@media (prefers-color-scheme: dark)` `:246-295` 与 `.dark` `:296-372`。
- 表面变量（主题可覆写）：`--vrcx-0-app-surface`、`--vrcx-0-titlebar-surface`、`--vrcx-0-main-content-surface`、`--vrcx-0-sidebar-surface`、`--vrcx-0-sidebar-inset-surface`、`--vrcx-0-side-panel-surface`、`--vrcx-0-statusbar-surface`（`globals.css:160-167`）。
- 壁纸钩子：`--vrcx-0-wallpaper-*`（`globals.css:139-144`）与仅主内容区生效的 `--vrcx-0-main-content-wallpaper-*`（`globals.css:150-155`）。
- 表格视觉变量：`globals.css:180-206`、`:232-234`。

---

## 10. 在线状态颜色与含义

### 10.1 颜色变量

| 变量 | 值 | 含义 | 定义位置 |
| --- | --- | --- | --- |
| `--status-online` | `#2ed319` | 在线 / Online（VRChat `active`） | `src/styles/globals.css:117`（`:root`）、`:348`（`.dark`） |
| `--status-joinme` | `#00b8ff` | 欢迎加入 / Join Me | `globals.css:118`、`:349` |
| `--status-busy` | `#c80928` | 请勿打扰 / Do Not Disturb | `globals.css:119`、`:350` |
| `--status-askme` | `#e97c03` | 忙碌 / Ask Me | `globals.css:120`、`:351` |
| `--status-offline` | `#737f8d` | 离线 / Offline | `globals.css:121`、`:352` |
| `--status-offline-alt` | `#808080` | 离线状态点实际使用的灰 | `globals.css:122`、`:353` |
| `--status-offline-card` | `#737f8d` | 离线卡片灰 | `globals.css:123`、`:354` |
| `--status-active` | `#f4e05e` | 活跃（仅登录网页端）/ Active | `globals.css:124`、`:355` |
| `--platform-pc` | `#0078d4` | PC 平台 | `globals.css:125` |
| `--platform-quest` | `#3ddc84` | Quest | `globals.css:126` |
| `--platform-ios` | `#8e8e93` | iOS | `globals.css:127` |

### 10.2 状态枚举与类名映射

- 状态枚举（内部统一小写）：`'join me' | 'active' | 'ask me' | 'busy' | 'offline'`（`src/shared/utils/friendStatus.ts:3-9`）。
- 规范化别名：`joinme → 'join me'`、`askme → 'ask me'`、`offline:* / 'offline '` → `'offline'`（`friendStatus.ts:37-49`）。
- 实心点类名：`user-status-indicator online|joinme|askme|busy|offline` + `bg-[var(--status-*)]`（`friendStatus.ts:13-31`）。
- 空心点（Active 状态）：边框色 + `bg-background`（`src/domain/friends/presence.ts:79-90`）。
- presence 与点样式的组合规则：offline/pendingOffline → 实心 offline；active → 空心（按状态色描边）；online → 实心状态色（`presence.ts:92-110`）。
- 纯 CSS 兜底（用于旧式标记）：`i.x-user-status.active/.online/.joinme/.askme/.busy/.offline` 与 `i.x-status-icon.green/.blue/.orange/.red`（`src/styles/globals.css:1117-1149`）。
- 无障碍模式用 SVG 遮罩区分形状（joinme/askme/busy）：`globals.css:1151-1164`。

### 10.3 文案与排序

| 状态 key | i18n key | 中文 | 英文 |
| --- | --- | --- | --- |
| `active`（在线） | `dialog.user.status.online` | 在线 | Online |
| `state-active`（活跃） | `dialog.user.status.active` | 活跃中 | Active |
| `join me` | `dialog.user.status.join_me` | 欢迎加入 | Join Me |
| `ask me` | `dialog.user.status.ask_me` | 忙碌 | Ask Me |
| `busy` | `dialog.user.status.busy` | 请勿打扰 | Do Not Disturb |
| `offline` | `dialog.user.status.offline` | 离线 | Offline |
| `private` | `location.private` | 位于私人房间 | Private |
| `traveling` | `location.traveling` | 正在传送 | Traveling |

（映射表 `src/shared/utils/userStatus.ts:106-126`；文案 `src/localization/zh-CN.json`、`en.json`）
排序优先级：join me → active → ask me → busy → offline（`friendStatus.ts:56-111`；数值等级另见 `userStatus.ts:85-104`）。

### 10.4 状态点尺寸

| 场景 | 尺寸 | 位置 |
| --- | --- | --- |
| 头像角标（侧栏/列表行） | `size-3.75`（15px），定位 `-right-0.5 -bottom-0.5` | `src/components/UserStatusAvatar.tsx:47-50` |
| 表格“状态”列内联点 | `size-2.5`（10px） | `src/features/friends/components/FriendListColumns.tsx:281` |
| 用户详情头部内联点 | `size-2.5` | `UserDialogHeaderSection.tsx:732` |
| CSS 兜底点 | `size-2.5 rounded-full` | `src/styles/globals.css:1119` |

### 10.5 信誉等级颜色（可用于效果图的 Rank 列）

- 默认色：`untrusted #CCCCCC`、`basic #1778FF`、`known #2BCF5C`、`trusted #FF7B42`、`veteran #B18FFF`、`vip #FF2626`、`troll #782F2F`（`src/shared/constants/trustColors.ts:1-9`）。
- 对应 class：`x-tag-untrusted` / `x-tag-basic` / `x-tag-known` / `x-tag-trusted` / `x-tag-veteran` / `x-tag-vip` / `x-tag-troll`（`trustColors.ts:11-60+`）。

---

## 11. 效果图需要画出的元素清单

> 示例数据全部匿名化；尺寸按源码实测值。建议效果图分辨率基准：1280×800 或 1440×900（主内容区最小宽度 45rem = 720px，右侧栏最小 15rem = 240px）。

### A. 标题栏（高 32px，`data-vrcx-0-surface="titlebar"`）

- [ ] 左：品牌菜单触发器「**VRCX-0-jirai**」（`text-xs`，`px-3`）
- [ ] 左：「帮助」菜单触发器（可带一个 `Preview Build` 小徽章）
- [ ] 中：空白拖拽区（可放主色渐变/蕾丝纹理，注意不可放交互元素）
- [ ] 右（图标按钮，各约 28×28px，间隔 4px）：
  - [ ] 快速搜索（放大镜 + 文字「快速搜索 / Quick Search」+ `Ctrl K` 键位，宽约 224px @≥960px）
  - [ ] 通知（铃铛，可有红点）
  - [ ] 助手（Sparkles）
  - [ ] 主题切换（日/月）
  - [ ] 窗口置顶（图钉）
  - [ ] 右侧栏开关
  - [ ] 侧边栏模式开关
- [ ] 最右：窗口控制三连（最小化 / 最大化 / 关闭，各 36px 宽，等高 32px）
- 示例文案：`VRCX-0-jirai`、`帮助`、`快速搜索`、`Ctrl K`

### B. 左栏（宽约 240–280px，`data-vrcx-0-surface="sidebar"`）

- [ ] 顶部（可选）：「+ 新建仪表板」虚线边框按钮
- [ ] 导航项（图标 + 文字，行高约 32px，图标 16px，未激活不透明度 65%），按 §3.2 顺序至少画 12 项：
  - [ ] 好友动态 🔸（激活态：当前页，`data-active` 高亮）
  - [ ] 好友位置
  - [ ] 游戏日志
  - [ ] 房间历史
  - [ ] 房内玩家
  - [ ] 搜索
  - [ ] 浏览历史
  - [ ] 📁 收藏（可展开分组，内含 好友收藏 / 世界收藏 / 模型收藏 / 群组收藏）
  - [ ] 📁 社交（好友日志 / 好友列表 / 玩家管理）
  - [ ] 通知（可带未读红点）
  - [ ] 我的模型
  - [ ] 活动
  - [ ] 图表（互关 / 双人关系 / 时间线）
  - [ ] 工具
- [ ] 底部：设置（右侧 `,` 快捷键徽章）+ 收起导航栏（右侧 `B` 徽章）
- 示例文案：`好友动态`、`好友位置`、`游戏日志`、`收藏`、`社交`、`设置`

### C. 中区（`data-vrcx-0-surface="main-content"`，默认 `/feed` 好友动态）

- [ ] 页面内边距 16px（`p-4`）
- [ ] 工具条（FeedToolbar）：
  - [ ] 搜索框（宽 160px / ≥640px 时 256px，高约 28px，占位「搜索 / Search」）
  - [ ] 类型筛选 chips：「全部」「位置变动」「上线」「下线」「状态/签名变动」「模型变动」「简介变更」
  - [ ] 日期范围按钮
  - [ ] 视图切换（表格 / 分栏）
  - [ ] 密度、列管理、刷新、更多（溢出菜单）
- [ ] 表格：表头高 32px（`text-xs`，颜色偏灰），行高 40px，行分隔线极淡，悬停浅色底
  - [ ] 列：展开箭头(40) / 时间 / 玩家 / 类型 / 详细信息
  - [ ] 示例行（匿名）：
    - `10-11 21:04 | Friend_A | 上线 | 某个世界`
    - `10-11 20:58 | Friend_B | 位置变动 | 某个世界 · 某房间`
    - `10-11 20:31 | Friend_C | 状态/签名变动 | 换了签名`
    - `10-11 19:12 | Friend_D | 模型变动 | 某个模型`
- [ ] 右侧固定操作列（如有）：删除图标按钮
- [ ] 底部：加载更多 / 计数（如 `显示 42 / 128 位好友`）

### D. 右栏（宽 320px，`data-vrcx-0-surface="side-panel"`）

- [ ] 顶部自己行（高约 64px）：头像 40px + 状态点 15px（右下角）+ 名字「Me_A」+ 状态描述「今天也在摸鱼」+ 位置副行「某个世界」
- [ ] 右端：账号菜单按钮（竖排小方块区，宽 36px）
- [ ] 搜索框（高 28px，占位「筛选好友」）
- [ ] 好友分组标题（高 38px）：「在线」「活跃中」「离线」，可带同房间分组头（高 26px，如「某个世界 #12345」）
- [ ] 好友行（每行 49px，头像 36px + 名字 `text-sm` + 副行 `text-xs`）：

  | 状态点颜色 | 名字 | 副行 |
  | --- | --- | --- |
  | 🟢 绿 `#2ed319` | `Friend_A` | `某个世界` |
  | 🔵 蓝 `#00b8ff` | `Friend_B` | `欢迎加入 · 某个世界` |
  | 🟠 橙 `#e97c03` | `Friend_C` | `忙碌` |
  | 🔴 红 `#c80928` | `Friend_D` | `请勿打扰` |
  | ⚪ 灰 `#808080` | `Friend_E` | `离线 · 3 小时前` |
  | 🟡 黄（空心描边）`#f4e05e` | `Friend_F` | `活跃中（仅登录网页端）` |

- [ ] 最右侧竖向 rail（宽 36px）：`已跟踪非好友` 图标 + `好友` 图标 + `群组` 图标 + 收藏集合图标（可带计数）+ `+` 添加按钮 + 底部设置图标
- 示例文案：`筛选好友`、`在线`、`活跃中`、`离线`、`可能离线`

### E. 状态栏（`data-vrcx-0-surface="statusbar"`，高约 24–32px，`text-xs`，半透明+模糊）

- [ ] 左组：`服务器状态`（绿点）· `实时连接`（绿点 + 文字）· `VRChat`（激活/变暗）· `SteamVR` · `排队`（可选，warn 橙色）· `正在播放`（音符图标 + 曲名 + 进度）
- [ ] 右组：进度类（`正在加载好友详情 42/128`、`关系图`）、`时钟`（最多 3 个，如 `21:04 UTC+9`）、`界面缩放 100%`、`运行时长`（可关）、`代理`、`勿扰模式`、后台模式按钮
- 示例文案：`服务器状态`、`实时连接`、`VRChat`、`SteamVR`、`暂停播放 - 示例曲名`、`21:04 UTC+9`、`界面缩放 100%`

### F. 弹窗（`data-slot="dialog-content"`，用户详情）

- [ ] 顶部横幅图 + 圆形头像（叠在横幅下缘），可选资料特效图
- [ ] 名字行：`Friend_A`（`text-lg font-semibold`）+ 左侧内联状态点 10px + 右侧操作按钮组
- [ ] 标记行 + 元信息行：`已在线约 2 小时` · 平台图标（PC 蓝 `#0078d4` / Quest 绿 `#3ddc84`）+ 好友序号 · 语言 `中文 · English`（用 `·` 分隔）
- [ ] 状态描述区：铅笔图标 + 「今天也在摸鱼」
- [ ] 事实列表行（用户名 / 玩家 ID / VRChat 链接 + 复制按钮）
- [ ] 标签条：`信息` · `共同好友` · `群组` · `创建的世界` · `收藏世界` · `模型` · `活动` · `JSON`
- [ ] 信息标签页区块（竖排卡片）：
  1. `当前状态`（含 `已在线约 2 小时`）
  2. `线上备注与本地备注`
  3. `个人资料详情`（`正在使用的模型`、`展示群组`、`家`、`用户名`、`玩家 ID`、`VRChat 链接`）
  4. `个人简介`（含「翻译个人简介」按钮、链接图标）
  5. `状态分布`（条形/饼图占位 + 刷新按钮）
  6. `好友关系记录`（时间线）
  7. `活动摘要`（`最后见面时间`、`最后活动时间`、`总在线时长`、`见面的次数`、`一起游玩的时长`、`账号创建日期`）
- [ ] 按钮示例文案：`发送邀请`、`申请加入`、`发送戳一戳`、`邀请加入群组`、`玩家管理`、`编辑线上备注与本地备注`、`删除好友`
- 示例数据：`Friend_A`、`某个世界`、`某个模型`、`2024-08-01`

### G. 可选：好友列表页（`/social/friend-list`，右侧面板默认隐藏）

- [ ] 工具条：搜索框（`搜索好友`）、`批量删除模式`、`拉取缺失的字段`、`加载共同好友`、仅收藏筛选
- [ ] 表格列（见 §7.2 全部 17 列），行高 40px，头像列 24px 圆形，状态列内联点 10px，Rank 列用信誉等级色
- [ ] 示例行：`1 | (24px 头像) | Friend_A | Known User | 🟢 在线 | 中文 | 🔗 | 128 | 42:10:00 | 10-11 20:58 | 12 | 10-11 20:58 | 10-01 12:00 | 2023-04-11 | 🗑`

---

## 12. 未找到 / 需后续确认

- `.vrcx-0-brand`、`.vrcx-0-side-panel-self`、`.vrcx-0-side-panel-rail` 三个 class 在 `src/styles/globals.css` 中**未找到定义**（仅作为组件上的标记存在，供主题用作钩子）：`AppMenuBar.tsx:136`、`SidePanelSelfHeader.tsx:208`、`SidePanel.tsx:499`。
- 左侧导航中 `browse-history`、`favorite-groups`、`activity`、`charts-*` 的中文/英文文案不在 `nav_tooltip.*` 下（分别在 `browse_history.title`、`saved_group_favorites.title`、`view.activity.title`、`view.charts.*`），本文件未逐条展开取文案。
- 状态栏“服务器状态”段的具体文案取决于运行时数据（`status_bar.servers_ok` 等），效果图可任选一条。
- 本次调研**未**运行应用或截图，所有结论均来自源码静态阅读。
