# 独立验收：字体产物（fonts/）与 mockup 字体落地（windose-dark）

- 验收者：独立验收 Agent（非作者），只读核查
- 日期：2026-10-11
- 验收根：`/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme`
- 主应用（**严格只读**）：`/home/fulutang/Documents/Github/VRCX-0-jirai` —— 本次未运行 git、未构建、未修改
- 允许写入：仅本文件；其余全部只读
- 方法：二进制级复核（base64 解码往返 + sha256 + WOFF2 解析 + brotli 解压 + cmap/name/head/hmtx 表解析 + Silkscreen 原始 TTF 轮廓解析）
- **未做真实 WebView/WebView2 验证**：本报告所有结论均为静态/离线证据，不声称任何真机渲染结论（沿用作者在 `fonts/fonts-license.md:308-319` 的自我披露口径，并对其可核验部分逐条实测）

---

## 0. 结论摘要

| 维度 | 结论 |
|---|---|
| base64 ↔ woff2 文件一致性 | **PASS**（两条 data URI 解码往返 sha256 与文件逐字节一致） |
| `@font-face` 加载声明 | **PASS**（family / style / weight / display / format / MIME 全部正确；无 `unicode-range`，与文档声明一致） |
| 许可与随附 | **PASS（fonts/ 目录内）**；mockup 目录缺少 Silkscreen OFL 正文的**随附关系不明**（该副本存在但源文件为孤儿） |
| 字符覆盖说明（charset.txt / license §3.4） | **PASS**（1,655 / 1,642 / 缺 13 全部实测命中） |
| 字号推断（12px 网格、text-xs、zoom 非线性、行号引用） | **PASS 且可复核**；新增实测证据（见 §4） |
| `finish.css` 用户内容字体隔离 | **FAIL（P0/P1）**：白名单不完整，好友列表昵称+状态、房间/实例名落在中文像素字体上 |
| `finish.css` 全局污染 | **P0**：`body{font-synthesis:none}` 全文档继承；`body{font-family}` 覆盖面失控 |
| 全局像素字体是否真的生效 | **实测为「未生效」**：被 `windose-dark.css:31` 的 `font:` 简写覆盖 → 现行样式处于**双重失效不确定性**状态 |
| 家族名冲突 | **P1**：`mockups/windose-dark/font.css:2` 用同一族名 `"WD Pixel"` 内联**另一个** Silkscreen TTF，与 `fonts/fonts.css` 语义冲突 |

---

## 1. base64 ↔ 文件一致性（PASS，含实测哈希）

方法：正则提取 `base64,` 载荷 → `base64.b64decode` → sha256 → 与磁盘文件比对；并校验 WOFF2 magic。

| 产物 | 磁盘字节 | base64 字符数 | 解码字节 | sha256（解码后 == 磁盘） |
|---|---:|---:|---:|---|
| `fonts/silkscreen-ascii.woff2` | 1,696 | 2,264 | 1,696 | `3448405d1322380ce1c1356e3aef542fddb29439e675f066297f42c274060901` |
| `fonts/fusion-pixel-zh-subset.woff2` | 53,292 | 71,056 | 53,292 | `a8ef944072766421da2f22d73536935ac916f9cf0e7e493467bf5c4eb583aff5` |

- 两条载荷 magic 均为 `wOF2`，flavor 均为 `0x00010000`（TrueType）。
- WOFF2 头部自校验：Silkscreen `header.length=1696 == filesize`；Fusion `header.length=53292 == filesize`；`totalCompressedSize` 与实际压缩块长度一致（1,612 / 53,204）。
- 表目录解析（修正后）得到干净 14 表集合，无重复 tag、无越界：
  - Silkscreen：`GDEF GPOS GSUB OS/2 cmap gasp glyf head hhea hmtx loca maxp name post`
  - Fusion：`GPOS GSUB OS/2 cmap glyf head hhea hmtx loca maxp name post vhea vmtx`
- 与 `fonts/fonts-license.md:14-15` 声明的「字节 / base64 字节 / sha256 前 16」**逐项命中**（`fonts-license.md:14-16`）。
- `fonts/fonts-license.md:22` 声明「结构 = 73,320 B base64 + 1,571 B 骨架」：实测 `fonts.css` 74,891 字节，base64 合计 73,320 字符，骨架 1,571 字节 → **正好相等**。`fonts.css` 为 LF、结尾有换行。

> 备注（不影响 PASS）：`fonts-license.md:15` 把 2,264 写成「base64 字节」，实际是 base64 **字符**数；纯属措辞，数值正确。

---

## 2. `@font-face` 加载声明（PASS）

实测 `fonts/fonts.css:20-27`、`fonts/fonts.css:30-36`（文件仅 36 行，行 26/35 为超长 base64 行）：

| 项 | `"WD Pixel"` | `"WD Pixel CJK"` |
|---|---|---|
| `font-style` | normal | normal |
| `font-weight` | 400 | 400 |
| `font-display` | block | block |
| MIME | `font/woff2` | `font/woff2` |
| `format()` | `woff2` | `woff2` |
| `unicode-range` | **无** | **无** |

