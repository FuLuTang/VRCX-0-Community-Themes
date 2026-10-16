import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { UsersIcon, UserSearchIcon, GlobeIcon, SettingsIcon, BellIcon, PaletteIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/shadcn/tabs';
import { TooltipProvider, Tooltip, TooltipTrigger } from '@/ui/shadcn/tooltip';

// Real app primitives; only the surrounding demonstration layout is new.
// Counts are the user's example, not live account data.
const friends = ['在线', '好友收藏', '同一房间', '活跃中（仅登录网页端）', '离线'];
const messages = ['邀请', '申请加入', '拒绝加入申请', '拒绝邀请'];
const icons = [SettingsIcon, PaletteIcon, UsersIcon, BellIcon];
const DisabledPreview = React.createContext(false);

function PageHost({ children }: React.PropsWithChildren) {
  return <div className="vrcx-0-app-root" data-vrcx-0-surface="app-root"><div className="vrcx-0-main-content" data-vrcx-0-surface="main-content"><div className="vrcx-0-page-scaffold">{children}</div></div></div>;
}
function Frame({ id, title, description, children }: React.PropsWithChildren<{id: string; title: string; description: string}>) {
  return <section className="demo-sample" id={id}><header className="demo-sample-heading"><span>{id.slice(7)}</span><div><h2>{title}</h2><p>{description}</p></div></header><div className="demo-stage">{children}</div></section>;
}
function Horizontal({ dialog = false, small = false }: { dialog?: boolean; small?: boolean }) {
  const labels = dialog ? messages : small ? ['PC', 'Android', 'iOS'] : friends;
  const [value, setValue] = useState('0');
  const disabled = React.useContext(DisabledPreview);
  const inner = <Tabs value={value} onValueChange={setValue} className="min-h-0">
    <TabsList size={small ? 'sm' : 'default'} className={dialog ? 'flex-wrap' : 'max-w-full shrink-0 overflow-x-auto'}>
      {labels.map((label, i) => <TabsTrigger key={i} value={String(i)} disabled={disabled && i === labels.length - 1}>{label}{!dialog && !small && <span className="text-content-tertiary text-[11px] leading-none font-medium tabular-nums">{[19,4,2,7,0][i]}</span>}</TabsTrigger>)}
    </TabsList>
    {labels.map((label, i) => <TabsContent key={i} value={String(i)}><div className="demo-panel-copy"><strong>{label}</strong><span>当前选中项 · 内容仅作演示</span></div></TabsContent>)}
  </Tabs>;
  if (dialog) return <div className="demo-dialog" data-slot="dialog-content"><div className="demo-dialog-title">消息模板</div>{inner}</div>;
  if (small) return <div className="demo-dialog entity-dialog" data-slot="dialog-content"><div className="demo-dialog-title">模型性能 · 平台</div>{inner}</div>;
  return <PageHost><div className="vrcx-0-page-toolbar"><div className="demo-toolbar-content">{inner}</div></div></PageHost>;
}
function Vertical() {
  const [value, setValue] = useState('0');
  const disabled = React.useContext(DisabledPreview);
  const labels = ['系统', '界面', '社交', '通知'];
  return <PageHost><Tabs orientation="vertical" value={value} onValueChange={setValue} className="flex min-h-0 flex-1 gap-4">
    <TabsList className="h-fit w-44 shrink-0 gap-0.5 self-start">{labels.map((label, i) => { const Icon = icons[i]; return <TabsTrigger key={i} value={String(i)} disabled={disabled && i === labels.length - 1} className="justify-start gap-2.5 px-3 py-1.5"><Icon />{label}</TabsTrigger>; })}</TabsList>
    <div className="min-w-0 flex-1">{labels.map((label, i) => <TabsContent key={i} value={String(i)}><div className="demo-panel-copy"><strong>{label}设置</strong><span>竖向章节导航 · 保留原有布局</span></div></TabsContent>)}</div>
  </Tabs></PageHost>;
}
function Rail() {
  const [value, setValue] = useState('0');
  const disabled = React.useContext(DisabledPreview);
  const labels = ['特别关注', '好友', '世界'];
  const railIcons = [UserSearchIcon, UsersIcon, GlobeIcon];
  return <div className="vrcx-0-app-root" data-vrcx-0-surface="app-root"><aside className="vrcx-0-side-panel demo-side-panel" data-vrcx-0-surface="side-panel"><Tabs orientation="vertical" value={value} onValueChange={setValue} className="flex min-h-0 min-w-0 flex-1 gap-0 overflow-hidden">
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-2 pl-2">{labels.map((label,i)=><TabsContent key={i} value={String(i)}><div className="demo-panel-copy"><strong>{label}</strong><span>右侧紧凑标签栏</span></div></TabsContent>)}</div>
    <div className="vrcx-0-side-panel-rail flex w-9 shrink-0 flex-col items-center gap-0.5 py-1.5"><TabsList variant="underline" className="w-full flex-col gap-0.5 p-0 [&>[data-slot=tab-indicator]]:hidden">
      {labels.map((label,i)=>{const Icon=railIcons[i];return <Tooltip key={i}><TooltipTrigger aria-label={label} title={label} render={<TabsTrigger value={String(i)} disabled={disabled && i === labels.length - 1} data-active={value===String(i)?'':undefined} className="data-active:bg-secondary h-auto w-full flex-col justify-center gap-0.5 px-0 py-1.5 sm:h-auto" />}><Icon className="size-4.5" data-icon="icon"/><span className="sr-only">{label}</span></TooltipTrigger></Tooltip>;})}
    </TabsList></div>
  </Tabs></aside></div>;
}
function Entity() {
  const [value,setValue]=useState('0');const labels=['概览','实例','访问记录','截图'];
  const disabled = React.useContext(DisabledPreview);
  return <div className="demo-dialog entity-dialog" data-slot="dialog-content"><div className="demo-dialog-title">世界详情 · Win98 属性页签</div><Tabs value={value} onValueChange={setValue} className="flex min-h-0 flex-1 flex-col gap-0">
    <TabsList variant="underline" className="relative flex h-11 min-h-11 w-full justify-start overflow-x-auto overflow-y-hidden rounded-none border-b bg-transparent p-0">{labels.map((label,i)=><TabsTrigger key={i} value={String(i)} disabled={disabled && i === labels.length - 1} className="text-muted-foreground hover:text-foreground h-11 flex-none rounded-none border-0 bg-transparent px-3 shadow-none after:hidden data-active:bg-transparent data-active:shadow-none">{label}</TabsTrigger>)}</TabsList>
    {labels.map((label,i)=><TabsContent key={i} value={String(i)}><div className="demo-panel-copy"><strong>{label}</strong><span>选中页签与内容同色连体 · 未选中后退</span></div></TabsContent>)}
  </Tabs></div>;
}
function App(){
  const [themeOn,setThemeOn]=useState(true);
  const [disabled,setDisabled]=useState(false);
  function toggleTheme(){const next=!themeOn;setThemeOn(next);(document.getElementById('merged-theme') as HTMLStyleElement).disabled=!next;}
  return <TooltipProvider><DisabledPreview.Provider value={disabled}><div className="demo-document"><header className="demo-document-header"><div className="demo-eyebrow">CURRENT THEME / TABS</div><h1>同一套组件，六个实际落点</h1><p>真实 Tabs 组件 + 应用编译 CSS + 当前完整合并主题 CSS。按组件身份全局兜底；侧栏与实体顶部按职责使用特例，页面花边独立修饰。</p><div className="demo-top-tools"><button className="demo-theme-toggle" onClick={toggleTheme} aria-pressed={themeOn}>{themeOn?'已应用合并主题 CSS':'仅应用基础 CSS'} · 点击切换</button><button className="demo-theme-toggle" onClick={()=>setDisabled(!disabled)} aria-pressed={disabled}>{disabled?'关闭禁用测试':'禁用每组末项'}</button><span>可点击切换；Tab 聚焦，方向键移动，Enter 选择。计数为示例。</span></div></header>
  <div className="demo-comparison-note"><strong>A · 01–04 共用分段选框　B · 05/06 文件夹家族</strong><p>01–04 共用 idle / hover / active / focus / disabled 皮肤，保留尺寸与方向；04 花边独立。05 保留右侧紧凑标签，06 为顶部连体属性页签。</p></div>
  <div className="demo-samples">
    <Frame id="sample-01" title="好友位置 · 普通横向" description="default / 默认尺寸 / 页面工具栏；含人数"><Horizontal /></Frame>
    <Frame id="sample-02" title="消息模板 · 普通弹窗" description="default / 默认尺寸 / 不属于主内容区祖先"><Horizontal dialog /></Frame>
    <Frame id="sample-03" title="性能平台切换 · 小号横向" description="default / sm / 实体详情内；尺寸变化不等于新皮肤"><Horizontal small /></Frame>
    <Frame id="sample-04" title="设置 · 竖向章节导航" description="default / vertical；应用现有导航容器"><Vertical /></Frame>
    <Frame id="sample-05" title="好友侧栏 · 紧凑标签栏" description="underline / vertical；保留 Tooltip 的真实 slot 覆写"><Rail /></Frame>
    <Frame id="sample-06" title="实体详情 · Win98 顶部属性页签" description="原 underline / horizontal；紫色连体页签，不是粉色按钮"><Entity /></Frame>
  </div><footer className="demo-footer">组件来源：src/ui/shadcn/tabs.tsx。主题来源：runtime/preview-package/jirai-kei-theme/theme.css。不是 Windows 实机截图；没有修改应用或部署主题。</footer></div></DisabledPreview.Provider></TooltipProvider>;
}
createRoot(document.getElementById('preview-root')!).render(<App />);
