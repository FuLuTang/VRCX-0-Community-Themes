# 排除规则迁移 / context-exclusion migration

把 R9.5 之前用 `:not(<上下文> *)` 写死在通用规则上的三处「黑名单」，换成**通用规则全局生效 + 个别上下文用覆盖规则**。
目标是消除脆弱挂钩（`.w-28` / `.min-w-16` / `[class~=w-44]` 这类易变样式类），并顺手补上原本被排除掩盖掉的样式缝隙。

| 项 | 值 |
| --- | --- |
| 基线 | `runtime/*.css`（48 个文件） |
| 分析源 | `node analyze.mjs --runtime runtime --theme <baseline> --out . --tag before` |
| 带上下文排除的规则 | **135** 条（共 **313** 个「规则 × 上下文」实例） |
| 保留子句（Keep） | **5** |
| 删除子句 · 真实释放（stage 3） | **75** |
| 删除子句 · 无可见变化（stage 2 / vacuous） | **233**（已清理，见 §3 / §5.1） |
| 产物 `theme.css` | **1 016 981 B**（上限 1 048 576 B） |

---

## 1. 原理：为什么不是「把 `:not` 全删掉」

`:not(<上下文> *)` 是**黑名单**：通用规则先按最宽的样子写，再把少数几个界面抠出去。
它有两个毛病：

1. **脆弱**：黑名单的判定条件常常是样式类（`[class~=w-44]`），上游换个宽度 token 就静默失效或误伤。
2. **掩盖缝隙**：被抠出去的界面如果**没有**自己的规则，就会退回 shadcn / 浏览器默认外观 —— 而没人会发现，因为黑名单把「通用规则本该管它」这件事挡住了。

迁移改成**白名单式**的写法：通用规则谁都不排除，直接全局生效；确实需要长得不一样的上下文，用一条**特异性更高**的覆盖规则显式声明。
`analyze.mjs` 负责判断每条排除「删掉之后到底会不会有可见变化」，`decide.mjs` 负责把机器判断和人工裁定合并成动作，
`migrate2.mjs` 只执行 `action==='remove'` 的那些。

判据是**动态**的：analyze 把主题渲染进 fixture，逐元素算出删除该子句前后的计算样式差，因此
「这条排除是不是死的」不是靠读代码猜，而是量出来的。

## 2. `:where()` 的用法

通用规则去掉排除后，特异性会**升高**（原本 `:not(...)` 也在加分），从而可能压过上下文覆盖规则。
所以凡是**真的删掉了至少一个子句**的通用规则，一律包进 `:where()`：

```css
/* before */
input[type="range"]:not([data-vrcx-0-surface="login-page"] *):not(.entity-dialog *) { height:18px; margin:0 }
/* after  —— 链接里的选择器整体特异性归零，伪元素尾巴留在 :where 外面 */
:where(input[type="range"]){ height:18px; margin:0 }
```

要点：

- `:where()` 只包**选择器主体**，`::after` / `::before` 这类伪元素结尾保留在外（`wrapWhere()` 处理）。
- `:where()` 特异性为 **0**，但**未分层（unlayered）样式永远优先于任何 `@layer` 里的样式**。本应用是 Tailwind v4
  （`@layer theme,base,components,utilities,properties`），所以 `:where()` 仍然稳定压过应用的 utility —— 这是选它而不是
  `!important` 的原因。
- **只保留子句、没删东西的规则一个字节都不动**：给它套 `:where()` 反而会改变它原本的级联行为。

## 3. 覆盖规则策略

个别上下文确实要和全局长得不一样时，**不用黑名单**，而是写一条能赢的覆盖规则：

| 手段 | 说明 | 例 |
| --- | --- | --- |
| 特异性 | 覆盖规则带上下文挂钩（`.entity-dialog`、`[data-vrcx-0-surface="login-page"]`），自然高于 `:where()` 的 0 | `login-r8.css`、`user-dialog-r8.css:32` |
| 源序 | 同特异性时后加载者胜；覆盖规则排在通用规则之后 | 各 `runtime/*-r*.css` 的既有顺序 |
| 结构化挂钩 | 把易变样式类换成结构关系 | `settings-pixel.css`：`[class~=w-44]` → `.vrcx-0-page-scaffold>[data-slot=tabs][data-orientation=vertical]:has(>[data-slot=tabs-list])` |
| 结构挂钩 | 同上，按 DOM 关系定位 | `user-dialog-r8.css`：`.relative.min-w-16.flex-1.py-3 > span` → `div:has(> input[type="range"]) > span:has(~ input[type="range"])` |