- 两处 `font-display: block` **确实内联在 `@font-face` 内**（`fonts/fonts.css:23`、`:33`），`fonts.css:14` 注释「font-display: block 已内置于下方声明」**成立**。
- `fonts.css:17` 注释「`@font-face` 的 src 里不能使用 var()」**成立**，且实现遵守（base64 为字面量）。
- 实测字体内部 `name` 表，族名与上游一致、无伪造：
  - Silkscreen：`nid=1 = 'Silkscreen'`、`nid=4 = 'Silkscreen Regular'`、`nid=6 = 'Silkscreen-Regular'`、`nid=3 = '1.001;UNKN;Silkscreen-Regular'`，7 条 record，`OS/2 usWeightClass=400`、`post ver 3.0`、`unitsPerEm=1000`、`numGlyphs=100`。
  - Fusion：`nid=1 = 'Fusion Pixel 12px Prop zh-Hans'`、`nid=3 = 'Fusion-Pixel-12px-Prop-zh-Hans-Regular;2026.09.25'`，`OS/2 usWeightClass=400`、`post ver 3.0`、`unitsPerEm=1200`、`numGlyphs=1643`。
- 两个子集**都保留 `name` 表**（未 strip），这既是可追溯性的优点，也意味着被改名的风险不存在（族名仍指向上游）。

**注意（应修，见 P3）**：`fonts.css:2-19` 的用法注释要求栈顺序 `"WD Pixel", "WD Pixel CJK", …`，而 mockup 的 `finish.css:3` 只写了 `"WD Pixel CJK"` —— 见 §6.5。

---

## 3. 字符覆盖说明（PASS，实测复核）

方法与结果：

| 检查 | 声明出处 | 实测 | 判定 |
|---|---|---|---|
| `charset.txt` 有效字符 | `fonts-license.md:17`（1,655） | 1,655（去换行后逐字符计数；唯一码点也是 1,655，无重复） | PASS |
| 汉字数 | `fonts-license.md:79`（1,283） | 1,283（`U+4E00–U+9FFF`） | PASS |
| 按码点升序 | `fonts-license.md:95` | True | PASS |
| 每行 64 字符 | `fonts-license.md:95` | 行 2 为 63（首行首个字符是 `U+0020`，行长统计口径差异），行 3–25 为 64，行 26 为 56，首尾各一空行 | **措辞需微调**（见 P2-2） |
| Fusion 命中 | `fonts-license.md:103`（1,642） | 1,642 | PASS |
| Fusion 缺字 13 个 | `fonts-license.md:103` 列出 `‹ › € √ ∞ ≈ ≠ ≤ ≥ ✓ ✔ ✕ ✗` | 完全一致，一字不差：`U+2039 U+203A U+20AC U+221A U+221E U+2248 U+2260 U+2264 U+2265 U+2713 U+2714 U+2715 U+2717` | PASS |
| Fusion「cmap 本就不含，非子集化造成」 | `fonts-license.md:106` | 无法离线证否（需上游 TTF `fusion-pixel-12px-proportional-zh_hans.ttf`，未随产物分发；`/tmp` 源物已不在） | **未复核（作者声明，接受）** |
| Silkscreen 命中 144 / ASCII 全中 | `fonts-license.md:104`（§3.4 覆盖率表，行 99–106） | cmap 实测 **95** 码点（`pid=0,eid=3,fmt4` 与 `pid=3,eid=1,fmt4` 各 95），且 `U+0020–U+007E` 全中、无缺。`fonts-license.md:127-128` 的生成命令是 `--unicodes=U+0020-007E`（95 码点），而 `fonts-license.md:79` 已说这个子集是「ASCII U+0020–U+007E，95 个」→ **144 与本文档自身口径矛盾，且与产物不符**（见 P1-6） | **FAIL（数字错误）** |
| 子集后 `unitsPerEm` / `numGlyphs` | `fonts-license.md:141-143`（1,642 / 1,643 / 1,200 / 1,000） | Fusion cmap 1,642 码点、maxp `numGlyphs=1643`、`unitsPerEm=1200`；Silkscreen cmap 95、`numGlyphs=100`、`unitsPerEm=1000` | PASS |
| Fusion 缺字在 mockup 中的实际影响面 | — | 见 §6.2（`‹›` 与 `✓✔✕✗` 是**用户昵称常用符号**，缺字会回退系统字体） | 见 P4 |

**离线复核替代**：为补上「上游 cmap 是否本就不含这 13 个符号」，可用上游 release 的 TTF 直接跑 `getBestCmap()`；本次环境不可得（`/tmp/pixfont/` 已不存在），故该条**保持作者声明的未复核状态**，不计入阻塞。

---

## 4. 字号推断（PASS，并新增可复现实测证据）

### 4.1 主应用侧引用全部可复核

逐行读 `.dsh` 允许的只读路径，`fonts-license.md:169-232` 的引用**全部命中**：

