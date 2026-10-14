# 正式 CSS 的真实运行时钩子（可粘贴选择器 + 行号）

- 主程序（**只读**，未 git / 未构建 / 未修改）：`/home/fulutang/Documents/Github/VRCX-0-jirai`
- 主题仓库（只读）：`/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/themes/`
- 已有调研（不重复结论，只引用）：`research/avatar-icon-dom.md`、`research/theme-limits.md`、`../vrcx-layout-reference.md`
- 行号基准：本会话实测源码（`globals.css` 现为 **1529 行**，旧文档写的 1370 已过期）
- 约束：主题 = 一份未分层 CSS，**不能加 DOM、不能跑 JS**。所以"新增元素"只有两条路：伪元素、或 `background/mask`。下表逐处标注伪元素是否已被占用。

---

## 0. 两条全局前提（先看）

1. **未分层 CSS 天然压过 Tailwind**（`theme-limits.md` §3.4）。本报告所有覆盖都不需要 `!important`，除非要压 `<html>` 内联变量。
2. **`:has()` 可用**：应用自己在 `globals.css:848`、`:883`、`:890`、`:909`、`:916`、`:1108-1112` 就在用 `:has()`，说明目标 WebView2 支持。

---

## 1. 三面板窗框

### 1.1 真实结构（`AppShellLayout.tsx:143-199`）

```
.vrcx-0-app-root.vrcx-0-custom-window-frame      router.tsx:202-209（custom-frame 仅 Windows 且非系统边框）
├ .vrcx-0-titlebar                              AppTitleBar.tsx:90-96
└ .vrcx-0-route-host                            router.tsx:216-219
  └ div.flex.h-full.flex-col                    AppShellLayout.tsx:144（无钩子）
    ├ div.flex.flex-1                           AppShellLayout.tsx:145（无钩子）
    │ └ .vrcx-0-sidebar-layout                  AppSidebar.tsx:166-183
    │   ├ [data-slot="sidebar"]                 sidebar.tsx:251-252   ← wrapper（hidden md:block，只有 gap 宽度）
    │   │ └ [data-slot="sidebar-container"]     sidebar.tsx:270      ← absolute（AppSidebar.tsx:190 把 fixed 覆盖成 absolute）
    │   │   └ [data-slot="sidebar-inner"]       sidebar.tsx:287-288  ← 真正的左栏面板（.vrcx-0-sidebar-surface）
    │   └ [data-slot="sidebar-inset"]           sidebar.tsx:355-368（.vrcx-0-sidebar-inset）
    │     └ .vrcx-0-main-shell                  AppShellLayout.tsx:147-150
    │       └ .vrcx-0-workspace                 AppShellLayout.tsx:151-157  ← 中区+右栏同一个圆角容器
    │         ├ .vrcx-0-main-content            AppShellLayout.tsx:158-166
    │         ├ [data-vrcx-0-resize="side-panel"]  AppShellLayout.tsx:170-174
    │         └ [data-vrcx-0-surface="side-panel"] SidePanel.tsx:382-389（aside，overflow-hidden）
    └ .vrcx-0-statusbar                         AppShellLayout.tsx:197
```

### 1.2 已有面板"框"长在哪（可直接改，不必加伪元素）

| 面板 | 宿主 | 现有框样式 |
| --- | --- | --- |
| 中+右 | `.vrcx-0-workspace` | `margin: var(--vrcx-0-main-content-gutter)` + `border-radius: var(--vrcx-0-main-content-radius)` + `box-shadow: inset 0 1px 0 var(--vrcx-0-main-content-highlight), 0 0 0 1px var(--vrcx-0-main-content-edge), var(--vrcx-0-main-content-lift)`（`globals.css:835-846`） |
| 外框 | `.vrcx-0-custom-window-frame` | `border-radius: 1rem; corner-shape: superellipse(2)` + 阴影（`globals.css:728-741`） |
| 中/右分隔 | `[data-vrcx-0-resize="side-panel"]::before` | 1px 竖线 `var(--vrcx-0-workspace-divider)`（`globals.css:869-881`） |
| 左/中分隔 | `.vrcx-0-main-content::after` | 2px 拖拽高亮（`globals.css:897-920`） |

