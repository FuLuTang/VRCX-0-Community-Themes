// Scan source for DialogHeader/AlertDialogHeader/SheetHeader and list direct JSX children by prettier indentation.
import fs from 'node:fs'; import path from 'node:path';
const root = process.argv[2] || '/tmp/vrcx-win-src-r97/src';
const files = []; (function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(p.endsWith('.tsx')&&!p.includes('ui/shadcn')) files.push(p);}})(root);
const out=[];
for(const f of files){const L=fs.readFileSync(f,'utf8').split('\n');
 L.forEach((ln,i)=>{const m=ln.match(/^(\s*)<((?:Alert)?DialogHeader|SheetHeader)\b(.*)/); if(!m) return;
  const ind=m[1].length, tag=m[2]; let j=i, kids=[];
  if(/\/>\s*$/.test(ln)) return;
  // find end of opening tag
  while(!/>\s*$/.test(L[j])||/=>\s*$/.test(L[j])) j++;
  const open=L.slice(i,j+1).join(' ');
  for(j=j+1;j<L.length;j++){const l=L[j]; const li=l.match(/^\s*/)[0].length;
   if(li===ind && l.trim().startsWith('</'+tag)) break;
   if(li===ind+4 && l.trim()) { const t=l.trim(); if(/^[<{]/.test(t)&&!/^<\//.test(t)) kids.push(t.slice(0,60)); }
  }
  const nonTD=kids.filter(k=>!/^<(Alert)?Dialog(Title|Description)\b|^<Sheet(Title|Description)\b/.test(k));
  out.push({loc:path.relative(root,f)+':'+(i+1),tag,cls:(open.match(/className="([^"]*)"/)||[])[1]||'',flexRow:/flex-row/.test(open),kids,nonTD});
 });}
const flagged=out.filter(o=>o.flexRow||o.nonTD.length);
console.log(JSON.stringify({total:out.length,flagged},null,1));
fs.writeFileSync(new URL('./header-scan.json',import.meta.url),JSON.stringify({total:out.length,all:out},null,1));
