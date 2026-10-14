# 分组下方间距 R3：胶囊下边与下一行之间的真实呼吸位

交付：[group-spacing.css](<../runtime/group-spacing.css>)（1 条规则，13 行注释+选择器）。主应用 `/home/fulutang/Documents/Github/VRCX-0-jirai` 全程只读：未运行 git / 构建 / 未连接 Windows。行号基于 2026-10-11 20:39 UTC 快照，复核请按选择器定位。

## 选择器与取值

`.vrcx-0-side-panel [data-slot="collapsible"]:has(> button[data-variant="ghost"][data-size="sm"] > svg.lucide-chevron-down) { padding-bottom: 10px; }`

- 10px 的由来：胶囊 3px 硬阴影 + 下一行头像 frame 上溢 6.75px ≈ 9.75，取整 10。
- 间距加在**真实 collapsible 根**上，落在被测量的行盒内，因此是"真间距"而不是位移特效。
- 单层 `:has()` + 相对后代组合器；**不能**写成 `:has(button:has(svg))` 的嵌套形式（见下实测）。

## 真实行高路径（源码证据）

| 环节 | 证据 |
| --- | --- |
| 分组头 = `Collapsible`（根带 `data-slot=collapsible`，非首行加 `pt-2`＝8px） | `src/components/layout/ListSectionHeader.tsx:26-33` |
| 触发按钮 = `Button variant=ghost size=sm` ＋ 计数 Badge ＋ `ChevronDownIcon` 直接子 | `ListSectionHeader.tsx:35-61`；`src/ui/shadcn/button.tsx:31-33,74-78` |
| 分组头是独立虚拟行，下面紧接好友行或 instance-header（房间小标签）行 | `src/components/sidebar/friends-sidebar/FriendsSidebarVirtualRows.tsx:200-233` |
| 行根 = `absolute top-0 left-0 w-full` + `translateY(item.start)`，`ref={getRowRef(key)}` | `src/components/sidebar/FriendsSidebar.tsx:828-847` |
| 行高来自 `element.offsetHeight`，由 `ResizeObserver(updateSize)` 回写 `measuredSizes`，覆盖估算值 | `src/components/sidebar/useVirtualSidebarRows.ts:205-227`、`:110-117` |
| 所以 padding 会改变测量行高 → `offsets` 重算 → 后续行由 translateY 真实下移（无需动 spacer/坐标） | `useVirtualSidebarRows.ts:101-124,362-399` |
| 头像 = `size-9`＝36px、`overflow-visible`；frame = `absolute -inset-[18.75%]`（上溢 6.75px） | `src/components/UserStatusAvatar.tsx:20-51`；`src/components/ProfileDecorations.tsx:112-128` |
| `--spacing:.25rem` → `h-7`＝28px、`size-9`＝36px | `dist/assets/index-Cckb3vVG.css`（`.h-7`/`.size-9`），与既有探针 `checks/source-hooks-report.json`（height 28）一致 |

## 探针测量（fixtureOnly，非实机）

Chromium 153.0.8010.47 headless，套用主应用编译产物 `dist/assets/index-Cckb3vVG.css`，按上述源码结构搭 DOM（分组头带/不带 pt-2、群组头、普通折叠卡片、好友行、房间小标签行）。

| 指标 | 加规则前 | 加规则后 | 结论 |
| --- | --- | --- | --- |
| 分组头 collapsible（含 pt-2）offsetHeight | 36 | 46 | +10，进入行测量 |
| 分组头虚拟行 wrapper offsetHeight | 36 | 46 | 同步 +10 → ResizeObserver 会读到 |
| 群组头 collapsible（无 pt-2） | 28 | 38 | 同构头同样 +10 |
| 同房间头（无计数） | 36 | 46 | 无计数同房间也命中 |
| 按钮高 / 宽、Badge 高、chevron 高 | 28 / 320 / 20 / 14 | 同左 | Δ=0，28px 胶囊与计数箭头尺寸全部保留 |
| 按钮顶距 collapsible 顶 | 8 | 8 | 按钮没被推挤，间距只发生在下方 |
| 选择器命中 | — | friends 头 ✓、同房间头 ✓、群组头 ✓；SettingsCard ✗、DevKit 裸 collapsible ✗、chevron-right 折叠项 ✗（matched 3/6） | 普通折叠卡片不受影响 |
| `CSS.supports` | 单层 `:has(> button[...] > svg.c)` = true；嵌套 `:has(... :has(...))` = **false** | — | 嵌套写法会被整条丢弃，务必用交付里的形式 |

下一行几何（探针实测）：好友行高 48、头像顶内缩 6px、frame 顶比行盒顶高 0.75px；房间小标签行高 24、文字顶内缩 0px。故加 10px 后：胶囊盒底 → frame 顶 9.25px（扣掉 3px 阴影，视觉净 ≈6.25px），→ 无 frame 头像顶 16px，→ 房间小标签文字 10px。

## 群组同构头安全评估

`GroupsSidebar` 的群组头同样是 `Collapsible > Button ghost/sm + ChevronDownIcon`（`src/components/sidebar/GroupsSidebar.tsx:144-173`），命中后行高 28→38，与该文件估算常量 `GROUP_HEADER_ROW_SIZE = 38` 恰好一致（`GroupsSidebar.tsx:48`）；`count===0` 的群组头渲染成裸 `Button`（无 collapsible、无 chevron，`:127-140`）→ 不命中、保持原样，与"它不是胶囊"一致。两个侧栏都用同一 `useVirtualSidebarRows` 测量路径与 `absolute+translateY` 行根，且都未启用 `preserveScrollAnchor`，所以只有"每个组头之后的行整体下移 10px、totalSize 每组 +10px"，不会有锚点漂移。无 group 成员自绘行高、无固定 `height` 包裹 collapsible 的写法，测量不会被截断。

## Leader 浏览器应检查

1. 好友侧栏：展开态「已分组的好友 / 同一房间 / 在线」三个胶囊与紧邻头像/房间标签之间出现可见空隙；胶囊仍 28px、圆角、3px 粉色硬阴影，计数与箭头大小不变，点击折叠照常。
2. 群组侧栏：群组头胶囊下方同样空出 10px，群组实例行不再贴住；`0` 成员的群组头（裸按钮）不加空隙。
3. 首个组头（无 pt-2，行高 28→38）与后续组头（36→46）滚动时无重叠、无跳动，滚动条总长合理。
4. 设置页折叠卡片、DevKit 折叠项、群组详情对话框里的 `ListSectionHeader`（不在 `.vrcx-0-side-panel` 内）**不应**获得间距。
5. 展开/折叠、搜索过滤、滚动中段（overscan 区）无残影或错位；窄宽度（约 240px）下胶囊文字截断正常。
6. 实机 WebView2：确认新规则生效（既有胶囊规则已证明单层 `:has()` 可用）；若胶囊没变化，先查是否被加载。

## 风险 / 未做

- [group-spacing.css](<../runtime/group-spacing.css>) 是独立片段：`runtime/build-runtime.mjs` 的 `parts` 里**没有**它（该文件与其他 runtime 文件在本任务中只读），Leader 需要把它并入 runtime section 才会进 preview 包；CSS 内不得使用 `@import`（构建脚本会报错）。
- 若将来组头把展开内容放进同一个 `CollapsibleContent`，这段 padding 也会落在内容底部 10px，届时需按内容是否为空再收紧。
- 探针是 fixture 推导，不等价于实机；实机行高（好友行 48~49）与像素字体差异可能让净空浮动 1px 左右。
