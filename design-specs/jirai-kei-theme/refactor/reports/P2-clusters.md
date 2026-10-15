# P2 · 收敛决策总表（主对话汇总）

> 来源：P1 组件普查 62/62 完成（inventory 权威对账：唯一组件 62、未覆盖 0）。
> 分族摘要 5 份：`P2-G1-form-clusters.md`、`P2-G2-nav-clusters.md`、`P2-G3-overlay-clusters.md`、`P2-G4-data-clusters.md`、`P2-G5-native-clusters.md`。
> 本文件是 P3 施工的唯一依据；分族文件作为证据附录。

---

## 0. 口径说明（重要）

**"簇数"和"规则数"不是同一件事**，五份分族报告的口径各自成立但不能相加。本文件统一表述为：

| 指标 | 含义 |
|---|---|
| **簇** | 一组共享同一视觉语言、可用同一批声明承载的组件 |
| **规则组** | 一个选择器 + 一组声明；含状态展开后的逐条 selector |
| **视觉族** | 只计"皮肤"，不含状态与结构 modifier |

**收敛后规模（各族自报，口径见上表）**

| 族 | 簇 | 规模估计 |
|---|---|---|
| G1 表单 | 14 | 规则块 **约 50 → 约 25**（±5） |
| G2 导航控件 | 9 + 2 跨族决策 | 共享基底/token/状态；不压成单条 CSS |
| G3 浮层 | 5 | **外壳规则组 6 → 5** |
| G4 数据容器 | 8 | 8 簇 / 约 12 视觉族 / 约 25 规则组 |
| G5 原生元素 | 7 | span 通用皮肤目标 **0**；avatar 1 共同壳 + 2 尺寸轮廓 + 1 群组例外 |

**P3 不要以"规则条数下降"为目标函数**，而应以「同一视觉只有一处定义」为目标。

---

## 1. 跨族重复模式（**P3 最大的收敛机会**）

这是本阶段最有价值的发现：**同一个视觉被逐字写在多个地方**，且分处不同 SECTION。

### 1.1 三层硬阴影（浮层签名）

```
inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e
```
**逐字出现 5 次**：
- `11-controls-and-pages.css:227`（共享 popup 基底，**无** `!important`）
- `13-toolbar-overlays-and-pages.css:135`（普通 tooltip，**无** `!important`）
- `13-toolbar-overlays-and-pages.css:152`（hover-card，**带** `!important`）
- `13-toolbar-overlays-and-pages.css:166`（toast 子项，**带** `!important`）
- `13-toolbar-overlays-and-pages.css:187`（bell sheet，**带** `!important`）

⚠️ **值相同 ≠ 级联等价**：后三处带 `!important`。合并时必须逐处验证级联，不能简单替换。
（statusbar tooltip 的 `inset 1px 1px 0 #69557c, 2px 2px 0 #100b1e` **不是**这一套，是独立档，不计入 5 次。）

### 1.2 其他逐处重复

| 重复内容 | 所有出现位置 |
|---|---|
| 字段框旧 B1（暗底 + 1px 紫边 + 方角 + inset） | `13-toolbar-overlays-and-pages.css:71–79`（同时覆盖字段与 input-group） |
| 组焦点粉环 | `13-toolbar-overlays-and-pages.css:18–20, 47, 82`；`11-controls-and-pages.css:372–376` |
| 组内 control 透明 reset + placeholder | `13-toolbar-overlays-and-pages.css:22–25, 559–560`；`11-controls-and-pages.css:380–391` |
| 组内粉色按钮皮肤 + 焦点 | `13-toolbar-overlays-and-pages.css:26–29`；`11-controls-and-pages.css:392–401` |
| time 日历图标 | `runtime/theme.css:719–721`；`13-toolbar-overlays-and-pages.css:3631` |
| checkbox 粉色 focus | `12-loader-and-forms.css:3301–3309`（通用）；`:4000–4003`（Favorites，offset 1px 是局部例外） |
| toggle-group outline 基础/状态 | `06-panels-and-settings.css:148–155`（全局）；`11-controls-and-pages.css:50–86`（toolbar override） |
| tabs 底槽与 tab 状态 | `11-controls-and-pages.css:8–36, 405–439`；`14-buttons-and-data.css:58–62` |
| Button 通用方角/焦点 | `02-foundation.css:674–675`；buttons-badges-r10 集中规则；chart HUD `4263–4274` 重写 |
| Button 变体外观复现 | login `2210–2235`；popover 特例 `4306–4307` |
| card 根与 title-band | `06-panels-and-settings.css:178`；`15-late-components.css:151` |
| resizable handle 绘制职责分散 | `14-buttons-and-data.css:225–250`；`13-toolbar-overlays-and-pages.css:394–430`；`15-late-components.css:163–179` |
| avatar slot 基线 / login / popup / 行残余 / 群组例外 | 见 `P1-G5-avatar.md:44–53, 66–68` |

