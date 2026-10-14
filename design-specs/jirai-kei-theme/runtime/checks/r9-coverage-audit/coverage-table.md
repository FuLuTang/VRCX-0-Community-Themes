# VRCX-0 Jirai Kei · Windose Dark — R9 覆盖率审计对照表

只读审计，没有修改任何源码或主题文件。源码镜像：`/tmp/vrcx-win-src-r9/src`；主题源：`design-specs/jirai-kei-theme/runtime/*.css`（按 `build-runtime.mjs:46` 的 parts 顺序拼装）+ `original-assets/icons/dist/jirai-icons.css`。

判定口径：
- **已覆盖**：主题里有能真实匹配源码 DOM 的规则，主要状态齐全。
- **部分**：只覆盖了圆角/字体/某个页面作用域，或者缺少 hover/focus/selected/disabled 等状态。
- **未覆盖**：没有任何规则，只是继承基础主题的令牌配色（`--radius` 仍为 0.5rem，形状和像素语言都没有）。
- **进行中**：属于 dialogs-r9 / favorites-r9 / browse-history-r9 / form-controls-r9 / avatars-status-r9。
- **需实机确认**：选择器是否命中，或命中后的效果是否合适，需要在 Windows 实机上看。

基础令牌：主题沿用 `themes/jirai-kei-theme/theme.css` 的 :root 令牌，并做了调色映射（`build-runtime.mjs:12-13`）。所有组件的颜色都会跟着变，但这一项不算作“覆盖”。Tailwind v4 的工具类在 `@layer` 里，主题 CSS 不分层，所以 `windose-runtime.css:70` 会把所有 `[data-slot=button]`（包括带 rounded-full 的）压成 2px 圆角。

统计：原语 70 条（已覆盖 17 · 部分 21 · 未覆盖 24 · 进行中 7 · N/A 1）；页面/共享 130 条（已覆盖 29 · 部分 29 · 未覆盖 56 · 进行中 10 · 需实机确认 6）。**P0 未覆盖 8 条，P0 部分覆盖 16 条。**

## 表一：原语组件（src/ui/shadcn）

