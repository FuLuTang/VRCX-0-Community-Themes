# P2B-3 样式层骨架拆分报告

源 artifact：design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css。原始字节处理，按 07-keyframes.css 的 15 个 LF 分隔成 16 块；锚定只用精确字符串 indexOf，没有括号扫描器或声明重写。

## 16 个 keyframes 锚点

| 块 | artifact 偏移 | 字节 | 命中 |
|---|---:|---:|---:|
| r5-charm-swing | 770615 | 127 | 1 |
| r5-dialog-step-in | 770743 | 62 | 1 |
| r5-spinner-step | 770806 | 62 | 1 |
| r5-progress-flow | 770869 | 67 | 1 |
| r7-tab-edge | 778504 | 274 | 1 |
| r8-lace-flow | 793746 | 112 | 1 |
| r8-nav-cursor | 793859 | 99 | 1 |
| r8-window-press | 793959 | 147 | 1 |
| r8-cat-hop | 794107 | 146 | 1 |
| r9-notification-badge-flash | 814777 | 318 | 1 |
| jk-loader-dance | 891853 | 107 | 1 |
| r97-brand-heart-pixels | 995187 | 340 | 1 |
| r96-nav-cat | 996611 | 306 | 1 |
| r96-social-cat | 996918 | 395 | 1 |
| r10-nav-phone-loop | 1027034 | 8827 | 1 |
| r10-nav-phone-float | 1035965 | 114 | 1 |

互不重叠：是；总定义字节 11503 B。

## 字节账

a) 样式层内容：323936 B（目标 323,936 B），通过。
b) 资源段 709279 B + keyframes 11,503 B + 样式层 323936 B = 1044718 B（artifact 1044718 B），通过。

SECTION 标记：56 个；所有章节均覆盖且保持原始顺序。

## 输出文件与拼接顺序

| 顺序 / 文件 | 收纳 SECTION（原顺序） | 字节 |
|---|---|---:|
| 01 01-tokens.css | tokens | 3205 |
| 02 02-foundation.css | runtime | 12280 |
| 03 03-chrome.css | window-chrome、chrome · Windose × Jirai — window chrome R3. | 9356 |
| 04 04-group-spacing-and-typography.css | group-spacing、body-typography | 4068 |
| 05 05-navigation.css | side-panel | 6559 |
| 06 06-panels-and-settings.css | feed-badges、settings、pixel-controls | 29635 |
| 07 07-motion-navigation.css | motion、navigation-r7、motion-r7 | 8242 |
| 08 08-chrome-r7.css | backgrounds-r7、chrome-r8、bio-diff-r8 | 9995 |
| 09 09-motion-and-user-surfaces.css | motion-r8、cat-r8-final、user-dialog-r8 | 7726 |
| 10 10-login-and-dialogs.css | login-r8、user-dialog-r9、badge-r9 | 15707 |
| 11 11-controls-and-pages.css | controls-r9、popups-r9、tools-ui-r9、avatars-status-r9、brand-heart-r9 | 45255 |
| 12 12-loader-and-forms.css | loader-r9、form-controls-r9、dialogs-r9 | 45030 |
| 13 13-toolbar-overlays-and-pages.css | fields-toolbar-r10、overlays-r10、favorites-r9、browse-history-r9 | 39392 |
| 14 14-buttons-and-data.css | buttons-badges-r10、data-surfaces-r10 | 38725 |
| 15 15-late-components.css | banner-frame-r96、privacy-lock-r96、brand-heart-r97、cat-motion-r96、dialog-header-r97、loader-r97、cards-r97、splitter-r97、language-badges-r98 | 23011 |
| 16 16-final-navigation.css | status-icons-r10、nav-phone-r10、portal-button-roles-b073-b100、entity-button-roles-b054-b072: explicit action roles share portal states.、auth-button-feedback: retain login-r8 / privacy-lock-r96 paint. | 25750 |

固定顺序为编号升序。文件分组为原 SECTION 连续区段，因而任何“后出现覆盖先出现”仍保持原序；没有按组件语义把后期覆盖搬到前面。motion 与 html.reduce-effects / reduced-motion 覆盖原样保留在其原 SECTION 文件中。

## 抽样逐字节校验

随机抽取由 artifact SHA-256 派生种子，保证可复现；每项 hash 针对原 SECTION 移除冻结资源/keyframes 后、写入新文件的完整字节。
- chrome · Windose × Jirai — window chrome R3.：9328 B，SHA-256 810f0319b88ce6ad8a432bea2dca06273f3367eb8d83b82fab6670f92051b93f。
- tools-ui-r9：6886 B，SHA-256 21478031ae34e9d15e8f305ce1ccbb7b57888fe4b74ba751c1bebeeb2d4251c2。
- feed-badges：5679 B，SHA-256 33c438f91bac52595f02cfe747120296c1c68a32f513814c804ea215a5c61011。
- controls-r9：13000 B，SHA-256 5e5b1e2f4ee1b3d5cfe8d1fe24f652c54c7da2346a2dbd0fbcd9721c70f1c1c5。
- dialogs-r9：7447 B，SHA-256 4a11d4cfb1de107d4e246272804debbd425c97614cc15e373d8b5280ca157674。

## 全局逐字节校验

按源位置拼回 6 个资源段与全部样式文件、剔除 16 个 keyframes 后，与 artifact 剔除 keyframes 的结果逐字节相同；SHA-256：75a9aef9d115522995137e4ecec00f223879282c705f72dd956958caa57c42a7。
样式层自身 SHA-256：c21365ee3542b3045e7160216cd2ff05d515dbe5fa75aa5104c001ef9e8a9b7d。抽取前的残余原文：323936 B vs 样式层 323936 B，完全相同。
