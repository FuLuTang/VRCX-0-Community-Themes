# 元素 × 上下文 样式覆盖矩阵 (current-compiled-button)

> 生成：`audit.mjs`；源码 `/home/fulutang/Documents/Github/VRCX-0-jirai/src`（578 个文件，1305 处原语使用点）；主题 `/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`；4236 条 CSS 规则。
> ✓ 已主题（所有使用点的“形状属性”均相对无主题基线变化，且变化集合覆盖规范主题实例）  ✗ 缝隙（使用点上未主题化/部分主题化）  – 该上下文无使用点（`–†` = 无使用点但夹具里同样未主题化，潜在缝隙）

| 原语 \ 上下文 | main-content | main-toolbar | graph-floating-controls | main-card-sm | side-panel | settings-vertical-tabs | entity-dialog | dialog | popover | menu-popup | login-page | privacy-lock | toast | app-chrome |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| button | ✓ (242) | ✓ (13) ≠规范 | ✓ (4) ≠规范 | ✓ (2) ≠规范 | ✓ (9) | ✓ (60) ≠规范 | ✓ (83) ≠规范 | ✓ (265) ≠规范 | ✓ (24) ≠规范 | ✓ (1) ≠规范 | ✓ (13) ≠规范 | ✓ (5) ≠规范 | – | ✓ (27) ≠规范 |

括号内为静态扫描到的使用点数（`✗ a/b` = b 个使用点中 a 个有缝隙）；`≠规范` = 已主题化但与规范实例有属性差异（多为专用调色板/斜面变体，详见 table.json）；`○` = 主题对该原语的形状完全没有任何规则（全局未覆盖）。

## 缝隙清单（按严重度）

（已有使用点的上下文中没有 ✗）

### 潜在缝隙（该上下文今天无使用点，夹具里同样未主题化；未来出现使用点即成 ✗）

（无）

## 排除子句有效性（`:not(<clause>)` 在夹具各场景中是否真能命中）

| 子句 | 涉及规则数 | 所在段 | 夹具命中场景 |
|---|---|---|---|
| `.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relativ` | 7 | fields-toolbar-r10 | **无 —— 夹具已按真实 DOM 构造该场景（scaffold > Tabs root > TabsList.w-44），仍不命中：`>` 直接子代写法使该子句在真实 DOM 下永不生效** |
| `article[data-slot="card"][data-size="sm"] *` | 39 | buttons-badges-r10 | main-card-sm |
| `[class~="bg-popover/70"] *` | 39 | buttons-badges-r10 | graph-floating-controls, menu-popup |
| `.vrcx-0-page-toolbar *` | 39 | buttons-badges-r10 | main-toolbar |
| `[data-vrcx-0-surface="login-page"] *` | 1 | fields-toolbar-r10 | login-page |
| `.vrcx-0-titlebar *` | 7 | buttons-badges-r10 | app-chrome |
| `.entity-dialog *` | 4 | form-controls-r9 | entity-dialog |
| `.vrcx-0-page-scaffold *` | 4 | buttons-badges-r10 | main-content, main-toolbar, graph-floating-controls, main-card-sm, settings-vertical-tabs |

## 使用点（静态扫描）

