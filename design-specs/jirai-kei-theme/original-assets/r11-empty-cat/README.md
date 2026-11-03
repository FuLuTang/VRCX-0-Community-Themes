# r11 空状态小猫（并入 runtime/components/misc.css 的 Empty states 段）

- **来源**：`art-references/nso-steam-ss-04.jpg` 右下角的粉色小猫（《NEEDY STREAMER OVERLOAD》截图）。**不是原创绘制，版权归原作者**；按用户明确要求直接取样，用于用户自用主题。公开发布前需另行评估授权。
- **方法**（`build-cat.mjs`，可重跑）：截图是 960×540 原生画布的 2× 最近邻放大再 JPEG 压缩；裁切框 (1334,688) 116×96，2×2 块取均值还原为原生像素 → 边缘泛洪抠背景 → 只留最大连通块 → 补回额头被泛洪漏掉的缺口 → 24 色量化去 JPEG 噪点 → 按用户要求清掉尾巴下方臀部右侧近 `#f5e2f6` 的浅色三角毛。没有 AI 重绘，也没有模糊缩放。
- **产物**：`art/cat-native.png` 54×45；`art/cat-canvas.png` 66×54（主题内嵌的就是这张，页面级 2×=132×108、面板级 1× 放在 88×72 盒子里）；`art/data-uris.json`。
- **行为**：仅 page / panel 两种空状态显示；table / inline 变体与加载中（spinner）不显示。错误态与空状态共用同一 DOM，CSS 无法区分，出错时也会显示小猫。
- 运行：`node original-assets/r11-empty-cat/build-cat.mjs`（输出到本目录 `art/`）。
