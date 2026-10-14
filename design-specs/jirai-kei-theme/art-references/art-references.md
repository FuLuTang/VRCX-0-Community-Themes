# 地雷系 / 病みかわ 艺术风格参考集（VRCX-0 主题用）

> ⚠️ **版权声明：本目录所有参考图版权归原作者 / 原版权方所有，仅作内部设计学习参考。禁止提交到公开仓库，禁止直接嵌入主题或任何发布产物（包括作为背景、贴图、图标、预览图）。** 迁移时只借鉴“设计语言”（结构、比例、配色关系、装饰类型），所有素材须自行重绘。
>
> - 本目录与 VS Code / 编辑器 / 终端配色主题无关，全部是游戏 UI、素材站装饰、服饰品牌视觉。
> - 收集日期：2026-10-11。所有 HEX 值均为**目测估计**，不是取色结果。
> - 处理说明：`nso-steam-ss-03.jpg` / `nso-steam-ss-04.jpg` 中有一行带性暗示的游戏内弹幕选项文字，已做像素化遮挡；`*-sheet.*` 为我把同一来源的多张缩略图拼成的对照表（原图版权仍归原作者）。
> - 目录里的 `user-noa-senpai-cover-ref.jpg` 不是本次收集的文件（他人放入），本文档不涉及。

## 目录

| # | 文件 | 来源分类 |
|---|---|---|
| 1–8 | nso-steam-ss-01 ~ 08 | NEEDY GIRL OVERDOSE Steam 截图 |
| 9–13 | nso-fandom-* | NSO 游戏素材（fandom wiki 托管） |
| 14–20 | aomaterial-* / ramuneya-* | 日本免费素材站 地雷系背景 |
| 21–25 | sozaino-* | 日本免费素材站 地雷系/编み上げ背景 |
| 26–27 | landmineprincess-* | Steam 游戏 Landmine Princess |
| 28–29 | dreamvs-* | 服饰品牌 夢展望（Dream Vs）EC 横幅 |

---

## 一、NEEDY GIRL OVERDOSE（主播女孩重度依赖）Windose 20 桌面 UI

### 1. nso-steam-ss-01 — 桌面全景（直播窗口 + 状态窗 + JINE 聊天）

![NSO 桌面全景：图标列、直播窗口、状态窗、JINE](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-steam-ss-01.jpg>)

- 来源：https://store.steampowered.com/app/1451940/ （Steam 商店截图）
- 版权：WSS playground / xemono（发行 WSS playground、Alliance Arts）
- 实际观察：
  - 桌面底是淡紫粉（目测 #F3E4F6 左右）+ 浅蓝色像素锯齿波纹平铺图案；左右两侧黑边外是像素画的街景（蓝天 + 粉色街道）。
  - 窗口是 Win95 风格：标题栏浅粉紫（目测 #EDD5EE），左侧一个实心深靛蓝小方块（目测 #3A22C8）+ 像素字体标题，右侧三个带描边的方框按钮（最小化/最大化/关闭）。窗口外框是 1px 靛蓝描边 + 1px 浅色内框，**窗口底部有一条薄荷青色条（目测 #8EE6DD）**，左下角有一个小粉色进度块 + “▫▫▫” 小装饰。
  - 左侧桌面图标纵向一列：图标 + 下方小号日文标签（はいしん、あそぶ、ねる、おくすり、いんたーねっと、おでかけ），带“!”黄色角标表示有事件。
  - 状态窗（たすくまねーじゃ）：大号像素数字（フォロワー 453588），下方三行 “ストレス/好感度/やみ度 xx/100”，右侧是浅紫底 + 天蓝填充的条形图。
  - JINE 窗口：亮粉紫底（目测 #E79BE8）+ 像素点云纹；对方消息为浅蓝圆角气泡，自己消息为亮绿气泡（LINE 戏仿）；顶部有“日常 / ひる”的胶囊形分隔标签。
  - 底部任务栏：浅色条，左“スタート”按钮带像素 logo，后接 Twitter/JINE/PC 小图标，任务按钮为“靛蓝小方块 + 窗口名”，最右是天气图标 + “DAY 17”。
- **对 VRCX 三栏 UI 的可迁移点：**
  - **标题栏 h-8**：整条做成 Windose 标题栏——浅粉紫底、左侧实心靛蓝小方块 + 应用名、右侧三颗方框按钮（1px 描边，hover 变反色）。
  - **状态栏**：直接对应 Windose 任务栏：左侧“在线人数/状态”做成任务按钮样式（靛蓝方块 + 文本），右侧时间/实例计数做成 “DAY 17” 式的独立凹陷小框。
  - **右侧用户详情面板**：可做成“たすくまねーじゃ”式窗口——大号数字（好友数/在线时长）+ 带 /100 的小号副文本 + 浅紫底天蓝填充的条形进度。
  - **弹窗 / 卡片底部**：薄荷青底条 + 左下角小粉块，作为所有对话框的统一“签名”收边。
  - **左导航**：图标 + 下方小标签的竖列形式，未读事件用黄色圆形“!”角标。
  - **背景**：桌面区（数据表后的空白区）可用极淡的像素锯齿波纹平铺。
- 不适合迁移：两侧像素街景、立绘角色；绿色 LINE 气泡（与粉紫体系冲突且是 LINE 戏仿）；整窗口像素字体（中文/日文长列表可读性差，只建议标题和数字用像素字体）。

### 2. nso-steam-ss-02 — 多窗口层叠（はいしん / あそぶ / ねる 菜单）

![NSO 多窗口层叠与菜单对话框](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-steam-ss-02.jpg>)

- 来源：https://store.steampowered.com/app/1451940/ ；版权：WSS playground / xemono
- 实际观察：
  - 两侧背景换成了夜间合成波（synthwave）：黑紫底 + 青色网格线 + 粉紫渐变落日横条纹，说明同一套 UI 有“昼/夜”两种外框。
  - “はいしん”窗口内部是**近黑底（目测 #1A1A1A）**，配斜切平行四边形的选项条：浅粉条上写深靛蓝文字（“ざつだんLevel1 / 偶像にインターネットを…”），未解锁项为深灰条 + “???”。被高亮的成就条是**彩虹渐变**（粉→黄→绿→青）。
  - “あそぶ / ねる”对话框：白底，左上一个淡粉圆形底的图标 + 大标题，下面一条细分隔线，再下面是一排“图标 + 小标签”选项（夕方まで寝る / 夜まで寝る / 明日まで寝る），可用项全彩、不可用项灰化。
  - 任务栏同时开多个任务按钮时，等宽排列。
