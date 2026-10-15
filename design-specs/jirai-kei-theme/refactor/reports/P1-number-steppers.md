# P1 · 数字输入与步进器样式盘点

## 范围与结论

核对了主题入口 [`themes/jirai-kei-theme/theme.css`](../../../themes/jirai-kei-theme/theme.css)（392 行）、重构源码 [`06-panels-and-settings.css`](../src/style/06-panels-and-settings.css) 与生成预览包 [`theme.css`](../../runtime/preview-package/jirai-kei-theme/theme.css)。入口 CSS 当前是较早的主题适配层：其中没有 number-field / number-stepper 规则，也没有 number 类型专属规则；用户线索指向的是 R4 像素控件重构稿。后两者含有一套完整、统一的 number-field 像素步进器规则，位于 SECTION settings。

**建议以 N1（R4 Number stepper）作为唯一基准。** 它是目前找到的唯一完整主题自绘步进器：深色下陷槽、直角像素切角、浅紫凸起方形按钮、8×8 像素遮罩减号/加号、清晰焦点反馈。与之相比，普通 `input[type=number]` 及通用 `[data-slot="input"]` 的规则并未定义专属步进器图形和尺寸，不能构成另一套可复用的主题 stepper 样式。

## 规则清单（声明出处）

下列声明为源码 [`06-panels-and-settings.css`](../src/style/06-panels-and-settings.css) 第 129–138 行，编译预览包 [`theme.css`](../../runtime/preview-package/jirai-kei-theme/theme.css) 第 1267–1276 行；该包 SECTION 标头为 `settings`（L1240）。逐条如下：

| SECTION / 行号 | 选择器 | 完整声明 | 页面用途 |
|---|---|---|---|
| settings 1263–1266（注释） | — | `Number stepper ("− 60 +"): sunken pixel value slot + two bevel squares.`；`data-slot=number-field-group/-input/-decrement/-increment`；lucide −/+ 替换为 8×8 native-size pixel glyph mask。 | 全局 number-field 原语；注释明确写明外观和组件 slots。 |
| settings 1267 | `[data-slot=number-field-group]` | `border:1px solid #16112a; border-radius:0; background-color:#120d22; box-shadow:inset 1px 1px rgb(0 0 0/.55),inset -1px -1px #8f7fe0; clip-path:var(--jk-px-cut)` | 数字步进器外框。切角变量定义在 theme.css L1256。 |
| settings 1268 | `[data-slot=number-field-group]:focus-within` | `outline:2px solid #ff7fcf; outline-offset:1px` | 整组聚焦状态。 |
| settings 1269 | `[data-slot=number-field-decrement]:focus-visible,[data-slot=number-field-increment]:focus-visible` | `outline:2px solid #16112a; outline-offset:-2px` | 两个步进按钮键盘聚焦状态。 |
| settings 1270 | `[data-slot=number-field-input]` | `height:20px; line-height:20px; padding:0 6px; background-color:transparent; color:#f2ebff; font-size:12px` | 居中数字槽内容（组件原有 tabular-nums / text-center class 由 number-field 组件提供，非本规则声明）。 |
| settings 1271 | `[data-slot=number-field-decrement],[data-slot=number-field-increment]` | `width:20px; height:20px; padding:0; border:0; border-radius:0; background-color:#cdb0e8; color:#16112a; box-shadow:inset 2px 2px #fdf4ff,inset -2px -2px #7a3f6d` | 两个方形凸起按钮。 |
| settings 1272 | `[data-slot=number-field-decrement]:hover,[data-slot=number-field-increment]:hover` | `background-color:#e3cbf2` | 按钮悬停。 |
| settings 1273 | `[data-slot=number-field-decrement]:active,[data-slot=number-field-increment]:active` | `box-shadow:inset 2px 2px #7a3f6d,inset -2px -2px #fdf4ff` | 按下时反转 bevel 明暗。 |
| settings 1274 | `[data-slot=number-field-decrement] > svg,[data-slot=number-field-increment] > svg` | `display:none` | 隐藏组件提供的 Lucide 图标。 |
| settings 1275 | `[data-slot=number-field-decrement]::before,[data-slot=number-field-increment]::before` | `content:""; position:absolute; width:8px; height:8px; background-color:#16112a; pointer-events:none; mask:url(data:image/svg+xml,… minus path M2 3h4v2H2) 0 0/8px 8px no-repeat` | 两按钮共用 8×8 像素横杠遮罩；图标编码完整值见该行 CSS。 |
| settings 1276 | `[data-slot=number-field-increment]::before` | `mask-image:url(data:image/svg+xml,… plus path M2 3h4v2H2zM3 2h2v4H3z)` | 增量按钮覆写为像素加号遮罩。 |

