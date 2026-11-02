# Runtime 样式职责索引

**顺序由 parts.json 决定，目录不代表层叠顺序。** 每个条目对应一个完整文件；每个文件只出现一次，SECTION 名唯一。新建文件后必须显式接入 [parts.json](./parts.json)。

本次只做原位连续拆分和相邻合并，不改规则、选择器、声明、嵌套块、关键帧或层顺序。来源注释中的“旧片段”是历史标识，不是可继续编辑的文件路径；原行号见该注释。

## 目录与文件职责

### foundation/

全局变量、字体、排版、滚动条与保序保留的应用基础小规则。

| 文件 | 职责 |
|---|---|
| [foundation/app-utilities.css](./foundation/app-utilities.css) | 保留 SOCIAL 标题默认值、原生时间图标、JSON 折叠图标与选区颜色。 |
| [foundation/body-typography.css](./foundation/body-typography.css) | 正文字体继承、用户文字与代码等宽字体例外。 |
| [foundation/fonts.css](./foundation/fonts.css) | 内嵌字体 @font-face 及 OFL 授权声明。 |
| [foundation/scrollbars.css](./foundation/scrollbars.css) | 原生滚动条与 Base UI ScrollArea 外观。 |
| [foundation/tokens.css](./foundation/tokens.css) | 主题语义变量、Win98 按键色与浮雕 token；构建时执行既有调色转换。 |
| [foundation/windose-palette.css](./foundation/windose-palette.css) | 定义 Windose 基础调色与浮雕面板变量。 |

### regions/

应用区域；sidebar 为左侧导航，side-panel 为右侧社交面板，titlebar 为窗口标题栏。

| 文件 | 职责 |
|---|---|
| [regions/app-frame.css](./regions/app-frame.css) | 应用窗口、左右侧区域底色纹理与基础标题排版。 |
| [regions/main-wallpaper.css](./regions/main-wallpaper.css) | 主内容区游戏背景图、角图比例及窄窗口适配。 |
| [regions/side-panel-group-spacing.css](./regions/side-panel-group-spacing.css) | 右侧社交面板分组标题后的间距修正。 |
| [regions/side-panel.css](./regions/side-panel.css) | 右侧社交面板工作区边距、边框、页签承接面与加号按钮。 |
| [regions/sidebar/cat-pocket.css](./regions/sidebar/cat-pocket.css) | 左侧导航空档猫口袋的几何和像素图像。 |
| [regions/sidebar/compact-and-reduced.css](./regions/sidebar/compact-and-reduced.css) | 矮窗口导航装饰裁剪及应用全局减少动效兜底。 |
| [regions/sidebar/footer.css](./regions/sidebar/footer.css) | 导航底部凹槽底色及展开态猫咪预留间距。 |
| [regions/sidebar/nav-phone.css](./regions/sidebar/nav-phone.css) | 导航标题栏手机精灵循环与减少动效处理。 |
| [regions/sidebar/navigation.css](./regions/sidebar/navigation.css) | 左侧导航区域基础窗口与展开态装饰承载结构。 |
| [regions/statusbar-paint.css](./regions/statusbar-paint.css) | 状态栏布面与蕾丝涂装及标题栏和导航页脚共用减少动效块。 |
| [regions/titlebar/bell-badge.css](./regions/titlebar/bell-badge.css) | 标题栏铃铛高对比闪烁未读角标。 |
| [regions/titlebar/brand-heart.css](./regions/titlebar/brand-heart.css) | 标题栏品牌多色像素心、触发器留白及逐帧动画。 |
| [regions/titlebar/paint.css](./regions/titlebar/paint.css) | 窗口涂装共享变量、标题栏菜单及窗口按钮状态。 |
| [regions/window-chrome.css](./regions/window-chrome.css) | 真实标题栏与状态栏结构、字形尺寸、品牌定位和蕾丝几何。 |

### components/

按组件主体归属的共享外观及必要上下文例外。

