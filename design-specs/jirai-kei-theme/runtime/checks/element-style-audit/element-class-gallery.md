# 元素 HTML Gallery｜静态审阅夹具

> **用途：**把当前主题审计中的元素种类与上下文结构摆在一处，方便人工逐项审阅、比对和监控。
>
> **重要：下面每个 HTML 都是静态 / synthetic fixture，不是正在运行的 VRCX 页面，也不对应某个真实 route。**外壳与关键 `data-slot` / `data-variant` / class 来自实际组件源码和审计注册表；省略的应用状态、事件和部分 CVA/Tailwind 基础类不会由这段 HTML 自动补齐。请把它看作选择器检查夹具，不要把它当成线上 DOM 截图。
>
> 当前原语矩阵为 **14 个审计原语、14 个上下文、1,305 个源码使用点、0 个矩阵 gap**。这只说明已登记原语和夹具范围通过，不代表 6,175 个全源码静态样式候选或任何运行时 DOM 都已被逐个穷举。

## 怎么读与怎么更新

- 所有 14 个上下文名：`main-content`、`main-toolbar`、`graph-floating-controls`、`main-card-sm`、`side-panel`、`settings-vertical-tabs`、`entity-dialog`、`dialog`、`popover`、`menu-popup`、`login-page`、`privacy-lock`、`toast`、`app-chrome`。外壳定义见 [primitives.mjs:63–88](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L63-L88>)。
- 这里按「相同原语 + 上下文/状态」展示。审计 ID 对照：`native-range`→原生 Range，`base-slider`→Base UI Slider，`native-checkbox` / `base-checkbox`→两种 Checkbox，`switch`、`radio`、`input-textarea`、`select-trigger`、`button`、`badge`、`tabs-trigger`、`toggle-group-item`、`progress`、`kbd`。**Button 不会被压成统一外观**：保留 `variant`、`size` 和上下文差异；只有矩阵中计算样式相似的上下文才合并说明。
- 当前结果可看：[原语 × 上下文矩阵](table.current-compiled-all.md)、[矩阵 JSON](table.current-compiled-all.json)、[全元素静态重叠报告](all-elements-overlap.md)、[静态候选 JSON](all-elements-overlap.json)。按钮对比图：[button.current-compiled-button.png](shots/button.current-compiled-button.png)；可直接浏览的按钮 HTML 图库：[button-gallery.html](button-gallery.html)。
- 按钮图按真实调用点的 variant/size 签名去重：`main-content` 有 25 组，跨 14 个上下文总计 32 组签名；图中渲染 123 个上下文样本，编号 `B001`–`B123` 可直接搜索，details 中可展开 748 个真实源码站点；每个上下文框维持纵向排列，框内按钮桌面/平板三列、窄屏两列。
- 要更新按钮 HTML 样本，运行 [generate-button-gallery.mjs](generate-button-gallery.mjs)；要增加审计状态/上下文，先在 [primitives.mjs](primitives.mjs) 补充原语样例或 `CONTEXTS` 外壳，再用现有 [audit.mjs](audit.mjs) 重新生成矩阵。图库外链引用现有应用 CSS 与已构建主题 CSS；主题重建后刷新页面即可，但新增/改动调用点仍要重跑生成脚本。无需另起服务。

### 公共主内容外壳

以下主内容示例的共同祖先来自审计夹具。把对应小片段放进 `<!-- 被审阅元素 -->` 位置；它不是 app route 的复制品。

```html
<div data-vrcx-0-surface="app-root" class="vrcx-0-app-root flex min-h-0 w-full flex-col overflow-hidden h-screen">
  <div data-vrcx-0-surface="main-shell" class="vrcx-0-main-shell flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
    <div data-vrcx-0-surface="workspace" class="vrcx-0-workspace flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <div data-vrcx-0-surface="main-content" class="vrcx-0-main-content flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div class="vrcx-0-page-scaffold flex h-full min-h-0 min-w-0 flex-col overflow-hidden x-container x-container--auto-height p-4">
          <!-- 被审阅元素 -->
        </div>
      </div>
    </div>
  </div>
</div>
```

来源：[primitives.mjs:64–74](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L64-L74>)。