相关变量（`globals.css:210-225`）：`--vrcx-0-main-content-gutter` / `-gutter-top` / `-gutter-bottom` / `-gutter-collapsed` / `--vrcx-0-main-content-radius` / `-edge` / `-highlight` / `-lift` / `--vrcx-0-workspace-divider`。表面变量在 `globals.css:160-167`。

### 1.3 可粘贴

```css
/* 外框：跨平台锚点（.vrcx-0-custom-window-frame 只在 Windows 自定义边框时存在，router.tsx:196-208） */
.vrcx-0-app-root { background: var(--vrcx-0-app-surface); }

/* 外框装饰：::after 已被应用占用（globals.css:755），用 ::before */
.vrcx-0-custom-window-frame::before {
  content: ''; position: absolute; inset: 0; z-index: 998;
  pointer-events: none; border-radius: inherit;
  box-shadow: inset 0 0 0 2px var(--jirai-frame);
}
/* 停靠/贴边时应用会撤掉圆角（globals.css:794-802），跟着撤 */
.vrcx-0-custom-window-frame:has([data-window-docked])::before { display: none; }

/* 左栏面板框：必须用 data-slot="sidebar-inner"，
   不要用 [data-vrcx-0-surface="sidebar"]（它在 wrapper 与 inner 上各挂一次：sidebar.tsx:252 与 :288） */
[data-slot="sidebar-inner"] {
  border-radius: 0.625rem;
  box-shadow: 0 0 0 1px var(--jirai-frame), inset 0 1px 0 rgb(255 255 255 / 30%);
}

/* 中+右框：覆盖变量最省事（保留应用的 margin/radius 机制） */
.vrcx-0-workspace {
  --vrcx-0-main-content-edge: var(--jirai-frame);
  --vrcx-0-main-content-highlight: rgb(255 255 255 / 35%);
  --vrcx-0-main-content-lift: 0 6px 18px -12px rgb(0 0 0 / 35%);
}

/* 右栏：面板级装饰（aside 无伪元素占用，overflow-hidden 会裁掉外扩装饰） */
[data-vrcx-0-surface="side-panel"] { position: relative; }
[data-vrcx-0-surface="side-panel"]::before {
  content: ''; position: absolute; inset: 0; z-index: 30;
  pointer-events: none; border-left: 1px solid var(--jirai-frame);
}

/* 分隔把手：::before 已被占用（globals.css:869），改用 ::after（空闲） */
[data-vrcx-0-resize='side-panel']::after {
  content: ''; position: absolute; inset-block: 0; inset-inline-start: 50%;
  width: 2px; transform: translateX(-50%); pointer-events: none;
  background: linear-gradient(var(--jirai-frame), transparent);
}
```

> 禁止：`.vrcx-0-main-content::before`（壁纸，`globals.css:922`）和 `::after`（拖拽高亮，`:897`）**两个都被占用**；中区要加框只能改 `background/border/box-shadow`。

---

## 2. 虚拟表格表头 hover

应用里有**两套表头**，都要覆盖才叫"虚拟表格表头 hover"。

### A. div-grid 虚拟表头（Feed / 好友日志 / 玩家管理）

- 容器 = `VirtualHistoryList.tsx:116-122` 的表头视口，class 字面量含 `bg-[var(--vrcx-0-table-header-surface)]`（该字符串原样出现在 DOM class 里）。
- 表头行 = `FeedVirtualListShell.tsx:94-99`（`grid h-[var(--vrcx-0-table-header-height)]` + inline `grid-template-columns`）；好友日志同构（`FriendLogVirtualList.tsx:106-119`）；玩家管理同构（`ModerationVirtualList.tsx:87-108`）。
- **单元格无任何 hover 类**（`FeedVirtualListShell.tsx:104-106`）。

