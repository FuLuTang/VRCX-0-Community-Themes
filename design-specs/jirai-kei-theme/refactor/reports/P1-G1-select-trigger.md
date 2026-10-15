# P1-G1 Select Trigger 组件普查

## 1. Inventory 变体

Inventory 中有 3 组 `family=G1`、`component=select-trigger`、`tag=button` 记录，共 14 次观察；三组 `styleFingerprintCount` 均为 1，且全部指向同一 fingerprint `574d05b471c34ee3`（每一行 styleVariants 中观察数分别为 4、7、3）。

| Fingerprint | 观察数 | primaryContext / routes | 关键 computedStyle |
|---|---:|---|---|
| `574d05b471c34ee3` | 4 | `overlay:popover-content`；`/browse-history` | `color:rgb(242,235,255)`；背景 `rgb(33,26,51)`；边框宽度各边 `0.8px solid`，上/左 `rgb(105,85,124)`、右/下 `rgb(253,244,255)`；阴影 `rgb(22,17,42) 1px 1px 0 0 inset, rgb(162,148,200) -1px -1px 0 0 inset`。字体 14px/400。 |
| `574d05b471c34ee3` | 7 | `surface:main-content`；`/favorites/avatars`、`/favorites/friends`、`/favorites/import/friends`、`/favorites/worlds`、`/tools/my-groups`、`/tools/vrchat-log` | 与上项相同；字体 14px/400。上下文 trail 落在 page-toolbar 内，但没有独立的工具栏皮肤指纹。 |
| `574d05b471c34ee3` | 3 | `surface:main-content`；`/game-log`、`/notification`、`/social/friend-list` | 与上项相同；字体 14px/400。 |

这三组 fingerprint 与组件级 computedStyle 完全一致。Inventory 没有给出 `border-radius`、`padding`、`height` 数值，不能从缺项臆测实测值；也没有状态标签可将任一组解释为 focus/open/danger。`stateCount` 1/7/3 不是独立视觉皮肤数。

## 2. theme.css 命中规则

逐条检索 `[data-slot="select-trigger"]`、`[data-slot="combobox-trigger"]`、`role="combobox"`。以下是能直接命中 trigger 的规则；role=combobox 本身没有规则。行号以当前 `theme.css` 为准。

| SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| runtime / 674 | `[data-slot="button"], [data-slot="select-trigger"]` | `border-radius:2px`（后续 form-controls 规则以 `!important` 将 select/combobox trigger 方角化，故此 radius 对 trigger 不生效）。 |
| form-controls-r9 / 3311–3317 | `:where(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"])` | `border-radius:0!important; border-color:var(--jk-field-edge)!important; background-color:#211a33!important; color:#f2ebff!important; box-shadow:var(--jk-field-inset)!important`。 |
| form-controls-r9 / 3319–3322 | `:where([data-slot="select-trigger"],[data-slot="combobox-trigger"])` | `border-color:#6c5ce0!important; background-color:#201936!important`。这是非 `:focus-visible` 的选择器，因此触发器任意交互状态（包括未聚焦）都被涂成该颜色。 |
| form-controls-r9 / 3323–3325 | `:where(:is([data-slot="select-trigger"],[data-slot="combobox-trigger"]) > svg:is(.lucide-chevron-down,.lucide-chevrons-up-down))` | `width:12px; height:12px`。只影响下拉图标。 |
| form-controls-r9 / 3333–3335 | `:where(:is(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"]):focus-visible)` | `outline:2px solid #ff7fcf; outline-offset:1px`。这是当前仍在的键盘焦点反馈，不负责设置高亮背景/边框。 |

说明：3311–3335 位于 `/* SECTION form-controls-r9 */`（3206 起）。3319 规则以 `!important` 覆盖 3311 的 border/background；两者 specificity 都被 `:where()` 降为零，后出现的 3319 获胜。runtime 674 的普通 radius 也被 3311 的 important 方角声明覆盖。虽然存在 `role="combobox"` 文字引用，但没有针对 `[role="combobox"]` 的 trigger 规则；不要与 `[data-slot="combobox-trigger"]` 混为一谈。CSS 中 select-content / combobox-content 的弹层、选项规则命中的是展开面板/选项，不是 trigger，本表不计入 trigger 壳样式。

## 3. 非聚焦高亮与 `--jk-field-edge`

