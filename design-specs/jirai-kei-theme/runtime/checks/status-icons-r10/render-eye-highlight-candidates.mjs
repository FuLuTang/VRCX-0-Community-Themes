import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire('/tmp/dsh-theme-tools/package.json');
const sharp = require('sharp');
const here = path.dirname(fileURLToPath(import.meta.url));
const themeRoot = path.resolve(here, '../../..');
const assetDir = path.join(themeRoot, 'original-assets/r10-phone-layers');
const fixtureUrl = `file://${path.join(here, 'fixture.html')}`;
const viewport = { width: 1440, height: 900 };
const manifest = JSON.parse(await readFile(path.join(assetDir, 'manifest.json'), 'utf8'));
const dimMeta = manifest.layers['glow-dim'];
const brightMeta = manifest.layers['glow-bright'];
const dimBytes = await readFile(path.join(assetDir, dimMeta.file));
const brightBytes = await readFile(path.join(assetDir, brightMeta.file));
const highlightedCells = [[9, 12], [14, 12]];

async function withEyeAlpha(source, alpha) {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const [x, y] of highlightedCells) {
    const px = x - dimMeta.bboxOffset.x;
    const py = y - dimMeta.bboxOffset.y;
    data[(py * info.width + px) * info.channels + 3] = alpha;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).png().toBuffer();
}
function dataUri(bytes) { return `url("data:image/png;base64,${bytes.toString('base64')}")`; }
async function setFrame(page, frame) {
  await page.locator('.vrcx-0-side-panel').evaluate((panel, frameNumber) => {
    const animation = document.getAnimations().find((candidate) => candidate.animationName === 'r10-social-phone-layers');
    if (!animation) throw new Error('r10-social-phone-layers animation not found');
    animation.pause();
    animation.effect.updateTiming({ delay: 0 });
    animation.currentTime = (frameNumber - 0.5) * 4000 / 17;
  }, frame);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function canvasClip(page) {
  return page.locator('.vrcx-0-side-panel').evaluate((panel) => {
    const r = panel.getBoundingClientRect();
    const panelStyle = getComputedStyle(panel);
    const after = getComputedStyle(panel, '::after');
    const x = (parseFloat(panelStyle.borderLeftWidth) || 0) + panel.clientWidth - parseFloat(after.right) - parseFloat(after.width);
    const y = (parseFloat(panelStyle.borderTopWidth) || 0) + (parseFloat(after.top) || 0);
    return { x: r.x + x, y: r.y + y, width: 25, height: 20 };
  });
}
async function capturePair(browser, candidateBytes) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(fixtureUrl);
  await page.evaluate(() => document.fonts.ready);
  if (candidateBytes) {
    await page.evaluate((uri) => document.documentElement.style.setProperty('--r10-phone-glow-dim-image', uri), dataUri(candidateBytes));
  }
  const clip = await canvasClip(page);
  await setFrame(page, 9);
  const dim = await page.screenshot({ clip });
  await setFrame(page, 11);
  const bright = await page.screenshot({ clip });
  await context.close();
  return { dim, bright };
}
async function labelledTile(source, label, options = {}) {
  const scale = options.scale ?? 8;
  const sourcePipeline = options.extract ? sharp(source).extract(options.extract) : sharp(source);
  const tileSource = await sourcePipeline.png().toBuffer();
  const meta = await sharp(tileSource).metadata();
  const width = meta.width * scale;
  const imageHeight = meta.height * scale;
  const labelHeight = 24;
  const zoom = await sharp(tileSource).resize(width, imageHeight, { kernel: 'nearest' }).png().toBuffer();
  const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${labelHeight}"><rect width="100%" height="100%" fill="#211a33"/><text x="5" y="17" fill="#ffe4f2" font-family="monospace" font-size="13">${label}</text></svg>`);
  const buffer = await sharp({ create: { width, height: labelHeight + imageHeight, channels: 4, background: '#211a33' } }).composite([{ input: text, left: 0, top: 0 }, { input: zoom, left: 0, top: labelHeight }]).png().toBuffer();
  return { buffer, width, height: labelHeight + imageHeight };
}
async function writeStrip(entries, file) {
  const tiles = [];
  for (const entry of entries) tiles.push(await labelledTile(entry.png, entry.label, entry));
  const gap = 12;
  const width = tiles.reduce((sum, tile) => sum + tile.width, 0) + gap * (tiles.length - 1);
  const height = Math.max(...tiles.map((tile) => tile.height));
  const composite = [];
  let left = 0;
  for (const tile of tiles) { composite.push({ input: tile.buffer, left, top: 0 }); left += tile.width + gap; }
  const result = await sharp({ create: { width, height, channels: 4, background: '#211a33' } }).composite(composite).png().toBuffer();
  await writeFile(path.join(here, file), result);
  return { file, width, height, bytes: result.length };
}
async function sampleCell(png, x, y) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const i = (y * info.width + x) * info.channels;
  return { rgba: [...data.subarray(i, i + 4)], hex: `#${[data[i], data[i + 1], data[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('')}` };
}