```css
/* 行 hover（鼠标在某列上时整行亮） */
.vrcx-0-data-table > div[class*="--vrcx-0-table-header-surface"]
  > div[style*="grid-template-columns"]:has(> div:hover) {
  background: var(--jirai-table-head-hover, rgb(255 255 255 / 8%));
}
/* 只要单元格 hover（更保守，不依赖 :has 的行级联） */
.vrcx-0-data-table > div[class*="--vrcx-0-table-header-surface"]
  > div[style*="grid-template-columns"] > div:hover {
  background: var(--jirai-table-head-hover, rgb(255 255 255 / 8%));
}
```

### B. shadcn `<table>` 表头（`DataTableView` / 弹窗内表格）

- `thead` = `table.tsx:20-32`：`[data-slot="table-header"].vrcx-0-table-header`，已有背景 `var(--vrcx-0-table-header-surface)`（`globals.css:1077-1079`）。
- 表头行 `DataTableHeaderRow`（`DataTableView.tsx:339-346`）显式带 **`hover:bg-transparent`**（`dataTableStyles.ts:6-7`）→ 应用故意禁掉了表头 hover。主题未分层 CSS 可无条件压过它。
- 表头单元格 `th` = `table.tsx:70-81`（`data-slot="table-head"`），class 由 `dataTableStyles.ts:9-10` 给。
- 右侧固定操作列表头另有 `box-shadow: -1px 0 var(--vrcx-0-table-sticky-edge)`（`globals.css:1081-1084`）。

```css
/* 覆盖被禁掉的表头行 hover */
.vrcx-0-data-table thead[data-slot="table-header"] tr:hover {
  background: var(--jirai-table-head-hover, rgb(255 255 255 / 8%));
}
/* 或只亮单元格 */
.vrcx-0-data-table thead[data-slot="table-header"] [data-slot="table-head"]:hover {
  color: var(--vrcx-0-table-header-foreground);
  background: var(--jirai-table-head-hover, rgb(255 255 255 / 8%));
}
```

> 弹窗里的表格头部背景被重定义为 `var(--entity-dialog-ground)`（`globals.css:993-996`），主题改表头色请走变量而非硬编码，否则弹窗内外不一致。

---

## 3. Avatar 两套体系（最小补充，细节见 `avatar-icon-dom.md`）

| 体系 | 最窄选择器 | 圆角/裁切 | 伪元素 |
| --- | --- | --- | --- |
| shadcn `Avatar` | `[data-slot="avatar"]`（`avatar.tsx:14-22`）、`[data-slot="avatar-image"]`（`:28-35`）、`[data-slot="avatar-fallback"]`（`:44-50`） | Root 无 overflow，圆角在 Root + Image 两处 | **`::after` 已被占用**（1px 描边，`avatar.tsx:18`）→ 用 `::before` |
| 自定义 `UserStatusAvatar` | 外层 `span:has(> .user-status-indicator)`（`UserStatusAvatar.tsx:20-25`）；内层裁切框 `> span:not(.user-status-indicator)`（`:26`） | 外层 `overflow-visible`；内层 `overflow-hidden rounded-full border` | 外层 ::before/::after 都空闲；内层会被裁 |
| 弹窗大头像 | `[data-slot="dialog-content"] [data-slot="button"] > .size-full`（`UserDialogHeaderMedia.tsx:88-105`） | Button 自身 `overflow-hidden` | on Button ❌；on 外层 `div.size-16` ✅ |
| 好友列表裸图 | `.vrcx-0-data-table [data-slot="table-cell"] img.rounded-full`（`FriendListColumns.tsx:157-195`） | 无 wrapper | replaced element，**不能挂伪元素** |
| 状态点 | `.user-status-indicator` + `.online/.joinme/.askme/.busy/.offline`（`friendStatus.ts:13-31`） | 独立 span | — |

