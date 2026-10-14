# R10 heart reference checks

This directory contains only internal design-review previews and the reproducible source/grid/contrast check. It does not modify or deploy runtime CSS. Formal tiers: 7×6 / 9×8 / 11×10 (cap3 with soft-Y corner cells `#d760a2` at (4,0)/(6,0)); old 11×9 V1/V2 and A/B/C are deprecated, comparison only.

- [Asset handoff, pixel matrices, palette, animation advice](../../../original-assets/r10-heart-reference/README.md)
- [Exact 7×6 base SVG](../../../original-assets/r10-heart-reference/heart-7x6.svg)
- [9×8 variant SVG](../../../original-assets/r10-heart-reference/heart-9x8.svg)
- [11×10 formal large SVG (user-selected cap3)](../../../original-assets/r10-heart-reference/heart-11x10.svg)
- [Old 11×9 V2 SVG — deprecated, comparison only](../../../original-assets/r10-heart-reference/heart-11x9.svg)
- [CSS data-URI bridge (`--jk-r10-heart-11-10` formal; `--jk-r10-heart-11-9` deprecated)](../../../original-assets/r10-heart-reference/heart-assets-r10.css)
- [Soft-corner A/B check (cap3 vs X vs Y) + its own verify.mjs](heart-11x10-soft/)
- [Full JSON verification report](pixel-report.json)
- [Source context crop](source-context.png)
- [Exact 7×6 (28×24px source) crop](source-crop-7x6.png)
- [Isolated source heart](source-heart-isolated.png)
- [7×6 / 9×8 / 11×10 at 1×/2×/4×/6× on pink](comparison-pink.png)
- [7×6 / 9×8 / 11×10 at 1×/2×/4×/6× on dark](comparison-dark.png)
- [5/7/9px display study + native 11×10 in the 14px slot](display-5-7-9.png)

Run from the repository root:

```sh
node design-specs/jirai-kei-theme/runtime/checks/r10-heart-reference/verify.mjs
```

The script samples the source at `(510,494)` with 4×4 source-pixel cells and confirms all 42 cell blocks against the recorded source colors/underlay. It then checks the source-derived 7×6 grid, the independent 9×8 / 11×10 grids, that `heart-11x10.svg` equals the user-selected cap3 matrix except exactly (4,0)/(6,0) `O→T` (plain 1×1 `crispEdges` rects, four colors plus one transition color confined to those two cells, single 8-connected `O` outline), that the CSS bridge variables decode to the SVG files, that the old 11×9 V1/V2, A/B/C candidates, domed caps and the 7×6 / 9×8 bridge declarations are unchanged (frozen SHA-256), exact palette pixels, contrast values, and preview dimensions (≤2000px per side). It never writes asset files; it only regenerates the previews and `pixel-report.json`. Source art provenance is unclear; keep all output internal pending permission.

The subdirectories `heart-11x9-candidates/` and `heart-v1-domed/` are earlier comparison studies with their own scripts and are deprecated / untouched; `heart-11x10-soft/` holds the soft-corner A/B check (own `verify.mjs`, previews and report).
