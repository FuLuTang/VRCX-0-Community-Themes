# P1-G1 · input-group-addon 普查

## 范围与结论摘要

只审计 `input-group-addon`（G1）。它是 input-group 内的**非交互附加内容容器**：左侧可放前缀图标/文字，右侧可放单位/辅助内容；`input-group-control` 承载可编辑输入，`input-group-button` 承载可操作按钮。三者职责不同，不应把 addon 的视觉规则扩展成 control 或 button 的统一规则。

inventory 共两条记录、77 次观察、3 个 style fingerprint。观察到的 addon 本身无边框、透明背景、无阴影；最近样式层把边框、底色和 inset 斜面放在共同的 `input-group` 外框上。因此边界是**单一外框**，没有 addon 与 input 各自贴边叠成双线的证据。采样没有 padding 属性，padding 明确记为未采集。

## Inventory 全记录 / 按 primaryContext

| primaryContext | observations | stateCount | fingerprint 数 | styleVariants |
|---|---:|---:|---:|---|
| `surface:main-content` | 40 | 29 | 2 | `1fe6a80eeb9db487` ×31；`88057cb2ae53dab1` ×9 |
| `surface:side-panel` | 37 | 37 | 1 | `88057cb2ae53dab1` ×37 |

上下文记录：main-content 路由包括 `/browse-history`, `/charts/two-person`, `/favorites/avatars`, `/favorites/friends`, `/favorites/groups`, `/favorites/import/friends`, `/favorites/worlds`, `/feed`, `/friends-locations`, `/game-log`, `/instance-history`, `/login`, `/my-avatars`, `/notification`, `/search`, `/social/friend-list`, `/social/friend-log`, `/social/moderation`, `/tools`, `/tools/my-groups`, `/tools/screenshot-metadata`, `/tools/vrchat-log`。contextTrails 中该 context 的 observations 为 37（工具栏）、2（main-content）和 1（page-scaffold）。side-panel 路由包括 `/activity`, `/browse-history`, `/charts/timeline`, `/charts/two-person`, `/community-themes`, `/dashboard/:placeholder`, `/favorites/avatars`, `/favorites/friends`, `/favorites/groups`, `/favorites/import/friends`, `/favorites/worlds`, `/feed`, `/game-log`, `/instance-history`, `/login`, `/my-avatars`, `/notification`, `/player-list`, `/search`, `/settings`, `/social/friend-log`, `/social/moderation`, `/themes`, `/tools`, `/tools/gallery`, `/tools/group-moderation`, `/tools/inventory`, `/tools/my-groups`, `/tools/screenshot-metadata`, `/tools/vrchat-log`。

### 真正不同的计算样式

| context / fingerprint | 次数 | 背景 | 边框（四边） | 文字色 | padding | 字号 | 其它有差异项 |
|---|---:|---|---|---|---|---|---|
| main-content / `1fe6a80eeb9db487` | 31 | `rgba(0,0,0,0)` | 四边均 `0px solid`，计算边框色 `rgb(108,92,224)` | `rgb(214,184,239)` | 未采集 | `14px` | 字重 `500` |
| main-content / `88057cb2ae53dab1` | 9 | `rgba(0,0,0,0)` | 四边均 `0px solid`，计算边框色 `rgb(108,92,224)` | `rgb(185,173,217)` | 未采集 | `14px` | 字重 `500` |
| side-panel / `88057cb2ae53dab1` | 37 | `rgba(0,0,0,0)` | 四边均 `0px solid`，计算边框色 `rgb(108,92,224)` | `rgb(185,173,217)` | 未采集 | `14px` | 字重 `500` |

两个 fingerprint **仅文字色不同**；其余 inventory 纳入 fingerprint 的项目相同：边框宽度 0、box-shadow `none`、outline `none`（计算 outline-width 2.4px）、opacity 1、filter/transform/clip-path 无效果、字体 `"WD Pixel CJK", "Geist Variable", Geist, "Noto Sans SC", system-ui, sans-serif`、字号及字重也相同。文字色差异表现为普通强调 addon（`#d6b8ef`）和次级/提示文本 addon（`#b9add9`），不是边框/盒型差异。

## 样式层规则命中

