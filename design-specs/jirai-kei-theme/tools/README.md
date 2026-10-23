# tools/ — 样式收敛公用工具

在 `tools/` 目录里运行（`npm install` 装好 playwright 和 sharp）。都只读源码树，产物写 `/tmp`；每个都有 `--help`。
页面来源是 `baseline/` 的 42 个冻结 DOM 快照（含个人数据，不提交、不外传）。共享逻辑在 `common.mjs`。

| 工具 | 用途 | 流程步骤 |
|---|---|---|
| `slot-census.mjs` | 组件出现在哪些快照、属性组合、所在容器、当前渲染出几种样式 | ② |
| `build-preview.mjs` | 用应用真实组件写的演示 tsx 打包成单文件预览页 | ② ④ |
| `rule-owners.mjs` | 组件规则散落在哪些片段哪几行；分“主体 / 混合 / 只作条件” | ⑤ |
| `build-compare.mjs` | 改动前后两份构建：字节、哈希、规则增删与移动 | ⑤ ⑥ |
| `style-diff.mjs` | 同一 DOM 换两份 CSS，逐元素比较计算样式，可强制各种状态 | ⑤ ⑥ |
| `deploy-win.mjs` | 备份、上传、核对哈希，部署到 Windows 实机 | 用户要求时 |

典型一轮（以 toggle-group 为例）：

    node slot-census.mjs toggle-group                       # ② 有几处、几种样式
    node build-preview.mjs ../checks/toggle-group-preview.tsx "../checks/preview_toggle-group.html"
    node rule-owners.mjs toggle-group                       # ⑤ 动手前：旧规则在哪
    node rule-owners.mjs toggle-group --runtime             #    运行时实际命中哪些（含泛规则）
    node build-compare.mjs save --label toggle-group        # ⑤ 动手前先存“改动前”
    （写 runtime/toggle-group.css，在 runtime/parts.json 插一行，删旧规则）
    node build-compare.mjs diff                             # ⑥ 字节/规则变化，报告目录里有 before.css、after.css
    node style-diff.mjs --before <报告目录>/before.css --after <报告目录>/after.css \
      --expect '[data-slot="toggle-group"]' --states '[data-slot="toggle-group"] > button' \
      --preview "../checks/preview_toggle-group.html"       # ⑥ 组件外必须 0 差异
    node deploy-win.mjs --to 'C:\Users\tangh\Documents\GitHub\theme-preview\jirai-kei-theme-refactor' --dry-run

判读：
- `style-diff` 换皮时必须带 `--expect`：组件内的差异是有意的，好坏由用户看预览和实机判断；组件外的差异 = 误伤，必须查清。
- 不带 `--expect` 时要求全页 0 差异，只用于纯整理（拆文件、移动片段），不改外观。
- 退出码：0 通过，1 有差异，2 出错。42 快照全量约 5 分钟；`--fixtures auto` 只跑含目标组件的快照。
- 快照只覆盖采到的 42 个状态，没打开的菜单、弹窗不在内；通过对比 ≠ 实机验收。
- 片段拼接顺序在 `runtime/parts.json`，顺序即层叠顺序。

注意：`ssh pc114514` 默认是 cmd；`baseline/collect.mjs` 经 CDP 连用户正在用的 app，绝不能 `browser.close()`。
