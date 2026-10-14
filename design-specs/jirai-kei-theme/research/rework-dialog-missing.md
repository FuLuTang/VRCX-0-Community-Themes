# 实体弹窗装饰缺失 · 独立核查（runtime vs mockup）

- 只读核查：主应用 `/home/fulutang/Documents/Github/VRCX-0-jirai`（未 git / 未构建 / 未修改；Windows 未连接，无实机复测）。
- 行号基准：本会话读到的源码当前版本。主应用路径省略为 `app:`，本设计仓为 `design:`。
- 结论分级：**可还原**（真实结构存在且无冲突）/ **应移位**（结构存在但挂载点选错）/ **必须取消**（无效或有害）。

---

## 1. 真实弹窗骨架（与模拟稿不一致，属结构性差异）

```
[data-slot=dialog-content].entity-dialog        app:components/hosts/DialogHost.tsx:89-98（overflow-hidden、max-h-90vh）
└ DialogHeader.sr-only > DialogTitle            DialogHost.tsx:106-112  ← 弹窗没有可见标题栏
└ .vrcx-0-page…/EntityDialogScaffold(gap-3)     app:components/dialogs/UserDialogTabbedView.tsx:736
  └ EntityDialogTwoColumnLayout                 UserDialogTabbedView.tsx:737-778
    ├ rail = UserDialogHeaderSection            :739-742   ← 左「资料卡」（整张 Card）
    │  └ Card > CardHeader > 横幅(4/3) + 头像    UserDialogHeaderSection.tsx:676-698
    └ UserDialogTabsSection                     :773-776   ← 右「信息区」= tabs + InfoTab
       └ UserDialogInfoTab                       UserDialogInfoTab.tsx:1131-1189
          └ grid xl:grid-cols-[minmax(0,1fr)_18rem]          :1133  ← 左列 3 卡 + 右列 3 卡
```

- 两列断点：`min-[880px]:grid-cols-[var(--entity-dialog-rail-width)_minmax(0,1fr)]`，rail 宽 `20rem`、rail `overflow-auto`（`app:components/dialogs/EntityDialogScaffold.tsx:56,76-90`）。
- 左卡用 `EntityOverviewCard`：`Card size="sm"` + `overflow-visible`（覆盖 `card.tsx:15` 的 `overflow-hidden`），`CardHeader` 里**只有横幅**（`EntityDialogScaffold.tsx:117-127`）。
- 横幅实为 `<div.relative> > <Button data-slot="button" aspect-[4/3] w-full overflow-hidden rounded-lg border p-0>`（`app:components/dialogs/user-dialog/components/UserDialogHeaderMedia.tsx:53-86`），**不是整宽 banner**；其内图片层是 `<span class="relative size-full">`（:67-82）。
- 弹窗内头像 = `div.absolute.bottom-3.left-3.z-30.size-16 > Button.rounded-full`（`UserDialogHeaderMedia.tsx:87-105`）——**不是** `[data-slot="avatar"]`。
- 右侧信息卡 `InfoPanel`：`Card size="sm"`，**没有** `overflow-visible` → 继承 `overflow-hidden`（`UserDialogInfoTab.tsx:173-192` + `card.tsx:15`）；卡头 = `CardHeader.border-b.pb-3 > CardTitle.text-sm.truncate`（:180-185）。
- 模拟稿是 `.udlg > .wt(标题栏) → .banner(整宽 150px，含 lace/knot) → .uhead(84px 大头像) → .tabs → .ucards(三列) → .foot`（`design:mockups/windose-dark/index.html:97-135`；`.udlg .banner{height:150px}`、`.ucards{grid-template-columns:repeat(3,1fr)}` 见 `layout.css:122-124`）。
- ⇒ 「横向 banner + 下方三列卡」**无法用 CSS 还原**：真实 DOM 的 banner 在左栏卡内、信息区在另一列。模拟稿的标题栏与 `.foot` 在真实结构里也不存在（标题是 `sr-only`）。这属于组件层差异，主题（纯 CSS）无解。

## 2. `runtime/windose-runtime.css` 逐条判定

有效（选择器/变量都能落地）：

