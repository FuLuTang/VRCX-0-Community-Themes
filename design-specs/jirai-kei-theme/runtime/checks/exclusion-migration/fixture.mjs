/* Fixture builder for exclusion-migration: every primitive (ALL variants, regardless of use) x every context, plus
 * "extra subjects" that the audit's primitive registry has no entry for (dialog chrome, popup chrome, tooltip,
 * hover card, pagination, tabs-list, alert, separator, floating bars, labels, otp, native radio/color/file/time ...).
 * Contexts come from the audit's CONTEXTS (real ancestor chains of the application DOM).
 * Nothing here writes to the application sources or the production CSS. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {PRIMS, CONTEXTS, CTX_ORDER} from '../element-style-audit/primitives.mjs';
import {scanSources} from '../element-style-audit/scan.mjs';

export const SRC = process.env.AUDIT_SRC || '/tmp/vrcx-win-src-r9/src';
export const APP_DIST = process.env.AUDIT_APP_DIST || '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const DIALOG_CLS = 'bg-popover text-popover-foreground ring-foreground/10 fixed top-[calc(50%+1rem)] left-1/2 z-50 grid max-h-[calc(100vh-4rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-xl p-4 text-sm ring-1 outline-none sm:max-w-sm';
const POPUP_CLS = 'bg-popover/70 text-popover-foreground ring-foreground/10 z-50 flex min-w-32 flex-col rounded-lg p-1 shadow-md ring-1 outline-none';
const AVATARS = ['rounded-md', 'rounded-lg', ''].map((c, i) => `<span data-slot="avatar" data-size="${i === 2 ? 'lg' : 'default'}" class="relative flex size-8 shrink-0 overflow-hidden ${c}"><img data-slot="avatar-image" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><span data-slot="avatar-fallback" class="flex size-full">A</span></span>`).join('');
const POPUP_BODY = (p) => `<div data-slot="${p}-label">Label</div><div data-slot="${p}-item" role="menuitem" class="flex">Item</div><div data-slot="${p}-checkbox-item">Chk</div><div data-slot="${p}-radio-item">Rad</div><div data-slot="${p}-sub-trigger">Sub</div><div data-slot="${p}-item" data-variant="destructive">Del<svg class="size-3"><path d="M0 0"/></svg></div><div data-slot="${p}-item" data-disabled>Dis<span class="text-muted-foreground">x</span></div><div data-slot="${p}-item" aria-disabled="true">Dis2</div><div data-slot="${p}-separator"></div><span data-slot="${p}-shortcut" class="text-muted-foreground">Ctrl</span><button type="button" data-slot="button" data-variant="ghost" class="h-auto justify-start p-0">Row</button>${AVATARS}`;

/** extra subjects: id -> html (wrapped in every context) */
export const EXTRAS = {
  'pagination': `<nav><ul data-slot="pagination-content"><li><a data-slot="pagination-link" data-active="true" aria-current="page" href="#" class="inline-flex size-8">1</a></li><li><a data-slot="pagination-link" href="#" class="inline-flex size-8">2</a></li></ul></nav>`,
  'tabs-embedded': `<div data-slot="tabs" data-orientation="horizontal" class="flex flex-col gap-2"><div data-slot="tabs-list" data-orientation="horizontal" class="text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5 rounded-lg bg-(--state-pressed-surface) p-0.5"><button role="tab" type="button" data-slot="tabs-tab" data-active aria-selected="true" class="flex">A</button><button role="tab" type="button" data-slot="tabs-tab" aria-selected="false" class="flex">B</button><span data-slot="tab-indicator" class="absolute"></span></div></div>`,
  'alert': `<div data-slot="alert" role="alert" class="grid rounded-lg border px-4 py-3"><div data-slot="alert-title">T</div><div data-slot="alert-description">D</div></div><div data-slot="alert" role="alert" class="grid rounded-lg border px-4 py-3 text-destructive"><div data-slot="alert-title">T</div><div data-slot="alert-description">D</div></div>`,
  'separator': `<div data-slot="separator" data-orientation="horizontal" role="separator" class="bg-border h-px w-24 shrink-0"></div><div data-slot="separator" data-orientation="vertical" role="separator" class="bg-border h-6 w-px shrink-0"></div>`,
  'floating-bars': `<div class="bg-popover text-popover-foreground flex items-center rounded-lg border"><span class="text-muted-foreground px-1.5 font-medium whitespace-nowrap tabular-nums">3</span><button type="button" data-slot="button" data-variant="ghost">x</button></div><div class="bg-popover text-popover-foreground flex items-center rounded-lg border"><span class="text-muted-foreground px-2 font-medium whitespace-nowrap tabular-nums">3</span><button type="button" data-slot="button" data-variant="ghost">x</button></div><button type="button" data-slot="button" data-variant="outline" class="bg-popover/95 backdrop-blur">Pop95</button>`,
  'labels-fields': `<label data-slot="label">L</label><label data-slot="field-label">FL</label><p data-slot="field-description">fd</p><p data-slot="field-error">fe</p><span data-slot="kbd-group" class="inline-flex"><kbd data-slot="kbd">K</kbd><kbd data-slot="kbd">B</kbd></span>`,
  'otp-slot': `<div data-slot="input-otp-slot" class="relative flex size-9 border">1</div><div data-slot="input-otp-slot" data-active="true" class="relative flex size-9 border">2</div>`,
  'native-radio': `<input type="radio" name="r" aria-label="r1"><input type="radio" name="r" checked aria-label="r2">`,
  'native-misc': `<input type="color" aria-label="c" value="#ff00ff"><input type="file" aria-label="f"><input type="time" aria-label="t" value="12:00"><select aria-label="s"><option>one</option></select><textarea aria-label="ta"></textarea>`,
  'spinner': `<svg data-slot="spinner" class="size-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg><svg data-slot="spinner" class="size-3.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>`,
  'toolbar-input-group': `<div data-vrcx-0-control="toolbar" data-slot="input-group" role="group" class="flex h-8 items-center border"><div data-slot="input-group-addon" class="flex"><svg class="size-4"></svg></div><input data-slot="input-group-control" class="flex-1" placeholder="search"><button type="button" data-slot="input-group-button" data-variant="default">Go</button></div>`,
  'dialog-chrome': `<div data-slot="dialog-content" class="${DIALOG_CLS}"><div data-slot="dialog-header" class="flex flex-col gap-2"><h2 data-slot="dialog-title">Title</h2><p data-slot="dialog-description">d</p></div><div>body</div><div data-slot="dialog-footer" class="flex gap-2"><button data-slot="button" data-variant="outline">No</button></div><button type="button" data-slot="dialog-close">x</button></div><div data-slot="alert-dialog-content" class="${DIALOG_CLS}"><div data-slot="alert-dialog-header" class="flex flex-col gap-2"><h2 data-slot="alert-dialog-title">T</h2></div><div data-slot="alert-dialog-footer" class="flex gap-2"><button data-slot="button">Ok</button></div></div><div data-slot="dialog-content" class="${DIALOG_CLS} p-0"><div data-slot="dialog-header" class="flex flex-row"><h2 data-slot="dialog-title">Hdr+action</h2><div><button type="button" data-slot="button" data-variant="ghost"><span class="size-2 rounded-full"></span></button></div></div></div>`,
  'popup-menu': `<div data-slot="dropdown-menu-content" class="${POPUP_CLS}">${POPUP_BODY('dropdown-menu')}</div><div data-slot="dropdown-menu-sub-content" class="${POPUP_CLS}">${POPUP_BODY('dropdown-menu')}</div><div data-slot="context-menu-content" class="${POPUP_CLS}">${POPUP_BODY('context-menu')}</div><div data-slot="menu-positioner"></div>`,
  'popup-popover': `<div data-slot="popover-content" class="bg-popover text-popover-foreground z-50 flex w-72 flex-col gap-2.5 rounded-lg p-2.5 ring-1">${POPUP_BODY('popover')}<div data-slot="scroll-area"><button type="button" data-slot="button" data-variant="ghost"><span class="mr-2.5 size-9 rounded-full border">u</span></button></div></div>`,
  'popup-select': `<div data-slot="select-content" class="${POPUP_CLS}">${POPUP_BODY('select')}</div><div data-slot="combobox-content" class="${POPUP_CLS}">${POPUP_BODY('combobox')}</div>`,
  'popup-menubar': `<div data-slot="menubar-content" class="${POPUP_CLS}">${POPUP_BODY('menubar')}</div><div data-slot="menubar-sub-content" class="${POPUP_CLS}">${POPUP_BODY('menubar')}</div>`,
  'overlay-tooltip': `<div data-slot="tooltip-content" class="bg-foreground text-background z-50 rounded-md px-3 py-1.5 text-xs">tip<div class="rotate-45 size-2"></div></div><div data-slot="tooltip-content" class="flex flex-col gap-1 text-xs z-50"><div class="rotate-45 size-2"></div>stack</div><div data-slot="tooltip-content" class="z-50"><div class="flex flex-col gap-1 text-xs">inner</div><div class="rotate-45 size-2"></div></div><div data-slot="hover-card-content" class="bg-popover z-50 w-64 rounded-lg p-2.5 ring-1">hc</div>`
};
/* subject ids that are standalone portal popups: they only get a *root* scene in the real DOM */
export const PORTAL_SUBJECTS = new Set(['dialog-chrome', 'popup-menu', 'popup-popover', 'popup-select', 'popup-menubar', 'overlay-tooltip']);

