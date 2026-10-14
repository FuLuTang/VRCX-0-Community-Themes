# 右侧社交栏 R4 —— 栏外 margin 与竖排页签

任务范围：只改 `runtime/side-panel-r4.css`（本文件为研究报告）。主应用
`/home/fulutang/Documents/Github/VRCX-0-jirai` 全程只读，未执行 git / 构建 / 写入，未连接 Windows。

## 0. 结论与交付

| 项 | 结果 |
| --- | --- |
| 用户反馈 (4) 栏外"莫名其妙的 margin" | 已修：侧栏右侧 12px、上方 6px 外壳空白与左侧 8px 深黑缝全部消除（实测 12→0 / 6→0 / `#16112a`→`#201936`），侧栏成为一扇带 1px `--wd-frame` 四边框的窗格，贴住窗口右、上、下边缘 |
| 用户反馈 (9) 竖排页签选中不明显 | 已修：页签 28→36px 宽并与内框齐平；选中页签 = `--wd-raised` 面 + 三边 `--wd-frame` 框（左边开口）+ 3px `--wd-pink` 竖脊 + 粉色图标/计数，且**内框右边线在选中处真实断开**（像素级证实）；未选中页签 `#1d1631` 更暗、无框 |
| 页签真实 DOM | SSR 已证实：`button[role=tab][data-slot=tooltip-trigger][data-active]`，`aria-selected="true/false"`。主题原有的 `[data-slot='tabs-tab'][data-active]`（windose-runtime.css:70）**匹配不到这些页签** |
| CSS 字节 | **6311 B**（上限 7000 B，余量 689 B） |
| 验证产物 | `runtime/checks/r4-side-panel/`：`verify-r4-side-panel.mjs`、`ssr-tabs.mjs` + `r4-side-panel-rail-dom.html`、`r4-side-panel-fixture.html`、`r4-side-panel-report.json`、`r4-side-panel-before/after*.png`、`r4-zoom-*.png`（全部 NOT WINDOWS，中性示例文本） |

CSS 结构（本文件内行号）：R4-4 干净结构 L9-43；R4-4b 侧栏窗框 L45-53；R4-9 内框与页签 L55-142。

## 1. 源码证据（真实属性，非猜测）

* `src/components/layout/AppShellLayout.tsx:143-193` —— `main-shell > workspace > [main-content, resizer, SidePanel]`，
  侧栏是 workspace 的**直接子元素**（所以 `:has(> …)` 可用，且侧栏不渲染时规则整体不生效）。
  `:170-175` resizer `data-vrcx-0-resize="side-panel"`、`bg-transparent`、`w-(--vrcx-0-side-panel-resizer-width)`；
  `:176-190` 侧栏宽度写在 inline style 上。
* `src/styles/globals.css:835-846` —— `.vrcx-0-workspace` 带
  `margin: var(--vrcx-0-main-content-gutter)` + `margin-top/bottom`；`:210-214` 变量为 12px / 6px / 10px / 2px 圆角。
  **这就是"莫名其妙的 margin"的出处**：它把 resizer 与整条右栏一起圈进去。
* `src/components/sidebar/SidePanel.tsx:381-393` —— `aside.vrcx-0-side-panel`（`data-vrcx-0-surface="side-panel"`，
  `flex min-h-0 w-80 shrink-0 flex-col overflow-hidden`）。
* `SidePanel.tsx:395-400` —— `Tabs orientation="vertical"`（`data-slot="tabs"`，`shadcn/tabs.tsx:20-30`），
  `:401-498` 内框 = **Tabs 的第一个 div 子节点**（`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-2 pl-2`），
  `:499-692` rail = 它的兄弟 `.vrcx-0-side-panel-rail`（`w-9`，即 36px）。
* `SidePanel.tsx:500-502` —— `TabsList variant="underline"`，`shadcn/tabs.tsx:58-64` 给该变体加
  `data-[orientation=vertical]:px-1` → 实测 4px 内边距，页签因此只有 28px 宽、离内框 4px（见 §3）。
* `SidePanel.tsx:504-598` —— 页签是 `Tooltip > TooltipTrigger(render: ContextMenuTrigger(render: TabsTrigger))`；
  `:509-514`/`:564-569` 手动传 `data-active=""`；`:594-596` 计数是 `span.text-[10px].tabular-nums`。
  `shadcn/tooltip.tsx` 把 `data-slot` 覆盖成 `tooltip-trigger`（与 R4 chrome 报告同一结论）。
* `windose-runtime.css:20` —— `.vrcx-0-side-panel { background-color:#291c3e; border-left:1px solid var(--wd-frame) }`：
  用户看到的左竖紫线来自这里（**不是** workspace 的 edge，见 §2）。
* `windose-runtime.css:107-108` —— SOCIAL 抬头是 `aside::before` 全宽横条（`--wd-title` 底 + 1px `--wd-frame` 底边），
  位置在 aside 顶部，本身没有问题。
