#!/usr/bin/env node
/*
 * 诊断：在同一份冻结 DOM 上，分别注入 artifact 与候选 CSS（替换 local-theme-preview 层），
 * 找出目标元素 border-top-color 的"获胜规则链"。
 * 用法: node diag-border-source.mjs <artifact.css> <candidate.css> <fixture.html.gz>
 */
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const PW_DIRS = [path.resolve('../tools'), '/tmp/dsh-theme-tools'];
let chromium = null;
for (const d of PW_DIRS) {
  try { ({ chromium } = require(path.join(d, 'node_modules', 'playwright-core'))); break; } catch {}
}
if (!chromium) { console.error('playwright-core not found'); process.exit(2); }

const [artPath, candPath, fixturePath] = process.argv.slice(2);
const artCss = fs.readFileSync(artPath, 'utf8');
const candCss = fs.readFileSync(candPath, 'utf8');

const raw = fs.readFileSync(fixturePath);
const baseHtml = fixturePath.endsWith('.gz')
  ? zlib.gunzipSync(raw).toString('utf8')
  : raw.toString('utf8');

const LAYER_RE = /(<style\b[^>]*\bdata-vrcx-0-css-layer=(["'])local-theme-preview\2[^>]*>)[\s\S]*?(<\/style>)/i;
function withTheme(src, css) {
  let n = 0;
  const out = src.replace(LAYER_RE, (_m, open, _q, close) => { n++; return open + css + close; });
  if (n !== 1) throw new Error(`expected exactly one local-theme-preview style tag, found ${n}`);
  return out;
}

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const ctx = browser.contexts()[0] || (await browser.newContext());
const page = await ctx.newPage();
await page.setContent('<!doctype html><html><head></head><body></body></html>');

async function run(html, label) {
  const res = await page.evaluate(async (html) => {
    document.querySelectorAll('iframe.diag').forEach((n) => n.remove());
    const ifr = document.createElement('iframe');
    ifr.className = 'diag';
    ifr.style.cssText = 'width:1347px;height:834px;border:0;position:fixed;left:0;top:0';
    document.body.appendChild(ifr);
    const d = ifr.contentDocument;
    d.open(); d.write(html); d.close();
    await new Promise((r) => setTimeout(r, 600));

    const targets = [...d.querySelectorAll('input')].filter((el) => {
      const cs = ifr.contentWindow.getComputedStyle(el);
      return cs.borderTopStyle !== 'none' && parseFloat(cs.borderTopWidth) > 0;
    });

    const out = [];
    for (const el of targets.slice(0, 4)) {
      const cs = ifr.contentWindow.getComputedStyle(el);
      const winners = [];
      for (const sheet of d.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        const walk = (list) => {
          for (const r of list) {
            if (r.cssRules && !r.selectorText) { walk(r.cssRules); continue; }
            if (!r.selectorText) continue;
            let hit = false;
            try { hit = el.matches(r.selectorText); } catch { hit = false; }
            if (!hit) continue;
            const v = r.style.getPropertyValue('border-top-color');
            if (v) winners.push({
              sel: r.selectorText.length > 110 ? r.selectorText.slice(0, 110) + '…' : r.selectorText,
              val: v,
              prio: r.style.getPropertyPriority('border-top-color'),
            });
          }
        };
        walk(rules);
      }
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute('class') || '').slice(0, 55),
        slot: el.getAttribute('data-slot') || '(none)',
        computed: cs.borderTopColor,
        total: winners.length,
        last: winners.slice(-4),
      });
    }
    return out;
  }, html);
  console.log(`\n########## ${label} ##########`);
  for (const t of res) {
    console.log(`  <${t.tag} data-slot=${t.slot} class="${t.cls}">`);
    console.log(`     computed border-top-color = ${t.computed}   (匹配到 ${t.total} 条设该属性的规则)`);
    for (const w of t.last) console.log(`       ${w.prio ? '!' : ' '} ${String(w.val).padEnd(26)} ${w.sel}`);
  }
}

await run(withTheme(baseHtml, artCss), 'artifact');
await run(withTheme(baseHtml, candCss), 'candidate');

await page.close();
process.exit(0); // 绝不 browser.close()
