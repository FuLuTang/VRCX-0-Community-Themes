# Component and context variant inventory

- Frozen app states: 42 (34 routes + 8 interaction states); observed element records: 54313.
- Theme CSS SHA-256: `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`; app commit: `83e624a06a813a0c95e07655e4a142355fd0f194`.
- Computed style fingerprint uses 28 paint/geometry properties. It is a context-variation signal, not a request to force every fingerprint equal.
- Component families G1–G5 mirror the existing read-only R9 audit taxonomy; route/context counts come from the 42 frozen DOM snapshots. G3 includes dialog DOM for context visibility only; CSS ownership remains with dialogs-r9.
- A selector not observed in these states is not automatically a defect. It may be a dormant page, an untriggered state, a pseudo-state, or a selector whose component is absent from the capture.

## Family summary

| Family | Component/context groups | Components | Element observations | Groups with >1 computed fingerprint |
|---|---:|---:|---:|---:|
| G1 — 字段、输入、工具栏、键盘提示、筛选和选择器 | 29 | 17 | 678 | 8 |
| G2 — 按钮变体、徽章、分页、浮条、alert 与非主内容 tabs/toggle | 69 | 16 | 3517 | 27 |
| G3 — 浮层与弹窗上下文：tooltip、hover-card、toast、menu、popover、sheet、dialog | 12 | 12 | 183 | 2 |
| G4 — 表格、空状态、日历、面板、TileShell、列表选中与图表表面 | 17 | 12 | 445 | 7 |
| G5 — 头像、avatar-group、状态灯和方形群组头像例外 | 9 | 5 | 1054 | 4 |

## Context variants (route and surface level)