| 文件 | 职责 |
|---|---|
| [components/avatar-base.css](./components/avatar-base.css) | 定义共享头像切角变量及基础头像形状。 |
| [components/avatar.css](./components/avatar.css) | 弹层与各页面用户头像、群组头像例外、头像骨架及状态灯。 |
| [components/badge.css](./components/badge.css) | 徽标、计数变体、快捷键键帽及粉色表面修饰。 |
| [components/button.css](./components/button.css) | 按钮默认皮肤、粉色表面修饰、行按钮和窗口键特例。 |
| [components/calendar.css](./components/calendar.css) | 各容器内日历日期、选中范围、今天与键盘焦点涂装。 |
| [components/card.css](./components/card.css) | 卡片默认框体、媒体磁贴状态与可折叠卡片修饰。 |
| [components/choice.css](./components/choice.css) | 复选框、单选、原生范围滑条和 Base UI Slider 的默认外观。 |
| [components/dialog.css](./components/dialog.css) | 普通对话框、确认框与 Sheet 的框体、遮罩及打开动画。 |
| [components/fields.css](./components/fields.css) | 输入组、输入框、文本域、原生选择、多选标签和槽内按钮。 |
| [components/language-badge.css](./components/language-badge.css) | 表格语言和地区标签的专用涂装。 |
| [components/loader-dancer.css](./components/loader-dancer.css) | 页面级跳舞加载精灵图集变量与关键帧。 |
| [components/misc.css](./components/misc.css) | 行内提示、分隔线、分页、空状态与浮动选择操作栏。 |
| [components/number-field.css](./components/number-field.css) | 像素切角共享变量与数字步进器外观。 |
| [components/object-row.css](./components/object-row.css) | 页面卡片页脚基底与媒体资源和群组磁贴 object-row 表面。 |
| [components/popup.css](./components/popup.css) | 菜单、选择列表、弹出层、悬停卡片和提示气泡的外观与状态。 |
| [components/progress-custom.css](./components/progress-custom.css) | 标题栏与关系图自定义细进度条。 |
| [components/progress.css](./components/progress.css) | Progress 分段槽与 Skeleton 步进节奏。 |
| [components/sidebar-nav.css](./components/sidebar-nav.css) | 左侧导航项字体、选中、悬停、折叠态及光标动画调用。 |
| [components/spinner.css](./components/spinner.css) | 页面区块跳舞加载精灵路由与行内像素转圈及减少动效处理。 |
| [components/splitter.css](./components/splitter.css) | 共享拖动分割手柄外观及交互反馈。 |
| [components/switch.css](./components/switch.css) | Switch 心形开关及原位保留的滚动条箭头资源变量。 |
| [components/table.css](./components/table.css) | 表格 token、表头、悬停选中行与空状态。 |
| [components/tabs.css](./components/tabs.css) | 按主体归属的通用页签、竖排花边、右侧文件夹页签及实体属性页签。 |
| [components/timeline.css](./components/timeline.css) | 时间线节点、连接线和日期文字。 |
| [components/toast-icons.css](./components/toast-icons.css) | Toast 状态图标精灵。 |
| [components/toast.css](./components/toast.css) | Toast 窗口、文字与焦点外观。 |
| [components/toggle-group.css](./components/toggle-group.css) | 切换按钮组的凹槽、按键深度与状态动画。 |

### pages/

由真实页面结构锚定的专属样式；同页不相邻段用不同文件保留层叠位置。

| 文件 | 职责 |
|---|---|
| [pages/activity-palette.css](./pages/activity-palette.css) | 活动页图表配色与列表按钮。 |
| [pages/activity-showcase.css](./pages/activity-showcase.css) | 活动展示卡像素窗口表面。 |
| [pages/browse-history.css](./pages/browse-history.css) | 浏览历史页面日期、列表与行操作显隐。 |
| [pages/community-themes.css](./pages/community-themes.css) | 社区主题目录内部预览表面。 |
| [pages/dashboard.css](./pages/dashboard.css) | 仪表盘工作区面板、编辑选中与分割组。 |
| [pages/favorites.css](./pages/favorites.css) | 收藏页面面板、磁贴、好友行与选中状态。 |
| [pages/feed-badges.css](./pages/feed-badges.css) | 动态类型图标、状态小点与徽标的像素化。 |
| [pages/feed-columns.css](./pages/feed-columns.css) | 动态列窗口、标题条及拖放遮罩。 |
| [pages/friend-list.css](./pages/friend-list.css) | 好友列表卡片内容内嵌边框。 |
| [pages/game-log.css](./pages/game-log.css) | 游戏日志吸顶会话标题及其按钮。 |
| [pages/group-moderation.css](./pages/group-moderation.css) | 群管理页导航轨道与分组标题。 |
| [pages/instance-history.css](./pages/instance-history.css) | 实例历史虚拟列表行、交互状态及浮层。 |
| [pages/login.css](./pages/login.css) | 登录页整页像素窗口卡片和专属装饰。 |
| [pages/mutual-friends-history.css](./pages/mutual-friends-history.css) | 两人关系历史卡片行及交互状态。 |
| [pages/mutual-friends-overlays.css](./pages/mutual-friends-overlays.css) | 共同好友关系图浮层、图例及详情头像。 |
| [pages/my-avatars.css](./pages/my-avatars.css) | 我的头像页面磁贴及工具按钮。 |
| [pages/notification-center.css](./pages/notification-center.css) | 通知中心 Sheet 涂装及其与 Toast 共用的减少动效规则。 |
| [pages/privacy-lock.css](./pages/privacy-lock.css) | 隐私锁屏窗口、标题与方形状态灯。 |
| [pages/settings-ornaments.css](./pages/settings-ornaments.css) | 设置页折叠标题蝴蝶结与蕾丝装饰。 |
| [pages/settings-tools-cards.css](./pages/settings-tools-cards.css) | 设置和工具页卡片外挂蕾丝、药丸与页内装饰变量。 |
| [pages/vrchat-log.css](./pages/vrchat-log.css) | VRChat 日志容器与错误表面。 |

