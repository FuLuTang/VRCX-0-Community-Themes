# P1-G2 `tab-indicator` 普查

## 范围与结论先行

只检查 inventory 与 `refactor/src/style/*.css`。Inventory 有记录，不能说它从未在采集状态出现；但 inventory 的 paint fingerprint 不含 `display`，且 CSS 的 `display:none` 仍允许 computed background 等值存在。因此这些指纹**不能证明可见**。样式层对 indicator 的 4 条命中规则全部只设置 `display:none`，没有在该层找到任何重新显示或设计尺寸/定位的规则。对其余未被这些选择器覆盖的场景，不能由此证明隐藏。

**结论：当前被这四条规则命中的主题形态不可见；不能据此断言主题所有形态/页面下完全不可见。建议暂时保留隐藏规则，勿把它作为“已证明全局死代码”整体删除。**若后续能确认应用 DOM/组件中无其他使用者，或决定全主题不再用滑块，再清理重复隐藏规则及组件依赖。

## 1. Inventory 全部记录与 styleVariants

`component-variant-inventory.json` 有 **2 条** `component:"tab-indicator"` 记录（不是缺席）：

| JSON 行 | context | observations / stateCount | styleFingerprintCount | routes |
|---|---|---:|---:|---|
| 7354–7457 | `surface:main-content` | 14 / 14 | 2 | `/activity`, `/browse-history`, `/community-themes`, `/friends-locations`, `/instance-history`, `/notification`, `/search`, `/settings`, `/themes`, `/tools`, `/tools/gallery`, `/tools/inventory` |
| 7458–7542 | `surface:side-panel` | 37 / 37 | 1 | `/activity`, `/browse-history`, `/charts/timeline`, `/charts/two-person`, `/community-themes`, `/dashboard/:placeholder`, `/favorites/avatars`, `/favorites/friends`, `/favorites/groups`, `/favorites/import/friends`, `/favorites/worlds`, `/feed`, `/game-log`, `/instance-history`, `/login`, `/my-avatars`, `/notification`, `/player-list`, `/search`, `/settings`, `/social/friend-log`, `/social/moderation`, `/themes`, `/tools`, `/tools/gallery`, `/tools/group-moderation`, `/tools/inventory`, `/tools/my-groups`, `/tools/screenshot-metadata`, `/tools/vrchat-log` |

- main-content `styleVariants`：fingerprint `f5ae8b116029236c` ×13（行 7380–7411），`7fa7f043acbccafe` ×1（行 7413–7444）。二者 `background-color:rgb(162,148,200)`、四边 `0px solid rgb(108,92,224)`、无边框阴影、`opacity:1`；差异为 text color（前者 `rgb(227,210,245)`，后者 `oklab(0.772417 0.0291363 -0.056142 / 0.72)`）。
- side-panel `styleVariants`：fingerprint `2a037eb289c019cb` ×37（行 7501–7534）：`background-color:rgb(242,235,255)`、四边 `0px solid rgb(108,92,224)`、`box-shadow:none`、`opacity:1`。

fingerprint 属性清单不包括 `display`、`visibility`、尺寸、定位、transform-origin 等。`opacity:1` 不是“重新显示”：元素本身仍可 `display:none`。这里的 computed background 也只能说明取样时样式值，不足以证明像素被绘制；尤其不能排除 inventory 与重构 CSS 的采集基准/覆盖上下文差异。记录存在反而表明采集器观察到了该节点/其样式上下文，不能把“无 inventory 记录”当作证据。

## 2. 样式层所有命中规则（共 4 条）

搜索全部 `refactor/src/style/*.css` 中 `[data-slot="tab-indicator"]`、`[data-slot=tab-indicator]` 或 `.tab-indicator`，找到 4 条；没有发现 `.tab-indicator` 类选择器。

| 文件 / 行 | SECTION | 选择器 | 完整声明 | 范围与形态 |
|---|---|---|---|---|
| `11-controls-and-pages.css:17–19` | `controls-r9`（文件第1行） | `.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"]) [data-slot="tab-indicator"]` | `display:none;` | 主内容 PageScaffold 下非竖向 list；横向像素页面 tabs。不是全局规则。 |
| `06-panels-and-settings.css:165` | `settings`（第102行起） | `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(> [data-slot=tabs-list]) > [data-slot=tabs-list] > [data-slot=tab-indicator]` | `display:none` | PageScaffold 直系竖向 Tabs 的 list；Settings rail。 |
| `11-controls-and-pages.css:414–416` | `tools-ui-r9`（第361行起；专用 Chart 分类 rail） | `.vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]) > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"] > [data-slot="tab-indicator"]` | `display:none;` | 满足 `#chart` 且存在对应工具栏与竖向分类 rail 的 Chart 特例。 |
| `14-buttons-and-data.css:62` | `buttons-badges-r10`（第1行） | `:where(.vrcx-0-main-content,.vrcx-0-side-panel) [data-slot="tabs-list"]:where(:not(.vrcx-0-page-scaffold *):not(.vrcx-0-page-toolbar *):not([class~="bg-popover/70"] *):not(article[data-slot="card"][data-size="sm"] *):not(.object-row__context-action)) > [data-slot="tab-indicator"]` | `display:none` | 主内容或 side-panel 内、排除 page-scaffold/toolbar/popover/小卡片/row-action 的普通嵌入式 tabs。方向未限定；所以它也可能覆盖某些非 PageScaffold 竖 rail。 |

