# Button Gallery B054–072 / B101–112 职责审查

## 范围与证据边界

基于当前 gallery 的源码站点逐个阅读 UI JSX 上下文，并检查主题专用规则。不是逐个运行真实实体详情、登录或锁定页面。Windows 已部署的是冻结的 pre-dialog 版本，仅包含前一轮 toolbar 修改；B073–100 新增实现不在此部署中。

判断标准：只有按钮实际承担内容展示、实体身份、列表选择、专用图片框、分区标题或组合控件等职责时，才有理由避开普通实体按钮外观。仅属于 Dialog/Popover/portal、ghost、尺寸小或危险操作，不是免主题的充分理由。保留语义、尺寸和层级不等于保留 stock 外观。

## B054–072

| ID | 真实职责 | 建议 |
|---|---|---|
| B054 | 26站点：实体横幅/头像预览，实体标题复制、作者/管理员名字链接、状态正文编辑、成员/群组卡片、照片图库、统计信息/关系历史行 | 保留图片/文字/信息行/列表专用表现，不做通用按钮浮雕；已有外部头像装饰与横幅装饰不可覆盖 |
| B055 | EntityActionDropdown 更多操作触发器；dangerous 动态切换 destructive/outline，不是直接执行删除 | 使用现有 Win98 destructive/outline icon-lg，危险标记与菜单展开态保留 |
| B056 | 23站点：复制JSON/ID、图片上传/上一张下一张、活动刷新、管理角色/保存注释/踢出封禁解封、日志导出JSON/筛选、加载更多/导入、失败重试、群组管理/截图刷新 | 普通操作使用 Win98 outline sm；不要因实体详情域整体豁免；动态权限/禁用/危险行为不改 |
| B057 | EntityInfoActionButton 通用小工具；bio 外链 favicon；状态分布刷新 | 普通小工具使用 Win98 ghost icon-xs；bio favicon 已有专用 Win98 outline 式内嵌浮雕（CSS 2291–2298），保留这套已有主题，不误判成默认平面或漏网 |
| B058 | 头像图库大图片预览、行内危险确认的取消、启动方式大图文选项 | 图片预览保留；取消用 Win98 outline；启动方式保留图文布局，用 Win98 outline 外观而非改变尺寸 |
| B059 | 使用模型（canSelect动态default/outline）、加入群组（已加入等状态动态）、新建房间 | Win98 default主CTA，沿原 variant 动态状态处理；无充分理由保持普通外观 |
| B060 | 性能刷新、打开活动页、限制数量标签入口、固定世界房间到侧栏 | 普通操作Win98 outline xs；限制数量与邻接Badge是一体的元数据标签，保持标签型/平面表现，不做突出的执行按钮 |
| B061 | 模型性能文档链接、群组URL文本链接 | 现有主题link，不做凸起；保留换行与文本尺寸 |
| B062 | 群组成员更多菜单、帖子编辑/删除（ghost但text-destructive）、关系图浮动设置、实体面包屑返回 | 普通工具Win98 ghost icon-sm，默认平；帖子删除保留危险色；关系图浮层不加常驻强实体底，不豁免交互反馈 |
| B063 | 群组成员加载更多、实体事实行的偏好值切换（aria-pressed） | 加载更多用Win98 ghost sm；事实行值保持内联文本型开关，不把值变成实体按键 |
| B064 | 批量清空选择、打开完整动态页、搜索头刷新 | Win98 outline icon-sm；rounded-full声明本身不是专用意义理由；清空选择不是直接删除成员 |
| B065 | 批量移除成员角色 | Win98 secondary sm，保留权限/禁用状态 |
| B066 | 群组收藏菜单，已收藏secondary+实心星，未收藏outline | Win98 secondary/outline icon-lg；保留收藏状态/展开反馈，不改成恒定一种variant |
| B067 | 管理表格危险行操作，variant由DANGER_ACTION_KEYS等决定 | Win98 destructive sm；保留危险色，避免源码scale与主题translate叠加造成双重按压 |
| B068 | 群组快速管理InlineConfirmActions的危险确认 | Win98 destructive default，确认层级/危险色保留 |
| B069 | 用户获得的徽章图片或徽章名字，隐藏状态opacity/grayscale，点击开徽章信息Popover | 保留身份徽章专用外观，不把获奖徽章画成通用功能按键；保留既有缩放/焦点/隐藏语义 |
| B070 | 个人简介历史面板开关，展开secondary、关闭ghost | Win98 secondary/ghost icon-xs，并保留latched展开区别，不覆盖成恒定secondary |
| B071 | 简介信息面板标题旁编辑铅笔 | Win98 outline icon-xs |
| B072 | 资料背景渐变编辑器里的应用渐变按钮 | Win98 default sm；邻接色块/背景预览保持真实性，按钮不是颜色预览Tile |

## B101–112

