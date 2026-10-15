# P1-G3 剩余浮层容器：基底收敛普查

> 范围：本次 5 个（context-menu-content、dropdown-menu-content、sheet-popup、toast-viewport、tooltip-content）+ 对照的 popover-content、hover-card-content、select-content。数据以指定 inventory 和样式层现状为准；不改 CSS。

## 1. Inventory 记录与 styleVariants

每组件在 inventory 各有一条记录；指纹数即该记录的 `styleFingerprintCount`，styleVariants 列出全部指纹及其 observations。

| 组件 | context（primaryContext） | 观察数 | 指纹数 | styleVariants（fingerprint: observations） |
|---|---|---:|---:|---|
| context-menu-content | `overlay:context-menu-content` | 1 | 1 | `876e4321a6f50b50:1` |
| dropdown-menu-content | `overlay:dropdown-menu-content` | 2 | 1 | `876e4321a6f50b50:2` |
| sheet-popup | `overlay:sheet-popup` | 1 | 1 | `83fd549fe1eb7f09:1` |
| toast-viewport | `overlay:toast-viewport` | 126 | 1 | `432850898dcd7eea:126` |
| tooltip-content | `overlay:tooltip-content` | 1 | 1 | `7b4b27e748784c39:1` |
| popover-content（对照） | `overlay:popover-content` | 1 | 1 | `c5ca2c1aababe824:1` |
| hover-card-content（对照） | `overlay:hover-card-content` | 1 | 1 | `c5ca2c1aababe824:1` |
| select-content（对照） | `overlay:select-content` | 1 | 1 | `876e4321a6f50b50:1` |

Inventory 定位：context menu 8957–9009；dropdown menu 9069–9123；hover-card 9215–9268；popover 9271–9324；select 9327–9380；sheet 9472–9525；toast-content 9530–9614、toast-viewport 9617–9703；tooltip 9705–9759（JSON 行号）。toast-viewport 的 126 次不是 126 个独立外观：只有一个指纹。

样本外观要点（inventory computedStyle）：context/dropdown/select 三者是暗底 `rgb(33,26,51)`、浅字、紫边、两道 inset + 3px 硬投影；popover/hover-card 同色同边同影。sheet 样本则是更亮的 `rgb(42,33,71)`、宿主阴影、紫边。toast viewport 样本透明、无边无影；tooltip 样本暗底、紫边及 3px 投影。inventory 的 sheet/viewport 观察只代表采样的 computedStyle，不意味着 theme 每个选择器都覆盖这些属性。

## 2. 样式层命中位置与实际声明

行号均是 `refactor/src/style/` 当前行号。以下列出目标容器的直接皮肤规则及直接相关定位/层叠规则；通用后代按钮、头像、减少动画等规则不冒充容器外壳。

