# R9.7 Q2 · 加载指示插入点清单（源码：/tmp/vrcx-win-src-r97/src，Windows 实机工作树只读快照）

grep 范围：`<Spinner`（113 处，ui/shadcn/spinner.tsx = `Loader2Icon data-slot=spinner role=status class="size-4 animate-spin"`，lucide 实际类名 `lucide lucide-loader-circle lucide-loader-2`）、
`Loader2Icon / LoaderCircleIcon`、`RefreshCw / RefreshCcw / RotateCw + animate-spin`（16 处唯一插入点）、`LoadingState / SearchLoadingState / AppLoadingState`（24 处调用）、全部 `Suspense fallback=`（只有 Spinner 型 fallback 计入）。RotateCw 无 animate-spin 用法。

分类：**A** = 页面/区块级加载 → loader-r9 同款跳舞小人（56×72，11 帧 / 1.1s，复用 `--jk-loader-sheet` 与 `@keyframes jk-loader-dance`）。**B** = 按钮内/行内/刷新按钮/逐卡片/列表底部的小转圈 → 保持像素小转圈（pixel `--px` 环 + `steps(8,end)`）。

| 合计 | A | B |
|---|---|---|
| 插入点 | **57**（其中 20 个 main-content LoadingState 早已由 loader-r9 覆盖，r97 新接 37 个） | **94** |

fixture 编号（`sites.mjs`）列在最后一列；同模式的多处共用一个 fixture。

## A · 页面/区块级（换跳舞）

### A-1 页面级（main content / 应用外壳）

| 文件:行 | 容器 DOM（选择器钩子） | fixture |
|---|---|---|
| app/routes.tsx:9 `RouteLoadingFallback`（router.tsx:114 AppShellRoute 启动时整窗、routes.tsx:38 懒加载页） | `div.text-muted-foreground.flex.h-full.min-h-0.items-center.justify-center.gap-2.text-sm > Spinner.size-4`（无文案） | A01 |
| features/charts/RelationshipTimelinePage.tsx:18 / TwoPersonRelationshipPage.tsx:18 / MutualFriendsPage.tsx:17 `ChartPageFallback` | 同上 `div.h-full.justify-center.gap-2 > Spinner.size-4 + span` | A02 |
| **features/charts/RelationshipTimelinePageImpl.tsx:447（图3）** | `div.relative.min-h-0.flex-1 > div.text-muted-foreground.absolute.inset-0.flex.items-center.justify-center.gap-2.text-sm > Spinner.size-4 + "加载中"` | A03 |
| **features/charts/TwoPersonRelationshipPageImpl.tsx:628（图4）** | `div.mt-[100px].flex.items-center.justify-center > RefreshCcwIcon.text-muted-foreground.size-6.animate-spin`（**非 data-slot**） | A04 |
| features/instance-history/InstanceHistoryPage.tsx:900 | `div.pointer-events-none.absolute.inset-0.flex.items-center.justify-center.gap-2 > Spinner.size-4 + 文案`（图表覆盖层） | A05 |
| features/feed/FeedPage.tsx:87 | `PageBody div.flex.min-h-0.flex-1.flex-col.gap-3.items-center.justify-center > Spinner` | A06 |
| features/feed/columns/FeedColumnPane.tsx:352 | `div.h-full.items-center.justify-center.gap-2 > Spinner + 文案` | A07 |
| features/tools/VrchatLogPage.tsx:119 | `div.h-full.items-center.justify-center.gap-2 > Spinner.size-4 + 文案` | A08 |
| features/feed/components/FeedTableShell.tsx:148 | `td[data-slot=table-cell].h-24 > span.inline-flex.items-center.gap-2 > Spinner + 文案`（Feed 页主体加载；**横排**，72px 放进 96px 行不撑高） | A09 |
| features/feed/components/FeedVirtualListShell.tsx:344（VirtualHistoryList.tsx:186 容器） | `div.min-h-24.h-full.justify-center > span.inline-flex.gap-2 > Spinner + 文案`（横排） | A10 |
| features/dashboard/components/DashboardEmbeddedPagePanel.tsx:13 | `div.min-h-[220px].flex-1.items-center.justify-center.gap-2` | A11 |
| features/dashboard/components/widgets/DashboardInstanceWidget.tsx:632 / DashboardGameLogWidget.tsx:477 / DashboardFeedWidget.tsx:462 | `div.min-h-[180px].flex-1.items-center.justify-center.gap-2` | A12 |
| components/layout/PageScaffold.tsx:258 `LoadingState`（page/panel 变体，main content，**loader-r9 已覆盖**）调用点：browse-history/BrowseHistoryPage.tsx:417、game-log/GameLogPage.tsx:112、activity/ActivityPage.tsx:16、activity/components/ActivityJourneyView.tsx:858、activity/ActivityPageImpl.tsx:371、search/components/SearchResultParts.tsx:99（SearchLoadingState，SearchTabPanels.tsx:62/126/185/244）、friends/components/FriendListTable.tsx:114、friends/components/FriendsLocationsVirtualList.tsx:48、friends/FriendLogPage.tsx:65、tools/InventoryPage.tsx:316、tools/components/GalleryFileTab.tsx:144、GalleryPrintsTab.tsx:290、GalleryViewParts.tsx:27、moderation/ModerationPage.tsx:45、my-groups/MyGroupsPage.tsx:275、group-moderation/GroupModerationPage.tsx:66、:166、my-avatars/MyAvatarsPage.tsx:83、player-list/components/PlayerListTableSection.tsx:202、charts/components/mutual-friends/MutualFriendsStageOverlay.tsx:58（20 处） | `[data-slot=empty]:not(.min-h-24,.min-h-0) > [data-slot=empty-content] > div.flex.items-center.gap-2 > Spinner (+label)` | A13 |

