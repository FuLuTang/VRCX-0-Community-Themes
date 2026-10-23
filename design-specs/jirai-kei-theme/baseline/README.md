# Baseline fixture tooling (Step 2)

## Purpose

A live-app DOM is not repeatable: React data refreshes, images replace skeletons, routes
restore saved state, and animated controls change while sampled. Repeated live captures
showed thousands of computed-style differences with an unchanged CSS hash. Therefore the
acceptance surface is a frozen route DOM fixture: capture each rendered route once, then
replay that exact inert DOM under the baseline or candidate CSS.

`collect.mjs` navigates the real app by hash route, records a viewport screenshot, a live
observation, and a gzipped inert HTML fixture containing the route DOM and inline styles.
It does not click app controls, execute fixture scripts, bring the app window to the front,
or close the CDP browser. The fixtures are generated from the authenticated user's app and
may include private UI/account data; `snapshot/`, `fixtures/`, and `screens/` are gitignored
and must not be committed or pushed.

Comparison, census and rule-ownership tools that read these fixtures live in `../tools/`
(see `../tools/README.md`). They load each fixture into headless Chromium with scripts
removed and swap only the `data-vrcx-0-css-layer="local-theme-preview"` stylesheet.

## Run

1. Ensure the Windows app is running with CDP on `127.0.0.1:9222` and the SSH tunnel is
   listening locally (`curl http://127.0.0.1:9222/json/version`).
2. From this directory, capture the declared routes:

   ```sh
   node collect.mjs
   ```

3. Use `../tools/style-diff.mjs`, `../tools/slot-census.mjs` and `../tools/rule-owners.mjs`
   against the new fixtures. The older replay/compare/audit scripts were removed; their
   historical reports remain under `reports/`.

`collect.mjs` connects over CDP to the user's live app. Never call `browser.close()` on a
`connectOverCDP` connection: that would close the user's app.

## Frozen schema and known route limitations

- The computed-property list is frozen in `collect.mjs` (`COMPUTED_PROPS`, 163 properties).
  Changing it invalidates comparability and requires regenerating the baseline.
- `routes.json` is the 34-path source list from `src/app/routes.tsx` at app commit
  `83e624a06a813a0c95e07655e4a142355fd0f194`.
- `/login` is protected by `RedirectIfAuthenticated`; a logged-in capture redirects to
  the remembered route and is not the login form.
- `/dashboard/<placeholder>` renders without real user data.
- `/favorites/import/friends` redirects to `/favorites/worlds` in the current app state.
- `/charts` redirects to `/charts/mutual`; `/community-themes` redirects to `/themes`.
- Eight representative interaction states are included; this is not exhaustive for every
  app-specific menu/dialog/popover. Add more named fixtures when the component batch needs
  that context, without selecting menu items or triggering destructive/data-mutating actions.

## Current progress

- 34/34 route fixtures captured; 30 routes reached DOM quiet before the wait limit, 4 kept
  changing due to live content/animation. All four still have a frozen fixture.
- Static replay captures the 163 frozen properties and stable body-rooted locators. It
  injects a final `animation-play-state: paused !important` rule before body parsing, then
  rewinds animations to t=0. This prevents one-shot `animate-in` effects from finishing on
  different frames across runs; authored animation name/duration/etc. remain observable.
- Repeated route replay passed **34/34**; after adding interaction states, the combined
  repeated replay passed **42/42** with no missing locators, tag/attribute identity diffs,
  or computed-style diffs. Report: `reports/static-replay-idempotency.txt`.
- Eight allowlisted, non-destructive interaction fixtures now cover account/tools menus,
  a tooltip, avatar hover card, context menu, date popover, listbox, and graph settings
  sheet. All were dismissed with Escape and the original `#/feed` route was restored.
  See `interactions.json`, `interaction-manifest.json`, and `reports/interaction-captures.md`.
- **Candidate-injection smoke test passed 42/42 with 0 style differences** when the original
  theme CSS was passed through `--theme-css`; this proves the candidate comparison path
  replaces the intended layer and compares the full baseline, not just two identical runs.
  See `reports/step2-css-injection-equivalence.txt`.
- Selector coverage against the same fixtures: **1,111 unique selector branches** from
  1,114 qualified rules; 482 query hits (pseudo-element selectors are measured on their
  host), 92 dynamic-state structural candidates, 531 with no match in these captured
  states, and 6 pseudo-element-only scrollbar selectors. This is DOM presence, not cascade
  wins. A previous planning estimate of 1,095 used a different/unverified counting scope;
  the report pins the parser method and 42-state denominator.
- Context inventory groups 5,877 component observations into 136 component/surface/variant
  groups. The paint fingerprint is intentionally a warning signal: multiple fingerprints
  can be real state/context differences, not candidates to forcibly merge. Report:
  `reports/component-variant-inventory.md` (JSON companion carries safe sample values).
- CSS-only declaration audit: 90 exact repeated declaration-block groups, 63 selector branches
  redeclared across blocks, and 39 near-equivalent candidate pairs after strict similarity
  thresholds; selectors are joined to frozen-DOM coverage and component-context fingerprints.
  This artifact has **149** `!important` declarations by PostCSS—not the older unverified 838
  note. See `reports/declaration-clusters.md` and its JSON companion; none of these counts
  implies a safe merge without source/context review and computed-style verification.
- First user-approved base batch grouped the 81 `:root` design tokens with comments only;
  names, values, and declaration order are unchanged. The rebuilt candidate remains under
  the 1 MiB cap, and all 42 frozen states pass with zero computed-style differences.
  Evidence: `reports/token-grouping-batch-01.md`.
- `/login` remains a known limitation: while authenticated it redirects to the remembered
  page, so the real login form is not captured.
