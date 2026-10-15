# P1-G3 Tooltip（trigger + content）组件普查

## 1. Inventory 全记录与按 primaryContext 汇总

Inventory 共 **9 条组件记录**：tooltip-trigger 8 条、582 次观察、13 个记录内 fingerprint；tooltip-content 1 条、1 次观察、1 个 fingerprint。fingerprint 数为各 variant 的 `styleFingerprintCount` 求和（同一视觉指纹可能跨 variant 重复，不能当全局去重值）。

| 组件 | primaryContext | 记录数 | 观察数 | fingerprint 数（记录内合计） |
|---|---|---:|---:|---:|
| tooltip-trigger | `surface:main-content` | 4 | 78 | 7 |
| tooltip-trigger | `surface:statusbar` | 2 | 168 | 2 |
| tooltip-trigger | `surface:titlebar` | 2 | 336 | 4 |
| tooltip-trigger | **合计** | **8** | **582** | **13** |
| tooltip-content | `overlay:tooltip-content` | 1 | 1 | 1 |
| **总计** | — | **9** | **583** | **14** |

### 全部记录及 styleVariants 指纹

| # | 组件 / tag / variant / size | primaryContext | observations | styleVariants（fingerprint：observations） |
|---:|---|---|---:|---|
| 1 | trigger / button / ghost / icon | `surface:main-content` | 46 | `e04cb022996b4faa`:42；`2f05a1f851e59f9e`:4 |
| 2 | trigger / button / ghost / icon-xs | `surface:main-content` | 9 | `ce80affb2779ed4b`:6；`a8ac414df49856be`:3 |
| 3 | trigger / button / outline / default | `surface:main-content` | 21 | `c9055c30289f0cd8`:11；`2459375e03e270eb`:10 |
| 4 | trigger / button / outline / sm | `surface:main-content` | 2 | `bdf4fb04fdf0d436`:2 |
| 5 | trigger / button / ghost / sm | `surface:statusbar` | 84 | `1046741be59f7f8f`:84 |
| 6 | trigger / button / ghost / icon | `surface:statusbar` | 84 | `19275f737743733f`:84 |
| 7 | trigger / button / ghost / xs | `surface:titlebar` | 42 | `2c2cf81d52421211`:41；`20bc3bd06a25707a`:1 |
| 8 | trigger / button / ghost / icon-sm | `surface:titlebar` | 294 | `67b9f6d904dd2d18`:168；`325b4df1b262edb0`:126 |
| 9 | content / div / null / null | `overlay:tooltip-content` | 1 | `7b4b27e748784c39`:1 |

记录 1–9 均为 G2（trigger）或 G3（content）。Trigger 的 fingerprint 是**触发按钮本身**在不同尺寸、状态、祖先组件下的按钮外观，不是 tooltip 浮层的 fingerprint。Main-content 记录的完整状态值：ghost/icon `e04…` 透明底、`rgb(242,235,255)` 字色、无边/无影；其 4 条次要 fingerprint 是 `rgb(32,25,54)` 底、`rgb(108,92,224)` 边与 inset 双线阴影。ghost/icon-xs 两指纹皆透明底无边无影、文字色分别 `rgb(185,173,217)` / `rgb(214,184,239)`；outline/default 两态分别是 `rgb(32,25,54)` 底+ `rgb(227,210,245)` 字、以及粉底 `rgb(255,184,230)`+暗字 `rgb(22,17,42)` 和双线 inset；outline/sm 为半透明紫底、淡紫边。statusbar 两触发器均透明底无边无影，字色 `rgb(33,19,45)`（字体大小 12.8/14px）。titlebar 的 ghost/xs 与 ghost/icon-sm 均出现深色字、粉色背景/暗边/内阴影的状态；icon-sm 另有透明底态。它们均是 trigger 的按钮状态差异，不应误归为 tooltip 浮层族。

## 2. 浮层视觉家族与 computedStyle

Inventory 对 tooltip-content 只有一个实测样本；以下家族划分结合 theme.css 中有明确选择器的实现。没有被样本覆盖的语义类别不冒充实测视觉差异。

