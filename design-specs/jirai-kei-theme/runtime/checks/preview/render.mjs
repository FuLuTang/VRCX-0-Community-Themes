/* NOT WINDOWS. Renders the community-theme preview image from a source-shaped DOM
   fixture with sample data only, so preview.webp always reflects the CURRENT theme.css
   and can never contain a real friend list. Run after build-runtime.mjs; it rewrites
   preview-package/jirai-kei-theme/preview.webp in place and keeps a PNG beside itself. */
import fs from 'node:fs/promises';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.cjs';

const here = new URL('./', import.meta.url);
const runtime = new URL('../../', import.meta.url);
const pkg = process.env.JIRAI_PREVIEW_PACKAGE ? new URL(`file://${process.env.JIRAI_PREVIEW_PACKAGE.replace(/\/?$/, '/')}`) : new URL('preview-package/jirai-kei-theme/', runtime);
const fixture = new URL('../r3-source-fixture.html', import.meta.url);
const theme = await fs.readFile(new URL('theme.css', pkg), 'utf8');

// Same nav markup contract the R7 navigation regression uses (real data-sidebar hooks).
const labels = ['好友动态', '好友位置', '游戏日志', '房间历史', '房内玩家', '搜索', '浏览记录', '收藏', '社交', '我的模型', '活动', '好友关系图', '双人关系', '关系时间轴', '工具'];
const icon = '<span class="relative inline-flex size-4 shrink-0 items-center justify-center"><svg class="lucide lucide-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 4a5 5 0 0 0-8 2 5 5 0 0 0-8-2c-5 5 0 9 8 15 8-6 13-10 8-15Z"/></svg></span>';
const classes = 'peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm h-8';
const button = (label, i) => `<li data-sidebar="menu-item"><a data-slot="tooltip-trigger" data-sidebar="menu-button" ${i === 0 ? 'data-active' : ''} class="${classes}" href="#${i}">${icon}<span>${label}</span></a></li>`;
const nav = `<div data-sidebar="content" class="flex min-h-0 flex-1 flex-col overflow-auto"><div data-sidebar="group"><div data-sidebar="group-content"><ul data-sidebar="menu" class="flex flex-col">${labels.map(button).join('')}</ul></div></div></div><div data-sidebar="footer" class="flex flex-col"><ul data-sidebar="menu" class="flex flex-col">${button('设置', 99)}${button('收起导航栏', 100)}</ul></div>`;

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1387, height: 1068}, reducedMotion: 'reduce'});
await page.goto(fixture.href);
await page.addStyleTag({content: theme});
const swapped = await page.evaluate((markup) => {
    const inner = document.querySelector('[data-slot="sidebar-inner"]');
    if (!inner) return false;
    inner.innerHTML = markup;
    inner.closest('[data-slot="sidebar"]')?.setAttribute('data-state', 'expanded');
    return true;
}, nav);
if (!swapped) throw Error('fixture has no sidebar-inner to host the R7 nav');
// The shared fixture's #body-probe carries glyph-coverage samples that look like (and
// may come from) real nicknames. The public preview must only show neutral sample text.
await page.evaluate(() => {
    const probe = document.querySelector('#body-probe');
    if (probe) probe.textContent = '像素文字示例 あいうえお カキクケコ ABC abc 123';
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(150);
// Privacy guard: the fixture must still be labelled and carry sample names only.
const text = await page.evaluate(() => document.body.innerText);
if (!text.includes('NOT WINDOWS')) throw Error('preview fixture lost its NOT WINDOWS label');
for (const leaked of ['雪之夏萌心', '二階堂アコ', '冷風', '皮卡丘']) {
    if (text.includes(leaked)) throw Error(`preview would publish a nickname-like sample: ${leaked}`);
}
const png = process.env.JIRAI_PREVIEW_PNG || new URL('preview.png', here).pathname;
await page.screenshot({path: png});
await browser.close();
await sharp(png).resize({width: 1200}).webp({quality: 80}).toFile(new URL('preview.webp', pkg).pathname);
const bytes = (await fs.stat(new URL('preview.webp', pkg))).size;
if (bytes > 262144) throw Error(`preview.webp ${bytes} B exceeds 256 KiB`);
console.log(`preview.webp ${bytes} B from ${png}`);
