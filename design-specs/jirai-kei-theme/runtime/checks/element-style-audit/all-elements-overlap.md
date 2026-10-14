# 全源元素 × 主题规则 静态候选审计

- JSX/TSX 源文件：578；解析错误：0
- 含 class/语义属性等的元素站点：6849；去重元素形状：4380
- 编译主题 CSS 规则：1335
- 有直接选择器候选：1572；无直接候选：5277（静态 class 无直接候选 4595，动态 class / primitive 不确定 682；不等于运行时主题缺口）
- 多规则重叠候选元素：2647；同元素属性值冲突候选：124
- 多规则重复属性声明组：34；同选择器属性冲突：1（源码可映射 0、未映射 1）；同标签/slot 多风格指纹组：24；伪元素重叠/冲突候选：0/0

> 本报告是源码 class/属性 + CSS 右端复合选择器的静态候选分析，不是运行时 DOM 证明。上下文祖先、伪类、Tailwind 动态分支可能造成误报/漏报；核心 14 种原语的计算样式结论以 `table.all-primitives-baseline.md` 为准。

## Jirai CSS 样式代码归组

- 唯一声明代码组：934；其中有静态元素候选命中的 141，未命中的 793。
- 元素使用点：1572 个有候选；5277 个归入“未覆盖”（静态 class 无直接候选 4595，动态/primitive 不确定 682）。
- 完整归组、selectors、声明和样例见 [all-elements-style-groups.md](all-elements-style-groups.md)；结构化全量数据见 [all-elements-overlap.json](all-elements-overlap.json) 的 styleCodeGroups / uncoveredGroup。

## 无命中样例（最多 100）