### 1.3 误报澄清（**不要当重复处理**）

- `06-panels-and-settings.css:129–138` 与 `runtime/theme.css:1267–1276` 是**同一组源/构建产物**，不是两套方案。
- 表头 `dotted #70518f` 与数据行 `solid #51436d` 是**不同职责的两种线**，必须保留差异。
- `card-header` 的 `#2f2552` 与 `table-head` 的 `var(--wd-raised)`=`#2a2147` 是**标题卡带 vs 数据列头**两个角色，色值不同**不是**同一角色的两种写法 —— 可用语义 token 管理，**不强制统一实值**。
- `--jk-asset-number-stepper-minus/plus` 相关的"变量引用"说法曾误（实为 data URI 直接作 mask）。

---

## 2. 裸元素选择器权重审计（P3 编写规则，**最高优先级**）

**已核实：裸 `img {}`、裸 `span {}`、裸 `input {}` 全部不存在。** 所有造型规则都有结构或语义限定。

但存在**高权重限定规则**，它们会压过新建的低权重收敛规则：

| 位置 | 选择器 | 权重 | 风险 |
|---|---|---|---|
| `04-group-spacing-and-typography.css:48–50` | `:where(button,input,textarea,select):not(.font-sans):not(.font-heading):not(.font-mono)` | **`(0,3,0)`** | ⚠️ 三个 `:not()` 的 class 权重累加，**高于单个 Tailwind utility**，可能压过 `.font-*` |
| `04-group-spacing-and-typography.css:63–65` | `pre:not(.font-sans):not(.font-heading)` | `(0,2,1)` | 普通 `.font-*` 无法在 specificity 上胜过 |
| `04-group-spacing-and-typography.css:70–71` | `kbd:not(.font-mono)` | `(0,1,1)` | 单个 `.font-*` 权重较低 |
| `11-controls-and-pages.css:392–401` | Chart 页 `#chart` + `:has()` 超长上下文 | 远高于 `(0,1,0)` | 压过组内按钮收敛规则 |
| `11-controls-and-pages.css:449–462` | `button:has(…span…size-10/9…) > span…` | 高 | 头像壳例外，迁移时保留但勿再堆叠 |
| `02-foundation.css:101` | `.entity-dialog … [data-slot="button"]:not(.border-0) img` | ≥`(0,4,1)` | 窄上下文，非全局裸规则 |

**P3 铁律**：
1. **禁止新增 tag-only 皮肤**。
2. `:where()` 能把语义限定规则降到 `(0,0,0)`，**但必须同时迁走旧的高权重同属性规则**，否则新规则仍被压住。
3. `:not(.class)` **不是零权重**，其参数计入 specificity。
4. 伪元素规则（`::before`/`::after`/`::-webkit-slider-thumb`）不受 class utility 直接竞争，单独审查。

---

## 3. 已定决策（P3 前提，不要再问）

1. **输入框外边框统一 B3 四边斜面**（用户看图选第 5 格）：
   ```css
   border-radius: 0;
   border-style: solid;
   border-width: 2px;
   border-color: #69557c #fdf4ff #fdf4ff #69557c;   /* 上 右 下 左 */
   background-color: #2a2147;                        /* 原 #211a33 提亮一档 */
   box-shadow: inset 2px 2px #16112a, inset -2px -2px #a294c8;
   color: #f2ebff;
   ```
   **取代**早前"select/combobox trigger 保留统一平边 `#6c5ce0`"的决定。
2. **字段皮肤范围 = 方案 A（只给字段本体）**，不改 HTML 结构；`input-group-control` 保持透明、**无需跟改**。
3. **滑条全软件收敛为通用款**：18px 盒 / 6px 暗紫条纹轨 / 12px 粉 thumb；entity-dialog 的 16/8/16 几何差异**取消**。
4. **浮层不用 B3**，浮层用凸起 + 3px 硬投影（B2 族）。
5. 资源层原样冻结；data URI 已变量化为 38 个 `--jk-asset-*`。

---

## 4. 必须一并修复的缺陷（编号 D1–D8）

