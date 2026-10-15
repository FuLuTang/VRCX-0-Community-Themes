# P1-G1：kbd 与 kbd-group 普查

## Inventory 全量记录
来源 `baseline/reports/component-variant-inventory.json`。字段 `computedStyle` 没有独立的 `border`、`padding` 项；表中 border 合并展示四边采集值，padding 标为未采集。

### kbd

| 主 context | 观察数 | 指纹数 | routes |
|---|---:|---:|---|
| surface:main-content | 6 | 1 | `/game-log`、`/notification`、`/social/friend-list` |
| surface:titlebar | 84 | 1 | `/activity`、`/browse-history`、`/charts`、`/charts/mutual`、`/charts/timeline`、`/charts/two-person`、`/community-themes`、`/dashboard/:placeholder`、`/favorites/avatars`、`/favorites/friends`、`/favorites/groups`、`/favorites/import/friends`、`/favorites/worlds`、`/feed`、`/friends-locations`、`/game-log`、`/instance-history`、`/login`、`/my-avatars`、`/notification`、`/player-list`、`/search`、`/settings`、`/social/friend-list`、`/social/friend-log`、`/social/moderation`、`/themes`、`/tools`、`/tools/gallery`、`/tools/group-moderation`、`/tools/inventory`、`/tools/my-groups`、`/tools/screenshot-metadata`、`/tools/vrchat-log` |

| context/观察 | fingerprint | background | border（四边） | radius | font-family | font-size | padding | box-shadow | color |
|---|---|---|---|---|---|---|---|---|---|
| main-content / 6 | `9d62c6668cc1bf10` | `rgb(33, 26, 51)` | 0.8px solid `rgb(108, 92, 224)` | 未采集 | `"Geist Variable", Geist, "Noto Sans SC", system-ui, sans-serif` | 12px | 未采集 | `inset 1px 1px rgb(253 244 255)` 等价采集值：`rgb(253,244,255) 1px 1px 0 0 inset, rgb(122,63,109) -1px -1px 0 0 inset` | `rgb(242, 235, 255)` |
| titlebar / 84 | `21c0150aaf996403` | `rgb(255, 242, 251)` | 0.8px solid `rgb(26, 18, 38)` | 未采集 | 同上 | 9px | 未采集 | `rgb(255,255,255) 1px 1px 0 0 inset, rgb(122,63,109) -1px -1px 0 0 inset` | `rgb(22, 17, 42)` |

### kbd-group

| 主 context | 观察数 | 指纹数 | routes |
|---|---:|---:|---|
| surface:main-content | 6 | 1 | `/game-log`、`/notification`、`/social/friend-list` |
| surface:titlebar | 42 | 1 | `/activity`、`/browse-history`、`/charts`、`/charts/mutual`、`/charts/timeline`、`/charts/two-person`、`/community-themes`、`/dashboard/:placeholder`、`/favorites/avatars`、`/favorites/friends`、`/favorites/groups`、`/favorites/import/friends`、`/favorites/worlds`、`/feed`、`/friends-locations`、`/game-log`、`/instance-history`、`/login`、`/my-avatars`、`/notification`、`/player-list`、`/search`、`/settings`、`/social/friend-list`、`/social/friend-log`、`/social/moderation`、`/themes`、`/tools`、`/tools/gallery`、`/tools/group-moderation`、`/tools/inventory`、`/tools/my-groups`、`/tools/screenshot-metadata`、`/tools/vrchat-log` |

| context/观察 | fingerprint | background | border（四边） | radius | font-family | font-size | padding | box-shadow | color |
|---|---|---|---|---|---|---|---|---|---|
| main-content / 6 | `8a7619982fd67572` | `rgba(0,0,0,0)` | 0px solid（采集边色 `rgb(108,92,224)`） | 未采集 | `"Geist Variable", Geist, "Noto Sans SC", system-ui, sans-serif` | 12.8px | 未采集 | none | `rgb(227, 210, 245)` |
| titlebar / 42 | `8a7619982fd67572` | 同上 | 同上 | 未采集 | 同上 | 同上 | 未采集 | none | 同上 |

`kbd-group` 是被观测的 `<kbd>` 组容器标记；以上两行 styleVariants 完全相同。inventory 汇总的 context 是组件自身归属，不足以精确断言每个元素位于 tooltip、快捷键设置页或菜单项：实际可确认的是 titlebar（标题栏快捷键提示）与 main-content；后者的具体子界面/浮层位置无法仅凭该 context 字段确定。它覆盖了大量 route，不能据此说每个 route 都有独立快捷键页面。

## 样式层所有命中规则

| 文件 / SECTION / 行 | 选择器 | 实际声明 |
|---|---|---|
| `src/style/13-toolbar-overlays-and-pages.css` / `fields-toolbar-r10` / 97–100 | `:where([data-slot="kbd"])` | `border:1px solid #6c5ce0; border-radius:0; background:#211a33; color:#f2ebff; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d;` |
| 同文件 / 同 SECTION / 101 | `:where([data-slot="kbd-group"])` | `gap:1px` |
| `src/style/03-chrome.css` / `window-chrome`（第二 SECTION 注释 chrome · Windose × Jirai — window chrome R3）/ 133–146 | `.vrcx-0-titlebar[data-app-titlebar] button.vrcx-0-toolbar-control[data-vrcx-0-control='toolbar'] kbd[data-slot='kbd']` | `height:16px; min-width:16px; padding-inline:3px; border:1px solid var(--jk-chrome-edge); border-radius:0; background-color:var(--jk-r4-keycap); color:var(--jk-chrome-ink); box-shadow:inset 1px 1px 0 #fff, inset -1px -1px 0 var(--jk-chrome-bevel-dark);`。注释 133–135 明确说明亮面、1px 边框、bevel、深色文字，14px→16px。 |