| 声明处 | 引用 | 实测 |
|---|---|---|
| `fonts-license.md:171` | `src/styles/globals.css:453` | 命中：`--font-sans: var(--vrcx-app-font-family, 'Geist Variable', sans-serif);` |
| `fonts-license.md:172` | `globals.css:562` | 命中：`font-family: var(--vrcx-app-font-family, system-ui);` |
| `fonts-license.md:173` | `globals.css:566-568` | 命中：`html { @apply font-sans; }` |
| `fonts-license.md:174` | `themeService.ts:403`、`:430` | 命中：两处 `'--vrcx-app-font-family',`（`setProperty` 调用的参数行） |
| `fonts-license.md:189` | `themeService.ts:512` | 命中：`await tauriClient.webview.setZoom(Math.pow(1.2, numericZoom / 10 - 10));` |
| `fonts-license.md:190` | `platform/tauri/webview.ts:124-130` | 命中：`setZoom()` 内部 `current.setZoom(zoom)` |
| `fonts-license.md:191` | `shared/constants/themes.ts:131,133,135,137` | 命中：`100 / 30 / 300 / 5` |
| `fonts-license.md:192` | `repositories/configKeys.ts:68`、`:343` | 命中：`ZoomLevel: { type: 'int', default: 100 }`、`zoomLevel: 'VRCX_ZoomLevel'` |
| `fonts-license.md:182` | `community-theme/styleLayers.ts:15-21` | 命中：`setVrcxCssLayers({...})` |
| `fonts-license.md:182` | `vrcx0CssLayerService.ts:44-54` | 命中：`document.createElement('style')` + `setAttribute(...)` + `head.appendChild` |
| `fonts-license.md:221` | `tailwindcss/theme.css:347-350` | 命中：`--text-xs: 0.75rem` / `--text-xs--line-height: calc(1 / 0.75)` / `--text-sm: 0.875rem` / `--text-sm--line-height: calc(1.25 / 0.875)` |
| `fonts-license.md:223-224` | `text-xs` 601 / `text-sm` 486 | 复测 `grep -ro` 命中 **601 / 486**，完全一致 |
| `fonts-license.md:225` | `10px` 39 / `11px` 32 / `13px` 5 | 复测命中 **39 / 32 / 5**，一致 |
| `fonts-license.md:180` | 全仓无 `--vrcx-app-font-size` | 复测 `grep -rn "app-font-size" src` → 无匹配，成立 |
| `fonts-license.md:227` | `StatusBarFooter.tsx:355`、`:373` 为 `text-xs` | 命中：`:355` 为 `'vrcx-0-statusbar flex h-8 shrink-0 items-center border-t px-2 text-xs'`；`:373` 为 `'vrcx-0-statusbar @container/statusbar text-xs backdrop-blur'` |

**12px 网格结论成立**：`1rem = 16px`（无全局 font-size 覆写）→ `text-xs = 0.75 × 16 = 12px`，行高 `12 × 1.3333 = 16px`（整数）。`fonts-license.md:229` 的数字正确。

### 4.2 新增实测：Fusion 的「12px 点阵」是硬事实，Silkscreen 的不是

这是本次验收新增的直接证据（此前只有「坐标 GCD = 100」的口头结论）：

| 证据 | Fusion 12px zh_hans 子集 | Silkscreen ASCII 子集 |
|---|---|---|
| `unitsPerEm` | **1200** | 1000 |
| **全部 1643 个 `advanceWidth` 的 GCD** | **100** | 125 |
| 非 100 倍数的 advanceWidth | **一个都没有** | `375 / 625 / 750 / 875 / 1125 / 1250` 等大量存在 |
| `head` 边界框 `(xMin,yMin,xMax,yMax)` | `(0, -300, 2800, 1300)` → **全部 100 的倍数** | `(-187, -250, 1125, 1000)` → **非 100 倍数** |
| 最宽字形占比 | `1200`（= 12px 满宽）出现 **1,516** 次 / 1,643 | `750` 出现 42 次 |
| 设计网格换算 | 100 units = 1.000 px @12px → **整数像素网格** | 125 units = **1.500 px** @12px；且 `head` bbox 含 187 units = 2.244 px → **亚像素** |
| 直读 Silkscreen 原始 TTF（mockup `font.css` 内联的 32,220 B 完整 TTF，228 字形） | — | 直线字形坐标 GCD = **125**，圆角字形（o/0 等）= **5** |

→ 印证 `fonts-license.md:39`（Fusion `unitsPerEm=1200`，轮廓 GCD 100，严格 12px 网格）与 `fonts-license.md:50`（Silkscreen `unitsPerEm=1000`；直线字形 GCD 125，圆角字形 GCD 5，**非严格点阵**）。**两条声明均为真，且 Silkscreen 那条是「不利结论」，作者如实写了。**

### 4.3 zoom 映射

`zoom = 1.2^(v/10 − 10)`（`themeService.ts:512`）为**字面复核**：
- `v=100 → 1.0`；`v=110 → 1.2`；`v=120 → 1.44`；`v=90 → 0.833`；`v=300 → 1.2^20 ≈ 38.34`。
- `fonts-license.md:200-209` 的表格数值全部正确（含 `105% ≈ 1.095`、`125% ≈ 1.577`、`80% ≈ 0.694`）。
- `fonts-license.md:211` 「显示百分比 ≠ 实际倍率」的警告**成立且重要**。
- `fonts-license.md:213` 的机理说明（page zoom 等价改变有效 devicePixelRatio）与 `fonts-license.md:252` 引用的 `webview.ts:132-146 getScaleFactor` 均命中实际代码。

---

## 5. 许可与合规（fonts/ 内 PASS；有一处随附关系问题）

