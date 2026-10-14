import fs from 'node:fs/promises';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const runtime=new URL('../../',import.meta.url);
const css=await fs.readFile(new URL('preview-package/jirai-kei-theme/theme.css',runtime),'utf8');
const app=await fs.readFile('/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css','utf8');
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:720,height:470},colorScheme:'dark'});
 await page.setContent(`<html class="dark"><body><main class="vrcx-0-main-content" style="padding:30px"><h2>FICTIONAL DOM — NOT WINDOWS</h2><section class="entity-dialog"><div class="flex flex-wrap gap-1.5"><button id="bio" title="https://example.com" data-slot="button" data-variant="ghost" data-size="icon-xs" class="inline-flex items-center justify-center size-6 border border-transparent rounded-lg"><img alt="" class="size-4" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='16' height='16' fill='%237f8fff'/%3E%3C/svg%3E"></button><button id="fallback" title="https://example.org" data-slot="button" data-variant="ghost" data-size="icon-xs" class="size-6 border">↗</button></div></section><br><select id="native" class="border h-8 w-64"><option>-焦糖布丁-</option></select><br><br><button id="select" data-slot="select-trigger" class="border h-8 w-64">Shared Select ▾</button><br><br><button id="combo" data-slot="combobox-trigger" class="border h-8 w-64">Combobox ▾</button><br><br><div class="vrcx-0-page-toolbar"><div id="search" data-vrcx-0-control="toolbar" data-slot="input-group" class="flex h-8 border w-64"><span data-slot="input-group-addon">⌕</span><input data-slot="input-group-control" placeholder="搜索" class="min-w-0 flex-1"></div></div><br><div id="group" data-slot="input-group" class="border h-8 w-64"><input data-slot="input-group-control" placeholder="Shared input group"></div><br><input id="input" data-slot="input" class="border h-8 w-64" placeholder="Standalone field"><button id="other" data-slot="button" data-variant="ghost">Unrelated ghost</button></main></body></html>`);
 await page.addStyleTag({content:app}); await page.addStyleTag({content:css});
 await page.evaluate(()=>document.fonts.ready);
 const state=id=>page.locator('#'+id).evaluate(el=>{const s=getComputedStyle(el);const r=el.getBoundingClientRect();return {shadow:s.boxShadow,top:s.borderTopColor,bottom:s.borderBottomColor,bg:s.backgroundColor,outline:s.outlineStyle,width:r.width,height:r.height}});
 await page.locator('main').evaluate(el=>el.insertAdjacentHTML('beforeend','<aside data-slot="sidebar" data-state="expanded"><div class="vrcx-0-sidebar-surface"><div data-sidebar="content"><div data-sidebar="group"><div data-sidebar="group-content"><ul id="nav" data-sidebar="menu"><li><button data-sidebar="menu-button" data-active>好友位置</button></li><li><button data-sidebar="menu-button">工具</button></li></ul></div></div></div></div></aside>'));
 const report={};
 for(const id of ['native','select','combo','search','group','input','nav']){
  report[id]=await state(id);
  if(report[id].top!=='rgb(105, 85, 124)'||report[id].bottom!=='rgb(253, 244, 255)'||!report[id].shadow.includes('rgb(22, 17, 42) 1px 1px'))throw Error(id+' not sunken: '+JSON.stringify(report[id]));
 }
 report.bio=await state('bio');report.fallback=await state('fallback');
 if(!report.bio.shadow.includes('0.72')||report.bio.width!==24||report.bio.height!==24||report.fallback.shadow==='none')throw Error('Bio button bevel/geometry missing');
 await page.locator('#bio').hover();report.hover=await state('bio');
 await page.mouse.down();await page.waitForFunction(()=>getComputedStyle(document.querySelector('#bio')).boxShadow.includes('2px 2px'));report.pressed=await state('bio');await page.mouse.up();
 if(!report.pressed.shadow.includes('2px 2px'))throw Error('Pressed feedback missing');
 await page.locator('#bio').focus();await page.keyboard.press('Tab');report.focus=await state('fallback');
 if(report.focus.outline==='none')throw Error('Keyboard focus missing');
 report.other=await state('other');if(report.other.shadow!=='none')throw Error('Unrelated ghost changed');
 await page.locator('#other').focus();await page.mouse.move(700,450);
 await page.screenshot({path:new URL('preview.png',import.meta.url).pathname});
 await fs.writeFile(new URL('report.json',import.meta.url),JSON.stringify(report,null,2));console.log('PASS: 6 shared field variants; bio bevel, fallback, unchanged 24px box, hover/press/focus and unrelated ghost.');
}finally{await browser.close();}
