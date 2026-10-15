# CONV-1b：input-group 外框现状核对

## 核对范围与口径

权威级联值取自 `refactor/reference/baseline-theme.css`（已按用户提供的基线认定为权威）；规则位置下方先列基线行号，括号中列出对应当前样式层源码位置。运行时结构抽样读取 `baseline/snapshot/feed.json`、`tools.json`、`browse-history.json` 的 `elements[].attrs`。没有运行 VRCX、浏览器或重建 CSS。

当前字段 token 是 `--jk-field-edge:#69557c #fdf4ff #fdf4ff #69557c` 和 `--jk-field-inset:inset 1px 1px #16112a,inset -1px -1px #a294c8`（基线3510–3512；当前 `13-toolbar-overlays-and-pages.css`:8–10）。它是当前 1px 阴影 token；用户定义的 B3 合约为 2px border、`#2a2147` 背景、2px inset。二者不是同一组当前值。

## 各上下文实际值

| 场景 | 外框边框 | 背景 | 外框 box-shadow | 命中规则 / 位置 |
|---|---|---|---|---|
| 普通页面 toolbar 搜索 | `1px solid #6c5ce0` | `#201936` | `inset 1px 1px #16112a, inset -1px -1px #a294c8`（通用 `:where()` 的 shadow 没有更高特异度竞争声明，仍生效） | 基线3517–3523；当前 `13-toolbar-overlays-and-pages.css`:15–21。选择器摘要：`.main-content .page-toolbar [control=toolbar][slot=input-group]:not(Chart subtree *)`。通用补充在基线3575–3579 / 当前13:72–77，但其 `:where()` specificity 为零，border shorthand 的 specificity 更高，不能形成四边色与 inset。 |
| Feed 多用户搜索 | `1px solid #6c5ce0` | `#201936` | `inset 1px 1px #16112a, inset -1px -1px #a294c8` | 基线3564–3568；当前 `13-toolbar-overlays-and-pages.css`:61–65。选择器摘要：`.main-content .page-toolbar [slot=input-group]:has(> [slot=combobox-chips])`。高于通用 `:where()`，简写 `border` 重置边色并保留 1px。 |
| Tools 页 Chart 搜索 | `1px`（来自输入组组件的 border；此规则只设 border-color） | `#201936` | `inset 1px 1px #16112a, inset -1px -1px #a294c8` | 权威基线2796–2802，Chart 专属完整 selector；当前源码 `11-controls-and-pages.css`:367–371 对应注释/颜色与 motion 段，当前源码此处与权威基线的 frame 声明并不逐字一致。另有通用选择器排除 Chart：基线3575–3579 / 当前13:72–77。 |
| BrowseHistory 搜索 | `1px`（组件 border；最终 border-color 为 token 四边值） | `#201936` | `inset 1px 1px #16112a, inset -1px -1px #a294c8` | 基线4054–4062；当前 `13-toolbar-overlays-and-pages.css`:551–558。嵌套 BrowseHistory 规则第4057行先给紫边色/背景，第4058行再次设置 token border-color 和 inset；实际最终颜色为 token。源码嵌套块同段未见完整 border/background 声明，跟权威基线有差异。 |
| 非 toolbar 裸 input-group | `1px`（组件 border；`:where()` 不设置宽度/样式）+ token 四边色 | 通用规则不设置 background；由组件基类/上下文决定 | `inset 1px 1px #16112a, inset -1px -1px #a294c8` | 基线3575–3579；当前 `13-toolbar-overlays-and-pages.css`:72–77。selector 摘要：`:where([data-slot=input-group]:not(#chart [control=toolbar][slot=input-group]))`。 |

### 级联观察

普通 toolbar 的 border shorthand（`border:1px solid #6c5ce0`）在通用 token 规则之后/之前的确切顺序并不能单独决定结果，因普通 toolbar selector 的 specificity 更高；它压过 `:where()` 的边色。它自身没有 `box-shadow` 声明；由于没有更高特异度竞争声明，通用规则的 1px inset shadow 仍生效。因此“平边紫”在此指四边同色、边缘不呈四边色斜面，并非没有 inset 阴影。上表不把内层控件透明背景误算为外框背景。Feed 特例同理。Chart 则由基线专属规则显式引用变量，BrowseHistory 的专属 nested block 最终也明确重设 token 边色/阴影。

**可视化事实：相同 `data-slot="input-group"` 在普通 toolbar / Feed 中显示 1px 紫色平边（四边同色），但通用 1px inset shadow 仍生效；不带 toolbar 上下文的通用输入组、Chart 与 BrowseHistory 显示 1px token 四边色斜面与同一 inset（Chart/BrowseHistory 由专属规则或规则组合实现）。** 三者当前阴影仍是 1px inset token，并非用户给出的 2px B3 完整契约。

## 三个规则草案（仅提案文本，不实施）