- **对 VRCX 的可迁移点：**
  - **弹窗结构**：圆形淡粉图标底 + 标题 + 细分隔线 + 选项网格——适合“邀请/加入实例/收藏分组”这类操作弹窗。
  - **数据表暗色模式**：黑底 + 斜切浅粉选项条可作为“日志/通知列表”的暗色变体；斜切角（平行四边形）可用于标签或行左侧的状态指示块。
  - **成就/特殊状态**：彩虹渐变条只用于极少数“特别”状态（如好友上线提醒、收藏好友行），不要大面积用。
  - **登录页 / 夜间模式背景**：synthwave 网格 + 落日条纹可作为暗色主题登录页的气氛参考。
  - 灰化不可用项的处理（整图标降饱和 + 灰字）可直接用于禁用按钮。
- 不适合迁移：多窗口真实层叠（VRCX 是固定三栏，不应做可拖拽浮动窗口）；彩虹条大面积使用会显得廉价。

### 3. nso-steam-ss-03 — 直播界面（コメント選択リスト，含选中行）

![NSO 直播界面：视频区 + 评论选择列表](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-steam-ss-03.jpg>)

- 来源：https://store.steampowered.com/app/1451940/ ；版权：WSS playground / xemono（一行弹幕文字已像素化遮挡）
- 实际观察：
  - 一个大窗口内嵌“伪视频网站”：顶部白色地址栏（汉堡菜单 + 红色 “▶ live” + 长输入框 + 右侧三个淡粉圆点），左侧视频画面，下方标题“超てんちゃんがくる！”和“190 人が視聴中・配信開始日時: DAY 1”，再下一条淡紫细线 + 右侧 6 个淡粉圆点。
  - 右侧评论列表：顶部是带淡紫底和描边的标签头“コメントせんたく中”，下面一条**黄色细线**；每行左边一个**实心靛蓝小方块**做项目符号，文字为靛蓝色；**选中行整行填充薄荷绿（目测 #7EE8A0）**；右侧有一条双色滚动条（上半灰蓝、下半粉紫）。
  - 底部是两个虚线粉色描边的大按钮（“■来てくれてありがとう” / “■帰れ”），左侧灰色“よむコメント ▶”。
  - 视频字幕条：半透明靛蓝底白字，下面一条红线。
- **对 VRCX 的可迁移点：**
  - **数据表（好友/日志列表）**：行首“实心靛蓝小方块”项目符号可替代默认圆点状态；**选中行整行填充单一高亮色**（可换成主题粉）；表头用“淡紫底 + 描边 + 下方一条细强调线”。
  - **滚动条**：双色分段滚动条（轨道浅、滑块粉紫）直接可用。
  - **按钮**：粉色虚线描边 + 前置小方块的次要按钮样式。
  - **右详情封面**：“地址栏 + live 标记 + 观看人数元信息行 + 圆点装饰”的结构可迁移为用户详情顶部（头像/封面图 + 在线状态 + “xx 人在此实例”）。
  - 封面图下方元信息行（灰色小字 + “・” 分隔）可直接用于实例信息。
- 不适合迁移：视频区角色立绘；弹幕文本内容。

### 4. nso-steam-ss-04 — 直播界面（提示气泡 + 灰化列表）

![NSO 直播界面：猫咪提示气泡](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-steam-ss-04.jpg>)

- 来源：https://store.steampowered.com/app/1451940/ ；版权：WSS playground / xemono（一行弹幕文字已像素化遮挡）
- 实际观察：
  - 评论列表整体变成**灰色遮罩态（目测 #BDBDBD）**，表示当前不可操作；标签头文字变为“はいしんスピード はやくちオタク”。
  - 视频区左上有一个**画中画缩略框**（淡紫描边）；角色身后是蓝色像素方块拼贴 + 淡蓝弧线装饰，“SEE YOU...” 青色像素字。
  - 新手提示：**淡紫底 + 靛蓝 1px 描边的方角气泡**，带一个向右下的尖角，指向一只粉色像素小猫（吉祥物引导）。
- **对 VRCX 的可迁移点：**
  - **Tooltip / 引导提示**：淡紫底 + 1px 靛蓝描边 + 方角 + 小尖角，非常适合 VRCX 的 tooltip；可选加一个小吉祥物（自绘）做首次使用引导。
  - **数据表加载/禁用态**：整块灰色半透明遮罩而不是 spinner 覆盖，信息仍可见。
  - **右详情面板**：画中画缩略框（小封面叠在大图左上）可用于“世界缩略图叠在实例截图上”。
- 不适合迁移：角色立绘与像素拼贴特效（太重）；灰色遮罩用太多会显得“坏了”，只用于确实禁用的区域。

### 5. nso-steam-ss-05 — おでかけ 地图 + 半透明结果面板

![NSO 地图窗口与半透明结果面板](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-steam-ss-05.jpg>)

- 来源：https://store.steampowered.com/app/1451940/ ；版权：WSS playground / xemono
- 实际观察：
  - 地图窗口：绿色像素地图 + 红色定位针 + 等距小建筑，地名用靛蓝像素字。
  - 定位气泡：淡紫底 + 靛蓝描边 + 头像 + “あめちゃん / 新ネタ発見の予感！”。
  - 右侧**半透明浅蓝面板（目测 #CDE6F5，约 80% 不透明）**覆盖在其他窗口上：大号靛蓝像素标题“はらじゅく”、说明文字、数值变化“14 ➜ 4”（红色向下箭头组/蓝色向上箭头组表示增减）、底部“ひる ▶▶ よる”时间切换。
- **对 VRCX 的可迁移点：**
  - **右详情抽屉**：半透明浅色面板覆盖层可作为“世界/实例详情”的滑出层；数值变化用“旧值 ➜ 新值 + 小箭头群”表达（例如好友数、信任等级变化）。
  - **地点/实例标签**：头像 + 名字 + 一句话的小气泡，可用于“好友所在位置”悬浮卡。
- 不适合迁移：绿色地图本体（色系完全不同，且与 VRChat 无关）。

### 6. nso-steam-ss-06 — 系统对话框（Meta Get）+ 背景变暗

![NSO 系统对话框 Meta Get，背景整体蒙紫](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-steam-ss-06.jpg>)

- 来源：https://store.steampowered.com/app/1451940/ ；版权：WSS playground / xemono
- 实际观察：
  - 模态弹出时，**整个桌面被一层紫色半透明蒙层（目测 #8A6FD0 / 50%）**覆盖，后面窗口全部变紫变暗。
  - 对话框：粉色标题栏（比普通窗口更粉，目测 #F2C6E8）+ 靛蓝小方块 + 等宽英文字“Meta Get”；上半部是**浅蓝信息区（目测 #D3EAF7）**，左侧红粉色播放按钮图标 + 一句提示；中部白底，内嵌一个斜切右边缘的粉色标签卡（小字“いんぽうろんLevel1” + 大字标题）；底部居中一个淡粉底、细描边的“OK”按钮；窗口底部同样有薄荷青底条。
  - 背景 Poketter（推特戏仿）窗口：淡紫底、白色卡片、靛蓝昵称 + 灰色 @id、转推/星标计数。
