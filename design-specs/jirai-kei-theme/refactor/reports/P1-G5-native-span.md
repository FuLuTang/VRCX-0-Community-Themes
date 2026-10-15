# P1-G5 native:span 组件普查

## 1. Inventory 全量记录与汇总

范围严格为 `family=G5, component=native:span`（原生 `span`，无专用 data-slot）。共 **3 条记录、711 次观察**。此处 style fingerprint 是 paintFingerprintProperties 指纹，不等于“独立 CSS 皮肤数”；同一个原生标签容纳了状态点、头像壳、徽标/计数等不同语义子元素。

| primaryContext | 观察数 | 指纹数 | stateCount | routes（inventory）|
|---|---:|---:|---:|---|
| `surface:data-table` | 20 | 6 | 1 | `/social/friend-list` |
| `surface:main-content` | 62 | 8 | 8 | `/favorites/friends`、`/feed`、`/friends-locations`、`/login` |
| `surface:side-panel` | 629 | 7 | 37 | `/activity`、`/browse-history`、`/charts/timeline`、`/charts/two-person`、`/community-themes`、`/dashboard/:placeholder`、`/favorites/avatars`、`/favorites/friends`、`/favorites/groups`、`/favorites/import/friends`、`/favorites/worlds`、`/feed`、`/game-log`、`/instance-history`、`/login`、`/my-avatars`、`/notification`、`/player-list`、`/search`、`/settings`、`/social/friend-log`、`/social/moderation`、`/themes`、`/tools`、`/tools/gallery`、`/tools/group-moderation`、`/tools/inventory`、`/tools/my-groups`、`/tools/screenshot-metadata`、`/tools/vrchat-log` |
| **合计** | **711** | **21（逐记录相加）** | — | — |

### 全部 styleVariants 摘要

下表逐条列全 fingerprint 和观察数；属性按指纹本身列出。`font-family` 均为 `"WD Pixel CJK", "Geist Variable", Geist, "Noto Sans SC", system-ui, sans-serif`；各变体 `font-weight:400`、`text-decoration-line:none`。凡未另注，`box-shadow:none`、`outline-width:2.4px` / `outline-style:none` / `opacity:1` / `filter:none` / `transform:none`、`clip-path:none`。未单列的四边 border 均为 `0px solid rgb(108,92,224)`。这只是压缩重复字段的呈现，非省略采集：完整 computedStyle 可由 inventory 对应行读取。

