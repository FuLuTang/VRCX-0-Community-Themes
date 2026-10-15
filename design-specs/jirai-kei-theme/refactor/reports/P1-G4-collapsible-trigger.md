# P1-G4 collapsible-trigger 组件普查

## 1. Inventory 全量记录

来源：`baseline/reports/component-variant-inventory.json`，限定 `family=G4, component=collapsible-trigger`。共 4 条记录、184 observations、4 个 styleVariants（跨记录重复 fingerprint 去重后亦为 4 个）。Inventory paint fingerprint 不包含 padding；因此内边距均标未采集。它也没有 icon 子元素记录。

| primaryContext | tag / variant / size | observations | 指纹数 | styleVariants（fingerprint：observations；关键 computedStyle） |
|---|---|---:|---:|---|
| `surface:main-content` | button / ghost / sm | 7 | 2 | `c5664021530f85f4`:5，背景透明、文字 `rgb(242,235,255)`、字号12.8px/字重500；`0f198a6c4e04bcc2`:2，背景 `rgb(74,55,132)`、其余上述文字/字号/字重相同 |
| `surface:main-content` | button / (无) / (无) | 25 | 1 | `3a26c496669abd1f`:25，背景透明、文字 `rgb(242,235,255)`、14px/400 |
| `surface:main-content` | button / outline / sm | 4 | 1 | `bdf4fb04fdf0d436`:4，背景 `oklab(0.697332 0.034437 -0.0683353 / 0.3)`、文字 `rgb(242,235,255)`、12.8px/500 |
| `surface:side-panel` | button / ghost / sm | 148 | 1 | `c4eaa4bf52aab930`:148，背景 `rgb(42,33,71)`、文字 `rgb(242,235,255)`、12px/500；`box-shadow:rgb(217,127,198) 3px 3px 0px 0px` |

main-content 有 3 条记录，合计 36 observations、4 个指纹（指纹观察合并数分别为 5、2、25、4）。side-panel 为 148 observations、1 指纹。圆角：inventory 中各 `computedStyle` 未给出 `border-radius` 数值，故未采集；内边距也未采集。记录 routes 分别是 `/tools/my-groups`,`/tools/screenshot-metadata`；`/settings`,`/tools`；`/community-themes`,`/themes`；侧栏条目覆盖 inventory 列出的 37 个 route（见 JSON 10367–10405）。来源行：JSON 10161–10249、10251–10306、10308–10362、10364–10447。

上述 fingerprint 差异主要是背景、字体尺寸/字重及 shadow，而非证据充分的四套完整皮肤；第一条的 `#4a3784` 与同一 ghost 的悬停值相符，但 inventory 本身没有 hover 元数据，不能只凭数值断定状态。

## 2. 样式层命中规则（全部 collapsible 相关）

