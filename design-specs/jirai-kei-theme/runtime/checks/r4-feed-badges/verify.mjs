/* R4 feed icons/badges — real-CSS verification.
   Source-shaped DOM built from the app's own literal class lists, painted by the
   real compiled app CSS + preview theme.css + the current runtime/feed-badges.css
   (+ the current fonts-pixel-body.css and the hand-refined pencil glyph, which
   the checked-in preview-package/theme.css predates).
   NOT Windows/WebView acceptance. Writes only into checks/r4-feed-badges/. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const app='/home/fulutang/Documents/Github/VRCX-0-jirai';
const theme='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const req=createRequire(app+'/package.json');
const React=req('react'),{renderToStaticMarkup}=req('react-dom/server'),L=req('lucide-react');
/* FeedTypeIndicator.tsx:15-28 */
const TYPES=[['Online','LogInIcon','上线','text-[var(--status-online)]'],['Offline','LogOutIcon','下线','text-slate-400'],['Status','PencilLineIcon','状态/签名变动','text-muted-foreground opacity-70'],['Avatar','PersonStandingIcon','模型变动','text-muted-foreground opacity-70'],['GPS','MapPinIcon','位置变动','text-sky-500'],['Bio','FileTextIcon','签名变动','text-muted-foreground opacity-70']];
const svgOf=(id,cls)=>renderToStaticMarkup(React.createElement(L[id],{'aria-hidden':'true',className:cls}));
const typeCell=([,icon,label,cls])=>`<span class="inline-flex min-w-0 items-center gap-1.5">${svgOf(icon,'size-3.5 shrink-0 '+cls)}<span class="text-foreground/80 min-w-0 truncate text-sm font-normal">${label}</span></span>`;
/* FeedStatusBadge.tsx:15-27 + FeedDetailCell.tsx:45-49 */
const badge=color=>`<span class="inline-flex min-w-0 items-center gap-1.5"><span aria-hidden="true" class="size-2.5 shrink-0 rounded-full" style="background-color:${color}"></span></span>`;
const detailCell=`<div class="flex min-w-0 items-center gap-2 text-sm">${badge('#2ed319')}${svgOf('ArrowRightIcon','text-muted-foreground size-4 shrink-0')}${badge('#e97c03')}</div>`;
/* RegionCodeBadge.tsx:32-42 */
const region=code=>`<span class="border-border/70 bg-muted/70 text-muted-foreground mr-1.5 inline-flex h-4 shrink-0 items-center rounded border px-1 font-mono text-[10px] leading-none font-semibold" title="region ${code}">${code}</span>`;
/* negative control: AccentColorPicker.tsx:82 — an accent swatch under a Button */
const swatch=`<button type="button" data-slot="button" class="h-7" data-kind="swatch-parent"><span aria-hidden="true" class="border-foreground/10 size-2.5 shrink-0 rounded-full border" style="background-color:#ff7fcf"></span><span>accent</span></button>`;
const html=`<!doctype html><html><head><meta charset="utf-8"><title>R4 feed badges verify (NOT WINDOWS)</title></head>
<body style="margin:0;background:#16112a;color:#f2ebff">
<div style="padding:8px;font:12px monospace;color:#ffb8e6">DOM FIXTURE / NOT WINDOWS / neutral example labels only</div>
<div data-vrcx-0-surface="data-table" class="app-data-table vrcx-0-data-table" style="width:660px;padding:4px">
 <table class="table-fixed" style="width:100%;border-collapse:collapse"><tbody><tr>
  <td data-kind="table-cell">${TYPES.slice(0,3).map(t=>`<div data-kind="type" data-type="${t[0]}">${typeCell(t)}</div>`).join('')}</td>
  <td>${detailCell}</td>
 </tr></tbody></table>
</div>
<div style="width:660px;padding:4px">
 ${TYPES.map(t=>`<div data-feed-list-summary="" class="grid h-[var(--vrcx-0-table-row-height)] items-center border-b text-sm" style="grid-template-columns:130px 1fr"><div data-kind="type" data-type="${t[0]}">${typeCell(t)}</div><div class="min-w-0 truncate">${region('USW')}${region('EU')}</div></div>`).join('')}
 <div class="flex items-center gap-2" style="padding:6px">${detailCell}${swatch}</div>
</div>
</body></html>`;
const file=path.join(here,'feed-badges-fixture.html');await fs.writeFile(file,html);
const appCss=[await fs.readFile(path.join(app,'dist/assets/index-Cckb3vVG.css'),'utf8'),await fs.readFile(path.join(app,'dist/assets/App-C2mIqNXI.css'),'utf8')];
const themeCss=await fs.readFile(path.join(theme,'runtime/preview-package/jirai-kei-theme/theme.css'),'utf8');
const badgesCss=await fs.readFile(path.join(theme,'runtime/feed-badges.css'),'utf8');
const bodyFontCss=await fs.readFile(path.join(theme,'runtime/fonts-pixel-body.css'),'utf8');
/* Take the rebuilt declaration verbatim: a hand-written url("...") around raw
   SVG would break on its own double quotes and turn --px into an
   invalid-at-computed-value custom property (mask then falls back to none). */