| 元素 | 源码位置 (src/) | data-slot/选择器锚点 | 主题覆盖情况 | 覆盖文件:行 (runtime/) | 缺失状态或问题 | 建议 | 优先级 | 任务组 |
|---|---|---|---|---|---|---|---|---|
| button 基础(全部 variant/size) | `ui/shadcn/button.tsx:51` | `[data-slot=button]` | 部分 | windose-runtime.css:70; windose-runtime.css:71 | 仅 2px 圆角 + focus-visible 虚线；无全局 hover/active/disabled 像素态，底色仅令牌；class rounded-full 的按钮也被压成 2px | 统一像素凸起边(inset 1px 亮/暗)+:active 下沉1px(motion-r8 r8-window-press steps)；disabled 用点阵降饱和 | P0 | G2 |
| button variant=default | `ui/shadcn/button.tsx:12` | `[data-slot=button][data-variant=default]` | 部分 | login-r8.css:175-186; controls-r9.css:143-172 | 仅登录提交按钮、Themes 社区主题卡内有像素主按钮；其余 hover 仅 bg-primary/80 | 推广 login-r8.css:175 粉色像素主按钮语言 | P0 | G2 |
| button variant=outline | `ui/shadcn/button.tsx:14` | `[data-slot=button][data-variant=outline]` | 部分 | login-r8.css:161-172 | 仅登录页；搜索结果卡、分页 active、工具栏按钮均为令牌色 | 推广 login-r8.css:161 像素描边按钮 | P0 | G2 |
| button variant=secondary | `ui/shadcn/button.tsx:16` | `[data-slot=button][data-variant=secondary]` | 部分 | login-r8.css:161-172 | 仅登录页 | 同 outline，填 --wd-raised | P1 | G2 |
| button variant=ghost | `ui/shadcn/button.tsx:18` | `[data-slot=button][data-variant=ghost]` | 部分 | popups-r9.css:26-41; side-panel-r4.css:137-143; window-chrome.css:53; login-r8.css:119-136 | 主内容区 ghost/icon 按钮 hover 仅 --state-hover-surface，无像素 hover/pressed | 主内容区套 side-panel-r4.css:143 hover 方块或 popups-r9 斜切粉条 | P0 | G2 |
| button variant=destructive | `ui/shadcn/button.tsx:20` | `[data-slot=button][data-variant=destructive]` | 未覆盖 | — | 仅令牌（菜单内 destructive item 由 popups-r9.css:42 覆盖，不是按钮） | 借 chrome-r8.css:83 关闭按钮红色 hover 语言做像素警告按钮 | P1 | G2 |
| button variant=link | `ui/shadcn/button.tsx:22` | `[data-slot=button][data-variant=link]` | 部分 | login-r8.css:222-225 | 登录页外仍为普通下划线 | 像素虚线下划线 + 粉色 hover | P2 | G2 |
| input | `ui/shadcn/input.tsx:10` | `[data-slot=input]` | 部分 | windose-runtime.css:70; login-r8.css:192-212 | 全局只有 2px 圆角；缺 focus-visible/placeholder/aria-invalid/disabled 像素态（登录页已有完整一套） | 把 login-r8.css:192-212 的输入框语言去作用域推广 | P0 | G1 |
| input[type=color] | `features/themes/components/AccentColorPicker.tsx:107` | `[data-slot=input][type=color]` | 未覆盖 | — | 原生色块圆角/系统边框（另见 settings UserColors:222、ProfileBackgroundPicker:41） | ::-webkit-color-swatch 方角 1px --wd-frame 边 | P2 | G1 |
| input[type=file]（可见） | `components/dialogs/invite-message/InviteMessagePanel.tsx:351` | `[data-slot=input][type=file]` | 未覆盖 | — | ::file-selector-button 为系统样式（其余 file input 均 hidden） | ::file-selector-button 套像素 outline 按钮 | P2 | G1 |
| input[type=time] | `components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:260` | `input[type=time]` | 部分 | windose-runtime.css:116 | 仅替换时钟图标 | 随 input 统一 | P2 | G1 |
| textarea | `ui/shadcn/textarea.tsx:8` | `[data-slot=textarea]` | 未覆盖 | — | 0 条规则（24 个文件使用：Custom CSS、反馈、弹窗） | 同 input 像素框，focus 虚线 | P1 | G1 |
| select-trigger | `ui/shadcn/select.tsx:41` | `[data-slot=select-trigger]` | 进行中 | windose-runtime.css:70 | form-controls-r9 负责；目前仅 2px 圆角 | — | P0 | — |
| select-content/item/label/separator | `ui/shadcn/select.tsx:85` | `[data-slot=select-content] [data-slot=select-item]` | 已覆盖 | popups-r9.css:4-52 | hover/highlighted/disabled/分隔/标签齐全 | — | P0 | — |
| select-scroll-up/down-button | `ui/shadcn/select.tsx:168` | `[data-slot=select-scroll-up-button]` | 未覆盖 | — | 长列表滚动箭头条为默认 | 并入 popups 语言（小三角像素箭头） | P2 | G3 |
| combobox-trigger/input | `ui/shadcn/combobox.tsx:29` | `[data-slot=combobox-trigger]` | 进行中 | — | form-controls-r9 负责 | — | P1 | — |
| combobox-content/item/label/separator | `ui/shadcn/combobox.tsx:111` | `[data-slot=combobox-content]` | 已覆盖 | popups-r9.css:4-52 | combobox-empty(:201) 无样式 | — | P1 | — |
| combobox-chips/chip/chip-remove | `ui/shadcn/combobox.tsx:231-281` | `[data-slot=combobox-chips] [data-slot=combobox-chip]` | 未覆盖 | — | 多选芯片 rounded-sm bg-muted；Feed 搜索框作用域芯片(FeedSearchBox.tsx:133) | 套 feed-badges.css:73 mono 像素标签；与 form-controls-r9 约定只碰 chip 不碰 trigger | P1 | G1 |
| checkbox | `ui/shadcn/checkbox.tsx:11` | `[data-slot=checkbox]` | 进行中 | login-r8.css:219 | form-controls-r9 负责；目前仅登录页 | — | P0 | — |
| dropdown checkbox/radio indicator | `ui/shadcn/dropdown-menu.tsx:125` | `[data-slot=dropdown-menu-checkbox-item-indicator]` | 部分 | popups-r9.css:26-41; jirai-icons.css | 行底色已覆盖，勾/点只靠图标替换 | — | P2 | — |
| radio（无 shadcn 原语） | `components/hosts/system-dialogs/DataDirMigrationDialog.tsx:227` | `Base UI Radio.Root（rounded-full size-4）` | 未覆盖 | — | 源码无 radio-group.tsx，仅此一处直接用 Base UI Radio | 保留圆形语义，改 1px 像素边+方点指示 | P2 | G1 |
| switch / switch-thumb | `ui/shadcn/switch.tsx:16` | `[data-slot=switch]` | 已覆盖 | pixel-controls.css:4-16 | 有 checked/sm/disabled/focus/减动效；无 hover 态 | 可补 hover 亮边 | P0 | — |
| slider | `ui/shadcn/slider.tsx:21-45` | `[data-slot=slider-thumb]` | 进行中 | — | form-controls-r9 负责；当前 0 条规则 | — | P1 | — |
| tabs-list 横向（主内容 PageScaffold） | `ui/shadcn/tabs.tsx:56` | `.vrcx-0-page-scaffold [data-slot=tabs-list]` | 已覆盖 | controls-r9.css:7-43 | hover/active/focus/disabled 齐全 | — | P0 | — |
| tabs-list（PageScaffold 外：弹窗/popover/嵌入） | `ui/shadcn/tabs.tsx:50` | `[data-slot=tabs-list]:not(.vrcx-0-page-scaffold *)` | 部分 | windose-runtime.css:72; motion-r8.css:83 | 只有 active 粉底+动画边；容器仍 rounded-lg + --state-pressed-surface | 把 controls-r9.css:7-43 推广到非 page-scaffold（弹窗内与 dialogs-r9 协调） | P1 | G2 |
| tabs 竖向 / underline | `ui/shadcn/tabs.tsx:65` | `[data-slot=tabs][data-orientation=vertical]` | 已覆盖 | settings-pixel.css:57-68; tools-ui-r9.css:47-77; side-panel-r4.css:83-125 | underline 仅 EntityDialogScaffold.tsx:160 与 SidePanel.tsx:494 使用，均已有作用域样式 | — | P1 | — |
| tab-indicator | `ui/shadcn/tabs.tsx:69` | `[data-slot=tab-indicator]` | 部分 | controls-r9.css:16; settings-pixel.css:62 | 作用域外仍是圆角浮块 | 随 tabs-list 推广隐藏/方块化 | P2 | G2 |
| toggle-group outline | `ui/shadcn/toggle-group.tsx:46` | `[data-slot=toggle-group][data-variant=outline]` | 已覆盖 | settings-pixel.css:45-52; controls-r9.css:49-81 | 全局像素分段 | — | P0 | — |
| toggle-group default（多选筛选片） | `components/layout/ToolbarControls.tsx:324` | `[data-slot=toggle-group][data-variant=default]` | 未覆盖 | — | controls-r9 注释明确排除；Feed/GameLog 类型筛选片(FeedToolbar.tsx:187, GameLogToolbar.tsx:256) | 像素分段 + [data-pressed] 粉底斜切（controls-r9.css:69-75 语言） | P0 | G1 |
| toggle（单独） | `ui/shadcn/toggle.tsx:42` | `[data-slot=toggle]:not([data-slot=toggle-group] > *)` | 未覆盖 | — | 仅 ActivityViewOption 使用 | 同分段按下态 | P2 | G2 |
| badge（default/secondary/destructive/outline/ghost/link） | `ui/shadcn/badge.tsx:7-23,48` | `[data-slot=badge][data-variant=*]` | 部分 | windose-runtime.css:32; window-chrome.css:271; badge-r9.css:18; controls-r9.css:139 | 仅侧栏分组/菜单栏/铃铛/主题卡；其余 51 个文件仍是 rounded-4xl 药丸 | 推广 feed-badges.css:73 方角 mono 像素标签，按 variant 换色 | P0 | G2 |
| card / card-header | `ui/shadcn/card.tsx:12,26` | `[data-slot=card]` | 已覆盖 | windose-runtime.css:59-61; settings-pixel.css:74-82; login-r8.css:58-102; controls-r9.css:88,126 | 基础边框+点线标题分隔；普通卡无标题条/投影 | — | P1 | — |
| card-title/description/action/footer | `ui/shadcn/card.tsx:39-85` | `[data-slot=card-footer]` | 未覆盖 | — | 仅令牌 | footer 顶部点线，与 card-header 对称 | P2 | G4 |
| table / table-header / table-head | `ui/shadcn/table.tsx:12,23,73` | `.vrcx-0-table-header, [data-slot=table-head]` | 部分 | windose-runtime.css:7; windose-runtime.css:54-55 | 表头只换像素字体+面色变量；无凸起/竖分隔，排序按钮仅令牌 | 表头套 window-chrome 标题条 inset 凸边 | P0 | G4 |
| table-row hover/selected/expanded | `ui/shadcn/table.tsx:60-62` | `[data-slot=table-row]:hover / [data-state=selected]` | 未覆盖 | — | 仅令牌 --state-hover/selected-surface；无像素选中标记、无行 focus 框 | 选中行左侧斜切粉条（popups-r9.css:35-41 语言）+ focus 虚线 | P0 | G4 |
| table-footer/caption | `ui/shadcn/table.tsx:47,102` | `[data-slot=table-footer]` | 未覆盖 | — | 仅令牌 | 点线分隔 | P2 | G4 |
| pagination（数据表分页） | `ui/shadcn/pagination.tsx:58` | `[data-slot=pagination-link]` | 未覆盖 | — | 借 button outline/ghost，仅 2px 圆角；DataTableView.tsx:418 | 套 controls-r9 像素分段，active 粉底 | P1 | G2 |
| scroll-area / 原生滚动条 | `ui/shadcn/scroll-area.tsx:48,58` | `[data-slot=scroll-area-thumb]` | 已覆盖 | pixel-controls.css:18-36 | 含 hover | — | P0 | — |
| separator | `ui/shadcn/separator.tsx:14` | `[data-slot=separator]` | 未覆盖 | — | 仅分段控件内 separator 有样式（settings-pixel.css:51, controls-r9.css:78） | 沿用 card-header 点线 (windose-runtime.css:61) | P2 | G2 |
| progress track/indicator | `ui/shadcn/progress.tsx:29,45` | `[data-slot=progress-indicator]` | 已覆盖 | pixel-controls.css:38-40; motion-r5.css:26 | progress-label/value 无 | — | P1 | — |
| skeleton | `ui/shadcn/skeleton.tsx:6` | `[data-slot=skeleton]` | 部分 | pixel-controls.css:41 | 只改 steps 动画；圆形骨架仍 rounded-full | 头像骨架改 --wd-avatar-cut | P2 | G5 |
| tooltip-content / arrow | `ui/shadcn/tooltip.tsx:54` | `[data-slot=tooltip-content]` | 部分 | popups-r9.css:121-138 | 只覆盖状态栏 tooltip；其余（99 个文件）仍是浅色 bg-foreground 圆角气泡 | 去掉 popups-r9.css:121 的 body:has 作用域推广迷你窗口 tooltip | P0 | G3 |
| popover-content | `ui/shadcn/popover.tsx:41` | `[data-slot=popover-content]` | 已覆盖 | popups-r9.css:4-68 | popover-header/title/description 仅令牌 | — | P1 | — |
| hover-card-content | `ui/shadcn/hover-card.tsx:43` | `[data-slot=hover-card-content]` | 未覆盖 | avatars-status-r9.css:16 | popups-r9 :is() 列表不含 hover-card-content；仅内部头像被处理（用户/世界悬浮卡 12 处） | 加入 popups-r9.css:4 同款迷你窗口外框 | P0 | G3 |
| dropdown-menu 全套 | `ui/shadcn/dropdown-menu.tsx:59-268` | `[data-slot$=menu-content]` | 已覆盖 | popups-r9.css:4-68 | — | — | P0 | — |
| context-menu 全套 | `ui/shadcn/context-menu.tsx:85-258` | `[data-slot=context-menu-content]` | 已覆盖 | popups-r9.css:4-68 | — | — | P1 | — |
| menubar 触发器/内容 | `ui/shadcn/menubar.tsx:66-251` | `[data-slot=menubar-content]` | 已覆盖 | window-chrome.css:223-271; popups-r9.css:76-114 | — | — | P0 | — |
| dialog content/overlay/title | `ui/shadcn/dialog.tsx:48-160` | `[data-slot=dialog-content]` | 进行中 | windose-runtime.css:63-69; motion-r5.css:28 | dialogs-r9 负责；header/footer/description/close 尚无 | — | P0 | — |
| alert-dialog 全套 | `ui/shadcn/alert-dialog.tsx:50-189` | `[data-slot=alert-dialog-content]` | 进行中 | — | dialogs-r9 负责；当前 0 条规则（alert-dialog-content 不匹配 dialog-content 选择器） | — | P0 | — |
| sheet popup/backdrop/title | `ui/shadcn/sheet.tsx:56,123,199` | `[data-slot=sheet-popup]` | 未覆盖 | — | 通知中心抽屉、快捷键面板、互关图设置 sheet 都是默认外观 | 套 dialog-content 窗体 + window-chrome 标题条；需与 dialogs-r9 约定边界 | P1 | G3 |
| drawer / accordion | `—` | `—` | N/A | — | 源码中不存在这两个原语 | — | P2 | — |
| collapsible trigger/content | `ui/shadcn/collapsible.tsx:12,21` | `[data-slot=collapsible-trigger]` | 部分 | windose-runtime.css:23-35; group-spacing.css:12; settings-pixel.css:77-82 | 侧栏分组和设置卡片已覆盖；GameLog 会话、Themes、Tools、Devkit 没有 | 推广 settings-pixel.css:77-82 折叠头 | P2 | G4 |
| avatar / image / fallback | `ui/shadcn/avatar.tsx:15,29,45` | `[data-slot=avatar]` | 已覆盖 | windose-runtime.css:100-103; login-r8.css:144-154; popups-r9.css:57-68 | 问题：全局像素圆切也会切到方形群组头像（GroupCard.tsx:47 rounded-lg、UserDialogGroupCard.tsx:84、NotificationRowParts.tsx:94、PlayerListGroupSelector.tsx:40、GroupCalendarTimeline.tsx:151、GroupDialogHeaderSection.tsx:239） | 对 [data-slot=avatar]:is(.rounded-md,.rounded-lg) 改成方形像素切角/取消圆切 | P1 | G5 |
| avatar-badge / avatar-group / count | `ui/shadcn/avatar.tsx:58,74,90` | `[data-slot=avatar-group]` | 未覆盖 | — | 叠放小头像 size-4/5 时 32px 环遮罩是否清晰需实机确认（WorldRoomsSidebar.tsx:82, MutualFriendAvatars.tsx:43） | 叠放时 ring 改 1px 方框 | P2 | G5 |
| kbd / kbd-group | `ui/shadcn/kbd.tsx:6,19` | `[data-slot=kbd]` | 部分 | window-chrome.css:209; fonts-pixel-body.css:53 | 标题栏搜索外只换字体 | 像素按键凸边 | P2 | G1 |
| empty（header/icon/title/description） | `ui/shadcn/empty.tsx:8-90` | `[data-slot=empty-icon]` | 部分 | loader-r9.css:23-62 | 只替换了大加载态 spinner；空状态图标框/标题/说明仅令牌（20 个文件） | empty-icon 像素小窗框 + 点线；文字用 WD Pixel | P1 | G4 |
| spinner | `ui/shadcn/spinner.tsx:8` | `[data-slot=spinner]` | 已覆盖 | pixel-controls.css:42; motion-r5.css:27; loader-r9.css:23-62 | 内联小 spinner 由 form-controls-r9 处理（进行中） | — | P1 | — |
| calendar（日期选择） | `ui/shadcn/calendar.tsx:153` | `[data-slot=calendar]` | 未覆盖 | — | 日期范围筛选（DateRangeFilter、InstanceActivityDateControls.tsx:133）里的选中/今天/范围格都是默认样式 | 日格方角；选中粉底、范围 --wd-select、今天虚线框 | P1 | G4 |
| input-group / addon / control / button | `ui/shadcn/input-group.tsx:14,54,123` | `[data-slot=input-group][data-vrcx-0-control=toolbar]` | 部分 | tools-ui-r9.css:6-40 | 只在 Tools 页（#chart）生效；18 个页面工具栏搜索 ToolbarSearch（ToolbarControls.tsx:95）只有令牌色 | 去掉 tools-ui-r9.css:6-40 的 #chart 作用域推广 | P0 | G1 |
| field / field-label / description / error | `ui/shadcn/field.tsx:78-216` | `[data-slot=field-error]` | 部分 | login-r8.css:216 | 只有登录页的 field-error | 错误文字像素红 + 前缀小图标 | P2 | G1 |
| label | `ui/shadcn/label.tsx:17` | `[data-slot=label]` | 未覆盖 | — | 仅令牌 | 保持即可，或换 WD Pixel 小字 | P2 | G1 |
| number-field | `ui/shadcn/number-field.tsx:53-129` | `[data-slot=number-field-group]` | 已覆盖 | settings-pixel.css:26-35 | 全局 | — | P1 | — |
| input-otp | `ui/shadcn/input-otp.tsx:56` | `[data-slot=input-otp-slot]` | 未覆盖 | — | 隐私锁 LockCodeInput.tsx:25 | 方格像素槽 + 激活粉框 | P2 | G1 |
| toast（viewport/content/title/action） | `ui/shadcn/toast.tsx:93,154,173,186` | `[data-slot=toast-content]` | 未覆盖 | — | 全局 AppToaster；外层 Toast.Root 没有 data-slot，需用 [data-slot=toast-viewport] > * 锚定 | popups-r9 迷你窗口 + 左侧类型色条 | P1 | G3 |
| alert（inline） | `ui/shadcn/alert.tsx:29-69` | `[data-slot=alert]` | 未覆盖 | — | 18 个文件（登录服务器状态、设置高级页等） | 像素窗体 + destructive 红边 | P1 | G2 |
| breadcrumb | `ui/shadcn/breadcrumb.tsx:13-105` | `[data-slot=breadcrumb]` | 进行中 | — | 只在 DialogHost 弹窗栈中使用，归 dialogs-r9 | — | P2 | — |
| command（快速搜索） | `ui/shadcn/command.tsx:21-171` | `[data-slot=command-item]` | 部分 | windose-runtime.css:63 | README 说明快速搜索暂保留 R8；只有外框跟随 dialog-content | 按计划保留 | P2 | — |
| resizable-handle | `ui/shadcn/resizable.tsx:34` | `[data-slot=resizable-handle]` | 未覆盖 | side-panel-r4.css:44 | 只有侧栏自有 resize 有样式；Dashboard/Favorites/Tools/Assistant 的手柄没有 | 像素抓点手柄 | P2 | G4 |
| sidebar 全套 | `ui/shadcn/sidebar.tsx:199-730` | `[data-sidebar=menu-button]` | 已覆盖 | navigation-r7.css:5-119; chrome-r8.css:93-102 | sidebar-menu-badge(:658)、sidebar-input(:377) 未专门处理 | — | P0 | — |
| message / bubble / marker / message-scroller | `ui/shadcn/message.tsx:22-75` | `[data-slot=bubble]` | 未覆盖 | — | 只有 Assistant 对话框使用 | 对话气泡改像素窗框 | P2 | G3 |

