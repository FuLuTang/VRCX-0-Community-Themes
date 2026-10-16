# data-ui-role 清理与 Tabs 审计（2026-10-15）

## 范围与边界

- 续接已有[清理脚本](../tools/remove-ui-role-dependency.mjs)，没有重建原成果、派代理、使用 workflow、修改 Harness、连接或部署 Windows。
- 应用仓库只读。接手时应用 `git status --short` 为空；主题仓库已有 **167 个 tracked 删除项**及未跟踪清理脚本。本轮不恢复、不清理这些遗留项；不能把它们算作本轮改动。用户所述上一轮 36+ 文件变更未在当前应用工作树中出现。
- 只清理三份活跃 CSS 的新增属性依赖，保留 `data-slot`、`data-variant`、`data-size`、`aria-*`。不实施 Tabs 视觉统一。
- [reference 说明](../refactor/reference/README.md#L3-L28)明确历史快照是冻结验收基线；本轮比较参照为**各活跃文件清理前自身**，不把清理后的版本伪称与历史快照相同。

## 清理执行与验证

三份活跃 CSS 已由脚本完成 **dry-run → write → 再次 dry-run**，三轮均 exit 0；[写后幂等证据](ui-role-idempotency.json)确认三份 `changed:false`、前后 hash 相同，无再次写入。每份新增属性出现次数 **11 → 0**（合计 33 → 0）。

| 文件 | bytes 前 → 后 | SHA-256 前 → 后 |
|---|---:|---|
| [当前预览包](../runtime/preview-package/jirai-kei-theme/theme.css#L5219-L5265) | 1,044,718 → 1,044,021 | `0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc` → `746fc9c086c0ef17cb48b01c6ebdc7b000991809d4d035bc5ecabdc7b5aae36b` |
| [分拆重构源](../refactor/src/style/16-final-navigation.css#L200-L246) | 20,567 → 19,870 | `7698e10cb3ff44214027930cbeb46e5582c7da259d5921bf313b453cec19ee43` → `55dcf8734ae6326f88ea3b4a4fe7e1792112c8d0fba9c095578d9d98620e1673` |
| [运行时片段](../runtime/entity-button-roles-b054-b072.css#L1-L46) | 6,781 → 6,064 | `b2fdd8b26d2ecd2f0d23e5bcbd4acc936e51823f69fb304d19644488b7a279fd` → `93812c0db2f5bdbdc7f9aa11d4ad4847216c39db379e1555411a45957897eab2` |

备份目录：`/tmp/jk-ui-role-8aE6Vv`；三份原文保留原相对目录，[manifest](</tmp/jk-ui-role-8aE6Vv/manifest.json>)记录完整前后 hash，并已独立读取备份逐一复核。临时目录不是长期归档，清理系统临时文件前应另行保存。

[预演记录](ui-role-dry-run.json)、[写入记录](ui-role-write.json)、[独立静态验收](ui-role-static-verification.json)已保存于仓库。每轮成功的浏览器执行比较 **7,398 个按钮样本 × 本体/前伪元素/后伪元素 = 22,194 组前后 computed-style 等价比较**，全部无差异；不是把属性数当样本数。另独立正向检查三份 CSS 的清理前备份与清理后版本：portal 按钮 `appearance:none` 与 focus-visible `outline-width:2px` 均实际生效，排除“两边都没加载主题”的假通过。

独立验收确认：除整块删除的 text-link 规则以外，声明序列（含 important）完全相同；所有非 role 属性选择器序列相同；预览包与重构源在此 SECTION 以前的字节完全相同，包含全部 Tabs 外观规则；预览包精确内嵌清理后的片段。`git diff --check` 通过。

预算：当前实际预览包 **1,044,021 / 1,048,576 B**，余 **4,555 B**，比清理前缩小 697 B。另实际执行重构生成器输出到[临时生成文件](</tmp/jk-ui-role-8aE6Vv/refactor-generated.css>)：24 sections、默认带分隔注释，**1,053,462 B，超 1 MiB 4,886 B**；属性依赖为 0。这是重构候选构建的既有超预算问题（按本轮唯一 697 B 差额，清理前同模式为 1,054,159 B），本轮不为压预算擅自改无关源码/注释或覆盖实际预览包；该候选产物未发布。

历史例外单列：[reference 快照](../refactor/reference/baseline-theme.css#L5207-L5255)仍有 **11** 处依赖、hash `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`，未改；[早期发布包](../../../themes/jirai-kei-theme/theme.css)仍为 **0**，hash `cc6dda3d2b1c96976aa3652f8861c0d1392dcc99889f8b0437e6c7157e5c2a41`，未改。**不声称全仓库 0**（历史探针、快照与文档仍会匹配）。

### 脚本修正及验证边界

- 参数只接受 `--dry-run` / `--write`，默认预演，禁止混用；相对脚本位置解析主题根目录及兄弟应用仓库，依赖只读复用应用的 PostCSS/selector parser 与主题 tools 的 Playwright，无安装步骤。
- 严格校验每文件原有 11 处命中；删除 action 整分支、`:not` 整列表项、choice-list 分支及仅依赖 text-link 的整块（包括子规则），保留 `.h-auto.justify-start`、`collapsible-trigger`、`.h-auto.justify-between`。不把分支退化为裸 button 或 `*`。只修正相关注释，不重新格式化 CSS。
- PostCSS 与 selector parser 解析前后整份 CSS；检查空伪类列表及 transform 幂等。Chromium 检查修改后的选择器 `CSS.supports(selector(...))`，额外验证原生 nesting 的 CSSOM 子规则，避免仅通过 permissive grammar 得到假阳性。
- 无 role DOM：五种 portal × 六种 variant × 九种 class × 九种状态，另有 plain、collapsible、图片、header/menu、close、entity/owner 与外部对照。比较所有可枚举**标准 computed 属性**及 `::before` / `::after`，不包含继承的自定义资源变量。
- 过渡、动画与 caret 均在夹具层禁用；每次更换 CSS 等待两帧，网络请求被拦截。不是把过渡中的瞬时值误当回归；transition/animation 声明本身另以静态差异确认未动。
- 初次尝试包含巨大继承自定义资源变量，导致 renderer crash；改为 Chromium 内精确逐值比较、仅返回差异索引，排除自定义变量，**未删减标准 computed 属性**。失败发生于写入之前。
- 当前 headless 环境鼠标事件不更新 `:hover`（独立探针确认），因此交互检查采用真实 focus-visible + CDP 强制 hover/active，通过 sentinel computed 声明确认 CSS 状态有效；不谎称经过真机鼠标验证。交互夹具与矩阵分开，避免绝对定位控件遮挡。
- 本轮是离线语法、CSSOM 与有限夹具等价验证，不是完整应用路由或 Windows 实机视觉验收。

### 生成链

[运行时生成器](../runtime/build-runtime.mjs#L49-L59)读取已清理的[活跃片段](../runtime/entity-button-roles-b054-b072.css)，不会从 reference 读回属性。同步修正该生成器的 SECTION 注释，以及[提取工具](../runtime/tools/extract-shadow-sections.mjs#L44-L50)要求的精确 marker 字符串，避免下一次生成恢复错误注释或提取失败；这两项是除三份 CSS 外必要的工具同步。

[重构生成器](../refactor/tools/build-theme.mjs#L11-L35)读取清理后的分拆源，不读取历史 reference。历史 probe/实施脚本仍可能包含 data-ui-role，它们不是活跃构建输入；其中[旧补丁脚本](../runtime/checks/element-style-audit/patch-shared-button-states.mjs#L5-L33)已标记 RETIRED 并有拒跑保护，本轮不运行这些历史工具，也不运行会写应用源码的旧实施脚本。

## Tabs：只有一套基础实现，不是多个同名组件

依据[基础组件](../../../../VRCX-0-jirai/src/ui/shadcn/tabs.tsx#L13-L98)与[别名导出](../../../../VRCX-0-jirai/src/ui/shadcn/tabs.tsx#L113-L118)：

- **实现 1 套**：Base UI Tabs；`TabsTrigger` 就是 `TabsTab` 的别名，`TabsContent` 同理。
- variant 2 个：`default` / `underline`。variant 只决定 class 与 indicator class，**没有输出 `data-variant`**，不可使用臆造的 `[data-variant=underline]` 区分。
- [size 3 个](../../../../VRCX-0-jirai/src/lib/segmented-control.ts#L1-L9)：`default` / `sm` / `lg`，List context 传给 Tab，可单项覆盖；现有调用没有 Tab 级 size 覆盖。
- orientation 2 个：默认 horizontal，显式 vertical。DOM 使用 `tabs` / `tabs-list` / `tabs-tab` / `tab-indicator`，选中状态 `data-active`（兼容选择器还会检查 aria-selected）。
- API 理论可组成 2×3×2=12 种组合，不代表有 12 套组件或 12 个视觉家族。

### 全量调用统计

只读 Babel TSX AST [审计脚本](../tools/audit-tabs.mjs)识别 import 别名；完整逐调用文件/行号/属性/祖先 Tabs 保存在[清单](ui-role-tabs-inventory.json)。这是源码 opening-element 数量，不是 map 展开后的运行时 tab 个数。

| JSX 名称 | 生产源码 | 测试源码 |
|---|---:|---:|
| Tabs | 25 | 2 |
| TabsList | 19 | 0 |
| TabsTrigger | 25 | 0 |
| TabsTab | 1 | 0 |
| ToolbarTabs | 7 | 1 |

19 个 List 源码站点中一个是 ToolbarTabs 的内部实现，故**仅展开 ToolbarTabs** 后为 **18 个直接 List 站点 + 7 个 ToolbarTabs 调用 = 25**，不是 26。这不递归展开其它业务组件，也不把 map 或组件复用当运行时数量；不能把 Trigger 状态选择器条数算组件种类。实体 underline 包装器另有 4 个复用调用：[用户](../../../../VRCX-0-jirai/src/components/dialogs/user-dialog/components/UserDialogTabsSection.tsx#L304)、[世界](../../../../VRCX-0-jirai/src/components/dialogs/world-dialog/WorldDialogTabPanels.tsx#L218)、[群组](../../../../VRCX-0-jirai/src/components/dialogs/group-dialog/GroupDialogTabPanels.tsx#L262)、[头像](../../../../VRCX-0-jirai/src/components/dialogs/AvatarDialogTabbedView.tsx#L594)，不代表 4 套实现。

| variant / size / orientation | List 定义点数（含包装器实现） | 展开包装器后的使用点数 | 代表 |
|---|---:|---:|---|
| default / default / horizontal | 13 | 19 | 邀请消息、好友位置、画廊、库存、普通弹窗 |
| default / sm / horizontal | 1 | 1 | [AvatarDialogPerformanceTab:315](../../../../VRCX-0-jirai/src/components/dialogs/avatar-dialog/components/AvatarDialogPerformanceTab.tsx#L315) |
| default / default / vertical | 3 | 3 | [SettingsPage:77](../../../../VRCX-0-jirai/src/features/settings/SettingsPage.tsx#L77)、[ToolsPageContent:823](../../../../VRCX-0-jirai/src/features/tools/components/ToolsPageContent.tsx#L823)、[WristFeedNotificationsDialog:393](../../../../VRCX-0-jirai/src/features/settings/components/settings-dialogs/WristFeedNotificationsDialog.tsx#L393) |
| underline / default / horizontal | 1 | 1 | [EntityDialogScaffold:159](../../../../VRCX-0-jirai/src/components/dialogs/EntityDialogScaffold.tsx#L159) |
| underline / default / vertical | 1 | 1 | [SidePanel:500](../../../../VRCX-0-jirai/src/components/sidebar/SidePanel.tsx#L500) |

`lg` 当前使用 0，明确实际组合 **5 种**。ToolbarTabs 的 7 个调用是 Activity、BrowseHistory、FriendsLocations、InstanceHistory、Notifications、PlayerList、Search，全部沿用 default/default/horizontal。

### 用户指出的两处差异为何存在

- [邀请消息模板](../../../../VRCX-0-jirai/src/components/dialogs/InviteMessageDialog.tsx#L148-L176)是普通 `DialogContent` 内 default Tabs；[DialogContent](../../../../VRCX-0-jirai/src/ui/shadcn/dialog.tsx#L58-L98)明确经 Portal 输出，不是页面 scaffold 的后代。
- [好友位置](../../../../VRCX-0-jirai/src/features/friends/FriendsLocationsPage.tsx#L18-L32)处于 PageScaffold；[其工具栏](../../../../VRCX-0-jirai/src/features/friends/components/FriendsLocationsToolbar.tsx#L65-L95)调用 ToolbarTabs；[包装器](../../../../VRCX-0-jirai/src/components/layout/ToolbarControls.tsx#L153-L175)只是同一 List/Trigger 加可选 count/icon。
- 所以两者基础组件相同；count 不是独立视觉家族。预览 CSS 2448–2487 的 Win98 横向基础皮肤限定 `.vrcx-0-main-content .vrcx-0-page-scaffold`，页面匹配、portal 不匹配。4292–4295 的 R10 补丁仍限定 main-content/side-panel，也补不到普通 Portal。

## 主题视觉家族：4 个职责，外加 1 条未收敛回退路径

按职责应计 **4 个家族**，而不是把每个历史补丁、尺寸、count 当新家族。当前横向普通 Dialog 没有统一基础皮肤，形成第 **5 条有效外观路径（缺口，不是值得保留的新设计）**。这是源码/选择器审计分类，不是宣称已逐路由截图验收。

| 家族/路径 | 真实调用证据 | 预览 CSS 层及问题 | 建议 |
|---|---|---|---|
| 1. 普通横向 Win98 分段 Tabs | 页面 ToolbarTabs 与 Gallery/Inventory；普通弹窗也属同职责 | 2448–2487；R10 4292–4295 是同职责补丁，非新组件 | 页面和普通弹窗共用一套基础 paint，保留布局、换行、滚动、sm |
| 2. 竖向内容/章节导航 | [SettingsPage:71–91](../../../../VRCX-0-jirai/src/features/settings/SettingsPage.tsx#L71-L91)、[ToolsPageContent:817–843](../../../../VRCX-0-jirai/src/features/tools/components/ToolsPageContent.tsx#L817-L843)；[WristFeedNotificationsDialog:381–393](../../../../VRCX-0-jirai/src/features/settings/components/settings-dialogs/WristFeedNotificationsDialog.tsx#L381-L393) | 1298–1309 设置直子结构；2845–2878 chart 工具 rail；4896–4899 再加蕾丝。腕带弹窗不匹配页面结构，存在同类覆盖缺口 | 保留竖向布局/导航职责，可统一颜色 token，页面蕾丝只是装饰层；腕带弹窗需单独确认后纳入 |
| 3. 侧栏 edge rail | [SidePanel:395、499–570](../../../../VRCX-0-jirai/src/components/sidebar/SidePanel.tsx#L395-L570)，真实 underline/vertical | 1051–1125 用 `[role=tab]` 处理 tooltip/context-menu render 替换 slot，选中项与侧面板融合 | 保留独立紧凑 rail，不套横向 raised 框；R10 非 orientation 限制可能覆盖列表框，需复核去重 |
| 4. 实体详情 underline | [EntityDialogScaffold:159–168](../../../../VRCX-0-jirai/src/components/dialogs/EntityDialogScaffold.tsx#L159-L168)；复用于用户/世界/群组/头像详情 | 全局 618 字体、676 active paint、689–691 心形装饰；实体 class 和高 11 行真实存在。TabsTrigger 自带透明 active 等 class | 保留有真实调用证据的 underline，不能全局隐藏 indicator；全局 active 粉底与 underline 意图可能冲突，后续须计算样式验收 |
| 缺口：普通 Portal 横向回退 | [InviteMessageDialog:167](../../../../VRCX-0-jirai/src/components/dialogs/InviteMessageDialog.tsx#L167)、[CustomFontDialog:231](../../../../VRCX-0-jirai/src/features/settings/components/settings-dialogs/CustomFontDialog.tsx#L231) 等 | 不进入页面 Win98 或 R10 层，主要留基础组件 rounded/indicator 和全局字体/active 覆盖 | 合并入家族 1，不保留为“消息模板专用风格” |

全局 active 装饰还有 1420/1582/1596/1901 等历史层；竖向导航的 R97 是第 2 家族的后叠装饰，不应另算一套。R10 普通补丁未限定横向，可能碰到侧栏 rail；仅凭声明存在不能直接宣称最终 paint，须后续在真实 DOM 上验收。

### 最小后续方案（本轮未实施）

1. 在[运行时 controls 层](../runtime/controls-r9.css)及[对应重构层](../refactor/src/style/11-controls-and-pages.css)归一普通横向 paint，再同步预览产物；复用现有 `[data-slot=tabs-list]`、orientation、`dialog-content` 等，不改应用、不加新属性。
2. 普通页面与普通 Dialog 共用同样的框、idle/hover/active/focus/disabled；保留尺寸/宽度/overflow/flex-wrap 和 count span。先排除实体详情的现有 `.entity-dialog`、侧栏 rail、vertical，不扩大为所有 role=tab。必要时用已有结构/class 识别 underline，不能使用不存在的 variant DOM 属性。
3. 真正 underline 与 rail 按实际调用保留；设置/工具/腕带竖向共享导航语义与 token，但不强制改成横向按钮或裁掉布局。清理 2448 与 4292 的重复、global active/装饰与 underline 的覆盖冲突后再验收。
4. 最小审批范围仍是主题 CSS 层及其生成产物；验证矩阵至少含消息模板/好友位置、sm 性能页、实体 underline、SidePanel tooltip rail、设置/工具/腕带竖向，以及键盘 focus/disabled/active。用户未批准前不执行这一视觉方案。
