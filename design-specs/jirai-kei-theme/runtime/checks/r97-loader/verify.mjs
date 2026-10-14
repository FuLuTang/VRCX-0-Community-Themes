/* NOT WINDOWS: R9.7 Q2 loader routing check.
   before = R9.6k bundle; after = bundle + loader-r97 (= /tmp/jirai-r97-q2/theme.css). Both on top of the real app CSS. */
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import { sites } from './sites.mjs';
const require = createRequire(import.meta.url);
const sharp = require('/tmp/dsh-theme-tools/node_modules/sharp');
const out = new URL('.', import.meta.url).pathname;
const APP_CSS = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css';
const BEFORE = '/tmp/jirai-lead-r96k/jirai-kei-theme/theme.css';
const AFTER = process.env.JIRAI_AFTER || '/tmp/jirai-r97-q2/theme.css';
const r97 = await fs.readFile(new URL('../../loader-r97.css', import.meta.url), 'utf8');
const afterCss = await fs.readFile(AFTER, 'utf8');
const beforeCss = await fs.readFile(BEFORE, 'utf8');
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(String(msg).slice(0, 400)); };
check(afterCss === beforeCss + '/* SECTION loader-r97 */\n' + r97, 'AFTER bundle != BEFORE + SECTION loader-r97 + runtime/loader-r97.css');
check(Buffer.byteLength(r97) <= 3072, `loader-r97.css ${Buffer.byteLength(r97)} B > 3KB`);
check(!/\/\*\s*SECTION/.test(r97), 'loader-r97.css must not contain a SECTION header');
check(!/data:image/.test(r97), 'loader-r97.css must not inline images (reuse --jk-loader-sheet)');

const wrap = (ctx, html) => ({
  main: `<div class="vrcx-0-main-content"><div class="vrcx-0-page-scaffold h-full">${html}</div></div>`,
  entity: `<div class="entity-dialog h-full">${html}</div>`,
  dialog: `<div class="dlg h-full">${html}</div>`,
  login: `<div data-vrcx-0-surface="login-page">${html}</div>`,
  plain: html
}[ctx]);
const card = (s) => `<section class="site" data-id="${s.id}" data-cat="${s.cat}"><h3>${s.id} · ${s.cat}<small>${s.src}</small></h3><div class="stage" style="${s.h ? `height:${s.h}px` : ''}">${wrap(s.ctx, s.html)}</div></section>`;
const group = (id, title, list) => `<div class="group" id="${id}"><h2>${title}</h2><div class="grid">${list.map(card).join('')}</div></div>`;
const A = sites.filter((s) => s.cat === 'A'), B = sites.filter((s) => s.cat === 'B'), D = sites.filter((s) => s.cat === 'D');
const keyIds = ['timeline', 'twoperson', 'loadingstate', 'button', 'refreshspin', 'decoy'];
const keys = keyIds.map((k) => sites.find((s) => s.key === k));
const fixture = `<!doctype html><html lang="zh-CN" class="dark"><head><meta charset="utf-8"><title>R9.7 loader routing · NOT WINDOWS</title><style>
*{box-sizing:border-box}html,body{margin:0;background:#16112a;color:#f2ebff}body{font:13px/1.35 Arial,sans-serif}body{padding:12px}
h2{margin:6px 0 8px;font:700 15px monospace;color:#ff9fd9}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
#keys .grid{grid-template-columns:repeat(6,minmax(0,1fr))}.site{min-width:0;border:1px solid #6c5ce0;background:#201936;padding:6px}
.site h3{margin:0 0 6px;font:700 11px monospace;color:#ffb8e6}.site h3 small{display:block;font-weight:400;color:#c7b8db;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.stage{position:relative;overflow:hidden;border:1px dashed #514281;background:#211a32;display:flex;flex-direction:column;justify-content:flex-start;padding:4px}
.stage>*{flex:1 1 auto;min-height:0}.stage>.vrcx-0-main-content{position:relative}
</style></head><body>
${group('keys', 'Key sites (図3 timeline · 図4 two-person · LoadingState · button spinner · refresh spinning · static decoy)', keys)}
${group('a1', 'A · page/block loaders (1/2)', A.slice(0, 16))}
${group('a2', 'A · page/block loaders (2/2)', A.slice(16))}
${group('bd', 'B · inline/button spinners  +  D · decoys', [...B, ...D])}
</body></html>`;
await fs.writeFile(`${out}/fixture.html`, fixture);

