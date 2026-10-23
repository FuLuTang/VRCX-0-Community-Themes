// ToggleGroup preview: current theme | proposal (toggle-group-proposal.css), side by side.
// Groups found in the baseline fixtures are replayed with their real ancestors (toggle-group-contexts.json);
// categories the fixtures never captured use the real ToggleGroup component placed inside a real captured
// container (menu, settings card, toolbar) or, for dialogs, the structure of src/ui/shadcn/dialog.tsx.
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {LayoutGridIcon, ListIcon, RowsIcon} from 'lucide-react';
import {ToggleGroup, ToggleGroupItem, ToggleGroupSeparator} from '@/ui/shadcn/toggle-group';
import {Replay, ReplayGroup, props, type Context} from './preview-replay';
import contexts from './toggle-group-contexts.json';

const C = contexts as unknown as Record<string, Context>;
const Disabled = React.createContext(false);

/** The captured container keeps its real ancestors; `children` are placed inside it (its own children are dropped). */
function Inside({ctx, children}: {ctx: Context; children: React.ReactNode}) {
  return <Replay ctx={ctx} leaf={React.createElement(ctx.element.tag, {...props(ctx.element.attrs), 'data-jk-target': ''}, children)} />;
}
function Group({labels, icons, multiple, variant = 'outline', size = 'sm', full}: {labels: string[]; icons?: boolean; multiple?: boolean; variant?: 'outline' | 'default'; size?: 'sm' | 'default'; full?: boolean}) {
  const [value, setValue] = useState<string[]>(multiple ? [labels[0], labels[2]].filter(Boolean) : [labels[0]]);
  const disabled = React.useContext(Disabled);
  const Icons = [LayoutGridIcon, ListIcon, RowsIcon];
  return <ToggleGroup multiple={multiple} value={value} onValueChange={(v) => setValue(v as string[])} variant={variant} size={size}
    className={full ? 'w-full [&>[data-slot=toggle]]:min-w-0 [&>[data-slot=toggle]]:flex-1' : undefined}>
    {labels.map((l, i) => <React.Fragment key={l}>
      {i > 0 && variant === 'outline' && <ToggleGroupSeparator />}
      <ToggleGroupItem value={l} aria-label={l} disabled={disabled && i === labels.length - 1}>{icons ? React.createElement(Icons[i % 3]) : l}</ToggleGroupItem>
    </React.Fragment>)}
  </ToggleGroup>;
}
const Dialog = ({children}: {children: React.ReactNode}) => (
  <div role="dialog" data-slot="dialog-content" className="bg-popover text-popover-foreground ring-foreground/10 grid w-full gap-4 rounded-xl p-4 text-sm ring-1 outline-none">
    <div data-slot="dialog-header" className="flex flex-col gap-2"><h2 data-slot="dialog-title" className="font-heading text-base leading-none font-medium">编辑社交状态</h2></div>
    {children}
  </div>
);

type Row = {id: string; title: string; meta: string; source: string; count?: string; render: (disabled: boolean) => React.ReactNode};
const ROWS: Row[] = [
  {id: 'tg-toolbar-icon', title: 'A 工具栏图标视图切换', meta: 'outline / default / 子项套 Tooltip', source: 'ToolbarControls.tsx:178–234', count: '快照 10 处（同一位置）',
    render: (d) => <ReplayGroup ctx={C['tg-toolbar-icon']} disabledLast={d} />},
  {id: 'tg-toolbar-text', title: 'B 工具栏单选（活动页）', meta: 'outline / default', source: 'ActivityPageImpl.tsx:278–319', count: '快照 1 处',
    render: (d) => <ReplayGroup ctx={C['tg-toolbar-text']} labels={['今天', '本周', '全部']} disabledLast={d} />},
  {id: 'tg-scaffold-sm', title: 'C 页面内文字分段', meta: 'outline / sm', source: 'ActivityViewOption.tsx:32–69', count: '快照 3 处',
    render: (d) => <ReplayGroup ctx={C['tg-scaffold-sm']} labels={['列表', '网格', '紧凑']} disabledLast={d} />},
  {id: 'menu-content', title: 'D 下拉菜单内整宽', meta: 'outline / sm / 整宽平分', source: 'GalleryGridDensityMenu.tsx:34–61（快照未采到；容器取自真实菜单）',
    render: () => <Inside ctx={C['menu-content']}><div className="p-1"><Group labels={['舒适', '紧凑', '密集']} full /></div></Inside>},
  {id: 'settings-card', title: 'E 设置卡片里的偏好', meta: 'outline / sm', source: 'SettingsInterfaceProfileAppearanceCard.tsx:49–74（容器取自真实设置卡片）',
    render: () => <Inside ctx={C['settings-card']}><Group labels={['自动', '明亮', '暗色']} /></Inside>},
  {id: 'dialog', title: 'F 对话框表单单选', meta: 'outline / default', source: 'UserSelfEditDialogs.tsx:215–257（快照没采到对话框，结构取自 dialog.tsx）',
    render: () => <Dialog><Group labels={['仅好友', '所有人', '无人']} size="default" /></Dialog>},
  {id: 'filter-chips', title: 'G 工具栏多选筛选', meta: 'default / default / 多选', source: 'ToolbarControls.tsx:298–376（快照未采到；容器取自真实工具栏）',
    render: () => <Inside ctx={{...C['tg-toolbar-text'], element: C['tg-toolbar-text'].chain.at(-1)!, chain: C['tg-toolbar-text'].chain.slice(0, -1), id: 'filter-chips'}}><Group labels={['图片', '视频', '收藏']} variant="default" size="default" multiple /></Inside>},
  {id: 'weekdays', title: 'H 多选（星期）', meta: 'outline / sm / 多选', source: 'TimeRulesTab.tsx:296–326（快照未采到；容器取自真实设置卡片）',
    render: () => <Inside ctx={C['settings-card']}><Group labels={['周一', '周三', '周五', '周日']} multiple /></Inside>},
];

