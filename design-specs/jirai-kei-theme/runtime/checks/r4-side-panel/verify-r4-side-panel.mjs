/* R4 right social panel check — DOM FIXTURE / NOT WINDOWS.
   Hand-built copy of the real shell + side panel structure (AppShellLayout.tsx,
   SidePanel.tsx) rendered through the real Base UI primitives (Tabs, Tooltip,
   ContextMenu, Button) with the app's own wrapper class strings and the app's
   compiled CSS, then the built theme sheet plus the current runtime sheets in
   build-runtime.mjs order. It is not a WebView2 run and proves nothing about the
   Windows host. Neutral sample text only; no user screenshot or friend name is
   copied into the repository. */
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
const { Tabs } = req('@base-ui/react/tabs');
const { Tooltip } = req('@base-ui/react/tooltip');
const { ContextMenu } = req('@base-ui/react/context-menu');
const { Button } = req('@base-ui/react/button');
const { UserSearchIcon, SquareUserIcon, UsersIcon, PlusIcon, MoreHorizontalIcon } = req('lucide-react');
const h = React.createElement;

/* verbatim from src/lib/segmented-control.ts */
const itemLayout = 'data-[orientation=horizontal]:flex-1 data-[orientation=vertical]:w-full';
const itemSize = { default: 'h-8 gap-1.5 px-3 text-xs', sm: 'h-7 gap-1 px-2.5 text-xs', xs: 'h-6 gap-1 px-2 text-[11px]' };

/* src/ui/shadcn/tabs.tsx:53-66 */
const TabsList = ({ variant = 'default', className = '', children }) =>
    h(
        Tabs.List,
        {
            className: [
                'text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5',
                'data-[orientation=vertical]:flex-col',
                variant === 'default'
                    ? 'text-muted-foreground/72 rounded-lg bg-(--state-pressed-surface) p-0.5'
                    : 'data-[orientation=horizontal]:py-1 data-[orientation=vertical]:px-1',
                className
            ].join(' '),
            'data-size': 'default',
            'data-slot': 'tabs-list'
        },
        children,
        h(Tabs.Indicator, {
            className:
                'absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out bg-foreground z-10 data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:translate-y-px data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:-translate-x-px',
            'data-slot': 'tab-indicator'
        })
    );

/* src/ui/shadcn/tabs.tsx:86-96 */
const TabsTab = ({ className = '', ...props }) =>
    h(Tabs.Tab, {
        className: [
            'hover:text-muted-foreground focus-visible:ring-ring data-active:text-foreground relative flex shrink-0 grow cursor-pointer items-center justify-center rounded-md border border-transparent text-base font-medium whitespace-nowrap transition-[color,background-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-inset data-disabled:pointer-events-none data-disabled:opacity-64 data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start sm:text-sm',
            itemLayout,
            itemSize.default,
            className
        ].join(' '),
        'data-size': 'default',
        'data-slot': 'tabs-tab',
        ...props
    });

/* SidePanel.tsx:504-602 */
const railTrigger = (value, active, Icon, count) =>
    h(
        ContextMenu.Root,
        { key: value },
        h(
            Tooltip.Root,
            null,
            h(Tooltip.Trigger, {
                'data-slot': 'tooltip-trigger',
                render: h(ContextMenu.Trigger, {
                    render: h(TabsTab, {
                        value,
                        'data-active': active ? '' : undefined,
                        className: 'data-active:bg-secondary h-auto w-full flex-col justify-center gap-0.5 px-0 py-1.5 sm:h-auto'
                    })
                })
            }, [
                h(Icon, { key: 'i', className: 'size-4.5', 'data-icon': 'icon' }),
                h('span', { key: 's', className: 'sr-only' }, 'rail tab ' + value),
                h('span', { key: 'c', className: 'text-[10px] leading-none tabular-nums' }, count)
            ])
        )
    );

/* A FriendsSidebar-ish body: one collapsible section header plus a tall list, so
   the panel has the same overflow/flex shape as the real one. No real names. */