| 检查 | 实测 |
|---|---|
| 两份 OFL 原文存在 | `fonts/OFL-Fusion-Pixel.txt`（4,418 B，sha256 `bc518cf64b8032c0…`）、`fonts/OFL-Silkscreen.txt`（4,394 B，sha256 `86c5e9c9382cdcc5…`） |
| `fonts-license.md:62` 声称 Fusion OFL 与上游 `master:LICENSE-OFL` 逐字节一致 | 无法联网比对上游（未 fetch），**未复核**；文件本身 sha256 与文档表格一致，PASS（自洽） |
| Reserved Font Name | 实测两份 OFL：`Reserved Font Name` 仅出现在条款定义段（Fusion 行 36–37；Silkscreen 行 33–34），**版权声明行后无 RFN 列表** → `fonts-license.md:59` 的推断**成立** |
| 版权行 | Fusion 行 4：`Copyright (c) 2022, TakWolf (https://takwolf.com).`；Silkscreen 行 1：`Copyright 2001 The Silkscreen Project Authors (https://github.com/googlefonts/silkscreen)` —— 与 `fonts-license.md:37`、`:49` 一致 |
| 自定义族名规避名称歧义 | `fonts.css` 用 `"WD Pixel"` / `"WD Pixel CJK"`，与字体内部 `name` 表族名不同 → `fonts-license.md:60` 成立 |
| **随附许可副本** | `fonts/` 目录内齐备 ✅。`mockups/windose-dark/Silkscreen-OFL.txt` 与 `fonts/OFL-Silkscreen.txt` **sha256 完全相同**（`86c5e9c9382cdcc5…`），是重复副本 ✅。**但 `mockups/windose-dark/font.css` 内联了完整 Silkscreen TTF 全文却未在自身附近随附许可**（见 P7） |

---

## 6. `mockups/windose-dark/finish.css` 专项：中文像素字体是否误用、是否有全局污染

### 6.0 先厘清一个被忽略的事实：全局像素字体**当前并未生效**

```css
/* mockups/windose-dark/windose-dark.css:27 */
--font: "Noto Sans CJK SC", "Noto Sans SC", "Segoe UI", system-ui, sans-serif;
/* mockups/windose-dark/windose-dark.css:31 */
body { margin: 0; background: #0c0816; color: var(--wd-text); font: 13px/1.45 var(--font); }

/* mockups/windose-dark/finish.css:3 */
body { font-family: "WD Pixel CJK", sans-serif; font-synthesis: none; }
```

- `font:` **简写**会重置 `font-size` / `line-height` / `font-family` / `font-style` / `font-weight` / `font-variant`。`fontSize: 13px` 由简写声明，**不是**继承值。
- 两条规则选择器特异性**完全相同**（都是 `body`，`0,0,0,1`）。
- 层叠决胜于**源顺序**：`index.html:7` 先加载 `windose-dark.css`，`index.html:15` 后加载 `finish.css` → 同为「未分层 + 同特异性」时**后者胜**。
- 因此：`body` 上 `font-family` 确实被换成 `"WD Pixel CJK"`，但 **`font-size` 与 `line-height` 保持 13px / 1.45**（简写中的 size 未被覆盖，因为 `finish.css` 没有重设）。
- 于是**全局正文是 13px 的中文像素字体** —— 恰好落在 `fonts-license.md:233` 自己的实测结论「Fusion 12px 在 13px = 74.3% 半灰（明显发糊）」上。

**这是本 mockup 最实质的视觉缺陷，也证明「全局字体方案」不是为了美观，而是未验证的遗留。**

### 6.1 【P0】`finish.css:3` 全局 `body` 换字体 + 全局 `font-synthesis: none`

```css
finish.css:3  body { font-family: "WD Pixel CJK", sans-serif; font-synthesis: none; }
finish.css:5  .who, .meta .n, .udlg .nm, .table .sub, .ucard .cb { font-family: sans-serif; }
finish.css:6  .nav, .toolbar, .ghead, .ct, .statusbar, .udlg .tabs { font-size: 12px; }
```

三个独立问题：

1. **`font-family` 覆盖面失控**：`body` 命中**所有**后代元素（除被 L5 与 `pixel.css:25-26` 显式接管者）。中文像素字体子集只含 1,643 码点，任何未覆盖字符（生僻汉字、日文假名、颜文字、`✓✔✕✗‹›€√∞≈≠≤≥`）都会**逐字回退**系统字体，产生「同一句里两种字体、两种基线宽度」的断裂。
2. **`font-synthesis: none` 被全文档继承**（`font-synthesis` 是继承属性）：`pixel.css:26` 只管到 9 个像素元素；而 `windose-dark.css:104`（`.table thead th { font-weight: 600 }`）、`layout.css:82`（`.udlg .nm { font-weight: 700 }`）、`layout.css:68`（`.rail .num { font-weight: 700 }`）、`windose-dark.css:86`（`.nav .badge { font-weight: 700 }`）、`windose-dark.css:127`（`.profile .name { font-size: 17px; font-weight: 700 }`）等都依赖**合成加粗**。全局 `font-synthesis: none` 会让这些**静默失去字重**。这一条与 `fonts-license.md:260-263`（办法 E）的**初衷相反**：作者要的是「在应用像素字体的作用域内」加，不是全局加。
3. **`font-size: 12px` 覆盖了设计稿既有的 `<12px` 分级**：`layout.css:21-22`（`.nav .chev` / `.nav .kbd` = 10px）、`layout.css:68`（`.rail .num` = 9px）、`windose-dark.css:86`（`.nav .badge` = 11px）、`windose-dark.css:78`（`.nav .grp` = 11px）、`layout.css:113`（`.toolbar .input.search .date` = 11px）、`layout.css:58`（`.ghead.room` = 11px）全部被 `finish.css:6` 拉到 12px（L6 的 `.nav` / `.toolbar` / `.ghead` 是这些元素的祖先/同族选择器）。
   - 静态可判定的直接后果：这些元素的中文像素字体**从「设计上就不锐利」变成「按 12px 网格渲染」**（就 Fusion 而言，12px 反而是对的，所以这条**对中文是改善**）。
   - **需实测确认**的风险（本条不声称已验证）：`.nav .badge` 是 `min-width:18px; padding:0 5px`、`.rail .num` 是 `position:absolute; padding:0 2px; font-weight:700`，字号由 9–11px 变 12px 会改变实际占位；`layout.css:34`（`.table thead th { height: 32px }`）、`layout.css:92`（`.ucard .ct { height: 22px }`）是固定盒高，垂直居中是否溢出需浏览器实测。**本环境无浏览器二进制，故未实测。**

