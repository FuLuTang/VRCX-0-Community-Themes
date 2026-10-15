# P1-FREEZE — chrome-r8

只读审计对象：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`（SHA-256 `0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc`，1,044,718 B）。

范围：从 `/* SECTION chrome-r8 */`（第 1631 行）到下一个 `/* SECTION bio-diff-r8 */`（第 1782 行）之前。以下位置均为原文件行号；选择器最多展示前 120 字符。属性按 CSS 声明名列出（自定义属性也计入）。

## 规则清单

| 行 | 类别 | 选择器（前 120 字符） | 属性名 | 备注 |
|---:|:---:|---|---|---|
| 1635 | A | `:root` | `--r8-ink`, `--r8-frame`, `--r8-face`, `--r8-face-hi`, `--r8-face-low`, `--r8-hover`, `--r8-pressed`, `--r8-status-face`, `--r8-lace-fill`, `--r8-lace-tile`, `--r8-close-face`, `--r8-close-ink` | 纯变量定义；`--r8-lace-tile` 当前保存 lace 的 SVG data URI，按 C 项要求应迁移/改名为 `--jk-asset-statusbar-lace-tile`（见下文）。冻结资源内容时保留引用兼容。 |
| 1651 | B | `.vrcx-0-titlebar[data-app-titlebar]` | `background-color`, `color` | 纯元素样式 |
| 1657 | B | `.vrcx-0-titlebar[data-app-titlebar] :is(button, [data-slot='menubar-trigger'])` | `box-sizing`, `border-radius`, `transition` | 纯元素样式 |
| 1664 | B | `.vrcx-0-titlebar[data-app-titlebar] [data-slot='menubar'] [data-slot='menubar-trigger'],`（后续为两个逗号分隔选择器） | `background-color`, `background-image`, `border`, `color`, `box-shadow` | 纯元素样式 |
| 1676 | B | `.vrcx-0-titlebar[data-app-titlebar] button.vrcx-0-toolbar-control[data-vrcx-0-control='toolbar']` | `background-color`, `border-color`, `border-radius`, `color`, `box-shadow` | 纯元素样式 |
| 1686 | B | `.vrcx-0-titlebar[data-app-titlebar] button:not([class~='w-9'][class~='rounded-none'][class~='border-0'])` | `border-radius`, `transition` | 纯元素样式 |
| 1690 | B | `.vrcx-0-titlebar[data-app-titlebar] :is(button, [data-slot='menubar-trigger']):is(:hover, [aria-expanded='true'], [aria-pressed='true'], [data-popup-open])` | `background-color`, `border-color`, `color`, `box-shadow` | 纯元素样式 |
| 1702 | B | `.vrcx-0-titlebar[data-app-titlebar] :is(button, [data-slot='menubar-trigger']):active` | `background-color`, `box-shadow` | 纯元素样式 |
| 1707 | B | `.vrcx-0-titlebar[data-app-titlebar] :is(button, [data-slot='menubar-trigger']):focus-visible` | `outline`, `outline-offset` | 纯元素样式 |
| 1712 | B | `.vrcx-0-titlebar[data-app-titlebar] button[class*='destructive']:is(:hover, :active)` | `background-color`, `border-color`, `color`, `box-shadow` | 纯元素样式 |
| 1722 | B | `.vrcx-0-sidebar-surface [data-sidebar='footer']` | `background-color`, `border`, `border-radius`, `padding-block`, `box-shadow` | 纯元素样式 |
| 1731 | B | `[data-slot='sidebar'][data-state='expanded'] .vrcx-0-sidebar-surface [data-sidebar='footer']` | `box-sizing`, `padding-inline-end` | 纯元素样式 |
| 1737 | B | `.vrcx-0-statusbar[data-vrcx-0-surface='statusbar']` | `background-color`, `border-top-color`, `color` | 纯元素样式 |
| 1742 | B | `.vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] > div[class~='min-h-6'][class~='flex-col']` | `background-color`, `box-shadow` | 纯元素样式 |
| 1748 | B | `.vrcx-0-statusbar[data-vrcx-0-surface='statusbar']::before` | `background-color`, `background-image`, `background-repeat`, `background-position`, `background-size`, `image-rendering`, `-webkit-mask`, `mask` | 元素样式通过 `var(--r8-lace-tile)` 间接使用 data URI；建议引用 `var(--jk-asset-statusbar-lace-tile)`。 |
| 1758 | B | `.vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] :is([class*='text-content-'], [class*='text-muted-foreground'])` | `color` | 纯元素样式 |
| 1765 | B | `.vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] span[class~='size-2'][class~='rounded-full']` | `border-color` | 纯元素样式 |
| 1768 | B | `.vrcx-0-statusbar[data-vrcx-0-surface='statusbar'] :is(button, [data-slot='button']):hover,`（下一行另有 `[aria-expanded='true']` 选择器） | `background-color`, `color` | 纯元素样式 |
| 1775 | B | `@media (prefers-reduced-motion: reduce) → .vrcx-0-titlebar[data-app-titlebar] :is(button, [data-slot='menubar-trigger']),`（同一规则还含 sidebar footer） | `transition` | 媒体查询内纯元素样式 |

## 分类结论与迁移点

- **A（纯资源）**：第 1635 行 `:root`，仅定义自定义属性，应作为资源/令牌块冻结。其 `--r8-lace-tile` 值含一个 SVG `url(data:image/svg+xml;base64,...)`，当前已抽成变量；建议语义名改为 `--jk-asset-statusbar-lace-tile`，并将第 1750 行引用同步改为该变量。迁移位置：定义在第 1645 行，消费在第 1750 行。
- **B（纯元素样式）**：其余 18 条规则（第 1651–1775 行表列各项），进入样式层。
- **C（元素块内直接含 `url(data:...)`）**：未发现直接内联 data URI 的元素样式块。与 C 最接近的是 statusbar `::before` 规则（第 1748 行）：它经变量间接消费已抽离的 URI，因此归类仍为 B；需按上文将变量语义化为 `--jk-asset-statusbar-lace-tile`，不需要把 URI 从该元素块里再提取一次。

