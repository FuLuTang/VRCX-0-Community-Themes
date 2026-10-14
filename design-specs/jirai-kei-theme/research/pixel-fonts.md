# 像素字体选型调研 — Windose 紫系像素桌面（深色）

调研日期：2026-10-11
目标主题：`jirai-kei-theme`（VRCX-0 社区主题，纯 CSS，GPL-3.0-only）
调研范围：可作为主题 webfont 的像素字体，含许可、覆盖、体积、CDN/CORS、像素网格、12–13px UI 清晰度。

> **所有体积均为本次实测字节数**（`stat -c%s` / `wc -c`），下载物只落在 `/tmp/pixfont/`，未向主题仓库写入任何字体文件。
> 复现命令与实测文件清单见文末「附录 A」。

---

## 0. 结论摘要（TL;DR）

| # | 结论 | 影响 |
|---|---|---|
| 1 | **Zpix（最像素）必须排除** | 它是**商业授权**字体：README 明确「个人项目免费 / 单个商业产品 USD $1000（￥7000）」，且**禁止修改、反编译、转换、拆分（所有授权版本均不允许）**，禁止再分发。公开 GPL-3.0 主题必然构成「转换（转 woff2）+ 再分发」。证据：<https://github.com/SolidZORO/zpix-pixel-font/blob/main/README.md>（`License and Pricing` / `版权声明` 段） |
| 2 | **DotGothic16 不能当简体中文 UI 字体** | 实测 GB2312 **一级常用字仅覆盖 63.6%**、GB2312 全部汉字仅 50.1%。当简中界面字体会大面积缺字回退，视觉崩坏。它只能用于日文，或作为「假名/日文装饰」补充 |
| 3 | **只有 Ark Pixel / Fusion Pixel（以及 Zpix）是真正的 12px 点阵网格** | 实测坐标 GCD=100、upem=1200 → 严格 12px 网格。其余「像素风」字体（Pixelify Sans、DotGothic16）坐标 GCD=1，是**纯矢量**，靠抗锯齿渲染，不是点阵 |
| 4 | **12px 完美锐利，13px 明显模糊** | Ark/Fusion/Zpix 在 12/24/36/48px 时半灰像素占比 **0.0%**（绝对锐利）；**13px 时 74.3%**、14px 69.6% —— 非整数倍缩放会产生大面积灰度抗锯齿。**13px 是这套字体的最差字号之一** |
| 5 | **远程 @font-face 只有 Fusion Pixel 走得通** | 仅 `@vp-tw/cjk-web-fonts-fusion-pixel-font` 提供带 unicode-range 分片 + CORS 的 https 分发（jsDelivr，实测 `access-control-allow-origin: *`）。**Ark Pixel 完全没有 CORS 友好的远程源**；**Unifont 的官方源（unifoundry.com / ftp.gnu.org）不带 CORS 头** |
| 6 | **GitHub release 直链不能用来加载字体** | `github.com/.../releases/download/...` 实测**不返回 `access-control-allow-origin`**（302 到 `release-assets.githubusercontent.com`，同样无 ACAO）。浏览器加载跨源 webfont 是 CORS-mode 请求，会被直接拒绝。（对比：`raw.githubusercontent.com` 带 `ACAO: *`，但字体不在 repo 里） |
| 7 | **方案1 实测：ASCII 子集 base64 仅 2.2–9.2 KB** | 见 §4。Silkscreen 最小（2,264 B base64），Press Start 2P 2,984 B |
| 8 | **方案2 实测：中文远程分片 ≈ 551 KB** | 用 VRCX 真实中文 UI 文案（943 个不同汉字）驱动，**命中全部 19 个 CJK 分片**，合计 555,352 B + 拉丁/标点 8,868 B。分片对「整应用字符集」几乎不省 |
| 9 | ⭐ **补充发现：内联中文子集比远程分片小一个数量级** | 同样 943 汉字 + 标点 + ASCII 子集化后 woff2 仅 **40,988 B → base64 54,652 B（53 KB）**，比方案2 的 551 KB 小 10 倍，且**零网络依赖、不需要 `remoteAssets: true`、无隐私/可用性风险**。强烈建议作为方案2 的替代 |

**一句话推荐**：拉丁用 **Silkscreen**（或 Press Start 2P 的 16px 场景）子集化内联；中文用 **Fusion Pixel 12px**（OFL-1.1）**子集化内联**（53 KB base64），字号锁死 `12px`（或 24px），并把 `13px` 从设计稿里删掉。

---

## 1. 约束前提（决定方案边界）

来自主题仓库与主程序，全部为只读查阅：

| 约束 | 证据 |
|---|---|
| 社区主题只有一个纯 CSS 文件，以 `<style>` 文本注入；不能加 HTML、不能跑 JS；相对路径 `url()` 不解析 | 任务前提；`CONTRIBUTING.md` 第 66–81 行「CSS Policy」只允许「ordinary CSS selectors」+ `docs/css-hooks.md` 变量 |
| 远程图片/字体**仅当** `remoteAssets: true` 才允许 | `VRCX-0-Themes-VSCode/CONTRIBUTING.md:73`、`:85` |
| **禁止远程 `@import` CSS** | `VRCX-0-Themes-VSCode/CONTRIBUTING.md:79` — 「Remote `@import` of CSS files」列为 Not allowed |
| 禁止「Minified, generated, encrypted, or intentionally unreadable CSS」 | `VRCX-0-Themes-VSCode/CONTRIBUTING.md:81` — base64 内联字体属「必需二进制编码」而非故意混淆，但**审核上存在主观判定风险**，见 §7 |
| 主题须以 GPL-3.0-only 分发 | `VRCX-0-Themes-VSCode/CONTRIBUTING.md:106` |
| 主题作者自负资产授权责任；远程资源可能失败/变更/暴露用户 IP 与 UA | `VRCX-0-Themes-VSCode/CONTRIBUTING.md:87` |
| 校验脚本对 CSS **没有**域名白名单、**没有** CSS 体积上限；只对 `preview.webp` 限 256 KiB | `VRCX-0-Themes-VSCode/scripts/validate-themes.mjs:191`（唯一的体积检查，针对 preview） |
| 运行环境：Tauri 2 + React + shadcn + Tailwind v4，Windows 上是 **WebView2 / Chromium** | 任务前提 |

**由此推出两条硬性结论：**

1. **不能**用 Google Fonts 的 `<link>` / `@import` 方式引入它的自动分片 CSS（`CONTRIBUTING.md:79` 禁止远程 `@import` CSS）。要用 Google Fonts 的分片，必须把 `@font-face` 块**逐条复制进主题 CSS**——DotGothic16 的那份 CSS 是 **113,534 B / 123 条**，对纯 CSS 主题是沉重负担。
2. 远程字体加载是 **CORS-mode 请求**，跨源必须有 `Access-Control-Allow-Origin`。这是 §3 CDN 一列的判定标准。

---

## 2. 候选逐项评估

### 2.1 总览表

