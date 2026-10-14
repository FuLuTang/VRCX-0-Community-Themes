/* NOT WINDOWS: source-shaped fixture for R8 chrome paint/contrast regression checks. */
import fs from 'node:fs/promises';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const runtime = new URL('../../', import.meta.url);
const out = new URL('./', import.meta.url);
const files = [
    'windose-runtime.css',
    'window-chrome.css',
    'navigation-r7.css',
    'motion-r5.css',
    'motion-r7.css',
    'motion-r8.css'
];
const baseCss = await Promise.all(
    files.map((file) => fs.readFile(new URL(file, runtime), 'utf8'))
);
const r8Css = await fs.readFile(new URL('../../chrome-r8.css', import.meta.url), 'utf8');

if (Buffer.byteLength(r8Css, 'utf8') > 25 * 1024) {
    throw new Error(`chrome-r8.css exceeds 25 KiB: ${Buffer.byteLength(r8Css, 'utf8')} bytes`);
}
if (/@import\s|https?:\/\//i.test(r8Css)) {
    throw new Error('R8 CSS must not import or request remote resources');
}
if (/\.vrcx-0-statusbar\s*::after|\.vrcx-0-main-content\s*::(?:before|after)/i.test(r8Css)) {
    throw new Error('R8 touched a protected pseudo-element');
}
if (/--status-(?:online|active)|--status-online|--status-active/i.test(r8Css)) {
    throw new Error('R8 must not change semantic status colors');
}

