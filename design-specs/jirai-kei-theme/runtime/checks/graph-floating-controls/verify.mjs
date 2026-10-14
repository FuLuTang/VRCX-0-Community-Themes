import fs from 'node:fs/promises';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const runtime=new URL('../../',import.meta.url);
const theme=await fs.readFile(new URL('preview-package/jirai-kei-theme/theme.css',runtime),'utf8');
const app=await fs.readFile('/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css','utf8');
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:860,height:500},colorScheme:'dark'});
 await page.setContent(`<html class="dark"><body><main class="vrcx-0-main-content"><div class="vrcx-0-page-scaffold" id="chart"><div class="relative" style="height:440px;background:#191329"><div id="hud" class="bg-popover/70 ring-foreground/10 relative rounded-lg shadow-md ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 flex items-center gap-2 p-1.5" style="position:absolute;top:24px;left:24px;right:24px;display:flex;justify-content:space-between"><div style="display:flex;gap:8px"><button id="fetch" data-slot="button" data-variant="default" data-size="sm" class="inline-flex h-8 items-center justify-center rounded-lg border border-transparent px-2.5">再次拉取</button><input id="search" data-slot="input" placeholder="查找好友" class="h-8 w-56"></div><div style="display:flex;gap:4px"><button id="refresh" data-slot="button" data-variant="ghost" data-size="icon-sm" aria-label="刷新" class="size-7 rounded-lg border border-transparent"><svg width="16" height="16"></svg></button><button id="settings" data-slot="button" data-variant="ghost" data-size="icon-sm" aria-label="设置" class="size-7 rounded-lg border border-transparent"><svg width="16" height="16"></svg></button><button id="cancel" data-slot="button" data-variant="destructive" data-size="sm" class="h-7 rounded-lg border border-transparent">取消拉取</button></div></div><div id="menu" data-slot="dropdown-menu-content" class="bg-popover/70 text-popover-foreground rounded-lg shadow-md ring-1"><button data-slot="button" data-variant="ghost">菜单内ghost</button></div><div id="legend" class="bg-popover/70 relative absolute w-64" style="position:absolute;top:100px;left:24px;padding:12px">圈子说明</div></div></div></main></body></html>`);
 await page.addStyleTag({content:app});await page.addStyleTag({content:theme});await page.evaluate(()=>document.fonts.ready);
 const state=id=>page.locator('#'+id).evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {bg:s.backgroundColor,border:s.borderTopColor,radius:s.borderTopLeftRadius,shadow:s.boxShadow,outline:s.outlineStyle,w:r.width,h:r.height,backdrop:s.backdropFilter}});
 const report={};
 report.hud=await state('hud');report.fetch=await state('fetch');report.refresh=await state('refresh');report.settings=await state('settings');report.cancel=await state('cancel');report.search=await state('search');report.legend=await state('legend');
 const expect=(ok,msg)=>{if(!ok)throw Error(msg)};
 expect(report.hud.radius==='0px'&&report.hud.backdrop==='none'&&report.hud.shadow.includes('rgb(227, 210, 245)'),'floating surfaces not shared raised opaque panel');
 expect(report.legend.radius==='0px'&&report.legend.shadow.includes('rgb(227, 210, 245)'),'legend did not share panel face');
 expect(report.fetch.bg==='rgb(255, 184, 230)'&&report.fetch.border==='rgb(108, 92, 224)'&&report.fetch.radius==='0px'&&report.fetch.shadow.includes('rgba(253, 244, 255, 0.72)'),'primary fetch button style missed: '+JSON.stringify(report.fetch));
 for(const id of ['refresh','settings'])expect(report[id].bg==='rgb(33, 26, 51)'&&report[id].border==='rgb(108, 92, 224)'&&report[id].radius==='0px'&&report[id].shadow.includes('rgba(253, 244, 255, 0.72)'),'icon '+id+' not visibly raised');
 expect(report.cancel.bg==='rgb(61, 27, 53)'&&report.cancel.border==='rgb(255, 107, 138)','destructive state lost semantic color');
 expect(report.search.h===32,'search geometry changed');
 expect((await state('menu')).radius==='0px'&&(await state('menu')).shadow.includes('rgb(105, 85, 124)'),'menu popup-specific treatment changed: '+JSON.stringify(await state('menu')));
 await page.locator('#refresh').focus();report.focus=await state('refresh');expect(report.focus.outline==='solid','keyboard focus missing');
 await page.locator('#refresh').hover();await page.mouse.down();await page.waitForFunction(()=>getComputedStyle(document.querySelector('#refresh')).boxShadow.includes('2px 2px'));report.pressed=await state('refresh');await page.mouse.up();
 await page.screenshot({path:new URL('preview.png',import.meta.url).pathname});
 await fs.writeFile(new URL('report.json',import.meta.url),JSON.stringify(report,null,2));console.log('PASS: graph floating HUD/legend share raised surface; primary, ghost, destructive buttons, focus/press feedback, search geometry and menu-popup exclusion preserved.');
}finally{await browser.close();}
