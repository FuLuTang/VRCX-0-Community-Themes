# 非 Lucide 图标复核（remaining-icons）

日期：2026-10-11 · 复核者：subagent · 主仓库只读、未运行应用、未做 git/构建
结论口径：**不采信 `acceptance-icons.md` 第 4 节的"仅 4 处"表述**，全部结论重新独立取证。

---

## 0. 一句话结论

被点名的 5 项里，**3 项其实就是 Lucide（已被 243 覆盖）**、**1 项是永不渲染的死代码**、**1 项（状态 mask）确实是 VRChat 品牌资产且默认关闭**。
真正被上一报告漏掉的不是"更多图标"，而是**两类非 SVG 载体的图形**：CSS 伪元素字符图形（3 处）和浏览器原生控件自有图形（2 类）。

---

## 1. 点名 5 项逐项复核

| # | 项目 | 复核结果 | 证据（主仓库） |
|---|---|---|---|
| 1 | `AnimatedThemeToggler` | **是 Lucide**：`import { Moon, Sun } from 'lucide-react'`，渲染 `<Sun/>`/`<Moon/>`；类名 `.lucide-sun` / `.lucide-moon`，**均在 243 覆盖内**。magicui 组件本身无自有 svg | `src/ui/shadcn/animated-theme-toggler.tsx:1`、`:326` |
| 2 | `TitleBarUpdateButton` | **没有任何图标**。按钮内容 = i18n 文本 `t('nav_menu.update')`，下载态是两行文字 + 一个 `h-[2px]` 进度条 `<span>`（纯 CSS） | `src/components/layout/TitleBarUpdateButton.tsx:79-92`、`:141-149` |
| 3 | `number-field` `CursorGrowIcon` | **是内联手写 svg（全仓唯一非 lucide 内联图标），但 `NumberFieldScrubArea` 全仓 0 引用 → 死代码，运行时永不渲染**；且它被 portal 到 `document.body`，不在 number-field 子树内 | `src/ui/shadcn/number-field.tsx:116-160`；`grep -rn "NumberFieldScrubArea\b" src` 仅命中定义文件 |
| 4 | 三个状态 mask | **确认是唯一一组真·非 Lucide 图标素材**（Illustrator 28.4.1 导出、512×512、无来源声明），但**默认不生效**：开关 `VRCX_accessibleStatusIndicators` 默认 `false` | `src/assets/masks/{askme,busy,joinme}.svg`；`src/styles/globals.css:1151-1163`；`src/services/preferences/preferenceSnapshotLoader.ts:244`；`src/state/preferencesStore.ts:304` |
| 5 | 窗口控制按钮 | **是 Lucide**：`MinusIcon` / `SquareIcon`（最大化时换 `CopyIcon`）/ `XIcon`；`.lucide-minus`/`.lucide-square`/`.lucide-copy`/`.lucide-x` **均在 243 覆盖内**（已逐项 HIT 验证） | `src/components/layout/AppTitleBar.tsx:1-7`、`:83`、`:148`、`:157-160`、`:170` |

**附带确认**：`decorations: false`（`src-tauri/tauri.conf.json:43`）→ 窗口按钮确实是应用自绘而非系统装饰，所以上表第 5 项就是全部窗口控件图标，无遗漏。

---

## 2. 上一报告"仅 4 处"错在哪

第 4 节表格本身列了 6 项（3 mask + 1 cursor + 2 chart），数量自洽；问题是**取样范围只覆盖"内联 `<svg>` + CSS `mask:url()`"两种载体**，因此漏掉：

| 漏项 | 内容 | 位置 |
|---|---|---|
| CSS 伪元素字符图形（3 处） | `content:'\25BE'`（▾ 展开）、`content:'\25B8'`（▸ 折叠）、`content:'...'`（省略占位）—— 靠字体回退渲染，跨平台字形不一致 | `src/styles/globals.css:626-627`、`:630-631`、`:647-648` |
| 原生控件自有图形（2 类） | ① 原生 `<select>` 的下拉箭头（全仓均**无** `appearance-none`）② `<input type="time">` 的 UA 时钟图标 | 如 `src/features/charts/RelationshipTimelinePageImpl.tsx:148`、`src/components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:749`；`src/components/hosts/tools-dialogs/presence-automation/TimeRulesTab.tsx:260,275` |

