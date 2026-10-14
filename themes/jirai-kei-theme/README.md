# Jirai Kei · Noir Ribbon

黑缎骨架、局部镂空蕾丝、缎带缝线、领口边与小宝石结。不只是黑粉换色：细节落在应用真实组件 hooks，数据行保持安静。GPL-3.0-only；原创 CSS、SVG 和静态骨架，作者 FuLuTang。

## 1.1.0 / detail draft

| 非配色细节 | 真实 hook / 视觉预算 |
| --- | --- |
| 1. 镂空蕾丝：双线、菱形孔与波瓣，不再整片铺花 | `sheet-header`、dialog/alert-dialog 底部或 footer 原生 padding；D2 |
| 2. 缎带织纹＋可见虚线缝边 | `sidebar-menu-button[data-active="true"]`；D1 |
| 3. 卡片内嵌双边裁缝线 | `card`；D1，不改宽高/内边距 |
| 4. 领口式框＋切面宝石结、局部标题字距 | `sheet-popup`/`sheet-header`、`dialog-content`/`alert-dialog-content` 与真实 title/footer；D2 |
| 5. 头像外侧双圈金属框 | `avatar`，排除所有 table-row；D1，不滤色/裁剪/替换原图和状态徽章 |
| 6. 中性徽章的珐琅高光 | `badge[data-variant="secondary"]`，排除数据行与 destructive；D1 |
| 7. 小型复选框嵌边与选中斜面 | BaseUI `checkbox[data-checked]`/`[data-indeterminate]`；保留原 check icon，错误有外侧红轨 |
| 8. 开关凹槽、珠光 thumb | BaseUI `switch`/`switch-thumb`；保留原 transform、大小和命中区域 |
| 9. 标签页缝边与选中轨 | BaseUI **`tabs-tab[data-active]`**，兼容 vertical；不是仅 `tabs-trigger` |
| 10. 精细交互收尾 | 2px 外侧 focus rail / 3px offset；细原生滚动条，非自制滚动交互 |

此外，错误 toast 使用真实 **`toast-viewport > [data-type="error"]`** 红轨；抽屉使用 **`sheet-popup`**。disabled、danger、错误文字、关闭、取消与恢复入口均不隐藏、不阻断。

### 装饰密度 / 安全边界

- **D0**：好友表格、日志和数据行无蕾丝、织纹或头像外框。保留 VRChat 状态颜色、hover/selected 和原始图像。
- **D1**：导航、卡片、头像、徽章、控件仅边缘/材质，不全屏花纹。
- **D2**：sheet/dialog 的局部领口和蕾丝边；主要 dialog 一个小宝石结。
- 当前主应用 `main-content` 无 padding，标题栏仅 `h-8`，因此主动撤掉旧版画布蕾丝与标题栏 bow，避免静态预览看着安全、实机却压住文字。dialog 原生 `p-4` 只有 16px；结高 12px、领口高 12px、蕾丝高 10px；有负 margin footer 时将底部装饰转移到 footer 自己的 `p-4`。
- CSS 不新增伪元素/DOM，不改业务 JS、布局、控制尺寸或 pointer-events。背景装饰不进入无障碍树；预览 check SVG 显式 `aria-hidden="true"`。继承正文/CJK字体，只主要弹窗标题增加 `.025em` 字距。

## 关闭装饰 / 恢复

在应用的本地自定义 CSS 中、主题之后覆盖：

```css
:root { --jirai-decoration: 0; } /* 1 = 开，0 = 关 */
```

会关闭 SVG、织纹、缝边、外框和徽章/控件高光；不会关掉选中标记、错误、focus、状态或恢复入口。此为 CSS 开关，**没有新增应用设置页**。细滚动条可另设 `--jirai-scrollbar-width: auto`（Firefox/标准属性；WebKit 的 8px 宽度规则需自定义 CSS 覆盖）。hover 120ms；`prefers-reduced-motion` 与应用 `.reduce-effects` 均取消主题控制过渡。系统 forced-colors 保留系统边框/焦点色。

