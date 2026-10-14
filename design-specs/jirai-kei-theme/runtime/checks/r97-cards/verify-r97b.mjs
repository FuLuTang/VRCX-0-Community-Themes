/* R9.7b verification (pill charm + native pixel lace + settings rail bottom padding). FIXTURE, NOT WINDOWS.
   Uses fixture.html written by verify.mjs (real base-ui SSR markup + app CSS). Pages compared:
   base = r96k bundle, prev = bundle + r97a cards (/tmp/jirai-r97-q3b/prev-r97a-theme.css), after = bundle + this cards-r97.css.
   Writes only into this folder and /tmp/jirai-r97-q3b. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import {parseSvg, PILL_SVG, LACE_ASCII} from './grid-r97b.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const OUT = '/tmp/jirai-r97-q3b';
const sharp = createRequire('/tmp/dsh-theme-tools/package.json')('sharp');
const html = await fs.readFile(path.join(here, 'fixture.html'), 'utf8');
const appCss = await fs.readFile('/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css', 'utf8');
const bundle = await fs.readFile('/tmp/jirai-lead-r96k/jirai-kei-theme/theme.css', 'utf8');
const prev = await fs.readFile(path.join(OUT, 'prev-r97a-theme.css'), 'utf8');
const mine = await fs.readFile(path.join(runtime, 'cards-r97.css'), 'utf8');
const after = bundle + '/* SECTION cards-r97 */\n' + mine;
await fs.writeFile(path.join(OUT, 'theme.css'), after);
const NOANIM = '*,*::before,*::after{animation:none!important;transition:none!important}';
const browser = await chromium.launch();
async function open(css, dsf = 1, extra = '') {
    const p = await browser.newPage({viewport: {width: 1100, height: 1900}, deviceScaleFactor: dsf});
    await p.setContent(html, {waitUntil: 'domcontentloaded'});
    await p.addStyleTag({content: appCss}); await p.addStyleTag({content: css}); await p.addStyleTag({content: NOANIM + extra});
    await p.evaluate(async () => {await document.fonts.ready;}); await p.waitForTimeout(250);
    return p;
}
const collect = (p) => p.evaluate(() => {
    const out = {};
    for (const blk of document.querySelectorAll('[data-block]')) out[blk.dataset.block] = [...blk.querySelectorAll('*')].map((e, i) => {
        const b = e.getBoundingClientRect(), s = getComputedStyle(e);
        return {i, tag: e.tagName, slot: e.dataset.slot || '', inTrigger: !!e.closest('[data-slot=collapsible-trigger]') && !e.matches('[data-slot=collapsible-trigger]'),
            rect: [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(3)).join(','), style: [s.backgroundColor, s.borderTopWidth, s.boxShadow, s.clipPath, s.color, s.padding].join('|')};
    });
    return out;
});
const [pBase, pPrev, pA] = [await open(bundle), await open(prev), await open(after)];
const [G0, GP, GA] = [await collect(pBase), await collect(pPrev), await collect(pA)];
const fails = [], ok = (c, m) => {if (!c) fails.push(m);};
const diffs = (X, Y, blk, f = () => true) => Y[blk].filter((e, i) => f(e) && e.rect !== X[blk][i].rect).map((e) => ({el: `${e.tag}[${e.slot}]#${e.i}`, from: X[blk][e.i].rect, to: e.rect}));
const geo = {};
for (const blk of ['settings', 'tools', 'other', 'decoy']) geo[blk] = {vsPrev: diffs(GP, GA, blk), vsBase: diffs(G0, GA, blk, (e) => !e.inTrigger)};
/* only the settings rail (tabs-list) may change, and only its height */
const railOnly = (d) => d.length === 1 && d[0].el.startsWith('DIV[tabs-list]') && d[0].from.split(',').slice(0, 3).join() === d[0].to.split(',').slice(0, 3).join();
ok(railOnly(geo.settings.vsPrev), 'settings geometry vs prev: ' + JSON.stringify(geo.settings.vsPrev.slice(0, 3)));
ok(railOnly(geo.settings.vsBase), 'settings geometry vs base: ' + JSON.stringify(geo.settings.vsBase.slice(0, 3)));
for (const blk of ['tools', 'other', 'decoy']) {ok(!geo[blk].vsPrev.length, blk + ' geometry vs prev'); ok(!geo[blk].vsBase.length, blk + ' geometry vs base');}
for (const blk of ['other', 'decoy']) ok(GA[blk].every((e, i) => e.style === G0[blk][i].style), blk + ' style changed');
const railH = {before: +geo.settings.vsPrev[0]?.from.split(',')[3], after: +geo.settings.vsPrev[0]?.to.split(',')[3]};

