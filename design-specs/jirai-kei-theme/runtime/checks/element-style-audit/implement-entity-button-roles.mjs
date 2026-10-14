import fs from 'node:fs/promises';
import path from 'node:path';
const here=path.dirname(new URL(import.meta.url).pathname),repo='/home/fulutang/Documents/Github/VRCX-0-jirai';
const entries=JSON.parse(await fs.readFile(path.join(here,'b054-b112-current-source.json'),'utf8'));
const selected=entries.filter(e=>+e.id.slice(1)>=55&&+e.id.slice(1)<=72&&!['B069'].includes(e.id)&&!(e.id==='B057'&&e.body.includes('BioLinkFavicon'))&&!(e.id==='B058'&&e.body.includes('currentGalleryImage'))&&!(e.id==='B060'&&e.body.includes('restrictions.length'))&&!(e.id==='B063'&&e.body.includes('text-right')));
// B081 activity refresh is an action, not an identity circle.
selected.push(entries.find(e=>e.id==='B081'&&e.file.endsWith('UserActivityPanelImpl.tsx')));
const files=[...new Set(selected.map(e=>e.file))];
for(const file of files){let text=await fs.readFile(path.join(repo,'src',file),'utf8');const lines=text.split('\n');for(const e of selected.filter(e=>e.file===file).sort((a,b)=>b.line-a.line)){if(!lines[e.line-1].includes('<Button'))throw Error('drift '+JSON.stringify(e));lines[e.line-1]=lines[e.line-1].replace('<Button','<Button data-ui-role="action"');}text=lines.join('\n');if(file.endsWith('useGroupModerationColumns.tsx'))text=text.replace('                                    className="transition-transform duration-[140ms] ease-out active:scale-[0.97]"\n','');if(file.endsWith('UserDialogInfoTab.tsx'))text=text.replace("variant={showHistory ? 'secondary' : 'ghost'}","variant={showHistory ? 'secondary' : 'ghost'}\n                                aria-expanded={showHistory}");await fs.writeFile(path.join(repo,'src',file),text);}
console.log(JSON.stringify({sites:selected.length,files},null,2));