### 6.2 【P1】用户内容误用中文像素字体 —— 白名单确实漏了

`index.html` 中**用户生成内容**的落点（实测 DOM 与数据）：

| 用户内容 | DOM 出处 | `finish.css:5` 是否排除 | 实际生效字体 |
|---|---|---|---|
| 好友动态表：昵称 | `index.html:165` `<td><div class="who">…${r[1]}</div></td>` | ✅ `.who` | sans-serif ✅ |
| 好友动态表：事件/位置文本 | `index.html:165` `<td class="sub">${r[3]}</td>` | ✅ `.table .sub` | sans-serif ✅ |
| 好友动态表：时间 | `index.html:164` `<td class="time">` | ❌ 不在白名单 | **`pixel.css:25-26` → "WD Pixel"（Silkscreen，11/12px）**—— 时间戳可接受 |
| 好友列表：昵称 | `index.html:181` `<div class="meta"><div class="n">${x[1]}</div>` | ❌ **未排除** | **"WD Pixel CJK" 像素字体** ← **BUG** |
| 好友列表：状态/签名 | `index.html:181` `<div class="s">${x[2]}</div>`（如「今天也在摸鱼」「欢迎加入 · 某个世界」） | ❌ **未排除** | **"WD Pixel CJK" 像素字体** ← **BUG** |
| `selfrow` 自己：昵称+签名+位置 | `index.html:176` `<div class="meta"><div class="n">Me_A</div><div class="s">今天也在摸鱼</div><div class="s">某个世界</div>` | ❌ **未排除** | **"WD Pixel CJK" 像素字体** ← **BUG** |
| 分组房间/实例名 | `index.html:179-180` `<div class="ghead room">${x[1]}</div>`（如「某个世界 #12345」） | ❌ **未排除** | **"WD Pixel CJK" 像素字体** ← **BUG** |
| 群/世界计数（数字） | `index.html:179` `<span class="cnt">${x[2]}</span>` | ❌ | CJK 像素（数字可接受） |
| 用户详情：昵称 | `index.html:103` `<div class="nm"><b class="d"></b>Friend_B</div>` | ✅ `.udlg .nm` | sans-serif ✅ |
| 用户详情：简介/当前状态 | `index.html:111` `.ucard .cb`（「欢迎加入 · 某个世界 #12345」） | ✅ `.ucard .cb` | sans-serif ✅ |
| 用户详情：资料字段值 | `index.html:113` `.ucard .cb`（「某个模型 / 某个世界 / usr_xxxx…xxxx」） | ✅（同一个 `.cb`） | sans-serif ✅ |
| banner 占位文案 | `index.html:99` `.banner .ph`「用户横幅图片（此处为匿名占位）」 | ❌ 不在白名单 | **像素字体**（原型占位，可接受但应记一笔） |

**结论：`finish.css:5` 的「保留可读的用户内容」白名单是「列举式」的，漏了 `.frow .meta .n` / `.frow .meta .s` / `.selfrow .meta .n` / `.selfrow .meta .s` / `.ghead.room`。**
其中 `.meta .n` **看似**被 `finish.css:5` 覆盖 —— 但 L5 写的是 `.meta .n`，它是**后代选择器**，能命中 `.frow .meta .n`（`index.html:181`）✅。**真正漏的是 `.meta .s`**（L5 只写了 `.meta .n`，没写 `.meta .s`）→ 好友的状态/签名/位置（**中文长句**）落在像素字体上。这是最典型的一处。

> 精确修正：误用面 = `.meta .s`（好友列表 + selfrow 的状态/签名/位置，`index.html:176`、`:181`）× 4 处 + `.ghead.room`（`index.html:180`）+ `.banner .ph`（`index.html:99`）。

**根本病因不是「漏写一个选择器」，而是架构方向错了**：现在是「全局像素字体 + 黑名单排除用户内容」，正确方向是「**默认系统字体 + 白名单只给 UI chrome 上像素字体**」。后者失败时只是少几处像素风；前者失败时会污染用户数据可读性——作者自己在 `fonts-license.md:270-271`（§5.5 综合建议 1、2）给出的结论正是这个方向：「只对 UI chrome（菜单、状态栏、侧栏、标签、元信息）应用像素字体」「用户生成内容（昵称、聊天、世界名、群名）保留系统字体」，且 `fonts-license.md:272` 还要求「加上 `font-synthesis: none;` 并显式写 `font-size: 12px; line-height: 16px;`」。`finish.css:3` 与这两条**都相反**（全局换字体、全局 `font-synthesis`、且未钉住 12px/16px）。

### 6.3 【P1】`finish.css` 未落实自家 `fonts.css` 的栈顺序（拉丁被中文子集吃掉）

