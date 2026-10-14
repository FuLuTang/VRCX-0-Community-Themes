import { chromium } from 'playwright';
import fs from 'node:fs';

const CDP = process.env.CDP_URL || 'http://127.0.0.1:9222';
const out = process.argv[2] || '/tmp/runtime-theme.css';

const browser = await chromium.connectOverCDP(CDP);
const pages = browser.contexts().flatMap((c) => c.pages());
const page = pages.find((p) => p.url().includes('localhost:9000')) || pages[0];
if (!page) {
    console.error('[fatal] no page target');
    process.exit(1);
}

// Dump every <style> tag so we can tell app-owned CSS from injected theme CSS.
const sheets = await page.evaluate(() =>
    [...document.querySelectorAll('style')].map((s, i) => ({
        i,
        bytes: (s.textContent || '').length,
        hasSectionMarkers: /\/\* SECTION /.test(s.textContent || ''),
        setId: s.getAttribute('id'),
        setDataset: { ...s.dataset },
        head: (s.textContent || '').slice(0, 90)
    }))
);

console.log('=== <style> tags in live app ===');
for (const s of sheets) {
    console.log(
        `  [${s.i}] ${String(s.bytes).padStart(9)} B  sections=${s.hasSectionMarkers ? 'YES' : 'no '}  id=${s.setId ?? '-'}  data=${JSON.stringify(s.setDataset)}`
    );
    console.log(`        head: ${JSON.stringify(s.head)}`);
}

// Dump the largest section-bearing sheet = the injected theme.
const css = await page.evaluate(() => {
    let biggest = '';
    for (const s of document.querySelectorAll('style')) {
        const t = s.textContent || '';
        if (/\/\* SECTION /.test(t) && t.length > biggest.length) biggest = t;
    }
    return biggest;
});

fs.writeFileSync(out, css);
console.log(`\n[dump] wrote ${out} (${css.length} bytes)`);

const sections = (css.match(/\/\* SECTION [^\n]*?\*\//g) || []).map((s) =>
    s.replace(/^\/\* SECTION /, '').replace(/ \*\/$/, '')
);
console.log(`[dump] sections=${sections.length}`);
fs.writeFileSync(`${out}.sections.txt`, sections.join('\n') + '\n');
console.log(`[dump] wrote ${out}.sections.txt`);

process.exit(0);
