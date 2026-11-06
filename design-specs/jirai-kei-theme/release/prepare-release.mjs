// Local-only publication preparation. Never pushes or opens a pull request.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {JK,APP,toolRequire} from '../tools/common.mjs';
const prep='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98-release-prep';
const out=path.join(JK,'release/candidate-build');
const dest=path.join(prep,'themes/jirai-kei-theme');
function run(cmd,args,opts={}) {
 const r=spawnSync(cmd,args,{encoding:'utf8',maxBuffer:32<<20,...opts});
 if(r.status!==0) throw Error(`${cmd}: ${r.stderr||r.stdout}`);
 return r.stdout;
}
fs.mkdirSync(dest,{recursive:true});
run(process.execPath,[path.join(JK,'runtime/build-runtime.mjs')],{env:{...process.env,JIRAI_OUT:out,SHARP_MODULE:path.join(JK,'tools/node_modules/sharp')}});
const licenseSources=[
 ['Lucide / Feather',path.join(JK,'original-assets/icons/LUCIDE-LICENSE.txt')],
 ['Fusion Pixel',path.join(JK,'fonts/OFL-Fusion-Pixel.txt')],
 ['Silkscreen',path.join(JK,'fonts/OFL-Silkscreen.txt')]
];
const notices=licenseSources.map(([name,file])=>`/*\n${name}\n${fs.readFileSync(file,'utf8').trim()}\n*/`).join('\n\n');
const original=fs.readFileSync(path.join(out,'theme.css'),'utf8');
const css=original.replace(/^\/\* LOCAL PREVIEW DRAFT:[^\n]*\n/,'/* Jirai Kei · Windose Dark — local release candidate.\n * Modular theme source assembled in its existing cascade order.\n * Third-party game-art redistribution clearance is still pending.\n */\n');
const formatted=run(path.join(APP,'node_modules/.bin/oxfmt'),['--stdin-filepath',path.join(dest,'theme.css')],{input:notices+'\n\n'+css}).replace(/[\t ]+$/gm,'');
fs.writeFileSync(path.join(dest,'theme.css'),formatted);
const manifest={id:'jirai-kei-theme',name:'Jirai Kei · Windose Dark',version:'1.0.0-rc.1',author:{name:'FuLuTang',github:'FuLuTang'},description:'Pink Win98-style window chrome, dark jirai-kei panels, pixel controls, lace and heart decorations. Local release candidate; public asset clearance and latest upstream testing pending.',tags:['dark','jirai-kei','pixel'],testedWith:'0.0.0-unverified',remoteAssets:false,darkMode:true,accentMode:false};
fs.writeFileSync(path.join(dest,'theme.json'),JSON.stringify(manifest,null,2)+'\n');
fs.copyFileSync(path.join(out,'preview.webp'),path.join(dest,'preview.webp'));
const {parse}=toolRequire(path.join(APP,'node_modules/postcss'));
// Ignore formatter-only spacing/leading-zero changes outside quoted payloads.
const normalize=s=>s.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g).map((part,i)=>i%2?part:part.replace(/\s+/g,' ').replace(/\s*,\s*/g,',').replace(/\(\s+/g,'(').replace(/\s+\)/g,')').replace(/(^|[^\w.])(-?)\.(\d+)/g,(_,prefix,sign,digits)=>`${prefix}${sign}0.${digits}`)).join('').trim();
function tree(node){
 const o={type:node.type};
 if(node.type==='comment')return null;
 for(const k of ['name','params','selector','prop','value','important'])if(node[k]!==undefined)o[k]=typeof node[k]==='string'?normalize(node[k]):node[k];
 if(node.nodes)o.nodes=node.nodes.map(tree).filter(Boolean);
 return o;
}
// Formatting can normalize legal whitespace but must not change rule order or declarations.
const a=tree(parse(original)),b=tree(parse(formatted));
fs.writeFileSync(path.join(JK,'release/css-ast-before.json'),JSON.stringify(a));
fs.writeFileSync(path.join(JK,'release/css-ast-after.json'),JSON.stringify(b));
const report={upstreamBase:run('git',['rev-parse','HEAD'],{cwd:prep}).trim(),version:manifest.version,cssBytes:Buffer.byteLength(formatted),cssLimit:1048576,underLimit:Buffer.byteLength(formatted)<=1048576,formattingAstEqual:JSON.stringify(a)===JSON.stringify(b),remoteUrls:[...formatted.matchAll(/url\(\s*["']?(https?:[^)'"\s]+)/g)].map(m=>m[1]),sha256:crypto.createHash('sha256').update(formatted).digest('hex'),licenses:licenseSources.map(([name])=>name),publicDistributionReady:false,blockers:['Embedded NSO/Steam/Fandom-derived artwork has no established redistribution permission in local records.','Latest upstream release v2.33.0 has not been verified; local Windows checks used a custom VRCX-0-jirai build.','Maintainer review required for the upstream policy against generated CSS: this is formatted assembly of modular CSS and generated embedded assets.']};
fs.writeFileSync(path.join(JK,'release/package-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(!report.underLimit)process.exitCode=2;
