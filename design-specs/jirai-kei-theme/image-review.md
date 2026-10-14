# 旧研究附录：软件层级与早期图片评审

> **艺术主参考请看[新版图文评审](<art-style-review.md>)。** 本文的 VS Code／Obsidian／终端图只保留为交互层级、预览构图和配色测试的历史附录，不能作为地雷系艺术风格的主要依据。

日期：2026-10-10。目的：学习已收集的图片如何组织真实 VRCX-0 的导航、好友表格、右侧详情、卡片和弹窗。现有配色不作为约束，不设粉色面积硬指标。这里只记录设计研究，未改变正式主题。

## 证据与边界

- 视觉判断来自逐张 `read_image` 返回的实际图片；本轮之前刚查看的三张 BOOTH 图复用已有观察，不重复猜测。
- “可借鉴”不等于“可裁切再分发”：BOOTH 商品预览只能学习语言，未获许可不提取资产。
- HEX 若为提出的设计参数会明确标成提案，不冒称从截图读出。编辑器语法高亮与 UI 背景分开判断。
- 保留 VRCX 业务状态色、头像原图、错误/关闭/恢复入口；主题不能伪造在线状态。
- 主程序仓库只读，另一个会话的 merge 不属于本任务。

## 已查看图片与逐图取舍

### G01 · サクラミ 地雷系六色直播布局
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/references-gpt/sakuramii-jirai-overlay.jpg>)；来源：https://booth.pm/ja/items/7382704
- 实际观察：浅粉大底、灰色爱心重复图案、白色高窄评论框、灰色大蝴蝶结跨在评论框顶部；另一个游戏布局把主要内容放在大矩形，窄评论框固定在右侧。
- VRCX 可取：主区与右侧详情的分工贴近我们的三栏；大面积浅粉可以成立，不必限制柔粉只能出现在按钮。右侧信息用无花纹实底，装饰聚在封面／边框接头。
- 不照搬：直播没有高密度表格；不能把大蝴蝶结放到标题栏关闭按钮或搜索框上。灰底游戏占位不是正文背景设计依据。
- 处理判定：借鉴布局语言。

### G02 · MellCat 融化病みかわ直播布局
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/references-gpt/mellcat-melting-overlay.jpg>)；来源：https://booth.pm/ja/items/4554010
- 实际观察：黑色细格纹框架，粉色顶部融化块，右侧社交标签，底部斜纹条，小型聊天框用复古窗口标题条；商品图另含角色和粉蓝条纹宣传背景。
- VRCX 可取：复古小窗的粉标题＋实色正文适合弹窗；格纹可以只在窗口空隙或右侧封面出现；斜纹可以变为导航选中纹理。
- 处理判定：可原创绘制不同的滴落／斜纹组件。

### G03 · IPPU 病みかわ恶魔／天使直播布局
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/references-gpt/ippu-yamikawa-overlay.jpg>)；来源：https://booth.pm/ja/items/4470946
- 实际观察：灰粉菱格底，黑色波浪上下花边配虚线缝线，重复心形和蝴蝶结；评论区深灰实底，粉色波浪标题；周围有贴纸式小装饰。
- VRCX 可取：强装饰外框＋安静信息内页能共存。灰粉封面＋炭灰表格是一个完整的新配色方向。菱格可用于详情背景；波浪缝边做卡片标题边缘。
- 不照搬：不往在线状态附近塞药丸／十字符号；大型贴纸会挤占表格。必须实测缩小后波浪边是否仍清晰。
- 处理判定：作为视觉参考；可用 CC0 几何图案做不同构造。

### A01 · Kenney Pattern Pack 1 图集
- 图片：![图集](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/assets-candidates/references/kenney-patternpack1-tilesheet.png>)。
- 实际观察：黑白斜纹、棋盘、菱格、波浪、圆点、爱心等连续图案；不少是粗块，缩放后会压过正文。
- VRCX 可取：从爱心／圆点／细格三类开始；先做背景 tile，而不是给业务按钮换图标。
- 处理判定：CC0，已委派 gpt-6-luna 制作透明和低对比衍生素材；不用粗砖墙、希腊回纹等风格不相符图案。

