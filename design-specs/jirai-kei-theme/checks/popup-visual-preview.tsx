// Popup preview (step ②, not in runtime): current theme (left) | proposal (right, class .jk-proposal, popup-proposal.css).
// Rows marked with a real snapshot id are replayed inside their captured ancestors (popup-contexts.json, structure only,
// fictional labels). Rows marked "照源码搭" are built from the app's own class strings (menubar.tsx, combobox.tsx,
// tooltip.tsx, dropdown-menu.tsx) because the baseline never captured those popups.
// The captured ancestors have their fixed/absolute positioning stripped (flow()): this changes placement only, never paint.
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {CheckIcon, ChevronRightIcon, HistoryIcon} from 'lucide-react';
import {Replay, props, type Context} from './preview-replay';
import contexts from './popup-contexts.json';

const RAW = contexts as unknown as Record<string, Context>;

// ---------- placement only: drop fixed/absolute/top/left from captured ancestors and targets ----------
const STRIP = /^(position|top|left|right|bottom|inset)$/;
const flowStyle = (s: string) =>
  s
    .split(';')
    .filter((d) => {
      const k = d.split(':')[0].trim();
      return !k || k.startsWith('--') || !STRIP.test(k);
    })
    .join(';');
const flowAttrs = (a: Record<string, string>) => (a.style ? {...a, style: flowStyle(a.style)} : a);
function flow(id: string): Context {
  const c = RAW[id];
  return {
    ...c,
    chain: c.chain.map((n) => ({...n, attrs: flowAttrs(n.attrs)})),
    element: {...c.element, attrs: flowAttrs(c.element.attrs)},
  };
}

// ---------- building blocks ----------
const cls = (id: string) => RAW[id].element.attrs.class;
const childCls = (id: string, i: number) => RAW[id].element.children?.[i]?.attrs.class ?? '';

/** The captured element itself (its own class and attributes), children supplied here. */
function Real({id, kids}: {id: string; kids?: React.ReactNode}) {
  const e = RAW[id].element;
  return React.createElement(e.tag, {...props(e.attrs), 'data-jk-target': ''}, kids ?? null);
}

type SynProps = {tag?: string; cls?: string; attrs?: Record<string, string>; target?: boolean; kids?: React.ReactNode; text?: string};
/** A synthetic element built from source class strings. */
function Syn({tag = 'div', cls: c, attrs = {}, target = false, kids, text}: SynProps) {
  const p: Record<string, unknown> = {...attrs};
  if (c) p.className = c;
  if (target) p['data-jk-target'] = '';
  return React.createElement(tag, p, kids ?? null, text ?? null);
}

// Source class strings (照源码搭).
const MENUBAR_CONTENT =
  'dark text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 bg-popover/70 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-destructive! relative w-auto min-w-36 animate-none! rounded-lg p-1 shadow-md ring-1 duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150';
const MENUBAR_CHECK =
  'focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-7 [&_svg]:pointer-events-none [&_svg]:shrink-0';
const MENUBAR_IND = 'pointer-events-none absolute left-1.5 flex size-4 items-center justify-center';
const DD_IND = 'pointer-events-none absolute right-2 flex items-center justify-center';
const SHORTCUT = 'text-muted-foreground group-focus/menubar-item:text-accent-foreground ml-auto text-xs tracking-widest';
const LABEL = 'text-muted-foreground px-1.5 py-1 text-xs font-medium data-inset:pl-7';
const SEP = 'bg-border -mx-1 my-1 h-px';
const COMBO_CONTENT =
  'dark group/combobox-content text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 bg-popover/70 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 relative max-h-(--available-height) w-(--anchor-width) min-w-(--anchor-width) origin-(--transform-origin) animate-none! overflow-hidden rounded-lg shadow-md ring-1 duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150';
const COMBO_ITEM =
  'data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0';
const COMBO_LABEL = 'text-muted-foreground px-2 py-1.5 text-xs';