| # | 缺陷 | 位置 | 处置 |
|---|---|---|---|
| **D1** | select/combobox trigger 被覆盖成平边，与 B3 冲突 | `12-loader-and-forms.css:177–180` | 删除或限定到真实状态；默认态回到 B3 |
| **D2** | input-group 组与组内按钮**双粉环** | `13-toolbar-overlays-and-pages.css:18–20, 29, 47`；`11-controls-and-pages.css:372–376, 398–401` | 焦点只由组**或**按钮承载；不得丢失键盘可见性 |
| **D3** | Chart 页超长上下文覆盖组内按钮/control | `11-controls-and-pages.css:372–401` | 迁移或删除；不可只追加 `:where()` |
| **D4** | resizable-handle **无 resize cursor** | 全 CSS 无 `col-resize`/`row-resize`/`ew-resize` | 补 `cursor`，按 `aria-orientation` 映射，并用真实拖拽验证 |
| **D5** | `todo` 提到的 `(0,3,0)` 字体规则压过 utility | `04-group-spacing-and-typography.css:48–50` | 改为零权重语义骨架，或按实测 cascade 整理 |
| **D6** | `$=` 后缀选择器开放集合误伤 | `11-controls-and-pages.css:220, 235, 242, 251, 257, 268, 273–279` | 收敛为**显式 slot 白名单** |
| **D7** | collapsible open/closed 与箭头旋转**无任何规则** | `P1-G4-collapsible-trigger.md:29–39` | 先查宿主运行时是否已处理；若无则补，但**不给无箭头 trigger 强加图标** |
| **D8** | tabs-tab「active 黑边」孤例（1 次观察） | `P1-G2-tabs-tab.md:15–24` | 定性为样本例外；追 DOM 后再决定，**不以它覆盖通用 active 紫边** |

### `$=` 后缀选择器的已确认命中面（D6 依据）

| 后缀 | 会命中的 slot |
|---|---|
| `$="menu-content"` | `context-menu-content`、`dropdown-menu-content` |
| `$="menu-sub-content"` | `context-menu-sub-content`、`dropdown-menu-sub-content` |
| `$="menu-item"` | `context-menu-item`、`dropdown-menu-item` |
| `$="menu-checkbox-item"` | `context-menu-checkbox-item`、`dropdown-menu-checkbox-item` |
| `$="menu-radio-item"` | `context-menu-radio-item`、`dropdown-menu-radio-item` |
| `$="menu-sub-trigger"` | `context-menu-sub-trigger`、`dropdown-menu-sub-trigger` |
| `$="menu-shortcut"` | `context-menu-shortcut`、`dropdown-menu-shortcut` |

后四组的**运行时存在性未经样本证明**，属"选择器可命中名"。风险在于**未来任何 `*-menu-item` 都会被命中**。

---

## 5. 必须保留的例外（不可为收敛而合并）

- **G1**：数字步进器（N1 切角外框 / 20px 加减按钮 / 8×8 glyph）不能并入滑条；`input[type=color]` swatch、`file::file-selector-button`、`time` indicator 各自浏览器子部件语义独立。
- **G2**：SidePanel folder rail 用真实 `[role=tab]` + 面板融合 + 右粉脊，独立分支；toggle-group 的 outline（gap 0 + 显式 separator）与 default（gap 2 + 每项边框 + 28px min-height）是**两种契约**；titlebar unread counter 的反相闪烁与 reduced-motion 例外。
- **G3**：tooltip **两个分支**（普通 3px / statusbar 多行 2px）不可合并为一个无条件选择器；arrow 隐藏规则单列；**sheet 的 `:has([data-slot="sheet-title"] .lucide-bell)` 必须保留**（去掉会误刷其它 sheet）；hover-card 的 `!important` 不要改成普通声明。
- **G4**：`empty` 的 `:not(:has([data-slot="spinner"]))` 必须保留；表头 sticky/排序/分组结构不加主题状态；calendar 的选中/范围端点/今日/禁用/focus 各自保留；resizable 的通用握纹 / pixel grip / Favorites grip（4×28）三种几何分型不可抹平。
- **G5**：方形群组头像**不可并入**个人头像族；状态灯（app-owned）不并入头像面；`:where()` 降权后要同步迁走旧高权重规则。

---

## 6. 用户决策（✅ 已答）

