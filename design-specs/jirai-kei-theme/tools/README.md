# tools/ — VRCX-0 运行时探测工具

这些脚本不碰源码，只通过 **CDP（Chrome DevTools Protocol）** 或**离线解析**，
读出 VRCX-0 主题的真实运行状态。

存在的理由：屎山 CSS 里有 **838 个 `!important`**，读 CSS 源码**根本判断不出**某个元素最终生效的是哪条规则。
唯一可信的判据是浏览器实际算出来的 `getComputedStyle()`。
所以整个 CSS 重构流程（见 DSH 计划面板 / goal）建立在
**「跑起来 → 读真实值 → 与 baseline 逐元素比对」** 之上。

历史教训：`checks/r98-landing-incident.md` 记录过一次
「改动写在隔离副本里没落地、源树静默回归」的事故——
所以这些工具读的是**真机真 app**，不是手搓的 mock 页面。

---

## 前置条件

### 1. 在 Windows 上启动 app（带远程调试端口）

Tauri 的 WebView2 默认不开放远程调试，要用环境变量打开。**由用户在 Windows 上执行**：

```powershell
cd C:\Users\tangh\Documents\GitHub\VRCX-0-jirai
$env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS='--remote-debugging-port=9222'
npm run tauri:dev
```

> `tauri:dev` 会触发 cargo 编译，首次可能好几分钟。
> 不要让 agent 通过 SSH 代跑——容易超时且拿不到输出。

确认监听（在 Linux 侧执行）：

```bash
ssh pc114514 'netstat -ano | findstr ":9222"'
```

### 2. 建立 SSH 隧道

9222 只在 Windows 的 `127.0.0.1` 上监听，**Tailscale 上直接访问不到**，必须转发：

```bash
ssh -o BatchMode=yes -o ExitOnForwardFailure=yes -o ServerAliveInterval=15 \
    -N -L 9222:127.0.0.1:9222 pc114514
```

建议放后台跑。验证：

```bash
curl --noproxy '*' http://127.0.0.1:9222/json/version
# 期望：{"Browser":"Edg/150.0.4078.99","Protocol-Version":"1.3", ...}
```

### 3. 安装依赖

```bash
cd design-specs/jirai-kei-theme/tools
npm install
```

> **必须在 `tools/` 目录里运行脚本。** Node 从脚本所在目录向上解析 `node_modules`，
> 在别处运行会报 `ERR_MODULE_NOT_FOUND: Cannot find package 'playwright'`。

---

## 脚本

### `cdp-probe.mjs` — 探测运行时状态（连真 app）

```bash
node cdp-probe.mjs                       # 默认 http://127.0.0.1:9222
CDP_URL=http://127.0.0.1:9333 node cdp-probe.mjs
```

输出：页面上下文数、当前路由 hash、viewport 与 dpr、`<style>` 标签清单
（每个的大小 / 是否含 SECTION 标记 / 所属文件）、`documentElement` 上的属性、
关键 CSS 自定义属性的计算值。

**用它确认**：主题到底有没有加载、当前挂在哪个 CSS 层。

> ⚠️ 它输出的 `sectionMarkers` 计数用的是宽松正则，**会比真实 SECTION 数多 1**
> （实测报 56，真实是 55）。要数 SECTION **以 `cdp-dump-theme.mjs` 的输出为准**。

### `cdp-dump-theme.mjs` — 导出运行时主题 CSS（连真 app）

```bash
node cdp-dump-theme.mjs /path/to/out.css
```

把运行时那个最大的、带 `/* SECTION */` 标记的 `<style>` 标签内容写到文件，
并额外产出 `<out>.sections.txt`（列出全部 SECTION 名）。

**用它确认**：运行时的 CSS 与仓库里的 artifact 是不是同一份
（用 `sha256sum` 比对；已知二者曾逐字节相同）。

### `palette-probe.mjs` — 调色板对比（**离线**，不需要 app）

```bash
node palette-probe.mjs
CHROME=/path/to/chrome node palette-probe.mjs
```

这个脚本**不连 app**。它：
1. 读取两个文件的文本——`VRCX-0-jirai/src/styles/globals.css` 的 `:root` 与 `.dark` 块、
   以及 artifact 的 `/* SECTION tokens */` 块；
2. 用 Playwright 起一个**本地** Chromium，`setContent` 构造一个最小页面，
   把两套变量分别挂到两个 div 上；
3. 用「插入临时元素 + `getComputedStyle`」的方式，把每个变量解析成真实颜色值；
4. 输出 `{ appVals, themeVals }` 的 JSON。

**已知局限（重要）**：
- 脚本里 **硬编码了两个绝对路径**（`APP` 指向 `/home/fulutang/Documents/Github/VRCX-0-jirai/src/styles/globals.css`，
  `THEME` 指向本仓库的 artifact）。换了目录结构就会静默读到旧内容。
- `APP` 指向的 Linux 侧 app 仓库停留在**旧 commit**（`2700a46a6`），
  而重构的目标版本是 `83e624a06…`。**两者不一致时结论不可用**。
- 它把 `.dark` 类挂在子 div 上而不是 `<html>` 上，与真实 app 的
  `<html class="dark">` 结构不同，`appVals` 的取值语义需要谨慎对待。

---

## 坑

- **连真 app 的脚本绝不能调 `browser.close()`**（`cdp-probe.mjs` / `cdp-dump-theme.mjs`）。
  它们用 `chromium.connectOverCDP()` 接入**用户正在使用的 app**，
  主动 close 会把 app 一起关掉。脚本末尾的 `process.exit(0)` 是有意为之。
  （`palette-probe.mjs` 用的是本地 `chromium.launch()`，它 `close()` 是安全的。）
- `ssh pc114514` 的默认 shell 是 **cmd.exe 而不是 PowerShell**。
  复杂命令用 `powershell -NoProfile -Command "..."`；
  不要用 PowerShell-via-stdin 做读改写（会静默失效）。
- 命令里的 `/tmp` 是 **Linux 侧**路径。跑在 Windows 上的工具（如 cua-driver）
  需要 Windows 路径，否则报 `系统找不到指定的路径。(os error 3)`。
- aarch64 机器上的 Chromium 目录是 `chrome-linux-**arm64**/chrome`，
  不是常见的 `chrome-linux/chrome`。装了 playwright 的话也可以
  `npx playwright install chromium` 让它自己管。

---

## 环境事实

| 项 | 值 |
| --- | --- |
| Windows 机器 | `DESKTOP-514514AA` / Tailscale `100.112.46.12` / 登录用户 `tangh` |
| app 仓库（Windows，真实运行环境） | `C:\Users\tangh\Documents\GitHub\VRCX-0-jirai` |
| 目标 commit | `83e624a06a813a0c95e07655e4a142355fd0f194`（分支 `codex/v2.28-jirai-port`） |
| vite dev server | Windows 上 `[::1]:9000`（只绑 IPv6 回环，需隧道才能远程访问） |
| app 路由 | hash 路由：`http://localhost:9000/#/<route>`，切换改 `location.hash` |
| 主题注入层 | `data-vrcx-0-css-layer="local-theme-preview"`（本地主题预览层，**不是**「已安装主题」层） |
| baseline artifact | `design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css` |
| artifact sha256 | `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260` |
| artifact 规格 | 1043966 B / 5271 行 / 55 个 SECTION |