const ddGroup = (kids: React.ReactNode) => <Syn attrs={{role: 'group', 'data-slot': 'dropdown-menu-group'}} kids={kids} />;
const ddSep = () => <Syn cls={SEP} attrs={{role: 'separator', 'data-slot': 'dropdown-menu-separator', 'data-orientation': 'horizontal'}} />;
const ddItem = (text: string, extra: Record<string, string> = {}) => (
  <Syn cls={cls('dd-item')} attrs={{'data-slot': 'dropdown-menu-item', 'data-variant': 'default', ...extra}} text={text} />
);
const ddDestructive = (text: string, extra: Record<string, string> = {}) => (
  <Syn cls={cls('dd-item')} attrs={{'data-slot': 'dropdown-menu-item', 'data-variant': 'destructive', ...extra}} text={text} />
);
const ddCheck = (text: string, on: boolean, extra: Record<string, string> = {}) => (
  <Syn
    cls={cls('dd-check-on')}
    attrs={{role: 'menuitemcheckbox', 'data-slot': 'dropdown-menu-checkbox-item', 'aria-checked': String(on), ...(on ? {'data-checked': ''} : {'data-unchecked': ''}), ...extra}}
    kids={
      <>
        <Syn cls={DD_IND} attrs={{'data-slot': 'dropdown-menu-checkbox-item-indicator'}} kids={on ? <CheckIcon /> : null} />
        {text}
      </>
    }
  />
);
const ctxItem = (text: string, extra: Record<string, string> = {}) => (
  <Syn cls={cls('ctx-item')} attrs={{'data-slot': 'context-menu-item', 'data-variant': 'default', ...extra}} text={text} />
);
// Checkmark side for the P4 choice cards only (inline styles, no DOM change). Source: dropdown/context/select right, menubar left.
type Side = 'left' | 'right';
function ckRow(kind: 'dd' | 'menubar', text: string, on: boolean, side: Side) {
  const dd = kind === 'dd';
  const pad: React.CSSProperties = side === 'left' ? {paddingLeft: 26, paddingRight: 8} : {paddingLeft: 8, paddingRight: 26};
  const pos: React.CSSProperties = {top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, ...(side === 'left' ? {left: 6, right: 'auto'} : {right: 6, left: 'auto'})};
  return (
    <div
      role="menuitemcheckbox"
      aria-checked={on}
      data-slot={dd ? 'dropdown-menu-checkbox-item' : 'menubar-checkbox-item'}
      {...(on ? {'data-checked': ''} : {'data-unchecked': ''})}
      className={dd ? cls('dd-check-on') : MENUBAR_CHECK}
      style={pad}
    >
      <div data-slot={dd ? 'dropdown-menu-checkbox-item-indicator' : 'menubar-checkbox-item-indicator'} className={dd ? DD_IND : MENUBAR_IND} style={pos} aria-hidden="true">
        {on ? <CheckIcon size={14} /> : null}
      </div>
      {text}
    </div>
  );
}

const selLabel = (text: string) => <Syn cls={childCls('select-item', 0)} text={text} />;
const selItem = (text: string, selected = false) =>
  selected ? (
    <Syn
      cls={cls('select-item-2')}
      attrs={{role: 'option', 'data-slot': 'select-item', 'aria-selected': 'true', 'data-selected': '', 'data-highlighted': ''}}
      kids={
        <>
          {selLabel(text)}
          <Syn cls={childCls('select-item-2', 1)} attrs={{'data-selected': '', 'aria-hidden': 'true'}} kids={<CheckIcon />} />
        </>
      }
    />
  ) : (
    <Syn cls={cls('select-item')} attrs={{role: 'option', 'data-slot': 'select-item', 'aria-selected': 'false'}} kids={selLabel(text)} />
  );

