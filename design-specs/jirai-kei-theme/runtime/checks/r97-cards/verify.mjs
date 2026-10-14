/* R9.7 Q3+Q4 cards/lace verification. FIXTURE, NOT WINDOWS.
   Real base-ui primitives via SSR + app `cn` merging + app compiled CSS; class strings copied from
   SettingsPage.tsx:69-111, SettingsCard.tsx:43-101, SettingsViewParts.tsx:59-64,
   ToolsPageContent.tsx:96-392/456-484/787-960, WristFeedNotificationsDialog.tsx:381-420 (other similar),
   ThemesPageParts.tsx:46-60 (decoy). Writes only into this folder and /tmp/jirai-r97-q3. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const app = '/home/fulutang/Documents/Github/VRCX-0-jirai';
const OUT = '/tmp/jirai-r97-q3';
const req = createRequire(app + '/package.json');
const sharp = createRequire('/tmp/dsh-theme-tools/package.json')('sharp');
const React = req('react');
const {renderToStaticMarkup} = req('react-dom/server');
const {Tabs} = req('@base-ui/react/tabs');
const {Collapsible} = req('@base-ui/react/collapsible');
const {Switch} = req('@base-ui/react/switch');
const L = req('lucide-react');
const {cn} = await import(app + '/node_modules/cn/dist/index.js');
const h = React.createElement, r = (e) => renderToStaticMarkup(e);

/* ---- primitives (ui/shadcn/*.tsx + lib/segmented-control.ts) ---- */
const SEG = "gap-1.5 [&_svg:not(.lucide):not([class*='opacity-'])]:opacity-80 [&_.lucide]:text-muted-foreground [&_.lucide:not([class*='opacity-'])]:opacity-[0.576] hover:[&_.lucide:not([class*='opacity-'])]:opacity-80 data-active:[&_.lucide]:text-foreground data-active:[&_.lucide:not([class*='opacity-'])]:opacity-80 [&_.lucide:not([class*='transition-'])]:transition-[color,opacity] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0";
const TABS = (cls, kids, value) => h(Tabs.Root, {orientation: 'vertical', value, 'data-slot': 'tabs', className: cn('flex flex-col gap-2 data-[orientation=vertical]:flex-row', cls)}, kids);
const LIST = (cls, items, label) => h(Tabs.List, {'data-slot': 'tabs-list', 'data-size': 'default', 'aria-label': label, className: cn('text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5', 'data-[orientation=vertical]:flex-col', 'text-muted-foreground/72 rounded-lg bg-(--state-pressed-surface) p-0.5', cls)},
    [...items, h(Tabs.Indicator, {key: 'ind', 'data-slot': 'tab-indicator', className: 'absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out bg-background dark:bg-input -z-1 rounded-md shadow-sm/5'})]);
const TAB = (value, cls, kids) => h(Tabs.Tab, {key: value, value, 'data-slot': 'tabs-tab', 'data-size': 'default', className: cn('hover:text-muted-foreground focus-visible:ring-ring data-active:text-foreground relative flex shrink-0 grow cursor-pointer items-center justify-center rounded-md border border-transparent text-base font-medium whitespace-nowrap transition-[color,background-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-inset data-disabled:pointer-events-none data-disabled:opacity-64 data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start sm:text-sm', SEG, 'h-8.5 px-[calc(--spacing(2.5)-1px)] sm:h-7.5', cls)}, kids);
const CARD_BASE = 'group/card bg-card text-card-foreground ring-foreground/10 flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl py-(--card-spacing) text-sm ring-1 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)]';
const HEADER_BASE = 'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)';
const SWITCH = (checked, label) => h(Switch.Root, {'data-slot': 'switch', 'data-size': 'sm', checked, 'aria-label': label, className: 'peer group/switch focus-visible:border-ring focus-visible:ring-ring/50 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-[background-color,border-color,box-shadow,opacity] outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]'},
    h(Switch.Thumb, {'data-slot': 'switch-thumb', className: 'bg-background dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=sm]/switch:size-3 group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)]'}));