| Context | fingerprint（观察） | computedStyle 中区分外观的字段 |
|---|---|---|
| data-table | `6b9c0b3761db7cf6`（11） | color `rgb(242,235,255)`；背景 `rgb(115,127,141)`；font-size 14px |
| data-table | `bcdd0a4a16e443d7`（3） | 同上，但背景 `rgb(46,211,25)` |
| data-table | `29e6ae3a7be0be49`（2） | 背景 `rgb(22,17,42)`；四边 1.6px solid `rgb(46,211,25)`；font-size 14px |
| data-table | `a8f3f0096d3073da`（2） | 背景 `rgb(0,184,255)`；其余默认 border；font-size 14px |
| data-table | `f1f5f5aa386095e8`（1） | 背景 `rgb(233,124,3)`；其余默认 border；font-size 14px |
| data-table | `62d59d403ad55641`（1） | 背景 `rgb(22,17,42)`；四边 1.6px solid `rgb(233,124,3)`；font-size 14px |
| main-content | `4aa9b024a68c9220`（15） | color `rgb(242,235,255)`；背景灰 `rgb(115,127,141)`；四边 2.4px solid `rgb(22,17,42)`；14px |
| main-content | `e73cfae582e51bb3`（12） | 同上但背景 `rgb(200,9,40)`，shadow `rgb(22,17,42) 0px 0px 0px 1px` |
| main-content | `f934ced8d14edeb6`（8） | 背景绿 `rgb(46,211,25)`；四边 2.4px solid `rgb(22,17,42)`；14px |
| main-content | `8050c4e823a23439`（6） | 背景蓝 `rgb(0,184,255)`；四边 2.4px solid `rgb(22,17,42)`；14px |
| main-content | `7bb3182f828f4935`（6） | 背景蓝 `rgb(0,184,255)`；默认 border；shadow `rgb(22,17,42) 0px 0px 0px 1px`；14px |
| main-content | `4fd1aebed6a29af7`（6） | 背景绿 `rgb(46,211,25)`；默认 border；同上 shadow；14px |
| main-content | `5258d7b0373cac12`（6） | 背景橙 `rgb(233,124,3)`；默认 border；同上 shadow；14px |
| main-content | `e40091fc1946310a`（3） | 背景橙 `rgb(233,124,3)`；四边 2.4px solid `rgb(22,17,42)`；14px |
| side-panel | `a12d6de25a871041`（222） | color `rgb(227,210,245)`；背景绿 `rgb(46,211,25)`；四边 2.4px solid `rgb(22,17,42)`；14px |
| side-panel | `c3f6dada631cff85`（165） | 同上，但背景蓝 `rgb(0,184,255)` |
| side-panel | `c3387c2febbbaf13`（111） | 同上，但背景橙 `rgb(233,124,3)` |
| side-panel | `22b57dabf36b630e`（37） | color `rgb(242,235,255)`；背景 `rgb(22,17,42)`；四边 1.6px solid 蓝 `rgb(0,184,255)`；font-size 16px |
| side-panel | `d27166b0d8da9a1b`（37） | color `rgb(227,210,245)`；背景 `rgb(22,17,42)`；四边 1.6px solid 蓝；14px |
| side-panel | `4cb1d282025067cb`（33） | color `rgb(227,210,245)`；背景 `rgb(22,17,42)`；四边 1.6px solid 绿 `rgb(46,211,25)`；14px |
| side-panel | `a1cda16a66b26e71`（24） | color `rgb(227,210,245)`；背景灰 `rgb(115,127,141)`；四边 2.4px solid `rgb(22,17,42)`；14px |

指纹内重复字段：所有变体 `outline-color:oklab(0.765878 0.172198 -0.0498766 / 0.5)`，`text-decoration-color` 与本行 color 相同。主面板 8 个变体的其余 border/box-shadow 以表内描述为准；不同颜色状态主要是 marker/avatar 自身 paint，不构成 21 条 span 通用规则。width、height、display、padding、margin、vertical-align、line-height 等**未采集**，不能从该 paint inventory 推断。

## 2. 核心判断：span 本体声明 vs 继承

**不能把 native:span 的 21 个指纹等价成 21 种文字样式。** Computed style 是最终值快照，inventory 不保存匹配规则、DOM class、父节点 computedStyle 或 cascade provenance；因此单靠它无法证明某个特定值“由谁声明”。但字段形态和 theme.css 选择器足以做强弱区分：

- `color`、`font-family`、`font-size`、`font-weight` 和文本装饰具备继承性。三个 context 的字体族/粗细/装饰几乎固定；main-content/data-table 的普通行字体为 14px/400，side-panel 有大量 14px 行和 37 个 16px 子集；文字颜色主要分为 `rgb(242,235,255)` 与 `rgb(227,210,245)`。对**没有对应命中 span 专属规则**的普通文字，这些应先视为父级色彩/排版（或明确语义祖先的 inherited value），不为 span 另造规则。CSS 包含 tabs 的 span 子项、diff 词级高亮和 language/status badge 等明确 span 目标；这些是例外且各自有语义锚点，不能概括成“span 自身永远无声明”。
- `background-color`、border、shadow、clip-path 不会继承。指纹中绿/蓝/橙/灰、深底带彩边、shadow 的大量差异不可能只是继承到文字上的颜色；它们对应 span 自己是 marker、头像/状态壳或 pill/badge 的非文字绘制，属于元素自身（主题规则或 app 的 utility class）样式。故“删除所有 span 样式”也不正确，应删除的是把纯文字继承误做重复覆盖，而不是语义节点的造型规则。
- G5 本身跨了 avatar/status 和无 data-slot 的标签，不是组件边界。改造时先用语义 class/role/父容器结构区分 marker、头像、badge、词级 diff、普通文字；没有语义锚点的普通 span 应不被专用主题规则命中。
- 对于 `font-size:16px` 子集，仅凭快照无法确认是继承、utility class 直接设置，还是别的规则；报告将其记作“来源待 DOM/cascade 证据”，不臆测。paint fingerprint 属性有限，缺失的排版/几何值一律为未采集。