| 字体 | 许可（可否进 GPL-3.0 公开主题） | ASCII | 简中（GB2312 一级） | 日文假名 | 视觉字体 | 12px 锐利 | 远程 CDN + CORS |
|---|---|---|---|---|---|---|---|
| **Press Start 2P** | OFL-1.1 ✅ | 100% | 0% | 0% | 8px 点阵 | 36.2% 半灰 ❌ | Google Fonts ✅ |
| **Silkscreen** | OFL-1.1 ✅ | 100% | 0% | 0% | 矢量为主 | 56.3% 半灰 ❌ | Google Fonts ✅ |
| **Pixelify Sans** | OFL-1.1 ✅（可变 400–700） | 100% | 0% | 0% | 纯矢量 | 93.2% 半灰 ❌ | Google Fonts ✅ |
| **DotGothic16** | OFL-1.1 ✅ | 100% | **63.6%** ⚠️ | 88.5% | 纯矢量 | 99.2% 半灰 ❌ | Google Fonts ✅（123 片） |
| **Zpix 最像素** | **商业授权 ❌ 排除** | 100% | 100% | 86.1% | 12px 点阵 | **0.0%** ✅ | 未确认（无官方 CORS CDN；release 直链无 CORS） |
| **Fusion Pixel** | OFL-1.1 ✅（构建程序 MIT） | 100% | **100%** | 90.9% | 12px 点阵 | **0.0%** ✅ | jsDelivr（@vp-tw 分片包）✅ |
| **Ark Pixel** | OFL-1.1 ✅（构建程序 MIT） | 100% | 95.4% | 90.9% | 12px 点阵 | **0.0%** ✅ | **无** ❌（详见 2.7） |
| **Unifont** | GPL-2.0+ 嵌入例外 **和** OFL-1.1 双许可 ✅ | 100% | 100% | 100% | 8×16 / 16×16 点阵 | 未实测（不推荐，见 2.8） | **无 CORS** ❌ |

覆盖率口径：ASCII = U+0020–007E（95 码点）；简中 = GB2312 一级字库 3755 字；假名 = U+3040–30FF ∪ U+31F0–31FF（208 码点）。全部为本次 `fontTools` 实测 cmap。

「半灰像素占比」= freetype 渲染后处于 1–254 灰阶的像素 / 非空像素总数。**0% = 完美点阵对齐**，越高越糊。测色文本 `Windose 12:34`。

---

### 2.2 Press Start 2P

- **许可**：SIL Open Font License 1.1 ✅ 允许嵌入与再分发。原文：<https://raw.githubusercontent.com/google/fonts/main/ofl/pressstart2p/OFL.txt>（实测 200，4,413 B）。上游仓库：<https://github.com/google/fonts/tree/main/ofl/pressstart2p>
- **覆盖**：ASCII 95/95 (100%)、Latin-1 96/96 (100%)、**无 CJK、无假名**
- **体积**（实测）：
  - 完整 ttf `PressStart2P-Regular.ttf` = **118,204 B**
  - Google Fonts latin 分片 woff2 = **12,512 B**（css2 共 5 片：cyrillic-ext / cyrillic / greek / latin-ext / latin）
- **官方 CDN**：Google Fonts（`fonts.gstatic.com`），实测 `access-control-allow-origin: *` ✅
  - latin 片直链：`https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2`（200，`content-type: font/woff2`，12,512 B）
  - @fontsource 镜像（jsDelivr）也可用：`https://cdn.jsdelivr.net/npm/@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2`（200 + CORS，12,512 B）
- **是否按 unicode-range 分片**：是，Google Fonts 自动分 5 片 ✅
- **字形尺寸**：upem=1000，坐标 GCD=**125** → **1 设计像素 = 125 units = em 的 1/8 → 8px 网格**
  - 实测完美锐利字号：**8 / 16 / 24 / 32 / 40 / 48 px**（半灰 0.0%）
  - **12px = 36.2% 半灰、13px = 44.0%**（都模糊，12px 反而好于 13px）
  - OS/2：capHeight=1000（满 em）、xHeight=750、`H` 宽=1000（全宽，很占地方）
- **12–13px 结论**：❌ **不推荐用于 12–13px 正文/标签**。它是 8px 网格，12/13 都不是 8 的倍数；且字形满 em、全宽，12px 下非常挤。适合 ≥16px 的标题、大号数字、按钮。

### 2.3 Silkscreen

- **许可**：OFL-1.1 ✅。原文：<https://raw.githubusercontent.com/google/fonts/main/ofl/silkscreen/OFL.txt>（200，4,394 B）
- **字重**：Regular 400 + Bold 700 两个静态实例（`Silkscreen-Regular.ttf` / `Silkscreen-Bold.ttf`，后者实测 30,632 B）。证据：`METADATA.pb` 中两个 `fonts {}` 块
- **覆盖**：ASCII 95/95、Latin-1 96/96、无 CJK
- **体积**（实测）：ttf **32,220 B**；Google Fonts latin woff2 **8,404 B**、latin-ext **3,436 B**
- **官方 CDN**：Google Fonts ✅ CORS `*`
  - `https://fonts.gstatic.com/s/silkscreen/v6/m8JXjfVPf62XiF7kO-i9YLNlaw.woff2`（200，8,404 B）
  - `https://cdn.jsdelivr.net/npm/@fontsource/silkscreen@5.3.0/files/silkscreen-latin-400-normal.woff2`（200 + CORS，8,404 B）
- **分片**：是，latin / latin-ext 两片
- **字形尺寸**：upem=1000
  - 直线字形（`H`/`M`）坐标 GCD=**125** → 主体 8px em 网格
  - 但圆角字形（`o`/`0`）出现 GCD=**5** 的坐标 → **轮廓不是严格点阵网格**
  - 实测**任何字号都未达到 0% 半灰**：最佳 32px=9.6%、24px=12.4%、8px=34.9%、12px=56.3%
  - OS/2：capHeight=700、xHeight=500、`H` 宽=750
- **12–13px 结论**：❌ 不是「锐利点阵」，12px 有 56.3% 半灰。但它是**体积最小、最紧凑、UI 观感最干净**的拉丁选择，作为「像素风小字」观感可接受（抗锯齿平滑，不会像真点阵那样在非对齐字号下出现笔画粗细不均）。

### 2.4 Pixelify Sans

- **许可**：OFL-1.1 ✅。原文：<https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/OFL.txt>（200，4,488 B）
- **可变字体**：`wght` 轴 **400–700**（`PixelifySans[wght].ttf`）。证据：`METADATA.pb` 的 `axes { tag: "wght" min_value: 400.0 max_value: 700.0 }`。注意：`css2?family=Pixelify+Sans` 默认只给 400，要可变范围需写 `family=Pixelify+Sans:wght@400..700`
- **覆盖**：ASCII 95/95、Latin-1 94/96 (97.9%)、无 CJK
- **体积**（实测）：Google Fonts latin woff2 **7,692 B**
- **官方 CDN**：Google Fonts ✅ CORS `*`；@fontsource：`https://cdn.jsdelivr.net/npm/@fontsource/pixelify-sans@5.3.0/files/pixelify-sans-latin-400-normal.woff2`（200 + CORS，7,692 B）
- **字形尺寸**：upem=1000，坐标 GCD=**1** → **纯矢量，不是点阵**。实测 12px=93.2%、13px=87.8%、24px=69.6% 半灰（永远平滑抗锯齿）
- **12–13px 结论**：作为「像素**风**」字体在 12px 下可读且平滑，但与真正的点阵中文（Fusion/Ark）**混排会风格冲突**（一个锐利方块、一个平滑曲线）。若中文用真点阵，拉丁也应选真点阵。

