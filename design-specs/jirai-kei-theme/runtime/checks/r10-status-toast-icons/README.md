# R10 status-toast icon local checks

This folder contains reproducible source crops, alpha/pixel validation, and design-review previews. No production runtime code was changed.

- [Asset handoff and exact crop/color notes](../../../original-assets/r10-status-toast-icons/README.md)
- [Source-row context (yellow shock pose appears only as evidence)](source-state-strip.png)
- [Pixel/alpha/component report with archived old candidates](pixel-alpha-report.json)
- [Old touching ring vs new one-cell-gap comparison](touching-vs-gapped-outline.png)
- Previous touching-ring snapshots: [success SVG](task54-touching-heart-happy.svg), [success PNG](task54-touching-heart-happy.png), [error SVG](task54-touching-awkward-lines.svg), [error PNG](task54-touching-awkward-lines.png)
- [Neutral/green/error accent context comparison](status-context-comparison.png)
- [1×/2×/4× integer nearest scale study](integer-nearest-scale-study.png)

Run from the repository root:

```sh
node design-specs/jirai-kei-theme/runtime/checks/r10-status-toast-icons/verify.mjs
```

The script samples the three tight crops on a 4×4 source-cell lattice, confirms their source component bounds and uniform cells, and keys only the exact flat `#f8f0fa` sheet backdrop to alpha 0. It verifies the previous touching-ring SVG/PNG before replacement; the new success/error files preserve all original foreground colors, leave one transparent logical cell, then add a one-cell status-color ring. It checks RGBA alpha=0/255, 4×4 raster uniformity and integer nearest-neighbor previews. The phone asset and yellow shock state are untouched.
