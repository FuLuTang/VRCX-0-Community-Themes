# SOCIAL 看手机精灵分层（内部审阅，r4：glow 改半透明叠加层）

> 源图为本地 NSO/Fandom 拼图，复用许可未知；这些素材仅供项目内部预览和验证，未获授权前不要公开分发。`char-back` 与 `phone-front` 原始层保持冻结；导航小人运行时 CSS 另含 48 帧动画及本文件记录的 gaze 覆盖层，未改既有 `r10-status-toast-icons` 素材。

## 导航抬眼修正 r10

`char-back` / `phone-front` 保持冻结。mid 与 forward 都是 8×4 PNG，统一 offset (7,11)，对齐同一眼部画布；`?` 格沿用 char-back 原像素。每眼从左至右 x=7..9 / 12..14，rest → mid → forward 的 4 行分别为：`MMM / ?XX / ?xx / ?oo` → `MXX / ?xx / ?oo / ?FF` → `MXD / ?xY / ?oo / ?FF`。其中 M=`#7b5f80`、X=`#6673aa`、D=`#596493`、x=`#87a5d9`、Y=`#778cc2`、o=`#bbddff`、F=`#ffebfa`；Y 是 X 与 x 的 RGB 中点，应用于 forward 两眼的 B 格 `(y12,x9)` / `(y12,x14)`；末行脸色覆盖原底部瞳孔，不留蓝色残影。CSS base64 与对应源 PNG 字节一致；F25/F33 显示 mid，F26..32 显示 forward。48 帧、19.2 秒循环与其它节拍不变。

## 画布要求（重要）

**SOCIAL 画布至少 25 格宽 × 20 格高。** 源裁切是 24×20，`phone-front` 占 x=17..23（7 格宽），点击帧把它右移 1 格后占 x=18..24，所以必须有第 25 列。四个基础 PNG 的偏移仍相对 24×20 网格（x=24 列在基础层中为空）；新增 gaze 覆盖层以源画布坐标定位，预览和时间轴使用 25×20 格画布。

## 资产与布局

输入为 `art-references/nso-fandom-desktop-icons-sheet.png` 中 `(302,450,96×80)` 的手机姿势，按 4×4 原始像素块采样为 24×20 网格。`char-back` / `phone-front` 是调色板索引色、alpha 仅 0/255（**r3 起冻结，r4 未改动，verify 用 SHA-256 锁定**）；`glow-dim` / `glow-bright` 是 **4-bit 索引色 + tRNS 的半透明叠加层**（10 个调色板项：透明 + 8 档叠加 alpha + 1 个不透明高光）。每层裁到最小非透明 bbox：

| 层 | PNG 尺寸 | bbox 偏移 (x,y) | 非透明格 | PNG / Base64 字节 | 用途 |
|---|---:|---:|---:|---:|---|
| `char-back` | 20×20 | (0,0) | 310 | 315 / 420 | 角色底层，含 21 个由 ≥2 张姿势一致补入（或共享）的手机遮挡格 |
| `phone-front` | 7×12 | (17,8) | 79 | 183 / 244 | 手机整体；点击时右移 1 格；含共享左耳格 (18,8) |
| `glow-dim` | 14×13 | (3,7) | 142（含 2 个眼珠高光） | 211 / 284 | 冷白叠加层，峰值 alpha 64（0.25） |
| `glow-bright` | 14×13 | (3,7) | 142（同形状） | 211 / 284 | 同形状，峰值 alpha 128（0.50）；每格 alpha = 2 × dim |

叠放顺序：`char-back` → `glow-*` → `phone-front`。四层 PNG 共 **920 B**，Base64 共 **1,232 B**，四条预估 data-URI 声明合计 **1,465 B**（不含选择器/动画规则），低于 2.5 KB（r3 为 734 / 980 / 1,213 B）。glow 的索引 PNG 比同内容的 RGBA PNG 小（dim 211 vs 238 B，bright 211 vs 245 B），所以选索引 + tRNS。`char-back` 与 `phone-front` 使用相同的 18 色源调色板（外加透明索引），未做颜色量化。

glow 的 SVG 仍随附（仅供审阅，不进 CSS）：每格一条 `<path fill=… fill-opacity=alpha/255>`，4 位小数可无损还原 8 位 alpha（verify 已逐格比对）。

## A. 遮挡格补入规则：≥2 张一致就拷贝（r3）

