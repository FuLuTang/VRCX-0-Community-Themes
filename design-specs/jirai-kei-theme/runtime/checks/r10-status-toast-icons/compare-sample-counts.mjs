import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)(process.env.SHARP_MODULE || '/tmp/dsh-theme-tools/node_modules/sharp');
const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(here, '../../../original-assets/r10-status-toast-icons');
const facePNG = await fs.readFile(path.join(assets, 'toast-shock-face-1x.png'));
const { data, info } = await sharp(facePNG).raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const cells = [];
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3]) cells.push([x, y]);
}
const distance = (x, y, square = false) => Math.min(...cells.map(([sx, sy]) => {
    const dx = Math.max(0, sx - x, x - sx - 1);
    const dy = Math.max(0, sy - y, y - sy - 1);
    return square ? Math.max(dx, dy) : Math.hypot(dx, dy);
}));
const panels = [], alphas = [];
for (const innerAA of [false, true]) for (const n of [2, 4]) {
    const rgba = Buffer.alloc(width * height * 4), alpha = [], histogram = {};
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        let hits = 0;
        if (innerAA || distance(x + 0.5, y + 0.5, true) >= 1) {
            for (let sy = 0; sy < n; sy++) for (let sx = 0; sx < n; sx++) {
                const d = distance(x + (sx + 0.5) / n, y + (sy + 0.5) / n);
                if (d < 2 && (!innerAA || d >= 1)) hits++;
            }
        }
        const a = Math.round(hits * 255 / (n * n)), i = (y * width + x) * 4;
        rgba[i] = 255; rgba[i + 1] = 173; rgba[i + 2] = 223; rgba[i + 3] = a;
        alpha.push(a); histogram[a] = (histogram[a] || 0) + 1;
    }
    const ring = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
    if (n === 2 && !innerAA) {
        const current = await sharp(path.join(assets, 'toast-info-shock-ring.png')).raw().toBuffer();
        if (!current.equals(rgba)) throw Error('4-point comparison differs from runtime ring');
    }
    const composed = await sharp(ring).composite([{ input: facePNG }]).png().toBuffer();
    await fs.writeFile(path.join(here, `shock-${n * n}-samples${innerAA ? '-inner-aa' : ''}-1x.png`), composed);
    panels.push(await sharp(composed).resize(width * 8, height * 8, { kernel: 'nearest' }).png().toBuffer());
    alphas.push(alpha);
    console.log(JSON.stringify({ samples: n * n, innerAA, dimensions: [width, height], histogram }));
}
const changed = alphas[0].filter((a, i) => a !== alphas[1][i]).length;
console.log(JSON.stringify({ changedLogicalPixels: changed, runtimeUntouched: true }));
const labels = Buffer.from('<svg width="484" height="460"><g font-family="sans-serif" font-size="13" fill="#f2ebff"><text x="12" y="20">4 samples / outer AA only</text><text x="254" y="20">16 samples / outer AA only</text><text x="12" y="250">4 samples / inner + outer AA</text><text x="254" y="250">16 samples / inner + outer AA</text></g></svg>');
await sharp({ create: { width: 484, height: 460, channels: 4, background: '#201936' } }).composite([
    { input: panels[0], left: 12, top: 30 }, { input: panels[1], left: 254, top: 30 },
    { input: panels[2], left: 12, top: 260 }, { input: panels[3], left: 254, top: 260 },
    { input: labels, left: 0, top: 0 }
]).png().toFile(path.join(here, 'sampling-4-vs-16-inner-aa.png'));