/* ---- layout measures ---- */
const M = await pA.evaluate(() => {
    const px = parseFloat;
    const rail = (blk) => {const l = document.querySelector(`[data-block=${blk}] [data-slot=tabs-list]`), b = l.getBoundingClientRect(), s = getComputedStyle(l), a = getComputedStyle(l, '::after'), last = [...l.querySelectorAll('[data-slot=tabs-tab]')].pop().getBoundingClientRect();
        return {x: b.x, y: b.y, w: b.width, h: b.height, bottom: b.bottom, pad: s.padding, innerGapBelowLastTab: +(b.bottom - last.bottom).toFixed(3), laceTop: b.top + px(s.borderTopWidth) + px(a.top), laceLeft: b.left + px(s.borderLeftWidth) + px(a.left), laceW: px(a.width), mask: a.maskImage.slice(0, 40), lineColor: s.borderBottomColor};};
    const card = (c) => {const hd = c.querySelector('[data-slot=card-header]'), tr = hd.querySelector('[data-slot=collapsible-trigger]'), hb = hd.getBoundingClientRect(), tb = tr.getBoundingClientRect(), hs = getComputedStyle(hd), a = getComputedStyle(hd, '::after'), bf = getComputedStyle(tr, '::before');
        return {card: c.getBoundingClientRect().toJSON(), trig: tb.toJSON(), charm: {top: bf.top, left: bf.left, w: bf.width, h: bf.height, bgImage: bf.backgroundImage.slice(0, 30), bgSize: bf.backgroundSize, bgPos: bf.backgroundPosition, bgColor: bf.backgroundColor, mask: bf.maskImage, ir: bf.imageRendering},
            charmBoxAbs: [tb.x + px(bf.left), tb.y + px(bf.top)], laceTop: hb.top + px(hs.borderTopWidth) + px(a.top), lineBottom: hb.bottom, laceLeft: hb.left + px(a.left), laceW: px(a.width), lineColor: hs.borderBottomColor, mask: a.maskImage.slice(0, 40)};};
    return {rail: {settings: rail('settings'), tools: rail('tools')}, cards: [...document.querySelectorAll('[data-block=settings] [data-slot=card],[data-block=tools] [data-slot=card]')].map((c) => ({page: c.closest('[data-block]').dataset.block, ...card(c)}))};
});
for (const c of M.cards) {
    ok(c.charm.mask === 'none' && c.charm.bgColor === 'rgba(0, 0, 0, 0)' && c.charm.bgImage.startsWith('url("data:image/svg+xml') && c.charm.bgSize === '16px 8px' && c.charm.ir === 'pixelated', 'charm paint props ' + JSON.stringify(c.charm));
    ok(c.charm.left === '7px' && c.charm.w === '24px' && c.charm.h === '16px' && Number.isInteger(px(c.charm.top)), 'charm box/top not integer ' + c.charm.top);
    ok(Math.abs(c.laceTop - c.lineBottom) < 0.01, 'card lace top != title line outer edge');
}
function px(v) {return parseFloat(v);}
for (const r of Object.values(M.rail)) ok(Math.abs(r.laceTop - r.bottom) < 0.01, 'rail lace top != frame outer bottom');

/* ---- pixel helpers ---- */
async function raw(p, clip) {const {data, info} = await sharp(await p.screenshot({clip})).raw().toBuffer({resolveWithObject: true}); return {d: data, w: info.width, h: info.height, c: info.channels, at(x, y) {const o = (y * this.w + x) * this.c; return [this.d[o], this.d[o + 1], this.d[o + 2]];}};}
const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
const same = (a, b, t = 0) => a.every((v, i) => Math.abs(v - b[i]) <= t);

