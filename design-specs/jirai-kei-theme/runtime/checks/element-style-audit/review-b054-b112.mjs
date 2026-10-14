import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const repo='/home/fulutang/Documents/Github/VRCX-0-jirai';
const {parse}=createRequire(path.join(repo,'package.json'))('@babel/parser');
const gallery=await fs.readFile(path.join(here,'button-gallery.html'),'utf8');
const entries=[],cache=new Map();
for(const g of gallery.matchAll(/<li><strong><code>(B\d+)<\/code>([\s\S]*?)(?=<li><strong><code>B\d+<\/code>|<\/ul><\/details>\s*<\/section>)/g)){
 const id=+g[1].slice(1);if(id<54||id>112)continue;
 for(const s of g[2].matchAll(/<code>([^<]+\.tsx):(\d+)<\/code>/g))entries.push({id:g[1],file:s[1],galleryLine:+s[2]});
}
for(const e of entries){
 if(!cache.has(e.file)){
  const text=await fs.readFile(path.join(repo,'src',e.file),'utf8'),ast=parse(text,{sourceType:'module',plugins:['typescript','jsx']}),buttons=[];
  function walk(n,anc=[]){if(!n||typeof n!=='object')return;if(n.type==='JSXElement'){const tag=n.openingElement.name.name;if(tag==='Button')buttons.push({n,anc});for(const c of n.children||[])walk(c,[...anc,tag]);for(const a of n.openingElement.attributes||[])walk(a.value,[...anc,tag]);return;}for(const[k,v]of Object.entries(n)){if(['loc','start','end','extra'].includes(k))continue;if(Array.isArray(v))for(const c of v)walk(c,anc);else if(v&&typeof v==='object')walk(v,anc)}}walk(ast);cache.set(e.file,{text,buttons});
 }
 const{text,buttons}=cache.get(e.file),b=buttons.reduce((a,b)=>Math.abs(b.n.loc.start.line-e.galleryLine)<Math.abs(a.n.loc.start.line-e.galleryLine)?b:a);
 e.line=b.n.loc.start.line;e.drift=e.line-e.galleryLine;e.ancestors=b.anc;e.opening=text.slice(b.n.openingElement.start,b.n.openingElement.end).replace(/\s+/g,' ');e.body=text.slice(b.n.openingElement.end,b.n.closingElement?.start||b.n.end).replace(/\s+/g,' ').slice(0,600);
 if(Math.abs(e.drift)>12)throw Error(JSON.stringify(e));
}
await fs.writeFile(path.join(here,'b054-b112-current-source.json'),JSON.stringify(entries,null,2)+'\n');
await fs.writeFile(path.join(here,'b054-b072-b101-b112-current-source.md'),entries.filter(e=>+e.id.slice(1)<73||+e.id.slice(1)>100).map(e=>`- ${e.id} ${e.file}:${e.line} [${e.ancestors.join(' > ')}]\n  ${e.opening}\n  ${e.body}`).join('\n')+'\n');
console.log(JSON.stringify({sites:entries.length,files:cache.size,groups:entries.reduce((a,e)=>(a[e.id]=(a[e.id]||0)+1,a),{})},null,2));