// ---------- real snapshot rows (16 ids in popup-contexts.json) ----------
type RealRow = {id: string; title: string; note: string; render: () => React.ReactNode};
const REAL: RealRow[] = [
  {
    id: 'dd-content', title: '下拉菜单 · 外框（分组、项、分隔线）',
    note: 'DropdownMenuContent（dropdown-menu.tsx:59）。快照 2 个：账户菜单、工具操作菜单。',
    render: () => (
      <Replay ctx={flow('dd-content')} leaf={<Real id="dd-content" kids={<>{ddGroup(<>{ddItem('虚构选项 A')}{ddItem('虚构选项 B')}</>)}{ddSep()}{ddGroup(ddItem('虚构选项 C'))}</>} />} />
    ),
  },
  {id: 'dd-item', title: '下拉菜单 · 普通项', note: 'DropdownMenuItem（dropdown-menu.tsx:91）。快照 1 个。', render: () => <Replay ctx={flow('dd-item')} text="虚构选项 A" />},
  {id: 'dd-check-on', title: '下拉菜单 · 勾选项（已勾）', note: 'DropdownMenuCheckboxItem（dropdown-menu.tsx:114），勾选标在右侧。快照 1 个。', render: () => <Replay ctx={flow('dd-check-on')} text="虚构开关 · 已勾选" />},
  {id: 'dd-check-off', title: '下拉菜单 · 勾选项（未勾）', note: '同上，未勾选时不出现勾形。快照 1 个（账户菜单内 3 项未勾）。', render: () => <Replay ctx={flow('dd-check-off')} text="虚构开关 · 未勾选" />},
  {id: 'dd-check-hl', title: '下拉菜单 · 勾选项（高亮）', note: '快照里这一项被鼠标悬停（data-highlighted）。图标为源快照原样。', render: () => <Replay ctx={flow('dd-check-hl')} text="虚构开关 · 高亮" />},
  {id: 'dd-check-plain', title: '下拉菜单 · 勾选项（工具页，普通）', note: '工具操作菜单里同款勾选项的普通态。', render: () => <Replay ctx={flow('dd-check-plain')} text="虚构选项 · 普通" />},
  {id: 'dd-separator', title: '下拉菜单 · 分隔线', note: 'DropdownMenuSeparator（dropdown-menu.tsx:204）。现状是点线，源码是 bg-border 1px。', render: () => <Replay ctx={flow('dd-separator')} />},
  {
    id: 'dd-sub-trigger', title: '下拉菜单 · 子菜单触发项', note: 'DropdownMenuSubTrigger（dropdown-menu.tsx:238）。右侧箭头 ChevronRight。快照 1 个。',
    render: () => <Replay ctx={flow('dd-sub-trigger')} leaf={<Real id="dd-sub-trigger" kids={<><HistoryIcon className="mr-2 size-4" />虚构子菜单<ChevronRightIcon className="ml-auto" /></>} />} />,
  },
  {
    id: 'ctx-content', title: '右键菜单 · 外框与分组',
    note: 'ContextMenuContent（context-menu.tsx:85）。快照 1 个：通知右键菜单。',
    render: () => <Replay ctx={flow('ctx-content')} leaf={<Real id="ctx-content" kids={<>{Syn({attrs: {role: 'group', 'data-slot': 'context-menu-group'}, kids: <>{ctxItem('虚构动作 A')}{ctxItem('虚构动作 B')}</>})}</>} />} />,
  },
  {id: 'ctx-item', title: '右键菜单 · 普通项', note: 'ContextMenuItem（context-menu.tsx:108）。', render: () => <Replay ctx={flow('ctx-item')} text="虚构动作" />},
  {
    id: 'select-content', title: '选择列表 · 外框（含 4 个选项）',
    note: 'SelectContent（select.tsx:85）。快照 1 个：收藏页的地点下拉。第 2 个选项是已选且高亮。',
    render: () => <Replay ctx={flow('select-content')} leaf={<Real id="select-content" kids={<Syn attrs={{role: 'listbox'}} kids={<>{selItem('虚构地点 A')}{selItem('虚构地点 B', true)}{selItem('虚构地点 C')}{selItem('虚构地点 D')}</>} />} />} />,
  },
  {id: 'select-item', title: '选择列表 · 普通选项', note: 'SelectItem（select.tsx:125）。', render: () => <Replay ctx={flow('select-item')} leaf={<Real id="select-item" kids={selLabel('虚构地点 A')} />} />},
  {
    id: 'select-item-2', title: '选择列表 · 已选且高亮选项', note: '已选时右侧出现勾形（ItemIndicator，select.tsx:135）。',
    render: () => <Replay ctx={flow('select-item-2')} leaf={<Real id="select-item-2" kids={<>{selLabel('虚构地点 B')}<Syn cls={childCls('select-item-2', 1)} attrs={{'data-selected': '', 'aria-hidden': 'true'}} kids={<CheckIcon />} /></>} />} />,
  },
  {
    id: 'popover-content', title: '气泡面板 · 外框（日期范围弹层）',
    note: 'PopoverContent（popover.tsx:41）。快照 1 个。日历本体不在本套范围，此处只画外框与虚构按钮。',
    render: () => (
      <Replay ctx={flow('popover-content')} leaf={<Real id="popover-content" kids={<><Syn cls="px-3 pt-3 pb-2 text-sm font-medium" text="虚构时间段" /><Syn cls="flex justify-end gap-2 px-3 pb-3" kids={<Syn tag="button" attrs={{'data-slot': 'button', 'data-variant': 'outline', type: 'button'}} cls="h-7 px-2 text-xs" text="虚构确定" />} /></>} />} />
    ),
  },
  {
    id: 'hovercard-content', title: '悬停卡片 · 外框与内容',
    note: 'HoverCardContent（hover-card.tsx:43）。快照 1 个。头像为纯色块占位。',
    render: () => (
      <Replay ctx={flow('hovercard-content')} leaf={<Real id="hovercard-content" kids={<Syn cls="flex flex-col gap-2" kids={<><div style={{width: 40, height: 40, background: '#6c5ce0'}} /><Syn cls="text-sm font-medium" text="虚构用户名" /><Syn cls="text-xs text-muted-foreground" text="虚构简介一行" /></>} />} />} />
    ),
  },
  {
    id: 'tooltip-content', title: '提示气泡 · 短提示',
    note: 'TooltipContent（tooltip.tsx:54）。源码是反色 bg-foreground / text-background。快照 1 个。',
    render: () => (
      <Replay ctx={flow('tooltip-content')} leaf={<Real id="tooltip-content" kids={<><div className={childCls('tooltip-content', 0)} />虚构提示文字</>} />} />
    ),
  },
];

