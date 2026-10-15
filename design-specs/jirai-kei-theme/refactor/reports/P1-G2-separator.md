# P1-G2 Separator 组件普查

## 1. Inventory 全量记录

筛选 `family=G2, component=separator` 得到 **2 行**，均为 `tag=div`、`variant/size=null`。`styleFingerprintCount` 合计 4；两行共 4 个 styleVariants 项（跨 context 有同指纹复用）。观察数 27。

| primaryContext | 记录行数 | 观察数 | 指纹数（行字段合计） | 记录摘要 |
|---|---:|---:|---:|---|
| `overlay:sheet-popup` | 1 | 2 | 1 | 1 个指纹：`18a32ce6433b787e`（2 obs） |
| `surface:main-content` | 1 | 25 | 3 | `18a32ce6433b787e`（13）、`a7dae9580ab4c165`（6）、`d8f0408e0a78afc8`（6） |
| **合计** | **2** | **27** | **4** | **3 个唯一指纹** |

### 全部 styleVariants / 真正的 computedStyle 差异

以下按各 context 的完整 styleVariants 列出。fingerprint `18a32ce6433b787e` 在两个 context 中相同。

| context | fingerprint | variant observations | computedStyle 差异（背景；高度/宽度；边框；margin） |
|---|---|---:|---|
| overlay:sheet-popup | `18a32ce6433b787e` | 2 | 背景 `rgb(108, 92, 224)`；高度/宽度：未采集；四边 border-width `0px`（style `solid`，颜色 `rgb(108, 92, 224)`）；margin：未采集 |
| surface:main-content | `18a32ce6433b787e` | 13 | 同上：背景 `rgb(108, 92, 224)`；尺寸未采集；四边 0px solid（#6c5ce0）；margin 未采集 |
| surface:main-content | `a7dae9580ab4c165` | 6 | 背景 `rgba(0, 0, 0, 0)`；尺寸未采集；四边 `0px none`（颜色字段为继承文本色 `rgb(242,235,255)`，不是可见边框）；margin 未采集 |
| surface:main-content | `d8f0408e0a78afc8` | 6 | 背景 `rgb(22, 17, 42)`；尺寸未采集；四边 0px solid（#6c5ce0）；margin 未采集 |

Inventory 的 `paintFingerprintProperties` 采集颜色、背景色、边框、阴影等 paint 属性，但不含 height、width、margin；故此处一律标“未采集”。三种指纹的实际可见差异主要是背景；边框均为 0 宽，不构成不同几何线型。`color` 均为 `rgb(242,235,255)`，shadow none，opacity 1。源位置：`component-variant-inventory.json` separator 两行约 7017–7206。

## 2. 样式层命中规则与分类

### A. 真实 separator 语义（可合并的 primitive）