规则（`generate.mjs` 与 `verify.mjs` 各自独立实现）：对 79 个手机遮挡格，取 happy / shock / awkward 三姿势的同一格（awkward 在 phone 行 y=6..14 取 y+1，其余恒等），去掉效果色后，**只要 ≥2 张给出相同的头发/辫子色就直接拷贝进 `char-back`**。只有 1 张给出头发色的格记为 `single-vote`，在报告里单列（默认只在没有任何姿势给出“空”时才保留）。不再使用 r2 的行 guard 判定（仅留作对齐证据）。

对 r2 并集规则的核对结果：**没有任何格不符**。r2 的 20 个补入格 + 共享耳格 (18,8) 共 21 格全部有 ≥2 张一致；其中 15 格三张一致，6 格恰好两张一致：`(18,11) (18,12) (18,13) (18,14)` 为 `#7b5f80`，`(17,12) (17,13)` 为 `#c4a3ef`。这 6 格都依赖 awkward 的 +1 行对齐才凑够 2 张（happy 在这些格是效果色或 guard 失败）；对齐证据：awkward 平移 +1 后 y=6..14 的辫子列 x=15,16 逐行 9/9 吻合，不平移则不是。**single-vote 格数 = 0，无法补的格 = 0，`conflict` = 0。** 其余 58 个遮挡格至少 2 张为背景（或效果+背景），保持透明。完整逐格表见 [braid-evidence.md](../../runtime/checks/r10-phone-layers/braid-evidence.md)。

补入格（21）：蝴蝶结/描边 `(18,9)#d94cb4 (18,10)#d94cb4 (19,9)#7b5f80 (19,10)#7b5f80`；辫子第三列 `(17,10)#ddbfee (17,11)#ddbfee (17,12..17)#c4a3ef`；辫子右描边 `(18,11..17)#7b5f80 (17,18)#7b5f80`；共享耳格 `(18,8)#7b5f80`（此前已在 char-back，r3 起同时进入 phone-front）。

## B. 手机左侧缺口

逐格检查 x=14..19、y=6..19（84 格）：46 格是手机姿势里可见的源像素，21 格由 ≥2 张一致补入，17 格被 ≥2 张姿势确认为背景；**char-back 没有“其他姿势 ≥2 张一致但这里透明”的洞**（整画布扫描也为 0）。x=16 整列与手机姿势完全相同。

真正的缺口出现在点击帧：`(18,8)` 既是头发描边也是手机左耳的第一格，r2 只留在 char-back，手机右移后左耳少一格，`(19,8)` 变成透明洞。r3 把 `(18,8)` 同时放进 `phone-front`（共享格，合成仍逐格等于原图），点击帧左耳为 `(18,8)` 描边 + 位移后的 `(19,8)(20,8)`，完整。

点帧（帧 3、帧 5，像素一致）逐格审计 x=14..24、y=6..19：被位移手机覆盖的格必须等于 `phone-front` 原格；其余格必须等于 ≥2 张一致的颜色/背景。结果 0 问题；x=17 整列只来自 char-back（`#ddbfee #ddbfee #c4a3ef…`），手机边框色 `#7b5f80` 只在 `(17,18)`（辫尖描边，其他姿势同样有）；没有竖线残影，没有背景穿帮，x=16 不变。8× 放大图见 [tap-frames-8x.png](../../runtime/checks/r10-phone-layers/tap-frames-8x.png)（黄=补入，粉=共享耳格，红=r2 的耳洞）。

## C. 照亮层 r4：半透明冷白叠加（从鼻梁向四周连续减弱）

r3 的离散“粉白替换”被否决：整块近白色替换色把脸糊成面具、偏粉、眼睛/描边格被挖空、环与环互相断开。r4 不替换任何像素，只在 `char-back` 上叠一层半透明冷白，原色始终透出来。

