import { chromium } from 'playwright';

const CDP = process.env.CDP_URL || 'http://127.0.0.1:9222';

const browser = await chromium.connectOverCDP(CDP);
const contexts = browser.contexts();
const pages = contexts.flatMap((c) => c.pages());

console.log(`[connect] contexts=${contexts.length} pages=${pages.length}`);
for (const p of pages) console.log(`  - ${p.url()}`);

const page = pages.find((p) => p.url().includes('localhost:9000')) || pages[0];
if (!page) {
    console.error('[fatal] no page target');
    process.exit(1);
}
console.log(`[target] ${page.url()}`);

const probe = await page.evaluate(() => {
    const styles = [...document.querySelectorAll('style')];
    const texts = styles.map((s) => s.textContent || '');
    const joined = texts.join('\n');
    const sections = joined.match(/\/\* SECTION [a-z0-9-]+/g) || [];

    let totalRules = 0;
    for (const s of document.styleSheets) {
        try {
            totalRules += s.cssRules.length;
        } catch {
            /* cross-origin sheet */
        }
    }

    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    const readVar = (name) => root.getPropertyValue(name).trim();

    // find the biggest <style> tag - candidate for the injected theme
    let biggest = { index: -1, bytes: 0 };
    texts.forEach((t, i) => {
        if (t.length > biggest.bytes) biggest = { index: i, bytes: t.length };
    });

    return {
        title: document.title,
        href: location.href,
        hash: location.hash,
        readyState: document.readyState,
        viewport: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio },
        styleTagCount: styles.length,
        linkCount: document.querySelectorAll('link[rel="stylesheet"]').length,
        sheetCount: document.styleSheets.length,
        totalRules,
        sectionMarkers: sections.length,
        firstSections: sections.slice(0, 8),
        biggestStyleTag: biggest,
        htmlClass: document.documentElement.className,
        bodyDataset: { ...document.body.dataset },
        documentAttrs: [...document.documentElement.attributes].map(
            (a) => `${a.name}=${a.value}`
        ),
        cssVars: {
            radius: readVar('--radius'),
            background: readVar('--background'),
            foreground: readVar('--foreground'),
            card: readVar('--card'),
            primary: readVar('--primary'),
            border: readVar('--border'),
            wdPink: readVar('--wd-pink'),
            vrcxSurface: readVar('--vrcx-0-surface')
        },
        bodyBg: body.backgroundColor,
        rootFontSize: root.fontSize
    };
});

console.log(JSON.stringify(probe, null, 2));
process.exit(0);