| 组件/用途 | 文件 / SECTION / 行 | 选择器 | 声明 |
|---|---|---|---|
| context-menu / dropdown-menu / popover / select 基底 | `11-controls-and-pages.css` / `popups-r9` / 220–230 | `:is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"])` | `--radius:0px; background:#211a33!important; color:#f2ebff; opacity:1; border:1px solid #6c5ce0; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e; backdrop-filter:none; animation:none!important; transition:none!important` |
| menu positioner 辅助 | 同上 / 232 | `[data-slot="menu-positioner"]` | `--radius:0px`（非容器皮肤，不接管定位） |
| tooltip 普通档 | `13-toolbar-overlays-and-pages.css` / `overlays-r10` / 125–139 | `[data-slot="tooltip-content"]:not(:has(> div.flex.flex-col.gap-1.text-xs)):not(.flex.flex-col.gap-1.text-xs)` | `--radius:0px; box-sizing:border-box; padding:6px 12px; overflow-wrap:anywhere; background:#211a33; color:#f2ebff; opacity:1; border:1px solid #6c5ce0; border-radius:0; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e; backdrop-filter:none; animation:none!important; transition:none!important` |
| tooltip 普通箭头 | 同上 / 141–143 | 普通档选择器 `> div.rotate-45` | `display:none` |
| tooltip statusbar 多行档 | `11-controls-and-pages.css` / `popups-r9` / 338–352 | `body:has(.vrcx-0-statusbar [data-slot="tooltip-trigger"][data-popup-open]) [data-slot="tooltip-content"]:is(:has(> div.flex.flex-col.gap-1.text-xs),.flex.flex-col.gap-1.text-xs)` | `--radius:0px; padding:6px 8px; overflow-wrap:anywhere; background:#211a33!important; color:#f2ebff; opacity:1; border:1px solid #6c5ce0; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, 2px 2px 0 #100b1e; backdrop-filter:none; animation:none!important; transition:none!important` |
| tooltip statusbar 箭头 | 同上 / 355–356 | statusbar 多行档选择器 `> div[class~="rotate-45"]` | `display:none` |
| toast 卡片（不是 viewport） | `13-toolbar-overlays-and-pages.css` / `overlays-r10` / 158–170 | `[data-slot="toast-viewport"] > *` | `box-sizing:border-box; background:#211a33!important; color:#f2ebff; border:1px solid #6c5ce0; border-left:4px solid #d97fc6; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e!important; backdrop-filter:none; animation:none!important; transition:none!important` |
| toast 文本/焦点细节 | 同上 / 171–177 | viewport 内 title、description、action/button focus-visible | title `color:#ffe4f2`；description `color:#d6c8e6`；焦点 `outline:2px solid #ffe4f2; outline-offset:-3px` |
| sheet bell 内容皮肤 | `13-toolbar-overlays-and-pages.css` / `overlays-r10` / 179–190 | `[data-slot="sheet-popup"]:has([data-slot="sheet-title"] .lucide-bell)` | `--radius:0px; background:#211a33!important; color:#f2ebff; border:1px solid #6c5ce0; border-inline-start:1px solid #6c5ce0; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e!important; backdrop-filter:none; animation:none!important; transition:none!important` |
| sheet bell header / title / button | 同上 / 192–206 | bell 条件下的 sheet-header、sheet-title、header button | header `box-sizing:border-box; padding:12px 16px; color:#21132d; background:#d97fc6; border-bottom:1px solid #6c5ce0; border-radius:0`；标题和按钮 `color:#21132d`；焦点按钮 `outline:2px solid #21132d; outline-offset:-3px` |
| hover-card 对照 | 同上 / 145–156 | `[data-slot="hover-card-content"]` | `--radius:0px; background:#211a33!important; color:#f2ebff; border:1px solid #6c5ce0; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e!important; backdrop-filter:none; animation:none!important; transition:none!important` |
| 动画禁用补充 | 同上 / 209–224 | reduce-motion 与 `html.reduce-effects` 下的 tooltip、hover-card、toast 子项、bell sheet | `animation:none!important; transition:none!important`。不应将 toast viewport 本身误作 target。 |
| toast 图标资源/布局 | `16-final-navigation.css` / `status-icons-r10` / 1–110 | toast-viewport 后代的 type/icon 选择器 | 类型 icon 的尺寸、伪元素与冻结 PNG 引用；content `overflow:visible`（38 行附近）；不改变 viewport 定位，也不构成第二套 toast 外壳。 |

**确认后缀覆盖：**`[data-slot$="menu-content"]` 确实匹配 slot 值 `context-menu-content` 与 `dropdown-menu-content`，二者直接命中 11-controls-and-pages.css:220 基底。popover/select 是同一规则显式枚举，不是 `$=` 命中。hover-card 由单独规则补齐相同皮肤。

## 3. 核心判断

### a. 是否能归成一个“浮层基底”簇？

**能归为同一个设计簇（深色、方角、紫边、像素硬投影的 overlay language），但不能把八个 DOM/规则无差别压成一条容器选择器。** 五个中的 context-menu/dropdown-menu 和对照 popover/select 共享 `popups-r9` 基底（11:220–230）；hover-card 有自身重复基底（13:145–156）。toast 皮肤作用于 Root 直子而非 viewport（13:158–170）；tooltip 有普通与 statusbar 两套投影（13:123–143、11:333–356）；sheet 只有 bell 命中限定的独立规则（13:179–206），且形态/定位不同。故共同的是 token/视觉语言，不是同一结构/同一完整规则。