/* SettingsCard.tsx:43-101 */
const SettingsCard = (key, title, description, action, bodyClassName, children) =>
    h(Collapsible.Root, {key, 'data-slot': 'collapsible', render: h('section'), defaultOpen: true, className: 'shrink-0'},
        h('div', {'data-slot': 'card', 'data-size': 'default', className: cn(CARD_BASE, 'bg-surface-raised text-foreground ring-stroke-subtle gap-0 py-0 shadow-none')}, [
            h('div', {key: 'h', 'data-slot': 'card-header', className: cn(HEADER_BASE, 'flex flex-row items-center gap-2 p-0')}, [
                h('h2', {key: 't', className: 'min-w-0 flex-1'},
                    h(Collapsible.Trigger, {'data-slot': 'collapsible-trigger', className: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex w-full items-center justify-between gap-3 rounded-t-xl px-4 py-2.5 text-left transition-colors duration-(--motion-fast) ease-(--ease-out-ui) outline-none focus-visible:ring-2 focus-visible:ring-inset active:bg-(--state-pressed-surface) motion-reduce:transition-none'}, [
                        h('span', {key: 's', className: 'flex min-w-0 flex-col gap-0.5'}, [
                            h('span', {key: 'a', 'data-fx': 'title', className: 'font-heading text-sm leading-snug font-semibold'}, title),
                            description ? h('span', {key: 'b', className: 'text-muted-foreground text-sm font-normal'}, description) : null]),
                        h(L.ChevronDownIcon, {key: 'c', 'aria-hidden': true, className: 'text-muted-foreground size-4 shrink-0 transition-transform duration-(--motion-fast) ease-(--ease-out-ui) motion-reduce:transition-none'})])),
                action ? h('div', {key: 'a', className: 'shrink-0 pr-4'}, action) : null]),
            h(Collapsible.Panel, {key: 'p', 'data-slot': 'collapsible-content', keepMounted: true},
                h('div', {'data-slot': 'card-content', className: cn('px-(--card-spacing)', 'bg-surface-panel border-stroke-subtle rounded-t-xl border-t px-4 py-2.5', bodyClassName)}, children))]));
const settingRow = (label, desc, on) => h('div', {key: label, className: 'flex items-center justify-between gap-4 py-2'}, [
    h('div', {key: 'l', className: 'flex min-w-0 flex-col gap-0.5'}, [h('span', {key: 'a', className: 'text-sm font-medium'}, label), h('span', {key: 'b', className: 'text-muted-foreground text-xs'}, desc)]), h('span', {key: 's'}, SWITCH(on, label))]);

/* ToolsPageContent.tsx:96-392 (ToolRow, non-edit mode) */
const GRID = 'grid-cols-[1.25rem_16rem_minmax(0,1fr)_auto_1.5rem_1.5rem]';
const ToolRow = (key, Icon, title, desc, items) => h('div', {key, 'data-fx': 'tool-row', className: ''}, [
    h('div', {key: 'r', className: cn(`group/tool grid h-9 ${GRID} items-center gap-3 px-4 text-sm`, '[&:has([data-slot=dropdown-menu-trigger][aria-expanded=true])]:bg-[var(--vrcx-0-table-row-hover-surface)]', 'has-[>button:focus-visible]:bg-[var(--vrcx-0-table-row-hover-surface)]', 'hover:bg-[var(--vrcx-0-table-row-hover-surface)]')}, [
        h('button', {key: 'b', type: 'button', className: 'col-span-3 grid h-full grid-cols-subgrid items-center gap-3 text-left outline-none'}, [
            h(Icon, {key: 'i', 'aria-hidden': true, className: 'text-muted-foreground size-4'}), h('span', {key: 't', className: 'truncate font-medium'}, title), h('span', {key: 'd', className: 'text-muted-foreground truncate text-xs'}, desc)]),
        h('div', {key: 's', className: 'flex items-center justify-end gap-3'}),
        h('div', {key: 'm', className: 'flex size-6 items-center justify-center'}, h('button', {type: 'button', 'data-slot': 'dropdown-menu-trigger', 'aria-label': '操作', className: 'text-muted-foreground invisible size-6 group-hover/tool:visible'}, h(L.MoreHorizontalIcon, {'data-icon': 'inline-start'}))),
        h('div', {key: 'e', className: 'flex size-6 items-center justify-center'}, items ? h('button', {type: 'button', 'aria-expanded': true, className: 'text-muted-foreground/50 hover:text-foreground size-6'}, h(L.ChevronDownIcon, {'data-expanded': 'true', className: 'size-4 transition-transform duration-150 data-[expanded=true]:rotate-180 motion-reduce:transition-none'})) : h(L.ChevronRightIcon, {'aria-hidden': true, className: 'text-muted-foreground/50 size-4'}))]),
    items ? h('div', {key: 'items', className: 'divide-stroke-subtle border-stroke-subtle divide-y border-t'}, items.map(([label, d, on]) =>
        h('div', {key: label, 'data-fx': 'tool-item', className: `group/tool-item grid h-8 ${GRID} items-center gap-3 px-4 text-sm hover:bg-[var(--vrcx-0-table-row-hover-surface)]`}, [
            h('button', {key: 'b', type: 'button', className: 'col-span-3 grid h-full grid-cols-subgrid items-center gap-3 text-left outline-none'}, [h('span', {key: 'x', 'aria-hidden': true}), h('span', {key: 'l', className: cn('truncate', !on && 'text-muted-foreground')}, label), h('span', {key: 'd', className: 'text-muted-foreground truncate text-xs'}, d)]),
            h('div', {key: 's', className: 'flex items-center justify-end'}, SWITCH(on, label)), h('span', {key: 'x2', 'aria-hidden': true}),
            h(L.ChevronRightIcon, {key: 'c', 'aria-hidden': true, className: 'text-muted-foreground/50 size-4 justify-self-center opacity-0'})]))) : null]);