const SCENE_CSS = `
html,body{margin:0;background:#2a2147}
body{padding:16px;font:12px/1.4 system-ui,sans-serif;color:#f2ebff;width:1100px}
.audit-prim{margin:0 0 24px}.audit-prim>h1{font:600 14px monospace;margin:0 0 6px;color:#ffd9ee}
.audit-scene{margin:4px 0;padding:4px 8px;border-left:3px solid #6c5ce0;position:relative}
.audit-scene>.audit-label{font:10px monospace;color:#d6b8ef;margin-bottom:2px}
.audit-cell{display:inline-block;vertical-align:top;margin:2px 10px 2px 0;min-width:40px}
[data-scene] [data-slot="dialog-content"],[data-scene] [data-slot="alert-dialog-content"],[data-scene] [data-slot="popover-content"],[data-scene] [data-slot="toast-content"],[data-scene] [data-vrcx-0-surface="privacy-lock"],[data-scene] [data-slot="toast"],[data-scene] [data-slot="toast-viewport"]{position:relative!important;inset:auto!important;transform:none!important;translate:none!important;animation:none!important;max-width:none!important;max-height:none!important;overflow:visible!important;opacity:1!important;width:auto!important;margin:0!important;height:auto!important}
[data-scene] .vrcx-0-app-root{height:auto!important;overflow:visible!important}
[data-scene] [data-vrcx-0-surface]:not([data-slot]){overflow:visible!important}
[data-scene] .vrcx-0-page-scaffold{height:auto!important;overflow:visible!important}
`;

