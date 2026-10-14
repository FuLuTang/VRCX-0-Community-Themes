# R9.6 banner frame check

This check implements selected option **#06 — perforated digital bezel** as an isolated CSS section. The production source is `../../banner-frame-r96.css`; the isolated builder output in `/tmp/jirai-r96-banner-frame/` is not part of the repository.

## Scope and layering

- Selector: an `.entity-dialog` card-header `div.relative` containing a direct 4:3, `aria-label`-bearing button and the current UserDialog bottom-left `absolute bottom-3 left-3 z-30 size-16` avatar shell. This deliberately distinguishes current R9 UserDialog media from R8, AvatarDialog, WorldDialog, GroupDialog, and generic entity-dialog fixtures.
- The outer wrapper `::before` paints only the frame at `inset:-4px`, `z-index:20`, `pointer-events:none`; it does not participate in layout or capture clicks.
- Existing X-stitch and scallop pseudos remain intact, with increased contrast/opacity and stack above the bezel (`21/22/23`). The app-owned avatar remains at `z-30` and keeps its pixel clip. The nameplate retains its original clearance.
- Static SVG: 328×248 viewBox, integer geometry, `crispEdges`, embedded data URI. Source SVG 1,996 bytes; URI 2,697 bytes; CSS section 3,987 bytes.

## Visibility tiers

- **Tier 1 (recommended; integrated):** X stitch `.52`, hem `.96`; pink/lilac contrast lift, without increasing the stitch geometry.
- **Tier 2 (comparison fixture only):** X stitch `.72`, hem `1.0`.
- Baseline is `.38/.90`. The comparison favors Tier 1: legible trim, with the photo remaining dominant.

## Checks and artifacts

`verify.mjs` uses the app stylesheet and isolated runtime bundle; it checks 1×/1.25×/1.5×/2× DPR, unchanged layout, avatar/name clearance, click-through, decoy isolation, and static reduced-motion behavior. Four 64×64 CSS-pixel corner crops are rendered at 4× (256×256 output).

- `before.png`, `after.png`, `tier-comparison.png`, `decoys.png`
- `dpr-1.png`, `dpr-1-25.png`, `dpr-1-5.png`, `dpr-2.png`
- `top-left-4x.png`, `top-right-4x.png`, `bottom-left-4x.png`, `bottom-right-4x.png`
- `verification.json` contains computed styles and assertions.

To rerun after an isolated runtime build, run `generate-css.mjs`, `append-section.mjs`, then `PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node verify.mjs` from the theme checkout. The Lead integration checker reports `integratedVsMovedLast=0` for R9 UserDialog, R8 UserDialog, popups, and overlays; only the R9 UserDialog fixture changes when the section is removed.
