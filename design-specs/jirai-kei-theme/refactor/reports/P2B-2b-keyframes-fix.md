# P2B-2b Keyframes 冻结层修复报告

源 artifact：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`（1,044,718 B）
提取：正则定位 `@keyframes[ \t]+[A-Za-z0-9_-]+`，随后逐字节扫描花括号并在首度归零处闭合；块文本按原始 Buffer 保留。
块间分隔：每块之间恰好一个 LF（0x0A），拼接 SHA-256 与字节总数校验排除这些分隔符。

## 校验结果

| 动画名 | 期望 B | 实测 B | artifact 唯一命中 |
|---|---:|---:|:---:|
| `r5-charm-swing` | 127 | 127 | 是（1 次） |
| `r5-dialog-step-in` | 62 | 62 | 是（1 次） |
| `r5-spinner-step` | 62 | 62 | 是（1 次） |
| `r5-progress-flow` | 67 | 67 | 是（1 次） |
| `r7-tab-edge` | 274 | 274 | 是（1 次） |
| `r8-lace-flow` | 112 | 112 | 是（1 次） |
| `r8-nav-cursor` | 99 | 99 | 是（1 次） |
| `r8-window-press` | 147 | 147 | 是（1 次） |
| `r8-cat-hop` | 146 | 146 | 是（1 次） |
| `r9-notification-badge-flash` | 318 | 318 | 是（1 次） |
| `jk-loader-dance` | 107 | 107 | 是（1 次） |
| `r97-brand-heart-pixels` | 340 | 340 | 是（1 次） |
| `r96-nav-cat` | 306 | 306 | 是（1 次） |
| `r96-social-cat` | 395 | 395 | 是（1 次） |
| `r10-nav-phone-loop` | 8827 | 8827 | 是（1 次） |
| `r10-nav-phone-float` | 114 | 114 | 是（1 次） |

a) 总块字节：**11,503 B**（期望 11,503 B）；逐块长度符合表格：**是**。
b) 写出文件花括号：**{ 114，} 114，相等**。
c) 16 块各在 artifact 中精确命中 1 次；互不重叠：**是**。
d) 16 块顺序拼接（不计 LF 分隔）SHA-256：`7d6e46f9d1ea562a59cd5f62c03a117fe056f7b845f0a6a687ea6794918efc63`。
e) artifact 区间互不重叠：**是**；所有非块字节间隙合计 1,033,215 B，扣除资源段 709,279 B 后为 **323,936 B**（目标 323,936 B）。

## `r10-nav-phone-loop` 结构

完整大小 8,827 B；识别到 55 个含百分比选择器的关键帧规则，选择器中共 55 个百分比点。每帧均有且仅有一条 background-position，声明所在行为单行（与同帧其他属性共行）：**是**。引用 CSS 变量 12 个：`--r10-phone-nav-state-stop`、`--r10-phone-nav-size`、`--r10-phone-nav-state-tap`、`--r10-phone-nav-state-dim`、`--r10-phone-nav-state-bright`、`--r10-phone-nav-state-up`、`--r10-phone-nav-state-look`、`--r10-phone-nav-state-look-bright`、`--r10-phone-nav-state-dim-tap`、`--r10-phone-nav-state-look-dim`、`--r10-phone-nav-state-up-bright`、`--r10-phone-nav-state-bright-tap`。使用 steps() 时间函数：是，共 55 次，函数为 `steps(1, end)`。规则体统计基于完整块内关键帧规则。

## 旧文件问题与边界

旧版 `07-keyframes.css` 在每个动画仅写入第一行/第一条关键帧声明，并在下一个 `@keyframes` 起点截断，导致所有定义缺少剩余关键帧与闭合结构；首块在 artifact 中因此无法精确命中。
本脚本只写本报告与 `src/frozen/07-keyframes.css`；artifact、runtime 及其他冻结文件均不改。

**所有强制校验通过。**
