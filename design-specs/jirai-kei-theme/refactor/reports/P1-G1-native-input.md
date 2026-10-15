# P1-G1 原生 `input` 组件普查

## 范围与数据边界

这里只讨论 `component=native:input`、`tag=input`，不把 `[data-slot="input"]` 包装控件并入。Inventory 有两条组件记录：主内容区 121 次观察/15 states/7 fingerprints；`overlay:sheet-popup` 4 次/1 state/1 fingerprint。原始清单没有保存 `type`、页面 DOM selector 或每条 fingerprint 的单独 route/context，因此不能仅凭 fingerprint 严格反推出具体 HTML type；下文将可确证事实与按样式/主题规则推断分开写，避免把猜测伪装成观测结论。

## 1. 全部 inventory 记录与变体

主内容区 routes：`/charts`、`/charts/mutual`、`/charts/timeline`、`/charts/two-person`、`/favorites/avatars`、`/favorites/friends`、`/favorites/import/friends`、`/favorites/worlds`、`/settings`、`/tools`、`/tools/gallery`、`/tools/screenshot-metadata`。组件级 primaryContext=`surface:main-content`。contextTrails 计数分别为 page-scaffold 100、object-row 17、page-toolbar 3、main-content 1。

| 记录 | Fingerprint | 观察数 | primaryContext | 关键 computedStyle 差异 |
|---|---|---:|---|---|
| 主内容区 | `b73005d610f317f3` | 88 | `surface:main-content` | ink `#16112a`，底 `#211a33`；无边框；inset shadow `#392a52 1px 1px` + `#16112a -1px -1px`；clip-path `inset(50%)`；14px/400；opacity 1 |
| 主内容区 | `67993961b8af6dc4` | 15 | 同上 | 与 b730 皮肤值基本相同，font-size 16px（而非14px）；同为透明边框、同影、同 clip-path、opacity 1 |
| 主内容区 | `5ac90023bb837855` | 11 | 同上 | 选中态特征：粉底 `#ffb8e6`，inset highlight `#fff0fa` + 暗粉 `#b15b9d`；无边框；clip-path `inset(50%)`；14px |
| 主内容区 | `6bb0aa9f71562e40` | 3 | 同上 | 透明底、无边框/阴影、clip-path `inset(50%)`；浅字 `#f2ebff`；12px |
| 主内容区 | `cb55418a2fa8143b` | 2 | 同上 | 同 b730 的暗底/阴影/无边框/clip-path；font-weight 500（其余主要相同） |
| 主内容区 | `1b4e566970acb095` | 1 | 同上 | 透明底、无边框/阴影、clip-path `inset(50%)`；浅字；14px |
| 主内容区 | `f06b1475429e3543` | 1 | 同上 | 透明底、无边框/阴影、clip-path `inset(50%)`；muted 字 `#b9add9`；12px |
| Sheet popup | `1079101a054542eb` | 4 | `overlay:sheet-popup` | 透明底、无边框/阴影、clip-path `inset(50%)`；浅字；16px/400；routes 仅 `/charts/mutual` |

这些 computedStyle 共有 `outline-style:none`、`outline-width:2.4px`；outline-color 是默认半透明紫色值。这里的 `clip-path:inset(50%)` 对实际呈现尤其关键：这批隐藏 input 并非屏幕上可见的完整字段框。fingerprint 的字号、字重或 ink 分裂不应直接当成多套皮肤。

## 2. 控件与页面归类、与 `[data-slot="input"]` 的区别

### 可以确定的结论

1. 121 条的 context 总体集中在主页面 scaffold/object-row，而不是统一的文本表单；inventory 未记录 `type`，因此 88/15/11 等数值**不能据此断言**分别就是 checkbox/radio/file。主内容 routes 涵盖图表、收藏、设置和工具，原生 input 很可能混有筛选/搜索、隐藏文件选择器、颜色/时间/范围控件及 checkbox/radio。
2. 88 + 15 + 11 条暗底/粉底两族拥有 `clip-path:inset(50%)`，边框宽度为 0，表明它们不应被误读为可见的暗底紫边文本框；更像是被裁切/隐藏、由邻接 label/custom UI 展示的原生控件，或其他需隐藏原生面板的输入。主内容的小计和约 11 条选中变体很符合成组选择控件的状态分布，但 type 本身没有证据，故只能列为候选解释。
3. 其余 7 条（含 popup 4 条）透明底、无边框、无阴影，也没有传统暗色文本框皮肤。`font-family:inherit` 只统一字体继承，不会画出背景/边框。
4. 原生 input 并非全都裸露默认外观：主题有明确的 checkbox/radio/range/color/file/time 子部件样式；但无类型的 `input` 通用规则不存在。特定类型 selector 才覆盖部分类型。

