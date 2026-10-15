# P2-G5 原生元素与头像族：收敛表

## 范围与口径

本表合并 G5 avatar / avatar-slots / native:span 报告，并吸收原生 input 的邻接风险（`P1-G1-native-input.md`）。G5 指纹是 paint 采样，不等于 CSS 规则数量；`native:span` 为 711 observations / 21 fingerprints，普通文字属性多为继承，不能据此给 span 造通用皮肤（`P1-G5-native-span.md:5,42,46-51,93-99`）。头像本体 154 observations / 2 fingerprints；fallback 1/1、avatar-image data-table 19/2 与 main-content 149/1、native:img data-table 20/1（`P1-G5-avatar.md:5-20,34-36`; `P1-G5-avatar-slots.md:7-26`）。

| 簇名 | 包含哪些组件 | 判据 | 必须保留的例外 | 建议选择器骨架 | 证据（文件:行号） |
|---|---|---|---|---|---|
| 个人头像小档 | slot avatar/image/fallback；限定尺寸的原生 avatar span/img 壳 | 小尺寸档使用 `--wd-avatar-cut-sm`；壳透明、无主题边框/阴影 | image 与 fallback 的内容职责不同；状态灯不并入头像面 | `[data-slot="avatar"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])`；非 slot 使用稳定头像 class/结构锚点 | `P1-G5-avatar.md:24-36,44-51`; `P1-G5-avatar-slots.md:34,38-44` |
| 个人头像大档 | 资料卡、自身头像及大尺寸头像面 | 大尺寸切换 `--wd-avatar-cut`，其余共用几何基线 | 外部 profile decoration frame 不得裁切 | `[data-slot="avatar"][data-size="lg"] > :is(...)`；原生结构须限定尺寸和父组件 | `P1-G5-avatar.md:26-27,44-49`; `P1-G5-avatar-slots.md:38-44,64` |
| 方形群组头像 | rounded-md / rounded-lg 的 avatar shell 及 image/fallback | 由来源 `rounded-md/lg` 语义识别，而非个人头像像素轮廓 | 单独恢复来源 radius，`clip-path:none`；不可并入个人头像族 | `[data-slot="avatar"][class~="rounded-md"]` / `[class~="rounded-lg"]`，子层 `border-radius:inherit` | `P1-G5-avatar.md:28,52,61-63`; `P1-G5-avatar-slots.md:45,63` |
| fallback 内容态 | `[data-slot="avatar-fallback"]` 首字母/占位 | 缺图内容与单独采样背景/字色 | 仅 1 次观察；不将样本色推广到未采样场景，也不替代 image 加载职责 | slot 限定 fallback；与壳几何共享，不共享内容色职责 | `P1-G5-avatar.md:30,34-36,64`; `P1-G5-avatar-slots.md:7-13,61` |
| 状态、堆叠及装饰 | status dot/外环、AvatarGroup separator/count/badge、profile frame | 是 avatar 的正交节点或 sibling，不是 avatar-image 皮肤 | app-owned 状态色和 mask 保持应用所有权；stack separator `0 0 0 1px var(--background)`；外部装饰免裁切 | `.user-status-indicator`、`i.x-user-status`、`[data-slot="avatar-group"]` 等专用语义锚点 | `P1-G5-avatar.md:29,49-54,63`; `P1-G5-avatar-slots.md:46-48,64-65` |
| Span 语义原子 | 状态点、badge/chip、diff word、tabs label、progress、radio indicator、布局 wrapper | 背景/边框等非继承 paint 或已限定语义 class/slot；普通 span 仅继承父级 | 21 fingerprints 不等于21种文字皮肤；保留各组件具体语义，不泛化为 span | `.region-chip`、`.bio-diff .diff-word--added`、`[role="radio"] > span` 等窄锚点 | `P1-G5-native-span.md:46-56,64-89,93-99` |
| 原生表单元素 | `input` checkbox/radio/range/color/file/time、select；普通文本 input 未形成通用皮肤 | 按 type 及用途分派；隐藏代理 input 不可被强制变可见字段 | checkbox/radio/range/color/file 子部件与 dialog range hit area；input-group control；当前 inventory 无逐项 type 映射 | `:where(input[type="checkbox"])` 等类型限定；未来可见文本字段按允许 type + 排除隐藏/组内控件 | `P1-G1-native-input.md:24-35,41-47,55-68,72-75` |

