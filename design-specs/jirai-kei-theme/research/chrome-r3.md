# 窗口外壳 R3：真实标题栏/状态栏 + 像素窗口按钮（交付说明）

交付：[window-chrome.css](<../runtime/window-chrome.css>)（144 行，独立 section，未执行任何构建/测试/连接）。主应用仓库全程只读。

行号均为 2026-10-11 20:38 UTC 快照；期间 Leader 正在并发编辑 `runtime/windose-runtime.css`（假粉色抬头已从该文件消失），复核时请按选择器而非行号定位。

## 源码证据（全部来自 /home/fulutang/Documents/Github/VRCX-0-jirai）

| 结论 | 证据 |
| --- | --- |
| 标题栏是真 header，高 32px，带 `data-app-titlebar="true"` 与 `data-vrcx-0-surface="titlebar"` | `src/components/layout/AppTitleBar.tsx:90-96`（`h-8`=32px） |
| 三窗口按钮 = `h-full w-9 rounded-none border-0`（命中区 36×32），语义为 Minus / Square\|Copy / X | `AppTitleBar.tsx:43`、`:83`、`:142-171` |
| 最大化按钮的 svg 被显式写成 `size-3`＝12px；另两个无 size 类＝16px（`[&_svg:not([class*='size-'])]:size-4`，`src/ui/shadcn/button.tsx:10`） | `AppTitleBar.tsx:159` |
| close 的 hover 危险态是 **!important** utility：`hover:bg-destructive! hover:text-destructive-foreground!`（红底近白字，`--destructive` 定义见 `src/styles/globals.css:28-29`） | `AppTitleBar.tsx:165` |
| 状态栏真 footer 带 `data-vrcx-0-surface="statusbar"`（两个渲染分支都有） | `status-bar/StatusBarFooter.tsx:353`、`:371` |
| 状态栏 `::before` 全仓无占用；`::after` 被 RGB 占用（`top:0` 高 1px） | 全仓 grep：仅 `src/styles/vrcx-0-rgb.css:112`；`::before` 零命中 |
| 条内白色蕾丝的确切来源（本次要移除） | `runtime/windose-runtime.css:108`（`--jk-bg-dark-s1-s` repeat-x 0 0 / 16×8） |
| 标题栏深紫来源（本次要改粉） | `runtime/windose-runtime.css:16` |
| 状态栏上方确有 10px 布局间隙（不等于元素框） | `globals.css:212` `--vrcx-0-main-content-gutter-bottom: 0.625rem`，作用在 `.vrcx-0-workspace`（`:839`） |
| 外壳根是 `flex-col overflow-hidden`，但状态栏 8px 溢出仍在它自身框内，不会被裁 | `AppShellLayout.tsx:144`（根 div）、`:197`（`<AppStatusBar>`） |
| 语义状态点用**背景色**（绿 `--status-online`/黄 `--status-active`），不是文字色 | `status-bar/StatusBarParts.tsx:40-45`；`globals.css:117,124` |
| 变量 `--wd-title-active:#d97fc6`、`--wd-square:#ffb8e6` | `runtime/windose-runtime.css:3-4` |
| mask 名 `--jk-mask-s1-s` 在构建产物中确实存在（不是 s1-l/其它） | `runtime/preview-package/jirai-kei-theme/theme.css:91`（R2 产物快照） |
| S1 tile 方向：`M0 0H16V2A8 6 …`＝顶部实心条+向下波瓣 → 需 `scaleY(-1)` 才向上生长 | `original-assets/dist/jirai-assets.css` 内联 data URI |

## 关键决策

