# Exact and near declaration-block clusters

- Artifact: `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`; 1060 qualified rule blocks with declarations; 1055 unique resolved selector branches.
- Exact repeated declaration blocks: 90 groups; selectors redeclared in multiple blocks: 63 groups (63 have differing declarations; not automatically cascade conflicts).
- PostCSS counts 149 declarations with !important (older 838 estimate is not supported by these artifact bytes).
- Near-equivalent candidate pairs: 39 retained (property Jaccard ≥0.72, shared-property value agreement ≥0.72, declaration Jaccard ≥0.58, at least four properties). These thresholds produce review leads only, never automatic merge instructions.
- Pairs/groups in sections with likely hard context boundaries (login/dialog/popup/chrome/status/privacy/entity): flagged; preserve them unless the computed-style proof and source semantics support a shared rule.

## Exact declaration-block duplicates

### 1. 23 blocks · 1 declarations · sections avatars-status-r9, buttons-badges-r10, cards-r97, controls-r9, data-surfaces-r10, login-r8, runtime, settings, user-dialog-r8, window-chrome

- runtime:699 — .vrcx-0-side-panel span[class~="size-3.75"], .vrcx-0-side-panel span[class~="size-3.75"] > span
- window-chrome:903 — .vrcx-0-titlebar[data-app-titlebar] [data-slot='menubar'] [data-slot='menubar-trigger'] [data-slot='badge']
- settings:1277 — [data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger])::before
- settings:1306 — .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-content]
- user-dialog-r8:1963 — [data-slot="dialog-content"] span[class~="size-3.75"], [data-slot="dialog-content"] span[class~="size-3.75"] > span
- user-dialog-r8:1971 — [data-slot="dialog-content"].entity-dialog [data-slot="card-title"] > span.flex.size-4.shrink-0.items-center.justify-center > span.rounded-full.inline-block[class~="size-2.5"]
- login-r8:2257 — [data-vrcx-0-surface="login-page"] [data-slot="checkbox"]
- controls-r9:2529 — .vrcx-0-main-content .vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > [data-slot="button"][class~="rounded-object"]
- controls-r9:2623 — .vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > .absolute.w-64 > .mt-2.flex.flex-col > button > span[class~="size-2.5"][class~="rounded-full"]
- controls-r9:2626 — .vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > .absolute.w-72 > button.mt-3 > span[class~="size-2.5"][class~="rounded-full"]
- avatars-status-r9:2958 — .user-status-indicator, i.x-user-status
- avatars-status-r9:2962 — span[class~="border-background"][class~="bg-background"][class~="rounded-full"][class~="border-3"]:has(> .user-status-indicator)
- avatars-status-r9:3092 — [data-slot="avatar-badge"], [data-slot="avatar-group-count"]
- avatars-status-r9:3114 — [data-dashboard-feed-status-dot]
- avatars-status-r9:3115 — .vrcx-0-main-content [data-slot="tooltip-trigger"][class~="size-2.5"][class~="rounded-full"][class~="border"]
- avatars-status-r9:3116 — .vrcx-0-main-content [class~="bg-primary"][class~="size-2"][class~="rounded-full"]:has(> span[class~="sr-only"])
- avatars-status-r9:3117 — .vrcx-0-sidebar-surface span[class~="relative"][class~="inline-flex"][class~="size-4"] > span[class~="bg-destructive"][class~="size-1.5"][class~="rounded-full"][aria-hidden="true"]
- buttons-badges-r10:4275 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="pagination-link"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- data-surfaces-r10:4575 — :where(.vrcx-0-main-content > .vrcx-0-page-scaffold.friend-view) [data-slot="card"][data-size="sm"] > [data-dim-exempt] [data-slot="button"]
- data-surfaces-r10:4589 — :where(.vrcx-0-main-content #instance-history-list) .group > button[aria-pressed]
- data-surfaces-r10:4609 — :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="collapsible"] > div.sticky.top-0)) [data-slot="collapsible"] > div.sticky.top-0.border-b [data-slot="button"]
- cards-r97:4892 — [data-tools-section] [data-slot=card-content]
- cards-r97:4893 — [data-tools-section] [data-slot=card-content] .rounded-b-xl

Declarations: border-radius:0
### 2. 20 blocks · 1 declarations · sections buttons-badges-r10, cat-r8-final, controls-r9, form-controls-r9, icons, loader-r9, motion, navigation-r7, overlays-r10, pixel-controls, popups-r9, runtime, settings, tools-ui-r9

- icons:340 — svg.lucide:is(.lucide-activity,.lucide-app-window,.lucide-apple,.lucide-archive-restore,.lucide-archive,.lucide-arrow-down-to-line,.lucide-arrow-down,.lucide-arrow-left-from-line,.lucide-arrow-left-right,.lucide-arrow-left,.lucide-arrow-right-to-line,.lucide-arrow-right,.lucide-arrow-up-down,.lucide-arrow-up-right,.lucide-arrow-up-to-line,.lucide-arrow-up,.lucide-badge-check,.lucide-ban,.lucide-bell-off,.lucide-bell,.lucide-book-open,.lucide-bookmark,.lucide-bot,.lucide-box,.lucide-boxes,.lucide-brush,.lucide-bug,.lucide-calendar-clock,.lucide-calendar-days,.lucide-calendar-range,.lucide-calendar,.lucide-camera,.lucide-case-sensitive,.lucide-chart-bar,.lucide-check-check,.lucide-check,.lucide-chevron-down,.lucide-chevron-left,.lucide-chevron-right,.lucide-chevron-up,.lucide-chevrons-down-up,.lucide-chevrons-down,.lucide-chevrons-up-down,.lucide-circle-alert,.lucide-circle-check-big,.lucide-circle-check,.lucide-circle-dashed,.lucide-circle-minus,.lucide-circle-question-mark,.lucide-circle-x,.lucide-circle,.lucide-clipboard-copy,.lucide-clock-3,.lucide-clock,.lucide-cloud-off,.lucide-cloud,.lucide-code-xml,.lucide-code,.lucide-coffee,.lucide-columns-3,.lucide-compass,.lucide-contact-round,.lucide-contact,.lucide-copy,.lucide-crown,.lucide-cuboid,.lucide-database-backup,.lucide-database,.lucide-dices,.lucide-door-open,.lucide-download,.lucide-earth,.lucide-ellipsis-vertical,.lucide-ellipsis,.lucide-eraser,.lucide-external-link,.lucide-eye-off,.lucide-eye,.lucide-face-slightly-smiling,.lucide-file-archive,.lucide-file-search,.lucide-file-text,.lucide-flag,.lucide-flask-conical,.lucide-folder-heart,.lucide-folder-open,.lucide-folder-plus,.lucide-folder-search,.lucide-folder-tree,.lucide-folder,.lucide-footprints,.lucide-gamepad-2,.lucide-gauge,.lucide-gem,.lucide-gift,.lucide-globe,.lucide-grip-vertical,.lucide-hand,.lucide-hard-drive,.lucide-hash,.lucide-heart,.lucide-house,.lucide-id-card,.lucide-image-off,.lucide-image,.lucide-images,.lucide-inbox,.lucide-info,.lucide-key-round,.lucide-keyboard,.lucide-languages,.lucide-layers,.lucide-layout-dashboard,.lucide-layout-grid,.lucide-link-2,.lucide-link,.lucide-list-checks,.lucide-list-filter,.lucide-list-plus,.lucide-list-x,.lucide-list,.lucide-loader-circle,.lucide-lock-open,.lucide-lock,.lucide-log-in,.lucide-log-out,.lucide-logs,.lucide-mail-plus,.lucide-mail-question-mark,.lucide-mail,.lucide-map-pin,.lucide-map-pinned,.lucide-maximize-2,.lucide-message-circle,.lucide-message-square-plus,.lucide-message-square-text,.lucide-message-square-x,.lucide-message-square,.lucide-minimize-2,.lucide-minus,.lucide-monitor,.lucide-moon,.lucide-mouse-pointer-click,.lucide-move-right,.lucide-music,.lucide-network,.lucide-notebook-pen,.lucide-package,.lucide-palette,.lucide-panel-left-open,.lucide-panel-left,.lucide-panel-right-close,.lucide-panel-right-open,.lucide-panel-right,.lucide-pencil-line,.lucide-pencil,.lucide-person-standing,.lucide-pin-off,.lucide-pin,.lucide-play,.lucide-plug,.lucide-plus,.lucide-rectangle-goggles,.lucide-refresh-ccw,.lucide-refresh-cw,.lucide-regex,.lucide-repeat,.lucide-reply,.lucide-rocket,.lucide-rotate-ccw-clock,.lucide-rotate-ccw,.lucide-rotate-cw,.lucide-rows-2,.lucide-rows-3,.lucide-rows-4,.lucide-rss,.lucide-save-off,.lucide-save,.lucide-scan-face,.lucide-scan-search,.lucide-search-x,.lucide-search,.lucide-send,.lucide-server-cog,.lucide-settings-2,.lucide-settings,.lucide-share-2,.lucide-shield-alert,.lucide-shield-check,.lucide-shield-off,.lucide-shield-user,.lucide-shield,.lucide-shirt,.lucide-shuffle,.lucide-sliders-horizontal,.lucide-smartphone,.lucide-sparkles,.lucide-sprout,.lucide-square-pen,.lucide-square-terminal,.lucide-square,.lucide-star-off,.lucide-star,.lucide-sticky-note,.lucide-sun,.lucide-table-2,.lucide-table,.lucide-tag,.lucide-tags,.lucide-terminal,.lucide-text-search,.lucide-ticket,.lucide-timer-off,.lucide-tractor,.lucide-trash,.lucide-trending-up,.lucide-triangle-alert,.lucide-triangles-centerline-dashed-horizontal,.lucide-triangles-centerline-dashed-vertical,.lucide-type,.lucide-ungroup,.lucide-upload,.lucide-user-check,.lucide-user-minus,.lucide-user-plus,.lucide-user-round-check,.lucide-user-round-minus,.lucide-user-round-search,.lucide-user-round,.lucide-user-search,.lucide-user-star,.lucide-user-x,.lucide-user,.lucide-users-round,.lucide-users,.lucide-video,.lucide-volume-2,.lucide-volume-x,.lucide-waypoints,.lucide-wrench,.lucide-x,.lucide-zoom-in,.lucide-zoom-out)>*
- runtime:721 — .vrcx-0-sidebar-surface::after (@media (max-height:880px))
- settings:1263 — [data-slot=number-field-decrement] > svg, [data-slot=number-field-increment] > svg
- settings:1282 — [data-slot=toggle-group][data-variant=outline] > [data-slot=separator]::before
- settings:1292 — .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tab-indicator]
- pixel-controls:1339 — ::-webkit-scrollbar-button
- motion:1406 — [data-slot="sidebar"][data-state="collapsed"] .vrcx-0-sidebar-surface::after
- navigation-r7:1433 — .vrcx-0-sidebar-surface::after
- navigation-r7:1534 — [data-slot="sidebar"][data-state="collapsed"] .vrcx-0-sidebar-surface [data-sidebar="footer"]::before
- navigation-r7:1544 — [data-slot="sidebar"][data-state="expanded"] .vrcx-0-sidebar-surface [data-sidebar="footer"]::before (@media (max-height:620px))
- cat-r8-final:1932 — [data-slot="sidebar"][data-state="collapsed"] .vrcx-0-sidebar-surface [data-sidebar="content"]::after
- controls-r9:2446 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) [data-slot="tab-indicator"]
- controls-r9:2620 — .vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > div.absolute:is(.w-64,.w-72)::before
- controls-r9:2636 — :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot]))::before
- popups-r9:2784 — body:has(.vrcx-0-statusbar [data-slot="tooltip-trigger"][data-popup-open]) [data-slot="tooltip-content"]:is(:has(> div.flex.flex-col.gap-1.text-xs),.flex.flex-col.gap-1.text-xs) > div[class~="rotate-45"]
- tools-ui-r9:2846 — .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"] > [data-slot="tab-indicator"]
- loader-r9:3183 — .vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) > svg[data-slot="spinner"] > *
- form-controls-r9:3229 — :where([data-slot="checkbox"] > [data-slot="checkbox-indicator"])
- overlays-r10:3642 — [data-slot="tooltip-content"]:not(:has(> div.flex.flex-col.gap-1.text-xs)):not(.flex.flex-col.gap-1.text-xs) > div.rotate-45
- buttons-badges-r10:4283 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="tabs-list"]:where(:not(.vrcx-0-page-scaffold *):not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) > [data-slot="tab-indicator"]

