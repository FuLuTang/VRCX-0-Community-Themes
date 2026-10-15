import { createRequire } from 'node:module';

const req = createRequire(
    '/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/tools/package.json'
);
const { chromium } = req('playwright');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const ctx = browser.contexts()[0];
const page = ctx.pages().find((x) => x.url().includes('9000'));
if (!page) { console.log('NO_PAGE'); process.exit(0); }

const route = process.argv[2] || 'feed';
console.log('=== 路由 -> #/' + route + ' ===');
await page.evaluate((r) => { location.hash = '#/' + r; }, route);
await page.waitForTimeout(2500);
console.log('URL:', page.url());

const result = await page.evaluate(() => {
    const dump = (el) => ({
        tag: el.tagName.toLowerCase(),
        slot: el.getAttribute('data-slot'),
        cls: (el.getAttribute('class') || '').slice(0, 70),
    });
    const groups = [];
    document.querySelectorAll('[data-slot="input-group"]').forEach((g, i) => {
        if (i >= 6) return;
        const svgs = [...g.querySelectorAll('svg')].map((s) => s.getAttribute('class') || '');
        const addon = g.querySelector('[data-slot="input-group-addon"]');
        groups.push({
            i,
            svgs,
            hasSearch: svgs.some((c) => c.includes('lucide-search')),
            addonChildren: addon ? [...addon.children].map(dump) : [],
        });
    });
    const chips = [];
    document.querySelectorAll('[data-slot="combobox-chips"]').forEach((c, i) => {
        if (i >= 3) return;
        chips.push({
            i,
            children: [...c.children].map(dump),
            innerSlots: [...c.querySelectorAll('[data-slot]')].map((e) => e.getAttribute('data-slot')),
        });
    });
    return { groups, chips };
});

console.log(JSON.stringify(result, null, 1));
process.exit(0);