const panelBody = h(
    'div',
    { className: 'flex min-h-0 flex-1 flex-col overflow-hidden' },
    h(
        'div',
        { 'data-slot': 'collapsible' },
        h(
            'button',
            {
                type: 'button',
                'data-variant': 'ghost',
                'data-size': 'sm',
                className: 'flex h-7 w-full items-center gap-2 rounded-full px-2'
            },
            h('span', { className: 'text-xs' }, 'SAMPLE GROUP'),
            h('span', { 'data-slot': 'badge', className: 'ml-auto text-[10px]' }, '4'),
            h('svg', { className: 'lucide lucide-chevron-down size-3.5' })
        )
    ),
    h(
        'div',
        { className: 'min-h-0 flex-1 overflow-hidden' },
        h(
            'div',
            { className: 'flex flex-col' },
            ['ALPHA SAMPLE', 'BRAVO SAMPLE', 'CHARLIE SAMPLE', 'DELTA SAMPLE', 'ECHO SAMPLE'].map((n, i) =>
                h(
                    'div',
                    { key: n, className: 'flex h-12 shrink-0 items-center gap-2 px-2 text-xs' },
                    h('span', { className: 'inline-block size-3.75 shrink-0 border' }),
                    h('span', { className: 'min-w-0 flex-1 truncate' }, n),
                    h(MoreHorizontalIcon, { className: 'size-3.5 shrink-0' })
                )
            )
        )
    )
);

const sidePanel = h(
    'aside',
    {
        className: 'vrcx-0-side-panel flex min-h-0 w-80 shrink-0 flex-col overflow-hidden',
        'data-vrcx-0-surface': 'side-panel',
        style: { width: '320px' }
    },
    h(
        'div',
        { className: 'vrcx-0-side-panel-self ml-2 flex shrink-0 items-center pt-4 pb-2 pl-2' },
        h('span', { className: 'text-xs' }, 'FIXTURE SELF')
    ),
    h(
        Tabs.Root,
        {
            orientation: 'vertical',
            value: 'tracked-nonfriends',
            className: 'flex min-h-0 min-w-0 flex-1 gap-0 overflow-hidden',
            'data-slot': 'tabs'
        },
        h(
            'div',
            { className: 'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-2 pl-2' },
            h(
                'div',
                { className: 'shrink-0 pt-1 pr-1.5 pb-2 pl-0.5' },
                h('input', {
                    'aria-label': 'filter sample',
                    placeholder: 'FILTER SAMPLE',
                    className: 'border-border-subtle h-7 w-full rounded-md border px-2 text-xs'
                })
            ),
            h(
                Tabs.Panel,
                {
                    value: 'tracked-nonfriends',
                    className: 'min-h-0 flex-1 overflow-hidden data-hidden:hidden',
                    'data-slot': 'tabs-content'
                },
                panelBody
            )
        ),
        h(
            'div',
            { className: 'vrcx-0-side-panel-rail flex w-9 shrink-0 flex-col items-center gap-0.5 py-1.5' },
            h(
                TabsList,
                { variant: 'underline', className: 'w-full flex-col gap-0.5 p-0 [&>[data-slot=tab-indicator]]:hidden' },
                railTrigger('tracked-nonfriends', true, UserSearchIcon, '21'),
                railTrigger('friends', false, SquareUserIcon, '15'),
                railTrigger('groups', false, UsersIcon, '60')
            ),
            h(
                Button,
                {
                    'data-slot': 'button',
                    'data-variant': 'ghost',
                    'data-size': 'icon',
                    type: 'button',
                    title: 'configure sample',
                    'aria-label': 'configure sample',
                    className: 'text-muted-foreground shrink-0'
                },
                h(PlusIcon, { 'data-icon': 'icon' })
            ),
            h('div', { className: 'mt-auto shrink-0' }, h('span', { className: 'inline-block size-4' }))
        )
    )
);

const shell = h(
    'div',
    { className: 'vrcx-0-app-root flex h-full w-full flex-col overflow-hidden', 'data-vrcx-0-surface': 'app-root' },
    h('header', { className: 'vrcx-0-titlebar flex h-8 shrink-0 items-center border-b px-2 text-xs' }, 'DOM FIXTURE / NOT WINDOWS'),
    h(
        'div',
        { className: 'flex min-h-0 min-w-0 flex-1' },
        h('nav', { className: 'vrcx-0-sidebar-surface w-10 shrink-0' }),
        h(
            'div',
            { className: 'vrcx-0-main-shell flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden' },
            h(
                'div',
                { className: 'vrcx-0-workspace flex min-h-0 min-w-0 flex-1 overflow-hidden', 'data-vrcx-0-surface': 'workspace' },
                h(
                    'div',
                    {
                        className: 'vrcx-0-main-content flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden',
                        'data-vrcx-0-surface': 'main-content'
                    },
                    h('div', { className: 'vrcx-0-page-scaffold', style: { padding: '8px' } }, 'MAIN SAMPLE')
                ),
                h('div', {
                    'data-vrcx-0-resize': 'side-panel',
                    className: 'z-20 w-(--vrcx-0-side-panel-resizer-width) shrink-0 cursor-ew-resize bg-transparent select-none'
                }),
                sidePanel
            )
        )
    ),
    h('footer', { className: 'vrcx-0-statusbar flex h-8 shrink-0 items-center border-t px-2 text-xs' }, 'STATUS SAMPLE')
);

