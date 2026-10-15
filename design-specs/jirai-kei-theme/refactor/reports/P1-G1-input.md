# P1-G1 Input 组件普查

## 1. Inventory 变体

Inventory 条目为 `family=G1`、`component=input`、`tag=input`，共 10 次观察、8 个 state、3 个 fingerprint；组件级 `primaryContext=surface:main-content`，routes 为 `/charts`、`/charts/mutual`、`/community-themes`、`/my-avatars`、`/themes`、`/tools/gallery`、`/tools/inventory`。`styleVariants[]` 没有各自独立的 primaryContext/routes 字段，因此下表 routes/context 仅能按组件汇总，不能可靠分配给单个指纹。

| Fingerprint | 观察数 | primaryContext（组件级） | 关键 computedStyle 差异 |
|---|---:|---|---|
| `958cf2198d404f34` | 6 | `surface:main-content` | `color: rgb(242,235,255)`；底色 `rgb(22,17,42)`；边框四侧均 `0.8px solid`，上下为 `rgb(253,244,255)`，左右为 `rgb(105,85,124)`；阴影 `rgb(22,17,42) 1px 1px 0 inset, rgb(162,148,200) -1px -1px 0 inset`。`opacity:1`。 |
| `40dbc482b1438853` | 2 | 同上 | `color: rgb(185,173,217)`；底色 `rgb(33,26,51)`；四侧边框均 `0.8px solid rgb(108,92,224)`；阴影与首条相同；`opacity:0.65`。 |
| `382aef6aeb581f16` | 2 | 同上 | `color: rgb(185,173,217)`；底色 `rgb(22,17,42)`；边框/阴影与首条相同；`opacity:0.65`；`font-family` 变为 `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`。 |

三条共有的值：四边宽度 `0.8px`、style `solid`，`box-shadow` 如上（第三条同首条）；`outline-width:2.4px` 但 `outline-style:none`。Inventory 没有给出 `border-radius`、`padding`、`height`，不能从这份数据推断；当前主题字段规则也不统一重设它们，组件源样式/布局仍拥有这些尺寸。第三条独有字体属于上下文字体继承，不作为独立皮肤。

## 2. theme.css 中命中 input 的规则

行号为当前 `theme.css` 的物理行号。表格按实际匹配 input 元素或其原生子部件列出；`input-group-control` 是 slot 而非裸 `input`，单独列在末尾以辨明搜索/工具栏框架。

| SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `body-typography` / 965–967 | `:where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)` | `font-family: inherit` |
| `runtime` / 719–721 | `.vrcx-0-app-root input[type="time"]::-webkit-calendar-picker-indicator` | 原生时间图标使用 `var(--wd-native-clock) center/16px 16px no-repeat`，`opacity:1` |
| `user-dialog-r8` / 1993–2018 | `[data-slot="dialog-content"].entity-dialog input[type="range"]` 与其 `::-webkit-slider-runnable-track` / `::-webkit-slider-thumb`、`:focus-visible` | dialog range 本体 `appearance:none; height:16px; background:transparent; cursor:pointer`（注释明确不设 width/min-width）；track `height:8px; background:#100b1e; border:1px solid #4b3a63; box-shadow:inset 0 1px 3px rgb(0 0 0 / 55%)`；thumb `appearance:none; width/height:16px; margin-top:-5px; border:1px solid #21132d; border-radius:0; background:#ffd9ee; box-shadow:inset 0 0 0 2px #d97fc6, 0 1px 0 #f3add9`；focus `2px dashed #d6b8ef`、offset `3px` |
| `login-r8` / 2241–2247 | `[data-vrcx-0-surface="login-page"] [data-slot="input"]` | `border:1px solid #8c71b0; border-radius:2px; background-color:#16112a; color:#f2ebff; box-shadow:inset 2px 2px 0 rgb(0 0 0 / 28%), inset -1px -1px 0 #3d305e` |
| `login-r8` / 2248–2250 | 上述 login input 的 `::placeholder` | `color:#c5b5e1; opacity:1` |
| `login-r8` / 2252–2257 | 上述 login input `:focus-visible` | `border-color:#ff7fcf; border-radius:0; outline:2px solid #ff7fcf; outline-offset:1px` |
| `login-r8` / 2258–2260 | 上述 login input `[aria-invalid="true"]` | `border-color:#ff5a83` |
| `login-r8` / 2261–2264 | 上述 login input invalid + focus-visible | `border-color:#ff5a83; outline-color:#ff5a83` |
| `form-controls-r9` / 3209–3224 | `:where(:is([data-slot="checkbox"],input[type="checkbox"]))` | checkbox 专属：`appearance:none; position:relative; width/height/min-width/min-height:14px; flex:none; border:1px solid #8c71b0; border-radius:0; background:#211a33; color:#16112a; box-shadow:inset 1px 1px #392a52,inset -1px -1px #16112a; accent-color:#ffb8e6` |
| `form-controls-r9` / 3225–3236 | 同上 checked selector 及 `input[type="checkbox"]:checked::after` | checked `border-color:#6c5ce0; background-color:#ffb8e6; box-shadow:inset 1px 1px #fff0fa,inset -1px -1px #b15b9d`；伪元素画勾：`position:absolute; left:4px; top:2px; width:4px; height:7px; border:solid #16112a; border-width:0 2px 2px 0; transform:rotate(45deg)` |
| `form-controls-r9` / 3240–3257 | `:where([role="radio"],input[type="radio"])`、`input[type="radio"]` 及 checked | radio 专属方框：无原生 appearance，`border:1px solid #8c71b0; border-radius:0; background-color:#211a33; color:#16112a; box-shadow:inset 1px 1px #392a52,inset -1px -1px #16112a; accent-color:#ffb8e6`；原生 input `width/height:15px`；选中粉色底/紫边和 inset 阴影，checked input 用 6px 暗圆点背景 |
| `form-controls-r9` / 3258–3283 | `input[type="range"]` 及其 WebKit/Mozilla track/thumb | 一般 range input 的自体 `appearance:none; height:18px; margin:0; background:transparent; accent-color:#ffb8e6; cursor:pointer`；WebKit/Mozilla track/thumb 的颜色、尺寸、方角边框见 CSS 声明（外观轨道与滑块，不是文本字段皮肤） |
| `form-controls-r9` / 3301–3309 | 逗号组含 checkbox、radio、range `:focus-visible` | `outline:2px solid #ff7fcf; outline-offset:2px` |
| `fields-toolbar-r10` / 3555–3560 | `:where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"]))` 及 placeholder/disabled | 主文本色 `#f2ebff`；placeholder `#b9add9; opacity:1`；`:disabled` 或 `[aria-disabled="true"]` 为 `color:#b9add9; opacity:.65` |
| `fields-toolbar-r10` / 3587–3593 | 同上字段 selector（逗号组另含 `[data-slot="input-group"]`） | `background-color:#201936; border:1px solid #6c5ce0; border-radius:0; box-shadow:var(--jk-field-inset)`；变量定义为 `inset 1px 1px #16112a,inset -1px -1px #a294c8` |
| `fields-toolbar-r10` / 3594–3595 | 同上字段 `:focus-visible` / invalid 或 `[data-invalid]` | focus `border-color:#ff7fcf; outline:2px solid #ff7fcf; outline-offset:1px`；invalid `border-color:#ff6b8a` |
| `fields-toolbar-r10` / 3623–3625 | `:where(input[type="color"])` 与其 WebKit swatch 子部件 | input `border:1px solid #6c5ce0; border-radius:0; background:#211a33; padding:2px`；swatch-wrapper `padding:0`；swatch `border:1px solid #8c71b0; border-radius:0` |
| `fields-toolbar-r10` / 3626–3629 | `:where(input[type="file"])::file-selector-button` | `appearance:none; font:inherit; padding:3px 8px; margin-right:8px; border:1px solid #6c5ce0; border-radius:0; background:#211a33; color:#f2ebff; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d` |
| `fields-toolbar-r10` / 3631 | `:where(input[type="time"])::-webkit-calendar-picker-indicator` | `background:var(--wd-native-clock) center/16px 16px no-repeat; opacity:1` |
| `browse-history-r9` / 4073–4074 | `... [data-slot="input-group-control"]`（特定 browse-history 页面上下文，不是 input 元素 selector） | 控件 `border-radius:0; background-color:transparent; color:#f2ebff; caret-color:#ffb8e6; outline:none; box-shadow:none`；placeholder `#b9add9; opacity:1` |

