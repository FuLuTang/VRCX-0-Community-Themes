# Windose 深色 — 内联像素字体：来源、许可、子集方法、字号机制

生成日期：2026-10-11
目标主题：`jirai-kei-theme`（VRCX-0 社区主题，纯 CSS）
上游调研：[`../research/pixel-fonts.md`](../research/pixel-fonts.md)
输出目录：`design-specs/jirai-kei-theme/fonts/`

---

## 0. 产物清单

| 文件 | 字节 | base64 字节 | sha256（前 16） | 说明 |
|---|---:|---:|---|---|
| `fusion-pixel-zh-subset.woff2` | **53,292** | **71,056** | `a8ef944072766421` | 中文 + 拉丁全集子集（Fusion Pixel 12px） |
| `silkscreen-ascii.woff2` | **1,696** | **2,264** | `3448405d1322380c` | ASCII 子集（Silkscreen Regular） |
| `fonts.css` | 74,891 | — | `d1a185a5cfca1ae8` | 两条 `@font-face`，base64 字面量内联 |
| `charset.txt` | 4,769 | — | `55afd4d843e4936f` | 字符清单（1655 有效字符） |
| `OFL-Fusion-Pixel.txt` | 4,418 | — | `bc518cf64b8032c0` | OFL-1.1 原文（随字体分发） |
| `OFL-Silkscreen.txt` | 4,394 | — | `86c5e9c9382cdcc5` | OFL-1.1 原文（随字体分发） |

base64 为 `base64 -w0 | wc -c` 实测值；`fonts.css` 里两条 data URI 的 base64 与之一致（已做解码往返 sha256 比对，PASS）。
`fonts.css` 结构 = 73,320 B base64 + 1,571 B 骨架与注释。

---

## 1. 字体来源

### 1.1 中文 + 拉丁全集：Fusion Pixel Font 12px proportional (zh_hans)

| 项 | 值 |
|---|---|
| 上游仓库 | <https://github.com/TakWolf/fusion-pixel-font> |
| Release tag | **`2026.09.25`**（`published_at: 2026-09-25T04:43:57Z`，取 GitHub releases API `latest`） |
| 下载 URL | `https://github.com/TakWolf/fusion-pixel-font/releases/download/2026.09.25/fusion-pixel-font-12px-proportional-ttf-v2026.09.25.zip` |
| 包体 | 49,414,580 B；内含 7 个语言变体 TTF + `OFL.txt` + `LICENSES/` |
| 选用源文件 | `fusion-pixel-12px-proportional-zh_hans.ttf` = **7,053,672 B**，sha256 `b2ee68647dc257fa…` |
| 字体本体许可 | **SIL Open Font License 1.1**，`Copyright (c) 2022, TakWolf (https://takwolf.com).` |
| 构建程序许可 | MIT（字体与构建程序分层授权，见仓库 `README.md`「许可证」段） |
| 设计网格 | `unitsPerEm = 1200`，轮廓坐标 GCD = 100 → **严格 12px 点阵网格** |

下载落点：`/tmp/pixfont/dl/fus12p-ttf-v2026.09.25.zip`、解包后 `/tmp/pixfont/dl/fus12p-ttf/`。

### 1.2 拉丁 / ASCII：Silkscreen Regular

| 项 | 值 |
|---|---|
| 上游 | Google Fonts 仓库 `ofl/silkscreen` |
| 文件 | `Silkscreen-Regular.ttf` = **32,220 B**（本地 `/tmp/wd-fonts/Silkscreen-Regular.ttf`） |
| 许可 | **OFL-1.1**，`Copyright 2001 The Silkscreen Project Authors (https://github.com/googlefonts/silkscreen)` |
| 设计网格 | `unitsPerEm = 1000`；直线字形 GCD = 125（8px 网格），圆角字形 GCD = 5（**非严格点阵**） |

> 说明：Silkscreen 的选型理由是「体积最小、UI 观感最干净的像素风拉丁」；它**在任何字号都不是 0% 半灰的锐利点阵**（12px ≈ 56.3% 半灰），但抗锯齿平滑，与真点阵中文混排时不至于碎裂。详见调研 §2.3、§7.2。

---

## 2. 许可与合规

