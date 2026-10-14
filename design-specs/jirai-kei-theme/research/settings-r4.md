# R4 设置页像素组件（导航栏 / 卡片 / Switch / 分段 / 步进器）——交付与实测

产物：[settings-pixel.css](<../runtime/settings-pixel.css>)（99 行 / **11 828 B**，上限 16 000 B；尚未接入 `build-runtime.mjs`）。
复现物：`../runtime/checks/r4-settings-pixel/`（`ssr-probe.mjs` + `ssr-probe.txt`、`verify.mjs`、`r4-settings-pixel-fixture.html`、`r4-measure.json`、12 张截图）。

- 主应用 `/home/fulutang/Documents/Github/VRCX-0-jirai`：**全程只读**。未执行 git、未构建、未写入任何文件。
- **未做 Windows / WebView2 实机验证**。全部结论来自 Chromium headless（`/tmp/dsh-theme-browsers/chromium-1248`）+ `file://` fixture + `@base-ui/react` 真实 SSR 标记 + 应用编译产物 CSS。Windows ClearType / DPI 缩放下的表现**均未验证**，本报告不作任何真机结论。
- 无 `@import`、无远程 URL（文件内 3 处 `http` 全部是 data: URI 里的 `xmlns` 命名空间）；所有 mask 均写显式 `mask-size`；未改任何虚拟列表行高 / `translateY`；VRChat 状态色未触碰。

## 1. 报点 → 实现映射

| # | 用户报点 | 实现 | 证据行 |
|---|---|---|---|
| ① | 左侧分类栏是"死板紫色平板一块" | 像素窗口列表：1px `#6c5ce0` 外框 + `#201936` 面 + 内凹凸 bevel + 四角阶梯缺角（`clip-path`）；选中项 = 浅粉面 `#ffb8e6` + 1px ink 框 + bevel + ink 文字；hover = `#4a3784` 面 + 亮字；底部波瓣蕾丝 | `settings-pixel.css:74-85` |
| ② | 卡片折叠标题（"显示设置"/"个人资料外观"）单调 | 像素窗口标题条：`#2f2552` 底 + 下沿 1px ink + 顶沿 1px 高光；左侧 24×16 像素蝴蝶结（`--jk-mask-s6`）；标题条内下沿波瓣蕾丝 | `:91-99` |
| ③ | "直角改花边/角" | 卡片 + 导航四角改 2px 阶梯缺角（`--jk-px-cut`），并把原有 12 处直角 / 圆角全部归零；蕾丝边用 `--jk-mask-s1-s`（扇贝波瓣 16×8）平铺 | `:74`、`:91`、`:76`、`:99` |
| ④ | 分段组（背景/个人资料特效/头像框/名牌主题）丑、分不清 | 未选 = `#201936` 暗面 + 凹陷 bevel + `#b9add9` 字；选中 = `#ffb8e6` 亮粉面 + 1px ink 框 + `inset 2px` bevel + ink 字；hover = `#4a3784` 面；分隔条 2px ink | `:62-69` |
| ⑤ | （随 ④）分段组圆角 | 组、组内项、项的 `::before` 三处 `border-radius:0`，分组缝由 2px ink 分隔条提供 | `:62-64`、`:68` |
| ⑥ | 步进器"− 60 +"像素化 | 凹槽数值框 `#120d22` + 凹陷 bevel + `clip-path` 缺角；两个 20×20 立体方块按钮（`#cdb0e8` 面 + `#fdf4ff`/`#7a3f6d` bevel，hover `#e3cbf2`，`:active` 反向 bevel）；lucide 图标隐藏，改用 8×8 像素 − / + mask | `:43-52` |
| ⑦ | Switch（用户选定"A 缺角卡带"） | 32×16（sm 24×12）；2px ink 外框阶梯缺角 + 内侧顶沿下沉 2px；关 = `#4a3784` 轨道 + `#cdb0e8` 方块钮在左；开 = `#ff7fcf` 轨道 + `#ffb8e6` 钮在右（带 6×6 像素心）；钮 bevel；`steps(2)` 位移；disabled 降对比；`focus-visible` 深/粉可读框 | `:19-36` |

## 2. 源码证据（主应用只读快照）

