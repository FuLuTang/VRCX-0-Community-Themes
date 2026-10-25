// 对话框套（dialog）展示页：普通对话框 / 确认对话框 / 抽屉 / 遮罩 / 关闭键。
// 现状与提案并排；提案列带 .jk-proposal，规则在 dialog-proposal.css。
// 快照里几乎没有渲染出的弹层（42 个快照中只有 charts-mutual-settings-sheet 的抽屉），所以：
//   - 抽屉（真实快照）用 preview-replay 回放，结构来自快照，文字全部虚构；
//   - 其余弹层“照源码搭”：class 字符串逐条抄自 src/ui/shadcn/dialog.tsx、alert-dialog.tsx、sheet.tsx 与
//     src/components/hosts/DialogHost.tsx；不经过 Portal（定位用 demo 布局类处理，只改布局不改颜色）。
// 所有文字为虚构占位，图片与头像用色块，不含真实用户数据。
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { XIcon, BellIcon, MinusIcon, ShieldIcon } from 'lucide-react';
import { Button } from '@/ui/shadcn/button';
import { Replay, type Context } from './preview-replay';
import contexts from './dialog-contexts.json';

const C = contexts as unknown as Record<string, Context>;

// ---- 源码 class 字符串（抄自 src/ui/shadcn/*.tsx，保持一字不差）----
const DIALOG_OVERLAY = 'vrcx-0-app-overlay data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed isolate z-50 bg-black/10 data-closed:duration-100 data-open:duration-150 supports-backdrop-filter:backdrop-blur-xs';
const DIALOG_CONTENT = 'bg-popover text-popover-foreground ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-[calc(50%+1rem)] left-1/2 z-50 grid max-h-[calc(100vh-4rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-xl p-4 text-sm ring-1 outline-none data-closed:duration-100 data-open:duration-150 data-open:ease-[cubic-bezier(0.23,1,0.32,1)] sm:max-w-sm';
const DIALOG_HEADER = 'flex flex-col gap-2';
const DIALOG_FOOTER = 'bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end';
const DIALOG_TITLE = 'font-heading text-base leading-none font-medium';
const DIALOG_DESC = 'text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3';

const ALERT_OVERLAY = 'vrcx-0-app-overlay data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs';
const ALERT_CONTENT = 'group/alert-dialog-content bg-popover text-popover-foreground ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-[calc(50%+1rem)] left-1/2 z-50 grid max-h-[calc(100vh-4rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-xl p-4 ring-1 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm';
const ALERT_HEADER = 'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]';
const ALERT_FOOTER = 'bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end';
const ALERT_MEDIA = "bg-muted mb-2 inline-flex size-10 items-center justify-center rounded-md sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6";
const ALERT_TITLE = 'font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2';
const ALERT_DESC = 'text-muted-foreground *:[a]:hover:text-foreground text-sm text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3';

const SHEET_BACKDROP = 'vrcx-0-app-overlay fixed z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0';
const SHEET_VIEWPORT = 'vrcx-0-app-drawer-viewport fixed z-50 grid flex justify-end sm:p-4';
const SHEET_POPUP = 'bg-popover text-popover-foreground relative flex max-h-full min-h-0 w-full min-w-0 flex-col shadow-lg/5 transition-[opacity,translate] duration-200 ease-in-out will-change-transform not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:opacity-0 data-starting-style:opacity-0 max-sm:before:hidden dark:before:shadow-[0_-1px_--theme(--color-white/6%)] col-start-2 w-[calc(100%-(--spacing(12)))] max-w-md border-s data-ending-style:translate-x-8 data-starting-style:translate-x-8 before:hidden sm:rounded-2xl sm:border sm:before:rounded-[calc(var(--radius-2xl)-1px)] sm:**:data-[slot=sheet-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]';
const SHEET_HEADER = 'flex flex-col gap-2 p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pb-3 max-sm:pb-4';
const SHEET_TITLE = 'font-heading text-xl leading-none font-semibold';
const SHEET_DESC = 'text-muted-foreground text-sm';
const SHEET_PANEL = 'p-6 in-[[data-slot=sheet-popup]:has([data-slot=sheet-footer]:not(.border-t))]:pb-1 in-[[data-slot=sheet-popup]:has([data-slot=sheet-header])]:pt-1';
const SHEET_FOOTER = 'flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end bg-muted/72 border-t py-4';

