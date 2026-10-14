# 分组标题 & 中列动态表背景：源码级核查（可粘贴选择器 + 行号）

范围：主应用 `/home/fulutang/Documents/Github/VRCX-0-jirai` 只读静态核查（未运行、未构建、未改主仓库、未连 Windows）。
所有行号来自该仓库当前工作树；主题侧行号指向 `runtime/preview-package/jirai-kei-theme/theme.css` 与 `runtime/windose-runtime.css`、`mockups/windose-dark/*`。
标注约定：**【源码可证】**＝源码/规范可判定；**【需实测】**＝本机没抓运行 DOM/WebView，不当作运行时事实。

---

## 1. 结论速览

1. 实机反馈成立：**模拟稿的胶囊+错位阴影只存在于 mockup 类 `.ghead`，真实应用没有任何 `.ghead`**，也没有对应的胶囊规则。
   mockup：`index.html:179-180`（`.ghead` / `.ghead.room` 标记）、`layout.css:55-59`（结构：38px、`::before` 7px 方块、`.cnt` 右对齐）、`reuse.css:25-28`（R4 胶囊：`border-radius:13px` + `box-shadow:3px 3px 0`）、`rich.css:40-41`（`.ghead.room` 薄荷渐变）。
   真实主题只有 `[data-slot="button"]{border-radius:2px}`（`theme.css:665`、`windose-runtime.css:46`），没有 `collapsible`/`badge`/分组标题的任何规则 → 方形扁平按钮 = 实机所见。**【源码可证】**
2. 真实分组标题的**唯一公共组件**是 `ListSectionHeader`（`src/components/layout/ListSectionHeader.tsx`），DOM 是 `Collapsible > button[data-variant=ghost][data-size=sm]` + 标题 `<span>` + `Badge variant="outline"` + 箭头 `svg[data-icon="inline-end"]`；**不是** mockup 的 `div.ghead`。**【源码可证】**
3. 「计数 outline 小 Badge + 下拉箭头」对应 `ListSectionHeader.tsx:46-53`（`Badge variant="outline"`）与 `:54-60`（`ChevronDownIcon data-icon="inline-end"`）；`Badge` 的 `data-slot="badge"`/`data-variant="outline"` 由 base-ui `state` 映射而来（`badge.tsx:36-49` + `node_modules/@base-ui/react/internals/getStateAttributesProps.js:1-20`）。**【源码可证】**
4. 中列「背景遮挡」的遮挡者是**好友动态表自己的根**：`.vrcx-0-data-table{background:var(--vrcx-0-table-surface)}`（`globals.css:984`），而该变量在同一规则里被就地重定义为 `--vrcx-0-main-content-surface`（`globals.css:981`）＝主题的 `#16112a`（`theme.css:57`）。主题 `:root` 里的 `--vrcx-0-table-surface:#201936`（`theme.css:62`）**进不到这个根**。于是整块表格盖住 `.vrcx-0-main-content` 的底纹/装饰（`windose-runtime.css:19,34`、`theme.css:638,653`）。**【源码可证】**
5. 应用自己就有同款"主区表格透明"的先例（壁纸模式下）：`.vrcx-0-main-content .vrcx-0-data-table{--vrcx-0-table-surface:transparent;…}`（`appearanceService.ts:146-149`）→ 透明化在**主内容区**是官方认可的，弹窗/实体弹窗内的表必须保持不透明（`globals.css:988-996`）。**【源码可证】**

---

## 2. 分组标题：全部真实路径

### 2.1 路径清单

