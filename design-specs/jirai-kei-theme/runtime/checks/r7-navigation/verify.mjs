/* NOT WINDOWS: source-shaped nav fixture. VRCX source stays read-only. */
import fs from 'node:fs/promises';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const root=new URL('../../',import.meta.url),out=new URL('./',import.meta.url);
const app='/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/';
const css=await Promise.all([fs.readFile(app+'index-Cckb3vVG.css','utf8'),fs.readFile(app+'App-C2mIqNXI.css','utf8'),fs.readFile(new URL('preview-package/jirai-kei-theme/theme.css',root),'utf8')]);
const labels=['好友动态','好友位置','游戏日志','房间历史','房内玩家','搜索','浏览记录','收藏','社交','我的模型','活动','好友关系图','双人关系','关系时间轴','工具'];
const icon='<span class="relative inline-flex size-4 shrink-0 items-center justify-center"><svg class="lucide lucide-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 4a5 5 0 0 0-8 2 5 5 0 0 0-8-2c-5 5 0 9 8 15 8-6 13-10 8-15Z"/></svg></span>';
const classes='peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm h-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!';
const button=(label,i)=>`<li data-sidebar="menu-item"><a data-slot="tooltip-trigger" data-sidebar="menu-button" ${i===0?'data-active':''} class="${classes}" href="#${i}">${icon}<span class="label">${label}</span></a></li>`;
const html=`<!doctype html><html class="dark"><body style="margin:0"><div class="vrcx-0-app-root" style="height:100vh;display:flex"><div data-slot="sidebar" data-state="expanded" data-collapsible="" class="group" style="width:200px;flex:none"><div data-slot="sidebar-inner" class="vrcx-0-sidebar-surface flex h-full flex-col"><div data-sidebar="content" class="flex min-h-0 flex-1 flex-col overflow-auto"><div data-sidebar="group"><div data-sidebar="group-content"><ul data-sidebar="menu" class="flex flex-col">${labels.map(button).join('')}</ul></div></div></div><div data-sidebar="footer" class="flex flex-col"><ul data-sidebar="menu" class="flex flex-col">${button('设置',99)}${button('收起导航栏',100)}</ul></div></div></div><main class="vrcx-0-main-content" style="flex:1;position:relative"><p style="padding:24px">NOT WINDOWS · R7 导航可读性测试</p></main></div></body></html>`;
const b=await chromium.launch();const report={};
for(const height of [900,720,580]){
 const p=await b.newPage({viewport:{width:1000,height},reducedMotion:'reduce'});await p.setContent(html);for(const c of css)await p.addStyleTag({content:c});await p.evaluate(()=>document.fonts.ready);
 const state=await p.evaluate(()=>{const s=document.querySelector('.vrcx-0-sidebar-surface'),a=s.querySelector('[data-sidebar="menu-button"]'),t=s.querySelector('[data-sidebar="content"]');const g=getComputedStyle(a);return {font:g.fontSize,bg:getComputedStyle(s).backgroundImage,height:g.height,color:g.color,textTransform:g.textTransform,contentScroll:t.scrollHeight>t.clientHeight,footerWithin: s.querySelector('[data-sidebar="footer"]').getBoundingClientRect().bottom<=innerHeight};});
 if(state.bg!=='none'||state.font!=='16px'||!state.footerWithin)throw Error('expanded nav regression '+JSON.stringify(state));
 await p.screenshot({path:new URL(`expanded-${height}.png`,out).pathname});
 await p.locator('[data-sidebar="menu-button"]').nth(1).hover();await p.screenshot({path:new URL(`hover-${height}.png`,out).pathname});
 await p.evaluate(()=>{const s=document.querySelector('[data-slot="sidebar"]');s.dataset.state='collapsed';s.dataset.collapsible='icon';s.style.width='48px';document.querySelectorAll('.label').forEach(e=>e.style.display='none');});
 const collapsed=await p.locator('[data-sidebar="menu-button"]').first().evaluate(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}));
 if(collapsed.w>40)throw Error('collapsed button too wide '+JSON.stringify(collapsed));
 await p.screenshot({path:new URL(`collapsed-${height}.png`,out).pathname});report[height]={state,collapsed};await p.close();
}
await b.close();await fs.writeFile(new URL('report.json',out),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));console.log('PASS: NAVIGATION / 3 heights / collapsed / hover');
