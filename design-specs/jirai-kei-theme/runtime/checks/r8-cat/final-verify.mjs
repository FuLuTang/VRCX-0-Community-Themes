/* NOT WINDOWS: source-shaped R8 nav fixture, 15 menu rows + 2 footer actions. */
import fs from 'node:fs/promises';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';

const root='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const out=`${root}/runtime/checks/r8-cat`;
const app='/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/';
const cssFiles=[
  app+'index-Cckb3vVG.css',
  app+'App-C2mIqNXI.css',
  `${root}/runtime/preview-package/jirai-kei-theme/theme.css`,
  `${root}/original-assets/r5/assets-r5.css`,
  `${root}/runtime/navigation-r7.css`,
  `${root}/runtime/chrome-r8.css`,
  `${root}/runtime/motion-r5.css`,
  `${root}/runtime/motion-r7.css`,
  `${root}/runtime/motion-r8.css`, // Lead's integration order: motion first, geometry afterward.
  `${root}/runtime/cat-r8-final.css`
];
const css=await Promise.all(cssFiles.map((file)=>fs.readFile(file,'utf8')));
const fixture=await fs.readFile(`${out}/final-fixture.html`,'utf8');
const browser=await chromium.launch({headless:true});
const report={fixture:'NOT WINDOWS; 15 source-shaped menu buttons + two footer buttons; 1668px width',heights:{}};

async function makePage(height) {
  const page=await browser.newPage({viewport:{width:1668,height},deviceScaleFactor:1});
  await page.setContent(fixture);
  for(const sheet of css) await page.addStyleTag({content:sheet});
  await page.evaluate(()=>document.fonts.ready);
  return page;
}
async function measure(page) {
  return page.evaluate(()=>{
    const host=document.querySelector('.vrcx-0-sidebar-surface [data-sidebar="content"]');
    const parent=host.getBoundingClientRect(), ps=getComputedStyle(host,'::after');
    const s=getComputedStyle(host);
    const borderRight=parseFloat(s.borderRightWidth)||0;
    const borderBottom=parseFloat(s.borderBottomWidth)||0;
    const paddingRight=parseFloat(s.paddingRight)||0;
    const paddingBottom=parseFloat(s.paddingBottom)||0;
    const marginRight=parseFloat(ps.marginRight)||0;
    const marginBottom=parseFloat(ps.marginBottom)||0;
    const width=parseFloat(ps.width),height=parseFloat(ps.height);
    const group=document.querySelector('[data-sidebar="group"]');
    const groupRect=group.getBoundingClientRect();
    const scrolls=host.scrollHeight>host.clientHeight+1;
    const marginTop=parseFloat(ps.marginTop);
    const top=scrolls
      ? groupRect.bottom+(Number.isFinite(marginTop)?marginTop:0)
      : parent.bottom-borderBottom-paddingBottom-marginBottom-height;
    const left=parent.right-borderRight-paddingRight-marginRight-width;
    const rect={x:left,y:top,width,height,left,right:left+width,top,bottom:top+height};
    const menu=[...document.querySelectorAll('[data-sidebar="content"] [data-sidebar="menu-button"]')].map((el)=>{
      const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom};
    });
    const footer=document.querySelector('[data-sidebar="footer"]');
    const footerRect=footer.getBoundingClientRect();
    const footerText=[...footer.querySelectorAll('.footer-label')].map((el)=>{
      const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom};
    });
    const outer=document.querySelector('[data-slot="sidebar"]');
    const outerRect=outer.getBoundingClientRect();
    const intersects=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
    const safeRect={...rect,top:rect.top-1,bottom:rect.bottom+1};
    const activeAnimations=[...document.getAnimations()].filter(a=>a.playState==='running').map(a=>a.animationName);
    return {
      rect,display:ps.display,opacity:Number(ps.opacity),animationName:ps.animationName,
      pointerEvents:ps.pointerEvents,backgroundImage:ps.backgroundImage!=='none',backgroundSize:ps.backgroundSize,
      imageRendering:ps.imageRendering,scrolls,scrollHeight:host.scrollHeight,clientHeight:host.clientHeight,
      menuCount:menu.length,menuOverlaps:menu.some((r)=>intersects(safeRect,r)),
      footerTextOverlaps:footerText.some((r)=>intersects(safeRect,r)),
      footerTop:footerRect.top,footerGap:footerRect.top-rect.bottom,lastMenuBottom:Math.max(...menu.map((r)=>r.bottom)),
      outerRightGap:outerRect.right-rect.right,activeAnimations
    };
  });
}
function assert(condition,message){if(!condition)throw new Error(message);}

