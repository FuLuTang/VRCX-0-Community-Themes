# P1-FREEZE：keyframe sections 审计

- Artifact: `design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`
- SHA-256: `0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc`
- Size: 1,044,718 bytes
- 切分：按 `/* SECTION ` 到下一同类标记之前；仅核查指定五段。
- 判据：整段只有 `@keyframes` 和仅含动画属性的普通声明规则，且不含 `data:` URI，才可整体归入冻结层。

## SECTION motion

### @keyframes
```css
@keyframes r5-charm-swing {
0%,70%,100%{transform:translateY(0)} 78%{transform:translateY(-2px)} 86%{transform:translateY(0)}
}
```
```css
@keyframes r5-dialog-step-in {
from{opacity:0} to{opacity:1}
}
```
```css
@keyframes r5-spinner-step {
to { transform:rotate(360deg) }
}
```
```css
@keyframes r5-progress-flow {
to { background-position:10px 50% }
}
```

### 非 `@keyframes` 顶层规则（选择器/前序前 120 字符）
- `.vrcx-0-side-panel`
- `.vrcx-0-side-panel::after`
- `.vrcx-0-sidebar-surface`
- `[data-slot="sidebar"][data-state="collapsed"] .vrcx-0-sidebar-surface::after`
- `.vrcx-0-sidebar-surface::after`
- `[data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after`
- `[data-slot="progress-indicator"]`
- `[data-slot="spinner"]`
- `[data-slot="dialog-content"][data-open]`
- `@media (prefers-reduced-motion:reduce)`

### 冻结层判断
不可整段冻结：段内包含普通元素/伪元素样式、覆盖/减弱动画的媒体查询或非动画声明。混入规则如下：
- `.vrcx-0-side-panel` — 非动画属性/结构：`position`。声明：`position:relative;`
- `.vrcx-0-side-panel::after` — 非动画属性/结构：`background-repeat, content, pointer-events, position, z-index`。声明：`content:""; position:absolute; z-index:1; background-repeat:no-repeat; pointer-events:none;`
- `.vrcx-0-sidebar-surface` — 非动画属性/结构：`position`。声明：`position:relative;`
- `[data-slot="sidebar"][data-state="collapsed"] .vrcx-0-sidebar-surface::after` — 非动画属性/结构：`display`。声明：`display:none;`
- `.vrcx-0-sidebar-surface::after` — 非动画属性/结构：`background-image, background-repeat, background-size, bottom, content, height, pointer-events, position, right, width`。声明：`content:""; position:absolute; right:8px; bottom:104px; width:48px; height:72px; background-image:var(--r5-ribbon-pendant); background-size:48px 72px; background-repeat:no-repeat; pointer-events:none; animation:r5-charm-swing 4.8s steps(3,end) infinite;`
- `[data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after` — 非动画属性/结构：`content, opacity, pointer-events, position, z-index`。声明：`content:""; position:absolute; z-index:1; opacity:0; pointer-events:none;`
- `@media (prefers-reduced-motion:reduce)` — 非动画属性/结构：`含嵌套选择器/非 keyframe at-rule`。声明：`.vrcx-0-sidebar-surface::after, [data-slot="progress-indicator"],[data-slot="spinner"],[data-slot="dialog-content"][data-open] { animation:none !important; }`

拆分建议：将本段的 `@keyframes` 规则移至冻结动画定义层；把命中上列的元素样式及其 reduced-motion / reduce-effects 覆盖留在可变样式层。

## SECTION motion-r7

### @keyframes
```css
@keyframes r7-tab-edge {
0%,60% { opacity:0; background-position:-24px 0; }
 68% { opacity:.65; background-position:0 0; }
 80% { opacity:.65; background-position:24px 0; }
 90% { opacity:.45; background-position:48px 0; }
 100% { opacity:0; background-position:72px 0; }
}
```

### 非 `@keyframes` 顶层规则（选择器/前序前 120 字符）
- `.vrcx-0-side-panel::after`
- `[data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after`
- `@media(prefers-reduced-motion:reduce)`

### 冻结层判断
不可整段冻结：段内包含普通元素/伪元素样式、覆盖/减弱动画的媒体查询或非动画声明。混入规则如下：
- `.vrcx-0-side-panel::after` — 非动画属性/结构：`background-image, background-size, image-rendering, pointer-events, right, width`。声明：`right:88px; width:42px; background-image:var(--r5-star),var(--r5-pixel-mascot); background-size:16px 16px,18px 18px; image-rendering:pixelated; pointer-events:none;`
- `[data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after` — 非动画属性/结构：`background-image, background-repeat, background-size, bottom, height, left, top, transform, width`。声明：`top:auto; bottom:0; left:0; width:100%; height:2px; transform:none; background-image:linear-gradient(#ffe4f5,#ffe4f5); background-size:24px 2px; background-repeat:no-repeat; animation:r7-tab-edge 6s steps(4,end) infinite;`
- `@media(prefers-reduced-motion:reduce)` — 非动画属性/结构：`含嵌套选择器/非 keyframe at-rule`。声明：`[data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after { animation:none !important; }`