const ToolSection = (id, title, rows) => h('div', {key: id, 'data-tools-section': id}, SettingsCard(id, title, null, null, 'flex flex-col p-0',
    h('div', {className: 'divide-stroke-subtle divide-y overflow-hidden rounded-b-xl'}, rows)));

const settingsBlock = r(h('div', {className: 'vrcx-0-page-scaffold flex h-full min-h-0 min-w-0 flex-col overflow-hidden x-container x-container--auto-height p-4 flex-1'}, [
    h('div', {key: 'h', className: 'flex shrink-0 flex-col gap-1 p-1.5'}, [h('h1', {key: 't', className: 'text-xl font-semibold'}, '设置'), h('p', {key: 'd', className: 'text-muted-foreground text-sm'}, 'FIXTURE · NOT WINDOWS')]),
    TABS('flex min-h-0 flex-1 gap-4', [
        LIST('h-fit w-44 shrink-0 gap-0.5 self-start', [['system', '系统', L.MonitorIcon], ['interface', '界面', L.PaletteIcon], ['social', '社交', L.UsersIcon], ['notifications', '通知', L.BellIcon], ['advanced', '高级', L.WrenchIcon]]
            .map(([v, l, I]) => TAB(v, 'justify-start gap-2.5 px-3 py-1.5', [h(I, {key: 'i'}), l])), null),
        h('div', {key: 'c', className: 'flex min-h-0 min-w-0 flex-1 flex-col'},
            h(Tabs.Panel, {value: 'interface', 'data-slot': 'tabs-content', className: 'flex-1 outline-none m-0 flex min-h-0 w-full max-w-[820px] min-w-0 flex-1 flex-col gap-7 overflow-x-hidden overflow-y-auto px-px pt-1 pb-4 data-hidden:hidden [&>[data-slot=card]]:shrink-0'}, [
                SettingsCard('s1', '最近使用', null, null, undefined, [settingRow('显示房间 ID', '在位置旁显示实例编号', true), settingRow('紧凑模式', '缩小列表行高', false)]),
                SettingsCard('s2', '外观', '主题与字体', h('button', {type: 'button', 'data-slot': 'button', className: 'h-7 rounded-md border px-2 text-xs'}, '重置'), undefined, [settingRow('像素字体', '正文使用像素字体', true)])]))], 'interface')]));

const tools = [['tools-section-recent', '最近使用', [['r1', L.ImageIcon, '截图元数据', '查看与搜索截图中的世界信息'], ['r2', L.FolderOpenIcon, '打开 VRChat 文件夹', '快速打开缓存与日志目录']]],
    ['tools-section-system', '系统工具', [['s1', L.BellIcon, '通知', '桌面与腕表通知', [['好友上线', '好友上线时通知', true], ['邀请', '收到邀请时通知', false]]], ['s2', L.DatabaseIcon, '数据库维护', '整理本地数据库']]],
    ['tools-section-media', '媒体', [['m1', L.CameraIcon, '相册', '浏览 VRChat 相册'], ['m2', L.SmileIcon, '表情', '管理表情与贴纸'], ['m3', L.FileTextIcon, 'VRChat 日志', '查看游戏日志']]]];