// ---------- synthetic rows (照源码搭；快照未采到，未经快照验证) ----------
const MenubarFrame = () => (
  <div className="demo-body syn-menu">
    <Syn cls={MENUBAR_CONTENT} attrs={{role: 'menu', 'data-slot': 'menubar-content', 'data-side': 'bottom', 'data-open': ''}} kids={
      <>
        <Syn cls={LABEL} attrs={{'data-slot': 'menubar-label'}} text="虚构分组" />
        <Syn cls={cls('dd-item')} attrs={{'data-slot': 'menubar-item', 'data-variant': 'default'}} kids={<><span>虚构命令 A</span><Syn cls={SHORTCUT} attrs={{'data-slot': 'menubar-shortcut'}} text="Ctrl K" /></>} />
        <Syn cls={cls('dd-item')} attrs={{'data-slot': 'menubar-item', 'data-variant': 'default', 'data-highlighted': ''}} text="虚构命令 B（高亮）" />
        <Syn cls={MENUBAR_CHECK} attrs={{role: 'menuitemcheckbox', 'data-slot': 'menubar-checkbox-item', 'data-checked': '', 'aria-checked': 'true'}} kids={<><Syn cls={MENUBAR_IND} kids={<CheckIcon />} /><span>虚构开关 · 已勾选</span></>} />
        <Syn cls={SEP} attrs={{role: 'separator', 'data-slot': 'menubar-separator'}} />
        <Syn cls={cls('dd-sub-trigger')} attrs={{'data-slot': 'menubar-sub-trigger', 'aria-haspopup': 'menu', 'aria-expanded': 'false'}} kids={<><span>虚构子菜单</span><ChevronRightIcon className="ml-auto" /></>} />
        <Syn cls={cls('dd-item')} attrs={{'data-slot': 'menubar-item', 'data-variant': 'destructive'}} text="虚构删除" />
      </>
    } />
  </div>
);

const ComboFrame = () => (
  <div className="demo-body syn-combo">
    <Syn cls={COMBO_CONTENT} attrs={{'data-slot': 'combobox-content', role: 'presentation', 'data-side': 'bottom'}} kids={
      <>
        <Syn cls={COMBO_LABEL} attrs={{'data-slot': 'combobox-label'}} text="虚构分组" />
        <Syn cls={COMBO_ITEM + ' pr-8'} attrs={{role: 'option', 'data-slot': 'combobox-item', 'data-selected': ''}} kids={<><Syn cls={DD_IND} attrs={{'data-selected': '', 'aria-hidden': 'true'}} kids={<CheckIcon />} /><span>虚构地点 C</span></>} />
        <Syn cls={COMBO_ITEM} attrs={{role: 'option', 'data-slot': 'combobox-item', 'data-highlighted': ''}} text="虚构地点 D（高亮）" />
        <Syn cls={COMBO_ITEM} attrs={{role: 'option', 'data-slot': 'combobox-item', 'data-disabled': '', 'aria-disabled': 'true'}} text="虚构地点 E（禁用）" />
        <Syn cls={SEP} attrs={{role: 'separator', 'data-slot': 'combobox-separator'}} />
        <Syn cls={COMBO_LABEL} attrs={{'data-slot': 'combobox-label'}} text="虚构分组 2" />
      </>
    } />
  </div>
);

const StatusTooltip = () => (
  <div className="demo-body">
    <div className="vrcx-0-statusbar" data-vrcx-0-surface="statusbar" style={{position: 'relative', padding: 8, minHeight: 40}}>
      <button type="button" data-slot="tooltip-trigger" data-popup-open="" className="text-xs">虚构状态</button>
      <div data-slot="tooltip-content" data-side="top" className="flex flex-col gap-1 text-xs" style={{display: 'inline-flex', marginLeft: 8}}>
        <div className="flex flex-col gap-1 text-xs"><span>虚构服务器 · 在线</span><span>虚构连接 · 正常</span></div>
      </div>
    </div>
  </div>
);

