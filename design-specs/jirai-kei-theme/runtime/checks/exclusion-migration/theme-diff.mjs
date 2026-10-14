/* theme-diff.mjs <fixture.html> <themeA.css> <themeB.css>
 * Full computed-style snapshot (every element x every longhand, ::before/::after excluded, finite animations drained)
 * of the same fixture under two themes, compared order-insensitively.
 *
 * Purpose: a direct, jitter-free equivalence proof for the stage-2 cleanup. Feed it the pre-cleanup theme and the
 * cleaned theme; an EMPTY diff means the removed clauses changed nothing in that fixture's context. This is stronger
 * evidence than a run-verify round, which mixes in hover/recording timing races.
 *
 * Usage (the numbers are what the 233-clause cleanup reported):
 *   PLAYWRIGHT_BROWSERS_PATH=<browsers> node theme-diff.mjs <fixture.html> <theme-r9.8.css> <theme-clean.css> */
import fs from 'node:fs/promises';
import {chromium} from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
const [fixturePath, themeA, themeB] = process.argv.slice(2);
if(!fixturePath||!themeA||!themeB)throw Error('usage: theme-diff.mjs <fixture.html> <themeA.css> <themeB.css>');
const JK='/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme';
const appCss=await fs.readFile('/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css','utf8');
const html=await fs.readFile(fixturePath,'utf8');
const themes={a:themeA, b:themeB};
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const snap=async(themePath)=>{
  const css=await fs.readFile(themePath,'utf8');
  const page=await browser.newPage({viewport:{width:1200,height:900},deviceScaleFactor:1});
  await page.setContent(html,{waitUntil:'load'});
  await page.addStyleTag({content:appCss});
  await page.addStyleTag({content:css});
  await page.evaluate(()=>document.fonts&&document.fonts.ready);
  await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect&&a.effect.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));
  const data=await page.evaluate(()=>{
    const out={}; let n=0;
    document.querySelectorAll('*').forEach(el=>{
      const key=(n++)+'|'+el.tagName.toLowerCase()+(el.id?'#'+el.id:'')+(el.dataset&&el.dataset.slot?'[slot='+el.dataset.slot+']':'');
      const cs=getComputedStyle(el); const pairs=[];
      for(let i=0;i<cs.length;i++){const p=cs[i]; if(/^(animation|transition)/.test(p))continue; pairs.push(p+':'+cs.getPropertyValue(p));}
      pairs.sort();
      out[key]=pairs.join(';');
    });
    return out;
  });
  await page.close();
  return data;
};
const a=await snap(themes.a), b=await snap(themes.b);
await browser.close();
const keys=new Set([...Object.keys(a),...Object.keys(b)]);
const diffs=[];
for(const k of keys){
  if(a[k]===undefined||b[k]===undefined){diffs.push({element:k,note:a[k]===undefined?'only in clean':'only in r9.8'});continue}
  if(a[k]===b[k])continue;
  const pa=a[k].split(';'), pb=new Map(b[k].split(';').map(x=>[x.slice(0,x.indexOf(':')),x]));
  const changed=[];
  for(const x of pa){ if(pb.get(x.slice(0,x.indexOf(':')))!==x) changed.push(`A[${x}] B[${pb.get(x.slice(0,x.indexOf(':')))}]`); }
  diffs.push({element:k,changed:changed.slice(0,8),total:changed.length});
}
const name=fixturePath.split('/').slice(-2).join('/');
console.log(`${diffs.length===0?'OK   ':'DIFF '} ${name.padEnd(32)} elements=${Object.keys(a).length} diffs=${diffs.length}`);
for(const d of diffs.slice(0,6)) console.log('        ',JSON.stringify(d).slice(0,300));