/* ---- charm: rendered pixels = pill grid (palette only) at an integer 16x8 window, else untouched ---- */
const pill = parseSvg(await fs.readFile(PILL_SVG, 'utf8'));
const palette = [...new Set(pill.flat().filter(Boolean))];
const pCharmOff = await open(after, 1, '[data-slot=collapsible-trigger]::before{visibility:hidden!important}');
const charm = [];
for (const [k, c] of M.cards.entries()) {
    const X = Math.floor(c.charmBoxAbs[0]) - 4, Y = Math.floor(c.charmBoxAbs[1]) - 4, clip = {x: X, y: Y, width: 32, height: 24};
    const [on, off] = [await raw(pA, clip), await raw(pCharmOff, clip)];
    let bx0 = 99, by0 = 99, bx1 = -1, by1 = -1; const cols = new Set();
    for (let y = 0; y < on.h; y++) for (let x = 0; x < on.w; x++) if (!same(on.at(x, y), off.at(x, y))) {bx0 = Math.min(bx0, x); by0 = Math.min(by0, y); bx1 = Math.max(bx1, x); by1 = Math.max(by1, y); cols.add(hex(on.at(x, y)));}
    let mism = 0;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 16; x++) {const want = pill[y][x], got = on.at(bx0 + x, by0 + y); if (want ? hex(got) !== want : !same(got, off.at(bx0 + x, by0 + y))) mism++;}
    const r = {page: c.page, card: k, layoutBoxAbs: c.charmBoxAbs, computedTop: c.charm.top, renderedPillAbs: [X + bx0, Y + by0], bbox: [bx1 - bx0 + 1, by1 - by0 + 1], colours: [...cols].sort(), nonPalette: [...cols].filter((h) => !palette.includes(h)), mismatches: mism};
    r.offsetInBox = [r.renderedPillAbs[0] - Math.round(c.charmBoxAbs[0]), r.renderedPillAbs[1] - Math.round(c.charmBoxAbs[1])];
    ok(r.bbox.join() === '16,8' && !r.nonPalette.length && !mism && r.offsetInBox.join() === '4,4', 'charm pixels ' + JSON.stringify(r));
    charm.push(r);
}
await pCharmOff.close();

/* ---- lace: mask alpha strictly 0/1, pattern = LACE_ASCII tiled, head on the line, tails outward, nothing after ---- */
const HIDE = '[data-slot=tabs-list]::after,[data-slot=card-header]::after{visibility:hidden!important}';
const pBare = await open(after, 1, '[data-slot=tabs-list],[data-slot=tabs-list] *,[data-slot=card-header],[data-slot=card-header] *{visibility:hidden!important}');
const pOff = await open(after, 1, HIDE), pMag = await open(after, 1, '[data-slot=tabs-list]::after,[data-slot=card-header]::after{background-color:#f0f!important}');
const LACE = [217, 127, 198], LA = 0.55;
/* skip: tools cards' frame is an overlay (z2) drawn over the lace's first column, as in r97a; start one column in. */
async function lace(name, left, top, width, lineColor, skip = 0) {
    const X = Math.round(left) + skip, Y = Math.floor(top) - 3, W = Math.floor(width) - 1 - skip, clip = {x: X, y: Y, width: W, height: 14};
    const [on, off, mag, bare] = [await raw(pA, clip), await raw(pOff, clip), await raw(pMag, clip), await raw(pBare, clip)];
    const alpha = [], bad = []; let realBad = 0;
    for (let y = 0; y < 14; y++) {alpha.push([]); for (let x = 0; x < W; x++) {
        const o = off.at(x, y), m = mag.at(x, y), ch = [0, 1, 2].reduce((b, i) => (Math.abs([255, 0, 255][i] - o[i]) > Math.abs([255, 0, 255][b] - o[b]) ? i : b), 0);
        const a = (m[ch] - o[ch]) / ([255, 0, 255][ch] - o[ch]); alpha[y].push(a);
        if (Math.min(Math.abs(a), Math.abs(a - 1)) > 0.02) bad.push([x, y, +a.toFixed(3)]);
        const want = a > 0.5 ? o.map((v, i) => Math.round(v * (1 - LA) + LACE[i] * LA)) : o;
        if (!same(on.at(x, y), want, 2)) realBad++;
    }}
    const rows = alpha.map((r) => r.map((a) => (a > 0.5 ? '#' : '.')).join(''));
    const first = rows.findIndex((r) => r.includes('#')), last = rows.findLastIndex((r) => r.includes('#'));
    let phase = -1;
    for (let p = 0; p < 16 && phase < 0; p++) if (LACE_ASCII.every((pat, y) => [...rows[first + y]].every((c, x) => c === pat[(x + p) % 16]))) phase = p;
    const lineRow = off.at(Math.floor(W / 2), first - 1), afterRows = [last + 1, last + 2].map((y) => [...Array(W).keys()].filter((x) => !same(on.at(x, y), bare.at(x, y))).length);
    const r = {name, layoutTop: top, renderedTop: Y + first, renderedLineRowColour: hex(lineRow), expectedLineColour: lineColor, height: last - first + 1, phase, expectedPhase: skip, nonBinaryAlpha: bad.length, badSamples: bad.slice(0, 4), realColourMismatch: realBad, rowsAfterTailsSameAsHostHidden: afterRows.every((n) => n === 0), ascii: rows.slice(first - 1, last + 3).map((r) => r.slice(0, 48))};
    ok(!bad.length, name + ': non-binary lace alpha ' + JSON.stringify(bad.slice(0, 4)));
    ok(!realBad, name + ': lace pixel not lace-colour/transparent x' + realBad);
    ok(r.height === 8 && phase === skip, name + ': lace pattern/phase ' + phase + ' h' + r.height);
    ok(rows[first - 1] === '.'.repeat(W) && rows[first + 8] === '.'.repeat(W), name + ': lace bleeds above line / below tails');
    ok(hex(lineRow) === lineColor, name + ': row above lace is not the frame line ' + hex(lineRow) + ' vs ' + lineColor);
    ok(r.rowsAfterTailsSameAsHostHidden, name + ': rail/header draws something (line/edge) right after the tails');
    return r;
}
const rgbHex = (s) => hex(s.match(/\d+/g).slice(0, 3).map(Number));
const laces = [];
for (const [n, r] of Object.entries(M.rail)) laces.push(await lace(n + '-rail', r.laceLeft, r.laceTop, r.laceW, rgbHex(r.lineColor)));
for (const [k, c] of M.cards.entries()) laces.push(await lace(`${c.page}-card${k}`, c.laceLeft, c.laceTop, Math.min(c.laceW, 320), rgbHex(c.lineColor), c.page === 'tools' ? 1 : 0));
await pOff.close(); await pMag.close(); await pBare.close();

