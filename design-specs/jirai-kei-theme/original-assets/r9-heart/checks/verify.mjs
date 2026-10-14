/* Reproducible visual/geometry/contrast check; all output stays under original-assets/r9-heart/checks. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const checksDir = path.dirname(fileURLToPath(import.meta.url));
const assetDir = path.dirname(checksDir);
const sourceDir = path.resolve(assetDir, '..');
const files = {
  '9': path.join(assetDir, 'heart-9x9.svg'),
  '7': path.join(assetDir, 'heart-7x7.svg'),
  '5': path.join(assetDir, 'heart-5x5.svg')
};
const oldPath = path.join(sourceDir, 'src/s7-heart-12x12.svg');
const r5HeartPath = path.join(sourceDir, 'r5/src/heart.svg');
const palette = { outline: '#34316a', body: '#ffb8e6', highlight: '#fdf4ff' };
const titlebar = '#d97fc6';
const dark = '#201936';
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const read = (file) => fs.readFile(file, 'utf8');
const colors = new Set(Object.values(palette));

function parseGrid(svg, expectedSize) {
  const header = svg.match(/<svg\b[^>]*width="(\d+)"[^>]*height="(\d+)"[^>]*viewBox="0 0 (\d+) (\d+)"[^>]*>/);
  assert(header, `Missing explicit square SVG grid (${expectedSize}x${expectedSize})`);
  assert(header.slice(1).every((value) => Number(value) === expectedSize), `Unexpected SVG dimensions: ${header.slice(1).join(',')}`);
  assert(svg.includes('shape-rendering="crispEdges"'), `${expectedSize}x${expectedSize} must request crisp edges`);
  assert(!/<(?:path|polygon|polyline|circle|ellipse|linearGradient|filter)\b/.test(svg), 'Pixel heart must use only rect cells, not a scaled path/effect');
  const cells = new Map();
  for (const group of svg.matchAll(/<g\s+fill="(#[0-9a-fA-F]{6})">([\s\S]*?)<\/g>/g)) {
    const color = group[1].toLowerCase();
    assert(colors.has(color), `Unexpected heart color ${color}`);
    for (const rect of group[2].matchAll(/<rect\s+([^>]+)\/>/g)) {
      const attrs = Object.fromEntries([...rect[1].matchAll(/([a-z]+)="([^"]+)"/g)].map((entry) => [entry[1], entry[2]]));
      const x = Number(attrs.x), y = Number(attrs.y), width = Number(attrs.width), height = Number(attrs.height);
      assert(Number.isInteger(x) && Number.isInteger(y) && width === 1 && height === 1, `Non-unit pixel cell in ${expectedSize}x${expectedSize}`);
      assert(x >= 0 && y >= 0 && x < expectedSize && y < expectedSize, `Pixel is outside ${expectedSize}x${expectedSize}`);
      const key = `${x},${y}`;
      assert(!cells.has(key), `Overlapping pixels at ${key}`);
      cells.set(key, color);
    }
  }
  assert(cells.size > 0 && cells.size < expectedSize * expectedSize, 'Heart should contain discrete filled cells and transparent corners');
  for (let y = 0; y < expectedSize; y += 1) {
    for (let x = 0; x < expectedSize; x += 1) {
      assert(cells.has(`${x},${y}`) === cells.has(`${expectedSize - 1 - x},${y}`), `Silhouette is not horizontally symmetric at row ${y}`);
    }
  }
  const outline = palette.outline;
  for (const [key, color] of cells) {
    const [x, y] = key.split(',').map(Number);
    const boundary = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => !cells.has(`${x+dx},${y+dy}`));
    assert((color === outline) === boundary, `${expectedSize}x${expectedSize} is not a one-cell outline at ${key}`);
    if (color === palette.highlight) assert(y <= 2 && x < expectedSize / 2, 'Highlight pixels belong on the upper-left interior');
  }
  assert([...cells.values()].includes(palette.highlight), 'A bright upper-left highlight is required');
  return { size: expectedSize, cells, occupiedPixels: cells.size, outlinePixels: [...cells.values()].filter((color) => color === outline).length };
}

function luminance(hex) {
  const rgb = hex.slice(1).match(/.{2}/g).map((part) => parseInt(part, 16) / 255);
  const lin = rgb.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function contrast(foreground, background) {
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
const render = async (svg, width, height, nearest = true) => sharp(Buffer.from(svg), { density: 72 })
  .resize(width, height, { fit: 'fill', kernel: nearest ? 'nearest' : 'lanczos3' })
  .png().toBuffer();
const pngImage = async (svg, size, nearest = true) => render(svg, size, size, nearest);
const textSvg = (width, height, markup) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${markup}</svg>`);

const heartSvgs = Object.fromEntries(await Promise.all(Object.entries(files).map(async ([size, file]) => [size, await read(file)])));
const grids = Object.fromEntries(Object.entries(heartSvgs).map(([size, svg]) => [size, parseGrid(svg, Number(size))]));
assert(new Set(Object.values(grids).map((grid) => grid.occupiedPixels)).size === 3, 'Three variants must be separately drawn grids, not one repeated/rescaled mask');
const oldSvgSource = await read(oldPath);
assert(oldSvgSource.includes('viewBox="0 0 12 12"') && /<path[^>]*d="[^"]*[Cc][^"]*"/.test(oldSvgSource), 'Legacy comparison must use the original smooth 12x12 Bezier heart');
const r5HeartSvg = await read(r5HeartPath);
assert(r5HeartSvg.includes('rgb(52,49,106)') && r5HeartSvg.includes('rgb(244,183,217)') && r5HeartSvg.includes('rgb(248,240,250)'), 'Reference asset palette evidence changed');
const oldSvg = oldSvgSource.replace(/fill="#000"/g, 'fill="#16112a"');

const contrastReport = {
  sourceEvidence: {
    legacyHeart: 'original-assets/src/s7-heart-12x12.svg (12x12 smooth cubic Bezier silhouette; existing CSS colors its mask #16112a)',
    pixelStyleReference: 'original-assets/r5/src/heart.svg (1-cell crisp grid; source colors rgb(52,49,106), rgb(244,183,217), rgb(248,240,250))',
    titlebarHex: titlebar,
    darkWindowHex: dark
  },
  palette: Object.fromEntries(Object.entries(palette).map(([name, hex]) => [name, {
    hex,
    contrastOnPinkTitlebar: Number(contrast(hex, titlebar).toFixed(2)),
    contrastOnDarkWindow: Number(contrast(hex, dark).toFixed(2))
  }])),
  titlebar: { hex: titlebar, contrastAgainstItself: 1 },
  darkWindow: { hex: dark, contrastAgainstItself: 1 },
  variants: Object.fromEntries(Object.entries(grids).map(([size, grid]) => [size, {
    cssDisplayPx: `${size}px`, viewBox: `${size}x${size}`,
    occupiedPixels: grid.occupiedPixels,
    onePixelOutlineCells: grid.outlinePixels,
    independentGrid: true
  }])),
  note: 'Decorative icon, not text: #34316a outline contrasts 4.35:1 on the pink title bar (above 3:1 non-text threshold); pink fill and highlight carry silhouette contrast on dark #201936.'
};

// Render and verify exact native pixel colors before making any zoomed comparisons.
for (const [size, svg] of Object.entries(heartSvgs)) {
  const raw = await sharp(Buffer.from(svg), { density: 72 }).resize(Number(size), Number(size), { fit: 'fill', kernel: 'nearest' }).ensureAlpha().raw().toBuffer();
  const allowedRgba = new Set([...colors].map((hex) => `${hex.slice(1).match(/.{2}/g).map((part) => parseInt(part,16)).join(',')},255`));
  allowedRgba.add('0,0,0,0');
  for (let offset = 0; offset < raw.length; offset += 4) {
    const actual = `${raw[offset]},${raw[offset+1]},${raw[offset+2]},${raw[offset+3]}`;
    assert(allowedRgba.has(actual), `Interpolated/unexpected color at native ${size}x${size} pixel: ${actual}`);
  }
}

async function renderComparison(bgHex, label) {
  const factors = [1, 2, 4, 6];
  const items = [
    { name: 'OLD SMOOTH', base: 12, svg: oldSvg, nearest: false },
    { name: 'NEW PIXEL 9', base: 9, svg: heartSvgs['9'], nearest: true },
    { name: 'NEW PIXEL 7', base: 7, svg: heartSvgs['7'], nearest: true },
    { name: 'NEW PIXEL 5', base: 5, svg: heartSvgs['5'], nearest: true }
  ];
  const labelW = 54, colW = 128, headerH = 34, rowGap = 2;
  const rows = factors.map((factor) => ({ factor, maxIcon: 12 * factor, height: 12 * factor + 26 }));
  const width = labelW + colW * items.length;
  const height = headerH + rows.reduce((sum, row) => sum + row.height + rowGap, 0) + 2;
  const ink = label === 'pink' ? '#34316a' : '#fdf4ff';
  let cursorY = headerH;
  const iconLayers = [];
  const headings = items.map((item, index) => `<text x="${labelW + index*colW + colW/2}" y="22" text-anchor="middle" fill="${ink}" font-family="sans-serif" font-size="11">${item.name}</text>`).join('');
  let rowMarkup = '';
  for (const row of rows) {
    rowMarkup += `<text x="12" y="${cursorY + 17}" fill="${ink}" font-family="sans-serif" font-size="12">${row.factor}×</text><line x1="0" y1="${cursorY + row.height}" x2="${width}" y2="${cursorY + row.height}" stroke="${ink}" opacity=".22"/>`;
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const pixelSize = item.base * row.factor;
      const image = await render(item.svg, pixelSize, pixelSize, item.nearest);
      iconLayers.push({ input: image, left: labelW + index * colW + Math.floor((colW - pixelSize) / 2), top: cursorY + 22 + Math.floor((row.maxIcon - pixelSize) / 2) });
    }
    cursorY += row.height + rowGap;
  }
  const labels = textSvg(width, height, `<rect width="100%" height="${height}" fill="${bgHex}"/><rect width="100%" height="${headerH}" fill="${label === 'pink' ? '#ed9bd3' : '#171326'}"/>${headings}${rowMarkup}<text x="${width - 8}" y="${height - 5}" text-anchor="end" fill="${ink}" opacity=".72" font-family="monospace" font-size="9">${label.toUpperCase()} · ${bgHex.toUpperCase()}</text>`);
  const output = path.join(checksDir, `comparison-${label}.png`);
  await sharp(labels).composite(iconLayers).png().toFile(output);
  const metadata = await sharp(output).metadata();
  assert(metadata.width <= 2000 && metadata.height <= 2000, 'Comparison image exceeds 2000px edge limit');
  return { path: output, width: metadata.width, height: metadata.height };
}

async function renderNativeSizes() {
  const variants = [
    { size: 5, svg: heartSvgs['5'] },
    { size: 7, svg: heartSvgs['7'] },
    { size: 9, svg: heartSvgs['9'] }
  ];
  const cellW = 248, labelW = 90, headerH = 30, rowH = 94;
  const width = labelW + cellW * variants.length;
  const height = headerH + rowH * 2;
  const layers = [];
  const textColor = ['#34316a', '#fdf4ff'];
  let markup = `<rect width="100%" height="100%" fill="${dark}"/><rect width="100%" height="${headerH}" fill="#171326"/>`;
  for (let index = 0; index < variants.length; index += 1) {
    markup += `<text x="${labelW + index*cellW + cellW/2}" y="20" text-anchor="middle" fill="#fdf4ff" font-family="sans-serif" font-size="12">${variants[index].size}×${variants[index].size} · DISPLAY ${variants[index].size}px</text>`;
  }
  for (let row = 0; row < 2; row += 1) {
    const bg = row === 0 ? titlebar : dark;
    const fg = textColor[row];
    const rowY = headerH + row * rowH;
    markup += `<rect x="0" y="${rowY}" width="100%" height="${rowH}" fill="${bg}"/><text x="10" y="${rowY+18}" fill="${fg}" font-family="monospace" font-size="10">${row===0?'PINK 1×':'DARK 1×'}</text>`;
    for (let index = 0; index < variants.length; index += 1) {
      const item = variants[index], cellX = labelW + index * cellW;
      const actual = await pngImage(item.svg, item.size, true);
      const zoom = await pngImage(item.svg, item.size * 8, true);
      markup += `<rect x="${cellX+10}" y="${rowY+33}" width="16" height="16" fill="none" stroke="${fg}" stroke-opacity=".45" stroke-dasharray="1 1"/><text x="${cellX+10}" y="${rowY+66}" fill="${fg}" font-family="monospace" font-size="9">14px slot</text><text x="${cellX+138}" y="${rowY+43}" fill="${fg}" font-family="sans-serif" font-size="10">${item.size}px display</text><text x="${cellX+138}" y="${rowY+57}" fill="${fg}" font-family="monospace" font-size="9">×8 nearest</text>`;
      layers.push({ input: actual, left: cellX + 10 + Math.floor((16 - item.size) / 2), top: rowY + 33 + Math.floor((16 - item.size) / 2) });
      layers.push({ input: zoom, left: cellX + 58, top: rowY + 11 + Math.floor((72 - item.size * 8) / 2) });
    }
  }
  const output = path.join(checksDir, 'native-sizes.png');
  await sharp(textSvg(width, height, markup)).composite(layers).png().toFile(output);
  const metadata = await sharp(output).metadata();
  assert(metadata.width <= 2000 && metadata.height <= 2000, 'Native sizes image exceeds 2000px edge limit');
  return { path: output, width: metadata.width, height: metadata.height };
}

const [pinkComparison, darkComparison, nativeSizes] = await Promise.all([
  renderComparison(titlebar, 'pink'),
  renderComparison(dark, 'dark'),
  renderNativeSizes()
]);
const cssVars = `/* Generated from the three multicolor SVGs; append to the theme assets section. */\n:root{\n  --jk-r9-heart-5:url("data:image/svg+xml,${encodeURIComponent(heartSvgs['5'])}");\n  --jk-r9-heart-7:url("data:image/svg+xml,${encodeURIComponent(heartSvgs['7'])}");\n  --jk-r9-heart-9:url("data:image/svg+xml,${encodeURIComponent(heartSvgs['9'])}");\n}\n`;
const varsPath = path.join(assetDir, 'heart-assets-r9.css');
await fs.writeFile(varsPath, cssVars);
contrastReport.outputs = {
  cssVariableBundle: path.basename(varsPath),
  comparisonOnPink: { file: path.basename(pinkComparison.path), width: pinkComparison.width, height: pinkComparison.height },
  comparisonOnDark: { file: path.basename(darkComparison.path), width: darkComparison.width, height: darkComparison.height },
  nativeDisplaySizes: { file: path.basename(nativeSizes.path), width: nativeSizes.width, height: nativeSizes.height }
};
await fs.writeFile(path.join(checksDir, 'contrast-report.json'), JSON.stringify(contrastReport, null, 2) + '\n');
console.log(JSON.stringify(contrastReport, null, 2));
console.log('PASS: three unique integer pixel grids / one-cell purple outlines / native RGB only / 1x 2x 4x 6x comparisons / image edges <=2000px');
