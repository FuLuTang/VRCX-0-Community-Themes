# P1：app 源码侧搜索组件清单

## 结论

对 Windows app `src/` 进行 `findstr /s /i /n` 搜索（HEAD `83e624a06`），结合搜索 placeholder、`ToolbarSearch` / `InputGroup` 使用和 Search 组件名复核后，**当前确认的可见搜索输入均由 `ToolbarSearch` / `InputGroup` / `InputGroupInput` 等封装承载；没有找到应用层直接写出的裸搜索 `<input>` 或 `type="search"`。** 因而本轮没有能确证的 B 类条目；不能因为底层实现可能最终渲染原生 input，就臆断它裸露无皮肤。

扫描输出覆盖了常见功能页及 Tools、Browse History、Feed、设置内搜索。搜索意图通过 placeholder / 组件语义判定；未把纯筛选、表格 query state、测试 mock input、搜索结果按钮误算成输入框。一个组件可能按布局分支出现多次，以下按可见源码调用点列出。

## 完整清单

| 文件:行号 | 元素类型（源码层） | 页面/用途 | A/B/C |
|---|---|---|---|
| `src/features/browse-history/BrowseHistoryPage.tsx:352` | `ToolbarSearch` | Browse History | A |
| `src/features/favorites/components/FavoritesToolbar.tsx:157` | `ToolbarSearch` | Favorites | A |
| `src/features/favorites/SavedGroupFavoritesPage.tsx:263` | `ToolbarSearch` | Saved Group Favorites | A |
| `src/features/feed/components/FeedSearchBox.tsx:108` | `InputGroup`；内部 `InputGroupInput` 在 155 | Feed；多用户 chips / 范围过滤 | A |
| `src/features/friends/components/FriendListToolbar.tsx:113` | `ToolbarSearch` | Friend List（紧凑分支） | A |
| `src/features/friends/components/FriendListToolbar.tsx:162` | `ToolbarSearch` | Friend List（常规分支） | A |
| `src/features/friends/components/FriendLogPageToolbar.tsx:61` | `ToolbarSearch` | Friend Log | A |
| `src/features/friends/components/FriendsLocationsToolbar.tsx:98` | `ToolbarSearch` | Friends Locations | A |
| `src/features/game-log/components/GameLogToolbar.tsx:276` | `ToolbarSearch` | Game Log | A |
| `src/features/instance-history/InstanceHistoryPage.tsx:709` | `ToolbarSearch` | Instance History 对话框搜索 | A |
| `src/features/moderation/components/ModerationPageToolbar.tsx:63` | `ToolbarSearch` | Moderation | A |
| `src/features/my-avatars/components/MyAvatarsToolbar.tsx:107` | `ToolbarSearch` | My Avatars | A |
| `src/features/my-groups/MyGroupsPage.tsx:228` | `ToolbarSearch` | My Groups | A |
| `src/features/notifications/components/NotificationPageToolbar.tsx:88` | `ToolbarSearch` | Notifications | A |
| `src/features/player-list/components/PlayerListToolbar.tsx:68` | `ToolbarSearch` | Player List | A |
| `src/features/search/components/SearchControlBand.tsx:250` | `ToolbarSearch` | Search（用户/世界/头像/群组；占位文本随 tab 变化） | A |
| `src/features/settings/components/settings-dialogs/AvatarProviderDialog.tsx:77` | `InputGroup` / `InputGroupInput` (78) | Avatar Provider 搜索 | A |
| `src/features/settings/components/settings-dialogs/CustomFontDialog.tsx:277` | Settings 控件搜索 placeholder；所在组件有 InputGroup addon (111)，需结合组件逻辑识别 | Custom Font 选择 | A* |
| `src/features/settings/components/settings-tabs/SettingsSocialTab.tsx:287` | `Input` 搜索 placeholder（父级在 277） | Social hidden-feed 搜索 | A |
| `src/features/tools/components/ScreenshotMetadataSections.tsx:245` | `ToolbarSearch` | Screenshot metadata | A |
| `src/features/tools/components/ToolsPageContent.tsx:791` | `ToolbarSearch` | Tools 页面筛选/搜索工具 | A |
| `src/features/tools/vrchat-log/components/VrchatLogToolbar.tsx:167` | `ToolbarSearch` | VRChat Log | A |

