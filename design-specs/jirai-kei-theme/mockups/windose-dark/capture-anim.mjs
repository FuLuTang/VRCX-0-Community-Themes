import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const sharp = createRequire(import.meta.url)('/tmp/dsh-theme-tools/node_modules/sharp');
const root = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })).newPage();
await page.goto(pathToFileURL(path.join(root, 'index.html')).href, { waitUntil: 'networkidle' });
const clip = { x: 0, y: 0, width: 760, height: 330 }; // titlebar + sidebar top + feed header
const frames = [];
for (let i = 0; i < 16; i++) { frames.push(await page.screenshot({ clip })); await page.waitForTimeout(200); }
const statusClip = { x: 760, y: 872, width: 680, height: 28 };
const sframes = [];
for (let i = 0; i < 8; i++) { sframes.push(await page.screenshot({ clip: statusClip })); await page.waitForTimeout(100); }
await browser.close();
await sharp(frames, { join: { animated: true } }).webp({ loop: 0, delay: Array(16).fill(200), lossless: true }).toFile(path.join(root, 'windose-dark-motion.webp'));
await sharp(sframes, { join: { animated: true } }).webp({ loop: 0, delay: Array(8).fill(100), lossless: true }).toFile(path.join(root, 'windose-dark-motion-status.webp'));
console.log('ok');
