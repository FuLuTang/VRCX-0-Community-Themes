# R9.5 · Generic Win98/Windose dialogs

This is a static CSS specimen, **not Windows** and not an application screenshot. All account names, counts, paths, progress values, and labels are fictional; it makes no network requests and includes no user media.

## Source audit and boundaries

- `src/ui/shadcn/dialog.tsx`: `DialogContent` emits `[data-slot="dialog-content"]`, children first, then its actual direct `[data-slot="dialog-close"]`; `DialogHeader`, `DialogTitle`, `DialogDescription`, and `DialogFooter` emit their corresponding `data-slot`s. The built-in close control is a real Base UI close button rendered through `Button`.
- `src/ui/shadcn/alert-dialog.tsx`: `AlertDialogContent` and its header/title/description/footer have separate `alert-dialog-*` slots. It has no close button in this component, so the theme does **not** draw a fake, nonfunctional X; the alert's real action/cancel controls stay in its footer.
- The real user/world/avatar/group detail host (`DialogHost.tsx`) tags those surfaces `.entity-dialog` (and `.owner-dialog` where applicable). `user-dialog-r8.css` / `user-dialog-r9.css` own existing detail treatments. New selectors exclude those roots and nested entity portals.
- The login view is a page/card surface, not generic `DialogContent`. A nested login-page decoy is also in the fixture to guard that exclusion.
- `CommandDialog` and `QuickSearchDialog` keep their semantic `sr-only` header outside the portal popup and are specialized command surfaces; the new style requires a visible direct header, so these search/command dialogs remain unchanged rather than gaining a blank title strip.
- The generic CSS selects only dialog/alert-dialog popup content plus their header/title/close/footer children. It never styles the portal, positioner, or overlay and never sets `position`, `top`, `left`, `transform`, width, height, or overflow on real popup surfaces.

## Visual behavior

- A full-bleed, in-flow pink title row with the indigo pixel square and `var(--wd-body-font-family)` pixel title; the existing description remains below in the dark body and can wrap normally.
- Square 1px indigo outer line, pale inset bevel, hard shadow, deep panel (`#211a33`) and high-contrast body text.
- The real `DialogClose` gets a 22px square Win95 face and a 2px mint `:focus-visible` outline. Footer buttons are otherwise untouched.
- Footer lace reuses `--r8-lace-tile`; mint bottom rule and a pink left segment use paint-only background layers.
- Existing `motion-r5.css` already owns the normal dialog's single `r5-dialog-step-in` animation, so this sheet adds no second animation. `html.reduce-effects` and `prefers-reduced-motion: reduce` both force a static frame.

## Verification

Run from this folder after the theme base is built to an isolated destination:

```sh
JIRAI_OUT=/tmp/vscode-luna/jirai-kei-theme \
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers \
SHARP_MODULE=/tmp/dsh-theme-tools/node_modules/sharp \
node ../../build-runtime.mjs
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node verify.mjs
```

`verify.mjs` appends `dialogs-r9.css` **only in its private Playwright page** after loading the isolated base package, then captures `before.png`, `after.png`, and `comparison.png`. It checks both example dialogs plus an alert dialog, entity/login decoys, title/marker/close/focus, WCAG text contrast, unchanged non-header content boxes, positioning, reduced motion, and a narrow viewport. The base runtime builder is intentionally untouched; Lead must add the new CSS section to `build-runtime.mjs` before a normal assembled package can include this pass.

Latest local run: PASS, 3 popup slots styled; body contrast 14.36:1, description 8.98:1, title 12.21:1; all measured non-header content/footer/input/button boxes changed 0px; title box +10px, header +9px. The full-width title row reclaims the existing 16px top inset, so the example window height decreases 5px rather than growing by another inset. No position/transform change. Close keyboard focus, both reduced-motion paths, and 760px no-horizontal-overflow checks pass. See `verify-report.json` for raw computed values and pending live-application checks.

Before/after images verify this CSS only against the isolated theme bundle and fictional fixture. Base UI's exact merged tree, localized title wrapping, portal edges at OS scaling, and live application reload still need real-app confirmation.
