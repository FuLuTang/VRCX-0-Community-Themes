# Windose 深色示意图 · 独立视觉验收（伪元素 / mask / 装饰 / 假 DOM 边界）

- 验收对象：`design-specs/jirai-kei-theme/mockups/windose-dark/`（`index.html` + 9 份 CSS + 5 个产物）
- 对照真源：`/home/fulutang/Documents/Github/VRCX-0-jirai`（**只读**；未运行、未构建、未执行 git、未修改任何文件）
- 验收者立场：独立复验，不采信 `research/integration-status.md` 的自评
- 写入范围：仅本文件。**未覆盖任何产物**（png / webp / css / html 全部保持原样），临时脚本与截图一律落在 `/tmp`
- 探测方式：Playwright + `/tmp/dsh-theme-browsers/chromium-1248`，`file://` URL 只读加载，viewport 1440×900@1.25（对齐 `capture.mjs`）与 1600×1000；未启动任何服务器
- **本报告不声称真 WebView 验证**：全部结论来自 Chromium + `file://`，与 VRCX-0 的 WebView2 实机不是同一环境

复现物（均在 `/tmp`，非仓库内容）：`probe1.mjs`、`probe2.mjs`、`probe3.mjs`、`probe4.mjs`；结论 `p1b.json`、`probe2.out.json`、`p3b.json`、`p4b.json`；图 `/tmp/shots/`（`tail-zoom-3x.png`、`wing-zoom-6x.png`、`shipped-bottom.png`、`current-bottom.png`、`diff-main.png`、`diff-dialog.png`）。

### 验证快照（结论只对本快照成立）

**核查过程中 `finish.css` 被外部改动过**（`16:21:54` → `16:38:39`，+215 字节，改动内容是 §3 R8 所述的字体作用域），因此我把全部关键探测在改动**之后**重跑了一遍。本报告所有数字均为下表快照下的实测值；此后任何一次改动都需要重新验证，尤其是 §2 S1 依赖 CSS 加载顺序的结论。

| 文件 | mtime | md5 | 备注 |
| --- | --- | --- | --- |
| `index.html` | 16:27:53 | `49eaae6d6991037a602e8a0d242d4daa` | 晚于全部产物截图 |
| `finish.css` | 16:38:39 | `024ec108bfaffb713432e8c2605018e1` | 核查中被改；晚于全部产物截图 |
| `windose-dark.css` | 13:05:21 | `960ad483370461423a010bc465b8db44` | |
| `layout.css` | 13:15:08 | `d2a1b43b307871873a3271a35386b0c7` | |
| `extras.css` | 13:25:14 | `e9da81e4405eae047b6603c1e18be797` | |
| `reuse.css` | 13:27:24 | `6be9bbecfb9f53b08bcfa9f95a65f351` | |
| `rich.css` | 14:07:49 | `876ce9e8ead9665d82bfb1aff183639e` | |
| `pixel.css` | 16:20:13 | `21c51621b5a93c7dbcbf60dbaa41a214` | |
| `jirai-assets.css` | — | `abf3a2ea958ce8453d9199a2633ca970` | |
| `jirai-icons.css` | — | `a793c199536e8aaf544334ca12c1c9f6` | |
| `fonts/fonts.css` | — | `ec3c4631abf94b6f452be1f6843709ba` | |
| `windose-dark-main.png` | 16:22:09 | `a921d1ab17e4fda437fb50899673d3e6` | 产物 |
| `windose-dark-dialog.png` | 16:22:10 | `36623aeb10b15583edeba627c37a9510` | 产物 |
| `windose-dark-motion.webp` | 16:22:18 | `8c3bec9dd7e900f4126aadec96683de4` | 产物 |
| `windose-dark-motion-status.webp` | 16:22:18 | `12bf201d20d70cae498a1f6263026cf5` | 产物 |

**重跑结论**：`finish.css` 的改动只触及字体作用域，**未触及** `.tail` / `.tail::before` / `.tail::after` 的任何声明，因此 §4 P1（翅膀不被裁切）的结论在新快照下依然成立 —— 实测 `tailTop 756.9`、`visiblePx 95.1`、滚到底后 `wingAbs 795.9–819.9`、翅膀带内 `rgb(199,144,186)` 像素仍是 **216** 个，与原快照逐位一致。产物差异则从 main 4.67% / dialog 30.69% 微升到 **main 5.09% / dialog 30.84%**（新增的字体改动带来的文字重绘），量级与结论不变。

---

## 0. 结论摘要

