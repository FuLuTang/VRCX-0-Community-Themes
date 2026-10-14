# R9.6 用户反馈队列 · 2026-10-13

来源：用户实机截图反馈（3 张）。本文件是分析与队列台账；2026-10-13 用户授权 Lead 自行分配，已派发。
（自动轮次不能改 goal objective，用户下一条直接消息时由 Lead 补记入 goal。）

已部署版本：R9.5，`theme.css` 969404B / SHA256 `9749E04B429E611C109CB0EDD60E37D356C0D5AC02914CAAEEEACE14C16FA465`。

## 1. 猫猫头回归（用户：图一图二“怎么又变回高清了”）

**根因（已确认，是 Lead 压缩素材时引入的回归）**

- `original-assets/r5/generate.mjs:63-64`：
  ```js
  items.splice(items.findIndex(a=>a.id==='pixel-mascot'),1);
  await transcribeSprite('pixel-mascot','NSO cat-face fan transcription',{left:140,top:420,width:140,height:150},'checks/mascot-compare.png');
  ```
  第 55-62 行本来已经从 `sources/needy-cat-steam18.json` 读好 18×18 的 Steam `:needy_cat:` 矩阵，但第 63-64 行又把 `pixel-mascot` 从 items 里删掉、换成 NSO 猫咪脸的 30×30 转写。于是 `--r5-pixel-mascot` 输出的是 `<title>NSO cat-face fan transcription</title>` 的 30×30 高清版。
- 证据：旧 `runtime/preview-package/jirai-kei-theme/theme.css` 第 1472 行仍是 `<title>Steam :needy_cat: official-small-grid fan transcription</title>` 的 18×18；当前构建里已经是 30×30 NSO 版。
- 使用点：`runtime/cat-r8-final.css:15`（导航空档 36px = 2×）、`runtime/motion-r7.css:16`（SOCIAL 角落）、`runtime/windose-runtime.css:48`、`runtime/login-r8.css:50`。

**修法**

1. `generate.mjs`：`pixel-mascot` 用 `needy-cat-steam18.json` 的 18×18 输出（`catRuns`，第 56-62 行已经算好但没被用），NSO 转写另存一个 id（例如 `mascot-nso`），不再覆盖 `pixel-mascot`；并在脚本里加断言，防止再次被覆盖。
2. 重建 `assets-r5.css`，比较重建前后只有 mascot 一行变化。
3. 复核两处实机尺寸：18px（导航/SOCIAL/登录）与 36px（导航空档 2×）都不该有平滑插值感。

**风险**：`assets-r5.css` 体积可能回升（18×18 Steam 版比 30×30 NSO 版小，应该更省）。

## 2. 底边蕾丝仍未修（用户：图三“还记得我之前说的什么么”）

**用户先前的要求（task-23，R8.2）**：去底线、去竖缝、孔眼改粉点、填充与状态栏同色。

**用户澄清（2026-10-13，直接消息，权威）**：
> 底边蕾丝的问题是，蕾丝遮罩，别朝外加肉粉描边，而是朝内，要不洞洞都不镂空了

即：蕾丝是一张**遮罩**——布面轮廓不许被描边撑大；描边必须**向内**画在布面里面；孔眼必须是**真镂空**（透明，透出下面的深色窗底）。此条覆盖 R8.2 的“孔眼改粉点”。

**当前实现**（`runtime/chrome-r8.css:14` 的 `--r8-lace-tile`，20×8 base64 SVG，`::before` 用 `background-image` 平铺而非 mask，`-webkit-mask:none`）。像素图（`o`=`#f9d1e7` 布面，`#`=`#d97fc6` 描边，`.`=透明），两个周期：

```
oooooooooooooooooooooooooooooooooooooooo
#oooooooooooooooooo##oooooooooooooooooo#
ooooooooo##oooooooooooooooooo##ooooooooo
#oooo##oooooo##oooo##oooo##oooooo##oooo#
.##oo#ooo##ooo#oo##..##oo#ooo##ooo#oo##.
...#ooooo##ooooo#......#ooooo##ooooo#...
...#####oooo#####......#####oooo#####...
........####................####........
```

**确认的错误（逐像素分类）**

