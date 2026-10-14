import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const repo='/home/fulutang/Documents/Github/VRCX-0-jirai';
const require=createRequire(path.join(repo,'package.json'));
const {parse}=require('@babel/parser');
const gallery=await fs.readFile(path.join(here,'button-gallery.html'),'utf8');
const entries=[];
for(const group of gallery.matchAll(/<li><strong><code>(B\d+)<\/code>([\s\S]*?)<\/details><\/li>/g)){
  if(+group[1].slice(1)<73||+group[1].slice(1)>100)continue;
  for(const site of group[2].matchAll(/<code>([^<]+\.tsx):(\d+)<\/code>/g))entries.push({id:group[1],file:site[1],galleryLine:+site[2]});
}
const cache=new Map();
for(const entry of entries){
  if(!cache.has(entry.file)){
    const text=await fs.readFile(path.join(repo,'src',entry.file),'utf8');
    const ast=parse(text,{sourceType:'module',plugins:['typescript','jsx']});
    const buttons=[];
    function walk(n,anc=[]){if(!n||typeof n!=='object')return;if(n.type==='JSXElement'){
      const tag=n.openingElement.name.name;
      if(tag==='Button')buttons.push({n,anc});
      for(const c of n.children||[])walk(c,[...anc,tag]);
      for(const a of n.openingElement.attributes||[])walk(a.value,[...anc,tag]);return;
    }for(const [k,v]of Object.entries(n)){if(['loc','start','end','extra'].includes(k))continue;if(Array.isArray(v))for(const c of v)walk(c,anc);else if(v&&typeof v==='object')walk(v,anc)}}
    walk(ast);cache.set(entry.file,{text,buttons});
  }
  const {text,buttons}=cache.get(entry.file);
  const {n,anc}=buttons.reduce((best,x)=>Math.abs(x.n.loc.start.line-entry.galleryLine)<Math.abs(best.n.loc.start.line-entry.galleryLine)?x:best);
  if(Math.abs(n.loc.start.line-entry.galleryLine)>5)throw Error('Site drift: '+JSON.stringify(entry));
  const opening=text.slice(n.openingElement.start,n.openingElement.end).replace(/\s+/g,' ');
  const body=text.slice(n.openingElement.end,n.closingElement?.start||n.end).replace(/\s+/g,' ').slice(0,230);
  const get=k=>n.openingElement.attributes.find(a=>a.name?.name===k);
  const val=k=>{const a=get(k);return a?.value?.value|| (a?.value?text.slice(a.value.start,a.value.end):'')};
  const cls=val('className'),variant=val('variant')||'default';
  let responsibility='ordinary '+variant+' action';
  if(anc.includes('TileShell')||val('data-ui-role')==='tile'||/rounded-full/.test(cls)&&/size-11|p-0/.test(cls)||/h-auto/.test(cls)&&/FadeInImage/.test(body))responsibility='protected image/avatar Tile';
  else if(val('data-ui-role')==='text-link'||variant==='link')responsibility='protected text link';
  else if(val('data-ui-role')==='disclosure'||anc.includes('CollapsibleTrigger')||/h-auto.*justify-between/.test(cls))responsibility='protected disclosure/title row';
  else if(entry.file.endsWith('NavIconPicker.tsx'))responsibility='protected dense icon grid (secondary selected vs ghost)';
  else if(/h-auto/.test(cls)&&/justify-start/.test(cls))responsibility=/p-0/.test(cls)?'protected text/entity row or UserPickerRow':'protected choice/entity row (selected paint source-owned)';
  else if(/absolute inset-0 h-full w-full/.test(cls))responsibility='protected table-cell overlay';
  else if(/rounded-full/.test(cls))responsibility='protected dedicated circular icon';
  else if(val('data-ui-role')==='color-swatch')responsibility='protected color swatch (inline color + selected ring)';
  else if(Math.max(anc.lastIndexOf('DialogHeader'),anc.lastIndexOf('AlertDialogHeader'))>Math.max(anc.lastIndexOf('PopoverContent'),anc.lastIndexOf('HoverCardContent')))responsibility='protected title-bar action';
  else if(entry.file.endsWith('AccountSwitcherPopover.tsx'))responsibility='protected account choice-list row';
  else if(entry.file==='ui/shadcn/dialog.tsx'&&entry.galleryLine===84)responsibility='protected dedicated dialog close';
  else if(/rounded-[rl]-none|border-r-0/.test(cls))responsibility+='; joined border geometry retained';
  else if(entry.file.endsWith('GroupEventRow.tsx'))responsibility+='; ancestor hover/focus reveal retained';
  if(entry.file.endsWith('AvatarOwnerEditDialogs.tsx')&&entry.galleryLine===89)responsibility='protected avatar choice row (parent selected fill + aria-pressed)';
  if(entry.file.endsWith('GroupPostEditorDialog.tsx')&&entry.galleryLine===332)responsibility='protected image choice row (border-primary selection)';
  if(entry.file.endsWith('PreviousInstancesViewParts.tsx')&&entry.galleryLine===637)responsibility='ordinary ghost|outline icon-xs copy (runtime prop; gallery default is heuristic)';
  entry.line=n.loc.start.line;entry.responsibility=responsibility;entry.opening=opening;entry.body=body;entry.ancestors=anc;
}
await fs.writeFile(path.join(here,'b073-b100-source-review.json'),JSON.stringify(entries,null,2)+'\n');
await fs.writeFile(path.join(here,'b073-b100-source-review.md'),'# B073–B100 逐源码职责清单\n\n原图库行号映射至当前源码；每一项独立列出，不以 B 聚类代替职责。源码静态结构不等于线上运行状态。\n\n'+entries.map(e=>`- ${e.id} ${e.file}:${e.line} — ${e.responsibility}\n  - ${e.opening}\n  - children: ${e.body}`).join('\n')+'\n');
console.log(JSON.stringify({sites:entries.length,files:cache.size,roles:entries.reduce((a,e)=>(a[e.responsibility]=(a[e.responsibility]||0)+1,a),{})},null,2));
