# heart-v1-domed · V1 11×9 加“帽”变体 (11×10)

以 V1 11×9 品牌心为底，在两个心瓣最顶上各加一截 1 像素高的描边“帽”，让顶部更圆；V1 整体下移 1 行，新增顶行 y=0 放帽。其余格不动。仅为对比稿，未写入任何正式资产/CSS/runtime。

## 调色板

| 代码 | 含义 | 颜色 |
|---|---|---|
| O | 描边 | #ae387d |
| H | 高光 | #ffcced |
| P | 主体 | #ff87c6 |
| S | 阴影 | #cc5282 |
| . | 透明 | — |

## V1 原矩阵 (11×9，来自 pixel-report.json comparisonDrafts.previous11x9V1)

```
.OOOO.OOOO.
OHPPPOPHPPO
OPPPPPPPPSO
OPPPPPPPSSO
.OPPPPPPSO.
..OPPPPSO..
...OPPSO...
....OSO....
.....O.....
```

## 规则

- 坐标 (x,y)，x 0–10，y 0–9；V1 第 r 行 = 新矩阵第 r+1 行。
- 帽用 O，放在新顶行 y=0。
- 帽下方原 V1 顶行 O（现 y=1）若四邻都在心内（已变为内部），改为 V1 下一行（现 y=2）同列的 P/H，避免双层描边；仍贴着外部透明（如心瓣外侧、中央凹口两侧）的 O 保留。
- 因此三个变体里 (1,1)、(4,1)、(6,1)、(9,1) 都保留 O：它们分别紧贴心瓣外侧或中央凹口 (5,1) 的透明格，仍在外边界上（尤其 (4,1)/(6,1) 若改成 P，凹口底部的 O (5,2) 会与轮廓断开）。只有帽正下方的 (2,1)(3,1)(7,1)(8,1) 转为内部色。

## cap2 · 帽宽 2（左 x2–3 / 右 x7–8）

文件：[heart-v1-domed-cap2.svg](heart-v1-domed-cap2.svg)

```
..OO...OO..
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

色格统计：O 24 / H 3 / P 36 / S 7。

改动清单（相对“V1 下移 1 行”）：新增帽 4 格；内部化转换 4 格；共 8 格。

- 新增 O：(2,0) (3,0) (7,0) (8,0)
- O→P/H：(2,1) O→P、(3,1) O→P、(7,1) O→H、(8,1) O→P

## cap3 · 帽宽 3（左 x2–4 / 右 x6–8）

文件：[heart-v1-domed-cap3.svg](heart-v1-domed-cap3.svg)

```
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

色格统计：O 26 / H 3 / P 36 / S 7。

改动清单（相对“V1 下移 1 行”）：新增帽 6 格；内部化转换 4 格；共 10 格。

- 新增 O：(2,0) (3,0) (4,0) (6,0) (7,0) (8,0)
- O→P/H：(2,1) O→P、(3,1) O→P、(7,1) O→H、(8,1) O→P

## cap4 · 帽宽 4（左 x1–4 / 右 x6–9）

文件：[heart-v1-domed-cap4.svg](heart-v1-domed-cap4.svg)

```
.OOOO.OOOO.
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

色格统计：O 28 / H 3 / P 36 / S 7。

改动清单（相对“V1 下移 1 行”）：新增帽 8 格；内部化转换 4 格；共 12 格。

- 新增 O：(1,0) (2,0) (3,0) (4,0) (6,0) (7,0) (8,0) (9,0)
- O→P/H：(2,1) O→P、(3,1) O→P、(7,1) O→H、(8,1) O→P

## 注意

- 右瓣 V1 的 H 在 x=7；按“取 V1 下一行颜色”规则，cap2/cap3/cap4 里 (7,1) 都变成 H，右瓣高光因此竖着两格 H，而左瓣 H 仍只有 (1,2) 一格。这是 V1 高光位置本身左右不对称的结果，本稿未擅自改动。
- 高光 H 只在左上、阴影 S 只在右下与 V1 一致；对称性只断言形状/描边/填充掩码。

重新生成：

```sh
node design-specs/jirai-kei-theme/runtime/checks/r10-heart-reference/heart-v1-domed/verify.mjs
```
