# P2 — G1 表单族收敛表

> 收敛前提：可见输入框外边框统一为 B3 四边斜面：`border-width:2px; border-color:#69557c #fdf4ff #fdf4ff #69557c; background:#2a2147; box-shadow:inset 2px 2px #16112a, inset -2px -2px #a294c8; color:#f2ebff`。字段皮肤只作用于字段本体，不改 HTML 结构；input-group 内 control 保持透明、无自有框。滑条全软件统一通用款：18px 盒、6px 暗紫条纹轨、12px 粉 thumb；不保留 entity-dialog 的专属几何款。决策作为本表收敛输入，具体哪些页面/槽位使用须遵守下列例外。

| 簇名 | 包含哪些组件 | 判据（为什么能合并） | 必须保留的例外 | 建议选择器骨架 | 证据（文件:行号） |
|---|---|---|---|---|---|
| B3 可见文本字段 | `[data-slot="input"]`、`[data-slot="textarea"]`、`textarea`、明确可见的原生 text/number/search/email/url/tel/password、`input[type=time]` | 统一字段本体边框/底色/文字/内阴影；原生 input 报告确认无通用文本框规则，需明确纳入类型，不能裸 `input` 一网打尽。 | `:disabled`/`[aria-disabled]`、focus、invalid 状态正交保留；login recessed 皮肤若未获批准迁移，须留局部差异；隐藏代理 input、checkbox/radio/range/color/file、组内 control 排除。B3 指定底色 `#2a2147`，旧 login 底色/圆角等冲突待按决策核定。 | `:where(:is([data-slot="input"],[data-slot="textarea"],textarea,input:is([type="text"],[type="number"],[type="search"],[type="email"],[type="url"],[type="tel"],[type="password"],[type="time"]):not([data-slot="input-group-control"])))`；再分 `:focus-visible`、`:disabled`、`[aria-invalid]` | `P1-G1-input.md:46–59`; `P1-G1-native-input.md:28–35,68–75`; `P1-field-border-variants.md:11–14` |
| B3 组合字段外框 | `[data-slot="input-group"]`，含 toolbar/search/chips/stepper 组合容器 | 外框统一由父组持有；inventory 多指纹主要是历史色/上下文差异，当前无需按 route 复制框。 | `:focus-within` 留作组级提示；toolbar addon/control/button、chips 等子槽按职责单列；高 specificity 的 chart/Browse History 上下文规则须迁移/删除。 | `:where([data-slot="input-group"])` 与 `:where([data-slot="input-group"]:focus-within)` | `P1-G1-input-group.md:47–59`; `P1-G1-combobox-chips.md:33–56`; `P1-field-border-variants.md:11,13` |
| 透明组内编辑控件 | `[data-slot="input-group-control"]`、`[data-slot="combobox-chip-input"]` | 多个上下文指纹的实质共性是透明、无自身表面；父组唯一画框，故可共用 reset。 | placeholder、caret、文字色保留；不要把 B3 框搬进 control；chip input 与普通 control 可共享基础透明职责，但各自布局仍由组件负责。 | `:where([data-slot="input-group-control"],[data-slot="combobox-chip-input"])` 及 `::placeholder` | `P1-G1-input-group-control.md:20–26,41–52`; `P1-G1-combobox-chips.md:20–27,35` |
| 组内 addon | `[data-slot="input-group-addon"]`（文本/图标/单位） | 本体透明、无边框/阴影，方向不形成盒型变体；色差是语义层级而非容器差异。 | addon 内可交互 dropdown/button 是独立按钮，不并入文字 addon；保留强调/提示色层级。 | `:where([data-slot="input-group-addon"])`，以语义 modifier 指定 color；子 button 独立 | `P1-G1-input-group-addon.md:20–26,32–54` |
| 组内按钮 | `[data-slot="input-group-button"]` 及组内 `[data-slot="button"]` | 普通 toolbar 与 Chart 当前都覆盖成粉底方角 bevel，可共享组内基础皮肤，减少两套相同静态规则。 | 按钮键盘焦点与组 focus 环不得叠成双环；保留 destructive、submit/default、toggle selected 等语义态；不设可见边线以免与 B3 外框双框。 | `:where([data-slot="input-group"] [data-slot="input-group-button"], [data-slot="input-group"] [data-slot="button"])`；variant/state 分层 | `P1-G1-input-group-button.md:21–29,34–46`; `P1-G1-input-group.md:25–39` |
| Select/combobox trigger | `select`、`[data-slot="select-trigger"]`、`[data-slot="combobox-trigger"]` | trigger 三组记录同一 fingerprint；按统一可见字段表面归入 B3，不再另设平边色值。 | trigger focus ring 独立保留；原生 select 与 button-backed trigger 差异限于语义/图标，不应让非焦点状态被紫边覆盖。 | `:where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])`；focus-visible 单独状态 | `P1-G1-select-trigger.md:5–13,21–33,39–50`; `P1-field-border-variants.md:5,13` |
| Chip 标签与删除按钮 | `[data-slot="combobox-chip]`、`[data-slot="combobox-chip-remove"]`、chips 容器 | 容器/input 透明嵌入唯一组框；chip 标签与 remove 是重复可复用的同槽角色。 | chip 标签表面、remove 的独立可交互焦点/尺寸、头像裁切及 hover/disabled 待补；overlay fingerprint 是否需自带框待确认。 | `:where([data-slot="combobox-chips"])`、`:where([data-slot="combobox-chip"])`、`:where([data-slot="combobox-chip-remove"])` | `P1-G1-combobox-chips.md:5–12,20–29,37–56` |
| Checkbox / radio | checkbox slot/native checkbox；radio role/native radio | 同一类型内部字体等差异不改变控件本体；可分别统一未选中/选中状态样式。 | checkbox 与 radio 的选中符号不同；保留 checked、focus-visible；Favorites tile 16px 与 focus offset 局部覆盖；无证据建立 disabled/danger 变体。 | `:where(:is([data-slot="checkbox"],input[type="checkbox"]))`、`:where(:is([role="radio"],input[type="radio"]))` | `P1-G1-checkbox.md:9–14,22–52` |
| Slider / range | `[data-slot="slider-track/range/thumb"]`、`input[type="range"]` 伪元素 | 两种适配器共享一套通用像素滑条尺寸与颜色，保留不同 DOM/伪元素挂载点。 | track 与动态 fill 分开；focus-visible 保留；entity-dialog 原 16/8/16 特例按已定决策取消，若命中区域有可用性回归须另行验证。 | `:where([data-slot="slider-track/range/thumb"])` 和 `:where(input[type="range"])`、各浏览器伪元素 | `P1-G1-slider.md:20–34,40–57`; `P1-G1-native-input.md:42–43` |
| Label / description / error | `[data-slot="label"]`、`field-label`、`field-description`、`field-error` | 普通 label 与 field-label 共色共基线；description 是另一文本角色，错误是独立状态角色。 | error 颜色与 login error 覆盖保留；不添加未经证实的字号/间距；保持语义槽而非裸 `label`。 | `:where([data-slot="label"],[data-slot="field-label"])`；description/error 各自槽选择器 | `P1-G1-label.md:21–38`; `P1-G1-field-label-description.md:33–62`; `P1-G1-field.md:28–48` |
| Number stepper | `[data-slot="number-field-group/input/decrement/increment"]` | stepper 是独立复合控件，内部输入与按钮可复用各自槽规则；不是原生 number 字段的第二种 B3 边框。 | N1 切角外框、20px 加减按钮、8×8 glyph、hover/active/focus 状态需保留；不能并到 slider。纳入本次 G1 统一输出的位置待确认。 | `:where([data-slot^="number-field-"])` 后按 group/input/button 子槽分层 | `P1-number-steppers.md:11–25,34–43`; `P1-G1-native-input.md:41–47` |
| Kbd keycap | `[data-slot="kbd"]`、`[data-slot="kbd-group"]` | 行内 keycap 共一款，group 只是布局，不需复制按键皮肤。 | titlebar 浅色紧凑 keycap 保留 scoped override；gap 保留。 | `:where([data-slot="kbd"])` 与 `:where([data-slot="kbd-group"])`；titlebar modifier | `P1-G1-kbd.md:13–16,25–28,36–55` |
| Field 布局容器 | `[data-slot="field"]`、field-group/set | 不与边框皮肤合并：现有调查未发现容器布局规则或布局计算数据，不能凭空定 display/gap。 | 横排、group/set 是否存在及布局值均待确认；field-error 语义独立。 | 暂不新增布局声明；`[data-slot="field"]` 仅作待测锚点 | `P1-G1-field.md:5,11–13,22–48` |
| 原生专属控件槽 | `input[type=color]` swatch、`input[type=file]::file-selector-button`、`input[type=time]` indicator | 各自 browser subpart 语义明确，不能当普通字段本体一概而论。 | color swatch、file picker/name 区、time 图标保留专属处理；time 本体按 B3 字段决策。 | `:where(input[type="color"])` 子部件、`input[type="file"]::file-selector-button`、time indicator | `P1-G1-native-input.md:39–47,62–68`; `P1-G1-input.md:37–42` |

