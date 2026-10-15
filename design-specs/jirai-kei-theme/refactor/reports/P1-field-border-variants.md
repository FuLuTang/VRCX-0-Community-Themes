# P1 · 输入框外边框变体核对

## 结论摘要

四组声明与 refactor CSS 基本一致。一个需要准确区分的细节：B3 在原生 `<select>` 上使用 bevel；`select-trigger` / `combobox-trigger` 随后由 12-loader-and-forms.css:177–180 覆写为平边字段色值，侧栏菜单组仍使用 bevel。`select-content` / `combobox-content` 是浮层面板；检查到的真实实现和 fixture 都没有在其内部放搜索输入框。用户记忆最可能对应 B2 面板外框，但搜索输入本身并非 select/combobox 面板自带。

## 四种边框声明核对

| 编号 | 核对结果与出处 | 当前使用 |
|---|---|---|
| **B1 字段框（凹陷）** | 准确。`13-toolbar-overlays-and-pages.css:73–79`：`background-color:#201936; border:1px solid #6c5ce0; border-radius:0; box-shadow:var(--jk-field-inset)`。变量在同文件 `:8–9`，其中 inset 是 `inset 1px 1px #16112a,inset -1px -1px #a294c8`。 | 通用 `[data-slot="input"]`、textarea、time 及 input-group 外框；相应选择器见 :73–79。组内 control 本身透明无框，见 :22–25。| 
| **B2 浮层（凸起 + 硬投影）** | 准确。`11-controls-and-pages.css:220–228`：目标选择器覆盖 menu/menu-sub/popover/select/combobox content；声明 `border:1px solid #6c5ce0; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e`。 | 浮层内容面板。相同样式之外的 tooltip、hover-card、toast、sheet 需按各自实际规则判定，本变体主证据是上述统一 content 规则。 | 
| **B3 四边斜面 bevel** | 声明准确：`12-loader-and-forms.css:170–175` 为 `border-color:var(--jk-field-edge); background-color:#211a33; box-shadow:var(--jk-field-inset)`；`--jk-field-edge` 和 `--jk-field-inset` 定义在 `13-toolbar-overlays-and-pages.css:8–9`，边色依次 `#69557c #fdf4ff #fdf4ff #69557c`。 | 原生 `<select>` 命中 :170–175；侧栏菜单组 bevel 在 `07-motion-navigation.css:64–70`。重要修正：`:where([data-slot="select-trigger"],[data-slot="combobox-trigger"])` 在 `12-loader-and-forms.css:177–180` 将两个 trigger 的边色和底色改成 `#6c5ce0` / `#201936`，所以不能把 bevel 描述为最终 trigger 外观。 | 
| **B4 2px 硬投影** | 准确。`11-controls-and-pages.css:338–349` 的状态栏 tooltip 内容规则包含 `border:1px solid #6c5ce0`（:346）及 `box-shadow:inset 1px 1px 0 #69557c, 2px 2px 0 #100b1e`（:348）。 | 状态栏 `tooltip-content` 的限定内容样式（选择器起始于 :338）。是轻量投影款，不等同 B2 的双内阴影 + 3px 投影。 |

## select-content / combobox-content 中的搜索输入调查

### 调查结论

在当前 refactor 样式和可检索的项目源码/fixture 中，**没有找到** `[data-slot="select-content"]` 或 `[data-slot="combobox-content"]` 内的 `<input>`、`[data-slot="select-input"]`、`[data-slot="combobox-input"]` 搜索/过滤输入。现有两个 content 被当作选项面板处理；combobox 的搜索语义主要体现在 trigger / chips 型输入，不等于 content 内搜索框。

- `11-controls-and-pages.css:220–228` 给统一 content 容器设置背景、边框和阴影；:235–240 管 label，:242 起管选项，:268 管 separator。这里没有 content 内 input 的规则。
- `11-controls-and-pages.css:233–239` 是 content 的伪元素、label 样式；没有 `select-input` / `combobox-input` selector。
- 项目 popup fixture（`design-specs/jirai-kei-theme/runtime/checks/r9-popups/fixture.html:10–11`）中，select-content 和 combobox-content 直接包含 label、item、separator，没有搜索 input；:12 展示了**另一个 popover-content** 内的 `[data-slot="input"]`，说明带搜索输入的弹层可以是独立 popover，不应误认成 select/combobox content 的内部构造。
- refactor CSS 对 `[data-slot="select-input"]` / `[data-slot="combobox-input"]` 没有单独边框规则；同样没有发现这些输入槽位的存在证据。故不能声称“里面的搜索输入透明并依赖外框”——目前有证据支持的事实是：这两个面板本身不含搜索框。若某一业务运行时自行把输入框放进 content，现有 content 规则会给外层提供 B2 边框，但内层控件是否透明取决于实际 slot/规则；需针对具体实例确认。

### 对用户记忆的判断

B2 最可能：它是 select-content / combobox-content 的面板边框，明确具备两道高光/阴影与右下硬投影，视觉上显著不同于常规输入框 B1。用户可能记住的是“带搜索框的弹层”整体轮廓；但项目 fixture 显示带输入框示例是 `popover-content`，而普通 select/combobox 列表本身不带搜索输入。建议先让用户看 HTML 的 B2 大号面板后确认，避免直接把面板外框覆盖到所有字段上。

## 页面背景与演示说明

对照页背景取主题 `themes/jirai-kei-theme/theme.css:4–12` 的 `--background:#161219`（:8）。这与 refactor CSS 的控件面颜色是不同层级：B1 字段底色使用 `#201936`，B2 content 面板实际使用 `#211a33`；示例分别遵循其来源声明，没有统一伪造颜色。HTML 自包含且内嵌 CSS，包括 B1–B4 独立输入框样本、B2 大号带搜索框和列表项的面板示意，以及相同内容的四款并排比较区。
