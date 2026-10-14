import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const cssPath = path.join(root, 'favorites-r9.css');
const themePath = process.env.JIRAI_THEME_CSS || '/tmp/jirai-r9-out-badge/jirai-kei-theme/theme.css';
const css = await fs.readFile(cssPath, 'utf8');
const themeCss = await fs.readFile(themePath, 'utf8');
const fixturePath = path.join(here, 'fixture.html');
const fixture = await fs.readFile(fixturePath, 'utf8');

if (/@import\b/i.test(css) || /url\(\s*["']?https?:/i.test(css)) {
    throw new Error('favorites-r9.css must not import or request remote assets');
}
if (/https?:\/\//i.test(fixture)) {
    throw new Error('fixture must not contain remote URLs');
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1360, height: 980 }, deviceScaleFactor: 1 });
const out = here;
await page.setContent(fixture, { waitUntil: 'domcontentloaded' });
await page.addStyleTag({ content: themeCss });
await page.evaluate(() => document.fonts.ready);

const before = await page.evaluate(() => {
    const targets = {
        friendRow: '#favorites-friend-groups [class~="group/rail-row"]',
        friendCreate: '#favorites-friend-groups button[class~="border-dashed"]',
        friendHandle: '#favorites-friend-splitter > [data-slot="resizable-handle"]',
        friendCard: '#favorites-friend-content [class~="group/tile"]',
        friendCheck: '#favorites-friend-content [data-slot="checkbox"]',
        avatar: '#favorites-friend-content .friend-avatar',
        worldRow: '#favorites-world-groups [class~="group/rail-row"]',
        worldCreate: '#favorites-world-groups button[class~="border-dashed"]',
        worldHandle: '#favorites-world-splitter > [data-slot="resizable-handle"]',
        worldCard: '#favorites-world-content [class~="group/tile"]',
        worldCheck: '#favorites-world-content [data-slot="checkbox"]',
        worldBadge: '#favorites-world-content .player-count',
        decoyCard: '#decoy-content .decoy-card',
        decoyCreate: '#decoy-groups button[class~="border-dashed"]'
    };
    const rects = {};
    for (const [key, selector] of Object.entries(targets)) {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Fixture selector missing before CSS: ${key} ${selector}`);
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        rects[key] = {
            x: rect.x + window.scrollX, y: rect.y + window.scrollY, width: rect.width, height: rect.height,
            borderRadius: style.borderRadius,
            borderStyle: style.borderStyle,
            borderColor: style.borderColor,
            backgroundColor: style.backgroundColor
        };
    }
    const handle = document.querySelector('#favorites-world-splitter > [data-slot="resizable-handle"]');
    const handleAfter = getComputedStyle(handle, '::after');
    const unselectedRow = document.querySelector('#favorites-friend-groups [class~="group/rail-row"]:not([class~="bg-(--state-selected-surface)"])');
    const unselectedButton = unselectedRow.querySelector(':scope > [data-slot="button"]');
    const unselectedColors = { icon:getComputedStyle(unselectedButton.querySelector('svg.text-muted-foreground')).color, count:getComputedStyle(unselectedButton.querySelector('[class~="tabular-nums"]')).color };
    const decoy = {
        card: getComputedStyle(document.querySelector('#decoy-content .decoy-card')).borderRadius,
        create: getComputedStyle(document.querySelector('#decoy-groups button[class~="border-dashed"]')).borderRadius
    };
    return {
        rects,
        handleHit: { width: handle.getBoundingClientRect().width, afterWidth: handleAfter.width, afterHeight: handleAfter.height },
        avatarRadius: getComputedStyle(document.querySelector('.friend-avatar')).borderRadius,
        unselectedColors,
        decoy
    };
});

await page.locator('#friend-page').screenshot({ path: path.join(out, 'before-friends-review.png') });
await page.locator('#world-page').screenshot({ path: path.join(out, 'before-world-review.png') });
await page.addStyleTag({ content: css });
await page.evaluate(() => document.fonts.ready);

const result = await page.evaluate(() => {
    const colorToRgb = (value) => {
        const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (!match) throw new Error(`Cannot parse computed color: ${value}`);
        return match.slice(1, 4).map(Number);
    };
    const luminance = (rgb) => {
        const values = rgb.map((component) => {
            const c = component / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
    };
    const contrast = (foreground, background) => {
        const a = luminance(colorToRgb(foreground));
        const b = luminance(colorToRgb(background));
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    const rect = (selector) => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Missing after-CSS target: ${selector}`);
        const r = element.getBoundingClientRect();
        const s = getComputedStyle(element);
        return { x:r.x + window.scrollX, y:r.y + window.scrollY, width:r.width, height:r.height, borderRadius:s.borderRadius, borderStyle:s.borderStyle, borderColor:s.borderColor, backgroundColor:s.backgroundColor };
    };
    const selectors = {
        friendRow: '#favorites-friend-groups [class~="group/rail-row"]',
        friendCreate: '#favorites-friend-groups button[class~="border-dashed"]',
        friendHandle: '#favorites-friend-splitter > [data-slot="resizable-handle"]',
        friendCard: '#favorites-friend-content [class~="group/tile"]',
        friendCheck: '#favorites-friend-content [data-slot="checkbox"]',
        avatar: '#favorites-friend-content .friend-avatar',
        worldRow: '#favorites-world-groups [class~="group/rail-row"]',
        worldCreate: '#favorites-world-groups button[class~="border-dashed"]',
        worldHandle: '#favorites-world-splitter > [data-slot="resizable-handle"]',
        worldCard: '#favorites-world-content [class~="group/tile"]',
        worldCheck: '#favorites-world-content [data-slot="checkbox"]',
        worldBadge: '#favorites-world-content .player-count',
        decoyCard: '#decoy-content .decoy-card',
        decoyCreate: '#decoy-groups button[class~="border-dashed"]'
    };
    const rects = Object.fromEntries(Object.entries(selectors).map(([key, selector]) => [key, rect(selector)]));
    const selectedRow = document.querySelector('#favorites-friend-groups [class~="group/rail-row"][class~="bg-(--state-selected-surface)"]');
    const selectedWorldRow = document.querySelector('#favorites-world-groups [class~="group/rail-row"][class~="bg-(--state-selected-surface)"]');
    const selectedRowButton = selectedRow.querySelector('[data-slot="button"]');
    const sectionBadge = document.querySelector('#favorites-world-groups [data-slot="badge"]');
    const create = document.querySelector('#favorites-world-groups button[class~="border-dashed"]');
    const checkboxStates = [...document.querySelectorAll('#favorites-world-content [data-slot="checkbox"]')].slice(0, 2).map((element) => {
        const s = getComputedStyle(element);
        return { checked:element.matches('[data-checked],[aria-checked="true"]'), width:s.width, height:s.height, borderRadius:s.borderRadius, backgroundColor:s.backgroundColor, borderColor:s.borderColor };
    });
    const handle = document.querySelector('#favorites-world-splitter > [data-slot="resizable-handle"]');
    const grip = handle.querySelector(':scope > div');
    const dot = document.querySelector('#favorites-world-content .player-count .online-dot');
    const dotStyle = getComputedStyle(dot);
    const selectedWorldCard = document.querySelector('#favorites-world-content .world-tile[class~="border-object-selected-border"]');
    const idleWorldCard = [...document.querySelectorAll('#favorites-world-content .world-tile')].find((card) => !card.classList.contains('border-object-selected-border'));
    const selectedBadge = selectedWorldCard.querySelector('.player-count');
    const idleBadge = idleWorldCard.querySelector('.player-count');
    const badgeSourceState = {
        sourcePosition:{ left:getComputedStyle(idleBadge).left, top:getComputedStyle(idleBadge).top, right:getComputedStyle(idleBadge).right },
        selected:{ badgeOpacity:getComputedStyle(selectedBadge).opacity, checkboxOpacity:getComputedStyle(selectedWorldCard.querySelector('.selection-toggle')).opacity },
        idle:{ badgeOpacity:getComputedStyle(idleBadge).opacity, checkboxOpacity:getComputedStyle(idleWorldCard.querySelector('.selection-toggle')).opacity }
    };
    const railNameProbe = (panelSelector, labelText) => {
        const row = [...document.querySelectorAll(`${panelSelector} [class~="group/rail-row"]`)].find((item) => item.querySelector('span[class~="truncate"]')?.textContent.trim() === labelText);
        if (!row) throw new Error(`Missing source long-name probe: ${labelText}`);
        const label = row.querySelector('span[class~="truncate"]');
        const count = row.querySelector('span[class~="tabular-nums"]');
        const button = row.querySelector(':scope > [data-slot="button"]');
        const menu = row.querySelector(':scope > .group-menu button[data-size="icon-xs"]');
        const labelRect = label.getBoundingClientRect();
        const countRect = count.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const menuRect = menu?.getBoundingClientRect();
        const style = getComputedStyle(label);
        return { whiteSpace:style.whiteSpace, overflow:style.overflow, textOverflow:style.textOverflow, labelHeight:labelRect.height, lineHeight:parseFloat(style.lineHeight), labelRight:labelRect.right, countLeft:countRect.left, countRight:countRect.right, buttonRight:buttonRect.right, countEndGap:buttonRect.right-countRect.right, menu:menuRect ? {width:menuRect.width,height:menuRect.height,left:menuRect.left,opacity:getComputedStyle(menu.parentElement).opacity} : null, countClearsMenu:!menuRect || countRect.right <= menuRect.left };
    };
    const railNameProbes = {
        'VRC+ Group 2':railNameProbe('#favorites-world-groups','VRC+ Group 2'),
        'dormir / avatar':railNameProbe('#favorites-friend-groups','dormir / avatar')
    };
    const avatar = document.querySelector('#favorites-friend-content .friend-avatar');
    const selectedTextStyle = getComputedStyle(selectedRowButton);
    const selectedBg = getComputedStyle(selectedRow).backgroundColor;
    const describeSelectedRail = (row) => {
        const button = row.querySelector(':scope > [data-slot="button"]');
        const icon = button.querySelector('svg.text-muted-foreground');
        const count = button.querySelector('[class~="tabular-nums"]');
        const background = getComputedStyle(row).backgroundColor;
        const iconColor = getComputedStyle(icon).color;
        const countColor = getComputedStyle(count).color;
        return { background, name:getComputedStyle(button.querySelector('span[class~="truncate"]')).color, iconColor, countColor, iconContrast:contrast(iconColor,background), countContrast:contrast(countColor,background) };
    };
    const selectedRailDetails = { friend:describeSelectedRail(selectedRow), world:describeSelectedRail(selectedWorldRow) };
    const unselectedFriendRow = document.querySelector('#favorites-friend-groups [class~="group/rail-row"]:not([class~="bg-(--state-selected-surface)"])');
    const unselectedFriendButton = unselectedFriendRow.querySelector(':scope > [data-slot="button"]');
    const unselectedColors = { icon:getComputedStyle(unselectedFriendButton.querySelector('svg.text-muted-foreground')).color, count:getComputedStyle(unselectedFriendButton.querySelector('[class~="tabular-nums"]')).color };
    const badgeStyle = getComputedStyle(sectionBadge);
    const createStyle = getComputedStyle(create);
    const worldBadgeStyle = getComputedStyle(document.querySelector('#favorites-world-content .player-count'));
    const marker = getComputedStyle(document.querySelector('#favorites-world-groups .rail-header > span'), '::before');
    const activeAnimations = document.getAnimations({ subtree:true }).filter((animation) => animation.playState === 'running').length;
    return {
        rects,
        groupSelected: { background:selectedBg, foreground:selectedTextStyle.color, radius:getComputedStyle(selectedRow).borderRadius },
        selectedRailDetails,
        unselectedColors,
        createStyle: { borderStyle:createStyle.borderStyle, borderColor:createStyle.borderColor, background:createStyle.backgroundColor, color:createStyle.color },
        sectionBadge: { background:badgeStyle.backgroundColor, foreground:badgeStyle.color, radius:badgeStyle.borderRadius },
        worldBadge: { background:worldBadgeStyle.backgroundColor, foreground:worldBadgeStyle.color, radius:worldBadgeStyle.borderRadius },
        checkboxStates,
        handle: {
            width:handle.getBoundingClientRect().width,
            afterWidth:getComputedStyle(handle,'::after').width,
            afterHeight:getComputedStyle(handle,'::after').height,
            gripWidth:getComputedStyle(grip).width,
            gripHeight:getComputedStyle(grip).height,
            gripRadius:getComputedStyle(grip).borderRadius,
            gripBackground:getComputedStyle(grip).backgroundColor,
            gripImage:getComputedStyle(grip).backgroundImage,
            hitBoxWidth:getComputedStyle(handle,'::after').width
        },
        onlineDot: { width:dotStyle.width, height:dotStyle.height, radius:dotStyle.borderRadius, background:dotStyle.backgroundColor },
        badgeSourceState,
        railNameProbes,
        avatarRadius:getComputedStyle(avatar).borderRadius,
        marker: { content:marker.content, width:marker.width, height:marker.height, background:marker.backgroundColor },
        contrast: {
            selectedGroup:contrast(selectedTextStyle.color,selectedBg),
            selectedFriendCount:selectedRailDetails.friend.countContrast,
            selectedFriendIcon:selectedRailDetails.friend.iconContrast,
            selectedWorldCount:selectedRailDetails.world.countContrast,
            selectedWorldIcon:selectedRailDetails.world.iconContrast,
            groupCount:contrast(badgeStyle.color,badgeStyle.backgroundColor),
            create:contrast(createStyle.color,createStyle.backgroundColor),
            onlineCount:contrast(worldBadgeStyle.color,worldBadgeStyle.backgroundColor)
        },
        activeAnimations
    };
});

