# 第三方素材整理（初步，Lead 2026-10-11）

下载这批文件的子任务中途失败，没有留下逐文件来源清单。后续用 deepseek-flash 补做核查的工作流子智能体也因 DSH 请求扩展报错（`REQUEST_EXTENSION`）失败。因此本报告**只根据文件名前缀、SVG 内嵌元数据和 `licenses/` 已保存页面**做初步分类，没有逐个回到原始页面核对。

![蕾丝、缎带、纹样类候选总览（Lead 用 sharp 栅格化）](<contact-sheet-lace-ribbon-pattern.png>)

## 分组结论

| 分组 | 数量 | 许可依据 | 结论 |
|---|---|---|---|
| `fluent-*`（Microsoft Fluent UI Emoji） | 32 | `licenses/fluentui-emoji-LICENSE-MIT.txt` | 完全可用。但它们是 emoji 风格，多数带渐变和多色，不适合做单色装饰边 |
| `gi-*`（game-icons.net） | 25 | `licenses/CC-BY-3.0-legalcode.txt` | 完全可用 |
| `lucide-*` / `tabler-*` | 5 / 6 | ISC / MIT 许可原文已存 | 完全可用 |
| `twemoji-*` | 9 | CC BY 4.0 图形许可已存 |完全可用 |
| 无前缀文件 | 74 | 大多只有 Inkscape 默认的 `creativecommons.org/ns` 命名空间；少数内嵌 `licenses/publicdomain` 或 openclipart 标记，2 个内嵌 CC BY 3.0/4.0 但作者未知 | 完全可用 |

下列无前缀文件看起来有用：

- `lace/scallop-eyelet-trim-navy.svg`、`lace/scallop-eyelet-trim-teal.svg`：横向孔眼波瓣蕾丝，正是需要的边条形态，6–8 KB，偏大。
- `lace/ruffle-loop-trim.svg`、`lace/lace-divider-simple.svg`、`pattern/perforated-dot-strip.svg`：可作为窄边条。
- `ribbon/bow-dark-grey.svg`、`ribbon/lace-up-ribbon-vertical.svg`。

体积问题：大量文件在 20 KB 以上（最大 1.1 MB），必须大幅简化才能内联进主题 CSS。

## 当前建议

主路线仍是 [原创素材](<../original-assets/README.md>)：S1–S11 已经覆盖波瓣、扇形蕾丝、缝线、系带、结、爱心、像素心、像素锯齿、点阵云和符号散布，作者和许可都在我们手里。
其他素材需要转制成css效果/svg图像/裁切/仿制重绘