1. **两者均为 OFL-1.1**，允许使用、研究、修改、子集化、嵌入与再分发。
2. **均未声明 Reserved Font Name（保留字体名）**：两份 OFL 原文里 `Reserved Font Name` 只出现在条款定义段（Fusion 第 36–37 行、Silkscreen 第 33–34 行），版权声明行之后**没有** RFN 列表 → 子集化（属修改）**不触发重命名义务**。
3. 主题的 `font-family` 使用自定义名 `"WD Pixel"` / `"WD Pixel CJK"`，与上游字体名无关，规避任何名称歧义。
4. OFL 要求在分发字体时**随附许可副本** → 已放置 `OFL-Fusion-Pixel.txt`、`OFL-Silkscreen.txt`。
5. `OFL-Fusion-Pixel.txt` 与上游仓库 `master:LICENSE-OFL` **逐字节一致**（sha256 `bc518cf64b8032c0…`，两者同值实测）。
6. OFL 与主题的 GPL-3.0-only 分发**不冲突**：字体保持自身许可，嵌入不改变其授权。
7. 拉丁**未采用** Zpix（商业授权、禁止转换/拆分/再分发），与调研结论一致。

---

## 3. 字符集 `charset.txt`

### 3.1 构成

| 来源 | 字符数 | 说明 |
|---|---:|---|
| VRCX-0 中文语言包 `src/localization/zh-CN.json` 全部字符串值 | 1,068 | 含 943 个汉字；递归取所有 string 值 |
| ASCII `U+0020–U+007E` | 95 | 拉丁基础 |
| 常用中文标点 / 全角符号 | 208 | `U+3000–303F`、`U+FF01–FF5E`、`U+FFE0–FFE5`、`U+2013–2014`、`U+2018–201D`、`U+2026`、`U+2030`、`U+2039–203A`、`U+00A0–00BF` |
| 主题符号集 | 80 | `♡♥☆★→←↑↓⇒⇔·…—―‖√∞≈≠≤≥±×÷°℃¥€£¢©®™§¶†‡•‰′″‹›「」『』【】〔〕〖〗〜〰✓✔✕✗●○◆◇■□▲△▼▽◯` + `①–⑩` |
| Jun Da 字频表前 1000 最常用字 | 1,000 | 见 3.2 |
| **去重后并集** | **1,655** | **其中汉字 1,283** |

`U+00AD`（软连字符）已显式剔除：对 UI 无意义。
`U+000A`（换行）出现在 `zh-CN.json` 的多行文案里，被算入并集但字体无此字形，子集化时自动忽略。

### 3.2 字频表来源

| 项 | 值 |
|---|---|
| 仓库 | <https://github.com/ruddfawcett/hanziDB.csv> |
| 文件 | `hanzi_db.csv` = 546,552 B（`frequency_rank,character,pinyin,…`），按频率升序、简体字 |
| 依据 | README：*Based on Jun Da's Modern Chinese Character Frequency List* |
| 取用 | `frequency_rank ≤ 1000` → 前 1000 字（第 1000 名 = `顶`） |

### 3.3 文件格式

- UTF-8，**按码点升序**，每行 64 个字符（换行仅作人工核对分组）。
- 可直接喂给 `pyftsubset --text-file=charset.txt`。
- 包含 `U+3000`（全角空格）与 `U+00A0`（不换行空格），二者不可打印但为有效字符。

### 3.4 覆盖率实测（2026-10-12，fontTools `getBestCmap`，最终 WOFF2）

最终正文子集的 cmap 为 **11,072 码点**，请求集合 11,384 个码点与源字体 cmap 相交后生成；源字体缺失 312 个请求码点。文件 `fusion-pixel-body-subset.woff2` = **351,564 B**，内联 `fonts-body.css` = **471,418 B**（含两条字体声明和 ASCII 字体）。

| 字表 / 范围 | 字表码点数 | 子集命中 | 覆盖率 |
|---|---:|---:|---:|
| GB2312 一级 | 3,008 | 3,008 | 100.0% |
| GB2312 全部 | 6,763 | 6,620 | 97.9% |
| Big5 常用（A4–BE） | 4,239 | 4,239 | 100.0% |
| Big5 次常用（BF–C6） | 1,256 | 1,256 | 100.0% |
| JIS 第一水准 | 2,965 | 2,965 | 100.0% |
| JIS 第二水准 | 3,390 | 3,390 | 100.0% |
| 平假名 / 片假名及半角片假名 | 255 | 252 | 98.8% |
| Latin-1（U+00A0–00FF） | 96 | 95 | 99.0% |
| Latin Extended-A | 128 | 128 | 100.0% |
| Latin Extended-B | 208 | 208 | 100.0% |

