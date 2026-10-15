# P3-1d slot whitelist 修复报告

## 根因与修复摘要

前序 whitelist 从 CSS 文本抽取 slot，漏掉了 **46 个只在运行时 DOM 出现、CSS 文本从未出现的 slot**。因此仅靠 CSS 清单推导后缀集合不完整：例如 `dropdown-menu-separator`、`card-description`、`sidebar-menu-item` 都不在旧的 CSS 命中全集内。此次验证脚本改为读取全部冻结快照 `elements[].attrs["data-slot"]`，再并入 `refactor/src/style/*.css` 与 `refactor/src/frozen/*.css` 中的字面 slot；当前采集结果为运行时 125 个、CSS 138 个、并集 **181 个唯一 slot**。

## 三处修复前后

| 文件:行号 | 修复前 | 修复后 | 真实命中面（181 并集） |
|---|---|---|---|
| `refactor/src/style/11-controls-and-pages.css:268` | 目标 `:is()` 只有 `select-separator`、`combobox-separator` | 加入 `dropdown-menu-separator` | `menu-separator` 后缀仅命中 `dropdown-menu-separator`；并集无 `context-menu-separator`。`menubar-separator` 以 `bar-separator` 结尾，不匹配。 |
| `refactor/src/style/11-controls-and-pages.css:242,251` | 列举 context/dropdown item，未列 sidebar | 两个 item 列表均增加 `sidebar-menu-item` | `menu-item` 命中 `context-menu-item`、`dropdown-menu-item`、`sidebar-menu-item`。外层浮层内容限定可能使 sidebar 项实际不匹配，但不能据此缩小显式后缀集合，故仍补全。 |
| `refactor/src/style/15-late-components.css:102-109` | description 列举 4 项，`card-description` 漏失 | 相关正向、`:not()` / `:has()` 中的 description whitelist 均增加 `card-description` | `alert-description`、`card-description`、`empty-description`、`field-description`、`toast-description`；否定式排除面也完整等同这 5 项。 |

仅调整选择器文本，CSS 声明部分（属性及其值）未改动。

## 全后缀复核表

以下“当前文件列举”按本次脚本实际核验的 whitelist / 当前保留后缀谓词列出；`-item`、`-trigger` 是现存泛化 `$=` 谓词，继续由谓词自身匹配，并非把列举清单写死进 CSS。对于其他已显式展开的后缀，逐一对照代码中的 `:is()` 列表。真实面均由运行时 + CSS 的 181 slot 并集计算。

| 后缀 | 真实命中面 | 当前文件里的列举 / 谓词 | 一致 |
|---|---|---|---|
| `menu-separator` | `dropdown-menu-separator` | `dropdown-menu-separator`（11:268） | 是 |
| `menu-item` | `context-menu-item`, `dropdown-menu-item`, `sidebar-menu-item` | 上述三项（11:242,251） | 是 |
| `menu-content` | `context-menu-content`, `dropdown-menu-content` | 上述两项（11:220 等） | 是 |
| `menu-sub-content` | `context-menu-sub-content`, `dropdown-menu-sub-content` | 上述两项（11:220 等） | 是 |
| `menu-checkbox-item` | `context-menu-checkbox-item`, `dropdown-menu-checkbox-item` | 上述两项（11:242,251） | 是 |
| `menu-radio-item` | `context-menu-radio-item`, `dropdown-menu-radio-item` | 上述两项（11:242,251） | 是 |
| `menu-sub-trigger` | `context-menu-sub-trigger`, `dropdown-menu-sub-trigger` | 上述两项（11:242,251） | 是 |
| `dialog-content` | `alert-dialog-content`, `dialog-content` | 上述两项（15:102-109） | 是 |
| `dialog-header` | `alert-dialog-header`, `dialog-header` | 上述两项（15:102-109） | 是 |
| `title` | `alert-dialog-title`, `alert-title`, `card-title`, `dialog-title`, `empty-title`, `sheet-title`, `toast-title` | 七项均列出；`:not()` 同样完整（15:102-109） | 是 |
| `description` | `alert-description`, `card-description`, `empty-description`, `field-description`, `toast-description` | 五项均列出；`:not()` 同样完整（15:102-109） | 是 |
| `menu-label` | 空集 | 空列表；未加回 | 是 |
| `menu-shortcut` | 空集 | 空列表；未加回 | 是 |
| `-item` | `combobox-item`, `context-menu-checkbox-item`, `context-menu-item`, `context-menu-radio-item`, `dropdown-menu-checkbox-item`, `dropdown-menu-item`, `dropdown-menu-radio-item`, `menubar-checkbox-item`, `menubar-item`, `menubar-radio-item`, `pagination-item`, `select-item`, `sidebar-menu-item`, `timeline-item` | 当前保留 `[data-slot$="-item"]` 泛化谓词（11:257） | 是（谓词直接匹配） |
| `-trigger` | `collapsible-trigger`, `combobox-trigger`, `context-menu-sub-trigger`, `context-menu-trigger`, `dropdown-menu-sub-trigger`, `dropdown-menu-trigger`, `hover-card-trigger`, `menubar-sub-trigger`, `menubar-trigger`, `popover-trigger`, `select-trigger`, `sheet-trigger`, `tooltip-trigger` | 当前保留 `[data-slot$="-trigger"]` 泛化谓词（11:257） | 是（谓词直接匹配） |