- app/router.tsx:42 <div> classes=text-muted-foreground flex h-full min-h-0 flex-col items-center justify-center gap-3 text-sm
- app/routes.tsx:9 <Spinner> classes=size-4
- components/ProfileDecorations.tsx:121 <DecorationImage> classes=absolute -inset-[18.75%] z-5
- components/ProfileDecorations.tsx:139 <DecorationImage> classes=absolute inset-x-0 top-0 z-20 aspect-[4/5]
- components/ProfileDecorations.tsx:180 <DecorationImage> classes=absolute inset-0
- components/UserDetailTile.tsx:34 <span> classes=min-w-0 flex-1 overflow-hidden
- components/UserDetailTile.tsx:35 <span> classes=block truncate leading-5 font-medium
- components/UserDetailTile.tsx:40 <span> classes=flex min-w-0 items-center gap-1
- components/UserDetailTile.tsx:42 <span> classes=min-w-0 truncate
- components/UserDetailTile.tsx:51 <span> classes=text-content-secondary block truncate text-xs
- components/UserStatusAvatar.tsx:26 <span> classes=bg-muted relative z-0 flex size-full items-center justify-center overflow-hidden rounded-full border
- components/UserStatusAvatar.tsx:28 <FadeInImage> classes=size-full object-cover
- components/UserStatusAvatar.tsx:33 <UserIcon> classes=text-muted-foreground
- components/UserStatusAvatar.tsx:40 <UserIcon> classes=text-muted-foreground
- components/UserStatusAvatar.tsx:47 <UserStatusDot> classes=absolute -right-0.5 -bottom-0.5 z-10 size-3.75
- components/about/AboutDialog.tsx:174 <p> classes=text-muted-foreground self-center text-xs
- components/about/AboutDialog.tsx:214 <DialogContent> classes=gap-0 px-7 pt-8 pb-6 sm:max-w-[560px]
- components/about/AboutDialog.tsx:218 <div> classes=flex flex-col items-center text-center
- components/about/AboutDialog.tsx:219 <DialogTitle> classes=text-4xl leading-none font-medium tracking-normal select-none
- components/about/AboutDialog.tsx:225 <DialogDescription> classes=mt-3 text-[13px]
- components/about/AboutDialog.tsx:229 <span> classes=text-foreground/80 font-medium tabular-nums
- components/about/AboutDialog.tsx:234 <span> classes=bg-muted-foreground/35 size-1 rounded-full
- components/about/AboutDialog.tsx:244 <section> classes=mt-5 flex flex-col items-center gap-3.5 text-center
- components/about/AboutDialog.tsx:245 <span> classes=text-muted-foreground/75 text-[10px] font-medium tracking-[0.18em] uppercase
- components/about/AboutDialog.tsx:249 <p> classes=text-muted-foreground/70 mx-auto max-w-sm text-xs text-balance
- components/about/AboutDialog.tsx:254 <div> classes=mt-6 flex flex-col items-center gap-3
- components/about/AboutDialog.tsx:255 <span> classes=text-muted-foreground/60 text-[10px] font-medium tracking-[0.16em] uppercase
- components/about/AboutDialog.tsx:278 <Icon> classes=(none)
- components/about/AboutDialog.tsx:286 <div> classes=mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4
- components/data-table/DataTableSortButton.tsx:84 <ArrowUpIcon> classes=(none)
- components/data-table/DataTableSortButton.tsx:86 <ArrowDownIcon> classes=(none)
- components/data-table/DataTableSortButton.tsx:88 <ArrowUpDownIcon> classes=text-muted-foreground opacity-70
- components/data-table/DataTableView.tsx:489 <div> classes=flex items-center gap-2
- components/data-table/DataTableView.tsx:517 <Pagination> classes=mx-0 w-auto justify-start
- components/data-table/DataTableView.tsx:529 <ChevronLeftIcon> classes=(none)
- components/data-table/DataTableView.tsx:535 <div> classes=text-content-secondary mx-1 font-medium
- components/data-table/DataTableView.tsx:551 <ChevronRightIcon> classes=(none)
- components/data-table/DataTableView.tsx:556 <span> classes=sr-only
- components/data-table/DataTableView.tsx:627 <Table> classes=table-fixed
- components/data-table/ResizableTableParts.tsx:132 <div> classes=flex min-w-0 items-center gap-2 pr-2
- components/data-table/ResizableTableParts.tsx:133 <div> classes=flex min-w-0 flex-1 items-center gap-1.5
- components/data-table/ResizableTableParts.tsx:134 <div> classes=min-w-0
- components/data-table/ResizableTableParts.tsx:153 <GripVerticalIcon> classes=(none)
- components/data-table/TableColumnVisibilityMenu.tsx:105 <span> classes=min-w-0 flex-1 truncate
- components/data-table/TableColumnVisibilityMenu.tsx:163 <span> classes=min-w-0 flex-1 truncate
- components/data-table/VirtualHistoryList.tsx:116 <div> classes=vrcx-0-data-table relative flex min-h-0 flex-1 flex-col overflow-hidden
- components/data-table/VirtualHistoryList.tsx:117 <div> classes=shrink-0 overflow-hidden border-b bg-[var(--vrcx-0-table-header-surface)]
- components/data-table/VirtualHistoryList.tsx:131 <ArrowUpToLineIcon> classes=(none)
- components/data-table/VirtualHistoryList.tsx:135 <div> classes=min-h-0 flex-1 overflow-auto [overflow-anchor:none]
- components/data-table/VirtualHistoryList.tsx:159 <div> classes=relative
- components/data-table/VirtualHistoryList.tsx:177 <div> classes=text-muted-foreground flex min-h-10 items-center justify-center px-3 py-2 text-sm
- components/data-table/VirtualHistoryList.tsx:185 <div> classes=text-muted-foreground flex h-full min-h-24 items-center justify-center px-4 text-center text-sm
- components/date-range-filter/DateRangeFilter.tsx:77 <CalendarRangeIcon> classes=(none)
- components/date-range-filter/DateRangeFilter.tsx:81 <PopoverContent> classes=w-auto
- components/date-range-filter/DateRangeFilter.tsx:95 <div> classes=flex items-center justify-between gap-4 px-3 pb-3
- components/date-range-filter/DateRangeFilter.tsx:96 <div> classes=text-muted-foreground min-w-0 text-xs
- components/date-range-filter/DateRangeFilter.tsx:101 <div> classes=flex justify-end gap-2
- components/date-time-range-picker/DateTimeRangePicker.tsx:80 <div> classes=flex items-center gap-1
- components/date-time-range-picker/DateTimeRangePicker.tsx:98 <span> classes=text-muted-foreground
- components/date-time-range-picker/DateTimeRangePicker.tsx:206 <PopoverContent> classes=w-auto p-0
- components/date-time-range-picker/DateTimeRangePicker.tsx:216 <div> classes=grid grid-cols-2 gap-3 px-3 pb-2
- components/date-time-range-picker/DateTimeRangePicker.tsx:217 <div> classes=flex flex-col gap-1.5
- components/date-time-range-picker/DateTimeRangePicker.tsx:218 <Label> classes=text-muted-foreground text-xs
- components/date-time-range-picker/DateTimeRangePicker.tsx:228 <div> classes=flex flex-col gap-1.5
- components/date-time-range-picker/DateTimeRangePicker.tsx:229 <Label> classes=text-muted-foreground text-xs
- components/date-time-range-picker/DateTimeRangePicker.tsx:240 <div> classes=flex justify-end gap-2 px-3 pb-3
- components/dialogs/AvatarDetailsDialog.tsx:276 <DialogContent> classes=sm:max-w-[min(92vw,38rem)]
- components/dialogs/AvatarDetailsDialog.tsx:314 <div> classes=grid gap-4 sm:grid-cols-2
- components/dialogs/AvatarDetailsDialog.tsx:451 <Spinner> classes=(none)
- components/dialogs/AvatarDialogContent.tsx:31 <AppEmptyState> classes=min-h-56
- components/dialogs/AvatarDialogTabbedView.tsx:156 <span> classes=cursor-help underline decoration-dotted underline-offset-2
- components/dialogs/AvatarDialogTabbedView.tsx:259 <div> classes=flex min-w-0 flex-col gap-2
- components/dialogs/AvatarDialogTabbedView.tsx:270 <span> classes=line-clamp-2 min-w-0 break-words
- components/dialogs/AvatarDialogTabbedView.tsx:286 <span> classes=truncate
- components/dialogs/AvatarDialogTabbedView.tsx:291 <div> classes=flex flex-wrap items-center gap-2
- components/dialogs/AvatarDialogTabbedView.tsx:294 <div> classes=flex flex-wrap gap-1.5
- components/dialogs/AvatarDialogTabbedView.tsx:300 <div> classes=text-muted-foreground max-h-28 overflow-auto text-sm break-words whitespace-pre-wrap
- components/dialogs/AvatarDialogTabbedView.tsx:225 <div> classes=relative
- components/dialogs/AvatarDialogTabbedView.tsx:237 <FadeInImage> classes=size-full object-cover
- components/dialogs/AvatarDialogTabbedView.tsx:247 <span> classes=flex size-full items-center justify-center
- components/dialogs/AvatarDialogTabbedView.tsx:248 <PersonStandingIcon> classes=text-muted-foreground size-10
- components/dialogs/AvatarDialogTabbedView.tsx:252 <AvatarPlatformDots> classes=pointer-events-none absolute top-2 right-2
- components/dialogs/AvatarDialogTabbedView.tsx:504 <EntityDialogScaffold> classes=gap-3
- components/dialogs/AvatarOwnerEditDialogs.tsx:97 <FadeInImage> classes=mr-2.5 size-9 shrink-0 rounded-full object-cover
- components/dialogs/AvatarOwnerEditDialogs.tsx:104 <PersonStandingIcon> classes=text-muted-foreground
- components/dialogs/AvatarOwnerEditDialogs.tsx:110 <span> classes=min-w-0 flex-1 overflow-hidden
- components/dialogs/AvatarOwnerEditDialogs.tsx:111 <span> classes=block truncate leading-5 font-medium
- components/dialogs/AvatarOwnerEditDialogs.tsx:114 <span> classes=text-muted-foreground block truncate text-xs
- components/dialogs/AvatarOwnerEditDialogs.tsx:117 <span> classes=text-muted-foreground block truncate text-xs
- components/dialogs/AvatarOwnerEditDialogs.tsx:306 <DialogContent> classes=sm:max-w-[min(92vw,49rem)]
- components/dialogs/AvatarOwnerEditDialogs.tsx:322 <FieldGroup> classes=grid gap-2 sm:grid-cols-2
- components/dialogs/AvatarOwnerEditDialogs.tsx:350 <FieldLabel> classes=sr-only
- components/dialogs/AvatarOwnerEditDialogs.tsx:367 <div> classes=flex items-center gap-2
- components/dialogs/AvatarOwnerEditDialogs.tsx:378 <span> classes=text-muted-foreground text-sm
- components/dialogs/AvatarOwnerEditDialogs.tsx:382 <Spinner> classes=text-muted-foreground
- components/dialogs/AvatarOwnerEditDialogs.tsx:385 <div> classes=flex max-h-72 min-h-16 flex-wrap items-start overflow-auto p-1
- components/dialogs/BoopEmojiDialog.tsx:215 <CheckIcon> classes=size-3
- components/dialogs/BoopEmojiDialog.tsx:236 <ImageIcon> classes=text-muted-foreground size-8
- components/dialogs/BoopEmojiDialog.tsx:244 <span> classes=w-full truncate text-xs font-medium
- components/dialogs/BoopEmojiDialog.tsx:271 <TabsContent> classes=bg-muted/20 max-h-[48vh] min-h-0 overflow-y-auto rounded-xl border p-2