// Visibility board: every state of one menu item, on the captured frame, current | proposal.
const STATES: Array<{id: string; title: string; render: () => React.ReactNode}> = [
  {id: 'syn-state-normal', title: '状态 · 普通', render: () => ddItem('虚构选项 · 普通')},
  {id: 'syn-state-hl', title: '状态 · 悬停 / 键盘高亮', render: () => ddItem('虚构选项 · 高亮', {'data-highlighted': ''})},
  {id: 'syn-state-disabled', title: '状态 · 禁用', render: () => <Syn cls={cls('dd-item')} attrs={{'data-slot': 'dropdown-menu-item', 'data-variant': 'default', 'data-disabled': '', 'aria-disabled': 'true'}} text="虚构选项 · 禁用" />},
  {id: 'syn-state-danger', title: '状态 · 危险项（平时）', render: () => ddDestructive('虚构删除 · 普通')},
  {id: 'syn-state-danger-hl', title: '状态 · 危险项（高亮）', render: () => ddDestructive('虚构删除 · 高亮', {'data-highlighted': ''})},
  {id: 'syn-state-check-hl', title: '状态 · 勾选项（已勾 + 高亮）', render: () => ddCheck('虚构开关 · 已勾 + 高亮', true, {'data-highlighted': ''})},
  {id: 'syn-state-sub-open', title: '状态 · 子菜单已展开', render: () => <Syn cls={cls('dd-sub-trigger')} attrs={{'data-slot': 'dropdown-menu-sub-trigger', 'aria-expanded': 'true', 'data-popup-open': ''}} kids={<>虚构子菜单（展开）<ChevronRightIcon className="ml-auto" /></>} />},
];

// ---------- 请你选择 ----------
type Opt = {id: string; label: string; desc: string; proposal: boolean; sample: React.ReactNode};
type Question = {key: string; title: string; ask: string; rec: string; opts: Opt[]};

