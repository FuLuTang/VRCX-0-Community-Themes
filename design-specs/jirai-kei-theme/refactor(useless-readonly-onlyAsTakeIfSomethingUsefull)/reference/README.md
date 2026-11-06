# reference/ — 验收真基线

## baseline-theme.css

**这是唯一权威的验收基线**，不是 `runtime/preview-package/jirai-kei-theme/theme.css`。

来源：从 `baseline/fixtures/*.html.gz` 里 `<style data-vrcx-0-css-layer="local-theme-preview">`
标签中提取。42 个冻结状态里嵌的都是同一份（已抽样核对 sha 一致）。

| 项 | 值 |
|---|---|
| bytes | 1,043,966 |
| sha256 | `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260` |
| 与 `baseline/MANIFEST.json` 的 `themeCss.sha256` | **一致** ✓ |

## ⚠️ 重要：为什么不能用 `runtime/preview-package/jirai-kei-theme/theme.css`

该文件虽然被 MANIFEST 的 `themeCss.path` 指向，但**其内容与 MANIFEST 记录的 sha256 不符**：

| 文件 | bytes | sha256 |
|---|---|---|
| `reference/baseline-theme.css`（真基线） | 1,043,966 | `6f7491de…` |
| `runtime/preview-package/jirai-kei-theme/theme.css` | 1,044,718 | `0d5e3958…` |

两者相差 **752 字节**，mtime `2026-10-15 03:54:15`。

**基线 snapshot 是用前者的 CSS 采集的**（fixture 里嵌的就是它），所以一切
computed-style 对比的参照物必须是 `reference/baseline-theme.css`。

## 复现提取

```sh
python3 - <<'PY'
import gzip, re
raw = gzip.open('baseline/fixtures/tools_inventory.html.gz','rt',encoding='utf-8',errors='ignore').read()
m = re.search(r'<style\b[^>]*data-vrcx-0-css-layer=(["\'])local-theme-preview\1[^>]*>([\s\S]*?)</style>', raw, re.I)
open('reference/baseline-theme.css','wb').write(m.group(2).encode('utf-8'))
PY
sha256sum reference/baseline-theme.css   # 期望 6f7491de…
```