**允许用到的挂钩**：`data-slot` / `data-orientation` / `data-variant` / `input[type=…]` / `role` / `aria-*` / 结构伪类（`:has`、`>`）。
**禁止**：Tailwind 的排版/尺寸工具类（`.w-28`、`.min-w-16`、`.flex-1`、`[class~=w-44]`）—— 它们会随设计调整失效。

### 保留（Keep）的 5 条，以及为什么

| 规则 × 上下文 | 原因 |
| --- | --- |
| `form-controls-r9.css:37,45,50,64` × entity-dialog | `user-dialog-r8.css:32` 只覆盖了部分属性：`accent-color` 和四个 `margin-*` 没有替代。删掉会让 range 的 margin 从 2px 变 0，**命中区整体位移 2px**（该文件注释即写明「retain the browser's input box and hit area」）。 |
| `fields-toolbar-r10.css:41` × login-page | `[data-slot=field-error]` 在登录页有自己的一套错误态呈现，通用字段规则不该盖过去。 |

这 5 条都是**「个别黑名单」**：数量少、挂钩稳定、每条都有明确理由，符合「通用规则全局生效，只对个别情况开黑名单」的原则。
`decide.mjs` 里以 `ADJUDICATIONS` 显式登记（含理由），不是在代码里偷偷留。

### 已清理的 233 条 stage-2 子句（本次）

它们被判定为 **vacuous**（在真实 DOM 里永不触发）或 **dead clause**（挂钩已失效）。典型：

- `.entity-dialog *` 系列 —— Base UI 的 `FloatingPortal` 把 popup 渲染到 `body`（或父 portal 节点），
  **永远不会**嵌在 dialog popup 内部，所以「排除对话框内部的 popup」这条规则现实中不成立（`reach.real=0`）。
  源码里 `EntityDialogScaffold.tsx` 确实 import 了 `DropdownMenu` / `Tooltip`，但编译后的 DOM 是 portal 出去的。
- `[class~=w-44]` 设置页挂钩 —— 真实树是 `PageScaffold > Tabs[vertical] > TabsList.w-44`（`SettingsPage.tsx:67-85`），
  而子句写的是 `:has(> [data-slot="tabs-list"][class~="w-44"])`（**直接子**判定）→ 永不匹配，属 dead clause。
  同理，登录页里的对话框也是 portal 到 `body` 的，不会落在 `.vrcx-0-main-shell[data-vrcx-0-surface="login-page"]` 内部。

执行方式：`node migrate2.mjs ... --drop-stage2`（**不带 flag 时行为与 R9.8 完全一致**，用于逐字节回归比对）。

原「不删的理由」是这四个分层夹具里构造了「弹窗嵌在对话框内 / `TabsList` 是 scaffold 直接子」这种真实 DOM
不会出现的合成嵌套。本次已把它们改成**真实 portal 结构**并把断言重写成**等价不变量**（见 §4 末），所以这些子句
不再需要保留。清理后 8 个受影响文件共省 **10 854 B**（78 947 → 68 093 B），其中 `buttons-badges-r10.css` 一家占 5 421 B。

## 4. 验证方法

| 层 | 工具 | 作用 |
| --- | --- | --- |
| 分类 | `analyze.mjs` | 渲染基线主题，逐「规则 × 上下文」测删除前后的计算样式差 → `class ∈ {Keep,Drop,Partial}` + `vacuous` |
| 裁决 | `decide.mjs` | 机器分类 + `ADJUDICATIONS` 人工裁定 → `{finalClass, action, stage}` |
| 执行 | `migrate2.mjs --analysis exclusions.before.json [--drop-stage2]` | 按 `action==='remove' && stage===3` 删子句并 `:where()` 包裹；`keep` 原样保留。加 `--drop-stage2` 时连 233 条 vacuous/dead 子句一起删（**默认不加**，保持 R9.8 产物可逐字节复现） |
| 交付 | `gen-exclusions.mjs` | 产出本目录的 `exclusions.json`（机器记录）与 `exclusions.md`（逐条清单） |
| 回归 | `run-verify.mjs <base\|new> [checks]` | 用 49 个分层检查分别跑**迁移前主题**与**迁移后主题** |
| 指纹 | `fpdump.mjs` / `fpdiff.mjs` / `fixture.mjs` | 在 login / entity-dialog / settings 三个上下文 × 全部控件原语上，对比迁移前后的**逐属性计算样式** |
| 等价 | `theme-diff.mjs <fixture.html> <themeA.css> <themeB.css>` | 同一夹具在两个主题下**逐元素 × 逐 longhand 属性**快照对比：顺序无关、排空有限动画、忽略 `animation-*`/`transition-*`。差异为空 = **该上下文零运行时变化**。比 `run-verify` 抗抖动，用于给「删除是否安全」出无抖动的证据 |

