// 01-envelope-r2 · 拟物像素家族：16×16 格（与现有 svg.lucide 盒相同），光源左上，1px #21132d 描边，每个图标用自己的固有色。
// 字母 → 颜色见 PAL。'.' 透明。
const N=16;
const blank=(w=N)=>Array.from({length:w},()=>Array(w).fill('.'));
const out=g=>g.map(r=>r.join(''));
const put=(g,x,y,rows)=>rows.forEach((r,j)=>[...r].forEach((c,i)=>{if(c!=='.')g[y+j][x+i]=c}));
const N4=[[1,0],[-1,0],[0,1],[0,-1]];
const G={};
// 轮廓工具：rows=剪影（'#'/非'.'为实体）→ 描边 K，内部按 painter(x,y,{u,l,d,r}) 上色
function paintSil(rows,painter,w=N){const has=(x,y)=>!!rows[y]?.[x]&&rows[y][x]!=='.';
 const edge=(x,y)=>has(x,y)&&N4.some(([dx,dy])=>!has(x+dx,y+dy));const g=blank(w);
 for(let y=0;y<w;y++)for(let x=0;x<w;x++){if(!has(x,y))continue;
  g[y][x]=edge(x,y)?'K':painter(x,y,{u:edge(x,y-1),l:edge(x-1,y),d:edge(x,y+1),r:edge(x+1,y)})}
 return g}
const bev=(base,hi,lo)=>(x,y,e)=>{const a=e.u||e.l,b=e.d||e.r;return a&&!b?hi:b&&!a?lo:base};
const sil=(rows)=>rows.map(r=>[...r]);

// ① 信封（未读）：沿用上上轮 Sonnet A「封蜡心信」（白信封 + 粉爱心封蜡），原位原形，未做改动
{const g=blank();
 for(let x=0;x<15;x++){g[2][x]='K';g[11][x]='K'}
 for(let y=3;y<=10;y++){g[y][0]='K';g[y][14]='K';for(let x=1;x<=13;x++)g[y][x]='W'}
 for(let k=0;k<6;k++){g[3+k][1+k]='K';g[3+k][13-k]='K'}g[9][7]='K';
 for(let x=1;x<=13;x++)if(g[10][x]==='W')g[10][x]='P';
 put(g,4,5,['.KK.KK.','KWHHHHK','KHHHHHK','.KHHHK.','..KHK..','...K...']);
 G.envelope=out(g)}

// ② 铃铛（无未读）：金色小铃，左上高光、右下暗金，黑色铃舌
G.bell=[
'................','.......KK.......','......KyyK......','.....KyggoK.....','....KyggggoK....','....KyggggoK....','....KyggggoK....','...KyggggggoK...',
'...KyggggggoK...','..KyggggggggoK..','.KyggggggggggoK.','.KKKKKKKKKKKKKK.','......KooK......','.......KK.......','................','................'];

// ③ AI：Gemini 式凹弧四角星（星形剪影 |x|^0.7+|y|^0.7≤R^0.7），大星左下、小星右上（沿用 lucide sparkles 构图）；内部按左上→右下 亮蓝→蓝→紫→粉
const star=(size,R,p)=>{const c=(size-1)/2;return Array.from({length:size},(_,y)=>[...Array(size)].map((_,x)=>(Math.abs(x-c)/R)**p+(Math.abs(y-c)/R)**p<=1.0001?'#':'.').join(''))};
const gem=(rows,ox,oy,ramp,g)=>{const has=(x,y)=>rows[y]?.[x]==='#';const edge=(x,y)=>N4.some(([dx,dy])=>!has(x+dx,y+dy));const ts=[];
 rows.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='#'&&!edge(x,y))ts.push(x+y)}));const t0=Math.min(...ts),t1=Math.max(...ts)+.01;
 rows.forEach((r,y)=>[...r].forEach((c,x)=>{if(c!=='#')return;g[oy+y][ox+x]=edge(x,y)?'K':ramp[Math.floor((x+y-t0)/(t1-t0)*ramp.length)]}))};
{const g=blank();gem(star(13,6.6,.7),0,3,['a','b','b','v','q'],g);gem(['..#..','.###.','#####','.###.','..#..'],11,0,['b','v','q'],g);G.sparkles=out(g)}

// ④ 置顶：📌 红色圆头图钉，斜插（针尖朝左下），圆头左上高光、右下暗红
G.pin=[
'................','................','.........KKKK...','........KhhrrK..','.......KhhrrrrK.','.......KhrrrrrK.','.....KKKrrrrrdK.','....KcdKrrrrrdK.',
'.....KcdKrrrdK..','......KcdKKKK...','.....KzKKK......','....KzK.........','...KzK..........','..KzK...........','.KzK............','..K.............'];

