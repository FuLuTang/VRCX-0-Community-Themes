# P1-G5 Avatar 组件普查

## 1. Inventory 范围与按 primaryContext 汇总

只取 `family=G5, component=avatar`，不把 `avatar-fallback` / `avatar-image` 的记录并入 avatar 本体。本体共 **2 条记录、154 次观察、2 个 fingerprint**；两条 styleVariants 均为单 fingerprint。Inventory 的 `paintFingerprintProperties` 不含 width/height/object-fit，因此不能从 computedStyle 还原实际像素尺寸或 `object-fit`；尺寸档位只可按记录里的 `size`（`sm` / `default`）和 theme.css 中明确选择器推断，预览尺寸按 class 档位示意。

| primaryContext | 观察数 | 指纹数 | 记录（tag / size / route） |
|---|---:|---:|---|
| `surface:data-table` | 20 | 1 | `span / default`，`/notification`，fingerprint `19b69e2f4039e6e7`（20） |
| `surface:main-content` | 134 | 1 | `span / sm`，`/activity`，fingerprint `3f86ad351bb0976f`（134） |
| **合计** | **154** | **2** | 两种档位；inventory 组件记录本身未覆盖 avatar-group 的方形例外 |

### 两条记录的完整 styleVariants

| context / fingerprint（观察） | computedStyle（本任务所需属性及可判断值） |
|---|---|
| `surface:data-table` · `19b69e2f4039e6e7`（20） | `background-color: rgba(0,0,0,0)`；四边 border `0px solid rgb(108,92,224)`；`box-shadow:none`；`outline:2.4px none rgb(242,235,255)`；`border-radius`、宽高、`object-fit` 未提供。`color:rgb(242,235,255)`，字体 16px/400。 |
| `surface:main-content` · `3f86ad351bb0976f`（134） | `background-color: rgba(0,0,0,0)`；四边 border `0px solid rgb(108,92,224)`；`box-shadow:none`；`outline:2.4px none rgb(242,235,255)`；`border-radius`、宽高、`object-fit` 未提供。`color:rgb(242,235,255)`，字体 14px/400。 |

这两个 paint fingerprint 的头像壳层外观一致，字体大小只是排版继承差异；avatar 本身的圆/方裁切实际由 image/fallback 子层和场景选择器处理。

## 2. 视觉家族与关键样式

| 视觉家族 | 代表场景 / 证据 | 尺寸、圆角、边框、背景、object-fit |
|---|---|---|
| 用户头像小档 | sidebar、data-table、弹出层、Activity 小头像；theme.css 的 `--wd-avatar-cut-sm` 和 `size-6/7/8/9` 选择器 | 本体档位常见 24–36px；圆形默认被主题做像素切角（不是 CSS 圆角），`border-width:0`、无阴影/outline，壳背景透明；image 用 `object-fit:cover` 的来源类保留，inventory 未采集 object-fit。 |
| 用户头像大档 | 自身/资料卡/Activity 主头像，`size-10/14/16`；较大档用 `--wd-avatar-cut` | 常见 40–64px；同样像素切角，透明壳、无主题边框；图像 cover 属于内容适配而非 avatar 壳皮肤，inventory 未给值。 |
| 方形群组头像（**有意例外，不可并入个人头像切角**） | Group Avatar 组件显式 `rounded-md` / `rounded-lg`，theme.css 3060–3092 解除全局 cut 并继承来源圆角 | 保留来源 `border-radius:var(--radius-md, …)` 或 `var(--radius-lg, …)`，`clip-path:none`；image/fallback `border-radius:inherit`、不裁切。不是用户头像像素切角；严禁统一成个人头像 cut。 |
| 状态灯/状态环头像 | `UserStatusAvatar` 外部状态装饰、Activity/好友行中的 sibling status dot；`avatars-status-r9` 明确说明灯/状态来自应用节点 | 用户头像只做切角，状态点/环由独立 app-owned 节点负责；保留状态背景/边框/可访问语义。`--status-online: #2ed319` 等状态颜色是 **app 自带值**，不是主题待收敛的配色。不能把灯揉进 avatar image。 |
| 默认 fallback 首字母 | `avatar-fallback` 子节点，inventory 有独立记录（见下） | 它负责无图时的字母/占位内容与背景/文字；与壳共享尺寸、轮廓，不能用来替代 image 的 cover/加载显示职责，也不能把 fallback 规则误写到整个壳上。 |

### 同族分工（非本任务合并对象）

- `avatar` 是尺寸/布局/装饰锚点（shell），决定容器和 overlay 层级。
- `avatar-image` 是图片内容层，负责 `object-fit`、加载/透明/动效和裁切；inventory 在 `surface:data-table` 有 19 次、2 fingerprints，在 `surface:main-content` 有 149 次、1 fingerprint。
- `avatar-fallback` 是缺图时的首字母/替代内容；inventory 在 `surface:data-table` 有 1 次、1 fingerprint，背景 `rgb(42,33,71)`、文字 `rgb(185,173,217)`，clip-path 为像素风小头像形状。不要把 fallback/image 的内容职责并成 avatar 本体样式。

## 3. theme.css 命中规则

行号为当前 `runtime/preview-package/jirai-kei-theme/theme.css`。同一视觉意图的高特异性上下文规则按选择器列出；省略的 asset polygon 变量定义是资源形状，不在此重写。

