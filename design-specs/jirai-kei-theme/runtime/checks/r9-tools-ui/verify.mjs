/* Offline source-shaped ToolsPageContent fixture; does not inspect or automate Windows. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const appAssetDir = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets';
const outputDir = process.env.JIRAI_OUT || '/tmp/jirai-r9-out-controls/jirai-kei-theme';
const [html, css, themeCss, assetNames] = await Promise.all([
  fs.readFile(path.join(here, 'fixture.html'), 'utf8'),
  fs.readFile(path.join(runtime, 'tools-ui-r9.css'), 'utf8'),
  fs.readFile(path.join(outputDir, 'theme.css'), 'utf8'),
  fs.readdir(appAssetDir)
]);
const indexCss = assetNames.filter((name) => /^index-[\w-]+\.css$/.test(name));
const appCss = assetNames.filter((name) => /^App-[\w-]+\.css$/.test(name));
if (indexCss.length !== 1 || appCss.length !== 1) throw new Error(`Expected one index/App CSS bundle, found ${JSON.stringify({ indexCss, appCss })}`);
const appCssFiles = [path.join(appAssetDir, indexCss[0]), path.join(appAssetDir, appCss[0])];
const appCssContents = await Promise.all(appCssFiles.map((file) => fs.readFile(file, 'utf8')));
if (/@import\b|url\((?!["']?data:)/i.test(css)) throw new Error('New tools CSS must not import or load remote assets');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 1 });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));
const round = (n) => Math.round(n * 100) / 100;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const rgb = (value) => {
  const m = String(value).match(/[\d.]+/g);
  if (!m || m.length < 3) throw new Error(`Cannot parse color ${value}`);
  return m.slice(0, 3).map(Number);
};
const linear = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const luminance = ([r, g, b]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const contrast = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const sameRect = (a, b) => ['x', 'y', 'width', 'height'].every((key) => Math.abs(a[key] - b[key]) < 0.01);
const rootGate = '.vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"])';
const toolsSearchSelector = `${rootGate} > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]`;
const toolsRailSelector = `${rootGate} > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]`;

try {
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  for (const content of appCssContents) await page.addStyleTag({ content });
  await page.evaluate(async () => { await document.fonts.ready; });
  const snapshot = async () => page.evaluate(({ rootGate, toolsSearchSelector, toolsRailSelector }) => {
    const style = (node) => {
      if (!node) return null;
      const c = getComputedStyle(node), r = node.getBoundingClientRect();
      return {
        x: Math.round(r.x * 100) / 100, y: Math.round(r.y * 100) / 100,
        width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100,
        border: c.border, borderRadius: c.borderRadius, background: c.backgroundColor,
        color: c.color, boxShadow: c.boxShadow, outline: c.outline,
        outlineStyle: c.outlineStyle, outlineWidth: c.outlineWidth, outlineColor: c.outlineColor,
        padding: c.padding, gap: c.gap, display: c.display
      };
    };
    const toolRoot = document.querySelector(rootGate);
    const inputGroup = document.querySelector(toolsSearchSelector);
    const input = inputGroup?.querySelector('[data-slot="input-group-control"]');
    const rail = document.querySelector(toolsRailSelector);
    const items = rail ? [...rail.querySelectorAll(':scope > [data-slot="tabs-tab"]')] : [];
    const active = items.find((item) => item.matches('[data-active],[aria-selected="true"]'));
    const nav = document.querySelector('[data-fixture-navigation]');
    const settings = document.querySelector('[data-fixture-settings-rail]');
    const otherChart = document.querySelector('[data-fixture-other-chart] [data-slot="tabs-list"]');
    return {
      root: style(toolRoot), inputGroup: style(inputGroup), input: style(input), rail: style(rail),
      items: items.map(style), active: style(active),
      indicatorDisplay: rail ? getComputedStyle(rail.querySelector('[data-slot="tab-indicator"]')).display : null,
      inputTabIndex: input?.tabIndex ?? null, activeTabIndex: active?.tabIndex ?? null,
      nav: style(nav?.querySelector('button')),
      settings: { root: style(settings), active: style(settings?.querySelector('[data-slot="tabs-tab"]')), indicator: settings ? getComputedStyle(settings.querySelector('[data-slot="tab-indicator"]')).display : null },
      otherChart: { root: style(otherChart), active: style(otherChart?.querySelector('[data-slot="tabs-tab"]')) },
      selectorHits: {
        toolsRoot: document.querySelectorAll(rootGate).length,
        toolsSearch: document.querySelectorAll(toolsSearchSelector).length,
        toolsRail: document.querySelectorAll(toolsRailSelector).length,
        settingsVertical: document.querySelectorAll('.vrcx-0-main-content > .vrcx-0-page-scaffold [data-fixture-settings-rail]').length,
        otherChart: document.querySelectorAll('[data-fixture-other-chart] [data-slot="tabs-list"]').length,
        navigationRail: document.querySelectorAll('.vrcx-0-main-content [data-fixture-navigation]').length
      }
    };
  }, { rootGate, toolsSearchSelector, toolsRailSelector });

  await page.addStyleTag({ content: themeCss });
  const before = await snapshot();
  const beforePng = await page.screenshot({ path: path.join(here, 'before.png') });
  await page.addStyleTag({ content: css });
  await page.evaluate(async () => { await Promise.all([...document.images].map((image) => image.decode().catch(() => {}))); await document.fonts.ready; });
  const after = await snapshot();
  const afterPng = await page.screenshot({ path: path.join(here, 'after.png') });

  const input = page.locator('#filter-tools');
  await input.focus();
  const inputFocus = await page.locator(`${toolsSearchSelector}`).evaluate((node) => {
    const s = getComputedStyle(node);
    return { outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, focused: node.contains(document.activeElement) };
  });
  await page.keyboard.press('Tab');
  const firstTabStop = await page.evaluate(() => document.activeElement?.id || document.activeElement?.getAttribute('data-slot'));
  await page.keyboard.press('Tab');
  const secondTabStop = await page.evaluate(() => ({ id: document.activeElement?.id, role: document.activeElement?.getAttribute('role'), style: (() => { const s = getComputedStyle(document.activeElement); return { outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor }; })() }));
  const focusPng = await page.screenshot({ path: path.join(here, 'focus-visible.png') });

  const cssRules = await page.evaluate((source) => {
    const sheet = new CSSStyleSheet(); sheet.replaceSync(source);
    return [...sheet.cssRules].filter((r) => r.selectorText).map((r) => r.selectorText);
  }, css);
  const scopePrefix = '.vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar';
  const selectorScopePass = cssRules.length >= 10 && cssRules.every((selector) => selector.startsWith(scopePrefix));
  const geometry = {
    searchGroup: { width: round(after.inputGroup.width - before.inputGroup.width), height: round(after.inputGroup.height - before.inputGroup.height) },
    input: { width: round(after.input.width - before.input.width), height: round(after.input.height - before.input.height) },
    rail: { width: round(after.rail.width - before.rail.width), height: round(after.rail.height - before.rail.height) },
    tabItems: after.items.map((item, i) => ({ width: round(item.width - before.items[i].width), height: round(item.height - before.items[i].height) }))
  };
  const maxGeometryDelta = Math.max(...[geometry.searchGroup, geometry.input, geometry.rail, ...geometry.tabItems].flatMap((item) => [Math.abs(item.width), Math.abs(item.height)]));
  const selectedContrast = contrast(rgb(after.active.color), rgb(after.active.background));
  const inputContrast = contrast(rgb(after.input.color), rgb(after.inputGroup.background));
  const targetCounts = after.selectorHits;
  assert(selectorScopePass, `Tools CSS selectors lost their page-scaffold root scope: ${JSON.stringify(cssRules)}`);
  assert(targetCounts.toolsRoot === 1 && targetCounts.toolsSearch === 1 && targetCounts.toolsRail === 1, `Tools source anchors did not resolve uniquely: ${JSON.stringify(targetCounts)}`);
  assert(targetCounts.settingsVertical === 1 && targetCounts.otherChart === 1 && targetCounts.navigationRail === 0, `Exclusion fixture setup changed unexpectedly: ${JSON.stringify(targetCounts)}`);
  assert(maxGeometryDelta <= 2, `Tools filter/rail geometry changed by more than 2px: ${JSON.stringify(geometry)}`);
  assert(after.indicatorDisplay === 'none', `Tools vertical tab indicator not suppressed: ${after.indicatorDisplay}`);
  assert(JSON.stringify(after.settings) === JSON.stringify(before.settings), 'Settings vertical Tabs changed by tools CSS');
  assert(JSON.stringify(after.otherChart) === JSON.stringify(before.otherChart), 'MutualFriends #chart decoy was modified');
  assert(JSON.stringify(after.nav) === JSON.stringify(before.nav), 'Navigation sidebar was modified');
  assert(after.inputTabIndex === 0 && after.activeTabIndex === 0 && firstTabStop === 'edit-tools' && secondTabStop.id === 'tools-active-tab', `Filter or category rail is not keyboard reachable: ${JSON.stringify({ inputTabIndex: after.inputTabIndex, activeTabIndex: after.activeTabIndex, firstTabStop, secondTabStop })}`);
  assert(inputFocus.focused && inputFocus.outlineStyle === 'solid' && inputFocus.outlineWidth === '2px', `ToolbarSearch focus ring missing: ${JSON.stringify(inputFocus)}`);
  assert(secondTabStop.style.outlineStyle === 'solid' && secondTabStop.style.outlineWidth === '2px', `Vertical category focus ring missing: ${JSON.stringify(secondTabStop)}`);
  assert(selectedContrast >= 4.5 && inputContrast >= 4.5, `WCAG contrast failed: ${JSON.stringify({ selectedContrast, inputContrast })}`);
  assert(!pageErrors.length, `Browser errors: ${pageErrors.join('; ')}`);

  const labelHeight = 32, width = 1360, height = 900;
  const labelSvg = Buffer.from(`<svg width="${width * 2}" height="${height + labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#100b1e"/><text x="12" y="22" fill="#ffd9ee" font-family="sans-serif" font-size="16">BEFORE · source-shaped ToolsPageContent</text><text x="${width + 12}" y="22" fill="#ffd9ee" font-family="sans-serif" font-size="16">AFTER · pixel ToolbarSearch + category rail</text></svg>`);
  await sharp({ create: { width: width * 2, height: height + labelHeight, channels: 4, background: '#100b1e' } })
    .composite([{ input: labelSvg, left: 0, top: 0 }, { input: beforePng, left: 0, top: labelHeight }, { input: afterPng, left: width, top: labelHeight }])
    .png().toFile(path.join(here, 'comparison.png'));

  const report = {
    result: 'PASS', fixture: 'NOT WINDOWS · source-shaped ToolsPageContent; invented labels/cards; no friend screenshot',
    source: {
      authority: '/tmp/vrcx-win-src-r9/src',
      root: '.vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"])',
      children: 'direct PageToolbar > ToolbarSearch; direct scroll body > Tabs[data-orientation=vertical] > TabsList[data-orientation=vertical]',
      sameIdDecoys: 'MutualFriendsPage uses #chart without ToolbarSearch; legacy TwoPersonRelationshipPage is a #chart div, not PageScaffold'
    },
    css: { bytes: Buffer.byteLength(css), selectors: cssRules, allScopedToToolsRoot: selectorScopePass },
    selectorHitsAndMisses: targetCounts,
    geometryDeltas: geometry, maxGeometryDeltaPx: maxGeometryDelta,
    focusAndKeyboard: { inputFocus, firstTabStop, categoryTabFocus: secondTabStop, inputTabIndex: after.inputTabIndex, activeTabIndex: after.activeTabIndex },
    contrast: { selectedCategory: round(selectedContrast * 100) / 100, filterInput: round(inputContrast * 100) / 100 },
    excludedUnchanged: { settingsVerticalTabs: true, unrelatedChartPage: true, appNavigationRail: true },
    files: {}
  };
  for (const file of ['before.png', 'after.png', 'focus-visible.png', 'comparison.png']) report.files[file] = { bytes: (await fs.stat(path.join(here, file))).size };
  await fs.writeFile(path.join(here, 'verify-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
