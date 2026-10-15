/* Builds baseline/reports/refactor-progress.html: a white preview showing the real,
   sanitized field surfaces that share one outer frame, with the full candidate CSS
   embedded. Every value that is not a structural token is stripped in the browser
   before it reaches this file, so no user DOM, ids or PII are ever written out. */
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createRequire } from 'node:module';

const { chromium } = createRequire('/tmp/dsh-theme-tools/package.json')('playwright');
const base = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const css = fs.readFileSync(`${base}/runtime/preview-package/jirai-kei-theme/theme.css`, 'utf8');

const LAYER = /(<style\b[^>]*\bdata-vrcx-0-css-layer=(['"])local-theme-preview\2[^>]*>)[\s\S]*?(<\/style>)/i;

function fixture(name) {
  const raw = gunzipSync(fs.readFileSync(`${base}/baseline/fixtures/${name}.html.gz`)).toString('utf8');
  let seen = 0;
  const out = raw.replace(LAYER, (_m, open, _q, close) => (seen++, open + css + close));
  if (seen !== 1) throw new Error(`${name}: expected one theme layer, saw ${seen}`);
  return out;
}

/* Runs inside the page: clones a sample and keeps only structural attributes. */
const sampler = (options) => {
  const PRIVATE = [/[\\w.+-]+@[\\w.-]+/, /[0-9a-f]{8}-[0-9a-f-]{27,}/i, /usr_[0-9a-f-]{8,}/i];
  const KEEP = new Set(['class','data-slot','data-variant','data-size','data-vrcx-0-control',
    'data-align','data-direction','type','role','disabled','aria-disabled','aria-invalid',
    'aria-haspopup','aria-expanded','aria-hidden','aria-checked','tabindex','data-state',
    'readonly','required','viewBox','width','height','fill','stroke','stroke-width',
    'stroke-linecap','stroke-linejoin','fill-rule','clip-rule','xmlns','d','cx','cy','r']);
  const clean = (node) => {
    for (const attr of [...node.attributes]) {
      if (attr.name === 'class') {
        node.setAttribute('class', attr.value.split(/\s+/)
          .filter((t) => t && t.length < 120 && !PRIVATE.some((re) => re.test(t))).join(' '));
      } else if (!KEEP.has(attr.name)) {
        node.removeAttribute(attr.name);
      }
    }
    if (node.tagName === 'INPUT') {
      node.value = '';
      node.setAttribute('type', 'text');
      node.setAttribute('placeholder', options.placeholder);
    }
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) child.remove();
      else if (child.nodeType === 1) clean(child);
    }
  };
  const pick = new Function('el', 'return (' + options.pick + ')');
  const el = [...document.querySelectorAll(options.selector)].find(pick);
  if (!el) throw new Error('sample missing: ' + options.selector);
  const clone = el.cloneNode(true);
  clean(clone);
  if (options.valueText) {
    const value = clone.querySelector('[data-slot="select-value"]');
    if (value) value.textContent = options.valueText;
    else clone.append(document.createTextNode(options.valueText));
  }
  return { html: clone.outerHTML, tag: clone.tagName, role: el.getAttribute('role') || '' };
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.route('**/*', (route) =>
    route.request().url().startsWith('data:') ? route.continue() : route.abort(),
  );

  await page.setContent(fixture('charts_mutual'), { waitUntil: 'domcontentloaded' });
  const field = await page.evaluate(sampler, {
    selector: '.vrcx-0-main-content [data-slot="input"]',
    pick: "el.type === 'text' && !el.disabled && el.getBoundingClientRect().width > 0",
    placeholder: '输入内容',
  });

  await page.setContent(fixture('tools_screenshot-metadata'), { waitUntil: 'domcontentloaded' });
  const group = await page.evaluate(sampler, {
    selector: '.vrcx-0-main-content [data-slot="input-group"]',
    pick: 'el.getBoundingClientRect().width > 0',
    placeholder: '搜索内容',
  });
  const groupRaw = await page.evaluate(
    () => document.querySelector('.vrcx-0-main-content [data-slot="input-group"]')
      ?.querySelector('button[data-slot="dropdown-menu-trigger"]')?.tagName ?? '',
  );
  if (groupRaw !== 'BUTTON') throw new Error('toolbar dropdown trigger is not a button');

  await page.setContent(fixture('browse-history-time-range-popover'), { waitUntil: 'domcontentloaded' });
  const select = await page.evaluate(sampler, {
    selector: '[data-slot="select-trigger"]',
    pick: 'el.getBoundingClientRect().width > 0',
    placeholder: '',
    valueText: '选择',
  });
  if (select.tag !== 'BUTTON' || select.role !== 'combobox') throw new Error('unexpected select trigger role');

  const styles = [...fixture('charts_mutual').matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi)]
    .filter((m) => !/@import\b/i.test(m[2]))
    .map((m) => `<style>${m[2].replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '')}</style>`);

  const inner = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${styles.join('\n')}<style>html,body{margin:0!important;min-height:100%!important;background:#fff!important;color:#171717!important}.vrcx-0-main-content{min-height:230px!important;padding:24px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:start!important;gap:24px!important;background:#fff!important;color:#171717!important}.preview-kind{min-width:0!important;background:#fff!important;color:#171717!important}.preview-label{margin:0 0 10px!important;background:#fff!important;color:#171717!important;font:600 14px/1.4 system-ui,sans-serif!important}.preview-context{display:block!important;width:256px!important;max-width:100%!important;min-height:0!important;padding:0!important;border:0!important;background:#fff!important;color:#171717!important;box-shadow:none!important}.vrcx-0-page-toolbar{display:block!important;width:min(256px,100%)!important;min-height:0!important;padding:0!important;border:0!important;background:#fff!important;color:#171717!important;box-shadow:none!important;transform:none!important}@media(max-width:760px){.vrcx-0-main-content{grid-template-columns:1fr!important;min-height:530px!important;gap:22px!important}}</style></head><body><div class="vrcx-0-main-content"><section class="preview-kind"><div class="preview-label">独立输入框</div><div class="vrcx-0-page-scaffold preview-context">${field.html}</div></section><section class="preview-kind"><div class="preview-label">工具栏输入组（左图标 + 输入框 + 真实按钮）</div><div class="vrcx-0-page-toolbar">${group.html}</div></section><section class="preview-kind"><div class="preview-label">下拉选择器（整条就是一个 button）</div><div class="vrcx-0-page-scaffold preview-context">${select.html}</div></section></div></body></html>`;

  const report = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>统一字段外框预览</title><style>:root{color-scheme:light;font:16px/1.55 system-ui,sans-serif;color:#171717;background:#fff}*{box-sizing:border-box}body{margin:0;background:#fff}main{width:min(940px,calc(100% - 32px));margin:28px auto}h1{font-size:1.35rem;margin:0 0 8px}p{margin:8px 0;color:#444}.preview{margin-top:18px;border-top:1px solid #ddd;border-bottom:1px solid #ddd;background:#fff}iframe{display:block;width:100%;height:330px;border:0;background:#fff}.note{font-size:.9rem;color:#666}code{font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;background:#f4f4f5;padding:1px 4px}@media(max-width:760px){main{width:calc(100% - 24px);margin:18px auto}iframe{height:600px}}</style></head><body><main><h1>三类输入控件共用同一外框</h1><p>独立输入框、工具栏输入组、下拉选择器现在由 <code>fields-toolbar-r10.css</code> 里同一条规则供框：深紫底 <code>#201936</code>、紫边 <code>#6c5ce0</code>、方角、内凹阴影。原生 <code>select</code> 也走这条。</p><div class="preview"><iframe title="三类输入控件共用外框" sandbox="allow-same-origin" srcdoc="${esc(inner)}"></iframe></div><p class="note">图标不是外框，所以不在这层：工具栏组多出的放大镜、下拉选择器右侧的箭头，都是各自组件内部的内容。结构也不一样——工具栏组是「图标 + <code>input</code> + 独立 <code>button</code>」三个兄弟节点；下拉选择器整条就是一个 <code>button[role=combobox]</code>，右侧箭头只是它内部的 <code>svg</code>，点哪都展开。本页只展示一个方案。</p></main></body></html>`;

  const out = `${base}/baseline/reports/refactor-progress.html`;
  fs.writeFileSync(out, report);
  console.log(JSON.stringify({
    out,
    bytes: Buffer.byteLength(report),
    candidateCssBytes: Buffer.byteLength(css),
    styleTags: styles.length,
    samples: { field: field.tag, group: 'div', select: select.tag + '/' + select.role },
  }, null, 2));
} finally {
  await browser.close();
}
