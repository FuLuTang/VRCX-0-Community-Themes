#!/usr/bin/env node
// Extracts the real surroundings of representative elements from the baseline fixtures, for the
// comparison previews (preview-replay.tsx). Structure only: text nodes are dropped, and attributes
// that can carry personal data (src, href, alt, title, aria-label, value, placeholder, timestamps,
// anything containing VRChat ids or URLs) keep their name but lose their value; url(...) is stripped from inline styles.
// For every ancestor, its other children are kept as skeletons (depth-limited) so :has(), sibling
// combinators and :nth-child() in theme selectors still match; the preview hides those skeletons.
// Usage (from JK/tools): node ../checks/extract-preview-contexts.mjs ../checks/<name>-context-specs.json ../checks/<name>-contexts.json
import fs from 'node:fs';
import {Browser, loadFixture, DEFAULT_THEME} from '../tools/common.mjs';

const [specFile, outFile] = process.argv.slice(2);
const specs = JSON.parse(fs.readFileSync(specFile, 'utf8'));
const css = fs.readFileSync(DEFAULT_THEME, 'utf8');
const b = new Browser();
const out = {};
const byFx = {};
for (const s of specs) (byFx[s.fixture] ||= []).push(s);
for (const [fx, list] of Object.entries(byFx)) {
  await b.withPage(loadFixture(fx), css, async ({page}) => {
    const res = await page.evaluate((list) => {
      const DROP = /^(src|srcset|href|alt|title|aria-label|aria-description|aria-valuetext|placeholder|value|content|data-virtual-row-key|data-day|data-value|data-key|data-id|data-user-id|download|poster|action)$/;
      const PERSONAL = /usr_|wrld_|avtr_|grp_|file_|inst_|https?:|[0-9a-f]{8}-[0-9a-f]{4}-/i;
      const attrs = (e) => {
        const o = {};
        for (const a of e.attributes) {
          if (a.name.startsWith('on') || a.name === 'srcset') continue;
          let v = a.value;
          // Keep the attribute (presence selectors still match) but never its possibly personal value.
          if (DROP.test(a.name) || (PERSONAL.test(v) && a.name !== 'class' && a.name !== 'style')) v = a.name === 'href' ? '#' : '';
          if (a.name === 'style') v = v.replace(/url\([^)]*\)/g, 'none');
          o[a.name] = v;
        }
        return o;
      };
      let budget = 0;
      const SKIP = ['SCRIPT', 'STYLE', 'TEMPLATE', 'LINK', 'META'];
      const node = (e, depth) => {
        budget++;
        const n = {tag: e.tagName.toLowerCase(), attrs: attrs(e)};
        if (n.tag === 'svg') return n; // icons are re-drawn from their lucide class
        if (depth > 0 && budget < 6000) {
          const kids = [...e.children].filter((c) => !SKIP.includes(c.tagName));
          if (kids.length) n.children = kids.slice(0, 40).map((c) => node(c, depth - 1));
        }
        return n;
      };
      return list.map((s) => {
        const cands = [...document.querySelectorAll(s.select)].filter((e) => !s.not || !e.matches(s.not));
        const e = cands[s.index || 0];
        if (!e) return {id: s.id, error: 'not found (' + cands.length + ')'};
        budget = 0;
        const anc = [];
        for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) anc.unshift(a);
        const path = [...anc, e];
        // Each ancestor keeps up to 12 siblings on either side of the on-path child, as skeletons.
        const chain = anc.map((a, i) => {
          const kids = [...a.children].filter((c) => !SKIP.includes(c.tagName));
          const at = kids.indexOf(path[i + 1]);
          return {tag: a.tagName.toLowerCase(), attrs: attrs(a), before: kids.slice(Math.max(0, at - 12), at).map((c) => node(c, 7)), after: kids.slice(at + 1, at + 13).map((c) => node(c, 7))};
        });
        const bs = getComputedStyle(document.body);
        const inherit = Object.fromEntries(['color', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'font-feature-settings', 'font-variation-settings', 'text-rendering', '-webkit-font-smoothing', 'text-transform', 'word-spacing'].map((k) => [k, bs.getPropertyValue(k)]));
        const rect = e.getBoundingClientRect();
        const revealed = (() => { for (let a = e; a; a = a.parentElement) { const c = getComputedStyle(a); if (c.opacity === '0' || c.visibility === 'hidden') return false; } return true; })();
        return {id: s.id, fixture: s.fixture, size: [Math.round(rect.width * 10) / 10, Math.round(rect.height * 10) / 10], revealed, select: s.select, not: s.not, index: s.index || 0, count: cands.length, chain, element: node(e, 4), html: attrs(document.documentElement), body: attrs(document.body), inherit};
      });
    }, list);
    for (const r of res) {
      out[r.id] = r;
      console.log(r.id.padEnd(22), r.error || `${r.count} 个候选，祖先 ${r.chain.length} 层`);
    }
  });
}
await b.close();
const text = JSON.stringify(out);
const leak = text.match(/usr_[0-9a-f]|wrld_[0-9a-f]|avtr_[0-9a-f]|https?:\/\//);
if (leak) { console.error('疑似个人数据残留：' + leak[0]); process.exit(2); }
fs.writeFileSync(outFile, text);
console.log(`写入 ${outFile}（${text.length.toLocaleString()} 字节）`);
