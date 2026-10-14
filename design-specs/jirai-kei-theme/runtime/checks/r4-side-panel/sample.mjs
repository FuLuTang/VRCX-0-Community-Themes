// NOT WINDOWS: sample pixel runs from a read-only user screenshot.
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import { readFileSync } from 'node:fs';

const [, , src, mode, a, b] = process.argv;
const uri = 'data:image/png;base64,' + readFileSync(src).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 600, height: 1200 } });
await page.setContent(
    `<body style="margin:0"><img id="i" src="${uri}"></body>`,
    { waitUntil: 'load' }
);
await page.waitForTimeout(300);
const runs = await page.evaluate(
    async ({ mode, a, b }) => {
        const img = document.getElementById('i');
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const hex = (r, g, b) =>
            '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
        const out = [];
        if (mode === 'row') {
            const d = ctx.getImageData(0, Number(a), c.width, 1).data;
            let prev = null;
            let start = 0;
            for (let x = 0; x < c.width; x++) {
                const h = hex(d[x * 4], d[x * 4 + 1], d[x * 4 + 2]);
                if (h !== prev) {
                    if (prev !== null) out.push([start, x - 1, prev]);
                    prev = h;
                    start = x;
                }
            }
            out.push([start, c.width - 1, prev]);
        } else {
            const d = ctx.getImageData(Number(a), 0, 1, c.height).data;
            let prev = null;
            let start = 0;
            for (let y = 0; y < c.height; y++) {
                const h = hex(d[y * 4], d[y * 4 + 1], d[y * 4 + 2]);
                if (h !== prev) {
                    if (prev !== null) out.push([start, y - 1, prev]);
                    prev = h;
                    start = y;
                }
            }
            out.push([start, c.height - 1, prev]);
        }
        return out.slice(0, Number(b || 400));
    },
    { mode, a, b }
);
console.log(JSON.stringify(runs));
await browser.close();
