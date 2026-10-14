/* R7 background art build. Reproducible colour-key background removal.
   User rule for the key colour: big icon -> bottom-LEFT corner pixel,
   small icon -> bottom-RIGHT corner pixel. Only the border-connected region of
   that exact colour becomes transparent, so interior artwork is never punched out.
   Source PNGs are the unmodified Fandom originals (see SOURCE-NOTES.md). */
import fs from 'node:fs';
import path from 'node:path';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.cjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const TOLERANCE = 12;
// User (R8): both corners the same size; 160px@30% -> 200px@22% ("darker, a bit bigger").
// Pre-scaling with 'nearest' keeps the pixels crisp and lets CSS draw 1:1,
// so the browser never interpolates the pixel art.
const TARGET_SIZE = 200;
const GLOBAL_ALPHA = 0.22;
const SOURCES = [
    {tag: 'game', file: 'source/Icon_game-32x32.png', corner: 'bottom-left',
     varName: '--r7-game-icon', title: 'Icon for the game. (KAngel)', role: 'big icon, bottom-RIGHT of the main content'},
    {tag: 'ame', file: 'source/Icon_poketter_ame_-25x25.png', corner: 'bottom-right',
     varName: '--r7-ame-tweeter', title: "Ame-chan's Tweeter profile", role: 'small icon, bottom-LEFT of the main content'}
];
const rgba = (c) => `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;

const entries = [];
for (const {tag, file, corner, varName, title, role} of SOURCES) {
    const {data, info} = await sharp(path.join(here, file)).ensureAlpha().raw().toBuffer({resolveWithObject: true});
    const {width: w, height: h} = info;
    const px = (x, y) => { const i = (y * w + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
    const key = corner === 'bottom-left' ? px(0, h - 1) : px(w - 1, h - 1);
    const dist = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));

    // Flood from the full border so only background connected to the outside is keyed.
    const seen = new Uint8Array(w * h); const queue = [];
    const seed = (x, y) => { const i = y * w + x; if (!seen[i] && dist(px(x, y), key) <= TOLERANCE) { seen[i] = 1; queue.push([x, y]); } };
    for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
    for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }
    while (queue.length) {
        const [x, y] = queue.pop();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const ni = ny * w + nx; if (seen[ni]) continue;
            if (dist(px(nx, ny), key) <= TOLERANCE) { seen[ni] = 1; queue.push([nx, ny]); }
        }
    }
    const removed = seen.reduce((a, b) => a + b, 0);
    const out = Buffer.from(data);
    for (let i = 0; i < w * h; i++) {
        out[i * 4 + 3] = seen[i] ? 0 : Math.round(out[i * 4 + 3] * GLOBAL_ALPHA);
    }
    const scaled = await sharp(out, {raw: {width: w, height: h, channels: 4}})
        .resize(TARGET_SIZE, TARGET_SIZE, {kernel: 'nearest'})
        .raw().toBuffer();
    const png = await sharp(scaled, {raw: {width: TARGET_SIZE, height: TARGET_SIZE, channels: 4}})
        .png({compressionLevel: 9}).toBuffer();
    fs.writeFileSync(path.join(here, `keyed-${tag}-${w}x${h}.png`), png);
    // Edge audit: no keyed colour may survive on the outer ring unless it is interior art.
    let ringKeyed = 0, ringTotal = 0;
    for (let x = 0; x < w; x++) for (const y of [0, h - 1]) { ringTotal++; if (dist(px(x, y), key) <= TOLERANCE && !seen[y * w + x]) ringKeyed++; }
    for (let y = 0; y < h; y++) for (const x of [0, w - 1]) { ringTotal++; if (dist(px(x, y), key) <= TOLERANCE && !seen[y * w + x]) ringKeyed++; }
    entries.push({tag, varName, title, role, corner, key: rgba(key), keyRgb: key,
        sourceWidth: w, sourceHeight: h, targetSize: TARGET_SIZE,
        removedPixels: removed, removedPercent: +(removed / (w * h) * 100).toFixed(1),
        survivingKeyedRingPixels: ringKeyed, pngBytes: png.length,
        url: `data:image/png;base64,${png.toString('base64')}`});
    console.log(`${tag}: ${w}x${h} key=${rgba(key)} removed ${(removed / (w * h) * 100).toFixed(1)}% ring-survivors=${ringKeyed} -> ${TARGET_SIZE}px png=${png.length}B`);
}

const css = `/* R7 background art. Inline data: URLs only; no remote request.
   Backgrounds keyed out per the corner-pixel rule; see build-report.json. */
:root {
${entries.map((e) => ` ${e.varName}:url("${e.url}");`).join('\n')}
}
`;
fs.writeFileSync(path.join(here, 'assets-r7.css'), css);
fs.writeFileSync(path.join(here, 'build-report.json'), JSON.stringify({
    method: 'border-connected exact colour key, flat global alpha, nearest pre-scale',
    tolerance: TOLERANCE, globalAlpha: GLOBAL_ALPHA, targetSize: TARGET_SIZE,
    derivedFrom: SOURCES.map((s) => s.file),
    entries: entries.map(({url, ...rest}) => rest),
    cssBytes: Buffer.byteLength(css)
}, null, 2) + '\n');
console.log(`assets-r7.css ${Buffer.byteLength(css)} B`);