## 多规则命中且属性有不同值样例（最多 50）

- components/data-table/DataTableView.tsx:499 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/date-time-range-picker/DateTimeRangePicker.tsx:85 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/date-time-range-picker/DateTimeRangePicker.tsx:103 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/AvatarDetailsDialog.tsx:338 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/AvatarDetailsDialog.tsx:385 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/BoopEmojiDialog.tsx:399 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/BoopEmojiDialog.tsx:406 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/BoopEmojiDialog.tsx:413 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/BoopEmojiDialog.tsx:420 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/EntityDialogScaffold.tsx:164 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/InviteMessageDialog.tsx:169 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/UserActivityPanelImpl.tsx:254 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/avatar-dialog/components/AvatarDialogPerformanceTab.tsx:318 <TabsTab> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/group-dialog/GroupModerationTabPanel.tsx:232 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/group-dialog/GroupModerationTabPanel.tsx:264 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/group-dialog/GroupModerationWorkspace.tsx:224 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/group-dialog/GroupRowList.tsx:302 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/previous-instances-table/PreviousInstancesListTable.tsx:206 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/user-dialog/components/UserActivityPanelSections.tsx:96 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/user-dialog/components/UserActivityPanelSections.tsx:130 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:171 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:261 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:293 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:426 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:462 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/user-dialog/components/UserDialogFavoriteWorldGroups.tsx:125 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/user-dialog/components/UserDialogGroupsTab.tsx:100 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/user-dialog/components/UserDialogProfileDecorationsPanel.tsx:120 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:325 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:368 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:371 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:393 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:426 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:481 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:527 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:694 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:727 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:812 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/hosts/system-dialogs/ChangelogDialog.tsx:258 <TabsTrigger> font-family: "WD Pixel CJK", var(--vrcx-app-font-family,sy… / inherit — runtime: 
[data-slot="tabs-tab"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- components/hosts/system-dialogs/RegistryBackupDialog.tsx:328 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/hosts/system-dialogs/UpdaterDialog.tsx:321 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/hosts/system-dialogs/VRChatConfigDialog.tsx:180 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/hosts/tools-dialogs/LlmEndpointsDialog.tsx:453 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/hosts/tools-dialogs/presence-automation/ContextRulesTab.tsx:230 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/hosts/tools-dialogs/presence-automation/ContextRulesTab.tsx:270 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/hosts/tools-dialogs/presence-automation/InviteRulesTab.tsx:132 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/hosts/tools-dialogs/presence-automation/PresenceRuleActionFields.tsx:82 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:238 <SelectTrigger> border-radius: 2px / 0 — runtime:  [data-slot="select-trigger"] | body-typography: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono) | form-controls-r9: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- components/layout/AppTitleBar.tsx:90 <header> background-color: var(--wd-title) / var(--r8-frame) — runtime: .vrcx-0-titlebar | window-chrome: .vrcx-0-titlebar[data-app-titlebar] | chrome-r8: .vrcx-0-titlebar[data-app-titlebar]
- components/layout/MacOverlayTitleBar.tsx:31 <header> background-color: var(--wd-title) / var(--r8-frame) — runtime: .vrcx-0-titlebar | window-chrome: .vrcx-0-titlebar[data-app-titlebar] | chrome-r8: .vrcx-0-titlebar[data-app-titlebar]

## 完全相同选择器的重复声明（最多 50）

- i.x-user-status [base] border-radius: 0; popups-r9, avatars-status-r9; 0 matched sites
- :is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"][data-slot="input-group"] [base] border-color: #6c5ce0 / var(--jk-field-edge); browse-history-r9; 0 matched sites

## 伪元素重叠与冲突候选（最多 50）


## 重复声明高频样例（最多 50）

- border-radius: 2px; 3 selectors / 841 sites
- border-radius: 0; 26 selectors / 476 sites
- outline: 2px solid #ff7fcf; 7 selectors / 331 sites
- color: #f2ebff; 8 selectors / 298 sites
- border-color: var(--jk-field-edge); 3 selectors / 284 sites
- box-shadow: var(--jk-field-inset); 3 selectors / 284 sites
- appearance: none; 4 selectors / 136 sites
- border: 1px solid #6c5ce0; 8 selectors / 121 sites
- border: 1px solid #16112a; 3 selectors / 121 sites
- height: 22px; 2 selectors / 120 sites
- background: #211a33; 8 selectors / 63 sites
- color: #16112a; 4 selectors / 48 sites
- background-color: #ffb8e6; 2 selectors / 46 sites
- font-family: "WD Pixel CJK", var(--vrcx-app-font-family,system-ui),sans-serif; 4 selectors / 31 sites
- font-size: 12px; 4 selectors / 31 sites
- font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace); 3 selectors / 20 sites
- box-shadow: inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e; 5 selectors / 12 sites
- color: var(--r8-ink); 4 selectors / 11 sites
- box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d; 2 selectors / 4 sites
- background-color: var(--wd-title); 2 selectors / 4 sites
- background-image: none; 2 selectors / 4 sites
- font-family: var(--wd-body-font-family); 3 selectors / 3 sites
- box-shadow: none; 3 selectors / 3 sites
- border: 1px solid var(--wd-frame); 3 selectors / 3 sites
- color: var(--wd-text); 2 selectors / 2 sites
- box-shadow: var(--jk-button-bevel); 2 selectors / 2 sites
- outline: 2px solid #16112a; 2 selectors / 2 sites
- width: 20px; 2 selectors / 2 sites
- height: 20px; 2 selectors / 2 sites
- border: 0; 2 selectors / 2 sites
- background-color: #cdb0e8; 2 selectors / 2 sites
- box-shadow: inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d; 2 selectors / 2 sites
- background-color: #e3cbf2; 2 selectors / 2 sites
- box-shadow: inset 2px 2px #7a3f6d,inset -2px -2px #fdf4ff; 2 selectors / 2 sites