| 编号 | 级别 | 一句话 |
| --- | --- | --- |
| B1 | **阻塞** | `windose-dark-dialog.png` 与当前 `index.html` 不一致（弹窗高度差 ≈26 逻辑 px），不能当验收基线 |
| B2 | **阻塞** | 备注卡里的聊天气泡是自造语义，真实结构是「label + 纯文本」且空值整卡不渲染 |
| S1 | 应修 | tail 的「不被父级 mask 裁切」只靠 CSS 加载顺序保证，脆弱 |
| S2 | 应修 | `.tail::after` 用 `inset:0` 覆盖整个 tail，与 `::before` 的翅膀只靠图形不重叠而互不遮挡 |
| S3 | 应修 | 弹窗标题条方块 9×9 纯色 vs 窗口标题条宝石心 16×16，且弹窗方块被 blink 一起闪 |
| S4 | 应修 | active 窗口标题条纹理被 `extras.css` 覆盖，`rich.css` 的「dither fade + checker band」在 active 上落空 |
| S5 | 应修 | `.statusbar .seg-s.dim{opacity:.55}` 使 SteamVR 段实际对比度 ≈2.6:1，不可读 |
| S6 | 应修 | `--wd-faint` 用于 10–12px 小字时对比度 3.98–4.26，低于 AA 4.5 |
| S7 | 应修 | `.side .list::after` 用占布局的 126px 伪元素块，与真实虚拟列表的高度估算冲突 |
| S8 | 应修 | `rich.css:2` 的「所有纹理 ≤1.25:1」声明与实测不符（最高 2.435） |
| R1–R8 | 建议 | 死 CSS（含**两处从未渲染的装饰**）、非整数 mask 缩放、像素字体 5 种字号、`.dialog::after` 缺三点、末行孤卡等 |
| P1–P8 | 正面 | 用户点名的三件事中有两件经独立复现**成立**，一件经补证后成立（见 §4） |

---

## 1. 阻塞

### B1 · 弹窗截图已过期，与当前 `index.html` 不符

**证据**

- 时间戳：`windose-dark-main.png` / `windose-dark-dialog.png` 生成于 `16:22:09` / `16:22:10`，`windose-dark-motion*.webp` 生成于 `16:22:18`（`ls -la --time-style=full-iso`）。而源侧有**两笔**改动晚于它们：`index.html` `16:27:53`、`finish.css` `16:38:39`。取图时的 CSS 快照是 `finish.css 16:21:54`。**产物比源码落后两个版本**。
- 因为 `finish.css` 在核查期间还被改过，下面的比对按「以产物为基准 vs 当前快照」执行，数字为当前快照实测。
- 用 `capture.mjs` 的完全相同参数（1440×900、`deviceScaleFactor 1.25`、`#app` 截图）重跑，输出到 `/tmp/shots/current-{main,dialog}.png`，与产物逐像素比对（阈值 6/通道）：
  - `main`：差异 5.09%，分布弥散在表格文字与状态栏（`diff-main.png`），**tail 区域（逻辑 y 750–855）差异为 0** → 判定为动画帧 + 抗锯齿 + 字体差异噪声，不是结构问题。
  - `dialog`：差异 **30.84%**，`diff-dialog.png` 呈典型红绿重影（同一文字出现两处）→ 结构性位移。
- 位移量化：在 x=900 列扫描 `--wd-title-active #d97fc6` 色带（弹窗标题条）
  - 产物 `y=[118,147]`，当前 `y=[102,131]`
  - 弹窗经 `.veil{display:grid;place-items:center}` 垂直居中，顶部下移 16 物理 px = 12.8 逻辑 px ⇒ 高度差 = 2×12.8 ≈ **25.6 逻辑 px**
  - 交叉核对：`probe2` 实测当前 `.dialog.udlg` 高 740.8、顶 y=79.6；反推产物高 ≈715
- 放大原因：`.udlg .banner` 是 45° / 12px 周期的 `repeating-linear-gradient`（`layout.css:122`），对亚像素位移极端敏感，几像素的位移就能让整块横幅翻转成「全差异」，从而掩盖真实差异。

**影响**：`research/integration-status.md:35-39` 把这两张图当作对外基线。基线一旦过期，任何以截图为依据的复核都会得出错误结论；banner 的敏感性还会制造假阳性。

**验收条件（Leader 可勾选）**

1. 用**当前** `index.html` + 当前 `finish.css` 重新生成 `windose-dark-main.png`、`windose-dark-dialog.png`、`windose-dark-motion.webp`、`windose-dark-motion-status.webp` 四个产物；或
2. 保留现图但在 `integration-status.md` 明确标注每张图对应的 `index.html` / `finish.css` 快照（见「验证快照」表），并声明「图 ≠ 当前实现」。
3. 复验口径：重跑 `capture.mjs` 后，`dialog` 的像素差异 ≤1%（而不是 30.84%），且 `diff-dialog.png` 不再是红绿重影。
4. 若 Leader 正在并行修改 `finish.css`（本次核查已观测到一次），请在定稿后**冻结快照再截图**，否则会重复出现同一问题。

