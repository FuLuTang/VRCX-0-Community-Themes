/* Static scan of the application source: find every use of a style-relevant primitive and infer the DOM context
 * it renders in.  Heuristic by design (no TS type info, no runtime tree) — the verdict is only as good as these
 * rules, so every site carries `ctxWhy` and the README documents the limits. */
import fs from 'node:fs/promises';
import path from 'node:path';

async function* walk(dir) {
  for (const e of await fs.readdir(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (/^(node_modules|__tests__|__mocks__|test|tests)$/.test(e.name)) continue; yield* walk(p); }
    else if (/\.(tsx|jsx)$/.test(e.name) && !/\.(test|spec|stories)\./.test(e.name)) yield p;
  }
}

// JSX tag -> primitive (shadcn tags must be imported from a `shadcn` module unless the file lives in ui/shadcn)
const SHADCN_TAGS = {
  Slider: 'base-slider', Checkbox: 'base-checkbox', Switch: 'switch',
  Input: 'input-textarea', Textarea: 'input-textarea', InputGroupInput: 'input-textarea', InputGroupTextarea: 'input-textarea',
  SelectTrigger: 'select-trigger', ComboboxTrigger: 'select-trigger', ComboboxInput: 'select-trigger',
  Button: 'button', Badge: 'badge', TabsTrigger: 'tabs-trigger', TabsTab: 'tabs-trigger',
  ToggleGroupItem: 'toggle-group-item', Toggle: 'toggle-group-item', Progress: 'progress', Kbd: 'kbd'
};
const NATIVE_TAGS = new Set(['input', 'textarea', 'select', 'progress']);
const RADIO_TAGS = /^(Radio\.Root|RadioGroup\.Item|RadioGroupItem|Radio)$/;
const CTX_TAGS = ['DialogContent', 'AlertDialogContent', 'SheetContent', 'PopoverContent', 'DropdownMenuContent', 'DropdownMenuSubContent', 'SelectContent', 'ComboboxContent', 'ContextMenuContent', 'ContextMenuSubContent', 'HoverCardContent', 'TooltipContent', 'MenubarContent', 'PageToolbar', 'Card', 'CommandDialog', 'ToastContent'];
const POPOVER_TAGS = new Set(['PopoverContent', 'HoverCardContent', 'TooltipContent']);
// Select/Combobox/DropdownMenu/ContextMenu/Menubar popups carry `bg-popover/70` (a theme exclusion key) -> separate context
const MENU_TAGS = new Set(['DropdownMenuContent', 'DropdownMenuSubContent', 'SelectContent', 'ComboboxContent', 'ContextMenuContent', 'ContextMenuSubContent', 'MenubarContent']);
const DIALOG_TAGS = new Set(['DialogContent', 'AlertDialogContent', 'SheetContent', 'CommandDialog']);