```css
[data-slot="avatar"],
[data-slot="avatar-image"] { border-radius: 0; }
[data-slot="avatar"]::after { border-radius: 0; border-color: var(--jirai-frame); border-width: 2px; }
.vrcx-0-side-panel span:has(> .user-status-indicator) > span:not(.user-status-indicator) { border-radius: 0; }
.vrcx-0-side-panel span:has(> .user-status-indicator) img { border-radius: 0; }
```

> 前提不变：`clip-path` 与 `border-radius` 取交集，改切角必须同时清掉圆角（旧文档 §2.3）。

---

## 4. 弹窗 banner / card / footer

### 基础弹窗（`dialog.tsx`）

| 部件 | 选择器 | 现状 |
| --- | --- | --- |
| 根 | `[data-slot="dialog-content"]`（`dialog.tsx:58-99`） | `overflow-hidden rounded-xl p-4 ring-1`，无伪元素占用 |
| 头 | `[data-slot="dialog-header"]`（`:102-110`） | `flex flex-col gap-2` |
| 标题 | `[data-slot="dialog-title"]`（`:141-152`） | `font-heading` ← chrome |
| 尾 | `[data-slot="dialog-footer"]`（`:112-139`） | `bg-muted/50 -mx-4 -mb-4 rounded-b-xl border-t p-4`，无伪元素占用 |

### 实体弹窗（用户 / 世界 / 模型 / 群组）

- 根：`[data-slot="dialog-content"].entity-dialog`（`DialogHost.tsx:87-98`），背景 `var(--entity-dialog-ground)`（`globals.css:368-381`）。
- 骨架：`EntityDialogScaffold`（`EntityDialogScaffold.tsx:40-51`）→ `EntityDialogTwoColumnLayout`（`:53-101`，rail + content）。
- **banner**：`UserDialogHeaderMedia` 的 `div.relative`（`UserDialogHeaderMedia.tsx:54`）> `[data-slot="button"].aspect-[4/3].overflow-hidden.rounded-lg`（`:55-65`）。
  它被包在 `EntityOverviewCard`（`EntityDialogScaffold.tsx:103-135`）里，而调用方把 Card 覆写成 **`relative isolate overflow-hidden`**（`UserDialogHeaderSection.tsx:676-681`）→ **banner 上挂外扩伪元素会被裁**；banner 装饰请用图片自身上层元素或 `background`。
- **card**：`[data-slot="card"]`（`card.tsx:5-21`，默认 `overflow-hidden`）、`[data-slot="card-header"]`（`:23-34`）、`[data-slot="card-title"]`（`:36-47`，`font-heading`）、`[data-slot="card-content"]`（`:72-80`）、`[data-slot="card-footer"]`（`:82-93`，`bg-muted/50 border-t rounded-b-xl`）。
- **footer**：实体弹窗**没有** `DialogFooter`；内容末尾是 `EntityDialogTabContent`（`EntityDialogScaffold.tsx:178-199`，`overflow-auto px-1 pt-4 pb-1`）。

```css
/* 弹窗根：圆角/描边/底色（用变量，别硬编码，否则 entity 弹窗的 ground 会被顶掉） */
[data-slot="dialog-content"] {
  --jirai-dialog-edge: var(--jirai-frame);
  box-shadow: inset 0 0 0 1px var(--jirai-dialog-edge), 0 24px 48px -28px rgb(0 0 0 / 45%);
}
/* banner：叠一层背景装饰（Button 自身 overflow-hidden） */
[data-slot="dialog-content"] [data-slot="button"][class*="aspect-[4/3]"] {
  background-image: linear-gradient(180deg, transparent 45%, rgb(255 255 255 / 18%));
}
/* card：默认 overflow-hidden；要外扩装饰时先放开（实体弹窗 header 自己又加了 overflow-hidden） */
[data-slot="card"] { --card-edge: var(--jirai-frame); }
[data-slot="card-title"] { color: var(--jirai-title); }
/* footer：基础弹窗通用 */
[data-slot="dialog-footer"] {
  background: color-mix(in oklab, var(--jirai-frame) 12%, var(--popover));
  border-top-color: var(--jirai-frame);
}
```