- **对 VRCX 的可迁移点：**
  - **弹窗**：最直接的模板——粉色标题栏 + 靛蓝方块；“浅蓝信息条 + 白色正文 + 底部居中 OK”的三段式；**模态蒙层用品牌紫而不是黑**。
  - **通知/成就卡片**：斜切右边缘的粉色标签卡可做“新好友请求”“收藏夹更新”等通知条。
  - **数据表行（好友动态）**：Poketter 卡片格式（头像 + 昵称 + 灰 @id + 正文 + 底部计数）可迁移到“好友动态/Feed”视图。
- 不适合迁移：紫色蒙层过深时会影响可读性，建议降到 30–40%；推文中的人物插图。

### 7. nso-steam-ss-07 — 直播界面（红色选中行）

![NSO 直播界面：红色选中行变体](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-steam-ss-07.jpg>)

- 来源：https://store.steampowered.com/app/1451940/ ；版权：WSS playground / xemono
- 实际观察：
  - 与 ss-03 同布局，但选中行是**红色（目测 #E04848）整行填充 + 浅粉文字**，列表其余部分为灰色禁用态——对比极强。
  - 视频区左右各一个角色头像（一个大一个 Q 版），字幕条“コメントを確認……”，背景为粉紫渐变边框 + 地球图。
- **对 VRCX 的可迁移点：**
  - **数据表危险/警告行**：同一表格中“红色整行”可表示屏蔽用户/错误日志，和普通粉/绿选中区分。
  - 说明 NSO 的列表高亮色是按语义切换的（绿=正向、红=负向），VRCX 可以借这个思路做“在线/离线/忙碌”行高亮。
- 不适合迁移：红色大面积高亮在粉色主题里会显得刺眼，建议只用左侧色条或降低饱和度。

### 8. nso-steam-ss-08 — Poketter 时间线窗口

![NSO Poketter 时间线窗口与“あしたにすすむ”按钮](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-steam-ss-08.jpg>)

- 来源：https://store.steampowered.com/app/1451940/ ；版权：WSS playground / xemono
- 注意：时间线中有一条推文文本提到自残（文字，非图像）；本参考只看版式，不迁移任何文案。
- 实际观察：
  - Poketter 窗口：顶部淡紫标题区“Poketter”（白色描边像素字），内容区是带圆角的白色卡片列表，卡片间细灰分隔线；昵称前后有 💙/🎀 符号装饰（“💙あめ💙”）；配图为满宽卡片。
  - 回复行前有一个粉色“↳”折角箭头。
  - 右下角“あしたにすすむ”按钮：浅蓝底 + 靛蓝粗描边（右侧/下侧更粗，像 Win95 凸起按钮）+ 月亮图标。
  - 右上状态窗中的条形图变成了**小型折线/面积图**（天蓝在淡紫底上）。
- **对 VRCX 的可迁移点：**
  - **主操作按钮**：浅底 + 右下加粗描边的“凸起”像素按钮，可作为“加入/邀请”等主按钮。
  - **右详情面板的统计区**：淡紫底 + 天蓝面积图（如在线时长曲线）。
  - **好友 Feed**：昵称两侧的小符号装饰（💙、🎀）可变成用户自定义标签/收藏标记的展示方式。
  - 回复/嵌套关系用粉色折角箭头。
- 不适合迁移：推文文本、角色插图。

### 9. nso-fandom-desktop-icons-sheet — Windose 桌面图标与状态图标合集

![NSO 桌面图标、状态图标拼图](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-fandom-desktop-icons-sheet.png>)

- 来源：https://needy-streamer-overload.fandom.com/wiki/Special:ListFiles （各 `Icon_desktop_*.png`、`Icon_status_*.png`、`Boot_logo.png` 等，原尺寸约 48–64px，我以最近邻 2× 放大拼合）
- 版权：游戏素材 © WSS playground / xemono；fandom 仅为托管
- 实际观察：
  - 全部是约 64px 的像素图标，统一**深靛蓝/紫色 1px 轮廓线**，内部 2–3 阶色块 + 像素抖动（dither）阴影。
  - 题材：泰迪熊、药瓶、放大镜、粉色游戏手柄、棋子+心、床、双心、地球放大镜、JINE（绿底白字）、红色 M、闹钟、夕阳/月亮/太阳三种“ねる”时段图标（圆角方块底）、定位针（带快捷方式小箭头角标）、硬币/曲奇、**胶囊 + 药板（おくすり）**、记事本、火焰、蓝鸟、粉红播放按钮（两种）、大粉心、面章鱼、哭脸猫（ぴえん）、四个状态头像（フォロワー/好感度/ストレス/やみ度）、胶囊、白色药片；左上角是 “Windose 20” 开机 logo（紫粉渐变天空 + 四色窗户 logo）。
  - 快捷方式图标左下角统一有一个**白底黑框的斜箭头角标**。
- **对 VRCX 的可迁移点：**
  - **左导航图标**：统一“深靛蓝 1px 轮廓 + 2–3 阶色 + 圆角方块底”的规则，自绘一套 VRCX 功能图标（好友、日志、世界、头像、收藏、通知、设置）。
  - **状态图标**：四个状态头像的思路（同一角色 + 不同附加符号）可迁移为“在线/忙碌/离线/请勿打扰”的状态徽标。
  - **快捷方式角标**：白底黑框小箭头可用于“外部链接”标记。
  - **时段图标**：夕阳/月亮/太阳三联可用于“最后在线时间”的图形化提示。
- 不适合迁移：任何原图标本身（版权）；JINE/Twitter/YouTube 等戏仿商标图标；药物类图标只可作符号化装饰，避免出现在功能入口上。

### 10. nso-fandom-windose-setup — Windose 20 Setup 安装画面

![Windose 20 Setup 双色调安装画面](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-fandom-windose-setup.webp>)

- 来源：https://needy-streamer-overload.fandom.com/wiki/File:Setup.png ；版权：WSS playground / xemono
- 实际观察：键盘、网线、机箱照片拼贴，经过**紫色 + 深褐/黑的双色调（duotone）+ 网点（halftone）**处理（目测 紫 #9C6CC8、暗部 #2E2420）；左上角白色斜体衬线字“Windose 20 Setup”，明显戏仿 Windows 95 安装界面。
- **对 VRCX 的可迁移点：**
  - **登录页 / 启动加载页**：双色调网点照片拼贴 + 左上角斜体衬线标题，作为“VRCX 启动中”画面的气氛参考（照片需自备或自绘）。
  - 双色调处理也可用于**右详情封面图**的“未加载/占位”状态（把世界缩略图转紫色单色）。