const browser = await chromium.launch({ headless: true, args: ['--disable-lcd-text'] });
const open = async (themeCss, { reduced = false, reduceEffects = false } = {}) => {
  const page = await browser.newPage({ viewport: { width: 1600, height: 2100 }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  await page.setContent(fixture, { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ path: APP_CSS });
  await page.addStyleTag({ content: themeCss });
  if (reduceEffects) await page.evaluate(() => document.documentElement.classList.add('reduce-effects'));
  await page.evaluate(() => document.fonts.ready);
  return page;
};
const PROPS = ['display', 'width', 'height', 'color', 'opacity', 'backgroundImage', 'backgroundPosition', 'backgroundSize', 'backgroundColor', 'maskImage', 'animationName', 'animationDuration', 'animationTimingFunction', 'animationIterationCount', 'transform', 'rotate', 'imageRendering', 'marginTop', 'marginRight'];
const measureStyles = (page) => page.evaluate((PROPS) => [...document.querySelectorAll('section.site')].map((sec) => {
  const probe = sec.querySelector('[data-probe]');
  const stage = sec.querySelector('.stage');
  const top = stage.firstElementChild.matches('.vrcx-0-main-content,.entity-dialog,.dlg,[data-vrcx-0-surface=login-page]') ? stage.firstElementChild.querySelector('.vrcx-0-page-scaffold>*') || stage.firstElementChild.firstElementChild : stage.firstElementChild;
  const rect = (el) => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 100) / 100).join(','); };
  const cs = getComputedStyle(probe);
  const style = Object.fromEntries(PROPS.map((p) => [p, p === 'backgroundImage' ? cs[p].slice(0, 40) : p === 'maskImage' ? cs[p].slice(0, 12) : cs[p]]));
  const parent = probe.parentElement, ps = getComputedStyle(parent);
  return { id: sec.dataset.id, cat: sec.dataset.cat, probeRect: rect(probe), probeCenter: (() => { const r = probe.getBoundingClientRect(); return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]; })(),
    geom: [top, ...sec.querySelectorAll('[data-geom]')].filter((v, i, a) => a.indexOf(v) === i).map(rect), stage: rect(stage),
    parentDir: ps.flexDirection, parentRect: rect(parent), style, full: [...cs].filter((p) => !p.startsWith('--')).map((p) => p + ':' + cs.getPropertyValue(p)).join(';') };
}), PROPS);
// Rects are read with probe animations frozen so a rotating ring's bounding box does not depend on timing.
const measure = async (page) => {
  const styles = await measureStyles(page);
  const tag = await page.addStyleTag({ content: '[data-probe]{animation:none!important}' });
  const rects = await measureStyles(page);
  await tag.evaluate((t) => t.remove());
  return styles.map((s, i) => ({ ...s, probeRect: rects[i].probeRect, geom: rects[i].geom, stage: rects[i].stage, parentRect: rects[i].parentRect }));
};

