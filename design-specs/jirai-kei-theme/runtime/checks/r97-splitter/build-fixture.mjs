// Builds fixture.html from the exact source class strings (src snapshot /tmp/vrcx-win-src-r97/src):
// ui/shadcn/resizable.tsx, components/layout/WorkspaceResizeHandle.tsx, features/dashboard/components/DashboardResizeHandle.tsx
// Separator/Panel/Group inline styles + attributes copied from react-resizable-panels 4.12.4 dist.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'bg-border ring-offset-background focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90';
// twMerge(BASE, WORKSPACE): w-px -> w-(--…), bg-border -> bg-transparent, after:w-1 -> after:w-(--…)
const WS_EXTRA = 'w-(--vrcx-0-side-panel-resizer-width) shrink-0 cursor-ew-resize bg-transparent select-none after:w-(--vrcx-0-side-panel-resizer-width) before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-(--vrcx-0-workspace-divider) before:transition-[width,background-color] before:duration-(--motion-standard) before:ease-(--ease-out-ui) before:content-[""] data-[separator=hover]:before:w-0.5 data-[separator=hover]:before:bg-(--vrcx-0-resize-accent) data-[separator=hover]:before:delay-100 data-[separator=focus]:before:w-0.5 data-[separator=focus]:before:bg-(--vrcx-0-resize-accent) data-[separator=active]:before:w-0.5 data-[separator=active]:before:bg-(--vrcx-0-resize-accent-active) data-[separator=active]:before:delay-0';
const WS = BASE.split(' ').filter(c => !['w-px', 'bg-border', 'after:w-1'].includes(c)).join(' ') + ' ' + WS_EXTRA;
const DB_EXTRA = 'bg-border hover:bg-primary/70 focus-visible:bg-primary/70 z-10 w-0.5 shrink-0 cursor-col-resize transition-colors duration-150 after:w-2 aria-[orientation=horizontal]:h-0.5 aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-row-resize aria-[orientation=horizontal]:after:h-2 aria-[orientation=horizontal]:after:w-full';
const DB = BASE.split(' ').filter(c => !['w-px', 'bg-border', 'after:w-1', 'aria-[orientation=horizontal]:h-px', 'aria-[orientation=horizontal]:after:h-1', 'aria-[orientation=horizontal]:w-full', 'aria-[orientation=horizontal]:after:w-full'].includes(c)).join(' ') + ' ' + DB_EXTRA;
const GRIP = '<div class="bg-border z-10 flex h-6 w-1 shrink-0 rounded-lg"></div>';
const panel = (id, grow, text) => `<div data-slot="resizable-panel" data-panel="true" id="${id}" style="display:flex;flex-basis:0;flex-shrink:1;overflow:visible;flex-grow:${grow}"><div class="min-h-0 min-w-0" style="max-height:100%;max-width:100%;flex-grow:1;overflow:auto"><div class="pane">${text}</div></div></div>`;
const group = (id, dir, cls, state, handle) => {
  const sepOrient = dir === 'horizontal' ? 'vertical' : 'horizontal';
  return `<div data-slot="resizable-panel-group" data-group="true" id="${id}" class="flex h-full w-full aria-[orientation=vertical]:flex-col" style="height:100%;width:100%;overflow:hidden;display:flex;flex-direction:${dir === 'horizontal' ? 'row' : 'column'};flex-wrap:nowrap">`
    + panel(id + '-a', 38, dir === 'horizontal' ? '分组栏<br>群组 A<br>群组 B' : '上方面板')
    + `<div data-slot="resizable-handle" id="${id}-sep" role="separator" tabindex="0" aria-orientation="${sepOrient}" aria-valuemin="20" aria-valuemax="80" aria-valuenow="38" data-separator="${state}" class="${cls}" style="flex-basis:auto;flex-grow:0;flex-shrink:0;touch-action:none">${handle ? GRIP : ''}</div>`
    + panel(id + '-b', 62, dir === 'horizontal' ? '内容面板<br>收藏卡片…' : '下方面板')
    + `</div>`;
};
const cases = [];
for (const s of ['inactive', 'hover', 'active', 'focus']) cases.push(['vh-' + s, 'horizontal', BASE, s, true, `竖线 withHandle · ${s}`]);
for (const s of ['inactive', 'hover', 'active', 'focus']) cases.push(['hh-' + s, 'vertical', BASE, s, true, `横线 withHandle · ${s}`]);
for (const s of ['inactive', 'hover', 'active', 'focus']) cases.push(['vp-' + s, 'horizontal', BASE, s, false, `竖线 无握把(Assistant) · ${s}`]);
cases.push(['hp-inactive', 'vertical', BASE, 'inactive', false, '横线 无握把 · inactive']);
cases.push(['hp-hover', 'vertical', BASE, 'hover', false, '横线 无握把 · hover']);
cases.push(['dv-hover', 'horizontal', DB, 'hover', false, 'Dashboard 竖 2px · hover']);
cases.push(['dh-active', 'vertical', DB, 'active', false, 'Dashboard 横 2px · active']);
for (const s of ['inactive', 'hover', 'active', 'focus']) cases.push(['ws-' + s, 'horizontal', WS, s, false, `WorkspaceResizeHandle 8px · ${s}`]);
const html = `<!doctype html>
<html lang="zh-CN" class="dark">
<head>
<meta charset="utf-8">
<title>NOT WINDOWS · R9.7 Q6 splitter fixture (source DOM)</title>
<style>
body{margin:0;padding:16px;background:#16112a;color:#f2ebff;font:12px/1.4 system-ui,sans-serif}
.grid{display:grid;grid-template-columns:repeat(4,300px);gap:12px 20px}
.card{display:flex;flex-direction:column;gap:4px}
.lab{font:11px/16px monospace;color:#c9b8ef}
.box{width:300px;height:120px;border:1px solid #6c5ce0;background:#201936}
.pane{padding:6px 8px;font-size:11px;color:#d8cdf5}
</style>
</head>
<body>
<div class="grid">
${cases.map(([id, dir, cls, st, h, lab]) => `<div class="card"><div class="lab">${lab}</div><div class="box" id="box-${id}">${group(id, dir, cls, st, h)}</div></div>`).join('\n')}
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(here, 'fixture.html'), html);
console.log('cases', cases.length);