验证也确认用户特别指出的两个真空后缀 `menu-label`、`menu-shortcut` 均为空，没有重新加入。`menu-separator` 的并集核算仅有 dropdown 命中，没有 context-menu 分支。

## 验证脚本实际输出

运行：`node refactor/tools/verify-selector-equivalence.mjs`

```text
menu-separator → 改写前理论命中集合=["dropdown-menu-separator"] → 改写后显式集合=["dropdown-menu-separator"] → 相等
menu-item → 改写前理论命中集合=["context-menu-item","dropdown-menu-item","sidebar-menu-item"] → 改写后显式集合=["context-menu-item","dropdown-menu-item","sidebar-menu-item"] → 相等
menu-content → 改写前理论命中集合=["context-menu-content","dropdown-menu-content"] → 改写后显式集合=["context-menu-content","dropdown-menu-content"] → 相等
menu-sub-content → 改写前理论命中集合=["context-menu-sub-content","dropdown-menu-sub-content"] → 改写后显式集合=["context-menu-sub-content","dropdown-menu-sub-content"] → 相等
menu-checkbox-item → 改写前理论命中集合=["context-menu-checkbox-item","dropdown-menu-checkbox-item"] → 改写后显式集合=["context-menu-checkbox-item","dropdown-menu-checkbox-item"] → 相等
menu-radio-item → 改写前理论命中集合=["context-menu-radio-item","dropdown-menu-radio-item"] → 改写后显式集合=["context-menu-radio-item","dropdown-menu-radio-item"] → 相等
menu-sub-trigger → 改写前理论命中集合=["context-menu-sub-trigger","dropdown-menu-sub-trigger"] → 改写后显式集合=["context-menu-sub-trigger","dropdown-menu-sub-trigger"] → 相等
dialog-content → 改写前理论命中集合=["alert-dialog-content","dialog-content"] → 改写后显式集合=["alert-dialog-content","dialog-content"] → 相等
dialog-header → 改写前理论命中集合=["alert-dialog-header","dialog-header"] → 改写后显式集合=["alert-dialog-header","dialog-header"] → 相等
title → 改写前理论命中集合=["alert-dialog-title","alert-title","card-title","dialog-title","empty-title","sheet-title","toast-title"] → 改写后显式集合=["alert-dialog-title","alert-title","card-title","dialog-title","empty-title","sheet-title","toast-title"] → 相等
description → 改写前理论命中集合=["alert-description","card-description","empty-description","field-description","toast-description"] → 改写后显式集合=["alert-description","card-description","empty-description","field-description","toast-description"] → 相等
menu-label → 改写前理论命中集合=[] → 改写后显式集合=[] → 相等
menu-shortcut → 改写前理论命中集合=[] → 改写后显式集合=[] → 相等
-item → 改写前理论命中集合=["combobox-item","context-menu-checkbox-item","context-menu-item","context-menu-radio-item","dropdown-menu-checkbox-item","dropdown-menu-item","dropdown-menu-radio-item","menubar-checkbox-item","menubar-item","menubar-radio-item","pagination-item","select-item","sidebar-menu-item","timeline-item"] → 改写后显式集合=["combobox-item","context-menu-checkbox-item","context-menu-item","context-menu-radio-item","dropdown-menu-checkbox-item","dropdown-menu-item","dropdown-menu-radio-item","menubar-checkbox-item","menubar-item","menubar-radio-item","pagination-item","select-item","sidebar-menu-item","timeline-item"] → 相等
-trigger → 改写前理论命中集合=["collapsible-trigger","combobox-trigger","context-menu-sub-trigger","context-menu-trigger","dropdown-menu-sub-trigger","dropdown-menu-trigger","hover-card-trigger","menubar-sub-trigger","menubar-trigger","popover-trigger","select-trigger","sheet-trigger","tooltip-trigger"] → 改写后显式集合=["collapsible-trigger","combobox-trigger","context-menu-sub-trigger","context-menu-trigger","dropdown-menu-sub-trigger","dropdown-menu-trigger","hover-card-trigger","menubar-sub-trigger","menubar-trigger","popover-trigger","select-trigger","sheet-trigger","tooltip-trigger"] → 相等
并集 slot 扫描（181 个唯一值；运行时 125，CSS 138）
剩余后缀选择器: []
RESULT: PASS (15 suffix checks; 0 remaining suffix selectors)
```

脚本从快照目录自行读取运行时值，并集取 runtime 与 style/frozen CSS 两侧去重；保留的两个泛化后缀按其理论集合逐项报告。两个已确认空集的 menu-label/menu-shortcut 不加回。无残留需要展开的后缀选择器。

## 括号配平

对两份 CSS 逐字符统计 `{}`、`()`、`[]`：

| 文件 | `{}` | `()` | `[]` | 结果 |
|---|---:|---:|---:|---|
| `11-controls-and-pages.css` | 124 / 124 | 282 / 282 | 906 / 906 | 配平 |
| `15-late-components.css` | 64 / 64 | 218 / 218 | 298 / 298 | 配平 |

## 证明边界（诚实声明）

181 个 slot 并集仍然是**有限样本**：运行时部分来自 42 个冻结快照，另一部分来自当前 CSS 文本。即便两侧合并，也可能存在这两处都没覆盖到的运行时 slot。此前仅以 CSS 清单推断就漏掉了运行时独有 slot，这正是本次 bug 的根因；本验证是对当前证据集的等价性检查，不构成对所有未来 DOM/组件状态的穷尽证明。
