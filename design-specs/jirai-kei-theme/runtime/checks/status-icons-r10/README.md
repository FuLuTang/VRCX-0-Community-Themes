# R10 status icons 与 SOCIAL phone fixture

**状态：本地预览包已重建；未部署生产主题。** Phone CSS 和 PNG 只用于本目录的静态 fixture，没有接入 runtime builder。

## Toast sprites

[`status-icons-r10.css`](../../status-icons-r10.css) 给 success/error 使用静态 PNG；info/warning 复用原有 toast icon slot，以 crisp shock 表情层和独立描边 PNG 替代默认 SVG。描边与表情之间保留完整 1 格透明间隔；只对描边外缘用 2×2 四点覆盖率计算 alpha，内缘和间隔保持硬边透明。info 为浅粉 `#ffaddf`，warning 为状态橙 `#e97c03`；loading 不变。未改 DOM、文案、ARIA 或焦点行为。

- 360px toast：success/error 高度仍为 68/108px，与基线一致。
- 288px toast：长 error 文案多换一行，卡片增高 20px；其余高度变化只由文本换行解释。
- info/warning 仍沿用原有 icon slot；loading 保持 opacity 0.8、spin。焦点 outline 保持 2px。
- 描边 PNG 的 2×2 四点覆盖率会产生预期的半透明像素；仅作用于外缘，不污染原表情层或透明间隔。

## SOCIAL phone fixture

[`fixture.html`](fixture.html) 链接生成的 [`social-phone-layers-audit.css`](social-phone-layers-audit.css)。[`social-phone-layers-audit.template.css`](social-phone-layers-audit.template.css) 的几何值和 PNG data URI 均由 [`verify.mjs`](verify.mjs) 从 [`manifest.json`](../../../original-assets/r10-phone-layers/manifest.json) 与其 PNG 生成；**不要手抄尺寸/偏移，也不要改动源素材生成器**。

| Layer | Logical bounds / offset | PNG bytes |
| --- | --- | ---: |
| char-back | 20×20 @ (0,0) | 315 |
| phone-front | 7×12 @ (17,8)，tap @ (18,8) | 183 |
| glow-dim | 14×13 @ (3,7) | 211 |
| glow-bright | 14×13 @ (3,7) | 211 |

四张 PNG 共 920 bytes；Base64 payload 共 1,232 bytes；四个 `url(data:...)` 声明共 1,348 bytes；生成的 fixture CSS 共 **9,505 bytes**。Glow 使用 indexed+tRNS 半透明 alpha；dim/bright 分别有 8 个渐变 alpha 档，峰值 64/128；H1 眼睛高光 `(9,12)`、`(14,12)` 的 dim alpha=128、bright alpha=255。dim 的 tRNS 为10字节（显式编码 H1 高光），通过等像素 PNG 行过滤保持 pngBytes/base64Bytes 不变；bbox、尺寸、offset 不变。整层指定 `image-rendering: pixelated`。

CSS background 的绘制顺序为 `phone-front > glow > char-back`（从前到后），即视觉层级 `char-back < glow < phone-front`。Glow 的显隐只通过 background-position 移出画布，隐藏偏移由 manifest bounds 生成；没有切换图片变量。Canvas 为 68×22px，25 格最小宽度可容纳 tap phone 右缘 x=24；320/240px panel 的 canvas 左偏移为 163/83px，距控件 rail 均留 52px。

本节的动画仅描述旧的 17 帧 audit fixture：六层 `background`、4s、`steps(17,end)`、delay `-2s`，17 帧间隔约 235.294ms。Tap 在帧 3/5；dim glow 在 9/10/12/14/15，bright 在 11，其余帧移出画布。当前导航小人已改为独立的 153 帧/250ms 动画，见 `runtime/nav-phone-r10.css`。

## Browser verification

[`layout-report.json`](layout-report.json) 是完整测试结果。真实 Chromium 截图覆盖 panel W=320/240、DPR 1/2，以及 normal、`prefers-reduced-motion`、`html.reduce-effects` 三种状态；每个尺寸/DPR 另有完整 17 帧 contact sheet：