> owner 弹窗另有 `.owner-dialog::before` 被占用（`globals.css:1402`、`:1492`）→ 该场景用 `::after`。

---

## 5. 字体：chrome 与用户内容隔离（关键结论）

### 5.1 机制（已用构建产物验证）

| 位置 | 编译结果 | 谁受它影响 |
| --- | --- | --- |
| `.font-heading` | `font-family: var(--font-sans)` | 只影响带 `font-heading` 的 chrome 标题 |
| `html` | `font-family: var(--vrcx-app-font-family, "Geist Variable", sans-serif)` | — |
| `.font-sans` | `font-family: var(--vrcx-app-font-family, …)`（`@theme inline` 展开） | 显式写了 `font-sans` 的**用户内容** |
| `body` | `font-family: var(--vrcx-app-font-family, system-ui)`（`globals.css:562`） | **所有未显式设字体的文本 = 昵称/位置/世界名等用户内容** |

证据：`globals.css:452-453`、`:560-568`；`themeService.ts:402-405`、`:429-432`（`--vrcx-app-font-family` 写在 `<html>` 内联样式上）；`dist/assets/index-Cckb3vVG.css` 里 `.font-heading{font-family:var(--font-sans)}` / `html{font-family:var(--vrcx-app-font-family,…)}` / `.font-sans{font-family:var(--vrcx-app-font-family,…)}`。
用户内容显式带 `font-sans` 的实例（一手证据）：`UserDialogInfoTab.tsx:292-306`（`TextScroll`）与 `:308-327`（`AdaptiveTextBlock`）—— 备注 / 备忘录 / 简介等长文本统一走 `<pre class="… font-sans text-xs whitespace-pre-wrap">`（`:301`、`:322`），即**经 `--vrcx-app-font-family` 取用户设置字体**。

### 5.2 结论（直接决定实现方式）

- ✅ **只换 chrome 字体**：覆盖 `--font-sans`（等价于 `--font-heading`）。命中 16 处 `font-heading`：`PageScaffold.tsx:96`、`card.tsx:41`、`dialog.tsx:146`、`sheet.tsx:196`、`popover.tsx:67`、`alert-dialog.tsx:139`、`alert.tsx:42`、`empty.tsx:66`、`SettingsCard.tsx:63`、`GroupModerationPage.tsx:219`、`SettingsAdvancedTab.tsx:430`、`ProfileMediaPanel.tsx:159`、`ProfileBackupDialog.tsx:530,556`、`MediaLibraryToolbar.tsx:29`。
  用户内容（`font-sans` / 继承 body）**完全不受影响** → 这就是现成的隔离点。
- ❌ **不要**用 `html { --vrcx-app-font-family: … !important }`（`theme-limits.md` §5.3 的写法）：它会把昵称、简介、位置、世界描述等用户内容一起换掉，且主题字体缺 CJK 字形时用户内容会掉字形。
- ❌ **不要**给 `body` / `*` 设 `font-family`（同上，用户内容直接继承 body）。
- 若还要给非标题 chrome（表头、导航、按钮、弹窗 tab、状态栏）加字体，只能**白名单逐个写**，因为用户内容没有任何统一钩子，无法用黑名单排除。

```css
/* ① 标题类 chrome：一处生效，用户内容零影响 */
:root { --font-sans: var(--jirai-font-chrome); }
:root { --font-heading: var(--jirai-font-chrome); }   /* 保险：有人直接引用 --font-heading */

/* ② 其它 chrome（白名单，全部无用户内容） */
.vrcx-0-titlebar,
.vrcx-0-statusbar,
[data-slot="table-head"],
.vrcx-0-table-header,
[data-slot="sidebar-menu-button"],
[data-slot="tabs-tab"],
[data-slot="dropdown-menu-item"],
[data-slot="button"] { font-family: var(--jirai-font-chrome); }

/* ③ 例外：等宽内容（JSON 查看器等）不要被带跑 */
.entity-json-view, .font-mono, [data-slot="kbd"] { font-family: var(--jirai-font-mono, ui-monospace, monospace); }
```

