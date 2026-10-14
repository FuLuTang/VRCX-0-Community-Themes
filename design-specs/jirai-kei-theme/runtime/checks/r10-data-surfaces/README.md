# R10-G4 数据表面验证

这是静态 DOM specimen，所有行、用户、群组、日期和日志都为虚构；截图会显式标记 **NOT WINDOWS**。没有连接实时 GUI、访问账户数据或修改 VRCX 源码 / 构建器。

## 范围

新增规则位于 [`data-surfaces-r10.css`](/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/data-surfaces-r10.css)。覆盖共享数据表（包括单独的 `.app-data-table` metadata 表）、hover/selected/expanded/header/footer、非 loading 的 EmptyState、Calendar、resizable grips、card footer、Feed 面板和拖拽覆盖层、好友位置卡、Instance History、GameLog、Dashboard、Group Moderation rail、VRChat Log、Gallery/Inventory/MyGroups TileShell、Activity `--act-*` 色阶/自定义 progress，以及关系记录卡。

特意避开 Favorites / browse-history `.object-row`、Favorites splitter（包括 `.favorites-body` decoy）、controls-r9 的 My Avatars / Themes / activity-card、dialogs 和 loader-r9 spinner。Activity 只在实际 tabs-content 结构下改图表令牌，不改 `--act-surface`、`--act-edge`、`--act-accent`。

## 基线与运行

[`fixture.html`](/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/r10-data-surfaces/fixture.html) 内联了构建出的 app stylesheet：`/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css`。Playwright 的 `setContent(about:blank)` 会拒绝 `file://` 样式表，因此将该文件内容内联，避免让它静默失载；比较时仍加载完整的 Lead R9 theme bundle。

在本机 Harness 环境重跑 specimen：

```bash
PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers \
  node /home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/r10-data-surfaces/verify.mjs
```

需要复用其他基线时设置 `JIRAI_BASE_BUNDLE=/path/to/theme.css`。此 verifier 会重建前后截图和 [`verify-report.json`](/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/r10-data-surfaces/verify-report.json)。

## 结果

- Specimen：PASS；对比度最低 `8.01:1`；selected table 行确认为 `3px` 粉色左条；色阶单调且相邻色差至少 `43.14`。
- 虚拟行 `36px → 36px`；被测布局的 `>2px` 尺寸 / 位置变化数为 `0`。
- 键盘焦点、日历禁用/选择态、Favorites / loader / dialog / controls decoy 检查通过。
- 9 个既有回归 fixture 的 `integratedVsMovedLast=0`、`integratedVsOff=0`、`offDiffs=[]`，无有意非零差异；完整明细见 [`cross-fixture-report.json`](/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/r10-data-surfaces/cross-fixture-report.json)。
- 这不是 Windows 实机或 live GUI 验证。

## 截图

![NOT WINDOWS · R10-G4 前后对照](/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/r10-data-surfaces/comparison.png)
