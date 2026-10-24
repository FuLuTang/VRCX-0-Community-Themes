// Choice controls (checkbox / switch / slider / radio) preview: current theme | proposal
// (choice-proposal.css), side by side. Every row is a real control from the baseline fixtures,
// replayed inside its real ancestors (choice-contexts.json, structure only, fictional labels).
// Checkboxes and switches are interactive on both sides (click or Space/Enter); sliders are real
// Slider components and can be dragged. States the fixtures never captured (checked, dialog radio)
// are built from the app components / their source structure.
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {CheckIcon} from 'lucide-react';
import {Slider} from '@/ui/shadcn/slider';
import {Replay, props, type Context, type Node} from './preview-replay';
import contexts from './choice-contexts.json';

const C = contexts as unknown as Record<string, Context>;

/* ---------- interactive replays ---------- */
function Cbx({ctx, initial = false, disabled = false}: {ctx: Context; initial?: boolean; disabled?: boolean}) {
  const [on, setOn] = useState(initial);
  const flip = () => { if (!disabled) setOn(!on); };
  const from = ctx.element.attrs['data-slot'] === 'checkbox' ? ctx.element.attrs : {...ctx.element.attrs, class: BASE_CHECK, 'data-slot': 'checkbox'};
  const a: Record<string, string> = {...from};
  for (const k of ['aria-checked', 'data-checked', 'data-unchecked', 'data-disabled', 'disabled', 'tabindex', 'role', 'data-size', 'data-orientation']) delete a[k];
  const extra: Record<string, unknown> = {
    'data-jk-target': '', role: 'checkbox', tabIndex: disabled ? -1 : 0, 'aria-checked': String(on),
    [on ? 'data-checked' : 'data-unchecked']: '', onClick: flip,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } },
  };
  if (disabled) Object.assign(extra, {'data-disabled': '', 'aria-disabled': 'true'});
  return <Replay ctx={ctx} leaf={<span {...props(a)} {...extra}>
    <span data-slot="checkbox-indicator" aria-hidden="true"><CheckIcon /></span>
  </span>} />;
}

function Sw({ctx, initial = false, disabled = false}: {ctx: Context; initial?: boolean; disabled?: boolean}) {
  const [on, setOn] = useState(initial);
  const flip = () => { if (!disabled) setOn(!on); };
  const from = ctx.element.attrs['data-slot'] === 'switch' ? ctx.element.attrs : {...ctx.element.attrs, class: BASE_SWITCH};
  const a: Record<string, string> = {...from};
  for (const k of ['aria-checked', 'data-checked', 'data-unchecked', 'data-disabled', 'disabled', 'tabindex', 'role', 'data-size', 'data-orientation']) delete a[k];
  a['data-size'] = 'default';
  const t: Record<string, string> = {...(ctx.element.attrs['data-slot'] === 'switch' ? ctx.element.children?.[0]?.attrs || {} : {class: BASE_THUMB})};
  for (const k of ['data-checked', 'data-unchecked']) delete t[k];
  const extra: Record<string, unknown> = {
    'data-jk-target': '', role: 'switch', tabIndex: disabled ? -1 : 0, 'aria-checked': String(on),
    [on ? 'data-checked' : 'data-unchecked']: '', onClick: flip,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } },
  };
  if (disabled) Object.assign(extra, {'data-disabled': '', 'aria-disabled': 'true'});
  return <Replay ctx={ctx} leaf={<span {...props(a)} {...extra}>
    <span {...props(t)} {...{[on ? 'data-checked' : 'data-unchecked']: ''}} />
  </span>} />;
}

const findInput = (n: Node): Node | null => (n.attrs?.['aria-valuenow'] !== undefined ? n : (n.children || []).map(findInput).find(Boolean) || null);
function SliderRow({ctx, disabled = false, interactive = true}: {ctx: Context; disabled?: boolean; interactive?: boolean}) {
  if (!interactive) return <Replay ctx={ctx} />;
  const input = findInput(ctx.element);
  const at = input?.attrs || {};
  const a: Record<string, string> = {...ctx.element.attrs};
  for (const k of ['class', 'role', 'data-slot', 'id', 'aria-labelledby']) delete a[k];
  const w = ctx.size?.[0] || 240;
  return <Replay ctx={ctx} leaf={<Slider {...a} className="w-full" style={{width: w + 'px', flex: 'none'}}
    min={Number(at.min ?? 0)} max={Number(at.max ?? 100)} step={Number(at.step ?? 1)}
    defaultValue={[Number(at['aria-valuenow'] ?? 50)]} disabled={disabled} data-jk-target="" />} />;
}

