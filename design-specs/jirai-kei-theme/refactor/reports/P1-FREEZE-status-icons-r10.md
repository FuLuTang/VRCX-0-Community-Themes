# P1 冻结审计：status-icons-r10

来源：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`，SECTION 行 4961–5069（至下一 `/* SECTION nav-phone-r10 */` 前）。规则按源码顺序列出；选择器最多取前 120 字符。属性名按 CSS 声明列出（简写属性按其源码属性名记录）。

| 行 | 选择器（前 120 字符） | 属性名 | 分类 |
|---:|---|---|---|
| 4963–4966 | `:root` | `--r10-toast-success-face-png`, `--r10-toast-error-face-png` | A — 纯变量定义（冻结） |
| 4967–4970 | `:root` | `--r10-toast-success-ring-png`, `--r10-toast-error-ring-png` | A — 纯变量定义（冻结） |
| 4971–4985 | `[data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"], [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]` | `box-sizing`, `display`, `flex`, `width`, `min-width`, `position`, `background-image` | B — 纯元素样式 |
| 4988–4994 | `[data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::before, [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::before` | `content`, `position`, `left`, `top`, `width`, `height`, `margin`, `background-repeat`, `background-position`, `background-size`, `image-rendering`, `pointer-events` | B — 纯元素样式 |
| 4998–5000 | `[data-slot="toast-viewport"] [data-slot="toast-content"]` | `overflow` | B — 纯元素样式 |
| 5001–5004 | `[data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::before, [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::before` | `background-size`, `image-rendering` | B — 纯元素样式 |
| 5005 | `[data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::before` | `background-image` | B — 纯元素样式（使用变量，无内嵌 data URI） |
| 5006 | `[data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::before` | `background-image` | B — 纯元素样式（使用变量，无内嵌 data URI） |
| 5007–5011 | `[data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::after, [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::after` | `content`, `position`, `left`, `top`, `width`, `height`, `margin`, `background-position`, `background-repeat`, `background-size`, `image-rendering`, `pointer-events` | B — 纯元素样式 |
| 5012 | `[data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::after` | `background-image` | B — 纯元素样式（使用变量，无内嵌 data URI） |
| 5013 | `[data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::after` | `background-image` | B — 纯元素样式（使用变量，无内嵌 data URI） |
| 5014–5015 | `[data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"] > svg, [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"] > svg` | `opacity` | B — 纯元素样式 |
| 5019–5022 | `:root` | `--r10-toast-shock-png`, `--r10-toast-shock-ring-mask` | A — 纯变量定义（冻结） |
| 5023–5028 | `[data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"], [data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]` | `box-sizing`, `display`, `flex`, `width`, `min-width`, `position`, `background-image` | B — 纯元素样式 |
| 5029–5038 | `[data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"]::before, [data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]::before` | `content`, `position`, `left`, `top`, `width`, `height`, `margin`, `pointer-events` | B — 纯元素样式 |
| 5039–5046 | `[data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"]::after, [data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]::after` | `content`, `position`, `left`, `top`, `width`, `height`, `margin`, `background`, `image-rendering`, `pointer-events` | B — 纯元素样式（`background` 引用变量） |
| 5047–5048 | `[data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"] > svg, [data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"] > svg` | `opacity` | B — 纯元素样式 |
| 5052–5055 | `:root` | `--r10-toast-info-ring-png`, `--r10-toast-warning-ring-png` | A — 纯变量定义（冻结） |
| 5056–5062 | `[data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"]::before` | `-webkit-mask`, `mask`, `background-color`, `background-image`, `background-position`, `background-repeat`, `background-size`, `image-rendering` | B — 纯元素样式（使用变量，无内嵌 data URI） |
| 5063–5069 | `[data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]::before` | `-webkit-mask`, `mask`, `background-color`, `background-image`, `background-position`, `background-repeat`, `background-size`, `image-rendering` | B — 纯元素样式（使用变量，无内嵌 data URI） |

## 结论

共 20 条规则：A 4 条（4 个 `:root` 变量块，包含六个 data URI 资源定义），B 16 条，C 0 条。data URI 仅位于纯变量定义块，没有出现在元素样式声明中，因此无需新增 `--jk-asset-<语义名>` 变量；本段没有 `@font-face` 或 `@keyframes`。