**两种结构例外成立：**tooltip 不在 11:220 的共用 `:is(...)` 中，且确有 3px 普通档、2px statusbar 档；toast 的 `[data-slot="toast-viewport"] > *` 是对子卡片施加外观，不是对 viewport 本身施加外观。它们都是显著结构例外，但不是唯一独立皮肤：sheet 也有独立内容感知规则。

### b. Sheet 基础皮肤、定位与尺寸

在样式层中，sheet-popup 没有无条件的基础外壳皮肤规则；唯一直接外壳皮肤就是 bell 限定的 `:has(...)`（13:179–190）。inventory 的 sheet 样本显示 `#2a2147`、紫边、宿主默认软阴影（JSON:9489–9504），而不能据此说 theme 为所有 sheet 设了基底。其他 sheet 由宿主现有样式负责。

该选择器是有稳定标题图标锚点的通知中心专属例外，**应保留**，避免把其它用途 sheet 一起强制换肤。sheet 是全屏/侧滑型面板；本次查到的主题皮肤规则没有 `position/inset/top/right/width/height/transform` 等几何声明。重构继续只负责 paint（背景、文字、边框、阴影、header），将尺寸、侧滑方向、定位、动画/placement 留给宿主组件。不要把小型浮层的 `max-width`、定位或尺寸硬套给 sheet。

### c. Toast viewport 与卡片职责

viewport 本身负责挂载/定位 toast；主题规则只命中 viewport 的直接子元素（13:158，注释 158 明确 Root 无 data-slot），卡片由该规则画背景、边框、粉色左侧条、硬投影。viewport inventory 指纹透明无边无影（JSON:9667–9682），主题层也没发现 viewport 的 `position/inset/z-index` 声明。因此右下/顶部居中等位置以及堆叠由宿主 AppToaster/Base UI 决定；仅从这两份数据不能断言当前具体落点。样式层中这些目标规则未设 z-index，层级留给 host。

### d. Tooltip 两档与合并

普通规则（13:125–139）排除多行 stack signature，并有 3px 投影、`padding:6px 12px`；statusbar 规则（11:338–352）需要开启的 statusbar trigger + 两种多行 DOM signature，使用 2px 投影、`padding:6px 8px`。前者选择器是单一 tooltip slot 加两个 `:not(...)`；后者增加 `body:has(statusbar open trigger)` 祖先 guard，并以 `:is(:has(子 stack),.flex stack)` 筛选多行。正因颜色/边框大部分重复，视觉 token 可共享；但不能把规则直接合成一条而丢掉差异、状态 guard 或阴影档位。可提取变量/共同声明，但仍需两种结构选择器（或一条基础规则 + 两条档位覆盖），故最少仍是普通/多行两个 selector 分支。

### e. 逐字重复声明块

有。`11-controls-and-pages.css:220–230` 的 popup 基底与 `13-toolbar-overlays-and-pages.css:146–156` hover-card 壳在**核心皮肤声明值上逐字相同**：`--radius`、背景、文字、边框、半径、三层 box-shadow、backdrop-filter、animation、transition 一致；hover-card 的 background、radius、shadow 多了 `!important`，所以若按完整文本严格比较并非完全相同块。两处视觉设计重复，重构可共享基础 token/mixin（但 CSS 静态产物仍需核验优先级）。toast 根子项的 border-left 4px、tooltip 2px 档和 sheet header 不相同，不能算重复完整块。基底规则选择器必须纳入 hover-card，或 hover-card 延用专属 selector 并用共享声明来源消除重复。

## 4. 可合并 / 必须保留