- Switch：`src/ui/shadcn/switch.tsx:19` root = `data-checked:bg-primary data-unchecked:bg-input data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] rounded-full border border-transparent … after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 data-disabled:opacity-50`；`:26` thumb = `group-data-[size=default]/switch:size-4 … data-checked:translate-x-[calc(100%-2px)]`。
- 分段组：`src/ui/shadcn/toggle-group.tsx:34-42`（outline 变体合并边框 + 分隔条）；`src/ui/shadcn/toggle.tsx`；`src/lib/segmented-control.ts:3-14`（`sm:h-7.5…`、`[&_.lucide]:text-muted-foreground`、`[&_.lucide:not([class*='opacity-'])]:opacity-[0.576]`）。
- 步进器：`src/ui/shadcn/number-field.tsx:50`（group）、`:64-80`（decrement/increment，含 `pointer-coarse:after:*`）、`:88-96`（input `h-8.5 leading-8.5 … text-center tabular-nums`）。Base UI SSR 自带 `aria-label="Decrease"/"Increase"` → 隐藏 lucide 图标不损失无障碍名。
- 设置页作用域钩子：`src/features/settings/SettingsPage.tsx:71-91`，其中 `:77` 是 `src` 内**唯一**带 `w-44` token 的 `TabsList`；`ToolsPageContent.tsx:825` 与 `SidePanel.tsx:502` 都是 `w-full`（后者本就用 `[&>[data-slot=tab-indicator]]:hidden`）。
- 设置卡片：`src/features/settings/components/SettingsCard.tsx:50`（header `p-0`）、`:58`（trigger `rounded-t-xl px-4 py-2.5 transition-colors`）；`src/ui/shadcn/collapsible.tsx`（`collapsible` / `collapsible-trigger` / `collapsible-content`）。
- 已有主题重叠：`../runtime/windose-runtime.css:11`（`[data-slot="tabs-tab"]` 字体）、`:70`（active 用 `--wd-pink`）、`../runtime/window-chrome.css` 无 card/tabs 规则；`theme.css` 中 `switch-thumb` 命中 0 次。

## 3. SSR 实测事实（`checks/r4-settings-pixel/ssr-probe.txt`）

- Switch：`<span role="switch" tabindex="0" data-slot="switch" data-size=…>` + `data-checked` / `data-unchecked` / `data-disabled`；thumb `<span data-slot="switch-thumb">` 同步携带 `data-checked`/`data-unchecked`；真 `<input type=checkbox>` 在 root 之外的隐藏兄弟节点。
- ToggleGroup：默认导出即组件本身（`req('@base-ui/react/toggle-group').ToggleGroup`，无 `.Root`）。组 `data-variant/data-size/data-orientation`；项 `<button data-slot="toggle" data-pressed>`；分隔 `<div data-slot="separator" role="separator">`。`data-pressed` 由状态驱动，`aria-pressed` 属性写法无效。
- Tabs：`data-slot="tabs" data-orientation="vertical"`；tab `data-slot="tabs-tab" data-active`；list 上**没有** `value` 属性。
- NumberField：`number-field` / `number-field-group` / `-input` / `-decrement` / `-increment`。
- `tooltip.tsx:26-28` 会把 trigger 设成 `data-slot="tooltip-trigger"`，`ToolbarControls.tsx:350-362` 就把 `ToggleGroupItem` 包在 `TooltipTrigger` 里 → 本文件对组内项一律用 `:is([data-slot=toggle],[data-slot=tooltip-trigger])` 兜底（fixture 中已实测命中 `#ffb8e6`）。

## 4. 实测数值（Chromium，DPR1，等 `transition` 结束后再测）

