import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';

const themeRoot = '/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const appDist = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets';
const out = `${themeRoot}/runtime/checks/r7-motion`;
const cssPaths = [
    `${appDist}/index-Cckb3vVG.css`,
    `${appDist}/App-C2mIqNXI.css`,
    `${themeRoot}/runtime/preview-package/jirai-kei-theme/theme.css`,
    `${themeRoot}/original-assets/r5/assets-r5.css`,
    `${themeRoot}/runtime/navigation-r7.css`,
    `${themeRoot}/runtime/motion-r5.css`,
    `${themeRoot}/runtime/motion-r7.css`
];
const sheets = await Promise.all(cssPaths.map((path) => fs.readFile(path, 'utf8')));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 720 }, deviceScaleFactor: 2 });
await page.goto(`file://${out}/fixture.html`);
for (const content of sheets) await page.addStyleTag({ content });

const animated = [
    '.vrcx-0-side-panel::after',
    '.vrcx-0-titlebar .vrcx-0-brand::after',
    '.vrcx-0-statusbar::before'
];
// R8 decision (motion-r8.css): the 2px tab-edge glint was too faint and is now static.
const tabGlint = await page.evaluate(() => getComputedStyle(document.querySelector('[data-slot="tabs-tab"][data-active]'), '::after').animationName);
if (tabGlint !== 'none') throw new Error(`R8 expects the tab-edge glint to be static, got ${tabGlint}`);
const rects = () => page.evaluate(() => [...document.querySelectorAll(
    '.page,.vrcx-0-titlebar,.vrcx-0-sidebar-surface,.vrcx-0-main-content,.vrcx-0-side-panel,.vrcx-0-statusbar'
)].map((el) => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }));
const boundsBefore = await rects();
const resize = () => page.evaluate(() => {
    const style = getComputedStyle(document.querySelector('.vrcx-0-main-content'), '::after');
    return { width: style.width, pointerEvents: style.pointerEvents, content: style.content };
});
const resizeNormal = await resize();
if (resizeNormal.width !== '2px' || resizeNormal.pointerEvents !== 'none') {
    throw new Error(`app nav resize affordance not preserved: ${JSON.stringify(resizeNormal)}`);
}
const activeNames = await page.evaluate((selectors) => selectors.map((selector) => {
    const [target, pseudo] = selector.split(/(::.*)/);
    const style = getComputedStyle(document.querySelector(target), pseudo);
    return [selector, style.animationName, style.pointerEvents];
}), animated);
if (activeNames.some(([, name, pointer]) => name === 'none' || pointer !== 'none')) {
    throw new Error(`normal motion invalid: ${JSON.stringify(activeNames)}`);
}
// Windows acceptance finding: the app paints its own add/gear buttons in the SOCIAL
// panel's top-right corner, so an ornament anchored at right:10px is completely covered
// and never appears on screen. Pin both the reserved geometry and the clear offset.
const corner = await page.evaluate(() => {
    const style = getComputedStyle(document.querySelector('.vrcx-0-side-panel'), '::after');
    return {
        right: style.right, top: style.top, width: style.width, height: style.height,
        position: style.position, content: style.content,
        images: (style.backgroundImage.match(/data:image\/svg\+xml/g) || []).length
    };
});
if (corner.content !== '""' || corner.position !== 'absolute') {
    throw new Error(`corner ornament is not generated: ${JSON.stringify(corner)}`);
}
if (corner.width !== '42px' || corner.height !== '18px') {
    throw new Error(`corner ornament geometry changed: ${JSON.stringify(corner)}`);
}
if (parseFloat(corner.right) < 88) {
    throw new Error(`corner ornament would hide under the app buttons again: right=${corner.right}`);
}
if (corner.images !== 2) {
    throw new Error(`corner ornament assets missing (star + needy_cat): ${JSON.stringify(corner)}`);
}
// Seek the known 7s corner twinkle into its high-opacity frames for visual evidence.
await page.evaluate(() => document.getAnimations().forEach((animation) => {
    animation.pause();
    animation.currentTime = 5400;
}));
await page.screenshot({ path: `${out}/normal.png` });

await page.emulateMedia({ reducedMotion: 'reduce' });
const reducedNames = await page.evaluate((selectors) => selectors.map((selector) => {
    const [target, pseudo] = selector.split(/(::.*)/);
    const style = getComputedStyle(document.querySelector(target), pseudo);
    return [selector, style.animationName, style.pointerEvents];
}), animated);
if (reducedNames.some(([, name, pointer]) => name !== 'none' || pointer !== 'none')) {
    throw new Error(`reduced motion did not stop: ${JSON.stringify(reducedNames)}`);
}
const resizeReduced = await resize();
if (resizeReduced.width !== '2px' || resizeReduced.pointerEvents !== 'none') {
    throw new Error(`reduced mode altered resize affordance: ${JSON.stringify(resizeReduced)}`);
}
await page.waitForTimeout(400);
const boundsAfter = await rects();
if (JSON.stringify(boundsBefore) !== JSON.stringify(boundsAfter)) {
    throw new Error(`layout bounds changed: ${JSON.stringify({ boundsBefore, boundsAfter })}`);
}
await page.screenshot({ path: `${out}/reduced.png` });
await fs.writeFile(`${out}/report.json`, JSON.stringify({
    fixture: 'NOT WINDOWS', cssPaths, activeNames, reducedNames,
    cornerOrnament: corner,
    resizeNormal, resizeReduced, layoutBoundsStable: true,
    screenshots: ['normal.png', 'reduced.png']
}, null, 2) + '\n');
await browser.close();
console.log(`R7 motion: PASS (normal/reduced, pointer events, 2px resize, stable layout, corner ornament right=${corner.right})`);
