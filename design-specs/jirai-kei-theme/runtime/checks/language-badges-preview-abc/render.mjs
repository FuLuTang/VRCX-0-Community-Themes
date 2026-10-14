// Isolated visual choice only. No runtime CSS edits or live deployment.
import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const assetRoot=path.resolve(here,'../../../original-assets');
const svg=(await fs.readFile(path.join(assetRoot,'src/s3-stitch-8x4.svg'),'utf8')).replace('#000','#8c71b0');
const html=await fs.readFile('/tmp/jirai-language-preview/preview.html','utf8');
const fixture=path.join(here,'fixture.html');try{await fs.access(fixture);throw new Error('Do not overwrite existing preview fixture')}catch(e){if(e.code!=='ENOENT')throw e}
await fs.writeFile(fixture,html);
process.env.TMPDIR=path.join(here,'browser-tmp');await fs.mkdir(process.env.TMPDIR,{recursive:true});
const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage({viewport:{width:1020,height:680},deviceScaleFactor:2});await page.setContent(html);
 const fontCss=await fs.readFile(path.resolve(here,'../../../fonts/fonts-body.css'),'utf8');await page.addStyleTag({content:(fontCss.match(/@font-face\s*\{[^}]*\}/g)||[]).join('\n')+`body{font-family:'WD Pixel CJK',system-ui,sans-serif}:root{--stitch:url("data:image/svg+xml,${encodeURIComponent(svg)}")}`});await page.evaluate(()=>document.fonts.ready);
 const evidence=await page.locator('.choices .badge').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {height:r.height,width:r.width,font:s.fontSize,bg:s.backgroundColor,color:s.color}}));
 if(evidence.some(e=>e.height!==20||e.width<32||e.font!=='10px'))throw Error('Preview changed common badge geometry');
 await page.screenshot({path:path.join(here,'language-badges-abc.png'),fullPage:true});
 console.log(JSON.stringify({result:'PASS',image:path.join(here,'language-badges-abc.png'),nativeBadge:{height:20,minWidth:32,fontSize:10,gap:4},densityScale:2,fictitiousData:true,runtimeUnchanged:true},null,2));
}finally{await browser.close()}