- 不适合迁移：原照片素材；Windows 商标戏仿元素。

### 11. nso-fandom-stream-ui-default — 直播界面空白线框（浅色）

![NSO 直播 UI 浅色空框](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-fandom-stream-ui-default.webp>)

- 来源：https://needy-streamer-overload.fandom.com/wiki/File:Defaukt_stream_ui.png ；版权：WSS playground / xemono
- 实际观察：去掉内容后的直播界面骨架：极浅粉白底（目测 #FDF5FC），顶部白色地址栏 + 红色 “▶ live”，右侧评论区为浅粉（目测 #FCEFFC）长方形 + 白色头尾；输入区一个靛蓝小方块 + 两条灰/粉占位条；视频下一条淡紫线 + 6 个淡粉圆点。
- **对 VRCX 的可迁移点：**
  - **整体留白比例**：说明 NSO 的“内容区”其实非常素：大面积近白粉，只靠细线和小圆点点缀——VRCX 的中间数据表应保持这种低噪背景。
  - **骨架屏（skeleton）**：灰/粉两段占位条 + 靛蓝小方块，可直接用于数据表加载占位。
- 不适合迁移：无（结构参考为主）。

### 12. nso-fandom-stream-ui-dark — 直播界面空白线框（暗色）

![NSO 直播 UI 暗色空框](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-fandom-stream-ui-dark.webp>)

- 来源：https://needy-streamer-overload.fandom.com/wiki/File:Haisin_dark.png ；版权：WSS playground / xemono
- 实际观察：同一骨架的暗色版：外框**深藏青（目测 #000033）**，视频区纯黑，评论区**深墨青（目测 #00222E）**，所有强调元素（圆点、占位条、发送箭头、细线）都改为**洋红（目测 #FF33CC）**，细边框是暗淡紫。
- **对 VRCX 的可迁移点：**
  - **暗色主题配色**：深藏青底 + 墨青面板 + 洋红强调，是非常完整的“病みかわ夜间模式”三色方案，可直接作为 VRCX 暗色变体的配色骨架。
  - 浅色→暗色的映射规则：浅粉圆点→洋红发光圆点、淡紫线→洋红线、靛蓝方块→浅粉方块。
- 不适合迁移：纯黑视频区面积过大，VRCX 数据表不宜用纯黑。

### 13. nso-fandom-jine-bg — JINE 聊天背景贴图

![JINE 粉紫像素云背景](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/nso-fandom-jine-bg.webp>)

- 来源：https://needy-streamer-overload.fandom.com/wiki/File:JINEBG.png ；版权：WSS playground / xemono
- 实际观察：266×388 小图，亮粉紫纯色底（目测 #EE9AEE），角落有用**白色像素网点抖动**画出的云朵，云朵边缘是稀疏点阵渐隐。
- **对 VRCX 的可迁移点：**
  - **右详情面板 / 弹窗背景**：纯色 + 角落点阵云，是低成本高辨识度的装饰；点阵渐隐边缘可用 CSS radial-gradient 点阵自制。
  - **聊天/备注类区域**（如用户备注 note）背景。
- 不适合迁移：饱和度偏高，大面积使用在数据表后会刺眼，只用于小面板。

---

## 二、日本免费素材站：地雷系装饰背景

### 14. aomaterial-jirai-bg-set1-sheet — 「地雷系なかわいい背景」全 24 色对照

![AOmaterial 地雷系背景 24 色对照](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/aomaterial-jirai-bg-set1-sheet.jpg>)

- 来源：https://aomaterial.com/2022/11/13/zirai/ （我将页面上的 1024×576 预览拼成对照表）
- 作者/版权：AOmaterial（aomaterial.com 站方）
- 实际观察：
  - 同一版式 24 种配色：上下边是**扇贝形（スカラップ）黑色或白色边**；左上、右下各有一列 **××××（缝线叉）+ 一个蝴蝶结**；底纹是低对比的同色系小图案平铺：兔头、蝴蝶结、十字架、心、天使翅膀、圆角条（像创可贴/胶囊）。
  - 配色族：淡粉、亮粉、淡紫、灰、黑、灰玫瑰、灰蓝绿、灰蓝、薰衣草、奶茶、米色、浅灰、浅蓝、深蓝灰、红褐、珊瑚等——**全部是“低饱和粉彩 + 黑/白边框”**；边框黑时装饰也黑，边框白时装饰也白。
- **对 VRCX 的可迁移点：**
  - **主题多配色机制**：同一结构 + 多套色板的做法 = VRCX 主题的“色板变体”（粉黑 / 紫黑 / 灰黑 / 暗色）。
  - **标题栏 / 状态栏收边**：扇贝边可作为标题栏下沿或状态栏上沿的 4–6px 装饰边（用 CSS mask 自绘半圆）。
  - **左导航选中项**：“×××× + 蝴蝶结”竖列可缩小成选中项左侧的缝线标记。
  - **数据表背景**：低对比（白色约 30–40% 透明）小图案平铺，作为空表/空状态背景。
- 不适合迁移：原图本身；底纹图案密度在数据表正下方会干扰文字，只能用于空白区域。

### 15. aomaterial-jirai-bg-pink-scallop — 地雷系背景（淡粉 + 黑扇贝，单张）

![AOmaterial 淡粉黑扇贝背景](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/aomaterial-jirai-bg-pink-scallop.png>)

- 来源：https://aomaterial.com/2022/11/13/zirai/ （第 1 张，1024×576 预览）；版权：AOmaterial
- 实际观察：淡粉底（目测 #F9D3DE），上下**炭黑扇贝边（目测 #333333）**，扇贝半径约为图高的 3%；左上 4 个黑色粗“×” + 黑蝴蝶结，右下对称；底纹为白色半透明的兔头、蝴蝶结、十字、心、翅膀、圆角条，随机散布、间距宽松。
- **对 VRCX 的可迁移点：**
  - **登录页 / 预览图**：完整构图（上下扇贝 + 对角缝线 + 稀疏底纹）就是一张现成的登录页布局。
  - **配色基准**：淡粉 + 炭黑（不是纯黑）是地雷系最核心的二色关系。
  - **按钮 / 标签**：粗“×”可作为关闭按钮图形、或标签的装饰前缀。
