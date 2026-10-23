// Checks that each replayed element in a comparison preview's 现状 column paints exactly like the same
// element in its baseline fixture (current theme), in base / hover / active / focus.
// Usage (from JK/tools): node ../checks/check-preview-fidelity.mjs ../checks/preview_button.html ../checks/button-contexts.json [pane-selector]
import fs from 'node:fs';
import path from 'node:path';
import {Browser,loadFixture,toolRequire,DEFAULT_THEME} from '../tools/common.mjs';
const [htmlFile,ctxFile,paneSel='.demo-pane:not(.jk-proposal)']=process.argv.slice(2);
const ctxs=JSON.parse(fs.readFileSync(ctxFile,'utf8'));
const css=fs.readFileSync(DEFAULT_THEME,'utf8');
const P=['background-color','background-image','border-top-color','border-bottom-color','border-top-width','border-top-left-radius','box-shadow','color','opacity','padding-left','padding-top','font-size','font-weight','height','width','transform','translate','outline-style','outline-color','text-decoration-line'];
const STATES={base:[],hover:['hover'],active:['hover','active'],focus:['focus','focus-visible']};
async function measure(page,cdp,selector){
  const root=(await cdp.send('DOM.getDocument',{depth:0})).root.nodeId;
  const nodeId=(await cdp.send('DOM.querySelector',{nodeId:root,selector})).nodeId;
  if(!nodeId)return null;
  const out={};
  for(const [s,f] of Object.entries(STATES)){
    await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:f});
    out[s]=await page.evaluate(([sel,P])=>{const e=document.querySelector(sel);void e.offsetWidth;for(const a of document.getAnimations())try{a.finish()}catch{};const c=getComputedStyle(e);return Object.fromEntries(P.map(k=>[k,c.getPropertyValue(k).slice(0,90)]))},[selector,P]);
  }
  await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:[]});
  return out;
}
const b=new Browser();
const fixtureVals={};
for(const [id,c] of Object.entries(ctxs)){
  fixtureVals[id]=await b.withPage(loadFixture(c.fixture),css,async({page,ctx})=>{const cdp=await ctx.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');await page.evaluate((c)=>{const e=[...document.querySelectorAll(c.select)].filter(x=>!c.not||!x.matches(c.not))[c.index];if(e)e.setAttribute('data-jk-fixture-target','')},c);return measure(page,cdp,'[data-jk-fixture-target]')});
}
const {chromium}=toolRequire('playwright');
const br=await chromium.launch();const page=await br.newPage({viewport:{width:1500,height:1000}});
await page.goto('file://'+path.resolve(htmlFile));await page.waitForSelector('[data-ctx]');await page.evaluate(()=>document.fonts.ready);
const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
let bad=0;
if(!Object.keys(fixtureVals).length){console.log('没有可检查的条目');process.exit(2);}
for(const id of Object.keys(fixtureVals)){
  const sel=`[data-ctx="${id}"] ${paneSel} [data-jk-target]`;
  const pv=await measure(page,cdp,sel);
  const fx=fixtureVals[id];
  if(!pv||!fx){console.log(`? ${id}: ${!pv?'预览里找不到':'快照里找不到'}`);bad++;continue;}
  const diffs=[];
  for(const s of Object.keys(STATES))for(const k of P)if(pv[s][k]!==fx[s][k]&&!['width','height'].includes(k)&&!(k==='opacity'&&ctxs[id].revealed===false))diffs.push(`${s} ${k}: 快照 ${fx[s][k]} / 预览 ${pv[s][k]}`);
  console.log(`${diffs.length?'✗':'✓'} ${id}${diffs.length?'\n    '+diffs.slice(0,6).join('\n    '):''}`);
  if(diffs.length)bad++;
}
await br.close();await b.close();
console.log(bad?`\n${bad} 处与快照不一致`:'\n全部与快照一致');
process.exit(bad?1:0);
