// Button preview: every row is a real button from the baseline fixtures, replayed inside its real
// ancestor structure (button-contexts.json), shown twice: current theme | proposal (button-proposal.css).
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Trash2Icon} from 'lucide-react';
import {Button} from '@/ui/shadcn/button';
import {Replay, type Context} from './preview-replay';
import contexts from './button-contexts.json';

const C = contexts as unknown as Record<string, Context>;
type Row = {id: string; title: string; count: number; flagged?: string; labels?: string[]; lead?: string; text?: string; custom?: (d: boolean) => React.ReactNode; source?: string};

// Dialogs were not captured in the fixtures; structure follows src/ui/shadcn/dialog.tsx with the fixed positioning removed.
const dialogClass = 'bg-popover text-popover-foreground ring-foreground/10 grid w-full gap-4 rounded-xl p-4 text-sm ring-1 outline-none';
const Dialog = ({children}: {children: React.ReactNode}) => (
  <div role="dialog" data-slot="dialog-content" className={dialogClass}>
    <div data-slot="dialog-header" className="flex flex-col gap-2"><h2 data-slot="dialog-title" className="font-heading text-base leading-none font-medium">移出群组</h2><p data-slot="dialog-description" className="text-muted-foreground text-sm">此操作只影响演示数据。</p></div>
    <div data-slot="dialog-footer" className="bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end">{children}</div>
  </div>
);

const SECTIONS: {title: string; note: string; rows: Row[]}[] = [
  {title: '实体按钮', note: '原版就有边界（default / outline / secondary / destructive）→ Win98 凸起按钮；按下沿用现状的两帧动画和深色凹陷（06 的手感），菜单打开时保持按下。危险按钮沿用现状的深酒红底配红框。', rows: [
    {id: 'toolbar-outline-menu', title: '页面工具栏 · 下拉触发', count: 12, flagged: '原 10', lead: '全部类型'},
    {id: 'outline-sm', title: '主题页 · 色板按钮', count: 20, text: '粉色'},
    {id: 'outline-icon-xs', title: '实例历史 · 行内图标', count: 46},
    {id: 'card-menu-secondary', title: '好友位置卡片 · 更多菜单', count: 91},
    {id: 'titlebar-secondary', title: '标题栏 · 账号状态', count: 42, text: '在线'},
    {id: 'default-sm', title: '图表 · 主操作', count: 27, text: '生成'},
    {id: 'dialog-footer', title: '对话框底部 · 主 / 次', count: 0, source: 'dialog.tsx（快照没采到对话框，结构取自源码）', custom: (d) => <Dialog><Button variant="outline" disabled={d}>取消</Button><Button disabled={d}>确认</Button></Dialog>},
    {id: 'dialog-danger', title: '对话框 · 危险操作', count: 0, source: 'UserDialogGroupQuickModerationDialog.tsx:195（快照未采到）', custom: (d) => <Dialog><Button variant="outline" disabled={d}>取消</Button><Button variant="destructive" disabled={d}><Trash2Icon />移出</Button></Dialog>},
  ]},
  {title: '扁平按钮', note: '原版没有边界（ghost）→ 平时看不见；悬停时变成所在表面的强调色凸起按钮（深色区域是紫色，标题栏/状态栏这种粉色条是品红，沿用标题栏现状），按下凹陷。带快捷键提示的是搜索框，平时就可见。列表行（size default）悬停染色加细框，按下凹陷。侧栏分组标题（16）保持现状不动。', rows: [
    {id: 'toolbar-icon', title: '页面工具栏 · 图标（套 Tooltip）', count: 42, flagged: '原 09'},
    {id: 'table-icon', title: '表格行 · 展开', count: 144, flagged: '原 06'},
    {id: 'object-row', title: '浏览记录行 · 移除', count: 106, flagged: '原 06'},
    {id: 'card-menu-ghost', title: '收藏卡片 · 更多菜单', count: 99},
    {id: 'table-icon-xs', title: '表头 · 拖拽把手', count: 63},
    {id: 'popover-icon', title: '日期弹层 · 日期格', count: 77, flagged: '原 08', text: '15'},
    {id: 'side-icon', title: '侧栏 · 我的菜单', count: 37},
    {id: 'side-group', title: '侧栏 · 分组标题', count: 148, labels: ['在线好友', '12']},
    {id: 'titlebar-icon', title: '标题栏 · 图标', count: 294},
    {id: 'titlebar-xs', title: '标题栏 · 快速搜索', count: 42, labels: ['搜索…', 'Ctrl', 'K']},
    {id: 'statusbar-sm', title: '状态栏 · 在线人数', count: 84, labels: ['在线 12']},
    {id: 'statusbar-icon', title: '状态栏 · 图标', count: 84},
    {id: 'side-row', title: '侧栏 · 好友行（列表行）', count: 592, labels: ['好友甲', '在某个世界']},
    {id: 'scaffold-ghost-row', title: '收藏夹列表行（列表行）', count: 168, labels: ['私人收藏夹', '8']},
  ]},
  {title: '链接', note: '原版是文字链接（link）→ 只用颜色和下划线表达，任何状态都不长出按钮框。', rows: [
    {id: 'link-xs', title: '主题卡片 · 外链', count: 22, flagged: '原 05', labels: ['查看主题页']},
  ]},
];