1. **描边朝外**：`#d97fc6` 外缘像素 (0,3)(1,4)(2,4)(3,5)(3,6)(4..7,6)(8,7)(11,7)(12..15,6)(16,5)(16,6)(17,4)(18,4)(19,3) 全部落在布面 `o` 轮廓**之外**，等于把扇贝向外加了一圈描边。
2. **孔眼被涂实**：(5,3)(6,3)(5,4)(9,2)(10,2)(9,4)(10,4)(9,5)(10,5)(13,3)(14,3)(14,4) 本该是孔，现在是实心 `#d97fc6` → “洞洞都不镂空”。
3. **竖缝**：(0,1)(19,1) 及 (0,3)(19,3) 在平铺边界相邻 → 每 20px 一条短竖纹（R8.2“去竖缝”仍未满足）。

**修法规格（交实施者）**

- 改为真正的遮罩：布面形状 = alpha；孔眼 = 透明（建议每孔 ≥2×2 实像素，1× 下才看得见）；可直接用 `mask-image` + `background-color: var(--r8-lace-fill)`，或保持 background-image 但孔眼与外部一律透明。
- 描边 1px **只画在布面内侧**（布面最外一圈像素与孔眼周围一圈像素改描边色），布面外轮廓不得比现版 `o` 区域更大，孔眼不得被描边缩没。
- 描边色沿用现有描边色（用户称“肉粉”）；如需改为 `#F3ADD9` 另出一档对比。
- 布面填充继续 = 状态栏色 `#f9d1e7`；顶行与状态栏无缝；平铺边界不得出现竖纹；不加底线。
- 交付：现版 / 修正版（必要时 + `#F3ADD9` 描边版）1× 与 6× 放大对比，深色窗底与状态栏接缝都要出镜；**任意边 ≤2000px**（超了就重排或压缩）。

## 3. 设置齿轮图标怪（用户：图三）

**现状**：`original-assets/icons/src-hand/settings.svg`，16×16，`crispEdges`。形状为上/下/左/右四条 4px 直棒 + 中间不对称的“呼吸孔”（行 7-8 只有 x6 与 x9 两处 1px），没有斜向齿。实机 16px 下读起来像四叶草/花朵，不像齿轮。

**修法**：重画对称像素齿轮（建议 6–8 齿 + 方形轴孔，1px 深色描边），保持 16×16 网格；同步更新 `original-assets/icons/src`（如被引用）与 `dist/jirai-icons.css`；出 1×/4× 对照图，并确认 `--wd-icon-settings` / `--wd-native-settings` 两个变量都更新。

## 4. 标题栏品牌心（用户：更像素化、别纯黑、仿素材库风格画 9×9 / 7×7 / 5×5 三副）

**现状**：`runtime/window-chrome.css:257-269`，`.vrcx-0-brand::after` 用 `--jk-mask-s7-s`（`original-assets/src/s7-heart-12x12.svg`，一条平滑贝塞尔路径）配 `background-color: var(--jk-chrome-ink)`，而 `--jk-chrome-ink: #16112a`（window-chrome.css:22）几乎纯黑。`brand-heart-r9.css` 在 10/12/14px 之间切 `mask-size`，小尺寸下平滑路径被缩放 → 既不像素、又发黑。

**素材库可仿风格**

- `original-assets/r5/src/heart.svg`（NSO 粉心转写，30×29，深紫描边 `#34316a` + 粉体 + 白色高光，7 色）
- `original-assets/r5/src/heart-pair.svg`、`original-assets/src/s16-pixel-gem-heart-16x16.svg`、`s22-pixel-big-heart-outline-32x28.svg`、`s8-pixel-heart-body/highlight-12x8.svg`

**要求**：仿上述“1px 深色描边 + 主体色 + 左上高光”的像素画法，原生绘制三副 9×9、7×7、5×5 像素心（不是缩放同一张）；颜色不用纯黑（建议描边用深紫 `#4a2b45`/`#34316a`，主体用粉 `#ffb8e6`/`#ff7fcf`，高光 `#fdf4ff`）。三副对应现有 2.5s 五帧动画（小-小-中-大-中），并保持 reduced-motion 静态帧。

## 5. 隐私锁屏未覆盖（用户实机截图，R9.5）

来源：`/tmp/vrcx-win-src-r9/src/features/privacy-lock/`。覆盖率审计里本来就记着（`checks/r9-coverage-audit/coverage-table.md:197-198`，P2/G3），但 overlays-r10 没做到这块。