### A-2 弹窗/面板区块级（r97 新增；loader-r9 原先明确排除 portal/dialog）

| 文件:行 | 容器 DOM | fixture |
|---|---|---|
| components/dialogs/ProfileMediaPanel.tsx:177、user-dialog/components/UserDialogProfileDecorationsPanel.tsx:138 | 弹窗内 `LoadingState className=min-h-32 / min-h-48`（无文案） | A14 |
| components/dialogs/avatar-dialog/components/AvatarDialogPerformanceTab.tsx:275 | `div.min-h-40.items-center.justify-center.gap-2 > Spinner + span` | A15 |
| components/dialogs/avatar-dialog/components/AvatarDialogGalleryTab.tsx:70 | `div.min-h-24.border-dashed.items-center.justify-center > Spinner`（无文案，72 放进 96） | A16 |
| components/dialogs/BoopEmojiDialog.tsx:277 | `div.h-28.items-center.justify-center.gap-2 > Spinner.size-4 + 文案` | A17 |
| components/dialogs/UserActivityPanel.tsx:19（Suspense fallback） | `div.min-h-48.justify-center.gap-2` | A18 |
| components/dialogs/world-dialog/WorldDialogTabPanels.tsx:86 | `Empty.min-h-32.border > [data-slot=empty-header] > Spinner` | A19 |
| components/dialogs/group-dialog/GroupListState.tsx:36 | `div.min-h-32.justify-center.gap-2` | A20 |
| components/dialogs/user-dialog/components/UserDialogMutualGraphImpl.tsx:170 | `div.absolute.inset-0.flex.items-center.justify-center > Spinner.text-muted-foreground.size-4` | A21 |
| components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:583、UserDialogFeedTab.tsx:135 | `div.min-h-52.flex-1.justify-center.gap-2` | A22 |
| components/dialogs/user-dialog/components/UserDialogEntityListState.tsx:46 | `div.min-h-32.justify-center.gap-2` | A23 |
| components/dialogs/user-dialog/components/UserDialogMutualGraph.tsx:18（Suspense） | `div.min-h-0.flex-1.items-center.justify-center > Spinner.text-muted-foreground` | A24 |
| components/dialogs/UserActivityPanelImpl.tsx:310 | `div.mt-8.flex-1.flex-col.items-center.justify-center.gap-2 > Spinner.size-5 + span` | A25 |
| components/hosts/system-dialogs/ChangelogDialog.tsx:238 | `div.min-h-48.items-center.justify-center.gap-2` | A26 |
| components/hosts/DialogHost.tsx:157（实体弹窗 Suspense） | `Spinner.mx-auto.my-8.size-6` | A27 |
| components/media/FullscreenImageViewer.tsx:418 | `div[role=status].flex-col.items-center.gap-3 > Spinner.size-6 + span` | A28 |
| components/hosts/tools-dialogs/NoteExportDialog.tsx:604 | `div.h-40.flex-col.justify-center.gap-2 > LoaderCircleIcon.size-5.animate-spin.opacity-60`（非 data-slot） | A29 |
| components/dialogs/user-dialog/components/UserDialogGroupQuickModerationDialog.tsx:127 | `div.min-h-[72px].justify-center.gap-2 > LoaderCircleIcon.size-4.animate-spin + span`（保持横排，正好 72） | A30 |
| components/media/ImageCropDialog.tsx:728 | `div[class="flex items-center justify-center"] > Spinner`（预览图加载中，裁剪舞台） | A31 |
| features/privacy-lock/PrivacyLockOverlay.tsx:65 | `[data-vrcx-0-surface=privacy-lock]`（全屏 Popup）`> Spinner` | A32 |

