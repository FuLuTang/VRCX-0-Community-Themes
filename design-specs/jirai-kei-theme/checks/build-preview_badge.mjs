// Copy of build-preview_tabs(exemple).mjs: entry/output changed; adds the comparison layout and the proposal CSS.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const name='badge';
const here=path.dirname(fileURLToPath(import.meta.url));
const app='/home/fulutang/Documents/Github/VRCX-0-jirai';
const req=createRequire(path.join(app,'package.json'));
const {build}=await import(req.resolve('vite'));
const {default:react}=await import(req.resolve('@vitejs/plugin-react'));
const themePath=path.resolve(here,'../runtime/preview-package/jirai-kei-theme/theme.css');
const theme=await fs.readFile(themePath,'utf8');
// App CSS and <html> attributes come from a baseline fixture, not from the local dist build: the local
// app checkout is older than the app the fixtures (and the theme) were captured from.
const {fixtureHtml}=await import('../tools/common.mjs');
const ref=fixtureHtml('feed');
const baseCss=[...ref.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)].filter(m=>!/local-theme-preview/.test(m[1])).map(m=>m[2]).join('\n');
const htmlAttrs=(ref.match(/<html([^>]*)>/)[1]||'').replace(/url\([^)]*\)/g,'none');
const bodyAttrs=(ref.match(/<body([^>]*)>/)[1]||'').replace(/url\([^)]*\)/g,'none');
const result=await build({configFile:false,root:app,logLevel:'warn',define:{'process.env.NODE_ENV':'"production"'},plugins:[react()],resolve:{alias:{'@':path.join(app,'src'),'lucide-react':req.resolve('lucide-react'),'react':path.dirname(req.resolve('react/package.json')),'react-dom':path.dirname(req.resolve('react-dom/package.json'))}},build:{write:false,minify:true,lib:{entry:path.join(here,`${name}-visual-preview.tsx`),name:'Preview',formats:['iife']}}});
const outputs=(Array.isArray(result)?result:[result]).flatMap(x=>x.output);
const js=outputs.filter(x=>x.type==='chunk').map(x=>x.code).join('\n');
const stageCss=(await fs.readFile(path.resolve(here,'../tools/preview/stage.css'),'utf8'))+(await fs.readFile(path.join(here,'preview-compare.css'),'utf8'));
const proposal=await fs.readFile(path.join(here,`${name}-proposal.css`),'utf8');
const escapeStyle=s=>s.replace(/<\/style/gi,'<\\/style');
const html=`<!doctype html><html${htmlAttrs}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-sha256" content="${crypto.createHash('sha256').update(theme).digest('hex')}"><title>徽标 + 快捷键 · 现状 vs 提案</title><style id="app-base">${escapeStyle(baseCss)}</style><style id="merged-theme">${escapeStyle(theme)}</style><style id="proposal">${escapeStyle(proposal)}</style><style id="preview-layout">${escapeStyle(stageCss)}</style></head><body${bodyAttrs}><div id="preview-root"></div><script>${js.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
const out=path.join(here,`preview_${name}.html`);
await fs.writeFile(out,html);
console.log(JSON.stringify({output:out,bytes:Buffer.byteLength(html),themeSha256:crypto.createHash('sha256').update(theme).digest('hex')},null,2));