function Pane({row, disabled, proposal}: {row: Row; disabled: boolean; proposal?: boolean}) {
  const ctx = C[row.id];
  return <div className={'demo-pane' + (proposal ? ' jk-proposal' : '')}>{row.custom ? row.custom(disabled) : <Replay ctx={ctx} labels={row.labels} lead={row.lead} text={row.text} disabled={disabled} />}</div>;
}

function App() {
  const [theme, setTheme] = useState(true), [disabled, setDisabled] = useState(false);
  let n = 0;
  return <main className="demo-document">
    <header className="demo-document-header">
      <div className="demo-eyebrow">BUTTON / 现状 vs 提案</div>
      <h1>按钮：三种手感</h1>
      <p>每一行都是基线快照里真实存在的按钮，连同它真实的祖先结构一起重建（只取结构，文字全是虚构）。左边是当前主题，右边是提案；两边都能悬停、按住、Tab 聚焦。</p>
      <div className="demo-top-tools">
        <button className="demo-theme-toggle" onClick={() => { setTheme(!theme); (document.getElementById('merged-theme') as HTMLStyleElement).disabled = theme; }}>{theme ? '已应用合并主题 CSS' : '仅应用基础 CSS'} · 点击切换</button>
        <button className="demo-theme-toggle" onClick={() => setDisabled(!disabled)}>{disabled ? '关闭禁用测试' : '全部禁用'}</button>
        <span>“快照”= 42 个基线快照里同一位置、同一属性的按钮数量。</span>
      </div>
    </header>
    {SECTIONS.map((s) => <section key={s.title} className="demo-section">
      <div className="demo-comparison-note"><strong>{s.title}</strong><p>{s.note}</p></div>
      <div className="demo-table">
        <div className="demo-table-head"><span>位置</span><span>现状</span><span>提案</span></div>
        {s.rows.map((r) => {
          const ctx = C[r.id]; const e = ctx?.element.attrs;
          n++;
          return <div key={r.id} className="demo-row-compare" data-ctx={r.id}>
            <div className="demo-row-meta">
              <span className="demo-row-no">{String(n).padStart(2, '0')}</span>
              <div><h2>{r.title}{r.flagged && <em>{r.flagged}</em>}</h2>
                {ctx && ctx.revealed === false && <p className="demo-hint">平时隐藏，鼠标移到该行（面板）上才出现</p>}
                <p>{e ? `${e['data-variant']} / ${e['data-size']} / ${e['data-slot']}` : ''}</p>
                <p>{r.count ? `快照 ${r.count} 个 · 取自 ${ctx.fixture}` : r.source}</p></div>
            </div>
            <Pane row={r} disabled={disabled} />
            <Pane row={r} disabled={disabled} proposal />
          </div>;
        })}
      </div>
    </section>)}
    <footer className="demo-footer">结构数据：checks/button-contexts.json（由 extract-preview-contexts.mjs 从基线快照提取）。提案：checks/button-proposal.css，只作用于右栏，尚未进入主题。</footer>
  </main>;
}
createRoot(document.getElementById('preview-root')!).render(<App />);
