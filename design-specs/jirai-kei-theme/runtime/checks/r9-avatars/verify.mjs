/* Synthetic offline audit of source-confirmed user-only avatar/status DOM. No Windows CUA. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const appAssetDir = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets';
const [html, groupAvatarHtml, css, popupsR9Css, windoseRuntimeCss, assetNames] = await Promise.all([
  fs.readFile(path.join(here, 'fixture.html'), 'utf8'),
  fs.readFile(path.join(here, 'group-avatar.html'), 'utf8'),
  fs.readFile(path.join(runtime, 'avatars-status-r9.css'), 'utf8'),
  fs.readFile(path.join(runtime, 'popups-r9.css'), 'utf8'),
  fs.readFile(path.join(runtime, 'windose-runtime.css'), 'utf8'),
  fs.readdir(appAssetDir)
]);
const cutMatch = windoseRuntimeCss.match(/--wd-avatar-cut\s*:\s*([^;]+);/);
const smallCutMatch = windoseRuntimeCss.match(/--wd-avatar-cut-sm\s*:\s*([^;]+);/);
if (!cutMatch || !smallCutMatch) throw new Error('Could not read both avatar-cut tokens from windose-runtime.css');
const avatarCut = cutMatch[1].trim();
const avatarCutSm = smallCutMatch[1].trim();
const avatarBaseRuleMatch = windoseRuntimeCss.match(/^\[data-slot="avatar"\]\s*\{[^}]*\}[\s\S]*?^\[data-slot="avatar"\]::before\s*\{[^}]*\}/m);
if (!avatarBaseRuleMatch) throw new Error('Could not isolate the global Avatar base-mask rules for the group regression fixture');
const avatarBaseRules = avatarBaseRuleMatch[0];
const indexCss = assetNames.filter((name) => /^index-[\w-]+\.css$/.test(name));
const appCss = assetNames.filter((name) => /^App-[\w-]+\.css$/.test(name));
if (indexCss.length !== 1 || appCss.length !== 1) throw new Error(`Expected one index/App CSS bundle, found ${JSON.stringify({ indexCss, appCss })}`);
const appCssContents = await Promise.all([indexCss[0], appCss[0]].map((name) => fs.readFile(path.join(appAssetDir, name), 'utf8')));
if (/@import\b|url\((?!["']?data:)/i.test(css)) throw new Error('Avatar CSS must not import or load remote assets');

const browser = await chromium.launch({ headless: true });
const deviceScaleFactor = 4;
const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const normalizeClip = (value) => value.toLowerCase().replace(/\s+/g, '').replace(/0(?:\.0+)?px/g, '0');
const rgbaPixels = async (png) => {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return {
    info,
    at(x, y) {
      const px = Math.max(0, Math.min(info.width - 1, Math.floor(x)));
      const py = Math.max(0, Math.min(info.height - 1, Math.floor(y)));
      const offset = (py * info.width + px) * info.channels;
      return [...data.subarray(offset, offset + 4)];
    }
  };
};
const statusSurfaceSelector = 'button:not([data-fixture-no-lamp]):has(> span[class~="overflow-visible"][class~="items-center"][class~="justify-center"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]) > span[class~="overflow-visible"][class~="items-center"][class~="justify-center"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]';
const hovercardSurfaceSelector = '[data-slot="hover-card-content"] > div[class~="relative"][class~="isolate"][class~="w-full"] > div[class~="space-y-2.5"] > div[class~="relative"][class~="isolate"] > button[class~="size-10"] > span[class~="bg-muted"][class~="size-full"][class~="rounded-full"]';
const dialogSurfaceSelector = '[data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"]';
const activityFaceSelector = '.activity-skin span.block.shrink-0.overflow-hidden.rounded-full:is([class~="size-16"],[class~="size-7"],[class~="size-9"]):not([data-fixture-activity-fallback])';
const activityFallbackSelector = '.activity-skin [data-fixture-activity-fallback]';
const favoriteFriendFaceSelector = '.object-row > [data-slot="hover-card-trigger"] > div[class~="relative"][class~="ml-2"][class~="overflow-visible"] > span[class~="bg-muted"][class~="rounded-full"][class~="border"]';
const noLampFaceSelector = '[data-fixture-no-lamp] > span.user-status-avatar > span.user-avatar-face';
const conditionalLampFaceSelector = '.vrcx-0-side-panel span:has(> span[class~="size-3.75"]) > span.overflow-hidden';

try {
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  for (const content of appCssContents) await page.addStyleTag({ content });
  await page.addStyleTag({ content: `:root { --wd-avatar-cut: ${avatarCut}; --wd-avatar-cut-sm: ${avatarCutSm}; }` });
  await page.locator('[data-fixture-active-dot] .user-status-indicator.joinme').evaluate((node) => {
    /* The app bundle's relative hashed mask asset is unavailable on about:blank. Render the synthetic lamp as a solid square so its background shell cannot masquerade as an avatar cutout. */
    node.style.setProperty('mask', 'none', 'important');
    node.style.setProperty('-webkit-mask', 'none', 'important');
    node.style.setProperty('mask-image', 'none', 'important');
    node.style.setProperty('-webkit-mask-image', 'none', 'important');
  });
  await page.evaluate(async () => { await document.fonts.ready; });
  const snapshot = async () => page.evaluate(({ statusSurfaceSelector, hovercardSurfaceSelector, dialogSurfaceSelector, activityFaceSelector, activityFallbackSelector, favoriteFriendFaceSelector, noLampFaceSelector, conditionalLampFaceSelector }) => { 
    const colorCanvas = document.createElement('canvas');
    const colorContext = colorCanvas.getContext('2d');
    const colorPixel = (color) => {
      colorContext.clearRect(0, 0, 1, 1);
      colorContext.fillStyle = color;
      colorContext.fillRect(0, 0, 1, 1);
      return [...colorContext.getImageData(0, 0, 1, 1).data];
    };
    const style = (node) => {
      if (!node) return null;
      const c = getComputedStyle(node), r = node.getBoundingClientRect();
      return {
        x: Math.round(r.x * 100) / 100, y: Math.round(r.y * 100) / 100,
        width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100,
        borderRadius: c.borderRadius, borderWidth: c.borderWidth, clipPath: c.clipPath,
        background: c.backgroundColor, backgroundPixel: colorPixel(c.backgroundColor), borderColor: c.borderColor, boxShadow: c.boxShadow,
        outlineWidth: c.outlineWidth, outlineStyle: c.outlineStyle, outlineColor: c.outlineColor,
        fixturePixelColor: node.closest('[data-fixture-pixel-color]')?.getAttribute('data-fixture-pixel-color') ?? null,
        maskImage: c.maskImage, webkitMaskImage: c.webkitMaskImage,
        fill: c.fill, stroke: c.stroke, tabIndex: node.tabIndex
      };
    };
    const profileFaces = [
      ...document.querySelectorAll(statusSurfaceSelector),
      ...document.querySelectorAll(hovercardSurfaceSelector),
      ...document.querySelectorAll(dialogSurfaceSelector)
    ];
    const activityFaces = [...document.querySelectorAll(activityFaceSelector)];
    const activityFallbacks = [...document.querySelectorAll(activityFallbackSelector)];
    const activityContent = [...activityFaces, ...activityFallbacks].map((face) => face.querySelector(':scope > img, :scope > span[class~="rounded-full"]'));
    const favoriteFaces = [...document.querySelectorAll(favoriteFriendFaceSelector)];
    const faces = [...profileFaces, ...activityFaces, ...activityFallbacks, ...favoriteFaces];
    const statuses = [...document.querySelectorAll('.user-status-indicator, i.x-user-status')];
    const entitySelectors = {
      searchAvatar: '[data-fixture-search-mixed] [data-slot="avatar"]',
      worldThumb: '[data-fixture-world-thumb]',
      groupThumb: '[data-fixture-group-thumb]',
      graphCircles: '[data-fixture-relation-network] circle',
      graphUserAvatar: '[data-fixture-semantic-graph-avatar]',
      genericStatusIcon: '[data-fixture-generic-status]'
    };
    const entities = Object.fromEntries(Object.entries(entitySelectors).map(([name, selector]) => [name, [...document.querySelectorAll(selector)].map(style)]));
    const residualSelectors = {
      friendListAvatar: '[data-fixture-friend-list-avatar]', friendListFallback: '[data-fixture-friend-list-fallback]',
      settingsUserAvatar: '[data-fixture-settings-user-avatar]', groupMemberUser: '[data-fixture-group-member-user]', groupMemberFallback: '[data-fixture-group-member-fallback]',
      pickerUser: '[data-fixture-picker-user]', avatarOwner: '[data-fixture-avatar-owner]', avatarOwnerFallback: '[data-fixture-avatar-owner-fallback]',
      noteExport: '[data-fixture-note-export]', noteExportFallback: '[data-fixture-note-export-fallback]', multiselectUser: '[data-fixture-multiselect-user]',
      avatarSkeletonLarge: '[data-fixture-avatar-skeleton-large]', avatarSkeletonSmall: '[data-fixture-avatar-skeleton-small]',
      dashboardDot: '[data-fixture-dashboard-dot]', instanceDot: '[data-fixture-instance-dot]', unreadDot: '[data-fixture-unread-dot]', navDot: '[data-fixture-nav-dot]',
      avatarGroupFace: '[data-fixture-avatar-group-face]', avatarBadge: '[data-fixture-avatar-badge]', avatarGroupCount: '[data-fixture-avatar-group-count]'
    };
    const residual = Object.fromEntries(Object.entries(residualSelectors).map(([name, selector]) => [name, style(document.querySelector(selector))]));
    const legacyMask = document.querySelector('[data-fixture-legacy-mask]');
    const withLampFace = document.querySelector('[data-fixture-user-status-avatar="self"] .user-avatar-face');
    const noLampFace = document.querySelector(noLampFaceSelector);
    const noLampOuter = document.querySelector('[data-fixture-no-lamp] > .user-status-avatar');
    const lampConditionalTargets = [...document.querySelectorAll(conditionalLampFaceSelector)];
    return {
      avatarCut: getComputedStyle(document.documentElement).getPropertyValue('--wd-avatar-cut').trim(),
      avatarCutSm: getComputedStyle(document.documentElement).getPropertyValue('--wd-avatar-cut-sm').trim(),
      lampScenario: {
        withLamp: style(withLampFace), withoutLamp: style(noLampFace),
        withLampNodePresent: Boolean(document.querySelector('[data-fixture-active-dot]')),
        withoutLampHasDotNode: Boolean(noLampOuter?.querySelector(':scope > span[class~="size-3.75"]')),
        conditionalMaskMatchesLampFace: lampConditionalTargets.includes(withLampFace),
        conditionalMaskMatchesNoLampFace: lampConditionalTargets.includes(noLampFace),
        markerMaskImage: getComputedStyle(document.querySelector('[data-fixture-active-dot] .user-status-indicator')).maskImage
      },
      matchCounts: {
        userStatusAvatarSurfaces: document.querySelectorAll(statusSurfaceSelector).length,
        hovercardProfileSurface: document.querySelectorAll(hovercardSurfaceSelector).length,
        dialogProfileSurface: document.querySelectorAll(dialogSurfaceSelector).length,
        allUserProfileFaces: profileFaces.length,
        activityPageFaces: activityFaces.length,
        syntheticActivityFallbacks: activityFallbacks.length,
        favoriteFriendFaces: favoriteFaces.length,
        allMaskedFaces: faces.length,
        semanticUserLamps: statuses.length,
        genericAvatars: document.querySelectorAll('[data-slot="avatar"]').length,
        graphCircles: document.querySelectorAll('[data-fixture-relation-network] circle').length
      },
      faces: faces.map(style),
      activityContent: activityContent.map(style),
      dialogImage: style(document.querySelector(dialogSurfaceSelector)?.querySelector('img')),
      statuses: statuses.map((node) => ({ id: node.getAttribute('data-fixture-legacy-status') ? 'legacy-online' : node.getAttribute('data-fixture-legacy-mask') ? 'legacy-joinme' : node.className, ...style(node) })),
      activeRing: style(document.querySelector('[data-fixture-active-dot]')),
      legacyMask: style(legacyMask),
      entities,
      residual,
      keyboardSlots: ['.vrcx-0-side-panel-self button', '[data-fixture-user-detail]', '[data-fixture-dialog-avatar] [data-slot="button"]'].map((selector) => {
        const node = document.querySelector(selector);
        return { selector, exists: Boolean(node), tabIndex: node?.tabIndex ?? null };
      })
    };
  }, { statusSurfaceSelector, hovercardSurfaceSelector, dialogSurfaceSelector, activityFaceSelector, activityFallbackSelector, favoriteFriendFaceSelector, noLampFaceSelector, conditionalLampFaceSelector });

  /* Keep unrelated global decorations out of the fixture. Hashed status-mask URLs are relative to the app's production asset base and cannot resolve on about:blank, so render only the synthetic lead's active lamp as a solid square; production CSS/assets remain untouched. */
  await page.evaluate(async () => { await Promise.all([...document.images].map((image) => image.decode().catch(() => {}))); await document.fonts.ready; });
  const screenshotWithoutPresenceOverlays = async () => {
    const tag = await page.addStyleTag({ content: '[data-fixture-active-dot], .user-status-indicator, i.x-user-status, .user-dot, .hover-user-dot { visibility:hidden !important; }' });
    try { return await page.screenshot({ scale: 'device' }); }
    finally { await tag.evaluate((node) => node.remove()); }
  };
  const screenshotWithAvatarBackplanesOnly = async () => {
    const selector = [statusSurfaceSelector, noLampFaceSelector, hovercardSurfaceSelector, dialogSurfaceSelector, activityFaceSelector, activityFallbackSelector, favoriteFriendFaceSelector].join(',');
    const tag = await page.addStyleTag({ content: `${selector}, .user-status-indicator, i.x-user-status, .user-dot, .hover-user-dot { visibility:hidden !important; }` });
    try { return await page.screenshot({ scale: 'device' }); }
    finally { await tag.evaluate((node) => node.remove()); }
  }; 
  const before = await snapshot();
  const beforePng = await page.screenshot({ path: path.join(here, 'before.png'), scale: 'device' });
  const beforeCornerPng = await screenshotWithoutPresenceOverlays();
  await page.addStyleTag({ content: css });
  await page.evaluate(async () => { await Promise.all([...document.images].map((image) => image.decode().catch(() => {}))); await document.fonts.ready; });
  const after = await snapshot();
  const afterPng = await page.screenshot({ path: path.join(here, 'after.png'), scale: 'device' });
  const afterCornerPng = await screenshotWithoutPresenceOverlays();
  const afterBackplanePng = await screenshotWithAvatarBackplanesOnly();

  /* Reproduce the global [data-slot=avatar] mask before testing its narrowly
     rounded-md/rounded-lg group-icon exemption. This second page is an explicit
     4× group-square proof, not a capture of a live app or Windows screenshot. */
  const groupPage = await browser.newPage({ viewport: { width: 520, height: 320 }, deviceScaleFactor });
  const groupPageErrors = [];
  groupPage.on('pageerror', (error) => groupPageErrors.push(error.message));
  await groupPage.setContent(groupAvatarHtml, { waitUntil: 'domcontentloaded' });
  for (const content of appCssContents) await groupPage.addStyleTag({ content });
  await groupPage.addStyleTag({ content: `:root { --wd-avatar-cut: ${avatarCut}; --wd-avatar-cut-sm: ${avatarCutSm}; }` });
  await groupPage.addStyleTag({ content: avatarBaseRules });
  await groupPage.addStyleTag({ content: popupsR9Css });
  await groupPage.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  await groupPage.evaluate(async () => { await Promise.all([...document.images].map((image) => image.decode().catch(() => {}))); await document.fonts.ready; });
  const groupSnapshot = async () => groupPage.evaluate(() => [...document.querySelectorAll('[data-fixture-group-avatar="large"],[data-fixture-group-avatar="small"]')].map((root) => {
    const image = root.querySelector('[data-slot="avatar-image"]');
    const r = root.getBoundingClientRect(), rs = getComputedStyle(root), is = getComputedStyle(image);
    return { id: root.getAttribute('data-fixture-group-avatar'), x: r.x, y: r.y, width: r.width, height: r.height, rootRadius: rs.borderRadius, rootClip: rs.clipPath, imageRadius: is.borderRadius, imageClip: is.clipPath, imageLoaded: image.complete && image.naturalWidth > 0 };
  }));
  const groupBefore = await groupSnapshot();
  const groupBeforePng = await groupPage.screenshot({ path: path.join(here, 'group-avatar-before-4x.png'), scale: 'device' });
  await groupPage.addStyleTag({ content: css });
  const groupAfter = await groupSnapshot();
  const popupGroupAvatarAfter = await groupPage.locator('[data-fixture-popup-group-avatar]').evaluate((root) => {
    const image = root.querySelector('[data-slot="avatar-image"]'), rs = getComputedStyle(root), is = getComputedStyle(image);
    return { rootRadius: rs.borderRadius, rootClip: rs.clipPath, imageRadius: is.borderRadius, imageClip: is.clipPath };
  });
  const popupGroupMaskReset = popupGroupAvatarAfter.rootClip === 'none' && popupGroupAvatarAfter.imageClip === 'none' && popupGroupAvatarAfter.rootRadius !== '0px' && popupGroupAvatarAfter.rootRadius === popupGroupAvatarAfter.imageRadius;
  const groupAfterPng = await groupPage.screenshot({ path: path.join(here, 'group-avatar-4x.png'), scale: 'device' });

  const equalRects = (a, b) => a && b && ['x', 'y', 'width', 'height'].every((key) => Math.abs(a[key] - b[key]) < 0.01);
  const faceGeometryStable = before.faces.length === after.faces.length && before.faces.every((face, i) => equalRects(face, after.faces[i]));
  const expectedFaceCuts = [avatarCut, avatarCutSm, avatarCut, avatarCut, avatarCut, avatarCutSm, avatarCutSm, avatarCutSm, avatarCut];
  const faceUsesSourceMask = (face, index) => Boolean(face && expectedFaceCuts[index] && normalizeClip(face.clipPath) === normalizeClip(expectedFaceCuts[index]) && face.borderRadius === '0px');
  const activityFacesUseSourceMask = after.faces.slice(4, 7).length === 3 && after.faces.slice(4, 7).every((face, i) => faceUsesSourceMask(face, i + 4));
  const fallbackUsesSmallMask = faceUsesSourceMask(after.faces[7], 7) && after.activityContent[3]?.borderRadius === '0px';
  const favoriteFaceUsesSourceMask = faceUsesSourceMask(after.faces[8], 8);
  const clipPathMatchesSourceMask = normalizeClip(after.avatarCut) === normalizeClip(avatarCut) && normalizeClip(after.avatarCutSm) === normalizeClip(avatarCutSm) && after.faces.length === 9 && after.faces.every((face, i) => faceUsesSourceMask(face, i)) && faceUsesSourceMask(after.dialogImage, 3);
  const beforeImageMeta = await sharp(beforePng).metadata();
  const afterImageMeta = await sharp(afterPng).metadata();
  const expectedImageSize = { width: 1360 * deviceScaleFactor, height: 900 * deviceScaleFactor };
  const screenshotsAre4x = beforeImageMeta.width === expectedImageSize.width && beforeImageMeta.height === expectedImageSize.height && afterImageMeta.width === expectedImageSize.width && afterImageMeta.height === expectedImageSize.height;
  const beforePixels = await rgbaPixels(beforeCornerPng);
  const afterPixels = await rgbaPixels(afterCornerPng);
  const backplanePixels = await rgbaPixels(afterBackplanePng);
  const samePixel = (a, b) => a.length === b.length && a.every((channel, i) => channel === b[i]);
  const rgbSame = (a, b) => a.slice(0, 3).every((channel, i) => channel === b[i]);
  const pixelAtCss = (pixels, x, y) => pixels.at(x * deviceScaleFactor, y * deviceScaleFactor);
  const cornerOffsets = (face) => [[2, 2], [face.width - 3, 2], [2, face.height - 3], [face.width - 3, face.height - 3]];
  const cornerPixelAudit = before.faces.map((face, i) => {
    const afterFace = after.faces[i];
    const beforeCorners = cornerOffsets(face).map(([dx, dy]) => pixelAtCss(beforePixels, face.x + dx, face.y + dy));
    const afterCorners = cornerOffsets(afterFace).map(([dx, dy]) => pixelAtCss(afterPixels, afterFace.x + dx, afterFace.y + dy));
    const centerBefore = pixelAtCss(beforePixels, face.x + face.width / 2, face.y + face.height / 2);
    const centerAfter = pixelAtCss(afterPixels, afterFace.x + afterFace.width / 2, afterFace.y + afterFace.height / 2);
    return {
      surface: ['UserStatusAvatar:self', 'UserStatusAvatar:detail', 'UserHoverCard:profile', 'UserDialogHeaderMedia:userIcon', 'ActivityPeopleExhibit:lead-size-16', 'ActivityPeopleExhibit:companion-size-7', 'ActivityStrangersExhibit:Face-size-9', 'ActivityFace:fallback-size-7', 'FavoriteCardView:friend-row'][i],
      backdropSamplesBefore: beforeCorners,
      cornerSamplesAfter: afterCorners,
      faceBackgroundPixelBefore: face.backgroundPixel,
      centerBefore, centerAfter,
      fourCornersRevealBackdrop: beforeCorners.every((pixel, j) => pixel[3] === 255 && afterCorners[j][3] === 255 && samePixel(pixel, afterCorners[j]) && pixel.slice(0, 3).some((channel) => channel > 32) && !rgbSame(pixel, face.backgroundPixel)),
      centerRemainsAvatarImage: samePixel(centerBefore, centerAfter) && !rgbSame(centerAfter, face.backgroundPixel) && !beforeCorners.some((corner) => rgbSame(centerAfter, corner))
    };
  });
  const fixtureHexPixel = (hex) => [...hex.slice(1).match(/.{2}/g).map((part) => Number.parseInt(part, 16)), 255];
  const groupBeforePixels = await rgbaPixels(groupBeforePng);
  const groupAfterPixels = await rgbaPixels(groupAfterPng);
  const groupExpectedColors = { large: fixtureHexPixel('#516a87'), small: fixtureHexPixel('#426871') };
  const groupCornerAudit = groupAfter.map((face) => {
    const probes = [[1.5, 8], [face.width - 1.5, 8], [1.5, face.height - 8], [face.width - 1.5, face.height - 8]];
    const samples = probes.map(([dx, dy]) => ({
      before: pixelAtCss(groupBeforePixels, face.x + dx, face.y + dy),
      after: pixelAtCss(groupAfterPixels, face.x + dx, face.y + dy)
    }));
    const expected = groupExpectedColors[face.id];
    const baseline = groupBefore.find((item) => item.id === face.id);
    return {
      id: face.id, computed: face, baselineComputed: baseline, expectedArtworkPixel: expected, samples,
      beforeGlobalCircleCutsCorners: baseline?.imageClip !== 'none' && samples.every((sample) => !samePixel(sample.before, expected)),
      afterAllFourCornersAreSquareArtwork: samples.every((sample) => samePixel(sample.after, expected)),
      afterNoBlackCorners: samples.every((sample) => sample.after.slice(0, 3).every((channel) => channel > 32))
    };
  });
  const groupScreenshotMeta = await sharp(groupAfterPng).metadata();
  const groupAvatarSquareProof = popupGroupMaskReset && groupCornerAudit.length === 2 && groupCornerAudit.every((face) => face.beforeGlobalCircleCutsCorners && face.afterAllFourCornersAreSquareArtwork && face.afterNoBlackCorners && face.computed.width === face.computed.height && face.computed.rootClip === 'none' && face.computed.imageClip === 'none' && face.computed.imageLoaded && Number.parseFloat(face.computed.rootRadius) < face.computed.width / 4);
  const noLampFace = after.lampScenario.withoutLamp;
  const noLampCornerSamples = cornerOffsets(noLampFace).map(([dx, dy]) => ({
    after: pixelAtCss(afterPixels, noLampFace.x + dx, noLampFace.y + dy),
    exposedBackplane: pixelAtCss(backplanePixels, noLampFace.x + dx, noLampFace.y + dy)
  }));
  const noLampCorner = noLampCornerSamples[0].after;
  const noLampBackplane = pixelAtCss(backplanePixels, noLampFace.x + 2, noLampFace.y + 2);
  const noLampCenter = pixelAtCss(afterPixels, noLampFace.x + noLampFace.width / 2, noLampFace.y + noLampFace.height / 2);
  const noLampCenterBackplane = pixelAtCss(backplanePixels, noLampFace.x + noLampFace.width / 2, noLampFace.y + noLampFace.height / 2);
  const activeLampCore = after.statuses.find((status) => status.id.includes('active-dot-core'));
  const squareLampPainted = Boolean(activeLampCore && activeLampCore.width === 12 && activeLampCore.height === 12 && activeLampCore.borderRadius === '0px' && activeLampCore.backgroundPixel[3] === 255 && activeLampCore.maskImage === 'none' && activeLampCore.webkitMaskImage === 'none');
  const lampPresenceAudit = {
    withLampNodePresent: after.lampScenario.withLampNodePresent,
    noLampHasDotNode: after.lampScenario.withoutLampHasDotNode,
    conditionalMaskMatchesWithLamp: after.lampScenario.conditionalMaskMatchesLampFace,
    conditionalMaskMatchesWithoutLamp: after.lampScenario.conditionalMaskMatchesNoLampFace,
    withLampClipPath: normalizeClip(after.lampScenario.withLamp.clipPath),
    withoutLampClipPath: normalizeClip(noLampFace.clipPath),
    noLampCorner, exposedBackplane: noLampBackplane,
    noLampCornerSamples,
    noLampAllCornersShowBackplane: noLampCornerSamples.every((sample) => samePixel(sample.after, sample.exposedBackplane)),
    noLampCornerShowsBackplane: samePixel(noLampCorner, noLampBackplane),
    noLampCenter, noLampCenterBackplane,
    noLampCenterShowsArtwork: !samePixel(noLampCenter, noLampCenterBackplane),
    fixtureLampMaskDisabled: after.lampScenario.markerMaskImage === 'none' && activeLampCore?.webkitMaskImage === 'none',
    squareLampPainted
  };
  const borderEdgeAudit = after.faces.map((face, i) => {
    const expectedArtworkPixel = fixtureHexPixel(face.fixturePixelColor);
    const contourPoints = [[0.5, face.height / 2], [face.width - 0.5, face.height / 2], [face.width / 2, 0.5], [face.width / 2, face.height - 0.5]];
    const outsidePoints = [[-1, face.height / 2], [face.width + 1, face.height / 2], [face.width / 2, -1], [face.width / 2, face.height + 1]];
    const contourPixels = contourPoints.map(([x, y]) => pixelAtCss(afterPixels, face.x + x, face.y + y));
    const outsidePixels = outsidePoints.map(([x, y]) => ({
      after: pixelAtCss(afterPixels, face.x + x, face.y + y),
      exposedBackplane: pixelAtCss(backplanePixels, face.x + x, face.y + y)
    }));
    return {
      surface: ['UserStatusAvatar:self', 'UserStatusAvatar:detail', 'UserHoverCard:profile', 'UserDialogHeaderMedia:userIcon', 'ActivityPeopleExhibit:lead-size-16', 'ActivityPeopleExhibit:companion-size-7', 'ActivityStrangersExhibit:Face-size-9', 'ActivityFace:fallback-size-7', 'FavoriteCardView:friend-row'][i],
      computed: { borderWidth: face.borderWidth, boxShadow: face.boxShadow, outlineStyle: face.outlineStyle },
      contourPixels, expectedSquareImagePixel: expectedArtworkPixel,
      contourShowsUnborderedArt: contourPixels.every((pixel) => samePixel(pixel, expectedArtworkPixel)),
      outsideOnePixel: outsidePixels,
      outsideOnePixelRemainsBackplane: outsidePixels.every((item) => samePixel(item.after, item.exposedBackplane))
    };
  });
  const avatarBordersAbsent = borderEdgeAudit.length === 9 && borderEdgeAudit.every((item) => item.computed.borderWidth === '0px' && item.computed.boxShadow === 'none' && item.computed.outlineStyle === 'none' && item.contourShowsUnborderedArt && item.outsideOnePixelRemainsBackplane);
  const lampConditionalSelectorPresent = windoseRuntimeCss.includes('.vrcx-0-side-panel span:has(>span[class~="size-3.75"]) > span.overflow-hidden,');
  const noLampCircleIntact = faceUsesSourceMask(noLampFace, 0) && noLampCornerSamples.length === 4 && noLampCornerSamples.every((sample) => samePixel(sample.after, sample.exposedBackplane)) && !samePixel(noLampCenter, noLampCenterBackplane);
  const lampPresenceConditionPass = lampConditionalSelectorPresent && before.lampScenario.withLampNodePresent && after.lampScenario.withLampNodePresent && !before.lampScenario.withoutLampHasDotNode && !after.lampScenario.withoutLampHasDotNode && after.lampScenario.conditionalMaskMatchesLampFace && !after.lampScenario.conditionalMaskMatchesNoLampFace && lampPresenceAudit.fixtureLampMaskDisabled && lampPresenceAudit.squareLampPainted && noLampCircleIntact && equalRects(before.lampScenario.withoutLamp, after.lampScenario.withoutLamp);
  const residualUserFaceKeys = ['friendListAvatar','friendListFallback','settingsUserAvatar','groupMemberUser','groupMemberFallback','pickerUser','avatarOwner','avatarOwnerFallback','noteExport','noteExportFallback','multiselectUser'];
  const residualFaceCuts = Object.fromEntries(residualUserFaceKeys.map((key) => [key, after.residual[key]?.clipPath]));
  const residualUserFacesUseMasksWithoutRings = residualUserFaceKeys.every((key) => {
    const face = after.residual[key];
    const expected = key === 'noteExport' || key === 'noteExportFallback' ? avatarCut : avatarCutSm;
    return face && normalizeClip(face.clipPath) === normalizeClip(expected) && face.borderRadius === '0px' && face.borderWidth === '0px' && face.boxShadow === 'none' && face.outlineStyle === 'none';
  });
  const residualSkeletonsUseMasks = normalizeClip(after.residual.avatarSkeletonLarge?.clipPath) === normalizeClip(avatarCut) && normalizeClip(after.residual.avatarSkeletonSmall?.clipPath) === normalizeClip(avatarCutSm) && after.residual.avatarSkeletonLarge?.borderWidth === '0px' && after.residual.avatarSkeletonLarge?.boxShadow === 'none';
  const residualHintKeys = ['dashboardDot','instanceDot','unreadDot','navDot'];
  const residualHintsAreSquareAndPaintStable = residualHintKeys.every((key) => after.residual[key]?.borderRadius === '0px' && before.residual[key]?.background === after.residual[key]?.background);
  const avatarGroupMarkersArePixelized = after.residual.avatarBadge?.borderRadius === '0px' && after.residual.avatarGroupCount?.borderRadius === '0px' && after.residual.avatarGroupFace?.boxShadow?.includes('1px') && after.residual.avatarGroupCount?.boxShadow?.includes('1px');
  const outlineProbeSets = [
    { surface: 'ActivityPeopleExhibit:lead-size-16', index: 4, grid: '32-grid', insideNewOutsideCircle: [[0.07,0.22],[0.93,0.22],[0.07,0.78],[0.93,0.78]], outsideNewInsideOldOctagon: [[0.27,0.04],[0.73,0.04],[0.27,0.96],[0.73,0.96]] },
    { surface: 'ActivityPeopleExhibit:companion-size-7', index: 5, grid: '16-grid', insideNewOutsideCircle: [[0.075,0.19],[0.925,0.19],[0.075,0.81],[0.925,0.81]], outsideNewInsideOldOctagon: [[0.15,0.08],[0.85,0.08],[0.15,0.92],[0.85,0.92]] },
    { surface: 'ActivityStrangersExhibit:Face-size-9', index: 6, grid: '16-grid', insideNewOutsideCircle: [[0.075,0.19],[0.925,0.19],[0.075,0.81],[0.925,0.81]], outsideNewInsideOldOctagon: [[0.15,0.08],[0.85,0.08],[0.15,0.92],[0.85,0.92]] }
  ];
  const outlinePixelAudit = outlineProbeSets.map((spec) => {
    const face = after.faces[spec.index];
    const beforeFace = before.faces[spec.index];
    const expectedArtworkPixel = fixtureHexPixel(face.fixturePixelColor);
    const backdropPixel = pixelAtCss(beforePixels, beforeFace.x - 1, beforeFace.y + beforeFace.height / 2);
    const sample = (point, shouldShowArt) => {
      const [x, y] = point;
      const beforePixel = pixelAtCss(beforePixels, beforeFace.x + beforeFace.width * x, beforeFace.y + beforeFace.height * y);
      const afterPixel = pixelAtCss(afterPixels, face.x + face.width * x, face.y + face.height * y);
      return { at: point, beforePixel, afterPixel, expected: shouldShowArt ? expectedArtworkPixel : backdropPixel, matchesGeometry: samePixel(afterPixel, shouldShowArt ? expectedArtworkPixel : backdropPixel), baselineWasCircleOutside: samePixel(beforePixel, backdropPixel) };
    };
    const newArc = spec.insideNewOutsideCircle.map((point) => sample(point, true));
    const oldOctagonDifference = spec.outsideNewInsideOldOctagon.map((point) => sample(point, false));
    return { surface: spec.surface, grid: spec.grid, newStairExtendsPastCircle: newArc, newMaskCutsOldOctagonBulge: oldOctagonDifference, pass: [...newArc, ...oldOctagonDifference].every((item) => item.matchesGeometry && item.baselineWasCircleOutside) };
  });
  const staircaseOutlineMatches = outlinePixelAudit.length === 3 && outlinePixelAudit.every((item) => item.pass);
  const fourCornersTransparent = cornerPixelAudit.length === 9 && cornerPixelAudit.every((item) => item.fourCornersRevealBackdrop);
  const faceCentersRemainImage = cornerPixelAudit.length === 9 && cornerPixelAudit.every((item) => item.centerRemainsAvatarImage);
  const statusPaintStable = before.statuses.length === after.statuses.length && before.statuses.every((status, i) => equal(
    { background: status.background, borderColor: status.borderColor, maskImage: status.maskImage, webkitMaskImage: status.webkitMaskImage, width: status.width, height: status.height },
    { background: after.statuses[i].background, borderColor: after.statuses[i].borderColor, maskImage: after.statuses[i].maskImage, webkitMaskImage: after.statuses[i].webkitMaskImage, width: after.statuses[i].width, height: after.statuses[i].height }
  ));
  const entityPaintStable = equal(before.entities, after.entities);
  const squareStatusMarkers = after.statuses.every((status) => status.borderRadius === '0px');
  const squareFavoriteLamp = after.statuses.some((status) => status.id.includes('fixture-favorite-lamp') && status.borderRadius === '0px');
  const squareActiveRing = after.activeRing?.borderRadius === '0px';
  const dialogBackingTransparent = after.faces[3]?.background === 'rgba(0, 0, 0, 0)' && after.faces[3]?.boxShadow === 'none';
  const activityInnerCirclesRemoved = after.activityContent.length === 4 && after.activityContent.every((node) => node && node.borderRadius === '0px' && node.borderWidth === '0px' && node.boxShadow === 'none' && node.outlineStyle === 'none');
  const dialogWhiteSeamRemoved = avatarBordersAbsent && borderEdgeAudit[3]?.contourShowsUnborderedArt && after.faces[3]?.borderWidth === '0px';
  const masksExercised = after.statuses.some((status) => status.maskImage !== 'none') && after.legacyMask?.maskImage !== 'none';
  const focusableSurfaces = after.keyboardSlots.length === 3 && after.keyboardSlots.every((slot) => slot.exists && slot.tabIndex === 0);
  const cssCode = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const safeSelectorScope = cssCode.includes('.user-status-indicator') && cssCode.includes('i.x-user-status') &&
    !cssCode.includes('i.x-status-icon') && !/(^|,)\s*\[data-slot="avatar"\]\s*\{/m.test(cssCode) &&
    cssCode.includes('[data-slot="avatar"][class~="rounded-md"]') && cssCode.includes('[data-slot="avatar"][class~="rounded-lg"]') &&
    !/\.rounded-full\s*\{/.test(cssCode) && !/(^|,)\s*img\s*\{/m.test(cssCode);
  assert(before.matchCounts.userStatusAvatarSurfaces === 2 && before.matchCounts.hovercardProfileSurface === 1 && before.matchCounts.dialogProfileSurface === 1, `Source-shaped profile selectors failed to match expected slots: ${JSON.stringify(before.matchCounts)}`);
  assert(after.matchCounts.allUserProfileFaces === 4 && after.matchCounts.activityPageFaces === 3 && after.matchCounts.syntheticActivityFallbacks === 1 && after.matchCounts.favoriteFriendFaces === 1 && after.matchCounts.allMaskedFaces === 9 && clipPathMatchesSourceMask && activityFacesUseSourceMask && fallbackUsesSmallMask && favoriteFaceUsesSourceMask && activityInnerCirclesRemoved && faceGeometryStable, `Profile/activity/favorite face masks, inner circles, or geometry failed: ${JSON.stringify({ counts: after.matchCounts, clipPathMatchesSourceMask, activityFacesUseSourceMask, fallbackUsesSmallMask, favoriteFaceUsesSourceMask, activityInnerCirclesRemoved, avatarCut, avatarCutSm, faces: after.faces, faceGeometryStable })}`);
  assert(lampPresenceConditionPass, `Conditional status-lamp mask / missing-lamp avatar audit failed: ${JSON.stringify({ lampConditionalSelectorPresent, lampPresenceAudit, before: before.lampScenario, after: after.lampScenario, noLampCircleIntact })}`);
  assert(residualUserFacesUseMasksWithoutRings && residualSkeletonsUseMasks && residualHintsAreSquareAndPaintStable && avatarGroupMarkersArePixelized, `G5 residual avatar/skeleton/status-marker audit failed: ${JSON.stringify({ residualFaceCuts, residual: after.residual, residualUserFacesUseMasksWithoutRings, residualSkeletonsUseMasks, residualHintsAreSquareAndPaintStable, avatarGroupMarkersArePixelized })}`);
  assert(groupAvatarSquareProof && groupScreenshotMeta.width === 520 * deviceScaleFactor && groupScreenshotMeta.height === 320 * deviceScaleFactor && !groupPageErrors.length, `Group Avatar 4× square/no-black-corner proof failed: ${JSON.stringify({ groupAvatarSquareProof, popupGroupMaskReset, popupGroupAvatarAfter, groupScreenshot: { width: groupScreenshotMeta.width, height: groupScreenshotMeta.height }, groupCornerAudit, groupPageErrors })}`);
  assert(screenshotsAre4x && fourCornersTransparent && faceCentersRemainImage && staircaseOutlineMatches && avatarBordersAbsent && dialogBackingTransparent && dialogWhiteSeamRemoved, `4x outline/border pixel audit failed: ${JSON.stringify({ screenshotsAre4x, expectedImageSize, beforeImage: { width: beforeImageMeta.width, height: beforeImageMeta.height }, afterImage: { width: afterImageMeta.width, height: afterImageMeta.height }, fourCornersTransparent, faceCentersRemainImage, staircaseOutlineMatches, avatarBordersAbsent, dialogBackingTransparent, dialogWhiteSeamRemoved, cornerPixelAudit, outlinePixelAudit, borderEdgeAudit })}`);
  assert(squareStatusMarkers && squareFavoriteLamp && squareActiveRing && statusPaintStable && masksExercised, `Status lamp shape/colors/masks failed: ${JSON.stringify({ squareStatusMarkers, squareFavoriteLamp, squareActiveRing, statusPaintStable, masksExercised, before: before.statuses, after: after.statuses })}`);
  assert(entityPaintStable, `Entity/search/network exclusions changed: ${JSON.stringify({ before: before.entities, after: after.entities })}`);
  assert(focusableSurfaces, `Profile controls no longer keyboard focusable: ${JSON.stringify(after.keyboardSlots)}`);
  assert(safeSelectorScope, 'CSS contains an unsafe generic avatar/status selector');
  assert(!pageErrors.length, `Browser errors: ${pageErrors.join('; ')}`);

  const width = 1360 * 2, height = 900 * 2, labelHeight = 32 * 2;
  const beforePreview = await sharp(beforePng).resize(width, height).png().toBuffer();
  const afterPreview = await sharp(afterPng).resize(width, height).png().toBuffer();
  const labelSvg = Buffer.from(`<svg width="${width * 2}" height="${height + labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#100b1e"/><text x="24" y="44" fill="#ffd9ee" font-family="sans-serif" font-size="32">BEFORE · source-shaped profile fixtures (source images 4×)</text><text x="${width + 24}" y="44" fill="#ffd9ee" font-family="sans-serif" font-size="32">AFTER · 32/16-grid pixel circle · no avatar border (source images 4×)</text></svg>`);
  const largeFace = after.faces[4], closeupCss = 104;
  const closeupX = Math.max(0, Math.min(1360 - closeupCss, largeFace.x + largeFace.width / 2 - closeupCss / 2));
  const closeupY = Math.max(0, Math.min(900 - closeupCss, largeFace.y + largeFace.height / 2 - closeupCss / 2));
  await sharp(afterPng).extract({ left: Math.round(closeupX * deviceScaleFactor), top: Math.round(closeupY * deviceScaleFactor), width: closeupCss * deviceScaleFactor, height: closeupCss * deviceScaleFactor }).png().toFile(path.join(here, 'contour-detail.png'));
  const selfFace = after.faces[0], selfCropCss = 96;
  const selfCropX = Math.max(0, Math.min(1360 - selfCropCss, selfFace.x + selfFace.width / 2 - selfCropCss / 2));
  const selfCropY = Math.max(0, Math.min(900 - selfCropCss, selfFace.y + selfFace.height / 2 - selfCropCss / 2));
  await sharp(afterPng).extract({ left: Math.round(selfCropX * deviceScaleFactor), top: Math.round(selfCropY * deviceScaleFactor), width: selfCropCss * deviceScaleFactor, height: selfCropCss * deviceScaleFactor }).png().toFile(path.join(here, 'self-status-detail.png'));
  await sharp({ create: { width: width * 2, height: height + labelHeight, channels: 4, background: '#100b1e' } })
    .composite([{ input: labelSvg, left: 0, top: 0 }, { input: beforePreview, left: 0, top: labelHeight }, { input: afterPreview, left: width, top: labelHeight }])
    .png().toFile(path.join(here, 'comparison.png'));

  const report = {
    result: 'PASS', fixture: 'NOT WINDOWS · invented people + inline SVGs only; no saved/copied friend screenshots',
    baseline: 'VRCX app CSS + synthetic fixtures with inline SVGs. Main page isolates avatars-status-r9.css; the separate group page applies the exact global [data-slot=avatar] mask/radius rules from windose-runtime.css, popup-avatar cascade, then the conditional rounded-md/rounded-lg exemption. User-status colors/masks remain from app CSS; no full-shell decoration or live Windows screenshot.' ,
    source: {
      authority: '/tmp/vrcx-win-src-r9/src',
      UserStatusAvatar: 'components/UserStatusAvatar.tsx:8-51; uses in SidePanelSelfHeader and UserDetailTile; selector requires its direct wrapper/face DOM signature',
      hoverCard: 'components/user-hover-card/UserHoverCardContent.tsx:147-188; [data-slot=hover-card-content] profile icon signature; world banner is a separate wide button',
      userDialog: 'components/dialogs/user-dialog/components/UserDialogHeaderMedia.tsx:87-113; unique bottom-left size-16 userIcon button',
      activity: 'features/activity/components/ActivityPeopleExhibit.tsx:25-51,148-193; shared Face is size-16 lead + size-7 companion and reused by ActivityStrangersExhibit.tsx:97-100 at size-9; scoped under .activity-skin',
      favoriteFriend: 'features/favorites/components/FavoriteCardView.tsx:299-346; .object-row > [data-slot=hover-card-trigger] > div.relative.ml-2.overflow-visible > span.bg-muted.rounded-full.border, with square UserStatusDot sibling',
      friendListAvatar: 'features/friends/components/FriendListColumns.tsx:171-193; size-6 FadeInImage and muted fallback, no Avatar slot, small 16-grid mask',
      squareGroupAvatar: 'components/groups/GroupCard.tsx:47-59; NotificationRowParts.tsx:94-103; PlayerListGroupSelector.tsx:40-47; UserDialogGroupCard.tsx:84-91; GroupCalendarTimeline.tsx:151-163; GroupDialogHeaderSection.tsx:239-249; rounded-md/lg are source geometry',
      noteExportAvatar: 'components/hosts/tools-dialogs/NoteExportDialog.tsx:334,460-488; size-11 face is scoped to its bg-card/40 rounded-lg p-3 row',
      mutualFriendsGraphAvatar: 'features/charts/components/mutual-friends/MutualFriendsNodeCard.tsx:56-83; same size-11 circle but deliberately excluded from NoteExport targeting',
      avatarSkeletons: 'components/sidebar/friends-sidebar/FriendsSidebarVirtualRows.tsx:99-105; components/dialogs/user-dialog/components/UserDialogContentStates.tsx:29-56; ActivityPeopleExhibit.tsx:54-70',
      statusHints: 'DashboardFeedEntryContent.tsx:153-171; DashboardInstanceWidget.tsx:401-413; NotificationRow.tsx:144-153; NotificationDrawerRow.tsx:168-178; AppNavMenuIcons.tsx:34-52',
      presence: 'components/UserStatusDot.tsx:14-69 plus shared user status classes; i.x-user-status is targeted, i.x-status-icon is deliberately not'
    },
    selectors: {
      UserStatusAvatarFace: statusSurfaceSelector,
      HoverCardProfileFace: hovercardSurfaceSelector,
      UserDialogProfileIcon: dialogSurfaceSelector,
      ActivityPageFaces: activityFaceSelector,
      ActivityFallbackProbe: activityFallbackSelector,
      FavoriteFriendFace: favoriteFriendFaceSelector,
      ResidualUserFaces: residualUserFaceKeys,
      NoteExportAvatar: '[data-slot="dialog-content"] div.bg-card/40.rounded-lg.p-3 > size-11 face/fallback only',
      ExcludedMutualFriendsGraphAvatar: '[data-fixture-semantic-graph-avatar] remains a semantic rounded-full circle',
      GroupAvatarException: '[data-slot="avatar"][class~="rounded-md"], [data-slot="avatar"][class~="rounded-lg"] with image/fallback children',
      AvatarSkeletons: '[data-slot="skeleton"][class~="rounded-full"] at size-7/8/9/14/16 only',
      StatusHints: '[data-dashboard-feed-status-dot], tooltip-trigger size-2.5 border, unread size-2 :has(> .sr-only), sidebar size-1.5 destructive notification dot',
      StatusMarkers: '.user-status-indicator, i.x-user-status; active ring wrapper is identified by border/background/rounded/border-3 plus direct indicator child'
    },
    targetCounts: after.matchCounts,
    avatarCut,
    avatarCutSm,
    expectedFaceCuts,
    statusLampPresenceAudit: {
      responsibleBaseMask: 'avatars-status-r9.css UserStatusAvatar size-10/9 face clip-paths are full symmetric 32/16-grid pixel circles; they do not carve an asymmetric status notch.',
      conditionalSourceSelector: '.vrcx-0-side-panel span:has(>span[class~="size-3.75"]) > span.overflow-hidden (windose-runtime.css), present only when UserStatusDot rendered',
      sourceBehavior: 'UserStatusAvatar.tsx always calls UserStatusDot, but UserStatusDot.tsx returns null when statusDotClassName is empty; presenceDotClassName in domain/friends/presence.ts returns empty for online without a non-offline status and for unknown presence.',
      fixtureArtifact: 'The synthetic active join-me lamp inherited a relative hashed app mask URL unavailable on about:blank, so its bg-background shell looked like a square hole. Fixture-only override disables that unresolved mask to render an opaque square status core, and adds a no-lamp case; production CSS/assets are unchanged.',
      checks: lampPresenceAudit
    },
    crossRegressionMaskExpectations: {
      popups: {
        cutSm: 'unframed menu/submenu/popover/select/combobox [data-slot="avatar"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"]) and UserPickerRow size-9 span',
        cut: 'same avatar image/fallback under [data-slot="avatar"][data-size="lg"]',
        keepFrame: 'exclude avatars with [data-profile-decoration-asset] or [-inset-[18.75%]] frame; never clip parent row around sibling frame',
        noThemeRingOrAvatarBorder: true
      },
      userDialog: {
        cut: '.entity-dialog ... div.absolute.bottom-3.left-3.z-30.size-16 > button[data-slot="button"] and its direct img (64px icon)',
        noThemeRingOrAvatarBorder: true,
        keepFrame: 'ProfileAvatarFrame sibling is not selected or modified'
      },
      login: {
        cutSm: '[data-vrcx-0-surface="login-page"] [data-slot="avatar-image"], [data-slot="avatar-fallback"] (default/small portraits)',
        cut: '[data-vrcx-0-surface="login-page"] [data-slot="avatar"][data-size="lg"] > :is(image,fallback)',
        noThemeRingOrAvatarBorder: true
      }
    },
    deviceScaleFactor,
    screenshotDimensions: { before: { width: beforeImageMeta.width, height: beforeImageMeta.height }, after: { width: afterImageMeta.width, height: afterImageMeta.height } },
    checks: {
      profileActivityAndFavoriteFacesUseSizeSpecificRoundedPixelMasks: clipPathMatchesSourceMask,
      activityLeadCompanionAndStrangerUseCorrectGrid: activityFacesUseSourceMask,
      activityImageAndFallbackRoundedClassesRemoved: activityInnerCirclesRemoved,
      statusSlotSelectorOnlyMatchesWhenLampNodeExists: lampPresenceConditionPass,
      noLampAvatarRemainsCompletePixelCircle: noLampCircleIntact,
      favoriteFriendRowFaceCovered: favoriteFaceUsesSourceMask,
      sourceSquareArtworkAndFaceRectanglesRemainStable: faceGeometryStable,
      fourCornerPixelsRevealExistingBackplane: fourCornersTransparent,
      '32And16GridContourSamplesDistinguishCircleAndOldOctagon': staircaseOutlineMatches,
      allAvatarOwnBordersShadowsAndOutlinesRemoved: avatarBordersAbsent,
      onePixelOutsideEveryOutlineRemainsBackplane: avatarBordersAbsent,
      centerPixelsRemainAvatarImage: faceCentersRemainImage,
      dialogButtonBackingTransparentAndWhiteSeamRemoved: dialogBackingTransparent && dialogWhiteSeamRemoved,
      userStatusMarkersSquare: squareStatusMarkers,
      favoriteFriendStatusLampSquare: squareFavoriteLamp,
      activeStatusRingSquare: squareActiveRing,
      statusBackgroundBorderAndMaskPreserved: statusPaintStable,
      accessibleMasksActuallyExercised: masksExercised,
      mixedSearchWorldGroupAndGraphSurfacesUnchanged: entityPaintStable,
      friendListAndResidualUserFacesUsePixelMasksWithoutThemeRings: residualUserFacesUseMasksWithoutRings,
      avatarSizeSpecificSkeletonsUsePixelMasks: residualSkeletonsUseMasks,
      dashboardNotificationAndNavigationHintsAreSquareWithoutPaintChanges: residualHintsAreSquareAndPaintStable,
      AvatarGroupBadgesAndSeparatorsArePixelized: avatarGroupMarkersArePixelized,
      squareGroupAvatarsPass4xPixelAndNoBlackCornerProof: groupAvatarSquareProof,
      profileButtonsRemainTabFocusable: focusableSurfaces,
      selectorsAreSemanticallyNarrow: safeSelectorScope
    },
    cornerPixelAudit,
    outlinePixelAudit,
    borderEdgeAudit,
    activityInnerContentAfter: after.activityContent,
    residualUserFaceAudit: { expectedCuts: { small: avatarCutSm, large: avatarCut }, actual: residualFaceCuts, noThemeRingOrBorder: residualUserFacesUseMasksWithoutRings },
    residualSkeletonAudit: { large: after.residual.avatarSkeletonLarge, small: after.residual.avatarSkeletonSmall, pass: residualSkeletonsUseMasks },
    residualHintAudit: Object.fromEntries(residualHintKeys.map((key) => [key, { before: before.residual[key], after: after.residual[key] }])),
    avatarGroupAudit: { before: groupBefore, after: groupAfter, popupSpecificException: popupGroupAvatarAfter, popupGroupMaskReset, corners: groupCornerAudit, screenshot: { width: groupScreenshotMeta.width, height: groupScreenshotMeta.height, deviceScaleFactor }, pass: groupAvatarSquareProof },
    avatarGroupMarkerAudit: { badge: after.residual.avatarBadge, count: after.residual.avatarGroupCount, sample: after.residual.avatarGroupFace, pass: avatarGroupMarkersArePixelized },
    statusBeforeAfter: { before: before.statuses, after: after.statuses },
    excludedBeforeAfter: { before: before.entities, after: after.entities },
    files: {}
  };
  for (const file of ['before.png', 'after.png', 'comparison.png', 'contour-detail.png', 'self-status-detail.png', 'group-avatar-before-4x.png', 'group-avatar-4x.png']) report.files[file] = { bytes: (await fs.stat(path.join(here, file))).size };
  await fs.writeFile(path.join(here, 'verify-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