### B2 · 备注卡里的「聊天气泡」是自造结构，不能当真实 DOM 实现

**证据**

- 示意图：`index.html:112` 在「线上备注与本地备注」卡片里放了两个 `<span class="bubble">`：「（未设置）」与「一起看过烟花 ♡」；样式见 `reuse.css:49-55`（`R8 · NSO JINE: note card becomes a pink chat bubble on a dither-cloud background`），`.bubble` 是 `display:inline-block; max-width:85%; padding:6px 10px; background:#ffd6f2; border-radius:10px`，`.bubble.me` 还带 `float:right`。
- 实测渲染：`.ucard .bubble` 命中 2 个，computed `backgroundColor rgb(255,214,242)`、`border-radius 10px` → 确实渲染成对话气泡。
- 真实结构（只读源码）：`src/components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:443-493`
  - 外层 `InfoPanel title={t('dialog.user.info.notes_memo')}`
  - 内层**一个可点击的 `role="button"` div**（点击进入编辑备注）
  - 两段并列：`<span class="text-muted-foreground block truncate text-xs">{label}</span>` + `<AdaptiveTextBlock>{value}</AdaptiveTextBlock>`
  - 中间以 `<Separator />` 分隔
  - `:451-456` — `const showNote = Boolean(profile.note && !hideUserNotes)`、`showMemo` 同理，**两者都为假时 `return null`，整张卡不渲染**
  - 注解：该卡**没有任何气泡、圆角对话、发送方语义**
- 这是「示意图有、真实应用没有」的**新增内容**，比纯样式差异更危险：`integration-status.md:32` 已自认「备注气泡的假对话结构仅为风格实验，正式主题不能新增对话内容或 DOM」，但**示意图本身没有标注**，气泡仍留在 `index.html:112`。

**影响**：按图实现会（a）引入真实应用不存在的聊天语义与圆角结构，（b）漏掉「空值整卡消失」的条件分支，导致真实应用里出现一张空卡。

**验收条件**

1. 把 `index.html:112` 的 `.bubble` 改为与真实一致的「label + 纯文本」，或在图上**就地标注**「此气泡为风格实验，非真实 DOM；真实为 label+AdaptiveTextBlock，且 note/memo 皆空时整卡不渲染」。
2. `reuse.css:49-55` 的 R8 区块同步加同样的限制注释，或在正式主题产物中删除。
3. 在 `css-feasibility.md` 的「必改」清单里补上这一条（目前只覆盖了类型 chips、选中行、弹窗标题条等，没有备注气泡）。

---

## 2. 应修

### S1 · tail 的「父级 mask 不裁切翅膀」只靠加载顺序成立

- `reuse.css:35-36`（R6）给 `.foot-count + .tail` 设了 `background-color:#2e2552` + `mask: var(--jk-mask-s11)`（S11 洒落，144×144）。CSS `mask` 会作用于元素**及其全部后代**的绘制结果，因此它原本会把 `.tail::before` 的翅膀一并裁掉 —— 这正是 `integration-status.md:19` 声称已修的问题。
- `finish.css:16` 用**同特异性**（同为 `0,2,0`）的 `.foot-count + .tail { height:180px; background:transparent; mask:none; -webkit-mask:none; }` 覆盖，且 `finish.css` 在 `index.html:15` 最后加载 → 当前确实生效。
- 实测（`/tmp/probe1.out.json`）：`.tail` computed `maskImage: none`、`webkitMaskImage: none`；`.tail::before` `maskSize 64px 24px`、`opacity 0.75`、`top 124px`、`width 64px`、`height 24px`。
- **风险**：这个修复完全依赖 `<link>` 顺序与「没有后来者再写 `.foot-count + .tail` 的 mask」。任何 CSS 打包重排、或 reuse.css 内追加同选择器规则，都会静默复原裁切，而且不会报错。

**验收条件**：把「无 mask」变成结构性保证 —— 删掉 `reuse.css:35-36` 的 mask 声明（S11 洒落在 `finish.css:16` 里已被显式置空，本来就是死声明），或给 `::before` 换到独立容器；并在两处加注释写明「此处曾因父级 mask 裁掉翅膀」。复验：`.tail::before` 的翅膀像素在 `y=124..148` band 内完整出现（当前为 216 px 的 `rgb(199,144,186)`）。

### S2 · `.tail::after` 与 `.tail::before` 的层叠顺序隐患

- `finish.css:17-20` 的 `::after` 是 `position:absolute; inset:0`，即**覆盖整个 180px 的 tail**，包括翅膀所在的 `124..148`。
- 当前不遮挡纯属巧合：`::after` 的 `background-color:#503364` 只在 `--jk-mask-s22`（心，`center 16px/96×84`）与两处 `--jk-mask-s23`（星，`30px` / `62px`）处可见，恰好不与 `124..148` 重叠。
- 一旦心形尺寸、`top` 或 tail 高度被调整，`::after` 就会盖住翅膀（`::after` 绘制在 `::before` 之后）。