const markup = renderToStaticMarkup(h(Tooltip.Provider, null, shell));
const fixture = path.join(here, 'r4-side-panel-fixture.html');
await fs.writeFile(fixture, '<!doctype html><html><head><meta charset="utf-8"><title>R4 side panel fixture</title></head><body style="margin:0">' + markup + '</body></html>');

const appCss = [
    path.join(app, 'dist/assets/index-Cckb3vVG.css'),
    path.join(app, 'dist/assets/App-C2mIqNXI.css')
];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1387, height: 1068 } });
await page.goto('file://' + fixture);
for (const f of appCss) await page.addStyleTag({ content: await fs.readFile(f, 'utf8') });
await page.addStyleTag({ content: await fs.readFile(process.env.BASELINE_CSS || path.join(runtime, 'preview-package/jirai-kei-theme/theme.css'), 'utf8') });

const probe = () => {
    const q = (s) => document.querySelector(s);
    const cs = (el, pseudo) => getComputedStyle(el, pseudo);
    const box = (el) => {
        const r = el.getBoundingClientRect();
        return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2), right: +r.right.toFixed(2), bottom: +r.bottom.toFixed(2) };
    };
    const toRgb = (col) => {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        const ctx = c.getContext('2d');
        ctx.fillStyle = col;
        ctx.fillRect(0, 0, 1, 1);
        const d = ctx.getImageData(0, 0, 1, 1).data;
        return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
    };
    const paint = (el, pseudo) => {
        const s = cs(el, pseudo);
        return {
            bg: toRgb(s.backgroundColor),
            color: toRgb(s.color),
            border: `${s.borderTopWidth}/${s.borderRightWidth}/${s.borderBottomWidth}/${s.borderLeftWidth} ${s.borderTopStyle} ${toRgb(s.borderTopColor)}`,
            rightBorder: toRgb(s.borderRightColor),
            leftBorder: toRgb(s.borderLeftColor),
            rawBg: s.backgroundColor,
            rawRightBorder: s.borderRightColor,
            radius: s.borderTopLeftRadius,
            outline: `${s.outlineWidth} ${s.outlineStyle} ${toRgb(s.outlineColor)}`,
            shadow: s.boxShadow,
            pointer: s.pointerEvents
        };
    };
    const panel = q('.vrcx-0-side-panel');
    const work = q('.vrcx-0-workspace');
    const inner = q(".vrcx-0-side-panel [data-slot='tabs'] > div:not(.vrcx-0-side-panel-rail)");
    const rail = q('.vrcx-0-side-panel-rail');
    const tabs = [...document.querySelectorAll(".vrcx-0-side-panel-rail [role='tab']")];
    const active = tabs.find((t) => t.hasAttribute('data-active'));
    const plus = q(".vrcx-0-side-panel-rail > [data-slot='button']");
    const resizer = q("[data-vrcx-0-resize='side-panel']");
    /* first list row wrapper: only used to prove the panel geometry is untouched */
    const list = q(".vrcx-0-side-panel [data-slot='tabs-content']") || inner;
    const vw = document.documentElement.clientWidth;
    const ws = box(work);
    const pb = box(panel);
    const ib = box(inner);
    const rb = box(rail);
    const wall = cs(work);
    return {
        fixtureOnly: true,
        viewport: { vw, vh: document.documentElement.clientHeight },
        workspace: { ...ws, margin: `${wall.marginTop} ${wall.marginRight} ${wall.marginBottom} ${wall.marginLeft}`, shadow: wall.boxShadow, radius: wall.borderTopLeftRadius },
        mainContent: { ...box(q('.vrcx-0-main-content')), margin: cs(q('.vrcx-0-main-content')).margin },
        resizer: { ...box(resizer), ...paint(resizer) },
        panel: { ...pb, ...paint(panel) },
        social: { content: cs(panel, '::before').content, height: cs(panel, '::before').height, bg: toRgb(cs(panel, '::before').backgroundColor), borderBottom: toRgb(cs(panel, '::before').borderBottomColor), font: cs(panel, '::before').fontFamily },
        inner: { ...ib, ...paint(inner) },
        rail: { ...rb, ...paint(rail) },
        tabs: tabs.map((t) => ({
            label: t.querySelector('.sr-only')?.textContent,
            active: t.hasAttribute('data-active'),
            ariaSelected: t.getAttribute('aria-selected'),
            slot: t.dataset.slot,
            role: t.getAttribute('role'),
            ...box(t),
            ...paint(t),
            before: { content: cs(t, '::before').content, width: cs(t, '::before').width, left: cs(t, '::before').left, bg: toRgb(cs(t, '::before').backgroundColor), pointer: cs(t, '::before').pointerEvents },
            after: { content: cs(t, '::after').content, width: cs(t, '::after').width, right: cs(t, '::after').right, bg: toRgb(cs(t, '::after').backgroundColor), pointer: cs(t, '::after').pointerEvents }
        })),
        plus: { ...box(plus), ...paint(plus) },
        /* geometry relations the task asks about */
        gaps: {
            gutterRight: +(vw - pb.right).toFixed(2),
            workRightGap: +(vw - ws.right).toFixed(2),
            workTopGap: +(box(q('.vrcx-0-main-shell')).y - ws.y).toFixed(2),
            railToInner: +(rb.x - ib.right).toFixed(2),
            activeTabToInner: active ? +(box(active).x - ib.right).toFixed(2) : null,
            panelOverflowX: panel.scrollWidth - panel.clientWidth,
            railOverflowX: rail.scrollWidth - rail.clientWidth,
            listWidth: box(list).w,
            listHeight: box(list).h,
            rowHeight: box(q(".vrcx-0-side-panel [data-slot='tabs-content'] .h-12")).h
        },
        noDrag: (() => {
            const r = resizer.getBoundingClientRect();
            const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
            return hit === resizer;
        })(),
        tabIconsMasked: tabs.every((t) => {
            const s = cs(t.querySelector('svg'));
            return s.maskImage !== 'none' || s.webkitMaskImage !== 'none';
        })
    };
};

