# P1 Freeze audit — `settings` section

- Source: `design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`
- SHA-256: `0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc` (1,044,718 bytes)
- Scope: bytes from `/* SECTION settings */` at line 1240 up to, but excluding, `/* SECTION pixel-controls */` at line 1325.
- Inventory: 35 CSS rules (comments omitted). Selector excerpts are capped at the first 120 characters; line numbers refer to the source.

Classification: **A** freeze as pure resources; **B** move to style layer as element styling; **C** element styling contains inline `url(data:...)`, requiring extraction to an asset variable.

| # | Line | Class | Selector (first ≤120 chars) | Property names |
|---:|---:|:---:|---|---|
| 1 | 1255 | A | `:root` | `--jk-px-cut` |
| 2 | 1267 | B | `[data-slot=number-field-group]` | `border`, `border-radius`, `background-color`, `box-shadow`, `clip-path` |
| 3 | 1268 | B | `[data-slot=number-field-group]:focus-within` | `outline`, `outline-offset` |
| 4 | 1269 | B | `[data-slot=number-field-decrement]:focus-visible,[data-slot=number-field-increment]:focus-visible` | `outline`, `outline-offset` |
| 5 | 1270 | B | `[data-slot=number-field-input]` | `height`, `line-height`, `padding`, `background-color`, `color`, `font-size` |
| 6 | 1271 | B | `[data-slot=number-field-decrement],[data-slot=number-field-increment]` | `width`, `height`, `padding`, `border`, `border-radius`, `background-color`, `color`, `box-shadow` |
| 7 | 1272 | B | `[data-slot=number-field-decrement]:hover,[data-slot=number-field-increment]:hover` | `background-color` |
| 8 | 1273 | B | `[data-slot=number-field-decrement]:active,[data-slot=number-field-increment]:active` | `box-shadow` |
| 9 | 1274 | B | `[data-slot=number-field-decrement] > svg,[data-slot=number-field-increment] > svg` | `display` |
| 10 | 1275 | C | `[data-slot=number-field-decrement]::before,[data-slot=number-field-increment]::before` | `content`, `position`, `width`, `height`, `background-color`, `pointer-events`, `mask` |
| 11 | 1276 | C | `[data-slot=number-field-increment]::before` | `mask-image` |
| 12 | 1286 | B | `[data-slot=toggle-group][data-variant=outline]` | `border`, `border-radius`, `background-color`, `gap`, `clip-path` |
| 13 | 1287 | B | `[data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger])` | `border`, `border-radius`, `background-color`, `color`, `box-shadow` |
| 14 | 1288 | B | `[data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger])::before` | `border-radius` |
| 15 | 1289 | B | `[data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger]):hover` | `background-color`, `color`, `box-shadow` |
| 16 | 1290 | B | `[data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger])[data-pressed]` | `background-color`, `color`, `box-shadow` |
| 17 | 1291 | B | `[data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger]):focus-visible` | `outline`, `outline-offset` |
| 18 | 1292 | B | `[data-slot=toggle-group][data-variant=outline] > [data-slot=separator]` | `width`, `background-color` |
| 19 | 1293 | B | `[data-slot=toggle-group][data-variant=outline] > [data-slot=separator]::before` | `display` |
| 20 | 1298 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list]` | `position`, `padding`, `gap`, `border`, `border-radius`, `background-color`, `box-shadow`, `clip-path` |
| 21 | 1300 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list]::after` | `content`, `position`, `left`, `right`, `bottom`, `height`, `background-color`, `pointer-events`, `mask` |
| 22 | 1303 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tab-indicator]` | `display` |
| 23 | 1304 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab]` | `border`, `border-radius`, `background-color`, `color`, `box-shadow` |
| 24 | 1305 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab] .lucide` | `color`, `opacity` |
| 25 | 1306 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab]:hover` | `background-color`, `border-color`, `color` |
| 26 | 1307 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab][data-active]` | `background-color`, `border-color`, `color`, `box-shadow` |
| 27 | 1308 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab]:focus-visible` | `outline`, `outline-offset` |
| 28 | 1309 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab][data-active]:focus-visible` | `outline-color` |
| 29 | 1315 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card]` | `border`, `border-radius`, `background-color`, `box-shadow`, `clip-path` |
| 30 | 1316 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header]` | `background-color`, `border-bottom`, `box-shadow` |
| 31 | 1317 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-content]` | `border-radius` |
| 32 | 1318 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger]` | `position`, `padding-left`, `padding-right`, `border-radius`, `color` |
| 33 | 1319 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger]:hover` | `background-color` |
| 34 | 1321 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger]::before` | `content`, `position`, `left`, `top`, `width`, `height`, `background-color`, `pointer-events`, `mask` |
| 35 | 1323 | B | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger]::after` | `content`, `position`, `left`, `right`, `bottom`, `height`, `background-color`, `pointer-events`, `mask` |

## C 类 data URI 抽取清单

| 源位置 | 声明/用途 | 建议变量 |
|---|---|---|
| `theme.css:1275` | `mask`，stepper decrement/minus 的 8×8 像素横杠 SVG；应用于 decrement 与 increment 伪元素的默认图案 | `--jk-asset-number-stepper-minus` |
| `theme.css:1276` | `mask-image`，stepper increment/plus 的 8×8 像素加号 SVG | `--jk-asset-number-stepper-plus` |

建议将上述变量定义在资源变量层（如 `:root`）并令 `mask` / `mask-image` 引用变量。A 类目前仅发现第 1 条：该变量定义块冻结；其余 B 类均为纯元素规则，应进入样式层。C 类从元素样式拆出 URI 后，其余声明也进入样式层。