### 对比已覆盖的 slot input

`[data-slot="input"]` 是组件层的文本字段，fields-toolbar-r10 在 3555–3595 给它（与 textarea、time 等一起）明确设置浅色字、深底 `#201936`、紫边 `#6c5ce0`、方角与 `--jk-field-inset`，并有 placeholder、disabled、focus、invalid 状态。login 页另有更高优先级的局部 recessed 样式。原生 `<input type="text">` 没有自动获得 `[data-slot="input"]` 身份；规则没有裸 `input` 文本字段 selector，所以普通原生 text/number/search 不能指望得到那套完整皮肤。部分原生类型独立受控（checkbox/radio/range/color/file/time），其他类型在浏览器默认 appearance、宿主组件样式或 UA 样式之间呈现；而 inventory 中 `clip-path:inset(50%)` 的原生项显然也不等同可见 slot 文本框。

### 类型 × 页面位置（结合命中规则的可证范围）

| type / 场景 | 页面位置与证据 | 当前/建议处理 |
|---|---|---|
| `text`、`number`、`search` | 可能出现在主内容工具栏、筛选/搜索等；清单没有 type 逐条映射。`search` 常见于 input-group，其内控件由外框持有边框。 | 独立原生文本字段应补统一字段框；input-group 内保持透明无框，不重复套皮。number 若确实是原生 `<input type=number>` 也归此类，保留 spinbutton 原生行为/尺寸。 |
| `checkbox`、`radio` | 主题 3209–3257 有明确原生控件规则；主内容里高频、选中指纹可疑似对应，但 inventory 不足以精确绑定 fingerprint。 | 保留专门方角像素控件样式与 checked/focus 状态；不并入文本框。 |
| `range` | form-controls-r9 有全局 range track/thumb；dialog 的 entity range 在 user-dialog-r8 单独覆盖（注释要求保留浏览器 input box/hit area）。 | 保留两条语义分支与可用 hit area，不改造成文本字段。 |
| `file` | fields-toolbar-r10 仅定制 `::file-selector-button`；页面位置无法由 inventory 精确识别。 | 只样式化按钮，保留文件名区、原生选择器交互。 |
| `color` | fields-toolbar-r10 有色块外框与 swatch 子部件；具体路由/指纹映射缺失。 | 保留专门 swatch，不套文本框 padding/背景方案。 |
| `time` | fields-toolbar-r10 将 time 纳入普通字段共通规则，另在 runtime / fields-toolbar-r10 定制日历图标。 | 继续按单行字段皮肤处理，但保留平台图标；检查重复 indicator 规则。 |
| 隐藏/代理 input | clip-path 50% 的 88/15/11 fingerprint；可能是 custom checkbox/file 等承载 input，type 不明。 | 不要对所有原生 input 直接恢复可见框，否则会在自绘 label 上叠出第二个控件。应按 type+隐藏用途明确分流。 |

## 3. theme.css 命中原生 input 的规则

行号为当前 `theme.css` 物理行号；只列命中原生 input 本体或原生子部件的规则。SECTION 名称按文件注释。