已确认**排除**（不是图标）：
- `src/components/dialogs/world-dialog/WorldDialogTabPanels.tsx:590` 的 `'✓' / '—'` 是表格**单元格文本值**，不是图标。
- 全仓 `<img>` 仅 6 处（`FadeInMedia`、全屏查看器、主题预览、截图），均为位图。
- 无图标字体：无 `@font-face`、无 `.woff/.ttf/.eot`。
- 无其它图标库：`react-icons` / `@radix-ui/react-icons` / `@heroicons` / `@tabler` / `@iconify` / `feather-icons` / `bootstrap-icons` / `@fortawesome` / `@phosphor` 全部 0 命中；`src/components/reui/*` 亦只用 `lucide-react`。
- 无 CSS `background-image` 图标、无 `<details>/<summary>` 原生 marker（`list-style: none`，globals.css:610）、无 `::-webkit-scrollbar-button`。
- `src/assets/` 下只有那 3 个 mask 文件。

**准确口径（建议替换上一报告的说法）**：

> 非 Lucide 图形 = 内联 SVG 3 处（1 个死代码图标 + 2 个图表）+ CSS `mask:url()` 外部 SVG 3 处（VRChat 状态，默认关）+ 伪元素字符图形 3 处 + UA 原生控件图形 2 类。

---

## 3. 覆盖完整性的独立复算（结论：生产缺口 0）

用只读脚本解析 `lucide-react@1.46.0` barrel 做 canonical 归并（不落盘，不改仓库）：

- barrel 可导出标识符 6294 个；`src` 共引用 **258** 个标识符（`import *` 0 处）
- 归并后 **244 个 canonical icon name**（`LucideIcon` 是类型导入，非图标）
- `dist/jirai-icons.css` 覆盖 **243** 个 name
- **唯一缺失 = `grid-3x3`** → 仅被 `src/components/layout/ToolbarControls.test.tsx:5,58` 使用（`GridIcon`，barrel 中指向 `icons/grid-3x3.mjs`），**jsdom 测试专用，不进入生产 UI** ⇒ 生产未覆盖数 = 0
- 反向检查：`--px` 中**未被任何源码使用的定义 = 0**（无死定义）
- 别名归并验证成立：`CheckCircleIcon → name:circle-check-big / alias:check-circle`、`MoreHorizontalIcon → ellipsis/more-horizontal`、`Trash2Icon → trash/trash-2` 等 → `.lucide-<alias>` 与 `.lucide-<name>` 会同时出现在 class 上，故 243 条 canonical 名单足以命中全部别名用法

复现命令见 §7。

---

## 4. CSS 可替换方案（全部不改 DOM）

### 4.0 前置事实（决定怎么写）

1. **层序**：Built-in app CSS(1) → 官方背景(2) → **已安装主题快照(3)** → 用户覆盖(4)。主题同选择器即可胜出，不需 `!important`；但用户覆盖 CSS 在主题之后（`docs/css-hooks.md`）。
2. **禁止相对路径**：主题 CSS 里的 `url('../assets/...')` 不可靠（快照可能被内联，基准 URL 是应用页面）。**必须用 `data:` URI** —— 现有主题已如此（`themes/jirai-kei-theme/theme.css:205-207` 的 `--jirai-lace/collar/bow`）。
3. **`--px` 是矢量 SVG 而非位图**：243 条全部为 `data:image/svg+xml`（0 条 base64 位图），`viewBox='0 0 16 16'`、`shape-rendering='crispEdges'`、路径为整数步进像素块（`dist/jirai-icons.css`，110,865 B）。

### 4.1 窗口控制按钮 + Sun/Moon（已覆盖，但存在非整数缩放）

实测显示尺寸（lucide 默认 `width="24" height="24"` 是 HTML 属性，见 `node_modules/lucide-react/dist/esm/shared/src/build/defaultAttributes.mjs`）：