### 2.5 DotGothic16

- **许可**：OFL-1.1 ✅。原文：<https://raw.githubusercontent.com/google/fonts/main/ofl/dotgothic16/OFL.txt>（200，4,492 B）
- **覆盖**（关键）：ASCII 100%、Latin-1 100%、**假名 184/208 = 88.5%**、**GB2312 一级 2,389/3,755 = 63.6%**、**GB2312 全部 3,385/6,763 = 50.1%**、CJK 标点 27/64 = 42.2%
  - cmap 总码点 8,231
  - **结论：它是日文字体（JIS 字集），不是简中字体。**
- **体积**（实测）：
  - 完整 ttf `DotGothic16-Regular.ttf` = **2,069,236 B (1.97 MB)**
  - Google Fonts 分片：**123 个 `@font-face`**，全部 woff2 合计 **769,868 B (751.8 KB)**；配套 CSS 本身 **113,534 B**
- **官方 CDN**：Google Fonts ✅ CORS `*`；`fonts.gstatic.com/s/dotgothic16/v22/...0.woff2` 到 `...122.woff2` 分片命名
  - latin 片：`https://fonts.gstatic.com/s/dotgothic16/v22/v6-QGYjBJFKgyw5nSoDAGH7M6X8.woff2`（200，10,508 B）
  - @fontsource 另有整块 japanese 片：`https://cdn.jsdelivr.net/npm/@fontsource/dotgothic16@5.3.1/files/dotgothic16-japanese-400-normal.woff2`（200 + CORS，**396,312 B**）
- **字形尺寸**：upem=1000，坐标 GCD=**1** → **纯矢量**（虽然是点阵风格设计）。实测 12px=99.2%、13px=99.2% 半灰
- **12–13px 结论**：❌ 简中场景直接出局（覆盖率）；即便日文场景，12px 下几乎全为灰度像素，不锐利。

### 2.6 Zpix（最像素）— **许可排除**

- **许可：不可用于公开 GPL-3.0 主题** ❌
  - 仓库根目录**没有 LICENSE 文件**（GitHub API `license` 字段为 `null`；根目录列表无任何 LICENSE）。证据：<https://api.github.com/repos/SolidZORO/zpix-pixel-font/contents/>
  - `README.md` 的 `License and Pricing` 段（英文）+ `授权与价格` 段（中文）：
    - 单个商业产品 **USD $1000 / RMB ￥7000**；多产品需联系作者；教育项目免费；个人项目免费
  - `README.md` `版权声明` 段原文：「**同时禁止对本字体进行修改、反编译、转换、拆分等反向操作（所有授权版本均不允许）**，及非法传播、出售、出租或以其它方式从中牟利。」
  - → 主题里把 ttf 转成 woff2 属于「**转换**」；把字体数据嵌进公开仓库的 CSS 属于「**传播/再分发**」。两者都在禁止列表内。**排除，无讨论余地。**
  - 链接：<https://github.com/SolidZORO/zpix-pixel-font/blob/main/README.md>
- **技术指标（仅供对照，不作为选型）**：
  - 体积（实测）：`zpix.woff2` = **966,704 B (944 KB)**、`zpix.ttf` = **4,681,088 B (4.46 MB)**、`zpix.bdf` = 3,143,544 B（release v3.3.0，发布于 2026-09-24）
  - 覆盖：**全场最佳** — ASCII 100%、Latin-1 99%、GB2312 一级 100%、GB2312 全部 100%、假名 86.1%、全角 100%（共 22,237 字；CJK 标点 3000–303F 仅 54.7%）
  - 网格：upem=1200、GCD=100 → **12px 网格**；12/24px 半灰 **0.0%** ★
  - README 亦自述「字号：12px（11px + 1px 间距），请使用整数倍字号（12px / 24px / 36px…）以获得最清晰的效果」
- **官方 CDN**：**未确认**。未在 `zpix.vercel.app` 首页 HTML 中发现 `.woff2/.woff/.ttf` 直链（可能由 CSS/JS 间接加载，未深查——因许可已排除）。GitHub release 直链同类实测无 CORS。

### 2.7 Fusion Pixel Font（缝合像素字体）⭐ 推荐

- **许可**：**字体本体 OFL-1.1** ✅；构建程序 MIT。证据：仓库根目录同时有 `LICENSE-OFL`(4,418 B) 与 `LICENSE-MIT`(1,064 B)，`README.md` 第 113–135 行「许可证」段明确分层：
  - 「### 字体 — 采用 SIL Open Font License version 1.1 授权。」
  - 「### 构建程序 — 采用 MIT License 授权。」
  - 并列出全部上游字体许可（Ark Pixel OFL-1.1、Misaki 兼容 OFL-1.1、MisekiBitmap OFL-1.1、BoutiqueBitmap7x7/9x9 OFL-1.1、Cubic 11 OFL-1.1、Galmuri OFL-1.1）—— **全部兼容，无 GPL 冲突**
  - 链接：<https://github.com/TakWolf/fusion-pixel-font/blob/master/README.md>、<https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL>
  - 字体文件内嵌声明亦可自证：nameID 13 = `This Font Software is licensed under the SIL Open Font License, Version 1.1`，nameID 14 = `https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL`
  - ⚠️ **注意**：GitHub API 的 `license.spdx_id` 返回 `MIT`（<https://api.github.com/repos/TakWolf/fusion-pixel-font>），这是 GitHub 的双许可识别口径问题，**以 README 分层说明与字体内嵌 nameID 为准：字体 = OFL-1.1**。
- **覆盖**（12px proportional `zh_hans` 实测）：cmap 36,999 码点
  - ASCII 95/95 **100%**、Latin-1 95/96 99.0%、**GB2312 一级 3,755/3,755 = 100%**、GB2312 全部 6,620/6,763 = **97.9%**、**假名 189/208 = 90.9%**、CJK 标点 64/64 **100%**、全角 94/94 **100%**
- **体积**（实测）：
  - 完整 12px proportional zh_hans woff2 = **928,148 B (906.4 KB)**
  - release zip `fusion-pixel-font-12px-proportional-ttf.woff2-v2026.09.25.zip` = 6,539,160 B（内含 7 个语言变体 woff2：zh_tw 936,496 / zh_hk 933,460 / ja 933,372 / zh_hant 931,336 / ko 929,868 / **zh_hans 928,148** / latin 926,256 + OFL 文件）
  - ⚠️ 各语言变体的 **cmap 完全相同**，差异在**字形风格**（简体/繁体/日文字形标准），不是字符子集
- **官方 CDN**：✅ 有，且**这是唯一可用的远程方案**
  - 第三方重打包 npm 包：`@vp-tw/cjk-web-fonts-fusion-pixel-font@0.0.1`（许可 `MIT AND OFL-1.1`）
    - 上游 release 锁在 **2026.08.11**（比 TakWolf 最新 2026.09.25 旧一版），分割器 `font-splitter v0.2.2`，单 bucket 上限 1024 码点（包内 `README.md` 自述）
    - jsDelivr 实测全部 200 + `access-control-allow-origin: *`：
      - CSS：`https://cdn.jsdelivr.net/npm/@vp-tw/cjk-web-fonts-fusion-pixel-font@0.0.1/dist/12px/proportional/zh_hans/Fusion-Pixel-12px-Proportional-Simplified-Chinese.css`（200，`text/css`）
      - Basic-Latin 片：`.../Fusion-Pixel-12px-Proportional-Simplified-Chinese.Basic-Latin.woff2`（200，`font/woff2`，2,312 B）
      - CJK 片：`...CJK-Unified-Ideographs-001.woff2`（200，26,208 B）
  - TakWolf 自己的 release 直链（`github.com/TakWolf/fusion-pixel-font/releases/download/...`）**无 CORS** ❌
