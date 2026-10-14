# R9.7 反馈队列（2026-10-13 09:30，用户实机 R9.6d 截图 11 张）

源码基线：/tmp/vrcx-win-src-r9/src（Windows HEAD 7074357）。注意：Windows 工作树有用户未提交的 src 改动
（含 features/charts/RelationshipTimelinePageImpl.tsx、TwoPersonRelationshipPageImpl.tsx、UserDialogInfoTab/DataTabs、
TrackedNonfriendsSidebar 等）。涉及这些文件的任务必须先以只读方式拷贝 Windows 工作树当前版本对照，不得修改。

## 已验收（实机，用户 09:30 回复）

- 设置齿轮图标、隐私锁屏：没问题。
- 两处猫猫头动效（R9.6d）：可以了。矮窗口猫跳起压菜单框线：不用改。
- 标题栏跳动爱心：中、大号尺寸没问题（小号见 Q7）。
- 群组方形头像：用户详情群组标签（图8）、主界面右侧群组房间（图9）都正常；那是源码默认圆角方块。用户觉得“有点单调”但认可没问题——不立项，后续可作为可选美化。
- 截图里未提意见：导航猫 Steam 低清、状态栏蕾丝（图5/6 底部可见）。

## 原始问题清单（各项状态见文末最新进度）

| # | 问题 | 证据 | 解析 | 建议归属 |
|---|---|---|---|---|
| Q1 | AI 助手弹窗头部排版错乱：标题被做成粉色整行标题条，原本同一行右侧的“无端点 / 未配置 / 侧栏 / 关闭”掉到第二行 | 图1（原版）vs 图2（主题） | **是我们的 CSS 导致**。源码 features/assistant/AssistantDialog.tsx:313 `DialogHeader className="flex-row items-center justify-between …"`，标题与操作按钮同一行；而 runtime/dialogs-r9.css:51-62 对所有普通 dialog-header 强制 `flex-direction:column`，:64-86 把 dialog-title 拉成负边距整行粉条。需对“头部除标题外还有操作区”的弹窗保持横排：整条 header 作为粉色标题栏，操作按钮留在条内右侧（或只给标题粉条、不改 header 方向）。要全量排查其它 flex-row 头部的弹窗。 | 队友（弹窗段 owner） |
| Q2 | 加载图标没用上“跳舞”加载动画 | 图3 关系时间轴“加载中”、图4 双人关系中央转圈 | loader-r9.css 只覆盖 `.vrcx-0-main-content [data-slot=empty] > empty-content` 里的 LoadingState spinner。图3 是 RelationshipTimelinePageImpl.tsx:443 绝对定位层里的 `<Spinner className="size-4"/>` + 文案；图4 是 TwoPersonRelationshipPageImpl.tsx:581 `RefreshCcwIcon size-6 animate-spin`（不是 data-slot=spinner）。用户要求：**顺着所有加载图标的插入位置梳理一遍**（Spinner、Loader2/LoaderCircle、RefreshCw/RefreshCcw+animate-spin、各页面 loading 状态），区分“页面/区块级加载”（换跳舞）与“按钮内/行内小转圈”（保持小像素转圈），列清单后实现。 | 队友 |
| Q3 | 工具页卡片没有设置页同款主题（严重未覆盖），并顺带排查其它页面 | 图5 工具页 vs 图6 设置页 | 设置页卡片样式（settings-pixel.css:74-82：像素标题栏、蝴蝶结挂饰、蕾丝、阶梯角；左侧分类列表底部蕾丝）选择器限定在设置页 `tabs-list.w-44` 作用域内。工具页（tools-ui-r9 只做了筛选框+左 rail）的右侧分组卡“最近使用/系统工具/媒体/文件夹…”与左侧分类列表都没有对应处理。需：工具页同语言覆盖；并全站排查同类“分组卡片 + 左侧分类”页面（如其它带 collapsible card 的页面）。 | 队友 |
| Q4 | 设置卡片/左侧分类列表的蕾丝方向错：现在蕾丝在框内、扇贝尾朝下，尾后面又接一条边框，很怪；应改为**挂在边框外侧、顶部挂在底边框上、尾巴朝外** | 图7（左：分类列表底部；右：卡片标题栏下） | settings-pixel.css:81-82 注释即“Lace fringe hangs inside the title bar's 10px bottom padding”，`::after bottom:0; height:8px` 在标题栏内部；左侧分类列表底部蕾丝同理（需查对应规则）。改为：蕾丝顶边贴在边框线外侧（标题栏下边框之下 / 列表外框底边之下），扇贝尖朝外（向下）；注意卡片 clip-path（--jk-px-cut）与 overflow 会裁掉框外内容，需另找挂载点或放进下方内容区顶部。工具页（Q3）同样遵循。 | 队友 |
| Q5 | 设置卡片标题前的“高清蝴蝶结”突兀，要换成素材库里没用过、合适的像素元素，**先出候选让用户选** | 图7 | settings-pixel.css:80 `::before` 24×16 `mask:var(--jk-mask-s6)` 单色粉。需扫 original-assets（src/、r5/src、r7 等）未使用或适合的像素小物（心、星、缎带、钥匙、草莓、猫爪……），出 4–6 个候选对比板（实际 24×16/16×16 尺寸 + 放大），用户选定后再实现。 | 像素队友 |
| Q6 | 群组收藏页左右可拖动分隔条没设计 | 图10（中间细线上的紫色小条） | ui/shadcn/resizable.tsx：`[data-slot=resizable-handle]`（w-px 线 + withHandle 时 h-6 w-1 rounded-lg 小条）。全站用到：AssistantDialog、InstanceHistoryPage、ScreenshotGalleryView、SavedGroupFavoritesPage/FavoritesPage、WorkspaceResizeHandle、GroupCalendarTimeline、gantt 等。做像素化分隔条：1px 紫线 + 像素握把（点阵/竖排三点），hover/拖动/聚焦态，横竖两向，不改命中区域。 | 队友 |
| Q7 | 品牌心重画：三副改为 **9×7（小）/ 10×8（中）/ 11×9（大）**（宽×高），用户说现在小号太小、像素数不够 | 用户回复 | 原生整数网格新画，风格同现有（深紫描边+粉体+左上高光，不用纯黑）。默认按 1:1 原生显示（像素格均匀、不再用 1.4× 非整数缩放）；帧序仍 小-小-中-大-中、每 0.5s；reduced-motion 静态中号。说明：1:1 时大号宽 11px，比现在的 13px 略小；若用户想保持现在的大号观感再议。 | 像素队友 |