## B · 按钮内/行内（保持像素小转圈）

**B-1 Spinner[data-icon]（按钮/菜单触发器/列表底部，50 处）**：components/instances/InstanceActionBar.tsx:50、InstanceActionSummary.tsx:192、media/ImageCropDialog.tsx:812、media/FullscreenImageViewer.tsx:247、:274、dialogs/BoopEmojiDialog.tsx:512、world-dialog/WorldDialogTabPanels.tsx:406、invite-message/InviteMessagePanel.tsx:419、:587、:629、AvatarDetailsDialog.tsx:451、EntityDialogScaffold.tsx:286、group-dialog/GroupDialogEvents.tsx:227、user-dialog/components/UserDialogSearchHeader.tsx:57、InstanceInviteDialog.tsx:484、UserActivityPanelImpl.tsx:198、favorites/FavoriteActionMenu.tsx:448、translation/TranslationAction.tsx:39、proxy/ProxySettingsEditor.tsx:96、:110、:123、side-panel/SidePanelSettingsPopover.tsx:177、:199、layout/ToolbarControls.tsx:421（data-icon=icon）、hosts/LaunchDialogHost.tsx:484、features/game-log/components/GameLogColumns.tsx:397、:425、GameLogSessionsView.tsx:626（sentinel `div.justify-center.py-4`）、notifications/VrcNotificationCenterHost.tsx:218、friends/components/FriendListToolbar.tsx:127、:187、:200、FriendLogVirtualList.tsx:80（footer `div.min-h-10.justify-center`）、FriendLogColumns.tsx:196、auth/components/LoginFormCard.tsx:171、LoginPageUtilities.tsx:39、SavedAccountsCard.tsx:103（inline-end）、moderation/components/ModerationColumns.tsx:238、feed/components/FeedVirtualListShell.tsx:329（footer）、favorites/components/FavoriteShareCollectionDialog.tsx:299、FavoriteCardActionMenu.tsx:131、FavoritesGroupRail.tsx:597、privacy-lock/PrivacyLockOverlay.tsx:173、:187、:327、PrivacyLockPasswordDialog.tsx:367、my-avatars/components/MyAvatarGridCard.tsx:385、MyAvatarsViewParts.tsx:294、player-list/components/PlayerListMutualScan.tsx:89、settings/.../AdvancedTroubleshootingGroup.tsx:205。fixture B01–B05。

**B-2 Spinner（无 data-icon，30 处）**

