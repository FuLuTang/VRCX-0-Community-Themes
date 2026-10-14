# 元素 × 上下文 样式覆盖矩阵 (full-current)

> 生成：`audit.mjs`；源码 `/home/fulutang/Documents/Github/VRCX-0-jirai/src`（578 个文件，1305 处原语使用点）；主题 `/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`；4250 条 CSS 规则。
> ✓ 已主题（所有使用点的“形状属性”均相对无主题基线变化，且变化集合覆盖规范主题实例）  ✗ 缝隙（使用点上未主题化/部分主题化）  – 该上下文无使用点（`–†` = 无使用点但夹具里同样未主题化，潜在缝隙）

| 原语 \ 上下文 | main-content | main-toolbar | graph-floating-controls | main-card-sm | side-panel | settings-vertical-tabs | entity-dialog | dialog | popover | menu-popup | login-page | privacy-lock | toast | app-chrome |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| native-range | – | – | – | – | – | – | – | – | – | – | – | – | – | – |
| base-slider | ✓ (1) | – | – | – | – | ✓ (3) | – | ✓ (1) | ✓ (1) | – | – | – | – | – |
| native-checkbox | – | – | – | – | – | – | – | – | – | – | – | – | – | – |
| base-checkbox | ✓ (11) | – | – | – | – | – | ✓ (2) | ✓ (29) | ✓ (1) | – | ✓ (1) | – | – | – |
| switch | ✓ (5) | ✓ (3) | – | – | ✓ (1) | ✓ (86) | ✓ (1) | ✓ (16) | ✓ (6) | – | – | – | – | – |
| radio | – | – | – | – | – | – | – | ✓ (1) | – | – | – | – | – | – |
| input-textarea | ✓ (12) | – | ✓ (1) | – | ✓ (3) | ✓ (7) | ✓ (11) | ✓ (76) | ✓ (2) | ✓ (1) | ✓ (2) ≠规范 | ✓ (1) | – | ✓ (1) |
| select-trigger | ✓ (18) | ✓ (4) | – | – | ✓ (1) | ✓ (20) | ✓ (12) | ✓ (37) | ✓ (1) | ✓ (2) | ✓ (1) | – | – | – |
| button | ✓ (242) | ✓ (13) ≠规范 | ✓ (4) ≠规范 | ✓ (2) ≠规范 | ✓ (9) | ✓ (60) ≠规范 | ✓ (83) ≠规范 | ✓ (265) ≠规范 | ✓ (24) ≠规范 | ✓ (1) ≠规范 | ✓ (13) ≠规范 | ✓ (5) ≠规范 | – | ✓ (27) ≠规范 |
| badge | ✓ (40) | – | – | ✓ (2) ≠规范 | ✓ (1) | ✓ (4) | ✓ (34) ≠规范 | ✓ (12) ≠规范 | ✓ (5) | – | – | – | – | ✓ (4) ≠规范 |
| tabs-trigger | ✓ (5) | – | – | – | ✓ (2) | ✓ (1) | ✓ (6) | ✓ (11) | – | – | – | – | – | ✓ (1) |
| toggle-group-item | ✓ (14) | ✓ (2) ≠规范 | – | – | – | ✓ (2) | ✓ (2) | ✓ (8) | ✓ (4) ≠规范 | – | – | – | – | ✓ (3) |
| progress | ✓ (4) | – | – | – | – | – | – | ✓ (6) | – | – | – | – | – | – |
| kbd | ✓ (1) | – | – | – | – | – | – | – | – | ✓ (1) | – | – | – | – |

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
| `.vrcx-0-page-toolbar *` | 39 | buttons-badges-r10 | main-toolbar |
| `.vrcx-0-titlebar *` | 7 | buttons-badges-r10 | app-chrome |
| `[data-vrcx-0-surface="login-page"] *` | 1 | fields-toolbar-r10 | login-page |
| `.entity-dialog *` | 4 | form-controls-r9 | entity-dialog |
| `[class~="bg-popover/70"] *` | 39 | buttons-badges-r10 | graph-floating-controls, menu-popup |
| `.vrcx-0-page-scaffold *` | 4 | buttons-badges-r10 | main-content, main-toolbar, graph-floating-controls, main-card-sm, settings-vertical-tabs |

## 使用点（静态扫描）

### native-range
（无使用点）