| ID | 真实职责 / 当前状态 | 建议 |
|---|---|---|
| B101 | 当前gallery变成无使用点的outline sm menu-popup代表；此前该号为ComboboxChipRemove ghost/icon-xs。ChipRemove render覆写data-slot=combobox-chip-remove | 不能把当前虚构代表当真实按钮评审。原chip X是输入chips内嵌移除控件，保留专用chip-remove样式，不套普通按键浮雕；编号映射需修正 |
| B102 | 登录返回已保存账号、注册/忘记密码、GitHub/Discord页脚链接 | 保留/采用login专用主题link（平面），不做主操作浮雕 |
| B103 | 登录form直接子submit lg | 已有login-r8专用粉色主CTA+3px像素落影+active位移；保留这套一致的登录主按钮，不是stock |
| B104 | 登录页代理设置、恢复备份、迁移旧数据 | 已有login-r8 outline像素落影；保留该登录次级样式，不必重复套R10 |
| B105 | 登录服务器异常Alert内查看状态链接 | 保留login主题link，仍作为警告正文下的补充链接 |
| B106 | 保存账号卡片里的头像+账号身份选择行 | 已有login-r8 account row paint；保留账号卡片，不变成宽大普通CTA；该按钮能登录但视觉职责仍是身份选项 |
| B107 | 上述账号行旁的移除账号图标 | 已有login-r8删除图标hover危险色/像素落影；保留该行内辅助样式，可补按压态，不必改成常驻实体按钮 |
| B108 | 保存账号列表底部“使用其他账号” | 已有login-r8 secondary像素落影；保留登录次级样式 |
| B109 | 隐私锁遮罩下方后台模式/退出账号 | 已有privacy-lock-r96 outline专用像素面/落影；保留专用次级样式，锁定屏是独立安全遮罩，不能直接把它当普通弹窗 |
| B110 | 锁定页“忘记密码”/恢复页“返回” | 保留文字导航结构；可统一现有主题link颜色/下划线/焦点；独立安全屏不要求保持stock文字交互 |
| B111 | 隐私锁恢复form“清除并解锁”主提交 | 已有privacy-lock-r96 default粉色面与3px落影；保留专用主按钮，不能把它误认成普通stock |
| B112 | 当前gallery是无真实点的app-chrome outline sm代表，wrapper同时含合成statusbar按钮 | 无真实站点，不做按钮结论。实际标题栏/状态栏应走其专用chrome规则，而不是把代表样本纳入普通按钮 |

## 关键源码证据

- [EntityDialogScaffold](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/EntityDialogScaffold.tsx#L263-L302>):263–302,396–419,508–523
- [AvatarDialogGalleryTab](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/avatar-dialog/components/AvatarDialogGalleryTab.tsx#L47-L129>):47–129
- [AvatarDialogHeaderActions](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/avatar-dialog/components/AvatarDialogHeaderActions.tsx#L92-L109>):92–109
- [GroupModerationBulkPanel](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/group-dialog/GroupModerationBulkPanel.tsx#L124-L134>):124–134,164–181,224–286
- [GroupDialogHeaderSection](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/group-dialog/GroupDialogHeaderSection.tsx#L191-L225>):191–225,232–311,576–585
- [WorldDialogHeaderSection](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/world-dialog/WorldDialogHeaderSection.tsx#L254-L266>):254–266,493–577,604–615
- [UserDialogHeaderMedia](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/user-dialog/components/UserDialogHeaderMedia.tsx#L54-L112>):54–112
- [UserDialogHeaderBadges](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx#L311-L354>):311–354
- [UserDialogInfoTab](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/user-dialog/components/UserDialogInfoTab.tsx#L239-L252>):239–252,710–735,816–833,906–922,984–995
- [UserDialogHeaderSection](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/user-dialog/components/UserDialogHeaderSection.tsx#L325-L338>):325–338,740–753,911–930
- [UserDialogProfileBackgroundPicker](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/user-dialog/components/UserDialogProfileBackgroundPicker.tsx#L99-L143>):99–143
- [Combobox](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/combobox.tsx#L241-L269>):241–269
- [LoginFormCard](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/auth/components/LoginFormCard.tsx#L58-L66>):58–66,163–196
- [SavedAccountsCard](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/auth/components/SavedAccountsCard.tsx#L64-L141>):64–141
- [PrivacyLockOverlay](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/privacy-lock/PrivacyLockOverlay.tsx#L35-L54>):35–54,121–151,227–234,283–298

## 当前冻结CSS证据

- theme.css:2148–2169 登录账号行/移除图标专用规则。
- theme.css:2198–2227 登录辅助/submit专用规则；submit需要实际form直接子结构，gallery缺失。
- theme.css:2260–2263 登录link。
- theme.css:4762–4782 隐私锁outline/default专用规则。
- theme.css:682–686 头像框由应用所有，不能主题重绘覆盖。
- theme.css:2291–2298 bio外链favicon按钮已有专用交互规则。

Chromium探针使用冻结部署CSS与真实匹配结构：B103主提交是pink rgb(255,127,207)、3px落影；B104/B108/B109是rgb(59,44,85)、2px落影；B111粉色3px落影；B106账号行有2px落影；B107默认无落影（hover单独）。说明gallery缺少结构不能代表真实匹配结果。