| 文件:行 | 容器 | 理由 | fixture |
|---|---|---|---|
| components/media/ScreenshotThumbnailCard.tsx:250 | 缩略图卡 `div.absolute.inset-0.justify-center` | 逐卡片，多张同时加载 | B06 |
| components/friends/FriendInstanceTimer.tsx:67 | `span.inline-flex.min-w-0 > Spinner.mr-1.size-3` | 行内 | B07 |
| sidebar/friends-sidebar/FriendsSidebarLocation.tsx:304、location/LocationDisplay.tsx:139 | traveling 行内 `Spinner.mr-1.size-3.5` | 行内 | B08 |
| features/friends/components/FriendsLocationsWorldSection.tsx:127 | 名字行 `span.gap-1 > Spinner.size-3` | 行内 | B09 |
| components/tile/SelectableTile.tsx:104 | `span`(TILE_BUSY_OVERLAY) `absolute inset-0 > Spinner.size-5` | 逐卡片 | B10 |
| components/layout/SelectionActionBar.tsx:35 | 浮动胶囊 `Spinner.size-4` | 工具条 | B11 |
| features/activity/components/ActivityJourneyView.tsx:894 | 无限滚动 sentinel `div.flex.justify-center.py-4` | 列表底部 | B12 |
| features/feed/columns/FeedColumnPane.tsx:400 | 加载更早 `div.flex.justify-center.py-2` | 列表底部 | B13 |
| features/feed/components/FeedSearchBox.tsx:139 | `[data-slot=combobox-chips] > Spinner.size-4`（搜索图标位） | 输入框图标 | B14 |
| features/player-list/components/PlayerListColumns.tsx:118 | 表格单元格 `Spinner.size-3.5` | 单元格 | B15 |
| features/charts/components/mutual-friends/MutualFriendsStageOverlay.tsx:20 | 顶部“正在布局”小徽章 `absolute top-3 … gap-2` | 状态徽章 | B16 |
| charts/components/mutual-friends/MutualFriendsHud.tsx:184、MutualFriendsNodeCard.tsx:136 | icon-sm Button（与静止 RefreshCcwIcon 二选一） | 刷新按钮 | B17 |
| settings/.../AdvancedTroubleshootingGroup.tsx:88 | icon-sm Button（与 RefreshCwIcon 二选一） | 刷新按钮 | B18 |
| features/tools/vrchat-log/components/VrchatLogTable.tsx:116 | Button sm `Spinner.size-3.5` | 按钮 | B19 |
| features/assistant/components/AssistantMessage.tsx:61 | `[data-slot=marker-icon] > Spinner` | 聊天标记 | B20 |
| components/dialogs/group-dialog/GroupDialogEvents.tsx:149、:247 | 紧凑虚线行 `div.border-dashed.p-3.gap-2`（无 justify-center） | 紧凑行，换小人会从 40px 撑到 ~120px | B21 |
| components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:291 | 进度 `span.flex.gap-2.text-sm` | 行内进度 | B22 |
| components/dialogs/group-dialog/GroupModerationBanImportDialog.tsx:218 | destructive Button | 按钮 | B23 |
| user-dialog/components/UserActivityPanelSections.tsx:69 | 小节标题旁 `Spinner.size-3.5` | 行内 | B24 |
| user-dialog/components/UserDialogInfoTab.tsx:909 | `div.gap-2.text-xs > Spinner.size-3` | 行内 | B25 |
| user-dialog/components/UserDialogStatusDistribution.tsx:264 | 刷新 Button（与 RefreshCwIcon 二选一） | 刷新按钮 | B26 |
| components/dialogs/AvatarOwnerEditDialogs.tsx:382 | 计数旁行内 | 行内 | B27 |
| previous-instances-table/PreviousInstancesViewParts.tsx:1012 | 右上角浮动徽章 `absolute top-1 right-1` | 状态徽章 | B28 |
| side-panel/SidePanelSelfAccountMenu.tsx:141、friends-sidebar/AccountSwitcherPopover.tsx:119 | 菜单内 `div.flex.justify-center.py-3` | 下拉菜单 | B29 |
| components/hosts/LaunchDialogHost.tsx:168 | Button（flex-col） | 按钮 | B30 |
| features/tools/screenshotExportProgressToast.tsx:62 | toast description | toast | B31 |