## 1. 现状中的重复

以下是普查报告记录到的同一视觉多处定义；重复项应迁移到簇级共同规则，而不是继续叠加。行号均为样式源文件物理行号。

- **组框/普通字段旧 B1（暗底、1px 紫边、方角、inset）**：`13-toolbar-overlays-and-pages.css:71–79` 同时覆盖字段和 input-group；组焦点又在 `13-toolbar-overlays-and-pages.css:18–20,47`、`11-controls-and-pages.css:372–376`、`13-toolbar-overlays-and-pages.css:82` 多处定义相同粉环。按 B3 决策，外框统一替换，不保留旧 B1。
- **组内 control 透明 reset + placeholder**：`13-toolbar-overlays-and-pages.css:22–25`、`11-controls-and-pages.css:380–391`、`13-toolbar-overlays-and-pages.css:559–560` 重复透明/无阴影/无 outline、粉 caret、浅 placeholder；应收敛到透明 control 簇并删改长上下文副本。`P1-G1-input-group-control.md:20–25`。
- **组内粉色按钮静态皮肤与焦点**：普通 toolbar `13-toolbar-overlays-and-pages.css:26–29` 与 Chart `11-controls-and-pages.css:392–401` 重复方角、粉底、bevel 和粉色 focus-visible；相应组 focus 在 `13-toolbar-overlays-and-pages.css:18–20,47` 与 Chart `11-controls-and-pages.css:372–376` 重复，导致同一控件焦点时组/按钮双环。`P1-G1-input-group-button.md:21–29,37`。
- **Select/combobox trigger 共用基底却被额外覆盖**：`12-loader-and-forms.css:170–175` 给 select/trigger 定义 B3，`12-loader-and-forms.css:177–180` 又把 trigger 覆写为平边紫框；统一 B3 后该覆盖应消失。`P1-field-border-variants.md:11–14`; `P1-G1-select-trigger.md:21–33`。
- **时间图标重复**：runtime `theme.css:719–721` 与 `13-toolbar-overlays-and-pages.css:3631` 都设 time calendar indicator 为同一 clock asset/16px/opacity。`P1-G1-input.md:22,39`; `P1-G1-native-input.md:55–66`。
- **Checkbox focus 重复**：通用控件组 `12-loader-and-forms.css:3301–3309` 与 Favorites tile `12-loader-and-forms.css:4000–4003` 都设粉色 2px focus，后者仅 offset 1px 是局部例外。`P1-G1-checkbox.md:27–32`。
- **重复的 field-label/label 色**已在同一规则中共享；不要再新增第二份：`13-toolbar-overlays-and-pages.css:48`。`field-error` 的 login 覆盖是语义例外，不是待消除的重复：`13-toolbar-overlays-and-pages.css:50`; `10-login-and-dialogs.css:226–228`。`P1-G1-field-label-description.md:37–40,54–62`。
- **Number stepper 源与构建产物重复**不是两套方案：`06-panels-and-settings.css:129–138` 与 preview `theme.css:1267–1276` 是同一组源/产物，不应双计。`P1-number-steppers.md:11,39`。

