# R9+ Tools UI selector audit

## Scope and source anchors

Source mirror: `/tmp/vrcx-win-src-r9/src`.

- `src/features/tools/components/ToolsPageContent.tsx:788-843`: Tools page renders `PageScaffold id="chart"`, a direct `PageToolbar` containing `ToolbarSearch`, then a direct `.relative.mt-4` scroll body with vertical `Tabs` and its `TabsList`.
- `PageScaffold.tsx:32-59` forwards `id` onto a `div.vrcx-0-page-scaffold`; `AppShellLayout.tsx:158-166` renders the route under `.vrcx-0-main-content`.
- `ToolbarControls.tsx:94-108` marks the filter `data-vrcx-0-control="toolbar"`; `InputGroup` and `InputGroupInput` supply `data-slot="input-group"` and `data-slot="input-group-control"`.
- The `chart` id is not unique: the mutual-friends graph also uses `PageScaffold id="chart"` and the legacy two-person graph is a plain `div#chart`. The root therefore requires both the ToolbarSearch marker and `:has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"])`.

All 13 selectors in `runtime/tools-ui-r9.css` start at this combined root. Filter styling targets the exact toolbar control; category styling targets the direct vertical `TabsList` and its tab children. No Settings vertical tabs or application navigation rail selector is used.

## Synthetic browser fixture results

`fixture.html` uses source-shaped DOM and invented labels/cards only. Playwright loads the existing app CSS and built runtime theme as baseline, then appends this new CSS. It is not a Windows/app screenshot.

`PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers JIRAI_OUT=/tmp/jirai-r9-out-controls/jirai-kei-theme node checks/r9-tools-ui/verify.mjs` → **PASS**.

- Unique hits: Tools root/search/list = 1/1/1; five category tabs.
- Exclusions remained unchanged: Settings vertical Tabs, unrelated `#chart` page and app navigation.
- Geometry deltas: search control/input/list/all five tabs = **0 px**.
- Keyboard sequence: search field → edit button → selected category tab. Both the field and selected tab show a 2px visible focus outline.
- Contrast ratios: active category 11.55:1; filter input 14.44:1.
- Browser output: `before.png`, `after.png`, `focus-visible.png`, `comparison.png`, and `verify-report.json` in this directory.

The new stylesheet is intentionally not registered in the runtime builder; Lead will integrate it separately. The fixture appends it directly for comparison.