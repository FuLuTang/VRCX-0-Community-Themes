import { chromium } from 'playwright';
import fs from 'node:fs';

const APP = '/home/fulutang/Documents/Github/VRCX-0-jirai/src/styles/globals.css';
const THEME = '/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css';

function block(src, header) {
  const i = src.indexOf(header);
  if (i < 0) return '';
  const j = src.indexOf('\n}', i);
  return src.slice(i, j + 2);
}
const app = fs.readFileSync(APP, 'utf8');
const theme = fs.readFileSync(THEME, 'utf8');

const appRoot = block(app, ':root {');
const appDark = block(app, '.dark {');
const jiraiRoot = block(theme, '/* SECTION tokens */');

// jirai tokens block starts with ":root,\n:root.dark,\n.dark {"
const ji = jiraiRoot.indexOf('{');
const jiraiBody = jiraiRoot.slice(ji + 1, jiraiRoot.lastIndexOf('}'));

const VARS = ['background','foreground','card','popover','primary','primary-foreground',
  'secondary','muted','accent','border','input','ring','sidebar','destructive',
  'surface-raised','stroke-default','content-secondary','status-online','status-busy','status-askme'];

const html = `<!doctype html><meta charset="utf-8"><style>
${appRoot}
${appDark}
</style>
<style id="jirai">
:root, .dark { ${jiraiBody} }
</style>
<div id="app" class="dark"></div>
<div id="theme" class="dark" data-jirai></div>
`;
// apply jirai only to #theme
const html2 = html.replace('<div id="theme" class="dark" data-jirai></div>',
  '<div id="theme" class="dark"></div>');

const browser = await chromium.launch({ executablePath: process.env.CHROME });
const page = await browser.newPage();
await page.setContent(html2);

const read = (sel, styleTagId, vars) => page.evaluate(([sel, id, vars]) => {
  // isolate: enable only one stylesheet
  const st = document.getElementById(id);
  const out = {};
  const probe = document.querySelector(sel);
  for (const v of vars) {
    const d = document.createElement('div');
    d.style.backgroundColor = `var(--${v})`;
    d.style.color = `var(--${v})`;
    d.style.borderColor = `var(--${v})`;
    probe.appendChild(d);
    const cs = getComputedStyle(d);
    out[v] = { bg: cs.backgroundColor, fg: cs.color };
    d.remove();
  }
  const r = document.createElement('div');
  probe.appendChild(r);
  out.__radius = getComputedStyle(probe).getPropertyValue('--radius').trim();
  r.remove();
  return out;
}, [sel, styleTagId, vars]);

// measure app default (jirai style disabled)
await page.evaluate(() => { document.getElementById('jirai').disabled = true; });
const appVals = await read('#app', 'none', VARS);
await page.evaluate(() => { document.getElementById('jirai').disabled = false; });
const themeVals = await read('#theme', 'jirai', VARS);

console.log(JSON.stringify({ appVals, themeVals }, null, 1));
await browser.close();