- 不适合迁移：大面积扇贝边在 h-8 标题栏上会抢视觉，需缩小到 3–4px 半径。

### 16. aomaterial-jirai-bg-set2-ribbonframe-sheet — 「地雷系なかわいい背景②」全 17 色对照

![AOmaterial 黑丝带框背景 17 色对照](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/aomaterial-jirai-bg-set2-ribbonframe-sheet.jpg>)

- 来源：https://aomaterial.com/2023/06/13/zri2/ ；版权：AOmaterial
- 实际观察：17 种底色（粉、亮粉、珊瑚、淡紫、紫、灰、灰玫瑰、灰蓝、浅青、淡粉、浅蓝、淡紫、杏、薄荷、灰绿、深蓝灰、白），**统一黑色**装饰：顶部横贯的大黑蝴蝶结丝带、四边细黑线角框、左右中段 ××× + 小蝴蝶结、底边中央“翅膀 + 十字架”徽记。底纹同 set1。
- **对 VRCX 的可迁移点：**
  - **弹窗**：“顶部大丝带 + 细线角框 + 底部中央徽记”= 一个完整的地雷系对话框外框。丝带可缩小作弹窗标题的装饰，细线角框作弹窗边框。
  - **右详情封面**：底部中央“翅膀 + 十字”小徽记适合作为详情区分隔符。
  - 底色无论怎么换，黑色装饰保持不变——主题变体只换底色、装饰色固定为炭黑。
- 不适合迁移：大丝带直接放在 VRCX 标题栏会挤占按钮空间。

### 17. aomaterial-jirai-bg-black-ribbon-frame — 黑丝带框（淡粉，单张）

![AOmaterial 淡粉黑丝带框](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/aomaterial-jirai-bg-black-ribbon-frame.png>)

- 来源：https://aomaterial.com/2023/06/13/zri2/ （第 1 张，1024×576 预览）；版权：AOmaterial
- 实际观察：丝带有两层黑（外侧炭黑 #333、内侧纯黑），中心结为小方块；**框线是约 3px 炭黑细线，只在四角和两侧中段断开**（断口处放 ××× + 蝴蝶结），底边中央断口放“翅膀-十字-翅膀”。
- **对 VRCX 的可迁移点：**
  - **卡片/面板边框**：“细线 + 中段断口嵌装饰”的边框写法，可做成 VRCX 面板的 border-image（断口处放小蝴蝶结）。
  - **分割线**：底部“翅膀-十字-翅膀”非常适合作为右详情各区块之间的分割线中心装饰。
- 不适合迁移：丝带的写实阴影两层黑，小尺寸下会糊，需简化成单色剪影。

### 18. aomaterial-jirai-vertical-heart-sheet — 「地雷系な縦長背景」全 13 色对照

![AOmaterial 竖版宝石心背景 13 色](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/aomaterial-jirai-vertical-heart-sheet.jpg>)

- 来源：https://aomaterial.com/2024/09/17/zristbg/ ；版权：AOmaterial
- 实际观察：竖版（9:16）。顶部炭黑扇贝边 + 两侧**黑色帷幔弧**向中央收拢，中央一颗**光泽宝石心**（带高光、玫瑰金描边，颜色随底色变）；底色是对角线渐变 + 白色细菱格（编织/绗缝感）+ 交点小星点；下部左右各 5 个粗“×”；底部扇贝边。13 色：粉、奶黄、浅绿、薄荷、浅蓝、深蓝、淡紫、亮粉紫、粉、红、橙粉、灰、白。
- **对 VRCX 的可迁移点：**
  - **左导航整列背景**（竖长比例正好对应左侧栏）：顶部帷幔 + 宝石心作为 Logo 区，菱格细纹作底。
  - **宝石心**：光泽心形可做“收藏/最爱好友”的图标（自绘简化版）。
  - **细菱格 + 交点星点**：比圆点更“布料”感的底纹，可用于侧栏或弹窗底。
- 不适合迁移：高饱和红/深蓝变体与粉黑主题不搭；宝石心的写实高光需简化。

### 19. aomaterial-3d-puffy-jirai-bg — 「3Dぷっくりな地雷系背景」

![AOmaterial 3D 充气质感地雷系框](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/aomaterial-3d-puffy-jirai-bg.png>)

- 来源：https://aomaterial.com/2024/11/10/3dzr/ （文章主图 1920×1080）；版权：AOmaterial
- 实际观察：同样的“扇贝边 + 心 + ×××”构图，但做成**充气/果冻 3D 质感**：粉色亮面塑料（强白色高光）、深灰巧克力色扇贝和符号、中央是一块凹陷的浅粉灰软垫面板，有柔和内阴影。
- **对 VRCX 的可迁移点：**
  - **按钮 hover / pressed 态**：“ぷっくり”鼓起感可以用 inset 高光 + 柔阴影做出，适合主按钮或开关。
  - **登录页 / 预览图**：作为另一种“Y2K 果冻”风格方向的参考，与 NSO 像素风形成对比方向。
  - 中央凹陷面板 = 输入框/搜索框的凹陷感。
- 不适合迁移：整个界面都做 3D 充气会极重且与像素风冲突，只建议局部（按钮、开关）。

### 20. ramuneya-jirai-lacing-bg-sheet + ramuneya-jirai-lacing-pink — 「かわいい地雷系な背景（全6色）」

![ラムネ屋 地雷系编み上げ背景 6 色](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/ramuneya-jirai-lacing-bg-sheet.jpg>)

![ラムネ屋 地雷系编み上げ背景 粉色单张](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/ramuneya-jirai-lacing-pink.png>)

- 来源：https://ramuneya.com/371/ ；作者/版权：ラムネ屋（ramuneya.com 站方）
- 说明：对照表与粉色单张是同一来源，合并一节（两张图都已查看）。
- 实际观察：
  - 6 色：粉、浅灰、薄荷、浅蓝、淡紫、粉紫。上下炭灰（目测 #444444）**小扇贝边**，四角是**大圆弧切角**，切角内各有一个对应底色的小心形；左右两侧各一条**编み上げ（交叉系带）线稿 + 底部蝴蝶结**（线稿而不是实心）。
  - 底纹：小心形 + 小圆点交错的规则点阵（粉色版点阵为 #FF9EB5 左右）。
- **对 VRCX 的可迁移点：**
  - **窗口四角**：“大圆弧切角 + 角内小心”可做成 VRCX 主窗口或弹窗的四角装饰。
  - **左导航选中项**：编み上げ线稿竖条非常适合作为选中项左侧 6–8px 的装饰条（线稿比实心更轻）。
  - **数据表背景**：心形 + 圆点规则点阵（极低对比）可作为表格区背景纹理，规则排列不会干扰阅读。
