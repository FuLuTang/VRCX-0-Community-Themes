/* Historical audit renderer only: 17-frame SOCIAL fixture, not the current 153-frame nav-phone animation. */
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire('/tmp/dsh-theme-tools/package.json');
const sharp = require('sharp');
const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureUrl = `file://${path.join(here, 'fixture.html')}`;
const viewport = { width: 1440, height: 900 };
const expectedPanelWidth = 320;
const cssFrameHeight = 28;
const characterCropWidth = 25;
const characterCropHeight = 20;
const characterScale = 16;
const logicalDurationMs = 4000;
const frameCount = 17;
const expectedReport = JSON.parse(await readFile(path.join(here, 'layout-report.json'), 'utf8'));
const eyeHighlightReview = JSON.parse(await readFile(path.join(here, 'eye-highlight-preview-report.json'), 'utf8'));
const css = await readFile(path.join(here, 'social-phone-layers-audit.css'), 'utf8');
const expectedStates = expectedReport.phoneFramework.frameStates.sampledFrames;

function assert(condition, message) { if (!condition) throw new Error(message); }
assert(expectedReport.result === 'PASS', 'Existing layout-report.json is not PASS');
assert(expectedReport.phoneFramework.animation.frameCount === frameCount, 'Expected CSS frame count is not 17');
assert(expectedReport.phoneFramework.animation.duration === '4s', 'CSS animation duration is not 4s');
assert(expectedReport.phoneFramework.animation.delay === '-2s', 'CSS animation phase delay is not -2s');
assert(css.includes('animation: r10-social-phone-layers 4s steps(17, end) -2s infinite;'), 'Fixture CSS no longer has the expected 4s steps(17,end) infinite animation');
assert(expectedStates.length === frameCount, 'Recorded frame-state table is not 17 frames');

const webpDurations = Array.from({ length: frameCount }, (_, i) => Math.round((i + 1) * logicalDurationMs / frameCount) - Math.round(i * logicalDurationMs / frameCount));
const gifDurations = [];
let longFrameAccumulator = 0;
for (let i = 0; i < frameCount; i++) {
  longFrameAccumulator += 9;
  if (longFrameAccumulator >= frameCount) { gifDurations.push(240); longFrameAccumulator -= frameCount; }
  else gifDurations.push(230);
}
assert(webpDurations.reduce((sum, ms) => sum + ms, 0) === logicalDurationMs, 'WebP frame delays do not sum to 4s');
assert(gifDurations.reduce((sum, ms) => sum + ms, 0) === logicalDurationMs, 'GIF frame delays do not sum to 4s');