| # | 位置 | 组件/代码 | DOM 形态（可作选择器依据） |
|---|---|---|---|
| A | 好友侧栏 5 个分组头：**已分组的好友 / 同一房间 / 在线 / 活跃中 / 离线** | `FriendsSidebarVirtualRows.tsx:200-213`（`case 'section'`）→ `ListSectionHeader.tsx:26-64`；文案键 `side_panel.favorite/same_instance/online/active/offline`（`friendsSidebarVirtualRowBuilder.ts:272-277,245-249,298-303,310-320,322-332`） | `[data-slot="collapsible"] > button[data-variant="ghost"][data-size="sm"]`，内含标题 `span`、可选 `[data-slot="badge"][data-variant="outline"]`、`svg[data-icon="inline-end"]` |
| B | 好友侧栏 房间头（同一房间 下的每个实例） | `FriendsSidebarVirtualRows.tsx:219-233` → `FriendsSidebarHeaders.tsx:41-83` | `div[class~="mb-1"]` 内含位置文本 + 可选 `svg.lucide-map-pin` + `[data-slot="badge"][data-variant="outline"]`（`:76-81`） |
| C | 好友侧栏 收藏分组内联头（按分组拆分时） | `FriendsSidebarVirtualRows.tsx:66-78`（`FavoriteGroupHeaderRow`，文本 `label - count`） | `div.flex.w-full.items-center.px-1.5.py-1.text-left.text-xs` |
| D | 群组侧栏 群组标题 | `GroupsSidebar.tsx:116-175`（有实例：`Collapsible`+`ghost/sm`+箭头 `:143-174`；0 实例：**无箭头**的 `ghost/sm` 普通按钮 `:125-141`） | 与 A 同构（DOM 完全一样） |
| E | 群组侧栏 内联小节头 / 集合头 | `GroupsSidebar.tsx:700-705`（大写小节）、`:706-714`（集合：名称 + 计数） | 普通 `div`，无按钮 |
| F | 世界房间侧栏 | `WorldRoomsSidebar.tsx:348-380,382-405` | **只有房间行/消息/骨架/页脚，没有分组标题**；世界身份在标签栏缩略项 `WorldRoomsTabRail.tsx:9-11`（仅封面 + 数字，无标题组件） |
| G | 主内容区页面内联分组头 | `MyGroupsPage.tsx:154-172`（`:157` 用 `ListSectionHeader`） | 与 A 同构，但**不在侧栏**（`.vrcx-0-main-content` 内） |
| H | 群组弹窗成员分组头 | `GroupMembersPanel.tsx:489-500`（`:493`） | 与 A 同构，在弹窗内 |

侧栏作用域钩子：`aside[data-vrcx-0-surface="side-panel"]`（`SidePanel.tsx:382-392`）；好友/群组/世界房间分别在各自 `TabsContent`（`:441-449 / :450-457 / :486-497`），面板只有 `data-slot="tabs-content"`、`data-index`、`data-hidden`（`tabs.tsx:100-111`，base-ui `TabsPanelDataAttributes.js:11-25`），**没有 `data-value`** → 想按 tab 区分只能靠 `data-index`（顺序随自定义标签变化，不稳健）。**【源码可证】**

### 2.2 精确选择器（默认：零布局改动）

行包装（虚拟行）＝ `div.absolute.top-0.left-0.w-full`（`FriendsSidebar.tsx:829-836`；`GroupsSidebar.tsx:757-762`；`WorldRoomsSidebar.tsx:393-398`），列表内容列内边距 `px-1.5`＝6px（`FriendsSidebar.tsx:823`、`GroupsSidebar.tsx:751`、`WorldRoomsSidebar.tsx:387`）。

