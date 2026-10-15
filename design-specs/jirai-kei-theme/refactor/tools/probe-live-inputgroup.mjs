import { createRequire } from 'node:module';

const req = createRequire(
    '/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/tools/package.json'
);
const { chromium } = req('playwright');

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const ctx = browser.contexts()[0];
const page = ctx.pages().find((x) => x.url().includes('9000'));
if (!page) {
    console.log('NO_PAGE');
    process.exit(0);
}

console.log('URL:', page.url());

const result = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-slot="input-group"]').forEach((g, i) => {
        if (i >= 5) return;
        out.push({
            idx: i,
            cls: (g.getAttribute('class') || '').slice(0, 80),
            slotsInside: [...g.querySelectorAll('[data-slot]')].map((e) => e.getAttribute('data-slot')),
            svgInside: [...g.querySelectorAll('svg')].map((s) => s.getAttribute('class') || ''),
            // 图标在不在 group 之外？查父级
            parentTag: g.parentElement ? g.parentElement.tagName : '',
            parentSlots: g.parentElement
                ? [...g.parentElement.querySelectorAll('[data-slot]')].map((e) => e.getAttribute('data-slot'))
                : [],
            parentSvg: g.parentElement
                ? [...g.parentElement.querySelectorAll('svg')].map((s) => s.getAttribute('class') || '')
                : [],
        });
    });

    const chips = [];
    document.querySelectorAll('[data-slot="combobox-chips"]').forEach((c, i) => {
        if (i >= 2) return;
        chips.push({
            idx: i,
            slotsInside: [...c.querySelectorAll('[data-slot]')].map((e) => e.getAttribute('data-slot')),
            children: [...c.children].map(
                (e) => `<${e.tagName.toLowerCase()}> slot=${e.getAttribute('data-slot')} cls=${(e.getAttribute('class') || '').slice(0, 60)}`
            ),
        });
    });

    return { out, chips };
});

console.log(JSON.stringify(result, null, 1));
process.exit(0);