const iconsCss=await fs.readFile(path.join(theme,'original-assets/icons/dist/jirai-icons.css'),'utf8');
const pencilOverride=iconsCss.split('\n').find(l=>l.startsWith('svg.lucide-pencil-line{--px:'));
if(!pencilOverride)throw Error('rebuilt pencil-line declaration missing');
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:700,height:560},deviceScaleFactor:2});
await page.goto('file://'+file);
for(const c of appCss)await page.addStyleTag({content:c});
const baseline=await page.evaluate(()=>({
 typeWidths:[...document.querySelectorAll('[data-kind="type"]')].map(d=>[d.dataset.type,+d.querySelector('svg.lucide').getBoundingClientRect().width.toFixed(2)]),
 rowHeights:[...document.querySelectorAll('[data-feed-list-summary]')].map(e=>+e.getBoundingClientRect().height.toFixed(2)),
 typeCellSpanWidths:[...document.querySelectorAll('[data-kind="type"]')].map(e=>+e.getBoundingClientRect().width.toFixed(2)),
 dotRadius:getComputedStyle(document.querySelector('span.size-2\\.5.rounded-full')).borderRadius,
 swatchRadius:null
}));
await page.addStyleTag({content:themeCss});
await page.addStyleTag({content:bodyFontCss});
await page.addStyleTag({content:pencilOverride});
await page.addStyleTag({content:badgesCss});
await page.evaluate(async()=>{await document.fonts.ready;});
const res=await page.evaluate(()=>{
 const svgs=[...document.querySelectorAll('[data-kind="type"] svg.lucide')].map(s=>{const c=getComputedStyle(s),r=s.getBoundingClientRect();return {type:s.closest('[data-kind="type"]').dataset.type,cls:s.getAttribute('class').split(' ').find(x=>x.startsWith('lucide-')),w:+r.width.toFixed(2),h:+r.height.toFixed(2),mask:c.maskImage!=='none',maskSize:c.maskSize,hidden:[...s.children].every(k=>getComputedStyle(k).display==='none')};});
 const dots=[...document.querySelectorAll('span.inline-flex.min-w-0.items-center.gap-1\\.5 > span.size-2\\.5.rounded-full')].map(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return {radius:c.borderRadius,w:+r.width.toFixed(2),h:+r.height.toFixed(2),bg:c.backgroundColor,shadow:c.boxShadow};});
 const swatchSpan=document.querySelector('[data-kind="swatch-parent"] > span');
 const chips=[...document.querySelectorAll('span.h-4.shrink-0.rounded.border.font-mono')].map(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return {text:e.textContent,radius:c.borderRadius,border:c.borderTopWidth+' '+c.borderTopColor,bg:c.backgroundColor,color:c.color,font:c.fontFamily,clip:c.clipPath==='none'?'none':'staircut',w:+r.width.toFixed(1),h:+r.height.toFixed(1)};});
 const rows=[...document.querySelectorAll('[data-feed-list-summary]')].map(e=>+e.getBoundingClientRect().height.toFixed(2));
 const cellSpan=[...document.querySelectorAll('[data-kind="type"]')].map(e=>+e.getBoundingClientRect().width.toFixed(2));
 return {svgs,dots,swatch:{radius:getComputedStyle(swatchSpan).borderRadius,w:+swatchSpan.getBoundingClientRect().width.toFixed(2)},chips,rows,cellSpan,fonts:[...document.fonts].filter(f=>/Pixel/.test(f.family)).map(f=>f.family+':'+f.status)};
});
res.baseline=baseline;
const A=(v,m)=>{if(!v){console.error('FAIL: '+m+'\n'+JSON.stringify(res,null,2));process.exit(1);}};
A(res.svgs.length===9,'type glyph count 9 (3 in table cell + 6 list rows)');
A(res.svgs.every(s=>s.w===16&&s.h===16&&s.mask&&s.maskSize==='16px 16px'&&s.hidden),'every type glyph: 16x16 box, mask on, 16x16 mask-size, app children hidden');
A(res.svgs.map(s=>s.cls).join()==='lucide-log-in,lucide-log-out,lucide-pencil-line,lucide-log-in,lucide-log-out,lucide-pencil-line,lucide-person-standing,lucide-map-pin,lucide-file-text','glyph identity/order matches FeedTypeIndicator TYPE_ICONS');
A(res.dots.length===4&&res.dots.every(d=>d.radius==='0px'&&d.w===10&&d.h===10&&/rgb\(22, 17, 42\)/.test(d.shadow)),'status dots: square 10x10 with 1px #16112a keyline');
A(/rgb\(46, 211, 25\)/.test(res.dots.map(d=>d.bg).join())&&/rgb\(233, 124, 3\)/.test(res.dots.map(d=>d.bg).join()),'status colours preserved');
A(res.swatch.radius!=='0px','negative control: accent swatch under a Button stays round');
A(res.chips.length===12&&res.chips.every(c=>c.radius==='0px'&&c.border.startsWith('1px')&&c.clip==='staircut'&&c.bg==='rgb(42, 33, 71)'&&c.color==='rgb(255, 184, 230)'&&c.h===16),'region chips: square, 1px frame, stair cut, raised face, pink label, 16px tall');
A(res.chips.every(c=>/^"WD Pixel CJK"/.test(c.font)),'region chips use the Fusion pixel face');
A(res.rows.every(h=>h===baseline.rowHeights[0]&&h===40),'virtual row heights unchanged (40px)');
/* The app itself paints person-standing with transform:scale(1.45)
   (dist/assets/index-Cckb3vVG.css: `person-standing{stroke-width:.1rem;transform:scale(1.45)}`,
   cancelled by windose-runtime.css:120), so its measured box is 14*1.45=20.3
   before the theme loads. Everything else is the plain 14px size-3.5 box. */
