/* NOT WINDOWS · R9 user-dialog avatar and banner-pattern verification fixture. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const outputDir = path.resolve(process.env.JIRAI_OUT || '/tmp/jirai-r9-out-dialog/jirai-kei-theme');
const cssPath = path.join(outputDir, 'theme.css');
let css = await fs.readFile(cssPath, 'utf8');
/* This check isolates R9's three treatment tiers; R96 has a separate verification and its
   later decorated-card override intentionally changes those token values. */
css = css.replace(/\/\* SECTION banner-frame-r96 \*\/[\s\S]*?(?=\/\* SECTION [^*]+\*\/|$)/, '');
const r9Source = await fs.readFile(path.join(runtime, 'user-dialog-r9.css'), 'utf8');
const fixture = await fs.readFile(path.join(here, 'fixture.html'), 'utf8');
const reportPath = path.join(here, 'r9-report.json');
const compiledSourceMatches = css.includes(r9Source.trim());
const sourceSection = `/* SECTION user-dialog-r9 */\n${r9Source.trim()}\n`;
const hemStrokeRulePattern = /\/\* Trace the lace interior[\s\S]*?image-rendering: pixelated;\s*\}/;
assert(hemStrokeRulePattern.test(r9Source), 'Runtime source is missing the bounded inset-hem rule');
if (!compiledSourceMatches) {
  /* Test only: use the existing package CSS as baseline and overlay the edited
     isolated R9 section in memory. Never write/rebuild the package artifact. */
  assert(/\/\* SECTION user-dialog-r9 \*\/[\s\S]*?(?=\/\* SECTION [^*]+\*\/|$)/.test(css),
    'Existing package CSS lacks a replaceable user-dialog-r9 section');
  css = css.replace(/\/\* SECTION user-dialog-r9 \*\/[\s\S]*?(?=\/\* SECTION [^*]+\*\/|$)/, sourceSection);
}
process.env.TMPDIR = path.join(here, 'browser-tmp');
await fs.mkdir(process.env.TMPDIR, { recursive: true });