- [W320 / DPR1，17 帧](social-phone-frames-w320-dpr1.png) · [W240 / DPR1，17 帧](social-phone-frames-w240-dpr1.png)
- [W320 / DPR2，17 帧](social-phone-frames-w320-dpr2.png) · [W240 / DPR2，17 帧](social-phone-frames-w240-dpr2.png)
- **Contact sheet 只作为节奏总览；细节请看单帧图。** 单帧 8×：[F03 tap](social-phone-frame-f03-tap-8x.png) · [F05 tap](social-phone-frame-f05-tap-8x.png) · [F09 dim](social-phone-frame-f09-dim-8x.png) · [F11 bright](social-phone-frame-f11-bright-8x.png) · [F13 rest](social-phone-frame-f13-rest-8x.png)。
- 并排 8×：[F03 tap vs F01 rest（手机右移/左耳）](social-phone-f03-vs-f01-8x.png) · [F11 bright vs F09 dim（照亮扩散）](social-phone-f11-bright-vs-f09-dim-8x.png)。
- 静态模式例图：[normal W320/DPR1](social-phone-w320-dpr1-normal.png) · [prefers-reduced-motion](social-phone-w320-dpr1-reduced.png) · [html.reduce-effects](social-phone-w320-dpr1-html-reduce-effects.png) · [normal W240/DPR2](social-phone-w240-dpr2-normal.png)；其余尺寸/模式见报告 `phoneFramework.screenshots`。
- [Glow 1× 实际截图对比，8× 最近邻放大供检查](social-phone-glow-1x-compare-8x.png)（测量仍使用未放大的 DPR1、1 CSS px/格截图）

## 动画预览与 H1 定稿

- 旧的 17 帧、4,000ms `social-phone-loop-*` GIF/WebP 与关键帧导出已清理；本目录保留的 17 帧截图矩阵仅用于 H1 glow/逐像素合成审计，不是当前动画。当前导航小人请看 [153帧 GIF](../nav-phone-r10/phone-animation-153frames.gif) 与 [153帧联系表](../nav-phone-r10/phone-animation-153frames-contact.png)；CSS 源在 [`nav-phone-r10.css`](../../nav-phone-r10.css)，每帧180ms（27.54秒一轮），并含独立浮动。
- 眼珠高光已定稿为 **H1**：主 dim 高光 alpha=128、bright=255；`build-runtime.mjs` 已把含 H1 的分层导航动画编入本地预览包，只有本目录的旧17帧 fixture 仍为审计专用。此前候选对照图留档：[eye-highlight-face-16x.png](eye-highlight-face-16x.png) 与 [eye-highlight-compare-8x.png](eye-highlight-compare-8x.png)；其报告是采纳前的实测记录，H1 dim 合成色 `#afb7d5`、H2 alpha96 为 `#9da7ca`、bright `#f8fcff`，见 [eye-highlight-preview-report.json](eye-highlight-preview-report.json)。H2 候选 PNG 仍保留在原始素材候选目录。

帧 3/5 在 W320/240、DPR1/2 的 25×20 crop 与 manifest 图层合成**逐像素一致**；tap 耳格 `(18,8)`、`(19,8)` 均为 RGBA `(123,95,128,255)`，耳朵完整，没有旧手机边框竖线残影。半透明 glow 的浏览器合成与离线参考最多相差 2 个 channel LSB，且差异全部局限在 glow bbox；框外差异为 0。

DPR1、W320 的 25×20 phone crop 相邻帧差值（`changedPixels`；`meanAbsRgbDelta` 是全 crop 的均值）：

| 转场 | 改变像素 | 均值 | 最大 channel 差 |
| --- | ---: | ---: | ---: |
| F08→F09（off→dim） | 142 | 1.791 | 146 |
| F09→F10（dim 持续） | 0 | 0 | 0 |
| F10→F11（dim→bright） | 140 | 1.324 | 18 |
| F11→F12（bright→dim） | 140 | 1.324 | 18 |
| F12→F13（dim→off） | 142 | 1.791 | 146 |
| F13→F14（off→dim） | 142 | 1.791 | 146 |
| F14→F15（dim 持续） | 0 | 0 | 0 |
| F15→F16（dim→off） | 142 | 1.791 | 146 |

1 CSS px/格下，dim **偏弱但可辨**（发束、粉色格有轻微冷白变化）；bright **可辨但克制**，不是强 bloom。帧间像素计数及截图都在报告中；没有用放大图替代 1× 判断。

## Builder boundary

[`build-runtime.mjs`](../../build-runtime.mjs) 同时读取 [`status-icons-r10.css`](../../status-icons-r10.css) 与当前导航动画源 [`nav-phone-r10.css`](../../nav-phone-r10.css)。旧的 17帧 `social-phone-layers-audit.template.css`/PNG 仍仅供本目录 fixture 审计，不进入 builder；当前 153帧分层导航动画已进入本地预览包。最新 [`build-report.json`](../../build-report.json)：总 CSS 1,046,093 / 1,048,576 bytes，`nav-phone-r10` section 16,543 bytes；这只是本地预览包，不是部署。
