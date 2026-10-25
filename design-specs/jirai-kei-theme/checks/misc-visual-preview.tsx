// Misc preview: decision cards (M1–M3) on top, then the 8-row current | proposal comparison.
// M1 is a per-position comparison: every place a separator really occurs in the snapshots, replayed in its
// real ancestors with its real neighbours, side by side as the solid line and the dotted line the theme already has.
// Decision samples use the app's own components (Pagination*, Empty*) or replayed snapshot nodes inside real
// replayed ancestors (misc-contexts.json, structure only); option paints are scoped .choice-Mx-y classes in
// misc-proposal.css, copied from rules the theme already has. All visible words are fictional.
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {InboxIcon, icons} from 'lucide-react';
import {Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from '@/ui/shadcn/pagination';
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from '@/ui/shadcn/empty';
import {Replay, props, type Context, type Node} from './preview-replay';
import contexts from './misc-contexts.json';

const C = contexts as unknown as Record<string, Context>;
const rows = [
  ['sep', 'M1 分隔线', '27 个，横竖两向；工具栏有可见样式差异。'],
  ['pagination', 'M2 分页', '3 个导航实例；快照里分页链路未出现。'],
  ['empty', 'M3 空状态', '5 个容器、12 个标题/说明/图标部件。'],
  ['spinner', 'M4 加载圈', '1 个 slot spinner + 1 个 animate-spin 图标。'],
  ['field', 'M5 表单标签与说明', '28 个 label/description；登录页 error 是独立状态。'],
  ['resize', 'M6 可拖动分隔条', '8 个实例、3 种渲染指纹。'],
  ['scroll', 'M7 滚动条', 'Base UI 4 个节点；另有原生全局滚动条。'],
  ['toast', 'M8 Toast', '42 个 viewport；冻结快照无可见通知实例。'],
] as const;

/* ---------- decision samples ---------- */
/* ---------- M1: separator positions ---------- */
// LineReplay = Replay (preview-replay.tsx), except that the separator's own parent keeps its real layout and
// shows its real neighbouring children (structure from the snapshot, fictional words), so the line is seen in
// place. Ancestors above it are laid out as stacked blocks ([data-m1-flat], layout only, misc-proposal.css).
const pascal = (x: string) => x.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const VOID = new Set(['img', 'input', 'br', 'hr']);
const isTextLeaf = (n: Node) => ['span', 'kbd', 'p', 'h2', 'h3', 'label', 'button', 'a'].includes(n.tag) && !n.children?.length && !/(^|\s)(size-|rounded-full|sr-only)/.test(n.attrs.class || '');
function Live({n, q}: {n: Node; q: string[]}): React.ReactElement {
  if (n.tag === 'svg') {
    const Found = (n.attrs.class || '').split(/\s+/).filter(c => c.startsWith('lucide-')).map(c => (icons as Record<string, React.ComponentType<Record<string, unknown>>>)[pascal(c.slice(7))]).find(Boolean) || icons.Circle;
    return <Found {...props(n.attrs, true)} />;
  }
  if (VOID.has(n.tag)) return React.createElement(n.tag, {...props(n.attrs), ...(n.tag === 'img' ? {alt: ''} : {}), ...(n.tag === 'input' ? {readOnly: true} : {})});
  const kids = n.children?.length ? n.children.map((c, i) => <Live key={i} n={c} q={q} />) : isTextLeaf(n) ? q.shift() ?? null : null;
  return React.createElement(n.tag, props(n.attrs), kids);
}
function Skel({n}: {n: Node}): React.ReactElement {
  const p = {...props(n.attrs, n.tag === 'svg'), 'data-jk-skeleton': ''};
  if (VOID.has(n.tag)) return React.createElement(n.tag, p);
  return React.createElement(n.tag, p, ...(n.children || []).map((c, i) => <Skel key={i} n={c} />));
}
function LineReplay({ctx, labels, keep = [1, 1]}: {ctx: Context; labels: string[]; keep?: [number, number]}) {
  const q = [...labels];
  const last = ctx.chain.length - 1;
  const own = {...props(ctx.element.attrs), 'data-jk-target': ''};
  const tree = ctx.chain.reduceRight<React.ReactNode>((inner, n, i) => {
    const open = i === last;
    const before = n.before.map((c, j) => open && j >= n.before.length - keep[0] ? <Live key={'b' + j} n={c} q={q} /> : <Skel key={'b' + j} n={c} />);
    const after = n.after.map((c, j) => open && j < keep[1] ? <Live key={'a' + j} n={c} q={q} /> : <Skel key={'a' + j} n={c} />);
    return React.createElement(n.tag, {...props(n.attrs), ...(open ? {} : {'data-m1-flat': ''})}, ...before, inner, ...after);
  }, React.createElement(ctx.element.tag, own));
  const inherit = Object.fromEntries(Object.entries(ctx.inherit || {}).map(([k, v]) => [k.startsWith('-webkit-') ? 'Webkit' + pascal(k.slice(8)) : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v]));
  return <div className="m1-body" style={inherit}>{tree}</div>;
}
type Spot = {id: string; ctx: string; title: string; where: string; purpose: string; now: string; solid: string; dotted: string; hidden?: boolean; labels: string[]; keep?: [number, number]; check?: boolean};
// Every place [data-slot=separator] occurs in the 42 snapshots (tools/slot-census.mjs separator: 27 instances, 4 render fingerprints).
const SPOTS: Spot[] = [
  {id: 'toolbar', ctx: 'm1-toolbar', check: true, title: '① 页面工具栏里的竖线', where: '活动页、历史实例页的工具栏（快照里 2 根，看得见）',
    purpose: '把工具栏左边的“标签切换”和右边的按钮隔开。', now: '现状：1px 实线 #6c5ce0（主题的点线规则特意绕开了工具栏）。样例取自活动页。',
    solid: 'A、C', dotted: 'B', labels: ['今天', '本周']},
  {id: 'history', ctx: 'm1-history', check: true, title: '② 浏览历史里每天标题右边的横线', where: '浏览历史页的时间轴（含“时间范围”弹窗那张快照，共 6 根）',
    purpose: '每一天的日期标题后面拉出的一条横线，把不同的日子分开。', now: '现状：#8c71b0 的 2px 一段的点线（browse-history-r9.css:34 单独一条规则），比 B 的点稍长。',
    solid: 'A', dotted: 'B、C', labels: ['某一天']},
  {id: 'sheet', ctx: 'm1-sheet', check: true, title: '③ 图表设置抽屉里的分节横线', where: '共同好友图表右侧滑出的“设置”抽屉（2 根）',
    purpose: '把抽屉顶部的三格统计和下面的各个设置分节隔开。', now: '现状：1px 实线 #6c5ce0（抽屉不在主内容区里，点线规则管不到它）。',
    solid: 'A', dotted: 'B、C', labels: ['12', '虚构甲', '34', '虚构乙', '56', '虚构丙', '示例分节', '示例滑块', '50', '虚构说明文字。']},
  {id: 'toggle', ctx: 'sep', hidden: true, title: '④ 切换组按钮之间的竖线', where: '活动、游戏日志、动态、我的模型等工具栏的图标切换组，以及主题、背包页的切换组（共 17 根）',
    purpose: '切换组里每两个按钮之间本来有一根线。', now: '现状：主题把它整根隐藏（toggle-group.css:13），按钮直接贴在一起。这一处 A、B、C 都看不到线，列出来只为说明它不受这题影响。样例取自社区主题页。',
    solid: '—', dotted: '—', labels: ['网格', '列表', '紧凑'], keep: [12, 12]},
];
function LineRows({pick}: {pick: string}) {
  return <div className="m1-rows" inert>
    {SPOTS.map(sp => {
      const ctx = C[sp.ctx];
      const pane = (kind: 'solid' | 'dotted') => { const who = kind === 'solid' ? sp.solid : sp.dotted; const on = who.includes(pick);
        return <div className="m1-side" data-pick={!sp.hidden && on}>
          <small>{kind === 'solid' ? 'A 实线 · 1px #6c5ce0' : 'B 点线 · #8c71b0 1px 点'}{sp.hidden ? '（被隐藏）' : `　选 ${who} 时用这个`}{!sp.hidden && on ? ' ✓' : ''}</small>
          <div className={`demo-pane m1-${kind}`}><LineReplay ctx={ctx} labels={sp.labels} keep={sp.keep} /></div>
        </div>; };
      return <div className="m1-row" id={`m1-${sp.id}`} key={sp.id} {...(sp.check ? {'data-ctx': sp.ctx} : {})}>
        <div className="m1-meta">
          <h3>{sp.title}</h3>
          <p><b>在哪：</b>{sp.where}</p>
          <p><b>做什么：</b>{sp.purpose}</p>
          <p className="m1-now">{sp.now}</p>
          <small>快照原样（现状）</small>
          <div className="demo-pane m1-current"><LineReplay ctx={ctx} labels={sp.labels} keep={sp.keep} /></div>
        </div>
        {pane('solid')}{pane('dotted')}
      </div>;
    })}
  </div>;
}
// Pagination: the shadcn PaginationLink pieces (the app ships them; DataTable itself only shows "‹ 1 / N ›"),
// placed in the real DataTablePagination ancestors (game-log).
const Pager = () => <Pagination data-jk-target="" className="mx-0 w-auto justify-start"><PaginationContent>
  <PaginationItem><PaginationPrevious href="#" text="" aria-label="上一页" /></PaginationItem>
  <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
  <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
  <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
  <PaginationItem><PaginationNext href="#" text="" aria-label="下一页" /></PaginationItem>
</PaginationContent></Pagination>;
// Empty: the favorites groups page variant with an icon (className "min-h-48 px-4" from favorites_groups).
const EmptyBox = () => <Empty data-jk-target="" className="min-h-48 px-4" style={{width: 340}}>
  <EmptyHeader><EmptyMedia variant="icon"><InboxIcon /></EmptyMedia><EmptyTitle>暂无内容</EmptyTitle><EmptyDescription>这个虚构分组里还没有收藏任何东西。</EmptyDescription></EmptyHeader>
</Empty>;

type Q = {id: string; title: string; plain: string; surface: string; recommended: string; initial: string; options: {label: string; effect: string}[]; sample?: () => React.ReactNode; below?: (pick: string) => React.ReactNode};
const QUESTIONS: Q[] = [
  {id: 'M1', title: '分隔线：全部实线还是全部点线', recommended: 'A', initial: 'A', surface: '',
    plain: '应用里真正画出分隔线的地方一共下面这几处。现在是混着的：工具栏和设置抽屉是实线，浏览历史是点线。下面每一处都并排放了两种线：左边 A 实线（工具栏现在用的 1px #6c5ce0），右边 B 点线（主题里主内容区已有的 #8c71b0 1px 点线）。都是快照里的真实位置和真实邻居，只是文字换成虚构的。（下拉菜单里的分隔线是另一个组件，现在已经是点线，不在这题里。）',
    options: [
      {label: '全部用实线', effect: '三处看得见的线都是 1px 实线 #6c5ce0：工具栏、抽屉不变，浏览历史的日期线由点线变实线。全站一种线，工具栏不再需要例外。'},
      {label: '全部用点线', effect: '三处都用 #8c71b0 的 1px 点线：工具栏、抽屉由实线变点线，浏览历史的 2px 段点变成更细的 1px 点。线整体更轻。'},
      {label: '工具栏实线、其余点线', effect: '就是上一版 M1-B：工具栏保留实线，浏览历史和抽屉用点线（抽屉会由实线变点线）。主题里要留一条工具栏例外。'},
    ],
    below: (pick: string) => <LineRows pick={pick} />},
  {id: 'M2', title: '分页的当前页', recommended: 'A', initial: 'B', surface: '主内容区表格分页条底色 #201936',
    plain: '一排页码里“当前在第几页”怎么表示。注意：应用的数据表格目前只显示“上一页 1 / N 下一页”，带数字的页码键（下面这种）组件里有、但还没页面用到，这题是给它定个规矩。',
    options: [
      {label: '用已定稿按钮的粉色按下键', effect: '当前页像被按住的粉键（深色内阴影、右下沉 1px），和按钮按下的样子一致，一眼看出“这页已选”。'},
      {label: '保持现状', effect: '当前页还是亮色斜边的粉色凸起块，看起来更像一个还能再按的普通键。'},
    ],
    sample: () => <Replay ctx={C['pagination']} leaf={<Pager />} />},
  {id: 'M3', title: '空状态的外框', recommended: 'A', initial: 'A', surface: '主内容区底色 #201936（收藏页分组栏）',
    plain: '列表里什么都没有时显示的“暂无内容”。现在主内容区里它没有外框，只在标题下面有一条点线。要不要外面加一圈轻虚线框？（应用在对话框里本来就给空状态加了 border 虚线。）',
    options: [
      {label: '维持现在较轻的边框', effect: '不加外框，只保留标题下的点线，最安静，不会在列表里多出一个框。'},
      {label: '轻虚线框', effect: '外面多一圈 1px 虚线 #70518f，空白区域的边界更清楚，但页面里会多一个框。'},
    ],
    sample: () => <Replay ctx={C['empty']} leaf={<EmptyBox />} />},
];

function Choices() {
  const [selected, setSelected] = useState<Record<string, string>>(Object.fromEntries(QUESTIONS.map(q => [q.id, q.initial])));
  const [status, setStatus] = useState('');
  const summary = QUESTIONS.map(q => `${q.id}-${selected[q.id]}`).join(' ');
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setStatus('已复制'); }
    catch { const input = document.getElementById('choice-summary') as HTMLInputElement; input.focus(); input.select(); setStatus('请按 Ctrl+C 复制已选中的汇总'); }
  }
  return <section className="misc-choices" aria-label="零散小件三项选择">
    <h1>请你选择：先看实物，再选这三项</h1>
    <p>整张卡都能点，圆点表示当前选择。默认已按你上次的选择选好 M2-B、M3-A；M1 换成了新题目，默认选推荐的 A。每个样例都是应用的真实组件，放在它真实会出现的底色和祖先结构里；只用于讨论，不修改主题。样例文字均为虚构。</p>
    {QUESTIONS.map(q => <fieldset key={q.id} className="choice-question" id={`choice-${q.id}`}>
      <legend>{q.id} · {q.title}</legend>
      <p className="choice-plain">{q.plain}</p>
      <div className="choice-grid">
        {q.options.map((o, i) => { const letter = String.fromCharCode(65 + i); return <label key={letter} className="choice-card" data-selected={selected[q.id] === letter}>
          <div className="choice-card-heading"><input type="radio" name={q.id} value={letter} checked={selected[q.id] === letter} onChange={() => {setSelected(s => ({...s, [q.id]: letter})); setStatus('');}} /><strong>{letter} · {o.label}</strong>{letter === q.recommended && <span className="choice-recommended">推荐</span>}</div>
          <p className="choice-effect">{o.effect}</p>
          {q.sample && <div className={`choice-samples choice-${q.id}-${letter}`} inert>
            <small>{q.surface}</small>
            <div className="demo-pane">{q.sample()}</div>
          </div>}
        </label>; })}
      </div>
      {q.below?.(selected[q.id])}
    </fieldset>)}
    <div className="choice-summary"><label htmlFor="choice-summary">你的选择（可复制发给我）</label><input id="choice-summary" readOnly value={summary} /><button type="button" onClick={copy}>复制选择</button><span role="status">{status}</span></div>
    <p>下方保留原有 8 行对照，右栏仍是探索性提案，不随选择卡变化。</p>
  </section>;
}