| SECTION / 行 | 选择器 | 实际声明 / 意图 |
|---|---|---|
| `runtime` / 699–705 | `:root`; `[data-slot="avatar"]`; `[data-slot="avatar-image"], [data-slot="avatar-fallback"]`; `[data-slot="avatar"][data-size="lg"] > :is(...)` | 定义 `--wd-avatar-cut`、`--wd-avatar-cut-sm`；壳 `border-radius:0;background:transparent;box-shadow:none;outline:none`；image/fallback `border-radius:0;clip-path:var(--wd-avatar-cut-sm);border-width:0;box-shadow:none;outline:none`；lg 子层切到大 cut。 |
| `runtime` / 706–707 | `[data-slot="avatar"]::after`; `[data-slot="avatar"]::before` | `::after` 清除边框色/宽度；`::before{content:none}`，避免主题环/伪框。 |
| `runtime` / 708–711 | `.vrcx-0-side-panel …`, `.vrcx-0-data-table …` 针对 `size-3.75` wrapper | `border-radius:0;clip-path:var(--wd-avatar-cut-sm);border-color:transparent;border-width:0;box-shadow:none;outline:none`；wrapper/子层另清圆角。 |
| `login-r8` / 2184–2206 | login 页面 `[data-slot="avatar"]`、`::before/::after`、image/fallback、lg 子层 | login 特定壳及伪元素清背景/装饰；image/fallback `border-radius:0;clip-path` 小/大 cut，去主题描边。高特异性页面覆盖。 |
| `popups-r9` / 2713–2716 | popup 内容容器下 avatar（排除 profile decoration）及子层 | 壳透明、无阴影/outline/主题环；子层小 cut，lg 大 cut；显式排除装饰框。 |
| `avatars-status-r9` / 2888–2962 | UserStatusAvatar size-9/10、hover-card、dialog header、activity-skin、好友行头像选择器 | 头像本体去圆角/边框/阴影/outline，并按尺寸使用小/大 `clip-path`；dialog header 壳背景透明。保留其父/兄弟状态装饰。 |
| `avatars-status-r9` / 2964–2972 | `.user-status-indicator`, `i.x-user-status`, 外层 status wrapper | 仅 `border-radius:0`；注释要求保留状态背景、边框、accessible masks。 |
| `avatars-status-r9` / 2974–3054 | G5 residual 用户头像（table/main/dialog/combobox chip） | 逐组按 size-6/9/11/3.5 及上下文做像素切角；去圆角、border、shadow、outline。选择器刻意限定，不泛化到所有 img/world/group 图。 |
| `avatars-status-r9` / 3057–3092 | `[data-slot="avatar"][class~="rounded-md/lg"]` 及 popup 等价选择器 | 群组头像显式恢复来源 radius、`clip-path:none`；子层继承圆角、不裁切。Popup 版本 specificity 更高。 |
| `avatars-status-r9` / 3094–3103 | `[data-slot="avatar-group"] …`, `[data-slot="avatar-group-count"]`, `[data-slot="avatar-badge"]` | AvatarGroup 堆叠分隔 `box-shadow:0 0 0 1px var(--background)`；count/badge 方角。不是个人头像主题环。 |
| `avatars-status-r9` / 3121–3129 | 状态点选择器、`.vrcx-0-side-panel …:has(> span.user-status-avatar):focus-visible` | 状态点方形化；状态头像按钮焦点 `outline:1px dashed var(--wd-square);outline-offset:2px;box-shadow:none`。 |

## 4. 合并判断与收敛

| 差异 | 判断 |
|---|---|
| Inventory `default` 与 `sm` 两档壳 | 可合并共用透明、无边框/阴影/outline 的基线；尺寸是排版/密度档位，用 `--avatar-size-sm/default` 或原生尺寸类保留，不额外复制颜色皮肤。 |
| 个人小/大头像 | 必须保留尺寸档及两种 pixel-cut 资源形状（sm 与 large）；它们是冻结资源，不能为追求“统一圆角”改动或删除。可共用规则骨架，以尺寸属性切换。 |
| 个人头像与方形群组头像 | **必须分开**。群组组件的 rounded-md/lg 是有意例外，恢复真实方角/圆角值并禁用用户头像 clip-path；不可将群组图像切成个人头像轮廓。 |
| 状态环/灯与头像面 | 必须作为正交装饰层/兄弟组件保留，不并进 image/fallback。本体规则不能覆盖灯的 background/border。在线绿 `#2ed319` 等保持应用所有权，不列入主题色归并。 |
| image 与 fallback | 必须保留两个内容角色；壳可共用轮廓/尺寸传递，但 image 的 cover/加载样式与 fallback 的首字母背景/字色分别维护。 |

**收敛结论：收敛为 4 个结构家族：①个人小档、②个人大档、③方形群组例外、④fallback 内容态；状态灯/环作为叠加状态层，而不是第五种头像皮肤。** avatar 本体的 2 个 inventory fingerprint 可合成一个共同基线，留下尺寸变量和轮廓档位。CSS 以 `[data-slot="avatar"]` 壳、`:is([data-slot="avatar-image"],[data-slot="avatar-fallback"])` 内容、`[data-size]` 尺寸修饰、`[class~="rounded-md"/"rounded-lg"]` 群组例外及独立 status 子层组织；保留 app 语义节点的局部选择器。

合并 specificity 风险：现有 popup selector 带多段 `:is()`、`:not(:has())`，比裸 `[data-slot="avatar"]` 更具体；login 的页面前缀也提高 specificity。若抽成低特异性共享层，后续这些旧规则仍会覆盖它，必须迁移/删掉旧重复规则或统一用 `:where()` 降权并安排层叠顺序。不要用更宽的 `img` 选择器，否则会误伤群组、world media 和装饰框。

## 5. 可视化

[打开并排 avatar 视觉预览](../preview/P1-G5-avatar.html)：展示小/大个人像素头像、圆角群组头像、状态灯头像与首字母 fallback；尺寸/形状仅展示可证实的家族差异，不伪称 inventory 提供未采样的宽高或 object-fit。
