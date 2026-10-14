# Four-cell emote format study · internal preview only

## Source and frame selection

- Source: `design-specs/jirai-kei-theme/art-references/nso-fandom-desktop-icons-sheet.png` (1120×700). Attribution/license is not established by the local file; these outputs are **internal previews only** and must not be integrated into the theme or publicly redistributed without user authorization.
- Selected the four adjacent 120×120 cells in the second-to-last icon row, left-to-right: `(x,y)=(290,430),(430,430),(570,430),(710,430)`. They sit on a 140px horizontal cadence (120px cell + 20px gap).
- All crops share the same 96×80 non-background content bounds at crop-local `(12,20)`, and show the same laptop-cat character silhouette with different props/reaction marks. This supports a same-character four-state sample; the sheet does **not** establish that these are consecutive animation frames or specify timing.
- Only exact sheet-canvas pixels `#f8f0fa` connected to each cell edge were keyed transparent. No resampling was used; hidden RGB under transparent pixels is normalized to zero. The 4 fps / 250ms per frame / 1s loop is a comparison setting, not source animation metadata.

## Format measurements

All candidates use the same four 120×120 RGBA frames and preserve the source pixels exactly. Binary data-URI lengths include the MIME prefix and payload, but not `url(...)` or any CSS timing rules. SVG URIs are percent-encoded to match the project’s inline-SVG convention.

| Candidate | File bytes | Data URI chars | Storage / timing model |
|---|---:|---:|---|
| PNG sprite + CSS `steps(4,end)` | **940 B** | **1,278** | 480×120 palette PNG; CSS owns 250ms steps and can freeze on frame 1 |
| Animated WebP, lossless | 1,444 B | 1,951 | 120×120, 4 VP8L frames, 250ms each, infinite loop |
| APNG, indexed/lossless | 1,628 B | 2,194 | 120×120, 4 frames, 250ms each, infinite loop |
| SVG SMIL animation | 42,391 B | 49,988 | 120×120 integer-pixel vector runs; SMIL autoplay |
| SVG sprite + CSS steps | 41,913 B | 49,238 | 480×120 integer-pixel vector sheet; CSS timing |

For comparison, four separate PNG frame files total 2,404 B before URI prefixes. These results are exact for this crop and these encoders; PNG’s sprite-sheet layout differs from the full-canvas animated formats, so compare both bytes and playback control, not just container labels.

## Validation and previews

- `format-report.json` has the exact bounds, per-format bytes/data-URI characters, encoder metadata, and RGBA diffs.
- Each of the 4 frames has 14,400 pixels. PNG sprite, APNG, animated WebP, and SVG sprite each decode to **0 mismatched pixels, 0 channel mismatches, and 0 alpha mismatches** against `frame-1.png`…`frame-4.png`.
- The browser preview sampled 15 timed captures per format; PNG/CSS, APNG, WebP and SVG/SMIL each exposed four distinct frames. WebP metadata independently reports four 120px pages with 250ms delays.
- [Frame contact sheet](frame-contact-4x.png) is 1920×504 (4× nearest-neighbor). [Format preview](format-preview.png) is 1180×525; the playable [preview page](format-preview.html) and all image edges are ≤2000px.
- The in-repo runtime’s `runtime/tools/build-loader-sprite.mjs` + `runtime/loader-r9.css` use a horizontal palette-PNG sheet, CSS `steps(N,end)`, pixelated rendering and a reduced-motion static frame. PNG/CSS is the strongest implementation fit here and is the smallest tested candidate. WebP is 184B smaller than APNG but larger than the PNG sprite; SVG vector runs are far larger for these pixel crops.

## Three UI placement suggestions

1. **Explicit emote/asset preview in a profile details pane** — give it a separate 120×120 slot; never place it over the 4:3 profile banner, avatar, or username. Start only when the user opens the preview.
2. **Theme settings or asset-gallery tile** — show the four-state sample beside its name, with a play/pause affordance. This is the best place to compare expressions without making shared chrome noisy.
3. **Hover/focus popover from a static emote choice** — animate one short pass while the item is hovered/focused, then stop; keep the popover outside buttons and hit targets, and dismiss on blur/escape.

For any future integration, prefer the CSS-controlled PNG strip so `prefers-reduced-motion` and `html.reduce-effects` can hold frame 1. APNG, WebP and embedded SVG/SMIL autoplay independently; CSS `animation:none` alone will not stop them, so they need a static fallback or explicit playback handling. Preserve pixel edges with `image-rendering: pixelated`; use a native 120px or integer-multiple render (e.g. 240px) rather than fractional scaling. Avoid persistent animation in the titlebar, statusbar, or sidebar. No runtime CSS, builder, theme package, or deployment files were changed.
