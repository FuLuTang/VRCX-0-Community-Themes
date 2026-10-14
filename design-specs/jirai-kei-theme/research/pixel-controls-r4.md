# R4 像素控件：Switch / 滚动条 / Progress（DOM fixture，非 Windows 实机）

产物：`runtime/pixel-controls.css`（8391 B，由 `runtime/checks/r4-pixel-controls/gen.mjs` 从 ASCII 像素图生成）。
无 @import、无远程 URL；6 处 `http` 只是 data: SVG 里的 `xmlns` 命名空间。所有图案都写了显式 `background-size`。
验证：`checks/r4-pixel-controls/verify.mjs`（真实 @base-ui/react 1.8.0 SSR 标记 + 从源码正则提取的 shadcn className + 应用编译后的 CSS + 已构建 theme.css + 本文件）→ `report.json`、4 张 4× 截图。

## 源码证据
- 原生滚动条：`src/styles/globals.css:570-593`，`@layer base` 里的 `*{scrollbar-width:thin;scrollbar-color:var(--border) transparent}`，外加 `*::-webkit-scrollbar` 宽 0.625rem。
  Chromium 121+ 只要 scrollbar-width/color 不是 auto，就会忽略 ::-webkit-scrollbar 规则。所以现在实机看到的「细紫条 + 两端小 ▲▼」是 **Windows 原生 thin 滚动条**（用 scrollbar-color 上色），不是 webkit 伪元素，也不是 Base UI 的。
  主题因此先把 `*:not(.no-scrollbar,.base-ui-disable-scrollbar)` 重置为 `auto/auto`（`.no-scrollbar` 在编译 CSS 里是 utilities 层的 `scrollbar-width:none`，必须排除，否则会把隐藏的滚动条重新放出来）。
- Base UI ScrollArea：`src/ui/shadcn/scroll-area.tsx:48-59`，有 `data-slot=scroll-area-scrollbar` 和 `data-orientation`，thumb 是 `data-slot=scroll-area-thumb`；SSR 也证实 Base UI 自己会输出 `data-orientation`（`ssr-output.txt`）。
  viewport 带 `.base-ui-disable-scrollbar`，原生条被隐藏。thumb 尺寸会扣掉 scrollbar 的 padding（`@base-ui/react/scroll-area/viewport/ScrollAreaViewport.js:162-180`），所以用 `padding:14px 0` 给箭头格让位。
- Switch：`src/ui/shadcn/switch.tsx:16-26`，`data-slot=switch|switch-thumb`、`data-size=default|sm`。SSR 实测属性是 `data-checked` / `data-unchecked` / `data-disabled`，root 和 thumb 上都有。
  root 的 `::after` 被应用拿来扩大点击区域（`after:-inset-x-3`），所以 ON/OFF 灯放在 `::before`。thumb 的位移在 TW4 里用的是 `translate` 属性，主题也覆盖 `translate`。
- Progress：`src/ui/shadcn/progress.tsx:45,61-63,77-79`，有 `data-slot=progress|progress-track|progress-indicator`。SSR 显示 indicator 内联样式 `height:inherit;width:N%`，状态属性有 `data-progressing` / `data-complete` / `data-indeterminate`。
  不定进度：`src/components/IndeterminateProgress.tsx:12-13` 用的是 `value={null}` + `.indeterminate-progress`；动画定义在 `globals.css:1433-1465`（不在任何层里，已有 reduced-motion 处理）。
- Skeleton：`src/ui/shadcn/skeleton.tsx:6-7`（animate-pulse）；Spinner：`src/ui/shadcn/spinner.tsx:8-11`（animate-spin）。两者只改成 steps() 节奏，不改形状和圆角。