Declarations: display:none
### 3. 14 blocks · 2 declarations · sections buttons-badges-r10, controls-r9, favorites-r9, fields-toolbar-r10, form-controls-r9, settings, tools-ui-r9

- settings:1257 — [data-slot=number-field-group]:focus-within
- settings:1280 — [data-slot=toggle-group][data-variant=outline] > :is([data-slot=toggle],[data-slot=tooltip-trigger]):focus-visible
- controls-r9:2549 — .vrcx-0-main-content .vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > button[data-slot="dropdown-menu-trigger"][data-size="icon-xs"]:focus-visible
- controls-r9:2585 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="button"][data-variant="default"]:focus-visible
- controls-r9:2602 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="1"] [data-slot="button"][data-variant="default"]:focus-visible
- tools-ui-r9:2830 — .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-slot="button"]:focus-visible
- form-controls-r9:3310 — :where(:is([data-slot="select-trigger"],[data-slot="combobox-trigger"]):focus-visible)
- form-controls-r9:3323 — :where(select:focus-visible)
- fields-toolbar-r10:3535 — .vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *) [data-slot="input-group-button"]:focus-visible
- fields-toolbar-r10:3544 — :where([data-slot="input-group"]:focus-within)
- fields-toolbar-r10:3593 — .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="combobox-chip-remove"]:focus-visible
- favorites-r9:3927 — .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"] > [data-slot="resizable-handle"]:focus-visible
- favorites-r9:3986 — .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] [data-slot="checkbox"]:focus-visible
- buttons-badges-r10:4277 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="pagination-link"]:focus-visible:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))

Declarations: outline:2px solid #ff7fcf; outline-offset:1px
### 4. 12 blocks · 5 declarations · sections avatars-status-r9, login-r8

- login-r8:2186 — [data-vrcx-0-surface="login-page"] [data-slot="avatar-image"], [data-vrcx-0-surface="login-page"] [data-slot="avatar-fallback"]
- avatars-status-r9:2888 — button:has(> span[class~="size-9"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]) > span[class~="size-9"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]
- avatars-status-r9:2933 — .activity-skin span.block.shrink-0.overflow-hidden.rounded-full:is([class~="size-7"],[class~="size-9"])
- avatars-status-r9:2968 — .vrcx-0-data-table :is( img[class~="size-6"][class~="rounded-full"][class~="object-cover"], div[class~="bg-muted"][class~="size-6"][class~="rounded-full"] )
- avatars-status-r9:2978 — .vrcx-0-main-content span[class~="bg-muted"][class~="size-6"][class~="shrink-0"][class~="overflow-hidden"][class~="rounded-full"]
- avatars-status-r9:2985 — :is(.entity-dialog,[data-slot="dialog-content"]) :is( img[class~="size-9"][class~="shrink-0"][class~="rounded-full"][class~="object-cover"], div[class~="bg-muted"][class~="size-9"][class~="shrink-0"][class~="rounded-full"] )
- avatars-status-r9:2995 — img[class~="mr-2.5"][class~="size-9"][class~="shrink-0"][class~="rounded-full"][class~="object-cover"], div[class~="bg-muted"][class~="mr-2.5"][class~="size-9"][class~="shrink-0"][class~="rounded-full"]
- avatars-status-r9:3003 — :is([data-slot="dialog-content"],.entity-dialog) span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"]
- avatars-status-r9:3010 — :is([data-slot="dialog-content"],.entity-dialog) span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"] > img
- avatars-status-r9:3034 — [data-slot="combobox-chip"] span[class~="bg-muted"][class~="size-3.5"][class~="rounded-full"]
- avatars-status-r9:3041 — [data-slot="combobox-chip"] span[class~="bg-muted"][class~="size-3.5"][class~="rounded-full"] > img
- avatars-status-r9:3105 — [data-slot="skeleton"][class~="rounded-full"]:is([class~="size-7"],[class~="size-8"],[class~="size-9"])

Declarations: border-radius:0; border-width:0; box-shadow:none; outline:none; clip-path:var(--wd-avatar-cut-sm)
### 5. 9 blocks · 1 declarations · sections badge-r9, form-controls-r9, loader-r97, motion, motion-r7, motion-r8

- motion:1417 — .vrcx-0-sidebar-surface::after, [data-slot="progress-indicator"], [data-slot="spinner"], [data-slot="dialog-content"][data-open] (@media (prefers-reduced-motion:reduce))
- motion-r7:1585 — [data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after (@media (prefers-reduced-motion:reduce))
- motion-r8:1890 — [data-slot='tabs']:not(.vrcx-0-side-panel-rail) [data-slot='tabs-tab'][data-active]::after
- motion-r8:1900 — .vrcx-0-statusbar[data-vrcx-0-surface='statusbar']::before, .vrcx-0-sidebar-surface [data-sidebar='menu-button'][data-active]::before, .vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0']::after, .vrcx-0-sidebar-surface [data-sidebar='content']::after (@media (prefers-reduced-motion: reduce))
- badge-r9:2398 — .vrcx-0-titlebar:has(button[class~='w-9'][class~='rounded-none'][class~='border-0']:hover) button:has(> svg.lucide-bell) > [data-slot='badge']
- badge-r9:2405 — body:has([data-slot='empty'] > div.flex.items-center.gap-2 > svg[data-slot='spinner']) .vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge']
- form-controls-r9:3330 — :where([data-slot="spinner"]) (@media (prefers-reduced-motion:reduce))
- loader-r97:4866 — svg.lucide.animate-spin, [data-type=loading] [data-slot=toast-icon]>svg (@media (prefers-reduced-motion:reduce))
- loader-r97:4869 — html.reduce-effects :is([data-slot=spinner],svg.lucide.animate-spin,[data-type=loading] [data-slot=toast-icon]>svg)

Declarations: animation:none !important
### 6. 9 blocks · 2 declarations · sections dialogs-r9, favorites-r9, overlays-r10, popups-r9, runtime

- runtime:727 — .vrcx-0-app-root *, .vrcx-0-app-root *::before, .vrcx-0-app-root *::after (@media (prefers-reduced-motion:reduce))
- popups-r9:2714 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar-image"]
- popups-r9:2717 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) (@media (prefers-reduced-motion: reduce))
- dialogs-r9:3492 — html.reduce-effects :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"])[data-open]:not(.entity-dialog):not(.owner-dialog)
- dialogs-r9:3497 — :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"])[data-open]:not(.entity-dialog):not(.owner-dialog) (@media (prefers-reduced-motion: reduce))
- overlays-r10:3712 — [data-slot="tooltip-content"], [data-slot="hover-card-content"], [data-slot="toast-viewport"] > *, [data-slot="sheet-popup"]:has([data-slot="sheet-title"] .lucide-bell) (@media (prefers-reduced-motion: reduce))
- overlays-r10:3719 — html.reduce-effects [data-slot="tooltip-content"], html.reduce-effects [data-slot="hover-card-content"], html.reduce-effects [data-slot="toast-viewport"] > *, html.reduce-effects [data-slot="sheet-popup"]:has([data-slot="sheet-title"] .lucide-bell)
- favorites-r9:4039 — .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) :is([class~="group/rail-row"],[class~="group/tile"],[class~="group-hover/tile:opacity-0"],[class~="absolute"][class~="top-2"][class~="left-2"],[data-slot="resizable-handle"],[data-slot="checkbox"]) (@media (prefers-reduced-motion:reduce))
- favorites-r9:4046 — html.reduce-effects .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) :is([class~="group/rail-row"],[class~="group/tile"],[class~="group-hover/tile:opacity-0"],[class~="absolute"][class~="top-2"][class~="left-2"],[data-slot="resizable-handle"],[data-slot="checkbox"])