| 文件 / SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `02-foundation.css` / `runtime` / 32–39 | `.vrcx-0-side-panel [data-slot="collapsible"] > button[data-variant="ghost"][data-size="sm"]:has(> svg.lucide-chevron-down)` | `display:flex; background-color:var(--wd-raised); color:var(--wd-text); border:1px solid var(--wd-frame); border-radius:999px; box-shadow:3px 3px 0 var(--wd-title-active); font-size:12px; font-family:"WD Pixel CJK",var(--vrcx-app-font-family,system-ui); font-synthesis:none` |
| 同上 / 40–42 | 上述按钮 `::before` | `content:""; width:6px; height:6px; flex:none; border-radius:50%; background-color:var(--wd-title-active)`（装饰圆点，不是旋转箭头） |
| 同上 / 43–45 | 上述按钮 `> [data-slot="badge"]` | `background:transparent; border-color:transparent; color:var(--wd-muted); font-family:"WD Pixel CJK",sans-serif` |
| 同上 / 46 | 上述按钮 `:hover` | `background-color:var(--wd-select)` |
| `04-group-spacing-and-typography.css` / SECTION `group-spacing` / 1–15 | `.vrcx-0-side-panel [data-slot="collapsible"]:has(> button[data-variant="ghost"][data-size="sm"] > svg.lucide-chevron-down)` | 根容器 `padding-bottom:10px`。注释说明这是虚拟行测量间距，不能把 padding 移到按钮或改行坐标（2–12行）。 |
| `06-panels-and-settings.css` / SECTION `runtime` / 173–185 | 纵向 tabs 下 `[data-slot=card-header] [data-slot=collapsible-trigger]` | 180行：`position:relative; padding-left:36px; padding-right:10px; border-radius:0; color:#f2ebff`；181行 hover `background-color:#3a2b63`。183行 `::before` 是24×16粉色蝴蝶结 mask 装饰；185行 `::after` 是底部蕾丝 mask。 |
| `15-late-components.css` / SECTION（148后，无独立 SECTION 标题）/ 148–161 | `[data-tools-section] [data-slot=card-header] [data-slot=collapsible-trigger]` | 154行 `position:relative; padding-left:36px; padding-right:10px; border-radius:0; color:#f2ebff`；155行 hover `background-color:#3a2b63`；157行共享 charm `::before` 为24×16装饰；159行 Settings trigger 底部 `::after{content:none}`；160–161行 card-header 承接 lace。 |
| `16-final-navigation.css` / SECTION `portal-button-roles-b073-b100` / 201–228、245–251 | portal 通用 button 选择器 `:where(:not(...,[data-slot="collapsible-trigger"],...))`；及 disclosure 子规则 | 201行明确把 `[data-slot="collapsible-trigger"]` 从 portal 通用按钮皮肤排除。248–250行仅对 disclosure/collapsible-trigger 等保留平面样式 `border-radius:0; box-shadow:none` 及 focus ring；没有背景/字体/padding 赋值。 |

**搜索范围结论：** 样式层没有 `[data-slot="collapsible-content"]`、`[data-state="open"]` / `[data-state="closed"]`、trigger 内 SVG chevron 尺寸/颜色规则，也未找到对 trigger chevron 的 `transform` / `rotate` / animation selector。除了上述两处 card-header / 侧栏定向 trigger 规则，没有全局独立 trigger skin。普通 card-header 基础规则 `[data-slot="card-header"]` 在 `02-foundation.css` 69行仅 `background-image:none; border-bottom:1px dotted #70518f`；真正的 Settings/Tools header 背景 `#2f2552` 在 `06-panels-and-settings.css` 178行和 `15-late-components.css` 151行。`#2a2147` 是 foundation 的 `--wd-raised`（02-foundation.css 3行），用于侧栏 trigger，而非通用 card-header。

## 3. 核心判断

- **不是统一独立皮肤，而是按语境复用 button/disclosure 基础，再有两种有意局部处理。** 普通 main-content trigger 没有通用 trigger 规则；门户按钮框架又显式排除它（16-final-navigation.css 201行），余下通用 disclosure 规则仅 flatten radius/shadow（248–250行）。Settings/Tools trigger 位于 `card-header` 内，继承标题栏背景 `#2f2552`（`rgb(47,37,82)`），按钮本身透明，hover 才 `#3a2b63`；它不是自身涂成 card-header 色（06… 178–185；15… 151–161）。side-panel ghost/sm 是例外：`--wd-raised = #2a2147` 按钮胶囊皮肤（02… 3、34–46），与 card-header `#2f2552` 明确不同。故不存在“trigger 一律复用 card-header 背景”的事实。`#2a2147` 与基础 ghost button 通用面 `--jk-button-face:#211a33`（02… 10）也不同；其 hover token `--jk-button-hover-face:#392a52`（11）同样不等于侧栏 `--wd-select:#4a3784`（5）。
- **展开/收起：** 样式层无 `[data-state=open/closed]` trigger 规则，无法从 CSS 报告中给出状态差异；侧栏 hover 规则有背景变化。Inventory 有两个侧栏 ghost 指纹，其中一项背景 `#4a3784` 与 hover token一致，但数据未记录状态，谨慎视作观察到的变体，不能证实 open/closed。没有 CSS chevron rotate/transform/换图规则；侧栏 selector 明确要求 SVG `lucide-chevron-down`，CSS没改它。`07-keyframes.css` 搜索 `collapsible|chevron-down|data-state=open|closed` 无命中，故相关动画本体不在冻结层此文件；样式层也没有引用它。不能推断组件库运行时 JS 是否做旋转。
- **箭头图标：** 未发现统一尺寸/颜色 CSS。唯一 trigger 子元素约束是侧栏 selector `> svg.lucide-chevron-down`，用于命中容器选择器，没有设置该 svg 的 width/height/color/transform（02… 34）。侧栏圆点 `::before`、Settings/Tools charm `::before` 是主题装饰，不应误认 chevron。
- **点击区域 / cursor：** DOM 语义是 `button[data-slot=collapsible-trigger]`，按钮本身为点击控件；卡片标题场景对按钮设置左右 padding，侧栏用 button 作 collapsible 根的直接子项（06…180；02…34）。因此应将点击 affordance、padding、cursor 放在 trigger button，而非仅文字或 content。主题没有命中 trigger 的 `cursor:pointer` 声明；按钮浏览器默认光标可能受应用基础/UA 影响，普查不能称为主题已设。侧栏根的 `padding-bottom:10px` 是虚拟列表布局间距，不能挪作按钮点击高度（04… 2–15）。
- **内容区：** 没有 `collapsible-content` 规则。内容呈现由原 DOM/组件样式承担，不能把 content 面板造型从 header/trigger 样式推测出来。

