# P3-1 selector whitelist

## 改写清单

| 文件:行号 | 旧选择器片段 | 新选择器片段 | 命中集合性质 |
|---|---|---|---|
| `11-controls-and-pages.css:268` | `:is([data-slot$="menu-separator"],[data-slot="select-separator"],[data-slot="combobox-separator"])` | `:is([data-slot="select-separator"],[data-slot="combobox-separator"])` | 空集删除；`menu-separator` 分支空，留下的两项原样保留。声明未改 |
| `15-late-components.css:102-109` | `[data-slot$=dialog-content]` | `:is([data-slot="dialog-content"],[data-slot="alert-dialog-content"])` | 精确（全层 inventory） |
| `15-late-components.css:102-109` | `[data-slot$=dialog-header]` | `:is([data-slot="dialog-header"],[data-slot="alert-dialog-header"])` | 精确（全层 inventory） |
| `15-late-components.css:102-109` | `[data-slot$=title]`（包括 `:not(...)` 与直接子项） | `:is([data-slot="alert-dialog-title"],[data-slot="alert-title"],[data-slot="card-title"],[data-slot="dialog-title"],[data-slot="empty-title"],[data-slot="sheet-title"],[data-slot="toast-title"])` | 精确（全层 inventory）；`:not()` 排除面完整保留 |
| `15-late-components.css:102-109` | `[data-slot$=description]`（`:not()` 与 `:has()` 内） | `:is([data-slot="alert-description"],[data-slot="empty-description"],[data-slot="field-description"],[data-slot="toast-description"])` | 精确（全层 inventory）；`:not()` 排除面完整保留 |

除表内所列 selector 子句外，声明值均未改动。

## 后缀命中面推导

CSS `[data-slot$="X"]` 是属性字符串**以 X 结束**的匹配，不是含有子串匹配。inventory 是从 `src/style/*.css` 与 `src/frozen/*.css` 全层提取出的 135 个唯一静态 slot 值。

- `dialog-content`：末尾匹配 `dialog-content`、`alert-dialog-content`。两项分别直接满足结尾；无其他 inventory 项以该后缀结尾。显式集合等同。选择器上下文仍负责限定其实际 DOM 位置/用途。
- `dialog-header`：同理，匹配 `dialog-header`、`alert-dialog-header`。没有其它 slot 以 `dialog-header` 结尾。
- `title`：在整个静态全集上是宽匹配，七项为 `alert-dialog-title`、`alert-title`、`card-title`、`dialog-title`、`empty-title`、`sheet-title`、`toast-title`。原选择器直接子项位置（dialog header 的直接孩子）会在真实 DOM 中进一步收窄；但 whitelist 采用全 inventory 的完整 suffix 命中面，因此不会误删/扩大该位置潜在匹配。` :not([data-slot$=title])` 改为排除同一七项，否定语义不变。
- `description`：全 inventory 末尾匹配 `alert-description`、`empty-description`、`field-description`、`toast-description`；静态 inventory 中没有 `alert-dialog-description`。上下文进一步限定 `:has()` 的直接子结构。`:not()` 中同样排除这四项，保持原排除面。
- `menu-separator`：全集中没有以 `menu-separator` 结尾的值。`menubar-separator` 的结尾是 `bar-separator`，不是 `menu-separator`；它不命中。因此 11 号文件删掉这一空分支后，整个 `:is()` 的集合仍精确为 `select-separator` 与 `combobox-separator`，未改变匹配。

逐字符推论亦适用于缺陷 D9：`menubar-label` 结尾为 `bar-label`，不以 `menu-label` 结束；`menubar-shortcut` 结尾为 `bar-shortcut`，不以 `menu-shortcut` 结束；`menubar-separator` 结尾为 `bar-separator`，不以 `menu-separator` 结束。因此三个相应 `$=` 分支（menu-label / menu-shortcut / menu-separator）命中空集。原作者本意可能是 `menubar-*`（推断，不是已证事实）。本轮实际删除了 11 号文件的 menu-separator 空分支；没有凭空重建另外两个不在当前待改代码中的分支。

## D3 结论

`11-controls-and-pages.css:372–401` 不是一条可整体缩短的选择器。两条 `:has()` 分别限定 toolbar input-group 与垂直 Tabs 结构；省略任一条件都会改变匹配集合，故不可简化。本轮未改该处。

