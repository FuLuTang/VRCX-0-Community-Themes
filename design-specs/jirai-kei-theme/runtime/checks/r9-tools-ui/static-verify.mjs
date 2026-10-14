/* Structural fallback when the local Playwright browser binary is unavailable. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire('/home/fulutang/Documents/Github/VRCX-0-jirai/package.json');
const postcss = require('postcss');
const { JSDOM } = require('jsdom');
const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const [html, css] = await Promise.all([
  fs.readFile(path.join(here, 'fixture.html'), 'utf8'),
  fs.readFile(path.join(runtime, 'tools-ui-r9.css'), 'utf8')
]);
const ast = postcss.parse(css, { from: path.join(runtime, 'tools-ui-r9.css') });
const rules = [];
ast.walkRules((rule) => rules.push(rule));
const dom = new JSDOM(html, { pretendToBeVisual: true });
const doc = dom.window.document;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const root = '.vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]):has(> div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"])';
const search = `${root} > .vrcx-0-page-toolbar [data-vrcx-0-control="toolbar"][data-slot="input-group"]`;
const rail = `${root} > div.relative.mt-4 [data-slot="tabs"][data-orientation="vertical"] > [data-slot="tabs-list"][data-orientation="vertical"]`;
const count = (selector) => doc.querySelectorAll(selector).length;
const selectorAudit = rules.map((rule) => ({ selector: rule.selector, scopedToToolsRoot: rule.selector.startsWith('.vrcx-0-main-content > .vrcx-0-page-scaffold#chart:has(> .vrcx-0-page-toolbar'), declarations: rule.nodes.filter((node) => node.type === 'decl').map((node) => node.prop) }));
const required = { root: count(root), toolbarSearch: count(search), categoryRail: count(rail), settingsRail: count('[data-fixture-settings-rail]'), otherChartRail: count('[data-fixture-other-chart] [data-slot="tabs-list"]'), appNavigation: count('[data-fixture-navigation]') };
assert(rules.length === 13 && selectorAudit.every((item) => item.scopedToToolsRoot), `Every rule must remain scoped to ToolsPageContent: ${JSON.stringify(selectorAudit)}`);
assert(required.root === 1 && required.toolbarSearch === 1 && required.categoryRail === 1, `Source anchors not unique: ${JSON.stringify(required)}`);
assert(required.settingsRail === 1 && required.otherChartRail === 1 && required.appNavigation === 1, `Exclusion fixtures missing: ${JSON.stringify(required)}`);
assert(doc.querySelectorAll(`${root} [data-slot="tabs-list"]`).length === 1, 'Tools rail selector crossed into sibling page');
assert(count(`${root} [data-slot="tabs-tab"]`) === 5, 'Expected five source-shaped Tools category triggers');
assert(!/@import\b|url\(/i.test(css), 'Tools UI CSS must remain self-contained');
const report = {
  result: 'PASS_STATIC',
  note: 'JSDOM + PostCSS structural selector audit; browser layout/screenshot phase is not covered here.',
  rules: rules.length,
  sourceRoot: root,
  selectorAudit,
  matchCounts: required,
  toolsCategoryTabs: count(`${root} [data-slot="tabs-tab"]`),
  settingsAndNavigationExcluded: true,
  newCSSHasNoExternalImports: true
};
await fs.writeFile(path.join(here, 'static-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