const lineOf = (text, idx) => { let n = 1; for (let i = 0; i < idx; i++) if (text.charCodeAt(i) === 10) n++; return n; };
function readString(text, i) {
  const q = text[i]; let j = i + 1, s = '';
  while (j < text.length && text[j] !== q) { if (text[j] === '\\') { s += text[j + 1]; j += 2; continue; } s += text[j++]; }
  return {value: s, end: j + 1};
}
// returns end index (exclusive) of the opening tag starting at `<` and whether it self-closes
function openingTagEnd(text, i) {
  let depth = 0, q = null;
  for (let j = i + 1; j < text.length; j++) {
    const c = text[j];
    if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === '>' && depth === 0) return {end: j + 1, self: text[j - 1] === '/'};
  }
  return {end: text.length, self: false};
}
function attr(tagText, name) {
  const m = new RegExp(`(?:^|\\s)${name}=`).exec(tagText);
  if (!m) return null;
  let i = m.index + m[0].length;
  if (tagText[i] === '"' || tagText[i] === "'") return readString(tagText, i).value;
  if (tagText[i] === '{') {
    // {"literal"} | {cn('..','..')} | {`..`} | {expr}
    let d = 0, j = i, q = null; const strings = [];
    for (; j < tagText.length; j++) {
      const c = tagText[j];
      if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
      if (c === '"' || c === "'" || c === '`') { const r = readString(tagText, j); strings.push(r.value); j = r.end - 1; continue; }
      if (c === '{') d++; if (c === '}') { d--; if (d === 0) break; }
    }
    const expr = tagText.slice(i + 1, j);
    return strings.length ? strings.join(' ') + (/[?&]|cn\(|\$\{/.test(expr) ? ' ⟨dynamic⟩' : '') : `⟨${expr.trim().slice(0, 40)}⟩`;
  }
  return null;
}

function fileDefault(rel) {
  if (/features\/charts\/components\/mutual-friends\/MutualFriendsHud\.tsx$/.test(rel)) return ['graph-floating-controls', 'inside MutualFriendsHud MutualFriendsSurface (bg-popover/70 floating controls)'];
  if (/^features\/auth\//.test(rel) || /LoginPage|LoginDialog/.test(rel)) return ['login-page', 'features/auth login surface'];
  if (/privacy-lock/.test(rel)) return ['privacy-lock', 'features/privacy-lock overlay (portal popup)'];
  if (/^ui\/shadcn\//.test(rel)) {
    if (/toast/.test(rel)) return ['toast', 'ui/shadcn/toast'];
    if (/(^|\/)(dialog|alert-dialog|sheet)\./.test(rel)) return ['dialog', 'ui/shadcn dialog internals'];
    if (/(dropdown-menu|select|context-menu|menubar)\./.test(rel)) return ['menu-popup', 'ui/shadcn menu/select popup internals (bg-popover/70)'];
    if (/(popover|command|hover-card|tooltip)\./.test(rel)) return ['popover', 'ui/shadcn popup internals'];
    return ['shared', 'ui/shadcn shared component (context decided by caller)'];
  }
  if (/hosts\/AppToaster/.test(rel)) return ['toast', 'AppToaster'];
  if (/components\/media\/ImageCrop/.test(rel)) return ['dialog', 'ImageCropDialog (portal dialog opened from any page)'];
  if (/dialogs\/(user|world|avatar|group)-dialog\//.test(rel) || /(^|\/)(User|World|Avatar|Group)Dialog[A-Za-z]*\.tsx$/.test(rel) || /EntityDialog|DialogHost/.test(rel)) return ['entity-dialog', 'entity (user/world/avatar/group) dialog file'];
  if (/features\/settings\/components\/settings-dialogs\//.test(rel)) return ['dialog', 'settings dialog'];
  if (/(^|\/)dialogs\/|system-dialogs|tools-dialogs|[A-Za-z]Dialogs?\.tsx$|Sheet\.tsx$|Modal/.test(rel)) return ['dialog', 'generic dialog file'];
  if (/^components\/sidebar\//.test(rel)) return ['side-panel', 'components/sidebar'];
  if (/^features\/settings\//.test(rel)) return ['settings-vertical-tabs', 'features/settings (w-44 vertical tabs scaffold)'];
  if (/^components\/layout\//.test(rel)) return ['app-chrome', 'components/layout (titlebar/statusbar/shell)'];
  return ['main-content', 'default: routed page / shared component'];
}

export async function scanSources(SRC) {
  const sites = [];
  let fileCount = 0;
  for await (const f of walk(SRC)) {
    const rel = path.relative(SRC, f).split(path.sep).join('/');
    const text = await fs.readFile(f, 'utf8');
    fileCount++;
    const isShadcn = /^ui\/shadcn\//.test(rel);
    const importedShadcn = new Set();
    for (const m of text.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g)) {
      if (!/shadcn|ui\/(button|badge|input|textarea|select|tabs|checkbox|switch|slider|progress|kbd|toggle|combobox)/.test(m[2]) && !/reui|input-group/.test(m[2])) continue;
      for (const n of m[1].split(',')) importedShadcn.add(n.trim().split(/\s+as\s+/).pop());
    }
    const hasRadio = /@base-ui\/react\/radio/.test(text);
    const [defCtx, defWhy] = fileDefault(rel);
    const stack = []; // {name, line, tagText}
    const tagRe = /<(\/?)([A-Za-z][A-Za-z0-9.]*)/g;
    let m;
    while ((m = tagRe.exec(text))) {
      const closing = m[1] === '/', name = m[2];
      if (closing) {
        if (CTX_TAGS.includes(name)) { for (let k = stack.length - 1; k >= 0; k--) if (stack[k].name === name) { stack.length = k; break; } }
        continue;
      }
      const isCtx = CTX_TAGS.includes(name);
      let prim = null, kind = name;
      if (SHADCN_TAGS[name] && (isShadcn || importedShadcn.has(name))) prim = SHADCN_TAGS[name];
      else if (NATIVE_TAGS.has(name)) prim = '?native';
      else if (hasRadio && RADIO_TAGS.test(name)) prim = 'radio';
      if (!prim && !isCtx) continue;
      const {end, self} = openingTagEnd(text, m.index);
      const tagText = text.slice(m.index, end);
      const line = lineOf(text, m.index);
      if (isCtx && !self) stack.push({name, line, tagText});
      if (!prim) continue;
      const type = attr(tagText, 'type');
      let primId = prim;
      if (prim === '?native') {
        if (name === 'input') {
          if (type === 'range') primId = 'native-range';
          else if (type === 'checkbox') primId = 'native-checkbox';
          else if (type === 'radio') primId = 'radio';
          else if (['hidden', 'file', 'button', 'submit', 'reset', 'image', 'color'].includes(type)) primId = null;
          else primId = 'input-textarea';
        } else if (name === 'textarea') primId = 'input-textarea';
        else if (name === 'select') primId = 'select-trigger';
        else if (name === 'progress') primId = 'progress';
      }
      if (!primId) continue;
      // context
      let ctx = defCtx, why = defWhy;
      for (let k = stack.length - 1; k >= 0; k--) {
        const s = stack[k];
        if (MENU_TAGS.has(s.name)) { ctx = 'menu-popup'; why = `inside <${s.name}> (L${s.line}, portal, bg-popover/70)`; break; }
        if (POPOVER_TAGS.has(s.name)) { ctx = 'popover'; why = `inside <${s.name}> (L${s.line}, portal)`; break; }
        if (DIALOG_TAGS.has(s.name)) {
          if (/entity-dialog/.test(s.tagText)) { ctx = 'entity-dialog'; why = `inside <${s.name} …entity-dialog> (L${s.line})`; }
          else { ctx = 'dialog'; why = `inside <${s.name}> (L${s.line}, portal, not .entity-dialog)`; }
          break;
        }
        if (s.name === 'PageToolbar') { if (defCtx === 'main-content' || defCtx === 'settings-vertical-tabs') { ctx = 'main-toolbar'; why = `inside <PageToolbar> (L${s.line})`; } break; }
        if (s.name === 'Card' && /size=["']sm["']/.test(s.tagText) && (defCtx === 'main-content')) { ctx = 'main-card-sm'; why = `inside <Card size="sm"> (L${s.line})`; break; }
      }
      if (defCtx === 'shared' && ctx === 'shared') continue; // shadcn internals with no concrete context: skip
      const cls = attr(tagText, 'className') ?? attr(tagText, 'class');
      const variant = attr(tagText, 'variant'), size = attr(tagText, 'size');
      sites.push({
        prim: primId, file: rel, line, tag: name, ctx, ctxWhy: why,
        props: {variant, size, type, className: cls},
        summary: [name === 'input' || name === 'textarea' ? `<${name}${type ? ' type=' + type : ''}>` : `<${name}>`, variant && `variant=${variant}`, size && `size=${size}`, cls && `class="${cls.length > 90 ? cls.slice(0, 90) + '…' : cls}"`].filter(Boolean).join(' ')
      });
    }
  }
  return {fileCount, sites};
}