* **主题自身的 bug（不在本任务范围，供 Leader 决策）**：`preview-package/…/theme.css:80`
  `--vrcx-0-main-content-lift: none;` → 应用 `globals.css:842-845` 的
  `box-shadow: …, …, var(--vrcx-0-main-content-lift)` 整条声明失效。实测：不补值时 workspace 的
  `box-shadow` 为 `none`；把该变量临时改成 `0 0 #0000` 后立刻变成
  `inset 0 1px 0 transparent, 0 0 0 1px rgb(108,92,224), …`。所以本主题里 workspace 的 1px 紫框
  **一直没有渲染**，(4) 的"框中框"是 gutter + 侧栏自己的 border-left 造成的。修复后若 lift 被修正，
  本文件的 `box-shadow:none` 正好接住，不会再套一层框。

## 2. 用户截图交叉验证（只读采样，未复制进仓库）

对 `fa2bcc…`（452×1029）逐行取像素 run：y=58 行得到
`…66-74 #16112a | 75 #6c5ce0 | 76-430 #2f2552(SOCIAL) | 431-442 #201936 …`。

* `#16112a` = 侧栏左侧 8px resizer 槽透出的 workspace canvas（`bg-transparent`）；用户看到的"左右深色"左边就是它。
* `#201936` = 右侧 12px gutter 透出的 main-shell 面；`#6c5ce0` = 侧栏自己的 `border-left`。
* 同一布局在 fixture 里复现：before 状态 y=500 行采样同样是
  `1047-1049 #16112a | 1050-1051 #1a152e(分隔线) | 1052-1054 #16112a | 1055 #6c5ce0` ✓ 数值逐字节一致。

## 3. 修复前实测（构建版 theme.css + 当前 runtime 四件套）

| 采样 | 值 |
| --- | --- |
| workspace | `margin: 6px 12px 10px 12px`，`box-shadow: none`（见 §1 的 lift bug），圆角 2px |
| 侧栏 | x=1055，右边距窗口 **12px**；上边距 main-shell **6px**；`border: 0/0/0/1px`（只有左紫线） |
| resizer 槽 | 8px，`rgba(0,0,0,0)` → 透出 `#16112a` 深黑缝（左右各一条深色带） |
| 主内容 | x=52, y=38, **995×988** |
| 内框 | 无背景、无边框（`outline: 3px none`），与列表区没有层次 |
| 页签 | 28×48，`border-radius: 6px`；选中页签只有应用 `bg-secondary` 面 `rgb(42,33,71)`、**无边框、无强调**，图标白色；未选中页签 `rgba(0,0,0,0)` 完全融进侧栏底 `#291c3e`，字 `rgb(185,173,217)` → 选中/未选中几乎不可分辨（这就是用户截图里的"选中不明显"） |

## 4. 修复后实测

| 采样 | 值 |
| --- | --- |
| workspace | `margin: 0`，侧栏存在时不再有 gutter；无侧栏时回到 `6px 12px 10px` 且主内容 margin 恢复 `0px` |
| 侧栏 | x=1067（右边距 **0**，顶边距 **0**），320×1004；`border: 1px/1px/1px/1px solid rgb(108,92,224)` |
| resizer 槽 | 8px，背景 `rgb(32,25,54)` = `--wd-window`；命中测试仍为自身（`noDrag: true`），宽度 8px 不变 |
| 主内容 | x=52, y=38, **1007×988** —— **位置与高度与修复前完全一致，只加宽了 12px**（右侧 gutter 让出的空间） |
| SOCIAL 抬头 | 25px 高、`rgb(47,37,82)`、底边 `rgb(108,92,224)`，字体仍是 `"WD Pixel"`，未改文字 |
| 内框 | `rgb(42,33,71)` 面 + `outline: 1px solid rgb(108,92,224)`，`outline-offset:-1px`（零布局影响） |
| 页签 | 36×48（宽 = rail 宽 36px，左边缘 == 内框右边缘，实测 `activeTabToInner = 0`） |
| 选中页签 | 面 `rgb(42,33,71)` = `--wd-raised`；边框 `1/1/1/1`，**左 `rgba(0,0,0,0)`**（开口）；图标/计数 `rgb(255,127,207)` = `--wd-pink`；`::after` 3px `rgb(255,127,207)`、`pointer-events:none` |
| 未选中页签 | 面 `rgb(29,22,49)` = `#1d1631`（比侧栏底 `#291c3e` 暗）、边框 `rgba(0,0,0,0)`、字 `rgb(162,148,200)` |
| hover | 面 `rgb(74,55,132)` = `--wd-select`、字 `rgb(242,235,255)` = `--wd-text` |
| 键盘焦点 | 选中页签聚焦时环仍在：`rgba(255,127,207,.97) 0 0 0 1.94px inset`（粉脊也仍在）—— 粉脊刻意不用 inset box-shadow，避免吃掉应用的 focus ring |
| "+"按钮 | 24×24 面 `rgb(29,22,49)`、字 `rgb(162,148,200)`，与页签同族 |