## 2. 冲突与待修

- **确定冲突：trigger 平边覆盖 B3**：`12-loader-and-forms.css:177–180` 将 select/combobox trigger 的边色/底色改成平边，与 B3 决策冲突；应删除或限定到经确认的真实状态，默认态回到四边斜面。依据：`P1-field-border-variants.md:5,13`; `P1-G1-select-trigger.md:22–33`。
- **确定的双粉环风险：input-group 内按钮聚焦**：组 `:focus-within` 粉环与按钮自身 `:focus-visible` 粉环并存（`13-toolbar-overlays-and-pages.css:18–20,29,47`; Chart `11-controls-and-pages.css:372–376,398–401`），需明确只由组或按钮承载焦点，且不能损失键盘可见性。依据：`P1-G1-input-group-button.md:25–28,37`。
- **Chart 超长上下文覆盖**：`11-controls-and-pages.css:392–401` 以 `#chart`、`:has()` 等长 selector 覆盖组内按钮，`11-controls-and-pages.css:372–391` 另有组焦点/control 覆盖；specificity 会压过简短低权重的收敛规则，须同步迁移/删除，不可只追加 `:where()`。依据：`P1-G1-input-group-button.md:23–24,38,46`; `P1-G1-input-group-control.md:22,52`; `P1-G1-input-group.md:59`。
- **待确认：login recessed 与统一 B3 的边界**：login 有独立背景、圆角、阴影及 placeholder/focus/invalid 规则（`10-login-and-dialogs.css:2241–2264`）；决策说字段外边框统一 B3，是否连 login 本体底色/圆角/阴影一起覆盖，需明确。依据：`P1-G1-input.md:24–29,48–50,55–59`。
- **待确认：field 容器布局**：没有 field 容器布局规则或 display/gap 采样，不应补写猜测值。依据：`P1-G1-field.md:5,11–13,24,35–48`。
- **滑条旧 dialog 分支需按决策收敛**：现有 `.entity-dialog` 为 16/8/16px，通用为 18/6/12px（`10-login-and-dialogs.css:1993–2019`; `12-loader-and-forms.css:3258–3298`）；统一采用通用款后应移除几何差异但验证 hit area/focus，不得误删动态 fill。依据：`P1-G1-slider.md:20–32,40,47–57`。
- **Addon/chips overlay 样式边界**：chips overlay inventory 有框/底，现有主题 chips 透明，仅有证据的 toolbar context；overlay 是否也应服从唯一 B3 父组框待确认，不能臆断。依据：`P1-G1-combobox-chips.md:9–12,33–56`。

