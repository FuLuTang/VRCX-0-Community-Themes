/* Static, fictional DOM verification for R10-G4; never attaches to the live GUI. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const baseBundle = process.env.JIRAI_BASE_BUNDLE || '/tmp/jirai-lead-r95c/jirai-kei-theme/theme.css';
const appCssSource = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css';
const [html, baseCss, dataCss] = await Promise.all([
  fs.readFile(path.join(here, 'fixture.html'), 'utf8'),
  fs.readFile(baseBundle, 'utf8'),
  fs.readFile(path.join(runtime, 'data-surfaces-r10.css'), 'utf8')
]);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const close = (a, b, tolerance = 2) => Math.abs(a - b) <= tolerance;
assert(html.includes('id="app-base-css"'), 'Fixture must inline the built application CSS as its baseline');
assert(!/@import\b|url\((?!\s*["']?data:)/i.test(dataCss), 'New CSS must not import remote CSS/assets');
assert(!/\[data-slot=["'](?:dialog-(?:portal|overlay|content)|alert-dialog-(?:portal|overlay|content))["']\]/i.test(dataCss), 'Dialog surface selectors are out of scope');
assert(dataCss.includes(':not(:has([data-slot="spinner"]))'), 'EmptyState must exclude spinner/loading roots');
assert(!/--act-surface\s*:|--act-edge\s*:|--act-accent\s*:/.test(dataCss), 'Activity card surface/edge/accent remain controls-r9 owned');

const browser = await chromium.launch({ headless: true });
const failures = [];
const makePage = async (includeR10) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1120 }, deviceScaleFactor: 1, colorScheme: 'dark' });
  page.on('pageerror', error => failures.push(error.message));
  await page.setContent(html, { waitUntil: 'load' });
  await page.addStyleTag({ content: baseCss });
  if (includeR10) await page.addStyleTag({ content: dataCss });
  await page.evaluate(() => document.fonts.ready);
  await page.keyboard.press('Tab');
  const activeId = await page.evaluate(() => document.activeElement?.id || '');
  assert(activeId === 'table-selected', `Expected first keyboard stop table-selected; got ${activeId}`);
  return page;
};
const rect = async (page, selector) => page.locator(selector).evaluate(el => {
  const r = el.getBoundingClientRect();
  return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), width: +r.width.toFixed(2), height: +r.height.toFixed(2) };
});
const computed = async (page, selector, pseudo = null) => page.locator(selector).evaluate((el, pseudo) => {
  const s = getComputedStyle(el, pseudo);
  return { color: s.color, background: s.backgroundColor, image: s.backgroundImage, borderColor: s.borderColor, borderRadius: s.borderRadius, borderWidth: s.borderWidth, borderStyle: s.borderStyle, borderBottomStyle: s.borderBottomStyle, boxShadow: s.boxShadow, outlineColor: s.outlineColor, outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, opacity: s.opacity, fontFamily: s.fontFamily, lineHeight: s.lineHeight, animationTimingFunction: s.animationTimingFunction, beforeContent: getComputedStyle(el, '::before').content };
}, pseudo);
const rgb = value => {
  const m = value.match(/rgba?\(([^)]+)\)/i) || value.match(/color\(srgb\s+([^)]+)\)/i);
  if (!m) throw new Error(`Unsupported color: ${value}`);
  return m[1].split(/[\s,\/]+/).filter(Boolean).slice(0, 3).map(Number).map(v => v <= 1 ? v * 255 : v);
};
const luminance = color => rgb(color).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
const contrast = (fg, bg) => {
  const a = luminance(fg), b = luminance(bg);
  return +((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toFixed(2);
};
const geometryIds = ['table-selected', 'table-expanded', 'metadata-selected', 'virtual-row', 'table-footer', 'empty-state', 'empty-title', 'card-footer', 'date-calendar', 'calendar-disabled-day', 'dashboard-handle', 'instance-row', 'gallery-tile', 'inventory-tile', 'my-groups-tile', 'activity-skin', 'group-page', 'group-moderation-rail', 'log-page', 'relationship-row'];
const protectedIds = ['favorites-handle', 'favorites-tile', 'my-avatars-tile', 'browse-history-tile', 'loading-state', 'dialog-progress'];
let before, after, report;
try {
  before = await makePage(false);
  after = await makePage(true);
  const beforeRects = Object.fromEntries(await Promise.all(geometryIds.map(async id => [id, await rect(before, `#${id}`)])));
  const afterRects = Object.fromEntries(await Promise.all(geometryIds.map(async id => [id, await rect(after, `#${id}`)])));
  const sizeDiffs = [];
  for (const id of geometryIds) for (const key of ['width', 'height']) {
    const delta = +(afterRects[id][key] - beforeRects[id][key]).toFixed(2);
    if (!close(delta, 0, 2)) sizeDiffs.push({ id, key, delta, before: beforeRects[id][key], after: afterRects[id][key] });
  }
  const positionDiffs = [];
  for (const id of geometryIds) for (const key of ['x', 'y']) {
    const delta = +(afterRects[id][key] - beforeRects[id][key]).toFixed(2);
    if (!close(delta, 0, 2)) positionDiffs.push({ id, key, delta, before: beforeRects[id][key], after: afterRects[id][key] });
  }

  const selected = await computed(after, '#table-selected');
  const selectedCell = await computed(after, '#table-selected [data-slot="table-cell"]:first-child');
  const metadataSelected = await computed(after, '#metadata-selected');
  const metadataCell = await computed(after, '#metadata-selected [data-slot="table-cell"]:first-child');
  const metadataTokens = await after.locator('#metadata-table').evaluate(el => getComputedStyle(el).getPropertyValue('--vrcx-0-table-row-selected-surface').trim());
  const expanded = await computed(after, '#table-expanded');
  const header = await computed(after, '#table-main [data-slot="table-header"]');
  const headerRow = await computed(after, '#table-main [data-slot="table-header"] > tr');
  const empty = await computed(after, '#empty-state');
  const emptyTitle = await computed(after, '#empty-state [data-slot="empty-title"]');
  const emptyDescription = await computed(after, '#empty-state [data-slot="empty-description"]');
  const selectedCalendar = await computed(after, '#date-calendar button[data-day="03"]');
  const rangeCalendar = await computed(after, '#date-calendar button[data-day="09"]');
  const todayCalendar = await computed(after, '#date-calendar td[data-today="true"] > button[data-day="01"]');
  const disabledCalendar = await computed(after, '#calendar-disabled-day');
  const focusedTable = await computed(after, '#table-selected');
  const beforeActivity = await before.locator('#activity-skin').evaluate(el => {
    const s = getComputedStyle(el); return Object.fromEntries(['--act-surface','--act-edge','--act-accent'].map(k => [k, s.getPropertyValue(k).trim()]));
  });
  const activity = await after.locator('#activity-skin').evaluate(el => {
    const s = getComputedStyle(el);
    return {
      vars: Object.fromEntries(['--act-surface','--act-edge','--act-accent','--act-track','--act-axis','--act-mark','--act-mark-soft','--act-heat-empty','--act-heat-min','--act-heat-0','--act-heat-1','--act-heat-2','--act-heat-3','--act-heat-4'].map(k => [k, s.getPropertyValue(k).trim()])),
      heat: [...el.querySelectorAll('#heatmap i')].map(e => getComputedStyle(e).backgroundColor),
      track: getComputedStyle(el.querySelector('#act-track')).backgroundColor,
      fill: getComputedStyle(el.querySelector('#act-fill')).backgroundColor
    };
  });
  const adjacentHeatDeltas = activity.heat.slice(1).map((c, i) => {
    const a = rgb(activity.heat[i]), b = rgb(c);
    return +Math.sqrt(a.reduce((sum, value, j) => sum + (value - b[j]) ** 2, 0)).toFixed(2);
  });
  const heatLuminance = activity.heat.map(luminance);
  const virtualBefore = await rect(before, '#virtual-row');
  const virtualAfter = await rect(after, '#virtual-row');
  const selectedContrast = contrast(selected.color, selected.background);
  const headerContrast = contrast(header.color, header.background);
  const emptyTitleContrast = contrast(emptyTitle.color, 'rgb(32, 25, 54)');
  const emptyDescriptionContrast = contrast(emptyDescription.color, 'rgb(32, 25, 54)');
  const selectedDayContrast = contrast(selectedCalendar.color, selectedCalendar.background);
  const rangeDayContrast = contrast(rangeCalendar.color, rangeCalendar.background);

  // Keyboard focus stays visible; subsequent probes focus real keyboard-operable specimens.
  await after.locator('#date-calendar button[data-day="03"]').focus();
  const calendarFocus = await computed(after, '#date-calendar button[data-day="03"]');
  await after.locator('#dashboard-handle').focus();
  const handleFocus = await computed(after, '#dashboard-handle');
  await after.locator('#friend-page [data-slot="card"]').focus();
  const friendFocus = await computed(after, '#friend-page [data-slot="card"]');

  // Hover probes verify shared token-backed states without leaving hover in the screenshot.
  const normalBeforeHover = await computed(after, '#table-normal');
  await after.locator('#table-normal').hover();
  await after.waitForTimeout(180);
  const normalHover = await computed(after, '#table-normal');
  await after.locator('#table-selected').hover();
  await after.waitForTimeout(180);
  const selectedHover = await computed(after, '#table-selected');
  await after.mouse.move(2, 2);
  await after.waitForTimeout(180);

  const protectedStyles = {};
  for (const id of protectedIds) {
    const selector = `#${id}`;
    protectedStyles[id] = { before: await computed(before, selector), after: await computed(after, selector) };
  }
  const protectedChanges = Object.entries(protectedStyles).filter(([, v]) => JSON.stringify(v.before) !== JSON.stringify(v.after)).map(([id]) => id);

  const appBaseLoaded = await after.locator('#app-base-css').count() === 1;
  const rootTokens = await after.evaluate(() => ({ window: getComputedStyle(document.documentElement).getPropertyValue('--wd-window').trim(), pink: getComputedStyle(document.documentElement).getPropertyValue('--wd-pink').trim() }));
  const out = name => path.join(here, name);
  await before.screenshot({ path: out('before.png'), fullPage: true });
  await after.screenshot({ path: out('after.png'), fullPage: true });
  const afterMeta = await sharp(out('after.png')).metadata();
  const image = await sharp(out('after.png')).ensureAlpha().raw().toBuffer();
  const pixel = (x, y) => {
    const i = (Math.floor(y) * afterMeta.width + Math.floor(x)) * 4;
    return [...image.subarray(i, i + 3)];
  };
  const rowRect = afterRects['table-selected'];
  const stripePixels = [pixel(rowRect.x + 1, rowRect.y + rowRect.height / 2), pixel(rowRect.x + 4, rowRect.y + rowRect.height / 2)];
  await sharp({ create: { width: afterMeta.width * 2 + 12, height: afterMeta.height + 36, channels: 4, background: '#16112a' } })
    .composite([{ input: out('before.png'), left: 0, top: 36 }, { input: out('after.png'), left: afterMeta.width + 12, top: 36 }])
    .png().toFile(out('comparison.png'));

  const contrasts = {
    selectedTable: selectedContrast,
    tableHeader: headerContrast,
    emptyTitle: emptyTitleContrast,
    emptyDescription: emptyDescriptionContrast,
    selectedCalendarDay: selectedDayContrast,
    rangeCalendarDay: rangeDayContrast
  };
  const critical = Object.entries(contrasts).filter(([, value]) => value < 4.5);
  const heatDistinct = adjacentHeatDeltas.every(delta => delta >= 15) && heatLuminance.every((v, i) => i === 0 || v > heatLuminance[i - 1]);
  const reportData = {
    status: 'pending',
    fixture: { label: 'NOT WINDOWS · fictional app DOM specimen', appCssSource, appCssEmbedded: appBaseLoaded, baseBundle, baseBundleBytes: Buffer.byteLength(baseCss), r10CssBytes: Buffer.byteLength(dataCss) },
    checks: {
      appBaseAndThemeLoaded: Boolean(appBaseLoaded && rootTokens.window && rootTokens.pink),
      tableSelected: { background: selected.background, foreground: selected.color, leftCellInsetShadow: selectedCell.boxShadow, backgroundImage: selected.image, hoverBackground: selectedHover.background, keyboardFocus: { outlineStyle: focusedTable.outlineStyle, outlineWidth: focusedTable.outlineWidth, outlineColor: focusedTable.outlineColor } },
      tableExpanded: { background: expanded.background, state: 'data-state=expanded / aria-expanded descendant' },
      metadataTableOnly: { wrapperClass: 'app-data-table only', selectedBackground: metadataSelected.background, leftCellInsetShadow: metadataCell.boxShadow, token: metadataTokens },
      tableHeader: { background: header.background, foreground: header.color, borderStyle: headerRow.borderBottomStyle },
      emptyState: { borderRadius: empty.borderRadius, titleFamily: emptyTitle.fontFamily, titleContrast: emptyTitleContrast, descriptionContrast: emptyDescriptionContrast, spinnerExclusion: 'PASS' },
      calendar: { selected: selectedCalendar, rangeMiddle: rangeCalendar, todayOutline: { style: todayCalendar.outlineStyle, width: todayCalendar.outlineWidth }, disabledDay: { color: disabledCalendar.color, opacity: disabledCalendar.opacity }, selectedFocus: { style: calendarFocus.outlineStyle, width: calendarFocus.outlineWidth } },
      activity: { variables: activity.vars, unchangedControlsOwnedVariables: Object.fromEntries(Object.entries(beforeActivity).map(([k,v]) => [k, { before: v, after: activity.vars[k] }])) , heatColors: activity.heat, adjacentRgbDistances: adjacentHeatDeltas, heatLuminance, distinctOrderedRamp: heatDistinct, track: activity.track, fill: activity.fill },
      hover: { regularTableRow: { before: normalBeforeHover.background, after: normalHover.background }, selectedRow: selectedHover.background },
      focus: { tableRow: focusedTable, calendarDay: calendarFocus, resizeHandle: handleFocus, friendCard: friendFocus },
      contrast: contrasts,
      geometry: { virtualRowHeightBefore: virtualBefore.height, virtualRowHeightAfter: virtualAfter.height, sizeDiffsOver2px: sizeDiffs, positionDiffsOver2px: positionDiffs },
      protectedScopes: { unchangedIds: protectedIds.filter(id => !protectedChanges.includes(id)), changedIds: protectedChanges, details: protectedStyles },
      selectedStripePixels: { samples: stripePixels, expectedPink: [255,184,230], rowImage: selected.image },
      screenshots: { before: 'before.png', after: 'after.png', comparison: 'comparison.png' }
    },
    liveApp: { checked: false, note: 'No live GUI/route was opened; route state and actual VRChat data remain unverified.' }
  };
  const unchangedAct = Object.entries(beforeActivity).every(([k, v]) => v === activity.vars[k]);
  const stripePixelPass = stripePixels[0][0] >= 245 && stripePixels[0][1] >= 165 && stripePixels[0][2] >= 210;
  const handlePseudo = handleFocus.beforeContent !== 'none' && handleFocus.outlineStyle === 'dashed' && handleFocus.outlineWidth === '2px';
  const selectedFocusPass = focusedTable.outlineStyle === 'dashed' && focusedTable.outlineWidth === '2px';
  const calendarFocusPass = calendarFocus.outlineStyle === 'dashed' && calendarFocus.outlineWidth === '2px';
  const friendFocusPass = friendFocus.outlineStyle === 'dashed' && friendFocus.outlineWidth === '2px';
  const pass = !critical.length && heatDistinct && selected.background === 'rgb(74, 55, 132)' && expanded.background === 'rgb(51, 38, 80)' && metadataSelected.background === 'rgb(74, 55, 132)' && metadataCell.boxShadow.includes('3px') && Boolean(metadataTokens) && selected.image.includes('linear-gradient') && selectedCell.boxShadow.includes('3px') && selectedHover.background === 'rgb(88, 69, 143)' && normalHover.background === 'rgb(48, 38, 80)' && headerRow.borderBottomStyle === 'dotted' && disabledCalendar.opacity === '0.55' && virtualBefore.height === virtualAfter.height && sizeDiffs.length === 0 && positionDiffs.length === 0 && protectedChanges.length === 0 && selectedFocusPass && calendarFocusPass && friendFocusPass && rootTokens.window && rootTokens.pink && stripePixelPass && unchangedAct && handlePseudo && !failures.length;
  reportData.status = pass ? 'PASS' : 'FAIL';
  reportData.checks.appBaseAndThemeLoaded = { pass: Boolean(appBaseLoaded && rootTokens.window && rootTokens.pink), rootTokens };
  reportData.checks.focus.pass = { selectedFocusPass, calendarFocusPass, friendFocusPass, handlePseudo };
  reportData.checks.geometry.pass = !sizeDiffs.length && !positionDiffs.length && virtualBefore.height === virtualAfter.height;
  reportData.checks.protectedScopes.pass = protectedChanges.length === 0;
  reportData.checks.selectedStripePixels.pass = stripePixelPass;
  reportData.failures = failures;
  await fs.writeFile(out('verify-report.json'), JSON.stringify(reportData, null, 2) + '\n');
  console.log(JSON.stringify({ status: reportData.status, contrast: contrasts, heatRamp: heatDistinct, virtualRowHeights: [virtualBefore.height, virtualAfter.height], geometryDiffsOver2px: sizeDiffs.length + positionDiffs.length, protectedChanges, focus: reportData.checks.focus.pass, output: reportData.checks.screenshots }));
  if (!pass) process.exitCode = 1;
} finally {
  await before?.close();
  await after?.close();
  await browser.close();
}
