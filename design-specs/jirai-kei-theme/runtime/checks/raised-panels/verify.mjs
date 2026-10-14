import fs from 'node:fs/promises';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const runtime=new URL('../../',import.meta.url);
const css=await fs.readFile(new URL('preview-package/jirai-kei-theme/theme.css',runtime),'utf8');
const app=await fs.readFile('/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css','utf8');
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:920,height:520},colorScheme:'dark'});
 await page.setContent(`<html class="dark"><body><main class="vrcx-0-main-content" style="padding:24px"><h2>FICTIONAL DOM — NOT WINDOWS</h2><div style="display:flex;gap:24px;margin-top:20px"><section class="vrcx-0-page-scaffold friend-view"><article id="friend" data-slot="card" data-size="sm" class="relative border rounded-lg" tabindex="0" style="width:240px;height:125px;padding:12px"><strong>好友位置 · Example</strong><p>JP · World name</p><p>在线 · PC</p></article></section><section class="vrcx-0-page-scaffold"><div data-slot="resizable-panel-group" id="favorites-world-splitter"><div data-slot="resizable-handle"></div><div data-slot="resizable-panel" id="favorites-world-content"><div id="world" class="group/tile rounded-object overflow-hidden border" tabindex="0" style="width:250px;height:300px"><div style="height:200px;background:linear-gradient(140deg,#497ea4,#b7b1c6)"></div><div style="padding:12px">World · Example<br>作者</div></div></div></div></section><section class="vrcx-0-page-scaffold" id="chart"><div class="relative" style="width:280px;height:380px"><div id="legend" class="absolute w-64 border" style="padding:12px"><strong>圈子</strong><p>■ Example 1</p><p>■ Example 2</p><hr><p>点越大，共同好友越多</p><p>较亮的线 · 跨圈子连接</p><hr><p>API · 手动</p></div></div></section></div></main></body></html>`);
 await page.locator('main > div').evaluate(el=>{const main=el.parentElement;el.replaceWith(...el.childNodes);main.style.display='flex';main.style.flexWrap='wrap';main.style.gap='24px';main.querySelector('h2').style.width='100%';});
 await page.addStyleTag({content:app});await page.addStyleTag({content:css});await page.evaluate(()=>document.fonts.ready);
 const state=id=>page.locator('#'+id).evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {top:s.borderTopColor,bottom:s.borderBottomColor,shadow:s.boxShadow,outline:s.outlineStyle,width:r.width,height:r.height}});
 const report={};
 for(const id of ['friend','world','legend']){report[id]=await state(id);if(report[id].top!=='rgb(162, 148, 200)'||report[id].bottom!=='rgb(16, 11, 30)'||!report[id].shadow.includes('rgb(227, 210, 245) 1px 1px'))throw Error(id+' raised bevel missing: '+JSON.stringify(report[id]));}
 await page.locator('#world').hover();report.hover=await state('world');if(!report.hover.shadow.includes('rgb(227, 210, 245)'))throw Error('hover lost bevel');
 await page.locator('#world').evaluate(el=>el.classList.add('border-object-selected-border'));report.selected=await state('world');if(!report.selected.shadow.includes('rgb(227, 210, 245)'))throw Error('selected lost bevel');
 await page.locator('#world').evaluate(el=>el.classList.remove('border-object-selected-border'));
 await page.locator('#friend').focus();await page.keyboard.press('Tab');report.focus=await state('world');if(report.focus.outline==='none')throw Error('focus missing');
 await page.locator('#world').blur();await page.mouse.move(900,500);await page.screenshot({path:new URL('preview.png',import.meta.url).pathname});
 await fs.writeFile(new URL('report.json',import.meta.url),JSON.stringify(report,null,2));console.log('PASS: shared raised friend cards, favorites tiles, graph overlays; hover, selected and keyboard focus preserved.');
}finally{await browser.close();}
