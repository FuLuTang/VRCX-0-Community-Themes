# P2B-2：Keyframes 冻结提取报告

源 artifact：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`。按提取脚本的 SECTION/原始字节切分原则逐个截取完整 keyframes 块，保持块内原文不变，按出现顺序排列。

## 全量扫描与对照

扫描共 **16** 个定义；预期清单 16 个。预期但不存在：无。名单外定义：无。

| 动画名 | 原 SECTION | 原 artifact 行号范围 | 字节数 | 抽取后 07 文件行号范围 |
|---|---|---:|---:|---:|
| `r5-charm-swing` | `motion` | 1404–1404 | 64 | 1–1 |
| `r5-dialog-step-in` | `motion` | 1405–1405 | 46 | 2–2 |
| `r5-spinner-step` | `motion` | 1406–1406 | 60 | 3–3 |
| `r5-progress-flow` | `motion` | 1407–1407 | 65 | 4–4 |
| `r7-tab-edge` | `motion-r7` | 1575–1576 | 76 | 5–6 |
| `r8-lace-flow` | `motion-r8` | 1838–1839 | 67 | 7–8 |
| `r8-nav-cursor` | `motion-r8` | 1842–1843 | 65 | 9–10 |
| `r8-window-press` | `motion-r8` | 1846–1847 | 88 | 11–12 |
| `r8-cat-hop` | `motion-r8` | 1850–1851 | 88 | 13–14 |
| `r9-notification-badge-flash` | `badge-r9` | 2353–2359 | 179 | 15–21 |
| `jk-loader-dance` | `loader-r9` | 3153–3154 | 65 | 22–23 |
| `r97-brand-heart-pixels` | `brand-heart-r97` | 4807–4808 | 140 | 24–25 |
| `r96-nav-cat` | `cat-motion-r96` | 4827–4828 | 65 | 26–27 |
| `r96-social-cat` | `cat-motion-r96` | 4837–4838 | 114 | 28–29 |
| `r10-nav-phone-loop` | `nav-phone-r10` | 5144–5145 | 180 | 30–31 |
| `r10-nav-phone-float` | `nav-phone-r10` | 5203–5204 | 73 | 32–33 |

## 逐字节校验

源片段按原顺序以单个 LF 连接后与目标文件比较：**逐字节相同**。源拼接 1450 bytes，SHA-256 `b3537f6713eeb613c962684e5e2656418b7a7a19d698d0be14c4d49152ee463d`；目标 1450 bytes，SHA-256 `b3537f6713eeb613c962684e5e2656418b7a7a19d698d0be14c4d49152ee463d`。

## Reduced-motion 覆盖排除

确认仅截取完整 `@keyframes` 块，没有抽取 `@media (prefers-reduced-motion: reduce)` 或 `html.reduce-effects` 的元素覆盖；这些覆盖归样式层。未抽取的覆盖点（按涉及本次动画定义的规则核查；media 条件行与声明行可能分开）：
- `motion`：第 1429–1430 行，`@media(prefers-reduced-motion:reduce)` 下的元素 animation 覆盖。
- `motion-r7`：第 1596–1597 行，`@media(prefers-reduced-motion:reduce)` 下的 tabs 覆盖。
- `motion-r8`：第 1901–1902、1914–1915 行，`@media (prefers-reduced-motion: reduce)` 下的元素动画覆盖。
- `badge-r9`：第 2410–2411、2417–2418、2422–2423、2432–2433 行，reduced-motion / `html.reduce-effects` 元素覆盖。
- `loader-r9`：第 3196–3197、3201–3202 行，reduced-motion / `html.reduce-effects` loader 覆盖。
- `brand-heart-r97`：第 4819–4822 行，reduced-motion / `html.reduce-effects` 心形覆盖。
- `cat-motion-r96`：第 4847–4850 行，reduced-motion / `html.reduce-effects` 猫咪覆盖。
- `nav-phone-r10`：第 5208–5211 行，reduced-motion / `html.reduce-effects` 手机导航覆盖。
这些都是元素规则覆盖，不是 `@keyframes` 定义；均留在样式层。

## 动画引用点

### `r5-charm-swing`
- motion：第 1418 行（animation）

### `r5-dialog-step-in`
- motion：第 1423 行（animation）

### `r5-spinner-step`
- motion：第 1422 行（animation）
- form-controls-r9：第 3338 行（animation）

### `r5-progress-flow`
- motion：第 1421 行（animation）

### `r7-tab-edge`
- motion-r7：第 1592 行（animation）

### `r8-lace-flow`
- motion-r8：第 1858 行（animation）

### `r8-nav-cursor`
- motion-r8：第 1876 行（animation）

### `r8-window-press`
- motion-r8：第 1896 行（animation）

### `r8-cat-hop`
- motion-r8：第 1907 行（animation）

### `r9-notification-badge-flash`
- badge-r9：第 2403 行（animation）

### `jk-loader-dance`
- loader-r9：第 3180 行（animation）

### `r97-brand-heart-pixels`
- brand-heart-r97：第 4817 行（animation）

### `r96-nav-cat`
- cat-motion-r96：第 4845 行（animation）

### `r96-social-cat`
- cat-motion-r96：第 4846 行（animation）

### `r10-nav-phone-loop`
- nav-phone-r10：第 5140 行（animation）

### `r10-nav-phone-float`
- nav-phone-r10：第 5141 行（animation）
