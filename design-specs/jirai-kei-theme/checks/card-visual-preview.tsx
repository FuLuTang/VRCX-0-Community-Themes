import React from 'react';
import {createRoot} from 'react-dom/client';
import {icons} from 'lucide-react';
import {Replay,props,type Node,type Context} from './preview-replay';
import contexts from './card-contexts.json';
const C=contexts as unknown as Record<string,Context>;
const VOID=new Set(['img','input','br','hr']);
function Fiction({n}:{n:Node}):React.ReactElement {
 const a=props(n.attrs); const slot=n.attrs['data-slot']; const cls=n.attrs.class||'';
 if(n.tag==='svg') {const name=cls.split(/\s+/).find(x=>x.startsWith('lucide-'))?.slice(7).replace(/(^|-)([a-z])/g,(_,x,c)=>c.toUpperCase());const I=(icons as any)[name||'']||icons.Circle;return <I {...props(n.attrs,true)}/>;}
 if(n.tag==='img') return <img {...a} src={undefined} alt="" style={{...(a.style as object),background:'#57436d',minHeight:80}}/>;
 if(n.tag==='input')return <input {...a} readOnly value=""/>;
 if(VOID.has(n.tag))return React.createElement(n.tag,a);
 let child:React.ReactNode=n.children?.map((c,i)=><Fiction key={i} n={c}/>);
 if(!n.children?.length) {
  if(slot==='card-title')child='演示卡片 · 虚构资料';
  else if(slot==='card-description')child='这里是虚构说明，所有个人资料均已移除。';
  else if(['p','label','button','span','h2','h3','a'].includes(n.tag)&&!/(size-|rounded-full|sr-only)/.test(cls))child=n.tag==='button'?'演示操作':'演示说明';
  else if(n.tag==='div'&&/text-(xs|sm|muted)/.test(cls))child='虚构信息 · 仅示意';
 }
 if(slot==='card-title'&&n.children?.length)child=<>{child}<span>演示卡片 · 虚构资料</span></>;
 if(slot==='card-content'&&(!n.children?.length||cls.includes('border-t')))child=<div style={{display:'grid',gap:10,padding:'8px 0'}}><span>虚构分组内容</span><div style={{height:48,background:'repeating-linear-gradient(0deg,#392a52 0 6px,transparent 6px 18px)'}}/></div>;
 if(/aspect-(square|video)/.test(cls))a.style={...(a.style as object),background:'#57436d',minHeight:150};
 return React.createElement(n.tag,a,child);
}
function Card({id}:{id:string}){const ctx=C[id];return <Replay ctx={ctx} leaf={React.createElement(ctx.element.tag,{...props(ctx.element.attrs),'data-jk-target':'',style:{...((props(ctx.element.attrs).style||{}) as object),width:340,maxWidth:'100%'}},ctx.element.children?.map((n,i)=><Fiction key={i} n={n}/>))}/>;}
const rows=[
 ['catalog','主题目录 · sm','22 处同类（主题 / 社区主题）。现状：暗底、微弱内斜边、2px 外投影。'],
 ['catalog-themes','主题入口 · 同一目录','相同组件，不因页面名另做皮肤。'],
 ['settings','设置折叠分组 · default','5 处。保留原有紫标题栏、药丸挂件、蕾丝；外框改为已有媒体卡凸起框。'],
 ['tools','工具折叠分组 · default','20 处（含菜单快照）。和设置同一个 SettingsCard，现状却用伪元素画边。'],
 ['gallery','图库媒体平铺 · sm','19 处。现状 1px 浅紫框、亮暗斜边、1px 硬投影；提案将这个已有框用于默认。'],
 ['inventory','物品媒体平铺 · sm','9 处。仍保留媒体悬停变亮、选中紫底；卡片本体不新增按下位移。'],
 ['dashboard','仪表盘说明 · default','1 处。现状仅 ring + 2px 圆角；内容与主题目录同属静态容器，框可以合并。']
];
function App(){return <main className="demo-document">
 <style>{`.demo-pane{align-items:flex-start;min-height:200px}.demo-pane [data-jk-target]{min-width:260px}.demo-body{width:100%}.demo-row-meta{max-width:250px}.demo-pane img{color:transparent}.demo-pane [data-jk-target] [data-slot="card-title"]{min-height:20px}`}</style>
 <header className="demo-document-header"><div className="demo-eyebrow">CARD · 第②步调查 · 未进入 runtime</div><h1>卡片：选已有的 Win98 凸起面板，不重画一套</h1><p>左：当前合并主题；右：把图库 / 物品媒体卡已用的方角、1px 亮暗斜边与硬投影推广为默认框。保留设置折叠标题栏的原有装饰，sm / default 间距不动。文字全为虚构，图片为色块，按钮、输入、勾选不在本套改动范围。</p><p>媒体卡可悬停；点击设置标题可折叠。未给整个被动容器添加按钮语义、焦点或按下位移。登录页卡片已有专用整页定制，明确不合并。card-action / footer 在 42 张快照里无实例，仅有源码，未伪装成快照代表。</p></header>
 <section className="demo-section"><div className="demo-table"><div className="demo-table-head"><span>真实用法</span><span>现状</span><span>提案：复用现有媒体框</span></div>
 {rows.map(([id,title,note])=><div className="demo-row-compare" data-ctx={id} key={id}><div className="demo-row-meta"><div><h2>{title}</h2><p>{note}</p></div></div>{[false,true].map(proposal=><div className={'demo-pane'+(proposal?' jk-proposal':'')} key={String(proposal)} onClick={e=>{const trigger=(e.target as HTMLElement).closest('[data-slot="collapsible-trigger"]');if(trigger){const card=trigger.closest('[data-slot="card"]');const content=card?.querySelector<HTMLElement>('[data-slot="collapsible-content"]');if(content){const open=trigger.getAttribute('aria-expanded')!=='true';content.hidden=!open;content.style.height=open?'auto':'0px';content.style.display=open?'block':'none';content.toggleAttribute('data-open',open);content.toggleAttribute('data-closed',!open);trigger.setAttribute('aria-expanded',String(open));}}}}><Card id={id}/></div>)}</div>)}
 </div></section><footer className="demo-footer">7 个匿名结构代表，覆盖 5 种计算样式指纹。收藏、图表、实体详情、登录卡在本轮冻结快照里未出现 Card 根；源码存在不等于快照已覆盖。提案只供选择，未修改应用及正式主题。</footer>
 </main>}
createRoot(document.getElementById('preview-root')!).render(<App/>);
