# 社区主题 CSS 的硬限制：字体 / 动画 / 文件大小 / 远程资源

- 主程序（只读）：`/home/fulutang/Documents/Github/VRCX-0-jirai`
- 主题仓库（只读参考）：`/home/fulutang/Documents/Github/VRCX-0-Themes-VSCode`
- 方法：静态阅读源码、校验脚本、schema、构建产物，以及上游 Tauri 官方文档与 `tauri-v2.12.1` tag 源码。**未运行应用、未构建、未修改任何文件。**
- 术语：**硬限制** = 有代码/CI 在运行时强制；**软规则** = 仅写在 CONTRIBUTING / PR 模板中靠人工 review；**未确认** = 查不到证据，不猜。
- 每条结论后附 `证据：`（文件:行号 或 URL）。

---

## 0. 结论速览

| 维度 | 硬限制 | 关键证据 |
| --- | --- | --- |
| 主题 CSS 文件大小 | **≤ 1 MiB（1 048 576 字节，UTF-8 字节数），超限是硬失败**（HTTP 层先报错，再被协议层拒绝）。仓库侧校验**完全不检查** CSS 大小 | `crates/contracts/src/community_theme_protocol.rs:24`；`crates/outbound-adapters/src/community_theme_remote.rs:93-110`；`crates/vrchat-client/src/web_client.rs:323-345` |
| `@import` / `@font-face` / `url()` / `data:` / `@keyframes` / `animation` | **运行时不检查、不过滤、不剥离**。仓库自动校验也不检查。仅 CONTRIBUTING 软性禁止"远程 `@import` CSS 文件" | `scripts/validate-themes.mjs:201-246`（不读 `theme.css`）；`crates/application/src/profile/community_theme/*.rs`（无 CSS 文本处理）；`CONTRIBUTING.md:79` |
| 相对路径 `url()` | 安装路径**不做任何重写**，相对 URL 会按文档 base 解析（等于拿不到主题同目录资源）。只在 dev/DevKit 本地预览里被重写成 asset 协议 URL | `src/services/community-theme/styleLayers.ts:43-77`（仅 `rewriteLocalThemeAssetUrls`，被 `localPreview.ts` 调用） |
| `data:` 字体 | **CSP 不拦**（`font-src` 未配置且无 `default-src`） | `src-tauri/tauri.conf.json:14-31`；MDN font-src/default-src fallback 规则 |
| https 远程字体 / 图片 | **https 可以**（图片：`img-src` 显式含 `https:` 与 `data:`）；http 远程图片**会被 CSP 拦**（只放行 `http://localhost:*` 与三个自定义 host） | `src-tauri/tauri.conf.json:16-29` |
| Tauri 会自动补 `default-src` 吗 | **不会**（v2.12.1 只对 `script-src`/`style-src` 追加 nonce/hash，不新增 `default-src`） | [Tauri CSP 文档](https://v2.tauri.app/security/csp/)；`tauri-v2.12.1 crates/tauri/src/manager/mod.rs:53-103, 137-165`；`tauri-utils v2.10.1 config.rs:2595-2614` |
| 主题包自身的托管位置 | **硬白名单**：只能来自 `https://raw.githubusercontent.com/Map1en/VRCX-0-Community-Themes/master/themes/<id>/`，且**不跟随重定向** | `crates/contracts/src/external_api.rs:16-17, 386-393`；同文件 `:264` |
| `remoteAssets` | **纯声明字段**：Rust 只解析存储，前端只有类型定义，**运行时不据此做任何放行/拦截** | `crates/contracts/src/community_theme_protocol.rs:247`；`src/domain/themes/types.ts:18` |
| 减少动效 | 应用设置 `reduce-effects` → `<html class="reduce-effects">`，app 用 `animation:none !important` 全局强制停用；主题**无法**用 `!important` 反制（分层 important 优先于未分层 important） | `src/repositories/configKeys.ts:100`；`src/services/preferences/preferencesCore.ts:44`；`src/styles/globals.css:596, 1193-1198` |
| 主题动画本身 | 无禁止，官方目录里已有先例（aurora 主题用无限 `@keyframes`） | `themes/aurora-theme/theme.css:363-431` |
| 全局字体覆盖点 | 改 `--vrcx-app-font-family`（`<html>` 上由 JS 写内联值，主题需 `!important`）；改 `--font-sans` 基本无效 | `src/services/themeService.ts:402-405, 429-432`；`src/styles/globals.css:453, 562` |

---

## 1. 主题仓库的校验规则

### 1.1 校验器实际检查什么（`scripts/validate-themes.mjs`）

| 检查项 | 是否强制 | 证据 |
| --- | --- | --- |
| `themes/index.json`：`schemaVersion === 1`、id 格式、去重 | 是 | `scripts/validate-themes.mjs:61-93` |
| 根 `README.md` 含 `themes/<id>` 链接 | 是 | `scripts/validate-themes.mjs:95-110` |
| `theme.json`：id/name/version/description/testedWith/author/tags/`remoteAssets`/`darkMode`/`accentMode` 类型与格式 | 是 | `scripts/validate-themes.mjs:112-179` |
| 目录名 === manifest `id` | 是 | `scripts/validate-themes.mjs:123-125` |
| `preview.webp` 存在、≤ 256 KiB、RIFF/WEBP 魔数 | 是（**仓库侧唯一的体积上限**） | `scripts/validate-themes.mjs:7, 181-199` |
| **`theme.css` 的内容**：大小、`@import`、`@font-face`、`url()`、`data:`、`@keyframes`、远程域名 | **完全不检查** | 校验器从未 `readFile` 任何 `theme.css`：`scripts/validate-themes.mjs:201-246` 全文 |
| **`theme.css` 是否存在** | **不检查**（连存在性都没验证） | 同上；测试里写入 `theme.css` 只是习惯：`scripts/validate-themes.test.mjs:28` |

CI 只跑这两个文件，没有任何 lint / CSS 解析步骤：

- `证据：.github/workflows/validate-themes.yml:20-24`（`node --test scripts/validate-themes.test.mjs` + `node scripts/validate-themes.mjs`）

### 1.2 CONTRIBUTING 的 CSS Policy（软规则）

允许：应用自有 surface 变量、普通选择器、Tailwind/shadcn 覆盖（不保证稳定）、`remoteAssets` 为 true 时的外部图片/字体 URL。
不允许（原文一句）：

> "Remote `@import` of CSS files." — `CONTRIBUTING.md:79`

完整"不允"清单见 `CONTRIBUTING.md:75-81`：禁止隐藏 recovery/close/exit/login/确认/破坏性操作 UI、禁止误导性的应用状态/身份伪装、禁止远程 `@import`、禁止 JS/HTML/扩展代码/构建产物、禁止压缩或混淆的 CSS。
PR 模板另加了人工勾选项："CSS is readable and not minified or obfuscated."（`.github/pull_request_template.md`）。

**重要：这些都不是自动强制项**，`@import`（远程）、`@font-face`、`@keyframes`、`animation`、`data:`、任意 https 域名在代码层面都没有被拦截。唯一被自动拦的是"CSS 托管位置"（见 §3.1）与"1 MiB"（见 §3.3）。

### 1.3 `remoteAssets` 的确切含义

- 定义：`remoteAssets` 为 `true` 表示 CSS 引用了远程图片或字体 — `CONTRIBUTING.md:62`、`schemas/theme.schema.json`（`"remoteAssets": {"type": "boolean"}`）。
- 主程序侧行为：Rust 只把它解析进 manifest 结构（`crates/contracts/src/community_theme_protocol.rs:247`），前端只有类型字段（`src/domain/themes/types.ts:18`、`src/platform/tauri/bindings.ts:3719`），**没有任何运行时代码读取它来放行或阻止资源**。
- 结论：它是**声明/审查字段**，不是技术开关。真正决定远程字体/图片能否加载的是 CSP（§2）——而当前 CSP 对字体与媒体没有任何限制。

### 1.4 辅助脚本不是校验器

`scripts/build-color-inventory.mjs`、`verify-color-mapping.mjs`、`verify-surface-inventory.mjs` 硬编码了 `themes/vscode-dark-theme/theme.css` 路径，只做颜色清单统计与自洽断言（重复 ID 等），**不做合规校验**：

- `证据：scripts/build-color-inventory.mjs:6, 108-109`；`scripts/verify-color-mapping.mjs:8`；`scripts/verify-surface-inventory.mjs:7, 21-32`

### 1.5 现有上架主题的实证

- 全部 11 个主题的标题 CSS 体积（`du -b themes/*/theme.css`）：6 497 – 28 494 字节（最小 `trans-theme-example` 6 497，最大 `vscode-dark-theme` 28 494）。
- 含 `@keyframes` 的主题：**aurora-theme**（`themes/aurora-theme/theme.css:363, 378, 393`，动画声明在 `:422, 431`），即无限循环动画（20s/28s）在官方目录里是被接受的。
- 含 `url(` 的主题：**无**。含 `@font-face` / `@import` 的主题：**无**。
- 处理减少动效的主题：**无**（`grep -rn "reduce-effects\|prefers-reduced-motion" themes/*/theme.css` 无结果）——aurora 的动画目前是靠 app 的全局规则在"减少特效"时被动停用的。

---

## 2. 主程序 CSP

### 2.1 完整配置

`src-tauri/tauri.conf.json:14-31`，整段只有两个指令：

```json
"security": {
    "csp": {
        "img-src": [
            "'self'", "https:", "http://localhost:*",
            "http://vrcx-0-img.localhost", "http://vrcx-0-thumb.localhost",
            "http://vrcx-0-bg-img.localhost",
            "asset:", "vrcx-0-img:", "vrcx-0-thumb:", "vrcx-0-bg-img:",
            "data:", "blob:"
        ],
        "worker-src": ["'self'", "blob:"]
    }
}
```

- **没有** `default-src`、`font-src`、`style-src`、`media-src`、`connect-src`、`script-src`。
- 没有 `devCsp`，没有 `dangerousDisableAssetCspModification`，没有 `assetProtocol` 配置（全文 grep 只有这一处 `csp`：`src-tauri/tauri.conf.json:15`）。

### 2.2 逐指令判定

CSP 规则：fetch 指令缺失 → 回退 `default-src`；`default-src` 也缺失 → 该类资源**不受该策略约束**。
`证据：` [MDN font-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/font-src)（"default-src fallback: Yes. If this directive is absent, the user agent will look for the default-src directive."）；[MDN default-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/default-src)（列出 font-src / style-src / media-src / img-src / worker-src 等的回退关系）。

| 资源 | 指令 | 现状 | 判定 |
| --- | --- | --- | --- |
| 字体（`@font-face src: url(...)`） | `font-src` | 未配置，`default-src` 未配置 | **data: 字体可以；https 远程字体可以**（无策略约束） |
| 样式表 / inline `<style>` | `style-src` | 未配置，`default-src` 未配置 | 注入的 `<style>` 与 `@import` 拉取的远程 CSS 都**不被 CSP 拦**（远程 `@import` 只受 CONTRIBUTING 软规则限制） |
| 图片 / 背景图 | `img-src` | 显式白名单 | https ✅、data: ✅、blob: ✅、自定义协议 ✅；**普通 http 远程图片 ❌**（只放行 `http://localhost:*` 与 3 个 `.localhost` host） |
| 音频/视频 | `media-src` | 未配置 | 不受约束 |
| 网络请求（fetch/XHR） | `connect-src` | 未配置 | 不受约束（但主题无法执行 JS，这条与主题无关） |
| 脚本 | `script-src` | 未配置 | 不受约束（主题无法加 JS，同样无关） |

### 2.3 Tauri 2 是否会自动追加默认 CSP：**不会**

三份证据互相印证：

1. 官方文档只说追加 nonce/hash，不提交 `default-src`：
   "At compile time, Tauri appends its nonces and hashes to the relevant CSP attributes automatically to bundled code and assets" — [Tauri v2 CSP 文档](https://v2.tauri.app/security/csp/)。
2. 与 `Cargo.lock` 中 `tauri 2.12.1` 对应的 tag 源码 `tauri-v2.12.1/crates/tauri/src/manager/mod.rs:53-103`：`set_csp()` 仅做两件事——若 `dangerous_disable_asset_csp_modification` 允许，则对 `script-src`、`style-src` 调用 `replace_csp_nonce()`。**没有任何新增指令的代码路径。**
   `证据：Cargo.lock:7695-7696`（`tauri 2.12.1`）、`Cargo.lock:8082-8083`（`tauri-utils 2.10.1`）。
3. `replace_csp_nonce()`（同文件 `:137-165`）只有在资产里真的存在 nonce 占位符 / 哈希时，才会向该指令追加 `'self'` 与 `'nonce-…'`；本项目构建产物 HTML 中无该类占位符，因此连这一步也不发生。
4. CSP 的序列化只是拼接已有指令：`Csp::DirectiveMap` 的 `Display` 逐条输出 `directive sources`（`tauri-utils v2.10.1 crates/tauri-utils/src/config.rs:2595-2614`）。
5. 上游唯一会凭空创建 `default-src` 的位置受 `#[cfg(feature = "isolation")]` 限制（isolation pattern），本项目未配置 pattern → 不适用。

**衍生结论（重要）**：主题 CSS 之所以能靠"JS 创建 `<style>` 元素"注入成功，正是因为 `style-src` 与 `default-src` 都缺失。若上游将来加上 `default-src 'self'` 或 `style-src 'self'`（不含 `'unsafe-inline'`/nonce），注入路径会整体失效——主题不应把"字体无限放行"当作长期契约。

### 2.4 未确认项

- **dev 模式下 CSP 是否生效**：`AppManager::csp()` 在 dev 时优先 `devCsp`、否则回退 `csp`（`tauri-v2.12.1 crates/tauri/src/manager/mod.rs:361-370`），但注入路径 `get_asset()` 处理的是打包资产；dev 前端由 `http://localhost:9000` 提供（`src-tauri/tauri.conf.json:8`）。dev 的具体注入方式**未确认**（不影响本报告结论：dev 同样没有 `font-src`/`style-src` 限制）。
- Windows/WebView2 上 CSP 的具体送达方式（响应头 vs meta）**未确认**；不影响指令语义。

---

## 3. 主题 CSS 的加载链路与内容处理

### 3.1 安装链路

1. 目录：`raw.githubusercontent.com/Map1en/VRCX-0-Community-Themes/master/themes/index.json`（`crates/contracts/src/community_theme_protocol.rs:14-15`）。
2. manifest / CSS 的 URL 由 `community_theme_asset_url(theme_id, file)` 生成，只允许 4 个文件名（`theme.css`/`theme.json`/`preview.webp`/`README.md`）（同文件 `:89-111`），并且请求被**硬性限制在同一 origin + `/Map1en/VRCX-0-Community-Themes/master/themes/` 路径前缀**、`follow_redirects = false`：

   `证据：crates/contracts/src/external_api.rs:16-17`（origin/前缀常量）、`:386-393`（CommunityTheme 分支）、`:264`（关闭重定向跟随）

   ⚠️ 注意：本机的工作副本叫 `VRCX-0-Themes-VSCode`，但应用实际拉取的是 `Map1en/VRCX-0-Community-Themes`（仓库内 schema `$id` 也指向它：`schemas/theme.schema.json`）。主题若要被真实安装（而非仅在 dev 本地预览），必须出现在上游那个仓库的 `master` 分支。
3. 安装：并行拉 manifest + CSS，记录 `sha256`，把 CSS 快照写进配置（`VRCX_communityThemeCssSnapshot` / `VRCX_communityThemeInstalledThemes`）。

   `证据：crates/application/src/profile/community_theme/service.rs:162-209`；`.../persistence.rs:11-19, 179-217`
4. 运行：Rust 投影 → 前端把 `installedCssSnapshot` 交给样式层 → `<style data-vrcx-0-css-layer="installed-theme">` 追加到 `document.head`。

   `证据：src/services/community-theme/installedThemes.ts:41-43`；`src/services/community-theme/styleLayers.ts:15-21`；`src/services/vrcx0CssLayerService.ts:44-55`（`styleElement.textContent = cssText`，无任何改写）

层顺序（数组顺序即 DOM 顺序，后者覆盖前者）：`background-image` → `installed-theme` → `local-theme-preview` → `user-override` → `vrcx-0-rgb`（`src/services/vrcx0CssLayerService.ts:7-13`）。

### 3.2 是否对内容做过滤/改写：**完全没有**

对 `crates/**` 与 `src/**` 的检索结果：

| 主题 CSS 里的东西 | 安装路径的运行时行为 |
| --- | --- |
| `@font-face` | 原样保留（无剥离、无校验） |
| `@import`（含远程） | 原样保留（无拦截；仅 CONTRIBUTING 软规则禁止远程 CSS `@import`） |
| `url(...)` 绝对地址（https/data） | 原样保留 |
| `url(...)` 相对地址 | **原样保留、不重写** → 按文档 base（tauri 协议根）解析，主题同目录资源取不到 |
| `@keyframes` / `animation` / `transition` | 原样保留（`!important` 也不检查） |
| `position: fixed` / `z-index` / `pointer-events` 等"危险"样式 | 无静态检查，只有人工 review 要求 |
| 唯一的文本级检查 | CSS 为空 → 报错 `"Community theme CSS is empty: {theme_id}."`（`crates/outbound-adapters/src/community_theme_remote.rs:103-107`） |

相对 URL 重写只存在于 **dev/DevKit 本地预览**（`isDevToolsBuild()` 门禁），把相对 `url()` 解析成 asset 协议绝对地址：

`证据：src/services/community-theme/styleLayers.ts:43-77`；`src/services/community-theme/localPreview.ts`（调用 `rewriteLocalThemeAssetUrls`）；`src-tauri/src/commands/host/theme_debug.rs`（读取本地 `theme.css`，无大小限制、仅 devtools 构建可用）。

→ 结论与背景假设一致：**安装的社区主题只能用 data URI 或 https 绝对地址**。

### 3.3 大小限制的精确位置与行为

| 位置 | 上限 | 行为 |
| --- | --- | --- |
| 主题 CSS 下载（安装） | `COMMUNITY_THEME_CSS_MAX_BYTES = 1024 * 1024`（1 MiB） | 硬失败 |
| 用户 override CSS（保存） | 同上 1 MiB | 返回错误 `"Community theme override CSS is too large."` |
| 目录 index | 64 KiB | 硬失败 |
| manifest | 64 KiB | 硬失败 |
| stats / install report | 256 KiB / 64 KiB | 硬失败 |
| 主题数量 | 128 | — |

`证据：crates/contracts/src/community_theme_protocol.rs:22-27`；`.../service.rs:304-308`；`.../community_theme_remote.rs:93-110`；`.../external_api.rs::ensure_community_theme_response`（`community_theme_protocol.rs:113-130`）

超限是**报错而非截断**：HTTP 层先按 `content-length` 预判、再按流式累计字节判断，两处都直接 `Err("HTTP response body exceeds the N byte limit")`（`crates/vrchat-client/src/web_client.rs:323-345`）；随后协议层再对 `body.len()` 做一次上限校验并报 `"Community theme CSS <id> response is too large."`（`community_theme_protocol.rs:124-128`）。

计数单位是**字节**（Rust `String::len()` 为 UTF-8 字节数），因此中文注释会按 3 字节/字计算；CSS 里内联 base64 字体还会额外膨胀 33%。**实用预算**：若想把字体内联进 CSS，字体二进制应 ≲ 700 KiB（还要给样式规则留余量）。前端没有对应的大小校验（`src/features/themes/**`、`src/services/communityThemeService.ts` 内无字节常量）。

### 3.4 级联层级：主题是"未分层"的特权样式

- 应用的样式在 `@layer` 中（Tailwind v4：`@theme` / `base` / `components`…），主题注入的 `<style>` 是**未分层（unlayered）**。
- 普通声明：未分层 > 任何分层 → **主题的普通声明即使特异性更低，也会压过 app 在 layer 内的普通声明**（这也是主题能直接改 shadcn/Tailwind 类的原因）。
- `!important` 声明：顺序反转，**分层 important > 未分层 important** → 主题写 `!important` 也打不过 app 里带 `!important` 的分层规则（例如 §4 的减少特效规则）。
- `证据：` 层边界 `src/styles/globals.css:596`(`@layer components {`) … `:1370`(`}`)；注入顺序 `src/services/vrcx0CssLayerService.ts:44-55`。层级比较规则属 CSS Cascade 规范行为（**规范推导，未在运行的应用中实测**）。

---

## 4. "减少动效"设置与动画钩子

### 4.1 设置 → 钩子

- 设置键：`reducedMotionAndBlur`，bool，默认 `false`（`src/repositories/configKeys.ts:100`）。
- UI 文案：`view.settings.appearance.appearance.reduced_motion_and_blur` = "减少特效" / "Reduce Effects"，描述为"关闭动画、过渡和背景模糊效果"（`src/localization/zh-CN.json:2701-2702`，`src/localization/en.json:2716-2717`）。
- 生效方式：`document.documentElement.classList.toggle('reduce-effects', enabled)`，即 **`<html class="reduce-effects">`**。
  `证据：src/services/preferences/preferencesCore.ts:44`；加载/应用点 `src/services/preferences/preferenceSnapshotLoader.ts:243, 445`。

### 4.2 CSS 钩子（app 侧，`@layer components` 内）

```css
.reduce-effects *,
.reduce-effects *::before,
.reduce-effects *::after {
    transition: none !important;
    animation: none !important;
    scroll-behavior: auto !important;
}
```

`证据：src/styles/globals.css:1193-1198`（同区块还有伪元素装饰隐藏 `:1201-1207`、backdrop-blur 关闭 `:1209-1223`、feed 行进入动画关闭 `:1251-1253`）。

其它相关点：
- 另一处 backdrop/overlay 强化规则：`src/styles/globals.css:1497-1503`。
- `prefers-reduced-motion` 在 app 内的使用点（组件级 CSS）：`src/styles/globals.css:1255, 1359, 1458, 1491`、`src/styles/object-row.css:105`、`src/components/hosts/AppToaster.css:1`、`src/styles/vrcx-0-rgb.css:167`；JS 侧 `src/components/friends/usePendingOfflineBlink.ts:21`（直接读 class）、`src/components/layout/navMenuCollapse.ts:5`、`src/lib/mutual-friends/mutualFriendsSigmaGraph.ts:161`、`src/components/layout/useSidebarAutoHide.ts:79`、`src/components/media/imageCropDialogSession.ts:42`。

### 4.3 主题动画在"减少特效"下会怎样

- 主题动画元素一律挂在 `<html class="reduce-effects">` 子树内（最外层钩子如 `.vrcx-0-app-root` 也是其子孙，见 `docs/css-hooks.md`），因此 `.reduce-effects *::before/::after` 会命中主题的伪元素动画层。
- 于是：主题在"减少特效"开启时会被**自动停用**（app 的 `!important` 直接生效）。
- 主题若写 `.reduce-effects ... { animation: … !important }` **也无法反制**：app 的 important 在 layer 内，主题 important 未分层 → 分层 important 胜（§3.4，规范推导）。
- 现有先例：`themes/aurora-theme/theme.css:422, 431` 用 `.vrcx-0-app-root::before/::after` 跑 20s/28s 无限动画，且没有任何 reduced-motion 处理 —— 即完全依赖 app 的强制规则兜底。

### 4.4 主题应如何尊重它（推荐写法）

```css
/* 1) 正常播放：默认状态 */
@keyframes jirai-shimmer { /* ... */ }
.vrcx-0-app-root::after {
  animation: jirai-shimmer 12s ease-in-out infinite;
  will-change: opacity;
}

/* 2) 尊重系统偏好（WebView2 会跟随 Windows 的"显示动画"设置）。
      不加 !important：普通声明即可，app 侧同样方向的规则更强。 */
@media (prefers-reduced-motion: reduce) {
  .vrcx-0-app-root::after { animation: none; }
}

/* 3) 不需要为 .reduce-effects 单独写规则——app 的全局 !important 已经兜底；
      若要自定义"减弱版"效果，只能用 filter/静止装饰替代，无法保留动画。 */
```

约束小结：主题可以放心使用 `@keyframes`/`animation`/`transition`，但必须假设"某些用户环境下动画会被强制关闭"，因此**动画只能是增强层，不能承载信息或布局**。

---

## 5. 全局字体：定义位置与正确的覆盖点

### 5.1 定义链

| 环节 | 内容 | 证据 |
| --- | --- | --- |
| 打包字体 | `@import '@fontsource-variable/geist';`（本地 woff2，构建产物 5 个 `@font-face`，相对路径同源） | `src/styles/globals.css:4`；`dist/assets/index-Cckb3vVG.css`（`url(./geist-latin-wght-normal-BgDaEnEv.woff2)` 等） |
| Tailwind 主题变量 | `--font-sans: var(--vrcx-app-font-family, 'Geist Variable', sans-serif);`（`@theme inline`） | `src/styles/globals.css:453`；构建产物 `@layer theme{:root,:host{--font-sans:var(--vrcx-app-font-family,"Geist Variable", sans-serif)` |
| 工具类 | `html { @apply font-sans }`、`.font-heading { font-family: var(--font-sans) }` | `src/styles/globals.css:567`；构建产物 `html{font-family:var(--vrcx-app-font-family,"Geist Variable", sans-serif)}`、`.font-sans{…同上…}`、`.font-heading{font-family:var(--font-sans)}` |
| body | `font-family: var(--vrcx-app-font-family, system-ui);` | `src/styles/globals.css:562` |
| 运行时写入 | `<html>` **内联样式**：`document.documentElement.style.setProperty('--vrcx-app-font-family', …)`（custom 路径与预设路径各一处） | `src/services/themeService.ts:402-405`、`:429-432` |
| 远程 CJK 字体先例 | app 自己就用 `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP…')` 动态插入 `<style>` | `src/services/themeService.ts:51-52`、`:418-427` |

### 5.2 为什么改 `--font-sans` 基本无效

`@theme inline` 让 Tailwind 把变量**内联展开**进工具类：构建产物里 `html`、`.font-sans`、`--default-font-family` 都直接引用 `var(--vrcx-app-font-family, …)`，**不再引用 `var(--font-sans)`**。改 `--font-sans` 只剩极少数使用点（`.font-heading`）会跟着变：

`证据：dist/assets/index-Cckb3vVG.css`（`--font-sans:var(--vrcx-app-font-family,…)`、`html{font-family:var(--vrcx-app-font-family,…)}`、`.font-sans{font-family:var(--vrcx-app-font-family,…)}`、`.font-heading{font-family:var(--font-sans)}`）

> 关于构建产物：`dist/` 已存在（构建时间 2025-10-10 04:05，早于部分源码的 04:05 之后改动），因此**以源码 + 其行号为准**，`dist/` 仅用于验证 `@theme inline` 的编译结果（编译语义由 Tailwind v4 决定，不随小改动变化）。

另外，`--vrcx-app-font-family` 是被写在 `<html>` 的 **inline style** 上，优先级高于任何 `:root { … }` 规则——主题只在 `:root` 声明同名变量会被内联值压过。

### 5.3 推荐覆盖写法

```css
/* 必须 !important 才能压过 <html> 上的内联自定义属性值 */
html {
  --vrcx-app-font-family: 'Jirai Font', 'Noto Sans SC', system-ui, sans-serif !important;
}

/* 可选：让 var(--font-sans) 的少数使用点（.font-heading 等）保持一致；
   :root 就是 html，未分层声明足以压过 @layer theme 里的定义 */
:root { --font-sans: var(--vrcx-app-font-family); }

/* 兜底：直接覆盖 body 的 font-family（等价效果，见 globals.css:562） */
/* body { font-family: var(--vrcx-app-font-family); } */
```

注意：`applyAppFontPreferences` 会在用户切换"应用字体"设置时重新写入内联值；`!important` 声明仍会赢过内联的普通声明，因此主题的覆盖在用户改设置后依然有效（**规范推导；未在运行的应用中实测**）。

### 5.4 自定义字体的可行来源

| 方案 | 可行性 | 依据 |
| --- | --- | --- |
| `@font-face` + https 远程字体 | ✅ CSP 不拦；需 `remoteAssets: true`；有离线失败与 IP/UA 暴露风险 | `src-tauri/tauri.conf.json:14-31`；`CONTRIBUTING.md:62, 85-89` |
| `@font-face` + `data:` 内联字体 | ✅ CSP 不拦；但受 1 MiB CSS 上限约束（base64 ×1.33），实际字体 ≲ 700 KiB → 只能做拉丁子集，CJK 不现实 | `community_theme_protocol.rs:24`；`tauri.conf.json:27`（`data:` 属 img-src，字体侧本就无限制） |
| 复用应用自带的 Geist woff2 | ❌ 不可行：文件名为内容哈希（如 `geist-latin-wght-normal-BgDaEnEv.woff2`），主题无法稳定引用 | `dist/assets/index-Cckb3vVG.css` |
| 依赖系统字体栈（如 `system-ui`、`'Noto Sans CJK SC'`） | ✅ 零成本、离线安全，但不同机器表现不一致 | — |

---

## 6. 未确认清单

1. dev 模式下 Tauri 注入 CSP 的具体机制（是否生效、以 meta 还是响应头）——未确认。
2. Windows/WebView2 上 CSP 的送达方式（响应头 vs meta）——未确认，不影响指令语义。
3. `--vrcx-app-font-family` 用 `!important` 覆盖后在用户切换应用字体设置时的持续有效性——规范推导，未实测。
4. `.reduce-effects` 与未分层主题 `!important` 的层级胜负——依据 CSS Cascade 5 的层序规则推导，未在运行的应用中实测。
5. 配置存储（`LocalProfileConfigStore`）对单值长度是否另有上限——在 `crates/outbound-adapters/src/profile_config.rs` 未见相关限制，但未穷尽检查。
6. 主题 CSS 中 `@import` 远程 CSS 在 WebView2 下是否真能被加载（CSP 不拦，但 `@import` 在运行时注入的 `<style>` 中的解析顺序未被验证）——未确认。

---

## 7. 对 Jirai 主题的落地清单

- 体积：CSS ≤ 1 MiB（硬）；建议目标 **≤ 64 KiB**（现有最大主题 28.5 KiB，用户 override 也共用同一份预算）。
- 字体：改 `html { --vrcx-app-font-family: … !important }`；字体文件只能走 https（推荐，`remoteAssets: true`）或 data URI 子集；不要尝试引用应用自带 woff2。
- 动画：`@keyframes` 可用（有 aurora 先例），但只做装饰；同时提供 `@media (prefers-reduced-motion: reduce)` 的静止降级；不要用 `!important` 试图对抗 `reduce-effects`。
- 资源：图片走 `https:`（CSP 白名单已含 `https:`/`data:`/`blob:`）；**不要用相对路径 `url()`**（安装路径不重写）；不要用 http 远程图（CSP 会拦）。
- 发布：必须进入 `Map1en/VRCX-0-Community-Themes` 的 `master` 分支 `themes/<id>/`（origin + 路径前缀 + 不跟随重定向三重硬限制），并通过 `scripts/validate-themes.mjs`（`theme.json` 严格 JSON、目录名=id、`preview.webp` ≤ 256 KiB、根 README 链接）。
