# P1-G3 Hover-card-content 普查

> 范围仅限 G3 `hover-card-content`；不把 hover-card-trigger 的组件外观算作资料卡样式。核对来源：`baseline/reports/component-variant-inventory.json`、`refactor/src/style/*.css`。行号均为当前样式层文件行号。

## 1. Inventory 全部记录与变体

全部只有 **1 条记录**，没有同组件的第二个 context 或观测变体；computedStyle 采集集不包含 padding、max-width、z-index。

| component/tag/variant/size | primaryContext | 观察数 | 指纹数 | routes |
|---|---|---:|---:|---|
| hover-card-content / div / null / null | `overlay:hover-card-content` | 1 | 1 | `/feed` |

| fingerprint | observations | computedStyle（采集到的相关属性） |
|---|---:|---|
| `c5ca2c1aababe824` | 1 | background `rgb(33, 26, 51)`；四边均 `0.8px solid rgb(108, 92, 224)`；box-shadow `rgb(105,85,124) 1px 1px 0 inset, rgb(122,63,109) -1px -1px 0 inset, rgb(16,11,30) 3px 3px 0`；color `rgb(242,235,255)`；opacity 1；filter/transform none；字体 WD Pixel CJK/Geist 系列，14px/400。 |

Background、border、box-shadow 与 inventory 的 popover-content 样本（同指纹 `c5ca2c1aababe824`）一致。padding / max-width / min-width / z-index：**未采集**。无数据支持宣称 hover-card 比 tooltip 的实际 computed size 大；资料卡语义上内容较丰富，但 inventory 不能证明它的尺寸。

## 2. 样式层命中规则

逐字搜索 hover-card content/trigger/arrow 选择器及包含 hover-card 的规则，命中如下。没有 `[data-slot="hover-card-arrow"]` 专属规则；也没有直接命中 `[data-slot="hover-card-trigger"]` 本体的规则（下面另有其祖先下 avatar ring 规则）。

| 文件 / SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `13-toolbar-overlays-and-pages.css` / `overlays-r10` / 146–156 | `[data-slot="hover-card-content"]` | `--radius:0px; background:#211a33!important; color:#f2ebff; border:1px solid #6c5ce0; border-radius:0!important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e !important; backdrop-filter:none; animation:none!important; transition:none!important` |
| 同文件 / `overlays-r10` / 209–224 | reduced-motion 与 `html.reduce-effects` 下的 `[data-slot="hover-card-content"]` | 两种模式均 `animation:none!important; transition:none!important`（hover-card 与 tooltip、toast、指定 sheet 并列） |
| `11-controls-and-pages.css` / `avatars-status-r9` / 464–471 | `[data-slot="hover-card-content"] > div.relative.isolate.w-full > div.space-y-2.5 > div.relative.isolate > button.size-10 > span.bg-muted.size-full.rounded-full`（原 selector 以逐个 `[class~]` 表达） | `border-radius:0; border-width:0; box-shadow:none; outline:none; clip-path:var(--wd-avatar-cut)`。注释说明是 UserHoverCardContent 的 profile icon；姐妹 world banner 是独立宽按钮。 |
| 同文件 / `avatars-status-r9` / 515–522 | `.object-row > [data-slot="hover-card-trigger"] > div.relative.ml-2.overflow-visible > span.bg-muted.rounded-full.border`（原 selector 以 `[class~]` 表达） | `border-radius:0; border-width:0; box-shadow:none; outline:none; clip-path:var(--wd-avatar-cut)`。这是 trigger 里的好友头像壳，不是 trigger 本体。 |
| `16-final-navigation.css` / `portal-button-roles-b073-b100` / 201–228 | `:is(button[data-ui-role="action"], :where(...,[data-slot="hover-card-content"]) button[data-variant]:where(:not(...))` | 资料卡内按钮复用通用 portal action 按钮变体/hover/pressed/focus/disabled 状态（Bevel、variant face/text、transition、focus outline 等）；是按钮组件规则，不是卡片壳样式。 |
| 同文件 / 同 SECTION / 229–244 | `:where(...,[data-slot="hover-card-content"]) { & button[data-variant]... }` | 资料卡普通列表/choice 按钮保持方角，hover/focus/active/disabled 等扁平行态；text-link 使用通用 portal link 规则。 |

SECTION 边界复核：13 文件 `overlays-r10` 从 119 行开始；11 文件 `popups-r9` 从 216 行开始、`avatars-status-r9` 从 441 行开始；16 文件相关 section 从 194 行开始。命中结果中没有 arrow selector，也没有 hover-card-specific padding、max/min-width、定位或 z-index 声明。

## 3. 核心问题与证据

### 边框：与 popover/menu 同一皮肤，不同于 tooltip 的 CSS 专属边界

- hover-card 自己的壳规则写明紫边及三层硬阴影，见 `13-toolbar-overlays-and-pages.css:146–153`；inventory 样本亦为同一三层阴影（inventory 9229–9259）。
- menu/popover/select/combobox 的共享规则在 `11-controls-and-pages.css:220–230`，三层硬阴影及边框值相同。inventory popover 指纹与 hover-card 指纹完全同一 fingerprint（inventory 9221–9247 对照 9277–9303）。
- 普通 tooltip 规则在 `13-toolbar-overlays-and-pages.css:119–142`，其 panel 三层阴影看起来相同；但 hover-card 是其后的**独立 selector 和专属声明**，不能把“样式共用”说成现状。Tooltip 普通基座的 padding 是 6px 12px（13 文件 119–139），hover-card 规则没有 padding 声明。tooltip statusbar 例外规则（同文件 overlays 区段约 120 前）使用更短阴影，见其规则/注释；因此 hover-card 不是 statusbar tooltip 变体。

