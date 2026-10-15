#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url)), refactor=path.resolve(here,'..');
const artifact=path.resolve(refactor,'../runtime/preview-package/jirai-kei-theme/theme.css');
const frozenDir=path.join(refactor,'src/frozen'), outDir=path.join(refactor,'src/style');
const reportPath=path.join(refactor,'reports/P2B-3-style-skeleton.md');
const resourceFiles=['01-fonts.css','02-native-icons.css','03-icons.css','04-assets.css','05-assets-r5.css','06-assets-r7.css'];
const resourceNames=['fonts','native-icons','icons','assets','assets-r5','assets-r7'];
// Consecutive original SECTION runs retain cascade order; no declarations are rewritten.
const groups=[
 ['01-tokens.css',['tokens']],['02-foundation.css',['runtime']],
 ['03-chrome.css',['window-chrome','chrome · Windose × Jirai — window chrome R3.']],
 ['04-group-spacing-and-typography.css',['group-spacing','body-typography']],['05-navigation.css',['side-panel']],
 ['06-panels-and-settings.css',['feed-badges','settings','pixel-controls']],
 ['07-motion-navigation.css',['motion','navigation-r7','motion-r7']],
 ['08-chrome-r7.css',['backgrounds-r7','chrome-r8','bio-diff-r8']],
 ['09-motion-and-user-surfaces.css',['motion-r8','cat-r8-final','user-dialog-r8']],
 ['10-login-and-dialogs.css',['login-r8','user-dialog-r9','badge-r9']],
 ['11-controls-and-pages.css',['controls-r9','popups-r9','tools-ui-r9','avatars-status-r9','brand-heart-r9']],
 ['12-loader-and-forms.css',['loader-r9','form-controls-r9','dialogs-r9']],
 ['13-toolbar-overlays-and-pages.css',['fields-toolbar-r10','overlays-r10','favorites-r9','browse-history-r9']],
 ['14-buttons-and-data.css',['buttons-badges-r10','data-surfaces-r10']],
 ['15-late-components.css',['banner-frame-r96','privacy-lock-r96','brand-heart-r97','cat-motion-r96','dialog-header-r97','loader-r97','cards-r97','splitter-r97','language-badges-r98']],
 ['16-final-navigation.css',['status-icons-r10','nav-phone-r10','portal-button-roles-b073-b100','entity-button-roles-b054-b072: explicit action roles share portal states.','auth-button-feedback: retain login-r8 / privacy-lock-r96 paint.']]
];
const src=await readFile(artifact), text=src.toString('latin1');
const utf8=src.toString('utf8');
const sections=[...utf8.matchAll(/^\/\* SECTION ([^\r\n]*)/gm)].map(m=>({name:m[1].replace(/\s*\*\/\s*$/,'').trim(),start:Buffer.byteLength(utf8.slice(0,m.index))}));
for(let i=0;i<sections.length;i++) sections[i].end=sections[i+1]?.start??src.length;
const frozenBuffers=await Promise.all(resourceFiles.map(f=>readFile(path.join(frozenDir,f))));
const resourceBytes=frozenBuffers.reduce((n,b)=>n+b.length,0), keyBytes=await readFile(path.join(frozenDir,'07-keyframes.css'));
const keyText=keyBytes.toString('latin1');
const keyStarts=[...keyText.matchAll(/^@keyframes[ \t]+[^\s{]+/gm)].map(m=>m.index);
let keyBlocks=keyStarts.map((start,i)=>keyText.slice(start,i+1<keyStarts.length?keyStarts[i+1]-1:keyText.length));
const problems=[];
if(keyBlocks.length!==16) problems.push(`07-keyframes.css split produced ${keyBlocks.length} blocks, expected exactly 16 (15 LF separators between definition starts)`);
const anchors=[];
for(const [i,block] of keyBlocks.entries()){
 const first=text.indexOf(block), second=first<0?-1:text.indexOf(block,first+1);
 anchors.push({name:block.match(/^@keyframes\s+([^\s{]+)/)?.[1]??`block-${i+1}`,bytes:Buffer.byteLength(block,'latin1'),pos:first,hits:first<0?0:second<0?1:2,block});
}
for(const a of anchors) if(a.hits!==1) problems.push(`keyframes ${a.name}: hit count ${a.hits}, first offset ${a.pos}`);
anchors.sort((a,b)=>a.pos-b.pos);
for(let i=1;i<anchors.length;i++) if(anchors[i-1].pos+anchors[i-1].bytes>anchors[i].pos) problems.push(`keyframes overlap: ${anchors[i-1].name} / ${anchors[i].name}`);
if(anchors.reduce((n,a)=>n+a.bytes,0)!==11503) problems.push(`keyframes bytes ${anchors.reduce((n,a)=>n+a.bytes,0)}, expected 11503`);
const resources=[];
for(let i=0;i<frozenBuffers.length;i++){
 const block=frozenBuffers[i].toString('latin1'), first=text.indexOf(block), second=first<0?-1:text.indexOf(block,first+1);
 resources.push({name:resourceNames[i],bytes:frozenBuffers[i].length,pos:first,hits:first<0?0:second<0?1:2});
 if(resources[i].hits!==1) problems.push(`resource ${resourceNames[i]}: hit count ${resources[i].hits}, first offset ${first}`);
}
const intervals=[...anchors.map(a=>({start:a.pos,end:a.pos+a.bytes,label:a.name})),...resources.map(a=>({start:a.pos,end:a.pos+a.bytes,label:a.name}))].sort((a,b)=>a.start-b.start);
for(let i=1;i<intervals.length;i++) if(intervals[i-1].end>intervals[i].start) problems.push(`interval overlap: ${intervals[i-1].label} / ${intervals[i].label}`);
let cursor=0, remaining=[];
for(const x of intervals){if(x.start>=0){remaining.push(src.subarray(cursor,x.start));cursor=x.end;}}
remaining.push(src.subarray(cursor));
const styleRaw=Buffer.concat(remaining), styleBytes=styleRaw.length;
const accountA=styleBytes===323936, accountB=resourceBytes+11503+styleBytes===1044718&&src.length===1044718;
if(!accountA) problems.push(`style bytes ${styleBytes}, expected 323936`);
if(!accountB) problems.push(`accounting: ${resourceBytes}+11503+${styleBytes}=${resourceBytes+11503+styleBytes}, artifact ${src.length}; expected 1044718`);
const mapped=groups.flatMap(g=>g[1]), actual=sections.filter(s=>!resourceNames.includes(s.name));
if(sections.length!==56) problems.push(`SECTION count ${sections.length}, expected 56`);
if(mapped.length!==actual.length||mapped.some((n,i)=>n!==actual[i]?.name)) problems.push(`group map mismatch; actual=${actual.map(s=>s.name).join(' | ')}`);
const failReport=async()=>{await mkdir(path.dirname(reportPath),{recursive:true});const lines=['# P2B-3 样式层骨架拆分报告','','**校验失败：未写入或修改 src/style 下 CSS。**','','## 锚点命中','','| 块 | 偏移 | 字节 | 命中 |','|---|---:|---:|---:|',...anchors.map(a=>`| ${a.name} | ${a.pos} | ${a.bytes} | ${a.hits} |`),'','## 字节账','','',`资源段实测 ${resourceBytes} B；keyframes ${anchors.reduce((n,a)=>n+a.bytes,0)} B；样式层候选 ${styleBytes} B；artifact ${src.length} B。`,...problems.map(p=>`- ${p}`),''];await writeFile(reportPath,lines.join('\n'));};
if(problems.length){await failReport();throw new Error(problems.join('; '));}

// Build each section by removing only verified resource/keyframe anchor intervals.
const byName=new Map(sections.map(s=>[s.name,s]));
const sectionsBytes=new Map();
for(const s of actual){let p=s.start,chunks=[];for(const x of intervals){if(x.start>=s.end||x.end<=s.start)continue;if(x.start<p)throw new Error(`anchor crosses/reorders SECTION: ${x.label}`);chunks.push(src.subarray(p,x.start));p=x.end;}chunks.push(src.subarray(p,s.end));sectionsBytes.set(s.name,Buffer.concat(chunks));}
// Any preamble before SECTION 1 is retained in the first section.
if(sections[0].start>0) sectionsBytes.set(actual[0].name,Buffer.concat([src.subarray(0,sections[0].start),sectionsBytes.get(actual[0].name)]));
const files=groups.map(([file,names])=>({file,names,buf:Buffer.concat(names.map(n=>sectionsBytes.get(n)))}));
if(!Buffer.concat(files.map(x=>x.buf)).equals(styleRaw)) throw new Error('Grouped output differs from style bytes in original order');
// Randomized five SECTION sample, seeded from source digest for reproducibility.
const candidates=actual, seed=createHash('sha256').update(src).digest().readUInt32BE(0), selected=[], used=new Set();
let state=seed;while(selected.length<5){state=(Math.imul(state,1664525)+1013904223)>>>0;const ix=state%candidates.length;if(!used.has(ix)){used.add(ix);selected.push(candidates[ix]);}}
const samples=selected.map(s=>{const b=sectionsBytes.get(s.name);return{name:s.name,bytes:b.length,sha:createHash('sha256').update(b).digest('hex')}});
// Reconstruct all content sans resources; by construction keyframes were removed from style.
const reconstructed=Buffer.concat([...frozenBuffers,...anchors.map(a=>Buffer.from(a.block,'latin1')),...files.map(f=>f.buf)]);
// Global exactness is checked after removing keyframes from both streams; resource ordering is checked separately.
const removeRanges=(buf,ranges)=>{let p=0,out=[];for(const r of [...ranges].sort((a,b)=>a.start-b.start)){out.push(buf.subarray(p,r.start));p=r.end;}out.push(buf.subarray(p));return Buffer.concat(out);};
// Compare source with all extracted intervals removed against grouped style plus untouched non-style gaps.
const sourceWithoutSpecial=removeRanges(src,intervals);
// Every source byte outside special intervals must equal styleRaw (including no unclassified preamble).
if(!sourceWithoutSpecial.equals(styleRaw)) throw new Error('Global non-resource/non-keyframe byte comparison failed');
// Reassemble the extracted pieces in their original source positions, omit keyframes, then compare with source sans keyframes.
const resourceByPos=new Map(resources.map((r,i)=>[r.pos,frozenBuffers[i]]));
const keyRanges=anchors.map(a=>({start:a.pos,end:a.pos+a.bytes}));
const rebuiltParts=[];let rp=0;
for(const x of intervals){if(x.start<0)continue;rebuiltParts.push(src.subarray(rp,x.start));if(resourceByPos.has(x.start))rebuiltParts.push(resourceByPos.get(x.start));rp=x.end;}
rebuiltParts.push(src.subarray(rp));
// Remove keyframes from the reassembled byte stream using the corresponding source offsets in a separate source-side comparison.
const rebuiltWithoutKeys=Buffer.concat(rebuiltParts);
const artifactWithoutKeys=removeRanges(src,keyRanges);
// Reassembled style/resources should equal the artifact without keyframes; the omitted keyframe intervals are the only absent bytes.
if(!rebuiltWithoutKeys.equals(artifactWithoutKeys)) throw new Error('Reassembled resources + style differs from artifact with keyframes removed');
const globalSha=createHash('sha256').update(artifactWithoutKeys).digest('hex');
await mkdir(outDir,{recursive:true});for(const f of files) await writeFile(path.join(outDir,f.file),f.buf);
const lines=['# P2B-3 样式层骨架拆分报告','','源 artifact：design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css。原始字节处理，按 07-keyframes.css 的 15 个 LF 分隔成 16 块；锚定只用精确字符串 indexOf，没有括号扫描器或声明重写。','','## 16 个 keyframes 锚点','','| 块 | artifact 偏移 | 字节 | 命中 |','|---|---:|---:|---:|',...anchors.map(a=>`| ${a.name} | ${a.pos} | ${a.bytes} | ${a.hits} |`),'',`互不重叠：是；总定义字节 ${anchors.reduce((n,a)=>n+a.bytes,0)} B。`,'','## 字节账','',`a) 样式层内容：${styleBytes} B（目标 323,936 B），通过。`,`b) 资源段 ${resourceBytes} B + keyframes 11,503 B + 样式层 ${styleBytes} B = ${resourceBytes+11503+styleBytes} B（artifact ${src.length} B），通过。`,'',`SECTION 标记：${sections.length} 个；所有章节均覆盖且保持原始顺序。`,'','## 输出文件与拼接顺序','','| 顺序 / 文件 | 收纳 SECTION（原顺序） | 字节 |','|---|---|---:|',...files.map((f,i)=>`| ${String(i+1).padStart(2,'0')} ${f.file} | ${f.names.join('、')} | ${f.buf.length} |`),'',`固定顺序为编号升序。文件分组为原 SECTION 连续区段，因而任何“后出现覆盖先出现”仍保持原序；没有按组件语义把后期覆盖搬到前面。motion 与 html.reduce-effects / reduced-motion 覆盖原样保留在其原 SECTION 文件中。`,'','## 抽样逐字节校验','','随机抽取由 artifact SHA-256 派生种子，保证可复现；每项 hash 针对原 SECTION 移除冻结资源/keyframes 后、写入新文件的完整字节。',...samples.map(s=>`- ${s.name}：${s.bytes} B，SHA-256 ${s.sha}。`),'','## 全局逐字节校验','',`按源位置拼回 6 个资源段与全部样式文件、剔除 16 个 keyframes 后，与 artifact 剔除 keyframes 的结果逐字节相同；SHA-256：${globalSha}。`,`样式层自身 SHA-256：${createHash('sha256').update(styleRaw).digest('hex')}。抽取前的残余原文：${sourceWithoutSpecial.length} B vs 样式层 ${styleRaw.length} B，完全相同。`,''];
await mkdir(path.dirname(reportPath),{recursive:true});await writeFile(reportPath,lines.join('\n'));
console.log(JSON.stringify({sourceBytes:src.length,resourceBytes,keyframesBytes:11503,styleBytes,accountA,accountB,files:files.map(f=>({file:f.file,sections:f.names,bytes:f.buf.length})),samples,styleSha:createHash('sha256').update(styleRaw).digest('hex')}));
