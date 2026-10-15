# P1-G5 Avatar 内部槽位普查：fallback / image / native:img

## 范围与数据口径

读取 `baseline/reports/component-variant-inventory.json` 中 G5 的三类记录。fingerprint 是 inventory 采集的 paint 属性指纹，不代表完整 CSS 皮肤；其中**没有采集 `border-radius`、`object-fit`、`overflow`**，以下均明确记为未采集。样式层源文件为 `refactor/src/style/*.css`，行号均指该重构样式层，而非 runtime 原 artifact。

### avatar-fallback：完整记录 / styleVariants

| context | observations | fingerprint 数 | fingerprint / observations | background | color | font-size | border-radius | object-fit | overflow |
|---|---:|---:|---|---|---|---|---|---|---|
| `surface:data-table` | 1 | 1 | `c2c55b3a6cc64edc` / 1 | `rgb(42, 33, 71)` | `rgb(185, 173, 217)` | 14px | 未采集 | 未采集 | 未采集 |

证据：inventory 记录 11184–11229（context / count / fingerprint / computedStyle）。同一指纹另采得四边 border-width 均 0px、box-shadow none、clip-path 为小尺寸像素切角 polygon。Inventory 只覆盖 `/notification` 的一次 fallback，不能据此声称其他场景都采样过。

### avatar-image：完整记录 / styleVariants

| context | observations | fingerprint 数 | fingerprint / observations | background | color | font-size | border-radius | object-fit | overflow |
|---|---:|---:|---|---|---|---|---|---|---|
| `surface:data-table` | 19 | 2 | `a583527149fbeca0` / 12；`dd8d3f7a33716e94` / 7 | 两者均 `rgba(0,0,0,0)` | 两者均 `rgb(242, 235, 255)` | 两者均 16px | 未采集 | 未采集 | 未采集 |
| `surface:main-content` | 149 | 1 | `6583f1dc42c5d6c0` / 149 | `rgba(0,0,0,0)` | `rgb(242, 235, 255)` | 14px | 未采集 | 未采集 | 未采集 |

证据：inventory 11240–11320（data-table 两个 variants），11329–11375（main-content variant）。data-table 两个 fingerprint 的关键 paint 差异是 `clip-path`：一个是小头像切角 polygon，一个为 `none`；两者 opacity 都是 0、filter blur(0px)。main-content opacity 0、filter blur(0px)，clip-path 为小头像 polygon。不得把该加载/透明态误当作所有已加载头像的最终显示状态。

### native:img：完整记录 / styleVariants

仅有一条：`surface:data-table`，20 observations、1 fingerprint `3d499a15fd8ead14`（20），route `/social/friend-list`。background `rgba(0,0,0,0)`、color `rgb(242,235,255)`、font-size 14px；border-radius / object-fit / overflow 均未采集。另采得 opacity 1、filter none、clip-path 小头像 polygon、四边 border-width 0、box-shadow none。证据：inventory 11387–11439。

## 样式层规则盘点

以下列出匹配 avatar slot、相关裸 `img` 命中以及与头像裁切直接相关的规则。不存在主题 CSS 的 `object-fit` 声明（对 `object-fit` 的全样式层搜索无命中）；因此不把类名 `object-cover` 当作主题赋值证据。

