/* exclusion-migration / analyze.mjs
 *
 * For every theme rule that carries an exclusion clause for one of the three contexts
 *   login-page   (:not([data-vrcx-0-surface=login-page] *) / :not(.vrcx-0-main-shell[...] *))
 *   entity-dialog (:not(.entity-dialog *))
 *   settings-tabs (:not(.vrcx-0-page-scaffold:has(> [data-slot=tabs-list].w-44) *))
 * decide per context: Keep / Drop / Partial, and name the replacement ("alternative") rules file:line.
 *
 * Method (static + fixture; no production file is touched):
 *   1. postcss parses every runtime/*.css  -> rule file:line, selector list, declarations.
 *   2. a fixture page (fixture.mjs: all primitive variants x 13 real ancestor chains + extra subjects) is rendered with the
 *      built theme.css split per SECTION (same cascade as the concatenated file).
 *   3. "released set" = elements that match the selector WITH the clause removed but not the original selector
 *      (dynamic pseudo-classes are forced on, UA pseudo-elements stripped; matching is exact browser matching via querySelectorAll).
 *   4. alternative rules = other theme rules matching the released element, same pseudo-element, overlapping longhand properties.
 *      Coverage is per longhand (+ same dynamic-state family); values compared as browser-computed values.
 *   5. class: Keep (alternative covers every released property with a DIFFERENT look) / Drop (no alternative, or the alternative is
 *      identical to the generic rule, or the clause matches nothing = vacuous) / Partial (some properties/states covered, some not).
 *
 *   node analyze.mjs --runtime <runtime dir> --theme <theme.css> --out <dir> [--tag before]
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadRules, listClauses, rewriteSelector, clauseKind, selectorParser, CONTEXT_KINDS, here} from './common.mjs';
import {buildFixture, splitSections, loadAppCss, buildPage, PORTAL_SUBJECTS} from './fixture.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const RUNTIME = path.resolve(opt('runtime', path.resolve(here, '../..')));
const THEME = opt('theme', '/tmp/exclusion-migration/out/before/jirai-kei-theme/theme.css');
const OUT = path.resolve(opt('out', here));
const TAG = opt('tag', '');
const PW = process.env.AUDIT_PLAYWRIGHT || '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/tmp/dsh-theme-browsers';
process.env.TMPDIR ||= '/tmp/exclusion-migration/browser-tmp';
await fs.mkdir(process.env.TMPDIR, {recursive: true});

/* ---------- selector preparation for browser matching ---------- */
const DYN = new Set([':hover', ':active', ':focus-visible', ':focus-within', ':focus']);
const UA_PSEUDO_RE = /^(::?)(before|after|placeholder|file-selector-button|marker|selection|first-line|first-letter|-webkit-[\w-]+|-moz-[\w-]+)$/i;
function prepare(sel) {
  let pseudo = null; const states = new Set();
  const match = selectorParser(root => {
    root.walkPseudos(p => {
      const v = p.value.toLowerCase();
      if (UA_PSEUDO_RE.test(v) || v.startsWith('::')) { pseudo = p.toString(); p.remove(); return; }
      if (DYN.has(v)) { states.add(v); p.replaceWith(selectorParser.attribute({attribute: 'data-xs'})); }
    });
    let changed = true;
    while (changed) { changed = false; root.walkPseudos(p => { if (/^:(where|is)$/i.test(p.value) && p.nodes.every(s => s.nodes.length === 0)) { p.remove(); changed = true; } }); }
  }).processSync(sel);
  return {match, pseudo, states: [...states].sort().join('+')};
}
function subjectOf(sel) { // last compound: data-slot / tag summary
  let s = '';
  selectorParser(root => {
    root.each(seg => {
      const comp = []; let cur = [];
      for (const n of seg.nodes) { if (n.type === 'combinator') { cur = []; continue; } cur.push(n); }
      comp.push(...cur);
      const slot = comp.find(n => n.type === 'attribute' && n.attribute === 'data-slot');
      const tag = comp.find(n => n.type === 'tag');
      const isPseudoInside = comp.find(n => n.type === 'pseudo' && /^:(is|where)$/i.test(n.value));
      s = slot ? `[data-slot${slot.operator || ''}${slot.value ? '=' + slot.value : ''}]` : tag ? tag.value : (isPseudoInside ? isPseudoInside.toString().slice(0, 50) : comp.map(n => n.toString()).join('').slice(0, 50));
    });
  }).processSync(sel);
  return s;
}
function summarySelector(sel) {
  return selectorParser(root => {
    root.walkPseudos(p => {
      if (p.value.toLowerCase() === ':not' && p.nodes.length === 1) {
        const n = p.nodes[0].nodes; const last = n[n.length - 1], prev = n[n.length - 2];
        if (n.length >= 3 && last.type === 'universal' && prev?.type === 'combinator') {
          const k = clauseKind(p.nodes[0].toString());
          p.replaceWith(selectorParser.tag({value: k === 'login-page' ? '«L»' : k === 'entity-dialog' ? '«E»' : k === 'settings-tabs' ? '«S»' : '«x»'}));
        }
      }
    });
  }).processSync(sel).replace(/\s+/g, ' ').trim();
}

