# 标题栏 / 状态栏 R4 —— 快速搜索控件、品牌铭牌、状态像素

任务范围：只改 `runtime/window-chrome.css`（R4 段 + 状态点规则），本文件为研究报告。
主应用 `/home/fulutang/Documents/Github/VRCX-0-jirai` 全程只读，未执行 git / 构建 / 写入。

## 0. 结论与交付

| 项 | 结果 |
| --- | --- |
| 用户反馈 (3) 快速搜索无框、键帽淹没 | 已修：`--wd-square` 浅粉面 + 1px ink 像素框 + bevel；键帽改浅面像素键帽，文字对比度 1.39:1 → 16.86:1 |
| 用户反馈 (8) 品牌名 / 帮助未特化 | 已修：两者都变成与右上三键同族的像素块（紫面 + 1px ink 框 + bevel），品牌加 12px 像素心铭牌装饰，菜单 hover/打开态更亮 |
| (附) 状态栏状态点 | 已修：圆点 → 方角像素方块（1px ink 框 + 明暗 bevel），绿/黄/灰语义色保留，灰色不再半透明“空心” |
| `window-chrome.css` 字节 | **14706 B**（上限 15000 B，余量 294 B；R3 为 8560 B，本任务净增 6146 B） |
| 验证产物 | `runtime/checks/r4-chrome/`（`verify-r4-chrome.mjs`、fixture、`r4-chrome-report.json`、4 张 NOT WINDOWS 截图） |

CSS 位置（本文件内行号）：R4 变量 `:root` L178-181；R4-1 搜索控件 L185-203；R4-2 键帽 L209-218；
R4-3 品牌/帮助 L223-247；品牌字体与心形 L249-269；badge L271-272；状态点 L122-135。

## 1. 源码证据（真实属性，非猜测）

* `src/components/layout/useTitleBarActions.tsx:472-498` —— 快速搜索是 `TooltipTrigger → Button`，
  带 `data-vrcx-0-control="toolbar"` 与 `class="vrcx-0-toolbar-control … h-6 min-w-7 justify-start
  rounded-md border-0 px-2 shadow-none min-[640px]:w-44 min-[960px]:w-56"`。因为 TooltipTrigger 会把
  `data-slot` 覆盖成 `tooltip-trigger`，**不能**依赖 `[data-slot='button']`（R3 已记录此坑）。
* `src/ui/shadcn/button.tsx:8,27` —— 基类 `inline-flex items-center justify-center`，`size=xs` 为
  `h-6 gap-1 px-2 … has-data-[icon=inline-start]:pl-1.5`。所以真实左内边距是 6px、右 8px。
* `src/components/keyboard/KeyboardShortcut.tsx:57-68` + `useTitleBarActions.tsx:128-129`
  （`SHORTCUT_KBD_CLASS`）→ `src/ui/shadcn/kbd.tsx:5-13` 渲染 `<kbd data-slot="kbd">`，键帽类为
  `bg-background/45 h-3.5 min-w-3.5 rounded-[3px] px-1 text-[9px] leading-3.5`。
* `src/components/layout/AppMenuBar.tsx:133-137` 品牌 trigger 内是 `<span class="vrcx-0-brand">VRCX-0-jirai</span>`
  （真实文本），`:194-206` 是帮助 trigger；`src/ui/shadcn/menubar.tsx:60-74` 两者都渲染为
  `[data-slot='menubar-trigger']`（`h-full px-3` / `px-2`，`py-0!`）。
* `src/ui/shadcn/tooltip.tsx:19-27` —— 应用自己的 `TooltipTrigger` 封装把
  `data-slot="tooltip-trigger"` 放到 Base UI Trigger 上，而 `button.tsx:52-60` 把传入 props 展开在最后，
  因此真实 DOM 里被 Tooltip 包住的按钮 `data-slot` 是 **tooltip-trigger**（R4 选择器一律不依赖它）。
