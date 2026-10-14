// NOT WINDOWS: local Playwright crop helper for read-only user screenshots.
// Renders the PNG at 1:1 then clips; zoom comes from deviceScaleFactor only.
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import { readFileSync } from 'node:fs';

const [, , src, out, x, y, w, h, zoomArg] = process.argv;
const zoom = Number(zoomArg || 4);
const uri = 'data:image/png;base64,' + readFileSync(src).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage({
    viewport: { width: 480, height: 1200 },
    deviceScaleFactor: zoom
});
await page.setContent(
    `<body style="margin:0;background:#000"><img src="${uri}" style="display:block"></body>`,
    { waitUntil: 'load' }
);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({
    path: out,
    clip: {
        x: Number(x),
        y: Number(y),
        width: Number(w),
        height: Number(h)
    }
});
await browser.close();
console.log('wrote', out, w, h, 'zoom', zoom);
