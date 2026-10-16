#!/usr/bin/env node
// Default: dry-run. --write backs up originals to a unique OS temporary directory.
// Dependencies are READ ONLY from APP_ROOT/node_modules and tools/node_modules.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = process.env.APP_ROOT || path.resolve(base, '../../../VRCX-0-jirai');
const requireApp = createRequire(path.join(app, 'package.json'));
const requireTools = createRequire(import.meta.url);
const postcss = requireApp('postcss');
const selectorParser = requireApp('postcss-selector-parser');
const { chromium } = requireTools('playwright');
const args = process.argv.slice(2);
assert(args.every(x => ['--write', '--dry-run'].includes(x)), 'Only --write / --dry-run supported');
assert(!(args.includes('--write') && args.includes('--dry-run')), 'Choose one mode');
const write = args.includes('--write');
const files = ['runtime/preview-package/jirai-kei-theme/theme.css', 'refactor/src/style/16-final-navigation.css', 'runtime/entity-button-roles-b054-b072.css'];
const protectedFiles = ['refactor/reference/baseline-theme.css', '../../themes/jirai-kei-theme/theme.css'];
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const protectedHashes = protectedFiles.map(file => ({file, sha256:hash(fs.readFileSync(path.resolve(base,file)))}));
const oldComment = 'explicit action roles share portal states.';
const newComment = 'portal button states use existing app attributes/classes only.';
const linkBlock = '  & button[data-ui-role="text-link"]:not(.entity-dialog *,.owner-dialog *){border:0;border-radius:0;background:transparent;color:#d6b8ef;box-shadow:none;text-decoration:underline dotted #8f7fe0;text-underline-offset:4px;\n    &:hover:not(:disabled){color:#ffb8e6;text-decoration-color:#ffb8e6}\n    &:active:not(:disabled){color:#fdf4ff}\n    &:focus-visible{outline:2px solid #ff7fcf;outline-offset:2px}\n    &:disabled{opacity:.58}\n  }\n';
function exactly(s, from, to, count) {
  assert.equal(s.split(from).length-1, count, `Unexpected count for ${from}`);
  return s.split(from).join(to);
}
function transform(s) {
  if (!s.includes('data-ui-role')) { assert(!s.includes(oldComment)); return s; }
  assert.equal((s.match(/data-ui-role/g)||[]).length, 11, 'Expected 11 attribute occurrences on four selector lines');
  let out = exactly(s, ':is(button[data-ui-role="action"],:where(', ':is(:where(', 1);
  out = exactly(out, ':is([data-ui-role="disclosure"],', ':is(', 1);
  for (const role of ['tile','color-swatch','text-link','disclosure'])
    out = exactly(out, `[data-ui-role="${role}"],`, '', role === 'tile' ? 2 : 1);
  for (const role of ['icon-grid','choice-list']) out = exactly(out, `[data-ui-role="${role}"] *,`, '', 1);
  out = exactly(out, ',[data-ui-role="choice-list"] button', '', 1);
  out = exactly(out, linkBlock, '', 1);
  if (out.includes(oldComment)) out = exactly(out, oldComment, newComment, 1);
  assert(!out.includes('data-ui-role'));
  return out;
}
function parse(s) {
  const ast = postcss.parse(s);
  ast.walkRules(rule => {
    // Keyframe step selectors aren't CSS element selectors.
    if (rule.parent.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;
    selectorParser().astSync(rule.selector);
    assert(!/:(?:is|not|where)\(\s*\)/.test(rule.selector));
  });
  return ast;
}
const plans = files.map(file => {
  const before = fs.readFileSync(path.join(base,file), 'utf8');
  const after = transform(before);
  parse(before); parse(after);
  assert.equal(transform(after), after, 'Non-idempotent transformation');
  return {file,before,after};
});
// Browser validation uses an isolated Linux headless browser, never the running app.
const browser = await chromium.launch({headless:true, ...(process.env.CHROME ? {executablePath:process.env.CHROME} : {})});
let comparisons = 0;
const validated = [];
try {
  const page = await browser.newPage({viewport:{width:1280,height:900}});
  await page.route('**/*', route => route.abort()); // Fixture is wholly offline.
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  assert(await page.evaluate(() => CSS.supports('selector(& button)') && CSS.supports('selector(:is(button):has(img))')), 'Chromium nesting/:has support required');
  // Exercise nesting in the CSSOM, not just CSS.supports' permissive grammar.
  assert(await page.evaluate(() => { const s=new CSSStyleSheet(); s.replaceSync('section { & button { color:red } }'); return s.cssRules[0]?.cssRules?.length === 1; }), 'Native nesting CSSOM missing');
  for (const p of plans) {
    const selectors=[];
    const oldSelectors=new Set();
    parse(p.before).walkRules(r=>oldSelectors.add(r.selector));
    parse(p.after).walkRules(r => {
      if (!oldSelectors.has(r.selector)) selectorParser().astSync(r.selector).each(s=>selectors.push(s.toString()));
    });
    const invalid = await page.evaluate(selectors => selectors.filter(s=>!CSS.supports(`selector(${s})`)), selectors);
    assert.deepEqual(invalid, [], 'Browser-rejected selector');
    validated.push({file:p.file, selectors:selectors.length});
  }
  const variants=['default','outline','secondary','ghost','destructive','link'];
  const classes=['','h-auto justify-start','h-auto justify-between','rounded-object','rounded-full','p-0','absolute inset-0 h-full w-full','rounded-r-none border-r-0','rounded-l-none'];
  const states=['','disabled','aria-disabled="true"','data-disabled','aria-expanded="true"','aria-pressed="true"','data-pressed','data-popup-open','aria-current="true"'];
  let fixture='<button id="outside">outside</button>';
  for(const slot of ['dialog-content','alert-dialog-content','sheet-content','popover-content','hover-card-content']) {
    let buttons='';
    for(const v of variants) for(const c of classes) for(const state of states) buttons+=`<button data-variant="${v}" class="${c}" ${state}>test</button>`;
    buttons+='<button>plain</button><button data-slot="collapsible-trigger">disclosure</button><button data-variant="ghost" class="h-auto"><img alt=""></button><div data-slot="dialog-header"><button data-variant="default">header</button></div><div data-slot="dropdown-menu-content"><button data-variant="default">menu</button></div><button data-slot="dialog-close" data-variant="ghost">close</button>';
    fixture+=`<section data-slot="${slot}">${buttons}</section>`;
  }
  fixture+='<section class="entity-dialog" data-slot="dialog-content"><button data-variant="default">entity</button></section><section class="owner-dialog" data-slot="dialog-content"><button data-variant="default">owner</button></section>';
  assert(!fixture.includes('data-ui-role'));
  for (const p of plans) {
    const shell=`<style>:root{--jk-button-bevel:inset 1px 1px red;--jk-button-default-face:#221133;--jk-button-default-text:#ffeedd;--jk-button-default-hover:#442255;--jk-button-pressed:inset 1px 1px blue}</style><style id="theme"></style><style>*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}button:hover{--probe-hover:1}button:active{--probe-active:1}</style>`;
    await page.setContent(shell+fixture);
    // Compare exact values inside Chromium; do not serialize inherited megabyte-sized
    // custom asset variables for every element (that exhausts the renderer heap).
    const compare=async () => page.evaluate(async ({before,after})=>{
      const capture=async css=>{
        document.querySelector('#theme').textContent=css;
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        return [...document.querySelectorAll('button')].map(el=>
          [null,'::before','::after'].map(pseudo=>{
            const cs=getComputedStyle(el,pseudo); return JSON.stringify([...cs].filter(k=>!k.startsWith('--')).map(k=>[k,cs.getPropertyValue(k)]));
          })
        );
      };
      const a=await capture(before),b=await capture(after);
      const drift=[];a.forEach((row,i)=>row.forEach((v,j)=>{if(v!==b[i][j])drift.push({button:i,pseudo:j});}));
      return {buttons:a.length,drift};
    }, {before:p.before,after:p.after});
    const result=await compare();
    assert.deepEqual(result.drift,[], `Computed-style drift: ${p.file}`);
    assert.equal(await page.locator('section button[data-variant="default"]').first().evaluate(el=>getComputedStyle(el).borderRadius), '0px', 'Portal nesting fixture not styled');
    comparisons+=result.buttons;
    // Isolate pointer states from absolute/inset-full controls in the large matrix.
    await page.setContent(shell+'<section data-slot="dialog-content"><button data-variant="default">interaction</button></section>');
    await compare();
    const el=page.locator('section button[data-variant="default"]').first();
    const {root}=await cdp.send('DOM.getDocument');
    const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'section button'});
    for(const state of ['focus','hover','active']) {
      // This headless host delivers mouse events without updating :hover. Force
      // CSS pseudo states deterministically and verify via sentinel declarations;
      // matches(':hover') does not reflect DevTools' forced state in Chromium.
      if(state==='focus') {
        await el.focus();
        assert(await el.evaluate(el=>el.matches(':focus-visible')), 'Focus-visible missing');
      } else {
        await el.evaluate(el=>el.blur());
        await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:state==='active'?['hover','active']:['hover']});
        assert.equal(await el.evaluate((el,state)=>getComputedStyle(el).getPropertyValue(`--probe-${state}`).trim(),state),'1', `CSS state not effective: ${state}`);
      }
      const interaction=await compare();
      assert.deepEqual(interaction.drift,[], `State drift ${state}: ${p.file}`);
      comparisons+=interaction.buttons;
    }
    await cdp.send('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:[]});
  }
} finally { await browser.close(); }
let backup=null;
if(write && plans.some(p=>p.before!==p.after)) {
  backup=fs.mkdtempSync(path.join(os.tmpdir(),'jk-ui-role-'));
  // Validate every input is still the observed version before any mutation.
  for(const p of plans) assert.equal(fs.readFileSync(path.join(base,p.file),'utf8'),p.before);
  for(const p of plans) if(p.before!==p.after) {
    const dest=path.join(backup,p.file); fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.writeFileSync(dest,p.before);
  }
  for(const p of plans) if(p.before!==p.after) fs.writeFileSync(path.join(base,p.file),p.after);
}
for(const p of plans) if(write) assert.equal(fs.readFileSync(path.join(base,p.file),'utf8'),p.after);
for(const p of protectedHashes) assert.equal(hash(fs.readFileSync(path.resolve(base,p.file))),p.sha256);
const report={mode:write?'write':'dry-run',backup,browser:'isolated headless Chromium',computedStyleComparisons:comparisons,validated,files:plans.map(p=>({file:p.file,changed:p.before!==p.after,beforeBytes:Buffer.byteLength(p.before),afterBytes:Buffer.byteLength(p.after),beforeHash:hash(p.before),afterHash:hash(p.after),remainingRoleOccurrences:(p.after.match(/data-ui-role/g)||[]).length})),protectedFiles:protectedHashes};
if(backup) fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
