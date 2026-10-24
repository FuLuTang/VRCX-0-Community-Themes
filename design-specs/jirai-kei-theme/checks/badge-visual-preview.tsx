// Badge + Kbd preview: current theme | proposal (badge-proposal.css), side by side. Every row that exists
// in the baseline fixtures is replayed inside its real ancestors (badge-contexts.json, structure only,
// fictional labels). Uses the fixtures never captured (dialog badges, the active-theme badge, a Warning log
// level, the shortcut sheet, the hint panel, the feed search footer) are built from the app's own components
// and class strings. The last section is a visibility board: the same badges and keys on every surface they
// can land on (dark list, hovered row, pink bars, selected pink row, thumbnail).
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BadgeCheckIcon, SearchIcon, icons} from 'lucide-react';
import {Badge} from '@/ui/shadcn/badge';
import {Kbd} from '@/ui/shadcn/kbd';
import {KeyboardShortcut} from '@/components/keyboard/KeyboardShortcut';
import {ShortcutKey} from '@/components/keyboard/ShortcutHintPanel';
import {Replay, props, type Context, type Node} from './preview-replay';
import contexts from './badge-contexts.json';

const C = contexts as unknown as Record<string, Context>;
type Row = {id: string; title: string; meta: string; source: string; render: () => React.ReactNode};

