# R9.8 · 01 黑莓亮粉语言标签

## 1. 范围 / 状态
用户已在真实字体五色预览中选 **01**，因此实现已定方向，不再重提方案。仅新增 [语言层](<../../language-badges-r98.css>)、接入 [builder](<../../build-runtime.mjs>) 并生成指定本地 preview-package / build-report。未操作应用、未部署 Windows。已加载 huashu-design / ai-artist。

## 2. 风格
沿用用户选择 C 的方框 + 2px 双色底条（左端 2px 小块），颜色采用黑莓亮粉。没有新图标、伪元素、动画、hover 平移或阴影。

## 3. Token / 色彩依据
描边 #ff7fcf、实底 #211a33、字色 #ffd9ee、底部小块 #fff1f8、长条 #ff7fcf。取现有主题的粉黑关系，五种值与 [已选预览](<../language-badges-preview-abc/language-badges-five-palettes.png>) 一致。色彩实色文字对比 **13.02:1**；截图对边框、实底、端块、长条逐像素采样验证一致。

## 4. 真实 DOM 与 selector 证据
- [好友列](</tmp/vrcx-win-src-r9/src/features/friends/components/FriendListColumns.tsx#L305-L340>)：TableCell > div.flex.flex-wrap.items-center.gap-1 > TooltipTrigger render span。
- [玩家列](</tmp/vrcx-win-src-r9/src/features/player-list/components/PlayerListColumns.tsx#L348-L374>)：相同结构与 utility contract。
- [好友表格](</tmp/vrcx-win-src-r9/src/features/friends/components/FriendListTable.tsx#L133-L164>) 与 [玩家表格](</tmp/vrcx-win-src-r9/src/features/player-list/components/PlayerListViewParts.tsx#L316-L332>) 共用 [DataTableSurface](</tmp/vrcx-win-src-r9/src/components/data-table/DataTableView.tsx#L306-L323>) 的 `.vrcx-0-data-table`。
- [ResizableTableCell](</tmp/vrcx-win-src-r9/src/components/data-table/ResizableTableParts.tsx#L336-L374>) 无 column-id attribute，不能发明 `[data-column=language]`。使用真实 slot + direct-child shape +完整语言 span utility signature。列重排不依赖 nth-child，普通与 sortable cell 都可命中。
- [TableCell](</tmp/vrcx-win-src-r9/src/ui/shadcn/table.tsx#L83-L92>) 是 td[data-slot=table-cell]；[TooltipTrigger](</tmp/vrcx-win-src-r9/src/ui/shadcn/tooltip.tsx#L26-L28>) 提供 tooltip-trigger slot。
- [DashboardInstanceWidget](</tmp/vrcx-win-src-r9/src/features/dashboard/components/widgets/DashboardInstanceWidget.tsx#L445-L468>) 虽复用 badge utility，父元素是 span，不是 wrapping div，因此排除。JP 地区 h-4、普通统计 Badge、表格外同形 trigger、缺少 flex-wrap 的普通 trigger 都不命中。

未来应用若修改 class / span parent，应重新验证，而非将 selector 扩大到所有 tooltip-trigger。

## 5. 字体 / 密度
读取 [字体族变量](<../../fonts-pixel-body.css#L4-L18>)：`var(--wd-body-font-family)` 指向 WD Pixel CJK（真实 Fusion Pixel 字体）。10px/1、400、font-synthesis:none；不再继承 font-mono。测试等待字体加载并检查 canvas glyph width 与 monospace 不同。

应用自带 h-5 / min-w-8 / px-1、父容器 wrap/gap 完全保留；本层不设 width/height/padding/position/display，不改变 border width/style。fixture 中全部22个标签仍 20px 高、32px 宽、左右4px padding。测试160px正常语言列与100px窄列，行高/标签尺寸/原换行方式与去掉本层的 baseline 完全相同，无水平溢出。

## 6. 状态 / 行为
对默认、hover、selected-row、focus 检查标签同一实色与字体；不覆盖原应用 tooltip 开合/aria-label/tabindex/事件。fixture DOM 和属性 before/after 相同，portaled tooltip 样式相同。空语言展示空容器；不把普通统计 Badge、区域标签改成语言皮肤。

## 7. 动效
本层无 animation/transition；正常、prefers-reduced-motion、html.reduce-effects 下静止。保留 app 现有交互。

## 8. 构建 / 验证
```sh
SHARP_MODULE=/tmp/dsh-theme-tools/node_modules/sharp node build-preview.mjs > build-output.json
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node verify.mjs
```
[构建包装器](<build-preview.mjs>) 只允许写指定 preview-package 与 runtime build-report；builder 的 legacy ribbon-heart-charm.svg 写入必须 byte-identical 才抑制，否则失败，不碰 scope 外文件。

[验证脚本](<verify.mjs>) 用当前完整编译 CSS，baseline **只剥离 SECTION language-badges-r98**；确保源 CSS 字节完整出现在包内。包 CSS **1,025,617 B < 1 MiB**，新层1377 B；无远程 URL/@import。14个 decoy（含两表8个无关 trigger）computed styles 不变。源码签名/级联检查、字体、颜色采样、宽窄几何、减少动效均 PASS。

最初一次失败是 Chromium 将 dual-stop gradient 展开为4个 color stop，旧字符串断言错误；读取实际 computed serialization 后修复断言，未改 CSS 来绕过测试。

## 9. 交付 / 未验证
[after](<after.png>) · [before/after](<comparison.png>) · [窄列](<narrow-after.png>) · [10×原像素标签](<label-10x.png>) · [报告](<verify-report.json>)

已 read_image 审查 after/窄列/10×。这是虚构 source-shaped DOM、模拟 app utility 的 fixture，不是 live Windows/BaseUI 验收。待 Lead review 后才决定部署；实机仍须核对 BaseUI render= 最终 slot/键盘焦点/tooltip、虚拟表格/列重排/resize、Windows DPI 和当前 app DOM 与镜像一致性。