// ---- 演示布局（只改定位与尺寸，不改颜色；写在这里而不进主题） ----
const DEMO_CSS = `
.dlg-stage{position:relative;overflow:hidden;isolation:isolate;min-height:330px;background:#17102a;border:1px solid #33283d}
.dlg-page{position:absolute;inset:0;padding:16px;display:flex;flex-direction:column;gap:10px;background:#2a1b3d}
.dlg-page i{display:block;height:14px;background:#ffb8e6;opacity:.5}
.dlg-page i:nth-child(2n){background:#6c5ce0;opacity:.45}
.dlg-page i:nth-child(3n){width:62%;background:#8ee6dd;opacity:.35}
.dlg-stage>[data-slot$="overlay"],.dlg-stage>[data-slot="sheet-backdrop"]{position:absolute!important;inset:0!important;top:0!important;bottom:0!important;left:0!important;right:0!important;border-radius:0!important;translate:none!important}
.dlg-slot{position:absolute;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:16px}
.dlg-slot [data-slot$="-content"],.dlg-inline [data-slot$="-content"]{position:relative!important;inset:auto!important;top:auto!important;left:auto!important;translate:none!important;transform:none!important;max-height:none!important;max-width:100%!important;width:300px!important;margin:0}
.dlg-slot-side{align-items:stretch;justify-content:stretch;padding:0}
.dlg-inline [data-slot$="-content"]{width:240px!important}
.dlg-inline{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap}
.dlg-inline [data-slot="sheet-viewport"]{position:relative!important;inset:auto!important;top:auto!important;left:auto!important;width:auto!important;height:auto!important;padding:0!important;display:block!important}
.dlg-inline [data-slot="sheet-popup"]{position:relative!important;width:210px!important;max-width:none!important;translate:none!important;transform:none!important;height:auto!important}
.dlg-slot-side [data-slot="sheet-viewport"]{position:relative!important;inset:auto!important;top:auto!important;left:auto!important;width:100%!important;height:100%!important;padding:0!important;display:flex!important;justify-content:flex-end!important}
.dlg-slot-side [data-slot="sheet-popup"]{position:relative!important;height:100%!important;width:260px!important;max-width:none!important;translate:none!important;transform:none!important;margin:0}
.dlg-slot [data-slot="dialog-close"],.dlg-slot [data-slot="alert-dialog-close"]{position:absolute!important}
.dlg-stack{display:flex;flex-direction:column;gap:14px;width:100%}
.dlg-sr{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.dlg-body{font-size:13px;color:#d6c8e6}
.dlg-body p{margin:0}
.dlg-media{background-color:#4a3784;background-image:none}
.dlg-cap{font:11px/1.5 ui-monospace,monospace;color:#9c83b0;margin:0 0 6px}
.dlg-mini{position:relative;overflow:hidden;height:150px;isolation:isolate;border:1px solid #33283d;background:#2a1b3d}
.dlg-mini .dlg-page{padding:10px;gap:7px}
.dlg-mini .dlg-page i{height:9px}
.dlg-mini>[data-slot$="overlay"],.dlg-mini>[data-slot="sheet-backdrop"]{position:absolute!important;inset:0!important}
.dlg-mini-tag{position:absolute;left:8px;bottom:6px;z-index:60;font:10px/1.4 ui-monospace,monospace;color:#fff1f8;background:#16112a;padding:0 5px;border:1px solid #6c5ce0}
.dlg-spec-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.dlg-spec-key{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;box-sizing:border-box;border:1px solid #21132d;background:#f8c6e3;color:#21132d;box-shadow:inset 1px 1px 0 #fff1f8,inset -1px -1px 0 #b86ba4;font-size:12px}
.dlg-spec-key-pale{background:#f8d8ed;color:#16112a;border:1px solid #16112a;box-shadow:inset 1px 1px 0 #fff1f8,inset -1px -1px 0 #b86ba4}
.dlg-spec-strip{background:#f2c6e8;color:#16112a;border-bottom:1px solid #6c5ce0;padding:5px 9px;font-size:13px;font-weight:700}
.dlg-spec-box{background:#211a33;border:1px solid #6c5ce0;box-shadow:inset 0 0 0 1px #f2ebff,4px 4px 0 #100b1e;padding:10px;color:#f2ebff;font-size:12px}
.dlg-spec-plain{background:#211a33;border:1px solid #6c5ce0;padding:10px;color:#f2ebff;font-size:12px}
.dlg-spec-step{animation:dlg-step 120ms steps(4,end) both}
.dlg-spec-smooth{animation:dlg-smooth 150ms ease-out both}
@keyframes dlg-step{from{opacity:0}to{opacity:1}}
@keyframes dlg-smooth{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
.dlg-choice{border:1px solid #4c3c58;background:#1b1524;padding:14px 16px;margin-bottom:18px}
.dlg-choice h3{margin:0 0 4px;font-size:14px;color:#ffd9ee}
.dlg-choice>p{margin:0 0 10px;font-size:12px;color:#c9bad5}
.dlg-opt{border:1px solid #4c3c58;padding:10px;background:#211a2b;cursor:pointer;text-align:left;color:inherit;font:inherit}
.dlg-opt[aria-pressed="true"]{outline:2px solid #ff7fcf;outline-offset:2px}
.dlg-opt-tag{font:11px/1.5 ui-monospace,monospace;color:#c2a5d6;display:block;margin-bottom:6px}
.dlg-opt-tag b{color:#ff9fd8;font-weight:600}
.dlg-opt-desc{display:block;font-size:12px;color:#c9bad5;margin-top:6px}
.dlg-summary{margin-top:10px;font:12px/1.5 ui-monospace,monospace;color:#f5badf;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.dlg-summary button{font:inherit;font-size:12px;color:#f8eefc;background:#2b2237;border:1px solid #736184;padding:3px 10px;cursor:pointer}
.dlg-titlebar-ref{height:32px;display:flex;align-items:stretch;justify-content:flex-end;padding:0;margin:0;background:#d97fc6;border-bottom:1px solid #1a1226}
.dlg-titlebar-ref .win-key{width:36px;height:100%;display:inline-flex;align-items:center;justify-content:center;border-radius:0;border:0;background:transparent;color:#21132d}
.dlg-entity-body{display:flex;flex-direction:column;gap:8px;min-height:120px}
.dlg-entity-tabs{display:flex;gap:2px;border-bottom:1px solid #6c5ce0}
.dlg-entity-tabs span{padding:6px 12px;border:1px solid #6c5ce0;border-bottom:0;background:#2a2147;font-size:12px;color:#f2ebff}
.dlg-entity-tabs span+span{background:#201936;color:#b9add9}
`;