/* --- before: built R3 sheet + current runtime sheets, no R4 side-panel css --- */
const runtimeSheets = ['windose-runtime.css', 'window-chrome.css', 'group-spacing.css', 'fonts-pixel-body.css'];
for (const f of runtimeSheets) await page.addStyleTag({ content: await fs.readFile(path.join(runtime, f), 'utf8') });
await page.evaluate(async () => {
    await document.fonts.load('12px "WD Pixel CJK"', 'SAMPLE GROUP SOCIAL');
    await document.fonts.ready;
});
await page.mouse.move(700, 500);
await page.waitForTimeout(600);
const before = await page.evaluate(probe);
await page.screenshot({ path: path.join(here, 'r4-side-panel-before.png') });

/* --- after: the new side-panel sheet --- */
const myCss = await fs.readFile(path.join(runtime, 'side-panel-r4.css'), 'utf8');
await page.addStyleTag({ content: myCss });
await page.mouse.move(700, 500);
await page.waitForTimeout(600);
const after = await page.evaluate(probe);
await page.screenshot({ path: path.join(here, 'r4-side-panel-after.png') });

/* crop of the rail + panel edge, both states */
const clip = { x: after.panel.x, y: after.panel.y, width: after.panel.w + 4, height: 420 };
await page.screenshot({ path: path.join(here, 'r4-side-panel-after-rail.png'), clip });
const railHead = { x: after.panel.right - 120, y: after.panel.y, width: 124, height: 300 };
await page.screenshot({ path: path.join(here, 'r4-side-panel-after-tabs.png'), clip: railHead });

/* hover state on a resting tab */
await page.hover(".vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab']:not([data-active])");
await page.waitForTimeout(250);
const hover = await page.evaluate(() => {
    const t = document.querySelector(".vrcx-0-side-panel .vrcx-0-side-panel-rail [role='tab']:not([data-active])");
    const s = getComputedStyle(t);
    return { bg: s.backgroundColor, color: s.color };
});
await page.screenshot({ path: path.join(here, 'r4-side-panel-after-tab-hover.png'), clip: railHead });

