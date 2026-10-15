# P1-G2 Badge 组件普查

## 1. Inventory 全量记录与 context 汇总

筛选 `family=G2, component=badge, tag=span` 命中 **5 行**，合计 338 observations；`styleFingerprintCount` 合计 11，`styleVariants[]` 实际也为 11。context 表的 fingerprint 数按行求和（跨记录可能重复，非全局去重数）。

| primaryContext | variant | observations | 指纹数 |
|---|---|---:|---:|
| `surface:main-content` | default | 40 | 2 |
| `surface:main-content` | outline | 28 | 3 |
| `surface:main-content` | secondary | 80 | 3 |
| `surface:side-panel` | outline | 148 | 2 |
| `surface:titlebar` | default | 42 | 1 |
| **合计** |  | **338** | **11** |

| context 汇总 | observations | 指纹数合计 |
|---|---:|---:|
| `surface:main-content`（3 行） | 148 | 8 |
| `surface:side-panel`（1 行） | 148 | 2 |
| `surface:titlebar`（1 行） | 42 | 1 |
| **总计** | **338** | **11** |

路由范围：main-content default 仅 `/tools/vrchat-log`；outline 横跨 favorites、friends-locations、settings、tools；secondary 为 `/community-themes`、`/themes`。side-panel outline 记录覆盖 37 个 route/state；titlebar default 覆盖 42 states、34 条列出的路由。这里的 route 广度不代表每个 route 都有同一用途徽章。

## 2. 按视觉家族归并

Inventory 的 paint fingerprint 不含 `border-radius`、`padding`，也没有直接采集这两项；下表明确标为未采集。fingerprint 细分受到字重/字体、边线色等影响，不等于不同皮肤数。main-content secondary 中 `1f0dd...` 的边线色 `#8f7fe0` 与其他两支 `#6c5ce0` 是真实边线变化；outline 内 `81a3...` 是较亮紫色边框/底色 `#201936`，而 `517164...` 与 `7cc80...` 相同底色/边色，仅字重 500/400。`7cc80...` 在 side-panel 37 次复用。

| 视觉族 | 代表指纹（观察数） | 覆盖 context / observations 合计 | 背景 / 字色 / 边框 / 圆角 / padding / 字号 |
|---|---|---|---|
| 像素默认粉徽章（tool log） | `ce6d7a812270b778` (38)、`a8f01db2d568518a` (2) | main-content / 40 | `#ffb8e6` / `#16112a` / 1px solid `#6c5ce0` / 未采集 / 未采集 / 11px、600或500。两指纹仅字重不同，合为一族。 |
| Outline 中性/淡紫框标签 | `81a3a51a7cd4424a` (11)、`51716475f567a0e3` (11)、`7cc80c6354937110` (6+37) | main-content 28 + side-panel 37 = **65** | 两种近邻暗紫面：`#201936`、`#211a33`；文字 `#d6b8ef` 或 `#e3d2f5`；边 `#6c5ce0` 或 `#8c71b0`；圆角/padding 未采集；12px/400–500。将普通低对比色差/字重作 token 轴，保留主面与边色 token，不复制结构规则。 |
| Secondary 紫色实面 | `34623ab32508a8ae` (66)、`3961032758106f79` (12)、`1f0dd4353434c2e9` (2) | main-content / **80** | `#332650` / `#f2ebff` / 1px `#6c5ce0`（2 观察为 `#8f7fe0`）/ 未采集 / 未采集 / 12px、400或500。三指纹主要为字重和极少边色差，可由同一 variant+token 控制。 |
| Titlebar unread counter（独立强调/闪烁） | `b862120b00d7aeba` (42) | titlebar / **42** | `#21132d` ↔ `#ffd9ee` 闪烁反相 / `#ffd9ee` ↔ `#21132d` / 1px `#16112a` / CSS 明确 0 / CSS 明确 0 / 12px WD Pixel、400。虽然共用 badge 节点契约，但尺寸、定位、动画、字色反相都不是普通标签。 |

上述 inventory 的主 4 个皮肤基底覆盖全部 338 观察；没有将 `language-badges-r98` 或 feed region/status chips 冒充成 inventory badge 记录，它们是 CSS 中相关的 span/chip 规则家族，应一并审计但属于不同组件/DOM 契约。

## 3. theme.css 命中规则家族与重复

按当前 `theme.css` 物理行号：

| SECTION / 行 | 家族与处理判断 |
|---|---|
| `runtime` 639 | collapsible trigger 下的 `[data-slot="badge"]` 特化；是具体上下文/按钮内布局覆盖，不是通用徽章基底。 |
| `window-chrome` 913–914 | titlebar menubar help badge 的方角像素化规则；与 titlebar 全局基底相关但需保留明确范围。 |
| `feed-badges` 1139–1238 | feed TypeIndicator/StatusBadge、region chip 的 SVG/状态点/地区码标记。1234–1238 hover 给 region chip 换面色；不应混作普通 shadcn badge。 |
| `badge-r9` 2350–2439 | Bell unread counter，尺寸/定位/反相闪烁和 reduced-effects 覆盖；动画关键帧与两组停播/降动效覆盖不可并入普通徽章。 |
| `controls-r9` 2580 | 特定小卡片 tabs 中 badge 的高上下文选择器；局部覆盖需复核是否旧例外。 |
| `favorites-r9` 3771 | favorites groups resizable panel 内 badge 规则；需保留结构限定，不能用全局选择器吞并。 |
| `buttons-badges-r10` 4234–4283 | 当前主要通用源：4277 方角/bevel 基底，4278–4283 default/secondary/destructive/outline/ghost/link 色彩规则。context exclusion 很长，视觉底层与尺寸/语义覆盖应拆开整理。 |
| `language-badges-r98` 4933–4959 | DataTable 内精准 DOM 的语言标签（#ff7fcf 边、暗紫面、粉字、底部亮线，10px）；独立语言标识，不属于普通 Badge variant。 |

