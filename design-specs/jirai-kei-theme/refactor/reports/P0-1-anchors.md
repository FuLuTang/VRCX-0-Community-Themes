# P0-1 复核锚点与计数

只读核验记录。工作目录 `/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98`，HEAD `059d0d6361852549292513a80a791e8c9a46e0e0`。

## 汇总

| 检查项 | 期望值 | 实测值 | 是否一致 | 命令 |
|---|---|---|---|---|
| (a) d836423 原始 CSS | SHA `6f7491...7260`，1,043,966 bytes | `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`，1,043,966 bytes | 是 | `git show d836423:design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css \| sha256sum`；`... \| wc -c` |
| (b) 工作树 CSS | 与 d86cfe4 一致 | `0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc`，1,044,718 bytes | 是 | `sha256sum <file>`；`wc -c < <file>` |
| (b) d86cfe4 CSS | 与工作树一致 | 同上 | 是 | `git show d86cfe4:<file> \| sha256sum; ... \| wc -c` |
| (b) HEAD CSS | 与工作树一致 | 同上 | 是 | `git show HEAD:<file> \| sha256sum; ... \| wc -c` |
| (b) 工作区状态 | 干净 | 不干净：存在未跟踪 `design-specs/jirai-kei-theme/refactor/`、`design-specs/jirai-kei-theme/tools/package-lock.json` | 否 | `git status --short --branch` |
| (c) SECTION 精确数量 | 实测 | 56 个标记 | — | Python 正则解析，见下方 |
| (c) grep 起始标记数 | 与 Python 对账 | 56 | 是 | `grep -o '/\* SECTION ' <file> \| wc -l` |
| (d) d836423 `!important` | 149 | 149 | 是 | Python `str.count`，见下方 |
| (d) d836423 `:not(` | 446 | 446 | 是 | 同上 |
| (d) d836423 唯一 6 位 hex | 100 | 102 | 否 | Python hex token 正则去重，见下方 |
| (d) d836423 `var(--` | 未提供 | 679 | — | Python `str.count` |
| (d) 工作树 `!important` | 对照 | 151 | 与 d836423 不同 | 同上 |
| (d) 工作树 `:not(` | 对照 | 445 | 与 d836423 不同 | 同上 |
| (d) 工作树唯一 6 位 hex | 对照 | 102 | 与 d836423 相同 | 同上 |
| (d) 工作树 `var(--` | 未提供 | 672 | — | 同上 |
| (e) MANIFEST themeCss SHA | 与嵌入 CSS 对照 | `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260` | 与当前夹具提取 CSS 一致；e2129fd 中不存在已提交的 fixture 文件，不能直接比较该提交内 fixture | Python 读取 JSON、解压提取，见下方 |
| (f) 本地 CDP | 通或不通实测 | 通，Edge 150 返回版本 JSON | — | `curl -s --noproxy '*' -m 5 http://127.0.0.1:9222/json/version` |

`<file>` 为 `design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css`。工作区状态显示已有未跟踪内容；本次只写入本报告，没有修改 CSS、脚本、JSON 或 MANIFEST。

## (a) 原始外观锚点：命令与原始输出
```sh
git show d836423:design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css | sha256sum
git show d836423:design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css | wc -c
```
```text
6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260  -
1043966
```

## (b) 当前状态与漂移：命令与原始输出
```sh
pwd && git status --short --branch && git rev-parse HEAD
sha256sum design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css
wc -c < design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css
for rev in d86cfe4 HEAD; do git show "$rev:design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css" | sha256sum; git show "$rev:design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css" | wc -c; done
```
```text
/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98
## master...upstream/master [ahead 17]
?? design-specs/jirai-kei-theme/refactor/
?? design-specs/jirai-kei-theme/tools/package-lock.json
059d0d6361852549292513a80a791e8c9a46e0e0
WORKTREE 0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc  design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css
1044718
d86cfe4 0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc  -
1044718
HEAD 0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc  -
1044718
```
目标 CSS 在工作树、d86cfe4、HEAD 三者相同；相对 d836423 的锚点发生漂移（SHA/字节数均不同）。