- 不适合迁移：上下扇贝边太粗（约 7% 高度），在 h-8 标题栏上必须缩小。

---

### 21. sozaino-jirai-heart-lace-16x9 — 「地雷系なハートとレースの背景」16:9

![素材のサイト 地雷系ハートとレース背景](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/sozaino-jirai-heart-lace-16x9.png>)

- 来源：https://sozaino.site/archives/23762 （文章 1280×720 预览图）；作者/版权：素材のサイト（sozaino.site）
- 实际观察：
  - **亮粉底（目测 #FF7BAC）+ 深粉圆点点阵**；左上和右下有**斜向 45° 的炭灰（目测 #4A4A4A）宽带**，带边缘是**扇贝蕾丝 + 镂空小粉心 + 白色虚线缝线（ステッチ）**，左上带子上系一个粉色蝴蝶结丝带。
  - 散落元素：光泽立体心（粉、白、炭灰三种）、竖排三个小黑蝴蝶结“⋈⋈⋈”、白色小蝴蝶结、卷曲小丝带“∂”、描边空心心形、白色小勾。
- **对 VRCX 的可迁移点：**
  - **状态栏 / 标题栏**：“炭灰带 + 扇贝蕾丝边 + 白色虚线缝线”可以水平化，作为标题栏下沿的蕾丝线（レース線）。**虚线缝线**是非常好用的细节：可直接做 1px dashed 白线放在深色条内。
  - **右详情封面**：斜向蕾丝带 + 蝴蝶结可作为封面图左上角的装饰角标。
  - **竖排三蝴蝶结 ⋈⋈⋈** 可作为列表分组标题前缀或滚动条滑块上的纹样。
- 不适合迁移：亮粉底饱和度过高，作 VRCX 大面积背景会刺眼，宜降为装饰带颜色。

### 22. sozaino-jirai-heart-lace-9x16-summary — 同系列 9:16 全 12 色概览

![素材のサイト 地雷系ハートとレース背景 竖版多色概览](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/sozaino-jirai-heart-lace-9x16-summary.png>)

- 来源：https://sozaino.site/archives/23800 （文章预览图，站方自制的多色概览）；版权：素材のサイト
- 实际观察：竖版同系列的 12 色色条：紫、红褐、橙、浅蓝、米灰、绿、红、黄、紫、蓝、粉，以及完整粉色版；所有色版**炭灰蕾丝带、炭灰心、⋈⋈⋈ 保持不变**，只变底色和丝带/立体心的颜色；最上一条色版底色是暗紫灰。
- **对 VRCX 的可迁移点：**
  - 再次证实“**固定炭灰装饰 + 可换底色**”的配色系统——VRCX 主题可以把“炭灰 + 白缝线”设为不变量，强调色做成用户可选。
  - 竖版构图（顶部丝带 → 中部散布 → 底部蕾丝）适合左导航栏的纵向装饰节奏。
- 不适合迁移：橙、黄、绿色版偏离病みかわ/粉黑主调。

### 23. sozaino-koakuma-ribbon-bg — 「かわいい小悪魔リボン背景」

![素材のサイト 小悪魔リボン背景](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/sozaino-koakuma-ribbon-bg.png>)

- 来源：https://sozaino.site/archives/27584 ；版权：素材のサイト
- 实际观察：中粉底（目测 #FFA8CC）；上下是**炭灰（目测 #47424A）宽边 + 扇形蕾丝花边**（每个扇形内有放射状镂空，比普通扇贝更像真蕾丝），蕾丝外侧还有一条细点线；左右各一条**实心炭灰交叉系带柱**，顶端是黑蝴蝶结；底纹是灰粉色（低对比）骷髅头、心、十字（包括倒十字）、卷曲丝带。
- **对 VRCX 的可迁移点：**
  - **标题栏下沿 / 状态栏上沿**：放射纹扇形蕾丝是最“真蕾丝”的レース線，可简化为 SVG 平铺。
  - **左导航右边界**：竖向交叉系带柱作为导航栏与数据表之间的分隔条（宽度 8–10px）。
  - **空状态插画**：骷髅 + 心 + 十字的低对比底纹，用于“没有好友在线”的空状态背景。
- 不适合迁移：倒十字等宗教符号在部分用户中可能引起不适，主题默认不建议使用；骷髅偏哥特，地雷系主线可少量。

### 24. sozaino-amiage-ribbon-bg — 「編み上げリボンのかわいい背景」

![素材のサイト 编み上げリボン背景](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/sozaino-amiage-ribbon-bg.png>)

- 来源：https://sozaino.site/archives/13340 ；版权：素材のサイト
- 实际观察：玫红粉底（目测 #F070A8）+ **细菱格（格子）底纹**；上下是**梅紫色（目测 #5E3A55）**的双层扇贝蕾丝边（扇贝上有小圆孔点）；左右两条梅紫编み上げ系带柱，顶端蝴蝶结；散落梅紫实心/空心心形和飞舞的蝴蝶结。装饰色是**梅紫而不是黑**。
- **对 VRCX 的可迁移点：**
  - **暗色变体的装饰色**：用梅紫替代炭黑，可得到更柔和的“粉 + 梅紫”方案，适合不想要纯黑对比的用户。
  - **数据表斑马纹替代**：细菱格底纹可替代传统斑马纹作为表格区底纹（需极低对比）。
- 不适合迁移：底色饱和度高，整体只适合作为预览图/登录页背景，不适合工作区。

### 25. sozaino-ribbon-lace-frame — 「リボンとレースのかわいい背景」（薄荷 × 红豆配色）

![素材のサイト リボンとレース背景 薄荷配色](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/sozaino-ribbon-lace-frame.png>)

- 来源：https://sozaino.site/archives/25640 ；版权：素材のサイト
- 实际观察：与 #21 同一套构图（斜向蕾丝带 + 蝴蝶结 + 散落心/蝴蝶结/卷丝带），但配色为**薄荷绿底（目测 #8CC9AE）+ 红豆/暗玫红蕾丝带（目测 #A85A68）+ 白色描边**；带上是绿色心形镂空；这里蕾丝带有白色外描边，比 #21 更“贴纸感”。
- **对 VRCX 的可迁移点：**
  - 说明这套地雷系装饰语言可以脱离粉色存在——**“蕾丝带 + 白描边贴纸感”**可作为 VRCX “薄荷 / 甜品色”变体的参考（呼应 NSO 窗口底部的薄荷青条）。
  - 白色外描边的贴纸式装饰适合放在深/浅两种底上都清晰。
- 不适合迁移：绿色系不是本主题主色，仅作为变体参考。

---

