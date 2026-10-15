# P1 Freeze audit — `nav-phone-r10`

## 范围与校验

- 输入：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`
- SHA-256：`0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc`（1,044,718 B）
- 范围：`/* SECTION nav-phone-r10 */`（第 5071 行）至下一 `/* SECTION portal-button-roles-b073-b100 */`（第 5213 行）之前。
- 分类规则：A = 资源/变量定义冻结；B = 元素样式进入样式层；C = 元素样式内联 `url(data:...)`，需迁移成资源变量。

## 规则清单

### A — 纯资源/变量定义，冻结

| 位置 | 选择器（前 120 字符） | 属性名 |
|---|---|---|
| 5078 | `:root` | `--r10-phone-gaze-mid-image`, `--r10-phone-gaze-forward-image`, `--r10-phone-char-back-image`, `--r10-phone-front-image`, `--r10-phone-glow-dim-image`, `--r10-phone-glow-bright-image`, `--r10-phone-canvas-width`, `--r10-phone-canvas-height`, `--r10-phone-char-back-size`, `--r10-phone-char-back-position`, `--r10-phone-front-size`, `--r10-phone-front-rest`, `--r10-phone-front-tap`, `--r10-phone-glow-dim-size`, `--r10-phone-glow-dim-visible`, `--r10-phone-glow-bright-size`, `--r10-phone-glow-bright-visible`, `--r10-phone-glow-off`, `--r10-phone-gaze-mid-size`, `--r10-phone-gaze-mid-on`, `--r10-phone-gaze-mid-off`, `--r10-phone-gaze-forward-size`, `--r10-phone-gaze-forward-on`, `--r10-phone-gaze-forward-off`, `--r10-phone-nav-size`, `--r10-phone-nav-state-stop`, `--r10-phone-nav-state-tap`, `--r10-phone-nav-state-dim`, `--r10-phone-nav-state-bright`, `--r10-phone-nav-state-up`, `--r10-phone-nav-state-look`, `--r10-phone-nav-state-look-bright`, `--r10-phone-nav-state-dim-tap`, `--r10-phone-nav-state-look-dim`, `--r10-phone-nav-state-up-bright`, `--r10-phone-nav-state-bright-tap` |
| 5144 | `@keyframes r10-nav-phone-loop` | `background-position`, `background-size`, `animation-timing-function` (keyframe steps; each frame declares all three) |
| 5203 | `@keyframes r10-nav-phone-float` | `transform` |

`@keyframes r10-nav-phone-loop` 内的选择器（每条规则均含 `background-position`, `background-size`, `animation-timing-function`）：`0%`, `5.22875817%`, `5.882352941%`, `6.535947712%`, `7.189542484%`, `10.45751634%`, `11.764705882%`, `12.418300654%`, `14.379084967%`, `17.647058824%`, `18.954248366%`, `22.222222222%`, `22.875816993%`, `25.490196078%`, `26.14379085%`, `29.411764706%`, `30.065359477%`, `31.37254902%`, `32.026143791%`, `35.294117647%`, `35.947712418%`, `38.562091503%`, `39.869281046%`, `40.522875817%`, `41.830065359%`, `42.483660131%`, `46.405228758%`, `47.058823529%`, `47.712418301%`, `48.366013072%`, `52.941176471%`, `54.248366013%`, `56.862745098%`, `60.784313725%`, `64.052287582%`, `68.62745098%`, `69.281045752%`, `69.934640523%`, `70.588235294%`, `75.816993464%`, `76.470588235%`, `81.045751634%`, `81.699346405%`, `82.352941176%`, `83.006535948%`, `84.967320261%`, `85.620915033%`, `88.235294118%`, `88.888888889%`, `91.503267974%`, `92.810457516%`, `93.464052288%`, `96.732026144%`, `97.385620915%`, `100%`。

`@keyframes r10-nav-phone-float` 内部规则：`0%, 100%`（`transform`）；`50%`（`transform`）。

### B — 纯元素样式，进入样式层

| 位置 | 选择器（前 120 字符） | 属性名 |
|---|---|---|
| 5121 | `[data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]` | `position` |
| 5122 | `[data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]::after` | `content`, `display`, `position`, `top`, `right`, `width`, `height`, `background-image`, `background-size`, `background-position`, `background-repeat`, `image-rendering`, `pointer-events`, `animation` |
| 5208 | `@media (prefers-reduced-motion: reduce) { [data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]::after` | `animation`, `background-position` |
| 5211 | `html.reduce-effects [data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]::after` | `animation`, `background-position` |

### C — 元素样式内含 data URI，需迁移

无。六个 `url(data:image/png;base64,...)` 均位于第 5078 行 `:root` 纯变量定义块，归 A 冻结；它们已有语义变量名（`--r10-phone-gaze-mid-image`、`--r10-phone-gaze-forward-image`、`--r10-phone-char-back-image`、`--r10-phone-front-image`、`--r10-phone-glow-dim-image`、`--r10-phone-glow-bright-image`），没有需迁移的元素样式 URL，也无需另提建议变量名。

## 结论

冻结资源变量和两组动画定义；将 4 条元素样式规则抽入样式层。C 类为零，data URI 不需搬迁。