```css
/* G1 · 好友 section 头 + 群组 side 群组头（两者 DOM 同构，CSS 无法区分，见边界 E1） */
[data-vrcx-0-surface="side-panel"] [data-slot="collapsible"] > button[data-variant="ghost"][data-size="sm"] {
  background-color: var(--wd-raised);
  border: 1px solid var(--wd-frame);
  border-radius: 13px;
  box-shadow: 3px 3px 0 var(--wd-title-active); /* 阴影不参与布局 */
  color: var(--wd-text);
}
/* 方块标记：用 background 画，绝不用 ::before（::before 会成为 flex item，把标题右推） */
[data-vrcx-0-surface="side-panel"] [data-slot="collapsible"] > button[data-variant="ghost"][data-size="sm"] {
  background-image: linear-gradient(var(--wd-square) 0 0);
  background-repeat: no-repeat;
  background-position: 3px 50%;
  background-size: 5px 5px;
}
/* G2 · 房间头（同一房间 下的实例行）：inset 阴影当强调条，不动 padding */
[data-vrcx-0-surface="side-panel"] div[class~="absolute"][class~="left-0"][class~="w-full"]
  > div[class~="mb-1"]:has(> [data-slot="badge"]) {
  box-shadow: inset 2px 0 0 var(--wd-mint);
}
/* G3 · 收藏分组内联头（label - count） */
[data-vrcx-0-surface="side-panel"] div[class~="absolute"][class~="left-0"][class~="w-full"]
  > div[class~="py-1"][class~="text-left"] {
  box-shadow: inset 2px 0 0 var(--wd-title-active);
  letter-spacing: .04em; /* 只动字距，不动盒模型 */
}
/* G4 · 群组侧栏 0 实例的普通群组按钮（无 collapsible 包裹，GroupsSidebar.tsx:125-141） */
[data-vrcx-0-surface="side-panel"] button[data-variant="ghost"][data-size="sm"][class~="justify-start"] {
  background-color: var(--wd-raised); border: 1px solid var(--wd-frame); border-radius: 13px;
}
/* G5 · 群组侧栏 大写小节头 / 集合头 */
[data-vrcx-0-surface="side-panel"] div[class~="uppercase"][class~="items-end"] { color: var(--wd-faint); }
[data-vrcx-0-surface="side-panel"] div[class~="justify-between"][class~="font-medium"][class~="h-full"] { color: var(--wd-text); }
/* G6 · 主区（我的群组页）与弹窗内的同款分组头（若也想加胶囊，同样只改盒外观） */
.vrcx-0-main-content [data-slot="collapsible"] > button[data-variant="ghost"][data-size="sm"],
[data-slot="dialog-content"] [data-slot="collapsible"] > button[data-variant="ghost"][data-size="sm"] {
  background-color: var(--wd-raised); border: 1px solid var(--wd-frame); border-radius: 13px;
}
```

边界：
- **E1 无法区分**：好友「同一房间」section 头与群组侧栏群组头在 CSS 层面完全同构（都没有 badge 时也无差异：A-同实例组恰好无计数，`friendsSidebarVirtualRowBuilder.ts:245-249`；D 把计数写在标题文本里，`GroupsSidebar.tsx:160-162`）。想分别样式只能靠 `[data-slot="tabs-content"][data-index="N"]`（顺序依赖，见 §2.1）。
- **E2 不许改计数/箭头布局**：`[data-slot="badge"]` 与 `svg[data-icon="inline-end"]` 的尺寸/间距由按钮 `size="sm"` 提供（`button.tsx:26`：`h-7 gap-1 px-2.5 has-data-[icon=inline-end]:pr-1.5`；`badge.tsx:8`：`h-5 px-2 rounded-4xl`）。只改颜色/描边即可；改 `width/height/padding/font-size` 会同时动计数与箭头位置。
- **E3 不许改用户内容**：昵称/位置文本在 `span`、`StaticSidebarLocation`（`FriendsSidebarLocation.tsx:148+`）里，没有专属 class（`research/runtime-hooks.md:253`）；上面的规则一律只命中按钮/容器，不写 `span{}`、不写 `[data-slot="badge"]{}` 的尺寸。
- **E4 行高与虚拟列表**：估算行高 section=38px、房间头/favorite 头=26px（`FriendsSidebarHeaders.tsx:10-16,22-33`），非首个 section 额外 `pt-2`＝8px（`ListSectionHeader.tsx:33`）。真实高度由 `ResizeObserver` 量 `offsetHeight` 回写（`useVirtualSidebarRows.ts:193-230`），所以**不改盒高的规则（背景/描边/圆角/box-shadow）不会造成错位**；若确实要改高度，控制在 ≤ 估算值即可，量测会自我修正。**【源码可证】**
- **E5 错位阴影不会被裁**：视口 `overflow-auto overflow-x-hidden`（`FriendsSidebar.tsx:821`）在左右各留 6px（`px-1.5`），3px 右偏移安全；向下 3px 落在下一行的 `pt-2`(8px) 空隙内。若把偏移放大到 >8px 就可能压到下一行内容或右侧被裁。
- **E6 想要 mockup 的"标题前有方块占位"**：必须接受标题右移（`padding-left` 或 flex `::before`）；上面 G1 用背景画方块是为了守住"零布局改动"。

---

## 3. 中列好友动态表：背景在哪层、何处可透明

### 3.1 层级（自外向内，均为源码可见的类）

