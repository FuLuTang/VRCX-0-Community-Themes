# P2B-1 资源段冻结提取报告

源 artifact：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`
提取方式：按 `/* SECTION <name> */` 起始字节边界截取至下一 section 标记前，原始 Buffer 写出；不做文本格式化。

| Section | 期望字节 | 实测字节 | SHA-256 | 一致 |
|---|---:|---:|---|:---:|
| `fonts` | 480309 | 480309 | `09ec2b7eb3c39e2e493188e8e27bec4d0a82ea71034f7d592ddf401206d7d32c` | 是 |
| `native-icons` | 9008 | 9008 | `614eef804afce0a4ba48f5e0fe7857d388b0e1d1bacdd84161ff7d2a489213b5` | 是 |
| `icons` | 111152 | 111152 | `84fac5e25c1c4e0b64426bbb2bfa9cd37210f430f10d2c6b41c1e4466acb82fd` | 是 |
| `assets` | 25582 | 25582 | `11198c554276cfc5fd68abc815904a7049efa8c445557944078719882412c74a` | 是 |
| `assets-r5` | 79362 | 79362 | `da9fda62a04760a04b2226e096171935e47245d0130fd931dc1ebb95b10f0493` | 是 |
| `assets-r7` | 3866 | 3866 | `986ef5b86e0d283d2e0645a3c03f7c7dc1c4ad47a0d86131deda88fa8eea2a95` | 是 |

拼接顺序：`01-fonts.css` → `02-native-icons.css` → `03-icons.css` → `04-assets.css` → `05-assets-r5.css` → `06-assets-r7.css`
拼接总字节：709279；SHA-256：`49763b3f80f63f804f40c44eac3e9403521363fcdd70ca88451132dd8824754a`。
与 artifact 同序所取 6 段拼接逐字节相同：**是**。
所有段字节数符合预期：**是**。

## 跨段依赖检查

CSS 自定义属性 var(--...) 引用：所有引用均可在本段或这六段中的其他段找到定义。
未发现跨段自定义属性引用。
未发现可识别的跨段字体族引用。
未发现跨段动画名引用。

依赖审计范围仅限上述六个冻结段；未修改 artifact 或任何现有 CSS。