const toolsBlock = r(h('div', {id: 'chart', className: 'vrcx-0-page-scaffold flex h-full min-h-0 min-w-0 flex-col overflow-hidden x-container x-container--auto-height p-4 flex-1'}, [
    h('div', {key: 't', className: 'vrcx-0-page-toolbar flex shrink-0 flex-col gap-2'}, h('div', {className: 'flex min-w-0 flex-wrap items-center gap-2'}, [
        h('div', {key: 's', 'data-vrcx-0-control': 'toolbar', 'data-slot': 'input-group', role: 'group', className: 'relative flex h-8 w-64 items-center rounded-md border'}, [h('div', {key: 'a', 'data-slot': 'input-group-addon', className: 'flex items-center pl-2'}, h(L.SearchIcon, {className: 'size-4'})), h('input', {key: 'i', 'data-slot': 'input-group-control', placeholder: '筛选工具', className: 'h-full flex-1 bg-transparent px-2 outline-none'})]),
        h('button', {key: 'b', type: 'button', 'data-slot': 'button', 'data-variant': 'outline', className: 'ml-auto h-7 rounded-md border px-2.5 text-sm'}, '编辑快捷访问')])),
    h('div', {key: 'b', className: 'relative mt-4 min-h-0 flex-1 overflow-y-auto'}, h('div', {className: 'mx-auto grid w-full max-w-5xl grid-cols-[11rem_minmax(0,1fr)] gap-6 pb-6'}, [
        TABS('sticky top-0 self-start', [LIST('h-fit w-full gap-0.5', tools.map(([id, t], i) => TAB(id, 'justify-start gap-2 px-2.5', [h([L.HistoryIcon, L.SettingsIcon, L.ImageIcon][i], {key: 'i'}), h('span', {key: 's', className: 'truncate'}, t)])), '工具分类')], 'tools-section-recent'),
        h('div', {key: 'c', className: 'flex min-w-0 flex-col gap-4'}, [
            ToolSection(tools[0][0], tools[0][1], tools[0][2].map(([k, I, t, d, it]) => h('div', {key: k}, ToolRow(k, I, t, d, it)))),
            h('div', {key: 'cat', className: 'flex flex-col gap-4 rounded-xl transition-colors duration-150 motion-reduce:transition-none'},
                tools.slice(1).map(([id, t, rows]) => ToolSection(id, t, rows.map(([k, I, tt, d, it]) => ToolRow(k, I, tt, d, it)))))])]))]));

/* Other similar (not covered, see report): WristFeedNotificationsDialog.tsx:389-420 left category list. */
const otherBlock = r(TABS('grid h-[min(62vh,36rem)] min-h-0 grid-cols-[18rem_minmax(0,1fr)] gap-5 overflow-hidden', [
    h('div', {key: 'sa', 'data-slot': 'scroll-area', className: 'relative h-full border-r pr-3'}, LIST('h-fit w-full gap-1', [['friend', '好友动态', '好友上线、换图'], ['group', '群组', '群组实例开启'], ['notify', '通知', '邀请与请求']].map(([v, l, d]) =>
        TAB(v, 'h-auto w-full justify-between gap-3 px-3 py-2.5 text-left whitespace-normal sm:h-auto', [h('span', {key: 's', className: 'flex min-w-0 flex-1 flex-col items-start gap-1'}, [h('span', {key: 'a', className: 'font-medium'}, l), h('span', {key: 'b', className: 'text-muted-foreground line-clamp-2 text-xs font-normal'}, d)]), h(L.ChevronRightIcon, {key: 'c', 'data-icon': 'inline-end'})])), '分类')),
    h(Tabs.Panel, {key: 'p', value: 'friend', 'data-slot': 'tabs-content', className: 'grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-3'}, [h('div', {key: 'h', className: 'flex items-start justify-between gap-4 border-b pb-3'}, '好友动态'), h('div', {key: 'g', 'data-slot': 'field-group', className: 'gap-0 rounded-lg border p-3'}, '规则列表')])], 'friend'));