### A02 · Kenney 75 爱心 tile
- 图片：![爱心原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/assets-candidates/patterns/kenney-patternpack1-75-512.png>)。
- 实际观察：白色圆润心形在黑底上规则重复，边界有连续心形切片，源图没有透明背景。
- VRCX 可取：侧栏底、用户详情封面或预览海报；表格内容区不用高对比原版。
- 工程注意：默认 CSS alpha mask 对不透明黑白 PNG 会得到整块遮罩，需灰度转 alpha 或显式亮度 mask。交给 luna 转透明 PNG/WebP，验证 tile。

## 后续逐图队列

21 张既有软件／终端参考图逐一查看中。以下章节按实际完成追加，不依据旧研究报告替代看图。

### R01 · Nightcall 宣传图
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-nightcall-banner.jpg>)。
- 观察：夜空／山峦／条纹太阳／网格地板，三张透视代码窗口，霓虹手写标题和三个版本标签；内部主要是蓝紫暗底。
- 可取：预览图明确展示一个主体和版本标签；可用真实窗口截图加独立背景，而不是全屏工程标注。
- 舍弃：合成背景的赛博气质不是地雷系；不会把网格地板、交通灯、透视倾斜加进实际 VRCX。左右窗口明显重复，单主题宣传不需要复制三份。
- 素材：参考构图。

### R02 · Pink Candy 深色宣传图
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-pinkcandy-banner-dark.png>)。
- 观察：大标题占上半部分，深浅两个应用窗口交叠；亮粉状态栏与深灰界面形成清晰身份锚点。
- 可取：预览图不必把所有组件塞满，可突出名称＋单个窗口；粉色可以集中在一整条结构区，而不是平均撒遍界面。
- 舍弃：重叠图截断窗口底部，无法检查全 UI；若只提供一个暗色版本不能暗示双模式。标志和标题不能直接提取。

### R03 · Pink Candy 深浅斜切对照
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-pinkcandy-example-1.png>)。
- 观察：同一编辑器画面被大对角线分成浅色与深色，两边共用亮粉状态栏；左下树导航与右侧终端在暗色一半具有边界。
- 可取：可用于真正不同模式的对照证据，观察浅底＋粉强调也能支撑高信息密度。
- 舍弃：单主题成品预览不要斜切，否则让 VRCX 三栏关系读不完整；错误终端文本不是我们展示用的数据。

### R04 · Cyber Pink Neon
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-cyberpink-neon-p1.webp>)。
- 观察：近黑大面、很暗的粉色工具文字／细线、小面积亮粉图标和选中行。中间扩展介绍仍用白色标题与正文。
- 可取：业务正文与风格化装饰文字分离；VRCX 好友名／状态不必全变粉，可以把粉给外框与导航。
- 舍弃：此图的次级粉字在暗底显得很暗，不能以“地雷感”降低可读性；没有蕾丝／缎带表达，不能作为整个风格的母版。

### R05 · Cyber Pink Soft
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-cyberpink-soft-p1.webp>)。
- 观察：构图与 R04 几乎相同，代码颜色更柔和，保留黑底与淡粉线。这里只能确认视觉差别，不能从截图认定源码参数。
- 可取：对我们的长表格，柔粉文本／低刺激边框比霓虹更适合；强粉保留给激活态而非所有文字。
- 舍弃：图太小，不适合证明正文对比度合格；也不需要照搬编辑器多色语法高亮。

### R06 · Subtle Pink
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-subtlepink-1.png>)。
- 观察：深蓝灰导航与更暗的编辑区靠明度分层；选中文本是一片透明感莓紫，普通文字是灰白，粉主要出现在代码关键词和通知圆点。
- 可取：好友表格选中可以用整行柔色而不是粗装饰；侧栏／内容之间不必重复加多层边框。
- 舍弃：这张本质是编辑器深蓝配色，不是地雷系母版；代码粉色不能直接算成 UI 使用比例。取层级，不取蓝灰基调。

### R07 · Pink Panda
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-pinkpanda-sample-1.png>)。
- 观察：浅粉标题栏与下缘，深灰内页，侧栏略亮，白色文字与粉代码关键词；没有复杂纹样。
- 可取：窗口上下的粉色“包边”在缩略图依旧醒目，可将我们的标题栏／状态栏设计成同一材质，主表格保持炭灰。
- 舍弃：当前图片底部裁得很近，不能从它确认完整状态栏内容；不让浅粉包边遮住窗口操作按钮。它提供骨架，不提供地雷装饰。