function App() {
  return <main className="demo-document">
    <Choices />
    <header className="demo-document-header"><div className="demo-eyebrow">MISC · 第②步调查 · 未进入 runtime</div><h1>零散小件：Win98 细节收敛检查</h1><p>左栏重放冻结快照当前元素，右栏为 token 驱动的提案覆盖。个人数据/真实文案均已移除；分页和 Toast 的快照没有可见实例，须以后续实际 DOM 复核。文字示例均为虚构。</p></header>
    <section className="demo-section"><div className="demo-table"><div className="demo-table-head"><span>组件 / 现状摘要</span><span>现状</span><span>提案</span></div>
      {rows.map(([id, title, note]) => <div className="demo-row-compare" data-ctx={id} key={id}>
        <div className="demo-row-meta"><div><h2>{title}</h2><p>{note}</p></div></div>
        {[false, true].map(p => <div className={'demo-pane' + (p ? ' jk-proposal' : '')} key={String(p)}><Replay ctx={C[id]} labels={['虚构项目', '无匹配结果', '虚构说明', '示意内容']} /></div>)}
      </div>)}
    </div></section>
    <footer className="demo-footer">以下提案尚未写入正式主题。M2 分页 / M8 Toast 不具备快照可见 DOM，不能将虚构演示冒充真实命中；M7 原生滚动条的伪元素不会由普通 fixture 节点忠实重建。</footer>
  </main>;
}
createRoot(document.getElementById('preview-root')!).render(<App />);