/* --- narrow + sidebar-window mode must not overflow --- */
const narrow = [];
for (const w of [320, 240]) {
    await page.setViewportSize({ width: w + 60, height: 900 });
    await page.evaluate((pw) => {
        document.querySelector('.vrcx-0-side-panel').style.width = pw + 'px';
    }, w);
    await page.waitForTimeout(120);
    narrow.push(await page.evaluate(() => {
        const p = document.querySelector('.vrcx-0-side-panel');
        const rail = document.querySelector('.vrcx-0-side-panel-rail');
        const inner = document.querySelector(".vrcx-0-side-panel [data-slot='tabs'] > div:not(.vrcx-0-side-panel-rail)");
        const t = document.querySelector(".vrcx-0-side-panel-rail [role='tab'][data-active]");
        return {
            panelWidth: +p.getBoundingClientRect().width.toFixed(2),
            panelOverflowX: p.scrollWidth - p.clientWidth,
            railOverflowX: rail.scrollWidth - rail.clientWidth,
            innerWidth: +inner.getBoundingClientRect().width.toFixed(2),
            tabWidth: +t.getBoundingClientRect().width.toFixed(2),
            tabFits: t.getBoundingClientRect().right <= p.getBoundingClientRect().right + 0.5,
            activeLeft: +t.getBoundingClientRect().x.toFixed(2),
            innerRight: +inner.getBoundingClientRect().right.toFixed(2)
        };
    }));
}
await page.setViewportSize({ width: 1387, height: 1068 });
await page.evaluate(() => {
    document.querySelector('.vrcx-0-side-panel').style.width = '320px';
});

/* --- pixel proof that the panel rule is cut only behind the selected tab --- */
const analyseStrip = async (buf) =>
    page.evaluate(async (b64) => {
        const img = new Image();
        img.src = 'data:image/png;base64,' + b64;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        const counts = {};
        for (let i = 0; i < d.length; i += 4) {
            const k = `${d[i]},${d[i + 1]},${d[i + 2]}`;
            counts[k] = (counts[k] || 0) + 1;
        }
        return counts;
    }, buf.toString('base64'));
const stripAt = (right, y) => page.screenshot({ clip: { x: right - 2, y: y + 10, width: 5, height: 20 } });
const fusedStrip = await analyseStrip(await stripAt(after.inner.right, after.tabs[0].y));
const restingStrip = await analyseStrip(await stripAt(after.inner.right, after.tabs[1].y));

/* --- keyboard focus must still show the app's ring, and the panel must not
       leak its rules into a layout without a right rail --- */
await page.focus(".vrcx-0-side-panel-rail [role='tab'][data-active]");
await page.waitForTimeout(120);
const focusSelected = await page.evaluate(() => {
    const t = document.querySelector(".vrcx-0-side-panel-rail [role='tab'][data-active]");
    const s = getComputedStyle(t);
    return { shadow: s.boxShadow, afterBg: getComputedStyle(t, '::after').backgroundColor, afterWidth: getComputedStyle(t, '::after').width };
});
await page.screenshot({ path: path.join(here, 'r4-side-panel-after-tab-focus.png'), clip: railHead });

const noPanel = await page.evaluate(() => {
    const w = document.querySelector('.vrcx-0-workspace');
    const p = document.querySelector('.vrcx-0-side-panel');
    const r = document.querySelector("[data-vrcx-0-resize='side-panel']");
    const mc = document.querySelector('.vrcx-0-main-content');
    const rRef = r, pRef = p;
    p.remove();
    r.remove();
    const cs = getComputedStyle(w);
    const shadowBefore = cs.boxShadow;
    /* tokens set --vrcx-0-main-content-lift:none, which kills the whole
       box-shadow declaration; prove it by supplying a valid value. */
    document.documentElement.style.setProperty('--vrcx-0-main-content-lift', '0 0 #0000');
    const shadowWithValidLift = getComputedStyle(w).boxShadow;
    document.documentElement.style.removeProperty('--vrcx-0-main-content-lift');
    const out = { margin: cs.margin, shadow: shadowBefore, radius: cs.borderTopLeftRadius, mainMargin: getComputedStyle(mc).margin, shadowWithValidLift };
    mc.after(rRef);
    w.appendChild(pRef);
    return out;
});