**验收条件**：给 `::before` 加 `z-index:1`（两者都已是绝对定位），或把 `::after` 限制为 `inset:0 0 auto; height:100px`。

### S3 · 弹窗标题条的方块与窗口标题条的宝石心不一致

- `finish.css:30-32` 只覆盖 `.win > .wt::before`：`width:16px;height:16px; mask:var(--jk-mask-s16) center/16px 16px no-repeat`（宝石心）。
- `.dialog .wt::before`（`windose-dark.css:154`）没被覆盖，实测：`9×9`、`backgroundColor rgb(27,19,48)`、`backgroundImage none` → 纯色方块。
- 但 `extras.css:29` 的 `wd-blink` 动画把 `.dialog .wt::before` 一并纳入 → 弹窗标题条上是一个**闪烁的 9px 深色方块**，而窗口标题条是 16px 宝石心。

**验收条件**：统一形状（都换成宝石心或都保留方块），并明确弹窗是否参与 blink。

### S4 · active 窗口标题条纹理：`extras.css` 压过 `rich.css`

- `rich.css:17-20` 注释声明标题条是「dither fade + checker band」（两层 `background-image`），选择器为 `.win > .wt`（特异性 `0,1,0`）。
- `extras.css:30-31` 对 `.win > .wt` 与 `.win.active > .wt` 都设了 `background-image`；其中 `.win.active > .wt` 是 `0,2,0`，**高于** rich.css 的 `0,1,0`，尽管 `rich.css` 在 `index.html:13` 比 `extras.css`（`:9`）晚加载。
- 实测：`.win.active > .wt` 的 `backgroundImage` = `radial-gradient(circle, rgba(27,19,48,.14) ...)`（extras），而非 rich 的两层；只有非 active 窗口走 rich 的规则。

**验收条件**：确认意图。若要 active 也带 checker band，把 rich 的选择器提到 `.win.active > .wt` 级别；若不需要，把 `rich.css:17` 的注释改为「仅非激活窗口」。

### S5 · `.statusbar .seg-s.dim` 的文字实际不可读

- `layout.css:118-119`：`.statusbar .seg-s` 用 `color: var(--wd-muted) #b9add9`，`.seg-s.dim { opacity: .55 }`。
- 实测对比度：`#b9add9` 在 `--wd-title #2f2552` 上原本 6.66:1，乘 0.55 透明度后有效对比度落到约 **2.6:1**，远低于 WCAG AA 4.5:1。
- 产物截图右下「SteamVR」段肉眼几乎不可读（`/tmp/shots/shipped-bottom.png` 同批图的对应区域一致）。

**验收条件**：dim 态改用「更暗的专用色」而不是降透明度，或 `opacity ≥ .8`；复验时该段对比度 ≥4.5:1。

### S6 · `--wd-faint` 用于小字时低于 AA

- 实测：`#8d82b5` on `--wd-title #2f2552` = **3.976**；on `--wd-raised #2a2147` = **4.259**。均 <4.5。
- 使用点：`.nav .kbd`（10px，`layout.css:22`）、`.ghead .cnt`（`layout.css:57`）、`.win > .wt .dots`（`opacity:.7` 后更低，`layout.css:6`）、`.qs`（`layout.css:11`）、`.table .time/.sub`（`windose-dark.css:112-113`）、`.foot-count`（`layout.css:38`）。
- 与正文对比参照：`--wd-text` 14.44、`--wd-muted` 8.01，说明调色板本身没问题，是 faint 用得过于靠前。

**验收条件**：10–12px 文字改用 `--wd-muted`，或把 `--wd-faint` 加深到 ≥4.5:1（对 `#2f2552` 与 `#2a2147` 两种表面都要满足）。

### S7 · `.side .list::after` 的占位方式与真实虚拟列表冲突

- `extras.css:61-63` 与 `finish.css:22-25` 把好友列表尾部的云做成 `display:block; height:126px/120px; margin-top:8px` —— **会真实占据 126–134px 布局高度**。
- 实测：`.side .list` 高 777、`scrollHeight` = `clientHeight` = 777，`::after` 落在 y≈726，云可见。
- 真实应用的好友侧栏是虚拟列表，行高 49 / 分组头 38 / 房间头 26 由估算写死（`css-feasibility.md:86`）。多出的 134px 占位会与滚动高度估算错位（滚动条跳动、列表底部空档），同时云可能压到好友行文字后面（该云对表面的对比度实测 1.78）。

**验收条件**：真实实现改为不占布局的绝对定位（限定在「最后一行之下」的可见空区），或在 `integration-status.md` 明确把这条降级为「仅示意图成立」，不进入主题实现清单。

