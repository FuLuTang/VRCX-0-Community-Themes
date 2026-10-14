// R9.7 Q6 splitter verifier. before = current bundle, after = bundle + splitter-r97 appended last.
// App Tailwind CSS (dist) is injected first so the source class strings behave like the real app.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const here = path.dirname(fileURLToPath(import.meta.url));
const APP = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css';
const BEFORE = process.env.BEFORE_CSS || '/tmp/jirai-lead-r96k/jirai-kei-theme/theme.css';
const AFTER = process.env.AFTER_CSS || '/tmp/jirai-r97-q6/theme.css';
const appCss = await fs.readFile(APP, 'utf8');
const html = await fs.readFile(path.join(here, 'fixture.html'), 'utf8');
const ids = [...html.matchAll(/id="([a-z]{2}-[a-z]+)-sep"/g)].map(m => m[1]);
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const C = { line: hex('#6c5ce0'), pink: hex('#ff7fcf'), ink: hex('#16112a'), dotI: hex('#ffb8e6'), hi: hex('#fdf4ff') };
const browser = await chromium.launch({ headless: true });
const run = async (themePath, tag) => {
  const page = await browser.newPage({ viewport: { width: 1320, height: 860 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ content: appCss });
  await page.addStyleTag({ content: await fs.readFile(themePath, 'utf8') });
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  await page.evaluate(() => document.fonts.ready);
  const geo = await page.evaluate(ids => Object.fromEntries(ids.map(id => {
    const r = el => { const b = el.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; };
    const sep = document.getElementById(id + '-sep'), grip = sep.firstElementChild;
    const s = getComputedStyle(sep), a = getComputedStyle(sep, '::after'), b = getComputedStyle(sep, '::before');
    return [id, {
      sep: r(sep), a: r(document.getElementById(id + '-a')), b: r(document.getElementById(id + '-b')),
      hit: [a.position, a.left, a.top, a.width, a.height, a.translate, a.content],
      bg: s.backgroundColor, shadow: s.boxShadow, outline: s.outlineStyle,
      before: [b.content, b.width, b.backgroundColor],
      grip: grip ? { rect: r(grip), radius: getComputedStyle(grip).borderRadius, rotate: getComputedStyle(grip).rotate } : null,
    }];
  })), ids);
  const shot = path.join(here, `${tag}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  // real keyboard focus-visible for each *-focus case
  const focus = {};
  for (const id of ids.filter(i => i.endsWith('-focus'))) {
    await page.keyboard.press('Shift');
    await page.evaluate(id => document.getElementById(id + '-sep').focus(), id);
    const st = await page.evaluate(id => { const e = document.getElementById(id + '-sep'), s = getComputedStyle(e); return { fv: e.matches(':focus-visible'), outline: `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor} ${s.outlineOffset}`, shadow: s.boxShadow, rect: (b => [b.x, b.y, b.width, b.height])(e.getBoundingClientRect()) }; }, id);
    const box = await page.locator('#box-' + id).boundingBox();
    st.shot = path.join(here, `${tag}-${id}.png`);
    await page.screenshot({ path: st.shot, clip: { x: box.x - 2, y: box.y - 2, width: box.width + 4, height: box.height + 4 } });
    st.clip = [box.x - 2, box.y - 2];
    focus[id] = st;
  }
  await page.close();
  return { geo, shot, focus };
};
const before = await run(BEFORE, 'before'), after = await run(AFTER, 'after');
await browser.close();

const fails = [], pass = [];
const ok = (cond, msg) => (cond ? pass : fails).push(msg);
const img = async p => { const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true }); return (x, y) => { const i = (Math.round(y) * info.width + Math.round(x)) * info.channels; return [data[i], data[i + 1], data[i + 2]]; }; };
const eq = (p, c) => p.every((v, i) => Math.abs(v - c[i]) <= 1);
const px = await img(after.shot);
const stateOf = id => id.split('-')[1];
for (const id of ids) {
  const B = before.geo[id], A = after.geo[id];
  ok(JSON.stringify([B.sep, B.a, B.b]) === JSON.stringify([A.sep, A.a, A.b]), `${id}: separator+panel geometry unchanged ${JSON.stringify(A.sep)}`);
  ok(JSON.stringify(B.hit) === JSON.stringify(A.hit), `${id}: ::after hit area unchanged ${A.hit.slice(1, 5).join(' ')}`);
  const st = stateOf(id), hot = st === 'hover' || st === 'active';
  const lineC = hot ? C.pink : C.line;
  const [x, y, w, h] = A.sep, ws = id.startsWith('ws'), horiz = w > h;
  if (ws) {
    const lw = parseFloat(A.before[1]);
    ok(eq(px(x + 3, y + 10), lineC) && eq(px(x + 3 + lw, y + 10), C.ink), `${id}: workspace ::before line ${lw}px ${hot ? 'pink' : 'purple'} + ink groove`);
    ok(A.bg === 'rgba(0, 0, 0, 0)', `${id}: 8px workspace slot stays transparent`);
  } else if (!horiz) {
    ok(w >= 1 && [...Array(w).keys()].every(k => eq(px(x + k, y + 10), lineC)) && eq(px(x + w, y + 10), C.ink), `${id}: vertical line ${w}px ${hot ? 'pink' : 'purple'} + 1px ink`);
  } else {
    ok([...Array(h).keys()].every(k => eq(px(x + 20, y + k), lineC)) && eq(px(x + 20, y + h), C.ink), `${id}: horizontal line ${h}px ${hot ? 'pink' : 'purple'} + 1px ink`);
  }
  if (A.grip) {
    const [gx, gy, gw, gh] = A.grip.rect;
    ok(A.grip.radius === '0px' && ((gw === 4 && gh === 16) || (gw === 16 && gh === 4)), `${id}: grip square ${gw}x${gh} radius ${A.grip.radius} rotate ${A.grip.rotate}`);
    // frame = line colour (36 px), well = ink (16 px), dots (12 px); drag fills the well pink and inks the dots
    const frame = lineC, well = st === 'active' ? C.pink : C.ink, dot = st === 'active' ? C.ink : hot ? C.hi : C.dotI;
    const hist = { frame: 0, well: 0, dot: 0, other: 0 };
    for (let yy = 0; yy < gh; yy++) for (let xx = 0; xx < gw; xx++) { const p = px(gx + xx, gy + yy); eq(p, frame) ? hist.frame++ : eq(p, well) ? hist.well++ : eq(p, dot) ? hist.dot++ : hist.other++; }
    const want = st === 'active' ? { frame: 52, well: 0, dot: 12, other: 0 } : { frame: 36, well: 16, dot: 12, other: 0 };
    ok(JSON.stringify(hist) === JSON.stringify(want), `${id}: grip pixel histogram ${JSON.stringify(hist)} (crisp, no AA)`);
  }
}
for (const [id, f] of Object.entries(after.focus)) {
  const fp = await img(f.shot);
  const [x, y, w, h] = f.rect, [cx, cy] = f.clip, horiz = w > h;
  let pinkOutline = 0;
  for (let k = 0; k < 40; k++) { const p = horiz ? fp(x + 20 + k - cx, y - 2 - cy) : fp(x - 2 - cx, y + 10 + k - cy); if (eq(p, C.pink)) pinkOutline++; }
  const ring = horiz ? fp(x + 20 - cx, y - 1 - cy) : fp(x - 1 - cx, y + 10 - cy);
  ok(!eq(ring, C.pink), `${id}: no stacked shadcn ring under the outline (px outside edge = ${ring})`);
  ok(f.fv && f.outline.startsWith('dotted 1px rgb(255, 127, 207) 1px') && pinkOutline >= 15 && pinkOutline <= 25, `${id}: focus-visible dotted 1px pink outline (${f.outline}; ${pinkOutline}/40 dotted px)`);
}
const report = { fails, pass, before: before.geo, after: after.geo, focus: after.focus, beforeFocus: before.focus };
await fs.writeFile(path.join(here, 'verify-output.json'), JSON.stringify(report, null, 1));
console.log(pass.length + ' pass, ' + fails.length + ' fail');
for (const f of fails) console.log('FAIL', f);
if (fails.length) process.exit(1);