拆分建议：将本段的 `@keyframes` 规则移至冻结动画定义层；把命中上列的元素样式及其 reduced-motion / reduce-effects 覆盖留在可变样式层。

## SECTION motion-r8

### @keyframes
```css
@keyframes r8-lace-flow {
from { background-position: 0 center; }
  to { background-position: 20px center; }
}
```
```css
@keyframes r8-nav-cursor {
0%, 28%, 58%, 100% { opacity: .62; }
  14%, 42%, 78% { opacity: 1; }
}
```
```css
@keyframes r8-window-press {
0%, 30%, 100% { transform: translateY(0); opacity: .62; }
  50%, 70% { transform: translateY(1px); opacity: .96; }
}
```
```css
@keyframes r8-cat-hop {
0%, 34%, 72%, 100% { transform: translateY(0); opacity: .78; }
  42%, 52% { transform: translateY(-1px); opacity: 1; }
}
```

### 非 `@keyframes` 顶层规则（选择器/前序前 120 字符）
- `.vrcx-0-statusbar[data-vrcx-0-surface='statusbar']::before`
- `.vrcx-0-sidebar-surface [data-sidebar='menu-button'][data-active]`
- `.vrcx-0-sidebar-surface [data-sidebar='menu-button'][data-active]::before`
- `.vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0']`
- `.vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0']::after`
- `.vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0']:hover::after`
- `[data-slot='tabs']:not(.vrcx-0-side-panel-rail) [data-slot='tabs-tab'][data-active]::after`
- `.vrcx-0-sidebar-surface [data-sidebar='content']::after`
- `@media (prefers-reduced-motion: reduce)`

### 冻结层判断
不可整段冻结：段内包含普通元素/伪元素样式、覆盖/减弱动画的媒体查询或非动画声明。混入规则如下：
- `.vrcx-0-sidebar-surface [data-sidebar='menu-button'][data-active]` — 非动画属性/结构：`position`。声明：`position: relative;`
- `.vrcx-0-sidebar-surface [data-sidebar='menu-button'][data-active]::before` — 非动画属性/结构：`background, content, height, left, margin-top, pointer-events, position, top, width, z-index`。声明：`content: ''; position: absolute; z-index: 2; left: 4px; top: 50%; margin-top: -7px; width: 3px; height: 14px; background: linear-gradient(#fff1f8, #fff1f8); pointer-events: none; animation: r8-nav-cursor 3s steps(4, end) infinite;`
- `.vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0']` — 非动画属性/结构：`position`。声明：`position: relative;`
- `.vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0']::after` — 非动画属性/结构：`background, bottom, content, height, opacity, pointer-events, position, right, width`。声明：`content: ''; position: absolute; right: 4px; bottom: 4px; width: 3px; height: 3px; background: linear-gradient(var(--r8-ink, #21132d), var(--r8-ink, #21132d)); opacity: .62; pointer-events: none;`
- `@media (prefers-reduced-motion: reduce)` — 非动画属性/结构：`含嵌套选择器/非 keyframe at-rule`。声明：`.vrcx-0-statusbar[data-vrcx-0-surface='statusbar']::before, .vrcx-0-sidebar-surface [data-sidebar='menu-button'][data-active]::before, .vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0']::after, .vrcx-0-sidebar-surface [data-sidebar='content']::after { animation: none !important; }`

拆分建议：将本段的 `@keyframes` 规则移至冻结动画定义层；把命中上列的元素样式及其 reduced-motion / reduce-effects 覆盖留在可变样式层。

## SECTION badge-r9

### @keyframes
```css
@keyframes r9-notification-badge-flash {
0%, 49.999% {
    background-color: #21132d;
    color: #ffd9ee;
    border-color: #16112a;
    box-shadow: inset 0 0 0 1px #ffe4f2;
  }
  50%, 100% {
    background-color: #ffd9ee;
    color: #21132d;
    border-color: #16112a;
    box-shadow: inset 0 0 0 1px #d97fc6;
  }
}
```

### 非 `@keyframes` 顶层规则（选择器/前序前 120 字符）
- `.vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge']`
- `.vrcx-0-titlebar:has(button[class~='w-9'][class~='rounded-none'][class~='border-0']:hover)
  button:has(> svg.lucide-bel`
- `body:has([data-slot='empty'] > div.flex.items-center.gap-2 > svg[data-slot='spinner'])
  .vrcx-0-titlebar button:has(> s`
- `@media (prefers-reduced-motion: reduce)`
- `html.reduce-effects .vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge']`

