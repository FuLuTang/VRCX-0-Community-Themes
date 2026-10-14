/* Structural/style-policy fallback when the local Playwright browser binary is unavailable. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire('/home/fulutang/Documents/Github/VRCX-0-jirai/package.json');
const postcss = require('postcss');
const { JSDOM } = require('jsdom');
const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const [html, groupHtml, css, popupsR9Css, windoseRuntimeCss] = await Promise.all([
  fs.readFile(path.join(here, 'fixture.html'), 'utf8'),
  fs.readFile(path.join(here, 'group-avatar.html'), 'utf8'),
  fs.readFile(path.join(runtime, 'avatars-status-r9.css'), 'utf8'),
  fs.readFile(path.join(runtime, 'popups-r9.css'), 'utf8'),
  fs.readFile(path.join(runtime, 'windose-runtime.css'), 'utf8')
]);
const cutMatch = windoseRuntimeCss.match(/--wd-avatar-cut\s*:\s*([^;]+);/);
const smallCutMatch = windoseRuntimeCss.match(/--wd-avatar-cut-sm\s*:\s*([^;]+);/);
if (!cutMatch || !smallCutMatch) throw new Error('Could not read both avatar-cut tokens from windose-runtime.css');
const avatarCut = cutMatch[1].trim();
const avatarCutSm = smallCutMatch[1].trim();
const ast = postcss.parse(css, { from: path.join(runtime, 'avatars-status-r9.css') });
const rules = [];
ast.walkRules((rule) => rules.push(rule));
const dom = new JSDOM(html, { pretendToBeVisual: true });
const doc = dom.window.document;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const userAvatar = 'button:not([data-fixture-no-lamp]):has(> span[class~="overflow-visible"][class~="items-center"][class~="justify-center"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]) > span[class~="overflow-visible"][class~="items-center"][class~="justify-center"] > span[class~="bg-muted"][class~="size-full"][class~="overflow-hidden"][class~="rounded-full"]';
const hovercard = '[data-slot="hover-card-content"] > div[class~="relative"][class~="isolate"][class~="w-full"] > div[class~="space-y-2.5"] > div[class~="relative"][class~="isolate"] > button[class~="size-10"] > span[class~="bg-muted"][class~="size-full"][class~="rounded-full"]';
const dialog = '[data-slot="dialog-content"] [class~="bottom-3"][class~="left-3"][class~="z-30"][class~="size-16"]:not(:has([data-profile-decoration-asset])) > [data-slot="button"][class~="rounded-full"]';
const activityFaces = '.activity-skin span.block.shrink-0.overflow-hidden.rounded-full:is([class~="size-16"],[class~="size-7"],[class~="size-9"]):not([data-fixture-activity-fallback])';
const activityFallback = '.activity-skin [data-fixture-activity-fallback]';
const favoriteFriendFace = '.object-row > [data-slot="hover-card-trigger"] > div[class~="relative"][class~="ml-2"][class~="overflow-visible"] > span[class~="bg-muted"][class~="rounded-full"][class~="border"]';
const userAvatarSource = userAvatar.replace('button:not([data-fixture-no-lamp]):has', 'button:has');
const noLampAvatar = '[data-fixture-no-lamp] > span.user-status-avatar > span.user-avatar-face';
const conditionalLampFace = '.vrcx-0-side-panel span:has(>span[class~="size-3.75"]) > span.overflow-hidden';
const count = (selector) => doc.querySelectorAll(selector).length;
const matchedFaces = { userStatusAvatar: count(userAvatar), userHoverCard: count(hovercard), userDialogIcon: count(dialog) };
const matchedAdditionalFaces = { noLampUserAvatar: count(noLampAvatar), conditionalLampFace: count(conditionalLampFace), activityPageFaces: count(activityFaces), syntheticActivityFallback: count(activityFallback), favoritesFriendRow: count(favoriteFriendFace) };
const residualMatches = {
  friendListAvatar: count('[data-fixture-friend-list-avatar]'), friendListFallback: count('[data-fixture-friend-list-fallback]'),
  settingsUserAvatar: count('[data-fixture-settings-user-avatar]'), groupMemberUser: count('[data-fixture-group-member-user]'), groupMemberFallback: count('[data-fixture-group-member-fallback]'),
  pickerUser: count('[data-fixture-picker-user]'), avatarOwner: count('[data-fixture-avatar-owner]'), noteExport: count('[data-fixture-note-export]'), multiselectUser: count('[data-fixture-multiselect-user]'),
  avatarSkeletonLarge: count('[data-fixture-avatar-skeleton-large]'), avatarSkeletonSmall: count('[data-fixture-avatar-skeleton-small]'),
  dashboardDot: count('[data-fixture-dashboard-dot]'), instanceDot: count('[data-fixture-instance-dot]'), unreadDot: count('[data-fixture-unread-dot]'), navDot: count('[data-fixture-nav-dot]'),
  avatarGroupFace: count('[data-fixture-avatar-group-face]'), avatarBadge: count('[data-fixture-avatar-badge]'), avatarGroupCount: count('[data-fixture-avatar-group-count]'), semanticGraphAvatar: count('[data-fixture-semantic-graph-avatar]')
};
const excluded = {
  mixedSearchAvatar: count('[data-fixture-search-mixed] [data-slot="avatar"]'),
  worldThumbnail: count('[data-fixture-world-thumb]'),
  groupThumbnail: count('[data-fixture-group-thumb]'),
  relationNetworkCircles: count('[data-fixture-relation-network] circle'),
  mutualFriendsGraphAvatar: count('[data-fixture-semantic-graph-avatar]'),
  genericStatusIcon: count('i.x-status-icon')
};
const statusElements = { componentDots: count('.user-status-indicator'), legacyUserDots: count('i.x-user-status'), genericStatusIcons: count('i.x-status-icon') };
const allowedAvatarProperties = ['border-radius', 'border-width', 'clip-path', 'box-shadow', 'outline', 'outline-offset', 'background-color', 'border-color'];
const allowedPropertiesBySelector = rules.map((rule) => {
  const declarations = rule.nodes.filter((node) => node.type === 'decl');
  const props = declarations.map((node) => node.prop);
  const selector = rule.selector;
  const statusRule = selector.includes('.user-status-indicator') || selector.includes('i.x-user-status');
  const allowed = statusRule ? props.every((prop) => prop === 'border-radius') : props.every((prop) => allowedAvatarProperties.includes(prop));
  return { selector, declarations: declarations.map((node) => ({ prop: node.prop, value: node.value })), allowed };
});
const avatarRules = rules.filter((rule) => !rule.selector.includes('.user-status-indicator') && !rule.selector.includes('i.x-user-status'));
const clipRules = avatarRules.filter((rule) => rule.nodes.some((node) => node.type === 'decl' && node.prop === 'clip-path'));
const avatarRuleAudit = avatarRules.map((rule) => {
  const declarations = Object.fromEntries(rule.nodes.filter((node) => node.type === 'decl').map((node) => [node.prop, node.value]));
  return { selector: rule.selector, clipPath: declarations['clip-path'], borderRadius: declarations['border-radius'], declarations };
});
const activityInnerReset = avatarRules.find((rule) => rule.selector.includes('.activity-skin') && rule.selector.includes('> :is(img,span[class~="rounded-full"])'));
const dialogButtonRule = avatarRules.find((rule) => rule.selector.includes('[class~="size-16"]') && rule.selector.includes('[data-slot="button"]') && !rule.selector.endsWith('> img'));
const groupDom = new JSDOM(groupHtml, { pretendToBeVisual: true });
const groupDocument = groupDom.window.document;
const groupAvatarTargets = [...groupDocument.querySelectorAll('[data-slot="avatar"][class~="rounded-md"],[data-slot="avatar"][class~="rounded-lg"]')];
const groupAvatarBaseRules = windoseRuntimeCss.match(/^\[data-slot="avatar"\]\s*\{[^}]*\}[\s\S]*?^\[data-slot="avatar"\]::before\s*\{[^}]*\}/m)?.[0];
if (!groupAvatarBaseRules) throw new Error('Could not isolate global Avatar mask rules for the static group exception audit');
const groupStyle = groupDocument.createElement('style');
groupStyle.textContent = `:root { --wd-avatar-cut: ${avatarCut}; --wd-avatar-cut-sm: ${avatarCutSm}; }\n${groupAvatarBaseRules}\n${popupsR9Css}\n${css}`;
groupDocument.head.appendChild(groupStyle);
const groupMaskReset = groupAvatarTargets.length === 3 && groupAvatarTargets.every((root) => {
  const image = root.querySelector('[data-slot="avatar-image"]');
  return groupDom.window.getComputedStyle(root).clipPath === 'none' && image && groupDom.window.getComputedStyle(image).clipPath === 'none';
});
const popupGroupTarget = groupDocument.querySelector('[data-fixture-popup-group-avatar]');
const popupGroupRadius = popupGroupTarget ? groupDom.window.getComputedStyle(popupGroupTarget).borderRadius : '';
const popupGroupImageRadius = popupGroupTarget ? groupDom.window.getComputedStyle(popupGroupTarget.querySelector('[data-slot="avatar-image"]')).borderRadius : '';
const popupGroupMaskReset = Boolean(popupGroupTarget && popupGroupRadius !== '0px' && popupGroupRadius === popupGroupImageRadius);
const outputDom = new JSDOM(html, { pretendToBeVisual: true });
const variableStyle = outputDom.window.document.createElement('style');
variableStyle.textContent = `:root { --wd-avatar-cut: ${avatarCut}; --wd-avatar-cut-sm: ${avatarCutSm}; }`;
outputDom.window.document.head.appendChild(variableStyle);
const style = outputDom.window.document.createElement('style');
style.textContent = css;
outputDom.window.document.head.appendChild(style);
const computedRadius = (selector) => outputDom.window.getComputedStyle(outputDom.window.document.querySelector(selector)).borderRadius;
const computedStatus = computedRadius('.status-list .user-status-indicator');
const computedLegacy = computedRadius('[data-fixture-legacy-status]');
const activeRing = computedRadius('[data-fixture-active-dot]');
const residualComputed = Object.fromEntries(Object.entries({
  friendList: '[data-fixture-friend-list-avatar]', friendFallback: '[data-fixture-friend-list-fallback]',
  groupMember: '[data-fixture-group-member-user]', avatarSkeletonLarge: '[data-fixture-avatar-skeleton-large]', avatarSkeletonSmall: '[data-fixture-avatar-skeleton-small]',
  dashboardDot: '[data-fixture-dashboard-dot]', instanceDot: '[data-fixture-instance-dot]', unreadDot: '[data-fixture-unread-dot]', navDot: '[data-fixture-nav-dot]', avatarBadge: '[data-fixture-avatar-badge]', avatarGroupCount: '[data-fixture-avatar-group-count]'
}).map(([name, selector]) => [name, { clipPath: outputDom.window.getComputedStyle(outputDom.window.document.querySelector(selector)).clipPath, borderRadius: outputDom.window.getComputedStyle(outputDom.window.document.querySelector(selector)).borderRadius }]));
const groupComputed = groupAvatarTargets.map((root) => ({ rootClip: groupDom.window.getComputedStyle(root).clipPath, rootRadius: groupDom.window.getComputedStyle(root).borderRadius, imageClip: groupDom.window.getComputedStyle(root.querySelector('[data-slot="avatar-image"]')).clipPath }));
const code = css.replace(/\/\*[\s\S]*?\*\//g, '');
const report = {
  result: 'PASS_STATIC',
  note: 'PostCSS/JSDOM audits source selectors, 32/16-grid user-avatar and skeleton masks, rounded-md/lg group-mask exclusions, status/unread pixels and paint preservation; Chromium verifier samples contours and group-square corners at 4×.',
  ruleCount: rules.length,
  sourceAvatarCut: avatarCut,
  sourceAvatarCutSm: avatarCutSm,
  sourceSelectors: { userStatusAvatar: userAvatarSource, userHoverCard: hovercard, userDialogIcon: dialog, activityPageFaces: activityFaces, activityFallback, favoriteFriendFace, conditionalLampFace, groupAvatarException: '[data-slot="avatar"][class~="rounded-md"|"rounded-lg"] > :is([data-slot="avatar-image"],[data-slot="avatar-fallback"])', friendListAvatar: '.vrcx-0-data-table :is(img.size-6.rounded-full.object-cover, div.bg-muted.size-6.rounded-full)', noteExportAvatar: '[data-slot="dialog-content"] > div.bg-card/40.rounded-lg.p-3 size-11 face only', mutualFriendsGraphAvatarExcluded: 'MutualFriendsNodeCard size-11 graph circle remains unchanged', avatarSkeletons: '[data-slot="skeleton"].rounded-full at avatar sizes 7/8/9/14/16' },
  matchedSourceProfileFaces: matchedFaces,
  matchedAdditionalFaces,
  residualMatches,
  groupAvatarTargets: groupAvatarTargets.map((root) => ({ className: root.className, id: root.getAttribute('data-fixture-group-avatar') })),
  groupMaskReset,
  popupGroupMaskReset,
  popupGroupRadius: { root: popupGroupRadius, image: popupGroupImageRadius },
  groupComputed,
  residualComputed,
  avatarCutRuleAudit: avatarRuleAudit,
  excludedSyntheticSlots: excluded,
  statusElementCounts: statusElements,
  paintPreservationPolicy: allowedPropertiesBySelector,
  computedRadius: { componentLamp: computedStatus, legacyUserLamp: computedLegacy, activeLampRing: activeRing, residualComputed, groupComputed },
  externalImportsOrAssets: /@import\b|url\(/i.test(css)
};
assert(rules.length >= 30 && clipRules.length >= 18, `Residual avatar/skeleton/status coverage rules are missing: ${JSON.stringify({ rules: rules.length, clipRules: clipRules.length })}`);
const clipRuleAudits = clipRules.map((rule) => {
  const declarations = Object.fromEntries(rule.nodes.filter((node) => node.type === 'decl').map((node) => [node.prop, node.value]));
  return { selector: rule.selector, declarations };
});
const pixelMaskAudits = clipRuleAudits.filter((item) => item.declarations['clip-path'] === 'var(--wd-avatar-cut)' || item.declarations['clip-path'] === 'var(--wd-avatar-cut-sm)');
const cutValues = pixelMaskAudits.map((item) => item.declarations['clip-path']);
assert(cutValues.filter((value) => value === 'var(--wd-avatar-cut)').length >= 8 && cutValues.filter((value) => value === 'var(--wd-avatar-cut-sm)').length >= 10, `Large and small avatar masks are not correctly tiered: ${JSON.stringify(cutValues)}`);
assert(pixelMaskAudits.every((item) => item.declarations['border-radius'] === '0' && item.declarations['border-width'] === '0' && item.declarations['box-shadow'] === 'none' && item.declarations.outline === 'none'), `A profiled avatar/skeleton still carries its own border/shadow/outline: ${JSON.stringify(pixelMaskAudits)}`);
assert(groupMaskReset && popupGroupMaskReset, `Rounded-md/lg Group Avatar or popup-radius exception failed: ${JSON.stringify({ groupAvatarTargets: groupAvatarTargets.map((root) => ({ root: groupDom.window.getComputedStyle(root).clipPath, child: groupDom.window.getComputedStyle(root.querySelector('[data-slot="avatar-image"]')).clipPath })), popupGroupRadius, popupGroupImageRadius })}`);
assert(Object.values(residualMatches).every((value) => value === 1), `Residual G5 probe fixture is missing a representative DOM node: ${JSON.stringify(residualMatches)}`);
assert(['dashboardDot','instanceDot','unreadDot','navDot','avatarBadge','avatarGroupCount'].every((key) => residualComputed[key].borderRadius === '0px'), `Status/unread/badge marker pixels did not become square: ${JSON.stringify(residualComputed)}`);
assert(residualComputed.friendList.clipPath !== 'none' && residualComputed.friendFallback.clipPath !== 'none' && residualComputed.groupMember.clipPath !== 'none' && residualComputed.avatarSkeletonLarge.clipPath !== 'none' && residualComputed.avatarSkeletonSmall.clipPath !== 'none', `User-avatar or skeleton masks did not match fixture probes: ${JSON.stringify(residualComputed)}`);
assert(activityInnerReset && activityInnerReset.nodes.some((node) => node.type === 'decl' && node.prop === 'border-radius' && node.value === '0'), 'Activity Face img/fallback rounded corners were not removed');
const dialogButtonAudit = avatarRuleAudit.find((item) => item.selector.includes('[class~="size-16"]') && item.selector.includes('[data-slot="button"]') && !item.selector.endsWith('> img'));
assert(dialogButtonAudit?.declarations['background-color'] === 'transparent' && dialogButtonAudit?.declarations['box-shadow'] === 'none' && dialogButtonAudit?.declarations['border-width'] === '0' && dialogButtonAudit?.declarations.outline === 'none', `Dialog userIcon backing/border is not clear: ${JSON.stringify(dialogButtonAudit)}`);
assert(!css.includes('--wd-avatar-ring'), 'Avatar CSS must not synthesize an avatar ring');
assert(matchedFaces.userStatusAvatar === 2 && matchedFaces.userHoverCard === 1 && matchedFaces.userDialogIcon === 1, `User-only profile selectors failed to match: ${JSON.stringify(matchedFaces)}`);
assert(matchedAdditionalFaces.noLampUserAvatar === 1 && matchedAdditionalFaces.conditionalLampFace === 1 && count('[data-fixture-no-lamp] .user-status-indicator') === 0 && windoseRuntimeCss.includes('.vrcx-0-side-panel span:has(>span[class~="size-3.75"]) > span.overflow-hidden,'), `Lamp/no-lamp comparison or conditional source mask selector failed: ${JSON.stringify(matchedAdditionalFaces)}`);
assert(matchedAdditionalFaces.activityPageFaces === 3 && matchedAdditionalFaces.syntheticActivityFallback === 1 && matchedAdditionalFaces.favoritesFriendRow === 1, `Activity images/fallback and favorites friend faces failed to match source-shaped selectors: ${JSON.stringify(matchedAdditionalFaces)}`);
assert(excluded.mixedSearchAvatar === 1 && excluded.worldThumbnail === 1 && excluded.groupThumbnail === 1 && excluded.relationNetworkCircles === 2 && excluded.mutualFriendsGraphAvatar === 1 && excluded.genericStatusIcon === 2, `Synthetic exclusion slots missing: ${JSON.stringify(excluded)}`);
assert(statusElements.componentDots >= 9 && statusElements.legacyUserDots === 2 && statusElements.genericStatusIcons === 2, `Expected user presence classes and excluded generic status icons: ${JSON.stringify(statusElements)}`);
assert(allowedPropertiesBySelector.every((item) => item.allowed), `CSS changes color/mask/size instead of shape only: ${JSON.stringify(allowedPropertiesBySelector)}`);
assert(computedStatus === '0px' && computedLegacy === '0px' && activeRing === '0px', `Square lamp cascade failed in JSDOM: ${JSON.stringify({ computedStatus, computedLegacy, activeRing })}`);
assert(!report.externalImportsOrAssets, 'New CSS must not load any external asset');
assert(!code.includes('i.x-status-icon') && !rules.some((rule) => rule.selector.split(',').some((selector) => selector.trim() === '[data-slot="avatar"]')) && !/\.rounded-full\s*\{/.test(code) && !/(^|,)\s*img\s*\{/m.test(code), 'CSS includes a forbidden generic avatar/status selector');
await fs.writeFile(path.join(here, 'static-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