const frameSample = (items: React.ReactNode) => (
  <Syn cls={cls('dd-content')} attrs={{role: 'menu', 'data-slot': 'dropdown-menu-content', 'data-side': 'bottom', 'data-open': ''}} kids={items} />
);
const QUESTIONS: Question[] = [
  {
    key: 'P1', title: 'P1 · 菜单项被悬停或键盘选中时，高亮用什么形状？', rec: 'A',
    ask: '现在是斜切粉条（去掉了定稿要求的方角）。方角粉条与按钮、列表行的选中键同一个形状，推荐 A。',
    opts: [
      {id: 'A', label: '方角粉条（推荐）', desc: '定稿粉色键面 + 凸起边，去掉斜切。', proposal: true,
        sample: <div className="jk-proposal">{frameSample(<>{ddItem('虚构选项 A')}{ddItem('虚构选项 B · 高亮', {'data-highlighted': ''})}{ddItem('虚构选项 C · 禁用', {'data-disabled': '', 'aria-disabled': 'true'})}</>)}</div>},
      {id: 'B', label: '斜切粉条（现状）', desc: '现行 popups-r9 的斜切粉条，不改。', proposal: false,
        sample: <div>{frameSample(<>{ddItem('虚构选项 A')}{ddItem('虚构选项 B · 高亮', {'data-highlighted': ''})}{ddItem('虚构选项 C · 禁用', {'data-disabled': '', 'aria-disabled': 'true'})}</>)}</div>},
    ],
  },
  {
    key: 'P2', title: 'P2 · 提示气泡（tooltip）用暗面，还是反色浅粉？', rec: 'A',
    ask: '源码里 tooltip 是反色（tooltip.tsx:56），popover 与悬停卡片是 bg-popover，同一套暗面。提示只是短字，与菜单区分开更好认，推荐 A。代价是比暗面醒目。',
    opts: [
      {id: 'A', label: '浅粉反色（推荐）', desc: '与源码反色意图一致，用定稿粉色键面。', proposal: true,
        sample: <div className="jk-proposal"><Syn cls={cls('tooltip-content')} attrs={{'data-slot': 'tooltip-content', 'data-side': 'bottom', 'data-open': ''}} kids={<>虚构提示文字</>} /></div>},
      {id: 'B', label: '暗面（现状）', desc: '与菜单同一个暗紫面，现行 overlays-r10。', proposal: false,
        sample: <div><Syn cls={cls('tooltip-content')} attrs={{'data-slot': 'tooltip-content', 'data-side': 'bottom', 'data-open': ''}} kids={<>虚构提示文字</>} /></div>},
    ],
  },
  {
    key: 'P3', title: 'P3 · 菜单里的分隔线，用实线还是点线？', rec: 'A',
    ask: '定稿说“所有可见分隔线都是 1px 实线”，只把下拉菜单分隔线交给弹层决定。现在是点线，推荐 A 与其它分隔线一致。',
    opts: [
      {id: 'A', label: '1px 实线（推荐）', desc: '框色实线，与全站分隔线一致。', proposal: true,
        sample: <div className="jk-proposal">{frameSample(<>{ddItem('虚构选项 A')}{ddSep()}{ddItem('虚构选项 B')}</>)}</div>},
      {id: 'B', label: '点线（现状）', desc: '现行 popups-r9 的点线。', proposal: false,
        sample: <div>{frameSample(<>{ddItem('虚构选项 A')}{ddSep()}{ddItem('虚构选项 B')}</>)}</div>},
    ],
  },
  {
    key: 'P4', title: 'P4 · 勾选标记放在哪一边？', rec: 'A',
    ask: '源码里下拉、右键、选择列表的勾在右边（dropdown-menu.tsx:124、context-menu.tsx:181、select.tsx:137），菜单条的勾在左边，左侧留出 pl-7（menubar.tsx:126–135）。两边本来就不一样。推荐 A：各按源码，不挪位置。',
    opts: [
      {id: 'A', label: '各按源码（推荐）', desc: '下拉与右键的勾在右，菜单条的勾在左。', proposal: false,
        sample: <div className="popup-ck-pair">{frameSample(<>{ckRow('dd', '虚构开关 · 已勾', true, 'right')}{ddItem('虚构选项')}</>)}<div className="syn-menu"><Syn cls={MENUBAR_CONTENT} attrs={{role: 'menu', 'data-slot': 'menubar-content', 'data-side': 'bottom', 'data-open': ''}} kids={<>{ckRow('menubar', '虚构开关 · 已勾', true, 'left')}<Syn cls={cls('dd-item')} attrs={{'data-slot': 'menubar-item', 'data-variant': 'default'}} text="虚构命令" /></>} /></div></div>},
      {id: 'B', label: '全部在右', desc: '菜单条的勾也挪到右边，三处统一。', proposal: false,
        sample: <div className="popup-ck-pair">{frameSample(<>{ckRow('dd', '虚构开关 · 已勾', true, 'right')}{ddItem('虚构选项')}</>)}<div className="syn-menu"><Syn cls={MENUBAR_CONTENT} attrs={{role: 'menu', 'data-slot': 'menubar-content', 'data-side': 'bottom', 'data-open': ''}} kids={<>{ckRow('menubar', '虚构开关 · 已勾', true, 'right')}<Syn cls={cls('dd-item')} attrs={{'data-slot': 'menubar-item', 'data-variant': 'default'}} text="虚构命令" /></>} /></div></div>},
      {id: 'C', label: '全部在左（经典 Win98）', desc: '下拉与右键的勾挪到左边，与菜单条一致。', proposal: false,
        sample: <div className="popup-ck-pair">{frameSample(<>{ckRow('dd', '虚构开关 · 已勾', true, 'left')}{ddItem('虚构选项')}</>)}<div className="syn-menu"><Syn cls={MENUBAR_CONTENT} attrs={{role: 'menu', 'data-slot': 'menubar-content', 'data-side': 'bottom', 'data-open': ''}} kids={<>{ckRow('menubar', '虚构开关 · 已勾', true, 'left')}<Syn cls={cls('dd-item')} attrs={{'data-slot': 'menubar-item', 'data-variant': 'default'}} text="虚构命令" /></>} /></div></div>},
    ],
  },
  {
    key: 'P5', title: 'P5 · 危险项（如删除）被悬停时，用什么颜色？', rec: 'A',
    ask: '源码里危险项的悬停是淡红底（dropdown-menu.tsx:95、context-menu.tsx:112，焦点态为 bg-destructive/10），与普通项的悬停不同色。现状是和普通项一样的粉条，而且字色被源码的 text-destructive! 压成 #ff6b8a，压在粉底上几乎看不清（对比约 1.7:1）。推荐 A：用定稿危险按钮同款的深酒红面，浅粉字，与普通粉条一眼区分。',
    opts: [
      {id: 'A', label: '深酒红面（推荐）', desc: '与危险按钮同款（button.css:57–61），字为浅粉。', proposal: true,
        sample: <div className="jk-proposal">{frameSample(<>{ddItem('虚构选项 · 普通')}{ddDestructive('虚构删除 · 高亮', {'data-highlighted': ''})}</>)}</div>},
      {id: 'B', label: '粉条（现状）', desc: '粉条同普通悬停（popups-r9.css:36），字色却是 #ff6b8a，看不清。', proposal: false,
        sample: <div>{frameSample(<>{ddItem('虚构选项 · 普通')}{ddDestructive('虚构删除 · 高亮', {'data-highlighted': ''})}</>)}</div>},
    ],
  },
];

