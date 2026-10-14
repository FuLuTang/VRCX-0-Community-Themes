/* R4 side-panel zoom helper — local Playwright crop of a 1:1 fixture screenshot.
   NOT WINDOWS: this only enlarges pixels that were already rendered by the
   headless fixture browser; it is not an in-app screenshot. */
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [, , srcName, outName, x, y, w, h, zoomArg] = process.argv;
const zoom = Number(zoomArg || 6);
const uri = 'data:image/png;base64,' + readFileSync(path.join(here, srcName)).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2000, height: 1200 }, deviceScaleFactor: zoom });
await page.setContent(
    `<body style="margin:0;background:#000"><img src="${uri}" style="display:block;image-rendering:pixelated"></body>`,
    { waitUntil: 'load' }
);
await page.waitForTimeout(300);
await page.screenshot({
    path: path.join(here, outName),
    clip: { x: Number(x), y: Number(y), width: Number(w), height: Number(h) }
});
await browser.close();
console.log('wrote', outName, `${w}x${h} @${zoom}x`);
