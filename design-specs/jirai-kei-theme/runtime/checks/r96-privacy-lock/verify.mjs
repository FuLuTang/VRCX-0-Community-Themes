/* Static, fictional privacy-lock fixture; never connects to the live VRCX GUI. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const baseBundle = process.env.JIRAI_BASE_BUNDLE || '/tmp/jirai-lead-r96d/jirai-kei-theme/theme.css';
const appCssSource = process.env.JIRAI_APP_CSS || '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css';
const scope = '[data-vrcx-0-surface="privacy-lock"]';
const [html, appCss, baseCss, privacyCss] = await Promise.all([
  fs.readFile(path.join(here, 'fixture.html'), 'utf8'),
  fs.readFile(appCssSource, 'utf8'),
  fs.readFile(baseBundle, 'utf8'),
  fs.readFile(path.join(runtime, 'privacy-lock-r96.css'), 'utf8')
]);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
assert(Buffer.byteLength(privacyCss) <= 4096, `privacy-lock-r96.css exceeds 4KB: ${Buffer.byteLength(privacyCss)}`);
assert(!/@import\b|url\((?!\s*["']?data:)/i.test(privacyCss), 'Privacy lock CSS must not load external assets');
const strippedCss = privacyCss.replace(/\/\*[\s\S]*?\*\//g, '');
const selectorBlocks = [...strippedCss.matchAll(/(?:^|})\s*([^{}]+?)\s*\{/g)].map(match => match[1].trim());
assert(selectorBlocks.length > 0 && selectorBlocks.every(selector => selector.startsWith(scope)), 'Every privacy-lock selector must begin with the strict surface anchor');
assert(html.includes('id="locked-state"') && html.includes('id="recovering-state"') && html.includes('id="startup-error-state"'), 'Fixture must include all three source states');
assert(html.includes('data-vrcx-0-surface="statusbar"') && html.includes('id="dialog-decoy"'), 'Fixture must include statusbar and unrelated-dialog decoys');

const browser = await chromium.launch({ headless: true });
const failures = [];
const makePage = async (includeR96) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1, colorScheme: 'dark' });
  page.on('pageerror', error => failures.push(error.message));
  await page.setContent(html, { waitUntil: 'load' });
  await page.addStyleTag({ content: appCss });
  await page.addStyleTag({ content: baseCss });
  if (includeR96) await page.addStyleTag({ content: privacyCss });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(40);
  return page;
};
// Lead fix: the OTP slot selector matches 4 slots, so strict mode threw. Probe the first slot
// (that is what the size-10 geometry assertion means) instead of the whole list.
const rect = async (page, selector) => page.locator(selector).first().evaluate(el => {
  const r = el.getBoundingClientRect();
  return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), width: +r.width.toFixed(2), height: +r.height.toFixed(2) };
});
const style = async (page, selector) => page.locator(selector).first().evaluate(el => {
  const s = getComputedStyle(el);
  return {
    color: s.color, background: s.backgroundColor, image: s.backgroundImage,
    borderColor: s.borderColor, borderWidth: s.borderWidth, borderRadius: s.borderRadius,
    boxShadow: s.boxShadow, outlineColor: s.outlineColor, outlineStyle: s.outlineStyle,
    outlineWidth: s.outlineWidth, outlineOffset: s.outlineOffset, fontFamily: s.fontFamily,
    opacity: s.opacity, width: +el.getBoundingClientRect().width.toFixed(2), height: +el.getBoundingClientRect().height.toFixed(2)
  };
});
const rectSelectors = [
  '#locked-card', '#recovering-card', '#startup-error-card',
  '#privacy-lock-code', '#privacy-lock-code [data-slot="input-otp-slot"]',
  '#privacy-lock-account-password', '#background-button', '#logout-button',
  '#clear-unlock-button', '#retry-button', '#statusbar-probe',
  '#dialog-decoy [data-slot="dialog-content"]'
];
const safeRects = async page => Object.fromEntries(await Promise.all(rectSelectors.map(async selector => [selector, await rect(page, selector)])));
const close = (a, b, tol = 1) => Math.abs(a - b) <= tol;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let before, after;
try {
  before = await makePage(false);
  after = await makePage(true);
  const beforeRects = await safeRects(before);
  const afterRects = await safeRects(after);
  const geometryDiffs = [];
  for (const selector of rectSelectors) {
    for (const key of ['x', 'y', 'width', 'height']) {
      if (!close(beforeRects[selector][key], afterRects[selector][key])) geometryDiffs.push({ selector, key, before: beforeRects[selector][key], after: afterRects[selector][key] });
    }
  }

  const beforeLocked = await style(before, '#locked-card');
  const afterLocked = await style(after, '#locked-card');
  const afterRecovering = await style(after, '#recovering-card');
  const afterStartupError = await style(after, '#startup-error-card');
  const beforeTitle = await style(before, '#locked-title');
  const afterTitle = await style(after, '#locked-title');
  const afterStartupTitle = await style(after, '#startup-error-title');
  const beforeLockDot = await style(before, '#locked-state span[class~="size-2"]');
  const afterLockDot = await style(after, '#locked-state span[class~="size-2"]');
  const beforeStatusbarDot = await style(before, '#statusbar-probe span[class~="size-2"]');
  const afterStatusbarDot = await style(after, '#statusbar-probe span[class~="size-2"]');
  const beforeDialog = await style(before, '#dialog-decoy [data-slot="dialog-content"]');
  const afterDialog = await style(after, '#dialog-decoy [data-slot="dialog-content"]');
  const beforePin = await style(before, '#privacy-lock-code [data-slot="input-otp-slot"][data-active="true"]');
  const afterPin = await style(after, '#privacy-lock-code [data-slot="input-otp-slot"][data-active="true"]');
  const beforeOutlineButton = await style(before, '#background-button');
  const afterOutlineButton = await style(after, '#background-button');
  const afterDefaultButton = await style(after, '#clear-unlock-button');
  const beforePopup = await style(before, '#locked-state [data-vrcx-0-surface="privacy-lock"]');
  const afterPopup = await style(after, '#locked-state [data-vrcx-0-surface="privacy-lock"]');

  const focusBefore = await before.locator('#retry-button').evaluate(el => { el.focus(); const s = getComputedStyle(el); return { active: document.activeElement === el, outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, offset: s.outlineOffset }; });
  const focusAfter = await after.locator('#retry-button').evaluate(el => { el.focus(); const s = getComputedStyle(el); return { active: document.activeElement === el, outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, offset: s.outlineOffset }; });
  const inputAttrsBefore = await before.locator('#privacy-lock-account-password').evaluate(el => ({ type: el.type, autoComplete: el.autocomplete, placeholder: el.placeholder, disabled: el.disabled }));
  const inputAttrsAfter = await after.locator('#privacy-lock-account-password').evaluate(el => ({ type: el.type, autoComplete: el.autocomplete, placeholder: el.placeholder, disabled: el.disabled }));
  const cardTitles = await after.locator('#state-grid [data-vrcx-0-surface="privacy-lock"] > div[class~="bg-popover/80"] > h2').count();

  await before.screenshot({ path: path.join(here, 'before.png'), fullPage: true, animations: 'disabled' });
  await after.screenshot({ path: path.join(here, 'after.png'), fullPage: true, animations: 'disabled' });
  const beforeImage = await sharp(path.join(here, 'before.png')).metadata();
  const afterImage = await sharp(path.join(here, 'after.png')).metadata();
  const imageSizes = { before: { width: beforeImage.width, height: beforeImage.height }, after: { width: afterImage.width, height: afterImage.height } };
  const imageBoundsPass = [beforeImage, afterImage].every(image => image.width <= 2000 && image.height <= 2000);

  const titlePass = afterTitle.fontFamily.includes('WD Pixel CJK') && afterStartupTitle.fontFamily.includes('WD Pixel CJK');
  const cardPaintPass = [afterLocked, afterRecovering, afterStartupError].every(card => card.borderRadius === '2px' && card.background === 'rgb(32, 25, 54)' && card.image.includes('linear-gradient') && card.boxShadow.includes('rgb(108, 92, 224)'));
  const statusLampPass = afterLockDot.borderRadius === '0px' && afterLockDot.borderWidth === '1px' && afterLockDot.background === beforeLockDot.background;
  const pinPass = afterPin.borderColor === 'rgb(255, 127, 207)' && afterPin.outlineColor === 'rgb(255, 127, 207)' && afterPin.outlineWidth === '2px';
  const buttonsPass = afterOutlineButton.background === 'rgb(59, 44, 85)' && afterOutlineButton.boxShadow.includes('2px 2px') && afterDefaultButton.background === 'rgb(255, 127, 207)' && afterDefaultButton.boxShadow.includes('3px 3px');
  const decoysPass = same(beforeStatusbarDot, afterStatusbarDot) && same(beforeDialog, afterDialog);
  const focusPass = focusBefore.active && focusAfter.active && same(focusBefore, focusAfter);
  const behaviorPass = same(inputAttrsBefore, inputAttrsAfter);
  const geometryPass = geometryDiffs.length === 0;
  const failureList = [];
  for (const [condition, message] of [
    [titlePass, 'Privacy-lock titles did not pick up the pixel font'],
    [cardPaintPass, 'Locked/recovering/startup-error card paint is incomplete'],
    [statusLampPass, 'Lock StatusDot is not square or changed its semantic fill'],
    [pinPass, 'Active PIN slot is missing the pink frame'],
    [buttonsPass, 'Privacy-lock outline/default buttons are missing their scoped bevels'],
    [decoysPass, 'Statusbar or unrelated dialog decoy changed'],
    [focusPass, 'Retry-button focus outline/target changed'],
    [behaviorPass, 'Recovery input behavior attributes changed'],
    [geometryPass, 'Privacy-lock geometry changed by more than 1px'],
    [imageBoundsPass, 'A screenshot edge exceeds the 2000px limit'],
    [cardTitles === 3, 'Expected three direct privacy-lock state titles'],
    [failures.length === 0, `Browser page errors: ${failures.join('; ')}`]
  ]) if (!condition) failureList.push(message);

  const report = {
    status: failureList.length ? 'FAIL' : 'PASS',
    fixture: { label: 'NOT WINDOWS · fictional PrivacyLockOverlay DOM', sourceFiles: ['/tmp/vrcx-win-src-r9/src/features/privacy-lock/PrivacyLockOverlay.tsx', '/tmp/vrcx-win-src-r9/src/features/privacy-lock/LockCodeInput.tsx', '/tmp/vrcx-win-src-r9/src/components/layout/status-bar/StatusBarParts.tsx'], appCssSource, baseBundle, r96CssBytes: Buffer.byteLength(privacyCss), strictScopeSelectors: selectorBlocks.length },
    checks: {
      cards: { locked: afterLocked, recovering: afterRecovering, startupError: afterStartupError, pass: cardPaintPass },
      titles: { locked: afterTitle.fontFamily, startupError: afterStartupTitle.fontFamily, pass: titlePass },
      statusDot: { before: beforeLockDot, after: afterLockDot, statusbarDecoyUnchanged: same(beforeStatusbarDot, afterStatusbarDot), pass: statusLampPass },
      pin: { before: beforePin, after: afterPin, alreadyPinkFromFieldsToolbar: beforePin.borderColor === 'rgb(255, 127, 207)', pass: pinPass },
      buttons: { beforeOutline: beforeOutlineButton, afterOutline: afterOutlineButton, afterDefault: afterDefaultButton, buttonsBadgesR10AppliedToPortal: beforeOutlineButton.boxShadow.includes('2px 2px'), scopedPrivacyButtonsPass: buttonsPass },
      decoys: { statusbarUnchanged: same(beforeStatusbarDot, afterStatusbarDot), dialogUnchanged: same(beforeDialog, afterDialog), pass: decoysPass },
      focus: { before: focusBefore, after: focusAfter, pass: focusPass },
      recoveryInput: { before: inputAttrsBefore, after: inputAttrsAfter, pass: behaviorPass },
      geometry: { before: beforeRects, after: afterRects, diffs: geometryDiffs, pass: geometryPass },
      screenshots: { imageSizes, edgesUnder2000px: imageBoundsPass }
    },
    failures: failureList
  };
  await fs.writeFile(path.join(here, 'verify-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, cssBytes: report.fixture.r96CssBytes, cards: cardPaintPass, title: titlePass, pin: pinPass, statusDot: statusLampPass, buttons: buttonsPass, buttonsBadgesR10AppliedToPortal: report.checks.buttons.buttonsBadgesR10AppliedToPortal, decoys: decoysPass, focus: focusPass, geometryDiffs: geometryDiffs.length, screenshots: imageSizes, failures: failureList }));
  if (failureList.length) process.exitCode = 1;
} finally {
  await before?.close();
  await after?.close();
  await browser.close();
}