## 实现与实测（Chromium headless 不隐藏滚动条，DPR1）
- Switch 默认尺寸 40×18（原来 32×18.4），sm 为 38×16（原来 24×14）。槽底 #120d22，1px ink 边框，inset bevel #000 / #8f7fe0。
  钮 16×12：关=两条交叉创可贴 ❌（米白 #f3e3d3、纱布 #fdf4ff、孔点 #c9a594），在左；开=像素爱心（#ff7fcf / #ffb8e6 / 高光 #fdf4ff / 暗面 #d97fc6），在右，`translate:18px`（sm 为 16px）。
  钮的位置实测（等过渡结束后再测）：左缘距 root 3px（关）/ 21px（开，sm 为 19px），宽 16，上下各留 3px。
  ON/OFF 是 5px 高的原创像素字 SVG（ON 9×5 粉色，OFF 12×5 #b9add9），放在 `::before` 里，`pointer-events:none`，没有 content 文本，不进无障碍树，不改 DOM/aria。
  disabled：opacity .45 + saturate(.35)；focus-visible：2px #ffb8e6 外框，offset 2px（实测 `:focus-visible` 命中）；`translate .16s steps(3)`；reduced-motion 下实测 transition 为 0s。
- 原生滚动条宽 14px（实测 offsetWidth−clientWidth 从 10 变成 14）。轨道 #2a2147 + 1px #6c5ce0 框；拇指 #ff7fcf + 1px ink + #fdf4ff/#7a3f6d bevel；
  single-button 14×14 方块（ink 框、#cdb0e8 面、bevel、ink 像素三角），上下左右四个方向都有；corner 用 #201936。
- Base UI 竖条 14×150、padding 14px 0；拇指被限制在两个箭头格之间（实测 top 232 / mid 270.35 / bottom 308.7，在 218..368 范围内）。横条用 padding 0 14px，配左右箭头。
- Progress track 改为 content-box，内高 12px、左右 padding 2px、1px ink 边框，凹槽和开关一致，总高 14px（原来 4px）。
  indicator 用 10×8 的 SVG 平铺（8px 方块 + 2px 间隔，`repeat-x`），宽度怎么变格子都不会被拉伸。实测 0% / 45% / 100% 宽度为 0 / 105.3 / 234px；不定进度动画改为 `steps(10)`。

## 偏离说明（请 Leader 定夺）
1. ON/OFF 没有用 "WD Pixel" 字体：Silkscreen 8px 在 fixture 里出现 LCD 彩边、发糊，Windows ClearType 下大概率一样。改用 5px 像素字 SVG，保证清晰，也不依赖字体加载。想换回字体只需改 `::before` 两条规则。
2. 钮描边：ink #16112a 放在 #120d22 槽底上几乎看不见，爱心改用 #7a3f6d、创可贴改用 #5b4a8a 作为 1px 深描边。要改回 ink，改 gen.mjs 里调色板的 `k` 即可。
3. 100% 时最右边可能出现半格（track 宽度不是 10 的整数倍）。没有用 `space`/`round`：前者会把间距拆成小数像素导致发糊，后者会拉伸格子。

## 风险 / 需实机复测
- 所有 `scrollbar-width:thin` 的容器（包括 message-scroller 的 `.scrollbar-thin` 和 autoscroll 时透明 thumb 的 `scrollbar-color`）都会统一变成 14px 的 webkit 条，autoscroll 时的透明效果会消失。
- 虚拟网格用 `clientWidth` 测宽（`src/lib/useScrollViewportMetrics.ts:28`），滚动条加宽不会造成横向溢出，但每列可用宽度少 4px；需要实机看列数会不会少一列。
- Base UI 滚动条是绝对定位、盖在内容上的，加宽后多盖住 4px 内容；箭头只是装饰，不能点击滚动（点了等同点轨道）。
- gantt 的横向条有 `h-4!` important（`gantt-view.tsx:2733`），实际高度仍是 16px，箭头 14px 贴顶，需要实机看。
- Switch 加宽 8–14px，可能影响紧凑的设置行或工具卡片；sm 只有 3 处在用。
- 与 settings-pixel.css 里旧的 Switch 规则有冲突（Leader 删除旧规则后以本文件为准）。WebView2 下的 single-button 和 ClearType 表现都还没在实机验证。