/* ---------- 1. rules ---------- */
const {rules, fileToSection} = loadRules(RUNTIME);
const exRules = rules.filter(r => r.selectors.some(s => listClauses(s).some(c => CONTEXT_KINDS.includes(c.kind))));

/* ---------- 2. page ---------- */
const themeText = await fs.readFile(THEME, 'utf8');
const sections = splitSections(themeText);
const appCss = await loadAppCss();
const fixture = await buildFixture();
const html = buildPage({fixture, sections, appCss, withTheme: true});
const {chromium} = await import(PW);
const browser = await chromium.launch({headless: true, args: ['--disable-dev-shm-usage', '--no-sandbox']});
const page = await browser.newPage({viewport: {width: 1200, height: 900}});
const perrs = []; page.on('pageerror', e => perrs.push(e.message));
await page.setContent(html, {waitUntil: 'load'});
await page.evaluate(() => document.fonts && document.fonts.ready);

/* index elements */
const elemInfo = await page.evaluate(() => {
  const info = [];
  document.querySelectorAll('[data-scene] *').forEach(e => { e.setAttribute('data-xs', ''); });
  document.querySelectorAll('[data-scene]').forEach(sc => sc.querySelectorAll('*').forEach(e => {
    if (e.__eid != null) return; e.__eid = info.length;
    const cell = e.closest('[data-cell]');
    let idx = -1; if (cell) { idx = e === cell ? -1 : [...cell.querySelectorAll('*')].indexOf(e); }
    info.push({ctx: sc.getAttribute('data-scene'), cell: cell ? cell.getAttribute('data-cell') : null, idx, tag: e.tagName.toLowerCase(), slot: e.getAttribute('data-slot') || '', variant: e.getAttribute('data-variant') || ''});
  }));
  return info;
});
const cellMeta = Object.fromEntries(fixture.cells.map(c => [c.aid, c]));
const eidsByCell = {}; elemInfo.forEach((ci, eid) => { if (ci.cell) (eidsByCell[ci.cell] ||= {})[ci.idx] = eid; });
/** the same element in the canonical context (main-content): rules matching BOTH are global base rules, not context replacements */
function counterpart(eid) {
  const ci = elemInfo[eid]; if (!ci.cell) return null; const c = cellMeta[ci.cell]; if (!c || c.ctx === 'main-content' || !c.ctx.match(/^[a-z-]+$/) || c.ctx.startsWith('portal')) return null;
  const canonAid = ci.cell.replace(`__${c.ctx}__`, '__main-content__').replace(new RegExp(`__${c.ctx}$`), '__main-content');
  return eidsByCell[canonAid]?.[ci.idx] ?? null;
}

async function qsa(selectors) { // -> {selector: [eids] | null}
  return page.evaluate((sels) => {
    const out = {};
    for (const s of sels) {
      try { out[s] = [...document.querySelectorAll(s)].filter(e => e.__eid != null).map(e => e.__eid); } catch { out[s] = null; }
    }
    return out;
  }, selectors);
}

