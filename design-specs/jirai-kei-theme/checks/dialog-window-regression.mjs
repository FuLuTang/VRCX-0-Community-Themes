// Synthetic DOM only: never screenshots the personal baseline fixtures.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { toolRequire, JK, APP } from '../tools/common.mjs';
const { chromium } = toolRequire('playwright');
const assetDir = `${APP}/dist/assets`;
const appCss = fs.readdirSync(assetDir).filter(x=>x.endsWith('.css')).map(x=>fs.readFileSync(`${assetDir}/${x}`,'utf8')).join('\n');
const theme = fs.readFileSync(`${JK}/runtime/preview-package/jirai-kei-theme/theme.css`,'utf8');
const beforePath = process.env.JIRAI_BEFORE || '/tmp/jirai-dialog-before.css';
const before = fs.existsSync(beforePath) ? fs.readFileSync(beforePath,'utf8') : theme;
const browser = await chromium.launch({headless:true,args:['--disable-gpu']});
const results=[];
try {
 for (const width of [1280,640]) {
  const page=await browser.newPage({viewport:{width,height:850}});
  for (const css of [before,theme]) {
   const revised=css===theme;
   for (const mode of ['assistant','p-2','p-3','p-4','p-5','entity','owner','media']) {
    const entity=['entity','owner'].includes(mode);
    const hidden=entity||mode==='media';
    const inset=mode==='assistant'?'p-0':mode.startsWith('p-')?mode:'p-4';
    const classes=`fixed top-[calc(50%+1rem)] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 overflow-hidden ${inset} ${entity?`${mode}-dialog`:''}`;
    const header=`flex flex-col gap-2 ${hidden?'sr-only':''} ${mode==='assistant'?'flex-row items-center justify-between py-3 pr-3 pl-4':''}`;
    await page.setContent(`<html><head><style>${appCss}</style><style>${css}</style><style>*{animation:none!important;transition:none!important}</style></head><body><div data-slot="dialog-content" data-open class="${classes}" style="width:90vw;height:70vh;padding:${Number(inset.slice(2))/4}rem"><div data-slot="dialog-header" class="${header}"><h2 data-slot="dialog-title">${mode==='assistant'?'AI 助手':'玩家详情 · 测试窗口'}</h2>${hidden?'<p data-slot="dialog-description">Accessible description</p>':''}${mode==='assistant'?'<div><button>模型选择</button><button>关闭</button></div>':''}</div><div style="flex:1;min-height:0;overflow:auto">测试内容</div></div></body></html>`);
    const r=await page.evaluate(()=>{
     const shell=document.querySelector('[data-slot="dialog-content"]'),header=shell.firstElementChild,title=header.firstElementChild;
     const b=shell.getBoundingClientRect(),h=header.getBoundingClientRect(),t=title.getBoundingClientRect(),cs=getComputedStyle(shell);
     return {shellTop:b.top,headerTop:h.top,titleTop:t.top,titleBottom:t.bottom,headerHeight:h.height,frame:cs.borderTopColor,border:cs.borderTopWidth,radius:cs.borderTopLeftRadius,titleBg:getComputedStyle(title).backgroundColor,headerBg:getComputedStyle(header).backgroundColor,inset:cs.getPropertyValue('--r9-dialog-inset')};
    });
    if(revised) {
     assert.equal(r.border,'1px',`${mode} frame`);
     assert.equal(r.radius,'0px',`${mode} radius`);
     if(mode==='media') assert(r.headerHeight<=1,'media accessibility-only header stays hidden');
     else {
      assert(r.titleTop>=r.shellTop,`${mode} title clipped: ${JSON.stringify(r)}`);
      assert(r.headerHeight>=30,`${mode} titlebar collapsed`);
      assert.equal(mode==='assistant'?r.headerBg:r.titleBg,'rgb(242, 198, 232)',`${mode} pink strip`);
     }
    }
    results.push({width,mode,revised,...r});
    if(revised&&width===1280&&['assistant','entity'].includes(mode)) await page.screenshot({path:`${JK}/checks/dialog-${mode}-fixed.png`});
   }
  }
  await page.close();
 }
 fs.writeFileSync(`${JK}/checks/dialog-window-regression.json`,JSON.stringify(results,null,2)+'\n');
 console.log(`PASS: ${results.length} synthetic cases, including baseline comparison`);
} finally {await browser.close();}
