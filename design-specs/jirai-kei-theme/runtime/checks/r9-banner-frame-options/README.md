# R9 banner frame options

> 仅用于视觉比较，不改生产 CSS / builder。统一用同一张虚构 320×240 像素横幅、同一像素头像和姓名；截图读取 app bundle CSS 与 Lead 当前主题 CSS。

- [1× 候选板](<design-specs/jirai-kei-theme/runtime/checks/r9-banner-frame-options/options-board.png>)（840×1507）
- [2× 候选板](<design-specs/jirai-kei-theme/runtime/checks/r9-banner-frame-options/options-board-2x.png>)（1680×3014）
- [复现脚本](<design-specs/jirai-kei-theme/runtime/checks/r9-banner-frame-options/render-options.mjs>) · [HTML fixture](<design-specs/jirai-kei-theme/runtime/checks/r9-banner-frame-options/options-board.html>) · [运行几何检查](<design-specs/jirai-kei-theme/runtime/checks/r9-banner-frame-options/render-metrics.json>) · [机器可读清单](<design-specs/jirai-kei-theme/runtime/checks/r9-banner-frame-options/manifest.json>)

## 候选与许可

| # | 方向 | 来源与授权 | CSS 估算 |
|---|---|---|---:|
| 01 | **扇贝孔眼 · 电子相框** | 设计目标参考 [scallop-eyelet-frame-navy.svg](<design-specs/jirai-kei-theme/assets-redistributable/lace/scallop-eyelet-frame-navy.svg>) 的通用扇贝/孔眼层次；候选本身为本轮原创阶梯像素图形，未复制源 SVG path。候选按仓库 [GPL-3.0](<LICENSE#L1-L20>)；源参考 provenance/license 未核实，只用于灵感、不随包。 | 3,553 B |
| 02 | 扇形蕾丝 · 展开花瓣 | [S2 fan lace](<design-specs/jirai-kei-theme/original-assets/src/s2-fan-lace-20x12.svg>) 为项目原创；仓库 GPL-3.0。候选是新的像素重绘。 | 2,610 B |
| 03 | 像素波瓣 · 四角扣片 | [scallop-edge.svg](<design-specs/jirai-kei-theme/original-assets/r5/src/scallop-edge.svg>) + [lace-corner.svg](<design-specs/jirai-kei-theme/original-assets/r5/src/lace-corner.svg>)；项目原创，R5 说明明确 GPL-3.0-only。 | 3,546 B |
| 04 | 环线缝迹 · 软边包线 | [stitch-loop-frame-1.svg](<design-specs/jirai-kei-theme/assets-redistributable/pattern/stitch-loop-frame-1.svg>) 内嵌 CC0 1.0 元数据，署名 Arvin61r58 / Openclipart；本候选是配色与网格的简化改绘，保留来源。 | 3,343 B |
| 05 | 窗口角轨 · 像素窗框 | [window-corner.svg](<design-specs/jirai-kei-theme/original-assets/r5/src/window-corner.svg>)；项目原创，R5 说明明确 GPL-3.0-only。 | 1,542 B |
| 06 | 穿孔数字边 · 介质盒框 | [perforated-dot-strip.svg](<design-specs/jirai-kei-theme/assets-redistributable/pattern/perforated-dot-strip.svg>) 仅作“穿孔条”的通用灵感；候选方孔图形为原创新稿，不嵌源 SVG。新稿按仓库 GPL-3.0；参考素材 provenance/license 未核实，不随包。 | 3,508 B |

CSS 估算是**单个候选**的 minified `.frame-N{background-image:url("data:image/svg+xml,<percent-encoded SVG>")}` UTF-8 字节数，包含 SVG data URI 与这条规则；不含共用定位/堆叠 CSS，也不含 gzip。正式集成时只能选一个候选；1×/2×不会使 CSS 负载翻倍。

## 推荐

优先让主人评估 **#01 扇贝孔眼**：最贴合“电子相框 + scallop/eyelet”的目标，四边连续且四角有明确收束；和现有横幅纹样叠加后辨识度够，不需要改头像或姓名布局。它约 3.6 KB；如果更看重克制和体积，可再看 **#05 窗口角轨**（约 1.5 KB），但它不是完整的蕾丝边框。候选板只是比较稿，最终选择留给 Lead/用户。

## 挂载点与裁切结论（源码核对）

- [UserDialogHeaderMedia.tsx:53–116](</tmp/vrcx-win-src-r9/src/components/dialogs/user-dialog/components/UserDialogHeaderMedia.tsx#L53-L116>) 已有外层 `.relative`，其中包含 banner 按钮与左下头像；按钮的 `overflow-hidden` 在 [line 62](</tmp/vrcx-win-src-r9/src/components/dialogs/user-dialog/components/UserDialogHeaderMedia.tsx#L62>)，头像 sibling 使用 `z-30` 在 [lines 87–113](</tmp/vrcx-win-src-r9/src/components/dialogs/user-dialog/components/UserDialogHeaderMedia.tsx#L87-L113>)。
- 按钮 `::before` / `::after` 和内层 `span::after` 已有 R9 stitch/hem 规则，见 [user-dialog-r9.css:13–50](<design-specs/jirai-kei-theme/runtime/user-dialog-r9.css#L13-L50>)；不应复用它们来画外框。
- 可行挂点：在现有 `.relative` wrapper 上加不拦点击的 sibling overlay（或用 wrapper 的空闲 `::before`），`position:absolute; inset:-4px; z-index:20; pointer-events:none`。它与 button 同级，不受 button 的 overflow 裁切；头像 `z-30` 保持在上层，像素圆裁切仍由当前 theme CSS 生效。
- 裁切依据：[Card](</tmp/vrcx-win-src-r9/src/ui/shadcn/card.tsx#L5-L33>) 的根节点 `overflow-hidden`；`data-size=sm` 把 `--card-spacing` 设为 12px，CardHeader 用该 token 做左右 padding。UserDialog 将根 Card 设为 overflow-hidden，见 [UserDialogHeaderSection.tsx:676–697](</tmp/vrcx-win-src-r9/src/components/dialogs/user-dialog/components/UserDialogHeaderSection.tsx#L676-L697>)。因此 4px 外伸仍落在 CardHeader 的 12px 内边距内，不会被 Card 根裁掉，**当前布局无需更改**。若未来把 CardHeader 横向 padding 清零，需改挂点或为 Card 留至少 4px 的外伸空间。
- [render-metrics.json](<design-specs/jirai-kei-theme/runtime/checks/r9-banner-frame-options/render-metrics.json>) 检查六项均为 320×240 banner、328×248 overlay、四边各 4px overhang；avatar clip-path 为 polygon、avatar z-index 30 > frame 20、overlay `pointer-events:none`，且 frame 底边与姓名区留有间距。四角在 1× 与 2× 均目视检查。

## 许可核查记录

- [assets-report.md](<design-specs/jirai-kei-theme/assets-redistributable/assets-report.md#L1-L28>) 明确说第三方素材的下载来源清单不完整，分类只是根据文件前缀/内嵌元数据做初步判断。因此像 [scallop-eyelet-frame-navy.svg](<design-specs/jirai-kei-theme/assets-redistributable/lace/scallop-eyelet-frame-navy.svg>)、[perforated-dot-strip.svg](<design-specs/jirai-kei-theme/assets-redistributable/pattern/perforated-dot-strip.svg>) 不因放在 `assets-redistributable` 目录就默认可分发。
- [stitch-loop-frame-1.svg](<design-specs/jirai-kei-theme/assets-redistributable/pattern/stitch-loop-frame-1.svg#L17-L63>) 内嵌 CC0 1.0、作者及 Openclipart 来源信息。项目自绘资产按根仓库 GPL-3.0；R5 自绘声明可见 [r5/README.md:1–7](<design-specs/jirai-kei-theme/original-assets/r5/README.md#L1-L7>)。
- 艺术参考图仅用于对布局关系的理解；候选 SVG 未嵌入参考 PNG 或未核实第三方 SVG 的 path。

## 重现

在本工作区运行：

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node design-specs/jirai-kei-theme/runtime/checks/r9-banner-frame-options/render-options.mjs
```

脚本读取 `/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css` 和 `/tmp/jirai-lead-r95c/jirai-kei-theme/theme.css`，然后渲染 1×/2× 两张 board；静态 fixture 中的人物/横幅全为合成占位数据。输出的 SVG 资产位于 [candidates/](<design-specs/jirai-kei-theme/runtime/checks/r9-banner-frame-options/candidates/>)。