function Choices() {
  const [pick, setPick] = useState<Record<string, string>>(() => Object.fromEntries(QUESTIONS.map((q) => [q.key, q.rec])));
  const [copied, setCopied] = useState(false);
  const summary = QUESTIONS.map((q) => `${q.key} ${pick[q.key]}`).join(' · ');
  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      const e = document.getElementById('popup-choice-summary') as HTMLInputElement;
      e.focus();
      e.select();
      setCopied(false);
    }
  }
  return (
    <section className="popup-choices">
      <h2>请你选择</h2>
      <p>五个问题，每题各选项都按真实外框或源码类名画出来（照源码搭的会标出）。下方“提案”栏现在按推荐项画；要换，点卡片后告诉我。</p>
      {QUESTIONS.map((q) => (
        <div className="popup-choice-q" key={q.key}>
          <h3>{q.title}</h3>
          <p>{q.ask}</p>
          <div className="popup-choice-grid">
            {q.opts.map((o) => {
              const on = pick[q.key] === o.id;
              return (
                <button
                  type="button"
                  key={o.id}
                  aria-pressed={on}
                  className={'popup-choice-card' + (on ? ' is-chosen' : '')}
                  onClick={() => {
                    setPick((s) => ({...s, [q.key]: o.id}));
                    setCopied(false);
                  }}
                >
                  <strong>{o.id} · {o.label}</strong>
                  <span>{o.desc}</span>
                  <span className="popup-choice-sample">{o.sample}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="popup-choice-summary">
        汇总：<input id="popup-choice-summary" readOnly value={summary} />
        <button type="button" onClick={copy}>{copied ? '已复制' : '复制'}</button>
      </div>
    </section>
  );
}

// Layout only (no colour): the synthetic rows use source class strings whose Tailwind utilities the fixture CSS does not generate.
const PAGE_CSS = `
.popup-choices{margin:16px 0;padding:16px;border:1px solid #6c5ce0;background:#201936;color:#f2ebff;font:13px/1.5 sans-serif}
.popup-choices>h2{margin:0 0 6px;font-size:18px;color:#ffd9ee}
.popup-choices>p{margin:0 0 10px;color:#b9add9}
.popup-choice-q{margin-top:18px;padding-top:12px;border-top:1px solid #392a52}
.popup-ck-pair{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start}
.popup-ck-pair>*{min-width:150px}
.popup-choice-q h3{margin:0 0 4px;font-size:14px;color:#ffd9ee}
.popup-choice-q>p{margin:0 0 8px;color:#b9add9;font-size:12px}
.popup-choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.popup-choice-card{display:flex;flex-direction:column;gap:6px;padding:10px;text-align:left;border:1px solid #6c5ce0;background:#211a33;color:#f2ebff;box-shadow:inset 1px 1px #e3d2f5,inset -1px -1px #4b3a63;cursor:pointer;font:inherit;border-radius:0}
.popup-choice-card.is-chosen{outline:2px solid #ff7fcf;outline-offset:1px}
.popup-choice-card strong{font-size:13px;color:#ffd9ee}
.popup-choice-card>span:not(.popup-choice-sample){font-size:12px;color:#b9add9}
.popup-choice-sample{display:block;padding:8px;background:#16112a;min-height:60px}
.popup-choice-summary{margin-top:16px;font-size:13px}
.popup-choice-summary input{width:280px;margin:0 8px;padding:2px 6px;background:#16112a;color:#f2ebff;border:1px solid #6c5ce0;font:inherit}
.popup-choice-summary button{padding:2px 10px;background:#ffb8e6;color:#16112a;border:1px solid #6c5ce0;font:inherit;cursor:pointer;border-radius:0}
`;

const SYN_LAYOUT = `
#preview-root#preview-root#preview-root#preview-root .syn-menu [data-slot$="-item"],#preview-root#preview-root#preview-root#preview-root .syn-menu [data-slot$="-checkbox-item"],#preview-root#preview-root#preview-root#preview-root .syn-menu [data-slot$="-sub-trigger"],#preview-root#preview-root#preview-root#preview-root .syn-combo [data-slot$="-item"]{display:flex!important;align-items:center;gap:6px;padding:4px 6px;position:relative}
#preview-root#preview-root#preview-root#preview-root .syn-menu [data-slot$="-checkbox-item"]{padding-left:28px}
#preview-root#preview-root#preview-root#preview-root .syn-menu [data-slot$="-checkbox-item"] > div:first-child,#preview-root#preview-root#preview-root#preview-root .syn-combo [data-slot$="-item"] > div:first-child{position:absolute!important;left:6px;top:50%;transform:translateY(-50%);width:16px;height:16px;display:flex!important;align-items:center;justify-content:center}
#preview-root#preview-root#preview-root#preview-root .syn-combo [data-slot$="-item"]{padding-right:28px}
#preview-root#preview-root#preview-root#preview-root .syn-combo [data-slot$="-item"] > div:first-child{left:auto;right:6px}
#preview-root#preview-root#preview-root#preview-root .syn-menu [data-slot="menubar-shortcut"],#preview-root#preview-root#preview-root#preview-root .syn-menu .ml-auto{margin-left:auto;font-size:12px;letter-spacing:.1em}
#preview-root#preview-root#preview-root#preview-root .syn-menu svg,#preview-root#preview-root#preview-root#preview-root .syn-combo svg{width:14px;height:14px;flex:none}
#preview-root#preview-root#preview-root#preview-root .syn-menu [data-slot="menubar-label"],#preview-root#preview-root#preview-root#preview-root .syn-combo [data-slot="combobox-label"]{display:block!important;padding:4px 6px}
#preview-root#preview-root#preview-root#preview-root .syn-menu [data-slot="menubar-separator"],#preview-root#preview-root#preview-root#preview-root .syn-combo [data-slot="combobox-separator"]{display:block!important;height:1px;margin:4px -4px}
`;

// ---------- rows ----------
function Row({id, title, note, render}: {id: string; title: string; note: string; render: () => React.ReactNode}) {
  return (
    <div className="demo-row-compare" data-ctx={id}>
      <div className="demo-row-meta"><div><h2>{title}</h2><p>{note}</p></div></div>
      {[false, true].map((proposal) => (
        <div className={'demo-pane' + (proposal ? ' jk-proposal' : '')} key={String(proposal)}>{render()}</div>
      ))}
    </div>
  );
}

function App() {
  React.useEffect(() => {
    const st = document.createElement('style');
    st.id = 'popup-syn-layout';
    st.textContent = SYN_LAYOUT;
    document.head.appendChild(st);
    const pg = document.createElement('style');
    pg.id = 'popup-page-css';
    pg.textContent = PAGE_CSS;
    document.head.appendChild(pg);
    return () => { st.remove(); pg.remove(); };
  }, []);
  return (
    <main className="demo-document">
      <header className="demo-document-header">
        <div className="demo-eyebrow">POPUP · 第②步调查 · 未进入 runtime</div>
        <h1>弹层：菜单、选择列表、气泡统一到一套外框与高亮</h1>
        <p>左栏为冻结快照当前主题；右栏为提案。外框统一为现行的同一套暗面框（popups-r9.css:4–17）；菜单项高亮、危险项、提示气泡、分隔线、勾选位置各有一个待选项（共五题），见最上方“请你选择”。</p>
        <p>所有可见文字均为虚构；头像为纯色块；快照里只采到 1–2 个的弹层用源码类名照搭，已标注“照源码搭”。</p>
      </header>
      <Choices />
      <section className="demo-section">
        <h2>真实用法（快照采到的节点）</h2>
        <div className="demo-table">
          <div className="demo-table-head"><span>真实用法</span><span>现状</span><span>提案</span></div>
          {REAL.map((r) => <Row key={r.id} id={r.id} title={r.title} note={r.note} render={r.render} />)}
        </div>
      </section>
      <section className="demo-section">
        <h2>菜单条展开、组合框列表、状态提示（照源码搭，未经快照验证）</h2>
        <Row id="syn-menubar" title="菜单条 · 展开菜单（MenubarContent）" note="menubar.tsx:76–97。快照里菜单条的展开菜单没有采到，类名取自源码。" render={() => <MenubarFrame />} />
        <Row id="syn-combobox" title="组合框 · 选项列表（ComboboxContent）" note="combobox.tsx:87–120。快照里 combobox-content 没有采到，类名取自源码。" render={() => <ComboFrame />} />
        <Row id="syn-statusbar-tooltip" title="状态栏 · 堆叠提示（特例）" note="popups-r9 里 body:has(.vrcx-0-statusbar …) 的特例。快照只有一个普通提示，本行照源码结构搭。" render={() => <StatusTooltip />} />
      </section>
      <section className="demo-section">
        <h2>可见度检查：同一个菜单项的各种状态（照源码搭）</h2>
        {STATES.map((s) => <Row key={s.id} id={s.id} title={s.title} note="同一个菜单外框与项，只换状态属性。文字与勾形必须看得清。" render={() => frameSample(s.render())} />)}
      </section>
      <footer className="demo-footer">
        {REAL.length} 个快照节点 + 3 个照源码搭的整体样例 + 7 个状态样例。预览仅供审阅；不修改应用或正式主题。
      </footer>
    </main>
  );
}

createRoot(document.getElementById('preview-root')!).render(<App />);