/* ---------- 3. released sets ---------- */
const FIXED_SETTINGS = '.vrcx-0-page-scaffold:has(> [data-slot="tabs"] > [data-slot="tabs-list"][class~="w-44"]) *';
const jobs = []; const selSet = new Set();
for (const r of exRules) {
  r.selectors.forEach((s, si) => {
    const clauses = listClauses(s);
    for (const K of CONTEXT_KINDS) {
      if (!clauses.some(c => c.kind === K)) continue;
      const oldP = prepare(s), newP = prepare(rewriteSelector(s, [K]));
      const job = {rid: r.id, si, K, s, oldP, newP};
      if (K === 'settings-tabs') { job.fixedP = prepare(rewriteSelector(s, [K], {[K]: FIXED_SETTINGS})); selSet.add(job.fixedP.match); }
      jobs.push(job); selSet.add(oldP.match); selSet.add(newP.match);
    }
  });
}
const matchRes = await qsa([...selSet]);
for (const j of jobs) {
  const o = new Set(matchRes[j.oldP.match] || []), n = matchRes[j.newP.match] || [];
  j.invalid = matchRes[j.newP.match] == null || matchRes[j.oldP.match] == null;
  j.released = n.filter(e => !o.has(e));
  if (j.fixedP) { const f = new Set(matchRes[j.fixedP.match] || []); j.fixedExcluded = n.filter(e => !f.has(e)); }
}

/* ---------- 4. alternative rules: matches of every theme rule selector over the released union ---------- */
const union = new Set(); for (const j of jobs) { j.released.forEach(e => union.add(e)); (j.fixedExcluded || []).forEach(e => union.add(e)); }
for (const e of [...union]) { const c = counterpart(e); if (c != null) union.add(c); }
const altSels = []; // {rid, si, prep}
const altSelSet = new Set();
const mediaChains = [...new Set(rules.flatMap(r => r.atChain))];
const mediaOk = await page.evaluate((chains) => { const o = {}; for (const c of chains) { const m = /^@media (.*)$/.exec(c); o[c] = m ? matchMedia(m[1]).matches : /^@(supports|layer)/.test(c); } return o; }, mediaChains);
for (const r of rules) {
  if (r.atChain.some(c => mediaOk[c] === false)) continue;
  r.selectors.forEach((s, si) => { const prep = prepare(s); altSels.push({rid: r.id, si, prep}); altSelSet.add(prep.match); });
}
const altMatch = await page.evaluate(([sels, unionArr]) => {
  const U = new Set(unionArr); const out = {};
  for (const s of sels) { try { const m = [...document.querySelectorAll(s)].map(e => e.__eid).filter(id => id != null && U.has(id)); if (m.length) out[s] = m; } catch { } }
  return out;
}, [[...altSelSet], [...union]]);

/* declaration expansion + computed values (browser-normalised) */
const declExp = await page.evaluate((all) => {
  const host = document.createElement('div'); host.style.cssText = 'position:absolute;left:0;top:0;width:200px;height:100px'; document.body.appendChild(host);
  const probe = document.createElement('div'); host.appendChild(probe);
  const out = {};
  for (const [rid, decls] of Object.entries(all)) {
    out[rid] = decls.map(d => {
      probe.removeAttribute('style');
      if (/^--/.test(d.prop)) return {prop: d.prop, imp: d.imp, lh: {[d.prop]: d.value.trim()}};
      probe.style.setProperty(d.prop, d.value);
      const names = []; for (let i = 0; i < probe.style.length; i++) names.push(probe.style[i]);
      const cs = getComputedStyle(probe); const lh = {};
      for (const n of names) lh[n] = cs.getPropertyValue(n);
      if (!names.length) lh[d.prop] = d.value.trim(); // unknown/invalid (e.g. -webkit-only) keep raw
      return {prop: d.prop, imp: d.imp, lh};
    });
  }
  host.remove(); return out;
}, Object.fromEntries(rules.map(r => [r.id, r.decls.map(d => ({prop: d.prop, value: d.value, imp: d.important}))])));