Declarations: animation:none !important; transition:none !important
### 7. 8 blocks · 5 declarations · sections avatars-status-r9

- avatars-status-r9:2881 — button:has(> span[class~="size-10"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]) > span[class~="size-10"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]
- avatars-status-r9:2897 — [data-slot="hover-card-content"] > div[class~="relative"][class~="isolate"][class~="w-full"] > div[class~="space-y-2.5"] > div[class~="relative"][class~="isolate"] > button[class~="size-10"] > span[class~="bg-muted"][class~="size-full"][class~="rounded-full"]
- avatars-status-r9:2916 — [data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"] > img
- avatars-status-r9:2926 — .activity-skin span.block.shrink-0.overflow-hidden.rounded-full[class~="size-16"]
- avatars-status-r9:2948 — .object-row > [data-slot="hover-card-trigger"] > div[class~="relative"][class~="ml-2"][class~="overflow-visible"] > span[class~="bg-muted"][class~="rounded-full"][class~="border"]
- avatars-status-r9:3019 — [data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] > button[class~="size-11"][class~="rounded-full"][class~="border"], [data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] span[class~="bg-muted"][class~="size-11"][class~="rounded-full"]
- avatars-status-r9:3027 — [data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] > button[class~="size-11"][class~="rounded-full"][class~="border"] > img
- avatars-status-r9:3098 — [data-slot="skeleton"][class~="rounded-full"]:is([class~="size-14"],[class~="size-16"])

Declarations: border-radius:0; border-width:0; box-shadow:none; outline:none; clip-path:var(--wd-avatar-cut)
### 8. 6 blocks · 1 declarations · sections motion, motion-r8, nav-phone-r10, runtime

- runtime:667 — .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]
- motion:1401 — .vrcx-0-side-panel
- motion:1405 — .vrcx-0-sidebar-surface
- motion-r8:1851 — .vrcx-0-sidebar-surface [data-sidebar='menu-button'][data-active]
- motion-r8:1870 — .vrcx-0-titlebar[data-app-titlebar] button[class~='w-9'][class~='rounded-none'][class~='border-0']
- nav-phone-r10:5109 — [data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]

Declarations: position:relative
### 9. 5 blocks · 2 declarations · sections buttons-badges-r10, entity-button-roles-b054-b072: explicit action roles share portal states., form-controls-r9, user-dialog-r9

- user-dialog-r9:2298 — .entity-dialog .flex.flex-wrap.gap-1\.5 > [data-slot="button"][data-variant="ghost"][data-size="icon-xs"][title]:focus-visible
- form-controls-r9:3293 — :where( :is([data-slot="checkbox"],input[type="checkbox"]):focus-visible, :is([role="radio"],input[type="radio"]):focus-visible, input[type="range"]:not(.entity-dialog *):focus-visible, [data-slot="slider"]:focus-visible [data-slot="slider-thumb"] )
- buttons-badges-r10:4246 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant]:focus-visible:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- buttons-badges-r10:4261 — :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant]:focus-visible
- entity-button-roles-b054-b072: explicit action roles share portal states.:5232 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))):focus-visible

Declarations: outline:2px solid #ff7fcf; outline-offset:2px
### 10. 5 blocks · 2 declarations · sections data-surfaces-r10

- data-surfaces-r10:4374 — :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) :is([data-slot="table-row"], [data-vrcx-0-table-row]):focus-visible
- data-surfaces-r10:4437 — :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) [data-day]:focus-visible
- data-surfaces-r10:4507 — :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) [data-slot="card"][data-size="sm"][class~="group/tile"][class~="rounded-object"]:focus-visible, :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) button[data-slot="button"][class~="object-row"][class~="rounded-object"]:focus-visible
- data-surfaces-r10:4592 — :where(.vrcx-0-main-content #instance-history-list) .group > button[aria-pressed]:focus-visible
- data-surfaces-r10:4698 — :where(.vrcx-0-main-content .activity-skin) [data-slot="button"].h-auto.w-full.justify-start.rounded-none:focus-visible

Declarations: outline:2px dashed var(--wd-pink); outline-offset:-2px
### 11. 5 blocks · 3 declarations · sections favorites-r9, fields-toolbar-r10, tools-ui-r9

- tools-ui-r9:2804 — .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:focus-within
- fields-toolbar-r10:3524 — .vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *):focus-within
- fields-toolbar-r10:3583 — .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="input-group"]:has(> [data-slot="combobox-chips"]):focus-within
- favorites-r9:3881 — .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[class~="border-dashed"]:focus-visible
- favorites-r9:3958 — .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"]:focus-visible

Declarations: outline:2px solid #ff7fcf; outline-offset:1px; z-index:2
### 12. 4 blocks · 2 declarations · sections fields-toolbar-r10, tools-ui-r9

- tools-ui-r9:2820 — .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-slot="input-group-control"]::placeholder
- fields-toolbar-r10:3531 — .vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *) [data-slot="input-group-control"]::placeholder
- fields-toolbar-r10:3542 — :where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"]))::placeholder
- fields-toolbar-r10:3595 — .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="combobox-chip-input"]::placeholder

Declarations: color:#b9add9; opacity:1
### 13. 3 blocks · 2 declarations · sections avatars-status-r9

- avatars-status-r9:3060 — [data-slot="avatar"][class~="rounded-md"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"]), [data-slot="avatar"][class~="rounded-lg"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])
- avatars-status-r9:3065 — [data-slot="avatar"][class~="rounded-md"]::after, [data-slot="avatar"][class~="rounded-lg"]::after
- avatars-status-r9:3080 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"][class~="rounded-md"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset])) > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"]), :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"][class~="rounded-lg"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset])) > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])

Declarations: border-radius:inherit; clip-path:none
### 14. 3 blocks · 2 declarations · sections buttons-badges-r10, entity-button-roles-b054-b072: explicit action roles share portal states.

- buttons-badges-r10:4236 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"]:is([data-variant="outline"],[data-variant="secondary"]):hover:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- buttons-badges-r10:4258 — :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant="ghost"]:hover:not(:disabled)
- entity-button-roles-b054-b072: explicit action roles share portal states.:5215 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))):is([data-variant="outline"],[data-variant="secondary"]):hover:not(:disabled):not([aria-disabled="true"]):not([data-disabled])

Declarations: background:var(--jk-button-hover-face); color:var(--jk-button-hover-text)
### 15. 3 blocks · 1 declarations · sections buttons-badges-r10, fields-toolbar-r10, popups-r9

- popups-r9:2760 — :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) [data-slot="menubar-shortcut"]
- fields-toolbar-r10:3546 — :where([data-slot="field-description"])
- buttons-badges-r10:4289 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="alert-description"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))

Declarations: color:#b9add9
### 16. 3 blocks · 2 declarations · sections cards-r97, login-r8, navigation-r7

- navigation-r7:1532 — .vrcx-0-sidebar-surface [data-sidebar="footer"] > [data-sidebar="menu"]
- login-r8:2066 — [data-vrcx-0-surface="login-page"].vrcx-0-main-shell > div
- cards-r97:4900 — :is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),[data-tools-section]) [data-slot=card-header]

Declarations: position:relative; z-index:1
### 17. 3 blocks · 1 declarations · sections cards-r97, login-r8, runtime

- runtime:696 — [data-slot="avatar"]::before
- login-r8:2179 — [data-vrcx-0-surface="login-page"] [data-slot="avatar"]::before
- cards-r97:4899 — .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]) [data-slot=card-header] [data-slot=collapsible-trigger]::after

Declarations: content:none
### 18. 3 blocks · 2 declarations · sections controls-r9, tools-ui-r9

- controls-r9:2457 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"]:hover:not([data-disabled]):not([aria-disabled="true"])
- controls-r9:2495 — .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"] > :is([data-slot="toggle"],[data-slot="tooltip-trigger"][aria-pressed]):hover:not([data-disabled]):not([aria-disabled="true"])
- tools-ui-r9:2857 — .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"] > [data-slot="tabs-tab"]:hover:not([data-disabled]):not([aria-disabled="true"])

Declarations: background-color:#3b2c55; color:#f2ebff
### 19. 3 blocks · 2 declarations · sections data-surfaces-r10