| 文件 / SECTION / 行 | 选择器 | 实际声明（按源文件） |
|---|---|---|
| `02-foundation.css` / runtime / 103–109 | `:root`；`[data-slot="avatar"]`；`[data-slot="avatar-image"], [data-slot="avatar-fallback"]`；大尺寸子层 | 定义 `--wd-avatar-cut` 与 `--wd-avatar-cut-sm` 两个 polygon；avatar 壳 `border-radius:0;background:transparent;box-shadow:none;outline:none`；image/fallback `border-radius:0;clip-path:var(--wd-avatar-cut-sm);border-width:0;box-shadow:none;outline:none`；`data-size="lg"` 子层切换大 polygon。 |
| `02-foundation.css` / runtime / 110–111 | `[data-slot="avatar"]::after` / `::before` | after 清 `border-color`、`border-width`；before `content:none`。 |
| `02-foundation.css` / runtime / 98–101 | entity dialog 自定义框 button；其后代 `img` | button border/radius/shadow/outline 清除；`img` `border-radius:0;clip-path:var(--wd-avatar-cut)`。属于限定的头像装饰位，不是全局 img。 |
| `02-foundation.css` / runtime / 112–115 | side-panel/data-table 的 `span:has(>span.size-3.75) > span.overflow-hidden`；`.size-3.75` wrapper | wrapper/内层 `border-radius:0`；内层 `clip-path:var(--wd-avatar-cut-sm)` 并清 border/shadow/outline。 |
| `11-controls-and-pages.css` / avatars-status-r9 / 449–462 | UserStatusAvatar size-10 / size-9 两层限定结构 | size-10 壳 `clip-path:var(--wd-avatar-cut)`；size-9 壳用 `--wd-avatar-cut-sm`；均 `border-radius:0;border-width:0;box-shadow:none;outline:none`。 |
| `11-controls-and-pages.css` / avatars-status-r9 / 465–471 | hover-card profile icon 的限定 button/span | 小壳清 radius/border/shadow/outline，套大头像 polygon。 |
| `11-controls-and-pages.css` / avatars-status-r9 / 475–490 | dialog `size-16` user icon button 及其直接 img | button 透明、无框并由大 polygon 裁切；img 清 radius/border/shadow/outline、同样 `clip-path:var(--wd-avatar-cut)`。 |
| `11-controls-and-pages.css` / avatars-status-r9 / 494–513 | `.activity-skin` 尺寸 avatar span 与子 `:is(img,span.rounded-full)` | 头像外层分别用大/小 polygon，清 radius/border/shadow/outline；子层仅清 radius/border/shadow/outline。 |
| `11-controls-and-pages.css` / avatars-status-r9 / 516–529 | `.object-row` user face；`.user-status-indicator`, `i.x-user-status` | 用户头像壳套大 polygon；status 节点只做 `border-radius:0`。 |
| `11-controls-and-pages.css` / avatars-status-r9 / 536–584 | data-table、dialog、限定 class 的 `img`/fallback 壳 | 只匹配 size、rounded、object-cover 等多 class 头像形态；按 size 应用小 polygon，清 radius/border/shadow/outline；578–584 明确只命中限定头像 span 的直接 img。 |
| `11-controls-and-pages.css` / avatars-status-r9 / 587–614 | NoteExportDialog size-11 头像及 combobox-chip 图 | 限定壳/子 img 套大或小 polygon，清 radius/border/shadow/outline。 |
| `11-controls-and-pages.css` / avatars-status-r9 / 617–652 | `[data-slot="avatar"][class~="rounded-md/lg"]` 及 popup 变体 | 群组壳恢复 `--radius-md` / `--radius-lg`，`clip-path:none`；image/fallback `border-radius:inherit;clip-path:none`。弹层规则重复该例外以赢过更高特异性的 popup 规则。 |
| `11-controls-and-pages.css` / avatars-status-r9 / 654–679 | avatar-group、count、badge、skeleton | group stack 用 `box-shadow:0 0 0 1px var(--background)`；badge/count 方角；尺寸限定的圆形 skeleton 分小/大 polygon，去主题边框和阴影。 |
| `11-controls-and-pages.css` / popup portion / 270–285 | `i.x-user-status`；popup avatar、子 image/fallback；menu-item/button 例外 | 270 状态节点方角及 1px 深色 shadow；273–276 popup 壳/子层去圆角、image/fallback 小/大 polygon；279 外部装饰行免裁切；285 avatar-image 禁动画/过渡。 |
| `11-controls-and-pages.css` / avatars-status-r9 / 682–689 | 状态点 selectors、头像焦点 button | dashboard/status markers 方角；用户状态头像按钮 focus 用 `outline:1px dashed var(--wd-square);outline-offset:2px;box-shadow:none`。 |
| `10-login-and-dialogs.css` / login / 145–166 | login `[data-slot="avatar"]`、pseudo、image/fallback | login 上下文重申壳/伪元素清理，内容层 radius 0、像素切角，大档切大 polygon；是带页面前缀的高 specificity 重复规则。 |
| `10-login-and-dialogs.css` / dialog / 256–264 | dialog 装饰头像 `button > img` | 冒号前后需结合 02-foundation 101：限定 button 下 img 去 radius 并套大 polygon；其余行 264 是无关 dialog box。 |

### 裸 img 风险评估

**没有** `img { ... }` 这种裸标签规则，也没有只靠裸 `img` 命中的宽泛规则；主题只命中 avatar slot 或带 surface / dialog / size / utility class / 结构锚点的头像图。这里有若干选择器末端是 `img`（如 02-foundation 101、11-controls 484、563、578、595、609），但它们都带强上下文限定。data-table 的世界/截图缩略图不会仅因是 `<img>` 就命中这些头像规则；仍须防止未来把限定器删掉。`object-fit` 未由主题设置，使用者必须保留源组件的适配类/几何约束。

裸 `img` specificity 是 `(0,0,1)`，低于 Tailwind utility 的 class 选择器 `(0,1,0)`，容易被覆盖；不过更关键的是裸规则会误伤世界缩略图、截图预览等非头像媒体。继续保持语义限定，避免为“统一图片”增加 tag selector。

## 核心问题与证据