## 1. 裸元素选择器清单（权重审计）

权重按 CSS specificity `(ID, class/attribute/pseudo-class, type/pseudo-element)`。Tailwind 常规 `.bg-*` / `.text-*` 为 `(0,1,0)`。下表列样式层中**选择器直接以原生标签为目标、且标签不是被 class/slot 限定的同义组件选择器**；元素出现在带 class/slot/结构条件的复合选择器中，不等同全局裸规则。伪类 `:not(.x)` 的参数 specificity 计入；`:where(...)` 内容 specificity 为 0。

| 文件:行号 | 选择器 | 设置内容 | 权重 | Tailwind `.bg-*` / `.text-*` 覆盖判断 |
|---|---|---|---|---|
| `04-group-spacing-and-typography.css:32-35` | `html`, `body` | `font-family:var(--wd-body-font-family)` | 各 `(0,0,1)` | class utility 通常可覆盖其 color/font 等同属性；但该规则只设字体族，`.font-*` 可能竞争，具体层叠取决于最终 CSS 顺序。 |
| `04-group-spacing-and-typography.css:48-50` | `:where(button,input,textarea,select):not(.font-sans):not(.font-heading):not(.font-mono)` | `font-family:inherit` | `(0,3,0)` | 三个 `:not()` 的 class specificity 合计 `(0,3,0)`，比单个 utility 高；可能压过单个 `.font-*` 的同属性。建议改成显式零权重语义骨架或按实测 cascade 整理。 |
| `04-group-spacing-and-typography.css:62-65` | `:where(code,samp)` | monospace 字体 | `(0,0,0)` | 会被 `.text-*` / `.font-*` 覆盖同属性。 |
| `04-group-spacing-and-typography.css:63-65` | `pre:not(.font-sans):not(.font-heading)` | monospace 字体 | `(0,2,1)` | 普通 `.font-*` 无法以 specificity 胜过；`font-sans` 排除使显式例外不命中。 |
| `04-group-spacing-and-typography.css:70-71` | `kbd:not(.font-mono)` | app sans 字体 | `(0,1,1)` | 单个 `.font-*` 权重较低；仅 `.font-mono` 被排除，其他 utility 是否覆盖取决于层叠。 |
| `12-loader-and-forms.css:68-83` | `:where(:is([data-slot="checkbox"],input[type="checkbox"]))` | checkbox geometry/appearance/border/bg/shadow/accent | `(0,0,0)` | `.bg-*`、`.text-*` 通常可覆盖同属性；必要状态例外须靠层叠组织，不应提高裸标签权重。 |
| `12-loader-and-forms.css:84-88` | `:where(:is([data-slot="checkbox"],input[type="checkbox"]):is([data-checked],[aria-checked="true"],:checked))` | checked border/bg/shadow | `(0,0,0)` | 可被任一 class utility 覆盖同属性。 |
| `12-loader-and-forms.css:89-95` | `:where(input[type="checkbox"]:checked)::after`（同组 slot 规则） | 勾号伪元素 | `(0,0,1)`（伪元素） | `.bg-*` 可覆盖继承/背景相关值但目标伪元素并非 input 本体；行内 class specificity 仍需按伪元素目标判断。 |
| `12-loader-and-forms.css:99-108` | `:where([role="radio"],input[type="radio"])` | appearance/border/bg/shadow/accent | `(0,0,0)` | 会被 `.bg-*` / `.text-*` 覆盖同属性。 |
| `12-loader-and-forms.css:109` | `:where(input[type="radio"])` | width/height | `(0,0,0)` | utility 可覆盖同属性。 |
| `12-loader-and-forms.css:110-114` | `:where(:is([role="radio"],input[type="radio"]):is(...))` | checked border/bg/shadow | `(0,0,0)` | utility 可覆盖同属性。 |
| `12-loader-and-forms.css:116` | `:where(input[type="radio"]:checked)` | checked 背景图尺寸/位置/重复 | `(0,0,0)` | `.bg-*` 可能改背景相关声明；是否影响图案取决于 utility 实际属性。 |
| `12-loader-and-forms.css:117-124` | `:where(input[type="range"]:not(.entity-dialog *))` | range appearance/height/margin/bg/accent/cursor | `(0,0,0)` | utility 可覆盖同属性。 |
| `12-loader-and-forms.css:125-134` | `:where(input[type="range"]:not(.entity-dialog *))::-webkit-slider-*` | track/thumb 造型 | `(0,0,1)`（伪元素） | class utility 通常不会直接匹配伪元素，不能概括为被覆盖；需单独审查伪元素规则。 |
| `12-loader-and-forms.css:136-142` | `:where(input[type="range"])::-moz-range-*` | track/thumb 造型 | `(0,0,1)`（伪元素） | 同上。 |
| `12-loader-and-forms.css:160-168` | `:where(... input[type=checkbox/radio/range] ...):focus-visible` | focus outline | `(0,0,0)` | class utility 可覆盖同属性，且 `:where` 刻意降权。 |
| `12-loader-and-forms.css:170-176` | `:where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])` | radius/border/bg/color/shadow | `(0,0,0)` | `.bg-*` / `.text-*` 可覆盖同属性；顺序和重要性仍影响结果。 |
| `12-loader-and-forms.css:186-191` | `:where(select)` | appearance、箭头背景、padding | `(0,0,0)` | utilities 可覆盖同属性。 |
| `02-foundation.css:101` | `.entity-dialog … [data-slot="button"]:not(.border-0) img` | 限定头像 img 的 radius/clip-path | 至少 `(0,4,1)`，以完整复合选择器计数 | 高于单个 utility；这是窄上下文而非 `img {}`。 |
| `11-controls-and-pages.css:449-462` | `button:has(…span…size-10/9…) > span…` | 特定头像壳 clip-path/清框 | 由完整 class 和 :has 条件构成，高于 `(0,1,0)` | 可能压过单个 utility；迁移时保留例外并避免继续堆叠 specificity。 |