| 文件 / SECTION / 行 | 选择器与实际声明 | 语义判断 |
|---|---|---|
| `14-buttons-and-data.css` / `buttons-badges-r10` / 76–78 | `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="separator"][data-orientation="horizontal"]:where(...)` → `background:repeating-linear-gradient(90deg,#8c71b0 0 1px,transparent 1px 3px)`；vertical 对应 `repeating-linear-gradient(180deg,...)`。排除 toolbar、popover、sm card、row action。 | 普通区域通用横/纵点线。注释明确保留 primitive 原有 1px 尺寸。 |
| `11-controls-and-pages.css` / `popups-r9` / 268 | menu/select/combobox 内容内 `menu-separator/select-separator/combobox-separator` → 横向 repeating-linear-gradient(#8c71b0 1px/3px)，`border:0`。 | 菜单项间分隔，语义明确；独立于普通区域的范围与主题。 |
| 同文件 / 同 SECTION / 330 | menubar 内容内 `[data-slot="menubar-separator"]` → 同样点线背景，`border:0`。 | menubar 菜单语义；保留受限 popup scope。 |
| `13-toolbar-overlays-and-pages.css` / `browse-history-r9` / 598–605 | 目标行内 `[data-slot="separator"][data-orientation="horizontal"]` → `height:1px; flex:1 1 0%; border:0; background-color:transparent; background-image:repeating-linear-gradient(to right,#8c71b0 0 2px,transparent 2px 4px); opacity:1`。 | 文字标题旁的横向点线，局部 override，有意改变点距/布局弹性。 |
| `06-panels-and-settings.css` / `pixel-controls` / 154–155 | `[data-slot=toggle-group][data-variant=outline] > [data-slot=separator]` → `width:2px;background-color:#16112a`; `::before{display:none}`。 | 控件组内部纵向分隔，必须保留 2px 深色槽与伪元素抑制。 |
| `11-controls-and-pages.css` / `controls-r9` / 79 起 | toolbar outline toggle-group 下直接子 `[data-slot="separator"]` 有局部处理（同为窄槽/隐藏装饰伪元素，须保留 toolbar 的特定命中范围）。 | toolbar 中控件分隔；不可直接并入全局 1px 点线。 |
| `13-toolbar-overlays-and-pages.css` / `SECTION splitter-r97` / 163–179 | `[data-slot=resizable-handle]`、状态属性 `data-separator=hover/active` 与方向、`:before` 线条及 `>div` grip；`--jk-sl/#6c5ce0`，hover/active 粉色，横/纵方向几何与 focus outline。 | 这是可拖拽 splitter / resize handle（有交互状态、命中区域、grip），不是静态 separator primitive；保留自身规则与几何。 |

### B. 容器边框充当分隔（结构边界，不是 separator 元素）

以下检索到的明确边缘分隔声明应按所属容器保留，不能把 selector 或边框简单替换成 `[data-slot=separator]`：

| 文件 / SECTION / 行 | 选择器概况与声明 | 分类 |
|---|---|---|
| `02-foundation.css` / `runtime` / 27–28、118 | `.vrcx-0-titlebar{...border-bottom:1px solid var(--wd-frame)}`；`.vrcx-0-statusbar{...border-top:1px solid var(--wd-frame)}`；statusbar 相关行有底边。 | 窗口 chrome 的结构边界。 |
| `02-foundation.css` / `runtime` / 69 | `[data-slot="card-header"] ... border-bottom:1px dotted #70518f`。 | 卡片标题与内容分区边界。 |
| `03-chrome.css` / `window-chrome` / 32、70 | chrome 标题区 `border-bottom`、状态区 `border-top:1px solid var(--jk-chrome-edge)`。 | 框架边界。 |
| `10-login-and-dialogs.css` / `login-r8` / 72 | 登录区域 `border-bottom:1px solid var(--wd-frame, #6c5ce0)`。 | 登录布局边界。 |
| `11-controls-and-pages.css` / `popups-r9` / 235–240、305–310 | menu/menubar label 有粉色 marker 背景，同时 `border-bottom:1px solid #6c5ce0`。 | Label 底边兼标题装饰，不是 separator slot。 |
| `14-buttons-and-data.css` / `data-surfaces-r10` / 103–123、253–260 | table header/row、head、footer 的 dotted bottom/top；card-footer `border-top-style:dotted;color:#70518f`。 | 表格/卡片结构边界。 |
| `15-late-components.css` / `dialog-header-r97` / 103、`data-tools-section` / 151 | dialog header `border-bottom:1px solid var(--r9-dialog-frame)`；tools card-header `border-bottom:1px solid #16112a` 并有 inset highlight。 | Dialog 与 card 标题边界。 |
| `13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 197 等 | toolbar/page header 的底边规则（其余页面容器边线也散见 `07-navigation-r7`、`08-chrome-r7` 等）。 | 布局边界，需留在具体区域 selector。 |

这些 line/border 是容器自身框架/分区，尽管视觉上也“分开内容”，不等同于组件语义，不能用 separator 通用声明覆盖。

### C. 背景纹理与蕾丝：装饰层，不是功能分隔

| 文件 / SECTION / 行 | 规则 | 分类与处理 |
|---|---|---|
| `15-late-components.css` / `cards-r97` / 158–162 | card-header `::after` 用 `background-color:rgb(217 127 198/.55)` + `mask:var(--jk-r97-lace)` 绘制 lace，位于标题栏下沿并向卡片内容探出。 | **纯装饰花边**；保留 mask、伪元素、锚点和高度，绝不能合并进 separator。 |
| `15-late-components.css` / `splitter-r97` / 176–178 | resize handle 子 div 以多段 `linear-gradient` 画 grip dots。 | 拖动把手装饰/交互 affordance，不是分隔线本体；需连同 splitter 保留。 |
| `14-buttons-and-data.css` / 76–78、`11-controls-and-pages.css` / 268、330、`13-toolbar-overlays-and-pages.css` / 598–605 | `repeating-linear-gradient` 画点状线。 | 这些确实是 separator 的**绘制实现**（功能分隔），区别于 lace/motif。 |
| `02-foundation.css` / `runtime` / 57、139；`12-loader-and-forms.css` / 127–151 等 | 页面背景、loader 的 repeating/linear gradients。 | 与分隔线无语义关联，不应列入 separator 合并。 |

## 3. 收敛判断

建议收敛为 **3 个功能线型基类 + 1 个独立装饰资产类别**，不是把所有“像线”的效果合成一个规则：

1. **普通静态 separator：2 个方向变体**（横向/纵向共用颜色、点距 token，方向仅切换 gradient 角度；保持 primitive 原有尺寸/边距，不从 inventory 臆造尺寸）。普通 main/side-panel 的同类点线可统一；selector 宜以 `:where(...)` 包 scope 降低新增 specificity。
2. **菜单 separator：1 个 popup 专用 scope**。视觉参数可复用普通点线 token，但菜单族 selector 范围/优先级独立，尤其菜单-label border 不属于此组。
3. **控件组/toolbar separator：独立窄槽例外**。2px 深色槽与 toolbar 内 primitive、按钮排列及伪元素关系不同，不能套静态点线基类；横纵方向保留既有方向约束。
4. **可拖拽 resizable handle** 自成交互组件（非 separator primitive），状态色、命中宽度、focus、grip 都不能并入静态分隔线。
5. **边框和 lace** 留在各自容器/装饰规则，不能纳入组件 variant。

CSS 骨架建议：` :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="separator"][data-orientation="horizontal"] { background-image: repeating-linear-gradient(90deg, var(--jk-separator-ink) 0 1px, transparent 1px 3px); }`，vertical 用 `180deg`；popup selector 独立限定 menu/select/combobox/menubar 宿主，局部 toolbar / toggle-group 声明继续后置覆盖。颜色可提取 token；切勿把 `border-top/bottom` 或 lace 伪元素 selector 并入该组。

**Specificity 风险：**当前通用规则将复杂排除条件放进 `:where()`，selector specificity 低；新增合并规则应继续这样做。若把 menu/toolbar 特例合并到带宿主层级的 `:is()`/普通 class selector，specificity 会升高，可能压过 toolbar、popup 原有组件声明；反向降低现存局部规则的 specificity 也会改变 cascade。重构时应保留“通用低优先级、定域例外后置”的层级，不以 `!important` 粗暴解决。

## 4. 结论摘要

Inventory 两个 context 共 27 次观察、3 个唯一 paint fingerprint，主要是背景由紫色填充、透明或深底变化；没有采集尺寸/间距，不能据此断言几何变体。功能分隔可复用横/纵点线基类，但菜单、toolbar 控件槽、可拖动 splitter 必须保留语义/交互例外。结构边框是容器分区，lace 是装饰资产；二者都不归入 separator 组件。

可视化见同目录 `P1-G2-separator.html`：暗底展示横向、纵向、菜单点线、窄槽和 lace 示例，CSS 完全内嵌。
