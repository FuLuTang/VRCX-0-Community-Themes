/* NOT WINDOWS: R96 cat motion — old (lead r96h) vs new (+cat-motion-r96) bundle.
   Frame strips (nearest 4x), computed-style + geometry assertions. */
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const out = '/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/checks/r96-cat-motion';
const appCss = await fs.readFile('/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css', 'utf8');
const OLD = await fs.readFile('/tmp/jirai-lead-r96h/jirai-kei-theme/theme.css', 'utf8');
const NEW = await fs.readFile('/tmp/jirai-r96-cat/theme.css', 'utf8');
const fixture = await fs.readFile(`${out}/fixture.html`, 'utf8');
const NAV = '.vrcx-0-sidebar-surface [data-sidebar="content"]';
const SOC = '.vrcx-0-side-panel';
const browser = await chromium.launch({ headless: true });
const fails = []; const ok = (c, m) => { if (!c) fails.push(m); };
const report = {};

async function open(theme, h = 980) {
  const p = await browser.newPage({ viewport: { width: 1360, height: h }, deviceScaleFactor: 1 });
  await p.setContent(fixture, { waitUntil: 'domcontentloaded' });
  await p.addStyleTag({ content: appCss }); await p.addStyleTag({ content: theme });
  await p.evaluate(() => document.fonts.ready);
  return p;
}
const probe = (p) => p.evaluate(([NAV, SOC]) => {
  const n = document.querySelector(NAV), s = document.querySelector(SOC);
  const na = getComputedStyle(n, '::after'), sa = getComputedStyle(s, '::after');
  const R = (el) => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(Math.round).join(','); };
  const menu = [...n.querySelectorAll('[data-sidebar="menu-button"]')].pop().getBoundingClientRect();
  return {
    nav: { name: na.animationName, dur: na.animationDuration, delay: na.animationDelay, timing: na.animationTimingFunction, opacity: +na.opacity, transform: na.transform, display: na.display, pe: na.pointerEvents, w: na.width, h: na.height },
    soc: { name: sa.animationName, dur: sa.animationDuration, delay: sa.animationDelay, opacity: +sa.opacity, top: sa.top, right: sa.right, w: sa.width, h: sa.height, pos: sa.backgroundPosition, size: sa.backgroundSize, pe: sa.pointerEvents },
    geom: { navContent: R(n), navScroll: n.scrollHeight + 'x' + n.scrollWidth, panel: R(s), self: R(s.querySelector('.vrcx-0-side-panel-self')), tabs: R(s.querySelector('[data-slot="tabs"]')), corner: R(s.querySelector('.mock-corner-buttons')) },
    lastMenuBottom: menu.bottom
  };
}, [NAV, SOC]);
// Pin a frame: negative delay + paused (overrides any authored delay).
async function pin(p, sel, t) {
  await p.evaluate(([sel, t]) => {
    let st = document.getElementById('pin-' + sel.length); if (!st) { st = document.createElement('style'); st.id = 'pin-' + sel.length; document.head.append(st); }
    st.textContent = `${sel}::after{animation-delay:${-t}s!important;animation-play-state:paused!important}`;
  }, [sel, t]);
  // play-state:paused freezes at the already-elapsed time; reset so active time == t exactly.
  await p.evaluate((sel) => { const el = document.querySelector(sel); for (const a of document.getAnimations()) if (a.effect && a.effect.target === el && a.effect.pseudoElement === '::after') { a.pause(); a.currentTime = 0; } }, sel);
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}
const mids = (stops, dur) => stops.slice(0, -1).map((a, i) => ((a + stops[i + 1]) / 2) / 100 * dur);
const even = (n, dur) => Array.from({ length: n }, (_, i) => (i + 0.5) / n * dur);
const plan = {
  oldNav: even(11, 3.6), newNav: mids([0, 5, 10, 15, 20, 24, 28, 33, 37, 68, 76, 100], 2),
  oldSoc: even(10, 7), newSoc: mids([0, 6, 12, 18, 24, 30, 60, 66, 72, 78, 100], 2)
};
async function frames(theme, sel, times, clipFn) {
  const p = await open(theme); const g = await probe(p); const bufs = [];
  for (const t of times) { await pin(p, sel, t); bufs.push(await p.screenshot({ clip: clipFn(g, p) })); }
  const transforms = [];
  for (const t of times) { await pin(p, sel, t); transforms.push(await p.evaluate(([sel]) => { const e = document.querySelector(sel); const a = getComputedStyle(e, '::after'); return a.transform + ' | ' + a.backgroundPosition + ' | ' + a.opacity; }, [sel])); }
  await p.close(); return { bufs, transforms };
}
// Nav cat sits at bottom-right of content: right = content.right-6(pad)-6(margin), bottom = -4(pad)-4(margin).
const navClip = (g) => { const [x, y, w, h] = g.geom.navContent.split(',').map(Number); const cx = x + w - 12 - 36, cy = y + h - 8 - 36; return { x: cx - 4, y: cy - 12, width: 44, height: 52 }; };
const socClip = (g) => { const [x, y, w] = g.geom.panel.split(',').map(Number); const bx = x + w - 1 - 88 - 42, by = y + 1; return { x: bx - 3, y: by, width: 48, height: 28 }; };
async function strip(rows, scale, file) {
  const meta = await sharp(rows[0][0]).metadata(); const cw = meta.width * scale, ch = meta.height * scale, gap = 2, lab = 26;
  const W = lab + rows[0].length * (cw + gap), H = rows.length * (ch + gap);
  const comps = [];
  for (const [ri, row] of rows.entries()) {
    comps.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${lab}" height="${ch}"><text x="1" y="${ch / 2 + 4}" font-family="sans-serif" font-size="9" fill="#ffe4f5">${ri ? 'NEW' : 'OLD'}</text></svg>`), left: 0, top: ri * (ch + gap) });
    for (const [ci, b] of row.entries()) comps.push({ input: await sharp(b).resize(cw, ch, { kernel: 'nearest' }).png().toBuffer(), left: lab + ci * (cw + gap), top: ri * (ch + gap) });
  }
  await sharp({ create: { width: W, height: H, channels: 4, background: '#0b0814' } }).composite(comps).png().toFile(file);
  return [W, H];
}
const on = await frames(OLD, NAV, plan.oldNav, navClip), nn = await frames(NEW, NAV, plan.newNav, navClip);
const os = await frames(OLD, SOC, plan.oldSoc, socClip), ns = await frames(NEW, SOC, plan.newSoc, socClip);
report.navStrip = await strip([on.bufs, nn.bufs], 4, `${out}/nav-cat-strip.png`);
report.socialStrip = await strip([os.bufs, ns.bufs], 4, `${out}/social-cat-strip.png`);
report.frames = { oldNav: on.transforms, newNav: nn.transforms, oldSoc: os.transforms, newSoc: ns.transforms };

