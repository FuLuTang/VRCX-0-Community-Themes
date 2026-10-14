# R10-G3 overlays — NOT WINDOWS

`overlays-r10.css` skins ordinary tooltips, hover-card outer shells, Base UI toast roots, and the notification-center sheet. The verification fixture uses fictional text and source-shaped DOM; it is not a live application or Windows acceptance test.

## Styling choices

- Opaque `#211a33` surfaces, `#f2ebff` text, 1px `#6c5ce0` frame, inset bevel and hard offset shadow; square corners.
- Ordinary tooltip arrow is hidden: the source diamond conflicts with the square window language. Tooltip content geometry changes by at most 2px.
- Tooltip rules exclude the server/WebSocket status-stack signatures handled by `popups-r9.css`; fixture compares their computed style and arrow before/after.
- Hover-card changes are restricted to the outer `data-slot=hover-card-content`; avatar, image, and ring shape remain unchanged.
- Toast root uses a 4px pink left stripe. Notification sheet is anchored to its source `BellIcon` within `sheet-title`, receives a pink Win98-style header; other sheets and dialog surfaces are excluded.
- No new animations. Surface transitions are disabled; `prefers-reduced-motion` and `html.reduce-effects` remain static.

## Verification

```sh
JIRAI_OUT=/tmp/jirai-r10-out-overlays/jirai-kei-theme \
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers \
SHARP_MODULE=/tmp/dsh-theme-tools/node_modules/sharp node build-isolated.mjs
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node verify.mjs
```

The wrapper imports the unchanged builder and suppresses its legacy charm write only if byte-identical. All build output goes to `/tmp`. The verifier applies the compiled R9 baseline and appends the new CSS for an isolated before/after comparison. Automated checks passed: statusbar tooltip untouched; generic tooltip/hover-card/toast/notification sheet hit; unrelated sheet and entity-dialog decoys unchanged; text contrast ≥4.5:1; surface geometry delta ≤2px; keyboard focus visible; reduced-motion modes static.

Evidence: `before.png`, `after.png`, `comparison.png`, and `verify-report.json`. Live app checks still needed for actual portal composition, viewport collision/wrapping, and toast type/swipe behavior.