## 4. 合并建议

可合并基础交互语义为一套平面 disclosure 基底（button 全宽/实际布局、focus-visible、cursor 语义、继承文字色）；Settings 与 Tools 的 header 内 trigger 可共享 36px 左 / 10px 右 padding、无圆角、文字色与 hover face/charm。普通 `card-header` 仍独立承担 title-band 背景与分隔。side-panel ghost/sm 胶囊需保留单独 modifier（raised face、圆角、粉色硬阴影、紧凑字体、前置圆点、badge 透明化）；outline-sm/main-content 与 default-size 需要保留 variant/font size 语义差别，不能全压成同一套 button face。

必须保留：嵌套折叠的层级缩进/点击边界；设置卡默认展开与普通折叠状态的内容布局（inventory stateCount 只计采集状态，不能作为 default-open 证明）；无箭头、纯文字折叠不能强制伪造 chevron。侧栏依赖真实 `lucide-chevron-down` 来限定样式并涉及虚拟行高度；不可对所有 collapsible 根添加结构性 padding。Settings/Tools 的蝴蝶结、蕾丝是标题区皮肤装饰，合并时留在对应语义 modifier，不塞入通用按钮基底。

## 5. 收敛结论 / specificity

建议收敛成 **2 种触发器视觉族**：A. 平面 disclosure（普通 main-content 与 card-header trigger 基础）；B. side-panel 紧凑胶囊（ghost/sm + chevron 结构）。Settings/Tools 的 `card-header` 标题条与 charm/lace 属容器/装饰 modifier，不另算第三种 trigger；outline-sm 的半透明 face 可作为局部 variant，不单独扩成皮肤。CSS 骨架可用 `:where([data-slot="collapsible-trigger"])` 定义共用 button affordance/focus/cursor，再用 `[data-slot="card-header"] > [data-slot="collapsible-trigger"]` 与 `.vrcx-0-side-panel [data-slot="collapsible"] > button:has(> svg.lucide-chevron-down)` 分别注入 titlebar 与胶囊 token；`[data-slot="collapsible-content"]` 只管内容区边界/间距，状态仅在确认真实 DOM 状态及组件箭头机制后添加。

合并 specificity 风险：当前 side-panel selector 含祖先类、多个属性、`:has()`，card-header 规则也有复杂纵向-tabs / tools scope；若合并到低 specificity 的 `:where()` 基底，既有高 specificity 规则仍覆盖背景、padding、装饰。应以低权重作 base、保留语境 modifier；不要试图用另一条更长 selector 盲目抢优先级。

## 6. 可视化

[独立预览 P1-G4-collapsible-trigger.html](../preview/P1-G4-collapsible-trigger.html) 用内嵌 CSS 展示收起、展开、hover 三种 trigger 状态及展开内容区。数值取样式层真实声明；未采集的状态、padding 按本文标注，不伪称为完整 computed layout。