/* Decoy: ordinary Card (ThemesPageParts.tsx:46-60) outside both scopes. */
const decoyBlock = r(h('div', {'data-slot': 'card', 'data-size': 'sm', className: cn(CARD_BASE, 'min-w-0 w-72')}, [
    h('div', {key: 'h', 'data-slot': 'card-header', className: cn(HEADER_BASE, 'gap-1.5')}, h('div', {'data-slot': 'card-title', className: 'font-heading text-base leading-snug font-medium truncate text-sm'}, '普通卡片 decoy')),
    h('div', {key: 'c', 'data-slot': 'card-content', className: 'px-(--card-spacing) flex min-h-0 flex-col gap-2.5'}, '不应变化')]));

const html = `<!doctype html><html class="dark" lang="zh-CN"><meta charset="utf-8"><title>R9.7 cards fixture — NOT WINDOWS</title>
<body style="margin:0"><div class="vrcx-0-app-root flex flex-col">
<main class="vrcx-0-main-content flex min-h-0 flex-col" data-block="settings" style="height:520px;width:1100px">${settingsBlock}</main>
<main class="vrcx-0-main-content flex min-h-0 flex-col" data-block="tools" style="height:820px;width:1100px">${toolsBlock}</main>
<main class="vrcx-0-main-content flex min-h-0 flex-col p-4" data-block="other" style="height:320px;width:1100px">${otherBlock}</main>
<main class="vrcx-0-main-content flex min-h-0 flex-col p-4" data-block="decoy" style="height:200px;width:1100px"><div class="vrcx-0-page-scaffold flex flex-col p-4">${decoyBlock}</div></main>
</div></body></html>`;
await fs.mkdir(OUT, {recursive: true});
await fs.writeFile(path.join(here, 'fixture.html'), html);

const appCss = await fs.readFile(path.join(app, 'dist/assets/index-Cckb3vVG.css'), 'utf8');
const bundle = await fs.readFile('/tmp/jirai-lead-r96k/jirai-kei-theme/theme.css', 'utf8');
const mine = await fs.readFile(path.join(runtime, 'cards-r97.css'), 'utf8');
const after = bundle + '/* SECTION cards-r97 */\n' + mine;
await fs.writeFile(path.join(OUT, 'theme.css'), after);
const NOANIM = '*,*::before,*::after{animation:none!important;transition:none!important}';
const browser = await chromium.launch();
async function open(css, dsf = 1, extra = '') {
    const p = await browser.newPage({viewport: {width: 1100, height: 1900}, deviceScaleFactor: dsf});
    await p.setContent(html, {waitUntil: 'domcontentloaded'});
    await p.addStyleTag({content: appCss}); await p.addStyleTag({content: css}); await p.addStyleTag({content: NOANIM + extra});
    await p.evaluate(async () => {await document.fonts.ready;}); await p.waitForTimeout(250);
    return p;
}
const collect = (p) => p.evaluate(() => {
    const out = {};
    for (const blk of document.querySelectorAll('[data-block]')) {
        out[blk.dataset.block] = [...blk.querySelectorAll('*')].map((e, i) => {
            const b = e.getBoundingClientRect(), s = getComputedStyle(e), a = getComputedStyle(e, '::after'), bf = getComputedStyle(e, '::before');
            const inTrigger = !!e.closest('[data-slot=collapsible-trigger]') && !e.matches('[data-slot=collapsible-trigger]');
            return {i, tag: e.tagName, slot: e.dataset.slot || '', inTrigger, rect: [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)).join(','),
                style: [s.backgroundColor, s.borderTopWidth, s.borderTopColor, s.borderBottomWidth, s.borderBottomColor, s.borderTopLeftRadius, s.boxShadow, s.clipPath, s.color, s.padding, s.outline, s.position, s.zIndex].join('|'),
                after: [a.content, a.position, a.top, a.left, a.width, a.height, a.backgroundColor, a.maskImage.slice(0, 60), a.border].join('|'), before: [bf.content, bf.left, bf.top, bf.width, bf.height, bf.maskImage.slice(0, 60)].join('|')};
        });
    }
    return out;
});
const pb = await open(bundle), pa = await open(after);
const [B, A] = [await collect(pb), await collect(pa)];

