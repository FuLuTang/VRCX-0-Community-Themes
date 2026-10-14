# heart-11x10-soft · cap3 的两个“尖角”软化对比 (11×10)

用户反馈：cap3 相对 cap2 只多了顶行两个像素 **(4,0)** 与 **(6,0)**，它们紧挨着中央凹口，纯深描边色 `O #ae387d` 显得尖角突出。本目录把这两格改成过渡色，做出类似抗锯齿的软化效果，并并排对比两个方案。其余 70 格、轮廓（mask）一格不动。

## 色表

| 代码 | 含义 | 颜色 | 粉底 #d97fc6 对比度 | 深底 #201936 对比度 |
|---|---|---|---:|---:|
| O | 描边 | `#ae387d` | 2.13:1 | 2.92:1 |
| H | 高光 | `#ffcced` | 1.94:1 | 12.05:1 |
| P | 主体 | `#ff87c6` | 1.22:1 | 7.60:1 |
| S | 阴影 | `#cc5282` | 1.53:1 | 4.07:1 |
| T | 过渡色（仅方案 Y） | `#d760a2` | **1.28:1** | **4.85:1** |
| . | 透明 | — | — | — |

**T 的来源**：O 与 P 逐通道取平均并四舍五入（半值进位）——R `(174+255)/2 = 214.5 → 215 (d7)`、G `(56+135)/2 = 95.5 → 96 (60)`、B `(125+198)/2 = 161.5 → 162 (a2)`，得 **`#d760a2`**。任务单里写的“约 #d85fa1”是近似值，与此相差每通道 ≤1，肉眼不可分辨；本目录以精确均值 `#d760a2` 为准。

## 三份矩阵

**cap3 原版**（回退用，见 [heart-11x10-cap3-original.svg](heart-11x10-cap3-original.svg)，与改动前的 `heart-11x10.svg` 逐字节一致）——O 26 / H 3 / P 36 / S 7

```text
..OOO.OOO..
.OPPO.OHPO.
OHPPPOPHPPO
OPPPPPPPPSO
OPPPPPPPSSO
.OPPPPPPSO.
..OPPPPSO..
...OPPSO...
....OSO....
.....O.....
```

**方案 X**（[heart-11x10-soft-X.svg](heart-11x10-soft-X.svg)）——(4,0)(6,0) 改成现成阴影色 `S #cc5282`，不增加新颜色。O 24 / H 3 / P 36 / S 9

```text
..OOS.SOO..
.OPPO.OHPO.
OHPPPOPHPPO
OPPPPPPPPSO
OPPPPPPPSSO
.OPPPPPPSO.
..OPPPPSO..
...OPPSO...
....OSO....
.....O.....
```

**方案 Y**（[heart-11x10-soft-Y.svg](heart-11x10-soft-Y.svg)）——(4,0)(6,0) 改成 O/P 中间色 `T #d760a2`，只新增这一个颜色。O 24 / H 3 / P 36 / S 7 / T 2

```text
..OOT.TOO..
.OPPO.OHPO.
OHPPPOPHPPO
OPPPPPPPPSO
OPPPPPPPSSO
.OPPPPPPSO.
..OPPPPSO..
...OPPSO...
....OSO....
.....O.....
```

## 不变量（由 [verify.mjs](../../../runtime/checks/r10-heart-reference/heart-11x10-soft/verify.mjs) 断言）

- 形状掩码与 cap3 完全相同（72 个非透明格）；
- 与 cap3 相比，**只有 (4,0)、(6,0) 两格** 的颜色改变（X：O→S；Y：O→T）；
- Y 中 T 只出现在这两格；X 仍是四色；
- 剩余的 `O` 仍是单个 8 连通分量（(3,0)–(4,1)、(7,0)–(6,1) 斜接，轮廓不断）；
- SVG 仅含整数坐标 1×1 `<rect>` + `shape-rendering="crispEdges"`，无 path / transform / opacity / stroke；
- 原生 11×10 光栅化只含调色板颜色（无插值）。

## 选择与结论

看图选择 **方案 Y**，已应用到正式资产 `heart-11x10.svg`（及 CSS data-URI 等）。原因见上级 README 的 “Large heart 11×10” 小节与最终报告：Y 的 T 色在粉底上对比度最低（1.28:1，比 O 的 2.13:1、S 的 1.53:1 都低），尖角几乎融进底色，而在深底上与主体粉自然衔接，像一格真正的抗锯齿过渡；X 的 S 是“阴影色”，放在受光的顶边语义不对，且在深底上呈现一个偏红的孤点。

回退：要恢复 cap3 原版，把 `heart-11x10-cap3-original.svg` 覆盖到 `../heart-11x10.svg`，并把 `heart-assets-r10.css` 里 `--jk-r10-heart-11-10` 的 data-URI 重新编码（`encodeURIComponent`），再把 `verify.mjs` 中的 `heart11x10Rows` 与软化断言改回即可。

预览：[comparison-pink.png](../../../runtime/checks/r10-heart-reference/heart-11x10-soft/comparison-pink.png)、[comparison-dark.png](../../../runtime/checks/r10-heart-reference/heart-11x10-soft/comparison-dark.png)（cap3 / X / Y × 1×/2×/4×/6×）、[titlebar-slot-4x.png](../../../runtime/checks/r10-heart-reference/heart-11x10-soft/titlebar-slot-4x.png)（14px 槽位实际尺寸，4× 最近邻放大）。