## (c) SECTION 数对账：命令与原始输出
执行的 Python 精确解析将每个字面 `/* SECTION ` 起始标记匹配到其后的闭合 `*/`：
```sh
python3 - <<'PY'
import re, pathlib
s=pathlib.Path('design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css').read_text()
markers=re.findall(r'/\* SECTION ([^*]*?) \*/',s)
print('PYTHON_MARKER_COUNT',len(markers))
print('MULTILINE_MARKER_START',repr(next(m for m in markers if '\n' in m)[:80]))
PY
grep -o '/\* SECTION ' design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css | wc -l
```
原始输出：
```text
PYTHON_MARKER_COUNT 56
MULTILINE_MARKER_START 'chrome · Windose × Jirai — window chrome R3.\\n   Scope: only the two real chrome bars. No invented text, icons, DOM or events.'
56
```
列表中的 `...` 仅为报告压缩显示；计数与实际 Python 输出一致。那个 header 含多行自然语言而不是简短 slug，故 `grep -o '/\* SECTION [a-z0-9-]*'` 会把 marker 名字截成 `chrome`；但这不改变它对 `/* SECTION ` 的出现次数。当前目标文件上该错误模式的匹配数也是 56，并未实测出题述的 55。按精确闭合注释解析，权威计数为 **56**。差异根因是 marker header `chrome · Windose × Jirai — window chrome R3.` 后含多行注释正文，在首个 `*/` 才结束；限制字符集的 grep 不是 marker parser。

## (d) 字符计数：命令与原始输出
```sh
python3 - <<'PY'
import subprocess,re,pathlib
p='design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css'
for label,b in [('d836423',subprocess.check_output(['git','show',f'd836423:{p}'])),('worktree',pathlib.Path(p).read_bytes())]:
 s=b.decode(); colors=set(re.findall(r'#[0-9a-fA-F]{6}(?![0-9a-fA-F])',s))
 print(label,'bytes',len(b),'important',s.count('!important'),'not',s.count(':not('),'var',s.count('var(--'),'hex_unique',len(colors))
PY
```
```text
d836423 bytes 1043966 important 149 not 446 var 679 hex_unique 102
worktree bytes 1044718 important 151 not 445 var 672 hex_unique 102
```
注意：预期唯一颜色 100 与采用的 6 位 hex token、大小写不敏感去重实测 102 不一致；不擅自改写结果。

## (e) 基线一致性：命令与输出
MANIFEST SHA 命令：
```sh
python3 - <<'PY'
import json
p='design-specs/jirai-kei-theme/baseline/MANIFEST.json'
d=json.load(open(p)); print('MANIFEST_THEME_SHA',d['themeCss']['sha256'])
PY
```
原始输出：
```text
MANIFEST_THEME_SHA 6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260
```
e2129fd fixture 存在性命令：
```sh
git ls-tree -r --name-only e2129fd design-specs/jirai-kei-theme/baseline
```
原始输出中有 `baseline/MANIFEST.json`、README、脚本等，不含 `baseline/fixtures/*.html.gz`。所以不能声称对比 e2129fd 提交内夹具；提交内 fixture 不存在。另对工作树现存夹具解压并提取目标 style 的命令：
```sh
python3 - <<'PY'
import pathlib,gzip,re,hashlib
pat=re.compile(rb'<style\b(?=[^>]*data-vrcx-0-css-layer="local-theme-preview")[^>]*>(.*?)</style\s*>',re.I|re.S)
for p in pathlib.Path('design-specs/jirai-kei-theme/baseline/fixtures').glob('*.html.gz'):
 h=gzip.decompress(p.read_bytes()); m=pat.search(h)
 if m:
  c=m.group(1); print(p.name,len(c),hashlib.sha256(c).hexdigest())
PY
```
各 fixture 的输出 CSS 均为 1,043,966 bytes、SHA `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260`。样例原始输出：
```text
activity.html.gz 1043966 6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260
```
此 SHA 与当前 MANIFEST 相等，但因上述缺项，该 fixture 内容不是从 e2129fd 提交树读出。

## (f) CDP：命令与原始输出
```sh
curl -s --noproxy '*' -m 5 http://127.0.0.1:9222/json/version
```
```json
{
   "Browser": "Edg/150.0.4078.99",
   "Protocol-Version": "1.3",
   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0",
   "V8-Version": "15.0.23.12",
   "WebKit-Version": "537.36 (@a975820f5d56733ba2761d69ccabf7b2c5ab369b)",
   "webSocketDebuggerUrl": "ws://127.0.0.1:9222/devtools/browser/a46833eb-0795-4dff-ba41-710cf9673218"
}
```
