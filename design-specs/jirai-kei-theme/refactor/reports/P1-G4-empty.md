# P1-G4 Empty 空状态族普查

## 1. 范围与 Inventory

数据源：`component-variant-inventory.json`（生成于 2026-10-15；theme.css SHA256 `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`）。覆盖 `empty`、`empty-icon`、`empty-title`、`empty-description` 四槽位。这里 inventory 的 `empty` 实际仅 5 次观测，并非大样本；四记录共 17 次观测、5 个指纹。不要将其他未被这四个组件记录捕获的空白页面当作样本。

| 组件 | primaryContext | 观察数 | 指纹数 | routes |
|---|---|---:|---:|---|
| empty | `surface:main-content` | 5 | 1 | `/favorites/groups`, `/instance-history`, `/player-list`, `/tools/group-moderation` |
| empty-icon | `surface:main-content` | 2 | 1 | `/favorites/groups`, `/player-list` |
| empty-title | `surface:main-content` | 5 | 1 | 同 empty |
| empty-description | `surface:main-content` | 5 | 2 | 同 empty |

四记录 contextTrail 均落在 `... > area:vrcx-0-page-scaffold`。记录粒度/状态数：empty 4 state、description 4 state、icon 2 state、title 4 state。全部记录的 primaryContext 都相同，不能凭 routes 虚构更多 context。

### 全部指纹与绘制属性

| 槽位 / 指纹 | 观察数 | computedStyle 关键项（容器背景 / 边框 / 文字色 / 图标大小 / 间距） |
|---|---:|---|
| empty `3a73be5beacbbfdc` | 5 | 背景 `rgba(0,0,0,0)`；四边宽 `0px`、style `dashed`、色 `rgb(112,81,143)`；文字 `rgb(242,235,255)`；图标尺寸/间距未采集。注意：paint 指纹记录的是边框样式即使宽为 0；theme.css 规则实际只明确写边色，虚线来自其他基线/原有样式，不应误称该规则设置了虚线。 |
| empty-icon `ccf69b8ce6bdb3d7` | 2 | 背景 `rgb(42,33,71)`；四边 `0.8px solid rgb(108,92,224)`；文字/图标自身颜色 `rgb(255,184,230)`；图标尺寸、槽间距未采集。 |
| empty-title `dafd986d71efc620` | 5 | 背景透明；无边框（0px）；文字 `rgb(242,235,255)`；字体 14px / weight 500；尺寸与间距未采集。 |
| empty-description `225cae7274cf0cb2` | 4 | 背景透明；无边框；文字 `rgb(185,173,217)`；字体 14px / 400；尺寸与间距未采集。 |
| empty-description `c30718c0ccb9a8b0` | 1 | 与上项 paint 完全一致，只有字体尺寸 12px；仍为 muted `rgb(185,173,217)`；尺寸/间距未采集。可并入描述文字家族，保留紧凑字体例外。 |

inventory paintFingerprintProperties 不含 layout/box dimensions，故容器内距、图标实际盒尺寸、各槽间距均是“未采集”。边框宽 0 不等价于缺少 CSS 边框风格；不得据此杜撰虚线盒的可见粗细。

## 2. 视觉家族归并

这些记录只能证明一套「静态空状态」视觉：透明容器、紫色 quiet frame、粉色小图标块、亮标题、muted 描述。五个指纹主要由四个 DOM 槽位职责和描述文字 12/14px 的字号差异形成，不是五种空状态皮肤。inventory 中的 routes 显示涉及收藏群组、实例历史、玩家列表、群组管理；未观察到内容/语义字段，无法把样本可靠细分成“无结果 / 无数据 / 失败 / 登录 / 搜索无匹配”视觉族。HTML 以文案例子演示这些语义，但明确沿用同一 paint，不代表它们各有 CSS 变体。

| 收敛视觉族 | 覆盖 | 容器背景 / 边框 | 文本 / 图标 / 间距 |
|---|---|---|---|
| 静态空状态（唯一已观测族） | empty 5；title 5；description 5；icon 2 | transparent；paint 四边为 0px dashed `#70518f`（CSS 层显式设 border-color，style/有效边框由基线决定） | 根文字 `#f2ebff`；title `#f2ebff`；description `#b9add9`；icon slot `#ffb8e6`，底色 `#2a2147`、1px `#6c5ce0`；图标大小/槽间距未采集。 |

## 3. theme.css 命中规则