| 图标 | 位置 | 尺寸 | mask 缩放比 |
|---|---|---|---|
| `MinusIcon` | AppTitleBar:148 | 24px（无 size class） | 1.5× |
| `SquareIcon` / `CopyIcon` | AppTitleBar:157（带 `size-3`） | 12px | 0.75× |
| `XIcon` | AppTitleBar:170 | 24px | 1.5× |
| `Sun` / `Moon` | animated-theme-toggler:326 | 24px | 1.5× |

窗口按钮的精确选择器（`rounded-none` / `border-0` / `w-9` 是 `AppTitleBar.tsx:43` 写死的字面 class，**只有这三个窗口按钮带**；其余 titlebar 按钮是 `rounded-md size-7`）：

```css
/* 统一到 16px（1× 栅格，最锐利）；也顺带修掉 24/12 不统一的观感 */
.vrcx-0-titlebar button[data-slot="button"].rounded-none.border-0 > svg.lucide {
  width: 16px;
  height: 16px;
}
/* 关闭按钮单独（避开 i18n 的 aria-label）：AppTitleBar.tsx:165 */
.vrcx-0-titlebar button[class*="hover:bg-destructive"] > svg.lucide { width: 16px; height: 16px; }
/* 主题切换按钮（Sun/Moon 在 button.icon-sm 内，button 自带 size-7） */
.vrcx-0-titlebar button:has(> span.sr-only) > svg.lucide { width: 16px; height: 16px; }
```

- `button[data-slot="button"]` 锚点来自 `src/ui/shadcn/button.tsx:51`。
- 想单独换某个窗口图标的图形（无需新素材时可直接复用 `--px` 机制）：`.vrcx-0-titlebar button.rounded-none > svg.lucide-x { --px: url("data:image/svg+xml,..."); }`
- ⚠️ 不建议 `mask-size: 32px 32px` 硬放大：24px 盒会被裁切。
- 主题切换按钮的 `:has(> span.sr-only)` 是稳定锚（`animated-theme-toggler.tsx:327` 的 `<span className="sr-only">Toggle theme</span>` 是组件内写死的）。

### 4.2 三个状态 mask（可换，但建议保留）

精确选择器（需覆盖 `globals.css:1151-1163` 的三条；DOM 有**两条**路径，必须都写）：

```css
html.accessible-status-indicators
  :is(i.x-user-status, .user-status-indicator).joinme {
  -webkit-mask: url("data:image/svg+xml,...") center / contain no-repeat;
  mask: url("data:image/svg+xml,...") center / contain no-repeat;
}
/* askme / busy 同理，替换类名即可 */
```

- 路径 A：`<i aria-hidden="true" class="x-user-status joinme">` ← `src/shared/utils/userStatus.ts:56-82`
- 路径 B：`<span class="user-status-indicator joinme bg-[var(--status-joinme)]">` ← `src/shared/utils/friendStatus.ts:14-33`，经 `src/components/UserStatusDot.tsx` 渲染（外层 `rounded-full border-3 border-background`）
- 主仓库只写了 `mask`（无 `-webkit-mask`），主题覆盖时**双写**更稳。
- **图形语义**（从 path 数据读出，未渲染确认；三者同为 512×512 "实心方板挖空一个内部符号" 的同一族资产）：
  - `busy.svg` — 外框整块方板，内路径 `M456,271.76…H96.2…` 挖空一个 x∈[56,456]、y∈[≈199,≈313] 的**水平圆角横条**
  - `joinme.svg` — 挖空一个顶点在上 `(83.7,290.7)→(约224,111)→(约362,296)` 的**三角/帐篷形（向上箭头）**
  - `askme.svg` — 外框 `M0,0v238.8` + 一条 S 形曲线到右下，挖空**右下角曲边区域**（类"问号钩"）
