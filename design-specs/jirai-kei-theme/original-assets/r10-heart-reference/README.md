# R10 reference heart assets — internal design preview

> Internal design study only. The reference image is a fandom collage with unclear reuse license; these redraws/previews are not cleared for public redistribution. No production runtime CSS, builder, preview package, or existing R9 heart assets were changed. **Status: the large brand heart is finalized as 11×10 (user-selected V1 domed cap3, with its two notch-side cap cells softened to a transition color — soft variant Y); runtime integration is scheduled separately by Lead.**

## Source transcription

Read from `art-references/nso-fandom-desktop-icons-sheet.png` (1120×700; local source SHA-256 `5c9d442eb5ceee97e4fadad0f877fd9045c545454a72601f84cee2f2d1f16453`). The small heart beside the pink-haired character’s love/happy pose occupies the 7×6 source-cell crop at source top-left **(510, 494)**; each logical pixel is a uniform **4×4 source-pixel** block, so the crop box is 28×24 source pixels. Some empty heart cells reveal the character’s hair because the source is flattened; those underlay colors are not part of the heart and are emitted as transparent cells.

The 7×6 matrix below is copied from the four sampled heart colors; empty cells are transparent:

```text
.OO.OO.
OHPOHPO
OPPPPSO
.OPSSO.
..OSO..
...O...
```

| Code | Source color | Role |
|---|---|---|
| `O` | `#ae387d` | dark-magenta outline |
| `H` | `#ffcced` | pale-pink highlight |
| `P` | `#ff87c6` | main pink body |
| `S` | `#cc5282` | darker pink lower/right shade |
| `.` | transparent | empty cell |

The base’s nontransparent cells are 1×1 SVG rects on a 7×6 integer grid. The 9×8 and 11×10 hearts are separately composed grids with the same silhouette language and palette, not scaled copies.

## Formal tiers (finalized)

| Tier | Grid | File | Bridge variable | Role |
|---|---|---|---|---|
| Small / base | **7×6** | [heart-7x6.svg](heart-7x6.svg) | `--jk-r10-heart-7-6` | exact source transcription (baseline) |
| Medium | **9×8** | [heart-9x8.svg](heart-9x8.svg) | `--jk-r10-heart-9-8` | independent grid |
| Large | **11×10** | [heart-11x10.svg](heart-11x10.svg) | `--jk-r10-heart-11-10` | **user-selected V1 domed cap3 + soft-Y corners** — formal large brand heart |

7×6 and 9×8 use the four source colors (`#ae387d` / `#ffcced` / `#ff87c6` / `#cc5282`); 11×10 uses the same four plus one transition color `#d760a2`, confined to two cells (see below). All three are native integer grids, `shape-rendering="crispEdges"`, 1×1 `<rect>` cells only.

## Large heart 11×10 (user-selected cap3, soft-Y corners)

`heart-11x10.svg` is the formal large heart. It is [heart-v1-domed/heart-v1-domed-cap3.svg](heart-v1-domed/heart-v1-domed-cap3.svg) (the old V1 11×9 shifted down one row, plus a 1-px-high, 3-cell outline cap on each lobe) **with exactly two cells softened: (4,0) and (6,0), the cap cells touching the center notch, change from outline `O #ae387d` to the transition color `T #d760a2`** (soft variant Y; pure-`O` pointed corners felt too sharp). Silhouette unchanged: 72 filled cells (24 outline `O`, 2 transition `T`, 3 `H`, 36 `P`, 7 `S`); the remaining `O` outline is a single 8-connected component.

```text
..OOT.TOO..
.OPPO.OHPO.
OHPPPOPHPPO
OPPPPPPPPSO
OPPPPPPPSSO
.OPPPPPPSO.
..OPPPPSO..
...OPPSO...
....OSO....
.....O.....
```

`T` = `#d760a2`, the per-channel average of `O` and `P` (214.5/95.5/161.5, rounded half-up). It appears **only** at (4,0) and (6,0). The brief quoted “~#d85fa1”; the exact rounded mean is used (≤1 per channel apart). Why Y rather than X (recoloring the same two cells with the existing shade `S #cc5282`, no new color): on the titlebar pink the tip nearly dissolves into the background (T 1.28:1 vs `O` 2.13:1 and `S` 1.53:1), and on dark it reads as a body-pink transition pixel instead of a reddish stray dot; `S` is the lower-right shade color and is semantically wrong on an upper-edge corner. Both candidates, their matrices/color table, and the unsoftened original are in [heart-11x10-soft/](heart-11x10-soft/README.md); **to roll back, restore [heart-11x10-soft/heart-11x10-cap3-original.svg](heart-11x10-soft/heart-11x10-cap3-original.svg)** (byte-identical to the pre-soft `heart-11x10.svg`).