/** The captured element is replaced by `children` (its real ancestors stay); the new root is the target. */
function Instead({ctx, children}: {ctx: Context; children: React.ReactNode}) {
  return <Replay ctx={ctx} leaf={<div data-jk-target="" style={{display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center'}}>{children}</div>} />;
}
/** Same chain, the captured element with its class rewritten (for the Warning level the fixture lacks). */
const withClass = (id: string, from: RegExp, to: string): Context => {
  const c = C[id];
  return {...c, id: id + '-alt', element: {...c.element, attrs: {...c.element.attrs, class: c.element.attrs.class.replace(from, to)}}};
};

// Dialogs / sheets / popovers were not captured; boxes follow the app's class strings (dialog.tsx, sheet.tsx,
// ShortcutHintPanel.tsx:46–52, FeedSearchBox.tsx:220) with fixed positioning removed.
const dialogClass = 'bg-popover text-popover-foreground ring-foreground/10 grid w-full gap-4 rounded-xl p-4 text-sm ring-1 outline-none';
const Dialog = ({children}: {children: React.ReactNode}) => (
  <div role="dialog" data-slot="dialog-content" data-jk-target="" className={dialogClass}>{children}</div>
);
/** Rebuilds a captured element (icons by lucide class, first empty span gets `label`), marked as the target. */
const pascal = (s: string) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
function Clone({n, label, target, extra}: {n: Node; label: {v?: string}; target?: boolean; extra?: React.ReactNode}): React.ReactElement {
  if (n.tag === 'svg') {
    const I = (n.attrs.class || '').split(/\s+/).filter((c) => c.startsWith('lucide-')).map((c) => (icons as Record<string, React.ComponentType<Record<string, unknown>>>)[pascal(c.slice(7))]).find(Boolean) || icons.Circle;
    return <I className={n.attrs.class} />;
  }
  const p = {...props(n.attrs), ...(target ? {'data-jk-target': ''} : {})};
  const kids = n.children?.length ? n.children.map((c, i) => <Clone key={i} n={c} label={label} />) : n.tag === 'span' && !/size-/.test(n.attrs.class || '') ? (() => { const v = label.v; label.v = undefined; return v ?? null; })() : null;
  return React.createElement(n.tag, p, kids, extra ?? null);
}
/** Nav menu item while Ctrl is held. The app has two placements: inside the button with ml-auto
 * (AppNavMenuEntryItems.tsx:276–281) and in a sibling SidebarMenuBadge (:428–431). The preview flattens
 * non-target siblings, so the in-button placement is used; the key's paint is the same ShortcutKey either way. */
const NavItem = ({id, label, k}: {id: string; label: string; k: string}) => (
  <Replay ctx={C[id]} leaf={<Clone n={C[id].element} label={{v: label}} target extra={<ShortcutKey keys={k} className="ml-auto" />} />} />
);
const hintPanelClass = 'bg-popover/95 text-popover-foreground ring-foreground/10 w-64 rounded-lg p-1.5 shadow-lg ring-1';

const COUNT: Row[] = [
  {id: 'count-side-group', title: '侧栏 · 分组标题的人数', meta: 'outline · tabular-nums · text-muted-foreground', source: 'ListSectionHeader.tsx:47 · 快照 111 个（37 页）',
    render: () => <Replay ctx={C['count-side-group']} labels={['在线好友', '12']} />},
  {id: 'count-side-header', title: '侧栏 · 同房间分组头的人数', meta: '同一写法（outline · tabular-nums）', source: 'FriendsSidebarHeaders.tsx:76 · 快照 37 个',
    render: () => <Replay ctx={C['count-side-header']} labels={['JP', '某个世界 #1234', '3']} />},
  {id: 'count-favorites', title: '收藏页 · 分组栏标题的数量', meta: '同一写法', source: 'FavoritesGroupRail.tsx:578 · 快照 11 个（5 页）',
    render: () => <Replay ctx={C['count-favorites']} labels={['云端收藏', '8']} />},
  {id: 'count-locations', title: '好友位置页 · 房间头的人数', meta: '同一写法', source: 'FriendsLocationsViewParts.tsx:122 / :175 · 快照 4 个',
    render: () => <Replay ctx={C['count-locations']} labels={['US', '另一个世界 #5678', '4']} />},
  {id: 'count-mygroups', title: '我的群组 · 折叠标题的数量', meta: '同一写法（页面里的 ListSectionHeader）', source: 'ListSectionHeader.tsx:47 · 快照 2 个',
    render: () => <Replay ctx={C['count-mygroups']} labels={['我加入的群组', '2']} />},
  {id: 'value-settings', title: '设置 · 数值读数', meta: 'outline（无 tabular-nums）：显示当前设定值', source: 'SettingsSystemTab.tsx:186 / :334 · 快照 5 个',
    render: () => <Replay ctx={C['value-settings']} labels={['5m', '修改']} />},
];

const LABEL: Row[] = [
  {id: 'tag-theme', title: '主题卡片 · 标签', meta: 'secondary · font-normal', source: 'ThemesPageParts.tsx:17 · 快照 66 个',
    render: () => <Replay ctx={C['tag-theme']} text="像素风" />},
  {id: 'tag-theme-detail', title: '主题详情 · 标签', meta: 'secondary', source: 'CommunityThemesSection · 快照 2 个',
    render: () => <Replay ctx={C['tag-theme-detail']} text="暗色" />},
  {id: 'status-theme', title: '主题卡片 · 状态“已安装”', meta: 'secondary：状态', source: 'ThemesPageParts.tsx:75 · 快照 12 个',
    render: () => <Replay ctx={C['status-theme']} text="已安装" />},
  {id: 'status-active', title: '主题卡片 · 状态“使用中”（带图标）', meta: 'default + BadgeCheckIcon（快照未采到）', source: 'ThemesPageParts.tsx:70 / CommunityThemesSection.tsx:208',
    render: () => <Instead ctx={C['status-theme']}><Badge className="shrink-0"><BadgeCheckIcon data-icon="inline-start" />使用中</Badge></Instead>},
  {id: 'tile-inventory', title: '物品栏 · 缩略图上的类型标签', meta: 'outline + bg-background/80：压在图片上', source: 'MediaAssetTile.tsx:305 · 快照 9 个',
    render: () => <Replay ctx={C['tile-inventory']} labels={['表情贴纸']} />},
  {id: 'dlg-badges', title: '用户/模型详情对话框 · 头部标签', meta: 'destructive / outline / secondary（对话框不在主内容区，快照未采到）', source: 'UserDialogHeaderBadges.tsx:108–136 · AvatarDialogHeaderBadges.tsx:21–37',
    render: () => <Dialog><div className="flex flex-wrap gap-1.5"><Badge variant="destructive">已封禁</Badge><Badge variant="outline">PC</Badge><Badge variant="secondary">年龄已验证</Badge><Badge>好友</Badge></div></Dialog>},
];

const LOG: Row[] = [
  {id: 'level-info', title: 'VRChat 日志 · 级别 Info', meta: 'default + levelClassName：源码给 Info 天蓝', source: 'VrchatLogTable.tsx:175 · vrchatLogHelpers.ts:142–150 · 快照 35 个',
    render: () => <Replay ctx={C['level-info']} text="Info" />},
  {id: 'level-error', title: 'VRChat 日志 · 级别 Error', meta: '源码给 Error 红色', source: '同上 · 快照 3 个',
    render: () => <Replay ctx={C['level-error']} text="Error" />},
  {id: 'level-warning', title: 'VRChat 日志 · 级别 Warning', meta: '源码给 Warning 琥珀（快照未采到，类名照源码换）', source: 'vrchatLogHelpers.ts:146–147',
    render: () => <Replay ctx={withClass('level-info', /sky/g, 'amber')} text="Warning" />},
  {id: 'log-continuation', title: 'VRChat 日志 · 续行数', meta: 'default + bg-muted text-muted-foreground：源码想要灰色计数', source: 'VrchatLogTable.tsx:225 · 快照 2 个',
    render: () => <Replay ctx={C['log-continuation']} labels={['某条日志消息……', '+3 行']} />},
];

const CORNER: Row[] = [
  {id: 'bell', title: '标题栏 · 铃铛未读角标', meta: 'default · absolute · rounded-full · 7px 字：叠在图标右上角', source: 'useTitleBarActions.tsx:383 · 快照 42 个（每页 1 个）',
    render: () => <Replay ctx={C['bell']} text="7" />},
];

const LOOKALIKE: Row[] = [
  {id: 'region-chip', title: '服务器区域 JP / US / EU（不是 Badge 组件）', meta: '手写 span，没有 data-slot；feed-badges.css 5c 单独皮肤', source: 'RegionCodeBadge.tsx:32 · 快照约 700 处',
    render: () => <Replay ctx={C['region-chip']} text="JP" />},
  {id: 'lang-label', title: '好友列表 · 语言标签（不是 Badge 组件）', meta: 'TooltipTrigger 手写 span；language-badges-r98.css（已选 01 BlackBerry/Pink）', source: 'FriendListColumns.tsx:326 · PlayerListColumns.tsx:363 · 快照 29 个',
    render: () => <Replay ctx={C['lang-label']} text="EN" />},
];

const KBD: Row[] = [
  {id: 'kbd-titlebar', title: '标题栏 · 快速搜索 Ctrl K', meta: 'KeyboardShortcut（SHORTCUT_KBD_CLASS：14px 高 9px 字）在粉色标题栏按钮里', source: 'useTitleBarActions.tsx:491 · 快照 42 组 / 84 键',
    render: () => <Replay ctx={C['kbd-titlebar']} labels={['搜索…', 'Ctrl', 'K']} />},
  {id: 'kbd-pagination', title: '表格分页 · 上一页 / 下一页 ← →', meta: 'KeyboardShortcut 在分页按钮里', source: 'DataTableView.tsx:531 / :550 · SearchPagination.tsx:53 · 快照 6 组',
    render: () => <Replay ctx={C['kbd-pagination']} labels={['←']} />},
  {id: 'kbd-nav-idle', title: '左侧导航 · 按住 Ctrl 时的序号键', meta: 'ShortcutKey（font-mono 11px bg-muted/80）在导航项右侧（快照未按 Ctrl，键是照源码补的）', source: 'AppNavMenuEntryItems.tsx:276–281 / :428–431 · AppNavMenuSections.tsx:196–199',
    render: () => <NavItem id="kbd-nav-idle" label="好友动态" k="2" />},
  {id: 'kbd-nav', title: '左侧导航 · 当前页（选中项）上的序号键', meta: '同上，但在选中的导航项上', source: '同上 · 选中项 data-active',
    render: () => <NavItem id="kbd-nav" label="活动" k="1" />},
  {id: 'kbd-sheet', title: '快捷键一览（抽屉）', meta: '默认 Kbd，深色弹层上（快照未采到）', source: 'KeyboardShortcutsDialog.tsx:96',
    render: () => <div data-slot="sheet-content" data-jk-target="" className="bg-popover text-popover-foreground w-72 p-3 text-sm"><ul>
      <li className="flex min-h-8 items-center justify-between gap-4 py-1.5 text-sm"><span className="min-w-0 font-medium">快速搜索</span><KeyboardShortcut keys={['Mod', 'K']} /></li>
      <li className="flex min-h-8 items-center justify-between gap-4 py-1.5 text-sm"><span className="min-w-0 font-medium">上一页</span><KeyboardShortcut keys="ArrowLeft" /></li>
    </ul></div>},
  {id: 'kbd-hint', title: '按住 Ctrl 的提示面板', meta: 'ShortcutKey：font-mono bg-muted/80（快照未采到）', source: 'ShortcutHintPanel.tsx:14–31',
    render: () => <div data-jk-target="" className={hintPanelClass}><div className="flex items-center gap-2 px-2 py-1 text-sm"><SearchIcon className="size-3.5" /><span className="flex-1">快速搜索</span><ShortcutKey keys={['Ctrl', 'K']} /></div></div>},
  {id: 'kbd-feed', title: '动态搜索下拉 · 回车搜全部', meta: '默认 Kbd，在下拉弹层底部（快照未采到）', source: 'FeedSearchBox.tsx:220–227',
    render: () => <div data-slot="combobox-content" data-jk-target="" className="bg-popover text-popover-foreground w-64"><div className="text-muted-foreground border-border/60 flex items-center gap-2 border-t px-2 py-1.5 text-xs"><SearchIcon className="size-3.5 shrink-0" /><span className="min-w-0 flex-1 truncate">搜索全部“某个词”</span><Kbd>⏎</Kbd></div></div>},
];

/* ---------- visibility board ---------- */
const SURFACES: {name: string; cls?: string; style: React.CSSProperties}[] = [
  {name: '深色列表 #201936', style: {background: '#201936'}},
  {name: '悬停行 #4a3784', style: {background: '#4a3784'}},
  {name: '标题栏 / 状态栏 #f8c6e3', cls: 'vrcx-0-statusbar', style: {background: '#f8c6e3', color: '#21132d'}},
  {name: '选中行 #ffb8e6', cls: 'bg-(--state-selected-surface)', style: {background: '#ffb8e6', color: '#16112a'}},
  {name: '缩略图上', style: {background: 'linear-gradient(135deg,#f6f1e4 0 25%,#7fb7d9 25% 50%,#2b2a33 50% 75%,#ffb8e6 75%)'}},
];
function Board() {
  return <div data-jk-target="" style={{display: 'grid', gap: 4, width: '100%'}}>
    {SURFACES.map((s) => <div key={s.name} className={s.cls} style={{...s.style, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, padding: '6px 8px', minHeight: 30, position: 'static', height: 'auto', width: 'auto'}}>
      <span style={{fontSize: 10, width: 92, flex: 'none', background: 'rgb(0 0 0/.55)', color: '#fff', padding: '0 3px'}}>{s.name}</span>
      <Badge>新</Badge><Badge variant="secondary">标签</Badge>
      <Badge variant="outline" className="text-muted-foreground font-normal tabular-nums">12</Badge>
      <Badge variant="destructive">封禁</Badge><KeyboardShortcut keys={['Mod', 'K']} />
    </div>)}
  </div>;
}
const BOARD: Row[] = [
  {id: 'board-main', title: '可见度测试板 · 主内容区里', meta: '同一组徽标与快捷键放在五种底色上（底色是示意色块，组件是应用的 Badge / KeyboardShortcut）', source: '虚构；容器取自主题页卡片（.vrcx-0-main-content 内）',
    render: () => <Replay ctx={C['tag-theme']} leaf={<Board />} />},
  {id: 'board-overlay', title: '可见度测试板 · 对话框/弹层里', meta: '同上，但不在主内容区：现状的徽标规则只管主内容区和侧栏', source: '虚构；无祖先',
    render: () => <div className="bg-popover text-popover-foreground w-full p-2"><Board /></div>},
];

function Pane({row, proposal}: {row: Row; proposal?: boolean}) {
  return <div className={'demo-pane' + (proposal ? ' jk-proposal' : '')}>{row.render()}</div>;
}
let counter = 0;
function Section({title, note, rows}: {title: string; note: string; rows: Row[]}) {
  return <section className="demo-section">
    <div className="demo-comparison-note"><strong>{title}</strong><p>{note}</p></div>
    <div className="demo-table">
      <div className="demo-table-head"><span>位置</span><span>现状</span><span>提案</span></div>
      {rows.map((r) => <div key={r.id} className="demo-row-compare" data-ctx={r.id}>
        <div className="demo-row-meta"><span className="demo-row-no">{String(++counter).padStart(2, '0')}</span><div><h2>{r.title}</h2><p>{r.meta}</p><p>{r.source}</p></div></div>
        <Pane row={r} />
        <Pane row={r} proposal />
      </div>)}
    </div>
  </section>;
}

// Decision cards reuse the existing components, fixture structures and paint recipes only.
const QUESTIONS = [
  {id: 'B1', title: '人数和数量，要不要有底色？', recommended: 'C', options: ['透明：只看数字，不铺底', '现有 outline 实心：小块更清楚', '更暗块：沿用收藏栏的深底']},
  {id: 'B2', title: '日志里，哪些信息需要跳出来？', recommended: 'A', options: ['全粉：级别和续行都一样', '仅 Error 酒红；+3 行用 outline', '再把 Info 变紫；Warning 保持粉']},
  {id: 'B3', title: '粉色底上的粉徽标，怎么区分？', recommended: 'B', options: ['保留粉：底和徽标接近', '品红：沿用粉色条上的强调色']},
  {id: 'B4', title: '快捷键要不要跟着底色换？', recommended: 'A', options: ['深浅两种：深底深键，粉底浅键', '全部深色：在哪都用深色键']},
  {id: 'B5', title: '地区和语言标签，要不要一起统一？', recommended: 'A', options: ['保持原样：保留各自现有外观', '并入徽标：地区用紫，语言用 outline']},
];
function ChoiceSample({question, option}: {question: string; option: string}) {
  const sample = (caption: string, children: React.ReactNode, pink = false) => <div className="choice-example"><small>{caption}</small><div className={'choice-surface' + (pink ? ' vrcx-0-statusbar' : '')} style={{background: pink ? '#f8c6e3' : '#201936', color: pink ? '#21132d' : '#e3d2f5'}}>{children}</div></div>;
  return <div className={`choice-samples jk-proposal choice-${question}-${option}`} inert>
    {question === 'B1' && <>{sample('深色列表', <><span>在线好友</span><Badge variant="outline" className="font-normal tabular-nums text-muted-foreground">12</Badge></>)}{sample('粉色选中行', <><span>云端收藏</span><Badge variant="outline" className="font-normal tabular-nums text-muted-foreground">8</Badge></>, true)}</>}
    {question === 'B2' && <div className="choice-log">{LOG.map(r => <div key={r.id} className="demo-pane">{r.render()}</div>)}</div>}
    {question === 'B3' && <>{sample('粉色标题栏 / 状态栏', <><span>主题状态</span><Badge><BadgeCheckIcon />使用中</Badge></>, true)}{sample('粉色选中行', <><span>示例项目</span><Badge>新</Badge></>, true)}</>}
    {question === 'B4' && <>{sample('深色列表 / 弹层', <><span>快速搜索</span><KeyboardShortcut keys={['Ctrl', 'K']} /></>)}{sample('粉色条 / 选中项', <><span>快速搜索</span><KeyboardShortcut keys={['Ctrl', 'K']} /></>, true)}</>}
    {question === 'B5' && LOOKALIKE.map(r => <div key={r.id} className={`choice-example choice-${r.id}`}><small>{r.id === 'region-chip' ? '服务器地区（真实 span）' : '好友语言（真实 span）'}</small><div className="demo-pane">{r.render()}</div></div>)}
  </div>;
}
function Choices() {
  const [selected, setSelected] = useState<Record<string, string>>({B1: 'C', B2: 'A', B3: 'B', B4: 'A', B5: 'A'});
  const [status, setStatus] = useState('');
  const summary = QUESTIONS.map(q => `${q.id}-${selected[q.id]}`).join(' ');
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setStatus('已复制'); }
    catch { const input = document.getElementById('choice-summary') as HTMLInputElement; input.focus(); input.select(); setStatus('请按 Ctrl+C 复制已选中的汇总'); }
  }
  return <section className="badge-choices" aria-label="徽标五项选择">
    <h1>先看实物，再选这五项</h1><p>整张卡都能点，圆点表示当前选择；“推荐”已默认选好。仅用于讨论，不修改主题。样例文字均为虚构。</p>
    {QUESTIONS.map(q => <fieldset key={q.id} className="choice-question" id={`choice-${q.id}`}><legend>{q.id} · {q.title}</legend><div className="choice-grid">
      {q.options.map((text, i) => { const letter = String.fromCharCode(65 + i); return <label key={letter} className="choice-card" data-selected={selected[q.id] === letter}>
        <div className="choice-card-heading"><input type="radio" name={q.id} value={letter} checked={selected[q.id] === letter} onChange={() => {setSelected(s => ({...s, [q.id]: letter})); setStatus('');}} /><strong>{letter} · {text}</strong>{letter === q.recommended && <span className="choice-recommended">推荐</span>}</div>
        <ChoiceSample question={q.id} option={letter} />
      </label>; })}
    </div></fieldset>)}
    <div className="choice-summary"><label htmlFor="choice-summary">你的选择（可复制发给我）</label><input id="choice-summary" readOnly value={summary} /><button type="button" onClick={copy}>复制选择</button><span role="status">{status}</span></div>
    <p>下方保留原有 28 行对照，右栏仍是固定推荐提案，不随选择卡变化。</p>
  </section>;
}

function App() {
  const [theme, setTheme] = useState(true);
  counter = 0;
  return <main className="demo-document">
    <Choices />
    <header className="demo-document-header">
      <div className="demo-eyebrow">BADGE / KBD · 现状 vs 提案</div>
      <h1>徽标与快捷键：挑现状里最通用的那一种</h1>
      <p>左边是当前主题，右边是提案。提案不画新东西：徽标统一成现状主内容区已有的“像素标签”（方角、1px 框、实心面、轻斜边 .28/.48，比按钮浅一档，不像能按），按 data-variant 分 4 种面色；快捷键保留现状两种键帽（深色键、粉色条上的浅色键），只是收成一套。每一行都是基线快照里真实存在的控件，连同真实祖先结构重建（只取结构，文字全是虚构）。行可以悬停，看徽标在行变色后是否还清楚。</p>
      <div className="demo-top-tools">
        <button className="demo-theme-toggle" onClick={() => { setTheme(!theme); (document.getElementById('merged-theme') as HTMLStyleElement).disabled = theme; }}>{theme ? '已应用合并主题 CSS' : '仅应用基础 CSS'} · 点击切换</button>
        <span>徽标不可点击：没有悬停/按下/动画。快捷键是“键”：凸起斜边（--jk-raised-pink），不随按钮按下。</span>
      </div>
    </header>
    <Section title="计数徽标（同一写法：outline + tabular-nums + 灰字）" rows={COUNT}
      note="源码里 5 处计数是一模一样的 Badge 写法，现状却画成 3 种：侧栏分组标题透明无框、同房间头等是 #211a33、收藏页是更暗的 #201936 + .12 斜边（favorites-r9.css:30）。按最终选择 B1-C，统一成收藏栏现有的暗块：面 #201936、1px 框、字 #d6b8ef、.12/.48 斜边。" />
    <Section title="标签与状态（secondary / default / destructive）" rows={LABEL}
      note="主内容区现状已经是这一套（buttons-badges-r10）：default 粉面 #ffb8e6 + 深字、secondary 紫面 #332650 + #6c5ce0 框、destructive 酒红 #3d1b35 + #ff6b8a 框（和危险按钮同色）、outline 见上。提案只是把它从“只管主内容区和侧栏”放宽到所有徽标：对话框、弹层里的徽标现状完全没有主题（还是应用原样的圆角药丸，见第 10 行和最后一行）。缩略图上的标签现状已是不透明实心面，保留。secondary 的框现状有两种：78 个是 #6c5ce0（--wd-frame，controls-r9.css:56 给主题页卡片），2 个是通用规则的 #8f7fe0；取多数的 #6c5ce0。" />
    <Section title="日志级别（default + 源码自带级别颜色）" rows={LOG}
      note="按最终选择 B2-A，Info/Warning/Error 级别与续行数都保持现状的全粉外观；不按日志语义类名增加额外换色。" />
    <Section title="角标（叠在图标上）" rows={CORNER}
      note="铃铛未读数是唯一叠在图标上的徽标：现状 badge-r9 已是方角深色小块 + 粉色内框，每 2.8 秒两帧反色闪一次（steps(2)），和按钮的两帧语言一致，且在粉色标题栏上对比 13:1。提案原样保留为特例。" />
    <Section title="外观相似、但不是徽标组件（只作参照）" rows={LOOKALIKE}
      note="这两种是手写 span，DOM 上没有 data-slot=badge，主题各自有专门皮肤（区域码：凸起紫面 + 粉字 + 切角；语言：用户已选的 01 BlackBerry/Pink）。提案不动它们；要不要并进徽标见报告里的问题。" />
    <Section title="快捷键（Kbd / KbdGroup）" rows={KBD}
      note="按最终选择 B4-A 保留现有两种键帽：默认深色；标题栏、状态栏、粉色选中行上用浅色。例外是第 23 行选中导航项的序号键，仍保持现状深色，不并入浅色规则。尺寸照应用原样。" />
    <Section title="可见度测试板" rows={BOARD}
      note="同一组徽标和快捷键放在五种底色上。注意右栏“粉色条 / 选中行”上的 default 徽标：粉面在粉底上会消失，提案按已定稿按钮层级二的做法，在这些粉色表面上把 default 徽标的面换成品红 #b0305f（--jk-bar-accent）。" />
    <footer className="demo-footer">结构数据：checks/badge-contexts.json（只含结构）。右侧提案对照：checks/badge-proposal.css；主题实现：runtime/badge.css。</footer>
  </main>;
}
createRoot(document.getElementById('preview-root')!).render(<App />);