Ext A/B 覆盖按 U+0100–017F、U+0180–024F 统计，合计范围即目标 U+00A0–024F 的相关拉丁扩展字符。GB2312 及假名/Latin-1 的缺项是源字体 cmap 不提供的字形，子集化不可能补出；其它系统字体负责回退。`ƒǎǐǒǔ` 样例全部存在于输出 cmap。

全量实际主题构建 `theme.css` 为 **693,719 B**，1 MiB 上限下剩余 **354,857 B**。以实建产物计数，不再使用固定预留值估算。

---

## 4. 子集化方法与复现

### 4.1 工具链

- 系统 Python 3.12.3 **无 pip**；本机已有隔离 venv `/tmp/pixfont/venv`，内含 **fontTools 4.66.1 + brotli**（`pyftsubset`）。
- 因此**未安装** npm `subset-font`（harfbuzz wasm），也未安装 uv —— 已有工具即可完成任务，避免多余依赖。
- 未向系统或用户目录安装任何东西；临时脚本与下载物全部位于 `/tmp`。

### 4.2 命令

```bash
# 中文 + 拉丁全集
/tmp/pixfont/venv/bin/pyftsubset \
  /tmp/pixfont/dl/fus12p-ttf/fusion-pixel-12px-proportional-zh_hans.ttf \
  --text-file=/tmp/pixfont/charset.txt \
  --flavor=woff2 --no-hinting --desubroutinize \
  --output-file=fusion-pixel-zh-subset.woff2

# ASCII
/tmp/pixfont/venv/bin/pyftsubset /tmp/wd-fonts/Silkscreen-Regular.ttf \
  --unicodes=U+0020-007E \
  --flavor=woff2 --no-hinting --desubroutinize \
  --output-file=silkscreen-ascii.woff2
```

`--no-hinting --desubroutinize` 的理由：像素点阵字体在**整数倍字号**下字形本就落在像素网格上，无需 hinting；hinting 指令占子集体积一半以上（调研 §4 对照实测：Silkscreen 5,332 B → 1,696 B）。

### 4.3 子集后完整性验证（TTFont 实测）

| 检查项 | fusion-pixel-zh-subset | silkscreen-ascii |
|---|---|---|
| 码点数 | 1,642 | 95 |
| 字形数 | 1,643 | 100 |
| `unitsPerEm` | 1,200 | 1,000 |
| 字形坐标 GCD 样本 | `H/M/o/x/0/汉/设` 全部 = **100** | `H/M/x` = 125，`o/0` = 5 |
| **设计网格** | **12.0 px（完整保留）** ★ | 8px 主体 + 亚网格圆角 |
| `U+0020` 空格 | 有 | 有 |

→ **子集化未破坏 12px 网格**，这是本字体清晰度的前提。

### 4.4 复现脚本（均在 `/tmp`，不随产物分发）

| 脚本 | 作用 |
|---|---|
| `/tmp/pixfont/wd_charset.py` | 生成 `charset.txt` + 构成统计 |
| `/tmp/pixfont/wd_cover.py` | 覆盖率检查 |
| `/tmp/pixfont/wd_verify.py` | 子集网格 / cmap / name 表验证 |
| `/tmp/pixfont/wd_css.py` | 生成 `fonts.css` + base64 往返校验 |

---

## 5. 字号（Font size）

> 以下全部为**只读**源码查阅所得，行号对应当前工作副本 `/home/fulutang/Documents/Github/VRCX-0-jirai`。**未修改主程序任何文件，未构建，未执行 git 操作。**

### 5.1 应用全局字号从哪来

**结论：应用没有全局「字号」变量，也没有改 `html` 的 `font-size`。字号完全由 Tailwind 工具类逐处决定。**