- 选择器全部锚定真实属性：`[data-app-titlebar]`、`[data-vrcx-0-surface="statusbar"]`、`[data-slot='button'][class~='w-9'][class~='rounded-none'][class~='border-0']`。`class~=` 是完整 token 匹配，不会误配 `min-w-9` 之类。
- 规则**未分层** → 天然压过 Tailwind `@layer utilities`；因此**故意不使用 `!important`**，close 的两条 `!` utility 保持权威（红底 + 近白图标），我只补黑边与 bevel；若改成 important 反而会把危险态刷掉。
- 深色文字只作用在灰阶 token（`text-muted-foreground` / `text-content-*`），语义色类名（`text-[var(--status-*)]`、`destructive`、primary badge）不被任何选择器命中。
- 对比度（对 #d97fc6）：主文字 #16112a ≈ 6.8:1，次级 #3b2a45 ≈ 4.9:1，按钮面 #cdb0e8 / #f0a6cb 上 ≈ 9.5:1 / 9.6:1。
- svg 统一锁 16px，压掉 `size-3`；36×32 命中区、`h-8` bar、事件与图标语义均无改动，未新增文本/图标/DOM。
- 状态栏保留应用自带的「未激活变淡」层级（`text-content-tertiary/55`）改为色混合而非拉平。
- 蕾丝：`::before` + `bottom:100%` + `height:8px` + `scaleY(-1)` + `pointer-events:none`；不在条内向下铺，不占 `::after`。

## 可能冲突 / 风险

1. **加载顺序**：只要 window-chrome.css 在 windose-runtime.css 之后（或在 `parts` 里排最后），R3-1/R3-4 就稳定赢；我给两条都加了 `[data-*]` 提高特异性，因此即便插在 runtime 之前也能覆盖其 `:16`/`:114`。
2. **RGB 模式**：`vrcx-0-rgb.css:64` 也给状态栏加 `position:relative !important`，与本文件一致，不冲突；RGB 的 1px `::after` 在条内顶部，蕾丝在条外上方，无重叠。
3. **~55% 变暗**：`color-mix` 依赖 Chromium 支持（`globals.css` 已在用 `color-mix(in oklch,…)`），WebView2 通过。
4. **间隙若被压缩**：蕾丝 8px < 10px gutter；若将来把 `--vrcx-0-main-content-gutter-bottom` 调到 <8px，蕾丝会压到最后一行/滚动条，需要同时下调蕾丝高度。
5. **sidebar 窗口模式**：状态栏变 `h-8 flex`、标题栏按钮只剩 2 个（无最大化）、标题栏背景另有 `[data-window-sidebar-mode]` 规则。我的规则按属性匹配，两种模式都会变粉；此模式未实机验证。
6. **`background-image:none`**：会清掉状态栏上任何其它 background-image；当前 `windose-runtime.css:114` 是唯一来源，无副作用。
7. **未触碰**：`--wd-*` 变量值、`.vrcx-0-page-scaffold::before` 假抬头（Leader 负责移除）、任何语义状态色与状态点。

## 必须复测（实机）

1. 100% / 125% / 150% 缩放下三个窗口按钮：16px 图标无分数像素模糊；命中区仍为 36×32（点击最左/最右边缘各一次）。
2. Minus 最小化、Square↔Copy 最大化/还原、X 关闭三条真实动作；X 键盘 Tab 聚焦后 Enter 关闭。X hover = 红底白图标；三个按钮 `:focus-visible` 黑框在粉底上可读。
3. 状态栏：末行内容与水平滚动条不被蕾丝遮挡；蕾丝在条上方、波瓣朝上、与条无缝相接；鼠标划过该 8px 带不影响任何点击（含侧栏拖拽）。
4. 开 RGB 特效时状态栏顶部 1px 彩虹线与蕾丝共存、无花屏。
5. 状态栏可点击 segment 的 hover/展开态：浅底 + 深字可读；绿/黄状态点颜色未变。
6. sidebar 窗口模式与「隐私锁」覆盖态（标题栏按钮整组消失时不该留空块）。

## 交给 Leader（我未做）

- 把本文件作为新 section 接入 `runtime/build-runtime.mjs:43` 的 `parts`（建议 key `chrome`，排在 `runtime` 之后）。
- 移除中间假粉色抬头：`windose-runtime.css` 的 `.vrcx-0-page-scaffold::before`（20:38 快照中已从该文件消失，若确已由你移除则无需再动），本文件刻意不引用它。
- 部署后的实机截图与 SHA-256 记录；我不执行构建与 Windows 连接。
