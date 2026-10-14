# Jirai CSS 样式代码归组

- CSS qualified-rule 声明块：1198；拆分后的 selector 规则：1335
- 按有序的 property/value/!important 声明序列去重：934 组；候选命中元素的 141 组；暂无源码候选的 793 组。
- 源码元素记录：6849；有主题候选 1572；“未覆盖” 5277（静态 class 无直接候选 4595，动态 class / primitive 不确定 682）。

> 归组键是 Jirai CSS 规则块中的有序声明序列（含 !important），不看 selector、section、伪类/媒体条件，也不按最终 computed style 聚类。同一声明代码即使处于不同 selector/context、导致最终计算外观不同，也归为同一组。一个源码元素可以命中多个组。这里只是 TSX/JSX + CSS selector 的静态候选，不等价于运行时级联证明；“未覆盖”表示没有直接候选命中，不排除继承、动态分支或 tokens 等间接影响。@font-face、keyframes 等 at-rule 不纳入声明组。

## 未覆盖

共 5277 个源码元素记录没有直接 selector 候选；静态 class 无直接候选 4595，不确定 682。按 JSX tag：div 1719、span 1003、Badge 101、p 96、Spinner 86、DialogContent 71、FadeInImage 66、Skeleton 52、DropdownMenuContent 40、Icon 35、Trash2Icon 35、FieldGroup 34、UserIcon 32、XIcon 32、TabsContent 31。

样例：
- app/router.tsx:42 <div> kind=native classes=text-muted-foreground flex h-full min-h-0 flex-col items-center justify-center gap-3 text-sm
- app/routes.tsx:9 <Spinner> kind=component classes=size-4
- components/IndeterminateProgress.tsx:11 <Progress> kind=primitive-use slot=progress classes=indeterminate-progress [dynamic]
- components/ProfileDecorations.tsx:51 <span> kind=native classes=pointer-events-none block [dynamic]
- components/ProfileDecorations.tsx:55 <FadeInImage> kind=component classes=size-full [dynamic]
- components/ProfileDecorations.tsx:64 <FadeInImage> kind=component classes=absolute inset-0 size-full [dynamic]
- components/ProfileDecorations.tsx:121 <DecorationImage> kind=component classes=absolute -inset-[18.75%] z-5
- components/ProfileDecorations.tsx:139 <DecorationImage> kind=component classes=absolute inset-x-0 top-0 z-20 aspect-[4/5]
- components/ProfileDecorations.tsx:166 <span> kind=native classes=pointer-events-none absolute inset-y-0.5 right-0 -z-10 w-2/3 overflow-hidden rounded-[inherit] [mask-image:linear-gradient(to_left,black,rgb(0_0_0/0.7)_25%,rgb(0_0_0/0.3)_55%,rgb(0_0_0/0.08)_80%,transparent)] transition-opacity duration-200 opacity-100 opacity-50 [dynamic]
- components/ProfileDecorations.tsx:180 <DecorationImage> kind=component classes=absolute inset-0
- components/UserDetailTile.tsx:34 <span> kind=native classes=min-w-0 flex-1 overflow-hidden
- components/UserDetailTile.tsx:35 <span> kind=native classes=block truncate leading-5 font-medium
- components/UserDetailTile.tsx:40 <span> kind=native classes=flex min-w-0 items-center gap-1
- components/UserDetailTile.tsx:42 <span> kind=native classes=min-w-0 truncate
- components/UserDetailTile.tsx:51 <span> kind=native classes=text-content-secondary block truncate text-xs
- components/UserStatusAvatar.tsx:20 <span> kind=native classes=relative flex size-9 shrink-0 items-center justify-center overflow-visible [dynamic]
- components/UserStatusAvatar.tsx:26 <span> kind=native classes=bg-muted relative z-0 flex size-full items-center justify-center overflow-hidden rounded-full border
- components/UserStatusAvatar.tsx:28 <FadeInImage> kind=component classes=size-full object-cover
- components/UserStatusAvatar.tsx:33 <UserIcon> kind=component classes=text-muted-foreground
- components/UserStatusAvatar.tsx:40 <UserIcon> kind=component classes=text-muted-foreground
- components/UserStatusAvatar.tsx:47 <UserStatusDot> kind=component classes=absolute -right-0.5 -bottom-0.5 z-10 size-3.75
- components/UserStatusDot.tsx:28 <span> kind=native classes=rounded-full border-2 [dynamic]
- components/UserStatusDot.tsx:49 <span> kind=native classes=absolute inset-0 rounded-full border-2 [dynamic]
- components/UserStatusDot.tsx:60 <span> kind=native classes=border-background rounded-full border-3 [dynamic]
- components/about/AboutDialog.tsx:108 <Skeleton> kind=component classes=absolute inset-0 rounded-full transition-opacity duration-150 animate-none opacity-0 [dynamic]
- components/about/AboutDialog.tsx:115 <Avatar> kind=component classes=size-11 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-200 ease-out motion-reduce:animate-none invisible [dynamic]
- components/about/AboutDialog.tsx:164 <Skeleton> kind=component classes=size-11 rounded-full mt-1.5 [dynamic]
- components/about/AboutDialog.tsx:174 <p> kind=native classes=text-muted-foreground self-center text-xs
- components/about/AboutDialog.tsx:214 <DialogContent> kind=component classes=gap-0 px-7 pt-8 pb-6 sm:max-w-[560px]
- components/about/AboutDialog.tsx:218 <div> kind=native classes=flex flex-col items-center text-center
- components/about/AboutDialog.tsx:219 <DialogTitle> kind=component classes=text-4xl leading-none font-medium tracking-normal select-none
- components/about/AboutDialog.tsx:225 <DialogDescription> kind=component classes=mt-3 text-[13px]
- components/about/AboutDialog.tsx:229 <span> kind=native classes=text-foreground/80 font-medium tabular-nums
- components/about/AboutDialog.tsx:234 <span> kind=native classes=bg-muted-foreground/35 size-1 rounded-full
- components/about/AboutDialog.tsx:244 <section> kind=native classes=mt-5 flex flex-col items-center gap-3.5 text-center
- components/about/AboutDialog.tsx:245 <span> kind=native classes=text-muted-foreground/75 text-[10px] font-medium tracking-[0.18em] uppercase
- components/about/AboutDialog.tsx:249 <p> kind=native classes=text-muted-foreground/70 mx-auto max-w-sm text-xs text-balance
- components/about/AboutDialog.tsx:254 <div> kind=native classes=mt-6 flex flex-col items-center gap-3
- components/about/AboutDialog.tsx:255 <span> kind=native classes=text-muted-foreground/60 text-[10px] font-medium tracking-[0.16em] uppercase
- components/about/AboutDialog.tsx:278 <Icon> kind=component classes=(none)
- components/about/AboutDialog.tsx:286 <div> kind=native classes=mt-6 flex flex-wrap items-center justify-between gap-2 border-t pt-4
- components/affinity/AffinityBadge.tsx:23 <span> kind=native classes=size-4 shrink-0 [dynamic]
- components/affinity/AffinityBadge.tsx:37 <span> kind=native classes=inline-flex h-[18px] shrink-0 items-center gap-1 rounded-md px-1.5 text-[0.7rem] font-medium size-4 justify-center rounded-none bg-transparent p-0 text-amber-400 text-rose-300 [dynamic]
- components/affinity/AffinityBadge.tsx:51 <Icon> kind=component classes=size-3 shrink-0 fill-current [dynamic]
- components/avatars/AvatarPlatformDots.tsx:19 <div> kind=native classes=flex [dynamic]
- components/avatars/AvatarPlatformDots.tsx:21 <span> kind=native classes=bg-platform-pc [dynamic]
- components/avatars/AvatarPlatformDots.tsx:24 <span> kind=native classes=bg-platform-quest [dynamic]
- components/avatars/AvatarPlatformDots.tsx:27 <span> kind=native classes=bg-platform-ios [dynamic]
- components/data-table/DataTableSortButton.tsx:80 <span> kind=native classes=min-w-0 truncate [dynamic]
- components/data-table/DataTableSortButton.tsx:84 <ArrowUpIcon> kind=component classes=(none)
- components/data-table/DataTableSortButton.tsx:86 <ArrowDownIcon> kind=component classes=(none)
- components/data-table/DataTableSortButton.tsx:88 <ArrowUpDownIcon> kind=component classes=text-muted-foreground opacity-70
- components/data-table/DataTableSortButton.tsx:105 <span> kind=native classes=text-muted-foreground text-xs font-medium [dynamic]
- components/data-table/DataTableView.tsx:314 <div> kind=native classes=app-data-table vrcx-0-data-table min-h-0 min-w-0 flex-1 overflow-hidden [dynamic]
- components/data-table/DataTableView.tsx:383 <div> kind=native classes=h-full min-h-0 min-w-0 overflow-auto [&>[data-slot=table-container]]:min-w-full [&>[data-slot=table-container]]:overflow-visible [dynamic]
- components/data-table/DataTableView.tsx:405 <DataTableCell> kind=component classes=text-muted-foreground h-24 text-center [dynamic]
- components/data-table/DataTableView.tsx:480 <div> kind=native classes=text-content-tertiary flex flex-wrap items-center gap-2 text-xs tabular-nums [dynamic]
- components/data-table/DataTableView.tsx:489 <div> kind=native classes=flex items-center gap-2
- components/data-table/DataTableView.tsx:517 <Pagination> kind=component classes=mx-0 w-auto justify-start
- components/data-table/DataTableView.tsx:529 <ChevronLeftIcon> kind=component classes=(none)
- components/data-table/DataTableView.tsx:535 <div> kind=native classes=text-content-secondary mx-1 font-medium
- components/data-table/DataTableView.tsx:551 <ChevronRightIcon> kind=component classes=(none)
- components/data-table/DataTableView.tsx:556 <span> kind=native classes=sr-only
- components/data-table/DataTableView.tsx:627 <Table> kind=native classes=table-fixed
- components/data-table/ResizableTableParts.tsx:132 <div> kind=native classes=flex min-w-0 items-center gap-2 pr-2
- components/data-table/ResizableTableParts.tsx:133 <div> kind=native classes=flex min-w-0 flex-1 items-center gap-1.5
- components/data-table/ResizableTableParts.tsx:134 <div> kind=native classes=min-w-0
- components/data-table/ResizableTableParts.tsx:153 <GripVerticalIcon> kind=component classes=(none)
- components/data-table/ResizableTableParts.tsx:218 <TableHead> kind=component classes=group relative select-none [dynamic]
- components/data-table/ResizableTableParts.tsx:259 <TableHead> kind=component classes=group relative select-none z-20 opacity-60 [dynamic]
- components/data-table/ResizableTableParts.tsx:360 <TableCell> kind=component classes=relative z-10 opacity-60 [dynamic]
- components/data-table/TableColumnVisibilityMenu.tsx:105 <span> kind=native classes=min-w-0 flex-1 truncate
- components/data-table/TableColumnVisibilityMenu.tsx:163 <span> kind=native classes=min-w-0 flex-1 truncate
- components/data-table/VirtualHistoryList.tsx:116 <div> kind=native classes=vrcx-0-data-table relative flex min-h-0 flex-1 flex-col overflow-hidden
- components/data-table/VirtualHistoryList.tsx:117 <div> kind=native classes=shrink-0 overflow-hidden border-b bg-[var(--vrcx-0-table-header-surface)]
- components/data-table/VirtualHistoryList.tsx:131 <ArrowUpToLineIcon> kind=component classes=(none)
- components/data-table/VirtualHistoryList.tsx:135 <div> kind=native classes=min-h-0 flex-1 overflow-auto [overflow-anchor:none]
- components/data-table/VirtualHistoryList.tsx:159 <div> kind=native classes=relative
- components/data-table/VirtualHistoryList.tsx:164 <div> kind=native classes=absolute right-0 left-0 [dynamic]
- components/data-table/VirtualHistoryList.tsx:177 <div> kind=native classes=text-muted-foreground flex min-h-10 items-center justify-center px-3 py-2 text-sm

## Jirai 声明代码组

### JCSS-0315 — 1343 element records / 1343 source locations
- CSS blocks 1; sections body-typography; states base; targets host.
- Declaration code: `font-family: inherit`
- Selectors: :where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)
- Matched samples: app/router.tsx:43 <Button> slot=button; components/UserDetailTile.tsx:87 <Button> slot=button; components/about/AboutDialog.tsx:97 <button>; components/about/AboutDialog.tsx:268 <Button> slot=button

### JCSS-0271 — 840 element records / 840 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `border-radius: 2px`
- Selectors: [data-slot="button"] /  [data-slot="select-trigger"]
- Matched samples: app/router.tsx:43 <Button> slot=button; components/UserDetailTile.tsx:87 <Button> slot=button; components/about/AboutDialog.tsx:268 <Button> slot=button; components/about/AboutDialog.tsx:287 <Button> slot=button

### JCSS-0272 — 755 element records / 755 source locations
- CSS blocks 1; sections runtime; states focus-visible; targets host.
- Declaration code: `outline: 2px dashed var(--wd-pink); outline-offset: 2px`
- Selectors: [data-slot="button"]:focus-visible
- Matched samples: app/router.tsx:43 <Button> slot=button; components/UserDetailTile.tsx:87 <Button> slot=button; components/about/AboutDialog.tsx:268 <Button> slot=button; components/about/AboutDialog.tsx:287 <Button> slot=button

### JCSS-0337 — 179 element records / 179 source locations
- CSS blocks 15; sections settings, controls-r9, tools-ui-r9, form-controls-r9, fields-toolbar-r10, favorites-r9, buttons-badges-r10, portal-button-roles-b073-b100; states focus, focus-visible; targets host.
- Declaration code: `outline: 2px solid #ff7fcf; outline-offset: 1px`
- Selectors: [data-slot=number-field-group]:focus-within / [data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger]):focus-visible / .vrcx-0-main-content .vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > button[data-slot="dropdown-menu-trigger"][data-size="icon-xs"]:focus-visible / .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="button"][data-variant="default"]:focus-visible / .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="1"] [data-slot="button"][data-variant="default"]:focus-visible / … (15 selectors)
- Matched samples: components/data-table/DataTableView.tsx:491 <Select>; components/data-table/DataTableView.tsx:499 <SelectTrigger> slot=select-trigger; components/date-time-range-picker/DateTimeRangePicker.tsx:81 <Select>; components/date-time-range-picker/DateTimeRangePicker.tsx:85 <SelectTrigger> slot=select-trigger

### JCSS-0626 — 177 element records / 177 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `border-radius: 0 !important; border-color: var(--jk-field-edge) !important; background-color: #211a33 !important; color: #f2ebff !important; box-shadow: var(--jk-field-inset) !important`
- Selectors: :where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])
- Matched samples: components/data-table/DataTableView.tsx:491 <Select>; components/data-table/DataTableView.tsx:499 <SelectTrigger> slot=select-trigger; components/date-time-range-picker/DateTimeRangePicker.tsx:81 <Select>; components/date-time-range-picker/DateTimeRangePicker.tsx:85 <SelectTrigger> slot=select-trigger

### JCSS-0365 — 119 element records / 119 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `width: 46px; height: 22px; border: 1px solid #16112a; border-radius: 0; background: #120d22; box-shadow: inset 1px 1px #000,inset -1px -1px #8f7fe0; … (7 declarations)`
- Selectors: [data-slot=switch]
- Matched samples: components/dialogs/user-dialog/components/UserActivityPanelSections.tsx:74 <Switch> slot=switch; components/hosts/system-dialogs/RegistryBackupDialog.tsx:294 <Switch> slot=switch; components/hosts/system-dialogs/RegistryBackupDialog.tsx:309 <Switch> slot=switch; components/hosts/tools-dialogs/AppLauncherDialog.tsx:456 <Switch> slot=switch

### JCSS-0367 — 119 element records / 119 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; top: 7px; right: 6px; width: 12px; height: 5px; … (8 declarations)`
- Selectors: [data-slot=switch]::before
- Matched samples: components/dialogs/user-dialog/components/UserActivityPanelSections.tsx:74 <Switch> slot=switch; components/hosts/system-dialogs/RegistryBackupDialog.tsx:294 <Switch> slot=switch; components/hosts/system-dialogs/RegistryBackupDialog.tsx:309 <Switch> slot=switch; components/hosts/tools-dialogs/AppLauncherDialog.tsx:456 <Switch> slot=switch

### JCSS-0376 — 119 element records / 119 source locations
- CSS blocks 1; sections pixel-controls; states focus-visible; targets host.
- Declaration code: `outline: 2px solid #ffb8e6; outline-offset: 2px`
- Selectors: [data-slot=switch]:focus-visible
- Matched samples: components/dialogs/user-dialog/components/UserActivityPanelSections.tsx:74 <Switch> slot=switch; components/hosts/system-dialogs/RegistryBackupDialog.tsx:294 <Switch> slot=switch; components/hosts/system-dialogs/RegistryBackupDialog.tsx:309 <Switch> slot=switch; components/hosts/tools-dialogs/AppLauncherDialog.tsx:456 <Switch> slot=switch

### JCSS-0658 — 107 element records / 107 source locations
- CSS blocks 2; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border-radius: 0; border-color: var(--jk-field-edge); box-shadow: var(--jk-field-inset)`
- Selectors: :where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"])) / :where([data-slot="input-group"]:not(#chart [data-vrcx-0-control="toolbar"][data-slot="input-group"]))
- Matched samples: components/dialogs/AvatarDetailsDialog.tsx:292 <Input> slot=input; components/dialogs/AvatarDetailsDialog.tsx:303 <Textarea> slot=textarea; components/dialogs/AvatarDetailsDialog.tsx:414 <Textarea> slot=textarea; components/dialogs/AvatarDialogContent.tsx:142 <Input> slot=input

### JCSS-0593 — 106 element records / 106 source locations
- CSS blocks 5; sections tools-ui-r9, fields-toolbar-r10, browse-history-r9; states base; targets ::placeholder.
- Declaration code: `color: #b9add9; opacity: 1`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-slot="input-group-control"]::placeholder / .vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *) [data-slot="input-group-control"]::placeholder / :where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"]))::placeholder / .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="combobox-chip-input"]::placeholder / :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"][data-slot="input-group"]) [data-slot="input-group-control"]::placeholder
- Matched samples: components/dialogs/AvatarDetailsDialog.tsx:292 <Input> slot=input; components/dialogs/AvatarDetailsDialog.tsx:303 <Textarea> slot=textarea; components/dialogs/AvatarDetailsDialog.tsx:414 <Textarea> slot=textarea; components/dialogs/AvatarDialogContent.tsx:142 <Input> slot=input

### JCSS-0648 — 106 element records / 106 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; background-color: #16112a; color: #f2ebff`
- Selectors: :where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"]))
- Matched samples: components/dialogs/AvatarDetailsDialog.tsx:292 <Input> slot=input; components/dialogs/AvatarDetailsDialog.tsx:303 <Textarea> slot=textarea; components/dialogs/AvatarDetailsDialog.tsx:414 <Textarea> slot=textarea; components/dialogs/AvatarDialogContent.tsx:142 <Input> slot=input

### JCSS-0649 — 106 element records / 106 source locations
- CSS blocks 1; sections fields-toolbar-r10; states disabled; targets host.
- Declaration code: `color: #b9add9; opacity: .65`
- Selectors: :where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"]):is(:disabled,[aria-disabled="true"]))
- Matched samples: components/dialogs/AvatarDetailsDialog.tsx:292 <Input> slot=input; components/dialogs/AvatarDetailsDialog.tsx:303 <Textarea> slot=textarea; components/dialogs/AvatarDetailsDialog.tsx:414 <Textarea> slot=textarea; components/dialogs/AvatarDialogContent.tsx:142 <Input> slot=input

### JCSS-0659 — 106 element records / 106 source locations
- CSS blocks 3; sections fields-toolbar-r10, browse-history-r9; states focus-visible, base; targets host.
- Declaration code: `border-color: #ff7fcf; outline: 2px solid #ff7fcf; outline-offset: 1px`
- Selectors: :where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"]):focus-visible) / :where([data-slot="input-otp-slot"]:is([data-active="true"],[data-focused])) / :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row):has(.object-row__pressable:focus-visible) / :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row):has(.object-row__context-action:focus-visible)
- Matched samples: components/dialogs/AvatarDetailsDialog.tsx:292 <Input> slot=input; components/dialogs/AvatarDetailsDialog.tsx:303 <Textarea> slot=textarea; components/dialogs/AvatarDetailsDialog.tsx:414 <Textarea> slot=textarea; components/dialogs/AvatarDialogContent.tsx:142 <Input> slot=input

### JCSS-0628 — 89 element records / 89 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `appearance: none; -webkit-appearance: none; background-image: var(--wd-native-chevron); background-repeat: no-repeat; background-position: right 8px center; background-size: 12px 12px; … (7 declarations)`
- Selectors: :where(select)
- Matched samples: components/data-table/DataTableView.tsx:491 <Select>; components/date-time-range-picker/DateTimeRangePicker.tsx:81 <Select>; components/date-time-range-picker/DateTimeRangePicker.tsx:99 <Select>; components/dialogs/AvatarDetailsDialog.tsx:319 <Select>

### JCSS-0317 — 67 element records / 67 source locations
- CSS blocks 1; sections body-typography; states base; targets host.
- Declaration code: `font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)`
- Selectors: .font-mono / 
:where(code, samp) / 
pre:not(.font-sans):not(.font-heading) / 
.entity-json-view
- Matched samples: components/dialogs/EntityDialogScaffold.tsx:484 <span>; components/dialogs/EntityDialogScaffold.tsx:572 <span>; components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:292 <div>; components/dialogs/group-dialog/GroupModerationBanImportDialog.tsx:249 <pre>

### JCSS-0540 — 46 element records / 46 source locations
- CSS blocks 6; sections user-dialog-r9, form-controls-r9, buttons-badges-r10, portal-button-roles-b073-b100; states focus-visible; targets host.
- Declaration code: `outline: 2px solid #ff7fcf; outline-offset: 2px`
- Selectors: .entity-dialog .flex.flex-wrap.gap-1\.5 > [data-slot="button"][data-variant="ghost"][data-size="icon-xs"][title]:focus-visible / :where(
  :is([data-slot="checkbox"],input[type="checkbox"]):focus-visible,
  :is([role="radio"],input[type="radio"]):focus-visible,
  input[type="range"]:not(.entity-dialog *):focus-visible,
  [data-slot="slider"]:focus-visible [data-slot="slider-thumb"]
) / :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant]:focus-visible:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) / :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant]:focus-visible / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))):focus-visible / … (6 selectors)
- Matched samples: components/dialogs/AvatarOwnerEditDialogs.tsx:122 <Checkbox> slot=checkbox; components/dialogs/AvatarOwnerEditDialogs.tsx:331 <Checkbox> slot=checkbox; components/dialogs/WorldOwnerEditDialogs.tsx:466 <Checkbox> slot=checkbox; components/dialogs/WorldOwnerEditDialogs.tsx:481 <Checkbox> slot=checkbox

### JCSS-0611 — 45 element records / 45 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `appearance: none; -webkit-appearance: none; position: relative; width: 14px; height: 14px; min-width: 14px; … (14 declarations)`
- Selectors: :where(:is([data-slot="checkbox"],input[type="checkbox"]))
- Matched samples: components/dialogs/AvatarOwnerEditDialogs.tsx:122 <Checkbox> slot=checkbox; components/dialogs/AvatarOwnerEditDialogs.tsx:331 <Checkbox> slot=checkbox; components/dialogs/WorldOwnerEditDialogs.tsx:466 <Checkbox> slot=checkbox; components/dialogs/WorldOwnerEditDialogs.tsx:481 <Checkbox> slot=checkbox

### JCSS-0612 — 45 element records / 45 source locations
- CSS blocks 2; sections form-controls-r9; states checked; targets host.
- Declaration code: `border-color: #6c5ce0; background-color: #ffb8e6; box-shadow: inset 1px 1px #fff0fa,inset -1px -1px #b15b9d`
- Selectors: :where(:is([data-slot="checkbox"],input[type="checkbox"]):is([data-checked],[aria-checked="true"],:checked)) / :where(:is([role="radio"],input[type="radio"]):is([data-checked],[aria-checked="true"],:checked))
- Matched samples: components/dialogs/AvatarOwnerEditDialogs.tsx:122 <Checkbox> slot=checkbox; components/dialogs/AvatarOwnerEditDialogs.tsx:331 <Checkbox> slot=checkbox; components/dialogs/WorldOwnerEditDialogs.tsx:466 <Checkbox> slot=checkbox; components/dialogs/WorldOwnerEditDialogs.tsx:481 <Checkbox> slot=checkbox

### JCSS-0251 — 34 element records / 34 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `font-family: "WD Pixel CJK", var(--vrcx-app-font-family,system-ui),sans-serif; font-synthesis: none; font-size: 12px`
- Selectors: .vrcx-0-titlebar /  .vrcx-0-statusbar / 
.vrcx-0-sidebar-surface [data-slot="sidebar-menu-button"] / 
.vrcx-0-sidebar-surface [data-slot="sidebar-group-label"] / 
.vrcx-0-table-header / … (7 selectors)
- Matched samples: components/dialogs/BoopEmojiDialog.tsx:399 <TabsTrigger> slot=tabs-tab; components/dialogs/BoopEmojiDialog.tsx:406 <TabsTrigger> slot=tabs-tab; components/dialogs/BoopEmojiDialog.tsx:413 <TabsTrigger> slot=tabs-tab; components/dialogs/BoopEmojiDialog.tsx:420 <TabsTrigger> slot=tabs-tab

### JCSS-0608 — 33 element records / 33 source locations
- CSS blocks 2; sections loader-r9, loader-r97; states base; targets host.
- Declaration code: `flex-direction: column; gap: 10px`
- Selectors: .vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) / div.justify-center.gap-2:not([data-slot],.min-h-\[72px\]):has(>svg:is([data-slot=spinner],.animate-spin))
- Matched samples: app/routes.tsx:8 <div>; components/about/AboutDialog.tsx:161 <div>; components/about/AboutDialog.tsx:228 <div>; components/about/AboutDialog.tsx:261 <div>

### JCSS-0470 — 24 element records / 24 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `color: var(--r8-ink)`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] :is(
    [class*='text-content-'],
    [class*='text-muted-foreground']
)
- Matched samples: components/layout/status-bar/StatusBarFooter.tsx:391 <span>; components/layout/status-bar/StatusBarFooter.tsx:403 <span>; components/layout/status-bar/StatusBarFooter.tsx:421 <span>; components/layout/status-bar/StatusBarFooter.tsx:439 <div>

### JCSS-0314 — 22 element records / 22 source locations
- CSS blocks 2; sections body-typography; states base; targets host.
- Declaration code: `font-family: var(--wd-body-font-family)`
- Selectors: html / 
body / .font-sans:not(kbd):not(.font-mono) / 
.font-heading:not(kbd):not(.font-mono)
- Matched samples: components/about/AboutDialog.tsx:228 <div>; components/dialogs/ProfileMediaPanel.tsx:159 <div>; components/dialogs/group-dialog/GroupDialogTabPanels.tsx:338 <pre>; components/dialogs/group-dialog/GroupDialogTabPanels.tsx:361 <pre>

### JCSS-0294 — 13 element records / 13 source locations
- CSS blocks 9; sections runtime, popups-r9, dialogs-r9, overlays-r10, favorites-r9; states base; targets host, ::before, ::after.
- Declaration code: `animation: none !important; transition: none !important`
- Selectors: .vrcx-0-app-root * /  .vrcx-0-app-root *::before /  .vrcx-0-app-root *::after / :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar-image"] / :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) / … (17 selectors)
- Matched samples: app/router.tsx:211 <div>; app/router.tsx:216 <div>; ui/shadcn/combobox.tsx:110 <ComboboxPrimitive.Popup> slot=combobox-content; ui/shadcn/context-menu.tsx:84 <ContextMenuPrimitive.Popup> slot=context-menu-content

### JCSS-0573 — 9 element records / 9 source locations
- CSS blocks 2; sections popups-r9; states base; targets host.
- Declaration code: `--radius: 0px; background: #211a33 !important; color: #f2ebff; opacity: 1; border: 1px solid #6c5ce0; border-radius: 0 !important; … (10 declarations)`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) / :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"])
- Matched samples: ui/shadcn/combobox.tsx:110 <ComboboxPrimitive.Popup> slot=combobox-content; ui/shadcn/context-menu.tsx:84 <ContextMenuPrimitive.Popup> slot=context-menu-content; ui/shadcn/context-menu.tsx:149 <ContextMenuContent> slot=context-menu-sub-content; ui/shadcn/dropdown-menu.tsx:58 <DropdownMenuPrimitive.Popup> slot=dropdown-menu-content

### JCSS-0001 — 8 element records / 8 source locations
- CSS blocks 1; sections tokens; states base; targets host.
- Declaration code: `--background: #16112a; --foreground: #f2ebff; --card: #201936; --card-foreground: #f2ebff; --popover: #2a2147; --popover-foreground: #f2ebff; … (81 declarations)`
- Selectors: :root / 
:root.dark / 
.dark
- Matched samples: ui/shadcn/combobox.tsx:110 <ComboboxPrimitive.Popup> slot=combobox-content; ui/shadcn/context-menu.tsx:84 <ContextMenuPrimitive.Popup> slot=context-menu-content; ui/shadcn/context-menu.tsx:149 <ContextMenuContent> slot=context-menu-sub-content; ui/shadcn/dropdown-menu.tsx:58 <DropdownMenuPrimitive.Popup> slot=dropdown-menu-content

### JCSS-0416 — 7 element records / 7 source locations
- CSS blocks 9; sections motion, motion-r7, motion-r8, badge-r9, form-controls-r9, loader-r97; states base, hover; targets ::after, host, ::before.
- Declaration code: `animation: none !important`
- Selectors: .vrcx-0-sidebar-surface::after / 
 
 [data-slot="progress-indicator"] / [data-slot="spinner"] / [data-slot="dialog-content"][data-open] / [data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after / … (16 selectors)
- Matched samples: components/layout/status-bar/StatusBarFooter.tsx:351 <footer>; components/layout/status-bar/StatusBarFooter.tsx:369 <footer>; ui/shadcn/progress.tsx:44 <ProgressPrimitive.Indicator> slot=progress-indicator; ui/shadcn/sidebar.tsx:198 <div> slot=sidebar

### JCSS-0472 — 7 element records / 7 source locations
- CSS blocks 1; sections chrome-r8; states hover, base; targets host.
- Declaration code: `background-color: var(--r8-hover); color: var(--r8-ink)`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] :is(button, [data-slot='button']):hover / 
.vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] :is(button, [data-slot='button'])[aria-expanded='true']
- Matched samples: components/layout/status-bar/StatusBarFooter.tsx:684 <Button> slot=button; components/layout/status-bar/StatusBarFooter.tsx:727 <SelectTrigger> slot=select-trigger; components/layout/status-bar/StatusBarFooter.tsx:769 <Button> slot=button; components/layout/status-bar/StatusBarFooter.tsx:801 <Button> slot=button

### JCSS-0670 — 7 element records / 7 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets ::file-selector-button.
- Declaration code: `appearance: none; -webkit-appearance: none; font: inherit; padding: 3px 8px; margin-right: 8px; border: 1px solid #6c5ce0; … (10 declarations)`
- Selectors: :where(input[type="file"])::file-selector-button
- Matched samples: components/dialogs/AvatarDialogContent.tsx:142 <Input> slot=input; components/dialogs/AvatarDialogContent.tsx:149 <Input> slot=input; components/dialogs/WorldDialogContentWorkflow.tsx:477 <Input> slot=input; components/dialogs/invite-message/InviteMessagePanel.tsx:350 <Input> slot=input

### JCSS-0575 — 6 element records / 6 source locations
- CSS blocks 1; sections popups-r9; states base; targets ::before.
- Declaration code: `backdrop-filter: none; border-radius: 0`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="select-content"],[data-slot="combobox-content"])::before
- Matched samples: ui/shadcn/combobox.tsx:110 <ComboboxPrimitive.Popup> slot=combobox-content; ui/shadcn/context-menu.tsx:84 <ContextMenuPrimitive.Popup> slot=context-menu-content; ui/shadcn/context-menu.tsx:149 <ContextMenuContent> slot=context-menu-sub-content; ui/shadcn/dropdown-menu.tsx:58 <DropdownMenuPrimitive.Popup> slot=dropdown-menu-content

### JCSS-0274 — 4 element records / 4 source locations
- CSS blocks 6; sections runtime, motion, motion-r8, nav-phone-r10; states base; targets host.
- Declaration code: `position: relative`
- Selectors: .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"] / .vrcx-0-side-panel / .vrcx-0-sidebar-surface / .vrcx-0-sidebar-surface [data-sidebar='menu-button'][data-active] / .vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0'] / … (6 selectors)
- Matched samples: components/sidebar/SidePanel.tsx:382 <aside>; ui/shadcn/sidebar.tsx:198 <div> slot=sidebar; ui/shadcn/sidebar.tsx:215 <SheetContent> slot=sidebar; ui/shadcn/sidebar.tsx:285 <div> slot=sidebar-inner

### JCSS-0318 — 4 element records / 4 source locations
- CSS blocks 1; sections body-typography; states base; targets host.
- Declaration code: `font-family: var(--vrcx-app-font-family, system-ui), sans-serif`
- Selectors: kbd:not(.font-mono)
- Matched samples: components/keyboard/KeyboardShortcut.tsx:65 <Kbd> slot=kbd; features/feed/components/FeedSearchBox.tsx:226 <Kbd> slot=kbd; ui/shadcn/kbd.tsx:5 <kbd> slot=kbd; ui/shadcn/kbd.tsx:18 <kbd> slot=kbd-group

### JCSS-0005 — 3 element records / 3 source locations
- CSS blocks 21; sections icons, runtime, settings, pixel-controls, motion, navigation-r7, cat-r8-final, controls-r9, popups-r9, tools-ui-r9, loader-r9, form-controls-r9, overlays-r10, browse-history-r9, buttons-badges-r10; states base; targets host, ::after, ::before, ::-webkit-scrollbar-button.
- Declaration code: `display: none`
- Selectors: svg.lucide:is(.lucide-activity,.lucide-app-window,.lucide-apple,.lucide-archive-restore,.lucide-archive,.lucide-arrow-down-to-line,.lucide-arrow-down,.lucide-arrow-left-from-line,.lucide-arrow-left-right,.lucide-arrow-left,.lucide-arrow-right-to-line,.lucide-arrow-right,.lucide-arrow-up-down,.lucide-arrow-up-right,.lucide-arrow-up-to-line,.lucide-arrow-up,.lucide-badge-check,.lucide-ban,.lucide-bell-off,.lucide-bell,.lucide-book-open,.lucide-bookmark,.lucide-bot,.lucide-box,.lucide-boxes,.lucide-brush,.lucide-bug,.lucide-calendar-clock,.lucide-calendar-days,.lucide-calendar-range,.lucide-calendar,.lucide-camera,.lucide-case-sensitive,.lucide-chart-bar,.lucide-check-check,.lucide-check,.lucide-chevron-down,.lucide-chevron-left,.lucide-chevron-right,.lucide-chevron-up,.lucide-chevrons-down-up,.lucide-chevrons-down,.lucide-chevrons-up-down,.lucide-circle-alert,.lucide-circle-check-big,.lucide-circle-check,.lucide-circle-dashed,.lucide-circle-minus,.lucide-circle-question-mark,.lucide-circle-x,.lucide-circle,.lucide-clipboard-copy,.lucide-clock-3,.lucide-clock,.lucide-cloud-off,.lucide-cloud,.lucide-code-xml,.lucide-code,.lucide-coffee,.lucide-columns-3,.lucide-compass,.lucide-contact-round,.lucide-contact,.lucide-copy,.lucide-crown,.lucide-cuboid,.lucide-database-backup,.lucide-database,.lucide-dices,.lucide-door-open,.lucide-download,.lucide-earth,.lucide-ellipsis-vertical,.lucide-ellipsis,.lucide-eraser,.lucide-external-link,.lucide-eye-off,.lucide-eye,.lucide-face-slightly-smiling,.lucide-file-archive,.lucide-file-search,.lucide-file-text,.lucide-flag,.lucide-flask-conical,.lucide-folder-heart,.lucide-folder-open,.lucide-folder-plus,.lucide-folder-search,.lucide-folder-tree,.lucide-folder,.lucide-footprints,.lucide-gamepad-2,.lucide-gauge,.lucide-gem,.lucide-gift,.lucide-globe,.lucide-grip-vertical,.lucide-hand,.lucide-hard-drive,.lucide-hash,.lucide-heart,.lucide-house,.lucide-id-card,.lucide-image-off,.lucide-image,.lucide-images,.lucide-inbox,.lucide-info,.lucide-key-round,.lucide-keyboard,.lucide-languages,.lucide-layers,.lucide-layout-dashboard,.lucide-layout-grid,.lucide-link-2,.lucide-link,.lucide-list-checks,.lucide-list-filter,.lucide-list-plus,.lucide-list-x,.lucide-list,.lucide-loader-circle,.lucide-lock-open,.lucide-lock,.lucide-log-in,.lucide-log-out,.lucide-logs,.lucide-mail-plus,.lucide-mail-question-mark,.lucide-mail,.lucide-map-pin,.lucide-map-pinned,.lucide-maximize-2,.lucide-message-circle,.lucide-message-square-plus,.lucide-message-square-text,.lucide-message-square-x,.lucide-message-square,.lucide-minimize-2,.lucide-minus,.lucide-monitor,.lucide-moon,.lucide-mouse-pointer-click,.lucide-move-right,.lucide-music,.lucide-network,.lucide-notebook-pen,.lucide-package,.lucide-palette,.lucide-panel-left-open,.lucide-panel-left,.lucide-panel-right-close,.lucide-panel-right-open,.lucide-panel-right,.lucide-pencil-line,.lucide-pencil,.lucide-person-standing,.lucide-pin-off,.lucide-pin,.lucide-play,.lucide-plug,.lucide-plus,.lucide-rectangle-goggles,.lucide-refresh-ccw,.lucide-refresh-cw,.lucide-regex,.lucide-repeat,.lucide-reply,.lucide-rocket,.lucide-rotate-ccw-clock,.lucide-rotate-ccw,.lucide-rotate-cw,.lucide-rows-2,.lucide-rows-3,.lucide-rows-4,.lucide-rss,.lucide-save-off,.lucide-save,.lucide-scan-face,.lucide-scan-search,.lucide-search-x,.lucide-search,.lucide-send,.lucide-server-cog,.lucide-settings-2,.lucide-settings,.lucide-share-2,.lucide-shield-alert,.lucide-shield-check,.lucide-shield-off,.lucide-shield-user,.lucide-shield,.lucide-shirt,.lucide-shuffle,.lucide-sliders-horizontal,.lucide-smartphone,.lucide-sparkles,.lucide-sprout,.lucide-square-pen,.lucide-square-terminal,.lucide-square,.lucide-star-off,.lucide-star,.lucide-sticky-note,.lucide-sun,.lucide-table-2,.lucide-table,.lucide-tag,.lucide-tags,.lucide-terminal,.lucide-text-search,.lucide-ticket,.lucide-timer-off,.lucide-tractor,.lucide-trash,.lucide-trending-up,.lucide-triangle-alert,.lucide-triangles-centerline-dashed-horizontal,.lucide-triangles-centerline-dashed-vertical,.lucide-type,.lucide-ungroup,.lucide-upload,.lucide-user-check,.lucide-user-minus,.lucide-user-plus,.lucide-user-round-check,.lucide-user-round-minus,.lucide-user-round-search,.lucide-user-round,.lucide-user-search,.lucide-user-star,.lucide-user-x,.lucide-user,.lucide-users-round,.lucide-users,.lucide-video,.lucide-volume-2,.lucide-volume-x,.lucide-waypoints,.lucide-wrench,.lucide-x,.lucide-zoom-in,.lucide-zoom-out)>* / .vrcx-0-sidebar-surface::after / [data-slot=number-field-decrement] > svg / [data-slot=number-field-increment] > svg / [data-slot=toggle-group][data-variant=outline] > [data-slot=separator]::before / … (21 selectors)
- Matched samples: ui/shadcn/sidebar.tsx:198 <div> slot=sidebar; ui/shadcn/sidebar.tsx:215 <SheetContent> slot=sidebar; ui/shadcn/sidebar.tsx:285 <div> slot=sidebar-inner

### JCSS-0255 — 3 element records / 3 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background-color: #1e1a3e; border-right: 1px solid var(--wd-frame)`
- Selectors: .vrcx-0-sidebar-surface
- Matched samples: ui/shadcn/sidebar.tsx:198 <div> slot=sidebar; ui/shadcn/sidebar.tsx:215 <SheetContent> slot=sidebar; ui/shadcn/sidebar.tsx:285 <div> slot=sidebar-inner

### JCSS-0263 — 3 element records / 3 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background-image: var(--r5-pixel-mascot),linear-gradient(rgb(30 26 62 / .7),rgb(30 26 62 / .7)),var(--r5-pattern-heart-check); background-repeat: no-repeat,no-repeat,repeat; background-position: left 14px bottom 92px,0 0,0 0; background-size: 60px 60px,100% 100%,32px 32px`
- Selectors: .vrcx-0-sidebar-surface
- Matched samples: ui/shadcn/sidebar.tsx:198 <div> slot=sidebar; ui/shadcn/sidebar.tsx:215 <SheetContent> slot=sidebar; ui/shadcn/sidebar.tsx:285 <div> slot=sidebar-inner

### JCSS-0273 — 3 element records / 3 source locations
- CSS blocks 2; sections runtime; states base; targets host, ::selection.
- Declaration code: `background-color: var(--wd-pink); color: #16112a`
- Selectors: [data-slot="tabs-tab"][data-active] / .vrcx-0-app-root ::selection
- Matched samples: app/router.tsx:211 <div>; app/router.tsx:216 <div>; components/sidebar/SidePanel.tsx:507 <TabsTrigger> slot=tabs-tab

### JCSS-0287 — 3 element records / 3 source locations
- CSS blocks 25; sections runtime, window-chrome, settings, user-dialog-r8, login-r8, controls-r9, avatars-status-r9, browse-history-r9, buttons-badges-r10, data-surfaces-r10, cards-r97, portal-button-roles-b073-b100; states base; targets host, ::before.
- Declaration code: `border-radius: 0`
- Selectors: .vrcx-0-side-panel span[class~="size-3.75"] / 
.vrcx-0-side-panel span[class~="size-3.75"] > span / .vrcx-0-titlebar[data-app-titlebar] [data-slot='menubar'] [data-slot='menubar-trigger'] [data-slot='badge'] / [data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger])::before / .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-content] / … (29 selectors)
- Matched samples: components/UserStatusDot.tsx:42 <span>; ui/shadcn/avatar.tsx:57 <span> slot=avatar-badge; ui/shadcn/avatar.tsx:89 <div> slot=avatar-group-count

### JCSS-0293 — 3 element records / 3 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background-image: linear-gradient(rgb(30 26 62 / .7),rgb(30 26 62 / .7)),var(--r5-pattern-heart-check); background-size: 100% 100%,32px 32px; background-position: 0 0,0 0; background-repeat: no-repeat,repeat`
- Selectors: .vrcx-0-sidebar-surface
- Matched samples: ui/shadcn/sidebar.tsx:198 <div> slot=sidebar; ui/shadcn/sidebar.tsx:215 <SheetContent> slot=sidebar; ui/shadcn/sidebar.tsx:285 <div> slot=sidebar-inner

### JCSS-0411 — 3 element records / 3 source locations
- CSS blocks 1; sections motion; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; right: 8px; bottom: 104px; width: 48px; height: 72px; … (11 declarations)`
- Selectors: .vrcx-0-sidebar-surface::after
- Matched samples: ui/shadcn/sidebar.tsx:198 <div> slot=sidebar; ui/shadcn/sidebar.tsx:215 <SheetContent> slot=sidebar; ui/shadcn/sidebar.tsx:285 <div> slot=sidebar-inner

### JCSS-0417 — 3 element records / 3 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `background: #191329; border-right: 1px solid #8c71b0; box-shadow: inset -2px 0 #100b1e`
- Selectors: .vrcx-0-sidebar-surface
- Matched samples: ui/shadcn/sidebar.tsx:198 <div> slot=sidebar; ui/shadcn/sidebar.tsx:215 <SheetContent> slot=sidebar; ui/shadcn/sidebar.tsx:285 <div> slot=sidebar-inner

### JCSS-0420 — 3 element records / 3 source locations
- CSS blocks 2; sections navigation-r7, fields-toolbar-r10; states base; targets host, ::-webkit-color-swatch-wrapper.
- Declaration code: `padding: 0`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="group"] / :where(input[type="color"])::-webkit-color-swatch-wrapper
- Matched samples: components/dialogs/user-dialog/components/UserDialogProfileBackgroundPicker.tsx:40 <Input> slot=input; features/settings/components/settings-tabs/SettingsInterfaceUserColorsCard.tsx:221 <Input> slot=input; features/themes/components/AccentColorPicker.tsx:106 <Input> slot=input

### JCSS-0665 — 3 element records / 3 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background: #211a33; color: #f2ebff; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`
- Selectors: :where([data-slot="kbd"])
- Matched samples: components/keyboard/KeyboardShortcut.tsx:65 <Kbd> slot=kbd; features/feed/components/FeedSearchBox.tsx:226 <Kbd> slot=kbd; ui/shadcn/kbd.tsx:5 <kbd> slot=kbd

### JCSS-0668 — 3 element records / 3 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background: #211a33; padding: 2px`
- Selectors: :where(input[type="color"])
- Matched samples: components/dialogs/user-dialog/components/UserDialogProfileBackgroundPicker.tsx:40 <Input> slot=input; features/settings/components/settings-tabs/SettingsInterfaceUserColorsCard.tsx:221 <Input> slot=input; features/themes/components/AccentColorPicker.tsx:106 <Input> slot=input

### JCSS-0669 — 3 element records / 3 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets ::-webkit-color-swatch.
- Declaration code: `border: 1px solid #8c71b0; border-radius: 0`
- Selectors: :where(input[type="color"])::-webkit-color-swatch
- Matched samples: components/dialogs/user-dialog/components/UserDialogProfileBackgroundPicker.tsx:40 <Input> slot=input; features/settings/components/settings-tabs/SettingsInterfaceUserColorsCard.tsx:221 <Input> slot=input; features/themes/components/AccentColorPicker.tsx:106 <Input> slot=input

### JCSS-0253 — 2 element records / 2 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background-color: var(--wd-title); border-bottom: 1px solid var(--wd-frame)`
- Selectors: .vrcx-0-titlebar
- Matched samples: components/layout/AppTitleBar.tsx:90 <header>; components/layout/MacOverlayTitleBar.tsx:31 <header>

### JCSS-0254 — 2 element records / 2 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background-color: var(--wd-title); border-top: 1px solid var(--wd-frame)`
- Selectors: .vrcx-0-statusbar
- Matched samples: components/layout/status-bar/StatusBarFooter.tsx:351 <footer>; components/layout/status-bar/StatusBarFooter.tsx:369 <footer>

### JCSS-0282 — 2 element records / 2 source locations
- CSS blocks 2; sections runtime, popups-r9; states base; targets host.
- Declaration code: `border-radius: 0; clip-path: var(--wd-avatar-cut-sm); border-width: 0; box-shadow: none; outline: none`
- Selectors: [data-slot="avatar-image"] /  [data-slot="avatar-fallback"] / :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset])) > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])
- Matched samples: ui/shadcn/avatar.tsx:28 <AvatarPrimitive.Image> slot=avatar-image; ui/shadcn/avatar.tsx:44 <AvatarPrimitive.Fallback> slot=avatar-fallback

### JCSS-0296 — 2 element records / 2 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `background-image: none; border-bottom: 1px solid var(--jk-chrome-edge)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar]
- Matched samples: components/layout/AppTitleBar.tsx:90 <header>; components/layout/MacOverlayTitleBar.tsx:31 <header>

### JCSS-0301 — 2 element records / 2 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `position: relative; overflow: visible; margin-top: 8px; background-image: none; border-top: 1px solid var(--jk-chrome-edge)`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar']
- Matched samples: components/layout/status-bar/StatusBarFooter.tsx:351 <footer>; components/layout/status-bar/StatusBarFooter.tsx:369 <footer>

### JCSS-0304 — 2 element records / 2 source locations
- CSS blocks 1; sections window-chrome; states base; targets ::before.
- Declaration code: `content: ''; position: absolute; right: 0; bottom: 100%; left: 0; height: 8px; … (8 declarations)`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar']::before
- Matched samples: components/layout/status-bar/StatusBarFooter.tsx:351 <footer>; components/layout/status-bar/StatusBarFooter.tsx:369 <footer>

### JCSS-0338 — 2 element records / 2 source locations
- CSS blocks 1; sections settings; states focus-visible; targets host.
- Declaration code: `outline: 2px solid #16112a; outline-offset: -2px`
- Selectors: [data-slot=number-field-decrement]:focus-visible / [data-slot=number-field-increment]:focus-visible
- Matched samples: ui/shadcn/number-field.tsx:64 <NumberFieldPrimitive.Decrement> slot=number-field-decrement; ui/shadcn/number-field.tsx:82 <NumberFieldPrimitive.Increment> slot=number-field-increment

### JCSS-0340 — 2 element records / 2 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `width: 20px; height: 20px; padding: 0; border: 0; border-radius: 0; background-color: #cdb0e8; … (8 declarations)`
- Selectors: [data-slot=number-field-decrement] / [data-slot=number-field-increment]
- Matched samples: ui/shadcn/number-field.tsx:64 <NumberFieldPrimitive.Decrement> slot=number-field-decrement; ui/shadcn/number-field.tsx:82 <NumberFieldPrimitive.Increment> slot=number-field-increment

### JCSS-0341 — 2 element records / 2 source locations
- CSS blocks 1; sections settings; states hover; targets host.
- Declaration code: `background-color: #e3cbf2`
- Selectors: [data-slot=number-field-decrement]:hover / [data-slot=number-field-increment]:hover
- Matched samples: ui/shadcn/number-field.tsx:64 <NumberFieldPrimitive.Decrement> slot=number-field-decrement; ui/shadcn/number-field.tsx:82 <NumberFieldPrimitive.Increment> slot=number-field-increment

### JCSS-0342 — 2 element records / 2 source locations
- CSS blocks 1; sections settings; states active; targets host.
- Declaration code: `box-shadow: inset 2px 2px #7a3f6d,inset -2px -2px #fdf4ff`
- Selectors: [data-slot=number-field-decrement]:active / [data-slot=number-field-increment]:active
- Matched samples: ui/shadcn/number-field.tsx:64 <NumberFieldPrimitive.Decrement> slot=number-field-decrement; ui/shadcn/number-field.tsx:82 <NumberFieldPrimitive.Increment> slot=number-field-increment

### JCSS-0343 — 2 element records / 2 source locations
- CSS blocks 1; sections settings; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; width: 8px; height: 8px; background-color: #16112a; pointer-events: none; … (7 declarations)`
- Selectors: [data-slot=number-field-decrement]::before / [data-slot=number-field-increment]::before
- Matched samples: ui/shadcn/number-field.tsx:64 <NumberFieldPrimitive.Decrement> slot=number-field-decrement; ui/shadcn/number-field.tsx:82 <NumberFieldPrimitive.Increment> slot=number-field-increment

### JCSS-0377 — 2 element records / 2 source locations
- CSS blocks 4; sections pixel-controls, browse-history-r9, splitter-r97; states base; targets host, ::before.
- Declaration code: `transition: none`
- Selectors: [data-slot=switch-thumb] / :is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"] :is(.object-row,.object-row__pressable,.object-row__context-action) / html.reduce-effects :is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"] :is(.object-row,.object-row__pressable,.object-row__context-action) / [data-slot=resizable-handle] / [data-slot=resizable-handle]::before
- Matched samples: ui/shadcn/resizable.tsx:33 <ResizablePrimitive.Separator> slot=resizable-handle; ui/shadcn/switch.tsx:24 <SwitchPrimitive.Thumb> slot=switch-thumb

### JCSS-0456 — 2 element records / 2 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `background-color: var(--r8-frame); color: var(--r8-ink)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar]
- Matched samples: components/layout/AppTitleBar.tsx:90 <header>; components/layout/MacOverlayTitleBar.tsx:31 <header>

### JCSS-0467 — 2 element records / 2 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `background-color: var(--r8-status-face); border-top-color: var(--r8-status-face); color: var(--r8-ink)`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar']
- Matched samples: components/layout/status-bar/StatusBarFooter.tsx:351 <footer>; components/layout/status-bar/StatusBarFooter.tsx:369 <footer>

### JCSS-0469 — 2 element records / 2 source locations
- CSS blocks 1; sections chrome-r8; states base; targets ::before.
- Declaration code: `background-color: transparent; background-image: var(--r8-lace-tile); background-repeat: repeat-x; background-position: 0 center; background-size: 20px 8px; image-rendering: pixelated; … (8 declarations)`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar']::before
- Matched samples: components/layout/status-bar/StatusBarFooter.tsx:351 <footer>; components/layout/status-bar/StatusBarFooter.tsx:369 <footer>

### JCSS-0486 — 2 element records / 2 source locations
- CSS blocks 1; sections motion-r8; states base; targets ::before.
- Declaration code: `animation: r8-lace-flow 4.8s steps(2, end) infinite`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar']::before
- Matched samples: components/layout/status-bar/StatusBarFooter.tsx:351 <footer>; components/layout/status-bar/StatusBarFooter.tsx:369 <footer>

### JCSS-0553 — 2 element records / 2 source locations
- CSS blocks 2; sections controls-r9, fields-toolbar-r10; states base; targets host.
- Declaration code: `color: #e3d2f5`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"] > span:last-child / :where([data-slot="field-label"]) / :where([data-slot="label"])
- Matched samples: ui/shadcn/field.tsx:104 <Label> slot=field-label; ui/shadcn/field.tsx:118 <div> slot=field-label

### JCSS-0574 — 2 element records / 2 source locations
- CSS blocks 1; sections popups-r9; states base; targets host.
- Declaration code: `--radius: 0px`
- Selectors: [data-slot="menu-positioner"]
- Matched samples: ui/shadcn/context-menu.tsx:75 <ContextMenuPrimitive.Positioner> slot=menu-positioner; ui/shadcn/dropdown-menu.tsx:49 <DropdownMenuPrimitive.Positioner> slot=menu-positioner

### JCSS-0631 — 2 element records / 2 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets host.
- Declaration code: `--r9-dialog-inset: 1rem; color: var(--r9-dialog-inner); background-color: var(--r9-dialog-face); background-image: linear-gradient(#ff7fcf, #ff7fcf),
    linear-gradient(var(--r9-dialog-mint), var(--r9-dialog-mint)); background-repeat: no-repeat; background-size: 18px 5px, 100% 5px; … (10 declarations)`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"]):not(.entity-dialog):not(.owner-dialog):has(> :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]):not(.sr-only))
- Matched samples: ui/shadcn/alert-dialog.tsx:70 <AlertDialogPrimitive.Popup> slot=alert-dialog-content; ui/shadcn/dialog.tsx:71 <DialogPrimitive.Popup> slot=dialog-content

### JCSS-0671 — 2 element records / 2 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets ::-webkit-calendar-picker-indicator.
- Declaration code: `background: var(--wd-native-clock) center/16px 16px no-repeat; opacity: 1`
- Selectors: :where(input[type="time"])::-webkit-calendar-picker-indicator
- Matched samples: components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:259 <Input> slot=input; components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:274 <Input> slot=input

### JCSS-0837 — 2 element records / 2 source locations
- CSS blocks 1; sections brand-heart-r97; states base; targets host.
- Declaration code: `--jk-r97-heart-s: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='7' shape-rendering='crispEdges'%3E%3Cpath fill='%2334316a' d='M1 0h3v1h-3zM5 0h3v1h-3zM0 1h1v2h-1zM4 1h1v1h-1zM8 1h1v2h-1zM1 3h1v1h-1zM7 3h1v1h-1zM2 4h1v1h-1zM6 4h1v1h-1zM3 5h1v1h-1zM5 5h1v1h-1zM4 6h1v1h-1z'/%3E%3Cpath fill='%23ffb8e6' d='M1 1h3v1h-3zM5 1h3v1h-3zM1 2h7v1h-7zM2 3h5v1h-5zM3 4h3v1h-3zM4 5h1v1h-1z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h1v2h-1z'/%3E%3C/svg%3E"); --jk-r97-heart-m: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='8' shape-rendering='crispEdges'%3E%3Cpath fill='%2334316a' d='M1 0h3v1h-3zM6 0h3v1h-3zM0 1h1v3h-1zM4 1h2v1h-2zM9 1h1v3h-1zM1 4h1v1h-1zM8 4h1v1h-1zM2 5h1v1h-1zM7 5h1v1h-1zM3 6h1v1h-1zM6 6h1v1h-1zM4 7h2v1h-2z'/%3E%3Cpath fill='%23ffb8e6' d='M1 1h3v1h-3zM6 1h3v1h-3zM1 2h8v2h-8zM2 4h6v1h-6zM3 5h4v1h-4zM4 6h2v1h-2z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h2v1h-2zM1 2h1v1h-1z'/%3E%3C/svg%3E"); --jk-r97-heart-l: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='9' shape-rendering='crispEdges'%3E%3Cpath fill='%2334316a' d='M1 0h3v1h-3zM7 0h3v1h-3zM0 1h1v3h-1zM4 1h1v1h-1zM6 1h1v1h-1zM10 1h1v3h-1zM5 2h1v1h-1zM1 4h1v1h-1zM9 4h1v1h-1zM2 5h1v1h-1zM8 5h1v1h-1zM3 6h1v1h-1zM7 6h1v1h-1zM4 7h1v1h-1zM6 7h1v1h-1zM5 8h1v1h-1z'/%3E%3Cpath fill='%23ffb8e6' d='M1 1h3v1h-3zM7 1h3v1h-3zM1 2h4v1h-4zM6 2h4v1h-4zM1 3h9v1h-9zM2 4h7v1h-7zM3 5h5v1h-5zM4 6h3v1h-3zM5 7h1v1h-1z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h2v1h-2zM1 2h1v1h-1z'/%3E%3C/svg%3E")`
- Selectors: .vrcx-0-titlebar[data-app-titlebar]
- Matched samples: components/layout/AppTitleBar.tsx:90 <header>; components/layout/MacOverlayTitleBar.tsx:31 <header>

### JCSS-0252 — 1 element records / 1 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background-color: var(--wd-desktop)`
- Selectors: .vrcx-0-app-root
- Matched samples: app/router.tsx:202 <div>

### JCSS-0256 — 1 element records / 1 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background-color: #291c3e; border-left: 1px solid var(--wd-frame)`
- Selectors: .vrcx-0-side-panel
- Matched samples: components/sidebar/SidePanel.tsx:382 <aside>

### JCSS-0262 — 1 element records / 1 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `--vrcx-0-main-content-edge: var(--wd-frame); --vrcx-0-main-content-radius: 2px`
- Selectors: .vrcx-0-workspace
- Matched samples: components/layout/AppShellLayout.tsx:151 <div>

### JCSS-0265 — 1 element records / 1 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background-image: var(--wd-bg-cloud); background-repeat: no-repeat; background-position: right 20px bottom 24px; background-size: 96px 48px`
- Selectors: .vrcx-0-side-panel
- Matched samples: components/sidebar/SidePanel.tsx:382 <aside>

### JCSS-0266 — 1 element records / 1 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `border-color: var(--wd-frame); border-radius: 2px`
- Selectors: [data-slot="card"]
- Matched samples: ui/shadcn/card.tsx:11 <div> slot=card

### JCSS-0267 — 1 element records / 1 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background-image: none; border-bottom: 1px dotted #70518f`
- Selectors: [data-slot="card-header"]
- Matched samples: ui/shadcn/card.tsx:25 <div> slot=card-header

### JCSS-0268 — 1 element records / 1 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `border: 1px solid var(--wd-frame); border-radius: 2px; box-shadow: 0 0 0 1px #3d305e,5px 5px 0 rgb(11 7 24 / .55); background-color: var(--wd-window)`
- Selectors: [data-slot="dialog-content"]
- Matched samples: ui/shadcn/dialog.tsx:71 <DialogPrimitive.Popup> slot=dialog-content

### JCSS-0269 — 1 element records / 1 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background-color: rgb(36 18 66 / .62)`
- Selectors: [data-slot="dialog-overlay"]
- Matched samples: ui/shadcn/dialog.tsx:47 <DialogPrimitive.Backdrop> slot=dialog-overlay

### JCSS-0270 — 1 element records / 1 source locations
- CSS blocks 2; sections runtime, data-surfaces-r10; states base; targets host.
- Declaration code: `color: var(--wd-text)`
- Selectors: [data-slot="dialog-title"] / :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) [data-slot="calendar-month-caption"] / 
:is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) .text-sm.font-medium
- Matched samples: ui/shadcn/dialog.tsx:143 <DialogPrimitive.Title> slot=dialog-title

### JCSS-0281 — 1 element records / 1 source locations
- CSS blocks 3; sections runtime, login-r8, popups-r9; states base; targets host.
- Declaration code: `border-radius: 0; background: transparent; box-shadow: none; outline: none`
- Selectors: [data-slot="avatar"] / [data-vrcx-0-surface="login-page"] [data-slot="avatar"] / :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset]))
- Matched samples: ui/shadcn/avatar.tsx:14 <AvatarPrimitive.Root> slot=avatar

### JCSS-0284 — 1 element records / 1 source locations
- CSS blocks 3; sections runtime, login-r8, popups-r9; states base; targets ::after.
- Declaration code: `border-color: transparent; border-width: 0`
- Selectors: [data-slot="avatar"]::after / [data-vrcx-0-surface="login-page"] [data-slot="avatar"]::after / :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset]))::after
- Matched samples: ui/shadcn/avatar.tsx:14 <AvatarPrimitive.Root> slot=avatar

### JCSS-0285 — 1 element records / 1 source locations
- CSS blocks 3; sections runtime, login-r8, cards-r97; states base; targets ::before, ::after.
- Declaration code: `content: none`
- Selectors: [data-slot="avatar"]::before / [data-vrcx-0-surface="login-page"] [data-slot="avatar"]::before / .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]) [data-slot=card-header] [data-slot=collapsible-trigger]::after
- Matched samples: ui/shadcn/avatar.tsx:14 <AvatarPrimitive.Root> slot=avatar

### JCSS-0288 — 1 element records / 1 source locations
- CSS blocks 1; sections runtime; states base; targets ::before.
- Declaration code: `content: "SOCIAL"; display: block; flex: none; min-height: 24px; padding: 3px 10px; font: 12px/18px "WD Pixel",sans-serif; … (9 declarations)`
- Selectors: .vrcx-0-side-panel::before
- Matched samples: components/sidebar/SidePanel.tsx:382 <aside>

### JCSS-0319 — 1 element records / 1 source locations
- CSS blocks 1; sections side-panel; states base; targets host.
- Declaration code: `margin-top: 0; margin-right: 0; margin-bottom: 0; border-radius: 0; box-shadow: none`
- Selectors: .vrcx-0-workspace:has(> [data-vrcx-0-surface='side-panel'])
- Matched samples: components/layout/AppShellLayout.tsx:151 <div>

### JCSS-0320 — 1 element records / 1 source locations
- CSS blocks 1; sections side-panel; states base; targets host.
- Declaration code: `margin: var(--vrcx-0-main-content-gutter-top) 0
        var(--vrcx-0-main-content-gutter-bottom) 0; border-radius: var(--vrcx-0-main-content-radius); box-shadow: 0 0 0 1px var(--wd-frame)`
- Selectors: .vrcx-0-workspace:has(> [data-vrcx-0-surface='side-panel'])
    > [data-vrcx-0-surface='main-content']
- Matched samples: components/layout/AppShellLayout.tsx:158 <div>

### JCSS-0321 — 1 element records / 1 source locations
- CSS blocks 1; sections side-panel; states base; targets host.
- Declaration code: `background-color: var(--wd-window)`
- Selectors: .vrcx-0-workspace:has(> [data-vrcx-0-surface='side-panel'])
    > [data-vrcx-0-resize='side-panel']
- Matched samples: components/layout/AppShellLayout.tsx:170 <div>

### JCSS-0322 — 1 element records / 1 source locations
- CSS blocks 1; sections side-panel; states base; targets host.
- Declaration code: `border: 1px solid var(--wd-frame)`
- Selectors: .vrcx-0-side-panel
- Matched samples: components/sidebar/SidePanel.tsx:382 <aside>

### JCSS-0326 — 1 element records / 1 source locations
- CSS blocks 2; sections side-panel; states hover; targets host.
- Declaration code: `background-color: var(--wd-select); color: var(--wd-text)`
- Selectors: .vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab']:hover / .vrcx-0-side-panel .vrcx-0-side-panel-rail > [data-slot='button']:hover
- Matched samples: components/sidebar/SidePanel.tsx:641 <Button> slot=button

### JCSS-0330 — 1 element records / 1 source locations
- CSS blocks 1; sections side-panel; states base; targets host.
- Declaration code: `border-radius: 0; background-color: #1d1631; color: var(--wd-faint)`
- Selectors: .vrcx-0-side-panel .vrcx-0-side-panel-rail > [data-slot='button']
- Matched samples: components/sidebar/SidePanel.tsx:641 <Button> slot=button

### JCSS-0332 — 1 element records / 1 source locations
- CSS blocks 1; sections feed-badges; states base; targets host.
- Declaration code: `border-radius: 0; box-shadow: 0 0 0 1px #16112a`
- Selectors: span.inline-flex.min-w-0.items-center.gap-1\.5:has(> span.size-2\.5.rounded-full)
    > span.size-2\.5.rounded-full
- Matched samples: components/feed/FeedStatusBadge.tsx:17 <span>

### JCSS-0333 — 1 element records / 1 source locations
- CSS blocks 1; sections feed-badges; states base; targets host.
- Declaration code: `border-radius: 0; border: 1px solid var(--wd-frame); background-color: var(--wd-raised); color: var(--wd-square); font-family: var(--wd-body-font-family); font-weight: 600; … (8 declarations)`
- Selectors: span.h-4.shrink-0.items-center.rounded.border.px-1.font-mono.text-\[10px\]
- Matched samples: components/location/RegionCodeBadge.tsx:32 <span>

### JCSS-0336 — 1 element records / 1 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `border: 1px solid #16112a; border-radius: 0; background-color: #120d22; box-shadow: inset 1px 1px rgb(0 0 0/.55),inset -1px -1px #8f7fe0; clip-path: var(--jk-px-cut)`
- Selectors: [data-slot=number-field-group]
- Matched samples: ui/shadcn/number-field.tsx:48 <NumberFieldPrimitive.Group> slot=number-field-group

### JCSS-0339 — 1 element records / 1 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `height: 20px; line-height: 20px; padding: 0 6px; background-color: transparent; color: #f2ebff; font-size: 12px`
- Selectors: [data-slot=number-field-input]
- Matched samples: ui/shadcn/number-field.tsx:100 <NumberFieldPrimitive.Input> slot=number-field-input

### JCSS-0344 — 1 element records / 1 source locations
- CSS blocks 1; sections settings; states base; targets ::before.
- Declaration code: `mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 3h4v2H2zM3 2h2v4H3z'/%3E%3C/svg%3E")`
- Selectors: [data-slot=number-field-increment]::before
- Matched samples: ui/shadcn/number-field.tsx:82 <NumberFieldPrimitive.Increment> slot=number-field-increment

### JCSS-0371 — 1 element records / 1 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `width: 18px; height: 18px; margin-left: 1px; border-radius: 0; box-shadow: none; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' shape-rendering='crispEdges'%3E%3Cpath fill='%2316112a' d='M0 0h18v1h-18zM0 1h1v1h-1zM17 1h1v1h-1zM0 2h1v1h-1zM17 2h1v1h-1zM0 3h1v1h-1zM17 3h1v1h-1zM0 4h1v1h-1zM17 4h1v1h-1zM0 5h1v1h-1zM17 5h1v1h-1zM0 6h1v1h-1zM17 6h1v1h-1zM0 7h1v1h-1zM17 7h1v1h-1zM0 8h1v1h-1zM17 8h1v1h-1zM0 9h1v1h-1zM17 9h1v1h-1zM0 10h1v1h-1zM17 10h1v1h-1zM0 11h1v1h-1zM17 11h1v1h-1zM0 12h1v1h-1zM17 12h1v1h-1zM0 13h1v1h-1zM17 13h1v1h-1zM0 14h1v1h-1zM17 14h1v1h-1zM0 15h1v1h-1zM17 15h1v1h-1zM0 16h1v1h-1zM17 16h1v1h-1zM0 17h18v1h-18z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h16v1h-16zM1 2h1v1h-1zM1 3h1v1h-1zM1 4h1v1h-1zM1 5h1v1h-1zM1 6h1v1h-1zM1 7h1v1h-1zM1 8h1v1h-1zM1 9h1v1h-1zM1 10h1v1h-1zM1 11h1v1h-1zM1 12h1v1h-1zM1 13h1v1h-1zM1 14h1v1h-1zM1 15h1v1h-1zM1 16h1v1h-1z'/%3E%3Cpath fill='%23cdb0e8' d='M2 2h1v1h-1zM6 2h6v1h-6zM15 2h1v1h-1zM7 3h4v1h-4zM8 4h2v1h-2zM2 6h1v1h-1zM15 6h1v1h-1zM2 7h2v1h-2zM14 7h2v1h-2zM2 8h3v1h-3zM13 8h3v1h-3zM2 9h3v1h-3zM13 9h3v1h-3zM2 10h2v1h-2zM14 10h2v1h-2zM2 11h1v1h-1zM15 11h1v1h-1zM8 13h2v1h-2zM7 14h4v1h-4zM2 15h1v1h-1zM6 15h6v1h-6zM15 15h1v1h-1z'/%3E%3Cpath fill='%235a2e18' d='M3 2h3v1h-3zM12 2h3v1h-3zM2 3h1v1h-1zM6 3h1v1h-1zM11 3h1v1h-1zM15 3h1v1h-1zM2 4h1v1h-1zM7 4h1v1h-1zM10 4h1v1h-1zM15 4h1v1h-1zM2 5h1v1h-1zM8 5h2v1h-2zM15 5h1v1h-1zM3 6h1v1h-1zM9 6h1v1h-1zM14 6h1v1h-1zM4 7h1v1h-1zM10 7h1v1h-1zM13 7h1v1h-1zM5 8h1v1h-1zM11 8h2v1h-2zM5 9h2v1h-2zM12 9h1v1h-1zM4 10h1v1h-1zM7 10h1v1h-1zM13 10h1v1h-1zM3 11h1v1h-1zM8 11h1v1h-1zM14 11h1v1h-1zM2 12h1v1h-1zM8 12h2v1h-2zM15 12h1v1h-1zM2 13h1v1h-1zM7 13h1v1h-1zM10 13h1v1h-1zM15 13h1v1h-1zM2 14h1v1h-1zM6 14h1v1h-1zM11 14h1v1h-1zM15 14h1v1h-1zM3 15h3v1h-3zM12 15h3v1h-3z'/%3E%3Cpath fill='%237a3f6d' d='M16 2h1v1h-1zM16 3h1v1h-1zM16 4h1v1h-1zM16 5h1v1h-1zM16 6h1v1h-1zM16 7h1v1h-1zM16 8h1v1h-1zM16 9h1v1h-1zM16 10h1v1h-1zM16 11h1v1h-1zM16 12h1v1h-1zM16 13h1v1h-1zM16 14h1v1h-1zM16 15h1v1h-1zM2 16h15v1h-15z'/%3E%3Cpath fill='%23e6a463' d='M3 3h2v1h-2zM3 4h2v1h-2zM5 5h2v1h-2zM5 6h1v1h-1zM7 6h1v1h-1zM6 7h2v1h-2zM10 10h2v1h-2zM10 11h1v1h-1zM12 11h1v1h-1zM11 12h2v1h-2zM13 13h2v1h-2zM13 14h2v1h-2z'/%3E%3Cpath fill='%23cf8b4f' d='M5 3h1v1h-1zM6 4h1v1h-1zM7 5h1v1h-1zM8 6h1v1h-1zM9 7h1v1h-1zM10 8h1v1h-1zM11 9h1v1h-1zM12 10h1v1h-1zM13 11h1v1h-1zM14 12h1v1h-1z'/%3E%3Cpath fill='%23eab27c' d='M12 3h1v1h-1zM11 4h1v1h-1zM10 5h1v1h-1zM5 10h1v1h-1zM4 11h1v1h-1zM3 12h1v1h-1z'/%3E%3Cpath fill='%23d48f52' d='M13 3h2v1h-2zM13 4h2v1h-2zM11 5h2v1h-2zM10 6h1v1h-1zM12 6h1v1h-1zM11 7h1v1h-1zM6 10h1v1h-1zM5 11h1v1h-1zM7 11h1v1h-1zM5 12h2v1h-2zM3 13h2v1h-2zM3 14h2v1h-2z'/%3E%3Cpath fill='%2399532c' d='M5 4h1v1h-1zM12 4h1v1h-1zM4 5h1v1h-1zM13 5h1v1h-1zM6 6h1v1h-1zM11 6h1v1h-1zM6 11h1v1h-1zM11 11h1v1h-1zM4 12h1v1h-1zM13 12h1v1h-1zM5 13h1v1h-1zM12 13h1v1h-1z'/%3E%3Cpath fill='%23f8cc96' d='M3 5h1v1h-1zM4 6h1v1h-1zM5 7h1v1h-1zM6 8h1v1h-1zM7 9h1v1h-1zM8 10h1v1h-1zM9 11h1v1h-1zM10 12h1v1h-1zM11 13h1v1h-1zM12 14h1v1h-1z'/%3E%3Cpath fill='%23b97540' d='M14 5h1v1h-1zM13 6h1v1h-1zM12 7h1v1h-1zM7 12h1v1h-1zM6 13h1v1h-1zM5 14h1v1h-1z'/%3E%3Cpath fill='%23e9c79a' d='M8 7h1v1h-1zM7 8h1v1h-1zM10 9h1v1h-1zM9 10h1v1h-1z'/%3E%3Cpath fill='%23fbeed4' d='M8 8h2v1h-2zM8 9h2v1h-2z'/%3E%3C/svg%3E") 0 0/18px 18px no-repeat; … (8 declarations)`
- Selectors: [data-slot=switch-thumb]
- Matched samples: ui/shadcn/switch.tsx:24 <SwitchPrimitive.Thumb> slot=switch-thumb

### JCSS-0383 — 1 element records / 1 source locations
- CSS blocks 2; sections pixel-controls; states hover; targets ::-webkit-scrollbar-thumb, host.
- Declaration code: `background-color: #ffb8e6`
- Selectors: ::-webkit-scrollbar-thumb:hover / [data-slot=scroll-area-thumb]:hover
- Matched samples: ui/shadcn/scroll-area.tsx:57 <ScrollAreaPrimitive.Thumb> slot=scroll-area-thumb

### JCSS-0389 — 1 element records / 1 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `border: 0; border-radius: 0; background: #2a2147; box-shadow: inset 0 0 0 1px #6c5ce0`
- Selectors: [data-slot=scroll-area-scrollbar]
- Matched samples: ui/shadcn/scroll-area.tsx:47 <ScrollAreaPrimitive.Scrollbar> slot=scroll-area-scrollbar

### JCSS-0392 — 1 element records / 1 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `border-radius: 0; background: #ff7fcf url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 8' shape-rendering='crispEdges'%3E%3Cpath fill='%237a3f6d' d='M0 0h6v1h-6zM0 3h6v1h-6zM0 6h6v1h-6z'/%3E%3Cpath fill='%23fdf4ff' d='M0 1h6v1h-6zM0 4h6v1h-6zM0 7h6v1h-6z'/%3E%3C/svg%3E") 50% 50%/6px 8px no-repeat; border: 1px solid #16112a; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`
- Selectors: [data-slot=scroll-area-thumb]
- Matched samples: ui/shadcn/scroll-area.tsx:57 <ScrollAreaPrimitive.Thumb> slot=scroll-area-thumb

### JCSS-0393 — 1 element records / 1 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `box-sizing: content-box; height: 12px; padding: 0 2px; border: 1px solid #16112a; border-radius: 0; background: #120d22; … (7 declarations)`
- Selectors: [data-slot=progress-track]
- Matched samples: ui/shadcn/progress.tsx:28 <ProgressPrimitive.Track> slot=progress-track

### JCSS-0394 — 1 element records / 1 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `border-radius: 0; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 8' shape-rendering='crispEdges'%3E%3Cpath fill='%23ffb8e6' d='M0 0h8v1h-8z'/%3E%3Cpath fill='%23ff7fcf' d='M0 1h8v1h-8zM0 2h8v1h-8zM0 3h8v1h-8zM0 4h8v1h-8zM0 5h8v1h-8zM0 6h8v1h-8z'/%3E%3Cpath fill='%23b35aa0' d='M0 7h8v1h-8z'/%3E%3C/svg%3E") 0 50%/10px 8px repeat-x`
- Selectors: [data-slot=progress-indicator]
- Matched samples: ui/shadcn/progress.tsx:44 <ProgressPrimitive.Indicator> slot=progress-indicator

### JCSS-0396 — 1 element records / 1 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `animation-timing-function: steps(3,end)`
- Selectors: [data-slot=skeleton]
- Matched samples: ui/shadcn/skeleton.tsx:5 <div> slot=skeleton

### JCSS-0397 — 1 element records / 1 source locations
- CSS blocks 2; sections pixel-controls, loader-r97; states base; targets host.
- Declaration code: `animation-timing-function: steps(8,end)`
- Selectors: [data-slot=spinner] / svg.lucide.animate-spin / [data-type=loading] [data-slot=toast-icon]>svg
- Matched samples: ui/shadcn/spinner.tsx:7 <Loader2Icon> slot=spinner

### JCSS-0410 — 1 element records / 1 source locations
- CSS blocks 1; sections motion; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; z-index: 1; background-repeat: no-repeat; pointer-events: none`
- Selectors: .vrcx-0-side-panel::after
- Matched samples: components/sidebar/SidePanel.tsx:382 <aside>

### JCSS-0413 — 1 element records / 1 source locations
- CSS blocks 1; sections motion; states base; targets host.
- Declaration code: `animation: r5-progress-flow 1.8s steps(5,end) infinite`
- Selectors: [data-slot="progress-indicator"]
- Matched samples: ui/shadcn/progress.tsx:44 <ProgressPrimitive.Indicator> slot=progress-indicator

### JCSS-0414 — 1 element records / 1 source locations
- CSS blocks 1; sections motion; states base; targets host.
- Declaration code: `animation: r5-spinner-step 1s steps(8,end) infinite`
- Selectors: [data-slot="spinner"]
- Matched samples: ui/shadcn/spinner.tsx:7 <Loader2Icon> slot=spinner

### JCSS-0436 — 1 element records / 1 source locations
- CSS blocks 3; sections navigation-r7, login-r8, cards-r97; states base; targets host.
- Declaration code: `position: relative; z-index: 1`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="footer"] > [data-sidebar="menu"] / [data-vrcx-0-surface="login-page"].vrcx-0-main-shell > div / :is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),[data-tools-section]) [data-slot=card-header]
- Matched samples: features/auth/LoginPage.tsx:32 <div>

### JCSS-0444 — 1 element records / 1 source locations
- CSS blocks 1; sections motion-r7; states base; targets ::after.
- Declaration code: `right: 88px; width: 42px; background-image: var(--r5-star),var(--r5-pixel-mascot); background-size: 16px 16px,18px 18px; image-rendering: pixelated; pointer-events: none`
- Selectors: .vrcx-0-side-panel::after
- Matched samples: components/sidebar/SidePanel.tsx:382 <aside>

### JCSS-0452 — 1 element records / 1 source locations
- CSS blocks 1; sections backgrounds-r7; states base; targets host.
- Declaration code: `--r7-bg-size: 200px; background-color: #201936; background-image: var(--r7-ame-tweeter,none),var(--r7-game-icon,none),var(--wd-bg-stars); background-repeat: no-repeat,no-repeat,repeat; background-position: left 0 bottom 0,right 0 bottom 0,0 0; background-size: var(--r7-bg-size) var(--r7-bg-size),var(--r7-bg-size) var(--r7-bg-size),128px 128px`
- Selectors: .vrcx-0-main-content
- Matched samples: components/layout/AppShellLayout.tsx:158 <div>

### JCSS-0453 — 1 element records / 1 source locations
- CSS blocks 1; sections backgrounds-r7; states base; targets host.
- Declaration code: `--r7-bg-size: 150px`
- Selectors: .vrcx-0-main-content
- Matched samples: components/layout/AppShellLayout.tsx:158 <div>

### JCSS-0454 — 1 element records / 1 source locations
- CSS blocks 1; sections backgrounds-r7; states base; targets host.
- Declaration code: `--r7-bg-size: 120px`
- Selectors: .vrcx-0-main-content
- Matched samples: components/layout/AppShellLayout.tsx:158 <div>

### JCSS-0468 — 1 element records / 1 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `background-color: var(--r8-status-face); box-shadow: none`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] > div[class~='min-h-6'][class~='flex-col']
- Matched samples: components/layout/status-bar/StatusBarFooter.tsx:378 <div>

### JCSS-0503 — 1 element records / 1 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `isolation: isolate; background-color: var(--wd-window, #201936)`
- Selectors: [data-vrcx-0-surface="login-page"].vrcx-0-main-shell
- Matched samples: features/auth/LoginPage.tsx:28 <div>

### JCSS-0504 — 1 element records / 1 source locations
- CSS blocks 1; sections login-r8; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.38; … (10 declarations)`
- Selectors: [data-vrcx-0-surface="login-page"].vrcx-0-main-shell::before
- Matched samples: features/auth/LoginPage.tsx:28 <div>

### JCSS-0505 — 1 element records / 1 source locations
- CSS blocks 1; sections login-r8; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.92; … (11 declarations)`
- Selectors: [data-vrcx-0-surface="login-page"].vrcx-0-main-shell::after
- Matched samples: features/auth/LoginPage.tsx:28 <div>

### JCSS-0506 — 1 element records / 1 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `--login-r8-corner-size: 150px`
- Selectors: [data-vrcx-0-surface="login-page"].vrcx-0-main-shell
- Matched samples: features/auth/LoginPage.tsx:28 <div>

### JCSS-0507 — 1 element records / 1 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `--login-r8-corner-size: 120px`
- Selectors: [data-vrcx-0-surface="login-page"].vrcx-0-main-shell
- Matched samples: features/auth/LoginPage.tsx:28 <div>

### JCSS-0521 — 1 element records / 1 source locations
- CSS blocks 12; sections login-r8, avatars-status-r9; states base; targets host.
- Declaration code: `border-radius: 0; border-width: 0; box-shadow: none; outline: none; clip-path: var(--wd-avatar-cut-sm)`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="avatar-image"] / 
[data-vrcx-0-surface="login-page"] [data-slot="avatar-fallback"] / button:has(> span[class~="size-9"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]) > span[class~="size-9"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"] / .activity-skin span.block.shrink-0.overflow-hidden.rounded-full:is([class~="size-7"],[class~="size-9"]) / .vrcx-0-data-table :is(
  img[class~="size-6"][class~="rounded-full"][class~="object-cover"],
  div[class~="bg-muted"][class~="size-6"][class~="rounded-full"]
) / … (14 selectors)
- Matched samples: components/dialogs/AvatarOwnerEditDialogs.tsx:103 <div>

### JCSS-0535 — 1 element records / 1 source locations
- CSS blocks 1; sections login-r8; states base; targets ::before, ::after, host.
- Declaration code: `animation: none !important; transition-duration: 0s !important`
- Selectors: [data-vrcx-0-surface="login-page"].vrcx-0-main-shell::before / 
  [data-vrcx-0-surface="login-page"].vrcx-0-main-shell::after / 
  [data-vrcx-0-surface="login-page"] form > [data-slot="button"][type="submit"][data-variant="default"] / 
  [data-vrcx-0-surface="login-page"] [data-slot="spinner"]
- Matched samples: features/auth/LoginPage.tsx:28 <div>

### JCSS-0541 — 1 element records / 1 source locations
- CSS blocks 1; sections user-dialog-r9; states base; targets host.
- Declaration code: `--r9-banner-stitch-opacity: .38; --r9-banner-stitch-size: 8px 12px, 8px 12px; --r9-banner-hem-height: 6px; --r9-banner-hem-opacity: .90; --r9-banner-hem-size: 10px 6px`
- Selectors: .entity-dialog
- Matched samples: components/hosts/DialogHost.tsx:87 <DialogContent>

### JCSS-0588 — 1 element records / 1 source locations
- CSS blocks 3; sections popups-r9, fields-toolbar-r10, buttons-badges-r10; states base; targets host.
- Declaration code: `color: #b9add9`
- Selectors: :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) [data-slot="menubar-shortcut"] / :where([data-slot="field-description"]) / :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="alert-description"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: ui/shadcn/field.tsx:131 <p> slot=field-description

### JCSS-0602 — 1 element records / 1 source locations
- CSS blocks 1; sections avatars-status-r9; states base; targets host.
- Declaration code: `box-shadow: 0 0 0 1px var(--background)`
- Selectors: [data-slot="avatar-group"] [data-slot="avatar"]:not([class~="rounded-md"]):not([class~="rounded-lg"]) / 
[data-slot="avatar-group-count"]
- Matched samples: ui/shadcn/avatar.tsx:89 <div> slot=avatar-group-count

### JCSS-0623 — 1 element records / 1 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `height: 6px !important; border: 1px solid #6c5ce0; border-radius: 0 !important; background: repeating-linear-gradient(90deg,#332650 0 3px,#211a33 3px 5px) !important; box-shadow: inset 1px 1px #16112a`
- Selectors: :where([data-slot="slider-track"])
- Matched samples: ui/shadcn/slider.tsx:34 <SliderPrimitive.Track> slot=slider-track

### JCSS-0624 — 1 element records / 1 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `background: repeating-linear-gradient(90deg,#ffb8e6 0 3px,#f37fc4 3px 5px) !important`
- Selectors: :where([data-slot="slider-range"])
- Matched samples: ui/shadcn/slider.tsx:38 <SliderPrimitive.Indicator> slot=slider-range

### JCSS-0625 — 1 element records / 1 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `width: 12px !important; height: 12px !important; border: 1px solid #6c5ce0 !important; border-radius: 0 !important; background: #ffb8e6 !important; box-shadow: inset 1px 1px #fff0fa,inset -1px -1px #a44a8c !important`
- Selectors: :where([data-slot="slider-thumb"])
- Matched samples: ui/shadcn/slider.tsx:44 <SliderPrimitive.Thumb> slot=slider-thumb

### JCSS-0629 — 1 element records / 1 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `animation: r5-spinner-step 1s steps(8,end) infinite; transform-origin: center`
- Selectors: :where([data-slot="spinner"]:is(.size-4,.size-3\.5))
- Matched samples: ui/shadcn/spinner.tsx:7 <Loader2Icon> slot=spinner

### JCSS-0639 — 1 element records / 1 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets host.
- Declaration code: `position: absolute !important; top: 4px !important; right: 4px !important; z-index: 2; display: inline-flex; width: 22px !important; … (18 declarations)`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"]):not(.entity-dialog):not(.owner-dialog):has(> :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]):not(.sr-only))
  > [data-slot="dialog-close"]
- Matched samples: ui/shadcn/dialog.tsx:81 <DialogPrimitive.Close> slot=dialog-close

### JCSS-0641 — 1 element records / 1 source locations
- CSS blocks 1; sections dialogs-r9; states focus-visible; targets host.
- Declaration code: `outline: 2px solid var(--r9-dialog-mint); outline-offset: 1px`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"]):not(.entity-dialog):not(.owner-dialog):has(> :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]):not(.sr-only))
  > [data-slot="dialog-close"]:focus-visible
- Matched samples: ui/shadcn/dialog.tsx:81 <DialogPrimitive.Close> slot=dialog-close

### JCSS-0650 — 1 element records / 1 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `color: #ff8fae`
- Selectors: :where([data-slot="field-error"]:not([data-vrcx-0-surface="login-page"] *))
- Matched samples: ui/shadcn/field.tsx:214 <div> slot=field-error

### JCSS-0666 — 1 element records / 1 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `gap: 1px`
- Selectors: :where([data-slot="kbd-group"])
- Matched samples: ui/shadcn/kbd.tsx:18 <kbd> slot=kbd-group

### JCSS-0667 — 1 element records / 1 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border-radius: 0; border-color: #6c5ce0; background: #16112a; color: #f2ebff; box-shadow: inset 1px 1px #3d305e,inset -1px -1px #0e0a17`
- Selectors: :where([data-slot="input-otp-slot"])
- Matched samples: ui/shadcn/input-otp.tsx:55 <div> slot=input-otp-slot

### JCSS-0673 — 1 element records / 1 source locations
- CSS blocks 1; sections overlays-r10; states base; targets host.
- Declaration code: `--radius: 0px; background: #211a33 !important; color: #f2ebff; border: 1px solid #6c5ce0; border-radius: 0 !important; box-shadow: inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e !important; … (9 declarations)`
- Selectors: [data-slot="hover-card-content"]
- Matched samples: ui/shadcn/hover-card.tsx:42 <PreviewCardPrimitive.Popup> slot=hover-card-content

### JCSS-0674 — 1 element records / 1 source locations
- CSS blocks 1; sections overlays-r10; states base; targets host.
- Declaration code: `box-sizing: border-box; background: #211a33 !important; color: #f2ebff; border: 1px solid #6c5ce0; border-left: 4px solid #d97fc6; border-radius: 0 !important; … (10 declarations)`
- Selectors: [data-slot="toast-viewport"] > *
- Matched samples: ui/shadcn/toast.tsx:102 <Toast.Root>

### JCSS-0675 — 1 element records / 1 source locations
- CSS blocks 1; sections overlays-r10; states base; targets host.
- Declaration code: `color: #ffe4f2`
- Selectors: [data-slot="toast-viewport"] [data-slot="toast-title"]
- Matched samples: ui/shadcn/toast.tsx:171 <Toast.Title> slot=toast-title

### JCSS-0676 — 1 element records / 1 source locations
- CSS blocks 1; sections overlays-r10; states base; targets host.
- Declaration code: `color: #d6c8e6`
- Selectors: [data-slot="toast-viewport"] [data-slot="toast-description"]
- Matched samples: ui/shadcn/toast.tsx:175 <Toast.Description> slot=toast-description

### JCSS-0677 — 1 element records / 1 source locations
- CSS blocks 1; sections overlays-r10; states focus-visible; targets host.
- Declaration code: `outline: 2px solid #ffe4f2; outline-offset: -3px`
- Selectors: [data-slot="toast-viewport"] [data-slot="toast-action"]:focus-visible / 
[data-slot="toast-viewport"] button:focus-visible
- Matched samples: ui/shadcn/toast.tsx:182 <Toast.Action> slot=toast-action

### JCSS-0678 — 1 element records / 1 source locations
- CSS blocks 1; sections overlays-r10; states base; targets host.
- Declaration code: `--radius: 0px; background: #211a33 !important; color: #f2ebff; border: 1px solid #6c5ce0; border-inline-start: 1px solid #6c5ce0; border-radius: 0 !important; … (10 declarations)`
- Selectors: [data-slot="sheet-popup"]:has([data-slot="sheet-title"] .lucide-bell)
- Matched samples: ui/shadcn/sheet.tsx:108 <SheetPrimitive.Popup> slot=sheet-popup

### JCSS-0733 — 1 element records / 1 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-radius: 0; -webkit-appearance: none; appearance: none; box-shadow: var(--jk-button-bevel); transition: background-color 80ms steps(2,end),color 80ms steps(2,end),box-shadow 80ms steps(2,end),transform 80ms steps(2,end)`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant]:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: components/sidebar/SidePanel.tsx:641 <Button> slot=button

### JCSS-0738 — 1 element records / 1 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `background: transparent; color: #e3d2f5; box-shadow: none`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="ghost"]:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action):not(.bg-red-50):not(.bg-amber-50):not(.bg-sky-50))
- Matched samples: components/sidebar/SidePanel.tsx:641 <Button> slot=button

### JCSS-0746 — 1 element records / 1 source locations
- CSS blocks 1; sections buttons-badges-r10; states disabled; targets host.
- Declaration code: `cursor: not-allowed; filter: grayscale(.65); opacity: .58; box-shadow: inset 1px 1px rgb(253 244 255/.24),inset -1px -1px #16112a`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant]:is(:disabled,[aria-disabled="true"]):where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: components/sidebar/SidePanel.tsx:641 <Button> slot=button

### JCSS-0857 — 1 element records / 1 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets ::after.
- Declaration code: `top: 0; height: 22px; opacity: 1; background-position: 0 5px,24px 4px; animation: r96-social-cat 2s step-end -1s infinite`
- Selectors: .vrcx-0-side-panel::after
- Matched samples: components/sidebar/SidePanel.tsx:382 <aside>

### JCSS-0858 — 1 element records / 1 source locations
- CSS blocks 2; sections cat-motion-r96; states base; targets ::after.
- Declaration code: `animation: none !important; transform: none; opacity: 1`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="content"]::after / .vrcx-0-side-panel::after / html.reduce-effects .vrcx-0-sidebar-surface [data-sidebar="content"]::after / html.reduce-effects .vrcx-0-side-panel::after
- Matched samples: components/sidebar/SidePanel.tsx:382 <aside>

### JCSS-0875 — 1 element records / 1 source locations
- CSS blocks 1; sections splitter-r97; states base; targets host.
- Declaration code: `--jk-sl: #6c5ce0; --jk-sb: #16112a; --jk-sd: #ffb8e6`
- Selectors: [data-slot=resizable-handle]
- Matched samples: ui/shadcn/resizable.tsx:33 <ResizablePrimitive.Separator> slot=resizable-handle

### JCSS-0878 — 1 element records / 1 source locations
- CSS blocks 1; sections splitter-r97; states base; targets host, ::before.
- Declaration code: `background: var(--jk-sl); box-shadow: 1px 0 #16112a`
- Selectors: [data-slot=resizable-handle]:not(.bg-transparent) / [data-slot=resizable-handle].bg-transparent::before
- Matched samples: ui/shadcn/resizable.tsx:33 <ResizablePrimitive.Separator> slot=resizable-handle

### JCSS-0882 — 1 element records / 1 source locations
- CSS blocks 1; sections splitter-r97; states focus-visible; targets host.
- Declaration code: `outline: 1px dotted #ff7fcf; outline-offset: 1px`
- Selectors: [data-slot=resizable-handle]:focus-visible
- Matched samples: ui/shadcn/resizable.tsx:33 <ResizablePrimitive.Separator> slot=resizable-handle

### JCSS-0883 — 1 element records / 1 source locations
- CSS blocks 1; sections splitter-r97; states base; targets host.
- Declaration code: `width: 4px; height: 16px; border-radius: 0; box-shadow: inset 0 0 0 1px var(--jk-sl); background: linear-gradient(#0000 2px,var(--jk-sd) 0 4px,#0000 0 7px,var(--jk-sd) 0 9px,#0000 0 12px,var(--jk-sd) 0 14px,#0000 0) 1px 0/2px 100% no-repeat var(--jk-sb)`
- Selectors: [data-slot=resizable-handle]>div
- Matched samples: ui/shadcn/resizable.tsx:42 <div>

### JCSS-0889 — 1 element records / 1 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets host.
- Declaration code: `overflow: visible`
- Selectors: [data-slot="toast-viewport"] [data-slot="toast-content"]
- Matched samples: ui/shadcn/toast.tsx:152 <Toast.Content> slot=toast-content

### JCSS-0918 — 1 element records / 1 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states base; targets host.
- Declaration code: `border-radius: 0; appearance: none; box-shadow: var(--jk-button-bevel); --jk-portal-open-face: var(--jk-button-hover-face); --jk-portal-open-text: var(--jk-button-hover-text); transition: background-color 80ms steps(2,end),color 80ms steps(2,end),box-shadow 80ms steps(2,end),transform 80ms steps(2,end)`
- Selectors: :is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))
- Matched samples: ui/shadcn/dialog.tsx:84 <Button> slot=button

### JCSS-0002 — 0 element records / 0 source locations
- CSS blocks 1; sections native-icons; states base; targets host.
- Declaration code: `--wd-icon-chevron: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20shape-rendering%3D%22crispEdges%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M3%205h2v1h-2%20M11%205h2v1h-2%20M4%206h2v1h-2%20M10%206h2v1h-2%20M5%207h2v1h-2%20M9%207h2v1h-2%20M6%208h4v1h-4%20M7%209h2v1h-2%22%2F%3E%3C%2Fsvg%3E"); --wd-native-chevron: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20shape-rendering%3D%22crispEdges%22%3E%3Cpath%20fill%3D%22%23f2ebff%22%20d%3D%22M3%205h2v1h-2%20M11%205h2v1h-2%20M4%206h2v1h-2%20M10%206h2v1h-2%20M5%207h2v1h-2%20M9%207h2v1h-2%20M6%208h4v1h-4%20M7%209h2v1h-2%22%2F%3E%3C%2Fsvg%3E"); --wd-icon-clock: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20shape-rendering%3D%22crispEdges%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M7%200h2v1h-2m-3%200h8v1h-8m-1%200h3v1h-3m7-1h3v1h-3m-8%200h2v1h-2m5-1h2v5h-2m5-5h2v1h-2m-11%200h2v2h-2m12-2h2v2h-2m-12%200h1v1h-1m13-1h1v1h-1m-14%200h2v2h-2m14-2h2v2h-2m-7-1h4v1h-4m-6%200h1v1h-1m8-1h2v1h-2m5-1h1v1h-1m-13%200h2v2h-2m12-2h2v2h-2m-11%200h2v1h-2m10-1h2v1h-2m-9%200h3v1h-3m7-1h3v1h-3m-6%200h8v1h-8m3%200h2v1h-2%22%2F%3E%3C%2Fsvg%3E"); --wd-native-clock: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20shape-rendering%3D%22crispEdges%22%3E%3Cpath%20fill%3D%22%23f2ebff%22%20d%3D%22M7%200h2v1h-2m-3%200h8v1h-8m-1%200h3v1h-3m7-1h3v1h-3m-8%200h2v1h-2m5-1h2v5h-2m5-5h2v1h-2m-11%200h2v2h-2m12-2h2v2h-2m-12%200h1v1h-1m13-1h1v1h-1m-14%200h2v2h-2m14-2h2v2h-2m-7-1h4v1h-4m-6%200h1v1h-1m8-1h2v1h-2m5-1h1v1h-1m-13%200h2v2h-2m12-2h2v2h-2m-11%200h2v1h-2m10-1h2v1h-2m-9%200h3v1h-3m7-1h3v1h-3m-6%200h8v1h-8m3%200h2v1h-2%22%2F%3E%3C%2Fsvg%3E"); --wd-icon-right: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20shape-rendering%3D%22crispEdges%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M5%203h2v1h-2%20M6%204h2v1h-2%20M7%205h2v1h-2%20M8%206h2v1h-2%20M9%207h2v1h-2%20M9%208h2v1h-2%20M8%209h2v1h-2%20M7%2010h2v1h-2%20M6%2011h2v1h-2%20M5%2012h2v1h-2%22%2F%3E%3C%2Fsvg%3E"); --wd-native-right: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20shape-rendering%3D%22crispEdges%22%3E%3Cpath%20fill%3D%22%23f2ebff%22%20d%3D%22M5%203h2v1h-2%20M6%204h2v1h-2%20M7%205h2v1h-2%20M8%206h2v1h-2%20M9%207h2v1h-2%20M9%208h2v1h-2%20M8%209h2v1h-2%20M7%2010h2v1h-2%20M6%2011h2v1h-2%20M5%2012h2v1h-2%22%2F%3E%3C%2Fsvg%3E"); … (13 declarations)`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0003 — 0 element records / 0 source locations
- CSS blocks 1; sections assets; states base; targets host.
- Declaration code: `--jk-mask-s1-s: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%208%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M0%200H16V2A8%206%200%200%201%200%202ZM6.8%204.52a1.2%201.2%200%201%200%202.4%200a1.2%201.2%200%201%200%20-2.4%200Z%22%2F%3E%3C%2Fsvg%3E"); --jk-bg-light-s1-s: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%208%22%3E%3Cpath%20fill%3D%22%234a3d61%22%20d%3D%22M0%200H16V2A8%206%200%200%201%200%202ZM6.8%204.52a1.2%201.2%200%201%200%202.4%200a1.2%201.2%200%201%200%20-2.4%200Z%22%2F%3E%3C%2Fsvg%3E"); --jk-bg-dark-s1-s: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%208%22%3E%3Cpath%20fill%3D%22%23ead9e2%22%20d%3D%22M0%200H16V2A8%206%200%200%201%200%202ZM6.8%204.52a1.2%201.2%200%201%200%202.4%200a1.2%201.2%200%201%200%20-2.4%200Z%22%2F%3E%3C%2Fsvg%3E"); --jk-mask-s1-l: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2012%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M0%200H24V3A12%209%200%200%201%200%203ZM10.2%206.78a1.8%201.8%200%201%200%203.6%200a1.8%201.8%200%201%200%20-3.6%200Z%22%2F%3E%3C%2Fsvg%3E"); --jk-bg-light-s1-l: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2012%22%3E%3Cpath%20fill%3D%22%234a3d61%22%20d%3D%22M0%200H24V3A12%209%200%200%201%200%203ZM10.2%206.78a1.8%201.8%200%201%200%203.6%200a1.8%201.8%200%201%200%20-3.6%200Z%22%2F%3E%3C%2Fsvg%3E"); --jk-bg-dark-s1-l: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2012%22%3E%3Cpath%20fill%3D%22%23ead9e2%22%20d%3D%22M0%200H24V3A12%209%200%200%201%200%203ZM10.2%206.78a1.8%201.8%200%201%200%203.6%200a1.8%201.8%200%201%200%20-3.6%200Z%22%2F%3E%3C%2Fsvg%3E"); … (44 declarations)`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0004 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `background-color: currentColor; -webkit-mask: var(--px) center/contain no-repeat; mask: var(--px) center/contain no-repeat`
- Selectors: svg.lucide:is(.lucide-activity,.lucide-app-window,.lucide-apple,.lucide-archive-restore,.lucide-archive,.lucide-arrow-down-to-line,.lucide-arrow-down,.lucide-arrow-left-from-line,.lucide-arrow-left-right,.lucide-arrow-left,.lucide-arrow-right-to-line,.lucide-arrow-right,.lucide-arrow-up-down,.lucide-arrow-up-right,.lucide-arrow-up-to-line,.lucide-arrow-up,.lucide-badge-check,.lucide-ban,.lucide-bell-off,.lucide-bell,.lucide-book-open,.lucide-bookmark,.lucide-bot,.lucide-box,.lucide-boxes,.lucide-brush,.lucide-bug,.lucide-calendar-clock,.lucide-calendar-days,.lucide-calendar-range,.lucide-calendar,.lucide-camera,.lucide-case-sensitive,.lucide-chart-bar,.lucide-check-check,.lucide-check,.lucide-chevron-down,.lucide-chevron-left,.lucide-chevron-right,.lucide-chevron-up,.lucide-chevrons-down-up,.lucide-chevrons-down,.lucide-chevrons-up-down,.lucide-circle-alert,.lucide-circle-check-big,.lucide-circle-check,.lucide-circle-dashed,.lucide-circle-minus,.lucide-circle-question-mark,.lucide-circle-x,.lucide-circle,.lucide-clipboard-copy,.lucide-clock-3,.lucide-clock,.lucide-cloud-off,.lucide-cloud,.lucide-code-xml,.lucide-code,.lucide-coffee,.lucide-columns-3,.lucide-compass,.lucide-contact-round,.lucide-contact,.lucide-copy,.lucide-crown,.lucide-cuboid,.lucide-database-backup,.lucide-database,.lucide-dices,.lucide-door-open,.lucide-download,.lucide-earth,.lucide-ellipsis-vertical,.lucide-ellipsis,.lucide-eraser,.lucide-external-link,.lucide-eye-off,.lucide-eye,.lucide-face-slightly-smiling,.lucide-file-archive,.lucide-file-search,.lucide-file-text,.lucide-flag,.lucide-flask-conical,.lucide-folder-heart,.lucide-folder-open,.lucide-folder-plus,.lucide-folder-search,.lucide-folder-tree,.lucide-folder,.lucide-footprints,.lucide-gamepad-2,.lucide-gauge,.lucide-gem,.lucide-gift,.lucide-globe,.lucide-grip-vertical,.lucide-hand,.lucide-hard-drive,.lucide-hash,.lucide-heart,.lucide-house,.lucide-id-card,.lucide-image-off,.lucide-image,.lucide-images,.lucide-inbox,.lucide-info,.lucide-key-round,.lucide-keyboard,.lucide-languages,.lucide-layers,.lucide-layout-dashboard,.lucide-layout-grid,.lucide-link-2,.lucide-link,.lucide-list-checks,.lucide-list-filter,.lucide-list-plus,.lucide-list-x,.lucide-list,.lucide-loader-circle,.lucide-lock-open,.lucide-lock,.lucide-log-in,.lucide-log-out,.lucide-logs,.lucide-mail-plus,.lucide-mail-question-mark,.lucide-mail,.lucide-map-pin,.lucide-map-pinned,.lucide-maximize-2,.lucide-message-circle,.lucide-message-square-plus,.lucide-message-square-text,.lucide-message-square-x,.lucide-message-square,.lucide-minimize-2,.lucide-minus,.lucide-monitor,.lucide-moon,.lucide-mouse-pointer-click,.lucide-move-right,.lucide-music,.lucide-network,.lucide-notebook-pen,.lucide-package,.lucide-palette,.lucide-panel-left-open,.lucide-panel-left,.lucide-panel-right-close,.lucide-panel-right-open,.lucide-panel-right,.lucide-pencil-line,.lucide-pencil,.lucide-person-standing,.lucide-pin-off,.lucide-pin,.lucide-play,.lucide-plug,.lucide-plus,.lucide-rectangle-goggles,.lucide-refresh-ccw,.lucide-refresh-cw,.lucide-regex,.lucide-repeat,.lucide-reply,.lucide-rocket,.lucide-rotate-ccw-clock,.lucide-rotate-ccw,.lucide-rotate-cw,.lucide-rows-2,.lucide-rows-3,.lucide-rows-4,.lucide-rss,.lucide-save-off,.lucide-save,.lucide-scan-face,.lucide-scan-search,.lucide-search-x,.lucide-search,.lucide-send,.lucide-server-cog,.lucide-settings-2,.lucide-settings,.lucide-share-2,.lucide-shield-alert,.lucide-shield-check,.lucide-shield-off,.lucide-shield-user,.lucide-shield,.lucide-shirt,.lucide-shuffle,.lucide-sliders-horizontal,.lucide-smartphone,.lucide-sparkles,.lucide-sprout,.lucide-square-pen,.lucide-square-terminal,.lucide-square,.lucide-star-off,.lucide-star,.lucide-sticky-note,.lucide-sun,.lucide-table-2,.lucide-table,.lucide-tag,.lucide-tags,.lucide-terminal,.lucide-text-search,.lucide-ticket,.lucide-timer-off,.lucide-tractor,.lucide-trash,.lucide-trending-up,.lucide-triangle-alert,.lucide-triangles-centerline-dashed-horizontal,.lucide-triangles-centerline-dashed-vertical,.lucide-type,.lucide-ungroup,.lucide-upload,.lucide-user-check,.lucide-user-minus,.lucide-user-plus,.lucide-user-round-check,.lucide-user-round-minus,.lucide-user-round-search,.lucide-user-round,.lucide-user-search,.lucide-user-star,.lucide-user-x,.lucide-user,.lucide-users-round,.lucide-users,.lucide-video,.lucide-volume-2,.lucide-volume-x,.lucide-waypoints,.lucide-wrench,.lucide-x,.lucide-zoom-in,.lucide-zoom-out)
- Matched samples: （无直接源码候选）

### JCSS-0006 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 1h1v1h-1 M8 2h3v1h-3 M8 3h3v1h-3 M8 4h3v1h-3 M8 5h4v1h-4 M7 6h2v1h-2 M10 6h2v1h-2 M1 7h4v1h-4 M7 7h2v1h-2 M10 7h5v1h-5 M1 8h5v1h-5 M7 8h2v1h-2 M11 8h4v1h-4 M4 9h2v1h-2 M7 9h2v1h-2 M4 10h4v1h-4 M5 11h3v1h-3 M5 12h3v1h-3 M5 13h3v1h-3 M6 14h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-activity
- Matched samples: （无直接源码候选）

### JCSS-0007 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 2h14v2h-14m-1 0h16v2h-16m0 0h2v6h-2m14-6h2v6h-2m-13 0h14v2h-14'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-app-window
- Matched samples: （无直接源码候选）

### JCSS-0008 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 1h2v2h-2m-2-1h1v1h-1m5-1h1v1h-1m-8 0h12v1h-12m-1 0h3v1h-3m5-1h4v1h-4m6-1h3v1h-3m-11 0h2v1h-2m12-1h2v1h-2m-12 0h1v1h-1m13-1h1v1h-1m-14 0h2v1h-2m14-1h2v1h-2m-13 0h1v1h-1m13-1h1v1h-1m-13 0h2v3h-2m12-3h2v3h-2m-11 0h2v1h-2m10-1h2v1h-2m-10 0h3v1h-3m4-1h4v1h-4m5-1h3v1h-3m-8 0h10v1h-10m2 0h1v1h-1m5-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-apple
- Matched samples: （无直接源码候选）

### JCSS-0009 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h14v2h-14m-1 0h2v1h-2m14-1h2v1h-2m-14 0h16v1h-16m1 0h14v1h-14m1 0h2v7h-2m10-7h2v7h-2m-5-6h2v1h-2m-1 0h4v1h-4m-1 0h6v2h-6m2 0h2v4h-2m-5-2h4v1h-4m8-1h4v1h-4m-7 0h3v1h-3m7-1h3v1h-3'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-archive-restore
- Matched samples: （无直接源码候选）

### JCSS-0010 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h14v2h-14m-1 0h2v1h-2m14-1h2v1h-2m-14 0h16v1h-16m1 0h14v1h-14m1 0h2v7h-2m10-7h2v7h-2m-6-6h4v2h-4m-4 4h12v1h-12m1 0h10v1h-10'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-archive
- Matched samples: （无直接源码候选）

### JCSS-0011 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 1h2v8h-2m-4-2h2v1h-2m8-1h2v1h-2m-7 0h2v1h-2m6-1h2v1h-2m-5 0h6v1h-6m1 0h4v1h-4m1 0h2v1h-2m-4 1h10v2h-10'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-down-to-line
- Matched samples: （无直接源码候选）

### JCSS-0012 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 3h2v7h-2m-4-3h1v1h-1m9-1h1v1h-1m-9 0h2v1h-2m8-1h2v1h-2m-7 0h2v1h-2m6-1h2v1h-2m-5 0h6v1h-6m1 0h4v1h-4m1 0h2v2h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-down
- Matched samples: （无直接源码候选）

### JCSS-0013 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M13 3h2v1h-2 M4 4h2v1h-2 M13 4h2v1h-2 M3 5h2v1h-2 M13 5h2v1h-2 M2 6h2v1h-2 M13 6h2v1h-2 M1 7h14v1h-14 M1 8h14v1h-14 M2 9h2v1h-2 M13 9h2v1h-2 M3 10h2v1h-2 M13 10h2v1h-2 M4 11h2v1h-2 M13 11h2v1h-2 M13 12h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-left-from-line
- Matched samples: （无直接源码候选）

### JCSS-0014 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h1v1h-1m-1 0h2v1h-2m-2 0h3v1h-3m0 0h12v2h-12m1 0h3v1h-3m1 0h2v1h-2m6 0h2v1h-2m0 0h3v1h-3m-8 0h12v2h-12m9 0h3v1h-3m-1 0h2v1h-2m0 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-left-right
- Matched samples: （无直接源码候选）

### JCSS-0015 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 3h2v1h-2m-1 0h2v1h-2m-1 0h2v1h-2m-1 0h2v1h-2m-2 0h11v2h-11m2 0h2v1h-2m1 0h2v1h-2m1 0h2v1h-2m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-left
- Matched samples: （无直接源码候选）

### JCSS-0016 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 3h2v1h-2 M1 4h2v1h-2 M10 4h2v1h-2 M1 5h2v1h-2 M11 5h2v1h-2 M1 6h2v1h-2 M12 6h2v1h-2 M1 7h14v1h-14 M1 8h14v1h-14 M1 9h2v1h-2 M12 9h2v1h-2 M1 10h2v1h-2 M11 10h2v1h-2 M1 11h2v1h-2 M10 11h2v1h-2 M1 12h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-right-to-line
- Matched samples: （无直接源码候选）

### JCSS-0017 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 3h2v1h-2m1 0h2v1h-2m1 0h2v1h-2m1 0h2v1h-2m-7 0h11v2h-11m7 0h2v1h-2m-1 0h2v1h-2m-1 0h2v1h-2m-1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-right
- Matched samples: （无直接源码候选）

### JCSS-0018 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 2h3v1h-3m7-1h2v8h-2m-7-7h4v1h-4m-1 0h6v1h-6m-1 0h2v1h-2m3-1h4v1h-4m0 0h2v8h-2m4-4h4v1h-4m5-1h2v1h-2m-5 0h6v1h-6m1 0h4v1h-4m1 0h3v1h-3'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-up-down
- Matched samples: （无直接源码候选）

### JCSS-0019 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 4h8v2h-8m4 0h4v1h-4m-1 0h5v1h-5m-1 0h3v1h-3m4-1h2v4h-2m-5-3h3v1h-3m-1 0h3v1h-3m0 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-up-right
- Matched samples: （无直接源码候选）

### JCSS-0020 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 1h10v2h-10m4 1h2v1h-2m-1 0h4v1h-4m-1 0h6v1h-6m-1 0h2v1h-2m3-1h2v8h-2m3-8h2v1h-2m-7 0h2v1h-2m8-1h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-up-to-line
- Matched samples: （无直接源码候选）

### JCSS-0021 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 2h2v2h-2m-1 0h4v1h-4m-1 0h6v1h-6m-1 0h2v1h-2m3-1h2v7h-2m3-7h2v1h-2m-7 0h2v1h-2m8-1h2v1h-2m-8 0h1v1h-1m9-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-arrow-up
- Matched samples: （无直接源码候选）

### JCSS-0022 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-2 0h6v1h-6m-2 0h4v1h-4m6-1h4v1h-4m-7 0h3v1h-3m9-1h3v1h-3m-9 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m9-2h1v1h-1m3-1h2v2h-2m-4-1h2v1h-2m-9 0h2v2h-2m5-2h1v1h-1m3-1h2v1h-2m6-1h2v2h-2m-9-1h4v1h-4m-4 0h2v2h-2m5-2h2v1h-2m7-1h2v2h-2m-11 0h2v1h-2m10-1h2v1h-2m-10 0h3v1h-3m9-1h3v1h-3m-8 0h4v1h-4m6-1h4v1h-4m-4 0h6v1h-6m2 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-badge-check
- Matched samples: （无直接源码候选）

### JCSS-0023 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h3v1h-3m10-1h2v1h-2m-11 0h5v1h-5m12-1h2v2h-2m-12-1h2v1h-2m3-1h3v1h-3m-3 0h1v1h-1m4-1h3v1h-3m9-1h1v1h-1m-14 0h2v2h-2m6-2h3v1h-3m8-1h2v2h-2m-7-1h3v1h-3m-6 0h1v1h-1m7-1h3v1h-3m6-1h1v1h-1m-13 0h2v2h-2m8-2h3v1h-3m4-1h2v1h-2m-3 0h5v1h-5m-8 0h2v1h-2m9-1h3v1h-3m-8 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-ban
- Matched samples: （无直接源码候选）

### JCSS-0024 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 0h1v1h-1m6-1h2v1h-2m-6 0h2v1h-2m4-1h6v1h-6m-4 0h3v1h-3m4-1h2v1h-2m4-1h3v1h-3m-7 0h3v1h-3m8-1h3v1h-3m-7 0h3v1h-3m8-1h2v4h-2m-8-3h4v1h-4m0 0h5v1h-5m0 0h2v1h-2m3-1h3v1h-3m-4 0h2v2h-2m5-2h3v1h-3m5-1h2v2h-2m-4-1h3v1h-3m-7 0h11v1h-11m0 0h12v1h-12m10 0h3v1h-3m-5 0h4v2h-4m6-2h3v1h-3m1 0h2v1h-2m1 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-bell-off
- Matched samples: （无直接源码候选）

### JCSS-0025 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4 M4 2h8v1h-8 M3 3h3v1h-3 M10 3h3v1h-3 M3 4h2v1h-2 M11 4h2v1h-2 M2 5h2v1h-2 M12 5h2v1h-2 M2 6h2v1h-2 M12 6h2v1h-2 M2 7h2v1h-2 M12 7h2v1h-2 M1 8h2v1h-2 M13 8h2v1h-2 M1 9h2v1h-2 M13 9h2v1h-2 M1 10h2v1h-2 M13 10h2v1h-2 M1 11h14v1h-14 M1 12h14v1h-14 M6 13h4v1h-4 M6 14h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-bell
- Matched samples: （无直接源码候选）

### JCSS-0026 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h6v1h-6m8-1h6v1h-6m-8 0h14v1h-14m-1 0h2v9h-2m7-9h2v9h-2m7-9h2v9h-2m-13 0h14v1h-14m1 0h12v1h-12m5 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-book-open
- Matched samples: （无直接源码候选）

### JCSS-0027 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 1h10v2h-10m-1 0h2v10h-2m10-10h2v10h-2m-5-2h2v1h-2m-2 0h6v1h-6m-3 0h5v1h-5m7-1h5v1h-5m-6 0h2v1h-2m8-1h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-bookmark
- Matched samples: （无直接源码候选）

### JCSS-0028 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 2h4v2h-4m-1 0h8v1h-8m-2 0h12v1h-12m0 0h2v2h-2m10-2h2v2h-2m-11 0h3v2h-3m4-2h2v3h-2m4-3h2v3h-2m3-3h3v2h-3m-10 0h2v2h-2m10-2h2v2h-2m-10 0h12v2h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-bot
- Matched samples: （无直接源码候选）

### JCSS-0029 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4m-2 0h3v1h-3m5-1h3v1h-3m-7 0h4v1h-4m8-1h4v1h-4m-9 0h3v1h-3m11-1h3v1h-3m-11 0h4v1h-4m10-1h4v1h-4m-10 0h2v5h-2m3-5h3v1h-3m5-1h3v1h-3m4-1h2v5h-2m-8-4h6v1h-6m2 0h2v5h-2m-6-2h3v1h-3m11-1h3v1h-3m-10 0h4v1h-4m8-1h4v1h-4m-6 0h8v1h-8m2 0h4v1h-4m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-box
- Matched samples: （无直接源码候选）

### JCSS-0030 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4m-2 0h8v1h-8m0 0h3v1h-3m5-1h3v1h-3m-5 0h8v1h-8m0 0h2v2h-2m3-2h2v2h-2m3-2h2v2h-2m-8 0h12v1h-12m-1 0h3v1h-3m4-1h6v2h-6m7-2h3v1h-3m-12 0h4v1h-4m12-1h4v1h-4m-12 0h16v1h-16m0 0h2v1h-2m3-1h3v1h-3m4-1h2v2h-2m3-2h3v1h-3m4-1h2v1h-2m-13 0h2v1h-2m3-1h2v1h-2m6-1h2v1h-2m3-1h2v1h-2m-12 0h14v1h-14m2 0h4v1h-4m6-1h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-boxes
- Matched samples: （无直接源码候选）

### JCSS-0031 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M13 0h1v1h-1m-2 0h4v1h-4m-1 0h3v1h-3m4-1h2v1h-2m-5 0h3v1h-3m4-1h2v1h-2m-5 0h3v1h-3m4-1h3v1h-3m-5 0h3v1h-3m4-1h3v1h-3m-5 0h3v1h-3m4-1h3v1h-3m-5 0h7v1h-7m-1 0h3v1h-3m4-1h3v1h-3m-6 0h8v1h-8m-1 0h3v1h-3m4-1h4v1h-4m-4 0h2v2h-2m5-2h2v1h-2m-1 0h2v1h-2m-5 0h7v1h-7m1 0h5v1h-5'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-brush
- Matched samples: （无直接源码候选）

### JCSS-0032 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h1v1h-1m5-1h1v1h-1m-5 0h6v2h-6m-4 0h2v2h-2m4-2h2v1h-2m4-1h2v1h-2m4-1h2v2h-2m-8-1h6v1h-6m-3 0h12v1h-12m1 0h2v2h-2m8-2h2v2h-2m-4-1h2v5h-2m-6-4h4v2h-4m10-2h4v2h-4m-8 0h2v1h-2m8-1h2v1h-2m-9 0h4v1h-4m8-1h4v1h-4m-9 0h14v1h-14m0 0h2v2h-2m5-2h4v1h-4m7-1h2v2h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-bug
- Matched samples: （无直接源码候选）

### JCSS-0033 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h1v1h-1m5-1h1v1h-1m-8 0h12v1h-12m-1 0h14v1h-14m0 0h2v2h-2m3-2h2v1h-2m6-1h2v1h-2m3-1h2v3h-2m-12-1h6v2h-6m7-1h5v1h-5m-7 0h2v6h-2m6-6h7v1h-7m-1 0h3v1h-3m4-1h1v1h-1m3-1h2v2h-2m-7-1h2v4h-2m4-4h2v2h-2m4-1h2v1h-2m-4 0h3v1h-3m4-1h1v1h-1m-1 0h2v1h-2m-12 0h5v1h-5m6-1h3v1h-3m5-1h3v1h-3m-10 0h4v1h-4m6-1h6v1h-6m2 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-calendar-clock
- Matched samples: （无直接源码候选）

### JCSS-0034 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h1v1h-1m5-1h1v1h-1m-8 0h12v1h-12m-1 0h14v1h-14m0 0h2v2h-2m3-2h2v1h-2m6-1h2v1h-2m3-1h2v2h-2m-12 0h14v2h-14m0 0h2v6h-2m12-6h2v6h-2m-8-5h1v4h-1m2-4h2v1h-2m3-1h2v1h-2m0 0h1v2h-1m-3 0h2v1h-2m3-1h2v1h-2m-9 1h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-calendar-days
- Matched samples: （无直接源码候选）

### JCSS-0035 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h1v1h-1m5-1h1v1h-1m-8 0h12v1h-12m-1 0h14v1h-14m0 0h2v2h-2m3-2h2v1h-2m6-1h2v1h-2m3-1h2v2h-2m-12 0h14v2h-14m0 0h2v6h-2m12-6h2v6h-2m-9-5h2v1h-2m3-1h5v2h-5m-3-1h1v1h-1m0 0h5v2h-5m7-2h1v2h-1m-10 1h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-calendar-range
- Matched samples: （无直接源码候选）

### JCSS-0036 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h1v1h-1m5-1h1v1h-1m-8 0h12v1h-12m-1 0h14v1h-14m0 0h2v2h-2m3-2h2v1h-2m6-1h2v1h-2m3-1h2v2h-2m-12 0h14v2h-14m0 0h2v6h-2m12-6h2v6h-2m-12 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-calendar
- Matched samples: （无直接源码候选）

### JCSS-0037 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 2h6v1h-6m-1 0h8v1h-8m-3 0h5v1h-5m9-1h5v1h-5m-9 0h3v1h-3m11-1h3v1h-3m-12 0h2v6h-2m6-6h4v1h-4m8-1h2v6h-2m-9-5h6v1h-6m0 0h2v2h-2m4-2h2v2h-2m-3 0h4v1h-4m-5 1h14v2h-14'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-camera
- Matched samples: （无直接源码候选）

### JCSS-0038 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 3h1v1h-1m-1 0h3v1h-3m-1 0h4v1h-4m9-1h4v1h-4m-9 0h2v2h-2m3-2h2v2h-2m5-2h6v1h-6m-1 0h2v2h-2m4-2h3v1h-3m-12 0h7v2h-7m13-2h2v1h-2m-5 0h3v1h-3m4-1h3v1h-3m-13 0h2v1h-2m6-1h2v1h-2m4-1h6v1h-6m-9 0h1v1h-1m6-1h1v1h-1m5-1h1v1h-1m2-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-case-sensitive
- Matched samples: （无直接源码候选）

### JCSS-0039 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h2v12h-2m3-10h3v2h-3m0 1h9v2h-9m0 2h7v1h-7m0 0h6v1h-6m-3 1h14v1h-14m1 0h13v1h-13'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-chart-bar
- Matched samples: （无直接源码候选）

### JCSS-0040 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M11 3h2v1h-2m-1 0h3v1h-3m-1 0h3v1h-3m-1 0h3v1h-3m6-1h1v1h-1m-13 0h1v1h-1m6-1h3v1h-3m6-1h2v1h-2m-12 0h2v1h-2m5-1h3v1h-3m6-1h2v1h-2m-10 0h2v1h-2m3-1h3v1h-3m6-1h2v1h-2m-8 0h4v1h-4m5-1h4v1h-4m-4 0h2v1h-2m4-1h3v1h-3m1 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-check-check
- Matched samples: （无直接源码候选）

### JCSS-0041 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M11 5h2v1h-2 M2 6h2v1h-2 M9 6h2v1h-2 M3 7h2v1h-2 M8 7h2v1h-2 M4 8h2v1h-2 M7 8h2v1h-2 M5 9h4v1h-4 M6 10h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-check
- Matched samples: （无直接源码候选）

### JCSS-0042 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 5h2v1h-2 M11 5h2v1h-2 M4 6h2v1h-2 M10 6h2v1h-2 M5 7h2v1h-2 M9 7h2v1h-2 M6 8h4v1h-4 M7 9h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-chevron-down
- Matched samples: （无直接源码候选）

### JCSS-0043 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 3h2v1h-2 M8 4h2v1h-2 M7 5h2v1h-2 M6 6h2v1h-2 M5 7h2v1h-2 M5 8h2v1h-2 M6 9h2v1h-2 M7 10h2v1h-2 M8 11h2v1h-2 M9 12h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-chevron-left
- Matched samples: （无直接源码候选）

### JCSS-0044 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 3h2v1h-2 M6 4h2v1h-2 M7 5h2v1h-2 M8 6h2v1h-2 M9 7h2v1h-2 M9 8h2v1h-2 M8 9h2v1h-2 M7 10h2v1h-2 M6 11h2v1h-2 M5 12h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-chevron-right
- Matched samples: （无直接源码候选）

### JCSS-0045 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 5h2v1h-2 M6 6h4v1h-4 M5 7h2v1h-2 M9 7h2v1h-2 M4 8h2v1h-2 M10 8h2v1h-2 M3 9h2v1h-2 M11 9h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-chevron-up
- Matched samples: （无直接源码候选）

### JCSS-0046 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 2h2v1h-2m6-1h2v1h-2m-6 0h3v1h-3m5-1h3v1h-3m-4 0h6v1h-6m1 0h4v1h-4m1 0h2v1h-2m0 2h2v1h-2m-1 0h4v1h-4m-1 0h6v1h-6m-1 0h3v1h-3m5-1h3v1h-3m-5 0h2v1h-2m6-1h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-chevrons-down-up
- Matched samples: （无直接源码候选）

### JCSS-0047 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 3h1v1h-1m7-1h1v1h-1m-7 0h2v1h-2m6-1h2v1h-2m-5 0h2v1h-2m4-1h2v1h-2m-3 0h4v1h-4m1 0h2v1h-2m-3 0h2v1h-2m6-1h2v1h-2m-6 0h3v1h-3m5-1h3v1h-3m-4 0h6v1h-6m1 0h4v1h-4m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-chevrons-down
- Matched samples: （无直接源码候选）

### JCSS-0048 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 2h2v1h-2m-1 0h4v1h-4m-1 0h2v1h-2m4-1h2v1h-2m-5 0h2v1h-2m6-1h2v1h-2m-6 0h1v1h-1m7-1h1v1h-1m-7 2h1v1h-1m7-1h1v1h-1m-7 0h2v1h-2m6-1h2v1h-2m-5 0h2v1h-2m4-1h2v1h-2m-3 0h4v1h-4m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-chevrons-up-down
- Matched samples: （无直接源码候选）

### JCSS-0049 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-6-1h2v4h-2m-6-3h1v1h-1m13-1h1v1h-1m-14 0h2v2h-2m14-2h2v2h-2m-13 0h1v1h-1m13-1h1v1h-1m-13 0h2v2h-2m6-2h2v1h-2m6-1h2v2h-2m-11 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-circle-alert
- Matched samples: （无直接源码候选）

### JCSS-0050 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h2v1h-2m4-1h1v1h-1m-12 0h2v1h-2m11-1h2v1h-2m-12 0h2v2h-2m11-2h2v1h-2m-1 0h2v1h-2m-10 0h1v1h-1m9-1h2v1h-2m4-1h1v1h-1m-14 0h2v2h-2m5-2h2v1h-2m4-1h2v1h-2m5-1h2v2h-2m-8-1h4v1h-4m-5 0h1v1h-1m6-1h2v1h-2m7-1h1v1h-1m-13 0h2v2h-2m12-2h2v2h-2m-11 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-circle-check-big
- Matched samples: （无直接源码候选）

### JCSS-0051 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-3-1h1v1h-1m-9 0h1v1h-1m8-1h2v1h-2m5-1h1v1h-1m-14 0h2v2h-2m5-2h1v1h-1m3-1h2v1h-2m6-1h2v2h-2m-9-1h4v1h-4m-4 0h1v1h-1m5-1h2v1h-2m8-1h1v1h-1m-13 0h2v2h-2m12-2h2v2h-2m-11 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-circle-check
- Matched samples: （无直接源码候选）

### JCSS-0052 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-1 0h4v1h-4m-3 0h2v1h-2m8-1h2v1h-2m-9 0h2v1h-2m10-1h2v1h-2m-10 0h1v1h-1m11-1h1v1h-1m-12 1h1v1h-1m13-1h1v1h-1m-14 0h2v2h-2m14-2h2v2h-2m-13 0h1v1h-1m13-1h1v1h-1m-12 1h1v1h-1m11-1h1v1h-1m-11 0h2v1h-2m10-1h2v1h-2m-9 0h2v1h-2m8-1h2v1h-2m-5 0h4v1h-4m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-circle-dashed
- Matched samples: （无直接源码候选）

### JCSS-0053 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-12 0h1v1h-1m13-1h1v1h-1m-14 0h2v2h-2m5-2h6v2h-6m9-2h2v2h-2m-13 0h1v1h-1m13-1h1v1h-1m-13 0h2v2h-2m12-2h2v2h-2m-11 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-circle-minus
- Matched samples: （无直接源码候选）

### JCSS-0054 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m5-2h4v1h-4m7-1h2v2h-2m-8-1h6v1h-6m-4 0h1v1h-1m4-1h2v1h-2m4-1h2v1h-2m5-1h1v1h-1m-14 0h2v2h-2m8-2h3v1h-3m6-1h2v2h-2m-7-1h3v1h-3m-6 0h1v1h-1m13-1h1v1h-1m-13 0h2v2h-2m12-2h2v2h-2m-6-1h2v1h-2m-5 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-circle-question-mark
- Matched samples: （无直接源码候选）

### JCSS-0055 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-8-1h2v1h-2m4-1h2v1h-2m-8 0h1v1h-1m4-1h6v1h-6m9-1h1v1h-1m-14 0h2v2h-2m6-2h4v2h-4m8-2h2v2h-2m-13 0h1v1h-1m4-1h6v1h-6m9-1h1v1h-1m-13 0h2v2h-2m4-2h2v1h-2m4-1h2v1h-2m4-1h2v2h-2m-11 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-circle-x
- Matched samples: （无直接源码候选）

### JCSS-0056 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 1h2v1h-2 M4 2h8v1h-8 M3 3h4v1h-4 M9 3h4v1h-4 M2 4h3v1h-3 M11 4h3v1h-3 M2 5h2v1h-2 M12 5h2v1h-2 M2 6h2v1h-2 M12 6h2v1h-2 M1 7h2v1h-2 M13 7h2v1h-2 M1 8h2v1h-2 M13 8h2v1h-2 M2 9h2v1h-2 M12 9h2v1h-2 M2 10h2v1h-2 M12 10h2v1h-2 M2 11h3v1h-3 M11 11h3v1h-3 M3 12h4v1h-4 M9 12h4v1h-4 M4 13h8v1h-8 M7 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-circle
- Matched samples: （无直接源码候选）

### JCSS-0057 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 0h4v1h-4m-2 0h8v1h-8m-2 0h4v1h-4m8-1h4v1h-4m-8 0h12v1h-12m0 0h2v10h-2m3-10h6v1h-6m7-1h2v3h-2m-3-1h2v1h-2m-1 0h2v1h-2m5-1h1v1h-1m-6 0h7v1h-7m-1 0h9v1h-9m1 0h3v1h-3m1 0h3v1h-3m5-1h1v1h-1m-4 0h2v1h-2m3-1h2v2h-2m-10 0h12v1h-12m2 0h8v1h-8'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-clipboard-copy
- Matched samples: （无直接源码候选）

### JCSS-0058 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m5-1h2v4h-2m5-4h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-12 0h1v1h-1m13-1h1v1h-1m-14 0h2v2h-2m7-2h4v2h-4m7-2h2v2h-2m-13 0h1v1h-1m13-1h1v1h-1m-13 0h2v2h-2m12-2h2v2h-2m-11 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-clock-3
- Matched samples: （无直接源码候选）

### JCSS-0059 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m5-1h2v5h-2m5-5h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-12 0h1v1h-1m13-1h1v1h-1m-14 0h2v2h-2m14-2h2v2h-2m-7-1h4v1h-4m-6 0h1v1h-1m8-1h2v1h-2m5-1h1v1h-1m-13 0h2v2h-2m12-2h2v2h-2m-11 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-clock
- Matched samples: （无直接源码候选）

### JCSS-0060 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 0h1v1h-1m0 0h2v1h-2m0 0h3v1h-3m1 0h3v1h-3m4-1h3v1h-3m-4 0h4v1h-4m5-1h3v1h-3m-6 0h2v2h-2m3-2h3v1h-3m5-1h2v1h-2m-4 0h3v1h-3m4-1h5v1h-5m-9 0h2v1h-2m6-1h3v1h-3m4-1h5v1h-5m-9 0h1v1h-1m6-1h3v1h-3m6-1h2v1h-2m-12 0h2v2h-2m7-2h3v1h-3m6-1h2v1h-2m-5 0h3v1h-3m5-1h1v2h-1m-12-1h3v1h-3m8-1h3v1h-3m-7 0h11v1h-11m2 0h10v1h-10m8 0h2v1h-2m1 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-cloud-off
- Matched samples: （无直接源码候选）

### JCSS-0061 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 2h2v1h-2m-2 0h6v1h-6m-1 0h3v1h-3m5-1h3v1h-3m-6 0h2v2h-2m8-2h2v1h-2m0 0h5v1h-5m-9 0h2v2h-2m10-2h5v1h-5m3 0h2v1h-2m-12 0h2v2h-2m13-2h2v1h-2m0 0h1v1h-1m-12 0h3v1h-3m11-1h2v1h-2m-10 0h11v1h-11m2 0h7v1h-7'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-cloud
- Matched samples: （无直接源码候选）

### JCSS-0062 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 2h1v1h-1m-1 0h2v3h-2m-5-1h2v1h-2m8-1h2v1h-2m-9 0h2v1h-2m6-1h1v1h-1m4-1h2v1h-2m-11 0h2v2h-2m6-2h2v2h-2m6-2h2v2h-2m-11 0h2v1h-2m5-1h1v1h-1m5-1h2v1h-2m-9 0h2v1h-2m3-1h2v3h-2m5-3h2v1h-2m-5 2h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-code-xml
- Matched samples: （无直接源码候选）

### JCSS-0063 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 3h1v1h-1m5-1h1v1h-1m-6 0h2v1h-2m6-1h2v1h-2m-7 0h2v1h-2m8-1h2v1h-2m-9 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-11 0h2v1h-2m10-1h2v1h-2m-9 0h2v1h-2m8-1h2v1h-2m-7 0h2v1h-2m6-1h2v1h-2m-5 0h1v1h-1m5-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-code
- Matched samples: （无直接源码候选）

### JCSS-0064 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 0h1v1h-1m3-1h1v1h-1m-6 0h2v2h-2m3-2h4v2h-4m0 0h1v1h-1m3-1h1v1h-1m-6 0h9v1h-9m-2 0h13v1h-13m0 0h2v7h-2m9-7h5v1h-5m0 0h2v2h-2m4-2h1v2h-1m-4 0h5v1h-5m0 0h4v1h-4m0 0h3v1h-3m0 0h2v1h-2m-8 0h9v1h-9m1 0h7v1h-7'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-coffee
- Matched samples: （无直接源码候选）

### JCSS-0065 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v10h-2m4-10h2v10h-2m4-10h2v10h-2m4-10h2v10h-2m-12 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-columns-3
- Matched samples: （无直接源码候选）

### JCSS-0066 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m9-2h1v1h-1m3-1h2v2h-2m-6-1h5v1h-5m-6 0h1v1h-1m5-1h5v1h-5m8-1h1v1h-1m-14 0h2v2h-2m5-2h2v2h-2m4-2h2v2h-2m5-2h2v2h-2m-13 0h1v1h-1m4-1h5v1h-5m9-1h1v1h-1m-13 0h2v2h-2m3-2h5v1h-5m9-1h2v2h-2m-8-1h1v1h-1m-3 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-compass
- Matched samples: （无直接源码候选）

### JCSS-0067 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12 M1 2h14v1h-14 M1 3h2v1h-2 M13 3h2v1h-2 M1 4h2v1h-2 M6 4h4v1h-4 M13 4h2v1h-2 M1 5h2v1h-2 M6 5h1v1h-1 M9 5h1v1h-1 M13 5h2v1h-2 M1 6h2v1h-2 M5 6h2v1h-2 M9 6h2v1h-2 M13 6h2v1h-2 M1 7h2v1h-2 M6 7h1v1h-1 M9 7h1v1h-1 M13 7h2v1h-2 M1 8h2v1h-2 M6 8h4v1h-4 M13 8h2v1h-2 M1 9h2v1h-2 M7 9h2v1h-2 M13 9h2v1h-2 M1 10h2v1h-2 M5 10h6v1h-6 M13 10h2v1h-2 M1 11h2v1h-2 M5 11h1v1h-1 M10 11h1v1h-1 M13 11h2v1h-2 M1 12h2v1h-2 M4 12h2v1h-2 M10 12h2v1h-2 M13 12h2v1h-2 M1 13h14v1h-14 M2 14h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-contact-round
- Matched samples: （无直接源码候选）

### JCSS-0068 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h1v1h-1m5-1h1v1h-1m-8 0h12v1h-12m-1 0h14v1h-14m0 0h2v10h-2m4-10h1v1h-1m5-1h1v1h-1m3-1h2v10h-2m-7-9h4v1h-4m-1 0h6v1h-6m0 0h2v2h-2m4-2h2v2h-2m-3 0h4v1h-4m0 1h4v1h-4m-2 0h8v1h-8m0 0h2v1h-2m6-1h2v1h-2m-9 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-contact
- Matched samples: （无直接源码候选）

### JCSS-0069 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h9v1h-9 M1 2h11v1h-11 M1 3h2v1h-2 M1 4h2v1h-2 M1 5h2v1h-2 M6 5h8v1h-8 M1 6h2v1h-2 M5 6h10v1h-10 M1 7h2v1h-2 M5 7h2v1h-2 M13 7h2v1h-2 M1 8h2v1h-2 M5 8h2v1h-2 M13 8h2v1h-2 M1 9h2v1h-2 M5 9h2v1h-2 M13 9h2v1h-2 M1 10h2v1h-2 M5 10h2v1h-2 M13 10h2v1h-2 M1 11h2v1h-2 M5 11h2v1h-2 M13 11h2v1h-2 M1 12h2v1h-2 M5 12h2v1h-2 M13 12h2v1h-2 M5 13h10v1h-10 M6 14h8v1h-8'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-copy
- Matched samples: （无直接源码候选）

### JCSS-0070 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 1h2v2h-2m-6 0h2v1h-2m5-1h4v1h-4m7-1h2v1h-2m-12 0h3v1h-3m4-1h6v1h-6m7-1h3v1h-3m-11 0h6v1h-6m8-1h6v1h-6m-8 0h2v2h-2m3-2h2v1h-2m6-1h2v1h-2m3-1h2v2h-2m-11 0h2v2h-2m10-2h2v2h-2m-10 0h12v1h-12m1 0h10v1h-10m0 1h10v2h-10'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-crown
- Matched samples: （无直接源码候选）

### JCSS-0071 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 0h1v1h-1m-2 0h5v1h-5m-2 0h4v1h-4m5-1h3v1h-3m-6 0h3v1h-3m7-1h4v1h-4m-9 0h3v1h-3m11-1h3v1h-3m-12 0h3v1h-3m10-1h5v1h-5m-11 0h4v1h-4m10-1h3v1h-3m4-1h2v4h-2m-14-3h6v1h-6m8-1h4v1h-4m-8 0h2v3h-2m4-3h6v1h-6m1 0h3v1h-3m1 0h2v3h-2m6-3h3v1h-3m-11 0h2v1h-2m10-1h3v1h-3m-10 0h4v1h-4m8-1h3v1h-3m-6 0h8v1h-8m1 0h5v1h-5m2 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-cuboid
- Matched samples: （无直接源码候选）

### JCSS-0072 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-4 0h10v1h-10m-2 0h4v1h-4m10-1h4v1h-4m-10 0h2v1h-2m12-1h2v1h-2m-12 0h14v2h-14m0 0h2v2h-2m12-2h2v1h-2m-6 0h2v1h-2m4-1h1v1h-1m-10 0h3v1h-3m6-1h7v1h-7m-6 0h5v1h-5m6-1h4v3h-4m6-3h2v1h-2m-12 0h2v3h-2m3-3h2v1h-2m10-1h1v1h-1m0 0h2v1h-2m-6 0h1v1h-1m5-1h2v1h-2m-12 0h4v1h-4m7-1h2v1h-2m4-1h3v1h-3m-9 0h4v1h-4m6-1h5v1h-5m2 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-database-backup
- Matched samples: （无直接源码候选）

### JCSS-0073 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-4 0h10v1h-10m-2 0h4v1h-4m10-1h4v1h-4m-10 0h2v1h-2m12-1h2v1h-2m-12 0h14v2h-14m0 0h2v2h-2m12-2h2v2h-2m-12 0h3v1h-3m11-1h3v1h-3m-11 0h14v1h-14m0 0h2v3h-2m3-3h8v1h-8m9-1h2v3h-2m-12 0h4v1h-4m10-1h4v1h-4m-8 0h10v1h-10m4 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-database
- Matched samples: （无直接源码候选）

### JCSS-0074 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 0h1v1h-1m-1 0h4v1h-4m-1 0h2v1h-2m3-1h3v1h-3m-4 0h2v1h-2m3-1h5v1h-5m-3 0h1v1h-1m3-1h2v1h-2m3-1h3v1h-3m-1 0h4v2h-4m-10-1h9v2h-9m12-1h2v1h-2m-13 0h2v6h-2m6-6h1v1h-1m2-1h2v1h-2m4-1h2v1h-2m-6 0h4v1h-4m5-1h2v1h-2m-3 0h2v4h-2m-5-3h2v2h-2m-2 1h9v1h-9m1 0h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-dices
- Matched samples: （无直接源码候选）

### JCSS-0075 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 1h10v1h-10m0 0h5v1h-5m6-1h4v1h-4m-7 0h2v10h-2m4-10h2v10h-2m6-10h2v10h-2m-3-6h1v2h-1m-8 4h7v1h-7m8-1h6v1h-6m-8 0h14v1h-14m6 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-door-open
- Matched samples: （无直接源码候选）

### JCSS-0076 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 1h2v6h-2m-3-1h2v1h-2m6-1h2v1h-2m-6 0h8v1h-8m1 0h6v1h-6m-4 0h2v4h-2m5-4h4v1h-4m7-1h2v4h-2m-6-3h2v1h-2m-6 2h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-download
- Matched samples: （无直接源码候选）

### JCSS-0077 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h4v1h-4m10-1h2v1h-2m-11 0h2v2h-2m3-2h3v1h-3m8-1h3v1h-3m-7 0h4v1h-4m5-1h5v1h-5m-9 0h3v1h-3m6-1h2v1h-2m3-1h2v1h-2m3-1h2v1h-2m-13 0h5v1h-5m7-1h4v1h-4m7-1h2v2h-2m-14-1h2v1h-2m4-1h2v2h-2m4-2h3v1h-3m-7 0h1v1h-1m9-1h5v1h-5m-9 0h2v2h-2m3-2h4v1h-4m5-1h6v1h-6m-3 0h2v2h-2m3-2h2v2h-2m4-2h2v1h-2m-11 0h2v1h-2m10-1h2v1h-2m-9 0h5v1h-5m6-1h4v1h-4m-5 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-earth
- Matched samples: （无直接源码候选）

### JCSS-0078 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 2h2v3h-2m0 2h2v2h-2m0 2h2v3h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-ellipsis-vertical
- Matched samples: （无直接源码候选）

### JCSS-0079 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 7h2v1h-2 M7 7h2v1h-2 M13 7h2v1h-2 M1 8h2v1h-2 M7 8h2v1h-2 M13 8h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-ellipsis
- Matched samples: （无直接源码候选）

### JCSS-0080 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M8 1h3v1h-3m-1 0h5v1h-5m-1 0h3v1h-3m4-1h3v1h-3m-5 0h3v1h-3m6-1h3v1h-3m-7 0h3v1h-3m8-1h3v1h-3m-9 0h3v1h-3m10-1h2v1h-2m-11 0h3v1h-3m12-1h2v1h-2m-13 0h5v1h-5m12-1h2v1h-2m-12 0h2v2h-2m3-2h3v1h-3m8-1h2v1h-2m-7 0h3v1h-3m6-1h2v1h-2m-10 0h3v1h-3m5-1h3v1h-3m4-1h2v1h-2m-8 0h3v1h-3m5-1h4v1h-4m-4 0h12v1h-12m1 0h11v1h-11'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-eraser
- Matched samples: （无直接源码候选）

### JCSS-0081 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 1h5v1h-5 M9 2h5v1h-5 M12 3h2v1h-2 M2 4h7v1h-7 M11 4h3v1h-3 M1 5h8v1h-8 M10 5h2v1h-2 M1 6h2v1h-2 M9 6h2v1h-2 M1 7h2v1h-2 M8 7h2v1h-2 M1 8h2v1h-2 M7 8h2v1h-2 M1 9h2v1h-2 M6 9h2v1h-2 M12 9h2v1h-2 M1 10h2v1h-2 M5 10h2v1h-2 M12 10h2v1h-2 M1 11h2v1h-2 M12 11h2v1h-2 M1 12h2v1h-2 M12 12h2v1h-2 M1 13h13v1h-13 M2 14h11v1h-11'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-external-link
- Matched samples: （无直接源码候选）

### JCSS-0082 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 0h1v1h-1m0 0h2v1h-2m0 0h3v1h-3m6-1h2v1h-2m-5 0h3v1h-3m4-1h6v1h-6m-3 0h3v1h-3m7-1h3v1h-3m-8 0h5v1h-5m10-1h2v1h-2m-11 0h2v4h-2m4-4h3v1h-3m8-1h2v4h-2m-8-3h4v1h-4m0 0h5v1h-5m1 0h5v1h-5m-4 0h2v1h-2m5-1h5v1h-5m6-1h1v1h-1m-10 0h3v1h-3m7-1h3v1h-3m-6 0h10v1h-10m3 0h2v1h-2m5-1h3v1h-3m1 0h2v1h-2m1 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-eye-off
- Matched samples: （无直接源码候选）

### JCSS-0083 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 3h4v1h-4 M4 4h2v1h-2 M10 4h2v1h-2 M2 5h2v1h-2 M12 5h2v1h-2 M1 6h2v1h-2 M7 6h2v1h-2 M13 6h2v1h-2 M1 7h2v1h-2 M6 7h4v1h-4 M13 7h2v1h-2 M1 8h2v1h-2 M6 8h4v1h-4 M13 8h2v1h-2 M1 9h2v1h-2 M7 9h2v1h-2 M13 9h2v1h-2 M2 10h2v1h-2 M12 10h2v1h-2 M4 11h2v1h-2 M10 11h2v1h-2 M6 12h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-eye
- Matched samples: （无直接源码候选）

### JCSS-0084 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-8-1h2v2h-2m4-2h2v2h-2m-8-1h1v1h-1m13-1h1v1h-1m-14 0h2v2h-2m14-2h2v2h-2m-13 0h1v1h-1m3-1h2v1h-2m6-1h2v1h-2m4-1h1v1h-1m-13 0h2v2h-2m3-2h8v1h-8m9-1h2v2h-2m-8-1h6v1h-6m-3 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-face-slightly-smiling
- Matched samples: （无直接源码候选）

### JCSS-0085 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 0h6v1h-6m-2 0h9v1h-9m0 0h2v2h-2m6-2h4v1h-4m-3 0h1v1h-1m3-1h2v1h-2m3-1h2v1h-2m-9 0h4v1h-4m6-1h6v1h-6m-6 0h2v2h-2m3-2h1v2h-1m4-2h5v1h-5m3 0h2v8h-2m-10-7h4v1h-4m0 0h2v2h-2m3-2h1v1h-1m-3 1h4v1h-4m2 0h3v1h-3m-1 0h4v1h-4m0 0h2v1h-2m3-1h2v1h-2m-3 0h4v1h-4m5-1h6v1h-6m-3 0h1v1h-1m4-1h3v1h-3'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-file-archive
- Matched samples: （无直接源码候选）

### JCSS-0086 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 0h6v1h-6m-2 0h9v1h-9m0 0h2v12h-2m6-12h4v1h-4m0 0h2v1h-2m3-1h2v1h-2m-3 0h6v1h-6m1 0h5v1h-5m3 0h2v8h-2m-6-7h3v1h-3m-1 0h5v1h-5m0 0h2v1h-2m3-1h2v1h-2m-3 0h5v1h-5m1 0h5v1h-5m3 0h2v1h-2m-7 1h12v1h-12m2 0h8v1h-8'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-file-search
- Matched samples: （无直接源码候选）

### JCSS-0087 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 0h6v1h-6m-2 0h9v1h-9m0 0h2v12h-2m6-12h4v1h-4m0 0h2v1h-2m3-1h2v1h-2m-3 0h6v1h-6m-3 0h2v2h-2m4-2h5v1h-5m3 0h2v8h-2m-7-6h6v4h-6m-3 2h12v1h-12m2 0h8v1h-8'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-file-text
- Matched samples: （无直接源码候选）

### JCSS-0088 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h1v1h-1m-3 0h7v1h-7m9-1h3v1h-3m-9 0h2v7h-2m5-7h7v1h-7m3 0h1v1h-1m2-1h2v7h-2m-7-2h1v1h-1m-3 0h7v1h-7m0 0h2v5h-2m5-5h7v1h-7m3 0h1v1h-1m-8 3h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-flag
- Matched samples: （无直接源码候选）

### JCSS-0089 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h6v2h-6m1 0h4v4h-4m-1 0h2v2h-2m4-2h2v2h-2m-5 0h2v1h-2m6-1h2v1h-2m-7 0h10v2h-10m-1 0h3v1h-3m9-1h3v1h-3m-9 0h2v2h-2m10-2h2v2h-2m-10 0h12v1h-12m2 0h8v1h-8'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-flask-conical
- Matched samples: （无直接源码候选）

### JCSS-0090 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h5v1h-5m0 0h6v1h-6m-1 0h2v9h-2m6-9h9v1h-9m1 0h8v1h-8m7 0h2v3h-2m-4 1h4v1h-4m-1 0h6v1h-6m-1 0h2v1h-2m6-1h1v1h-1m-13 0h6v1h-6m8-1h2v1h-2m4-1h2v1h-2m-12 0h7v1h-7m8-1h6v1h-6m1 0h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-folder-heart
- Matched samples: （无直接源码候选）

### JCSS-0091 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h5v1h-5m0 0h6v1h-6m-1 0h2v9h-2m6-9h7v1h-7m1 0h7v1h-7m5 0h2v1h-2m-7 0h10v1h-10m-1 0h11v1h-11m-1 0h2v2h-2m11-2h1v1h-1m-1 0h2v3h-2m-12 0h13v2h-13'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-folder-open
- Matched samples: （无直接源码候选）

### JCSS-0092 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h5v1h-5m0 0h6v1h-6m-1 0h2v9h-2m6-9h9v1h-9m1 0h8v1h-8m7 0h2v7h-2m-7-6h2v2h-2m-2 0h6v1h-6m1 0h4v1h-4m1 0h2v1h-2m-6 1h14v2h-14'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-folder-plus
- Matched samples: （无直接源码候选）

### JCSS-0093 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h5v1h-5m0 0h6v1h-6m-1 0h2v9h-2m6-9h9v1h-9m1 0h8v1h-8m7 0h2v3h-2m-3 0h1v1h-1m3-1h1v1h-1m-5 0h5v1h-5m0 0h2v1h-2m3-1h2v2h-2m-4-1h2v1h-2m-7 0h6v1h-6m8-1h5v1h-5m-8 0h7v1h-7m8-1h6v1h-6m4 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-folder-search
- Matched samples: （无直接源码候选）

### JCSS-0094 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h2v3h-2m7-3h3v1h-3m-1 0h6v1h-6m0 0h2v3h-2m3-3h5v1h-5m-9 0h5v2h-5m12-2h2v2h-2m-12 0h2v5h-2m6-5h8v1h-8m2 0h4v1h-4m0 0h1v1h-1m-2 0h4v1h-4m0 0h2v3h-2m3-3h5v1h-5m-9 0h5v1h-5m10-1h4v1h-4m-9 0h4v1h-4m11-1h2v1h-2m-6 0h8v1h-8m1 0h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-folder-tree
- Matched samples: （无直接源码候选）

### JCSS-0095 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h5v1h-5m0 0h6v1h-6m-1 0h2v9h-2m6-9h9v1h-9m1 0h8v1h-8m7 0h2v7h-2m-13 0h14v2h-14'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-folder
- Matched samples: （无直接源码候选）

### JCSS-0096 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 1h2v1h-2 M2 2h4v1h-4 M1 3h6v1h-6 M1 4h6v1h-6 M2 5h4v1h-4 M10 5h2v1h-2 M3 6h2v1h-2 M9 6h5v1h-5 M2 7h4v1h-4 M8 7h6v1h-6 M2 8h4v1h-4 M8 8h7v1h-7 M3 9h2v1h-2 M8 9h6v1h-6 M9 10h5v1h-5 M9 11h4v1h-4 M9 12h5v1h-5 M9 13h5v1h-5 M10 14h3v1h-3'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-footprints
- Matched samples: （无直接源码候选）

### JCSS-0097 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 3h10v1h-10 M2 4h12v1h-12 M1 5h2v1h-2 M13 5h2v1h-2 M1 6h2v1h-2 M4 6h2v1h-2 M9 6h2v1h-2 M13 6h2v1h-2 M1 7h6v1h-6 M9 7h2v1h-2 M13 7h2v1h-2 M1 8h6v1h-6 M13 8h2v1h-2 M1 9h2v1h-2 M4 9h2v1h-2 M9 9h2v1h-2 M13 9h2v1h-2 M1 10h2v1h-2 M9 10h2v1h-2 M13 10h2v1h-2 M1 11h2v1h-2 M13 11h2v1h-2 M2 12h12v1h-12 M3 13h10v1h-10'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-gamepad-2
- Matched samples: （无直接源码候选）

### JCSS-0098 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 2h6v1h-6m-2 0h10v1h-10m-1 0h3v1h-3m9-1h3v1h-3m-10 0h3v1h-3m11-1h3v1h-3m-11 0h2v2h-2m9-2h1v1h-1m3-1h2v2h-2m-4-1h2v1h-2m-9 0h2v2h-2m8-2h2v1h-2m6-1h2v2h-2m-7-1h2v1h-2m-6 0h1v1h-1m13-1h1v1h-1m-13 0h2v2h-2m12-2h2v2h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-gauge
- Matched samples: （无直接源码候选）

### JCSS-0099 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 1h10v1h-10m-1 0h12v1h-12m0 0h2v1h-2m3-1h2v2h-2m4-2h2v2h-2m3-2h2v1h-2m-11 0h2v1h-2m12-1h2v1h-2m-13 0h16v2h-16m1 0h2v1h-2m4-1h2v2h-2m4-2h2v2h-2m4-2h2v1h-2m-11 0h2v1h-2m10-1h2v1h-2m-10 0h5v1h-5m7-1h5v1h-5m-6 0h10v1h-10m1 0h8v1h-8m1 0h6v2h-6m1 0h4v1h-4m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-gem
- Matched samples: （无直接源码候选）

### JCSS-0100 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 1h4v1h-4m6-1h4v1h-4m-6 0h2v1h-2m3-1h4v2h-4m5-2h2v1h-2m-9 0h3v1h-3m9-1h3v1h-3m-10 0h14v4h-14m1 0h2v5h-2m5-5h2v5h-2m5-5h2v5h-2m-10 0h12v1h-12m1 0h10v1h-10'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-gift
- Matched samples: （无直接源码候选）

### JCSS-0101 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h6v1h-6 M3 2h2v1h-2 M11 2h2v1h-2 M2 3h2v1h-2 M6 3h4v1h-4 M12 3h2v1h-2 M1 4h2v1h-2 M5 4h2v1h-2 M9 4h2v1h-2 M13 4h2v1h-2 M1 5h2v1h-2 M5 5h2v1h-2 M9 5h2v1h-2 M13 5h2v1h-2 M1 6h2v1h-2 M5 6h2v1h-2 M9 6h2v1h-2 M13 6h2v1h-2 M1 7h14v1h-14 M1 8h14v1h-14 M1 9h2v1h-2 M5 9h2v1h-2 M9 9h2v1h-2 M13 9h2v1h-2 M1 10h2v1h-2 M5 10h2v1h-2 M9 10h2v1h-2 M13 10h2v1h-2 M1 11h2v1h-2 M5 11h2v1h-2 M9 11h2v1h-2 M13 11h2v1h-2 M2 12h2v1h-2 M6 12h4v1h-4 M12 12h2v1h-2 M3 13h2v1h-2 M11 13h2v1h-2 M5 14h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-globe
- Matched samples: （无直接源码候选）

### JCSS-0102 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 2h2v3h-2m4-3h2v3h-2m-4 2h2v2h-2m4-2h2v2h-2m-4 2h2v3h-2m4-3h2v3h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-grip-vertical
- Matched samples: （无直接源码候选）

### JCSS-0103 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4m-2 0h8v1h-8m-1 0h12v1h-12m0 0h2v4h-2m3-4h4v3h-4m5-3h4v1h-4m0 0h2v3h-2m3-3h2v5h-2m-8-3h1v1h-1m3-1h1v1h-1m-8 0h4v1h-4m-1 0h5v1h-5m1 0h2v1h-2m3-1h1v1h-1m10-1h1v1h-1m-13 0h3v1h-3m12-1h2v1h-2m-11 0h3v1h-3m10-1h3v1h-3m-9 0h3v1h-3m8-1h3v1h-3m-7 0h9v1h-9m3 0h3v1h-3'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-hand
- Matched samples: （无直接源码候选）

### JCSS-0104 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 2h10v2h-10m-1 0h2v2h-2m10-2h2v2h-2m-11 0h2v1h-2m12-1h2v1h-2m-13 0h16v2h-16m0 0h2v3h-2m14-3h2v3h-2m-11-2h2v1h-2m3-1h2v1h-2m0 0h1v1h-1m-5 0h14v2h-14'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-hard-drive
- Matched samples: （无直接源码候选）

### JCSS-0105 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h1v1h-1m4-1h1v1h-1m-4 0h2v1h-2m4-1h2v1h-2m-4 0h1v1h-1m4-1h1v1h-1m-5 0h2v1h-2m4-1h2v1h-2m-7 0h12v2h-12m3 0h2v2h-2m4-2h2v2h-2m-7 0h12v2h-12m3 0h2v1h-2m4-1h2v1h-2m-4 0h1v1h-1m4-1h1v1h-1m-5 0h2v1h-2m4-1h2v1h-2m-3 0h1v1h-1m4-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-hash
- Matched samples: （无直接源码候选）

### JCSS-0106 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 1h2v1h-2 M11 1h2v1h-2 M2 2h4v1h-4 M10 2h4v1h-4 M1 3h2v1h-2 M5 3h2v1h-2 M9 3h2v1h-2 M13 3h2v1h-2 M1 4h2v1h-2 M13 4h2v1h-2 M1 5h2v1h-2 M13 5h2v1h-2 M1 6h2v1h-2 M13 6h2v1h-2 M1 7h2v1h-2 M13 7h2v1h-2 M2 8h2v1h-2 M12 8h2v1h-2 M3 9h2v1h-2 M11 9h2v1h-2 M4 10h2v1h-2 M10 10h2v1h-2 M5 11h2v1h-2 M9 11h2v1h-2 M6 12h4v1h-4 M7 13h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-heart
- Matched samples: （无直接源码候选）

### JCSS-0107 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4m-1 0h6v1h-6m-1 0h2v1h-2m6-1h2v1h-2m-8 0h3v1h-3m9-1h3v1h-3m-10 0h3v1h-3m11-1h3v1h-3m-11 0h2v7h-2m12-7h2v7h-2m-7-6h4v1h-4m-1 0h6v1h-6m0 0h2v4h-2m4-4h2v4h-2m-8 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-house
- Matched samples: （无直接源码候选）

### JCSS-0108 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 2h12v1h-12m-1 0h14v1h-14m-1 0h2v7h-2m14-7h2v8h-2m-9-7h2v1h-2m-1 0h4v1h-4m6-1h3v1h-3m-7 0h2v2h-2m4-2h2v2h-2m3-2h2v2h-2m-6 0h4v1h-4m6-1h3v1h-3m-7 0h6v1h-6m-3 0h5v1h-5m7-1h2v1h-2m-6 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-id-card
- Matched samples: （无直接源码候选）

### JCSS-0109 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 0h1v1h-1m0 0h2v1h-2m4-1h9v1h-9m-4 0h3v1h-3m4-1h10v1h-10m-4 0h4v1h-4m12-1h2v4h-2m-12-3h5v1h-5m0 0h2v8h-2m3-8h3v1h-3m0 0h4v1h-4m0 0h5v1h-5m7-1h4v2h-4m-4-1h3v1h-3m0 0h4v1h-4m5-1h3v1h-3m-6 0h6v1h-6m7-1h2v1h-2m-8 0h3v1h-3m5-1h3v1h-3m-6 0h3v1h-3m7-1h3v1h-3m-10 0h14v1h-14m1 0h13v1h-13m12 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-image-off
- Matched samples: （无直接源码候选）

### JCSS-0110 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v10h-2m12-10h2v4h-2m-9-3h4v4h-4m5-1h6v1h-6m-1 0h7v1h-7m-1 0h3v1h-3m5-1h3v1h-3m-6 0h3v1h-3m7-1h2v3h-2m-8-2h3v1h-3m-1 0h3v1h-3m-3 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-image
- Matched samples: （无直接源码候选）

### JCSS-0111 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 0h8v1h-8m-1 0h10v1h-10m-1 0h2v8h-2m10-8h2v3h-2m-6-2h2v1h-2m-6 0h1v1h-1m5-1h3v2h-3m-6-1h2v1h-2m10-1h5v1h-5m-11 0h2v8h-2m10-8h6v1h-6m-1 0h3v1h-3m4-1h3v1h-3m-5 0h3v1h-3m6-1h2v2h-2m-7-1h3v1h-3m-2 0h10v1h-10m1 0h8v1h-8m4 0h1v1h-1m0 0h2v1h-2m-9 0h10v1h-10m1 0h8v1h-8'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-images
- Matched samples: （无直接源码候选）

### JCSS-0112 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 2h10v2h-10m-1 0h2v2h-2m10-2h2v2h-2m-11 0h2v1h-2m12-1h2v1h-2m-13 0h6v1h-6m10-1h6v1h-6m-10 0h7v1h-7m9-1h7v1h-7m-9 0h2v3h-2m5-3h6v1h-6m9-1h2v3h-2m-8-2h4v1h-4m-5 1h14v2h-14'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-inbox
- Matched samples: （无直接源码候选）

### JCSS-0113 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-6-1h2v1h-2m-6 0h1v1h-1m13-1h1v1h-1m-14 0h2v2h-2m7-2h2v4h-2m7-4h2v2h-2m-13 0h1v1h-1m13-1h1v1h-1m-13 0h2v2h-2m12-2h2v2h-2m-11 0h2v1h-2m10-1h2v1h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m3 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-info
- Matched samples: （无直接源码候选）

### JCSS-0114 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 0h2v1h-2m-2 0h6v1h-6m-1 0h3v1h-3m6-1h2v1h-2m-6 0h2v1h-2m7-1h2v1h-2m-8 0h2v4h-2m5-4h2v2h-2m4-2h1v1h-1m0 0h2v1h-2m0 0h1v1h-1m-1 0h2v1h-2m-9 0h2v1h-2m8-1h3v1h-3m-9 0h2v1h-2m5-1h6v1h-6m-6 0h2v1h-2m4-1h6v1h-6m-5 0h2v1h-2m5-1h2v1h-2m-6 0h2v2h-2m4-2h3v1h-3m0 0h2v1h-2m-3 0h4v1h-4m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-key-round
- Matched samples: （无直接源码候选）

### JCSS-0115 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 2h14v2h-14m-1 0h2v8h-2m6-8h1v1h-1m3-1h1v2h-1m5-2h2v8h-2m-11-7h2v1h-2m3-1h2v1h-2m5-1h2v1h-2m-6 1h1v2h-1m2-2h2v2h-2m3-2h1v2h-1m-6 1h8v2h-8m-3 0h14v2h-14'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-keyboard
- Matched samples: （无直接源码候选）

### JCSS-0116 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 0h2v2h-2m-3 0h9v2h-9m2 0h1v1h-1m3-1h2v1h-2m-3 0h5v1h-5m0 0h4v2h-4m8-1h1v1h-1m-9 0h6v1h-6m8-1h3v2h-3m-8-1h2v1h-2m4-1h2v1h-2m3 0h5v1h-5m-1 0h6v1h-6m0 0h7v1h-7m0 0h2v1h-2m5-1h2v1h-2m-6 0h2v1h-2m7-1h2v1h-2m0 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-languages
- Matched samples: （无直接源码候选）

### JCSS-0117 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h6v1h-6m-2 0h4v1h-4m6-1h4v1h-4m-8 0h4v1h-4m10-1h4v1h-4m-11 0h3v1h-3m13-1h3v1h-3m-12 0h3v1h-3m11-1h3v1h-3m-10 0h5v1h-5m7-1h5v1h-5m-8 0h1v1h-1m3-1h8v1h-8m10-1h1v1h-1m-13 0h3v1h-3m6-1h2v1h-2m5-1h3v1h-3m-10 0h4v1h-4m8-1h4v1h-4m-9 0h1v1h-1m3-1h8v1h-8m10-1h1v1h-1m-14 0h3v1h-3m6-1h4v1h-4m7-1h3v1h-3m-12 0h4v1h-4m10-1h4v1h-4m-8 0h4v1h-4m6-1h4v1h-4m-4 0h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-layers
- Matched samples: （无直接源码候选）

### JCSS-0118 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h4v1h-4 M10 1h4v1h-4 M1 2h6v1h-6 M9 2h6v1h-6 M1 3h2v1h-2 M5 3h2v1h-2 M9 3h2v1h-2 M13 3h2v1h-2 M1 4h2v1h-2 M5 4h2v1h-2 M9 4h6v1h-6 M1 5h2v1h-2 M5 5h2v1h-2 M10 5h4v1h-4 M1 6h2v1h-2 M5 6h2v1h-2 M1 7h6v1h-6 M10 7h4v1h-4 M2 8h4v1h-4 M9 8h6v1h-6 M9 9h2v1h-2 M13 9h2v1h-2 M2 10h4v1h-4 M9 10h2v1h-2 M13 10h2v1h-2 M1 11h6v1h-6 M9 11h2v1h-2 M13 11h2v1h-2 M1 12h2v1h-2 M5 12h2v1h-2 M9 12h2v1h-2 M13 12h2v1h-2 M1 13h6v1h-6 M9 13h6v1h-6 M2 14h4v1h-4 M10 14h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-layout-dashboard
- Matched samples: （无直接源码候选）

### JCSS-0119 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h5v1h-5m7-1h5v1h-5m-8 0h6v1h-6m8-1h6v1h-6m-8 0h2v3h-2m5-3h4v3h-4m7-3h2v3h-2m-12 0h6v1h-6m8-1h6v1h-6m-6 0h3v2h-3m7-2h3v2h-3m-9 0h6v1h-6m8-1h6v1h-6m-8 0h2v3h-2m5-3h4v3h-4m7-3h2v3h-2m-12 0h6v1h-6m8-1h6v1h-6m-7 0h5v1h-5m7-1h5v1h-5'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-layout-grid
- Matched samples: （无直接源码候选）

### JCSS-0120 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 4h5v1h-5m7-1h5v1h-5m-8 0h5v1h-5m9-1h5v1h-5m-9 0h2v1h-2m12-1h2v1h-2m-12 0h1v2h-1m4-2h6v2h-6m9-2h1v2h-1m-13 0h2v1h-2m12-1h2v1h-2m-12 0h5v1h-5m9-1h5v1h-5m-8 0h5v1h-5m7-1h5v1h-5'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-link-2
- Matched samples: （无直接源码候选）

### JCSS-0121 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 1h5v1h-5m-1 0h2v1h-2m4-1h3v1h-3m-5 0h2v1h-2m6-1h2v1h-2m1 0h1v2h-1m-9-1h3v1h-3m-1 0h6v1h-6m9-1h2v1h-2m-10 0h2v1h-2m5-1h2v1h-2m4-1h2v1h-2m-10 0h2v1h-2m4-1h2v1h-2m5-1h2v1h-2m-10 0h2v1h-2m5-1h6v1h-6m-5 0h1v2h-1m7-2h3v1h-3m-7 1h2v1h-2m6-1h2v1h-2m-6 0h3v1h-3m5-1h2v1h-2m-4 0h5v1h-5'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-link
- Matched samples: （无直接源码候选）

### JCSS-0122 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M8 2h6v1h-6m-3 0h2v1h-2m3-1h7v1h-7m-7 0h5v1h-5m1 0h3v1h-3m1 0h1v1h-1m5 0h7v2h-7m-3 0h2v1h-2m-1 0h3v1h-3m-3 0h5v1h-5m1 0h3v1h-3m6-1h7v1h-7m-5 0h1v1h-1m5-1h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-list-checks
- Matched samples: （无直接源码候选）

### JCSS-0123 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 2h14v2h-14m2 3h10v2h-10m2 3h6v1h-6m1 0h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-list-filter
- Matched samples: （无直接源码候选）

### JCSS-0124 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 2h9v1h-9m-1 0h10v1h-10m10 1h2v2h-2m-10 0h7v2h-7m8-2h6v2h-6m2 0h2v2h-2m-10 1h10v1h-10m1 0h9v1h-9'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-list-plus
- Matched samples: （无直接源码候选）

### JCSS-0125 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 2h9v1h-9m-1 0h10v1h-10m9 1h1v1h-1m3-1h1v1h-1m-3 0h4v4h-4m-9-3h7v2h-7m9 1h1v1h-1m3-1h1v1h-1m-12 1h10v1h-10m1 0h9v1h-9'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-list-x
- Matched samples: （无直接源码候选）

### JCSS-0126 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 2h9v1h-9m-4 0h2v1h-2m4-1h10v1h-10m-4 3h2v2h-2m4-2h10v2h-10m-4 3h2v1h-2m4-1h10v1h-10m0 0h9v1h-9'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-list
- Matched samples: （无直接源码候选）

### JCSS-0127 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4m-2 0h7v1h-7m-1 0h3v1h-3m-1 0h2v2h-2m-1 0h2v4h-2m12-3h2v3h-2m-11 0h2v2h-2m10-2h2v2h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m2 0h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-loader-circle
- Matched samples: （无直接源码候选）

### JCSS-0128 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h1v1h-1m-2 0h6v1h-6m-1 0h3v1h-3m5-1h3v1h-3m-5 0h2v3h-2m6-3h2v1h-2m1 0h1v1h-1m-8 1h10v1h-10m-2 0h14v1h-14m0 0h2v6h-2m12-6h2v6h-2m-12 0h14v1h-14m2 0h10v1h-10'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-lock-open
- Matched samples: （无直接源码候选）

### JCSS-0129 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h6v1h-6m-1 0h3v1h-3m5-1h3v1h-3m-5 0h2v3h-2m6-3h2v3h-2m-7 0h10v1h-10m-2 0h14v1h-14m0 0h2v6h-2m12-6h2v6h-2m-12 0h14v1h-14m2 0h10v1h-10'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-lock
- Matched samples: （无直接源码候选）

### JCSS-0130 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 1h5v1h-5m0 0h6v1h-6m4 0h2v10h-2m-7-9h2v1h-2m0 0h3v1h-3m1 0h3v1h-3m-6 0h10v2h-10m6 0h3v1h-3m-1 0h3v1h-3m0 0h2v1h-2m3 1h6v1h-6m0 0h5v1h-5'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-log-in
- Matched samples: （无直接源码候选）

### JCSS-0131 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h5v1h-5m-1 0h6v1h-6m0 0h2v10h-2m9-9h2v1h-2m0 0h3v1h-3m1 0h3v1h-3m-6 0h10v2h-10m6 0h3v1h-3m-1 0h3v1h-3m0 0h2v1h-2m-9 1h6v1h-6m1 0h5v1h-5'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-log-out
- Matched samples: （无直接源码候选）

### JCSS-0132 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 2h2v1h-2 M6 2h8v1h-8 M2 3h2v1h-2 M6 3h8v1h-8 M2 7h2v1h-2 M6 7h8v1h-8 M2 8h2v1h-2 M6 8h8v1h-8 M2 12h2v1h-2 M6 12h8v1h-8 M2 13h2v1h-2 M6 13h8v1h-8'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-logs
- Matched samples: （无直接源码候选）

### JCSS-0133 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 2h14v2h-14m-1 0h3v1h-3m13-1h3v1h-3m-13 0h4v1h-4m12-1h4v1h-4m-12 0h6v1h-6m10-1h6v1h-6m-10 0h2v5h-2m4-5h8v1h-8m10-1h2v2h-2m-8-1h4v1h-4m8 0h1v1h-1m-2 0h2v2h-2m-11 0h7v1h-7m9-1h5v2h-5m-9-1h8v1h-8m11 0h2v1h-2m0 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-mail-plus
- Matched samples: （无直接源码候选）

### JCSS-0134 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 2h14v2h-14m-1 0h3v1h-3m13-1h3v1h-3m-13 0h4v1h-4m12-1h4v1h-4m-12 0h6v1h-6m10-1h6v1h-6m-10 0h2v5h-2m4-5h8v1h-8m10-1h1v1h-1m-8 0h4v1h-4m7-1h1v1h-1m-2 0h4v1h-4m0 0h5v1h-5m2 0h2v1h-2m-12 0h10v1h-10m12-1h1v1h-1m-12 0h11v1h-11m12 0h1v2h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-mail-question-mark
- Matched samples: （无直接源码候选）

### JCSS-0135 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 2h14v2h-14m-1 0h3v1h-3m13-1h3v1h-3m-13 0h4v1h-4m12-1h4v1h-4m-12 0h6v1h-6m10-1h6v1h-6m-10 0h2v5h-2m4-5h3v1h-3m5-1h3v1h-3m5-1h2v5h-2m-8-4h4v1h-4m-5 3h14v2h-14'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-mail
- Matched samples: （无直接源码候选）

### JCSS-0136 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h6v1h-6 M4 2h8v1h-8 M3 3h3v1h-3 M10 3h3v1h-3 M3 4h2v1h-2 M11 4h2v1h-2 M2 5h2v1h-2 M12 5h2v1h-2 M2 6h2v1h-2 M12 6h2v1h-2 M3 7h2v1h-2 M11 7h2v1h-2 M2 8h3v1h-3 M11 8h3v1h-3 M3 9h4v1h-4 M9 9h4v1h-4 M4 10h8v1h-8 M4 11h8v1h-8 M5 12h6v1h-6 M6 13h4v1h-4 M7 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-map-pin
- Matched samples: （无直接源码候选）

### JCSS-0137 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h6v1h-6 M4 2h8v1h-8 M3 3h3v1h-3 M10 3h3v1h-3 M3 4h3v1h-3 M10 4h3v1h-3 M3 5h3v1h-3 M10 5h3v1h-3 M3 6h10v1h-10 M3 7h3v1h-3 M10 7h3v1h-3 M3 8h4v1h-4 M9 8h4v1h-4 M4 9h8v1h-8 M5 10h6v1h-6 M6 11h4v1h-4 M7 12h2v1h-2 M1 13h14v1h-14 M2 14h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-map-pinned
- Matched samples: （无直接源码候选）

### JCSS-0138 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 1h6v2h-6m2 0h4v1h-4m-1 0h5v1h-5m-1 0h3v1h-3m4-1h2v2h-2m-4-1h2v1h-2m0 0h1v1h-1m-3 0h1v1h-1m-5 0h2v2h-2m4-2h2v1h-2m-1 0h3v1h-3m-3 0h5v1h-5m0 0h4v1h-4m0 0h6v2h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-maximize-2
- Matched samples: （无直接源码候选）

### JCSS-0139 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-12 0h1v1h-1m13-1h1v1h-1m-14 0h2v2h-2m14-2h2v2h-2m-13 0h1v1h-1m13-1h1v1h-1m-13 0h2v3h-2m12-3h2v2h-2m-1 0h2v1h-2m-11 0h5v1h-5m9-1h3v1h-3m-9 0h11v1h-11m6 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-message-circle
- Matched samples: （无直接源码候选）

### JCSS-0140 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h14v2h-14m-1 0h2v10h-2m14-10h2v9h-2m-7-7h2v1h-2m-1 0h4v1h-4m-1 0h6v1h-6m2 0h2v2h-2m-4 2h12v1h-12m-3 0h14v1h-14m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-message-square-plus
- Matched samples: （无直接源码候选）

### JCSS-0141 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h14v2h-14m-1 0h2v10h-2m14-10h2v9h-2m-10-8h7v1h-7m0 0h6v1h-6m0 0h8v2h-8m0 1h5v2h-5m-1 1h12v1h-12m-3 0h14v1h-14m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-message-square-text
- Matched samples: （无直接源码候选）

### JCSS-0142 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h14v2h-14m-1 0h2v10h-2m14-10h2v9h-2m-8-7h1v1h-1m3-1h1v1h-1m-3 0h4v3h-4m0 0h1v1h-1m3-1h1v1h-1m-6 2h12v1h-12m-3 0h14v1h-14m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-message-square-x
- Matched samples: （无直接源码候选）

### JCSS-0143 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h14v2h-14m-1 0h2v10h-2m14-10h2v9h-2m-11 0h12v1h-12m-3 0h14v1h-14m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-message-square
- Matched samples: （无直接源码候选）

### JCSS-0144 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M13 1h2v1h-2m-5 0h2v2h-2m4-2h3v1h-3m-1 0h3v1h-3m-3 0h5v1h-5m0 0h4v1h-4m0 0h6v1h-6m1 0h5v1h-5m-7 0h5v1h-5m0 0h6v1h-6m2 0h4v1h-4m-1 0h5v1h-5m-1 0h3v1h-3m4-1h2v2h-2m-5-1h3v1h-3m0 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-minimize-2
- Matched samples: （无直接源码候选）

### JCSS-0145 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 7h10v1h-10 M3 8h10v1h-10'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-minus
- Matched samples: （无直接源码候选）

### JCSS-0146 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h14v2h-14m-1 0h2v7h-2m14-7h2v7h-2m-13 0h14v2h-14m6 0h2v1h-2m-2 0h6v2h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-monitor
- Matched samples: （无直接源码候选）

### JCSS-0147 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h2v1h-2m-2 0h5v1h-5m-1 0h6v1h-6m-1 0h2v2h-2m4-2h2v1h-2m1 0h1v1h-1m-6 0h2v4h-2m6-4h2v1h-2m0 0h3v1h-3m5-1h2v1h-2m-4 0h7v1h-7m3 0h4v1h-4m-9 0h2v2h-2m10-2h2v2h-2m-9 0h3v1h-3m7-1h3v1h-3m-6 0h8v1h-8m2 0h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-moon
- Matched samples: （无直接源码候选）

### JCSS-0148 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 1h2v3h-2m4-2h2v1h-2m-1 0h3v1h-3m-6 0h3v2h-3m6-2h2v1h-2m-1 0h2v1h-2m-1 0h5v1h-5m-2 0h9v1h-9m-1 0h3v1h-3m4-1h2v2h-2m4-2h4v1h-4m-8 0h2v1h-2m9-1h4v1h-4m-4 0h2v1h-2m3-1h4v1h-4m-3 0h4v1h-4m1 0h3v2h-3m1 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-mouse-pointer-click
- Matched samples: （无直接源码候选）

### JCSS-0149 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M11 5h2v1h-2m1 0h2v1h-2m-11 0h15v2h-15m11 0h2v1h-2m-1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-move-right
- Matched samples: （无直接源码候选）

### JCSS-0150 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M11 1h4v1h-4m-5 0h9v1h-9m-1 0h6v1h-6m8-1h2v5h-2m-8-4h2v5h-2m5-1h5v1h-5m-7 0h4v1h-4m6-1h6v1h-6m-7 0h5v1h-5m7-1h2v2h-2m4-2h2v2h-2m-12-1h2v2h-2m4-2h2v2h-2m5-1h4v1h-4m-8 0h4v1h-4m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-music
- Matched samples: （无直接源码候选）

### JCSS-0151 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-2 0h6v1h-6m0 0h2v2h-2m4-2h2v2h-2m-4 0h6v2h-6m2 0h2v1h-2m-4 0h10v2h-10m-1 0h2v1h-2m10-1h2v1h-2m-11 0h5v1h-5m9-1h5v1h-5m-10 0h6v1h-6m10-1h6v1h-6m-10 0h2v2h-2m4-2h2v2h-2m6-2h2v2h-2m4-2h2v2h-2m-13 0h5v1h-5m9-1h5v1h-5m-8 0h3v1h-3m9-1h3v1h-3'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-network
- Matched samples: （无直接源码候选）

### JCSS-0152 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 0h5v1h-5m9-1h1v1h-1m-11 0h8v1h-8m9-1h4v1h-4m-9 0h2v1h-2m8-1h3v1h-3m4-1h2v1h-2m-13 0h4v2h-4m8-2h3v1h-3m4-1h2v1h-2m-5 0h3v1h-3m4-1h3v1h-3m-10 0h2v1h-2m6-1h2v1h-2m3-1h3v1h-3m-10 0h4v1h-4m6-1h6v1h-6m-6 0h3v2h-3m6-2h5v1h-5m1 0h2v1h-2m4-1h2v6h-2m-11-5h4v1h-4m1 0h2v1h-2m-1 0h4v2h-4m1 0h2v1h-2m0 0h12v1h-12m2 0h8v1h-8'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-notebook-pen
- Matched samples: （无直接源码候选）

### JCSS-0153 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4m-2 0h3v1h-3m5-1h3v1h-3m-7 0h6v1h-6m8-1h4v1h-4m-9 0h3v1h-3m5-1h4v1h-4m6-1h3v1h-3m-11 0h4v1h-4m7-1h7v1h-7m-7 0h2v5h-2m3-5h3v1h-3m5-1h3v1h-3m4-1h2v5h-2m-8-4h6v1h-6m2 0h2v5h-2m-6-2h3v1h-3m11-1h3v1h-3m-10 0h4v1h-4m8-1h4v1h-4m-6 0h8v1h-8m2 0h4v1h-4m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-package
- Matched samples: （无直接源码候选）

### JCSS-0154 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 0h2v1h-2m-3 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-8 0h2v1h-2m6-1h2v2h-2m4-2h2v1h-2m-11 0h2v2h-2m4-2h2v2h-2m8-2h2v2h-2m-12 0h1v1h-1m10-1h2v2h-2m3-2h1v1h-1m-14 0h2v2h-2m4-2h1v1h-1m10-1h2v1h-2m-11 0h2v1h-2m10-1h2v1h-2m-12 0h1v1h-1m11-1h3v1h-3m-11 0h2v2h-2m7-2h6v1h-6m0 0h4v1h-4m-6 0h2v1h-2m6-1h2v2h-2m-5-1h3v1h-3m1 0h6v1h-6m3 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-palette
- Matched samples: （无直接源码候选）

### JCSS-0155 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v10h-2m4-10h2v10h-2m8-10h2v10h-2m-4-8h1v1h-1m0 0h2v1h-2m1 0h2v2h-2m-1 0h2v1h-2m0 0h1v1h-1m-8 2h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-panel-left-open
- Matched samples: （无直接源码候选）

### JCSS-0156 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v10h-2m4-10h2v10h-2m8-10h2v10h-2m-12 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-panel-left
- Matched samples: （无直接源码候选）

### JCSS-0157 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v10h-2m8-10h2v10h-2m4-10h2v10h-2m-8-8h1v1h-1m0 0h2v1h-2m1 0h2v2h-2m-1 0h2v1h-2m0 0h1v1h-1m-4 2h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-panel-right-close
- Matched samples: （无直接源码候选）

### JCSS-0158 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12 M1 2h14v1h-14 M1 3h2v1h-2 M9 3h2v1h-2 M13 3h2v1h-2 M1 4h2v1h-2 M9 4h2v1h-2 M13 4h2v1h-2 M1 5h2v1h-2 M6 5h2v1h-2 M9 5h2v1h-2 M13 5h2v1h-2 M1 6h2v1h-2 M5 6h2v1h-2 M9 6h2v1h-2 M13 6h2v1h-2 M1 7h2v1h-2 M4 7h2v1h-2 M9 7h2v1h-2 M13 7h2v1h-2 M1 8h2v1h-2 M4 8h2v1h-2 M9 8h2v1h-2 M13 8h2v1h-2 M1 9h2v1h-2 M5 9h2v1h-2 M9 9h2v1h-2 M13 9h2v1h-2 M1 10h2v1h-2 M6 10h2v1h-2 M9 10h2v1h-2 M13 10h2v1h-2 M1 11h2v1h-2 M9 11h2v1h-2 M13 11h2v1h-2 M1 12h2v1h-2 M9 12h2v1h-2 M13 12h2v1h-2 M1 13h14v1h-14 M2 14h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-panel-right-open
- Matched samples: （无直接源码候选）

### JCSS-0159 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 1h14v1h-14 M1 2h14v1h-14 M1 3h2v1h-2 M9 3h2v1h-2 M13 3h2v1h-2 M1 4h2v1h-2 M9 4h2v1h-2 M13 4h2v1h-2 M1 5h2v1h-2 M9 5h2v1h-2 M13 5h2v1h-2 M1 6h2v1h-2 M9 6h2v1h-2 M13 6h2v1h-2 M1 7h2v1h-2 M9 7h2v1h-2 M13 7h2v1h-2 M1 8h2v1h-2 M9 8h2v1h-2 M13 8h2v1h-2 M1 9h2v1h-2 M9 9h2v1h-2 M13 9h2v1h-2 M1 10h2v1h-2 M9 10h2v1h-2 M13 10h2v1h-2 M1 11h2v1h-2 M9 11h2v1h-2 M13 11h2v1h-2 M1 12h2v1h-2 M9 12h2v1h-2 M13 12h2v1h-2 M1 13h14v1h-14 M1 14h14v1h-14'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-panel-right
- Matched samples: （无直接源码候选）

### JCSS-0160 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M12 0h2v1h-2m-1 0h5v1h-5m-2 0h7v1h-7m0 0h4v1h-4m5-1h2v1h-2m-6 0h8v1h-8m-1 0h3v1h-3m4-1h4v2h-4m-5-1h3v1h-3m-1 0h3v1h-3m5-1h3v1h-3m-6 0h3v1h-3m5-1h3v1h-3m-6 0h3v1h-3m5-1h3v1h-3m-6 0h3v1h-3m5-1h3v1h-3m-6 0h3v2h-3m5-2h3v1h-3m-1 0h3v1h-3m-4 0h6v1h-6m7-1h8v2h-8m-7-1h5v1h-5'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-pencil-line
- Matched samples: （无直接源码候选）

### JCSS-0161 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M12 0h1v1h-1m-1 0h4v1h-4m-2 0h3v2h-3m4-2h2v1h-2m1 0h2v1h-2m-6 0h7v1h-7m-1 0h2v1h-2m4-1h3v2h-3m-5-1h2v1h-2m-1 0h2v1h-2m5-1h2v1h-2m-6 0h2v1h-2m5-1h2v1h-2m-6 0h2v1h-2m5-1h2v1h-2m-6 0h2v1h-2m5-1h2v1h-2m-6 0h2v2h-2m5-2h2v1h-2m-1 0h2v1h-2m-4 0h5v1h-5m0 0h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-pencil
- Matched samples: （无直接源码候选）

### JCSS-0162 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4 M6 2h4v1h-4 M6 3h4v1h-4 M6 4h4v1h-4 M2 5h12v1h-12 M2 6h12v1h-12 M7 7h2v1h-2 M7 8h2v1h-2 M7 9h2v1h-2 M7 10h2v1h-2 M5 11h2v1h-2 M9 11h2v1h-2 M5 12h2v1h-2 M9 12h2v1h-2 M5 13h2v1h-2 M9 13h2v1h-2 M5 14h2v1h-2 M9 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-person-standing
- Matched samples: （无直接源码候选）

### JCSS-0163 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 0h1v1h-1m4-1h6v1h-6m-4 0h2v1h-2m3-1h9v1h-9m-3 0h3v1h-3m10-1h2v1h-2m-9 0h3v1h-3m8-1h3v1h-3m-7 0h3v1h-3m6-1h3v1h-3m-5 0h3v1h-3m5-1h2v2h-2m-4-1h3v1h-3m0 0h4v1h-4m-2 0h3v1h-3m4-1h3v1h-3m-4 0h2v1h-2m5-1h3v1h-3m-6 0h10v1h-10m1 0h10v1h-10m4 0h2v3h-2m4-3h3v1h-3m1 0h3v1h-3m1 0h2v1h-2m1 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-pin-off
- Matched samples: （无直接源码候选）

### JCSS-0164 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4 M5 2h2v1h-2 M9 2h2v1h-2 M5 3h1v1h-1 M10 3h1v1h-1 M5 4h1v1h-1 M10 4h1v1h-1 M5 5h2v1h-2 M9 5h2v1h-2 M5 6h6v1h-6 M5 7h2v1h-2 M9 7h2v1h-2 M5 8h6v1h-6 M2 9h12v1h-12 M2 10h12v1h-12 M7 11h2v1h-2 M7 12h2v1h-2 M7 13h2v1h-2 M7 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-pin
- Matched samples: （无直接源码候选）

### JCSS-0165 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 1h2v1h-2m-1 0h5v1h-5m-1 0h2v10h-2m4-10h3v1h-3m2 0h3v1h-3m1 0h4v1h-4m2 0h3v1h-3m2 0h2v2h-2m-2 0h3v1h-3m-2 0h4v1h-4m-1 0h3v1h-3m-2 0h3v1h-3m-3 0h5v1h-5m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-play
- Matched samples: （无直接源码候选）

### JCSS-0166 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h2v3h-2m4-3h2v3h-2m-4 0h6v1h-6m-2 0h10v1h-10m0 0h2v4h-2m8-4h2v4h-2m-7 0h8v1h-8m1 0h6v1h-6m2 0h2v3h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-plug
- Matched samples: （无直接源码候选）

### JCSS-0167 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 3h2v1h-2 M7 4h2v1h-2 M7 5h2v1h-2 M7 6h2v1h-2 M3 7h10v1h-10 M3 8h10v1h-10 M7 9h2v1h-2 M7 10h2v1h-2 M7 11h2v1h-2 M7 12h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-plus
- Matched samples: （无直接源码候选）

### JCSS-0168 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 3h14v2h-14m-1 0h2v6h-2m14-6h2v6h-2m-7-2h2v1h-2m-1 0h4v1h-4m-5 0h14v1h-14m0 0h5v1h-5m9-1h5v1h-5'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-rectangle-goggles
- Matched samples: （无直接源码候选）

### JCSS-0169 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h5v1h-5 M4 2h9v1h-9 M3 3h3v1h-3 M11 3h3v1h-3 M1 4h5v1h-5 M12 4h3v1h-3 M2 5h3v1h-3 M13 5h2v1h-2 M3 6h1v1h-1 M13 6h2v1h-2 M1 9h2v1h-2 M12 9h1v1h-1 M1 10h2v1h-2 M11 10h3v1h-3 M1 11h3v1h-3 M10 11h5v1h-5 M2 12h3v1h-3 M10 12h3v1h-3 M3 13h9v1h-9 M5 14h5v1h-5'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-refresh-ccw
- Matched samples: （无直接源码候选）

### JCSS-0170 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h5v1h-5 M3 2h9v1h-9 M2 3h3v1h-3 M10 3h3v1h-3 M1 4h3v1h-3 M10 4h5v1h-5 M1 5h2v1h-2 M11 5h3v1h-3 M1 6h2v1h-2 M12 6h1v1h-1 M3 9h1v1h-1 M13 9h2v1h-2 M2 10h3v1h-3 M13 10h2v1h-2 M1 11h5v1h-5 M12 11h3v1h-3 M3 12h3v1h-3 M11 12h3v1h-3 M4 13h9v1h-9 M6 14h5v1h-5'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-refresh-cw
- Matched samples: （无直接源码候选）

### JCSS-0171 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M11 1h1v1h-1m-1 0h2v1h-2m-2 0h7v2h-7m1 0h5v1h-5m-1 0h7v1h-7m0 0h1v1h-1m2-1h2v2h-2m3-2h2v1h-2m-11 1h4v1h-4m9-1h1v1h-1m-10 0h6v1h-6m0 0h2v2h-2m4-2h2v2h-2m-4 0h6v1h-6m1 0h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-regex
- Matched samples: （无直接源码候选）

### JCSS-0172 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M11 0h1v1h-1m0 0h2v1h-2m0 0h3v1h-3m-8 0h12v1h-12m-1 0h13v1h-13m-1 0h2v3h-2m10-3h3v1h-3m0 0h2v1h-2m0 0h1v1h-1m-7 0h1v1h-1m9-1h2v3h-2m-10-2h2v1h-2m-1 0h3v1h-3m-1 0h13v1h-13m0 0h12v1h-12m1 0h3v1h-3m1 0h2v1h-2m1 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-repeat
- Matched samples: （无直接源码候选）

### JCSS-0173 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 4h2v1h-2m-1 0h2v1h-2m-1 0h2v1h-2m-1 0h10v1h-10m0 0h11v1h-11m1 0h2v1h-2m9-1h2v3h-2m-8-2h2v1h-2m1 0h2v1h-2m8 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-reply
- Matched samples: （无直接源码候选）

### JCSS-0174 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M14 0h1v1h-1m-4 0h6v1h-6m-1 0h6v1h-6m-1 0h2v1h-2m5-1h2v3h-2m-9-2h5v1h-5m-1 0h5v1h-5m-1 0h2v1h-2m4-1h2v1h-2m6-1h2v1h-2m-10 0h5v1h-5m9-1h2v1h-2m-9 0h6v1h-6m7-1h3v1h-3m-3 0h6v1h-6m-4 0h4v2h-4m5-2h2v2h-2m3-2h2v2h-2m-9 0h2v1h-2m3-1h2v1h-2m3-1h4v1h-4m-6 0h5v1h-5m6-1h3v1h-3m-6 0h3v1h-3'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-rocket
- Matched samples: （无直接源码候选）

### JCSS-0175 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h5v1h-5 M4 2h9v1h-9 M3 3h3v1h-3 M11 3h3v1h-3 M1 4h5v1h-5 M7 4h2v1h-2 M12 4h3v1h-3 M2 5h3v1h-3 M7 5h2v1h-2 M13 5h2v1h-2 M3 6h1v1h-1 M7 6h2v1h-2 M13 6h2v1h-2 M7 7h2v1h-2 M13 7h2v1h-2 M7 8h4v1h-4 M13 8h2v1h-2 M1 9h2v1h-2 M7 9h4v1h-4 M13 9h2v1h-2 M1 10h3v1h-3 M12 10h3v1h-3 M2 11h2v1h-2 M12 11h2v1h-2 M2 12h3v1h-3 M11 12h3v1h-3 M3 13h10v1h-10 M5 14h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-rotate-ccw-clock
- Matched samples: （无直接源码候选）

### JCSS-0176 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h5v1h-5 M4 2h9v1h-9 M3 3h3v1h-3 M11 3h3v1h-3 M1 4h5v1h-5 M12 4h3v1h-3 M2 5h3v1h-3 M13 5h2v1h-2 M3 6h1v1h-1 M13 6h2v1h-2 M13 7h2v1h-2 M13 8h2v1h-2 M1 9h2v1h-2 M13 9h2v1h-2 M1 10h3v1h-3 M12 10h3v1h-3 M2 11h2v1h-2 M12 11h2v1h-2 M2 12h3v1h-3 M11 12h3v1h-3 M3 13h10v1h-10 M5 14h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-rotate-ccw
- Matched samples: （无直接源码候选）

### JCSS-0177 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h5v1h-5 M3 2h9v1h-9 M2 3h3v1h-3 M10 3h3v1h-3 M1 4h3v1h-3 M10 4h5v1h-5 M1 5h2v1h-2 M11 5h3v1h-3 M1 6h2v1h-2 M12 6h1v1h-1 M1 7h2v1h-2 M1 8h2v1h-2 M1 9h2v1h-2 M13 9h2v1h-2 M1 10h3v1h-3 M12 10h3v1h-3 M2 11h2v1h-2 M12 11h2v1h-2 M2 12h3v1h-3 M11 12h3v1h-3 M3 13h10v1h-10 M5 14h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-rotate-cw
- Matched samples: （无直接源码候选）

### JCSS-0178 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v4h-2m12-4h2v4h-2m-12 0h14v2h-14m0 0h2v4h-2m12-4h2v4h-2m-12 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-rows-2
- Matched samples: （无直接源码候选）

### JCSS-0179 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v2h-2m12-2h2v2h-2m-12 0h14v2h-14m0 0h2v2h-2m12-2h2v2h-2m-12 0h14v2h-14m0 0h2v2h-2m12-2h2v2h-2m-12 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-rows-3
- Matched samples: （无直接源码候选）

### JCSS-0180 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v1h-2m12-1h2v1h-2m-12 0h14v2h-14m0 0h2v1h-2m12-1h2v1h-2m-12 0h14v2h-14m0 0h2v1h-2m12-1h2v1h-2m-12 0h14v2h-14m0 0h2v1h-2m12-1h2v1h-2m-12 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-rows-4
- Matched samples: （无直接源码候选）

### JCSS-0181 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 2h2v1h-2 M3 3h5v1h-5 M5 4h4v1h-4 M7 5h4v1h-4 M9 6h2v1h-2 M3 7h2v1h-2 M10 7h2v1h-2 M3 8h4v1h-4 M10 8h3v1h-3 M5 9h3v1h-3 M11 9h2v1h-2 M6 10h2v1h-2 M11 10h2v1h-2 M7 11h2v1h-2 M12 11h2v1h-2 M2 12h2v1h-2 M7 12h2v1h-2 M12 12h2v1h-2 M2 13h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-rss
- Matched samples: （无直接源码候选）

### JCSS-0182 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 0h1v1h-1m0 0h2v1h-2m4-1h6v1h-6m-4 0h3v1h-3m4-1h7v1h-7m-4 0h4v1h-4m10-1h2v1h-2m-10 0h5v1h-5m8-1h1v1h-1m3-1h2v1h-2m-11 0h2v8h-2m3-8h3v1h-3m5-1h2v1h-2m4-1h2v6h-2m-8-5h3v1h-3m1 0h3v1h-3m-2 0h6v1h-6m0 0h7v1h-7m0 0h2v3h-2m5-3h3v1h-3m1 0h3v1h-3m0 0h4v1h-4m-9 0h14v1h-14m1 0h13v1h-13m12 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-save-off
- Matched samples: （无直接源码候选）

### JCSS-0183 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h9v1h-9m-1 0h11v1h-11m0 0h2v10h-2m3-10h2v1h-2m7-1h2v1h-2m-7 0h6v1h-6m8-1h2v1h-2m-8 0h7v1h-7m9-1h2v8h-2m-9-5h8v2h-8m0 0h2v3h-2m6-3h2v3h-2m-9 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-save
- Matched samples: （无直接源码候选）

### JCSS-0184 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h3v1h-3m9-1h3v1h-3m-10 0h4v1h-4m10-1h4v1h-4m-10 0h2v2h-2m12-2h2v2h-2m-8 0h2v2h-2m4-2h2v2h-2m-4 1h1v1h-1m5-1h1v1h-1m-6 0h3v1h-3m5-1h3v1h-3m-4 0h6v1h-6m-4 0h2v2h-2m12-2h2v2h-2m-12 0h4v1h-4m10-1h4v1h-4m-9 0h3v1h-3m9-1h3v1h-3'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-scan-face
- Matched samples: （无直接源码候选）

### JCSS-0185 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h3v1h-3m9-1h3v1h-3m-10 0h4v1h-4m10-1h4v1h-4m-10 0h2v2h-2m12-2h2v2h-2m-6 0h2v1h-2m-1 0h4v1h-4m-1 0h2v2h-2m4-2h2v2h-2m-3 0h5v1h-5m1 0h4v1h-4m-6 0h2v2h-2m9-2h1v1h-1m3-1h2v2h-2m-12 0h4v1h-4m10-1h4v1h-4m-9 0h3v1h-3m9-1h3v1h-3'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-scan-search
- Matched samples: （无直接源码候选）

### JCSS-0186 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h5v1h-5m-2 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-7 0h2v1h-2m9-1h2v2h-2m-10-1h2v4h-2m4-4h2v1h-2m3-1h2v1h-2m-3 0h4v1h-4m7-1h1v1h-1m-6 0h3v1h-3m6-1h2v1h-2m-7 0h5v1h-5m7-1h1v1h-1m-11 0h3v1h-3m4-1h1v1h-1m3-1h2v1h-2m3-1h2v1h-2m-9 0h2v1h-2m8-1h3v1h-3m-7 0h3v1h-3m6-1h4v1h-4m-5 0h10v1h-10m3 0h1v1h-1m5-1h3v1h-3m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-search-x
- Matched samples: （无直接源码候选）

### JCSS-0187 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 1h4v1h-4 M2 2h8v1h-8 M2 3h2v1h-2 M8 3h2v1h-2 M1 4h2v1h-2 M9 4h2v1h-2 M1 5h2v1h-2 M9 5h2v1h-2 M1 6h2v1h-2 M9 6h2v1h-2 M1 7h2v1h-2 M8 7h3v1h-3 M2 8h2v1h-2 M7 8h3v1h-3 M2 9h9v1h-9 M4 10h4v1h-4 M9 10h3v1h-3 M10 11h3v1h-3 M11 12h3v1h-3 M12 13h3v1h-3 M13 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-search
- Matched samples: （无直接源码候选）

### JCSS-0188 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M14 0h1v1h-1m-3 0h5v1h-5m-3 0h7v1h-7m-3 0h10v1h-10m-3 0h6v1h-6m8-1h5v1h-5m-9 0h4v1h-4m8-1h5v1h-5m-8 0h3v1h-3m7-1h3v1h-3m4-1h2v2h-2m-10-1h8v1h-8m3 0h4v1h-4m6-1h2v3h-2m-5-2h3v1h-3m1 0h2v1h-2m1 0h1v1h-1m2-1h2v1h-2m-2 0h4v2h-4m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-send
- Matched samples: （无直接源码候选）

### JCSS-0189 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 0h12v1h-12m-1 0h14v1h-14m-1 0h2v4h-2m14-4h2v4h-2m-11-3h2v2h-2m3 0h4v1h-4m-5 0h3v1h-3m4-1h6v1h-6m7-1h3v1h-3m-10 0h1v2h-1m3-2h2v2h-2m4-2h2v2h-2m4-2h1v2h-1m-12 0h3v1h-3m4-1h6v1h-6m7-1h3v1h-3m-12 0h2v4h-2m6-4h4v1h-4m8-1h2v4h-2m-11-3h2v2h-2m-2 1h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-server-cog
- Matched samples: （无直接源码候选）

### JCSS-0190 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 2h4v1h-4m-1 0h5v1h-5m0 0h2v2h-2m4-2h7v1h-7m-1 0h8v1h-8m-3 0h5v1h-5m2 0h1v1h-1m7 0h1v1h-1m-2 0h5v1h-5m-6 0h8v1h-8m9-1h2v2h-2m-9-1h7v1h-7m6 0h5v1h-5m0 0h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-settings-2
- Matched samples: （无直接源码候选）

### JCSS-0191 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4 M2 2h2v1h-2 M6 2h4v1h-4 M12 2h2v1h-2 M2 3h12v1h-12 M3 4h10v1h-10 M3 5h3v1h-3 M10 5h3v1h-3 M1 6h4v1h-4 M11 6h4v1h-4 M1 7h4v1h-4 M11 7h4v1h-4 M1 8h4v1h-4 M11 8h4v1h-4 M1 9h4v1h-4 M11 9h4v1h-4 M3 10h3v1h-3 M10 10h3v1h-3 M3 11h10v1h-10 M2 12h12v1h-12 M2 13h2v1h-2 M6 13h4v1h-4 M12 13h2v1h-2 M6 14h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-settings
- Matched samples: （无直接源码候选）

### JCSS-0192 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M10 1h4v1h-4m-1 0h2v2h-2m4-2h2v2h-2m-5 0h7v1h-7m-5 0h2v1h-2m3-1h8v1h-8m-4 0h6v1h-6m-1 0h2v2h-2m4-2h2v2h-2m-3 0h6v1h-6m1 0h2v1h-2m3-1h8v1h-8m2 0h7v1h-7m1 0h2v2h-2m4-2h2v2h-2m-3 0h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-share-2
- Matched samples: （无直接源码候选）

### JCSS-0193 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4m-3 0h10v1h-10m-1 0h4v1h-4m8-1h4v1h-4m-8 0h2v7h-2m10-7h2v7h-2m-5-6h2v4h-2m0 1h2v1h-2m-5 0h3v1h-3m9-1h3v1h-3m-8 0h3v1h-3m7-1h3v1h-3m-6 0h3v1h-3m5-1h3v1h-3m-4 0h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-shield-alert
- Matched samples: （无直接源码候选）

### JCSS-0194 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4m-3 0h10v1h-10m-1 0h4v1h-4m8-1h4v1h-4m-8 0h2v7h-2m10-7h2v7h-2m-3-5h2v1h-2m-4 0h2v1h-2m3-1h2v1h-2m-3 0h4v1h-4m1 0h2v1h-2m-4 1h3v1h-3m9-1h3v1h-3m-8 0h3v1h-3m7-1h3v1h-3m-6 0h3v1h-3m5-1h3v1h-3m-4 0h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-shield-check
- Matched samples: （无直接源码候选）

### JCSS-0195 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 0h1v1h-1m0 0h2v1h-2m5-1h4v1h-4m-5 0h3v1h-3m4-1h8v1h-8m-3 0h3v1h-3m8-1h4v1h-4m-8 0h4v1h-4m10-1h2v6h-2m-10-5h5v1h-5m0 0h2v5h-2m3-5h3v1h-3m1 0h3v1h-3m1 0h3v1h-3m1 0h3v1h-3m1 0h3v1h-3m-7 0h3v1h-3m8-1h3v1h-3m-7 0h3v1h-3m7-1h4v1h-4m-6 0h3v1h-3m5-1h6v1h-6m-4 0h6v1h-6m8-1h2v1h-2m1 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-shield-off
- Matched samples: （无直接源码候选）

### JCSS-0196 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12 M2 2h12v1h-12 M2 3h2v1h-2 M6 3h4v1h-4 M12 3h2v1h-2 M2 4h2v1h-2 M6 4h1v1h-1 M9 4h1v1h-1 M12 4h2v1h-2 M2 5h2v1h-2 M5 5h2v1h-2 M9 5h2v1h-2 M12 5h2v1h-2 M2 6h2v1h-2 M6 6h1v1h-1 M9 6h1v1h-1 M12 6h2v1h-2 M2 7h2v1h-2 M6 7h4v1h-4 M12 7h2v1h-2 M3 8h2v1h-2 M6 8h4v1h-4 M11 8h2v1h-2 M3 9h4v1h-4 M9 9h4v1h-4 M4 10h3v1h-3 M9 10h3v1h-3 M4 11h8v1h-8 M6 12h4v1h-4 M7 13h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-shield-user
- Matched samples: （无直接源码候选）

### JCSS-0197 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4m-3 0h10v1h-10m-1 0h4v1h-4m8-1h4v1h-4m-8 0h2v7h-2m10-7h2v7h-2m-10 0h3v1h-3m9-1h3v1h-3m-8 0h3v1h-3m7-1h3v1h-3m-6 0h3v1h-3m5-1h3v1h-3m-4 0h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-shield
- Matched samples: （无直接源码候选）

### JCSS-0198 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h1v1h-1m5-1h1v1h-1m-8 0h4v1h-4m8-1h4v1h-4m-9 0h6v1h-6m8-1h6v1h-6m-8 0h2v3h-2m4-3h6v1h-6m8-1h2v3h-2m-7-2h4v1h-4m-5 1h4v1h-4m10-1h4v1h-4m-9 0h3v1h-3m9-1h3v1h-3m-8 0h2v6h-2m8-6h2v6h-2m-8 0h10v1h-10m2 0h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-shirt
- Matched samples: （无直接源码候选）

### JCSS-0199 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M11 1h2v1h-2m1 0h2v1h-2m-11 0h3v1h-3m8-1h7v1h-7m-8 0h4v1h-4m7-1h8v1h-8m-4 0h2v1h-2m3-1h2v2h-2m5-2h2v1h-2m-1 0h2v1h-2m-5 0h2v1h-2m-1 0h2v2h-2m6-1h2v1h-2m-7 0h2v1h-2m3-1h2v1h-2m5-1h2v1h-2m-11 0h4v1h-4m7-1h8v1h-8m-7 0h3v1h-3m8-1h7v1h-7m3 0h2v1h-2m-1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-shuffle
- Matched samples: （无直接源码候选）

### JCSS-0200 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M9 1h2v1h-2 M9 2h2v1h-2 M1 3h7v1h-7 M9 3h2v1h-2 M12 3h3v1h-3 M1 4h7v1h-7 M9 4h2v1h-2 M12 4h3v1h-3 M4 5h2v1h-2 M9 5h2v1h-2 M4 6h2v1h-2 M9 6h2v1h-2 M1 7h2v1h-2 M4 7h2v1h-2 M7 7h8v1h-8 M1 8h2v1h-2 M4 8h2v1h-2 M7 8h8v1h-8 M4 9h2v1h-2 M10 9h2v1h-2 M4 10h2v1h-2 M10 10h2v1h-2 M1 11h8v1h-8 M10 11h2v1h-2 M13 11h2v1h-2 M1 12h8v1h-8 M10 12h2v1h-2 M13 12h2v1h-2 M10 13h2v1h-2 M10 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-sliders-horizontal
- Matched samples: （无直接源码候选）

### JCSS-0201 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 0h8v1h-8m-1 0h10v1h-10m-1 0h2v12h-2m10-12h2v12h-2m-5-3h2v2h-2m-4 1h10v1h-10m1 0h8v1h-8'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-smartphone
- Matched samples: （无直接源码候选）

### JCSS-0202 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M12 1h2v1h-2 M11 2h4v1h-4 M7 3h1v1h-1 M11 3h4v1h-4 M7 4h1v1h-1 M12 4h2v1h-2 M7 5h1v1h-1 M6 6h3v1h-3 M5 7h5v1h-5 M1 8h12v1h-12 M5 9h5v1h-5 M6 10h3v1h-3 M2 11h2v1h-2 M7 11h1v1h-1 M1 12h4v1h-4 M7 12h1v1h-1 M1 13h4v1h-4 M7 13h1v1h-1 M2 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-sparkles
- Matched samples: （无直接源码候选）

### JCSS-0203 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M10 1h4v1h-4m-1 0h5v1h-5m0 0h2v1h-2m3-1h2v2h-2m-8-1h1v1h-1m4-1h2v1h-2m-6 0h5v1h-5m6-1h5v1h-5m-6 0h2v2h-2m4-2h6v1h-6m1 0h2v1h-2m-4 0h6v1h-6m1 0h5v1h-5m3 0h2v1h-2m1 0h2v2h-2m-5 0h10v2h-10'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-sprout
- Matched samples: （无直接源码候选）

### JCSS-0204 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M13 0h1v1h-1m-11 0h7v1h-7m9-1h4v1h-4m-10 0h8v1h-8m9-1h3v1h-3m4-1h2v1h-2m-13 0h2v10h-2m8-10h3v1h-3m4-1h2v1h-2m-5 0h3v1h-3m4-1h3v1h-3m-5 0h3v1h-3m4-1h3v1h-3m-5 0h3v1h-3m4-1h3v1h-3m-5 0h3v1h-3m4-1h3v1h-3m4-1h2v6h-2m-8-5h2v1h-2m3-1h3v1h-3m-3 0h5v1h-5m0 0h4v1h-4m-4 2h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-square-pen
- Matched samples: （无直接源码候选）

### JCSS-0205 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v10h-2m12-10h2v10h-2m-9-9h2v1h-2m0 0h3v2h-3m0 0h2v1h-2m3 0h4v1h-4m0 0h3v1h-3m-6 3h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-square-terminal
- Matched samples: （无直接源码候选）

### JCSS-0206 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12 M1 2h14v1h-14 M1 3h2v1h-2 M13 3h2v1h-2 M1 4h2v1h-2 M13 4h2v1h-2 M1 5h2v1h-2 M13 5h2v1h-2 M1 6h2v1h-2 M13 6h2v1h-2 M1 7h2v1h-2 M13 7h2v1h-2 M1 8h2v1h-2 M13 8h2v1h-2 M1 9h2v1h-2 M13 9h2v1h-2 M1 10h2v1h-2 M13 10h2v1h-2 M1 11h2v1h-2 M13 11h2v1h-2 M1 12h2v1h-2 M13 12h2v1h-2 M1 13h14v1h-14 M2 14h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-square
- Matched samples: （无直接源码候选）

### JCSS-0207 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 0h1v1h-1m0 0h2v1h-2m6-1h2v1h-2m-6 0h3v1h-3m5-1h4v2h-4m-4-1h3v1h-3m1 0h3v1h-3m6-1h2v1h-2m-8 0h6v1h-6m8-1h6v1h-6m-8 0h3v2h-3m4-2h3v1h-3m7-1h3v2h-3m-6-1h3v1h-3m-4 0h3v1h-3m5-1h3v1h-3m5-1h2v1h-2m-9 0h2v3h-2m5-3h3v1h-3m1 0h3v1h-3m-2 0h2v1h-2m3-1h3v1h-3m-7 0h11v1h-11m0 0h4v1h-4m6-1h6v1h-6m-6 0h2v1h-2m8-1h4v1h-4m3 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-star-off
- Matched samples: （无直接源码候选）

### JCSS-0208 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 3h2v1h-2 M7 4h2v1h-2 M6 5h4v1h-4 M2 6h12v1h-12 M3 7h10v1h-10 M4 8h8v1h-8 M5 9h6v1h-6 M5 10h6v1h-6 M4 11h8v1h-8 M4 12h3v1h-3 M9 12h3v1h-3 M4 13h1v1h-1 M11 13h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-star
- Matched samples: （无直接源码候选）

### JCSS-0209 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h9v1h-9m-1 0h11v1h-11m0 0h2v10h-2m8-10h4v1h-4m0 0h2v1h-2m3-1h2v1h-2m-3 0h6v1h-6m1 0h5v1h-5m3 0h2v6h-2m-12 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-sticky-note
- Matched samples: （无直接源码候选）

### JCSS-0210 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 1h2v2h-2m-4-1h1v1h-1m9-1h1v1h-1m-10 0h3v1h-3m9-1h3v1h-3m-8 0h2v1h-2m8-1h2v1h-2m-5 0h4v1h-4m-1 0h2v1h-2m4-1h2v1h-2m-8 0h2v2h-2m4-2h1v2h-1m5-2h1v2h-1m3-2h2v2h-2m-8 0h2v1h-2m4-1h2v1h-2m-3 0h4v1h-4m-3 0h2v1h-2m8-1h2v1h-2m-9 0h3v1h-3m9-1h3v1h-3m-8 0h1v1h-1m4-1h2v2h-2m5-2h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-sun
- Matched samples: （无直接源码候选）

### JCSS-0211 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v2h-2m4-2h2v2h-2m8-2h2v2h-2m-12 0h14v2h-14m0 0h2v6h-2m4-6h2v6h-2m8-6h2v6h-2m-12 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-table-2
- Matched samples: （无直接源码候选）

### JCSS-0212 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h12v1h-12m-1 0h14v1h-14m0 0h2v2h-2m6-2h2v2h-2m6-2h2v2h-2m-12 0h14v2h-14m0 0h2v2h-2m6-2h2v2h-2m6-2h2v2h-2m-12 0h14v2h-14m0 0h2v2h-2m6-2h2v2h-2m6-2h2v2h-2m-12 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-table
- Matched samples: （无直接源码候选）

### JCSS-0213 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 0h6v1h-6m-1 0h8v1h-8m-1 0h2v6h-2m8-6h2v1h-2m1 0h2v1h-2m-5 0h2v2h-2m6-2h2v1h-2m1 0h2v1h-2m1 0h2v1h-2m1 0h2v1h-2m-12 0h2v1h-2m13-1h2v1h-2m-12 0h2v1h-2m11-1h2v1h-2m-10 0h2v1h-2m9-1h3v1h-3m-8 0h2v1h-2m7-1h3v1h-3m-6 0h2v1h-2m5-1h3v1h-3m-4 0h2v1h-2m3-1h3v1h-3m-2 0h4v1h-4m1 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-tag
- Matched samples: （无直接源码候选）

### JCSS-0214 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h4v1h-4m-2 0h8v1h-8m0 0h2v5h-2m6-5h3v1h-3m-3 0h2v2h-2m4-2h3v1h-3m-10 0h2v5h-2m11-5h3v1h-3m1 0h3v1h-3m1 0h2v1h-2m-9 0h2v1h-2m10-1h2v1h-2m-9 0h2v1h-2m8-1h2v1h-2m-12 0h2v1h-2m5-1h2v1h-2m6-1h2v1h-2m-11 0h3v1h-3m6-1h2v1h-2m4-1h2v1h-2m-9 0h3v1h-3m6-1h4v1h-4m-5 0h3v1h-3m6-1h2v1h-2m-5 0h3v1h-3m4-1h1v1h-1m-3 0h4v1h-4m2 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-tags
- Matched samples: （无直接源码候选）

### JCSS-0215 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 2h1v1h-1m0 0h2v1h-2m1 0h2v1h-2m1 0h2v1h-2m1 0h2v2h-2m-1 0h3v1h-3m-1 0h3v1h-3m-1 0h3v1h-3m0 0h2v1h-2m5 0h7v1h-7m1 0h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-terminal
- Matched samples: （无直接源码候选）

### JCSS-0216 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 2h14v1h-14 M1 3h14v1h-14 M9 6h3v1h-3 M1 7h6v1h-6 M8 7h5v1h-5 M1 8h8v1h-8 M12 8h2v1h-2 M7 9h2v1h-2 M12 9h2v1h-2 M7 10h2v1h-2 M12 10h2v1h-2 M8 11h6v1h-6 M1 12h6v1h-6 M9 12h6v1h-6 M1 13h6v1h-6 M13 13h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-text-search
- Matched samples: （无直接源码候选）

### JCSS-0217 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 2h12v1h-12m-1 0h14v1h-14m-1 0h2v1h-2m8-1h2v1h-2m6-1h2v1h-2m-14 0h3v1h-3m8-1h1v2h-1m5-2h3v1h-3m-12 0h3v1h-3m11-1h3v1h-3m-10 0h2v2h-2m6-2h2v2h-2m4-2h2v2h-2m-11 0h3v1h-3m7-1h1v2h-1m4-2h3v1h-3m-12 0h3v1h-3m13-1h3v1h-3m-13 0h2v1h-2m8-1h2v1h-2m6-1h2v1h-2m-13 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-ticket
- Matched samples: （无直接源码候选）

### JCSS-0218 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 0h1v1h-1m5-1h4v2h-4m-5-1h2v1h-2m0 0h3v1h-3m1 0h3v1h-3m4-1h4v1h-4m-3 0h9v1h-9m1 0h3v1h-3m6-1h3v1h-3m-5 0h4v1h-4m6-1h3v1h-3m-9 0h2v5h-2m4-5h3v1h-3m6-1h2v3h-2m-5-2h3v1h-3m1 0h3v1h-3m1 0h5v1h-5m1 0h4v1h-4m-7 0h2v1h-2m8-1h3v1h-3m-8 0h4v1h-4m6-1h1v1h-1m3-1h3v1h-3m-7 0h6v1h-6m8-1h2v1h-2m-6 0h2v1h-2m7-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-timer-off
- Matched samples: （无直接源码候选）

### JCSS-0219 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 2h8v1h-8m1 0h7v1h-7m9-1h2v1h-2m-9 0h4v2h-4m5-2h2v2h-2m3-2h2v2h-2m-8 0h10v1h-10m-1 0h14v1h-14m0 0h2v1h-2m5-1h9v1h-9m-5 0h1v2h-1m3-2h1v2h-1m3-2h2v2h-2m6-2h2v1h-2m-3 0h5v1h-5m-9 0h2v1h-2m5-1h9v1h-9m-5 0h13v1h-13m1 0h5v1h-5m8-1h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-tractor
- Matched samples: （无直接源码候选）

### JCSS-0220 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4 M6 2h1v1h-1 M9 2h1v1h-1 M6 3h1v1h-1 M9 3h1v1h-1 M1 4h14v1h-14 M1 5h14v1h-14 M2 6h2v1h-2 M12 6h2v1h-2 M2 7h2v1h-2 M12 7h2v1h-2 M2 8h2v1h-2 M6 8h1v1h-1 M9 8h1v1h-1 M12 8h2v1h-2 M2 9h2v1h-2 M6 9h1v1h-1 M9 9h1v1h-1 M12 9h2v1h-2 M2 10h2v1h-2 M6 10h1v1h-1 M9 10h1v1h-1 M12 10h2v1h-2 M2 11h2v1h-2 M6 11h1v1h-1 M9 11h1v1h-1 M12 11h2v1h-2 M2 12h2v1h-2 M6 12h1v1h-1 M9 12h1v1h-1 M12 12h2v1h-2 M2 13h12v1h-12 M2 14h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-trash
- Matched samples: （无直接源码候选）

### JCSS-0221 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M10 4h6v2h-6m-5 0h1v1h-1m7-1h4v1h-4m-8 0h3v1h-3m7-1h2v1h-2m3-1h2v2h-2m-11-1h5v1h-5m7-1h2v1h-2m-8 0h2v1h-2m5-1h4v1h-4m7-1h1v1h-1m-13 0h2v1h-2m7-1h2v1h-2m-7 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-trending-up
- Matched samples: （无直接源码候选）

### JCSS-0222 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 1h2v1h-2m-1 0h4v1h-4m-1 0h2v2h-2m4-2h2v2h-2m-5 0h2v2h-2m3-2h2v4h-2m3-4h2v2h-2m-7 0h2v1h-2m8-1h2v1h-2m-9 0h3v1h-3m9-1h3v1h-3m-9 0h2v1h-2m10-1h2v1h-2m-11 0h2v2h-2m12-2h2v2h-2m-6-1h2v1h-2m-7 0h2v1h-2m14-1h2v1h-2m-13 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-triangle-alert
- Matched samples: （无直接源码候选）

### JCSS-0223 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 0h6v1h-6m-1 0h8v1h-8m0 0h2v1h-2m6-1h2v1h-2m-5 0h2v1h-2m4-1h2v1h-2m-3 0h4v1h-4m1 0h2v1h-2m-6 1h2v2h-2m4-2h2v2h-2m4-2h2v2h-2m4-2h2v2h-2m-6 1h2v1h-2m-1 0h4v1h-4m-1 0h2v1h-2m4-1h2v1h-2m-5 0h2v1h-2m6-1h2v1h-2m-6 0h8v1h-8m1 0h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-triangles-centerline-dashed-horizontal
- Matched samples: （无直接源码候选）

### JCSS-0224 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 1h2v2h-2m-6 1h2v1h-2m12-1h2v1h-2m-13 0h4v1h-4m7-1h2v2h-2m5-2h4v1h-4m-12 0h2v4h-2m3-4h2v1h-2m8-1h2v1h-2m3-1h2v4h-2m-10-3h2v2h-2m6-2h2v2h-2m-7 0h2v1h-2m4-1h2v2h-2m4-2h2v1h-2m-11 0h4v1h-4m12-1h4v1h-4m-11 0h2v1h-2m12-1h2v1h-2m-6 1h2v2h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-triangles-centerline-dashed-vertical
- Matched samples: （无直接源码候选）

### JCSS-0225 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 2h12v2h-12m0 0h2v1h-2m5-1h2v8h-2m5-8h2v1h-2m-10 0h1v1h-1m11-1h1v1h-1m-7 6h4v1h-4m-1 0h6v1h-6'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-type
- Matched samples: （无直接源码候选）

### JCSS-0226 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 1h7v1h-7m-1 0h8v1h-8m0 0h2v3h-2m7-3h2v3h-2m-7 0h8v1h-8m2 0h5v1h-5m5 0h5v1h-5m-1 0h8v1h-8m-1 0h2v3h-2m7-3h2v3h-2m-6 0h8v1h-8m0 0h7v1h-7'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-ungroup
- Matched samples: （无直接源码候选）

### JCSS-0227 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M7 1h2v1h-2m-1 0h4v1h-4m-1 0h6v1h-6m-1 0h8v1h-8m0 0h2v1h-2m3-1h2v6h-2m3-6h2v1h-2m-9 3h2v4h-2m12-4h2v4h-2m-12 0h14v1h-14m1 0h12v1h-12'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-upload
- Matched samples: （无直接源码候选）

### JCSS-0228 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 1h4v1h-4m-1 0h6v1h-6m0 0h2v1h-2m4-1h2v1h-2m-5 0h2v1h-2m6-1h2v1h-2m-5 0h2v1h-2m4-1h2v1h-2m7-1h1v1h-1m-11 0h6v1h-6m7-1h1v1h-1m3-1h2v1h-2m-9 0h4v1h-4m6-1h4v1h-4m1 0h2v1h-2m-9 0h8v1h-8m-1 0h10v1h-10m0 0h2v1h-2m8-1h2v1h-2m-9 0h2v2h-2m10-2h2v2h-2m-9 0h1v1h-1m9-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user-check
- Matched samples: （无直接源码候选）

### JCSS-0229 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 1h4v1h-4m-1 0h6v1h-6m0 0h2v1h-2m4-1h2v1h-2m-5 0h2v1h-2m6-1h2v1h-2m-5 0h2v1h-2m4-1h2v1h-2m-4 0h6v1h-6m7-1h5v2h-5m-6-1h4v1h-4m-2 1h8v1h-8m-1 0h10v1h-10m0 0h2v1h-2m8-1h2v1h-2m-9 0h2v2h-2m10-2h2v2h-2m-9 0h1v1h-1m9-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user-minus
- Matched samples: （无直接源码候选）

### JCSS-0230 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 1h4v1h-4m-1 0h6v1h-6m0 0h2v1h-2m4-1h2v1h-2m-5 0h2v1h-2m6-1h2v1h-2m4-1h1v1h-1m-9 0h2v1h-2m4-1h2v1h-2m5-1h2v1h-2m-9 0h6v1h-6m7-1h5v2h-5m-6-1h4v1h-4m8 0h2v2h-2m-10-1h8v1h-8m-1 0h10v1h-10m0 0h2v1h-2m8-1h2v1h-2m-9 0h2v2h-2m10-2h2v2h-2m-9 0h1v1h-1m9-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user-plus
- Matched samples: （无直接源码候选）

### JCSS-0231 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 1h1v1h-1 M2 2h5v1h-5 M2 3h1v1h-1 M6 3h1v1h-1 M2 4h1v1h-1 M6 4h1v1h-1 M2 5h5v1h-5 M4 6h1v1h-1 M4 8h1v1h-1 M14 8h1v1h-1 M2 9h5v1h-5 M13 9h2v1h-2 M1 10h2v1h-2 M6 10h2v1h-2 M9 10h2v1h-2 M12 10h3v1h-3 M1 11h1v1h-1 M7 11h1v1h-1 M9 11h5v1h-5 M10 12h3v1h-3 M11 13h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user-round-check
- Matched samples: （无直接源码候选）

### JCSS-0232 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h3v1h-3m-1 0h6v1h-6m-1 0h2v1h-2m5-1h2v1h-2m-5 0h1v1h-1m6-1h2v3h-2m-7-2h2v1h-2m1 0h2v1h-2m0 0h3v1h-3m4-1h3v1h-3m-3 0h6v1h-6m-2 0h9v1h-9m0 0h2v1h-2m7-1h2v1h-2m-8 0h2v2h-2m9-1h5v2h-5m-10-1h2v1h-2m1 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user-round-minus
- Matched samples: （无直接源码候选）

### JCSS-0233 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h3v1h-3m-1 0h6v1h-6m-1 0h2v1h-2m5-1h2v1h-2m-5 0h1v1h-1m6-1h2v3h-2m-7-2h2v1h-2m1 0h2v1h-2m0 0h3v1h-3m4-1h3v1h-3m-3 0h5v1h-5m-2 0h7v1h-7m9-1h2v1h-2m-9 0h2v1h-2m8-1h4v1h-4m-9 0h2v2h-2m8-2h2v2h-2m4-2h2v2h-2m-13 0h2v1h-2m10-1h5v1h-5m-9 0h1v1h-1m10-1h4v1h-4m3 0h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user-round-search
- Matched samples: （无直接源码候选）

### JCSS-0234 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4 M5 2h2v1h-2 M9 2h2v1h-2 M4 3h2v1h-2 M10 3h2v1h-2 M4 4h2v1h-2 M10 4h2v1h-2 M4 5h2v1h-2 M10 5h2v1h-2 M4 6h2v1h-2 M10 6h2v1h-2 M5 7h2v1h-2 M9 7h2v1h-2 M6 8h4v1h-4 M5 10h6v1h-6 M3 11h2v1h-2 M11 11h2v1h-2 M2 12h2v1h-2 M12 12h2v1h-2 M1 13h2v1h-2 M13 13h2v1h-2 M1 14h2v1h-2 M13 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user-round
- Matched samples: （无直接源码候选）

### JCSS-0235 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 1h4v1h-4 M2 2h2v1h-2 M6 2h2v1h-2 M1 3h2v1h-2 M7 3h2v1h-2 M1 4h2v1h-2 M7 4h2v1h-2 M1 5h2v1h-2 M7 5h2v1h-2 M1 6h2v1h-2 M7 6h2v1h-2 M2 7h2v1h-2 M6 7h2v1h-2 M10 7h2v1h-2 M3 8h4v1h-4 M9 8h1v1h-1 M12 8h1v1h-1 M8 9h1v1h-1 M13 9h1v1h-1 M3 10h4v1h-4 M8 10h1v1h-1 M13 10h1v1h-1 M2 11h2v1h-2 M6 11h2v1h-2 M9 11h1v1h-1 M12 11h1v1h-1 M1 12h2v1h-2 M7 12h2v1h-2 M10 12h4v1h-4 M1 13h2v1h-2 M7 13h2v1h-2 M13 13h2v1h-2 M1 14h2v1h-2 M7 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user-search
- Matched samples: （无直接源码候选）

### JCSS-0236 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 1h1v1h-1 M2 2h5v1h-5 M2 3h1v1h-1 M6 3h1v1h-1 M2 4h1v1h-1 M6 4h1v1h-1 M2 5h5v1h-5 M4 6h1v1h-1 M11 6h1v1h-1 M11 7h1v1h-1 M4 8h1v1h-1 M11 8h1v1h-1 M2 9h5v1h-5 M8 9h7v1h-7 M1 10h2v1h-2 M6 10h2v1h-2 M9 10h5v1h-5 M1 11h1v1h-1 M7 11h1v1h-1 M10 11h3v1h-3 M9 12h2v1h-2 M12 12h2v1h-2 M9 13h1v1h-1 M13 13h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user-star
- Matched samples: （无直接源码候选）

### JCSS-0237 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 1h4v1h-4m-1 0h6v1h-6m0 0h2v1h-2m4-1h2v1h-2m-5 0h2v1h-2m6-1h2v1h-2m3-1h1v1h-1m3-1h1v1h-1m-11 0h2v1h-2m4-1h2v1h-2m4-1h4v4h-4m-8-3h6v1h-6m1 0h4v1h-4m-2 1h8v1h-8m9-1h1v1h-1m3-1h1v1h-1m-13 0h10v1h-10m0 0h2v1h-2m8-1h2v1h-2m-9 0h2v2h-2m10-2h2v2h-2m-9 0h1v1h-1m9-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user-x
- Matched samples: （无直接源码候选）

### JCSS-0238 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 1h4v1h-4 M5 2h2v1h-2 M9 2h2v1h-2 M4 3h2v1h-2 M10 3h2v1h-2 M4 4h2v1h-2 M10 4h2v1h-2 M4 5h2v1h-2 M10 5h2v1h-2 M4 6h2v1h-2 M10 6h2v1h-2 M5 7h2v1h-2 M9 7h2v1h-2 M6 8h4v1h-4 M4 10h8v1h-8 M3 11h2v1h-2 M11 11h2v1h-2 M2 12h2v1h-2 M12 12h2v1h-2 M2 13h2v1h-2 M12 13h2v1h-2 M2 14h2v1h-2 M12 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-user
- Matched samples: （无直接源码候选）

### JCSS-0239 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 1h3v1h-3 M11 1h1v1h-1 M2 2h5v1h-5 M9 2h5v1h-5 M2 3h1v1h-1 M6 3h1v1h-1 M9 3h1v1h-1 M13 3h1v1h-1 M2 4h1v1h-1 M6 4h1v1h-1 M9 4h1v1h-1 M13 4h1v1h-1 M2 5h5v1h-5 M9 5h5v1h-5 M3 6h3v1h-3 M11 6h1v1h-1 M2 9h5v1h-5 M9 9h5v1h-5 M1 10h2v1h-2 M6 10h5v1h-5 M12 10h3v1h-3 M1 11h1v1h-1 M7 11h3v1h-3 M13 11h2v1h-2 M1 12h1v1h-1 M7 12h2v1h-2 M14 12h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-users-round
- Matched samples: （无直接源码候选）

### JCSS-0240 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M4 1h4v1h-4m6-1h2v1h-2m-7 0h6v1h-6m7-1h3v1h-3m-7 0h2v1h-2m4-1h2v1h-2m4-1h2v1h-2m-9 0h2v1h-2m6-1h2v1h-2m4-1h2v1h-2m-9 0h2v1h-2m4-1h2v1h-2m4-1h2v1h-2m-8 0h6v1h-6m7-1h3v1h-3m-6 0h4v1h-4m6-1h2v1h-2m-8 1h8v1h-8m10-1h2v1h-2m-11 0h10v1h-10m11-1h3v1h-3m-11 0h2v1h-2m8-1h2v1h-2m4-1h2v1h-2m-13 0h2v2h-2m10-2h2v2h-2m4-2h2v2h-2m-13 0h1v1h-1m9-1h1v1h-1m4-1h1v1h-1'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-users
- Matched samples: （无直接源码候选）

### JCSS-0241 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M1 3h10v2h-10m12-1h2v1h-2m-13 0h2v6h-2m10-6h6v2h-6m0 0h2v2h-2m4-2h2v2h-2m-4 0h6v2h-6m-9 0h10v2h-10m12-2h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-video
- Matched samples: （无直接源码候选）

### JCSS-0242 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 2h2v1h-2m-1 0h3v1h-3m7-1h2v1h-2m-10 0h6v1h-6m10-1h3v1h-3m-11 0h4v1h-4m5-1h2v6h-2m4-6h1v1h-1m3-1h2v2h-2m-13-1h2v4h-2m10-4h2v4h-2m4-3h2v2h-2m-1 0h2v2h-2m-12-1h4v1h-4m9-1h1v1h-1m-8 0h6v1h-6m10-1h3v1h-3m-7 0h3v1h-3m7-1h2v1h-2m-6 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-volume-2
- Matched samples: （无直接源码候选）

### JCSS-0243 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M6 2h2v1h-2m-1 0h3v1h-3m-3 0h6v1h-6m-1 0h4v1h-4m5-1h2v6h-2m8-6h1v1h-1m-14 0h2v4h-2m10-4h5v1h-5m1 0h3v2h-3m-1 0h5v1h-5m-9 0h4v1h-4m13-1h1v1h-1m-12 0h6v1h-6m3 0h3v1h-3m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-volume-x
- Matched samples: （无直接源码候选）

### JCSS-0244 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M10 1h4v1h-4 M9 2h2v1h-2 M13 2h2v1h-2 M9 3h1v1h-1 M14 3h1v1h-1 M9 4h1v1h-1 M14 4h1v1h-1 M9 5h2v1h-2 M13 5h2v1h-2 M8 6h6v1h-6 M7 7h3v1h-3 M6 8h3v1h-3 M2 9h6v1h-6 M1 10h2v1h-2 M5 10h2v1h-2 M1 11h1v1h-1 M6 11h1v1h-1 M1 12h2v1h-2 M5 12h2v1h-2 M2 13h4v1h-4'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-waypoints
- Matched samples: （无直接源码候选）

### JCSS-0245 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M10 1h1v1h-1 M8 2h3v1h-3 M7 3h3v1h-3 M7 4h2v1h-2 M6 5h2v1h-2 M13 5h2v1h-2 M7 6h2v1h-2 M12 6h2v1h-2 M7 7h3v1h-3 M11 7h3v1h-3 M6 8h7v1h-7 M5 9h3v1h-3 M10 9h1v1h-1 M4 10h3v1h-3 M3 11h3v1h-3 M2 12h3v1h-3 M1 13h3v1h-3 M1 14h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-wrench
- Matched samples: （无直接源码候选）

### JCSS-0246 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M3 3h2v1h-2 M11 3h2v1h-2 M4 4h2v1h-2 M10 4h2v1h-2 M5 5h2v1h-2 M9 5h2v1h-2 M6 6h4v1h-4 M7 7h2v1h-2 M7 8h2v1h-2 M6 9h4v1h-4 M5 10h2v1h-2 M9 10h2v1h-2 M4 11h2v1h-2 M10 11h2v1h-2 M3 12h2v1h-2 M11 12h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-x
- Matched samples: （无直接源码候选）

### JCSS-0247 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h5v1h-5m-2 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-7 0h2v1h-2m5-1h1v1h-1m4-1h2v2h-2m-10-1h2v4h-2m5-4h2v1h-2m-1 0h5v2h-5m7-2h1v1h-1m0 0h2v1h-2m-6 0h2v2h-2m6-2h1v1h-1m-11 0h3v1h-3m10-1h2v1h-2m-9 0h2v1h-2m8-1h3v1h-3m-7 0h3v1h-3m6-1h4v1h-4m-5 0h10v1h-10m3 0h1v1h-1m5-1h3v1h-3m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-zoom-in
- Matched samples: （无直接源码候选）

### JCSS-0248 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `--px: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M5 1h5v1h-5m-2 0h8v1h-8m-1 0h3v1h-3m7-1h3v1h-3m-7 0h2v1h-2m9-1h2v2h-2m-10-1h2v4h-2m4-3h5v2h-5m7-2h1v1h-1m0 0h2v1h-2m0 0h1v1h-1m-11 0h3v1h-3m10-1h2v1h-2m-9 0h2v1h-2m8-1h3v1h-3m-7 0h3v1h-3m6-1h4v1h-4m-5 0h10v1h-10m3 0h1v1h-1m5-1h3v1h-3m1 0h2v1h-2'/%3E%3C/svg%3E")`
- Selectors: svg.lucide-zoom-out
- Matched samples: （无直接源码候选）

### JCSS-0249 — 0 element records / 0 source locations
- CSS blocks 1; sections icons; states base; targets host.
- Declaration code: `transform: none`
- Selectors: svg.lucide-person-standing
- Matched samples: （无直接源码候选）

### JCSS-0250 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `--wd-desktop: #16112a; --wd-window: #201936; --wd-raised: #2a2147; --wd-title: #2f2552; --wd-title-active: #d97fc6; --wd-frame: #6c5ce0; … (28 declarations)`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0257 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `display: flex; background-color: var(--wd-raised); color: var(--wd-text); border: 1px solid var(--wd-frame); border-radius: 999px; box-shadow: 3px 3px 0 var(--wd-title-active); … (9 declarations)`
- Selectors: .vrcx-0-side-panel [data-slot="collapsible"] > button[data-variant="ghost"][data-size="sm"]:has(> svg.lucide-chevron-down)
- Matched samples: （无直接源码候选）

### JCSS-0258 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets ::before.
- Declaration code: `content: ""; width: 6px; height: 6px; flex: none; border-radius: 50%; background-color: var(--wd-title-active)`
- Selectors: .vrcx-0-side-panel [data-slot="collapsible"] > button[data-variant="ghost"][data-size="sm"]:has(> svg.lucide-chevron-down)::before
- Matched samples: （无直接源码候选）

### JCSS-0259 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `background: transparent; border-color: transparent; color: var(--wd-muted); font-family: "WD Pixel CJK",sans-serif`
- Selectors: .vrcx-0-side-panel [data-slot="collapsible"] > button[data-variant="ghost"][data-size="sm"]:has(> svg.lucide-chevron-down) > [data-slot="badge"]
- Matched samples: （无直接源码候选）

### JCSS-0260 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states hover; targets host.
- Declaration code: `background-color: var(--wd-select)`
- Selectors: .vrcx-0-side-panel [data-slot="collapsible"] > button[data-variant="ghost"][data-size="sm"]:has(> svg.lucide-chevron-down):hover
- Matched samples: （无直接源码候选）

### JCSS-0261 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets ::before.
- Declaration code: `display: block; flex: none`
- Selectors: [data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]::before
- Matched samples: （无直接源码候选）

### JCSS-0264 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `--vrcx-0-table-surface: var(--wd-window); --vrcx-0-table-header-surface: var(--wd-raised); background-color: transparent; background-image: none`
- Selectors: .vrcx-0-main-content .vrcx-0-data-table
- Matched samples: （无直接源码候选）

### JCSS-0275 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; z-index: 1; pointer-events: none; mask-image: var(--jk-mask-s4),var(--jk-mask-s4); mask-position: left top,right top; … (7 declarations)`
- Selectors: .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::before
- Matched samples: （无直接源码候选）

### JCSS-0276 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; inset: auto 0 0; z-index: 1; pointer-events: none; mask: var(--jk-mask-s2) left bottom/10px 6px repeat-x`
- Selectors: .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::after
- Matched samples: （无直接源码候选）

### JCSS-0277 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets ::before.
- Declaration code: `content: ""; display: block; width: 16px; height: 16px; flex: none; margin: 0 4px 0 8px; … (9 declarations)`
- Selectors: .entity-dialog [data-slot="tabs-list"][class~="h-11"]::before
- Matched samples: （无直接源码候选）

### JCSS-0278 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `border-color: transparent; border-radius: 0; border-width: 0; box-shadow: none; outline: none`
- Selectors: .entity-dialog [data-slot="card-header"] div.absolute.bottom-3.left-3 [data-slot="button"]:not(.border-0)
- Matched samples: （无直接源码候选）

### JCSS-0279 — 0 element records / 0 source locations
- CSS blocks 2; sections runtime, user-dialog-r9; states base; targets host.
- Declaration code: `border-radius: 0; clip-path: var(--wd-avatar-cut)`
- Selectors: .entity-dialog [data-slot="card-header"] div.absolute.bottom-3.left-3 [data-slot="button"]:not(.border-0) img / .entity-dialog [data-slot="card-header"] > div.relative > div.absolute.bottom-3.left-3.z-30.size-16 > button[data-slot="button"] > img
- Matched samples: （无直接源码候选）

### JCSS-0280 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `--wd-avatar-cut: polygon(37.5% 0,62.5% 0,62.5% 3.125%,71.875% 3.125%,71.875% 6.25%,78.125% 6.25%,78.125% 9.375%,81.25% 9.375%,81.25% 12.5%,84.375% 12.5%,84.375% 15.625%,87.5% 15.625%,87.5% 18.75%,90.625% 18.75%,90.625% 21.875%,93.75% 21.875%,93.75% 28.125%,96.875% 28.125%,96.875% 37.5%,100% 37.5%,100% 62.5%,96.875% 62.5%,96.875% 71.875%,93.75% 71.875%,93.75% 78.125%,90.625% 78.125%,90.625% 81.25%,87.5% 81.25%,87.5% 84.375%,84.375% 84.375%,84.375% 87.5%,81.25% 87.5%,81.25% 90.625%,78.125% 90.625%,78.125% 93.75%,71.875% 93.75%,71.875% 96.875%,62.5% 96.875%,62.5% 100%,37.5% 100%,37.5% 96.875%,28.125% 96.875%,28.125% 93.75%,21.875% 93.75%,21.875% 90.625%,18.75% 90.625%,18.75% 87.5%,15.625% 87.5%,15.625% 84.375%,12.5% 84.375%,12.5% 81.25%,9.375% 81.25%,9.375% 78.125%,6.25% 78.125%,6.25% 71.875%,3.125% 71.875%,3.125% 62.5%,0 62.5%,0 37.5%,3.125% 37.5%,3.125% 28.125%,6.25% 28.125%,6.25% 21.875%,9.375% 21.875%,9.375% 18.75%,12.5% 18.75%,12.5% 15.625%,15.625% 15.625%,15.625% 12.5%,18.75% 12.5%,18.75% 9.375%,21.875% 9.375%,21.875% 6.25%,28.125% 6.25%,28.125% 3.125%,37.5% 3.125%); --wd-avatar-cut-sm: polygon(31.25% 0%,68.75% 0%,68.75% 6.25%,81.25% 6.25%,81.25% 12.5%,87.5% 12.5%,87.5% 18.75%,93.75% 18.75%,93.75% 25%,93.75% 31.25%,100% 31.25%,100% 37.5%,100% 43.75%,100% 50%,100% 56.25%,100% 62.5%,100% 68.75%,93.75% 68.75%,93.75% 75%,93.75% 81.25%,87.5% 81.25%,87.5% 87.5%,81.25% 87.5%,81.25% 93.75%,68.75% 93.75%,68.75% 100%,31.25% 100%,31.25% 93.75%,18.75% 93.75%,18.75% 87.5%,12.5% 87.5%,12.5% 81.25%,6.25% 81.25%,6.25% 75%,6.25% 68.75%,0 68.75%,0 62.5%,0 56.25%,0 50%,0 43.75%,0 37.5%,0 31.25%,6.25% 31.25%,6.25% 25%,6.25% 18.75%,12.5% 18.75%,12.5% 12.5%,18.75% 12.5%,18.75% 6.25%,31.25% 6.25%)`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0283 — 0 element records / 0 source locations
- CSS blocks 3; sections runtime, login-r8, popups-r9; states base; targets host.
- Declaration code: `clip-path: var(--wd-avatar-cut)`
- Selectors: [data-slot="avatar"][data-size="lg"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"]) / [data-vrcx-0-surface="login-page"] [data-slot="avatar"][data-size="lg"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"]) / :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"][data-size="lg"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset])) > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])
- Matched samples: （无直接源码候选）

### JCSS-0286 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets host.
- Declaration code: `border-radius: 0; clip-path: var(--wd-avatar-cut-sm); border-color: transparent; border-width: 0; box-shadow: none; outline: none`
- Selectors: .vrcx-0-side-panel span:has(>span[class~="size-3.75"]) > span.overflow-hidden / 
.vrcx-0-data-table span:has(>span[class~="size-3.75"]) > span.overflow-hidden
- Matched samples: （无直接源码候选）

### JCSS-0289 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets ::-webkit-calendar-picker-indicator.
- Declaration code: `background-image: var(--wd-native-clock); background-size: 16px 16px; background-position: center; background-repeat: no-repeat`
- Selectors: .vrcx-0-app-root input[type="time"]::-webkit-calendar-picker-indicator
- Matched samples: （无直接源码候选）

### JCSS-0290 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets ::after.
- Declaration code: `content: ""; display: inline-block; width: 12px; height: 12px; vertical-align: middle; background-color: currentColor; … (7 declarations)`
- Selectors: .entity-json-view-collapse::after /  .entity-json-view-expand::after /  .entity-json-view-collapsed::after
- Matched samples: （无直接源码候选）

### JCSS-0291 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets ::after.
- Declaration code: `mask-image: var(--wd-icon-right)`
- Selectors: .entity-json-view-expand::after
- Matched samples: （无直接源码候选）

### JCSS-0292 — 0 element records / 0 source locations
- CSS blocks 1; sections runtime; states base; targets ::after.
- Declaration code: `mask-image: var(--wd-icon-ellipsis)`
- Selectors: .entity-json-view-collapsed::after
- Matched samples: （无直接源码候选）

### JCSS-0295 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `--jk-chrome-ink: #16112a; --jk-chrome-ink-soft: #3b2a45; --jk-chrome-edge: #1a1226; --jk-chrome-bevel-light: #fdf4ff; --jk-chrome-bevel-dark: #7a3f6d`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0297 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `color: var(--jk-chrome-ink-soft)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] :is([class*='text-muted-foreground'], [class*='text-content-'])
- Matched samples: （无直接源码候选）

### JCSS-0298 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states hover; targets host.
- Declaration code: `color: var(--jk-chrome-ink)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] :is([class*='text-muted-foreground'], [class*='text-content-']):hover
- Matched samples: （无直接源码候选）

### JCSS-0299 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `width: 16px; height: 16px; flex: none`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0'] > svg
- Matched samples: （无直接源码候选）

### JCSS-0300 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states hover; targets host.
- Declaration code: `border-color: var(--jk-chrome-edge); box-shadow: inset 1px 1px 0 rgb(255 255 255 / 0.45),
        inset -1px -1px 0 rgb(0 0 0 / 0.45)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0'][class*='destructive']:hover
- Matched samples: （无直接源码候选）

### JCSS-0302 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `border: 1px solid var(--jk-chrome-edge); border-radius: 0; background-image: none; box-shadow: inset -1px -1px 0 rgb(0 0 0 / 0.28)`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] span[class~='size-2'][class~='rounded-full']
- Matched samples: （无直接源码候选）

### JCSS-0303 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `background-color: var(--wd-faint,#a294c8)`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] span[class~='size-2'][class~='rounded-full'][class*='bg-muted-foreground']
- Matched samples: （无直接源码候选）

### JCSS-0305 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `--jk-r4-keycap: #fff2fb`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0306 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `background-image: none; border: 1px solid var(--jk-chrome-edge); padding-inline: 7px`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] button.vrcx-0-toolbar-control[data-vrcx-0-control='toolbar']
- Matched samples: （无直接源码候选）

### JCSS-0307 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `height: 16px; min-width: 16px; padding-inline: 3px; border: 1px solid var(--jk-chrome-edge); border-radius: 0; background-color: var(--jk-r4-keycap); … (8 declarations)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] button.vrcx-0-toolbar-control[data-vrcx-0-control='toolbar'] kbd[data-slot='kbd']
- Matched samples: （无直接源码候选）

### JCSS-0308 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `padding-inline: 7px`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] [data-slot='menubar'] [data-slot='menubar-trigger']
- Matched samples: （无直接源码候选）

### JCSS-0309 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `padding-left: 12px; padding-right: 17px`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] [data-slot='menubar'] [data-slot='menubar-trigger']:has(> .vrcx-0-brand)
- Matched samples: （无直接源码候选）

### JCSS-0310 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets host.
- Declaration code: `position: relative; font-family: var(--wd-body-font-family, 'WD Pixel CJK'); font-synthesis: none`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand
- Matched samples: （无直接源码候选）

### JCSS-0311 — 0 element records / 0 source locations
- CSS blocks 1; sections window-chrome; states base; targets ::after.
- Declaration code: `content: ''; position: absolute; pointer-events: none`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after
- Matched samples: （无直接源码候选）

### JCSS-0312 — 0 element records / 0 source locations
- CSS blocks 1; sections group-spacing; states base; targets host.
- Declaration code: `padding-bottom: 10px`
- Selectors: .vrcx-0-side-panel [data-slot="collapsible"]:has(> button[data-variant="ghost"][data-size="sm"] > svg.lucide-chevron-down)
- Matched samples: （无直接源码候选）

### JCSS-0313 — 0 element records / 0 source locations
- CSS blocks 1; sections body-typography; states base; targets host.
- Declaration code: `--wd-body-font-family: "WD Pixel CJK", var(--vrcx-app-font-family, system-ui), sans-serif; --font-sans: var(--wd-body-font-family); --font-heading: var(--wd-body-font-family)`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0316 — 0 element records / 0 source locations
- CSS blocks 1; sections body-typography; states base; targets host.
- Declaration code: `font-family: var(--wd-body-font-family) !important`
- Selectors: [data-slot="dialog-content"][style*="--vrcx-app-font-family"]:not(.font-mono)
- Matched samples: （无直接源码候选）

### JCSS-0323 — 0 element records / 0 source locations
- CSS blocks 1; sections side-panel; states base; targets host.
- Declaration code: `background-color: var(--wd-raised); outline: 1px solid var(--wd-frame); outline-offset: -1px`
- Selectors: .vrcx-0-side-panel [data-slot='tabs'] > div:not(.vrcx-0-side-panel-rail)
- Matched samples: （无直接源码候选）

### JCSS-0324 — 0 element records / 0 source locations
- CSS blocks 1; sections side-panel; states base; targets host.
- Declaration code: `padding-inline: 0`
- Selectors: .vrcx-0-side-panel .vrcx-0-side-panel-rail [data-slot='tabs-list']
- Matched samples: （无直接源码候选）

### JCSS-0325 — 0 element records / 0 source locations
- CSS blocks 1; sections side-panel; states base; targets host.
- Declaration code: `border-radius: 0; border-color: transparent; background-color: #1d1631; color: var(--wd-faint)`
- Selectors: .vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab']
- Matched samples: （无直接源码候选）

### JCSS-0327 — 0 element records / 0 source locations
- CSS blocks 1; sections side-panel; states base; targets host.
- Declaration code: `border-color: var(--wd-frame); border-left-color: transparent; background-color: var(--wd-raised); color: var(--wd-pink)`
- Selectors: .vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab'][data-active]
- Matched samples: （无直接源码候选）

### JCSS-0328 — 0 element records / 0 source locations
- CSS blocks 1; sections side-panel; states base; targets ::after.
- Declaration code: `content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 3px; … (8 declarations)`
- Selectors: .vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab'][data-active]::after
- Matched samples: （无直接源码候选）

### JCSS-0329 — 0 element records / 0 source locations
- CSS blocks 1; sections side-panel; states base; targets ::before.
- Declaration code: `content: ''; position: absolute; top: 0; bottom: 0; left: -2px; width: 3px; … (8 declarations)`
- Selectors: .vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab'][data-active]::before
- Matched samples: （无直接源码候选）

### JCSS-0331 — 0 element records / 0 source locations
- CSS blocks 1; sections feed-badges; states base; targets host.
- Declaration code: `width: 16px; height: 16px; -webkit-mask-size: 16px 16px; mask-size: 16px 16px`
- Selectors: span.inline-flex.min-w-0.items-center.gap-1\.5:has(> svg.lucide[aria-hidden='true'])
    > svg.lucide[aria-hidden='true']
- Matched samples: （无直接源码候选）

### JCSS-0334 — 0 element records / 0 source locations
- CSS blocks 1; sections feed-badges; states base, hover; targets host.
- Declaration code: `background-color: var(--wd-title)`
- Selectors: .feed-column-row-new span.h-4.shrink-0.items-center.rounded.border.px-1.font-mono.text-\[10px\] / 
[data-feed-list-summary]:hover
    span.h-4.shrink-0.items-center.rounded.border.px-1.font-mono.text-\[10px\]
- Matched samples: （无直接源码候选）

### JCSS-0335 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `--jk-px-cut: polygon(0 2px,2px 2px,2px 0,calc(100% - 2px) 0,calc(100% - 2px) 2px,100% 2px,100% calc(100% - 2px),calc(100% - 2px) calc(100% - 2px),calc(100% - 2px) 100%,2px 100%,2px calc(100% - 2px),0 calc(100% - 2px))`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0345 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `border: 1px solid #16112a; border-radius: 0; background-color: #201936; gap: 0; clip-path: var(--jk-px-cut)`
- Selectors: [data-slot=toggle-group][data-variant=outline]
- Matched samples: （无直接源码候选）

### JCSS-0346 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `border: 0; border-radius: 0; background-color: #201936; color: #b9add9; box-shadow: inset 1px 1px rgb(0 0 0/.5),inset -1px -1px #8f7fe0`
- Selectors: [data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger])
- Matched samples: （无直接源码候选）

### JCSS-0347 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states hover; targets host.
- Declaration code: `background-color: #4a3784; color: #f2ebff; box-shadow: inset 1px 1px #8f7fe0,inset -1px -1px rgb(0 0 0/.5)`
- Selectors: [data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger]):hover
- Matched samples: （无直接源码候选）

### JCSS-0348 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `background-color: #ffb8e6; color: #16112a; box-shadow: inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d,inset 0 0 0 1px #16112a`
- Selectors: [data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger])[data-pressed]
- Matched samples: （无直接源码候选）

### JCSS-0349 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `width: 2px; background-color: #16112a`
- Selectors: [data-slot=toggle-group][data-variant=outline] > [data-slot=separator]
- Matched samples: （无直接源码候选）

### JCSS-0350 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `position: relative; padding: 3px 3px 12px; gap: 1px; border: 1px solid #6c5ce0; border-radius: 0; background-color: #201936; … (8 declarations)`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list]
- Matched samples: （无直接源码候选）

### JCSS-0351 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; left: 3px; right: 3px; bottom: 2px; height: 8px; … (9 declarations)`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list]::after
- Matched samples: （无直接源码候选）

### JCSS-0352 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `border: 1px solid transparent; border-radius: 0; background-color: transparent; color: #b9add9; box-shadow: none`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab]
- Matched samples: （无直接源码候选）

### JCSS-0353 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `color: inherit; opacity: 1`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab] .lucide
- Matched samples: （无直接源码候选）

### JCSS-0354 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states hover; targets host.
- Declaration code: `background-color: #4a3784; border-color: #6c5ce0; color: #f2ebff`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab]:hover
- Matched samples: （无直接源码候选）

### JCSS-0355 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `background-color: #ffb8e6; border-color: #16112a; color: #16112a; box-shadow: inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab][data-active]
- Matched samples: （无直接源码候选）

### JCSS-0356 — 0 element records / 0 source locations
- CSS blocks 2; sections settings, portal-button-roles-b073-b100; states focus-visible; targets host.
- Declaration code: `outline: 2px solid #ff7fcf; outline-offset: -2px`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab]:focus-visible / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:is(.h-auto.justify-start,[data-ui-role="choice-list"] button):not([data-ui-role="tile"],.rounded-object,.rounded-full):where(:not(.p-0):not(:has(img)))):focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0357 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states focus-visible; targets host.
- Declaration code: `outline-color: #16112a`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab][data-active]:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0358 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background-color: #201936; box-shadow: none; clip-path: var(--jk-px-cut)`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card]
- Matched samples: （无直接源码候选）

### JCSS-0359 — 0 element records / 0 source locations
- CSS blocks 2; sections settings, cards-r97; states base; targets host.
- Declaration code: `background-color: #2f2552; border-bottom: 1px solid #16112a; box-shadow: inset 0 1px #fdf4ff`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] / [data-tools-section] [data-slot=card-header]
- Matched samples: （无直接源码候选）

### JCSS-0360 — 0 element records / 0 source locations
- CSS blocks 2; sections settings, cards-r97; states base; targets host.
- Declaration code: `position: relative; padding-left: 36px; padding-right: 10px; border-radius: 0; color: #f2ebff`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger] / [data-tools-section] [data-slot=card-header] [data-slot=collapsible-trigger]
- Matched samples: （无直接源码候选）

### JCSS-0361 — 0 element records / 0 source locations
- CSS blocks 2; sections settings, cards-r97; states hover; targets host.
- Declaration code: `background-color: #3a2b63`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger]:hover / [data-tools-section] [data-slot=card-header] [data-slot=collapsible-trigger]:hover
- Matched samples: （无直接源码候选）

### JCSS-0362 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; left: 7px; top: calc(50% - 8px); width: 24px; height: 16px; … (9 declarations)`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger]::before
- Matched samples: （无直接源码候选）

### JCSS-0363 — 0 element records / 0 source locations
- CSS blocks 1; sections settings; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 8px; … (9 declarations)`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger]::after
- Matched samples: （无直接源码候选）

### JCSS-0364 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `--pc-up: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' shape-rendering='crispEdges' fill='%2316112a'%3E%3Cpath d='M0 0h14v14H0z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h12v12H1z'/%3E%3Cpath fill='%237a3f6d' d='M2 2h11v11H2z'/%3E%3Cpath fill='%23cdb0e8' d='M2 2h10v10H2z'/%3E%3Cpath d='M6 5h2v1h1v1h1v1H4V7h1V6h1z'/%3E%3C/svg%3E"); --pc-dn: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' shape-rendering='crispEdges' fill='%2316112a'%3E%3Cpath d='M0 0h14v14H0z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h12v12H1z'/%3E%3Cpath fill='%237a3f6d' d='M2 2h11v11H2z'/%3E%3Cpath fill='%23cdb0e8' d='M2 2h10v10H2z'/%3E%3Cpath d='M4 6h6v1H9v1H8v1H6V8H5V7H4z'/%3E%3C/svg%3E"); --pc-lt: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' shape-rendering='crispEdges' fill='%2316112a'%3E%3Cpath d='M0 0h14v14H0z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h12v12H1z'/%3E%3Cpath fill='%237a3f6d' d='M2 2h11v11H2z'/%3E%3Cpath fill='%23cdb0e8' d='M2 2h10v10H2z'/%3E%3Cpath d='M5 6h1V5h1V4h1v6H7V9H6V8H5z'/%3E%3C/svg%3E"); --pc-rt: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' shape-rendering='crispEdges' fill='%2316112a'%3E%3Cpath d='M0 0h14v14H0z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h12v12H1z'/%3E%3Cpath fill='%237a3f6d' d='M2 2h11v11H2z'/%3E%3Cpath fill='%23cdb0e8' d='M2 2h10v10H2z'/%3E%3Cpath d='M6 4h1v1h1v1h1v2H8v1H7v1H6z'/%3E%3C/svg%3E")`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0366 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `width: 44px; height: 20px`
- Selectors: [data-slot=switch][data-size=sm]
- Matched samples: （无直接源码候选）

### JCSS-0368 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::before.
- Declaration code: `right: auto; left: 8px; width: 9px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 5' shape-rendering='crispEdges'%3E%3Cpath fill='%23ff7fcf' d='M1 0h2v1h-2zM5 0h1v1h-1zM8 0h1v1h-1zM0 1h1v1h-1zM3 1h1v1h-1zM5 1h2v1h-2zM8 1h1v1h-1zM0 2h1v1h-1zM3 2h1v1h-1zM5 2h1v1h-1zM7 2h2v1h-2zM0 3h1v1h-1zM3 3h1v1h-1zM5 3h1v1h-1zM8 3h1v1h-1zM1 4h2v1h-2zM5 4h1v1h-1zM8 4h1v1h-1z'/%3E%3C/svg%3E") 0 0/9px 5px no-repeat`
- Selectors: [data-slot=switch][data-checked]::before
- Matched samples: （无直接源码候选）

### JCSS-0369 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::before.
- Declaration code: `top: 6px; right: 5px`
- Selectors: [data-slot=switch][data-size=sm]::before
- Matched samples: （无直接源码候选）

### JCSS-0370 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::before.
- Declaration code: `right: auto; left: 7px`
- Selectors: [data-slot=switch][data-size=sm][data-checked]::before
- Matched samples: （无直接源码候选）

### JCSS-0372 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' shape-rendering='crispEdges'%3E%3Cpath fill='%237a2e5e' d='M0 0h18v1h-18zM0 1h1v1h-1zM17 1h1v1h-1zM0 2h1v1h-1zM17 2h1v1h-1zM0 3h1v1h-1zM17 3h1v1h-1zM0 4h1v1h-1zM4 4h3v1h-3zM10 4h3v1h-3zM17 4h1v1h-1zM0 5h1v1h-1zM3 5h1v1h-1zM7 5h1v1h-1zM9 5h1v1h-1zM13 5h1v1h-1zM17 5h1v1h-1zM0 6h1v1h-1zM2 6h1v1h-1zM14 6h1v1h-1zM17 6h1v1h-1zM0 7h1v1h-1zM2 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM0 8h1v1h-1zM2 8h1v1h-1zM14 8h1v1h-1zM17 8h1v1h-1zM0 9h1v1h-1zM3 9h1v1h-1zM14 9h1v1h-1zM17 9h1v1h-1zM0 10h1v1h-1zM4 10h1v1h-1zM13 10h1v1h-1zM17 10h1v1h-1zM0 11h1v1h-1zM5 11h1v1h-1zM12 11h1v1h-1zM17 11h1v1h-1zM0 12h1v1h-1zM6 12h1v1h-1zM11 12h1v1h-1zM17 12h1v1h-1zM0 13h1v1h-1zM7 13h1v1h-1zM10 13h1v1h-1zM17 13h1v1h-1zM0 14h1v1h-1zM8 14h2v1h-2zM17 14h1v1h-1zM0 15h1v1h-1zM17 15h1v1h-1zM0 16h1v1h-1zM17 16h1v1h-1zM0 17h18v1h-18z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h16v1h-16zM1 2h1v1h-1zM1 3h1v1h-1zM1 4h1v1h-1zM1 5h1v1h-1zM1 6h1v1h-1zM1 7h1v1h-1zM1 8h1v1h-1zM1 9h1v1h-1zM1 10h1v1h-1zM1 11h1v1h-1zM1 12h1v1h-1zM1 13h1v1h-1zM1 14h1v1h-1zM1 15h1v1h-1zM1 16h1v1h-1z'/%3E%3Cpath fill='%23cdb0e8' d='M2 2h14v1h-14zM2 3h14v1h-14zM2 4h2v1h-2zM7 4h3v1h-3zM13 4h3v1h-3zM2 5h1v1h-1zM8 5h1v1h-1zM14 5h2v1h-2zM15 6h1v1h-1zM15 8h1v1h-1zM2 9h1v1h-1zM15 9h1v1h-1zM2 10h2v1h-2zM14 10h2v1h-2zM2 11h3v1h-3zM13 11h3v1h-3zM2 12h4v1h-4zM12 12h4v1h-4zM2 13h5v1h-5zM11 13h5v1h-5zM2 14h6v1h-6zM10 14h6v1h-6zM2 15h14v1h-14z'/%3E%3Cpath fill='%237a3f6d' d='M16 2h1v1h-1zM16 3h1v1h-1zM16 4h1v1h-1zM16 5h1v1h-1zM16 6h1v1h-1zM16 7h1v1h-1zM16 8h1v1h-1zM16 9h1v1h-1zM16 10h1v1h-1zM16 11h1v1h-1zM16 12h1v1h-1zM16 13h1v1h-1zM16 14h1v1h-1zM16 15h1v1h-1zM2 16h15v1h-15z'/%3E%3Cpath fill='%23ffb8e6' d='M4 5h2v1h-2zM3 6h2v1h-2zM3 7h1v1h-1z'/%3E%3Cpath fill='%23ff7fcf' d='M6 5h1v1h-1zM10 5h3v1h-3zM6 6h7v1h-7zM5 7h9v1h-9zM4 8h9v1h-9zM4 9h9v1h-9zM5 10h7v1h-7zM6 11h6v1h-6zM7 12h4v1h-4zM8 13h1v1h-1z'/%3E%3Cpath fill='%23fdf4ff' d='M5 6h1v1h-1zM4 7h1v1h-1zM3 8h1v1h-1z'/%3E%3Cpath fill='%23d4509f' d='M13 6h1v1h-1zM14 7h1v1h-1zM13 8h1v1h-1zM13 9h1v1h-1zM12 10h1v1h-1zM9 13h1v1h-1z'/%3E%3C/svg%3E"); translate: 24px 0`
- Selectors: [data-slot=switch-thumb][data-checked]
- Matched samples: （无直接源码候选）

### JCSS-0373 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `margin-left: 0`
- Selectors: [data-size=sm]>[data-slot=switch-thumb]
- Matched samples: （无直接源码候选）

### JCSS-0374 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `translate: 24px 0`
- Selectors: [data-size=sm]>[data-slot=switch-thumb][data-checked]
- Matched samples: （无直接源码候选）

### JCSS-0375 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `opacity: .45; filter: saturate(.35)`
- Selectors: [data-slot=switch][data-disabled]
- Matched samples: （无直接源码候选）

### JCSS-0378 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `scrollbar-width: auto; scrollbar-color: auto`
- Selectors: *:not(.no-scrollbar,.base-ui-disable-scrollbar)
- Matched samples: （无直接源码候选）

### JCSS-0379 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::-webkit-scrollbar.
- Declaration code: `width: 14px; height: 14px; background: #2a2147`
- Selectors: ::-webkit-scrollbar
- Matched samples: （无直接源码候选）

### JCSS-0380 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::-webkit-scrollbar-track.
- Declaration code: `background: #2a2147; box-shadow: inset 0 0 0 1px #6c5ce0`
- Selectors: ::-webkit-scrollbar-track
- Matched samples: （无直接源码候选）

### JCSS-0381 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::-webkit-scrollbar-thumb.
- Declaration code: `background: #ff7fcf url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 8' shape-rendering='crispEdges'%3E%3Cpath fill='%237a3f6d' d='M0 0h6v1h-6zM0 3h6v1h-6zM0 6h6v1h-6z'/%3E%3Cpath fill='%23fdf4ff' d='M0 1h6v1h-6zM0 4h6v1h-6zM0 7h6v1h-6z'/%3E%3C/svg%3E") 50% 50%/6px 8px no-repeat; border: 1px solid #16112a; border-radius: 0; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`
- Selectors: ::-webkit-scrollbar-thumb
- Matched samples: （无直接源码候选）

### JCSS-0382 — 0 element records / 0 source locations
- CSS blocks 2; sections pixel-controls; states base; targets ::-webkit-scrollbar-thumb, host.
- Declaration code: `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 6' shape-rendering='crispEdges'%3E%3Cpath fill='%237a3f6d' d='M0 0h1v1h-1zM3 0h1v1h-1zM6 0h1v1h-1zM0 1h1v1h-1zM3 1h1v1h-1zM6 1h1v1h-1zM0 2h1v1h-1zM3 2h1v1h-1zM6 2h1v1h-1zM0 3h1v1h-1zM3 3h1v1h-1zM6 3h1v1h-1zM0 4h1v1h-1zM3 4h1v1h-1zM6 4h1v1h-1zM0 5h1v1h-1zM3 5h1v1h-1zM6 5h1v1h-1z'/%3E%3Cpath fill='%23fdf4ff' d='M1 0h1v1h-1zM4 0h1v1h-1zM7 0h1v1h-1zM1 1h1v1h-1zM4 1h1v1h-1zM7 1h1v1h-1zM1 2h1v1h-1zM4 2h1v1h-1zM7 2h1v1h-1zM1 3h1v1h-1zM4 3h1v1h-1zM7 3h1v1h-1zM1 4h1v1h-1zM4 4h1v1h-1zM7 4h1v1h-1zM1 5h1v1h-1zM4 5h1v1h-1zM7 5h1v1h-1z'/%3E%3C/svg%3E"); background-size: 8px 6px`
- Selectors: ::-webkit-scrollbar-thumb:horizontal / [data-orientation=horizontal]>[data-slot=scroll-area-thumb]
- Matched samples: （无直接源码候选）

### JCSS-0384 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::-webkit-scrollbar-corner.
- Declaration code: `background: #201936`
- Selectors: ::-webkit-scrollbar-corner
- Matched samples: （无直接源码候选）

### JCSS-0385 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::-webkit-scrollbar-button.
- Declaration code: `display: block; width: 14px; height: 14px; background: var(--pc-up) 0 0/14px 14px no-repeat`
- Selectors: ::-webkit-scrollbar-button:single-button
- Matched samples: （无直接源码候选）

### JCSS-0386 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::-webkit-scrollbar-button.
- Declaration code: `background-image: var(--pc-dn)`
- Selectors: ::-webkit-scrollbar-button:single-button:vertical:increment
- Matched samples: （无直接源码候选）

### JCSS-0387 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::-webkit-scrollbar-button.
- Declaration code: `background-image: var(--pc-lt)`
- Selectors: ::-webkit-scrollbar-button:single-button:horizontal:decrement
- Matched samples: （无直接源码候选）

### JCSS-0388 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets ::-webkit-scrollbar-button.
- Declaration code: `background-image: var(--pc-rt)`
- Selectors: ::-webkit-scrollbar-button:single-button:horizontal:increment
- Matched samples: （无直接源码候选）

### JCSS-0390 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `width: 14px; padding: 14px 0; background: var(--pc-up) 0 0/14px 14px no-repeat,var(--pc-dn) 0 100%/14px 14px no-repeat,#2a2147`
- Selectors: [data-slot=scroll-area-scrollbar][data-orientation=vertical]
- Matched samples: （无直接源码候选）

### JCSS-0391 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `height: 14px; padding: 0 14px; background: var(--pc-lt) 0 0/14px 14px no-repeat,var(--pc-rt) 100% 0/14px 14px no-repeat,#2a2147`
- Selectors: [data-slot=scroll-area-scrollbar][data-orientation=horizontal]
- Matched samples: （无直接源码候选）

### JCSS-0395 — 0 element records / 0 source locations
- CSS blocks 1; sections pixel-controls; states base; targets host.
- Declaration code: `animation-timing-function: steps(10,end)`
- Selectors: .indeterminate-progress [data-slot=progress-indicator]
- Matched samples: （无直接源码候选）

### JCSS-0398 — 0 element records / 0 source locations
- CSS blocks 1; sections assets-r5; states base; targets host.
- Declaration code: `--r5-pattern-heart-check: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20shape-rendering%3D%22crispEdges%22%3E%3Ctitle%3EHeart-check%20tile%3C%2Ftitle%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20fill%3D%22%23201936%22%2F%3E%3Cpath%20d%3D%22M0%200h16v16H0zm16%2016h16v16H16z%22%20fill%3D%22%232a2147%22%2F%3E%3Cpath%20d%3D%22M0%200h16v16H0zM16%2016h16v16H16z%22%20fill%3D%22%232f2552%22%20opacity%3D%22.52%22%2F%3E%3Cpath%20d%3D%22M16%200v32M0%2016h32%22%20stroke%3D%22%234a3784%22%2F%3E%3Cpath%20d%3D%22M5%206h2V5h2v2h2V5h2v1h2v3h-2v2h-2v2h-2v-2H7V9H5zM21%2022h2v-1h2v2h2v-2h2v1h2v3h-2v2h-2v2h-2v-2h-2v-3h-2z%22%20fill%3D%22%237a3f6d%22%2F%3E%3C%2Fsvg%3E"); --r5-pattern-heart-dots: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20shape-rendering%3D%22crispEdges%22%3E%3Ctitle%3EPolka-dot%20hearts%20and%20tiny%20bows%20tile%3C%2Ftitle%3E%3Crect%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22%23201936%22%2F%3E%3Cpath%20d%3D%22M3%203h2v2H3zm8%200h2v2h-2zm8%200h2v2h-2zM3%2011h2v2H3zm8%200h2v2h-2zm8%200h2v2h-2zM3%2019h2v2H3zm8%200h2v2h-2zm8%200h2v2h-2z%22%20fill%3D%22%234a3784%22%2F%3E%3Cpath%20d%3D%22M6%207h2V6h2v2h2V6h2v1h2v2h-2v2h-2v2h-2v-2H8V9H6zM17%2016h1v-1h2v1h2v2h-1v2h-2v1h-1v-1h-1v-2h-1v-1h1z%22%20fill%3D%22%237a3f6d%22%2F%3E%3Cpath%20d%3D%22M2%2016h2v2H2zm2%201h2v2H4zm2-1h2v2H6zm-2%201h2v2H4z%22%20fill%3D%22%236c5ce0%22%2F%3E%3Cpath%20d%3D%22M7%208h2V7h1v2H8v1H7zM18%2017h1v-1h1v2h-1v1h-1z%22%20fill%3D%22%23cdb0e8%22%2F%3E%3C%2Fsvg%3E"); --r5-pattern-star-dust: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20shape-rendering%3D%22crispEdges%22%3E%3Ctitle%3EStar%20dust%20tile%3C%2Ftitle%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20fill%3D%22%23201936%22%2F%3E%3Cpath%20d%3D%22M6%205h2v2H6zM25%207h2v2h-2zM17%2025h2v2h-2zM4%2023h2v2H4z%22%20fill%3D%22%234a3784%22%2F%3E%3Cpath%20d%3D%22M14%207h2v4h3v2h-3v4h-2v-4h-3v-2h3zM25%2019h1v2h2v1h-2v2h-1v-2h-2v-1h2z%22%20fill%3D%22%236c5ce0%22%2F%3E%3Cpath%20d%3D%22M15%208h1v2h-1zm11%2012h1v1h-1z%22%20fill%3D%22%23cdb0e8%22%2F%3E%3C%2Fsvg%3E"); --r5-lace-band: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20shape-rendering%3D%22crispEdges%22%3E%3Ctitle%3EDiagonal%20scalloped%20heart%20lace%20band%20tile%3C%2Ftitle%3E%3Crect%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22%23201936%22%2F%3E%3Cpath%20d%3D%22M-36%2024L-12%200h12L-24%2024z%22%20fill%3D%22%23ff7fcf%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M-33%2024L-9%200h6L-27%2024z%22%20fill%3D%22%232a2147%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M-12%2024L12%200h12L0%2024z%22%20fill%3D%22%23ff7fcf%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M-9%2024L15%200h6L-3%2024z%22%20fill%3D%22%232a2147%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M12%2024L36%200h12L24%2024z%22%20fill%3D%22%23ff7fcf%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M15%2024L39%200h6L21%2024z%22%20fill%3D%22%232a2147%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M36%2024L60%200h12L48%2024z%22%20fill%3D%22%23ff7fcf%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M39%2024L63%200h6L45%2024z%22%20fill%3D%22%232a2147%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M-4%2020h2v-1h2v1h1v2h-1v1h-2v-1h-2z%22%20fill%3D%22%234a3784%22%20stroke%3D%22%23ffb8e6%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M2%2014h2v-1h2v1h1v2h-1v1h-2v-1h-2z%22%20fill%3D%22%234a3784%22%20stroke%3D%22%23ffb8e6%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M8%208h2v-1h2v1h1v2h-1v1h-2v-1h-2z%22%20fill%3D%22%234a3784%22%20stroke%3D%22%23ffb8e6%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M14%202h2v-1h2v1h1v2h-1v1h-2v-1h-2z%22%20fill%3D%22%234a3784%22%20stroke%3D%22%23ffb8e6%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M20%20-4h2v-1h2v1h1v2h-1v1h-2v-1h-2z%22%20fill%3D%22%234a3784%22%20stroke%3D%22%23ffb8e6%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M1%2022h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2V8h2V6h2V4h2%22%20fill%3D%22none%22%20stroke%3D%22%23f2ebff%22%20stroke-width%3D%221%22%20stroke-dasharray%3D%221%202%22%2F%3E%3Cpath%20d%3D%22M7%2017h2v-1h2v1h2v2h-2v2h-2v-1H7v-1H6v-1h1zm8-8h2V8h2v1h2v2h-2v2h-2v-1h-2v-1h-1V9h1zm6-7h2V1h2v1h2v2h-2v2h-2V5h-2V4h-1V3h1z%22%20fill%3D%22%23201936%22%20stroke%3D%22%23ffb8e6%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E"); --r5-scallop-edge: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2210%22%20viewBox%3D%220%200%2032%2010%22%20shape-rendering%3D%22crispEdges%22%3E%3Ctitle%3EPixel%20scallop%20edge%20trim%3C%2Ftitle%3E%3Cpath%20d%3D%22M0%200h8v2H7v2H6v2H4v1H2V6H1V4H0zm8%200h8v2h-1v2h-1v2h-2v1h-2v-1h-1V4H8zm8%200h8v2h-1v2h-1v2h-2v1h-2V6h-1V4h-1zm8%200h8v2h-1v2h-1v2h-2v1h-2V6h-1V4h-1z%22%20fill%3D%22%232a2147%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M1%201h5v1H5v2H3V3H2zM9%201h5v1h-1v2h-2V3h-1zM17%201h5v1h-1v2h-2V3h-1zM25%201h5v1h-1v2h-2V3h-1z%22%20fill%3D%22%23cdb0e8%22%2F%3E%3Cpath%20d%3D%22M2%206h2v1H2zm8%200h2v1h-2zm8%200h2v1h-2zm8%200h2v1h-2z%22%20fill%3D%22%23d97fc6%22%2F%3E%3C%2Fsvg%3E"); --r5-lacing: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2232%22%20viewBox%3D%220%200%2016%2032%22%20shape-rendering%3D%22crispEdges%22%3E%3Ctitle%3EPixel%20crossed%20ribbon%20lacing%3C%2Ftitle%3E%3Cpath%20d%3D%22M3%201L13%207%203%2013%2013%2019%203%2025%22%20fill%3D%22none%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%225%22%2F%3E%3Cpath%20d%3D%22M13%201L3%207%2013%2013%203%2019%2013%2025%22%20fill%3D%22none%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%225%22%2F%3E%3Cpath%20d%3D%22M3%201L13%207%203%2013%2013%2019%203%2025%22%20fill%3D%22none%22%20stroke%3D%22%23d97fc6%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20d%3D%22M13%201L3%207%2013%2013%203%2019%2013%2025%22%20fill%3D%22none%22%20stroke%3D%22%23ffb8e6%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20d%3D%22M3%202L13%208M3%2014L13%2020%22%20fill%3D%22none%22%20stroke%3D%22%23fdf4ff%22%20stroke-width%3D%221%22%2F%3E%3Cpath%20d%3D%22M6%2025h4v2h-2v2H6v-2H4v-2h2z%22%20fill%3D%22%23ff7fcf%22%20stroke%3D%22%2316112a%22%20stroke-width%3D%221%22%2F%3E%3C%2Fsvg%3E"); … (22 declarations)`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0399 — 0 element records / 0 source locations
- CSS blocks 1; sections assets-r5; states base; targets host.
- Declaration code: `background-image: var(--r5-pattern-heart-check); background-repeat: repeat`
- Selectors: .r5-pattern-heart-check
- Matched samples: （无直接源码候选）

### JCSS-0400 — 0 element records / 0 source locations
- CSS blocks 1; sections assets-r5; states base; targets host.
- Declaration code: `background-image: var(--r5-pattern-heart-dots); background-repeat: repeat`
- Selectors: .r5-pattern-heart-dots
- Matched samples: （无直接源码候选）

### JCSS-0401 — 0 element records / 0 source locations
- CSS blocks 1; sections assets-r5; states base; targets host.
- Declaration code: `background-image: var(--r5-lace-band); background-repeat: repeat`
- Selectors: .r5-lace-band
- Matched samples: （无直接源码候选）

### JCSS-0402 — 0 element records / 0 source locations
- CSS blocks 1; sections assets-r5; states base; targets host.
- Declaration code: `background-image: var(--r5-scallop-edge); background-repeat: repeat-x`
- Selectors: .r5-scallop-edge
- Matched samples: （无直接源码候选）

### JCSS-0403 — 0 element records / 0 source locations
- CSS blocks 1; sections assets-r5; states base; targets host.
- Declaration code: `background-image: var(--r5-pattern-star-dust); background-repeat: repeat`
- Selectors: .r5-pattern-star-dust
- Matched samples: （无直接源码候选）

### JCSS-0404 — 0 element records / 0 source locations
- CSS blocks 3; sections motion, nav-phone-r10; states base; targets host.
- Declaration code: `transform: translateY(0)`
- Selectors: 0% / 70% / 100% / 86% /  100%
- Matched samples: （无直接源码候选）

### JCSS-0405 — 0 element records / 0 source locations
- CSS blocks 1; sections motion; states base; targets host.
- Declaration code: `transform: translateY(-2px)`
- Selectors: 78%
- Matched samples: （无直接源码候选）

### JCSS-0406 — 0 element records / 0 source locations
- CSS blocks 1; sections motion; states base; targets host.
- Declaration code: `opacity: 0`
- Selectors: from
- Matched samples: （无直接源码候选）

### JCSS-0407 — 0 element records / 0 source locations
- CSS blocks 2; sections motion, motion-r8; states base; targets host.
- Declaration code: `opacity: 1`
- Selectors: to / 14% /  42% /  78%
- Matched samples: （无直接源码候选）

### JCSS-0408 — 0 element records / 0 source locations
- CSS blocks 1; sections motion; states base; targets host.
- Declaration code: `transform: rotate(360deg)`
- Selectors: to
- Matched samples: （无直接源码候选）

### JCSS-0409 — 0 element records / 0 source locations
- CSS blocks 1; sections motion; states base; targets host.
- Declaration code: `background-position: 10px 50%`
- Selectors: to
- Matched samples: （无直接源码候选）

### JCSS-0412 — 0 element records / 0 source locations
- CSS blocks 1; sections motion; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; z-index: 1; opacity: 0; pointer-events: none`
- Selectors: [data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after
- Matched samples: （无直接源码候选）

### JCSS-0415 — 0 element records / 0 source locations
- CSS blocks 1; sections motion; states base; targets host.
- Declaration code: `animation: r5-dialog-step-in 120ms steps(4,end) both`
- Selectors: [data-slot="dialog-content"][data-open]
- Matched samples: （无直接源码候选）

### JCSS-0418 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets ::before.
- Declaration code: `content: "导航"; min-height: 32px; padding: 6px 12px; color: #ffe4f5; font: 16px/20px "WD Pixel CJK",sans-serif; background: #30213f; … (9 declarations)`
- Selectors: [data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]::before
- Matched samples: （无直接源码候选）

### JCSS-0419 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `color: #f2ebff; padding: 8px 6px 4px; gap: 0`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="content"]
- Matched samples: （无直接源码候选）

### JCSS-0421 — 0 element records / 0 source locations
- CSS blocks 2; sections navigation-r7, buttons-badges-r10; states base; targets host.
- Declaration code: `gap: 2px`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu"] / :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="pagination-content"]
- Matched samples: （无直接源码候选）

### JCSS-0422 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `background: #211a33; border: 1px solid; border-color: var(--jk-field-edge); padding: 4px; box-shadow: var(--jk-field-inset)`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="content"] > [data-sidebar="group"] > [data-sidebar="group-content"] > [data-sidebar="menu"]
- Matched samples: （无直接源码候选）

### JCSS-0423 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `box-sizing: border-box; min-width: 0; height: 36px; padding: 7px 8px; gap: 10px; border: 1px solid transparent; … (16 declarations)`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-button"]
- Matched samples: （无直接源码候选）

### JCSS-0424 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `width: 18px; height: 18px; color: #ceb8e8; opacity: 1; flex-shrink: 0`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-button"] svg
- Matched samples: （无直接源码候选）

### JCSS-0425 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `width: 18px; height: 18px; flex-shrink: 0`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-button"] > span:has(> svg)
- Matched samples: （无直接源码候选）

### JCSS-0426 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states hover; targets host.
- Declaration code: `color: #fff3fc; background: #392949; border-color: #735486; box-shadow: inset 1px 1px #493458`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-button"]:hover
- Matched samples: （无直接源码候选）

### JCSS-0427 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `color: #21132d; background: #f3add9; border-color: #ffe2f3 #986b9e #986b9e #ffe2f3; box-shadow: inset 3px 0 #6a366d,1px 1px #100b1e; font-weight: 400`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-button"][data-active]
- Matched samples: （无直接源码候选）

### JCSS-0428 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `color: #42214f`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-button"][data-active] svg
- Matched samples: （无直接源码候选）

### JCSS-0429 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states focus-visible; targets host.
- Declaration code: `outline: 2px dashed #ffb8e6; outline-offset: -3px`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-button"]:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0430 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states active; targets host.
- Declaration code: `box-shadow: inset 1px 1px #100b1e`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-button"]:active
- Matched samples: （无直接源码候选）

### JCSS-0431 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states disabled, base; targets host.
- Declaration code: `opacity: .45; pointer-events: none`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-button"]:disabled / 
.vrcx-0-sidebar-surface [data-sidebar="menu-button"][aria-disabled="true"]
- Matched samples: （无直接源码候选）

### JCSS-0432 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `border-left-color: #8e6eab; margin-left: 18px`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-sub"]
- Matched samples: （无直接源码候选）

### JCSS-0433 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `color: #dfd0ef; font: 14px/20px "WD Pixel CJK",sans-serif; border-radius: 0`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-sub-button"]
- Matched samples: （无直接源码候选）

### JCSS-0434 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `color: #f2ebff; background: #241a35; border-top: 1px solid #74558c; padding: 8px 6px; gap: 6px; box-shadow: inset 0 1px #3f2c50`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="footer"]
- Matched samples: （无直接源码候选）

### JCSS-0435 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `position: relative; isolation: isolate`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="footer"]
- Matched samples: （无直接源码候选）

### JCSS-0437 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets ::before.
- Declaration code: `content: none; display: none`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="footer"]::before
- Matched samples: （无直接源码候选）

### JCSS-0438 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `padding: 4px`
- Selectors: [data-slot="sidebar"][data-state="collapsed"] .vrcx-0-sidebar-surface [data-sidebar="content"]
- Matched samples: （无直接源码候选）

### JCSS-0439 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `border: 0; padding: 0; background: transparent; box-shadow: none`
- Selectors: [data-slot="sidebar"][data-state="collapsed"] .vrcx-0-sidebar-surface [data-sidebar="menu"]
- Matched samples: （无直接源码候选）

### JCSS-0440 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `padding: 8px 4px`
- Selectors: [data-slot="sidebar"][data-state="collapsed"] .vrcx-0-sidebar-surface [data-sidebar="footer"]
- Matched samples: （无直接源码候选）

### JCSS-0441 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `gap: 0; justify-content: center`
- Selectors: [data-slot="sidebar"][data-state="collapsed"] .vrcx-0-sidebar-surface [data-sidebar="menu-button"]
- Matched samples: （无直接源码候选）

### JCSS-0442 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `width: 16px; height: 16px`
- Selectors: [data-slot="sidebar"][data-state="collapsed"] .vrcx-0-sidebar-surface [data-sidebar="menu-button"] svg
- Matched samples: （无直接源码候选）

### JCSS-0443 — 0 element records / 0 source locations
- CSS blocks 1; sections navigation-r7; states base; targets host.
- Declaration code: `height: 34px; padding-top: 6px; padding-bottom: 6px`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="menu-button"]
- Matched samples: （无直接源码候选）

### JCSS-0445 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r7; states base; targets host.
- Declaration code: `opacity: 0; background-position: -24px 0`
- Selectors: 0% / 60%
- Matched samples: （无直接源码候选）

### JCSS-0446 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r7; states base; targets host.
- Declaration code: `opacity: .65; background-position: 0 0`
- Selectors: 68%
- Matched samples: （无直接源码候选）

### JCSS-0447 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r7; states base; targets host.
- Declaration code: `opacity: .65; background-position: 24px 0`
- Selectors: 80%
- Matched samples: （无直接源码候选）

### JCSS-0448 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r7; states base; targets host.
- Declaration code: `opacity: .45; background-position: 48px 0`
- Selectors: 90%
- Matched samples: （无直接源码候选）

### JCSS-0449 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r7; states base; targets host.
- Declaration code: `opacity: 0; background-position: 72px 0`
- Selectors: 100%
- Matched samples: （无直接源码候选）

### JCSS-0450 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r7; states base; targets ::after.
- Declaration code: `top: auto; bottom: 0; left: 0; width: 100%; height: 2px; transform: none; … (10 declarations)`
- Selectors: [data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after
- Matched samples: （无直接源码候选）

### JCSS-0451 — 0 element records / 0 source locations
- CSS blocks 1; sections assets-r7; states base; targets host.
- Declaration code: `--r7-game-icon: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAFeUlEQVR42u3dIXLcMBQG4BwrR+gJQkt6gdLiniE0ICQkICSgNCQnCAgJKCkwKSgJ2OnshFqaPM1bSfZ+O/PDWLb1PgNH8ru46PB7+fJwWcpyvaSkNkb0fJfnm8vVLG8yUXrU1QUggAACCCCAAAIIIIAAIoAAIoAAIucF5NQnW4PQcr5DIZTGzszOIWTWFSCAAAIIIIAAAggggAACCCCAALJHICAkQNj72BuDAAgggAACCCCAAAIIIIAAAggggADSB8g5vO4s5eohLyPHBgQQQAABBBBAAAEEEEAAAQQQQADZDxDbYT9fpPeH93CiRZ05xkggmf9WAAQQQAABBBBAAAEEEEAAAQQQQAABBBBAPgLCECCHw2E1y+uymq0BKY5RuLeAAAIIIIAAAggggAACBCCAAALIloF0gQPIyYBkrsBtwQkIIIAAAggggAACCCCAAAIIIIAAMhZIS5fb2x+/V5NZQK9Py2rOdU96j3s16550QAABBBBAAAEEEEAAAQQQQAABBJC2XxaQ0sTuCUKPjLyHgAACCCCAAAIIIIAAAggggAAigAAigEwLpITgmFphRyaqB5C9IKzNRzSZ4wMCCCCAAAIIIIAAAggggAACCCCA7AdIZvYCJHpOtfl4ultCaUEVHWPGtuOAAAIIIIAAAggggAACCCCAAALIloGMRDAa4YxAWu5VtHij/USOAQQQQAABBBBAAAEEEEAAAQQQQAABZLZXyTOmBUjmAsfo2F26KhcCCCCAAAIFIIAAAggggAACCCCAAAIIIICkF2hpjL+PL8VkndesCKPn1FK8meebhbDWmAkQQAABBBBAAAEEEEAAAQQQQAABBJCtA+l1rCiQ66/XqxnZawQQQAABBBBAAAEEEEAAAQQQQAABJLcYSje3JaNfg44s6tqr00hagGSNXev3EYUDCCCAAAIIIIAAAggggAACCCCAANIPyLfvd6v5efuymkw4mcl8CJSS9Xq0qagTx8h6LQwIIIAAAggggAACCCCAAAIIIIAAAggggHQDUmrkckwWkNqK4azUijfr+mrJKt7afBSb6wwEsjzfrAYQQAABBBBAAAEEEEAAAQQQQAABZDyQX6+H1RQL9M+/06dyHTMCyVyBmzk2IIAAAggggAACCCCAAAIIIIAAAgggWwFSur5aMveeZ31ZMXNPegkCIIAAAggggAACCCCAAAIIIIAAAsj4/iDRbael44wGEt1S3AKkNEaP/iDR+16bwygEQAABBBBAAAEEEEAAAQQQQAABBBBAAAFkaiBDCz4xWQ+AluZBgAACCCCAAAIIIIAAAggggAACCCD7ARKF03Lji6t5N1bsI0HVMuND7tQIjimNAQgggAACCCCACCCAAAIIIIAAAkjuja/21YDl05mxU3EPCFcPb6sBRAABROEDAggggAACCCCAAAIIIB8pLVzLWgBX+2JfZmGVvvCXdZyWY20NSA8IpVfJgAACCCCAAAIIIIAAAggggAACCCCAAAJIOpAonNrfRN+7Z4KKNn7Zy/9BWuYjWuy1lGqxBOH+8L4aQAABBBBAAAEEEEAAAQQQQAAB5JyAtOCJwmmZkOh+7cwvGI5E0OPrmJkPrMx6AwQQQAABBBBAAAEEEEAAAQQQQAA5byAtPSyyMrLHS+Z8jIQACCCAAAIIIIAAAggggAACCCCAAAJIZOtny/gjF48CAggggAACCCCAAAIIIIAAAggggAACCCBnD2RGOD1W57bA2RKQ2hinRtACARBAAAEEEEAAAQQQQAABBBBAAAFkXiDRfiKZ15e5+hcQQAABBBBAAAEEEEAAAQQQQAABBJBzhNMDSOnXY+95JpAtLTwEBBBAAAEEEEAAAQQQQAABBBBANgzkP59EDHPVbmOZAAAAAElFTkSuQmCC"); --r7-ame-tweeter: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAEcElEQVR42u3drZEcMRAG0EvIxOjSWOwojpoccRRHDIxNDRyBIzBdcGSBiYHplDMYga6vWiO9rfrgzo9aT6RLmqfPn16fK3n78i2a728/oxm9X/r+q2c0vk+z/wABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAWRoIALI1IEBMUkAAAQQQQAABBBBAAAEEEEAAAUQAAUSWBvK4vZwGgOzzVwMQIIAAAggggAACCCCAAAIIIIAAAggggAACCCA7AxlN8Cqg3YHMvoCsvsAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAJIJd2AugvcDWD3BQgQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEECSQKqAZi+Qg+c2BwQIIIAAAggggAACCCCAAAIIIIAAAggggAACyNJA0g+YBgbI3oAAAQQQQAABBBBAAAEEEEAAAUQAAQQQQAABZG8gsw/Q6kDSC9TuHzgCBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQNYFMjvQ9PgCAggggAACCCCAAAIIIIAAAggggAACCCCAAALIlYHMvuGre4L8+fX1NIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAALIvAfHVSdo9/P//fH7NKP/jwCkAaUXiHT9AAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQABZG0h3o627UVctYBXA8fh3mjSg9Ph1L4CAAAIIIIAAAggggAACCCCAAAIIIIAAAggggABy5Ubb7ECqSQO6ffhYymj80tcHBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQSQJJD0BO9uJM2eEaDRBHzcXkrpvj4ggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIDMDCR9sNrVN/Tc3++n6QaSDiCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggACyLpDjOM4DCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggMSApDdEzQ4k/YGhEYBqugEtf3AcIIAAAggggAACCCCAAAIIIIAAAggggAACCCBbA0k3Gmc/WG60AKSBpAFNDwAQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAagcwOdDTBZweQBtRdf0AAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAFm5kRc/2C08Aasbkqr3796wBggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIDMDGd0/ffBcd6Nw9kZfekPY9AAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAGk8QXSBUwf/FZttKVz9foAAggggAACCCCAAAIIIIAAAggggAACCCCAAAJIBUj3AN/f76fpLtDlG2GTA2l/QUAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAACkM4HEc0aQLOLr/CHj1+a8OABBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQFYGUp1A3YDSQLoBLQ8AEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBJCVgfwHHmhILcY7HPAAAAAASUVORK5CYII=")`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0455 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `--r8-ink: #21132d; --r8-frame: #d97fc6; --r8-face: #f8c6e3; --r8-face-hi: #fff1f8; --r8-face-low: #b86ba4; --r8-hover: #ffe3f2; … (12 declarations)`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0457 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `box-sizing: border-box; border-radius: 0; transition: none`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] :is(button, [data-slot='menubar-trigger'])
- Matched samples: （无直接源码候选）

### JCSS-0458 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `background-color: var(--r8-face); background-image: none; border: 1px solid var(--r8-ink); color: var(--r8-ink); box-shadow: inset 1px 1px 0 var(--r8-face-hi),
        inset -1px -1px 0 var(--r8-face-low)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] [data-slot='menubar'] [data-slot='menubar-trigger'] / 
.vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0'] / 
.vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0'][class*='destructive']
- Matched samples: （无直接源码候选）

### JCSS-0459 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `background-color: var(--r8-face); border-color: var(--r8-ink); border-radius: 0; color: var(--r8-ink); box-shadow: inset 1px 1px 0 var(--r8-face-hi),
        inset -1px -1px 0 var(--r8-face-low)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] button.vrcx-0-toolbar-control[data-vrcx-0-control='toolbar']
- Matched samples: （无直接源码候选）

### JCSS-0460 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `border-radius: 0; transition: none`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] button:not([class~='w-9'][class~='rounded-none'][class~='border-0'])
- Matched samples: （无直接源码候选）

### JCSS-0461 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states hover; targets host.
- Declaration code: `background-color: var(--r8-hover) !important; border-color: var(--r8-ink); color: var(--r8-ink) !important; box-shadow: inset 1px 1px 0 var(--r8-face-hi),
        inset -1px -1px 0 var(--r8-face-low)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] :is(button, [data-slot='menubar-trigger']):is(
    :hover,
    [aria-expanded='true'],
    [aria-pressed='true'],
    [data-popup-open]
)
- Matched samples: （无直接源码候选）

### JCSS-0462 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states active; targets host.
- Declaration code: `background-color: var(--r8-pressed) !important; box-shadow: inset 1px 1px 0 var(--r8-face-low),
        inset -1px -1px 0 var(--r8-face-hi)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] :is(button, [data-slot='menubar-trigger']):active
- Matched samples: （无直接源码候选）

### JCSS-0463 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states focus-visible; targets host.
- Declaration code: `outline: 2px solid var(--r8-ink); outline-offset: -3px`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] :is(button, [data-slot='menubar-trigger']):focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0464 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states hover+active; targets host.
- Declaration code: `background-color: var(--r8-close-face) !important; border-color: var(--r8-ink); color: var(--r8-close-ink) !important; box-shadow: inset 1px 1px 0 rgb(255 241 248 / 0.55),
        inset -1px -1px 0 rgb(72 12 39 / 0.5)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] button[class*='destructive']:is(:hover, :active)
- Matched samples: （无直接源码候选）

### JCSS-0465 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `background-color: #211a33; border: 1px solid #4b3a63; border-radius: 0; padding-block: 7px; box-shadow: inset 1px 1px 0 #120d20,
        inset -1px -1px 0 #4b3a63,
        inset 0 2px 0 #3f2c50`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar='footer']
- Matched samples: （无直接源码候选）

### JCSS-0466 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `box-sizing: border-box; padding-inline-end: 32px`
- Selectors: [data-slot='sidebar'][data-state='expanded'] .vrcx-0-sidebar-surface [data-sidebar='footer']
- Matched samples: （无直接源码候选）

### JCSS-0471 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `border-color: var(--r8-ink)`
- Selectors: .vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] span[class~='size-2'][class~='rounded-full']
- Matched samples: （无直接源码候选）

### JCSS-0473 — 0 element records / 0 source locations
- CSS blocks 1; sections chrome-r8; states base; targets host.
- Declaration code: `transition: none !important`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] :is(button, [data-slot='menubar-trigger']) / 
    .vrcx-0-sidebar-surface [data-sidebar='footer']
- Matched samples: （无直接源码候选）

### JCSS-0474 — 0 element records / 0 source locations
- CSS blocks 1; sections bio-diff-r8; states base; targets host.
- Declaration code: `border-left-color: #d97fc6`
- Selectors: .vrcx-0-main-content div.ml-3.border-l-2.py-3.pl-4:has(> pre.max-w-prose.whitespace-pre-wrap)
- Matched samples: （无直接源码候选）

### JCSS-0475 — 0 element records / 0 source locations
- CSS blocks 1; sections bio-diff-r8; states base; targets host.
- Declaration code: `background-color: #4b3a63; color: #ffd9ee; border-bottom: 0; text-decoration: none`
- Selectors: .vrcx-0-main-content pre.max-w-prose.whitespace-pre-wrap span.text-primary[class~="bg-primary/10"] / 
.vrcx-0-main-content div.flex.max-w-2xl.items-center.gap-2 span.text-primary[class~="bg-primary/10"]
- Matched samples: （无直接源码候选）

### JCSS-0476 — 0 element records / 0 source locations
- CSS blocks 1; sections bio-diff-r8; states base; targets host.
- Declaration code: `background-color: #ffd9ee; color: #21132d; text-decoration-line: line-through; text-decoration-color: #21132d; text-decoration-thickness: 1px`
- Selectors: .vrcx-0-main-content pre.max-w-prose.whitespace-pre-wrap span.text-destructive[class~="bg-destructive/10"] / 
.vrcx-0-main-content div.flex.max-w-2xl.items-center.gap-2 span.text-destructive[class~="bg-destructive/10"]
- Matched samples: （无直接源码候选）

### JCSS-0477 — 0 element records / 0 source locations
- CSS blocks 1; sections bio-diff-r8; states base; targets host.
- Declaration code: `background-color: #4b3a63; color: #ffd9ee; border-bottom: 0; border-radius: 0; text-decoration: none`
- Selectors: [data-slot="dialog-content"].entity-dialog .overflow-auto.h-52.min-w-0 pre.m-0.font-sans.text-xs.leading-5.whitespace-pre-wrap > span.rounded-sm[class~="bg-emerald-500/15"]
- Matched samples: （无直接源码候选）

### JCSS-0478 — 0 element records / 0 source locations
- CSS blocks 1; sections bio-diff-r8; states base; targets host.
- Declaration code: `background-color: #ffd9ee; color: #21132d; border-radius: 0; text-decoration-line: line-through; text-decoration-color: #21132d; text-decoration-thickness: 1px`
- Selectors: [data-slot="dialog-content"].entity-dialog .overflow-auto.h-52.min-w-0 pre.m-0.font-sans.text-xs.leading-5.whitespace-pre-wrap > span.rounded-sm[class~="bg-rose-500/15"]
- Matched samples: （无直接源码候选）

### JCSS-0479 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states base; targets host.
- Declaration code: `background-position: 0 center`
- Selectors: from
- Matched samples: （无直接源码候选）

### JCSS-0480 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states base; targets host.
- Declaration code: `background-position: 20px center`
- Selectors: to
- Matched samples: （无直接源码候选）

### JCSS-0481 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states base; targets host.
- Declaration code: `opacity: .62`
- Selectors: 0% /  28% /  58% /  100%
- Matched samples: （无直接源码候选）

### JCSS-0482 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states base; targets host.
- Declaration code: `transform: translateY(0); opacity: .62`
- Selectors: 0% /  30% /  100%
- Matched samples: （无直接源码候选）

### JCSS-0483 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states base; targets host.
- Declaration code: `transform: translateY(1px); opacity: .96`
- Selectors: 50% /  70%
- Matched samples: （无直接源码候选）

### JCSS-0484 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states base; targets host.
- Declaration code: `transform: translateY(0); opacity: .78`
- Selectors: 0% /  34% /  72% /  100%
- Matched samples: （无直接源码候选）

### JCSS-0485 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states base; targets host.
- Declaration code: `transform: translateY(-1px); opacity: 1`
- Selectors: 42% /  52%
- Matched samples: （无直接源码候选）

### JCSS-0487 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states base; targets ::before.
- Declaration code: `content: ''; position: absolute; z-index: 2; left: 4px; top: 50%; margin-top: -7px; … (11 declarations)`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar='menu-button'][data-active]::before
- Matched samples: （无直接源码候选）

### JCSS-0488 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states base; targets ::after.
- Declaration code: `content: ''; position: absolute; right: 4px; bottom: 4px; width: 3px; height: 3px; … (9 declarations)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0']::after
- Matched samples: （无直接源码候选）

### JCSS-0489 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states hover; targets ::after.
- Declaration code: `animation: r8-window-press 2.8s steps(2, end) infinite`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0']:hover::after
- Matched samples: （无直接源码候选）

### JCSS-0490 — 0 element records / 0 source locations
- CSS blocks 1; sections motion-r8; states base; targets ::after.
- Declaration code: `animation: r8-cat-hop 3.6s steps(4, end) infinite`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar='content']::after
- Matched samples: （无直接源码候选）

### JCSS-0491 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-r8-final; states base; targets ::after.
- Declaration code: `content: ""; display: block; flex: none; width: 36px; height: 36px; margin-top: auto; … (15 declarations)`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="content"]::after
- Matched samples: （无直接源码候选）

### JCSS-0492 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-r8-final; states base; targets ::after.
- Declaration code: `margin-bottom: 0`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="content"]::after
- Matched samples: （无直接源码候选）

### JCSS-0493 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-r8-final; states base; targets ::after.
- Declaration code: `animation: none !important; opacity: .95`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="content"]::after
- Matched samples: （无直接源码候选）

### JCSS-0494 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r8; states base; targets host.
- Declaration code: `border-radius: 0; clip-path: var(--wd-avatar-cut); border-color: transparent; border-width: 0; box-shadow: none; outline: none`
- Selectors: [data-slot="dialog-content"] span:has(> span[class~="size-3.75"]) > span.overflow-hidden
- Matched samples: （无直接源码候选）

### JCSS-0495 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r8; states base; targets host.
- Declaration code: `border: 1px solid #21132d`
- Selectors: [data-slot="dialog-content"].entity-dialog [data-slot="card-title"] > span.flex.size-4.shrink-0.items-center.justify-center > span.rounded-full.inline-block[class~="size-2.5"]:not(.border-2)
- Matched samples: （无直接源码候选）

### JCSS-0496 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r8; states base; targets host.
- Declaration code: `-webkit-appearance: none; appearance: none; height: 16px; background: transparent; cursor: pointer`
- Selectors: [data-slot="dialog-content"].entity-dialog input[type="range"]
- Matched samples: （无直接源码候选）

### JCSS-0497 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r8; states base; targets ::-webkit-slider-runnable-track.
- Declaration code: `height: 8px; background: #100b1e; border: 1px solid #4b3a63; box-shadow: inset 0 1px 3px rgb(0 0 0 / 55%)`
- Selectors: [data-slot="dialog-content"].entity-dialog input[type="range"]::-webkit-slider-runnable-track
- Matched samples: （无直接源码候选）

### JCSS-0498 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r8; states base; targets ::-webkit-slider-thumb.
- Declaration code: `-webkit-appearance: none; width: 16px; height: 16px; margin-top: -5px; border: 1px solid #21132d; border-radius: 0; … (8 declarations)`
- Selectors: [data-slot="dialog-content"].entity-dialog input[type="range"]::-webkit-slider-thumb
- Matched samples: （无直接源码候选）

### JCSS-0499 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r8; states focus-visible; targets host.
- Declaration code: `outline: 2px dashed #d6b8ef; outline-offset: 3px`
- Selectors: [data-slot="dialog-content"].entity-dialog input[type="range"]:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0500 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r8; states base; targets host.
- Declaration code: `border-radius: 0; border-color: #8c71b0; background-color: #211a33; color: #ffd9ee; box-shadow: 2px 2px 0 #100b1e`
- Selectors: [data-slot="dialog-content"].entity-dialog div:has(> input[type="range"]) > span:has(~ input[type="range"])
- Matched samples: （无直接源码候选）

### JCSS-0501 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r8; states base; targets ::before.
- Declaration code: `inset: 8px 0 10px; background-color: #d6b8ef`
- Selectors: .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::before
- Matched samples: （无直接源码候选）

### JCSS-0502 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r8; states base; targets ::after.
- Declaration code: `background-color: #8c71b0`
- Selectors: .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::after
- Matched samples: （无直接源码候选）

### JCSS-0508 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets ::before.
- Declaration code: `content: ""; display: inline-block; width: 18px; height: 18px; margin-inline-end: 6px; vertical-align: -4px; … (10 declarations)`
- Selectors: [data-vrcx-0-surface="login-page"] > div.flex.flex-1.items-center.justify-center > div.flex.w-full.max-w-lg.flex-col.gap-4 > div.flex.flex-wrap.items-center.justify-between.gap-3 > div.min-w-0.truncate.text-lg.font-semibold::before
- Matched samples: （无直接源码候选）

### JCSS-0509 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `border-color: var(--wd-frame, #6c5ce0); border-radius: 2px; background-color: var(--wd-window, #201936); box-shadow: 0 0 0 1px var(--wd-frame, #6c5ce0), 4px 4px 0 #100b1e`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card"]
- Matched samples: （无直接源码候选）

### JCSS-0510 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `margin-block-start: calc(-1 * var(--card-spacing, 1rem)); margin-inline: calc(-1 * var(--card-spacing, 1rem)); padding-block: calc(var(--card-spacing, 1rem) / 2); padding-inline: calc(2 * var(--card-spacing, 1rem)); clip-path: polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 0 100%, 0 2px); border: 0; … (13 declarations)`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card"] > [data-slot="card-header"]
- Matched samples: （无直接源码候选）

### JCSS-0511 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `margin-block-start: -0.5rem; padding-block: 0; min-height: 3.1875rem; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); align-items: center; … (7 declarations)`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card"]:has(> [data-slot="card-content"] form) > [data-slot="card-header"]
- Matched samples: （无直接源码候选）

### JCSS-0512 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `grid-column: 1; grid-row: 1; justify-self: start; align-self: center`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card"]:has(> [data-slot="card-content"] form) > [data-slot="card-header"] > [data-slot="button"][data-variant="link"]
- Matched samples: （无直接源码候选）

### JCSS-0513 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `grid-column: 2; grid-row: 1; justify-self: center; align-self: center`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card"]:has(> [data-slot="card-content"] form) > [data-slot="card-header"] > [data-slot="card-title"]
- Matched samples: （无直接源码候选）

### JCSS-0514 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `color: #21132d; font-family: "WD Pixel CJK", var(--vrcx-app-font-family, system-ui), sans-serif; font-synthesis: none`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card"] > [data-slot="card-header"] [data-slot="card-title"]
- Matched samples: （无直接源码候选）

### JCSS-0515 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `color: #21132d; text-decoration: underline; text-decoration-color: rgb(33 19 45 / 50%); text-underline-offset: 3px`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card"] > [data-slot="card-header"] [data-slot="button"][data-variant="link"]
- Matched samples: （无直接源码候选）

### JCSS-0516 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states hover; targets host.
- Declaration code: `color: #100b1e; text-decoration-color: currentColor`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card"] > [data-slot="card-header"] [data-slot="button"][data-variant="link"]:hover
- Matched samples: （无直接源码候选）

### JCSS-0517 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `border: 1px solid #4b3a63; border-radius: 2px; background-color: #2a2147; color: #f2ebff; box-shadow: 2px 2px 0 #100b1e`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card-content"] [data-slot="button"][data-variant="ghost"]:has([data-slot="avatar"])
- Matched samples: （无直接源码候选）

### JCSS-0518 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states hover+disabled; targets host.
- Declaration code: `border-color: #d97fc6; background-color: #3b2c55; color: #fff4fb`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card-content"] [data-slot="button"][data-variant="ghost"]:has([data-slot="avatar"]):hover:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0519 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `border: 1px solid transparent; border-radius: 2px; color: #d6b8ef`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card-content"] div.overflow-y-auto > div.flex.items-center.gap-2 > [data-slot="button"][data-size="icon-sm"]
- Matched samples: （无直接源码候选）

### JCSS-0520 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states hover+disabled; targets host.
- Declaration code: `border-color: #ff7fcf; background-color: #4b1c3a; color: #ffd9ee; box-shadow: 2px 2px 0 #100b1e`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="card-content"] div.overflow-y-auto > div.flex.items-center.gap-2 > [data-slot="button"][data-size="icon-sm"]:hover:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0522 — 0 element records / 0 source locations
- CSS blocks 2; sections login-r8, privacy-lock-r96; states base; targets host.
- Declaration code: `border: 1px solid #8c71b0; border-radius: 2px; background-color: #3b2c55; color: #f2ebff; box-shadow: 2px 2px 0 #100b1e, inset 0 1px 0 rgb(255 255 255 / 12%)`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="button"][data-variant="outline"] / 
[data-vrcx-0-surface="login-page"] [data-slot="button"][data-variant="secondary"] / [data-vrcx-0-surface="privacy-lock"] [data-slot="button"][data-variant="outline"]
- Matched samples: （无直接源码候选）

### JCSS-0523 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states hover+disabled; targets host.
- Declaration code: `border-color: #ff7fcf; background-color: #4a3784; color: #fff4fb`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="button"][data-variant="outline"]:hover:not(:disabled) / 
[data-vrcx-0-surface="login-page"] [data-slot="button"][data-variant="secondary"]:hover:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0524 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 2px; background-color: #ff7fcf; color: #21132d; box-shadow: 3px 3px 0 #100b1e, inset 0 1px 0 rgb(255 255 255 / 38%)`
- Selectors: [data-vrcx-0-surface="login-page"] form > [data-slot="button"][type="submit"][data-variant="default"]
- Matched samples: （无直接源码候选）

### JCSS-0525 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states hover+disabled; targets host.
- Declaration code: `border-color: #8c71b0; background-color: #ffb8e6`
- Selectors: [data-vrcx-0-surface="login-page"] form > [data-slot="button"][type="submit"][data-variant="default"]:hover:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0526 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states active+disabled; targets host.
- Declaration code: `transform: translate(2px, 2px); box-shadow: 1px 1px 0 #100b1e`
- Selectors: [data-vrcx-0-surface="login-page"] form > [data-slot="button"][type="submit"][data-variant="default"]:active:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0527 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `border: 1px solid #8c71b0; border-radius: 2px; background-color: #16112a; color: #f2ebff; box-shadow: inset 2px 2px 0 rgb(0 0 0 / 28%), inset -1px -1px 0 #3d305e`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="input"]
- Matched samples: （无直接源码候选）

### JCSS-0528 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets ::placeholder.
- Declaration code: `color: #c5b5e1; opacity: 1`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="input"]::placeholder
- Matched samples: （无直接源码候选）

### JCSS-0529 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states focus-visible; targets host.
- Declaration code: `border-color: #ff7fcf; border-radius: 0; outline: 2px solid #ff7fcf; outline-offset: 1px`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="input"]:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0530 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `border-color: #ff5a83`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="input"][aria-invalid="true"]
- Matched samples: （无直接源码候选）

### JCSS-0531 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states focus-visible; targets host.
- Declaration code: `border-color: #ff5a83; outline-color: #ff5a83`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="input"][aria-invalid="true"]:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0532 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states base; targets host.
- Declaration code: `color: #ff9eb5`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="field-error"]
- Matched samples: （无直接源码候选）

### JCSS-0533 — 0 element records / 0 source locations
- CSS blocks 4; sections login-r8, tools-ui-r9, fields-toolbar-r10, browse-history-r9; states base; targets host.
- Declaration code: `color: #d6b8ef`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="button"][data-variant="link"] / .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-slot="input-group-addon"] / .vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *) [data-slot="input-group-addon"] / :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"][data-slot="input-group"]) [data-slot="input-group-addon"]
- Matched samples: （无直接源码候选）

### JCSS-0534 — 0 element records / 0 source locations
- CSS blocks 1; sections login-r8; states hover; targets host.
- Declaration code: `color: #ffd9ee`
- Selectors: [data-vrcx-0-surface="login-page"] [data-slot="button"][data-variant="link"]:hover
- Matched samples: （无直接源码候选）

### JCSS-0536 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r9; states base; targets host.
- Declaration code: `border-radius: 0; clip-path: var(--wd-avatar-cut); background-color: transparent; box-shadow: none`
- Selectors: .entity-dialog [data-slot="card-header"] > div.relative > div.absolute.bottom-3.left-3.z-30.size-16 > button[data-slot="button"]
- Matched samples: （无直接源码候选）

### JCSS-0537 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r9; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background: #211a33; color: #f2ebff; box-shadow: inset 1px 1px rgb(253 244 255/.72),inset -1px -1px rgb(22 17 42/.72); cursor: pointer; … (7 declarations)`
- Selectors: .entity-dialog .flex.flex-wrap.gap-1\.5 > [data-slot="button"][data-variant="ghost"][data-size="icon-xs"][title]
- Matched samples: （无直接源码候选）

### JCSS-0538 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r9; states hover+disabled; targets host.
- Declaration code: `background: #392a52; color: #fff0fa`
- Selectors: .entity-dialog .flex.flex-wrap.gap-1\.5 > [data-slot="button"][data-variant="ghost"][data-size="icon-xs"][title]:hover:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0539 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r9; states active+disabled; targets host.
- Declaration code: `box-shadow: inset 2px 2px #16112a,inset -1px -1px #fdf4ff; transform: translate(1px,1px)`
- Selectors: .entity-dialog .flex.flex-wrap.gap-1\.5 > [data-slot="button"][data-variant="ghost"][data-size="icon-xs"][title]:active:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0542 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r9; states base; targets ::before.
- Declaration code: `opacity: var(--r9-banner-stitch-opacity); -webkit-mask-size: var(--r9-banner-stitch-size); mask-size: var(--r9-banner-stitch-size)`
- Selectors: .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::before
- Matched samples: （无直接源码候选）

### JCSS-0543 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r9; states base; targets ::after.
- Declaration code: `height: var(--r9-banner-hem-height); opacity: var(--r9-banner-hem-opacity); -webkit-mask-size: var(--r9-banner-hem-size); mask-size: var(--r9-banner-hem-size)`
- Selectors: .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::after
- Matched samples: （无直接源码候选）

### JCSS-0544 — 0 element records / 0 source locations
- CSS blocks 1; sections user-dialog-r9; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; right: 0; bottom: 1px; left: 0; z-index: 2; … (14 declarations)`
- Selectors: .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"] > span.relative.size-full::after
- Matched samples: （无直接源码候选）

### JCSS-0545 — 0 element records / 0 source locations
- CSS blocks 1; sections badge-r9; states base; targets host.
- Declaration code: `background-color: #21132d; color: #ffd9ee; border-color: #16112a; box-shadow: inset 0 0 0 1px #ffe4f2`
- Selectors: 0% /  49.999%
- Matched samples: （无直接源码候选）

### JCSS-0546 — 0 element records / 0 source locations
- CSS blocks 1; sections badge-r9; states base; targets host.
- Declaration code: `background-color: #ffd9ee; color: #21132d; border-color: #16112a; box-shadow: inset 0 0 0 1px #d97fc6`
- Selectors: 50% /  100%
- Matched samples: （无直接源码候选）

### JCSS-0547 — 0 element records / 0 source locations
- CSS blocks 1; sections badge-r9; states base; targets host.
- Declaration code: `box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; width: max-content; min-width: 14px; … (32 declarations)`
- Selectors: .vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge']
- Matched samples: （无直接源码候选）

### JCSS-0548 — 0 element records / 0 source locations
- CSS blocks 2; sections badge-r9; states base; targets host.
- Declaration code: `animation: none !important; background-color: #21132d; color: #ffd9ee; border-color: #16112a; outline: none; box-shadow: inset 0 0 0 1px #ffe4f2`
- Selectors: .vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge'] / html.reduce-effects .vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge']
- Matched samples: （无直接源码候选）

### JCSS-0549 — 0 element records / 0 source locations
- CSS blocks 2; sections controls-r9, tools-ui-r9; states base; targets host.
- Declaration code: `gap: 2px; padding: 1px; border: 1px solid #6c5ce0; border-radius: 0; background-color: #201936; color: #e3d2f5; … (7 declarations)`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) / .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]
- Matched samples: （无直接源码候选）

### JCSS-0550 — 0 element records / 0 source locations
- CSS blocks 2; sections controls-r9, tools-ui-r9; states base; targets host.
- Declaration code: `border-radius: 0; border-color: transparent; background-color: transparent; color: #e3d2f5; box-shadow: none; transition: none`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"] / .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"] > [data-slot="tabs-tab"]
- Matched samples: （无直接源码候选）

### JCSS-0551 — 0 element records / 0 source locations
- CSS blocks 3; sections controls-r9, tools-ui-r9; states hover; targets host.
- Declaration code: `background-color: #3b2c55; color: #f2ebff`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"]:hover:not([data-disabled]):not([aria-disabled="true"]) / .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"] > :is([data-slot="toggle"],[data-slot="tooltip-trigger"][aria-pressed]):hover:not([data-disabled]):not([aria-disabled="true"]) / .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"] > [data-slot="tabs-tab"]:hover:not([data-disabled]):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0552 — 0 element records / 0 source locations
- CSS blocks 2; sections controls-r9; states base; targets host.
- Declaration code: `border-color: #6c5ce0; background-color: #ffb8e6 !important; color: #16112a !important; box-shadow: inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d !important`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"]:is([data-active],[aria-selected="true"]) / .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"] > :is([data-slot="toggle"],[data-slot="tooltip-trigger"][aria-pressed]):is([aria-pressed="true"],[data-pressed])
- Matched samples: （无直接源码候选）

### JCSS-0554 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `color: #2a1d6e`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"]:is([data-active],[aria-selected="true"]) > span:last-child
- Matched samples: （无直接源码候选）

### JCSS-0555 — 0 element records / 0 source locations
- CSS blocks 2; sections controls-r9, tools-ui-r9; states focus-visible; targets host.
- Declaration code: `z-index: 2; outline: 2px solid #ff7fcf; outline-offset: -2px`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"]:focus-visible / .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"] > [data-slot="tabs-tab"]:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0556 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `gap: 0; padding: 0; border: 1px solid #6c5ce0; border-radius: 0; background-color: #201936; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"]
- Matched samples: （无直接源码候选）

### JCSS-0557 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `border-color: #6c5ce0; border-radius: 0; background-color: #201936; color: #e3d2f5; box-shadow: none; transition: none`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"] > :is([data-slot="toggle"],[data-slot="tooltip-trigger"][aria-pressed])
- Matched samples: （无直接源码候选）

### JCSS-0558 — 0 element records / 0 source locations
- CSS blocks 2; sections controls-r9, fields-toolbar-r10; states base; targets ::before.
- Declaration code: `content: none !important`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"] > :is([data-slot="toggle"],[data-slot="tooltip-trigger"][aria-pressed]):is([aria-pressed="true"],[data-pressed])::before / .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="default"] > [data-slot="toggle"]:is([data-pressed],[aria-pressed="true"])::before
- Matched samples: （无直接源码候选）

### JCSS-0559 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `background-color: #6c5ce0`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"] > [data-slot="separator"]
- Matched samples: （无直接源码候选）

### JCSS-0560 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states focus-visible; targets host.
- Declaration code: `z-index: 2; outline: 2px solid #ff7fcf; outline-offset: -3px`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"] > :is([data-slot="toggle"],[data-slot="tooltip-trigger"][aria-pressed]):focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0561 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background: #201936 !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; box-shadow: inset 1px 1px rgb(253 244 255/.18),inset -1px -1px #16112a,2px 2px 0 #100b1e`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold:has(.activity-skin) .activity-skin section.activity-card
- Matched samples: （无直接源码候选）

### JCSS-0562 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `--tw-ring-color: #ffb8e6`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > [data-slot="button"][class~="rounded-object"][class~="ring-2"]
- Matched samples: （无直接源码候选）

### JCSS-0563 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `border-radius: 0; clip-path: var(--jk-px-cut,polygon(0 2px,2px 2px,2px 0,calc(100% - 2px) 0,calc(100% - 2px) 2px,100% 2px,100% calc(100% - 2px),calc(100% - 2px) calc(100% - 2px),calc(100% - 2px) 100%,2px 100%,2px calc(100% - 2px),0 calc(100% - 2px))); background-color: #ffb8e6; color: #16112a; --tw-ring-color: #16112a`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > [data-slot="button"][class~="rounded-object"] [class~="left-1"] > span[class~="size-5"][class~="rounded-full"]
- Matched samples: （无直接源码候选）

### JCSS-0564 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `border-radius: 0; border-color: #6c5ce0; background-color: #ffb8e6; color: #16112a; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d,2px 2px 0 #100b1e`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > button[data-slot="dropdown-menu-trigger"][data-size="icon-xs"]
- Matched samples: （无直接源码候选）

### JCSS-0565 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `overflow: hidden; border: 1px solid #6c5ce0; border-radius: 0; background: #201936; color: #f2ebff; box-shadow: inset 1px 1px rgb(253 244 255/.14),inset -1px -1px #16112a,2px 2px 0 #100b1e`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"]
- Matched samples: （无直接源码候选）

### JCSS-0566 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `border-color: #6c5ce0; border-radius: 0; background: #16112a`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] > [data-slot="card-content"] > .bg-muted.overflow-hidden.border
- Matched samples: （无直接源码候选）

### JCSS-0567 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="badge"]
- Matched samples: （无直接源码候选）

### JCSS-0568 — 0 element records / 0 source locations
- CSS blocks 2; sections controls-r9; states base; targets host.
- Declaration code: `min-height: 28px; border: 1px solid #6c5ce0; border-radius: 0; background: #ffb8e6; color: #16112a; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d,2px 2px 0 #100b1e; … (7 declarations)`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="button"][data-variant="default"] / .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="1"] [data-slot="button"][data-variant="default"]
- Matched samples: （无直接源码候选）

### JCSS-0569 — 0 element records / 0 source locations
- CSS blocks 2; sections controls-r9; states hover+disabled; targets host.
- Declaration code: `background: #ffd9ee`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="button"][data-variant="default"]:hover:not(:disabled):not([aria-disabled="true"]) / .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="1"] [data-slot="button"][data-variant="default"]:hover:not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0570 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `border: 1px solid; border-color: var(--jk-panel-edge); border-radius: 0; background: #201936; color: #f2ebff; box-shadow: var(--jk-panel-raised); … (9 declarations)`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > div.absolute:is(.w-64,.w-72)
- Matched samples: （无直接源码候选）

### JCSS-0571 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `border: 1px solid; border-color: var(--jk-panel-edge); border-radius: 0; background: #201936; color: #f2ebff; box-shadow: var(--jk-panel-raised); … (8 declarations)`
- Selectors: :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot]))
- Matched samples: （无直接源码候选）

### JCSS-0572 — 0 element records / 0 source locations
- CSS blocks 1; sections controls-r9; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background: #ffb8e6; clip-path: var(--jk-px-cut,polygon(0 2px,2px 2px,2px 0,calc(100% - 2px) 0,calc(100% - 2px) 2px,100% 2px,100% calc(100% - 2px),calc(100% - 2px) calc(100% - 2px),calc(100% - 2px) 100%,2px 100%,2px calc(100% - 2px),0 calc(100% - 2px)))`
- Selectors: .vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > .absolute.w-72 > .flex.items-center > span.bg-muted[class~="size-11"][class~="rounded-full"]
- Matched samples: （无直接源码候选）

### JCSS-0576 — 0 element records / 0 source locations
- CSS blocks 2; sections popups-r9; states base; targets host.
- Declaration code: `color: #ffd9ee; background: linear-gradient(#ffb8e6,#ffb8e6) 7px center / 7px 7px no-repeat #302344; padding-left: 22px; border-bottom: 1px solid #6c5ce0; font-weight: 600`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-slot$="menu-label"],[data-slot="select-label"],[data-slot="combobox-label"]) / :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) [data-slot="menubar-label"]
- Matched samples: （无直接源码候选）

### JCSS-0577 — 0 element records / 0 source locations
- CSS blocks 2; sections popups-r9; states base; targets host.
- Declaration code: `background: transparent; color: #f2ebff; border-radius: 0; animation: none !important; transition: none !important`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-slot$="menu-item"],[data-slot$="menu-checkbox-item"],[data-slot$="menu-radio-item"],[data-slot$="menu-sub-trigger"],[data-slot="select-item"],[data-slot="combobox-item"],[data-slot="button"][data-variant="ghost"][class~="h-auto"][class~="justify-start"][class~="p-0"]) / :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) :is([data-slot="menubar-item"],[data-slot="menubar-checkbox-item"],[data-slot="menubar-radio-item"],[data-slot="menubar-sub-trigger"])
- Matched samples: （无直接源码候选）

### JCSS-0578 — 0 element records / 0 source locations
- CSS blocks 2; sections popups-r9; states hover+focus-visible+disabled; targets host.
- Declaration code: `background: #ffb8e6 !important; color: #16112a !important; clip-path: polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%); box-shadow: inset 0 1px 0 #ffd9ee, inset 0 -1px 0 #d97fc6`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-slot$="menu-item"],[data-slot$="menu-checkbox-item"],[data-slot$="menu-radio-item"],[data-slot$="menu-sub-trigger"],[data-slot="select-item"],[data-slot="combobox-item"],[data-slot="button"][data-variant="ghost"][class~="h-auto"][class~="justify-start"][class~="p-0"]):is(:hover,:focus-visible,[data-highlighted],[data-popup-open]):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) / :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) :is([data-slot="menubar-item"],[data-slot="menubar-checkbox-item"],[data-slot="menubar-radio-item"],[data-slot="menubar-sub-trigger"]):is(:hover,:focus-visible,[data-highlighted],[data-popup-open]):not([data-disabled]):not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0579 — 0 element records / 0 source locations
- CSS blocks 2; sections popups-r9; states focus-visible+hover+disabled; targets host.
- Declaration code: `color: #2a1d6e !important`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is(:focus-visible,[data-highlighted],[data-popup-open],[data-slot$="-item"]:hover,[data-slot$="-trigger"]:hover,[data-slot="button"][class~="h-auto"]:hover):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) :is(.text-muted-foreground,[data-slot$="menu-shortcut"]) / :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) :is(:focus-visible,[data-highlighted],[data-popup-open],[data-slot="menubar-item"]:hover,[data-slot="menubar-sub-trigger"]:hover):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) :is(.text-muted-foreground,[data-slot="menubar-shortcut"])
- Matched samples: （无直接源码候选）

### JCSS-0580 — 0 element records / 0 source locations
- CSS blocks 2; sections popups-r9; states base; targets host.
- Declaration code: `color: #ff7fae !important`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-variant="destructive"],[data-variant="destructive"] *) / :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) [data-variant="destructive"]
- Matched samples: （无直接源码候选）

### JCSS-0581 — 0 element records / 0 source locations
- CSS blocks 3; sections popups-r9; states hover+focus-visible+disabled; targets host.
- Declaration code: `color: #16112a !important`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-variant="destructive"]:is(:hover,:focus-visible,[data-highlighted]):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) / :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-variant="destructive"]:is(:hover,:focus-visible,[data-highlighted]):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) * / :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) [data-variant="destructive"]:is(:hover,:focus-visible,[data-highlighted]):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) / 
:is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) [data-variant="destructive"]:is(:hover,:focus-visible,[data-highlighted]):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) *
- Matched samples: （无直接源码候选）

### JCSS-0582 — 0 element records / 0 source locations
- CSS blocks 2; sections popups-r9; states disabled; targets host.
- Declaration code: `color: #b9add9 !important; background: transparent !important; opacity: 1; clip-path: none; box-shadow: none`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-disabled],[aria-disabled="true"],:disabled) / :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) :is([data-disabled],[aria-disabled="true"],:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0583 — 0 element records / 0 source locations
- CSS blocks 1; sections popups-r9; states disabled; targets host.
- Declaration code: `color: #b9add9 !important`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-disabled],[aria-disabled="true"],:disabled) .text-muted-foreground
- Matched samples: （无直接源码候选）

### JCSS-0584 — 0 element records / 0 source locations
- CSS blocks 2; sections popups-r9; states base; targets host.
- Declaration code: `background: repeating-linear-gradient(90deg,#8c71b0 0 1px,transparent 1px 3px); border: 0`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-slot$="menu-separator"],[data-slot="select-separator"],[data-slot="combobox-separator"]) / :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) :is([data-slot="menubar-separator"])
- Matched samples: （无直接源码候选）

### JCSS-0585 — 0 element records / 0 source locations
- CSS blocks 1; sections popups-r9; states base; targets host.
- Declaration code: `border-radius: 0; box-shadow: 0 0 0 1px #100b1e`
- Selectors: i.x-user-status
- Matched samples: （无直接源码候选）

### JCSS-0586 — 0 element records / 0 source locations
- CSS blocks 1; sections popups-r9; states base; targets host.
- Declaration code: `clip-path: none !important`
- Selectors: :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-slot$="menu-item"],[data-slot="button"]):has([data-slot="avatar"] [class~="-inset-[18.75%]"],[data-profile-decoration-asset])
- Matched samples: （无直接源码候选）

### JCSS-0587 — 0 element records / 0 source locations
- CSS blocks 1; sections popups-r9; states base; targets host.
- Declaration code: `border-radius: 0; border-width: 0; clip-path: var(--wd-avatar-cut-sm); box-shadow: none; outline: none`
- Selectors: [data-slot="popover-content"] [data-slot="scroll-area"] button:is([data-slot="button"],[data-slot="tooltip-trigger"])[data-variant="ghost"] span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"]
- Matched samples: （无直接源码候选）

### JCSS-0589 — 0 element records / 0 source locations
- CSS blocks 1; sections popups-r9; states base; targets host.
- Declaration code: `--radius: 0px; padding: 6px 8px; overflow-wrap: anywhere; background: #211a33 !important; color: #f2ebff; opacity: 1; … (12 declarations)`
- Selectors: body:has(.vrcx-0-statusbar [data-slot="tooltip-trigger"][data-popup-open])
  [data-slot="tooltip-content"]:is(:has(> div.flex.flex-col.gap-1.text-xs),.flex.flex-col.gap-1.text-xs)
- Matched samples: （无直接源码候选）

### JCSS-0590 — 0 element records / 0 source locations
- CSS blocks 1; sections tools-ui-r9; states base; targets host.
- Declaration code: `border-radius: 0; background-color: #201936; color: #e3d2f5; border-color: var(--jk-field-edge); box-shadow: var(--jk-field-inset); transition: none`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]
- Matched samples: （无直接源码候选）

### JCSS-0591 — 0 element records / 0 source locations
- CSS blocks 6; sections tools-ui-r9, fields-toolbar-r10, favorites-r9, browse-history-r9; states focus, focus-visible; targets host.
- Declaration code: `outline: 2px solid #ff7fcf; outline-offset: 1px; z-index: 2`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:focus-within / .vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *):focus-within / .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="input-group"]:has(> [data-slot="combobox-chips"]):focus-within / .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[class~="border-dashed"]:focus-visible / .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"]:focus-visible / … (6 selectors)
- Matched samples: （无直接源码候选）

### JCSS-0592 — 0 element records / 0 source locations
- CSS blocks 2; sections tools-ui-r9, browse-history-r9; states base; targets host.
- Declaration code: `border-radius: 0; background-color: transparent; color: #f2ebff; caret-color: #ffb8e6; outline: none; box-shadow: none`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-slot="input-group-control"] / :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"][data-slot="input-group"]) [data-slot="input-group-control"]
- Matched samples: （无直接源码候选）

### JCSS-0594 — 0 element records / 0 source locations
- CSS blocks 1; sections tools-ui-r9; states base; targets host.
- Declaration code: `border-radius: 0; color: #16112a; background-color: #ffb8e6; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-slot="button"]
- Matched samples: （无直接源码候选）

### JCSS-0595 — 0 element records / 0 source locations
- CSS blocks 1; sections tools-ui-r9; states base; targets host.
- Declaration code: `border-color: #6c5ce0; background-color: #ffb8e6; color: #16112a; box-shadow: inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"] > [data-slot="tabs-tab"]:is([data-active],[aria-selected="true"])
- Matched samples: （无直接源码候选）

### JCSS-0596 — 0 element records / 0 source locations
- CSS blocks 8; sections avatars-status-r9; states base; targets host.
- Declaration code: `border-radius: 0; border-width: 0; box-shadow: none; outline: none; clip-path: var(--wd-avatar-cut)`
- Selectors: button:has(> span[class~="size-10"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]) > span[class~="size-10"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"] / [data-slot="hover-card-content"] > div[class~="relative"][class~="isolate"][class~="w-full"] > div[class~="space-y-2.5"] > div[class~="relative"][class~="isolate"] > button[class~="size-10"] > span[class~="bg-muted"][class~="size-full"][class~="rounded-full"] / [data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"] > img / .activity-skin span.block.shrink-0.overflow-hidden.rounded-full[class~="size-16"] / .object-row > [data-slot="hover-card-trigger"] > div[class~="relative"][class~="ml-2"][class~="overflow-visible"] > span[class~="bg-muted"][class~="rounded-full"][class~="border"] / … (9 selectors)
- Matched samples: （无直接源码候选）

### JCSS-0597 — 0 element records / 0 source locations
- CSS blocks 1; sections avatars-status-r9; states base; targets host.
- Declaration code: `border-radius: 0; clip-path: var(--wd-avatar-cut); background-color: transparent; box-shadow: none; border-color: transparent; border-width: 0; … (7 declarations)`
- Selectors: [data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"]
- Matched samples: （无直接源码候选）

### JCSS-0598 — 0 element records / 0 source locations
- CSS blocks 1; sections avatars-status-r9; states base; targets host.
- Declaration code: `border-radius: 0; border-width: 0; box-shadow: none; outline: none`
- Selectors: .activity-skin span.block.shrink-0.overflow-hidden.rounded-full:is([class~="size-16"],[class~="size-7"],[class~="size-9"]) > :is(img,span[class~="rounded-full"])
- Matched samples: （无直接源码候选）

### JCSS-0599 — 0 element records / 0 source locations
- CSS blocks 2; sections avatars-status-r9; states base; targets host.
- Declaration code: `border-radius: var(--radius-md,calc(var(--radius) - 2px)); clip-path: none`
- Selectors: [data-slot="avatar"][class~="rounded-md"] / :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"][class~="rounded-md"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset]))
- Matched samples: （无直接源码候选）

### JCSS-0600 — 0 element records / 0 source locations
- CSS blocks 2; sections avatars-status-r9; states base; targets host.
- Declaration code: `border-radius: var(--radius-lg,var(--radius)); clip-path: none`
- Selectors: [data-slot="avatar"][class~="rounded-lg"] / :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"][class~="rounded-lg"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset]))
- Matched samples: （无直接源码候选）

### JCSS-0601 — 0 element records / 0 source locations
- CSS blocks 3; sections avatars-status-r9; states base; targets host, ::after.
- Declaration code: `border-radius: inherit; clip-path: none`
- Selectors: [data-slot="avatar"][class~="rounded-md"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"]) / 
[data-slot="avatar"][class~="rounded-lg"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"]) / [data-slot="avatar"][class~="rounded-md"]::after / 
[data-slot="avatar"][class~="rounded-lg"]::after / :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"][class~="rounded-md"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset])) > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"]) / … (6 selectors)
- Matched samples: （无直接源码候选）

### JCSS-0603 — 0 element records / 0 source locations
- CSS blocks 1; sections avatars-status-r9; states focus-visible; targets host.
- Declaration code: `outline: 1px dashed var(--wd-square); outline-offset: 2px; box-shadow: none`
- Selectors: .vrcx-0-side-panel button[class~="focus-visible:ring-2"][class~="rounded-full"]:has(> span.user-status-avatar):focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0604 — 0 element records / 0 source locations
- CSS blocks 1; sections brand-heart-r9; states base; targets host.
- Declaration code: `padding-right: 21px`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] [data-slot='menubar'] [data-slot='menubar-trigger']:has(> .vrcx-0-brand)
- Matched samples: （无直接源码候选）

### JCSS-0605 — 0 element records / 0 source locations
- CSS blocks 1; sections loader-r9; states base; targets host.
- Declaration code: `--jk-loader-sheet: url("data:image/png;base64,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"); --jk-loader-frame-w: 56px; --jk-loader-frame-h: 72px; --jk-loader-frames: 11; --jk-loader-duration: 1100ms`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0606 — 0 element records / 0 source locations
- CSS blocks 1; sections loader-r9; states base; targets host.
- Declaration code: `background-position: 0 0`
- Selectors: from
- Matched samples: （无直接源码候选）

### JCSS-0607 — 0 element records / 0 source locations
- CSS blocks 1; sections loader-r9; states base; targets host.
- Declaration code: `background-position: -616px 0`
- Selectors: to
- Matched samples: （无直接源码候选）

### JCSS-0609 — 0 element records / 0 source locations
- CSS blocks 1; sections loader-r9; states base; targets host.
- Declaration code: `display: block; flex: none; width: var(--jk-loader-frame-w); height: var(--jk-loader-frame-h); margin: 0; padding: 0; … (18 declarations)`
- Selectors: .vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) > svg[data-slot="spinner"]
- Matched samples: （无直接源码候选）

### JCSS-0610 — 0 element records / 0 source locations
- CSS blocks 2; sections loader-r9; states base; targets host.
- Declaration code: `animation: none !important; background-position: 0 0 !important`
- Selectors: .vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) > svg[data-slot="spinner"] / html.reduce-effects .vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) > svg[data-slot="spinner"]
- Matched samples: （无直接源码候选）

### JCSS-0613 — 0 element records / 0 source locations
- CSS blocks 1; sections form-controls-r9; states base, checked; targets ::after.
- Declaration code: `content: ""; position: absolute; left: 4px; top: 2px; width: 4px; height: 7px; … (9 declarations)`
- Selectors: :where([data-slot="checkbox"][data-checked])::after / :where(input[type="checkbox"]:checked)::after
- Matched samples: （无直接源码候选）

### JCSS-0614 — 0 element records / 0 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `appearance: none; -webkit-appearance: none; border: 1px solid #8c71b0; border-radius: 0; background-color: #211a33; color: #16112a; … (8 declarations)`
- Selectors: :where([role="radio"],input[type="radio"])
- Matched samples: （无直接源码候选）

### JCSS-0615 — 0 element records / 0 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `width: 15px; height: 15px`
- Selectors: :where(input[type="radio"])
- Matched samples: （无直接源码候选）

### JCSS-0616 — 0 element records / 0 source locations
- CSS blocks 3; sections form-controls-r9, data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; background-color: #16112a`
- Selectors: :where([role="radio"] > span) / :where(.vrcx-0-titlebar) span.h-\[2px\].rounded-full / :where(.vrcx-0-main-content #chart) > .relative .h-1.rounded-full
- Matched samples: （无直接源码候选）

### JCSS-0617 — 0 element records / 0 source locations
- CSS blocks 1; sections form-controls-r9; states checked; targets host.
- Declaration code: `background-image: linear-gradient(#16112a,#16112a); background-size: 6px 6px; background-position: center; background-repeat: no-repeat`
- Selectors: :where(input[type="radio"]:checked)
- Matched samples: （无直接源码候选）

### JCSS-0618 — 0 element records / 0 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `appearance: none; -webkit-appearance: none; height: 18px; margin: 0; background: transparent; accent-color: #ffb8e6; … (7 declarations)`
- Selectors: :where(input[type="range"]:not(.entity-dialog *))
- Matched samples: （无直接源码候选）

### JCSS-0619 — 0 element records / 0 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets ::-webkit-slider-runnable-track.
- Declaration code: `height: 6px; border: 1px solid #6c5ce0; border-radius: 0; background: repeating-linear-gradient(90deg,#332650 0 3px,#211a33 3px 5px); box-shadow: inset 1px 1px #16112a`
- Selectors: :where(input[type="range"]:not(.entity-dialog *))::-webkit-slider-runnable-track
- Matched samples: （无直接源码候选）

### JCSS-0620 — 0 element records / 0 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets ::-webkit-slider-thumb.
- Declaration code: `appearance: none; -webkit-appearance: none; width: 12px; height: 12px; margin-top: -3px; border: 1px solid #6c5ce0; … (9 declarations)`
- Selectors: :where(input[type="range"]:not(.entity-dialog *))::-webkit-slider-thumb
- Matched samples: （无直接源码候选）

### JCSS-0621 — 0 element records / 0 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets ::-moz-range-track.
- Declaration code: `height: 4px; border: 1px solid #6c5ce0; border-radius: 0; background: repeating-linear-gradient(90deg,#332650 0 3px,#211a33 3px 5px)`
- Selectors: :where(input[type="range"])::-moz-range-track
- Matched samples: （无直接源码候选）

### JCSS-0622 — 0 element records / 0 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets ::-moz-range-thumb.
- Declaration code: `width: 10px; height: 10px; border: 1px solid #6c5ce0; border-radius: 0; background: #ffb8e6; box-shadow: inset 1px 1px #fff0fa,inset -1px -1px #a44a8c`
- Selectors: :where(input[type="range"])::-moz-range-thumb
- Matched samples: （无直接源码候选）

### JCSS-0627 — 0 element records / 0 source locations
- CSS blocks 1; sections form-controls-r9; states base; targets host.
- Declaration code: `width: 12px; height: 12px`
- Selectors: :where(:is([data-slot="select-trigger"],[data-slot="combobox-trigger"]) > svg:is(.lucide-chevron-down,.lucide-chevrons-up-down))
- Matched samples: （无直接源码候选）

### JCSS-0630 — 0 element records / 0 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets host.
- Declaration code: `--r9-dialog-face: #211a33; --r9-dialog-ink: #16112a; --r9-dialog-pink: #f2c6e8; --r9-dialog-pink-edge: #d97fc6; --r9-dialog-indigo: #3a22c8; --r9-dialog-frame: #6c5ce0; … (9 declarations)`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0632 — 0 element records / 0 source locations
- CSS blocks 2; sections dialogs-r9, dialog-header-r97; states base; targets host.
- Declaration code: `--r9-dialog-inset: 0px`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"])[class~="p-0"] / [data-slot$=dialog-content][class~=p-0]>[data-slot$=dialog-header]:is(.flex-row,:has(>:not([data-slot$=title],[data-slot$=description]) button))
- Matched samples: （无直接源码候选）

### JCSS-0633 — 0 element records / 0 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets host.
- Declaration code: `--r9-dialog-inset: .5rem`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"])[class~="p-2"]
- Matched samples: （无直接源码候选）

### JCSS-0634 — 0 element records / 0 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets host.
- Declaration code: `--r9-dialog-inset: .75rem`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"])[class~="p-3"]
- Matched samples: （无直接源码候选）

### JCSS-0635 — 0 element records / 0 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets host.
- Declaration code: `--r9-dialog-inset: 1.25rem`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"])[class~="p-5"]
- Matched samples: （无直接源码候选）

### JCSS-0636 — 0 element records / 0 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets host.
- Declaration code: `position: relative; display: flex; flex-direction: column; align-items: stretch; gap: .5rem; margin-block-start: calc(-1 * var(--r9-dialog-inset, 1rem)); … (9 declarations)`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"]):not(.entity-dialog):not(.owner-dialog):has(> :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]):not(.sr-only))
  > :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"])
- Matched samples: （无直接源码候选）

### JCSS-0637 — 0 element records / 0 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets host.
- Declaration code: `position: relative; z-index: 1; display: flex; min-height: 30px; align-items: center; gap: 8px; … (20 declarations)`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"]):not(.entity-dialog):not(.owner-dialog):has(> :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]):not(.sr-only))
  > :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]) > :is([data-slot="dialog-title"], [data-slot="alert-dialog-title"])
- Matched samples: （无直接源码候选）

### JCSS-0638 — 0 element records / 0 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets ::before.
- Declaration code: `content: ""; display: block; width: 8px; height: 8px; flex: 0 0 8px; background: var(--r9-dialog-indigo); … (7 declarations)`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"]):not(.entity-dialog):not(.owner-dialog):has(> :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]):not(.sr-only))
  > :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]) > :is([data-slot="dialog-title"], [data-slot="alert-dialog-title"])::before
- Matched samples: （无直接源码候选）

### JCSS-0640 — 0 element records / 0 source locations
- CSS blocks 1; sections dialogs-r9; states hover+disabled; targets host.
- Declaration code: `background: var(--r9-dialog-ink) !important; color: var(--r9-dialog-pink) !important`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"]):not(.entity-dialog):not(.owner-dialog):has(> :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]):not(.sr-only))
  > [data-slot="dialog-close"]:hover:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0642 — 0 element records / 0 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets host.
- Declaration code: `position: relative; border-top-color: transparent; border-radius: 0 !important; background: transparent !important`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"]):not(.entity-dialog):not(.owner-dialog):has(> :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]):not(.sr-only))
  > :is([data-slot="dialog-footer"], [data-slot="alert-dialog-footer"])
- Matched samples: （无直接源码候选）

### JCSS-0643 — 0 element records / 0 source locations
- CSS blocks 1; sections dialogs-r9; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; top: 2px; right: 0; left: 0; height: 8px; … (13 declarations)`
- Selectors: :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"]):not(.entity-dialog):not(.owner-dialog):has(> :is([data-slot="dialog-header"], [data-slot="alert-dialog-header"]):not(.sr-only))
  > :is([data-slot="dialog-footer"], [data-slot="alert-dialog-footer"])::before
- Matched samples: （无直接源码候选）

### JCSS-0644 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `--jk-field-edge: #69557c #fdf4ff #fdf4ff #69557c; --jk-field-inset: inset 1px 1px #16112a,inset -1px -1px #a294c8`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0645 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; background: #201936; color: #e3d2f5; transition: none`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *)
- Matched samples: （无直接源码候选）

### JCSS-0646 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border-radius: 0; background: transparent; color: #f2ebff; caret-color: #ffb8e6; outline: none; box-shadow: none`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *) [data-slot="input-group-control"]
- Matched samples: （无直接源码候选）

### JCSS-0647 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border-radius: 0; color: #16112a; background: #ffb8e6; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *) [data-slot="input-group-button"]
- Matched samples: （无直接源码候选）

### JCSS-0651 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `display: flex; gap: 2px; padding: 0; max-width: 100%`
- Selectors: .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="default"]
- Matched samples: （无直接源码候选）

### JCSS-0652 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `min-height: 28px; border: 1px solid #6c5ce0; border-radius: 0; background: #211a33; color: #d6c8ee; box-shadow: inset 1px 1px rgb(253 244 255/.12),inset -1px -1px #16112a; … (7 declarations)`
- Selectors: .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="default"] > [data-slot="toggle"]
- Matched samples: （无直接源码候选）

### JCSS-0653 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states hover+disabled; targets host.
- Declaration code: `background: #392a52; color: #f2ebff`
- Selectors: .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="default"] > [data-slot="toggle"]:hover:not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0654 — 0 element records / 0 source locations
- CSS blocks 2; sections fields-toolbar-r10, buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: #6c5ce0; background: #ffb8e6; color: #16112a; box-shadow: inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d`
- Selectors: .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="default"] > [data-slot="toggle"]:is([data-pressed],[aria-pressed="true"]) / :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="tabs-list"]:where(:not(.vrcx-0-page-scaffold *):not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) > [data-slot="tabs-tab"]:is([data-active],[aria-selected="true"])
- Matched samples: （无直接源码候选）

### JCSS-0655 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states focus-visible; targets host.
- Declaration code: `z-index: 2; outline: 2px solid #ff7fcf; outline-offset: 1px`
- Selectors: .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="default"] > [data-slot="toggle"]:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0656 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states disabled; targets host.
- Declaration code: `opacity: .55`
- Selectors: .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="default"] > [data-slot="toggle"]:disabled
- Matched samples: （无直接源码候选）

### JCSS-0657 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; background: #201936; color: #e3d2f5`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="input-group"]:has(> [data-slot="combobox-chips"])
- Matched samples: （无直接源码候选）

### JCSS-0660 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border-color: #ff6b8a`
- Selectors: :where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"]):is([aria-invalid="true"],[data-invalid]))
- Matched samples: （无直接源码候选）

### JCSS-0661 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `border: 0; border-radius: 0; background: transparent; color: #f2ebff; box-shadow: none`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="combobox-chips"]
- Matched samples: （无直接源码候选）

### JCSS-0662 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `min-height: 21px; border: 1px solid #8c71b0; border-radius: 0; background: #332650; color: #f2ebff; align-items: center; … (9 declarations)`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="combobox-chips"] [data-slot="combobox-chip"]
- Matched samples: （无直接源码候选）

### JCSS-0663 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `width: 24px; height: 24px; min-width: 24px; border: 1px solid #6c5ce0; border-radius: 0; background: #211a33; … (7 declarations)`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="combobox-chip-remove"]
- Matched samples: （无直接源码候选）

### JCSS-0664 — 0 element records / 0 source locations
- CSS blocks 1; sections fields-toolbar-r10; states base; targets host.
- Declaration code: `min-height: 20px; border: 0; background: transparent; color: #f2ebff; outline: none; box-shadow: none`
- Selectors: .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="combobox-chip-input"]
- Matched samples: （无直接源码候选）

### JCSS-0672 — 0 element records / 0 source locations
- CSS blocks 1; sections overlays-r10; states base; targets host.
- Declaration code: `--radius: 0px; box-sizing: border-box; padding: 6px 12px; overflow-wrap: anywhere; background: #211a33; color: #f2ebff; … (13 declarations)`
- Selectors: [data-slot="tooltip-content"]:not(:has(> div.flex.flex-col.gap-1.text-xs)):not(.flex.flex-col.gap-1.text-xs)
- Matched samples: （无直接源码候选）

### JCSS-0679 — 0 element records / 0 source locations
- CSS blocks 1; sections overlays-r10; states base; targets host.
- Declaration code: `box-sizing: border-box; padding: 12px 16px; color: #21132d; background: #d97fc6; border-bottom: 1px solid #6c5ce0; border-radius: 0`
- Selectors: [data-slot="sheet-popup"]:has([data-slot="sheet-title"] .lucide-bell) > [data-slot="sheet-header"]
- Matched samples: （无直接源码候选）

### JCSS-0680 — 0 element records / 0 source locations
- CSS blocks 1; sections overlays-r10; states base; targets host.
- Declaration code: `color: #21132d`
- Selectors: [data-slot="sheet-popup"]:has([data-slot="sheet-title"] .lucide-bell) [data-slot="sheet-title"] / 
[data-slot="sheet-popup"]:has([data-slot="sheet-title"] .lucide-bell) [data-slot="sheet-header"] button
- Matched samples: （无直接源码候选）

### JCSS-0681 — 0 element records / 0 source locations
- CSS blocks 1; sections overlays-r10; states focus-visible; targets host.
- Declaration code: `outline: 2px solid #21132d; outline-offset: -3px`
- Selectors: [data-slot="sheet-popup"]:has([data-slot="sheet-title"] .lucide-bell) [data-slot="sheet-header"] button:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0682 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets ::before.
- Declaration code: `content: ""; display: block; flex: 0 0 6px; width: 6px; height: 6px; background: #ffb8e6; … (8 declarations)`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] > .flex.h-full.min-h-0.flex-col.gap-3.overflow-auto.p-2
  > .flex.flex-col.gap-1 > .mb-1.flex.items-center.justify-between.text-sm.font-semibold > span.flex.min-w-0.items-center.gap-1\.5::before
- Matched samples: （无直接源码候选）

### JCSS-0683 — 0 element records / 0 source locations
- CSS blocks 2; sections favorites-r9, buttons-badges-r10; states base; targets host.
- Declaration code: `color: #f2ebff`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] > .flex.h-full.min-h-0.flex-col.gap-3.overflow-auto.p-2
  > .flex.flex-col.gap-1 > .mb-1.flex.items-center.justify-between.text-sm.font-semibold / :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="alert-title"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0684 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background: #201936; color: #d6b8ef; box-shadow: inset 1px 1px rgb(253 244 255/.12),inset -1px -1px #16112a; font-variant-numeric: tabular-nums`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [data-slot="badge"]
- Matched samples: （无直接源码候选）

### JCSS-0685 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `border-radius: 0; background-color: transparent; color: #f2ebff; box-shadow: none; transition: none`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"]
- Matched samples: （无直接源码候选）

### JCSS-0686 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `border-radius: 0; background: transparent; color: #f2ebff; transition: none`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"] > [data-slot="button"]
- Matched samples: （无直接源码候选）

### JCSS-0687 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states hover; targets host.
- Declaration code: `background-color: #2a2147`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"]:hover:not([class~="bg-(--state-selected-surface)"])
- Matched samples: （无直接源码候选）

### JCSS-0688 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `background-color: #ffb8e6; color: #16112a; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"][class~="bg-(--state-selected-surface)"]
- Matched samples: （无直接源码候选）

### JCSS-0689 — 0 element records / 0 source locations
- CSS blocks 2; sections favorites-r9; states base; targets host.
- Declaration code: `color: #16112a`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"][class~="bg-(--state-selected-surface)"] > [data-slot="button"] / .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"][class~="bg-(--state-selected-surface)"] > [data-slot="button"] :is([class~="text-muted-foreground"],[class~="tabular-nums"])
- Matched samples: （无直接源码候选）

### JCSS-0690 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `display: block; flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"] > [data-slot="button"] > span[class~="truncate"]
- Matched samples: （无直接源码候选）

### JCSS-0691 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `flex: 0 0 auto; white-space: nowrap; font-variant-numeric: tabular-nums`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"] > [data-slot="button"] > span[class~="tabular-nums"]
- Matched samples: （无直接源码候选）

### JCSS-0692 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states focus-visible; targets host.
- Declaration code: `outline: 2px solid #ff7fcf; outline-offset: -2px; z-index: 2`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"] > [data-slot="button"]:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0693 — 0 element records / 0 source locations
- CSS blocks 2; sections favorites-r9; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background: #201936; color: #f2ebff; box-shadow: inset 1px 1px rgb(253 244 255/.14),inset -1px -1px #16112a; transition: none`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[data-size="icon-sm"] / 
.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[data-size="icon-xs"] / .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] button[data-size="icon-sm"]
- Matched samples: （无直接源码候选）

### JCSS-0694 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `width: 24px; height: 24px; min-width: 24px; flex: 0 0 24px; padding: 0`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"] button[data-size="icon-xs"]
- Matched samples: （无直接源码候选）

### JCSS-0695 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states hover; targets host.
- Declaration code: `background: #ffb8e6; color: #16112a`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[data-size="icon-sm"]:hover / 
.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[data-size="icon-xs"]:hover
- Matched samples: （无直接源码候选）

### JCSS-0696 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `border: 1px dotted #6c5ce0; border-radius: 0; background: #201936; color: #e3d2f5; box-shadow: inset 1px 1px rgb(253 244 255/.08),inset -1px -1px #16112a; transition: none`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[class~="border-dashed"]
- Matched samples: （无直接源码候选）

### JCSS-0697 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states hover+focus-visible; targets host.
- Declaration code: `background: #ffb8e6; color: #16112a; border-color: #ff7fcf`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[class~="border-dashed"]:is(:hover,:focus-visible)
- Matched samples: （无直接源码候选）

### JCSS-0698 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `shape-rendering: crispEdges; stroke-linecap: square; stroke-width: 2.5px`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[class~="border-dashed"] [data-icon="inline-start"]
- Matched samples: （无直接源码候选）

### JCSS-0699 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `background: #6c5ce0; transition: none`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"] > [data-slot="resizable-handle"]
- Matched samples: （无直接源码候选）

### JCSS-0700 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets ::after.
- Declaration code: `width: 4px`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"] > [data-slot="resizable-handle"]::after
- Matched samples: （无直接源码候选）

### JCSS-0701 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `width: 4px; height: 28px; border-radius: 0; border: 1px solid #6c5ce0; background-color: #6c5ce0; background-image: repeating-linear-gradient(to bottom,#ffb8e6 0 1px,transparent 1px 5px); … (8 declarations)`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"] > [data-slot="resizable-handle"] > div
- Matched samples: （无直接源码候选）

### JCSS-0702 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states hover+active; targets host.
- Declaration code: `border-color: #ff7fcf; background-color: #ffb8e6; background-image: repeating-linear-gradient(to bottom,#6c5ce0 0 1px,transparent 1px 5px); box-shadow: inset 1px 0 #fdf4ff,inset -1px 0 #7a3f6d`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"] > [data-slot="resizable-handle"]:is(:hover,:active) > div
- Matched samples: （无直接源码候选）

### JCSS-0703 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `border: 1px solid; border-color: var(--jk-panel-edge); border-radius: 0; background-color: #201936; color: #f2ebff; box-shadow: var(--jk-panel-raised); … (7 declarations)`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"]
- Matched samples: （无直接源码候选）

### JCSS-0704 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states hover; targets host.
- Declaration code: `border-color: #ffb8e6; box-shadow: var(--jk-panel-raised)`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"]:hover:not([class~="border-object-selected-border"])
- Matched samples: （无直接源码候选）

### JCSS-0705 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `border-color: #ffb8e6; background-color: #3b2c55; box-shadow: var(--jk-panel-raised),0 0 0 1px #ffb8e6`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"][class~="border-object-selected-border"]
- Matched samples: （无直接源码候选）

### JCSS-0706 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `width: 16px; height: 16px; border: 1px solid #6c5ce0; border-radius: 0; background-color: #201936; color: #16112a; … (8 declarations)`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] [data-slot="checkbox"]
- Matched samples: （无直接源码候选）

### JCSS-0707 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `border-color: #6c5ce0; background-color: #ffb8e6; color: #16112a; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] [data-slot="checkbox"]:is([data-checked],[aria-checked="true"])
- Matched samples: （无直接源码候选）

### JCSS-0708 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `color: #16112a; transition: none`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] [data-slot="checkbox"] [data-slot="checkbox-indicator"]
- Matched samples: （无直接源码候选）

### JCSS-0709 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background: #201936; color: #f2ebff; backdrop-filter: none; box-shadow: inset 1px 1px rgb(253 244 255/.12),inset -1px -1px #16112a; … (7 declarations)`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] [class~="group-hover/tile:opacity-0"]:has(> span[class*="bg-[var(--status-online)]"])
- Matched samples: （无直接源码候选）

### JCSS-0710 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states base; targets host.
- Declaration code: `width: 6px; height: 6px; border-radius: 0; background-color: var(--status-online,#6fe3d3); image-rendering: pixelated`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] [class~="group-hover/tile:opacity-0"]:has(> span[class*="bg-[var(--status-online)]"]) > span[class*="bg-[var(--status-online)]"]
- Matched samples: （无直接源码候选）

### JCSS-0711 — 0 element records / 0 source locations
- CSS blocks 1; sections favorites-r9; states hover+focus-visible; targets host.
- Declaration code: `border-color: #ff7fcf; background: #ffb8e6; color: #16112a`
- Selectors: .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"])
  [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] button[data-size="icon-sm"]:is(:hover,:focus-visible)
- Matched samples: （无直接源码候选）

### JCSS-0712 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets host.
- Declaration code: `border-color: #6c5ce0; border-radius: 0; background-color: #201936; color: #e3d2f5; border-color: var(--jk-field-edge); box-shadow: var(--jk-field-inset); … (7 declarations)`
- Selectors: :is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"][data-slot="input-group"]
- Matched samples: （无直接源码候选）

### JCSS-0713 — 0 element records / 0 source locations
- CSS blocks 2; sections browse-history-r9; states base; targets host.
- Declaration code: `border-color: #6c5ce0; border-radius: 0; background-color: #201936; color: #e3d2f5; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d; transition: none`
- Selectors: :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"][data-slot="input-group"]) [data-align="inline-end"] [data-slot="button"] / :is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"]:is(button,[data-slot="button"])
- Matched samples: （无直接源码候选）

### JCSS-0714 — 0 element records / 0 source locations
- CSS blocks 2; sections browse-history-r9; states hover+disabled; targets host.
- Declaration code: `border-color: #ffb8e6; background-color: #ffb8e6; color: #16112a`
- Selectors: :is(:is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"][data-slot="input-group"]) [data-align="inline-end"] [data-slot="button"]):hover:not(:disabled):not([aria-disabled="true"]) / :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"]:is(button,[data-slot="button"])):hover:not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0715 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states focus-visible; targets host.
- Declaration code: `border-color: #ff7fcf; outline: 2px solid #ff7fcf; outline-offset: 1px; background-color: #ffb8e6; color: #16112a; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`
- Selectors: :is(:is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"][data-slot="input-group"]) [data-align="inline-end"] [data-slot="button"]):focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0716 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states focus-visible; targets host.
- Declaration code: `border-color: #ff7fcf; outline: 2px solid #ff7fcf; outline-offset: 1px; color: #16112a`
- Selectors: :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > .vrcx-0-page-toolbar) [data-vrcx-0-control="toolbar"]:is(button,[data-slot="button"])):focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0717 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets host.
- Declaration code: `display: flex; flex: none; align-items: center; gap: 7px; color: #f2ebff; font-weight: 600; … (8 declarations)`
- Selectors: :is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .absolute > .flex.h-full.items-center.gap-3.px-1 > h2.text-muted-foreground
- Matched samples: （无直接源码候选）

### JCSS-0718 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets ::before.
- Declaration code: `content: ""; display: block; width: 6px; height: 6px; flex: none; border: 1px solid #6c5ce0; … (8 declarations)`
- Selectors: :is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .absolute > .flex.h-full.items-center.gap-3.px-1 > h2.text-muted-foreground::before
- Matched samples: （无直接源码候选）

### JCSS-0719 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets host.
- Declaration code: `height: 1px; flex: 1 1 0%; border: 0; background-color: transparent; background-image: repeating-linear-gradient(to right,#8c71b0 0 2px,transparent 2px 4px); opacity: 1`
- Selectors: :is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .absolute > .flex.h-full.items-center.gap-3.px-1 > [data-slot="separator"][data-orientation="horizontal"]
- Matched samples: （无直接源码候选）

### JCSS-0720 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background-color: #201936; color: #e3d2f5; box-shadow: inset 1px 1px rgb(253 244 255/.16),inset -1px -1px #7a3f6d; transition: transform 100ms steps(2,end),background-color 100ms steps(2,end),border-color 100ms steps(2,end),box-shadow 100ms steps(2,end)`
- Selectors: :is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row
- Matched samples: （无直接源码候选）

### JCSS-0721 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets host.
- Declaration code: `border-radius: 0; color: #f2ebff`
- Selectors: :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row) > .object-row__pressable
- Matched samples: （无直接源码候选）

### JCSS-0722 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets host.
- Declaration code: `width: 62px; height: 100%; flex: 0 0 62px; border-radius: 0; background-color: #16112a`
- Selectors: :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row) .object-row__media
- Matched samples: （无直接源码候选）

### JCSS-0723 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets host.
- Declaration code: `color: #f2ebff; font-weight: 600`
- Selectors: :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row) .object-row__title
- Matched samples: （无直接源码候选）

### JCSS-0724 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets host.
- Declaration code: `color: #d6b8ef; font-variant-numeric: tabular-nums`
- Selectors: :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row) .object-row__meta
- Matched samples: （无直接源码候选）

### JCSS-0725 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states focus-visible; targets host.
- Declaration code: `border-radius: 0; outline: 2px solid #ff7fcf; outline-offset: -3px; box-shadow: inset 0 0 0 2px #ff7fcf`
- Selectors: :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row) > .object-row__pressable:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0726 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets host.
- Declaration code: `border-color: transparent; border-radius: 0; background-color: transparent; color: #d6b8ef; box-shadow: none; opacity: 1; … (8 declarations)`
- Selectors: :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row) .object-row__context-action
- Matched samples: （无直接源码候选）

### JCSS-0727 — 0 element records / 0 source locations
- CSS blocks 2; sections browse-history-r9; states focus-visible, hover, focus; targets host.
- Declaration code: `z-index: 11; border-color: #ff6b8a; outline: 2px solid #ff7fcf; outline-offset: 1px; background-color: #ffb8e6; color: #16112a; … (9 declarations)`
- Selectors: :is(:is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row) .object-row__context-action):focus-visible / :is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"] .object-row:hover .object-row__context-action / :is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"] .object-row:focus-within .object-row__context-action / :is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"] .object-row .object-row__context-action:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0728 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states hover; targets host.
- Declaration code: `z-index: 11; border-color: #ff6b8a; background-color: #ffb8e6; color: #16112a; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d; opacity: 1; … (7 declarations)`
- Selectors: :is(:is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) .object-row):hover .object-row__context-action
- Matched samples: （无直接源码候选）

### JCSS-0729 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states hover; targets host.
- Declaration code: `transform: translateY(-1px); border-color: #ffb8e6; background-color: #2a2147; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d,2px 2px 0 #100b1e`
- Selectors: :is(:is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"]) :where(.object-row:hover)
- Matched samples: （无直接源码候选）

### JCSS-0730 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states base; targets host.
- Declaration code: `opacity: 0; pointer-events: none`
- Selectors: :is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"] .object-row .object-row__context-action
- Matched samples: （无直接源码候选）

### JCSS-0731 — 0 element records / 0 source locations
- CSS blocks 1; sections browse-history-r9; states hover, focus; targets host.
- Declaration code: `opacity: 1; pointer-events: auto`
- Selectors: :is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"] .object-row:hover .object-row__context-action / :is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"] .object-row:focus-within .object-row__context-action
- Matched samples: （无直接源码候选）

### JCSS-0732 — 0 element records / 0 source locations
- CSS blocks 2; sections browse-history-r9; states hover; targets host.
- Declaration code: `transform: none; box-shadow: inset 1px 1px rgb(253 244 255/.16),inset -1px -1px #7a3f6d`
- Selectors: :is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"] .object-row:hover / html.reduce-effects :is(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)) > [data-slot="tabs"] > [data-slot="tabs-content"] .object-row:hover
- Matched samples: （无直接源码候选）

### JCSS-0734 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: var(--jk-button-edge); background: var(--jk-button-default-face); color: var(--jk-button-default-text)`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="default"]:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0735 — 0 element records / 0 source locations
- CSS blocks 2; sections buttons-badges-r10, portal-button-roles-b073-b100; states hover+disabled; targets host.
- Declaration code: `background: var(--jk-button-default-hover); color: var(--jk-button-default-text)`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="default"]:hover:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="default"]:hover:not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0736 — 0 element records / 0 source locations
- CSS blocks 2; sections buttons-badges-r10, portal-button-roles-b073-b100; states base; targets host.
- Declaration code: `border-color: var(--jk-button-edge); background: var(--jk-button-face); color: var(--jk-button-text)`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="outline"]:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) / :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="secondary"]:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))):is([data-variant="outline"],[data-variant="secondary"])
- Matched samples: （无直接源码候选）

### JCSS-0737 — 0 element records / 0 source locations
- CSS blocks 3; sections buttons-badges-r10, portal-button-roles-b073-b100; states hover+disabled; targets host.
- Declaration code: `background: var(--jk-button-hover-face); color: var(--jk-button-hover-text)`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"]:is([data-variant="outline"],[data-variant="secondary"]):hover:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) / :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant="ghost"]:hover:not(:disabled) / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))):is([data-variant="outline"],[data-variant="secondary"]):hover:not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0739 — 0 element records / 0 source locations
- CSS blocks 2; sections buttons-badges-r10, portal-button-roles-b073-b100; states hover+disabled; targets host.
- Declaration code: `background: #392a52; color: #fff0fa; box-shadow: inset 1px 1px #6c5ce0,inset -1px -1px #16112a`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="ghost"]:hover:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action):not(.bg-red-50):not(.bg-amber-50):not(.bg-sky-50)) / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="ghost"]:hover:not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0740 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states hover+disabled; targets host.
- Declaration code: `box-shadow: inset 1px 1px #6c5ce0,inset -1px -1px #16112a`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="ghost"]:is(.bg-red-50,.bg-amber-50,.bg-sky-50):hover:where(:not(:disabled):not([aria-disabled="true"]))
- Matched samples: （无直接源码候选）

### JCSS-0741 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: var(--jk-button-danger-edge); background: var(--jk-button-danger-face); color: var(--jk-button-danger-text); box-shadow: inset 1px 1px var(--jk-button-default-face),inset -1px -1px #16112a`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="destructive"]:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0742 — 0 element records / 0 source locations
- CSS blocks 2; sections buttons-badges-r10, portal-button-roles-b073-b100; states hover+disabled, hover+focus-visible+disabled; targets host.
- Declaration code: `background: #ff6b8a; color: #16112a`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="destructive"]:hover:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="destructive"]:is(:hover,:focus-visible):not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0743 — 0 element records / 0 source locations
- CSS blocks 2; sections buttons-badges-r10, portal-button-roles-b073-b100; states base; targets host.
- Declaration code: `border: 0; background: transparent; color: #d6b8ef; box-shadow: none; text-decoration: underline dotted #8f7fe0; text-underline-offset: 4px`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="link"]:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="link"]
- Matched samples: （无直接源码候选）

### JCSS-0744 — 0 element records / 0 source locations
- CSS blocks 3; sections buttons-badges-r10, portal-button-roles-b073-b100; states hover+disabled; targets host.
- Declaration code: `color: #ffb8e6; text-decoration-color: #ffb8e6`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="link"]:hover:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="link"]:hover:not(:disabled):not([aria-disabled="true"]) / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-ui-role="text-link"]):hover:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0745 — 0 element records / 0 source locations
- CSS blocks 2; sections buttons-badges-r10; states active+disabled; targets host.
- Declaration code: `box-shadow: var(--jk-button-pressed); transform: translate(1px,1px)`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant]:active:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) / :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant]:active:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0747 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border: 1px solid var(--jk-button-edge); border-radius: 0; appearance: none; -webkit-appearance: none; box-shadow: var(--jk-button-bevel); transition: background-color 80ms steps(2,end),color 80ms steps(2,end),box-shadow 80ms steps(2,end)`
- Selectors: :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant]
- Matched samples: （无直接源码候选）

### JCSS-0748 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `background: var(--jk-button-default-face); color: var(--jk-button-default-text)`
- Selectors: :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant="default"]
- Matched samples: （无直接源码候选）

### JCSS-0749 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states hover+disabled; targets host.
- Declaration code: `background: var(--jk-button-default-hover)`
- Selectors: :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant="default"]:hover:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0750 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `background: var(--jk-button-face); color: var(--jk-button-text)`
- Selectors: :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant="outline"] / :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant="secondary"] / :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant="ghost"]
- Matched samples: （无直接源码候选）

### JCSS-0751 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: var(--jk-button-danger-edge); background: var(--jk-button-danger-face); color: var(--jk-button-danger-text)`
- Selectors: :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant="destructive"]
- Matched samples: （无直接源码候选）

### JCSS-0752 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states disabled; targets host.
- Declaration code: `opacity: .58; filter: grayscale(.65); cursor: not-allowed`
- Selectors: :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant]:is(:disabled,[aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0753 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-radius: 0; letter-spacing: 0; box-shadow: inset 1px 1px rgb(253 244 255/.28),inset -1px -1px rgb(22 17 42/.48)`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="badge"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action):not(.vrcx-0-titlebar *))
- Matched samples: （无直接源码候选）

### JCSS-0754 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: #6c5ce0; background: #ffb8e6; color: #16112a`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="badge"][data-variant="default"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action):not(.vrcx-0-titlebar *))
- Matched samples: （无直接源码候选）

### JCSS-0755 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: #8f7fe0; background: #332650; color: #f2ebff`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="badge"][data-variant="secondary"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action):not(.vrcx-0-titlebar *))
- Matched samples: （无直接源码候选）

### JCSS-0756 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: #ff6b8a; background: #3d1b35; color: #ffd9e4`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="badge"][data-variant="destructive"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action):not(.vrcx-0-titlebar *))
- Matched samples: （无直接源码候选）

### JCSS-0757 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: #8c71b0; background: #211a33; color: #e3d2f5`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="badge"][data-variant="outline"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action):not(.vrcx-0-titlebar *))
- Matched samples: （无直接源码候选）

### JCSS-0758 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: #6c5ce0; background: #211a33; color: #d6c8ee`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="badge"][data-variant="ghost"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action):not(.vrcx-0-titlebar *))
- Matched samples: （无直接源码候选）

### JCSS-0759 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: transparent; background: transparent; color: #d6b8ef; text-decoration: underline dotted`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="badge"][data-variant="link"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action):not(.vrcx-0-titlebar *))
- Matched samples: （无直接源码候选）

### JCSS-0760 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `background: #ffb8e6; color: #16112a; box-shadow: inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="pagination-link"]:is([data-active="true"],[aria-current="page"]):where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0761 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `gap: 2px; padding: 1px; border: 1px solid #6c5ce0; border-radius: 0; background: #201936; color: #e3d2f5; … (7 declarations)`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="tabs-list"]:where(:not(.vrcx-0-page-scaffold *):not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0762 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-radius: 0; background: #211a33; color: #f2ebff; box-shadow: none`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="tabs-list"]:where(:not(.vrcx-0-page-scaffold *):not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) > [data-slot="tabs-tab"]
- Matched samples: （无直接源码候选）

### JCSS-0763 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border: 1px solid #6c5ce0; border-radius: 0; background: #201936; color: #f2ebff; box-shadow: inset 1px 1px rgb(253 244 255/.2),inset -1px -1px #16112a`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="alert"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0764 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-color: #ff6b8a; background: #30182e; color: #ffd9e4`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="alert"].text-destructive:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0765 — 0 element records / 0 source locations
- CSS blocks 2; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-radius: 0; border-color: #6c5ce0; background: #201936; box-shadow: 0 0 0 1px #3d305e,3px 3px 0 #100b1e; backdrop-filter: none`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) div.bg-popover.text-popover-foreground:has(> span.text-muted-foreground.px-1\.5.font-medium.whitespace-nowrap.tabular-nums):has(> [data-slot="button"]):where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) / :where(.vrcx-0-main-content,.vrcx-0-side-panel) div.bg-popover.text-popover-foreground:has(> span.text-muted-foreground.px-2.font-medium.whitespace-nowrap.tabular-nums):has(> [data-slot="button"]):where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0766 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `border-radius: 0; background: #ffb8e6; color: #16112a; backdrop-filter: none; box-shadow: inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant][class~="bg-popover/95"][class~="backdrop-blur"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0767 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states hover+disabled; targets host.
- Declaration code: `background: #f37fc4; color: #16112a`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant][class~="bg-popover/95"][class~="backdrop-blur"]:hover:where(:not(:disabled):not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0768 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `background: repeating-linear-gradient(90deg,#8c71b0 0 1px,transparent 1px 3px)`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="separator"][data-orientation="horizontal"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0769 — 0 element records / 0 source locations
- CSS blocks 1; sections buttons-badges-r10; states base; targets host.
- Declaration code: `background: repeating-linear-gradient(180deg,#8c71b0 0 1px,transparent 1px 3px)`
- Selectors: :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="separator"][data-orientation="vertical"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- Matched samples: （无直接源码候选）

### JCSS-0770 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `--vrcx-0-table-header-surface: var(--wd-raised); --vrcx-0-table-header-foreground: var(--wd-text); --vrcx-0-table-row-hover-surface: #302650; --vrcx-0-table-row-selected-surface: var(--wd-select); --vrcx-0-table-row-selected-hover-surface: #58458f; --vrcx-0-table-row-expanded-surface: #332650; … (12 declarations)`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table)
- Matched samples: （无直接源码候选）

### JCSS-0771 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `color: var(--wd-text); background-color: var(--wd-raised); border-bottom-color: #70518f`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) :is(.vrcx-0-table-header, [data-slot="table-header"])
- Matched samples: （无直接源码候选）

### JCSS-0772 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-bottom-style: dotted; border-bottom-color: #70518f`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-header"] > tr
- Matched samples: （无直接源码候选）

### JCSS-0773 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `color: var(--wd-text); border-bottom-color: #70518f`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-head"]
- Matched samples: （无直接源码候选）

### JCSS-0774 — 0 element records / 0 source locations
- CSS blocks 2; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-top-style: dotted; border-top-color: #70518f; border-radius: 0; background-color: var(--wd-raised); color: var(--wd-text)`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-footer"] / :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:not(:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"], .favorites-body))) [data-slot="card-footer"]
- Matched samples: （无直接源码候选）

### JCSS-0775 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `color: var(--wd-muted)`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-caption"]
- Matched samples: （无直接源码候选）

### JCSS-0776 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states hover; targets host.
- Declaration code: `background-color: var(--vrcx-0-table-row-hover-surface)`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) :is([data-slot="table-row"], [data-vrcx-0-table-row]):hover:where(:not([data-state="selected"]):not([data-state="expanded"]):not(:has([aria-expanded="true"])))
- Matched samples: （无直接源码候选）

### JCSS-0777 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `background-color: var(--wd-select); background-image: linear-gradient(to right, var(--wd-square) 0 3px, transparent 3px); background-repeat: no-repeat; background-size: 100% 100%; color: var(--wd-text)`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-row"][data-state="selected"] / 
:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-vrcx-0-table-row][data-state="selected"]
- Matched samples: （无直接源码候选）

### JCSS-0778 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `box-shadow: inset 3px 0 var(--wd-square)`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-row"][data-state="selected"] > [data-slot="table-cell"]:first-child / 
:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-vrcx-0-table-row][data-state="selected"] > [data-slot="table-cell"]:first-child
- Matched samples: （无直接源码候选）

### JCSS-0779 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states hover; targets host.
- Declaration code: `background-color: var(--vrcx-0-table-row-selected-hover-surface)`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-row"][data-state="selected"]:hover / 
:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-vrcx-0-table-row][data-state="selected"]:hover
- Matched samples: （无直接源码候选）

### JCSS-0780 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `background-color: var(--vrcx-0-table-row-expanded-surface)`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) :is([data-slot="table-row"], [data-vrcx-0-table-row]):has([aria-expanded="true"]) / 
:where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) :is([data-slot="table-row"], [data-vrcx-0-table-row])[data-state="expanded"]
- Matched samples: （无直接源码候选）

### JCSS-0781 — 0 element records / 0 source locations
- CSS blocks 5; sections data-surfaces-r10; states focus-visible; targets host.
- Declaration code: `outline: 2px dashed var(--wd-pink); outline-offset: -2px`
- Selectors: :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) :is([data-slot="table-row"], [data-vrcx-0-table-row]):focus-visible / :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) [data-day]:focus-visible / :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) [data-slot="card"][data-size="sm"][class~="group/tile"][class~="rounded-object"]:focus-visible / 
:where(.vrcx-0-main-content > .vrcx-0-page-scaffold) button[data-slot="button"][class~="object-row"][class~="rounded-object"]:focus-visible / :where(.vrcx-0-main-content #instance-history-list) .group > button[aria-pressed]:focus-visible / … (6 selectors)
- Matched samples: （无直接源码候选）

### JCSS-0782 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; border-color: #70518f; color: var(--wd-text)`
- Selectors: :where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"]))
- Matched samples: （无直接源码候选）

### JCSS-0783 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-bottom: 1px dotted #70518f`
- Selectors: :where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"])) [data-slot="empty-header"]
- Matched samples: （无直接源码候选）

### JCSS-0784 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border: 1px solid var(--wd-frame); border-radius: 0; background: var(--wd-raised); color: var(--wd-square); box-shadow: inset 1px 1px rgb(253 244 255 / .16), inset -1px -1px #16112a`
- Selectors: :where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"])) [data-slot="empty-icon"][data-variant="icon"]
- Matched samples: （无直接源码候选）

### JCSS-0785 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `color: var(--wd-text); font-family: "WD Pixel CJK", var(--vrcx-app-font-family, system-ui), sans-serif; font-synthesis: none; text-wrap: pretty`
- Selectors: :where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"])) [data-slot="empty-title"]
- Matched samples: （无直接源码候选）

### JCSS-0786 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `color: var(--wd-muted); text-wrap: pretty`
- Selectors: :where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"])) [data-slot="empty-description"]
- Matched samples: （无直接源码候选）

### JCSS-0787 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; background-color: var(--wd-window); color: var(--wd-text); box-shadow: inset 0 0 0 1px var(--wd-frame)`
- Selectors: :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"])
- Matched samples: （无直接源码候选）

### JCSS-0788 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; color: var(--wd-text)`
- Selectors: :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) [data-day]
- Matched samples: （无直接源码候选）

### JCSS-0789 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; background-color: var(--wd-square); color: #16112a`
- Selectors: :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) [data-day][data-selected-single="true"] / 
:is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) [data-day][data-range-start="true"] / 
:is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) [data-day][data-range-end="true"]
- Matched samples: （无直接源码候选）

### JCSS-0790 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; background-color: var(--wd-select); color: var(--wd-text)`
- Selectors: :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) [data-day][data-range-middle="true"]
- Matched samples: （无直接源码候选）

### JCSS-0791 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `outline: 1px dashed var(--wd-pink); outline-offset: -2px`
- Selectors: :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) td[data-today="true"] > [data-day]:not([data-selected-single="true"]):not([data-range-start="true"]):not([data-range-end="true"])
- Matched samples: （无直接源码候选）

### JCSS-0792 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states disabled; targets host.
- Declaration code: `color: var(--wd-faint); opacity: .55`
- Selectors: :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) [data-day]:is(:disabled, [aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0793 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `background-color: var(--wd-frame); color: var(--wd-text)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:not(:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"], .favorites-body))) [data-slot="resizable-handle"]
- Matched samples: （无直接源码候选）

### JCSS-0794 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; z-index: 1; top: 50%; left: 50%; transform: translate(-50%, -50%); … (10 declarations)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:not(:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"], .favorites-body))) [data-slot="resizable-handle"]::before
- Matched samples: （无直接源码候选）

### JCSS-0795 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets ::before.
- Declaration code: `width: 16px; height: 3px; background: repeating-linear-gradient(to right, var(--wd-square) 0 2px, transparent 2px 4px)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:not(:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"], .favorites-body))) [data-slot="resizable-handle"][aria-orientation="horizontal"]::before
- Matched samples: （无直接源码候选）

### JCSS-0796 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states focus-visible; targets host.
- Declaration code: `outline: 2px dashed var(--wd-pink); outline-offset: 1px`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:not(:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"], .favorites-body))) [data-slot="resizable-handle"]:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0797 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; border-color: var(--jk-panel-edge); background-color: var(--wd-window); color: var(--wd-text); box-shadow: var(--jk-panel-raised); transition: border-color 100ms steps(2, end), background-color 100ms steps(2, end), box-shadow 100ms steps(2, end)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) [data-slot="card"][data-size="sm"][class~="group/tile"][class~="rounded-object"] / 
:where(.vrcx-0-main-content > .vrcx-0-page-scaffold) button[data-slot="button"][class~="object-row"][class~="rounded-object"]
- Matched samples: （无直接源码候选）

### JCSS-0798 — 0 element records / 0 source locations
- CSS blocks 2; sections data-surfaces-r10; states hover; targets host.
- Declaration code: `border-color: var(--wd-pink); background-color: var(--wd-raised)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) [data-slot="card"][data-size="sm"][class~="group/tile"][class~="rounded-object"]:hover / 
:where(.vrcx-0-main-content > .vrcx-0-page-scaffold) button[data-slot="button"][class~="object-row"][class~="rounded-object"]:hover / :where(.vrcx-0-main-content #chart) button.group.hover\:bg-accent.flex.w-full.items-center.rounded-lg.border:hover
- Matched samples: （无直接源码候选）

### JCSS-0799 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `--tw-ring-color: var(--wd-square); border-color: var(--wd-pink); background-color: var(--wd-select); color: var(--wd-text)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) [data-slot="card"][data-size="sm"][class~="group/tile"][class~="rounded-object"][class~="ring-2"] / 
:where(.vrcx-0-main-content > .vrcx-0-page-scaffold) button[data-slot="button"][class~="object-row"][class~="rounded-object"][class~="ring-2"]
- Matched samples: （无直接源码候选）

### JCSS-0800 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-color: var(--wd-frame); border-radius: 0; background-color: var(--wd-window); box-shadow: inset 1px 1px rgb(253 244 255 / .14), inset -1px -1px #16112a, 2px 2px 0 #100b1e`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) .group\/feed-column
- Matched samples: （无直接源码候选）

### JCSS-0801 — 0 element records / 0 source locations
- CSS blocks 2; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-bottom: 1px dotted #70518f; background-color: var(--wd-raised); color: var(--wd-text)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) .group\/feed-column-header / :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="collapsible"] > div.sticky.top-0)) [data-slot="collapsible"] > div.sticky.top-0.border-b
- Matched samples: （无直接源码候选）

### JCSS-0802 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-color: #70518f; border-radius: 0; background-color: #201936; color: var(--wd-muted)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) .group\/feed-column-header [class~="rounded-sm"]
- Matched samples: （无直接源码候选）

### JCSS-0803 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets ::after.
- Declaration code: `background-color: #f2c6e8; animation-timing-function: steps(4, end)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) .group\/feed-column .feed-column-row-new::after
- Matched samples: （无直接源码候选）

### JCSS-0804 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; background-color: rgb(22 17 42 / .88); backdrop-filter: none; -webkit-backdrop-filter: none`
- Selectors: :where(.vrcx-0-main-content) [data-testid="feed-image-drop-overlay"]
- Matched samples: （无直接源码候选）

### JCSS-0805 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; border-color: #70518f; background-color: var(--wd-window); box-shadow: inset 1px 1px rgb(253 244 255 / .14), inset -1px -1px #16112a`
- Selectors: :where(.vrcx-0-main-content) [data-testid="feed-image-drop-overlay"] [data-drop-target]
- Matched samples: （无直接源码候选）

### JCSS-0806 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states hover; targets host.
- Declaration code: `border-color: var(--wd-pink); background-color: var(--wd-select)`
- Selectors: :where(.vrcx-0-main-content) [data-testid="feed-image-drop-overlay"] [data-drop-target]:hover
- Matched samples: （无直接源码候选）

### JCSS-0807 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; border-color: var(--jk-panel-edge); background-color: var(--wd-window); box-shadow: var(--jk-panel-raised)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold.friend-view) [data-slot="card"][data-size="sm"]
- Matched samples: （无直接源码候选）

### JCSS-0808 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states hover, focus-visible; targets host.
- Declaration code: `border-color: var(--wd-pink)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold.friend-view) [data-slot="card"][data-size="sm"]:hover / 
:where(.vrcx-0-main-content > .vrcx-0-page-scaffold.friend-view) [data-slot="card"][data-size="sm"]:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0809 — 0 element records / 0 source locations
- CSS blocks 3; sections data-surfaces-r10; states focus-visible; targets host.
- Declaration code: `outline: 2px dashed var(--wd-pink); outline-offset: -3px`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold.friend-view) [data-slot="card"][data-size="sm"]:focus-visible / :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) .bg-card.relative.h-full.min-h-0.min-w-0.flex-1.overflow-hidden.rounded-lg.border > button[aria-pressed]:focus-visible / :where(.vrcx-0-main-content #chart) button.group.hover\:bg-accent.flex.w-full.items-center.rounded-lg.border:focus-visible
- Matched samples: （无直接源码候选）

### JCSS-0810 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border: 1px solid var(--wd-frame); border-radius: 0; background: var(--wd-window); box-shadow: inset 1px 1px rgb(253 244 255 / .14), 2px 2px 0 #100b1e`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold.friend-view) [data-slot="card"][data-size="sm"] > [data-dim-exempt]
- Matched samples: （无直接源码候选）

### JCSS-0811 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `background-color: var(--wd-select); box-shadow: inset 3px 0 var(--wd-square); border-radius: 0`
- Selectors: :where(.vrcx-0-main-content #instance-history-list) .group:has(> button[aria-pressed="true"])
- Matched samples: （无直接源码候选）

### JCSS-0812 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states hover; targets host.
- Declaration code: `background-color: var(--wd-raised); border-radius: 0`
- Selectors: :where(.vrcx-0-main-content #instance-history-list) .group:hover:not(:has(> button[aria-pressed="true"]))
- Matched samples: （无直接源码候选）

### JCSS-0813 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-color: var(--wd-frame); border-radius: 0; background: var(--wd-window); box-shadow: inset 1px 1px rgb(253 244 255 / .14), 2px 2px 0 #100b1e`
- Selectors: :where(.vrcx-0-main-content #instance-history-list) .group > div.bg-popover
- Matched samples: （无直接源码候选）

### JCSS-0814 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-color: var(--wd-frame); border-radius: 0; background-color: var(--wd-window); box-shadow: inset 1px 1px rgb(253 244 255 / .14), inset -1px -1px #16112a`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) section.bg-muted\/5.rounded-lg.border / 
:where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) .bg-card.relative.h-full.min-h-0.min-w-0.flex-1.overflow-hidden.rounded-lg.border
- Matched samples: （无直接源码候选）

### JCSS-0815 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-color: var(--wd-pink); background-color: var(--wd-select); box-shadow: inset 1px 1px rgb(253 244 255 / .14), inset -1px -1px #16112a, 0 0 0 2px var(--wd-square)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) .bg-card.relative.h-full.min-h-0.min-w-0.flex-1.overflow-hidden.rounded-lg.border:has(> button[aria-pressed="true"])
- Matched samples: （无直接源码候选）

### JCSS-0816 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-color: var(--wd-frame); border-radius: 0; background-color: var(--wd-window)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="dashboard-"])) [data-slot="resizable-panel-group"]
- Matched samples: （无直接源码候选）

### JCSS-0817 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-right-color: var(--wd-frame); background-color: var(--wd-raised)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold.group-moderation) .bg-muted\/30.w-60.border-r
- Matched samples: （无直接源码候选）

### JCSS-0818 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-bottom: 1px dotted #70518f; color: var(--wd-text)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold.group-moderation) .bg-muted\/30.w-60.border-r > .shrink-0.px-3.py-2\.5
- Matched samples: （无直接源码候选）

### JCSS-0819 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-color: #ff6b8a; border-radius: 0; background-color: rgb(255 107 138 / .12); color: #ffd9e5`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold.vrchat-log-page) .border-destructive\/40.bg-destructive\/10.rounded-md
- Matched samples: （无直接源码候选）

### JCSS-0820 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-color: var(--wd-frame); border-radius: 0; background-color: #16112a`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold.vrchat-log-page) .border-border.bg-background.relative.min-h-0.flex-1.overflow-hidden.rounded-md.border
- Matched samples: （无直接源码候选）

### JCSS-0821 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-color: var(--wd-frame); border-radius: 0; background-color: var(--wd-window); box-shadow: inset 1px 1px rgb(253 244 255 / .12), inset -1px -1px #16112a`
- Selectors: :where(.vrcx-0-main-content #chart) button.group.hover\:bg-accent.flex.w-full.items-center.rounded-lg.border
- Matched samples: （无直接源码候选）

### JCSS-0822 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `--act-track: #16112a; --act-axis: var(--wd-muted); --act-mark: var(--wd-pink); --act-mark-soft: rgb(255 127 207 / .42); --act-heat-empty: #201936; --act-heat-min: color-mix(in srgb, var(--wd-pink) 24%, var(--wd-raised)); … (11 declarations)`
- Selectors: :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="tabs-content"] > .activity-skin)) [data-slot="tabs-content"] > .activity-skin
- Matched samples: （无直接源码候选）

### JCSS-0823 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; transition: background-color 100ms steps(2, end)`
- Selectors: :where(.vrcx-0-main-content) .activity-skin [data-slot="button"].h-auto.w-full.justify-start.rounded-none
- Matched samples: （无直接源码候选）

### JCSS-0824 — 0 element records / 0 source locations
- CSS blocks 1; sections data-surfaces-r10; states hover; targets host.
- Declaration code: `background-color: var(--act-track); box-shadow: inset 3px 0 var(--wd-pink)`
- Selectors: :where(.vrcx-0-main-content .activity-skin) [data-slot="button"].h-auto.w-full.justify-start.rounded-none:hover
- Matched samples: （无直接源码候选）

### JCSS-0825 — 0 element records / 0 source locations
- CSS blocks 2; sections data-surfaces-r10; states base; targets host.
- Declaration code: `border-radius: 0; background-color: var(--wd-pink)`
- Selectors: :where(.vrcx-0-titlebar) span.h-\[2px\].rounded-full > span / :where(.vrcx-0-main-content #chart) > .relative .h-1.rounded-full > .bg-primary
- Matched samples: （无直接源码候选）

### JCSS-0826 — 0 element records / 0 source locations
- CSS blocks 1; sections banner-frame-r96; states base; targets host.
- Declaration code: `--r9-banner-stitch-opacity: .52; --r9-banner-hem-opacity: .96; --r96-banner-frame-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMjgiIGhlaWdodD0iMjQ4IiB2aWV3Qm94PSIwIDAgMzI4IDI0OCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48ZGVmcz48cGF0dGVybiBpZD0icGVyZnMiIHdpZHRoPSIxNiIgaGVpZ2h0PSI4IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmRmNGZmIi8+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iIzE2MTEyYSIvPjxyZWN0IHg9IjEwIiB5PSIxIiB3aWR0aD0iNCIgaGVpZ2h0PSI2IiBmaWxsPSIjZmY3ZmNmIi8+PHJlY3QgeD0iMTEiIHk9IjIiIHdpZHRoPSIyIiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmI4ZTYiLz48L3BhdHRlcm4+PHBhdHRlcm4gaWQ9InBlcmZzViIgd2lkdGg9IjgiIGhlaWdodD0iMTYiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZGY0ZmYiLz48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjMTYxMTJhIi8+PHJlY3QgeD0iMSIgeT0iMTAiIHdpZHRoPSI2IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZjdmY2YiLz48L3BhdHRlcm4+PC9kZWZzPjxwYXRoIGZpbGw9IiMxNjExMmEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyIDBIMzE2VjRIMzIwVjhIMzI0VjEySDMyOFYyMzZIMzI0VjI0MEgzMjBWMjQ0SDMxNlYyNDhIMTJWMjQ0SDhWMjQwSDRWMjM2SDBWMTJINFY4SDhWNEgxMlogTTEyIDhIMzE2VjEySDMyMFYxNkgzMjRWMjMySDMyMFYyMzZIMzE2VjI0MEgxMlYyMzZIOFYyMzJINFYxNkg4VjEySDEyWiIvPjxwYXRoIGQ9Ik0xMiA0SDMxNk0xMiAyNDRIMzE2TTQgMTJWMjM2TTMyNCAxMlYyMzYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZjNWNlMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iMTIiIHk9IjAiIHdpZHRoPSIzMDQiIGhlaWdodD0iOCIgZmlsbD0idXJsKCNwZXJmcykiLz48cmVjdCB4PSIxMiIgeT0iMjQwIiB3aWR0aD0iMzA0IiBoZWlnaHQ9IjgiIGZpbGw9InVybCgjcGVyZnMpIi8+PHJlY3QgeD0iMCIgeT0iMTIiIHdpZHRoPSI4IiBoZWlnaHQ9IjIyNCIgZmlsbD0idXJsKCNwZXJmc1YpIi8+PHJlY3QgeD0iMzIwIiB5PSIxMiIgd2lkdGg9IjgiIGhlaWdodD0iMjI0IiBmaWxsPSJ1cmwoI3BlcmZzVikiLz48ZyBmaWxsPSIjZmZiOGU2Ij48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTIiIGhlaWdodD0iNCIvPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjEyIi8+PHJlY3QgeD0iMzE2IiB5PSIwIiB3aWR0aD0iMTIiIGhlaWdodD0iNCIvPjxyZWN0IHg9IjMyNCIgeT0iMCIgd2lkdGg9IjQiIGhlaWdodD0iMTIiLz48cmVjdCB4PSIwIiB5PSIyNDQiIHdpZHRoPSIxMiIgaGVpZ2h0PSI0Ii8+PHJlY3QgeD0iMCIgeT0iMjM2IiB3aWR0aD0iNCIgaGVpZ2h0PSIxMiIvPjxyZWN0IHg9IjMxNiIgeT0iMjQ0IiB3aWR0aD0iMTIiIGhlaWdodD0iNCIvPjxyZWN0IHg9IjMyNCIgeT0iMjM2IiB3aWR0aD0iNCIgaGVpZ2h0PSIxMiIvPjwvZz48ZyBmaWxsPSIjZmRmNGZmIj48cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0Ii8+PHJlY3QgeD0iMzIwIiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0Ii8+PHJlY3QgeD0iNCIgeT0iMjQwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0Ii8+PHJlY3QgeD0iMzIwIiB5PSIyNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiLz48L2c+PGcgZmlsbD0iIzZjNWNlMCI+PHJlY3QgeD0iNSIgeT0iNSIgd2lkdGg9IjIiIGhlaWdodD0iMiIvPjxyZWN0IHg9IjMyMSIgeT0iNSIgd2lkdGg9IjIiIGhlaWdodD0iMiIvPjxyZWN0IHg9IjUiIHk9IjI0MSIgd2lkdGg9IjIiIGhlaWdodD0iMiIvPjxyZWN0IHg9IjMyMSIgeT0iMjQxIiB3aWR0aD0iMiIgaGVpZ2h0PSIyIi8+PC9nPjwvc3ZnPg==")`
- Selectors: .entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)
- Matched samples: （无直接源码候选）

### JCSS-0827 — 0 element records / 0 source locations
- CSS blocks 1; sections banner-frame-r96; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; inset: -4px; z-index: 20; pointer-events: none; background: var(--r96-banner-frame-image) center/100% 100% no-repeat; … (7 declarations)`
- Selectors: .entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)::before
- Matched samples: （无直接源码候选）

### JCSS-0828 — 0 element records / 0 source locations
- CSS blocks 1; sections banner-frame-r96; states base; targets ::before.
- Declaration code: `z-index: 21; background-color: #F3ADD9`
- Selectors: .entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)>[data-slot="button"][class*="aspect-[4/3]"]::before
- Matched samples: （无直接源码候选）

### JCSS-0829 — 0 element records / 0 source locations
- CSS blocks 1; sections banner-frame-r96; states base; targets ::after.
- Declaration code: `z-index: 22; background-color: #D97FC6`
- Selectors: .entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)>[data-slot="button"][class*="aspect-[4/3]"]::after
- Matched samples: （无直接源码候选）

### JCSS-0830 — 0 element records / 0 source locations
- CSS blocks 1; sections banner-frame-r96; states base; targets ::after.
- Declaration code: `z-index: 23`
- Selectors: .entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)>[data-slot="button"][class*="aspect-[4/3]"]>span.relative.size-full::after
- Matched samples: （无直接源码候选）

### JCSS-0831 — 0 element records / 0 source locations
- CSS blocks 1; sections privacy-lock-r96; states base; targets host.
- Declaration code: `border-radius: 2px; background-color: var(--wd-window, #201936); background-image: linear-gradient(to right, var(--wd-pink, #ff7fcf) 0 36px, var(--wd-frame, #6c5ce0) 36px 100%); background-position: top left; background-repeat: no-repeat; background-size: 100% 3px; … (8 declarations)`
- Selectors: [data-vrcx-0-surface="privacy-lock"] > div[class~="bg-popover/80"][class~="rounded-2xl"][class~="ring-1"]:is([class~="max-w-xs"], [class~="max-w-sm"])
- Matched samples: （无直接源码候选）

### JCSS-0832 — 0 element records / 0 source locations
- CSS blocks 1; sections privacy-lock-r96; states base; targets host.
- Declaration code: `font-family: "WD Pixel CJK", var(--vrcx-app-font-family, system-ui), sans-serif; font-synthesis: none`
- Selectors: [data-vrcx-0-surface="privacy-lock"] > div[class~="bg-popover/80"][class~="rounded-2xl"] > :is(h1, h2, h3)[class~="text-base"][class~="font-medium"]
- Matched samples: （无直接源码候选）

### JCSS-0833 — 0 element records / 0 source locations
- CSS blocks 1; sections privacy-lock-r96; states base; targets host.
- Declaration code: `border: 1px solid var(--jk-chrome-edge, #1a1226); border-radius: 0; background-image: none; box-shadow: inset -1px -1px 0 rgb(0 0 0 / .28)`
- Selectors: [data-vrcx-0-surface="privacy-lock"] span[class~="inline-block"][class~="size-2"][class~="rounded-full"]
- Matched samples: （无直接源码候选）

### JCSS-0834 — 0 element records / 0 source locations
- CSS blocks 1; sections privacy-lock-r96; states base; targets host.
- Declaration code: `border-color: var(--wd-pink, #ff7fcf); outline: 2px solid var(--wd-pink, #ff7fcf); outline-offset: 1px`
- Selectors: [data-vrcx-0-surface="privacy-lock"] [data-slot="input-otp-slot"][data-active="true"]
- Matched samples: （无直接源码候选）

### JCSS-0835 — 0 element records / 0 source locations
- CSS blocks 1; sections privacy-lock-r96; states base; targets host.
- Declaration code: `border: 1px solid var(--wd-frame, #6c5ce0); border-radius: 2px; background-color: var(--wd-pink, #ff7fcf); color: #16112a; box-shadow: 3px 3px 0 #100b1e, inset 0 1px 0 rgb(255 255 255 / 38%)`
- Selectors: [data-vrcx-0-surface="privacy-lock"] [data-slot="button"][data-variant="default"]
- Matched samples: （无直接源码候选）

### JCSS-0836 — 0 element records / 0 source locations
- CSS blocks 1; sections privacy-lock-r96; states hover+disabled; targets host.
- Declaration code: `border-color: var(--wd-pink, #ff7fcf); background-color: var(--wd-select, #4a3784); color: var(--wd-text, #f2ebff)`
- Selectors: [data-vrcx-0-surface="privacy-lock"] [data-slot="button"][data-variant="outline"]:hover:not(:disabled) / 
[data-vrcx-0-surface="privacy-lock"] [data-slot="button"][data-variant="default"]:hover:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0838 — 0 element records / 0 source locations
- CSS blocks 1; sections brand-heart-r97; states base; targets host.
- Declaration code: `background-image: var(--jk-r97-heart-s); background-size: 9px 7px; background-position: 1px 1px`
- Selectors: 0% / 20% / 100%
- Matched samples: （无直接源码候选）

### JCSS-0839 — 0 element records / 0 source locations
- CSS blocks 1; sections brand-heart-r97; states base; targets host.
- Declaration code: `background-image: var(--jk-r97-heart-m); background-size: 10px 8px; background-position: 1px 1px`
- Selectors: 40% / 80%
- Matched samples: （无直接源码候选）

### JCSS-0840 — 0 element records / 0 source locations
- CSS blocks 1; sections brand-heart-r97; states base; targets host.
- Declaration code: `background-image: var(--jk-r97-heart-l); background-size: 11px 9px; background-position: 0 0`
- Selectors: 60%
- Matched samples: （无直接源码候选）

### JCSS-0841 — 0 element records / 0 source locations
- CSS blocks 1; sections brand-heart-r97; states base; targets ::after.
- Declaration code: `top: calc(50% - 4px); right: -12px; width: 11px; height: 9px; transform: none; -webkit-mask: none; … (14 declarations)`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after
- Matched samples: （无直接源码候选）

### JCSS-0842 — 0 element records / 0 source locations
- CSS blocks 2; sections brand-heart-r97; states base; targets ::after.
- Declaration code: `animation: none !important; background-image: var(--jk-r97-heart-m) !important; background-size: 10px 8px !important; background-position: 1px 1px !important`
- Selectors: .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after / html.reduce-effects .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after
- Matched samples: （无直接源码候选）

### JCSS-0843 — 0 element records / 0 source locations
- CSS blocks 2; sections cat-motion-r96; states base; targets host.
- Declaration code: `transform: translate(0,0)`
- Selectors: 0% / 37% / 76% / 100% / 20%
- Matched samples: （无直接源码候选）

### JCSS-0844 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `transform: translate(0,-4px)`
- Selectors: 5% / 15%
- Matched samples: （无直接源码候选）

### JCSS-0845 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `transform: translate(0,-8px)`
- Selectors: 10%
- Matched samples: （无直接源码候选）

### JCSS-0846 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `transform: translate(-2px,-4px)`
- Selectors: 24%
- Matched samples: （无直接源码候选）

### JCSS-0847 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `transform: translate(-2px,-6px)`
- Selectors: 28%
- Matched samples: （无直接源码候选）

### JCSS-0848 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `transform: translate(-2px,-2px)`
- Selectors: 33%
- Matched samples: （无直接源码候选）

### JCSS-0849 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `transform: translate(2px,0)`
- Selectors: 68%
- Matched samples: （无直接源码候选）

### JCSS-0850 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `background-size: 16px 16px,18px 18px; background-position: 0 5px,24px 4px`
- Selectors: 0% / 30% / 78% / 100%
- Matched samples: （无直接源码候选）

### JCSS-0851 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `background-position: 0 5px,24px 2px`
- Selectors: 6% / 24%
- Matched samples: （无直接源码候选）

### JCSS-0852 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `background-position: 0 5px,24px 0`
- Selectors: 12%
- Matched samples: （无直接源码候选）

### JCSS-0853 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `background-position: 0 5px,24px 1px`
- Selectors: 18%
- Matched samples: （无直接源码候选）

### JCSS-0854 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `background-size: 14px 14px,18px 18px; background-position: 1px 6px,24px 4px`
- Selectors: 60% / 72%
- Matched samples: （无直接源码候选）

### JCSS-0855 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets host.
- Declaration code: `background-size: 16px 16px,18px 18px; background-position: 0 5px,25px 4px`
- Selectors: 66%
- Matched samples: （无直接源码候选）

### JCSS-0856 — 0 element records / 0 source locations
- CSS blocks 1; sections cat-motion-r96; states base; targets ::after.
- Declaration code: `opacity: 1; animation: r96-nav-cat 2s step-end infinite`
- Selectors: .vrcx-0-sidebar-surface [data-sidebar="content"]::after
- Matched samples: （无直接源码候选）

### JCSS-0859 — 0 element records / 0 source locations
- CSS blocks 1; sections dialog-header-r97; states base; targets host.
- Declaration code: `flex-direction: row; justify-content: space-between; gap: 8px; min-height: 30px; padding: 0 calc(var(--r9-dialog-inset,1rem) + 4px) 0 0; border-bottom: 1px solid var(--r9-dialog-frame); … (8 declarations)`
- Selectors: [data-slot$=dialog-content]:not(.entity-dialog):not(.owner-dialog)>[data-slot$=dialog-header]:not(.sr-only):is(.flex-row,:has(>:not([data-slot$=title],[data-slot$=description]) button))
- Matched samples: （无直接源码候选）

### JCSS-0860 — 0 element records / 0 source locations
- CSS blocks 1; sections dialog-header-r97; states base; targets host.
- Declaration code: `flex: 1 1 auto; min-width: 0; margin: 0; padding-inline: calc(var(--r9-dialog-inset,1rem) + 9px) 0; border: 0; background: none`
- Selectors: [data-slot$=dialog-content]:not(.entity-dialog):not(.owner-dialog)>[data-slot$=dialog-header]:not(.sr-only):is(.flex-row,:has(>:not([data-slot$=title],[data-slot$=description]) button))>[data-slot$=title]
- Matched samples: （无直接源码候选）

### JCSS-0861 — 0 element records / 0 source locations
- CSS blocks 1; sections dialog-header-r97; states base; targets host.
- Declaration code: `border-radius: 0; color: var(--r9-dialog-ink)`
- Selectors: [data-slot$=dialog-content]:not(.entity-dialog):not(.owner-dialog)>[data-slot$=dialog-header]:not(.sr-only):is(.flex-row,:has(>:not([data-slot$=title],[data-slot$=description]) button))>:not([data-slot$=title]) :is(button,.text-muted-foreground)
- Matched samples: （无直接源码候选）

### JCSS-0862 — 0 element records / 0 source locations
- CSS blocks 1; sections dialog-header-r97; states base; targets host.
- Declaration code: `border-radius: 1px; box-shadow: 0 0 0 1px var(--r9-dialog-ink)`
- Selectors: [data-slot$=dialog-content]:not(.entity-dialog):not(.owner-dialog)>[data-slot$=dialog-header]:not(.sr-only):is(.flex-row,:has(>:not([data-slot$=title],[data-slot$=description]) button))>:not([data-slot$=title]) .size-2.rounded-full
- Matched samples: （无直接源码候选）

### JCSS-0863 — 0 element records / 0 source locations
- CSS blocks 1; sections dialog-header-r97; states hover+focus-visible; targets host.
- Declaration code: `background: var(--r9-dialog-ink); color: var(--r9-dialog-pink)`
- Selectors: [data-slot$=dialog-content]:not(.entity-dialog):not(.owner-dialog)>[data-slot$=dialog-header]:not(.sr-only):is(.flex-row,:has(>:not([data-slot$=title],[data-slot$=description]) button))>:not([data-slot$=title]) button:is(:hover,:focus-visible,[aria-expanded=true],.bg-card)
- Matched samples: （无直接源码候选）

### JCSS-0864 — 0 element records / 0 source locations
- CSS blocks 1; sections loader-r97; states base; targets host.
- Declaration code: `--jk-dance: jk-loader-dance var(--jk-loader-duration) steps(var(--jk-loader-frames),end) infinite`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0865 — 0 element records / 0 source locations
- CSS blocks 1; sections loader-r97; states base; targets host.
- Declaration code: `display: block; flex: none; width: var(--jk-loader-frame-w); height: var(--jk-loader-frame-h); background: var(--jk-loader-sheet) 0 0/calc(var(--jk-loader-frame-w)*var(--jk-loader-frames)) var(--jk-loader-frame-h) no-repeat; image-rendering: pixelated; … (13 declarations)`
- Selectors: :is(div.justify-center:is(.gap-2,.flex-1):not([data-slot]),div[class="flex items-center justify-center"],.mt-\[100px\],.min-h-24.border-dashed,[data-slot=empty-header],[role=status].gap-3,td span.inline-flex.gap-2,.min-h-24>span.inline-flex.gap-2,[data-vrcx-0-surface=privacy-lock],[data-slot=empty]:not(.min-h-24,.min-h-0)>[data-slot=empty-content]>div)>svg:is([data-slot=spinner],.animate-spin) / .inset-0>svg.text-muted-foreground[data-slot=spinner] / svg.my-8[data-slot=spinner]
- Matched samples: （无直接源码候选）

### JCSS-0866 — 0 element records / 0 source locations
- CSS blocks 2; sections loader-r97; states base; targets host.
- Declaration code: `--jk-dance: none`
- Selectors: :root / html.reduce-effects
- Matched samples: （无直接源码候选）

### JCSS-0867 — 0 element records / 0 source locations
- CSS blocks 1; sections cards-r97; states base; targets host.
- Declaration code: `--jk-r97-card-charm: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 8' shape-rendering='crispEdges'><path fill='%2316112a' d='M2 0h12v1H2M1 1h1v1H1M8 1h1v6H8M14 1h1v1H14M0 2h1v4H0M15 2h1v4H15M1 6h1v1H1M14 6h1v1H14M2 7h12v1H2'/><path fill='%23ff7fcf' d='M2 1h1v1H2M5 1h3v1H5M1 2h1v1H1M3 2h5v1H3M1 3h7v2H1M1 5h6v1H1'/><path fill='%23fdf4ff' d='M3 1h2v1H3M9 1h5v4H9M2 2h1v1H2M9 5h4v1H9'/><path fill='%23cdb0e8' d='M14 2h1v3H14M13 5h2v1H13M9 6h5v1H9'/><path fill='%23d97fc6' d='M7 5h1v1H7M2 6h6v1H2'/></svg>"); --jk-r97-lace-px: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 8' shape-rendering='crispEdges'><path d='M0 0h16v3H0M1 3h14v1H1M1 4h6v1H1M9 4h6v1H9M2 5h5v1H2M9 5h5v1H9M3 6h10v1H3M5 7h6v1H5'/></svg>"); --jk-r97-lace: var(--jk-r97-lace-px) 0 0/16px 8px repeat-x; --jk-r97-lace-cut: polygon(0 2px,2px 2px,2px 0,calc(100% - 2px) 0,calc(100% - 2px) 2px,100% 2px,100% calc(100% - 2px),calc(100% - 2px) calc(100% - 2px),calc(100% - 2px) calc(100% + 8px),2px calc(100% + 8px),2px calc(100% - 2px),0 calc(100% - 2px))`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0868 — 0 element records / 0 source locations
- CSS blocks 1; sections cards-r97; states base; targets host.
- Declaration code: `clip-path: var(--jk-r97-lace-cut)`
- Selectors: :is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),.vrcx-0-main-content>[id=chart] [data-slot=tabs][data-orientation=vertical]:has(+div [data-tools-section]))>[data-slot=tabs-list]
- Matched samples: （无直接源码候选）

### JCSS-0869 — 0 element records / 0 source locations
- CSS blocks 1; sections cards-r97; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; left: 1px; right: 1px; top: calc(100% + 1px); bottom: auto; … (10 declarations)`
- Selectors: :is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),.vrcx-0-main-content>[id=chart] [data-slot=tabs][data-orientation=vertical]:has(+div [data-tools-section]))>[data-slot=tabs-list]::after
- Matched samples: （无直接源码候选）

### JCSS-0870 — 0 element records / 0 source locations
- CSS blocks 1; sections cards-r97; states base; targets host.
- Declaration code: `padding-bottom: 3px`
- Selectors: .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical])>[data-slot=tabs-list]
- Matched samples: （无直接源码候选）

### JCSS-0871 — 0 element records / 0 source locations
- CSS blocks 1; sections cards-r97; states base; targets host.
- Declaration code: `position: relative; border-radius: 0; background-color: #201936; box-shadow: none; clip-path: var(--jk-px-cut)`
- Selectors: [data-tools-section] [data-slot=card]
- Matched samples: （无直接源码候选）

### JCSS-0872 — 0 element records / 0 source locations
- CSS blocks 1; sections cards-r97; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; inset: 0; z-index: 2; border: 1px solid #6c5ce0; pointer-events: none`
- Selectors: [data-tools-section] [data-slot=card]::after
- Matched samples: （无直接源码候选）

### JCSS-0873 — 0 element records / 0 source locations
- CSS blocks 1; sections cards-r97; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; left: 7px; top: calc(50% - 8px); top: round(down,50% - 8px,1px); width: 24px; … (11 declarations)`
- Selectors: :is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),[data-tools-section]) [data-slot=card-header] [data-slot=collapsible-trigger]::before
- Matched samples: （无直接源码候选）

### JCSS-0874 — 0 element records / 0 source locations
- CSS blocks 1; sections cards-r97; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; left: 0; right: 0; top: calc(100% + 1px); height: 8px; … (9 declarations)`
- Selectors: :is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),[data-tools-section]) [data-slot=card-header]::after
- Matched samples: （无直接源码候选）

### JCSS-0876 — 0 element records / 0 source locations
- CSS blocks 1; sections splitter-r97; states base; targets host.
- Declaration code: `--jk-sl: #ff7fcf; --jk-sd: #fdf4ff`
- Selectors: [data-slot=resizable-handle]:is([data-separator=hover],[data-separator=active])
- Matched samples: （无直接源码候选）

### JCSS-0877 — 0 element records / 0 source locations
- CSS blocks 1; sections splitter-r97; states base; targets host.
- Declaration code: `--jk-sb: #ff7fcf; --jk-sd: #16112a`
- Selectors: [data-slot=resizable-handle][data-separator=active]
- Matched samples: （无直接源码候选）

### JCSS-0879 — 0 element records / 0 source locations
- CSS blocks 1; sections splitter-r97; states base; targets host.
- Declaration code: `box-shadow: 0 1px #16112a`
- Selectors: [data-slot=resizable-handle][aria-orientation=horizontal]:not(.bg-transparent)
- Matched samples: （无直接源码候选）

### JCSS-0880 — 0 element records / 0 source locations
- CSS blocks 2; sections splitter-r97, portal-button-roles-b073-b100; states base, disabled; targets host.
- Declaration code: `box-shadow: none`
- Selectors: [data-slot=resizable-handle].bg-transparent / :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="link"]:is(:disabled,[aria-disabled="true"],[data-disabled])
- Matched samples: （无直接源码候选）

### JCSS-0881 — 0 element records / 0 source locations
- CSS blocks 1; sections splitter-r97; states base; targets ::before.
- Declaration code: `left: calc(50% - 1px); translate: none`
- Selectors: [data-slot=resizable-handle].bg-transparent::before
- Matched samples: （无直接源码候选）

### JCSS-0884 — 0 element records / 0 source locations
- CSS blocks 1; sections language-badges-r98; states base; targets host.
- Declaration code: `border-color: #ff7fcf; border-radius: 0; background-color: #211a33; color: #ffd9ee; background-image: linear-gradient(90deg, #fff1f8 0 2px, #ff7fcf 2px 100%); background-size: 100% 2px; … (13 declarations)`
- Selectors: .vrcx-0-data-table td[data-slot="table-cell"]
  > div.flex.flex-wrap.items-center.gap-1
  > span[data-slot="tooltip-trigger"].inline-flex.h-5.min-w-8.items-center.justify-center.rounded.border.px-1.font-mono.text-\[10px\].leading-none.font-semibold
- Matched samples: （无直接源码候选）

### JCSS-0885 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets host.
- Declaration code: `--r10-toast-success-face-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAABP0lEQVRIie3WsWrCQBgH8HusPkSnrh18kA+LdHHwKUpx7SS4CC7FKS8gVJAOXUpSBCchnHxn/se/Z3JeEh0KDfzJl3h8P3MmOY3534wxMhjZMDeZGKma7/LtWa6KSwRqwnthu0jzx9mnS1mWvu6MygUsz148wnXnK5UW04gv0Hl6pSWmmT59uRQfha+lL7hZFhfB99effuCGEG2mx9iHdXgsXcCwOdIEru9nLjq1uk9CY+B+vnZhnAMQ+NXApuhvh/Fvd0MX7cl1LYjbnBtorU3x9rHfBx+cw3htbrPc2vHqrI6iIajnFWVMgyvUz3UmHDJe/Ur28NwetJPFKQGI83g0GFUoijHKDTxYIWjEKI+XwcghSRijDPINApCnMwRNdcMkYXVg3QLMqQNbb0BTXlcY23sxTl3Vb/q3w/y17QjDXyUWZSx1OwAAAABJRU5ErkJggg=="); --r10-toast-error-face-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAABEklEQVRIie3WQQrCMBAF0BzQG7gIeI2AeA53It6g4EYQwaUXqCiICzfSitCVUCoTOmUcm2batAvBwKdTbPPaGBOV+jellNGzgmeQgTFl58/k8pVecdMAuXB6v57s5A/RBnKhugS9sAQbR1ebPM+rmqOagU7YByaHRYXQmr+ploBdhhLQuqHVQ4Gr6c0mPaVVbULB8zb1gvvl4wNUkslDQYpAZ3COR17zc1Pzu/SCvHOMC4xHkQ0MLRxFi0ETeJxvbChOgyDiYhBnHXwXCEKNoCv0etNmqUO0Kwhv2wuYreOiuL+cwZnaGkSUduAD4bMgEBrcxEFX+AOaPsC6DZgmGKQoXz2arg3ejKW7+qB/O9SvtTd4eyFNZRXZ3gAAAABJRU5ErkJggg==")`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0886 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets host.
- Declaration code: `--r10-toast-success-ring-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAtUlEQVRIidXW0QnFIAwF0LuGS2Sm7OwgHcFHoQUJVxOLBt5HoNXQQxpRIbVgEiq1XFJLI3E981gJBKDZB5ZxfIRYhFAQbBVaQrERC6HoknZg8NC3ui89i6Bg4O7q8AQtYjjxr6BmgmDtOg02uxOdBmGq1UwQN5oNNtrY06Bm9hFdQ9MWDTafFhhh93M/eHIT1/edTW5bIEKOKZvk/Vp2mXKrkgnooXac5YVO/BHqXQttnnun+QH56DcU93KK1wAAAABJRU5ErkJggg=="); --r10-toast-error-ring-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAs0lEQVRIie2WSwoEIQxE66juvYmXmCPmCGmEbnBCaVRMw8AssjB+XqpECTQXDCJpLqK5KAm557ESmACNDliGYxPEou77NPtpEQy2CrKKYcZf4JMwrxCpnNaOKBha2x91O3e2pRQvqsMDfEsd/kD8oqXKnkU0UOzDjwSKzdHkQXWJAaN+GmX5rvRoYAqA6ggYYa16wNPWygzQs5Y1Uz1YmgF6UJtn64YNVU8Jaw/ZQXad271doLh4+prx93AAAAAASUVORK5CYII=")`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0887 — 0 element records / 0 source locations
- CSS blocks 2; sections status-icons-r10; states base; targets host.
- Declaration code: `box-sizing: content-box; display: flex; flex: 0 0 75.6px; width: 75.6px; min-width: 75.6px; position: relative; … (7 declarations)`
- Selectors: [data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"] / 
[data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"] / [data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"] / 
[data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]
- Matched samples: （无直接源码候选）

### JCSS-0888 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; left: 50%; top: 50%; width: 75.6px; height: 64.8px; … (12 declarations)`
- Selectors: [data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::before / 
[data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::before
- Matched samples: （无直接源码候选）

### JCSS-0890 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::before.
- Declaration code: `background-size: 75.6px 64.8px; image-rendering: pixelated`
- Selectors: [data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::before / 
[data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::before
- Matched samples: （无直接源码候选）

### JCSS-0891 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::before.
- Declaration code: `background-image: var(--r10-toast-success-ring-png)`
- Selectors: [data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::before
- Matched samples: （无直接源码候选）

### JCSS-0892 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::before.
- Declaration code: `background-image: var(--r10-toast-error-ring-png)`
- Selectors: [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::before
- Matched samples: （无直接源码候选）

### JCSS-0893 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; left: 50%; top: 50%; width: 75.6px; height: 64.8px; … (12 declarations)`
- Selectors: [data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::after / 
[data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::after
- Matched samples: （无直接源码候选）

### JCSS-0894 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::after.
- Declaration code: `background-image: var(--r10-toast-success-face-png)`
- Selectors: [data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::after
- Matched samples: （无直接源码候选）

### JCSS-0895 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::after.
- Declaration code: `background-image: var(--r10-toast-error-face-png)`
- Selectors: [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::after
- Matched samples: （无直接源码候选）

### JCSS-0896 — 0 element records / 0 source locations
- CSS blocks 2; sections status-icons-r10; states base; targets host.
- Declaration code: `opacity: 0 !important`
- Selectors: [data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"] > svg / 
[data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"] > svg / [data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"] > svg / 
[data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"] > svg
- Matched samples: （无直接源码候选）

### JCSS-0897 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets host.
- Declaration code: `--r10-toast-shock-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAABPUlEQVRIie2WsWrDMBCG9Vp9h05dO3TrC3QUlJKlz1FCOnQ2dMjQpaNfwJBAHEiWEpdCpoBR+EV/caiyckXOUOjBj09n+T75JEs25t+MMfbmwcU6S2Hsd/Kv3eqHRoXbDGgInsrTPl84KgvLJb+u1l593wc/BW3HgO3qpwCRfvymrQamAaYGoC1vMQya3W+9ukUXfFsKXL51J4Hv088ksM2VVgIlBMnQ5jX247bVzqMExsmpIWBzWXmhtLiqypoD7l8bLwmXIpDwYiA3AoKlEMfcxSU9aejIZS4TwF9vVu727sUncx+HILQRZ38O7lcfPqAp4OOs8ZJAxrhSJVAFHQJiG5svnZcEMjYEVBnnhAngY64kSAr3ioAwPBQDqfpqEiQXzahAmziApYqBEqrZH9m3+DDWnupn/e0wf82OYBkkii6CAXMAAAAASUVORK5CYII="); --r10-toast-shock-ring-mask: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABgCAYAAADm4nCVAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAB3UlEQVR4nO3aMY7DMAxEUd7/0pMmVYoYgmhqxv6vXqwofSjJrlM1TGYKBHwVmSkQ8FHcb4C4sb0H5D7f6XnHaZH7fKfnHadF7vOdnredFlU4Le5Pw9o3tL2AGS3uT8PaN7S9gBkt7k/D2je0vYAZLe5Pw9o38HTqPuDN9bcHrpcRAbOJgNnkHpCXzDXTbykEbEbAcOIGZpN7wLsHwhoChiNgOAI+LSB/93m77ENAbwQMR8C3BTw98NtpEQHNEDAcAcMR8OF4DwxHwHAEDEfAcAQMR8BwBAxHwHAEDEfAcAQMR8AwPA8MR8BwBAxHwPAHtpffWbr8AbQiYDhxA7OJgO8ivheajYDhCBiOgA/DP7PDETAcAcMRMBwBwxEwHAGfHpDHS94IGI6A4QgYjq9YhD3AXf6MwoeYXgQMJ25gNp0OyEvqnvHzI2AvAoYTNzCbpgNeDXB8oDA6fV4E3EPAcOIGZtPpgPYDmbM7L7uBzNmdl91A5uzOy24gc3bndfrPCjWr4fm614sbsK3c1/R83evFDahmNTxf93pxA7aV+5qer9xMD7z7+9U8X1ywXwT8r9xdzM8NdEfA/yqNhpXZfJXu7gPaPTCZzWPn7gPaPTCZzWPn7gPaPTCZzbPrAyVApOVXHmSVAAAAAElFTkSuQmCC")`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0898 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::before.
- Declaration code: `content: ""; position: absolute; left: 50%; top: 50%; width: 75.6px; height: 64.8px; … (8 declarations)`
- Selectors: [data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"]::before / 
[data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]::before
- Matched samples: （无直接源码候选）

### JCSS-0899 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::after.
- Declaration code: `content: ""; position: absolute; left: 50%; top: 50%; width: 75.6px; height: 64.8px; … (10 declarations)`
- Selectors: [data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"]::after / 
[data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]::after
- Matched samples: （无直接源码候选）

### JCSS-0900 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets host.
- Declaration code: `--r10-toast-info-ring-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAuUlEQVRIid2WQQ7EIAhF/8nribwBd/EiJDaZjAnpIKhhWHTBomJ8/k+DoNcGI0qvjXptrAR989gJLICsA7bhOARpIaFFceaT12C7oCf0Ms6hSJi0GbOcvFkEDJ4DQ91JzY5qjCR1LIEZ6iAtzQTyqxVSRg1ZxDVa26sUQqthVpfB+EuzOg1k8/6HSraep8jXAgL4sy4/oq1lDxhtLa0APWu1YWoGKytAD/pc1/aZA9VMyXQIcva509sN2LAGU+4btdMAAAAASUVORK5CYII="); --r10-toast-warning-ring-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAuUlEQVRIid2WQQ7EIAhFf+K1Tb0YF/IOLJpMxoR0ENQwLLpgUTE+/6dB0GuBEa3XQr0WVoK+eewEFkDWAdtwHIK0kNCmOPPJa7Bd0BN6GedQJEzajFlO3iwCBs+Boe6kZkc1RpI6lsAMdZCWZgL51Qopo4Ys4hqt7VUKodUwq8tg/KVZnQayef9DJVvPU+RrAQH8WZcf0dayB4y2llaAnrXaMDWDtRWgB32ua/vMgWqmZDoEOfvc6e0GTu4KRqxySbcAAAAASUVORK5CYII=")`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0901 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::before.
- Declaration code: `-webkit-mask: none; mask: none; background-color: transparent; background-image: var(--r10-toast-info-ring-png); background-position: center; background-repeat: no-repeat; … (8 declarations)`
- Selectors: [data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"]::before
- Matched samples: （无直接源码候选）

### JCSS-0902 — 0 element records / 0 source locations
- CSS blocks 1; sections status-icons-r10; states base; targets ::before.
- Declaration code: `-webkit-mask: none; mask: none; background-color: transparent; background-image: var(--r10-toast-warning-ring-png); background-position: center; background-repeat: no-repeat; … (8 declarations)`
- Selectors: [data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]::before
- Matched samples: （无直接源码候选）

### JCSS-0903 — 0 element records / 0 source locations
- CSS blocks 1; sections nav-phone-r10; states base; targets host.
- Declaration code: `--r10-phone-gaze-mid-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAYAAACzzX7wAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAPElEQVQImWOojm/4n1a8Coy/bL8JxshiDI+ePvjfvvQmGP9//QuOYWJgBbvv/gdjZAUwMYa/f/+iSKBjAFkPbfLX39LgAAAAAElFTkSuQmCC"); --r10-phone-gaze-forward-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAYAAACzzX7wAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAARElEQVQImWOojm/4n1a86n9kyuT/X7bfBGNkMYZHTx/8b1968395z6H//1//gmOYGFjB7rv/wRhZAUyM4e/fvygS6BgABRFtDO096wwAAAAASUVORK5CYII="); --r10-phone-char-back-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAOVBMVEX48PpbtOJmc6p7X4CHpdmlfua73f/Eo+/ZTLTdv+7i5eDqUnbtzKHu3O7x7eD0t9n9/f3/e6//6/qEwD3sAAAAAXRSTlMAQObYZgAAALBJREFUeNpVkY0OwiAMhI/S6eI0e//HNG46x2i1hQ09khK+/kCOgKJoIddDqGiwba48NOSac4GxogfGO25G6WACbACGaJWx9ULIJ/Avwxv9Amt3pR2vFthIB0lCEGIIY3Uoya8p79ZOHZp6LJ4J9oQdTsDVAjFSJogVyFk1xlHVyym/yjiiEgSt/bR5BloNiZa/uHfIT8KW2dyiw8uJgL/bm9iLuLlOWy7foL4Kk2/2A6G2RQ0tdWSWAAAAAElFTkSuQmCC"); --r10-phone-front-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAMCAMAAACZS1ciAAAAOVBMVEX48PpbtOJmc6p7X4CHpdmlfua73f/Eo+/ZTLTdv+7i5eDqUnbtzKHu3O7x7eD0t9n9/f3/e6//6/qEwD3sAAAAAXRSTlMAQObYZgAAACxJREFUeNpjYGBmBiEmBgYOZg4GBkZmBjBgYeADUZ9YGBh+gRhMEGGiaZg5AI2eAjg3jxg8AAAAAElFTkSuQmCC"); --r10-phone-glow-dim-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAiElEQVQoka2SMQ6AIAxFexvP4Ak8ADszKzPH8l6MxMEEA6FN/aG4OLzlt48vBsql0oTNQHYsYTeQA1DihcNADrAkl0v1gNMyim2gvyIMdNZllLiJrrueudSo4Kw3o+ihISk48ysxgpRGFn4RaXJHljUta3tyR2z9egDyV3UrD2fP8FViDVZi5wEUSjRIvXPXfgAAAABJRU5ErkJggg=="); --r10-phone-glow-bright-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAiUlEQVQoka2SwQ2AIAxFO5ZrOIMjsAELsAALsBwXE+LBBAOhTf2hePHwLr99fDFQLpUmbAayYwm7gRyAEi8cBnKAJblcqgecllFsA/0VYaCzLqPETXTd9cylRgVnvRlFDw1JwZlfiRGkNLLwi0iTO7KsaVnbkzti69cDkL+qW3k4e4avEmuwEjsP/y1DgjLYhIEAAAAASUVORK5CYII="); … (36 declarations)`
- Selectors: :root
- Matched samples: （无直接源码候选）

### JCSS-0904 — 0 element records / 0 source locations
- CSS blocks 1; sections nav-phone-r10; states base; targets ::after.
- Declaration code: `content: ""; display: block; position: absolute; top: 0; right: 12px; width: var(--r10-phone-canvas-width); … (14 declarations)`
- Selectors: [data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]::after
- Matched samples: （无直接源码候选）

### JCSS-0905 — 0 element records / 0 source locations
- CSS blocks 17; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-stop); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 0% / 5.882352941% / 7.189542484% / 14.379084967% / 18.954248366% / … (17 selectors)
- Matched samples: （无直接源码候选）

### JCSS-0906 — 0 element records / 0 source locations
- CSS blocks 9; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-tap); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 5.22875817% / 6.535947712% / 22.222222222% / 35.294117647% / 46.405228758% / … (9 selectors)
- Matched samples: （无直接源码候选）

### JCSS-0907 — 0 element records / 0 source locations
- CSS blocks 10; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-dim); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 10.45751634% / 12.418300654% / 17.647058824% / 38.562091503% / 41.830065359% / … (10 selectors)
- Matched samples: （无直接源码候选）

### JCSS-0908 — 0 element records / 0 source locations
- CSS blocks 5; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-bright); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 11.764705882% / 40.522875817% / 52.941176471% / 83.006535948% / 93.464052288%
- Matched samples: （无直接源码候选）

### JCSS-0909 — 0 element records / 0 source locations
- CSS blocks 3; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-up); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 25.490196078% / 31.37254902% / 75.816993464%
- Matched samples: （无直接源码候选）

### JCSS-0910 — 0 element records / 0 source locations
- CSS blocks 3; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-look); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 26.14379085% / 30.065359477% / 76.470588235%
- Matched samples: （无直接源码候选）

### JCSS-0911 — 0 element records / 0 source locations
- CSS blocks 2; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-look-bright); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 29.411764706% / 81.699346405%
- Matched samples: （无直接源码候选）

### JCSS-0912 — 0 element records / 0 source locations
- CSS blocks 3; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-dim-tap); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 39.869281046% / 84.967320261% / 92.810457516%
- Matched samples: （无直接源码候选）

### JCSS-0913 — 0 element records / 0 source locations
- CSS blocks 1; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-look-dim); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 81.045751634%
- Matched samples: （无直接源码候选）

### JCSS-0914 — 0 element records / 0 source locations
- CSS blocks 1; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-up-bright); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 82.352941176%
- Matched samples: （无直接源码候选）

### JCSS-0915 — 0 element records / 0 source locations
- CSS blocks 1; sections nav-phone-r10; states base; targets host.
- Declaration code: `background-position: var(--r10-phone-nav-state-bright-tap); background-size: var(--r10-phone-nav-size); animation-timing-function: steps(1, end)`
- Selectors: 96.732026144%
- Matched samples: （无直接源码候选）

### JCSS-0916 — 0 element records / 0 source locations
- CSS blocks 1; sections nav-phone-r10; states base; targets host.
- Declaration code: `transform: translateY(-1px)`
- Selectors: 50%
- Matched samples: （无直接源码候选）

### JCSS-0917 — 0 element records / 0 source locations
- CSS blocks 2; sections nav-phone-r10; states base; targets ::after.
- Declaration code: `animation: none !important; background-position: var(--r10-phone-nav-state-stop)`
- Selectors: [data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]::after / html.reduce-effects [data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]::after
- Matched samples: （无直接源码候选）

### JCSS-0919 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states base; targets host.
- Declaration code: `border-color: var(--jk-button-edge); background: var(--jk-button-default-face); color: var(--jk-button-default-text); --jk-portal-open-face: var(--jk-button-default-hover); --jk-portal-open-text: var(--jk-button-default-text)`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="default"]
- Matched samples: （无直接源码候选）

### JCSS-0920 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states base; targets host.
- Declaration code: `background: transparent; color: #e3d2f5; box-shadow: none; --jk-portal-open-face: #392a52; --jk-portal-open-text: #fff0fa`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="ghost"]
- Matched samples: （无直接源码候选）

### JCSS-0921 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states base; targets host.
- Declaration code: `color: #ffb8e6`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="ghost"].text-primary
- Matched samples: （无直接源码候选）

### JCSS-0922 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states hover+disabled; targets host.
- Declaration code: `color: var(--jk-button-danger-text)`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="ghost"][class~="hover:text-destructive"]:hover:not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0923 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states base; targets host.
- Declaration code: `border-color: var(--jk-button-danger-edge); background: var(--jk-button-danger-face); color: var(--jk-button-danger-text); box-shadow: inset 1px 1px var(--jk-button-default-face),inset -1px -1px #16112a; --jk-portal-open-face: #ff6b8a; --jk-portal-open-text: #16112a`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))[data-variant="destructive"]
- Matched samples: （无直接源码候选）

### JCSS-0924 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states disabled; targets host.
- Declaration code: `background: var(--jk-portal-open-face); color: var(--jk-portal-open-text); box-shadow: var(--jk-button-pressed)`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))):not([data-variant="link"]):is([aria-expanded="true"],[aria-pressed="true"],[data-pressed],[data-popup-open]):not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0925 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states active+disabled; targets host.
- Declaration code: `box-shadow: var(--jk-button-pressed); translate: none; transform: translate(1px,1px)`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))):not([data-variant="link"]):active:not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0926 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states active+disabled; targets host.
- Declaration code: `transform: none; translate: none`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))):is(.rounded-r-none.border-r-0,.rounded-l-none):active:not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0927 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states disabled; targets host.
- Declaration code: `cursor: not-allowed; filter: grayscale(.65); opacity: .58; box-shadow: inset 1px 1px rgb(253 244 255/.24),inset -1px -1px #16112a; transform: none; translate: none`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:where(:not([data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))):is(:disabled,[aria-disabled="true"],[data-disabled])
- Matched samples: （无直接源码候选）

### JCSS-0928 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states hover+focus-visible+disabled; targets host.
- Declaration code: `background: #392a52; color: #fff0fa; box-shadow: inset 2px 0 #ff7fcf`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:is(.h-auto.justify-start,[data-ui-role="choice-list"] button):not([data-ui-role="tile"],.rounded-object,.rounded-full):where(:not(.p-0):not(:has(img)))):is(:hover,:focus-visible):not(:disabled):not([aria-disabled="true"]):not([aria-current="true"]):not([aria-pressed="true"]):not([data-variant="secondary"]):not(.border-primary)
- Matched samples: （无直接源码候选）

### JCSS-0929 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states active+disabled; targets host.
- Declaration code: `outline: 1px solid #8f7fe0; outline-offset: -1px`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:is(.h-auto.justify-start,[data-ui-role="choice-list"] button):not([data-ui-role="tile"],.rounded-object,.rounded-full):where(:not(.p-0):not(:has(img)))):active:not(:disabled):not([aria-disabled="true"])
- Matched samples: （无直接源码候选）

### JCSS-0930 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states disabled; targets host.
- Declaration code: `filter: grayscale(.65); opacity: .58`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-variant]:is(.h-auto.justify-start,[data-ui-role="choice-list"] button):not([data-ui-role="tile"],.rounded-object,.rounded-full):where(:not(.p-0):not(:has(img)))):is(:disabled,[aria-disabled="true"],[data-disabled])
- Matched samples: （无直接源码候选）

### JCSS-0931 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states base; targets host.
- Declaration code: `border: 0; border-radius: 0; background: transparent; color: #d6b8ef; box-shadow: none; text-decoration: underline dotted #8f7fe0; … (7 declarations)`
- Selectors: :is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-ui-role="text-link"]
- Matched samples: （无直接源码候选）

### JCSS-0932 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states active+disabled; targets host.
- Declaration code: `color: #fdf4ff`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-ui-role="text-link"]):active:not(:disabled)
- Matched samples: （无直接源码候选）

### JCSS-0933 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states disabled; targets host.
- Declaration code: `opacity: .58`
- Selectors: :is(:is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button[data-ui-role="text-link"]):disabled
- Matched samples: （无直接源码候选）

### JCSS-0934 — 0 element records / 0 source locations
- CSS blocks 1; sections portal-button-roles-b073-b100; states base; targets host.
- Declaration code: `border-radius: 0; box-shadow: none`
- Selectors: :is(:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"])) button:is([data-ui-role="disclosure"],[data-slot="collapsible-trigger"],.h-auto.justify-between):not([data-size^="icon"])
- Matched samples: （无直接源码候选）
