# Provenance: original S1–S11 vector motifs

## Authorship / source boundary

Every source SVG in `src/` was drawn as new generic geometry from the construction descriptions in `asset-pipeline.md`. No reference image was placed under the drawing, sampled for coordinates/colors, traced, or auto-vectorized; no copied pixels or third-party artwork are present. Organic contours use explicit path commands; the S8/S9/S10 pixel marks use hand-authored unit-grid paths/rectangles. The paths intentionally avoid text, image, gradients, filters, strokes, remote links, and multiple colors.

Suggested package license: **GPL-3.0-only**, matching the theme repository. This is a recommendation for the eventual source package, not legal advice; the project owner still needs to confirm the license before publication. Accent colors in `palettes.json` are temporary demonstration parameters, not a palette decision. The motifs are only a source/specimen package; nothing was merged into a theme.

## Round 2 (2026-10-11, Lead)

Round 1 was drawn by teammate `jirai-luna`, which stopped mid-task twice (model quota). Review of `specimen-dpr-2.webp` found S1 rendered as triangles, S2/S5 unreadable, S8 broken, S10 without a cloud shape and S11 too small. The Lead regenerated S1, S2, S4, S5, S8 (both layers), S9, S10 and S11 with `gen.mjs`, which computes every path from the written construction rule in its comments (arcs, Bayer dithering, explicit pixel rows). No reference image was opened by the script or used for coordinates. S3, S6 and S7 are unchanged from round 1. The table below describes the **current** files; round-1 descriptions for replaced assets are superseded.

| ID / file | Round 2 construction |
|---|---|
| S1 both sizes | Solid top band; a half-ellipse whose width equals the period, so neighbouring scallops meet at a point; one counter-wound eyelet per scallop. |
| S2 | Band plus a fan whose rim is five small arcs placed on a half circle; three radial ellipse holes and a hinge pin hole. |
| S4 | Two laces zig-zag between eyelets at y=0 and y=16, so vertical repetition is continuous; lace A passes over lace B, which is cut at the crossing; split eyelet rings reassemble across tiles. |
| S5 | Two loops with inner holes (even-odd), a square knot and two diverging tails. |
| S8 | Explicit 9×8 heart rows merged into runs, offset one cell inside 12×8; highlight is three cells at the upper left. |
| S9 | Eight 2-unit steps of a 1-unit line forming a stair zig-zag. |
| S10 | Five circles define a cloud; density outside the core falls off and is thresholded with a 4×4 Bayer matrix on 2-unit cells; runs merged. |
| S11 | Heart (three sizes), bow, Latin cross, faceless two-ear rabbit silhouette and a bandage with four pin holes, all kept clear of tile edges. |

Build change: only edge strips (S1, S2, S3) get mode-B baked copies, because only scroll containers need them. Totals: masks 8,556 B, baked 3,150 B, all inline URIs 11,706 B, generated CSS 12,249 B.

## Asset-by-asset notes (round 1; superseded rows noted above)

| ID / file | Construction and intended usage |
|---|---|
| S1 `s1-scallop-16x8.svg` | Hand-authored filled band with repeating rounded drop lobes and two small even-odd eyelets; 16×8 tile for titlebar/statusbar strips and top/bottom edges. |
| S1 `s1-scallop-24x12.svg` | Independently drawn larger wave: three broad lobes under a narrow header strip, eyelets cut from two lobes; useful where a less dense period is preferred. |
| S2 `s2-fan-lace-20x12.svg` | Filled stepped fan / small fan-shaped bays, with three open eyelet holes; a more dramatic edge for the dark direction, not an imported lace border. |
| S3 `s3-stitch-8x4.svg` | Two hand-positioned filled dashes separated by a visible gap; 8×4 repeat for low-key card inset stitch lines. |
| S4 `s4-lacing-column-16x16.svg` | Two diagonal filled strap bands crossing in a unit-aligned weave, with a small negative center aperture; repeated as a narrow cover-side column. |
| S5 `s5-lacing-end-knot-24x16.svg` | Three separately composed fill regions: outward lace ends, center gathered knot, and short split tails; terminal tie ornament for S4. |
| S6 `s6-bow-24x16.svg` | Original two-loop silhouette, center diamond knot, and tapering tails; composed entirely with filled bezier polygons. |
| S6 `s6-bow-32x20.svg` | Larger independently proportioned bow with broader loops and tails for cards or empty states. |
| S7 `s7-heart-12x12.svg` | Compact round-top heart silhouette authored as one cubic path; small separators/quiet data-adjacent accents only. |
| S7 `s7-heart-16x16.svg` | Larger, slightly fuller cubic heart with a softened top cleft and point; can support more air around the motif. |
| S8 `s8-pixel-heart-body-12x8.svg` | Filled unit-grid body of a generic pixel heart on a 12×8 repeat-safe canvas, keeping an approximately 9×8 pixel-art core. `crispEdges` preserves grid edges. |
| S8 `s8-pixel-heart-highlight-12x8.svg` | Two sparse one-color block highlights, stored separately so themes can layer it over the body with a distinct CSS token. `crispEdges` enabled. |
| S9 `s9-pixel-zigzag-16x8.svg` | A single filled alternating step band across a 16×8 grid; a quiet desktop texture candidate; `crispEdges` enabled. |
| S10 `s10-dither-cloud-64x32.svg` | Deterministic hand-placed 1×1 square marks, denser on the upper-left and sparse toward the lower-right; a corner/empty-state cloud, not a data-table background. `crispEdges` enabled. |
| S11 `s11-symbol-sprinkle-96x96.svg` | A manually composed broad repeat containing generic heart, bow, ordinary upright Latin cross, abstract rabbit-head-like silhouette, bandage, and tiny dots. No character likeness, brand mark, or reversed cross. |

## Constraints and caveats

- SVG viewBoxes begin at (0,0), use integer dimensions, and each period is divisible by 4. S8’s 9×8 conceptual core sits on a 12×8 repeat tile.
- The source paths only use a single black fill; CSS supplies mask colors. B-mode copies bake the chosen palette fill at build time.
- Pixel/dither art has `shape-rendering="crispEdges"`. DPR captures test typical browser rasterization, but do not guarantee every source grid unit maps to an integer device pixel at fractional DPR; the tile dimensions/periods stay integral at 125% and 150%.
- Art is decorative, not semantic. Never use it to indicate status, error, danger, checked state, or focus, and keep it out of hit targets and text columns.
- `provenance.md`, specs, and generated screenshots do not assert live VRCX runtime integration. The specimen only demonstrates Chromium CSS handling of inline URLs, masks, and scroll-container backgrounds.