## 三、其他：Landmine Princess（Steam）与服饰品牌视觉

### 26. landmineprincess-steam-title-menu — 标题菜单

![Landmine Princess 标题菜单 故障风](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/landmineprincess-steam-title-menu.jpg>)

- 来源：https://store.steampowered.com/app/3263330/ ；开发/发行：Jeistar
- 注意：该游戏 Steam 页内容说明含粗口和性话题文字；本图为标题菜单，只看版式。
- 实际观察：
  - 全屏**数字故障（glitch）+ 扫描线 + 色彩量化**的角色照片式背景，色调为灰紫、淡粉、橄榄黄、黑。
  - 顶部一排**全大写像素/等宽英文数值标签**（AFFECTION / TRUST / … / RESENTMENT）+ 下方 “00” 数字，左上一个小头像 + “DATE 1/5”“♪ Now Playing”。
  - 中央标题：黑色矩形框 + 暗红噪点外框，内部**洋红（目测 #E020C0）斜体横条纹字** “LANDMINE PRINCESS”。
  - 菜单按钮：深灰半透明长方块（目测 #4A4648）+ 白色日文，第三个按钮为纯黑。
  - 左下角是很小的等宽英文工具按钮（TOGGLE WINDOW MODE / NO GLITCHES PLEASE 等）；右下角是很小的调试文字。
- **对 VRCX 的可迁移点：**
  - **状态栏**：顶部“大写等宽标签 + 下方数字”的横排 HUD，可迁移为状态栏右侧的统计组（Online / Friends / Instances）。
  - **登录页（暗色变体）**：黑底 + 洋红斜体条纹标题字 + 深灰半透明按钮，适合作为“暗黑地雷系”登录页方向。
  - **“关闭特效”开关**：游戏自带 “NO GLITCHES PLEASE” 开关的做法值得借鉴——VRCX 主题若加故障/扫描线特效，必须提供关闭选项（也是无障碍需要）。
- 不适合迁移：全屏故障图像（影响可读性、可能引发光敏不适）；角色图像。

### 27. landmineprincess-steam-dialogue-ui — 对话界面

![Landmine Princess 对话界面](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/landmineprincess-steam-dialogue-ui.jpg>)

- 来源：https://store.steampowered.com/app/3263330/ ；开发/发行：Jeistar（右下角有 JEISTAR 水印）
- 实际观察：
  - 布局：左侧窄栏（深紫黑底 + **洋红细线电路/迷宫纹样**），上有白色描边像素手写体标题“infidelity inbound”“Android MINA”、一张 ASCII/点阵化的角色小图、名字“MINA”；右侧大图为 RGB 色散 + 扫描线的角色特写。
  - 下方对白区纯黑，**橙黄色（目测 #F0A030）全大写等宽字**；“NEXT”“SKIP: OFF”按钮是**带噪点纹理的暗紫方块 + 白色像素字**。
  - 顶部同样是数值 HUD。
- **对 VRCX 的可迁移点：**
  - **三栏结构对照**：左窄栏信息 + 右大图 + 底部文本区，与 VRCX “右详情面板（封面 + 信息）”结构相近；左栏的“洋红电路细线纹样”可作为暗色主题侧栏底纹。
  - **按钮**：带噪点纹理的暗紫方块按钮，可作为暗色变体按钮的质感参考（纹理需极轻）。
  - **ASCII/点阵化头像**：可用于“头像未加载”或“离线用户”的头像处理（把头像转成点阵/单色）。
- 不适合迁移：橙黄色文字与粉黑主调冲突；文案内容；强色散特效。

### 28. dreamvs-ec-banners-sheet — 夢展望 EC 横幅（量産・地雷・ガーリー）

![夢展望 EC 横幅拼合](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/dreamvs-ec-banners-sheet.jpg>)

- 来源：https://dreamvs.jp/ （首页横幅图，我把 4 张 750px 宽横幅纵向拼合）；版权：株式会社夢展望（YUMETENBO）
- 注意：横幅含小尺寸真人模特穿搭照（部分可见面部），本参考**只看版式、字体、配色**，不以人物为参考重点。
- 实际观察：
  - 横幅 1：白底，左侧黑色细黑体“新作 & 再入荷”+ 英文小字副标题，右侧三张商品照拼接。
  - 横幅 2：左侧照片、右侧米白底，**暗玫红（目测 #8E2E48）**大字“真似したい♥秋コーデ”，下方一条两端切成**燕尾/箭头形的暗玫红标签带**（白字“掲載アイテム10%OFF”）。
  - 横幅 3：淡灰紫底，“量産・地雷・ガーリー♥”小标题 + 衬线大写 “ONE PIECE”，左右商品抠图（黑×粉、黑、灰、淡蓝紫洋装）。
  - 横幅 4：米白底，左侧**灰玫瑰色（目测 #B5506A）右端尖角标签**“全品対象”，中间灰玫瑰色大字“ポイント 5 倍”，右侧黑色“▸ 10.13 10:59”。
  - 文字中的 ♥ 都是填色心形，和文字同色。
- **对 VRCX 的可迁移点：**
  - **品牌色参考**：真实地雷系服饰电商的主色是**暗玫红 / 灰玫瑰 + 米白 + 黑**，比素材站的亮粉更“成熟”，适合作为 VRCX 工作区的低疲劳主色。
  - **标签/徽章**：一端尖角（箭头形）的实心标签带 = 数据表中的状态徽章（“Friend”“Favorite”“New”）。
  - **分组标题**：“量産・地雷・ガーリー♥”这种“中点分隔 + 末尾小心”的小标题，可用作左导航分组标题。
  - **字体搭配**：日文用细黑体，英文大标题用高对比衬线体——适合登录页/空状态大标题。
- 不适合迁移：模特照片；促销文案。

### 29. dreamvs-ec-pricedown-banner — 夢展望 PRICE DOWN 竖幅

![夢展望 PRICE DOWN 竖版横幅](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/art-references/dreamvs-ec-pricedown-banner.jpg>)

- 来源：https://dreamvs.jp/ （首页轮播竖幅 600×750）；版权：株式会社夢展望
- 实际观察：灰褐（目测 #A8A08E）外底 + 白色内卡片，**内卡片四角是内凹圆弧切角（票券/相框式）**，外圈还有一条细描边沿切角走；顶部黑色细字“今着たい”+ 橄榄金“秋服。”；中部**暗玫红高对比衬线大字**“PRICE DOWN”；下方黑色小字两行 + 一颗暗玫红 ♥；底部一排商品抠图（黑白女仆风连衣裙、酒红衬衫、黑纱连衣裙、黑长靴、带黑领结的米色针织裙）；最底部宽字距 logo “YUMETENBO”。
- **对 VRCX 的可迁移点：**
  - **弹窗 / 卡片外形**：“内凹圆角（票券角）+ 内描边”是很优雅的地雷系卡片外框，可用于用户详情卡、世界信息卡（CSS radial-gradient mask 可实现）。
  - **配色**：暗玫红 + 米白 + 灰褐 + 黑——一套“低饱和成人向地雷系”色板，可作为 VRCX 的“Classic / 成熟”变体。
  - **logo 字形**：宽字距全大写细衬线 = 标题栏应用名的排版参考。