### S8 · 纹理对比度声明与实测不符

- `rich.css:2` 声明：「Contrast of every texture against its own surface is kept <= 1.25:1 so text is unaffected.」
- 实测（WCAG 相对亮度比）：

| 纹理 | 表面 | 实测 | 是否符合声明 |
| --- | --- | --- | --- |
| `.win::before` `#2e2552` | `--wd-window #201936` | 1.199 | ✅ |
| `.selfrow::after` 云 `#3b3166`@.45 | `#251a3c` | 1.151 | ✅ |
| `--wd-zigzag #221a3e` | `--wd-desktop #16112a` | 1.120 | ✅（与 `windose-dark.css:6` 的「1.12:1」一致） |
| `.ucard.jine .cb::before` 云 `#6a3f7e`@.5 | `#3b2350` | 1.299 | ❌ |
| `.nav-win .nav::before` 云 `#3b3166` | `#1e1a3e` | 1.428 | ❌ |
| `.tail::after` `#503364` | `#201936` | 1.594 | ❌ |
| `.side .list::after` 云 `#795184`@.65 | `#2c1b40` | 1.780 | ❌ |
| `.body::before` 星域 `#8f7fe0`@.55 | `#221a3e` | 2.435 | ❌（桌面无文字，观感可接受） |

**验收条件**：把注释改成可核对的规则（例如「纹理只允许出现在无文字区」），或调色到达标；不要保留与实测矛盾的量化承诺。

---

## 3. 建议

- **R1 · 死 CSS（有规则、无对应 DOM）**。遍历 530 条规则发现 267 条无匹配，剔除 icons 库（有意保留的图标表）与 `:hover/::-webkit-*` 等无法用 `querySelector` 判定的伪类后，约 35 条是真死规则：
  - `windose-dark.css:121-140` 整块「side panel: SNS-style profile」：`.profile`、`.profile .head/.bigav/.name/.id/.status`、`.hearts`、`.kv`、`.bio`、`.world*`、`.row-actions` —— 当前右栏用的是 `.side`/`.list`/`.rail`，**没有任何 `.profile` 元素**。
  - 其中**两处「声明要显示、实际从不渲染」的装饰**：`.profile::before`（`windose-dark.css:122-124`，S10 云 corner）与 `.hearts`（`:130-131`，S8 像素心分隔线）。
  - 其它：`.chips/.chip/.chip.on`（`:98-100`）、`.table .bullet`（`:110`）、`.table tr.sel td`（`:108`）、`.task/.task.on/.clock`（`:144-148`）、`.dialog .wt .x`/`.dialog .info*`/`.dialog .content`（`:155-159`）、`.titlebar .app-name`（`:46`）、`.nav .grp`（`:78`）、`.nav a .ico`（`:80`）；`layout.css:29,31,72-73` 的 `.main-pad`、`.toolbar .tools`、`.statusbar .item/.sep`；`reuse.css:54` 的 `.bubble.me`。
  - 建议：删除或迁到真实钩子上；否则实现者会去找不存在的结构。