## 流程

1. 每项交付先由 Lead 看图 + check.mjs 交叉检查（非 owner off=0）+ 全量回归，再打包 R9.7。
2. Q5 先出候选板给用户选，选定后才实现。
3. 部署按原子脚本（Old = R9.6d 哈希），请用户重新加载验收。

## 分派（2026-10-13 09:4x，Lead）

源码快照：/tmp/vrcx-win-src-r97/src = HEAD 镜像 + Windows 工作树 22 个已修改 src 文件（只读拷贝，chmod a-w）。

| # | 子 Agent | 写范围 |
|---|---|---|
| Q1 | 94d7ab46 | runtime/dialog-header-r97.css, checks/r97-dialog-header/ |
| Q2 | 2b7e72b5 | runtime/loader-r97.css, checks/r97-loader/ |
| Q3+Q4 | 70499ad9 | runtime/cards-r97.css, checks/r97-cards/（挂饰做成变量入口 --jk-r97-card-charm，待 Q5 选定后一行替换） |
| Q5 | 800d0c94 | original-assets/r97-charm/（只出候选板，等用户选） |
| Q6 | 0ce58b5e | runtime/splitter-r97.css, checks/r97-splitter/ |
| Q7 | fd5e7d67 | original-assets/r97-heart/, runtime/brand-heart-r97.css（替代 r96） |

## 最新进度（2026-10-13 10:30 Asia/Shanghai）