**重复/可消除点：** main/side-panel 普通方角标签在 4277–4283 集中定义，但 outline 与 secondary 两种边框/面色在上下文与字重层面分裂成多个 inventory fingerprints；该处应保持单一结构基底，将色值/语义变体 token 化，而非给每个 fingerprint 再添一套规则。`runtime:639`、titlebar:914 与通用 4277 都表达方角这一几何意图，可以共用 `--badge-radius:0`/bevel token，但各自限定范围保留，避免消灭上下文差异。feed 1234–1238 重写的是 region chip hover 面色，不等于重复普通 badge。`badge-r9` 的两个 reduce-motion 分支重复了闪烁停止后的静态颜色/边框/阴影（2416 区块中 loading 停播仅需 animation:none；2421–2439 两种 reduced-effects 路径的静态基准可抽成同一降动效规则），这是明确可去重项；不应合并闪烁动画本身。未找到 `.jk-badge-*` 类选择器规则；`jk` 目前主要作为变量前缀，而不是 badge 类族。

## 4. 合并决策与 specificity

**可合并：** default 的两支仅字体粗细不同；secondary 三支共用同一实面族，边线微差用语义 token 显式表达；outline 的普通中性色差可共用结构、字阶和方角 bevel。各处重复的 square / inset 轮廓共享变量。`font-weight` 的 400/500 归入文本/内容轴，不另造表面皮肤。

**必须保留：** default 粉色主强调与 secondary 紫色实面不能仅因同属 badge 而合成一个色族；outline 中性框与实面有不同层级；destructive/danger、online/offline、trust、角色/权限等语义色必须依语义属性独立映射（即使 inventory 当前五行没有覆盖它们，也不能让统一基底冲掉上游语义色）；titlebar unread 计数器的超紧凑尺寸、定位和动画；language label 的条纹/底线身份；feed 状态方块和 region chip 的 class 契约。方角 Win98 像素徽章不可和真实 pill/圆角徽章合并。

**Specificity 风险：** 裸 `span` 是 `(0,0,1)`，`.foo span` 是 `(0,1,1)`。不能把 context-scoped badge 规则直接迁移成裸 `span` 或仅 `span[data-slot]` 并期待顺序兜底。建议所有通用皮肤都锚定组件契约，如 `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="badge"][data-variant]`（selector 核心至少 `(0,2,0)`，scope 用 `:where()` 避免无谓加权）；额外 class 语义可用 `[data-badge-tone="danger"]` 或 `.jk-badge--danger`。保留标题栏/卡片/工具栏等排除边界，确保组件选择器本身的特异性高于应用 utilities；若迁移时某个旧 `.foo span` 仍需胜出，给新规则增加稳定的语义属性/role，而非提高到脆弱的 DOM 深链或滥用 `!important`。确认 stylesheet 顺序并做 computedStyle 回归。

## 5. 收敛结论与 CSS 骨架

**建议收敛成 6 个视觉族**（交互状态/语义色是变体轴，不按每种颜色扩成新基底）：

1. **标准方角基础 badge**：`[data-slot="badge"][data-variant]` 定义 `display/align-items/border/radius/padding/font-size/line-height/letter-spacing/box-shadow` 一次；方角及 inset bevel 共享 token。
2. **Emphasis / default 粉色**：`[data-slot="badge"][data-variant="default"]` 管 `--badge-bg/--badge-fg/--badge-border`，11px 字号/600 为当前 log 证据。
3. **Secondary 紫色实面**：variant selector 映射 `#332650` 系与紫边；12px/400 起步，粗细正交。
4. **Outline 中性标签**：variant selector 控暗紫/透明或浅框面与淡紫文字；保留 side-panel 的字色/边色 token，不要复制整套 padding/bevel。
5. **Compact counter / notification**：`[data-ui-role="notification-count"]` 或 titlebar + direct bell 结构定位，专管位置、14–24px 宽/13px 高、零 padding、12px 和动画/降动效；抽共享静态色声明。
6. **独立标记几何族**：feed region/status 与 `language-badges-r98` 按已存在的 class/结构契约限定；保持 10px/16px 几何、状态/语言专色、底部装饰线；不得推广成通用 span badge。

这 6 族里前四类共享方角基础；后二类是语境/几何特例。CSS 拆成 base + `data-variant` 色彩映射 + `[data-ui-role]`/严谨结构限定的 counter 与 chip 特例，online/offline/trust/danger/role 用自定义属性映射，不靠重复整块声明。

## 6. 可视化

[打开 badge 视觉族预览](../preview/P1-G2-badge.html)。页面内嵌 CSS 并排呈现收敛族，复现现有主题的粉/紫、bevel、方角、紧凑 counter 与语言装饰；未采集的 radius/padding 采用 theme.css 明文规则或标示为示意，不伪装成 inventory 数据。
