# R9.7 brand heart (Q7) — 9×7 / 10×8 / 11×9

用户 R9.6d 反馈：中、大号观感没问题，小号太小。R9.7 三副心改为 **小 9×7、中 10×8、大 11×9**（宽×高），
各自在原生整数网格上独立绘制（不是同一张缩放），运行时 **1:1 原生显示**（`background-size` = 网格尺寸，
`image-rendering:pixelated`），每格恰好 1 CSS px。运行时文件：`runtime/brand-heart-r97.css`（完整替代 brand-heart-r96.css）。

风格延续 r9-heart：1px 深紫描边 `#34316a`（不用纯黑）+ 粉体 `#ffb8e6` + 左上高光 `#fdf4ff`；每色一个 `<path>`，
`shape-rendering="crispEdges"`，横向游程 + 纵向合并的紧凑矩形编码（粉体路径覆盖高光格，高光路径后画）。

图例：`O` 描边 #34316a · `P` 粉体 #ffb8e6 · `H` 高光 #fdf4ff · `.` 透明

## 小 · heart-9x7.svg（584 B，data URI 457 字符）

```
.OOO.OOO.
OHPPOPPPO
OHPPPPPPO
.OPPPPPO.
..OPPPO..
...OPO...
....O....
```

## 中 · heart-10x8.svg（600 B，data URI 470 字符）

偶数宽：两个圆峰各自镜像对称（中缝 col4|col5），顶部凹口 2px 平底，底尖 2px 宽。

```
.OOO..OOO.
OHHPOOPPPO
OHPPPPPPPO
OPPPPPPPPO
.OPPPPPPO.
..OPPPPO..
...OPPO...
....OO....
```

## 大 · heart-11x9.svg（685 B，data URI 555 字符）

```
.OOO...OOO.
OHHPO.OPPPO
OHPPPOPPPPO
OPPPPPPPPPO
.OPPPPPPPO.
..OPPPPPO..
...OPPPO...
....OPO....
.....O.....
```

除高光外，三副描边/粉体均左右镜像对称（`checks/gen.mjs` 生成时断言）。

## 运行时摆放（brand-heart-r97.css）

- 伪元素盒 **11×9**（= 最大帧，紧包；心已不是正方形，没必要用 11×11 再留上下空行）。
- 左缘不变：`right:-12px` → 盒左缘 = 品牌右缘 +1px（与 r96 的 13px 盒 `right:-14px` 相同）；仍在 21px 触发器右内边距内。
- 垂直：`top:calc(50% - 4px); transform:none`，盒落在品牌字的 9px 大写字墨行（品牌顶 +2…+10）上，大号心与大写字高完全对齐。
  不沿用 window-chrome 的 `translateY(-50%)`：9px 盒会得到 −4.5px 的小数变换，Chromium 会把心尖那一行抗锯齿成半透明（实测）。
  纯布局偏移由 Chromium 取整对齐像素，小数布局偏移（0.25/0.5/0.75px）下也逐像素精确。
- 每帧整数 `background-position`（`center` 会让 10×8 在 11×9 里落在半像素）：小 `1px 1px`、中 `1px 1px`、大 `0 0`。
  即小/中共用左上锚点（高光不跳），中→大向左上各长 1px。
- 帧序 小-小-中-大-中，2.5s `steps(1,end)`（每帧 0.5s）；`prefers-reduced-motion` 与 `html.reduce-effects` 静态中号 10×8 @ `1px 1px`。
- 已知限制：Windows 显示缩放为非整数（125%/150%）时，1 CSS px = 1.25/1.5 设备像素，任何 1:1 像素图都会出现 1/2 设备像素交替的格宽；
  100%/200% 时格子完全均匀。

## 产物与检查

- `compare.png`：三副心 1× / 4× / 8×，上排粉底 #d97fc6、下排深底 #16112a（sharp 光栅化 SVG 原生尺寸后最近邻放大）。
- `frames.png`：fixture（runtime/checks/r9-brand-heart，取非 `.static-demo` 的动画实例）五帧品牌区局部 46×24 → 8× 最近邻。
- `checks/verify.mjs`：负 animation-delay + paused 截五帧；断言 background-size/position、mask 清空、pixelated、
  ASCII 逐像素与截图一致（含 reduced-motion、reduce-effects、0.25/0.5/0.75px 小数布局偏移），品牌/触发器/帮助几何与 r96 一致。
  结果 `checks/verify-output.json`；Lead 交叉检查结果 `checks/check-output.json`。