/* Dialog radio: not in the fixtures; structure follows src/components/hosts/system-dialogs/DataDirMigrationDialog.tsx:206–252
   (Base UI Radio.Root → span[role=radio] with an Indicator child), inside the dialog box of src/ui/shadcn/dialog.tsx. */
function RadioRow({disabled = false}: {disabled?: boolean}) {
  const [sel, setSel] = useState(0);
  const modes = ['迁移到新目录', '继续使用当前目录', '稍后处理'];
  return <div role="dialog" data-slot="dialog-content" className="bg-popover text-popover-foreground ring-foreground/10 grid w-full gap-4 rounded-xl p-4 text-sm ring-1 outline-none">
    <div data-slot="dialog-header" className="flex flex-col gap-2"><h2 data-slot="dialog-title" className="font-heading text-base leading-none font-medium">选择数据目录</h2></div>
    <div role="radiogroup" aria-label="数据目录" className="grid gap-2">
      {modes.map((m, i) => <label key={m} className={'flex cursor-pointer items-start gap-3 rounded-md border p-3 ' + (sel === i ? 'border-primary bg-primary/5' : '')}>
        <span role="radio" tabIndex={disabled ? -1 : 0} aria-checked={String(sel === i)} {...(sel === i ? {'data-checked': ''} : {'data-unchecked': ''})}
          onClick={() => { if (!disabled) setSel(i); }}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!disabled) setSel(i); } }}
          className="border-input data-checked:border-primary data-checked:bg-primary focus-visible:ring-ring mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border">
          <span className="bg-primary-foreground size-1.5 rounded-full" />
        </span>
        <span className="min-w-0 space-y-1"><span className="block font-medium">{m}</span><span className="text-muted-foreground block text-xs leading-relaxed">演示用说明文字，不含真实数据。</span></span>
      </label>)}
    </div>
  </div>;
}

/* ---------- blown-up detail: the same DOM without the captured ancestors, so a 14px box can be read ---------- */
const BASE_CHECK = 'peer border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3';
const BASE_SWITCH = C['sw-field-on'].element.attrs.class;
const BASE_THUMB = C['sw-field-on'].element.children?.[0]?.attrs.class || '';
function RawCbx({initial = false, disabled = false}: {initial?: boolean; disabled?: boolean}) {
  const [on, setOn] = useState(initial);
  const flip = () => { if (!disabled) setOn(!on); };
  return <span className={BASE_CHECK} data-slot="checkbox" role="checkbox" tabIndex={disabled ? -1 : 0} aria-checked={String(on)}
    {...(on ? {'data-checked': ''} : {'data-unchecked': ''})} {...(disabled ? {'data-disabled': '', 'aria-disabled': 'true'} : {})}
    onClick={flip} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } }}>
    <span data-slot="checkbox-indicator" aria-hidden="true"><CheckIcon /></span>
  </span>;
}
function RawSw({initial = false, disabled = false}: {initial?: boolean; disabled?: boolean}) {
  const [on, setOn] = useState(initial);
  const flip = () => { if (!disabled) setOn(!on); };
  return <span className={BASE_SWITCH} data-slot="switch" data-size="default" role="switch" tabIndex={disabled ? -1 : 0} aria-checked={String(on)}
    {...(on ? {'data-checked': ''} : {'data-unchecked': ''})} {...(disabled ? {'data-disabled': '', 'aria-disabled': 'true'} : {})}
    onClick={flip} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } }}>
    <span className={BASE_THUMB} data-slot="switch-thumb" {...(on ? {'data-checked': ''} : {'data-unchecked': ''})} />
  </span>;
}
/* checkbox legibility test: the same pair on the surfaces it really sits on (dark list, pink bar, busy thumbnail) */
const GROUNDS = [
  {label: '深色列表', bg: '#201936'},
  {label: '粉色条', bg: '#f8c6e3'},
  {label: '缩略图', bg: 'repeating-conic-gradient(#ffb8e6 0 25%,#4a3784 0 50%) 0 0/6px 6px, #2a2147'},
  {label: '亮图', bg: 'repeating-linear-gradient(45deg,#fdf4ff 0 3px,#c9b8ef 3px 6px)'},
];
function CbGrounds({disabled}: {disabled: boolean}) {
  return <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
    {GROUNDS.map((g) => <div key={g.label} style={{display: 'grid', justifyItems: 'center', gap: 4}}>
      <div style={{zoom: 3, display: 'flex', gap: 5, padding: 4, background: g.bg}}><RawCbx disabled={disabled} /><RawCbx initial disabled={disabled} /></div>
      <span style={{fontSize: 11, opacity: .7}}>{g.label}</span>
    </div>)}
  </div>;
}
function ZoomRow({kind, disabled}: {kind: 'checkbox' | 'switch'; disabled: boolean}) {
  if (kind === 'checkbox') return <CbGrounds disabled={disabled} />;
  const z = 3;
  return <div style={{display: 'flex', alignItems: 'center', gap: 18 * z, padding: '6px 2px'}}>
    <div style={{zoom: z}}>{kind === 'checkbox' ? <RawCbx disabled={disabled} /> : <RawSw disabled={disabled} />}</div>
    <div style={{zoom: z}}>{kind === 'checkbox' ? <RawCbx initial disabled={disabled} /> : <RawSw initial disabled={disabled} />}</div>
  </div>;
}

