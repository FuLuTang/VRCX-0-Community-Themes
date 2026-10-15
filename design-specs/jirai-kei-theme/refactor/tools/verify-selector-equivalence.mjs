import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const source = path.join(root, 'refactor/src');
const snapshotDir = path.join(root, 'baseline/snapshot');
const suffixes = [
  'menu-separator', 'menu-item', 'menu-content', 'menu-sub-content',
  'menu-checkbox-item', 'menu-radio-item', 'menu-sub-trigger',
  'dialog-content', 'dialog-header', 'title', 'description', 'menu-label', 'menu-shortcut',
  '-item', '-trigger',
];
function cssFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? cssFiles(p) : e.name.endsWith('.css') ? [p] : [];
  });
}
const runtimeSlots = new Set();
for (const name of fs.readdirSync(snapshotDir).filter(n => n.endsWith('.json'))) {
  const snapshot = JSON.parse(fs.readFileSync(path.join(snapshotDir, name), 'utf8'));
  for (const element of snapshot.elements ?? []) {
    const value = element.attrs?.['data-slot'];
    if (value) runtimeSlots.add(value);
  }
}
const inventoryFiles = [...cssFiles(path.join(source, 'style')), ...cssFiles(path.join(source, 'frozen'))];
const cssSlots = new Set(inventoryFiles.flatMap(file => [...fs.readFileSync(file, 'utf8').matchAll(/data-slot="([^"]+)"/g)].map(m => m[1])));
const slotValues = [...new Set([...runtimeSlots, ...cssSlots])].sort();
const explicit = {
  'menu-separator': ['dropdown-menu-separator'],
  'menu-item': ['context-menu-item', 'dropdown-menu-item', 'sidebar-menu-item'],
  'menu-content': ['context-menu-content', 'dropdown-menu-content'],
  'menu-sub-content': ['context-menu-sub-content', 'dropdown-menu-sub-content'],
  'menu-checkbox-item': ['context-menu-checkbox-item', 'dropdown-menu-checkbox-item'],
  'menu-radio-item': ['context-menu-radio-item', 'dropdown-menu-radio-item'],
  'menu-sub-trigger': ['context-menu-sub-trigger', 'dropdown-menu-sub-trigger'],
  'dialog-content': ['alert-dialog-content', 'dialog-content'],
  'dialog-header': ['alert-dialog-header', 'dialog-header'],
  title: ['alert-dialog-title', 'alert-title', 'card-title', 'dialog-title', 'empty-title', 'sheet-title', 'toast-title'],
  description: ['alert-description', 'card-description', 'empty-description', 'field-description', 'toast-description'],
  'menu-label': [],
  'menu-shortcut': [],
  '-item': ['combobox-item', 'context-menu-checkbox-item', 'context-menu-item', 'context-menu-radio-item', 'dropdown-menu-checkbox-item', 'dropdown-menu-item', 'dropdown-menu-radio-item', 'menubar-checkbox-item', 'menubar-item', 'menubar-radio-item', 'pagination-item', 'select-item', 'sidebar-menu-item', 'timeline-item'],
  '-trigger': ['collapsible-trigger', 'combobox-trigger', 'context-menu-sub-trigger', 'context-menu-trigger', 'dropdown-menu-sub-trigger', 'dropdown-menu-trigger', 'hover-card-trigger', 'menubar-sub-trigger', 'menubar-trigger', 'popover-trigger', 'select-trigger', 'sheet-trigger', 'tooltip-trigger'],
};
let ok = true;
for (const suffix of suffixes) {
  const theoretical = slotValues.filter(v => v.endsWith(suffix));
  const listed = [...new Set(explicit[suffix])].sort();
  const equal = JSON.stringify([...theoretical].sort()) === JSON.stringify(listed);
  ok &&= equal;
  console.log(`${suffix} → 改写前理论命中集合=${JSON.stringify(theoretical)} → 改写后显式集合=${JSON.stringify(listed)} → ${equal ? '相等' : '不相等'}`);
}
const remaining = [];
for (const file of cssFiles(path.join(source, 'style'))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\[data-slot\$\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\]\s]+))\]/g)) {
    const suffix = m[1] ?? m[2] ?? m[3];
    if (suffix !== '-item' && suffix !== '-trigger') remaining.push(`${path.relative(root, file)}:${text.slice(0, m.index).split('\n').length} ${m[0]}`);
  }
}
console.log(`并集 slot 扫描（${slotValues.length} 个唯一值；运行时 ${runtimeSlots.size}，CSS ${cssSlots.size}）`);
console.log(`剩余后缀选择器: ${JSON.stringify(remaining)}`);
console.log(`RESULT: ${ok && !remaining.length ? 'PASS' : 'FAIL'} (${suffixes.length} suffix checks; ${remaining.length} remaining suffix selectors)`);
if (!ok || remaining.length) process.exitCode = 1;
