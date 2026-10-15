# P1 · B3 斜面输入框调校候选

## 候选值表

各档描边均为 `border-style: solid`，边色固定 `border-color: #69557c #fdf4ff #fdf4ff #69557c`（上、右、下、左）。每格的阴影随描边宽度同步：

| 背景档 | 背景色 | 1px 边框 / 阴影 | 2px 边框 / 阴影 | 3px 边框 / 阴影 |
|---|---|---|---|---|
| 原样 | `#211a33` | `border-width: 1px; box-shadow: inset 1px 1px #16112a, inset -1px -1px #a294c8;` | `border-width: 2px; box-shadow: inset 2px 2px #16112a, inset -2px -2px #a294c8;` | `border-width: 3px; box-shadow: inset 3px 3px #16112a, inset -3px -3px #a294c8;` |
| 浅一档 | `#2a2147` | 同左列 1px 阴影 | 同左列 2px 阴影 | 同左列 3px 阴影 |
| 浅二档 | `#2f2552` | 同左列 1px 阴影 | 同左列 2px 阴影 | 同左列 3px 阴影 |
| 浅三档 | `#332650` | 同左列 1px 阴影 | 同左列 2px 阴影 | 同左列 3px 阴影 |

统一 CSS 值：

```css
border-style: solid;
border-color: #69557c #fdf4ff #fdf4ff #69557c;
/* 任选一个宽度 N，阴影内缩同步采用 N */
border-width: Npx;
box-shadow: inset Npx Npx #16112a, inset -Npx -Npx #a294c8;
```

## 第四档背景选择

以 `#332650` 替代推测色 `#3a2f5e`。这是主题已经使用的颜色：`refactor/src/style/01-tokens.css` 中 `--accent`、`--surface-interactive-hover` 等值，亦在 `14-buttons-and-data.css` 的次要徽章背景出现。它比候选 `#2f2552` 更浅，且无需引入新颜色。相邻已知背景 `#2f2552` 也在 `15-late-components.css` 的 card-header 使用。

## 阴影配套方案

1px 保持原有 `inset 1px 1px #16112a, inset -1px -1px #a294c8`；2px、3px 分别改为对应方向及距离的 `2px`、`3px` 内阴影。阴影边缘与实体描边厚度等步扩展，避免宽边框旁仍只有一条 1px 细高光/暗线而显得不协调。颜色沿用现有 B3 inset 色，不新增色值。

## 推荐

推荐 **`#2a2147 + 2px`**：背景复用主题 `--popover` / `--surface-raised` 的真实表面色，较原样明显提亮但仍属于暗色控件；2px 加强斜面辨识度，并以 2px 内阴影保持视觉重量平衡。该组合是候选建议，最终由用户确认。

## ✅ 用户已确认（第 5 格）

用户看图后选定 **矩阵第 5 格 = `#2a2147` + 2px**（与上面推荐一致）。

最终定案（推广到全软件所有输入框）：

```css
border-radius: 0;
border-style: solid;
border-width: 2px;
border-color: #69557c #fdf4ff #fdf4ff #69557c;   /* 上 右 下 左：左暗 / 右亮 */
background-color: #2a2147;                        /* 原 #211a33，提亮一档 */
box-shadow: inset 2px 2px #16112a, inset -2px -2px #a294c8;
color: #f2ebff;
```

- 矩阵排序说明：4 行（背景）× 3 列（描边）逐行编号 → 第 1–3 格 `#211a33`+1/2/3px、第 4–6 格 `#2a2147`+1/2/3px，故第 5 格为 `#2a2147` + 2px。
- 该决定**取代**早前「select / combobox trigger 保留统一平边 `#6c5ce0`」的决定；`12-loader-and-forms.css:177–180` 那处平边覆盖需在 P3 一并改为斜面。

## 色值证据

- 页面暗底 `#161219`：`themes/jirai-kei-theme/theme.css:8`（本预览页面底色）。
- `#211a33`、边缘顺序 `#69557c #fdf4ff #fdf4ff #69557c`、原始 inset：`refactor/src/style/12-loader-and-forms.css:170–175` 与 `refactor/src/style/13-toolbar-overlays-and-pages.css:8–9`。
- `#2a2147`、`#332650`：`refactor/src/style/01-tokens.css:11,19,40–43`。
- `#2f2552`：`refactor/src/style/02-foundation.css:3–4`、`refactor/src/style/15-late-components.css:151`。
- 文本 `#f2ebff`：`refactor/src/style/01-tokens.css:8`；暗内阴影 `#16112a`：同文件第 7 行；亮内阴影 `#a294c8`：`refactor/src/style/01-tokens.css:24,52`。
