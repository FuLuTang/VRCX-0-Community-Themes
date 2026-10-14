# R10 status icon candidates — internal only

> Local design candidates only. The source is a flattened fandom collage with unclear reuse permission; do not publicly distribute without authorization. No production CSS/runtime has been changed.

## Source poses and exact crops

Source: `art-references/nso-fandom-desktop-icons-sheet.png` (1120×700, local SHA-256 `5c9d442eb5ceee97e4fadad0f877fd9045c545454a72601f84cee2f2d1f16453`). The selected status row uses a uniform **4×4 sheet-pixel logical grid**. Each crop is the tight component union (no padding):

| Candidate | Source crop (x,y,w,h) | Logical grid | Treatment |
|---|---:|---:|---|
| Phone / SOCIAL | 302, 450, 96×80 | 24×20 | source colors, transparent background, no added outline |
| Happy + heart / success toast | 442, 450, 96×80 | 24×20 source + 1 transparent cell + 1 ring cell | original sprite pixels, one transparent 4×4-source-pixel-grid gap, then `#2ed319` outer ring |
| Awkward lines / error toast | 722, 450, 96×80 | 24×20 source + 1 transparent cell + 1 ring cell | original sprite pixels, one transparent 4×4-source-pixel-grid gap, then `#ff6b8a` outer ring; crop includes both disconnected accent bars to the right |
| Shock / info + warning toast | 582, 450, 96×80 | 24×20 source + 1 transparent cell + 1 ring cell | original sprite stays crisp; separate ring uses four-sample antialiasing only on its outside edge |

The sheet itself is opaque RGB. The exact flat `#f8f0fa` canvas cells are converted to alpha 0; all such cells in the chosen crops connect to the crop exterior (no enclosed background cells). Every sampled source grid cell is a uniform 4×4 block; no anti-aliased source pixels were found. The original source colors are retained. The “awkward black lines” are the dark blue/purple `#5f62c1` marks in the selected source pose; they have not been recolored black.

The shock pose at source crop `(582,450,96×80)` is now used for both info and warning toast types. The original face remains a crisp pixel layer; each type gets a separate pale-pink (`#ffaddf`) or ask-me orange (`#e97c03`) ring layer. The ring keeps one full transparent logical cell next to the face; only its outer boundary uses four-sample subpixel coverage. [source-state-strip.png](../../runtime/checks/r10-status-toast-icons/source-state-strip.png) is context evidence only and includes that pose; it is not a runtime asset.

## Exact success and error colors

In the `VRCX-0-jirai` app source, `success` maps to `CircleCheckIcon` and `text-[var(--status-online)]` in `src/ui/shadcn/toast.tsx` (lines 20, 25); `src/styles/globals.css` defines `--status-online: #2ed319` (lines 117, 348). The success candidate uses that exact **`#2ed319`** color for its one-cell ring, with a full transparent logical-cell gap from the original figure. The error ring uses the user-requested **`#ff6b8a`**, with the same spacing. The source foreground pixels/palette remain unchanged.

## Files

- `social-phone.png` / `social-phone.svg` — unoutlined phone character; 96×80 PNG at source-sheet pixel scale (24×20 logical cells).
- `toast-success-heart-happy.png` / `.svg` — happy + heart pose with one transparent cell then the `#2ed319` ring; 112×96 PNG (28×24 logical cells).
- `toast-error-awkward-lines.png` / `.svg` — awkward-lines pose with one transparent cell then the `#ff6b8a` ring; 112×96 PNG (28×24 logical cells).
- The shock/info-warning face remains embedded as a 96×80 transparent crop in `status-icons-r10.css` and stays pixel-crisp.
- `toast-info-shock-ring.png` / `.svg` and `toast-warning-shock-ring.png` / `.svg` — separate 76×65 display-footprint outline layers. Their outer edges use four subpixel coverage samples per output pixel; the first logical cell around the face is hard-transparent.
- The phone files remain unchanged. The success/error PNGs preserve their 4×4 raster blocks and binary alpha; the new info/warning ring layers intentionally use partial alpha on their antialiased outer edges.

## Previews and validation

- [Old touching ring vs new one-cell-gap outline](../../runtime/checks/r10-status-toast-icons/touching-vs-gapped-outline.png)
- [Neutral / green-accent / error-accent scene comparison](../../runtime/checks/r10-status-toast-icons/status-context-comparison.png)
- [1×/2×/4× integer nearest-neighbor scale study](../../runtime/checks/r10-status-toast-icons/integer-nearest-scale-study.png)
- [Full source-row context](../../runtime/checks/r10-status-toast-icons/source-state-strip.png)
- [Pixel/alpha report with previous-candidate matrices and hashes](../../runtime/checks/r10-status-toast-icons/pixel-alpha-report.json)

The green/error filled backgrounds in the context sheet are accent-swatch stress tests, not proposed toast surfaces. The actual neutral app toast surface is `#211a33`; only the first row represents that dark neutral surface. All preview scale factors are integer nearest-neighbor. The phone crop is unchanged and is provided without an assumed animation or runtime placement; a later implementation can place its native 24×20 grid at SOCIAL’s upper-right and synchronize its loop with the existing plus/cat motion.

The old task-54 touching-ring candidates remain in the report as source matrices and hashes, have internal SVG/PNG snapshots ([success SVG](../../runtime/checks/r10-status-toast-icons/task54-touching-heart-happy.svg), [success PNG](../../runtime/checks/r10-status-toast-icons/task54-touching-heart-happy.png), [error SVG](../../runtime/checks/r10-status-toast-icons/task54-touching-awkward-lines.svg), [error PNG](../../runtime/checks/r10-status-toast-icons/task54-touching-awkward-lines.png)), and are shown next to the spaced versions in the comparison preview. The new rings use a Chebyshev distance of 2 source-grid cells from the original foreground: distance 1 is fully transparent, and the distance-2 band is exactly one grid cell thick.

Run `node design-specs/jirai-kei-theme/runtime/checks/r10-status-toast-icons/verify.mjs` from the repository root for the historical success/error source-grid checks. Run `node design-specs/jirai-kei-theme/runtime/checks/r10-status-toast-icons/generate-shock.mjs` to regenerate the info/warning ring layers and synchronize their embedded CSS PNGs; its 2×2 coverage pass is limited to the outer ring edge and leaves the one-cell gap hard-transparent.
