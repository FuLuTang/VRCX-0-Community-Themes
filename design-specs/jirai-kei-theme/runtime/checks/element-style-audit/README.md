# element-style-audit — 元素 × 上下文 样式覆盖检查

对“原语（range/slider/checkbox/switch/radio/input/select/button/badge/tabs/toggle/progress/kbd）× 上下文
（main-content / main-toolbar / main-card-sm / side-panel / settings-vertical-tabs / entity-dialog / dialog /
popover / menu-popup / graph-floating-controls / login-page / privacy-lock / toast / app-chrome）”逐格判断：主题是否真的画到了它。
起因：`form-controls-r9.css` 的规则全部带 `:not(.entity-dialog *)`，而 entity-dialog 的替代规则
`user-dialog-r8.css` 把选择器写窄成 `.accent-primary.min-w-16.flex-1`，状态分布滑块（`.accent-primary.w-28`）
两边都没命中，掉进排除缝隙。

## 运行

```sh
cd runtime
# 1) 隔离构建（不要写默认 runtime/preview-package，不改 build-runtime.mjs）
JIRAI_OUT=/tmp/jirai-elem-audit/jirai-kei-theme PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers \
  SHARP_MODULE=/tmp/dsh-theme-tools/node_modules/sharp node build-runtime.mjs
# 2) 审计（等价于 audit.mjs --build 的第 1 步）
cd checks/element-style-audit
node audit.mjs                                   # 全部原语 -> table.md / table.json / shots/*.png
node audit.mjs --prims native-range,base-slider  # 只跑部分原语
node audit.mjs --revert-r8-slider --tag before-fix --prims native-range,base-slider
                                                 # 把 user-dialog-r8 段的滑条选择器还原成修复前窄链 -> table.before-fix.*
node audit-all-elements.mjs                    # 全 JSX/TSX 样式站点、同选择器重复、重叠/多风格候选
```
环境变量：`JIRAI_OUT`（主题构建目录，默认 `/tmp/jirai-elem-audit/jirai-kei-theme`）、`AUDIT_SRC`
（默认 `/tmp/vrcx-win-src-r9/src`）、`AUDIT_APP_DIST`（默认主应用 `dist/assets`，读 `index-*.css`/`App-*.css`）、
`PLAYWRIGHT_BROWSERS_PATH`（默认 `/tmp/dsh-theme-browsers`）。脚本只写自己目录，不改任何 CSS/源码。

## 视觉等价性与夹具说明
- `button.<tag>.png` 是 Playwright 无头浏览器从内存 HTML 夹具截取的 **14 上下文矩阵**，不是产品的单一路由或可访问 URL。夹具上下文见 `primitives.mjs` 的 `CONTEXTS`；装配与截图位置见 `audit.mjs` 的 `buildPage()` / screenshot 段。
- `verify-css-consolidation.mjs <before.css> <after.css> <comparison.png>` 对代表性的 chrome、导航、字段、横幅和 toast DOM 同时比对宿主与 `::before`/`::after` 计算样式，并生成前后并排 PNG、报告像素差异。只有遮罩图像为 `none` 时才忽略失活的 mask 尺寸字段；屏幕像素仍逐字节比较。
- `button-gallery.html` 是可直接通过 `file://` 打开的 Button 浏览器图库；14 个上下文框纵向排列，框内按钮桌面/平板三列、窄屏两列；样本仍为唯一 `B001`–`B123`。每个上下文框内部按 JCSS 声明代码组集合分成子框：集合合并源码点静态候选与 Chromium 在真实上下文夹具中实际匹配到的基态 Jirai CSS 规则，因此依赖祖先上下文的规则（如按钮 bevel）也会参与分组；未命中项归入“未覆盖”，筛选仍可搜编号、variant、size、context 或 JCSS 编号。页首显示全主题唯一声明代码数及 Button 代码组/组合数。源码或主题 CSS 改动后先运行 `node audit-all-elements.mjs`，再运行 `node generate-button-gallery.mjs`；生成脚本使用 `AUDIT_PLAYWRIGHT`（默认 `/tmp/dsh-theme-tools/node_modules/playwright/index.mjs`）和 `PLAYWRIGHT_BROWSERS_PATH`（默认 `/tmp/dsh-theme-browsers`）。仅应用重建更换 CSS 哈希时只需重跑生成脚本更新链接。图库按顺序外链 `dist/assets/index-*.css`、`App-*.css` 和 `runtime/preview-package/jirai-kei-theme/theme.css`，无需额外服务器。