1. `.vrcx-0-workspace`：`background: var(--vrcx-0-main-content-surface)`（`globals.css:835-846`）＝主题 `#16112a`（`theme.css:57`）。
2. `.vrcx-0-main-content`（`isolation:isolate`，`globals.css:860-863`）：主题加 `background-color:#201936` + 星点底纹（`windose-runtime.css:19,34`、`theme.css:638,653`）；`::before`/`::after` 已被应用占用（`globals.css:804-816,897`）。页面外壳 `.vrcx-0-page-scaffold`（`p-4`，`PageScaffold.tsx:44-59`）与 `.vrcx-0-page-body`（`:163-177`）**均无背景**。
3. **`.vrcx-0-data-table`：`background: var(--vrcx-0-table-surface)`，且该变量被就地重定义为 `var(--vrcx-0-main-content-surface)`（`globals.css:980-986`）→ 实机为不透明 `#16112a`，**这就是遮挡者**。
4. 列表模式的表头容器：`shrink-0 overflow-hidden border-b bg-[var(--vrcx-0-table-header-surface)]`（`VirtualHistoryList.tsx:117-122`）→ 同样被 `globals.css:982` 重定义为 `#16112a`，所以**主题 `:root` 的 `--vrcx-0-table-header-surface:#2a2147`（`theme.css:63`）进不来，表头与表体同色**。
5. 滚动视口：`min-h-0 flex-1 overflow-auto [overflow-anchor:none]`（`VirtualHistoryList.tsx:135-156`，**自身无背景**）。
6. spacer：`div.relative` + 内联 `height: totalSize`（`:157-162`）→ 高度＝**行高之和**，不预留尾部空间。
7. 行包装 `[data-virtual-row-key]`（`:163-175`）→ 行摘要 `[data-feed-list-summary]`（`FeedVirtualListShell.tsx:167-175`，行高 `32|40px` 来自 `:261`；`bg` 只在展开时加在外层 `:167-171`，hover 底色在摘要行 `:175`）。
8. footer/sentinel：`min-h-10 … px-3 py-2`（`:177-182`）→ 无背景，位于内容最底部。
9. 悬浮"最新"按钮：`bg-popover/95 … backdrop-blur`（`:123-134`）；空态：`h-full min-h-24`（`:184-191`）。

### 3.2 可透明 / 必须不透明

| 层 | 选择器 | 现状 | 裁决 |
|---|---|---|---|
| 表根（主区） | `.vrcx-0-main-content .vrcx-0-data-table` | 不透明 `#16112a`（`globals.css:984→981`） | **可透明**（应用自有先例 `appearanceService.ts:146-149`） |
| 列表模式表头容器 | `.vrcx-0-data-table > div:first-child` | 不透明块（`VirtualHistoryList.tsx:119`） | **可透明**：它是滚动视口的兄弟，不被滚动内容穿过（`:117-120` 无 `sticky`）；想要色带就保留色 |
| 滚动视口 | `.vrcx-0-data-table > div[class~="overflow-auto"]` | 已无背景 | 装饰就该挂这里（§3.3 T3） |
| spacer / 行包装 / 行摘要 / footer | 同上 4 个选择器 | 无背景 | **透明**；hover/展开底色是覆盖层，不要删（可读性） |
| 表格模式 sticky 表头 | `.vrcx-0-data-table thead[data-slot="table-header"]` | `sticky top-0 z-10`（`table.tsx:26`）+ `background:var(--vrcx-0-table-header-surface)`（`globals.css:1077-1079`） | **必须（等效）不透明**：纵向滚动内容从其下方经过 |
| 表格模式 sticky 操作列 | `[data-slot="table-cell"].vrcx-0-table-sticky-action` | `sticky right-0 z-10`（`dataTableStyles.ts:31`）+ `background:var(--vrcx-0-table-surface)`（`globals.css:1086-1088`） | **必须（等效）不透明**：横向滚动内容从其下方经过；若把 `--vrcx-0-table-surface` 设成 `transparent`（应用壁纸模式就是这么干的），这里会透出下层单元格 |
| 悬浮按钮 | `VirtualHistoryList.tsx:123-134` | 95% popover + blur | **必须**：浮在行之上 |
| 弹窗/抽屉内表 | `[data-slot="dialog-content"] .vrcx-0-data-table`（`globals.css:988-991`）、`.entity-dialog .vrcx-0-data-table`（`:993-996`） | popover / entity ground | **保持不透明**：那里的表就是地面，透明会露出弹窗其它滚动内容 |
| 独立 `.app-data-table`（无 `vrcx-0-data-table`） | `InviteMessagePanel.tsx:389`、`PreviousInstancesListTable.tsx:222`、`AppLauncherDialog.tsx:478` 等 | `background:var(--vrcx-0-table-surface)`（`globals.css:975-978`） | 建议不动（都在弹窗/内嵌卡片里） |

