# P1 冻结审查：`user-dialog-r9`

- 源文件：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`
- SHA-256：`0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc`
- 分段：从 `/* SECTION user-dialog-r9 */`（第 2287 行）起，至下一段 `/* SECTION badge-r9 */`（第 2350 行）前止。
- 规则数：10。选择器摘录最长 120 字符；属性名按 CSS 声明列出（含自定义属性）。

## 逐规则清单

| # | 行 | 分类 | 选择器（最多 120 字符） | 属性名 |
|---:|---:|:---:|---|---|
| 1 | 2289 | B | `.entity-dialog [data-slot="card-header"] > div.relative > div.absolute.bottom-3.left-3.z-30.size-16 > button[data-slot="button"]` | `border-radius`, `clip-path`, `background-color`, `box-shadow` |
| 2 | 2295 | B | `.entity-dialog [data-slot="card-header"] > div.relative > div.absolute.bottom-3.left-3.z-30.size-16 > button[data-slot="button"] > img` | `border-radius`, `clip-path` |
| 3 | 2302 | B | `.entity-dialog .flex.flex-wrap.gap-1\\.5 > [data-slot="button"][data-variant="ghost"][data-size="icon-xs"][title]` | `border`, `border-radius`, `background`, `color`, `box-shadow`, `cursor`, `transition` |
| 4 | 2307 | B | `.entity-dialog .flex.flex-wrap.gap-1\\.5 > [data-slot="button"][data-variant="ghost"][data-size="icon-xs"][title]:hover:not(:disabled)` | `background`, `color` |
| 5 | 2308 | B | `.entity-dialog .flex.flex-wrap.gap-1\\.5 > [data-slot="button"][data-variant="ghost"][data-size="icon-xs"][title]:active:not(:disabled)` | `box-shadow`, `transform` |
| 6 | 2309 | B | `.entity-dialog .flex.flex-wrap.gap-1\\.5 > [data-slot="button"][data-variant="ghost"][data-size="icon-xs"][title]:focus-visible` | `outline`, `outline-offset` |
| 7 | 2312 | A | `.entity-dialog` | `--r9-banner-stitch-opacity`, `--r9-banner-stitch-size`, `--r9-banner-hem-height`, `--r9-banner-hem-opacity`, `--r9-banner-hem-size` |
| 8 | 2319 | B | `.entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::before` | `opacity`, `-webkit-mask-size`, `mask-size` |
| 9 | 2324 | B | `.entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::after` | `height`, `opacity`, `-webkit-mask-size`, `mask-size` |
| 10 | 2333 | C | `.entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"] > span.relative.size-full::after` | `content`, `position`, `right`, `bottom`, `left`, `z-index`, `height`, `pointer-events`, `opacity`, `background-image`, `background-repeat`, `background-position`, `background-size`, `image-rendering` |

## 分类与处置

- **A（冻结）**：第 2312 行 `.entity-dialog` 仅定义 R9 banner 的 5 个自定义属性，无其他声明；作为变量定义块冻结。
- **B（进入样式层）**：第 2289、2295、2302、2307、2308、2309、2319、2324 行，共 8 条纯元素/伪元素样式规则，不含 `url(data:...)`。
- **C（资源变量化）**：第 2333 行伪元素规则含 data URI。将其 data URI 抽取为语义变量，例如 `--jk-asset-user-dialog-banner-hem-lace`，并将 `background-image` 改为 `var(--jk-asset-user-dialog-banner-hem-lace)`。
  - 确切位置：第 **2343 行** `background-image: url("data:image/svg+xml,...")`（位于第 2333 行选择器块内）。建议变量值为该完整 `url("data:image/svg+xml,...")`，在资产定义层登记；本任务只列建议，不修改源 CSS。

## 结论

本段应冻结 1 条变量定义块；8 条规则可进入样式层；1 条含 data URI 的规则进入样式层前需先抽取资源变量。