Switch：关 = 32×16 / radius 0 / bg `rgb(74,55,132)` / shadow `ink 0±2px,±2px 0` + `inset 0 2px`；钮 12×12、`bg rgb(205,176,232)`、`translate:0px`、左缘距 root 2px。开 = bg `rgb(255,127,207)`、钮 `rgb(255,184,230)` + `background-image`（6×6 心）、`mask-size` 不适用、`translate:16px`、左缘距 root **18px**。sm：24×12 / 钮 8×8 / `translate:12px` / 左缘 **14px**。disabled：`opacity .5` + `grayscale(.4) saturate(.5)`。root `transition:none`（不抖动，位移交给钮的 `0.12s steps(2)`）。
焦点：switch `2px solid rgb(255,127,207)` offset 2px + ink 框阴影；导航项 `2px solid rgb(255,127,207)` offset −2px（选中项为 ink）；步进按钮 `2px solid rgb(22,17,42)` offset −2px；分段项 `2px solid rgb(255,127,207)` offset 1px；`number-field-group:focus-within` `2px solid rgb(255,127,207)` offset 1px。
导航栏：bg `rgb(32,25,54)`、border `1px rgb(108,92,224)`、radius 0、padding `3px 3px 12px`、`clip-path` 生效、bevel 双色、`::after` 蕾丝 `mask` true / `mask-size 16px 8px` / `position:absolute` / `pointer-events:none` / h 8px；`tab-indicator` display none；选中项 bg `rgb(255,184,230)` + 字 `rgb(22,17,42)` + border `1px rgb(22,17,42)` + bevel；图标 `color:inherit`/`opacity:1`；hover bg `rgb(74,55,132)`。
卡片：border `1px rgb(108,92,224)`、radius 0、bg `rgb(32,25,54)`、`clip-path`、`box-shadow:none`；header bg `rgb(47,37,82)` + 下沿 `1px rgb(22,17,42)` + `inset 0 1px #fdf4ff`；content radius 0。标题条 `padding-left:36px`；蝴蝶结 `::before` 24×16 @ `left:7px`、`pointer-events:none`；蕾丝 `::after` h 8px @ bottom、`pointer-events:none`。
**不遮文字（数值证明）**：标题文字 `top 75 / bottom 94.25`，蕾丝带 `top 96.25 / bottom 104.25` → `laceOverlapsText: false`（净空 2px）；导航蕾丝同理 `railLaceOverlapsFirstTab: false`（末项 bottom 179，栏底 192）。
命中测试：`elementFromPoint(ON钮中心)` = `switch` → 钮与装饰伪元素不吃点击（root 的 `after:-inset-x-3/-inset-y-2` 扩大热区被保留）。
**作用域泄漏检查（同一 fixture 内 `w-full` 的 Tools 栏与工具卡片）**：栏 bg 仍是主题旧值 `rgb(74,55,132)`、border 0、radius 2px、无 `clip-path`、无蕾丝；卡片 border 0 / radius 2px / bg `rgb(42,33,71)` / header 透明且保留点线底边 / content radius 6px —— 设置页装饰**未外溢到工具页**。

## 5. 关键取舍（可被 Leader 推翻）

1. **蕾丝用 55% 透明度**（`rgb(217 127 198/.55)`）。1:1 实色 `#d97fc6` 在 fixture 里一屏 8 张卡片时太抢眼；衰减后仍可辨为粉色蕾丝。想回到实色只改两条规则的 `background-color`。
2. **四角用"阶梯缺角"而非 mask 花角**。`clip-path` 成本远低于 4 层 mask，且不会与 `box-shadow` 打架（缺角会裁掉外阴影，故这些元素一律改用 inset bevel + 1px 边框）。
3. **蝴蝶结/像素心用"原生 1:1 尺寸"**。蝴蝶结取现有 `--jk-mask-s6` = 24×16（不用 32×20 缩到 24 会插值发糊）；ON 钮的心是专用 6×6 data URI，因为现有 `--jk-mask-s7-s` 是 12×12，缩到 6px 会糊。
4. **步进器保持 `w-full`（未收窄）**。全应用 104 处 `NumberField` 全是默认尺寸、无 `size=sm|lg`；保持满宽 = 零布局风险，与用户截图里的参考外观一致。
5. **滚动/进度/骨架不在本文件**（属 `pixel-controls.css` 的职责），本文件不碰。

## 6. ⚠ 与 `pixel-controls.css` 的硬冲突（必须由 Leader 决策）

`../runtime/pixel-controls.css:4-15` 实现了**另一套 Switch**（40×18 凹槽 + ON/OFF 灯字 + 创可贴/爱心钮），而 `research/pixel-controls-r4.md` 结尾写的是"以本文件为准、删除 settings-pixel.css 旧 Switch 规则"——**方向与用户决定相反**：用户已选定"A 缺角卡带"（即本文件的 32×16 方案）。

实测（把两个文件按 `pixel-controls.css` 在前、`settings-pixel.css` 在后注入同一 fixture）：

```
rootW 32 / rootH 16 / thumbW 12 / translate 16px        ← 几何是我的方案赢
[data-slot=switch]::before  content:"" 12px×5px 有背景图  ← 仍然渲染（它的 ON/OFF 灯字）
[data-slot=switch-thumb]    background-image ≠ none      ← 仍然渲染（它的创可贴图）
```

