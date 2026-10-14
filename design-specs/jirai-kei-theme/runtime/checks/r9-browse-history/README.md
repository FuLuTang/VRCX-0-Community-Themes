# Browse history R9 visual check

Offline Playwright regression fixture for the source-shaped Browse History page. It uses fictional records and local built CSS only; it does not use the live app, real browsing data, CUA, or the theme builder.

## Run

From the VRCX-0-Jirai repository root:

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers \
JIRAI_OUT=/tmp/jirai-r9-loader-isolated-out-20261012/jirai-kei-theme \
node design-specs/jirai-kei-theme/runtime/checks/r9-browse-history/verify.mjs
```

The verifier also reads the existing `dist/assets/index-*.css` and `App-*.css` bundles. `JIRAI_OUT` should point to the isolated built theme directory containing `theme.css`; its `controls-r9` section is checked against the current source before rendering.

## Coverage

- Page-specific selector hit/miss and an unrelated four-tab near-miss scaffold.
- Chromium CSSOM retains the single nested page gate and its nested rules; browse stylesheet is capped at 8 KiB.
- Computed-style equivalence against `legacy-browse-history-r9.css` for every fixture element and relevant pseudo-style across default, hover, keyboard-focus, and reduced-motion states. The only permitted delta is the expected hover rule on the deliberate four-tab near miss; the real five-tab page stays identical.
- Existing five-filter `controls-r9` styling unchanged; geometry deltas at or below 2 px; square thumbnails, date dashes/marker, card bevels, pink delete control, keyboard focus, and 4.5:1 contrast.
- Fine-pointer default visibility, 760 px viewport overflow, `prefers-reduced-motion`, and `html.reduce-effects`.

Generated screenshots and the machine-readable measurements are in this folder: `before.png`, `after.png`, `before-after.png`, `comparison.png`, `focus-visible.png`, and `verify-report.json`.
