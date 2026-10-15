# P1-G4 Resizable Handle 组件普查

## 1. Inventory 全量记录

筛选 `family=G4, component=resizable-handle` 得到 **1 条记录**（inventory 第 10716–10810 行）：`tag=div`、`variant=null`、`size=null`、`primaryContext=surface:main-content`；8 observations、8 states，覆盖 7 条 route：`/favorites/avatars`、`/favorites/friends`、`/favorites/groups`、`/favorites/import/friends`、`/favorites/worlds`、`/instance-history`、`/tools/screenshot-metadata`。styleFingerprintCount=2。

| 指纹 | 次数 | 样式层采样的 computedStyle（paint 属性） |
|---|---:|---|
| `2fb9b6318f793522` | 7 | color `rgb(242,235,255)`；background `rgb(108,92,224)`（#6c5ce0）；四边 border-width 0px（style solid）；box-shadow `rgb(22,17,42) 1px 0px 0px 0px`；opacity 1、filter none、transform none。 |
| `18a32ce6433b787e` | 1 | 与上一指纹相同，唯 box-shadow `none`。 |

两种只在阴影有无上不同；不是两种主视觉线型。Inventory 的 fingerprint properties 不含尺寸、margin、cursor，也没有记录方向属性，因此宽度/高度与方向不能从 inventory 推断。StyleVariants 数据位置：第 10735–10802 行。上下文唯一为 main-content（10723、10804–10808）。

## 2. 样式层命中规则（按实际绘制/状态相关规则列出）

| 文件 / SECTION / 行 | 选择器 | 实际声明及作用 |
|---|---|---|
| `14-buttons-and-data.css` / `buttons-badges-r10` / 225–230 | `:where(.vrcx-0-main-content > .vrcx-0-page-scaffold:not(:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"], .favorites-body))) [data-slot="resizable-handle"]` | `background-color:var(--wd-frame)`；`color:var(--wd-text)`。常规非 Favorites splitter 的柄面。 |
| 同上 / 231–242 | 同上 `::before` | 绝对定位、居中、`width:3px;height:16px`；`repeating-linear-gradient(to bottom,var(--wd-square) 0 2px,transparent 2px 4px)`。绘制纵向短虚点握纹。 |
| 同上 / 243–247 | 同上 `[aria-orientation="horizontal"]::before` | `width:16px;height:3px`；横向重复点纹。方向变体有写。 |
| 同上 / 248–250 | 同上 `:focus-visible` | `outline:2px dashed var(--wd-pink); outline-offset:1px`。 |
| `13-toolbar-overlays-and-pages.css` / `favorites-r9` / 394–399 | Favorites 专属 scaffold 下 `[data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"] > [data-slot="resizable-handle"]` | 注释标明“Vertical split grip”；柄 `background:#6c5ce0; transition:none`。 |
| 同上 / 401–404 | 上述 handle `::after` | `width:4px`（注释：既有 1px separator 与 4px hit zone；只绘制不改布局）。具体块高/宽源自组件，未在此改写。 |
| 同上 / 406–416 | 上述 handle `> div` | grip `width:4px;height:28px;border-radius:0;border:1px solid #6c5ce0;background-color:#6c5ce0;background-image:repeating-linear-gradient(to bottom,#ffb8e6 0 1px,transparent 1px 5px);box-shadow:inset 1px 0 #fdf4ff,inset -1px 0 #16112a;transition:none`。 |
| 同上 / 418–424 | handle `:is(:hover,:active) > div` | hover/按下变粉：`border-color:#ff7fcf;background-color:#ffb8e6`，纹样改 #6c5ce0；阴影暗边 #7a3f6d。 |
| 同上 / 426–430 | handle `:focus-visible` | `outline:2px solid #ff7fcf; outline-offset:1px`。 |
| `15-late-components.css` / `splitter-r97` / 163–179 | 多条 `[data-slot=resizable-handle]` 规则 | 见下一表；是跨页通用最终绘制 token / grip 声明。 |

### `splitter-r97` 逐条拆解

