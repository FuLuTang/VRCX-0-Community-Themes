# P1-FREEZE 汇总

范围：仅汇总同目录下 11 份 `P1-FREEZE-*.md` 报告；行号均指报告标注的原 `theme.css` 行号。A=冻结资源/纯变量或动画定义；B=进入样式层的样式规则；C=样式内联 data URI、需抽取后进入样式层。各报告对规则计数口径不完全一致，具体见「待核实」。

## 分类汇总

| Section | A 冻结条数 | B 样式层条数 | C 需抽取条数 | C 项建议变量名 |
|---|---:|---:|---:|---|
| `banner-frame-r96` | 1 | 4 | 0 | — |
| `brand-heart-r97` | 2 | 4* | 0 | — |
| `cards-r97` | 1 | 14 | 0 | — |
| `chrome-r8` | 1 | 18 | 0 | — |
| `keyframe-sections`（motion、motion-r7、motion-r8、badge-r9、cat-motion-r96） | 12 | 31* | 0 | — |
| `loader-r9` | 3 | 5 | 0 | — |
| `nav-phone-r10` | 3 | 4 | 0 | — |
| `pixel-controls` | 1 | 27* | 9 | `--jk-asset-switch-knob-off-x`; `--jk-asset-switch-knob-on-heart`; `--jk-asset-switch-thumb-off`; `--jk-asset-switch-thumb-on-heart`; `--jk-asset-scrollbar-thumb-vertical`; `--jk-asset-scrollbar-thumb-horizontal`; `--jk-asset-scroll-area-thumb-vertical`; `--jk-asset-scroll-area-thumb-horizontal`; `--jk-asset-progress-pink-cells` |
| `settings` | 1 | 32 | 2 | `--jk-asset-number-stepper-minus`; `--jk-asset-number-stepper-plus` |
| `status-icons-r10` | 4 | 16 | 0 | — |
| `user-dialog-r9` | 1 | 8 | 1 | `--jk-asset-user-dialog-banner-hem-lace` |
| **合计** | **30** | **163** | **12** | — |

\* 报告本身未统一计数口径：`brand-heart-r97` 的 4 条 B 包含一个无声明的媒体查询容器；`keyframe-sections` 的 31 条 B 按五段报告所列非 keyframes 顶层规则合计（含 reduced-motion 容器）；`pixel-controls` 标题写 B 24，但明细表有 27 条，报告结论称 B 27，汇总采用明细/结论的 27。

## 冻结层清单

### 资源段

报告明确作为资源/变量层冻结或作为周边资源段引用的段名：`fonts`、`icons`、`assets`、`assets-r5`、`assets-r7`、`native-icons`。这些名称在本组报告中未逐一提供位置、内容或独立审计计数；此处仅列为资源段名，不推断其他未提及段名。

### 各报告标为 A 的纯变量块及位置

- `pixel-controls`：第 1327 行 `:root`（`--pc-up`、`--pc-dn`、`--pc-lt`、`--pc-rt`）。
- `settings`：第 1255 行 `:root`（`--jk-px-cut`）。
- `chrome-r8`：第 1635 行 `:root`（含 `--r8-lace-tile` 等变量；报告建议语义名 `--jk-asset-statusbar-lace-tile`，定义位置第 1645 行，消费位置第 1750 行）。
- `loader-r9`：第 3145–3151 行 `:root`（含 `--jk-loader-sheet` 等）。
- `status-icons-r10`：第 4963–4966、4967–4970、5019–5022、5052–5055 行四个 `:root` 变量块。
- `nav-phone-r10`：第 5078 行 `:root`。
- `cards-r97`：第 4889 行 `:root`。
- `brand-heart-r97`：第 4806 行 `.vrcx-0-titlebar[data-app-titlebar]`（三个心形资源变量）。
- `banner-frame-r96`：第 4734 行 banner 选择器（变量定义块）。
- `user-dialog-r9`：第 2312 行 `.entity-dialog`（五个 banner 自定义属性）。
- `keyframe-sections`：冻结其中 `@keyframes` 定义，但不冻结五个 section 整段；名称和边界见「与原计划的差异」。

