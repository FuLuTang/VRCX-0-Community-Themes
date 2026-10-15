# P1-G2 Button 组件普查

## 1. Inventory 盘点与口径

直接筛选 `component=button` 得到 **28 行而非任务说明中的 31 行**（数据源：`component-variant-inventory.json`，当前 SHA 对应 theme CSS 为 inventory 记录的版本）。以下完整列出实际命中的全部行；不能凭空补造 3 行。行级 fingerprint 数合计 52，实际 `styleVariants[]` 总数 51（存在字段计数与嵌套列表不一致），跨全表按 fingerprint 去重为 36 个；观察总计 1,655。`primaryContext` 汇总如下；观察数与 fingerprint 数均为该 context 下所有行求和。

| primaryContext | 行数 | 观察数 | styleFingerprintCount 合计 |
|---|---:|---:|---:|
| `overlay:popover-content` | 3 | 79 | 5 |
| `overlay:sheet-popup` | 1 | 1 | 1 |
| `surface:data-table` | 3 | 129 | 3 |
| `surface:main-content` | 16 | 772 | 38 |
| `surface:side-panel` | 2 | 629 | 2 |
| `surface:table-header` | 3 | 45 | 3 |
| **总计** | **28** | **1,655** | **52** |

逐行数据分布为 `overlay:popover-content` 3、`overlay:sheet-popup` 1、data-table 3、main-content 16、side-panel 2、table-header 3，共 **28**。个别 fingerprintCount 与 `styleVariants` 项数不一致，统计沿用原字段并单独注明，不作静默修正。

### 逐行核对（variant / size 仅用于复核，不展开 computedStyle）

| # | primaryContext | variant / size | observations | fingerprintCount |
|---:|---|---|---:|---:|
| 1 | popover-content | default / sm | 1 | 1 |
| 2 | popover-content | ghost / icon | 77 | 3 |
| 3 | popover-content | outline / sm | 1 | 1 |
| 4 | sheet-popup | outline / default | 1 | 1 |
| 5 | data-table | ghost / default | 86 | 1 |
| 6 | data-table | ghost / icon | 33 | 1 |
| 7 | data-table | ghost / xs | 10 | 1 |
| 8 | main-content | default / sm | 27 | 3 |
| 9 | main-content | default / default | 1 | 1 |
| 10 | main-content | ghost / icon-sm | 260 | 5 |
| 11 | main-content | ghost / icon | 2 | 1 |
| 12 | main-content | ghost / default | 271 | 9 |
| 13 | main-content | ghost / sm | 26 | 6 |
| 14 | main-content | ghost / icon-xs | 48 | 1 |
| 15 | main-content | link / xs | 22 | 1 |
| 16 | main-content | link / sm | 1 | 1 |
| 17 | main-content | outline / icon | 1 | 1 |
| 18 | main-content | outline / sm | 29 | 2 |
| 19 | main-content | outline / default | 9 | 3 |
| 20 | main-content | outline / icon-xs | 46 | 1 |
| 21 | main-content | outline / icon-sm | 24 | 1 |
| 22 | main-content | secondary / icon-sm | 3 | 1 |
| 23 | main-content | secondary / sm | 2 | 1 |
| 24 | side-panel | ghost / default | 592 | 1 |
| 25 | side-panel | ghost / icon | 37 | 1 |
| 26 | table-header | ghost / sm | 13 | 1 |
| 27 | table-header | ghost / default | 17 | 1 |
| 28 | table-header | ghost / icon-xs | 15 | 1 |

## 2. 按视觉语义归并

ComputedStyle 没有记录 `border-radius`，也没有 padding 字段；下表因此明确写“未采集”，不能从指纹臆测。覆盖 context 指 fingerprint 所在 `primaryContext` 去重计数；部分同视觉 fingerprint 在多个 context 复用。