| 行 | 内容 | 依据 |
| --- | --- | --- |
| 7-14 | 字体（titlebar/statusbar/table-header/sidebar-menu-button/sidebar-group-label） | `data-slot="sidebar-menu-button"` 来自 Base UI `useRender` 的 `state.slot`（`app:ui/shadcn/sidebar.tsx:592`，`sidebar-group-label` :472）；同机制已在 `design:themes/aurora-theme/theme.css:171` 使用 |
| 15-20 | 面板底色 | `.vrcx-0-app-root`（`app:app/router.tsx:205`）等类名真实；未分层主题压过 `@layer components`（`app:src/styles/globals.css:596-705`） |
| 29-35 | 三面纹理 | `--wd-bg-bunny/cloud/stars` 在构建产物里有定义（`preview-package/.../theme.css:89`），且用法均带显式 `background-size`（旧包 :649-654） |
| 55-58 | 侧栏/表格头像像素刀口 | `span:has(>span[class~="size-3.75"])` 成立：`UserStatusAvatar` 外层 span + 内层 `span.overflow-hidden` + `UserStatusDot` 的 `size-3.75`（`app:components/UserStatusAvatar.tsx:17-56`，dot className :49） |
| 36-38 | 卡片 2px 直角、卡头点线 | `[data-slot="card-header"]` 真实（`card.tsx:26`）；globals.css 无既有 `card-header` 规则（无冲突） |
| 40-49, 68, 71-82 | 弹窗描边/overlay/焦点环/状态栏蕾丝/原生控件图标 | 变量均在本仓构建脚本注入（`design:runtime/build-runtime.mjs:18-39`） |

无效或落空：

- **11 行 `[data-slot="tabs-trigger"]` 不存在**：`TabsTrigger` 只是 `TabsTab` 的导出别名（`app:ui/shadcn/tabs.tsx:113-118`），实际属性是 `data-slot="tabs-tab"`（:94），激活态是 `data-active`（:88）而**非** `data-state="active"`。⇒ 11 行的字体、49 行 `[data-slot="tabs-trigger"][data-state="active"]` 高亮**全部不生效**（对照正确写法：`design:themes/jirai-kei-theme/theme.css` 的 `[data-slot="tabs-tab"][data-active]`）。
- **10 行 `[data-slot="dialog-title"]` 视觉无效**：实体的 `DialogHeader` 是 `className="sr-only"`（`DialogHost.tsx:106`），标题不渲染可见像素。
- **50-54 行头像刀口挂错**：`[data-slot="avatar"]::after` 确实是真实伪元素（`app:ui/shadcn/avatar.tsx:20` 的 `after:border-border after:absolute after:inset-0`），但弹窗头像用的是普通圆形 `Button`（见 §1），所以弹窗内看不到像素头像。
- **76-80 行 JSON 折叠图标**：类名来自 `EntityDialogScaffold.tsx:376-394`（`collapseIcon` 等槽位），但 `react-json-view-lite` 把该类挂在哪个节点（是否落在可加 `::after` 的 span 上）本会话**未验证**——属未证实项，勿当运行时事实。
- **30 行 `--wd-bg-ribbon-charm` 在当前预览产物里不存在**：`grep --wd-bg-` 于 `design:runtime/preview-package/jirai-kei-theme/theme.css` 只得到 `--wd-bg-bunny/cloud/heart/stars`。⇒ 预览包是**旧构建**（`build-runtime.mjs:39` 才注入 charm）。在旧包上写依赖该变量的规则会静默失效（`background-image:none`）。

占高/越权风险：

- **22-26 行**与 **66-67 行**是 `content:"…"; display:block` 的**流内**伪元素（分别插在 `[data-slot="sidebar-inner"]`（`sidebar.tsx:287`）与 `.vrcx-0-side-panel`（`app:components/sidebar/SidePanel.tsx:389`）顶部），各占 24px 并挤压其中的列表高度 → 与「虚拟列表不得增伪元素占高度」冲突。
- **60-65 行**同理（`display:block; margin-bottom:10px`，宿主 `PageScaffold.tsx:48-50`）。旧构建里同一规则还带着 s3 底纹（`preview-package/.../theme.css:682`）。
- **71 行** `select:not([multiple]):not([size])` 会一并命中简介历史下拉（`UserDialogInfoTab.tsx:749-757`）——视觉改变，交互保留。

## 3. card-header 白色块纹遮字：根因与安全边缘

- 素材：`design:original-assets/src/s3-stitch-8x4.svg` = `<svg viewBox="0 0 8 4">`，**没有 width/height**（也无内联尺寸），填充 `#ead9e2`（近白）。
- 无固有尺寸的图片用在 CSS 背景且 `background-size` 缺省（`auto`）时，按规则退化为**背景定位区域尺寸** → 8×4 的缝线被拉成一整块浅色矩形铺满卡头，压住标题文字。
- 旧构建正是这句话：`design:runtime/preview-package/jirai-kei-theme/theme.css:656`
  `[data-slot="card-header"] { background-image:var(--jk-bg-dark-s3); background-repeat:repeat-x; background-position:left bottom; }`（**没有** `background-size`）。
