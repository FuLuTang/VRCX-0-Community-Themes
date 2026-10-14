# 事故记录：R9.8 迁移未落盘导致的构建回退

**日期**：2026-10-14
**发现方式**：exclusion-cleanup subagent 在核对 JK 源文件 mtime 时发现异常

## 现象

R9.8（上下文排除子句迁移）当时只在 `/tmp/exclusion-migration/jk/runtime` 这个**隔离副本**里完成，
构建出 theme.css 后直接部署到 Windows，**从未把改动回写进 JK 仓库的 `runtime/*.css`**。

结果：JK 仓库的源文件长期停留在**迁移前**的状态。之后任何一次从 JK 构建，都会静默地
把 R9.8 的修复全部丢掉——而且**构建会成功、字节数看起来也正常**，没有任何报错。

本次实际发生：为加 2× 手机动画而从 JK 构建，产物退回迁移前状态并推给了用户。

## 检测方法（构建后必查）

```python
s = open('preview-package/jirai-kei-theme/theme.css', encoding='utf8').read()
print('总字节', len(s.encode()))
print(':where(        ', s.count(':where('))                                   # R9.8 后应为 226，迁移前 180
print('login-page :not', s.count(':not([data-vrcx-0-surface="login-page"] *)')) # R9.8 后应为 43，迁移前 85
print('entity :not    ', s.count(':not(.entity-dialog *)'))                    # R9.8 后应为 101，迁移前 140
```

更严格的做法：拿已知正确的 theme.css 逐段对比（`/* SECTION <name> */` 切分），
除本次有意修改的段外必须**逐段字节相等**。

## 恢复步骤

1. 取一份已知正确、已被用户验收过的 theme.css（本项目里是 Windows 侧备份
   `jirai-kei-theme-backup-20261014-0546/theme.css`，1,027,835 B，SHA-256
   `035B2F6C887598B4166EF3B00B58FE907F01AA518E22467847453965DCA5AA11`）。
2. 按 `/* SECTION <name> */` 切段，提取受影响文件的原始内容，逐字写回
   `runtime/<name>.css`。产物是拼接出来的，所以提取回来的就是源文件原文。
3. 重建，再用上面的计数和逐段对比复验。

R9.8 的权威源副本同时也存在于 `/tmp/exclusion-migration/new-css/`（已验证与部署产物逐段一致）。

## 防再犯

- **改 CSS 之前，先确认 JK 源文件是最新的**。看到 `:where(` 计数是 180 而不是 226，就说明源是旧的。
- 不要把"部署成功 + 字节数合理"当作源树正确的证据——两者完全独立。
- 隔离副本里做完的事，必须显式落盘，并把落盘这一步当成任务的一部分，而不是收尾的可选项。
