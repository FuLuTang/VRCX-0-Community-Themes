/* Primitive registry + context (ancestor-chain) registry for audit.mjs.
 * Class strings are read from the real shadcn sources at run time (not copied), so the fixture follows source edits.
 * className passed by call sites is NOT tailwind-merged (documented limit); theme rules key on data-slot/ancestors. */
import fsSync from 'node:fs';
import path from 'node:path';

const SRC = process.env.AUDIT_SRC || '/tmp/vrcx-win-src-r9/src';
const read = f => fsSync.readFileSync(path.join(SRC, f), 'utf8');

// ---------- tiny source readers ----------
function readStr(t, i) { const q = t[i]; let j = i + 1, s = ''; while (j < t.length && t[j] !== q) { if (t[j] === '\\') { s += t[j + 1]; j += 2; continue; } s += t[j++]; } return {v: s, end: j + 1}; }
/** strings that are direct arguments of the first `cn(` / `cva(` after `anchor` (depth 1 only) */
function callStrings(text, from, fn) {
  let i = text.indexOf(fn + '(', from); if (i < 0) return [];
  i += fn.length; let d = 0; const out = [];
  for (let j = i; j < text.length; j++) {
    const c = text[j];
    if (c === '"' || c === "'" || c === '`') { const r = readStr(text, j); if (d === 1) out.push(r.v); j = r.end - 1; continue; }
    if (c === '(' || c === '{' || c === '[') d++;
    else if (c === ')' || c === '}' || c === ']') { d--; if (d === 0) break; }
  }
  return out;
}
/** class string following `anchor`: either className="..." or className={cn('..', ..)} */
function classAfter(file, anchor, nth = 0) {
  const t = read(file); let idx = -1;
  for (let k = 0; k <= nth; k++) idx = t.indexOf(anchor, idx + 1);
  if (idx < 0) throw new Error(`anchor not found: ${file} ${anchor}`);
  const m = /className=/.exec(t.slice(idx)); const at = idx + m.index + 10;
  if (t[at] === '"' || t[at] === "'") return readStr(t, at).v;
  return callStrings(t, at, 'cn').join(' ');
}
/** cva(base, {variants:{ variant:{a:'..'}, size:{..} }}) */
function parseCva(file, varName) {
  const t = read(file); const start = t.indexOf(`const ${varName} = cva(`) >= 0 ? t.indexOf(`const ${varName} = cva(`) : t.indexOf(`${varName} = cva(`);
  if (start < 0) throw new Error(`cva not found ${file} ${varName}`);
  const i = t.indexOf('cva(', start) + 3;
  let j = i + 1; while (/\s/.test(t[j])) j++;
  const base = readStr(t, j).v;
  const vi = t.indexOf('variants:', j); const groups = {};
  let k = t.indexOf('{', vi); let depth = 0; let group = null;
  for (; k < t.length; k++) {
    const c = t[k];
    if (c === '{') { depth++; if (depth === 2) { const before = t.slice(0, k).match(/([\w'"-]+)\s*:\s*$/); group = before[1].replace(/['"]/g, ''); groups[group] = {}; } continue; }
    if (c === '}') { depth--; if (depth === 0) break; if (depth === 1) group = null; continue; }
    if (depth === 2 && group) {
      const m = /^\s*(['"]?[\w-]+['"]?)\s*:\s*/.exec(t.slice(k, k + 80));
      if (m && (k === 0 || /[{,\s]/.test(t[k - 1])) && /[\w'"]/.test(c)) {
        let s = k + m[0].length; if (t[s] !== '"' && t[s] !== "'" && t[s] !== '`') continue;
        const r = readStr(t, s); groups[group][m[1].replace(/['"]/g, '')] = r.v; k = r.end - 1;
      }
    }
  }
  return {base, groups};
}
const norm = s => String(s ?? '').replace(/\s*⟨dynamic⟩/g, '').replace(/\s+/g, ' ').trim();
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const SHAPE = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius', 'clipPath', 'boxShadow', 'borderTopStyle', 'backgroundImage', 'textShadow', 'filter', 'imageRendering', 'appearance'];
const PSHAPE = ['borderTopLeftRadius', 'clipPath', 'boxShadow', 'backgroundImage', 'content', 'width', 'height'];
const siteClass = s => s?.props?.className ? norm(s.props.className) : '';
const dyn = s => s?.props?.className && /^⟨/.test(s.props.className) ? '' : siteClass(s);

// ---------- contexts ----------
const chain = (defs, inner) => defs.reduceRight((acc, [tag, attrs]) => `<${tag} ${attrs}>${acc}</${tag}>`, inner);
const APP = ['div', 'data-vrcx-0-surface="app-root" class="vrcx-0-app-root flex min-h-0 w-full flex-col overflow-hidden h-screen"'];
const SHELL = ['div', 'data-vrcx-0-surface="main-shell" class="vrcx-0-main-shell flex h-full min-h-0 min-w-0 flex-col overflow-hidden"'];
const WORK = ['div', 'data-vrcx-0-surface="workspace" class="vrcx-0-workspace flex min-h-0 min-w-0 flex-1 overflow-hidden"'];
const MAIN = ['div', 'data-vrcx-0-surface="main-content" class="vrcx-0-main-content flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"'];
const SCAF = ['div', 'class="vrcx-0-page-scaffold flex h-full min-h-0 min-w-0 flex-col overflow-hidden x-container x-container--auto-height p-4"'];
const DIALOG_CLS = 'bg-popover text-popover-foreground ring-foreground/10 fixed top-[calc(50%+1rem)] left-1/2 z-50 grid max-h-[calc(100vh-4rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-xl p-4 text-sm ring-1 outline-none sm:max-w-sm';
export const CONTEXTS = {
  'main-content': {sel: '.vrcx-0-main-content', wrap: i => chain([APP, SHELL, WORK, MAIN, SCAF], i)},
  'main-toolbar': {sel: '.vrcx-0-page-toolbar', wrap: i => chain([APP, SHELL, WORK, MAIN, SCAF, ['div', 'class="vrcx-0-page-toolbar flex shrink-0 flex-col gap-2"']], i)},
  'graph-floating-controls': {sel: '.vrcx-0-page-scaffold#chart [class~="bg-popover/70"]:not([data-slot])', wrap: i => chain([APP, SHELL, WORK, MAIN, ['div', 'id="chart" class="vrcx-0-page-scaffold flex h-full min-h-0 min-w-0 flex-col overflow-hidden x-container x-container--auto-height p-4"'], ['div', 'class="bg-popover/70 ring-foreground/10 relative rounded-lg shadow-md ring-1 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 flex items-center gap-2 p-1.5"']], i)},
  'main-card-sm': {sel: 'article[data-slot=card][data-size=sm]', wrap: i => chain([APP, SHELL, WORK, MAIN, SCAF, ['article', 'data-slot="card" data-size="sm" class="bg-card text-card-foreground flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm ring-1 ring-foreground/10"']], i)},
  'side-panel': {sel: '.vrcx-0-side-panel', wrap: i => chain([APP, SHELL, WORK, ['aside', 'data-vrcx-0-surface="side-panel" class="vrcx-0-side-panel flex min-h-0 w-80 shrink-0 flex-col overflow-hidden"'], ['div', 'data-slot="tabs" data-orientation="vertical" class="flex min-h-0 min-w-0 flex-1 gap-0 overflow-hidden"'], ['div', 'class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-2 pl-2"']], i)},
  // real DOM: scaffold > Tabs root(div[data-slot=tabs]) > [TabsList.w-44, panel]; the theme exclusion uses `scaffold:has(> tabs-list.w-44)`
  'settings-vertical-tabs': {sel: '.vrcx-0-page-scaffold:has(> [data-slot=tabs-list].w-44)', wrap: i => chain([APP, SHELL, WORK, MAIN, SCAF], `<div data-slot="page-header" class="flex shrink-0 flex-col gap-1"><h1>Settings</h1></div><div data-slot="tabs" data-orientation="vertical" class="flex min-h-0 flex-1 gap-4"><div data-slot="tabs-list" data-orientation="vertical" class="text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5 data-[orientation=vertical]:flex-col h-fit w-44 shrink-0 gap-0.5 self-start"></div><div class="flex min-h-0 min-w-0 flex-1 flex-col">${i}</div></div>`)},
  'entity-dialog': {sel: '[data-slot=dialog-content].entity-dialog', wrap: i => `<div data-slot="dialog-content" class="${DIALOG_CLS} entity-dialog bg-(--entity-dialog-ground) sm:w-[min(96vw,72rem)] sm:!max-w-[min(96vw,72rem)]"><div class="flex min-w-0 flex-col gap-2.5">${i}</div></div>`},
  'dialog': {sel: '[data-slot=dialog-content]:not(.entity-dialog)', wrap: i => `<div data-slot="dialog-content" class="${DIALOG_CLS}"><div class="grid gap-3">${i}</div></div>`},
  'popover': {sel: '[data-slot=popover-content]', wrap: i => `<div class="isolate z-50"><div data-slot="popover-content" class="bg-popover text-popover-foreground ring-foreground/10 z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg p-2.5 text-sm shadow-md ring-1 outline-hidden duration-100">${i}</div></div>`},
  'menu-popup': {sel: '[class~="bg-popover/70"]', wrap: i => `<div class="isolate z-50"><div data-slot="dropdown-menu-content" class="bg-popover/70 text-popover-foreground ring-foreground/10 z-50 flex min-w-32 flex-col rounded-lg p-1 shadow-md ring-1 outline-none">${i}</div></div>`},
  'login-page': {sel: '[data-vrcx-0-surface=login-page]', wrap: i => chain([APP, ['div', 'data-vrcx-0-surface="login-page" class="vrcx-0-main-shell relative flex min-h-full w-full flex-col overflow-y-auto p-6"'], ['div', 'class="flex flex-1 items-center justify-center"'], ['div', 'class="flex w-full max-w-lg flex-col gap-4"']], i)},
  'privacy-lock': {sel: '[data-vrcx-0-surface=privacy-lock]', wrap: i => `<div data-vrcx-0-surface="privacy-lock" role="dialog" class="flex items-center justify-center overflow-y-auto p-6 outline-none"><div class="flex flex-col gap-3">${i}</div></div>`},
  'toast': {sel: '[data-slot=toast-content]', wrap: i => `<div data-slot="toast-viewport"><div data-slot="toast" class="bg-popover text-popover-foreground"><div data-slot="toast-content" class="pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden px-3.5 py-3 text-sm">${i}</div></div></div>`},
  'app-chrome': {sel: '[data-app-titlebar], [data-vrcx-0-surface=statusbar]', wrap: i => `<div data-vrcx-0-surface="app-root" class="vrcx-0-app-root flex min-h-0 w-full flex-col"><header data-app-titlebar="true" data-vrcx-0-surface="titlebar" class="vrcx-0-titlebar flex h-9 shrink-0 items-center">${i}</header><footer data-vrcx-0-surface="statusbar" class="vrcx-0-statusbar flex items-center"><button type="button" data-slot="button" data-variant="ghost" data-size="icon" aria-expanded="true" class="statusbar-source-site-probe">Statusbar trigger</button></footer></div>`}
};
export const CTX_ORDER = Object.keys(CONTEXTS);

// ---------- helpers for part configs ----------
const HOST = (extra = {}) => ({name: 'host', shape: SHAPE, pseudoShape: PSHAPE, pseudos: [], emu: [], focus: true, ...extra});
const NATIVE_PRIMARY = '(radius|clip-?path|appearance|slider|progress|::)';
const KNOWN_V = new Set(['default', 'outline', 'secondary', 'ghost', 'destructive', 'link']);
const variantOf = v => { if (!v) return 'default'; const t = String(v).replace(/⟨.*?⟩/g, '').split(/\s+/).find(x => KNOWN_V.has(x)); return t || 'default'; };
const KNOWN_Z = new Set(['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg']);
const sizeOf = v => { if (!v) return 'default'; const t = String(v).replace(/⟨.*?⟩/g, '').split(/\s+/).find(x => KNOWN_Z.has(x)); return t || 'default'; };

export const PRIMS = [];

// ===== native range =====
PRIMS.push({
  id: 'native-range', hint: 'range|slider', canonical: 'main-content', shotScale: 2,
  signature: s => norm(s?.props?.className) || 'accent-primary w-28',
  variants: (s, sig) => [{html: `<input data-apart="host" type="range" min="0" max="100" step="1" value="35" aria-label="range" class="${esc(sig.replace(/⟨.*?⟩/g, ''))}">`,
    parts: [HOST({primary: NATIVE_PRIMARY, emu: ['-webkit-slider-thumb', '-webkit-slider-runnable-track']})]}],
  fixHint: () => 'user-dialog-r8.css 的滑条选择器不得带 .accent-primary/.min-w-16/.flex-1 等工具类；entity-dialog 内所有 input[type=range] 以 `[data-slot="dialog-content"].entity-dialog input[type="range"]` 统一接管。'
});

// ===== Base UI slider =====
PRIMS.push({
  id: 'base-slider', hint: 'slider', canonical: 'main-content', shotScale: 2,
  signature: s => norm(s?.props?.className) || '(default)',
  variants: (s) => {
    const root = classAfter('ui/shadcn/slider.tsx', '<SliderPrimitive.Root'), ctrl = classAfter('ui/shadcn/slider.tsx', '<SliderPrimitive.Control'),
      track = classAfter('ui/shadcn/slider.tsx', 'data-slot="slider-track"'), range = classAfter('ui/shadcn/slider.tsx', 'data-slot="slider-range"'), thumb = classAfter('ui/shadcn/slider.tsx', 'data-slot="slider-thumb"');
    return [{html: `<div data-apart="root" data-slot="slider" data-orientation="horizontal" data-horizontal class="${esc(root)} ${esc(dyn(s))}" style="width:180px"><div class="${esc(ctrl)}" data-orientation="horizontal" data-horizontal><div data-apart="track" data-slot="slider-track" data-orientation="horizontal" data-horizontal class="${esc(track)}"><div data-apart="range" data-slot="slider-range" data-horizontal class="${esc(range)}" style="width:40%"></div></div><div data-apart="thumb" data-slot="slider-thumb" data-horizontal class="${esc(thumb)}" style="position:absolute;left:40%"><input type="range" style="position:absolute;opacity:0;width:1px;height:1px;margin:-1px;clip:rect(0 0 0 0)" aria-label="s"></div></div></div>`,
      parts: [{name: 'track', shape: SHAPE.concat(['height']), pseudoShape: PSHAPE}, {name: 'range', shape: SHAPE}, {name: 'thumb', shape: SHAPE.concat(['width', 'height']), pseudoShape: PSHAPE}]}];
  },
  fixHint: ctx => `form-controls-r9.css 的 [data-slot=slider*] 规则对 ${ctx} 被排除；在 ${ctx} 加同形规则（或按 user-dialog-r8 的做法对 ${CONTEXTS[ctx]?.sel} 单独接管）。`
});

// ===== native checkbox =====
PRIMS.push({
  id: 'native-checkbox', hint: 'checkbox', canonical: 'main-content',
  signature: s => norm(s?.props?.className) || '(bare)',
  variants: (s, sig) => ['unchecked', 'checked'].map(st => ({tag: st, html: `<input data-apart="host" type="checkbox" ${st === 'checked' ? 'checked' : ''} aria-label="c" class="${esc(sig === '(bare)' ? '' : sig.replace(/⟨.*?⟩/g, ''))}">`,
    parts: [HOST({primary: NATIVE_PRIMARY, pseudos: st === 'checked' ? ['::after'] : [], shape: SHAPE.concat(['width', 'height'])})]}))
});

// ===== Base UI checkbox =====
PRIMS.push({
  id: 'base-checkbox', hint: 'checkbox', canonical: 'main-content',
  signature: s => 'shared',
  variants: () => {
    const cls = classAfter('ui/shadcn/checkbox.tsx', 'data-slot="checkbox"'), ind = classAfter('ui/shadcn/checkbox.tsx', 'data-slot="checkbox-indicator"');
    const svg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>';
    return [false, true].map(on => ({tag: on ? 'checked' : 'unchecked', html: `<button data-apart="host" type="button" role="checkbox" aria-checked="${on}" data-slot="checkbox" ${on ? 'data-checked' : 'data-unchecked'} class="${esc(cls)}">${on ? `<span data-apart="indicator" data-slot="checkbox-indicator" data-checked class="${esc(ind)}">${svg}</span>` : ''}</button>`,
      parts: [HOST({pseudos: ['::after'], shape: SHAPE.concat(['width', 'height'])}), ...(on ? [{name: 'indicator', shape: ['display'], gate: false}] : [])]}));
  }
});

// ===== switch =====
PRIMS.push({
  id: 'switch', hint: 'switch', canonical: 'main-content',
  signature: () => 'shared',
  variants: () => {
    const root = classAfter('ui/shadcn/switch.tsx', 'data-slot="switch"'), thumb = classAfter('ui/shadcn/switch.tsx', 'data-slot="switch-thumb"');
    return [false, true].map(on => ({tag: on ? 'checked' : 'unchecked', html: `<button data-apart="host" type="button" role="switch" aria-checked="${on}" data-slot="switch" data-size="default" ${on ? 'data-checked' : 'data-unchecked'} class="${esc(root)}"><span data-apart="thumb" data-slot="switch-thumb" ${on ? 'data-checked' : 'data-unchecked'} class="${esc(thumb)}"></span></button>`,
      parts: [HOST({shape: SHAPE.concat(['width', 'height'])}), {name: 'thumb', shape: SHAPE.concat(['width', 'height'])}]}));
  }
});

// ===== radio =====
PRIMS.push({
  id: 'radio', hint: 'radio', canonical: 'dialog',
  signature: () => 'shared',
  variants: () => [false, true].map(on => ({tag: on ? 'checked' : 'unchecked', html: `<button data-apart="host" type="button" role="radio" aria-checked="${on}" ${on ? 'data-checked' : 'data-unchecked'} class="border-input data-checked:border-primary data-checked:bg-primary focus-visible:ring-ring mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:ring-offset-2"><span data-apart="indicator" ${on ? 'data-checked' : ''} class="bg-primary-foreground size-1.5 rounded-full"></span></button>`,
    parts: [HOST({shape: SHAPE.concat(['width', 'height'])}), {name: 'indicator', shape: SHAPE, gate: false}]}))
});

// ===== input / textarea =====
PRIMS.push({
  id: 'input-textarea', hint: '\\binput\\b|textarea|input-group|data-slot="input"',  canonical: 'main-content',
  signature: s => s ? `${s.tag}${/^(input|textarea)$/.test(s.tag) ? '|' + (norm(s.props.className) || '(bare)') : ''}` : 'Input',
  variants: (s, sig) => {
    const tag = s?.tag || 'Input';
    const inputCls = classAfter('ui/shadcn/input.tsx', 'data-slot="input"'), taCls = classAfter('ui/shadcn/textarea.tsx', 'data-slot="textarea"');
    const group = classAfter('ui/shadcn/input-group.tsx', 'data-slot="input-group"'), ctl = classAfter('ui/shadcn/input-group.tsx', 'data-slot="input-group-control"');
    let html;
    if (tag === 'Textarea') html = `<textarea data-apart="host" data-slot="textarea" class="${esc(taCls)}" placeholder="textarea"></textarea>`;
    else if (tag === 'textarea') html = `<textarea data-apart="host" class="${esc(norm(s.props.className).replace(/⟨.*?⟩/g, ''))}"></textarea>`;
    else if (tag === 'input') html = `<input data-apart="host" type="text" class="${esc(norm(s.props.className).replace(/⟨.*?⟩/g, ''))}" placeholder="input">`;
    else if (tag === 'InputGroupInput' || tag === 'InputGroupTextarea') html = `<div data-slot="input-group" role="group" class="${esc(group)}"><input data-apart="host" data-slot="input-group-control" class="${esc(ctl)}" placeholder="group"></div>`;
    else html = `<input data-apart="host" data-slot="input" type="text" class="${esc(inputCls)}" placeholder="input">`;
    return [{html, parts: [HOST({shape: SHAPE.concat(['height']), pseudos: ['::placeholder']})]}];
  }
});

// ===== select / combobox trigger =====
PRIMS.push({
  id: 'select-trigger', hint: 'select|combobox', canonical: 'main-content',
  signature: s => s ? s.tag : 'SelectTrigger',
  variants: (s) => {
    const tag = s?.tag || 'SelectTrigger';
    const sel = classAfter('ui/shadcn/select.tsx', 'data-slot="select-trigger"');
    const chev = '<svg class="text-muted-foreground pointer-events-none size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';
    if (tag === 'select') return [{html: `<select data-apart="host" class="${esc(norm(s.props.className).replace(/⟨.*?⟩/g, ''))}"><option>one</option></select>`, parts: [HOST({primary: NATIVE_PRIMARY})]}];
    if (tag === 'SelectTrigger') return [{html: `<button data-apart="host" type="button" role="combobox" aria-expanded="false" data-slot="select-trigger" data-size="default" class="${esc(sel)}"><span data-slot="select-value" class="flex flex-1 text-left">Value</span>${chev}</button>`, parts: [HOST({shape: SHAPE.concat(['height'])})]}];
    const group = classAfter('ui/shadcn/input-group.tsx', 'data-slot="input-group"'), ctl = classAfter('ui/shadcn/input-group.tsx', 'data-slot="input-group-control"');
    return [{html: `<div data-slot="input-group" role="group" class="${esc(group)} w-auto"><input data-slot="input-group-control" class="${esc(ctl)}" placeholder="combobox"><div data-slot="input-group-addon" class="flex items-center"><button data-apart="host" type="button" data-slot="combobox-trigger" class="[&_svg:not([class*='size-'])]:size-4">${chev}</button></div></div>`, parts: [HOST({shape: SHAPE.concat(['height'])})]}];
  }
});

// ===== button variants =====
const BTN = (() => { try { return parseCva('ui/shadcn/button.tsx', 'buttonVariants'); } catch (e) { return null; } })();
PRIMS.push({
  id: 'button', hint: 'button', canonical: 'main-content',
  signature: s => `${variantOf(s?.props?.variant)}|${sizeOf(s?.props?.size)}`,
  variants: (s, sig) => {
    const [v, z] = sig.split('|');
    const cls = [BTN.base, BTN.groups.variant[v] || BTN.groups.variant.default, BTN.groups.size[z] || BTN.groups.size.default].join(' ');
    return [{html: `<button data-apart="host" type="button" data-slot="button" data-variant="${v}" data-size="${z}" class="${esc(cls)}">${/^icon/.test(z) ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>' : 'Button'}</button>`, parts: [HOST({shape: SHAPE.concat(['textTransform'])})]}];
  }
});

// ===== badge =====
const BDG = (() => { try { return parseCva('ui/shadcn/badge.tsx', 'badgeVariants'); } catch (e) { return null; } })();
PRIMS.push({
  id: 'badge', hint: 'badge', canonical: 'main-content',
  signature: s => variantOf(s?.props?.variant),
  variants: (s, sig) => [{html: `<span data-apart="host" data-slot="badge" data-variant="${sig}" class="${esc(BDG.base + ' ' + (BDG.groups.variant[sig] || ''))}">Badge</span>`, parts: [HOST({focus: false})]}]
});

// ===== tabs trigger =====
PRIMS.push({
  id: 'tabs-trigger', hint: 'tabs', canonical: 'main-content',
  signature: () => 'shared',
  variants: () => {
    const t = read('ui/shadcn/tabs.tsx');
    const list = 'text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5 text-muted-foreground/72 rounded-lg bg-(--state-pressed-surface) p-0.5';
    const tab = callStrings(t, t.indexOf('<TabsPrimitive.Tab'), 'cn').join(' ');
    return [true, false].map(act => ({tag: act ? 'active' : 'inactive', html: `<div data-slot="tabs" data-orientation="horizontal" class="flex flex-col gap-2"><div data-slot="tabs-list" data-orientation="horizontal" data-size="default" class="${list}"><button data-apart="host" role="tab" type="button" aria-selected="${act}" data-slot="tabs-tab" data-size="default" data-orientation="horizontal" ${act ? 'data-active' : ''} class="${esc(tab)}">Tab</button></div></div>`,
      parts: [HOST()]}));
  }
});

// ===== toggle group item =====
const TGL = (() => { try { return parseCva('ui/shadcn/toggle.tsx', 'toggleVariants'); } catch (e) { return null; } })();
PRIMS.push({
  id: 'toggle-group-item', hint: 'toggle', canonical: 'main-content',
  signature: s => (['outline', 'default'].includes(variantOf(s?.props?.variant)) ? variantOf(s?.props?.variant) : 'default'),
  variants: (s, sig) => [true, false].map(on => ({tag: on ? 'pressed' : 'unpressed', html: `<div data-slot="toggle-group" data-variant="${sig}" class="flex w-fit gap-0.5"><button data-apart="host" type="button" data-slot="toggle" aria-pressed="${on}" ${on ? 'data-pressed' : ''} data-variant="${sig}" data-size="default" class="${esc(TGL.base + ' ' + (TGL.groups.variant[sig] || TGL.groups.variant.default) + ' ' + TGL.groups.size.default)}">Tgl</button></div>`, parts: [HOST()]}))
});

// ===== progress =====
PRIMS.push({
  id: 'progress', hint: 'progress', canonical: 'main-content',
  signature: s => s?.tag || 'Progress',
  variants: (s) => {
    if (s?.tag === 'progress') return [{html: '<progress data-apart="host" max="100" value="40"></progress>', parts: [HOST({primary: NATIVE_PRIMARY, emu: ['-webkit-progress-bar', '-webkit-progress-value']})]}];
    const tr = classAfter('ui/shadcn/progress.tsx', 'data-slot="progress-track"'), ind = classAfter('ui/shadcn/progress.tsx', 'data-slot="progress-indicator"');
    return [{html: `<div data-slot="progress" role="progressbar" aria-valuenow="40" class="flex flex-wrap gap-3" style="width:180px"><div data-apart="track" data-slot="progress-track" class="${esc(tr)}"><div data-apart="indicator" data-slot="progress-indicator" class="${esc(ind)}" style="width:40%"></div></div></div>`,
      parts: [{name: 'track', shape: SHAPE.concat(['height'])}, {name: 'indicator', shape: SHAPE}]}];
  }
});

// ===== kbd =====
PRIMS.push({
  id: 'kbd', hint: 'kbd', canonical: 'main-content',
  signature: () => 'shared',
  variants: () => [{html: `<kbd data-apart="host" data-slot="kbd" class="${esc(classAfter('ui/shadcn/kbd.tsx', 'data-slot="kbd"'))}">Ctrl</kbd>`, parts: [HOST({focus: false})]}]
});