**是，当前这条非 `:focus-visible` 规则会使未聚焦态也呈现高亮边框/底色。** 3319 的选择器只要求 data-slot 匹配，既不要求 `:focus-visible`，也不要求 `[aria-expanded="true"]`；且两项属性都标 `!important`。因此它会把基础规则在 3311 设定的暗底和斜面边框替换掉，不是单纯 focus/open 指示。原本若将该覆盖限定为 `:focus-visible`，意图应是仅在键盘焦点时用紫色边框和稍亮暗底提示焦点，而默认仍保留凹凸四边斜面；focus ring 则由 3333 独立绘制。当前文件里实际已不是 focus-visible 版本，建议不要把旧意图描述成现行行为。

`--jk-field-edge` 在 `fields-toolbar-r10` / 3522 定义为 `#69557c #fdf4ff #fdf4ff #69557c`，注释说明 native select 边框保留四边 edge token。它被 3313 的共享 `:where(select, select-trigger, combobox-trigger)` 使用，但随后 3319 对 button-backed trigger 用 `border-color:#6c5ce0!important` 覆盖，所以**目前有效保留该变量斜面的只有原生 `select`**。另有 1468 侧栏菜单外框也引用该变量，但那不是 select-trigger。3311 的 `--jk-field-inset` 阴影仍由 trigger 采用，因为 3319 没有覆盖 box-shadow。

## 4. 合并判断

| 项目 | 判断 | 理由 |
|---|---|---|
| 三条 Inventory 记录 | 合并成一份基础组件皮肤 | 同 fingerprint、同 computedStyle；分属页面/弹层与尺寸上下文，不是视觉变体。 |
| 默认态 | 保留统一暗色凹面基线 | 暗底 `#211a33`、亮暗成对边框、inset 阴影构成控件立体基线；建议按钮型 trigger 也使用明确的默认态，不应默认紫色高亮。 |
| 聚焦态 | 必须保留正交键盘反馈 | `:focus-visible` 的粉色 outline/offset 1px 与底色边框分离；如果恢复紫色 focus border，也只应放在 `:focus-visible`，不要替代基线或可见 ring。 |
| 展开态 | 保留语义态（仅在确有设计需要时单独覆盖） | 目前没有 trigger 的 `[aria-expanded=true]` 外观规则或展开态 inventory 证据；不能将现有 3319 泛化规则误称为展开态。默认/展开可先共用皮肤，未来若需 pressed/open 反馈用 `[aria-expanded="true"]` 单独声明。 |
| 工具栏内嵌 | 组件本身可合并，布局上下文不要误改 | 7 次观察包含 page-toolbar context，但 fingerprint 未分叉；不需要复制一份 toolbar trigger 皮肤。若 trigger 实际嵌在 input-group，容器的 focus-within 外框与内部控件职责不同，应保持上下文容器规则。 |
| 危险态 | 不建立组件专属危险皮肤 | 未见危险态 trigger 选择器或 inventory 证据；菜单内 `[data-variant="destructive"]` 针对菜单项，不是 trigger。 |

## 5. 收敛结论 / CSS 骨架

**收敛为 1 种基础皮肤 + 1 个正交键盘焦点提示；展开态暂与默认共用，工具栏由容器布局承接，不额外复制皮肤。** 3319 应删除或限定到真实设计语义（若是焦点强调则加 `:focus-visible`；若是打开态则加 `[aria-expanded="true"]`），不应继续全状态覆盖默认色。建议以 `:where(:is([data-slot="select-trigger"],[data-slot="combobox-trigger"]))` 设置暗底、`--jk-field-edge`、`--jk-field-inset`、方角；同一 focus-visible 选择器组单独维护 `outline`，必要时另设 `:where(...[aria-expanded="true"])`。

`:where()` 把本地选择器 specificity 压到零，便于轻量合并，但也意味着与其他零 specificity 规则主要靠源码顺序决胜；当前声明带 `!important`，跨上下文主题覆盖更困难。收敛时应移除不必要的 `!important`，或审计它与 Base UI/utility class 的级联优先级，避免用更高特异度的大选择器补洞。

## 6. 可视化

[打开并排 select-trigger 预览](../preview/P1-G1-select-trigger.html)：内嵌 CSS，展示库存默认凹面、当前全局高亮覆盖、focus-visible 与展开语义对照。HTML 可直接用浏览器打开；没有外部资源依赖。
