# P3-3 SECTION 顺序修复报告

## 1. 正确文件拼接顺序

1. `08-asset-vars.css`（frozen；无 SECTION）
2. `01-tokens.css`（style）
3. `02-native-icons.css`（frozen）
4. `04-assets.css`（frozen）
5. `01-fonts.css`（frozen）
6. `03-icons.css`（frozen）
7. `02-foundation.css`（style）
8. `03-chrome.css`（style）
9. `04-group-spacing-and-typography.css`（style）
10. `05-navigation.css`（style）
11. `06-panels-and-settings.css`（style）
12. `05-assets-r5.css`（frozen）
13. `07-motion-navigation.css`（style）
14. `06-assets-r7.css`（frozen）
15. `08-chrome-r7.css`（style）
16. `09-motion-and-user-surfaces.css`（style）
17. `10-login-and-dialogs.css`（style）
18. `11-controls-and-pages.css`（style）
19. `12-loader-and-forms.css`（style）
20. `13-toolbar-overlays-and-pages.css`（style）
21. `14-buttons-and-data.css`（style）
22. `15-late-components.css`（style）
23. `16-final-navigation.css`（style）
24. `07-keyframes.css`（frozen；无 SECTION）

对应用户给定的 22 个 SECTION-bearing 源文件顺序不变；首尾分别额外插入 asset-vars 与 keyframes。

## 2. build-theme.mjs 改动前后

改动前先全部拼 frozen（01-fonts、02-native-icons、03-icons、04-assets、05-assets-r5、06-assets-r7、07-keyframes、08-asset-vars），再全部拼 style（01-tokens 至 16-final-navigation）。改动后以按序 `(目录类别, 文件名)` 列表交错读取，顺序如第 1 节。separator 的生成规则、输出格式及其它参数逻辑未改。

## 3. 无 SECTION 文件位置论证

实测 artifact 有 16 个 `@keyframes` 名称，没有同名重复；重复定义时后出现者胜出的例外不适用。artifact 中 `--jk-asset-*` 定义为 0 个，与重构侧新造的变量名不重名。故按用户建议将 asset-vars 前置、keyframes 收尾；以上仅核对 artifact 内的既有名称，不声称其对所有未来 CSS 的覆盖关系。

## 4. 三条目标规则原文与补回位置

经逐字搜索，三条目标规则都已存在于 artifact，也已经存在于对应重构源码中，属于“源码已存在，并非拼接漏掉”，因此没有重复添加（避免产生额外规则）。artifact 中的位置及完整原文：

### motion 段（约 1420 行）

```css
[data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after { content:""; position:absolute; z-index:1; opacity:0; pointer-events:none; }
```

重构源码对应 `07-motion-navigation.css`，该段已有同一声明；另有后续同选择器规则属于独立样式规则，不作重复补入。

### user-dialog-r8 / cat-r8-final 边界（约 1924 行）

```css
.vrcx-0-sidebar-surface [data-sidebar="content"]::after {
  content: "";
  display: block;
  flex: none;
  width: 36px;
  height: 36px;
  margin-top: auto;
  margin-right: 6px;
  margin-bottom: 4px;
  align-self: flex-end;
  background-image: var(--r5-pixel-mascot);
  background-size: 36px 36px;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  opacity: .95;
  pointer-events: none;
}
```

重构源码 `09-motion-and-user-surfaces.css` 已有此规则（cat-r8-final 段）。

### badge-r9（约 2368 行）

```css
.vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge'] {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  min-width: 14px;
  max-width: 24px;
  top: -2.5px;
  right: -3px;
  height: 13px;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: clip;
  border: 1px solid #16112a;
  border-radius: 0;
  outline: none;
  outline-offset: 0;
  box-shadow: inset 0 0 0 1px #ffe4f2;
  background-color: #21132d;
  color: #ffd9ee;
  /* Explicit near-opaque compositing forces grayscale AA in Windows WebView2,
     avoiding LCD color fringes on 1px strokes. Fixture tests opacity vs the
     persistent will-change hint; opacity is the explicit trigger, with no
     geometry or animation-budget cost and imperceptible 0.1% alpha. */
  opacity: .999;
  font-family: 'WD Pixel';
  font-size: 12px;
  text-align: center;
  font-weight: 400;
  font-synthesis: none;
  letter-spacing: -1px;
  line-height: 11px;
  transition: none;
  animation: r9-notification-badge-flash 2.8s steps(2, end) infinite;
  z-index: 2;
}
```

重构源码 `10-login-and-dialogs.css` 已有此规则（badge-r9 段）。

## 5. 验证脚本输出

运行 `node refactor/tools/verify-section-order.mjs`。SECTION 序列比较通过（artifact 与构建均为 56 个 SECTION，次序一致）。脚本将详细打印序列及差异。

## 6. 规则总数对比

脚本递归计数 CSS qualified rule block（忽略 at-rule 容器与 keyframe 内部规则）：artifact 为 1042，重构构建为 1043，差异 +1。该统计口径与任务中提到的 756/753 不一致，且并未达到 756=756；不能据此宣称验收通过。三条指定 selector 的 occurrence 数在 artifact 与构建产物一致，但这无法解释总数差异。

## 7. 括号配平

基于 `{` / `}` 字符计数：artifact 1264/1264，构建 1265/1265，二者均配平。

## 8. 诚实声明

构建产物已生成到 `/tmp`，没有运行 `build-runtime.mjs`，没有修改 artifact、runtime、baseline 或 dist。拼接顺序及 SECTION 序列已验证；三条指定规则原已存在，无重复补入。规则数量验证**失败/未通过**：当前可靠计数结果为 1042 vs 1043，和所要求目标 756 vs 756 不符，需要父 agent 进一步确认其 756/753 的计数口径并定位额外的一条规则差异。验证脚本因此以 `RESULT: FAIL` 结束，不应视为完成标准全通过。
