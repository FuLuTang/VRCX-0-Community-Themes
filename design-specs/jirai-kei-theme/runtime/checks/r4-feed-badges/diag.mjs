/* R4 (5a) diagnosis — real SSR lucide SVG inside the source-shaped FeedTypeIndicator DOM,
   painted by the real compiled app CSS + the real preview theme.css.
   Read-only against the app checkout. NOT Windows/WebView acceptance. */
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
/* FeedTypeIndicator.tsx:15-28 TYPE_ICONS, verbatim classes */
const TYPES=[['Online','LogInIcon','上线','text-[var(--status-online)]'],['Offline','LogOutIcon','下线','text-slate-400'],['Status','PencilLineIcon','状态/签名变动','text-muted-foreground opacity-70'],['Avatar','PersonStandingIcon','模型变动','text-muted-foreground opacity-70'],['GPS','MapPinIcon','位置变动','text-sky-500'],['Bio','FileTextIcon','签名变动','text-muted-foreground opacity-70']];
function cell(type){
  const [,icon,label,cls]=type;
  const svg=renderToStaticMarkup(React.createElement(L[icon],{'aria-hidden':'true',className:'size-3.5 shrink-0 '+cls}));
  return `<div data-feed-type="${type[0]}" style="display:flex;height:100%;align-items:center;padding:0 8px"><span class="inline-flex min-w-0 items-center gap-1.5" style="min-width:0">${svg}<span class="text-foreground/80 min-w-0 truncate text-sm font-normal">${label}</span></span></div>`;
}
/* FeedDetailCell.tsx:42-51 Status branch: FeedStatusBadge(gap-1.5, size-2.5 rounded-full) + ArrowRightIcon + badge */
const arrow=renderToStaticMarkup(React.createElement(L.ArrowRightIcon,{className:'text-muted-foreground size-4 shrink-0'}));
const badge=(color)=>`<span class="inline-flex min-w-0 items-center gap-1.5"><span class="size-2.5 shrink-0 rounded-full" style="background-color:${color}"></span></span>`;
const detail=`<div data-feed-detail="Status" style="display:flex;height:100%;align-items:center;padding:0 8px"><div class="flex min-w-0 items-center gap-2 text-sm">${badge('#2ed319')}${arrow}${badge('#e97c03')}</div></div>`;
/* RegionCodeBadge.tsx:32-42 verbatim classes (5c) */
const region=(code)=>`<span class="border-border/70 bg-muted/70 text-muted-foreground mr-1.5 inline-flex h-4 shrink-0 items-center rounded border px-1 font-mono text-[10px] leading-none font-semibold" title="region ${code}">${code}</span>`;
const regions=['JP','USE','USW','EU','US'].map(region).join('');
const rows=TYPES.map(t=>`<div class="feed-row" style="height:46px;display:flex;align-items:center;border-bottom:1px solid #0002">${cell(t)}</div>`).join('');
const html=`<!doctype html><html><head><meta charset="utf-8"><title>R4 feed badges fixture (NOT WINDOWS)</title></head>
<body style="margin:0;background:#16112a;color:#f2ebff;font-family:sans-serif">
<div style="padding:8px;font:12px monospace;color:#ffb8e6">DOM FIXTURE / NOT WINDOWS / neutral labels only</div>
<div id="grid" style="width:640px;padding:8px">
${rows}
<div style="height:46px;display:flex;align-items:center;border-bottom:1px solid #0002">${detail}</div>
<div style="height:46px;display:flex;align-items:center">${regions}</div>
</div></body></html>`;
const file=path.join(here,'feed-badges-fixture.html');
await fs.writeFile(file,html);
const appCss=[await fs.readFile(path.join(app,'dist/assets/index-Cckb3vVG.css'),'utf8'),await fs.readFile(path.join(app,'dist/assets/App-C2mIqNXI.css'),'utf8')];
const themeCss=await fs.readFile(path.join(theme,'runtime/preview-package/jirai-kei-theme/theme.css'),'utf8');
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:700,height:520},deviceScaleFactor:2});
await page.goto('file://'+file);
for(const c of appCss)await page.addStyleTag({content:c});
const before=await page.evaluate(()=>[...document.querySelectorAll('[data-feed-type] svg')].map(s=>({cls:s.getAttribute('class'),mask:getComputedStyle(s).maskImage!=='none'})));
await page.addStyleTag({content:themeCss});
await page.evaluate(async()=>{await document.fonts.ready;});
const res=await page.evaluate(()=>{
 const info=(s)=>{const c=getComputedStyle(s),r=s.getBoundingClientRect();
  return {cls:s.getAttribute('class'),w:r.width,h:r.height,bg:c.backgroundColor,maskImage:c.maskImage.slice(0,40),maskNone:c.maskImage==='none',webkitMask:c.webkitMaskImage==='none'?'none':'set',px:c.getPropertyValue('--px').slice(0,28),childDisplay:c.display,inner:[...s.children].map(k=>getComputedStyle(k).display),color:c.color,opacity:c.opacity};};
 const types={};for(const el of document.querySelectorAll('[data-feed-type]')){types[el.dataset.feedType]=info(el.querySelector('svg'));}
 const dots=[...document.querySelectorAll('[data-feed-detail] span.size-2\\.5')].map(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return {w:r.width,h:r.height,radius:c.borderRadius,bg:c.backgroundColor,border:c.borderTopWidth+' '+c.borderTopColor,boxShadow:c.boxShadow==='none'?'none':'set',clip:c.clipPath};});
 const ar=info(document.querySelector('[data-feed-detail] svg'));
 const regs=[...document.querySelectorAll('#grid > div:last-child span')].map(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return {text:e.textContent,w:r.width,h:r.height,radius:c.borderRadius,border:c.borderTopWidth+' '+c.borderTopColor,clip:c.clipPath,font:c.fontFamily.split(',')[0],size:c.fontSize,bg:c.backgroundColor,color:c.color};});
 return {types,arrow:ar,dots,regions:regs};
});
res.beforeTheme=before;
res.cssBytes=Buffer.byteLength(themeCss);
await fs.writeFile(path.join(here,'feed-diag.json'),JSON.stringify(res,null,2)+'\n');
await page.screenshot({path:path.join(here,'feed-diag-before.png'),clip:{x:0,y:0,width:700,height:520}});
console.log(JSON.stringify(res,null,2));
await browser.close();
