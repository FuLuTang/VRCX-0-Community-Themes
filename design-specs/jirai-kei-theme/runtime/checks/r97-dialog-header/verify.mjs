// R9.7 dialog-header verify: app CSS + bundle (off) vs app CSS + bundle + section (on), plus app-only reference.
// PLAYWRIGHT_BROWSERS_PATH=/tmp/dsh-theme-browsers node verify.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');

const here = path.dirname(new URL(import.meta.url).pathname);
const runtime = path.resolve(here, '../..');
const appCss = await fs.readFile('/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css', 'utf8');
const bundle = await fs.readFile('/tmp/jirai-lead-r96k/jirai-kei-theme/theme.css', 'utf8');
const section = await fs.readFile(path.join(runtime, 'dialog-header-r97.css'), 'utf8');
const merged = bundle + '/* SECTION dialog-header-r97 */\n' + section;
await fs.mkdir('/tmp/jirai-r97-q1', { recursive: true });
await fs.writeFile('/tmp/jirai-r97-q1/theme.css', merged);
const html = await fs.readFile(path.join(here, 'fixture.html'), 'utf8');

const browser = await chromium.launch({ headless: true });
const W = 1360, H = 1100;
async function open(css) {
  const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'domcontentloaded' });
  await p.addStyleTag({ content: appCss });
  if (css) await p.addStyleTag({ content: css });
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}
const measure = p => p.evaluate(() => {
  const r = id => { const e = document.getElementById(id); const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
  const cs = (id, props) => { const s = getComputedStyle(document.getElementById(id)); return Object.fromEntries(props.map(k => [k, s.getPropertyValue(k)])); };
  const dump = root => [...document.getElementById(root).querySelectorAll('*'), document.getElementById(root)].map(el => {
    const s = getComputedStyle(el), b = getComputedStyle(el, '::before'), a = getComputedStyle(el, '::after'), rc = el.getBoundingClientRect();
    return [el.tagName, el.id, [...s].sort().map(k => k + ':' + s.getPropertyValue(k)).join(';'), [...b].sort().map(k => k + ':' + b.getPropertyValue(k)).join(';'), a.content, [rc.x, rc.y, rc.width, rc.height].join(',')].join('|');
  });
  const btnIds = ['assist-a-endpoint', 'assist-a-panel', 'assist-a-close', 'assist-b-endpoint', 'assist-b-panel'];
  const titleA = document.querySelector('#assist-a-header > [data-slot="dialog-title"]');
  const tb = titleA.getBoundingClientRect();
  return {
    dialogA: r('assist-a'), headerA: r('assist-a-header'), actionsA: r('assist-a-actions'), titleA: { x: tb.x, y: tb.y, w: tb.width, h: tb.height },
    headerCs: cs('assist-a-header', ['flex-direction', 'background-color', 'border-bottom', 'padding', 'margin']),
    titleCs: (() => { const s = getComputedStyle(titleA); return { bg: s.backgroundColor, color: s.color, pad: s.padding, border: s.borderBottom }; })(),
    buttons: Object.fromEntries(btnIds.map(id => { const e = document.getElementById(id); const b = e.getBoundingClientRect(); const s = getComputedStyle(e); return [id, { w: b.width, h: b.height, color: s.color, bg: s.backgroundColor, radius: s.borderRadius, tabIndex: e.tabIndex }]; })),
    status: getComputedStyle(document.getElementById('assist-a-status')).color,
    decoys: Object.fromEntries(['sheet', 'changelog', 'memo'].map(id => [id, dump(id)]))
  };
});

const pApp = await open(''), pOff = await open(bundle), pOn = await open(merged);
const [app, off, on] = [await measure(pApp), await measure(pOff), await measure(pOn)];
// r9 title strip reference height: a plain r9 title bar (UserNoteMemo decoy) in the "off" state.
const r9Strip = await pOff.evaluate(() => document.querySelector('#memo [data-slot="dialog-title"]').getBoundingClientRect().height);

// hover + focus states (after)
await pOn.hover('#assist-a-panel');
const hover = await pOn.evaluate(() => { const s = getComputedStyle(document.getElementById('assist-a-panel')); return { color: s.color, bg: s.backgroundColor }; });
await pOn.mouse.move(1, 1);
await pOn.focus('#assist-a-close');
const focus = await pOn.evaluate(() => ({ active: document.activeElement.id, outline: getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).outlineColor }));
await pOn.evaluate(() => document.activeElement.blur());

const out = here;
const shots = {};
for (const [tag, p] of [['original-app', pApp], ['before', pOff], ['after', pOn]]) {
  shots[tag] = path.join(out, tag + '.png');
  await p.screenshot({ path: shots[tag], fullPage: true });
}
await pOn.hover('#assist-a-panel');
shots.afterHover = path.join(out, 'after-hover-header.png');
await pOn.screenshot({ path: shots.afterHover, clip: { x: 0, y: 0, width: W, height: 120 } });
// zoomed header comparison (before / after), pixelated 2x
const hdr = { x: 0, y: 18, width: W, height: 70 };
const crop = async p => p.screenshot({ clip: hdr });
await pOn.mouse.move(1, 1);
const bufs = [await crop(pApp), await crop(pOff), await crop(pOn)];
const scaled = await Promise.all(bufs.map(b => sharp(b).resize({ width: W, height: 70 * 1, kernel: 'nearest' }).png().toBuffer()));
shots.headerCompare = path.join(out, 'header-compare.png');
await sharp({ create: { width: W, height: 70 * 3 + 8, channels: 4, background: '#000000' } })
  .composite(scaled.map((b, i) => ({ input: b, left: 0, top: i * 74 }))).png().toFile(shots.headerCompare);
await browser.close();

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const decoyDiff = Object.fromEntries(Object.keys(off.decoys).map(k => [k, off.decoys[k].reduce((n, s, i) => n + (s !== on.decoys[k][i] ? 1 : 0), 0)]));
const maxBtnH = Math.max(...Object.values(on.buttons).map(b => b.h));
const asserts = {
  sameRowTop: on.titleA.y === on.actionsA.y,
  headerOneRow: on.headerA.h <= Math.max(r9Strip + 1, maxBtnH + 1) && on.headerA.h < 2 * r9Strip,
  headerWasTwoRowsBefore: off.actionsA.y >= off.titleA.y + off.titleA.h,
  buttonSizesUnchangedVsOff: Object.keys(on.buttons).every(k => on.buttons[k].w === off.buttons[k].w && on.buttons[k].h === off.buttons[k].h),
  buttonHeightsUnchangedVsApp: Object.keys(on.buttons).every(k => on.buttons[k].h === app.buttons[k].h),
  tabIndexUnchanged: Object.keys(on.buttons).every(k => on.buttons[k].tabIndex === off.buttons[k].tabIndex),
  dialogSizeUnchanged: on.dialogA.w === off.dialogA.w && on.dialogA.h === off.dialogA.h && on.dialogA.w === app.dialogA.w,
  decoysIdentical: Object.values(decoyDiff).every(n => n === 0),
  focusReachable: focus.active === 'assist-a-close'
};
const report = { bytes: Buffer.byteLength(section), r9Strip, asserts, decoyDiff, app: { ...app, decoys: undefined }, off: { ...off, decoys: undefined }, on: { ...on, decoys: undefined }, hover, focus, shots };
await fs.writeFile(path.join(out, 'verify-report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
if (!Object.values(asserts).every(Boolean)) process.exit(1);