### 冻结层判断
不可整段冻结：段内包含普通元素/伪元素样式、覆盖/减弱动画的媒体查询或非动画声明。混入规则如下：
- `.vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge']` — 非动画属性/结构：`align-items, background-color, border, border-radius, box-shadow, box-sizing, color, display, font-family, font-size, font-synthesis, font-weight, height, justify-content, letter-spacing, line-height, max-width, min-width, opacity is the explicit trigger, with no
     geometry or animation-budget cost and imperceptible 0.1% alpha. */
  opacity, outline, outline-offset, overflow, padding, right, text-align, text-overflow, top, transition, white-space, width, z-index`。声明：`box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; width: max-content; min-width: 14px; max-width: 24px; top: -2.5px; right: -3px; height: 13px; padding: 0; overflow: hidden; white-space: nowrap; text-overflow: clip; border: 1px solid #16112a; border-radius: 0; outline: none; outline-offset: 0; box-shadow: inset 0 0 0 1px #ffe4f2; background-color: #21132d; color: #ffd9ee; /* Explicit near-opaque compositing forces grayscale AA in Windows WebView2, avoiding LCD color fringes on 1px strokes. Fixture tests opacity vs the persistent will-change hint; opacity is the explicit trigger, with no geometry or animation-budget cost and imperceptible 0.1% alpha. */ opacity: .999; font-family: 'WD Pixel'; font-size: 12px; text-align: center; font-weight: 400; font-synthesis: none; letter-spacing: -1px; line-height: 11px; transition: none; animation: r9-notification-badge-flash 2.8s steps(2, end) infinite; z-index: 2;`
- `@media (prefers-reduced-motion: reduce)` — 非动画属性/结构：`含嵌套选择器/非 keyframe at-rule`。声明：`.vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge'] { animation: none !important; background-color: #21132d; color: #ffd9ee; border-color: #16112a; outline: none; box-shadow: inset 0 0 0 1px #ffe4f2; }`
- `html.reduce-effects .vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge']` — 非动画属性/结构：`background-color, border-color, box-shadow, color, outline`。声明：`animation: none !important; background-color: #21132d; color: #ffd9ee; border-color: #16112a; outline: none; box-shadow: inset 0 0 0 1px #ffe4f2;`

拆分建议：将本段的 `@keyframes` 规则移至冻结动画定义层；把命中上列的元素样式及其 reduced-motion / reduce-effects 覆盖留在可变样式层。

## SECTION cat-motion-r96

### @keyframes
```css
@keyframes r96-nav-cat {
0%,37%,76%,100%{transform:translate(0,0)}
5%,15%{transform:translate(0,-4px)}
10%{transform:translate(0,-8px)}
20%{transform:translate(0,0)}
24%{transform:translate(-2px,-4px)}
28%{transform:translate(-2px,-6px)}
33%{transform:translate(-2px,-2px)}
68%{transform:translate(2px,0)}
}
```
```css
@keyframes r96-social-cat {
0%,30%,78%,100%{background-size:16px 16px,18px 18px;background-position:0 5px,24px 4px}
6%,24%{background-position:0 5px,24px 2px}
12%{background-position:0 5px,24px 0}
18%{background-position:0 5px,24px 1px}
60%,72%{background-size:14px 14px,18px 18px;background-position:1px 6px,24px 4px}
66%{background-size:16px 16px,18px 18px;background-position:0 5px,25px 4px}
}
```

### 非 `@keyframes` 顶层规则（选择器/前序前 120 字符）
- `.vrcx-0-sidebar-surface [data-sidebar="content"]::after`
- `.vrcx-0-side-panel::after`
- `@media(prefers-reduced-motion:reduce)`
- `html.reduce-effects .vrcx-0-sidebar-surface [data-sidebar="content"]::after,html.reduce-effects .vrcx-0-side-panel::afte`

### 冻结层判断
不可整段冻结：段内包含普通元素/伪元素样式、覆盖/减弱动画的媒体查询或非动画声明。混入规则如下：
- `.vrcx-0-sidebar-surface [data-sidebar="content"]::after` — 非动画属性/结构：`opacity`。声明：`opacity:1;animation:r96-nav-cat 2s step-end infinite`
- `.vrcx-0-side-panel::after` — 非动画属性/结构：`background-position, height, opacity, top`。声明：`top:0;height:22px;opacity:1;background-position:0 5px,24px 4px;animation:r96-social-cat 2s step-end -1s infinite`
- `@media(prefers-reduced-motion:reduce)` — 非动画属性/结构：`含嵌套选择器/非 keyframe at-rule`。声明：`.vrcx-0-sidebar-surface [data-sidebar="content"]::after,.vrcx-0-side-panel::after{animation:none!important;transform:none;opacity:1}`
- `html.reduce-effects .vrcx-0-sidebar-surface [data-sidebar="content"]::after,html.reduce-effects .vrcx-0-side-panel::afte` — 非动画属性/结构：`opacity, transform`。声明：`animation:none!important;transform:none;opacity:1`

拆分建议：将本段的 `@keyframes` 规则移至冻结动画定义层；把命中上列的元素样式及其 reduced-motion / reduce-effects 覆盖留在可变样式层。

## 指定五段中的全部 keyframes 名称

1. `r5-charm-swing`
2. `r5-dialog-step-in`
3. `r5-spinner-step`
4. `r5-progress-flow`
5. `r7-tab-edge`
6. `r8-lace-flow`
7. `r8-nav-cursor`
8. `r8-window-press`
9. `r8-cat-hop`
10. `r9-notification-badge-flash`
11. `r96-nav-cat`
12. `r96-social-cat`

重名检查：未发现重复名称。