async function captureFrames(deviceScaleFactor) {
  const context = await browser.newContext({ viewport, deviceScaleFactor });
  const page = await context.newPage();
  try {
    await page.goto(fixtureUrl);
    await page.evaluate(() => document.fonts.ready);
    const panel = await page.locator('.vrcx-0-side-panel').evaluate((element) => {
      const r = element.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    assert(panel.width === expectedPanelWidth, `Expected W320 panel, got ${panel.width}px`);
    const clip = { x: panel.x, y: panel.y, width: expectedPanelWidth, height: cssFrameHeight };
    // Anchor once to the pseudo-element canvas top-left (the fixed right:88px 68×22px canvas).
    // This CSS-pixel clip never follows the character or its one-cell phone tap shift.
    const canvasAnchor = await page.locator('.vrcx-0-side-panel').evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const panelStyle = getComputedStyle(element);
      const after = getComputedStyle(element, '::after');
      const x = (parseFloat(panelStyle.borderLeftWidth) || 0) + element.clientWidth - parseFloat(after.right) - parseFloat(after.width);
      const y = (parseFloat(panelStyle.borderTopWidth) || 0) + (parseFloat(after.top) || 0);
      return { screenX: rect.x + x, screenY: rect.y + y };
    });
    const characterClip = { x: canvasAnchor.screenX, y: canvasAnchor.screenY, width: characterCropWidth, height: characterCropHeight };
    const frames = [];
    const characterFrames = [];
    const frameTable = [];
    for (const expected of expectedStates) {
      const state = await page.locator('.vrcx-0-side-panel').evaluate((element, frame) => {
        const animation = document.getAnimations().find((candidate) => candidate.animationName === 'r10-social-phone-layers');
        if (!animation) throw new Error('r10-social-phone-layers animation not found');
        animation.pause();
        animation.effect.updateTiming({ delay: 0 });
        animation.currentTime = (frame - 0.5) * 4000 / 17;
        const style = getComputedStyle(element, '::after');
        return {
          frame,
          positions: style.backgroundPosition.split(/,\s*/),
          sizes: style.backgroundSize.split(/,\s*/)
        };
      }, expected.frame);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert(JSON.stringify(state.positions) === JSON.stringify(expected.positions), `Frame ${expected.frame} background positions differ from fixture table`);
      assert(JSON.stringify(state.sizes) === JSON.stringify(expected.sizes), `Frame ${expected.frame} background sizes differ from fixture table`);
      const png = await page.screenshot({ clip });
      const metadata = await sharp(png).metadata();
      assert(metadata.width === expectedPanelWidth * deviceScaleFactor && metadata.height === cssFrameHeight * deviceScaleFactor,
        `DPR${deviceScaleFactor} frame ${expected.frame} screenshot has unexpected dimensions ${metadata.width}x${metadata.height}`);
      frames.push(png);
      const characterPng = await page.screenshot({ clip: characterClip });
      const characterMetadata = await sharp(characterPng).metadata();
      assert(characterMetadata.width === characterCropWidth * deviceScaleFactor && characterMetadata.height === characterCropHeight * deviceScaleFactor,
        `DPR${deviceScaleFactor} character crop F${String(expected.frame).padStart(2, '0')} has unexpected dimensions ${characterMetadata.width}x${characterMetadata.height}`);
      characterFrames.push(characterPng);
      frameTable.push({ frame: expected.frame, positions: state.positions, sizes: state.sizes });
    }
    const first = await sharp(frames[0]).raw().toBuffer();
    const last = await sharp(frames.at(-1)).raw().toBuffer();
    assert(first.equals(last), `DPR${deviceScaleFactor} loop seam: F01 and F17 pixels differ`);
    const characterFirst = await sharp(characterFrames[0]).ensureAlpha().raw().toBuffer();
    const characterLast = await sharp(characterFrames.at(-1)).ensureAlpha().raw().toBuffer();
    assert(characterFirst.equals(characterLast), `DPR${deviceScaleFactor} fixed character-crop loop seam: F01 and F17 differ`);
    const characterFrameRaw = [];
    for (const frame of characterFrames) characterFrameRaw.push(await sharp(frame).ensureAlpha().raw().toBuffer());
    const characterKeyDeltas = [
      { transition: 'F01->F03 phone tap', ...frameDelta(characterFrameRaw[0], characterFrameRaw[2]) },
      { transition: 'F01->F05 phone tap', ...frameDelta(characterFrameRaw[0], characterFrameRaw[4]) },
      { transition: 'F09 dim->F11 bright', ...frameDelta(characterFrameRaw[8], characterFrameRaw[10]) },
      { transition: 'F11 bright->F13 rest', ...frameDelta(characterFrameRaw[10], characterFrameRaw[12]) },
      { transition: 'F01 rest->F13 rest', ...frameDelta(characterFrameRaw[0], characterFrameRaw[12]) }
    ];
    for (const key of characterKeyDeltas.slice(0, 4)) assert(key.changedPixels > 0, `Fixed character crop does not visibly change at ${key.transition}`);
    assert(characterKeyDeltas[4].changedPixels === 0, 'F13 does not return to the F01 resting character state');
    const adjacentChanges = [];
    for (let i = 0; i < frameCount - 1; i++) {
      const a = await sharp(frames[i]).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const b = await sharp(frames[i + 1]).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      let changed = 0;
      for (let p = 0; p < a.data.length; p += a.info.channels) {
        if (a.data[p] !== b.data[p] || a.data[p + 1] !== b.data[p + 1] || a.data[p + 2] !== b.data[p + 2]) changed++;
      }
      adjacentChanges.push({ from: i + 1, to: i + 2, changedPixels: changed });
      assert(changed > 0, `DPR${deviceScaleFactor} adjacent CSS frame ${i + 1}->${i + 2} is identical; animation frame may be skipped`);
    }
    return { frames, characterFrames, frameTable, adjacentChanges, characterKeyDeltas, characterFixedCropCss: { x: 0, y: 0, width: characterCropWidth, height: characterCropHeight, anchor: 'pseudo-element canvas top-left, measured once and held fixed across all frames' }, sourceLoopSeamEqual: true, width: expectedPanelWidth * deviceScaleFactor, height: cssFrameHeight * deviceScaleFactor, dpr: deviceScaleFactor };
  } finally {
    await context.close();
  }
}