**"内框在选中处断开"的像素证据**（截图后在浏览器内解码取样）：

* 选中页签高度、内框右边线处取 5×20 竖条 → `{"42,33,71":100}`，**`#6c5ce0` 0 像素**（线被同色块切掉）。
* 未选中页签同位置竖条 → 含 `"108,92,224":20`（线仍在）。
* 修复过程中发现：`::before` 若只覆盖 `left:-1px;width:2px`，覆盖面是 `[右, 右+2)`，而内框 outline 落在
  `[右-1, 右)`，实测线仍在（x1349 仍是 `#6c5ce0`）；改成 `left:-2px;width:3px` 才真正断开。

## 5. 保留项回归（同一次运行内断言）

* 虚拟列表：行高 48px 修复前后一致；TabsContent（列表容器）宽 275→274（= 新增右侧 1px 框，border-box），
  高 875→889（= 让出的 6px 上 + 10px 下 gutter 减去新增 1px 上下框）。**未改任何行高/spacer/translateY 相关规则。**
* 无侧栏布局：移除侧栏与 resizer 后 workspace 回到应用默认 `margin: 6px 12px 10px`、主内容 margin `0px`、圆角 2px →
  `:has()` 的作用域正确，不影响没有右栏的页面。
* 侧栏窗口模式（`data-window-sidebar-mode="true"`）：侧栏 1347 = 视口 1387 − 导航 40，`scrollWidth-clientWidth = 0`，页签不越界。
* 窄宽：320 / 240px 两档 `panelOverflowX = 0`、`railOverflowX = 0`，页签均 36px 且左边缘 == 内框右边缘（343/343、263/263）。
* resize 把手：8px 宽不变、中心 `elementFromPoint` 命中自身，未被任何新规则覆盖。
* 未新增 DOM、未替换文字、未用 `@import` 或远程 URL；装饰伪元素均 `pointer-events:none`。

## 6. 给 Leader 的精确替换建议（本文件不改 windose-runtime.css）

1. `windose-runtime.css:20` 现为
   `.vrcx-0-side-panel { background-color:#291c3e; border-left:1px solid var(--wd-frame); }`
   —— 与新文件的 `border: 1px solid var(--wd-frame)`（R4-4b）在左边框上重复。两者同值等价，
   可任选一处保留：若想省字节，把 `side-panel-r4.css` L51-53 的 `.vrcx-0-side-panel{border:…}` 块删掉
   即可（其余三条边框会随之丢失，不建议）；**推荐保留新文件的写法**，windose-runtime.css:20 的
   `border-left` 变成冗余但无害的声明。
2. `windose-runtime.css:70` `[data-slot="tabs-tab"][data-active] { background-color:var(--wd-pink); color:#16112a; }`
   对 rail 页签**无效**（slot 被 Tooltip 覆盖），但对话框页签仍需要它 → 建议保留不动，仅在此备案。
3. `build-runtime.mjs:43` 的 `parts` 目前没有新文件。请追加在最后一位：
   `['side-panel', await read(path.join(here,'side-panel-r4.css'))]`，使拼接顺序等于
   tokens → native-icons → assets → fonts → icons → windose-runtime → window-chrome → group-spacing → body-typography → **side-panel**。
4. （可选，另一个 scope）tokens 的 `--vrcx-0-main-content-lift: none` 是无效值，令 workspace 的 1px 紫框
   整条失效（theme.css:80）。若要恢复内容卡描边，应改成 `0 0 #0000`；改后侧栏存在时本文件的
   `box-shadow:none` 会阻止它在右栏外面再套一圈。

## 7. 风险与 Leader 实机复测项

* **必须实机确认**：真实 WebView2 里侧栏贴住窗口右/上边缘后，与窗口自绘边框/圆角
  （`.vrcx-0-custom-window-frame`、`:has([data-window-docked])`）是否产生双线或压角；本 fixture 没有窗口外框。
* **必须实机确认**：状态栏上方 8px 蕾丝（window-chrome.css:151）在右栏一侧的观感 —— 侧栏下边缘现在直接落在
  状态栏 8px 留白之上，fixture 里未画该伪元素。
* **需要人工看图**：主内容加宽 12px 后，各页面（尤其表格列宽、粘性表头）是否有非预期的换行/横向滚动；
  数据表布局不属本文件 scope，但右侧空间确实变了 12px。
* **需要人工看图**：未选中页签 `#1d1631` 与侧栏底 `#291c3e` 的对比在实机低亮度屏上是否足够；
  内框 `outline` 会压住列表最右 1px（贴边的"⋯"按钮边缘），实机请确认不影响点击与观感。
* 本报告全部数值来自 headless Chromium fixture（应用编译 CSS + 构建版 theme.css + 当前 runtime 四件套），
  **不是 Windows 实机通过**；未收到实机截图前不签署任何实机结论。
