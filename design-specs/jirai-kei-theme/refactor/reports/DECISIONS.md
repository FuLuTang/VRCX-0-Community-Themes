# 用户已拍板的样式决策

> 这个文件是**决策的唯一记录处**。凡用户明确拍板过的样式契约，都记在这里；
> 未经记录在案的，一律视为「还没定」，不得当成既定前提往下推。
>
> 教训来源：P2 阶段曾把 luna 的**聚类分析建议**当成「已定决策」写进报告并据此施工，
> 而用户实际只拍板过其中 3 条。决策必须由用户做出，且必须记在这里。

---

## D-01 · 输入框皮肤 = B3 四边斜面

**拍板内容**（用户在样式矩阵里选的第 5 格）：

```css
border-radius: 0;
border-style: solid;
border-width: 2px;
border-color: #69557c #fdf4ff #fdf4ff #69557c;   /* 上 右 下 左 */
background-color: #2a2147;                        /* 由原 #211a33 提亮一档 */
box-shadow: inset 2px 2px #16112a, inset -2px -2px #a294c8;
color: #f2ebff;
```

**取代**：早前「select / combobox trigger 保留统一平边 `#6c5ce0`」的想法。

**作用范围**：**尚未完全定清**。用户在 2026-10-15 追问「还有外框？我看看？」，
即 **`input-group` 外框要不要一起改，待看过可视化后再定**。
→ 见 `refactor/preview/CONV-1b-input-group-frame.html`

---

## D-02 · 字段皮肤范围 = 方案 A（只给字段本体）

不给字段加 wrapper、不改 HTML 结构；`input-group-control` 保持透明，**无需跟改**。

---

## D-03 · 滑条全软件收敛为通用款

**拍板内容**：18px 盒 / 6px 暗紫条纹轨 / 12px 粉色 thumb。

entity-dialog 的 16/8/16 几何差异**取消**。

---

## D-04 · 浮层不用 B3

浮层使用**凸起 + 3px 硬投影**（B2 家族），不套 B3 斜面。

---

## D-05 · 验收标准 = 分两批

**第一批 = 零 diff 重构**（去重、选择器白名单化、结构整理）——要求与基线逐元素 computed style **diff 为空**。

**第二批 = 外观改动**（B3 斜面、滑条统一、缺陷修复、cursor 等）——作为**单独一批**执行，**逐项列出 diff 供用户确认**。

**不采用**「完全等价零容忍」（那样 B3 与滑条统一都做不了），也不采用「不看等价直接重写」。

---

## D-06 · login 页字段统一为 B3

**拍板内容**（2026-10-15）：**确认改成 B3，取消它的一整套特例。**

`login-r8` SECTION（真基线 `refactor/reference/baseline-theme.css` 第 **2230–2252** 行）
当前拥有独立的一套：

- 本体 `1px solid #8c71b0`、`2px` 圆角、`#16112a` 底色
- **双层 recessed 阴影**（与 B3 的单层 2px inset 不同）
- placeholder `#c5b5e1`
- focus 时粉色 border/outline 且圆角改 0
- invalid 用 `#ff5a83`

**决定**：这一整套特例取消，login 输入框归入 B3 契约。

**注意**：focus / invalid 这类**状态规则**与静态皮肤是两回事，
是否保留 login 专属的 focus/invalid 色，尚未单独拍板。

---

## 尚未拍板（不要当成已定）

| # | 问题 | 相关可视化 |
|---|---|---|
| Q-A | `input-group` 外框要不要跟着改 B3（选项 A/B/C） | `refactor/preview/CONV-1b-input-group-frame.html` |
| Q-B | `file` / `color` / `number` / `search` / `date` 这些原生类型要不要纳入 | `refactor/preview/CONV-1-input-family.html` |
| Q-C | `checkbox` / `radio` / `range` 是否明确排除在 B3 之外 | `refactor/preview/CONV-1-input-family.html` |
| Q-D | login 的 focus / invalid 状态色是否保留专属 | — |
| Q-E | `combobox-chips` 的 overlay 上下文是否服从唯一父组框 | — |
| Q-F | 菜单打开的触发器高亮要不要补（当前无任何通用规则） | — |
| Q-G | `resizable-handle` 的 resize cursor 要不要补 | — |
| Q-H | 发布目标体积（`themes/` 19 KB vs 重构产物 ~1 MB） | — |
| Q-I | 装饰性蕾丝/缎带/缝线是否保留 | — |
| Q-J | 手机端动效 `r10-nav-phone-loop`（8,827 B / 55 帧）是否优化 | — |
| Q-K | D9：三处 `menu-label`/`menu-shortcut`/`menu-separator` 后缀的真实命中面 | — |

> 用户在 2026-10-15 明确要求：**按 todo 一个一个慢慢来**，不要一次抛一堆问题。