| 行 | 选择器 | 声明 |
|---:|---|---|
| 164–167 | 注释 | `ui/shadcn/resizable.tsx` 的 `Separator[data-slot=resizable-handle]`；注释称库 `data-separator=inactive|hover|active|focus|disabled`；只绘制，不动尺寸/布局；workspace handle 是 8px `.bg-transparent` slot，伪元素画线。 |
| 168 | `[data-slot=resizable-handle]` | `--jk-sl:#6c5ce0; --jk-sb:#16112a; --jk-sd:#ffb8e6`（线、底、点纹颜色）。 |
| 169 | handle `:is([data-separator=hover],[data-separator=active])` | `--jk-sl:#ff7fcf; --jk-sd:#fdf4ff`。 |
| 170 | handle `[data-separator=active]` | `--jk-sb:#ff7fcf; --jk-sd:#16112a`。 |
| 171 | handle `:not(.bg-transparent)`、`.bg-transparent::before` | `background:var(--jk-sl); box-shadow:1px 0 #16112a`。线条/阴影。 |
| 172 | handle `[aria-orientation=horizontal]:not(.bg-transparent)` | `box-shadow:0 1px #16112a`。方向相关阴影。 |
| 173–174 | handle `.bg-transparent`、`.bg-transparent::before` | slot `box-shadow:none`；before 的 `left:calc(50% - 1px);translate:none`。 |
| 175 | handle `:focus-visible` | `outline:1px dotted #ff7fcf; outline-offset:1px`。 |
| 176–178 | 注释；handle `>div` | 注释记述 4×16、1px 线色框、底色槽、三枚点；实际 `width:4px;height:16px;border-radius:0; box-shadow:inset 0 0 0 1px var(--jk-sl)`，多段 linear-gradient 形成三枚 `var(--jk-sd)` 横点，底 `var(--jk-sb)`。 |
| 179 | reduced-motion media | handle 与 `::before` `transition:none`。 |

针对所有 style 层 CSS 搜索 `[data-slot="resizable-handle"]`、`[data-slot="resizable-panel-group"]`、`[data-panel-resize-handle]`、`data-resizing`、`data-dragging`、`col-resize`、`row-resize`、`ew-resize`、`ns-resize` 和 `cursor:`：未发现 panel-resize-handle / resizing / dragging / resize cursor 声明；也未发现 `cursor: col-resize`、`row-resize`、`ew-resize` 或 `ns-resize`。其它命中的 cursor 仅一般 pointer / not-allowed，与手柄无关。`data-separator=hover|active` 是当前对应的交互状态入口，不是 data-resizing/data-dragging。

## 3. 核心判断（证据）

- **主题确实有样式**，不是零覆盖：柄本体紫色 #6c5ce0（inventory 10741–10743；`15-late-components.css:168,171`；Favorites 专门声明在 `13-toolbar-overlays-and-pages.css:395–399`）。整体是纯紫色槽/细条加深色像素阴影，非传统凸起或凹陷边框。Grip 则有独立像素纹理，形成小型可抓握视觉；通用握纹见 `14-buttons-and-data.css:231–247`、`15-late-components.css:176–178`，Favorites 大握纹见 `13-toolbar-overlays-and-pages.css:407–415`。
- **厚度/命中区**：Favorites 注释明确线为 1px、hit zone 为 4px（`13-toolbar-overlays-and-pages.css:394–404`）；workspace 注释称 slot 8px（`15-late-components.css:164–167`）。其余 app 源布局尺寸由组件提供且 CSS 注明不改（`15-late-components.css:166–167`），inventory 不采集 width/height。不可把 1px 绘制线等同于 4/8px 命中柄。和 separator 比：前作指出 separator inventory 尺寸未采集，故**无法据采样量化比较线宽**；但手柄的可拖热区明显不是 separator 的静态线宽概念。
- **光标**：样式层和原 artifact 对 resize 光标关键字检索均无匹配。不能声称主题设置了拖拽光标；是否由浏览器/组件内联/运行时提供未从这些 CSS 文件证明，结论为“主题 CSS 未设置”。
- **hover / 拖动**：状态式确实存在。通用 `data-separator=hover|active` 分别在 `15-late-components.css:169–170` 更换紫线为粉 #ff7fcf、点纹 #fdf4ff；active 底色转 #ff7fcf、墨色 #16112a。Favorites `:hover,:active` 握柄样式见 `13-toolbar-overlays-and-pages.css:418–424`，粉底 #ffb8e6、粉框 #ff7fcf。无专门 `[data-resizing]` / `[data-dragging]` 声明；`data-separator=active` 是实现中拖拽活动的依据（来源依据为 CSS 注释 165 行）。
- **方向**：常规 style 明写 `[aria-orientation="horizontal"]::before` 改成 16×3 横握纹（`14-buttons-and-data.css:243–247`）；默认 before 为 3×16 纵握纹（231–242）。splitter-r97 有 `[aria-orientation=horizontal]` 的投影方向变体（172），但没有在 `>div` 上另写横向 grip 变换；Favorites 的独立 grip 是竖向排列纹样（407–415），其垂直 split 适用语境按 SECTION 注释记载。方向由 aria-orientation / group 语义约束，不能合并成一个不分向度的 grip 规则。
- **抓手存在**，不是只留空白区：3px×16px 默认握纹、4×16px 三点纹、Favorites 4×28px 刻线握纹；其绘制伪元素或子 div 均明确见上表。组件的透明大 hit zone 与握纹装饰不是同一个几何尺寸。
- **独立线还是边框叠线**：CSS 使用 handle 自身背景/伪元素作线，且握柄带自绘 shadow；没有规则将它覆盖到相邻 panel 边框。Favorites 注释明确“paint existing 1px separator and 4px hit zone”，因此可判定为独立 splitter 绘制在手柄槽上，不是拿两侧 panel border 拼线。inventory 仍采到一条 `1px` 深色偏移阴影（2fb9...，10755），非 panel 边框；会否因 app 原 panel 边框另有设置形成视觉双线，采样未覆盖相邻 panel 边框，**无法确定**。不要假设相邻边框必定无重叠。