/* ---- measurements on the after page ---- */
const M = await pa.evaluate(() => {
    const px = (v) => parseFloat(v);
    const pseudo = (e, which) => {const s = getComputedStyle(e, which); return {content: s.content, position: s.position, top: s.top, left: s.left, right: s.right, width: s.width, height: s.height, bg: s.backgroundColor, mask: s.maskImage.slice(0, 80), maskSize: s.maskSize, maskRepeat: s.maskRepeat, maskPos: s.maskPosition, pe: s.pointerEvents, transform: s.transform};};
    const railOf = (blk) => {const l = document.querySelector(`[data-block=${blk}] [data-slot=tabs-list]`), b = l.getBoundingClientRect(), s = getComputedStyle(l), a = pseudo(l, '::after');
        const laceTop = b.top + px(s.borderTopWidth) + px(a.top), laceLeft = b.left + px(s.borderLeftWidth) + px(a.left);
        return {rect: {x: b.x, y: b.y, w: b.width, h: b.height, bottom: b.bottom}, clip: s.clipPath, border: s.borderBottomWidth + ' ' + s.borderBottomColor, lace: a, laceTopAbs: laceTop, laceLeftAbs: laceLeft, laceTopEqualsFrameOuterBottom: Math.abs(laceTop - b.bottom) < 0.01};};
    const cardOf = (el) => {const c = el, hd = c.querySelector('[data-slot=card-header]'), tr = hd.querySelector('[data-slot=collapsible-trigger]'), ct = c.querySelector('[data-slot=card-content]');
        const cs = getComputedStyle(c), hs = getComputedStyle(hd), ts = getComputedStyle(tr), ks = getComputedStyle(ct), cb = c.getBoundingClientRect(), hb = hd.getBoundingClientRect(), kb = ct.getBoundingClientRect(), ttl = tr.querySelector('[data-fx=title]').getBoundingClientRect();
        const lace = pseudo(hd, '::after'), laceTop = hb.top + px(hs.borderTopWidth) + px(lace.top);
        const lineBottom = px(hs.borderBottomWidth) ? hb.bottom : kb.top + px(ks.borderTopWidth); /* outer (lower) edge of the title-bar bottom line */
        const frameAfter = getComputedStyle(c, '::after');
        return {card: {bg: cs.backgroundColor, radius: cs.borderTopLeftRadius, clip: cs.clipPath, shadow: cs.boxShadow, frame: px(cs.borderTopWidth) ? 'border ' + cs.borderTopWidth + ' ' + cs.borderTopColor : 'overlay ' + frameAfter.borderTopWidth + ' ' + frameAfter.borderTopColor + ' z' + frameAfter.zIndex, rect: [cb.x, cb.y, cb.width, cb.height]},
            header: {bg: hs.backgroundColor, shadow: hs.boxShadow, position: hs.position, z: hs.zIndex, bottomLine: px(hs.borderBottomWidth) ? 'header border-bottom ' + hs.borderBottomWidth + ' ' + hs.borderBottomColor : 'content border-top ' + ks.borderTopWidth + ' ' + ks.borderTopColor},
            trigger: {pad: ts.padding, radius: ts.borderTopLeftRadius, color: ts.color, position: ts.position, oldLace: getComputedStyle(tr, '::after').content},
            charm: pseudo(tr, '::before'), charmOffsetInCard: [(tr.getBoundingClientRect().x + px(getComputedStyle(tr, '::before').left)) - cb.x],
            titleOffsetInCard: +(ttl.x - cb.x).toFixed(2), lace, laceTopAbs: laceTop, lineBottom, laceTopEqualsLineOuterEdge: Math.abs(laceTop - lineBottom) < 0.01, laceInsideCard: laceTop + 8 <= cb.bottom};};
    const sc = [...document.querySelectorAll('[data-block=settings] [data-slot=card]')], tc = [...document.querySelectorAll('[data-block=tools] [data-slot=card]')];
    return {rail: {settings: railOf('settings'), tools: railOf('tools')}, cards: {settings: sc.map(cardOf), tools: tc.map(cardOf)}};
});