### 原样式的两种视觉来源（HTML 预览也按此分区）

1. **span 自身造型**：status dots/markers、avatar shells、region/language badge、word diff highlight、progress fill 等。theme.css 有结构化后代选择器，声明确实给命中的 span 设置 `background`、边框、`border-radius`/`clip-path`、shadow、颜色或尺寸/布局。状态色 `#2ed319` / `#00b8ff` / `#e97c03` 是 inventory 中观察到的值；它们显示为状态样例，不声称一定由主题 CSS 首次赋值。
2. **仅继承的文本对照**：父容器设定文字颜色/字号，内部普通 span 没有独立背景/边框。预览用 CSS 父级设置来演示机制，并以“示意，不是现场复现”标注；实际颜色和字号只取 inventory 有记录的值。theme.css 命中表中的语义 badge / tabs / diff 不归入纯继承。

## 3. theme.css 中实际命中 span 的规则

以下为选择器本身命中 `span`、并含有会影响该 span 的声明（直接或作为后代目标）的清单。行号对应当前 `runtime/preview-package/jirai-kei-theme/theme.css`，SECTION 名从最近的 `/* SECTION ... */` 标题确认。纯结构选择器若其声明只作用于另一个节点，标注为非 span 造型。

| SECTION / 行 | 选择器（缩写时保留语义锚点） | 对 span 的声明 / 判定 |
|---|---|---|
| runtime / 708–711 | `.vrcx-0-side-panel span:has(>span.size-3.75) > span.overflow-hidden`; `.vrcx-0-data-table …`; `.vrcx-0-side-panel span.size-3.75` 及其子 span | `border-radius:0; clip-path:var(--wd-avatar-cut-sm); border-color:transparent; border-width:0; box-shadow:none; outline:none` 等。**真造型**（头像内容壳/尺寸 wrapper），必须窄范围保留。 |
| runtime / 818–827；chrome-r8 / 1765–1767 | `.vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] span.size-2.rounded-full`（含完整 class 选择器）及其 muted 子态 | `border:1px solid var(--jk-chrome-edge); border-radius:0; background-image:none; box-shadow:inset -1px -1px 0 rgb(0 0 0 / .28)`；color/边框颜色按 `--r8-ink`，muted fill `var(--wd-faint,#a294c8)`。**真造型**（状态灯），保留语义限定。 |
| side-panel / 1497 | `.vrcx-0-sidebar-surface [data-sidebar="menu-button"] > span:has(> svg)` | `width/height:18px; flex-shrink:0`。**布局 wrapper，不是文字皮肤**；应归入 menu-button/icon slot 布局，不设成通用 span 样式。 |
| feed-badges / 1191–1195 | `span.inline-flex.min-w-0.items-center.gap-1.5:has(> span.size-2.5.rounded-full) > span.size-2.5.rounded-full` | `border-radius:0; box-shadow:0 0 0 1px #16112a`。**真造型**（状态点）；背景色明确留给语义 status class。 |
| feed-badges / 1212–1237 | `span.h-4…font-mono.text-[10px]`；feed/summary hover 限定同类选择器 | `border-radius:0; border:1px solid var(--wd-frame); background/color; font-family; font-weight:600; letter-spacing; clip-path`；hover 面改 `var(--wd-title)`。**真造型**（JP/USE 等 region chip），且直接设置文字排版，不是继承。 |
| bio-diff-r8 / 1791–1806 | main-content 中 `pre` / diff row 的 `span.text-primary.bg-primary/10`、`span.text-destructive.bg-destructive/10` | 正向：背景、color、清 border-bottom/text-decoration；删除：粉底/深色 ink、line-through、thickness。**真造型**（逐词高亮），需要继续依语义类限定。 |
| bio-diff-r8 / 1812–1825 | entity dialog 的 diff `pre > span.rounded-sm.bg-emerald…` / `bg-rose…` | 背景、color、去/设装饰线，另 `border-radius:0`。**真造型**，不是普通文本继承。 |
| user-dialog-r8 / 1966–1976 | dialog 中 avatar wrapper `span:has(>span.size-3.75)…` 与 `.size-3.75` | `border-radius:0; clip-path; 清边框/shadow/outline`。**真造型**头像；特异性高，迁移时不要被宽泛 span 重置。 |
| user-dialog-r8 / 1982–1986 | card-title 的 size-4 holder > status size-2.5 span | `border-radius:0`；非 `.border-2` 点加 `border:1px solid #21132d`。**真造型**状态标记。 |
| user-dialog-r8 / 2022–2028 | dialog range 外侧 `div:has(>input[type=range]) > span:has(~input[type=range])` | `border-radius:0; border-color/background/color; box-shadow`。**真造型**日期 bubble；不是普通文字继承。 |
| popups-r9 / 2546–2552 | My Avatars tile `…[class~="left-1"] > span.size-5.rounded-full` | `border-radius:0; clip-path; background-color:#ffb8e6; color:#16112a; --tw-ring-color`。**真造型**（tile badge），不可归到普通文本。 |
| controls-r9 / 2634–2639 | chart tooltip/button 下 `span.size-2.5.rounded-full` | `border-radius:0`。**真造型**（legend dot）。 |
| popups-r9 / 2649–2654 | chart popup `span.bg-muted.size-11.rounded-full` | `border:1px solid #6c5ce0; border-radius:0; background:#ffb8e6; clip-path`。**真造型**（avatar）。 |
| avatars-status-r9 / 2889–2962 | `button` 直接子头像 spans、hover-card avatar span、`.activity-skin span.block…`、`.object-row … > span.bg-muted…` | 视 size 切换 `clip-path`，清圆角/border/shadow/outline；dialog shell还清背景。**真造型**（头像），保留尺寸/容器锚点。 |
| avatars-status-r9 / 2970–2972 | `span.border-background.bg-background.rounded-full.border-3:has(> .user-status-indicator)` | `border-radius:0`。**真造型**外环，status 子层仍是 app-owned。 |
| avatars-status-r9 / 2986–3047 | main-content / dialog / combobox-chip 的 class+结构限定 `span` avatar | `border-radius:0; border-width:0; box-shadow:none; outline:none; clip-path`。**真造型**头像 shell。 |
| avatars-status-r9 / 3124–3125（详见文件原 selector） | primary/status marker 的 `:has(> span.sr-only)` 容器、sidebar 的 badge span | badge span `border-radius:0`；第一条实际目标是**父节点**，`:has(>span)` 只是结构条件，不是对那个 span 写样式。不要误记作 span 本体规则。 |
| controls-r9 / 2478–2482 | tabs tab 的 `> span:last-child` 与 active tab 对应子 span | `color:#e3d2f5` / `color:#2a1d6e`。**直接给 span 文本着色**，是语义子项定制，不是继承差异；可随 tabs 子项语义规则保留。 |
| form-controls-r9 / 3256 | `:where([role="radio"] > span)` | `border-radius:0; background-color:#16112a`。**直接造型** indicator，但 scope 是 radio role，不要扩成裸 span。 |
| favorites-r9 / 3823–3836 | favorites groups button 下 `span.truncate`、`span.tabular-nums` | display/flex/min-width/overflow/text-overflow/nowrap/`font-variant-numeric`。**组件布局/数字格式**，不是通用 span 皮肤。 |
| favorites-r9 / 4024–4030 | favorite tile `…:has(> span[status-online]) > span[status-online]` | `width/height:6px; border-radius:0; background-color:var(--status-online); image-rendering:pixelated`。**真造型**状态 marker。 |
| banner-frame-r96 / 4716–4722 | titlebar `span.h-[2px].rounded-full` 及其子 span | track `border-radius:0; background:#16112a`；fill `border-radius:0; background:var(--wd-pink)`。**真造型**进度条。 |
| privacy-lock-r96 / 4760 附近 | privacy-lock 下 `span.inline-block.size-2.rounded-full` | 规则针对小状态灯，按源码声明做方形化/颜色；**真造型**状态标记（完整属性以该处源码为准）。 |
| language-badges-r98 / 4943–4959 | `.vrcx-0-data-table td[data-slot=table-cell] > div.flex… > span[data-slot=tooltip-trigger].inline-flex.h-5…` | border/color/bg/底部渐变、font-family/size/line-height/weight 等。**真造型**语言 chip；尽管有 tooltip-trigger slot，也确实是被 span 选择器直接样式化。 |