- **是否按 unicode-range 分片**：✅ **是**。`zh_hans` 12px proportional 共 **78 片**，CSS 70,892 B / 78 条 `@font-face`，每片带 `unicode-range`。分片示例：
  - `Basic-Latin` 2,312 B（`unicode-range: U+20-7E`）
  - `Latin-1-Supplement` 2,280 B、`General-Punctuation` 1,240 B、`CJK-Symbols-and-Punctuation` 1,916 B、`Halfwidth-and-Fullwidth-Forms` 3,400 B、`Hiragana` 2,780 B、`Katakana` 2,524 B
  - **19 个 CJK 主力片**：`CJK-Unified-Ideographs-001..019`，单片 24,904–31,760 B
  - 目录总字节 934,132 B（含 CSS），78 片 woff2 合计 **863,240 B**
  - ⚠️ **主题里必须把 CSS 中的相对 `url(...)` 改写成 jsDelivr 绝对 URL**——实测包内 CSS 写的是 `url(Fusion-Pixel-...-Basic-Latin.woff2)` 相对路径，而纯 CSS 主题不解析相对路径
  - 另有 8px（616 KB）、10px（736 KB）、12px（1.1 MB）三档与 monospaced/proportional 两种间距
- **字形尺寸**：upem=**1200**，坐标 GCD=**100** → **严格 12px 网格**（1 设计像素 = 100 units）
  - OS/2：capHeight=900、xHeight=600、typoAscender/Descender = 1300/−300、`H` 宽=700、**汉字宽=1200（全宽）**、`M` 宽=800
  - 实测半灰占比（拉丁+中文混合）：**12px = 0.0%** ★、**24px = 0.0%** ★、**36px = 0.0%** ★、48px = 0.0% ★；9px 98.8%、10px 98.4%、11px 96.6%、**13px 74.3%**、14px 69.6%、15px 65.6%、18px 48.2%、20px 53.2%
  - 中文单测（`设置好友窗口`）：12px = **0.0%**、13px = 67.0%、16px = 59.3%
- **12–13px 结论**：**12px = 完美锐利（首选）；13px = 明显模糊（禁用于这套字体）**

### 2.8 Ark Pixel Font（方舟像素字体）

- **许可**：字体本体 **OFL-1.1** ✅；构建程序 MIT。证据：`README.md` 第 108–118 行「许可证」段分层说明与 fusion 同构；根目录有 `LICENSE-OFL`(4,412 B) + `LICENSE-MIT`(1,064 B)。字体内嵌 nameID 13/14 亦声明 OFL-1.1。链接：<https://github.com/TakWolf/ark-pixel-font/blob/master/README.md>
  - ⚠️ 同 fusion：GitHub API 也报 `MIT`，以 README/内嵌为准
- **覆盖**（12px proportional `zh_hans` 实测）：cmap 24,869 码点
  - ASCII 100%、Latin-1 99.0%、**GB2312 一级 3,583/3,755 = 95.4%**、GB2312 全部 6,279/6,763 = **92.8%**、假名 189/208 = 90.9%、CJK 标点 100%、全角 100%
  - → 覆盖**略低于 Fusion**（Fusion 一级字 100%、全部字 97.9%）
  - 同样：`latin` 变体与 `zh_hans` 变体 cmap 完全一致（24,869），差异只在字形风格
- **体积**（实测）：12px proportional zh_hans woff2 = **755,952 B (738.2 KB)**（比 Fusion 小 172 KB）；release zip `ark-pixel-font-12px-proportional-ttf.woff2-v2026.09.25.zip` = 5,327,390 B，含 7 个语言变体（zh_tw 765,460 / ja 763,660 / zh_hk 762,032 / zh_hant 761,976 / ko 761,008 / **zh_hans 755,952** / latin 751,648）+ OFL.txt
- **官方 CDN：无可用的 CORS 友好源** ❌（三重验证）
  1. GitHub release 直链实测**无 `access-control-allow-origin`**（302 → `release-assets.githubusercontent.com`，仍无）
  2. npm 上**不存在** ark-pixel 相关包（`registry.npmjs.org/-/v1/search?text=pixel webfont cjk` 仅返回 `@vp-tw/cjk-web-fonts-fusion-pixel-font`）
  3. 仓库内**没有编译好的字体文件**：`data.jsdelivr.com/v1/packages/gh/TakWolf/ark-pixel-font@2026.09.25?structure=flat` 返回 **39,284 个文件、0 个 `.ttf/.otf/.woff/.woff2`**（根目录只有 `.github/ assets/ docs/ tests/ tools/` + 许可证 + 构建脚本）→ jsDelivr gh 也无从下手
- **是否按 unicode-range 分片**：❌ 官方不提供分片 webfont（只有整字体 release）
- **字形尺寸**：upem=1200、GCD=100 → **严格 12px 网格**；12/24/36/48px 半灰 **0.0%** ★；13px 74.3%
- **12–13px 结论**：**12px 完美锐利**，但与 Fusion 相比：覆盖略低 + **完全无远程源** → 只能走内联子集路线

### 2.9 Unifont（GNU Unifont）

- **许可**：✅ 兼容 GPL-3.0。官方首页原文：「As of Unifont version 13.0.04, the fonts are dual-licensed under the SIL Open Font License (OFL) version 1.1 and the GNU GPL 2+ with the GNU font embedding exception.」
  - 链接：<https://unifoundry.com/unifont/index.html>、<https://unifoundry.com/OFL-1.1.txt>、<https://unifoundry.com/LICENSE.txt>
  - 另有专段「Use with Non-Free Software」说明嵌入不构成 GPL 违反
- **覆盖**：**100% 全项** —— ASCII 100%、Latin-1 100%、GB2312 一级 100%、GB2312 全部 100%、假名 208/208 **100%**、CJK 标点 100%、全角 100%
  - cmap 总码点 **58,910**；覆盖 BMP 全部可打印码点（`README`/首页自述「glyphs for every printable code point in the Unicode BMP」）
- **体积**（实测）：`unifont-18.0.01.otf` = **5,320,148 B (5.07 MB)**（另有 `unifont_jp`、`unifont_t`、`unifont_upper` 等变体，各约 5 MB / 1 MB / 0.5 MB）
  - 官方未提供 woff2 版（只有 otf / bdf / pcf / hex / psf）
- **官方 CDN**：**无 CORS** ❌
  - `https://unifoundry.com/pub/unifont/unifont-18.0.01/font-builds/unifont-18.0.01.otf` → 200 但**无 `access-control-allow-origin`**
  - `https://ftp.gnu.org/gnu/unifont/unifont-18.0.01/unifont-18.0.01.otf` → 200 但**无 `access-control-allow-origin`**
  - → **不能**用于远程 `@font-face`；5.07 MB 也完全不可能 data URI 内联
