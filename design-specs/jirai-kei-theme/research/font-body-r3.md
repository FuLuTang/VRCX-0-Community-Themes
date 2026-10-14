# 正文像素字体 r3：覆盖与扩充评估

- 范围：只写本报告与 [fonts-pixel-body.css](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/fonts-pixel-body.css>)；主应用、字体二进制、charset 与原 runtime 全部只读。
- 新要求取代「用户文字保留系统字体」：普通 UI、昵称、设置正文、弹层正文均优先像素字体；缺字仍按用户选定 app 栈回退。
- 验证：源码级级联分析、fontTools 二进制 cmap 与内存子集测量；未运行 git/构建/Windows 连接，**未宣称 WebView2 实机通过**。

## 1. 真实读取链与 CSS 方案

| 依据 | 结论 |
|---|---|
| [globals.css:397](</home/fulutang/Documents/Github/VRCX-0-jirai/src/styles/globals.css#L397>), [452–453](</home/fulutang/Documents/Github/VRCX-0-jirai/src/styles/globals.css#L452-L453>) | Tailwind `@theme inline`：heading 经 sans 读取 app 栈；只改 token 不足，须直接覆盖实际 `.font-sans/.font-heading`。 |
| [globals.css:560–568](</home/fulutang/Documents/Github/VRCX-0-jirai/src/styles/globals.css#L560-L568>) | body 明确读取 app 栈，html 应用 sans；两者均设正文族，body 继承覆盖 #root 外 portal。 |
| [themeService.ts:402–405](</home/fulutang/Documents/Github/VRCX-0-jirai/src/services/themeService.ts#L402-L405>), [429–434](</home/fulutang/Documents/Github/VRCX-0-jirai/src/services/themeService.ts#L429-L434>) | app 栈在 html inline；保留该变量，只把它放到新像素栈末尾，禁止 app→sans→app 循环。 |
| [fonts.ts:5–47](</home/fulutang/Documents/Github/VRCX-0-jirai/src/shared/constants/fonts.ts#L5-L47>) | 用户设置的 Geist/system/custom 等成为缺字 fallback，而非强行抹掉设置。 |
| [FriendListColumns.tsx:225–227](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/friends/components/FriendListColumns.tsx#L225-L227>) | 好友昵称只有 name/truncate，无独立字体声明，正常继承正文。 |
| [SettingsCard.tsx:63–70](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/settings/components/SettingsCard.tsx#L63-L70>) | 设置标题 heading 与普通说明正文均覆盖；原 text-sm/leading-snug 不变。 |
| [dialog.tsx:34–35](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/dialog.tsx#L34-L35>), [69–74](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/dialog.tsx#L69-L74>), [tooltip.tsx:44–56](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/tooltip.tsx#L44-L56>) | Base UI portal 正文继承 body，不能只框 `.vrcx-0-app-root`；dialog 原 text-sm、tooltip 原 text-xs 保留。 |
| [AssistantDialog.tsx:308–316](</home/fulutang/Documents/Github/VRCX-0-jirai/src/features/assistant/AssistantDialog.tsx#L308-L316>) | dialog-content 有 inline app 字体；唯一 important 精确锁定这个 slot + inline 变量，不扫 descendants。 |
| [globals.css:597–604](</home/fulutang/Documents/Github/VRCX-0-jirai/src/styles/globals.css#L597-L604>) | JSON 本来等宽；仅 `.entity-json-view` 恢复 mono，保留自身 1.55 行高。 |
| [UserDialogInfoTab.tsx:301–322](</home/fulutang/Documents/Github/VRCX-0-jirai/src/components/dialogs/user-dialog/components/UserDialogInfoTab.tsx#L301-L322>) | `pre.font-sans` 是用户说明，不是代码，仍像素；其余 pre/code/samp 与 `.font-mono` 保留等宽。 |
| [kbd.tsx:5–8](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/kbd.tsx#L5-L8>) | Kbd 实际是 sans，不应误报原本 mono：例外保留 app sans；显式 kbd.font-mono 仍等宽。 |
| [input.tsx:8–13](</home/fulutang/Documents/Github/VRCX-0-jirai/src/ui/shadcn/input.tsx#L8-L13>) | 表单仅继承家族，保留 text-base/md:text-sm；mono 输入仍由 utility 管理。 |

- [新增 CSS:4–24](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/fonts-pixel-body.css#L4-L24>) 设置 token、根继承和真实 utility；[29–52](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/fonts-pixel-body.css#L29-L52>) 处理控制项与例外。没有全局 `* !important`、图标族覆写、字号、行高、font 简写或全局 font-synthesis。
- 拼接顺序：字体 face → 原 runtime → 新正文 CSS。原 [windose-runtime.css:6–14](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/windose-runtime.css#L6-L14>) 仍对 chrome 固定 12px；本文件不修改此前 chrome 设计，**不强制正文全为 12px**。
- 保留源码字号意味着 13/14/16px 不保证完美点阵；字号/DPR 清晰度需真实 Chromium/WebView2 复核，不能以改小文字偷换验收。

## 2. 二进制覆盖实测

使用现有 `/tmp/pixfont/venv/bin/python`，解码 [fonts.css](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/fonts/fonts.css>) 的两个 data URI 到内存，`TTFont.getBestCmap()`：ASCII **95**、CJK **1642**；[charset.txt](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/fonts/charset.txt>) 请求 1655。完整 Fusion 源位置见 [pixel-fonts.md:559](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/research/pixel-fonts.md#L559>)，本次读取其 woff2 得 **36999** cmap。

| 样本 | 当前子集缺字 | 完整 Fusion |
|---|---|---|
| 二階堂アコ | 階アコ | 全中 |
| 雪之夏萌心 | 雪夏 | 全中 |
| 冷風 | 風 | 全中 |
| 皮卡丘 | 丘 | 全中 |
| `，。！？：；「」『』（）【】、…—“”‘’·・` + ASCII 标点 | ・ | 全中 |
| U+3040–309F 平假名块 | 4/96 覆盖 | 93/96；缺 3040/3097/3098（未分配码点） |
| U+30A0–30FF 片假名块 | 2/96 覆盖 | 96/96 |
| U+FF61–FF9F 半角假名/标点 | 0/63 覆盖 | 63/63 |
| U+31F0–31FF 扩展假名 | 0/16 覆盖 | 0/16，扩大子集也无效 |

- 当前字符集所缺 `‹›€√∞≈≠≤≥✓✔✕✗` 共 13 个，经完整 Fusion cmap 再次确认也不存在；只能 fallback 或另选合法补充 face，不能承诺扩同一字体即可补齐。
- U+3000–303F 中文标点 64/64 已覆盖；通用标点 U+2000–206F 当前 17、完整源 39。样本不是任意用户昵称全集：罕用汉字、emoji、扩展假名仍允许 fallback。

## 3. 给 Leader 的最小可执行扩充

最小验收补丁：旧 charset ∪ **階アコ雪夏風丘・**（8 个）。面向普通日文昵称，建议同时加 **U+3041–3096、U+3099–30FF、U+FF61–FF9F**；中英标点余量加 U+2000–206F、U+3000–303F、U+FF01–FF60，由源 cmap 自然筛掉不支持码点。

```bash
# 仅供 Leader 执行；本 Agent 未产生/替换任何字体二进制。
ROOT=/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme
/tmp/pixfont/venv/bin/pyftsubset \
 /tmp/pixfont/dl/x/fusion-pixel-12px-proportional-zh_hans.ttf.woff2 \
 --text-file="$ROOT/fonts/charset.txt" \
 --unicodes=U+968E,U+96EA,U+590F,U+98A8,U+4E18,U+3041-3096,U+3099-30FF,U+FF61-FF9F,U+2000-206F,U+3000-303F,U+FF01-FF60 \
 --flavor=woff2 --no-hinting --desubroutinize --output-file=/tmp/fusion-body-r3.woff2
```

Leader 需同步最终 charset、CJK face 的 base64、字数/体积/许可说明并重新检查样本；不得仅补 CSS 就宣布缺字修好。中文用户内容余量优先 GB2312 一级 3755 字 ∪ 旧 UI ∪ 上述昵称/假名，不建议直接内联完整 Fusion（928148 B → 1237532 B base64，本身已超 1MiB）。要复现下表 4390 字方案，先执行下段，再把上方 `--text-file` 改为 `/tmp/fusion-body-gb2312.txt`（保留相同 `--unicodes`）：

```bash
/tmp/pixfont/venv/bin/python - <<'PY'
from pathlib import Path
p = Path('/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/fonts/charset.txt')
gb = ''.join(bytes([a,b]).decode('gb2312', errors='ignore') for a in range(0xb0,0xd8) for b in range(0xa1,0xff))
Path('/tmp/fusion-body-gb2312.txt').write_text(''.join(sorted(set(p.read_text() + gb) - {'\r','\n'})), encoding='utf-8')
PY
```

## 4. 1MiB CSS 预算与边界

- 当前 [字体 CSS](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/fonts/fonts.css>) **74891 B**，其中 CJK payload **71056 B**；[新正文 CSS](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/fonts-pixel-body.css>) **2458 B**。
- 当前 [preview theme](</home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css>) **242802 B**（包含旧字体）。若仅拼正文，新总量 **245260 B**，距 1048576 B 余 **803316 B**；其他 Leader 改动会改变这份快照。
- 替换 CJK 的预算公式：`最终CSS = 当前主题 + 2458 - 71056 + 新CJK_base64长度 + 其他新增`；再按最终文件的 UTF-8 字节数复核，不按字符数估算。
- 已用 fontTools 在 **BytesIO 内存**实际子集化/woff2 压缩，无落地二进制；相同 no-hinting/desubroutinize 选项，结果如下（最终总量仅按上述快照推算）：

| 扩充方案 | cmap | woff2 B | base64 B | 推算主题 B |
|---|---:|---:|---:|---:|
| 旧集 + 8 个验收字 | 1650 | 53832 | 71776 | 245980 |
| 上项 + 常用假名/半角/标点范围 | 1917 | 58344 | 77792 | 251996 |
| 上项 + GB2312 一级 3755 字 | 4390 | 141208 | 188280 | 362484 |

- **建议用 4390 字方案**：距 1MiB 尚余 686092 B，较小子集更符合此次普通中文用户文字要求；仍不能保证任意姓名/繁体/罕用字完全像素化。
- 尚未完成 Windows 字体加载、缺字 fallback 混排、中文/日文截断与 portal 截图验收；本报告仅保证已核实的源码级策略和离线 cmap 结论。
