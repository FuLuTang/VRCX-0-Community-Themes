# Windose × 地雷系：实机返工 R2 / R3

## 最新：R3 已部署，待实机复验

按用户后续反馈，真实顶底栏变粉、窗口三按钮有像素框，移除中间假抬头；底栏蕾丝朝上并预留8px安全带；分组下方10px进入虚拟行测量。内部普通文字改像素字体（用户新明确要求，取代R2隔离body的策略），保持字号/行高，代码与JSON等宽。扩展Fusion子集19,848码点，最终CSS975,416B，未超过1MiB。

Leader收回三份独立subagent结果后，另外修正Tooltip合成后的槽名、按钮状态规则优先级、分组inline基线1px、全宽/窄模式底栏安全空间、灰字对比度及字体子集覆盖。R3四文件已更新到同一Windows目录，哈希一致。没有使用teammate，不以subagent自报替代验收。

[当前R3检查点](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/windows-preview-checkpoint.md>) / [字体覆盖实测](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/body-font-report.json>)。下面九节为R2阶段记录，保留历史；其中“用户正文保留应用字体”的旧规则不再作为R3要求。

## 1. 元信息与范围

2026-10-12。对象：VRCX-0 社区 CSS 主题；范围：用户提供的五组 R1 Windows 实机截图。目的：修复遮字和真实 DOM 挂空，保留应用信息结构而不是再次制作另一套虚构界面。情绪：深紫像素桌面、紫黑服装细节、粉色标签与吊饰。

R1 用户截图证明正式路径能被应用加载，也证明还原不完整。R2 已更新到用户指定 Windows 目录，四文件 SHA-256 与本机一致；**没有收到 R2 实机截图，不能签为实机通过**。

```text
C:\Users\tangh\Documents\GitHub\theme-preview\jirai-kei-theme
```

## 2. 一句话定位

在真实的导航、虚拟表和两栏资料弹窗上落地“像素桌面框架＋地雷系缎带/系带/心形”，不为模拟图新增不存在的对话、按钮或数据卡片。

## 3. 设计令牌与依据

令牌来自当前[应用适配 CSS](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/windose-runtime.css>)，不是从截图目测伪造：

```css
--wd-desktop:#16112a;
--wd-window:#201936;
--wd-raised:#2a2147;
--wd-title:#2f2552;
--wd-title-active:#d97fc6;
--wd-frame:#6c5ce0;
--wd-square:#ffb8e6;
--wd-mint:#6fe3d3;
--wd-text:#f2ebff;
--wd-muted:#b9add9;
--wd-pink:#ff7fcf;
```

[构建报告](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/build-report.json>)：CSS 242,802 B，预览 33,896 B，均低于应用/仓库硬限。预览已改为带“NOT WINDOWS”标识的源码结构测试页，不用旧三列弹窗示意图冒充当前主题。

## 4. 实机与模拟稿差异、落地规则

| 用户反馈 | 根因 | R2 落地 |
|---|---|---|
| 白色方块波浪遮字 | s3 SVG 无固有尺寸，标题背景又没写 background-size，放大成大块 | 主标题和所有卡头移除该背景，卡头用细虚线边界 |
| 好友分组胶囊未还原 | `.ghead` 仅存在于示意图，没有映射真实 ListSectionHeader | 真 Collapsible 按钮加圆角/粉色错位阴影，保留按钮 28px 和虚拟行契约；有计数、无计数均覆盖 |
| 中列背景遮住绘画 | 表根就地覆盖主题变量并绘制不透明 background | 仅主区表根背景透明，table-surface 仍为不透明色，保护 sticky 操作列、表头、hover/展开底色；星点及低对比心形可透出 |
| 弹窗模拟是横幅＋三列，实机是两栏 | 模拟稿采用了并不存在的组件结构 | 尊重左资料卡＋右信息/标签结构；系带/蕾丝移到真实 4:3 图片边缘，宝石心移到真实标签栏 |
| 怪兔子无法识别 | 单色低分辨率轮廓丢失辨识细节 | 移除活动背景中的兔子，复用原创蝴蝶结＋双线心形组成可读吊坠；低窗口隐藏大装饰，保留背景格纹 |

CSS 并非普遍不能重排网格，但主题不应该为了模拟稿强制改变真实数据结构、构造整宽横幅或虚拟底部按钮。模拟稿的三列卡与底部操作区不属于本阶段“已还原”内容。

## 5. 排版与组件状态