- data-surfaces-r10:4565 — :where(.vrcx-0-main-content > .vrcx-0-page-scaffold.friend-view) [data-slot="card"][data-size="sm"]:focus-visible
- data-surfaces-r10:4626 — :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) .bg-card.relative.h-full.min-h-0.min-w-0.flex-1.overflow-hidden.rounded-lg.border > button[aria-pressed]:focus-visible
- data-surfaces-r10:4670 — :where(.vrcx-0-main-content #chart) button.group.hover\:bg-accent.flex.w-full.items-center.rounded-lg.border:focus-visible

Declarations: outline:2px dashed var(--wd-pink); outline-offset:-3px
### 20. 3 blocks · 2 declarations · sections data-surfaces-r10, form-controls-r9

- form-controls-r9:3248 — :where([role="radio"] > span)
- data-surfaces-r10:4704 — :where(.vrcx-0-titlebar) span.h-\[2px\].rounded-full
- data-surfaces-r10:4712 — :where(.vrcx-0-main-content #chart) > .relative .h-1.rounded-full

Declarations: border-radius:0; background-color:#16112a
### 21. 3 blocks · 1 declarations · sections fields-toolbar-r10, login-r8, tools-ui-r9

- login-r8:2260 — [data-vrcx-0-surface="login-page"] [data-slot="button"][data-variant="link"]
- tools-ui-r9:2809 — .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-slot="input-group-addon"]
- fields-toolbar-r10:3527 — .vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *) [data-slot="input-group-addon"]

Declarations: color:#d6b8ef
### 22. 3 blocks · 4 declarations · sections login-r8, popups-r9, runtime

- runtime:692 — [data-slot="avatar"]
- login-r8:2173 — [data-vrcx-0-surface="login-page"] [data-slot="avatar"]
- popups-r9:2702 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset]))

Declarations: border-radius:0; background:transparent; box-shadow:none; outline:none
### 23. 3 blocks · 1 declarations · sections login-r8, popups-r9, runtime

- runtime:694 — [data-slot="avatar"][data-size="lg"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])
- login-r8:2194 — [data-vrcx-0-surface="login-page"] [data-slot="avatar"][data-size="lg"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])
- popups-r9:2705 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"][data-size="lg"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset])) > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])

Declarations: clip-path:var(--wd-avatar-cut)
### 24. 3 blocks · 2 declarations · sections login-r8, popups-r9, runtime

- runtime:695 — [data-slot="avatar"]::after
- login-r8:2182 — [data-vrcx-0-surface="login-page"] [data-slot="avatar"]::after
- popups-r9:2703 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset]))::after

Declarations: border-color:transparent; border-width:0
### 25. 3 blocks · 1 declarations · sections popups-r9

- popups-r9:2688 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-variant="destructive"]:is(:hover,:focus-visible,[data-highlighted]):not([data-disabled]):not(:disabled):not([aria-disabled="true"])
- popups-r9:2691 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-variant="destructive"]:is(:hover,:focus-visible,[data-highlighted]):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) *
- popups-r9:2756 — :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) [data-variant="destructive"]:is(:hover,:focus-visible,[data-highlighted]):not([data-disabled]):not(:disabled):not([aria-disabled="true"]), :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) [data-variant="destructive"]:is(:hover,:focus-visible,[data-highlighted]):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) *

Declarations: color:#16112a !important
### 26. 2 blocks · 2 declarations · sections avatars-status-r9

- avatars-status-r9:3052 — [data-slot="avatar"][class~="rounded-md"]
- avatars-status-r9:3072 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"][class~="rounded-md"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset]))

Declarations: border-radius:var(--radius-md,calc(var(--radius) - 2px)); clip-path:none
### 27. 2 blocks · 2 declarations · sections avatars-status-r9

- avatars-status-r9:3056 — [data-slot="avatar"][class~="rounded-lg"]
- avatars-status-r9:3076 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"][class~="rounded-lg"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset]))

Declarations: border-radius:var(--radius-lg,var(--radius)); clip-path:none
### 28. 2 blocks · 6 declarations · sections badge-r9

- badge-r9:2411 — .vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge'] (@media (prefers-reduced-motion: reduce))
- badge-r9:2421 — html.reduce-effects .vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge']

Declarations: animation:none !important; background-color:#21132d; color:#ffd9ee; border-color:#16112a; outline:none; box-shadow:inset 0 0 0 1px #ffe4f2
### 29. 2 blocks · 1 declarations · sections body-typography

- body-typography:938 — html, body
- body-typography:947 — .font-sans:not(kbd):not(.font-mono), .font-heading:not(kbd):not(.font-mono)

Declarations: font-family:var(--wd-body-font-family)
### 30. 2 blocks · 4 declarations · sections brand-heart-r97

- brand-heart-r97:4808 — .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after (@media (prefers-reduced-motion:reduce))
- brand-heart-r97:4810 — html.reduce-effects .vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after

Declarations: animation:none !important; background-image:var(--jk-r97-heart-m) !important; background-size:10px 8px !important; background-position:1px 1px !important
### 31. 2 blocks · 2 declarations · sections buttons-badges-r10

- buttons-badges-r10:4245 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant]:active:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- buttons-badges-r10:4260 — :where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])) [data-slot="button"][data-variant]:active:not(:disabled)

Declarations: box-shadow:var(--jk-button-pressed); transform:translate(1px,1px)
### 32. 2 blocks · 5 declarations · sections buttons-badges-r10

- buttons-badges-r10:4292 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) div.bg-popover.text-popover-foreground:has(> span.text-muted-foreground.px-1\.5.font-medium.whitespace-nowrap.tabular-nums):has(> [data-slot="button"]):where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- buttons-badges-r10:4293 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) div.bg-popover.text-popover-foreground:has(> span.text-muted-foreground.px-2.font-medium.whitespace-nowrap.tabular-nums):has(> [data-slot="button"]):where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))

Declarations: border-radius:0; border-color:#6c5ce0; background:#201936; box-shadow:0 0 0 1px #3d305e,3px 3px 0 #100b1e; backdrop-filter:none
### 33. 2 blocks · 2 declarations · sections buttons-badges-r10, entity-button-roles-b054-b072: explicit action roles share portal states.

- buttons-badges-r10:4234 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="default"]:hover:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- entity-button-roles-b054-b072: explicit action roles share portal states.:5213 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))))[data-variant="default"]:hover:not(:disabled):not([aria-disabled="true"]):not([data-disabled])

Declarations: background:var(--jk-button-default-hover); color:var(--jk-button-default-text)
### 34. 2 blocks · 3 declarations · sections buttons-badges-r10, entity-button-roles-b054-b072: explicit action roles share portal states.

- buttons-badges-r10:4235 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="outline"]:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)), :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="secondary"]:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- entity-button-roles-b054-b072: explicit action roles share portal states.:5214 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full)))):is([data-variant="outline"],[data-variant="secondary"])

Declarations: border-color:var(--jk-button-edge); background:var(--jk-button-face); color:var(--jk-button-text)
### 35. 2 blocks · 3 declarations · sections buttons-badges-r10, entity-button-roles-b054-b072: explicit action roles share portal states.

- buttons-badges-r10:4239 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="ghost"]:hover:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action):not(.bg-red-50):not(.bg-amber-50):not(.bg-sky-50))
- entity-button-roles-b054-b072: explicit action roles share portal states.:5217 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))))[data-variant="ghost"]:hover:not(:disabled):not([aria-disabled="true"]):not([data-disabled])

Declarations: background:#392a52; color:#fff0fa; box-shadow:inset 1px 1px #6c5ce0,inset -1px -1px #16112a
### 36. 2 blocks · 2 declarations · sections buttons-badges-r10, entity-button-roles-b054-b072: explicit action roles share portal states.

- buttons-badges-r10:4242 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="destructive"]:hover:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- entity-button-roles-b054-b072: explicit action roles share portal states.:5224 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))))[data-variant="destructive"]:is(:hover,:focus-visible):not(:disabled):not([aria-disabled="true"]):not([data-disabled])

Declarations: background:#ff6b8a; color:#16112a
### 37. 2 blocks · 6 declarations · sections buttons-badges-r10, entity-button-roles-b054-b072: explicit action roles share portal states.

- buttons-badges-r10:4243 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="link"]:where(:not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- entity-button-roles-b054-b072: explicit action roles share portal states.:5225 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))))[data-variant="link"]

Declarations: border:0; background:transparent; color:#d6b8ef; box-shadow:none; text-decoration:underline dotted #8f7fe0; text-underline-offset:4px
### 38. 2 blocks · 2 declarations · sections buttons-badges-r10, entity-button-roles-b054-b072: explicit action roles share portal states.

- buttons-badges-r10:4244 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="link"]:hover:where(:not(:disabled):not([aria-disabled="true"]):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))
- entity-button-roles-b054-b072: explicit action roles share portal states.:5226 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))))[data-variant="link"]:hover:not(:disabled):not([aria-disabled="true"]):not([data-disabled])

Declarations: color:#ffb8e6; text-decoration-color:#ffb8e6
### 39. 2 blocks · 1 declarations · sections buttons-badges-r10, favorites-r9

- favorites-r9:3751 — .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] > .flex.h-full.min-h-0.flex-col.gap-3.overflow-auto.p-2 > .flex.flex-col.gap-1 > .mb-1.flex.items-center.justify-between.text-sm.font-semibold
- buttons-badges-r10:4288 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="alert-title"]:where(:not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))

Declarations: color:#f2ebff
### 40. 2 blocks · 4 declarations · sections buttons-badges-r10, fields-toolbar-r10

- fields-toolbar-r10:3559 — .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="default"] > [data-slot="toggle"]:is([data-pressed],[aria-pressed="true"])
- buttons-badges-r10:4282 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="tabs-list"]:where(:not(.vrcx-0-page-scaffold *):not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) > [data-slot="tabs-tab"]:is([data-active],[aria-selected="true"])

Declarations: border-color:#6c5ce0; background:#ffb8e6; color:#16112a; box-shadow:inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d
### 41. 2 blocks · 1 declarations · sections buttons-badges-r10, navigation-r7

- navigation-r7:1453 — .vrcx-0-sidebar-surface [data-sidebar="menu"]
- buttons-badges-r10:4274 — :where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="pagination-content"]

Declarations: gap:2px
### 42. 2 blocks · 3 declarations · sections cards-r97, settings

- settings:1305 — .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header]
- cards-r97:4891 — [data-tools-section] [data-slot=card-header]