## 表二：页面与共享组件（src/features、src/components）

| 页面 | 元素 | 源码位置 (src/) | data-slot/选择器锚点 | 主题覆盖情况 | 覆盖文件:行 (runtime/) | 缺失状态或问题 | 建议 | 优先级 | 任务组 |
|---|---|---|---|---|---|---|---|---|---|
| 全页面共享 | 工具栏搜索 ToolbarSearch（18 页） | `components/layout/ToolbarControls.tsx:95-96` | `[data-slot=input-group][data-vrcx-0-control=toolbar]` | 部分 | tools-ui-r9.css:6-40 | 只覆盖 Tools 页；Feed/好友/GameLog/通知/搜索/MyAvatars 等仍只有令牌色 | 推广 tools-ui-r9 像素搜索框 | P0 | G1 |
| 全页面共享 | 日期范围按钮 toolbarSearchDateRangeTrigger | `components/layout/ToolbarControls.tsx:238-257` | `[data-slot=input-group-button][data-variant=secondary\|ghost]` | 未覆盖 | — | active=secondary 只有令牌色 | 跟随 tools-ui-r9.css:34 的组内按钮 | P1 | G1 |
| 全页面共享 | 数据表行 hover/选中/展开 | `components/data-table/DataTableView.tsx:317; ui/shadcn/table.tsx:62` | `.vrcx-0-data-table [data-slot=table-row]` | 部分 | windose-runtime.css:54-55 | 只有令牌色；没有像素选中条/focus 框；.is-striped-table 条纹也是令牌色 | 斜切粉条选中 + 虚线 focus | P0 | G4 |
| 全页面共享 | 数据表分页 DataTablePagination | `components/data-table/DataTableView.tsx:418` | `[data-slot=pagination-link]` | 未覆盖 | — | 见原语表 | controls-r9 像素分段 | P1 | G2 |
| 全页面共享 | 空状态 EmptyState | `components/layout/PageScaffold.tsx:225-244` | `[data-slot=empty] [data-slot=empty-icon]` | 部分 | loader-r9.css:23 | 只覆盖加载态 | 像素小窗图标框 | P1 | G4 |
| 全页面共享 | 选择操作浮条 SelectionActionBar | `components/layout/SelectionActionBar.tsx:30,51` | `div.rounded-full.bg-popover.shadow-lg` | 未覆盖 | windose-runtime.css:70 | 外框仍是药丸+阴影（内部按钮 2px）；Gallery/Favorites/MyGroups/VRChatLog 都用 | popups-r9 迷你窗口外框，方角 | P1 | G2 |
| 全页面共享 | “新条目”浮动 pill | `components/data-table/VirtualHistoryList.tsx:128; features/feed/columns/FeedColumnPane.tsx:336` | `[data-slot=button].rounded-full.bg-popover/95.backdrop-blur` | 部分 | windose-runtime.css:70 | 圆角被压成 2px，但仍有半透明模糊和阴影 | 像素小窗徽章，去掉 blur | P1 | G2 |
| 全页面共享 | TileShell 网格卡（Gallery/Inventory/MyGroups） | `components/tile/TileShell.tsx:7,10` | `[data-slot=card].rounded-object（render Card）` | 部分 | windose-runtime.css:59; controls-r9.css:99-119 | 只有 My Avatars 有像素 tile；其余选中 ring-2 只有令牌色 | 推广 controls-r9.css:99-102 tile 语言（排除 favorites，进行中） | P1 | G4 |
| /feed | 用户头像（表格/列） | `features/feed/components/FeedTableParts.tsx:187,427` | `[data-slot=avatar]` | 已覆盖 | windose-runtime.css:100-103 | — | — | P0 | — |
| /feed | 状态圆点 FeedStatusBadge | `components/feed/FeedStatusBadge.tsx:23` | `span.inline-flex.min-w-0.items-center.gap-1.5 > span.size-2.5.rounded-full` | 已覆盖 | feed-badges.css:52 | 方形状态灯 | — | P0 | — |
| /feed | 区域代码 mono 标签 RegionCodeBadge | `components/location/RegionCodeBadge.tsx:34` | `span.h-4...font-mono.text-[10px]` | 已覆盖 | feed-badges.css:73-95 | — | — | P1 | — |
| /feed | 类型多选筛选片 ToolbarFilterChips | `features/feed/components/FeedToolbar.tsx:187` | `[data-slot=toggle-group][data-variant=default]` | 未覆盖 | — | 默认 toggle 样式 | 像素分段 + 按下粉底 | P0 | G1 |
| /feed | 搜索框 + 用户作用域芯片 | `features/feed/components/FeedSearchBox.tsx:108,133` | `[data-slot=input-group] [data-slot=combobox-chips]` | 未覆盖 | — | InputGroup 与 chips 只有令牌色 | G1 输入组 + mono 芯片 | P0 | G1 |
| /feed | 视图切换 ToolbarSegmented | `features/feed/components/FeedViewModeToggle.tsx:18` | `.vrcx-0-page-toolbar [data-slot=toggle-group][data-variant=outline]` | 已覆盖 | controls-r9.css:49-81 | — | — | P0 | — |
| /feed | 列模式面板与列头 | `features/feed/columns/FeedColumnPane.tsx:238,241,249-273` | `div.rounded-md.border.bg-background/35 / 列头 bg-muted/20` | 未覆盖 | — | 面板圆角半透明；列头没有标题条；小标签是 rounded-sm | 套 activity-card 像素窗体（controls-r9.css:88）+ window-chrome 标题条 | P1 | G4 |
| /feed | 新行高亮 .feed-column-row-new | `styles/globals.css (feed-column-row-new); features/feed/useFeedNewTopRowKeys.ts` | `.feed-column-row-new` | 部分 | feed-badges.css:95 | 只改行内徽章；行本身的高亮动画是 App 默认 | steps() 像素闪烁底色 | P2 | G4 |
| /feed | 图片拖放覆盖层 | `features/feed/components/FeedImageDropOverlay.tsx:147,157` | `div.rounded-2xl.border-dashed.backdrop-blur-sm` | 未覆盖 | — | 大圆角加模糊 | 像素虚线窗框 | P2 | G4 |
| /friends-locations | 好友位置卡 FriendLocationCard | `features/friends/components/FriendLocationCard.tsx:452,324` | `[data-slot=card]` | 部分 | windose-runtime.css:59-61 | 只有边框；hover 时浮出的操作条(:324)和卡片 hover 只有令牌色 | 卡片 hover 粉框 + 操作条迷你窗 | P0 | G4 |
| /friends-locations | 卡片头像 | `features/friends/components/FriendLocationCard.tsx:236` | `[data-slot=avatar]` | 已覆盖 | windose-runtime.css:100-103 | — | — | P0 | — |
| /friends-locations | 状态灯 UserStatusDot | `features/friends/components/FriendLocationCard.tsx:261; components/UserStatusDot.tsx:45-63` | `.user-status-indicator` | 已覆盖 | avatars-status-r9.css:49-55 | 方形（文件仍在进行中） | — | P0 | — |
| /friends-locations | 世界分组头像（用户） | `features/friends/components/FriendsLocationsWorldSection.tsx:103` | `[data-slot=avatar].after:hidden` | 已覆盖 | windose-runtime.css:100-103 | — | — | P1 | — |
| /social/friend-list | 头像列（FadeInImage 圆） | `features/friends/components/FriendListColumns.tsx:182,184,190` | `img.size-6.rounded-full / div.size-6.rounded-full` | 未覆盖 | — | 用户头像不是 data-slot=avatar；windose-runtime.css:104 只匹配带 size-3.75 状态点的 UserStatusAvatar | --wd-avatar-cut 切角 | P0 | G5 |
| /social/friend-list | 好友表格行 | `features/friends/components/FriendListTable.tsx:43` | `.vrcx-0-data-table [data-slot=table-row]` | 部分 | windose-runtime.css:54-55 | 同共享表格行 | — | P0 | G4 |
| /social/friend-log | 好友日志表格/虚拟列表 | `features/friends/components/FriendLogPageTable.tsx:39` | `DataTableSurface` | 部分 | windose-runtime.css:54-55 | 同共享表格行 | — | P1 | G4 |
| /game-log | 类型多选筛选片 | `features/game-log/components/GameLogToolbar.tsx:256` | `[data-slot=toggle-group][data-variant=default]` | 未覆盖 | — | 同 Feed | 见任务 G1（输入类与工具栏搜索） | P0 | G1 |
| /game-log | 会话视图折叠头（sticky） | `features/game-log/components/GameLogSessionsView.tsx:412-418` | `[data-slot=collapsible] > div.sticky.bg-muted.border-b` | 未覆盖 | — | 普通 bg-muted 条 | window-chrome 标题条语言 + 像素折叠箭头 | P1 | G4 |
| /game-log | 会话叠放小头像 AvatarGroup | `features/game-log/components/GameLogSessionsView.tsx:160-173` | `[data-slot=avatar-group] [data-slot=avatar].size-5` | 需实机确认 | windose-runtime.css:100-103 | size-5 环遮罩加 -space-x-1 叠放是否清晰 | 叠放 ring 改 1px 方框 | P1 | G5 |
| /game-log | 表格 | `features/game-log/components/GameLogTableShell.tsx:44` | `DataTableSurface` | 部分 | windose-runtime.css:54-55 | 同共享表格行 | — | P0 | G4 |
| /game-log | 类型图标 | `features/game-log/components/GameLogTypeIndicator.tsx:44` | `svg.lucide-*` | 已覆盖 | original-assets/icons/dist/jirai-icons.css | — | — | P2 | — |
| /social/moderation | 屏蔽列表虚拟行 | `features/moderation/components/ModerationVirtualList.tsx:89` | `虚拟列表行` | 部分 | windose-runtime.css:54-55 | 只有令牌色 hover/选中 | 同共享表格行 | P1 | G4 |
| /player-list | 玩家表（头像+状态灯） | `features/player-list/components/PlayerListColumns.tsx:144` | `UserStatusDot / avatar` | 已覆盖 | avatars-status-r9.css:49-55; windose-runtime.css:100-103 | — | — | P0 | — |
| /player-list | 互关社区色点 | `features/player-list/components/PlayerListColumns.tsx:144; features/player-list/components/PlayerListMutualScan.tsx:61` | `span.size-2.rounded-full[style=backgroundColor]` | 已覆盖 | — | 语义圆，保持不改 | 保持 | P2 | — |
| /player-list | 群组选择器图标（方形群组 Avatar） | `features/player-list/components/PlayerListGroupSelector.tsx:40` | `[data-slot=avatar].rounded-md` | 需实机确认 | windose-runtime.css:100-103 | 全局像素圆切会把方形群组图标切成圆形（语义误伤） | :is(.rounded-md) 改方形切角 | P1 | G5 |
| /player-list | 互关头像组 MutualFriendAvatars | `components/mutual-friends/MutualFriendAvatars.tsx:41-47` | `[data-slot=avatar-group] size-5` | 需实机确认 | windose-runtime.css:100-103 | 小尺寸环遮罩 | 同 avatar-group | P2 | G5 |
| /notification | 通知中心抽屉 Sheet | `features/notifications/VrcNotificationCenterHost.tsx:130-140` | `[data-slot=sheet-popup]` | 未覆盖 | — | 点击铃铛就会打开；外框是默认 inset sheet | dialog-content 窗体 + 标题条 | P0 | G3 |
| /notification | 未读圆点 | `features/notifications/components/NotificationRow.tsx:148; features/notifications/drawer/NotificationDrawerRow.tsx:172` | `span.bg-primary.size-2.rounded-full` | 未覆盖 | — | 未读提示圆点 | 方形像素点或小心形（属提示灯，不是用户头像） | P1 | G5 |
| /notification | 类型 pill 标签 | `features/notifications/components/NotificationRow.tsx:234` | `span.rounded-full.border.px-1.5` | 未覆盖 | — | 药丸形 | feed-badges.css:73 mono 标签 | P1 | G2 |
| /notification | 发送者头像（用户/群组） | `features/notifications/components/NotificationRowParts.tsx:70,94` | `[data-slot=avatar] / .rounded-md` | 部分 | windose-runtime.css:100-103 | 用户头像已覆盖；群组(:94 rounded-md)被误切成圆 | 群组改方形切角 | P1 | G5 |
| /notification | 通知表格 | `features/notifications/components/NotificationFeed.tsx:116` | `DataTableSurface` | 部分 | windose-runtime.css:54-55 | 同共享表格行 | — | P1 | G4 |
| /search | 用户/群组结果卡（outline Button 当卡片） | `features/search/components/SearchResultParts.tsx:187-191` | `[data-slot=button][data-variant=outline].h-auto` | 部分 | windose-runtime.css:70 | 只有 2px 圆角；hover 只有令牌色 | 像素卡片 hover 粉框 | P0 | G2 |
| /search | 结果头像 size-14 | `features/search/components/SearchResultParts.tsx:193-202` | `[data-slot=avatar].rounded-full` | 已覆盖 | windose-runtime.css:100-103 | 如果用于群组/世界结果，可能需要方形（需实机确认） | — | P0 | — |
| /search | 世界/模型媒体卡（渐变遮罩） | `features/search/components/SearchResultParts.tsx:125-146` | `button.group/search-media + bg-gradient-to-t` | 部分 | windose-runtime.css:70 | 底部渐变文字条是默认样式 | 像素标题条 | P1 | G2 |
| /search | 浮动分页 pill | `components/search/SearchPagination.tsx:40,46,62` | `div.rounded-full.bg-popover.shadow-lg` | 未覆盖 | windose-runtime.css:70 | 外框仍是药丸 | 迷你窗口方角 + 分段按钮 | P1 | G2 |
| /search | 搜索 tabs | `features/search/components/SearchControlBand.tsx:260` | `ToolbarTabs` | 已覆盖 | controls-r9.css:7-43 | — | — | P0 | — |
| /instance-history | 列表行与选中竖条 | `features/instance-history/components/InstanceHistoryList.tsx:108,113` | `div.rounded-md / span.bg-primary.w-0.5.rounded-full` | 未覆盖 | — | 选中只是 0.5px 竖条，行有圆角 | 斜切粉条选中（popups-r9.css:35 语言） | P1 | G4 |
| /instance-history | 行悬浮操作浮层 | `features/instance-history/components/InstanceHistoryList.tsx:147` | `div.bg-popover.rounded-md.border.shadow-sm` | 未覆盖 | — | — | 迷你窗口方角 | P2 | G4 |
| /instance-history | 日期弹出 Calendar | `features/instance-history/components/InstanceActivityDateControls.tsx:116-142` | `[data-slot=popover-content] [data-slot=calendar]` | 部分 | popups-r9.css:4 | popover 外框已覆盖，日历格未覆盖；:142 的有数据日期圆点是语义圆（保持） | 见 calendar 原语 | P1 | G4 |
| /instance-history | 设置 popover 里的 Slider | `features/instance-history/components/InstanceActivitySettingsPopover.tsx:53` | `[data-slot=slider]` | 进行中 | — | form-controls-r9 负责 | — | P2 | — |
| /dashboard/:id | 面板/编辑器卡片 | `features/dashboard/components/DashboardViewParts.tsx:121,283` | `div.rounded-md.border.bg-muted/10 / Button.border-dashed` | 未覆盖 | — | 普通圆角盒子 | activity-card 像素窗体 | P1 | G4 |
| /dashboard/:id | 动态条目状态灯 | `features/dashboard/components/widgets/DashboardFeedEntryContent.tsx:166` | `span[data-dashboard-feed-status-dot].size-2.5.rounded-full` | 未覆盖 | — | 用户在线状态灯仍是圆形，没有 user-status-indicator 类，也不在 feed-badges 的父链中 | 方形像素灯（与 feed-badges.css:52 一致） | P1 | G5 |
| /dashboard/:id | 实例部件状态点 | `features/dashboard/components/widgets/DashboardInstanceWidget.tsx:406` | `span.size-2.5.rounded-full.border` | 未覆盖 | — | 状态灯为圆形 | 方形 | P2 | G5 |
| /dashboard/:id | 布局调整手柄 | `features/dashboard/components/DashboardResizeHandle.tsx` | `[data-slot=resizable-handle]` | 未覆盖 | — | — | 像素抓点 | P2 | G4 |
| /my-avatars | 模型网格卡片 | `features/my-avatars/components/MyAvatarGridCard.tsx` | `[data-slot=context-menu-trigger].group/card > [data-slot=button].rounded-object` | 已覆盖 | controls-r9.css:99-119 | 由列表/网格切换按钮门控 | — | P0 | — |
| /my-avatars | 卡片徽章 | `features/my-avatars/components/MyAvatarGridCard.tsx:281` | `[data-slot=badge]` | 未覆盖 | — | 药丸 badge | 见 badge 原语 | P1 | G2 |
| /my-avatars | 模型预览悬浮卡 | `features/my-avatars/components/MyAvatarsViewParts.tsx:214` | `[data-slot=hover-card-content]` | 未覆盖 | — | 同 hover-card | 见任务 G3（浮层：tooltip / hover-card / toast / sheet） | P1 | G3 |
| /my-avatars | 表格视图 | `features/my-avatars/components/MyAvatarsTableView.tsx:77` | `DataTableSurface` | 部分 | windose-runtime.css:54-55 | 同共享表格行 | — | P1 | G4 |
| /tools/my-groups | 群组卡片 object-row | `features/my-groups/components/MyGroupCard.tsx:129,167,173` | `.object-row / span.rounded-md 群组图标` | 未覆盖 | — | 只有 App 自带的 object-row 样式；群组图标是语义方形（保持） | TileShell 像素卡（不碰 favorites） | P1 | G4 |
| /tools/group-moderation | 左侧群组栏 | `features/group-moderation/GroupModerationPage.tsx:52-59` | `div.bg-muted/30.w-60.border-r` | 未覆盖 | — | — | side-panel 标题条语言 | P2 | G4 |
| /activity | 展品卡 activity-card | `features/activity/ActivityPageImpl.tsx:363` | `.activity-skin section.activity-card` | 已覆盖 | controls-r9.css:88-97 | — | — | P1 | — |
| /activity | Face 头像 | `features/activity/components/ActivityPeopleExhibit.tsx:34-44` | `.activity-skin span.rounded-full` | 进行中 | avatars-status-r9.css:36 | avatars-status-r9 负责 | — | P1 | — |
| /activity | echarts 系列图与热力图调色 --act-* | `features/activity/useActivityPalette.ts:3-15; features/activity/components/ActivityRhythmExhibit.tsx:15-18; features/activity/components/ActivitySeriesChart.tsx:5` | `.activity-skin { --act-* } (styles/globals.css:1275,1292)` | 未覆盖 | — | canvas 改不了，但颜色是从 CSS 变量读的；主题没有重定义 --act-*，所以还是 App 默认色阶 | 在主题里给 .dark .activity-skin 定义粉紫 --act-heat-0..4/--act-mark/--act-track | P1 | G4 |
| /activity | 排行行 | `features/activity/components/ActivityRankRow.tsx:25` | `[data-slot=button].rounded-none` | 部分 | — | hover 只有令牌色 | 像素 hover 条 | P2 | G4 |
| /activity | 行程视图头像 | `features/activity/components/ActivityJourneyView.tsx:150` | `[data-slot=avatar]` | 已覆盖 | windose-runtime.css:100-103 | — | — | P2 | — |
| /browse-history | 浏览记录卡 object-row / tabs / 搜索 | `features/browse-history/BrowseHistoryCard.tsx:97; features/browse-history/BrowseHistoryPage.tsx` | `.object-row` | 进行中 | — | browse-history-r9 负责 | — | P1 | — |
| /favorites/* | 收藏卡片 FavoriteCardView / 好友行头像 | `features/favorites/components/FavoriteCardView.tsx:124-150,216,322` | `.object-row` | 进行中 | avatars-status-r9.css:42 | favorites-r9 + avatars-status-r9 负责；卡片上的药丸计数和在线点(:124,:129,:145)也在其范围内 | — | P0 | — |
| /favorites/* | 分组侧栏 FavoritesGroupRail | `features/favorites/components/FavoritesGroupRail.tsx:152,187,272,591,611` | `[data-slot=button].rounded-full / Skeleton` | 进行中 | — | favorites-r9 负责 | — | P1 | — |
| /favorites/* | 选择浮条 | `features/favorites/components/FavoritesSelectionBar.tsx:11` | `SelectionActionBar` | 进行中 | — | 页面归 favorites-r9；浮条本身是共享组件（见共享行） | — | P1 | — |
| /favorites/import/:kind | 导入表格 | `features/favorites/FavoriteImportPage.tsx:391` | `DataTableScrollArea` | 进行中 | — | favorites-r9 负责 | — | P2 | — |
| /charts/mutual | sigma WebGL 关系图 | `lib/mutual-friends/mutualFriendsSigmaGraph.ts:4; lib/mutual-friends/mutualFriendsPalette.ts:60-68,105-115` | `canvas (sigma)` | 部分 | — | 社区调色板写死在 JS 里，主题改不到；悬浮卡颜色从 CSS 变量读（跟随令牌） | 保持；如要改色需改 JS | P2 | — |
| /charts/mutual | HUD / 节点卡面板 | `features/charts/components/mutual-friends/MutualFriendsHud.tsx; features/charts/components/mutual-friends/MutualFriendsNodeCard.tsx:69` | `#chart > .relative > div.absolute.w-64/.w-72` | 已覆盖 | controls-r9.css:179-198 | 节点卡头像 size-11 也已覆盖 | — | P1 | — |
| /charts/mutual | HUD 自定义进度条 | `features/charts/components/mutual-friends/MutualFriendsHud.tsx:43-45` | `div.h-1.rounded-full > div.bg-primary` | 未覆盖 | — | 圆角细条 | 套 pixel-controls.css:38-39 progress 语言 | P2 | G4 |
| /charts/mutual | 图例色点/线 | `features/charts/components/mutual-friends/MutualFriendsLegend.tsx:83-204` | `span.rounded-full` | 已覆盖 | — | 语义圆，保持 | 保持 | P2 | — |
| /charts/mutual | 设置/管理 Sheets | `features/charts/components/mutual-friends/MutualFriendsSettingsSheet.tsx` | `[data-slot=sheet-popup]` | 未覆盖 | — | 同 sheet | 见任务 G3（浮层：tooltip / hover-card / toast / sheet） | P2 | G3 |
| /charts/two-person | 两个原生 <select> | `features/charts/TwoPersonRelationshipPageImpl.tsx:464,509` | `select.rounded-md.border-input.h-10` | 部分 | windose-runtime.css:114-115 | 只换了箭头；边框和圆角是默认；页面根是 div#chart.x-container(:433)，不在 PageScaffold 里，controls-r9 的作用域规则都不生效 | 像素输入框（G1 原生控件） | P2 | G1 |
| /charts/two-person | 世界记录卡（button） | `features/charts/TwoPersonRelationshipPageImpl.tsx:634` | `button.rounded-lg.border.hover:shadow-sm` | 未覆盖 | — | — | 像素卡 hover 粉框 | P2 | G4 |
| /charts/timeline | echarts 写死调色 + tooltip HTML 圆点 | `features/charts/RelationshipTimelinePageImpl.tsx:29-35,101-111` | `canvas (echarts)` | 未覆盖 | — | COLORS 写死、tooltip 是内联样式，主题改不到 | 需改 JS（主题做不到），记录即可 | P2 | — |
| /charts/timeline | 原生 range ×2 | `features/charts/RelationshipTimelinePageImpl.tsx:366-372,470-476` | `input[type=range].accent-primary` | 未覆盖 | — | 只有 accent 令牌色 | 复用 user-dialog-r8.css:25-53 像素滑条 | P2 | G1 |
| /charts/timeline | 原生 checkbox ×2 | `features/charts/RelationshipTimelinePageImpl.tsx:386-387,398-399` | `input[type=checkbox]` | 未覆盖 | — | 系统复选框 | appearance:none 像素方框（与 form-controls-r9 视觉对齐） | P2 | G1 |
| /tools | 工具页搜索与竖向 tab | `features/tools/components/ToolsPageContent.tsx:788` | `#chart .vrcx-0-page-toolbar [data-slot=input-group]` | 已覆盖 | tools-ui-r9.css:6-77 | — | — | P1 | — |
| /tools | 工具卡状态点 | `features/tools/components/ToolsPageContent.tsx:214` | `span.size-1.5.rounded-full` | 已覆盖 | — | 语义圆，保持 | 保持 | P2 | — |
| /tools/gallery | 媒体卡 MediaAssetTile | `features/tools/components/MediaAssetTile.tsx:214-250` | `TileShell render Card size=sm` | 部分 | windose-runtime.css:59 | 有边框；选中 ring-2 只有令牌色 | 见共享 TileShell | P1 | G4 |
| /tools/gallery | Gallery tabs | `features/tools/components/GalleryTabs.tsx:39` | `[data-slot=tabs-list]` | 已覆盖 | controls-r9.css:7-43 | — | — | P1 | — |
| /tools/screenshot-metadata | 元数据表 / 详情卡 | `features/tools/components/ScreenshotMetadataSections.tsx:312; features/tools/components/ScreenshotMetadataDetailsCard.tsx:106` | `.app-data-table（没有 vrcx-0-data-table）` | 部分 | — | app-data-table 不带 vrcx-0-data-table 类，windose-runtime.css:54 不生效 | 表格语言补到 .app-data-table | P2 | G4 |
| /tools/vrchat-log | 错误框与日志容器 | `features/tools/VrchatLogPage.tsx:111,116` | `div.rounded-md.border(.bg-destructive/10)` | 未覆盖 | — | — | 像素窗体 / alert 语言 | P2 | G4 |
| /tools/* | 截图导出进度 toast | `features/tools/screenshotExportProgressToast.tsx:2-3` | `toast + [data-slot=progress]` | 部分 | pixel-controls.css:38-40 | 进度条已覆盖，toast 外框没有 | 见 toast 原语 | P2 | G3 |
| /themes | 社区主题卡（浏览/已安装 tabs） | `features/themes/components/CommunityThemesSection.tsx:65-163; features/themes/components/ThemesPageParts.tsx:82-87` | `tabs-content[data-index=0] card[data-size=sm]` | 已覆盖 | controls-r9.css:126-172 | — | — | P1 | — |
| /themes | 强调色色点与原生 color | `features/themes/components/AccentColorPicker.tsx:82,101,107` | `span.rounded-full / input[type=color]` | 部分 | — | 色点是语义圆（保持）；原生 color 没有样式 | color swatch 方角 | P2 | G1 |
| /themes | 自定义 CSS 文本域 | `features/themes/components/CustomCssSection.tsx:96` | `[data-slot=textarea]` | 未覆盖 | — | — | 见 textarea | P2 | G1 |
| /settings | 竖向导航与设置卡片 | `features/settings/SettingsPage.tsx:77` | `tabs-list.w-44 / card` | 已覆盖 | settings-pixel.css:57-82 | — | — | P0 | — |
| /settings | 下拉选择（27 处） | `features/settings/components/settings-tabs/SettingsVrTab.tsx:244` | `[data-slot=select-trigger]` | 进行中 | — | form-controls-r9 负责 | — | P0 | — |
| /settings | 滑条 | `features/settings/components/settings-tabs/SettingsVrTab.tsx:368,567; features/settings/components/settings-tabs/SettingsNotificationsTab.tsx:395` | `[data-slot=slider]` | 进行中 | — | form-controls-r9 负责 | — | P1 | — |
| /settings | 系统页徽章 | `features/settings/components/settings-tabs/SettingsSystemTab.tsx:186,278,334` | `[data-slot=badge]` | 未覆盖 | — | 药丸 badge | 见 badge | P1 | G2 |
| /settings | 高级页 Alert | `features/settings/components/settings-tabs/SettingsAdvancedTab.tsx:198,213,223` | `[data-slot=alert]` | 未覆盖 | — | — | 见 alert | P1 | G2 |
| /settings | 输入组 | `features/settings/components/SettingsViewParts.tsx:229` | `[data-slot=input-group]` | 未覆盖 | — | — | 见 input-group | P1 | G1 |
| /settings | 反馈文本域 | `features/settings/components/settings-tabs/SettingsFeedbackTab.tsx:125` | `[data-slot=textarea]` | 未覆盖 | — | — | 见 textarea | P2 | G1 |
| /settings | 用户颜色原生 color 与色点 | `features/settings/components/settings-tabs/SettingsInterfaceUserColorsCard.tsx:130,181,222` | `input[type=color] / span.rounded-full` | 部分 | — | 色点保持；原生 color 没有样式 | color swatch 方角 | P2 | G1 |
| /settings | 社交 tab 用户头像 | `features/settings/components/settings-tabs/SettingsSocialTab.tsx:337` | `span.bg-muted.size-6.overflow-hidden.rounded-full` | 未覆盖 | — | 不匹配 popups-r9.css:65（那条要求 size-9 + border） | --wd-avatar-cut | P2 | G5 |
| /settings | 集成连接状态点 | `features/settings/components/settings-tabs/IntegrationApiSettingsGroup.tsx:253` | `span.size-1.5.rounded-full` | 已覆盖 | — | 语义圆（连接状态，不是用户在线状态），保持 | 保持 | P2 | — |
| /login | 卡片/输入/按钮/头像/复选框 | `features/auth/components/LoginFormCard.tsx; features/auth/components/SavedAccountsCard.tsx:81` | `[data-vrcx-0-surface=login-page] *` | 已覆盖 | login-r8.css:2-236 | — | — | P0 | — |
| /login | 服务器状态 Alert | `features/auth/components/LoginServerStatusAlert.tsx:31` | `[data-slot=alert]` | 未覆盖 | — | login-r8 没有 alert 规则 | 见 alert | P1 | G2 |
| /login | 代理设置/删除账号弹窗 | `features/auth/components/LoginProxySettingsDialog.tsx; features/auth/components/DeleteSavedAccountDialog.tsx` | `dialog / alert-dialog` | 进行中 | — | dialogs-r9 负责 | — | P2 | — |
| /login | 页脚按钮 | `features/auth/components/LoginPageFooter.tsx:17,28` | `[data-slot=button]` | 需实机确认 | login-r8.css:161-172 | 只有 outline/secondary 会命中，ghost/link variant 是否覆盖需确认 | — | P2 | — |
| 隐私锁 | 锁屏卡 | `features/privacy-lock/PrivacyLockOverlay.tsx:77,134` | `div.rounded-2xl.bg-popover/80.backdrop-blur` | 未覆盖 | — | 大圆角加毛玻璃 | login-r8 窗口卡语言 | P2 | G3 |
| 隐私锁 | OTP 输入 | `features/privacy-lock/LockCodeInput.tsx:25` | `[data-slot=input-otp-slot]` | 未覆盖 | — | — | 见 input-otp | P2 | G1 |
| Assistant | 消息气泡/状态点 | `features/assistant/AssistantDialog.tsx:407; ui/shadcn/bubble.tsx:53` | `[data-slot=bubble] / span.size-2.rounded-full` | 未覆盖 | — | — | 像素对话框（P2） | P2 | G3 |
| 全局外壳 | 标题栏 / 菜单栏 / 窗口按钮 / 铃铛徽章 | `components/layout/AppTitleBar.tsx` | `.vrcx-0-titlebar[data-app-titlebar]` | 已覆盖 | window-chrome.css:35-271; chrome-r8.css:22-90; badge-r9.css:18-82; brand-heart-r9.css | — | — | P0 | — |
| 全局外壳 | 标题栏更新按钮进度条 | `components/layout/TitleBarUpdateButton.tsx:85-87` | `span.h-[2px].rounded-full > span.bg-primary` | 未覆盖 | — | 2px 圆角细条 | 像素 progress（pixel-controls.css:38-39）缩小版 | P2 | G4 |
| 全局外壳 | 导航菜单红点 | `components/layout/app-nav-menu/AppNavMenuIcons.tsx:48` | `span.bg-destructive.size-1.5.rounded-full` | 未覆盖 | — | 提示点 | 方形像素点 | P2 | G5 |
| 全局外壳 | 状态栏连接圆点 | `components/layout/status-bar/StatusBarParts.tsx:51` | `.vrcx-0-statusbar span.size-2.rounded-full` | 已覆盖 | window-chrome.css:125-134; chrome-r8.css:136 | — | — | P0 | — |
| 全局外壳 | 左侧导航 | `components/layout/AppSidebar.tsx` | `.vrcx-0-sidebar-surface [data-sidebar]` | 已覆盖 | navigation-r7.css; chrome-r8.css:93-102; cat-r8-final.css | — | — | P0 | — |
| 右侧社交面板 | rail/分组头/好友行头像与状态灯 | `components/sidebar/SidePanel.tsx:494; components/sidebar/friends-sidebar/FriendsSidebarFriendRow.tsx` | `.vrcx-0-side-panel` | 已覆盖 | side-panel-r4.css; windose-runtime.css:23-35,104-110; avatars-status-r9.css:10 | — | — | P0 | — |
| 右侧社交面板 | 自身头像按钮的 focus 圆环 | `components/sidebar/side-panel/SidePanelSelfHeader.tsx:224` | `button.rounded-full.focus-visible:ring-2` | 部分 | avatars-status-r9.css:10 | 头像已切角，但 focus ring 仍沿 rounded-full 画圆 | focus 改像素虚线 outline | P2 | G5 |
| 右侧社交面板 | 状态描述内联原生 input | `components/sidebar/side-panel/SidePanelSelfHeader.tsx:276` | `input.rounded-md.bg-transparent.focus-visible:ring` | 未覆盖 | — | — | 像素虚线下划线 | P2 | G1 |
| 右侧社交面板 | 好友行骨架圆 | `components/sidebar/friends-sidebar/FriendsSidebarVirtualRows.tsx:102` | `[data-slot=skeleton].size-8.rounded-full` | 未覆盖 | pixel-controls.css:41 | 只改了动画 | --wd-avatar-cut | P2 | G5 |
| 右侧社交面板 | 快速搜索结果头像 | `components/sidebar/QuickSearchResults.tsx:62` | `好友 rounded-full / 非好友 rounded` | 部分 | — | 快速搜索按计划保留 R8 | 保留 | P2 | — |
| 悬浮卡 | 用户/世界悬浮卡外框 | `components/user-hover-card/UserHoverCardContent.tsx:118,154-164` | `[data-slot=hover-card-content]` | 部分 | avatars-status-r9.css:16 | 头像已切角；外框没有像素化 | 见 hover-card | P0 | G3 |
| 全局外壳 | Toast 通知 | `components/hosts/AppToaster.tsx; ui/shadcn/toast.tsx:154` | `[data-slot=toast-content]` | 未覆盖 | — | — | 见 toast | P1 | G3 |
| 全局外壳 | 键盘快捷键面板 Sheet | `components/keyboard/KeyboardShortcutsDialog.tsx:32` | `[data-slot=sheet-popup]` | 未覆盖 | — | — | 见 sheet | P2 | G3 |
| 全局外壳 | 平台圆点 / 群组活动状态点 | `components/avatars/AvatarPlatformDots.tsx:5; components/group-event/GroupEventStatusLabel.tsx:23` | `span.rounded-full` | 已覆盖 | — | 语义圆，保持 | 保持 | P2 | — |
| 全局外壳 | 群组卡头像（rounded-lg） | `components/groups/GroupCard.tsx:47` | `[data-slot=avatar].rounded-lg` | 需实机确认 | windose-runtime.css:100-103 | 语义误伤：方形群组图标被切成像素圆 | 改方形切角 | P1 | G5 |
| 弹窗内控件 | 用户状态分布原生 range | `components/dialogs/user-dialog/components/UserDialogStatusDistribution.tsx:311-316` | `input[type=range].accent-primary.w-28` | 未覆盖 | user-dialog-r8.css:25-53 | class 是 w-28，没有 .min-w-16.flex-1，所以 user-dialog-r8.css:25 的选择器匹配不上 | 放宽成 .entity-dialog input[type=range] | P1 | G1 |
| 弹窗内控件 | 用户活动自定义比例条 | `components/dialogs/user-dialog/components/UserActivityPanelSections.tsx:167-169` | `span.h-2.rounded-full > span` | 未覆盖 | — | — | 像素 progress | P2 | G4 |
| 弹窗内控件 | 群组成员圆头像 img | `components/dialogs/group-dialog/GroupMembersPanel.tsx:180,183` | `img.size-9.rounded-full` | 未覆盖 | — | 用户头像 | --wd-avatar-cut | P1 | G5 |
| 弹窗内控件 | 模型作者编辑弹窗头像 | `components/dialogs/AvatarOwnerEditDialogs.tsx:100,103` | `img.size-9.rounded-full` | 未覆盖 | — | 用户头像 | --wd-avatar-cut | P2 | G5 |
| 弹窗内控件 | 笔记导出用户头像 | `components/hosts/tools-dialogs/NoteExportDialog.tsx:465,482,487` | `span/button.size-11.rounded-full` | 未覆盖 | — | 用户头像 | --wd-avatar-cut | P2 | G5 |
| 弹窗内控件 | 实体列表用户圆图 | `components/dialogs/user-dialog/components/UserDialogEntityList.tsx:111-112` | `kind=user ? rounded-full` | 需实机确认 | user-dialog-r8.css:4 | 只有渲染成 UserStatusAvatar 结构时才会命中 | --wd-avatar-cut | P2 | G5 |
| 弹窗内控件 | 用户弹窗骨架圆 | `components/dialogs/user-dialog/components/UserDialogContentStates.tsx:35-56` | `[data-slot=skeleton].rounded-full` | 未覆盖 | — | — | --wd-avatar-cut / 方块 | P2 | G5 |
| 弹窗内控件 | 选人行头像 UserPickerRow / 多选好友 | `components/search/UserPickerRow.tsx:33; components/search/FriendMultiSelectList.tsx:129` | `span.mr-2.5.size-9.rounded-full.border / span.size-3.5.rounded-full` | 部分 | popups-r9.css:65 | UserPickerRow 在 popover 里会命中；在弹窗里和 size-3.5 版本都不会命中 | --wd-avatar-cut | P2 | G5 |
| 弹窗内控件 | 自定义进度条（更新/加载/性能） | `components/hosts/system-dialogs/UpdaterDialog.tsx:358; components/dialogs/FriendListUserLoadDialog.tsx:45; components/dialogs/avatar-dialog/components/AvatarDialogPerformanceTab.tsx:90-93` | `div.bg-muted.rounded-full > div` | 未覆盖 | — | 不是 progress 原语 | 套 pixel-controls.css:38-39 | P2 | G4 |
| 弹窗内控件 | 数据目录迁移 Radio | `components/hosts/system-dialogs/DataDirMigrationDialog.tsx:227-229` | `Radio.Root.rounded-full` | 未覆盖 | — | — | 见 radio | P2 | G1 |

## 附：rounded-full 分类结论（共 151 处非测试用法）
- **用户头像（应使用 --wd-avatar-cut）**：已覆盖的有：所有 `[data-slot=avatar]`、UserStatusAvatar（侧栏/表格/弹窗/按钮）、悬浮卡头像、用户弹窗头像、互关节点卡头像、在 popover 里的 UserPickerRow。**还没覆盖的**：FriendListColumns.tsx:182、GroupMembersPanel.tsx:180、AvatarOwnerEditDialogs.tsx:100、NoteExportDialog.tsx:465、SettingsSocialTab.tsx:337、FriendMultiSelectList.tsx:129，以及各处圆形骨架。Activity Face 和收藏好友行头像在进行中。
- **状态灯（应为方形）**：已覆盖的有 .user-status-indicator（avatars-status-r9.css:49-55）、Feed 状态点（feed-badges.css:52）、状态栏（window-chrome.css:125）。**还没覆盖的**：DashboardFeedEntryContent.tsx:166、DashboardInstanceWidget.tsx:406，以及未读/导航提示点（NotificationRow.tsx:148、AppNavMenuIcons.tsx:48）。
- **语义圆（保持）**：互关社区色点、图例、平台点、群组活动点、调色板色点、日历有数据日期点、gantt/timeline 节点、集成连接点、radio。
- **反向问题**：方形群组 Avatar（rounded-md/lg）也被全局 avatar 规则切成了像素圆，见原语表 avatar 行。
