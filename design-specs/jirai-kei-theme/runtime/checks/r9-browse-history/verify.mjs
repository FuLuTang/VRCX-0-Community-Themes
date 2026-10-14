/* NOT WINDOWS: source-shaped synthetic BrowseHistoryPage fixture, no live app or real user data. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const appAssetDir = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets';
const outputDir = process.env.JIRAI_OUT || '/tmp/jirai-r9-loader-isolated-out-20261012/jirai-kei-theme';
const [html, browseCss, legacyCss, controlsCss, themeCss, assetNames] = await Promise.all([
  fs.readFile(path.join(here, 'fixture.html'), 'utf8'),
  fs.readFile(path.join(runtime, 'browse-history-r9.css'), 'utf8'),
  fs.readFile(path.join(here, 'legacy-browse-history-r9.css'), 'utf8'),
  fs.readFile(path.join(runtime, 'controls-r9.css'), 'utf8'),
  fs.readFile(path.join(outputDir, 'theme.css'), 'utf8'),
  fs.readdir(appAssetDir)
]);
const indexCss = assetNames.filter((name) => /^index-[\w-]+\.css$/.test(name));
const appCss = assetNames.filter((name) => /^App-[\w-]+\.css$/.test(name));
if (indexCss.length !== 1 || appCss.length !== 1) {
  throw new Error(`Expected one index and App CSS bundle; got ${JSON.stringify({ indexCss, appCss })}`);
}
const appCssFiles = [path.join(appAssetDir, indexCss[0]), path.join(appAssetDir, appCss[0])];
const appCssContents = await Promise.all(appCssFiles.map((file) => fs.readFile(file, 'utf8')));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const round = (value) => Math.round(value * 100) / 100;
const marker = '/* SECTION controls-r9 */\n';
const controlStart = themeCss.indexOf(marker);
assert(controlStart >= 0, 'Existing built theme CSS must include controls-r9');
let controlEnd = themeCss.indexOf('/* SECTION ', controlStart + marker.length);
if (controlEnd < 0) controlEnd = themeCss.length;
const builtControlsCss = themeCss.slice(controlStart + marker.length, controlEnd).trimEnd();
const controlsMatch = builtControlsCss === controlsCss.trimEnd();
assert(controlsMatch, 'Built controls-r9 section must match current source; refresh the isolated baseline, do not edit the builder');
assert(themeCss.includes('/* SECTION icons */'), 'Full built theme must include jirai-icons');
assert(!/@import\b|url\((?!["']?data:)/i.test(browseCss), 'New stylesheet must not import remote assets');
assert(!/::after/.test(browseCss), 'Do not override app-owned ::after pseudo-elements');
const browseCssBytes = Buffer.byteLength(browseCss, 'utf8');
assert(browseCssBytes <= 8192, `Nested browse-history stylesheet must be <=8KiB, got ${browseCssBytes} bytes`);
assert((browseCss.match(/\.vrcx-0-main-content > \.vrcx-0-page-scaffold:has\(/g) || []).length === 1, 'The page gate must be declared exactly once');
const legacyHoverSelector = legacyCss.split('\n').find((line) => line.includes('.object-row:hover{'));
assert(legacyHoverSelector && !legacyHoverSelector.includes(':nth-of-type(5)'), 'Legacy baseline must preserve the pre-refactor, less-strict row-hover gate');

const browseRoot = '.vrcx-0-main-content > .vrcx-0-page-scaffold:has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"] [data-align="inline-end"] svg.lucide-calendar-range):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5)):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-refresh-cw):has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"] svg.lucide-ellipsis):has(> [data-slot="tabs"] > [data-slot="tabs-content"] .object-row__context-action)';
const searchSelector = `${browseRoot} > [data-slot="tabs"] > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]`;
const historyContentSelector = `${browseRoot} > [data-slot="tabs"] > [data-slot="tabs-content"]`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1000, height: 560 }, deviceScaleFactor: 1 });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));
const rgb = (value) => {
  const values = String(value).match(/[\d.]+/g);
  if (!values || values.length < 3) throw new Error(`Cannot parse computed color: ${value}`);
  return values.slice(0, 3).map(Number);
};
const linear = (value) => {
  value /= 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const contrast = (fg, bg) => {
  const a = luminance(rgb(fg));
  const b = luminance(rgb(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};
const imageFiles = ['before.png', 'after.png', 'before-after.png', 'comparison.png', 'focus-visible.png'];
try {
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  for (const css of appCssContents) await page.addStyleTag({ content: css });
  await page.addStyleTag({ content: themeCss });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.locator('img').evaluateAll((images) => Promise.all(images.map((image) => image.decode().catch(() => undefined))));

  const cssAudit = await page.evaluate(({ css, baseline }) => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    const rootRules = [...sheet.cssRules].filter((rule) => rule.selectorText?.startsWith('.vrcx-0-main-content > .vrcx-0-page-scaffold:has('));
    let nestedStyleRuleCount = 0;
    const declaredProperties = new Set();
    const walk = (rules) => {
      for (const rule of rules) {
        if (rule.selectorText) nestedStyleRuleCount += 1;
        if (rule.style) for (let index = 0; index < rule.style.length; index += 1) declaredProperties.add(rule.style.item(index));
        if (rule.cssRules) walk(rule.cssRules);
      }
    };
    walk(sheet.cssRules);
    const baselineSheet = new CSSStyleSheet();
    baselineSheet.replaceSync(baseline);
    const legacyProperties = new Set();
    const collectLegacyProperties = (rules) => {
      for (const rule of rules) {
        if (rule.style) for (let index = 0; index < rule.style.length; index += 1) legacyProperties.add(rule.style.item(index));
        if (rule.cssRules) collectLegacyProperties(rule.cssRules);
      }
    };
    collectLegacyProperties(baselineSheet.cssRules);
    return {
      topLevelRuleCount: sheet.cssRules.length,
      rootRuleCount: rootRules.length,
      rootChildRuleCount: rootRules[0]?.cssRules?.length || 0,
      nestedStyleRuleCount,
      declaredProperties: [...declaredProperties].sort(),
      legacyDeclaredProperties: [...legacyProperties].sort(),
      rootSelectorText: rootRules[0]?.selectorText || null
    };
  }, { css: browseCss, baseline: legacyCss });
  assert(cssAudit.topLevelRuleCount > 0, 'Chromium CSSOM dropped the nested stylesheet');
  assert(cssAudit.rootRuleCount === 1 && cssAudit.rootChildRuleCount > 0, `CSSOM must retain one page gate with nested children: ${JSON.stringify(cssAudit)}`);
  assert(cssAudit.nestedStyleRuleCount >= 25, `Too few nested CSS style rules parsed: ${JSON.stringify(cssAudit)}`);
  assert(cssAudit.declaredProperties.length >= 20, 'CSSOM must retain the nested declaration blocks');
  const longhandProperties = {
    border: ['border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-style','border-right-style','border-bottom-style','border-left-style','border-top-color','border-right-color','border-bottom-color','border-left-color'],
    'border-color': ['border-top-color','border-right-color','border-bottom-color','border-left-color','border-block-start-color','border-block-end-color','border-inline-start-color','border-inline-end-color'],
    'border-radius': ['border-top-left-radius','border-top-right-radius','border-bottom-left-radius','border-bottom-right-radius'],
    background: ['background-color','background-image','background-position-x','background-position-y','background-size','background-repeat','background-origin','background-clip','background-attachment'],
    transition: ['transition-property','transition-duration','transition-timing-function','transition-delay'],
    flex: ['flex-grow','flex-shrink','flex-basis'],
    outline: ['outline-color','outline-style','outline-width']
  };
  const declaredPropertyUnion = [...cssAudit.declaredProperties, ...cssAudit.legacyDeclaredProperties];
  const computedPropertyNames = [...new Set([...declaredPropertyUnion, ...declaredPropertyUnion.flatMap((property) => longhandProperties[property] || [])])].sort();

  const snapshot = async () => page.evaluate(({ browseRoot, searchSelector, historyContentSelector }) => {
    const rect = (node) => {
      if (!node) return null;
      const r = node.getBoundingClientRect();
      return { x: Math.round(r.x * 100) / 100, y: Math.round(r.y * 100) / 100, width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100 };
    };
    const style = (node, pseudo = null) => {
      if (!node) return null;
      const c = getComputedStyle(node, pseudo);
      return {
        color: c.color, backgroundColor: c.backgroundColor, borderColor: c.borderColor,
        borderRadius: c.borderRadius, borderWidth: c.borderWidth, boxShadow: c.boxShadow,
        outlineStyle: c.outlineStyle, outlineWidth: c.outlineWidth, outlineColor: c.outlineColor,
        opacity: c.opacity, pointerEvents: c.pointerEvents, transform: c.transform,
        transitionDuration: c.transitionDuration, animationName: c.animationName,
        display: c.display, width: c.width, height: c.height, backgroundImage: c.backgroundImage
      };
    };
    const root = document.querySelector(browseRoot);
    const tabs = root?.querySelector('[data-slot="tabs-list"]');
    const activeTab = tabs?.querySelector('[data-slot="tabs-tab"][aria-selected="true"]');
    const search = document.querySelector(searchSelector);
    const content = document.querySelector(historyContentSelector);
    const cards = [...(content?.querySelectorAll('.object-row') || [])];
    const media = cards.map((card) => card.querySelector('.object-row__media'));
    const openButtons = cards.map((card) => card.querySelector('.object-row__pressable'));
    const actions = cards.map((card) => card.querySelector('.object-row__context-action'));
    const dateRows = [...(content?.querySelectorAll('.absolute > .flex.h-full.items-center.gap-3.px-1') || [])];
    const separators = dateRows.map((row) => row.querySelector('[data-slot="separator"]'));
    const bgOf = (node) => {
      for (let current = node; current; current = current.parentElement) {
        const color = getComputedStyle(current).backgroundColor;
        const match = color.match(/[\d.]+/g);
        if (match?.length >= 3 && (match.length < 4 || Number(match[3]) > 0)) return color;
      }
      return 'rgb(23, 19, 38)';
    };
    const input = search?.querySelector('[data-slot="input-group-control"]');
    const title = cards[0]?.querySelector('.object-row__title');
    const meta = cards[0]?.querySelector('.object-row__meta');
    const dateTitle = dateRows[0]?.querySelector('h2');
    const remove = document.querySelector('#remove-user');
    const markerStyle = dateTitle ? getComputedStyle(dateTitle, '::before') : null;
    const bodyRoot = document.querySelector('.vrcx-0-main-content');
    return {
      rootCount: document.querySelectorAll(browseRoot).length,
      hitCounts: {
        search: document.querySelectorAll(searchSelector).length,
        tabs: tabs?.querySelectorAll('[data-slot="tabs-tab"]').length || 0,
        cards: cards.length,
        media: media.filter(Boolean).length,
        actions: actions.filter(Boolean).length,
        dateRows: dateRows.length,
        separators: separators.filter(Boolean).length,
        refresh: root?.querySelectorAll('.vrcx-0-page-toolbar svg.lucide-refresh-cw').length || 0,
        calendar: root?.querySelectorAll('.vrcx-0-page-toolbar svg.lucide-calendar-range').length || 0,
        overflow: root?.querySelectorAll('.vrcx-0-page-toolbar svg.lucide-ellipsis').length || 0
      },
      rects: {
        page: rect(document.querySelector('#browse-history-fixture')),
        tabsList: rect(tabs),
        tabs: [...(tabs?.querySelectorAll('[data-slot="tabs-tab"]') || [])].map(rect),
        search: rect(search),
        searchInput: rect(input),
        calendarButton: rect(search?.querySelector('[data-align="inline-end"] [data-slot="button"]')),
        toolbarActions: [...(root?.querySelectorAll('.vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="button"], .vrcx-0-page-toolbar button[data-vrcx-0-control="toolbar"]') || [])].map(rect),
        dateRows: dateRows.map(rect),
        separatorHeights: separators.map((node) => rect(node)?.height ?? null),
        cards: cards.map(rect),
        media: media.map(rect),
        openButtons: openButtons.map(rect),
        actions: actions.map(rect)
      },
      styles: {
        search: style(search), searchInput: style(input), searchPlaceholder: style(input, '::placeholder'),
        pageScaffold: style(document.querySelector('#browse-history-fixture')), tabsRoot: style(root?.querySelector('[data-slot="tabs"]')), tabsContent: style(content), mainRoot: style(bodyRoot),
        tabsList: style(tabs), activeTab: style(activeTab), tabIndicator: style(tabs?.querySelector('[data-slot="tab-indicator"]')),
        cards: cards.map(style), media: media.map(style), titles: cards.map((card) => style(card.querySelector('.object-row__title'))),
        metas: cards.map((card) => style(card.querySelector('.object-row__meta'))), actions: actions.map(style),
        dateTitles: dateRows.map((row) => style(row.querySelector('h2'))),
        firstSeparator: style(separators[0]), marker: markerStyle ? { display: markerStyle.display, width: markerStyle.width, height: markerStyle.height, backgroundColor: markerStyle.backgroundColor } : null,
        removeUser: style(remove)
      },
      colors: {
        title: title ? { fg: getComputedStyle(title).color, bg: bgOf(title) } : null,
        meta: meta ? { fg: getComputedStyle(meta).color, bg: bgOf(meta) } : null,
        date: dateTitle ? { fg: getComputedStyle(dateTitle).color, bg: bgOf(dateTitle) } : null,
        placeholder: input ? { fg: getComputedStyle(input, '::placeholder').color, bg: bgOf(search) } : null,
        activeTab: activeTab ? { fg: getComputedStyle(activeTab).color, bg: getComputedStyle(activeTab).backgroundColor } : null,
        remove: remove ? { fg: getComputedStyle(remove).color, bg: getComputedStyle(remove).backgroundColor } : null
      },
      miss: {
        pageMatchesRoot: document.querySelector('#unrelated-page')?.matches(browseRoot) || false,
        cardStyle: style(document.querySelector('#miss-card'))
      },
      hoveredCard: {
        id: cards.find((card) => card.matches(':hover'))?.id || null,
        removeVisible: remove ? getComputedStyle(remove).opacity : null,
        removePointerEvents: remove ? getComputedStyle(remove).pointerEvents : null
      },
      body: bodyRoot ? { clientWidth: bodyRoot.clientWidth, scrollWidth: bodyRoot.scrollWidth } : null
    };
  }, { browseRoot, searchSelector, historyContentSelector });

  const openStyledPage = async (css) => {
    const styledPage = await browser.newPage({ viewport: { width: 1000, height: 560 }, deviceScaleFactor: 1 });
    await styledPage.setContent(html, { waitUntil: 'domcontentloaded' });
    for (const appStyle of appCssContents) await styledPage.addStyleTag({ content: appStyle });
    await styledPage.addStyleTag({ content: themeCss });
    await styledPage.addStyleTag({ content: css });
    await styledPage.evaluate(async () => { await document.fonts.ready; });
    await styledPage.locator('img').evaluateAll((images) => Promise.all(images.map((image) => image.decode().catch(() => undefined))));
    await styledPage.waitForTimeout(120);
    return styledPage;
  };
  const captureAllComputedStyles = async (styledPage) => styledPage.evaluate((properties) => {
    const nodes = [...document.querySelectorAll('html,body,.vrcx-0-main-content,.vrcx-0-main-content *')];
    const pathFor = (node) => {
      const parts = [];
      for (let current = node; current; current = current.parentElement) {
        if (current.id) { parts.unshift(`#${current.id}`); break; }
        const parent = current.parentElement;
        if (!parent) { parts.unshift(current.tagName.toLowerCase()); break; }
        const sameType = [...parent.children].filter((sibling) => sibling.tagName === current.tagName);
        parts.unshift(`${current.tagName.toLowerCase()}:nth-of-type(${sameType.indexOf(current) + 1})`);
      }
      return parts.join('>');
    };
    const readStyle = (node, pseudo = null) => {
      const style = getComputedStyle(node, pseudo);
      return Object.fromEntries(properties.map((property) => [property, style.getPropertyValue(property)]));
    };
    return nodes.map((node) => ({
      key: pathFor(node),
      styles: {
        element: readStyle(node),
        before: readStyle(node, '::before'),
        after: readStyle(node, '::after'),
        placeholder: readStyle(node, '::placeholder')
      }
    }));
  }, computedPropertyNames);
  const legacyPage = await openStyledPage(legacyCss);
  const nestedPage = await openStyledPage(browseCss);
  const nearMissSelectors = await legacyPage.evaluate((strictGate) => {
    const strict = document.querySelector('#unrelated-page');
    const looseGate = strictGate.replace(':has(> [data-slot="tabs"] > .vrcx-0-page-toolbar [data-slot="tabs-list"] > [data-slot="tabs-tab"]:nth-of-type(5))', '');
    return { tabs: strict.querySelectorAll('[data-slot="tabs-tab"]').length, legacyGateHit: strict.matches(looseGate), nestedGateHit: strict.matches(strictGate) };
  }, browseRoot);
  assert(nearMissSelectors.tabs === 4 && nearMissSelectors.legacyGateHit && !nearMissSelectors.nestedGateHit, `The near-miss fixture must differ only by the fifth tab anchor: ${JSON.stringify(nearMissSelectors)}`);
  const expectedGateDiffs = new Set(['background-color', 'border-color', 'box-shadow', 'transform']);
  const gateDiffCategory = (property) => /^border(?:-[a-z-]+)?-color$/.test(property) ? 'border-color' : property;
  const equivalenceStates = [];
  const compareComputedStyles = (state, oldRows, newRows, allowNearMiss = false) => {
    const oldByKey = new Map(oldRows.map((row) => [row.key, row]));
    const newByKey = new Map(newRows.map((row) => [row.key, row]));
    const unexpected = [], permitted = [];
    let valuesCompared = 0;
    if (oldByKey.size !== newByKey.size) unexpected.push({ type: 'element-count', legacy: oldByKey.size, nested: newByKey.size });
    for (const [key, oldRow] of oldByKey) {
      const newRow = newByKey.get(key);
      if (!newRow) { unexpected.push({ type: 'missing-element', key }); continue; }
      for (const pseudo of ['element', 'before', 'after', 'placeholder']) {
        const oldStyle = oldRow.styles[pseudo] || {}, newStyle = newRow.styles[pseudo] || {};
        const properties = new Set([...Object.keys(oldStyle), ...Object.keys(newStyle)]);
        for (const property of properties) {
          valuesCompared += 1;
          const oldValue = oldStyle[property] ?? '', newValue = newStyle[property] ?? '';
          if (oldValue === newValue) continue;
          const category = gateDiffCategory(property);
          const allowed = allowNearMiss && key === '#miss-card' && pseudo === 'element' && expectedGateDiffs.has(category);
          if (allowed) permitted.push({ key, property, category, legacy: oldValue, nested: newValue });
          else unexpected.push({ key, pseudo, property, legacy: oldValue, nested: newValue });
        }
      }
    }
    assert(unexpected.length === 0, `${state} legacy/nested computed styles differ outside the fifth-tab gate: ${JSON.stringify(unexpected.slice(0, 20))}`);
    if (allowNearMiss) {
      const changed = new Set(permitted.map((entry) => entry.category));
      assert([...expectedGateDiffs].every((category) => changed.has(category)) && [...changed].every((category) => expectedGateDiffs.has(category)), `Near-miss hover differences were not exactly the row-hover declarations: ${JSON.stringify(permitted)}`);
    } else assert(permitted.length === 0, `${state} unexpectedly used the near-miss allowlist`);
    return { state, elementCount: oldByKey.size, computedValuesCompared: valuesCompared, expectedGateDifferences: permitted };
  };
  const compareState = async (state, allowNearMiss = false) => {
    const [oldRows, newRows] = await Promise.all([captureAllComputedStyles(legacyPage), captureAllComputedStyles(nestedPage)]);
    equivalenceStates.push(compareComputedStyles(state, oldRows, newRows, allowNearMiss));
  };
  await compareState('default');
  await Promise.all([legacyPage.locator('#card-user').hover({ position: { x: 120, y: 32 } }), nestedPage.locator('#card-user').hover({ position: { x: 120, y: 32 } })]);
  await Promise.all([legacyPage.waitForTimeout(160), nestedPage.waitForTimeout(160)]);
  await compareState('history-hover');
  await Promise.all([legacyPage.mouse.move(980, 360), nestedPage.mouse.move(980, 360)]);
  await Promise.all([legacyPage.waitForTimeout(120), nestedPage.waitForTimeout(120)]);
  const forceHoverState = async (styledPage) => {
    const cdp = await styledPage.context().newCDPSession(styledPage);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: 0, pierce: true });
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#miss-card' });
    assert(nodeId > 0, 'CDP must locate the offscreen near-miss card');
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['hover'] });
    return { cdp, nodeId };
  };
  const forcedHover = await Promise.all([forceHoverState(legacyPage), forceHoverState(nestedPage)]);
  await Promise.all([legacyPage.waitForTimeout(160), nestedPage.waitForTimeout(160)]);
  await compareState('near-miss-hover', true);
  await Promise.all(forcedHover.map(async ({ cdp, nodeId }) => {
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] });
    await cdp.detach();
  }));
  await Promise.all([legacyPage.mouse.click(980, 360), nestedPage.mouse.click(980, 360)]);
  const focusTo = async (styledPage, id, max = 20) => {
    for (let index = 0; index < max; index += 1) {
      if (await styledPage.evaluate(() => document.activeElement?.id || '') === id) return;
      await styledPage.keyboard.press('Tab');
    }
    assert(false, `Could not keyboard-focus ${id}`);
  };
  await Promise.all([focusTo(legacyPage, 'browse-search'), focusTo(nestedPage, 'browse-search')]);
  await Promise.all([legacyPage.waitForTimeout(120), nestedPage.waitForTimeout(120)]);
  await compareState('search-keyboard-focus');
  await Promise.all([focusTo(legacyPage, 'remove-user'), focusTo(nestedPage, 'remove-user')]);
  await Promise.all([legacyPage.waitForTimeout(120), nestedPage.waitForTimeout(120)]);
  await compareState('delete-keyboard-focus');
  await Promise.all([
    legacyPage.evaluate(() => document.activeElement?.blur()),
    nestedPage.evaluate(() => document.activeElement?.blur())
  ]);
  await Promise.all([legacyPage.mouse.move(980, 360), nestedPage.mouse.move(980, 360)]);
  await Promise.all([legacyPage.emulateMedia({ reducedMotion: 'reduce' }), nestedPage.emulateMedia({ reducedMotion: 'reduce' })]);
  await Promise.all([legacyPage.locator('#card-user').hover({ position: { x: 120, y: 32 } }), nestedPage.locator('#card-user').hover({ position: { x: 120, y: 32 } })]);
  await Promise.all([legacyPage.waitForTimeout(50), nestedPage.waitForTimeout(50)]);
  await compareState('prefers-reduced-motion-hover');
  await Promise.all([
    legacyPage.evaluate(() => document.documentElement.classList.add('reduce-effects')),
    nestedPage.evaluate(() => document.documentElement.classList.add('reduce-effects'))
  ]);
  await compareState('html-reduce-effects-hover');
  await Promise.all([legacyPage.close(), nestedPage.close()]);

  const rootCountBefore = await page.locator(browseRoot).count();
  assert(rootCountBefore === 1, `Expected exactly one page-scoped hit before CSS, got ${rootCountBefore}`);
  const beforeState = await snapshot();
  assert(beforeState.hitCounts.cards === 6 && beforeState.hitCounts.tabs === 5, 'Fixture must include six synthetic cards and five filter tabs');
  assert(beforeState.miss.pageMatchesRoot === false, 'The structurally similar unrelated PageScaffold must miss the page gate');
  const missBefore = beforeState.miss.cardStyle;
  const beforePath = path.join(here, 'before.png');
  const afterPath = path.join(here, 'after.png');
  await page.locator('#card-user').hover({ position: { x: 120, y: 32 } });
  await page.waitForTimeout(140);
  await page.screenshot({ path: beforePath, fullPage: false });
  const beforePng = await fs.readFile(beforePath);
  const beforeHoverState = await snapshot();

  await page.addStyleTag({ content: browseCss });
  await page.waitForTimeout(150);
  const afterPathName = path.join(here, 'after.png');
  await page.screenshot({ path: afterPathName, fullPage: false });
  const afterPng = await fs.readFile(afterPathName);
  const afterState = await snapshot();
  assert(afterState.rootCount === 1, 'The browse-history root gate must match exactly once');
  assert(afterState.hitCounts.search === 1 && afterState.hitCounts.cards === 6 && afterState.hitCounts.actions === 6, 'Expected browse page search, six cards and six remove actions to match');
  assert(afterState.hitCounts.dateRows === 2 && afterState.hitCounts.separators === 2, 'Expected two date headings/separators to match');
  assert(afterState.hitCounts.refresh === 1 && afterState.hitCounts.calendar === 1 && afterState.hitCounts.overflow === 1, 'Toolbar calendar/refresh/overflow anchors must all be present');
  assert(afterState.miss.pageMatchesRoot === false, 'The unrelated scaffold must remain outside the CSS root gate');
  assert(JSON.stringify(missBefore) === JSON.stringify(afterState.miss.cardStyle), `Unrelated object-row miss probe changed: ${JSON.stringify({ before: missBefore, after: afterState.miss.cardStyle })}`);

  const geometryPairs = [];
  const compareRects = (label, beforeRects, afterRects, maxItems = Infinity) => {
    const length = Math.min(beforeRects?.length || 0, afterRects?.length || 0, maxItems);
    for (let i = 0; i < length; i += 1) {
      const before = beforeRects[i], after = afterRects[i];
      if (!before || !after) continue;
      for (const dimension of ['width', 'height']) {
        geometryPairs.push({ target: `${label}[${i}]`, dimension, before: before[dimension], after: after[dimension], delta: round(Math.abs(before[dimension] - after[dimension])) });
      }
    }
  };
  for (const name of ['page', 'tabsList', 'search', 'searchInput', 'calendarButton']) {
    compareRects(name, [beforeState.rects[name]], [afterState.rects[name]]);
  }
  for (const name of ['tabs', 'cards', 'media', 'openButtons', 'actions', 'dateRows', 'separatorHeights']) {
    if (name === 'separatorHeights') {
      const n = Math.min(beforeState.rects.separatorHeights.length, afterState.rects.separatorHeights.length);
      for (let i = 0; i < n; i += 1) geometryPairs.push({ target: `separator[${i}]`, dimension: 'height', before: beforeState.rects.separatorHeights[i], after: afterState.rects.separatorHeights[i], delta: round(Math.abs(beforeState.rects.separatorHeights[i] - afterState.rects.separatorHeights[i])) });
    } else compareRects(name, beforeState.rects[name], afterState.rects[name]);
  }
  const maxGeometryDelta = Math.max(...geometryPairs.map((entry) => entry.delta));
  assert(maxGeometryDelta <= 2, `Geometry changed by more than 2px: ${JSON.stringify(geometryPairs.filter((entry) => entry.delta > 2))}`);
  assert(afterState.rects.cards.every((r) => r && Math.abs(r.height - 64) <= 0.1), 'Browse history cards must retain their source 64px height');
  assert(afterState.rects.media.every((r) => r && Math.abs(r.width - r.height) <= 0.1), 'Every thumbnail must remain square, not circular');
  assert(afterState.rects.media.every((r, i) => r && Math.abs(r.width - beforeState.rects.media[i].width) <= 2), 'Square thumbnail adjustment may not exceed 2px');
  assert(afterState.styles.firstSeparator.backgroundImage.includes('repeating-linear-gradient'), 'Date separator should use a pixel dash pattern');
  assert(afterState.styles.marker?.display === 'block' && afterState.styles.marker.backgroundColor === 'rgb(255, 184, 230)', 'Date label must have the pink square marker');
  assert(afterState.styles.cards.every((style) => style.borderRadius === '0px' && style.borderColor === 'rgb(108, 92, 224)'), 'Card faces must be square with a 1px #6c5ce0 frame');
  assert(afterState.styles.media.every((style) => style.borderRadius === '0px'), 'Thumbnail corners must not be rounded');
  assert(afterState.styles.removeUser.opacity === '1' && afterState.styles.removeUser.backgroundColor === 'rgb(255, 184, 230)' && afterState.styles.removeUser.color === 'rgb(22, 17, 42)', `Hovered card must reveal the pink Win95 remove button: ${JSON.stringify(afterState.styles.removeUser)}`);
  assert(afterState.styles.removeUser.borderWidth === '1px', 'Remove action should preserve its existing 1px border box');
  assert(afterState.styles.tabsList.borderRadius === '0px' && afterState.styles.tabsList.borderColor === 'rgb(108, 92, 224)' && afterState.styles.tabIndicator.display === 'none', 'Existing controls-r9 segmented filter styling must remain active');
  assert(JSON.stringify(beforeState.styles.tabsList) === JSON.stringify(afterState.styles.tabsList) && JSON.stringify(beforeState.styles.activeTab) === JSON.stringify(afterState.styles.activeTab), 'Browse stylesheet must not restyle the controls-r9 filter tabs');

  const contrastValues = {
    cardTitle: round(contrast(afterState.colors.title.fg, afterState.colors.title.bg) * 100) / 100,
    cardMeta: round(contrast(afterState.colors.meta.fg, afterState.colors.meta.bg) * 100) / 100,
    dateHeading: round(contrast(afterState.colors.date.fg, afterState.colors.date.bg) * 100) / 100,
    searchPlaceholder: round(contrast(afterState.colors.placeholder.fg, afterState.colors.placeholder.bg) * 100) / 100,
    activeFilter: round(contrast(afterState.colors.activeTab.fg, afterState.colors.activeTab.bg) * 100) / 100,
    removeHover: round(contrast(afterState.colors.remove.fg, afterState.colors.remove.bg) * 100) / 100
  };
  assert(Object.values(contrastValues).every((ratio) => ratio >= 4.5), `Text contrast below 4.5:1: ${JSON.stringify(contrastValues)}`);

  const initialHover = await page.evaluate(() => ({
    rowTransform: getComputedStyle(document.querySelector('#card-user')).transform,
    actionOpacity: getComputedStyle(document.querySelector('#remove-user')).opacity,
    actionPointerEvents: getComputedStyle(document.querySelector('#remove-user')).pointerEvents,
    actionBackground: getComputedStyle(document.querySelector('#remove-user')).backgroundColor,
    actionColor: getComputedStyle(document.querySelector('#remove-user')).color,
    hoverAvailable: matchMedia('(hover:hover) and (pointer:fine)').matches
  }));
  const matrixValues = initialHover.rowTransform.match(/matrix\(([^)]+)\)/)?.[1].split(',').map(Number);
  const hoverY = matrixValues?.[5] ?? 0;
  assert(Math.abs(hoverY + 1) < 0.05, `Hover should lift the card exactly 1px, got ${initialHover.rowTransform}`);
  assert(initialHover.actionOpacity === '1' && initialHover.actionPointerEvents === 'auto', 'Remove action must be visible and clickable on card hover');

  await page.mouse.move(980, 360);
  await page.waitForTimeout(100);
  const defaultAction = await page.evaluate(() => ({ opacity: getComputedStyle(document.querySelector('#remove-user')).opacity, pointerEvents: getComputedStyle(document.querySelector('#remove-user')).pointerEvents }));
  if (initialHover.hoverAvailable) assert(defaultAction.opacity === '0' && defaultAction.pointerEvents === 'none', `On fine pointers the remove action should be hidden until hover/focus: ${JSON.stringify(defaultAction)}`);
  else assert(defaultAction.opacity === '1', 'On coarse pointers the remove action must stay visible');

  await page.mouse.click(980, 360);
  const focusTrail = [];
  for (let i = 0; i < 20; i += 1) {
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => ({ id: document.activeElement?.id || '', label: document.activeElement?.getAttribute('aria-label') || '', tag: document.activeElement?.tagName || '' }));
    focusTrail.push(active);
    if (active.id === 'browse-search') break;
  }
  const searchFocus = await page.evaluate(() => {
    const input = document.querySelector('#browse-search');
    const group = input.closest('[data-slot="input-group"]');
    const style = getComputedStyle(group);
    return { active: document.activeElement === input, focusVisible: input.matches(':focus-visible'), outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor };
  });
  assert(searchFocus.active && searchFocus.focusVisible && searchFocus.outlineStyle === 'solid' && searchFocus.outlineWidth === '2px' && searchFocus.outlineColor === 'rgb(255, 127, 207)', `Search keyboard focus outline missing: ${JSON.stringify(searchFocus)}`);
  for (let i = 0; i < 15; i += 1) {
    const activeId = await page.evaluate(() => document.activeElement?.id || '');
    if (activeId === 'remove-user') break;
    await page.keyboard.press('Tab');
  }
  await page.waitForTimeout(120);
  const deleteFocus = await page.evaluate(() => {
    const button = document.querySelector('#remove-user');
    const row = document.querySelector('#card-user');
    const action = getComputedStyle(button), parent = getComputedStyle(row);
    return {
      active: document.activeElement === button,
      focusVisible: button.matches(':focus-visible'),
      opacity: action.opacity,
      pointerEvents: action.pointerEvents,
      outlineStyle: action.outlineStyle,
      outlineWidth: action.outlineWidth,
      outlineColor: action.outlineColor,
      parentOutline: parent.outlineStyle,
      parentOutlineWidth: parent.outlineWidth,
      parentOutlineColor: parent.outlineColor,
      backgroundColor: action.backgroundColor,
      color: action.color
    };
  });
  assert(deleteFocus.active && deleteFocus.focusVisible && deleteFocus.opacity === '1' && deleteFocus.pointerEvents === 'auto', `Keyboard focus must reveal the remove action: ${JSON.stringify({ deleteFocus, focusTrail })}`);
  assert(deleteFocus.outlineStyle === 'solid' && deleteFocus.outlineWidth === '2px' && deleteFocus.outlineColor === 'rgb(255, 127, 207)', `Delete button focus-visible ring missing: ${JSON.stringify(deleteFocus)}`);
  const focusPath = path.join(here, 'focus-visible.png');
  await page.screenshot({ path: focusPath, fullPage: false });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#card-user').hover({ position: { x: 120, y: 32 } });
  await page.waitForTimeout(40);
  const reducedMotion = await page.evaluate(() => ({ transform: getComputedStyle(document.querySelector('#card-user')).transform, duration: getComputedStyle(document.querySelector('#card-user')).transitionDuration }));
  assert(reducedMotion.transform === 'none' && reducedMotion.duration === '0s', `prefers-reduced-motion must be static: ${JSON.stringify(reducedMotion)}`);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => document.documentElement.classList.add('reduce-effects'));
  const reduceEffects = await page.evaluate(() => ({ transform: getComputedStyle(document.querySelector('#card-user')).transform, duration: getComputedStyle(document.querySelector('#card-user')).transitionDuration }));
  assert(reduceEffects.transform === 'none' && reduceEffects.duration === '0s', `html.reduce-effects must be static: ${JSON.stringify(reduceEffects)}`);
  await page.evaluate(() => document.documentElement.classList.remove('reduce-effects'));

  await page.setViewportSize({ width: 760, height: 560 });
  const narrow = await page.evaluate(() => {
    const main = document.querySelector('.vrcx-0-main-content');
    const toolbar = document.querySelector('.vrcx-0-page-toolbar');
    const grid = document.querySelector('[data-fixture-scroll] .grid');
    return { viewport: innerWidth, mainClientWidth: main.clientWidth, mainScrollWidth: main.scrollWidth, toolbarWidth: toolbar.getBoundingClientRect().width, gridWidth: grid.getBoundingClientRect().width, gridColumns: getComputedStyle(grid).gridTemplateColumns };
  });
  assert(narrow.mainScrollWidth <= narrow.mainClientWidth + 1, `Narrow viewport has horizontal overflow: ${JSON.stringify(narrow)}`);
  await page.setViewportSize({ width: 1000, height: 560 });

  const metaBefore = await sharp(beforePng).metadata();
  const metaAfter = await sharp(afterPng).metadata();
  assert(metaBefore.width === metaAfter.width && metaBefore.height === metaAfter.height, 'Before/after screenshots must keep identical canvas dimensions');
  const headerHeight = 28;
  const comparisonWidth = metaBefore.width * 2 + 8;
  const comparisonHeight = Math.max(metaBefore.height, metaAfter.height) + headerHeight;
  const labelsSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${comparisonWidth}" height="${headerHeight}"><rect width="100%" height="100%" fill="#171326"/><text x="12" y="19" fill="#d6b8ef" font-family="sans-serif" font-size="13">BEFORE · existing built theme</text><text x="${metaBefore.width + 20}" y="19" fill="#ffb8e6" font-family="sans-serif" font-size="13">AFTER · browse-history-r9</text></svg>`);
  await sharp({ create: { width: comparisonWidth, height: comparisonHeight, channels: 4, background: '#171326' } })
    .composite([{ input: labelsSvg, left: 0, top: 0 }, { input: beforePng, left: 0, top: headerHeight }, { input: afterPng, left: metaBefore.width + 8, top: headerHeight }])
    .png().toFile(path.join(here, 'before-after.png'));

  const beforeCard = beforeHoverState.rects.cards[0];
  const afterCard = afterState.rects.cards[0];
  const cropBuffer = async (buffer, rect) => {
    const left = Math.max(0, Math.floor(rect.x));
    const top = Math.max(0, Math.floor(rect.y));
    const width = Math.max(1, Math.min(metaBefore.width - left, Math.ceil(rect.width)));
    const height = Math.max(1, Math.min(metaBefore.height - top, Math.ceil(rect.height)));
    return sharp(buffer).extract({ left, top, width, height }).resize({ width: width * 2, height: height * 2, kernel: 'nearest' }).png().toBuffer();
  };
  const beforeCrop = await cropBuffer(beforePng, beforeCard);
  const afterCrop = await cropBuffer(afterPng, afterCard);
  const cropMeta = await sharp(beforeCrop).metadata();
  const cropHeader = 26;
  const cropWidth = cropMeta.width * 2 + 8;
  const cropHeight = cropMeta.height + cropHeader;
  const cropLabels = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cropWidth}" height="${cropHeader}"><rect width="100%" height="100%" fill="#171326"/><text x="10" y="18" fill="#d6b8ef" font-family="sans-serif" font-size="12">SOURCE CARD</text><text x="${cropMeta.width + 18}" y="18" fill="#ffb8e6" font-family="sans-serif" font-size="12">PIXEL WINDOW</text></svg>`);
  await sharp({ create: { width: cropWidth, height: cropHeight, channels: 4, background: '#171326' } })
    .composite([{ input: cropLabels, left: 0, top: 0 }, { input: beforeCrop, left: 0, top: cropHeader }, { input: afterCrop, left: cropMeta.width + 8, top: cropHeader }])
    .png().toFile(path.join(here, 'comparison.png'));

  assert(pageErrors.length === 0, `Unexpected browser page errors: ${pageErrors.join('; ')}`);
  const screenshots = {};
  for (const file of imageFiles) screenshots[file] = { bytes: (await fs.stat(path.join(here, file))).size };
  const report = {
    fixture: 'NOT WINDOWS; fictional BrowseHistoryPage source-shaped fixture; no real data, CUA, builder, or app source edits',
    source: {
      page: '/tmp/vrcx-win-src-r9/src/features/browse-history/BrowseHistoryPage.tsx:336-510',
      card: '/tmp/vrcx-win-src-r9/src/features/browse-history/BrowseHistoryCard.tsx:72-159',
      objectRow: '/tmp/vrcx-win-src-r9/src/styles/object-row.css:2-116',
      browseCss: path.join(runtime, 'browse-history-r9.css'),
      legacyCssBaseline: path.join(here, 'legacy-browse-history-r9.css'),
      isolatedBuiltTheme: path.join(outputDir, 'theme.css'),
      controlsSectionMatchesCurrentSource: controlsMatch,
      appCssBundles: appCssFiles
    },
    scope: {
      uniquePageRootHits: afterState.rootCount,
      pageGateDeclaredOnce: true,
      cssBytes: browseCssBytes,
      cssom: cssAudit,
      hitCounts: afterState.hitCounts,
      miss: { unrelatedPageMatchesGate: afterState.miss.pageMatchesRoot, unrelatedObjectRowComputedStyleUnchanged: true }
    },
    refactorEquivalence: {
      statesCompared: equivalenceStates,
      nearMissGate: nearMissSelectors,
      expectedDifferenceProperties: [...expectedGateDiffs]
    },
    geometry: {
      maxWidthOrHeightDeltaPx: maxGeometryDelta,
      maxAllowedPx: 2,
      deltas: geometryPairs,
      cardHeightPx: afterState.rects.cards[0].height,
      sourceThumbWidthPx: beforeState.rects.media[0].width,
      afterThumb: afterState.rects.media[0],
      thumbsSquare: afterState.rects.media.every((r) => Math.abs(r.width - r.height) <= 0.1),
      columns: 3,
      narrowViewport: narrow
    },
    controlsR9: {
      fiveFilterTabs: afterState.hitCounts.tabs,
      tabsStyleUnchangedByBrowseCss: JSON.stringify(beforeState.styles.tabsList) === JSON.stringify(afterState.styles.tabsList) && JSON.stringify(beforeState.styles.activeTab) === JSON.stringify(afterState.styles.activeTab),
      tabsList: afterState.styles.tabsList,
      activeTab: afterState.styles.activeTab
    },
    design: {
      search: afterState.styles.search,
      cardsAreSquareWindowFrames: afterState.styles.cards.every((style) => style.borderRadius === '0px' && style.borderColor === 'rgb(108, 92, 224)'),
      dateDashes: afterState.styles.firstSeparator.backgroundImage,
      dateMarker: afterState.styles.marker,
      hoveredRemoveAction: initialHover,
      keyboard: { search: searchFocus, delete: deleteFocus, focusTrail },
      reducedMotion,
      reduceEffects,
      noContinuousAnimation: afterState.styles.cards.every((style) => style.animationName === 'none')
    },
    contrastRatios: contrastValues,
    screenshots,
    pageErrors
  };
  await fs.writeFile(path.join(here, 'verify-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  console.log(`PASS: nested CSSOM ${cssAudit.nestedStyleRuleCount} rules / ${browseCssBytes} bytes / computed-style equivalence across ${equivalenceStates.length} states / only strict-gate hover diffs / existing visual and accessibility checks`);
} finally {
  await browser.close();
}