结论：hover-card 的实际边框/硬影与 menu/popover 共用视觉 token；与普通 tooltip 的颜色/描边/三层阴影也视觉相同，但规则仍分开。可共用浮层“外壳视觉基底”，但不能把几类组件语义、尺寸和箭头逻辑当作完全同一组件。

### 箭头

样式层对 tooltip 的 rotate-45 直接子节点明确 `display:none`（13 文件 140–142）；hover-card 没有对应 arrow 隐藏或显式保留规则，也无 `[data-slot="hover-card-arrow"]` 规则。故只能说主题**没有处理 hover-card arrow**，不能根据缺席规则断言 DOM 箭头存在/不存在或最终可见；若宿主生成箭头，它当前由宿主行为/默认样式控制。它与 tooltip 的明确隐藏行为**不一致**。

### 尺寸、内部内容、动画与 portal

- hover-card 外壳规则没有 `padding`、`max-width`、`min-width`、`width` 或 `z-index`（13 文件 146–156）；inventory 也未采集尺寸属性（inventory 9232–9259）。所以主题没有对该卡设尺寸约束，尺寸由 app/组件/宿主库的布局默认及内部内容决定；不要杜撰卡宽。
- 头像处理有明确卡内专属选择器：仅将 profile icon 头像圆角/边框/阴影清除并用 `--wd-avatar-cut` 方形裁切（11 文件 464–471）。badge 没有 hover-card-scoped 专属规则；现有 badge 规则限定 `.vrcx-0-main-content,.vrcx-0-side-panel`（14 文件 43–50），portal content 通常挂 body，不会自然匹配这些祖先。故预览里的徽章只是语义示例，不能声称 hover-card 内 badge 被此全局规则命中。名字/简介的字重与排版也未找到 hover-card 专属规则。按钮复用 16 文件 portal action/button 规则（201–244）。
- 壳上明确禁用 `animation` 和 `transition`（13 文件 154–155），reduce-motion 也禁用（211–224）；无 hover-card 动画本体引用。冻结层 `07-keyframes.css` 仅定义 `r5-dialog-step-in`（该定义见冻结文件第 2 行）；样式层调用在 `07-motion-navigation.css:22`，目标是 dialog，不是 hover-card。未发现 hover-card 动画本体或引用；这里只核对引用，不改冻结层。
- Portal specificity：content 以稳定的 `[data-slot="hover-card-content"]` 属性选择器直接命中 body portal，不依赖 `.vrcx-0-main-content` 等 app-root 祖先（13 文件 146）。按钮规则在 `:where(...,[data-slot="hover-card-content"])` 中引入 portal 根路径（16 文件 201、229），并按按钮 data-variant 排除；`:where()` 内部不增加 specificity。不要将根选择器改写成只依赖页面祖先的后代 selector，否则 portal 内容将漏匹配。

## 4. 合并判断：视觉可共簇，结构不可抹平

- **可合并**：hover-card、普通 tooltip、popover/menu 的壳色、直角边框、三层硬阴影、backdrop-filter 与静态 motion 声明可抽成一个视觉 primitive/token。三个样本/实现有强证据支持共同基底：hover-card/popover inventory 指纹相同；普通 tooltip CSS 同值。
- **必须保留**：tooltip 的箭头明确隐藏；hover-card 未覆盖箭头；popover/menu 是交互内容面板，hover-card 是资料卡内容；hover-card 缺少尺寸/内部排版规则，不能借 tooltip 的小面板 padding/max-width 规则套用。statusbar 多行 tooltip 的结构和短阴影也必须是 tooltip 专属例外（tooltip 前作已记）。
- **是否一个浮层簇？** 可以在 P2 把它们纳入同一个“浮层视觉簇”做共用外壳，但**不能收敛成一条无差别 CSS 规则**。推荐共用壳基底 + tooltip statusbar 紧凑例外 + tooltip arrow hidden + hover-card 子内容/箭头由各自规则处理；popover/menu 项目结构与按钮状态继续保留。

## 5. 收敛结论与 CSS 骨架

建议 hover-card-content **1 种外壳**（当前只有一个 context/fingerprint），并与普通 tooltip、popover/menu 共用外壳基底；tooltip 另保留 statusbar 多行例外，箭头隐藏只用于 tooltip。骨架：` :is([data-slot="popover-content"],[data-slot="hover-card-content"],普通-tooltip-selector) { background; color; border; border-radius; box-shadow; backdrop-filter; }`；各组件再独立定义 `padding/尺寸/arrow/内部内容`，hover-card 专属头像裁切与 portal 按钮选择器保留。不能无差别 `:is()` 把普通 tooltip 的 padding 也带给资料卡。

**Specificity 风险**：hover-card 当前单独 `[data-slot]` 选择器，tooltip 普通规则也用 slot selector，menu/popover 组合 selector 经 `:is()` 取最高分支 specificity。抽共基底时若用 `:where()` 会把新增部分降为零特异性，若嵌入高 specificity 的 menu selector 则可能改变覆盖顺序；同时 hover-card 的 `background`/radius/shadow 有 `!important`，必须对照保留优先级与文件加载顺序。根 selector 仍须直接匹配 portal 的 data-slot，不可只依赖应用树祖先。

## 6. 可视化

[打开 hover-card / tooltip / popover 并排对照](../preview/P1-G3-hover-card.html)。HTML 内嵌 CSS，使用主题实测颜色、边框与硬阴影；资料卡头像、状态徽章、简介、操作按钮为真实语义的示意内容，不声称是 inventory 对所有内部子元素的实测样式。尺寸为演示布局，不是主题的实测约束。
