import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const root = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(root, 'index.html')).href;
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  for (const [name, q, dpr] of [['main', '', 1.25], ['dialog', '?dialog=1', 1.25]]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: dpr });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => errors.push('failed ' + r.url()));
    await page.goto(url + q, { waitUntil: 'networkidle' });
    await page.locator('#app').screenshot({ path: path.join(root, `windose-dark-${name}.png`) });
    await ctx.close();
  }
} finally { await browser.close(); }
console.log(errors.length ? errors : 'no errors');
