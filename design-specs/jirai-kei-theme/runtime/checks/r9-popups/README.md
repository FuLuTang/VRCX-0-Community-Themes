# R9-A popup verification — NOT WINDOWS

Original CSS implementation of the requested **mini Windose window** direction: opaque dark panel, square title-marker, 6px slanted pink selection bar. This is a source-shaped fictional fixture, NOT live Windows acceptance. No private screenshot or reference image is copied into the repository/package.

## Evidence / design choices

- The selected art reference is [NSO Steam screenshot 02](<../../../art-references/nso-steam-ss-02.jpg>): visible dark “はいしん” window and slanted pale-pink option bars. Exact colors/6px slants below are brief-driven theme choices, not measurements of the screenshot.
- Authority: read-only `/tmp/vrcx-win-src-r9/src`.
- SidePanelSelfAccountMenu:134–208: dropdown group label, `gap-2.5 p-1.5` account item with Avatar and muted second line, separator, lock, login, destructive logout.
- UserPickerRow:32–65: room-history Popover's ghost-button row, inner `mr-2.5 size-9 rounded-full border` avatar backing. It is **not** a combobox.
- dropdown-menu:114–205,248–257 / select:84–94,118–155 / combobox:143–158,178–218: source slots, highlighted/disabled attributes and indicator positioning.
- avatar:15–18,29–32,44–47: image/fallback faces use the audited pixel cut; theme-owned root `::before`/`::after` rings and borders are removed. A member-decorated root remains unclipped.
- globals:1117–1149: `i.x-user-status` status fill mapping; accessible masks stay untouched.
- AppMenuBar.tsx:192–264 plus `ui/shadcn/menubar.tsx`:76–203: Help dropdown owns `menubar-content`, `menubar-item`, `menubar-label`, and `menubar-separator` slots. These slots do not match the R9 `*-menu-*` selectors, so this increment styles them explicitly. The host menubar content `::before` blur stays untouched.
- StatusBarFooter:163–178 server tooltip has `> div.flex.flex-col.gap-1.text-xs`; WebSocket tooltip at :307 has those stack classes on **Popup itself**. Both match the active `.vrcx-0-statusbar [data-slot=tooltip-trigger][data-popup-open]` relationship plus the two stack shapes. Tooltip:44–64 portals content, with a direct child Arrow `div.rotate-45.rounded-[2px]`. Both status arrows are hidden; a concurrently mounted plain ordinary tooltip and its arrow stay unchanged. The fixture proves data-popup-open activation and closed/data-open-only non-activation, not actual BaseUI runtime event emission. Another ordinary tooltip sharing either stack shape could still match; no universal semantic association is claimed.
- ToolsPageContent.tsx:652–700,787–843: user image and source agree: `ToolbarSearch` + **vertical TabsList**, NOT a dropdown. The independent tools-ui-r9 layer (jirai-luna) owns that rail; popup CSS does not style it. The synthetic category-combobox fixture tests only generic combobox slots, not actual Tools UI.
- The source popup's `bg-popover!` and deep destructive `!important` utilities are explicitly simulated by the fixture. Before strips ONLY `SECTION popups-r9`; after is the complete current isolated package, so rebuilt packages do not contaminate the before baseline.

## Implemented tokens

| Feature | Value |
|---|---|
| Panel | #211a33, alpha 1, square, 1px #6c5ce0 border |
| Window relief | inset 1px 1px #69557c; inset -1px -1px #7a3f6d; hard 3px 3px #100b1e shadow |
| Text | #f2ebff; disabled #b9add9 (opacity 1) |
| Title | #302344 / #ffd9ee, 7×7px #ffb8e6 marker, 1px violet underline |
| Highlight | #ffb8e6 / #16112a, 6px parallelogram; hover / keyboard / focus-visible identical |
| Muted highlighted text | #2a1d6e |
| Destructive | #ff7fae; highlighted parent AND descendants #16112a |
| Separator | 1px #8c71b0 dots / 2px transparent gaps |
| Avatar | --wd-avatar-cut-sm on popup image/fallback faces; no theme ring or avatar border; transparent outer backing |
| Motion | popup/item/avatar fades removed; system reduced-motion and html.reduce-effects static |

## Selector hit / exclusion list

Hits: dropdown/context menu panels and submenu panels; menu items/checkbox/radio/sub-trigger/labels/separators/shortcuts; select/combobox contents and options; generic Popover panel and the source-shaped room-history ghost rows; account avatar images/fallback with `--wd-avatar-cut-sm` and no theme ring/border; global `i.x-user-status` shape only; AppMenuBar menubar panels/items/labels/separators; active statusbar tooltip stack (compact, readable). Synthetic Tools category combobox exercises the existing combobox slot rules.

Verified untouched: ordinary `tooltip-content` (non-status), hover-card-content (sidebar hover card); popup physically inside `.entity-dialog`; avatar outside popup; member avatar root and external frame; application menu-positioner/select-content `::after` pseudo styles; Help menubar content `::before` pseudo. Positioner only receives `--radius:0`, as allowed by brief. No positioning/z-index/list row geometry is edited. Checked state/check glyphs/submenu arrows remain visible. Tools ToolbarSearch/vertical TabsList is outside this scope and owned by the independent tools-ui-r9 layer; the image is not a dropdown.

Frame safety exception: a highlighted row containing a member decoration uses a **square pink bar**, not a clipped parallelogram, so the external VRChat frame cannot be cut off. The external frame node stays unchanged; theme-owned avatar rings/borders are removed.

## Run

From this directory:

```sh
JIRAI_OUT=/tmp/jirai-r9-out-popups/jirai-kei-theme \
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers \
SHARP_MODULE=/tmp/dsh-theme-tools/node_modules/sharp node build-isolated.mjs
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node verify.mjs
```

The wrapper imports the unchanged runtime builder and suppresses its one legacy `ribbon-heart-charm.svg` write **only if the generated bytes equal the existing file**. If they differ it fails rather than writing outside the assigned scope. Default preview-package is never touched.

Results: [verification report](<verify-report.json>), [full comparison](<comparison.png>), [integer nearest-neighbor 4× account-menu comparison](<comparison-4x.png>) (left before, right after). Transparent corners are tested on a **pink highlighted row**: avatar corner must equal the row's #ffb8e6 pixel, center remains the fictional image's #d97fc6.

## Capture geometry (script repair, not a CSS geometry regression)

Full-page capture covers the document, not a fixed viewport. The title underline adds 1px to the first grid row and 1px to the Help/extra-surfaces grid: the recorded document height was 955px before / 957px after while list-item dimensions remained identical. Requiring equal full-page bitmap sizes was a faulty assertion. The comparison now pads to the larger native height **without resampling or cropping either screenshot**. The 4× account crop uses each state's own recorded element bounds, then integer nearest-neighbor scaling and canvas padding. Geometry and layout measurements are retained in [verification report](<verify-report.json>).

Help fixture includes label/item/separator/shortcut + a highlighted item. Server and WebSocket source shapes each have a real `div.rotate-45` Arrow. Both arrows are asserted hidden; the concurrently mounted ordinary tooltip Arrow is asserted visible and unchanged. Closed triggers / `data-open` alone do not enable the status treatment; `data-popup-open` does.

## Still needs live app confirmation

Actual BaseUI `render=` merge/slot result; long translated labels/edge-positioned nested submenus; host RGB border enabled; real membership frames and accessible status mode; room-history scroll/selection and virtualization. Hidden source-shaped submenu probes check CSS matching but are not screenshots of live submenu placement. No Cua, deployment, or default package assembly was performed.
