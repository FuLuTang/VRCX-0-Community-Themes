# 元素 × 上下文 样式覆盖矩阵 (before-fix)

> 生成：`audit.mjs`；源码 `/tmp/vrcx-win-src-r9/src`（584 个文件，1319 处原语使用点）；主题 `/tmp/jirai-elem-audit/jirai-kei-theme/theme.css`（--revert-r8-slider：user-dialog-r8 滑条选择器还原为修复前窄链）；4222 条 CSS 规则。
> ✓ 已主题（所有使用点的“形状属性”均相对无主题基线变化，且变化集合覆盖规范主题实例）  ✗ 缝隙（使用点上未主题化/部分主题化）  – 该上下文无使用点（`–†` = 无使用点但夹具里同样未主题化，潜在缝隙）

| 原语 \ 上下文 | main-content | main-toolbar | main-card-sm | side-panel | settings-vertical-tabs | entity-dialog | dialog | popover | menu-popup | login-page | privacy-lock | toast | app-chrome |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| native-range | ✓ (2) | – | – | – | – | ✗ 1/2 | – | – | – | –† | – | – | – |
| base-slider | ✓ (1) | – | – | – | ✓ (3) | –† | ✓ (1) | ✓ (1) | – | –† | – | – | – |

括号内为静态扫描到的使用点数（`✗ a/b` = b 个使用点中 a 个有缝隙）；`≠规范` = 已主题化但与规范实例有属性差异（多为专用调色板/斜面变体，详见 table.json）；`○` = 主题对该原语的形状完全没有任何规则（全局未覆盖）。

## 缝隙清单（按严重度）

### ✗ native-range × entity-dialog
- 使用点：`components/dialogs/user-dialog/components/UserDialogStatusDistribution.tsx:311`
- 现象：host:unthemed (unchanged appearance,-webkit-slider-thumb.appearance,-webkit-slider-thumb.-webkit-appearance,-webkit-slider-thumb.width)
- 被排除：`form-controls-r9: input[type="range"]:not([data-vrcx-0-surface="login-page"] *):not(.entity-dialog *):not(.vrcx-0-page-scaffold: ⟵ excluded by .entity-dialog *`
- 建议：user-dialog-r8.css 的滑条选择器不得带 .accent-primary/.min-w-16/.flex-1 等工具类；entity-dialog 内所有 input[type=range] 以 `[data-slot="dialog-content"].entity-dialog input[type="range"]` 统一接管。

### 潜在缝隙（该上下文今天无使用点，夹具里同样未主题化；未来出现使用点即成 ✗）

- native-range：login-page（form-controls-r9 的 :not(…*) 排除，无替代规则）
- base-slider：entity-dialog、login-page（form-controls-r9 的 :not(…*) 排除，无替代规则）

## 排除子句有效性（`:not(<clause>)` 在夹具各场景中是否真能命中）

| 子句 | 涉及规则数 | 所在段 | 夹具命中场景 |
|---|---|---|---|
| `.vrcx-0-page-scaffold:has(> [data-slot="tabs-list"][class~="w-44"]) *` | 82 | form-controls-r9, fields-toolbar-r10, buttons-badges-r10 | **无 —— 夹具已按真实 DOM 构造该场景（scaffold > Tabs root > TabsList.w-44），仍不命中：`>` 直接子代写法使该子句在真实 DOM 下永不生效** |
| `.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relativ` | 7 | fields-toolbar-r10 | **无 —— 夹具已按真实 DOM 构造该场景（scaffold > Tabs root > TabsList.w-44），仍不命中：`>` 直接子代写法使该子句在真实 DOM 下永不生效** |
| `.vrcx-0-page-toolbar *` | 39 | buttons-badges-r10 | main-toolbar |
| `[class~="bg-popover/70"] *` | 39 | buttons-badges-r10 | menu-popup |
| `article[data-slot="card"][data-size="sm"] *` | 39 | buttons-badges-r10 | main-card-sm |
| `.vrcx-0-titlebar *` | 7 | buttons-badges-r10 | app-chrome |
| `.entity-dialog *` | 136 | popups-r9, avatars-status-r9, form-controls-r9, dialogs-r9, fields-toolbar-r10, overlays-r10, buttons-badges-r10, dialog-header-r97 | entity-dialog |
| `[data-vrcx-0-surface="login-page"] *` | 82 | form-controls-r9, fields-toolbar-r10, buttons-badges-r10 | login-page |
| `.vrcx-0-main-shell[data-vrcx-0-surface="login-page"] *` | 14 | dialogs-r9, dialog-header-r97 | login-page |
| `.vrcx-0-page-scaffold *` | 4 | buttons-badges-r10 | main-content, main-toolbar, main-card-sm, settings-vertical-tabs |

## 使用点（静态扫描）

### native-range
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:833` | entity-dialog ← entity (user/world/avatar/group) dialog file | <input type=range> class="accent-primary min-w-16 flex-1" |
| `components/dialogs/user-dialog/components/UserDialogStatusDistribution.tsx:311` | entity-dialog ← entity (user/world/avatar/group) dialog file | <input type=range> class="accent-primary w-28" |
| `features/charts/RelationshipTimelinePageImpl.tsx:366` | main-content ← default: routed page / shared component | <input type=range> class="accent-primary w-24" |
| `features/charts/RelationshipTimelinePageImpl.tsx:470` | main-content ← default: routed page / shared component | <input type=range> class="accent-primary w-28" |

### base-slider
| file:line | 上下文(推断) | class/prop 摘要 |
|---|---|---|
| `components/media/ImageCropToolbar.tsx:125` | dialog ← ImageCropDialog (portal dialog opened from any page) | <Slider> |
| `components/mutual-friends/CommitSlider.tsx:36` | main-content ← default: routed page / shared component | <Slider> |
| `features/instance-history/components/InstanceActivitySettingsPopover.tsx:53` | popover ← inside <PopoverContent> (L44, portal) | <Slider> class="w-40" |
| `features/settings/components/settings-tabs/SettingsNotificationsTab.tsx:395` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Slider> |
| `features/settings/components/settings-tabs/SettingsVrTab.tsx:368` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Slider> |
| `features/settings/components/settings-tabs/SettingsVrTab.tsx:567` | settings-vertical-tabs ← features/settings (w-44 vertical tabs scaffold) | <Slider> |