| 证据 | 位置 | 内容 |
|---|---|---|
| 全局字体族（Tailwind 主题层） | `src/styles/globals.css:453` | `--font-sans: var(--vrcx-app-font-family, 'Geist Variable', sans-serif);`（位于 `@theme inline`，起于 `:397`） |
| 全局字体族（base 层） | `src/styles/globals.css:562` | `body { … font-family: var(--vrcx-app-font-family, system-ui); … }`（位于 `@layer base`，起于 `:537`） |
| `html` 应用字体 | `src/styles/globals.css:566-568` | `html { @apply font-sans; }` |
| **唯一的字体钩子** | `src/services/themeService.ts:403`、`:430` | `document.documentElement.style.setProperty('--vrcx-app-font-family', …)`（custom 模式 / 预设模式） |
| 字体预设表 | `src/shared/constants/fonts.ts:5-48` | `APP_FONT_CONFIG`：geist / inter / noto_sans / … / system_ui / custom |
| CJK 字体包 | `src/shared/constants/fonts.ts:50-85` | `APP_CJK_FONT_PACK_CONFIG`：noto / puhuiti / system |

要点：

1. **不存在 `--vrcx-app-font-size`**（全仓 grep 无匹配），也不存在 `documentElement.style.fontSize` 赋值或 `html { font-size: … }` 规则 → **`1rem` 恒等于浏览器默认 `16px`**。
2. `--vrcx-app-font-family` 是**写在 `<html>` 元素上的内联样式**。内联样式优先级高于任何选择器规则 → 主题若在 `:root` 里重定义该变量会被静默覆盖。**想让主题字体生效，应直接在具体选择器上写 `font-family`，不要改这个变量。**
3. 主题 CSS 的注入方式（决定能不能覆盖）：`src/services/community-theme/styleLayers.ts:15-21` → `src/services/vrcx0CssLayerService.ts:44-54`，把主题文本写成 `<style data-vrcx-0-css-layer="installed-theme">` 并 `document.head.appendChild`。
   → 主题规则是**未分层（unlayered）样式且注入在 head 末尾**；应用自己的 `@layer base`（`globals.css:537`）是**真 cascade layer**，优先级低于未分层规则。**因此主题用同特异性选择器写 `font-family` / `font-size`，可以正常覆盖。**

### 5.2 「界面缩放」= WebView zoom，**不是** `font-size`

| 证据 | 位置 | 内容 |
|---|---|---|
| **实现** | `src/services/themeService.ts:512` | `await tauriClient.webview.setZoom(Math.pow(1.2, numericZoom / 10 - 10));` |
| 底层调用 | `src/platform/tauri/webview.ts:124-130` | `getCurrentWebviewWindow().setZoom(zoom)` → Tauri `WebviewWindow.setZoom` |
| 边界与步进 | `src/shared/constants/themes.ts:131,133,135,137` | `DEFAULT_ZOOM_LEVEL = 100`、`MIN_ZOOM_LEVEL = 30`、`MAX_ZOOM_LEVEL = 300`、`ZOOM_STEP = 5` |
| 存储 | `src/repositories/configKeys.ts:68`、`:343` | `ZoomLevel: { type: 'int', default: 100 }`、`zoomLevel: 'VRCX_ZoomLevel'` |
| 归一化 | `src/services/themeService.ts:171-189` | `Math.min(MAX, Math.max(MIN, Math.trunc(value)))` |
| UI | `src/components/layout/status-bar/StatusBarFooter.tsx:808-846` | 状态栏「界面缩放」±/重置 |

**它是整页 WebView 缩放（等价于浏览器 page zoom），不是改任何元素的 `font-size`。**

**映射是非线性的**（`zoom = 1.2^(值/10 − 10)`）：

| 界面显示 | 实际 zoom |
|---:|---:|
| 100% | **1.0** |
| 105% | ≈1.095 |
| 110% | 1.2 |
| 120% | 1.44 |
| 125% | ≈1.577 |
| 90% | ≈0.833 |
| 80% | ≈0.694 |
| 300% | ≈38.3 |

⚠️ 注意：**显示百分比 ≠ 实际倍率**（120% 实际是 1.44 倍）。这一点对下面的清晰度判断是决定性的。

**为什么这会影响像素字体**：WebView page zoom 按比例缩放 CSS 像素到设备像素，在 Chromium 中等价于改变有效 `devicePixelRatio`。而 Fusion 的点阵是**固定 12 设备像素网格**——只要 `12 × zoom × 系统显示缩放` 不是 12 的整数倍，字形就会被重采样出灰边。

