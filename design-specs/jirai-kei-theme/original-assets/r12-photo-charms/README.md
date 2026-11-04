# r12 相册贴角（三颗尖底像素心 + 大创可贴）

- **位置**：横幅与容器解锁规则在 `runtime/entity-dialog/banner-frame.css` 末尾；截图相册瓦片缩小版在 `runtime/components/card.css` 末尾。
- **来源与授权**：
  - `assets/heart-1-native.png`（13×11）：提取自 `art-references/user-noa-senpai-cover-ref.jpg`（`pixel-hearts.png` 裁切），并由用户在 PS 手改心底尖端与渐变色阶。**原图版权归原作者，仅供用户自用决定**。
  - `assets/charms-3.png`（45×11）：由单颗心横排三颗（间距 3 格）合成。
  - `assets/bandage-banner.png`（85×85）与 `assets/bandage-tile.png`（29×29）：`bandage.mjs` 原创程序绘制像素创可贴。
- **定稿参数**（`css.mjs` 的 `final` 模式）：创可贴取安全版位置（`bx:-11, by:-11`），三心取解锁高度并右移 40%（`hr:18, ht:-15, 3×`），容器解锁 `overflow:clip; overflow-clip-margin:12px`。
- **重生成**：运行 `node original-assets/r12-photo-charms/css.mjs`。