A = 使用输入封装（皮肤由封装 slot 或 input-group 外框承担）；B = 已证实裸原生搜索 input；C = 无输入框、仅按钮/图标的搜索入口。本轮没有确认的 C 类独立入口，也没有确认的 B 类搜索框。`A*` 标记组件调用附近同时出现搜索 placeholder 和 InputGroup addon，但未能仅由静态检索完整核实内部具体 DOM 组合，分类置信度低于明确 `ToolbarSearch`。

## B 类目标单列

**确认的 B 类：无。** App 侧递归检索 `type="search"` 无输出；`src/features` 搜索 `<input` 结果仅包含测试文件中的 mock（如 FavoriteCard.test.tsx:92、FavoriteShareCollectionDialog.test.tsx:118/134、InstanceHistoryPage.test.tsx:245、EnhancedInfoFetchSetting.test.tsx:36、SettingsNotificationsTab.test.tsx:53/74），没有发现产品组件中裸 input 被作为搜索字段使用。这里的“无”仅指本轮可核验的 app JSX 搜索调用，不代表所有运行时 DOM 都完成了动态盘点。

## 搜索框附属元素

- FeedSearchBox 是确认包含多用户 chips 的搜索 UI：组件主体在 `FeedSearchBox.tsx:108` 建立 InputGroup，输入组件为 155 行，末尾操作组在 231 行；FeedToolbar 在 `FeedToolbar.tsx:212` 调用它。图标/清除动作的精确 DOM 未在本轮逐组件深读，故不将其作为清单字段断言。
- `ToolbarSearch` 源码调用本身证明封装，不足以仅凭调用点断定每个使用点都有独立图标、清除按钮；具体属性/图标以组件实现和调用 props 为准。
- C 类（纯图标/按钮）不属于输入框皮肤任务；静态文本搜索不足以保证所有纯图标入口均穷举，因此不声称 C 类全量。

## CSS 盲点验证

检查当前主题入口 `themes/jirai-kei-theme/theme.css`：

1. L121–138 有 `[data-slot="input"]` 以及 placeholder 等规则；L351、380 等也针对 slot input 做状态/过渡处理。
2. 对任意一处明确的 `ToolbarSearch` 调用（例如 `FriendListToolbar.tsx:113`、`SearchControlBand.tsx:250`），源码只看到封装组件；不能把它等同裸 `<input>`，亦不能断言 selector 对内部实现的命中情况。
3. 若对照假设为裸 `<input type="search">`，主题规则中没有通用 `input[type="search"]` 文本字段选择器；`[data-slot="input"]` 也不会自动匹配没有该属性的原生元素。因此若运行时确有这种裸元素，它会落在主题文本字段选择器之外。这个结论是 selector 语义验证，不是 app 中已发现裸搜索框的证据。
4. 独立原生-input 普查报告 [`P1-G1-native-input.md`](P1-G1-native-input.md#L62-L74) 记录通用字段 selector 不含普通原生 text/number/search，并列出原生文本字段需补齐的建议。其证明了主题侧风险存在，但不证明本次 app 清单里有 B 类实例。

**结论：** 先前 CSS 侧存在“原生 input 搜不出来”的方法盲点属实，但这次源代码搜索暂未找到可坐实的裸搜索输入实例。要判定封装内部实际是否为裸 input、是否被 runtime 层其他规则影响，需要继续读取 `ToolbarSearch` 及对应 Input 组件实现，或运行时 DOM 检查；本次按约束没有启动浏览器，也不把推断写成发现。

## 范围与未确定项

搜索以 app Windows checkout 的 `src/` 为目标，采用 `findstr /s /i /n` 并在功能组件中复核关键搜索调用。没有对每个 i18n key 展开文案，也没有逐一手工检查全部纯图标导航入口；“所有”是基于上述源码线索扫描的已确认输入组件集合，不是动态运行时 DOM 证明。测试 mock 和普通登录/设置字段未因其为 `<Input>` 就误归为搜索框。
