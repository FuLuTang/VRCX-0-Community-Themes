# Safe interaction-state fixture coverage

Captured from the running app using only transient container triggers listed in
`interactions.json`. No menu item was selected, no form submitted, no setting toggled,
and no destructive/data-mutating action was invoked. Escape dismissed every opened
surface; all 8/8 records report `closedAfterCapture: true`. The original route was
restored to `#/feed`.

| Fixture | Route | Surface |
|---|---|---|
| `feed-account-menu` | `/feed` | Account dropdown menu |
| `feed-quick-search-tooltip` | `/feed` | Shared-shell tooltip |
| `feed-avatar-hover-card` | `/feed` | Avatar hover card |
| `feed-notification-context-menu` | `/feed` | Context menu |
| `browse-history-time-range-popover` | `/browse-history` | Date-range popover |
| `favorites-worlds-select-listbox` | `/favorites/worlds` | Select/listbox |
| `charts-mutual-settings-sheet` | `/charts/mutual` | Settings sheet/dialog |
| `tools-actions-menu` | `/tools` | Route-specific tools menu |

Each state has a local compressed fixture in `fixtures/<state-id>.html.gz` and a replay
seed/snapshot in `snapshot/<state-id>.json`. They are gitignored because the captured UI
may include private account data. Use `replay-fixtures.mjs` to render computed styles for
these states along with the 34 route-level fixtures; use `check-idempotency.mjs` to compare
replays. The allowlist is deliberately conservative: extra controls require review before
adding a new action.
