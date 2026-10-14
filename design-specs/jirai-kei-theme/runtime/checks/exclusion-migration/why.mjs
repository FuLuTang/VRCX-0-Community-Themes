/* why.mjs --theme <css> --cell <aid> --idx <n> --props a,b[,..] [--pseudo ::x] [--focus] : lists every theme rule matching the fixture element and declaring one of the props (document order) */
import fs from 'node:fs/promises';
import {buildFixture, splitSections, loadAppCss, buildPage} from './fixture.mjs';
const argv=process.argv.slice(2); const opt=(n,d)=>{const i=argv.indexOf('--'+n);return i>=0?argv[i+1]:d;};
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/tmp/dsh-theme-browsers';
const {chromium}=await import('/tmp/dsh-theme-tools/node_modules/playwright/index.mjs');
const fixture=await buildFixture(); const html=buildPage({fixture,sections:splitSections(await fs.readFile(opt('theme'),'utf8')),appCss:await loadAppCss()});
const b=await chromium.launch({headless:true,args:['--disable-dev-shm-usage','--no-sandbox']}); const page=await b.newPage({viewport:{width:1200,height:900}});
await page.setContent(html,{waitUntil:'load'});
const out=await page.evaluate(([aid,idx,props,focus])=>{
  const cell=document.querySelector(`[data-cell="${aid}"]`); const el=idx<0?cell:[...cell.querySelectorAll('*')][idx];
  if(focus){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true}));el.focus();}
  const res=[]; let order=0;
  const walk=(rules,sec,chain)=>{for(const r of rules){const cn=r.constructor.name; if(cn==='CSSStyleRule'){order++; const parts=[];let d=0,cur='',q=null;const s=r.selectorText;for(let i=0;i<s.length;i++){const c=s[i];if(q){cur+=c;if(c===q)q=null;continue;}if(c==='"'||c==="'"){q=c;cur+=c;continue;}if('(['.includes(c))d++;if(')]'.includes(c))d--;if(c===','&&d===0){parts.push(cur);cur='';}else cur+=c;}parts.push(cur);
        for(const p of parts){const base=p.replace(/::[\w-]+(\([^)]*\))?$/,'').trim();let m=false;try{m=el.matches(base.replace(/:(hover|active)\b/g,':not(*)').replace(/:focus-visible/g,focus?':focus-visible':':not(*)'));}catch{} if(!m)continue;
          for(const pr of props){const v=r.style.getPropertyValue(pr);if(v)res.push({sec,order,sel:p.trim().slice(0,260),prop:pr,val:v.slice(0,90),imp:r.style.getPropertyPriority(pr),chain});}}}
      else if(cn==='CSSMediaRule'){try{if(matchMedia(r.media.mediaText).matches)walk(r.cssRules,sec,chain+'@media ');}catch{}} else if(r.cssRules&&cn!=='CSSKeyframesRule'&&cn!=='CSSFontFaceRule')walk(r.cssRules,sec,chain+'@'+(r.layerName||r.name||'')+' ');}};
  for(const sh of document.styleSheets){const n=sh.ownerNode;if(n&&!n.hasAttribute('data-audit'))walk(sh.cssRules,n.getAttribute('data-section'),'');}
  return res;
},[opt('cell'),+opt('idx','-1'),opt('props').split(','),argv.includes('--focus')]);
for(const r of out) console.log(`${r.sec.padEnd(18)}#${String(r.order).padStart(5)} ${r.prop}: ${r.val}${r.imp?' !important':''}  ${r.chain}\n      ${r.sel}`);
await b.close();