## Button / 按钮

按钮是上下文差异最多的原语之一：矩阵记录 **748 个调用点**；规范参照 `main-content` 有 25 组 variant/size 签名，跨 14 个上下文合计 32 组。同一个 `data-slot="button"` 会因用途使用 `outline`、`ghost`、`destructive`、`link` 等 variant 和不同尺寸；主题还对工具栏、卡片、弹窗、登录和应用 chrome 留有上下文规则。不要把这些都归一成一种按钮。

| 上下文 | 使用点 | 相对 main-content 的计算形状差异 | 真实源码锚点 |
|---|---:|---|---|
| `main-content` | 242 | 规范参照；25 组 variant/size 签名 | [app/router.tsx:43](</home/fulutang/Documents/Github/VRCX-0-jirai/src/app/router.tsx#L43>) |
| `main-toolbar` | 13 | 圆角 | [FavoritesToolbar.tsx:209–219](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/favorites/components/FavoritesToolbar.tsx#L209-L219>) |
| `graph-floating-controls` | 4 | 圆角 | [MutualFriendsHud.tsx:74–100](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/charts/components/mutual-friends/MutualFriendsHud.tsx#L74-L100>) |
| `main-card-sm` | 2 | 圆角 | [ThemesPageParts.tsx:45–49,123–134](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/themes/components/ThemesPageParts.tsx#L45-L49>) |
| `side-panel` | 9 | 形状与参照相同；仍保留调用方 variant/size | [GroupsSidebar.tsx:127](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/sidebar/GroupsSidebar.tsx#L127>) |
| `settings-vertical-tabs` | 60 | box-shadow | [DeepLinkRegistrationField.tsx:81](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/settings/components/DeepLinkRegistrationField.tsx#L81>) |
| `entity-dialog` | 83 | 圆角 | [AvatarDialogTabbedView.tsx:226](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/AvatarDialogTabbedView.tsx#L226>) |
| `dialog` | 265 | 圆角 | [AboutDialog.tsx:268](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/about/AboutDialog.tsx#L268>) |
| `popover` | 24 | 圆角 | [DateRangeFilter.tsx:102](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/date-range-filter/DateRangeFilter.tsx#L102>) |
| `menu-popup` | 1 | 圆角 | [combobox.tsx:263](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/combobox.tsx#L263>) |
| `login-page` | 13 | 圆角、box-shadow | [LoginFormCard.tsx:58](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/auth/components/LoginFormCard.tsx#L58>) |
| `privacy-lock` | 5 | 圆角、box-shadow | [PrivacyLockOverlay.tsx:121](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/privacy-lock/PrivacyLockOverlay.tsx#L121>) |
| `app-chrome` | 27 | 圆角 | [AppTitleBar.tsx:37–59,90–96](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/layout/AppTitleBar.tsx#L37-L59>) |

#### main-content：正文默认/轮廓按钮

```html
<button type="button" data-slot="button" data-variant="outline" data-size="sm"
        class="group/button inline-flex h-7 items-center rounded-lg border border-border px-2.5">
  查看详情
</button>
```
来源：真实调用点 [app/router.tsx:43](</home/fulutang/Documents/Github/VRCX-0-jirai/src/app/router.tsx#L43>)；`Button` 实际生成 slot/variant/size 与基础 class 的源码：[button.tsx:6–39,43–55](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/button.tsx#L6-L39>)。HTML 的 class 是可读性裁短的夹具类，不是复制完整 CVA 输出。

#### main-toolbar：工具栏操作

```html
<div class="vrcx-0-page-toolbar flex shrink-0 flex-col gap-2">
  <button type="button" data-slot="button" data-variant="outline" data-size="sm"
          class="group/button inline-flex h-7 items-center rounded-lg border border-border px-2.5">
    编辑顺序
  </button>
</div>
```
来源：工具栏 wrapper [PageScaffold.tsx:62–75](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/layout/PageScaffold.tsx#L62-L75>)；真实按钮 [FavoritesToolbar.tsx:207–219](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/favorites/components/FavoritesToolbar.tsx#L207-L219>)；对应合成上下文 [primitives.mjs:73](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L73>)。

#### graph-floating-controls：悬浮图表控件

```html
<div class="bg-popover/70 ring-foreground/10 relative rounded-lg shadow-md ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 flex items-center gap-2 p-1.5">
  <button data-slot="button" data-variant="destructive" data-size="sm" class="group/button rounded-lg border">停止</button>
  <button data-slot="button" data-variant="default" data-size="sm" class="group/button rounded-lg border">开始</button>
</div>
```
来源：真实 wrapper [MutualFriendsSurface.tsx:5–22](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/charts/components/mutual-friends/MutualFriendsSurface.tsx#L5-L22>) 与真实按钮 [MutualFriendsHud.tsx:74–109](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/charts/components/mutual-friends/MutualFriendsHud.tsx#L74-L109>)；相同 wrapper selector 也见 [primitives.mjs:74](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L74>)。

#### main-card-sm：小卡片

```html
<article data-slot="card" data-size="sm" class="bg-card text-card-foreground flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm ring-1 ring-foreground/10">
  <button data-slot="button" data-variant="link" data-size="xs" class="group/button inline-flex h-6 items-center px-2 text-xs underline-offset-4">
    作者主页
  </button>
</article>
```
来源：真实 `Card size="sm"` [ThemesPageParts.tsx:45–50](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/themes/components/ThemesPageParts.tsx#L45-L50>) 与链接按钮 [ThemesPageParts.tsx:91–108](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/themes/components/ThemesPageParts.tsx#L91-L108>)；审计 wrapper selector [primitives.mjs:75](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L75>)。

#### dialog 与 entity-dialog：不同弹窗语境

```html
<!-- 普通 dialog：selector 明确排除 .entity-dialog -->
<div data-slot="dialog-content" class="bg-popover text-popover-foreground fixed z-50 grid gap-4 rounded-xl p-4 ring-1">
  <button data-slot="button" data-variant="outline" data-size="sm" class="group/button rounded-lg border">取消</button>
</div>

<!-- entity-dialog：独立的弹窗上下文标记 -->
<div data-slot="dialog-content" class="bg-popover text-popover-foreground fixed z-50 grid gap-4 rounded-xl p-4 ring-1 entity-dialog">
  <button data-slot="button" data-variant="ghost" data-size="default" class="group/button rounded-lg border">操作</button>
</div>
```
来源：两种 synthetic context wrapper/selector：[primitives.mjs:79–80](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L79-L80>)；真实调用示例分别见 [AboutDialog.tsx:268](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/about/AboutDialog.tsx#L268>)、[AvatarDialogTabbedView.tsx:226](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/AvatarDialogTabbedView.tsx#L226>)。外层合成容器不等同于真实 Dialog route DOM。

#### app-chrome：标题栏窗口控件

```html
<header data-app-titlebar="true" data-vrcx-0-surface="titlebar" class="vrcx-0-titlebar flex h-8 shrink-0 items-center">
  <button type="button" data-slot="button" data-variant="ghost" data-size="icon-sm"
          class="group/button h-full w-9 rounded-none border-0">
    <svg aria-hidden="true" width="16" height="16"></svg>
  </button>
</header>
```
来源：真实标题栏结构 [AppTitleBar.tsx:90–96](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/layout/AppTitleBar.tsx#L90-L96>)；窗口按钮 wrapper [AppTitleBar.tsx:33–59](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/layout/AppTitleBar.tsx#L33-L59>) 内使用 `TitleBarButton`，其实际渲染 `Button` [useTitleBarActions.tsx:71–101](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/layout/useTitleBarActions.tsx#L71-L101>)；审计上下文 selector [primitives.mjs:86](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L86>)。

同原语但其他上下文仍按各自用途保留：`side-panel`、`settings-vertical-tabs`、`popover`、`menu-popup`、`login-page`、`privacy-lock` 的调用点和形状差异见上表。矩阵中的 radius/box-shadow 变化只表示计算形状不同，不表示要把这些按钮改成相同外观。

## Badge / 徽章

Badge 与 Button 一样使用 variant；矩阵为 **102 个调用点、8 个有使用点的上下文**。`main-card-sm`、`entity-dialog`、`dialog`、`app-chrome` 的圆角指纹与 `main-content` 不同；同一上下文还会因为 `data-variant` 和调用方 `className` 呈现不同语义色。

#### 正文 / 列表 badge（同类应用点）

```html
<span data-slot="badge" data-variant="secondary" class="group/badge inline-flex h-5 w-fit items-center rounded-4xl border px-2 text-xs font-medium">
  已安装
</span>
```
来源：徽章 variant/slot [badge.tsx:7–27,30–49](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/badge.tsx#L7-L27>)；正文调用 [GroupCard.tsx:65](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/groups/GroupCard.tsx#L65>)。

#### main-card-sm / entity-dialog / app-chrome：同一个 Badge 原语的上下文轮廓

```html
<article data-slot="card" data-size="sm" class="bg-card flex flex-col rounded-xl">
  <span data-slot="badge" data-variant="default" class="group/badge inline-flex h-5 items-center rounded-sm border px-2 text-xs">当前</span>
</article>

<div data-slot="dialog-content" class="entity-dialog bg-popover">
  <span data-slot="badge" data-variant="outline" class="group/badge inline-flex h-5 items-center border px-2 text-xs">公开</span>
</div>
```
来源：card badge [ThemesPageParts.tsx:69–77](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/themes/components/ThemesPageParts.tsx#L69-L77>)；entity badge [AvatarDialogHeaderBadges.tsx:21](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/avatar-dialog/components/AvatarDialogHeaderBadges.tsx#L21>)；AppMenuBar badge [AppMenuBar.tsx:198](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/layout/AppMenuBar.tsx#L198>)。`entity-dialog` 外壳仍是 synthetic context fixture，非真实 route。

## Input / Textarea / 输入组

矩阵包含 **117 个调用点、11 个有使用点的上下文**。同一输入家族里有 `Input`、`Textarea`、`InputGroupInput`，也有颜色选择器、等宽文本字段等调用方变体；`login-page` 的输入指纹相对正文在圆角和 box-shadow 上不同。不是所有 `<input>` 都是同一种用途。

### 普通文本字段

```html
<input data-slot="input" type="text" placeholder="搜索…"
       class="border-input h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1">
```
来源：真实组件属性与基础 class [input.tsx:6–17](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/input.tsx#L6-L17>)；调用示例 [ProxySettingsEditor.tsx:75](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/proxy/ProxySettingsEditor.tsx#L75>)。

### Textarea 与等宽编辑字段

```html
<textarea data-slot="textarea" rows="3"
          class="border-input flex min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 resize-none font-mono text-xs"></textarea>
```
来源：真实 Textarea slot/base class [textarea.tsx:5–15](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/textarea.tsx#L5-L15>)；等宽调用示例 [GroupModerationLogsExportDialog.tsx:89](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/group-dialog/GroupModerationLogsExportDialog.tsx#L89>)。

### InputGroupInput：输入组内部控制件

```html
<div data-slot="input-group" role="group" class="group/input-group border-input relative flex h-8 w-full min-w-0 items-center rounded-lg border">
  <input data-slot="input-group-control" type="text" class="flex-1 rounded-none border-0 bg-transparent shadow-none">
  <div data-slot="input-group-addon" data-align="inline-end" role="group" class="text-muted-foreground flex items-center">
    <button data-slot="button" data-variant="ghost" data-size="icon-xs" aria-label="打开选项">⌄</button>
  </div>
</div>
```
来源：InputGroup/InputGroupAddon/InputGroupInput 定义 [input-group.tsx:11–22,46–65,117–147](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/input-group.tsx#L11-L22>)；app chrome 中的真实输入组调用 [ToolbarControls.tsx:105](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/layout/ToolbarControls.tsx#L105>)。这是合成片段，不包含真实工具栏状态。

### Color input 与 login-page

```html
<label class="flex shrink-0 items-center gap-1.5 text-xs font-medium">
  <span class="text-muted-foreground">Accent</span>
  <input data-slot="input" type="color" class="size-8 shrink-0 cursor-pointer p-0.5">
</label>

<div data-vrcx-0-surface="login-page" class="vrcx-0-main-shell relative flex min-h-full w-full flex-col overflow-y-auto p-6">
  <input data-slot="input" type="text" class="border-input h-8 w-full rounded-lg border">
</div>
```
来源：颜色控件真实调用 [UserDialogProfileBackgroundPicker.tsx:35–47](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/user-dialog/components/UserDialogProfileBackgroundPicker.tsx#L35-L47>)；login 字段 [LoginFormCard.tsx:82](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/auth/components/LoginFormCard.tsx#L82>)；login synthetic wrapper 定义 [primitives.mjs:83](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L83>)。颜色框和登录字段保留自己的类型/上下文，不能仅按 HTML tag 合并。

## Select / Combobox

审计记录 **96 个调用点、9 个有使用点的上下文**；签名包含 `SelectTrigger`、原生 `<select>`、`ComboboxInput` 与 `ComboboxTrigger`。`main-content` 同时存在四种签名，故这里刻意分开展示。

### SelectTrigger（default / sm）

```html
<button type="button" role="combobox" aria-expanded="false"
        data-slot="select-trigger" data-size="sm"
        class="border-input flex w-fit items-center justify-between rounded-lg border bg-transparent py-2 pl-2.5 pr-2 text-sm">
  <span data-slot="select-value" class="flex flex-1 text-left">最近活动</span>
  <svg class="text-muted-foreground pointer-events-none size-4" aria-hidden="true"></svg>
</button>
```
来源：真实 SelectTrigger/SelectValue 的 DOM 属性、size 和 class [select.tsx:21–56](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/select.tsx#L21-L56>)；表格分页调用 [DataTableView.tsx:499](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/data-table/DataTableView.tsx#L499>)。

### 原生 `<select>`（不同于 SelectTrigger）

```html
<select class="border-input bg-background h-10 rounded-md border px-3 text-sm outline-none">
  <option>按时间排序</option>
</select>
```
来源：真实原生 select 调用 [RelationshipTimelinePageImpl.tsx:148](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/charts/RelationshipTimelinePageImpl.tsx#L148>)。不要把它改写成 `data-slot="select-trigger"`：它是另一种被审计到的 tag。

### ComboboxInput：输入组 + 触发按钮

```html
<div data-slot="input-group" role="group" class="group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border">
  <input data-slot="input-group-control" type="text" role="combobox" aria-expanded="false" class="flex-1 rounded-none border-0 bg-transparent">
  <div data-slot="input-group-addon" data-align="inline-end" role="group">
    <button data-slot="combobox-trigger" type="button" aria-label="打开建议">⌄</button>
  </div>
</div>
```
来源：实际 ComboboxInput composition [combobox.tsx:52–84](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/combobox.tsx#L52-L84>)、输入组控制件 [input-group.tsx:117–130](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/input-group.tsx#L117-L130>)；菜单使用点 [PlayerListGroupSelector.tsx:182](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/player-list/components/PlayerListGroupSelector.tsx#L182>)。夹具只保留选择器依赖的结构，不代表打开中的真实弹层。

## Checkbox / Radio

### Base UI Checkbox（未选 / 已选）

```html
<button type="button" role="checkbox" aria-checked="false" data-slot="checkbox"
        class="peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input">
  <span data-slot="checkbox-indicator" class="grid place-content-center text-current"></span>
</button>

<button type="button" role="checkbox" aria-checked="true" data-slot="checkbox" data-checked
        class="peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-primary bg-primary text-primary-foreground">
  <span data-slot="checkbox-indicator" class="grid place-content-center text-current">✓</span>
</button>
```
来源：真实 Checkbox root/indicator slot 与状态样式 [checkbox.tsx:8–24](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/checkbox.tsx#L8-L24>)；调用样例 [AvatarOwnerEditDialogs.tsx:122](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/AvatarOwnerEditDialogs.tsx#L122>)。矩阵 `base-checkbox` 有 44 个使用点，分布于 main-content、entity-dialog、dialog、popover、login-page。

### 原生 checkbox：当前只有零使用点夹具

```html
<input type="checkbox" aria-label="原生 checkbox fixture">
```
来源：**synthetic audit fixture**（[primitives.mjs:122–128](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L122-L128>)）；当前扫描没有原生 `<input type="checkbox">` 使用点，不能把它描述成现有 route 控件。

### Radio：唯一真实调用在迁移 dialog

```html
<div role="radiogroup" class="grid gap-2">
  <label class="flex cursor-pointer items-start gap-3 rounded-md border p-3">
    <button type="button" role="radio" aria-checked="false"
            class="border-input mt-0.5 flex size-4 items-center justify-center rounded-full border">
      <span class="bg-primary-foreground size-1.5 rounded-full"></span>
    </button>
    <span>迁移资料</span>
  </label>
</div>
```
来源：Base UI Radio/RadioGroup 真实 JSX 与 class [DataDirMigrationDialog.tsx:207–230](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/hosts/system-dialogs/DataDirMigrationDialog.tsx#L207-L230>)。上述 `button[role=radio]` 是简化的静态夹具表示，不声称是 Base UI 的逐字运行时 DOM。

## Switch / 开关

矩阵为 **118 个调用点、7 个使用上下文**（main-content、main-toolbar、side-panel、settings-vertical-tabs、entity-dialog、dialog、popover）；当前 shape fingerprint 与 canonical 相同，但开启/关闭状态和调用方尺寸/缩放仍应保留。

```html
<button type="button" role="switch" aria-checked="false" data-slot="switch" data-size="default" data-unchecked
        class="peer group/switch relative inline-flex h-[18.4px] w-[32px] items-center rounded-full border border-transparent bg-input">
  <span data-slot="switch-thumb" class="pointer-events-none block size-4 rounded-full bg-background"></span>
</button>
<button type="button" role="switch" aria-checked="true" data-slot="switch" data-size="default" data-checked
        class="peer group/switch relative inline-flex h-[18.4px] w-[32px] items-center rounded-full border border-transparent bg-primary">
  <span data-slot="switch-thumb" class="pointer-events-none block size-4 rounded-full bg-background"></span>
</button>
```
来源：真实 switch/thumb slots、尺寸与状态 classes [switch.tsx:7–28](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/switch.tsx#L7-L28>)；settings 使用点 [LinuxRenderingSetting.tsx:69](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/settings/components/LinuxRenderingSetting.tsx#L69>)。两个状态块是同一 synthetic fixture 的状态样例，不是两个运行中的开关。

## Slider / Range

### Base UI Slider

```html
<div data-slot="slider" data-orientation="horizontal" class="data-horizontal:w-full">
  <div class="relative flex w-full items-center select-none">
    <div data-slot="slider-track" class="bg-muted relative grow overflow-hidden rounded-full data-horizontal:h-1 data-horizontal:w-full">
      <div data-slot="slider-range" class="bg-primary h-full" style="width:40%"></div>
    </div>
    <div data-slot="slider-thumb" class="border-ring relative block size-3 rounded-full border bg-white"></div>
  </div>
</div>
```
来源：真实 Slider root/control/track/range/thumb [slider.tsx:19–51](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/slider.tsx#L19-L51>)；正文使用 [CommitSlider.tsx:36](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/mutual-friends/CommitSlider.tsx#L36>)。矩阵共 6 个使用点：main-content、settings-vertical-tabs、dialog、popover；popover 的真实调用额外带 `w-40`（[InstanceActivitySettingsPopover.tsx:53](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/instance-history/components/InstanceActivitySettingsPopover.tsx#L53>)）。

### 原生 range：当前无 app 使用点

```html
<input type="range" min="0" max="100" step="1" value="35" aria-label="synthetic range fixture" class="accent-primary w-28">
```
来源：**synthetic audit fixture**（[primitives.mjs:100–106](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L100-L106>)）；当前 `native-range` siteCount 为 0。它与 Base UI `Slider` 是不同原语，夹具存在不等于 app 使用。

## TabsTrigger / 选项卡

矩阵有 **26 个使用点、6 个上下文**（main-content、side-panel、settings-vertical-tabs、entity-dialog、dialog、app-chrome）；当前形状 fingerprint 与 canonical 一致。实际 `TabsTrigger` 可因 active/inactive、horizontal/vertical orientation 和调用方 class 改变状态/排版，不能只凭同一 shape fingerprint 抹掉这些差别。

### 正文：active 与 inactive

```html
<div data-slot="tabs" data-orientation="horizontal" class="flex flex-col gap-2">
  <div data-slot="tabs-list" data-orientation="horizontal" data-size="default" class="text-muted-foreground relative z-0 flex w-fit items-center gap-x-0.5 rounded-lg p-0.5">
    <button type="button" role="tab" aria-selected="true" data-active data-slot="tabs-tab" data-size="default" data-orientation="horizontal" class="relative flex items-center justify-center rounded-md border border-transparent font-medium">
      概览
    </button>
    <button type="button" role="tab" aria-selected="false" data-slot="tabs-tab" data-size="default" data-orientation="horizontal" class="relative flex items-center justify-center rounded-md border border-transparent font-medium">
      详情
    </button>
  </div>
</div>
```
来源：真实 Tabs root/list/tab slots、data attributes 与基础 class [tabs.tsx:19–30,35–71,75–97](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/tabs.tsx#L19-L30>)；真实调用例 [CommunityThemesSection.tsx:77](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/themes/components/CommunityThemesSection.tsx#L77>)。

### settings-vertical-tabs：同原语、纵向列表

```html
<div class="vrcx-0-page-scaffold">
  <div data-slot="tabs" data-orientation="vertical" class="flex min-h-0 flex-1 gap-4">
    <div data-slot="tabs-list" data-orientation="vertical" class="data-[orientation=vertical]:flex-col h-fit w-44 shrink-0 gap-0.5">
      <button type="button" role="tab" aria-selected="true" data-active data-slot="tabs-tab" data-orientation="vertical" class="data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start justify-start gap-2.5 px-3 py-1.5">常规</button>
    </div>
  </div>
</div>
```
来源：synthetic vertical-tabs context [primitives.mjs:77–78](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L77-L78>)；真实 settings 页使用点 [SettingsPage.tsx:81](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/settings/SettingsPage.tsx#L81>)。这里只呈现审计上下文，不是设置页完整 DOM。

## Toggle / ToggleGroupItem

矩阵的 `toggle-group-item` 合计 **35 个调用点、7 个上下文**，其中 main-toolbar 和 popover 的相对 shape fingerprint 在圆角上不同；正文、settings、entity-dialog、dialog、app-chrome 与 canonical 相同。另有单独的 `<Toggle>` 调用也映射到此审计原语。pressed/unpressed 与 `variant="outline"` / `default` 仍要分别观察。

### ToggleGroupItem：未按下 / 按下

```html
<div data-slot="toggle-group" data-variant="outline" data-size="sm" data-orientation="horizontal" class="flex w-fit gap-0.5">
  <button type="button" data-slot="toggle" data-variant="outline" data-size="sm" aria-pressed="false" class="text-foreground relative inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-input">网格</button>
  <button type="button" data-slot="toggle" data-variant="outline" data-size="sm" aria-pressed="true" data-pressed class="text-foreground data-pressed:bg-input/64 relative inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-input">列表</button>
</div>
```
来源：真实 ToggleGroup/Item slot、variant 与尺寸传递 [toggle-group.tsx:22–55,58–76](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/toggle-group.tsx#L22-L55>)；Toggle 状态 classes [toggle.tsx:9–45](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/toggle.tsx#L9-L45>)；真实 main-toolbar 使用 [FavoritesToolbar.tsx:234–267](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/favorites/components/FavoritesToolbar.tsx#L234-L267>)。

### popover 与正文比较

```html
<div data-slot="popover-content" class="bg-popover text-popover-foreground z-50 flex w-72 flex-col gap-2.5 rounded-lg p-2.5 shadow-md ring-1">
  <div data-slot="toggle-group" data-variant="default" data-size="default" class="flex w-fit gap-0.5">
    <button type="button" data-slot="toggle" data-variant="default" data-size="default" aria-pressed="true" data-pressed class="relative inline-flex rounded-lg border border-transparent">在线</button>
  </div>
</div>
```
来源：synthetic popover wrapper [primitives.mjs:81](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L81>)；真实 popover 调用 [UserDialogHeaderBadges.tsx:468–483](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx#L468-L483>)。shape 差异仅记录为 radius property family；不要据此推断所有颜色/尺寸都相同。

## Progress / 进度条

矩阵有 **10 个使用点、2 个上下文**（main-content、dialog），均为 Base UI `<Progress>`，当前 shape fingerprint 与 canonical 一致。

```html
<div data-slot="progress" role="progressbar" aria-valuenow="40" class="flex flex-wrap gap-3">
  <div data-slot="progress-track" class="bg-muted relative flex h-1 w-full items-center overflow-x-hidden rounded-full">
    <div data-slot="progress-indicator" class="bg-primary h-full transition-[width] ease-out" style="width:40%"></div>
  </div>
</div>
```
来源：真实 Progress root/track/indicator slots [progress.tsx:5–53](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/progress.tsx#L5-L53>)；调用例 [IndeterminateProgress.tsx:11](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/IndeterminateProgress.tsx#L11>) 与 [GroupModerationBanImportDialog.tsx:233](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/group-dialog/GroupModerationBanImportDialog.tsx#L233>)。当前矩阵没有原生 `<progress>` app site；不要把此片段误读为原生标签。

## Kbd / 快捷键键帽

矩阵有 **2 个使用点**，分别在 main-content 与 menu-popup，shape fingerprint 与 canonical 一致。

```html
<div data-slot="dropdown-menu-content" class="bg-popover/70 text-popover-foreground z-50 flex min-w-32 flex-col rounded-lg p-1 shadow-md ring-1">
  <kbd data-slot="kbd" class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 font-sans text-xs font-medium">Ctrl</kbd>
  <kbd data-slot="kbd" class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 font-sans text-xs font-medium">K</kbd>
</div>
```
来源：真实 Kbd slot/base class [kbd.tsx:3–14](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/kbd.tsx#L3-L14>)；menu 真实调用 [FeedSearchBox.tsx:226](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/feed/components/FeedSearchBox.tsx#L226>)，正文调用 [KeyboardShortcut.tsx:65](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/keyboard/KeyboardShortcut.tsx#L65>)。外层菜单 fixture 来自 [primitives.mjs:82](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/element-style-audit/primitives.mjs#L82>)。

## 检查 / 人工监控说明

1. 先看 [table.current-compiled-all.md](table.current-compiled-all.md) 的 14 × 14 汇总，再点进 [table.current-compiled-all.json](table.current-compiled-all.json) 看各格的 `siteCount`、`sig`、`sites`、`parts` 和 `differsFromCanonical`。`native-checkbox` / `native-range` 的 0 是“本次扫描无 app 使用点”，不是漏做 HTML。
2. [all-elements-overlap.md](all-elements-overlap.md) 与 [all-elements-overlap.json](all-elements-overlap.json) 是静态 JSX/selector 候选报告；没有直接 selector 命中不自动等于视觉未覆盖，也不是运行时取 DOM 的结果。
3. 本目录 [`shots/`](shots/) 下各原语 PNG 是审计夹具渲染，可与矩阵配合看；它们不是正在运行的 VRCX route 截图。要刷新本审计输出，可在此目录用现有脚本重跑（不会启动服务）：

   ```bash
   AUDIT_SRC=/home/fulutang/Documents/Github/VRCX-0-jirai/src \
   AUDIT_APP_DIST=/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets \
   JIRAI_OUT=/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme \
   node audit.mjs --tag gallery-review --no-shots
   ```

4. 新增元素时，先从真实 app JSX 找其 DOM/slot/variant/class 和 `file:line`；再给对应 `PRIMS` 增加样例；若确有新的外壳语境，再登记一个 `CONTEXTS` 包装并重跑。夹具不是 route，只有真实源码确认过的属性才写成“真实”；无法确认的 HTML 明确标 `synthetic audit fixture`。
5. 当前 **0 gaps** 的边界是此文件登记的 14 个原语 × 14 个上下文，不代表所有 JSX 标签、运行时态或动态 class 组合均已穷尽。报告中还有大量非原语 JSX 候选，不能把“覆盖率 100%”外推到全 app。
