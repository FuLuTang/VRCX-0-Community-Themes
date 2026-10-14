# Kenney 图案实验素材处理记录

> 这是素材处理试样，不是 UI mockup、主题实现或配色批准。色值是刻意低对比的技术样本，只用于展示图样密度；是否用于产品及其色值仍待设计审核。

## 来源与许可

- Pattern Pack / Pattern Pack 2 作者 Kenney，原始许可文件分别随目录保留于 `licenses/kenney-pattern-pack-License.txt` 与 `licenses/kenney-pattern-pack2-License.txt`。
- 两份原文均声明 CC0 1.0；可个人、教育及商业使用。署名不是强制要求，作者欢迎注明 Kenney / kenney.nl。
- `raw/` 保存了本次实际使用的 5 张 512×512 PNG 原图；另外保留 0000 与 0004 对应 SVG 原始版本供溯源。未触碰 BOOTH 商品图、人物、商标或限制再分发的素材。
- 选中图样均经逐图视觉查看：Pattern Pack 1 的 75 心形、70 圆点、15 二乘二棋盘；Pattern Pack 2 的 0000 细线方框/对角格与 0004 细线菱格。Pack 2 两项为几何边条/轻纹理候选，不是蕾丝。

## 处理方式

- 将输入 PNG 每个像素的灰度强度映射为 alpha（`alpha = luminance`），输出不透明白色 RGB 形状；对白底黑纹等反向资产不适用。所选输入均是黑底白纹，因此白色图形留下，黑底转为透明。
- 此处特意不使用 `mask-image` 直接套用不透明原图：原图 75 是不透明黑底白心，直接作为 alpha mask 会把背景也变为实体遮罩。灰度到 alpha 后的 `alpha-white.png` 才是正确透明形状；另导出 alpha 保真的**无损 WebP**。
- 粉黑实验：背景 `#171319`、纹样 `#30212b`，相对亮度对比约 1.205:1。
- 粉灰实验：背景 `#302a31`、纹样 `#44363f`，相对亮度对比约 1.229:1。
- 两种候选均分别输出完整 512×512 平铺 PNG 与无损 WebP。候选色对比低于文本/图形可读性标准，不适用于内容、状态或控件，只代表纹样在背景中的低调程度。
- 不制作动画/GIF。唯一样板 `pattern-candidate-specimen.webp` 将透明白纹叠于棋盘底，并在两组候选底色上重复平铺；不是另一个主题 UI。
- 输出核验共比较 15 组 PNG/WebP 配对（30 个文件）：512×512尺寸、alpha及所有可见RGB通道逐像素相同。无损 WebP 编码器可能把完全透明像素的隐藏 RGB 归零，因此核验时忽略 alpha=0 像素的不可见 RGB，不把这种编码规范化误报成图像差异；该规则记录于 `assets-manifest.json` 的 `validation`。

## Alpha 与平铺验证

精确像素计数及每张图的水平/垂直边界诊断均在 `assets-manifest.json`。五张透明版 alpha 范围均为 0–255；心形有 72,419 opaque / 186,657 transparent / 3,068 partial-alpha 像素，圆点为 90,083 / 168,991 / 3,070，棋盘为 131,072 / 131,072 / 0，方格纹为 44,160 / 217,984 / 0，菱格纹为 38,568 / 223,576 / 0。图案的锯齿/软边由源灰度保留。

接缝诊断比较跨 tile wrap 像素最大灰度跳变与 tile 内所有相邻像素的最大跳变；五项横向、纵向均为 `seamNoSharperThanExistingEdges: true`。棋盘与菱格在边界本来就有清晰图形交越，不能错误要求两侧边缘像素值相同；检查的是重复周期边界没有比纹样内部更突兀的跳变。单张样板对各 tile 做了连续重复的实际渲染目视复核。

## 可选参考图审查

- `wikimedia-lace-reference-1000.jpg` 是大幅蕾丝照片/扫描拼合，包含徽章、人像、叶片与网眼等杂项，并非独立可用的透明边框。上方/内矩形边沿虽有窄花边，但需在摄影底色上手工抠取；在 10–16px 高度缩小，细线预计糊成噪点，故不继续做衍生或强行放进样板。
- Owen Jones Plate 043 是橙、绿、蓝为主的摩尔式瓷砖装饰板，色调和主题方向明显不符；不裁图、不衍生。

## 重现与核验

- `node build-assets.mjs` 使用 `/tmp/dsh-theme-tools/node_modules/sharp` 解码像素、生成 alpha/颜色 PNG 与 lossless WebP，并更新尺寸、字节数、源许可及 SHA-256、alpha/接缝统计。
- `node make-specimen.mjs` 用同一 sharp 安装生成唯一 WebP 材料试样并记录尺寸/字节数。
- 输出总计 5 个源图案 × 6 个变体（white RGBA PNG/WebP、pink-black PNG/WebP、pink-gray PNG/WebP）= 30 张纹样图，另有 5 个原图 PNG、2 个 SVG 源图、2 份许可原文和 1 张试样。没有改主题 CSS/manifest、README/index 或主项目文件。