/** Representative signatures per primitive (all variants, independent of the use-site scan) */
function sigsFor(p, sites) {
  if (p.id === 'button') return ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'].map(v => `${v}|default`);
  if (p.id === 'badge') return ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'];
  if (p.id === 'native-range') return ['accent-primary w-28', 'accent-primary min-w-16 flex-1'];
  const seen = new Map();
  for (const s of sites) { const sig = p.signature(s); seen.set(sig, (seen.get(sig) || 0) + 1); }
  const top = [...seen.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
  return top.length ? top : [p.signature(null)];
}
export async function buildFixture({appCssFiles = null} = {}) {
  const scan = await scanSources(SRC);
  const sitesByPrim = Object.fromEntries(PRIMS.map(p => [p.id, scan.sites.filter(s => s.prim === p.id)]));
  const cells = [];
  const blocks = [];
  const wrapCtx = (ctxId, inner) => CONTEXTS[ctxId].wrap(inner);
  for (const p of PRIMS) {
    const all = sitesByPrim[p.id];
    const sigs = sigsFor(p, all);
    const rows = [];
    for (const ctxId of CTX_ORDER) {
      const inCtx = all.filter(s => s.ctx === ctxId);
      let n = 0, cellHtml = '';
      for (const sig of sigs) {
        const sample = all.find(s => p.signature(s) === sig) || all[0] || null;
        const usedSites = inCtx.filter(s => p.signature(s) === sig);
        for (const v of p.variants(sample, sig)) {
          const aid = `${p.id}__${ctxId}__${n++}${v.tag ? '~' + v.tag : ''}`;
          cells.push({aid, kind: 'prim', prim: p.id, ctx: ctxId, sig, tag: v.tag || '', used: usedSites.length > 0, sites: usedSites.map(s => `${s.file}:${s.line}`)});
          cellHtml += `<div class="audit-cell" data-cell="${esc(aid)}">${v.html}</div>`;
        }
      }
      rows.push(`<section class="audit-scene" data-prim="${p.id}" data-ctx="${ctxId}"><div data-scene="${ctxId}">${wrapCtx(ctxId, cellHtml)}</div></section>`);
    }
    blocks.push(`<div class="audit-prim" data-prim-block="${p.id}"><h1>${p.id}</h1>${rows.join('')}</div>`);
  }
  for (const [xid, html] of Object.entries(EXTRAS)) {
    const rows = [];
    for (const ctxId of CTX_ORDER) {
      const aid = `x:${xid}__${ctxId}`;
      cells.push({aid, kind: 'extra', prim: 'x:' + xid, ctx: ctxId, sig: xid, tag: '', used: false, sites: []});
      rows.push(`<section class="audit-scene" data-prim="x:${xid}" data-ctx="${ctxId}"><div data-scene="${ctxId}">${wrapCtx(ctxId, `<div class="audit-cell" data-cell="${esc(aid)}">${html}</div>`)}</div></section>`);
    }
    // standalone root scenes: the portal-hosted subjects exactly as they sit in the real DOM (body-level)
    if (PORTAL_SUBJECTS.has(xid)) {
      for (const [rid, extraCls] of [['root', ''], ['root-entity', 'entity-dialog']]) {
        if (rid === 'root-entity' && xid !== 'dialog-chrome') continue;
        const aid = `x:${xid}__${rid}`;
        const h = rid === 'root-entity' ? html.replace(/(data-slot="dialog-content" class=")/g, `$1entity-dialog `) : html;
        cells.push({aid, kind: 'extra', prim: 'x:' + xid, ctx: rid === 'root' ? 'portal-root' : 'portal-root-entity', sig: xid, tag: '', used: true, sites: []});
        rows.push(`<section class="audit-scene" data-prim="x:${xid}" data-ctx="${rid}"><div data-scene="${rid === 'root' ? 'portal-root' : 'portal-root-entity'}"><div class="audit-cell" data-cell="${esc(aid)}">${h}</div></div></section>`);
      }
    }
    blocks.push(`<div class="audit-prim" data-prim-block="x:${xid}"><h1>x:${xid}</h1>${rows.join('')}</div>`);
  }
  return {blocks: blocks.join(''), cells, scan, sitesByPrim, sceneCss: SCENE_CSS,
    statusbar: '<footer class="vrcx-0-statusbar"><button type="button" data-slot="tooltip-trigger" data-popup-open></button></footer>'};
}
export function splitSections(themeText) {
  const parts = themeText.split(/(?=\/\* SECTION [^*]+\*\/)/);
  return parts.map(p => { const m = p.match(/^\/\* SECTION ([^*]+?) \*\//); return {name: m ? m[1].trim() : 'preamble', css: p}; });
}
export async function loadAppCss() {
  const files = (await fs.readdir(APP_DIST)).filter(f => /^(index|App)-.*\.css$/.test(f)).sort((a, b) => a.startsWith('index') ? -1 : 1);
  const out = [];
  for (const f of files) out.push({name: f, css: await fs.readFile(path.join(APP_DIST, f), 'utf8')});
  return out;
}
export function buildPage({fixture, sections, appCss, withTheme = true}) {
  const styles = appCss.map(a => `<style data-section="app:${a.name}">${a.css}</style>`).join('')
    + (withTheme ? sections.map(s => `<style data-section="${esc(s.name)}" data-theme="1">${s.css}</style>`).join('') : '')
    + `<style data-audit>${fixture.sceneCss}</style>`;
  return `<!doctype html><html lang="en" class="dark"><head><meta charset="utf-8"><title>exclusion-migration fixture</title>${styles}</head><body>${fixture.statusbar}${fixture.blocks}</body></html>`;
}
export {PRIMS, CONTEXTS, CTX_ORDER};