| 视觉族 | 代表 fingerprint（示例） | context 覆盖 / 观察 | 关键 computedStyle：背景 / 边框 / 阴影 / 圆角 / padding / 字体 |
|---|---|---:|---|
| 透明 ghost（常规/无边框） | `cc394cb8196329d6`, `bdbee0673c9b9d3e` | main、data-table、side-panel 等 5 个 / 1,094 左右 | transparent；透明细边或无边；none；未采集；未采集；#e3d2f5，14px、400–500。颜色/字重的细微差异是文字语义，不是独立皮肤。 |
| icon-only ghost / 工具图标 | `b5f156bbb920f689`, `304f59e9d2df2398` | main、side-panel、popover、data-table 4 个 / 约 426 | 透明或 `#1d1631`；多数无边；none（disabled/hover 有轻 inset）；未采集；未采集；淡紫 #a294c8 或 #d6b8ef，尺寸随 `data-size`。 |
| 标准凹面按钮（outline / secondary） | `f17e4dcc5a515e1f`, `bfacf74a20f9977b` | main、popover、sheet 3 个 / 约 170 | #211a33；1px #6c5ce0；inset #fdf4ff/#16112a；未采集；未采集；#f2ebff，通常 14px/500。outline 与 secondary 多处 computedStyle 完全相同。 |
| 主操作 default / 粉色凸面 | `78a64dbc8432f852`, `a0eafe90486aec34` | main、popover 2 个 / 约 27 | #ffb8e6；紫色 1px；粉白/深紫 bevel，个别带 2px 外投影；未采集；未采集；#16112a，常规字重。disabled 通过 opacity/filter 区分。 |
| link 文本动作 | `58d070192273f298` | main 1 个 / 23 | transparent；无边；none；未采集；未采集；#d6b8ef，文本下划线语义。保留 link 角色而非并入 ghost。 |
| disabled / 状态覆盖 | `c5fa659ef4343af2`, `05c547851052e5e5`, `d813f132fded0cdd` | main、popover 2 个 / 多个基础族观察子集 | 继承所属视觉族，典型 opacity .58 + grayscale(.65)，阴影降亮；不是一种新的基底按钮皮肤。另有 `opacity:0` 的表格图标按钮，属于隐藏/显隐状态。 |
| 语义色/特异小样本 | `f74b695651d5d709`, `0743e3a4f114cdc9`, `f2f0b2b27ab19c2c` | main 1 个 / 各 1 | 蓝、黄、红 Oklch 底色，透明边与 bevel；观察极少，属于状态色（info/warning/danger）线索，不应混入通用 ghost；需回到 DOM 确认语义后保留。 |

`styleFingerprint` 是综合属性 hash，因 text color、opacity、border-width、hover/disabled 等造成拆分；它不等价于视觉家族数。比如 `cc394…` 在 372 次观察中跨 main 与 data-table，多个不同 fingerprint 仍可收敛为透明 ghost 基底；`f17e…` 同时覆盖 outline icon xs/sm 与 secondary icon-sm，说明尺寸/变体标签未必导致不同表面皮肤。

## 3. theme.css button 规则家族与重复写入

下列范围按当前文件物理行号；仅列影响 button 的代表家族（button 数百条特殊用途/装饰规则不可能也不应被合并成一条）。

