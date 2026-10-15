# P3-2：三层硬阴影收敛

## 1. 重复点清单

核对时，样式层中实际找到 **6** 处，而任务给出的表格列出 5 处。额外第 6 处是 `11-controls-and-pages.css:300` 的 menubar popup，值也逐字相同，因此一并变量化，未留下漏网项。

| 文件:行号 | 完整 `box-shadow` 值 | `!important` | 选择器 |
|---|---|---|---|
| `src/style/11-controls-and-pages.css:227` | `inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e` | 否 | `:is([data-slot="context-menu-content"], …, [data-slot="combobox-content"])`（共享 popup 基底） |
| `src/style/11-controls-and-pages.css:300` | `inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e` | 否 | `:is([data-slot="menubar-content"],[data-slot="menubar-sub-content"])` |
| `src/style/13-toolbar-overlays-and-pages.css:135` | `inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e` | 否 | `[data-slot="tooltip-content"]:not(:has(> div.flex.flex-col.gap-1.text-xs)):not(.flex.flex-col.gap-1.text-xs)` |
| `src/style/13-toolbar-overlays-and-pages.css:152` | `inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e` | 是 | `[data-slot="hover-card-content"]` |
| `src/style/13-toolbar-overlays-and-pages.css:166` | `inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e` | 是 | `[data-slot="toast-viewport"] > *` |
| `src/style/13-toolbar-overlays-and-pages.css:187` | `inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e` | 是 | `[data-slot="sheet-popup"]:has([data-slot="sheet-title"] .lucide-bell)` |

另外核对了 `11-controls-and-pages.css:348` 的 statusbar tooltip：它使用 `inset 1px 1px 0 #69557c, 2px 2px 0 #100b1e`，不是本次阴影，未修改。

## 2. 值一致性核对

在 `refactor/src/style/*.css` 中搜索指定字面串，发现上述 6 个 `box-shadow` 声明，所有值均逐字一致（空格、顺序、颜色大小写及 `0` 单位均相同）。因此把原本列出的 5 处以及额外确认的第 6 处共同引用一个变量，不涉及将近似值强行合并。

## 3. 新变量

在 `src/style/01-tokens.css:27`，位于现有 `:root, :root.dark, .dark` token 规则内，定义：

```css
--jk-overlay-raised: inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e;
```

命名采用文件现有 `--jk-*` 风格；`overlay-raised` 说明这是 overlay 表面使用的 raised 阴影。对样式层搜索确认没有其它同名变量定义或赋值覆盖。

## 4. 替换清单

以上 6 个位置均执行：

`inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e` → `var(--jk-overlay-raised)`

两处原来不带 `!important` 的声明仍不带；hover-card、toast 子项和 bell sheet 三处原来带 `!important` 的声明仍保留 `!important`。没有更改这些规则中的其它声明或选择器。

## 5. 零 diff 推理

自定义属性在 token 规则中保存与旧值相同的 token 序列；每个引用位置仍保留原有 `box-shadow` 属性声明与优先级标记。CSS 自定义属性替换后，`box-shadow` 的计算结果应与原阴影值相同。定义及所有引用均位于同一合并样式层，无新增 `@layer` 边界；新变量名在样式目录无其它定义。改动仅触及声明值（以及 tokens 中新增变量），符合限定范围。

## 6. 验证脚本实际输出

运行命令：`node refactor/tools/verify-overlay-shadow.mjs`

```text
src/style/11-controls-and-pages.css:227: box-shadow: var(--jk-overlay-raised);
src/style/11-controls-and-pages.css:300: box-shadow: var(--jk-overlay-raised);
src/style/13-toolbar-overlays-and-pages.css:135: box-shadow: var(--jk-overlay-raised);
src/style/13-toolbar-overlays-and-pages.css:152: box-shadow: var(--jk-overlay-raised) !important;
src/style/13-toolbar-overlays-and-pages.css:166: box-shadow: var(--jk-overlay-raised) !important;
src/style/13-toolbar-overlays-and-pages.css:187: box-shadow: var(--jk-overlay-raised) !important;
Scanned 228 box-shadow declarations across 16 style files.
RESULT: 6 references to var(--jk-overlay-raised), 0 literal duplicates remaining
```

## 7. 括号配平

直接统计各被改 CSS 文件的 `{` / `}` 字符数：

| 文件 | `{` | `}` | 结果 |
|---|---:|---:|---|
| `01-tokens.css` | 1 | 1 | 配平 |
| `11-controls-and-pages.css` | 124 | 124 | 配平 |
| `13-toolbar-overlays-and-pages.css` | 137 | 137 | 配平 |

## 8. 诚实声明

此次未运行浏览器、运行时构建或 computed-style 对照测试（按任务限制）。所以我不能声称已经实测证明页面每个元素的 computed style 完全相同；我能确认的是六处原始值逐字相同、替换后引用同一等值 token、`!important` 未变，且未碰 statusbar 的不同阴影。理论上，运行时若有非样式层注入的同名 `--jk-overlay-raised` 自定义属性覆盖，仍可能改变解析结果；本样式目录内未发现此类定义。基于约束要求不运行构建，运行时覆盖与实际 computed style 未进一步验证。