await page.locator('#friend-page').screenshot({ path: path.join(out, 'after-friends-review.png') });
await page.locator('#world-page').screenshot({ path: path.join(out, 'world-idle-r9.5-review.png') });
await page.locator('#favorites-world-content .world-tile:not([class~="border-object-selected-border"])').first().hover();
const worldCheckboxHover = await page.locator('#favorites-world-content .world-tile:not([class~="border-object-selected-border"])').first().evaluate((card) => ({ badgeOpacity:getComputedStyle(card.querySelector('.player-count')).opacity, checkboxOpacity:getComputedStyle(card.querySelector('.selection-toggle')).opacity }));
if (worldCheckboxHover.badgeOpacity !== '0' || worldCheckboxHover.checkboxOpacity !== '1') throw new Error(`Hover source state should hide badge as checkbox appears: ${JSON.stringify(worldCheckboxHover)}`);
await page.locator('#world-page').screenshot({ path:path.join(out,'world-checkbox-hover-r9.5-review.png') });
await page.mouse.move(0,0);
await page.locator('#decoy-page').screenshot({ path: path.join(out, 'decoy-review.png') });

const after = await page.evaluate(() => {
    const rects = {};
    const selectors = {
        friendRow:'#favorites-friend-groups [class~="group/rail-row"]',
        friendCreate:'#favorites-friend-groups button[class~="border-dashed"]',
        friendHandle:'#favorites-friend-splitter > [data-slot="resizable-handle"]',
        friendCard:'#favorites-friend-content [class~="group/tile"]',
        friendCheck:'#favorites-friend-content [data-slot="checkbox"]',
        avatar:'#favorites-friend-content .friend-avatar',
        worldRow:'#favorites-world-groups [class~="group/rail-row"]',
        worldCreate:'#favorites-world-groups button[class~="border-dashed"]',
        worldHandle:'#favorites-world-splitter > [data-slot="resizable-handle"]',
        worldCard:'#favorites-world-content [class~="group/tile"]',
        worldCheck:'#favorites-world-content [data-slot="checkbox"]',
        worldBadge:'#favorites-world-content .player-count',
        decoyCard:'#decoy-content .decoy-card',
        decoyCreate:'#decoy-groups button[class~="border-dashed"]'
    };
    for (const [key,selector] of Object.entries(selectors)) {
        const element = document.querySelector(selector);
        const r = element.getBoundingClientRect();
        const s = getComputedStyle(element);
        rects[key] = { x:r.x + window.scrollX,y:r.y + window.scrollY,width:r.width,height:r.height,borderRadius:s.borderRadius,borderStyle:s.borderStyle,borderColor:s.borderColor,backgroundColor:s.backgroundColor };
    }
    const handle = document.querySelector('#favorites-world-splitter > [data-slot="resizable-handle"]');
    return {
        rects,
        handleHit:{ width:handle.getBoundingClientRect().width, afterWidth:getComputedStyle(handle,'::after').width, afterHeight:getComputedStyle(handle,'::after').height },
        avatarRadius:getComputedStyle(document.querySelector('.friend-avatar')).borderRadius,
        decoy:{ card:getComputedStyle(document.querySelector('#decoy-content .decoy-card')).borderRadius, create:getComputedStyle(document.querySelector('#decoy-groups button[class~="border-dashed"]')).borderRadius }
    };
});