| SECTION / 行范围 | 规则家族与判断 |
|---|---|
| `runtime` 597–742 | CSS 变量 `--jk-button-*`（606–611）；通用 `[data-slot="button"]` 方角及焦点（674–675）；sidebar collapsible/button 特化（630–642）。变量可作为唯一 token 源，焦点定义却另有不同 dashed 样式，需评估用途。 |
| `window-chrome` 743–917、`chrome-r8` 1631–1781、`motion-r8` 1828–1918 | 窗口标题栏按钮、工具栏按钮、close/destructive 和 pressed/hover/focus 状态；R3/R8 对 titlebar 同一视觉反复迭代定义。不能并入普通 action（窗口控制按钮有固定尺寸、位置与关闭语义），但共享色值/bevel token。 |
| `login-r8` 2040–2286、`user-dialog-r9` 2287–2349 | login submit/outline/link/saved-account、avatar button 与 bio-link icon；部分是页面特例，另有与通用 default/outline/link 重复的外观。应让结构/语义专属部分局部化，只覆写真正差异。 |
| `controls-r9` 2441–2655、`popups-r9` 2656–2800、`tools-ui-r9` 2801–2880 | object-row、popover/menu、chart toolbar、tab content 等上下文规则。部分选择器异常长且深度绑定 DOM；button 面色重复，而 card/tile/avatar 装饰及菜单项命中范围必须保留。 |
| `fields-toolbar-r10` 3515–3632、`overlays-r10` 3633–3739 | toolbar input-group button、弹层 header button、toast focus；与共享 action 规则有重复 focus/outline/bevel。 |
| `favorites-r9` 3740–4064、`browse-history-r9` 4065–4233 | 收藏 rail、tile/icon 和历史 toolbar 控件的局部外观；选择态、虚线 create affordance、尺寸/布局必须保留，常规方角/基础 bevel 可共享。 |
| `buttons-badges-r10` 4234–4312 | 当前集中样式源：default、outline/secondary、ghost、destructive、link、active、focus、disabled。4263–4274 在 chart HUD 再复制一套 variant 外观；4306–4307 又单独给浮动粉色按钮覆写。是最明确的重复合并目标。 |
| `data-surfaces-r10` 4313–4732 | object-row、selected tab/card、activity skin 等语义化按钮及局部覆盖（约4499–4710）。Selected 状态/卡片点击整面不可抹成普通 action；但边框、焦点与 token 仍可共享。 |
| `privacy-lock-r96` 4740–4795 | 重新定义 default/outline 控件外观，与共享主操作/凹面规则部分重复，但隐私锁是独立完整场景，应保留页面边界并复用 token。 |
| `entity-button-roles-b054-b072` 5219–5260 | portal dialog/sheet/popover action roles 的统一规则，涵盖普通 action、text-link 等；与 buttons-badges 的语义映射重叠，是另一份“共享系统”，适合统一 token/variant 映射，而非粗暴删除 context 条件。 |

裸 `button` 命中规则另见 `body-typography` 965（通用字体）、`avatars-status-r9` 2889、`browse-history-r9` 4082、`data-surfaces-r10` 4601/4672、portal rules 5220。`::-webkit-scrollbar-button` 1350–1354 是滚动条伪件，不属于 UI button。`.jk-button-*` 在当前 CSS 是变量名，不存在可据此概括的类选择器家族。

**重复视觉具体项：** 1) `buttons-badges-r10` 与 chart HUD 4263–4274 重写同一套 variant/base/bevel、focus、disabled（仅 chart HUD 的容器隔离语义可能不同）；2) login `2210–2235` 的 outline/secondary 与主规则使用同一凹面、default 使用同一粉面，但局部 hover/焦点/登录语义需保留；3) popover default/action 特殊区与 `4306–4307` 粉色底重复主操作颜色；4) titlebar R3/R8 多段重复定义 titlebar bevel/hover/focus，需合并同家族版本但保留 close hover 和 Win98 窗口控件特性；5) generic `[data-slot=button]` 674–675 与之后专门规则重复方角/焦点，只保留一处 canonical base/focus，再在局部有证据时覆盖。

## 4. 合并决策

