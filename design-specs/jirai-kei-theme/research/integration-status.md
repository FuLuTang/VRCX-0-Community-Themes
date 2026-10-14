# Windose 深色：整合状态与 Leader 验收

## 最新R3（2026-10-12）

三份独立subagent已收回，Leader审查、修正并集成。真实顶底栏粉色、窗口三按钮像素框、朝上蕾丝8px与专用空隙、无中间假抬头、分组10px真实行高间距、内部普通文字像素化已接入。正文Fusion扩为19,848码点，保留源字号/行高和代码/JSON等宽。CSS975,416B、预览38,228B。已更新同一Windows目录四文件，SHA256一致；未收到R3实机截图，不签为实机通过。

[当前检查点](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/windows-preview-checkpoint.md>)。以下为R2及更早历史。

## 当前阶段：Windows 实机返工 R2（2026-10-12）

用户已提供 R1 实机截图，证明本地预览可以加载，也确认还原不足。已针对五项反馈修改并将 R2 原子替换部署到用户指定 Windows 目录；四文件 SHA-256 一致，最终无上传临时文件。CSS 242,802 B，预览 33,896 B。尚无 R2 实机截图，不能签为实机通过。

- 去掉两处标题白色放大缝线，胶囊映射真实 ListSectionHeader（含无计数的同一房间），主区表根透明但 sticky 表面保持不透明。
- 修正真实 tabs-tab/data-active，实际资料头像使用 Button，系带、蕾丝及小心形移到真实宿主；保留两栏布局和用户自选头像装饰优先权。
- 活动背景不再使用怪兔子，改为原创蝴蝶结＋心形吊坠，并补低对比云朵；低窗口隐藏大装饰。
- 应用编译 CSS 的源码结构回归测试通过，但只是 DOM fixture，不能冒充 Windows 截图。原模拟稿的三列卡、整宽横幅、虚构底部区域和完整动效不作为已落地项。

[返工设计与完整遗漏清单](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/design-spec-windose-real-rework.md>) / [回归报告](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/source-hooks-report.json>) / [部署报告](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/windows-deploy-r2.json>)。

## 以下为早期示意图阶段记录（历史保留，不是当前验收状态）

## 范围与阶段

正在迭代已选定的深色 Windose × 地雷系方向。当前产物是 HTML 示意图，不是 VRCX 实机截图。主应用仓库保持只读，未提交、未发布正式主题。

## 已接入

- [字体 CSS](<../fonts/fonts.css>)：中文 Fusion Pixel 子集和拉丁 Silkscreen 子集。浏览器 `document.fonts` 确认两者均 loaded。
- [全量图标 CSS](<../original-assets/icons/dist/jirai-icons.css>)：243 个实际图形、50 个手修覆盖合并，107,644 字节。249 个引用名不等于249种图形；别名有归并。这个数量不代表非 Lucide 图形已覆盖。
- [整合样式](<../mockups/windose-dark/finish.css>)：兔子挂件、双线心形、闪光、云朵、宝石心，以及与原窗框底条分离的翅膀饰物。
- [完整图标许可](<../original-assets/icons/LUCIDE-LICENSE.txt>)：含 Lucide ISC 与部分 Feather 来源 MIT，不能只标“全部ISC”。

## Leader 已修复的验收问题

1. 示意图不存在的 `lucide-user-round-x` 和缺失地球映射，导致未覆盖图形；改为正确映射。浏览器检查当前示意图所有 `.lucide` 均有 mask 且原始子图形隐藏，无页面错误。
2. 旧六图标替换规则会将未覆盖 SVG 显示成实色方块；移除旧规则，替换范围由全量产物的明确选择器控制，未覆盖图标保留原图形。
3. 翅膀装饰复用 `.win::after`，破坏薄荷窗框底条；恢复底条，改用空白区域独立伪元素。
4. 心形背景直接对父容器使用 mask，会裁掉子伪元素翅膀；背景改到独立 `::after`。
5. 光标素材形状不达标，撤出导出清单；宝石心高光修改。旧检查图仍包含撤出素材，不应作为最终素材清单。

## 独立验收任务

三个 ds flash 子智能体已完成：[图标验收](<acceptance-icons.md>)、[字体验收](<acceptance-fonts.md>)、[视觉验收](<acceptance-visual.md>)。这些是核查当时的快照，不是修后签字。

Leader 收回后修复并复验：字体仅作用于12px界面chrome，body/用户内容恢复应用字体；249条输入已持久化，生成参数固化，依赖路径可配置，243个SVG重建逐字节一致；完整ISC/MIT许可嵌入图标CSS，现为110,865字节；取消person-standing额外缩放；备注改回label+纯文本；提升弱文字并取消SteamVR文本整体透明；静态与动态截图均已按修后源重生成。浏览器确认两字体loaded、示意图图标无漏项、零页面错误。

仍未签为发布合格：非Lucide图形、真实虚拟列表装饰挂载、不同字号缩放及真实WebView验证未完成。审计报告中“字体不存在浏览器”和“字体叠加接近1MiB”不能照单采信：浏览器位于明确给定的临时目录，当前两字体CSS只有74,891字节。一个审计子智能体自报执行了禁止的只读git status，未修改主仓库；此为执行约束违规，已记录。

## 尚未完成

- 源码中的非 Lucide SVG 清单与换图方案。
- 真实应用 CSS hooks 的最终映射，头像已有装饰及背景伪元素的共存验证。
- 用户内容字体作用域仍需收紧；全局字体仅是原型方案，不可照搬到发布主题。
- 中文点阵字在 Windows 缩放下的可读性实测。
- 备注气泡的假对话结构仅为风格实验，正式主题不能新增对话内容或 DOM。
- 素材自定预算20 KiB已超（24,533字节），并非应用硬限1 MiB；最终需按实际引用裁剪，不为预算好看直接删验收项。

## 当前截图（非实机）

![主界面](<../mockups/windose-dark/windose-dark-main.png>)

![用户详情](<../mockups/windose-dark/windose-dark-dialog.png>)