- **R2 · 冗余/易误读的层叠**：`extras.css:58` 重复声明 `.table thead th{background:var(--wd-raised)}`（与 `windose-dark.css:105` 同值）；`rich.css:12` 的 `.side .list::before{height:0}` 零效果；`extras.css:38-39` 的 busy 条纹被 `reuse.css:31`（R5）整体改写（2px→3px、薄荷→四色），两条叠在一起易误读；`.foot-count::before`（`extras.css:25`）是唯一没写 `pointer-events:none` 的装饰伪元素（其余装饰全都写了）。
- **R3 · 非整数倍 mask 缩放会让像素画颗粒不齐**：`s8`(12×8) 用在 18×12（1.5×，`windose-dark.css:85` 与 `extras.css:26`）、`s23`(12×12) 用在 16×16（1.33×，`finish.css:20` 第三层）、`s10`(64×32) 用在 96×48（1.5×，`layout.css:46` 与 `reuse.css:52`）。对照正确样例：`s15` 32×12→64×24(2×)、`s22` 32×28→96×84(3×)、`s24` 16×20→48×60(3×)、`s27` 24×12→96×48(4×)、`s13` 64×64→128×128(2×)。建议统一到整数倍。
- **R4 · `.dialog::after` 缺「三点」**：`windose-dark.css:68-74` 的 `.win::after` 是三层（粉块 + 三点 `repeat-x` + 薄荷底），而 `:160-161` 的 `.dialog::after` 实测 `backgroundImage: linear-gradient(...), none` —— 少了三点。要么补齐，要么注明是有意区别。
- **R5 · 弹窗 3 列 7 卡 → 末行孤卡**：实测 7 张卡全部完整可见（无裁切、`scrollHeight=clientHeight=365`），但第 7 张独占一行。建议改成 8 张或 2 列。
- **R6 · 同一装饰两种摆放模式**：`.selfrow::after`（云）是 `position:absolute` 不占布局（`layout.css:44-46`），`.side .list::after`（云）是 `display:block` 占布局（`extras.css:61`）。建议统一为绝对定位。
- **R7 · 原型图标是「借形」，不能当目标图标**：`index.html:141-142` 有注释说明「Prototype names map to the actual covered Lucide glyphs」，但 `LC` 映射里有明显借形：`clock:'text-search'`（房间历史）、`player:'gamepad-2'`（房内玩家）、`box:'person-standing'`（我的模型）、`hist:'footprints'`（浏览历史）、`log:'rotate-ccw-clock'`（游戏日志）、`group:'layout-dashboard'`（rail 群组）、`chart:'waypoints'`（图表）、`tool:'wrench'`（工具）、`feed:'rss'`（好友动态）。真实应用的导航图标来自 `src/components/layout/navIconRegistry.ts`（63 个候选键）且**由用户为每个导航项自选**。建议在图上注明「图标仅示意，真实图标由用户选择」，避免实现者把借形当目标。
- **R8 · 像素字体以 5 种字号出现，其中 14 个是「只指定字族、忘了字号」的继承结果**。`finish.css:3-7` 刚把字体作用域从「全局 body 像素字体」改成「显式 chrome 选择器列表」（实测 `body` 的字族已回到 `"Noto Sans CJK SC", "Noto Sans SC", "Segoe UI", system-ui, sans-serif`，两个自定义字体仍 `loaded`）—— 这是对 `integration-status.md:30` 的正面回应。但页面上 `WD Pixel` 实际出现在 **9px×1 / 10px×6 / 11px×5 / 12px×106 / 13px×14**（共 132 个元素）。其中：
  - 13px 那 14 个来自 `pixel.css:25-26` —— 该规则只写 `font-family`、没写 `font-size`，于是 `.table .time`、`.clock`、`.statusbar .seg-s:last-child`、`.ghead .cnt`、`.nav .badge`、`.dialog .wt .lbl` 全部继承 `windose-dark.css:31` 的 `body{font:13px/1.45}`；
  - 9px 的是 `.rail .num`（`layout.css:68` 定字号 + `pixel.css:25` 指字族）。
  - 点阵字体只在设计尺寸或其整数倍下锐利，9/10/11/13px 都会非整数缩放而发虚。建议把像素字体收敛到 1–2 个整数字号（例如统一 12px），其余交回 `var(--font)`；并把 `pixel.css:25` 的字号显式写出，避免再出现隐式继承。

---

## 4. 经独立复现确认成立的声明（正面结论）

### P1 · 「tail 同时用 mask 和 `::before` 会裁切翅膀」—— 当前版本已修复 ✅

用户点名的第一件事。独立证据链（不采信 `integration-status.md:19` 的自述）：

1. 裁切的机制确实存在：`reuse.css:35-36` 给 `.foot-count + .tail` 设 `mask: var(--jk-mask-s11)`；CSS `mask` 作用于元素**及其后代**，会波及 `.tail::before`。
2. `finish.css:16` 以同特异性、后加载覆盖为 `mask:none; -webkit-mask:none`。
3. 实测 computed（`/tmp/probe1.out.json`）：`.tail` → `maskImage: none`、`webkitMaskImage: none`；`.tail::before` → `maskImage: url("data:image/svg+xml,...")`、`maskSize: 64px 24px`、`maskPosition: 50% 50%`、`no-repeat`、`opacity 0.75`、`top 124px`、`w/h 64/24`。
4. 像素级：滚动 `.wb` 到底后截 `.tail`（838×181），在 `y=124..148` band 内统计到 **216 个 `rgb(199,144,186)` 像素** —— 该值正是 `--wd-square #ffb8e6`(255,184,230) 以 `opacity .75` 叠在 `--wd-window #201936`(32,25,54) 上的精确结果（255×.75+32×.25=199.25、184×.75+25×.25=144.25、230×.75+54×.25=186），证明翅膀是**以自身 mask 形状**绘制，而不是被父级裁成矩形或消失。
5. 视觉：`/tmp/shots/wing-zoom-6x.png` 放大 6 倍，翅膀（中心方块 + 左右各三段阶梯翼）**左右对称、四边均无切边**；`/tmp/shots/tail-zoom-3x.png` 显示同区域的大心形（S22）与两枚星星（S23）同样完整。