// --- computed style assertions
const po = await open(OLD), pn = await open(NEW);
const a = await probe(po), b = await probe(pn);
report.old = a; report.new = b;
ok(b.nav.name === 'r96-nav-cat' && b.nav.dur === '2s' && b.nav.opacity === 1 && b.nav.pe === 'none' && b.nav.w === '36px', 'nav new anim ' + JSON.stringify(b.nav));
ok(b.soc.name === 'r96-social-cat' && b.soc.dur === '2s' && b.soc.delay === '-1s' && b.soc.opacity >= .85 && b.soc.pe === 'none', 'soc new anim ' + JSON.stringify(b.soc));
ok(b.soc.top === '0px' && b.soc.h === '22px' && b.soc.right === '88px' && b.soc.w === '42px', 'soc box ' + JSON.stringify(b.soc));
ok(JSON.stringify(a.geom) === JSON.stringify(b.geom), 'parent geometry changed ' + JSON.stringify([a.geom, b.geom]));
// box must stay inside the SOCIAL ::before title bar (24px) and clear of corner buttons
const [px, , pw] = b.geom.panel.split(',').map(Number), [cx] = b.geom.corner.split(',').map(Number);
ok(px + pw - 1 - 88 <= cx, 'soc box overlaps corner buttons');
report.socBoxBottomVsTitle = { boxBottom: 22, titleMinHeight: 24 };
// frames: every transform/position integer & in range
const ints = (s) => (s.match(/-?\d+(\.\d+)?/g) || []).every((v) => Number.isInteger(+v) || v.startsWith('0.') || v === '1');
for (const f of nn.transforms) { const m = f.match(/matrix\(1, 0, 0, 1, (-?[\d.]+), (-?[\d.]+)\)/); if (m) { ok(+m[1] % 2 === 0 && +m[2] % 2 === 0 && +m[2] >= -8, 'nav frame ' + f); } else ok(f.startsWith('none'), 'nav frame ' + f); }
ok(nn.transforms.some((f) => f.includes(', -8)')), 'nav never reaches -8px');
for (const f of ns.transforms) { ok(+f.split('|')[2] >= .85, 'soc opacity ' + f); ok(ints(f), 'soc non-integer ' + f); }

