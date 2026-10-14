# R6 reference-redrawn pixel assets

- 作者：本项目
- 许可：GPL-3.0-only（与主题项目一致）
- 参考式重画声明：本轮按项目权利人授权，参考列出的图像手工重画为 SVG 像素网格；**重画，非原图嵌入**。没有嵌入、降采样、复制参考图的原始位图像素。
- 画法：`shape-rendering="crispEdges"`，像素网格均为整数尺寸；统一采用深色描边、左上高光与右下/底部暗部。建议按 1× 或整数倍显示。

## 素材、接口与用途

| ID / 源文件 | 尺寸 | CSS 变量 | 用途 |
|---|---:|---|---|
| `pattern-heart-check` | 32×32 | `--r5-pattern-heart-check` | 设置侧栏低对比格纹背景 |
| `pattern-heart-dots` | 24×24 | `--r5-pattern-heart-dots` | 面板留白区波点心/蝴蝶结底纹 |
| `pattern-star-dust` | 32×32 | `--r5-pattern-star-dust` | 深色桌面空白区星屑 |
| `lace-band` | 24×24 | `--r5-lace-band` | 对角蕾丝带 repeat tile；背景 `background-size:24px 24px` 重复，建议旋转容器 0°（图案自身斜向） |
| `scallop-edge` | 32×10 | `--r5-scallop-edge` | 面板/卡片边缘横向扇贝饰条，repeat-x |
| `lacing` | 16×32 | `--r5-lacing` | 面板边缘或按钮的纵向系带纹样 |
| `bow` | 24×24 | `--r5-bow` | 标题栏、收藏按钮旁的粉色蝴蝶结 |
| `bandage` | 24×12 | `--r5-bandage` | 输入框、空状态旁小创可贴 |
| `heart` | 30×29 | `--r5-heart` | 按 NSO 图标第 3 行最右大粉心逐格转录的收藏贴纸 |
| `heart-pair` | 30×27 | `--r5-heart-pair` | 按 NSO 图标第 1 行最右双心逐格转录的配对贴纸 |
| `angel-heart` | 28×20 | `--r5-angel-heart` | 空状态、头像侧边装饰 |
| `lock-heart` | 20×24 | `--r5-lock-heart` | 隐私/锁定提示旁装饰 |
| `star` | 18×18 | `--r5-star` | 小徽章、焦点装饰 |
| `cross` | 16×20 | `--r5-cross` | 小型分区标记；非状态语义 |
| `candy` | 24×16 | `--r5-candy` | 通知标签角饰 |
| `cloud` | 24×16 | `--r5-cloud` | 空状态提示 |
| `bunny` | 20×28 | `--r5-bunny` | 小型头像/空状态标 |
| `bubble` | 24×20 | `--r5-bubble` | 评论/聊天气泡提示 |
| `lace-corner` | 24×24 | `--r5-lace-corner` | 卡片单角蕾丝 |
| `window-corner` | 64×64 | `--r5-window-corner` | 桌面窗口装饰角 |
| `ribbon-pendant` | 48×72 | `--r5-ribbon-pendant` | 侧栏/桌面吊坠 |
| `pixel-mascot` | 30×30 | `--r5-pixel-mascot` | NSO 第 4 行第 2 个粉色猫猫头表情的逐像素转录 |

CSS custom properties 位于 `assets-r5.css`，值为已 percent-encoded 的 `data:image/svg+xml` URL。可直接 `background-image:var(--r5-bow)` 等引用。纹样 `.r5-pattern-*` 与 `lace-band` 类附带 repeat 规则；请将低对比纹样置于空背景，避免影响正文可读性。

## 参考来源与借鉴点（全为手工重画）

| 输出 | 参考文件 | 借鉴内容 |
|---|---|---|
| `lace-band` | `sozaino-jirai-heart-lace-16x9.png`、`sozaino-ribbon-lace-frame.png` | 斜向粉底衬带、深色蕾丝带、扇贝外缘、心形孔与虚线走线的层次关系 |
| `pattern-heart-dots` | `sozaino-jirai-heart-lace-16x9.png`、`ramuneya-jirai-lacing-pink.png` | 均匀波点底上稀疏心形/小蝴蝶结的疏密关系 |
| `bow` | `sozaino-jirai-heart-lace-16x9.png`、`sozaino-ribbon-lace-frame.png` | 左上角粉色双环、中心结、三角飘带比例与内侧褶皱 |
| `bandage` | `nso-fandom-desktop-icons-sheet.png`（第三行创可贴图标） | 圆角长条、中央纱布垫、两侧气孔排列；重画为指定黄棕色 |
| `scallop-edge` | `aomaterial-jirai-bg-pink-scallop.png`、`ramuneya-jirai-lacing-pink.png` | 连续扇贝边饰的节奏与大小关系 |
| `lacing` | `ramuneya-jirai-lacing-pink.png` | 纵向交错系带及末端收束 |
| `heart` | `nso-fandom-desktop-icons-sheet.png` 第 3 行最右 | 4×网格精确转录成 30×29 SVG，保留粉色渐变、斜向高光和底部阴影 |
| `heart-pair` | `nso-fandom-desktop-icons-sheet.png` 第 1 行最右 | 4×网格精确转录成 30×27 SVG，保留粉/蓝双心叠放关系 |
| `heart-pair` | `nso-fandom-desktop-icons-sheet.png` 第 1 行最右 | 4×网格精确转录成 30×27 SVG，保留粉/蓝双心叠放关系 |
| `angel-heart`、`lock-heart`、`star`、`cross`、`candy`、`cloud`、`bunny`、`bubble` | `nso-fandom-desktop-icons-sheet.png`；`angel-heart` 另参考 `sozaino-jirai-heart-lace-16x9.png` | 像素图标粗描边、左上高光、右下暗部；心形、翅膀、十字、糖果等结构关系 |
| `lace-corner`、`window-corner`、`ribbon-pendant` | `sozaino-ribbon-lace-frame.png`、`sozaino-jirai-heart-lace-16x9.png` | 角花/边框与缎带装饰的布局层级，以像素网格重画 |
| `pixel-mascot` | `nso-fandom-desktop-icons-sheet.png` 第 4 行第 2 个猫脸 | **NEEDY STREAMER OVERLOAD 游戏图标，用户授权的粉丝转录**。按 4×整数网格中心采样为 30×30 SVG 像素网格，保留源图粉紫脸、深紫描边、蓝紫眼睛；参考位图只用于 QA 对照，不嵌入资源。 |

以上均为矢量手工像素形状；参考图仅用于结构和画法理解，**重画，非原图嵌入**。

## 验证与再生成

`contact-sheet-1x.png` 在 #201936 深底上按各 SVG 原尺寸排版；`contact-sheet-4x.png` 为 4× 整数倍放大；`tile-proof-4x4.png` 将每种 pattern 按 4×4 平铺并 4× 放大检查接缝。`checks/mascot-compare.png` 与 `checks/heart-compare.png` 分别是猫脸、大粉心的 SVG 4×转录与来源裁剪 QA 对照图；来源裁剪只保留在 checks 中，不进入任何 SVG 或 CSS data URI。已目视复查 1×/4×；CSS 预算 ≤120 KB。运行 `node generate.mjs` 可重建源 SVG、CSS data URI 与验证 PNG（依赖 Node.js 22 及 `/tmp/dsh-theme-tools/node_modules/sharp`）。