**附带的边界（不是 bug，但会被误判）**：首屏（不滚动）时 tail 装饰**不可见**。实测 `tail` 顶 y=756.9、`.wb` 可视底 y=852 → 仅 95.1px 可见；翅膀在 tail 内 `+124px`，绝对 y=**880.9**，已在滚动容器之外，`document.elementFromPoint` 在该点命中 `.statusbar`。`.wb` 可滚 85px，滚到底后翅膀落在 795.9–819.9，完整可见。因此「只截首屏」的产物图里 tail 只有大心形的上半部分（`/tmp/shots/shipped-bottom.png` 可见），**评审时不要据此判定翅膀缺失**。

### P2 · 「所有 `.lucide` 都有 mask、不会变实心方块、无页面错误」—— 在示意图范围内成立 ✅

对 `index.html?dialog=1` 全量扫描：`svg.lucide` 共 **33 个**、**27 个唯一类**、无 mask 者 **0**、`background-color` 非透明且无 mask（即实心方块）者 **0**、mask 生效但子元素仍可见者 **0**、零尺寸者 **0**、`pageerror` **0**。

结构化支撑：`original-assets/icons/dist/jirai-icons.css` 第 2 行的 `:is()` 名单有 **243** 个 `.lucide-*`，第 4 行起的 `svg.lucide-*{--px:...}` 定义也是 **243** 个，两者**完全一致**（双向差集均为空）。这一点很关键：若某名字进了 `:is()` 却在 `--px` 上缺失，`mask: var(--px)` 会在计算值阶段失效成 `none`，同时 `> * {display:none}` 已隐藏子图形 → 必然渲染成 currentColor 实心方块。当前不存在这种名字。

### P3 · 图标换图覆盖度（针对**真实应用源码**）：256/257 ✅，唯一缺口可安全降级

`integration-status.md:10` 只说「这个数量不代表非 Lucide 图形已覆盖」，没有给出依据。本次补上：

1. 静态提取 `src/**/*.{ts,tsx}` 中所有 `from 'lucide-react'` 的导入标识符：**258 个**（含 1 个 `type LucideIcon`），即 **257 个图标组件名**。
2. 类名生成规则（只读 `node_modules/lucide-react@1.46.0`）：`dist/esm/shared/src/build/buildLucideIconNode.mjs:19-22` —— `className = mergeClasses("lucide", ...iconClassNames, ...aliasClassNames)`，其中 `iconClassNames = ['lucide-' + icon.name]`，`aliasClassNames` 来自 `icon.aliases`。即运行时类名为 **`lucide` + `lucide-<正式名>` + `lucide-<别名>...`**。
3. 别名文件是 re-export：`dist/esm/icons/alert-triangle.mjs:8` → `export { default } from './triangle-alert.mjs'`，其 `name: "triangle-alert"`。因此按 `import` 标识符直接推类名会误判（本报告第一版就误报了 19 个）。
4. 逐个解析「正式名 ∪ 别名」并与 css 的 `:is()` 名单求交：
   - **可覆盖 256 个**；
   - **未覆盖 1 个：`GridIcon`** → 输出 `lucide-grid-3x3 lucide-grid lucide-grid-3-x-3`，三者都不在名单里 → 该图标保持 lucide 原线性图形。
5. 安全降级成立：`:is()` 未命中时 `background-color: currentColor` 与 `> * {display:none}` 都不适用 → 原图形完整保留，**不会变成实心方块**。这是 `pixel.css:19-22` 注释所承诺的行为，本次给出了可核对的依据。

**留给 Leader 的判断**：唯一未覆盖的 `GridIcon` 会与周围像素图标**风格混搭**（一处线性描边图标嵌在像素图标集中）。要么在 `original-assets/icons/src/` 补一个 `grid-3x3` 图形重新生成，要么在文档里显式接受这一处混搭。

### P4 · 非 Lucide 图形的规模很小 ✅

`src/**/*.tsx` 中内联 `<svg` 仅 **3 处**（`src/components/reui/gantt/gantt-view.tsx`、`src/ui/shadcn/number-field.tsx`、`src/features/charts/RelationshipTimelinePageImpl.tsx`），而 lucide 组件的 JSX 渲染点有 **898 处**；也没有使用 `DynamicIcon`/`dynamicIconImports`。「像素图标 + 少量线性 SVG 混搭」的范围是可控的。

### P5 · 弹窗结构与文案与真实一致 ✅

7 张信息卡顺序实测为：当前状态 → 线上备注与本地备注 → 个人资料详情 → 个人简介 → 状态分布 → 好友关系记录 → 活动摘要；tab 8 项为 信息 / 共同好友 / 群组 / 创建的世界 / 收藏世界 / 模型 / 活动 / JSON。两者都与 `css-feasibility.md:124-125` 记录的真实顺序/文案一致（这是上一轮「必改」里第 9、10 条已被采纳的结果）。

### P6 · 弹窗的横幅装饰全部真实渲染 ✅