// ⑤ 侧栏开关：迷你 Win98 窗口（蓝标题栏 + 右侧栏）；显示态=右栏薰衣草色，隐藏态=右栏留白 + 左向 chevron（沿用原 panel-right-open 语义）
const win=(pane)=>{const r=[];r.push('................','................','.KKKKKKKKKKKKKK.','.KuuuuuuuuuuuuK.','.KttttttttttttK.');
 for(let i=0;i<7;i++)r.push(pane?'.KWWWWWWWKllllK.':'.KWWWWWWWKWWWWK.');
 r.push(pane?'.KPPPPPPPKmmmmK.':'.KPPPPPPPKPPPPK.','.KKKKKKKKKKKKKK.','................','................');return r.map(s=>[...s])};
G['panel-right']=out(win(true));
{const g=win(false);[[6,6],[5,7],[4,8],[4,9],[5,10],[6,11]].forEach(([x,y])=>g[y+1][x]='K');G['panel-right-open']=out(g)}

// ⑥ 侧边栏模式：石墙 + 薄荷箭头（方向沿用现状：arrow-right-to-line 墙在左、箭头朝右；arrow-left-from-line 镜像）
const wallRows=['KKKK','KWlK','KWlK','KmmK','KWlK','KWlK','KmmK','KWlK','KWlK','KmmK','KWlK','KKKK'];
const arrowSil=(mirror)=>{const rows=Array.from({length:N},()=>Array(N).fill('.'));
 const col=(x,y0,y1)=>{for(let y=y0;y<=y1;y++)rows[y][mirror?15-x:x]='#'};
 for(let x=6;x<=9;x++)col(x,6,9);col(10,4,11);col(11,5,10);col(12,6,9);col(13,7,8);return rows};
const wallArrow=(mirror)=>{const g=paintSil(arrowSil(mirror),bev('e','E','f'));
 put(g,mirror?11:1,2,wallRows);return out(g)};
G['arrow-right-to-line']=wallArrow(false);G['arrow-left-from-line']=wallArrow(true);

// ⑦ 放大镜（评估项）：玻璃镜片（白高光/蓝暗部）+ 左上… 柄为金色斜杆，描边同家族
const lensSil=(rows)=>rows;
{const rows=['....#####....','...#######...','..#########..','..#########..','..#########..','..#########..','..#########..','...#######...','....#####....'].map(s=>s.padEnd(16,'.'));
 const g=blank();const base=paintSil([...Array(2).fill('.'.repeat(16)),...rows,...Array(5).fill('.'.repeat(16))].map(s=>s.slice(0,16)),bev('j','J','k'));
 for(let y=0;y<N;y++)for(let x=0;x<N;x++)g[y][x]=base[y][x];
 // 柄
 const core=[[10,10],[11,11],[12,12],[13,13]];core.forEach(([x,y])=>{g[y][x]='g'});
 core.forEach(([x,y])=>N4.forEach(([dx,dy])=>{if(g[y+dy][x+dx]==='.'||(g[y+dy][x+dx]!=='g'&&!(x+dx<=9&&y+dy<=10)))g[y+dy][x+dx]='K'}));
 g[13][13]='o';G.search16=out(g)}
// 12×12 原生格（搜索框内）
{const rows=['...###......','..#####.....','.#######....','.#######....','.#######....','..#####.....','...###......','............','............','............','............','............'];
 const g=paintSil(rows,bev('j','J','k'),12);[[7,7],[8,8],[9,9]].forEach(([x,y])=>{g[y][x]='g'});
 [[7,8],[8,7],[8,9],[9,8],[9,10],[10,9],[10,10]].forEach(([x,y])=>{if(g[y][x]==='.')g[y][x]='K'});G.search12=out(g)}
export const GRIDS=G;
export const ORDER=['bell','envelope','sparkles','pin','panel-right','panel-right-open','arrow-right-to-line','arrow-left-from-line','search16','search12'];
export const PAL={K:'#21132d',W:'#fff1f8',P:'#ffb8e6',H:'#ff7fcf',
 y:'#fff4b0',g:'#f7c548',o:'#c98a1c',
 a:'#b8d4ff',b:'#5c8cf6',v:'#a070e0',q:'#ef6fa0',
 h:'#ff9bb0',r:'#e62e55',d:'#a3173f',c:'#ff5a7a',z:'#e6e9f5',Z:'#9aa0c4',
 t:'#4a46d8',u:'#8f8cff',l:'#b9add9',m:'#8f80c4',
 e:'#6fe3d3',E:'#d4fff7',f:'#2aa595',
 j:'#86c8f7',J:'#ffffff',k:'#3f86d6'};
export function validate(){const bad=[];for(const n of ORDER){const g=GRIDS[n];const w=n==='search12'?12:16;if(g.length!==w)bad.push(n+' rows '+g.length);g.forEach((r,i)=>{if(r.length!==w)bad.push(n+' r'+i+' len '+r.length);[...r].forEach(c=>{if(c!=='.'&&!PAL[c])bad.push(n+' color '+c)})})}return bad}
