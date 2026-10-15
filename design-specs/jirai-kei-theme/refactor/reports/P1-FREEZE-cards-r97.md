# P1 冻结清单：cards-r97

只读审计；未修改 CSS、未 commit、未连接 CDP。

- 输入：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`
- SHA-256：`0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc`（1,044,718 B，与指定值一致）
- 范围：`/* SECTION cards-r97 */`（第 4883 行）起，至下一个 `/* SECTION splitter-r97 */`（第 4915 行）前。
- 规则共 15 条：A 1 条，B 14 条，C 0 条。

属性名列表按声明出现顺序去重；自定义属性也按属性名列出。选择器均为原文开头最多 120 字符，超长处以 `…` 表示。

| #（CSS 行） | 分类 | 选择器前 120 字符 | 属性名列表 |
|---|---|---|---|
| 1（4889） | A — 纯资源/变量定义，冻结 | `:root` | `--jk-r97-card-charm`, `--jk-r97-lace-px`, `--jk-r97-lace`, `--jk-r97-lace-cut` |
| 2（4896） | B — 纯元素样式，进样式层 | `:is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),.vrcx-0-main-content>[id=chart] [data-slot=tabs][data-orientation=vertical]:has(+div [data-tools-section]))>[data-slot=tabs-list]` | `clip-path` |
| 3（4897） | B — 纯元素样式，进样式层 | `:is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),.vrcx-0-main-content>[id=chart] [data-slot=tabs][data-orientation=vertical]:has(+div [data-tools-section]))>[data-slot=tabs-list]::after` | `content`, `position`, `left`, `right`, `top`, `bottom`, `height`, `background-color`, `pointer-events`, `mask` |
| 4（4899） | B — 纯元素样式，进样式层 | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical])>[data-slot=tabs-list]` | `padding-bottom` |
| 5（4901） | B — 纯元素样式，进样式层 | `[data-tools-section] [data-slot=card]` | `position`, `border-radius`, `background-color`, `box-shadow`, `clip-path` |
| 6（4902） | B — 纯元素样式，进样式层 | `[data-tools-section] [data-slot=card]::after` | `content`, `position`, `inset`, `z-index`, `border`, `pointer-events` |
| 7（4903） | B — 纯元素样式，进样式层 | `[data-tools-section] [data-slot=card-header]` | `background-color`, `border-bottom`, `box-shadow` |
| 8（4904） | B — 纯元素样式，进样式层 | `[data-tools-section] [data-slot=card-content]` | `border-radius` |
| 9（4905） | B — 纯元素样式，进样式层 | `[data-tools-section] [data-slot=card-content] .rounded-b-xl` | `border-radius` |
| 10（4906） | B — 纯元素样式，进样式层 | `[data-tools-section] [data-slot=card-header] [data-slot=collapsible-trigger]` | `position`, `padding-left`, `padding-right`, `border-radius`, `color` |
| 11（4907） | B — 纯元素样式，进样式层 | `[data-tools-section] [data-slot=card-header] [data-slot=collapsible-trigger]:hover` | `background-color` |
| 12（4909） | B — 纯元素样式，进样式层 | `:is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),[data-tools-section]) [data-slot=card-header] [data-slot=collapsible-trigger]::before` | `content`, `position`, `left`, `top`, `width`, `height`, `pointer-events`, `mask`, `background`, `image-rendering` |
| 13（4911） | B — 纯元素样式，进样式层 | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]) [data-slot=card-header] [data-slot=collapsible-trigger]::after` | `content` |
| 14（4912） | B — 纯元素样式，进样式层 | `:is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),[data-tools-section]) [data-slot=card-header]` | `position`, `z-index` |
| 15（4913） | B — 纯元素样式，进样式层 | `:is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),[data-tools-section]) [data-slot=card-header]::after` | `content`, `position`, `left`, `right`, `top`, `height`, `background-color`, `pointer-events`, `mask` |

## C 类 data URI 搬迁项

无。此段的两条 data URI 都是 `:root` 中只定义自定义属性的资源声明（第 4890–4891 行），归 A 类整体冻结；样式规则仅通过 `var(--jk-r97-card-charm)` / `var(--jk-r97-lace)` 引用它们，没有元素样式内嵌 data URI。因此无需提出新增 `--jk-asset-*` 变量名。

> 更正：上表规则编号是 CSS 行号索引，实际规则数量为 15 条：A 1 条、B 14 条、C 0 条。