const candidates = [
  { id: 'current', alpha: 255, buffer: null },
  { id: 'h1', alpha: 128, buffer: await withEyeAlpha(dimBytes, 128) },
  { id: 'h2', alpha: 96, buffer: await withEyeAlpha(dimBytes, 96) }
];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const captures = {};
  for (const candidate of candidates) captures[candidate.id] = await capturePair(browser, candidate.buffer);
  const h1 = await writeStrip([
    { png: captures.h1.dim, label: 'DIM H1 alpha128' },
    { png: captures.h1.bright, label: 'BRIGHT alpha255' }
  ], 'eye-highlight-h1-8x.png');
  const h2 = await writeStrip([
    { png: captures.h2.dim, label: 'DIM H2 alpha96' },
    { png: captures.h2.bright, label: 'BRIGHT alpha255' }
  ], 'eye-highlight-h2-8x.png');
  const compare = await writeStrip([
    { png: captures.current.dim, label: 'CURRENT DIM alpha255' },
    { png: captures.current.bright, label: 'BRIGHT alpha255' },
    { png: captures.h1.dim, label: 'H1 DIM alpha128' },
    { png: captures.h1.bright, label: 'BRIGHT alpha255' },
    { png: captures.h2.dim, label: 'H2 DIM alpha96' },
    { png: captures.h2.bright, label: 'BRIGHT alpha255' }
  ], 'eye-highlight-compare-8x.png');
  const face = await writeStrip([
    { png: captures.current.dim, label: 'CUR DIM a255', extract: { left: 6, top: 10, width: 11, height: 7 }, scale: 16 },
    { png: captures.current.bright, label: 'CUR BRIGHT a255', extract: { left: 6, top: 10, width: 11, height: 7 }, scale: 16 },
    { png: captures.h1.dim, label: 'H1 DIM a128', extract: { left: 6, top: 10, width: 11, height: 7 }, scale: 16 },
    { png: captures.h1.bright, label: 'H1 BRIGHT a255', extract: { left: 6, top: 10, width: 11, height: 7 }, scale: 16 },
    { png: captures.h2.dim, label: 'H2 DIM a96', extract: { left: 6, top: 10, width: 11, height: 7 }, scale: 16 },
    { png: captures.h2.bright, label: 'H2 BRIGHT a255', extract: { left: 6, top: 10, width: 11, height: 7 }, scale: 16 }
  ], 'eye-highlight-face-16x.png');
  const cellSamples = {};
  for (const candidate of candidates) {
    cellSamples[candidate.id] = { dim: {}, bright: {} };
    for (const [x, y] of highlightedCells) {
      const key = `${x},${y}`;
      cellSamples[candidate.id].dim[key] = await sampleCell(captures[candidate.id].dim, x, y);
      cellSamples[candidate.id].bright[key] = await sampleCell(captures[candidate.id].bright, x, y);
    }
  }
  const report = {
    result: 'PASS',
    method: 'Actual W320 fixture; capture F09 dim and F11 bright at DPR1, 25x20 CSS-pixel character crop, nearest-neighbour 8x enlargement.',
    highlightCells: highlightedCells,
    candidates: { currentDimAlpha: 255, h1DimAlpha: 128, h2DimAlpha: 96, brightAlpha: 255, color: '#f8fcff' },
    measuredScreenCellColors: cellSamples,
    images: [h1, h2, compare, face]
  };
  await writeFile(path.join(here, 'eye-highlight-preview-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