复现整条流水线：

```bash
node analyze.mjs --runtime <baseline runtime> --theme <baseline theme.css> --out . --tag before
node migrate2.mjs --in <baseline runtime> --out <scratch runtime> --analysis exclusions.before.json --drop-stage2
node gen-exclusions.mjs
node build-runtime.mjs            # 在 runtime/ 里，输出 <JIRAI_OUT>/theme.css
PLAYWRIGHT_BROWSERS_PATH=<browsers> node run-verify.mjs new
```

### 验证夹具的保真修正（本次同时修掉的两处脚手架缺陷）

这两个检查原先是**单文件注入**（只把 `runtime/<某个>.css` 塞进手写 fixture），由此产生两条假回归：

1. **`r9-form-controls` / `r10-fields-toolbar` 的 fixture 把「模拟应用样式」的规则写成了未分层（unlayered）**。
   真实应用是 Tailwind v4，utility 在 `@layer utilities` 里，于是**未分层的主题规则应当赢**；夹具里未分层的 `.size-4` /
   `.legacy` 反而盖住了 `:where()` 主题规则。→ 已把这些规则移入 `@layer utilities`，恢复真实级联。
2. **规则跨文件搬家后单文件注入会漏**：迁移把 native radio 规则从 `fields-toolbar-r10.css` 移到了 `form-controls-r9.css`，
   只加载前者就看不到它。→ `r10-fields-toolbar` 改为同时加载这两个 runtime 文件。

断言本身也按「等价不变量」重写：**保留的排除**（entity-dialog 的 range、settings 栏）断言「通用规则仍不得触及」，
**有意释放的面**（login-page 的 checkbox、entity-dialog 的字段）不再断言「与迁移前逐字相同」——那正是迁移要改掉的东西。

### stage-2 清理同步重写的四个夹具（本次）

`r9-popups` / `r10-overlays` / `r10-buttons-badges` / `r9-dialogs` 原先构造了「popup 嵌在 dialog 内部」的合成 DOM。
真实结构里 Base UI 的 `FloatingPortal` 一律把 popup 渲染到 `body`（登录页里的对话框同理），**永远不会**嵌在 popup
内部；设置页也**不是** `scaffold > TabsList` 的平铺结构，而是 `PageScaffold > Tabs[vertical] > TabsList.w-44`
（`SettingsPage.tsx:67-85`），所以 `:has(> [data-slot="tabs-list"][class~="w-44"])` 这个**直接子**判定永不匹配。

| 夹具 | 结构改成 | 断言 |
| --- | --- | --- |
| `r9-popups` | 实体对话框自己的 dropdown 移出 `.decoys` 容器（portal 到 body 的兄弟节点） | 对话框内普通节点 `unchanged`（负向）＋ portal 出去的 dropdown 必须被 popup 层**命中**（正向：`bg=#211a33`、`radius=0`） |
| `r10-overlays` | 对话框的 hover card 移出 `.entity-dialog` | 同上：内部普通节点 `unchanged` ＋ portal hover card 被主题化 |
| `r9-dialogs` | login shell **内**的嵌套对话框改为 body 级 portal 对话框 | 普通对话框计数 3 → **4**（它现在是普通对话框）；entity / login 卡片仍 `unchanged`；portal 对话框正向断言 |
| `r10-buttons-badges` | login surface / entity dialog 移出 `.vrcx-0-main-content`；settings 改真实三层结构 | login / entity `unchanged`（**靠作用域天然隔离**，不再靠黑名单）；settings 控件改为**正向**断言「必须拿到通用像素外观」——真实结构下那条 `has(> TabsList.w-44)` 是 dead clause，它本来一直就被通用规则命中 |