const sidebarMode = await page.evaluate(() => {
    const w = document.querySelector('.vrcx-0-workspace');
    const mc = document.querySelector('.vrcx-0-main-content');
    const p = document.querySelector('.vrcx-0-side-panel');
    w.setAttribute('data-window-sidebar-mode', 'true');
    p.setAttribute('data-window-sidebar-mode', 'true');
    mc.classList.add('hidden');
    p.style.width = '100%';
    const t = document.querySelector(".vrcx-0-side-panel-rail [role='tab'][data-active]");
    const out = {
        panelWidth: +p.getBoundingClientRect().width.toFixed(2),
        viewport: document.documentElement.clientWidth,
        overflow: p.scrollWidth - p.clientWidth,
        margin: getComputedStyle(w).margin,
        tabFits: t.getBoundingClientRect().right <= p.getBoundingClientRect().right + 0.5
    };
    w.removeAttribute('data-window-sidebar-mode');
    p.removeAttribute('data-window-sidebar-mode');
    mc.classList.remove('hidden');
    p.style.width = '320px';
    return out;
});
await page.screenshot({ path: path.join(here, 'r4-side-panel-after.png') });

const assert = (v, m) => {
    if (!v) throw new Error(m);
};

/* (4) the mysterious margin: before has a gutter, after has none. */
assert(before.gaps.gutterRight > 8, 'before: expected a gutter to the right of the rail, got ' + before.gaps.gutterRight);
assert(after.gaps.gutterRight === 0 && after.gaps.workTopGap === 0, 'after: rail still separated from the window edge: ' + JSON.stringify(after.gaps));
// Leader R4: only top/right/bottom leave the workspace; margin-left stays app-owned (collapsed-nav gutter).
{ const box=s=>{const v=s.split(' ');return [v[0],v[1]??v[0],v[2]??v[0],v[3]??v[1]??v[0]];}; const [t,r,b,l]=box(after.workspace.margin); const [mt,mr,mb,ml]=box(after.mainContent.margin);
  assert(t==='0px'&&r==='0px'&&b==='0px'&&l!=='0px'&&ml==='0px'&&mt!=='0px'&&mb!=='0px' && before.workspace.margin !== after.workspace.margin, 'workspace top/right/bottom not moved onto the main content: '+after.workspace.margin+' / '+after.mainContent.margin); }
assert(after.mainContent.margin === '6px 0px 10px', 'main content lost its top/bottom card spacing (left gutter is workspace-owned): ' + after.mainContent.margin);
assert(after.resizer.bg !== before.resizer.bg && after.resizer.bg === 'rgb(32, 25, 54)', 'resize slot still shows the dark canvas seam: ' + after.resizer.bg);
assert(after.workspace.shadow === 'none', 'workspace edge frame still drawn around the rail');
/* the handle keeps its hit box */
assert(after.resizer.w === before.resizer.w && after.noDrag && before.noDrag, 'resize handle hit box regressed');
/* panel frame */
assert(after.panel.rightBorder !== 'rgb(0, 0, 0)' && after.panel.leftBorder !== 'rgb(0, 0, 0)', 'panel frame missing');

/* (9) tabs: real attributes, selected fused with the panel, resting darker */
assert(after.tabs.length === 3 && after.tabs.every((t) => t.role === 'tab' && t.slot === 'tooltip-trigger'), 'rail tabs are not role=tab tooltip-trigger');
assert(after.tabs.filter((t) => t.active).length === 1 && after.tabs[0].ariaSelected === 'true', 'active tab attribute/aria missing');
assert(after.tabs[0].bg === 'rgb(42, 33, 71)' && after.tabs[0].rightBorder === 'rgb(108, 92, 224)' && after.tabs[0].leftBorder !== 'rgb(108, 92, 224)', 'selected tab face/frame wrong: ' + JSON.stringify(after.tabs[0]));
assert(after.tabs[0].color === 'rgb(255, 127, 207)' && after.tabs[0].after.bg === 'rgb(255, 127, 207)' && after.tabs[0].after.pointer === 'none' && parseFloat(after.tabs[0].after.width) >= 3, 'pink accent missing: ' + JSON.stringify(after.tabs[0].after));
/* the app's focus ring is a box-shadow: never steal it from the selected tab */
assert(after.tabs[0].shadow === 'none' && after.tabs[1].shadow === 'none', 'selected tab overrides the focus ring box-shadow: ' + after.tabs[0].shadow);
assert(after.tabs[1].bg !== after.tabs[0].bg && after.tabs[1].rawRightBorder === 'rgba(0, 0, 0, 0)' && after.tabs.every((t) => t.border.startsWith('1px')), 'resting tab is not darker/frameless: ' + JSON.stringify({ resting: after.tabs[1].rawBg, selected: after.tabs[0].rawBg, border: after.tabs[1].rawRightBorder }));
assert(after.tabs[0].before.pointer === 'none' && parseFloat(after.tabs[0].before.width) >= 2, 'selected tab does not cut the panel rule');
assert(Math.abs(after.gaps.activeTabToInner) < 0.6 && Math.abs(after.gaps.railToInner) < 0.6, 'tab strip is not flush with the panel edge: ' + JSON.stringify(after.gaps));
/* before: the theme's [data-slot='tabs-tab'][data-active] rule never matched these
   tabs (the Tooltip wrapper owns data-slot), so selection came from the app's own
   low-contrast bg-secondary utility and carried no frame at all. */
