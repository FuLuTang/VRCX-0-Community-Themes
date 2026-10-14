import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const themeRoot = path.resolve(here, '../../..');
const sourceAssets = path.join(themeRoot, 'original-assets/r10-status-toast-icons');
const require = createRequire('/tmp/dsh-theme-tools/package.json');
const sharp = require('sharp');
const mode = process.argv[2] ?? 'final';
const viewport = { width: 1440, height: 900 };
const fixtureUrl = `file://${path.join(here, 'fixture.html')}`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function near(a, b, tolerance = 0.5) {
  return Math.abs(a - b) <= tolerance;
}
async function generatePhoneAuditCss() {
  const manifest = JSON.parse(await readFile(path.join(themeRoot, 'original-assets/r10-phone-layers/manifest.json'), 'utf8'));
  const assetDir = path.join(themeRoot, 'original-assets/r10-phone-layers');
  const layers = manifest.layers;
  const charBack = layers['char-back'];
  const phoneFront = layers['phone-front'];
  const glowDim = layers['glow-dim'];
  const glowBright = layers['glow-bright'];
  const imageLayers = [
    ['char-back', charBack, '__MANIFEST_CHAR_BACK_URI__'],
    ['phone-front', phoneFront, '__MANIFEST_PHONE_FRONT_URI__'],
    ['glow-dim', glowDim, '__MANIFEST_GLOW_DIM_URI__'],
    ['glow-bright', glowBright, '__MANIFEST_GLOW_BRIGHT_URI__']
  ];
  const imageData = {};
  for (const [name, layer, token] of imageLayers) {
    const bytes = await readFile(path.join(assetDir, layer.file));
    const base64 = bytes.toString('base64');
    const meta = await sharp(bytes).metadata();
    assert(meta.format === 'png' && meta.isPalette === true && meta.width === layer.width && meta.height === layer.height, `${name}: indexed PNG dimensions disagree with manifest`);
    assert(bytes.length === layer.pngBytes && base64.length === layer.base64Bytes, `${name}: PNG byte counts disagree with manifest`);
    const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const alphaValues = [...new Set(Array.from({ length: data.length / info.channels }, (_, pixel) => data[pixel * info.channels + 3]))].sort((a, b) => a - b);
    if (name === 'char-back' || name === 'phone-front') {
      assert(JSON.stringify(alphaValues) === '[0,255]', `${name}: expected binary alpha`);
    } else {
      const layerKey = name === 'glow-dim' ? 'dim' : 'bright';
      const highlightAlpha = manifest.glow?.highlight?.alphaByLayer?.[layerKey] ?? (layerKey === 'dim' ? 128 : 255);
      const graduatedAlpha = alphaValues.filter((alpha) => alpha > 0 && alpha < highlightAlpha);
      assert(layer.encoding?.chosen === 'indexed+tRNS' && graduatedAlpha.length === layer.alphaLevels && Math.max(...graduatedAlpha) === layer.peakAlpha && alphaValues.includes(highlightAlpha), `${name}: expected manifest gradient alpha ladder plus ${highlightAlpha} eye highlights`);
      for (const [globalX, globalY] of [[9, 12], [14, 12]]) {
        const localX = globalX - layer.bboxOffset.x;
        const localY = globalY - layer.bboxOffset.y;
        const index = (localY * info.width + localX) * info.channels;
        const hex = `#${[data[index], data[index + 1], data[index + 2]].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
        assert(data[index + 3] === highlightAlpha && hex.toLowerCase() === '#f8fcff', `${name}: expected H1 right-upper iris highlight #f8fcff@${highlightAlpha} at (${globalX},${globalY})`);
      }
    }
    imageData[name] = { bytes, base64, uri: `url(\"data:image/png;base64,${base64}\")`, alphaValues };
  }
  const dimHighlightAlpha = manifest.glow?.highlight?.alphaByLayer?.dim;
  const brightHighlightAlpha = manifest.glow?.highlight?.alphaByLayer?.bright;
  assert(Number.isInteger(dimHighlightAlpha) && dimHighlightAlpha >= 80 && dimHighlightAlpha <= 160 && dimHighlightAlpha < brightHighlightAlpha, `H1 highlight guard failed: dim=${dimHighlightAlpha}, bright=${brightHighlightAlpha}`);
  const phoneTapX = phoneFront.bboxOffset.x + 1;
  const phoneMinimum = manifest.source.socialCanvasMinimum.width;
  const phoneRequiredWidth = phoneTapX + phoneFront.width;
  assert(phoneMinimum >= phoneRequiredWidth && 68 >= phoneMinimum, `The tapped phone needs ${phoneRequiredWidth} cells; the 68px fixture canvas must contain manifest minimum ${phoneMinimum}`);
  const replacements = {
    __MANIFEST_CHAR_BACK_URI__: imageData['char-back'].uri,
    __MANIFEST_PHONE_FRONT_URI__: imageData['phone-front'].uri,
    __MANIFEST_GLOW_DIM_URI__: imageData['glow-dim'].uri,
    __MANIFEST_GLOW_BRIGHT_URI__: imageData['glow-bright'].uri,
    __MANIFEST_CHAR_BACK_WIDTH__: charBack.width,
    __MANIFEST_CHAR_BACK_HEIGHT__: charBack.height,
    __MANIFEST_CHAR_BACK_X__: charBack.bboxOffset.x,
    __MANIFEST_CHAR_BACK_Y__: charBack.bboxOffset.y,
    __MANIFEST_PHONE_FRONT_WIDTH__: phoneFront.width,
    __MANIFEST_PHONE_FRONT_HEIGHT__: phoneFront.height,
    __MANIFEST_PHONE_FRONT_X__: phoneFront.bboxOffset.x,
    __MANIFEST_PHONE_FRONT_Y__: phoneFront.bboxOffset.y,
    __MANIFEST_PHONE_FRONT_TAP_X__: phoneTapX,
    __MANIFEST_GLOW_DIM_WIDTH__: glowDim.width,
    __MANIFEST_GLOW_DIM_HEIGHT__: glowDim.height,
    __MANIFEST_GLOW_DIM_X__: glowDim.bboxOffset.x,
    __MANIFEST_GLOW_DIM_Y__: glowDim.bboxOffset.y,
    __MANIFEST_GLOW_BRIGHT_WIDTH__: glowBright.width,
    __MANIFEST_GLOW_BRIGHT_HEIGHT__: glowBright.height,
    __MANIFEST_GLOW_BRIGHT_X__: glowBright.bboxOffset.x,
    __MANIFEST_GLOW_BRIGHT_Y__: glowBright.bboxOffset.y,
    __MANIFEST_GLOW_OFF_X__: -Math.max(glowDim.width, glowBright.width),
    __MANIFEST_GLOW_OFF_Y__: -Math.max(glowDim.height, glowBright.height)
  };
  let css = await readFile(path.join(here, 'social-phone-layers-audit.template.css'), 'utf8');
  for (const [token, value] of Object.entries(replacements)) css = css.replaceAll(token, String(value));
  assert(!/__MANIFEST_[A-Z_]+__/.test(css), 'Unresolved manifest token in generated phone audit CSS');
  await writeFile(path.join(here, 'social-phone-layers-audit.css'), css);
  const embeddedPngBytes = Object.fromEntries(Object.entries(imageData).map(([name, data]) => [name, data.bytes.length]));
  const embeddedBase64Bytes = Object.fromEntries(Object.entries(imageData).map(([name, data]) => [name, data.base64.length]));
  const alphaValuesByLayer = Object.fromEntries(Object.entries(imageData).map(([name, data]) => [name, data.alphaValues]));
  return {
    manifest, css, embeddedPngBytes, embeddedBase64Bytes, alphaValuesByLayer,
    charBackBytes: embeddedPngBytes['char-back'], phoneFrontBytes: embeddedPngBytes['phone-front'],
    charBackBase64Bytes: embeddedBase64Bytes['char-back'], phoneFrontBase64Bytes: embeddedBase64Bytes['phone-front'],
    totalPngBytes: Object.values(embeddedPngBytes).reduce((sum, bytes) => sum + bytes, 0),
    totalBase64Bytes: Object.values(embeddedBase64Bytes).reduce((sum, bytes) => sum + bytes, 0),
    dataUriDeclarationBytes: Object.values(imageData).reduce((sum, data) => sum + Buffer.byteLength(data.uri), 0),
    generatedCssBytes: Buffer.byteLength(css), phoneMinimum, phoneRequiredWidth, phoneTapX
  };
}
const phoneAudit = await generatePhoneAuditCss();
const phoneManifest = phoneAudit.manifest;
const phoneCss = phoneAudit.css;
async function configure(page, panelWidth = 320, toastWidth = 360) {
  await page.locator('.fixture-side').evaluate((el, width) => { el.style.width = `${width}px`; }, panelWidth);
  await page.locator('.fixture-toasts').evaluate((el, width) => {
    if (width === 288) el.dataset.compact = '';
    else delete el.dataset.compact;
  }, toastWidth);
  await page.waitForTimeout(80);
}
async function measure(page) {
  return page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
    };
    const textLines = (el) => {
      if (!el) return [];
      const range = document.createRange();
      range.selectNodeContents(el);
      return [...range.getClientRects()].map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }));
    };
    const panel = document.querySelector('.vrcx-0-side-panel');
    const after = getComputedStyle(panel, '::after');
    const before = getComputedStyle(panel, '::before');
    const cards = [...document.querySelectorAll('.fixture-toast')].map((card) => {
      const icon = card.querySelector('[data-slot="toast-icon"]');
      const iconStyle = getComputedStyle(icon);
      const svg = icon?.querySelector('svg');
      const title = card.querySelector('[data-slot="toast-title"]');
      const description = card.querySelector('[data-slot="toast-description"]');
      const content = card.querySelector('[data-slot="toast-content"]');
      const titleStyle = getComputedStyle(title);
      const descriptionStyle = getComputedStyle(description);
      const close = card.querySelector('[data-slot="toast-close"]');
      const rootStyle = getComputedStyle(card);
      const contentStyle = getComputedStyle(content);
      return {
        type: card.dataset.type,
        root: rect(card),
        rootOverflow: { scrollWidth: card.scrollWidth, clientWidth: card.clientWidth, scrollHeight: card.scrollHeight, clientHeight: card.clientHeight, overflowX: rootStyle.overflowX, overflowY: rootStyle.overflowY },
        content: rect(content),
        contentOverflow: { scrollWidth: content.scrollWidth, clientWidth: content.clientWidth, scrollHeight: content.scrollHeight, clientHeight: content.clientHeight, overflowX: contentStyle.overflowX, overflowY: contentStyle.overflowY },
        icon: {
          rect: rect(icon), backgroundImage: iconStyle.backgroundImage === 'none' ? 'none' : 'image',
          backgroundImageLayers: (iconStyle.backgroundImage.match(/url\(/g) || []).length,
          backgroundSize: iconStyle.backgroundSize, backgroundPosition: iconStyle.backgroundPosition,
          imageRendering: iconStyle.imageRendering, display: iconStyle.display, flexBasis: iconStyle.flexBasis,
          alignSelf: iconStyle.alignSelf, lineHeight: iconStyle.lineHeight, top: iconStyle.top,
          animationName: iconStyle.animationName, svgOpacity: svg ? getComputedStyle(svg).opacity : null,
          svgRect: rect(svg), svgAriaHidden: svg?.getAttribute('aria-hidden') ?? null
        },
        title: { text: title.textContent, rect: rect(title), firstLine: textLines(title)[0] ?? null, lineCount: textLines(title).length, lineHeight: titleStyle.lineHeight, scrollWidth: title.scrollWidth, clientWidth: title.clientWidth, scrollHeight: title.scrollHeight, clientHeight: title.clientHeight },
        description: { text: description.textContent, rect: rect(description), lineCount: textLines(description).length, lineHeight: descriptionStyle.lineHeight, scrollWidth: description.scrollWidth, clientWidth: description.clientWidth, scrollHeight: description.scrollHeight, clientHeight: description.clientHeight },
        close: rect(close)
      };
    });
    const rail = panel.querySelector('.fixture-side-rail');
    const panelRect = rect(panel);
    const panelBorderLeft = parseFloat(getComputedStyle(panel).borderLeftWidth) || 0;
    const afterWidth = parseFloat(after.width);
    const afterRight = parseFloat(after.right);
    const afterLeft = panelBorderLeft + panel.clientWidth - afterRight - afterWidth;
    const railRect = rect(rail);
    const tooltip = document.querySelector('.fixture-tooltip-probe');
    const tooltipStyle = getComputedStyle(tooltip);
    const tooltipRect = rect(tooltip);
    return {
      panel: {
        rect: panelRect,
        beforeContent: before.content,
        beforeHeight: before.height,
        after: { content: after.content, position: after.position, width: after.width, height: after.height, right: after.right, left: afterLeft, backgroundImageLayers: (after.backgroundImage.match(/url\(/g) || []).length, backgroundPositionLayerCount: after.backgroundPosition.split(',').length, backgroundPosition: after.backgroundPosition, backgroundSize: after.backgroundSize, animationName: after.animationName, animationDuration: after.animationDuration, animationDelay: after.animationDelay, animationTimingFunction: after.animationTimingFunction, pointerEvents: after.pointerEvents },
        rail: railRect,
        decorationRailGap: (railRect.x - panelRect.x) - (afterLeft + afterWidth),
        scrollWidth: panel.scrollWidth,
        clientWidth: panel.clientWidth
      },
      toastViewport: rect(document.querySelector('[data-slot="toast-viewport"]')),
      toastStackGap: cards.length > 1 ? cards[1].root.y - cards[0].root.bottom : null,
      cards,
      tooltip: { rect: tooltipRect, display: tooltipStyle.display, visibility: tooltipStyle.visibility, background: tooltipStyle.backgroundColor, borderColor: tooltipStyle.borderColor, borderWidth: tooltipStyle.borderWidth, padding: tooltipStyle.padding, opacity: tooltipStyle.opacity },
      pageOverflow: { documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, documentHeight: document.documentElement.scrollHeight, viewportHeight: innerHeight }
    };
  });
}
async function openPage(browser, dpr = 1) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: dpr });
  const page = await context.newPage();
  await page.goto(fixtureUrl);
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}
async function disablePhoneAudit(page) {
  await page.locator('link[href$="social-phone-layers-audit.css"]').evaluate((link) => link.remove());
}
async function samplePhoneFrames(page) {
  return page.locator('.vrcx-0-side-panel').evaluate((panel) => {
    const animation = document.getAnimations().find((candidate) => candidate.animationName === 'r10-social-phone-layers');
    if (!animation) return null;
    animation.pause();
    animation.effect.updateTiming({ delay: 0 });
    const frames = [];
    for (let frame = 1; frame <= 17; frame++) {
      animation.currentTime = (frame - 0.5) * 4000 / 17;
      const style = getComputedStyle(panel, '::after');
      frames.push({ frame, positions: style.backgroundPosition.split(/,\s*/), sizes: style.backgroundSize.split(/,\s*/) });
    }
    return frames;
  });
}
async function setPhoneFrame(page, frame) {
  await page.locator('.vrcx-0-side-panel').evaluate((panel, frameNumber) => {
    const animation = document.getAnimations().find((candidate) => candidate.animationName === 'r10-social-phone-layers');
    if (!animation) throw new Error('r10-social-phone-layers animation not found');
    animation.pause();
    animation.effect.updateTiming({ delay: 0 });
    animation.currentTime = (frameNumber - 0.5) * 4000 / 17;
  }, frame);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function phonePanelTopClip(page) {
  return page.locator('.vrcx-0-side-panel').evaluate((panel) => {
    const r = panel.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: 28 };
  });
}
async function phoneCanvasClip(page, width, height) {
  return page.locator('.vrcx-0-side-panel').evaluate((panel, size) => {
    const r = panel.getBoundingClientRect();
    const panelStyle = getComputedStyle(panel);
    const after = getComputedStyle(panel, '::after');
    const x = (parseFloat(panelStyle.borderLeftWidth) || 0) + panel.clientWidth - parseFloat(after.right) - parseFloat(after.width);
    const y = (parseFloat(panelStyle.borderTopWidth) || 0) + (parseFloat(after.top) || 0);
    return { x: r.x + x, y: r.y + y, width: size.width, height: size.height };
  }, { width, height });
}
async function compositeLayer(expected, expectedInfo, layerBytes, layer, offset, dpr) {
  const scaled = await sharp(layerBytes).ensureAlpha().resize(layer.width * dpr, layer.height * dpr, { kernel: 'nearest' }).raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < scaled.info.height; y++) {
    for (let x = 0; x < scaled.info.width; x++) {
      const sourceIndex = (y * scaled.info.width + x) * 4;
      const alpha = scaled.data[sourceIndex + 3] / 255;
      if (alpha <= 0) continue;
      const targetX = offset.x * dpr + x;
      const targetY = offset.y * dpr + y;
      if (targetX < 0 || targetY < 0 || targetX >= expectedInfo.width || targetY >= expectedInfo.height) continue;
      const targetIndex = (targetY * expectedInfo.width + targetX) * 4;
      for (let channel = 0; channel < 3; channel++) {
        expected[targetIndex + channel] = Math.round(scaled.data[sourceIndex + channel] * alpha + expected[targetIndex + channel] * (1 - alpha));
      }
      expected[targetIndex + 3] = Math.round(255 * alpha + expected[targetIndex + 3] * (1 - alpha));
    }
  }
}
async function comparePhoneCanvas(page, panelWidth, dpr, frame, phoneAudit) {
  const manifest = phoneAudit.manifest;
  const charBack = manifest.layers['char-back'];
  const phoneFront = manifest.layers['phone-front'];
  const glowDim = manifest.layers['glow-dim'];
  const glowBright = manifest.layers['glow-bright'];
  const tapped = frame === 3 || frame === 5;
  const showDim = [9, 10, 12, 14, 15].includes(frame);
  const showBright = frame === 11;
  await setPhoneFrame(page, frame);
  const clip = await phoneCanvasClip(page, manifest.source.socialCanvasMinimum.width, manifest.source.socialCanvasMinimum.height);
  await page.evaluate(() => {
    for (const variable of ['--r10-phone-char-back-image', '--r10-phone-front-image', '--r10-phone-glow-dim-image', '--r10-phone-glow-bright-image']) document.documentElement.style.setProperty(variable, 'none');
  });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const backgroundPng = await page.screenshot({ clip });
  await page.evaluate(() => {
    for (const variable of ['--r10-phone-char-back-image', '--r10-phone-front-image', '--r10-phone-glow-dim-image', '--r10-phone-glow-bright-image']) document.documentElement.style.removeProperty(variable);
  });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const actualPng = await page.screenshot({ clip });
  const base = await sharp(backgroundPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const actual = await sharp(actualPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert(base.info.width === clip.width * dpr && base.info.height === clip.height * dpr, 'Phone canvas screenshot crop has unexpected DPR dimensions');
  const expected = Buffer.from(base.data);
  const assetDir = path.join(themeRoot, 'original-assets/r10-phone-layers');
  const charBytes = await readFile(path.join(assetDir, charBack.file));
  const frontBytes = await readFile(path.join(assetDir, phoneFront.file));
  const dimBytes = await readFile(path.join(assetDir, glowDim.file));
  const brightBytes = await readFile(path.join(assetDir, glowBright.file));
  await compositeLayer(expected, base.info, charBytes, charBack, charBack.bboxOffset, dpr);
  if (showDim) await compositeLayer(expected, base.info, dimBytes, glowDim, glowDim.bboxOffset, dpr);
  if (showBright) await compositeLayer(expected, base.info, brightBytes, glowBright, glowBright.bboxOffset, dpr);
  await compositeLayer(expected, base.info, frontBytes, phoneFront, { x: phoneFront.bboxOffset.x + (tapped ? 1 : 0), y: phoneFront.bboxOffset.y }, dpr);
  let differingPixels = 0;
  let greaterThanTwoLsbPixels = 0;
  let outsideGlowPixels = 0;
  let maxChannelDelta = 0;
  const activeGlow = showDim ? glowDim : showBright ? glowBright : null;
  for (let i = 0; i < expected.length; i += 4) {
    let pixelDifferent = false;
    let significant = false;
    for (let channel = 0; channel < 4; channel++) {
      const delta = Math.abs(expected[i + channel] - actual.data[i + channel]);
      if (delta) pixelDifferent = true;
      if (delta > 2) significant = true;
      if (delta > maxChannelDelta) maxChannelDelta = delta;
    }
    if (pixelDifferent) {
      differingPixels++;
      if (significant) greaterThanTwoLsbPixels++;
      const pixelIndex = i / 4;
      const logicalX = Math.floor((pixelIndex % base.info.width) / dpr);
      const logicalY = Math.floor(Math.floor(pixelIndex / base.info.width) / dpr);
      const insideGlow = activeGlow && logicalX >= activeGlow.bboxOffset.x && logicalX < activeGlow.bboxOffset.x + activeGlow.width && logicalY >= activeGlow.bboxOffset.y && logicalY < activeGlow.bboxOffset.y + activeGlow.height;
      if (!insideGlow) outsideGlowPixels++;
    }
  }
  assert(greaterThanTwoLsbPixels === 0 && outsideGlowPixels === 0, `Phone frame ${frame} differs outside the expected alpha-composite by ${outsideGlowPixels} pixels or >2-LSB on ${greaterThanTwoLsbPixels} pixels (max channel delta ${maxChannelDelta})`);
  let leftEarAudit = null;
  if (tapped) {
    const charPixels = await sharp(charBytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const frontPixels = await sharp(frontBytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const charIndex = (8 * charPixels.info.width + 18) * 4;
    const frontIndex = 1 * 4;
    const charEar = Array.from(charPixels.data.slice(charIndex, charIndex + 4));
    const frontEar = Array.from(frontPixels.data.slice(frontIndex, frontIndex + 4));
    assert(JSON.stringify(charEar) === JSON.stringify(frontEar) && charEar[3] === 255, 'Tap frame shared left-ear cell is absent or mismatched in source layers');
    for (const x of [18, 19]) {
      const renderedIndex = ((8 * dpr) * actual.info.width + x * dpr) * 4;
      const rendered = Array.from(actual.data.slice(renderedIndex, renderedIndex + 4));
      assert(JSON.stringify(rendered) === JSON.stringify(charEar), `Tap frame ${frame} left ear is incomplete at (${x},8)`);
    }
    leftEarAudit = { cells: [[18, 8], [19, 8]], rgba: charEar, exact: true };
  }
  return { panelWidth, dpr, frame, tapped, canvasCells: `${clip.width}x${clip.height}`, screenshotPixels: `${base.info.width}x${base.info.height}`, differingPixels, withinTwoLsbPixels: differingPixels, outsideGlowPixels, maxChannelDelta, leftEarAudit, leftEdgeAudit: tapped ? 'no old-bezel residue; exact char-back/phone-front composite' : 'rest composite matches manifest' };
}
async function writePhoneContactSheet(buffers, panelWidth, dpr, filename) {
  const first = await sharp(buffers[0]).metadata();
  const columns = 5;
  const rows = Math.ceil(buffers.length / columns);
  const labelHeight = 18 * dpr;
  const cellWidth = first.width;
  const cellHeight = first.height + labelHeight;
  const composite = [];
  for (let index = 0; index < buffers.length; index++) {
    const left = (index % columns) * cellWidth;
    const top = Math.floor(index / columns) * cellHeight;
    const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cellWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#211a33"/><text x="${5 * dpr}" y="${13 * dpr}" fill="#ffe4f2" font-family="monospace" font-size="${12 * dpr}">F${String(index + 1).padStart(2, '0')}</text></svg>`);
    composite.push({ input: label, left, top }, { input: buffers[index], left, top: top + labelHeight });
  }
  const output = await sharp({ create: { width: columns * cellWidth, height: rows * cellHeight, channels: 4, background: { r: 33, g: 26, b: 51, alpha: 1 } } }).composite(composite).png().toBuffer();
  await writeFile(path.join(here, filename), output);
  return { file: filename, width: columns * cellWidth, height: rows * cellHeight, frames: buffers.length, columns, rows };
}
async function compareAdjacentPng(beforePng, afterPng) {
  const before = await sharp(beforePng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const after = await sharp(afterPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert(before.info.width === after.info.width && before.info.height === after.info.height, 'Adjacent frame crops have different dimensions');
  let changedPixels = 0;
  let rgbDeltaSum = 0;
  let maxChannelDelta = 0;
  for (let i = 0; i < before.data.length; i += 4) {
    let changed = false;
    for (let channel = 0; channel < 3; channel++) {
      const delta = Math.abs(before.data[i + channel] - after.data[i + channel]);
      rgbDeltaSum += delta;
      if (delta > 0) changed = true;
      if (delta > maxChannelDelta) maxChannelDelta = delta;
    }
    if (changed) changedPixels++;
  }
  return { changedPixels, meanAbsRgbDelta: Number((rgbDeltaSum / (before.info.width * before.info.height * 3)).toFixed(3)), maxChannelDelta, cropPixels: `${before.info.width}x${before.info.height}` };
}
async function writeGlowCompare(canvasFrames, filename) {
  const picks = [{ index: 7, label: 'F08 OFF' }, { index: 8, label: 'F09 DIM' }, { index: 10, label: 'F11 BRIGHT' }];
  const scale = 8;
  const labelHeight = 24;
  const tiles = [];
  for (const pick of picks) {
    const meta = await sharp(canvasFrames[pick.index]).metadata();
    const tile = await sharp(canvasFrames[pick.index]).resize(meta.width * scale, meta.height * scale, { kernel: 'nearest' }).png().toBuffer();
    tiles.push({ ...pick, buffer: tile, width: meta.width * scale, height: meta.height * scale });
  }
  const width = tiles.reduce((sum, tile) => sum + tile.width, 0);
  const height = labelHeight + Math.max(...tiles.map((tile) => tile.height));
  const composite = [];
  let left = 0;
  for (const tile of tiles) {
    const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tile.width}" height="${labelHeight}"><rect width="100%" height="100%" fill="#211a33"/><text x="6" y="17" fill="#ffe4f2" font-family="monospace" font-size="14">${tile.label}</text></svg>`);
    composite.push({ input: label, left, top: 0 }, { input: tile.buffer, left, top: labelHeight });
    left += tile.width;
  }
  const output = await sharp({ create: { width, height, channels: 4, background: { r: 33, g: 26, b: 51, alpha: 1 } } }).composite(composite).png().toBuffer();
  await writeFile(path.join(here, filename), output);
  return { file: filename, width, height, source: 'real 1x browser captures enlarged 8x with nearest-neighbour for inspection' };
}
async function makeZoomTile(sourcePng, label, scale = 8) {
  const source = await sharp(sourcePng).metadata();
  const width = source.width * scale;
  const imageHeight = source.height * scale;
  const labelHeight = 24;
  const zoomed = await sharp(sourcePng).resize(width, imageHeight, { kernel: 'nearest' }).png().toBuffer();
  const labelSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${labelHeight}"><rect width="100%" height="100%" fill="#211a33"/><text x="6" y="17" fill="#ffe4f2" font-family="monospace" font-size="14">${label}</text></svg>`);
  const buffer = await sharp({ create: { width, height: labelHeight + imageHeight, channels: 4, background: { r: 33, g: 26, b: 51, alpha: 1 } } }).composite([{ input: labelSvg, left: 0, top: 0 }, { input: zoomed, left: 0, top: labelHeight }]).png().toBuffer();
  return { buffer, width, height: labelHeight + imageHeight, scale, label };
}
async function writeSingleFrameZoom(canvasFrames, index, label, filename) {
  const tile = await makeZoomTile(canvasFrames[index], label, 8);
  assert(tile.width <= 2000 && tile.height <= 2000, `${filename}: zoom image exceeds 2000px`);
  await writeFile(path.join(here, filename), tile.buffer);
  return { file: filename, width: tile.width, height: tile.height, frame: index + 1, scale: tile.scale, source: 'single real DPR1 browser frame; nearest-neighbour enlargement' };
}
async function writeFramePairZoom(canvasFrames, picks, filename) {
  const tiles = [];
  for (const pick of picks) tiles.push(await makeZoomTile(canvasFrames[pick.index], pick.label, 8));
  const gap = 16;
  const width = tiles.reduce((sum, tile) => sum + tile.width, 0) + gap * (tiles.length - 1);
  const height = Math.max(...tiles.map((tile) => tile.height));
  assert(width <= 2000 && height <= 2000, `${filename}: comparison image exceeds 2000px`);
  const composite = [];
  let left = 0;
  for (const tile of tiles) {
    composite.push({ input: tile.buffer, left, top: 0 });
    left += tile.width + gap;
  }
  const buffer = await sharp({ create: { width, height, channels: 4, background: { r: 33, g: 26, b: 51, alpha: 1 } } }).composite(composite).png().toBuffer();
  await writeFile(path.join(here, filename), buffer);
  return { file: filename, width, height, frames: picks.map((pick) => pick.index + 1), scale: 8, source: 'real DPR1 browser frames; nearest-neighbour enlargement' };
}
async function capturePhoneAuditScreenshots(browser, phoneAudit, baseFrame) {
  const screenshotFiles = [];
  const contactSheets = [];
  const reviewImages = [];
  const pixelAudits = [];
  const adjacentFramePixelDiffs = [];
  const motionModeAudits = [];
  const minWidth = phoneAudit.manifest.source.socialCanvasMinimum.width;
  const minHeight = phoneAudit.manifest.source.socialCanvasMinimum.height;
  async function captureStaticMode(panelWidth, dpr, mode) {
    const slug = mode === 'normal' ? 'normal' : mode === 'prefers-reduced-motion' ? 'reduced' : 'html-reduce-effects';
    const filename = `social-phone-w${panelWidth}-dpr${dpr}-${slug}.png`;
    const { context, page } = await openPage(browser, dpr);
    try {
      await page.emulateMedia({ reducedMotion: mode === 'prefers-reduced-motion' ? 'reduce' : 'no-preference' });
      if (mode === 'html.reduce-effects') await page.evaluate(() => document.documentElement.classList.add('reduce-effects'));
      await configure(page, panelWidth, 360);
      const style = await page.locator('.vrcx-0-side-panel').evaluate((panel) => {
        const s = getComputedStyle(panel, '::after');
        return { animationName: s.animationName, animationDuration: s.animationDuration, animationDelay: s.animationDelay, animationTimingFunction: s.animationTimingFunction, backgroundPosition: s.backgroundPosition, backgroundSize: s.backgroundSize, imageRendering: s.imageRendering };
      });
      if (mode === 'normal') {
        assert(style.animationName === 'r10-social-phone-layers' && style.animationDuration === '4s' && style.animationDelay === '-2s' && /^steps\(17(?:, end)?\)$/.test(style.animationTimingFunction), `${panelWidth}px DPR${dpr}: normal phone animation timing mismatch`);
      } else {
        assert(style.animationName === 'none' && style.backgroundPosition === baseFrame.positions.join(', ') && style.backgroundSize === baseFrame.sizes.join(', '), `${panelWidth}px DPR${dpr}: ${mode} did not hold the complete rest frame`);
      }
      assert(style.imageRendering === 'pixelated', `${panelWidth}px DPR${dpr}: image-rendering must be pixelated`);
      const clip = await phonePanelTopClip(page);
      const png = await page.screenshot({ clip });
      await writeFile(path.join(here, filename), png);
      screenshotFiles.push(filename);
      const metadata = await sharp(png).metadata();
      motionModeAudits.push({ mode, panelWidth, dpr, filename, animationName: style.animationName, backgroundPosition: style.backgroundPosition, backgroundSize: style.backgroundSize, screenshotPixels: `${metadata.width}x${metadata.height}` });
    } finally {
      await context.close();
    }
  }
  for (const panelWidth of [320, 240]) {
    for (const dpr of [1, 2]) {
      const { context: normalContext, page: normalPage } = await openPage(browser, dpr);
      try {
        await normalPage.emulateMedia({ reducedMotion: 'no-preference' });
        await configure(normalPage, panelWidth, 360);
        const topClip = await phonePanelTopClip(normalPage);
        const canvasClip = await phoneCanvasClip(normalPage, minWidth, minHeight);
        const normalName = `social-phone-w${panelWidth}-dpr${dpr}-normal.png`;
        const normalPng = await normalPage.screenshot({ clip: topClip });
        await writeFile(path.join(here, normalName), normalPng);
        screenshotFiles.push(normalName);
        const headerFrames = [];
        const canvasFrames = [];
        for (let frame = 1; frame <= 17; frame++) {
          await setPhoneFrame(normalPage, frame);
          headerFrames.push(await normalPage.screenshot({ clip: topClip }));
          canvasFrames.push(await normalPage.screenshot({ clip: canvasClip }));
        }
        const stripName = `social-phone-frames-w${panelWidth}-dpr${dpr}.png`;
        contactSheets.push(await writePhoneContactSheet(headerFrames, panelWidth, dpr, stripName));
        screenshotFiles.push(stripName);
        const transitions = [];
        for (let index = 0; index < 16; index++) {
          transitions.push({ fromFrame: index + 1, toFrame: index + 2, ...await compareAdjacentPng(canvasFrames[index], canvasFrames[index + 1]) });
        }
        adjacentFramePixelDiffs.push({ panelWidth, dpr, canvasCells: `${minWidth}x${minHeight}`, transitions });
        for (const frame of [1, 3, 5, 8, 9, 11, 13]) pixelAudits.push(await comparePhoneCanvas(normalPage, panelWidth, dpr, frame, phoneAudit));
        if (panelWidth === 320 && dpr === 1) {
          const compare = await writeGlowCompare(canvasFrames, 'social-phone-glow-1x-compare-8x.png');
          contactSheets.push(compare);
          screenshotFiles.push(compare.file);
          for (const [index, label, filename] of [
            [2, 'F03 TAP', 'social-phone-frame-f03-tap-8x.png'],
            [4, 'F05 TAP', 'social-phone-frame-f05-tap-8x.png'],
            [8, 'F09 DIM', 'social-phone-frame-f09-dim-8x.png'],
            [10, 'F11 BRIGHT', 'social-phone-frame-f11-bright-8x.png'],
            [12, 'F13 REST', 'social-phone-frame-f13-rest-8x.png']
          ]) {
            const review = await writeSingleFrameZoom(canvasFrames, index, label, filename);
            reviewImages.push(review);
            screenshotFiles.push(review.file);
          }
          for (const [picks, filename] of [
            [[{ index: 2, label: 'F03 TAP' }, { index: 0, label: 'F01 REST' }], 'social-phone-f03-vs-f01-8x.png'],
            [[{ index: 10, label: 'F11 BRIGHT' }, { index: 8, label: 'F09 DIM' }], 'social-phone-f11-bright-vs-f09-dim-8x.png']
          ]) {
            const review = await writeFramePairZoom(canvasFrames, picks, filename);
            reviewImages.push(review);
            screenshotFiles.push(review.file);
          }
        }
      } finally {
        await normalContext.close();
      }
      await captureStaticMode(panelWidth, dpr, 'prefers-reduced-motion');
      await captureStaticMode(panelWidth, dpr, 'html.reduce-effects');
    }
  }
  return { screenshotFiles, contactSheets, reviewImages, pixelAudits, adjacentFramePixelDiffs, motionModeAudits };
}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  if (mode === 'baseline') {
    const results = {};
    const { context, page } = await openPage(browser, 1);
    try {
      await disablePhoneAudit(page);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      for (const panelWidth of [320, 240]) {
        for (const toastWidth of [360, 288]) {
          await configure(page, panelWidth, toastWidth);
          results[`${panelWidth}-${toastWidth}`] = await measure(page);
        }
      }
    } finally {
      await context.close();
    }
    await writeFile(path.join(here, 'baseline-layout.json'), JSON.stringify({ sourceTheme: 'pre-task55 preview-package', results }, null, 2) + '\n');
    console.log(JSON.stringify({ mode, scenarios: Object.keys(results), output: path.join(here, 'baseline-layout.json') }, null, 2));
  } else {
    const cssPath = path.join(themeRoot, 'runtime/status-icons-r10.css');
    const css = await readFile(cssPath, 'utf8');
    const baseline = JSON.parse(await readFile(path.join(here, 'baseline-layout.json'), 'utf8')).results;
    assert((css.match(/data:image\/png;base64,/g) || []).length === 2, 'Expected exactly two embedded PNG data URLs');
    assert(!css.includes('data:image/svg+xml') && !css.includes('@keyframes') && !/animation\s*:/.test(css), 'Toast CSS must contain PNGs only and remain static');
    assert(!/::before|::after/.test(css), 'Toast CSS must not consume pseudo-elements');
    assert((phoneCss.match(/@keyframes/g) || []).length === 1 && phoneCss.includes('@keyframes r10-social-phone-layers'), 'Phone fixture must have exactly one named keyframes block');
    assert((phoneCss.match(/data:image\/png;base64,/g) || []).length === 4, 'Phone audit fixture must embed exactly four manifest PNG layers');
    assert(['char-back', 'front', 'glow-dim', 'glow-bright'].every((name) => new RegExp(`--r10-phone-${name}-image:\\s*url\\(\\\"data:image/png;base64,`).test(phoneCss)), 'Phone audit PNG data URIs were not wired to all manifest layers');
    assert(!/--r10-phone-glow-(?:dim|bright)-image:\s*none;/.test(phoneCss), 'Final glow PNG data URIs must be embedded in the fixture');
    assert(phoneCss.includes('animation: r10-social-phone-layers 4s steps(17, end) -2s infinite;'), 'Phone fixture timing/phase changed unexpectedly');
    assert(phoneCss.includes('background-image: var(--r10-phone-front-image), var(--r10-phone-glow-dim-image), var(--r10-phone-glow-bright-image), var(--r10-phone-char-back-image),'), 'Phone/glow/char layer z-order changed');

    const layoutResults = {};
    const layoutChanges = {};
    const files = [];
    for (const panelWidth of [320, 240]) {
      for (const reduced of [false, true]) {
        const { context, page } = await openPage(browser, 1);
        try {
          await disablePhoneAudit(page);
          await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
          await page.evaluate(() => document.documentElement.classList.remove('reduce-effects'));
          await configure(page, panelWidth, 360);
          const result = await measure(page);
          const key = `${panelWidth}-360-${reduced ? 'reduced' : 'normal'}`;
          layoutResults[key] = result;
          const baselineResult = baseline[`${panelWidth}-360`];
          assert(result.cards.length === 2, `${key}: expected two visible toast cards`);
          assert(result.panel.rect.width === panelWidth, `${key}: panel width mismatch`);
          assert(result.panel.beforeContent === '"SOCIAL"', `${key}: SOCIAL title hook changed`);
          assert(result.panel.after.width === '42px' && result.panel.after.right === '88px', `${key}: existing SOCIAL cross/cat canvas unexpectedly changed`);
          assert(result.panel.decorationRailGap >= 51.5, `${key}: SOCIAL decoration enters control rail clearance`);
          assert(result.panel.scrollWidth <= result.panel.clientWidth, `${key}: SOCIAL panel horizontal overflow`);
          assert(result.pageOverflow.documentWidth <= result.pageOverflow.viewportWidth, `${key}: page horizontal overflow`);
          assert(result.pageOverflow.documentHeight <= result.pageOverflow.viewportHeight, `${key}: page vertical overflow`);
          assert(result.toastStackGap >= 11.5 && near(result.toastStackGap, baselineResult.toastStackGap), `${key}: stacked toast gap changed/collapsed`);
          for (const field of ['width', 'height']) assert(near(result.tooltip.rect[field], baselineResult.tooltip.rect[field]), `${key}: tooltip geometry changed`);
          for (const field of ['background', 'borderColor', 'borderWidth', 'padding', 'opacity']) assert(result.tooltip[field] === baselineResult.tooltip[field], `${key}: tooltip styling changed`);
          layoutChanges[key] = { toastStackGap: result.toastStackGap, cards: {} };
          for (let i = 0; i < result.cards.length; i++) {
            const card = result.cards[i];
            const old = baselineResult.cards[i];
            assert(card.type === old.type, `${key}: toast type changed`);
            assert(near(card.root.width, old.root.width), `${key}/${card.type}: toast width changed`);
            const heightDelta = card.root.height - old.root.height;
            const expectedTextHeightDelta = (card.title.lineCount - old.title.lineCount) * parseFloat(old.title.lineHeight) + (card.description.lineCount - old.description.lineCount) * parseFloat(old.description.lineHeight);
            assert(near(heightDelta, expectedTextHeightDelta, 1), `${key}/${card.type}: height delta ${heightDelta}px does not match text-wrap delta ${expectedTextHeightDelta}px`);
            layoutChanges[key].cards[card.type] = { baselineHeight: old.root.height, finalHeight: card.root.height, heightDelta, baselineDescriptionLines: old.description.lineCount, finalDescriptionLines: card.description.lineCount, expectedTextWrapDelta: expectedTextHeightDelta };
            assert(card.title.text === old.title.text && card.description.text === old.description.text, `${key}/${card.type}: toast text changed`);
            assert(near(card.icon.rect.width, 28) && near(card.icon.rect.height, 24), `${key}/${card.type}: icon slot is not 28x24`);
            assert(card.icon.backgroundSize === '28px 24px', `${key}/${card.type}: icon sprite is not 1 logical cell per CSS px`);
            assert(card.icon.imageRendering === 'pixelated', `${key}/${card.type}: image-rendering is not pixelated`);
            assert(card.icon.backgroundImageLayers === 1, `${key}/${card.type}: expected exactly one PNG layer`);
            assert(card.icon.svgOpacity === '0' && card.icon.svgAriaHidden === 'true', `${key}/${card.type}: original aria-hidden SVG must remain in DOM but be visually hidden`);
            assert(near(card.title.firstLine.x - old.title.firstLine.x, 12), `${key}/${card.type}: copy must move exactly 12px from expanded icon slot`);
            assert(card.title.scrollWidth <= card.title.clientWidth && card.description.scrollWidth <= card.description.clientWidth, `${key}/${card.type}: text horizontally overflows`);
            assert(card.title.scrollHeight <= card.title.clientHeight && card.description.scrollHeight <= card.description.clientHeight, `${key}/${card.type}: text is clipped vertically`);
            assert(card.contentOverflow.scrollWidth <= card.contentOverflow.clientWidth && card.contentOverflow.scrollHeight <= card.contentOverflow.clientHeight, `${key}/${card.type}: toast content clips/overflows`);
            assert(near(card.icon.rect.y + card.icon.rect.height / 2, card.title.firstLine.y + card.title.firstLine.height / 2), `${key}/${card.type}: icon is not vertically centered on the first title line`);
            if (card.close) {
              assert(old.close && near(card.close.x, old.close.x) && near(card.close.width, old.close.width) && near(card.close.height, old.close.height), `${key}/${card.type}: close button horizontal position/size moved`);
              assert(near(card.close.y - old.close.y, heightDelta / 2, 1), `${key}/${card.type}: close button is no longer vertically centered as toast height changes`);
              layoutChanges[key].cards[card.type].closeButtonDelta = { x: card.close.x - old.close.x, y: card.close.y - old.close.y };
            }
          }
          const screenshot = panelWidth === 320
            ? (reduced ? 'preview-reduced.png' : 'preview.png')
            : (reduced ? 'preview-reduced-240.png' : 'preview-240.png');
          await page.screenshot({ path: path.join(here, screenshot), fullPage: true });
          files.push(screenshot);
          if (reduced) assert(result.panel.after.animationName === 'none', `${key}: prefers-reduced-motion did not stop existing SOCIAL animation`);
          else assert(result.panel.after.animationName === 'r96-social-cat', `${key}: normal SOCIAL cat loop is missing`);
        } finally {
          await context.close();
        }
      }
    }

    for (const panelWidth of [320, 240]) {
      const { context, page } = await openPage(browser, 1);
      try {
        await disablePhoneAudit(page);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await configure(page, panelWidth, 288);
        const compactMetrics = await measure(page);
        const key = `${panelWidth}-288-normal`;
        layoutResults[key] = compactMetrics;
        const oldMetrics = baseline[`${panelWidth}-288`];
        assert(compactMetrics.toastViewport.width === 288, `${key}: compact fixture width was not 288px`);
        assert(near(compactMetrics.toastStackGap, oldMetrics.toastStackGap), `${key}: compact toast stack gap changed`);
        assert(compactMetrics.panel.rect.width === panelWidth, `${key}: panel width mismatch`);
        for (let i = 0; i < compactMetrics.cards.length; i++) {
          const card = compactMetrics.cards[i];
          const old = oldMetrics.cards[i];
          const heightDelta = card.root.height - old.root.height;
          const expectedTextHeightDelta = (card.title.lineCount - old.title.lineCount) * parseFloat(old.title.lineHeight) + (card.description.lineCount - old.description.lineCount) * parseFloat(old.description.lineHeight);
          assert(near(card.root.width, old.root.width) && near(heightDelta, expectedTextHeightDelta, 1), `${key}/${card.type}: root size delta does not match text-wrap delta`);
          assert(near(card.title.firstLine.x - old.title.firstLine.x, 12), `${key}/${card.type}: compact copy did not shift by 12px`);
          assert(near(card.icon.rect.width, 28) && near(card.icon.rect.height, 24), `${key}/${card.type}: compact icon slot size mismatch`);
          assert(card.title.scrollWidth <= card.title.clientWidth && card.description.scrollWidth <= card.description.clientWidth, `${key}/${card.type}: compact text overflows`);
          assert(card.title.scrollHeight <= card.title.clientHeight && card.description.scrollHeight <= card.description.clientHeight, `${key}/${card.type}: compact text is clipped`);
          assert(card.contentOverflow.scrollWidth <= card.contentOverflow.clientWidth && card.contentOverflow.scrollHeight <= card.contentOverflow.clientHeight, `${key}/${card.type}: compact toast content clips`);
          if (card.type === 'error') assert(card.description.lineCount >= 2, `${key}: long error description did not wrap`);
          if (card.close) assert(old.close && near(card.close.x, old.close.x) && near(card.close.y - old.close.y, heightDelta / 2, 1), `${key}: close button drifted outside the growing toast`);
          layoutChanges[key] = layoutChanges[key] ?? { toastStackGap: compactMetrics.toastStackGap, cards: {} };
          layoutChanges[key].cards[card.type] = { baselineHeight: old.root.height, finalHeight: card.root.height, heightDelta, baselineDescriptionLines: old.description.lineCount, finalDescriptionLines: card.description.lineCount, expectedTextWrapDelta: expectedTextHeightDelta };
        }
        if (panelWidth === 320) {
          await page.screenshot({ path: path.join(here, 'preview-compact-288.png'), fullPage: true });
          files.push('preview-compact-288.png');
        } else {
          await page.screenshot({ path: path.join(here, 'preview-compact-288-panel240.png'), fullPage: true });
          files.push('preview-compact-288-panel240.png');
        }
      } finally {
        await context.close();
      }
    }

    const phoneFrontLayer = phoneManifest.layers['phone-front'];
    const phoneCanvasMinimum = phoneManifest.source.socialCanvasMinimum.width;
    const phoneTapX = phoneFrontLayer.bboxOffset.x + 1;
    const phoneRequiredCanvasWidth = phoneTapX + phoneFrontLayer.width;
    const { context: phoneContext, page: phonePage } = await openPage(browser, 1);
    let phoneFramework;
    try {
      await phonePage.emulateMedia({ reducedMotion: 'no-preference' });
      const phonePanelMetrics = [];
      for (const panelWidth of [320, 240]) {
        await configure(phonePage, panelWidth, 360);
        phonePanelMetrics.push(await measure(phonePage));
      }
      const phoneStyle = await phonePage.locator('.vrcx-0-side-panel').evaluate((panel) => {
        const s = getComputedStyle(panel, '::after');
        const root = getComputedStyle(document.documentElement);
        const variable = (name) => root.getPropertyValue(name).trim();
        return {
          width: s.width, height: s.height, right: s.right, backgroundLayerCount: s.backgroundPosition.split(',').length,
          animationName: s.animationName, animationDuration: s.animationDuration, animationDelay: s.animationDelay, animationTimingFunction: s.animationTimingFunction,
          imageRendering: s.imageRendering,
          imageVariableStatus: ['--r10-phone-char-back-image', '--r10-phone-front-image', '--r10-phone-glow-dim-image', '--r10-phone-glow-bright-image'].map((name) => {
            const value = variable(name);
            return value === 'none' ? 'none' : value.startsWith('url(\"data:image/png;base64,') ? 'manifest-png' : 'unexpected';
          }),
          sizes: ['--r10-phone-char-back-size', '--r10-phone-front-size', '--r10-phone-glow-dim-size', '--r10-phone-glow-bright-size'].map(variable),
          positions: ['--r10-phone-char-back-position', '--r10-phone-front-rest', '--r10-phone-front-tap', '--r10-phone-glow-dim-visible', '--r10-phone-glow-bright-visible', '--r10-phone-glow-off'].map(variable),
          canvasWidth: parseFloat(variable('--r10-phone-canvas-width'))
        };
      });
      const frames = await samplePhoneFrames(phonePage);
      for (const [index, metrics] of phonePanelMetrics.entries()) {
        const panelWidth = [320, 240][index];
        assert(metrics.panel.rect.width === panelWidth, `Phone audit panel width ${panelWidth}px mismatch`);
        assert(metrics.panel.after.width === '68px' && metrics.panel.after.height === '22px' && metrics.panel.after.right === '88px' && near(metrics.panel.after.left, panelWidth - 157), `Phone audit canvas geometry mismatch at ${panelWidth}px`);
        assert(metrics.panel.after.backgroundPositionLayerCount === 6 && metrics.panel.decorationRailGap >= 51.5, `Phone audit layers/rail clearance mismatch at ${panelWidth}px`);
        assert(metrics.panel.scrollWidth <= metrics.panel.clientWidth, `Phone audit canvas causes SOCIAL horizontal overflow at ${panelWidth}px`);
      }
      assert(phoneStyle.animationName === 'r10-social-phone-layers' && phoneStyle.animationDuration === '4s' && phoneStyle.animationDelay === '-2s' && /^steps\(17(?:, end)?\)$/.test(phoneStyle.animationTimingFunction), 'Phone audit animation timing mismatch');
      assert(phoneStyle.width === '68px' && phoneStyle.canvasWidth === 68 && phoneStyle.imageRendering === 'pixelated', 'Phone audit canvas/rendering mismatch');
      assert(JSON.stringify(phoneStyle.imageVariableStatus) === JSON.stringify(['manifest-png', 'manifest-png', 'manifest-png', 'manifest-png']), 'All four manifest PNGs must be embedded in the fixture');
      const expectedSizes = [phoneManifest.layers['char-back'], phoneFrontLayer, phoneManifest.layers['glow-dim'], phoneManifest.layers['glow-bright']].map((layer) => `${layer.width}px ${layer.height}px`);
      assert(JSON.stringify(phoneStyle.sizes) === JSON.stringify(expectedSizes), 'Generated layer sizes no longer match current manifest bounds');
      const expectedPositions = [
        `${phoneManifest.layers['char-back'].bboxOffset.x}px ${phoneManifest.layers['char-back'].bboxOffset.y}px`,
        `${phoneFrontLayer.bboxOffset.x}px ${phoneFrontLayer.bboxOffset.y}px`,
        `${phoneTapX}px ${phoneFrontLayer.bboxOffset.y}px`,
        `${phoneManifest.layers['glow-dim'].bboxOffset.x}px ${phoneManifest.layers['glow-dim'].bboxOffset.y}px`,
        `${phoneManifest.layers['glow-bright'].bboxOffset.x}px ${phoneManifest.layers['glow-bright'].bboxOffset.y}px`,
        `${-Math.max(phoneManifest.layers['glow-dim'].width, phoneManifest.layers['glow-bright'].width)}px ${-Math.max(phoneManifest.layers['glow-dim'].height, phoneManifest.layers['glow-bright'].height)}px`
      ];
      assert(JSON.stringify(phoneStyle.positions) === JSON.stringify(expectedPositions), 'Generated layer positions no longer match current manifest bounds');
      assert(phoneCanvasMinimum === phoneRequiredCanvasWidth && phoneStyle.canvasWidth >= phoneRequiredCanvasWidth, `68px canvas must contain the right-shifted ${phoneFrontLayer.width}-cell phone (minimum ${phoneRequiredCanvasWidth})`);
      assert(frames?.length === 17 && frames.every((frame) => frame.positions.length === 6 && frame.sizes.length === 6), 'Phone animation does not expose 17 six-layer frames');
      const tapFrames = [3, 5];
      const dimFrames = [9, 10, 12, 14, 15];
      const brightFrames = [11];
      const wave = [
        ['26px 5px', '50px 4px'], ['26px 5px', '50px 2px'], ['26px 5px', '50px 0px'], ['26px 5px', '50px 1px'],
        ['26px 5px', '50px 2px'], ['26px 5px', '50px 4px'], ['27px 6px', '50px 4px'], ['26px 5px', '51px 4px'],
        ['26px 5px', '50px 4px'], ['26px 5px', '50px 2px'], ['26px 5px', '50px 0px'], ['26px 5px', '50px 1px'],
        ['26px 5px', '50px 2px'], ['26px 5px', '50px 4px'], ['27px 6px', '50px 4px'], ['26px 5px', '51px 4px'], ['26px 5px', '50px 4px']
      ];
      for (const frame of frames) {
        const isTap = tapFrames.includes(frame.frame);
        const isDim = dimFrames.includes(frame.frame);
        const isBright = brightFrames.includes(frame.frame);
        assert(frame.positions[0] === (isTap ? phoneStyle.positions[2] : phoneStyle.positions[1]), `Phone-front offset mismatch in frame ${frame.frame}`);
        assert(frame.positions[1] === (isDim ? phoneStyle.positions[3] : phoneStyle.positions[5]), `Dim-glow visibility mismatch in frame ${frame.frame}`);
        assert(frame.positions[2] === (isBright ? phoneStyle.positions[4] : phoneStyle.positions[5]), `Bright-glow visibility mismatch in frame ${frame.frame}`);
        assert(frame.positions[3] === phoneStyle.positions[0], `char-back offset mismatch in frame ${frame.frame}`);
        assert(frame.positions[4] === wave[frame.frame - 1][0] && frame.positions[5] === wave[frame.frame - 1][1], `Cross/cat wave phase mismatch in frame ${frame.frame}`);
        const expectedStarSize = frame.frame === 7 || frame.frame === 15 ? '14px 14px' : '16px 16px';
        const expectedSizes = [phoneStyle.sizes[1], phoneStyle.sizes[2], phoneStyle.sizes[3], phoneStyle.sizes[0], expectedStarSize, '18px 18px'];
        assert(JSON.stringify(frame.sizes) === JSON.stringify(expectedSizes), `Layer size/order mismatch in frame ${frame.frame}`);
      }
      assert((phoneCss.match(/animation-timing-function:\s*steps\(1, end\);/g) || []).length === 17, 'Each explicit frame must hold as a discrete state');
      assert(phoneCss.includes('image-rendering: pixelated;'), 'Semi-transparent pixel art requires image-rendering: pixelated');
      phoneFramework = {
        fixtureOnly: true, builderIntegrated: false, sourceManifest: 'original-assets/r10-phone-layers/manifest.json',
        layerOrder: 'char-back (back) < glow-dim/bright (middle) < phone-front (front)',
        canvas: { widthCssPx: phoneStyle.canvasWidth, heightCssPx: 22, minimumForTappedPhoneLogicalCells: phoneRequiredCanvasWidth, spareLogicalCells: phoneStyle.canvasWidth - phoneRequiredCanvasWidth },
        panelGeometry: phonePanelMetrics.map((metrics, index) => ({ panelWidth: [320, 240][index], canvasLeft: metrics.panel.after.left, railClearance: metrics.panel.decorationRailGap })),
        embeddedLayers: { pngBytes: phoneAudit.embeddedPngBytes, totalPngBytes: phoneAudit.totalPngBytes, base64PayloadBytes: phoneAudit.totalBase64Bytes, dataUriDeclarationBytes: phoneAudit.dataUriDeclarationBytes, fixtureCssBytes: phoneAudit.generatedCssBytes },
        currentManifestLayers: [
          { name: 'char-back', size: phoneStyle.sizes[0], position: phoneStyle.positions[0] },
          { name: 'phone-front', size: phoneStyle.sizes[1], restPosition: phoneStyle.positions[1], tapPosition: phoneStyle.positions[2] },
          { name: 'glow-dim', size: phoneStyle.sizes[2], position: phoneStyle.positions[3], alphaValues: phoneAudit.alphaValuesByLayer['glow-dim'] },
          { name: 'glow-bright', size: phoneStyle.sizes[3], position: phoneStyle.positions[4], alphaValues: phoneAudit.alphaValuesByLayer['glow-bright'] }
        ],
        imageVariableStatus: phoneStyle.imageVariableStatus,
        animation: { name: phoneStyle.animationName, duration: phoneStyle.animationDuration, timingFunction: phoneStyle.animationTimingFunction, delay: phoneStyle.animationDelay, backgroundLayers: phoneStyle.backgroundLayerCount, keyframes: 1, frameCount: 17, frameIntervalMs: 4000 / 17, phaseSplit: '8+9 frames approximates the existing 2s SOCIAL wave' },
        frameStates: { phoneTap: tapFrames, glowDim: dimFrames, glowBright: brightFrames, sampledFrames: frames }
      };
    } finally {
      await phoneContext.close();
    }

    const { context: phoneReducedContext, page: phoneReducedPage } = await openPage(browser, 1);
    try {
      await phoneReducedPage.emulateMedia({ reducedMotion: 'reduce' });
      await configure(phoneReducedPage, 320, 360);
      const reducedPhoneStyle = await phoneReducedPage.locator('.vrcx-0-side-panel').evaluate((panel) => {
        const s = getComputedStyle(panel, '::after');
        return { animationName: s.animationName, backgroundPosition: s.backgroundPosition, backgroundSize: s.backgroundSize };
      });
      const basePhoneFrame = phoneFramework.frameStates.sampledFrames[0];
      assert(reducedPhoneStyle.animationName === 'none' && reducedPhoneStyle.backgroundPosition === basePhoneFrame.positions.join(', ') && reducedPhoneStyle.backgroundSize === basePhoneFrame.sizes.join(', '), 'prefers-reduced-motion must leave phone/cat layers at the rest frame');
      phoneFramework.reducedMotion = reducedPhoneStyle;
    } finally {
      await phoneReducedContext.close();
    }
    const phoneCaptures = await capturePhoneAuditScreenshots(browser, phoneAudit, phoneFramework.frameStates.sampledFrames[0]);
    files.push(...phoneCaptures.screenshotFiles);
    phoneFramework.screenshots = phoneCaptures.screenshotFiles;
    phoneFramework.contactSheets = phoneCaptures.contactSheets;
    phoneFramework.reviewImages = phoneCaptures.reviewImages;
    phoneFramework.framePixelAudits = phoneCaptures.pixelAudits;
    phoneFramework.tapFramePixelAudits = phoneCaptures.pixelAudits.filter((audit) => audit.tapped);
    phoneFramework.glowFramePixelAudits = phoneCaptures.pixelAudits.filter((audit) => [8, 9, 11, 13].includes(audit.frame));
    phoneFramework.adjacentFramePixelDiffs = phoneCaptures.adjacentFramePixelDiffs;
    phoneFramework.adjacentGlowPixelDiffsAt1x = phoneCaptures.adjacentFramePixelDiffs
      .filter((audit) => audit.dpr === 1)
      .map((audit) => ({ panelWidth: audit.panelWidth, transitions: audit.transitions.filter(({ fromFrame, toFrame }) => [[8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16]].some(([from, to]) => fromFrame === from && toFrame === to)) }));
    phoneFramework.motionModeAudits = phoneCaptures.motionModeAudits;
    const w320Dpr1GlowDiffs = phoneFramework.adjacentGlowPixelDiffsAt1x.find((audit) => audit.panelWidth === 320);
    phoneFramework.glowVisibilityAt1CssPx = {
      assessment: 'dim is weak but discernible; bright is visible yet restrained (not a strong bloom)',
      measurement: 'W320, DPR1, 25x20 CSS-pixel canvas; 1 CSS px per logical cell; screenshot comparisons are unscaled',
      adjacentTransitions: w320Dpr1GlowDiffs.transitions
    };
    phoneFramework.productionRuntimeCssIncrementBytes = 0;

    const { context: effectsContext, page: effectsPage } = await openPage(browser, 1);
    try {
      await effectsPage.emulateMedia({ reducedMotion: 'no-preference' });
      await configure(effectsPage, 320, 360);
      await effectsPage.evaluate(() => document.documentElement.classList.add('reduce-effects'));
      const effectsMetrics = await measure(effectsPage);
      const basePhoneFrame = phoneFramework.frameStates.sampledFrames[0];
      assert(effectsMetrics.panel.after.animationName === 'none' && effectsMetrics.panel.after.backgroundPosition === basePhoneFrame.positions.join(', ') && effectsMetrics.panel.after.backgroundSize === basePhoneFrame.sizes.join(', '), 'html.reduce-effects must leave phone/cat layers at the rest frame');
      await effectsPage.screenshot({ path: path.join(here, 'preview-html-reduce.png'), fullPage: true });
      files.push('preview-html-reduce.png');
    } finally {
      await effectsContext.close();
    }

    const { context: focusContext, page: focusPage } = await openPage(browser, 1);
    let focusTest;
    try {
      await disablePhoneAudit(focusPage);
      await focusPage.emulateMedia({ reducedMotion: 'no-preference' });
      await configure(focusPage, 320, 360);
      await focusPage.keyboard.press('Tab');
      focusTest = await focusPage.locator('[data-slot="toast-close"]').evaluate((button) => {
        const s = getComputedStyle(button);
        const r = button.getBoundingClientRect();
        return { active: document.activeElement === button, outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, rect: { x: r.x, y: r.y, width: r.width, height: r.height } };
      });
      assert(focusTest.active && focusTest.outlineStyle === 'solid' && focusTest.outlineWidth === '2px', 'Toast close keyboard focus treatment changed');
    } finally {
      await focusContext.close();
    }

    const untouched = [];
    const { context: untouchedContext, page: untouchedPage } = await openPage(browser, 1);
    try {
      await disablePhoneAudit(untouchedPage);
      untouched.push(...await untouchedPage.evaluate(() => {
        const portal = document.createElement('div');
        portal.dataset.slot = 'toast-viewport';
        portal.style.cssText = 'position:fixed;left:-10000px;top:0;visibility:hidden;width:360px;';
        document.body.append(portal);
        const results = [];
        for (const type of ['info', 'warning', 'loading']) {
          const root = document.createElement('div');
          root.className = 'fixture-toast';
          root.style.width = '360px';
          root.dataset.type = type;
          root.innerHTML = '<div class="flex min-w-0 flex-1 gap-2"><div data-slot="toast-icon" class="shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&>svg]:h-lh [&>svg]:w-4"><svg class="size-4 in-data-[type=loading]:animate-spin in-data-[type=loading]:opacity-80" width="16" height="16" aria-hidden="true"></svg></div></div>';
          portal.append(root);
          const icon = root.querySelector('[data-slot="toast-icon"]');
          const svg = icon.querySelector('svg');
          const s = getComputedStyle(icon);
          const svgStyle = getComputedStyle(svg);
          results.push({ type, width: icon.getBoundingClientRect().width, height: icon.getBoundingClientRect().height, backgroundImage: s.backgroundImage, imageRendering: s.imageRendering, svgOpacity: svgStyle.opacity, svgAnimation: svgStyle.animationName });
        }
        return results;
      }));
    } finally {
      await untouchedContext.close();
    }
    for (const item of untouched) {
      const expectedOpacity = item.type === 'loading' ? '0.8' : '1';
      const expectedAnimation = item.type === 'loading' ? 'spin' : 'none';
      assert(item.backgroundImage === 'none' && item.width === 16 && item.svgOpacity === expectedOpacity && item.svgAnimation === expectedAnimation, `${item.type}: non-success/error icon changed`);
    }

    const scaleReports = [];
    const dprs = [1, 1.25, 1.5, 2];
    for (const dpr of dprs) {
      const { context, page } = await openPage(browser, dpr);
      try {
        await disablePhoneAudit(page);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await configure(page, 320, 360);
        const result = await measure(page);
        const name = dpr === 1 ? 'preview.png' : `scale-dpr-${String(dpr).replace('.', '-')}.png`;
        if (dpr !== 1) {
          await page.screenshot({ path: path.join(here, name), fullPage: true });
          files.push(name);
        }
        const screenshot = path.join(here, name);
        const meta = await sharp(screenshot).metadata();
        const sourceColors = new Set(['#211a33']);
        const sourceAlphaValues = new Set();
        for (const filename of ['toast-success-heart-happy.png', 'toast-error-awkward-lines.png']) {
          const src = await sharp(path.join(sourceAssets, filename)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
          for (let i = 0; i < src.data.length; i += src.info.channels) {
            sourceAlphaValues.add(src.data[i + 3]);
            if (src.data[i + 3] === 255) sourceColors.add(`#${[src.data[i], src.data[i + 1], src.data[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`);
          }
        }
        assert([...sourceAlphaValues].sort((a, b) => a - b).join(',') === '0,255', 'Toast source PNGs must retain strictly binary alpha');
        const audits = [];
        for (const card of result.cards) {
          const r = card.icon.rect;
          const left = Math.max(0, Math.floor(r.x * dpr));
          const top = Math.max(0, Math.floor(r.y * dpr));
          const right = Math.min(meta.width, Math.ceil(r.right * dpr));
          const bottom = Math.min(meta.height, Math.ceil(r.y * dpr + r.height * dpr));
          const cropped = await sharp(screenshot).extract({ left, top, width: right - left, height: bottom - top }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
          const observed = new Set();
          const unexpected = new Set();
          let unexpectedPixelCount = 0;
          for (let i = 0; i < cropped.data.length; i += cropped.info.channels) {
            const color = `#${[cropped.data[i], cropped.data[i + 1], cropped.data[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
            observed.add(color);
            if (!sourceColors.has(color)) { unexpected.add(color); unexpectedPixelCount++; }
          }
          const unexpectedColors = [...unexpected];
          if (dpr === 1 || dpr === 2) assert(unexpectedColors.length === 0, `DPR ${dpr} ${card.type}: integer-DPR sprite contains non-palette/blur colors: ${unexpectedColors.join(',')}`);
          audits.push({ type: card.type, boxCss: { width: r.width, height: r.height }, cropDevicePixels: { width: cropped.info.width, height: cropped.info.height }, observedColorCount: observed.size, fractionalDprMixedColors: unexpectedColors, mixedColorPixelCount: unexpectedPixelCount });
        }
        const cellWidths = Array.from({ length: 28 }, (_, i) => Math.round((i + 1) * dpr) - Math.round(i * dpr));
        const uniqueCellWidths = [...new Set(cellWidths)].sort((a, b) => a - b);
        if (dpr === 1) assert(uniqueCellWidths.length === 1 && uniqueCellWidths[0] === 1, 'DPR1 logical-cell width is not a clean 1 device pixel');
        if (dpr === 2) assert(uniqueCellWidths.length === 1 && uniqueCellWidths[0] === 2, 'DPR2 logical-cell width is not a clean 2 device pixels');
        if (dpr === 1.25 || dpr === 1.5) assert(uniqueCellWidths.length === 2, `DPR${dpr}: expected uneven 1/2 device-pixel logical cells`);
        scaleReports.push({ dpr, screenshot: name, screenshotPixels: { width: meta.width, height: meta.height }, expectedCssLogicalCellDevicePixels: dpr, observedLogicalCellDeviceWidths: uniqueCellWidths, unevenGridExpected: dpr === 1.25 || dpr === 1.5, sourceAlphaValues: [...sourceAlphaValues].sort((a, b) => a - b), imageRendering: result.cards.map((card) => card.icon.imageRendering), colorAudit: audits });
      } finally {
        await context.close();
      }
    }

    let buildDetails = null;
    if (process.argv.includes('--build-report')) {
      const buildReport = JSON.parse(await readFile(path.join(themeRoot, 'runtime/build-report.json'), 'utf8'));
      const builtCss = await readFile(path.join(themeRoot, 'runtime/preview-package/jirai-kei-theme/theme.css'), 'utf8');
      const phonePayloads = [...phoneCss.matchAll(/url\(\"data:image\/png;base64,([^\"]+)\"\)/g)].map((match) => match[1]);
      const statusSection = buildReport.sections.find((section) => section.name === 'status-icons-r10');
      assert(buildReport.cssBytes < 1048576 && Buffer.byteLength(builtCss) === buildReport.cssBytes, 'Built theme CSS exceeds/mismatches the 1 MiB report');
      assert(buildReport.previewBytes <= 262144, 'Built preview.webp exceeds 256 KiB');
      assert(statusSection?.bytes === Buffer.byteLength(css), 'Built status-icons-r10 section byte count mismatch');
      assert(builtCss.split('/* SECTION status-icons-r10 */').length - 1 === 1, 'Built theme CSS must include the R10 section exactly once');
      assert(buildReport.previewSource === path.join(here, 'preview.png'), 'Build report preview source is not the final R10 fixture');
      assert(!builtCss.includes('r10-social-phone-layers') && !builtCss.includes('--r10-phone-char-back-image') && !buildReport.sections.some((section) => section.name === 'social-phone-layers-audit') && phonePayloads.length === 4 && phonePayloads.every((payload) => !builtCss.includes(payload)), 'Fixture-only phone CSS or PNG payload leaked into builder output');
      buildDetails = { cssBytes: buildReport.cssBytes, cssLimitBytes: buildReport.limit, statusSectionBytes: statusSection.bytes, previewBytes: buildReport.previewBytes, previewLimitBytes: 262144, previewSource: buildReport.previewSource, phoneFixtureCssBytes: phoneAudit.generatedCssBytes, phoneDataUriDeclarationBytes: phoneAudit.dataUriDeclarationBytes, phoneRuntimeCssIncrementBytes: 0, phoneFixtureIntegrated: false, output: buildReport.output };
    }
    const report = {
      result: 'PASS',
      cssBytes: Buffer.byteLength(css),
      dataUris: { embeddedPngs: (css.match(/data:image\/png;base64,/g) || []).length, embeddedSvgs: (css.match(/data:image\/svg\+xml/g) || []).length },
      selectors: ['[data-slot="toast-viewport"] [data-type="success"] [data-slot="toast-icon"]', '[data-slot="toast-viewport"] [data-type="error"] [data-slot="toast-icon"]'],
      toastMotion: 'static; no icon animation declarations',
      iconSlot: '28×24 CSS px (1 logical grid cell = 1 CSS px)',
      textMove: '12px (icon width 16px → 28px; existing gap retained)',
      untouchedTypes: untouched,
      focusTest,
      layoutChanges,
      layoutResults,
      scaleReports,
      phoneFramework,
      build: buildDetails,
      images: files,
      phone: 'fixture-only: all four manifest PNG layers are embedded and captured; glow uses translucent alpha with off-canvas position toggles; no phone CSS is integrated in runtime/builder',
      notes: ['Toast PNG sources have only alpha 0/255; image-rendering:pixelated is set. DPR 1 and 2 map each logical cell to a uniform integer device-pixel width and retain only source/surface palette colors.', 'DPR 1.25 and 1.5 have the expected uneven 1/2-device-pixel logical-cell widths and subpixel mixed-color pixels; counts are reported, not hidden. Phone audit images are fixture-only and excluded from the builder.']
    };
    await writeFile(path.join(here, 'layout-report.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
  }
} finally {
  await browser.close();
}