- **合并为一个皮肤基底族：**context-menu、dropdown-menu、popover、select；再把 hover-card 的重复声明改为共享基底（先验证 `!important` 层叠是否必需）。当前 `$=` 已覆盖前两者，勿再为两种菜单另写同皮肤规则。
- **保留独立结构/声明：**普通 tooltip 与 statusbar 多行 tooltip；toast `viewport > *` 卡片；sheet bell 内容感知专属皮肤 + header 特例。tooltip 箭头隐藏规则两档均保留。
- **定位/尺寸不合并进主题：**toast viewport 定位与 sheet 几何交宿主；菜单 positioner 继续保持 `--radius` 辅助，不改 placement。
- **保留 toast 子节点语义：**title/description 色、焦点态、不同 type 的冻结图标皮肤不并入通用面板声明。

## 5. 收敛方案：建议 5 个核心皮肤规则组

这里的“规则条数”按主要容器外观选择器计数，不包括箭头、文本、焦点、图标及减少动画辅助规则。

1. **overlay 基底 1 条**：`:is([data-slot$="menu-content"], [data-slot="popover-content"], [data-slot="select-content"], [data-slot="combobox-content"], [data-slot="hover-card-content"])`；包含方角/深底/紫边/三层硬影/静态效果。`[data-slot$="menu-content"]` 同时接住 context-menu 与 dropdown-menu。
2. **tooltip 普通档 1 条**：保留普通结构排除器，3px 投影与 6×12 padding。
3. **tooltip statusbar 档 1 条**：保留 active-trigger guard 和多行 signature，2px 投影与 6×8 padding。
4. **toast 卡片 1 条**：`[data-slot="toast-viewport"] > *`，保留粉色左边条；不是 viewport 本体。
5. **sheet bell 特例 1 条**：`:has([data-slot="sheet-title"] .lucide-bell)`，只负责通知中心皮肤，header 子规则另保留。

所以主要容器规则建议为 **5 组（基底 1 + tooltip 2 + toast 1 + sheet 1）**。当前核心选择器规则也大致是 5 组，只是通用基底与 hover-card 重复分散。CSS 骨架：

```css
:is([data-slot$="menu-content"], [data-slot="popover-content"],
    [data-slot="select-content"], [data-slot="combobox-content"],
    [data-slot="hover-card-content"]) { /* palette, border, radius, box-shadow */ }
[data-slot="tooltip-content"]:not(/* stack signatures */) { /* ordinary 3px */ }
body:has(/* open statusbar trigger */) [data-slot="tooltip-content"]:is(/* stack signatures */) { /* compact 2px */ }
[data-slot="toast-viewport"] > * { /* toast card + accent rail */ }
[data-slot="sheet-popup"]:has(/* bell title icon */) { /* notification sheet only */ }
```

**Specificity/优先级警告：**基底用 `:is()` 时 specificity 由参数中最高者决定；`[data-slot$="menu-content"]` 与单属性 hover-card/select/popup slot 大致同为一个 attribute specificity。把组件列表改为 `:where()` 会把基底 specificity 降至零，可能输给宿主 utility；反之新增祖先/`:has()` 会抬高。hover-card 现有 `!important` 与基底普通 declaration 不完全等价，合并前检查是否依赖重要性、加载次序以及背景/阴影覆盖；tooltip statusbar 的 `body:has(...)` 本来就高 specificity，不能丢 active-trigger guard。Toast 不能把选择器误改为 viewport 本体。

## 6. 来源行号速查

- inventory JSON：context/dropdown 8957–9123；对照 hover/popover/select 9215–9380；sheet 9472–9525；toast 9530–9703；tooltip 9705–9759。
- 样式层：popup 基底 11-controls-and-pages.css:216–230；tooltip statusbar 333–356；普通 tooltip、hover-card、toast、sheet 及 reduced motion 13-toolbar-overlays-and-pages.css:119–224；toast 类型图标 16-final-navigation.css:1–110。

## 7. 可视化

[打开八类浮层并排预览](../preview/P1-G3-overlay-bases.html)。预览使用内嵌 CSS 呈现对应真实颜色、边框与投影，并标明基底共享与三类结构/语义例外；sheet/toast/tooltip 的示意框不代表宿主几何定位。
