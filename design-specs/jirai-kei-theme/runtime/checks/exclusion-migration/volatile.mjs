/* volatile.mjs --runtime <dir> --out <json> : every runtime/*.css selector that depends on Tailwind STYLE utility classes
 * (class selectors, [class~=..]/[class*=..]/[class^=..] attribute selectors).  Semantic hooks (data-*, role, element type,
 * .vrcx-0-*, .entity-dialog, .lucide-*, ...) are not reported. */
import fs from 'node:fs'; import path from 'node:path';
import {postcss, selectorParser, splitSelectorList} from './common.mjs';
const argv=process.argv.slice(2); const opt=(n,d)=>{const i=argv.indexOf('--'+n);return i>=0?argv[i+1]:d;};
const RT=path.resolve(opt('runtime','../..')); const OUT=opt('out');
const STYLE=/^(-?(w|h|size|min-w|max-w|min-h|max-h|p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y|flex|grow|shrink|basis|order|top|bottom|left|right|inset|inset-x|inset-y|z|text|font|leading|tracking|bg|border|rounded|shadow|ring|opacity|overflow|overflow-x|overflow-y|whitespace|items|justify|self|content|grid|col|row|aspect|object|cursor|pointer-events|select|transition|duration|ease|animate|translate|rotate|scale|accent|outline|line-clamp|backdrop|blur|fill|stroke|divide|text-balance|text-pretty)(-.+)?|truncate|relative|absolute|fixed|sticky|block|inline|inline-flex|inline-block|hidden|grid|flex|border|italic|underline|uppercase|lowercase|capitalize|sr-only|tabular-nums|contents|shrink-0|grow|group|peer)$/;
const out=[];
for(const f of fs.readdirSync(RT).filter(f=>f.endsWith('.css'))){
  const root=postcss.parse(fs.readFileSync(path.join(RT,f),'utf8'),{from:f});
  root.walkRules(rule=>{
    for(let p=rule.parent;p&&p.type!=='root';p=p.parent) if(p.type==='atrule'&&/keyframes/.test(p.name)) return;
    const toks=new Set();
    try{ selectorParser(r=>{ r.walk(n=>{
      if(n.type==='class'){ const v=n.value.replace(/\\/g,''); if(STYLE.test(v.replace(/^.*?:/,''))) toks.add('.'+v); }
      if(n.type==='attribute'&&n.attribute==='class'){ const v=(n.value||'').replace(/"/g,''); const parts=v.split(/\s+/); if(n.operator==='~='||n.operator==='='){ if(parts.some(x=>STYLE.test(x.replace(/^.*?:/,'')))) toks.add(`[class${n.operator}${v}]`); } else if(n.operator==='*='||n.operator==='^='||n.operator==='$='){ toks.add(`[class${n.operator}${v}]`);} }
    });}).processSync(rule.selector); }catch(e){}
    if(toks.size) out.push({file:f,line:rule.source.start.line,tokens:[...toks],selector:rule.selector.replace(/\s+/g,' ').slice(0,300)});
  });
}
fs.writeFileSync(OUT,JSON.stringify(out,null,1));
const byTok={}; for(const r of out) for(const t of r.tokens) (byTok[t] ||= new Set()).add(r.file);
console.log('rules',out.length,'distinct tokens',Object.keys(byTok).length);
const byFile={}; for(const r of out) byFile[r.file]=(byFile[r.file]||0)+1; console.log(JSON.stringify(byFile));