A(baseline.typeWidths.every(([t,w])=>t==='Avatar'?Math.abs(w-20.3)<0.2:w===14),'pre-theme baseline: app default glyph box is 14px (size-3.5) '+JSON.stringify(baseline.typeWidths));
res.rowHeightDelta=res.rows.map((h,i)=>+(h-baseline.rowHeights[i]).toFixed(2));
res.cellSpanDelta=res.cellSpan.map((w,i)=>+(w-baseline.typeCellSpanWidths[i]).toFixed(2));
await page.screenshot({path:path.join(here,'feed-badges-after.png'),clip:{x:0,y:0,width:700,height:560}});
await fs.writeFile(path.join(here,'verify-report.json'),JSON.stringify({...res,cssBytes:Buffer.byteLength(badgesCss)},null,2)+'\n');
console.log(JSON.stringify({svgWidths:res.svgs.map(s=>s.w),glyphClasses:res.svgs.map(s=>s.cls),dots:res.dots,swatch:res.swatch,chips:res.chips.map(c=>({text:c.text,w:c.w,font:c.font.split(',')[0],bg:c.bg,color:c.color})),rows:res.rows,rowHeightDelta:res.rowHeightDelta,cellSpanDelta:res.cellSpanDelta,baseline,cssBytes:Buffer.byteLength(badgesCss)},null,2));
await browser.close();