| 视觉家族 | 样本/来源 | 背景 / 字色 / 边框 / 阴影 | 圆角 / 内边距 / 最大宽度 / 层级 |
|---|---|---|---|
| 普通单块 tooltip（含普通提示、截断文本 title 替代） | inventory 唯一 content 指纹 `7b4b27e748784c39`，1 次，`/feed`；theme.css overlays-r10 | `rgb(33,26,51)` / `rgb(242,235,255)` / 四边 `0.8px solid rgb(108,92,224)` / `inset 1px 1px 0 rgb(105,85,124), inset -1px -1px 0 rgb(122,63,109), 3px 3px 0 rgb(16,11,30)` | computedStyle 未采集 / 未采集（CSS 声明 `6px 12px`） / 未采集 / 未采集 |
| Statusbar 服务端/WebSocket 多行提示 | theme.css `popups-r9` 特殊识别；inventory 没有对应 content 样本 | CSS：`#211a33` / `#f2ebff` / `1px solid #6c5ce0` / `inset 1px 1px 0 #69557c, 2px 2px 0 #100b1e` | computedStyle 未采集 / CSS `6px 8px` / 未采集 / 未采集 |
| Arrow / 方向箭头 | 唯一 content 的指纹未记录箭头本体；CSS 普通 tooltip 与状态栏样式均针对 `> div.rotate-45` 隐藏 | 容器颜色同其所属 tooltip 样式；箭头自身颜色未采集 | 未采集 / 未采集 / 未采集 / 未采集 |
| 快捷键提示 / 侧栏图标提示 | inventory 没有独立 tooltip-content 记录或可确认的 trigger→content 文本；仅从现有证据不能证明其拥有独立皮肤 | 未采集 | 未采集 |

Inventory 的 tooltip-content computedStyle 其余值：`opacity:1`、`filter:none`、`transform:none`、字体 `"WD Pixel CJK", "Geist Variable", Geist, "Noto Sans SC", system-ui, sans-serif`，`12px / 400`。fingerprint 不记录 padding、max-width、z-index，也未记录 DOM arrow 的独立样式。

## 3. theme.css 命中规则（只读核查）

共命中 `tooltip` 字样的 CSS 规则主要落在 `SECTION popups-r9` 与 `SECTION overlays-r10`；`[role="tooltip"]` 未发现命中。相关声明如下（selector 省略空白换行但保持语义）：

| SECTION / 行号 | 选择器 | 实际声明摘要 |
|---|---|---|
| `popups-r9` / 2773–2792 | `body:has(.vrcx-0-statusbar [data-slot="tooltip-trigger"][data-popup-open]) [data-slot="tooltip-content"]:is(:has(> div.flex.flex-col.gap-1.text-xs),.flex.flex-col.gap-1.text-xs)` | `--radius:0; padding:6px 8px; overflow-wrap:anywhere; background:#211a33!important; color:#f2ebff; opacity:1; border:1px solid #6c5ce0; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, 2px 2px 0 #100b1e; backdrop-filter:none; animation:none!important; transition:none!important` |
| `popups-r9` / 2794–2796 | 上述 statusbar selector `> div[class~="rotate-45"]` | `display:none`（注释说明隐藏 BaseUI Arrow child，不碰 pseudo/positioner） |
| `overlays-r10` / 3637–3653 | `[data-slot="tooltip-content"]:not(:has(> div.flex.flex-col.gap-1.text-xs)):not(.flex.flex-col.gap-1.text-xs)` | `--radius:0; box-sizing:border-box; padding:6px 12px; overflow-wrap:anywhere; background:#211a33; color:#f2ebff; opacity:1; border:1px solid #6c5ce0; border-radius:0; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e; backdrop-filter:none; animation:none!important; transition:none!important` |
| `overlays-r10` / 3654–3657 | 普通 tooltip selector `> div.rotate-45` | `display:none`；注释称隐藏对角菱形 |
| `overlays-r10` / 3723–3738 | `@media (prefers-reduced-motion:reduce)` 和 `html.reduce-effects` 下 `[data-slot="tooltip-content"]` | `animation:none!important; transition:none!important` |

同文件其他 tooltip-trigger 命中是触发器按钮自身样式，不是浮层：`SECTION settings` / 1282–1291 的 toggle-group outline 下 `:is([data-slot="toggle"],[data-slot="tooltip-trigger"])` 复用边框/底色/hover/pressed/focus 样式；`SECTION controls-r9` / 2498–2522 对页面工具栏 aria-pressed trigger 的状态选择；`SECTION overlays-r10` / 2722 是 popover 内特定头像行的 ghost trigger；`SECTION pixel-controls` / 3123 对特殊小圆形 trigger 做方角；`SECTION R10...` / 4941–4945 保留快捷键标签 `span[data-slot="tooltip-trigger"]` 的宿主尺寸/字距等，注释明确该槽可能被 trigger 覆盖；`SECTION R10...` / 5216 起还有路由 button+variant 匹配的说明。均不应统统套成浮层皮肤。

