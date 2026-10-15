# P1-G1 Label 组件普查

## 1. Inventory：label 全部记录

筛选条件为 `family=G1, component=label, tag=label`，共 **2 条 primaryContext 记录、4 次观察、1 个指纹**。两条记录的 `styleVariants[]` 完全相同，均为 `2a2de1c73b12976f`，各 2 次观察；组件级 routes 分别为 `/browse-history`、`/charts/timeline`（inventory 没有逐指纹 routes 字段）。

| primaryContext | 观察数 | 指纹数 | styleVariants（fingerprint / observations） | 有差异的 computedStyle |
|---|---:|---:|---|---|
| `overlay:popover-content` | 2 | 1 | `2a2de1c73b12976f` / 2 | 无；见统一样式值 |
| `surface:main-content` | 2 | 1 | `2a2de1c73b12976f` / 2 | 无；见统一样式值 |
| **合计** | **4** | **1** | 同一指纹 | **无 context 差异** |

唯一指纹中采集到的 computedStyle：`color: rgb(227, 210, 245)`、`background-color: rgba(0, 0, 0, 0)`、`font-size: 14px`、`font-weight: 500`、`font-family: "WD Pixel CJK", "Geist Variable", Geist, "Noto Sans SC", system-ui, sans-serif`；四边 border width 均 `0px`，border style 均 `solid`，border color 均 `rgb(108, 92, 224)`；`box-shadow:none`、`opacity:1`、`filter:none`、`transform:none`、`clip-path:none`、`text-decoration-line:none`、`text-decoration-color:rgb(227, 210, 245)`。`margin`、`display`、`line-height` 等**未采集**，不能由指纹推出。outline 数据为 `2.4px none oklab(0.765878 0.172198 -0.0498766 / 0.5)`；inventory 未包含 border-radius。

## 2. 样式层命中规则

在 `refactor/src/style/*.css` 对 `[data-slot="label"]`、`[data-slot="field-label"]`、裸 `label` 和带祖先的 label 选择器做检索，命中以下元素标签规则：

| 文件 / SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 48 | `:where([data-slot="field-label"]),:where([data-slot="label"])` | `color:#e3d2f5` |
| 同上 / `fields-toolbar-r10` / 49 | `:where([data-slot="field-description"])`（关联对照，非 label） | `color:#b9add9` |

另外，文件 `11-controls-and-pages.css` 有 `[data-slot$="menu-label"]`、`[data-slot="select-label"]`、`[data-slot="combobox-label"]`、`[data-slot="menubar-label"]` 等**菜单/选择器内部的命名槽**规则；它们不是 HTML `label` 元素，也不是本 inventory 的 G1 label 组件，故不混入上表。其它检索结果仅注释文字。

### 裸 `label` 选择器风险（特别确认）

样式层没有发现裸 `label` 选择器，也没有 `.x label` 这类按 HTML 标签广泛命中的规则。当前标签文本色限定在明确的 `[data-slot="label"]` / `[data-slot="field-label"]` 槽，且包在 `:where()` 中，specificity 为 **(0,0,0)**。若未来改成裸 `label`，specificity 是 **(0,0,1)**，会覆盖 app 内任意 HTML label（包括第三方/原生表单、弹窗或其他不属于该组件的 label），并可能干扰局部颜色、禁用态继承和组件自身样式；应继续使用语义槽，不要加裸标签全局规则。

## 3. 合并判断与职责边界

- **可合并**：inventory 两个 context 的 label 指纹完全一致，可以共用一个语义基线；现有 `field-label` 与 `label` 同色规则也已并列共享声明，无需按 main-content/popover 分叉。
- **必须保留为不同职责**：`field-label` 是字段控件的标题/可访问名称，inventory 单独记录为 `family=G1, component=field-label`，设置页 17 次观察，颜色 `rgb(227, 210, 245)`、14px、500；普通 `label` 这 4 次观测同值同指纹，但其组件身份/使用上下文独立。可共享 token/基线，不应抹掉语义槽与 label-control 关联。
- **不要并入 label**：`field-description` 是辅助说明，不是标题；inventory 11 次观察，颜色 `rgb(185, 173, 217)`，14px、400。必填星号、禁用态提示、表单分组标题等若由伪元素/状态选择器或父级结构表达，应作为各自语义/状态规则保留；本次 label inventory 未观测到这些变体，不能把它们虚构为 label 的现存指纹。

## 4. 收敛结论

建议 label 本体收敛为 **1 种视觉基线**（14px / 500 / `#e3d2f5`，实际 inventory 字体栈如上），两个 primaryContext 无需区分；同时保留 `field-label` 与普通 `label` 的两个语义槽入口，`field-description` 另列辅助说明层。CSS 骨架继续采用 `:where([data-slot="label"]), :where([data-slot="field-label"]) { color: … }`，仅共享同一基线，间距/显示方式待 DOM 或采样补证再定。若为了合并而改用裸 `label`，会从当前零 specificity 提升到 (0,0,1)，并扩大为全 app 命中，故不建议；新增/覆盖规则应留在 `:where()` 或用语义槽限定。