/* ---------- 5. current computed values on released elements ---------- */
const curQueries = []; // {eid, pseudo, props}
const propsOfRule = rid => [...new Set(declExp[rid].flatMap(d => Object.keys(d.lh)))];
const ruleById = Object.fromEntries(rules.map(r => [r.id, r]));
const curKey = (eid, pseudo) => `${eid}|${pseudo || ''}`;
const curWant = new Map();
for (const j of jobs) {
  const pseudo = j.newP.pseudo;
  const els = j.K === 'settings-tabs' ? (j.fixedExcluded || []) : j.released;
  for (const e of els) { const k = curKey(e, pseudo); const set = curWant.get(k) || new Set(); propsOfRule(j.rid).forEach(p => set.add(p)); curWant.set(k, set); }
}
const curVals = await page.evaluate((qs) => {
  const byId = new Map(); document.querySelectorAll('[data-scene] *').forEach(e => byId.set(e.__eid, e));
  const out = {};
  for (const [k, props] of qs) {
    const [eid, pseudo] = k.split('|'); const el = byId.get(Number(eid)); if (!el) continue;
    let cs; try { cs = getComputedStyle(el, pseudo && /^::?(before|after|placeholder|file-selector-button|marker|selection)$/.test(pseudo) ? pseudo : null); } catch { continue; }
    const o = {}; for (const p of props) o[p] = cs.getPropertyValue(p); out[k] = o;
  }
  return out;
}, [...curWant.entries()].map(([k, s]) => [k, [...s]]));

