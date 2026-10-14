/* explicit non-mechanical edits applied by migrate2.mjs (after the mechanical exclusion removal / :where wrapping).
 * Each `from` must match exactly `count` (default 1) times in `file`. */
export const EDITS = [
  {id: 'radio-comment', file: 'fields-toolbar-r10.css',
    from: '/* Remaining audited native controls. Radio retains its circular semantic affordance. */',
    to: '/* Remaining audited native controls. (Radio: shared square-pixel rule in form-controls-r9.css.) */'},
  /* radio-new lives in REGEX_EDITS below: its anchor must survive BOTH the stage-3-only pass and the --drop-stage2 pass,
     so it can no longer hard-code the settings dead-clause that --drop-stage2 removes. */
  {id: 'settings-comment', file: 'settings-pixel.css',
    from: `   Scope: the settings rail and settings cards are limited to the settings page
   with :has(> [data-slot=tabs-list][class~=w-44]) — SettingsPage.tsx:77 is the
   only TabsList in src carrying the w-44 token (ToolsPageContent.tsx:825 is
   w-full, SidePanel.tsx:502 is w-full).`,
    to: `   Scope: the settings rail and settings cards are limited to the settings page,
   identified structurally as the vertical Tabs that is a DIRECT child of the page
   scaffold (.vrcx-0-page-scaffold > [data-slot=tabs]) — SettingsPage.tsx:67-77;
   ToolsPageContent.tsx:817 nests its Tabs in a grid div, SidePanel.tsx:389 is not
   inside a scaffold. (Was: the style class w-44 on the TabsList.)`},
  /* user dialog bio-history date bubble: structural hook instead of `.relative.min-w-16.flex-1.py-3 > span.absolute.top-0.z-10` */
  {id: 'bio-bubble-hook', file: 'user-dialog-r8.css',
    from: '[data-slot="dialog-content"].entity-dialog .relative.min-w-16.flex-1.py-3 > span.absolute.top-0.z-10 {',
    to: '[data-slot="dialog-content"].entity-dialog div:has(> input[type="range"]) > span:has(~ input[type="range"]) {'},
  /* --- cascade clean-up: the pre-R9 base layer in windose-runtime.css used to lose to the (specificity-inflated) generic
         rules; with the generics now at specificity 0 these fully-shadowed declarations would start winning -> removed. --- */
  {id: 'base-input-radius', file: 'windose-runtime.css',
    from: '[data-slot="button"], [data-slot="input"], [data-slot="select-trigger"] { border-radius:2px; }',
    to: '[data-slot="button"], [data-slot="select-trigger"] { border-radius:2px; } /* [data-slot="input"] radius: owned by the generic field rule in fields-toolbar-r10.css (login-r8 keeps 2px) */'},
  {id: 'base-native-select', file: 'windose-runtime.css',
    from: `.vrcx-0-app-root select:not([multiple]):not([size]) { appearance:none; padding-right:24px;
 background-image:var(--wd-native-chevron); background-repeat:no-repeat; background-size:12px 12px; background-position:right 6px center; }
`,
    to: `/* native <select>: generic rule lives in form-controls-r9.css (same chevron art, applies in every context). */
`}
];

export const REGEX_EDITS = [
  /* native radio: shared square-pixel rule set, inserted after the checkbox focus-visible block. The anchor stops at that
     rule's closing brace and never includes the trailing context clauses, so it matches with and without --drop-stage2. */
  {id: 'radio-new', file: 'form-controls-r9.css', count: 1,
    re: /:where\(:is\(\[data-slot="checkbox"\],input\[type="checkbox"\]\)[^\n]*\n  outline:2px solid #ff7fcf;\n  outline-offset:2px;\n\}\n/,
    to: `$&/* Radio: Base UI Radio.Root is a span[role=radio] with a Radio.Indicator child (DataDirMigrationDialog.tsx:222); a native
   input[type=radio] gets the same square pixel box. Sizes are not set for [role=radio] (the app's size-4 / size-1.5 stay). */
:where([role="radio"],input[type="radio"]){
  appearance:none;
  -webkit-appearance:none;
  border:1px solid #8c71b0;
  border-radius:0;
  background-color:#211a33;
  color:#16112a;
  box-shadow:inset 1px 1px #392a52,inset -1px -1px #16112a;
  accent-color:#ffb8e6;
}
:where(input[type="radio"]){width:15px;height:15px}
:where(:is([role="radio"],input[type="radio"]):is([data-checked],[aria-checked="true"],:checked)){
  border-color:#6c5ce0;
  background-color:#ffb8e6;
  box-shadow:inset 1px 1px #fff0fa,inset -1px -1px #b15b9d;
}
:where([role="radio"] > span){border-radius:0;background-color:#16112a}
:where(input[type="radio"]:checked){background-image:linear-gradient(#16112a,#16112a);background-size:6px 6px;background-position:center;background-repeat:no-repeat}
:where(:is([role="radio"],input[type="radio"]):focus-visible){
  outline:2px solid #ff7fcf;
  outline-offset:2px;
}
`},
  /* settings page: identify it by structure (the only vertical Tabs that is a DIRECT child of the page scaffold) instead of the
     style class `w-44` on its TabsList (specificity unchanged: .scaffold replaces the [class~=w-44] attribute). */
  {id: 'settings-hook-pixel', file: 'settings-pixel.css', count: 16,
    re: /\[data-slot=tabs\]\[data-orientation=vertical\]:has\(> \[data-slot=tabs-list\]\[class~=w-44\]\)/g,
    to: '.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list])'},
  {id: 'settings-hook-cards', file: 'cards-r97.css', count: 7,
    re: /\[data-slot=tabs\]\[data-orientation=vertical\]:has\(>\[data-slot=tabs-list\]\[class~=w-44\]\[data-orientation=vertical\]\)/g,
    to: '.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical])'},
];

/* native radio rules (circle) in fields-toolbar-r10.css are replaced by ONE shared square-pixel radio in form-controls-r9.css */
export const DELETE_RULES = [
  {id: 'native-radio-moved', file: 'fields-toolbar-r10.css', re: /input\[type="radio"\]/, count: 3},
];