- **光心**：沿用鼻梁线 `(10,14)/(11,14)`，中线 x=10.5。
- **距离**：`d` = 到最近光心格的欧氏距离（x≤10 时 dx=10−x；x≥11 时 dx=x−11；dy=y−14），光心两格 d=0。
- **衰减**（raised cosine，中心 1、边缘 0 且斜率为 0，不存在硬半径）：`f(d) = 0.5·(1+cos(π·d/R))`，`R = 9` 格，d≥R 时为 0。
- **量化**：`level = round(8 · f(d) · k)`，8 档；`alpha8 = round(peak · level / 8)`。dim 峰值 64（0.251），bright 峰值 128（0.502）。两层**渐变格**的 level 图完全相同，只差峰值，所以 bright 每格渐变 alpha = 2 × dim；眼珠高光是独立覆盖值，不套用这个倍数。相邻渐变档差：dim 8/255（0.031）、bright 16/255（0.063），在粉/脸皮上相邻档色差很小，无可见带状。
- **类别系数 k**：描边 `#7b5f80` 与眼珠深色 `#6673aa` → 0.3；眼珠中间色 `#87a5d9` → 0.6；其余（脸皮、粉、奶白发、薰衣草发、蝴蝶结……不按原色跳过）→ 1。深色格因此变淡而不是挖空（22 个深色格仍有 alpha，f≥0.5 的深色格 level 必须 ≥1）。
- **覆盖**：只在“手机姿势里有像素且不在 phone-front 之下”的格输出（脸颊、鼻周、下巴、眼周、刘海、脸侧发束、近手机侧 x=15..16 的辫丝）。142 格；level 1…8 的格数 = 26 / 41 / 23 / 8 / 13 / 9 / 11 / 11。
- **颜色**：叠加色一律 `#eef6ff`（色相 210°、HSV 饱和度 6.7 %，落在建议窗口 `#eef6ff…#f4faff` 的偏冷一端；无粉/暖分量）。选偏冷端的理由：脸皮 `#ffebfa` 本身已近白（L\*95），白色叠加提不了多少亮度，可感知的“被屏幕光照到”主要来自去粉、偏冷蓝白；各档用同一颜色，衰减全靠 alpha 阶梯。眼珠高光 `#f8fcff`（色相 205°、饱和度 2.8 %）；已采纳 H1：dim alpha=128，bright alpha=255。
- **眼珠高光（H1 已采纳）**：从 char-back 实际像素读出眼珠：左眼 x=8..9，右眼 x=13..14（右眼 = 左眼平移 +5），各为 2×3（`#6673aa` 深 / `#87a5d9` 中 / `#bbddff` 浅）。高光放在**每只眼珠的右上格：`(9,12)` 与 `(14,12)`**，原色都是 `#6673aa` 深色格；dim alpha=128，bright alpha=255。亮帧保持满不透明，暗帧减弱以免高光抢眼；它不会参与渐变格的 2×峰值关系。理由：光源是右侧的手机，两只眼珠的高光落在同一相对位置（朝手机一侧，对着同一光源），顶行最深，对比最强。眼框里原有的白点只有左眼的 `(7,14)` `#fdfdfd`（和 `(7,12)(7,13)` 的 `#e2e5e0` 一起属于眼白），不在眼珠内，没有被覆盖；右眼没有对应白点。严格镜像位置 (12,12) 是脸皮格，不能用。
- **色差**（CIE76，叠加后对原色）：脸皮 `#ffebfa` 在 dim 峰值 → `#fbeefb` ΔE 2.7，bright 峰值 → `#f6f1fd` ΔE **5.6**（r3 白面具 ΔE 10.6）；bright 峰值时脸皮 a\*=+3.8、C\*=6.4（原 10.5），粉色仍可见但偏冷。粉 `#f4b7d9` bright 峰值 → `#f1d7ec` ΔE 16.7。
- **bright 峰值候选**：0.40 / 0.50 / 0.60，脸皮 ΔE76 4.1 / 5.6 / 6.4，C\* 7.4 / 6.4 / 5.7；三档都不是面具，推荐 **0.50**（主文件）；想更醒目可用 0.60，只需改 `generate.mjs` 的 `peakAlpha.bright`（153）。对比图 `glow-bright-candidates-8x.png`。

局限：脸皮格本来就接近白，所以脸中央的变化很克制；在 1×（1 CSS px/格）下 dim 几乎只能看到发束与粉格略变亮变冷，bright 才能辨认。若 1× 下仍嫌不明显，优先提高 bright 峰值（0.60）而不是加大半径。`R=9` 时 `(13..16,6..7)` 的上排刘海离得太远（d≥7.6），level 为 0；`(13..15,8)`、`(14..16,9)` 都已点亮。口位置在手机姿势里没有精灵，所以嘴中心格没有额外处理。

旧版（r3）素材留存在 [legacy-r3/](legacy-r3/)，仅用于对照预览，不会被使用。

## D. 强度分档候选 r5：c2「中等」/ c3「明显」（未被采用，等挑选）