仅列直接命中四槽位的规则。theme.css 约 1 MB，但相关声明集中在 `SECTION data-surfaces-r10`，无各页面独立 empty 插图规则命中。

| SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `data-surfaces-r10` 4392–4396 | `:where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"]))` | `border-radius:0; border-color:#70518f; color:var(--wd-text)` |
| 同 4397–4399 | `:where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"])) [data-slot="empty-header"]` | `border-bottom:1px dotted #70518f` |
| 同 4400–4406 | `:where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"])) [data-slot="empty-icon"][data-variant="icon"]` | `border:1px solid var(--wd-frame); border-radius:0; background:var(--wd-raised); color:var(--wd-square); box-shadow:inset 1px 1px rgb(253 244 255 / .16), inset -1px -1px #16112a` |
| 同 4407–4412 | 同 root scope 下 `[data-slot="empty-title"]` | `color:var(--wd-text); font-family:"WD Pixel CJK", var(--vrcx-app-font-family, system-ui), sans-serif; font-synthesis:none; text-wrap:pretty` |
| 同 4413–4416 | 同 root scope 下 `[data-slot="empty-description"]` | `color:var(--wd-muted); text-wrap:pretty` |

**重复写入：** 在这组槽位内，未发现同一槽位/同一视觉在多个 SECTION 重复声明；上述是一个集中规则组。标题与根同色是继承语义重复（显式写出以固定标题字体/抗合成），不是重复拷贝多份样式。header dotted 分隔与根 quiet frame 责任不同。theme.css 3162–3201 命中的是含 spinner 的加载中结构及动画减效选择器，不是静态 empty 重复皮肤，且静态规则明确排除含 spinner 的节点，必须保留排除边界。`runtime` 仅可能提供通用 slot 基线，非另一份空状态整套 paint。

## 4. 合并与必须保留

- **可合并：**四槽位共享一条 scoped root 基底和统一 token；description 的 12px 单例收敛为描述字号 modifier/既有 utility，不需要新增一套颜色皮肤。root 与 title 的亮文字可由继承承担，是否省掉 title 的显式颜色要在重构时核对 cascade。
- **必须保留：**icon 是独立的 slot 视觉（粉色、raised 方块、边框与 inset 高光），不可并进通用文字规则。inventory 只观测到 `<div data-slot=empty-icon data-variant=icon>`，没有证明内部图标来自冻结资产还是纯文字/内嵌图形；应保留现有图标节点与引用，不改资源层，也不声称已确认冻结资产。没有证据证明不同页面有独立插图；反过来也不能据这些有限样本断言全站不存在独立插图。继续按组件/资产引用审查，禁止为语义状态擅自换插图。
- 静态空状态与 loading spinner 不是同一视觉/生命周期，`:not(:has([data-slot="spinner"]))` 边界必须留着；加载器属于冻结/独立规则。
- 页面文案和可能的动作按钮属于语义内容，保留 DOM、按钮交互和各页面布局，不把它们硬编码成某个状态装饰。

## 5. 收敛结论与 specificity

建议收敛为 **1 种静态空状态皮肤 + 1 个 icon-slot 子皮肤 + description 紧凑字号例外**（总计 1 个组件视觉族，不把字号差算独立主题）。骨架：`:where(.vrcx-0-main-content) [data-slot="empty"]:not(:has([data-slot="spinner"]))` 定义 frame/文字 tokens；其下 `empty-header / empty-icon[data-variant="icon"] / empty-title / empty-description` 分别承担分隔、图标方块、标题字体和说明色。使用 `--wd-frame/--wd-raised/--wd-square/--wd-text/--wd-muted`，避免重复硬编码。

Specificity：现 selector 的 `:where(.vrcx-0-main-content)` 不增加权重，但 `[data-slot="empty"]:not(:has([data-slot="spinner"]))` 以及后代 slot 属性仍有中等权重；`:not(:has())` 内部 spinner 属性也计入 specificity。若合并成单一低权重 `.empty` 类，可能输给组件/utility 规则；优先保持原 slot 选择器与 spinner 排除语义，再清理重复旧块，按 cascade layer 管理，不靠堆叠页面选择器。

## 6. 可视化

[独立预览 P1-G4-empty.html](../preview/P1-G4-empty.html) 内嵌 CSS，展示无数据、搜索无匹配、加载失败、需要登录四种文案示意；它们统一采用 inventory/CSS 证实的静态空状态 paint。占位符符号不是冻结插图；尺寸和间距属于预览排版，不是采集值。