- **字形尺寸**：upem=**64**，CFF 轮廓（非 glyf）。设计为 **8×16 / 16×16 点阵**（官方首页：「glyphs in a grid of 8 or 16 pixels wide by 16 pixels tall」）。**未做渲染清晰度实测**（已因体积 + CORS 出局）
- **是否分片**：❌ 无官方 unicode-range 分片 webfont
- **12–13px 结论**：❌ 不适合本主题。原因：① 无 CORS 源；② 5.07 MB 过大；③ 只有单字重、单字形（无意大利/多语言变体），是为「兜底渲染」而非 UI 精致排版设计的；④ 官方自述「If you would like to contribute glyphs...」「suitable as a font of last resort」

---

## 3. CDN / CORS 实测汇总

CORS 测试方法：`curl -H "Origin: https://example.com"`，检查响应是否含 `Access-Control-Allow-Origin`。
**判定标准**：跨源 `@font-face` 是 CORS-mode 请求，缺 ACAO 即被浏览器拒绝。

| 源 | 结果 | 备注 |
|---|---|---|
| `fonts.gstatic.com`（Google Fonts 字体文件） | ✅ `access-control-allow-origin: *` | `content-type: font/woff2` |
| `fonts.googleapis.com`（Google Fonts CSS） | ✅ `access-control-allow-origin: *` | 但主题**不能** `@import` 它（CONTRIBUTING.md:79） |
| `cdn.jsdelivr.net`（npm + gh） | ✅ `access-control-allow-origin: *` | npm/gh 均带；字体 200 |
| `raw.githubusercontent.com` | ✅ `access-control-allow-origin: *` | 但字体不在这些 repo 里 |
| `github.com/.../releases/download/...` | ❌ **无 ACAO** | 302 → `release-assets.githubusercontent.com`，目标同样无 ACAO |
| `unifoundry.com` | ❌ 无 ACAO | |
| `ftp.gnu.org` | ❌ 无 ACAO | |
| `registry.npmjs.org` | ✅（仅元数据 tar.gz） | 不是 webfont 直用源 |

**实践结论**：远程像素字体 = **Google Fonts（仅拉丁/CJK-日文）** 或 **jsDelivr（Fusion Pixel 分片）**；GitHub release 一律不可用于 `@font-face`。

---

## 4. 方案1：拉丁像素字体 ASCII 子集 → base64 内联

方法：`pyftsubset <font> --unicodes=U+0020-007E --flavor=woff2 --no-hinting --desubroutinize`，再 `base64 -w0`。
工具：`fonttools 4.66.1` + `brotli`（安装于 `/tmp/pixfont/venv`，未污染系统 Python）。

| 字体 | 源文件 | 源大小 | ASCII 子集 woff2 | **base64 长度** | 内联后 CSS 增量（估算） |
|---|---|---|---|---|---|
| **Silkscreen** | ttf | 32,220 B | **1,696 B** | **2,264 B (2.21 KB)** | ≈ 2.5 KB |
| Press Start 2P | ttf | 118,204 B | **2,236 B** | **2,984 B (2.91 KB)** | ≈ 3.2 KB |
| Ark Pixel 12px zh_hans | woff2 | 755,952 B | 2,304 B | 3,072 B (3.00 KB) | ≈ 3.3 KB |
| Fusion Pixel 12px zh_hans | woff2 | 928,148 B | 2,276 B | 3,036 B (2.96 KB) | ≈ 3.3 KB |
| DotGothic16 | woff2 | 10,508 B | 4,308 B | 5,744 B (5.60 KB) | ≈ 5.9 KB |
| Pixelify Sans | woff2 | 7,692 B | 4,660 B | 6,216 B (6.07 KB) | ≈ 6.4 KB |

**对照组（保留 hinting，不加 `--no-hinting --desubroutinize`）**：

| 字体 | ASCII 子集 woff2 | base64 |
|---|---|---|
| Press Start 2P | 6,888 B | 9,184 B (8.96 KB) |
| Silkscreen | 5,332 B | 7,112 B (6.94 KB) |

→ hinting 指令占子集的一半以上体积。像素点阵字体在 **整数倍字号** 下不需要 hinting（字形本就对齐像素网格），**建议去掉**（`--no-hinting`），方案1 因此可以压到 **2.2–3.0 KB**。

### 方案1 总体积结论

**推荐组合（Silkscreen 400 + 700 两个字重）**：
- Silkscreen Regular ASCII 子集 base64 = **2,264 B**
- Silkscreen Bold ASCII 子集 = **未实测**（Bold ttf 30,632 B，同口径估约 1.7–2.3 KB woff2 / 2.3–3.1 KB base64），**此为估算，非实测**
- 加两条 `@font-face` 声明（约 180 B/条）→ **方案1 合计约 5–6 KB**

**只用一个字重（Pressed Start 2P 或 Silkscreen Regular）**：**2.9–3.2 KB**。

> 方案1 的体积**完全不是问题**，可以放心内联，且**不需要** `remoteAssets: true`。

---

## 5. 方案2：中文像素字体远程 `@font-face` 加载（需 `remoteAssets: true`）

唯一可行路径：**`@vp-tw/cjk-web-fonts-fusion-pixel-font@0.0.1` 的 `zh_hans` 12px proportional 分片**，经 jsDelivr。

### 5.1 分片结构实测

| 项 | 数值 |
|---|---|
| 分片总数 | **78 片** |
| 配套 CSS | 70,892 B（78 条 `@font-face`，含 `unicode-range`） |
| 78 片 woff2 合计 | **863,240 B (843.0 KB)** |
| zh_hans 目录总占用（含 CSS） | 934,132 B |
| 单 bucket 上限 | 1024 码点（包内 README 自述，`font-splitter v0.2.2`） |
| 19 个 CJK 主力片 | 单片 **24,904 – 31,760 B** |
| 常用小片 | Basic-Latin 2,312 B、Latin-1-Supp 2,280 B、General-Punctuation 1,240 B、CJK-Symbols-and-Punctuation 1,916 B、Halfwidth-and-Fullwidth 3,400 B、Hiragana 2,780 B、Katakana 2,524 B |

### 5.2 用真实 VRCX 中文 UI 文案做的命中模拟 ⭐

数据源：主程序 `VRCX-0-jirai/src/localization/zh-CN.json`（只读），提取全部中文字符。

| 指标 | 实测值 |
|---|---|
| UI 中不同汉字数 | **943** |
| 不同中文标点/全角字符 | 13 |
| 未命中任何分片的汉字 | **0** ✅ |
| **命中的分片数** | **19（全部 CJK 主力片都命中）** |
| 汉字部分需下载合计 | **555,352 B (542.3 KB)** |
| + Basic-Latin + CJK 标点 + 全角 + 通用标点 | +8,868 B (8.7 KB) |
| **方案2 现实总量** | **≈ 564,220 B (551.0 KB) woff2** |
| 最坏情况（下载全部 78 片） | 863,240 B (843.0 KB) |

**关键洞察**：分片按**码点顺序**切 1024 一块，而真实 UI 汉字散布在整个 U+4E00–U+9FFF 区间 —— **943 个汉字把 19 个 CJK 片全部打中**（每片命中 6–130 字）。所以对「整个应用的字符集」而言，**分片几乎不省流量**（551 KB vs 整字体 906 KB，仅省 39%）。