r4 的 dim（0.251）/ bright（0.502）在实机上「几乎看不出脸被照亮了一下」。原因很具体：两层用的是**同一张 level 图**，只差 2 倍峰值，而脸皮本身已接近白（L\* 95），实际平均通道变化只有 1.3/255，所以在 1 CSS px/格 的尺寸下几乎不可见。c2/c3 不替换任何像素、也不放松 r4 的任何约束，只改衰减曲线形状与峰值：

- **衰减**由单段 raised cosine 改为两段取大：`g(d) = max(core(d), halo(d))`，其中 `core(d) = 0.5·(1+cos(π·d/R_core))` 是贴住中心的小亮斑，`halo(d) = haloTop·max(0, 1−(d/R_halo)^p)` 是大范围的淡光晕（`p = 3` 让边缘一阶导数仍为 0，所以依旧不存在硬半径）。
- **关键杠杆**：dim 与 bright 的 `R_halo` **不同**（c2 是 6 → 10，c3 是 5 → 10.5）。dim 是「刚点亮手机时脸中央的一小块光斑」，bright 时外圈整片格子从 alpha 0 变成有值——既有面积增长又有亮度增长，比把同一张图整体调亮有效得多。
- 中心亮斑 `R_core` 收窄到 6 / 5，所以中心是明确的「脸中央先亮」，而不是整张脸均匀泛白。

| 参数 | c1 现状（r4，冻结） | c2 中等 | c3 明显 |
|---|---|---|---|
| 叠加色 | `#eef6ff` | `#e8f2ff` | `#e2eeff`（色相 215°，更冷） |
| 衰减档数 N | 8 | 9 | 10 |
| `R_core` | 9（单段） | 6 | 5 |
| `R_halo` dim → bright | 无 | 6 → 10 | 5 → 10.5 |
| halo 峰值权重 | — | 0.6 | 0.52 |
| 峰值 alpha dim / bright | 64 / 128 | 77 / 204 | 90 / 242 |
| 峰值不透明度 dim / bright | 0.251 / 0.502 | 0.302 / 0.800 | 0.353 / 0.949 |
| 点亮格数 dim / bright | 142 / 142 | 96 / 194 | 70 / 207 |
| 中心色（叠在脸皮 `#ffebfa` 上） | `#f6f1fd` | `#edf1fe` | `#e3eeff` |
| 中心 ΔE76 vs 原色 | 5.60 | 8.48 | 10.84 |
| 中心 dim → bright ΔE76 | 2.89 | **5.33** | **6.90** |
| 中心色相（原色 332.9° 粉） | 306.3° | 279.0° | 267.6° |
| 光晕环 alpha（0–255） | —（R=9 已覆盖全部亮格） | 80 | 104 |
| 中心 → 光晕 ΔE76 落差 | — | 5.29 | 6.19 |
| 最外圈 alpha | 16 | 23 | 24 |
| 相邻档最大 alpha 差 | 16/255 | 23/255 | 25/255 |
| **实测 dim → bright 平均通道差** | **1.313** | **4.337** | **4.775** |
| 最大通道差 | 18 | 59 | 62 |
| 变化格数 / 504 px | 140 | 194 | 207 |
| 四条 data-URI base64（≤2500） | 1232 | 1264 | 1248 |

**实测方法**：用 Playwright 起真实浏览器，按运行时 CSS 的多层 `background-image` 合成顺序（`phone-front > glow > char-back`、`image-rendering: pixelated`、1 格 = 1 CSS px）渲染 320px 宽的面板，取 24×21 的头部裁切，比较 dim 与 bright 相邻帧。DPR1 与 DPR2 结果完全一致（pixelated 不做重采样）。测量明细见 [glow-strength-candidates-measurements.json](../../runtime/checks/r10-phone-layers/glow-strength-candidates-measurements.json)；verify.mjs 里还有一条**独立复算**：用 sharp 把解码出的图层重新合成一遍，c2 得 4.319、c3 得 4.778，与浏览器一致到 0.06 %。r4 基线在同一夹具下复现 1.313（与 r4 审计记录的 1.324 相符）。

