/* R4 window-chrome check.
   DOM FIXTURE / NOT WINDOWS — a hand-built copy of the real titlebar/status-bar
   attribute + class structure (AppTitleBar.tsx / AppMenuBar.tsx /
   useTitleBarActions.tsx / button.tsx / kbd.tsx / StatusBarParts.tsx) rendered
   against the app's own compiled CSS plus the built theme sheet and the current
   runtime sheets in build order. It is not a WebView2 run and proves nothing
   about the Windows host. Neutral sample text only; no user screenshots or friend
   names are copied into the repository. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const themeDir = '/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const runtime = path.join(themeDir, 'runtime');
const app = '/home/fulutang/Documents/Github/VRCX-0-jirai';
const req = createRequire(app + '/package.json');
const React = req('react');
const { renderToStaticMarkup } = req('react-dom/server');
const { MinusIcon, SquareIcon, XIcon, SearchIcon } = req('lucide-react');
const { Tooltip } = req('@base-ui/react/tooltip');
const { Button } = req('@base-ui/react/button');
const h = React.createElement;

/* buttonVariants base + size classes, copied verbatim from src/ui/shadcn/button.tsx */
const BTN_BASE =
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap border border-transparent bg-clip-padding select-none';
const SIZE_XS =
    "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3";
const SIZE_ICON_SM = 'size-7 rounded-[min(var(--radius-md),12px)]';

const TRIGGER =
    'text-muted-foreground hover:text-foreground aria-expanded:text-foreground h-full rounded-none text-xs';
/* The quick-search control and the three window buttons are rendered through the
   REAL primitives (Base UI Tooltip + Button) with the app's own wrapper contract
   (src/ui/shadcn/tooltip.tsx:19-27 puts data-slot="tooltip-trigger" on the trigger;
   button.tsx spreads incoming props last), so the fixture proves TooltipTrigger
   overrides data-slot="button" with "tooltip-trigger" and that the R4 selectors,
   which never rely on that slot, still match. */
const KBD_CLASS =
    'bg-background/45 h-3.5 min-w-3.5 rounded-[3px] px-1 text-[9px] leading-3.5 shadow-none';
const cap = (text) => h('kbd', { key: text, 'data-slot': 'kbd', className: KBD_CLASS }, text);
/* Same shape as src/ui/shadcn/button.tsx: defaults first, incoming props last, so
   TooltipTrigger's merged props (including data-slot="tooltip-trigger") win. */
const AppButton = (props) =>
    h(Button, { 'data-slot': 'button', 'data-variant': 'ghost', 'data-size': 'icon-sm', ...props });
const quickSearchNode = h(
    Tooltip.Root,
    null,
    h(Tooltip.Trigger, {
        'data-slot': 'tooltip-trigger',
        render: h(
            AppButton,
            {
                type: 'button',
                'data-size': 'xs',
                'aria-label': '快速搜索 Ctrl+K',
                'data-vrcx-0-control': 'toolbar',
                className: `${BTN_BASE} ${SIZE_XS} vrcx-0-toolbar-control text-muted-foreground hover:text-foreground justify-start rounded-md border-0 shadow-none min-[640px]:w-44 min-[960px]:w-56`
            },
            h(SearchIcon, { 'data-icon': 'inline-start' }),
            h('span', { className: 'hidden min-w-0 truncate min-[640px]:block' }, '快速搜索'),
            h(
                'kbd',
                {
                    'data-slot': 'kbd-group',
                    'aria-label': 'Control + K',
                    className: 'shrink-0 ml-auto hidden gap-0.5 min-[760px]:inline-flex'
                },
                cap('Ctrl'),
                cap('K')
            )
        )
    })
);
const winNode = (label, Icon, extra = '') =>
    h(
        Tooltip.Root,
        { key: label },
        h(Tooltip.Trigger, {
            'data-slot': 'tooltip-trigger',
            render: h(
                AppButton,
                {
                    type: 'button',
                    'aria-label': label,
                    className: `${BTN_BASE} ${SIZE_ICON_SM} text-muted-foreground hover:text-foreground hover:bg-(--state-hover-surface) h-full w-9 rounded-none border-0 ${extra}`
                },
                h(Icon, { 'data-icon': 'inline-start' })
            )
        })
    );