分片真正的收益在于：① 单个视图/页面（几十个汉字）通常只命中少数几片；② 增量更新时只重下变化片；③ 韩文（33 片）、扩展区等片永远不会下载。

### 5.3 主题里接入时的三个坑

1. **必须把相对 `url(...)` 改成绝对 URL**。包内 CSS 原文是 `url(Fusion-Pixel-12px-Proportional-Simplified-Chinese.Basic-Latin.woff2)`，主题纯 CSS 不解析相对路径 → 必须替换为
   `https://cdn.jsdelivr.net/npm/@vp-tw/cjk-web-fonts-fusion-pixel-font@0.0.1/dist/12px/proportional/zh_hans/...woff2`
2. **不能 `@import` 那份 CSS**（`CONTRIBUTING.md:79` 禁止远程 `@import` CSS）。要么把 78 条 `@font-face` 复制进主题 CSS（+70,892 B），要么只挑需要的片手写（如 19 CJK + Basic-Latin + 标点 ≈ 24 条，按 909 B/条估算约 **21 KB**；**此为估算，未实测裁剪切片后的 CSS 字节数**）
3. **必须 `remoteAssets: true`**（`CONTRIBUTING.md:62`、`:73`、`:85`），并在 manifest 里如实声明；同时按 `:87` 提示，远程资源可能失败/变更并暴露用户 IP + UA。

---

## 6. ⭐ 补充发现：内联中文子集 —— 比方案2 小一个数量级

既然主题**可以**内联 base64（方案1 已证明），而中文子集化后体积极小，那么「中文也用内联」是更优解。用同一份 VRCX UI 字符集实测：

| 字符集 | 字符数 | 字体 | 子集 woff2 | **base64** |
|---|---|---|---|---|
| **A. VRCX 全部 UI 字符**（ASCII + 标点 + 943 汉字） | 1,329 | Fusion Pixel 12px | **40,988 B (40.0 KB)** | **54,652 B (53.4 KB)** |
| A | 1,329 | Ark Pixel 12px | 40,072 B (39.1 KB) | 53,432 B (52.2 KB) |
| **B. GB2312 一级字库全量**（留余量，覆盖绝大多数中文） | 4,141 | Fusion Pixel 12px | **134,924 B (131.8 KB)** | **179,900 B (175.7 KB)** |
| B | 4,141 | Ark Pixel 12px | 127,596 B (124.6 KB) | 170,128 B (166.1 KB) |
| C. GB2312 一级 ∪ UI 字符 | 4,145 | Fusion Pixel 12px | 135,016 B (131.8 KB) | 180,024 B (175.8 KB) |
| C | 4,145 | Ark Pixel 12px | 127,756 B (124.8 KB) | 170,344 B (166.3 KB) |

（口径同方案1：`--flavor=woff2 --no-hinting`）

**对比方案2 的 551 KB —— 内联 UI 子集 53 KB，小 10.4 倍；即便留足 GB2312 一级余量也只要 176 KB，小 3.1 倍。**

### 取舍

| | 方案2（远程分片） | 内联子集 |
|---|---|---|
| 体积 | 551 KB（全 UI 字符集） | **53 KB**（UI 子集）/ 176 KB（GB2312 一级） |
| 网络依赖 | 需要，且 jsDelivr 不可达时**字体全丢** | **零依赖** |
| 隐私 | 向 CDN 暴露用户 IP/UA（`CONTRIBUTING.md:87`） | 无 |
| `remoteAssets` | 必须 `true`（审核面变大） | **不需要** |
| 缺字风险 | 分片齐全，几乎不缺 | **会缺**：VRCX 更新新增文案、或用户内容（好友昵称、聊天、群名、世界名）出现未收录汉字 → 回退系统字体，风格断裂 |
| 维护成本 | 跟随上游版本更新 | 每次 VRCX 中文文案变化需重新生成子集 |
| 供应链风险 | 依赖第三方 npm 包（**0.0.1 版**）+ jsDelivr 可用性 + 上游锁在 2026.08.11 | 无 |

**推荐做法（组合策略）**：

1. **UI chrome 用内联子集**（菜单、按钮、标签、设置项）——字符集稳定、体积 53 KB、零依赖。
2. **用户生成内容**（昵称、消息、世界名）**不加点阵字体**，让它继续用 VRCX 默认系统字体栈，避免缺字导致风格断裂。
3. 若确实希望用户内容也统一风格，则把子集扩到 **GB2312 一级（176 KB base64）** 并**保留系统字体兜底**——覆盖率已足够高，缺字时自然回退。

用 `unicode-range` 精确框定子集字体生效范围是可行的（也只作用于该范围），这正好让 1/2 可以共存。

---

## 7. 12–13px 清晰度：本次最硬的结论

### 7.1 像素网格实测（坐标 GCD 法）

方法：取字形（`H`/`M`/`o`/`x`/`g`/`0`/`汉`）全部轮廓坐标，求其最大公约数 → 该值是「1 个设计像素」占多少 font units；`upem / GCD` = 设计网格（em 有多少像素）。

| 字体 | upem | 坐标 GCD | 设计网格 | 性质 |
|---|---|---|---|---|
| **Ark Pixel 12px** | 1,200 | **100** | **12.00 px** | ★ 严格点阵 |
| **Fusion Pixel 12px** | 1,200 | **100** | **12.00 px** | ★ 严格点阵 |
| Zpix | 1,200 | 100 | 12.00 px | ★ 严格点阵 |
| **Press Start 2P** | 1,000 | **125** | **8.00 px** | ★ 严格点阵 |
| Silkscreen | 1,000 | 125（直线）/ 5（圆角） | 8 px 主体，轮廓有亚网格细节 | 近似 |
| Pixelify Sans | 1,000 | 1 | — | 纯矢量 |
| DotGothic16 | 1,000 | 1 | — | 纯矢量 |
| Unifont | 64 | — | 8×16 / 16×16 点阵（CFF） | 点阵（未做渲染实测） |

### 7.2 渲染锐利度实测（freetype，半灰像素占比）

「半灰占比」= 灰阶 1–254 的像素 / 非空像素。**0.0% = 完美点阵对齐**（每个像素非黑即白）。

**拉丁文本 `Windose 12:34`：**

| 字体 | 8px | 11px | **12px** | **13px** | 16px | 24px | 32px | 48px |
|---|---|---|---|---|---|---|---|---|
| **Ark Pixel 12px** | 100% | 77.2% | **0.0% ★** | **86.5%** | 71.5% | **0.0% ★** | 36.2% | **0.0% ★** |
| **Fusion Pixel 12px** | 100% | 77.2% | **0.0% ★** | **86.5%** | 71.5% | **0.0% ★** | 36.2% | **0.0% ★** |
| Zpix | — | 78.4% | **0.0% ★** | 87.6% | 69.7% | **0.0% ★** | — | **0.0% ★** |
| **Press Start 2P** | **0.0% ★** | 48.3% | 36.2% | 44.0% | **0.0% ★** | **0.0% ★** | **0.0% ★** | **0.0% ★** |
| Silkscreen | 34.9% | 81.3% | 56.3% | 69.8% | 20.7% | 12.4% | 9.6% | 9.3% |
| Pixelify Sans | 100% | 100% | 93.2% | 87.8% | 79.2% | 69.6% | 56.1% | 42.4% |
| DotGothic16 | — | 99.6% | 99.2% | 99.2% | 85.9% | 51.7% | — | — |