- Q1 ✅ `dialog-header-r97.css` 2000B：AI 助手头部恢复一行粉条（标题+操作区同 top）；扫描 88 个 Dialog/Sheet 头部，仅 AssistantDialog 命中；after.png 已复核，交叉检查通过。对 `p-0` 头部就地修复 inset 变量特异性，不全局动 r9。
- Q2 ✅ `loader-r97.css` 1789B：盘点 151 处加载插入点，A 类 57（页面/区块加载跳舞），B 类 94（按钮/行内保留像素环）；包括关系时间轴、双人关系和 dialog block Empty。更新 R9 loader 旧断言以反映用户对“所有区块加载”的新决定；Q2 verify 与旧 R9 loader 都 PASS。
- Q3+Q4 ✅ `cards-r97.css` 4912B：工具页设置页同款卡片；蕾丝挂到外框线之外，顶部贴边、尾朝外；已重画为 16×8 真像素格。设置分类 rail 底部内边距从主题留给旧框内蕾丝的 12px 还原到 3px，高度减少 9px；Q3b verify PASS，卡片/工具页布局无变化。
- Q5 ✅ 用户选择 #3 双色药丸：16×8 五色像素图，以内嵌 background-image 形式接到设置页与工具页（非 mask）；逐像素调色板误差 0。
- Q6 ✅ `splitter-r97.css` 1657B：1px 像素线、方角三点握把、hover/drag/focus 状态；88/88 断言 PASS，命中区和面板几何不变。
- Q7 ✅ `brand-heart-r97.css` 3653B，替换 r96：原生 9×7/10×8/11×9 三副，五帧逐像素 PASS。

### 集成、回归与部署

- R9.7 四文件包已构建并部署：`C:\Users\tangh\Documents\GitHub\theme-preview\jirai-kei-theme`。最终版 theme.css 1,024,259 B（SHA256 `C8FAB4A5…`）/ 上限 1,048,576 B，余量 24,317 B；preview 45,310 B；无 @import / 外部 url()；目录恰好四文件。完整 SHA-256、旧版对照与两次部署记录在 `windows-deploy-r93.json` 的 `r97` 块。
- **首次部署后的自查修复（10:5x）**：Lead 复核 after.png 发现 AI 助手头部状态点在新的粉色标题条上几乎不可见（源码 `HEALTH_DOT_CLASS` 的 `unconfigured: bg-muted-foreground/50`，半透明灰在粉底上消失）。在 `runtime/dialog-header-r97.css` 追加一条规则：命中的头部操作区里 `.size-2.rounded-full` 改为 `border-radius:1px` + `box-shadow:0 0 0 1px var(--r9-dialog-ink)`。处方只加方形墨圈，源码健康色（灰/绿/红/琥珀脉冲）不动，与主题既有的"方形状态灯"语言一致。第二次部署只替换 theme.css，另外三个文件复核为逐字节相同。
- Lead 集成交叉检查：各段 fixture 用例全部 `integratedVsMovedLast=0`。OFF 差异仅为预期新行为：dialog block loader (4 个字段)、分隔条/握把（favorites 4 项、data-surfaces 2 项）；所有用例 pass。
- 全量旧回归：14 PASS / 3 SKIP / 0 FAIL（含改过期望的 r9-loader）；状态点修复后重跑仍为 14 PASS / 0 FAIL。dialog-header 检查重跑 9/9 断言通过、decoy 差异 0、文件 2570 B，after.png 4× 放大确认"未配置"与"已连接"两种状态点都清晰。Q3b 真像素 / 药丸复核 PASS，Q2/Q6/Q7 报告 PASS。
- 部署前 Windows `src` HEAD 已到 `1fc71ba4aafadcbba830bf8ccf846e83fb1ce4ac`，工作树干净；对比相对旧测试 HEAD 的 22 个已提交文件与只读快照 `/tmp/vrcx-win-src-r97`，0 个不匹配。部署脚本先验证该 HEAD、旧四文件 hash、上传 hash，再逐文件原子替换，并核验最终四文件 hash；第二次部署额外加了"VRCX 进程数必须为 0"的闸门（**该闸门是失效的，见下**）。