**B-3 非 data-slot 的 animate-spin 图标（13 处）**：dialogs/group-dialog/GroupModerationTabPanel.tsx:398（Loader2Icon data-icon，B33）、user-dialog/components/UserDialogGroupQuickModerationDialog.tsx:199、UserDialogGroupInviteDialog.tsx:242、charts/components/mutual-friends/MutualFriendsRelationsManager.tsx:162（Button 内 LoaderCircleIcon，B34）、hosts/system-dialogs/VRChatConfigDialog.tsx:564（RefreshCwIcon data-icon=icon，B35）、tools/components/ScreenshotGalleryView.tsx:568（RefreshCwIcon data-icon，B36）、**charts/RelationshipTimelinePageImpl.tsx:426、charts/TwoPersonRelationshipPageImpl.tsx:600（刷新按钮里 RefreshCcwIcon 加载时 animate-spin，B37）**、hosts/system-dialogs/ProfileBackupDialogs.tsx:52、:62（状态行 `div.gap-3`，B38）、hosts/tools-dialogs/ProfileBackupDialog.tsx:305（`[role=status].gap-1.5.text-xs`，B39）、assistant/components/SessionSidebar.tsx:57（B40）、ui/shadcn/toast.tsx:25（`[data-type=loading] [data-slot=toast-icon] > LoaderCircleIcon`，B41）。

**B-4 LoadingState variant=table（1 处）**：features/notifications/components/NotificationFeed.tsx:138（`Empty.min-h-24.px-3`；p-6 后只剩 48px 内容高，维持 loader-r9 的排除，B32）。

## D · 诱饵（静止图标必须完全不变）

RelationshipTimelinePageImpl.tsx:426 / TwoPersonRelationshipPageImpl.tsx:600 空闲时的 RefreshCcwIcon、MutualFriendsHud 静止 RefreshCcwIcon、VRChatConfigDialog 静止 RefreshCwIcon、非加载的 `div.justify-center.gap-2` 图标行、带图标的 EmptyState、`[data-slot=input-group-addon]`（有 justify-center gap-2 但带 data-slot）。fixture D01–D07。

## 实现要点（runtime/loader-r97.css）

- A 选择器全部以“直接子元素 `svg:is([data-slot=spinner],.animate-spin)`”为终点，父容器用源码真实类组合：`div.justify-center:is(.gap-2,.flex-1):not([data-slot])`、`div[class="flex items-center justify-center"]`、`.mt-\[100px\]`、`.min-h-24.border-dashed`、`[data-slot=empty-header]`、`[role=status].gap-3`、`td span.inline-flex.gap-2`、`.min-h-24>span.inline-flex.gap-2`、`[data-vrcx-0-surface=privacy-lock]`、LoadingState 的 `[data-slot=empty]:not(.min-h-24,.min-h-0)>[data-slot=empty-content]>div`，外加 `.inset-0>svg.text-muted-foreground[data-slot=spinner]`、`svg.my-8[data-slot=spinner]`。`:not([data-slot])` 排除 input-group-addon 等带 slot 的组件；按钮是 `<button>`，天然不命中 `div.…`。
- 带文案的 `div.justify-center.gap-2` 行改为竖排（gap 10px，同 loader-r9）；`min-h-[72px]` 与表格/虚拟列表的 `span.inline-flex` 保持横排，避免撑高。
- B：`svg.lucide.animate-spin` 与 toast loading 图标补 `steps(8,end)`；Spinner 原本已由 motion-r5 步进。
- 动效：`--jk-dance` 变量在 `prefers-reduced-motion` 与 `html.reduce-effects` 下为 `none`（停在第 1 帧）；B 在两种模式下 `animation:none`。
