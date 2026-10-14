# R9 titlebar pixel hearts — handoff

## Files and evidence

Three independently drawn one-pixel grids; no shared SVG path scaled to other sizes:

- `../heart-9x9.svg` — 9×9 grid, 55 occupied pixels.
- `../heart-7x7.svg` — 7×7 grid, 33 occupied pixels.
- `../heart-5x5.svg` — 5×5 grid, 16 occupied pixels.
- `../heart-assets-r9.css` — three `data:image/svg+xml` variables for `background-image`; append this asset block to the theme asset section before using the runtime snippets below.

Style source: `original-assets/r5/src/heart.svg` uses a crisp 1-cell outline `rgb(52,49,106)` (`#34316a`), pink fill `rgb(244,183,217)`, and pale highlight `rgb(248,240,250)`. The existing icon at `original-assets/src/s7-heart-12x12.svg` is instead a smooth cubic Bezier silhouette filled by the mask as `#16112a`. The new outline reuses the R5 source color, while fill/highlight use the Jirai palette.

## Palette and contrast

Computed with WCAG relative luminance against the titlebar fallback `#d97fc6` (`runtime/window-chrome.css:21`) and the dark window `#201936` (`runtime/windose-runtime.css:2`). Values are rounded to 2 decimals.

| Role | Hex | On pink `#d97fc6` | On dark `#201936` |
|---|---:|---:|---:|
| 1px dark-purple outline | `#34316a` | **4.35:1** | 1.43:1 |
| Pink body | `#ffb8e6` | 1.70:1 | **10.57:1** |
| Upper-left highlight | `#fdf4ff` | 2.51:1 | **15.60:1** |

This is a decorative, non-text mark. The outline clears the 3:1 non-text contrast threshold on the pink titlebar; on the dark window, the pink body/highlight provide the strong silhouette contrast, while the intentionally dark purple edge blends with the Jirai night palette. No pixel uses black.

## Visual checks

- [Old smooth heart vs 9×9/7×7/5×5, 1×/2×/4×/6× on titlebar pink](comparison-pink.png)
- [Same comparison on dark window](comparison-dark.png)
- [5/7/9 CSS-pixel display inside the 14px pseudo box, with ×8 nearest-neighbor detail](native-sizes.png)
- Machine-readable palette and grid report: [contrast-report.json](contrast-report.json)

The comparison renderer scales new SVGs with nearest-neighbor only; the legacy 12×12 Bezier remains antialiased. Native SVG cells are tested as integer 1×1 rectangles, every silhouette edge is exactly one cell thick, and native render pixels are restricted to the three declared colors plus transparency. All preview images are below 2000px on both axes. Run `node design-specs/jirai-kei-theme/original-assets/r9-heart/checks/verify.mjs` from the repository root to regenerate the previews/report and checks.

## Animation handoff

Keep the existing 2.5s `steps(1, end)` five-frame rhythm; swap the old small/small/medium/large/medium mask sizes for the dedicated source grids **5/5/7/9/7px**. Each frame is 500ms: 0–500ms 5px, 500–1000ms 5px, 1000–1500ms 7px, 1500–2000ms 9px, 2000–2500ms 7px. The two small frames remain intentionally identical. For reduced motion and `html.reduce-effects`, use a static **7×7** heart: it keeps the silhouette legible without looking like a large heartbeat frame.

### Asset variable bridge

`heart-assets-r9.css` contains the full inline SVG data URIs as `--jk-r9-heart-5`, `--jk-r9-heart-7`, and `--jk-r9-heart-9`. Add that block to the built asset section (the existing `build-runtime.mjs` bundles `original-assets/dist/jirai-assets.css`); no runtime/build file was changed in this task. The SVG artwork is multicolor, so the pseudo must use `background-image`; `mask` plus a single `background-color` would erase its separate outline/body/highlight colors.

### Replacement for `runtime/window-chrome.css:257–269`

```css
.vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -15px;
    width: 14px;
    height: 14px;
    transform: translateY(-50%);
    pointer-events: none;
    background-color: transparent;
    background-image: var(--jk-r9-heart-7);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 7px 7px;
}
```

### Replacement for `runtime/brand-heart-r9.css`

```css
/* R9 multicolor pixel-heart refinement; load after window-chrome.css and motion-r8.css. */
@keyframes r9-brand-heart-pixels {
  0%, 20%, 100% {
    background-image: var(--jk-r9-heart-5);
    background-size: 5px 5px;
  }
  40%, 80% {
    background-image: var(--jk-r9-heart-7);
    background-size: 7px 7px;
  }
  60% {
    background-image: var(--jk-r9-heart-9);
    background-size: 9px 9px;
  }
}

.vrcx-0-titlebar[data-app-titlebar] [data-slot='menubar'] [data-slot='menubar-trigger']:has(> .vrcx-0-brand) {
  padding-right: 21px;
}

.vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after {
  width: 14px;
  height: 14px;
  transform-origin: center center;
  background-color: transparent;
  background-image: var(--jk-r9-heart-7);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 7px 7px;
  animation: r9-brand-heart-pixels 2.5s steps(1, end) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after {
    animation: none !important;
    background-image: var(--jk-r9-heart-7) !important;
    background-size: 7px 7px !important;
  }
}

html.reduce-effects .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after {
  animation: none !important;
  background-image: var(--jk-r9-heart-7) !important;
  background-size: 7px 7px !important;
}
```

The 14×14 pseudo box, centered positioning, pointer transparency, and existing 21px brand-trigger padding are preserved. Only the source artwork and animated frame property change; no `mask`, `mask-size`, or single-color fill is used.
