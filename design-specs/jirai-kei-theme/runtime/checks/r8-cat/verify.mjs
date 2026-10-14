import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';
import fs from 'node:fs/promises';

const root = '/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const appDist = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets';
const out = `${root}/runtime/checks/r8-cat`;
const baseCss = await Promise.all([
  `${appDist}/index-Cckb3vVG.css`,
  `${appDist}/App-C2mIqNXI.css`,
  `${root}/runtime/preview-package/jirai-kei-theme/theme.css`,
  `${root}/original-assets/r5/assets-r5.css`,
  `${root}/runtime/navigation-r7.css`
].map((file) => fs.readFile(file, 'utf8')));
const cases = [
  { id: 'A', label: 'A · Nav footer', file: `${root}/runtime/cat-r8-a.css`, selector: '.vrcx-0-sidebar-surface [data-sidebar="footer"]', pseudo: '::after' },
  { id: 'B', label: 'B · Title gap', file: `${root}/runtime/cat-r8-b.css`, selector: '.title-gap', pseudo: '::after' },
  { id: 'C', label: 'C · SOCIAL title', file: `${root}/runtime/cat-r8-c.css`, selector: '.vrcx-0-side-panel', pseudo: '::before' }
];
const browser = await chromium.launch({ headless: true });
const results = [];
const fullScreens = [];
const catCrops = [];
const intersects = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