function App() {
  const [theme, setTheme] = useState(true), [disabled, setDisabled] = useState(false);
  return <Disabled.Provider value={disabled}><main className="demo-document">
    <header className="demo-document-header">
      <div className="demo-eyebrow">TOGGLE GROUP / 现状 vs 提案</div>
      <h1>切换组：像老电风扇的按键，按下去的才是选中</h1>
      <p>左边是当前主题，右边是提案。快照里有的切换组连同真实祖先一起重建；快照没采到的类别，用真实组件放进真实容器。全部可点击切换、悬停、按住、Tab 聚焦。</p>
      <div className="demo-top-tools">
        <button className="demo-theme-toggle" onClick={() => { setTheme(!theme); (document.getElementById('merged-theme') as HTMLStyleElement).disabled = theme; }}>{theme ? '已应用合并主题 CSS' : '仅应用基础 CSS'} · 点击切换</button>
        <button className="demo-theme-toggle" onClick={() => setDisabled(!disabled)}>{disabled ? '关闭禁用测试' : '禁用每组最后一项'}</button>
      </div>
    </header>
    <section className="demo-section">
      <div className="demo-comparison-note"><strong>对照：Tabs（已定稿，不在本轮修改）</strong><p>Tabs 选中的页签是粉色凸起；切换组选中的键是粉色按下去的，未选中的是暗色凸起。两者靠这个区分。</p></div>
      <div className="demo-table"><div className="demo-row-compare" data-ctx="tabs-ref"><div className="demo-row-meta"><span className="demo-row-no">T</span><div><h2>工具栏 Tabs</h2><p>取自 friends-locations</p></div></div>
        <div className="demo-pane"><Replay ctx={C['tabs-ref']} labels={['好友', '世界', '群组', '实例', '收藏', '其他']} /></div><div className="demo-pane jk-proposal"><Replay ctx={C['tabs-ref']} labels={['好友', '世界', '群组', '实例', '收藏', '其他']} /></div></div></div>
    </section>
    <section className="demo-section">
      <div className="demo-comparison-note"><strong>切换组 A–H</strong><p>一组键共用一个深色底槽（保持“一个组”的整体感）。未选中：暗色凸起；选中：亮粉按下；悬停只变亮，按住时压下，状态切换用和按钮相同的两帧动画。A–H 共用这一套，尺寸和整宽排列照原样保留。</p></div>
      <div className="demo-table">
        <div className="demo-table-head"><span>位置</span><span>现状</span><span>提案</span></div>
        {ROWS.map((r) => <div key={r.id} className="demo-row-compare" data-ctx={r.id}>
          <div className="demo-row-meta"><div><h2>{r.title}</h2><p>{r.meta}</p><p>{r.count ? r.count + ' · ' : ''}{r.source}</p></div></div>
          <div className="demo-pane">{r.render(disabled)}</div>
          <div className="demo-pane jk-proposal">{r.render(disabled)}</div>
        </div>)}
      </div>
    </section>
    <footer className="demo-footer">结构数据：checks/toggle-group-contexts.json（extract-preview-contexts.mjs 从基线快照提取，只有结构）。提案：checks/toggle-group-proposal.css，只作用于右栏，尚未进入主题。</footer>
  </main></Disabled.Provider>;
}
createRoot(document.getElementById('preview-root')!).render(<App />);