`banner` 高 150、`overflow:hidden`；`.lace.l/.r` 各 `16×122`、`opacity .85`、`maskSize 16px 16px repeat-y`；`.knot.l/.r` 各 `24×16`、`maskRepeat no-repeat`；`.banner::after` 高 12 贴底、`mask 20px 12px repeat-x`、`transform: scaleY(-1)`、`inset 138px 0 0`；`.udlg .foot` 的 `--jk-bg-dark-s1-s` 蕾丝背景实测 `bgSize 16px 8px`、`repeat-x`。`.banner .ph` 占位文案「用户横幅图片（此处为匿名占位）」居中可见（对应上一轮「不要画成固定紫渐变」的整改）。

### P7 · 弹窗无溢出/裁切 ✅

`.ucards` 实测 `height 364.5`、`scrollHeight = clientHeight = 365`，7 张卡逐张 `getBoundingClientRect` 均在容器内且 `fullyVisible: true`；`.dialog.udlg` 高 740.8、无内部滚动（`scrollH=clientH=739`）。上一轮担心的「卡片被裁」不成立。

---

## 5. 未确认 / 超出本次范围

- **未在真实 VRCX-0（WebView2）中验证任何一条**。选择器特异性与 Tailwind 变体（`hover:`、`data-active:`）的实际胜负沿用 `css-feasibility.md:141` 的口径：未验证。
- `--entity-dialog-ground` 的取值来源未确认（`css-feasibility.md:140`），本次未涉及。
- `font.css` 在本机 `file://` 下两个自定义字体均 `loaded`（`document.fonts` 只有 2 项，均 `loaded`）；Windows 缩放下的中文点阵可读性未测（与 `integration-status.md:31` 一致）。
- `finish.css:34` 的 `.ucard{position:relative}` 是为将来装饰预留的，当前 `.ucard` 没有任何 `::before/::after` 装饰在渲染，本次不评价其必要性。
- 本次没有评估美学/构图质量，只验收「是否真的显示、是否与真实结构相符、声明是否有据」。

---

## 6. Leader 验收条件清单（可勾选）

**必须先做**

- [ ] B1：重新生成 4 个产物，或给每张图标注对应 `index.html` 时间戳并声明「图 ≠ 当前实现」；复验 `dialog` 像素差异 ≤1%。
- [ ] B2：`index.html:112` 的 `.bubble` 改写或就地标注；`reuse.css:49-55` 同步；把这一条补进 `css-feasibility.md` 的「必改」。

**应修（不阻塞，但会带进实现）**

- [ ] S1：`reuse.css:35-36` 的 s11 mask 删除（死声明），或把 tail 的「无 mask」改成结构性保证 + 注释。
- [ ] S2：`finish.css:17-20` 的 `::after` 限高或给 `::before` 加 `z-index`。
- [ ] S3：弹窗/窗口标题条方块统一形状，并决定弹窗是否 blink。
- [ ] S4：确认 active 标题条纹理意图，修正 `rich.css:17` 注释或提高特异性。
- [ ] S5 / S6：`dim` 段与 `--wd-faint` 小字达到 4.5:1（用算式复验，不靠肉眼）。
- [ ] S7：把好友列表尾部云的占位方式改掉，或在文档里声明「仅示意图成立」。
- [ ] S8：修正 `rich.css:2` 的对比度声明，或调色达标。

**建议**

- [ ] R1：清理死 CSS，特别是把 `.profile*` / `.hearts` 这两处**从不渲染**的装饰移除或迁移。
- [ ] R3：非整数倍 mask 缩放改整数倍。
- [ ] R4 / R5 / R6 / R7：三点补齐、末行孤卡、装饰摆放统一、图标借形标注。
- [ ] R8：像素字体字号收敛到 1–2 个整数尺寸；`pixel.css:25` 补上显式字号。

**已通过（无需再改，但请勿回归）**

- [x] P1：tail 的翅膀在当前版本完整渲染、无裁切（父级 mask 已为 `none`）。**请为 S1 加防回归注释。**
- [x] P2：示意图内 33 个 `svg.lucide` 全部有 mask、无实心方块、无报错；`:is()` 名单与 `--px` 定义各 243 且完全一致。
- [x] P3：真实应用 257 个 lucide 图标覆盖 256 个，唯一缺口 `GridIcon`（安全降级）。
- [x] P5 / P6 / P7：弹窗卡片顺序、横幅装饰、无溢出均与真实结构/上一轮整改一致。
- [x] P8：`finish.css:3-7` 已撤掉全局 body 像素字体（实测 `body` 字族 = `Noto Sans CJK SC`，不再强制 `WD Pixel CJK`），用户内容（`.who`/`.meta`/`.udlg .nm`/`.table .sub`/`.ucard .cb`/`.ghead.room`）改用 `var(--font)`。剩余的字号收敛问题见 R8。