### button
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `app/router.tsx:43` | main-content ← default: routed page / shared component | <Button> variant=outline size=sm |
| `components/UserDetailTile.tsx:87` | main-content ← default: routed page / shared component | <Button> variant=ghost class="h-auto min-w-0 justify-start gap-2 px-1.5 py-1.5 text-left font-normal ⟨dynamic⟩" |
| `components/about/AboutDialog.tsx:268` | dialog ← inside <DialogContent> (L214, portal, not .entity-dialog) | <Button> variant=outline size=sm class="text-muted-foreground hover:text-foreground" |
| `components/about/AboutDialog.tsx:287` | dialog ← inside <DialogContent> (L214, portal, not .entity-dialog) | <Button> variant=ghost size=sm class="text-muted-foreground/70 hover:text-foreground h-7 px-2 text-[11.5px] font-medium" |
| `components/about/AboutDialog.tsx:298` | dialog ← inside <DialogContent> (L214, portal, not .entity-dialog) | <Button> variant=ghost size=sm class="text-muted-foreground/70 hover:text-foreground h-7 px-2 text-[11.5px] font-medium" |
| `components/data-table/DataTableColumnResizeHandle.tsx:83` | main-content ← default: routed page / shared component | <Button> variant=ghost class="vrcx-0-column-resize absolute top-0 right-0 h-full w-1.5 cursor-col-resize touch-none roun…" |
| `components/data-table/DataTableSortButton.tsx:70` | main-content ← default: routed page / shared component | <Button> variant=ghost size=sm class="text-muted-foreground hover:text-foreground h-auto min-w-0 justify-start gap-1 p-0 text-le…" |
| `components/data-table/DataTableView.tsx:520` | main-content ← default: routed page / shared component | <Button> variant=ghost size=sm class="vrcx-0-quiet-control" |
| `components/data-table/DataTableView.tsx:540` | main-content ← default: routed page / shared component | <Button> variant=ghost size=sm class="vrcx-0-quiet-control" |
| `components/data-table/ResizableTableParts.tsx:143` | main-content ← default: routed page / shared component | <Button> variant=ghost size=icon-xs class="shrink-0 cursor-grab opacity-0 group-hover:opacity-100 active:cursor-grabbing" |
| `components/data-table/ResizableTableParts.tsx:158` | main-content ← default: routed page / shared component | <Button> variant=ghost class="vrcx-0-column-resize absolute top-0 right-0 h-full w-1.5 cursor-col-resize touch-none roun…" |
| `components/data-table/VirtualHistoryList.tsx:124` | main-content ← default: routed page / shared component | <Button> variant=secondary size=sm class="bg-popover/95 absolute top-[calc(var(--vrcx-0-table-header-height)+0.5rem)] left-1/2 z-20 …" |
| `components/date-range-filter/DateRangeFilter.tsx:102` | popover ← inside <PopoverContent> (L81, portal) | <Button> variant=outline size=sm |
| `components/date-range-filter/DateRangeFilter.tsx:110` | popover ← inside <PopoverContent> (L81, portal) | <Button> size=sm |
| `components/date-time-range-picker/DateTimeRangePicker.tsx:241` | popover ← inside <PopoverContent> (L206, portal) | <Button> variant=outline size=sm |
| `components/date-time-range-picker/DateTimeRangePicker.tsx:249` | popover ← inside <PopoverContent> (L206, portal) | <Button> size=sm |
| `components/dialogs/AvatarDetailsDialog.tsx:435` | dialog ← inside <DialogContent> (L276, portal, not .entity-dialog) | <Button> variant=secondary |
| `components/dialogs/AvatarDetailsDialog.tsx:443` | dialog ← inside <DialogContent> (L276, portal, not .entity-dialog) | <Button> |
| `components/dialogs/AvatarDialogTabbedView.tsx:226` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost class="bg-muted aspect-[4/3] h-auto w-full overflow-hidden rounded-lg border p-0 disabled:pointer…" |
| `components/dialogs/AvatarDialogTabbedView.tsx:263` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost class="h-auto min-w-0 justify-start overflow-hidden p-0 text-left text-lg leading-tight font-semi…" |
| `components/dialogs/AvatarDialogTabbedView.tsx:279` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost class="text-muted-foreground hover:text-foreground h-auto max-w-full min-w-0 justify-start overfl…" |
| `components/dialogs/AvatarOwnerEditDialogs.tsx:89` | dialog ← generic dialog file | <Button> variant=ghost class="h-auto min-w-0 flex-1 justify-start p-1.5 text-left" |
| `components/dialogs/AvatarOwnerEditDialogs.tsx:368` | dialog ← inside <DialogContent> (L306, portal, not .entity-dialog) | <Button> variant=outline size=sm |
| `components/dialogs/AvatarOwnerEditDialogs.tsx:406` | dialog ← inside <DialogContent> (L306, portal, not .entity-dialog) | <Button> variant=secondary |
| `components/dialogs/AvatarOwnerEditDialogs.tsx:414` | dialog ← inside <DialogContent> (L306, portal, not .entity-dialog) | <Button> |
| `components/dialogs/BoopEmojiDialog.tsx:428` | dialog ← inside <DialogContent> (L379, portal, not .entity-dialog) | <Button> variant=outline size=icon-sm |
| `components/dialogs/BoopEmojiDialog.tsx:487` | dialog ← inside <DialogContent> (L379, portal, not .entity-dialog) | <Button> variant=outline class="sm:mr-auto" |
| `components/dialogs/BoopEmojiDialog.tsx:499` | dialog ← inside <DialogContent> (L379, portal, not .entity-dialog) | <Button> variant=secondary |
| `components/dialogs/BoopEmojiDialog.tsx:507` | dialog ← inside <DialogContent> (L379, portal, not .entity-dialog) | <Button> |
| `components/dialogs/EntityDialogScaffold.tsx:278` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=destructive outline ⟨dynamic⟩ size=icon-lg class="relative" |
| `components/dialogs/EntityDialogScaffold.tsx:405` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| `components/dialogs/EntityDialogScaffold.tsx:511` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost size=icon-xs |
| `components/dialogs/FriendListUserLoadDialog.tsx:64` | dialog ← inside <DialogContent> (L38, portal, not .entity-dialog) | <Button> variant=outline |
| `components/dialogs/FriendListUserLoadDialog.tsx:71` | dialog ← inside <DialogContent> (L38, portal, not .entity-dialog) | <Button> variant=secondary |
| `components/dialogs/InstanceInviteDialog.tsx:358` | dialog ← inside <DialogContent> (L339, portal, not .entity-dialog) | <Button> variant=outline size=sm |
| `components/dialogs/InstanceInviteDialog.tsx:372` | dialog ← inside <DialogContent> (L339, portal, not .entity-dialog) | <Button> variant=outline size=sm |
| `components/dialogs/InstanceInviteDialog.tsx:389` | dialog ← inside <DialogContent> (L339, portal, not .entity-dialog) | <Button> variant=outline size=sm |
| `components/dialogs/InstanceInviteDialog.tsx:469` | dialog ← inside <DialogContent> (L339, portal, not .entity-dialog) | <Button> variant=outline |
| `components/dialogs/InstanceInviteDialog.tsx:477` | dialog ← inside <DialogContent> (L339, portal, not .entity-dialog) | <Button> |
| `components/dialogs/ProfileDetailsFields.tsx:166` | dialog ← generic dialog file | <Button> variant=outline size=xs |
| `components/dialogs/ProfileMediaPanel.tsx:100` | dialog ← generic dialog file | <Button> variant=ghost |
| `components/dialogs/ProfileMediaPanel.tsx:164` | dialog ← generic dialog file | <Button> variant=outline size=sm class="shrink-0 self-start" |
| `components/dialogs/UserActivityPanelImpl.tsx:186` | dialog ← generic dialog file | <Button> variant=ghost size=icon-sm class="rounded-full" |
| `components/dialogs/WorldDialogContentWorkflow.tsx:321` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| `components/dialogs/WorldOwnerEditDialogs.tsx:389` | dialog ← inside <DialogContent> (L264, portal, not .entity-dialog) | <Button> variant=outline |
| `components/dialogs/WorldOwnerEditDialogs.tsx:397` | dialog ← inside <DialogContent> (L264, portal, not .entity-dialog) | <Button> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:639` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Button> variant=secondary |
| `components/dialogs/WorldOwnerEditDialogs.tsx:647` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Button> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:750` | dialog ← inside <DialogContent> (L696, portal, not .entity-dialog) | <Button> variant=outline size=sm |
| `components/dialogs/WorldOwnerEditDialogs.tsx:763` | dialog ← inside <DialogContent> (L696, portal, not .entity-dialog) | <Button> |
| `components/dialogs/avatar-dialog/components/AvatarDialogGalleryTab.tsx:52` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| `components/dialogs/avatar-dialog/components/AvatarDialogGalleryTab.tsx:74` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline class="bg-muted/20 h-52 w-full overflow-hidden p-0" |
| `components/dialogs/avatar-dialog/components/AvatarDialogGalleryTab.tsx:94` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| `components/dialogs/avatar-dialog/components/AvatarDialogGalleryTab.tsx:115` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| `components/dialogs/avatar-dialog/components/AvatarDialogHeaderActions.tsx:99` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=default outline ⟨dynamic⟩ class="min-w-0 flex-1" |
| `components/dialogs/avatar-dialog/components/AvatarDialogPerformanceTab.tsx:229` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=xs |
| `components/dialogs/avatar-dialog/components/AvatarDialogPerformanceTab.tsx:341` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=link size=xs class="text-muted-foreground hover:text-foreground ml-auto h-auto p-0" |
| `components/dialogs/group-dialog/GroupDialogEvents.tsx:219` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| `components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:232` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost class="bg-muted mx-auto aspect-square h-auto w-full max-w-64 overflow-hidden rounded-lg border p-…" |
| `components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:261` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost class="h-auto min-w-0 flex-1 justify-start overflow-hidden p-0 text-left text-lg leading-tight fo…" |
| `components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:300` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost class="text-muted-foreground hover:text-foreground h-auto max-w-full justify-start gap-1 p-0 text…" |
| `components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:576` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=⟨primaryAction.variant⟩ class="w-full" |
| `components/dialogs/group-dialog/GroupDialogTabPanels.tsx:96` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost class="h-auto shrink-0 p-0" |
| `components/dialogs/group-dialog/GroupDialogTabPanels.tsx:272` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost class="bg-muted h-auto w-full overflow-hidden rounded-md p-0" |
| `components/dialogs/group-dialog/GroupDialogTabPanels.tsx:373` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=xs |
| `components/dialogs/group-dialog/GroupDialogTabPanels.tsx:453` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=link size=xs class="h-auto max-w-full min-w-0 justify-start p-0 text-left break-all whitespace-normal" |
| `components/dialogs/group-dialog/GroupMembersPanel.tsx:162` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost class="box-border h-auto w-full min-w-0 justify-start gap-2.5 p-1.5 text-left text-sm font-normal" |
| `components/dialogs/group-dialog/GroupMembersPanel.tsx:421` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost size=icon-sm |
| `components/dialogs/group-dialog/GroupMembersPanel.tsx:529` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=ghost size=sm |
| `components/dialogs/group-dialog/GroupModerationBanImportDialog.tsx:203` | dialog ← inside <DialogContent> (L174, portal, not .entity-dialog) | <Button> size=sm |
| `components/dialogs/group-dialog/GroupModerationBanImportDialog.tsx:212` | dialog ← inside <DialogContent> (L174, portal, not .entity-dialog) | <Button> variant=destructive size=sm |
| `components/dialogs/group-dialog/GroupModerationBanImportDialog.tsx:238` | dialog ← inside <DialogContent> (L174, portal, not .entity-dialog) | <Button> variant=secondary size=sm class="mt-2 self-start" |
| `components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:124` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=icon-sm class="rounded-full" |
| `components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:164` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm class="w-fit" |
| `components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:224` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| `components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:237` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=secondary size=sm |
| `components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:250` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| `components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:259` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| `components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:268` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| `components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:279` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Button> variant=outline size=sm |
| … | | 共 748 处，其余见 table.json |