| # | 问题 | 决定 |
|---|---|---|
| **Q5** | **验收标准** | ✅ **分两批**：<br>**第一批 = 零 diff 重构**（去重、选择器白名单化、结构整理）——要求与基线逐元素 computed style **diff 为空**；<br>**第二批 = 外观改动**（B3 斜面、滑条统一、D1–D8 修复、cursor 等）——作为**单独一批**执行，逐项列出 diff 供用户确认。<br>**不采用**"完全等价零容忍"（那样 B3 与滑条统一都做不了），也不采用"不看等价直接重写"。 |
| **Q1** | **login 页字段**是否统一 B3 | ✅ **统一成 B3 斜面**。`10-login-and-dialogs.css:2241–2264` 的独立背景/圆角/阴影须一并归入 B3 契约（归入第二批）。 |

### 仍未拍板（不阻塞第一批）

| # | 问题 | 影响 |
|---|---|---|
| **Q2** | `combobox-chips` 的 **overlay 上下文**是否也服从唯一父组框？（inventory 里 overlay 有框/底，现有主题 chips 透明） | 影响 Feed 页多用户搜索；属第二批 |
| **Q3** | **菜单打开的触发器高亮**要不要补？（当前**无任何通用规则**） | 新增能力，非等价重构；属第二批 |
| **Q4** | **resizable cursor** 按 D4 补上？ | 行为增强，会让 computed style 出现新值；属第二批 |

> **第一批的边界**：只做「同一视觉合并到一处」「选择器等价改写」「删除被后文完全覆盖的死声明」。**不新增任何声明、不改任何值**，因此 diff 必须为空。

---

## 7. P3 施工顺序建议（串行，同一时间只允许 1 个写样式层）

按「先动共享基底、后动特例」排，且每一步都能独立 diff 验收：

1. **D6 选择器白名单化**（纯选择器改写，零视觉 diff）—— 风险最低，先做
2. **1.1 三层硬阴影去重**（合并 5 处，保留 `!important` 语义）—— 零视觉 diff
3. **G3 外壳 6 → 5**（hover-card 并入共享基底）
4. **B3 输入框统一**（含 D1）—— 有**预期**视觉 diff
5. **D2 + D3 焦点环与 Chart 覆盖**
6. **滑条统一**
7. **D5 字体权重**
8. **D4 cursor / D7 collapsible / D8 tabs 孤例**（收尾小项）

**每步流程**：`build-theme.mjs --out <临时路径>` → 与 e2129fd 基线逐元素 computed style diff → diff 为空（或仅剩已批准例外与用户明确要求的修改）才提交。

---

## 8. 诚实声明

- 本文件的**所有数字均转引自 5 份分族摘要**，其中 `P2-G3` 与 `P2-G5` 的 luna 复核了源 CSS 行号；`P2-G1` / `P2-G2` / `P2-G4` 的行号转引自 P1 报告。
- **`P1-FREEZE` 那份早期清单已被证明四次不可靠**（data URI 数量 12→38、keyframes 1450→11,503、SECTION 55→56、settings L1275/1276 误述），**凡引用必须先重验**。
- 分族报告明确标注为「待确认」的项，未在本文件中被升级为结论。

---

## 9. P3-1 过程中新发现的原始缺陷（D9，**待用户拍板**）

### D9：三处后缀选择器是**空集**，原作者本意可能落空

P3-1 的 luna 在改写时发现并推导：CSS 的 `$=` 是**字符串结尾**匹配。

| 后缀选择器 | 位置 | 我以为会命中 | **实际命中** |
|---|---|---|---|
| `[data-slot$="menu-label"]` | `11-controls-and-pages.css:235`（已改） | `menubar-label` | **空集**（`menubar-label` 结尾是 `bar-label`，不是 `menu-label`） |
| `[data-slot$="menu-shortcut"]` | `11-controls-and-pages.css:257`（已改） | `menubar-shortcut` | **空集**（结尾是 `bar-shortcut`） |
| `[data-slot$="menu-separator"]` | `11-controls-and-pages.css:268`（待改） | `menubar-separator` | **空集**（结尾是 `bar-separator`） |

**结论**：这三个分支从未生效。它们**看起来**是想给 menubar 的 label / shortcut / separator 上样式，但**后缀写错了**（`menu-*` 匹配不到 `menubar-*`）。

- **第一批（零 diff）的处置**：删除空分支 —— 因为匹配集合是空集，删除后**逐元素 computed style 完全不变**，符合零 diff 要求。
- **待用户拍板**：是否要在**第二批**把它们改成 `$="bar-label"` / `$="bar-shortcut"` / `$="bar-separator"`（或显式 `menubar-*`），**把原作者本来的意图真正实现**？这会**新增**样式（menubar 的这三类槽位目前是零覆盖）。

