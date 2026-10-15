# P3-4 rule parity 修复记录

## 1. 验收参照物

唯一参照采用 [`baseline-theme.css`](../reference/baseline-theme.css)：它来自冻结 fixture 中的 `local-theme-preview` style，42 个冻结状态抽样一致，且与 MANIFEST 记录的 SHA256 相同。`runtime/preview-package/jirai-kei-theme/theme.css` 虽是 MANIFEST 指向路径，但内容与其 SHA 不符，不能代表采集 computed-style snapshot 的 CSS。

| 文件 | 字节数 | SHA256 |
|---|---:|---|
| `refactor/reference/baseline-theme.css` | 1,043,966 | `6f7491de06f09ed8ce33c11d58af7dbc9bf27a2d65c230a5d60462508c4c7260` |
| `runtime/preview-package/jirai-kei-theme/theme.css` | 1,044,718 | `0d5e39580ecbee0b62543de593babc2a362a6a1f926f71ecb40f71d91a33d3cc` |

## 2. 回退清单

- `fields-toolbar-r10`：[`13-toolbar-overlays-and-pages.css`](../src/style/13-toolbar-overlays-and-pages.css)（字段规则现位于约 35–82 行）。将合并的统一 frame 回退为基线 standalone field 基础规则 + shared text-field skin + 有 `:not(#chart [data-vrcx-0-control="toolbar"][data-slot="input-group"])` 排除条件的 input-group skin。基线的 `#16112a` 背景和后置 `border-color:var(--jk-field-edge)` 均恢复；因此 border shorthand 的 `#6c5ce0` 会按基线覆盖为 B3 斜面颜色。还恢复 feed chips 组原有 border/background 声明。
- `fields-toolbar-r10` 新增 compact toolbar dropdown 两条按钮规则：从 `13-toolbar-overlays-and-pages.css` 删除；不迁移到别处。
- `form-controls-r9`：[`12-loader-and-forms.css`](../src/style/12-loader-and-forms.css)（约 170–190 行）删除新增的 select/combobox trigger `!important` border/background 覆盖；将合并 focus-visible 规则拆回 trigger 专用规则及 `:where(select:focus-visible)` 规则。声明按基线逐字保留：两者均为 `outline:2px solid #ff7fcf;outline-offset:1px`。
- 下列被点名缺失规则在当前源文件中已存在于正确 SECTION，故没有重复添加：`motion-r7` 的 tabs `::after`（[`07-motion-navigation.css`](../src/style/07-motion-navigation.css):175–192）、`badge-r9` Bell badge（[`10-login-and-dialogs.css`](../src/style/10-login-and-dialogs.css):316–353）、`cat-motion-r96` sidebar content cat（[`15-late-components.css`](../src/style/15-late-components.css):88–98）。验证器也分别报告前三个 SECTION PASS。

### `fields-toolbar-r10` 完整前后关键规则

**回退前（错误合并规则）：**
```css
:where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"])),
:where([data-slot="input-group"]){
  background-color:#201936;
  border:1px solid #6c5ce0;
  border-radius:0;
  box-shadow:var(--jk-field-inset);
}
```

**回退后（与基线三规则一致）：**
```css
/* Standalone fields: same dark inset field treatment; no geometry changes. */
:where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"])){
  border:1px solid #6c5ce0;background-color:#16112a;color:#f2ebff;
}

/* Shared text-field skin after base border shorthands; focus/error remain later state overrides. */
:where(:is([data-slot="input"],[data-slot="textarea"],textarea,input[type="time"])){
  border-radius:0;
  border-color:var(--jk-field-edge);
  box-shadow:var(--jk-field-inset);
}
/* Input groups share it too, except the marked #chart toolbar owned by tools-ui-r9.css. */
:where([data-slot="input-group"]:not(#chart [data-vrcx-0-control="toolbar"][data-slot="input-group"])){ 
  border-radius:0;
  border-color:var(--jk-field-edge);
  box-shadow:var(--jk-field-inset);
}
```

原基线三条注释已恢复。两个新增 dropdown bevel 规则已删除。**注意**：构建产物仍有其它未解释差异，见第 6 节；不能据此宣称 15 段全平。

### `form-controls-r9` 完整前后关键规则

**回退前**另有一条非基线覆盖：
```css
:where([data-slot="select-trigger"],[data-slot="combobox-trigger"]){
  border-color:#6c5ce0!important;
  background-color:#201936!important;
}
```
此规则现已删除。原先的一条合并 focus 规则也已拆除：
```css
:where(:is(select,[data-slot="select-trigger"],[data-slot="combobox-trigger"]):focus-visible){
  outline:2px solid #ff7fcf;outline-offset:1px;
}
```

