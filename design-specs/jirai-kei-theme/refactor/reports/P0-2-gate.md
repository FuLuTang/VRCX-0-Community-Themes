# P0-2 computed-style 基线门禁

**结论：停止，第一步未通过；未执行第二步采集。**

## 第一步：运行时主题 CSS 与 artifact 比对

- Artifact：`design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`
- Artifact 字节数：`1,044,718 B`
- Artifact SHA-256：`0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc`（与任务期望一致）
- 导出文件：`/tmp/live-theme.css`
- 导出文件字节数：`0 B`
- 导出文件 SHA-256：`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`（空文件摘要）
- 比对：`cmp` 不一致（退出码 1）。
- 首个不同位置：第 1 行。运行时导出为空，没有第 1 行；artifact 第 1 行为：

```text
/* LOCAL PREVIEW DRAFT: Windose × Jirai. Not release validated. */
```

因此没有可列出的运行时对应行；artifact 差异从第 1 行开始，目标文件共 5,283 行。

### App 实际加载情况

`cdp-dump-theme.mjs` 连接到当前 app 后，发现四个 `<style>` 标签：

1. 408,361 字符，`data-vite-dev-id="C:/Users/tangh/Documents/GitHub/VRCX-0-jirai/src/styles/globals.css"`，无 `/* SECTION ... */` 标记；
2. 223 字符，`AppToaster.css`；
3. 198 字符，`vrcxCjkFont`；
4. 551 字符，`id="trustColor"`。

导出脚本只将带 `/* SECTION ... */` 标记的最大 `<style>` 当作注入主题 CSS；当前没有任何标签满足该条件，故实际导出 0 字节、section 数为 0。换言之，当前连接的 app 没有加载这份目标 artifact 作为脚本所识别的注入主题 CSS；页面当前发现的最大样式表是 `globals.css`，不是目标 artifact。依据门禁要求，不进入第二步。

## 执行记录

- 在 `design-specs/jirai-kei-theme/tools/` 执行了 `npm install`。首次因 `~/.npm/_cacache` 中 root-owned 文件报 EACCES 失败；改用 `/tmp/jirai-kei-npm-cache` 后安装成功（11 packages added，0 vulnerabilities）。
- 执行 `node cdp-dump-theme.mjs /tmp/live-theme.css`，脚本正常完成并以 `process.exit(0)` 退出。
- 未运行 `collect.mjs`，未创建或修改基线目录；未修改任何 CSS/MJS 源文件，未 commit、stash、运行 build-runtime.mjs 或调用 browser.close()。
- `npm install` 生成了未跟踪的 `design-specs/jirai-kei-theme/tools/package-lock.json`；本次未移除。