### Portal、定位与动画边界

- `interactions.json` 的 `feed-quick-search-tooltip` 在 `/feed` 对 `[data-slot="tooltip-trigger"][aria-label^="快速搜索"]` 做 hover，期待 `[data-slot="tooltip-content"]`；这是可用于验证显示触发的唯一直接 interaction 记录。
- CSS 注释明确 ordinary Tooltip.Content 和 StatusBar tooltip 都 portal 到 `body`。statusbar 特殊选择器用 `body:has(打开的 statusbar trigger)` 锁定具体门户，且用子树结构 signature 区分服务器/WebSocket 提示，避免影响同时存在的普通 tooltip。
- tooltip 内容皮肤规则没有 `position`、`top/left/inset`、定位用 `transform` 或 arrow 定位属性；没有 tooltip 专属 `@keyframes` 或动画名称引用。可见相关规则反而把 `animation`/`transition` 设为 none。页面其他 `@keyframes`（如 r9 badge 等）不是 tooltip 命中，不应挪动或改写。现存 arrow 子节点是被隐藏而非重新定位；positioner、portal placement 及箭头定位由 host/组件负责。动画属于冻结层，重构只保留禁用声明/引用现状，不触碰动画资源。

## 4. 合并判断

- **可合并：普通提示、快捷键提示、标题/title 替代、侧栏图标提示的容器基底。** 目前普通 tooltip 只有一个样本，且未发现任何语义证据要求独立底色；建议同用通用 tooltip 面板样式。快捷键的 `kbd`/shortcut 子节点若以后证实存在，只单独处理排版，不能凭空作为独立容器变体。
- **应保留 statusbar 多行提示作为结构/密度例外**：当前 CSS 有明确针对两个 stack signature 的规则，紧凑 padding 与短阴影、换行策略以及 active trigger guard 都有意图；不应删掉其结构识别。容器色系可以共享 token，但结构选择器和尺寸维持独立。
- **箭头应保留宿主定位职责，但皮肤中保持隐藏**：theme.css 明确对两类 tooltip 的 rotate-45 子节点 `display:none`。不得恢复箭头、伪造箭头或接管 positioner 的 transform/placement；可视化展示隐藏状态，同时以虚线方向标注展示“宿主方向由 placement 决定”。
- **多行文本**需保留 `overflow-wrap:anywhere` 与可读排版；不要将内容裁成单行。max-width 未采集，不能臆造具体宽度。
- Trigger 本身的 icon/size、outline/ghost、hover/pressed/focus 状态必须留在按钮层；合并 tooltip-content 时不能改变这些状态。

## 5. 收敛结论与 CSS 骨架

**建议 tooltip-content 收敛为 2 个结构规则**：一个全局普通 portal panel（覆盖普通/快捷键/截断标题/侧栏提示），一个 statusbar 多行结构例外；箭头子节点统一遵守当前隐藏约定。基础规则骨架：`[data-slot="tooltip-content"] { box-sizing; padding; color; background; border; border-radius; box-shadow; overflow-wrap; }`，仅 statusbar 用 `body:has(.vrcx-0-statusbar [data-slot="tooltip-trigger"][data-popup-open]) [data-slot="tooltip-content"]...` 做结构限定。不要用 `.app-root ...` 祖先选择器包住 portal 规则。

**Specificity 警告**：普通 content 规则目前是单属性选择器并由后置 overlays-r10 提供；statusbar 规则 specificity 明显更高（`body:has(...)` + attribute + `:is/:has`），因此会压过普通面板。若搬入 `:where()`、加 scope class 或调整加载顺序，必须检验 body 直属 portal 下的实际层叠；不应通过全局 `[role="tooltip"]` 无差别抓取非本应用/其他浮层，也不应降低 statusbar active-trigger guard 的优先级。当前规则没有 `!important` 的普通背景属性而 statusbar 有，若共基类合并要明确 statusbar 覆盖顺序。

## 6. 可视化

[打开 tooltip 家族预览](../preview/P1-G3-tooltip.html)。预览内嵌样式，包含普通、快捷键内容示意、截断文本替代、多行 statusbar 提示及箭头方向/隐藏约定；其中非 inventory 样本是结构示意而非声称已采集的独立 computedStyle。