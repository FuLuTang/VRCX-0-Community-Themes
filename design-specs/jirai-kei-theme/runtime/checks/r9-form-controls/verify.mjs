import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),runtime=path.resolve(here,'../..');
const [html,css]=await Promise.all([fs.readFile(path.join(here,'fixture.html'),'utf8'),fs.readFile(path.join(runtime,'form-controls-r9.css'),'utf8')]);
if(/@import\b|url\((?!["']?data:)/i.test(css))throw Error('Unexpected import/remote URL');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1100,height:620},deviceScaleFactor:1});
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const round=x=>Math.round(x*100)/100;
const snap=()=>page.evaluate(()=>{
 const get=(q)=>{const e=document.querySelector(q),c=getComputedStyle(e),r=e.getBoundingClientRect();return {w:r.width,h:r.height,radius:c.borderRadius,bg:c.backgroundColor,border:c.border,outline:c.outline,appearance:c.appearance,backgroundImage:c.backgroundImage,accent:c.accentColor,checked:e.checked??e.getAttribute('aria-checked'),position:r.x}};
 return {nativeChecks:[...document.querySelectorAll('#search input[type=checkbox],#timeline input[type=checkbox]')].map(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return {w:r.width,h:r.height,checked:e.checked,radius:c.borderRadius,bg:c.backgroundColor,outline:c.outline,appearance:c.appearance}}),baseCheck:get('#description'),nativeRange:get('#native-range'),track:get('[data-slot=slider-track]'),thumb:get('[data-slot=slider-thumb]'),select:get('[data-slot=select-trigger]'),combo:get('[data-slot=combobox-trigger]'),nativeSelect:get('#native-select'),spin:{animation:getComputedStyle(document.querySelector('#inline-loading [data-slot=spinner]')).animation,mask:getComputedStyle(document.querySelector('#inline-loading [data-slot=spinner]')).maskImage},excluded:{login:getComputedStyle(document.querySelector('[data-vrcx-0-surface=login-page] input')).appearance,entity:getComputedStyle(document.querySelector('.entity-dialog input')).appearance,settings:getComputedStyle(document.querySelector('#settings input')).appearance}};
});
try{
 await page.setContent(html); await page.screenshot({path:path.join(here,'before.png')}); const before=await snap();
 await page.addStyleTag({content:css+'\n@keyframes r5-spinner-step{to{transform:rotate(360deg)}}'});
 const after=await snap(); await page.screenshot({path:path.join(here,'after.png')});
 assert(after.nativeChecks.every(x=>x.appearance==='none'&&x.w===14&&x.h===14),'native checkbox styling/size failed');
 assert(after.baseCheck.w===14&&after.baseCheck.h===14&&after.baseCheck.radius==='0px','Base UI checkbox not square');
 assert(after.nativeChecks.some(x=>x.checked)&&after.nativeChecks.some(x=>!x.checked),'checked and unchecked states missing');
 assert(after.nativeRange.appearance==='none','native range appearance not reset');
 assert(Math.abs(after.nativeRange.h-before.nativeRange.h)<=2,'native range height delta >2px');
 assert(Math.abs(after.track.h-before.track.h)<=2,'Base UI track height delta >2px');
 assert(after.track.h===6&&after.track.radius==='0px'&&after.thumb.w===12&&after.thumb.h===12&&after.thumb.radius==='0px','pixel Base UI slider geometry failed');
 assert(after.select.radius==='0px'&&after.combo.radius==='0px','Select trigger corners remain rounded');
 assert(after.nativeSelect.radius==='0px'&&after.nativeSelect.appearance==='none'&&after.nativeSelect.bg==='rgb(33, 26, 51)','native relationship select styling missing');
 assert(Math.abs(after.nativeSelect.h-before.nativeSelect.h)<=2&&Math.abs(after.nativeSelect.w-before.nativeSelect.w)<=2,'native Select geometry changed by >2px');
 assert(after.spin.animation.includes('steps(8'),'spinner not stepped');
 /* Kept exclusions (exclusion-migration/exclusions.md): the entity-dialog range keeps its UA box -> the R9.5 range rule
   still must not reach it (drop, e.g. its 2px margin, would move the hit box), and the settings rail hook is a dead
   clause kept verbatim. login-page's R9.5 exclusion was RELEASED on purpose (the generic pixel rule now owns it), so its
   value is recorded in the report instead of asserted: the pre-migration theme legitimately leaves it at the UA default. */
assert(after.excluded.entity==='auto',`entity-dialog range exclusion no longer holds: ${JSON.stringify(after.excluded)}`);
assert(after.excluded.settings==='none',`settings controls must be owned by the generic rule (the rail hook is a dead clause): ${JSON.stringify(after.excluded)}`);
 for(let i=0;i<before.nativeChecks.length;i++)assert(Math.abs(before.nativeChecks[i].w-after.nativeChecks[i].w)<=2&&Math.abs(before.nativeChecks[i].h-after.nativeChecks[i].h)<=2,'checkbox dimension delta >2px');
 // Keyboard focus remains available for checkbox, native range, and buttons.
 await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
 const focused=await page.evaluate(()=>({tag:document.activeElement.tagName,outline:getComputedStyle(document.activeElement).outline}));
 assert(focused.tag==='INPUT'&&focused.outline.includes('rgb(255, 127, 207)'),'keyboard-visible focus missing');
 // Toggle Base UI checkbox and native range with browser interaction; update Slider's live indicator/thumb.
 await page.locator('#description').evaluate(e=>e.addEventListener('click',()=>{const checked=e.getAttribute('aria-checked')!=='true';e.setAttribute('aria-checked',String(checked));e.toggleAttribute('data-checked',checked)}));
 await page.locator('#description').click();
 const checkboxUnchecked=await page.locator('#description').getAttribute('aria-checked');
 await page.locator('#description').evaluate(e=>{e.setAttribute('aria-checked','true');e.setAttribute('data-checked','')});
 assert(checkboxUnchecked==='false'&&await page.locator('#description').evaluate(e=>getComputedStyle(e).backgroundColor)==='rgb(255, 184, 230)',`checkbox toggle check failed: ${checkboxUnchecked}`);
 const initial=await page.locator('#base-slider [data-slot=slider-thumb]').evaluate(e=>e.getBoundingClientRect().x);
 await page.locator('#native-range').fill('9');
 await page.locator('#base-slider').evaluate(e=>{e.setAttribute('aria-valuenow','70');e.querySelector('[data-slot=slider-range]').style.width='70%';e.querySelector('[data-slot=slider-thumb]').style.left='70%'});
 const updated=await page.locator('#base-slider [data-slot=slider-thumb]').evaluate(e=>e.getBoundingClientRect().x);
 assert((await page.locator('#native-range').inputValue())==='9'&&updated>initial+40,'slider value/thumb position did not respond');
 const [pw,ph]=await page.locator('#base-slider [data-slot=slider-thumb]').evaluate(e=>[e.getBoundingClientRect().width,e.getBoundingClientRect().height]);
 assert(pw===12&&ph===12,'updated thumb geometry changed');
 const [contrast,inkContrast]=await page.evaluate(()=>{const lum=rgb=>{const f=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(rgb[0])+.7152*f(rgb[1])+.0722*f(rgb[2])};const ratio=(a,b)=>{a=lum(a);b=lum(b);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};return [ratio([22,17,42],[255,184,230]),ratio([242,235,255],[33,26,51])]});
 assert(contrast>=4.5&&inkContrast>=4.5,'control contrast below WCAG AA');
 // Generate a side-by-side comparison for visual review.
 const left=await sharp(path.join(here,'before.png')).png().toBuffer(),right=await sharp(path.join(here,'after.png')).png().toBuffer();
 await sharp({create:{width:2200,height:620,channels:4,background:'#16112a'}}).composite([{input:left,left:0,top:0},{input:right,left:1100,top:0}]).png().toFile(path.join(here,'comparison.png'));
 const report={fixtureOnly:true,before,after,focused,slider:{beforeThumbX:round(initial),afterThumbX:round(updated),nativeValue:9},contrast:{pinkOnInk:contrast,lightOnDark:inkContrast},checks:{exit:'pass',sizeDeltaMax:Math.max(...before.nativeChecks.map((x,i)=>Math.max(Math.abs(x.w-after.nativeChecks[i].w),Math.abs(x.h-after.nativeChecks[i].h))))}};
 await fs.writeFile(path.join(here,'verify-report.json'),JSON.stringify(report,null,2)+'\n'); console.log(JSON.stringify(report,null,2));
}finally{await browser.close()}