### R08 · Pink Pixie（图内写 Midnight Orchid）
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-pinkpixie-preview.png>)。
- 观察：酒红近黑背景，浅粉白 UI 文字，粉色细框激活标签，右侧粉滚动条，底部鲜粉状态栏；图内 toast 写 Theme applied: Midnight Orchid。
- 可取：酒黑＋粉白提供第三种气质，不必限定紫黑。细框标签与实心按钮可形成强弱差异；焦点边框可以成为风格结构。
- 舍弃：不能仅按文件名认定主题版本；不迁移自定义光标／文字周围装饰。通知与业务错误须保留正常语义。

### R09 · Huacat Pink
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-huacatpink-dark.png>)。
- 观察：大面积统一深品红／酒紫，较亮的搜索浮层，柔粉 UI 字，侧栏与编辑区色差很小；代码仍保留蓝绿黄红。
- 可取：证明有色背景能撑气氛，不必把大面积粉紫视为错误；适合右侧详情封面或整个外壳的暗莓色方案。
- 舍弃：三栏如果都同色会弱化边界，需要为 VRCX 数据主区加中性实底；不复制全应用多色代码高亮。

### R10 · Pink Topaz
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/obsidian-pinktopaz-screenshot.png>)。
- 观察：左右硬切的深浅对照；左半炭灰内容，右半米白／浅杏正文块和右侧玫瑰时间轴；右栏不同深浅粉色区块与白线标时间。
- 可取：粉色可以承担内容分组和节奏，不只是装饰；对于活动时间线可参考分组层级，前提是主题能选中真实分组 hook。
- 舍弃：这不是一张纯浅色实机图，旧报告用整张图推“浅色粉占比上限”不成立；渐变时间块也不是 VRCX 默认组件，不假装主题能凭 CSS 增加时间轴功能。

### R11 · AnuPpuccin 缩略图
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/obsidian-anuppuccin-preview.png>)。
- 观察：暖色背景上一个正置窗口，用斜切展示深浅两态；左下大白标题，底部渐黑使标题易读。右侧图谱与日历展示内容密度。
- 可取：缩略图只需主题名＋可辨认的真实三栏窗体；标题可放窗口外，避免与业务 UI 混淆。
- 舍弃／修正：没有从此图看到旧报告描述的“窗口微倾斜”，不沿用该说法。窗口内字号在小图很小，不能用这张验收 UI 对比度。

### R12 · Border 小尺寸封面
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/obsidian-border-cover.png>)。
- 观察：蓝紫颗粒背景、大蓝标题、白色轮廓徽标、三个深浅窗口被裁切交叠。
- 可取：单一背景纹理＋对比强标题能撑商店小图；颗粒仅在画外做宣传材质，不进入正文。
- 舍弃：多窗裁切不适合证明我们的完整三栏，不复制徽标和资产；蓝色不是本项目指定风格。

### R13 · Border 大尺寸封面
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/obsidian-border-cover-lg.png>)。
- 观察：与 R12 相同海报构图，高分辨率可见主窗口正文实底、圆角内容边界、侧工具列、轻柔选中项。
- 可取：内容阅读区完全实底，装饰分隔在画外与外壳；右侧空状态有轻淡图形并留文字职责。
- 舍弃／修正：这是合成封面，不是旧报告所称“干净全屏实机截图”；不因高清就当成单一运行窗口。

### R14 · Maple 大图
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/obsidian-maple-main.webp>)。
- 观察：米白／暖灰窗口，右侧上下两块阅读面板，左侧树导航，绿选中项和表头；正文卡片有轻边框，图像保留原色，少量标题使用不同颜色。
- 可取：三栏主次与我们的 UI 接近；在暖浅底中通过实底分区、轻边框和统一标题条组织复杂信息。可把绿色换成选定主题的粉色族，但这是设计提案，不是原图观察。
- 舍弃：大量标题颜色是文档结构，不替换 VRChat 状态色；页面中间星形分割不适合密集表格。只学分区，不把它叫地雷系。