**关于任务里那两条 ΔE 阈值（不可达，附证明）**：纯 alpha 叠加的结果必然落在「原色 → 叠加色」的线段上，因此 `ΔE76(结果, 原色) ≤ ΔE76(叠加色, 原色)`。脸皮 `#ffebfa`（L\* 94.98）对各个冷白的 ΔE76 上限分别是 `#eef6ff` 10.42、`#e8f2ff` 10.51、`#e2eeff` 11.18；再冷一档 `#dbe9ff` 是 12.56，但它的 HSV 饱和度 0.141 已超出「冷白」的合规上限（≤0.12），而且必须贴着完全不透明才逼近。所以 c2 的中心 ΔE 8.48 已是 `#e8f2ff` 上限的 81 %，c3 的 10.84 基本就是 `#e2eeff` 的极限；**中心 ΔE ≥ 11 / ≥ 16 只有在放弃「冷白」的前提下才可能**（那就是 r3 被否决的粉白面膜）。真正对应「看得出亮了一下」的物理量是**同一格在 dim 与 bright 之间的 ΔE76**（2.89 → 5.33 → 6.90）以及上表的像素差，这两项 c2/c3 都大幅超过基线。

三档都保持 r4 的全部硬约束，并已由 verify.mjs 逐格独立复算：alpha 只由距离决定且沿距离单调不升；alpha>0 的格构成单一 8 连通块；边缘接触未点亮格时 level ≤ 2（无硬边）；描边与深色眼珠仍按 k = 0.3 变淡而不挖空（c2 32 格 / c3 34 格）；两眼 1px 高光在 dim 与 bright 里都保持 `#f8fcff` alpha=255；被 phone-front 覆盖的格一律不发光；bright 每格 ≥ dim。中心亮斑收窄后中心区相邻格的 alpha 跨度变大（相邻档最大差由 16 升到 23–25），但每档在脸皮上的色差仍低于 3/255，看不出色带。

**仅 c2/c3 强度候选采用时才要同步改运行时 CSS**——其 bbox 与 r4 不同，只换图片会错位；当前选中的 c1+H1 只改高光 alpha，bbox/尺寸/偏移不变，无需改 CSS：

| 档 | `--r10-phone-glow-dim-size` / `-visible` | `--r10-phone-glow-bright-size` / `-visible` | 建议 `--r10-phone-glow-off` |
|---|---|---|---|
| c2 | `12px 10px` / `5px 9px` | `17px 15px` / `1px 5px` | `-17px -15px` |
| c3 | `10px 8px` / `6px 10px` | `17px 16px` / `1px 4px` | `-17px -16px` |

`--r10-phone-size-base` / `--r10-phone-size-star-small` 引用的是 glow 的 size 变量，因此若采用 c2/c3 只需要改上面这些变量，帧表不用动。候选参数在 `generate.mjs` 的 `glowCandidateSpecs`；**当前主配置是 c1 + H1**：仅 `glow-dim.png` 两个高光格 alpha 改为 128，`glow-bright.png` 保持 255；bbox、尺寸、偏移及 CSS 均不变。H1/H2 原始候选另存于 `eye-highlight-candidates/`，其中 H1 已采纳、H2 保留归档。

**当前决策：c1 + H1 已采纳**（dim 高光 alpha=128，bright=255）。本节 c2/c3 仍是未采用的强度探索记录：c2 曾把可见度提到基线的 3.3 倍（1.313 → 4.337），c3 更醒目（3.64 倍），但它们改变 bbox，需要单独评估 CSS；本次不采用，也不调整 builder。

## 预览与验证

