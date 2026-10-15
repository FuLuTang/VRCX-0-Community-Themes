# P1 Freeze audit — `loader-r9`

只读审计对象：[`theme.css`](../../runtime/preview-package/jirai-kei-theme/theme.css)，SHA-256 `0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc`，1,044,718 B。按 `/* SECTION ` 分段，范围为 `/* SECTION loader-r9 */`（第 3139 行）至下一段 `/* SECTION form-controls-r9 */`（第 3206 行）之前。下面行号均为原文件行号。选择器最多展示前 120 字符。

## 规则清单

| 行 | 选择器（前 120 字符） | 属性名 | 分类 |
|---|---|---|---|
| 3145–3151 | `:root` | `--jk-loader-sheet`, `--jk-loader-frame-w`, `--jk-loader-frame-h`, `--jk-loader-frames`, `--jk-loader-duration` | **A — 纯资源/变量定义，应冻结**。其中 `--jk-loader-sheet` 含内联 PNG data URI；此处是纯变量定义块，不是元素样式规则。 |
| 3153–3156 | `@keyframes jk-loader-dance` → `from` | `background-position` | **A — 纯资源/动画定义，应冻结**。 |
| 3153–3156 | `@keyframes jk-loader-dance` → `to` | `background-position` | **A — 纯资源/动画定义，应冻结**。 |
| 3162–3165 | `.vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"])` | `flex-direction`, `gap` | **B — 纯元素样式，进样式层**。 |
| 3166–3190 | `.vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) > svg[data-slot="spinner"]` | `display`, `flex`, `width`, `height`, `margin`, `padding`, `background-image`, `background-repeat`, `background-position`, `background-size`, `image-rendering`, `animation`, `transform`, `rotate`, `color`, `background-color`, `-webkit-mask`, `mask` | **B — 纯元素样式，进样式层**。背景资源通过变量引用 `var(--jk-loader-sheet)`，本规则中没有 `url(data:...)`。 |
| 3191–3193 | `.vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) > svg[data-slot="spinner"] > *` | `display` | **B — 纯元素样式，进样式层**。 |
| 3196–3199 | `@media (prefers-reduced-motion: reduce)` 内：`.vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) > svg[data-slot="spinner"]` | `animation`, `background-position` | **B — 纯元素样式，进样式层**（媒体条件下的元素规则）。 |
| 3201–3204 | `html.reduce-effects .vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) > svg[data-slot="spinner"]` | `animation`, `background-position` | **B — 纯元素样式，进样式层**。 |

## C 类 data URI 迁移

本段没有 **C 类**规则：元素样式块不含 `url(data:...)`。唯一 data URI 位于第 3146 行 `:root` 的 `--jk-loader-sheet` 变量定义中，属于 A 类纯变量资源定义，按要求冻结；无需另迁移或建议新变量名。样式层的 spinner 规则只引用 `var(--jk-loader-sheet)`。