### R15 · Maple 小封面
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/obsidian-maple-screenshot.png>)。
- 观察：左上被裁的窄屏浅色笔记、右侧深色桌面窗口、左下手写风名称，窗外是暖黄／蓝灰背景。
- 可取：宣传图有明确的一大一小层级；手写标题只能用于画外品牌名，业务中文保留应用字体。
- 舍弃：如果我们不做手机界面，不借假手机样板暗示支持；右边窗口被裁，不适合作为唯一功能预览。

### R16 · Sakura 终端色样
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/terminal-sakura.png>)。
- 观察：终端 ANSI 颜色测试矩阵，列名 40m—47m，粉紫文字在多种色底上反复展示；不是应用界面截图。
- 可取：借测试方法，未来同样把正文／次文／链接／错误／选中叠在候选面板上比较，而不是只看一个好看的默认状态。
- 舍弃：不能从色样推导航布局、粉色面积或可用性；部分粉字叠粉底明显难读，不能全 UI 前景直接粉。

### R17 · Rosé Pine 终端色样
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/terminal-rose-pine.png>)。
- 观察：同样 ANSI 矩阵，暗紫黑底与柔粉／青／金／浅紫色列；包含同色字背景的低辨识组合。
- 可取：可测试不同业务状态色与主题背景能否共存，不能只测主粉色；文字仍须按角色独立配色。
- 舍弃：整套 ANSI palette 不是 VRCX 主题 token，不把多色矩阵变成表格每行换色。

### R18 · Rosé Pine Moon 终端色样
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/terminal-rose-pine-moon.png>)。
- 观察：构图与 R17 相同，背景紫感较亮，其余列依然是多色测试；不存在窗框或装饰资产。
- 可取：近黑不必压到最暗，稍亮的中性／紫灰可以使层级更自然；后续对比度用实际色值计算，截图只是方向参考。
- 舍弃：不能宣称 Moon 比另一款对比度更好，缺计算；不拆色样当背景。

### R19 · Pink Cat Boo 市场截图
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-pinkcatboo-market-preview.png>)。
- 观察：蓝紫深底＋更亮侧栏，浅粉整条状态栏、通知标题；代码区粉白文字，树选中是金棕而非粉。
- 可取：低饱和浅粉结构区能与暗内容区组成完整身份；通知标题和正文分离，利于右侧小窗／toast 层级。
- 舍弃：金棕选中与主题粉色未必协调，不照搬；截图有 warning 语义，不能把危险／成功状态都粉化。没有地雷装饰，只取包边比例与布局。

### R20 · Kawaii Dark 市场截图
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-kawaii-theme-market-preview.png>)。
- 观察：深紫灰面板，莓粉选中导航，亮粉激活 tab 顶线，浅粉白文字和整条粉状态栏；无人物和图案。
- 可取：莓粉实心导航胶条可作“缎带”的基础，鲜粉只用于激活态的细边，正文保持可读的浅色。
- 舍弃：仍是换色主题，不足以说明地雷风格；不需要把代码黄／紫散布到数据主区。

### R21 · Pink Candy 代码并排对照
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/references/vscode-pinkcandy-comparison-1.png>)。
- 观察：同一 Rust 代码左右并排，一边偏蓝灰另一边偏中性炭黑；两边的语法色和状态栏也不同。没有蕾丝／格纹资产。
- 可取：后续方向比较必须用同一份匿名内容、同一窗口尺寸、同一滚动位置，这比不同页面各截一张更能看清主题区别。
- 舍弃：具体左右主题身份不由截图推断；不把代码多色高亮当成 UI 主辅色。

## 阶段结论

- 已逐张查看既有 21 张软件／终端图，以及 3 张更对题的直播图；终端矩阵只能用作颜色兼容测试，不能冒充 UI 风格样例。
- 本项目应借“阅读区与装饰外壳分工”，不借一个固定粉色百分比。深／浅／灰粉三类底都能候选。
- 禁止再分发的直播图只学构造；真正处理的资产从 CC0／PD 候选里取。
- 修正旧报告的三个事实错误：AnuPpuccin 此图未见窗口倾斜；Border 大图是海报；Pink Topaz 是深浅拼图。原始报告保留，不覆盖历史记录。