const Disabled = React.createContext(false);

/* ---------- rows ---------- */
type Cbv = 'a' | 'b' | 'c';
type Row = {id: string; title: string; meta: string; source: string; count?: string; labels?: string[]; cbv?: Cbv;
  render: (disabled: boolean) => React.ReactNode};
const CHECKBOX: Row[] = [
  {id: 'cb-tile-14', title: 'A 媒体卡片 · 左上角选择框', meta: '14px · 平时隐藏，悬停该行才出现', source: 'MediaAssetTile.tsx / ScreenshotThumbnailCard.tsx', count: '快照 19 处',
    render: (d) => <Cbx ctx={C['cb-tile-14']} disabled={d} />},
  {id: 'cb-scan-14', title: 'B 截图元数据 · 缩略图选择框', meta: '14px · 同一浮层结构，另一种卡片', source: 'tools_screenshot-metadata', count: '快照 14 处',
    render: (d) => <Cbx ctx={C['cb-scan-14']} disabled={d} />},
  {id: 'cb-fav-row-16', title: 'C 收藏列表行 · 选择框', meta: '16px · 收藏页特例尺寸', source: 'FavoriteCard.tsx / MyGroupCard.tsx', count: '快照 17 处',
    render: (d) => <Cbx ctx={C['cb-fav-row-16']} disabled={d} />},
  {id: 'cb-fav-tile-16', title: 'D 收藏平铺卡片 · 选择框', meta: '16px · 收藏页特例尺寸', source: 'FavoriteCard.tsx', count: '快照 12 处',
    render: (d) => <Cbx ctx={C['cb-fav-tile-16']} disabled={d} />},
  {id: 'cb-toolbar-14', title: 'E 图表工具栏 · 文字标签旁', meta: '14px · 常显，和 label 一行', source: 'charts_timeline', count: '快照 2 处',
    render: (d) => <Cbx ctx={C['cb-toolbar-14']} labels={['显示平均值']} disabled={d} />},
  {id: 'cb-field', title: 'F 设置表单行（快照没采到）', meta: '14px · 与开关同一个 field 行结构', source: 'SettingsViewParts.tsx:（快照未采到；容器取自真实设置卡片）', count: '源码 1 类用法',
    render: (d) => <Cbx ctx={C['sw-field-on']} disabled={d} />},
];
const DETAIL: Row[] = [
  {id: 'zoom-cb-a', cbv: 'a', title: '方案 A · Win98 白格（放大 3×）', meta: '三种深度：未勾立起来（0）、勾上后锁在半按下（2）、按住时最深并右下移 1px（3）；松手回到 0 或 2', source: '每组左未勾、右已勾，放在四种真实底色上', count: '可点击',
    render: (d) => <ZoomRow kind="checkbox" disabled={d} />},
  {id: 'zoom-cb-b', cbv: 'b', title: '方案 B · 粉格按下（放大 3×）', meta: '深色凹格 + 亮色框；勾上后整格变成按下的粉键，和切换组“选中＝粉色按下”同一信号', source: '每组左未勾、右已勾，放在四种真实底色上', count: '可点击',
    render: (d) => <ZoomRow kind="checkbox" disabled={d} />},
  {id: 'zoom-cb-c', cbv: 'c', title: '方案 C · 像素爱心（放大 3×）', meta: '深色凹格 + 粉框；勾上后格里是开关同款的像素爱心', source: '每组左未勾、右已勾，放在四种真实底色上', count: '可点击',
    render: (d) => <ZoomRow kind="checkbox" disabled={d} />},
  {id: 'zoom-switch', title: 'Q 开关细节（放大 3×）', meta: '左：关 · 右：开', source: '同一 DOM，去掉祖先容器', count: '两种状态',
    render: (d) => <ZoomRow kind="switch" disabled={d} />},
];
const SWITCH: Row[] = [
  {id: 'sw-field-on', title: 'G 设置卡片行 · 打开', meta: 'default 46×22 · 右侧对齐', source: 'SettingsViewParts.tsx', count: '快照 9 处打开',
    render: (d) => <Sw ctx={C['sw-field-on']} initial disabled={d} />},
  {id: 'sw-field-off', title: 'H 设置卡片行 · 关闭', meta: 'default 46×22', source: 'SettingsViewParts.tsx', count: '快照 4 处关闭',
    render: (d) => <Sw ctx={C['sw-field-off']} disabled={d} />},
  {id: 'sw-tools-sm', title: 'I 工具卡片行 · 小号', meta: 'sm 44×20 · 行尾开关', source: 'ToolsPageContent.tsx', count: '快照 2 处（tools / tools-actions-menu）',
    render: (d) => <Sw ctx={C['sw-tools-sm']} initial disabled={d} />},
  {id: 'sw-charts', title: 'J 图表页内 · 右上角', meta: 'default 46×22 · 页面内容里', source: 'DashboardViewParts.tsx / charts_two-person', count: '快照 1 处',
    render: (d) => <Sw ctx={C['sw-charts']} disabled={d} />},
];
const SLIDER: Row[] = [
  {id: 'sl-chart', title: 'K 图表卡 · 筛选滑块', meta: '轨道 6px / 拇指 12px · 图表卡片里', source: 'charts', count: '快照 3 处',
    render: (d) => <SliderRow ctx={C['sl-chart']} disabled={d} />},
  {id: 'sl-sheet', title: 'L 设置抽屉 · 阈值滑块', meta: '轨道 6px · 抽屉表单里', source: 'CommitSlider.tsx（共同好友设置）', count: '快照 4 处',
    render: (d) => <SliderRow ctx={C['sl-sheet']} disabled={d} />},
  {id: 'sl-timeline-toolbar', title: 'M 工具栏 · 窄滑块', meta: '96px 宽', source: 'charts_timeline', count: '快照 1 处',
    render: (d) => <SliderRow ctx={C['sl-timeline-toolbar']} disabled={d} />},
  {id: 'sl-timeline-page', title: 'N 页面内容 · 宽滑块', meta: '626px 宽 · 右侧带数值', source: 'charts_timeline', count: '快照 1 处',
    render: (d) => <SliderRow ctx={C['sl-timeline-page']} disabled={d} />},
];
const RADIO: Row[] = [
  {id: 'radio-dialog', title: 'O 数据目录对话框 · 单选', meta: '快照没采到 · 结构与组件一致', source: 'DataDirMigrationDialog.tsx:206–252', count: '源码 1 处',
    render: (d) => <RadioRow disabled={d} />},
];

