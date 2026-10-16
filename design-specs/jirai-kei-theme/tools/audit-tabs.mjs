#!/usr/bin/env node
// Read-only TSX inventory; opening-element counts, not rendered instance counts.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const app=process.env.APP_ROOT||path.resolve(base,'../../../VRCX-0-jirai');
const {parse}=createRequire(path.join(app,'package.json'))('@babel/parser');
const rows=[];
function scan(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,item.name); if(item.isDirectory()){scan(file);continue;}
 if(!file.endsWith('.tsx'))continue;
 const text=fs.readFileSync(file,'utf8');
 const src=parse(text,{sourceType:'module',plugins:['typescript','jsx']});
 const names=new Map();
 for(const stmt of src.program.body)if(stmt.type==='ImportDeclaration'){
  const mod=stmt.source.value;
  for(const e of stmt.specifiers)if(e.type==='ImportSpecifier'){
   const original=e.imported.name;
   if((mod.endsWith('/tabs')&&['Tabs','TabsList','TabsTrigger','TabsTab'].includes(original))||(mod.endsWith('/ToolbarControls')&&original==='ToolbarTabs'))names.set(e.local.name,original);
  }
 }
 const attrs=n=>Object.fromEntries(n.attributes.map(a=>a.type==='JSXAttribute'?[a.name.name,a.value?text.slice(a.value.start,a.value.end):true]:['...spread',text.slice(a.start,a.end)]));
 function walk(n,parents=[]){if(!n||typeof n!=='object')return;
  if(n.type==='JSXOpeningElement'){
   const name=names.get(n.name.name);
   if(name){const ancestor=[...parents].reverse().find(p=>p.type==='JSXElement'&&p.openingElement!==n&&names.get(p.openingElement.name.name)==='Tabs');
    rows.push({file:path.relative(app,file),line:n.loc.start.line,name,attributes:attrs(n),root:ancestor?attrs(ancestor.openingElement):null,test:/\.(test|spec)\.tsx$/.test(file)});
   }
  }
  for(const [k,v]of Object.entries(n))if(!['loc','tokens','comments'].includes(k)){if(Array.isArray(v))v.forEach(x=>walk(x,[...parents,n]));else if(v&&typeof v==='object')walk(v,[...parents,n]);}
 }walk(src);
}}
scan(path.join(app,'src'));
const count=items=>Object.fromEntries(['Tabs','TabsList','TabsTrigger','TabsTab','ToolbarTabs'].map(name=>[name,items.filter(r=>r.name===name).length]));
console.log(JSON.stringify({app,production:count(rows.filter(r=>!r.test)),tests:count(rows.filter(r=>r.test)),rows},null,2));