- 新 glow（均 ≤2000 px）：[glow-layer-8x.png](../../runtime/checks/r10-phone-layers/glow-layer-8x.png)（glow 层单独，深/浅底各 8×：dim | bright | alpha 热力图）、[glow-alpha-levels-16x.png](../../runtime/checks/r10-phone-layers/glow-alpha-levels-16x.png)（每格 level 数字）、[glow-compare-4x.png](../../runtime/checks/r10-phone-layers/glow-compare-4x.png) / [glow-compare-1x.png](../../runtime/checks/r10-phone-layers/glow-compare-1x.png)（原图 / +dim / +bright，4× 与真实 1 CSS px/格）、[glow-face-zoom-16x.png](../../runtime/checks/r10-phone-layers/glow-face-zoom-16x.png)、[glow-bright-candidates-8x.png](../../runtime/checks/r10-phone-layers/glow-bright-candidates-8x.png)（0.40/0.50/0.60）、[glow-old-vs-new-4x.png](../../runtime/checks/r10-phone-layers/glow-old-vs-new-4x.png)（r3 粉白替换 vs r4 叠加）
- [timeline-17-frames-4x.png](../../runtime/checks/r10-phone-layers/timeline-17-frames-4x.png)：25 格画布 17 帧（1-2 停；3 点；4 停；5 点；6 停；7-8 停；9-10 暗；11 亮；12 暗；13 停；14-15 暗；16-17 停）
- [tap-frames-8x.png](../../runtime/checks/r10-phone-layers/tap-frames-8x.png)、[braid-restore-compare-4x.png](../../runtime/checks/r10-phone-layers/braid-restore-compare-4x.png)、[braid-restore-zoom-8x.png](../../runtime/checks/r10-phone-layers/braid-restore-zoom-8x.png)、[layer-decomposition-1x.png](../../runtime/checks/r10-phone-layers/layer-decomposition-1x.png)、[layer-decomposition-4x.png](../../runtime/checks/r10-phone-layers/layer-decomposition-4x.png)、[hair-reference-alignment-4x.png](../../runtime/checks/r10-phone-layers/hair-reference-alignment-4x.png)、[size-report.json](../../runtime/checks/r10-phone-layers/size-report.json)
- 强度分档候选（均 ≤2000px）：[glow-strength-candidates-1x-8x.png](../../runtime/checks/r10-phone-layers/glow-strength-candidates-1x-8x.png)（三档 × 原始/dim/bright：左侧 8× 放大，右侧 320px 面板 1× —— 真实显示尺寸）、[glow-strength-candidates-dpr2-8x.png](../../runtime/checks/r10-phone-layers/glow-strength-candidates-dpr2-8x.png)（DPR2 同上）、[glow-strength-candidates-table.png](../../runtime/checks/r10-phone-layers/glow-strength-candidates-table.png)（参数 + 色差 + 实测像素差对照表）
- r3 的 `glow-diffusion-*` 与 `glow-rings-16x.png` 已删除（描述的是旧的 d² 环形替换设计）。

从项目根目录运行：

```sh
node design-specs/jirai-kei-theme/original-assets/r10-phone-layers/generate.mjs
node design-specs/jirai-kei-theme/runtime/checks/r10-phone-layers/verify.mjs
```

验证脚本检查：索引 PNG（char-back/phone-front alpha 0/255、共享调色板；glow 为 4-bit + tRNS、10 项、alpha 阶梯与调色板一致、索引 PNG 不大于 RGBA 编码）、裁切 bbox、SVG 与 PNG 一致（glow 含 fill-opacity 逐格比对）、source 4× 网格、合成逐格等于原裁切、独立重算 ≥2 张一致规则并对照 manifest、x=14..19 左侧邻接区与整画布无透明洞、共享耳格同属两层、点帧 3/5 逐格审计、**char-back/phone-front 的 SHA-256 与 r3 一致（冻结）**；glow：独立重算每格 level 并逐格比对 PNG、同形状；渐变格 bright=2×dim 且 bright≥dim；H1 高光 dim=128、bright=255，dim 必须严格低于 bright 且位于80..160；峰值 alpha（dim 0.20–0.28 / bright 0.45–0.55）、6–8 个 alpha 阶梯且相邻档差 ≤16/255、正常类格 alpha 随距离单调不升、全部 alpha>0 格构成一个 8 连通整体、每格都有更近的亮邻格且 alpha 回升不超过 1 档、边缘接触未点亮的正常格时 level ≤2（无硬半径）、脸部 d≤5 全覆盖及近手机侧刘海/辫丝覆盖、描边与深色眼珠 level ≤ 0.4×基线且不成洞、叠加色全部冷白（色相 190–230°、饱和度 ≤0.12，B 通道最大）、脸皮在 bright 峰值仍保留粉色（a\*>0、C\*≥5、ΔE76 在 3–8）、两眼高光 (9,12)/(14,12) 是 `#f8fcff`（dim alpha=128，bright alpha=255），不覆盖原白点；dim alpha < bright 且 dim 位于80..160的回归断言防止高光恢复为255、无 glow 格位于 phone-front 之下、字节预算、预览边长（≤2000px）、17 帧计划。r5 候选另有一组独立断言：从解码出的 char-back 像素重算每格 level 与 alpha 并逐格比对候选 PNG、叠加色必须是冷白（色相 190–230°、饱和度 ≤0.13、L\* ≥92）、6–10 个 alpha 阶梯、沿距离单调、单一 8 连通块、边缘 level ≤2、深色格按 0.3 衰减、两眼高光在 dim 与 bright 两层都是 alpha=255、bright 逐格 ≥ dim、手机覆盖格绝不发光、四条 data-URI base64 预算，以及**浏览器实测 dim→bright 平均通道差 ≥ 4.0 且与 sharp 侧复算差距 ≤20 %**。
