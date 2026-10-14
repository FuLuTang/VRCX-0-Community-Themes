/* R4 settings-pixel fixture + measurement. NOT Windows/WebView acceptance.
   Real base-ui primitives via SSR; app compiled CSS + built theme + the new
   settings-pixel.css. Read-only against the app checkout. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const app = '/home/fulutang/Documents/Github/VRCX-0-jirai';
const runtime = path.resolve(here, '../..');
const req = createRequire(app + '/package.json');
const React = req('react');
const {renderToStaticMarkup} = req('react-dom/server');
const {Switch: SwitchPrimitive} = req('@base-ui/react/switch');
const TG = req('@base-ui/react/toggle-group').ToggleGroup;
const TogglePrimitive = req('@base-ui/react/toggle').Toggle;
const {NumberField} = req('@base-ui/react/number-field');
const {Tabs} = req('@base-ui/react/tabs');
const {Collapsible} = req('@base-ui/react/collapsible');
const {Tooltip} = req('@base-ui/react/tooltip');
const {MinusIcon, PlusIcon, ChevronDownIcon, MonitorIcon, PaletteIcon, UsersIcon, BellIcon} = req('lucide-react');
const h = React.createElement;
const r = (el) => renderToStaticMarkup(el);

/* ---- verbatim class strings from source (evidence in research notes) ---- */
const SW = 'peer group/switch focus-visible:border-ring focus-visible:ring-ring/50 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-[background-color,border-color,box-shadow,opacity] outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]';
const TH = 'bg-background dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 motion-reduce:transition-none';
const switchEl = (id, props = {}, size = 'default') =>
    h(SwitchPrimitive.Root, {id, 'data-slot': 'switch', 'data-size': size, className: SW, ...props},
        h(SwitchPrimitive.Thumb, {'data-slot': 'switch-thumb', className: TH}));
const TOG = "text-foreground hover:bg-accent focus-visible:ring-ring data-pressed:bg-input/64 data-pressed:text-accent-foreground relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border text-base font-medium whitespace-nowrap transition-shadow outline-none select-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] h-8 min-w-8 px-[calc(--spacing(1.5)-1px)] sm:h-7 sm:min-w-7";
const SEGROUP = 'dark:*:[[data-slot=separator]:has(+[data-slot=toggle]:hover)]:before:bg-input/64 flex w-fit *:focus-visible:z-10 *:not-first:rounded-s-none *:not-first:border-s-0 *:not-last:rounded-e-none *:not-last:border-e-0 *:not-first:before:rounded-s-none *:not-last:before:rounded-e-none *:not-first:not-data-[slot=separator]:before:-start-[0.5px] *:not-last:not-data-[slot=separator]:before:-end-[0.5px]';
const SEGITEM = (value, label, pressed) =>
    h(TogglePrimitive, {'data-slot': 'toggle', 'data-variant': 'outline', 'data-size': 'sm', value, className: TOG, 'aria-label': label, 'aria-pressed': pressed}, label);
const SEGSEP = () => h('div', {'data-slot': 'separator', role: 'separator', className: 'bg-input pointer-events-none relative before:absolute before:inset-0', 'aria-orientation': 'vertical'});
const segmented = (options, pressValue) =>
    h(TG, {'data-slot': 'toggle-group', 'data-variant': 'outline', 'data-size': 'sm', value: pressValue ? [pressValue] : [], orientation: 'horizontal', className: SEGROUP},
        options.flatMap((o, i) => [i > 0 ? SEGSEP() : null, SEGITEM(o, o, o === pressValue)]).filter(Boolean));

const NFD = 'hover:bg-accent relative flex shrink-0 cursor-pointer items-center justify-center rounded-s-[calc(var(--radius-lg)-1px)] px-[calc(--spacing(2.5)-1px)] transition-colors pointer-coarse:after:absolute';
const NFI = 'hover:bg-accent relative flex shrink-0 cursor-pointer items-center justify-center rounded-e-[calc(var(--radius-lg)-1px)] px-[calc(--spacing(2.5)-1px)] transition-colors pointer-coarse:after:absolute';
const stepper = (id, value) =>
    h(NumberField.Root, {'data-slot': 'number-field', 'data-size': 'default', id, value, className: 'flex w-full flex-col items-start gap-2'},
        h(NumberField.Group, {'data-slot': 'number-field-group', className: 'border-input bg-background dark:bg-input/32 relative flex w-full justify-between rounded-lg border'},
            h(NumberField.Decrement, {'data-slot': 'number-field-decrement', className: NFD, 'aria-label': 'Decrease'}, h(MinusIcon, null)),
            h(NumberField.Input, {'data-slot': 'number-field-input', className: 'text-foreground w-full min-w-0 grow bg-transparent px-2 text-center tabular-nums'}),
            h(NumberField.Increment, {'data-slot': 'number-field-increment', className: NFI, 'aria-label': 'Increase'}, h(PlusIcon, null))));