- ⚠️ **圆角裁剪**：宿主元素同时带 `rounded-full`（`globals.css:1119`、`UserStatusDot.tsx:31/45/63`）→ 方形 mask 的外角会被 border-radius 裁掉，实际呈现"圆内挖空符号"。要显示完整方块需再加 `border-radius: 0`（属改视觉，本次不做）。
- 开启后颜色来自 `--status-joinme/#00b8ff`、`--status-busy/#c80928`、`--status-askme/#e97c03`（`globals.css:118-120`、`:349-354`），主题改这三个变量即可换色，不必碰 mask。

### 4.3 `CursorGrowIcon`（死代码，建议不投入）

- `NumberFieldScrubArea` 全仓 0 引用 → `CursorGrowIcon` 永不渲染。
- 即便将来启用：base-ui 的 `ScrubAreaCursor` 渲染 `<span role="presentation">` 并 **portal 到 `document.body`**，且仅在 `isScrubbing && !webkit && !touch && !pointerLockDenied` 时存在（`node_modules/@base-ui/react/number-field/scrub-area-cursor/NumberFieldScrubAreaCursor.js`）；shadcn 封装**没给 `data-slot`**，只有 `drop-shadow-[0_1px_1px_#0008] filter` 这个脆弱 class。
- 唯一稳定锚点是组件里写死的 `viewBox="0 0 24 14"`（全仓唯一；lucide 一律 `0 0 24 24`）：

```css
body > span[role="presentation"]:has(> svg[viewBox="0 0 24 14"]) > svg { /* … */ }
```

- 建议：**不处理**；若要长期可主题化，应由主仓库给 `ScrubAreaCursor` 加 `data-slot` 后再做（本次不可改主仓库）。

### 4.4 伪元素字符图形（纯 CSS 可换，但属新视觉 → 仅登记）

```css
.entity-json-view-expand::after,
.entity-json-view-collapse::after { content: ''; /* + mask / background-image */ }
```
`content:'\25BE'/'\25B8'` 依赖字体回退，不同平台字形不同；想统一成像素风必须 `content:''` + mask。**本次按约束不做**。

### 4.5 原生控件图形（部分可控）

- 原生 `<select>`：加 `appearance: none` 即可接管箭头（纯 CSS），但需要自备箭头图（新素材）。
- `<input type="time">`：`::-webkit-calendar-picker-indicator` 可改 `background-image` / `filter` / `opacity` / `display`。

---

## 5. 必须保留（不做替换，建议写进主题约束）

| 项 | 位置 | 理由 |
|---|---|---|
| 甘特依赖箭头 | `src/components/reui/gantt/gantt-view.tsx:3223`（`<svg data-slot="gantt-dependencies">`） | **数据可视化**：viewBox 由 `trackRemWidth × totalRem` 动态生成，形状由数据决定，不是图标 |
| 关系时间线图表 | `src/features/charts/RelationshipTimelinePageImpl.tsx:195-196`（`<svg role="img">`） | **图表**：viewBox 由数据宽高决定 |
| 三个状态 mask | `src/assets/masks/*.svg` | **VRChat 品牌状态图形**；Adobe Illustrator 导出、NOTICE/LICENSES 均未声明来源与授权 → 换掉即改品牌语义，且引入授权风险 |
| `<img>` 位图（头像/缩略图/主题预览） | 6 处 | 位图不是图标 |

---

## 6. 不确定 / 未验证（不要当成已通过）

1. 三 mask 的**符号语义**是从 path 几何推断的，**未渲染确认**（本任务只读、未启动应用）。
2. `rounded-full` 对 mask 的裁剪效果是**推断**（Chromium 下 border-radius 与 mask 叠加行为未实测）。
3. 24px（1.5×）/12px（0.75×）下 `crispEdges` 的最终表现是**推断**：预期是"像素块宽度 1px/2px 不均"而非单纯模糊；**需真机实测**。
4. `NumberFieldScrubArea` 0 引用是**静态**结论；未见 lazy/动态 import 机制，但不排除运行时插件路径。
5. `data-icon` 属性（`inline-start` 395 处 / `icon` 54 处 / `inline-end` 35 处）在 CSS 中 **0 定义** → 它是应用留给主题的语义钩子，但**未统计其占全部图标实例的比例**，作主锚点不如 `.lucide-*` 可靠。
6. macOS WKWebView 下无前缀 `mask` 与 `:has()` 的可用版本未核（Windows WebView2 无虞）。
7. `grid-3x3` 若将来进入生产 UI，会以原生 lucide 描边风格混入像素图（当前仅测试引用）。

