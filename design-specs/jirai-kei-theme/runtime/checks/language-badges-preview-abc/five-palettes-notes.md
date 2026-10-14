# Language badge · 五组撞色预览

## 1. 元信息
对象：好友表格语言缩写；目的：只迭代用户已选 C 造型的配色、纠正字体。已加载 huashu-design / ai-artist。仅新增独立预览，未改 runtime 或部署。数据全部虚构。

## 2. 风格定位
硬方角 + 单像素框 + 双色细底条，把地雷系素材的撞色缩进 20px 标签内，不加图标、动画或阴影。

## 3. 色彩 token 与来源
色值是源码中明确存在的 token 或素材颜色的组合适配；不是宣称从参考截图精确采出的新颜色。

| 方案 | 描边 | 背景 | 字色 | 底部小块 | 底部长条 | 依据 |
|---|---|---|---|---|---|---|
| 01 黑莓亮粉 | #ff7fcf | #211a33 | #ffd9ee | #fff1f8 | #ff7fcf | 已查看[粉黑心形蕾丝](<../../../art-references/sozaino-jirai-heart-lace-16x9.png>)，取黑/亮粉/浅色高光关系，具体值适配主题 token |
| 02 樱粉靛蓝 | #6c5ce0 | #ffb8e6 | #361dc3 | #6fe3d3 | #361dc3 | [Windose 截图](<../../../art-references/nso-steam-ss-01.jpg>)、[像素手柄素材总图](<../../../art-references/nso-fandom-desktop-icons-sheet.png>)；#361dc3 来自[现有提取色板](<../../../palette/palette.json>)，其余适配主题 |
| 03 电紫冰蓝 | #ffb8e6 | #4d23cf | #baffff | #ff7fcf | #5bb4e2 | [粉蓝双心](<../../../original-assets/r5/src/heart-pair.svg>) 内 rgb(77,35,207)、rgb(186,255,255)、rgb(91,180,226) 换算；粉色适配主题 |
| 04 蜜桃撞紫 | #d97fc6 | #f8cc96 | #361dc3 | #ff7fcf | #6c5ce0 | [创可贴](<../../../original-assets/r5/src/bandage.svg>) 的 #f8cc96 高光，配主题粉与素材靛蓝 |
| 05 紫夜蜜金 | #f8cc96 | #412b67 | #fbeed4 | #ff7fcf | #e6a463 | 已查看[月亮/钟表素材总图](<../../../art-references/nso-fandom-desktop-icons-sheet.png>) 的紫夜/暖金关系；#412b67 来自现有 NSO 色板，暖金色值来自创可贴源码 |

## 4. 布局
五列同底色、同虚构好友、同间距。标签高 20px、min-width 32px、左右 padding 4px、gap 4px。底条高 2px、左块宽 2px；不外扩、不增加行高。放大区为 3×，标签基本尺寸不变。

## 5. 字体
直接读取[现有字体](<../../../fonts/fonts-body.css>) 的真实 @font-face data URI。badge 用 `font:400 10px/1 var(--wd-body-font-family)`，变量指向 WD Pixel CJK；`font-synthesis:none`，不使用上版的普通 monospace。等待 document.fonts.ready 并验证 document.fonts.check；截图已目视确认字形变化。

## 6. 组件状态
本图展示静态非交互标签，不是假操作按钮。语言缩写不按语种分配不同颜色；各列是候选方案。空语言应保留空单元格；本图不模拟加载、错误、禁用，因为这不是对应状态组件。真实 Tooltip、aria-label 与键盘行为由应用保留，未在此图作实机验证。

## 7. 动效
无动画、无 hover 平移、无闪烁。未改变任何真实 Tooltip 的触发行为或浮层。

## 8. 风格 DNA / 验证
粉黑、粉靛、紫冰、蜜桃紫、紫夜金五种明确不同色彩关系；框、底条、左端小块保持 C 的结构。文字实色对比依次 13.02、6.25、7.67、6.63、10.35，均≥4.5。渲染断言所有列表 badge 为 20px / ≥32px / 10px / WD Pixel CJK，无语言单元格水平溢出。固定宽比较图，不是响应式生产页面；真实窄列多语言 wrapping 仍须实施阶段检验。

## 9. 复用与交付
只在确认选定方案后，将五个颜色变量应用到真实语言列的 span，不全局修改所有 tooltip-trigger。仍需在真实主题完整 CSS cascade 中验证字体、密度与现有 hover/selection。

[五方案预览](<language-badges-five-palettes.png>) · [渲染脚本](<render-five.mjs>) · [验证报告](<five-palettes-report.json>) · [独立 fixture](<five-palettes-fixture.html>)
