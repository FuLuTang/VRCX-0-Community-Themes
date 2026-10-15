# P1-G4 Empty 三槽位普查

## 范围与方法

复核前作 [`P1-G4-empty.md`](P1-G4-empty.md)：其结论是 17 observations / 5 fingerprints，静态 empty 一套皮肤；loading 被排除。排除选择器确实存在：`14-buttons-and-data.css:159` 为 `:where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"]))`。样式层另有 spinner/loading 定向规则 `12-loader-and-forms.css:21–60`，不是静态皮肤。仅针对 G4 inventory 的 `empty` 与子槽位；未找到 `empty-content`、`empty-header`、`empty-media` 的独立 inventory component 记录（`empty-header` 只在 CSS selector 中出现）。

## Inventory 全记录及差异

三个目标槽位及根节点均只有 primaryContext `surface:main-content`，完整 context trail 为 `... > area:vrcx-0-main-content > area:vrcx-0-page-scaffold`。下表列出对应 records 的全部 styleVariants；computedStyle 中没有采集 margin、gap 属性，故标为“未采集”。

| 组件 | context | 观察数 | 指纹数 | 全部 styleVariants / 指纹观察数 | color | font-size | font-weight | margin / gap / opacity |
|---|---|---:|---:|---|---|---|---|---|
| empty（根） | surface:main-content | 5 | 1 | `3a73be5beacbbfdc` ×5 | `rgb(242,235,255)` | 16px | 400 | margin/gap 未采集；opacity 1 |
| empty-icon (`variant=icon`) | surface:main-content | 2 | 1 | `ccf69b8ce6bdb3d7` ×2 | `rgb(255,184,230)` | 16px | 400 | margin/gap 未采集；opacity 1 |
| empty-title | surface:main-content | 5 | 1 | `dafd986d71efc620` ×5 | `rgb(242,235,255)` | 14px | 500 | margin/gap 未采集；opacity 1 |
| empty-description | surface:main-content | 5 | 2 | `225cae7274cf0cb2` ×4；`c30718c0ccb9a8b0` ×1 | 两者均 `rgb(185,173,217)` | 14px ×4；12px ×1 | 均 400 | margin/gap 未采集；opacity 均 1 |

证据：inventory `component-variant-inventory.json:10452–10505`（empty）、`10511–10598`（description）、`10603–10655`（icon）、`10660–10714`（title）。Description 两指纹除字号外 paint 相同；12px 是一条紧凑字号例外。inventory 没有记录 margin/gap，也没有 slot 尺寸记录；不能从缺少字段推断 CSS 实际布局值。

## 样式层命中规则

直接命中 empty 根/子槽位的完整规则组仅在 `14-buttons-and-data.css` 的 SECTION/注释 `Empty states get a quiet dashed pixel frame`（158 行）中：

| SECTION、行 | 选择器 | 实际声明 |
|---|---|---|
| Empty states / 159–163 | `:where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"]))` | `border-radius:0; border-color:#70518f; color:var(--wd-text)` |
| 同 / 164–166 | 上述 root 后代 `[data-slot="empty-header"]` | `border-bottom:1px dotted #70518f` |
| 同 / 167–173 | 上述 root 后代 `[data-slot="empty-icon"][data-variant="icon"]` | `border:1px solid var(--wd-frame); border-radius:0; background:var(--wd-raised); color:var(--wd-square); box-shadow:inset 1px 1px rgb(253 244 255 / .16), inset -1px -1px #16112a` |
| 同 / 174–179 | 上述 root 后代 `[data-slot="empty-title"]` | `color:var(--wd-text); font-family:"WD Pixel CJK", var(--vrcx-app-font-family, system-ui), sans-serif; font-synthesis:none; text-wrap:pretty` |
| 同 / 180–183 | 上述 root 后代 `[data-slot="empty-description"]` | `color:var(--wd-muted); text-wrap:pretty` |

只按这些槽位名检索，另有 `12-loader-and-forms.css:21–60` 的 empty 内 spinner 规则（含 spinner、明确不是静态槽位 skin）；`15-late-components.css:118` 是对包含 spinner 的 SVG 选择，不是 icon/title/description 的静态规则。不存在样式层对 `empty-content` 或 `empty-media` 的直接命中规则。

Token 定义：`02-foundation.css:3–6`，`--wd-raised:#2a2147`、`--wd-frame:#6c5ce0`、`--wd-square:#ffb8e6`、`--wd-text:#f2ebff`、`--wd-muted:#b9add9`。