裸 `img {}`、裸 `span {}`、裸 `input {}` 均不存在；span 造型规则均有结构/语义限定（`P1-G5-avatar-slots.md:52-56`; `P1-G5-native-span.md:64-89`）。注意含裸标签的复合 selector（例如 avatar 末端 `img`）不是全局裸选择器。建议 P3 禁止新增 tag-only 皮肤；`:where()` 可把语义限定规则降权，但需同时迁走旧高权重重复规则，否则新规则仍会被旧规则压住（`P1-G5-avatar.md:68`; `P1-G5-avatar-slots.md:69-72`）。

## 2. 现状中的重复

- avatar slot 基线、login 上下文、popup 上下文、status/activity/friend 行 residual、多尺寸群组例外重复维护；可合并共同基线，迁移高 specificity 覆盖时必须同步移除旧规则（`P1-G5-avatar.md:44-53,66-68`; `P1-G5-avatar-slots.md:34-49,69-72`）。
- 头像尺寸切角在多种原生 span/img 壳中按尺寸反复声明；这是相同像素形状的重复应用点，不意味着可删掉各自的上下文锚点（`P1-G5-avatar-slots.md:38-45`; `P1-G5-native-span.md:64,71,77,79`）。
- AvatarGroup 圆形 separator 与个人像素切角是不同视觉用途；separator 只在 group stacking 定义，不能挪作个人头像边框（`P1-G5-avatar.md:53`; `P1-G5-avatar-slots.md:46,62`）。
- 普通 span 没有通用文字皮肤的重复；反而语义 badge/diff/status 等分别由各自限定规则维护，不应按 data-table/main-content/side-panel 复制通用覆盖（`P1-G5-native-span.md:89,93-99`）。
- 原生 input 的主题规则按类型分组，没有通用 `input {}`；time picker indicator 在 runtime 与 fields-toolbar 各有一条同用途声明，需核对两者 scope/URL 后决定是否可合并（`P1-G1-native-input.md:56,66,68`）。

## 3. 冲突与待修