另有由报告明确归 A 冻结的独立纯 `@keyframes`：`loader-r9` 第 3153–3156 行 `jk-loader-dance`；`nav-phone-r10` 第 5144 行 `r10-nav-phone-loop`、第 5203 行 `r10-nav-phone-float`；`brand-heart-r97` 第 4807–4811 行 `r97-brand-heart-pixels`。keyframe-sections 中 12 个动画定义见下节。

## 需抽取的 data URI（C 类）

| Section | 源行号 | 建议变量名 |
|---|---:|---|
| `settings` | 1275 | `--jk-asset-number-stepper-minus` |
| `settings` | 1276 | `--jk-asset-number-stepper-plus` |
| `pixel-controls` | 1331 | `--jk-asset-switch-knob-off-x` |
| `pixel-controls` | 1332 | `--jk-asset-switch-knob-on-heart` |
| `pixel-controls` | 1335 | `--jk-asset-switch-thumb-off` |
| `pixel-controls` | 1336 | `--jk-asset-switch-thumb-on-heart` |
| `pixel-controls` | 1346 | `--jk-asset-scrollbar-thumb-vertical` |
| `pixel-controls` | 1347 | `--jk-asset-scrollbar-thumb-horizontal` |
| `pixel-controls` | 1359 | `--jk-asset-scroll-area-thumb-vertical` |
| `pixel-controls` | 1360 | `--jk-asset-scroll-area-thumb-horizontal` |
| `pixel-controls` | 1364 | `--jk-asset-progress-pink-cells` |
| `user-dialog-r9` | 2343（规则起始行 2333） | `--jk-asset-user-dialog-banner-hem-lace` |

C 类共 **12 条**。其余报告明确说明 data URI 位于 A 类变量定义中，或样式仅通过变量引用，因此不计入 C。

## 与原计划的差异

原计划假设「纯动画 section 可整段冻结」。`keyframe-sections` 报告检查的五个动画段（`motion`、`motion-r7`、`motion-r8`、`badge-r9`、`cat-motion-r96`）都混有 reduced-motion / reduce-effects 覆盖、普通元素/伪元素样式或非动画声明，**不能整段冻结**。只能将其中的 `@keyframes` 规则抽出并放入冻结动画定义层，其余元素样式以及相关覆盖规则留在可变样式层。报告列出 12 个 keyframes：`r5-charm-swing`、`r5-dialog-step-in`、`r5-spinner-step`、`r5-progress-flow`、`r7-tab-edge`、`r8-lace-flow`、`r8-nav-cursor`、`r8-window-press`、`r8-cat-hop`、`r9-notification-badge-flash`、`r96-nav-cat`、`r96-social-cat`。

## 待核实

- `pixel-controls` 报告标题称 B 为 24 条，但明细表有 27 行，结论也称 B 27、总规则 37；本汇总采用明细与结论数字，未自行修订报告。
- `chrome-r8` 将第 1635 行 `:root` 记为 A，并建议将已在该变量块中的 lace URI 改名为 `--jk-asset-statusbar-lace-tile`；这属于现有变量语义迁移，不是元素样式直接内联 URI，因此未计入 C。该报告还称其余 18 条为 B，与表中条目数相符。
- `brand-heart-r97` 报告未给 A/B 总数；汇总按明细逐行计数，并将无声明的 reduced-motion 媒体容器算作 B，因此 B=4。如需只统计含声明的样式规则，需另定统一口径。
- `keyframe-sections` 报告列出五段非 keyframes 顶层规则，但未提供统一的 A/B 总数；本表以每个列项计一条，含媒体查询容器，得 A=12、B=31。是否将纯容器计入条数需确认。
- 报告开头列明的资源段名称（`fonts`、`icons`、`assets`、`assets-r5`、`assets-r7`、`native-icons`）在这 11 份审计中没有对应段落的完整行号/内容清单；无法从报告确认其精确位置及是否穷尽全部冻结资源段。