### 5.3 常用文字是 `text-sm` 还是 `text-xs`

**结论：`text-xs`（12px）更多，是主力字号 —— 这恰好落在像素字体的完美网格上。**

| 证据 | 位置 | 值 |
|---|---|---|
| Tailwind 默认字号（**未被覆写**） | `node_modules/tailwindcss/theme.css:347-350` | `--text-xs: 0.75rem` → **12px**；`--text-sm: 0.875rem` → **14px** |
| 覆盖检查 | `src/styles/*.css` 内无 `--text-xs` / `--text-sm` 定义 | 无覆写 |
| `text-xs` 使用数 | `src` 全量 grep | **601** 处 |
| `text-sm` 使用数 | `src` 全量 grep | **486** 处 |
| 硬编码像素字号 | `src` 全量 grep | `text-[10px]` 39、`text-[11px]` 32、`text-[13px]` 5、`text-[15px]` 2、`text-[9px]`/`text-[8px]`/`text-[7px]` 各 1 |

典型场景：状态栏整条就是 `text-xs`（`src/components/layout/status-bar/StatusBarFooter.tsx:355`、`:373`），侧栏、卡片、对话框元信息大量使用 `text-xs`；`text-sm` 多用于正文级描述。

行高：`text-xs` 默认行高 `calc(1 / 0.75)` → **12 × 1.333 = 16px**（整数，对点阵友好）。

### 5.4 让像素字体清晰的可行办法与风险

前提事实（上游调研 §7 实测，freetype 光栅化）：Fusion 12px 在 **12 / 24 / 36 / 48px 半灰 0.0%（绝对锐利）**；**13px = 74.3%**、**14px = 69.6%** —— 13/14px 都明显发糊。

#### 办法 A（推荐）：只把像素字体用在本来是 12px 的地方

- 做法：把 `@font-face` 内联进主题，用选择器限定作用域（如 `.text-xs` 及其组合、状态栏/侧栏选择器），`font-size: 12px; line-height: 16px;`。
- 为什么可行：主字号本来就是 `text-xs` = 12px，**不需要改动任何布局尺寸**，清晰度天然达标。
- 风险：与 14px 区域产生**风格割裂**（同一界面两种字体观感）；缺字回退系统字体，割裂更明显。

#### 办法 B：全局换字体 + 把 14px 压到 12px

- 做法：全局 `font-family` 替换，附带把 `text-sm` 覆盖为 `font-size: 12px; line-height: 16px`。
- **风险（高）**：直接改变文本占位。Tailwind `text-sm` 默认行高 1.25rem = 20px → 改 16px 会让行高缩 20%、按钮/输入框/卡片高度、换行位置、`overflow` 截断、虚拟列表项高度全部可能变化。属于**必然影响布局**，必须逐屏回归。
- 折中：只改 `font-size` 不改 `line-height`，视觉上行距会显得偏松，但布局抖动更小。

#### 办法 C：按 DPR / zoom 做媒体查询补偿

- 原理：page zoom 会改变有效 `devicePixelRatio`，理论上 `@media (min-resolution: …dppx)` 可捕获，再反算字号使 `font-size × zoom × scaleFactor = 12 的整数倍`。
- **风险与硬限制**：
  1. **zoom 值未暴露给 CSS** —— 全仓 grep 无 `data-zoom` / `--vrcx-zoom` / `dataset.zoom*`，纯 CSS 无法精确得知当前 zoom；
  2. zoom 与显示百分比**非线性**（5.2），且真实倍率还要再乘 Windows 显示缩放（`src/platform/tauri/webview.ts:132-146` `getScaleFactor`），组合爆炸，无法穷举；
  3. **未在 WebView2 实机验证**（上游调研 §7.4 已标注此项为「建议方案」）。
- 结论：**不建议**把清晰度寄托在这条路上。

#### 办法 D：`-webkit-font-smoothing: none`

- Chromium 特有，关闭灰度抗锯齿。**仅在字号恰好落在整数网格时有正面效果**；非整数倍字号下会把字形硬截断，反而更糟。**未在 WebView2 实测**，且会影响作用域内所有文本。

#### 办法 E：`font-synthesis: none`（**建议加**）