- **核实：没有裸 `img {}`。** 头像图仅由 slot 或限定 dialog/尺寸/结构选择器命中；不能加全局 img 规则，否则误伤 world/screenshot media（`P1-G5-avatar-slots.md:52-56`）。
- **核实：没有主题 `object-fit` 声明。** `object-cover` 仅作为匹配条件，不是本主题对 object-fit 的赋值；inventory 也未采集 object-fit（`P1-G5-avatar-slots.md:5,24-30,60`）。要否显式 cover 待上游验证，不得写成已存在事实。
- **核实：头像由自身 `clip-path` 裁切，不是 overflow 壳裁切。** slot image/fallback 自身设 polygon；若干原生头像壳也设 clip-path，报告未见这些主题规则声明 `overflow:hidden`；inventory 未采集 overflow（`P1-G5-avatar-slots.md:34,37-45,60`）。
- **核实：群组方形头像独立恢复 radius。** rounded-md/lg 壳保留来源 radius、关闭 clip-path，内容层继承 radius 且关闭裁切（`P1-G5-avatar.md:28,61-63`; `P1-G5-avatar-slots.md:45,63`）。
- avatar-image data-table 两种 fingerprint 的 clip-path 有差异，且 opacity 0 是加载样本，不能把它当所有已加载头像默认态；保留 loading/skeleton 状态（`P1-G5-avatar-slots.md:19-22,70`）。
- Fallback 色值只有单次样本，状态色是 app-owned；不得据单个观测覆盖所有 fallback 或状态节点（`P1-G5-avatar-slots.md:11-13,61-65`）。
- input inventory 未记录 type，121 主内容观察和4 sheet 观察不可逐指纹映射 checkbox/radio/file 等；隐藏代理不可因广义字段规则变成可见控件（`P1-G1-native-input.md:5,28-31,47`）。
- 裸元素权重需避免把 `:where()` 以外的 `:not(.class)` 当零权重；控制器字体规则实际 `(0,3,0)`，与单个 utility 的冲突须在 P3 cascade 迁移时处理（`04-group-spacing-and-typography.css:46-50`）。

## 4. 零覆盖清单

- G5 原生 span 的纯文本通用皮肤：主题应为零规则；普通文字由父容器继承（`P1-G5-native-span.md:93-99`）。
- avatar slot inventory 未采集 radius、宽高、object-fit、overflow；不得声称这些属性从 inventory 已被覆盖或观测（`P1-G5-avatar.md:5,17-20`; `P1-G5-avatar-slots.md:5`）。
- 未见主题设置 object-fit；不应把类名 `object-cover` 误列成主题赋值（`P1-G5-avatar-slots.md:30,54,60`）。
- 原生 input 的普通 text/number/search 没有完整通用字段框规则；只有明确类型或 slot 分支受主题控制。实际各 type 在当前页面的逐条覆盖映射待确认（`P1-G1-native-input.md:31,35,41-47,68`）。
- Avatar fallback 仅 data-table 单次记录；其它 context 的 fallback 样式覆盖待确认（`P1-G5-avatar-slots.md:7-13`）。
- `native:img` 只在 data-table `/social/friend-list` 采到 20 次；不能据此推断其它原生图片类别的覆盖率（`P1-G5-avatar-slots.md:24-26`）。

## 5. 收敛后的规模估计

按视觉/职责簇收敛为 **7 个簇**（表中七行）：个人小档、个人大档、方形群组、fallback、独立状态/堆叠/装饰、span 语义原子、原生表单元素。个人头像共同壳基线可由一个 slot 规则承载，尺寸只保留小/大两档轮廓；群组例外单列；span 普通文字皮肤归零，但语义原子仍保留各组件规则；input 维持按类型的现有分支，是否补可见文本字段另待 DOM/type 证据（`P1-G5-avatar.md:60-68`; `P1-G5-native-span.md:93-99`; `P1-G1-native-input.md:72-75`）。

可量化基线：span 的通用皮肤规则目标 **0**；avatar 本体 2 个 paint fingerprint 收敛为 **1 个共同壳基线 + 2 个尺寸轮廓选择**；个人头像之外至少保留 **1 个群组恢复例外**；类型控件不合成一条全局 input 规则。旧上下文头像重复块数量未在报告中逐 selector 统计，具体可删行数/规则数**待确认**，不可伪报为精确节省量（`P1-G5-avatar.md:5,60-68`; `P1-G5-avatar-slots.md:69-72`; `P1-G5-native-span.md:95-99`）。