for(const height of [1067,900,720,580]){
  const page=await makePage(height);
  const state=await measure(page);
  assert(state.display!=='none',`Cat hidden while expanded at ${height}px`);
  assert(state.rect.width===36&&state.rect.height===36,`Cat is not exactly 36×36 at ${height}: ${JSON.stringify(state.rect)}`);
  assert(state.backgroundImage&&state.backgroundSize==='36px 36px'&&state.imageRendering==='pixelated',`Needy-cat source or nearest scaling missing at ${height}`);
  assert(state.pointerEvents==='none',`Cat intercepts pointer at ${height}`);
  assert(state.opacity>=.55,`Cat visibility dipped below .55 at ${height}: ${state.opacity}`);
  assert(state.animationName==='r8-cat-hop',`R8 motion layer not attached at ${height}: ${state.animationName}`);
  assert(state.menuCount===15,`Expected 15 menu buttons at ${height}, got ${state.menuCount}`);
  assert(!state.menuOverlaps&&!state.footerTextOverlaps,`Cat overlaps menu/footer text at ${height}: ${JSON.stringify(state)}`);
  if(height===1067){
    assert(state.rect.top>=state.lastMenuBottom,`Cat is not after the final menu row at 1067px: ${JSON.stringify(state)}`);
    assert(state.rect.bottom<state.footerTop,`Cat is not in the menu/footer gap at 1067px: ${JSON.stringify(state)}`);
    assert(state.footerGap>=6&&state.footerGap<=12,`Expected ~8px gap above footer divider; got ${state.footerGap}`);
    assert(state.outerRightGap>=10&&state.outerRightGap<=15,`Expected ~12px right edge inset; got ${state.outerRightGap}`);
  }
  // Check the pseudo adds no more than the intended 36px to scroll extent.
  const baselineTag=await page.addStyleTag({content:'.vrcx-0-sidebar-surface [data-sidebar="content"]::after{display:none!important}'});
  const withoutCat=await page.locator('[data-sidebar="content"]').evaluate((el)=>el.scrollHeight);
  await baselineTag.evaluate((el)=>el.remove());
  const withCat=await page.locator('[data-sidebar="content"]').evaluate((el)=>el.scrollHeight);
  const extraScroll=withCat-withoutCat;
  assert(extraScroll<=36,`Cat adds more than 36px scroll at ${height}: ${extraScroll}`);
  let scrolledView=null;
  if(height<=720){
    await page.locator('[data-sidebar="content"]').evaluate((el)=>{el.scrollTop=el.scrollHeight});
    await page.waitForTimeout(80);
    scrolledView=await measure(page);
    assert(!scrolledView.menuOverlaps&&!scrolledView.footerTextOverlaps&&scrolledView.rect.bottom<=scrolledView.footerTop,`Scrolled cat overlaps menu/footer at ${height}: ${JSON.stringify(scrolledView)}`);
  }
  await page.screenshot({path:`${out}/final-${height}.png`});
  report.heights[height]={...state,extraScrollHeight:extraScroll,...(scrolledView?{scrolledView}:{})};
  if(height===1067){
    const before=await measure(page);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForTimeout(100);
    const reduced=await measure(page);
    assert(reduced.animationName==='none'&&reduced.opacity>=.9&&reduced.pointerEvents==='none',`Reduced-motion is not static/visible: ${JSON.stringify(reduced)}`);
    assert(Math.abs(reduced.rect.left-before.rect.left)<.1&&Math.abs(reduced.rect.top-before.rect.top)<.1,`Reduced-motion moved cat geometry: ${JSON.stringify({before:before.rect,after:reduced.rect})}`);
    report.reducedMotion={animationName:reduced.animationName,opacity:reduced.opacity,pointerEvents:reduced.pointerEvents,staticGeometry:true};
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.evaluate(()=>{document.querySelector('[data-slot="sidebar"]').dataset.state='collapsed';});
    const collapsed=await measure(page);
    assert(collapsed.display==='none',`Collapsed sidebar did not hide cat: ${collapsed.display}`);
    report.collapsed={display:collapsed.display};
  }
  await page.close();
}
await browser.close();
await fs.writeFile(`${out}/final-verify-output.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
console.log('PASS: 36px cat / four heights / no text overlap / 36px scroll cap / collapsed / reduced-motion');
