# P1-G2：浮层触发器普查

## Inventory 汇总
观察数、指纹数按 component+context 记录列出；同一组件跨 context 的 routes 为各条记录并集。`styleVariants` 指纹数为该条记录的 `styleFingerprintCount`。

|组件|context|观察数|指纹数|routes|
|---|---|---:|---:|---|
|context-menu-trigger|surface:main-content|144|1|/feed, /login|
|context-menu-trigger|surface:titlebar|42|2|/activity, /browse-history, /charts(/mutual,/timeline,/two-person), /community-themes, /dashboard/:placeholder, /favorites/avatars,/friends,/groups,/import/friends,/worlds, /feed, /friends-locations, /game-log, /instance-history, /login, /my-avatars, /notification, /player-list, /search, /settings, /social/friend-list,/friend-log,/moderation, /themes, /tools(/gallery,/group-moderation,/inventory,/my-groups,/screenshot-metadata,/vrchat-log)|
|dropdown-menu-trigger|surface:data-table|19|1|/notification|
|dropdown-menu-trigger|surface:main-content|103|4|/favorites/avatars,/favorites/friends,/favorites/import/friends,/favorites/worlds,/social/friend-list,/tools|
|dropdown-menu-trigger|surface:main-content|65|1|/favorites/avatars,/favorites/friends,/favorites/import/friends,/favorites/worlds|
|dropdown-menu-trigger|surface:main-content|12|1|/feed,/game-log,/login,/notification,/social/friend-list,/social/friend-log,/social/moderation,/tools/vrchat-log|
|dropdown-menu-trigger|surface:main-content|92|4|/friends-locations,/my-avatars,/tools/my-groups,/tools/screenshot-metadata|
|dropdown-menu-trigger|surface:main-content|28|1|/tools/gallery,/tools/inventory|
|dropdown-menu-trigger|surface:side-panel|37|1|跨 30 路由（含 /activity、/browse-history、/feed、/login、/settings、/tools 等全局侧栏路由）|
|hover-card-trigger|surface:titlebar|42|2|跨 34 路由（inventory 全路由集）|
|popover-trigger|surface:main-content|3|2|/browse-history,/instance-history|
|popover-trigger|surface:main-content|3|1|/activity,/instance-history,/my-avatars|
|popover-trigger|surface:main-content|4|1|/favorites/import/friends,/favorites/worlds,/tools/inventory|
|popover-trigger|surface:side-panel|37|1|跨 30 路由（全局侧栏路由集）|
|popover-trigger|surface:statusbar|42|1|跨 34 路由|
|sheet-trigger|surface:main-content|9|2|/charts,/charts/mutual|
|sheet-close|overlay:sheet-popup|1|1|/charts/mutual|
|tooltip-trigger|surface:main-content|46|2|/activity,/browse-history,/favorites/*,/friends-locations,/game-log,/instance-history,/my-avatars,/notification,/search,/social/*,/tools/*|
|tooltip-trigger|surface:main-content|9|2|/feed,/login,/social/friend-log,/tools/vrchat-log|
|tooltip-trigger|surface:main-content|21|2|/activity,/feed,/friends-locations,/game-log,/login,/my-avatars|
|tooltip-trigger|surface:main-content|2|1|/community-themes,/themes|
|tooltip-trigger|surface:statusbar|84|1|跨 34 路由|
|tooltip-trigger|surface:statusbar|84|1|跨 34 路由|
|tooltip-trigger|surface:titlebar|42|2|跨 34 路由|
|tooltip-trigger|surface:titlebar|294|2|跨 34 路由|

7 个组件均有 inventory 记录，没有“无记录”。记录中的尺寸/变体：context-menu (ghost default、ghost icon-sm)；dropdown (ghost/outline/secondary，icon-xs/icon-sm/default)；hover-card (secondary sm)；popover (ghost icon-xs/icon、ghost sm、outline default/sm)；sheet-trigger 与 sheet-close (ghost icon-sm)；tooltip (ghost icon/icon-xs/icon-sm/sm/xs、outline default/sm)。

## 样式层逐组件命中
仅列选择器本身命中组件槽位的规则（非祖先条件中提及名称的选择器）。

- **context-menu-trigger**：`11-controls-and-pages.css` SECTION 未显式标记（页面级列表/卡片特例），100–106 命中它作为卡片容器祖先，声明实际落在其子级 `[data-slot="button"]`：100–101 规则重设子按钮布局；103 有 ring-2 的子按钮状态；106 子级圆形徽章外观。113、120 同区块是它内部 dropdown-menu-trigger 子按钮的规则。并无独立 `data-slot="context-menu-trigger"` 皮肤规则。
- **dropdown-menu-trigger**：`13-toolbar-overlays-and-pages.css` SECTION `fields-toolbar-r10`，32–38：32 选择器 `.vrcx-0-main-content .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-slot="input-group-addon"] > button[data-slot="dropdown-menu-trigger"][data-size="icon-xs"]`；33–34 `border:1px solid #8c71b0; border-radius:0; background-color:#332650; box-shadow:inset 1px 1px #fdf4ff,inset -1px -1px #7a3f6d`。36 同选择器加 `[aria-expanded="true"]`；37–38 `border-color:#6c5ce0; background-color:#211a33; box-shadow:inset 1px 1px #7a3f6d,inset -1px -1px #fdf4ff`。`11-controls-and-pages.css` 113–120 还有卡片列表模式内的 dropdown-trigger 定向修饰（边框/焦点轮廓；以文件行号为准）。
- **hover-card-trigger**：`11-controls-and-pages.css` 516，规则选择器 `.object-row > [data-slot="hover-card-trigger"] > div.relative.ml-2.overflow-visible > span.bg-muted.rounded-full.border`，实际声明在内部徽标：专属截角/边框表现；触发器本身无按钮状态皮肤。
- **popover-trigger**：未发现直接选择 `[data-slot="popover-trigger"]` 的皮肤规则；共通按钮规则不会自动命中另一个 data-slot 值。`13`/`11` 的 popover-content 规则是内容层，不是 trigger。
- **sheet-trigger**：未发现直接选择器。
- **sheet-close**：未发现直接选择器。`12-loader-and-forms.css` 305–331 是 `[data-slot="dialog-close"]`，不匹配 sheet-close，不能当作它的规则。
- **tooltip-trigger**：`06-panels-and-settings.css` SECTION toggle-group，149–153：`:is([data-slot=toggle],[data-slot=tooltip-trigger])` 在 outline toggle-group 内提供 border/radius/background/color/box-shadow；150 `::before` radius；151 hover palette；152 `[data-pressed]` selected palette；153 focus-visible outline。`11-controls-and-pages.css` 58–82 对工具栏 toggle-group 中 `[data-slot="tooltip-trigger"][aria-pressed]` 做同类 toggle 状态。`11` 683 另有特定 `size-2.5.rounded-full.border` 圆点触发器 `border-radius:0`；`15-late-components.css` 193 对精确的键帽样式 tooltip span 做限定特例。`11` 282 的 tooltip-trigger 只是 popover 内头像徽章后代，不是触发器皮肤。
- **共通按钮基底**：`14-buttons-and-data.css` SECTION button/data，7–26 是 `[data-slot="button"][data-variant]` 的背景、hover、active、focus、disabled；`02-foundation.css` 78–79 给 `[data-slot="button"]` radius/focus。CSS 的 `[data-slot="button"]` 不会匹配只有 `data-slot="…-trigger"` 的元素；inventory 的 tag/variant/size 说明其呈按钮形态，不等于 data-slot 是 button。

## 核心判断

### a) 独立皮肤/复用/零覆盖
按要求的严格 selector-slot 口径：**0/7 可确认完全复用 `[data-slot="button"]` 按钮皮肤**，因为触发器 slot 与 button slot 不同；不能仅凭 tag=button、variant/size 将 button 基础规则计为命中。**3/7 有专属触发槽位相关规则**：dropdown-menu-trigger（13:32–38 以及 11:113–120）、hover-card-trigger（内部徽章特例，11:516）、tooltip-trigger（联合/限定规则，06:149–153、11:58–82/683、15:193）。**4/7 没有直接专属皮肤：context-menu-trigger、popover-trigger、sheet-trigger、sheet-close**。其中 context-menu 只作为祖先控制其子项特例，故自身零覆盖；popover 与 sheet-trigger 根据现有样式层为零覆盖；sheet-close 零覆盖。它们会保留应用/组件默认外观，而非主题层专门上色。`context-menu-trigger` 和 `hover-card-trigger` 的部分规则作用于子元素，不应误算作触发器本身样式。

### b) tooltip-trigger
确认：有样式的 tooltip-trigger **主要靠联合选择器**，并非独立通用规则。核心是 `06:149–153` 的 `:is(toggle, tooltip-trigger)`；工具栏另在 `11:58–82` 限定 `[aria-pressed]`。因此不应为所有 tooltip-trigger 新增统一按钮皮肤，否则会误伤提示锚点、键帽/状态点等多种形态。15:193、11:683 是特定标记的局部例外。

### c) sheet
`sheet-close` inventory 是 `button ghost icon-sm`，说明观察到的组件尺寸档为 **icon-sm**；主题样式层没有 sheet-close 选择器，故无法从 CSS 证明实际像素宽高。图标按钮的实测像素尺寸属于未采集信息，不能把 `icon-sm` 武断换算成固定 px。也没有规则表明它复用 button icon 尺寸 CSS；它只是组件原生 size 档位。`sheet-trigger` 同样是 ghost icon-sm，样式层无规则。

### d) context-menu-trigger
存在记录（main-content 144 次、titlebar 42 次），但样式层没有它自身的规则。上下文菜单触发语义确为元素右键/上下文交互槽位；主题没有必要把整个元素改成按钮皮肤。11:100–106 的选择器只是对特定卡片视图子按钮/徽标做呈现，不是给右键触发器增加 UI。

### e) 状态
按钮通用 active/hover/focus 规则仅限 `[data-slot="button"]`（14:7–26），不会覆盖不同 slot 的 triggers。dropdown toolbar 在 `aria-expanded=true` 时有专属“按下/打开”配色（13:36–38）；但是没有通用 `[data-state="open"]` 或 `[data-popup-open]` trigger 高亮规则。tooltip-trigger 的 hover/pressed 状态仅在 toggle-group 情境中处理（06:151–152、11:66–76）；`:hover` 是该控件状态，并非 popover/menu open 指示。故“菜单打开时 trigger 保持高亮”只在特定 dropdown toolbar 用 `aria-expanded=true` 实现，其他菜单/弹层无通用 open 高亮。

## 合并与收敛
- 必须保留：tooltip-trigger 的 toggle-group 联合规则和具体受限例外；它覆盖的是 pressed toggle/键帽/圆点等异构控件，不能无条件并成通用按钮规则。
- 可合并/精简：dropdown-menu-trigger 现有打开态专属边框/底色可保留为单个 toolbar 规则组（基础 + `[aria-expanded=true]`）；hover-card 的内部徽章特例仍归所属 object-row，不需要 trigger 基础样式。
- 其余 context-menu-trigger、popover-trigger、sheet-trigger、sheet-close 不需要额外主题规则。总收敛建议：**保留 1 组 dropdown-menu-trigger 状态规则 + tooltip-trigger 的 3 组情境规则（toggle-group、工具栏 pressed、两个窄特例）+ 1 个 hover-card 内部后代特例；不新增其余 4 个 trigger 的皮肤**。若真把 `[data-slot="button"]` 和多个 trigger 合并到 `:is()`，button rule specificity/覆盖面会改变且会匹配原本不属于按钮的触发锚点，禁止这样做；当前无需合并 selector。

## 可视化
并排状态卡片见 [`../preview/P1-G2-all-triggers.html`](../preview/P1-G2-all-triggers.html)。这是 CSS 示意稿：通用外观根据已查到的规则模拟；标为零覆盖者明确展示“露出默认外观”，不是声称获得浏览器现场截图。