/* ---- assertions ---- */
const fails = [], ok = (cond, msg) => {if (!cond) fails.push(msg);};
const geoDiff = (blk, filter = () => true) => A[blk].filter((e, i) => filter(e) && e.rect !== B[blk][i].rect).map((e) => `${e.tag}[${e.slot}] ${B[blk][e.i].rect} -> ${e.rect}`);
const styleDiff = (blk) => A[blk].filter((e, i) => e.style !== B[blk][i].style || e.after !== B[blk][i].after || e.before !== B[blk][i].before).length;
const g = {settings: geoDiff('settings', (e) => !e.inTrigger), tools: geoDiff('tools', (e) => !e.inTrigger), toolsTriggerText: geoDiff('tools', (e) => e.inTrigger), other: geoDiff('other'), decoy: geoDiff('decoy')};
ok(!g.settings.length, 'settings geometry changed: ' + g.settings.slice(0, 3));
ok(!g.tools.length, 'tools geometry changed: ' + g.tools.slice(0, 3));
ok(!g.other.length && !styleDiff('other'), 'other-similar changed');
ok(!g.decoy.length && !styleDiff('decoy'), 'decoy changed');
const sR = M.rail.settings, tR = M.rail.tools;
for (const [n, rl] of [['settings', sR], ['tools', tR]]) {
    ok(rl.laceTopEqualsFrameOuterBottom, n + ' rail lace top != frame outer bottom');
    ok(rl.lace.height === '8px' && rl.lace.maskRepeat.startsWith('repeat-x') && rl.lace.transform === 'none', n + ' rail lace props');
    ok(rl.clip.includes('calc(100% + 8px)'), n + ' rail clip not opened');
}
for (const k of ['content', 'position', 'left', 'right', 'top', 'height', 'bg', 'mask', 'maskSize', 'maskRepeat', 'maskPos', 'pe', 'transform']) ok(k === 'top' ? sR.laceTopAbs - sR.rect.bottom === tR.laceTopAbs - tR.rect.bottom : sR.lace[k] === tR.lace[k], 'rail lace ' + k + ' differs');
const s0 = M.cards.settings[0], t0 = M.cards.tools[0];
for (const c of [...M.cards.settings, ...M.cards.tools]) {ok(c.laceTopEqualsLineOuterEdge, 'card lace top != title line outer edge'); ok(c.laceInsideCard, 'card lace outside card clip'); ok(c.trigger.oldLace === 'none', 'old inner lace still on');}
for (const k of ['bg', 'radius', 'clip', 'shadow']) ok(s0.card[k] === t0.card[k], 'card ' + k + ' differs');
for (const k of ['bg', 'shadow', 'position', 'z']) ok(s0.header[k] === t0.header[k], 'header ' + k + ' differs');
for (const k of ['pad', 'radius', 'color', 'position']) ok(s0.trigger[k] === t0.trigger[k], 'trigger ' + k + ' differs');
for (const k of Object.keys(s0.charm).filter((k) => k !== 'right')) ok(s0.charm[k] === t0.charm[k], 'charm ' + k + ' differs');
for (const k of ['content', 'position', 'left', 'right', 'height', 'bg', 'mask', 'maskSize', 'maskRepeat', 'maskPos', 'pe', 'transform']) ok(s0.lace[k] === t0.lace[k], 'card lace ' + k + ' differs: ' + s0.lace[k] + ' / ' + t0.lace[k]);

