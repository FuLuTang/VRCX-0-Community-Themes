import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || '/tmp/dsh-theme-tools/node_modules/sharp');
const checksDir = path.dirname(fileURLToPath(import.meta.url));
const themeRoot = path.resolve(checksDir, '../../..');
const sourcePath = path.join(themeRoot, 'art-references/nso-fandom-desktop-icons-sheet.png');
const outputDir = path.join(themeRoot, 'original-assets/r10-status-toast-icons');
const cell = 4;
const background = '#f8f0fa';
const region = { x: 582, y: 450, width: 96, height: 80 };
const variants = [
    { type: 'info', slug: 'toast-info-shock-ring', color: '#ffaddf', label: 'info / pale pink' },
    { type: 'warning', slug: 'toast-warning-shock-ring', color: '#e97c03', label: 'warning / ask-me status orange' }
];

const { data, info } = await sharp(sourcePath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const sample = (x, y) => {
    const i = (y * info.width + x) * 3;
    return `#${[data[i], data[i + 1], data[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};
const sourceCells = [];
for (let y = 0; y < region.height; y += cell) {
    for (let x = 0; x < region.width; x += cell) {
        const color = sample(region.x + x + 1, region.y + y + 1);
        if (color !== background) sourceCells.push([x / cell + 2, y / cell + 2]);
    }
}

const gridWidth = region.width / cell + 4;
const gridHeight = region.height / cell + 4;
// One output pixel per original logical cell, shared by both layers.
// Sixteen subpixel tests collapse into ONE alpha value before nearest-neighbor display.
const pixelWidth = gridWidth;
const pixelHeight = gridHeight;
const face = Buffer.alloc(pixelWidth * pixelHeight * 4);
for (const [sx, sy] of sourceCells) {
    const color = sample(region.x + (sx - 2) * cell + 1, region.y + (sy - 2) * cell + 1);
    const rgb = color.slice(1).match(/.{2}/g).map((v) => parseInt(v, 16));
    const i = (sy * pixelWidth + sx) * 4;
    face[i] = rgb[0]; face[i + 1] = rgb[1]; face[i + 2] = rgb[2]; face[i + 3] = 255;
}
const facePath = path.join(outputDir, 'toast-shock-face-1x.png');
await sharp(face, { raw: { width: pixelWidth, height: pixelHeight, channels: 4 } }).png().toFile(facePath);
const alpha = Buffer.alloc(pixelWidth * pixelHeight);
const sampleOffsets = Array.from({ length: 4 }, (_, i) => (i + 0.5) / 4);
// Keep the square one-cell moat, but offset the outer boundary with circular geometry.
const distanceToSprite = (x, y, metric = 'euclidean') => {
    let nearest = Infinity;
    for (const [sx, sy] of sourceCells) {
        const dx = Math.max(0, sx - x, x - (sx + 1));
        const dy = Math.max(0, sy - y, y - (sy + 1));
        nearest = Math.min(nearest, metric === 'square' ? Math.max(dx, dy) : Math.hypot(dx, dy));
        if (nearest === 0) return 0;
    }
    return nearest;
};
for (let py = 0; py < pixelHeight; py++) for (let px = 0; px < pixelWidth; px++) {
    const index = py * pixelWidth + px;
    const centerX = (px + 0.5) * (gridWidth / pixelWidth);
    const centerY = (py + 0.5) * (gridHeight / pixelHeight);
    // Pass 1: hard-exclude the sprite and its one-cell transparent moat.
    if (distanceToSprite(centerX, centerY, 'square') < 1) continue;
    // Pass 2: antialias only the outer edge using four subpixel coverage samples.
    let covered = 0;
    for (const oy of sampleOffsets) for (const ox of sampleOffsets) {
        const x = (px + ox) * (gridWidth / pixelWidth);
        const y = (py + oy) * (gridHeight / pixelHeight);
        if (distanceToSprite(x, y) < 2) covered++;
    }
    alpha[index] = Math.round(covered * 255 / 4);
}

for (const variant of variants) {
    const color = variant.color.slice(1).match(/.{2}/g).map((v) => parseInt(v, 16));
    const rgba = Buffer.alloc(pixelWidth * pixelHeight * 4);
    for (let i = 0; i < alpha.length; i++) {
        const j = i * 4;
        rgba[j] = color[0]; rgba[j + 1] = color[1]; rgba[j + 2] = color[2]; rgba[j + 3] = alpha[i];
    }
    const pngPath = path.join(outputDir, `${variant.slug}.png`);
    const svgPath = path.join(outputDir, `${variant.slug}.svg`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${pixelWidth}" height="${pixelHeight}" viewBox="0 0 ${pixelWidth} ${pixelHeight}"><title>${variant.label} four-sample antialiased ring</title><desc>Separate 1-cell outline alpha layer with a hard transparent 1-cell moat; only the outside edge uses four-sample coverage.</desc><image width="100%" height="100%" href="data:image/png;base64,${(await sharp(rgba, { raw: { width: pixelWidth, height: pixelHeight, channels: 4 } }).png().toBuffer()).toString('base64')}"/></svg>\n`;
    await fs.writeFile(svgPath, svg);
    await sharp(rgba, { raw: { width: pixelWidth, height: pixelHeight, channels: 4 } }).png().toFile(pngPath);
    console.log(`${variant.slug}: antialiased ${variant.color} outline layer`);
}

// Split the precomposed success/error sprites into crisp faces and newly antialiased rings.
const classicVariants = [
    { type: 'success', slug: 'toast-success-heart-happy', color: '#2ed319' },
    { type: 'error', slug: 'toast-error-awkward-lines', color: '#ff6b8a' }
];
const classicEmbedded = [];
for (const variant of classicVariants) {
    const srcPath = path.join(outputDir, `${variant.slug}.png`);
    const { data: src, info: srcInfo } = await sharp(srcPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const scale = 4;
    const w = srcInfo.width / scale, h = srcInfo.height / scale;
    if (!Number.isInteger(w) || !Number.isInteger(h) || w !== gridWidth || h !== gridHeight) throw new Error(`Unexpected source grid ${srcInfo.width}x${srcInfo.height}`);
    const ringRGB = variant.color.slice(1).match(/.{2}/g).map(v => parseInt(v, 16));
    const faceRGBA = Buffer.alloc(w * h * 4), shapeCells = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const si = ((y * scale + 2) * srcInfo.width + x * scale + 2) * 4;
        const rgb = [...src.subarray(si, si + 3)], a = src[si + 3];
        const isRing = a > 0 && rgb.every((v, i) => v === ringRGB[i]);
        if (a > 0 && !isRing) {
            shapeCells.push([x, y]);
            const di = (y * w + x) * 4;
            faceRGBA.set([...rgb, 255], di);
        }
    }
    const classicFacePath = path.join(outputDir, `${variant.slug}-face-1x.png`);
    const classicRingPath = path.join(outputDir, `${variant.slug}-ring-16-sample.png`);
    await sharp(faceRGBA, { raw: { width: w, height: h, channels: 4 } }).png().toFile(classicFacePath);
    const d = (x, y, square = false) => {
        let nearest = Infinity;
        for (const [sx, sy] of shapeCells) {
            const dx = Math.max(0, sx - x, x - (sx + 1));
            const dy = Math.max(0, sy - y, y - (sy + 1));
            nearest = Math.min(nearest, square ? Math.max(dx, dy) : Math.hypot(dx, dy));
            if (!nearest) return 0;
        }
        return nearest;
    };
    const ringRGBA = Buffer.alloc(w * h * 4), offsets = Array.from({ length: 4 }, (_, i) => (i + 0.5) / 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        let hits = 0;
        if (d(x + 0.5, y + 0.5, true) >= 1) for (const oy of offsets) for (const ox of offsets) if (d(x + ox, y + oy) < 2) hits++;
        const i = (y * w + x) * 4;
        ringRGBA.set([...ringRGB, Math.round(hits * 255 / 16)], i);
    }
    await sharp(ringRGBA, { raw: { width: w, height: h, channels: 4 } }).png().toFile(classicRingPath);
    classicEmbedded.push([`--r10-toast-${variant.type}-face-png`, classicFacePath], [`--r10-toast-${variant.type}-ring-png`, classicRingPath]);
}

const cssPath = path.join(themeRoot, 'runtime/status-icons-r10.css');
let css = await fs.readFile(cssPath, 'utf8');
const embedded = [
    ['--r10-toast-shock-png', facePath],
    ...variants.map((variant) => [`--r10-toast-${variant.type}-ring-png`, path.join(outputDir, `${variant.slug}.png`)]),
    ...classicEmbedded
];
for (const [name, file] of embedded) {
    const b64 = (await fs.readFile(file)).toString('base64');
    const pattern = new RegExp(`${name}: url\\("data:image/png;base64,[^\\"]+"\\);`);
    if (!pattern.test(css)) throw new Error(`Missing CSS variable ${name}`);
    css = css.replace(pattern, `${name}: url("data:image/png;base64,${b64}");`);
}
await fs.writeFile(cssPath, css);
console.log('Outline PNGs embedded byte-for-byte; the crisp face remains on its pixelated layer.');