原因：我只声明了 root 的尺寸/底色/阴影与**开态**钮的 `background-image`，没有声明 root 的 `::before`、也没有清掉**关态**钮的 `background-image`，于是这两个属性被它的规则接管 → 两个方案会**叠加成一团**。

处置建议（二选一，不要同时保留）：
- **推荐**：保留本文件的 Switch（= 用户选定的 A），删除 `pixel-controls.css` 的 4–15 行 Switch 段（其 `--pc-*` 上下左右箭头 data URI 与滚动条/Progress 毫不相干，可留着），并同步修订 `pixel-controls-r4.md` 的结论。
- 或者：反过来删掉本文件的 `:root --jk-px-sw` 与 `:19-36` Switch 段，全应用改用它的 40×18 方案（但这就违背用户选择，且 40px 宽会挤紧凑设置行）。
无论哪种，只要两个文件同时进入 `build-runtime.mjs`，都**必须**保证 `settings-pixel.css` 在 `pixel-controls.css` **之后**；否则连"我的几何"都会输。

## 7. 字节与接入

| 项 | 字节 |
|---|---|
| `theme.css`（现状，未含本文件） | 975 416 |
| + 本文件 | 986 722（余量 61 854） |
| + 三个兄弟 R4 文件（8 391 / 6 311 / 5 652） | 1 007 076（余量 **41 500**，仍 < 1 MiB） |

`build-runtime.mjs:43` 的 `parts` 数组**目前不含**本文件（也未含三个兄弟文件），需 Leader 追加；顺序建议 `… → fonts-pixel-body.css → pixel-controls.css → side-panel-r4.css → feed-badges.css → settings-pixel.css`（本文件放最后，冲突时以它为准）。

## 8. 风险 / 需 Leader 实机复测

1. **`w-44` 作用域钩子是类名 token 依赖**：`SettingsPage.tsx:77` 一旦改宽度（或 Tailwind 产出顺序变化让 `w-fit` 压过 `w-44`），设置页卡片/导航装饰会**整体失效**（不会报错，只是不生效）。建议实机改一次 `w-44` 反证。
2. **全局控件影响面**（本文件对 Switch / outline 分段组 / NumberField 是全局的，用户已授权）：`switch.tsx` 44 处引用、`toggle-group` 26 处（其中 24 处 outline、1 处 default 不受影响）、`number-field` 16 文件 104 处。fixture 已覆盖 default/sm/disabled/focus 与 default 变体不泄漏，但**对话框、侧栏、工具栏里的实例未逐一实机验证**。
3. **ON 心 6×6 在 DPI 125%/150% 下可能被缩放插值**（CSS px 非整数设备像素）。若实机发现糊，改为 12×12（用 `--jk-mask-s7-s`，32px 轨道放得下）。
4. **蕾丝 16×8 扇贝在 125% DPI** 同理（8px × 1.25 = 10 设备像素，仍为整数，风险低；150% = 12，安全）。125%/175% 之外的缩放需目视。
5. `focus-visible` 的颜色/宽度在 fixture 实测正确；Windows WebView2 的 `:focus-visible` 触发时机（鼠标点击是否也出现）**未验证**。
6. `prefers-reduced-motion` 只关掉了钮位移过渡；`windose-runtime.css` 里其它像素动效不在本文件职责内。
7. 本文件**不声称**任何实机通过结论；`theme.css` 需重建 + 刷新 Web GUI 后才能看到效果。

## 9. 复现

```bash
cd design-specs/jirai-kei-theme/runtime/checks/r4-settings-pixel
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node ssr-probe.mjs   # SSR 标记证据
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node verify.mjs      # 断言 + 截图 + r4-measure.json
```

fixture 标题栏标注 `FIXTURE / NOT WINDOWS`，示例文本为中性的"显示设置 / 显示房间 ID / 玩家信息"，未复制用户截图、无真实好友名。截图：`r4-settings-pixel.png`（全页）、`-crop`、`-switch`、`-segmented`、`-stepper`、`zoom-switch.png`(6×)、`zoom-stepper-glyphs.png`(16×)、`zoom-rail.png`(4×)、`zoom-segmented.png`(4×)、`zoom-settings-card.png`(3×)。