const Variant = React.createContext<Cbv>('a');
function Pane({row, disabled, proposal}: {row: Row; disabled: boolean; proposal?: boolean}) {
  const v = React.useContext(Variant);
  return <div className={'demo-pane' + (proposal ? ' jk-proposal' : '')} data-cbv={proposal ? (row.cbv ?? v) : undefined}>{row.render(disabled)}</div>;
}
function Section({title, note, rows, disabled}: {title: string; note: string; rows: Row[]; disabled: boolean}) {
  let n = 0;
  return <section className="demo-section">
    <div className="demo-comparison-note"><strong>{title}</strong><p>{note}</p></div>
    <div className="demo-table">
      <div className="demo-table-head"><span>位置</span><span>现状</span><span>提案</span></div>
      {rows.map((r) => <div key={r.id} className="demo-row-compare" data-ctx={r.id}>
        <div className="demo-row-meta"><span className="demo-row-no">{String(++n).padStart(2, '0')}</span><div><h2>{r.title}</h2><p>{r.meta}</p><p>{r.count} · {r.source}</p></div></div>
        <Pane row={r} disabled={disabled} />
        <Pane row={r} disabled={disabled} proposal />
      </div>)}
    </div>
  </section>;
}

function App() {
  const [theme, setTheme] = useState(true), [disabled, setDisabled] = useState(false), [cbv, setCbv] = useState<Cbv>('a');
  return <Variant.Provider value={cbv}><Disabled.Provider value={disabled}><main className="demo-document">
    <header className="demo-document-header">
      <div className="demo-eyebrow">CHECKBOX / SWITCH / SLIDER / RADIO · 现状 vs 提案</div>
      <h1>勾选件：复选框三选一，开关和滑块保留原创</h1>
      <p>左边是当前主题，右边是提案。每一行都是基线快照里真实存在的控件，连同真实祖先结构重建（只取结构，文字全是虚构）。勾选框和开关两边都能点、能按 Space/Enter；滑块两边都能拖动；全部能用 Tab 聚焦。</p>
      <div className="demo-top-tools">
        <button className="demo-theme-toggle" onClick={() => { setTheme(!theme); (document.getElementById('merged-theme') as HTMLStyleElement).disabled = theme; }}>{theme ? '已应用合并主题 CSS' : '仅应用基础 CSS'} · 点击切换</button>
        <button className="demo-theme-toggle" onClick={() => setDisabled(!disabled)}>{disabled ? '关闭禁用测试' : '全部禁用'}</button>
        {(['a', 'b', 'c'] as Cbv[]).map((k) => <button key={k} className="demo-theme-toggle" aria-pressed={cbv === k} style={cbv === k ? {outline: '2px solid #ff7fcf'} : undefined} onClick={() => setCbv(k)}>复选框方案 {k.toUpperCase()}</button>)}
        <span>上面的方案按钮切换“复选框”“单选”两节右栏用哪一种；放大细节里三种同时列出。</span>
      </div>
    </header>
    <Section title="复选框" rows={CHECKBOX} disabled={disabled}
      note="现状的问题：14px 小格是深底配暗紫框，放在缩略图和深色列表上几乎看不见。三个方案都统一成 14px、方角、加 1px 深色外圈（保证压在图片上也看得清），勾换成 7×7 的 Win98 阶梯像素勾；按住时格面变暗、不位移（14px 的格子一跳会显得抖），两帧动画、粉色焦点框、禁用半透明。用页首的按钮切换 A / B / C。" />
    <Section title="细节放大（4× / 3×）" rows={DETAIL} disabled={disabled}
      note="三个复选框方案放大 3 倍，每组左边未勾、右边已勾，分别放在深色列表、粉色条、缩略图、亮图四种真实会出现的底色上，比较可见度。最后一行是开关（保留原创设计，两栏相同）。" />
    <Section title="开关" rows={SWITCH} disabled={disabled}
      note="保留原创设计：关闭是创可贴 ✕ 旋钮 + OFF 灯，打开是爱心旋钮 + ON 灯。本轮不改，两栏相同。" />
    <Section title="滑块" rows={SLIDER} disabled={disabled}
      note="保留现状的像素点阵轨道和粉色方拇指；只给拇指补上按键手感：悬停变亮、按住凹下并右下移 1px、键盘聚焦粉色框。" />
    <Section title="单选（顺带）" rows={RADIO} disabled={disabled}
      note="单选和复选框完全同一个样子：同样的凹格、同样的像素勾。42 个快照里没有单选，只有数据目录对话框（源码）用到。" />
    <footer className="demo-footer">结构数据：checks/choice-contexts.json（extract-preview-contexts.mjs 从基线快照提取，只有结构）。提案：checks/choice-proposal.css，只作用于右栏，尚未进入主题。</footer>
  </main></Disabled.Provider></Variant.Provider>;
}
createRoot(document.getElementById('preview-root')!).render(<App />);