function assert(condition, message, details = undefined) {
  if (!condition) throw new Error(`${message}${details === undefined ? '' : `: ${JSON.stringify(details)}`}`);
}
const sectionPattern = /\/\* SECTION user-dialog-r9 \*\/[\s\S]*?(?=\/\* SECTION [^*]+\*\/|$)/;
assert(css.includes('/* SECTION user-dialog-r9 */'), 'Built CSS is missing user-dialog-r9; build the isolated JIRAI_OUT first');
assert(css.includes(r9Source.trim()), 'Built R9 CSS does not match runtime/user-dialog-r9.css');
assert(sectionPattern.test(css), 'Could not isolate the R9 dialog section for the before-state');
const baselineCss = css.replace(sectionPattern, '');
assert(baselineCss !== css, 'R9 baseline stripping was a no-op');
assert(Buffer.byteLength(r9Source) <= 10 * 1024, 'R9 stylesheet exceeds the 10KiB budget');
assert(!/@import\s|url\((?!\s*["']?data:)/i.test(r9Source), 'R9 CSS must not import or request remote resources');
assert(!/data-profile-decoration-asset|\.avatar-frame/.test(r9Source), 'R9 must not select the ProfileAvatarFrame sibling');

const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240" shape-rendering="crispEdges"><rect width="320" height="240" fill="#8f7fe0"/><circle cx="232" cy="52" r="34" fill="#ffd36f"/><path d="M0 166 55 112 99 158 146 118 208 174 256 130 320 172V240H0Z" fill="#6fe3d3"/><path d="M0 190 52 158 94 184 148 147 202 188 248 160 320 198V240H0Z" fill="#ffb8e6"/><path d="M0 215 62 195 119 218 185 187 241 213 320 190V240H0Z" fill="#d6b8ef"/><rect x="0" y="232" width="320" height="8" fill="#36476f"/></svg>`;
const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" shape-rendering="crispEdges"><rect width="64" height="64" fill="#b9add9"/><path d="M9 24V16H17V10H47V16H55V24H59V47H53V55H11V48H5V27H9Z" fill="#6c5ce0"/><rect x="18" y="25" width="5" height="5" fill="#16112a"/><rect x="41" y="25" width="5" height="5" fill="#16112a"/><rect x="25" y="39" width="14" height="4" fill="#d97fc6"/><rect x="0" y="56" width="64" height="8" fill="#f3add9"/></svg>`;
const frameSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" shape-rendering="crispEdges"><path fill="#ffb8e6" fill-rule="evenodd" d="M20 0H68V4H76V8H80V20H84V68H80V80H76V84H68V88H20V84H12V80H8V68H4V20H8V8H12V4H20Z M20 8H68V12H76V20H80V68H76V76H68V80H20V76H12V68H8V20H12V12H20Z"/></svg>`;
const dataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const html = fixture
  .replaceAll('__BANNER_SRC__', dataUri(bannerSvg))
  .replaceAll('__AVATAR_SRC__', dataUri(avatarSvg))
  .replaceAll('__FRAME_SRC__', dataUri(frameSvg));
assert(!/__BANNER_SRC__|__AVATAR_SRC__|__FRAME_SRC__/.test(html), 'Fixture data-URI substitution failed');

function toHex(r, g, b) { return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase(); }
async function imagePixels(buffer) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { width: info.width, height: info.height, channels: info.channels, data };
}
function getPixel(image, x, y) {
  const i = (y * image.width + x) * image.channels;
  return [image.data[i], image.data[i + 1], image.data[i + 2]];
}
function pixelHex(pixel) { return toHex(pixel[0], pixel[1], pixel[2]); }
function patchCompare(visible, hidden) {
  assert(visible.width === 256 && visible.height === 256 && hidden.width === 256 && hidden.height === 256,
    'Corner screenshot must be a 64×64 CSS-pixel crop at deviceScaleFactor 4', { visible: [visible.width, visible.height], hidden: [hidden.width, hidden.height] });
  const patches = [
    { name: 'top-left', x: 0, y: 0 },
    { name: 'top-right', x: 240, y: 0 },
    { name: 'bottom-left', x: 0, y: 240 },
    { name: 'bottom-right', x: 240, y: 240 }
  ];
  const isDeep = ([r, g, b]) => Math.max(r, g, b) < 80;
  const samples = [];
  let comparedPixels = 0;
  let mismatchPixels = 0;
  let deepPixels = 0;
  for (const patch of patches) {
    const patchSamples = [];
    for (let y = patch.y; y < patch.y + 16; y += 1) {
      for (let x = patch.x; x < patch.x + 16; x += 1) {
        const actual = getPixel(visible, x, y);
        const expected = getPixel(hidden, x, y);
        const actualHex = pixelHex(actual);
        const expectedHex = pixelHex(expected);
        comparedPixels += 1;
        if (actual.some((channel, i) => channel !== expected[i])) mismatchPixels += 1;
        if (isDeep(actual)) deepPixels += 1;
        if ((x === patch.x + 8) && (y === patch.y + 8)) patchSamples.push({ atDevicePixel: [x, y], actual: actualHex, banner: expectedHex });
      }
    }
    samples.push({ corner: patch.name, patchSizeDevicePixels: '16x16', center: patchSamples[0] });
  }
  return { deviceScaleFactor: 4, cornerCount: patches.length, patchAreaDevicePixels: 256, comparedPixels, mismatchPixels, deepPixels, samples };
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1240, height: 620 }, deviceScaleFactor: 4 });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const beforeStyle = await page.addStyleTag({ content: baselineCss });
  /* The CSS cleanup removed superseded R8 paint from the runtime source. Recreate that
     historical visual only in the before fixture so this still compares R9 against R8. */
  const r8PatternStyle = await page.addStyleTag({ content: `
    .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::before { opacity:.12; mask-size:4px 12px,4px 12px; }
    .entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"]::after { height:4px; opacity:.68; mask-size:10px 4px; }
  ` });

  const metric = () => page.evaluate(() => {
    const style = (element) => {
      const s = getComputedStyle(element);
      const r = element.getBoundingClientRect();
      return { color: s.color, backgroundColor: s.backgroundColor, borderRadius: s.borderRadius,
        borderWidth: s.borderWidth, borderColor: s.borderColor, boxShadow: s.boxShadow,
        clipPath: s.clipPath, overflow: s.overflow, position: s.position,
        width: r.width, height: r.height, x: r.x, y: r.y, zIndex: s.zIndex };
    };
    const pseudo = (element, name) => {
      const s = getComputedStyle(element, name);
      return { content: s.content, opacity: s.opacity, display: s.display, visibility: s.visibility,
        borderWidth: s.borderWidth, inset: s.inset, height: s.height,
        position: s.position, bottom: s.bottom, zIndex: s.zIndex,
        backgroundColor: s.backgroundColor, backgroundImage: s.backgroundImage,
        backgroundSize: s.backgroundSize, backgroundPosition: s.backgroundPosition,
        backgroundRepeat: s.backgroundRepeat, maskSize: s.maskSize, maskImage: s.maskImage,
        webkitMaskSize: s.webkitMaskSize };
    };
    const banner = (tier) => document.querySelector(`[data-tier="${tier}"] .banner-button`);
    const avatar = document.querySelector('#tier-b .avatar-wrap > button');
    const hemOverlay = banner('C').querySelector('span.relative.size-full');
    const profileFrame = document.querySelector('#frame-control img[data-profile-decoration-asset]');
    const status = document.querySelector('#tier-b [data-header-status]');
    return {
      avatarButton: style(avatar), avatarButtonRing: pseudo(avatar, '::after'), avatarImage: style(avatar.querySelector('img')),
      bannerA: { before: pseudo(banner('A'), '::before'), after: pseudo(banner('A'), '::after') },
      bannerB: { before: pseudo(banner('B'), '::before'), after: pseudo(banner('B'), '::after') },
      bannerC: { before: pseudo(banner('C'), '::before'), after: pseudo(banner('C'), '::after') },
      statusLamp: style(status), profileFrame: style(profileFrame),
      avatarCuts: { large: (() => { const e=document.createElement('i'); e.style.cssText='position:fixed;width:1px;height:1px;clip-path:var(--wd-avatar-cut)'; document.documentElement.append(e); const v=getComputedStyle(e).clipPath; e.remove(); return v; })(), small: (() => { const e=document.createElement('i'); e.style.cssText='position:fixed;width:1px;height:1px;clip-path:var(--wd-avatar-cut-sm)'; document.documentElement.append(e); const v=getComputedStyle(e).clipPath; e.remove(); return v; })() },
      bannerHemInsetStroke: pseudo(hemOverlay, '::after'),
      frameSource: profileFrame.getAttribute('data-profile-decoration-asset'),
      bannerRect: (() => { const r = banner('B').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; })()
    };
  });

  const before = await metric();
  assert(before.avatarCuts.large.startsWith('polygon') && before.avatarButton.clipPath === before.avatarCuts.large && before.avatarImage.clipPath === before.avatarCuts.large, 'Shared R9.5 avatar layer should already apply the 32-grid cut in the isolated banner baseline', { button: before.avatarButton, image: before.avatarImage, cut: before.avatarCuts.large });
  assert(before.avatarButton.borderWidth === '0px' && before.avatarButton.boxShadow === 'none' && before.avatarButton.backgroundColor === 'rgba(0, 0, 0, 0)', 'Shared avatar layer should expose a borderless transparent button before banner-only R9 styling', before.avatarButton);
  assert(before.bannerB.before.opacity === '0.12' && before.bannerB.after.height === '4px' && before.bannerB.after.opacity === '0.68', 'The R8 quiet pattern baseline did not reproduce', { before: before.bannerB });
  assert(before.frameSource !== null, 'Fixture is missing the ProfileAvatarFrame sibling control');
  const avatar = page.locator('#tier-b .avatar-wrap > button');
  const avatarBox = await avatar.boundingBox();
  assert(avatarBox && avatarBox.width === 64 && avatarBox.height === 64, 'Actual 64px UserDialog icon geometry mismatch', avatarBox);
  const cornerClip = { x: Math.round(avatarBox.x), y: Math.round(avatarBox.y), width: 64, height: 64 };
  const captureCorner = () => page.screenshot({ clip: cornerClip, scale: 'device' });
  const captureHem = async () => {
    const box = await page.locator('[data-tier="C"] .banner-button').boundingBox();
    assert(box, 'Tier C banner must have a box for the hem crop');
    return page.screenshot({ clip: { x: Math.round(box.x + 70), y: Math.round(box.y + box.height - 11),
      width: Math.round(box.width - 70), height: 11 }, scale: 'device' });
  };
  const beforeVisibleBuffer = await captureCorner();
  await avatar.evaluate((element) => { element.style.visibility = 'hidden'; });
  const beforeBannerBuffer = await captureCorner();
  await avatar.evaluate((element) => { element.style.visibility = ''; });
  const beforeVisible = await imagePixels(beforeVisibleBuffer);
  const beforeBanner = await imagePixels(beforeBannerBuffer);
  const beforeCornerComparison = patchCompare(beforeVisible, beforeBanner);

  await beforeStyle.evaluate((element) => element.remove());
  await r8PatternStyle.evaluate((element) => element.remove());
  const hemBeforeCss = css.replace(hemStrokeRulePattern, '');
  assert(hemBeforeCss !== css, 'Could not isolate the stroke-free R9 hem before-state');
  const hemBeforeStyle = await page.addStyleTag({ content: hemBeforeCss });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const beforeHemBuffer = await captureHem();
  await hemBeforeStyle.evaluate((element) => element.remove());
  await page.addStyleTag({ content: css });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const after = await metric();
  assert(after.avatarCuts.large.startsWith('polygon') && after.avatarButton.clipPath === after.avatarCuts.large && after.avatarImage.clipPath === after.avatarCuts.large, '64px UserDialog icon and image must use the audited --wd-avatar-cut', { button: after.avatarButton, image: after.avatarImage, cut: after.avatarCuts.large });
  assert(after.avatarButton.backgroundColor === 'rgba(0, 0, 0, 0)' && after.avatarButton.boxShadow === 'none' && after.avatarButton.borderRadius === '0px', 'R9 avatar backing must be transparent, shadowless, and square', after.avatarButton);
  assert(after.avatarButton.borderWidth === '0px' && after.avatarImage.borderWidth === '0px', 'Avatar-owned button/image borders must be removed', { button: after.avatarButton, image: after.avatarImage });
  const ring = after.avatarButtonRing;
  const ringInvisible = ring.content === 'none' || ring.display === 'none' || ring.visibility === 'hidden' || ring.opacity === '0' || (ring.backgroundColor === 'rgba(0, 0, 0, 0)' && ring.backgroundImage === 'none' && ring.maskImage === 'none');
  assert(ring.borderWidth === '0px' && ringInvisible, 'Theme-owned avatar ::after ring remains visible or bordered', ring);
  assert(JSON.stringify(before.profileFrame) === JSON.stringify(after.profileFrame), 'R9 must leave the ProfileAvatarFrame sibling unchanged', { before: before.profileFrame, after: after.profileFrame });
  assert(JSON.stringify(before.statusLamp) === JSON.stringify(after.statusLamp) && after.statusLamp.borderRadius === '0px' && after.statusLamp.backgroundColor === 'rgb(244, 224, 94)', 'R9 must preserve the existing square status lamp and its color', { before: before.statusLamp, after: after.statusLamp });

  const tierExpected = {
    A: { stitch: '0.18', hemHeight: '4px', hemOpacity: '0.72' },
    B: { stitch: '0.28', hemHeight: '5px', hemOpacity: '0.82' },
    C: { stitch: '0.38', hemHeight: '6px', hemOpacity: '0.9' }
  };
  const tierMetrics = {};
  for (const [tier, expected] of Object.entries(tierExpected)) {
    const actual = after[`banner${tier}`];
    assert(actual.before.opacity === expected.stitch, `Tier ${tier} stitch opacity mismatch`, actual.before);
    assert(actual.before.maskSize === '8px 12px, 8px 12px', `Tier ${tier} stitch mask size mismatch`, actual.before);
    assert(actual.after.height === expected.hemHeight && actual.after.opacity === expected.hemOpacity, `Tier ${tier} scallop strength mismatch`, actual.after);
    assert(actual.after.maskSize === `10px ${expected.hemHeight}`, `Tier ${tier} scallop mask size mismatch`, actual.after);
    tierMetrics[tier] = { stitchOpacity: actual.before.opacity, stitchMask: actual.before.maskSize,
      scallopHeight: actual.after.height, scallopOpacity: actual.after.opacity, scallopMask: actual.after.maskSize };
  }
  const hemStroke = after.bannerHemInsetStroke;
  assert(hemStroke.content === '""' && hemStroke.position === 'absolute' && hemStroke.bottom === '1px',
    'Flesh-pink lace trace must sit one pixel inward, not outside as a halo', hemStroke);
  assert(hemStroke.height === '6px' && hemStroke.backgroundSize === '10px 6px' &&
    hemStroke.backgroundRepeat === 'repeat-x' && hemStroke.backgroundImage.includes('data:image/svg+xml') &&
    hemStroke.opacity === '0.96', 'Inset scallop trace geometry or inline mask art mismatch', hemStroke);
  assert(before.bannerHemInsetStroke.content === 'none', 'The synthetic before-state should not contain the inset stroke', before.bannerHemInsetStroke);
  assert(pageErrors.length === 0, 'Fixture raised page errors', pageErrors);

  const afterHemBuffer = await captureHem();
  const afterVisibleBuffer = await captureCorner();
  await avatar.evaluate((element) => { element.style.visibility = 'hidden'; });
  const afterBannerBuffer = await captureCorner();
  await avatar.evaluate((element) => { element.style.visibility = ''; });
  const afterVisible = await imagePixels(afterVisibleBuffer);
  const afterBanner = await imagePixels(afterBannerBuffer);
  const afterCornerComparison = patchCompare(afterVisible, afterBanner);
  assert(afterCornerComparison.mismatchPixels === 0, 'R9.5 cut-corner pixels must exactly match the underlying banner', afterCornerComparison);
  assert(afterCornerComparison.deepPixels === 0, 'R9 cut corners contain a deep/black pixel instead of banner art', afterCornerComparison);

  const comparison = await page.screenshot({ clip: { x: 0, y: 0, width: 1140, height: 430 }, scale: 'css' });
  await fs.writeFile(path.join(here, 'r9-banner-pattern-tiers.png'), await sharp(comparison).png().toBuffer());
  const imagePair = await sharp({ create: { width: 520, height: 280, channels: 4, background: '#100b1e' } })
    .composite([
      { input: await sharp(beforeVisibleBuffer).resize(256, 256, { kernel: sharp.kernel.nearest }).png().toBuffer(), left: 4, top: 20 },
      { input: await sharp(afterVisibleBuffer).resize(256, 256, { kernel: sharp.kernel.nearest }).png().toBuffer(), left: 260, top: 20 }
    ]).png().toBuffer();
  const captionSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="520" height="20"><text x="10" y="14" font-family="monospace" font-size="11" fill="#ffe5f2">R8 BASELINE · DARK CORNERS</text><text x="270" y="14" font-family="monospace" font-size="11" fill="#ffe5f2">R9 · TRANSPARENT CORNERS</text></svg>');
  await fs.writeFile(path.join(here, 'r9-avatar-before-after-4x.png'), await sharp(imagePair).composite([{ input: captionSvg, left: 0, top: 0 }]).png().toBuffer());
  await fs.writeFile(path.join(here, 'r9-avatar-corners-4x.png'), await sharp(afterVisibleBuffer).png().toBuffer());

  const beforeHem = await imagePixels(beforeHemBuffer);
  const afterHem = await imagePixels(afterHemBuffer);
  assert(beforeHem.width === afterHem.width && beforeHem.height === afterHem.height,
    'Hem close-ups must share identical crop geometry');
  let hemChangedPixels = 0;
  let changedFleshPinkPixels = 0;
  for (let y = 0; y < beforeHem.height; y += 1) {
    for (let x = 0; x < beforeHem.width; x += 1) {
      const oldPixel = getPixel(beforeHem, x, y);
      const newPixel = getPixel(afterHem, x, y);
      const changed = oldPixel.some((value, channel) => value !== newPixel[channel]);
      if (changed) hemChangedPixels += 1;
      if (changed && newPixel[0] > 220 && newPixel[1] > 130 && newPixel[2] > 180) changedFleshPinkPixels += 1;
    }
  }
  assert(hemChangedPixels > 0 && changedFleshPinkPixels > 10,
    'Close-up must show newly added flesh-pink pixels on the inner hem', { hemChangedPixels, changedFleshPinkPixels });
  const hemZoomWidth = beforeHem.width * 2;
  const hemZoomHeight = beforeHem.height * 2;
  const beforeHemZoom = await sharp(beforeHemBuffer).resize({ width: hemZoomWidth, height: hemZoomHeight, kernel: sharp.kernel.nearest }).png().toBuffer();
  const afterHemZoom = await sharp(afterHemBuffer).resize({ width: hemZoomWidth, height: hemZoomHeight, kernel: sharp.kernel.nearest }).png().toBuffer();
  const hemCaption = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${hemZoomWidth}" height="24"><text x="8" y="17" font-family="monospace" font-size="13" fill="#ffe5f2">BEFORE · R9 hem, no inset line</text><text x="${Math.floor(hemZoomWidth / 2)}" y="17" font-family="monospace" font-size="13" fill="#ffe5f2">AFTER · flesh-pink trace inset 1px</text></svg>`);
  const hemComparison = await sharp({ create: { width: hemZoomWidth, height: 24 + hemZoomHeight * 2 + 8, channels: 4, background: '#100b1e' } })
    .composite([
      { input: hemCaption, left: 0, top: 0 },
      { input: beforeHemZoom, left: 0, top: 24 },
      { input: afterHemZoom, left: 0, top: 32 + hemZoomHeight }
    ]).png().toBuffer();
  const hemComparisonPath = 'r9-banner-hem-inset-before-after-8x.png';
  await fs.writeFile(path.join(here, hemComparisonPath), hemComparison);

  const report = {
    fixture: 'NOT WINDOWS · fictional profile, synthetic 320x240 banner and local data URIs',
    builtCss: cssPath,
    compiledSourceMatches,
    verificationMode: compiledSourceMatches ? 'existing compiled theme' : 'in-memory overlay of runtime R9 section onto existing compiled CSS; package artifact unchanged',
    baseline: 'compiled theme with only SECTION user-dialog-r9 removed; includes task-37 shared avatar cut/border-removal layer',
    avatarFix: { buttonClipPath: after.avatarButton.clipPath, imageClipPath: after.avatarImage.clipPath, expectedCut: after.avatarCuts.large,
      buttonBackground: after.avatarButton.backgroundColor, shadow: after.avatarButton.boxShadow, borderRadius: after.avatarButton.borderRadius,
      buttonBorderWidth: after.avatarButton.borderWidth, imageBorderWidth: after.avatarImage.borderWidth, themePseudoRingAbsent: true, profileAvatarFrameUnchanged: true },
    cornerPixelAssertion: { baseline: beforeCornerComparison, after: afterCornerComparison,
      result: 'PASS · after-state four-corner patches are pixel-identical to the same banner without the avatar button; baseline may already inherit the shared R9.5 avatar cut' },
    bannerPatternTiers: { A: { name: 'subtle', ...tierMetrics.A }, B: { name: 'recommended', ...tierMetrics.B }, C: { name: 'strong', ...tierMetrics.C } },
    bannerHemInsetStroke: { ...hemStroke, insetFromBoundary: '1px', color: '#F3ADD9',
      comparisonBaseline: 'same current R9 hem variables/mask with only the new inset-stroke rule removed',
      beforeAfterPixelsChanged: hemChangedPixels, changedFleshPinkPixels, comparisonImage: hemComparisonPath,
      result: 'PASS · repeatable hollow pixel scallop trace rendered inside the existing hem strip, without an outer shadow' },
    statusLampUnchanged: { radius: after.statusLamp.borderRadius, fill: after.statusLamp.backgroundColor },
    comparisonImage: 'r9-banner-pattern-tiers.png',
    avatarImages: ['r9-avatar-before-after-4x.png', 'r9-avatar-corners-4x.png'],
    closeUpComparisons: [hemComparisonPath],
    pageErrors
  };
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  console.log('PASS: R9 dialog button cut · 4× corner transparency · theme avatar ring removed · ProfileAvatarFrame and square lamp preserved · three banner-pattern tiers · inset flesh-pink scallop hem');
} finally {
  await browser.close();
}