- `fonts/fonts.css:11-12` 明确：「用法（顺序不可颠倒，拉丁在前保证 ASCII 走 Silkscreen）」→ `font-family: "WD Pixel", "WD Pixel CJK", …`。
- `fonts/fonts-license.md:294-297` 同样要求拉丁在前。
- 但 `finish.css:3` 只写 `font-family: "WD Pixel CJK", sans-serif;`。**而 Fusion 子集本身包含完整 ASCII（实测 `U+0020–U+007E` 全中，95 码点）**，因此 `finish.css` 覆盖到的所有英文/数字都会用 **Fusion** 渲染，`"WD Pixel"`（Silkscreen）**只在 `pixel.css:25-26` 的 9 个选择器上生效**。
- 后果：同一界面里「导航徽章 3」是 Silkscreen（`pixel.css:25` 命中 `.nav .badge`，但被 §6.1 的 `finish.css:6` 改成 12px），而标题栏大标题、卡片英文标题是 Fusion —— **两种像素字体混排**，正是 `fonts-license.md:239` 担心的「风格割裂」，只是原因不同。

### 6.4 【P2】mockup 内联了**另一份** Silkscreen TTF，且族名完全相同

- `mockups/windose-dark/font.css`（43,241 B，仅 4 行）只有 **1 条真正的 `@font-face` 规则**（字符串 `@font-face` 出现 2 次，另 1 次在行 1 的注释里）：
  - `font-family: "WD Pixel"`，`url(data:font/ttf;base64,…)`，**`format("truetype")`**，载荷解码 **32,220 B**，sha256 前 16 = `c845473330b94c20`，magic `\x00\x01\x00\x00`（**未子集化的完整 Silkscreen Regular TTF**，228 字形，含 `cvt/`/`fpgm`/`prep` 全套 hinting）。