> **更正（2026-10-13 11:0x，重要）**：先前所有"VRCX 未运行 / count=0"的结论都是**假阴性**。用户实际跑的进程名是 **`vrcx-0.exe`**（Tauri 版 VRCX-0，PID 34732、约 244 MB 常驻），查询用的 `Get-Process VRCX` 永远匹配不到它，所以"闸门通过"是假通过。实机数据目录也不是 `%APPDATA%\VRCX`（那份最后使用于 10-08），而是 **`%APPDATA%\VRCX-0`**（`VRCX-0.json`、`VRCX-0.sqlite3`、`error-log.txt`、`runtime.lock`，10-13 10:07 仍有写入）。真实情况是：**R9.7 两次部署都是在 VRCX 正在运行的情况下完成文件替换的**（10:34:50 第二次写入）。单文件 `[IO.File]::Replace` 是原子的，不会产生半截文件，但已加载过的 CSS 需要用户点"重新加载"才会取到新内容。后续任何"实机是否在跑"的判断都必须用 `vrcx-0.exe`，或直接用 `Get-Process | Where-Object ProcessName -match 'vrcx'`。
- **实机验收待用户**：实机 VRCX-0 自 10-13 早上一直在运行。请主人点一次"重新加载"以确保取到 10:34 的 r97b 文件，然后反馈/截图（单边 ≤2000px）；优先看 AI 助手头部（含两个状态点）、设置/工具页挂饰和蕾丝、跳舞加载、群组收藏分隔条、标题栏心。没有实机证据前不能标记目标完成。

### 实机截图能力（2026-10-13 11:1x，Lead 新建，后续轮次请沿用）

先前"SSH 无法截屏"的结论不成立。做法：