## 使用 / 实际验证状态

下载上游 [DevKit](https://github.com/Map1en/VRCX-0/actions/workflows/package-devkit.yml)，选择**当前主题目录**，不要选择整个主题仓库。固定暗色/强调色；`remoteAssets: false`；无网络字体、外部图片、`@import` 或 `@apply`。

**仍是草稿：`testedWith: 0.0.0-unverified`，不是实机验证版本，也不是 PR-ready。**

[可交互静态骨架](../../design-specs/jirai-kei-theme/preview.html)真实加载[主题 CSS](theme.css)，显式标注 **not live VRCX-0**。它模拟 BaseUI 属性，不运行应用或 BaseUI JS；Esc/Tab 演示使用浏览器 native dialog，只能证明样例而不能证明实际 BaseUI focus trap。

- [默认预览](preview.webp)、[装饰关闭对比](../../design-specs/jirai-kei-theme/detail-decoration-off.webp)、[480px 预览](../../design-specs/jirai-kei-theme/detail-mobile.webp)、[打开 dialog](../../design-specs/jirai-kei-theme/detail-dialog.webp)。所有 WebP 实际解码，均 <256KiB。
- [最终验证记录](../../design-specs/jirai-kei-theme/team-verification.json)：完整 Draft 2020-12 manifest schema、仓库 validator、3 个 unit tests、真实 CSS 渲染、enabled text 对比 >=4.5、focus、checked/unchecked/mixed/error/disabled、tabs 键盘、mock toast recovery、取消/关闭/Esc、装饰/主题恢复、reduced motion、forced-colors 和 480px 无横向溢出。早期 [验证快照](../../design-specs/jirai-kei-theme/verification.json)保留原图记录。
- [真实前端实测数据](../../design-specs/jirai-kei-theme/live-ui-audit.json)：2026-10-10 在真实 VRCX-0 前端（`npm run dev` + Chromium）复测禁用态可读性，已勾选复选框的勾与禁用主按钮均为 3.18:1，与默认应用基准 3.32:1 同级，无需改动。注意必须在每个主题独立加载的页面中测量，同一页面叠加两份主题 CSS 会得到假象数值。
- 对比度按 computed solid base colors 计算；局部材质不压文字。disabled 沿用应用 opacity（WCAG豁免），不声称禁用字也 >=4.5。
- **未验证**：真实 DevKit/应用 DOM、portal 堆叠、虚拟列表、页面专用 class 覆盖、真实缩放/高 DPI、OS scrollbar、macOS/Windows titlebar、BaseUI 的运行时焦点/状态生命周期。自定义组件若取消默认 padding，应关装饰；hooks/token 不是永久 API。

## 调研 / 原创资源

复用已保存的 [10来源跨语种研究与限制](../../design-specs/jirai-kei-research.md)，不重新编造服饰事实。[设计规格](../../design-specs/design-spec-jirai-kei-theme.md)记录证据与原创软件适配数值。参考黑缎/系带、局部镂空、宝石结与领口构造，不使用血迹、人格污名、未授权角色图、品牌标志或全局 icon 替换。

原始可审查 SVG：[宝石结](../../design-specs/jirai-kei-theme/ribbon.svg)、[镂空蕾丝](../../design-specs/jirai-kei-theme/lace.svg)、[领口](../../design-specs/jirai-kei-theme/collar.svg)，均嵌入 CSS data URL，无远程请求。

## 版本记录

- **1.1.0 draft**：十组非配色细节、实际 BaseUI slot 修正、装饰开关、真实安全 padding、交互静态预览和扩展验证；仍非实机测试。
- **1.0.0 draft**：黑粉 tokens、初始蕾丝边/导航缎带/卡片双边与原创宝石结。

未提交、未推送；根目录目录表和其他主题不改。
