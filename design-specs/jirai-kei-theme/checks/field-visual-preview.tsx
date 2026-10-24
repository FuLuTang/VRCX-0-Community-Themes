// Field (input group / input / textarea / select trigger / combobox chips) preview:
// current theme | proposal (field-proposal.css), side by side. Every row that exists in the baseline
// fixtures is replayed inside its real ancestors (field-contexts.json, structure only, fictional labels).
// Uses the fixtures never captured (filled search box, textarea, visible file input, chips with tags, the
// disabled / invalid trigger) are built from the app's own components and class strings, placed inside a
// real captured container. Native inputs can be focused and typed into on both sides; a trigger expands on
// click; chip × removes the chip; "全部禁用" really disables every control so the disabled skin can be seen.
import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowUpDownIcon, ChevronDownIcon, SearchIcon, XIcon} from 'lucide-react';
import {Button} from '@/ui/shadcn/button';
import {Input} from '@/ui/shadcn/input';
import {InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea} from '@/ui/shadcn/input-group';
import {Replay, props, type Context, type Node} from './preview-replay';
import {icons} from 'lucide-react';
import contexts from './field-contexts.json';

const C = contexts as unknown as Record<string, Context>;

/** The captured element's content is replaced (its real ancestors stay). */
function Inside({ctx, children}: {ctx: Context; children: React.ReactNode}) {
  return <Replay ctx={ctx} leaf={React.createElement(ctx.element.tag, {...props(ctx.element.attrs), 'data-jk-target': ''}, children)} />;
}
/** The captured element's nearest ancestor becomes the container, `children` are placed inside it. */
const boxOf = (id: string): Context => {
  const c = C[id];
  return {...c, id: id + '-box', element: c.chain[c.chain.length - 1], chain: c.chain.slice(0, -1)};
};

/* preview-replay wraps the target in children, which a void <input> cannot take: same replay, void-safe.
   (An <input> can never be a container, so it only ever needs its own attributes + the ancestor chain.) */
const VOID = new Set(['img', 'input', 'br', 'hr']);
const pascal = (s: string) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
function IconNode({attrs}: {attrs: Record<string, string>}) {
  const names = (attrs.class || '').split(/\s+/).filter((c) => c.startsWith('lucide-')).map((c) => pascal(c.slice(7)));
  const Found = names.map((n) => (icons as Record<string, React.ComponentType<Record<string, unknown>>>)[n]).find(Boolean) || icons.Circle;
  return <Found {...props(attrs, true)} />;
}
function InnerNode({n, labels}: {n: Node; labels: string[]}): React.ReactElement {
  if (n.tag === 'svg') return <IconNode attrs={n.attrs} />;
  if (VOID.has(n.tag)) return React.createElement(n.tag, {...props(n.attrs), ...(n.tag === 'img' ? {alt: ''} : {}), ...(n.tag === 'input' ? {readOnly: true} : {})});
  const isText = ['span', 'kbd', 'p', 'h2', 'h3', 'label', 'button', 'a'].includes(n.tag) && !n.children?.length && !/(^|\s)(size-|rounded-full|sr-only)/.test(n.attrs.class || '');
  const kids = n.children?.length ? n.children.map((c, i) => <InnerNode key={i} n={c} labels={labels} />) : labels && isText ? labels.shift() ?? null : null;
  return React.createElement(n.tag, props(n.attrs), kids);
}
function SkeletonNode({n}: {n: Node}): React.ReactElement {
  if (n.tag === 'svg') return <IconNode attrs={n.attrs} />;
  const p = {...props(n.attrs, n.tag === 'svg'), 'data-jk-skeleton': ''};
  if (VOID.has(n.tag)) return React.createElement(n.tag, {...p, ...(n.tag === 'img' ? {alt: ''} : {}), ...(n.tag === 'input' ? {readOnly: true} : {})});
  return React.createElement(n.tag, p, ...(n.children || []).map((c, i) => <SkeletonNode key={i} n={c} />));
}
function ReplayVoid({ctx}: {ctx: Context}) {
  const e = ctx.element;
  const own: Record<string, unknown> = {...props(e.attrs), 'data-jk-target': ''};
  if (ctx.size) own.style = {...(own.style as object), width: ctx.size[0] + 'px', height: ctx.size[1] + 'px', flex: 'none'};
  const body = React.createElement(e.tag, own);
  const tree = ctx.chain.reduceRight<React.ReactNode>((inner, n) => React.createElement(n.tag, props(n.attrs),
    ...n.before.map((s, i) => <SkeletonNode key={'b' + i} n={s} />), inner, ...n.after.map((s, i) => <SkeletonNode key={'a' + i} n={s} />)), body);
  const inherit = Object.entries(ctx.inherit || {}).map(([k, v]) => `${k}:${v}`).join(';');
  const style = Object.fromEntries(inherit.split(';').filter((d) => d.includes(':')).map((d) => [d.split(':')[0].replace(/^-([a-z])/, (_, c) => c.toUpperCase()).replace(/-([a-z])/g, (_, c) => c.toUpperCase()), d.slice(d.indexOf(':') + 1).trim()]));
  return <div className="demo-body" {...(ctx.revealed === false ? {'data-jk-reveal': ''} : {})} style={style}>{tree}</div>;
}

