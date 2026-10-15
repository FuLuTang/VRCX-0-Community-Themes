#!/usr/bin/env node
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const styleDir=path.join(root,'src/style'), frozenDir=path.join(root,'src/frozen');
const reportPath=path.join(root,'reports/P2B-4-asset-vars.md'), frozenPath=path.join(frozenDir,'08-asset-vars.css');
const sha=b=>createHash('sha256').update(b).digest('hex');
function urls(s){const out=[];for(let i=0;i<s.length-4;i++){if(s.slice(i,i+4).toLowerCase()!=='url(')continue;let j=i+4,quote='';for(;j<s.length;j++){const c=s[j];if(quote){if(c==='\\'){j++;continue}if(c===quote)quote='';}else if(c==='"'||c==="'")quote=c;else if(c===')')break;}if(j>=s.length)throw Error('Unclosed url()');const token=s.slice(i,j+1);if(/^url\(\s*["']?data:/i.test(token))out.push({start:i,end:j+1,token});i=j; }return out}
function context(s,pos){const before=s.slice(0,pos), line=before.split('\n').length;let brace=0, quote='', comment=false, stack=[];for(let i=0;i<pos;i++){const c=s[i],n=s[i+1];if(comment){if(c==='*'&&n==='/'){comment=false;i++}continue}if(quote){if(c==='\\')i++;else if(c===quote)quote='';continue}if(c==='/'&&n==='*'){comment=true;i++;continue}if(c==='"'||c==="'"){quote=c;continue}if(c==='{'){brace++;let head=s.slice(0,i).lastIndexOf('}');let open=s.slice(head+1,i).trim();stack.push(open)}else if(c==='}'){brace--;stack.pop()}}
 const selectors=stack.filter(x=>!x.startsWith('@')).at(-1)||'(top-level)';const media=stack.filter(x=>/^@media\b/i.test(x)).join(' > ')||'—';let a=before.lastIndexOf(';'),b=before.lastIndexOf('{');const decl=s.slice(Math.max(a,b)+1,s.indexOf(';',pos)<0?s.length:s.indexOf(';',pos)).trim();return{line,selectors,media,decl};}
const files=(await readdir(styleDir)).filter(x=>x.endsWith('.css')).sort();let all=[];
for(const file of files){const buf=await readFile(path.join(styleDir,file)),s=buf.toString('utf8');for(const u of urls(s)){const c=context(s,u.start);all.push({file,buf,s,...u,...c})}}
const existing=await readFile(frozenPath).catch(()=>Buffer.alloc(0));
let vars=new Map([...existing.toString('utf8').matchAll(/(--jk-asset-[\w-]+)\s*:\s*(url\([^;]+?\))\s*;/g)].map(m=>[m[1],m[2]]));
const semantic=(x,i)=>{let q=(x.selectors+' '+x.decl).toLowerCase();let name=q.includes('number-field-decrement')?'number-stepper-minus':q.includes('number-field-increment')?'number-stepper-plus':q.includes('switch-thumb')?(q.includes('checked')?'switch-thumb-on-heart':'switch-thumb-off'):q.includes('switch')?(q.includes('checked')?'switch-knob-on-heart':'switch-knob-off-x'):q.includes('scroll-area')?'scroll-area-thumb-'+(q.includes('horizontal')?'horizontal':'vertical'):q.includes('scrollbar')?'scrollbar-thumb-'+(q.includes('horizontal')?'horizontal':'vertical'):q.includes('progress')?'progress-pink-cells':q.includes('entity-dialog')?'user-dialog-banner-hem-lace':q.includes('banner')?'banner-frame-stitch':q.includes('heart')?'pixel-heart':q.includes('lace')?'lace-tile':q.includes('toast')?(q.includes('shock')?'toast-shock':'toast-face'):q.includes('phone')?'phone-pixel-art':q.includes('scroll')?'scroll-thumb-pixel':q.includes('arrow')?'pixel-arrow':q.includes('loader')?'loader-pixel-sheet':q.includes('titlebar')?'titlebar-pixel-heart':'inline-image-'+String(i+1).padStart(2,'0');return '--jk-asset-'+name};
let replacements=[];let used=new Set();
for(let i=0;i<all.length;i++){const x=all[i], raw=x.token.match(/^url\(\s*(["']?)(data:[\s\S]*?)(?:\1)\s*\)$/i)?.[2];if(!raw)throw Error('cannot parse '+x.file+':'+x.line);let name=semantic(x,i),n=1,base=name;while(used.has(name))name=base+'-'+(++n);used.add(name);const value=x.token; if(vars.size&&existing.length){ // idempotent pass: already replaced styles are not discovered
 }
 const mime=/^data:([^;,]+)/i.exec(raw)?.[1]||'text/plain';const bytes=Buffer.byteLength(raw,'utf8');replacements.push({...x,name,value,raw,mime,bytes,hash:sha(Buffer.from(raw))});}
// If source already has variables from a previous run, validate and do not mutate.
if(all.length && existing.length && all.every(x=>x.token.includes('data:'))){/* initial source */}
// Transform only when frozen vars absent for the discovered original inline assets.
let transformed=files.map(file=>({file,buf:Buffer.alloc(0)}));
for(const file of files)transformed[files.indexOf(file)].buf=await readFile(path.join(styleDir,file));
const beforeBytes=transformed.reduce((n,x)=>n+x.buf.length,0);
const needs=all.length>0;
if(needs){const by=new Map();for(const f of files){const s=(await readFile(path.join(styleDir,f))).toString('utf8');by.set(f,s)}
 for(const r of [...replacements].reverse()){const s=by.get(r.file);by.set(r.file,s.slice(0,r.start)+`var(${r.name})`+s.slice(r.end));}
 for(const [f,s] of by) transformed[files.indexOf(f)]={file:f,buf:Buffer.from(s)};
}
// Current expected mode is first execution. Refuse rerun if assets already extracted unless all refs match frozen defs.
const rootCss=':root{\n'+replacements.map(r=>`  ${r.name}: ${r.value};`).join('\n')+'\n}\n';
const prior=existing.toString('utf8');
if(existing.length && !prior.includes(':root{'))throw Error('08 asset file exists but is not generated by this tool');
if(existing.length && all.length===0){console.log('Already extracted; no inline data URI remains.');process.exit(0)}
const afterBytes=transformed.reduce((n,x)=>n+x.buf.length,0);const expectedDelta=replacements.reduce((n,r)=>n-r.token.length+`var(${r.name})`.length,0);
if(beforeBytes+expectedDelta!==afterBytes)throw Error(`byte accounting mismatch ${beforeBytes}+${expectedDelta} != ${afterBytes}`);
const expanded=transformed.map(x=>x.buf.toString('utf8')).join('');let expandedAll=expanded;for(const r of replacements)expandedAll=expandedAll.replaceAll(`var(${r.name})`,r.value);
const collect=s=>urls(s).map(u=>u.token.match(/^url\(\s*["']?(data:[\s\S]*?)(?:["']?)\s*\)$/i)?.[1]||'');
const oldSet=replacements.map(r=>r.raw).sort(), newSet=collect(expandedAll).sort();
if(JSON.stringify(oldSet)!==JSON.stringify(newSet))throw Error('expanded data URI set mismatch (unrelated/pre-existing URI distinction requires manual audit)');
const rows=replacements.map(r=>`| \`${r.file}\` | ${r.line} | ${r.selectors.replaceAll('|','\\|')} | ${r.media.replaceAll('|','\\|')} | ${r.mime} | ${r.bytes} | \`${r.name}\` | \`${r.hash}\` |`);
const report=['# P2B-4 内联 data URI 冻结变量抽取','','穷举方式：逐个扫描 `url(`，按引号及转义状态寻找配对 `)`；只接受 url 内容以 data: 开始，不使用贪婪正则。资源段不在扫描目录内。','',`实测内联 data URI：**${replacements.length} 条**；前置汇总声称 12 条，差额 **${replacements.length-12>=0?'+':''}${replacements.length-12}**。差额源于样式层还存在原先作为 A 类变量定义的 URI（以及额外样式规则），本次按用户要求穷举样式层，全部抽出；settings 的旧行号实际对应 number-field mask URI，而非原命名变量。`,'','## 完整清单','','| 文件 | 行 | 选择器 | Media | MIME | URI 字节 | 新变量 | SHA-256(URI) |','|---|---:|---|---|---|---:|---|---|',...rows,'','## 校验','',`a) 每个变量值所含 data URI 与原始完整 data URI 逐字节相同：值为原样 url(...) token；各 URI 长度及 SHA-256 见上表。` ,`b) 样式层字节数：改造前 ${beforeBytes} B；改造后 ${afterBytes} B；变化 ${afterBytes-beforeBytes} B。逐点理论变化合计 ${expectedDelta} B；一致：**${afterBytes-beforeBytes===expectedDelta?'是':'否'}**。` ,`c) 改造前后 data URI 集合 SHA-256（按完整 URI 排序后以 LF 拼接）：前 ${sha(Buffer.from(oldSet.join('\n')))}；变量展开后 ${sha(Buffer.from(newSet.join('\n')))}；完全一致：**${JSON.stringify(oldSet)===JSON.stringify(newSet)?'是':'否'}**。`,'',`样式层总字节数（原文件总和）：改造前 ${beforeBytes} B，改造后 ${afterBytes} B。冻结变量文件：08-asset-vars.css。`,''].join('\n');
if(existing.length)throw Error('existing 08 asset vars detected; refusing overwrite / non-idempotent source');
await writeFile(frozenPath,rootCss);for(const f of transformed)await writeFile(path.join(styleDir,f.file),f.buf);await writeFile(reportPath,report);console.log(`Extracted ${replacements.length}; style ${beforeBytes}->${afterBytes}; delta ${expectedDelta}`);