const geometry = {};
for (const key of Object.keys(before.rects)) {
    const a = before.rects[key];
    const b = after.rects[key];
    geometry[key] = Object.fromEntries(['x','y','width','height'].map((axis) => [axis, Math.abs(a[axis] - b[axis])]));
}
const maxGeometryDelta = Math.max(...Object.values(geometry).flatMap((deltas) => Object.values(deltas)));
if (maxGeometryDelta > 2) throw new Error(`Favorites styling moved/resized source geometry by >2px: ${JSON.stringify(geometry)}`);
if (JSON.stringify(before.handleHit) !== JSON.stringify(after.handleHit)) throw new Error(`Resize hitbox changed: before=${JSON.stringify(before.handleHit)} after=${JSON.stringify(after.handleHit)}`);
if (before.avatarRadius !== after.avatarRadius || result.avatarRadius !== before.avatarRadius) throw new Error(`Avatar shape changed: before=${before.avatarRadius} after=${after.avatarRadius}`);
if (JSON.stringify(before.decoy) !== JSON.stringify(after.decoy)) throw new Error(`Decoy page was styled: before=${JSON.stringify(before.decoy)} after=${JSON.stringify(after.decoy)}`);
if (result.groupSelected.background !== 'rgb(255, 184, 230)' || result.groupSelected.foreground !== 'rgb(22, 17, 42)' || result.groupSelected.radius !== '0px') throw new Error(`Selected rail state did not match pixel theme: ${JSON.stringify(result.groupSelected)}`);
for (const [kind,detail] of Object.entries(result.selectedRailDetails)) {
    if (detail.background !== 'rgb(255, 184, 230)' || detail.countColor !== 'rgb(22, 17, 42)' || detail.iconColor !== 'rgb(22, 17, 42)' || detail.countContrast < 4.5 || detail.iconContrast < 4.5) throw new Error(`Selected ${kind} rail count/icon contrast below 4.5:1: ${JSON.stringify(detail)}`);
}
if (JSON.stringify(before.unselectedColors) !== JSON.stringify(result.unselectedColors)) throw new Error(`Unselected rail count/icon colors changed: before=${JSON.stringify(before.unselectedColors)} after=${JSON.stringify(result.unselectedColors)}`);
if (result.createStyle.borderStyle !== 'dotted') throw new Error(`Create button is not pixel-dotted: ${JSON.stringify(result.createStyle)}`);
if (result.sectionBadge.radius !== '0px' || result.worldBadge.radius !== '0px') throw new Error(`Count badges are not square: ${JSON.stringify({section:result.sectionBadge,world:result.worldBadge})}`);
if (result.checkboxStates.length < 2 || result.checkboxStates[0].backgroundColor !== 'rgb(255, 184, 230)' || result.checkboxStates[1].backgroundColor !== 'rgb(32, 25, 54)' || result.checkboxStates.some((state) => state.width !== '16px' || state.height !== '16px' || state.borderRadius !== '0px')) throw new Error(`Checkbox states/geometry incorrect: ${JSON.stringify(result.checkboxStates)}`);
if (result.handle.width !== 1 || result.handle.afterWidth !== '4px' || result.handle.hitBoxWidth !== '4px' || result.handle.gripWidth !== '4px' || result.handle.gripRadius !== '0px' || result.handle.gripBackground !== 'rgb(108, 92, 224)' || !result.handle.gripImage.includes('linear-gradient')) throw new Error(`Resize grip visual/hitbox mismatch: ${JSON.stringify(result.handle)}`);
if (result.onlineDot.width !== '6px' || result.onlineDot.height !== '6px' || result.onlineDot.radius !== '0px' || result.onlineDot.background !== 'rgb(111, 227, 211)') throw new Error(`Online dot should be square while retaining status green: ${JSON.stringify(result.onlineDot)}`);
if (result.badgeSourceState.sourcePosition.left !== '6px' || result.badgeSourceState.sourcePosition.top !== '6px') throw new Error(`Online count badge moved from FavoriteCardView source position: ${JSON.stringify(result.badgeSourceState.sourcePosition)}`);
if (result.badgeSourceState.selected.badgeOpacity !== '0' || result.badgeSourceState.selected.checkboxOpacity !== '1' || result.badgeSourceState.idle.badgeOpacity !== '1' || result.badgeSourceState.idle.checkboxOpacity !== '0') throw new Error(`Source selection/badge visibility states overlap: ${JSON.stringify(result.badgeSourceState)}`);
for (const [name,probe] of Object.entries(result.railNameProbes)) {
    if (probe.whiteSpace !== 'nowrap' || probe.overflow !== 'hidden' || probe.textOverflow !== 'ellipsis' || probe.labelHeight > 24 || probe.labelRight > probe.countLeft || probe.countEndGap < 0 || probe.countEndGap > 12 || !probe.countClearsMenu || (probe.menu && (probe.menu.width !== 24 || probe.menu.height !== 24 || probe.menu.opacity !== '0'))) throw new Error(`Favorite group row layout failed for ${name}: ${JSON.stringify(probe)}`);
}
if (Object.values(result.contrast).some((ratio) => ratio < 4.5)) throw new Error(`Text contrast below 4.5:1: ${JSON.stringify(result.contrast)}`);
if (!result.marker.content || result.marker.content === 'none' || result.marker.width !== '6px' || result.marker.height !== '6px') throw new Error(`Section pixel marker missing: ${JSON.stringify(result.marker)}`);
if (result.activeAnimations > 6) throw new Error(`Favorites fixture exceeds R9 animation ceiling: ${result.activeAnimations}`);

