import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const repo='/home/fulutang/Documents/Github/VRCX-0-jirai';
const req=createRequire(path.join(repo,'package.json'));
const {build}=await import(fileURLToPath(new URL('file://'+req.resolve('vite'))));
const react=(await import(fileURLToPath(new URL('file://'+req.resolve('@vitejs/plugin-react'))))).default;
process.env.PLAYWRIGHT_BROWSERS_PATH||='/tmp/dsh-theme-browsers';
const {chromium}=await import('/tmp/dsh-theme-tools/node_modules/playwright/index.mjs');
const tmp=await fs.mkdtemp('/tmp/jirai-b073-b100-');
const themePath=path.resolve(here,'../../preview-package/jirai-kei-theme/theme.css');
const current=await fs.readFile(themePath,'utf8');
const baseline=current.split('/* SECTION portal-button-roles-b073-b100 */')[0];
const combos=[['outline','sm'],['ghost','sm'],['secondary','default'],['default','default'],['ghost','default'],['outline','icon-sm'],['outline','default'],['outline','xs'],['ghost','icon-sm'],['default','sm'],['destructive','sm'],['secondary','sm'],['ghost','icon-xs'],['default','icon-xs'],['outline','icon-xs'],['destructive','default'],['link','sm'],['link','default'],['secondary','icon-xs'],['ghost','icon'],['destructive','icon-xs']];
const entry=path.join(tmp,'fixture.tsx');
const code=`import React,{useState} from '${repo}/node_modules/react/index.js';
import {createRoot} from '${repo}/node_modules/react-dom/client.js';
import {Button} from '${repo}/src/ui/shadcn/button';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter} from '${repo}/src/ui/shadcn/dialog';
import {Popover,PopoverContent,PopoverTrigger} from '${repo}/src/ui/shadcn/popover';
import {TooltipProvider,Tooltip,TooltipTrigger} from '${repo}/src/ui/shadcn/tooltip';
import {TileShell} from '${repo}/src/components/tile/TileShell';
const combos=${JSON.stringify(combos)};
function Buttons({prefix}){return <div>{combos.map(([variant,size],i)=><Button key={i} id={prefix+'-'+(73+i)} variant={variant} size={size}>B{73+i}</Button>)}</div>}
function App(){const [count,setCount]=useState(0);return <TooltipProvider><div id="root-evidence" data-count={count}>
<Dialog open modal={false}><DialogContent id="ordinary-dialog"><DialogHeader className="flex-row"><DialogTitle>Ordinary dialog</DialogTitle><Button id="title-action" size="sm" variant="ghost">Header</Button></DialogHeader><Buttons prefix="dialog"/>
<Tooltip><TooltipTrigger render={<Button id="tooltip-action" variant="outline" size="icon-xs">Copy</Button>}/></Tooltip><Tooltip><TooltipTrigger render={<Button id="copy-runtime-ghost" variant="ghost" size="icon-xs">Copy default ghost</Button>}/></Tooltip><Button id="note-include" variant="ghost" size="icon" className="text-primary">Include</Button><Button id="note-skip" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">Skip</Button>
<div className="inline-flex max-w-52 items-center"><Button id="joined-apply" variant="outline" size="xs" className="min-w-0 justify-start rounded-r-none border-r-0">Preset</Button><Button id="joined-remove" variant="outline" size="icon-xs" className="shrink-0 rounded-l-none">X</Button></div>
<TileShell id="tile" selected className="size-20 p-0" render={<Button variant="ghost"/>}><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'/%3E"/></TileShell>
<Button id="image-tile" variant="ghost" size="icon" className="bg-muted size-11 shrink-0 overflow-hidden rounded-full border p-0"><img alt=""/></Button>
<Button id="badge-tile" variant="ghost" className="bg-muted/20 hover:bg-muted/30 h-auto w-full rounded-none p-3"><img className="max-h-52 w-full rounded-md object-contain"/></Button>
<Button id="entity-text" variant="ghost" className="h-auto max-w-full justify-start p-0 text-left text-xs hover:bg-transparent">Entity name</Button>
<Button id="avatar-row" variant="ghost" aria-pressed className="h-auto min-w-0 flex-1 justify-start p-1.5 text-left"><img className="mr-2.5 size-9 rounded-full"/>Avatar</Button>
<Button id="circle" variant="ghost" size="icon-sm" className="rounded-full">Refresh</Button>
<Button id="swatch" variant="outline" size="icon-sm" data-ui-role="color-swatch" aria-pressed className="ring-ring size-6 p-0 ring-2 ring-offset-2" style={{backgroundColor:'#e32773'}}/>
<Button id="text-link" variant="ghost" size="sm" data-ui-role="text-link">License</Button>
<div id="reveal-parent" className="group/card relative"><div id="reveal" className="pointer-events-none absolute top-2 right-2 z-20 flex opacity-0 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100 group-hover/card:pointer-events-auto group-hover/card:opacity-100"><Button id="reveal-action" variant="secondary" size="icon-xs" aria-pressed>Star</Button></div></div>
<DialogFooter><Button id="footer-cancel" variant="outline">Cancel</Button><Button id="footer-confirm" onClick={()=>setCount(c=>c+1)}>Confirm</Button></DialogFooter></DialogContent></Dialog>
<Dialog open modal={false}><DialogContent id="entity-dialog" className="entity-dialog"><DialogHeader><DialogTitle>Entity</DialogTitle></DialogHeader><Button id="entity-protected" variant="outline">Entity action</Button></DialogContent></Dialog>
<Dialog open modal={false}><DialogContent id="owner-dialog" className="owner-dialog"><DialogHeader><DialogTitle>Owner</DialogTitle></DialogHeader><Button id="owner-protected" variant="outline">Owner action</Button></DialogContent></Dialog>
<Popover open><PopoverTrigger render={<Button id="popover-anchor">Portal</Button>}/><PopoverContent id="ordinary-popover"><Buttons prefix="popover"/><div data-slot="dropdown-menu-content"><button id="nested-menu-old" data-slot="dropdown-menu-item" data-variant="destructive">Nested menu</button></div><Button id="popover-clear" variant="outline" size="sm">Clear</Button><Button id="popover-confirm" size="sm">Confirm</Button><Button id="zoom-out" variant="outline" size="icon" className="size-10 shrink-0">-</Button><Button id="zoom-reset" variant="outline" className="h-10 min-w-0 flex-1 gap-2 px-3">100%</Button><Button id="disclosure" variant="ghost" size="sm" data-ui-role="disclosure" aria-expanded className="text-muted-foreground h-auto w-full justify-between px-0 py-0.5 text-xs font-medium tracking-wide uppercase">Advanced</Button><Button id="name-row" variant="ghost" className="h-auto w-full justify-start p-1.5 text-left font-normal">Nickname</Button><Button id="picker-row" variant="ghost" className="h-auto justify-start p-0"><span className="flex w-full items-center p-1.5 text-left text-sm"><span className="bg-muted mr-2.5 size-9 rounded-full border"/><span>User</span><svg className="ml-auto size-4 opacity-100"/></span></Button></PopoverContent></Popover>
<Popover open><PopoverTrigger render={<Button>Grid</Button>}/><PopoverContent id="grid" data-ui-role="icon-grid" className="grid w-auto grid-cols-8 gap-1 p-2"><Button id="grid-selected" variant="secondary" size="icon-sm" aria-pressed className="text-primary">S</Button><Button id="grid-idle" variant="ghost" size="icon-sm" aria-pressed={false}>G</Button></PopoverContent></Popover>
<Popover open><PopoverTrigger render={<Button>Accounts</Button>}/><PopoverContent data-ui-role="choice-list"><Button id="account-current" variant="ghost" aria-current="true" className="aria-[current=true]:bg-accent/60 h-auto w-full min-w-0 justify-start gap-2.5 p-1.5 text-left font-normal">Current</Button><Button id="account-other" variant="ghost" className="w-full justify-start font-normal">Other account</Button></PopoverContent></Popover>
<div className="vrcx-0-main-content"><Button id="main-old" variant="outline">Main</Button><Button id="severity-old" variant="ghost" className="bg-red-50">Error</Button><div className="vrcx-0-page-toolbar"><Button id="toolbar-old" variant="outline">Toolbar</Button></div></div>
<div data-slot="dropdown-menu-content"><div id="menu-old" data-slot="dropdown-menu-item">Menu</div></div>
<div data-slot="dialog-content" id="fullscreen" className="bg-background/90 fixed inset-x-0 top-8 bottom-0 left-0 h-auto max-h-none w-screen max-w-none translate-x-0 translate-y-0 overflow-hidden rounded-none border-0 p-4 shadow-none ring-0"><div role="presentation" className="bg-background/80 absolute top-3 right-3 left-3 z-20 flex flex-wrap items-center justify-end gap-2 rounded-lg border px-2 py-1 shadow-sm backdrop-blur"><Tooltip><TooltipTrigger render={<Button id="viewer-copy" variant="ghost" size="icon">Copy</Button>}/></Tooltip><Button id="viewer-download" variant="ghost" size="icon">Download</Button></div><img id="viewer-image" style={{transform:'translate(10px,20px) scale(1.2)'}}/></div>
</div></TooltipProvider>};createRoot(document.getElementById('app')).render(<App/>);`;
await fs.writeFile(entry,code);
await build({configFile:false,root:repo,define:{'process.env.NODE_ENV':JSON.stringify('production')},plugins:[react()],resolve:{alias:{'@':path.join(repo,'src'),'react':path.join(repo,'node_modules/react'),'react-dom':path.join(repo,'node_modules/react-dom')}},build:{outDir:path.join(tmp,'out'),emptyOutDir:false,lib:{entry,name:'PortalProbe',formats:['iife'],fileName:()=> 'fixture.js'},minify:false}});
const appCss=(await fs.readdir(path.join(repo,'dist/assets'))).filter(n=>/^(index|App)-.*\.css$/.test(n)).sort((a,b)=>a.startsWith('index')?-1:1);
const css=await Promise.all(appCss.map(n=>fs.readFile(path.join(repo,'dist/assets',n),'utf8')));
const js=await fs.readFile(path.join(tmp,'out/fixture.js'),'utf8');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1800}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.setContent('<html class="dark"><head>'+css.map(c=>'<style>'+c+'</style>').join('')+'<style id="theme">'+baseline+'</style><style id="probe-layout">*,::before,::after{transition:none!important;animation:none!important}html,body{overflow:auto!important;height:auto!important} [data-slot$="dialog-content"],[data-slot="popover-content"]{position:relative!important;inset:auto!important;transform:none!important;translate:none!important;animation:none!important;max-height:none!important;max-width:none!important;overflow:visible!important;margin:20px!important} [data-slot="dialog-overlay"]{display:none!important} [data-base-ui-portal]{position:static!important} #fullscreen{min-height:100px} #ordinary-dialog{width:95vw!important}</style></head><body><div id="app"></div></body></html>');
await page.addScriptTag({content:js});
try{await page.waitForSelector('#popover-confirm',{state:'attached',timeout:10000})}catch(e){console.error('fixture errors',errors);console.error((await page.locator('body').innerHTML()).slice(0,3000));await browser.close();throw e}
await page.evaluate(()=>{for(const p of document.querySelectorAll('[data-slot="popover-content"]')){p.parentElement.style.position='relative';p.parentElement.style.transform='none'}});
const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
const {root}=await cdp.send('DOM.getDocument',{depth:-1});
const ids=await page.locator('button[id],#menu-old,#viewer-image,#reveal,#fullscreen').evaluateAll(es=>es.map(e=>e.id));
const states=['base','hover','active','focus-visible','disabled','aria-disabled','expanded','pressed','expanded-hover','pressed-hover','disabled-hover'];
const props=['backgroundColor','color','borderRadius','borderTopWidth','borderRightWidth','borderLeftWidth','borderColor','boxShadow','outlineColor','outlineStyle','outlineWidth','transform','translate','opacity','filter','width','height','padding','pointerEvents','display','textDecorationLine'];
async function sample(css){await page.locator('#theme').evaluate((e,s)=>e.textContent=s,css);const result={};for(const id of ids){const el=page.locator('#'+id);const attrs=await el.evaluate(e=>Object.fromEntries(['disabled','aria-disabled','aria-expanded','aria-pressed'].map(k=>[k,e.getAttribute(k)])));const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'#'+id});result[id]={};for(const state of states){await el.evaluate((e,{attrs,state})=>{for(const [k,v]of Object.entries(attrs))v===null?e.removeAttribute(k):e.setAttribute(k,v);if(state.startsWith('disabled'))e.setAttribute('disabled','');if(state==='aria-disabled')e.setAttribute('aria-disabled','true');if(state.startsWith('expanded'))e.setAttribute('aria-expanded','true');if(state.startsWith('pressed'))e.setAttribute('aria-pressed','true')},{attrs,state});await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:state.includes('hover')?['hover']:['active','focus-visible'].includes(state)?[state]:[]});result[id][state]=await el.evaluate((e,props)=>{const s=getComputedStyle(e);return Object.fromEntries(props.map(p=>[p,s[p]]))},props)}await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:[]});await el.evaluate((e,attrs)=>{for(const[k,v]of Object.entries(attrs))v===null?e.removeAttribute(k):e.setAttribute(k,v)},attrs)}return result}
const before=await sample(baseline),after=await sample(current);
const checks=[];const check=(name,pass,detail)=>checks.push({name,pass:!!pass,detail});
for(const prefix of ['dialog','popover'])for(let i=0;i<combos.length;i++){
 const [variant]=combos[i],id=prefix+'-'+(73+i),v=after[id];
 check(id+' square',v.base.borderRadius==='0px',v.base.borderRadius);
 if(variant!=='link'){check(id+' active bevel',v.active.boxShadow!==v.base.boxShadow&&v.active.transform!=='none',v.active);check(id+' latched survives hover',v['pressed-hover'].boxShadow===v.pressed.boxShadow&&v['expanded-hover'].boxShadow===v.expanded.boxShadow,{pressed:v.pressed.boxShadow,hover:v['pressed-hover'].boxShadow})}
 check(id+' focus',v['focus-visible'].outlineStyle==='solid'&&v['focus-visible'].outlineWidth==='2px',v['focus-visible'].outlineWidth);
 check(id+' disabled no active offset',v.disabled.transform==='none'&&+v.disabled.opacity<1,v.disabled.opacity);
 check(id+' disabled hover paint stable',v['disabled-hover'].backgroundColor===v.disabled.backgroundColor,{disabled:v.disabled.backgroundColor,hover:v['disabled-hover'].backgroundColor});
}
const protectedIds=['tile','image-tile','badge-tile','entity-text','avatar-row','circle','swatch','grid-selected','grid-idle','title-action','entity-protected','owner-protected','main-old','severity-old','toolbar-old','menu-old','nested-menu-old','viewer-image','fullscreen'];
for(const id of protectedIds)check(id+' before/after all states unchanged',JSON.stringify(before[id])===JSON.stringify(after[id]),{before:before[id].base,after:after[id].base});
for(const id of ['joined-apply','joined-remove','zoom-out','zoom-reset'])check(id+' dimensions preserved',['width','height','padding','borderRightWidth','borderLeftWidth'].every(p=>before[id].base[p]===after[id].base[p]),after[id].base);
check('joined apply right seam',after['joined-apply'].base.borderRightWidth==='0px',after['joined-apply'].base.borderRightWidth);
check('joined halves depress without opening seam',after['joined-apply'].active.transform==='none'&&after['joined-remove'].active.transform==='none'&&after['joined-apply'].active.translate==='none'&&after['joined-remove'].active.translate==='none');
check('popover danger focus retains readable red face',after['popover-83']['focus-visible'].backgroundColor==='rgb(255, 107, 138)'&&after['popover-83']['focus-visible'].color==='rgb(22, 17, 42)',after['popover-83']['focus-visible']);
check('reveal remains hidden',after.reveal.base.opacity==='0'&&after.reveal.base.pointerEvents==='none',after.reveal.base);
const {nodeId:revealParent}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'#reveal-parent'});
for(const pseudo of ['hover','focus-within']){await cdp.send('CSS.forcePseudoState',{nodeId:revealParent,forcedPseudoClasses:[pseudo]});check('reveal '+pseudo+' remains operable',await page.locator('#reveal').evaluate(e=>{const s=getComputedStyle(e);return s.opacity==='1'&&s.pointerEvents==='auto'}))}await cdp.send('CSS.forcePseudoState',{nodeId:revealParent,forcedPseudoClasses:[]});
check('B086 source ghost default and outline prop both themed',after['copy-runtime-ghost'].hover.backgroundColor==='rgb(57, 42, 82)'&&after['tooltip-action'].base.backgroundColor==='rgb(33, 26, 51)');
check('NoteExport include/skip semantic colour retained',after['note-include'].base.color==='rgb(255, 184, 230)'&&after['note-skip'].hover.color===after['dialog-83'].base.color,{include:after['note-include'].base.color,skip:after['note-skip'].hover.color});
check('disclosure flat',after.disclosure.base.boxShadow==='none'&&after.disclosure.pressed.boxShadow==='none',after.disclosure.base);
check('list flat hover feedback',after['name-row'].hover.backgroundColor!==after['name-row'].base.backgroundColor&&!after['name-row'].base.boxShadow.includes('inset'),after['name-row']);
check('current account retains paint',after['account-current'].base.backgroundColor===before['account-current'].base.backgroundColor&&after['account-current'].hover.backgroundColor===before['account-current'].hover.backgroundColor,after['account-current']);
check('other account theme row hover',after['account-other'].hover.backgroundColor==='rgb(57, 42, 82)',after['account-other'].hover);
check('picker child selected visible',await page.locator('#picker-row svg').evaluate(e=>getComputedStyle(e).opacity==='1'));
check('tooltip render slot replaced but themed',await page.locator('#tooltip-action').getAttribute('data-slot')==='tooltip-trigger'&&after['tooltip-action'].base.borderRadius==='0px',await page.locator('#tooltip-action').getAttribute('data-slot'));
check('fullscreen copy/download ghost feedback',after['viewer-copy'].hover.backgroundColor==='rgb(57, 42, 82)'&&after['viewer-download'].hover.backgroundColor==='rgb(57, 42, 82)',after['viewer-copy'].hover);
check('danger retains red family',after['dialog-83'].base.color===after['dialog-88'].base.color&&after['dialog-83'].hover.backgroundColor==='rgb(255, 107, 138)',after['dialog-83']);
await page.locator('#footer-confirm').evaluate(e=>e.click());check('ordinary footer action still executes',await page.locator('#root-evidence').getAttribute('data-count')==='1');
check('no browser runtime errors',errors.length===0,errors);
await page.screenshot({path:path.join(here,'shots/b073-b100-roles.png'),fullPage:true});
const report={fixture:'Actual React Button/Dialog/Popover/Tooltip/TileShell components; source-derived responsibility subtrees, not authenticated business routes',themeBytes:Buffer.byteLength(current),headroom:1048576-Buffer.byteLength(current),ids:ids.length,states,checks,failures:checks.filter(c=>!c.pass),before,after,errors};
await fs.writeFile(path.join(here,'b073-b100-probe.json'),JSON.stringify(report,null,2)+'\n');
await fs.writeFile(path.join(here,'b073-b100-probe.md'),'# Chromium 实际 primitive / portal 结构探针\n\n'+report.fixture+'\n\n'+`- CSS: ${report.themeBytes} bytes；余量 ${report.headroom}\n- ${ids.length} 元素 × ${states.length} 状态，${checks.length} 断言，失败 ${report.failures.length}\n\n`+checks.map(c=>`- ${c.pass?'PASS':'FAIL'} ${c.name}`).join('\n')+'\n');
await browser.close();console.log(JSON.stringify({tmp,checks:checks.length,failures:report.failures},null,2));if(report.failures.length)process.exitCode=1;