**回退后：**
```css
:where(:is([data-slot="select-trigger"],[data-slot="combobox-trigger"]):focus-visible){
  outline:2px solid #ff7fcf;outline-offset:1px;
}
:where(select:focus-visible){outline:2px solid #ff7fcf;outline-offset:1px}
```

## 3. 类别 1 的预期差异

- `@keyframes` 从原 SECTION 移入 `refactor/src/frozen/07-keyframes.css`；验证器以全 CSS 名称集合比对，而非把每个 section 内的缺失无条件忽略。
- `@media (prefers-reduced-motion: reduce)` 可能随 keyframe 模块抽取；脚本逐份统计两边 block 数量，并把数量/名称集合审计结果列入输出。
- `[data-slot$="X"]` 的有限已知写法允许与显式列举等价 selector 对照。脚本只对列出的 suffix aliases 归一化；不匹配的其余规则仍成为差异。

此外，项目已有图片资产抽取（data URL 改为 `var(--jk-asset-...)`）也造成部分相关 SECTION 原文长度不同。它不属于上述两类允许改写，验证器没有默默忽略，当前列为未解释差异。

## 4. `nav-phone-r10` reduced-motion 判断

`@media (prefers-reduced-motion: reduce)` 没有留在 `07-keyframes.css`；源规则位于 [`16-final-navigation.css`](../src/style/16-final-navigation.css):189（同一个 nav-phone SECTION 内）。基线相应规则仅针对 expanded sidebar inner 的伪元素，设置 `animation:none!important` 与停止帧 background-position。因为这是对实际动画元素的状态覆盖，而非 keyframe 定义，且将它放到末尾会改变与后续同属性规则的级联顺序，所以保守结论为：**不随 keyframes 搬家；保留原 SECTION 位置是安全做法**。脚本统计也确认 reduced-motion block 总数一致（21）。

## 5. 验证器设计与运行结果

脚本：[`verify-rule-parity.mjs`](../tools/verify-rule-parity.mjs)。每次自动构建到 `/tmp`，按 SECTION 提取后去注释/空白归一化，显式处理有限 suffix alias，再逐段输出结果。抽取型差异有单独的跨段 keyframe name-set 与 reduced-motion 数量审计；未知差异打印 SECTION、归一化长度和两侧摘要。

最后一次执行结果（非零退出，因为仍有未解释差异）：
```text
SECTION motion: PASS
SECTION motion-r7: PASS
SECTION motion-r8: PASS
SECTION badge-r9: PASS
SECTION popups-r9: DIFF
SECTION tools-ui-r9: DIFF
SECTION avatars-status-r9: PASS
SECTION loader-r9: DIFF
SECTION brand-heart-r97: DIFF
SECTION cat-motion-r96: PASS
SECTION dialog-header-r97: DIFF
SECTION nav-phone-r10: DIFF
SECTION entity-button-roles-b054-b072: DIFF
SECTION form-controls-r9: DIFF
SECTION fields-toolbar-r10: DIFF
KNOWN EXTRACTION audit: keyframes baseline=16, build=16, name-set=equal; reduced-motion blocks baseline=21, build=21; PASS
RESULT: FAIL
```

验证器附带未解释差异清单，包含以上 9 段。部分差异对应资产 URL→变量替换（如 loader、brand-heart、nav-phone）；另外 popups/tools-ui/dialog-header/entity-button-roles/form-controls/fields-toolbar 的剩余文本差异尚未全部定位为规则级根因。没有把它们伪装成 PASS，也没有超出允许范围去任意重写。

## 6. 括号配平

临时构建产物为 1,054,061 字节。对其去除 CSS 注释后逐字符检查 `{}`、`()`、`[]`，扫描期间没有负计数、结束计数均为 0，字符串状态闭合：**括号配平 PASS**（此为定界符扫描，不替代完整 CSS 语法解析）。

## 7. 诚实声明

本轮修复了已确认的 toolbar/form-controls 差异，并复核了三个指定缺失规则本来就已在正确位置。Parity 检查仍为 FAIL；`popups-r9`、`tools-ui-r9`、`loader-r9`、`brand-heart-r97`、`dialog-header-r97`、`nav-phone-r10`、`entity-button-roles-b054-b072`、`form-controls-r9`、`fields-toolbar-r10` 的残差都保留在报告中。任务完成范围不应被误读为“全部类别 2 差异已消除”或“Computed-style 348 项已证明清零”。