> 用户内容示例（**保持继承，不要碰**）：`displayName`（`FriendListColumns.tsx:196-230`）、备注/备忘录/简介（`UserDialogInfoTab.tsx:301,322`）、位置/签名（`UserDetailTile.tsx:29-55`）。它们没有专属 class —— 这正是必须用白名单而不是黑名单的原因。

---

## 6. sidepanel 真实虚拟列表的空白装饰

### 6.1 真实 DOM

好友侧栏虚拟列表（`FriendsSidebar.tsx:817-850`）：

```html
<div class="relative h-full overflow-auto overflow-x-hidden">   <!-- :819-822 滚动视口（无 data 钩子） -->
  <div class="px-1.5 pt-1 pb-2.5">                              <!-- :823 -->
    <div class="relative w-full" style="height: <totalSize>px">  <!-- :824-826 内容高度=行高之和 -->
      <div class="absolute top-0 left-0 w-full" style="transform: translateY(..)">…行…</div>
```

- 同构视口：`GroupsSidebar.tsx:749`、`WorldRoomsSidebar.tsx:385`（同一套 class）；`TrackedNonfriendsSidebar.tsx:99` 是 `min-h-0 flex-1 overflow-y-auto`。
- 列表**不满一屏时，视口底部就是"裸空白"**（行高总和 < 视口高），没有专用元素 ⇒ 想要装饰只能用视口自身的 `background`，或挂在视口/面板上的伪元素。
- 视口自带 `position: relative`（`:819`）⇒ 伪元素可绝对定位；视口类名 `overflow-auto` + `overflow-x-hidden` 在面板作用域内唯一（`grep` 侧栏目录仅这 3 处）。

### 6.2 推荐（无伪元素、不碰层叠上下文）

```css
/* 侧栏 3 个 tab 的虚拟列表视口 */
[data-vrcx-0-surface="side-panel"] [class~="overflow-x-hidden"][class~="overflow-auto"] {
  background-image: url("data:image/svg+xml,…");   /* 只能用 data: / https:，见 theme-limits §3.1 */
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: min(12rem, 80%) auto;
  background-attachment: local;                    /* 附着"内容底部"：列表短→显示在末行下方；列表长→滚到底才出现 */
  opacity: 1;
}
/* 未填满时给空白一点底色（同样只作用于视口） */
[data-vrcx-0-surface="side-panel"] [class~="overflow-x-hidden"][class~="overflow-auto"] {
  background-color: transparent;
}
```

要点：
- 视口自身**没有背景**（面板背景只在侧栏窗口模式才设置，`globals.css:967-969`），所以视口背景会叠在祖先 `.vrcx-0-sidebar-surface` 之上 ✅。
- 侧栏行是**透明背景**（hover 才有）⇒ 若用 `background-attachment: scroll` + `center`，装饰会透到每一行文字后面。`local` + `bottom` 把装饰钉在内容末尾的空白区，规避这个问题。
- 若坚持用伪元素，必须处理层叠（宿主无层叠上下文时 `z-index:-1` 会掉到 `.vrcx-0-workspace` 背景**之下**被遮住）：

```css
[data-vrcx-0-surface="side-panel"] { position: relative; isolation: isolate; }
[data-vrcx-0-surface="side-panel"]::before {
  content: ''; position: absolute; inset-inline: 0; bottom: 0; height: 6rem;
  z-index: -1; pointer-events: none;
  background: url("data:image/svg+xml,…") bottom center / contain no-repeat;
  mask-image: linear-gradient(to top, #000 40%, transparent);
}
```

> 另一类"空白"是 `VirtualHistoryList.tsx:184-191` 的**完全空态**（`h-full min-h-24 flex items-center justify-center`，出现在 Feed / 好友日志 / 玩家管理）。它的选择器：`.vrcx-0-data-table > div[class*="overflow-auto"] > div:only-child`；装饰/样式改这里即可。

---

## 7. 伪元素占用总表（不可加假 DOM 的前提）