* `src/components/layout/status-bar/StatusBarParts.tsx:47-56` —— `StatusDot` 是
  `span.inline-block.size-2.rounded-full` + `bg-muted-foreground/40 | bg-[var(--status-active)] |
  bg-[var(--status-online)]`。

## 2. 修复前实测（构建版 theme.css 的 R3 状态，作对照）

| 采样 | 值 |
| --- | --- |
| 搜索控件背景 | 应用 `@layer components` 的 `.vrcx-0-toolbar-control[data-vrcx-0-control=toolbar]{background:var(--vrcx-0-toolbar-control-surface)}` → `#2a2147` 深色块 |
| 搜索控件边框 / bevel | `0px` / 无（全为透明 shadow） |
| 键帽 | 高 14px，面 `rgb(22,18,42)`，字 `rgb(59,42,69)` → **对比度 1.39:1**（这就是“淹没在黑块里”） |
| 品牌 trigger | 边框 `0px`，无面（R3 未特化） |
| 状态点 | `border-radius: 3.36e7px`（整圆）、无边框、灰态为 40% 半透明 |

## 3. 修复后实测（同一 fixture，追加当前 runtime 四件套）

* 搜索控件：`224 × 24`（命中区不变）、背景 `rgb(255,184,230)` = `--wd-square #ffb8e6`、
  边框 `1px solid rgb(26,18,38)` = `--jk-chrome-edge`、`border-radius:0`、
  bevel `#fdf4ff 1px 1px inset / #7a3f6d -1px -1px inset`、文字 `rgb(22,17,42)`、`padding-inline:7px`
  （左 6→7px、右 8→7px，为 1px 框让位，总宽仍由 `w-56` 决定）。
  hover / `aria-expanded` / `data-popup-open` → `rgb(255,217,239)`（更亮）。
* 键帽 ×2：`16px` 高、`Ctrl` 22.98px / `K` 16px 宽，面 `rgb(255,242,251)`、`1px solid rgb(26,18,38)`、
  bevel `#ffffff/#7a3f6d`、文字 `rgb(22,17,42)`，**对比度 16.86:1**；控件 hover 时键帽面不变。
* 品牌 trigger：`101 × 31`（栏高 32px 含 1px 底边，`h-full` 31px）——把 `padding-right` 还原成 12px 并去掉边框后，同选择器实测 94px（等效 R3 宽度），
  **+7px** 全部来自心形挂饰的 `padding-right:17px`；面 `rgb(205,176,232)` = `#cdb0e8`，1px ink 框 + bevel；
  文字对比度 9.56:1；hover 时 `rgb(255,217,239)`。帮助 trigger `75 × 31`，同面同框，`aria-expanded` 后变色。
* 品牌 φ 装饰：`::after` content `""`、`mask-image` 命中、`pointer-events:none`、`12×12`，
  颜色 ink。mask 变量 `--jk-mask-s7-s` 对应 `original-assets/dist/assets-report.json` 的
  `s7-heart-12x12.svg`（token `s7-s`）。
* 品牌字体：computed `"WD Pixel CJK", system-ui, sans-serif`（Fusion 在前，Silkscreen 未入栈），
  `text-transform: none`，文本节点仍是 `VRCX-0-jirai`（**未被替换、未被强制大写**）。
* 状态点：`8 × 8`、`border-radius:0`、`1px solid rgb(26,18,38)`、`inset -1px -1px 0 rgb(0 0 0/.28)`；
  绿 `rgb(46,211,25)` 不变；灰态由 `bg-muted-foreground/40` 覆盖为不透明 `--wd-faint #a294c8`
  → 实测 `rgb(162,148,200)`（不再半透明空心）。

## 4. 保留项回归（同一次运行内断言）

* 三窗口按钮：`36 × 31`、1px ink 框、bevel、图标 16px、命中测试全部 `true`；关闭键静止面
  `rgb(240,166,203)`；hover `rgb(255,107,138)` on `rgb(22,17,42)` —— 与 `runtime/checks/r3-report.json`
  的 `closeHover` 基线逐字节一致（destructive important 工具类仍为最终裁决）。