| 文件 / SECTION / 行 | 选择器 | 实际声明（与 addon 有关） |
|---|---|---|
| [`13-toolbar-overlays-and-pages.css:21`](../src/style/13-toolbar-overlays-and-pages.css#L21)，`fields-toolbar-r10` | `.vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]:not(...#chart... *) [data-slot="input-group-addon"]` | `color:#d6b8ef` |
| [`13-toolbar-overlays-and-pages.css:32–38`](../src/style/13-toolbar-overlays-and-pages.css#L32-L38)，`fields-toolbar-r10` | 上述工具栏 input-group 内 addon 的直接子 `button[data-slot="dropdown-menu-trigger"][data-size="icon-xs"]`，及 `[aria-expanded="true"]` 状态 | button `border:1px solid #8c71b0; border-radius:0; background-color:#332650; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`；展开态 `border-color:#6c5ce0; background-color:#211a33; box-shadow:inset 1px 1px #7a3f6d,inset -1px -1px #fdf4ff` |
| [`11-controls-and-pages.css:377–379`](../src/style/11-controls-and-pages.css#L377-L379)，`tools-ui-r9` | 特定 chart 工具页 toolbar input-group 下的 addon | `color:#d6b8ef` |
| [`13-toolbar-overlays-and-pages.css:551–559`](../src/style/13-toolbar-overlays-and-pages.css#L551-L559)，`browse-history-r9`（嵌套选择器） | BrowseHistory 专属 toolbar input-group 下的 addon | `color:#d6b8ef` |

样式层中未找到对 addon 本体设置 `border`、`padding`、`background`、`box-shadow` 的规则；除上列三个上下文文字色规则和 addon 内按钮外，没有其他 addon 命中。按钮样式属于**按钮子元素**，不能误记作 addon 本体样式。外框统一规则见 [`13-toolbar-overlays-and-pages.css:71–79`](../src/style/13-toolbar-overlays-and-pages.css#L71-L79)：`:where([data-slot="input-group"])` 设置 `background-color:#201936; border:1px solid #6c5ce0; border-radius:0; box-shadow:var(--jk-field-inset)`；变量定义在同文件 7–10 行，`--jk-field-inset:inset 1px 1px #16112a,inset -1px -1px #a294c8`。input-group-control 在 22–25 行（非 chart）与 [`11-controls-and-pages.css:380–390`](../src/style/11-controls-and-pages.css#L380-L390)（chart）被明确设为透明、无阴影且方角；共享外框只画在 input-group。

## 外框与 addon 边缘衔接（重点）

- **无双边框**：addon inventory 的四边 border-width 都是 `0px`、shadow `none`；样式层 addon 本体也没有 border 声明。相邻的 control 被显式设为 `border-radius:0`、`box-shadow:none`、透明底色（13 文件 22–25 行；chart 对应 11 文件 380–387 行）。唯一边框是 group 容器的 `1px solid #6c5ce0`（13 文件 73–79 行）。所以 addon/control 接缝处不是两条 1px border 相加；边框只沿组件外周绘制。
- **斜面 inset**：有，但属于 group 外框的 `--jk-field-inset`，不是 addon 自身斜面（13 文件 7–10、73–79 行）。它是内侧左上暗线和右下亮线的 inset 阴影；外框 border 仍是 1px 实线。不会在 addon 与 input 的内接缝再造一道斜面。
- **圆角**：主题强制外框 `border-radius:0`，control 也为 0（13 文件 73–79、22–25 行；chart 11 文件 380–387 行）；方角一致。addon 本体无独立圆角规则，因此没有彼此冲突或需左右分别切角的证据。按钮型 addon 内按钮自己也显式 0 圆角（13 文件 32–38 行）。
- **左/右对称性**：样式层未见 `[data-align]` / 左右位置专属 addon border/shadow/radius 规则；两侧 addon 继承同一透明无边框容器样式，外周边框始终归 group。方向差异仅是子内容位置，不是边缘样式。由于 inventory 的 addon 专属 computedStyle 未记录 padding，也不能据此声称左右 padding 数值相同。

可视化文件用两种方向的示意 DOM 模拟上述职责，并将接缝区域放大。它展示的是依据已审计规则构造的效果，不宣称是实际运行页面截图；被放大的接缝应只有透明 addon 与透明 control 的交界，没有第二道 border。

## 合并判断与收敛建议

- **可合并**：纯文本 addon、前缀图标 addon、后缀单位 addon，共享一个中性容器盒型（不自行画边框/底色/阴影/圆角）；内容语义和强调色作为轻量修饰。图标若只是装饰，不必单独复制盒模型。
- **必须保留**：按钮型 addon 的按钮子元素交互样式（边框/填色/hover、focus、expanded 状态），不可并入纯文本 addon；强调色与提示色语义也需通过 token/修饰类保留，不能丢掉两组观察到的文字色。
- **推荐收敛为两种视觉层级，而非多个方向盒型**：①中性/强调 addon `#d6b8ef`（前缀图标或普通文本）；②次级提示 `#b9add9`（例如单位/说明文本，可按实际语义标记）。两者盒型完全相同。按钮仍是独立的交互子组件种类，不计入 addon 容器的两种视觉层级。inventory 两指纹只差颜色，side-panel 全部为第二种；具体单位是否都属于次级色，inventory 本身不携带内容语义，实施时应按语义而非位置映射。
- CSS 骨架建议：`:where([data-slot="input-group"]) { background:#201936; border:1px solid #6c5ce0; border-radius:0; box-shadow:var(--jk-field-inset) }`；`:where([data-slot="input-group-addon"]) { background:transparent; border:0; box-shadow:none }`，再用语义 modifier 控制 `color`；`[data-slot="input-group-addon"] > button[...]` 单独保留按钮状态。此处 addon 基础骨架是重构建议，当前样式层主要依赖无边框默认值，避免为未观察到的 padding 臆造值。
- **specificity 风险**：现有 `13` 文件第 21 行与 `11` 文件 377–379 行的场景限定选择器都很长且 specificity 高；若直接换成低 specificity 的 `:where([data-slot="input-group-addon"])`，场景色规则可能被既有强选择器压过。应把颜色也集中到 `:where(...)` 语义 token，或有意识地同步改写旧的场景限定规则；不要只新增低 specificity 通用色规则并期待它覆盖旧规则。工具栏普通场景排除 chart 的 `:not(...:has(...))` 也需要保留范围隔离。

## 可视化

[打开 addon 左右侧与边框接缝放大演示](../preview/P1-G1-input-group-addon.html)