## 文件
- `audit.mjs` 主流程（夹具装配、浏览器内分析、矩阵/缝隙输出）
- `scan.mjs` 静态扫描（JSX 标签 → 原语；祖先标签栈 + 文件路径 → 上下文推断）
- `primitives.mjs` 原语注册表（真实 class 从 `ui/shadcn/*.tsx` 运行时读取）与上下文祖先链（按源码真实 DOM）
- 输出：`table.md` / `table.json`（当前）、`table.before-fix.*`（滑条修复前）、`shots/<原语>[.before-fix].png`
- 全源补充输出：`all-elements-overlap.md` / `.json`，以及按 Jirai CSS 声明代码归组的 `all-elements-style-groups.md`。它扫描 TSX/JSX 所有带 class/语义属性的站点，用 JSX 祖先链做 CSS 选择器候选匹配；按有序的 property/value/!important 声明序列合并同代码，即使 selector/context 不同或最终计算样式不同也归同组；无直接候选的元素另列“未覆盖”。该层只定位静态候选，不是运行时级联证明；继承、动态 Tailwind 分支仍需运行时/手工确认；伪元素(::before/::after/::placeholder)单列为候选，避免混进宿主本体属性冲突。

## 每格怎么判
1. **静态扫描**：`file:line` + class 摘要 + 上下文推断（含 `ctxWhy`）。无使用点的上下文记 `–`。
2. **规则分析（浏览器内）**：整包主题 CSS 按 `SECTION` 拆成多个 `<style data-section>`（级联等价于拼接文件），
   对每条“选择器含该原语提示词”的规则：去掉 `:not(<…> *)` 排除子句后若能命中该元素而原选择器不命中 →
   记 **EXCLUDED**（附罪魁子句）；原样命中 → **HIT**。输出里有 hit/excluded 计数与样例。
3. **计算样式指纹**：同一夹具渲染两次——无主题基线（只有 app CSS）、整包主题。比较“形状属性”
   （四角 radius / clip-path / box-shadow / border-style / background-image / appearance / 伪元素…）。
   `::-webkit-slider-thumb|runnable-track`、`::-webkit-progress-*` 在 Chromium 里 `getComputedStyle` 读不到
   （返回宿主样式），所以用 CSSOM 级联模拟（specificity + 重要性 + 顺序 + layer）取最终声明。
   规范主题实例 = main-content 的同一原语；`T` = 规范实例相对基线变了的形状属性。
   - 主属性（radius/clip-path/伪元素；原生控件另含 appearance）：规范实例改了而该上下文一个都没改 → **unthemed**；
     只改了一部分 → **partial**；两者都记 ✗。次属性（box-shadow、border-style…）只报告不判 ✗，
     因为不少上下文（dialog/entity-dialog 等）刻意用自己的斜面/调色板。
   - 颜色类属性不参与判定（`tokens` 段改了 CSS 变量，任何上下文的颜色都会变）。
   - 几何：同一格“有主题 vs 无主题”的 bbox 宽/高变化 >2px 记入 `notes`（`geometry>2px`）。
4. **矩阵**：✓ 已主题 / ✗ 缝隙（`✗ a/b` = b 个使用点里 a 个）/ – 无使用点 / `–†` 无使用点但夹具里同样未主题化
   （潜在缝隙）/ ○ 主题对该原语形状完全没有规则。`≠规范` = 已主题但与规范实例有属性差异。
   另有“排除子句有效性”表：每条 `:not(<clause>)` 在夹具各场景里是否真能命中（发现死子句）。

## 已知局限（请带着怀疑读结果）
- 上下文推断是启发式：JSX 标签栈 + 路径规则，不含运行时条件渲染/组件复用；实体弹窗内再嵌的 Popover/Dialog 靠标签栈识别。
- `className` 只取字面量，不做 tailwind-merge（调用点的覆盖 class 只用于原生元素；shadcn 组件用 cva 基础类 + 变体）。
  针对单个调用点 class 的主题规则（如 `.size-8.rounded-full`）不在“原语级”审计范围内。
- 只测默认/focus 状态；hover/active/disabled/invalid、动画、响应式断点未覆盖。focus 靠 `el.focus()` +
  一次合成 keydown 触发 `:focus-visible`。Base UI Slider 的焦点在内部隐藏 input，未单独验证。
- `#chart` scaffold、`.vrcx-0-page-toolbar` 的 chart 变体等极窄场景夹具未构造（排除子句表里会标“夹具未构造”）。
- 夹具把 `dialog-content/popover-content/toast` 的 fixed 定位用 `!important` 改为静态流（不影响指纹属性）。
- 只测 Chromium（`-webkit-` 伪元素）；`-moz-range-*` 规则不评估。
