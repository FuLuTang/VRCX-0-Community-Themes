# P1-G1 Checkbox 组件普查

## 1. Inventory 变体

Inventory 将 checkbox 记为 `family=G1`、`tag=span`，总计 100 次观察、4 个 fingerprint、8 种 state。组件级 routes 是以下 7 条；`styleVariants[]` 本身没有逐变体 routes 字段，因此不能把路由可靠分摊到单个指纹。

| Fingerprint | 观察数 | 涉及路由（组件级） | 关键 computedStyle 差异 |
|---|---:|---|---|
| `4b95ee99b763bee4` | 65 | `/charts/timeline`、`/favorites/avatars`、`/favorites/friends`、`/favorites/import/friends`、`/favorites/worlds`、`/tools/gallery`、`/tools/screenshot-metadata` | `background-color: rgb(32, 25, 54)`；四边边框 `0.8px solid rgb(108, 92, 224)`；`box-shadow: rgba(253,244,255,.18) 1px 1px 0 0 inset, rgb(22,17,42) -1px -1px 0 0 inset`。其余三种底色/边框组不同。 |
| `b3d96d0f2ef9df0d` | 19 | 同上（组件级） | `background-color: rgb(33, 26, 51)`；四边 `0.8px solid rgb(140,113,176)`；阴影为 `rgb(57,42,82) 1px 1px 0 0 inset, rgb(22,17,42) -1px -1px 0 0 inset`。 |
| `e8f360083c1a5fcd` | 14 | 同上（组件级） | 与上一指纹的 `background-color`、四边 border、`box-shadow` 完全相同；仅 `font-size: 16px`（上一条为 14px）。 |
| `1c15a77f66bb7743` | 2 | 同上（组件级） | 与前两条紫灰边框/暗底/阴影相同；仅 `font-weight: 500`（常见值为 400）。 |

四种记录的 `color` 均为 `rgb(22, 17, 42)`，`outline-width=2.4px`、`outline-style=none`、`outline-color=oklab(0.765878 0.172198 -0.0498766 / 0.5)`，无差异；border-radius 未出现在 computedStyle 数据中，不能据此判定实际计算值。数据没有表达出 checked/unchecked/disabled 等状态标签，勿仅凭 fingerprint 把它们解释成状态。

## 2. theme.css 命中规则

搜索了 checkbox 原生/语义选择器及 `checkbox` 字样。下表列出实际匹配 checkbox 控件本身或其 indicator 的规则；纯菜单项命名（例如 `menu-checkbox-item`）是菜单行，不是 checkbox 控件本身，故不列为 checkbox 外观规则。`[role="checkbox"]` 未发现命中规则。

| SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `login-r8` / 2268–2270 | `[data-vrcx-0-surface="login-page"] [data-slot="checkbox"]` | `border-radius: 0` |
| `form-controls-r9` / 3209–3224 | `:where(:is([data-slot="checkbox"],input[type="checkbox"]))` | `appearance:none; -webkit-appearance:none; position:relative; width/height/min-width/min-height:14px; flex:none; border:1px solid #8c71b0; border-radius:0; background:#211a33; color:#16112a; box-shadow:inset 1px 1px #392a52,inset -1px -1px #16112a; accent-color:#ffb8e6` |
| `form-controls-r9` / 3225–3229 | `:where(:is([data-slot="checkbox"],input[type="checkbox"]):is([data-checked],[aria-checked="true"],:checked))` | `border-color:#6c5ce0; background-color:#ffb8e6; box-shadow:inset 1px 1px #fff0fa,inset -1px -1px #b15b9d` |
| `form-controls-r9` / 3230–3236 | `:where([data-slot="checkbox"][data-checked])::after, :where(input[type="checkbox"]:checked)::after` | `content:""; position:absolute; left:4px; top:2px; width:4px; height:7px; border:solid #16112a; border-width:0 2px 2px 0; transform:rotate(45deg)` |
| `form-controls-r9` / 3237 | `:where([data-slot="checkbox"] > [data-slot="checkbox-indicator"])` | `display:none` |
| `form-controls-r9` / 3302–3309 | `:where(:is([data-slot="checkbox"],input[type="checkbox"]):focus-visible, …)`（逗号组内还含 radio/range/slider） | `outline:2px solid #ff7fcf; outline-offset:2px` |
| `favorites-r9` / 3980–3989 | Favorites tile 中的 `[data-slot="checkbox"]` | `width:16px; height:16px; border:1px solid #6c5ce0; border-radius:0; background-color:#201936; color:#16112a; box-shadow:inset 1px 1px rgb(253 244 255/.18),inset -1px -1px #16112a; transition:none` |
| `favorites-r9` / 3992–3997 | 同一 Favorites tile checkbox 的 checked 状态 | `border-color:#6c5ce0; background-color:#ffb8e6; color:#16112a; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d` |
| `favorites-r9` / 4000–4003 | 同一 Favorites tile checkbox 的 `:focus-visible` | `outline:2px solid #ff7fcf; outline-offset:1px`（覆盖共享规则的 2px offset）|
| `favorites-r9` / 4006–4009 | tile checkbox 的 `[data-slot="checkbox-indicator"]` 子元素 | `color:#16112a; transition:none` |
| `favorites-r9` / 4053–4057、4059–4063 | Favorites 屏蔽动效的 `:is(...,[data-slot="checkbox"])` 选择器组 | 分别在 `prefers-reduced-motion:reduce` 与 `html.reduce-effects` 下设置 `animation:none!important; transition:none!important`；这是 motion 抑制，不是视觉样式变体。 |

