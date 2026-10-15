# P1-FREEZE — `banner-frame-r96`

只读盘点；来源：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`，目标段从 `/* SECTION banner-frame-r96 */` 到下一 SECTION 前（源码约第 4733–4738 行）。

> 说明：原文件单行含长 data URI，读取展示可能截断；以下按 CSS 声明边界列出属性。选择器列按要求最多展示前 120 字符，省略处以 `…` 标记。

| # | 源码行 | 选择器（前 120 字符） | 属性名 | 分类 |
|---|---:|---|---|---|
| 1 | 4734 | `.entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)` | `--r9-banner-stitch-opacity`, `--r9-banner-hem-opacity`, `--r96-banner-frame-image` | **A — 纯资源/变量定义，冻结** |
| 2 | 4735 | `.entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)::before` | `content`, `position`, `inset`, `z-index`, `pointer-events`, `background`, `image-rendering` | **B — 纯元素样式，进样式层** |
| 3 | 4736 | `.entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)>[data-slot="button"][class*="aspect-[4/3]"]::before` | `z-index`, `background-color` | **B — 纯元素样式，进样式层** |
| 4 | 4737 | `.entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)>[data-slot="button"][class*="aspect-[4/3]"]::after` | `z-index`, `background-color` | **B — 纯元素样式，进样式层** |
| 5 | 4738 | `.entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)>[data-slot="button"][class*="aspect-[4/3]"]>span.relative.size-full::after` | `z-index` | **B — 纯元素样式，进样式层** |

## C 类 data URI 迁移点

**无。** 唯一的 `url(data:...)` 位于规则 #1 的自定义属性 `--r96-banner-frame-image`。该块只定义自定义属性（资源与参数），没有直接应用元素绘制属性，按 A 类“只为定义变量的块”冻结；规则 #2 的 `background` 只引用该变量，不含内联 data URI。因此本段不产生 C 类规则，也无需提出新的 `--jk-asset-<语义名>` 名称。