/* ---- pixels: lace head on the line, tails outward, nothing drawn after the tails ---- */
const HIDE = '[data-slot=tabs-list]::after,[data-slot=card-header]::after{visibility:hidden!important}';
const ph = await open(after, 1, HIDE);
async function raw(p, clip) {const buf = await p.screenshot({clip}); const {data, info} = await sharp(buf).raw().toBuffer({resolveWithObject: true}); return {data, w: info.width, ch: info.channels};}
async function laceProfile(x, y, w) {
    const clip = {x, y: y - 2, width: w, height: 13};
    const [on, off] = [await raw(pa, clip), await raw(ph, clip)];
    const rows = [];
    for (let ry = 0; ry < 13; ry++) {let n = 0; const cols = []; for (let rx = 0; rx < on.w; rx++) {const o = (ry * on.w + rx) * on.ch; const d = Math.abs(on.data[o] - off.data[o]) + Math.abs(on.data[o + 1] - off.data[o + 1]) + Math.abs(on.data[o + 2] - off.data[o + 2]); if (d > 12) {n++; cols.push(rx);}} rows.push({dy: ry - 2, cover: +(n / on.w).toFixed(2), cols: ry === 9 ? cols.slice(0, 6) : undefined});}
    /* line row (dy -1) colour, and first row after lace (dy 8) colour, from the lace-on image */
    const px = (ry, rx) => {const o = (ry * on.w + rx) * on.ch; return `rgb(${on.data[o]},${on.data[o + 1]},${on.data[o + 2]})`;};
    return {rows, lineRow: px(1, 6), afterTailRow: px(10, 6), afterTailMid: px(10, 8)};
}
const prof = {
    settingsRail: await laceProfile(Math.round(sR.laceLeftAbs), Math.round(sR.laceTopAbs), 64),
    toolsRail: await laceProfile(Math.round(tR.laceLeftAbs), Math.round(tR.laceTopAbs), 64),
    settingsCard: await laceProfile(Math.round(s0.card.rect[0]) + 1, Math.round(s0.laceTopAbs), 64),
    toolsCard: await laceProfile(Math.round(t0.card.rect[0]) + 1, Math.round(t0.laceTopAbs), 64)};
for (const [n, p] of Object.entries(prof)) {
    const row = (dy) => p.rows.find((r) => r.dy === dy).cover;
    ok(row(-1) === 0 && row(-2) === 0, n + ': lace drawn on/above the line');
    ok(row(0) >= 0.95 && row(1) >= 0.95, n + ': head band not continuous on the line');
    ok([0, 1, 2, 3, 4, 5, 6].every((d) => row(d + 1) <= row(d)) && row(7) <= 0.6 && row(7) > 0.05, n + ': tails not narrowing downward');
    ok(row(8) === 0, n + ': something below tails');
}
await ph.close();

/* ---- screenshots ---- */
const shots = {};
for (const [tag, p] of [['before', pb], ['after', pa]]) for (const blk of ['settings', 'tools', 'other', 'decoy']) {
    const f = path.join(here, `${blk}-${tag}.png`); await p.locator(`[data-block=${blk}]`).screenshot({path: f}); shots[`${blk}-${tag}`] = f;}
const z = await open(after, 4);
const zoomAt = async (name, x, y, w, hh) => {const f = path.join(here, name + '.png'); await z.screenshot({path: f, clip: {x, y, width: w, height: hh}}); shots[name] = f;};
await zoomAt('zoom4-settings-rail-lace', sR.rect.x - 6, sR.rect.bottom - 28, sR.rect.w + 12, 44);
await zoomAt('zoom4-tools-rail-lace', tR.rect.x - 6, tR.rect.bottom - 28, tR.rect.w + 12, 44);
await zoomAt('zoom4-settings-card-head', s0.card.rect[0] - 4, s0.card.rect[1] - 4, 300, 70);
await zoomAt('zoom4-tools-card-head', t0.card.rect[0] - 4, t0.card.rect[1] - 4, 300, 70);
const zb = await open(bundle, 4);
for (const [n, r0, isRail] of [['settings-rail', sR, 1], ['tools-rail', tR, 1], ['settings-card-head', s0, 0], ['tools-card-head', t0, 0]]) {
    const f = path.join(here, 'zoom4-before-' + n + '.png');
    await zb.screenshot({path: f, clip: isRail ? {x: r0.rect.x - 6, y: r0.rect.bottom - 28, width: r0.rect.w + 12, height: 44} : {x: r0.card.rect[0] - 4, y: r0.card.rect[1] - 4, width: 300, height: 70}}); shots['zoom4-before-' + n] = f;}
await browser.close();
const report = {pass: !fails.length, fails, geometry: g, measure: M, laceProfiles: prof, bytes: Buffer.byteLength(mine), shots};
await fs.writeFile(path.join(here, 'report.json'), JSON.stringify(report, null, 1) + '\n');
console.log(JSON.stringify({pass: report.pass, fails, bytes: report.bytes, geometry: {settings: g.settings.length, tools: g.tools.length, toolsTriggerText: g.toolsTriggerText, other: g.other.length, decoy: g.decoy.length}}, null, 1));
process.exit(fails.length ? 1 : 0);