| 部件 | 源码 | 当前实机表现 | 状态 |
|------|------|--------------|------|
| 遮罩层 | `PrivacyLockOverlay.tsx:51` Backdrop `vrcx-0-app-overlay bg-background/60 backdrop-blur-lg`；Popup `[data-vrcx-0-surface="privacy-lock"]`（:53-55） | 后面的应用被毛玻璃糊掉，窗底透出一条粉色渐变（状态栏被模糊） | 未主题化（可选：改 Windose 网点/降模糊） |
| **锁屏卡** | `:134` `bg-popover/80 ring-1 ring-foreground/10 rounded-2xl p-6 shadow-lg max-w-xs`（启动错误卡 `:77` 同款，`max-w-sm`） | 半透明大圆角软卡，无标题栏、无斜面，与 Windose 窗口语言脱节 | **未覆盖（主项）** |
| 标题 | `:141` `DialogPrimitive.Title text-base font-medium`「已锁定」 | 普通无衬线字 | 未覆盖 |
| 头像 | `:135` `Avatar size-16`（无头像时 `LockIcon size-6` fallback） | 像素圆裁切已生效 | 已覆盖 |
| PIN 槽 | `LockCodeInput.tsx` → `InputOTPSlot size-10`，`data-slot="input-otp-slot"`，`data-active` | fields-toolbar-r10:83-87 已给深底+紫框+方角；激活态待实机确认 | 部分覆盖 |
| 忘记密码 | `:269` ghost link `text-muted-foreground h-auto p-0 text-xs` | 灰紫小字 | 可接受 |
| **状态灯** | `:149-157` `StatusDot`（`StatusBarParts.tsx:17-49`，`inline-block size-2 rounded-full bg-[var(--status-online)]`） | 圆形绿点；状态栏里的同一组件已被主题改成像素灯，但规则只限状态栏作用域 | **未覆盖** |
| 按钮 | `:159-` `Button variant="outline" size="sm"`「后台模式 / 退出登录」 | buttons-badges-r10 已部署，但看起来仍偏平 | 待确认 |
| 找回表单 | `RecoverForm` `:295-` `Input` + `Button w-full` | 未在截图中 | 待查 |
| 启动错误卡 | `:77` 同款圆角卡 + LockIcon + 重试按钮 | 未在截图中 | 未覆盖 |

**修法方向**：锁屏卡复用 login-r8 的 Windose 窗口卡语言（方角、斜面、1px 紫框、深底，可加粉色迷你标题条，不改宽度/间距）；标题像素字；锁屏内 StatusDot 改成与状态栏同款的像素方灯（只限 `[data-vrcx-0-surface="privacy-lock"]` 作用域）；PIN 槽激活态补粉框；遮罩毛玻璃可选替换为网点。不得改变 PIN 输入焦点/键盘行为与卡片尺寸。启动错误卡同步。

## 队列状态

| # | 事项 | 任务 | 负责 | 状态 |
|---|------|------|------|------|
| 1 | 猫猫头回归 → 恢复 Steam 18×18 | task-46 | pixel-transcriber | 进行中 |
| 2 | 底边蕾丝：真镂空遮罩 + 描边朝内 | task-47 | motion-designer | 进行中（规格已由用户澄清） |
| 3 | 设置齿轮重画 | task-48 | jirai-luna | 进行中 |
| 4 | 品牌心 9/7/5 三副 | task-49 | pixel-artist | 进行中（只写 original-assets/r9-heart/） |
| 5 | 隐私锁屏（卡片/状态灯/标题/PIN 激活态/启动错误卡） | task-50 | vscode-luna | 进行中 |

通用验收约束：所有对比图/截图任意一边 ≤2000px，超出必须重排或压缩后再交（Lead 无法读取超限图片）。

回归附注（2026-10-13 全量回归 bash-1818）：14 PASS / 3 SKIP / 1 FAIL —— `r8-bio-diff` 的“非 entity 弹窗 select”高度 20→19px，已查明不是 CSS 问题：任意节组合在新页面上都是 20px，只有在同一页面先测 BEFORE（换样式表 + fullPage 截图）后再测 AFTER 时才出现 19px。已把 `checks/r8-bio-diff/verify.mjs` 改为 AFTER 用全新页面并等待字体，连续两次 PASS。

集成：`data-surfaces-r10`（task-41，21647B）已接入 builder（buttons-badges-r10 之后）；Lead 交叉检查 16 个 fixture，`integratedVsMovedLast` 全 0，非 owner fixture 的 off 差异全 0。整包 1005563B，余 43013B。

前置说明：整包已用 977061B / 1048576B，仅余 71515B；以上四项中第 1 项会减体积，第 2、3、4 项是替换为主，预计净增很小，但仍需在实施前核算。
