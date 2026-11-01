// Show-and-tell for the four leftover primitives (alert, calendar, progress, skeleton) in the CURRENT theme.
// Real app components; fictional text and fixed dates. Three hosts per row: main content,
// an ordinary dialog and an entity dialog, to verify shared alert/calendar paint.
import React from 'react';
import {createRoot} from 'react-dom/client';
import {InfoIcon, TriangleAlertIcon} from 'lucide-react';
import {Alert, AlertTitle, AlertDescription} from '@/ui/shadcn/alert';
import {Calendar} from '@/ui/shadcn/calendar';
import {Progress} from '@/ui/shadcn/progress';
import {Skeleton} from '@/ui/shadcn/skeleton';

const Main = ({children}: {children: React.ReactNode}) => (
  <div className="vrcx-0-main-content" style={{position: 'relative', padding: 16, background: 'var(--wd-window,#201936)', minHeight: 120}}>{children}</div>
);
const Dlg = ({children, entity = false}: {children: React.ReactNode; entity?: boolean}) => (
  <div data-slot="dialog-content" className={`${entity ? 'entity-dialog ' : ''}bg-background grid gap-4 rounded-xl p-4 text-sm ring-1 ring-foreground/10`} style={{position: 'relative', width: '100%', boxSizing: 'border-box'}}>
    <div data-slot="dialog-header" className="flex flex-col gap-2"><h2 data-slot="dialog-title" className="text-base leading-none font-medium">虚构对话框</h2></div>
    {children}
  </div>
);
const alerts = (<div style={{display: 'grid', gap: 10}}>
  <Alert><InfoIcon /><AlertTitle>虚构提示标题</AlertTitle><AlertDescription>这里是一段虚构的说明文字，告诉你某件事的状态。</AlertDescription></Alert>
  <Alert variant="destructive"><TriangleAlertIcon /><AlertTitle>虚构错误标题</AlertTitle><AlertDescription>危险/错误样式的提示框。</AlertDescription></Alert>
</div>);
const cal = <Calendar mode="single" selected={new Date(2026, 9, 14)} today={new Date(2026, 9, 20)} defaultMonth={new Date(2026, 9, 1)} />;
const prog = (<div style={{display: 'grid', gap: 10, maxWidth: 360}}><Progress value={35} /><Progress value={80} /></div>);
const skel = (<div style={{display: 'flex', gap: 12, alignItems: 'center'}}><Skeleton className="size-9 rounded-full" /><div style={{display: 'grid', gap: 6}}><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-32" /></div><Skeleton className="h-16 w-28 rounded-md" /></div>);
const rows: [string, string, React.ReactNode][] = [
  ['alert', '行内提示框 Alert', alerts],
  ['calendar', '日历 Calendar', cal],
  ['progress', '进度条 Progress', prog],
  ['skeleton', '骨架屏 Skeleton', skel],
];
function App() {
  return <main className="demo-page"><header className="demo-header"><h1>剩余小件 · 现状（当前主题）</h1><p>左：主内容区；中：普通对话框；右：实体详情对话框。固定虚构日期与文字。</p></header>
    <section className="demo-section"><div className="demo-table">{rows.map(([id, title, node]) => (
      <div className="demo-row-compare" style={{gridTemplateColumns: '160px repeat(3,minmax(0,1fr))'}} data-ctx={id} key={id}><div className="demo-row-meta"><h2>{title}</h2></div>
        <div className="demo-pane"><Main>{node}</Main></div><div className="demo-pane"><Dlg>{node}</Dlg></div><div className="demo-pane"><Dlg entity>{node}</Dlg></div></div>))}</div></section></main>;
}
createRoot(document.getElementById('preview-root')!).render(<App />);
