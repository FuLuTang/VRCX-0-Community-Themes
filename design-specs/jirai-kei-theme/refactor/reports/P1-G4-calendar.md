# P1-G4 Calendar 组件普查

## 1. Inventory 全量记录

范围限定 `family=G4, component=calendar`。Inventory 当前只包含下表这一条记录、一个 styleVariant；观察数不是日历内部日期状态的采样数，而是容器节点的观测数。

| primaryContext | 观察数 | 指纹数 | Fingerprint | 路由 | styleVariants（观察数） |
|---|---:|---:|---|---|---|
| `overlay:popover-content` | 1 | 1 | `990b922995141777` | `/browse-history` | `990b922995141777`（1） |

记录的 computedStyle：字色 `rgb(242,235,255)`、底色 `rgb(32,25,54)`、四边 border-width 均 `0px`（边框颜色记录为 `rgb(108,92,224)`）、inset shadow `rgb(108,92,224) 0 0 0 1px`；字体 WD Pixel CJK / Geist 系，14px/400。单一容器 fingerprint 不等于内部日期状态只有一种；日期按钮各状态要看 CSS 规则与组件契约。

## 2. 主题日历规则与实现

样式层唯一直接命中日历的规则位于 `14-buttons-and-data.css` 的 186–223 行（等同 runtime `data-surfaces-r10.css` 106–143 行）。作用域兼容主内容与 popover：`:is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"])`。

**`--rdp-*` 检查结果：未发现任何 `--rdp-*` 变量定义或覆写；也未发现 `.rdp-*` 类选择器。** 因而当前主题并非通过 react-day-picker 的变量体系换肤。该组件来源注释指向 `ui/shadcn/calendar.tsx`；可见主题约定是 shadcn 日历的 `[data-slot]`、`[data-day]` 与状态 data-attribute，不应将其误改写成 `.rdp-*`。

| 部位/状态 | 命中选择器（相对 calendar 根） | 主题声明 / 职责 |
|---|---|---|
| 容器 | 根 `[data-slot="calendar"]` | `border-radius:0; background-color:var(--wd-window); color:var(--wd-text); box-shadow:inset 0 0 0 1px var(--wd-frame)` |
| 月份标题 | `[data-slot="calendar-month-caption"], .text-sm.font-medium` | `color:var(--wd-text)`；字号/排版沿用组件实现 |
| 星期表头 | 无专属主题选择器 | 当前样式层未命中 weekday heading；沿用组件/Tailwind 默认结构与排版，根字色继承 |
| 普通日期格 | `[data-day]` | `border-radius:0; color:var(--wd-text)`；尺寸、网格布局不由这段主题规则设置 |
| 单选、范围起止 | `[data-day][data-selected-single="true"]`、`[data-day][data-range-start="true"]`、`[data-day][data-range-end="true"]` | 合并同一视觉规则：方角、`background-color:var(--wd-square)`、`color:#16112a` |
| 范围中段 | `[data-day][data-range-middle="true"]` | 方角、`background-color:var(--wd-select)`、`color:var(--wd-text)` |
| 今日 | `td[data-today="true"] > [data-day]`，排除选中/范围起止 | `outline:1px dashed var(--wd-pink); outline-offset:-2px` |
| 键盘焦点 | `[data-day]:focus-visible` | `outline:2px dashed var(--wd-pink); outline-offset:-2px` |
| 禁用 | `[data-day]:is(:disabled,[aria-disabled="true"])` | `color:var(--wd-faint); opacity:.55` |

容器 fingerprint 的紫色边线对应 inset `--wd-frame`；主题根规则使用 `--wd-window` 而非 CSS border。CSS 中没有专门针对多月份、周数栏、月份导航按钮或 weekday label 的主题规则；不能从单条 Inventory 样本推断这些模式曾被观察/启用。

## 3. 合并决策

| 样式面 | 决策 |
|---|---|
| 主内容与 popover 的日历容器 | 合并为一套日历基底，保留两个明确挂载位置；两者共用窗口底色、文字、细 inset frame。 |
| 普通日期格、月份标题 | 各保留一个结构基样式；标题/weekday 未观察到独立主题变体，不要新增第二套 skin。 |
| 单选与范围起止 | 可共用选中高亮声明；三种语义都要在选择器中保留。 |
| 范围中段 | 必须保留独立状态，因为背景使用 `--wd-select`，与端点/单选的 `--wd-square` 不同。 |
| 今日、禁用、focus-visible | 必须是独立状态规则。今日与选中/范围起止互斥，避免今日虚线覆盖选中底；禁用灰化、键盘焦点虚线也不可并入普通格。 |
| 多月份、周数栏 | 不创建额外变体；目前没有主题选择器/Inventory 证据表明它们实际使用。若组件配置将来启用，只沿用基底，确有不同视觉需求再单独评审。 |

## 4. 收敛结论与 CSS 组织

**收敛为 1 套日历外观 + 5 类必要语义状态（选中/范围端点、范围中段、今日、禁用、焦点）**，而不是按路由或容器拆成多套 skin。建议以日历 root selector 为统一挂载作用域，后代用 `[data-slot="calendar-month-caption"]`、`[data-day]`、`[data-selected-single="true"]` / `[data-range-…]` / `[data-today="true"]` / `:disabled` 划分职责；weekday heading 仅在有真实视觉需求时补充规则。

因当前没有 `--rdp-*` 覆写，重构无需仿造 RDP 变量层。若后续集成版本确实暴露 RDP 变量，应将所需变量集中放在 calendar root 的单一“第三方变量适配块”（同一 root scope 下逐组按布局/状态列出），再让状态规则消费主题 tokens；不要把同一套 `--rdp-*` 值散落进日期、标题等多个规则。现有样式由语义选择器直接消费 `--wd-*` tokens。

**Specificity 注意：** 当前 root 使用 `:is()`，`:is()` 的 specificity 取参数中最高分支；它组合了 `[data-slot="calendar"]` 与 popover/main-content 锚点，后代状态选择器还叠加多个 attribute/class。若为简化而降成裸 `[data-day]` 或 `.rdp-day`，可能被组件 Tailwind utilities/组件默认状态规则反压；合并时保持 calendar scope，并让基础格先于交互态，今日排除选中/范围端点这一互斥条件也必须保留。若改用 `:where()` 包裹完整作用域则会显著降权，需要确认级联层序/组件默认规则后再做，不能假定等价。

## 5. 可视化

独立静态预览 [P1-G4-calendar.html](../preview/P1-G4-calendar.html)：内嵌 CSS，以 2025 年 6 月呈现普通日期、范围中段/端点、单选、今日、禁用与焦点示例；这是结构/状态示意，不代表 Inventory 观测到同月多状态共存。
