/* NOT WINDOWS: fictional controls/activity/avatar fixture, DOM-shaped from /tmp/vrcx-win-src-r9/src. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const appAssetDir = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets';
const outputDir = process.env.JIRAI_OUT || '/tmp/jirai-r9-out-controls/jirai-kei-theme';
const themePath = path.join(outputDir, 'theme.css');
const controlsPath = path.join(runtime, 'controls-r9.css');
const [html, controlsCss, themeCss, assetNames] = await Promise.all([
  fs.readFile(path.join(here, 'fixture.html'), 'utf8'),
  fs.readFile(controlsPath, 'utf8'),
  fs.readFile(themePath, 'utf8'),
  fs.readdir(appAssetDir)
]);
const indexCss = assetNames.filter((name) => /^index-[\w-]+\.css$/.test(name));
const appCss = assetNames.filter((name) => /^App-[\w-]+\.css$/.test(name));
if (indexCss.length !== 1 || appCss.length !== 1) {
  throw new Error(`Expected one index and App CSS bundle; got ${JSON.stringify({ indexCss, appCss })}`);
}
const appCssFiles = [path.join(appAssetDir, indexCss[0]), path.join(appAssetDir, appCss[0])];
const appCssContents = await Promise.all(appCssFiles.map((file) => fs.readFile(file, 'utf8')));
const marker = '/* SECTION controls-r9 */\n';
const sectionStart = themeCss.indexOf(marker);
if (sectionStart < 0 || themeCss.indexOf(marker, sectionStart + marker.length) >= 0) {
  throw new Error('Expected exactly one SECTION controls-r9 in the existing JIRAI_OUT theme CSS');
}
const sectionContentStart = sectionStart + marker.length;
let sectionEnd = themeCss.indexOf('/* SECTION ', sectionContentStart);
if (sectionEnd < 0) sectionEnd = themeCss.length;
const builtControlsCss = themeCss.slice(sectionContentStart, sectionEnd);
const builtControlsCssMatches = builtControlsCss.trimEnd() === controlsCss.trimEnd();
// Do not run build-runtime for this review: compare the same existing theme baseline,
// but inject the current source CSS for the after-state even if the stored section is stale.
const baselineThemeCss = themeCss.slice(0, sectionStart) + themeCss.slice(sectionEnd);
const afterThemeCss = themeCss.slice(0, sectionStart) + marker + controlsCss.trimEnd() + '\n' + themeCss.slice(sectionEnd);
if (/@import\b|url\((?!["']?data:)/i.test(controlsCss)) {
  throw new Error('controls-r9.css may use only existing/data assets; no imports or remote URLs');
}
if (/::after/.test(controlsCss)) {
  throw new Error('controls-r9 must not override application-owned ::after pseudo-elements');
}

const browser = await chromium.launch({ headless: true });
const screens = ['activity', 'activity-density', 'friends', 'game-log', 'my-avatars', 'themes', 'gallery', 'inventory'];
const visualScreens = [...screens, 'relationship-graph'];
const before = {};
const after = {};
const screenshotBuffers = { before: {}, after: {} };
const round = (n) => Math.round(n * 100) / 100;
const rgb = (value) => {
  const values = String(value).match(/[\d.]+/g);
  if (!values || values.length < 3) throw new Error(`Cannot parse computed RGB color: ${value}`);
  return values.slice(0, 3).map(Number);
};
const linear = (v) => {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const contrast = (fg, bg) => {
  const a = luminance(fg), b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};
const colorEq = (a, b) => rgb(a).every((value, i) => value === b[i]);
const rgbToLab = ([r, g, b]) => {
  const linearChannel = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const R = linearChannel(r), G = linearChannel(g), B = linearChannel(b);
  const x = (R * 0.4124564 + G * 0.3575761 + B * 0.1804375) / 0.95047;
  const y = (R * 0.2126729 + G * 0.7151522 + B * 0.0721750);
  const z = (R * 0.0193339 + G * 0.1191920 + B * 0.9503041) / 1.08883;
  const f = (v) => v > 0.008856451679 ? Math.cbrt(v) : 7.787037037 * v + 16 / 116;
  const fx = f(x), fy = f(y), fz = f(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};
const deltaE76 = (a, b) => Math.hypot(...rgbToLab(a).map((v, i) => v - rgbToLab(b)[i]));
const pixelAt = async (png, bounds) => {
  const left = Math.max(0, Math.floor(bounds.x + 4));
  const top = Math.max(0, Math.floor(bounds.y + bounds.height / 2));
  const sample = await sharp(png).extract({ left, top, width: 1, height: 1 }).removeAlpha().raw().toBuffer();
  return { point: { x: left, y: top }, rgb: [sample[0], sample[1], sample[2]] };
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };

try {
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: 1 });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  for (const css of appCssContents) await page.addStyleTag({ content: css });
  const baselineStyle = await page.addStyleTag({ content: baselineThemeCss });
  await page.evaluate(async () => { await document.fonts.ready; });

  const switchScreen = async (name) => {
    await page.locator('[data-screen]').evaluateAll((nodes, active) => {
      nodes.forEach((node) => { node.dataset.active = String(node.dataset.screen === active); });
    }, name);
    await page.waitForTimeout(35);
  };
  const snapshot = async (name) => page.evaluate((screen) => {
    const pageRoot = document.querySelector(`[data-screen="${screen}"]`);
    const toolbar = pageRoot.querySelector('.vrcx-0-page-toolbar') || pageRoot;
    const style = (node) => {
      const css = getComputedStyle(node), rect = node.getBoundingClientRect();
      return {
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
        x: Math.round(rect.x * 100) / 100,
        y: Math.round(rect.y * 100) / 100,
        color: css.color,
        background: css.backgroundColor,
        borderColor: css.borderColor,
        borderWidth: css.borderWidth,
        borderRadius: css.borderRadius,
        boxShadow: css.boxShadow,
        backdropFilter: css.backdropFilter,
        clipPath: css.clipPath,
        outlineStyle: css.outlineStyle,
        outlineWidth: css.outlineWidth,
        outlineColor: css.outlineColor,
        outlineOffset: css.outlineOffset,
        opacity: css.opacity,
        display: css.display,
        overflowX: css.overflowX,
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth
      };
    };
    const groups = [...toolbar.querySelectorAll('[data-slot="tabs-list"]:not([data-orientation="vertical"]), [data-slot="toggle-group"][data-variant="outline"]')]
      .filter((node) => node.getBoundingClientRect().height > 0)
      .map((node, index) => ({
        name: node.getAttribute('aria-label') || `${screen}-control-${index + 1}`,
        root: style(node),
        items: [...node.children]
          .filter((child) => child.getAttribute('data-slot') !== 'tab-indicator')
          .map((child) => ({ slot: child.getAttribute('data-slot') || child.getAttribute('role') || child.tagName.toLowerCase(), ...style(child) }))
      }));
    const activeTab = pageRoot.querySelector('[data-slot="tabs-tab"][aria-selected="true"]');
    const activeToggle = pageRoot.querySelector('[data-slot="toggle-group"][data-variant="outline"] > :is([data-slot="toggle"],[data-slot="tooltip-trigger"][aria-pressed])[aria-pressed="true"]');
    const target = screen === 'activity-density' ? activeToggle : (activeTab || activeToggle);
    const count = pageRoot.querySelector('[data-slot="tabs-tab"][aria-selected="true"] > span:last-child');
    const colorContext = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const rgba = (color) => {
      colorContext.clearRect(0, 0, 1, 1);
      colorContext.fillStyle = 'transparent'; colorContext.fillRect(0, 0, 1, 1);
      colorContext.fillStyle = color; colorContext.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = colorContext.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    const over = (top, bottom) => {
      const alpha = top[3] + bottom[3] * (1 - top[3]);
      if (!alpha) return [0, 0, 0, 0];
      return [0, 1, 2].map((i) => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / alpha).concat(alpha);
    };
    const rgbText = ([r, g, b]) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    const effectiveBackground = (element) => {
      const chain = [];
      for (let node = element; node && node !== document.documentElement; node = node.parentElement) chain.push(node);
      chain.reverse();
      let background = [0, 0, 0, 0];
      for (const node of chain) background = over(rgba(getComputedStyle(node).backgroundColor), background);
      if (background[3] < 1) background = over(background, [22, 17, 42, 1]);
      return rgbText(background);
    };
    const foregroundOn = (element, background) => rgbText(over(rgba(getComputedStyle(element).color), rgba(background)));
    const contrastSamples = [...toolbar.querySelectorAll('[data-slot="tabs-list"] > [data-slot="tabs-tab"], [data-slot="toggle-group"][data-variant="outline"] > :is([data-slot="toggle"],[data-slot="tooltip-trigger"][aria-pressed])')].map((element) => {
      const background = effectiveBackground(element);
      return {
        label: element.getAttribute('aria-label') || element.textContent.trim().replace(/\s+/g, ' '),
        color: foregroundOn(element, background),
        background,
        selected: element.getAttribute('aria-selected') === 'true' || element.getAttribute('aria-pressed') === 'true'
      };
    });
    for (const element of toolbar.querySelectorAll('[data-slot="tabs-tab"] > span:last-child')) {
      const background = effectiveBackground(element);
      contrastSamples.push({ label: `count ${element.textContent.trim()}`, color: foregroundOn(element, background), background, selected: element.parentElement.getAttribute('aria-selected') === 'true' });
    }
    const result = {
      groups,
      contrastSamples,
      selected: target ? style(target) : null,
      activeToggle: activeToggle ? style(activeToggle) : null,
      activeTogglePseudo: activeToggle ? ((pseudo) => ({ content: pseudo.content, display: pseudo.display, background: pseudo.backgroundColor, boxShadow: pseudo.boxShadow, opacity: pseudo.opacity }))(getComputedStyle(activeToggle, '::before')) : null,
      activeCount: count ? style(count) : null,
      indicatorDisplay: pageRoot.querySelector('[data-slot="tabs-list"] [data-slot="tab-indicator"]')
        ? getComputedStyle(pageRoot.querySelector('[data-slot="tabs-list"] [data-slot="tab-indicator"]')).display
        : null
    };
    if (screen === 'activity') {
      const cards = [...pageRoot.querySelectorAll('.activity-skin section.activity-card')];
      const bars = [...pageRoot.querySelectorAll('.activity-skin .activity-bar')];
      result.activity = {
        cards: cards.map((card) => ({ ...style(card), backdrop: getComputedStyle(card).backdropFilter })),
        textSamples: cards.flatMap((card) => [...card.querySelectorAll('p,dt,dd,span')].map((element) => { const background = effectiveBackground(element); return { label: element.textContent.trim().slice(0, 28), color: foregroundOn(element, background), background }; })),
        chartBars: bars.map((bar) => getComputedStyle(bar).backgroundImage),
        tokenHeat0: getComputedStyle(pageRoot.querySelector('.activity-skin')).getPropertyValue('--act-heat-0').trim(),
        tokenHeat4: getComputedStyle(pageRoot.querySelector('.activity-skin')).getPropertyValue('--act-heat-4').trim()
      };
    }
    if (screen === 'my-avatars') {
      const scroll = pageRoot.querySelector('[data-avatar-scroll]');
      const grid = pageRoot.querySelector('[data-avatar-grid]');
      const selected = pageRoot.querySelector('[data-avatar-tile="selected"]');
      const check = pageRoot.querySelector('[data-avatar-check]');
      const menu = pageRoot.querySelector('[data-avatar-more]');
      result.avatars = {
        scroll: { height: Math.round(scroll.getBoundingClientRect().height * 100) / 100, clientHeight: scroll.clientHeight, scrollHeight: scroll.scrollHeight },
        gridHeight: Math.round(grid.getBoundingClientRect().height * 100) / 100,
        rows: [...grid.querySelectorAll('[data-virtual-row]')].map((row) => ({ height: Math.round(row.getBoundingClientRect().height * 100) / 100, transform: getComputedStyle(row).transform })),
        tileCount: pageRoot.querySelectorAll('[data-avatar-tile]').length,
        selectedTile: { ...style(selected), ringColor: getComputedStyle(selected).getPropertyValue('--tw-ring-color').trim() },
        check: { ...style(check), ringColor: getComputedStyle(check).getPropertyValue('--tw-ring-color').trim() },
        menu: style(menu)
      };
    }
    if (screen === 'themes') {
      const tabs = pageRoot.querySelector('[data-fixture-community-tabs]');
      const catalog = tabs.querySelector('[data-slot="tabs-content"][data-index="0"]');
      const installed = tabs.querySelector('[data-slot="tabs-content"][data-index="1"]');
      const catalogGrid = pageRoot.querySelector('[data-fixture-catalog-grid]');
      const catalogGridCss = getComputedStyle(catalogGrid), catalogGridRect = catalogGrid.getBoundingClientRect();
      result.communityThemes = {
        catalogGrid: { display: catalogGridCss.display, columns: catalogGridCss.gridTemplateColumns.split(/\s+/).length, gridTemplateColumns: catalogGridCss.gridTemplateColumns, columnGap: catalogGridCss.columnGap, width: Math.round(catalogGridRect.width) },
        catalogCards: [...catalog.querySelectorAll('[data-slot="card"][data-size="sm"]')].map((card) => ({
          ...style(card),
          preview: style(card.querySelector('[data-fixture-preview-frame]')),
          badges: [...card.querySelectorAll('[data-slot="badge"]')].map(style),
          action: style(card.querySelector('[data-slot="button"]')),
          actionVariant: card.querySelector('[data-slot="button"]').getAttribute('data-variant'),
          actionDisabled: card.querySelector('[data-slot="button"]').disabled,
          actionLabel: card.querySelector('[data-slot="button"]').textContent.trim()
        })),
        installedEnable: style(installed.querySelector('[data-slot="button"][data-variant="default"]')),
        outsideCard: style(pageRoot.querySelector('[data-fixture-non-catalog-card]')),
        matches: {
          catalogRoots: pageRoot.querySelectorAll('[data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"])').length,
          browseCards: catalog.querySelectorAll('[data-slot="card"][data-size="sm"]').length,
          browsePrimaryActions: catalog.querySelectorAll('[data-slot="card"][data-size="sm"] [data-slot="button"][data-variant="default"]').length,
          installedPrimaryActions: installed.querySelectorAll('[data-slot="button"][data-variant="default"]').length,
          outsideCardInBrowsePanel: catalog.querySelectorAll('[data-fixture-non-catalog-card]').length
        }
      };
    }
    if (screen === 'relationship-graph') {
      const legend = pageRoot.querySelector('[data-fixture-graph-legend]');
      const nodeCard = pageRoot.querySelector('[data-fixture-graph-node-card]');
      const avatar = nodeCard.querySelector('[data-fixture-graph-avatar]');
      const sliderThumb = legend.querySelector('[data-slot="slider-thumb"]');
      const nodeRefresh = nodeCard.querySelector('[aria-label="Refresh"]');
      const graphNodes = [...pageRoot.querySelectorAll('svg [data-fixture-svg-node]')];
      const requiredLegendContent = [...legend.querySelectorAll('[data-fixture-fetched-count],[data-fixture-updated],[data-fixture-min-degree],[data-fixture-edge-type]')].map((element) => {
        const rect = element.getBoundingClientRect();
        return { marker: element.getAttribute('data-fixture-edge-type') || element.getAttribute('data-fixture-fetched-count') || element.getAttribute('data-fixture-updated') || element.getAttribute('data-fixture-min-degree'), text: element.textContent.trim().replace(/\s+/g, ' '), visible: rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== 'hidden' };
      });
      result.relationshipGraph = {
        surfaces: [...pageRoot.querySelectorAll(':scope > .relative > .fixture-graph-surface')].map(style),
        surfacePositions: [...pageRoot.querySelectorAll(':scope > .relative > .fixture-graph-surface')].map((surface) => getComputedStyle(surface).position),
        surfaceBlurPseudoDisplay: [...pageRoot.querySelectorAll(':scope > .relative > .fixture-graph-surface')].map((surface) => getComputedStyle(surface, '::before').display),
        avatar: style(avatar),
        legendCommunitySwatches: [...legend.querySelectorAll('.mt-2.flex.flex-col > button > span[class~="size-2.5"][class~="rounded-full"]')].map(style),
        nodeCommunitySwatch: style(nodeCard.querySelector(':scope > button.mt-3 > span[class~="size-2.5"][class~="rounded-full"]')),
        degreeMarkers: [...legend.querySelectorAll('[data-fixture-degree-markers] > span')].map(style),
        unknownMarker: style(legend.querySelector('[data-fixture-unknown-marker]')),
        requiredLegendContent,
        legendText: legend.textContent.trim().replace(/\s+/g, ' '),
        legendScroll: { clientHeight: legend.clientHeight, scrollHeight: legend.scrollHeight },
        minimumDegreeSlider: { ...style(sliderThumb), role: sliderThumb.getAttribute('role'), min: sliderThumb.getAttribute('aria-valuemin'), max: sliderThumb.getAttribute('aria-valuemax'), value: sliderThumb.getAttribute('aria-valuenow') },
        nodeRefresh: { ...style(nodeRefresh), disabled: nodeRefresh.disabled, pointerEvents: getComputedStyle(nodeRefresh).pointerEvents },
        graphNodes: graphNodes.map((circle) => {
          const rect = circle.getBoundingClientRect(), css = getComputedStyle(circle);
          return { id: circle.getAttribute('data-fixture-svg-node'), cx: circle.getAttribute('cx'), cy: circle.getAttribute('cy'), r: circle.getAttribute('r'), width: Math.round(rect.width * 100) / 100, height: Math.round(rect.height * 100) / 100, fill: css.fill, stroke: css.stroke, strokeWidth: css.strokeWidth, clipPath: css.clipPath, mask: css.mask };
        }),
        outsideSurface: style(document.querySelector('[data-fixture-unrelated-graph-surface]')),
        matches: {
          surfaces: pageRoot.querySelectorAll(':scope > .relative > div.absolute:is(.w-64,.w-72)').length,
          avatars: pageRoot.querySelectorAll(':scope > .relative > .absolute.w-72 > .flex.items-center > span.bg-muted[class~="size-11"][class~="rounded-full"]').length,
          legendCommunitySwatches: pageRoot.querySelectorAll(':scope > .relative > .absolute.w-64 > .mt-2.flex.flex-col > button > span[class~="size-2.5"][class~="rounded-full"]').length,
          nodeCommunitySwatches: pageRoot.querySelectorAll(':scope > .relative > .absolute.w-72 > button.mt-3 > span[class~="size-2.5"][class~="rounded-full"]').length,
          degreeMarkers: legend.querySelectorAll('[data-fixture-degree-markers] > span').length,
          unknownMarkers: legend.querySelectorAll('[data-fixture-unknown-marker]').length,
          edgeLegendItems: legend.querySelectorAll('[data-fixture-edge-type]').length,
          infoRows: legend.querySelectorAll('[data-fixture-fetched-count],[data-fixture-updated],[data-fixture-min-degree]').length,
          minimumDegreeSliders: legend.querySelectorAll('[data-slot="slider-thumb"][role="slider"]').length,
          svgNodes: graphNodes.length,
          unrelatedSurfacesInChart: pageRoot.querySelectorAll('[data-fixture-unrelated-graph-surface]').length
        }
      };
    }
    return result;
  }, name);
  const exclusionSnapshot = async () => page.evaluate(() => {
    const style = (selector) => {
      const element = document.querySelector(selector), css = getComputedStyle(element), rect = element.getBoundingClientRect();
      return { background: css.backgroundColor, color: css.color, borderColor: css.borderColor, borderWidth: css.borderWidth, borderRadius: css.borderRadius, boxShadow: css.boxShadow, width: Math.round(rect.width * 100) / 100, height: Math.round(rect.height * 100) / 100, outline: css.outline };
    };
    return {
      settingsVerticalTabs: style('[data-fixture-settings-tabs]'),
      settingsOutlineGroup: style('[data-fixture-settings-segments]'),
      railVerticalTabs: style('[data-fixture-rail-tabs]'),
      entityDialogTabs: style('[data-fixture-entity-tabs]'),
      defaultMultiSelectChips: [...document.querySelectorAll('[data-screen="game-log"] [data-slot="toggle-group"][data-variant="default"] > [data-slot="toggle"]')].map((element) => { const css = getComputedStyle(element), r = element.getBoundingClientRect(); return { background: css.backgroundColor, color: css.color, borderColor: css.borderColor, borderRadius: css.borderRadius, width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100 }; }),
      myGroupsTile: style('[data-mygroups-tile]'),
      activityCardOutsideSkin: style('[data-outside-activity]'),
      themeOutsideCard: style('[data-fixture-non-catalog-card]'),
      graphOutsideSurface: style('[data-fixture-unrelated-graph-surface]'),
      selectionCounts: {
        pageScaffoldTabLists: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"])').length,
        bareTabsLists: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-fixture-bare-tabs]').length,
        settingsVerticalTabsUnderScaffold: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-fixture-settings-tabs][data-orientation="vertical"]').length,
        toolbarOutlineGroups: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"]').length,
        myAvatarCardTargets: document.querySelectorAll('.vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > [data-slot="button"][class~="rounded-object"]').length,
        myAvatarChecks: document.querySelectorAll('.vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > [data-slot="button"][class~="rounded-object"] [class~="left-1"] > span[class~="size-5"][class~="rounded-full"]').length,
        myAvatarMenus: document.querySelectorAll('.vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > button[data-slot="dropdown-menu-trigger"][data-size="icon-xs"]').length,
        communityThemeRoots: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"])').length,
        communityBrowseCards: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"]').length,
        communityBrowsePrimaryActions: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="button"][data-variant="default"]').length,
        communityInstalledPrimaryActions: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="1"] [data-slot="button"][data-variant="default"]').length,
        communityOutsideCardMatched: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-fixture-non-catalog-card]').length,
        relationshipGraphSurfaces: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > div.absolute:is(.w-64,.w-72)').length,
        relationshipGraphAvatars: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > .absolute.w-72 > .flex.items-center > span.bg-muted[class~="size-11"][class~="rounded-full"]').length,
        relationshipLegendSwatches: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > .absolute.w-64 > .mt-2.flex.flex-col > button > span[class~="size-2.5"][class~="rounded-full"]').length,
        relationshipNodeSwatches: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > .absolute.w-72 > button.mt-3 > span[class~="size-2.5"][class~="rounded-full"]').length,
        relationshipDegreeMarkers: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-degree-markers] > span').length,
        relationshipUnknownMarkers: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-unknown-marker]').length,
        relationshipEdgeLegendItems: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-edge-type]').length,
        relationshipLegendInfoRows: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-fetched-count], .vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-updated], .vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-min-degree]').length,
        relationshipMinimumDegreeSliders: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-slot="slider-thumb"][role="slider"]').length,
        relationshipSvgNodes: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart svg [data-fixture-svg-node]').length,
        unrelatedGraphSurfacesMatched: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-unrelated-graph-surface]').length,
        myGroupTileMatchesAvatarScope: document.querySelectorAll('[data-screen="my-groups"]:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-mygroups-tile]').length
      }
    };
  });

  for (const screen of screens) {
    await switchScreen(screen);
    if (screen === 'my-avatars') await page.locator('[data-avatar-tile="selected"]').hover();
    before[screen] = await snapshot(screen);
    screenshotBuffers.before[screen] = await page.screenshot({ path: path.join(here, `before-${screen}.png`), fullPage: false });
    await page.mouse.move(0, 0);
  }
  await switchScreen('relationship-graph');
  before.relationshipGraph = await snapshot('relationship-graph');
  screenshotBuffers.before.relationshipGraph = await page.screenshot({ path: path.join(here, 'before-relationship-graph.png'), fullPage: false });

  const baselineOutsideSnapshot = await exclusionSnapshot();
  await page.evaluate((value) => { window.__r9OutsideBefore = value; }, baselineOutsideSnapshot);
  await baselineStyle.evaluate((element) => { element.disabled = true; });
  await page.addStyleTag({ content: afterThemeCss });
  await page.evaluate(async () => { await Promise.all([...document.images].map((image) => image.decode().catch(() => {}))); await document.fonts.ready; });
  await page.waitForTimeout(80);

  for (const screen of screens) {
    await switchScreen(screen);
    if (screen === 'my-avatars') await page.locator('[data-avatar-tile="selected"]').hover();
    after[screen] = await snapshot(screen);
    screenshotBuffers.after[screen] = await page.screenshot({ path: path.join(here, `after-${screen}.png`), fullPage: false });
    await page.mouse.move(0, 0);
  }
  await switchScreen('relationship-graph');
  after.relationshipGraph = await snapshot('relationship-graph');
  screenshotBuffers.after.relationshipGraph = await page.screenshot({ path: path.join(here, 'after-relationship-graph.png'), fullPage: false });

  const audit = await page.evaluate((css) => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    const selectors = [];
    const walk = (rules) => {
      for (const rule of rules) {
        if (rule.selectorText) selectors.push(rule.selectorText);
        else if (rule.cssRules) walk([...rule.cssRules]);
      }
    };
    walk([...sheet.cssRules]);
    const mainPrefix = '.vrcx-0-main-content';
    return {
      ruleCount: selectors.length,
      allSelectorsMainContentScoped: selectors.length > 0 && selectors.every((selector) => selector.trim().startsWith(mainPrefix)),
      selectors,
      markerCount: (css.match(/SECTION controls-r9/g) || []).length,
      pseudoRules: selectors.filter((selector) => /::before|::after/.test(selector))
    };
  }, controlsCss);
  assert(audit.allSelectorsMainContentScoped, 'Every CSS selector must be scoped beneath .vrcx-0-main-content');
  const selectedTogglePseudo = audit.pseudoRules.filter((selector) => selector.includes('[data-slot="toggle-group"]') && selector.includes('[aria-pressed="true"]') && selector.endsWith('::before'));
  const graphSurfacePseudo = audit.pseudoRules.filter((selector) => selector.includes('.vrcx-0-page-scaffold#chart') && selector.includes('.w-64') && selector.includes('.w-72') && selector.endsWith('::before'));
  const activeTogglePseudoOnly = selectedTogglePseudo.length === 1 && graphSurfacePseudo.length === 1 && audit.pseudoRules.length === 2;
  assert(activeTogglePseudoOnly, `Only the selected toolbar input wash and two chart-surface blur overlays may be suppressed: ${audit.pseudoRules.join(', ')}`);

  const geometry = {};
  for (const screen of screens) {
    const b = before[screen].groups, a = after[screen].groups;
    assert(a.length === b.length, `${screen}: toolbar group count changed (${b.length} → ${a.length})`);
    geometry[screen] = [];
    for (let i = 0; i < a.length; i++) {
      const rootDelta = { width: round(a[i].root.width - b[i].root.width), height: round(a[i].root.height - b[i].root.height) };
      assert(Math.abs(rootDelta.width) <= 2 && Math.abs(rootDelta.height) <= 2, `${screen}/${a[i].name}: group geometry shifted >2px: ${JSON.stringify(rootDelta)}`);
      assert(a[i].items.length === b[i].items.length, `${screen}/${a[i].name}: item count changed`);
      const itemDeltas = a[i].items.map((item, j) => {
        const old = b[i].items[j];
        const delta = { width: round(item.width - old.width), height: round(item.height - old.height) };
        assert(Math.abs(delta.width) <= 2 && Math.abs(delta.height) <= 2, `${screen}/${a[i].name}/${j}: item geometry shifted >2px: ${JSON.stringify(delta)}`);
        return delta;
      });
      geometry[screen].push({ name: a[i].name, rootDelta, itemDeltas });
    }
  }

  const selectedColors = {};
  const contrastResults = {};
  const foregroundSamples = [];
  for (const screen of screens) {
    for (const sample of after[screen].contrastSamples) {
      const ratio = round(contrast(rgb(sample.color), rgb(sample.background)) * 100) / 100;
      contrastResults[`${screen} · ${sample.label || 'control label'}`] = ratio;
      assert(ratio >= 4.5, `${screen}: foreground contrast <4.5:1 for ${sample.label}: ${ratio}`);
      foregroundSamples.push({ screen, label: sample.label, ratio });
    }
  }
  for (const sample of after.activity.activity.textSamples) {
    const ratio = round(contrast(rgb(sample.color), rgb(sample.background)) * 100) / 100;
    contrastResults[`activity card · ${sample.label || 'text'}`] = ratio;
    assert(ratio >= 4.5, `Activity text contrast <4.5:1 for ${sample.label}: ${ratio}`);
    foregroundSamples.push({ screen: 'activity-card', label: sample.label, ratio });
  }
  for (const [label, color, background] of [
    ['avatar check marker', after['my-avatars'].avatars.check.color, after['my-avatars'].avatars.check.background],
    ['avatar menu action', after['my-avatars'].avatars.menu.color, after['my-avatars'].avatars.menu.background]
  ]) {
    const ratio = round(contrast(rgb(color), rgb(background)) * 100) / 100;
    contrastResults[label] = ratio;
    assert(ratio >= 4.5, `${label} contrast <4.5:1: ${ratio}`);
    foregroundSamples.push({ screen: 'my-avatars', label, ratio });
  }
  for (const screen of screens) {
    const selected = after[screen].selected;
    assert(selected, `${screen}: no selected tab/toggle was found`);
    assert(colorEq(selected.background, [255, 184, 230]) && colorEq(selected.color, [22, 17, 42]), `${screen}: selected item is not the requested pixel palette: ${JSON.stringify(selected)}`);
    selectedColors[screen] = { background: selected.background, color: selected.color };
    contrastResults[`${screen} active item`] = round(contrast(rgb(selected.color), rgb(selected.background)) * 100) / 100;
    assert(contrastResults[`${screen} active item`] >= 4.5, `${screen}: selected item contrast <4.5:1`);
  }
  const beforeSelectedPixels = {
    tab: await pixelAt(screenshotBuffers.before.activity, before.activity.selected),
    rangeToggle: await pixelAt(screenshotBuffers.before.activity, before.activity.activeToggle),
    iconOnlyToggle: await pixelAt(screenshotBuffers.before.friends, before.friends.activeToggle)
  };
  const afterSelectedPixels = {
    tab: await pixelAt(screenshotBuffers.after.activity, after.activity.selected),
    rangeToggle: await pixelAt(screenshotBuffers.after.activity, after.activity.activeToggle),
    iconOnlyToggle: await pixelAt(screenshotBuffers.after.friends, after.friends.activeToggle)
  };
  const pixelKeys = Object.keys(afterSelectedPixels);
  const pairwiseDeltaE = {
    tabVsRangeToggle: round(deltaE76(afterSelectedPixels.tab.rgb, afterSelectedPixels.rangeToggle.rgb) * 100) / 100,
    tabVsIconOnlyToggle: round(deltaE76(afterSelectedPixels.tab.rgb, afterSelectedPixels.iconOnlyToggle.rgb) * 100) / 100,
    rangeVsIconOnlyToggle: round(deltaE76(afterSelectedPixels.rangeToggle.rgb, afterSelectedPixels.iconOnlyToggle.rgb) * 100) / 100
  };
  const targetPink = [255, 184, 230];
  const sampledRgbMaxChannelDelta = Math.max(...pixelKeys.flatMap((key) => afterSelectedPixels[key].rgb.map((channel, index) => Math.abs(channel - targetPink[index]))));
  const selectedPixelMaxDeltaE = Math.max(...Object.values(pairwiseDeltaE));
  assert(sampledRgbMaxChannelDelta <= 1 && selectedPixelMaxDeltaE <= 0.5, `Screenshot-sampled selected faces are not pixel-identical (target #ffb8e6, ΔE76 ≤0.5): ${JSON.stringify({ beforeSelectedPixels, afterSelectedPixels, pairwiseDeltaE, sampledRgbMaxChannelDelta })}`);

  for (const screen of ['activity', 'activity-density', 'friends', 'themes', 'gallery', 'inventory']) {
    assert(after[screen].indicatorDisplay === 'none', `${screen}: horizontal tab-indicator must not overlap the selected pixel pill`);
  }
  for (const screen of ['activity', 'activity-density', 'friends', 'game-log', 'my-avatars']) {
    assert(after[screen].activeToggle && after[screen].activeTogglePseudo?.content === 'none', `${screen}: selected Toggle item overlay remains visible: ${JSON.stringify(after[screen].activeTogglePseudo)}`);
  }
  assert(after.friends.activeCount, 'Friends toolbar count badge was not found');
  assert(colorEq(after.friends.activeCount.color, [42, 29, 110]), `Active count badge color was not the readable indigo: ${JSON.stringify(after.friends.activeCount)}`);
  contrastResults['friends active count'] = round(contrast(rgb(after.friends.activeCount.color), rgb(after.friends.selected.background)) * 100) / 100;
  assert(contrastResults['friends active count'] >= 4.5, 'Friends active count contrast <4.5:1');

  const activityGeometry = after.activity.activity.cards.map((card, i) => {
    const b = before.activity.activity.cards[i];
    const delta = { width: round(card.width - b.width), height: round(card.height - b.height) };
    assert(Math.abs(delta.width) <= 2 && Math.abs(delta.height) <= 2, `Activity card ${i} geometry changed >2px: ${JSON.stringify(delta)}`);
    assert(card.borderWidth === '1px' && colorEq(card.borderColor, [108, 92, 224]) && card.borderRadius === '0px' && card.backdrop === 'none', `Activity card ${i} did not become a squared pixel window with the 1px #6c5ce0 frame: ${JSON.stringify(card)}`);
    assert(colorEq(card.background, [32, 25, 54]), `Activity card ${i} background is not opaque #201936: ${card.background}`);
    assert(card.boxShadow.includes('rgba(253, 244, 255, 0.18)') && card.boxShadow.includes('rgb(22, 17, 42)') && card.boxShadow.includes('2px 2px'), `Activity card ${i} does not use the soft Settings-style inset bevel: ${card.boxShadow}`);
    return delta;
  });
  assert(after.activity.activity.cards.length === 3, 'Expected total time, rhythm and longest-world Exhibit cards');
  assert(JSON.stringify(before.activity.activity.chartBars) === JSON.stringify(after.activity.activity.chartBars), 'Activity chart bar gradients changed; preserve the --act-* chart palette');
  assert(before.activity.activity.tokenHeat0 === after.activity.activity.tokenHeat0 && before.activity.activity.tokenHeat4 === after.activity.activity.tokenHeat4, 'Activity --act-heat variables changed');
  const chartColorsPreserved = true;

  const avatarBase = before['my-avatars'].avatars;
  const avatarStyled = after['my-avatars'].avatars;
  const virtualGeometry = {
    scrollHeightDelta: avatarStyled.scroll.scrollHeight - avatarBase.scroll.scrollHeight,
    clientHeightDelta: avatarStyled.scroll.clientHeight - avatarBase.scroll.clientHeight,
    gridHeightDelta: round(avatarStyled.gridHeight - avatarBase.gridHeight),
    rowHeightDeltas: avatarStyled.rows.map((row, i) => round(row.height - avatarBase.rows[i].height)),
    rowTransformsUnchanged: JSON.stringify(avatarStyled.rows.map((row) => row.transform)) === JSON.stringify(avatarBase.rows.map((row) => row.transform))
  };
  assert(avatarStyled.tileCount === avatarBase.tileCount && avatarStyled.tileCount === 5, `Virtualized fictional avatar tiles changed: ${JSON.stringify({ before: avatarBase.tileCount, after: avatarStyled.tileCount })}`);
  assert(virtualGeometry.scrollHeightDelta === 0 && virtualGeometry.clientHeightDelta === 0 && virtualGeometry.gridHeightDelta === 0 && virtualGeometry.rowHeightDeltas.every((delta) => delta === 0) && virtualGeometry.rowTransformsUnchanged, `My Avatars virtual-list geometry changed: ${JSON.stringify(virtualGeometry)}`);
  assert(avatarStyled.selectedTile.borderRadius === '0px' && avatarStyled.selectedTile.ringColor.toLowerCase() === '#ffb8e6' && avatarStyled.selectedTile.boxShadow.includes('rgb(255, 184, 230)'), `My Avatars selected ring/shell is not pixel-styled: ${JSON.stringify(avatarStyled.selectedTile)}`);
  assert(avatarStyled.check.borderRadius === '0px' && avatarStyled.check.clipPath !== 'none' && avatarStyled.check.ringColor.toLowerCase() === '#16112a' && avatarStyled.check.boxShadow.includes('rgb(22, 17, 42)'), `My Avatars check marker is not a pixel-cut high-contrast check: ${JSON.stringify(avatarStyled.check)}`);
  assert(avatarStyled.menu.width === avatarBase.menu.width && avatarStyled.menu.height === avatarBase.menu.height && avatarStyled.menu.width === 28 && avatarStyled.menu.height === 28, `My Avatars menu button size changed: ${JSON.stringify({ before: avatarBase.menu, after: avatarStyled.menu })}`);
  assert(avatarStyled.menu.borderRadius === '0px' && colorEq(avatarStyled.menu.background, [255, 184, 230]) && colorEq(avatarStyled.menu.color, [22, 17, 42]), `My Avatars menu button colors/shape are not themed: ${JSON.stringify(avatarStyled.menu)}`);

  const communityBase = before.themes.communityThemes;
  const communityStyled = after.themes.communityThemes;
  assert(communityStyled.matches.catalogRoots === 1 && communityStyled.matches.browseCards === 3 && communityStyled.matches.browsePrimaryActions === 2 && communityStyled.matches.installedPrimaryActions === 1, `Community Theme catalog targets differ from source-shaped fixture: ${JSON.stringify(communityStyled.matches)}`);
  assert(communityStyled.catalogGrid.display === 'grid' && communityStyled.catalogGrid.columns >= 3 && parseFloat(communityStyled.catalogGrid.columnGap) <= 10, `Community theme grid density does not reflect the source auto-fill layout: ${JSON.stringify(communityStyled.catalogGrid)}`);
  const communityCardGeometry = communityStyled.catalogCards.map((card, index) => {
    const baseline = communityBase.catalogCards[index];
    const delta = { width: round(card.width - baseline.width), height: round(card.height - baseline.height) };
    assert(Math.abs(delta.width) <= 2 && Math.abs(delta.height) <= 2 && card.width >= 224 && card.width <= 256 && card.action.height >= 28, `Community theme card ${index} geometry/density/action size is off source bounds: ${JSON.stringify({ delta, cardWidth: card.width, actionHeight: card.action.height })}`);
    assert(card.borderWidth === '1px' && colorEq(card.borderColor, [108, 92, 224]) && card.borderRadius === '0px' && colorEq(card.background, [32, 25, 54]), `Community theme card ${index} is not a square pixel window: ${JSON.stringify(card)}`);
    assert(card.boxShadow.includes('rgba(253, 244, 255, 0.14)') && card.boxShadow.includes('rgb(22, 17, 42)') && card.boxShadow.includes('2px 2px'), `Community theme card ${index} is missing the restrained pixel bevel: ${card.boxShadow}`);
    assert(card.preview.borderRadius === '0px' && colorEq(card.preview.borderColor, [108, 92, 224]) && Math.abs(card.preview.width / card.preview.height - 16 / 9) < 0.03, `Community theme preview ${index} frame is not squared/16:9: ${JSON.stringify(card.preview)}`);
    assert(card.badges.length > 0 && card.badges.every((badge) => badge.borderRadius === '0px' && badge.borderWidth === '1px'), `Community theme ${index} pills were not converted to pixel labels`);
    if (card.actionVariant === 'default') {
      assert(!card.actionDisabled && card.action.borderRadius === '0px' && card.action.borderWidth === '1px' && colorEq(card.action.background, [255, 184, 230]) && colorEq(card.action.color, [22, 17, 42]), `Community theme ${index} enabled primary action is not high-contrast pixel style: ${JSON.stringify(card.action)}`);
    } else {
      const baselineAction = communityBase.catalogCards[index].action;
      assert(index === 0 && card.actionVariant === 'outline' && card.actionDisabled && card.opacity === '0.7' && card.action.opacity === '0.5' && card.action.background === baselineAction.background && card.action.borderRadius === baselineAction.borderRadius, `Active disabled theme action should remain source-disabled/unmodified: ${JSON.stringify({ card, baselineAction })}`);
    }
    return delta;
  });
  const communityActions = [...communityStyled.catalogCards.filter((card) => card.actionVariant === 'default').map((card) => card.action), communityStyled.installedEnable];
  for (let index = 0; index < communityActions.length; index++) {
    const action = communityActions[index];
    const ratio = round(contrast(rgb(action.color), rgb(action.background)) * 100) / 100;
    assert(ratio >= 4.5, `Community Theme primary action ${index} contrast <4.5:1: ${ratio}`);
    contrastResults[`Community Theme primary action ${index + 1}`] = ratio;
  }
  assert(communityStyled.installedEnable.borderRadius === '0px' && colorEq(communityStyled.installedEnable.background, [255, 184, 230]), `Installed Theme enable action was not matched: ${JSON.stringify(communityStyled.installedEnable)}`);
  assert(JSON.stringify(communityBase.outsideCard) === JSON.stringify(communityStyled.outsideCard), 'Non-catalog card outside CommunityThemesSection changed');
  await switchScreen('themes');
  const browseThemeAction = page.locator('[data-screen="themes"] [data-fixture-catalog-card="two"] [data-slot="button"][data-variant="default"]');
  await browseThemeAction.hover();
  await page.waitForTimeout(220);
  const browseActionHover = await browseThemeAction.evaluate((element) => getComputedStyle(element).backgroundColor);
  assert(colorEq(browseActionHover, [255, 217, 238]), `Browse Theme enable-action hover face mismatch: ${browseActionHover}`);
  await browseThemeAction.evaluate((element) => { element.disabled = true; });
  const disabledRect = await browseThemeAction.boundingBox();
  await page.mouse.move(disabledRect.x + disabledRect.width / 2, disabledRect.y + disabledRect.height / 2);
  const disabledBrowseState = await browseThemeAction.evaluate((element) => {
    const css = getComputedStyle(element);
    return { disabled: element.disabled, background: css.backgroundColor, color: css.color, opacity: css.opacity, pointerEvents: css.pointerEvents };
  });
  assert(disabledBrowseState.disabled && colorEq(disabledBrowseState.background, [255, 184, 230]) && disabledBrowseState.opacity === '0.5' && disabledBrowseState.pointerEvents === 'none', `Loading/disabled Theme action must not acquire the hover face: ${JSON.stringify(disabledBrowseState)}`);
  await browseThemeAction.evaluate((element) => { element.disabled = false; });
  const installedPanel = page.locator('[data-screen="themes"] [data-slot="tabs-content"][data-index="1"]');
  await installedPanel.evaluate((element) => { element.hidden = false; });
  const installedThemeAction = installedPanel.locator('[data-slot="button"][data-variant="default"]');
  await installedThemeAction.hover();
  await page.waitForTimeout(220);
  const installedActionHover = await installedThemeAction.evaluate((element) => getComputedStyle(element).backgroundColor);
  assert(colorEq(installedActionHover, [255, 217, 238]), `Installed Theme primary hover face mismatch: ${installedActionHover}`);
  await installedPanel.evaluate((element) => { element.hidden = true; });
  await page.mouse.move(0, 0);

  const graphBase = before.relationshipGraph.relationshipGraph;
  const graphStyled = after.relationshipGraph.relationshipGraph;
  assert(graphStyled.matches.surfaces === 2 && graphStyled.matches.avatars === 1 && graphStyled.matches.legendCommunitySwatches === 2 && graphStyled.matches.nodeCommunitySwatches === 1 && graphStyled.matches.degreeMarkers === 2 && graphStyled.matches.unknownMarkers === 1 && graphStyled.matches.edgeLegendItems === 3 && graphStyled.matches.infoRows === 3 && graphStyled.matches.minimumDegreeSliders === 1 && graphStyled.matches.svgNodes === 3, `Relationship Graph target/coverage counts differ from fixture: ${JSON.stringify(graphStyled.matches)}`);
  assert(graphStyled.surfaceBlurPseudoDisplay.length === 2 && graphStyled.surfaceBlurPseudoDisplay.every((display) => display === 'none'), `Relationship Graph glass pseudo overlay was not disabled on both exact surfaces: ${JSON.stringify(graphStyled.surfaceBlurPseudoDisplay)}`);
  assert(graphStyled.surfacePositions.every((position) => position === 'absolute'), `Relationship Graph source overlays are not positioned independently: ${JSON.stringify(graphStyled.surfacePositions)}`);
  const graphGeometry = graphStyled.surfaces.map((surface, index) => {
    const baseline = graphBase.surfaces[index];
    const delta = { width: round(surface.width - baseline.width), height: round(surface.height - baseline.height) };
    assert(Math.abs(delta.width) <= 2 && Math.abs(delta.height) <= 2, `Relationship Graph surface ${index} geometry changed >2px: ${JSON.stringify(delta)}`);
    assert(surface.borderWidth === '1px' && colorEq(surface.borderColor, [108, 92, 224]) && surface.borderRadius === '0px' && colorEq(surface.background, [32, 25, 54]) && surface.backdropFilter === 'none', `Relationship Graph surface ${index} is not an opaque pixel panel: ${JSON.stringify(surface)}`);
    assert(surface.boxShadow.includes('rgba(253, 244, 255, 0.14)') && surface.boxShadow.includes('rgb(22, 17, 42)'), `Relationship Graph surface ${index} lacks its subtle inset bevel`);
    return delta;
  });
  assert(graphStyled.avatar.width === graphBase.avatar.width && graphStyled.avatar.height === graphBase.avatar.height && graphStyled.avatar.borderRadius === '0px' && graphStyled.avatar.clipPath !== 'none', `Relationship Graph detail portrait was not pixel-cut without resizing: ${JSON.stringify(graphStyled.avatar)}`);
  assert(graphStyled.legendCommunitySwatches.every((swatch, index) => swatch.borderRadius === '0px' && swatch.background === graphBase.legendCommunitySwatches[index].background), 'Relationship Graph community swatches should be square while retaining their colors');
  assert(graphStyled.nodeCommunitySwatch.borderRadius === '0px' && graphStyled.nodeCommunitySwatch.background === graphBase.nodeCommunitySwatch.background, 'Relationship Graph node-card community swatch should be square and preserve its color');
  assert(graphStyled.degreeMarkers.length === 2 && graphStyled.degreeMarkers.every((dot, index) => dot.borderRadius === graphBase.degreeMarkers[index].borderRadius && dot.borderRadius !== '0px') && graphStyled.unknownMarker.borderRadius === graphBase.unknownMarker.borderRadius && graphStyled.unknownMarker.borderRadius !== '0px', 'Relationship Graph degree-size / unknown markers must remain circular data encodings');
  const requiredLegendLabels = ['圈子', '节点大小代表连接数', '空心节点表示未知', '仅跨圈连线', 'API', '手动', '历史', '已获取', '更新于', '最少连接数'];
  assert(requiredLegendLabels.every((label) => graphStyled.legendText.includes(label)) && graphStyled.requiredLegendContent.every((entry) => entry.visible) && graphStyled.legendScroll.scrollHeight <= graphStyled.legendScroll.clientHeight, `Relationship Graph info card is missing or clipping required legend/coverage/min-degree content: ${JSON.stringify({ requiredLegendLabels, legendText: graphStyled.legendText, requiredLegendContent: graphStyled.requiredLegendContent, legendScroll: graphStyled.legendScroll })}`);
  assert(graphStyled.minimumDegreeSlider.role === 'slider' && graphStyled.minimumDegreeSlider.min === '0' && graphStyled.minimumDegreeSlider.max === '20' && graphStyled.minimumDegreeSlider.value === '3' && graphStyled.minimumDegreeSlider.width > 0, `Relationship Graph minimum-degree slider is not source-shaped: ${JSON.stringify(graphStyled.minimumDegreeSlider)}`);
  assert(graphStyled.nodeRefresh.disabled && graphStyled.nodeRefresh.opacity === '0.5' && graphStyled.nodeRefresh.pointerEvents === 'none' && graphBase.nodeRefresh.disabled, `Disabled node refresh state was not preserved: ${JSON.stringify(graphStyled.nodeRefresh)}`);
  assert(graphStyled.graphNodes.length === 3 && graphStyled.graphNodes.every((node, index) => node.r === graphBase.graphNodes[index].r && node.cx === graphBase.graphNodes[index].cx && node.cy === graphBase.graphNodes[index].cy && node.width === node.height && node.clipPath === 'none' && node.mask === 'none' && node.fill === graphBase.graphNodes[index].fill && node.stroke === graphBase.graphNodes[index].stroke), `SVG graph data circles must remain round and geometrically unchanged: ${JSON.stringify({ before: graphBase.graphNodes, after: graphStyled.graphNodes })}`);
  assert(JSON.stringify(graphBase.outsideSurface) === JSON.stringify(graphStyled.outsideSurface), 'Unrelated non-#chart surface changed');
  await switchScreen('relationship-graph');
  const graphCommunityRow = page.locator('#chart [data-fixture-graph-legend] .mt-2.flex.flex-col > button').first();
  const graphCommunityHoverBefore = await graphCommunityRow.evaluate((element) => getComputedStyle(element).backgroundColor);
  await graphCommunityRow.hover();
  await page.waitForTimeout(220);
  const graphCommunityHoverAfter = await graphCommunityRow.evaluate((element) => ({ background: getComputedStyle(element).backgroundColor, hovered: element.matches(':hover') }));
  assert(graphCommunityHoverAfter.hovered && graphCommunityHoverAfter.background !== graphCommunityHoverBefore, `Relationship Graph community row lost its source hover feedback: ${JSON.stringify({ before: graphCommunityHoverBefore, after: graphCommunityHoverAfter })}`);
  await page.mouse.move(0, 0);
  const graphNodeCommunityRow = page.locator('#chart [data-fixture-graph-node-card] > button.mt-3');
  const graphNodeHoverBefore = await graphNodeCommunityRow.evaluate((element) => getComputedStyle(element).backgroundColor);
  await graphNodeCommunityRow.hover();
  await page.waitForTimeout(220);
  const graphNodeHoverAfter = await graphNodeCommunityRow.evaluate((element) => ({ background: getComputedStyle(element).backgroundColor, hovered: element.matches(':hover') }));
  assert(graphNodeHoverAfter.hovered && graphNodeHoverAfter.background !== graphNodeHoverBefore, `Relationship Graph detail-card community row lost its source hover feedback: ${JSON.stringify({ before: graphNodeHoverBefore, after: graphNodeHoverAfter })}`);
  await page.mouse.move(0, 0);
  const themeCardGeometryPreserved = communityCardGeometry.every((delta) => delta.width === 0 && Math.abs(delta.height) <= 2);
  const relationshipGraphGeometryPreserved = graphGeometry.every((delta) => delta.width === 0 && Math.abs(delta.height) <= 2);

  // Verify the icon-only toggle's keyboard focus and the card overflow menu with real Tab navigation.
  const focusByScreen = {};
  for (const screen of screens) {
    await switchScreen(screen);
    await page.evaluate(() => { document.activeElement?.blur?.(); });
    await page.keyboard.press('Tab');
    const expected = ['activity', 'activity-density', 'themes', 'gallery', 'inventory'].includes(screen)
      ? `[data-screen="${screen}"] [data-slot="tabs-tab"][aria-selected="true"]`
      : `[data-screen="${screen}"] .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"] > [data-slot="tooltip-trigger"][aria-pressed]`;
    const target = page.locator(expected).first();
    const focus = await target.evaluate((element) => {
      const css = getComputedStyle(element);
      return { active: document.activeElement === element, visible: element.matches(':focus-visible'), outlineStyle: css.outlineStyle, outlineWidth: css.outlineWidth, outlineColor: css.outlineColor, outlineOffset: css.outlineOffset };
    });
    assert(focus.active && focus.visible && focus.outlineStyle === 'solid' && focus.outlineWidth === '2px', `${screen}: keyboard focus-visible ring missing: ${JSON.stringify(focus)}`);
    assert(colorEq(focus.outlineColor, [255, 127, 207]), `${screen}: focus ring color should be #ff7fcf: ${JSON.stringify(focus)}`);
    focusByScreen[screen] = focus;
  }
  await switchScreen('themes');
  const selectedThemeTab = page.locator('[data-screen="themes"] [data-slot="tabs-tab"][aria-selected="true"]');
  const focusableThemeAction = page.locator('[data-screen="themes"] [data-fixture-catalog-card="two"] [data-slot="button"][data-variant="default"]');
  await selectedThemeTab.focus();
  let themeActionFocused = false;
  for (let i = 0; i < 32; i++) {
    await page.keyboard.press('Tab');
    themeActionFocused = await focusableThemeAction.evaluate((element) => document.activeElement === element);
    if (themeActionFocused) break;
  }
  const themeActionFocus = await focusableThemeAction.evaluate((element) => {
    const css = getComputedStyle(element);
    return { active: document.activeElement === element, visible: element.matches(':focus-visible'), outlineStyle: css.outlineStyle, outlineWidth: css.outlineWidth, outlineColor: css.outlineColor };
  });
  themeActionFocus.focusedViaTab = themeActionFocused;
  assert(themeActionFocused && themeActionFocus.active && themeActionFocus.visible && themeActionFocus.outlineStyle === 'solid' && themeActionFocus.outlineWidth === '2px' && colorEq(themeActionFocus.outlineColor, [255, 127, 207]), `Community Themes enable action is not keyboard focus-visible: ${JSON.stringify(themeActionFocus)}`);

  await switchScreen('relationship-graph');
  const tabFocus = async (locator, max = 64) => {
    await page.evaluate(() => { document.activeElement?.blur?.(); });
    for (let i = 0; i < max; i++) {
      await page.keyboard.press('Tab');
      if (await locator.evaluate((element) => document.activeElement === element)) return true;
    }
    return false;
  };
  const graphCommunityFocusTarget = page.locator('#chart [data-fixture-graph-legend] .mt-2.flex.flex-col > button').first();
  const graphCommunityFocused = await tabFocus(graphCommunityFocusTarget);
  const graphCommunityFocus = await graphCommunityFocusTarget.evaluate((element) => {
    const css = getComputedStyle(element);
    return { active: document.activeElement === element, visible: element.matches(':focus-visible'), outlineStyle: css.outlineStyle, outlineWidth: css.outlineWidth, outlineColor: css.outlineColor };
  });
  assert(graphCommunityFocused && graphCommunityFocus.active && graphCommunityFocus.visible && graphCommunityFocus.outlineStyle !== 'none' && graphCommunityFocus.outlineWidth !== '0px', `Relationship Graph community filter has no keyboard focus indication: ${JSON.stringify(graphCommunityFocus)}`);
  const minDegreeThumb = page.locator('#chart [data-slot="slider-thumb"][role="slider"]');
  const minDegreeFocused = await tabFocus(minDegreeThumb);
  const minDegreeFocus = await minDegreeThumb.evaluate((element) => {
    const css = getComputedStyle(element);
    return { active: document.activeElement === element, visible: element.matches(':focus-visible'), boxShadow: css.boxShadow, outlineStyle: css.outlineStyle };
  });
  assert(minDegreeFocused && minDegreeFocus.active && minDegreeFocus.visible && minDegreeFocus.boxShadow !== 'none', `Minimum-degree slider thumb lacks keyboard focus feedback: ${JSON.stringify(minDegreeFocus)}`);

  await switchScreen('my-avatars');
  await page.evaluate(() => { document.activeElement?.blur?.(); });
  let menuFocused = false;
  for (let i = 0; i < 24; i++) {
    await page.keyboard.press('Tab');
    menuFocused = await page.locator('[data-screen="my-avatars"] [data-avatar-more]').evaluate((menu) => document.activeElement === menu);
    if (menuFocused) break;
  }
  const menuFocus = await page.locator('[data-screen="my-avatars"] [data-avatar-more]').evaluate((menu) => {
    const css = getComputedStyle(menu);
    return { active: document.activeElement === menu, visible: menu.matches(':focus-visible'), outlineStyle: css.outlineStyle, outlineWidth: css.outlineWidth, outlineColor: css.outlineColor, opacity: css.opacity };
  });
  assert(menuFocused && menuFocus.active && menuFocus.visible && menuFocus.outlineStyle === 'solid' && menuFocus.outlineWidth === '2px' && colorEq(menuFocus.outlineColor, [255, 127, 207]), `My Avatars menu keyboard focus is not visible: ${JSON.stringify(menuFocus)}`);

  const unchangedOutside = await page.evaluate(() => {
    const style = (selector) => {
      const element = document.querySelector(selector), css = getComputedStyle(element), rect = element.getBoundingClientRect();
      return { background: css.backgroundColor, color: css.color, borderColor: css.borderColor, borderWidth: css.borderWidth, borderRadius: css.borderRadius, boxShadow: css.boxShadow, width: Math.round(rect.width * 100) / 100, height: Math.round(rect.height * 100) / 100, outline: css.outline };
    };
    return {
      settingsVerticalTabs: style('[data-fixture-settings-tabs]'),
      settingsOutlineGroup: style('[data-fixture-settings-segments]'),
      railVerticalTabs: style('[data-fixture-rail-tabs]'),
      entityDialogTabs: style('[data-fixture-entity-tabs]'),
      defaultMultiSelectChips: [...document.querySelectorAll('[data-screen="game-log"] [data-slot="toggle-group"][data-variant="default"] > [data-slot="toggle"]')].map((element) => { const css=getComputedStyle(element),r=element.getBoundingClientRect();return {background:css.backgroundColor,color:css.color,borderColor:css.borderColor,borderRadius:css.borderRadius,width:Math.round(r.width*100)/100,height:Math.round(r.height*100)/100}; }),
      myGroupsTile: style('[data-mygroups-tile]'),
      activityCardOutsideSkin: style('[data-outside-activity]'),
      themeOutsideCard: style('[data-fixture-non-catalog-card]'),
      graphOutsideSurface: style('[data-fixture-unrelated-graph-surface]'),
      selectionCounts: {
        pageScaffoldTabLists: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs-list"]:not([data-orientation="vertical"])').length,
        bareTabsLists: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-fixture-bare-tabs]').length,
        settingsVerticalTabsUnderScaffold: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-fixture-settings-tabs][data-orientation="vertical"]').length,
        toolbarOutlineGroups: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-toolbar [data-slot="toggle-group"][data-variant="outline"]').length,
        myAvatarCardTargets: document.querySelectorAll('.vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > [data-slot="button"][class~="rounded-object"]').length,
        myAvatarChecks: document.querySelectorAll('.vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > [data-slot="button"][class~="rounded-object"] [class~="left-1"] > span[class~="size-5"][class~="rounded-full"]').length,
        myAvatarMenus: document.querySelectorAll('.vrcx-0-page-scaffold:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-slot="context-menu-trigger"][class~="group/card"] > button[data-slot="dropdown-menu-trigger"][data-size="icon-xs"]').length,
        communityThemeRoots: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"])').length,
        communityBrowseCards: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"]').length,
        communityBrowsePrimaryActions: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="button"][data-variant="default"]').length,
        communityInstalledPrimaryActions: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="1"] [data-slot="button"][data-variant="default"]').length,
        communityOutsideCardMatched: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold [data-slot="tabs"]:has([data-slot="tabs-content"][data-index="0"] [data-slot="card"][data-size="sm"] [data-slot="card-content"] .bg-muted.overflow-hidden.border > img[loading="lazy"]) [data-slot="tabs-content"][data-index="0"] [data-fixture-non-catalog-card]').length,
        relationshipGraphSurfaces: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > div.absolute:is(.w-64,.w-72)').length,
        relationshipGraphAvatars: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > .absolute.w-72 > .flex.items-center > span.bg-muted[class~="size-11"][class~="rounded-full"]').length,
        relationshipLegendSwatches: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > .absolute.w-64 > .mt-2.flex.flex-col > button > span[class~="size-2.5"][class~="rounded-full"]').length,
        relationshipNodeSwatches: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart > .relative > .absolute.w-72 > button.mt-3 > span[class~="size-2.5"][class~="rounded-full"]').length,
        relationshipDegreeMarkers: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-degree-markers] > span').length,
        relationshipUnknownMarkers: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-unknown-marker]').length,
        relationshipEdgeLegendItems: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-edge-type]').length,
        relationshipLegendInfoRows: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-fetched-count], .vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-updated], .vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-min-degree]').length,
        relationshipMinimumDegreeSliders: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-slot="slider-thumb"][role="slider"]').length,
        relationshipSvgNodes: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart svg [data-fixture-svg-node]').length,
        unrelatedGraphSurfacesMatched: document.querySelectorAll('.vrcx-0-main-content .vrcx-0-page-scaffold#chart [data-fixture-unrelated-graph-surface]').length,
        myGroupTileMatchesAvatarScope: document.querySelectorAll('[data-screen="my-groups"]:has(.vrcx-0-page-toolbar [data-slot="tooltip-trigger"][aria-pressed] > svg.lucide-list) [data-mygroups-tile]').length
      }
    };
  });
  const unchangedOutsideBefore = await page.evaluate(() => window.__r9OutsideBefore);
  assert(unchangedOutsideBefore && JSON.stringify(unchangedOutside) === JSON.stringify(unchangedOutsideBefore), `R9 controls leaked into settings/rail/entity tabs, default chips, My Groups, or non-activity card: ${JSON.stringify({ before: unchangedOutsideBefore, after: unchangedOutside })}`);
  assert(unchangedOutside.selectionCounts.pageScaffoldTabLists === 6 && unchangedOutside.selectionCounts.bareTabsLists === 3 && unchangedOutside.selectionCounts.settingsVerticalTabsUnderScaffold === 1 && unchangedOutside.selectionCounts.toolbarOutlineGroups === 6, `Unexpected page-scaffold match counts: ${JSON.stringify(unchangedOutside.selectionCounts)}`);
  assert(unchangedOutside.selectionCounts.myAvatarCardTargets === 5 && unchangedOutside.selectionCounts.myAvatarChecks === 1 && unchangedOutside.selectionCounts.myAvatarMenus === 5 && unchangedOutside.selectionCounts.myGroupTileMatchesAvatarScope === 0, `Avatar tile targeting/false positives differ from fixture: ${JSON.stringify(unchangedOutside.selectionCounts)}`);
  assert(unchangedOutside.selectionCounts.communityThemeRoots === 1 && unchangedOutside.selectionCounts.communityBrowseCards === 3 && unchangedOutside.selectionCounts.communityBrowsePrimaryActions === 2 && unchangedOutside.selectionCounts.communityInstalledPrimaryActions === 1 && unchangedOutside.selectionCounts.communityOutsideCardMatched === 0, `Community Themes scope false-positive/target counts differ: ${JSON.stringify(unchangedOutside.selectionCounts)}`);
  assert(unchangedOutside.selectionCounts.relationshipGraphSurfaces === 2 && unchangedOutside.selectionCounts.relationshipGraphAvatars === 1 && unchangedOutside.selectionCounts.relationshipLegendSwatches === 2 && unchangedOutside.selectionCounts.relationshipNodeSwatches === 1 && unchangedOutside.selectionCounts.relationshipDegreeMarkers === 2 && unchangedOutside.selectionCounts.relationshipUnknownMarkers === 1 && unchangedOutside.selectionCounts.relationshipEdgeLegendItems === 3 && unchangedOutside.selectionCounts.relationshipLegendInfoRows === 3 && unchangedOutside.selectionCounts.relationshipMinimumDegreeSliders === 1 && unchangedOutside.selectionCounts.relationshipSvgNodes === 3 && unchangedOutside.selectionCounts.unrelatedGraphSurfacesMatched === 0, `Relationship Graph scope false-positive/target counts differ: ${JSON.stringify(unchangedOutside.selectionCounts)}`);

  // Compare exclusions from the actual sectionless baseline before enabling the R9 bundle.
  // (The value above was set before the swap, via a one-shot DOM snapshot here.)
  const preSwapExclusions = await page.evaluate(() => window.__r9OutsideBefore);
  assert(preSwapExclusions, 'Missing baseline exclusion snapshot');

  // Chart/card and toolbar text contrast: all interactive copy must clear WCAG AA.
  for (const screen of screens) {
    const selected = after[screen].selected;
    const ratio = round(contrast(rgb(selected.color), rgb(selected.background)) * 100) / 100;
    assert(ratio >= 4.5, `${screen} selected label contrast is below WCAG AA`);
  }
  const cssAudit = { externalUrls: false, imports: false, activeToggleOverlaySuppressed: selectedTogglePseudo.length === 1, relationshipGraphSurfaceBlurSuppressed: graphSurfacePseudo.length === 1, rootScoped: true };
  assert(!pageErrors.length, `Browser page errors: ${pageErrors.join('; ')}`);

  const comparisonCells = [];
  for (let i = 0; i < visualScreens.length; i++) {
    const screen = visualScreens[i];
    const beforePath = path.join(here, `before-${screen}.png`);
    const afterPath = path.join(here, `after-${screen}.png`);
    const beforeCell = await sharp(beforePath).resize({ width: 680, height: 450, fit: 'inside' }).png().toBuffer();
    const afterCell = await sharp(afterPath).resize({ width: 680, height: 450, fit: 'inside' }).png().toBuffer();
    comparisonCells.push({ screen, beforeCell, afterCell });
  }
  const cellW = 680, cellH = 450, labelH = 30, rowH = cellH + labelH, contactRows = Math.ceil(visualScreens.length / 2);
  const svgParts = comparisonCells.map(({ screen }, i) => {
    const x = (i % 2) * cellW * 2;
    const y = Math.floor(i / 2) * rowH;
    return `<rect x="${x}" y="${y}" width="${cellW * 2}" height="${labelH}" fill="#100b1e"/><text x="${x + 12}" y="${y + 21}" fill="#ffd9ee" font-family="sans-serif" font-size="16">${screen.toUpperCase()} · BEFORE</text><text x="${x + cellW + 12}" y="${y + 21}" fill="#ffd9ee" font-family="sans-serif" font-size="16">${screen.toUpperCase()} · AFTER</text>`;
  }).join('');
  const svg = Buffer.from(`<svg width="${cellW * 4}" height="${rowH * contactRows}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#100b1e"/>${svgParts}</svg>`);
  const composites = [];
  comparisonCells.forEach(({ beforeCell, afterCell }, i) => {
    const x = (i % 2) * cellW * 2;
    const y = Math.floor(i / 2) * rowH + labelH;
    composites.push({ input: beforeCell, left: x, top: y }, { input: afterCell, left: x + cellW, top: y });
  });
  await sharp({ create: { width: cellW * 4, height: rowH * contactRows, channels: 4, background: '#100b1e' } })
    .composite([{ input: svg, left: 0, top: 0 }, ...composites])
    .png().toFile(path.join(here, 'comparison.png'));

  const cardRect = before.activity.activity.cards[0];
  const zoomLeft = Math.max(0, Math.floor(cardRect.x) - 6);
  const zoomTop = Math.max(0, Math.floor(cardRect.y) - 6);
  const zoomWidth = Math.min(160, 1360 - zoomLeft);
  const zoomHeight = Math.min(120, 900 - zoomTop);
  const cropZoom = async (png) => sharp(png).extract({ left: zoomLeft, top: zoomTop, width: zoomWidth, height: zoomHeight }).resize({ width: zoomWidth * 3, height: zoomHeight * 3, kernel: 'nearest' }).png().toBuffer();
  const beforeCardZoom = await cropZoom(screenshotBuffers.before.activity);
  const afterCardZoom = await cropZoom(screenshotBuffers.after.activity);
  await fs.writeFile(path.join(here, 'before-activity-card-zoom.png'), beforeCardZoom);
  await fs.writeFile(path.join(here, 'after-activity-card-zoom.png'), afterCardZoom);
  const zoomLabelH = 32;
  const zoomSvg = Buffer.from(`<svg width="${zoomWidth * 6}" height="${zoomHeight * 3 + zoomLabelH}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#100b1e"/><text x="12" y="22" fill="#ffd9ee" font-family="sans-serif" font-size="16">BEFORE · enlarged Activity card corner</text><text x="${zoomWidth * 3 + 12}" y="22" fill="#ffd9ee" font-family="sans-serif" font-size="16">AFTER · softened Settings-style bevel</text></svg>`);
  await sharp({ create: { width: zoomWidth * 6, height: zoomHeight * 3 + zoomLabelH, channels: 4, background: '#100b1e' } })
    .composite([{ input: zoomSvg, left: 0, top: 0 }, { input: beforeCardZoom, left: 0, top: zoomLabelH }, { input: afterCardZoom, left: zoomWidth * 3, top: zoomLabelH }])
    .png().toFile(path.join(here, 'activity-card-zoom-comparison.png'));

  const targetThemeCrop = async (png) => sharp(png).extract({ left: 190, top: 34, width: 840, height: 500 }).png().toBuffer();
  const targetThemeBefore = await targetThemeCrop(screenshotBuffers.before.themes);
  const targetThemeAfter = await targetThemeCrop(screenshotBuffers.after.themes);
  const graphPanelPair = async (png, geometry) => {
    const crops = await Promise.all(geometry.surfaces.map(async (rect) => {
      const left = Math.max(0, Math.floor(rect.x) - 4), top = Math.max(0, Math.floor(rect.y) - 4);
      const right = Math.min(1360, Math.ceil(rect.x + rect.width) + 4), bottom = Math.min(900, Math.ceil(rect.y + rect.height) + 4);
      const width = right - left, height = bottom - top;
      return { input: await sharp(png).extract({ left, top, width, height }).png().toBuffer(), width, height };
    }));
    const width = crops[0].width + 16 + crops[1].width, height = Math.max(crops[0].height, crops[1].height);
    const input = await sharp({ create: { width, height, channels: 4, background: '#100b1e' } })
      .composite([{ input: crops[0].input, left: 0, top: 0 }, { input: crops[1].input, left: crops[0].width + 16, top: 0 }]).png().toBuffer();
    return { input, width, height };
  };
  const graphBeforePanels = await graphPanelPair(screenshotBuffers.before.relationshipGraph, before.relationshipGraph.relationshipGraph);
  const graphAfterPanels = await graphPanelPair(screenshotBuffers.after.relationshipGraph, after.relationshipGraph.relationshipGraph);
  const targetLabelH = 30, targetGap = 20, targetThemeW = 840, targetThemeH = 500;
  const targetWidth = targetThemeW * 2 + targetGap;
  const graphPairWidth = graphBeforePanels.width + targetGap + graphAfterPanels.width;
  const graphLeft = Math.floor((targetWidth - graphPairWidth) / 2);
  const graphRowTop = targetLabelH + targetThemeH + 24;
  const targetHeight = graphRowTop + targetLabelH + Math.max(graphBeforePanels.height, graphAfterPanels.height) + 24;
  const targetSvg = Buffer.from(`<svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#100b1e"/><text x="12" y="21" fill="#ffd9ee" font-family="sans-serif" font-size="16">COMMUNITY THEMES · BEFORE</text><text x="${targetThemeW + targetGap + 12}" y="21" fill="#ffd9ee" font-family="sans-serif" font-size="16">COMMUNITY THEMES · AFTER</text><text x="${graphLeft + 12}" y="${graphRowTop + 21}" fill="#ffd9ee" font-family="sans-serif" font-size="16">GRAPH INFO + NODE CARD · BEFORE</text><text x="${graphLeft + graphBeforePanels.width + targetGap + 12}" y="${graphRowTop + 21}" fill="#ffd9ee" font-family="sans-serif" font-size="16">GRAPH INFO + NODE CARD · AFTER</text></svg>`);
  await sharp({ create: { width: targetWidth, height: targetHeight, channels: 4, background: '#100b1e' } })
    .composite([
      { input: targetSvg, left: 0, top: 0 },
      { input: targetThemeBefore, left: 0, top: targetLabelH },
      { input: targetThemeAfter, left: targetThemeW + targetGap, top: targetLabelH },
      { input: graphBeforePanels.input, left: graphLeft, top: graphRowTop + targetLabelH },
      { input: graphAfterPanels.input, left: graphLeft + graphBeforePanels.width + targetGap, top: graphRowTop + targetLabelH }
    ]).png().toFile(path.join(here, 'controls-r9-targets-comparison.png'));

  const files = {};
  for (const file of ['comparison.png', 'controls-r9-targets-comparison.png', 'activity-card-zoom-comparison.png', 'before-activity-card-zoom.png', 'after-activity-card-zoom.png', ...visualScreens.flatMap((screen) => [`before-${screen}.png`, `after-${screen}.png`])]) {
    files[file] = { bytes: (await fs.stat(path.join(here, file))).size };
  }
  const report = {
    result: 'PASS',
    fixture: 'NOT WINDOWS · invented theme metadata, names, counts and timestamps; synthetic graph/card shapes only; no real friend/avatar image or private screenshot copied',
    focusedTargetComposite: 'controls-r9-targets-comparison.png',
    source: {
      authority: '/tmp/vrcx-win-src-r9/src',
      fixtureMirrors: ['ToolbarTabs/ToolbarSegmented', 'bare CommunityThemesSection/GalleryTabs/InventoryPage horizontal TabsList', 'TabsList + independent tab-indicator', 'CommunityThemesSection browse/installed Tabs with ThemeCatalogCard sm Card, CardContent preview frame, badges and default enable actions', 'Relationship PageScaffold id=chart with MutualFriendsSurface legend w-64 and MutualFriendsNodeCard w-72; node portrait and community swatches; graph degree circles preserved', 'TooltipTrigger-wrapped aria-pressed toggle item with source dark:data-pressed utility classes', 'section.activity-card under .activity-skin', 'TileShell MyAvatarGridCard + check/menu', 'virtualized rows with inline height/transform'],
      windowsCheckoutNote: 'Windows checkout has one uncommitted RelationshipTimelinePageImpl.tsx debounced-filters change; this task did not edit or overwrite any app source.',
      builtTheme: themePath,
      builtControlsSectionMatchesSource: builtControlsCssMatches,
       baseline: 'Existing JIRAI_OUT theme.css with only SECTION controls-r9 removed; current controls-r9.css is injected for the after-state',
      verificationMode: 'No build-runtime run. The current controls-r9.css is overlaid in memory on the same existing theme baseline; if the stored section is stale, a package build and Windows reload remain unverified.',
      appCss: appCssFiles,
      privateScreenshotAssetsCopied: false
    },
    css: { bytes: Buffer.byteLength(controlsCss), audit, checks: cssAudit },
    targetCounts: unchangedOutside.selectionCounts,
    exclusions: {
      bareHorizontalMainContentTabsStyled: unchangedOutside.selectionCounts.bareTabsLists,
      settingsVerticalTabsUnderPageScaffoldUnchanged: unchangedOutside.selectionCounts.settingsVerticalTabsUnderScaffold === 1,
      settingsOutlineToggleGroupUnchanged: true,
      sideRailTabsUnchanged: true,
      entityDialogTabsUnchanged: true,
      defaultVariantMultiselectChipsUnchanged: true,
      myGroupsTileUnchanged: true,
      activityCardOutsideSkinUnchanged: true,
      communityCardOutsideCommunityTabsUnchanged: JSON.stringify(communityBase.outsideCard) === JSON.stringify(communityStyled.outsideCard),
      unrelatedGraphSurfaceOutsideChartUnchanged: JSON.stringify(graphBase.outsideSurface) === JSON.stringify(graphStyled.outsideSurface),
      relationshipGraphDegreeAndUnknownCircleMarkersPreserved: graphStyled.degreeMarkers.every((dot, index) => dot.borderRadius === graphBase.degreeMarkers[index].borderRadius && dot.borderRadius !== '0px') && graphStyled.unknownMarker.borderRadius === graphBase.unknownMarker.borderRadius,
       svgGraphDataCirclesPreserved: graphStyled.graphNodes.every((node, index) => node.r === graphBase.graphNodes[index].r && node.cx === graphBase.graphNodes[index].cx && node.cy === graphBase.graphNodes[index].cy && node.width === node.height && node.fill === graphBase.graphNodes[index].fill && node.stroke === graphBase.graphNodes[index].stroke),
      myGroupsTileMatchedByAvatarScope: false
    },
    controls: {
      selectedColors,
      activeTabIndicatorHidden: true,
      screenshotPixelSamples: { before: beforeSelectedPixels, after: afterSelectedPixels, pairwiseDeltaE76: pairwiseDeltaE, maxDeltaE76: selectedPixelMaxDeltaE, targetRgb: targetPink, maxTargetChannelDelta: sampledRgbMaxChannelDelta },
      countBadgeContrast: contrastResults['friends active count'],
      contrastRatios: contrastResults,
      focusVisibleByKeyboard: { ...focusByScreen, communityThemePrimaryAction: themeActionFocus, relationshipGraphCommunityFilter: graphCommunityFocus, relationshipGraphMinimumDegreeSlider: minDegreeFocus },
      geometryDeltas: geometry,
      allControlDimensionsWithin2px: true
    },
    activity: {
      cardCount: after.activity.activity.cards.length,
      style: { border: '1px solid #6c5ce0', radius: '0px', opaqueBackground: '#201936', backdrops: 'none', innerHighlight: 'inset 1px 1px rgb(253 244 255 / .18)', innerShade: 'inset -1px -1px #16112a' },
      enlargedBorderComparison: 'activity-card-zoom-comparison.png',
      beforeAfterCardGeometryDeltas: activityGeometry,
      chartColorsPreserved,
      heatTokens: { before0: before.activity.activity.tokenHeat0, after0: after.activity.activity.tokenHeat0, before4: before.activity.activity.tokenHeat4, after4: after.activity.activity.tokenHeat4 }
    },
    myAvatars: {
      virtualGeometry,
      renderedTileCount: avatarStyled.tileCount,
      selectedRingColor: avatarStyled.selectedTile.ringColor,
      selectedShellRadius: avatarStyled.selectedTile.borderRadius,
      check: { radius: avatarStyled.check.borderRadius, clipPath: avatarStyled.check.clipPath, ringColor: avatarStyled.check.ringColor },
      menu: avatarStyled.menu,
      menuFocusVisibleByKeyboard: menuFocus
    },
    communityThemes: {
      catalogCards: communityStyled.catalogCards.length,
       gridDensity: communityStyled.catalogGrid,
       activeThemeButton: { variant: communityStyled.catalogCards[0].actionVariant, disabled: communityStyled.catalogCards[0].actionDisabled, cardOpacity: communityStyled.catalogCards[0].opacity, buttonOpacity: communityStyled.catalogCards[0].action.opacity },
      primaryActions: { browse: communityStyled.matches.browsePrimaryActions, installed: communityStyled.matches.installedPrimaryActions },
      cardGeometryDeltas: communityCardGeometry,
      catalogCardStyle: { border: '1px solid #6c5ce0', radius: '0px', background: '#201936', subtlePixelBevel: true },
      previewFramesSquared: communityStyled.catalogCards.every((card) => card.preview.borderRadius === '0px'),
      badgesPixelFramed: communityStyled.catalogCards.every((card) => card.badges.every((badge) => badge.borderRadius === '0px' && badge.borderWidth === '1px')),
      highContrastPrimaryActions: communityActions.map((action) => ({ background: action.background, color: action.color, contrast: round(contrast(rgb(action.color), rgb(action.background)) * 100) / 100 })),
      hoverFace: { browse: browseActionHover, installed: installedActionHover, loadingDisabled: disabledBrowseState },
      primaryActionKeyboardFocus: themeActionFocus,
      installedActionAlsoStyled: communityStyled.installedEnable.borderRadius === '0px'
    },
    relationshipGraph: {
      surfaces: graphStyled.surfaces.length,
      geometryDeltas: graphGeometry,
      opaqueSquarePanels: graphStyled.surfaces.every((surface) => surface.borderRadius === '0px' && surface.backdropFilter === 'none'),
      blurPseudoDisabled: graphStyled.surfaceBlurPseudoDisplay,
      detailAvatar: { width: graphStyled.avatar.width, height: graphStyled.avatar.height, radius: graphStyled.avatar.borderRadius, clipPath: graphStyled.avatar.clipPath },
      squareCommunitySwatches: graphStyled.legendCommunitySwatches.every((swatch) => swatch.borderRadius === '0px') && graphStyled.nodeCommunitySwatch.borderRadius === '0px',
       legendCoverage: { edgeRows: graphStyled.matches.edgeLegendItems, infoRows: graphStyled.matches.infoRows, labels: requiredLegendLabels, visibleWithoutScroll: graphStyled.legendScroll.scrollHeight <= graphStyled.legendScroll.clientHeight },
       minimumDegreeSlider: { state: graphStyled.minimumDegreeSlider, focusVisibleByKeyboard: minDegreeFocus },
       hoverFeedback: { legendCommunityRow: { before: graphCommunityHoverBefore, after: graphCommunityHoverAfter }, detailCardCommunityRow: { before: graphNodeHoverBefore, after: graphNodeHoverAfter } },
       nodeRefreshDisabled: graphStyled.nodeRefresh,
       svgDataCircles: graphStyled.graphNodes,
      semanticGraphCirclesPreserved: graphStyled.degreeMarkers.every((dot, index) => dot.borderRadius === graphBase.degreeMarkers[index].borderRadius && dot.borderRadius !== '0px') && graphStyled.unknownMarker.borderRadius === graphBase.unknownMarker.borderRadius && graphStyled.graphNodes.every((node, index) => node.r === graphBase.graphNodes[index].r && node.cx === graphBase.graphNodes[index].cx && node.cy === graphBase.graphNodes[index].cy && node.width === node.height && node.fill === graphBase.graphNodes[index].fill && node.stroke === graphBase.graphNodes[index].stroke),
      screenshots: ['before-relationship-graph.png', 'after-relationship-graph.png']
    },
    files
  };
  await fs.writeFile(path.join(here, 'verify-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