// ---- 小件 ----
function FakePage() {
  return (
    <div className="dlg-page" aria-hidden="true">
      <i /><i /><i /><i /><i /><i />
    </div>
  );
}
function Stage({ children, overlay, side = false, sheet = false }: { children?: React.ReactNode; overlay?: React.ReactNode; side?: boolean; sheet?: boolean }) {
  return (
    <div className={sheet ? 'dlg-stage dlg-stage-sheet' : 'dlg-stage'} data-jk-stage="">
      <FakePage />
      {overlay}
      <div className={side ? 'dlg-slot dlg-slot-side' : 'dlg-slot'}>{children}</div>
    </div>
  );
}

// 普通对话框（dialog-content，有可见标题）
function DialogStandard() {
  return (
    <div role="dialog" data-slot="dialog-content" data-open="" className={`${DIALOG_CONTENT} dlg-win`}>
      <div data-slot="dialog-header" className={DIALOG_HEADER}>
        <h2 data-slot="dialog-title" className={DIALOG_TITLE}>示例标题</h2>
        <p data-slot="dialog-description" className={DIALOG_DESC}>说明文字，内容为虚构占位。</p>
      </div>
      <div className="dlg-body"><p>正文占位：这里是一段虚构的说明。</p></div>
      <div data-slot="dialog-footer" className={DIALOG_FOOTER}>
        <Button variant="outline">取消</Button>
        <Button>确定</Button>
      </div>
      <Button data-slot="dialog-close" variant="ghost" size="icon-sm" className="absolute top-2 right-2" aria-label="关闭"><XIcon /><span className="sr-only">关闭</span></Button>
    </div>
  );
}
// 无可见标题的对话框（标题在 sr-only 的 DialogHeader 里，如快速搜索、DialogHost 的非实体弹窗）
function DialogNoTitle() {
  return (
    <div role="dialog" data-slot="dialog-content" data-open="" className={`${DIALOG_CONTENT} dlg-win`}>
      <div data-slot="dialog-header" className={`${DIALOG_HEADER} sr-only`}>
        <h2 data-slot="dialog-title" className={DIALOG_TITLE}>无标题示例</h2>
        <p data-slot="dialog-description" className={DIALOG_DESC}>仅供读屏</p>
      </div>
      <div className="dlg-body"><p>输入框类的内容占位（无可见标题栏）。</p></div>
      <Button data-slot="dialog-close" variant="ghost" size="icon-sm" className="absolute top-2 right-2" aria-label="关闭"><XIcon /><span className="sr-only">关闭</span></Button>
    </div>
  );
}
// 实体详情（DialogHost：entity-dialog，showCloseButton=false，标题 sr-only）
function EntityDialog() {
  return (
    <div role="dialog" data-slot="dialog-content" data-open="" className="flex max-h-[90vh] w-[calc(100vw-2rem)] !max-w-[calc(100vw-2rem)] flex-col overflow-hidden entity-dialog sm:w-[min(96vw,72rem)] sm:!max-w-[min(96vw,72rem)] dlg-win dlg-entity">
      <div data-slot="dialog-header" className="sr-only">
        <h2 data-slot="dialog-title">实体详情示例</h2>
        <p data-slot="dialog-description">仅供读屏</p>
      </div>
      <div className="dlg-entity-body">
        <div className="dlg-entity-tabs"><span>概览</span><span>实例</span><span>记录</span></div>
        <div className="dlg-body"><p>实体详情占位内容（不改）。</p></div>
      </div>
    </div>
  );
}
// 确认对话框（alert-dialog-content，无关闭键）
function AlertBox({ size = 'default' }: { size?: 'default' | 'sm' }) {
  return (
    <div role="alertdialog" data-slot="alert-dialog-content" data-size={size} data-open="" className={`${ALERT_CONTENT} dlg-win`}>
      <div data-slot="alert-dialog-header" className={ALERT_HEADER}>
        {size === 'default' && (
          <div data-slot="alert-dialog-media" className={`${ALERT_MEDIA} dlg-media`}><ShieldIcon /></div>
        )}
        <h2 data-slot="alert-dialog-title" className={ALERT_TITLE}>确认操作示例</h2>
        <p data-slot="alert-dialog-description" className={ALERT_DESC}>这是虚构的确认说明。</p>
      </div>
      <div data-slot="alert-dialog-footer" className={ALERT_FOOTER}>
        <Button variant="outline" data-slot="alert-dialog-cancel">取消</Button>
        <Button variant="default" data-slot="alert-dialog-action">确定</Button>
      </div>
    </div>
  );
}
// 抽屉（sheet-popup，side=right，variant=inset）；bell=true 为通知中心的特例（BellIcon 锚定）
function SheetBox({ bell = false }: { bell?: boolean }) {
  return (
    <div data-slot="sheet-viewport" className={SHEET_VIEWPORT}>
      <div role="dialog" data-slot="sheet-popup" data-open="" className={`${SHEET_POPUP} dlg-sheet`}>
        <div data-slot="sheet-header" className={SHEET_HEADER}>
          <h2 data-slot="sheet-title" className={SHEET_TITLE}>{bell && <BellIcon className="lucide-bell size-4 inline-block align-[-2px] mr-1" />}{bell ? ' 通知' : ' 示例抽屉'}</h2>
          <p data-slot="sheet-description" className={SHEET_DESC}>说明文字，虚构占位。</p>
        </div>
        <div data-slot="sheet-panel" className={SHEET_PANEL}><div className="dlg-body"><p>面板占位内容。</p></div></div>
        <div data-slot="sheet-footer" className={SHEET_FOOTER}><Button variant="outline">关闭</Button></div>
        <Button aria-label="Close" className="absolute end-2 top-2" size="icon" variant="ghost"><XIcon /></Button>
      </div>
    </div>
  );
}
const SheetBackdrop = () => <div data-slot="sheet-backdrop" className={SHEET_BACKDROP} />;