// --- reduced motion & reduce-effects
for (const [tag, setup] of [['prefers-reduced-motion', (p) => p.emulateMedia({ reducedMotion: 'reduce' })], ['html.reduce-effects', (p) => p.evaluate(() => document.documentElement.classList.add('reduce-effects'))]]) {
  const p = await open(NEW); await setup(p); const r = await probe(p);
  report[tag] = { nav: r.nav, soc: r.soc };
  ok(r.nav.name === 'none' && r.nav.opacity === 1 && r.nav.transform === 'none', tag + ' nav ' + JSON.stringify(r.nav));
  ok(r.soc.name === 'none' && r.soc.opacity >= .85 && r.soc.pos === '0px 5px, 24px 4px' && r.soc.size === '16px 16px, 18px 18px', tag + ' soc ' + JSON.stringify(r.soc));
  ok(JSON.stringify(r.geom) === JSON.stringify(b.geom), tag + ' geometry');
  await p.screenshot({ path: `${out}/${tag.replace(/\W+/g, '-')}.png`, clip: { x: 0, y: 0, width: 1360, height: 980 } }); await p.close();
}
// --- collapsed
await pn.evaluate(() => { document.querySelector('[data-slot="sidebar"]').dataset.state = 'collapsed'; });
ok((await probe(pn)).nav.display === 'none', 'collapsed nav cat visible');
await pn.evaluate(() => { document.querySelector('[data-slot="sidebar"]').dataset.state = 'expanded'; });
await pn.screenshot({ path: `${out}/context-new.png` });
// --- short window: scroll extent unchanged at every new frame, peak never enters last menu row
for (const h of [720, 580]) {
  const pO = await open(OLD, h), pN = await open(NEW, h); const base = (await probe(pO)).geom.navScroll; const ext = [], ov = [];
  await pN.evaluate((s) => { const e = document.querySelector(s); e.scrollTop = e.scrollHeight; }, NAV);
  for (const t of plan.newNav) { await pin(pN, NAV, t); const r = await probe(pN); ext.push(r.geom.navScroll);
    const cat = await pN.evaluate((s) => document.querySelector(s + ' [data-sidebar="group"]').getBoundingClientRect().bottom + 36, NAV); // overflowing: margin-top:auto = 0, cat starts at group bottom
    const m = (await pN.evaluate((s) => getComputedStyle(document.querySelector(s), '::after').transform, NAV)).match(/, (-?[\d.]+)\)$/);
    const top = cat - 36 + (m ? +m[1] : 0); ov.push(Math.max(0, r.lastMenuBottom - top)); }
  // Known trade-off (flagged to Lead): when the nav overflows and is scrolled to the very bottom the cat sits flush under the menu frame (margin-top:auto=0), so any hop peeks over the frame line; peak 8px enters the last row by <=3px for one 100ms frame. See short-720-scrolled-ground-peak-6.png. Old 1px hop also grazed it.
  ok(Math.max(...ov) <= 3, `h${h} cat overlaps last menu row by ${Math.max(...ov)}px`);
  report['scroll' + h] = { old: base, newFrames: [...new Set(ext)], overlapPxPerFrame: ov };
  ok(ext.every((e) => e === base), `h${h} scroll extent changed ${base} vs ${ext}`);
  await pO.close(); await pN.close();
}
await po.close(); await pn.close(); await browser.close();
report.fails = fails;
await fs.writeFile(`${out}/report.json`, JSON.stringify(report, null, 1) + '\n');
console.log(JSON.stringify({ navStrip: report.navStrip, socialStrip: report.socialStrip, frames: report.frames, scroll720: report.scroll720, scroll580: report.scroll580, fails }, null, 1));
process.exit(fails.length ? 1 : 0);