### 对照搜索与变量核查

- 在入口 [`theme.css`](../../../themes/jirai-kei-theme/theme.css) 中逐项检索 `input[type=number]`、`number-field`、`stepper`、`spinner`、`number-input` 及用户给出的 `--jk-asset-number-stepper-minus/plus` 名称：**均无匹配**。入口 L121–138 的 `[data-slot="input"]` 等通用字段规则涵盖普通输入外观，但没有 number 专属步进器规则。
- 重构 stepper 实际直接将 data URI 写在像素控件规则中（预览包 L1275–1276；重构源 L137–138），并没有定义或引用 `--jk-asset-number-stepper-minus` / `--jk-asset-number-stepper-plus` 变量。用户提供的 freeze 报告把 L1275/1276 描述为变量引用，与 CSS 当前实际文本不符：该 CSS 行是直接 `mask:url(...)` 与 `mask-image:url(...)`。因此在 CSS 中找不到这两个变量的定义或引用；报告中的出现属于报告文本，不是 CSS 变量。
- 数据输入型控件线索：`[data-slot=number-field-input]` 是组件 slot，底层组件用 `input type="text"` + numeric inputMode（R4 fixture `runtime/checks/r4-settings-pixel/r4-settings-pixel-fixture.html:26`）；它不是浏览器原生 `input[type=number]`。普通 number 输入在 refactor native-input 预览中只作为保留原生步进交互的通用字段示意，未发现另一组主题自绘上下按钮规则（见 [`P1-G1-native-input.md`](P1-G1-native-input.md) L75）。
- 用户提到的图表、日志、滑条：本次没有找到其他 number-field/number-stepper 页面专属规则。`[data-slot="slider"]` 属于连续滑块，已由 P1-G1-slider 单独覆盖，不是加减式 number stepper；不混入本清单。

## 视觉分组与判断

1. **N1 · 全局像素 number-field（唯一完整主题 stepper）**：槽底 `#120d22`、1px 深墨边 `#16112a`、内阴影与紫色高光；方角并用 `--jk-px-cut` 做 2px 台阶切角；按钮各 20×20px，浅紫 `#cdb0e8`、深色 8×8 图标，内侧双 bevel；数字高 20px、字号 12px、色 `#f2ebff`；focus-within 粉色 2px 外框，按钮 focus-visible 深色内框；hover / active 都有独立状态。证据：预览包 1263–1276。
2. **原生 number 输入（非主题 stepper 样式）**：主题通用字段皮肤只有 `[data-slot="input"]` 等 slot 规则（入口 theme.css 121–138），未指定原生 number 控件尺寸、图标、stepper 按钮或其 hover / focus 子样式；浏览器原生 UI 由宿主提供，不具备可从 CSS 中核验的固定主题颜色尺寸，故不伪造一个对照样本。

**近似重复规则**：原重构源码与编译预览包是同一组规则的源文件/构建产物，不是两套独立视觉方案，来源分别为 `06-panels-and-settings.css:129–138` 与 preview `theme.css:1267–1276`。不要同时作为两份样本误判为重复定义；真正需要合并/统一的是项目输出中只保留一处源定义，并确保构建产物同步。当前所见主题入口尚未包含它。

## 推荐

**建议 N1 为全软件唯一自绘数字步进器基准。** 它有真实主题证据、完整焦点/交互状态和像素风图标；建议在后续落地时确认要将它纳入主题入口/所有全局使用点，而不是让原生 number 控件外观和不同组件自行漂移。图表滑条是不同交互形态，不应为了“统一”而和步进器混为同一控件。

可打开 [对照页](../preview/P1-number-steppers.html) 查看样本。