// 选择题：每题的选项各自真实渲染，默认推荐在前
type Q = { id: string; title: string; hint: string; options: { key: string; label: string; note: string; render: () => React.ReactNode }[] };
const QUESTIONS: Q[] = [
  {
    id: 'D1', title: '遮罩颜色（三种遮罩要不要统一）', hint: '三种弹层背后的暗色幕布：普通对话框是紫色，确认对话框和抽屉是应用默认的黑色。',
    options: [
      { key: 'A', label: '统一为紫色遮罩（推荐）', note: '用现有的紫色遮罩（windose-runtime 里已经写好的 rgb(36 18 66 / .62)），三种弹层一致。', render: () => (
        <div className="dlg-mini"><FakePage /><div className="dlg-spec-mask" style={{ position: 'absolute', inset: 0, background: 'rgb(36 18 66 / .62)' }} /><span className="dlg-mini-tag">紫 .62</span></div>) },
      { key: 'B', label: '统一为应用默认黑色', note: '改成应用原来的黑色遮罩（bg-black/32 带模糊）；普通对话框会失去紫色。', render: () => (
        <div className="dlg-mini"><FakePage /><div className="dlg-spec-mask" style={{ position: 'absolute', inset: 0, background: 'rgb(0 0 0 / .32)', backdropFilter: 'blur(8px)' }} /><span className="dlg-mini-tag">黑 .32 模糊</span></div>) },
    ],
  },
  {
    id: 'D2', title: '关闭键（右上角那个 X）用哪种', hint: '标题栏右上角的窗口键是浅粉凸起键，悬停变品红。对话框的 X 现在是另一种浅粉小键。',
    options: [
      { key: 'A', label: '统一成窗口键（推荐）', note: '和标题栏窗口键同一套：浅粉面、1px 深框、斜边；悬停变品红（chrome-r8.css 已有）。', render: () => (
        <div className="dlg-spec-row"><span className="dlg-spec-key">✕</span><span className="dlg-spec-strip" style={{ flex: 1 }}>窗口标题</span></div>) },
      { key: 'B', label: '保留现在的浅粉键', note: '保留 dialogs-r9.css 里现有的小键（面 #f8d8ed，悬停变深墨底），只有对话框用。', render: () => (
        <div className="dlg-spec-row"><span className="dlg-spec-key dlg-spec-key-pale">✕</span><span className="dlg-spec-strip" style={{ flex: 1 }}>窗口标题</span></div>) },
    ],
  },
  {
    id: 'D3', title: '打开动画', hint: '普通对话框现在是 120ms 四步淡入（motion-r5.css）；确认对话框是应用的缩放淡入，抽屉是滑入。',
    options: [
      { key: 'A', label: '统一为四步淡入（推荐）', note: '沿用 motion-r5.css 已有的 120ms 四步淡入，三种弹层都用它，抽屉去掉滑入。', render: () => <div className="dlg-spec-step dlg-spec-box">四步淡入示例</div> },
      { key: 'B', label: '保留各自的动画', note: '确认对话框用缩放淡入，抽屉用滑入，普通对话框用四步淡入；三种不统一。', render: () => <div className="dlg-spec-smooth dlg-spec-box">缩放淡入示例</div> },
    ],
  },
  {
    id: 'D4', title: '抽屉要不要带和对话框一样的粉色标题条', hint: '普通对话框和确认对话框的标题是粉色标题条；抽屉现在是没有标题条的深色页头。通知中心抽屉是另一个特例（粉紫标题）。',
    options: [
      { key: 'A', label: '抽屉也用粉色标题条（推荐）', note: '抽屉标题改成和对话框一样的粉色标题条，窗口感一致；通知中心特例保留。', render: () => <div className="dlg-spec-box" style={{ padding: 0 }}><div className="dlg-spec-strip">示例抽屉</div><div style={{ padding: 10, fontSize: 12 }}>说明文字</div></div> },
      { key: 'B', label: '抽屉保持深色页头', note: '保持现在的抽屉样式，不加标题条；抽屉和对话框看起来仍然不是一套。', render: () => <div className="dlg-spec-plain" style={{ padding: 10 }}><div style={{ fontSize: 14, fontWeight: 600 }}>示例抽屉</div><div style={{ fontSize: 12, color: '#b9add9' }}>说明文字</div></div> },
    ],
  },
];

