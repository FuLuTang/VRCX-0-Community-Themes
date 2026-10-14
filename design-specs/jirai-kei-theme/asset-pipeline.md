# 原创素材重绘与 CSS 接入规格

更新：2026-10-11。目的：把[艺术主参考](<art-style-review.md>)里的视觉语言**原创重画**成我们自己的素材，并保证它们能被 VRCX-0 社区主题的 CSS 真正加载。

## 1. 已核实的运行约束（来自主程序源码，只读）

| 约束 | 证据 | 对素材的影响 |
|---|---|---|
| 安装后只下载 `theme.json`／`theme.css`／`README.md`／`preview.webp` 四个文件，CSS 以 `<style>` 的 `textContent` 注入 | `crates/contracts/src/community_theme_protocol.rs`、`src/services/vrcx0CssLayerService.ts` | 相对路径 `url(./x.svg)` 在安装后**不会解析**。只有 DevKit 预览会改写相对路径，不能拿它当实机证据 |
| CSP `img-src` 包含 `'self' https: data: blob:` 等 | [tauri.conf.json](</home/fulutang/Documents/Github/VRCX-0-jirai/src-tauri/tauri.conf.json#L15-L31>) | data URI 图片可用；GitHub raw 这类 https 地址也可用（需 `remoteAssets: true`） |
| CSP 未声明 `font-src` | 同上 | 远程或 data URI 字体可能被默认策略拦截，**UI 不依赖自定义字体**；像素字体只用于预览图 |
| 主题 CSS 不经过 Tailwind 编译，不能 `@import` 远程 CSS，单文件上限 1 MiB | 主题仓库 `CONTRIBUTING.md`、`docs/css-hooks.md` | 素材必须体积小；SVG 用 URL 编码，不用 base64（base64 约膨胀 34%） |
| 弹窗 `[data-slot="dialog-content"]` 带 `overflow-y-auto`、`p-4` | [dialog.tsx](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/dialog.tsx#L68-L97>) | 在弹窗上用绝对定位伪元素做装饰，会随内容滚动并被裁切 |
| 标题栏 `h-8`，右侧是真实窗口按钮 | [AppTitleBar.tsx](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/layout/AppTitleBar.tsx#L88-L169>) | 标题栏只能放贴底的细条装饰，不能盖住按钮 |
| 可用钩子：`.vrcx-0-titlebar`、`.vrcx-0-sidebar-surface`、`.vrcx-0-main-content`、`.vrcx-0-side-panel`、`.vrcx-0-statusbar`、`.vrcx-0-data-table`、`.vrcx-0-table-header`、`data-slot` 属性 | 主题仓库 `docs/css-hooks.md` | 素材按这些落点设计尺寸；钩子本身不是永久契约 |

运行环境：Windows 上是 WebView2（Chromium），支持无前缀 `mask`；为保险仍同时写 `-webkit-mask-*`。

## 2. 素材格式规则

1. **单色 SVG**：透明底、只有一种 `fill`（黑色），不含文字、外链、滤镜、渐变、`<image>`。颜色由 CSS 决定，这样同一份素材可以服务三个方向和深浅两种模式。
2. **双色素材拆层**：例如带高光的像素心，拆成“主体”和“高光”两个单色 SVG，CSS 叠两层。
3. **尽量只用 fill**：描边转为填充路径，避免不同缩放下线宽漂移。
4. **整数网格**：`viewBox` 从 0 开始、宽高为整数；像素画每格 1 单位，加 `shape-rendering="crispEdges"`。
5. **周期和高度取 4px 的倍数**：Windows 常见 125%／150%／175% 缩放下，4 的倍数乘出来仍是整数物理像素，平铺接缝最少。
6. **体积**：单个压缩后不超过 1.5 KB，全套内联进 CSS 不超过 20 KB。

## 3. 两种接入方式

### 方式 M：mask＋伪元素（首选，可随 token 换色）

```css
:root {
  --jk-deco: #3a3236;                     /* 装饰色，方向/深浅各自设定 */
  --jk-mask-scallop: url("data:image/svg+xml,...");
}
.vrcx-0-side-panel { position: relative; }
.vrcx-0-side-panel::before {
  content: "";
  position: absolute; inset: 0 0 auto 0; height: 8px;
  background-color: var(--jk-deco);
  -webkit-mask: var(--jk-mask-scallop) repeat-x 0 0 / 16px 8px;
          mask: var(--jk-mask-scallop) repeat-x 0 0 / 16px 8px;
  pointer-events: none;
}
```

适用：标题栏底边、侧栏激活项、右侧面板头部、状态栏、不滚动的卡片。

### 方式 B：构建时烘焙颜色的 background 层（用于滚动容器）

弹窗、表头等不方便挂伪元素或带滚动的元素，把颜色直接写进 SVG 的 `fill`，作为 `background-image` 的额外一层，用 `background-attachment: local` 或固定在边缘：

```css
[data-slot="dialog-content"] {
  background:
    var(--jk-bg-scallop-top) repeat-x top left / 16px 8px,
    var(--popover);
}
```

缺点是颜色写死；所以构建脚本要能按“方向色板 JSON”批量生成烘焙版本。

## 4. 第一批素材清单（三个方向共用）

| 编号 | 名称 | 尺寸（viewBox / CSS） | 用途 | 参考了哪种构造（只学构造，不描图） |
|---|---|---|---|---|
| S1 | 波瓣蕾丝条 | 16×8，另出 24×12 | 面板上下沿、弹窗顶边、状态栏 | 素材站的炭灰半圆波瓣＋小孔 |
| S2 | 扇形蕾丝条 | 20×12 | ③深色方向的面板边 | sozaino 小恶魔的扇形镂空边 |
| S3 | 缝线虚线 | 8×4 | 卡片内圈缝线（比 CSS dashed 可控） | 素材站的白色缝线 |
| S4 | 系带柱平铺 | 16×16，纵向重复 | 右侧详情封面两侧 | 编み上げ，要表现上下压叠 |
| S5 | 系带收口结 | 24×16 | 系带柱底端／顶端 | 同上 |
| S6 | 蝴蝶结 | 24×16 与 32×20 | 激活项、卡片角、空状态 | 两个环＋结＋两条尾，自行设计轮廓 |
| S7 | 圆润爱心 | 12×12 与 16×16 | 点缀、分隔 | 通用图形 |
| S8 | 像素爱心（主体＋高光两层） | 9×8 网格 | ①方向点缀、分隔线 | 用户漫画图与 NSO 的像素心构造 |
| S9 | 像素锯齿底纹 | 16×8 | ①桌面底纹（极低对比） | NSO 桌面的浅蓝锯齿波 |
| S10 | 抖动点阵云 | 64×32 | ①右侧详情或空状态角落 | JINE 背景的角落点阵云 |
| S11 | 符号散布底纹 | 96×96 | ②③的低对比底纹 | 素材站的心／结／十字／兔／创可贴散布 |

纯 CSS 实现、不做成文件的：紫黑格纹（`repeating-linear-gradient`）、点线下划线、Windose 标题栏的靛蓝方块、四角内凹框（`radial-gradient`）。

S11 的兔子要画成通用简笔，避免像某个现成角色；十字只用普通拉丁十字，不用倒十字。

## 5. 原创要求

- 只按“构造描述”重画：例如“半圆波瓣，每个半圆中心一个小孔”。**禁止**把参考图放进编辑器描摹、取轮廓、自动矢量化，或在参考图上测量坐标。
- 每个素材写一句设计说明和绘制方法（手写路径 / 程序生成），记录在 `provenance.md`。
- 素材作者为本项目；许可建议与主题仓库一致（GPL-3.0-only），最终由用户确认。

## 6. 验证要求

1. 在 Chromium 中用 HTML 样板实际按方式 M 和方式 B 渲染，不只看单张 SVG。
2. 设备像素比 1、1.25、1.5、2 各截一张，检查平铺接缝和像素画是否发糊。
3. 浅底和深底各测一次。
4. 样板里放一个模拟 h-8 标题栏、一个侧栏激活项、一个**内容可滚动**的弹窗，证明方式 B 在滚动容器中不被裁切。
5. 报告每个素材压缩后字节数和 URL 编码后字节数，以及全套总量。

## 7. 交付位置

`design-specs/jirai-kei-theme/original-assets/`：`src/`（可读源 SVG）、`dist/`（压缩版和生成的 `jirai-assets.css`）、`build.mjs`、`specimen.html`、截图、`provenance.md`、`README.md`。不改 `themes/`，不改主程序，不做 git 操作。

## 8. 结果（2026-10-11）

第一轮由 luna 绘制，它中途两次因额度中断；工程链路合格，但 S1／S2／S5／S8／S10／S11 画面不合格。第二轮由 Lead 用 [gen.mjs](<original-assets/gen.mjs>) 按构造规则程序化重画，S3／S6／S7 保留。来源说明见 [provenance.md](<original-assets/provenance.md>)。

### 素材 4 倍放大对照（浅底／深底，每个平铺 2–3 个周期检查接缝）

![S1–S11 原创素材 4 倍放大对照](<original-assets/screenshots/assets-4x-sheet.png>)

### Chromium 实测样板（DPR 1.25，模拟 Windows 125% 缩放）

![原创素材在模拟 VRCX 界面中的实测，DPR 1.25](<original-assets/screenshots/specimen-dpr-1-25.webp>)

其余倍率：[DPR 1](<original-assets/screenshots/specimen-dpr-1.webp>)、[DPR 1.5](<original-assets/screenshots/specimen-dpr-1-5.webp>)、[DPR 2](<original-assets/screenshots/specimen-dpr-2.webp>)。

### 验证结论

| 检查项 | 结果 |
|---|---|
| data URI CSS 加载、mask 伪元素换色 | 通过 |
| 可滚动弹窗里的烘焙背景边不被裁切、不随内容滚动 | 通过 |
| 标题栏保持 32px，装饰只占底部细条 | 通过 |
| 浅底／深底 | 通过 |
| 浏览器报错、请求失败 | 无 |
| 体积 | mask 共 8,556 B；烘焙版（只给 S1／S2／S3）3,150 B；生成的 CSS 12,249 B，远低于 1 MiB 上限 |

**这些是 Chromium 中的样板验证，不是 VRCX-0 实机截图。** 接入实机前仍需在 DevKit 或真实应用里确认钩子选择器和层级。

### 第三方素材

失败子任务下载的 151 个 SVG 只做了初步分类，见 [assets-report.md](<assets-redistributable/assets-report.md>)：图标库类许可清楚但风格不合；无前缀的 74 个来源未核实，不可公开使用。
