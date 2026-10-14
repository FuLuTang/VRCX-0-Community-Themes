# Windows 本地预览检查点 · R5（最新）

`Local Preview R5` / `1.2.0-preview.7` 已原子部署，theme.css 713,000 B（余 335,576 B），见 [R5 部署报告](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/windows-deploy-r5.json>)。
- R4c：正文字体按 GB2312 全部 + Big5 常用 + JIS 一/二水准 + 假名 + 拉丁扩展精简为 11,072 码点（队友 font-slimmer）。Leader 复核：Latin Ext-B 实为 127/208（源字体缺 81 个罕用字母），队友报告的 208/208 不实。
- R5 素材（队友 pixel-artist，两轮，Leader 目视复审后返工一次）：18 件原创多色 SVG。已接入：导航格纹（叠 70% 底色遮罩压低对比）、导航左下兔子吉祥物、动态缎带吊坠、SOCIAL 标题条星星与心。未用：pattern-lace-dots（像网格不像蕾丝）、angel-heart（仍难辨认）。
- R5 动效（队友 motion-designer，返工一次）：品牌心跳、底栏蕾丝流动、导航吊坠摆动、SOCIAL 星心闪烁、选中页签闪光、进度条流动、spinner 步进、对话框像素渐显；全部 steps()，reduced-motion 下停止。Leader 修正：删除占用应用导航拖拽高亮线 `.vrcx-0-main-content::after` 的星屑、删除与开关钮重复的叠加爱心、星屑从列表上方移入 SOCIAL 标题条空白处、吊坠仅展开导航显示、移除旧静态吊坠避免双份。Leader 独立动效验证 checks/r5-motion/verify-lead.mjs PASS；七套回归通过。仍非实机验收。
- 参考图版权：art-references.md 已记录全部参考图版权归原作者（游戏截图、素材站），描摹转绘也属于复制，不放入公开主题；只借鉴设计语言。

# Windows 本地预览检查点 · R4b

`Local Preview R4b` / `1.2.0-preview.5` 已原子部署，theme.css 1,019,911 B（余 28,665 B），见 [R4b 部署报告](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/windows-deploy-r4b.json>)。变化：开关恢复凸起 bevel 钮（18×18），图标画在钮面上——开为爱心，关为参考常见像素创可贴重画的黄棕色宽条交叉绷带（5px 宽、圆头、气孔、纱布）；轨道 46×22（sm 44×20）；滚动条拇指加 Win98 式三道握把线。七套回归通过；仍非实机验收。

# Windows 本地预览检查点 · R4

同一目录已原子更新为 `Local Preview R4` / `1.2.0-preview.4`：theme.css 1,014,504 B（距 1 MiB 余 34,072 B），preview 37,266 B，四文件 SHA-256 一致，见 [R4 部署报告](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/windows-deploy-r4.json>)。尚无 R4 实机截图，不签实机通过。

R4 内容与 Leader 审查：
- 字体：正文/界面首选 Fusion（"WD Pixel CJK"），真小写；子集加入 Latin-1 + Latin Ext-A（法语重音全覆盖），共 20,038 码点。Silkscreen 只留 START/SOCIAL 等刻意大写标签。
- 标题栏（chrome 子任务）：快速搜索浅粉面 + ink 像素框，Ctrl/K 像素键帽；左上品牌铭牌 + 像素心、帮助菜单像素块；状态栏状态灯改方块。
- 右侧栏（side-panel 子任务）：根因是应用 workspace gutter 包住右栏 + 透出黑缝。Leader 修正子任务方案：保留 workspace 的 margin-left（导航折叠时应用会切换 gutter），只移走上/右/下；顺带修复旧令牌 `--vrcx-0-main-content-lift: none` 让整条 box-shadow 失效的 bug。竖排页签真实 DOM 是 `role=tab` + tooltip-trigger，原 tabs-tab 规则从未命中；改为文件夹式：选中页签与内框连通、粉色脊线。
- 动态列表（feed 子任务）：257 个 lucide 引用 SSR 全命中，"未像素化"真因是 14px 盒缩放 16px 栅格丢块；改为 16px 整数栅格并加粗铅笔；状态圆点改方块；JP/USE 徽标像素框。
- 设置页（settings 子任务）：像素窗口导航（选中浅粉）、卡片标题条 + 蝴蝶结 + 蕾丝、阶梯缺角、分段组明暗对比、步进器像素化。其 A 方案开关已被 Leader 删除。
- 控件（pixel-controls 子任务）：用户选定 C 方案开关——凹槽 + ON/OFF 像素灯字，开 = 爱心钮，关 = 绷带 ❌ 钮；Win95 风滚动条（原生 thin 滚动条被应用 `scrollbar-width` 压制，主题恢复 webkit 伪元素）与 Base UI ScrollArea；分段方块进度条。
- 七套回归均通过（两套以实机 R3 CSS 为前态基线）。违规记录：pixel-controls 子任务在主应用跑过一次只读 `git status`，无写入。

