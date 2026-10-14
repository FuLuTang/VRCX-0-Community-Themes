# Jirai Kei · Noir Ribbon — Design Spec 1.1.0 draft

## 1. 元信息 / 证据范围

对象：VRCX-0 桌面工具的**CSS主题层**，不是新应用/布局重设计。情绪关键词：暗甜、精细裁缝、局部镂空、安静数据。原跨语种研究沿用 [10来源与核实边界](jirai-kei-research.md)，没有重新访问来源，也没有把服装商品文字当成网页 CSS 测量。

实现证据：只读当前应用的 [BaseUI tabs:94](../../VRCX-0-jirai/src/ui/shadcn/tabs.tsx#L94)、[checkbox:11–23](../../VRCX-0-jirai/src/ui/shadcn/checkbox.tsx#L11-L23)、[switch:16–26](../../VRCX-0-jirai/src/ui/shadcn/switch.tsx#L16-L26)、[sheet:123](../../VRCX-0-jirai/src/ui/shadcn/sheet.tsx#L123)、[toast:102–150](../../VRCX-0-jirai/src/ui/shadcn/toast.tsx#L102-L150)、[avatar](../../VRCX-0-jirai/src/ui/shadcn/avatar.tsx)、[badge](../../VRCX-0-jirai/src/ui/shadcn/badge.tsx)。这些是本地研究链接，不是主题包的运行依赖。

数值依据分两类：下述服饰迁移尺寸/颜色为**原创设计参数**；应用原生 padding/slot/state 来自已读源码，效果由真实加载 CSS 的静态 Chromium 渲染确认。未读取参考服饰图片，不编造图像观察。

## 2. 一句话定位 / 意图（推断）

黑缎感结构承载灰粉交互，在安全边缘缝入蕾丝、领口与珐琅质感，让工作台像定制衣物而不是换一层颜色；这是本方案的设计意图，不是地雷系使用者的性格结论。

## 3. 设计令牌 / 可复用资产

完整颜色与兼容 tokens 见 [主题 CSS](../themes/jirai-kei-theme/theme.css)。核心：

```css
:root {
  --background: #161219;
  --foreground: #f7eef4;
  --card: #211b25;
  --popover: #2b2230;
  --primary: #f0a8c8;
  --primary-foreground: #271722;
  --muted-foreground: #c4aab9;
  --border: #564151;
  --input: #bdb3c2;
  --destructive: #ff8899;
  --ring: #f0a8c8;
  --radius: .5rem;
  --jirai-decoration: 1; /* 覆盖为0关装饰 */
  --jirai-scrollbar-width: thin;
}
```

SVG资产：48×12原始[镂空蕾丝](jirai-kei-theme/lace.svg)，160×14[领口](jirai-kei-theme/collar.svg)，80×44[原有宝石结](jirai-kei-theme/ribbon.svg)。CSS 的 `--jirai-lace`/`--jirai-collar`/`--jirai-bow` 保存原创 SVG data URL，`--jirai-decoration`缩放实际绘制高度/阴影透明度。没有远程资源/字体，manifest `remoteAssets:false`。

尺寸：蕾丝绘制48×10px；dialog领口160×12px，sheet领口160×14px；dialog结24×12px。普通圆角8px，弹窗仍继承原应用尺寸，主题仅圆角/边缘。材质高光白色低alpha；卡片内缝为4px inset边、3px实底间隔；头像外2/3/5px三层shadow只在 portrait/card/header hooks。阴影与数值是原创软件适配，不冒称服装或参考网站CSS数据。

## 4. 布局规范 / 安全区域

主题无 width/height、padding/margin、flex/grid、position、transform、display、滚动容器替换。头像不改原图、crop、filter 或原来尺寸。静态骨架自己的响应式规则**不属于**主题。

真实源码：[dialog:74](../../VRCX-0-jirai/src/ui/shadcn/dialog.tsx#L74)与[alert-dialog:74](../../VRCX-0-jirai/src/ui/shadcn/alert-dialog.tsx#L74)是 `p-4`，仅16px；footer `-mx-4 -mb-4 p-4`。所以结位于top1px，12px高；底部领口/蕾丝占最高14px，限于原生padding。有footer时移到底部footer自身padding，避免它的负margin吞掉安全空间。[sheet-header:150](../../VRCX-0-jirai/src/ui/shadcn/sheet.tsx#L150)是p-6，存在pb-3/pb-4变体，底部蕾丝10px适配最小12px。

[main-content:843–846](../../VRCX-0-jirai/src/styles/globals.css#L843-L846)没有padding；[TitleBar:94](../../VRCX-0-jirai/src/components/layout/AppTitleBar.tsx#L94)是h-8。因而1.1.0撤掉画布上方蕾丝和标题栏bow，避免依赖样例的宽松留白。关闭按钮所在right/top strip不画结。自定义页面若主动取消这些组件padding，用户需关装饰；未经实机检查不保证其覆盖。

## 5. 排版规范

正文、次文、CJK、按钮、数字均继承应用字体/字号。没有外部fonts、blackletter、全应用花体/小字。仅 dialog-title/alert-dialog-title/sheet-title `.025em`字距及`text-wrap:pretty`；保留原语义标题和交互文案。

## 6. 十组组件细节 / 状态规格

| 细节 / selector | 外观与状态 |
| --- | --- |
| 局部镂空蕾丝 / sheet-header、dialog/alert-dialog-content、真实footer | D2；双线＋波瓣＋菱形孔。关装饰绘制高度0，不占布局 |
| 缎带织纹与缝线 / sidebar-menu-button[data-active="true"] | D1；斜面缎带＋1px虚线＋3px左选中轨；非选中不铺纹 |
| 裁缝卡 / card | D1；内嵌双边，无新增margin/padding。关装饰内线透明 |
| 领口/结框 / sheet-popup、sheet-header、dialog-content、alert-dialog-content/title/footer | D2；实际padding里画领口和结。保留close/危险/取消/确认；无伪元素层 |
| 头像框 / card/sheet-header/dialog-header中的avatar | D1；外圈不覆盖图像；排除table-row/data-vrcx-0-table-row/command-list；头像状态徽章不改 |
| 珐琅徽章 / badge[data-variant="secondary"] | D1；仅中性secondary斜高光/边光；排除数据行/command-list；不重绘destructive或状态色 |
| 小复选框 / checkbox | 正常嵌边；data-checked/data-indeterminate保留primary填色和原始check图标；aria-invalid红边＋外2px红轨。disabled opacity/hitarea原样 |
| 开关 / switch、switch-thumb | 凹槽与珠光thumb；data-checked/data-unchecked由BaseUI负责；主题不改thumb transform、尺寸或hitarea；error红轨，disabled原样 |
| 标签页 / tabs-tab[data-active] | 缝线＋2px底轨；vertical为2px左轨；非active无纹。使用真实data-active，而非Radix旧data-state/假tabs-trigger |
| 精细交互收尾 / focus-visible、原生scrollbar | 外2px焦点，offset3px；不替换滚动JS。standard thin / WebKit8px，系统overlay scrollbar可能忽略 |

错误toast用真实 `toast-viewport > [data-type="error"]` 的3px红轨；根没有toast-root。field-error维持red。表格选中/hover保持原背景语义；D0没有decorative background，所有dense行内材质控件也关背景图。checked仍有check，switch仍移动，装饰关闭不等于清除状态。

装饰是CSS背景/box-shadow，无新伪元素/DOM；不进入accessibility tree、不截获pointer、不盖点击。原应用的伪元素保持原样。预览中的纯装饰check SVG `aria-hidden="true"`。

## 7. 交互 / 动效 / 关闭

hover只120ms ease-out颜色/边框；`prefers-reduced-motion`和`.reduce-effects`对相关控件/thumb/tab-indicator取消过渡。无粒子、持续闪烁、漂浮或强光。forced-colors保留系统边与Highlight焦点。

```css
/* 在主题之后覆盖。不是新增应用设置项。 */
:root { --jirai-decoration: 0; }
```

背景尺寸为0、装饰alpha为0；功能focus/error/active/check/switch语义保留。可设`--jirai-scrollbar-width:auto`恢复标准scrollbar宽度（WebKit额外规则需另覆盖）。预览提供独立“Details”和整个theme关闭/恢复按钮；JS仅存在静态样例，不修改应用。

## 8. 风格 DNA / 可迁移原则

1. **模式**：暗结构＋边缘裁缝，而非满屏黑粉。
2. **原则**：数据D0、工具D1、主要表面D2，纹样不进入高频数据行。
3. **资产**：可审查原创SVG、可覆盖CSS变量，不借用品牌/人物图。
4. **模式**：材质给控件加层次，checked/error/disabled仍用熟悉语义。
5. **原则**：安全留白来自真实组件源码，不能拿预览padding证明实机安全。
6. **模式**：领口与细缝线代替全屏哥特尖拱/花体。
7. **原则**：正文继承字体、hover克制、焦点独立于装饰。
8. **原则**：主题无业务代码；资源离线，用户随时能退出/恢复。
9. **边界**：不把心理诊断、血迹、人格污名当风格要素。

## 9. 复用 / 验证 / 限制

[静态样例](jirai-kei-theme/preview.html)真实加载[当前CSS](../themes/jirai-kei-theme/theme.css)，明确标注not live VRCX-0。重建时沿用真实BaseUI属性；只在默认padding strip画图；不要新增应用不存在的装饰class。

证据：[桌面截图](../themes/jirai-kei-theme/preview.webp)、[关闭装饰](jirai-kei-theme/detail-decoration-off.webp)、[480px](jirai-kei-theme/detail-mobile.webp)、[native dialog](jirai-kei-theme/detail-dialog.webp)、[验证记录](jirai-kei-theme/verification.json)。实际读取截图确认缝边/头像框/领口/控件不压文字，窄屏数据行不铺花。渲染脚本独立位于`/tmp/jirai-detail-render.cjs`，使用已安装Playwright/sharp/Ajv工具，不碰Lead的临时脚本。

完整manifest JSON Schema Draft2020-12、仓库validator及3个unit tests通过。样例测试包括对比度、focus、invalid、checkbox/check/mixed、tabs键盘、toast recovery、visible disabled/danger/close、theme与decorations恢复、reduced-motion、480px无横向overflow。对比度按computed solid基底计算，enabled正文/错误/按钮/placeholder均>=4.5；disabled是应用opacity与WCAG豁免，不作>=4.5承诺。

**限制**：静态样例用JS模拟BaseUI状态，不运行BaseUI runtime；native dialog的Esc/Tab只能证明该样例。未验证真实DevKit、portal堆叠、virtual rows、主题页/登录/恢复/窗口控件、缩放、高DPI、OS scrollbar或特殊页面取消padding的情况。hooks与surface兼容token非永久API。`testedWith:0.0.0-unverified`保持草稿，绝不冒称实机测试/完美/PR-ready。未提交、未推送；根README/index和其他主题不改。