- 当前源已在 `design:runtime/windose-runtime.css:38` 改为 `background-image:none`（:64 的 page-scaffold 也已去掉）。⇒ 实机若仍见白块，是**加载了未重建的预览产物**（另有证据：该产物缺 `--wd-bg-ribbon-charm`），需重建 `runtime/preview-package/` 后刷新。
- 安全边缘：`CardHeader` 底部在 `pb-3`（12px）内是无文字区，装饰只要 ≤4px 高并显式定尺寸就压不到 `CardTitle`。最窄、语义明确的落点（只命中带标题的弹窗卡片头，天然排除横幅卡）：

```css
/* 8×4 素材必须显式背景尺寸，否则又会铺满 */
[data-slot="dialog-content"] [data-slot="card-header"]:has(> [data-slot="card-title"]) {
  background-image: var(--jk-bg-dark-s3);
  background-repeat: repeat-x;
  background-position: left bottom;
  background-size: 8px 4px;   /* 关键：无固有尺寸 SVG */
}
```

## 4. mockup 四份 CSS → 可还原 / 应移位 / 必须取消

**可还原（有真实宿主、宿主伪元素空闲）**

1. 横幅下缘波瓣蕾丝（`reuse.css:38-41` 的 s2 fan-lace）+ 两侧系带（`reuse.css:42-47` 的 s4 lacing + s5 knot）→ 挂横幅 `Button` 的伪元素。`button.tsx` 无伪元素占用（`app:ui/shadcn/button.tsx:44-58`）；横幅自身 `overflow-hidden`，装饰必须留在其内部；`::after` 在树序上位于图片 `span` 之后，会绘制在用户图上，需 `pointer-events:none`（若某个子元素将来带 z-index，请给装饰 `z-index:1`）。
2. 卡头底部 stitch 边（`finish.css:33-35` 的 `.ucard .ct` 思路）→ 见 §3 最窄选择器。
3. 中区星野 / 右栏云朵 / 左栏缎带结（`extras.css:5-11,55-56`、`rich.css:5-9`）→ 现有的 `background-image` 三处（runtime 29-35）已是对应实现。
4. 状态栏蕾丝（`reuse.css:19-23` 的 s1-s）→ runtime 68 行已用，且显式 `background-size:16px 8px`（**正确范例**：凡是本仓无尺寸 SVG 都必须显式 size）。
5. 滚动条像素心脏（`rich.css:30-34`）、选区/焦点虚线（`rich.css:36-38`）→ 对应 runtime 47-48、82 行，宿主均为通用元素，可保留。

**应移位**

- **宝石心（`finish.css:29-32` 的 `.win > .wt::before`）**：真实弹窗**没有可见标题栏**（§1），该宿主不存在。建议移到 tabs 行（`[data-slot="tabs-list"]` 真实存在，`EntityDialogScaffold.tsx:159-161` 带 `relative`），用绝对定位贴在下边框上（不占流、不压字）；**不要**放到横幅图上（会遮用户图）也不要放到 `[data-slot="dialog-title"]`（`sr-only`，永不显示）。
- **弹窗头像像素刀口**（runtime 50-54）：移动到 `[data-slot="card-header"] div.absolute.bottom-3.left-3 [data-slot="button"]`（该 Button 已是 `rounded-full`；`hasIconFrame` 时 `border-0`，见 `UserDialogHeaderMedia.tsx:94-97`），或干脆不改用户头像。
- **START / SOCIAL / VRCX-0 三条文字条**（runtime 22-26、60-67）：从 `display:block` 伪元素移位为 `background-image` 或绝对定位，避免挤压列表高度。

**必须取消**

- s3 铺满 `card-header`（旧构建 `theme.css:656`）及任何缺 `background-size` 的无尺寸 SVG 背景。
- 在虚拟列表容器/行上加流内伪元素（22-26、60-67 现状即此类）。
- 用 CSS 复刻「整宽 banner + 三列卡」的模拟稿布局（需改组件，超出主题权限）。
- 依赖 `--wd-bg-ribbon-charm` 却在旧预览包上验证。

## 5. 弹窗装饰可直接用的最窄方案（选择器均已对着源码核过）