> 注：`15-late-components.css:102–109` 另有七行使用**无引号**写法 `[data-slot$=dialog-content]` / `[data-slot$=dialog-header]` / `[data-slot$=title]` / `[data-slot$=description]`。其中 `$=title` 与 `$=description` 是**宽开放集合**（会匹配任何以 title/description 结尾的 slot），但被"dialog-header 的直接子"这一上下文收窄。同属 D6 范围，应一并白名单化。

---

## 10. 🔴 P3 验收发现的架构级问题（**最高优先级，必须先修**）

P3 第一批改完后跑 42 态 computed-style 对比，结果是 **41/42 FAIL、368 处差异**。逐层剥离后定位到**两个独立问题**，**都不是 P3 选择器改写造成的**：

### 10.1 问题 A：拼接顺序改变了级联（**348 处差异**）

对比 artifact 与新建构的 SECTION 顺序，发现：

| 段 | artifact 位置 | 新建构位置 |
|---|---|---|
| **`tokens`**（`:root` 变量定义） | **第 1** | **第 14** |
| `fonts` | 第 4 | 第 1 |
| `assets` | 第 3 | 第 4 |
| **`assets-r5`** | **第 15** | **第 9** |
| `assets-r7` | 第 19 | 第 11 |

**根因**：artifact 里的**资源段是分散穿插的**（`assets` 第 3、`assets-r5` 第 15、`assets-r7` 第 19），而重构把它们**统统集中到最前面**当作"冻结层"。`assets-r5` 因此从第 15 位跳到第 9 位，`.r5-pattern-heart-dots` / `.r5-lace-band` / `.r5-scallop-edge` 三条规则**提前了约 90 个规则位次**，级联结果随之改变。

**结论：「冻结层 = 资源 + 动画，统一放最前」这个架构决定，与"零 diff"目标是冲突的。** 必须改为**保持 artifact 原有的段顺序**，或者证明被移动的段之间没有同属性竞争。

### 10.2 问题 B：3 条规则在拆分过程中丢失（**含在上述 348 处内**）

artifact 有 **756** 条规则，新建构只有 **753** 条。丢失的三条：

1. `[data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after`
2. `.vrcx-0-titlebar button:has(> svg.lucide-bell) > [data-slot='badge']`
3. `.vrcx-0-sidebar-surface [data-sidebar="content"]::after`

**必须找回并补回原位置。**

### 10.3 问题 C：slot 白名单化的依据清单不完整（**20 处差异，已定位**）

**这是本次最有价值的方法论教训：**

> **`data-slot` 的清单不能从 CSS 文件里 grep 得到。**

- CSS 里出现的 slot：**135 个**
- 运行时（42 个冻结快照）出现的 slot：**125 个**
- 并集：**181 个**
- **只在运行时出现、CSS 里从不出现的：46 个**（如 `dropdown-menu-separator`、`card-description`、`sidebar-menu-item`、`popover-trigger`、`switch`、`menubar-trigger`、`table-body`、`timeline-separator`…）

因为用了 CSS 清单，白名单化出现 **3 处不等价**：

| 后缀 | 真实命中面 | 当时的处理 | 后果 |
|---|---|---|---|
| `menu-separator` | **1 个**（`dropdown-menu-separator`） | **误删（当成空集）** | **造成 20 处 computed-style 差异** |
| `menu-item` | **3 个**（含 `sidebar-menu-item`） | 只列 2 个 | 潜在不等价 |
| `description` | **5 个**（含 `card-description`） | 只列 4 个 | 潜在不等价 |

（`menu-label` 与 `menu-shortcut` 经复核**确实是真空集**，删除正确。）

**推论**：任何基于「静态 CSS 文本」推导出的命中面，都只是**下界**。等价性证明必须建立在**运行时 DOM 观测**之上，且即便如此也仍是**有限样本**（本项目的 181 并集来自 42 个冻结态 + CSS 文本，两者都没覆盖到的 slot 仍可能存在）。

### 10.4 修复计划

| 步 | 内容 | 状态 |
|---|---|---|
| 1 | 修复 3 处 slot 白名单不等价（`menu-separator` / `menu-item` / `description`） | 进行中 |
| 2 | 按 artifact 原顺序重排段，消除 348 处级联差异 | 待做 |
| 3 | 找回丢失的 3 条规则并补回原位置 | 待做 |
| 4 | 重跑 42 态对比，直到 **42/42 PASS、0 差异** | 待做 |
