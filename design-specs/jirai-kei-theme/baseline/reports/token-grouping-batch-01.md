# Token grouping — batch 01

## Scope

- User-approved base-to-specific order: begin with the shared `:root, :root.dark, .dark` design-token block in `themes/jirai-kei-theme/theme.css`.
- Added semantic comment headings only: core palette/control, sidebar, shared surfaces, content hierarchy, strokes, interaction states, app shell, tables, toolbar, main-content geometry, resize/chart colors.
- Preserved all 81 custom-property names, values, selector list, and declaration order. The ordered declaration-sequence SHA-256 is unchanged: `d45d60e078d55f79c777b76da647958046fa499145b90a3814f2a868ad7fae9d`.
- No component rules, specificity, cascade order, or `!important` declarations were changed.

## Build and equivalence

- Build succeeded under the 1 MiB limit: `1,044,385 / 1,048,576` bytes (baseline artifact: `1,043,966` bytes).
- Baseline artifact SHA-256: `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`.
- Candidate artifact SHA-256: `ed39a3d53c68b99cd0a91bb8ea8da86499a696f2c1e216af1d45d77d4104e061`.
- Independent PostCSS check: removing comments from the rebuilt candidate yields the exact original artifact CSS; the compiled root selector and its 81 declarations also match.
- Frozen-DOM replay: `42/42` fixtures replayed. `compare-snapshots` reports `42/42` states, zero missing elements, zero identity differences, and **zero computed-style differences** across the frozen property set.

The replay used the local SSH tunnel to the existing Windows app's CDP endpoint. It did not close the browser or alter the live app route. Raw fixtures and candidate snapshots remain local/ignored; this report contains only aggregate results.