Inventory 里的 fingerprint 观察值为 computed style，不保证每条都对应以上 CSS 新规则；规则选择器/声明来自当前 theme.css。除 login 的方角覆盖、Favorites 的 16px tile 与覆盖状态/焦点外，没有找到针对 timeline/tools 的专属 checkbox 外观声明。

## 3. 合并判断与收敛

| 变体/差异 | 判断 | 理由 |
|---|---|---|
| `b3d…`、`e8f…`、`1c15…` | 合并为同一基础视觉族 | 三者在 color、背景、边框、阴影、outline 上相同；字体大小 14/16px 与字重 400/500 不改变 checkbox 方框本体，属于上下文排版差异，不应复制成组件皮肤。 |
| `4b95…` 与上述三条 | inventory 层面可合并，作为共享未选中基线 | 实际差异仅是背景/边框/阴影色略偏蓝紫；无状态证据支持其是 checked/disabled/danger。当前 form-controls 规则已经把通用未选框统一成 `#211a33 / #8c71b0`，而 Favorites 的特例另有明确页面语义。 |
| Favorites tile checkbox | 视觉上可与共享基础态合并其暗底造型，但尺寸/交互特性应保留为局部覆盖 | 它有清晰的 tile 选择用途、16px 尺寸、静态动画和独立 focus offset；checked 状态明确使用粉色底。需要保留的是页面上下文覆盖，不是再维护一份通用 checkbox 主题。 |
| login 圆角覆盖 | 合并/删除为冗余 | 通用控件已设 `border-radius:0`，login 又设相同值，不构成视觉变体，可并入通用规则或移除重复声明。 |
| checked 与 unchecked、focus-visible | 必须保留状态差异 | checked 使用粉色面与勾号，unchecked 为暗色凹面；focus-visible 的亮粉 outline 是键盘可见反馈。不要把状态语义并掉。 |
| disabled / danger | 不建立独立样式 | 本次 inventory 及 checkbox 规则没有可证据支持的禁用/危险态专属外观。若后续确认有状态，应再单列，不要臆造。 |

**结论：收敛为 2 种 checkbox 外观状态（未选中、已选中），另保留一个正交的键盘焦点指示；Favorites tile 仅保留 16px/transition 与 focus-offset 的局部上下文修饰。** Inventory 的 4 个 fingerprint 不等于 4 个需要保留的组件皮肤。

## 4. CSS 骨架建议

- 基础：`:where(:is([data-slot="checkbox"], input[type="checkbox"]))` 统一 `appearance`、尺寸、暗底、紫灰边框、方角和 inset 阴影；字体元属性不参与 checkbox 皮肤。
- 选中：同一选择器的 `:is([data-checked],[aria-checked="true"],:checked)` 覆盖 `background-color`、`border-color`、`box-shadow`，并用 `::after` 绘制勾号；`:focus-visible` 单独控制粉色 `outline`。Favorites 容器只覆盖尺寸/静态过渡和必要的 outline-offset。

## 5. 可视化

[打开并排 checkbox 预览](../preview/P1-G1-checkbox.html)：包含 inventory 中两组实质颜色值及 CSS 当前定义的未选中、已选中和 Favorites tile 状态。