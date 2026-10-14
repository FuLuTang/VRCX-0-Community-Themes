#!/usr/bin/env node
/*
 * Capture explicitly allowlisted, non-destructive transient UI states.
 *
 * `interactions.json` is the safety boundary: this script only triggers listed
 * containers, never chooses menu/list items, submits forms, toggles preferences, or
 * invokes app mutations. It saves an inert HTML fixture plus a snapshot seed; the
 * regular replay-fixtures.mjs then computes styles for that state deterministically.
 *
 * The live app route is restored before exit. Never close the CDP browser connection.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {gzipSync} from 'node:zlib';

const here = path.dirname(fileURLToPath(import.meta.url));
const themeDir = path.dirname(here);
function loadPlaywright() {
  for (const base of [process.env.PW_MODULE, path.join(themeDir, 'tools'), '/tmp/dsh-theme-tools'].filter(Boolean)) {
    try { return createRequire(path.join(base, 'package.json'))('playwright'); } catch {}
  }
  throw new Error('cannot resolve playwright; install design-specs/jirai-kei-theme/tools dependencies or set PW_MODULE');
}
const {chromium} = loadPlaywright();
const plan = JSON.parse(fs.readFileSync(path.join(here, 'interactions.json'), 'utf8'));
const fixtureDir = path.join(here, 'fixtures');
const snapshotDir = path.join(here, 'snapshot');
const screensDir = path.join(here, 'screens');
fs.mkdirSync(fixtureDir, {recursive: true});
fs.mkdirSync(snapshotDir, {recursive: true});
fs.mkdirSync(screensDir, {recursive: true});

const browser = await chromium.connectOverCDP(process.env.CDP_URL || 'http://127.0.0.1:9222');
const page = browser.contexts().flatMap((c) => c.pages())[0];
if (!page) throw new Error('no page found on CDP connection');
const initialHash = await page.evaluate(() => location.hash);
const results = [];

async function waitForSelector(selector, timeoutMs = 12000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const found = await page.evaluate((s) => Boolean(document.querySelector(s)), selector);
    if (found) return true;
    await page.waitForTimeout(200);
  }
  return false;
}

async function trigger(state) {
  if (state.action === 'hover') {
    const target = page.locator(state.selector).first();
    const box = await target.boundingBox();
    if (!box) return {found: false, matches: await page.locator(state.selector).count()};
    // Playwright dispatches page-scoped CDP pointer input; it does not activate the
    // native app window. This is needed for Radix tooltip timers that ignore synthetic
    // pointer events but respond to an actual page hover.
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    return {found: true, matches: await page.locator(state.selector).count()};
  }
  return page.evaluate(({selector, action}) => {
    const el = document.querySelector(selector);
    if (!el) return {found: false, matches: document.querySelectorAll(selector).length};
    const rect = el.getBoundingClientRect();
    const common = {bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2};
    if (action === 'click') {
      el.focus?.({preventScroll:true});
      el.click();
    } else if (action === 'contextmenu') {
      el.dispatchEvent(new MouseEvent('contextmenu', {...common, button: 2, buttons: 2}));
    } else {
      return {found: true, error: `unsupported allowlisted action: ${action}`};
    }
    return {found: true, matches: document.querySelectorAll(selector).length};
  }, {selector: state.selector, action: state.action});
}

async function surfaceVisible(selector) {
  return page.evaluate((s) => Array.from(document.querySelectorAll(s)).some((el) => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0 &&
      el.getAttribute('aria-hidden') !== 'true' && el.getAttribute('data-state') !== 'closed';
  }), selector);
}

async function serializeFixture() {
  return page.evaluate(() => {
    const root = document.documentElement.cloneNode(true);
    for (const script of root.querySelectorAll('script')) script.remove();
    const liveInputs = document.querySelectorAll('input'), cloneInputs = root.querySelectorAll('input');
    for (let i = 0; i < Math.min(liveInputs.length, cloneInputs.length); i++) {
      const live = liveInputs[i], clone = cloneInputs[i];
      if (live.type === 'checkbox' || live.type === 'radio') {
        if (live.checked) clone.setAttribute('checked', ''); else clone.removeAttribute('checked');
      } else clone.setAttribute('value', live.value);
    }
    const liveTextareas = document.querySelectorAll('textarea'), cloneTextareas = root.querySelectorAll('textarea');
    for (let i = 0; i < Math.min(liveTextareas.length, cloneTextareas.length); i++) cloneTextareas[i].textContent = liveTextareas[i].value;
    const liveOptions = document.querySelectorAll('option'), cloneOptions = root.querySelectorAll('option');
    for (let i = 0; i < Math.min(liveOptions.length, cloneOptions.length); i++) {
      if (liveOptions[i].selected) cloneOptions[i].setAttribute('selected', ''); else cloneOptions[i].removeAttribute('selected');
    }
    const liveDetails = document.querySelectorAll('details'), cloneDetails = root.querySelectorAll('details');
    for (let i = 0; i < Math.min(liveDetails.length, cloneDetails.length); i++) {
      if (liveDetails[i].open) cloneDetails[i].setAttribute('open', ''); else cloneDetails[i].removeAttribute('open');
    }
    return {
      html: `<!doctype html>\n${root.outerHTML}`,
      viewport: {innerWidth: innerWidth, innerHeight: innerHeight, devicePixelRatio},
      elementCount: document.body ? document.body.querySelectorAll('*').length + 1 : 0,
      styleTags: Array.from(document.querySelectorAll('style')).map((s) => ({id:s.id||null,bytes:s.textContent.length,layer:s.getAttribute('data-vrcx-0-css-layer')})),
    };
  });
}

for (const state of plan.states) {
  const started = Date.now();
  const record = {...state, status: 'captured'};
  try {
    await page.mouse.move(2, 2).catch(() => {});
    await page.evaluate((route) => { window.location.hash = route; }, state.route);
    const triggerFound = await waitForSelector(state.selector);
    if (!triggerFound) throw new Error(`trigger selector not found after route load: ${state.selector}`);
    const activation = await trigger(state);
    if (!activation.found) throw new Error(`trigger disappeared before activation: ${state.selector}`);
    record.matches = activation.matches;
    await page.waitForTimeout(state.action === 'hover' ? 700 : 400);
    const opened = await surfaceVisible(state.expected);
    record.expectedSurfaceFound = opened;
    if (!opened) throw new Error(`expected transient surface not found: ${state.expected}`);

    const fixture = await serializeFixture();
    const seedPath = path.join(snapshotDir, `${state.id}.json`);
    const sourceRouteSnapshot = JSON.parse(fs.readFileSync(path.join(snapshotDir, `${state.route.replace(/^\//, '').replace(/[/:?]/g, '_') || 'root'}.json`), 'utf8'));
    const fixturePath = path.join(fixtureDir, `${state.id}.html.gz`);
    const compressed = gzipSync(Buffer.from(fixture.html, 'utf8'));
    fs.writeFileSync(fixturePath, compressed);
    fs.writeFileSync(seedPath, JSON.stringify({
      route: state.route,
      stateId: state.id,
      capturedAt: new Date().toISOString(),
      viewport: fixture.viewport,
      propertySet: sourceRouteSnapshot.propertySet,
      elementCount: fixture.elementCount,
      styleTags: fixture.styleTags,
      trigger: {action: state.action, selector: state.selector, expected: state.expected},
      elements: [],
    }));
    await page.screenshot({path: path.join(screensDir, `${state.id}.png`), animations: 'disabled'});
    record.fixtureBytes = compressed.length;

  } catch (error) {
    record.status = 'error';
    record.error = String(error?.message || error);
  }
  // Dismiss only the transient surface. Never activate any item inside it.
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(200);
  if (await surfaceVisible(state.expected).catch(() => false) && state.action === 'click') {
    await page.locator(state.selector).first().evaluate((el) => el.click()).catch(() => {});
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(200);
  }
  record.closedAfterCapture = !(await surfaceVisible(state.expected).catch(() => false));
  await page.mouse.move(2, 2).catch(() => {});
  record.ms = Date.now() - started;
  results.push(record);
  console.log(`${record.status.padEnd(8)} ${state.id.padEnd(42)} ${record.ms} ms` + (record.error ? `  !! ${record.error}` : ''));
}

if (initialHash) {
  await page.evaluate((h) => { window.location.hash = h; }, initialHash).catch(() => {});
  await page.waitForTimeout(500).catch(() => {});
}
fs.writeFileSync(path.join(here, 'interaction-manifest.json'), JSON.stringify({
  schemaVersion: 1,
  capturedAt: new Date().toISOString(),
  originalHash: initialHash,
  policy: plan.policy,
  results,
}, null, 2) + '\n');
const errors = results.filter((r) => r.status === 'error').length;
console.log(`\n${results.length - errors}/${results.length} interaction fixtures captured`);
// Never browser.close(): this is a connection to the user's live app.
process.exit(errors === 0 ? 0 : 1);
