/* R4 feed badges — systematic "SSR lucide class -> jirai-icons.css selector" coverage audit.
   Read-only against the app checkout. NOT Windows/WebView acceptance. */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const app='/home/fulutang/Documents/Github/VRCX-0-jirai';
const theme='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const req=createRequire(app+'/package.json');
const React=req('react'),{renderToStaticMarkup}=req('react-dom/server');
const lucide=req('lucide-react');

function walk(d,out=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);
 if(e.isDirectory()){if(!/node_modules|\.git/.test(e.name))walk(p,out);}else if(/\.(ts|tsx)$/.test(e.name))out.push(p);}return out;}

/* 1. every lucide-react import identifier referenced by src */
const used=new Map(); /* identifier -> files */
for(const f of walk(path.join(app,'src'))){
  const s=fs.readFileSync(f,'utf8');
  const re=/import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*["']lucide-react["']/gs;
  let m;while((m=re.exec(s))){
    for(const raw of m[1].split(',')){
      const t=raw.trim().replace(/^type\s+/,'').split(/\s+as\s+/)[0].trim();
      if(t&&t!=='LucideIcon'){if(!used.has(t))used.set(t,new Set());used.get(t).add(path.relative(app,f));}
    }
  }
}

/* 2. real SSR class attribute per identifier */
const ssr=new Map();let unresolvable=[];
for(const id of used.keys()){
  const C=lucide[id];
  if(typeof C!=='function'&&typeof C!=='object'){unresolvable.push(id);continue;}
  let html;
  try{html=renderToStaticMarkup(React.createElement(C));}catch(e){unresolvable.push(id+' :: '+e.message);continue;}
  const cls=(/class="([^"]*)"/.exec(html)||[])[1]||'';
  const vb=(/viewBox="([^"]*)"/.exec(html)||[])[1]||'';
  const inner=html.replace(/^<svg[^>]*>/,'').length;
  ssr.set(id,{cls,vb,inner,html});
}

/* 3. jirai-icons.css coverage selector list (the rule that paints the mask) */
const css=fs.readFileSync(path.join(theme,'original-assets/icons/dist/jirai-icons.css'),'utf8');
const union=/svg\.lucide:is\(([^)]*)\)\{background-color/.exec(css);
const covered=new Set([...union[1].matchAll(/\.lucide-([a-z0-9-]+)/g)].map(z=>z[1]));
const vars=new Set([...css.matchAll(/svg\.lucide-([a-z0-9-]+)\{--px/g)].map(z=>z[1]));

/* 4. compare: the class actually emitted must appear in the :is() union */
const rows=[],miss=[];
for(const [id,info] of ssr){
  const clsNames=[...info.cls.matchAll(/(?:^|\s)lucide-([a-z0-9-]+)/g)].map(z=>z[1]).filter(n=>n!=='icon');
  const hit=clsNames.some(n=>covered.has(n));
  const row={id,cls:info.cls,vb:info.vb,children:info.inner>0,covered:clsNames.filter(n=>covered.has(n)),cssVars:clsNames.filter(n=>vars.has(n)),hit,files:[...used.get(id)].slice(0,3)};
  rows.push(row);if(!hit)miss.push(row);
}
miss.sort((a,b)=>a.id.localeCompare(b.id));
const byId=new Map(rows.map(r=>[r.id,r]));
const focus=['MapPinIcon','LogInIcon','LogOutIcon','PencilLineIcon','PersonStandingIcon','FileTextIcon','LockIcon','ArrowRightIcon'];
const report={audit:'SSR lucide class -> jirai-icons.css :is() union',identifiers:used.size,ssrRendered:ssr.size,unresolvable,coveredSelectors:covered.size,declaredVars:vars.size,missingCount:miss.length,missing:miss,focus:focus.map(id=>byId.get(id)||{id,note:'not imported in src'})};
fs.writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname),'ssr-icon-hits.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({identifiers:report.identifiers,ssrRendered:report.ssrRendered,unresolvable:report.unresolvable,coveredSelectors:report.coveredSelectors,declaredVars:report.declaredVars,missingCount:report.missingCount},null,1));
console.log('--- MISSING ---');
for(const m of miss)console.log(m.id,'|',m.cls,'| vb',m.vb,'| children',m.children,'|',m.files.join(','));
console.log('--- FOCUS ---');
for(const f of report.focus)console.log(f.id,'|',f.cls,'| hit',f.hit,'| covered',f.covered);