const searchBlock = renderToStaticMarkup(
    h(Tooltip.Provider, null, h('div', { className: 'flex min-w-0 shrink items-center gap-1' }, quickSearchNode))
);
const winBlock = renderToStaticMarkup(
    h(
        Tooltip.Provider,
        null,
        h(
            'div',
            { className: 'flex h-full shrink-0 items-center' },
            winNode('最小化窗口', MinusIcon),
            winNode('还原窗口', SquareIcon),
            winNode('关闭窗口', XIcon, 'hover:bg-destructive! hover:text-destructive-foreground!')
        )
    )
);
const dot = (bg) =>
    `<span class="inline-block size-2 shrink-0 rounded-full transition-colors duration-500 ease-in-out ${bg}"></span>`;

const html = `<!doctype html><html class="dark"><head><meta charset="utf-8"><title>R4 chrome fixture</title></head>
<body class="vrcx-0-app-root">
<div id="root" class="flex h-screen flex-col">
<header data-app-titlebar="true" data-vrcx-0-surface="titlebar" class="vrcx-0-titlebar text-foreground pointer-events-auto relative z-[60] flex h-8 shrink-0 items-center select-none">
  <div data-tauri-drag-region class="flex h-full min-w-0 flex-1 items-center gap-2 pr-3">
    <div role="presentation" data-titlebar-interactive="true" class="h-full shrink-0">
      <div data-slot="menubar" class="h-full border-0 bg-transparent p-0! shadow-none">
        <button data-slot="menubar-trigger" class="${TRIGGER} px-3 py-0!"><span class="vrcx-0-brand">VRCX-0-jirai</span></button>
        <button data-slot="menubar-trigger" class="${TRIGGER} px-2 !py-0"><span class="flex min-w-0 items-center gap-1.5"><span>帮助</span><span data-slot="badge" class="h-4 rounded-md px-1 text-[10px] leading-none shadow-none">1.0.0</span></span></button>
      </div>
    </div>
    <div data-tauri-drag-region class="h-full min-w-0 flex-1"></div>
  </div>
  <div class="relative flex h-full min-w-0 shrink-0 items-center gap-1 px-1">
    <div class="flex min-w-0 shrink items-center gap-1">
      ${searchBlock}
    </div>
  </div>
  ${winBlock}
</header>
<main class="flex-1 p-4">DOM FIXTURE / NOT WINDOWS · 中性示例文本</main>
<footer data-vrcx-0-surface="statusbar" class="vrcx-0-statusbar text-foreground flex h-8 shrink-0 items-center gap-2 px-3">
  ${dot('bg-[var(--status-online)]')}<span class="shrink-0 text-xs text-content-tertiary">实时连接</span>
  ${dot('bg-muted-foreground/40')}<span class="shrink-0 text-xs text-content-tertiary/55">服务端状态</span>
</footer>
</div></body></html>`;

const fixture = path.join(here, 'r4-chrome-fixture.html');
await fs.writeFile(fixture, html);

const appCss = [
    path.join(app, 'dist/assets/index-Cckb3vVG.css'),
    path.join(app, 'dist/assets/App-C2mIqNXI.css')
];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1387, height: 700 } });
await page.goto('file://' + fixture);
for (const f of appCss) await page.addStyleTag({ content: await fs.readFile(f, 'utf8') });
/* Built sheet first (assets, masks, fonts, older runtime revision), then the current
   runtime sheets in the concatenation order build-runtime.mjs uses:
   ... windose-runtime -> window-chrome -> group-spacing -> fonts-pixel-body. */
await page.addStyleTag({ content: await fs.readFile(process.env.BASELINE_CSS || path.join(runtime, 'preview-package/jirai-kei-theme/theme.css'), 'utf8') });
/* Pre-R4 reading: what the user saw with the built (R3) sheet, before the new
   window-chrome.css is appended. Pointer parked first so no hover leaks in. */
await page.mouse.move(700, 300);
await page.waitForTimeout(900);
const beforeR4 = await page.evaluate(() => {
    const cs = getComputedStyle;
    const toRgb = (col) => {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        const ctx = c.getContext('2d');
        ctx.fillStyle = col;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
    };
    const s = document.querySelector('button.vrcx-0-toolbar-control');
    const cap = s.querySelector("kbd[data-slot='kbd']");
    const trig = document.querySelector("[data-slot='menubar-trigger']");
    const dot = document.querySelector(".vrcx-0-statusbar span[class~='size-2']");
    return {
        searchBg: toRgb(cs(s).backgroundColor), searchBorder: cs(s).borderTopWidth, searchColor: toRgb(cs(s).color), searchShadow: cs(s).boxShadow,
        capBg: toRgb(cs(cap).backgroundColor), capColor: toRgb(cs(cap).color), capHeight: cs(cap).height,
        brandBg: toRgb(cs(trig).backgroundColor), brandBorder: cs(trig).borderTopWidth, brandRadius: cs(trig).borderRadius,
        dotRadius: cs(dot).borderRadius, dotBorder: cs(dot).borderTopWidth
    };
});
const chromeCss = await fs.readFile(path.join(runtime, 'window-chrome.css'), 'utf8');
for (const f of ['windose-runtime.css', 'window-chrome.css', 'group-spacing.css', 'fonts-pixel-body.css']) {
    await page.addStyleTag({ content: await fs.readFile(path.join(runtime, f), 'utf8') });
}
await page.evaluate(async () => {
    await document.fonts.load('12px "WD Pixel CJK"', 'VRCX-0-jirai 帮助 快速搜索');
    await document.fonts.ready;
});
/* Park the pointer off the bar so hover never leaks into resting-state reads. */
await page.mouse.move(700, 300);
await page.waitForTimeout(900);