Chrome 使用 12px 的 WD Pixel / WD Pixel CJK；body、昵称、简介、备注保留应用字体。实际 WOFF2 覆盖已复核：Silkscreen ASCII 子集 95 个请求字符，Fusion 子集 1,642 个；计数排除清单文件换行符。

Tabs 实际是 `data-slot="tabs-tab"`、`data-active`，不是旧假设的 tabs-trigger/data-state。R2 修正高亮和字体规则。真实资料头像是 Button，不是通用 Avatar；另接图片刀口与像素环，已有 VRChat 自选头像装饰（border-0 分支）优先。

好友标题：默认胶囊＋阴影，hover 用 selected 色，展开/折叠及箭头仍由应用管理，计数和箭头不移除。测试覆盖“已分组的好友”“同一房间（无计数）”“在线”；240px 侧栏计数与箭头不溢出。

## 6. 交互、滚动与动效

新增图片边缘装饰均 pointer-events:none，不阻塞图片点击。虚拟列表行、spacer 的高度和 translateY 坐标不改，不为装饰制造假空白。列表很长时未必有可展示大图的空白，这是数据视图的正常边界。

表根透明不等于全表变量透明，后者会造成横向 sticky 操作列穿透。弹窗内部表格不在此透明规则的作用域。

现有 START/SOCIAL/VRCX-0 标题带属于列表之外的外壳标题，不是插入虚拟行的块；R2 不因审查报告误判而移除已经显示正常的框架。原模拟稿吊饰/闪光动效尚未完整迁移，此处不声称已完成。prefers-reduced-motion 规则保留。

## 7. 体验与验证证据

[源码结构回归测试](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/verify-real-hooks.mjs>)载入应用已有编译 CSS，但使用中性示例 DOM，不是正在运行的 VRCX：

- 胶囊 border-radius=999px，阴影 3px 3px，按钮实测 28px。
- 表根 rgba(0,0,0,0)，sticky 操作面 rgb(32,25,54)，表头 token #2a2147。
- 活动标签 rgb(255,127,207)，实际标签字体生效。
- 图片系带、下缘蕾丝、标签栏心形、头像像素环全部有 mask；装饰 pointer-events=none。
- 760px 窗口隐藏大吊饰，240px 侧栏标题计数/箭头容纳正常。
- 中英字体 loaded；已有图标 mask 有效且原 SVG 子图形隐藏。

[回归报告](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/source-hooks-report.json>) / [Windows 部署报告](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/windows-deploy-r2.json>)。

部署采用同目录临时文件、哈希校验及原子单文件替换；最终仍只有四个主题文件，没有遗留上传临时文件。主应用只读，无提交/推送，无用户配置修改。

## 8. 风格 DNA 与漫画参考

重新读取了用户[漫画参考](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/user-noa-senpai-cover-ref.jpg>)。可见事实：紫黑格纹服装、黑色波瓣边、紫粉蝴蝶结、心形扣件/吊坠、粉色像素爱心、薄荷圆点、轮廓清晰的兔脸徽章、胶囊文案与复古窗框。

迁移规则：
1. 格纹放在低信息背景，不铺在正文上。
2. 蝴蝶结、心形必须有可识别轮廓，不用抽象色块冒充吉祥物。
3. 蕾丝和系带放到边缘，留出头像中心与文字空间。
4. 紫粉主辅色和黑底是服饰气质；薄荷只作少量边线，不代替状态色。
5. 不抠漫画人物/兔脸原像素；新吊饰组合来自仓库原创几何素材。
6. [原创吊饰](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/ribbon-heart-charm.svg>)用明确的蝴蝶结与双线心形表达服饰扣件，而非动物。

这是对用户参考的定点拆解，不是声称已完成外部网站大规模调研。

## 9. 后续实机复验与复用

重新加载后主题名应含 `Local Preview R2`，版本为 `1.2.0-preview.2`。若开了本地预览监视可能自行读取，但监视是否开启尚未确认，不能保证热更新。

需要用户再给主视图/分组标题、资料弹窗两张实机图，重点检查：白块是否消失；胶囊与计数是否正常；数据区域是否透出背景但 sticky 列不穿透；自选头像装饰是否共存；吊饰辨识度和实际缩放。若图片边缘装饰太强，再调边宽与亮度，不把图像中心或用户文字当装饰宿主。

复用本方案时先检查真实 slot/state；不可仅凭组件导出名推断 DOM 属性，也不可把 mockup 的 `.win/.ghead/.ucard` 当成应用选择器。新图案一律显式设尺寸，并用编译 CSS 加 DOM fixture 检测，再交真实 WebView 复验。
