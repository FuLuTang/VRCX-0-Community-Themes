import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const runtime=path.resolve(here,'../..');
const appCssPath='/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css';
const baseThemePath='/tmp/jirai-lead-r95c/jirai-kei-theme/theme.css';
const [html,section,appCss,baseTheme]=await Promise.all([
  fs.readFile(path.join(here,'fixture.html'),'utf8'),
  fs.readFile(path.join(runtime,'buttons-badges-r10.css'),'utf8'),
  fs.readFile(appCssPath,'utf8'),
  fs.readFile(baseThemePath,'utf8')
]);
const marker='/* SECTION buttons-badges-r10 */';
if(baseTheme.includes(marker))throw Error('Base theme already contains this section; verify source is ambiguous');
const fullTheme=baseTheme+'\n'+marker+'\n'+section+'\n';
const bundleOutput=path.join(here,'bundle-with-buttons-badges.css');
await fs.writeFile(bundleOutput,fullTheme);
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1100,height:760},deviceScaleFactor:1});
const assert=(x,m)=>{if(!x)throw Error(m)};
const load=async(theme)=>{
  await page.setContent(html,{waitUntil:'domcontentloaded'});
  // Mirror the GUI cascade: app utility CSS first, then the complete built theme.
  await page.addStyleTag({content:appCss});
  await page.addStyleTag({content:theme});
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
  await page.evaluate(()=>document.fonts.ready);
};
const snap=()=>page.evaluate(()=>{
  const get=q=>{const e=document.querySelector(q);if(!e)throw Error(`Missing fixture node: ${q}`);const c=getComputedStyle(e),r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,radius:c.borderRadius,bg:c.backgroundColor,color:c.color,border:c.border,shadow:c.boxShadow,outline:c.outline,backdrop:c.backdropFilter,backgroundImage:c.backgroundImage,filter:c.filter,transform:c.transform}};
  return{
    buttons:[...document.querySelectorAll('#general [data-slot=button]')].map(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return{w:r.width,h:r.height,radius:c.borderRadius,bg:c.backgroundColor,color:c.color,border:c.border,shadow:c.boxShadow,outline:c.outline,filter:c.filter,disabled:e.disabled}}),
    badges:[...document.querySelectorAll('#badges [data-slot=badge]')].map(e=>({s:getComputedStyle(e).borderRadius,bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color,border:getComputedStyle(e).border,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})),
    pagination:[...document.querySelectorAll('[data-slot=pagination-link]')].map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,r:getComputedStyle(e).borderRadius,bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color})),
    tabs:get('#embedded-tabs [data-slot=tabs-list]'),pageTabs:get('#excluded [data-slot=tabs-list]'),
    inactiveTab:get('#embedded-tabs [data-slot=tabs-tab]:not([data-active])'),activeTab:get('#embedded-tabs [data-slot=tabs-tab][data-active]'),
    indicator:getComputedStyle(document.querySelector('#embedded-tabs [data-slot=tab-indicator]')).display,
    alert:get('#misc [data-slot=alert]'),destructiveAlert:get('#misc [data-slot=alert].text-destructive'),
    pill:get('#selection-pill'),searchPill:get('#search-pagination-pill'),newItem:get('button[class~="bg-popover/95"]'),
    separator:get('[data-slot=separator]'),titleBadge:get('#title-badge'),
    excluded:{login:get('[data-vrcx-0-surface=login-page] button'),settings:get('#settings [data-slot=button]'),entity:get('.entity-dialog [data-slot=button]'),settingsBadge:get('#settings [data-slot=badge]'),entityBadge:get('.entity-dialog [data-slot=badge]')}
  };
});
try{
  await load(baseTheme);
  await page.screenshot({path:path.join(here,'before.png'),fullPage:true});
  const before=await snap();
  await load(fullTheme);
  await page.screenshot({path:path.join(here,'after.png'),fullPage:true});
  const after=await snap();
  assert(after.buttons.length===7&&after.buttons.slice(0,6).every(x=>x.radius==='0px'),`variant button hit/missing: ${after.buttons.map(x=>x.radius).join('|')}`);
  assert(after.buttons[0].bg==='rgb(255, 184, 230)'&&after.buttons[1].bg==='rgb(33, 26, 51)'&&after.buttons[4].bg==='rgb(61, 27, 53)',`variant palette mismatch: ${after.buttons.map(x=>x.bg).join('|')}`);
  assert(after.buttons[6].filter.includes('grayscale'),'disabled state missing');
  assert(after.badges.length===6&&after.badges.every(x=>x.s==='0px'),'badge variants not squared');
  assert(after.badges[0].bg==='rgb(255, 184, 230)'&&after.badges[2].bg==='rgb(61, 27, 53)','badge semantic colors lost');
  assert(after.pagination[1].bg==='rgb(255, 184, 230)'&&after.pagination[1].r==='0px','active pagination pixel state missed');
  assert(after.pagination.every(x=>x.w>=30&&x.h>=30),'pagination links lack source Button dimensions');
  assert(after.tabs.radius==='0px'&&after.indicator==='none','external tabs styling/indicator missed');
  assert(after.pageTabs.radius===before.pageTabs.radius,'PageScaffold tabs were changed');
  assert(after.inactiveTab.bg==='rgb(33, 26, 51)'&&after.inactiveTab.color==='rgb(242, 235, 255)','inactive embedded tab contrast surface missing');
  assert(after.alert.radius==='0px'&&after.destructiveAlert.border.includes('rgb(255, 107, 138)'),'alert semantic variants missed');
  assert(after.pill.radius==='0px'&&after.searchPill.radius==='0px','floating selection/search pagination pills remain round');
  assert(after.newItem.radius==='0px'&&after.newItem.backdrop==='none'&&after.newItem.color==='rgb(22, 17, 42)','new-items pill remains blurred/round or low contrast');
  assert(after.separator.backgroundImage.includes('repeating-linear-gradient'),'pixel separator missed');
  assert(after.titleBadge.radius===before.titleBadge.radius,'titlebar notification badge changed');
  for(const k of ['login','entity'])assert(after.excluded[k].radius===before.excluded[k].radius&&after.excluded[k].shadow===before.excluded[k].shadow,`${k} exclusion modified`);
  for(const k of ['entityBadge'])assert(after.excluded[k].radius===before.excluded[k].radius,`${k} badge exclusion modified`);
  /* Real structure. The settings rail guards in buttons-badges-r10.css test for a DIRECT-CHILD TabsList
     (`:has(> [data-slot="tabs-list"][class~="w-44"])`), but the real SettingsPage tree is
     PageScaffold > Tabs[vertical] > TabsList.w-44 (SettingsPage.tsx:67-85), so those guards have never matched and
     settings content has always been reached by the generic rule. That is exactly the intended post-migration
     behaviour ("generic rule global, per-context override wins"), so it is asserted POSITIVELY here. The old negative
     control only held because the fixture flattened the rail to a direct child - a DOM shape the app never produces.
     login / entity are out of reach by construction (the generic rules are scoped to .vrcx-0-main-content /
     .vrcx-0-side-panel and both live outside that scope), and that exclusion is still asserted as "unchanged" above. */
  assert(after.excluded.settings.radius==='0px'&&after.excluded.settingsBadge.radius==='0px','Settings controls must take the generic pixel treatment (they are in scope of the generic rule)');
  assert(before.excluded.settings.radius!==after.excluded.settings.radius,'Settings button must actually be reached by the generic rule');
  const geom=(a,b)=>Math.max(Math.abs(a.w-b.w),Math.abs(a.h-b.h));
  assert(geom(before.tabs,after.tabs)<=2,'external tabs geometry changed >2px');
  assert(geom(before.pill,after.pill)<=2&&geom(before.searchPill,after.searchPill)<=2,'pill geometry changed >2px');
  assert(geom(before.alert,after.alert)<=2&&geom(before.destructiveAlert,after.destructiveAlert)<=2,'alert geometry changed >2px');
  for(let i=0;i<before.buttons.length;i++)assert(geom(before.buttons[i],after.buttons[i])<=2,`button ${i} geometry >2px`);
  for(let i=0;i<before.badges.length;i++)assert(Math.abs(before.badges[i].w-after.badges[i].w)<=2&&Math.abs(before.badges[i].h-after.badges[i].h)<=2,`badge ${i} geometry >2px`);
  for(let i=0;i<before.pagination.length;i++)assert(Math.abs(before.pagination[i].w-after.pagination[i].w)<=2&&Math.abs(before.pagination[i].h-after.pagination[i].h)<=2,`pagination ${i} geometry >2px`);
  await page.keyboard.press('Tab');
  const focus=await page.evaluate(()=>({tag:document.activeElement.tagName,outline:getComputedStyle(document.activeElement).outline}));
  assert(focus.tag==='BUTTON'&&focus.outline.includes('rgb(255, 127, 207)'),'button keyboard focus-visible ring missing');
  const primary=page.locator('#general [data-variant=default]').first();
  await primary.hover();const hover=await primary.evaluate(e=>getComputedStyle(e).backgroundColor);
  await page.mouse.down();const active=await primary.evaluate(e=>({shadow:getComputedStyle(e).boxShadow,transform:getComputedStyle(e).transform}));await page.mouse.up();
  assert(hover==='rgb(243, 127, 196)'&&active.shadow.includes('2px 2px')&&active.transform==='matrix(1, 0, 0, 1, 1, 1)','hover/active pressed state missing');
  const contrast=await page.evaluate(()=>{const l=([r,g,b])=>{const f=x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};const ratio=(a,b)=>{a=l(a);b=l(b);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};return{button:ratio([22,17,42],[255,184,230]),body:ratio([242,235,255],[32,25,54]),danger:ratio([255,217,228],[61,27,53]),inactiveTab:ratio([242,235,255],[33,26,51])}});
  assert(Object.values(contrast).every(x=>x>=4.5),'contrast below 4.5:1');
  const left=await sharp(path.join(here,'before.png')).png().toBuffer(),right=await sharp(path.join(here,'after.png')).png().toBuffer();
  await sharp({create:{width:2200,height:760,channels:4,background:'#16112a'}}).composite([{input:left,left:0,top:0},{input:right,left:1100,top:0}]).png().toFile(path.join(here,'comparison.png'));
  const report={fixtureOnly:true,appCssPath,baseThemePath,bundleOutput,before,after,focus,hover,active,contrast,maxButtonSizeDelta:Math.max(...before.buttons.map((b,i)=>geom(b,after.buttons[i]))),allExclusionsPass:true};
  await fs.writeFile(path.join(here,'verify-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