const probe = () => {
    const q = (s) => document.querySelector(s);
    const cs = (el, pseudo) => getComputedStyle(el, pseudo);
    const box = (el) => {
        const r = el.getBoundingClientRect();
        return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
    };
    /* oklab()/color-mix() values come back untranslated from getComputedStyle;
       normalise through a 1x1 canvas so assertions compare stable rgb() strings. */
    const toRgb = (col) => {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        const ctx = c.getContext('2d');
        ctx.fillStyle = col;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
    };
    const lum = (rgb) => {
        const m = rgb.match(/[\d.]+/g).slice(0, 3).map((v) => {
            const c = +v / 255;
            return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2];
    };
    const contrast = (a, b) => {
        const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
        return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
    };
    const bar = q('.vrcx-0-titlebar');
    const search = q('button.vrcx-0-toolbar-control');
    const caps = [...search.querySelectorAll("kbd[data-slot='kbd']")];
    const triggers = [...document.querySelectorAll("[data-slot='menubar-trigger']")];
    const [brand, help] = triggers;
    const brandText = q('.vrcx-0-brand');
    const heart = cs(brandText, '::after');
    const dots = [...document.querySelectorAll(".vrcx-0-statusbar span[class~='size-2']")];
    const winButtons = [...bar.querySelectorAll('button.w-9')];
    const paint = (el) => {
        const s = cs(el);
        return {
            bg: toRgb(s.backgroundColor), color: toRgb(s.color),
            border: `${s.borderTopWidth} ${s.borderTopStyle} ${toRgb(s.borderTopColor)}`,
            radius: s.borderRadius, shadow: s.boxShadow === 'none' ? 'none' : s.boxShadow
        };
    };
    return {
        fixtureOnly: true,
        bar: { ...box(bar), bg: cs(bar).backgroundColor },
        search: { ...box(search), ...paint(search), padding: cs(search).paddingInline, display: cs(search).display, slot: search.dataset.slot || null },
        caps: caps.map((c) => ({ text: c.textContent, ...box(c), ...paint(c), fontSize: cs(c).fontSize, lineHeight: cs(c).lineHeight, contrast: contrast(toRgb(cs(c).color), toRgb(cs(c).backgroundColor)) })),
        brand: { ...box(brand), ...paint(brand), text: brandText.textContent, fontFamily: cs(brandText).fontFamily, textTransform: cs(brandText).textTransform, contrast: contrast(toRgb(cs(brandText).color), toRgb(cs(brand).backgroundColor)) },
        help: { ...box(help), ...paint(help) },
        heart: { content: heart.content, mask: heart.maskImage !== 'none', pointer: heart.pointerEvents, width: heart.width, height: heart.height, bg: heart.backgroundColor },
        dots: dots.map((d) => ({ ...box(d), ...paint(d), fill: toRgb(cs(d).backgroundColor), raw: cs(d).backgroundColor })),
        winButtons: winButtons.map((b) => {
            const r = b.getBoundingClientRect();
            return { label: b.getAttribute('aria-label'), slot: b.dataset.slot || null, ...box(b), ...paint(b), svg: cs(b.querySelector('svg')).width, hit: document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('button') === b };
        }),
        focusable: search.tabIndex >= 0 && triggers.every((t) => t.tabIndex >= 0)
    };
};

const result = await page.evaluate(probe);
result.beforeR4 = beforeR4;
/* Control measurement: same selector with the R3 padding/frame restored, so the
   width the pixel heart adds is measured instead of assumed. */
result.brandWidthWithoutR4 = await page.evaluate(() => {
    const s = document.createElement('style');
    s.textContent = ".vrcx-0-titlebar[data-app-titlebar] [data-slot='menubar'] [data-slot='menubar-trigger']:has(> .vrcx-0-brand){padding-right:12px;border:0;box-shadow:none}";
    document.head.appendChild(s);
    const w = +document.querySelector("[data-slot='menubar-trigger']:has(.vrcx-0-brand)").getBoundingClientRect().width.toFixed(2);
    s.remove();
    return w;
});

await page.hover("[data-slot='menubar-trigger']:has(.vrcx-0-brand)");
result.brandHover = await page.evaluate(() => getComputedStyle(document.querySelector("[data-slot='menubar-trigger']:has(.vrcx-0-brand)")).backgroundColor);
await page.evaluate(() => document.querySelectorAll("[data-slot='menubar-trigger']")[1].setAttribute('aria-expanded', 'true'));
result.helpOpen = await page.evaluate(() => getComputedStyle(document.querySelectorAll("[data-slot='menubar-trigger']")[1]).backgroundColor);
await page.hover('button.vrcx-0-toolbar-control');
result.searchHover = await page.evaluate(() => getComputedStyle(document.querySelector('button.vrcx-0-toolbar-control')).backgroundColor);
result.capHover = await page.evaluate(() => {
    const c = getComputedStyle(document.querySelector("button.vrcx-0-toolbar-control kbd[data-slot='kbd']"));
    return { bg: c.backgroundColor, border: c.borderTopColor };
});
await page.hover('button[aria-label="关闭窗口"]');
result.closeHover = await page.evaluate(() => {
    const s = getComputedStyle(document.querySelector('button[aria-label="关闭窗口"]'));
    return { bg: s.backgroundColor, color: s.color };
});
await page.evaluate(() => document.querySelector('button.vrcx-0-toolbar-control').focus());
result.searchFocus = await page.evaluate(() => {
    const s = getComputedStyle(document.querySelector('button.vrcx-0-toolbar-control'));
    return { outline: `${s.outlineWidth} ${s.outlineStyle} ${s.outlineColor}`, offset: s.outlineOffset };
});

const assert = (v, m) => { if (!v) throw Error(m + '\n' + JSON.stringify(result, null, 2)); };
const lum = (rgb) => {
    const m = rgb.match(/[\d.]+/g).slice(0, 3).map((v) => { const c = +v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2];
};
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return +((hi + 0.05) / (lo + 0.05)).toFixed(2); };
result.beforeR4.capContrast = ratio(result.beforeR4.capColor, result.beforeR4.capBg);
/* The app's own toolbar surface resolves to a modern colour syntax, so classify
   the pre-fix face by lightness instead of by string form. */
const beforeFaceDark = (col) => {
    const oklab = col.match(/oklab\(\s*([\d.]+)/);
    if (oklab) return +oklab[1] < 0.5;
    const m = col.match(/[\d.]+/g).slice(0, 3).map(Number);
    return (m[0] + m[1] + m[2]) / 3 < 100;
};
assert(beforeFaceDark(result.beforeR4.searchBg) && result.beforeR4.searchBorder === '0px', 'pre-R4 baseline is not the reported dark unframed block');
assert(result.beforeR4.capContrast < 2, 'pre-R4 caps were already readable; the reported defect is not reproduced');
assert(result.beforeR4.capHeight === '14px' && result.beforeR4.brandBorder === '0px', 'pre-R4 caps/brand were already reworked');
assert(parseFloat(result.beforeR4.dotRadius) > 100, 'pre-R4 status dot was not round');
const EDGE = 'rgb(26, 18, 38)';   /* --jk-chrome-edge #1a1226 */
const TEXT = 'rgb(22, 17, 42)';   /* --jk-chrome-ink  #16112a */
assert(result.fixtureOnly && result.bar.h === 32 && result.bar.bg === 'rgb(217, 127, 198)', 'bar height/pink regression');
assert(result.search.slot === 'tooltip-trigger' && result.winButtons.every((b) => b.slot === 'tooltip-trigger'), 'TooltipTrigger slot merge changed');
assert(result.search.w === 224 && result.search.h === 24 && ['inline-flex', 'flex'].includes(result.search.display), 'quick-search hit area/layout changed');
assert(result.search.bg === 'rgb(255, 184, 230)', 'quick-search face is not --wd-square');
assert(result.search.border === '1px solid ' + EDGE, 'quick-search frame is not 1px ink');
assert(result.search.radius === '0px' && result.search.shadow !== 'none', 'quick-search is not a pixel block');
assert(result.searchHover === 'rgb(255, 217, 239)', 'quick-search hover does not brighten');
assert(result.caps.length === 2 && result.caps[0].text === 'Ctrl' && result.caps[1].text === 'K', 'key caps missing');
assert(result.caps.every((c) => c.border === '1px solid ' + EDGE), 'key cap frame is not 1px ink');
assert(result.caps.every((c) => c.bg === 'rgb(255, 242, 251)' && c.color === TEXT), 'key cap face/text unreadable');
assert(result.caps.every((c) => c.contrast >= 10), 'key cap text contrast below 10:1');
assert(result.caps.every((c) => c.h === 16 && c.w >= 16 && c.y > result.search.y && c.y + c.h < result.search.y + result.search.h), 'key cap geometry escaped the control');
assert(result.capHover.bg === 'rgb(255, 242, 251)' && result.capHover.border === EDGE, 'key cap face changes on control hover');
assert(result.brand.h === 31 && result.brand.bg === 'rgb(205, 176, 232)' && result.brand.border === '1px solid ' + EDGE && result.brand.shadow !== 'none', 'brand plate missing');
assert(result.help.bg === 'rgb(205, 176, 232)' && result.help.border === '1px solid ' + EDGE && result.help.h === 31, 'help trigger plate missing');
assert(result.brandHover === 'rgb(255, 217, 239)' && result.helpOpen === 'rgb(255, 217, 239)', 'menu hover/open face does not brighten');
assert(result.brand.text === 'VRCX-0-jirai' && result.brand.textTransform === 'none', 'brand text was replaced or transformed');
assert(/WD Pixel CJK/.test(result.brand.fontFamily) && !/^"WD Pixel"/.test(result.brand.fontFamily), 'brand is not on the Fusion family');
assert(result.heart.content === '""' && result.heart.mask && result.heart.pointer === 'none' && result.heart.width === '12px', 'brand pixel heart missing');
assert(result.brand.w === result.brandWidthWithoutR4 + 7, 'brand width delta is not the intended +7px');
assert(result.dots.length === 2 && result.dots.every((d) => d.radius === '0px' && d.border === '1px solid ' + EDGE), 'status pixel is not a framed square');
assert(result.dots[0].fill === 'rgb(46, 211, 25)', 'semantic online fill changed');
assert(result.dots[1].fill === 'rgb(162, 148, 200)' && !/rgba|\/\s*0\./.test(result.dots[1].raw), 'disconnected pixel is still a see-through face');
assert(result.winButtons.length === 3 && result.winButtons.every((b) => b.w === 36 && b.h === 31 && b.border === '1px solid ' + EDGE && b.shadow !== 'none' && b.svg === '16px' && b.hit), 'window buttons regressed');
assert(result.winButtons[2].bg === 'rgb(240, 166, 203)', 'close resting face changed');
/* baseline from runtime/checks/r3-report.json: rgb(255, 107, 138) on rgb(22, 17, 42) */
assert(result.closeHover.bg === 'rgb(255, 107, 138)' && result.closeHover.color === TEXT, 'close hover destructive state changed');
assert(result.searchFocus.outline.startsWith('2px solid') && result.searchFocus.offset === '-3px', 'keyboard focus ring lost');
assert(result.focusable, 'controls are not keyboard reachable');

/* screenshots must show resting states: drop the temporary aria-expanded */
await page.evaluate(() => document.querySelectorAll("[data-slot='menubar-trigger']")[1].removeAttribute('aria-expanded'));
await page.evaluate(() => document.activeElement?.blur?.());
await page.hover('button.vrcx-0-toolbar-control');
await page.waitForTimeout(120);
await page.screenshot({ path: path.join(here, 'r4-chrome-titlebar-hover.png'), clip: { x: 1000, y: 0, width: 387, height: 34 } });
await page.mouse.move(700, 300);
await page.waitForTimeout(120);
await page.screenshot({ path: path.join(here, 'r4-chrome-titlebar.png'), clip: { x: 0, y: 0, width: 1387, height: 34 } });
await page.screenshot({ path: path.join(here, 'r4-chrome-brand.png'), clip: { x: 0, y: 0, width: 260, height: 34 } });
await page.screenshot({ path: path.join(here, 'r4-chrome-statusbar.png'), clip: { x: 0, y: 660, width: 500, height: 40 } });
result.cssBytes = Buffer.byteLength(chromeCss);
assert(result.cssBytes <= 15000, 'window-chrome.css budget exceeded');
await fs.writeFile(path.join(here, 'r4-chrome-report.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 1));
await browser.close();