Declarations: background-color:#2f2552; border-bottom:1px solid #16112a; box-shadow:inset 0 1px #fdf4ff
### 43. 2 blocks · 5 declarations · sections cards-r97, settings

- settings:1307 — .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger]
- cards-r97:4894 — [data-tools-section] [data-slot=card-header] [data-slot=collapsible-trigger]

Declarations: position:relative; padding-left:36px; padding-right:10px; border-radius:0; color:#f2ebff
### 44. 2 blocks · 1 declarations · sections cards-r97, settings

- settings:1308 — .vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger]:hover
- cards-r97:4895 — [data-tools-section] [data-slot=card-header] [data-slot=collapsible-trigger]:hover

Declarations: background-color:#3a2b63
### 45. 2 blocks · 3 declarations · sections cat-motion-r96

- cat-motion-r96:4836 — .vrcx-0-sidebar-surface [data-sidebar="content"]::after, .vrcx-0-side-panel::after (@media (prefers-reduced-motion:reduce))
- cat-motion-r96:4838 — html.reduce-effects .vrcx-0-sidebar-surface [data-sidebar="content"]::after, html.reduce-effects .vrcx-0-side-panel::after

Declarations: animation:none !important; transform:none; opacity:1
### 46. 2 blocks · 4 declarations · sections controls-r9

- controls-r9:2461 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"]:is([data-active],[aria-selected="true"])
- controls-r9:2499 — .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"] > :is([data-slot="toggle"],[data-slot="tooltip-trigger"][aria-pressed]):is([aria-pressed="true"],[data-pressed])

Declarations: border-color:#6c5ce0; background-color:#ffb8e6 !important; color:#16112a !important; box-shadow:inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d !important
### 47. 2 blocks · 7 declarations · sections controls-r9

- controls-r9:2573 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="button"][data-variant="default"]
- controls-r9:2590 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="1"] [data-slot="button"][data-variant="default"]

Declarations: min-height:28px; border:1px solid #6c5ce0; border-radius:0; background:#ffb8e6; color:#16112a; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d,2px 2px 0 #100b1e; transition:none
### 48. 2 blocks · 1 declarations · sections controls-r9

- controls-r9:2582 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="button"][data-variant="default"]:hover:not(:disabled):not([aria-disabled="true"])
- controls-r9:2599 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="1"] [data-slot="button"][data-variant="default"]:hover:not(:disabled):not([aria-disabled="true"])

Declarations: background:#ffd9ee
### 49. 2 blocks · 1 declarations · sections controls-r9, fields-toolbar-r10

- controls-r9:2467 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"] > span:last-child
- fields-toolbar-r10:3545 — :where([data-slot="field-label"]), :where([data-slot="label"])

Declarations: color:#e3d2f5
### 50. 2 blocks · 1 declarations · sections controls-r9, fields-toolbar-r10

- controls-r9:2505 — .vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"] > :is([data-slot="toggle"],[data-slot="tooltip-trigger"][aria-pressed]):is([aria-pressed="true"],[data-pressed])::before
- fields-toolbar-r10:3561 — .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="default"] > [data-slot="toggle"]:is([data-pressed],[aria-pressed="true"])::before

Declarations: content:none !important
### 51. 2 blocks · 7 declarations · sections controls-r9, tools-ui-r9

- controls-r9:2437 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"])
- tools-ui-r9:2837 — .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]

Declarations: gap:2px; padding:1px; border:1px solid #6c5ce0; border-radius:0; background-color:#201936; color:#e3d2f5; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d
### 52. 2 blocks · 6 declarations · sections controls-r9, tools-ui-r9

- controls-r9:2449 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"]
- tools-ui-r9:2849 — .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"] > [data-slot="tabs-tab"]

Declarations: border-radius:0; border-color:transparent; background-color:transparent; color:#e3d2f5; box-shadow:none; transition:none
### 53. 2 blocks · 3 declarations · sections controls-r9, tools-ui-r9

- controls-r9:2473 — .vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) > [data-slot="tabs-tab"]:focus-visible
- tools-ui-r9:2867 — .vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"] > [data-slot="tabs-tab"]:focus-visible

Declarations: z-index:2; outline:2px solid #ff7fcf; outline-offset:-2px
### 54. 2 blocks · 5 declarations · sections data-surfaces-r10

- data-surfaces-r10:4338 — :where(.vrcx-0-main-content) :is(.vrcx-0-data-table, .app-data-table) [data-slot="table-footer"]
- data-surfaces-r10:4475 — :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:not(:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"], .favorites-body))) [data-slot="card-footer"]

Declarations: border-top-style:dotted; border-top-color:#70518f; border-radius:0; background-color:var(--wd-raised); color:var(--wd-text)
### 55. 2 blocks · 2 declarations · sections data-surfaces-r10

- data-surfaces-r10:4495 — :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) [data-slot="card"][data-size="sm"][class~="group/tile"][class~="rounded-object"]:hover, :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) button[data-slot="button"][class~="object-row"][class~="rounded-object"]:hover
- data-surfaces-r10:4666 — :where(.vrcx-0-main-content #chart) button.group.hover\:bg-accent.flex.w-full.items-center.rounded-lg.border:hover

Declarations: border-color:var(--wd-pink); background-color:var(--wd-raised)
### 56. 2 blocks · 3 declarations · sections data-surfaces-r10

- data-surfaces-r10:4520 — :where(.vrcx-0-main-content > .vrcx-0-page-scaffold) .group\/feed-column-header
- data-surfaces-r10:4604 — :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="collapsible"] > div.sticky.top-0)) [data-slot="collapsible"] > div.sticky.top-0.border-b

Declarations: border-bottom:1px dotted #70518f; background-color:var(--wd-raised); color:var(--wd-text)
### 57. 2 blocks · 2 declarations · sections data-surfaces-r10

- data-surfaces-r10:4708 — :where(.vrcx-0-titlebar) span.h-\[2px\].rounded-full > span
- data-surfaces-r10:4716 — :where(.vrcx-0-main-content #chart) > .relative .h-1.rounded-full > .bg-primary

Declarations: border-radius:0; background-color:var(--wd-pink)
### 58. 2 blocks · 1 declarations · sections data-surfaces-r10, runtime

- runtime:662 — [data-slot="dialog-title"]
- data-surfaces-r10:4413 — :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) [data-slot="calendar-month-caption"], :is(:where(.vrcx-0-main-content) [data-slot="calendar"], :where([data-slot="popover-content"]) [data-slot="calendar"]) .text-sm.font-medium

Declarations: color:var(--wd-text)
### 59. 2 blocks · 1 declarations · sections dialog-header-r97, dialogs-r9

- dialogs-r9:3369 — :is([data-slot="dialog-content"], [data-slot="alert-dialog-content"])[class~="p-0"]
- dialog-header-r97:4842 — [data-slot$=dialog-content][class~=p-0]>[data-slot$=dialog-header]:is(.flex-row,:has(>:not([data-slot$=title],[data-slot$=description]) button))

Declarations: --r9-dialog-inset:0px
### 60. 2 blocks · 1 declarations · sections entity-button-roles-b054-b072: explicit action roles share portal states.

- entity-button-roles-b054-b072: explicit action roles share portal states.:5220 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))))[data-variant="ghost"].text-destructive
- entity-button-roles-b054-b072: explicit action roles share portal states.:5222 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))))[data-variant="ghost"][class~="hover:text-destructive"]:hover:not(:disabled):not([aria-disabled="true"]):not([data-disabled])

Declarations: color:var(--jk-button-danger-text)
### 61. 2 blocks · 1 declarations · sections entity-button-roles-b054-b072: explicit action roles share portal states., splitter-r97