/* class strings copied from the app sources (so the preview needs no new Tailwind utilities) */
// src/ui/shadcn/combobox.tsx:233
const CHIPS_BOX = 'border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:border-destructive flex min-h-8 flex-wrap items-center gap-1 rounded-lg border bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors has-data-[slot=combobox-chip]:px-1';
// src/ui/shadcn/combobox.tsx:255
const CHIP_KEY = 'bg-muted text-foreground flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap has-data-[slot=combobox-chip-remove]:pr-0';
// src/components/search/FriendMultiSelectList.tsx:139
const CHIP_DOT = 'bg-muted flex size-3.5 shrink-0 items-center justify-center overflow-hidden rounded-full';

/* ---------- the slot, built with the real component ---------- */
function Slot({value = '', disabled, invalid, clear, trailing, placeholder = ''}: {
  value?: string; disabled?: boolean; invalid?: boolean; clear?: boolean; trailing?: React.ReactNode; placeholder?: string;
}) {
  return <InputGroup data-vrcx-0-control="toolbar" className="vrcx-0-toolbar-control" style={{width: 256}}>
    <InputGroupAddon><SearchIcon /></InputGroupAddon>
    <InputGroupInput defaultValue={value} disabled={disabled} aria-invalid={invalid ? 'true' : undefined} placeholder={placeholder} />
    {(clear || trailing) && <InputGroupAddon align="inline-end" style={{gap: 4, paddingTop: 0, paddingBottom: 0}}>
      {clear && <Button type="button" variant="ghost" size="icon-xs" disabled={disabled} aria-label="清除"><XIcon /></Button>}
      {trailing}
    </InputGroupAddon>}
  </InputGroup>;
}