## 4. 合并与收敛

建议收敛为 **3 个交互样式子型**，共用一套 handle 线色 / 状态色 token，不把不同 grip 几何硬合并：

1. **默认通用 handle**：保留低优先级本体/伪元素结构、focus、reduced motion；3×16 默认 grip 与 aria-orientation 横向变体 16×3 可共享颜色、点距，只交换宽高/渐变方向。
2. **通用 splitter-r97 pixel grip**：`data-separator=hover|active` 语义和 token 可与状态色基础合并；保留其 4×16 三点式 grip、透明 slot/伪元素定位及独立 1px 线阴影语义。与 14 的虚线条可共享调色板，不应将两种握纹并成同一图案。
3. **Favorites 垂直 split 局部握柄**：独立 4×28 刻线 grip、4px hit-strip 与状态反色保留。选择器需要 Favorites splitter 宿主范围；不可被全局 grip 覆盖。

**必须保留**：横/纵 grip 几何方向；hover/active 状态反馈；focus 可见性；不同 grip 有无/图案（主题中实际至少两个点纹方案和 Favorites 长刻线方案）；独立命中区与装饰线的尺寸区别。可合并：状态色变量、无方向依赖的基础柄色、focus/reduced-motion 策略（以低 specificity 基类及局部 override 实现）。

CSS 骨架可用 `:where(.vrcx-0-main-content) [data-slot="resizable-handle"]` 维护柄/命中层；`[aria-orientation="horizontal"]::before` 单列方向尺寸与渐变；`[data-separator="hover"],[data-separator="active"]` 管色值，`>div` 保留 grip 类型。Favorites 以 splitter ID 锚定局部覆盖，不把其 4×28 grip 混入通用 grip。

## 5. 与 separator 的关系 / 最终结论

**不能把 resizable-handle 合并进 separator；可以复用基础线型的颜色 token/像素感，但组件必须独立。** 静态 separator 仅作内容分隔；handle 有实际拖动命中区、方向光标语义（尽管主题当前没显式设 cursor）、focus、hover/active 状态，以及 grip affordance。前作已将可拖拽 handle 定性为独立交互组件（`P1-G2-separator.md:38,73`）。在视觉层面共用 #6c5ce0 或像素线色合理；共享 separator 的 selector/几何则会破坏 4/8px hit zone、方向变化和状态握柄。

可视化见 [`P1-G4-resizable-handle.html`](../preview/P1-G4-resizable-handle.html)：左右与上下分栏、默认/hover/拖拽中三态。真实颜色和已查明的绘制尺寸用于示意；app 组件宿主 hit area 因未采集，仅根据 CSS 注释分别标出 4px Favorites hit strip 与 8px workspace slot，不伪造实际截图尺寸。