**中文字形 `设置好友窗口`：**

| 字体 | 11px | **12px** | **13px** | 14px | 16px | 24px |
|---|---|---|---|---|---|---|
| **Ark Pixel 12px** | 99.1% | **0.0% ★** | **63.3%** | 62.3% | 57.6% | **0.0% ★** |
| **Fusion Pixel 12px** | 97.9% | **0.0% ★** | **67.0%** | 63.7% | 59.3% | **0.0% ★** |
| Zpix | 96.6% | **0.0% ★** | 64.2% | 61.9% | 60.3% | **0.0% ★** |
| DotGothic16 | 99.2% | 98.7% | 96.1% | 72.9% | 61.2% | 61.7% |

**12px 网格倍数的完整验证**（Ark Pixel 12px，拉丁+中文混合 `设置W12`）：

| 字号 | 12 | 24 | 36 | 48 | 9 | 10 | 11 | 13 | 14 | 15 | 18 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 半灰 | **0.0% ★** | **0.0% ★** | **0.0% ★** | **0.0% ★** | 98.8% | 98.4% | 96.6% | **74.3%** | 69.6% | 65.6% | 48.2% | 53.2% |

### 7.3 结论：**12px 锐利，13px 明确不清晰**

- **12px 点阵字体（Fusion / Ark / Zpix）在 `font-size: 12px` 下是绝对锐利的**（半灰 0.0%，每个像素非黑即白）。这是本主题 UI 应当使用的字号。
- **`13px` 是这套字体的最差字号之一**：拉丁 86.5%、中文 67.0% 的像素是灰色 —— 笔画变虚、粗细不均、像素方块糊成一片。**建议把 13px 从设计稿中移除**（12px 网格字体只能安全使用 12 / 24 / 36 / 48px）。
- **Press Start 2P 不要用于 12–13px**：它是 8px 网格，12px（36.2%）和 13px（44.0%）都模糊，**16px 才完美**。
- Silkscreen / Pixelify Sans / DotGothic16 从来不是「锐利点阵」（任何字号都达不到 0%），它们是抗锯齿的矢量像素**风**字体 —— 12px 下可读、平滑，但不会有真点阵的硬边像素感。

### 7.4 ⚠️ Windows 显示缩放（DPR）会破坏像素对齐

以上实测均在 **DPR = 1**（100% 缩放）下。WebView2 在 Windows 上常见 125% / 150% 缩放：

- DPR = 1.25 时，`font-size: 12px` → **15 设备像素**，而字体设计是 12 像素网格 → 非整数缩放 → **出现半灰、糊**。
- 可用媒体查询按 DPR 补偿（**未实测，属建议方案**）：
  ```css
  /* DPR 1.25 → 期望 12 设备像素 → 9.6 CSS px */
  @media (min-resolution: 1.25dppx) and (max-resolution: 1.25dppx) {
    .some-scope { font-size: 9.6px; }
  }
  /* DPR 1.5 → 8 CSS px */
  @media (min-resolution: 1.5dppx) and (max-resolution: 1.5dppx) {
    .some-scope { font-size: 8px; }
  }
  ```
  但 8px 中文点阵字体本身笔画会糊成一团，**建议在 DPR≠1 时接受轻微灰边**（比压缩字号更可读），或用 `font-size: 24px` 的大字号场景（DPR 1.5 → 36 设备像素 = 12 的倍数 ✓）。
- 另可试探 `-webkit-font-smoothing: none;`（Chromium 下关闭抗锯齿）——**在 WebView2 上的实际效果未验证**，需实测；且该属性属非标准、可能影响全局其他文本渲染。
- **本次未在真实 WebView2 中做渲染截图验证**，上述半灰数据来自 freetype 光栅化，与 Chromium/Skia 的具体光栅化可能有差异（趋势一致，绝对数值不保证一致）。**标注：WebView2 实机验证未做。**

---

## 8. 推荐配置（可直接落地的 CSS 骨架）

> 以下片段为**报告内容**，未写入主题仓库；实际落地时再按主题目录规范提交。

### 8.1 拉丁（方案1，内联 ASCII 子集）

```css
/* Silkscreen Regular — ASCII 子集，base64 2,264 B；需自己用 pyftsubset 重新生成 */
@font-face {
  font-family: "Windose Pixel Latin";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,<SILKSCREEN_ASCII_B64>) format("woff2");
  unicode-range: U+0020-007E;
}
```

生成命令：
```bash
pyftsubset Silkscreen-Regular.ttf --unicodes=U+0020-007E \
  --flavor=woff2 --no-hinting --desubroutinize --output-file=silk-ascii.woff2
base64 -w0 silk-ascii.woff2
```

### 8.2 中文（内联子集，推荐）

```css
/* Fusion Pixel 12px — VRCX UI 字符子集，base64 54,652 B（943 汉字 + ASCII + 标点） */
@font-face {
  font-family: "Windose Pixel CJK";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,<FUSION_UI_SUBSET_B64>) format("woff2");
}
```
用法（**务必保留系统兜底 + 锁死 12px**）：
```css
.pixel-scope {
  font-family: "Windose Pixel Latin", "Windose Pixel CJK",
               "Microsoft YaHei UI", "Segoe UI", sans-serif;
  font-size: 12px;          /* ★ 不要用 13px */
  line-height: 16px;        /* 16px 亦为 4 的倍数，保持栅格一致 */
  font-synthesis: none;
  letter-spacing: 0;
}
```

### 8.3 中文（方案2，远程分片，需 `remoteAssets: true`）

```css
/* 只列出实际需要的关键片；完整 78 片见包内 CSS（70,892 B）
   ★ 相对路径必须换成 jsDelivr 绝对 URL ★ */
@font-face {
  font-family: "Windose Pixel CJK";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://cdn.jsdelivr.net/npm/@vp-tw/cjk-web-fonts-fusion-pixel-font@0.0.1/dist/12px/proportional/zh_hans/Fusion-Pixel-12px-Proportional-Simplified-Chinese.Basic-Latin.woff2) format("woff2");
  unicode-range: U+20-7E;
}
@font-face {
  font-family: "Windose Pixel CJK";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://cdn.jsdelivr.net/npm/@vp-tw/cjk-web-fonts-fusion-pixel-font@0.0.1/dist/12px/proportional/zh_hans/Fusion-Pixel-12px-Proportional-Simplified-Chinese.CJK-Unified-Ideographs-001.woff2) format("woff2");
  unicode-range: U+4E00-4FFF;   /* ★ 必须照抄包内 CSS 的真实 unicode-range，此处仅为示意，不可照抄 */
}
/* …002 至 019 同理… */
```

> ⚠️ 上面 `unicode-range: U+4E00-4FFF` 是**示意值**，主题落地时**必须从包内 CSS 逐条照抄真实 `unicode-range`**，否则分片命中错误会导致乱码/缺字。包内 CSS 路径见 §5.1。

---

## 9. 未确认事项与风险清单