const TT = 'hover:text-muted-foreground data-active:text-foreground relative flex shrink-0 grow cursor-pointer items-center justify-center rounded-md border border-transparent text-base font-medium whitespace-nowrap data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start sm:text-sm h-8 min-w-8 px-[calc(--spacing(1.5)-1px)] sm:h-7 sm:min-w-7 gap-1.5';
const railList = (w44) => h(Tabs.List, {'data-slot': 'tabs-list', className: `text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5 data-[orientation=vertical]:flex-col rounded-lg bg-(--state-pressed-surface) p-0.5 ${w44 ? 'h-fit w-44 shrink-0 gap-0.5 self-start' : 'h-fit w-full gap-0.5'}`},
    [['system', '系统', MonitorIcon], ['interface', '界面', PaletteIcon], ['social', '社交', UsersIcon], ['notifications', '通知', BellIcon]].map(([v, l, I]) =>
        h(Tabs.Tab, {key: v, 'data-slot': 'tabs-tab', value: v, className: TT, 'data-size': 'default'}, [h(I, {key: 'i'}), l])),
    h(Tabs.Indicator, {key: 'ind', 'data-slot': 'tab-indicator', className: 'absolute bottom-0 left-0 -z-1 rounded-md bg-background dark:bg-input'}));

const card = (title, body) =>
    h(Collapsible.Root, {'data-slot': 'collapsible', render: h('section', null), defaultOpen: true, className: 'shrink-0'},
        h('div', {'data-slot': 'card', className: 'bg-surface-raised text-foreground ring-stroke-subtle gap-0 py-0 shadow-none'}, [
            h('div', {key: 'hd', 'data-slot': 'card-header', className: 'flex flex-row items-center gap-2 p-0'},
                h('h2', {className: 'min-w-0 flex-1'},
                    h(Collapsible.Trigger, {'data-slot': 'collapsible-trigger', className: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex w-full items-center justify-between gap-3 rounded-t-xl px-4 py-2.5 text-left transition-colors outline-none'},
                        [h('span', {key: 'sp', className: 'flex min-w-0 flex-col gap-0.5'},
                            h('span', {id: 'title-' + title, key: 't', className: 'font-heading text-sm leading-snug font-semibold'}, title)),
                         h(ChevronDownIcon, {key: 'ch', 'aria-hidden': true, className: 'text-muted-foreground size-4 shrink-0'})]))),
            h(Collapsible.Panel, {key: 'pn', 'data-slot': 'collapsible-content', keepMounted: true},
                h('div', {'data-slot': 'card-content', className: 'bg-surface-panel border-stroke-subtle rounded-t-xl border-t px-4 py-2.5 flex flex-col'}, body))]));

const tooltipToggle = () => h(Tooltip.Provider, null, h(Tooltip.Root, null,
    h(Tooltip.Trigger, {render: h(TogglePrimitive, {'data-slot': 'toggle', 'data-variant': 'outline', 'data-size': 'sm', value: 'tip', className: TOG, 'aria-label': '提示项', 'aria-pressed': false}, '提示项')})));

const html = `<!doctype html><html class="dark"><meta charset="utf-8"><title>R4 settings-pixel fixture — NOT WINDOWS</title>
<link rel="stylesheet" href="file://${app}/dist/assets/index-Cckb3vVG.css">
<link rel="stylesheet" href="file://${app}/dist/assets/App-C2mIqNXI.css">
<body><div class="vrcx-0-app-root flex h-screen flex-col overflow-hidden">
<header class="vrcx-0-titlebar flex h-8 shrink-0 items-center border-b"><span class="px-4">FIXTURE / NOT WINDOWS</span></header>
<main class="vrcx-0-main-content flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-3" id="stage">
<div id="focus-probe" style="position:absolute;left:-9999px">${r(switchEl('sw-focus', {checked: false, onCheckedChange() {}}))}</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
<div data-block="settings"><p class="text-xs">SETTINGS / NOT WINDOWS</p>
${r(h(Tabs.Root, {orientation: 'vertical', value: 'interface', 'data-slot': 'tabs', className: 'flex min-h-0 flex-1 gap-4'}, [railList(true), h(Tabs.Panel, {key: 'p', 'data-slot': 'tabs-content', value: 'interface', className: 'm-0 flex min-h-0 w-full max-w-[820px] min-w-0 flex-1 flex-col gap-7 overflow-x-hidden overflow-y-auto px-px pt-1 pb-4'}, [card('显示设置', '显示房间 ID'), card('个人资料外观', '玩家信息')])]))}
</div>
<div data-block="tools"><p class="text-xs">TOOLS RAIL (leak check) / NOT WINDOWS</p>
${r(h(Tabs.Root, {orientation: 'vertical', value: 'interface', 'data-slot': 'tabs', className: 'sticky top-0 self-start'}, [railList(false), h(Tabs.Panel, {key: 'p', 'data-slot': 'tabs-content', value: 'interface', className: 'flex-1'}, card('工具卡片', '不应套用设置页装饰'))]))}
</div></div>

<div data-block="switch" class="flex flex-wrap items-center gap-4">
<span id="sw-off">${r(switchEl('sw-off', {checked: false, onCheckedChange() {}}))}</span>
<span id="sw-on">${r(switchEl('sw-on', {checked: true, onCheckedChange() {}}))}</span>
<span id="sw-sm-off">${r(switchEl('sw-sm-off', {checked: false, onCheckedChange() {}}, 'sm'))}</span>
<span id="sw-sm-on">${r(switchEl('sw-sm-on', {checked: true, onCheckedChange() {}}, 'sm'))}</span>
<span id="sw-dis">${r(switchEl('sw-dis', {checked: true, disabled: true, onCheckedChange() {}}))}</span>
<span id="sw-dis-off">${r(switchEl('sw-dis-off', {checked: false, disabled: true, onCheckedChange() {}}))}</span>
</div>

<div data-block="stepper">${r(h('div', {id: 'stepper-wrap', style: {width: '240px'}}, stepper('nf-1', 60)))}</div>

<div data-block="segmented" class="flex flex-col items-start gap-3">
<div id="seg-a">${r(segmented(['背景', '个人资料特效', '头像框', '名牌主题'], '背景'))}</div>
<div id="seg-b">${r(segmented(['头像框', '名牌主题'], null))}</div>
<div id="seg-tip">${r(h(TG, {'data-slot': 'toggle-group', 'data-variant': 'outline', 'data-size': 'sm', orientation: 'horizontal', value: ['tip2'], className: SEGROUP}, [SEGSEP(), SEGITEM('tip2', '头像框', true), tooltipToggle()]))}</div>
</div>
</main></div></body></html>`;
const fixture = path.join(here, 'r4-settings-pixel-fixture.html');
await fs.writeFile(fixture, html);

const appCss = await fs.readFile(path.join(app, 'dist/assets/index-Cckb3vVG.css'), 'utf8');
const themeCss = await fs.readFile(path.join(runtime, 'preview-package/jirai-kei-theme/theme.css'), 'utf8');
const myCss = await fs.readFile(path.join(runtime, 'settings-pixel.css'), 'utf8');
const browser = await chromium.launch();

async function shot(name, viewport, extraCss) {
    const page = await browser.newPage({viewport, deviceScaleFactor: 1});
    await page.goto('file://' + fixture);
    await page.addStyleTag({content: extraCss ? appCss + '\n' + themeCss : appCss});
    if (extraCss) await page.addStyleTag({content: myCss});
    await page.evaluate(async () => {await document.fonts.ready;});
    await page.waitForTimeout(400); /* let app transitions (transition-shadow / translate) settle */
    const data = await page.evaluate(() => { try {
        window.__cssHasAlpha = !!document.querySelector('style') ;
        const q = (s) => document.querySelector(s);
        const cs = (s, prop, pseudo) => {const e = q(s); return e ? getComputedStyle(e, pseudo || null).getPropertyValue(prop) : null;};
        const rect = (s) => {const e = q(s); if (!e) return null; const b = e.getBoundingClientRect(); return {x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2), bottom: +b.bottom.toFixed(2), right: +b.right.toFixed(2)};};
        window.__s='sw-fn';
        const sw = (id) => {
            const root = q('#' + id + ' [data-slot=switch]') || q('#' + id), th = root.querySelector('[data-slot=switch-thumb]'), r0 = root.getBoundingClientRect(), rt = th.getBoundingClientRect(), c = getComputedStyle(root), ct = getComputedStyle(th);
            return {w: r0.width, h: r0.height, radius: c.borderRadius, bg: c.backgroundColor, shadow: c.boxShadow.slice(0, 150), transition: c.transitionProperty + ' ' + c.transitionDuration + ' ' + c.transitionTimingFunction, opacity: c.opacity, filter: c.filter,
                thumb: {w: rt.width, h: rt.height, radius: ct.borderRadius, bg: ct.backgroundColor, img: ct.backgroundImage.slice(0, 40), size: ct.backgroundSize, translate: ct.translate, transform: ct.transform, shadow: ct.boxShadow, offLeft: +(rt.x - r0.x).toFixed(2), transition: ct.transitionDuration + ' ' + ct.transitionTimingFunction}};
        };
        const set = {off: sw('sw-off'), on: sw('sw-on'), smOff: sw('sw-sm-off'), smOn: sw('sw-sm-on'), disabled: sw('sw-dis'), disabledOff: sw('sw-dis-off')};
        const segItem = (root, i) => {const e = root.querySelectorAll('[data-slot=toggle],[data-slot=tooltip-trigger]')[i]; const c = getComputedStyle(e); return {slot: e.dataset.slot, pressed: e.hasAttribute('data-pressed'), bg: c.backgroundColor, color: c.color, shadow: c.boxShadow.slice(0, 130), radius: c.borderTopLeftRadius, beforeRadius: getComputedStyle(e, '::before').borderTopLeftRadius};};
        window.__s='seg';
        const segA = q('#seg-a [data-slot=toggle-group]'), segB = q('#seg-b [data-slot=toggle-group]'), segTip = q('#seg-tip [data-slot=toggle-group]');
        const g = (root) => {const c = getComputedStyle(root); return {border: c.borderTopWidth + ' ' + c.borderTopColor, radius: c.borderTopLeftRadius, bg: c.backgroundColor, clip: c.clipPath.slice(0, 40), gap: c.gap};};
        const sep = segA.querySelector('[data-slot=separator]'); const sepC = getComputedStyle(sep);
        window.__s='nf';
        const nfGroup = q('[data-slot=number-field-group]'), nfInput = q('[data-slot=number-field-input]'), nfDec = q('[data-slot=number-field-decrement]'), nfInc = q('[data-slot=number-field-increment]');
        const nf = {group: {border: getComputedStyle(nfGroup).borderTopWidth + ' ' + getComputedStyle(nfGroup).borderTopColor, radius: getComputedStyle(nfGroup).borderTopLeftRadius, bg: getComputedStyle(nfGroup).backgroundColor, shadow: getComputedStyle(nfGroup).boxShadow.slice(0, 110), clip: getComputedStyle(nfGroup).clipPath.slice(0, 40), h: nfGroup.getBoundingClientRect().height},
            input: {h: nfInput.getBoundingClientRect().height, lh: getComputedStyle(nfInput).lineHeight, fs: getComputedStyle(nfInput).fontSize, bg: getComputedStyle(nfInput).backgroundColor},
            dec: {w: nfDec.getBoundingClientRect().width, h: nfDec.getBoundingClientRect().height, bg: getComputedStyle(nfDec).backgroundColor, shadow: getComputedStyle(nfDec).boxShadow.slice(0, 110), svg: getComputedStyle(nfDec.querySelector('svg')).display, glyph: getComputedStyle(nfDec, '::before').maskImage.slice(0, 30), glyphSize: getComputedStyle(nfDec, '::before').maskSize, glyphPE: getComputedStyle(nfDec, '::before').pointerEvents},
            inc: {svg: getComputedStyle(nfInc.querySelector('svg')).display, glyph: getComputedStyle(nfInc, '::before').maskImage.slice(0, 30)}};
        window.__s='rail';
        const setRail = q('[data-block=settings] [data-slot=tabs-list]'), toolRail = q('[data-block=tools] [data-slot=tabs-list]');
        const railInfo = (e) => ({bg: getComputedStyle(e).backgroundColor, border: getComputedStyle(e).borderTopWidth + ' ' + getComputedStyle(e).borderTopColor, radius: getComputedStyle(e).borderTopLeftRadius, pad: getComputedStyle(e).padding, clip: getComputedStyle(e).clipPath.slice(0, 40), shadow: getComputedStyle(e).boxShadow.slice(0, 90),
            lace: {mask: getComputedStyle(e, '::after').maskImage !== 'none', size: getComputedStyle(e, '::after').maskSize, pe: getComputedStyle(e, '::after').pointerEvents, pos: getComputedStyle(e, '::after').position, h: getComputedStyle(e, '::after').height}, indicator: getComputedStyle(e.querySelector('[data-slot=tab-indicator]')).display});
        const tabInfo = (e) => {const ts = [...e.querySelectorAll('[data-slot=tabs-tab]')]; const act = ts.find((t) => t.hasAttribute('data-active')); const c = getComputedStyle(act); const ic = getComputedStyle(act.querySelector('svg'));
            return {activeBg: c.backgroundColor, activeColor: c.color, activeBorder: c.borderTopWidth + ' ' + c.borderTopColor, activeShadow: c.boxShadow.slice(0, 110), activeRadius: c.borderTopLeftRadius, iconColor: ic.color, iconOpacity: ic.opacity, idleBg: getComputedStyle(ts[0]).backgroundColor, idleColor: getComputedStyle(ts[0]).color};};
        window.__s='card';
        const sc = q('[data-block=settings] [data-slot=card]'), tc = q('[data-block=tools] [data-slot=card]');
        const cardInfo = (e) => ({border: getComputedStyle(e).borderTopWidth + ' ' + getComputedStyle(e).borderTopColor, radius: getComputedStyle(e).borderTopLeftRadius, bg: getComputedStyle(e).backgroundColor, clip: getComputedStyle(e).clipPath.slice(0, 40), shadow: getComputedStyle(e).boxShadow.slice(0, 60),
            header: {bg: getComputedStyle(e.querySelector('[data-slot=card-header]')).backgroundColor, borderBottom: getComputedStyle(e.querySelector('[data-slot=card-header]')).borderBottomWidth + ' ' + getComputedStyle(e.querySelector('[data-slot=card-header]')).borderBottomColor, shadow: getComputedStyle(e.querySelector('[data-slot=card-header]')).boxShadow.slice(0, 60)},
            content: {radius: getComputedStyle(e.querySelector('[data-slot=card-content]')).borderTopLeftRadius}});
        window.__s='trigger';
        const trigger = sc.querySelector('[data-slot=collapsible-trigger]');
        const trC = getComputedStyle(trigger);
        const trRect = trigger.getBoundingClientRect();
        const titleRect = trigger.querySelector('span span').getBoundingClientRect();
        const laceRect = {top: trRect.bottom - 8, bottom: trRect.bottom};
        const bowC = getComputedStyle(trigger, '::before'), laceC = getComputedStyle(trigger, '::after');
        const titleBar = {padLeft: trC.paddingLeft, padRight: trC.paddingRight, radius: trC.borderTopLeftRadius, color: trC.color, position: trC.position,
            bow: {mask: bowC.maskImage !== 'none', size: bowC.maskSize, w: bowC.width, h: bowC.height, bg: bowC.backgroundColor, pe: bowC.pointerEvents, left: bowC.left},
            lace: {mask: laceC.maskImage !== 'none', size: laceC.maskSize, h: laceC.height, bottom: laceC.bottom, bg: laceC.backgroundColor, pe: laceC.pointerEvents},
            titleRect: {top: +titleRect.top.toFixed(2), bottom: +titleRect.bottom.toFixed(2)}, laceRect: {top: +laceRect.top.toFixed(2), bottom: +laceRect.bottom.toFixed(2)},
            laceOverlapsText: laceRect.top < titleRect.bottom,
            railLaceOverlapsFirstTab: (() => {const lr = setRail.getBoundingClientRect(); const ft = setRail.querySelector('[data-slot=tabs-tab]'); const lt = [...setRail.querySelectorAll('[data-slot=tabs-tab]')].pop().getBoundingClientRect(); return (lr.bottom - 10) < lt.bottom; })()};
        window.__s='pre-return';
        return {set, segA: {group: g(segA), idle: segItem(segA, 1), pressed: segItem(segA, 0), separator: {w: sep.getBoundingClientRect().width, bg: sepC.backgroundColor, before: getComputedStyle(sep, '::before').display}},
            segB: {idle: segItem(segB, 0)}, segTip: {slots: [...segTip.querySelectorAll('[data-slot=toggle],[data-slot=tooltip-trigger]')].map((e) => e.dataset.slot), pressedBg: (() => {const p = [...segTip.querySelectorAll('[data-slot=toggle],[data-slot=tooltip-trigger]')].find((e) => e.hasAttribute('data-pressed')); return p ? getComputedStyle(p).backgroundColor : 'NO_PRESSED';})()},
            nf, rail: {settings: railInfo(setRail), tools: railInfo(toolRail)}, tabs: {settings: tabInfo(setRail), tools: tabInfo(toolRail)}, card: {settings: cardInfo(sc), tools: cardInfo(tc)}, titleBar,
            hit: {switchOnThumbCenter: document.elementFromPoint(...(() => {const t = q('#sw-on [data-slot=switch-thumb]').getBoundingClientRect(); return [t.x + t.width / 2, t.y + t.height / 2];})())?.getAttribute('data-slot')}};
    } catch (e) { return {__error: String(e && e.message), __step: window.__s}; }
    });
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500); /* transition-colors also animates outline-color */
    data.focus = await page.evaluate(() => {const e = document.activeElement; const c = getComputedStyle(e); return {id: e.id, visible: e.matches(':focus-visible'), outline: c.outlineWidth + ' ' + c.outlineStyle + ' ' + c.outlineColor, offset: c.outlineOffset, shadow: c.boxShadow.slice(0, 90)};});
    const ringOf = async (sel) => {await page.evaluate(s => document.querySelector(s).focus(), sel); await page.waitForTimeout(400);
        return page.evaluate(s => {const c = getComputedStyle(document.querySelector(s)); return c.outlineWidth + ' ' + c.outlineStyle + ' ' + c.outlineColor + ' off' + c.outlineOffset;}, sel);};
    data.focusRings = {railIdle: await ringOf('[data-block=settings] [data-slot=tabs-list] > [data-slot=tabs-tab]'),
        stepperDec: await ringOf('[data-slot=number-field-decrement]'),
        toggle: await ringOf('[data-block=segmented] [data-slot=toggle]')};
    await page.screenshot({path: path.join(here, name + '.png'), fullPage: true});
    if (name === 'r4-settings-pixel') {
        await page.locator('[data-block=settings]').screenshot({path: path.join(here, 'r4-settings-pixel-crop.png')});
        await page.locator('[data-block=switch]').screenshot({path: path.join(here, 'r4-settings-pixel-switch.png')});
        await page.locator('[data-block=segmented]').screenshot({path: path.join(here, 'r4-settings-pixel-segmented.png')});
        await page.locator('[data-block=stepper]').screenshot({path: path.join(here, 'r4-settings-pixel-stepper.png')});
        await page.hover('[data-block=settings] [data-slot=tabs-list] > [data-slot=tabs-tab]:nth-child(3)');
        await page.waitForTimeout(400);
        data.railHover = await page.evaluate(() => {const t = document.querySelectorAll('[data-block=settings] [data-slot=tabs-list] > [data-slot=tabs-tab]')[2]; const c = getComputedStyle(t); return {bg: c.backgroundColor, color: c.color, border: c.borderTopColor};});
        await page.hover('#seg-b [data-slot=toggle]:nth-child(1)');
        await page.waitForTimeout(400);
        data.segHover = await page.evaluate(() => {const t = document.querySelector('#seg-b [data-slot=toggle]'); const c = getComputedStyle(t); return {bg: c.backgroundColor, color: c.color};});
    }
    await page.close();
    return data;
}
async function zoom(name, sel, scale) {
    const page = await browser.newPage({viewport: {width: 1180, height: 1000}, deviceScaleFactor: scale});
    await page.goto('file://' + fixture);
    await page.addStyleTag({content: appCss + '\n' + themeCss});
    await page.addStyleTag({content: myCss});
    await page.evaluate(async () => {await document.fonts.ready;});
    await page.waitForTimeout(400);
    const el = page.locator(sel).first();
    const box = await el.boundingBox();
    await page.screenshot({path: path.join(here, name + '.png'), clip: {x: box.x - 2, y: box.y - 2, width: box.width + 4, height: box.height + 4}});
    await page.close();
}
const baseline = await shot('r4-settings-pixel-baseline', {width: 1180, height: 1000}, false);
const themed = await shot('r4-settings-pixel', {width: 1180, height: 1000}, true);
await zoom('zoom-switch', '[data-block=switch]', 6);
await zoom('zoom-stepper', '[data-block=stepper]', 4);
await zoom('zoom-settings-card', '[data-block=settings] [data-slot=card]', 3);
await zoom('zoom-rail', '[data-block=settings] [data-slot=tabs-list]', 4);
await zoom('zoom-segmented', '#seg-a', 4);
await fs.writeFile(path.join(here, 'r4-measure.json'), JSON.stringify({baseline, themed}, null, 2) + '\n');
await browser.close();
console.log(JSON.stringify({baseline, themed}, null, 2));