/* ---------- a select trigger built from the captured class string ---------- */
function Trigger({label, open, disabled, invalid}: {label: string; open?: boolean; disabled?: boolean; invalid?: boolean}) {
  const rest: Record<string, string> = {...C['st-toolbar'].element.attrs};
  for (const k of ['aria-expanded', 'aria-haspopup', 'disabled', 'style']) delete rest[k];
  if (invalid) rest['aria-invalid'] = 'true';
  return React.createElement('button', {...props(rest), type: 'button', 'aria-expanded': String(!!open), 'aria-haspopup': 'listbox', ...(disabled ? {disabled: true} : {})},
    <span className="flex min-w-0 items-center gap-2">
      <ArrowUpDownIcon className="text-muted-foreground size-4 shrink-0" />
      <span data-slot="select-value" style={{flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{label}</span>
    </span>,
    <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4" />
  );
}

/* ---------- a chips box with tags (source structure; no Base UI state needed) ---------- */
function Chips({tags}: {tags: string[]}) {
  return <div data-slot="combobox-chips" className={CHIPS_BOX} style={{width: 256}}>
    {tags.map((t) => <div key={t} data-slot="combobox-chip" className={CHIP_KEY}>
      <span className={CHIP_DOT}><span className="text-muted-foreground text-[9px]">甲</span></span>
      <span style={{maxWidth: 96, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{t}</span>
      <button type="button" data-slot="combobox-chip-remove" data-variant="ghost" data-size="icon-xs" aria-label={'移除 ' + t} className="-ml-1 size-6 opacity-50 hover:opacity-100"><XIcon className="size-3" /></button>
    </div>)}
    <input data-slot="combobox-chip-input" className="placeholder:text-muted-foreground min-w-16 flex-1 outline-none" placeholder="" />
  </div>;
}

type Row = {id: string; title: string; meta: string; source: string; render: () => React.ReactNode};

const GROUP: Row[] = [
  {id: 'ig-side', title: 'A 侧栏搜索框（空）', meta: 'h-7 · 258 宽 · 右侧只放一个放大镜', source: 'SidePanel.tsx:398–441（快照 37 处，几乎每页侧栏都有）',
    render: () => <Replay ctx={C['ig-side']} />},
  {id: 'ig-side-fill', title: 'A2 同一个侧栏框 · 有值', meta: '有值时右端多一个清除 ×：槽内小键，常态就是凸起的紫键，悬停只变亮，按下压下', source: 'SidePanel.tsx:421–435（快照里全是空值）',
    render: () => <Replay ctx={C['ig-side']} leaf={<div {...props(C['ig-side'].element.attrs)} data-jk-target="">
      <input data-slot="input-group-control" className="flex-1 rounded-none border-0 bg-transparent pl-2.5 text-xs ring-0 shadow-none" defaultValue="好友甲" />
      <div role="group" data-slot="input-group-addon" data-align="inline-end" className="text-muted-foreground flex h-auto items-center justify-center gap-2 py-1.5 pr-2 text-sm font-medium select-none">
        <Button type="button" variant="ghost" size="icon-xs" aria-label="清除"><XIcon /></Button>
      </div>
    </div>} />},
  {id: 'ig-toolbar', title: 'B 页面工具栏搜索框（空）', meta: 'h-8 · 左图标 · 右端空着', source: 'ToolbarControls.tsx:85–101（快照 21 处）',
    render: () => <Replay ctx={C['ig-toolbar']} />},
  {id: 'ig-toolbar-end', title: 'C 工具栏搜索框 + 过滤键', meta: 'h-8 · 槽右端一个过滤图标（槽内小键：常态凸起，悬停变亮，按下压下）', source: 'ToolbarControls.tsx:104–176',
    render: () => <Replay ctx={C['ig-toolbar-end']} />},
  {id: 'ig-feed', title: 'D feed 工具栏 · 按好友筛选（空）', meta: 'h-8 · 槽里嵌多选（chips 空）', source: 'FeedSearchBox.tsx:126–230（快照 6 处）',
    render: () => <Replay ctx={C['ig-feed']} />},
  {id: 'ig-search', title: 'E 搜索页大搜索框', meta: 'h-10 · 664 宽 · 同一个槽，只是更大', source: 'SearchControlBand.tsx',
    render: () => <Replay ctx={C['ig-search']} />},
  {id: 'ig-combobox', title: 'F 图表页 · 人物筛选', meta: 'h-8 · input 自己是 combobox，右端一个箭头小键（常态凸起、悬停变亮、按下压下；展开时整个槽出粉色焦点框、箭头变粉）', source: 'charts_two-person（input-group.tsx:64 → combobox.tsx:52）',
    render: () => <Replay ctx={C['ig-combobox']} />},
];

const STATES: Row[] = [
  {id: 'slot-states', title: 'G 四种状态（快照里没有）', meta: '空 / 有值 / 禁用 / 无效 · 点一下能看现状的 2px 粉色焦点框（离框 1px）', source: '结构取自 ToolbarControls.tsx 与 input-group.tsx',
    render: () => <div style={{display: 'grid', gap: 6, justifyItems: 'start'}}>
      <Slot />
      <Slot value="好友甲" clear />
      <Slot value="好友甲" disabled clear trailing={<Button type="button" variant="ghost" size="icon-xs" disabled><ChevronDownIcon /></Button>} />
      <Slot value="wrld_0000" invalid />
    </div>},
];

const INPUT: Row[] = [
  {id: 'in-charts', title: 'H 图表页 · 宽度输入', meta: 'h-8 · 独立输入框（不在组里）', source: 'charts / charts_mutual（快照 3 处）',
    render: () => <ReplayVoid ctx={C['in-charts']} />},
  {id: 'in-disabled', title: 'I 主题页 · 禁用的输入', meta: 'h-7 · 自定义主题名只读', source: 'themes / community-themes（快照 2 处）',
    render: () => <ReplayVoid ctx={C['in-disabled']} />},
  {id: 'in-color', title: 'J 主题页 · 颜色输入（禁用）', meta: '28×28 的小槽', source: 'community-themes（快照 2 处）',
    render: () => <ReplayVoid ctx={C['in-color']} />},
  {id: 'in-file', title: 'K 文件输入（快照里是 0×0 隐藏）', meta: '真可见的样子：槽 + 一个和 outline 按钮同款的选择文件键（悬停变亮、按下压下）', source: 'my-avatars / tools_gallery / tools_inventory（快照里 0×0）',
    render: () => <Inside ctx={boxOf('in-charts')}><Input type="file" style={{width: 224}} /></Inside>},
  {id: 'in-textarea', title: 'L 文本域（快照没采到）', meta: '组里的 textarea：槽被撑高，附件仍在槽内', source: 'input-group.tsx:133 · 用例 GroupPostEditorDialog.tsx:307',
    render: () => <Inside ctx={boxOf('in-charts')}><InputGroup style={{width: 288, height: 'auto', flexDirection: 'column', alignItems: 'stretch'}}>
      <InputGroupTextarea placeholder="" defaultValue={'第一行演示文字\n第二行演示文字'} />
      <InputGroupAddon align="inline-end"><span className="text-xs">0 / 200</span></InputGroupAddon>
    </InputGroup></Inside>},
];

const SELECT: Row[] = [
  {id: 'st-toolbar', title: 'M 工具栏 · 排序下拉', meta: 'h-8 · 左图标 + 文字，右端应用自带的箭头（同一个槽，不加分隔线）', source: 'FavoritesToolbar.tsx:117–148（快照 6 处）',
    render: () => <Replay ctx={C['st-toolbar']} />},
  {id: 'st-toolbar-open', title: 'N 同一个下拉 · 展开中', meta: '展开态：提案里用聚焦样式（2px 粉色 outline，离框 1px），箭头图标变粉', source: 'favorites-worlds-select-listbox（快照里 aria-expanded=true）',
    render: () => <Replay ctx={C['st-toolbar-open']} />},
  {id: 'st-popover', title: 'O 时间范围弹层 · 小时/分钟', meta: 'sm · h-7 · 64 宽的小下拉', source: 'DateTimeRangePicker.tsx:85–105（快照 4 处）',
    render: () => <Replay ctx={C['st-popover']} />},
  {id: 'st-page', title: 'P 页面工具栏 · 类型筛选', meta: 'sm · h-7 · 80 宽，只有文字和箭头', source: 'game-log / notification / social_friend_list（快照 3 处）',
    render: () => <Replay ctx={C['st-page']} />},
  {id: 'st-states', title: 'Q 下拉的其它状态', meta: '默认 / 展开（粉色焦点框 + 粉箭头）/ 禁用（.45）/ 无效 · 点一下切换展开', source: '快照只采到默认与展开',
    render: () => <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
      <Trigger label="默认" />
      <Trigger label="展开" open />
      <Trigger label="禁用" disabled />
      <Trigger label="无效" invalid />
    </div>},
];

const CHIPS_ROWS: Row[] = [
  {id: 'cb-feed', title: 'R feed 工具栏 · 多选标签框（空）', meta: '组里的 chips 自己不画框，只有外面那个槽（现状如此）', source: 'FeedSearchBox.tsx:133–147（快照 6 处）',
    render: () => <Replay ctx={C['cb-feed']} />},
  {id: 'cb-sheet', title: 'S 设置抽屉 · 独立多选标签框（空）', meta: '自己就是槽（有标签时会变高）：现状里它是发白的边 + 半透明底，这里统一成同一个槽', source: 'charts-mutual-settings-sheet（快照 1 处）',
    render: () => <Replay ctx={C['cb-sheet']} />},
  {id: 'cb-filled', title: 'T 有标签的多选框（快照里都是空的）', meta: '每个标签是缩小的 outline 按钮；里面的 × 是标签内的小键（16px，四周留 3px 标签面），三态和别处的槽内小键一致', source: 'ProfileDetailsFields.tsx:86–115 / FriendMultiSelectList.tsx:114–159',
    render: () => <Inside ctx={boxOf('cb-sheet')}><Chips tags={['好友甲', '好友乙']} /></Inside>},
];

function Pane({row, proposal}: {row: Row; proposal?: boolean}) {
  return <div className={'demo-pane' + (proposal ? ' jk-proposal' : '')}>{row.render()}</div>;
}
function Section({title, note, rows}: {title: string; note: string; rows: Row[]}) {
  let n = 0;
  return <section className="demo-section">
    <div className="demo-comparison-note"><strong>{title}</strong><p>{note}</p></div>
    <div className="demo-table">
      <div className="demo-table-head"><span>位置</span><span>现状</span><span>提案</span></div>
      {rows.map((r) => <div key={r.id} className="demo-row-compare" data-ctx={r.id}>
        <div className="demo-row-meta"><span className="demo-row-no">{String(++n).padStart(2, '0')}</span><div><h2>{r.title}</h2><p>{r.meta}</p><p>{r.source}</p></div></div>
        <Pane row={r} />
        <Pane row={r} proposal />
      </div>)}
    </div>
  </section>;
}

function App() {
  const [theme, setTheme] = useState(true), [frozen, setFrozen] = useState(false);
  // click: expand a select trigger (the arrow key stays pressed), remove a chip.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const trg = t.closest<HTMLButtonElement>('[data-slot="select-trigger"],[data-slot="combobox-trigger"]');
      if (trg && !trg.disabled) trg.setAttribute('aria-expanded', trg.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      const rm = t.closest<HTMLElement>('[data-slot="combobox-chip-remove"]');
      if (rm) rm.closest('[data-slot="combobox-chip"]')?.remove();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  // freeze: really disable every control on both sides, so the disabled skin is the app's own state
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>('.demo-pane input,.demo-pane textarea,.demo-pane button')];
    for (const el of els) {
      if (frozen) { if (!el.disabled) { el.dataset.jkEnabled = '1'; el.disabled = true; } }
      else if (el.dataset.jkEnabled) { el.disabled = false; delete el.dataset.jkEnabled; }
    }
  }, [frozen]);
  return <main className="demo-document">
    <header className="demo-document-header">
      <div className="demo-eyebrow">INPUT GROUP / INPUT / TEXTAREA / SELECT TRIGGER / COMBOBOX CHIPS · 现状 vs 提案</div>
      <h1>输入：只统一、不发明——取现状里最常见的那一种槽</h1>
      <p>左边是当前主题，右边是提案。提案不画任何新东西：把左边已经最常见的那个槽（输入组、下拉触发器、独立输入框的绝大多数都是它）原样套到还不一致的地方，槽里所有按钮是同一种小键：常态就是凸起的紫键，悬停只变亮，按下凹陷。每一行都是基线快照里真实存在的控件，连同真实祖先结构重建（只取结构，文字全是虚构）。点一下输入框能看到焦点框、Tab 能走进去（快照回放的输入框是只读的，只有“状态”那一行可以真的打字）；下拉框点一下会停在展开态；标签的 × 能删；“全部禁用”会把两边真的设成 disabled。把鼠标放在槽里的按钮上、按住，就能看到悬停与按下；下拉框点一下会出粉色焦点框。</p>
      <div className="demo-top-tools">
        <button className="demo-theme-toggle" onClick={() => { setTheme(!theme); (document.getElementById('merged-theme') as HTMLStyleElement).disabled = theme; }}>{theme ? '已应用合并主题 CSS' : '仅应用基础 CSS'} · 点击切换</button>
        <button className="demo-theme-toggle" onClick={() => setFrozen(!frozen)}>{frozen ? '恢复可编辑' : '全部禁用'}</button>
        <span>槽 = 现状最常见的那一种：底 #201936、1px #6c5ce0 框、方角、内阴影 #16112a / #a294c8；槽里的按钮全是同一种凸起小键。</span>
      </div>
    </header>
    <Section title="输入组（槽 + 槽内附件）" rows={GROUP}
      note="所有输入组共用现状里最常见的那一个槽：底 #201936、1px #6c5ce0 框（--wd-frame）、方角、内阴影 inset 1px 1px #16112a + inset -1px -1px #a294c8。输入文字自己不画第二个框。槽里的放大镜和 placeholder 是同一个淡紫（#b9add9，现状里本来就用它）；聚焦用现状的 2px 粉色 outline（#ff7fcf，离框 1px）。槽里的清除 / 过滤 / 日历 / 下拉箭头 / 多选 × 是同一种小键：常态就是凸起的紫键（面 #392a52、边 #100b1e、图标 #fff0fa，也就是原来悬停时的样子），悬停只把面变亮到 #4a3784（--wd-select，深度不变），按下凹陷并位移 1px 2px，菜单展开等同按下，两帧动画。combobox 展开时整个槽出 2px 粉色 outline，箭头小键图标变粉。" />
    <Section title="状态" rows={STATES}
      note="沿用现状已有的写法：禁用整槽 .45 透明度（和按钮、复选框一致）+ 文字 #b9add9，只在槽上乘一次，槽里的按钮不再叠一次；无效把框换成现状里本来给独立输入框用的 #ff6b8a（--jk-key-danger-edge），现在输入组、下拉、标签框也一样；聚焦是 2px 粉色 outline。除此之外没有新状态。" />
    <Section title="独立输入框与文本域" rows={INPUT}
      note="独立输入框、文本域、颜色输入、文件输入都是同一个槽（和输入组一模一样），组里的 textarea 不再画第二层框。placeholder 用现状的 #b9add9。文件输入在快照里是 0×0 的隐藏 input，这里让它可见，看 ::file-selector-button：和已定稿的 outline 按钮同款（面 --jk-key-dark、1px --wd-frame 框、--jk-raised，悬停变亮、按下压下）。" />
    <Section title="下拉选择触发器" rows={SELECT}
      note="下拉触发器就是同一个槽 + 应用自带的箭头图标，不加分隔线、不加小键；左边的图标和右边箭头用同一个淡紫。禁用 .45；无效红框；展开（aria-expanded=true 或 data-popup-open）用聚焦样式：2px 粉色 outline、离框 1px，右端箭头变粉。" />
    <Section title="多选标签框" rows={CHIPS_ROWS}
      note="标签框本身是同一个槽（现状里一个是发白的边 + 2px 圆角，一个是半透明底，这里统一）；工具栏里的 chips 不画第二层框，标签直接放进搜索框那个槽里。每个已选标签复用已定稿的 outline 按钮外观（面 --jk-key-dark、1px --wd-frame 框、--jk-raised），缩小到 24px 高；标签里的 × 是标签内的小键（16px，四周留 3px 标签面，不压标签边框、不超出标签高度；面 #392a52 比标签面 #211a33 亮，两者能分开），常态 / 悬停 / 按下和别处的槽内小键一致，只是尺寸小。" />
    <footer className="demo-footer">结构数据：checks/field-contexts.json（extract-preview-contexts.mjs 从基线快照提取，只有结构）。提案：checks/field-proposal.css（第 4 版：槽内小键常态凸起 · 标签 × 收进标签 · 下拉展开出焦点框 · 禁用 .45），只作用于右栏，尚未进入主题。</footer>
  </main>;
}
createRoot(document.getElementById('preview-root')!).render(<App />);
