# R5 动效层研究与验证

## 范围
`runtime/motion-r5.css` 是最后追加的可选层，依赖现有窗口装饰/控件规则，并使用多色素材接口 `--r5-bow`、`--r5-star`、`--r5-heart`、`--r5-ribbon-pendant`（素材见 `original-assets/r5/assets-r5.css`）。不新增 DOM、不替换文字、不选择虚拟列表行，不更改行高或 `translateY` 列表定位。关键帧只用 `steps()`，位置改变量为整数 CSS 像素；不动画尺寸、边框、布局属性。伪元素皆为 `pointer-events:none`。

## 源码挂载点 / 伪元素占用审查
已在写 CSS 前搜索 `runtime/*.css` 的 `::before` / `::after` 使用情况，并逐条对照源码：

- **标题栏像素心：** 主应用 `src/components/layout/AppTitleBar.tsx:90-96` 输出 `.vrcx-0-titlebar[data-app-titlebar]`；品牌文字在 `src/components/layout/AppMenuBar.tsx:136`。`runtime/window-chrome.css:257-269` 已有品牌 `::after` 的 12px 像素心，作为此规则唯一挂载点。动画只在 Y 轴上下跳 1px，品牌文字本身不做 transform/scale/rotate。
- **底栏蕾丝流：** `src/components/layout/status-bar/StatusBarFooter.tsx:351-373` 输出 statusbar surface。`runtime/window-chrome.css:151-163` 的 `::before` 是已有蕾丝，且 `::after` 留给 RGB 模式；仅对现有 `::before` 的 mask-position 做 16px 周期的位移，不抢伪元素、不改 footer 布局。
- **侧栏缎带吊坠：** 已有主题选择器 `.vrcx-0-sidebar-surface` (`runtime/windose-runtime.css:44-48`) 用 background-image 铺底图，但检索未发现它的伪元素占用；新增单个 `::after`，用原画 `--r5-ribbon-pendant`。基于 `position:absolute`，只上下整数 2px。
- **主区/侧栏星屑：** `.vrcx-0-main-content` / `.vrcx-0-side-panel` 的背景装饰存在于构建主题（主题 CSS 约 635、642 行）。检索确认二者 `::after` 可用；各自一个多层小组图（`--r5-star` / `--r5-heart` / `--r5-bow`），以不同周期做 opacity 闪烁，不落到列表子元素。
- **选中页签闪光：** `src/ui/shadcn/tabs.tsx:85-95` 的组件输出 `data-slot="tabs-tab"`，Base UI active 是 `data-active`。仅作用于普通 tabs 中的活跃项。右侧 side-panel rail 是例外：`SidePanel.tsx:499-515` 使用 Tooltip 包裹后 slot 被覆盖，且其 `[role=tab]` 的 `::before` / `::after` 已被 `runtime/side-panel-r4.css:110-134` 用作拼接边框，选择器避开该 rail。
- **开关心跳：** `src/ui/shadcn/switch.tsx:14-28` 输出 `data-slot=switch` 和子级 `data-slot=switch-thumb`。`runtime/pixel-controls.css:4-9` 占用 root `::before` 显示 ON/OFF 灯；Switch 组件 root 的 `::after` 是点击热区（组件 19 行 utility 类）。只在已 checked thumb 上用 `::after` 叠多色小心，hover 时弹 2px；不覆盖点击区。
- **进度/加载：** `src/ui/shadcn/progress.tsx:13` 确认进度槽挂点；构建主题 `runtime/pixel-controls.css:38-40` 已将 `[data-slot=progress-indicator]` 画成像素条，只流动背景位置。`src/ui/shadcn/spinner.tsx:8` 确认 spinner；以 `steps(8)` 像素节拍旋转。
- **对话框渐显：** 构建主题对话框内容的真实 slot 为 `[data-slot=dialog-content]`（`windose-runtime.css:61-67`）；仅在 `[data-open]` 上作 opacity steps 渐显，无 transform/布局改动。

未使用状态栏其他伪元素、switch root 伪元素或虚拟列表行。素材变量是 `url(data:image/svg+xml,...)` 图像，不作为颜色值使用。

## 动效清单
| 动效与位置 | 选择器 | 帧 / step | 周期 | 属性/幅度 |
|---|---|---:|---:|---|
| 标题栏品牌旁 12px 心跳 | `.vrcx-0-titlebar[data-app-titlebar] .vrcx-0-brand::after` | 4 holds | 3.2s | 整数 Y 位移 1px；文字静止 |
| 底栏向上蕾丝流动 | `.vrcx-0-statusbar[data-vrcx-0-surface='statusbar']::before` | 4 | 8s | mask-position 16px 周期 |
| 左导航缎带吊坠轻摆 | `.vrcx-0-sidebar-surface::after` | 3 | 4.8s | 多色 `--r5-ribbon-pendant`，整数 Y 位移 2px |
| 侧栏背景星屑组闪烁 | `.vrcx-0-side-panel::after` | 4 | 5.2s | 多层星/心/蝴蝶结图，opacity |
| 主区背景星屑组闪烁 | `.vrcx-0-main-content::after` | 4 | 6.4s | 多层星/心图，独立相位 opacity |
| 活跃页签像素闪光 | `[data-slot="tabs"]:not(.vrcx-0-side-panel-rail) [data-slot="tabs-tab"][data-active]::after` | 4 | 6s | 多色 star 图片，整数 X 位移 12px |
| 开关钮上心形弹跳 | `[data-slot="switch"]:hover [data-slot="switch-thumb"][data-checked]::after` | 3 | 700ms 单次 | 整数 Y 位移 2px，仅 hover |
| 进度格纹流水 | `[data-slot="progress-indicator"]` | 5 | 1.8s | background-position 10px |
| 像素加载旋转 | `[data-slot="spinner"]` | 8 | 1s | transform rotate 360°，steps 离散 |
| 对话框像素渐显 | `[data-slot="dialog-content"][data-open]` | 4 | 120ms 单次 | opacity |

10 个有明确场景的动效；低频、低幅，避免长列表逐行动画。所有实际设定在 `@media (prefers-reduced-motion: reduce)` 中强制 `animation:none !important`。

## Playwright 验证
使用任务要求的浏览器与**只读主应用已编译 CSS**搭建本地 fixture：应用 `dist/assets/index-Cckb3vVG.css`、`dist/assets/App-C2mIqNXI.css`，构建主题 `runtime/preview-package/jirai-kei-theme/theme.css`，R5 素材 CSS，以及 `motion-r5.css`。fixture 页面明确标注 **NOT WINDOWS**，文件在 `runtime/checks/r5-motion/fixture.html`。

- reduced-motion：7 个新增伪元素的 computed `animation-name` 均为 `none`；computed `pointer-events` 均为 `none`。
- 正常偏好：9 个目标的 computed animation-name 对应预期 `r5-*` 动画，PASS。
- reduced-motion 下间隔 350ms 比对 `.stage`、titlebar、sidebar surface、main content、side panel、statusbar 的 `getBoundingClientRect()`；全部 x/y/width/height 一致，PASS。
- 生成并目视检查了 2x DPR 的 5 帧截图：`runtime/checks/r5-motion/frame-1.png` 至 `frame-5.png`。运行记录见 `runtime/checks/r5-motion/validation.txt`。由于 fixture 是静态 DOM 模型，截图仅核对主题 CSS 的表现，不冒充真实 Windows 客户端截图。

## 预算
CSS 文件大小约 4.8 KB，低于 20 KB 上限。