### A03 · 历史蕾丝参考扫描
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/assets-candidates/references/wikimedia-lace-reference-1000.jpg>)。
- 观察：密集白色蕨叶／网眼、徽章与人物构图，内矩形周边及上方有窄花边；图像本身是有噪声的扫描，不是已透明的可平铺蕾丝。
- 可取：只考虑窄边条或简化网眼，对详情封面／弹窗下缘有启发；不要把整张铺在主区。
- 处理：可试窄条透明化，缩到实际装饰高度后若发糊就放弃；。

### A04 · Owen Jones Plate 043
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/assets-candidates/references/wikimedia-owen-jones-ornament-plate043-1000.jpg>)。
- 观察：图内标题 MORESQUE，橙黄、绿、蓝的大量摩尔式几何瓷砖样式，不是蕾丝。
- 可取：本项目无直接用途。重复构造可作为通用几何研究，不能因 PD 就硬塞到地雷主题。
- 处理：不花时间裁切；纠正把任意历史纹样书当蕾丝素材的倾向。

### A05 · Kenney Pattern Pack 2 细线图集
- 图片：![原图](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/jirai-kei-theme/assets-candidates/references/kenney-patternpack2-thin-tilesheet.png>)。
- 观察：菱格、直格、之字纹、编织交错、六角等黑白图案；部分细线实际在原图是像素边缘，缩放需要验证。
- 可取：菱格对应 IPPU 的封面外壳；直格对应 MellCat 的复古窗框。两者只择一作为每个方向的主要纹样，不同时叠圆点／格纹／爱心／蕾丝。
- 处理：CC0，luna 验证独立 tile；不要从整张图集盲裁编号。

### U01 · 既有登录截图（不是主界面）
- 图片：![登录证据](</tmp/vrcx-live-jirai.png>)。
- 观察：登录表单、语言选择、代理／恢复入口和窗口控制；既有主题几乎是纯暗面＋细双边卡片。
- 可取：登录也要有身份感，但要保持账户输入、禁用登录、恢复入口清晰。背景纹样可以在表单外，表单本体保持实底。
- 边界：只说明这张既有截图，不能冒称本轮重新运行了程序。

### U02 · 既有三栏布局 mock
- 图片：![布局参考](</home/fulutang/Documents/Github/VRCX-0-Themes-VSCode/design-specs/vscode-dark-theme/layout-mock-default.png>)。
- 观察：左导航、中间宽面板、右详情、上下栏；只是无数据骨架，左侧字色和右侧背景本身不完整。
- 可取：所有设计都沿用这个空间职责，而不是把直播画面宽评论栏机械复制成新布局。
- 边界：不用于评估正文对比度或实际好友行；不是本轮或实机测试结果。

### P01 · luna 处理后的材料样板
- 图片：![连续平铺样板](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/processed-assets/pattern-candidate-specimen.webp>)。
- 实际观察：心形／圆点透明版叠棋盘证明黑底已去掉；两组粉黑／粉灰很暗，适合边缘背景不是主识别点。棋盘块大，方框格含对角线，菱格是交错网格，均不等于直播图里的简单格子。
- 可取：heart 和 diamond 优先作为封面／侧栏候选；选定方向后调色，不能把这个过暗技术样板当最终设计。checker 仅窄边／宣传图，dots 作为备选不与其它纹样同时堆叠。
- Lead 独立核验：30 个输出文件字节与 manifest 一致；15 组 PNG／WebP 均为 512×512，alpha 和非透明像素 RGB 一致；两份 CC0 原文哈希匹配。已看实际平铺图未见明显额外缝线；边界数值诊断不是任意缩放无缝的充分证明。
- 文档勘误：luna 已把输出数修正为 5×6=30，没有改主题或重生成文件。

## 组件迁移约束（已读源码）

- [标题栏](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/layout/AppTitleBar.tsx#L88-L169>) 为 `h-8`，右侧有真实窗口控制与功能动作，不放大蝴蝶结／滴落边缘覆盖它们；颜色和边线可以改。
- [弹窗](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/dialog.tsx#L68-L97>) 默认 `p-4`、自身滚动、右上 `dialog-close`。装饰须有明确安全边界，不能借直播画面的巨大留白。
- [弹窗 footer](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/dialog.tsx#L112-L138>) 有负外边距和 `p-4`，背景分隔可借复古标题／内容分块，但不能让装饰越过按钮。
- 不通过主题新增直播倒计时、时间轴或不存在的插件功能；设计落点只在现有 surface／slot。