The other convex corners — (2,0)/(8,0) cap ends, (1,1)/(9,1) shoulders, (4,1)/(6,1) notch walls — were evaluated and deliberately **left as `O`**: each sits on a clean 45° staircase or on the notch wall, and recoloring them chips the silhouette or breaks the single outline.

**Footprint / integration notes**

- It is **one row taller** than the old 11×9, i.e. native **11×10** (1× = **11×10 CSS px**). Any `mask-size` / `background-size` must be an integer multiple of 11×10 (`11px 10px` at 1×, `22px 20px` at 2×); never keep `11px 9px`, which would squash a row and blur every edge.
- It fits the **14 px slot** at 1× (3 px spare horizontally, 4 px vertically). Because 7, 9 and 11 are odd and 14 is even, `background-position:center` lands on half pixels in a 14 px box; use explicit integer positions, or (recommended) size the pseudo box to **11×10** and position the frames at `2px 2px` (7×6), `1px 1px` (9×8), `0 0` (11×10), all integral.
- It is an independent multicolor grid, not a scaled copy of 9×8 / 7×6; use `background-image`, not a single-color mask.

## Deprecated / comparison-only assets (do not use)

**旧 11×9 V1/V2 与 A/B/C 候选已弃用，仅供比较。** They are kept byte-for-byte unchanged (frozen by SHA-256 in `verify.mjs`) and are no longer drawn in the regenerated previews:

- [heart-11x9.svg](heart-11x9.svg) — old 11×9 **V2** (round draft from task-56), deprecated.
- Old 11×9 **V1** — only survives as the deprecated data URI `--jk-r10-heart-11-9` in [heart-assets-r10.css](heart-assets-r10.css) (commented 已弃用，勿用) and as a matrix in `pixel-report.json`.
- [heart-11x9-candidates/](heart-11x9-candidates/) — A/B/C candidate sheets, deprecated.
- [heart-v1-domed/](heart-v1-domed/) — cap2/cap3/cap4 variants; cap3 was selected and is copied to `heart-11x10.svg`, cap2/cap4 are deprecated. Directory left untouched.

Old V1 11×9 matrix (for the record, deprecated):

```text
.OOOO.OOOO.
OHPPPOPHPPO
OPPPPPPPPSO
OPPPPPPPSSO
.OPPPPPPSO.
..OPPPPSO..
...OPPSO...
....OSO....
.....O.....
```

Old V2 11×9 matrix (`heart-11x9.svg`, deprecated):

```text
...OO.OO...
..OHPOPHO..
.OPPPPPPPO.
OPPPPPPPPPO
.OPSPPPSPO.
..OPSPSPO..
...OPSPO...
....OPO....
.....O.....
```

Full source-cell samples, color counts, dimensions and contrast values are in [pixel-report.json](../../runtime/checks/r10-heart-reference/pixel-report.json). The source context, exact 28×24px crop, and isolated base heart are in [source-context.png](../../runtime/checks/r10-heart-reference/source-context.png), [source-crop-7x6.png](../../runtime/checks/r10-heart-reference/source-crop-7x6.png), and [source-heart-isolated.png](../../runtime/checks/r10-heart-reference/source-heart-isolated.png).

## CSS data-URI bridge

[heart-assets-r10.css](heart-assets-r10.css) (not loaded by any runtime build) defines four variables on `:root`. Each payload is the canonical `encodeURIComponent` of the SVG file; `verify.mjs` decodes them and compares with the SVG on disk.

| Variable | Status |
|---|---|
| `--jk-r10-heart-7-6` | formal, unchanged |
| `--jk-r10-heart-9-8` | formal, unchanged |
| `--jk-r10-heart-11-10` | **formal large (cap3 + soft Y; payload re-encoded)** |
| `--jk-r10-heart-11-9` | **deprecated old V1 — 已弃用，勿用**; kept byte-identical for comparison |

## Contrast against target backgrounds

Ratios use WCAG relative luminance; titlebar `#d97fc6`, dark window `#201936`.

| Color | Hex | On titlebar pink | On dark window |
|---|---:|---:|---:|
| Outline | `#ae387d` | 2.13:1 | 2.92:1 |
| Highlight | `#ffcced` | 1.94:1 | 12.05:1 |
| Body | `#ff87c6` | 1.22:1 | 7.60:1 |
| Shade | `#cc5282` | 1.53:1 | 4.07:1 |
| Transition (11×10 only, 2 cells) | `#d760a2` | 1.28:1 | 4.85:1 |