- 而 `fonts/fonts.css:21` 的 `"WD Pixel"` 是 **`format("woff2")`、1,696 B 子集**。
- **两个文件用了同一个族名 `"WD Pixel"，但指向两个不同的二进制** → 语义冲突；若两者同时被加载，谁生效取决于顺序/格式优先级，属于**不确定性来源**。
- 好消息：`grep -rn "font\.css"` 全库无任何引用，`index.html:6-15` 的 `<link>` 列表里**没有** `font.css`。它是一个**孤儿文件**（43 KB 死重量 + 一个错误声明）。
- `font.css` 头部注释自称 “Silkscreen, SIL OFL 1.1 (google/fonts) - full TTF inlined for the mockup only”，**声明了许可但未随附文本**（同目录的 `Silkscreen-OFL.txt` 恰好是那份副本，但关系未写明，且与 `fonts/OFL-Silkscreen.txt` 重复）。

### 6.5 【建议】其余全局面

- `windose-dark.css:30` `* { box-sizing: border-box; }` —— 广泛但无害（原型常态）。
- `finish.css:38` `@media(prefers-reduced-motion:reduce){ *,*::before,*::after { animation:none!important; transition:none!important } }` —— **仅在该媒体查询内生效**，且 `extras.css:51` 已用 `!important` 局部禁用动画；作为无障碍规则可接受，但若整体搬运到真实主题，`*` + `!important` 会屏蔽主题自身需要的过渡，建议收窄到 `.app` 子树。
- `pixel.css:4/12-14` 的 `!important`（`.av`/`.av36`/`.av40`/`.bigav` 的 `border-radius`/`box-shadow`、`.avwrap .sd` 的尺寸）—— 头像改造必需，且限定在头像类上，**可接受**。
- `finish.css` 依赖的变量实测**全部存在**：`--wd-square` 在 `windose-dark.css:13`；`--jk-mask-s15/s16/s22/s23/s24/s27` 全部在 `original-assets/dist/jirai-assets.css`（`index.html:6` 加载）中定义 ✅ —— 无未定义变量风险。

---

## 7. 问题清单（按严重度）

### 阻塞（必须修，否则不可进入真实主题落地）

| ID | 问题 | 证据 | 建议修复 |
|---|---|---|---|
| **P0-1** | `finish.css:3` 对 `body` 全局设像素字体，导致**未覆盖的用户中文内容**（`.meta .s` 等）落入 1,643 码点子集，缺字逐字回退 → 同段混排断裂 | `finish.css:3`、`:5`；`index.html:176`、`:181`、`:180`；实测 cmap 仅 1,642 码点、缺 13 符号 | 改为反向作用域：删除 `body` 上的 `font-family`，把 `"WD Pixel", "WD Pixel CJK"` 只加到明确的 UI chrome 选择器（`.nav`、`.toolbar`、`.ghead`、`.ct`、`.statusbar`、`.udlg .tabs`、`.win > .wt .lbl`、`.titlebar .brand`）；用户内容选择器（`.who`、`.meta .n`、`.meta .s`、`.udlg .nm`、`.ucard .cb`、`.ghead.room`、`.table .sub`）**不写**字体即自动继承系统字体 |
| **P0-2** | `finish.css:3` 的 `font-synthesis: none` **继承全文档**，静默抹掉 `.table thead th`(600)、`.udlg .nm`(700)、`.rail .num`(700)、`.nav .badge`(700) 等的加粗 | `finish.css:3`；`windose-dark.css:104`、`layout.css:82`、`layout.css:68`、`windose-dark.css:86` | 从 `body` 移除；只写在真正使用像素字体的选择器组上（即 P0-1 修复后的那个列表） |
| **P0-3** | 全局正文为 **13px + 中文像素字体**（`body` 的 `font-size:13px` 唯一来源是 `windose-dark.css:31` 的 `font:` 简写，`finish.css` 未覆盖 size；`font-family` 由 `finish.css:3` 换成像素字体）——按级联静态判定如此，**未实机复核**；而作者自己的实测结论是 13px 下 Fusion **74.3% 半灰 = 发糊** | `windose-dark.css:27`、`:31`；`finish.css:3`；`fonts-license.md:233` | 明确二选一：① 只在 12px 区域用像素字体（`fonts-license.md:235-239` 办法 A）；② 若要全局，必须同时把 `body` 字号钉到 12px 并**逐屏回归行高**（办法 B，风险高）。当前是两者都没做 |

### 应修（影响正确性/可维护性，不阻塞但不可带入发布）

| ID | 问题 | 证据 | 建议修复 |
|---|---|---|---|
| **P1-1** | 好友列表的**状态/签名/位置**（中文长句，用户生成）被设为像素字体 | `finish.css:5` 只排除 `.meta .n`，未排除 `.meta .s`；`index.html:176`、`:181` | 白名单补 `.meta .s`；更稳的是按 P0-1 反转为白名单模式 |
| **P1-2** | 房间/实例名被设为像素字体 | `finish.css:5` 无 `.ghead.room`；`index.html:180` | 同上 |
| **P1-3** | 未落实自家 `fonts.css:11-12` 的栈顺序，`"WD Pixel"`（Silkscreen）几乎不生效，英文由 Fusion 渲染 → 两种像素字体混排 | `finish.css:3` 只写 `"WD Pixel CJK"`；`fonts/fonts.css:11-12`、`fonts-license.md:294-297`；实测 Fusion 含完整 ASCII | 按文档顺序写 `"WD Pixel", "WD Pixel CJK", …`，或在 `unicode-range` 层面分工（见 P2-1） |
| **P1-4** | `finish.css:6` 把 9/10/11px 的分级统一拉成 12px，**可能**改变元素占位并影响固定盒高（`.nav .badge`、`.rail .num`、`.table thead th` 32px、`.ucard .ct` 22px）——占位影响需浏览器实测，本条未实测 | `finish.css:6`；`layout.css:21-22`、`:58`、`:68`、`:113`；`windose-dark.css:78`、`:86`；`layout.css:34`、`:92` | 逐元素确认目标字号，不要用 `.nav` / `.toolbar` / `.ghead` 这类祖先选择器群改 font-size；改动后按 §6.1-3 的盒子清单逐屏回归 |
| **P1-5** | 孤儿文件 `mockups/windose-dark/font.css` 用**同族名**内联**另一个** Silkscreen TTF（未子集化、带 hinting、43 KB） | 该文件唯一 `@font-face`：`format("truetype")`、32,220 B、sha256 `c845473330b94c20…`；对比 `fonts/fonts.css:21` 的 woff2 1,696 B；全库无引用 | 删除该文件；若确需保留原型用拉丁字体，改族名为 `"WD Pixel Proto"` 并在 PR 中说明 |
| **P1-6** | Silkscreen「命中 144」与实测 **95** 不符，且与同文档另外两处口径自相矛盾 | 实测 cmap：`pid0/eid3` 95、`pid3/eid1` 95，union 95；`fonts-license.md:104`（覆盖表写 144）、`:79`（写「ASCII `U+0020–U+007E` 95」）、`:127-128`（生成命令 `--unicodes=U+0020-007E`，即 95 码点） | 把 `fonts-license.md:104` 的 144 改为 **95**；顺带核对同表「缺字 1,511」应改为 **1,560**（1,655 − 95） |

### 建议（改进项，可不改）

| ID | 建议 | 依据 |
|---|---|---|
| **P2-1** | 给两条 `@font-face` 加 `unicode-range`：`"WD Pixel"` 限 `U+0020-007E`，`"WD Pixel CJK"` 限 `U+2E80-9FFF,U+F900-FAFF,U+FF00-FFEF,U+3000-303F` 等 | `fonts-license.md:304` 明确说「未加，若要与系统字体分区共存可另行添加」。加了之后**即使误用全局也不会串字体**，是比白名单更硬的隔离 |
| **P2-2** | 把 `fonts-license.md:95`「每行 64 个字符」改为「除首尾空行外，行 3–25 为 64 字符，行 2 为 63（含前导 `U+0020`），行 26 为 56」 | 实测行长分布 `[0,63,64×23,56,0]` |
| **P2-3** | 明确 `finish.css` 是原型、且**当前 `body` 字体实际被 `windose-dark.css:31` 的 `font:` 简写争夺**（源顺序决定），在 `index.html` 或注释里标注「此原型不验证字号方案」 | `windose-dark.css:31` vs `finish.css:3`，同特异性 → 后者胜；但 `font-size` 仍为 13px |
| **P2-4** | 补 `.banner .ph`（`index.html:99`）到系统字体范围 | 该处是占位说明文案，非 chrome |
| **P2-5** | `finish.css:38` 的 `*` + `!important` 收窄到 `.app` 子树 | 搬运到真实主题会屏蔽主题自身过渡 |
| **P2-6** | `fonts-license.md:106`「缺的 13 个符号在上游 Fusion cmap 里本就不存在」需补一次可复现证据（对上游 TTF 跑 `getBestCmap()` 并存 json） | 本次无法离线复核（`/tmp/pixfont/` 已不存在） |

---

## 8. 给 Leader 的明确验收条件

**必须全部满足才算通过：**

1. **字体产物本身**（`fonts/`）：无需改动。以下 4 条已实测 PASS，可作为验收基线，任何人改 `fonts.css` 后必须重跑：
   - `sha256(base64_decode(fonts.css 第 n 条 data URI)) == sha256(fonts/*.woff2)`（两条）
   - `fonts.css` 骨架 1,571 B、base64 合计 73,320 字符、总 74,891 B
   - 每条 `@font-face` 必含 `font-style/style/weight/display` + `format("woff2")` + MIME `font/woff2`
   - Fusion cmap 码点数 == 1,642；Silkscreen == 95（**不是 144**）
2. **`finish.css` 三项硬性条件**：
   - (a) `body` 上**不再有** `font-family`（用 `grep -n "^body" finish.css` 验证）；
   - (b) `body` 上**不再有** `font-synthesis`（同上）；
   - (c) 在 `index.html` 的 `.frow .meta .s`、`.selfrow .meta .s`、`.ghead.room` 三处元素上，计算样式 `font-family` **不含** `"WD Pixel"` 与 `"WD Pixel CJK"`。
     > **本条本次未执行**：本环境有 `playwright` 包（`/tmp/dsh-theme-tools/node_modules/playwright`）但**没有任何浏览器二进制**（`~/.cache/ms-playwright` 为空，无 `chromium`/`google-chrome`），故 (c) 只能由 Leader 在具备浏览器/DevTools 的环境复核。**这不是 WebView 验证，也不得被表述为 WebView 验证**——用本地 Chromium 算计算样式即可。
3. **不得存在同族名双定义**：`grep -rn "font-family" mockups/windose-dark/*.css` 结果中，`"WD Pixel"` 只允许来自 `../../fonts/fonts.css`；`mockups/windose-dark/font.css` 必须删除或改名。
4. **字号一致性**：修改后 `windose-dark.css` 中所有 `font-size` 与 `finish.css` 不再互相矛盾（重点核对 `.nav .chev/.kbd` 10px、`.rail .num` 9px、`.nav .badge` 11px、`.ghead.room` 11px 是否被 12px 覆盖，以及盒子高度是否溢出）。
5. **文档一致性**：`fonts-license.md:104` 的「144」改为 95；`fonts-license.md:95` 的行长措辞修正。
6. **不得声称的结论**：本次及后续均**不得**把「`document.fonts.loaded` 为真」「Chromium headless 截图好看」当作「WebView2 实机清晰度验证」。截图脚本 `mockups/windose-dark/capture.mjs:4` 用的是 Playwright + 本地 Chromium（`/tmp/dsh-theme-tools/...`），`capture.mjs:12` 且设了 `deviceScaleFactor: 1.25` —— 那不是 dpr 1.0，也不是 Windows WebView2，更不是 12px 整数网格下的真实观感。

**已 PASS、不必返工的部分**：base64↔文件一致性、`@font-face` 声明完整性、许可文本与 RFN 判定、`charset.txt` 构成与覆盖率、缺字 13 与文档逐字相符、字号推断的全部源码行号引用、`zoom` 映射公式与数值表、Fusion 的 100 单位像素网格（本次以 `advanceWidth` GCD 全为 100 与 `head` bbox 全为 100 倍数**硬证实**）。

---

## 9. 复现命令（供 Leader 复核）

```bash
# 1) base64 ↔ 文件一致性
cd design-specs/jirai-kei-theme/fonts
python3 - <<'EOF'
import re,base64,hashlib,os
css=open('fonts.css',encoding='utf-8').read()
files=['silkscreen-ascii.woff2','fusion-pixel-zh-subset.woff2']
for i,b in enumerate(re.findall(r'base64,([A-Za-z0-9+/=]+)',css)):
    d=base64.b64decode(b)
    print(len(b),len(d),hashlib.sha256(d).hexdigest(),hashlib.sha256(open(files[i],'rb').read()).hexdigest())
EOF

# 2) 结构声明
python3 -c "
import re;c=open('fonts.css',encoding='utf-8').read()
b=sum(len(x) for x in re.findall(r'base64,([A-Za-z0-9+/=]+)',c))
print('total',len(c.encode()),'b64',b,'skeleton',len(c.encode())-b)"

# 3) finish.css 全局污染面
cd ../mockups/windose-dark
grep -n "^body\|font-synthesis\|font-family" finish.css windose-dark.css pixel.css
grep -n "\.meta \.s\|ghead\.room\|banner \.ph" finish.css index.html

# 4) 孤儿/冲突文件
grep -rn "font\.css" . | grep -v node_modules   # 期望：无输出
python3 -c "
import re,base64;c=open('font.css',encoding='utf-8').read()
m=re.search(r'base64,([A-Za-z0-9+/=]+)',c);d=base64.b64decode(m.group(1))
print('family',re.search(r'font-family:\s*\"([^\"]+)',c).group(1),'bytes',len(d),'fmt',re.search(r'format\(.(\w+)',c).group(1))"

# 5) 用户内容落点
grep -n 'class="meta"\|class="ghead room"\|class="banner"' index.html
```

> 说明：本报告的所有脚本均只读文件系统；未执行 git、未构建、未启动任何服务器、未修改 `VRCX-0-jirai`。
