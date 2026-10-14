import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const here=path.dirname(fileURLToPath(import.meta.url));
const design=path.dirname(here), repo=path.resolve(here,'../../..');
const out=process.env.JIRAI_OUT?path.resolve(process.env.JIRAI_OUT):path.join(here,'preview-package/jirai-kei-theme');
const isolated=Boolean(process.env.JIRAI_OUT);
await fs.mkdir(out,{recursive:true});
const read=p=>fs.readFile(p,'utf8');
const original=await read(path.join(repo,'themes/jirai-kei-theme/theme.css'));
let tokens=original.slice(original.indexOf(':root'),original.indexOf('\n}')+2);
const palette={'#161219':'#16112a','#f7eef4':'#f2ebff','#211b25':'#201936','#2b2230':'#2a2147','#f0a8c8':'#ff7fcf','#271722':'#16112a','#c4aab9':'#b9add9','#392a38':'#332650','#ff8899':'#ff6b8a','#564151':'#6c5ce0','#bdb3c2':'#a294c8','#4a293d':'#4a3784','#b9cfa9':'#6fe3d3','#e0b97f':'#ffd36f','#ad80d7':'#8f7fe0','0.5rem':'2px'};
for(const [a,b]of Object.entries(palette))tokens=tokens.split(a).join(b);
// `none` is not a valid item inside the app's comma-separated box-shadow list; it voided the whole workspace frame.
tokens=tokens.replace('--vrcx-0-main-content-lift: none;','--vrcx-0-main-content-lift: 0 0 #0000;');
const fonts=await read(path.join(design,'fonts/fonts-body.css'));
const notices=await Promise.all(['OFL-Fusion-Pixel.txt','OFL-Silkscreen.txt'].map(n=>read(path.join(design,'fonts',n))));
const fontLicenses=notices.map(t=>'/*! Bundled font license\n'+t.replace(/\*\//g,'* /')+'\n*/').join('\n');
const iconVars=[];
for(const [key,name]of Object.entries({chevron:'chevron-down',clock:'clock',right:'chevron-right',ellipsis:'ellipsis'})){
 let file=path.join(design,'original-assets/icons/src-hand',name+'.svg');
 try{await fs.access(file);}catch{file=path.join(design,'original-assets/icons/src',name+'.svg');}
 const svg=(await read(file)).trim();
 const uri=s=>'url("data:image/svg+xml,'+encodeURIComponent(s)+'")';
 iconVars.push('--wd-icon-'+key+':'+uri(svg));
 iconVars.push('--wd-native-'+key+':'+uri(svg.replace(/#000/g,'#f2ebff')));
}
for(const [key,file,color]of [
 ['cloud','s27-pixel-cloud-small-24x12.svg','#50335f'],
 ['heart','s22-pixel-big-heart-outline-32x28.svg','#48325e'],
 ['stars','s13-pixel-starfield-64x64.svg','#2c2145']]) {
 const svg=(await read(path.join(design,'original-assets/src',file))).trim().replace(/#000/g,color);
 iconVars.push('--wd-bg-'+key+':url("data:image/svg+xml,'+encodeURIComponent(svg)+'")');
}
// Reuse original bow and double-line pixel heart as a readable ribbon charm, not an abstract mascot.
const inner=s=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const bow=inner((await read(path.join(design,'original-assets/src/s6-bow-32x20.svg'))).trim()).replace(/#000/g,'#ac8ac5');
const heart=inner((await read(path.join(design,'original-assets/src/s22-pixel-big-heart-outline-32x28.svg'))).trim()).replace(/#000/g,'#b47ca8');
const charm='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80"><g transform="translate(8 0) scale(1.5)">'+bow+'</g><path fill="#826597" d="M31 31h2v3h-2m0 3h2v3h-2m0 3h2v3h-2"/><g transform="translate(12 44) scale(1.25)">'+heart+'</g></svg>';
// Isolated builds must not mutate the source tree; only the default local build refreshes this reference SVG.
if(!isolated)await fs.writeFile(path.join(here,'ribbon-heart-charm.svg'),charm+'\n');
iconVars.push('--wd-bg-ribbon-charm:url("data:image/svg+xml,'+encodeURIComponent(charm)+'")');
const avatarRing='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><path fill="#000" fill-rule="evenodd" d="M8 0H24V2H28V4H30V8H32V24H30V28H28V30H24V32H8V30H4V28H2V24H0V8H2V4H4V2H8Z M8 2H24V4H28V8H30V24H28V28H24V30H8V28H4V24H2V8H4V4H8Z"/></svg>';
iconVars.push('--wd-avatar-ring:url("data:image/svg+xml,'+encodeURIComponent(avatarRing)+'")');
const nativeIcons=':root{'+iconVars.join(';')+'}';
const parts=[['tokens',tokens],['native-icons',nativeIcons],['assets',await read(path.join(design,'original-assets/dist/jirai-assets.css'))],['fonts',fontLicenses+'\n'+fonts],['icons',await read(path.join(design,'original-assets/icons/dist/jirai-icons.css'))],['runtime',await read(path.join(here,'windose-runtime.css'))],['window-chrome',await read(path.join(here,'window-chrome.css'))],['group-spacing',await read(path.join(here,'group-spacing.css'))],['body-typography',await read(path.join(here,'fonts-pixel-body.css'))],['side-panel',await read(path.join(here,'side-panel-r4.css'))],['feed-badges',await read(path.join(here,'feed-badges.css'))],['settings',await read(path.join(here,'settings-pixel.css'))],['pixel-controls',await read(path.join(here,'pixel-controls.css'))],['assets-r5',await read(path.join(design,'original-assets/r5/assets-r5.css'))],['motion',await read(path.join(here,'motion-r5.css'))],['navigation-r7',await read(path.join(here,'navigation-r7.css'))],['motion-r7',await read(path.join(here,'motion-r7.css'))],['assets-r7',await read(path.join(design,'original-assets/r7-backgrounds/assets-r7.css'))],['backgrounds-r7',await read(path.join(here,'backgrounds-r7.css'))],['chrome-r8',await read(path.join(here,'chrome-r8.css'))],['bio-diff-r8',await read(path.join(here,'bio-diff-r8.css'))],['motion-r8',await read(path.join(here,'motion-r8.css'))],['cat-r8-final',await read(path.join(here,'cat-r8-final.css'))],['user-dialog-r8',await read(path.join(here,'user-dialog-r8.css'))],['login-r8',await read(path.join(here,'login-r8.css'))],['user-dialog-r9',await read(path.join(here,'user-dialog-r9.css'))],['badge-r9',await read(path.join(here,'badge-r9.css'))],['controls-r9',await read(path.join(here,'controls-r9.css'))],['popups-r9',await read(path.join(here,'popups-r9.css'))],['tools-ui-r9',await read(path.join(here,'tools-ui-r9.css'))],['avatars-status-r9',await read(path.join(here,'avatars-status-r9.css'))],['brand-heart-r9',await read(path.join(here,'brand-heart-r9.css'))],['loader-r9',await read(path.join(here,'loader-r9.css'))],['form-controls-r9',await read(path.join(here,'form-controls-r9.css'))],['dialogs-r9',await read(path.join(here,'dialogs-r9.css'))],['fields-toolbar-r10',await read(path.join(here,'fields-toolbar-r10.css'))],['overlays-r10',await read(path.join(here,'overlays-r10.css'))],['favorites-r9',await read(path.join(here,'favorites-r9.css'))],['browse-history-r9',await read(path.join(here,'browse-history-r9.css'))],['buttons-badges-r10',await read(path.join(here,'buttons-badges-r10.css'))],['data-surfaces-r10',await read(path.join(here,'data-surfaces-r10.css'))],['banner-frame-r96',await read(path.join(here,'banner-frame-r96.css'))],['privacy-lock-r96',await read(path.join(here,'privacy-lock-r96.css'))],['brand-heart-r97',await read(path.join(here,'brand-heart-r97.css'))],['cat-motion-r96',await read(path.join(here,'cat-motion-r96.css'))]];
parts.push(['dialog-header-r97',await read(path.join(here,'dialog-header-r97.css'))],['loader-r97',await read(path.join(here,'loader-r97.css'))],['cards-r97',await read(path.join(here,'cards-r97.css'))],['splitter-r97',await read(path.join(here,'splitter-r97.css'))],['language-badges-r98',await read(path.join(here,'language-badges-r98.css'))],['status-icons-r10',await read(path.join(here,'status-icons-r10.css'))],['nav-phone-r10',await read(path.join(here,'nav-phone-r10.css'))]);
const css='/* LOCAL PREVIEW DRAFT: Windose × Jirai. Not release validated. */\n'+parts.map(([n,s])=>'/* SECTION '+n+' */\n'+s).join('\n');
const bytes=Buffer.byteLength(css);if(bytes>1048576)throw Error('CSS exceeds 1 MiB');
if(/@import\b/.test(css))throw Error('Unexpected @import');
await fs.writeFile(path.join(out,'theme.css'),css);
// Prefer the task-specific fixture screenshot, then the current-theme preview and legacy fallbacks.
let previewSource=path.join(here,'checks/status-icons-r10/preview.png');
try{await fs.access(previewSource);}catch{previewSource=path.join(here,'checks/preview/preview.png');}
try{await fs.access(previewSource);}catch{previewSource=path.join(here,'checks/r3-source-main.png');}
try{await fs.access(previewSource);}catch{previewSource=path.join(design,'mockups/windose-dark/windose-dark-main.png');}
const oldManifest=JSON.parse(await read(path.join(repo,'themes/jirai-kei-theme/theme.json')));
const manifest={...oldManifest,name:'Jirai Kei · Windose Dark (Local Preview R9.7)',version:'1.3.0-preview.7',description:'Dark pixel desktop × jirai: pixel window chrome and dialogs, corrected assistant header, pixel cards and outward lace, pixel charm, routed loading dancers, pixel splitters, pixel heart, mini-window popups/tooltips/toasts, forms, badges, favorites, avatars and game-art backgrounds. Local preview; no remote assets.',testedWith:'0.0.0-unverified',remoteAssets:false};
await fs.writeFile(path.join(out,'theme.json'),JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile(path.join(out,'README.md'),'# Jirai Kei · Windose Dark — R9.7 本地预览\n\nR9.7：修正 AI 助手弹窗头部横排；页面/区块加载统一为跳舞像素精灵、行内与按钮转圈保持小像素环；工具页与设置页卡片统一，蕾丝改为外挂真像素边；标题挂饰更换为用户选择的双色药丸；面板分隔条像素化；品牌心重绘为原生 9×7 / 10×8 / 11×9 网格。\n\nR9.6d：标题栏跳动爱心整体缩小 30%；导航底部与 SOCIAL 角落的猫猫头改为约 2 秒一轮的明显像素跳跃（导航猫最高 8px、SOCIAL 猫 4px，不再变暗），减少动效时静止。\n\nR9.6c：状态栏顶边蕾丝改为真镂空——描边画在布面内侧、三个孔眼透出窗底，去掉平铺竖纹，布面与状态栏同色、无底线。\n\nR9.6b：导航/SOCIAL/登录猫猫头恢复 Steam :needy_cat: 18×18 低清像素；设置图标重画为 8 齿对称像素齿轮；标题栏品牌心改为原生 5×5/7×7/9×9 三副多色像素心（深紫描边，不再纯黑），按 0.5s 小-小-中-大-中 切换；隐私锁屏改为 Windose 窗卡、像素标题与方形状态灯。\n\nR9.6a：用户详情 banner 加穿孔数字边·介质盒相框（跨照片边与卡框，旧十字绣/底扇贝提亮）；表格选中行/表头/空状态/日历/分隔条/卡片页脚/Feed 栏/活动色阶 Windose 化；好友列表与弹窗等处用户头像像素圆补全，群组方形头像恢复原圆角且无黑角；浏览历史与收藏页收尾。\n\nR9.5：用户头像改为更圆的 32/16 格像素圆遮罩并去掉主题自加的头像环/边框（保留 VRChat 头像框与方形状态灯）；二级弹窗 Windose 窗口化；复选框/滑块/Select/工具栏搜索/筛选片像素化；tooltip、hover card、toast、通知中心浮层；收藏页；按钮 variant/徽章/分页/Alert；品牌心按 0.5s 小-小-中-大-中 跳动；加载中改为像素精灵。以下 R8/R9 说明中关于头像描边的描述已被 R9.5 取代。\n\n在 Community Themes 开发者选项中加载本目录；不要替换应用配置。停止本地预览即可恢复选定主题。目录仅包含 theme.css、theme.json、README.md、preview.webp。所有图片与字体均内嵌，不请求远程资源。\n\nR8 包含统一窗口标题栏、导航层级、SOCIAL 18px 与导航空档 36px needy_cat、扇形像素蕾丝、浅粉状态栏、200px 暗色角图、刷新/回转图标、签名历史 diff、详情切角头像与方形状态灯、像素滑条，以及登录页窗口卡片。R9 增加迷你窗口风格的弹出菜单（斜切粉条选中项、方形状态灯、像素切角列表头像）、主内容区统一的像素分段控件、活动页像素窗体卡片、高对比闪烁通知徽章，并修正详情 banner 头像切角黑角、加强 banner 花纹。动效采用 steps()，尊重 prefers-reduced-motion。保留 VRChat/App 头像框和原始状态颜色。快速搜索暂保留 R8。\n\npreview.webp 是使用虚构数据、标注 NOT WINDOWS 的当前 CSS DOM fixture，不是真实好友截图，也不是 Windows 验收证明。本包仍是本地预览草稿，整体与动效需用户实机确认。\n\nLucide 派生图标在 CSS 保留 ISC/Feather MIT 许可；Fusion Pixel 与 Silkscreen 字体保留 OFL 许可。NEEDY STREAMER OVERLOAD/Steam/Fandom 相关猫表情及角图是用户个人粉丝用途素材，版权归原权利人，不宣称原创，不应作为独立素材包再分发。自绘装饰按项目许可。\n');
const require=createRequire(import.meta.url);const sharp=require(process.env.SHARP_MODULE||'sharp');
await sharp(previewSource).resize({width:1200}).webp({quality:80}).toFile(path.join(out,'preview.webp'));
const previewBytes=(await fs.stat(path.join(out,'preview.webp'))).size;if(previewBytes>262144)throw Error('Preview exceeds 256 KiB');
const report={cssBytes:bytes,limit:1048576,previewSource,sections:parts.map(([name,s])=>({name,bytes:Buffer.byteLength(s)})),previewBytes,output:out};
await fs.writeFile(path.join(here,'build-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