1. 把 PowerShell 脚本放到 `C:\Users\tangh\jirai-shot\`。
2. `schtasks /create /tn <名> /tr "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File <脚本>" /sc once /st 23:59 /it /f` —— `/it` 让任务跑在**交互式会话**（实测 `SessionId=1`），于是 `CopyFromScreen` / `PrintWindow` 能拿到真实桌面像素；`-WindowStyle Hidden` 必须加，否则脚本自己的 PowerShell 窗口会被拍进图里。
3. `schtasks /run` 触发，等几秒，`schtasks /delete` 收尾（不留残留任务）。
4. **只用 `PrintWindow(hwnd, hdc, 2)` 截 VRCX 窗口本体**：`Get-Process vrcx-0 | ? MainWindowHandle -ne 0` 拿句柄，`GetWindowRect` 拿矩形（实测 `346,155 1501x875`），`PrintWindow` 连被遮挡的部分也能截到，返回 True。窗口内容直接可用，无需裁剪。
5. 取回：`scp pc114514:C:/Users/tangh/jirai-shot/vrcx.png <本地>`。

**隐私纪律（硬性）**：**禁止全屏截图**。实测全屏截图会把用户当时开着的其它窗口（含私人聊天窗口及其中图片）一并拍下来，与验收无关且属于用户隐私。只用窗口级 `PrintWindow`，并且全屏样张一经发现立即删除（本地与 Windows 侧都要删）。真实好友昵称的实机图只允许落在 `/tmp/jirai-live/`，不得进入仓库。

**已验证**：实机 VRCX-0 主题确在运行（`vrcx-window.png` 显示粉色标题栏、像素导航、表格）；连拍 10 帧标题栏（间隔 300 ms，`/tmp/jirai-live/heart-10frames.png`）看到品牌心在大小/填充上逐帧变化，说明跳动动画在跑。心边缘是锐利整数像素、带左上高光，符合 R9.7 的 1:1 原生网格而不是 R9.6d 的 1.4× 缩放，但仅凭标题栏无法百分百确认版本；要确认 R9.7 必须看设置页/工具页的双色药丸与框外蕾丝，或 AI 助手头部。

**已确认实机跑的就是 R9.7（2026-10-13 11:2x，量化证据）**：重拍 10 帧、裁剪物理区域 `(0,0,400,64)`，在 `x∈[113,130] y∈[16,41]` 内测深色描边边界框（避开 "jirai" 尾部与 x=135 的竖线），得到物理尺寸

```
f0..f9  W = 13,12,12,11,11,11,12,12,13,12   (range 11-13)
f0..f9  H = 11,10,10, 9, 9, 9,10,10,11,10   (range  9-11)
```

除以实机 1.25 的缩放 → CSS `8.8×7.2 / 9.6×8 / 10.4×8.8`，**精确对应 R9.7 的 9×7 / 10×8 / 11×9**。三条排他性证据：

1. 物理宽度只有 11/12/13 三档，**没有任何一帧接近 22-23**；R9.6d 的大号是 13 源像素 ×1.4 = 18.2 CSS = **22.75 物理 px**，若仍是旧版必然会拍到。
2. 实测宽高比 11:9 / 12:10 / 13:11 **宽>高**；R9.6d 的三副心是正方形比例（7×7 / 10×10 / 13×13）。
3. 每帧左上角都有白色高光，符合 r97 三副心"深紫描边+粉体+左上高光"的画法。

证据图 `/tmp/jirai-live/heart-live-10f.png`（10 帧 9× 放大）。**结论：用户实机已在运行完整 R9.7，不需要再点"重新加载"**；剩余验收只差设置页/工具页/AI 助手三处，等用户切页面即可截图取证。



### 运行环境核实（2026-10-13 11:0x，Lead）

- 实机 VRCX 用 **CEF** 渲染：`%APPDATA%\VRCX\LastCefVersion` = `146.0.7680.179`（Chromium 146 内核）。
- Lead 本地验证环境是 Playwright Chromium `156.0.8078.4`，比实机内核**新** 10 个大版本。这构成一个反向盲区：我在 156 上测通的写法，理论上可能在 146 上不被支持。因此逐项复核。
- 扫描整包 theme.css 用到的前沿特性：`:has()` 377 处、`color-mix()` 5 处、`round()` 1 处、`clip-path` 54 处、SVG `shape-rendering` 327 处。**未发现** `if()`、`@scope`、`@starting-style`、`light-dark()`、`field-sizing`、`@container`、`anchor()`、`view-transition` 等更新的特性。
- 支持门槛：`:has()` 需 Chromium 105+、`color-mix()` 需 111+、`round()` 需 125+ —— 实机 146 全部满足。另外 `settings-pixel.css` 的 17 处 `:has()` 正是用户已实机验收（R9.6d 设置页）的选择器，等于 `:has()` 在实机上已有实证，不是纸面推断。
- `cards-r97.css:26` 的药丸定位写成 `top:calc(50% - 8px);top:round(down,50% - 8px,1px);`，是带回退的写法：即使 `round()` 不可用也只会退回非整数像素定位，不会丢位置。
- 结论：**R9.7 不存在实机内核兼容风险**，本地 fixture 的验证结论可外推到实机。
- **实机显示缩放 = 125%**（`GetDpiForWindow(vrcx-0 主窗口)` 返回 120；分辨率为 2048×1152）。这条把先前"125%/150% 会有宽窄格"的纸面推测变成了实测事实：**1 CSS px 渲染成 1.25 物理 px，所以任何 1:1 的像素图在实机上都会出现单像素格宽窄交替**（相邻格 1px/2px 抖动），这不是 CSS bug，只有整数倍缩放（100%/200%）或把每个视觉像素做成 4 CSS px（4×1.25=5 物理 px，整数）才能完全均匀。**16×8 这类尺寸并不能豁免**——不均匀发生在单格层面，不是总宽层面。
- 由此引出一个**必须让用户知道的取舍**：Q7 要求的 9×7 / 10×8 / 11×9 按 1:1 原生渲染后，大号显示宽度是 **11 CSS px ≈ 13.75 物理 px**；而 R9.6d 的大号是 13 源像素 × 1.4 = **18.2 CSS px**。也就是说新的最大帧比旧的最大帧**小了约 39%**。用户当时说"中-大 没问题"，指的可能是旧的中大号观感；若实机看下来觉得整体偏小，最直接的补救是把三副心整体按 2× 渲染（18×14 / 20×16 / 22×18），既保持像素锐利又恢复原有体量。**改与不改都等用户实机表态，不要擅自改。**

### 实机视觉验收结果（2026-10-13 11:3x，Lead 用窗口级截图 + UIA 导航逐页取证）

用户在本轮明确授权 Lead 自动点开导航项做验收截图（"授权，你自己切页面截图"），并拍板**品牌心保持 9×7 / 10×8 / 11×9 不改**。据此用 `nav-click.ps1`（UIA 找导航项 → `ScrollItemPattern.ScrollIntoView` → 取 `ClickablePoint` → 前台校验通过才 `SetCursorPos`+`mouse_event` 点击 → 恢复鼠标位置 → `PrintWindow` 截图）逐页取证。**七项全部通过**：

| 项 | 实机证据 |
|---|---|
| Q1 AI 助手头部 | 打开后头部是**一行**粉条（左标题、右状态），右侧「无端点」「未配置」前的状态点均为**方形描边点**、在粉底上清晰可读（即本次修掉的 `bg-muted-foreground/50` 不可见问题）。放大图 `/tmp/jirai-live/ai-header-right-5x.png`。 |
| Q2 加载跳舞 | 点「关系时间轴」后连拍 10 帧（170 ms 间隔），第 5–10 帧稳定显示**像素小人跳舞 + 「加载中」**，姿势逐帧变化。证据 `/tmp/jirai-live/burst-grid.png`、`/tmp/jirai-live/loader-frame-4x.png`。 |
| Q3 效果覆盖 | 工具页与设置页卡片**完全同款**（药丸 + 蕾丝 + 像素边框），不再只有设置页有。 |
| Q4 蕾丝外挂 | 卡片标题栏下沿：**蕾丝顶部贴在标题栏底边，扇贝尾巴朝下，尾后没有多余 border**，正是用户要的朝向。5× 特写 `/tmp/jirai-live/tools-card-lace-5x.png`。 |
| Q5 双色药丸 | 卡片标题前是**粉+白双色药丸**挂饰，3× 特写 `/tmp/jirai-live/tools-cardhead-3x.png`。 |
| Q6 分隔条 | 群组收藏页竖向分隔条：逐行扫描确认 **x=644 恒为 1px 宽、颜色 `rgb(108,92,224)`=#6c5ce0**，y≈570–580 处线宽变为 5px（握把），8× 特写可见**方角框内三个竖向粉色 2×2 点**。`/tmp/jirai-live/splitter-grip-8x.png`。 |
| Q7 品牌心 | 10 帧物理尺寸只有 11/12/13 × 9/10/11 三档（÷1.25 = CSS 9×7 / 10×8 / 11×9），宽>高、带左上高光；无任何一帧接近旧版 22.75 物理 px 的大号。 |

**过程中对实机的唯一改动**：窗口当时是最小化的，`restore-vrcx` 脚本用 `ShowWindow(SW_RESTORE)` 把它还原（否则截图只有 159×27），随后才逐页导航；点击前一律校验 `GetForegroundWindow()==VRCX` 主窗口，不满足就直接放弃点击，避免误操作其他窗口。鼠标位置在点击后已复原。**未修改任何设置项、未输入任何内容。**

**完整记录已落盘**：`checks/r97-real-machine/README.md`，含实机环境实测值、可复现的取证方法（含"禁止全屏截图"的隐私纪律）、逐项结论，以及 7 张已确认不含好友昵称等隐私信息的证据图（`q1-…` ~ `q7-…`）。本节只保留摘要，细节以该 README 为准。

**仍未由用户亲口确认**：以上是 Lead 侧的实机取证结论，用户尚未对这批截图表态"过了"。目标在用户确认前不标记完成。

### 未处理项（记录，等用户实机反馈后再决定）

- `badge-r9.css:66` 的动效预算规则写的是 `body:has([data-slot='empty'] > div.flex.items-center.gap-2 > svg[data-slot='spinner'])`，即"页面处于 empty LoadingState 时暂停标题栏铃铛徽章的闪烁"。R9.7 把跳舞加载扩展到 A 类 57 处（其中 37 处不在 empty 容器内），这些新位置加载时徽章仍会继续闪，动效预算原则没有跟着扩大。**故意未改**：放宽条件有误暂停通知闪烁的风险，且用户尚未看过 R9.7 实机效果；等实机反馈再定。
- 带操作区的弹窗头部高 33px（全局标题条 30px），因为操作区里的按钮就是 32px；压到 30px 需要缩按钮，未采纳。
- 工具页卡片框是 `::after` 覆盖层（源码卡片本身无边框）；挂饰让标题文字右移约 20px、折叠箭头 6px，与设置页同款。
- 125%/150% 显示缩放下，1:1 像素图会出现宽窄交替格（物理限制，100%/200% 则均匀）。实机缩放在 SSH 会话里读不到可靠值（`PerMonitorSettings` 只存历史显示器），未据此改设计。