- Fusion 与 Silkscreen 都**只有 400 一个字重**。UI 中大量 `font-medium` / `font-semibold` / `font-bold` 会请求 500–700 字重 → 浏览器可能**合成加粗**，把点阵笔画撑出灰边。
- 在应用像素字体的作用域内加 `font-synthesis: none;` 可禁止合成，代价是「没有真粗体」（层级表达减弱）。

#### 综合建议

1. **只对 UI chrome（菜单、状态栏、侧栏、标签、元信息）应用像素字体**，这些区域是 `text-xs` = 12px，零布局代价。
2. **用户生成内容（昵称、聊天、世界名、群名）保留系统字体** —— 子集只含 1,283 个汉字，未收录字回退系统字体，风格必然断裂；用 `unicode-range` 或选择器隔离。
3. 加上 `font-synthesis: none;`，并显式写 `font-size: 12px; line-height: 16px;`。
4. **把 13px 从设计稿中删除**（`text-[13px]` 在应用里仅 5 处，可逐个豁免）。
5. 若确实要覆盖 14px 区域，走办法 B 的子集（只改 `font-size`，不动行高），并逐屏回归。

---

## 6. 内置用法（`fonts.css` 摘要）

```css
@font-face {
    font-family: "WD Pixel";       /* Silkscreen ASCII，base64 2,264 B */
    font-style: normal;
    font-weight: 400;
    font-display: block;
    src: url(data:font/woff2;base64,…) format("woff2");
}
@font-face {
    font-family: "WD Pixel CJK";   /* Fusion 12px，base64 71,056 B */
    font-style: normal;
    font-weight: 400;
    font-display: block;
    src: url(data:font/woff2;base64,…) format("woff2");
}
```

使用（**顺序不可颠倒**，拉丁在前）：

```css
font-family: "WD Pixel", "WD Pixel CJK", "Microsoft YaHei UI", sans-serif;
font-size: 12px;
line-height: 16px;
font-synthesis: none;
```

> `@font-face` 的 `src` 内**不能使用 `var()`**，因此 `fonts.css` 中的 base64 是字面量（任务要求如此）。
> 未加 `unicode-range`：保持两条声明的最小形态；若要与系统字体分区共存，可另行添加。

---

## 7. 未验证事项与局限

| 项 | 状态 |
|---|---|
| 真实 WebView2 / Chromium 光栅化下的清晰度 | **未实机验证**（本次半灰结论沿用上游调研的 freetype 光栅化，趋势可信、绝对数值可能有偏差） |
| `-webkit-font-smoothing: none` 在 WebView2 的效果 | **未验证** |
| 媒体查询按 DPR/zoom 补偿字号 | **未验证**，且 zoom 未暴露给 CSS（见 5.4 C） |
| `zoom = 1.2^(v/10−10)` 在极端档位（如 300）的实际视觉倍率 | 仅按代码字面计算，**未实机观察** |
| 缺字 13 个符号（`‹›€√∞≈≠≤≥✓✔✕✗`）回退系统字体的观感 | 未实测；上游 Fusion cmap 本就不含，非子集化损失 |
| 主题审核是否接受 base64 内联字体 | 主观判定风险（`CONTRIBUTING.md:81`「intentionally unreadable CSS」），需在 PR 中说明 base64 是必需的二进制编码 |
| VRCX-0 更新后中文文案变化 | 需重新生成子集（`charset.txt` 依赖 `zh-CN.json` 快照：943 汉字版） |

### 只读引用（未修改、未构建、未 git）

- `/home/fulutang/Documents/Github/VRCX-0-jirai`（主程序，只读：`src/styles/globals.css`、`src/services/themeService.ts`、`src/services/community-theme/styleLayers.ts`、`src/services/vrcx0CssLayerService.ts`、`src/platform/tauri/webview.ts`、`src/shared/constants/themes.ts`、`src/shared/constants/fonts.ts`、`src/repositories/configKeys.ts`、`src/components/layout/status-bar/StatusBarFooter.tsx`、`src/localization/zh-CN.json`）
- `/home/fulutang/Documents/Github/VRCX-0-Themes-VSCode`（主题规范仓库，只读：`CONTRIBUTING.md`、`docs/css-hooks.md` —— `css-hooks.md` 中**无任何 font 相关钩子**）
- 下载物：`/tmp/pixfont/`、`/tmp/wd-fonts/`