---

## 7. 完整覆盖应如何验证（可复现）

### 7.1 静态覆盖校验（本次已跑通，只读）

```bash
cd /home/fulutang/Documents/Github/VRCX-0-jirai && node -e '
const fs=require("fs"),path=require("path");
const barrel=fs.readFileSync("node_modules/lucide-react/dist/esm/lucide-react.mjs","utf8");
const map=new Map();
const reExp=/export\s*\{([^}]*)\}\s*from\s*'"'"'\.\/icons\/([a-z0-9.\/-]+)\.mjs'"'"'/g;
let m;while((m=reExp.exec(barrel))){const f=m[2];for(const p of m[1].split(",")){const t=p.trim().replace(/^default as /,"").trim();if(t)map.set(t,f);}}
function walk(d,o=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p,o);else if(/\.(ts|tsx)$/.test(e.name))o.push(p);}return o;}
const used=new Set();
for(const f of walk("src")){const s=fs.readFileSync(f,"utf8");
 const r=/import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*["\x27]lucide-react["\x27]/gs;let x;
 while((x=r.exec(s))){for(const p of x[1].split(",")){const t=p.trim().replace(/^type\s+/,"").split(/\s+as\s+/)[0].trim();if(t)used.add(t);}}}
const names=new Set();const bad=[];
for(const id of used){const f=map.get(id);if(!f){bad.push(id);continue;}
 const src=fs.readFileSync("node_modules/lucide-react/dist/esm/icons/"+f+".mjs","utf8");
 const n=/name:\s*"([^"]+)"/.exec(src);if(n)names.add(n[1]);}
const cov=new Set([...fs.readFileSync("/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/original-assets/icons/dist/jirai-icons.css","utf8").matchAll(/svg\.lucide-([a-z0-9-]+)\{--px/g)].map(z=>z[1]));
console.log("用在源码的 name:",names.size,"覆盖:",cov.size);
console.log("缺失:",[...names].filter(n=>!cov.has(n)));
console.log("未使用的覆盖:",[...cov].filter(n=>!names.has(n)));
console.log("无法解析标识符:",bad);
'
```
期望输出：`缺失: ["grid-3x3"]`（测试专用）、`未使用的覆盖: []`、`无法解析标识符: ["LucideIcon"]`。

### 7.2 渲染态穷举（真机，需应用运行 —— 本次未做）

在应用里执行，能一次性列出**所有**"非 mask 的非文本图形"，这是唯一能发现新遗漏载体的方法：

```js
// DevTools console：列出所有非 lucide-mask 的图形元素
[...document.querySelectorAll('svg, img, canvas, [style*="mask"], select, input[type=time]')]
  .map(el => ({ tag: el.tagName, cls: el.getAttribute('class'),
                vb: el.getAttribute('viewBox'),
                slot: el.dataset.slot,
                masked: getComputedStyle(el).maskImage !== 'none' }))
  .filter(x => !(x.tag === 'svg' && x.cls?.includes('lucide') && x.masked))
```
再叠一层：`getComputedStyle(el, '::after').content` 扫一遍伪元素字符图形。

### 7.3 建议纳入验收的检查项

| # | 检查 | 方法 |
|---|---|---|
| R1 | 生产未覆盖 lucide = 0 | §7.1（当前通过，`grid-3x3` 标注"仅测试"） |
| R2 | 窗口三按钮 + Sun/Moon 在 16px 整数栅格下无半像素 | 真机截图放大比对 |
| R3 | `accessible-status-indicators` 开/关两态下状态点都不破图 | 手动开开关后截图 |
| R4 | 原生 `<select>` / `input[type=time]` 的 UA 图形是否可接受（当前为原生外观，属风格混入而非破图） | 真机目视 |
| R5 | 若替换 mask/伪元素，license 段落补齐（三 mask 当前无来源声明） | 对照 `assets-redistributable/licenses/` |