/* ---------- 6. coverage ---------- */
const IGNORE_PROP = /^(transition|animation|will-change|--)/;
const norm = v => String(v ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
const altByEid = new Map(); // eid -> [{rid, si, prep}]
for (const a of altSels) { const m = altMatch[a.prep.match]; if (!m) continue; for (const e of m) { if (!union.has(e)) continue; const arr = altByEid.get(e) || []; arr.push(a); altByEid.set(e, arr); } }

function classifyElement(job, eid) {
  const ignoreCur = job.K === 'settings-tabs'; // the generic rule currently APPLIES there (dead clause), so the live value says nothing about alternatives
  const R = ruleById[job.rid];
  const pseudo = job.newP.pseudo, states = job.newP.states;
  const myDecls = declExp[R.id];
  // longhand -> {value, important} of the generic rule (last declaration of a prop wins within the rule)
  const D = {};
  for (const d of myDecls) for (const [lh, v] of Object.entries(d.lh)) if (!IGNORE_PROP.test(lh)) D[lh] = {value: v, imp: d.imp};
  const props = Object.keys(D);
  const cur = curVals[curKey(eid, pseudo)] || {};
  const cp = counterpart(eid);
  const cpSet = cp != null ? new Set((altByEid.get(cp) || []).map(a => a.rid + '#' + a.si)) : new Set();
  const all = (altByEid.get(eid) || []).filter(a => a.rid !== R.id && (a.prep.pseudo || '') === (pseudo || ''));
  const alts = all.filter(a => !cpSet.has(a.rid + '#' + a.si)); // context-specific replacements only
  const baseAlts = all.filter(a => cpSet.has(a.rid + '#' + a.si));
  const per = {};
  for (const p of props) {
    const covering = [], baseOnly = [];
    for (const a of alts) {
      const decls = declExp[a.rid];
      let found = null;
      for (const d of decls) if (d.lh[p] !== undefined) found = {value: d.lh[p], imp: d.imp};
      if (!found) continue;
      const rec = {rid: a.rid, value: found.value, imp: found.imp, states: a.prep.states};
      if (a.prep.states === states) covering.push(rec); else baseOnly.push(rec);
    }
    let curSame = !ignoreCur && !states && !pseudo?.startsWith('::-webkit') && cur[p] !== undefined && norm(cur[p]) === norm(D[p].value);
    // UA pseudo-elements (slider track/thumb) cannot be read back: an undeclared radius is the UA default 0
    if (!curSame && /^::-webkit-(slider|progress)/.test(pseudo || '') && /radius$/.test(p) && /^0(px)?$/.test(D[p].value)) curSame = true;
    let st;
    if (covering.length) st = covering.some(c => norm(c.value) === norm(D[p].value)) ? 'alt-same' : 'alt-differs';
    else if (baseOnly.length) st = 'alt-state-gap';
    else st = curSame ? 'already-same' : 'uncovered';
    per[p] = {st, alt: [...covering, ...baseOnly].slice(0, 3).map(c => c.rid), gen: D[p].value, cur: cur[p], curIsGen: cur[p] !== undefined && norm(cur[p]) === norm(D[p].value)};
  }
  const sts = Object.values(per).map(x => x.st);
  const has = s => sts.includes(s);
  let cls;
  if (!sts.length) cls = 'drop-noprops';
  else if (sts.every(s => s === 'alt-same' || s === 'already-same')) cls = 'drop-redundant';
  else if (sts.every(s => s === 'uncovered' || s === 'already-same' || s === 'alt-same')) cls = 'drop-gap';
  else if (sts.every(s => s === 'alt-differs' || s === 'alt-same' || s === 'already-same')) cls = 'keep';
  else cls = 'partial';
  return {cls, per};
}

const SIG = r => r.id;
const result = [];
const ctxOfElem = e => elemInfo[e].ctx;
const portalCell = cellId => { const c = cellMeta[cellId]; return c && c.kind === 'extra' && PORTAL_SUBJECTS.has(c.prim.slice(2)); };
function summariseContext(rid, K) {
  const J = jobs.filter(j => j.rid === rid && j.K === K);
  const out = {kind: K, selectorsWithClause: J.length};
  if (!J.length) return null;
  const isSettings = K === 'settings-tabs';
  const elemCls = []; // {job, eid, cls, per}
  const releasedAll = new Set();
  for (const j of J) {
    const els = isSettings ? (j.fixedExcluded || []) : j.released;
    for (const e of els) { releasedAll.add(e); elemCls.push({job: j, eid: e, ...classifyElement(j, e)}); }
  }
  const actualReleased = J.flatMap(j => j.released);
  out.releasedElements = isSettings ? actualReleased.length : releasedAll.size;
  if (isSettings) { out.deadClause = actualReleased.length === 0; out.hypotheticalFixedExcluded = releasedAll.size; }
  // group by reach
  const real = [], latent = [], portal = [];
  for (const x of elemCls) {
    const ci = elemInfo[x.eid]; const cell = ci.cell && cellMeta[ci.cell];
    if (!cell) { latent.push(x); continue; }
    if (portalCell(ci.cell) && cell.ctx !== 'portal-root') portal.push(x);
    else if (cell.kind === 'prim' ? cell.used : true) real.push(x);
    else latent.push(x);
  }
  out.reach = {real: real.length, latent: latent.length, portalHypothetical: portal.length};
  const counted = [...real, ...latent];
  const byPrim = {};
  for (const x of counted) { const ci = elemInfo[x.eid]; const cell = ci.cell && cellMeta[ci.cell]; const key = cell ? (cell.kind === 'prim' ? cell.prim : cell.prim) : ci.slot || ci.tag; const b = byPrim[key] || (byPrim[key] = {n: 0, cls: {}, used: cell ? cell.used : false, ctx: new Set()}); b.n++; b.cls[x.cls] = (b.cls[x.cls] || 0) + 1; b.ctx.add(ci.ctx); }
  out.byPrim = Object.fromEntries(Object.entries(byPrim).map(([k, v]) => [k, {...v, ctx: [...v.ctx]}]));
  const clsSet = new Set(counted.map(x => x.cls));
  let cls, why;
  if (!counted.length) {
    cls = 'Drop'; out.vacuous = true;
    if (!elemCls.length) why = isSettings ? 'dead clause: `>` direct-child test fails on the real DOM (scaffold > div[data-slot=tabs] > TabsList), so it matches nothing; there is no element it could even exclude in any fixture scene'
      : 'no fixture element is released: the rule\'s scope/subject can never sit inside this context (scope root such as :where(.vrcx-0-main-content,.vrcx-0-side-panel), or login/main-shell is not an ancestor)';
    else why = 'only hypothetical nesting of portal-hosted popups (Base UI FloatingPortal renders into body / the parent portal node, never inside the dialog popup) is released: the clause can never fire in the real DOM';
  } else if ([...clsSet].every(c => c === 'drop-gap' || c === 'drop-redundant' || c === 'drop-noprops')) {
    cls = 'Drop'; why = clsSet.has('drop-gap') ? 'no replacement rule styles the released properties in this context (they fall back to browser/shadcn defaults)' : 'replacement rules produce the same computed values as the generic rule (redundant)';
  } else if ([...clsSet].every(c => c === 'keep' || c === 'drop-redundant')) {
    cls = 'Keep'; why = 'a context-specific rule covers every released property with a deliberately different look';
  } else { cls = 'Partial'; why = 'replacement rules cover only some of the released properties/states: ' ; }
  if (cls === 'Partial' || cls === 'Drop' && !out.vacuous) {
    // uncovered / state-gap properties
    const unc = {}, gap = {};
    for (const x of counted) for (const [p, v] of Object.entries(x.per)) { if (v.st === 'uncovered') unc[p] = (unc[p] || 0) + 1; if (v.st === 'alt-state-gap') gap[p] = (gap[p] || 0) + 1; }
    out.uncoveredProps = Object.keys(unc); out.stateGapProps = Object.keys(gap);
    if (cls === 'Partial') why += `uncovered=[${Object.keys(unc).join(',')}]` + (Object.keys(gap).length ? ` state-gap=[${Object.keys(gap).join(',')}]` : '');
  }
  // alternative rules (frequency ordered)
  const altCount = {};
  for (const x of counted) for (const v of Object.values(x.per)) for (const a of v.alt) altCount[a] = (altCount[a] || 0) + 1;
  out.alternatives = Object.entries(altCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([a]) => a);
  if (isSettings) {
    // evidence for the dead-clause decision: what would "fix the clause" change on the settings page today?
    const chg = {}; let els = 0;
    for (const x of elemCls) { if (x.job.newP.states) continue; const ps = Object.entries(x.per).filter(([, v]) => v.curIsGen && (v.st === 'uncovered' || v.st === 'alt-differs' || v.st === 'alt-state-gap')).map(([p]) => p); if (ps.length) { els++; ps.forEach(p => { chg[p] = (chg[p] || 0) + 1; }); } }
    out.fixWouldChange = {elements: els, props: Object.keys(chg)};
    out.currentLook = 'generic rule applies (dead clause never excludes)';
  }
  out.class = cls; out.why = why;
  out.elementClasses = Object.fromEntries([...clsSet].map(c => [c, counted.filter(x => x.cls === c).length]));
  // usage flag: any released element on a cell with real use sites
  out.usedBySites = [...new Set(real.flatMap(x => { const c = cellMeta[elemInfo[x.eid].cell]; return c?.sites || []; }))].slice(0, 6);
  out.latentOnly = real.length === 0 && counted.length > 0;
  return out;
}

for (const r of exRules) {
  const ctxs = {};
  for (const K of CONTEXT_KINDS) { const s = summariseContext(r.id, K); if (s) ctxs[K] = s; }
  const others = [...new Set(r.selectors.flatMap(s => listClauses(s).filter(c => !CONTEXT_KINDS.includes(c.kind)).map(c => c.kind)))];
  result.push({id: r.id, file: r.fileName, line: r.line, endLine: r.endLine, section: r.section, atChain: r.atChain,
    subject: subjectOf(r.selectors[0].replace(/:where\(:not\([^]*$/, '')), selector: summarySelector(r.selector).slice(0, 220),
    nSelectors: r.selectors.length, otherExclusions: others, props: [...new Set(r.decls.map(d => d.prop))], contexts: ctxs});
}

await browser.close();
const summary = {};
for (const K of CONTEXT_KINDS) { summary[K] = {}; for (const f of new Set(result.map(r => r.file))) summary[K][f] = {Keep: 0, Drop: 0, Partial: 0, vacuousDrop: 0, total: 0}; summary[K].ALL = {Keep: 0, Drop: 0, Partial: 0, vacuousDrop: 0, total: 0}; }
for (const r of result) for (const [K, c] of Object.entries(r.contexts)) for (const key of [r.file, 'ALL']) { const b = summary[K][key]; b[c.class]++; b.total++; if (c.vacuous) b.vacuousDrop++; }
const out = {meta: {tag: TAG, theme: THEME, runtime: RUNTIME, src: process.env.AUDIT_SRC || '/tmp/vrcx-win-src-r9/src', rulesParsed: rules.length, exclusionRules: exRules.length, pageErrors: perrs.slice(0, 5), generated: new Date().toISOString()}, summary, rules: result};
await fs.mkdir(OUT, {recursive: true});
await fs.writeFile(path.join(OUT, `exclusions${TAG ? '.' + TAG : ''}.json`), JSON.stringify(out, null, 1) + '\n');
console.log(JSON.stringify(summary, null, 1));
console.log('rules', exRules.length, 'page errors', perrs.length);