for (const testCase of cases) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 740 }, deviceScaleFactor: 1 });
  await page.goto(`file://${out}/fixture.html`);
  for (const css of baseCss) await page.addStyleTag({ content: css });
  // Isolate candidate C from the pre-existing R7 side-panel corner art; never edit production styles here.
  await page.addStyleTag({ content: '.vrcx-0-side-panel::after{content:none!important}' });
  await page.addStyleTag({ content: await fs.readFile(testCase.file, 'utf8') });

  const measured = await page.evaluate(({ selector, pseudo, id }) => {
    const host = document.querySelector(selector);
    const style = getComputedStyle(host, pseudo);
    const rect = host.getBoundingClientRect();
    const num = (v) => Number.parseFloat(v) || 0;
    const borderLeft = num(getComputedStyle(host).borderLeftWidth);
    const borderTop = num(getComputedStyle(host).borderTopWidth);
    let cat;
    let catImageSize;
    if (id === 'A') {
      cat = { x: rect.right - num(style.right) - num(style.width), y: rect.bottom - num(style.bottom) - num(style.height), width: num(style.width), height: num(style.height) };
      catImageSize = style.backgroundSize;
    } else if (id === 'B') {
      const gap = host.getBoundingClientRect();
      cat = { x: gap.x + (gap.width - 18) / 2, y: gap.y + 7, width: num(style.width), height: num(style.height) };
      catImageSize = style.backgroundSize;
    } else {
      const panel = document.querySelector('.vrcx-0-side-panel');
      const panelRect = panel.getBoundingClientRect();
      const panelStyle = getComputedStyle(panel);
      const before = getComputedStyle(panel, '::before');
      const action = document.querySelector('.panel-actions').getBoundingClientRect();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = `${before.fontSize} ${before.fontFamily}`;
      const labelWidth = context.measureText(String(before.content).replace(/^['\"]|['\"]$/g, '')).width;
      const bgX = Number.parseFloat(before.backgroundPositionX) || 64;
      const pseudoHeight = num(before.height) || 24;
      cat = {
        x: panelRect.left + num(panelStyle.borderLeftWidth) + num(before.paddingLeft) + bgX,
        y: panelRect.top + num(panelStyle.borderTopWidth) + action.height + (pseudoHeight - 18) / 2,
        width: 18, height: 18
      };
      catImageSize = before.backgroundSize;
      const labelLeft = panelRect.left + num(panelStyle.borderLeftWidth) + num(before.paddingLeft);
      window.__socialTextBounds = { x: labelLeft, y: cat.y, width: labelWidth, height: 18 };
    }
    const buttons = [...document.querySelectorAll('button')].map((el) => {
      const r = el.getBoundingClientRect();
      return { label: el.getAttribute('aria-label') || el.textContent.trim(), x: r.x, y: r.y, width: r.width, height: r.height };
    });
    const copyCat = { ...cat };
    return {
      generated: style.content !== 'none' && style.content !== 'normal',
      width: num(style.width), height: num(style.height), opacity: Number.parseFloat(style.opacity),
      pointerEvents: style.pointerEvents, animationName: style.animationName,
      backgroundImage: style.backgroundImage, backgroundSize: catImageSize,
      cat: copyCat, buttons,
      brand: (() => { const r=document.querySelector('.vrcx-0-brand').getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; })(),
      help: (() => { const r=document.querySelector('.help').getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; })(),
      search: (() => { const r=document.querySelector('.search').getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; })(),
      socialText: window.__socialTextBounds || null,
      canvasMetrics: { title: document.querySelector('.vrcx-0-titlebar').getBoundingClientRect().toJSON(), footer: document.querySelector('[data-sidebar="footer"]').getBoundingClientRect().toJSON() }
    };
  }, testCase);

  if (!measured.generated) throw new Error(`${testCase.id}: pseudo not generated`);
  if (measured.width !== 18 || measured.height !== 18) {
    // Candidate C uses the existing full-width SOCIAL ::before; the cat sprite layer itself must still be 18x18.
    if (testCase.id !== 'C' || !measured.backgroundSize.split(',').some((size) => size.trim() === '18px 18px')) {
      throw new Error(`${testCase.id}: expected cat sprite 18x18; got ${JSON.stringify({ width: measured.width, height: measured.height, size: measured.backgroundSize })}`);
    }
  }
  if (measured.pointerEvents !== 'none') throw new Error(`${testCase.id}: pointer-events is ${measured.pointerEvents}`);
  if (measured.opacity < 0.7) throw new Error(`${testCase.id}: opacity below .7 (${measured.opacity})`);
  if (!measured.backgroundImage.includes('data:image/svg+xml')) throw new Error(`${testCase.id}: expected inline pixel cat image`);

  const blockers = testCase.id === 'A'
    ? measured.buttons.filter((b) => ['设置', '收起导航栏'].includes(b.label))
    : testCase.id === 'B'
      ? [measured.brand, measured.help, measured.search, ...measured.buttons.filter((b) => ['最小化', '最大化', '关闭'].includes(b.label))]
      : [measured.socialText, ...measured.buttons.filter((b) => ['添加', '设置'].includes(b.label))];
  const hit = blockers.filter((b) => b && intersects(measured.cat, b));
  if (hit.length) throw new Error(`${testCase.id}: cat overlaps UI text/button ${JSON.stringify(hit)}`);

  const stableRects = await page.evaluate(() => [...document.querySelectorAll('.page,.vrcx-0-titlebar,.vrcx-0-sidebar-surface,[data-sidebar="footer"],.vrcx-0-main-content,.vrcx-0-side-panel')].map((el) => {
    const r=el.getBoundingClientRect(); return [r.x,r.y,r.width,r.height];
  }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reduced = await page.evaluate(({ selector, pseudo }) => {
    const style=getComputedStyle(document.querySelector(selector),pseudo);
    return { opacity:Number.parseFloat(style.opacity), animationName:style.animationName, pointerEvents:style.pointerEvents };
  }, testCase);
  if (reduced.opacity < 0.55 || reduced.animationName !== 'none' || reduced.pointerEvents !== 'none') {
    throw new Error(`${testCase.id}: reduced-motion visibility/safety failure ${JSON.stringify(reduced)}`);
  }
  await page.waitForTimeout(100);
  const afterRects = await page.evaluate(() => [...document.querySelectorAll('.page,.vrcx-0-titlebar,.vrcx-0-sidebar-surface,[data-sidebar="footer"],.vrcx-0-main-content,.vrcx-0-side-panel')].map((el) => {
    const r=el.getBoundingClientRect(); return [r.x,r.y,r.width,r.height];
  }));
  if (JSON.stringify(stableRects) !== JSON.stringify(afterRects)) throw new Error(`${testCase.id}: layout changed under reduced-motion`);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const normalBuffer = await page.screenshot({ type: 'png' });
  await fs.writeFile(`${out}/${testCase.id.toLowerCase()}-normal.png`, normalBuffer);
  fullScreens.push({ input: normalBuffer, id: testCase.id });
  const crop = await sharp(normalBuffer)
    .extract({ left: Math.max(0, Math.floor(measured.cat.x) - 1), top: Math.max(0, Math.floor(measured.cat.y) - 1), width: 20, height: 20 })
    .resize(80, 80, { kernel: 'nearest' }).png().toBuffer();
  catCrops.push({ input: crop, id: testCase.id });
  results.push({ id: testCase.id, label: testCase.label, selector: `${testCase.selector}${testCase.pseudo}`, catRect: measured.cat, opacityNormal: measured.opacity, opacityReduced: reduced.opacity, pointerEvents: measured.pointerEvents, animationNormal: measured.animationName, animationReduced: reduced.animationName, nonOverlap: true, layoutStable: true, catImageSize: measured.backgroundSize });
  await page.close();
}

const colW = 360, colH = 420;
const pieces = [{ input: Buffer.from(`<svg width="1080" height="420" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#171225"/>${cases.map((c,i)=>`<text x="${i*colW+14}" y="25" font-family="sans-serif" font-size="18" font-weight="700" fill="#ffe4f5">${c.label}</text><text x="${i*colW+110}" y="286" font-family="sans-serif" font-size="13" fill="#cdb0e8">cat 4× detail</text>`).join('')}</svg>`), left: 0, top: 0 }];
for (let i=0;i<3;i++) {
  pieces.push({ input: await sharp(fullScreens[i].input).resize(340,229,{fit:'fill'}).png().toBuffer(), left:i*colW+10, top:36 });
  pieces.push({ input: catCrops[i].input, left:i*colW+12, top:282 });
}
await sharp({ create: { width: 1080, height: colH, channels: 4, background: '#171225' } }).composite(pieces).png().toFile(`${out}/candidates.png`);
await fs.writeFile(`${out}/verify-output.json`, JSON.stringify({ fixture: 'NOT WINDOWS', candidates: results }, null, 2) + '\n');
await browser.close();
console.log(JSON.stringify(results, null, 2));
console.log(`PASS: three candidates, 18px cat asset, normal/reduced opacity, non-overlap, pointer-events, stable layout; ${out}/candidates.png`);