const longNameRow = page.locator('#favorites-world-groups [class~="group/rail-row"]').filter({hasText:'VRC+ Group 2'});
await longNameRow.hover();
const rowHover = await longNameRow.evaluate((element) => getComputedStyle(element).backgroundColor);
const groupMenuHover = await longNameRow.evaluate((row) => { const button=row.querySelector('.group-menu button[data-size="icon-xs"]'); const rect=button.getBoundingClientRect(); return { background:getComputedStyle(row).backgroundColor, opacity:getComputedStyle(button.parentElement).opacity, width:rect.width, height:rect.height, countClearsMenu:row.querySelector('.count').getBoundingClientRect().right <= rect.left }; });
if (rowHover !== 'rgb(42, 33, 71)' || groupMenuHover.opacity !== '1' || groupMenuHover.width !== 24 || groupMenuHover.height !== 24 || !groupMenuHover.countClearsMenu) throw new Error(`Unselected long-name row/menu hover state incorrect: ${JSON.stringify({rowHover,groupMenuHover})}`);
await page.locator('#favorites-world-groups button[class~="border-dashed"]').hover();
const createHover = await page.locator('#favorites-world-groups button[class~="border-dashed"]').evaluate((element) => ({ background:getComputedStyle(element).backgroundColor, color:getComputedStyle(element).color }));
if (createHover.background !== 'rgb(255, 184, 230)' || createHover.color !== 'rgb(22, 17, 42)') throw new Error(`Create-button hover state incorrect: ${JSON.stringify(createHover)}`);
const handleLocator = page.locator('#favorites-world-splitter > [data-slot="resizable-handle"]');
await handleLocator.hover();
await page.mouse.down();
await page.locator('#world-page').screenshot({ path:path.join(out,'handle-drag-review.png') });
const handleDrag = await handleLocator.evaluate((element) => ({ active:element.matches(':active'), gripBackground:getComputedStyle(element.querySelector(':scope > div')).backgroundColor, gripBorder:getComputedStyle(element.querySelector(':scope > div')).borderColor, hitWidth:getComputedStyle(element,'::after').width }));
await page.mouse.up();
if (!handleDrag.active || handleDrag.gripBackground !== 'rgb(255, 184, 230)' || handleDrag.gripBorder !== 'rgb(255, 127, 207)' || handleDrag.hitWidth !== '4px') throw new Error(`Handle drag highlight or hit zone incorrect: ${JSON.stringify(handleDrag)}`);