/* ---- shots ---- */
const shots = {};
for (const blk of ['settings', 'tools']) {const f = path.join(here, `${blk}-r97b.png`); await pA.locator(`[data-block=${blk}]`).screenshot({path: f}); shots[blk] = f;}
const z = await open(after, 4);
const zoomAt = async (name, x, y, w, h) => {const f = path.join(here, name + '.png'); await z.screenshot({path: f, clip: {x, y, width: w, height: h}}); shots[name] = f;};
const s0 = M.cards.find((c) => c.page === 'settings'), t0 = M.cards.find((c) => c.page === 'tools');
await zoomAt('zoom4-r97b-settings-card-head', s0.card.x - 4, s0.card.y - 4, 300, 70);
await zoomAt('zoom4-r97b-tools-card-head', t0.card.x - 4, t0.card.y - 4, 300, 70);
for (const n of ['settings', 'tools']) {const r = M.rail[n]; await zoomAt(`zoom4-r97b-${n}-rail-bottom`, r.x - 6, r.bottom - 40, r.w + 12, 56);}
await browser.close();
const report = {pass: !fails.length, fails, bytes: Buffer.byteLength(mine), railHeight: railH, rail: M.rail, geometry: geo, charm, laces, cards: M.cards, shots};
await fs.writeFile(path.join(here, 'report-r97b.json'), JSON.stringify(report, null, 1) + '\n');
console.log(JSON.stringify({pass: report.pass, fails, bytes: report.bytes, railHeight: railH, railGap: Object.fromEntries(Object.entries(M.rail).map(([k, r]) => [k, [r.pad, r.innerGapBelowLastTab]])),
    charm: charm.map((c) => [c.page, c.computedTop, c.layoutBoxAbs.map((v) => +v.toFixed(3)), c.renderedPillAbs, c.offsetInBox, c.colours.length, c.mismatches]),
    laces: laces.map((l) => [l.name, l.layoutTop, l.renderedTop, l.renderedLineRowColour, l.phase, l.nonBinaryAlpha, l.realColourMismatch])}, null, 1));
process.exit(fails.length ? 1 : 0);