```css
/* ① 横幅：下缘波瓣蕾丝 + 两侧系带列，全部留在 Button 内部，不占流 */
[data-slot="dialog-content"] [data-slot="card-header"] > div.relative > [data-slot="button"]:first-child {
  position: relative;              /* 已是 button，仅确保定位上下文 */
}
[data-slot="dialog-content"] [data-slot="card-header"] > div.relative > [data-slot="button"]:first-child::after {
  content: ""; position: absolute; inset: auto 0 0 0; height: 12px;
  pointer-events: none; background-color: var(--wd-title-active); opacity: .9;
  -webkit-mask: var(--jk-mask-s2) repeat-x 0 0 / 20px 12px;
          mask: var(--jk-mask-s2) repeat-x 0 0 / 20px 12px;
}
[data-slot="dialog-content"] [data-slot="card-header"] > div.relative > [data-slot="button"]:first-child::before {
  content: ""; position: absolute; inset: 10px 20px 18px; pointer-events: none;
  background-color: var(--wd-square); opacity: .85;
  -webkit-mask-image: var(--jk-mask-s4), var(--jk-mask-s4);
          mask-image: var(--jk-mask-s4), var(--jk-mask-s4);
  -webkit-mask-position: left top, right top;
          mask-position: left top, right top;
  -webkit-mask-size: 16px 16px, 16px 16px;
          mask-size: 16px 16px, 16px 16px;
  -webkit-mask-repeat: repeat-y, repeat-y;
          mask-repeat: repeat-y, repeat-y;
}
/* ② 卡头缝线：只命中带标题的弹窗卡片头（排除横幅卡），贴在 pb-3 空白带内 */
[data-slot="dialog-content"] [data-slot="card-header"]:has(> [data-slot="card-title"]) {
  background-image: var(--jk-bg-dark-s3); background-repeat: repeat-x;
  background-position: left bottom; background-size: 8px 4px;
}
/* ③ 宝石心：挂在 tabs 行的下边框上，绝对定位不占流、不压字 */
[data-slot="dialog-content"] [data-slot="tabs-list"] { position: relative; }
[data-slot="dialog-content"] [data-slot="tabs-list"]::before {
  content: ""; position: absolute; left: -2px; bottom: -9px; width: 16px; height: 16px;
  pointer-events: none; background-color: var(--wd-square);
  -webkit-mask: var(--jk-mask-s16) center/16px 16px no-repeat;
          mask: var(--jk-mask-s16) center/16px 16px no-repeat;
}
```

边界与前提：

- ① 的 `:first-child` 依赖 `CardHeader` 只含一个 `div.relative`，且横幅 `Button` 是该 div 的第 1 个子元素（`UserDialogHeaderMedia.tsx:54-86`）；头像 `div.absolute` 是第 2 个（:87），不会误命中。`InfoPanel` 的卡头没有 `div.relative`，天然排除。
- ② 依赖 `:has()`（应用自身已在用，`globals.css:848` 等）。
- ③ 的 `[data-slot="tabs-list"]` 由 `TabsList` 渲染（`tabs.tsx:46-57`），本会话未见伪元素占用；若 Tailwind 层另有 `::before`，改挂 `[data-slot="tabs-list"] > [data-slot="tab-indicator"]` 的兄弟位置或退到 ② 的卡头右上角。
- 所有装饰统一纪律：**只用 `background-image`/`mask`/绝对定位伪元素 + `pointer-events:none`**；绝不给滚动或虚拟列表容器加 `display:block` 伪元素。
- 弹窗外壳是 `overflow-hidden`（`DialogHost.tsx:93-95`），② ③ 必须留在内部。

## 6. 未验证 / 未证实（勿当运行时事实）

1. 无实机（Windows 未连接）：以上均为源码 + 构建产物静态核查，**没有**浏览器渲染结果；① 中「`::after` 绘制在横幅图片之上」按 CSS 树序推断，未实测。
2. 无尺寸 SVG 在 `background-size:auto` 下按定位区域尺寸渲染，是 CSS 规范行为 + 用户截图的白色块现象互相印证；本会话未做渲染复现。
3. `react-json-view-lite` 把 `collapseIcon/expandIcon` 类挂在哪个节点未查证 → runtime 76-80 的效果未知。
4. `data-slot="sidebar-group-label"` 与 `sidebar-menu-button` 同机制（`state.slot`），但本会话只在 `aurora-theme` 见过 menu-button 的实机化引用。
5. `runtime/preview-package/` 与 `runtime/windose-runtime.css` 不同步（旧包缺 charm 变量、含 s3 规则）：重建后需重新核对，本报告不代跑构建。