未找到独立 `[data-slot="kbd-group"]` 的其他命中；也没有裸 `kbd` 规则（但上面的属性选择器明确覆盖 `<kbd>`）。选择器用 `:where()`，权重为零；标题栏特例权重很高，用于保持局部 keycap 样式。

## 核心判断（证据）

- **主题确实给 kbd 做了样式，不是零覆盖。** 行内 keycap 的暗底 `#211a33`、紫边、亮左上/暗右下 inset bevel 是凸起（弹起）效果；证据为 13 号样式层 97–100，且 inventory main-content 的 computed box-shadow 与之相符（inventory 1407–1420）。标题栏快捷键则为浅色键帽 `--jk-r4-keycap:#fff2fb`，同样凸起；规则 03-chrome.css 121–123、133–146，inventory 1495–1509。
- **font-family：** kbd 本身明确用无衬线，而不是等宽。03-chrome.css 113–114 记录组件链路及 `<kbd data-slot="kbd">`；04-group-spacing-and-typography.css 68–71 明言“Source Kbd is sans, not mono”，并设 `kbd:not(.font-mono) { font-family: var(--vrcx-app-font-family, system-ui), sans-serif; }`。Inventory 两处亦均显示 Geist Variable / Geist / Noto Sans SC 栈（分别 1428、1517）。所以不会因为 UA 默认而继承正文；对于短快捷键提示，这是已采纳的 app 语义，不能仅因通常习惯就判为 bug。Frozen 01-fonts.css 的 WC 字体资源定义在 197–199；它没有为 kbd 指定 mono 栈。样式层确有通用 mono 栈示例 04-group-spacing-and-typography.css 65 行，但属于 `--font-mono` token fallback，不代表 kbd 当前使用它。
- **font-size / padding：** 通用 slot 规则 13 号文件 97–100 没有设置二者；交给 app/utility。inventory 观测到 main-content 12px、titlebar 9px（1429、1518），非主题 slot 规则主动赋值。标题栏局部特例则明确设 `padding-inline:3px` 与 16px 高、16px 最小宽（03-chrome.css 137–139）。
- **border-radius：** 两处实际 CSS 均明确 `0`（13 号文件 98、03-chrome.css 141），不是 `--jk-px-cut`，也没有露出圆角默认。注意 inventory 未采集 radius，此结论来自规则本身而非 fingerprint。
- **组合键：** 组容器 `data-slot="kbd-group"` 的 gap 明确为 1px（13 号文件 101）。inventory 只观察到容器的透明/无边框样式，没记录组内 DOM 子节点，无法确定 `+` 是文本节点还是元素；仅可确认有快捷键组组件。不要编造分隔符结构。
- **位置：** titlebar 84 个 kbd 观察、42 个 group 观察；main-content 各 6 个。标题栏是有直接证据的快捷键提示位置；main-content 路由列见上表，但具体落在 tooltip、快捷键设置页或菜单右侧无法从这些 context 精度确定。03-chrome.css 113–114 确证快捷键组件渲染链是标题栏 toolbar → `KeyboardShortcut.tsx` → `kbd.tsx`。

## 可合并性与收敛建议

建议**两种外观**：①正文/行内通用 keycap（单键和组合中的每个键共用）；②标题栏专用浅色紧凑 keycap。组容器是布局而非第三种键帽外观，保留其 `gap:1px`；单键与组合键可共用同一 keycap 规则，因为现有通用 `kbd` 观测均只有一种指纹，组合组自己的差异仅布局。行内 12px 与标题栏 9px/16px盒框是明确的尺寸及背景差异，不应强行合并为一款。

CSS 可将通用声明集中到 `:where([data-slot="kbd"])`（背景、边框、方角、凸起 box-shadow、颜色），并保留 `:where([data-slot="kbd-group"]) { gap:1px }`；标题栏 scoped selector 继续覆盖 face、ink、尺寸和 padding。当前通用选择器 specificity 是 `(0,0,0)`（`:where()` 内部不计权重），并非裸 `kbd` 的 `(0,0,1)`；若改成裸 `kbd`，它会比 utility 类型选择器多一档/同类冲突时可能改变覆盖结果，必须做级联复核。标题栏特例 specificity 高，改成公共基类后别误删其局部覆盖。

## 可视化说明

配套 `preview/P1-G1-kbd.html` 左栏复现主题真实通用 keycap 与标题栏 keycap 规则；右栏是常见浏览器 UA `<kbd>` 默认外观的说明性近似。UA 样式由浏览器实现决定，HTML 无法跨浏览器保证一模一样；右侧明确标注为示意。可视化含单键、Ctrl + K 组合，行内尺寸和标题栏独立尺寸。
