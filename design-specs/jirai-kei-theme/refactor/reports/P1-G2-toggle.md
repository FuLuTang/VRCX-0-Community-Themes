# P1-G2-toggle：视觉变体普查

## 范围与 inventory

仅检查 `family=G2, component=toggle`；toggle-group 是其容器/分段语义，本报告不把 toggle-group 记作 toggle 组件观察。

| primaryContext | 观察数 | 指纹数 | 记录 / variant / size | 指纹与观察数 |
|---|---:|---:|---|---|
| `surface:main-content` | 9 | 2 | `button` / `outline` / `sm`；stateCount=3；routes `/community-themes`, `/themes`, `/tools/inventory` | `0661a3be495388fe` (6), `415d4ab8d0e27e88` (3) |

证据：[inventory](../../baseline/reports/component-variant-inventory.json#L8087-L8177)，尤其 L8090-L8103、L8105-L8135、L8137-L8168。两指纹的**实际差异**（未列的 fingerprint 属性相同）：

| fingerprint | color | background-color | 边框 | box-shadow | 尺寸 |
|---|---|---|---|---|---|
| `0661a3be495388fe` (6) | `rgb(185,173,217)` `#b9add9` | `rgb(32,25,54)` `#201936` | 四边均 0px / none（颜色字段虽有值但无可见边框） | `inset 1px 1px rgba(0,0,0,.5), inset -1px -1px rgb(143,127,224)` | 未采集 |
| `415d4ab8d0e27e88` (3) | `rgb(22,17,42)` `#16112a` | `rgb(255,184,230)` `#ffb8e6` | 四边均 0px / none | `inset 2px 2px #fdf4ff, inset -2px -2px #7a3f6d, inset 0 0 0 1px #16112a` | 未采集 |

fingerprint count=2 的差异来自常态/选中态风格（inventory 未标明每条记录对应的交互状态，仅列 fingerprint 与计算样式；根据选中粉底/pressed 规则可对应选中态）。采集属性中没有宽高/尺寸，不能从 `size=sm` 推断实际像素尺寸。

## 样式层命中规则

下面列的是直接触及 toggle 或 toggle-group 子 toggle 的样式规则；纯粹以 `[aria-pressed]` 选择按钮但非 toggle 组件的条目不混称 toggle。`:hover`、pressed 等规则也涵盖 TooltipTrigger 替代 data-slot 的情况。

| 文件 / SECTION / 行 | 选择器 / 实际声明 |
|---|---|
| `06-panels-and-settings.css` / `feed-badges` / 140-155（(6)④ Segmented groups 注释） | `[data-slot=toggle-group][data-variant=outline]`：`border:1px solid #16112a; border-radius:0; background-color:#201936; gap:0; clip-path:var(--jk-px-cut)`。子 toggle/tooltip-trigger（L149）：`border:0; border-radius:0; background-color:#201936; color:#b9add9; box-shadow:inset 1px 1px rgb(0 0 0/.5), inset -1px -1px #8f7fe0`。hover L151：底色 `#4a3784`、字色 `#f2ebff`、阴影亮暗反向。`[data-pressed]` L152：`#ffb8e6` / `#16112a`，凸起阴影 `inset 2px 2px #fdf4ff, inset -2px -2px #7a3f6d` 加 `inset 0 0 0 1px #16112a`。focus L153：粉色 outline。分隔符 L154-155：宽2px、深色。 |
| `11-controls-and-pages.css` / `controls-r9` / 50-85 | toolbar outline group L50-57：gap/padding=0、紫边1px、方角、`#201936` 背景与凸起外框。子项 L58-65：紫边、方角、`#201936`、`#e3d2f5`、无阴影；hover L66-69：`#3b2c55` / `#f2ebff`；pressed L70-78：`#6c5ce0` 边、`#ffb8e6` 底、`#16112a` 字、标准凸起 inset 阴影（声明带 `!important`），并隐藏 `::before`；focus L82-85 粉色 outline。 |
| `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 52-65 | toolbar default group L54-56：`display:flex; gap:2px; padding:0`；子项 L57-60：`min-height:28px; border:1px solid #6c5ce0; border-radius:0; background:#211a33; color:#d6c8ee; box-shadow:inset 1px 1px rgb(253 244 255/.12), inset -1px -1px #16112a`；hover L61：`#392a52` / `#f2ebff`；pressed L62：`#ffb8e6` / `#16112a` 与凸起 inset；focus L63；pressed ::before L64 隐藏；disabled L65 opacity `.55`。 |
| `16-final-navigation.css` / `entity-button-roles-b054-b072` / 201-227 | 只对 `button[data-ui-role="action"]` 及特定 overlay 内 `button[data-variant]` 生效，不是通用 toggle 规则。若 toggle 恰好满足该角色：variant paint L207-210，pressed/open L221 使用 `--jk-portal-open-*` 与 `--jk-button-pressed`，disabled L226 opacity `.58` + filter grayscale + inset。不得扩读为所有 toggle 的基准规则。 |

其它扫描到的匹配：`14-buttons-and-data.css` L359-405 的 `[aria-pressed]` 是 history/list 卡片选择器，不是 toggle；`08-chrome-r7.css` L82-96 是 titlebar button 状态，限定标题栏，不作用于本次主内容 toggle。全样式层检索到 `data-state="on"` 没有 toggle 命中规则；状态写法实际使用 `[data-pressed]` / `[aria-pressed="true"]`。证据：[08-chrome-r7.css](../src/style/08-chrome-r7.css#L82-L96)、[14-buttons-and-data.css](../src/style/14-buttons-and-data.css#L359-L405)。

## 核心：四态与胜出关系

| 状态 | 背景 / 边框 / 文字 | 阴影 | 证据与说明 |
|---|---|---|---|
| 未按下 | toolbar default：`#211a33` / `#6c5ce0` / `#d6c8ee`；outline segmented：`#201936` / `#6c5ce0`（单项边框）； | default 为轻微亮暗 inset；outline 子项无阴影，组框自身凸起 | 13:57-60；11:50-65 |
| hover | default：`#392a52` / 边框仍紫 / `#f2ebff`；outline：`#3b2c55` / 紫边 / `#f2ebff` | hover 不设阴影（outline 子项继承 none）； | 13:61；11:66-69 |
| 按下/选中 | 两类 toolbar：粉 `#ffb8e6` / 紫边 / 深墨 `#16112a` | **凸起**：亮左上、暗右下的 `inset 2px 2px #fdf4ff, inset -2px -2px #7a3f6d`，不是凹陷反转。outline 通用 segmented 还叠加 1px 墨色内框 | 13:62；11:70-78；06:152。与 toggle-group 的分工：它是多项组合框/子项外壳并管理相邻分段、间距与边界；toggle 表示各个可切换项的 pressed 视觉态。 |
| 禁用 | 明确样式只在 toolbar default toggle：基础色值保留，整项 opacity `.55`；边框/文字/阴影没有额外 disabled 覆盖。outline 组没有专属 disabled 声明可证；若框架原生 disabled 改色，inventory 未覆盖，故不臆测 | default pressed 样式若属性仍在，规则没有 disabled 排除，但 disabled opacity 降低 | 13:65；outline 相关规则 11:50-85 未声明 disabled。 |

**Hover 与 pressed 可区分**：是。hover 是紫色面 (`#392a52` 或 `#3b2c55`) + 浅字；pressed 是粉面 + 深字 + 2px 凸起 bevel。它不是按下时凹陷；有些按钮全局 `:active` 规则会用 `--jk-button-pressed` 做按压反馈，但不应误套在 toggle-group pressed 规则上（该组的状态属性样式明确为凸起）。

**变量**：基础按钮变量在 `02-foundation.css` L10-15：`--jk-button-edge:#6c5ce0`、`--jk-button-face:#211a33`、`--jk-button-text:#f2ebff`、`--jk-button-hover-face:#392a52`、`--jk-button-hover-text:#fff0fa`、`--jk-button-default-face:#ffb8e6`、`--jk-button-default-text:#16112a`、`--jk-button-bevel:inset 1px 1px rgb(253 244 255/.72), inset -1px -1px rgb(22 17 42/.72)`、`--jk-button-pressed:inset 2px 2px #16112a,inset -1px -1px #fdf4ff`。但 toggle 专用规则 06/11/13 将多数值**直接写成字面量**，未用这些变量，也未定义 `--jk-toggle-*`；而全局按钮按下变量是凹感/反馈式的另一组色值，并不等于 toggle 的选中凸起。证据：[02-foundation.css](../src/style/02-foundation.css#L10-L15)、[16-final-navigation.css](../src/style/16-final-navigation.css#L221-L226)。

**同一 toggle 多套覆盖：有，按容器 variant 分流，另有 toolbar outline 的级联覆盖。** 06 是通用 outline segmented；11 用更具体的 `.vrcx-0-main-content .vrcx-0-page-toolbar ...` 限定 toolbar outline；13 为 toolbar default（不同 variant）。因此 toolbar outline 在组内命中 06 与 11 时，11 的选择器 specificity 更高，且 pressed 的关键底色/文字/阴影有 `!important`，11 赢；06 的通用 outline 仅留给非该 toolbar scope。toolbar default 由13规则控制。07（未发现命中）、没有独立 toolbar standalone toggle 的规则。inventory 正好只记录 `outline sm` 主内容，9 个观察、2 指纹，不足以证实 default variant 对应的采样记录。

## 合并判断与收敛建议

- **可合并**：toolbar default 与 outline 的相同 pressed 语义（粉底、墨字、凸起 bevel、focus）；hover 色也可令两个 variant 共用 token。用 CSS custom properties 表达状态，避免 06/11/13 字面量漂移。
- **必须保留**：带图标 toggle 的紧凑尺寸/图标对齐（尺寸 inventory 未采集，不能将其与文字 toggle 强行定尺寸）；toggle-group 内分段的外框、相邻边/分隔符和 `gap=0` vs default chips `gap=2`；禁用的 cursor/opacity 语义，不能让 hover/pressed 覆盖禁用。
- **收敛结论：3 种结构/状态变体**：① standalone toggle 通用状态；② segmented outline group（外框/接缝独有，按钮内态复用）；③ default 多选 chip group（间距与外观不同，但按下内态复用）。四个视觉状态是每种按钮的交互状态，不另外算成变体。
- CSS 骨架建议：`[data-slot="toggle"] { --jk-toggle-face:...; --jk-toggle-ink:...; --jk-toggle-shadow:... }`，hover / `:is([data-pressed],[aria-pressed="true"])` / `:is(:disabled,[aria-disabled="true"],[data-disabled])` 用变量覆写；group 外框以 `[data-slot="toggle-group"][data-variant="outline"] > [data-slot="toggle"]` 和 default variant 做结构差异。toolbar 限定应合并到同一规则块或用低 specificity `:where()`，否则当前高 specificity 11 行与 `!important` 会压过通用层；合并后需回归 specificity 与 disabled 顺序。

## 可视化

[打开四态并排预览](../preview/P1-G2-toggle.html)。页面内嵌 CSS，按下态是清晰的粉色凸起 bevel，与常态的暗色面及不同阴影一眼可辨；禁用态降低不透明度并禁止交互。
