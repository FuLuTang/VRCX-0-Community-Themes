# Large-heart candidates A/B/C — internal design study

> Local design candidates only. Source-art reuse rights remain unclear; do not publicly redistribute. This study does not update the [formal 11×9 SVG](../heart-11x9.svg), [CSS bridge](../heart-assets-r10.css), runtime CSS, builder, package, or deployment. The existing [7×6](../heart-7x6.svg) / [9×8](../heart-9x8.svg) assets, current V2, and original V1 comparison matrix remain unchanged.

## Shared palette

| Code | Color | Role |
|---|---|---|
| `O` | `#ae387d` | one-cell outline |
| `H` | `#ffcced` | twin-lobe highlights |
| `P` | `#ff87c6` | main body |
| `S` | `#cc5282` | lower inner shade |
| `.` | transparent | empty cell |

Each SVG is an independently sampled native integer grid; none is a resized copy. Candidate silhouettes are generated from ellipse equations, sampled at logical-cell centers, then colored with the four source-heart roles. The report records all equation parameters and matrices.

## Candidate directions

- **A — wider, round double lobes:** 13×11; broad twin upper ellipses and a short rounded taper.
- **B — taller classic heart / waist:** 13×13; deeper central cleft, narrower lobes, and longer taper.
- **C — shallow cleft / softer base:** 15×13; early central fill and an elliptical lower cap giving a 5/5/3/1 final taper. It is one native pixel wider than the established 14px titlebar slot.

The equation coordinate system is `x = column − (width−1)/2`, `y = row`. A cell is included when its center falls inside the union of the listed ellipses; `≤1` is the ellipse interior. A/B use two lobe ellipses plus a downward half-ellipse. C uses the same two-lobe construction, a clipped lower-body ellipse, and a smaller lower-cap ellipse.

### A · wide round lobes · 13×11

`((x+3.5)/3)^2 + ((y−1.4)/2.4)^2 ≤ 1` OR `((x−3.5)/3)^2 + ((y−1.4)/2.4)^2 ≤ 1` OR (`y≥2` AND `(x/6.2)^2 + ((y−2)/8)^2 ≤ 1`).

Row span widths: `[11,13,13,13,13,11,11,9,9,7,1]`  
Ink counts (the top rows include a cleft): `[8,12,13,13,13,11,11,9,9,7,1]`

```text
.OOOO...OOOO.
OPHHPO.OPHHPO
OPHHPPOPPHHPO
OPPPPPPPPPPPO
OPPPPPPPPPPPO
.OPPPPPPPPPO.
.OSSPPPPPSSO.
..OSPPPPPSO..
..OSSPPPSSO..
...OOOPOOO...
......O......
```

[Open A SVG](A-wide-round-13x11.svg)

### B · tall classic waist · 13×13

`((x+2.9)/2.8)^2 + ((y−1.4)/2.6)^2 ≤ 1` OR `((x−2.9)/2.8)^2 + ((y−1.4)/2.6)^2 ≤ 1` OR (`y≥3` AND `(x/6.2)^2 + ((y−3)/9)^2 ≤ 1`).

Row span widths: `[11,11,11,13,13,13,11,11,11,9,7,5,1]`  
Ink counts: `[10,10,10,13,13,13,11,11,11,9,7,5,1]`

```text
.OOOOO.OOOOO.
.OPHHO.OHHPO.
.OHHHO.OHHHO.
OPPPPPOPPPPPO
OPPPPPPPPPPPO
OPPPPPPPPPPPO
.OPPPPPPPPPO.
.OSSPPPPPSSO.
.OSSPPPPPSSO.
..OSPPPPPSO..
...OSPPPSO...
....OOPOO....
......O......
```

[Open B SVG](B-tall-classic-13x13.svg)

### C · shallow cleft / soft base · 15×13

Two lobe ellipses: `((x+3.2)/3.5)^2 + ((y−1.2)/2.2)^2 ≤ 1` and `((x−3.2)/3.5)^2 + ((y−1.2)/2.2)^2 ≤ 1`; union with body ellipse `(x/7.2)^2 + ((y−1.5)/7.2)^2 ≤ 1` for `1.5≤y≤8`, plus cap ellipse `(x/2.5)^2 + ((y−9)/3)^2 ≤ 1` for `y≥8`.

Row span widths: `[13,13,15,15,13,13,11,9,7,5,5,3,1]`  
Ink counts: `[12,13,15,15,13,13,11,9,7,5,5,3,1]`

```text
.OOOOOO.OOOOOO.
.OPHHPPOPPHHPO.
OPPHHPPPPPHHPPO
OPPPPPPPPPPPPPO
.OPPPPPPPPPPPO.
.OPPPPPPPPPPPO.
..OPPPPPPPPPO..
...OSPPPPPSO...
....OSPPPSO....
.....OPPPO.....
.....OPPPO.....
......OPO......
.......O.......
```

[Open C SVG](C-shallow-soft-15x13.svg)

## Visual / placement review

- [Pink background `#d97fc6`, V1/V2/A/B/C at 1×/2×/4×/6×](../../../runtime/checks/r10-heart-reference/heart-11x9-candidates/comparison-pink.png)
- [Dark background `#201936`, V1/V2/A/B/C at 1×/2×/4×/6×](../../../runtime/checks/r10-heart-reference/heart-11x9-candidates/comparison-dark.png)
- [32px titlebar rows with 14px slot, native-size icons](../../../runtime/checks/r10-heart-reference/heart-11x9-candidates/titlebar-occupancy.png)
- [Equations, matrices, row profiles, palette counts and validation](../../../runtime/checks/r10-heart-reference/heart-11x9-candidates/candidate-report.json)

The titlebar study uses the existing 14px slot from the previous heart display study and the observed 32px titlebar height ([AppTitleBar.tsx:96](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/layout/AppTitleBar.tsx#L96>) uses `h-8`). Icons are displayed at 1 CSS px per logical cell; only the complete preview sheet is enlarged 4× for inspection. A and B fit the 14px slot; C is 15px wide and exceeds it by 1px. These remain options for the user to choose, not a selected/final asset.

Run `node design-specs/jirai-kei-theme/runtime/checks/r10-heart-reference/heart-11x9-candidates/verify.mjs` from the repository root to regenerate candidates and previews. No formal heart or runtime file is written.