1. **谁裁切？** 规范 avatar slot 基线不是 `overflow:hidden` 容器裁，而是 image/fallback 自己设置 `clip-path` 像素 polygon（`02-foundation.css:107–109`）。不少非 slot 原生头像是外层 span 被套 `clip-path`（`11-controls-and-pages.css:449–462,494–507`）；这些代码并未声明 `overflow:hidden`。群组例外则壳和内容恢复来源 radius 并关闭 clip-path（`11-controls-and-pages.css:620–652`）。Inventory 的 radius/overflow 均未采集。**未发现主题 `object-fit:cover` 声明**；虽然一些匹配 class 包含 `object-cover`，那是选择器条件而非赋值。仅凭 inventory 无法确定图片自然尺寸/是否畸变，CSS 收敛时建议对 avatar image 明确保留/设置 `object-fit:cover`，但须由上游验证并纳入新层；当前主题未设置它。
2. **fallback 色与字号？** 唯一观测的 fallback 为背景 `rgb(42,33,71)`、文字 `rgb(185,173,217)`、font-size 14px（inventory 11202–11206、11225–11227）；样式层通用 slot 基线没有重设这些色字号（02-foundation 107–109）。未见按 size 分级的 fallback font-size 规则。按头像尺寸切换的是 clip-path 轮廓而不是已证实的字号。数据只有一个观察，颜色/字号属于样本事实，不应推断其他 fallback 内容。
3. **边框/描边与四族**：同族 avatar 前作的壳观察是 2 fingerprints，均 `border-width:0; box-shadow:none; outline-style:none`（`P1-G5-avatar.md:15–20`）；个人小档、个人大档无主题边框/阴影，形状分别 `--wd-avatar-cut-sm` / `--wd-avatar-cut`（前作 24–28；本次样式层 02-foundation 103–109）。第三族方形群组头像保留 `--radius-md/lg`，无像素剪裁（11-controls 620–652）。第四族是头像状态/外部装饰：theme 不制造头像环；status 节点由 app 管理，AvatarGroup 堆叠另有 1px 分隔 `box-shadow:0 0 0 1px var(--background)`（11-controls 524–532、654–663；前作 29、49–54）。换言之，“四族”是视觉职责，不是四个主题边框值；前三类头像面没有主题描边，第四类独立状态/堆叠描边的真实值如上。inventory 的 avatar-image/fallback border-width 都是 0。
4. **群组方形头像**：来源组件用 `class~="rounded-md"` 或 `class~="rounded-lg"` 区分，不是 `data-shape` / `[data-variant]`；壳保留 `--radius-md` / `--radius-lg`，取消 clip-path，子 image/fallback 继承 radius 并取消 clip-path（11-controls 617–652）。这是前作明确禁止与个人像素切角合并的例外（`P1-G5-avatar.md:28,61–63`）。
5. **11:279 免裁切例外**：真实重构行号是 `11-controls-and-pages.css:279`（前作提示的 theme.css 11:279 同源）；选择器在 menu/popover/select/combobox 内容内，命中含 `[data-slot="avatar"] [class~="-inset-[18.75%]"]` 或 `[data-profile-decoration-asset]` 的 menu-item/button 行，并设 `clip-path:none!important`。外部 VRChat member/profile decoration frame 是超出 avatar 框的装饰；若裁切该行会截断外部框，因此整行需免裁切。前一行 273–276 也排除该类头像。`select-content` 浮层内的普通头像仍由 273–276 裁切，285 只关掉 image 动画/过渡。
6. **online/offline 状态点**：有形状规则，但状态映射/颜色仍由应用节点控制。`UserStatusDot` 的 `.user-status-indicator` 及 legacy `i.x-user-status` 是独立标记节点（11-controls 524–529），activity/friend list 中常为 avatar 的 sibling；另有 `span...:has(> .user-status-indicator)` 头像外环（530–532）。主题只方角化，不把状态点并进 image/fallback，也不改其背景色/可访问 mask。

## 合并判定与收敛

- **可合并**：avatar-image / avatar-fallback 的共同几何清理、尺寸轮廓选择与无主题边框基线可共用 `:is([data-slot="avatar-image"],[data-slot="avatar-fallback"])`；小/大尺寸由父 slot 属性驱动。avatar 壳共享透明、无额外框的基线。跨场景重复规则可归并到统一语义层，但必须迁走登录/popup 的重复高 specificity 规则或明确层叠层次。
- **必须保留**：方形群组头像 radius 例外；状态点/外环的独立语义与颜色；fallback 首字母/占位色职责；加载中 skeleton 与 image loading/opacity 状态（inventory 中 image opacity 0 是加载观察，不是默认已加载视觉）；小/大两档像素轮廓；外部 VRChat profile frame 的免裁切例外。
- **建议结构：4 个视觉家族**：个人小头像、个人大头像、方形群组头像、独立状态/外部装饰层；fallback 与 skeleton 是各家族内的内容/加载状态，不额外制造通用“第五种头像皮肤”。
- 选择器骨架：`[data-slot="avatar"]` 负责尺寸/定位/透明壳；`[data-slot="avatar"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])` 共享无描边与轮廓；`[data-size="lg"]` 切大 cut；`.rounded-md/.rounded-lg` 群组显式 `clip-path:none`、子层 `border-radius:inherit`；`.user-status-indicator` 与 `[data-slot="skeleton"]` 单列语义状态。不要加入 `img {}`。裸标签 specificity `(0,0,1)` 本就会被 Tailwind class 覆盖，同时会扩大误伤面；只使用 slot/class/结构锚点。

## 可视化

[打开 avatar slots 并排示意预览](../preview/P1-G5-avatar-slots.html)。HTML 自包含、内嵌 CSS，展示已加载个人头像、fallback 字母、loading/skeleton、方形群组头像与列表行裁切/间距；所有标注值来自本文引证，未采集属性明确标作未采集。预览是规则示意，不伪装成 runtime 截图。