- **可合并：** main/data-table/table-header/side-panel 中常规透明 ghost 共用一个基底；ghost 的 `default/sm/xs/icon-*` 只通过尺寸/布局轴变化，不能复制面色规则。Outline 与 secondary 的同色凹面合并到 `--variant-surface`；`data-size` 只管几何。disabled 是正交状态覆盖。重复的 font-weight/font-color（仅文本层不同）作为 token/语义映射，不拆皮肤。
- **必须保留：** default/primary 粉色主操作；destructive/danger 红色反馈；ghost 透明/hover；link 文本动作；icon-only 的正方 hit area/图标排布；selected tab/pressed 按钮状态（`aria-pressed`、`data-active` 等）；窗口 close/titlebar 按钮；头像/卡片/tile 整面按钮；disabled、focus-visible、active 这些交互状态。`data-variant=secondary` 若语义上仅普通次级操作，可并入 outline 外观，但保留 variant 属性以供组件 API 与状态选择器识别。
- **证据不足：** 三个 1 次观察的 Oklch 彩色样式先作为局部语义色例外，不建立新通用族；hover/selected 不能从单独颜色推断，需根据对应 state/routes 回溯验证。

## 5. Specificity 风险（必须处理）

裸 `button` 的 specificity 为 `(0,0,1)`；`.some-context button` 为 `(0,1,1)`。将后者直接改成 `button`，可能被 app 的 Tailwind class（如 `.bg-*`, `.border-0`, `.rounded-*`，通常 `(0,1,0)`）在级联中盖过，尤其当 Tailwind 后加载或同级时。不要用裸 `button` 承担皮肤；以可识别且稳定的组件契约做限定，例如 `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant]`，或明确的 `.jk-button` / `[data-ui-role="action"]`，并把 role/variant 写到组件。`:where()` 内部权重归零，外侧 `[data-slot][data-variant]` 自带 `(0,2,0)`；若要压过 Tailwind utility，应使用有意设计的 `:is([data-slot="button"].jk-button)`（class+属性）并确保注入顺序，或者提升作用域 selector 的稳定 class/属性权重，而不是无差别 `!important`。保留局部高 specificity 仅用于明确例外（titlebar close、tile、selected object row）。同时确认实际 stylesheet order；specificity 相同仍由后出现者胜出。

## 6. 收敛结论与 CSS 骨架

建议收敛为 **6 个视觉族**：

1. **Action 凸面/凹面（主按钮与次按钮）**：`:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="button"][data-variant="default|outline|secondary"]`；共用 `--jk-button-*` 的 border、background、color、box-shadow、radius、padding；default 与 outline/secondary 仅 token 差异。
2. **Ghost / toolbar**：`[data-slot="button"][data-variant="ghost"]`；transparent/no border/none shadow，hover 与 active 单独状态规则；尺寸不进入视觉 skin selector。
3. **Danger**：`[data-slot="button"][data-variant="destructive"]`；danger edge/face/text，保留 hover/active/focus。
4. **Text-link**：`[data-slot="button"][data-variant="link"],[data-ui-role="text-link"]`；无框透明、underline dotted、link color/hover color。
5. **Icon-only / toolbar-control 几何层**：通过 `[data-size^="icon"],[data-vrcx-0-control="toolbar"]` 管 width/height、padding、flex/icon size；其 surface 继承 ghost/outline 等族，不重复定义肤色。
6. **Selected / tile / object-row / window chrome 等结构性特例**：按 `[aria-pressed="true"]`, `[data-active]`, `[data-ui-role="tile"]`, `.vrcx-0-titlebar` 限定；只覆写 selected face/bevel/尺寸/装饰，不复制通用基础。

这 6 族是样式层级（4 种操作语义 + icon 几何 + 结构状态特例），disabled/focus/active 作为正交状态，而非第七个基础族。观察到的 36 个 fingerprint 因尺寸、文本色、隐藏、disabled、边线差异而高估了皮肤数量。

## 7. 可视化

[打开 button 视觉族预览](../preview/P1-G2-button.html)。预览使用 CSS 内嵌的真实主题颜色、方角与 inset bevel，呈现 default、outline/secondary、ghost、danger、link、icon-only、selected 与 disabled 示例；HTML 可直接双击打开。