## 核心判断

### 视觉层级对照

| 槽位 | 实测 color | 实测字号 | 实测字重 | CSS 层职责 |
|---|---|---:|---:|---|
| icon | `#ffb8e6` | 16px | 400 | 粉色前景；raised 方块底、紫框及 inset 高光 |
| title | `#f2ebff` | 14px | 500 | 明亮、略粗标题；CSS 明确指定字体族 |
| description | `#b9add9` | 14px（1/5 为 12px） | 400 | muted 次级说明；CSS 只明确颜色与换行 |

标题与说明不是只靠颜色：inventory 明确观测到 title 14px/500，description 14px/400，且 description 有 12px 例外（证据行见上）。不过 CSS 规则组自身没有给二者设置 font-size/font-weight；这些计算值来自规则组之外的基线/组件样式，不能把字号归功于主题样式层。主题的直接分层声明是 title 的亮色 vs description 的 muted 色，并为标题额外指定字体。与前作 field-label 的“只设颜色不设字号”相似之处仅在样式层声明方式，不代表最终计算字号相同。

### icon 槽

inventory 只识别 `div[data-slot="empty-icon"][data-variant="icon"]`，没有记录内部节点/tag，故不能据此断言内部 glyph 是 SVG、字体图标还是其他内容；CSS 也不设 `width`、`height`、`font-size`，统一尺寸**无证据**。icon 槽计算色 `#ffb8e6`，CSS 用 `color:var(--wd-square)`（固定 token 值而非继承父文字色），且带固定底色/边框/内阴影。opacity 采集为 1，没有主题减弱；CSS 不声明 opacity。inventory 行 `10619–10646`；CSS `167–173`。

### 1 套静态皮肤覆盖范围、容器与 padding

前作所谓“一套静态皮肤”实际规则命中根 `empty`、`empty-header`、`empty-icon[variant=icon]`、`empty-title`、`empty-description`，证据 `14-buttons-and-data.css:159–183`。未命中的 `empty-content` / `empty-media` 没有主题覆盖；当前 inventory 也没有它们的样本记录，不能据此说它们实际出现或可见。但 header 之外的内容布局、slot 间距和按钮表现都不是这组规则所设。静态皮肤是一套，而不是每种内容形态一套。

根 `[data-slot="empty"]` 有规则：159–163 设圆角、边框色、根文字色；它**不设置 padding**。样式层没有 empty-root padding 声明，因此 padding 来源不能由本次样式层证据确定（可能来自组件默认/utility；不作猜测）。inventory 根的 computed style 也不含 padding 字段。规则注释称 quiet dashed frame，但规则自身只设 `border-color`，没有 `border-style` / `border-width`；inventory 根虽然记录了 computed dashed 与 0px 宽（`10473–10484`），不能误说该规则设置了可见虚线边框。

## 合并判断与收敛方案

- **可合并为共用基底：**三槽位都放在同一个 scoped 静态 root 下；description 14px/12px 可视为同一 muted 角色的尺寸变体，而非另造颜色皮肤。根与 title 的亮色可在未来评估继承简化，但必须先验证其余 cascade。
- **必须保留：**icon 是否存在是内容结构差异，不能用伪元素强制补图；title-only 与 description 缺省的空状态应可表达；带操作按钮的状态必须保留按钮 DOM、交互和适配布局，不可把操作按钮并入装饰皮肤。description 的紧凑 12px 例外应保留为字号 modifier/既有 utility（来源需继续追踪）。spinner 与静态 empty 必须由 `:not(:has([data-slot="spinner"]))` 隔离。
- **结论：**收敛为 **1 种静态 empty 皮肤**，内含 icon 子槽位皮肤及 description 紧凑字号例外；完整三件套、icon+title、含操作按钮是内容组合而非新增主题变体。骨架沿用 `:where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"]))` root，再对子槽位分别设置 header 分隔、icon frame、title font/color、description muted color。
- **Specificity：**`:where(.vrcx-0-main-content)` 权重为 0；root 属性选择器与 `:not(:has([data-slot="spinner"]))` 内部属性选择器仍贡献权重，子槽位属性再增加权重。若把规则并入低权重通用 `.empty` 或仅 root 选择器，可能被 utility/组件规则覆盖；保留 spinner 排除和 slot 定向选择器，合并时按 cascade 实测验证，不要靠增加页面前缀硬堆 specificity。
