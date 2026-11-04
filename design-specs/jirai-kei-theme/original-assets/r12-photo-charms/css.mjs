// 正式 CSS 生成：06-photo-r2（三心+啾啾+更大创可贴；含可选的“解锁溢出”规则）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { toolRequire } from '../../tools/common.mjs';
import { CHARM, pngOf } from './hearts.mjs';
import { make, crop, png } from './bandage.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const sharp = toolRequire('sharp');

export const CFG = {
  banner: { N: 124, T: 29, L: 100, r: 10, PL: 38, PW: 15, stripe: true, hole: true },  // 上版 N72 T20 L62
  tile: { N: 40, T: 10, L: 30, r: 3, PL: 11, PW: 6, stripe: false, hole: false, shadow: [1, 1] },
};
// 坐标 = 相对照片左上角（负数 = 伸出照片）。EXT = 解锁后可用外溢（左/上）；伪元素盒 inset:-EXT_BOX 0 0 -EXT_BOX
export const EXT_BOX = 26;
export const POS = {
  unlock: { bx: -22, by: -22, hs: 3, hr: 30, ht: -15 },
  safe: { bx: -11, by: -11, hs: 3, hr: 30, ht: -9 },
  // 用户定稿：创可贴用“不解锁”位置，三心用“解锁”位置并右移 40%（右缘到照片边 30→18px）；容器仍解锁以容纳心的外溢
  final: { bx: -11, by: -11, hs: 3, hr: 18, ht: -15 },
  tile: { bx: -2, by: -2, hs: 1, hr: 10, ht: -2 },
};
async function b64(grid, file) { await png(grid, 1, file); return 'data:image/png;base64,' + fs.readFileSync(file).toString('base64'); }
export async function buildAssets() {
  const out = {}; fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  const bg = crop(make(CFG.banner)), tg = crop(make(CFG.tile));
  out.bandage = { uri: await b64(bg, path.join(dir, 'assets/bandage-banner.png')), w: bg[0].length, h: bg.length };
  out.bandageMini = { uri: await b64(tg, path.join(dir, 'assets/bandage-tile.png')), w: tg[0].length, h: tg.length };
  // 单心以用户在 PS 手改的 assets/heart-1-native.png 为准（13×11），横排三颗、间距 3 格
  const heart = path.join(dir, 'assets/heart-1-native.png'); const hm = await sharp(heart).metadata(); const GAP = 3;
  const cw = hm.width * 3 + GAP * 2, ch = hm.height, hb = await sharp(heart).ensureAlpha().png().toBuffer();
  await sharp({ create: { width: cw, height: ch, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([0, 1, 2].map((i) => ({ input: hb, left: i * (hm.width + GAP), top: 0 })))
    .png({ palette: true, colours: 16, dither: 0, compressionLevel: 9, effort: 10 }).toFile(path.join(dir, 'assets/charms-3.png'));
  out.charms = { uri: 'data:image/png;base64,' + fs.readFileSync(path.join(dir, 'assets/charms-3.png')).toString('base64'), w: cw, h: ch };
  return out;
}

const BANNER_CHAIN = '[data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]>span.relative.size-full>img)';
const IMG_CHAIN = '[data-slot="card-header"]>div.relative>button[class*="aspect-[4/3]"][aria-label]>span.relative.size-full>img';
export const HOST_BANNER = `.entity-dialog ${BANNER_CHAIN}`;
export const HOST_TILE = '[class~="group/tile"]:has(>[data-slot="button"]>div.bg-muted.relative:is([class~="h-[118px]"],[class~="h-[94px]"])>img)';
// 解锁用宿主（Card / rail / 两栏 Layout）；都只匹配“用户横幅 Card 及其两级祖先”，不会命中世界/模型/群组对话框
const HOST_CARD = `.entity-dialog [data-slot="card"]:has(>${IMG_CHAIN})`;
const HOST_RAIL = `.entity-dialog div.overflow-auto.p-px:has(>[data-slot="card"]>${IMG_CHAIN})`;
const HOST_LAYOUT = `.entity-dialog div.overflow-hidden:has(>div.overflow-auto.p-px>[data-slot="card"]>${IMG_CHAIN})`;

export function formalCss(a, { mode = 'unlock', prefix = '' } = {}) {
  const P = (s) => (prefix ? prefix + ' ' + s : s);
  const B = POS[mode], T = POS.tile, E = EXT_BOX;
  const bandLayer = `url("${a.bandage.uri}") ${B.bx + E}px ${B.by + E}px/${a.bandage.w}px ${a.bandage.h}px no-repeat`;
  const heartLayer = `url("${a.charms.uri}") right ${B.hr}px top ${B.ht + E}px/${a.charms.w * B.hs}px ${a.charms.h * B.hs}px no-repeat`;
  const tBand = `url("${a.bandageMini.uri}") ${T.bx}px ${T.by}px/${a.bandageMini.w}px ${a.bandageMini.h}px no-repeat`;
  const tHeart = `url("${a.charms.uri}") right ${T.hr}px top ${T.ht}px/${a.charms.w}px ${a.charms.h}px no-repeat`;
  const L = [];
  L.push(`/* 06-photo-r2：创可贴（左上）+ 三颗尖底像素心（右上偏左）。${mode !== 'safe' ? '含“解锁溢出”规则：只对用户横幅 Card/rail/两栏布局，使装饰可伸出照片约 22px' : '安全版：不改任何容器，装饰最多伸出照片约 11–12px'}。静态无动画。伪元素 pointer-events:none。 */`);
  // 伪元素盒：左/上外扩 E，右/下贴合照片，避免产生 rail 的滚动溢出
  L.push(`${P(HOST_BANNER)}::after{content:"";position:absolute;inset:-${E}px 0 0 -${E}px;z-index:24;pointer-events:none;background:${bandLayer},${heartLayer};image-rendering:pixelated}`);
  if (mode === 'unlock' || mode === 'final') {
    L.push(`/* 解锁：Card 12px + rail 再借 12px（padding/margin 抵消，盒位置与尺寸不变）；Layout 与 Card 改 overflow:clip 并放宽 12px；对话框自身 p-4(16px) 仍裁剪，外溢最多 ≈28px */`);
    L.push(`${P(HOST_CARD)}{overflow:clip;overflow-clip-margin:12px}`);
    L.push(`${P(HOST_RAIL)}{padding:12px 1px 1px 12px;margin:-11px 0 0 -11px}`);
    L.push(`@media (max-width:879.98px){${P(HOST_RAIL)}{max-height:calc(var(--entity-dialog-rail-max-height) + 11px)}}`);
    L.push(`${P(HOST_LAYOUT)}{overflow:clip;overflow-clip-margin:12px}`);
  }
  L.push(`${P(HOST_TILE)}::after{content:"";position:absolute;inset:0;z-index:10;pointer-events:none;background:${tBand},${tHeart};image-rendering:pixelated}`);
  return L.join('\n') + '\n';
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = await buildAssets();
  const u = formalCss(a, { mode: 'unlock' }), s = formalCss(a, { mode: 'safe' }), f = formalCss(a, { mode: 'final' });
  fs.writeFileSync(path.join(dir, 'formal-final.css'), f);
  fs.writeFileSync(path.join(dir, 'formal.css'), u);
  fs.writeFileSync(path.join(dir, 'formal-safe.css'), s);
  console.log(JSON.stringify({ bandage: [a.bandage.w, a.bandage.h], mini: [a.bandageMini.w, a.bandageMini.h], charms: [a.charms.w, a.charms.h], unlockBytes: Buffer.byteLength(u), safeBytes: Buffer.byteLength(s) }));
}