| SECTION / 行 | selector | 实际声明（摘要） |
|---|---|---|
| `body-typography` / 965–967 | `:where(button, input, textarea, select):not(.font-sans):not(.font-heading):not(.font-mono)` | `font-family:inherit`；**只管字体**。 |
| `runtime` / 719–721 | `.vrcx-0-app-root input[type="time"]::-webkit-calendar-picker-indicator` | indicator 使用 `var(--wd-native-clock) center/16px 16px no-repeat`、`opacity:1`。 |
| `user-dialog-r8` / 1993–2018 | `[data-slot="dialog-content"].entity-dialog input[type="range"]` 及 WebKit track/thumb、`:focus-visible` | input `appearance:none;height:16px;background:transparent;cursor:pointer`；track 高8px、暗底、紫灰边及 inset shadow；thumb 16px方形粉色/内高光；focus 2px dashed。 |
| `form-controls-r9` / 3209–3236 | `:where(:is([data-slot="checkbox"],input[type="checkbox"]))` 与 checked/`::after` | 自定义 checkbox 方形 14px，`appearance:none`，紫边、暗底、inset shadow；checked 粉底/亮边并用伪元素画勾。 |
| `form-controls-r9` / 3240–3257 | `:where([role="radio"],input[type="radio"])`、checked | 方形像素 radio，暗底/紫边/内阴影；原生 input 15px；checked 为粉底并以 6px 暗圆点背景表示。 |
| `form-controls-r9` / 3258–3283 | `:where(input[type="range"]:not(.entity-dialog *))` 与 WebKit/Mozilla track/thumb | 非 entity-dialog range 本体 `appearance:none;height:18px;margin:0;background:transparent;accent-color:#ffb8e6;cursor:pointer`；track/thumb 独立样式。 |
| `form-controls-r9` / 3301–3309 | checkbox、radio、非 dialog range `:focus-visible` 选择器组 | `outline:2px solid #ff7fcf;outline-offset:2px`。 |
| `fields-toolbar-r10` / 3555–3560 | `:where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"]))` 及 placeholder/disabled | color `#f2ebff`；placeholder `#b9add9`、opacity 1；disabled/muted `#b9add9`、opacity .65。**不含普通原生 text/number/search。** |
| `fields-toolbar-r10` / 3587–3595 | 上述字段 selector + `:where([data-slot="input-group"])`；focus/invalid | 深底 `#201936`、1px `#6c5ce0` 边、方角、`var(--jk-field-inset)`；focus 粉边/outline；invalid `#ff6b8a`。input-group selector 是外框。 |
| `fields-toolbar-r10` / 3623–3625 | `:where(input[type="color"])` 及 WebKit swatch | color input 紫边、方角、暗底、padding 2px；wrapper padding 0；swatch 紫灰边/方角。 |
| `fields-toolbar-r10` / 3626–3630 | `:where(input[type="file"])::file-selector-button` | button `appearance:none;font:inherit;padding:3px 8px;margin-right:8px`，紫边、方角、暗底、浅字、像素 inset shadow。 |
| `fields-toolbar-r10` / 3631 | `:where(input[type="time"])::-webkit-calendar-picker-indicator` | 同 clock asset；opacity 1。 |

**结论：不存在通用 `input { ... }` / `:where(input) { ... }` 规则。**唯一泛化 input 命中是字体继承；所以未被类型专项 selector 覆盖的原生 text/number/search 不会自动拿到 slot 字段暗底紫边皮肤，UA 默认和组件局部样式仍决定其背景/边框/appearance。反过来，裸规则若强行统一所有 input，会破坏 checkbox/radio、slider、color swatch、file button 和隐藏代理 input 的语义外观。

## 4. 合并建议与 specificity

- **补齐 1 个“可见原生文本字段”基线**：将 `input[type="text"]`（也可含明确允许的 `email/url/tel/password/number/search`）纳入字段皮肤，并显式排除 checkbox/radio/range/color/file/time、hidden 与组件 input-group control。保持与 slot field 同样的暗底/紫边/方角/内阴影，状态规则正交复用。
- **保留 4 个独立原生类别**：选择控件（checkbox/radio）、range（通用 + entity-dialog 特例）、file（只画按钮）、color（swatch）、time 可归入文本字段基线但保留 indicator 子部件。实践上是 1 个文本字段基线 + 4 种专属控件规则；隐藏代理输入不增加视觉类型。
- 不建议 `.vrcx-0-app-root input` 泛化。若新增原生文本选择器，使用 `:where(input:is(...))` 保持 specificity 为 0，或明确类型 selector 但注意类型选择器会增加 specificity；不要用裸 `input` 造成与 utility、组件局部规则的优先级反转。已有 slot selector 多由 `:where()` 压低权重。`[data-slot="input-group-control"]`/`[data-slot="combobox-chip-input"]` 有较强上下文规则，不能被新的通用文本框覆盖。
- 收敛 CSS 骨架：` :where(input:is([type="text"],[type="number"],[type="search"],...):not([data-slot="input-group-control"])) { color; background-color; border; border-radius; box-shadow; }`；随后用同权重的 `:focus-visible`、`:disabled`、`[aria-invalid]` 修饰。对 `input[type=checkbox|radio|range|file|color]` 保持独立 selector，不套 field 的 `appearance`/padding。

## 5. 可视化

[打开原生 input 当前样式与建议收敛对照](../preview/P1-G1-native-input.html)。页面将 text/number/search/file/color/range/time 按原生控件类别并排呈现；“当前”列以现有规则重建，未匹配类型的控件保持浏览器默认 appearance，“建议”列演示文本类字段统一皮肤并保留专属原生控件结构。由于浏览器平台与 UA 控件渲染不同，预览是结构/颜色示意，不声称等于运行时每个平台截图。
