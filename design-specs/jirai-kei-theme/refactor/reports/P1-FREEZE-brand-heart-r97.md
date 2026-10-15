# P1 冻结审查：brand-heart-r97

范围：`theme.css` 的 `/* SECTION brand-heart-r97 */`（第 4796 行）至下一段 `/* SECTION cat-motion-r96 */`（第 4824 行）之前。以下位置按原文件行号。

| 行 | 选择器（前 120 字符） | 属性名列表 | 分类 |
|---|---|---|---|
| 4806 | `.vrcx-0-titlebar[data-app-titlebar]` | `--jk-r97-heart-s`, `--jk-r97-heart-m`, `--jk-r97-heart-l` | A — 仅定义资源变量，冻结 |
| 4807–4811 | `@keyframes r97-brand-heart-pixels` | `background-image`, `background-size`, `background-position`（关键帧声明） | A — keyframes，冻结 |
| 4812–4818 | `.vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after` | `top`, `right`, `width`, `height`, `transform`, `-webkit-mask`, `mask`, `background-color`, `background-image`, `background-position`, `background-repeat`, `background-size`, `image-rendering`, `animation` | B — 纯元素样式，进入样式层 |
| 4819–4821 | `@media (prefers-reduced-motion:reduce)` | （媒体规则容器；内含下列元素规则） | B — 容器本身无声明 |
| 4820 | `.vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after` | `animation`, `background-image`, `background-size`, `background-position` | B — 纯元素样式，进入样式层 |
| 4822 | `html.reduce-effects .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after` | `animation`, `background-image`, `background-size`, `background-position` | B — 纯元素样式，进入样式层 |

## C 类 / data URI 检查

本段没有 C 类规则：没有任何元素样式规则直接包含 `url(data:...)`。三个 data URI 都已置于第 4806 行的资源变量定义块中，因此该块按 A 冻结，无需迁移或新增变量。现有语义变量名已经明确为 `--jk-r97-heart-s`、`--jk-r97-heart-m`、`--jk-r97-heart-l`，分别对应小、中、大心形帧；如果后续发现元素样式内嵌 URI，应按资源语义沿用这组 `--jk-asset-*` 命名形式，将 URI 移入专门的资源变量块。