assert(before.tabs[0].rawRightBorder === 'rgba(0, 0, 0, 0)' && before.tabs[0].shadow === 'none' && before.tabs[0].before.content === 'none' && before.tabs[1].rawBg === 'rgba(0, 0, 0, 0)' && before.tabs[0].w < after.tabs[0].w, 'before: rail tabs already carried the R4 frame/accent: ' + JSON.stringify(before.tabs[0]));
/* The panel must keep its own geometry apart from the two intended effects:
   1px less width because the pane gained a right frame (border-box), and the
   height the workspace gutter used to steal (6px top + 10px bottom) minus the
   pane's new 1px top/bottom frames. Row height itself must not move. */
assert(Math.abs(after.gaps.listWidth - before.gaps.listWidth + 1) < 0.6, 'panel width changed by more than the 1px frame: ' + before.gaps.listWidth + ' -> ' + after.gaps.listWidth);
assert(Math.abs(after.gaps.listHeight - before.gaps.listHeight - 14) < 0.6, 'panel height changed by an unexpected amount: ' + before.gaps.listHeight + ' -> ' + after.gaps.listHeight);
assert(after.gaps.rowHeight === before.gaps.rowHeight, 'list row height changed: ' + before.gaps.rowHeight + ' -> ' + after.gaps.rowHeight);
assert(!('108,92,224' in fusedStrip), 'panel right rule still drawn behind the selected tab: ' + JSON.stringify(fusedStrip));
assert('108,92,224' in restingStrip, 'panel right rule missing behind a resting tab: ' + JSON.stringify(restingStrip));
assert(narrow.every((n) => n.panelOverflowX <= 0 && n.railOverflowX <= 0 && n.tabFits), 'narrow rail overflows: ' + JSON.stringify(narrow));

assert(focusSelected.shadow !== 'none', 'keyboard focus ring lost on the selected tab');
assert(focusSelected.afterBg === 'rgb(255, 127, 207)', 'pink spine lost while focused');
assert(noPanel.margin === '6px 12px 10px' && noPanel.mainMargin === '0px', 'panel rules leaked into the rail-less layout: ' + JSON.stringify(noPanel));
assert(noPanel.shadowWithValidLift !== 'none' && noPanel.shadow === 'none', 'workspace edge expectation changed: ' + JSON.stringify(noPanel));
/* 40px is the fixture's navigation column; the panel owns the rest of the window. */
assert(sidebarMode.overflow <= 0 && sidebarMode.tabFits && Math.abs(sidebarMode.panelWidth + 40 - sidebarMode.viewport) < 1 && sidebarMode.margin === '0px', 'sidebar-only window mode overflow: ' + JSON.stringify(sidebarMode));

const report = { fixtureOnly: true, cssBytes: Buffer.byteLength(myCss), before, after, hover, narrow, focusSelected, noPanel, sidebarMode, strips: { fused: fusedStrip, resting: restingStrip } };
await fs.writeFile(path.join(here, 'r4-side-panel-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ cssBytes: report.cssBytes, beforeGaps: before.gaps, afterGaps: after.gaps, beforeTabs: before.tabs.map((t) => ({ bg: t.bg, border: t.rightBorder })), afterTabs: after.tabs.map((t) => ({ bg: t.bg, border: t.rightBorder, color: t.color, shadow: t.shadow })), hover, narrow, resizerBefore: before.resizer.bg, resizerAfter: after.resizer.bg, mainMargin: after.mainContent.margin, wsShadow: after.workspace.shadow }, null, 2));
await browser.close();