## 验证脚本实际输出

执行：`node refactor/tools/verify-selector-equivalence.mjs`

```text
dialog-content → 改写前理论命中集合=["alert-dialog-content","dialog-content"] → 改写后显式集合=["dialog-content","alert-dialog-content"] → 相等
dialog-header → 改写前理论命中集合=["alert-dialog-header","dialog-header"] → 改写后显式集合=["dialog-header","alert-dialog-header"] → 相等
title → 改写前理论命中集合=["alert-dialog-title","alert-title","card-title","dialog-title","empty-title","sheet-title","toast-title"] → 改写后显式集合=["alert-dialog-title","alert-title","card-title","dialog-title","empty-title","sheet-title","toast-title"] → 相等
description → 改写前理论命中集合=["alert-description","empty-description","field-description","toast-description"] → 改写后显式集合=["alert-description","empty-description","field-description","toast-description"] → 相等
menu-separator → 改写前理论命中集合=[] → 改写后显式集合=[] → 相等
全层 slot 扫描（135 个唯一值）: ["alert","alert-description","alert-dialog-content","alert-dialog-footer","alert-dialog-header","alert-dialog-title","alert-title","avatar","avatar-badge","avatar-fallback","avatar-group","avatar-group-count","avatar-image","badge","button","calendar","calendar-month-caption","card","card-content","card-footer","card-header","card-title","checkbox","checkbox-indicator","collapsible","collapsible-trigger","combobox-chip","combobox-chip-input","combobox-chip-remove","combobox-chips","combobox-content","combobox-item","combobox-label","combobox-separator","combobox-trigger","context-menu-checkbox-item","context-menu-content","context-menu-item","context-menu-radio-item","context-menu-sub-content","context-menu-sub-trigger","context-menu-trigger","dialog-close","dialog-content","dialog-footer","dialog-header","dialog-overlay","dialog-title","dropdown-menu-checkbox-item","dropdown-menu-content","dropdown-menu-item","dropdown-menu-radio-item","dropdown-menu-sub-content","dropdown-menu-sub-trigger","dropdown-menu-trigger","empty","empty-content","empty-description","empty-header","empty-icon","empty-title","field-description","field-error","field-label","hover-card-content","hover-card-trigger","input","input-group","input-group-addon","input-group-button","input-group-control","input-otp-slot","kbd","kbd-group","label","menu-positioner","menubar-checkbox-item","menubar-content","menubar-item","menubar-label","menubar-radio-item","menubar-separator","menubar-shortcut","menubar-sub-content","menubar-sub-trigger","pagination-content","pagination-link","popover-content","progress-indicator","resizable-handle","resizable-panel","resizable-panel-group","scroll-area","select-content","select-item","select-label","select-separator","select-trigger","separator","sheet-content","sheet-header","sheet-popup","sheet-title","sidebar","sidebar-group-label","sidebar-inner","sidebar-menu-button","skeleton","slider","slider-range","slider-thumb","slider-track","spinner","tab-indicator","table-caption","table-cell","table-footer","table-head","table-header","table-row","tabs","tabs-content","tabs-list","tabs-tab","textarea","toast-action","toast-content","toast-description","toast-icon","toast-title","toast-viewport","toggle","toggle-group","tooltip-content","tooltip-trigger"]
剩余后缀选择器: []
原始选择器常量数: 7
RESULT: 0 remaining suffix selectors, all equivalences verified
```

## 括号配平

| 文件 | `{` | `}` | 结果 |
|---|---:|---:|---|
| `11-controls-and-pages.css` | 124 | 124 | 配平 |
| `15-late-components.css` | 64 | 64 | 配平 |
| `16-final-navigation.css` | 68 | 68 | 配平，未修改 |

## 证明边界 / 诚实声明

验证脚本证明的是：相对于此次扫描的 style + frozen 静态 CSS slot inventory，后缀命中集合与显式 whitelist 集合相等，并且 style 中不再有 `[data-slot$=...]` 选择器。它不是运行时 DOM 的穷尽证明：页面代码、第三方组件或运行时生成逻辑可能动态产出静态 CSS 未出现的新 `data-slot` 值；未扫描这些运行时来源。故若未来出现新 slot，静态 whitelist 不会自动覆盖，需更新 inventory 与显式列表后再验证。原选择器字面量已经内嵌验证脚本，不依赖 git 历史。
