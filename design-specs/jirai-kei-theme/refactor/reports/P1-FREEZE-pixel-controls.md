# P1-FREEZE — pixel-controls

## 范围与判定

只读审计 `theme.css` 中 `/* SECTION pixel-controls */`（第 1325 行）至下一节 `/* SECTION assets-r5 */`（第 1369 行）前的 CSS 规则。选择器显示至多 120 字符；属性名按源码声明列出。分类：A 资源/变量定义冻结；B 纯元素样式进入样式层；C 元素样式含 `url(data:...)`，先抽取资源变量再进入样式层。源文件行号以该预览 CSS 为准。

## A — 纯资源/变量定义：冻结（1 条）

| 行 | 选择器（≤120 字符） | 属性名 | 备注 |
|---|---|---|---|
| 1327 | `:root` | `--pc-up`, `--pc-dn`, `--pc-lt`, `--pc-rt` | 仅定义滚动条方向箭头资源变量；即使值为 data URI，仍属纯变量定义块，冻结。 |

## B — 纯元素样式：进入样式层（24 条）

| 行 | 选择器（≤120 字符） | 属性名 |
|---|---|---|
| 1329 | `[data-slot=switch]` | `width`, `height`, `border`, `border-radius`, `background`, `box-shadow`, `transition` |
| 1330 | `[data-slot=switch][data-size=sm]` | `width`, `height` |
| 1333 | `[data-slot=switch][data-size=sm]::before` | `top`, `right` |
| 1334 | `[data-slot=switch][data-size=sm][data-checked]::before` | `right`, `left` |
| 1337 | `[data-size=sm]>[data-slot=switch-thumb]` | `margin-left` |
| 1338 | `[data-size=sm]>[data-slot=switch-thumb][data-checked]` | `translate` |
| 1339 | `[data-slot=switch][data-disabled]` | `opacity`, `filter` |
| 1340 | `[data-slot=switch]:focus-visible` | `outline`, `outline-offset` |
| 1341 | `@media (prefers-reduced-motion:reduce) { [data-slot=switch-thumb] }` | `transition` |
| 1343 | `*:not(.no-scrollbar,.base-ui-disable-scrollbar)` | `scrollbar-width`, `scrollbar-color` |
| 1344 | `::-webkit-scrollbar` | `width`, `height`, `background` |
| 1345 | `::-webkit-scrollbar-track` | `background`, `box-shadow` |
| 1348 | `::-webkit-scrollbar-thumb:hover` | `background-color` |
| 1349 | `::-webkit-scrollbar-corner` | `background` |
| 1350 | `::-webkit-scrollbar-button` | `display` |
| 1351 | `::-webkit-scrollbar-button:single-button` | `display`, `width`, `height`, `background` |
| 1352 | `::-webkit-scrollbar-button:single-button:vertical:increment` | `background-image` |
| 1353 | `::-webkit-scrollbar-button:single-button:horizontal:decrement` | `background-image` |
| 1354 | `::-webkit-scrollbar-button:single-button:horizontal:increment` | `background-image` |
| 1356 | `[data-slot=scroll-area-scrollbar]` | `border`, `border-radius`, `background`, `box-shadow` |
| 1357 | `[data-slot=scroll-area-scrollbar][data-orientation=vertical]` | `width`, `padding`, `background` |
| 1358 | `[data-slot=scroll-area-scrollbar][data-orientation=horizontal]` | `height`, `padding`, `background` |
| 1361 | `[data-slot=scroll-area-thumb]:hover` | `background-color` |
| 1363 | `[data-slot=progress-track]` | `box-sizing`, `height`, `padding`, `border`, `border-radius`, `background`, `box-shadow` |
| 1365 | `.indeterminate-progress [data-slot=progress-indicator]` | `animation-timing-function` |
| 1366 | `[data-slot=skeleton]` | `animation-timing-function` |
| 1367 | `[data-slot=spinner]` | `animation-timing-function` |

## C — 元素样式内含 data URI：抽取为资源变量（9 条）

以下位置当前把资源直接写在元素声明里。建议按语义命名为 `--jk-asset-pixel-control-…`；抽取时保留原 URI 内容不变，并将原 `url(data:...)` 替换为 `var(--jk-asset-…)`。

| 行 | 选择器（≤120 字符） | 属性名 | 建议变量名 |
|---|---|---|---|
| 1331 | `[data-slot=switch]::before` | `content`, `position`, `top`, `right`, `width`, `height`, `background`, `pointer-events` | `--jk-asset-switch-knob-off-x`（X/关闭态像素图） |
| 1332 | `[data-slot=switch][data-checked]::before` | `right`, `left`, `width`, `background` | `--jk-asset-switch-knob-on-heart`（开启态爱心像素图） |
| 1335 | `[data-slot=switch-thumb]` | `width`, `height`, `margin-left`, `border-radius`, `box-shadow`, `background` | `--jk-asset-switch-thumb-off` |
| 1336 | `[data-slot=switch-thumb][data-checked]` | `background-image` | `--jk-asset-switch-thumb-on-heart` |
| 1346 | `::-webkit-scrollbar-thumb` | `background`, `border`, `border-radius`, `box-shadow` | `--jk-asset-scrollbar-thumb-vertical` |
| 1347 | `::-webkit-scrollbar-thumb:horizontal` | `background-image`, `background-size` | `--jk-asset-scrollbar-thumb-horizontal` |
| 1359 | `[data-slot=scroll-area-thumb]` | `border-radius`, `background`, `border`, `box-shadow` | `--jk-asset-scroll-area-thumb-vertical` |
| 1360 | `[data-orientation=horizontal]>[data-slot=scroll-area-thumb]` | `background-image`, `background-size` | `--jk-asset-scroll-area-thumb-horizontal` |
| 1364 | `[data-slot=progress-indicator]` | `border-radius`, `background` | `--jk-asset-progress-pink-cells` |

> 注：C 表实为 **9 条**（表内 9 行）；上方标题计数应按表格为准。A 一条、B 27 条、C 九条，共 37 条规则。媒体查询内的规则单列计一条；注释不作为 CSS 规则。没有改动 CSS 或其他既有文件。