| 宿主 | `::before` | `::after` | 证据 |
| --- | --- | --- | --- |
| `.vrcx-0-app-root` | **占用**（壁纸） | 空闲 | `globals.css:804` |
| `.vrcx-0-custom-window-frame` | 空闲 | **占用**（内描边） | `globals.css:755` |
| `.vrcx-0-main-content` | **占用**（壁纸） | **占用**（拖拽高亮） | `globals.css:922` / `:897` |
| `.vrcx-0-workspace` | 空闲 | 空闲 | — |
| `[data-vrcx-0-resize="side-panel"]` | **占用**（分隔线） | 空闲 | `globals.css:869` |
| `[data-vrcx-0-resize="nav"]` | 空闲 | 空闲 | — |
| `[data-slot="sidebar-container"／"sidebar-inner"／"sidebar-inset"]` | 空闲 | 空闲 | — |
| `[data-vrcx-0-surface="side-panel"]` | 空闲 | 空闲 | — |
| `.vrcx-0-titlebar` | 空闲 | RGB 模式下**占用** | `vrcx-0-rgb.css:105` |
| `.vrcx-0-statusbar` | 空闲 | RGB 模式下**占用** | `vrcx-0-rgb.css:112` |
| `[data-slot="table-head"]`、`thead[data-slot="table-header"]` | 空闲 | 空闲 | — |
| `[data-slot="dialog-content"]` | 空闲* | 空闲* | *`.owner-dialog::before` 占用 `globals.css:1402` |
| `[data-slot="card"]` | 空闲 | 空闲 | 注意默认 `overflow-hidden`（`card.tsx:15`） |
| `[data-slot="dialog-footer"]` | 空闲 | 空闲 | — |
| `[data-slot="avatar"]` | 空闲 | **占用**（1px 描边） | `avatar.tsx:18` |
| `[data-slot="dropdown-menu-content"]` 等浮层 | **占用**（blur 层） | 空闲 | `dropdown-menu.tsx:61`；`globals.css:1210-1216` |
| `.feed-column-row-new` | 空闲 | **占用**（新行高亮） | `globals.css:1242` |
| `[data-slot="button"].vrcx-0-column-resize` | 空闲 | **占用**（列宽手柄） | `globals.css:1021` |
| `.entity-json-view-collapse/expand/collapsed` | 空闲 | **占用**（▾/▸） | `globals.css:626-647` |

"不可加假 DOM"的实操含义：
1. 不能注入任何元素/JS ⇒ 装饰只能用伪元素或 `background/mask`（`theme-limits.md` §3.1/§3.2）。
2. 伪元素受 `overflow:hidden` 裁剪（`.vrcx-0-main-content` 无 overflow；`aside.vrcx-0-side-panel`、`[data-slot="card"]`、弹窗头卡片有）。
3. replaced element（`<img>`）上伪元素不可靠 ⇒ 好友列表头像只能用 `border-radius/filter`。
4. 伪元素默认画在真实子元素**之后**（`::after` 最后）⇒ 想垫在内容下面要 `z-index:-1` + 宿主 `isolation: isolate`（见 §6.2）。

---

## 8. 未确认 / 需要实测

1. `:has()` 行级 hover（§2A）与 `background-attachment: local`（§6.2）在本机没有 WebView2 实测；`:has()` 有应用自身先例，`local` 属规范行为。
2. `dist/` 构建时间早于部分源码（`theme-limits.md` §5.2 已注明），本报告字体编译结论依赖 `@theme inline` 语义，不随小改动变化。
3. `useRender` 渲染的 `[data-slot="sidebar-menu-button"]` 由 state 映射而来（`sidebar.tsx:560-593`），属性形式按 base-ui 约定，未在运行的应用中抓取真实 DOM 确认。
4. RGB 模式下 `titlebar::after` / `statusbar::after` 的占用只在 `html.vrcx-0-rgb` 生效（`vrcx-0-rgb.css:105,112`）；用户开启 RGB 效果时主题用 `::after` 会冲突，故上表按"已占用"处理。