以下为示意草案；selector scope、规则顺序、`!important` 与组件 border 的来源尚未决定。

### A｜toolbar 外框保持现状，B3 只作用独立字段

```css
/* 保留现有 toolbar input-group 的 border/background，不新增 input-group skin。 */
/* 独立 input / textarea 的 B3 另由独立字段规则处理。 */
```

视觉结果：普通 toolbar / Feed 保持 `1px solid #6c5ce0`、`#201936`、无 inset shadow；Chart/BrowseHistory/裸组维持现状。

### B｜外框采用完整 B3

```css
/* 仅当选择器覆盖范围及例外已确认时使用 */
[data-slot="input-group"] {
  border: 2px solid;
  border-color: #69557c #fdf4ff #fdf4ff #69557c;
  background-color: #2a2147;
  box-shadow: inset 2px 2px #16112a, inset -2px -2px #a294c8;
}
[data-slot="input-group-control"] {
  background: transparent;
  box-shadow: none;
  /* 是否显式 border:0 待确认 */
}
```

视觉结果：外壳边宽变 2px、底色变深紫；若 control 的 border reset 未实际生效，可能出现内外双框或可用宽高变动。

### C｜只用 B3 四边色，保留 1px 宽

```css
[data-slot="input-group"] {
  border-width: 1px;
  border-style: solid;
  border-color: #69557c #fdf4ff #fdf4ff #69557c;
  /* background 与 inset shadow 保持各上下文当前值 */
}
```

视觉结果：边框仍为 1px，采用 B3 四边色；是否也保留 1px inset 阴影取决于 selector 命中/覆盖关系，草案不把它强制统一。

## 风险清单（事实与待核对项）

- 普通 toolbar / Feed 现有高 specificity `border` 简写压过通用低 specificity token；追加在低特异度规则中的改动不一定改变现状。
- `input-group-control` 的 toolbar CSS 设置透明背景、`outline:none`、`box-shadow:none`，但该 CSS 声明本身没有显式 `border:0`。三个运行时样本的 class 字符串均可见 `border-0` utility；实际编译 utility 的最终级联与冲突需另行检查。双框是 utility 未应用或被覆盖时的条件风险，不是已观察到的运行时故障。
- Chart 专属 rule 位于 `tools-ui-r9`；BrowseHistory 在 `browse-history-r9` 有独立规则。selector 的改动范围若涵盖/排除任一上下文，会改变其独立 owner 是否继续有效。
- 普通 toolbar 的 addon 规则只设 `color:#d6b8ef`，addon 本体没有边、底色、阴影；不应将 addon 误当成外框的一部分。
- 普通 toolbar 的 `input-group-button` 规则（基线3532–3535；当前13:30–33）设粉底 `#ffb8e6`、深色文字和独立 1px inset。Chart 按钮规则在基线2824–2829（当前11:对应工具按钮段）；BrowseHistory 内联按钮在基线4063–4068（当前13:559–564）。外框改造不自动决定按钮 skin 是否改变。
- Feed 的 chips 特例 selector 为 `:has(> [data-slot="combobox-chips"])`，另有 chip 自身样式（基线3583–3595；当前13:80–92）；是否被 B/C 改动覆盖取决于新增 selector 的 scope 与 specificity。
- 用户输入的完整 B3 背景色 `#2a2147` 与当前 toolbar `#201936` 不同；A/B/C 的对比会同时改变视觉底色（B）或保留当前上下文底色（C）。

## 待拍板问题

1. 外框保持平边紫（A）、切换完整 2px B3（B），还是仅改四边色并保留 1px（C）？
2. 若选择 B，是否接受边宽从 1px 到 2px、背景改为 `#2a2147`？
3. Chart 与 BrowseHistory 是否仍由各自专属规则管理，还是纳入同一个覆盖范围？
4. Feed `combobox-chips` 外框是否跟随选定方案？
5. 外框采用 B3 时，是否要求控件 CSS 显式 `border:0`，而非依赖运行时 `border-0` utility？
6. addon 与粉底按钮是否维持当前独立样式？

## 抽样与未验证声明

已抽样检查 Feed、Tools、BrowseHistory 三份运行时 slot 快照中的 `input-group`、`input-group-control`、`input-group-addon` 与 `combobox-chips` 属性/类名；源码值以权威基线为准，并对照当前 11/13 样式层对应段。运行时快照未找到“纯裸 input-group”专门页面实例，裸组一行是按通用 selector 的 CSS 级联推演，不是运行时页面观测。未在浏览器实际渲染、不曾逐像素验证边框，不核实 Tailwind utility 的编译输出，不运行构建或交互测试；Chart 与 BrowseHistory 的“最终实际值”指权威基线 CSS 的级联结论。当前样式层源码与权威基线部分声明不完全一致，已在表中标明源码位置与差异风险。