### base-slider
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/media/ImageCropToolbar.tsx:125` | dialog ← ImageCropDialog (portal dialog opened from any page) | <Slider> |
| `components/mutual-friends/CommitSlider.tsx:36` | main-content ← default: routed page / shared component | <Slider> |
| `features/instance-history/components/InstanceActivitySettingsPopover.tsx:53` | popover ← inside <PopoverContent> (L44, portal) | <Slider> class="w-40" |
| `features/settings/components/settings-tabs/SettingsNotificationsTab.tsx:393` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Slider> |
| `features/settings/components/settings-tabs/SettingsVrTab.tsx:368` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Slider> |
| `features/settings/components/settings-tabs/SettingsVrTab.tsx:567` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Slider> |

### native-checkbox
（无使用点）

### base-checkbox
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/dialogs/AvatarOwnerEditDialogs.tsx:122` | dialog ← generic dialog file | <Checkbox> class="mx-2 shrink-0" |
| `components/dialogs/AvatarOwnerEditDialogs.tsx:331` | dialog ← inside <DialogContent> (L306, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:466` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:481` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:496` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:511` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:528` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:568` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:618` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/group-dialog/GroupModerationLogsExportDialog.tsx:79` | dialog ← inside <DialogContent> (L67, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/group-dialog/GroupPostEditorDialog.tsx:186` | dialog ← inside <DialogContent> (L143, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/group-dialog/GroupPostEditorDialog.tsx:252` | dialog ← inside <DialogContent> (L143, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/group-dialog/GroupProfileEditDialog.tsx:239` | dialog ← inside <DialogContent> (L90, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/group-dialog/useGroupModerationColumns.tsx:120` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Checkbox> |
| `components/dialogs/group-dialog/useGroupModerationColumns.tsx:138` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Checkbox> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:573` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:590` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:841` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <Checkbox> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:858` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <Checkbox> |
| `components/hosts/system-dialogs/VRChatConfigDialog.tsx:659` | dialog ← inside <DialogContent> (L460, portal, not .entity-dialog) | <Checkbox> |
| `components/hosts/system-dialogs/VRChatConfigDialog.tsx:758` | dialog ← inside <DialogContent> (L460, portal, not .entity-dialog) | <Checkbox> |
| `components/media/ImageCropDialog.tsx:782` | dialog ← inside <DialogContent> (L469, portal, not .entity-dialog) | <Checkbox> |
| `components/media/ScreenshotThumbnailCard.tsx:290` | main-content ← default: routed page / shared component | <Checkbox> class="⟨TILE_SELECT_BOX⟩" |
| `components/reui/gantt/gantt-view.tsx:3446` | main-content ← default: routed page / shared component | <Checkbox> class="size-3.5 opacity-0 transition-opacity group-hover/gantt-row:opacity-100 group-data-hover/g…" |
| `components/sidebar/side-panel/SidePanelCustomTabsDialog.tsx:242` | dialog ← generic dialog file | <Checkbox> |
| `components/sidebar/side-panel/SidePanelSettingsPopover.tsx:354` | popover ← inside <PopoverContent> (L184, portal) | <Checkbox> |
| `features/auth/components/LoginFormCard.tsx:145` | login-page ← features/auth login surface | <Checkbox> |
| `features/favorites/components/FavoriteCard.tsx:235` | main-content ← default: routed page / shared component | <Checkbox> class="⟨TILE_SELECT_BOX⟩" |
| `features/favorites/components/FavoriteExportDialog.tsx:139` | dialog ← inside <DialogContent> (L117, portal, not .entity-dialog) | <Checkbox> |
| `features/feed/columns/FeedColumnsManagerDialog.tsx:515` | dialog ← inside <DialogContent> (L233, portal, not .entity-dialog) | <Checkbox> |
| `features/feed/columns/FeedColumnsManagerDialog.tsx:559` | dialog ← inside <DialogContent> (L233, portal, not .entity-dialog) | <Checkbox> |
| `features/feed/columns/FeedColumnsManagerDialog.tsx:598` | dialog ← inside <DialogContent> (L233, portal, not .entity-dialog) | <Checkbox> |
| `features/friends/components/FriendListColumns.tsx:114` | main-content ← default: routed page / shared component | <Checkbox> |
| `features/my-groups/components/MyGroupCard.tsx:245` | main-content ← default: routed page / shared component | <Checkbox> class="⟨TILE_SELECT_BOX⟩" |
| `features/search/components/SearchControlBand.tsx:81` | main-content ← default: routed page / shared component | <Checkbox> |
| `features/search/components/SearchControlBand.tsx:93` | main-content ← default: routed page / shared component | <Checkbox> |
| `features/search/components/SearchControlBand.tsx:112` | main-content ← default: routed page / shared component | <Checkbox> |
| `features/settings/components/SettingsViewParts.tsx:280` | dialog ← inside <DialogContent> (L185, portal, not .entity-dialog) | <Checkbox> |
| `features/settings/components/settings-dialogs/GameLogImportDialog.tsx:69` | dialog ← settings dialog | <Checkbox> |
| `features/settings/components/settings-tabs/IntegrationApiSettingsGroup.tsx:78` | dialog ← inside <DialogContent> (L64, portal, not .entity-dialog) | <Checkbox> class="mt-0.5" |
| `features/settings/components/settings-tabs/WebhookSettingsGroup.tsx:514` | dialog ← inside <DialogContent> (L473, portal, not .entity-dialog) | <Checkbox> |
| `features/tools/components/GalleryEmojiUploadSettings.tsx:103` | main-content ← default: routed page / shared component | <Checkbox> |
| `features/tools/components/GalleryEmojiUploadSettings.tsx:161` | main-content ← default: routed page / shared component | <Checkbox> |
| `features/tools/components/MediaAssetTile.tsx:273` | main-content ← default: routed page / shared component | <Checkbox> class="⟨TILE_SELECT_BOX⟩" |

### switch
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/dialogs/user-dialog/components/UserActivityPanelSections.tsx:74` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Switch> class="scale-75" |
| `components/hosts/system-dialogs/RegistryBackupDialog.tsx:294` | dialog ← inside <DialogContent> (L280, portal, not .entity-dialog) | <Switch> |
| `components/hosts/system-dialogs/RegistryBackupDialog.tsx:309` | dialog ← inside <DialogContent> (L280, portal, not .entity-dialog) | <Switch> |
| `components/hosts/tools-dialogs/AppLauncherDialog.tsx:456` | dialog ← inside <DialogContent> (L447, portal, not .entity-dialog) | <Switch> |
| `components/hosts/tools-dialogs/AppLauncherDialog.tsx:566` | dialog ← inside <DialogContent> (L447, portal, not .entity-dialog) | <Switch> size=sm |
| `components/hosts/tools-dialogs/AppLauncherDialog.tsx:828` | dialog ← generic dialog file | <Switch> |
| `components/hosts/tools-dialogs/GroupCalendarDialog.tsx:564` | dialog ← inside <DialogContent> (L501, portal, not .entity-dialog) | <Switch> |
| `components/hosts/tools-dialogs/ProfileBackupDialog.tsx:269` | dialog ← inside <DialogContent> (L247, portal, not .entity-dialog) | <Switch> |
| `components/hosts/tools-dialogs/presence-automation/AutomationRuleLayout.tsx:175` | dialog ← generic dialog file | <Switch> |
| `components/hosts/tools-dialogs/presence-automation/InviteRulesTab.tsx:71` | dialog ← generic dialog file | <Switch> |
| `components/hosts/tools-dialogs/presence-automation/PresenceRuleActionFields.tsx:110` | dialog ← generic dialog file | <Switch> |
| `components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:333` | dialog ← generic dialog file | <Switch> |
| `components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:363` | dialog ← generic dialog file | <Switch> |
| `components/proxy/ProxySettingsEditor.tsx:64` | main-content ← default: routed page / shared component | <Switch> |
| `components/sidebar/side-panel/SidePanelCustomTabsDialog.tsx:618` | dialog ← inside <DialogContent> (L427, portal, not .entity-dialog) | <Switch> class="pointer-events-none" |
| `components/sidebar/side-panel/SidePanelCustomTabsDialog.tsx:636` | dialog ← inside <DialogContent> (L427, portal, not .entity-dialog) | <Switch> class="shrink-0" |
| `components/sidebar/side-panel/SidePanelSettingsPopover.tsx:214` | popover ← inside <PopoverContent> (L184, portal) | <Switch> |
| `components/sidebar/side-panel/SidePanelSettingsPopover.tsx:232` | popover ← inside <PopoverContent> (L184, portal) | <Switch> |
| `components/sidebar/side-panel/SidePanelSettingsPopover.tsx:248` | popover ← inside <PopoverContent> (L184, portal) | <Switch> |
| `components/sidebar/side-panel/SidePanelSettingsPopover.tsx:265` | popover ← inside <PopoverContent> (L184, portal) | <Switch> |
| `components/sidebar/side-panel/SidebarAutoHideSetting.tsx:54` | side-panel ← components/sidebar | <Switch> |
| `features/assistant/AssistantDialog.tsx:668` | dialog ← generic dialog file | <Switch> |
| `features/charts/TwoPersonRelationshipPageImpl.tsx:540` | main-content ← default: routed page / shared component | <Switch> |
| `features/dashboard/components/DashboardViewParts.tsx:130` | main-content ← default: routed page / shared component | <Switch> |
| `features/favorites/components/FavoriteShareCollectionDialog.tsx:107` | dialog ← generic dialog file | <Switch> |
| `features/friends/components/FriendsLocationsToolbar.tsx:117` | main-toolbar ← inside <PageToolbar> (L73) | <Switch> |
| `features/friends/components/FriendsLocationsToolbar.tsx:133` | main-toolbar ← inside <PageToolbar> (L73) | <Switch> |
| `features/instance-history/InstanceHistoryPage.tsx:783` | main-toolbar ← inside <PageToolbar> (L595) | <Switch> |
| `features/instance-history/components/InstanceActivitySettingsPopover.tsx:72` | popover ← inside <PopoverContent> (L44, portal) | <Switch> |
| `features/instance-history/components/InstanceActivitySettingsPopover.tsx:83` | popover ← inside <PopoverContent> (L44, portal) | <Switch> |
| `features/settings/components/LinuxRenderingSetting.tsx:69` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/AdvancedTroubleshootingGroup.tsx:119` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/AdvancedTroubleshootingGroup.tsx:125` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/AssistantSettingsGroup.tsx:228` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/IntegrationApiSettingsGroup.tsx:268` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/IntegrationApiSettingsGroup.tsx:298` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/McpServerSettingsGroup.tsx:194` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/McpServerSettingsGroup.tsx:209` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/McpServerSettingsGroup.tsx:224` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsAdvancedTab.tsx:115` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsAdvancedTab.tsx:275` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsAdvancedTab.tsx:341` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsAdvancedTab.tsx:357` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsAdvancedTab.tsx:421` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:68` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:82` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:94` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:106` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:121` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:136` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:148` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:160` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:182` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:215` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsIntegrationsTab.tsx:250` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceAppearanceCard.tsx:379` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceAppearanceCard.tsx:393` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceAppearanceCard.tsx:407` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceDisplayCards.tsx:83` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceDisplayCards.tsx:97` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceDisplayCards.tsx:117` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceDisplayCards.tsx:205` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceUserColorsCard.tsx:81` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceUserDialogCard.tsx:38` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceUserDialogCard.tsx:49` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsInterfaceUserDialogCard.tsx:60` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsMediaTab.tsx:74` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsMediaTab.tsx:87` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsMediaTab.tsx:98` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsMediaTab.tsx:177` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsMediaTab.tsx:187` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsMediaTab.tsx:201` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsMediaTab.tsx:252` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsMediaTab.tsx:272` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsNotificationsInAppCard.tsx:93` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsNotificationsInAppCard.tsx:108` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsNotificationsInAppCard.tsx:120` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsNotificationsTab.tsx:168` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsNotificationsTab.tsx:183` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| `features/settings/components/settings-tabs/SettingsNotificationsTab.tsx:250` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Switch> |
| … | | 共 118 处，其余见 table.json |

### radio
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/hosts/system-dialogs/DataDirMigrationDialog.tsx:222` | dialog ← inside <AlertDialogContent> (L143, portal, not .entity-dialog) | <Radio.Root> class="border-input data-checked:border-primary data-checked:bg-primary focus-visible:ring-ring m…" |

### input-textarea
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/dialogs/AvatarDetailsDialog.tsx:292` | dialog ← inside <DialogContent> (L276, portal, not .entity-dialog) | <Input> |
| `components/dialogs/AvatarDetailsDialog.tsx:303` | dialog ← inside <DialogContent> (L276, portal, not .entity-dialog) | <Textarea> class="resize-none" |
| `components/dialogs/AvatarDetailsDialog.tsx:414` | dialog ← inside <DialogContent> (L276, portal, not .entity-dialog) | <Textarea> class="resize-none" |
| `components/dialogs/AvatarDialogContent.tsx:142` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Input> class="hidden" |
| `components/dialogs/AvatarDialogContent.tsx:149` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Input> class="hidden" |
| `components/dialogs/AvatarOwnerEditDialogs.tsx:356` | dialog ← inside <DialogContent> (L306, portal, not .entity-dialog) | <Textarea> class="resize-none" |
| `components/dialogs/EntityDialogScaffold.tsx:247` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Textarea> class="mt-1 min-h-0 resize-none text-xs" |
| `components/dialogs/ProfileDetailsFields.tsx:182` | dialog ← generic dialog file | <InputGroupInput> |
| `components/dialogs/WorldDialogContentWorkflow.tsx:477` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Input> class="hidden" |
| `components/dialogs/WorldOwnerEditDialogs.tsx:281` | dialog ← inside <DialogContent> (L264, portal, not .entity-dialog) | <Input> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:294` | dialog ← inside <DialogContent> (L264, portal, not .entity-dialog) | <Textarea> class="field-sizing-fixed max-h-56 min-h-32 resize-y overflow-y-auto" |
| `components/dialogs/WorldOwnerEditDialogs.tsx:375` | dialog ← inside <DialogContent> (L264, portal, not .entity-dialog) | <Input> |
| `components/dialogs/WorldOwnerEditDialogs.tsx:544` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Textarea> class="resize-none" |
| `components/dialogs/WorldOwnerEditDialogs.tsx:593` | dialog ← inside <DialogContent> (L453, portal, not .entity-dialog) | <Textarea> class="resize-none" |
| `components/dialogs/WorldOwnerEditDialogs.tsx:718` | dialog ← inside <DialogContent> (L696, portal, not .entity-dialog) | <InputGroupInput> |
| `components/dialogs/group-dialog/GroupDialogTabPanels.tsx:559` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Input> class="ml-auto h-8 max-w-64" |
| `components/dialogs/group-dialog/GroupModerationBanImportDialog.tsx:192` | dialog ← inside <DialogContent> (L174, portal, not .entity-dialog) | <Textarea> class="mb-2 resize-none" |
| `components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:143` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Textarea> class="resize-none text-xs" |
| `components/dialogs/group-dialog/GroupModerationLogsExportDialog.tsx:89` | dialog ← inside <DialogContent> (L67, portal, not .entity-dialog) | <Textarea> class="resize-none font-mono text-xs" |
| `components/dialogs/group-dialog/GroupModerationLogsPanel.tsx:497` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Input> class="h-8 w-64" |
| `components/dialogs/group-dialog/GroupModerationTabPanel.tsx:210` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Input> class="h-8 w-64" |
| `components/dialogs/group-dialog/GroupPostEditorDialog.tsx:157` | dialog ← inside <DialogContent> (L143, portal, not .entity-dialog) | <Input> |
| `components/dialogs/group-dialog/GroupPostEditorDialog.tsx:170` | dialog ← inside <DialogContent> (L143, portal, not .entity-dialog) | <Textarea> class="resize-none" |
| `components/dialogs/group-dialog/GroupPostEditorDialog.tsx:296` | dialog ← inside <DialogContent> (L143, portal, not .entity-dialog) | <InputGroupInput> |
| `components/dialogs/group-dialog/GroupProfileEditDialog.tsx:104` | dialog ← inside <DialogContent> (L90, portal, not .entity-dialog) | <Input> |
| `components/dialogs/group-dialog/GroupProfileEditDialog.tsx:121` | dialog ← inside <DialogContent> (L90, portal, not .entity-dialog) | <InputGroupInput> class="font-mono" |
| `components/dialogs/group-dialog/GroupProfileEditDialog.tsx:156` | dialog ← inside <DialogContent> (L90, portal, not .entity-dialog) | <Textarea> class="field-sizing-fixed max-h-48 min-h-24 resize-y overflow-y-auto" |
| `components/dialogs/group-dialog/GroupProfileEditDialog.tsx:173` | dialog ← inside <DialogContent> (L90, portal, not .entity-dialog) | <Textarea> class="field-sizing-fixed max-h-48 min-h-24 resize-y overflow-y-auto" |
| `components/dialogs/invite-message/InviteMessagePanel.tsx:350` | dialog ← generic dialog file | <Input> class="max-w-sm" |
| `components/dialogs/invite-message/InviteMessagePanel.tsx:546` | dialog ← generic dialog file | <Textarea> |
| `components/dialogs/previous-instances-table/InstanceHistoryListPanel.tsx:349` | dialog ← generic dialog file | <Input> class="max-w-sm" |
| `components/dialogs/previous-instances-table/PreviousInstancesListTable.tsx:185` | dialog ← generic dialog file | <Input> class="max-w-sm" |
| `components/dialogs/user-dialog/UserSelfEditDialogs.tsx:116` | dialog ← inside <DialogContent> (L99, portal, not .entity-dialog) | <InputGroupInput> |
| `components/dialogs/user-dialog/UserSelfEditDialogs.tsx:462` | dialog ← inside <DialogContent> (L425, portal, not .entity-dialog) | <Input> |
| `components/dialogs/user-dialog/UserSelfEditDialogs.tsx:508` | dialog ← inside <DialogContent> (L425, portal, not .entity-dialog) | <Textarea> class="field-sizing-fixed max-h-56 min-h-36 resize-y overflow-y-auto" |
| `components/dialogs/user-dialog/components/UserDialogProfileBackgroundPicker.tsx:40` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Input> class="size-8 shrink-0 cursor-pointer p-0.5" |
| `components/dialogs/user-dialog/components/UserDialogSearchHeader.tsx:73` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Input> class="h-8 min-w-40 flex-1 sm:max-w-64" |
| `components/dialogs/user-dialog/components/UserNoteMemoDialog.tsx:63` | dialog ← inside <DialogContent> (L49, portal, not .entity-dialog) | <Textarea> class="min-h-24 resize-y" |
| `components/dialogs/user-dialog/components/UserNoteMemoDialog.tsx:81` | dialog ← inside <DialogContent> (L49, portal, not .entity-dialog) | <Textarea> class="min-h-32 resize-y" |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:300` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Input> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:559` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <Input> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:617` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <InputGroupInput> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:750` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <Input> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:770` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <Input> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:881` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <Input> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:894` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <Input> |
| `components/hosts/ModalHost.tsx:202` | dialog ← inside <DialogContent> (L194, portal, not .entity-dialog) | <Textarea> class="min-h-32" |
| `components/hosts/ModalHost.tsx:211` | dialog ← inside <DialogContent> (L194, portal, not .entity-dialog) | <Input> |
| `components/hosts/system-dialogs/LaunchOptionsDialog.tsx:187` | dialog ← inside <DialogContent> (L160, portal, not .entity-dialog) | <Textarea> |
| `components/hosts/system-dialogs/LaunchOptionsDialog.tsx:202` | dialog ← inside <DialogContent> (L160, portal, not .entity-dialog) | <InputGroupInput> |
| `components/hosts/system-dialogs/OpenSourceNoticeDialog.tsx:170` | dialog ← inside <DialogContent> (L161, portal, not .entity-dialog) | <Input> |
| `components/hosts/system-dialogs/VRChatConfigDialog.tsx:141` | dialog ← generic dialog file | <InputGroupInput> |
| `components/hosts/tools-dialogs/AppLauncherDialog.tsx:731` | dialog ← generic dialog file | <Input> |
| `components/hosts/tools-dialogs/AppLauncherDialog.tsx:762` | dialog ← generic dialog file | <Input> class="min-w-0 font-mono text-xs" |
| `components/hosts/tools-dialogs/AppLauncherDialog.tsx:881` | dialog ← generic dialog file | <Input> class="font-mono text-xs" |
| `components/hosts/tools-dialogs/GroupCalendarDialog.tsx:728` | dialog ← inside <DialogContent> (L501, portal, not .entity-dialog) | <Input> |
| `components/hosts/tools-dialogs/LlmEndpointsDialog.tsx:477` | dialog ← inside <DialogContent> (L382, portal, not .entity-dialog) | <Input> |
| `components/hosts/tools-dialogs/LlmEndpointsDialog.tsx:499` | dialog ← inside <DialogContent> (L382, portal, not .entity-dialog) | <Input> |
| `components/hosts/tools-dialogs/LlmEndpointsDialog.tsx:550` | dialog ← inside <DialogContent> (L382, portal, not .entity-dialog) | <Input> |
| `components/hosts/tools-dialogs/NoteExportDialog.tsx:566` | dialog ← inside <DialogContent> (L334, portal, not .entity-dialog) | <Textarea> |
| `components/hosts/tools-dialogs/ProfileBackupDialog.tsx:134` | dialog ← generic dialog file | <InputGroupInput> |
| `components/hosts/tools-dialogs/ToolsDialogControls.tsx:11` | dialog ← generic dialog file | <Textarea> class="font-mono text-xs" |
| `components/hosts/tools-dialogs/presence-automation/AutomationRuleLayout.tsx:248` | dialog ← generic dialog file | <Input> class="h-8 max-w-60" |
| `components/hosts/tools-dialogs/presence-automation/ContextRulesTab.tsx:199` | dialog ← generic dialog file | <Input> |
| `components/hosts/tools-dialogs/presence-automation/PresenceRuleActionFields.tsx:124` | dialog ← generic dialog file | <Input> class="min-w-0" |
| `components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:203` | dialog ← generic dialog file | <Input> |
| `components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:259` | dialog ← generic dialog file | <Input> |
| `components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:274` | dialog ← generic dialog file | <Input> |
| `components/layout/ToolbarControls.tsx:105` | app-chrome ← components/layout (titlebar/statusbar/shell) | <InputGroupInput> |
| `components/media/ImageCropDialog.tsx:663` | dialog ← inside <DialogContent> (L469, portal, not .entity-dialog) | <Input> class="h-4 w-12 rounded-sm border-0 px-0.5 py-0 text-right font-mono text-[11px] shadow-none focu…" |
| `components/media/ImageCropDialog.tsx:761` | dialog ← inside <DialogContent> (L469, portal, not .entity-dialog) | <Input> |
| `components/proxy/ProxySettingsEditor.tsx:75` | main-content ← default: routed page / shared component | <Input> |
| `components/search/AvatarProviderSettingsDialog.tsx:150` | dialog ← inside <DialogContent> (L127, portal, not .entity-dialog) | <InputGroupInput> |
| `components/sidebar/SidePanel.tsx:410` | side-panel ← components/sidebar | <InputGroupInput> class="h-7 pl-2.5 text-xs md:text-xs" |
| `components/sidebar/TrackedNonfriendsSidebar.tsx:64` | side-panel ← components/sidebar | <Input> |
| `components/sidebar/side-panel/SidePanelCustomTabsDialog.tsx:558` | dialog ← inside <DialogContent> (L427, portal, not .entity-dialog) | <Input> class="h-8 min-w-0 flex-1" |
| `components/sidebar/side-panel/SidePanelSelfHeader.tsx:276` | side-panel ← components/sidebar | <input type=text> class="ring-ring text-content-primary -mx-1 h-4 min-w-0 rounded-md bg-transparent px-1 text-xs ou…" |
| `features/assistant/components/Composer.tsx:30` | main-content ← default: routed page / shared component | <Textarea> class="max-h-32 min-h-10 flex-1 resize-none" |
| `features/auth/components/LoginFormCard.tsx:82` | login-page ← features/auth login surface | <Input> |
| `features/auth/components/LoginFormCard.tsx:113` | login-page ← features/auth login surface | <Input> |
| … | | 共 117 处，其余见 table.json |

### select-trigger
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/data-table/DataTableView.tsx:499` | main-content ← default: routed page / shared component | <SelectTrigger> size=sm class="vrcx-0-pagination-field w-20" |
| `components/date-time-range-picker/DateTimeRangePicker.tsx:85` | main-content ← default: routed page / shared component | <SelectTrigger> size=sm class="w-16" |
| `components/date-time-range-picker/DateTimeRangePicker.tsx:103` | main-content ← default: routed page / shared component | <SelectTrigger> size=sm class="w-16" |
| `components/dialogs/AvatarDetailsDialog.tsx:338` | dialog ← inside <DialogContent> (L276, portal, not .entity-dialog) | <SelectTrigger> |
| `components/dialogs/AvatarDetailsDialog.tsx:385` | dialog ← inside <DialogContent> (L276, portal, not .entity-dialog) | <SelectTrigger> |
| `components/dialogs/UserActivityPanelImpl.tsx:254` | dialog ← generic dialog file | <SelectTrigger> size=sm class="w-40" |
| `components/dialogs/group-dialog/GroupModerationTabPanel.tsx:232` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> size=sm class="w-44" |
| `components/dialogs/group-dialog/GroupModerationTabPanel.tsx:264` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> size=sm class="w-40" |
| `components/dialogs/previous-instances-table/PreviousInstancesListTable.tsx:206` | dialog ← generic dialog file | <SelectTrigger> size=sm class="w-24" |
| `components/dialogs/user-dialog/components/UserActivityPanelSections.tsx:96` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> size=sm class="h-6 w-[78px] px-2 text-sm" |
| `components/dialogs/user-dialog/components/UserActivityPanelSections.tsx:130` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> size=sm class="h-6 w-[78px] px-2 text-sm" |
| `components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:171` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> size=sm class="w-36" |
| `components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:261` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> size=sm class="w-32" |
| `components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:293` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> size=sm class="w-36" |
| `components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:426` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> size=sm class="w-36" |
| `components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:462` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> size=sm class="w-32" |
| `components/dialogs/user-dialog/components/UserDialogGroupInviteDialog.tsx:166` | dialog ← inside <DialogContent> (L123, portal, not .entity-dialog) | <ComboboxInput> class="w-full" |
| `components/dialogs/user-dialog/components/UserDialogGroupQuickModerationDialog.tsx:428` | dialog ← inside <DialogContent> (L263, portal, not .entity-dialog) | <ComboboxInput> class="w-full" |
| `components/dialogs/user-dialog/components/UserDialogGroupsTab.tsx:100` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> size=sm class="w-36" |
| `components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:749` | entity-dialog ← entity (user/world/avatar/group) dialog file | <select> class="border-input bg-background h-8 rounded-md border px-2 text-xs" |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:325` | entity-dialog ← entity (user/world/avatar/group) dialog file | <SelectTrigger> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:393` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <SelectTrigger> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:426` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <SelectTrigger> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:481` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <SelectTrigger> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:527` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <SelectTrigger> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:694` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <SelectTrigger> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:727` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <SelectTrigger> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:812` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <SelectTrigger> |
| `components/hosts/system-dialogs/RegistryBackupDialog.tsx:328` | dialog ← inside <DialogContent> (L280, portal, not .entity-dialog) | <SelectTrigger> |
| `components/hosts/system-dialogs/UpdaterDialog.tsx:321` | dialog ← inside <DialogContent> (L263, portal, not .entity-dialog) | <SelectTrigger> class="w-full" |
| `components/hosts/system-dialogs/VRChatConfigDialog.tsx:180` | dialog ← generic dialog file | <SelectTrigger> |
| `components/hosts/tools-dialogs/LlmEndpointsDialog.tsx:453` | dialog ← inside <DialogContent> (L382, portal, not .entity-dialog) | <SelectTrigger> class="w-full" |
| `components/hosts/tools-dialogs/presence-automation/ContextRulesTab.tsx:230` | dialog ← generic dialog file | <SelectTrigger> |
| `components/hosts/tools-dialogs/presence-automation/ContextRulesTab.tsx:270` | dialog ← generic dialog file | <SelectTrigger> |
| `components/hosts/tools-dialogs/presence-automation/InviteRulesTab.tsx:132` | dialog ← generic dialog file | <SelectTrigger> |
| `components/hosts/tools-dialogs/presence-automation/PresenceRuleActionFields.tsx:82` | dialog ← generic dialog file | <SelectTrigger> |
| `components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:238` | dialog ← generic dialog file | <SelectTrigger> |
| `components/layout/status-bar/StatusBarFooter.tsx:727` | popover ← inside <PopoverContent> (L701, portal) | <SelectTrigger> size=sm class="w-full" |
| `components/sidebar/side-panel/SidePanelCustomTabsDialog.tsx:154` | dialog ← generic dialog file | <SelectTrigger> size=sm class="w-auto shrink-0 px-2" |
| `components/sidebar/side-panel/SidePanelSettingsPopover.tsx:99` | side-panel ← components/sidebar | <SelectTrigger> size=sm class="w-full" |
| `features/assistant/AssistantDialog.tsx:606` | dialog ← generic dialog file | <SelectTrigger> class="data-placeholder:text-foreground w-full" |
| `features/assistant/AssistantDialog.tsx:645` | dialog ← generic dialog file | <SelectTrigger> class="w-full" |
| `features/assistant/components/RuntimeModelSelect.tsx:90` | main-content ← default: routed page / shared component | <ComboboxInput> class="w-full" |
| `features/auth/components/LoginPageHeader.tsx:33` | login-page ← features/auth login surface | <SelectTrigger> size=sm class="w-36" |
| `features/charts/RelationshipTimelinePageImpl.tsx:148` | main-content ← default: routed page / shared component | <select> class="border-input bg-background h-10 rounded-md border px-3 text-sm outline-none" |
| `features/charts/RelationshipTimelinePageImpl.tsx:414` | main-content ← default: routed page / shared component | <select> class="border-input bg-background h-10 rounded-md border px-3 text-sm outline-none" |
| `features/charts/TwoPersonRelationshipPageImpl.tsx:432` | main-content ← default: routed page / shared component | <select> class="border-input bg-background h-10 w-full rounded-md border px-3 text-sm outline-none" |
| `features/charts/TwoPersonRelationshipPageImpl.tsx:477` | main-content ← default: routed page / shared component | <select> class="border-input bg-background h-10 w-full rounded-md border px-3 text-sm outline-none" |
| `features/devkit/DevKitPanel.tsx:350` | main-content ← default: routed page / shared component | <SelectTrigger> class="h-7 text-xs" |
| `features/favorites/FavoriteImportPage.tsx:519` | main-content ← default: routed page / shared component | <SelectTrigger> size=sm class="min-w-52" |
| `features/favorites/components/FavoriteExportDialog.tsx:177` | dialog ← inside <DialogContent> (L117, portal, not .entity-dialog) | <SelectTrigger> size=sm class="min-w-52" |
| `features/favorites/components/FavoriteExportDialog.tsx:220` | dialog ← inside <DialogContent> (L117, portal, not .entity-dialog) | <SelectTrigger> size=sm class="min-w-52" |
| `features/favorites/components/FavoritesToolbar.tsx:129` | main-toolbar ← inside <PageToolbar> (L117) | <SelectTrigger> class="max-w-56 min-w-40 shrink-0" |
| `features/feed/columns/FeedColumnsManagerDialog.tsx:388` | dialog ← inside <DialogContent> (L233, portal, not .entity-dialog) | <SelectTrigger> |
| `features/feed/columns/FeedColumnsManagerDialog.tsx:478` | dialog ← inside <DialogContent> (L233, portal, not .entity-dialog) | <SelectTrigger> |
| `features/instance-history/InstanceHistoryPage.tsx:752` | main-toolbar ← inside <PageToolbar> (L595) | <SelectTrigger> class="w-full" |
| `features/my-groups/MyGroupsPage.tsx:194` | main-toolbar ← inside <PageToolbar> (L177) | <SelectTrigger> class="max-w-56 min-w-40 shrink-0" |
| `features/player-list/components/PlayerListGroupSelector.tsx:154` | main-content ← default: routed page / shared component | <ComboboxTrigger> variant=outline size=sm class="max-w-56 justify-between font-normal" |
| `features/player-list/components/PlayerListGroupSelector.tsx:182` | menu-popup ← inside <ComboboxContent> (L181, portal, bg-popover/70) | <ComboboxInput> |
| `features/search/components/SearchControlBand.tsx:137` | main-content ← default: routed page / shared component | <SelectTrigger> class="w-full" |
| `features/search/components/SearchControlBand.tsx:175` | main-content ← default: routed page / shared component | <SelectTrigger> class="w-full" |
| `features/settings/components/BrowseHistoryRetentionField.tsx:80` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> size=sm |
| `features/settings/components/settings-dialogs/CustomFontDialog.tsx:105` | dialog ← settings dialog | <ComboboxInput> class="w-full" |
| `features/settings/components/settings-dialogs/PurgeConfirmDialog.tsx:108` | dialog ← inside <DialogContent> (L61, portal, not .entity-dialog) | <SelectTrigger> class="w-36" |
| `features/settings/components/settings-dialogs/TranslationApiDialog.tsx:149` | dialog ← inside <DialogContent> (L124, portal, not .entity-dialog) | <SelectTrigger> class="w-56" |
| `features/settings/components/settings-dialogs/TranslationApiDialog.tsx:197` | dialog ← inside <DialogContent> (L124, portal, not .entity-dialog) | <SelectTrigger> class="w-56" |
| `features/settings/components/settings-dialogs/TranslationApiDialog.tsx:278` | dialog ← inside <DialogContent> (L124, portal, not .entity-dialog) | <SelectTrigger> class="w-96 max-w-full" |
| `features/settings/components/settings-dialogs/TranslationApiDialog.tsx:343` | dialog ← inside <DialogContent> (L124, portal, not .entity-dialog) | <SelectTrigger> class="w-96 max-w-full" |
| `features/settings/components/settings-dialogs/TranslationApiDialog.tsx:409` | dialog ← inside <DialogContent> (L124, portal, not .entity-dialog) | <SelectTrigger> class="data-placeholder:text-foreground w-96 max-w-full" |
| `features/settings/components/settings-dialogs/WristFeedNotificationsDialog.tsx:558` | dialog ← inside <DialogContent> (L375, portal, not .entity-dialog) | <SelectTrigger> |
| `features/settings/components/settings-tabs/AssistantSettingsGroup.tsx:186` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> class="w-full" |
| `features/settings/components/settings-tabs/SettingsAdvancedTab.tsx:308` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> class="w-36" |
| `features/settings/components/settings-tabs/SettingsInterfaceAppearanceCard.tsx:289` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> class="w-56" |
| `features/settings/components/settings-tabs/SettingsInterfaceDisplayCards.tsx:182` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> class="w-56" |
| `features/settings/components/settings-tabs/SettingsInterfaceDisplayCards.tsx:232` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> class="w-56" |
| `features/settings/components/settings-tabs/SettingsNotificationsInAppCard.tsx:70` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> class="w-56" |
| `features/settings/components/settings-tabs/SettingsNotificationsTab.tsx:211` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> class="w-56" |
| `features/settings/components/settings-tabs/SettingsNotificationsTab.tsx:302` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> class="w-56" |
| `features/settings/components/settings-tabs/SettingsNotificationsTab.tsx:352` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> class="w-72" |
| `features/settings/components/settings-tabs/SettingsNotificationsTab.tsx:451` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <SelectTrigger> class="w-72" |
| … | | 共 96 处，其余见 table.json |

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

### badge
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/dialogs/avatar-dialog/components/AvatarDialogHeaderBadges.tsx:21` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=public default outline ⟨dynamic⟩ |
| `components/dialogs/avatar-dialog/components/AvatarDialogHeaderBadges.tsx:31` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=secondary |
| `components/dialogs/avatar-dialog/components/AvatarDialogHeaderBadges.tsx:37` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=destructive |
| `components/dialogs/avatar-dialog/components/AvatarDialogTagList.tsx:17` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:557` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:563` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:566` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=secondary |
| `components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:569` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> |
| `components/dialogs/group-dialog/GroupDialogTabPanels.tsx:133` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline class="max-w-full" |
| `components/dialogs/group-dialog/GroupDialogTabPanels.tsx:498` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/group-dialog/GroupDialogTabPanels.tsx:512` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/group-dialog/GroupDialogViewParts.tsx:49` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline class="shrink-0 text-xs" |
| `components/dialogs/group-dialog/GroupDialogViewParts.tsx:65` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline class="shrink-0 text-xs" |
| `components/dialogs/group-dialog/GroupMembersPanel.tsx:228` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline class="text-muted-foreground h-4 max-w-full px-1.5 text-[10px] font-normal" |
| `components/dialogs/group-dialog/GroupMembersPanel.tsx:242` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline class="text-muted-foreground h-4 px-1.5 text-[10px] font-normal tabular-nums" |
| `components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:99` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline class="gap-1" |
| `components/dialogs/group-dialog/ModerationStatusBadge.tsx:25` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=destructive |
| `components/dialogs/group-dialog/ModerationStatusBadge.tsx:28` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline class="⟨MODERATION_STATUS_TONE_CLASS_NAME[tone]⟩" |
| `components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:108` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=destructive |
| `components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:113` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=destructive |
| `components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:118` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=destructive |
| `components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:125` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:130` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=secondary |
| `components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:136` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:384` | popover ← inside <PopoverContent> (L357, portal) | <Badge> variant=outline class="mx-auto max-w-full" |
| `components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:406` | popover ← inside <PopoverContent> (L357, portal) | <Badge> variant=outline secondary ⟨dynamic⟩ class="shrink-0" |
| `components/dialogs/user-dialog/components/UserDialogIdentityParts.tsx:40` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=ghost class="text-muted-foreground max-w-52 cursor-pointer px-1 text-xs font-normal" |
| `components/dialogs/user-dialog/components/UserDialogIdentityParts.tsx:70` | popover ← inside <HoverCardContent> (L64, portal) | <Badge> variant=secondary |
| `components/dialogs/world-dialog/WorldDialogHeaderSection.tsx:589` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline class="max-w-full" |
| `components/dialogs/world-dialog/WorldDialogHeaderSection.tsx:596` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline class="max-w-full" |
| `components/dialogs/world-dialog/WorldDialogTabPanels.tsx:134` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline class="w-fit" |
| `components/dialogs/world-dialog/WorldDialogTabPanels.tsx:228` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/world-dialog/WorldDialogTabPanels.tsx:234` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/world-dialog/WorldDialogTabPanels.tsx:240` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/world-dialog/WorldDialogTabPanels.tsx:619` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/world-dialog/WorldDialogTabPanels.tsx:633` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/dialogs/world-dialog/WorldDialogTabPanels.tsx:647` | entity-dialog ← entity (user/world/avatar/group) dialog file | <Badge> variant=outline |
| `components/groups/GroupCard.tsx:65` | main-content ← default: routed page / shared component | <Badge> variant=secondary class="shrink-0 rounded-sm px-1.5 tabular-nums" |
| `components/groups/GroupCard.tsx:77` | main-content ← default: routed page / shared component | <Badge> variant=outline class="max-w-full min-w-0 justify-start rounded-sm px-1.5 font-mono" |
| `components/hosts/system-dialogs/UpdaterDialog.tsx:249` | dialog ← inside <DialogContent> (L231, portal, not .entity-dialog) | <Badge> variant=secondary |
| `components/hosts/tools-dialogs/LlmEndpointsDialog.tsx:706` | dialog ← generic dialog file | <Badge> variant=secondary outline ⟨dynamic⟩ |
| `components/hosts/tools-dialogs/SyncWorkflowDialog.tsx:159` | dialog ← inside <DialogContent> (L117, portal, not .entity-dialog) | <Badge> variant=⟨statusBadgeVariant(
                    ⟩ |
| `components/hosts/tools-dialogs/presence-automation/AutomationRuleLayout.tsx:44` | dialog ← generic dialog file | <Badge> variant=secondary class="max-w-full truncate" |
| `components/instances/CurrentInstanceBadge.tsx:10` | main-content ← default: routed page / shared component | <Badge> variant=outline class="border-border/70 bg-muted/70 text-muted-foreground h-4 rounded px-1 py-0 text-[10px] leadi…" |
| `components/instances/InstanceActionSummary.tsx:168` | main-content ← default: routed page / shared component | <Badge> class="bg-amber-500/15 text-amber-300" |
| `components/instances/InstanceVisitedBadge.tsx:34` | main-content ← default: routed page / shared component | <Badge> variant=outline class="border-border/70 text-muted-foreground h-4 rounded px-1 py-0 text-[10px] leading-none font…" |
| `components/layout/AppMenuBar.tsx:198` | app-chrome ← components/layout (titlebar/statusbar/shell) | <Badge> variant=secondary class="h-4 rounded-md px-1 text-[10px] leading-none shadow-none" |
| `components/layout/ListSectionHeader.tsx:47` | app-chrome ← components/layout (titlebar/statusbar/shell) | <Badge> variant=outline class="text-muted-foreground shrink-0 font-normal tabular-nums" |
| `components/layout/useTitleBarActions.tsx:118` | app-chrome ← components/layout (titlebar/statusbar/shell) | <Badge> variant=secondary class="h-5 shrink-0 rounded-md px-1.5 text-[10px] leading-none shadow-none" |
| `components/layout/useTitleBarActions.tsx:383` | app-chrome ← components/layout (titlebar/statusbar/shell) | <Badge> class="absolute top-0.5 right-1 h-3 min-w-3 rounded-full px-0.5 py-0 text-[7px] leading-none" |
| `components/search/FriendMultiSelectList.tsx:179` | main-content ← default: routed page / shared component | <Badge> variant=outline class="mr-1.5 max-w-32 shrink-0 truncate" |
| `components/sidebar/friends-sidebar/FriendsSidebarHeaders.tsx:76` | side-panel ← components/sidebar | <Badge> variant=outline class="text-muted-foreground ml-1.5 font-normal tabular-nums" |
| `components/sidebar/side-panel/SidePanelCustomTabsDialog.tsx:588` | dialog ← inside <DialogContent> (L427, portal, not .entity-dialog) | <Badge> variant=secondary class="shrink-0" |
| `components/sidebar/side-panel/SidePanelCustomTabsDialog.tsx:603` | dialog ← inside <DialogContent> (L427, portal, not .entity-dialog) | <Badge> variant=secondary class="shrink-0" |
| `components/sidebar/side-panel/SidePanelCustomTabsDialog.tsx:757` | dialog ← inside <DialogContent> (L427, portal, not .entity-dialog) | <Badge> variant=secondary outline ⟨dynamic⟩ class="shrink-0 border-amber-500/40 text-amber-600 dark:text-amber-500 ⟨dynamic⟩" |
| `features/dashboard/components/widgets/DashboardInstanceWidget.tsx:366` | main-content ← default: routed page / shared component | <Badge> variant=default class="px-1.5" |
| `features/dashboard/components/widgets/DashboardInstanceWidget.tsx:374` | main-content ← default: routed page / shared component | <Badge> variant=secondary class="px-1.5" |
| `features/dashboard/components/widgets/DashboardInstanceWidget.tsx:382` | main-content ← default: routed page / shared component | <Badge> variant=outline class="px-1.5" |
| `features/favorites/components/FavoritesGroupRail.tsx:578` | main-content ← default: routed page / shared component | <Badge> variant=outline class="text-muted-foreground shrink-0 font-normal tabular-nums" |
| `features/friends/components/FriendsLocationsViewParts.tsx:122` | main-content ← default: routed page / shared component | <Badge> variant=outline class="text-muted-foreground shrink-0 font-normal tabular-nums" |
| `features/friends/components/FriendsLocationsViewParts.tsx:175` | main-content ← default: routed page / shared component | <Badge> variant=outline class="text-muted-foreground shrink-0 font-normal tabular-nums" |
| `features/game-log/components/GameLogSessionEventRow.tsx:401` | main-content ← default: routed page / shared component | <Badge> variant=secondary class="h-4 shrink-0 px-1 text-xs" |
| `features/game-log/components/GameLogSessionsView.tsx:460` | main-content ← default: routed page / shared component | <Badge> variant=outline class="h-4 shrink-0 px-1 text-xs" |
| `features/my-avatars/ManageAvatarTagsDialog.tsx:192` | dialog ← inside <DialogContent> (L137, portal, not .entity-dialog) | <Badge> variant=secondary class="w-fit" |
| `features/my-avatars/components/MyAvatarGridCard.tsx:281` | main-content ← default: routed page / shared component | <Badge> variant=secondary class="max-w-16 min-w-0 shrink truncate shadow-sm ⟨dynamic⟩" |
| `features/my-avatars/components/MyAvatarGridCard.tsx:300` | main-content ← default: routed page / shared component | <Badge> variant=outline class="bg-background/80 text-foreground/90 shrink-0 shadow-sm ⟨dynamic⟩" |
| `features/my-avatars/components/MyAvatarGridCard.tsx:323` | popover ← inside <HoverCardContent> (L317, portal) | <Badge> variant=secondary class="max-w-full truncate ⟨dynamic⟩" |
| `features/my-avatars/components/MyAvatarsViewParts.tsx:448` | popover ← inside <PopoverContent> (L358, portal) | <Badge> variant=secondary class="cursor-pointer select-none border-ring border-transparent opacity-80 hover:opacity-100 ⟨dy…" |
| `features/notifications/VrcNotificationCenterHost.tsx:156` | dialog ← inside <SheetContent> (L140, portal, not .entity-dialog) | <Badge> variant=default class="h-5 min-w-5 justify-center px-1.5 tabular-nums" |
| `features/notifications/drawer/NotificationDrawerRow.tsx:230` | main-content ← default: routed page / shared component | <Badge> class="border-0 bg-violet-500/15 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300 text-…" |
| `features/player-list/components/PlayerListViewParts.tsx:203` | main-content ← default: routed page / shared component | <Badge> variant=outline |
| `features/player-list/components/PlayerListViewParts.tsx:207` | main-content ← default: routed page / shared component | <Badge> variant=outline |
| `features/player-list/components/PlayerListViewParts.tsx:211` | main-content ← default: routed page / shared component | <Badge> variant=outline |
| `features/player-list/components/PlayerListViewParts.tsx:218` | main-content ← default: routed page / shared component | <Badge> variant=outline class="gap-1" |
| `features/player-list/components/PlayerListViewParts.tsx:240` | main-content ← default: routed page / shared component | <Badge> variant=outline |
| `features/player-list/components/PlayerListViewParts.tsx:245` | main-content ← default: routed page / shared component | <Badge> variant=outline |
| `features/player-list/components/PlayerListViewParts.tsx:252` | main-content ← default: routed page / shared component | <Badge> variant=outline |
| `features/player-list/components/PlayerListViewParts.tsx:255` | main-content ← default: routed page / shared component | <Badge> variant=outline class="gap-1 tabular-nums" |
| `features/player-list/components/PlayerListViewParts.tsx:267` | main-content ← default: routed page / shared component | <Badge> variant=outline class="gap-1 tabular-nums" |
| `features/player-list/components/PlayerListViewParts.tsx:277` | main-content ← default: routed page / shared component | <Badge> variant=outline class="gap-1 tabular-nums" |
| … | | 共 102 处，其余见 table.json |

### tabs-trigger
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/dialogs/BoopEmojiDialog.tsx:399` | dialog ← inside <DialogContent> (L379, portal, not .entity-dialog) | <TabsTrigger> class="⟨tabTriggerClassName⟩" |
| `components/dialogs/BoopEmojiDialog.tsx:406` | dialog ← inside <DialogContent> (L379, portal, not .entity-dialog) | <TabsTrigger> class="⟨tabTriggerClassName⟩" |
| `components/dialogs/BoopEmojiDialog.tsx:413` | dialog ← inside <DialogContent> (L379, portal, not .entity-dialog) | <TabsTrigger> class="⟨tabTriggerClassName⟩" |
| `components/dialogs/BoopEmojiDialog.tsx:420` | dialog ← inside <DialogContent> (L379, portal, not .entity-dialog) | <TabsTrigger> class="⟨tabTriggerClassName⟩" |
| `components/dialogs/EntityDialogScaffold.tsx:164` | entity-dialog ← entity (user/world/avatar/group) dialog file | <TabsTrigger> class="text-muted-foreground hover:text-foreground h-11 flex-none rounded-none border-0 bg-transp…" |
| `components/dialogs/InviteMessageDialog.tsx:169` | dialog ← inside <DialogContent> (L148, portal, not .entity-dialog) | <TabsTrigger> |
| `components/dialogs/avatar-dialog/components/AvatarDialogPerformanceTab.tsx:318` | entity-dialog ← entity (user/world/avatar/group) dialog file | <TabsTab> |
| `components/dialogs/group-dialog/GroupModerationWorkspace.tsx:224` | entity-dialog ← entity (user/world/avatar/group) dialog file | <TabsTrigger> class="flex-none px-3" |
| `components/dialogs/group-dialog/GroupRowList.tsx:302` | entity-dialog ← entity (user/world/avatar/group) dialog file | <TabsTrigger> class="flex-none px-3" |
| `components/dialogs/user-dialog/components/UserDialogFavoriteWorldGroups.tsx:125` | entity-dialog ← entity (user/world/avatar/group) dialog file | <TabsTrigger> class="flex-none gap-1.5" |
| `components/dialogs/user-dialog/components/UserDialogProfileDecorationsPanel.tsx:120` | entity-dialog ← entity (user/world/avatar/group) dialog file | <TabsTrigger> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:368` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <TabsTrigger> |
| `components/dialogs/world-dialog/WorldNewInstanceDialog.tsx:371` | dialog ← inside <DialogContent> (L348, portal, not .entity-dialog) | <TabsTrigger> |
| `components/hosts/system-dialogs/ChangelogDialog.tsx:258` | dialog ← inside <DialogContent> (L228, portal, not .entity-dialog) | <TabsTrigger> |
| `components/layout/ToolbarControls.tsx:163` | app-chrome ← components/layout (titlebar/statusbar/shell) | <TabsTrigger> |
| `components/sidebar/SidePanel.tsx:507` | side-panel ← components/sidebar | <TabsTrigger> class="data-active:bg-secondary h-auto w-full flex-col justify-center gap-0.5 px-0 py-1.5 sm:h-au…" |
| `components/sidebar/SidePanel.tsx:560` | side-panel ← components/sidebar | <TabsTrigger> class="data-active:bg-secondary h-auto w-full flex-col justify-center gap-0.5 px-0 py-1.5 sm:h-au…" |
| `features/settings/SettingsPage.tsx:81` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <TabsTrigger> class="justify-start gap-2.5 px-3 py-1.5" |
| `features/settings/components/settings-dialogs/CustomFontDialog.tsx:232` | dialog ← inside <DialogContent> (L205, portal, not .entity-dialog) | <TabsTrigger> |
| `features/settings/components/settings-dialogs/CustomFontDialog.tsx:241` | dialog ← inside <DialogContent> (L205, portal, not .entity-dialog) | <TabsTrigger> |
| `features/settings/components/settings-dialogs/WristFeedNotificationsDialog.tsx:395` | dialog ← inside <DialogContent> (L375, portal, not .entity-dialog) | <TabsTrigger> class="h-auto w-full justify-between gap-3 px-3 py-2.5 text-left whitespace-normal sm:h-auto" |
| `features/themes/components/CommunityThemesSection.tsx:77` | main-content ← default: routed page / shared component | <TabsTrigger> |
| `features/themes/components/CommunityThemesSection.tsx:80` | main-content ← default: routed page / shared component | <TabsTrigger> |
| `features/tools/InventoryPage.tsx:425` | main-content ← default: routed page / shared component | <TabsTrigger> class="flex-none" |
| `features/tools/components/GalleryTabs.tsx:43` | main-content ← default: routed page / shared component | <TabsTrigger> class="flex-none" |
| `features/tools/components/ToolsPageContent.tsx:830` | main-content ← default: routed page / shared component | <TabsTrigger> class="justify-start gap-2 px-2.5" |

### toggle-group-item
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/dialogs/group-dialog/GroupMembersPanel.tsx:407` | entity-dialog ← entity (user/world/avatar/group) dialog file | <ToggleGroupItem> class="text-xs" |
| `components/dialogs/group-dialog/GroupPostEditorDialog.tsx:225` | dialog ← inside <DialogContent> (L143, portal, not .entity-dialog) | <ToggleGroupItem> |
| `components/dialogs/group-dialog/GroupProfileEditDialog.tsx:226` | dialog ← inside <DialogContent> (L90, portal, not .entity-dialog) | <ToggleGroupItem> |
| `components/dialogs/user-dialog/UserSelfEditDialogs.tsx:239` | dialog ← inside <DialogContent> (L99, portal, not .entity-dialog) | <ToggleGroupItem> class="h-9 min-w-0 flex-1 basis-[calc(50%-0.25rem)] justify-center gap-2 px-2 sm:basis-0" |
| `components/dialogs/user-dialog/components/UserDialogDataTabs.tsx:139` | entity-dialog ← entity (user/world/avatar/group) dialog file | <ToggleGroupItem> |
| `components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:468` | popover ← inside <PopoverContent> (L357, portal) | <ToggleGroupItem> class="min-w-0 justify-center" |
| `components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:483` | popover ← inside <PopoverContent> (L357, portal) | <ToggleGroupItem> class="min-w-0 justify-center" |
| `components/hosts/tools-dialogs/AppLauncherDialog.tsx:955` | dialog ← generic dialog file | <ToggleGroupItem> class="flex-1" |
| `components/hosts/tools-dialogs/GroupCalendarDialog.tsx:603` | dialog ← inside <DialogContent> (L501, portal, not .entity-dialog) | <ToggleGroupItem> |
| `components/hosts/tools-dialogs/GroupCalendarDialog.tsx:607` | dialog ← inside <DialogContent> (L501, portal, not .entity-dialog) | <ToggleGroupItem> |
| `components/hosts/tools-dialogs/GroupCalendarDialog.tsx:611` | dialog ← inside <DialogContent> (L501, portal, not .entity-dialog) | <ToggleGroupItem> |
| `components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:318` | dialog ← generic dialog file | <ToggleGroupItem> |
| `components/layout/ToolbarControls.tsx:206` | app-chrome ← components/layout (titlebar/statusbar/shell) | <ToggleGroupItem> |
| `components/layout/ToolbarControls.tsx:352` | app-chrome ← components/layout (titlebar/statusbar/shell) | <ToggleGroupItem> |
| `components/layout/ToolbarControls.tsx:368` | app-chrome ← components/layout (titlebar/statusbar/shell) | <ToggleGroupItem> |
| `features/activity/components/ActivityViewOption.tsx:20` | main-content ← default: routed page / shared component | <Toggle> size=sm class="text-muted-foreground data-pressed:text-foreground shrink-0 text-xs" |
| `features/activity/components/ActivityViewOption.tsx:59` | main-content ← default: routed page / shared component | <ToggleGroupItem> class="text-xs" |
| `features/dashboard/components/DashboardEditorWorkspace.tsx:97` | main-content ← default: routed page / shared component | <ToggleGroupItem> |
| `features/favorites/FavoriteImportPage.tsx:508` | main-content ← default: routed page / shared component | <ToggleGroupItem> |
| `features/favorites/FavoriteImportPage.tsx:510` | main-content ← default: routed page / shared component | <ToggleGroupItem> |
| `features/favorites/components/FavoritesToolbar.tsx:257` | main-toolbar ← inside <PageToolbar> (L117) | <ToggleGroupItem> class="w-full min-w-0 justify-center px-2" |
| `features/friends/components/FriendsLocationsToolbar.tsx:168` | main-toolbar ← inside <PageToolbar> (L73) | <ToggleGroupItem> class="w-full min-w-0 justify-center px-2" |
| `features/my-avatars/components/MyAvatarsViewParts.tsx:384` | popover ← inside <PopoverContent> (L358, portal) | <ToggleGroupItem> class="w-full min-w-0 justify-center px-2" |
| `features/my-avatars/components/MyAvatarsViewParts.tsx:424` | popover ← inside <PopoverContent> (L358, portal) | <ToggleGroupItem> class="w-full min-w-0 justify-center px-2" |
| `features/my-avatars/components/MyAvatarsViewParts.tsx:531` | main-content ← default: routed page / shared component | <ToggleGroupItem> class="w-full min-w-0 justify-center px-2" |
| `features/settings/components/SettingsField.tsx:189` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <ToggleGroupItem> |
| `features/settings/components/settings-tabs/SettingsInterfaceProfileAppearanceCard.tsx:69` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <ToggleGroupItem> |
| `features/themes/components/BackgroundImageSection.tsx:893` | main-content ← default: routed page / shared component | <ToggleGroupItem> class="px-3" |
| `features/themes/components/ThemeSourceSelector.tsx:59` | main-content ← default: routed page / shared component | <ToggleGroupItem> |
| `features/themes/components/ThemeSourceSelector.tsx:66` | main-content ← default: routed page / shared component | <ToggleGroupItem> |
| `features/themes/components/ThemeSourceSelector.tsx:73` | main-content ← default: routed page / shared component | <ToggleGroupItem> |
| `features/tools/InventoryPage.tsx:491` | main-content ← default: routed page / shared component | <ToggleGroupItem> |
| `features/tools/components/GalleryGridDensityMenu.tsx:50` | main-content ← default: routed page / shared component | <ToggleGroupItem> class="w-full min-w-0 justify-center px-2" |
| `features/tools/components/GalleryPrintsTab.tsx:254` | main-content ← default: routed page / shared component | <ToggleGroupItem> |
| `features/tools/components/ScreenshotGalleryView.tsx:416` | main-content ← default: routed page / shared component | <ToggleGroupItem> class="w-full min-w-0 justify-center px-2" |

### progress
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/IndeterminateProgress.tsx:11` | main-content ← default: routed page / shared component | <Progress> class="indeterminate-progress ⟨dynamic⟩" |
| `components/dialogs/group-dialog/GroupModerationBanImportDialog.tsx:233` | dialog ← inside <DialogContent> (L174, portal, not .entity-dialog) | <Progress> class="h-3" |
| `components/hosts/system-dialogs/DataDirMigrationDialog.tsx:194` | dialog ← inside <AlertDialogContent> (L143, portal, not .entity-dialog) | <Progress> |
| `components/hosts/system-dialogs/ProfileBackupDialogs.tsx:76` | dialog ← generic dialog file | <Progress> |
| `components/hosts/tools-dialogs/NoteExportDialog.tsx:407` | dialog ← inside <DialogContent> (L334, portal, not .entity-dialog) | <Progress> class="flex-1" |
| `components/hosts/tools-dialogs/ProfileBackupDialog.tsx:311` | dialog ← inside <DialogContent> (L247, portal, not .entity-dialog) | <Progress> |
| `components/hosts/tools-dialogs/SyncWorkflowDialog.tsx:187` | dialog ← inside <DialogContent> (L117, portal, not .entity-dialog) | <Progress> |
| `features/favorites/FavoriteImportPage.tsx:362` | main-content ← default: routed page / shared component | <Progress> |
| `features/tools/galleryBulkProgressToast.tsx:34` | main-content ← default: routed page / shared component | <Progress> |
| `features/tools/screenshotExportProgressToast.tsx:64` | main-content ← default: routed page / shared component | <Progress> |

### kbd
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/keyboard/KeyboardShortcut.tsx:65` | main-content ← default: routed page / shared component | <Kbd> class="⟨kbdClassName⟩" |
| `features/feed/components/FeedSearchBox.tsx:226` | menu-popup ← inside <ComboboxContent> (L197, portal, bg-popover/70) | <Kbd> |