## 3. 零覆盖清单

这里的“零覆盖”指对应本体/槽位没有专属主题皮肤声明，不等于一定显示浏览器默认（可能仍受 app/Tailwind/组件样式影响）。

- **field 容器布局本体** `[data-slot="field"]` / field-group / field-set：无命中规则，布局属性也未采集；布局值待确认。`P1-G1-field.md:5,22–39`。
- **普通原生文本类 input**：裸 `input[type=text/number/search]` 未纳入已有 slot 字段规则；报告明确无通用 `input` 皮肤，number-field slot 是另一组件。按 B3 决策补入明确类型而非裸 input。`P1-G1-native-input.md:31,35,62–75`; `P1-number-steppers.md:29–37`。
- **role checkbox**：报告未发现 `[role="checkbox"]` 规则；现有 checkbox slot/native checkbox 有覆盖。若运行时确有 role checkbox，主题本体为零覆盖，需核实。`P1-G1-checkbox.md:18,34`。
- **普通 `combobox-chip` 交互状态**：chip 有静态皮肤，但没有专属 hover/disabled；remove hover/删除中状态也未覆盖。`P1-G1-combobox-chips.md:23–27,37`。
- **field-error inventory**：样式有错误文字规则，但 inventory 没有 field-error/component 记录；不是“CSS 零覆盖”，而是采样覆盖缺失。`P1-G1-field-label-description.md:54`。
- **Native input 类型映射**：采样没有逐条 `type`，因此不能确认每个隐藏/代理 input 属于何种控件；不得全体恢复 B3 可见框。`P1-G1-native-input.md:5,28–31,47`。

## 4. 收敛后的规模估计

**粗估从约 50 个局部规则块收敛到约 25 个规则块（减少约一半，误差约 ±5）**。这是按 selector/declaration block 而非单条 CSS 声明估算：当前 P1 已记录可合并的分散组框/焦点、透明 control/placeholder、组内按钮及 checkbox focus、trigger 覆盖等多个重复块；收敛后保留字段基线及状态、组框及 focus、control/placeholder、addon、按钮状态、trigger、chip 子槽、checkbox/radio、slider adapters、labels/errors、原生专属控件与 number/kbd 语义例外。数字不是对全仓 CSS AST 的精确计数；需在实施前以命中选择器清单复核。依据：`P1-G1-input.md:19–42`; `P1-G1-input-group.md:22–39,57–59`; `P1-G1-input-group-control.md:16–26,41–52`; `P1-G1-input-group-button.md:21–29,37–46`; `P1-G1-select-trigger.md:21–27,48–50`; `P1-G1-checkbox.md:22–32,40–52`; `P1-G1-slider.md:20–32,53–57`; `P1-G1-combobox-chips.md:20–29,52–56`。

> 相关文件检查记录：reports 下所有文件名含 G1 的 14 份 P1 报告均已读取；`P1-field-border-variants.md`、`P1-number-steppers.md` 已读取；请求中注明“若有”的 `P1-field-skin-ab.md` 在目录中不存在。