await page.keyboard.press('Tab'); // establish keyboard modality before focusing the create control
const focus = await page.locator('#favorites-world-groups button[class~="border-dashed"]').evaluate((element) => {
    element.focus();
    const style = getComputedStyle(element);
    return { focusVisible:element.matches(':focus-visible'), outlineStyle:style.outlineStyle, outlineWidth:style.outlineWidth, outlineColor:style.outlineColor };
});
if (!focus.focusVisible || focus.outlineStyle !== 'solid' || focus.outlineWidth !== '2px' || focus.outlineColor !== 'rgb(255, 127, 207)') throw new Error(`Keyboard focus ring not visible: ${JSON.stringify(focus)}`);

await page.emulateMedia({ reducedMotion:'reduce' });
const reduced = await page.locator('#favorites-world-content [class~="group/tile"]').first().evaluate((element) => ({ animationName:getComputedStyle(element).animationName, transitionDuration:getComputedStyle(element).transitionDuration, running:element.getAnimations({subtree:true}).filter((a)=>a.playState==='running').length }));
if (reduced.animationName !== 'none' || reduced.transitionDuration !== '0s' || reduced.running !== 0) throw new Error(`prefers-reduced-motion did not remain static: ${JSON.stringify(reduced)}`);
await page.emulateMedia({ reducedMotion:'no-preference' });
await page.locator('html').evaluate((element) => element.classList.add('reduce-effects'));
const reduceEffects = await page.locator('#favorites-world-content [class~="group/tile"]').first().evaluate((element) => ({ animationName:getComputedStyle(element).animationName, transitionDuration:getComputedStyle(element).transitionDuration, running:element.getAnimations({subtree:true}).filter((a)=>a.playState==='running').length }));
if (reduceEffects.animationName !== 'none' || reduceEffects.transitionDuration !== '0s' || reduceEffects.running !== 0) throw new Error(`html.reduce-effects did not remain static: ${JSON.stringify(reduceEffects)}`);