## 同标签/slot 多风格候选（最多 50）

- native|div|: 12 fingerprints; 1649× app/router.tsx:42; 10× components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:292; 3× components/about/AboutDialog.tsx:228
- native|span|: 6 fingerprints; 963× components/ProfileDecorations.tsx:51; 18× components/dialogs/EntityDialogScaffold.tsx:484; 12× components/layout/status-bar/StatusBarFooter.tsx:391
- primitive-use|Button|button: 5 fingerprints; 744× app/router.tsx:43; 6× components/layout/status-bar/StatusBarFooter.tsx:684; 1× components/sidebar/SidePanel.tsx:641
- primitive-use|Input|input: 3 fingerprints; 65× components/dialogs/AvatarDetailsDialog.tsx:292; 7× components/hosts/tools-dialogs/AppLauncherDialog.tsx:762; 3× components/dialogs/user-dialog/components/UserDialogProfileBackgroundPicker.tsx:40
- native|p|: 2 fingerprints; 89× components/about/AboutDialog.tsx:174; 2× components/hosts/system-dialogs/DataDirMigrationDialog.tsx:162
- native|span|img: 2 fingerprints; 6× components/affinity/AffinityBadge.tsx:37; 1× components/feed/FeedStatusBadge.tsx:17
- component|DataTableCell|: 2 fingerprints; 23× components/data-table/DataTableView.tsx:405; 3× components/dialogs/invite-message/InviteMessagePanel.tsx:441
- primitive-use|SelectTrigger|select-trigger: 2 fingerprints; 83× components/data-table/DataTableView.tsx:499; 1× components/layout/status-bar/StatusBarFooter.tsx:727
- primitive-use|Textarea|textarea: 2 fingerprints; 24× components/dialogs/AvatarDetailsDialog.tsx:303; 5× components/dialogs/group-dialog/GroupModerationLogsExportDialog.tsx:89
- primitive-use|TabsTrigger|tabs-tab: 2 fingerprints; 24× components/dialogs/BoopEmojiDialog.tsx:399; 1× components/sidebar/SidePanel.tsx:507
- primitive-use|InputGroupInput|input-group-control: 2 fingerprints; 14× components/dialogs/ProfileDetailsFields.tsx:182; 1× components/dialogs/group-dialog/GroupProfileEditDialog.tsx:121
- component|ClockIcon|: 2 fingerprints; 7× components/dialogs/UserDialogTabbedView.tsx:520; 1× components/layout/status-bar/StatusBarFooter.tsx:690
- primitive-use|Badge|badge: 2 fingerprints; 101× components/dialogs/avatar-dialog/components/AvatarDialogHeaderBadges.tsx:21; 1× components/groups/GroupCard.tsx:77
- native|pre|: 2 fingerprints; 10× components/dialogs/group-dialog/GroupModerationBanImportDialog.tsx:249; 5× components/dialogs/group-dialog/GroupDialogTabPanels.tsx:338
- component|LocationWorld|: 2 fingerprints; 5× components/dialogs/group-dialog/GroupInstanceRows.tsx:253; 1× features/player-list/components/PlayerListViewParts.tsx:288
- component|InputGroupAddon|: 2 fingerprints; 2× components/layout/ToolbarControls.tsx:120; 1× components/dialogs/group-dialog/GroupProfileEditDialog.tsx:139
- native|h3|: 2 fingerprints; 7× components/dialogs/previous-instances-table/PreviousInstancesListTable.tsx:174; 3× components/hosts/tools-dialogs/ProfileBackupDialog.tsx:530
- native|h1|: 2 fingerprints; 2× components/hosts/system-dialogs/ChangelogDialog.tsx:59; 1× components/layout/PageScaffold.tsx:94
- native|h2|: 2 fingerprints; 5× components/hosts/system-dialogs/ChangelogDialog.tsx:64; 1× features/group-moderation/GroupModerationPage.tsx:219
- native|header|: 2 fingerprints; 2× components/layout/AppTitleBar.tsx:90; 1× features/activity/components/ActivityJourneyView.tsx:710
- component|StatusSegment|: 2 fingerprints; 5× components/layout/status-bar/StatusBarFooter.tsx:549; 2× components/layout/status-bar/StatusBarFooter.tsx:261
- native|aside|: 2 fingerprints; 1× components/sidebar/SidePanel.tsx:382; 1× features/dashboard/components/DashboardEditorWorkspace.tsx:391
- component|DialogPrimitive.Close|dialog-close: 2 fingerprints; 1× ui/shadcn/dialog.tsx:39; 1× ui/shadcn/dialog.tsx:81
- native|div|sidebar: 2 fingerprints; 1× ui/shadcn/sidebar.tsx:198; 1× ui/shadcn/sidebar.tsx:245