**裸选择器风险：theme.css 中未发现独立的裸 `span { … }` 规则。** 所有在 span 上的造型都带结构、class、role、surface 或业务语义限定；没有“所有 span 统一上色/描边”的 blanket rule。这是好事：不要在新层引入裸 `span` 规则，也不要把下列类选择器减到裸 tag。表内 span 之外命中的祖先规则（例如 `.tabs-tab`、`div:has(>span…)`）只影响父节点的，不算 span 自身命中；注释中的 span 字样也不算 CSS selector。

> 行号说明：直接规则逐段列出，以当前文件确切定位为准；压缩 CSS 中某些标题/注释行的 section 隶属按最近 SECTION 识别。无显式 `SECTION` 的早期规则属 `runtime` 基础段。

## 4. 收敛结论

**native:span 不应产出“通用 span 皮肤”规则；其通用文字规则数为 0。** 保留规则应回到真正语义组件（按目前 CSS 命中需求，状态灯/marker、头像壳、chips、word-diff、tabs 子项、进度条、radio indicator、tooltip/date bubble、专用布局各自归属）。最终是若干窄语义规则，而不是按 `surface:data-table/main-content/side-panel` 为 span 复制 3 组上下文覆盖；纯 inherited color/font 交给最近有意义的父容器统一控制。

选择器骨架示例：`[data-slot="tabs-tab"][aria-selected="true"] > :where(.tab-label)`、`.statusbar [data-role="status-dot"]`、`.bio-diff .diff-word--added`、`.region-chip`，或已有稳定的 app class/slot；在 migration 中先给关键节点有语义的 scope（不要只靠 tag），通用父容器通过 `color` / `font-family` / `font-size` 管文字，局部语义状态仅覆盖必要 paint 属性。并迁移/删除已有同义高特异性旧规则，避免新低特异性规则被旧 selector 压住。

验证标准：同一父级的普通文本 span 不产生独立指纹规则；改变父级 color/font 能自然传递。badge/dot/avatar/diff 等仍仅在专用组件中有自己的背景/边框/几何声明。不要声称可由当前数据还原宽高等未采样属性。

## 5. 可视化

[打开 native:span 自身样式 vs 继承文本对照](../preview/P1-G5-native-span.html)。页面两区明确标注：第一部分展示有对应语义选择器的 status/badge/diff 示例；第二部分由容器设置继承色/字号，span 本身无 paint 声明。预览是教学式样例而非页面截图，尺寸等未采样项未伪装成 runtime 读数。