### 3.3 可用 CSS（三段，互不耦合）

```css
/* T1 · 让中列底纹在动态表区域内重新可见（与 appearanceService.ts:146-149 同思路，
   但只改本元素的 background，不把变量设成 transparent → 保住 sticky 操作列） */
.vrcx-0-main-content .vrcx-0-data-table { background: transparent; }

/* T2 · 表头色带：必须就地重声明（否则被 globals.css:982 吃掉） */
.vrcx-0-main-content .vrcx-0-data-table { --vrcx-0-table-header-surface: var(--wd-raised); }

/* T3 · 底部装饰：钉在"内容末尾"，零布局改动 */
.vrcx-0-main-content .vrcx-0-data-table > div[class~="overflow-auto"] {
  background-image: var(--wd-bg-sprinkle);     /* 任意 data: 图 = theme-limits 允许的形式 */
  background-repeat: no-repeat;
  background-position: bottom 3.5rem center;   /* 抬离 footer 文字（footer 为 min-h-10+py-2） */
  background-size: 9rem auto;
  background-attachment: local;                /* 贴内容底部：列表短→显示在末行下；列表长→滚到底才出现 */
}

/* T3-alt · 若要"表格模式 sticky 表头"也透明，请配一层等效不透明覆盖，别裸透明 */
.vrcx-0-main-content .vrcx-0-data-table thead[data-slot="table-header"] {
  background-color: color-mix(in oklab, var(--wd-window) 92%, transparent);
  backdrop-filter: blur(6px) saturate(1.02);
}
```

### 3.4 边界（务必连带看）

- **B1 overscan＝8 行**：`DEFAULT_OVERSCAN = 8`（`useVirtualSidebarRows.ts:11,93-97`），`VirtualHistoryList` 未传 `overscan`（`:60-64`），窗口两端各多挂 8 行（`:368-372`）。这些行仍在 spacer 内、被视口裁剪，**不会画到视口之外**；但它们占的是真实行位（`translateY(start)`），所以"尾部空带"只能由**不占行高**的背景/内边距制造，不能用插入元素的方式。
- **B2 spacer 不等于尾部**：`height: totalSize`（`VirtualHistoryList.tsx:161`）只等于行高之和；列表不满一屏时下方空白属于**视口自身**，列表满时尾部在**内容底部**（footer 之后）。T3 的 `local + bottom` 正好覆盖这两种情况。
- **B3 `hasMore` 会推走装饰**：sentinel 用 `IntersectionObserver(rootMargin:'320px')` 预加载（`:104-111`），只要还能加载旧行，滚到底时装饰会被新行顶下去；**只有 `hasMore === false` 时"内容底部"稳定**。
- **B4 首屏看不到装饰是正常的**：mockup 也如此（`research/acceptance-visual.md:219` 记录 tail 需滚到底才完整可见）；`background-attachment: local` 属规范行为，本机未在 WebView2 实测。**【需实测】**
- **B5 别把装饰铺满视口**：行摘要平时是透明背景（`FeedVirtualListShell.tsx:169-175`），若用 `scroll + center`，装饰会透到每一行文字后面（同一结论见 `research/runtime-hooks.md:294`），需要重新量对比度。
- **B6 空态是另一条路径**：无行时视口只有一个 `div:only-child`（`:184-191`），装饰/底色选择器要写 `.vrcx-0-data-table > div[class~="overflow-auto"] > div:only-child`，与 T3 并存不冲突。
- **B7 密度**：估算行高 40/32px（`FeedVirtualListShell.tsx:261`）、`--vrcx-0-table-header-height` 2rem / 压缩 1.75rem（`globals.css:207,239`），装饰的抬升量别写死成 3.5rem 以外就不必随密度变。
- **B8 层叠优先级**：`globals.css` 的 `.vrcx-0-data-table`/`.vrcx-0-table-header` 规则位于 `@layer components`（`:596` 起），主题样式为无层级 CSS → **无层级优先于任何 layer**，T1/T2 与主题既有覆盖同机制，无需 `!important`；表头容器的 `bg-[var(--…)]` 是 Tailwind utilities（同样在 layer 内）。**【源码可证】**
- **B9 应用壁纸模式并存**：`background-image` 层在 `installed-theme` 之前注入（`vrcx0CssLayerService.ts:7-13,44-54`），用户开壁纸时应用也会把 `.vrcx-0-main-content .vrcx-0-data-table` 的 `--vrcx-0-table-surface` 设为 transparent（`appearanceService.ts:146-149`）——T1 只覆盖 `background`，两者叠加不冲突；但那种情况下 sticky 操作列会变透明（应用自带取舍），若在意，用 §3.2 的等效不透明覆盖兜住。
- **B10 弹窗内不受影响**：T1/T2/T3 全部以 `.vrcx-0-main-content` 限定，弹窗/实体弹窗内表不受影响（对应 `globals.css:988-996` 的另两套地面）。

