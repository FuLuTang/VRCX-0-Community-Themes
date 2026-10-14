# R9 覆盖率审计摘要（只读；详表见 coverage-table.md，机器可读版见 coverage.json）
统计：原语 70 条，页面/共享 130 条。P0 未覆盖 8 条（去重后是 6 个问题），P0 部分覆盖 16 条。证据均为 src/ 下的 文件:行；“覆盖文件:行”指 runtime/ 下的文件。

## Top 清单（按优先级；未覆盖/部分）
1. P0 未覆盖｜工具栏多选筛选片 `[data-slot=toggle-group][data-variant=default]`：ToolbarControls.tsx:324，Feed FeedToolbar.tsx:187，GameLog GameLogToolbar.tsx:256（controls-r9 明确排除了它）→ G1
2. P0 未覆盖｜数据表行 hover/选中/展开：table.tsx:62、DataTableView.tsx:317，只有令牌色，没有像素选中条和 focus 框 → G4
3. P0 未覆盖｜`hover-card-content` 外框：hover-card.tsx:43，用户/世界悬浮卡 12 处；popups-r9 的 :is() 列表里没有它 → G3
4. P0 未覆盖｜Feed 搜索框 InputGroup + combobox chips：FeedSearchBox.tsx:108,133 → G1
5. P0 未覆盖｜好友列表头像列是圆形 FadeInImage：FriendListColumns.tsx:182-190 → G5
6. P0 未覆盖｜通知中心抽屉 `sheet-popup`：VrcNotificationCenterHost.tsx:140 → G3
7. P0 部分｜全局工具栏搜索 ToolbarSearch（18 页）：只有 Tools 页 #chart 生效（tools-ui-r9.css:6-40）→ G1
8. P0 部分｜通用 tooltip：只有状态栏版本（popups-r9.css:121），其余 99 个文件仍是浅色圆角气泡 → G3
9. P0 部分｜button 各 variant：只有 2px 圆角和 focus（windose-runtime.css:70-71），缺 hover/active/disabled 像素态 → G2
10. P0 部分｜badge 6 个 variant 仍是 rounded-4xl 药丸（51 个文件）；只有侧栏/菜单栏/铃铛/主题卡有作用域样式 → G2
11. P0 部分｜input 的 focus/placeholder/invalid/disabled 只在登录页有（login-r8.css:192-212）→ G1
12. P0 部分｜表头只有像素字体（windose-runtime.css:7），没有凸起和分隔 → G4；搜索结果卡（outline Button）/好友位置卡的 hover → G2/G4
13. P1｜textarea（0 条规则）、input-group 设置页、UserDialogStatusDistribution 原生 range（:311，选择器不匹配 user-dialog-r8.css:25）→ G1
14. P1｜toast、sheet（快捷键/互关图）、select 滚动按钮 → G3；alert、分页、SelectionActionBar/SearchPagination/新条目 pill、PageScaffold 外的 tabs → G2
15. P1｜空状态 empty-*、calendar 日格、InstanceHistory 选中条、GameLog 会话头、Feed 列面板、Dashboard 面板、TileShell 选中、Activity `--act-*` 色阶（主题没定义，echarts/热力图用的还是默认色）→ G4
16. P1｜方形群组 Avatar 被全局像素圆误切（GroupCard.tsx:47、NotificationRowParts.tsx:94、PlayerListGroupSelector.tsx:40 等）；Dashboard 状态灯是圆形（DashboardFeedEntryContent.tsx:166）；群组成员圆头像（GroupMembersPanel.tsx:180）→ G5
17. 主题改不到（需改 JS）｜RelationshipTimeline 的 echarts COLORS 写死（RelationshipTimelinePageImpl.tsx:29-35），sigma 社区调色板写死（mutualFriendsPalette.ts:60-68）

## 建议并行任务组（新建文件；各组 write scope 互不重叠，也避开进行中文件）
- **G1 `fields-toolbar-r10.css`**（30 项，P0 7）：input/textarea/input-group（包括全局 ToolbarSearch）/field/label/kbd/input-otp、toggle-group default 筛选片、combobox-chip、原生 range/checkbox/color/file/select。不碰 select-trigger、combobox-trigger、[data-slot=checkbox]、[data-slot=slider]（form-controls-r9）；推广 ToolbarSearch 时要和 tools-ui-r9 的 #chart 规则协商。
- **G2 `buttons-badges-r10.css`**（25 项，P0 6）：button 各 variant、badge、pagination、separator、alert、浮动药丸条、PageScaffold 外的 tabs、单独的 toggle。用 `:where(.vrcx-0-main-content,.vrcx-0-side-panel)` 限定作用域，排除 titlebar/statusbar/login/dialog-content/alert-dialog/弹出层/.object-row。
- **G3 `overlays-r10.css`**（15 项，P0 4）：通用 tooltip、hover-card、toast、sheet、select 滚动按钮、隐私锁卡、assistant 气泡。不改 dialog/alert-dialog（dialogs-r9），不改 popups-r9.css 本身，只新增选择器。
- **G4 `data-surfaces-r10.css`**（39 项，P0 6）：表格行/表头（.vrcx-0-data-table 与 .app-data-table）、empty、calendar、resizable 手柄、card-footer、各页面板/列表选中、TileShell（gallery/inventory/my-groups）、`--act-*` 变量、自定义 rounded-full 进度条。不碰 favorites/browse-history 的 .object-row，也不碰 controls-r9 已有的 tile/主题卡/activity-card。
- **G5 `avatars-residual-r10.css`**（21 项，P0 1）：剩余的非 data-slot 用户圆头像、圆形骨架、Dashboard 状态灯、未读/导航提示点、群组方形 Avatar 修正、avatar-group。不覆写 avatars-status-r9.css 已列出的目标，只新增选择器。
- 新文件需要追加到 build-runtime.mjs 的 parts 里，建议放在 avatars-status-r9 之后、loader-r9 之前；由主 agent 统一改，避免冲突。

## 需实机确认
小尺寸 avatar-group（size-4/5）的环遮罩效果；搜索结果 Avatar 用于群组/世界时是否应为方形；GameLog AvatarGroup 叠放；登录页 footer 的 ghost/link 按钮；UserDialogEntityList 用户圆图是否命中 user-dialog-r8.css:4；VRChat Log 表格的实际 DOM。