R4 实机待验：小写/法语字形；搜索与键帽可读；右栏贴边与窗口外框是否双线、导航折叠时左间距；页签选中观感；14px 滚动条是否改变虚拟网格列数；开关加宽是否挤占设置行；铅笔/上下线图标像素感；徽标变宽截断。

---

# （历史）Windows 本地预览检查点 · R3

## 已部署

```text
C:\Users\tangh\Documents\GitHub\theme-preview\jirai-kei-theme
```

主题名含 `Local Preview R3`，版本 `1.2.0-preview.3`。最终仅四文件，无上传临时文件；四文件 SHA-256 与本机一致。

| 文件 | 大小 |
|---|---:|
| [主题 CSS](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css>) | 975,416 B |
| [清单](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.json>) | 461 B |
| [说明](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/README.md>) | 884 B |
| [预览图](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/preview.webp>) | 38,228 B |

[部署报告](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/windows-deploy-r3.json>) / [回归报告](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/r3-report.json>)。

## R3 变化

- 移除主区伪造的 VRCX-0 粉色抬头；真正的窗口标题栏改粉色，沿用应用文字/图标。
- 窗口三按钮像素材一样有像素框、紫粉底及亮暗 bevel；Square/Copy 保留最大化/还原语义。真实按钮经 Tooltip 合成后 slot 是 tooltip-trigger，Leader SSR 验证并修正选择器，不依赖错误的 button slot。
- 底栏粉色，8px 蕾丝在顶边外朝上；另预留8px安全空隙，保护左导航与零 workspace margin 的侧栏模式。RGB ::after 未占用，装饰不拦截指针。
- 胶囊下方10px内边距进入虚拟行真实测量；首头38px、非首头46px，按钮仍28px。block-flex消除换字体后的匿名inline baseline额外1px。
- 普通内部UI、好友昵称、设置说明与弹层正文优先像素字体；不改既有字号和行高，代码/JSON保留等宽。键帽原本sans，保留应用sans。
- 扩展Fusion子集19,848码点（其中19,219为源字体支持的CJK Unified），补齐样本汉字、平片假名与半角假名；罕用扩展汉字、部分源字体缺符号仍使用应用fallback。没有声称任意Unicode均像素化。

## 验证边界与加载

用户提供R1/R2真实Windows截图，证明路径可加载，同时证明之前还原不足。R3的原组件SSR与应用编译CSS结构回归、字体cmap/loaded、按钮命中尺寸、背景/蕾丝方向、字号行高保持以及四文件部署校验通过；**R3未收到实机截图，不能称WebView实机通过**。

原按钮命中宽36px、实际高31px（32px标题栏含1px边线）保持，glyph16px；min/max/restored/close mask有效。没有远程点击关闭/最小化用户窗口来假装动作验收。浏览器fixture图带NOT WINDOWS且使用中性内容，不包含用户的真实截图或实际好友姓名。

本地预览若开启监视可能重读，但监视是否开启尚未确认。请在同一目录点重新加载，确认名称R3。原生后端和前端本地预览均有开发构建限制；入口缺失不得通过改配置绕过。官方“停止本地预览”用于恢复已选主题，不能承诺预览不会协调壁纸/颜色。

SSH在Session 0，VRCX在Session 1；MainWindowHandle=0不能推断用户桌面无窗口。主应用保持只读，无提交、推送或用户配置修改。

## 此次实机待验

1. 主视图：假抬头消失、真顶底栏粉色、蕾丝向上且不遮滚动条/最后一行。
2. 分组：带计数及同房间无计数的下沿间距；VRChat自选头像框不碰胶囊；滚动/折叠/展开不重叠。
3. 内部文字：中日文昵称、备注/简介、portal、截断及用户当前Windows/WebView缩放下的清晰度；源码13/14/16px没有硬改为12px，所以不保证所有缩放都完美整数点阵。
4. 三窗口按钮实际点击、键盘focus及Close hover危险态。
5. 全量生产Lucide仍覆盖，原生select/time及JSON glyph替换有效；图表/状态符号继续保留语义。完整动效与虚构模拟稿布局不作为已完成项，testedWith仍unverified。