---

## 4. 仍需实测的项（不当作事实）

1. 主题样式元素与 `@layer` 的实际胜负顺序（B8 由规范与注入顺序推得，未在运行的应用中抓 computed 验证）。
2. `CollapsibleTrigger render={<Button/>}` 合并后按钮上 `data-slot` 的最终值（`button` 还是 `collapsible-trigger`）——本节所有选择器都已避开该歧义（用 `tag + data-variant + data-size`）。
3. `background-attachment: local` 在 WebView2 的定位实际表现（B4）。
4. 真实 `[data-slot="badge"][data-variant="outline"]`、`svg[data-icon="inline-end"]` 的抓取确认（源码+base-ui state 映射可证，未抓运行 DOM）。

## 5. 关键证据索引

- 分组头：`ListSectionHeader.tsx:26-64`｜`friends-sidebar/FriendsSidebarVirtualRows.tsx:66-78,200-241`｜`friends-sidebar/FriendsSidebarHeaders.tsx:10-39,41-83`｜`friends-sidebar/friendsSidebarVirtualRowBuilder.ts:136-146,245-249,272-277,298-332`｜`GroupsSidebar.tsx:116-175,700-714,746-750`｜`MyGroupsPage.tsx:154-172`｜`GroupMembersPanel.tsx:489-500`｜`WorldRoomsSidebar.tsx:348-405`｜`SidePanel.tsx:382-392,441-497`
- 原语：`ui/shadcn/button.tsx:22-57`｜`ui/shadcn/badge.tsx:7-28,36-49`｜`ui/shadcn/collapsible.tsx:5-16`｜`ui/shadcn/tabs.tsx:100-111`｜`internals/getStateAttributesProps.js:1-20`
- 表格与虚拟化：`VirtualHistoryList.tsx:60-64,104-134,116-122,135-193`｜`useVirtualSidebarRows.ts:11,193-230,341-399`｜`FeedVirtualListShell.tsx:79-121,142-238,261,289-356`｜`ui/shadcn/table.tsx:5-32,57-81`｜`dataTableStyles.ts:3-31`｜`DataTableView.tsx:253-392`｜`FeedTableShell.tsx:66-196`
- 背景层级：`styles/globals.css:596,975-996,1077-1088,831-863,163,180-181,207,239`｜`AppShellLayout.tsx:147-166`｜`PageScaffold.tsx:44-59,163-177`｜`appearanceService.ts:60-98,146-158`｜`vrcx0CssLayerService.ts:7-13,44-54`
- 主题侧：`runtime/preview-package/jirai-kei-theme/theme.css:54-63,638,653,665,673-676`｜`runtime/windose-runtime.css:15-20,34-35,46-47,59-64`｜`mockups/windose-dark/index.html:179-180`、`layout.css:55-59`、`reuse.css:25-28`、`rich.css:40-41`、`finish.css:4`