* 标题栏 `32px`（`h-8`）、状态栏 `32px`、状态点 `size-2` 全部未变；未改 DOM、未改文字、未动虚拟列表。
* 键盘可读：搜索控件 `outline: 2px solid rgb(22,17,42); outline-offset: -3px`（focus-visible），
  品牌/帮助 trigger 同款内描边；三个控件 `tabIndex >= 0`。

## 5. 设计取舍（Leader 审查点）

1. **铭牌画在 trigger 上而不是品牌 span 上**：`src/styles/vrcx-0-rgb.css:49` 在 RGB 模式下给
   `.vrcx-0-brand` 设了 `color:transparent !important` + `background-clip:text !important` 的渐变字。
   若把面画在品牌 span 上会与其 `!important` 背景冲突；画在 trigger 上互不干扰，`::after` 的心形用
   `background-color: ink` 也不受 RGB 渐变影响。
2. **`R4-4b` 覆盖了灰点的 40% 半透明面**：这是为了消除“空心”观感；它只匹配
   `[class*='bg-muted-foreground']` 且限定在状态栏内，`--status-online` / `--status-active`（以及
   VRChat 六种状态色）一律未在本文件里出现。若 Leader 认为应保留应用的半透明灰，删除 L131-135 即可。
3. `PrivacyLockOverlay.tsx:112,116` 也用了同一个 `StatusDot`，但不在状态栏作用域内，**未被修改**
   （任务只要求状态栏；如需一并像素化请另开一条作用域规则）。
4. 未使用 `!important`；所有规则未分层，靠层叠顺序压过应用 `@layer components`（已实测生效）。

## 6. 验证方法与局限

`runtime/checks/r4-chrome/verify-r4-chrome.mjs` 用 `renderToStaticMarkup` 渲染**真实原语**：
快速搜索控件与三个窗口按钮都由 Base UI `Tooltip` + `Button` 按 `useTitleBarActions.tsx` /
`button.tsx` / `tooltip.tsx` 的同一契约生成（fixture 里 4 个按钮实测 `data-slot="tooltip-trigger"`，
即 TooltipTrigger 覆盖了 button slot，而 R4 选择器仍然命中），品牌/帮助/状态点因是 TS 组件而按源码
逐属性复刻。随后逐个 `addStyleTag` 应用
`dist/assets/index-Cckb3vVG.css` → `App-C2mIqNXI.css` → 构建版 `theme.css` → 当前
`windose-runtime.css / window-chrome.css / group-spacing.css / fonts-pixel-body.css`（与
`build-runtime.mjs` 拼接顺序一致），再用 Chromium 读 computed style、命中测试、hover/aria 状态并截图。

**这是 DOM fixture，标注 NOT WINDOWS，不等于 Windows/WebView2 实机通过。** 未在真实 Tauri 窗口中运行，
也未验证 125%/150% DPI 下的像素对齐与字体光栅化。

## 7. Leader 必须实机复测

1. 搜索控件 1px 框 + 键帽在实机缩放下的清晰度（键帽 14→16px、字号仍 9px）。
2. 品牌 +7px 宽度后，标题栏左区拖拽区与帮助按钮位置是否仍自然（右侧三键右对齐，理论不受影响）。
3. hover / 打开态 `#ffd9ef` 与粉色标题栏 `#d97fc6` 的区分度（观感项）。
4. `:has(> .vrcx-0-brand)`（品牌左内边距与心形定位）在目标 WebView2 版本可用；项目其它文件
   （`windose-runtime.css:23,102`）已依赖 `:has()`。
5. 状态点方块的 8px 观感与灰态新面 `#a294c8` 是否符合预期（可回退 R4-4b）。
6. 本文件余量仅 294 B：再改前请先腾字节，避免撞 15000 B 上限。

## 8. 复现

```bash
cd /home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/r4-chrome
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node verify-r4-chrome.mjs   # exit 0 = 全部断言通过
```
