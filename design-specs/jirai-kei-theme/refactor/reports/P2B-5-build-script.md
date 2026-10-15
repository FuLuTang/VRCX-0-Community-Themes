# P2B-5 合并脚本与校验报告

## 合并器

新增 `refactor/tools/build-theme.mjs`。默认输出为 `refactor/dist/theme.css`；支持 `--out <path>` 和 `--no-separators`。对目标 artifact 路径有明确拒绝保护。构建器按下面的固定数组顺序读文件，不使用 glob；输出为各源文件原始字节与可预测分隔符的连接，不改写源文件。

### 显式拼接顺序

冻结层：

1. `01-fonts.css`
2. `02-native-icons.css`
3. `03-icons.css`
4. `04-assets.css`
5. `05-assets-r5.css`
6. `06-assets-r7.css`
7. `07-keyframes.css`
8. `08-asset-vars.css`

样式层：

1. `01-tokens.css`
2. `02-foundation.css`
3. `03-chrome.css`
4. `04-group-spacing-and-typography.css`
5. `05-navigation.css`
6. `06-panels-and-settings.css`
7. `07-motion-navigation.css`
8. `08-chrome-r7.css`
9. `09-motion-and-user-surfaces.css`
10. `10-login-and-dialogs.css`
11. `11-controls-and-pages.css`
12. `12-loader-and-forms.css`
13. `13-toolbar-overlays-and-pages.css`
14. `14-buttons-and-data.css`
15. `15-late-components.css`
16. `16-final-navigation.css`

### 分隔符

每两个相邻文件之间插入一段（首文件之前不插入）：`/* ==== SECTION <下一个来源文件名> ==== */\n`。共 23 段，UTF-8 总长度 **1,049 B**。默认构建启用分隔符；`--no-separators` 关闭。

### 字节与重复构建校验

| 模式 | 输出字节 | 预期 | SHA-256（两次构建一致） |
|---|---:|---:|---|
| `--no-separators` | 1,047,292 | 1,047,292 | `d4ef23a85b4d457c4597e93ca6213101bff2003b2ead49ea22a2883783270f92` |
| 默认带分隔符 | 1,048,341 | 1,047,292 + 1,049 | `300cad39594e32cd389f1b4144284fdfb71e6c0fd6a9db77e08b98c3688eb40b` |

两种模式均各连续执行两次，输出哈希一致。默认产物 `refactor/dist/theme.css` 为 1,048,341 B，SHA-256 与带分隔符重建相同。

## 语义等价核验

从 `git show HEAD:design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css` 读取 artifact；读取 `08-asset-vars.css` 中 38 个 `--jk-asset-*` 定义，将产物中对应 `var(--jk-asset-*)` 展开回原始 `url(...)`，再移除变量定义块。针对 `@keyframes` 按大括号配对剔除完整块。

说明口径：仅移除变量定义和 keyframes 后，**合并后的全集不能与 artifact 全文逐字节相等**。这是因为合并器按要求把冻结层集中放在样式层前面，而 artifact 中资源冻结段原本分散在样式内容之间；顺序已经改变，不只是 keyframes 位置移动。未把这项不相等伪报为通过。

为检查重构的样式内容，另按源冻结段逐字节移除两侧的 6 个资源文件（`01`–`06`）、剔除全部 keyframes，并从构建产物移除 08 变量块、展开 38 个变量。得到的两侧样式内容均为 **323,936 B**，逐字节相同；SHA-256 均为 **`c21365ee3542b3045e7160216cd2ff05d515dbe5fa75aa5104c001ef9e8a9b7d`**，与 P2B-3 报告中的样式层 SHA-256 一致。结论：**样式层语义展开后与 artifact 的对应样式内容逐字节等价；全集按指定“只去变量定义（及可选 keyframes）”口径不等价，原因是冻结段位置集中化。**

校验读取 artifact 仅用只读 `git show`；未覆盖 artifact、未修改 `src/frozen/` 或 `src/style/`，未运行旧构建流程。