| Family | Component | Variant/size | Context | States | Observations | Style fingerprints |
|---|---|---|---|---:|---:|---:|
| G1 | checkbox (span) | — / — | surface:main-content | 8 | 100 | 4 |
| G1 | combobox-chips (div) | — / — | overlay:sheet-popup | 1 | 1 | 1 |
| G1 | combobox-chips (div) | — / — | surface:main-content | 6 | 6 | 1 |
| G1 | field (div) | — / — | surface:main-content | 1 | 17 | 2 |
| G1 | field-description (p) | — / — | surface:main-content | 1 | 11 | 1 |
| G1 | field-label (label) | — / — | surface:main-content | 1 | 17 | 1 |
| G1 | input (input) | — / — | surface:main-content | 8 | 10 | 3 |
| G1 | input-group (div) | — / — | surface:main-content | 29 | 30 | 3 |
| G1 | input-group (div) | — / — | surface:side-panel | 37 | 37 | 1 |
| G1 | input-group-addon (div) | — / — | surface:main-content | 29 | 40 | 2 |
| G1 | input-group-addon (div) | — / — | surface:side-panel | 37 | 37 | 1 |
| G1 | input-group-button (button) | ghost / icon-xs | surface:main-content | 1 | 2 | 1 |
| G1 | input-group-control (input) | — / — | surface:main-content | 29 | 30 | 2 |
| G1 | input-group-control (input) | — / — | surface:side-panel | 37 | 37 | 1 |
| G1 | kbd (kbd) | — / — | surface:main-content | 3 | 6 | 1 |
| G1 | kbd (kbd) | — / — | surface:titlebar | 42 | 84 | 1 |
| G1 | kbd-group (kbd) | — / — | surface:main-content | 3 | 6 | 1 |
| G1 | kbd-group (kbd) | — / — | surface:titlebar | 42 | 42 | 1 |
| G1 | label (label) | — / — | overlay:popover-content | 1 | 2 | 1 |
| G1 | label (label) | — / — | surface:main-content | 1 | 2 | 1 |
| G1 | native:input (input) | — / — | overlay:sheet-popup | 1 | 4 | 1 |
| G1 | native:input (input) | — / — | surface:main-content | 15 | 121 | 7 |
| G1 | select-trigger (button) | — / sm | overlay:popover-content | 1 | 4 | 1 |
| G1 | select-trigger (button) | — / default | surface:main-content | 7 | 7 | 1 |
| G1 | select-trigger (button) | — / sm | surface:main-content | 3 | 3 | 1 |
| G1 | slider (div) | — / — | overlay:sheet-popup | 1 | 4 | 1 |
| G1 | slider (div) | — / — | surface:main-content | 4 | 5 | 3 |
| G1 | toggle-group (div) | outline / default | surface:main-content | 10 | 10 | 1 |
| G1 | toggle-group (div) | outline / sm | surface:main-content | 3 | 3 | 1 |
| G2 | badge (span) | default / — | surface:main-content | 1 | 40 | 2 |
| G2 | badge (span) | outline / — | surface:main-content | 9 | 28 | 3 |
| G2 | badge (span) | secondary / — | surface:main-content | 2 | 80 | 3 |
| G2 | badge (span) | outline / — | surface:side-panel | 37 | 148 | 2 |
| G2 | badge (span) | default / — | surface:titlebar | 42 | 42 | 1 |
| G2 | button (button) | default / sm | overlay:popover-content | 1 | 1 | 1 |
| G2 | button (button) | ghost / icon | overlay:popover-content | 1 | 77 | 3 |
| G2 | button (button) | outline / sm | overlay:popover-content | 1 | 1 | 1 |
| G2 | button (button) | outline / default | overlay:sheet-popup | 1 | 1 | 1 |
| G2 | button (button) | ghost / default | surface:data-table | 1 | 86 | 1 |
| G2 | button (button) | ghost / icon | surface:data-table | 2 | 33 | 1 |
| G2 | button (button) | ghost / xs | surface:data-table | 1 | 10 | 1 |
| G2 | button (button) | default / sm | surface:main-content | 5 | 27 | 3 |
| G2 | button (button) | default / default | surface:main-content | 1 | 1 | 1 |
| G2 | button (button) | ghost / icon-sm | surface:main-content | 17 | 260 | 5 |
| G2 | button (button) | ghost / icon | surface:main-content | 1 | 2 | 1 |
| G2 | button (button) | ghost / default | surface:main-content | 20 | 271 | 9 |
| G2 | button (button) | ghost / sm | surface:main-content | 10 | 26 | 6 |
| G2 | button (button) | ghost / icon-xs | surface:main-content | 2 | 48 | 1 |
| G2 | button (button) | link / xs | surface:main-content | 2 | 22 | 1 |
| G2 | button (button) | link / sm | surface:main-content | 1 | 1 | 1 |
| G2 | button (button) | outline / icon | surface:main-content | 1 | 1 | 1 |
| G2 | button (button) | outline / sm | surface:main-content | 10 | 29 | 2 |
| G2 | button (button) | outline / default | surface:main-content | 8 | 9 | 3 |
| G2 | button (button) | outline / icon-xs | surface:main-content | 1 | 46 | 1 |
| G2 | button (button) | outline / icon-sm | surface:main-content | 1 | 24 | 1 |
| G2 | button (button) | secondary / icon-sm | surface:main-content | 3 | 3 | 1 |
| G2 | button (button) | secondary / sm | surface:main-content | 2 | 2 | 1 |
| G2 | button (button) | ghost / default | surface:side-panel | 37 | 592 | 1 |
| G2 | button (button) | ghost / icon | surface:side-panel | 37 | 37 | 1 |
| G2 | button (button) | ghost / sm | surface:table-header | 2 | 13 | 1 |
| G2 | button (button) | ghost / default | surface:table-header | 2 | 17 | 1 |
| G2 | button (button) | ghost / icon-xs | surface:table-header | 1 | 15 | 1 |
| G2 | context-menu-trigger (button) | ghost / default | surface:main-content | 6 | 144 | 1 |
| G2 | context-menu-trigger (button) | ghost / icon-sm | surface:titlebar | 42 | 42 | 2 |
| G2 | dropdown-menu-trigger (button) | ghost / icon-xs | surface:data-table | 1 | 19 | 1 |
| G2 | dropdown-menu-trigger (button) | ghost / icon-xs | surface:main-content | 8 | 103 | 4 |
| G2 | dropdown-menu-trigger (button) | ghost / icon-sm | surface:main-content | 5 | 65 | 1 |
| G2 | dropdown-menu-trigger (button) | outline / default | surface:main-content | 12 | 12 | 1 |
| G2 | dropdown-menu-trigger (button) | secondary / icon-xs | surface:main-content | 4 | 92 | 4 |
| G2 | dropdown-menu-trigger (button) | secondary / icon-sm | surface:main-content | 2 | 28 | 1 |
| G2 | dropdown-menu-trigger (button) | ghost / icon-sm | surface:side-panel | 37 | 37 | 1 |
| G2 | hover-card-trigger (button) | secondary / sm | surface:titlebar | 42 | 42 | 2 |
| G2 | pagination (nav) | — / — | surface:main-content | 3 | 3 | 1 |
| G2 | popover-trigger (button) | ghost / icon-xs | surface:main-content | 3 | 3 | 2 |
| G2 | popover-trigger (button) | outline / default | surface:main-content | 3 | 3 | 1 |
| G2 | popover-trigger (button) | outline / sm | surface:main-content | 4 | 4 | 1 |
| G2 | popover-trigger (button) | ghost / icon | surface:side-panel | 37 | 37 | 1 |
| G2 | popover-trigger (button) | ghost / sm | surface:statusbar | 42 | 42 | 1 |
| G2 | separator (div) | — / — | overlay:sheet-popup | 1 | 2 | 1 |
| G2 | separator (div) | — / — | surface:main-content | 16 | 25 | 3 |
| G2 | sheet-close (button) | ghost / icon-sm | overlay:sheet-popup | 1 | 1 | 1 |
| G2 | sheet-trigger (button) | ghost / icon-sm | surface:main-content | 3 | 9 | 2 |
| G2 | tab-indicator (span) | — / — | surface:main-content | 14 | 14 | 2 |
| G2 | tab-indicator (span) | — / — | surface:side-panel | 37 | 37 | 1 |
| G2 | tabs (div) | — / — | surface:main-content | 14 | 14 | 1 |
| G2 | tabs (div) | — / — | surface:side-panel | 37 | 37 | 1 |
| G2 | tabs-list (div) | — / default | surface:main-content | 14 | 14 | 3 |
| G2 | tabs-list (div) | — / default | surface:side-panel | 37 | 37 | 1 |
| G2 | tabs-tab (button) | — / default | surface:main-content | 14 | 67 | 4 |
| G2 | toggle (button) | outline / sm | surface:main-content | 3 | 9 | 2 |
| G2 | tooltip-trigger (button) | ghost / icon | surface:main-content | 23 | 46 | 2 |
| G2 | tooltip-trigger (button) | ghost / icon-xs | surface:main-content | 8 | 9 | 2 |
| G2 | tooltip-trigger (button) | outline / default | surface:main-content | 10 | 21 | 2 |
| G2 | tooltip-trigger (button) | outline / sm | surface:main-content | 2 | 2 | 1 |
| G2 | tooltip-trigger (button) | ghost / sm | surface:statusbar | 42 | 84 | 1 |
| G2 | tooltip-trigger (button) | ghost / icon | surface:statusbar | 42 | 84 | 1 |
| G2 | tooltip-trigger (button) | ghost / xs | surface:titlebar | 42 | 42 | 2 |
| G2 | tooltip-trigger (button) | ghost / icon-sm | surface:titlebar | 42 | 294 | 2 |
| G3 | context-menu-content (div) | — / — | overlay:context-menu-content | 1 | 1 | 1 |
| G3 | context-menu-item (div) | default / — | overlay:context-menu-content | 1 | 1 | 1 |
| G3 | dropdown-menu-content (div) | — / — | overlay:dropdown-menu-content | 2 | 2 | 1 |
| G3 | dropdown-menu-item (div) | default / — | overlay:dropdown-menu-content | 1 | 2 | 2 |
| G3 | hover-card-content (div) | — / — | overlay:hover-card-content | 1 | 1 | 1 |
| G3 | popover-content (div) | — / — | overlay:popover-content | 1 | 1 | 1 |
| G3 | select-content (div) | — / — | overlay:select-content | 1 | 1 | 1 |
| G3 | select-item (div) | — / — | overlay:select-content | 1 | 4 | 2 |
| G3 | sheet-popup (div) | — / — | overlay:sheet-popup | 1 | 1 | 1 |
| G3 | toast-content (div) | — / — | overlay:toast-content | 42 | 42 | 1 |
| G3 | toast-viewport (div) | — / — | overlay:toast-viewport | 42 | 126 | 1 |
| G3 | tooltip-content (div) | — / — | overlay:tooltip-content | 1 | 1 | 1 |
| G4 | calendar (div) | — / — | overlay:popover-content | 1 | 1 | 1 |
| G4 | card (div) | — / sm | surface:main-content | 4 | 50 | 2 |
| G4 | card (div) | — / default | surface:main-content | 4 | 26 | 3 |
| G4 | card-header (div) | — / — | surface:main-content | 7 | 63 | 3 |
| G4 | collapsible-trigger (button) | ghost / sm | surface:main-content | 2 | 7 | 2 |
| G4 | collapsible-trigger (button) | — / — | surface:main-content | 3 | 25 | 1 |
| G4 | collapsible-trigger (button) | outline / sm | surface:main-content | 2 | 4 | 1 |
| G4 | collapsible-trigger (button) | ghost / sm | surface:side-panel | 37 | 148 | 1 |
| G4 | empty (div) | — / — | surface:main-content | 4 | 5 | 1 |
| G4 | empty-description (div) | — / — | surface:main-content | 4 | 5 | 2 |
| G4 | empty-icon (div) | icon / — | surface:main-content | 2 | 2 | 1 |
| G4 | empty-title (div) | — / — | surface:main-content | 4 | 5 | 1 |
| G4 | resizable-handle (div) | — / — | surface:main-content | 8 | 8 | 2 |
| G4 | table (table) | — / — | surface:data-table | 2 | 2 | 1 |
| G4 | table-head (th) | — / — | surface:table-header | 2 | 22 | 1 |
| G4 | table-row (tr) | — / — | surface:data-table | 2 | 70 | 2 |
| G4 | table-row (tr) | — / — | surface:table-header | 2 | 2 | 1 |
| G5 | avatar (span) | — / default | surface:data-table | 1 | 20 | 1 |
| G5 | avatar (span) | — / sm | surface:main-content | 1 | 134 | 1 |
| G5 | avatar-fallback (span) | — / — | surface:data-table | 1 | 1 | 1 |
| G5 | avatar-image (img) | — / — | surface:data-table | 1 | 19 | 2 |
| G5 | avatar-image (img) | — / — | surface:main-content | 2 | 149 | 1 |
| G5 | native:img (img) | — / — | surface:data-table | 1 | 20 | 1 |
| G5 | native:span (span) | — / — | surface:data-table | 1 | 20 | 6 |
| G5 | native:span (span) | — / — | surface:main-content | 8 | 62 | 8 |
| G5 | native:span (span) | — / — | surface:side-panel | 37 | 629 | 7 |

The machine-readable JSON contains representative computed-style values and context trails. It intentionally omits element text, user names, IDs, and paths so account data is not copied into the report.

## Editing guardrail

Use this inventory to formulate one component batch at a time. Before any CSS edit, present the exact component scope, included/excluded contexts, suspected shared declarations, and expected baseline proof; wait for user confirmation. Preserve different computed fingerprints until evidence proves a difference is caused only by data/size rather than intended context styling.