### entity-dialog/

用户、世界、群组等详情弹窗（.entity-dialog / .owner-dialog）专属规则。

| 文件 | 职责 |
|---|---|
| [entity-dialog/banner-avatar.css](./entity-dialog/banner-avatar.css) | 详情横幅遮罩框架及横幅头像切角。 |
| [entity-dialog/banner-base.css](./entity-dialog/banner-base.css) | 详情横幅上下遮罩基底颜色与边距。 |
| [entity-dialog/banner-frame.css](./entity-dialog/banner-frame.css) | 详情横幅穿孔数字介质相框及装饰遮罩。 |
| [entity-dialog/banner.css](./entity-dialog/banner.css) | 详情横幅头像按钮、签名链接行和横幅花纹。 |
| [entity-dialog/bio-diff.css](./entity-dialog/bio-diff.css) | 签名历史增删对比、差异标记与链接配色。 |
| [entity-dialog/nameplate.css](./entity-dialog/nameplate.css) | 详情弹窗头像与用户姓名牌方形状态灯。 |
| [entity-dialog/range.css](./entity-dialog/range.css) | 详情专属原生范围滑条、焦点与日期气泡。 |

### motion/

装饰动画、共享关键帧及减少动效；不拆开共享选择器或 @media 块。

| 文件 | 职责 |
|---|---|
| [motion/chrome-decorations.css](./motion/chrome-decorations.css) | 窗口装饰共享关键帧、状态栏蕾丝和标题栏及导航装饰动效；共用减少动效块保持完整。 |
| [motion/ornaments-and-primitives.css](./motion/ornaments-and-primitives.css) | 共享动效关键帧、左右栏装饰与进度条动效及其共用减少动效块。 |
| [motion/side-panel-cat.css](./motion/side-panel-cat.css) | 右侧社交面板角落猫装饰定位与绘制。 |
| [motion/sidebar-cats.css](./motion/sidebar-cats.css) | 导航底部和右侧 SOCIAL 猫咪跳跃及减少动效处理。 |

## 保序留下的跨职责段

- `components/number-field.css` 开头保留共享 `--jk-px-cut`，避免拆出仅一规则文件；后续设置装饰独立存放。
- `components/switch.css` 开头的滚动条箭头变量原本位于 Switch 前；不得移至后面的 `foundation/scrollbars.css`，否则不再文本等价。
- `foundation/app-utilities.css` 保留 SOCIAL 标题兜底、原生时间图标、JSON 图标与选区颜色，避免一两条规则被切成独立文件。
- `motion/ornaments-and-primitives.css`、`motion/chrome-decorations.css` 含共享关键帧与跨区域的减少动效选择器，完整保留；`r5-charm-swing` 仍由挂饰规则引用，未删除。
- `pages/notification-center.css` 尾部的 Toast / Sheet 共用减少动效块、`regions/statusbar-paint.css` 尾部的标题栏 / 页脚共用减少动效块均不拆开。
- 部分仅一两条规则的页面/详情段（活动展示、主题目录、好友内框、横幅底色）具有清晰独立归属；为避免并入不相关主题，保留这些自然边界。
- Tabs 按选择器主体归属；以 Tabs 为祖先锚定的页面装饰仍归页面文件，而非所有含 Tabs 选择器都归 `components/tabs.css`。

## 构建输入与历史材料

`parts.json` 还引用四个 `../original-assets/` 资源文件，并使用构建器生成的 `native-icons`。它们不属于此目录的手工片段。`preview-package/` 是构建产物；`checks/` 是只读历史证据，不是运行时输入，里面的 CSS 不接入 parts，也不随此次整理改写或删除。`tools/` 是既有运行时辅助脚本，本次不改。

文本等价校验应在构建后去掉 SECTION 标记行和纯空白行再逐字比较；不能忽略其他字符差异。后续如要移动非相邻段或合并隔开的同主题规则，必须单独做全量 style-diff，不属于此次整理。
