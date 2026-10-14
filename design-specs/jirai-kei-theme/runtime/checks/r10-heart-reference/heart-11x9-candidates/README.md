# Task-58 candidate checks

- [Asset notes and full matrices](../../../../original-assets/r10-heart-reference/heart-11x9-candidates/README.md)
- [A · 13×11 wide rounded lobes](../../../../original-assets/r10-heart-reference/heart-11x9-candidates/A-wide-round-13x11.svg)
- [B · 13×13 tall classic](../../../../original-assets/r10-heart-reference/heart-11x9-candidates/B-tall-classic-13x13.svg)
- [C · 15×13 shallow cleft / soft base](../../../../original-assets/r10-heart-reference/heart-11x9-candidates/C-shallow-soft-15x13.svg)
- [Pink background comparison, 1×/2×/4×/6×](comparison-pink.png)
- [Dark background comparison, 1×/2×/4×/6×](comparison-dark.png)
- [Native titlebar occupancy: 32px bar, 14px slot](titlebar-occupancy.png)
- [Equations, parameters, matrices, profiles and validation](candidate-report.json)

Each option is derived from ellipse equations and rasterized on its own grid. Preview comparisons preserve the old V1 and current V2 as comparison-only; no official heart, CSS, or runtime artifact is rewritten.

Regenerate from the repository root:

```sh
node design-specs/jirai-kei-theme/runtime/checks/r10-heart-reference/heart-11x9-candidates/verify.mjs
```
