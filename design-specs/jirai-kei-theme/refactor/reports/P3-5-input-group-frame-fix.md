# P3-5 — input-group frame fix

## 1. `fields-toolbar-r10` 第一条规则：前后对照

核对使用的唯一基线：`refactor/reference/baseline-theme.css`（README 所记 SHA-256：`6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`）。没有读取/使用 runtime 预览 CSS。

**修复前（候选，残缺）：**

```css
/* Page-toolbar groups keep context-specific ink/motion; #chart's inner controls/layout stay
   in tools-ui-r9.css. All input-group outer frames are centralized below. */
.vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *){
  color:#e3d2f5;
  transition:none;
}
```

**修复后（逐字对齐基线）：**

```css
/* Share the R9 Tools search-frame language with all other page toolbars. The exact
   #chart + vertical-rail Tools surface remains exclusively owned by tools-ui-r9.css. */
.vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(.vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) *){
  border:1px solid #6c5ce0;
  background:#201936;
  color:#e3d2f5;
  
  transition:none;
}
```

selector、注释和声明均直接还原基线（基线原文在 3515–3523 行）。另将该段顶部“Shared inset shadow”注释还原为基线的“Shared Win98 sunken field...”原文。

## 2. `fields-toolbar-r10` 逐条核查

按基线规则序列逐项比对 selector、声明、注释。除了上面第一条及共享 field 注释外，没有发现其他被中心化搬走的声明或内容改写：

| 基线规则/范围 | 核查结果 |
|---|---|
| 3515–3523 page-toolbar input-group 主规则 | 基线声明/selector/注释均已恢复 |
| 3524–3535 focus-within、addon、control、placeholder、button | selector 与声明一致；保留 |
| 3537–3547 standalone fields 与 labels/descriptions/errors | selector 与声明一致；保留 |
| 3549–3562 toolbar ToggleGroup 规则组 | 注释、selector 与声明一致；保留 |
| 3564–3568 Feed 多用户 combobox-chips input-group | 规则存在且声明一致；保留 |
| 3569–3574 shared text-field skin | 注释与声明一致；保留 |
| 3575–3580 通用 input-group `:where(...)` skin | 规则存在且声明一致；保留。该规则负责通用 B3 斜面，未因第一条修复而删除 |
| 3581–3595 focus/error、Feed chips/chip/input | selector 与声明一致；保留 |
| 3597–3618 kbd、OTP、color/file/time 控件 | 注释、selector 与声明一致；保留 |

Feed 多用户搜索规则与通用 `:where([data-slot="input-group"]:not(#chart ...))` 规则都仍在候选中；两者作用域不同，均没有删改。

## 3. `tools` / `tools-actions-menu` 的额外差异

原始候选中两态各 10 项，定位到同一个 `div[data-slot="input-group"][data-vrcx-0-control="toolbar"]`（工具搜索框）。前 5 项与其他状态的共同缺失相同：背景色及四边框颜色；额外 5 项为 `border-top-left/right/bottom-left/bottom-right-radius` 和 `box-shadow`。基线为四角 `0px`、`var(--jk-field-inset)` 的计算值；候选落为 `2px` 和 `none`。

额外五项同属 `#chart` Tools 搜索框 frame 的专属样式缺失，并非另一个无关元素。基线在 `tools-ui-r9` 对该精确作用域有 frame 声明；候选源码 `11-controls-and-pages.css` 原先将它改写为“frame 由 fields-toolbar 提供”，但 fields-toolbar 的通用规则明确排除了该 `#chart` 范围。因此将 `tools-ui-r9` 规则恢复为基线 frame 声明：`border-radius:0; background-color:#201936; color:#e3d2f5; border-color:var(--jk-field-edge); box-shadow:var(--jk-field-inset); transition:none;`。此项已修复。

## 4. 构建与 42 态验收

构建命令：`node tools/build-theme.mjs --out /tmp/theme-p3e.css`，成功输出 `Wrote 1054159 bytes to /tmp/theme-p3e.css (24 sections; separators on).` 回放 42/42 fixtures 成功。随后运行 `node compare-snapshots.mjs snapshot /tmp/jirai-p3e`，完整输出如下：

```text
state                                        elements B/C missing B/C identity style diffs result
----------------------------------------------------------------------------------------------------------------
activity                                       4136/4136         0/0        0           0 PASS
browse-history-time-range-popover              1961/1961         0/0        0           0 PASS
browse-history                                 1728/1728         0/0        0           0 PASS
charts-mutual-settings-sheet                   1599/1599         0/0        0           0 PASS
charts                                           469/469         0/0        0           0 PASS
charts_mutual                                    469/469         0/0        0           0 PASS
charts_timeline                                  789/789         0/0        0           0 PASS
charts_two-person                                777/777         0/0        0           0 PASS
community-themes                               1128/1128         0/0        0           0 PASS
dashboard_usr_00000000-0000-0000-0000-000000000000     757/757         0/0        0           0 PASS
favorites-worlds-select-listbox                1217/1217         0/0        0           0 PASS
favorites_avatars                              1177/1177         0/0        0           0 PASS
favorites_friends                              1259/1259         0/0        0           0 PASS
favorites_groups                                 793/793         0/0        0           0 PASS
favorites_import_friends                       1206/1206         0/0        0           0 PASS
favorites_worlds                               1207/1207         0/0        0           0 PASS
feed-account-menu                              1537/1537         0/0        0           0 PASS
feed-avatar-hover-card                         1502/1502         0/0        0           0 PASS
feed-notification-context-menu                 1498/1498         0/0        0           0 PASS
feed-quick-search-tooltip                      1494/1494         0/0        0           0 PASS
feed                                           1494/1494         0/0        0           0 PASS
friends-locations                                817/817         0/0        0           0 PASS
game-log                                       2003/2003         0/0        0           0 PASS
instance-history                               1620/1620         0/0        0           0 PASS
login                                          1494/1494         0/0        0           0 PASS
my-avatars                                     1342/1342         0/0        0           0 PASS
notification                                   1306/1306         0/0        0           0 PASS
player-list                                      753/753         0/0        0           0 PASS
search                                           769/769         0/0        0           0 PASS
settings                                         975/975         0/0        0           0 PASS
social_friend-list                             1484/1484         0/0        0           0 PASS
social_friend-log                              1453/1453         0/0        0           0 PASS
social_moderation                              1422/1422         0/0        0           0 PASS
themes                                         1128/1128         0/0        0           0 PASS
tools-actions-menu                             1549/1549         0/0        0           0 PASS
tools                                          1528/1528         0/0        0           0 PASS
tools_gallery                                  1084/1084         0/0        0           0 PASS
tools_group-moderation                           812/812         0/0        0           0 PASS
tools_inventory                                  914/914         0/0        0           0 PASS
tools_my-groups                                1387/1387         0/0        0           0 PASS
tools_screenshot-metadata                      1124/1124         0/0        0           0 PASS
tools_vrchat-log                               1152/1152         0/0        0           0 PASS
----------------------------------------------------------------------------------------------------------------
42/42 states byte-comparable across the frozen property set; 0 style differences
```

最终结果：42/42 PASS，computed-style 差异从 115 降至 **0**。

## 5. 括号配平与诚实声明

构建成功解析生成了全部 24 sections；包含新增恢复规则的 CSS 成功通过全部 42 态页面回放，说明新增 selector/声明可解析、括号配平。只编辑了 `refactor/src/style/13-toolbar-overlays-and-pages.css`、`refactor/src/style/11-controls-and-pages.css` 和本报告；没有改基线、runtime、baseline、dist，也没有运行 build-runtime/collect。未 commit。