function frameDelta(a, b) {
  let changedPixels = 0;
  let sum = 0;
  let max = 0;
  for (let i = 0; i < a.length; i += 4) {
    let pixelChanged = false;
    for (let c = 0; c < 3; c++) {
      const delta = Math.abs(a[i + c] - b[i + c]);
      sum += delta;
      if (delta) pixelChanged = true;
      if (delta > max) max = delta;
    }
    if (pixelChanged) changedPixels++;
  }
  return { changedPixels, meanAbsRgbDelta: Number((sum / (a.length / 4 * 3)).toFixed(4)), maxChannelDelta: max };
}
async function countDistinctRgb(frames) {
  const colors = new Set();
  for (const frame of frames) {
    const { data, info } = await sharp(frame).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += info.channels) colors.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
  }
  return colors.size;
}
function riffChunk(tag, payload) {
  const header = Buffer.alloc(8);
  header.write(tag, 0, 4, 'ascii');
  header.writeUInt32LE(payload.length, 4);
  return Buffer.concat([header, payload, ...(payload.length % 2 ? [Buffer.from([0])] : [])]);
}
function put24le(buffer, offset, value) {
  assert(value >= 0 && value <= 0xffffff, `WebP 24-bit value out of range: ${value}`);
  buffer[offset] = value & 255;
  buffer[offset + 1] = (value >> 8) & 255;
  buffer[offset + 2] = (value >> 16) & 255;
}
function staticWebpImageChunks(bytes) {
  assert(bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP', 'Static WebP frame has invalid RIFF/WEBP signature');
  const end = Math.min(bytes.length, 8 + bytes.readUInt32LE(4));
  const chunks = [];
  let offset = 12;
  while (offset + 8 <= end) {
    const tag = bytes.toString('ascii', offset, offset + 4);
    const length = bytes.readUInt32LE(offset + 4);
    const payloadStart = offset + 8;
    const payloadEnd = payloadStart + length;
    assert(payloadEnd <= end, `Truncated ${tag} WebP chunk`);
    if (tag !== 'VP8X') chunks.push(riffChunk(tag, bytes.subarray(payloadStart, payloadEnd)));
    offset = payloadEnd + (length & 1);
  }
  assert(chunks.some((chunk) => ['VP8L', 'VP8 ', 'ALPH'].includes(chunk.toString('ascii', 0, 4))), 'Static WebP frame has no image bitstream chunks');
  return Buffer.concat(chunks);
}
async function muxAnimatedWebp(frames, delays, loopCount = 0) {
  assert(frames.length === frameCount && delays.length === frameCount, 'Manual WebP mux requires exactly 17 frames/delays');
  const meta = await sharp(frames[0]).metadata();
  const width = meta.width;
  const height = meta.height;
  const chunks = [];
  const vp8x = Buffer.alloc(10);
  vp8x[0] = 0x02; // animation feature flag; frames are opaque RGB VP8L bitstreams
  put24le(vp8x, 4, width - 1);
  put24le(vp8x, 7, height - 1);
  chunks.push(riffChunk('VP8X', vp8x));
  const anim = Buffer.alloc(6);
  anim.writeUInt32LE(0, 0); // transparent BGRA canvas background; every frame is full-canvas
  anim.writeUInt16LE(loopCount, 4);
  chunks.push(riffChunk('ANIM', anim));
  for (let i = 0; i < frames.length; i++) {
    const pageMeta = await sharp(frames[i]).metadata();
    assert(pageMeta.width === width && pageMeta.height === height, `WebP frame ${i + 1} dimensions changed`);
    const staticWebp = await sharp(frames[i]).removeAlpha().webp({ lossless: true, exact: true, effort: 6 }).toBuffer();
    const subchunks = staticWebpImageChunks(staticWebp);
    const frameHeader = Buffer.alloc(16);
    put24le(frameHeader, 0, 0); // x / 2
    put24le(frameHeader, 3, 0); // y / 2
    put24le(frameHeader, 6, width - 1);
    put24le(frameHeader, 9, height - 1);
    put24le(frameHeader, 12, delays[i]);
    frameHeader[15] = 0x02; // no-blend full-frame replacement; preserve each repeated frame page
    chunks.push(riffChunk('ANMF', Buffer.concat([frameHeader, subchunks])));
  }
  const body = Buffer.concat([Buffer.from('WEBP', 'ascii'), ...chunks]);
  const riff = Buffer.alloc(8);
  riff.write('RIFF', 0, 4, 'ascii');
  riff.writeUInt32LE(body.length, 4);
  return Buffer.concat([riff, body]);
}
async function validateAnimation(buffer, sourceFrames, expectedWidth, expectedHeight, durations, format, requireExact = false) {
  const meta = await sharp(buffer, { animated: true }).metadata();
  assert(meta.format === format, `Expected ${format}, got ${meta.format}`);
  assert(meta.pages === frameCount && meta.pageHeight === expectedHeight && meta.width === expectedWidth,
    `${format} metadata frame geometry mismatch: ${JSON.stringify({ pages: meta.pages, width: meta.width, height: meta.height, pageHeight: meta.pageHeight })}`);
  assert(meta.loop === 0, `${format} does not loop infinitely (loop=${meta.loop})`);
  assert(JSON.stringify(meta.delay) === JSON.stringify(durations), `${format} delays differ: ${JSON.stringify(meta.delay)}`);
  assert(meta.delay.length === frameCount && meta.delay.reduce((sum, ms) => sum + ms, 0) === logicalDurationMs, `${format} total duration is not 4000ms`);
  const decoded = await sharp(buffer, { animated: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert(decoded.info.width === expectedWidth && decoded.info.height === expectedHeight * frameCount, `${format} decoded stack has unexpected dimensions`);
  const pageBytes = expectedWidth * expectedHeight * decoded.info.channels;
  const frameChecks = [];
  const decodedFrames = [];
  for (let index = 0; index < frameCount; index++) {
    const actual = decoded.data.subarray(index * pageBytes, (index + 1) * pageBytes);
    decodedFrames.push(Buffer.from(actual));
    const source = await sharp(sourceFrames[index]).ensureAlpha().raw().toBuffer();
    const delta = frameDelta(actual, source);
    frameChecks.push({ frame: index + 1, ...delta, exact: delta.maxChannelDelta === 0 });
  }
  const seam = frameDelta(decodedFrames[0], decodedFrames.at(-1));
  assert(seam.maxChannelDelta === 0, `${format} encoded first/last frames do not join seamlessly`);
  const exact = frameChecks.every((frame) => frame.exact);
  if (format === 'webp' || requireExact) assert(exact, `${format} has a frame that does not exactly match the source fixture capture`);
  else assert(Math.max(...frameChecks.map((frame) => frame.meanAbsRgbDelta)) <= 8, 'GIF palette error is too large to verify frame identity');
  return {
    width: meta.width, frameHeight: meta.pageHeight, pages: meta.pages, totalStackHeight: meta.height,
    loop: meta.loop, delaysMs: meta.delay, cycleDurationMs: meta.delay.reduce((sum, ms) => sum + ms, 0),
    frameChecks, seam, exactFramePixels: exact
  };
}
async function upscaleFrames(frames, scale) {
  const output = [];
  for (const frame of frames) {
    const meta = await sharp(frame).metadata();
    output.push(await sharp(frame).resize(meta.width * scale, meta.height * scale, { kernel: 'nearest' }).png().toBuffer());
  }
  return output;
}
async function writeCharacterKeyframes(frames) {
  const selections = [
    { frame: 1, label: 'F01 REST' }, { frame: 3, label: 'F03 TAP' }, { frame: 5, label: 'F05 TAP' },
    { frame: 9, label: 'F09 DIM' }, { frame: 11, label: 'F11 BRIGHT' }, { frame: 13, label: 'F13 REST' }
  ];
  const cellWidth = characterCropWidth * characterScale;
  const imageHeight = characterCropHeight * characterScale;
  const labelHeight = 24;
  const cellHeight = imageHeight + labelHeight;
  const columns = 3;
  const gap = 12;
  const rows = 2;
  const width = columns * cellWidth + (columns - 1) * gap;
  const height = rows * cellHeight + (rows - 1) * gap;
  const composites = [];
  for (let i = 0; i < selections.length; i++) {
    const item = selections[i];
    const zoom = await sharp(frames[item.frame - 1]).resize(cellWidth, imageHeight, { kernel: 'nearest' }).png().toBuffer();
    const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cellWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#211a33"/><text x="6" y="17" fill="#ffe4f2" font-family="monospace" font-size="13">${item.label}</text></svg>`);
    const tile = await sharp({ create: { width: cellWidth, height: cellHeight, channels: 4, background: '#211a33' } })
      .composite([{ input: label, left: 0, top: 0 }, { input: zoom, left: 0, top: labelHeight }]).png().toBuffer();
    composites.push({ input: tile, left: (i % columns) * (cellWidth + gap), top: Math.floor(i / columns) * (cellHeight + gap) });
  }
  const png = await sharp({ create: { width, height, channels: 4, background: '#211a33' } }).composite(composites).png().toBuffer();
  const filename = 'social-phone-loop-char-keyframes-16x.png';
  await writeFile(path.join(here, filename), png);
  return { file: filename, width, height, bytes: png.length, frames: selections.map((item) => item.frame), scale: characterScale };
}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const dpr1 = await captureFrames(1);
  const dpr2 = await captureFrames(2);
  const frames4x = await upscaleFrames(dpr2.frames, 4);
  const characterFrames16x = await upscaleFrames(dpr1.characterFrames, characterScale);
  const characterDistinctRgbColors = await countDistinctRgb(characterFrames16x);
  assert(characterDistinctRgbColors <= 256, `Character loop needs ${characterDistinctRgbColors} RGB colors; 256-color GIF palette would quantize it`);
  const characterKeyframeSheet = await writeCharacterKeyframes(dpr1.characterFrames);
  const sources = [
    { name: 'social-phone-loop-w320.webp', frames: dpr1.frames, delays: webpDurations, format: 'webp', options: { lossless: true, effort: 6, exact: true } },
    { name: 'social-phone-loop-w320.gif', frames: dpr1.frames, delays: gifDurations, format: 'gif', options: { effort: 10, colors: 256, dither: 0, keepDuplicateFrames: true } },
    { name: 'social-phone-loop-4x.webp', frames: frames4x, delays: webpDurations, format: 'webp', options: { lossless: true, effort: 6, exact: true } },
    { name: 'social-phone-loop-char-16x.webp', frames: characterFrames16x, delays: webpDurations, format: 'webp', requireExact: true, fixedCrop: dpr1.characterFixedCropCss, muxWebp: true, options: { lossless: true, effort: 6, exact: true } },
    { name: 'social-phone-loop-char-16x.gif', frames: characterFrames16x, delays: gifDurations, format: 'gif', requireExact: true, fixedCrop: dpr1.characterFixedCropCss, options: { effort: 10, colors: 256, dither: 0, interFrameMaxError: 0, interPaletteMaxError: 0, keepDuplicateFrames: true } }
  ];
  const artifactReport = {};
  for (const artifact of sources) {
    const output = artifact.muxWebp
      ? await muxAnimatedWebp(artifact.frames, artifact.delays, 0)
      : await sharp(artifact.frames, { join: { animated: true } })[artifact.format]({ loop: 0, delay: artifact.delays, ...artifact.options }).toBuffer();
    const filename = path.join(here, artifact.name);
    await writeFile(filename, output);
    const sampleMeta = await sharp(artifact.frames[0]).metadata();
    const verified = await validateAnimation(output, artifact.frames, sampleMeta.width, sampleMeta.height, artifact.delays, artifact.format, artifact.requireExact ?? false);
    artifactReport[artifact.name] = { bytes: output.length, format: artifact.format, sourceFrameSize: `${sampleMeta.width}x${sampleMeta.height}`, ...(artifact.fixedCrop ? { fixedCrop: artifact.fixedCrop } : {}), ...verified };
  }
  const report = {
    result: 'PASS',
    fixture: 'Current c1 phone layers including adopted H1 dim highlight embedded in the fixture; phone CSS remains fixture-only and is not integrated in the runtime builder.',
    panel: { cssWidth: expectedPanelWidth, headerCssHeight: cssFrameHeight, dpr1Frame: `${dpr1.width}x${dpr1.height}`, dpr2Frame: `${dpr2.width}x${dpr2.height}` },
    cssAnimation: { name: 'r10-social-phone-layers', declaration: '4s steps(17, end) -2s infinite', frameCount, cycleDurationMs: logicalDurationMs, idealFrameMs: logicalDurationMs / frameCount, frameTable: dpr1.frameTable, frameTableMatchesFixtureAtDpr1And2: true, sourceLoopSeamEqualByDpr: { dpr1: dpr1.sourceLoopSeamEqual, dpr2: dpr2.sourceLoopSeamEqual }, adjacentChangesByDpr: { dpr1: dpr1.adjacentChanges, dpr2: dpr2.adjacentChanges } },
    timing: { webpMs: webpDurations, webpTotalMs: webpDurations.reduce((sum, ms) => sum + ms, 0), gifMs: gifDurations, gifTotalMs: gifDurations.reduce((sum, ms) => sum + ms, 0), gifCentisecondQuantizationNote: 'GIF uses the nearest 10ms schedule, distributed across frames to preserve a 4000ms loop.' },
    characterAnimation: { fixedCrop: dpr1.characterFixedCropCss, sourceDpr: 1, nearestScale: characterScale, outputFrameSize: `${characterCropWidth * characterScale}x${characterCropHeight * characterScale}`, sourceDistinctRgbColorCount: characterDistinctRgbColors, gifPalette: { paletteLimit: 256, noColorReductionNeeded: characterDistinctRgbColors <= 256, decodedFramesPixelExact: artifactReport['social-phone-loop-char-16x.gif'].exactFramePixels }, keyframeSequence: [1, 3, 5, 9, 11, 13], keyframePixelChecks: dpr1.characterKeyDeltas, staticReviewImage: characterKeyframeSheet },
    eyeHighlightReview: { report: 'eye-highlight-preview-report.json', status: 'historical pre-adoption candidate comparison', selectedCandidate: 'H1', adoptedMainAlphaByLayer: { dim: 128, bright: 255 }, candidates: eyeHighlightReview.candidates, measuredScreenCellColors: eyeHighlightReview.measuredScreenCellColors, images: eyeHighlightReview.images },
    artifacts: artifactReport
  };
  await writeFile(path.join(here, 'loop-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