These are the colors from the source heart; on the titlebar pink, no individual source color reaches 3:1. This is recorded rather than silently darkening the reference. If a stronger non-text contrast target is required, request approval to change the artwork palette before integration.

## Comparison previews

All previews are regenerated by `verify.mjs` and show only the three formal tiers (nearest-neighbor, integer scale). Every edge ≤2000px.

- Soft-corner A/B (cap3 vs X vs Y, 1×–6×, plus 14px-slot 4×): see [heart-11x10-soft/](../../runtime/checks/r10-heart-reference/heart-11x10-soft/)
- [7×6 / 9×8 / 11×10 at 1×/2×/4×/6× on `#d97fc6`](../../runtime/checks/r10-heart-reference/comparison-pink.png) (1× row has a dashed 14px slot)
- [7×6 / 9×8 / 11×10 at 1×/2×/4×/6× on `#201936`](../../runtime/checks/r10-heart-reference/comparison-dark.png)
- [5/7/9px-wide display study; 11×10 shown reduced at 9×8px plus native 11×10px in the 14px slot](../../runtime/checks/r10-heart-reference/display-5-7-9.png)

For production pixel fidelity use the native 7×6 / 9×8 / 11×10 grids rather than resizing them; the 5/7/9px sheet is a downscale study only.

## Suggested animation mapping — not integrated

Preserve the 2.5s, five-step rhythm **小小中大中** (small–small–medium–large–medium):

| Sample point | Suggested grid | Native size |
|---:|---|---:|
| 0% / 250ms | small | 7×6 |
| 20% / 750ms | small | 7×6 |
| 40% / 1250ms | medium | 9×8 |
| 60% / 1750ms | large | 11×10 |
| 80% / 2250ms | medium | 9×8 |

For `prefers-reduced-motion` and `html.reduce-effects`, still use a static **9×8 medium** heart. Because these are multicolor SVGs, a future pseudo-element integration should swap `background-image` plus native `background-size`/`background-position` with `steps(1,end)`, not tint a single-color mask.

Example mapping only (not integrated; pseudo box 11×10, all positions integer):

```css
@keyframes r10-brand-heart-pixels {
  0%, 20%, 100% { background-image: var(--jk-r10-heart-7-6);   background-size: 7px 6px;   background-position: 2px 2px; }
  40%, 80%      { background-image: var(--jk-r10-heart-9-8);   background-size: 9px 8px;   background-position: 1px 1px; }
  60%           { background-image: var(--jk-r10-heart-11-10); background-size: 11px 10px; background-position: 0 0; }
}

/* On the titlebar pseudo-element */
.vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after {
  width: 11px; height: 10px; transform: none;
  -webkit-mask: none; mask: none;
  background-color: transparent;
  background-image: var(--jk-r10-heart-7-6);
  background-position: 2px 2px;
  background-repeat: no-repeat;
  background-size: 7px 6px;
  image-rendering: pixelated;
  animation: r10-brand-heart-pixels 2.5s steps(1, end) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after {
    animation: none !important;
    background-image: var(--jk-r10-heart-9-8) !important;
    background-size: 9px 8px !important;
    background-position: 1px 1px !important;
  }
}
html.reduce-effects .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after {
  animation: none !important;
  background-image: var(--jk-r10-heart-9-8) !important;
  background-size: 9px 8px !important;
  background-position: 1px 1px !important;
}
```

On titlebar pink, the sampled outline is only 2.13:1; all four source colors are below 3:1 there. The exact source palette is retained here for fidelity, not presented as an AA-compliant non-text contrast treatment.

## Verification

Run `node design-specs/jirai-kei-theme/runtime/checks/r10-heart-reference/verify.mjs` from the repository root. It validates the source crop/cell colors, the exact base matrix, one-cell outlines, separate integer grids, that `heart-11x10.svg` equals the cap3 matrix except exactly (4,0)/(6,0) `O→T` (plain 1×1 crispEdges rects, four colors plus a single transition color confined to those two cells, single 8-connected `O` outline, cell-by-cell raster check), that the CSS bridge variables decode to the SVG files (7×6 / 9×8 declarations byte-identical to before, 11-9 still old V1 and marked deprecated), that all old/deprecated assets are unmodified (SHA-256), no interpolated native colors, contrast values, and preview dimensions (each edge ≤2000px). The script never writes asset files; it only regenerates the PNG previews and `pixel-report.json` under `runtime/checks/r10-heart-reference/`.
