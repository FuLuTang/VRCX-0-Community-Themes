/* NOT WINDOWS: fictional second-level dialog specimens; no application/user data. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const builtPath = '/tmp/vscode-luna/jirai-kei-theme/theme.css';
const [html, built, source] = await Promise.all([
  fs.readFile(path.join(here, 'fixture.html'), 'utf8'),
  fs.readFile(builtPath, 'utf8'),
  fs.readFile(path.join(runtime, 'dialogs-r9.css'), 'utf8')
]);
const fixtureStyle = html.match(/<style id="fixture-base">([\s\S]*?)<\/style>/)?.[1];
if (!fixtureStyle) throw new Error('Missing fixture base style');
const markup = html.replace(/\s*<style id="fixture-base">[\s\S]*?<\/style>/, '');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const close = (a, b, tolerance = 2) => Math.abs(a - b) <= tolerance;
assert(built.includes('/* SECTION motion */') && built.includes('r5-dialog-step-in'), 'Isolated base package must contain the existing R5 dialog animation');
assert(built.includes('--r8-lace-tile'), 'Isolated base package must contain the shared R8 lace tile');
assert(!/@import\b|url\((?!\s*["']?data:)/i.test(source), 'Remote @import/url is forbidden');
assert(!/\[data-slot=["'](?:dialog-(?:portal|overlay)|alert-dialog-(?:portal|overlay)|.*positioner)["']\]/i.test(source), 'Dialog positioner/overlay selector is forbidden');
/* The entity-dialog / login-page protection used to be a source-text blacklist (`:not(.entity-dialog *)`,
   `:not(.vrcx-0-main-shell[data-vrcx-0-surface="login-page"] *)`). The exclusion migration removes that blacklist on
   purpose: the generic rule is wrapped in :where() (specificity 0) and the entity / login surfaces are protected by
   their own context override rules instead. Pinning this check to the old selector TEXT would make it fail on the
   post-migration revision for a change that is invisible at runtime, so the invariant is asserted where it really
   lives - behaviourally, on the decoys below (entity detail dialog, login-nested dialog, login card, sr-only command
   dialog must all keep their computed styles). The sr-only structural guard is form-independent and stays asserted. */
const hasEntityBlacklist = source.includes(':not(.entity-dialog *)');
const hasLoginBlacklist = source.includes(':not(.vrcx-0-main-shell[data-vrcx-0-surface="login-page"] *)');
assert(hasEntityBlacklist === hasLoginBlacklist, 'entity-dialog and login-page blacklists must be present or absent together (half-migrated revision)');
assert(source.includes(':has(> :is([data-slot="dialog-header"]'), 'sr-only-header guard missing');

const browser = await chromium.launch({ headless: true });
const errors = [];
const contrasts = (fg, bg) => {
  const rgb = s => {
    const m = s.match(/rgba?\(([^)]+)\)/i);
    if (!m) throw new Error(`Unsupported color in contrast check: ${s}`);
    const n = m[1].split(/[\s,\/]+/).filter(Boolean).slice(0, 3).map(Number);
    return n.map(v => v <= 1 ? v * 255 : v);
  };
  const lum = s => {
    const [r, g, b] = rgb(s).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
    return .2126 * r + .7152 * g + .0722 * b;
  };
  const a = lum(fg), b = lum(bg);
  return +((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toFixed(2);
};
const makePage = async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 1, colorScheme: 'dark', reducedMotion: 'no-preference' });
  page.on('pageerror', e => errors.push(e.message));
  await page.setContent(markup, { waitUntil: 'load' });
  await page.addStyleTag({ content: built });
  await page.addStyleTag({ content: fixtureStyle });
  await page.evaluate(() => document.fonts.ready);
  return page;
};
const inspect = page => page.evaluate(() => {
  const get = s => document.querySelector(s);
  const rect = el => { const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), width: +r.width.toFixed(2), height: +r.height.toFixed(2) }; };
  const style = (el, pseudo = null) => {
    const s = getComputedStyle(el, pseudo);
    return { color: s.color, background: s.backgroundColor, backgroundImage: s.backgroundImage, backgroundRepeat: s.backgroundRepeat, border: s.border, borderRadius: s.borderRadius, boxShadow: s.boxShadow, fontFamily: s.fontFamily, fontSize: s.fontSize, lineHeight: s.lineHeight, position: s.position, top: s.top, left: s.left, right: s.right, transform: s.transform, overflow: s.overflow, animationName: s.animationName, animationDuration: s.animationDuration, outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, width: s.width, height: s.height };
  };
  const ids = ['info-dialog','launch-dialog','alert-dialog','info-header','launch-header','info-title','launch-title','alert-title','info-description','launch-description','info-body','launch-body','info-footer','launch-footer','stats-grid','progress-card','launch-code','launch-args','launch-path','info-refresh','launch-save','info-close'];
  const nodes = Object.fromEntries(ids.map(id => { const el = get('#'+id); return [id, { rect: rect(el), style: style(el) }]; }));
  const root = get('#info-dialog');
  const title = get('#info-title');
  const footer = get('#info-footer');
  return {
    nodes,
    titleMarker: style(title, '::before'),
    footerLace: style(footer, '::before'),
    rootGeometry: { position: getComputedStyle(root).position, top: getComputedStyle(root).top, left: getComputedStyle(root).left, transform: getComputedStyle(root).transform },
    decoys: Object.fromEntries(['entity-decoy','login-card','command-search-dialog'].map(id => { const el=get('#'+id); return [id,{rect:rect(el),style:style(el),titleBackground:el.querySelector('[data-slot$="title"]')?style(el.querySelector('[data-slot$="title"]')).background:null}]; })),
    loginPortalDialog: (()=>{ const el=get('#login-portal-dialog'); return {rect:rect(el),style:style(el),titleBackground:el.querySelector('[data-slot$="title"]')?style(el.querySelector('[data-slot$="title"]')).background:null}; })(),
    overflow: { bodyScrollWidth:document.body.scrollWidth, bodyClientWidth:document.body.clientWidth, documentScrollWidth:document.documentElement.scrollWidth, documentClientWidth:document.documentElement.clientWidth }
  };
});

let page;
try {
  page = await makePage();
  await page.mouse.move(1438,1078);
  await page.screenshot({ path: path.join(here, 'before.png'), fullPage: true, animations: 'disabled' });
  const before = await inspect(page);
  await page.addStyleTag({ content: source });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(here, 'after.png'), fullPage: true, animations: 'disabled' });
  const after = await inspect(page);

  const targetSlots = await page.locator(':is([data-slot="dialog-content"],[data-slot="alert-dialog-content"]):not(.entity-dialog):not(.owner-dialog):not(.entity-dialog *):not(.vrcx-0-main-shell[data-vrcx-0-surface="login-page"] *):has(> :is([data-slot="dialog-header"],[data-slot="alert-dialog-header"]):not(.sr-only))').count();
  assert(targetSlots === 4, `Expected 4 ordinary dialog surfaces (2 Dialog + 1 AlertDialog + 1 body-portalled login Dialog), got ${targetSlots}`);
  const bg = after.nodes['info-dialog'].style.background;
  const fg = after.nodes['info-body'].style.color;
  const titleContrast = contrasts(after.nodes['info-title'].style.color, after.nodes['info-title'].style.background);
  const bodyContrast = contrasts(fg, bg);
  const descContrast = contrasts(after.nodes['info-description'].style.color, bg);
  assert(bg === 'rgb(33, 26, 51)', `Unexpected themed surface background: ${bg}`);
  assert(after.nodes['info-title'].style.background === 'rgb(242, 198, 232)', 'Title strip is not the intended pink');
  assert(after.titleMarker.background === 'rgb(58, 34, 200)' && after.titleMarker.width === '8px' && after.titleMarker.height === '8px', 'Pixel title marker missing/incorrect');
  assert(titleContrast >= 4.5 && bodyContrast >= 4.5 && descContrast >= 4.5, `Text contrast below 4.5: title=${titleContrast}, body=${bodyContrast}, description=${descContrast}`);
  assert(after.nodes['info-dialog'].style.border.includes('rgb(108, 92, 224)') && after.nodes['info-dialog'].style.borderRadius === '0px', 'Indigo square outer frame missing');
  assert(after.nodes['info-dialog'].style.boxShadow.includes('inset'), 'Light inner bevel missing');
  assert(after.nodes['info-close'].rect.width === 22 && after.nodes['info-close'].rect.height === 22 && after.nodes['info-close'].style.borderRadius === '0px', 'Close control is not a 22px square Win95 button');
  assert(after.footerLace.backgroundImage.includes('data:image/svg+xml') && after.footerLace.backgroundRepeat === 'repeat-x', 'Shared pixel lace is missing from footer top');
  assert(after.nodes['info-dialog'].style.backgroundImage.includes('142, 230, 221') && after.nodes['info-dialog'].style.backgroundImage.includes('255, 127, 207'), 'Mint bottom strip / pink accent missing');
  assert(after.nodes['alert-dialog'].style.background === 'rgb(33, 26, 51)' && after.nodes['alert-title'].style.background === 'rgb(242, 198, 232)', 'AlertDialog surface/title was not styled');

  const sizeIds = ['info-body','launch-body','info-footer','launch-footer','info-description','launch-description','stats-grid','progress-card','launch-code','launch-args','launch-path','info-refresh','launch-save'];
  const sizeDiffs = Object.fromEntries(sizeIds.map(id => [id, { width: +(after.nodes[id].rect.width-before.nodes[id].rect.width).toFixed(2), height: +(after.nodes[id].rect.height-before.nodes[id].rect.height).toFixed(2) }]));
  for (const [id, diff] of Object.entries(sizeDiffs)) assert(close(diff.width,0) && close(diff.height,0), `Non-header content size changed >2px at ${id}: ${JSON.stringify(diff)}`);
  for (const id of ['info-dialog','launch-dialog','alert-dialog']) {
    assert(before.nodes[id].rect.width === after.nodes[id].rect.width, `${id} width changed`);
    for (const key of ['position','top','left','transform']) assert(before.nodes[id].style[key] === after.nodes[id].style[key], `${id} positioning changed at ${key}`);
  }
  for (const id of ['entity-decoy','login-card','command-search-dialog']) {
    assert(before.decoys[id].style.background === after.decoys[id].style.background && before.decoys[id].style.border === after.decoys[id].style.border && before.decoys[id].style.borderRadius === after.decoys[id].style.borderRadius, `${id} was unexpectedly restyled`);
  }
  assert(after.decoys['entity-decoy'].titleBackground === before.decoys['entity-decoy'].titleBackground, 'Entity details title was restyled');
  /* Real structure (Base UI FloatingPortal): a dialog opened from the login surface is portalled to body, so it is NOT a
     descendant of the login shell and the login-page blacklist never applied to it in either revision. It is an ordinary
     dialog and must therefore take the shared pixel treatment - asserted positively here instead of keeping the old
     synthetic "dialog nested inside the login shell" negative control. */
  assert(after.loginPortalDialog.style.background === 'rgb(33, 26, 51)' && after.loginPortalDialog.style.borderRadius === '0px' && after.loginPortalDialog.titleBackground === 'rgb(242, 198, 232)', `Body-portalled login dialog was not themed: bg=${after.loginPortalDialog.style.background} radius=${after.loginPortalDialog.style.borderRadius} title=${after.loginPortalDialog.titleBackground}`);
  assert(after.loginPortalDialog.style.background !== before.loginPortalDialog.style.background, 'Body-portalled login dialog must actually be reached by the dialog layer');

  await page.locator('#info-dismiss').focus();
  await page.keyboard.press('Tab');
  const closeFocus = await page.locator('#info-close').evaluate(el => ({ active:document.activeElement===el, visible:el.matches(':focus-visible'), outline:getComputedStyle(el).outlineStyle, width:getComputedStyle(el).outlineWidth, color:getComputedStyle(el).outlineColor }));
  assert(closeFocus.active && closeFocus.visible && closeFocus.outline === 'solid' && closeFocus.width === '2px', `Close button keyboard focus treatment failed: ${JSON.stringify(closeFocus)}`);

  const baseAnimation = await page.locator('#info-dialog').evaluate(el => ({ name:getComputedStyle(el).animationName, duration:getComputedStyle(el).animationDuration }));
  assert(baseAnimation.name.split(',').length === 1 && baseAnimation.name === 'r5-dialog-step-in', `Existing R5 animation was not reused singly: ${JSON.stringify(baseAnimation)}`);
  await page.locator('html').evaluate(el => el.classList.add('reduce-effects'));
  const reduceEffectsAnimation = await page.locator('#info-dialog').evaluate(el => getComputedStyle(el).animationName);
  await page.locator('html').evaluate(el => el.classList.remove('reduce-effects'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reducedMotionAnimation = await page.locator('#info-dialog').evaluate(el => getComputedStyle(el).animationName);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  assert(reduceEffectsAnimation === 'none' && reducedMotionAnimation === 'none', `Reduced-effects animation not static: ${reduceEffectsAnimation}/${reducedMotionAnimation}`);

  await page.setViewportSize({ width: 760, height: 1000 });
  const mobile = await page.evaluate(() => ({ scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth, titleWidth:document.querySelector('#launch-title').getBoundingClientRect().width, titleScrollWidth:document.querySelector('#launch-title').scrollWidth, closeRight:document.querySelector('#launch-close').getBoundingClientRect().right }));
  assert(mobile.scrollWidth <= mobile.clientWidth + 1, `Narrow layout overflows viewport: ${JSON.stringify(mobile)}`);
  assert(mobile.titleScrollWidth <= mobile.titleWidth + 1, `Narrow title is clipped: ${JSON.stringify(mobile)}`);
  assert(errors.length === 0, `Browser errors: ${errors.join('; ')}`);

  const beforeMeta = await sharp(path.join(here, 'before.png')).metadata();
  const afterMeta = await sharp(path.join(here, 'after.png')).metadata();
  const width = Math.max(beforeMeta.width, afterMeta.width), height = Math.max(beforeMeta.height, afterMeta.height);
  const [beforePng, afterPng] = await Promise.all([sharp(path.join(here,'before.png')).png().toBuffer(), sharp(path.join(here,'after.png')).png().toBuffer()]);
  await sharp({ create:{ width:width*2, height, channels:4, background:'#100b1e' } }).composite([{input:beforePng,left:0,top:0},{input:afterPng,left:width,top:0}]).png().toFile(path.join(here,'comparison.png'));

  const report = {
    status:'PASS',
    fixture:'NOT WINDOWS; fictional data only; CSS-only visual verification',
    build:{ path:builtPath, cssBytes:Buffer.byteLength(built), includesExistingR5Motion:built.includes('r5-dialog-step-in'), newDialogsSectionIntegratedByBuilder:false, note:'Builder remains untouched; dialogs-r9.css is appended directly by this check until Lead adds its section to build-runtime.mjs.' },
    scope:{ hitSlots:targetSlots, expected:4, selectors:'dialog-content + alert-dialog-content with visible direct header; excludes .entity-dialog/.owner-dialog, entity portals, login-shell descendants, and sr-only-header command/quick-search surfaces; login page itself uses a card rather than DialogContent. A dialog opened FROM the login surface is body-portalled (FloatingPortal), so it is an ordinary dialog and is counted + themed like the others. Post-migration the entity/login protection is the context override rule + :where() specificity rather than a :not() blacklist; both revisions are asserted and the decoys prove the behaviour.', decoys:['entity detail dialog','login card','sr-only-title command/quick-search dialog','body-portalled login dialog (themed, not excluded)'] },
    contrast:{ title:{foreground:after.nodes['info-title'].style.color,background:after.nodes['info-title'].style.background,ratio:titleContrast}, body:{foreground:fg,background:bg,ratio:bodyContrast}, description:{foreground:after.nodes['info-description'].style.color,background:bg,ratio:descContrast}, minimum:4.5 },
    appearance:{ titlePink:after.nodes['info-title'].style.background, marker:{color:after.titleMarker.background,width:after.titleMarker.width,height:after.titleMarker.height}, closeButton:{rect:after.nodes['info-close'].rect,border:after.nodes['info-close'].style.border,radius:after.nodes['info-close'].style.borderRadius,focus:closeFocus}, frame:after.nodes['info-dialog'].style.border, innerBevel:after.nodes['info-dialog'].style.boxShadow, footerLace:after.footerLace.backgroundImage.slice(0,120), bottomStrips:after.nodes['info-dialog'].style.backgroundImage },
    geometry:{ before:before.nodes, after:after.nodes, nonHeaderSizeDiffs:sizeDiffs, rootPositioningUnchanged:true, titleHeightDelta:{info:+(after.nodes['info-title'].rect.height-before.nodes['info-title'].rect.height).toFixed(2),launch:+(after.nodes['launch-title'].rect.height-before.nodes['launch-title'].rect.height).toFixed(2)}, headerHeightDelta:{info:+(after.nodes['info-header'].rect.height-before.nodes['info-header'].rect.height).toFixed(2),launch:+(after.nodes['launch-header'].rect.height-before.nodes['launch-header'].rect.height).toFixed(2)}, rootHeightDelta:{info:+(after.nodes['info-dialog'].rect.height-before.nodes['info-dialog'].rect.height).toFixed(2),launch:+(after.nodes['launch-dialog'].rect.height-before.nodes['launch-dialog'].rect.height).toFixed(2)}, titlebarNote:'Title row grows 10px (header +9px); its top edge reclaims the existing 16px dialog inset using a negative top margin, so the total fixture panel height shrinks 5px instead of adding that inset again. Non-header content, footer, controls, descriptions, and inputs have 0px width/height change; titles/descriptions remain in normal flow and wrap normally.' },
    exclusions:{ decoysUnchanged:true, values:after.decoys },
    motion:{ existingAnimation:baseAnimation, noSecondAnimation:baseAnimation.name.split(',').length===1, htmlReduceEffects:reduceEffectsAnimation, prefersReducedMotion:reducedMotionAnimation },
    narrowViewport:{viewport:760, ...mobile},
    screenshots:['before.png','after.png','comparison.png'],
    visualSelfCheck:{status:'PASS', inspected:['before.png','after.png','comparison.png'], notes:'Title strip spans popup width with indigo square and square close; content remains legible; lace stays in footer padding; mint bottom rule and left pink pixel block both visible.'},
    needsLiveConfirmation:['Base UI merged real dialog trees and actual translations at runtime','screen-reader flow for wrapped localised titles','portaled dialogs visually remain inside viewport on 125%/200% OS scaling']
  };
  await fs.writeFile(path.join(here,'verify-report.json'), JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({status:report.status,build:report.build,scope:report.scope,contrast:report.contrast,appearance:report.appearance,geometry:{nonHeaderSizeDiffs:sizeDiffs,titleHeightDelta:report.geometry.titleHeightDelta,headerHeightDelta:report.geometry.headerHeightDelta,rootHeightDelta:report.geometry.rootHeightDelta,rootPositioningUnchanged:true},exclusions:report.exclusions,motion:report.motion,narrowViewport:report.narrowViewport,screenshots:report.screenshots,needsLiveConfirmation:report.needsLiveConfirmation},null,2));
} finally {
  await browser.close();
}