function Choices() {
  const [pick, setPick] = useState<Record<string, string>>(() => Object.fromEntries(QUESTIONS.map((q) => [q.id, q.options[0].key])));
  const [copied, setCopied] = useState(false);
  const summary = QUESTIONS.map((q) => `${q.id}-${pick[q.id]}`).join(' ');
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); } catch { setCopied(false); }
  };
  return (
    <section className="demo-sample" id="choices" style={{ marginBottom: 28 }}>
      <header className="demo-sample-heading"><span>选</span><div><h2>请你选择</h2><p>每题左右两种都是真实渲染的样子；默认是推荐项（已写进提案）。点选后可复制汇总。</p></div></header>
      <div style={{ padding: 18 }}>
        {QUESTIONS.map((q) => (
          <div className="dlg-choice" key={q.id}>
            <h3>{q.id} · {q.title}</h3>
            <p>{q.hint}</p>
            <div className="dlg-spec-row">
              {q.options.map((o) => (
                <button key={o.key} type="button" className="dlg-opt" aria-pressed={pick[q.id] === o.key} onClick={() => setPick((p) => ({ ...p, [q.id]: o.key }))}>
                  <span className="dlg-opt-tag"><b>{q.id}-{o.key}</b>{o.key === 'A' ? ' · 推荐' : ''}</span>
                  {o.render()}
                  <span className="dlg-opt-desc">{o.label}：{o.note}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="dlg-summary">
          <span>汇总：{summary}</span>
          <button type="button" onClick={copy}>{copied ? '已复制' : '复制汇总'}</button>
        </div>
      </div>
    </section>
  );
}

// 行：左“现状”，右“提案”（.jk-proposal 包住，规则在 dialog-proposal.css）
function Row({ id, title, meta, now, next, ctx }: { id: string; title: string; meta: string; now: React.ReactNode; next: React.ReactNode; ctx?: string }) {
  return (
    <div className="demo-row-compare" data-ctx={ctx} data-row={id} style={{ gridTemplateColumns: '210px minmax(0,1fr) minmax(0,1fr)' }}>
      <div className="demo-row-meta"><span className="demo-row-no">{id}</span><div><h2>{title}</h2><p>{meta}</p></div></div>
      <div className="demo-pane">{now}</div>
      <div className="demo-pane jk-proposal">{next}</div>
    </div>
  );
}

function App() {
  return (
    <main className="demo-document">
      <style>{DEMO_CSS}</style>
      <header className="demo-document-header">
        <div className="demo-eyebrow">DIALOG · 第②步调查 · 未进入 runtime</div>
        <h1>对话框 · 抽屉 · 遮罩 · 关闭键：现状 vs 提案</h1>
        <p>范围：普通对话框、确认对话框、抽屉（sheet）、遮罩、标题栏与关闭键、打开动画。实体详情、通知中心特例单独标明。只有抽屉来自真实快照（charts-mutual-settings-sheet），其余按源码搭建、未经快照验证。文字全部虚构。</p>
      </header>

      <Choices />

      <section className="demo-section">
        <div className="demo-table">
          <div className="demo-table-head" style={{ gridTemplateColumns: '210px minmax(0,1fr) minmax(0,1fr)' }}><span>编号 · 形态</span><span>现状（当前主题）</span><span>提案（dialog-proposal.css）</span></div>

          <Row id="dlg-standard" title="普通对话框（有可见标题）" meta="dialog-content + dialog-header/title/description/footer + 右上角关闭键。DialogContent：dialog.tsx:58-100"
            now={<Stage overlay={<div data-slot="dialog-overlay" className={DIALOG_OVERLAY} />}><DialogStandard /></Stage>}
            next={<Stage overlay={<div data-slot="dialog-overlay" className={DIALOG_OVERLAY} />}><DialogStandard /></Stage>} />
          <Row id="dlg-no-title" title="普通对话框（无可见标题，sr-only）" meta="标题只在 sr-only 的 DialogHeader 里：快速搜索、DialogHost 的非实体弹窗。不进标题条，保持基础皮。QuickSearchDialog.tsx:157、command.tsx:47、DialogHost.tsx:100"
            now={<Stage overlay={<div data-slot="dialog-overlay" className={DIALOG_OVERLAY} />}><DialogNoTitle /></Stage>}
            next={<Stage overlay={<div data-slot="dialog-overlay" className={DIALOG_OVERLAY} />}><DialogNoTitle /></Stage>} />
          <Row id="dlg-entity" title="特例：实体详情（entity-dialog）" meta="用户/世界/群组/模型详情。DialogHost.tsx:88-98 加 entity-dialog，showCloseButton=false。已有整套定制（user-dialog-r8/r9、banner-frame-r96、tabs.css），外框是基础皮，不并入提案。"
            now={<Stage overlay={<div data-slot="dialog-overlay" className={DIALOG_OVERLAY} />}><EntityDialog /></Stage>}
            next={<Stage overlay={<div data-slot="dialog-overlay" className={DIALOG_OVERLAY} />}><EntityDialog /></Stage>} />

          <Row id="alert-default" title="确认对话框（默认尺寸，有图标）" meta="alert-dialog-content + alert-dialog-media/title/description/footer；无关闭键。alert-dialog.tsx:60-195"
            now={<Stage overlay={<div data-slot="alert-dialog-overlay" className={ALERT_OVERLAY} />}><AlertBox /></Stage>}
            next={<Stage overlay={<div data-slot="alert-dialog-overlay" className={ALERT_OVERLAY} />}><AlertBox /></Stage>} />
          <Row id="alert-sm" title="确认对话框（size=sm）" meta="data-size=sm：页脚两列网格。alert-dialog.tsx:60-113；应用内未见 size=sm 的实际调用"
            now={<Stage overlay={<div data-slot="alert-dialog-overlay" className={ALERT_OVERLAY} />}><AlertBox size="sm" /></Stage>}
            next={<Stage overlay={<div data-slot="alert-dialog-overlay" className={ALERT_OVERLAY} />}><AlertBox size="sm" /></Stage>} />

          <Row id="sheet-captured" title="抽屉（真实快照：互同好友设置抽屉）" meta="charts-mutual-settings-sheet 快照里的 sheet-popup，结构回放，文字虚构。MutualFriendsSettingsSheet.tsx:89（side=right，variant=inset）" ctx="sheet-popup"
            now={<Replay ctx={C['sheet-popup']} labels={['设置一', '设置二', '说明文字']} />}
            next={<Replay ctx={C['sheet-popup']} labels={['设置一', '设置二', '说明文字']} />} />
          <Row id="sheet-std" title="抽屉（源码搭：标题 + 面板 + 页脚）" meta="sheet-popup + sheet-backdrop；与快照同一套 class。sheet.tsx:46-141；KeyboardShortcutsDialog.tsx:33 同样是 variant=inset"
            now={<Stage side sheet overlay={<SheetBackdrop />}><SheetBox /></Stage>}
            next={<Stage side sheet overlay={<SheetBackdrop />}><SheetBox /></Stage>} />
          <Row id="sheet-bell" title="特例：通知中心抽屉（BellIcon 锚定）" meta="sheet-popup:has(.lucide-bell)，overlays-r10.css:61-102 已有粉紫标题的特例。VrcNotificationCenterHost.tsx:140。保留，不并入。"
            now={<Stage side sheet overlay={<SheetBackdrop />}><SheetBox bell /></Stage>}
            next={<Stage side sheet overlay={<SheetBackdrop />}><SheetBox bell /></Stage>} />

          <div className="demo-row-compare" data-row="mask-compare" style={{ gridTemplateColumns: '210px minmax(0,1fr) minmax(0,1fr)' }}>
            <div className="demo-row-meta"><span className="demo-row-no">遮罩</span><div><h2>三种遮罩对照</h2><p>dialog-overlay（windose-runtime.css:60 紫 .62）；alert-dialog-overlay（应用 bg-black/10）；sheet-backdrop（应用 bg-black/32 模糊）。</p></div></div>
            <div className="demo-pane">
              <div className="dlg-stack">
                <p className="dlg-cap">普通对话框遮罩</p><div className="dlg-mini"><FakePage /><div data-slot="dialog-overlay" className={DIALOG_OVERLAY} /></div>
                <p className="dlg-cap">确认对话框遮罩</p><div className="dlg-mini"><FakePage /><div data-slot="alert-dialog-overlay" className={ALERT_OVERLAY} /></div>
                <p className="dlg-cap">抽屉遮罩</p><div className="dlg-mini"><FakePage /><div data-slot="sheet-backdrop" className={SHEET_BACKDROP} /></div>
              </div>
            </div>
            <div className="demo-pane jk-proposal">
              <div className="dlg-stack">
                <p className="dlg-cap">普通对话框遮罩</p><div className="dlg-mini"><FakePage /><div data-slot="dialog-overlay" className={DIALOG_OVERLAY} /></div>
                <p className="dlg-cap">确认对话框遮罩</p><div className="dlg-mini"><FakePage /><div data-slot="alert-dialog-overlay" className={ALERT_OVERLAY} /></div>
                <p className="dlg-cap">抽屉遮罩</p><div className="dlg-mini"><FakePage /><div data-slot="sheet-backdrop" className={SHEET_BACKDROP} /></div>
              </div>
            </div>
          </div>

          <div className="demo-row-compare" data-row="close-compare" style={{ gridTemplateColumns: '210px minmax(0,1fr) minmax(0,1fr)' }}>
            <div className="demo-row-meta"><span className="demo-row-no">关闭键</span><div><h2>对话框 X 与抽屉 X</h2><p>现状：对话框 X 为浅粉小键（dialogs-r9.css）；抽屉 X 为应用默认幽灵键（dialog 与 sheet 的 X 结构不同，见源码）。提案：两者统一成标题栏窗口键。</p></div></div>
            <div className="demo-pane">
              <div className="dlg-inline"><DialogStandard /><SheetBox /></div>
            </div>
            <div className="demo-pane jk-proposal">
              <div className="dlg-inline"><DialogStandard /><SheetBox /></div>
            </div>
          </div>

          <div className="demo-row-compare" data-row="close-ref" style={{ gridTemplateColumns: '210px minmax(0,1fr)' }}>
            <div className="demo-row-meta"><span className="demo-row-no">参照</span><div><h2>标题栏窗口键（已定稿，不改）</h2><p>chrome-r8.css:34-35 与 :65-69：面 #f8c6e3、1px 深框，关闭键悬停 #b0305f。AppTitleBar.tsx:43、:165。</p></div></div>
            <div className="demo-pane">
              <header data-app-titlebar="true" className="vrcx-0-titlebar dlg-titlebar-ref" style={{ width: '100%' }}>
                <button type="button" className="text-muted-foreground hover:text-foreground h-full w-9 rounded-none border-0"><MinusIcon /></button>
                <button type="button" className="text-muted-foreground hover:text-foreground h-full w-9 rounded-none border-0 hover:bg-destructive! hover:text-destructive-foreground!"><XIcon /></button>
              </header>
            </div>
          </div>
        </div>
      </section>

      <footer className="demo-footer">
        实体详情与通知中心为特例，不并入提案。快照只采到了一个抽屉（charts-mutual-settings-sheet）；其余弹层为源码搭建，未经快照验证。
      </footer>
    </main>
  );
}

createRoot(document.getElementById('preview-root')!).render(<App />);