- 不适合迁移：商品图；促销文案。

---

## 风格语言总结

### 反复出现的元素（按出现图数统计，共 29 节 / 30 张图，计数为“该元素清晰可见的图数”）

| 元素 | 出现图数（约） | 主要来源 | 备注 |
|---|---|---|---|
| ハート（心形，含实心/空心/立体光泽/镂空） | ~22 | 素材站全部、NSO（双心图标、JINE、昵称符号）、Dream Vs 文案 ♥ | 最高频；素材站爱用“立体光泽心”，品牌用“文字同色小心” |
| パステル + 黒（粉彩底 + 炭黑/炭灰装饰） | ~14 | AOmaterial、ラムネ屋、素材のサイト | 黑多为炭灰 #333–#4A4A4A，**几乎不用纯黑** |
| リボン / 蝴蝶结 | ~14 | 素材站全部、NSO（角色发饰） | 大丝带作顶部装饰，小蝴蝶结作列表/缝线终点 |
| ピクセル窗口 / Win9x 窗口 chrome | ~10 | NSO 8 张截图 + 直播骨架 2 张 | 只有 NSO 系；标题栏方块 + 三按钮 + 底部薄荷条 |
| スカラップ / レース線（扇贝边、蕾丝边） | ~11 | AOmaterial、ラムネ屋、素材のサイト | 扇贝（简单）与放射纹蕾丝（复杂）两档 |
| 編み上げ / 系带 / ××× 缝线 | ~11 | AOmaterial（××××）、ラムネ屋（线稿系带）、素材のサイト（实心系带柱） | 几乎都放在左右两侧竖向，底端接蝴蝶结 |
| ドット / 格子（点阵、菱格、心形点阵、像素抖动） | ~10 | ラムネ屋、素材のサイト、AOmaterial 竖版、NSO 波纹/点云 | 规则点阵最适合做表格底纹 |
| 十字架 | ~6 | AOmaterial 两套、素材のサイト 小悪魔 | 通常低对比底纹；含倒十字一例 |
| 天使翅膀 | ~5 | AOmaterial（底纹 + 翅膀十字徽记） | 常与十字组合 |
| 兔头 | ~4 | AOmaterial 两套底纹 | — |
| 圆角条（像创可贴/胶囊） | ~4 | AOmaterial 底纹 | 形状更像创可贴（絆創膏），目测无法完全确定 |
| 药丸 / 胶囊 / 药板 | ~2 | NSO 图标（おくすり）与桌面 | 符号化，像素风 |
| 骷髅 | 1 | 素材のサイト 小悪魔 | 偏哥特 |
| 注射器 | 0 | — | 本次收集到的图里**没有出现**注射器 |
| 故障 / 扫描线 / 双色调网点 | ~3 | Landmine Princess 2 张、Windose Setup | 暗色/登录页方向 |
| 斜切 / 燕尾 / 尖角标签 | ~4 | NSO（斜切选项条、标签卡）、Dream Vs（燕尾/尖角标签） | 适合做徽章 |
| 内凹票券角 / 大圆弧切角 | ~2 | Dream Vs、ラムネ屋 | 卡片外形 |

### 典型配色关系（描述性；HEX 全部为**目测估计**）

1. **NSO 昼间 Windose（像素桌面）**：淡紫粉底（目测 #F3E4F6）+ 浅粉紫标题栏（目测 #EDD5EE）+ 深靛蓝描边/方块（目测 #3A22C8）+ 薄荷青底条（目测 #8EE6DD）+ 天蓝数据条（目测 #5AB0E0）+ 亮粉紫聊天底（目测 #E79BE8）。关系：**冷暖对撞的粉紫 × 靛蓝 × 薄荷**，靛蓝承担所有“结构线”，粉紫承担面，薄荷/天蓝做少量功能色。选中行用语义色（绿/红）整行填充。
2. **NSO 夜间（暗色骨架）**：深藏青（目测 #000033）外框 + 墨青面板（目测 #00222E）+ 洋红强调（目测 #FF33CC）。关系：**极暗冷底 + 单一高饱和洋红**，所有点缀统一洋红。
3. **素材站标准地雷系**：淡粉底（目测 #F9D3DE ~ #FFD0DC）+ 炭灰装饰（目测 #333333 ~ #4A4A4A）+ 白色半透明底纹 + 偶尔亮粉（目测 #FF7BAC）。关系：**低饱和粉面 + 中性炭灰线/块 + 白色细节**；装饰色固定、底色可换是普遍做法。
4. **柔和变体**：玫红粉（目测 #F070A8）+ 梅紫（目测 #5E3A55）——用梅紫替代炭黑，降低对比。
5. **服饰品牌（成熟向）**：米白（目测 #F6F1EC）+ 暗玫红/灰玫瑰（目测 #8E2E48 / #B5506A）+ 灰褐（目测 #A8A08E）+ 黑字。关系：**大面积中性暖白，玫红只用于标题和标签**，饱和度明显低于素材站。
6. **暗黑故障（Landmine Princess）**：纯黑 + 洋红（目测 #E020C0）+ 灰紫/淡粉故障纹 + 橙黄文字（目测 #F0A030）。

### 对 VRCX-0 的总体建议（从以上观察归纳）

- **结构语言**取自 NSO：Windose 标题栏（h-8）、任务栏式状态栏、靛蓝结构线、薄荷收边条、方块项目符号、整行选中填充、淡紫描边方角 tooltip、紫色模态蒙层。
- **装饰语言**取自素材站：扇贝/蕾丝线只放在标题栏下沿和状态栏上沿；编み上げ/××× 只放在左导航选中项或导航与表格之间的分隔条；心形/蝴蝶结/十字/翅膀只作为低对比底纹和分割线中心徽记；数据表正下方不放任何装饰。
- **配色**以“固定炭灰装饰 + 可换粉彩底色”为体系；工作区主色向 Dream Vs 的低饱和玫红/米白靠拢以降低视觉疲劳；暗色变体用 NSO 夜间的藏青 + 洋红。
- 所有特效（故障、扫描线、3D 充气）只作可选，并提供关闭开关。
