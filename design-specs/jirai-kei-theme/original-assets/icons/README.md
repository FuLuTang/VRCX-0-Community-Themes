# Windose pixel icons

Lucide-react 1.46.0 derived pixel glyphs, including 50 manually refined glyphs.
249 production import names resolve to 243 canonical glyphs. The production snapshot is [used-icons.json](<used-icons.json>); generated source metadata lives in [index](<src/_index.json>). Upgrade the application or Lucide version only after re-auditing this snapshot.

## License

These are derived works, not wholly original drawings. Preserve the complete [Lucide ISC / Feather MIT notice](<LUCIDE-LICENSE.txt>) with distribution. The CSS build embeds the notice as well; do not strip license comments when assembling a theme.

## Rebuild

Install `sharp` and `lucide-react@1.46.0` in a local tooling environment, or provide their paths:

```bash
SHARP_MODULE=/path/to/node_modules/sharp \
LUCIDE_ICONS_DIR=/path/to/node_modules/lucide-react/dist/esm/icons \
node gen-icons.mjs
node hand-r8.mjs  # reviewed circular-arrow overrides; no Lucide install needed
node hand-r96.mjs # reviewed settings gear override
node build-icons.mjs
```

If rebuilding historical `hand-batch1.mjs` / `hand-batch2.mjs`, their History / Refresh entries now reference `hand-r8.mjs`; run `hand-r8.mjs` afterward to restore the other three reviewed circular-arrow overrides. Do **not** run `gen-icons.mjs` just to update these five glyphs.

## R8 circular-arrow review

Five glyphs were redrawn on the same 16px grid: `refresh-cw`, `refresh-ccw`, `rotate-cw`, `rotate-ccw`, and `rotate-ccw-clock` (Lucide's canonical class for the application `HistoryIcon`). Refresh has two separated arc-arrows with triangular heads; rotation has one. Clockwise heads point down at upper right/up at lower left; counterclockwise mirrors them. History keeps readable clock hands inside one connected counterclockwise outer arc instead of a detached block.

The production used-icon snapshot has no undo/redo glyphs. `repeat` remains unchanged after visual comparison; `reply` has a clear leftward arrow and return elbow, not the problematic circular form, and also remains unchanged. The user biography-history button is confirmed as `HistoryIcon` at application mirror `UserDialogInfoTab.tsx:785`.

[Before/after on dark and pink backgrounds](<checks-r8/before-after.png>) shows all five changed glyphs plus unchanged repeat at 16px and nearest-neighbor 6×. [Verification](<checks-r8/report.json>) proves exactly five mask rules changed, all other 238 glyphs plus selectors and license bytes are identical. Dist grew **303 bytes**, from **110865** to **111168**. [R8 source](<hand-r8.mjs>) is the authoritative hand grid; [checker](<check-r8.mjs>) can be rerun with `node check-r8.mjs` (do not overwrite the preserved original baseline with `--before`). Windows live GUI and runtime theme assembly are separately owned by Lead; this is a local source/CSS rebuild, not a live deployment claim.

Defaults are 16px grid, stroke 2.6, threshold .45 (the checked-in production parameters). The 243 SVGs were verified byte-identical after regeneration with these defaults. `LIST` may override the checked-in snapshot. Production CSS prefers checked-in `src-hand` files; rebuilding those comparisons still needs their historical grid input, but production SVG/CSS rebuild does not depend on `/tmp` input files.

## R96 settings gear (task-48)

The batch-1 `settings` glyph (four 4px bars around an asymmetric core) read as a clover at 16px. [hand-r96.mjs](<hand-r96.mjs>) is now its authoritative grid and `hand-batch1.mjs` references it: an 8-tooth gear (four 4×2 axis teeth, four 2×2 diagonal teeth), 2px ring and a 6×6 octagonal transparent axle hole, D4-symmetric and one connected piece. Only `src-hand/settings.svg` changed; `src/settings.svg` is the untouched generated fallback that the build does not use while the hand file exists.

[Before/after](<checks-r96-settings/before-after.png>) on #201936 / #f2ebff and #ffb8e6 / #16112a at 1×, 2×, 4× and 12×, plus an in-row neighbour strip; [family sheet](<checks-r96-settings/family.png>). [Verification](<checks-r96-settings/report.json>) via `node check-r96.mjs` asserts symmetry, connectivity, a closed hole, and that exactly one dist rule (`svg.lucide-settings`, its `--px` mask) changed. Dist shrank **37 bytes**, from **111168** to **111131**. Do not overwrite the preserved `checks-r96-settings/before*` baseline.

## Coverage boundaries

The generated stylesheet only hides children of explicitly covered classes, retaining original icons on unknown SVGs. Non-Lucide SVGs, brand logos, animation SVGs and inline illustrations are a separate audit, not covered by the number 243. Pixel masks are designed on a 16px grid; other sizes and fractional WebView scaling may soften edges. Do not change icon boxes globally merely to force pixel alignment.