const pBefore = await open(beforeCss), pAfter = await open(afterCss);
const before = await measure(pBefore), after = await measure(pAfter);
const results = [];
for (const s of sites) {
  const b = before.find((x) => x.id === s.id), a = after.find((x) => x.id === s.id);
  const r = { id: s.id, cat: s.cat, src: s.src, before: { anim: b.style.animationName, timing: b.style.animationTimingFunction, size: `${b.style.width}x${b.style.height}` }, after: { anim: a.style.animationName, timing: a.style.animationTimingFunction, size: `${a.style.width}x${a.style.height}`, dir: a.parentDir, mask: a.style.maskImage } };
  if (s.cat === 'A') {
    check(a.style.animationName === 'jk-loader-dance', `${s.id} dancer animation missing (${a.style.animationName})`);
    check(/^steps\(11(, end)?\)$/.test(a.style.animationTimingFunction) && a.style.animationDuration === '1.1s', `${s.id} dancer timing ${a.style.animationTimingFunction} ${a.style.animationDuration}`);
    check(a.style.width === '56px' && a.style.height === '72px', `${s.id} dancer size ${a.style.width}x${a.style.height}`);
    check(a.style.backgroundImage.startsWith('url("data:image/png;base64'), `${s.id} sprite sheet not painted`);
    check(a.style.backgroundSize === '616px 72px' && a.style.maskImage === 'none' && a.style.color === 'rgba(0, 0, 0, 0)' && a.style.opacity === '1', `${s.id} dancer paint ${a.style.backgroundSize} mask=${a.style.maskImage} color=${a.style.color} op=${a.style.opacity}`);
    check(a.style.transform === 'none' && a.style.rotate === 'none' && a.style.imageRendering === 'pixelated', `${s.id} dancer transform/rendering`);
    if (s.geom === 'fixed') { check(JSON.stringify(a.geom) === JSON.stringify(b.geom), `${s.id} container geometry changed ${JSON.stringify(b.geom)} -> ${JSON.stringify(a.geom)}`); }
    check(a.stage === b.stage, `${s.id} stage moved`);
    r.geom = s.geom; r.geomBefore = b.geom; r.geomAfter = a.geom; r.r9Before = b.style.animationName === 'jk-loader-dance';
    // Label kept: text content of parent unchanged and still rendered.
  } else if (s.cat === 'B') {
    check(a.probeRect === b.probeRect, `${s.id} B spinner moved/resized ${b.probeRect} -> ${a.probeRect}`);
    check(a.style.animationName !== 'jk-loader-dance' && !a.style.backgroundImage.startsWith('url("data:image/png'), `${s.id} B spinner got the dancer`);
    check(['r5-spinner-step', 'spin'].includes(a.style.animationName), `${s.id} B spinner not rotating (${a.style.animationName})`);
    check(/^steps\(8/.test(a.style.animationTimingFunction), `${s.id} B spinner not stepped (${a.style.animationTimingFunction})`);
    check(a.style.maskImage.startsWith('url('), `${s.id} B spinner lost pixel glyph mask (${a.style.maskImage})`);
    const diff = a.full.split(';').filter((p, i) => p !== b.full.split(';')[i]).map((p) => p.split(':')[0]).filter((p) => p !== 'transform');
    check(diff.every((p) => p === 'animation-timing-function'), `${s.id} B unexpected style diffs: ${diff.join(',')}`);
    r.changed = diff;
  } else {
    check(a.full.replace(/transform:[^;]*/,'') === b.full.replace(/transform:[^;]*/,'') && a.probeRect === b.probeRect && JSON.stringify(a.geom) === JSON.stringify(b.geom) && a.parentDir === b.parentDir, `${s.id} decoy changed`);
    r.unchanged = a.full === b.full;
  }
  results.push(r);
}

// Motion-off modes: every A dancer frozen on frame 1, every B spinner still.
const motion = {};
for (const [mode, opts] of [['prefers-reduced-motion', { reduced: true }], ['html.reduce-effects', { reduceEffects: true }]]) {
  const p = await open(afterCss, opts);
  const m = await measure(p);
  const bad = m.filter((x) => (x.cat === 'A' && (x.style.animationName !== 'none' || x.style.backgroundPosition !== '0px 0px' || x.style.width !== '56px')) || (x.cat === 'B' && x.style.animationName !== 'none'));
  const running = await p.evaluate(() => document.getAnimations().filter((an) => an.playState === 'running' && an.effect?.target?.matches?.('[data-probe]')).length);
  check(bad.length === 0 && running === 0, `${mode}: not static -> ${bad.map((x) => x.id + ':' + x.style.animationName).join(',')} running=${running}`);
  motion[mode] = { staticA: m.filter((x) => x.cat === 'A').length, staticB: m.filter((x) => x.cat === 'B').length, notStatic: bad.map((x) => x.id), runningProbeAnimations: running };
  await p.close();
}

// Screenshots (animations disabled -> frame 1 / unrotated).
const shot = async (page, sel, file) => { await page.locator(sel).screenshot({ path: `${out}/${file}`, animations: 'disabled' }); const m = await sharp(`${out}/${file}`).metadata(); check(m.width <= 2000 && m.height <= 2000, `${file} too large ${m.width}x${m.height}`); return { file, w: m.width, h: m.height }; };
const shots = [];
for (const [sel, name] of [['#keys', 'keys'], ['#a1', 'a1'], ['#a2', 'a2'], ['#bd', 'bd']]) { shots.push(await shot(pBefore, sel, `before-${name}.png`)); shots.push(await shot(pAfter, sel, `after-${name}.png`)); }
// Key sites before/after stacked.
const kb = await sharp(`${out}/before-keys.png`).metadata(), ka = await sharp(`${out}/after-keys.png`).metadata();
await sharp({ create: { width: Math.max(kb.width, ka.width), height: kb.height + ka.height + 8, channels: 4, background: '#ff7fcf' } })
  .composite([{ input: `${out}/before-keys.png`, top: 0, left: 0 }, { input: `${out}/after-keys.png`, top: kb.height + 8, left: 0 }]).png().toFile(`${out}/keys-before-after.png`);
shots.push({ file: 'keys-before-after.png' });
// 11 dance frames of the relationship-timeline overlay dancer, 2x nearest.
const frames = [];
const tl = pAfter.locator('#a1 section[data-id="A03"] [data-probe]');
for (let i = 0; i < 11; i++) {
  await pAfter.evaluate((t) => { const el = document.querySelector('#a1 section[data-id="A03"] [data-probe]'); for (const an of el.getAnimations()) { an.pause(); an.currentTime = t; } }, i * 100 + 50);
  const buf = await tl.screenshot({ animations: 'allow' });
  frames.push(await sharp(buf).resize(112, 144, { kernel: 'nearest' }).png().toBuffer());
  const bp = await pAfter.evaluate(() => getComputedStyle(document.querySelector('#a1 section[data-id="A03"] [data-probe]')).backgroundPosition);
  check(bp === `${-56 * i}px 0px`, `frame ${i} background-position ${bp}`);
}
await sharp({ create: { width: 11 * 116 + 4, height: 152, channels: 4, background: '#211a32' } }).composite(frames.map((input, i) => ({ input, top: 4, left: 4 + i * 116 }))).png().toFile(`${out}/dance-frames-2x.png`);
shots.push({ file: 'dance-frames-2x.png' });
await browser.close();

const report = { bytes: Buffer.byteLength(r97), counts: { A: A.length, B: B.length, D: D.length }, failures, motion, shots, results };
await fs.writeFile(`${out}/verify-output.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify({ bytes: report.bytes, counts: report.counts, failures, motion, shots: shots.map((s) => s.file + (s.w ? ` ${s.w}x${s.h}` : '')) }, null, 1));
if (failures.length) process.exit(1);