### 覆盖核验

- `display:none`：**4/4 条**。前两条分别覆盖横向 PageScaffold 与 Settings 竖 rail；第三条覆盖指定 Chart 竖 rail；第四条覆盖一类普通 embedded tabs。它们合起来仍不是全局兜底，选择器外场景没有被这些规则证明隐藏。
- 重新显示：**样式层没有找到任何匹配 indicator 的 `display:block/flex/...`、`visibility:visible`、opacity 恢复或其他显示规则。**即使有其他规则，也不能仅凭 grep 证明它是否来自应用基础 CSS、inline style 或运行时样式；本次只对重构样式层下结论。
- 外观：新样式层的 4 条规则只有隐藏声明，没有给 indicator 定义尺寸、背景、定位、位移或 transition。Inventory 有 background computed 值，但其来源/是否实际绘制无法从这两份数据确认。故准确说法是“重构层没有定义 indicator 的可见外观”，不是“它在应用基线里从未设计”。
- 三种形态：横向像素款有明确隐藏规则（11:17）；设置竖向 rail 有明确隐藏规则（06:165）；Chart 分类竖向 rail 有独立隐藏规则（11:414）；folder rail / side-panel 不是同一种 PageScaffold 竖 rail，不能直接拿 06 的 selector 套用。普通 embedded tabs 另由 14:62 覆盖。Inventory 的 main-content / side-panel 记录并没有提供 orientation 字段，所以不能把每个记录精确归入“横向/竖向/folder”之一，也不能证明 side-panel 中每一个 indicator 都命中 14:62（该规则排除若干结构）。

## 3. 选中态由谁绘制？

横向主内容 tabs 的选中视觉由 **`tabs-tab` 自己绘制**，而非 indicator：`11-controls-and-pages.css:32–36` 对直接子 `[data-slot="tabs-tab"]:is([data-active],[aria-selected="true"])` 设置紫边、粉色 `#ffb8e6` 背景、暗字和 inset bevel；hover 另在 28–30 行画紫底亮字。list 在 8–16 行画底槽框和 bevel，indicator 在 17–19 行隐藏。Settings rail 的同一分工可见 `06-panels-and-settings.css:160–169`：list 画 rail 底槽，active tab 画粉色面和 bevel，indicator 隐藏。故“list 画槽、tab 画 hover/active、indicator 在这些 pixel 形态不绘制”证据成立，但不是所有页面都被证明覆盖。

## 4. 收敛建议

**当前选择：保留（暂不整体删除），明确作为可选的滑动选中指示器，而非像素 tabs 的选中态唯一来源。**原因：存在 2 条 inventory 记录和 51 次观察；隐藏规则有多处且范围不全，不能证明其在所有未采集页面/组件中均无用。若产品决定继续隐藏，应把 pixel family 的隐藏策略收敛成有意图的统一 modifier/约定；避免把少数结构专用例外误当全局死代码。

若未来启用 indicator，应只让它承担“当前选中 tab 的连续/滑动位置提示”，尺寸/位置由组件运行时或明确的 CSS 自定义属性提供，并限制在适合的 tabs 家族；与 tab 的 active 背景形成层级，不要同时画两个同强度选中面。概念骨架（**建议稿，未写入 CSS**）：

```css
[data-slot="tabs-list"] { position: relative; }
[data-slot="tab-indicator"] {
  position: absolute; inset-block-end: 0; height: 2px;
  width: var(--tabs-indicator-width);
  transform: translateX(var(--tabs-indicator-offset));
  background: var(--tabs-indicator-color);
  pointer-events: none;
}
/* 像素页签采用 tab 自身 active face 时继续隐藏 */
.vrcx-0-page-scaffold [data-slot="tabs-list"].is-pixel-tabs > [data-slot="tab-indicator"] { display:none; }
```

该骨架只是职责建议：实际 DOM 是否提供宽度/偏移变量、list 是否可建立定位上下文、RTL/vertical 计算与动效行为，本次数据不能确认，落地前需要检查组件实现并在实际页面验证。

## 5. 可视化

见 [P1-G2-tab-indicator.html](../preview/P1-G2-tab-indicator.html)：静态展示未选中、hover、选中三个像素 tab 状态，并把“indicator 存在时”的粉色下划线作为明确标记的假想对照；不启动浏览器，不代表实测截图。