`r9-dialogs` 里还有一条**钉死旧源码文本**的静态断言（要求 CSS 里同时出现 `:not(.entity-dialog *)` 与
`:not(...login-page... *)`）。它会在迁移后必然失败，而它保护的行为是运行时的，所以改成「两个黑名单必须同进同出」
（防半迁移）＋ 由 decoy 计算样式承担行为契约。

要点：**不是为了让断言通过而放宽，而是把断言从「只有合成 DOM 才成立的形状」改成「真实 DOM 下成立且可证伪的契约」**。
每条负向断言都配了正向断言（证明对应层级确实被到达），覆盖率没有下降。

### 最终验收（233 条清理）

**A. 两轮分层回归（`run-verify.mjs`）**：49 项，base 与 new 各跑一轮，PASS/FAIL **逐项一致**（38 PASS / 11 FAIL）。

⚠️ 复现时**每轮前必须清空共享的 `TMPDIR`**（`browser-tmp`）。串行跑也会互相污染：残留的 Chromium profile 会让后一轮的两个时序敏感检查假失败——
`r8-motion`（断言 WebM 录制时长 6–8s，满负载下录到 9.04s）和 `r9-browse-history`（hover 竞态，读到 hover 前的背景色）。
本目录的 `run-verify.mjs` 让两轮共用 `TMPDIR`，所以「两轮不一致」先别急着找 CSS 原因，先清 `browser-tmp` 重跑。
另外这两个检查的稳定值随机器负载浮动，判定差异项前先单项复跑、并看清失败原因是不是时序。

**B. 零运行时差异证明（`theme-diff.mjs`）**：清理前主题与清理后主题套在同一夹具上，逐元素逐属性快照对比，
7 个夹具（四个重写的 + 两个同根因的 + `r9-browse-history`）**全部 0 差异**。这是「删掉的 233 条在真实结构下确实没在管事」的直接证据，
也排除了 `r9-browse-history` 的偶发失败与本次清理有关（该夹具上两个主题的计算样式完全相同）。

**C. 逐字节回归保护**：`migrate2.mjs` 不带 `--drop-stage2` 时输出与 R9.8 产物**逐字节相同**（8 个文件全部 `cmp` 通过），
所以这一层清理可回退、可与 R9.8 分辨，不是重写。

## 5. 已知遗留

1. ~~233 条 stage-2 子句仍留在 CSS 里~~ —— **已完成**。233 条已删（连同 stage-3 的 75 条合计 308 条），8 个文件省
   10 854 B；`r9-popups` / `r10-overlays` / `r10-buttons-badges` / `r9-dialogs` 四个夹具已改成真实 portal 结构 +
   等价不变量。两轮 49 项检查的 PASS/FAIL 集合逐项一致（见 §4 末）。
2. **11 个检查在迁移前后都失败**（预存问题，非本次回归）：
   `r4-chrome`、`r4-side-panel`、`r5-motion`、`r8-bio-diff`、`r9-controls`、`r9-loader`（缺 `/tmp/ngod-probe/320x240.gif`）、
   `r9-user-dialog`（Tier A stitch opacity）、`r97-cards`（`verify-r97b` 缺 `prev-r97a-theme.css`）、`r97-loader`、
   `status-icons-r10`（属于 motion-designer 的夹具，本次不动）。
3. **`r8-motion` 偶发失败**（时序抖动，复跑 3 次均通过），与本次迁移无关。
4. **`theme.css` 净减 12 300 B**（隔离基线 1 029 281 → 1 016 981）。**已落在 JK 的当前值**：以 JK runtime 源构建为
   **1 028 213 B**（= 1 016 981 + Lead 的手机动画增量 11 232），距 1 048 576 B 上限余量 **20 363 B**。
   `preview-package/jirai-kei-theme/theme.css` 当前仍是 1 039 067 B（R9.8 + 手机动画，**未含**本次清理），
   下次正式构建后应为 1 028 213 B。构建到临时目录：`JIRAI_OUT=<tmp> node build-runtime.mjs`（需要 `sharp`；
   缺 sharp 时 `preview.webp` 会 `MODULE_NOT_FOUND`，但 `theme.css` 在此之前已写出）。
5. `overlays-r10.css` 里 `[data-slot="toast-viewport"] button:focus-visible` 过宽：通用表单规则降到特异性 0 之后，
   它会命中 toast 里的 Base UI checkbox / select-trigger。**真实应用当前没有使用点**（`usedSites: 0`），仅记录待观察。