| 项 | 状态 |
|---|---|
| Silkscreen **Bold** 700 的 ASCII 子集 base64 | **未实测**（仅估算 2.3–3.1 KB） |
| 方案2 中「只挑 24 条 `@font-face`」的裁剪后 CSS 字节数 | **未实测**（按 70,892/78≈909 B/条估算约 21 KB） |
| Zpix 官方站点是否有 CORS 友好的 webfont CDN | **未确认**（首页 HTML 未发现直链；未深查，因许可已排除） |
| Unifont 的 12–13px 渲染清晰度 | **未实测**（因无 CORS + 5.07 MB 已出局） |
| `-webkit-font-smoothing: none` 在 WebView2 上对点阵字体的实际效果 | **未验证** |
| DPR 1.25 / 1.5 下的媒体查询补偿方案 | **未在真机验证**（属建议） |
| 真实 WebView2 / Chromium 光栅化 vs freetype 光栅化的数值差异 | **未验证**（趋势可信，绝对半灰百分比可能有偏差） |
| `@vp-tw/cjk-web-fonts-fusion-pixel-font` 的长期维护性 | 版本 **0.0.1**、上游锁定 2026.08.11（落后 TakWolf 2026.09.25 一版）；第三方供应链 |
| base64 内联字体是否会被审核视为「intentionally unreadable CSS」 | 主观判定风险（`CONTRIBUTING.md:81`）；base64 是必需的二进制编码而非混淆，但需在 PR 中说明 |
| VRCX-0 主程序是否已有字体相关 CSS 变量钩子可覆写 | **未查**（`docs/css-hooks.md` 中 grep `font` 无结果；可能需靠普通选择器 + `!important`） |

---

## 附录 A：实测环境与复现

### A.1 工具

```
Python 3.12.3（系统 Python 无 pip → 用 venv 隔离）
/tmp/pixfont/venv/bin/pip install fonttools brotli    → fonttools 4.66.1 + brotli
/tmp/pixfont/venv/bin/pip install freetype-py         → libfreetype 2.13.2
```

### A.2 下载物（全部位于 `/tmp/pixfont/`，未写入任何仓库）

| 文件 | 字节数 | 来源 |
|---|---|---|
| `gf/ps2p-latin.woff2` | 12,512 | `fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2` |
| `gf/silk-latin.woff2` | 8,404 | `fonts.gstatic.com/s/silkscreen/v6/m8JXjfVPf62XiF7kO-i9YLNlaw.woff2` |
| `gf/silk-latinext.woff2` | 3,436 | `fonts.gstatic.com/s/silkscreen/v6/m8JXjfVPf62XiF7kO-i9YL1la1OD.woff2` |
| `gf/pif-latin.woff2` | 7,692 | `fonts.gstatic.com/s/pixelifysans/v3/CHy2V-3HFUT7aC4iv1TxGDR9DHEserHN25py2TTp0E1fZZM.woff2` |
| `gf/dot-latin.woff2` | 10,508 | `fonts.gstatic.com/s/dotgothic16/v22/v6-QGYjBJFKgyw5nSoDAGH7M6X8.woff2` |
| `gf/dot-latinext.woff2` | 1,940 | `fonts.gstatic.com/s/dotgothic16/v22/v6-QGYjBJFKgyw5nSoDAGH7C6X9oPA.woff2` |
| `dl/ttf/DotGothic16-Regular.ttf` | 2,069,236 | `cdn.jsdelivr.net/gh/google/fonts@main/ofl/dotgothic16/DotGothic16-Regular.ttf` |
| `dl/ttf/PressStart2P-Regular.ttf` | 118,204 | `cdn.jsdelivr.net/gh/google/fonts@main/ofl/pressstart2p/PressStart2P-Regular.ttf` |
| `dl/ttf/Silkscreen-Regular.ttf` | 32,220 | `cdn.jsdelivr.net/gh/google/fonts@main/ofl/silkscreen/Silkscreen-Regular.ttf` |
| `dl/zpix.woff2` | 966,704 | release v3.3.0 |
| `dl/unifont.otf` | 5,320,148 | `ftp.gnu.org/gnu/unifont/unifont-18.0.01/unifont-18.0.01.otf` |
| `dl/ark12p-ttfwoff2.zip` | 5,327,390 | release 2026.09.25 |
| `dl/fus12p-ttfwoff2.zip` | 6,539,160 | release 2026.09.25 |
| `dl/vp-fus.tgz` | 18,502,395 | `registry.npmjs.org/@vp-tw/cjk-web-fonts-fusion-pixel-font/-/...-0.0.1.tgz` |
| `dl/x/ark-pixel-12px-proportional-zh_hans.ttf.woff2` | 755,952 | Ark release zip 解包 |
| `dl/x/fusion-pixel-12px-proportional-zh_hans.ttf.woff2` | 928,148 | Fusion release zip 解包 |
| `gf/` 内 DotGothic16 CSS | 113,534 | `fonts.googleapis.com/css2?family=DotGothic16`（123 条 `@font-face`） |

### A.3 脚本

| 脚本 | 作用 |
|---|---|
| `/tmp/pixfont/cov.py` | cmap 覆盖率（ASCII / Latin-1 / GB2312 一级 / GB2312 全部 / 假名 / CJK 标点 / 全角） |
| `/tmp/pixfont/grid.py`、`grid2.py` | 像素网格测定（轮廓坐标 GCD） |
| `/tmp/pixfont/sharp.py`、`sharp2.py` | freetype 渲染半灰像素占比（12/13px 清晰度） |
| `/tmp/pixfont/hit.py` | 用 `zh-CN.json` 真实 UI 汉字做 unicode-range 分片命中与体积模拟 |
| `/tmp/pixfont/subgb.py`、`subui.py` | 字符集生成 + pyftsubset 子集体积实测 |

### A.4 许可原文链接汇总

| 字体 | 许可原文 |
|---|---|
| Press Start 2P | <https://raw.githubusercontent.com/google/fonts/main/ofl/pressstart2p/OFL.txt> |
| Silkscreen | <https://raw.githubusercontent.com/google/fonts/main/ofl/silkscreen/OFL.txt> |
| Pixelify Sans | <https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/OFL.txt> |
| DotGothic16 | <https://raw.githubusercontent.com/google/fonts/main/ofl/dotgothic16/OFL.txt> |
| Fusion Pixel | <https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL>（README 第 113–135 行分层说明） |
| Ark Pixel | <https://github.com/TakWolf/ark-pixel-font/blob/master/LICENSE-OFL>（README 第 108–118 行分层说明） |
| Unifont | <https://unifoundry.com/OFL-1.1.txt> + <https://unifoundry.com/LICENSE.txt>（GPL-2.0+ 嵌入例外） |
| Zpix | ❌ 无 OFL/LICENSE 文件；<https://github.com/SolidZORO/zpix-pixel-font/blob/main/README.md> 商业授权条款 |
| @vp-tw 重打包包 | `MIT AND OFL-1.1`；<https://github.com/vp-tw/cjk-web-fonts> |

### A.5 只读引用

- `/home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/CONTRIBUTING.md`（第 62、66–81、83–89、106、116 行）
- `/home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/scripts/validate-themes.mjs`（第 191 行，唯一的体积校验）
- `/home/fulutang/Documents/Github/VRCX-0-jirai/src/localization/zh-CN.json`（UI 汉字来源，只读）

> 本次调研**未修改任何仓库文件**（主题仓库、主程序均只读），**未 git 操作**，**未运行构建**；下载与生成物全部位于 `/tmp/pixfont/`。