- splitter-r97:4913 — [data-slot=resizable-handle].bg-transparent
- entity-button-roles-b054-b072: explicit action roles share portal states.:5234 — :is(:is(button[data-ui-role="action"],:where([data-slot="dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="alert-dialog-content"]:not(.entity-dialog,.owner-dialog),[data-slot="sheet-content"],[data-slot="popover-content"],[data-slot="hover-card-content"]) button[data-variant]:where(:not(.entity-dialog *,.owner-dialog *,[data-ui-role="tile"],[data-ui-role="color-swatch"],.rounded-object,.rounded-full,[data-ui-role="text-link"],[data-ui-role="disclosure"],[data-slot="dialog-close"],[data-slot="combobox-chip-remove"],[data-slot$="dialog-header"] *,[data-slot$="menu-content"] *,[data-slot$="menu-sub-content"] *,[data-ui-role="icon-grid"] *,[data-ui-role="choice-list"] *,[data-slot="collapsible-trigger"],.h-auto.justify-start,.h-auto:has(img),.absolute.inset-0.h-full.w-full))))[data-variant="link"]:is(:disabled,[aria-disabled="true"],[data-disabled])

Declarations: box-shadow:none
### 62. 2 blocks · 1 declarations · sections favorites-r9

- favorites-r9:3797 — .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"][class~="bg-(--state-selected-surface)"] > [data-slot="button"]
- favorites-r9:3803 — .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] [class~="group/rail-row"][class~="bg-(--state-selected-surface)"] > [data-slot="button"] :is([class~="text-muted-foreground"],[class~="tabular-nums"])

Declarations: color:#16112a
### 63. 2 blocks · 6 declarations · sections favorites-r9

- favorites-r9:3834 — .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[data-size="icon-sm"], .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[data-size="icon-xs"]
- favorites-r9:4020 — .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] button[data-size="icon-sm"]

Declarations: border:1px solid #6c5ce0; border-radius:0; background:#201936; color:#f2ebff; box-shadow:inset 1px 1px rgb(253 244 255/.14),inset -1px -1px #16112a; transition:none
### 64. 2 blocks · 3 declarations · sections fields-toolbar-r10

- fields-toolbar-r10:3570 — :where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"]))
- fields-toolbar-r10:3576 — :where([data-slot="input-group"]:not(#chart [data-vrcx-0-control="toolbar"][data-slot="input-group"]))

Declarations: border-radius:0; border-color:var(--jk-field-edge); box-shadow:var(--jk-field-inset)
### 65. 2 blocks · 3 declarations · sections fields-toolbar-r10

- fields-toolbar-r10:3581 — :where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"]):focus-visible)
- fields-toolbar-r10:3607 — :where([data-slot="input-otp-slot"]:is([data-active="true"],[data-focused]))

Declarations: border-color:#ff7fcf; outline:2px solid #ff7fcf; outline-offset:1px
### 66. 2 blocks · 1 declarations · sections fields-toolbar-r10, navigation-r7

- navigation-r7:1452 — .vrcx-0-sidebar-surface [data-sidebar="group"]
- fields-toolbar-r10:3611 — :where(input[type="color"])::-webkit-color-swatch-wrapper

Declarations: padding:0
### 67. 2 blocks · 3 declarations · sections form-controls-r9

- form-controls-r9:3217 — :where(:is([data-slot="checkbox"],input[type="checkbox"]):is([data-checked],[aria-checked="true"],:checked))
- form-controls-r9:3243 — :where(:is([role="radio"],input[type="radio"]):is([data-checked],[aria-checked="true"],:checked))

Declarations: border-color:#6c5ce0; background-color:#ffb8e6; box-shadow:inset 1px 1px #fff0fa,inset -1px -1px #b15b9d
### 68. 2 blocks · 2 declarations · sections loader-r9

- loader-r9:3188 — .vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) > svg[data-slot="spinner"] (@media (prefers-reduced-motion: reduce))
- loader-r9:3193 — html.reduce-effects .vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"]) > svg[data-slot="spinner"]

Declarations: animation:none !important; background-position:0 0 !important
### 69. 2 blocks · 2 declarations · sections loader-r9, loader-r97

- loader-r9:3154 — .vrcx-0-main-content [data-slot="empty"]:not(.min-h-24):not(.min-h-0) > [data-slot="empty-content"] > div.flex.items-center.gap-2:has(> svg[data-slot="spinner"])
- loader-r97:4857 — div.justify-center.gap-2:not([data-slot],.min-h-\[72px\]):has(>svg:is([data-slot=spinner],.animate-spin))

Declarations: flex-direction:column; gap:10px
### 70. 2 blocks · 1 declarations · sections loader-r97

- loader-r97:4865 — :root (@media (prefers-reduced-motion:reduce))
- loader-r97:4868 — html.reduce-effects

Declarations: --jk-dance:none
### 71. 2 blocks · 1 declarations · sections loader-r97, pixel-controls

- pixel-controls:1356 — [data-slot=spinner]
- loader-r97:4856 — svg.lucide.animate-spin, [data-type=loading] [data-slot=toast-icon]>svg

Declarations: animation-timing-function:steps(8,end)
### 72. 2 blocks · 5 declarations · sections login-r8, privacy-lock-r96

- login-r8:2199 — [data-vrcx-0-surface="login-page"] [data-slot="button"][data-variant="outline"], [data-vrcx-0-surface="login-page"] [data-slot="button"][data-variant="secondary"]
- privacy-lock-r96:4763 — [data-vrcx-0-surface="privacy-lock"] [data-slot="button"][data-variant="outline"]

Declarations: border:1px solid #8c71b0; border-radius:2px; background-color:#3b2c55; color:#f2ebff; box-shadow:2px 2px 0 #100b1e, inset 0 1px 0 rgb(255 255 255 / 12%)
### 73. 2 blocks · 2 declarations · sections nav-phone-r10

- nav-phone-r10:5197 — [data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]::after (@media (prefers-reduced-motion: reduce))
- nav-phone-r10:5199 — html.reduce-effects [data-slot="sidebar"][data-state="expanded"] [data-slot="sidebar-inner"]::after

Declarations: animation:none !important; background-position:var(--r10-phone-nav-state-stop)
### 74. 2 blocks · 2 declarations · sections pixel-controls

- pixel-controls:1336 — ::-webkit-scrollbar-thumb:horizontal
- pixel-controls:1349 — [data-orientation=horizontal]>[data-slot=scroll-area-thumb]

Declarations: background-image:<redacted-or-long-value len=625 sha256=8dac7435e35358e5>; background-size:8px 6px
### 75. 2 blocks · 1 declarations · sections pixel-controls

- pixel-controls:1337 — ::-webkit-scrollbar-thumb:hover
- pixel-controls:1350 — [data-slot=scroll-area-thumb]:hover

Declarations: background-color:#ffb8e6
### 76. 2 blocks · 1 declarations · sections pixel-controls, splitter-r97

- pixel-controls:1330 — [data-slot=switch-thumb] (@media (prefers-reduced-motion:reduce))
- splitter-r97:4919 — [data-slot=resizable-handle], [data-slot=resizable-handle]::before (@media (prefers-reduced-motion:reduce))

Declarations: transition:none
### 77. 2 blocks · 10 declarations · sections popups-r9

- popups-r9:2649 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"])
- popups-r9:2722 — :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"])

Declarations: --radius:0px; background:#211a33 !important; color:#f2ebff; opacity:1; border:1px solid #6c5ce0; border-radius:0 !important; box-shadow:inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e; backdrop-filter:none; animation:none !important; transition:none !important
### 78. 2 blocks · 5 declarations · sections popups-r9

- popups-r9:2664 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-slot$="menu-label"],[data-slot="select-label"],[data-slot="combobox-label"])
- popups-r9:2734 — :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) [data-slot="menubar-label"]

Declarations: color:#ffd9ee; background:linear-gradient(#ffb8e6,#ffb8e6) 7px center / 7px 7px no-repeat #302344; padding-left:22px; border-bottom:1px solid #6c5ce0; font-weight:600
### 79. 2 blocks · 5 declarations · sections popups-r9

- popups-r9:2671 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-slot$="menu-item"],[data-slot$="menu-checkbox-item"],[data-slot$="menu-radio-item"],[data-slot$="menu-sub-trigger"],[data-slot="select-item"],[data-slot="combobox-item"],[data-slot="button"][data-variant="ghost"][class~="h-auto"][class~="justify-start"][class~="p-0"])
- popups-r9:2741 — :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) :is([data-slot="menubar-item"],[data-slot="menubar-checkbox-item"],[data-slot="menubar-radio-item"],[data-slot="menubar-sub-trigger"])

Declarations: background:transparent; color:#f2ebff; border-radius:0; animation:none !important; transition:none !important
### 80. 2 blocks · 4 declarations · sections popups-r9

- popups-r9:2680 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-slot$="menu-item"],[data-slot$="menu-checkbox-item"],[data-slot$="menu-radio-item"],[data-slot$="menu-sub-trigger"],[data-slot="select-item"],[data-slot="combobox-item"],[data-slot="button"][data-variant="ghost"][class~="h-auto"][class~="justify-start"][class~="p-0"]):is(:hover,:focus-visible,[data-highlighted],[data-popup-open]):not([data-disabled]):not(:disabled):not([aria-disabled="true"])
- popups-r9:2748 — :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) :is([data-slot="menubar-item"],[data-slot="menubar-checkbox-item"],[data-slot="menubar-radio-item"],[data-slot="menubar-sub-trigger"]):is(:hover,:focus-visible,[data-highlighted],[data-popup-open]):not([data-disabled]):not(:disabled):not([aria-disabled="true"])

Declarations: background:#ffb8e6 !important; color:#16112a !important; clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%); box-shadow:inset 0 1px 0 #ffd9ee, inset 0 -1px 0 #d97fc6
### 81. 2 blocks · 1 declarations · sections popups-r9

- popups-r9:2686 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is(:focus-visible,[data-highlighted],[data-popup-open],[data-slot$="-item"]:hover,[data-slot$="-trigger"]:hover,[data-slot="button"][class~="h-auto"]:hover):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) :is(.text-muted-foreground,[data-slot$="menu-shortcut"])
- popups-r9:2754 — :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) :is(:focus-visible,[data-highlighted],[data-popup-open],[data-slot="menubar-item"]:hover,[data-slot="menubar-sub-trigger"]:hover):not([data-disabled]):not(:disabled):not([aria-disabled="true"]) :is(.text-muted-foreground,[data-slot="menubar-shortcut"])

Declarations: color:#2a1d6e !important
### 82. 2 blocks · 1 declarations · sections popups-r9

- popups-r9:2687 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-variant="destructive"],[data-variant="destructive"] *)
- popups-r9:2755 — :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) [data-variant="destructive"]

Declarations: color:#ff7fae !important
### 83. 2 blocks · 5 declarations · sections popups-r9

- popups-r9:2693 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-disabled],[aria-disabled="true"],:disabled)
- popups-r9:2758 — :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) :is([data-disabled],[aria-disabled="true"],:disabled)

Declarations: color:#b9add9 !important; background:transparent !important; opacity:1; clip-path:none; box-shadow:none
### 84. 2 blocks · 2 declarations · sections popups-r9

- popups-r9:2697 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="select-content"],[data-slot="combobox-content"]) :is([data-slot$="menu-separator"],[data-slot="select-separator"],[data-slot="combobox-separator"])
- popups-r9:2759 — :is([data-slot="menubar-content"],[data-slot="menubar-sub-content"]) :is([data-slot="menubar-separator"])

Declarations: background:repeating-linear-gradient(90deg,#8c71b0 0 1px,transparent 1px 3px); border:0
### 85. 2 blocks · 5 declarations · sections popups-r9, runtime

- runtime:693 — [data-slot="avatar-image"], [data-slot="avatar-fallback"]
- popups-r9:2704 — :is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset])) > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])