await page.setViewportSize({ width:1180, height:900 });
const narrow = await page.evaluate(() => ({ viewport:document.documentElement.clientWidth, document:document.documentElement.scrollWidth, friend:document.querySelector('#friend-page').getBoundingClientRect().width, world:document.querySelector('#world-page').getBoundingClientRect().width }));
if (narrow.document > narrow.viewport + 1) throw new Error(`Narrow desktop viewport overflows horizontally: ${JSON.stringify(narrow)}`);

const detailPage = await browser.newPage({ viewport:{width:1360,height:980}, deviceScaleFactor:2 });
await detailPage.setContent(fixture, { waitUntil:'domcontentloaded' });
await detailPage.addStyleTag({ content:themeCss });
await detailPage.addStyleTag({ content:css });
await detailPage.evaluate(() => document.fonts.ready);
await detailPage.locator('#favorites-world-groups [class~="group/rail-row"][class~="bg-(--state-selected-surface)"]').screenshot({ path:path.join(out,'selected-rail-closeup-r2.png'), scale:'device' });
await detailPage.close();

const report = {
    fixture:'NOT WINDOWS; source-shaped GroupMenu/checkbox visibility states with fabricated friend/world rows and a decoy page',
    themeCss:themePath,
    cssBytes:Buffer.byteLength(css),
    remoteAssets:0,
    scope:'favorites-${kind}-splitter + resizable handle slot; decoy splitter excluded',
    geometry,
    maxGeometryDeltaPx:maxGeometryDelta,
    resizeHitbox:{ before:before.handleHit, after:after.handleHit },
    selectedRail:result.groupSelected,
    selectedRailDetails:result.selectedRailDetails,
    unselectedRailColors:{ before:before.unselectedColors, after:result.unselectedColors },
    createButton:result.createStyle,
    countBadges:{ section:result.sectionBadge, world:result.worldBadge },
    checkboxStates:result.checkboxStates,
    handle:result.handle,
    onlineDot:result.onlineDot,
    badgeSourceState:result.badgeSourceState,
    worldCheckboxHover,
    railNameProbes:result.railNameProbes,
    avatarRadius:result.avatarRadius,
    sectionMarker:result.marker,
    contrast:result.contrast,
    focus,
    hover:{ rail:rowHover, groupMenu:groupMenuHover, create:createHover, handleDrag },
    reducedMotion:reduced,
    reduceEffects,
    fixtureAnimations:result.activeAnimations,
    narrowViewport:narrow,
    decoyUnchanged:before.decoy,
    screenshots:['before-friends-review.png','after-friends-review.png','before-world-review.png','world-idle-r9.5-review.png','world-checkbox-hover-r9.5-review.png','handle-drag-review.png','decoy-review.png','selected-rail-closeup-r2.png']
};
await fs.writeFile(path.join(out, 'verify-output.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
console.log('PASS: source GroupMenu 24px + long-name truncation / original badge anchor + mutually exclusive checkbox states / ≤2px geometry / focus / contrast / hitbox / avatar / decoy / reduced motion');
await browser.close();