其中 `fields-toolbar-r10` 是普通文本类字段共同规则；checkbox/radio/range/color/file/time 原生控件规则各自是不同组件/原生类型，不能因它们同为 `input` 标签就合并。`input[type=time]` 同时获得通用字段规则与自己的浏览器图标规则。原生输入框还会匹配通用字体继承规则。

## 3. 合并判断

- **三条 inventory fingerprint 可收敛为一类普通文本字段基线**：首条与另两条主要差别在 ink、底色、边框颜色和 opacity；后两条共享 disabled 语义特征 `opacity:0.65` 与 muted ink，建议解释为禁用/不可用呈现，而非另建常驻视觉皮肤。`382a…` 的 monospace 属于字体上下文，可保留继承，不需复制边框/背景规则。
- **不能把禁用态并入正常态**：`:disabled`/`[aria-disabled=true]` 的 muted 色和 `.65` opacity 有交互意图，必须保留。Inventory 的 `40dbc…` 只由颜色/opacity 暗示，缺少状态标注；与主题显式 disabled 规则吻合但不应仅凭指纹断言具体实例状态。
- **危险态必须保留**：通用字段 invalid 使用 `#ff6b8a` 边框；login invalid 使用 `#ff5a83` 并同步改变 focus outline。不能与普通焦点粉边框合并，否则错误反馈会消失。
- **login 页特例必须保留（或明确迁移后再删）**：login 规则使用深底、紫灰 1px 边框、较强内阴影、2px 圆角及独有 placeholder 色，与普通 toolbar 字段的 #201936 底、#6c5ce0 边框、方角和共享 shadow 不同。focus 时它又覆写为方角，因此不是简单重复声明。
- **搜索/工具栏场景**：现有 CSS 没有专属 `input[type=search]` 规则；搜索通常由 `input-group`/`input-group-control` 外框承载，input-group control 明确透明无边框、去阴影，边框和 focus ring 由外层组控制。保留这一容器语义，避免把内层输入再次画成独立框。Browse-history 的 selector 是高 specificity 页面定制，不能贸然改成裸 `[data-slot="input"]`。
- Inventory 未观测到独立 `height`、`padding` 或 `border-radius` 差异；普通字段尺寸应继续由组件/布局提供，不额外造变体。

## 4. 收敛结论与 CSS 骨架

**建议收敛为 2 种静态文本框皮肤**：①普通/toolbar 独立字段（共享暗色框架），②login 专属 recessed 字段。Disabled、focus、invalid 是这两类之上的状态修饰，不另算皮肤；搜索/组合框内部输入保持透明，由 input-group 外层负责边框。若按状态组合计数，会有多个组合，但它们应正交组合而非复制成许多完整规则。

- 普通：` :where(:is([data-slot="input"], [data-slot="textarea"], textarea, input[type="time"])) ` 统一 `color/background-color/border/border-radius/box-shadow`；同范围分别追加 `::placeholder`、`:disabled`/`[aria-disabled]`、`:focus-visible`、`[aria-invalid]`。**不要将 selector 降为裸 `input`**：目前 `:where(...)` 的 specificity 为 0，便于组件源样式/上下文按既定优先级覆盖；改成裸 `input` 会增加类型 specificity，可能覆盖 utilities/组件局部规则。特定 form 控件仍需排除/分流。
- Login：保留 `[data-vrcx-0-surface="login-page"] [data-slot="input"]` 的高优先级局部覆盖，单独拥有 `border-radius/background/box-shadow/placeholder`，并保留 invalid 与 focus 状态组合。不要把 login 选择器揉进无上下文的裸 input 规则；登录页的 2px radius 与普通方角确有意图差异。
- 组合/搜索输入：保留 `[data-slot="input-group"]` 外框与内部 `[data-slot="input-group-control"]` 透明规则；不要将内部控制器并入 standalone field 的完整边框。其长 selector specificity 很高，重构时需通过 `:where()`/分层策略有意控制优先级，而非仅缩短字符串。

## 5. 可视化

[打开并排 input 预览](../preview/P1-G1-input.html)：展示三条 inventory computedStyle 观测和建议的普通字段、禁用、危险态、login 特例以及组合搜索输入框；具体颜色、边框、阴影取自 inventory/theme.css。