Declarations: border-radius:0; clip-path:var(--wd-avatar-cut-sm); border-width:0; box-shadow:none; outline:none
### 86. 2 blocks · 2 declarations · sections runtime

- runtime:665 — [data-slot="tabs-tab"][data-active]
- runtime:717 — .vrcx-0-app-root ::selection

Declarations: background-color:var(--wd-pink); color:#16112a
### 87. 2 blocks · 2 declarations · sections runtime, user-dialog-r9

- runtime:686 — .entity-dialog [data-slot="card-header"] div.absolute.bottom-3.left-3 [data-slot="button"]:not(.border-0) img
- user-dialog-r9:2284 — .entity-dialog [data-slot="card-header"] > div.relative > div.absolute.bottom-3.left-3.z-30.size-16 > button[data-slot="button"] > img

Declarations: border-radius:0; clip-path:var(--wd-avatar-cut)
### 88. 2 blocks · 2 declarations · sections side-panel

- side-panel:1074 — .vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab']:hover
- side-panel:1123 — .vrcx-0-side-panel .vrcx-0-side-panel-rail > [data-slot='button']:hover

Declarations: background-color:var(--wd-select); color:var(--wd-text)
### 89. 2 blocks · 7 declarations · sections status-icons-r10

- status-icons-r10:4959 — [data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"], [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]
- status-icons-r10:5011 — [data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"], [data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]

Declarations: box-sizing:content-box; display:flex; flex:0 0 75.6px; width:75.6px; min-width:75.6px; position:relative; background-image:none
### 90. 2 blocks · 1 declarations · sections status-icons-r10

- status-icons-r10:5002 — [data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"] > svg, [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"] > svg
- status-icons-r10:5035 — [data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"] > svg, [data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"] > svg

Declarations: opacity:0 !important

## Near-equivalent candidate pairs (top 200)

| # | Score | Shared anchor | Section A | Selector A | Section B | Selector B | DOM hit branches A/B | Shared routes | Style-context groups A/B | Different properties | boundary? |
|---:|---:|---|---|---|---|---|---:|---:|---:|---|---|
| 1 | 1 | slot:avatar-image | runtime:693 | `[data-slot="avatar-image"], [data-slot="avatar-fallback"]` | login-r8:2186 | `[data-vrcx-0-surface="login-page"] [data-slot="avatar-image"], [data-vrcx-0-surface="login-page"] [data-slot="avatar-fallback"]` | 2/2 / 0/2 | 0 | 3/3 | — | ⚠ |
| 2 | 1 | slot:avatar-image | login-r8:2186 | `[data-vrcx-0-surface="login-page"] [data-slot="avatar-image"], [data-vrcx-0-surface="login-page"] [data-slot="avatar-fallback"]` | popups-r9:2704 | `:is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset])) > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])` | 0/2 / 0/1 | 0 | 3/7 | — | ⚠ |
| 3 | 1 | slot:popover-content | popups-r9:2704 | `:is([data-slot$="menu-content"],[data-slot$="menu-sub-content"],[data-slot="popover-content"],[data-slot="select-content"],[data-slot="combobox-content"]) [data-slot="avatar"]:not(:has([class~="-inset-[18.75%]"],[data-profile-decoration-asset])) > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])` | popups-r9:2711 | `[data-slot="popover-content"] [data-slot="scroll-area"] button:is([data-slot="button"],[data-slot="tooltip-trigger"])[data-variant="ghost"] span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"]` | 0/1 / 0/1 | 0 | 7/21 | — | ⚠ |
| 4 | 0.9111 | class:vrcx-0-main-content | controls-r9:2609 | `.vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > div.absolute:is(.w-64,.w-72)` | controls-r9:2631 | `:where(.vrcx-0-main-content .vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot]))` | 1/1 / 1/1 | 2 | 0/0 | --tw-ring-color | — |
| 5 | 0.9064 | slot:toast-viewport | status-icons-r10:4976 | `[data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::before, [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::before` | status-icons-r10:4995 | `[data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]::after, [data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]::after` | 0/2 / 0/2 | 0 | 1/1 | background-position | ⚠ |
| 6 | 0.8857 | slot:dialog-content | user-dialog-r8:1955 | `[data-slot="dialog-content"] span:has(> span[class~="size-3.75"]) > span.overflow-hidden` | avatars-status-r9:2907 | `[data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"]` | 0/1 / 0/1 | 0 | 0/12 | background-color | ⚠ |
| 7 | 0.8667 | class:vrcx-0-data-table | runtime:697 | `.vrcx-0-side-panel span:has(>span[class~="size-3.75"]) > span.overflow-hidden, .vrcx-0-data-table span:has(>span[class~="size-3.75"]) > span.overflow-hidden` | avatars-status-r9:2968 | `.vrcx-0-data-table :is( img[class~="size-6"][class~="rounded-full"][class~="object-cover"], div[class~="bg-muted"][class~="size-6"][class~="rounded-full"] )` | 1/2 / 1/1 | 0 | 0/0 | border-color | ⚠ |
| 8 | 0.8667 | slot:dialog-content | user-dialog-r8:1955 | `[data-slot="dialog-content"] span:has(> span[class~="size-3.75"]) > span.overflow-hidden` | avatars-status-r9:2916 | `[data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"] > img` | 0/1 / 0/1 | 0 | 0/12 | border-color | ⚠ |
| 9 | 0.8667 | slot:dialog-content | user-dialog-r8:1955 | `[data-slot="dialog-content"] span:has(> span[class~="size-3.75"]) > span.overflow-hidden` | avatars-status-r9:3019 | `[data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] > button[class~="size-11"][class~="rounded-full"][class~="border"], [data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] span[class~="bg-muted"][class~="size-11"][class~="rounded-full"]` | 0/1 / 0/2 | 0 | 0/0 | border-color | ⚠ |
| 10 | 0.8667 | slot:dialog-content | user-dialog-r8:1955 | `[data-slot="dialog-content"] span:has(> span[class~="size-3.75"]) > span.overflow-hidden` | avatars-status-r9:3027 | `[data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] > button[class~="size-11"][class~="rounded-full"][class~="border"] > img` | 0/1 / 0/1 | 0 | 0/0 | border-color | ⚠ |
| 11 | 0.8639 | slot:toast-viewport | status-icons-r10:5044 | `[data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"]::before` | status-icons-r10:5051 | `[data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]::before` | 0/1 / 0/1 | 0 | 1/1 | background-image | ⚠ |
| 12 | 0.84 | slot:toast-viewport | status-icons-r10:5017 | `[data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"]::before, [data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]::before` | status-icons-r10:5027 | `[data-slot="toast-viewport"] [data-type="info"] [data-slot="toast-icon"]::after, [data-slot="toast-viewport"] [data-type="warning"] [data-slot="toast-icon"]::after` | 0/2 / 0/2 | 0 | 1/1 | background, image-rendering | ⚠ |
| 13 | 0.84 | tag:img | avatars-status-r9:2940 | `.activity-skin span.block.shrink-0.overflow-hidden.rounded-full:is([class~="size-16"],[class~="size-7"],[class~="size-9"]) > :is(img,span[class~="rounded-full"])` | avatars-status-r9:2995 | `img[class~="mr-2.5"][class~="size-9"][class~="shrink-0"][class~="rounded-full"][class~="object-cover"], div[class~="bg-muted"][class~="mr-2.5"][class~="size-9"][class~="shrink-0"][class~="rounded-full"]` | 0/1 / 0/2 | 0 | 0/0 | clip-path | ⚠ |
| 14 | 0.8 | slot:tabs-list | controls-r9:2437 | `.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"])` | buttons-badges-r10:4280 | `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="tabs-list"]:where(:not(.vrcx-0-page-scaffold *):not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))` | 1/1 / 1/1 | 9 | 2/4 | background-color, background | — |
| 15 | 0.8 | slot:tabs-list | tools-ui-r9:2837 | `.vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]` | buttons-badges-r10:4280 | `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="tabs-list"]:where(:not(.vrcx-0-page-scaffold *):not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action))` | 1/1 / 1/1 | 1 | 6/4 | background-color, background | — |
| 16 | 0.7933 | section:avatars-status-r9 | avatars-status-r9:2926 | `.activity-skin span.block.shrink-0.overflow-hidden.rounded-full[class~="size-16"]` | avatars-status-r9:2933 | `.activity-skin span.block.shrink-0.overflow-hidden.rounded-full:is([class~="size-7"],[class~="size-9"])` | 0/1 / 0/1 | 0 | 0/0 | clip-path | ⚠ |
| 17 | 0.7933 | section:avatars-status-r9 | avatars-status-r9:2926 | `.activity-skin span.block.shrink-0.overflow-hidden.rounded-full[class~="size-16"]` | avatars-status-r9:2995 | `img[class~="mr-2.5"][class~="size-9"][class~="shrink-0"][class~="rounded-full"][class~="object-cover"], div[class~="bg-muted"][class~="mr-2.5"][class~="size-9"][class~="shrink-0"][class~="rounded-full"]` | 0/1 / 0/2 | 0 | 0/0 | clip-path | ⚠ |
| 18 | 0.7933 | slot:button | popups-r9:2711 | `[data-slot="popover-content"] [data-slot="scroll-area"] button:is([data-slot="button"],[data-slot="tooltip-trigger"])[data-variant="ghost"] span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"]` | avatars-status-r9:2916 | `[data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"] > img` | 0/1 / 0/1 | 0 | 21/12 | clip-path | ⚠ |
| 19 | 0.7933 | slot:dialog-content | avatars-status-r9:2916 | `[data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"] > img` | avatars-status-r9:2985 | `:is(.entity-dialog,[data-slot="dialog-content"]) :is( img[class~="size-9"][class~="shrink-0"][class~="rounded-full"][class~="object-cover"], div[class~="bg-muted"][class~="size-9"][class~="shrink-0"][class~="rounded-full"] )` | 0/1 / 0/1 | 0 | 12/0 | clip-path | ⚠ |
| 20 | 0.7933 | slot:dialog-content | avatars-status-r9:2916 | `[data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"] > img` | avatars-status-r9:3003 | `:is([data-slot="dialog-content"],.entity-dialog) span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"]` | 0/1 / 0/1 | 0 | 12/0 | clip-path | ⚠ |
| 21 | 0.7933 | slot:dialog-content | avatars-status-r9:2916 | `[data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"] > img` | avatars-status-r9:3010 | `:is([data-slot="dialog-content"],.entity-dialog) span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"] > img` | 0/1 / 0/1 | 0 | 12/0 | clip-path | ⚠ |
| 22 | 0.7933 | slot:dialog-content | avatars-status-r9:2985 | `:is(.entity-dialog,[data-slot="dialog-content"]) :is( img[class~="size-9"][class~="shrink-0"][class~="rounded-full"][class~="object-cover"], div[class~="bg-muted"][class~="size-9"][class~="shrink-0"][class~="rounded-full"] )` | avatars-status-r9:3019 | `[data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] > button[class~="size-11"][class~="rounded-full"][class~="border"], [data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] span[class~="bg-muted"][class~="size-11"][class~="rounded-full"]` | 0/1 / 0/2 | 0 | 0/0 | clip-path | ⚠ |
| 23 | 0.7933 | slot:dialog-content | avatars-status-r9:2985 | `:is(.entity-dialog,[data-slot="dialog-content"]) :is( img[class~="size-9"][class~="shrink-0"][class~="rounded-full"][class~="object-cover"], div[class~="bg-muted"][class~="size-9"][class~="shrink-0"][class~="rounded-full"] )` | avatars-status-r9:3027 | `[data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] > button[class~="size-11"][class~="rounded-full"][class~="border"] > img` | 0/1 / 0/1 | 0 | 0/0 | clip-path | ⚠ |
| 24 | 0.7933 | slot:dialog-content | avatars-status-r9:3003 | `:is([data-slot="dialog-content"],.entity-dialog) span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"]` | avatars-status-r9:3019 | `[data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] > button[class~="size-11"][class~="rounded-full"][class~="border"], [data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] span[class~="bg-muted"][class~="size-11"][class~="rounded-full"]` | 0/1 / 0/2 | 0 | 0/0 | clip-path | ⚠ |
| 25 | 0.7933 | slot:dialog-content | avatars-status-r9:3003 | `:is([data-slot="dialog-content"],.entity-dialog) span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"]` | avatars-status-r9:3027 | `[data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] > button[class~="size-11"][class~="rounded-full"][class~="border"] > img` | 0/1 / 0/1 | 0 | 0/0 | clip-path | ⚠ |
| 26 | 0.7933 | slot:dialog-content | avatars-status-r9:3010 | `:is([data-slot="dialog-content"],.entity-dialog) span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"] > img` | avatars-status-r9:3019 | `[data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] > button[class~="size-11"][class~="rounded-full"][class~="border"], [data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] span[class~="bg-muted"][class~="size-11"][class~="rounded-full"]` | 0/1 / 0/2 | 0 | 0/0 | clip-path | ⚠ |
| 27 | 0.7933 | slot:dialog-content | avatars-status-r9:3010 | `:is([data-slot="dialog-content"],.entity-dialog) span[class~="mr-2.5"][class~="size-9"][class~="rounded-full"][class~="border"] > img` | avatars-status-r9:3027 | `[data-slot="dialog-content"] div[class~="bg-card/40"][class~="rounded-lg"][class~="p-3"] > button[class~="size-11"][class~="rounded-full"][class~="border"] > img` | 0/1 / 0/1 | 0 | 0/0 | clip-path | ⚠ |
| 28 | 0.7933 | slot:skeleton | avatars-status-r9:3098 | `[data-slot="skeleton"][class~="rounded-full"]:is([class~="size-14"],[class~="size-16"])` | avatars-status-r9:3105 | `[data-slot="skeleton"][class~="rounded-full"]:is([class~="size-7"],[class~="size-8"],[class~="size-9"])` | 0/1 / 0/1 | 0 | 0/0 | clip-path | ⚠ |
| 29 | 0.7933 | tag:button | avatars-status-r9:2881 | `button:has(> span[class~="size-10"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]) > span[class~="size-10"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]` | avatars-status-r9:2888 | `button:has(> span[class~="size-9"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]) > span[class~="size-9"][class~="overflow-visible"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]` | 1/1 / 1/1 | 30 | 0/0 | clip-path | ⚠ |
| 30 | 0.75 | class:vrcx-0-main-content | data-surfaces-r10:4514 | `:where(.vrcx-0-main-content > .vrcx-0-page-scaffold) .group\/feed-column` | data-surfaces-r10:4614 | `:where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) section.bg-muted\/5.rounded-lg.border, :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) .bg-card.relative.h-full.min-h-0.min-w-0.flex-1.overflow-hidden.rounded-lg.border` | 0/1 / 0/2 | 0 | 0/0 | box-shadow | — |
| 31 | 0.75 | class:vrcx-0-main-content | data-surfaces-r10:4514 | `:where(.vrcx-0-main-content > .vrcx-0-page-scaffold) .group\/feed-column` | data-surfaces-r10:4660 | `:where(.vrcx-0-main-content #chart) button.group.hover\:bg-accent.flex.w-full.items-center.rounded-lg.border` | 0/1 / 0/1 | 0 | 0/0 | box-shadow | — |
| 32 | 0.75 | class:vrcx-0-main-content | data-surfaces-r10:4543 | `:where(.vrcx-0-main-content) [data-testid="feed-image-drop-overlay"] [data-drop-target]` | data-surfaces-r10:4614 | `:where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) section.bg-muted\/5.rounded-lg.border, :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) .bg-card.relative.h-full.min-h-0.min-w-0.flex-1.overflow-hidden.rounded-lg.border` | 0/1 / 0/2 | 0 | 0/0 | border-color | — |
| 33 | 0.75 | class:vrcx-0-main-content | data-surfaces-r10:4614 | `:where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) section.bg-muted\/5.rounded-lg.border, :where(.vrcx-0-main-content > .vrcx-0-page-scaffold:has(.grid.min-h-0.flex-1.grid-cols-1.gap-3.overflow-y-auto)) .bg-card.relative.h-full.min-h-0.min-w-0.flex-1.overflow-hidden.rounded-lg.border` | data-surfaces-r10:4660 | `:where(.vrcx-0-main-content #chart) button.group.hover\:bg-accent.flex.w-full.items-center.rounded-lg.border` | 0/2 / 0/1 | 0 | 0/0 | box-shadow | — |
| 34 | 0.75 | slot:tabs-tab | settings:1296 | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tabs-tab][data-active]` | tools-ui-r9:2861 | `.vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"] > [data-slot="tabs-tab"]:is([data-active],[aria-selected="true"])` | 1/1 / 1/1 | 0 | 5/7 | border-color | — |
| 35 | 0.7363 | slot:resizable-panel-group | favorites-r9:3834 | `.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[data-size="icon-sm"], .vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-groups"] button[data-size="icon-xs"]` | favorites-r9:3999 | `.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] [class~="group-hover/tile:opacity-0"]:has(> span[class*="bg-[var(--status-online)]"])` | 2/2 / 1/1 | 2 | 1/1 | box-shadow, backdrop-filter | — |
| 36 | 0.7363 | slot:resizable-panel-group | favorites-r9:3999 | `.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] [class~="group-hover/tile:opacity-0"]:has(> span[class*="bg-[var(--status-online)]"])` | favorites-r9:4020 | `.vrcx-0-main-content > .vrcx-0-page-scaffold:has([data-slot="resizable-panel-group"][id^="favorites-"][id$="-splitter"]):has([data-slot="resizable-handle"]) [data-slot="resizable-panel"][id^="favorites-"][id$="-content"] [class~="group/tile"] button[data-size="icon-sm"]` | 1/1 / 1/1 | 2 | 1/1 | backdrop-filter, box-shadow | — |
| 37 | 0.7332 | slot:card-header | settings:1312 | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) [data-slot=card-header] [data-slot=collapsible-trigger]::after` | cards-r97:4901 | `:is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),[data-tools-section]) [data-slot=card-header]::after` | 1/1 / 1/1 | 1 | 9/5 | bottom, mask, top | — |
| 38 | 0.7172 | slot:tabs-list | cards-r97:4885 | `:is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),.vrcx-0-main-content>[id=chart] [data-slot=tabs][data-orientation=vertical]:has(+div [data-tools-section]))>[data-slot=tabs-list]::after` | cards-r97:4901 | `:is(.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list][data-orientation=vertical]),[data-tools-section]) [data-slot=card-header]::after` | 1/1 / 1/1 | 2 | 4/5 | left, right, bottom | — |
| 39 | 0.7048 | class:vrcx-0-side-panel | side-panel:1090 | `.vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab'][data-active]::after` | side-panel:1105 | `.vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab'][data-active]::before` | 1/1 / 1/1 | 30 | 0/0 | right, background-color, left | — |

> Near pairs compare CSS rule blocks only. Duplicate declarations can still be intentional because selectors, conditional environments, cascade order, pseudo-state, shorthand interactions, or component ownership differ. Review source/context and use the 42-state computed-style verifier before proposing any merge.

Full declaration values, exact groups, selectors, line/section context and all retained near-pairs are in `declaration-clusters.json`.