const labels = ['好友动态', '好友位置', '游戏日志', '房间历史', '房内玩家', '搜索', '浏览记录', '收藏', '社交', '我的模型', '活动', '好友关系图', '双人关系', '关系时间轴', '工具'];
const menuButton = (label, index) => `<li data-sidebar="menu-item"><button type="button" data-sidebar="menu-button" class="peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm h-8"><span class="menu-icon" aria-hidden="true">${index === 0 ? '▦' : '◇'}</span><span class="label">${label}</span></button></li>`;
const svg = (path) => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="${path}"/></svg>`;
const dot = (color, labelClass = 'text-content-tertiary') => `<span class="status-dot size-2 rounded-full" style="background-color:${color}"></span><span class="${labelClass} text-xs">`;

const html = `<!doctype html><html class="r8-before"><head><meta charset="utf-8"><style>
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:#16112a;color:#f2ebff;font-family:system-ui,sans-serif}body{overflow:hidden}
:root{--jk-mask-s1-s:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 8'%3E%3Cpath fill='%23000' d='M0 0H16V2A8 6 0 0 1 0 2ZM6.8 4.52a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0Z'/%3E%3C/svg%3E");--jk-mask-s7-s:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='%23000' d='M6 11 1 6C-1 3 1 0 4 1l2 2 2-2c3-1 5 2 3 5z'/%3E%3C/svg%3E");--status-online:#2ed319;--status-active:#2ed319}
.vrcx-0-app-root{height:100vh;display:flex;flex-direction:column;background:#16112a}
.vrcx-0-titlebar{height:32px;flex:none;display:flex;align-items:center;gap:0;padding:0}
.titlebar-left{height:100%;display:flex;flex:1 1 auto;min-width:0;align-items:center}
[data-slot="menubar"]{height:100%;display:flex;align-items:center;gap:2px}
[data-slot="menubar-trigger"]{height:100%;padding:0 12px;border:0;background:#cdb0e8;color:#16112a;font-size:14px;line-height:1}
.vrcx-0-brand{position:relative;display:inline-block;padding-right:5px;font-weight:600}
.titlebar-spacer{height:100%;flex:1 1 auto;min-width:0}
.titlebar-actions{height:100%;display:flex;flex:none;align-items:center;gap:4px;padding:0 4px}
.titlebar-actions button{height:28px;min-width:28px;padding:0 6px;border:0;background:transparent;color:#16112a;display:inline-flex;align-items:center;justify-content:center}
.titlebar-actions button svg{width:16px;height:16px;display:block}
.titlebar-actions .vrcx-0-toolbar-control{width:180px;justify-content:flex-start;gap:6px;white-space:nowrap;overflow:hidden}
.titlebar-actions kbd{margin-left:auto;border:1px solid #3b2a45;background:#fff1f8;padding:1px 4px;font:10px/12px monospace}
.window-controls{height:100%;display:flex;flex:none;align-items:stretch}
.window-controls button{width:36px;height:32px;padding:0;border:0;border-radius:0;display:flex;align-items:center;justify-content:center;background:#cdb0e8;color:#16112a;font-size:18px}
.vrcx-0-workspace{display:flex;flex:1 1 auto;min-height:0}
[data-slot="sidebar"]{width:260px;flex:none;min-height:0}
[data-slot="sidebar-inner"]{height:100%;display:flex;flex-direction:column;min-height:0}
[data-sidebar="content"]{flex:1 1 auto;min-height:0;overflow:auto}
[data-sidebar="content"] [data-sidebar="menu"]{margin:4px 0;padding:4px;list-style:none}
[data-sidebar="footer"]{flex:none}
[data-sidebar="menu-button"]{height:36px;padding:7px 8px;text-align:left;white-space:nowrap}
.menu-icon{width:18px;flex:none;text-align:center}
[data-sidebar="menu-button"] .label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vrcx-0-main-content{position:relative;flex:1 1 auto;min-width:0;overflow:hidden;background:#201936;padding:26px}
.fixture-mark{display:inline-block;padding:6px 10px;border:1px solid #6c5ce0;background:#211a33;color:#ffe4f5;font:12px/18px monospace;letter-spacing:.04em}
.fixture-note{margin-top:14px;color:#b9add9;font:14px/22px system-ui,sans-serif}
.vrcx-0-statusbar{flex:none;min-height:24px;padding:0 6px;display:flex;align-items:center}
.vrcx-0-statusbar>div{width:100%;display:flex;flex-direction:row;align-items:center;justify-content:space-between;min-height:24px}
.status-group{display:flex;min-width:0;align-items:center;gap:0}
.status-segment{height:24px;display:flex;flex:none;align-items:center;gap:6px;padding:0 8px;white-space:nowrap}
.status-dot{width:8px;height:8px;flex:none}
html.r8-before .vrcx-0-statusbar>div[class~="min-h-6"]{background:transparent;box-shadow:none}
html.r8-before .vrcx-0-statusbar :is([class*="text-content-"],[class*="text-muted-foreground"]){color:#6254a9!important}
/* Fixture-only RGB sentinel: R8 must leave the app-owned ::after untouched. */
.vrcx-0-statusbar[data-vrcx-0-surface="statusbar"]::after{content:"";position:absolute;z-index:2;right:0;top:1px;width:2px;height:16px;pointer-events:none;background:linear-gradient(#ff3bd4,#3be2ff,#ffd334)}
</style></head><body><div class="vrcx-0-app-root">
<header class="vrcx-0-titlebar text-foreground pointer-events-auto relative z-[60] flex h-8 shrink-0 items-center select-none" data-app-titlebar="true" data-vrcx-0-surface="titlebar">
  <div class="titlebar-left" data-tauri-drag-region><nav data-slot="menubar"><button type="button" data-slot="menubar-trigger"><span class="vrcx-0-brand">VRCX-0-jirai</span></button><button type="button" data-slot="menubar-trigger">帮助</button></nav><div class="titlebar-spacer" data-tauri-drag-region></div></div>
  <div class="titlebar-actions">
    <button type="button" data-slot="button" data-vrcx-0-control="toolbar" class="vrcx-0-toolbar-control" aria-label="快速搜索">${svg('M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M16 16l5 5')}<span>快速搜索</span><kbd>Ctrl K</kbd></button>
    <button type="button" data-slot="button" aria-label="通知">${svg('M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4')}</button>
    <button type="button" data-slot="button" aria-label="助手">${svg('M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z')}</button>
    <button type="button" data-slot="button" aria-label="主题" aria-pressed="false">${svg('M12 3a9 9 0 1 0 9 9h-9z')}</button>
    <button type="button" data-slot="button" aria-label="置顶">${svg('M8 3h8l-1 6 3 3v2H6v-2l3-3zM12 14v7')}</button>
    <button type="button" data-slot="button" aria-label="侧栏">${svg('M4 4h16v16H4zM15 4v16')}</button>
  </div>
  <div class="window-controls"><button type="button" data-slot="button" class="w-9 h-full rounded-none border-0" aria-label="最小化">−</button><button type="button" data-slot="button" class="w-9 h-full rounded-none border-0" aria-label="最大化">□</button><button type="button" data-slot="button" class="w-9 h-full rounded-none border-0 hover:bg-destructive! hover:text-destructive-foreground!" aria-label="关闭">×</button></div>
</header>
<div class="vrcx-0-workspace"><div data-slot="sidebar" data-state="expanded"><div data-slot="sidebar-inner" class="vrcx-0-sidebar-surface flex h-full flex-col">
  <div data-sidebar="content"><div data-sidebar="group"><div data-sidebar="group-content"><ul data-sidebar="menu">${labels.map(menuButton).join('')}</ul></div></div></div>
  <div data-sidebar="footer" class="flex flex-col"><ul data-sidebar="menu">${menuButton('设置', 70)}${menuButton('收起导航栏', 71)}</ul></div>
</div></div><main class="vrcx-0-main-content"><div id="fixture-mark" class="fixture-mark">NOT WINDOWS · BEFORE</div><div class="fixture-note">标题栏 / 导航 footer / 状态栏视觉验证。内容为合成占位，不含真实好友资料。</div></main></div>
<footer class="vrcx-0-statusbar @container/statusbar text-xs backdrop-blur" data-vrcx-0-surface="statusbar"><div class="flex min-h-6 flex-col gap-1 overflow-hidden">
  <div class="status-group status-left"><div class="status-segment">${dot('#2ed319')}服务器状态</span></div><div class="status-segment">${dot('#2ed319')}实时连接</span></div><div class="status-segment">${dot('#2ed319')}VRChat</span></div><div class="status-segment">${dot('#a294c8')}SteamVR</span></div></div>
  <div class="status-group status-right"><div class="status-segment">${dot('#2ed319')}增强型信息抓取</span><span class="text-content-secondary text-xs">101/101</span></div><div class="status-segment"><span class="text-content-tertiary text-xs">界面缩放</span><span class="text-content-secondary text-xs">100%</span></div></div>
</div></footer></div></body></html>`;

function rgb(value) {
    const values = value.match(/[\d.]+/g);
    if (!values || values.length < 3) throw new Error(`Unsupported color: ${value}`);
    return values.slice(0, 3).map(Number);
}
function luminance(value) {
    const [r, g, b] = rgb(value).map((channel) => {
        const c = channel / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(foreground, background) {
    const a = luminance(foreground);
    const b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
async function meatPinkPixels(buffer, region, tolerance = 36) {
    const { data, info } = await sharp(buffer).extract(region).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const target = [217, 127, 198];
    let count = 0;
    for (let i = 0; i < data.length; i += info.channels) {
        const dr = data[i] - target[0];
        const dg = data[i + 1] - target[1];
        const db = data[i + 2] - target[2];
        if (dr * dr + dg * dg + db * db <= tolerance * tolerance) count += 1;
    }
    const total = info.width * info.height;
    return { width: info.width, height: info.height, totalPixels: total, meatPinkPixels: count, percent: Number((100 * count / total).toFixed(3)), toleranceRgb: tolerance };
}
async function statusState(page) {
    return page.evaluate(() => {
        const bar = document.querySelector('.vrcx-0-statusbar[data-vrcx-0-surface="statusbar"]');
        const inner = bar.querySelector(':scope > div');
        const left = bar.querySelector('.status-left .status-segment .text-content-tertiary');
        const right = bar.querySelector('.status-right .status-segment .text-content-tertiary');
        const dots = [...bar.querySelectorAll('.status-dot')].map((dot) => getComputedStyle(dot).backgroundColor);
        return {
            outer: getComputedStyle(bar).backgroundColor,
            inner: getComputedStyle(inner).backgroundColor,
            leftText: getComputedStyle(left).color,
            rightText: getComputedStyle(right).color,
            leftLabel: left.textContent.trim(),
            rightLabel: right.textContent.trim(),
            dots,
            height: bar.getBoundingClientRect().height
        };
    });
}
async function protectedPseudoState(page) {
    return page.evaluate(() => {
        const bar = document.querySelector('.vrcx-0-statusbar[data-vrcx-0-surface="statusbar"]');
        const before = getComputedStyle(bar, '::before');
        const after = getComputedStyle(bar, '::after');
        const pick = (style) => ({
            content: style.content,
            position: style.position,
            top: style.top,
            right: style.right,
            bottom: style.bottom,
            left: style.left,
            width: style.width,
            height: style.height,
            transform: style.transform,
            pointerEvents: style.pointerEvents,
            animationName: style.animationName,
            animationDuration: style.animationDuration,
            animationTimingFunction: style.animationTimingFunction,
            backgroundColor: style.backgroundColor,
            backgroundImage: style.backgroundImage,
            backgroundRepeat: style.backgroundRepeat,
            backgroundPosition: style.backgroundPosition,
            backgroundSize: style.backgroundSize,
            maskImage: style.maskImage || style.webkitMaskImage
        });
        return { before: pick(before), after: pick(after) };
    });
}
async function mount(page) {
    await page.setContent(html, { waitUntil: 'load' });
    for (const css of baseCss) await page.addStyleTag({ content: css });
    /* Keep the historical R7 comparison explicit in this test fixture. Current runtime
       CSS no longer carries the obsolete R3 fill; R8's current face is the only bundled one. */
    await page.addStyleTag({ content: `html.r8-before .vrcx-0-statusbar[data-vrcx-0-surface='statusbar']{background-color:#d97fc6;color:#16112a}` });
    await page.evaluate(() => document.fonts.ready);
}

const browser = await chromium.launch({ headless: true });
const report = { fixture: 'NOT WINDOWS · source-shaped R8 UI only', cssBytes: Buffer.byteLength(r8Css, 'utf8') };
try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    await mount(page);
    const beforeStatus = await statusState(page);
    const beforePseudo = await protectedPseudoState(page);
    const beforeBarBox = await page.locator('.vrcx-0-statusbar').boundingBox();
    await page.screenshot({ path: new URL('before.png', out).pathname, fullPage: true });
    await page.locator('.vrcx-0-titlebar').screenshot({ path: new URL('titlebar-before.png', out).pathname });
    await page.locator('.vrcx-0-statusbar').screenshot({ path: new URL('statusbar-before.png', out).pathname });

    await page.locator('html').evaluate((el) => el.classList.remove('r8-before'));
    await page.addStyleTag({ content: r8Css });
    await page.locator('#fixture-mark').evaluate((el) => { el.textContent = 'NOT WINDOWS · AFTER R8'; });
    await page.screenshot({ path: new URL('after.png', out).pathname, fullPage: true });
    await page.locator('.vrcx-0-titlebar').screenshot({ path: new URL('titlebar-after.png', out).pathname });
    await page.locator('.vrcx-0-statusbar').screenshot({ path: new URL('statusbar-after.png', out).pathname });
    const afterStatus = await statusState(page);
    const afterPseudo = await protectedPseudoState(page);
    const afterBarBox = await page.locator('.vrcx-0-statusbar').boundingBox();

    const header = await page.evaluate(() => {
        const brand = document.querySelector('.vrcx-0-brand').closest('[data-slot="menubar-trigger"]');
        const close = document.querySelector('.window-controls button[aria-label="关闭"]');
        const mid = document.querySelector('.titlebar-actions button[aria-label="主题"]');
        const state = (el) => {
            const s = getComputedStyle(el);
            return { background: s.backgroundColor, border: s.borderTopColor, borderWidth: s.borderTopWidth, radius: s.borderRadius };
        };
        return { brand: state(brand), close: state(close), middleRadius: getComputedStyle(mid).borderRadius };
    });
    if (header.brand.background !== header.close.background || header.brand.border !== header.close.border || header.brand.borderWidth !== header.close.borderWidth) {
        throw new Error(`Brand and window-control plates diverged: ${JSON.stringify(header)}`);
    }
    if (header.brand.radius !== header.close.radius || header.brand.radius !== '0px') {
        throw new Error(`Outer titlebar corners are not symmetric/square: ${JSON.stringify(header)}`);
    }
    const pressed = await page.locator('.titlebar-actions button[aria-label="主题"]').evaluate((el) => {
        el.setAttribute('aria-pressed', 'true');
        const s = getComputedStyle(el);
        return { background: s.backgroundColor, border: s.borderTopColor };
    });
    await page.locator('.window-controls button[aria-label="最大化"]').hover();
    const windowHover = await page.locator('.window-controls button[aria-label="最大化"]').evaluate((el) => ({
        background: getComputedStyle(el).backgroundColor,
        color: getComputedStyle(el).color
    }));
    await page.locator('.window-controls button[aria-label="关闭"]').hover();
    const closeHover = await page.locator('.window-controls button[aria-label="关闭"]').evaluate((el) => ({
        background: getComputedStyle(el).backgroundColor,
        color: getComputedStyle(el).color
    }));
    await page.locator('.titlebar-actions button[aria-label="助手"]').hover();
    const middleHover = await page.locator('.titlebar-actions button[aria-label="助手"]').evaluate((el) => getComputedStyle(el).backgroundColor);
    const closeHoverContrast = contrast(closeHover.color, closeHover.background);
    if (pressed.background !== middleHover || middleHover !== windowHover.background) {
        throw new Error(`Non-destructive titlebar interaction states diverged: ${JSON.stringify({ pressed, middleHover, windowHover })}`);
    }
    if (closeHover.background === windowHover.background || closeHoverContrast < 4.5) {
        throw new Error(`Close hover lost its danger cue or text contrast: ${JSON.stringify({ closeHover, windowHover, closeHoverContrast })}`);
    }

    if (beforeStatus.outer !== 'rgb(217, 127, 198)') {
        throw new Error(`Unexpected R7 baseline frame color: ${beforeStatus.outer}`);
    }
    const ratioBeforeLeft = contrast(beforeStatus.leftText, beforeStatus.outer);
    const ratioBeforeRight = contrast(beforeStatus.rightText, beforeStatus.outer);
    const ratioAfterLeft = contrast(afterStatus.leftText, afterStatus.inner);
    const ratioAfterRight = contrast(afterStatus.rightText, afterStatus.inner);
    if (ratioAfterLeft < 4.5 || ratioAfterRight < 4.5) {
        throw new Error(`Status text contrast < 4.5: ${ratioAfterLeft.toFixed(2)} / ${ratioAfterRight.toFixed(2)}`);
    }
    if (afterStatus.outer !== 'rgb(249, 209, 231)' || afterStatus.inner !== 'rgb(249, 209, 231)' || afterStatus.leftText !== 'rgb(33, 19, 45)' || afterStatus.rightText !== 'rgb(33, 19, 45)') {
        throw new Error(`Unexpected R8 status colors: ${JSON.stringify(afterStatus)}`);
    }
    if (JSON.stringify(beforeStatus.dots) !== JSON.stringify(afterStatus.dots)) {
        throw new Error(`Status lamp fills changed: ${JSON.stringify({ before: beforeStatus.dots, after: afterStatus.dots })}`);
    }
    if (beforeStatus.height !== afterStatus.height || beforeBarBox.height !== afterBarBox.height || beforeBarBox.width !== afterBarBox.width || beforeBarBox.y !== afterBarBox.y) {
        throw new Error(`Statusbar geometry changed: ${JSON.stringify({ beforeStatus: beforeStatus.height, afterStatus: afterStatus.height, beforeBarBox, afterBarBox })}`);
    }
    const laceGeometryKeys = ['content', 'position', 'top', 'right', 'bottom', 'left', 'width', 'height', 'transform', 'pointerEvents', 'animationName', 'animationDuration', 'animationTimingFunction'];
    const project = (style, keys) => Object.fromEntries(keys.map((key) => [key, style[key]]));
    if (JSON.stringify(project(beforePseudo.before, laceGeometryKeys)) !== JSON.stringify(project(afterPseudo.before, laceGeometryKeys))) {
        throw new Error(`Lace ::before geometry/motion changed: ${JSON.stringify({ before: project(beforePseudo.before, laceGeometryKeys), after: project(afterPseudo.before, laceGeometryKeys) })}`);
    }
    if (beforePseudo.before.animationName !== 'r8-lace-flow' || beforePseudo.before.animationDuration !== '4.8s' || afterPseudo.before.animationName !== beforePseudo.before.animationName || afterPseudo.before.animationDuration !== beforePseudo.before.animationDuration) {
        throw new Error(`Unexpected lace animation identity/timing: ${JSON.stringify({ before: beforePseudo.before, after: afterPseudo.before })}`);
    }
    if (afterPseudo.before.backgroundSize !== '20px 8px' || afterPseudo.before.maskImage !== 'none' || !afterPseudo.before.backgroundImage.includes('data:image/svg+xml')) {
        throw new Error(`Two-tone SVG lace paint missing: ${JSON.stringify(afterPseudo.before)}`);
    }
    if (JSON.stringify(beforePseudo.after) !== JSON.stringify(afterPseudo.after)) {
        throw new Error(`Protected statusbar ::after RGB changed: ${JSON.stringify({ before: beforePseudo.after, after: afterPseudo.after })}`);
    }

    const footerFits = {};
    for (const height of [900, 720, 580]) {
        await page.setViewportSize({ width: 1280, height });
        const state = await page.evaluate(() => {
            const sidebar = document.querySelector('[data-slot="sidebar"]');
            const footer = sidebar.querySelector('[data-sidebar="footer"]');
            const rect = footer.getBoundingClientRect();
            const sidebarRect = sidebar.getBoundingClientRect();
            return {
                bottom: rect.bottom,
                sidebarBottom: sidebarRect.bottom,
                height: rect.height,
                paddingInlineEnd: getComputedStyle(footer).paddingInlineEnd,
                fitsViewport: rect.bottom <= innerHeight + 0.5,
                fitsSidebar: rect.bottom <= sidebarRect.bottom + 0.5,
                scrollOverflow: footer.scrollHeight > footer.clientHeight + 1
            };
        });
        if (!state.fitsViewport || !state.fitsSidebar || state.scrollOverflow || state.paddingInlineEnd !== '32px') {
            throw new Error(`Footer overflow/reserved-space failure at ${height}px: ${JSON.stringify(state)}`);
        }
        footerFits[height] = state;
        await page.screenshot({ path: new URL(`after-${height}.png`, out).pathname, fullPage: true });
    }

    await page.emulateMedia({ reducedMotion: 'reduce' });
    const reducedMotion = await page.evaluate(() => {
        const bar = document.querySelector('.vrcx-0-statusbar');
        const lace = getComputedStyle(bar, '::before');
        const heart = getComputedStyle(document.querySelector('.vrcx-0-brand'), '::after');
        return { laceAnimation: lace.animationName, lacePointerEvents: lace.pointerEvents, heartAnimation: heart.animationName, heartPointerEvents: heart.pointerEvents };
    });
    if (reducedMotion.laceAnimation !== 'none' || reducedMotion.heartAnimation !== 'none' || reducedMotion.lacePointerEvents !== 'none' || reducedMotion.heartPointerEvents !== 'none') {
        throw new Error(`Reduced-motion/decorative interaction regression: ${JSON.stringify(reducedMotion)}`);
    }

    const beforeBuffer = await fs.readFile(new URL('before.png', out));
    const afterBuffer = await fs.readFile(new URL('after.png', out));
    const beforeMeta = await sharp(beforeBuffer).metadata();
    const afterMeta = await sharp(afterBuffer).metadata();
    const laceRegionBefore = { left: 0, top: Math.round(beforeBarBox.y - 8), width: Math.round(beforeBarBox.width), height: 8 };
    const laceRegionAfter = { left: 0, top: Math.round(afterBarBox.y - 8), width: Math.round(afterBarBox.width), height: 8 };
    const lacePixelsBefore = await meatPinkPixels(beforeBuffer, laceRegionBefore);
    const lacePixelsAfter = await meatPinkPixels(afterBuffer, laceRegionAfter);
    const laceRatioAfterBefore = lacePixelsAfter.meatPinkPixels / Math.max(1, lacePixelsBefore.meatPinkPixels);
    // R9.6c (task-47, user: "描边朝内，洞洞要镂空"): the inward 1px stroke ring around the scallop and the three
    // hollow eyelets is denser than the R8 outward stroke, so the old after/before ratio (<0.4) no longer encodes the
    // spec. Exact lace structure is now asserted pixel-by-pixel in lace3-verify.mjs; here we only keep the guard
    // that the strip is not a solid stroke-pink band (<40% of the strip).
    if (lacePixelsAfter.percent >= 40) {
        throw new Error(`Meat-pink lace pixels did not fall to outline-only levels: ${JSON.stringify({ lacePixelsBefore, lacePixelsAfter, ratioAfterBefore: laceRatioAfterBefore })}`);
    }
    const left3xRegionBeforeTop = Math.max(0, Math.round(beforeBarBox.y - 24));
    const left3xRegionAfterTop = Math.max(0, Math.round(afterBarBox.y - 24));
    const left3xRegionBefore = { left: 0, top: left3xRegionBeforeTop, width: 560, height: Math.min(57, beforeMeta.height - left3xRegionBeforeTop) };
    const left3xRegionAfter = { left: 0, top: left3xRegionAfterTop, width: 560, height: Math.min(57, afterMeta.height - left3xRegionAfterTop) };
    const leftBefore3x = await sharp(beforeBuffer).extract(left3xRegionBefore).resize(left3xRegionBefore.width * 3, left3xRegionBefore.height * 3, { kernel: sharp.kernel.nearest }).png().toBuffer();
    const leftAfter3x = await sharp(afterBuffer).extract(left3xRegionAfter).resize(left3xRegionAfter.width * 3, left3xRegionAfter.height * 3, { kernel: sharp.kernel.nearest }).png().toBuffer();
    await fs.writeFile(new URL('lace-left-before-3x.png', out), leftBefore3x);
    await fs.writeFile(new URL('lace-left-after-3x.png', out), leftAfter3x);
    const composeComparison = async (leftImage, rightImage, filename, label) => {
        const leftMeta = await sharp(leftImage).metadata();
        const rightMeta = await sharp(rightImage).metadata();
        const width = leftMeta.width + rightMeta.width;
        const height = Math.max(leftMeta.height, rightMeta.height);
        const banner = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="24"><rect width="100%" height="100%" fill="#100b1e"/><text x="10" y="17" fill="#ffd9ee" font-family="monospace" font-size="12">NOT WINDOWS · ${label} · BEFORE | AFTER</text></svg>`);
        await sharp({ create: { width, height: height + 24, channels: 4, background: '#100b1e' } })
            .composite([{ input: banner, left: 0, top: 0 }, { input: leftImage, left: 0, top: 24 }, { input: rightImage, left: leftMeta.width, top: 24 }])
            .png().toFile(new URL(filename, out).pathname);
    };
    await composeComparison(beforeBuffer, afterBuffer, 'comparison.png', 'FULL FIXTURE');
    await composeComparison(
        await fs.readFile(new URL('titlebar-before.png', out)),
        await fs.readFile(new URL('titlebar-after.png', out)),
        'titlebar-comparison.png', 'TITLEBAR FULL-WIDTH'
    );
    await composeComparison(leftBefore3x, leftAfter3x, 'lace-left-3x-comparison.png', 'LACE LEFT 3X');
    const statusStrip = { left: 0, top: Math.max(0, beforeMeta.height - 40), width: beforeMeta.width, height: Math.min(40, beforeMeta.height) };
    const statusBefore = await sharp(beforeBuffer).extract(statusStrip).png().toBuffer();
    const statusAfter = await sharp(afterBuffer).extract(statusStrip).png().toBuffer();
    await fs.writeFile(new URL('statusbar-before.png', out), statusBefore);
    await fs.writeFile(new URL('statusbar-after.png', out), statusAfter);
    await composeComparison(statusBefore, statusAfter, 'statusbar-comparison.png', 'STATUSBAR FULL-WIDTH');
    const bottomCrop = { left: 0, top: Math.max(0, beforeMeta.height - 160), width: 520, height: Math.min(160, beforeMeta.height) };
    const footerStatusLeftBefore = await sharp(beforeBuffer).extract(bottomCrop).png().toBuffer();
    const footerStatusLeftAfter = await sharp(afterBuffer).extract(bottomCrop).png().toBuffer();
    await composeComparison(footerStatusLeftBefore, footerStatusLeftAfter, 'footer-statusbar-left-comparison.png', 'FOOTER + STATUSBAR LEFT');

    report.header = { ...header, outerCornersSymmetric: header.brand.radius === header.close.radius };
    report.statusbar = {
        before: beforeStatus,
        after: afterStatus,
        contrastBefore: { left: Number(ratioBeforeLeft.toFixed(3)), right: Number(ratioBeforeRight.toFixed(3)) },
        contrastAfter: { left: Number(ratioAfterLeft.toFixed(3)), right: Number(ratioAfterRight.toFixed(3)) },
        pseudoBefore: beforePseudo,
        pseudoAfter: afterPseudo
    };
    report.lace = {
        paint: 'data: SVG tile; 16x8 repeat-x; 1px meat-pink outline; pale-pink fill; transparent eyelet',
        fill: '#ffe4f2',
        outline: '#d97fc6',
        pixelsBefore: lacePixelsBefore,
        pixelsAfter: lacePixelsAfter,
        meatPinkPixelRatioAfterBefore: Number(laceRatioAfterBefore.toFixed(4)),
        percentageReduction: Number((100 * (1 - laceRatioAfterBefore)).toFixed(2))
    };
    report.middleInteraction = { pressed, middleHover, windowHover, closeHover, closeHoverContrast: Number(closeHoverContrast.toFixed(3)) };
    report.footerFits = footerFits;
    report.reducedMotion = reducedMotion;
    report.protectedSelectorsAbsent = true;
    await fs.writeFile(new URL('report.json', out), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    console.log('PASS: R8 / symmetric chrome / WCAG ≥ 4.5 / statusbar pseudo-preservation / footer 900-720-580 / reduced motion');
    await page.close();
} finally {
    await browser.close();
}
