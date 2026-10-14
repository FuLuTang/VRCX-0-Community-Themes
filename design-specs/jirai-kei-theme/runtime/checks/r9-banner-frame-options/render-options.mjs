import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = here;
const appCssPath = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css';
const themeCssPath = '/tmp/jirai-lead-r95c/jirai-kei-theme/theme.css';
const [appCss, themeCss] = await Promise.all([
  fs.readFile(appCssPath, 'utf8'),
  fs.readFile(themeCssPath, 'utf8')
]);
const colors = { ink:'#16112a', navy:'#2a2147', violet:'#6c5ce0', pink:'#ffb8e6', hot:'#ff7fcf', lace:'#F3ADD9', ivory:'#fdf4ff' };
const W = 328, H = 248;
const outerRing = 'M12 0H316V4H320V8H324V12H328V236H324V240H320V244H316V248H12V244H8V240H4V236H0V12H4V8H8V4H12Z';
const innerRing = 'M12 8H316V12H320V16H324V232H320V236H316V240H12V236H8V232H4V16H8V12H12Z';
const ring = `<path fill="${colors.ink}" fill-rule="evenodd" d="${outerRing} ${innerRing}"/><path d="M12 4H316M12 244H316M4 12V236M324 12V236" fill="none" stroke="${colors.violet}" stroke-width="2"/>`;
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${body}</svg>`;
const cornerBrackets = (main=colors.pink, accent=colors.ivory, center=colors.violet) => {
  const local = `<path d="M0 0H12V4H4V12H0Z" fill="${main}"/><rect x="4" y="4" width="4" height="4" fill="${accent}"/><rect x="5" y="5" width="2" height="2" fill="${center}"/>`;
  return `<g>${[[0,0,''],[W,0,'translate(328 0) scale(-1 1)'],[0,H,'translate(0 248) scale(1 -1)'],[W,H,'translate(328 248) scale(-1 -1)']].map(([, ,t])=>`<g transform="${t}">${local}</g>`).join('')}</g>`;
};
const fanCorners = `<g fill="${colors.violet}"><path d="M0 0H16V3H12V6H8V9H4V12H0Z"/><path d="M328 0H312V3H316V6H320V9H324V12H328Z"/><path d="M0 248H16V245H12V242H8V239H4V236H0Z"/><path d="M328 248H312V245H316V242H320V239H324V236H328Z"/></g><g fill="${colors.ivory}"><rect x="5" y="4" width="3" height="3"/><rect x="320" y="4" width="3" height="3"/><rect x="5" y="241" width="3" height="3"/><rect x="320" y="241" width="3" height="3"/></g>`;

const candidates = [
  {
    id:'01', slug:'scallop-eyelet-bezel', name:'扇贝孔眼 · 电子相框',
    source:'灵感：assets-redistributable/lace/scallop-eyelet-frame-navy.svg；像素图案为本任务原创重绘，不嵌入源 SVG。',
    license:'候选新稿 GPL-3.0-only；参考素材许可/来源未核实，仅灵感、不随包。',
    design:'全周 8px 深色底轨，粉色阶梯扇贝与象牙孔眼；四角对称铆钉。',
    svg:svg(`<defs><pattern id="scallop" width="16" height="8" patternUnits="userSpaceOnUse"><path d="M0 0H16V1H14V3H12V5H10V7H6V5H4V3H2V1H0Z" fill="${colors.pink}"/><rect x="6" y="3" width="4" height="2" fill="${colors.ivory}"/><rect x="7" y="3" width="2" height="2" fill="${colors.violet}"/><rect width="16" height="1" fill="${colors.ivory}"/></pattern><pattern id="eyeletSide" width="8" height="16" patternUnits="userSpaceOnUse"><rect x="1" y="4" width="6" height="8" fill="${colors.pink}"/><rect x="2" y="6" width="4" height="4" fill="${colors.ivory}"/><rect x="3" y="7" width="2" height="2" fill="${colors.violet}"/></pattern></defs>${ring}<rect x="12" y="0" width="304" height="8" fill="url(#scallop)"/><g transform="translate(0 488) scale(1 -1)"><rect x="12" y="240" width="304" height="8" fill="url(#scallop)"/></g><rect x="0" y="12" width="8" height="224" fill="url(#eyeletSide)"/><rect x="320" y="12" width="8" height="224" fill="url(#eyeletSide)"/>${cornerBrackets(colors.hot,colors.ivory,colors.violet)}`)
  },
  {
    id:'02', slug:'fan-lace', name:'扇形蕾丝 · 展开花瓣',
    source:'original-assets/src/s2-fan-lace-20x12.svg（项目自绘扇形蕾丝形态）。',
    license:'项目原作，GPL-3.0-only（仓库 LICENSE）；候选文件是新像素重绘。',
    design:'每 24px 一组阶梯扇瓣，内外双层紫/粉；四角向外展开成风扇。',
    svg:svg(`<defs><pattern id="fan" width="24" height="8" patternUnits="userSpaceOnUse"><path d="M0 0H24V1H21V3H18V5H15V7H9V5H6V3H3V1H0Z" fill="${colors.violet}"/><path d="M7 2H17V4H14V6H10V4H7Z" fill="${colors.pink}"/><rect x="11" y="3" width="2" height="2" fill="${colors.ivory}"/></pattern><pattern id="fanSide" width="8" height="24" patternUnits="userSpaceOnUse"><path d="M0 0H8V24H0Z" fill="${colors.violet}"/><path d="M1 7H7V17H1Z" fill="${colors.pink}"/><rect x="3" y="10" width="2" height="4" fill="${colors.ivory}"/></pattern></defs>${ring}<rect x="12" y="0" width="304" height="8" fill="url(#fan)"/><g transform="translate(0 488) scale(1 -1)"><rect x="12" y="240" width="304" height="8" fill="url(#fan)"/></g><rect x="0" y="12" width="8" height="224" fill="url(#fanSide)"/><rect x="320" y="12" width="8" height="224" fill="url(#fanSide)"/>${fanCorners}`)
  },
  {
    id:'03', slug:'scallop-corner-clasp', name:'像素波瓣 · 四角扣片',
    source:'original-assets/r5/src/scallop-edge.svg + lace-corner.svg；同系列像素角花。',
    license:'项目原作，GPL-3.0-only（original-assets/r5/README.md）。',
    design:'低矮 4px 波瓣边 + 靛紫长轨，四角各一枚方形蕾丝扣，头像下方留白。',
    svg:svg(`<defs><pattern id="wave" width="16" height="8" patternUnits="userSpaceOnUse"><rect y="0" width="16" height="2" fill="${colors.violet}"/><path d="M0 2H16V3H14V5H12V7H9V6H7V7H4V5H2V3H0Z" fill="${colors.lace}"/><rect x="6" y="4" width="4" height="2" fill="${colors.ink}"/><rect x="7" y="3" width="2" height="1" fill="${colors.ivory}"/></pattern></defs>${ring}<rect x="12" y="0" width="304" height="8" fill="${colors.navy}"/><rect x="12" y="0" width="304" height="8" fill="url(#wave)"/><g transform="translate(0 488) scale(1 -1)"><rect x="12" y="240" width="304" height="8" fill="${colors.navy}"/><rect x="12" y="240" width="304" height="8" fill="url(#wave)"/></g><path d="M0 12H8V236H0ZM320 12H328V236H320Z" fill="${colors.violet}"/><g fill="${colors.hot}"><rect x="1" y="16" width="6" height="2"/><rect x="1" y="230" width="6" height="2"/><rect x="321" y="16" width="6" height="2"/><rect x="321" y="230" width="6" height="2"/></g>${cornerBrackets(colors.violet,colors.ivory,colors.hot)}`)
  },
  {
    id:'04', slug:'loop-stitch-piping', name:'环线缝迹 · 软边包线',
    source:'assets-redistributable/pattern/stitch-loop-frame-1.svg（Arvin61r58 / Openclipart）。',
    license:'源 SVG 内嵌 CC0 1.0；本候选是简化配色像素改绘，保留来源注明。',
    design:'乳白短环线沿紫色包边重复，角落以交错线结收束，轻量不抢照片。',
    svg:svg(`<defs><pattern id="stitch" width="12" height="8" patternUnits="userSpaceOnUse"><path d="M1 2H4V3H5V5H7V3H8V2H11" fill="none" stroke="${colors.ivory}" stroke-width="2"/><rect x="5" y="3" width="2" height="1" fill="${colors.hot}"/></pattern><pattern id="stitchSide" width="8" height="12" patternUnits="userSpaceOnUse"><path d="M2 1V4H3V5H5V7H3V8H2V11" fill="none" stroke="${colors.ivory}" stroke-width="2"/></pattern></defs>${ring}<path d="M12 1H316V7H12ZM1 12H7V236H1ZM321 12H327V236H321ZM12 241H316V247H12Z" fill="${colors.violet}"/><rect x="12" y="0" width="304" height="8" fill="url(#stitch)"/><g transform="translate(0 488) scale(1 -1)"><rect x="12" y="240" width="304" height="8" fill="url(#stitch)"/></g><rect x="0" y="12" width="8" height="224" fill="url(#stitchSide)"/><rect x="320" y="12" width="8" height="224" fill="url(#stitchSide)"/>${cornerBrackets(colors.hot,colors.ivory,colors.violet)}`)
  },
  {
    id:'05', slug:'window-corner-rails', name:'窗口角轨 · 像素窗框',
    source:'original-assets/r5/src/window-corner.svg（窗口角素材，项目自绘）。',
    license:'项目原作，GPL-3.0-only（original-assets/r5/README.md）。',
    design:'细紫色电子轨道只在四角加粗，粉色像素灯点；留出照片呼吸感。',
    svg:svg(`<path d="M12 4H316M12 244H316M4 12V236M324 12V236" fill="none" stroke="${colors.violet}" stroke-width="2"/><path d="M0 16V4H4V0H20V4H8V8H4V20H0ZM328 16V4H324V0H308V4H320V8H324V20H328ZM0 232V244H4V248H20V244H8V240H4V228H0ZM328 232V244H324V248H308V244H320V240H324V228H328Z" fill="${colors.ink}"/><path d="M2 16V6H6V2H20V6H8V10H4V20H2ZM326 16V6H322V2H308V6H320V10H324V20H326ZM2 232V242H6V246H20V242H8V238H4V228H2ZM326 232V242H322V246H308V242H320V238H324V228H326Z" fill="${colors.pink}"/><g fill="${colors.ivory}"><rect x="4" y="4" width="2" height="2"/><rect x="322" y="4" width="2" height="2"/><rect x="4" y="242" width="2" height="2"/><rect x="322" y="242" width="2" height="2"/></g><g fill="${colors.hot}"><rect x="12" y="4" width="4" height="2"/><rect x="312" y="4" width="4" height="2"/><rect x="12" y="242" width="4" height="2"/><rect x="312" y="242" width="4" height="2"/></g>`)
  },
  {
    id:'06', slug:'perforated-digital-bezel', name:'穿孔数字边 · 介质盒框',
    source:'灵感：assets-redistributable/pattern/perforated-dot-strip.svg；形状为原创方孔重绘，不嵌入源 SVG。',
    license:'候选新稿 GPL-3.0-only；参考素材授权/来源未核实，仅灵感、不随包。',
    design:'深色粗框、粉/象牙方孔节奏与四角状态灯，最像电子设备面板。',
    svg:svg(`<defs><pattern id="perfs" width="16" height="8" patternUnits="userSpaceOnUse"><rect x="2" y="2" width="4" height="4" fill="${colors.ivory}"/><rect x="3" y="3" width="2" height="2" fill="${colors.ink}"/><rect x="10" y="1" width="4" height="6" fill="${colors.hot}"/><rect x="11" y="2" width="2" height="4" fill="${colors.pink}"/></pattern><pattern id="perfsV" width="8" height="16" patternUnits="userSpaceOnUse"><rect x="2" y="2" width="4" height="4" fill="${colors.ivory}"/><rect x="3" y="3" width="2" height="2" fill="${colors.ink}"/><rect x="1" y="10" width="6" height="4" fill="${colors.hot}"/></pattern></defs>${ring}<rect x="12" y="0" width="304" height="8" fill="url(#perfs)"/><rect x="12" y="240" width="304" height="8" fill="url(#perfs)"/><rect x="0" y="12" width="8" height="224" fill="url(#perfsV)"/><rect x="320" y="12" width="8" height="224" fill="url(#perfsV)"/><g fill="${colors.pink}"><rect x="0" y="0" width="12" height="4"/><rect x="0" y="0" width="4" height="12"/><rect x="316" y="0" width="12" height="4"/><rect x="324" y="0" width="4" height="12"/><rect x="0" y="244" width="12" height="4"/><rect x="0" y="236" width="4" height="12"/><rect x="316" y="244" width="12" height="4"/><rect x="324" y="236" width="4" height="12"/></g><g fill="${colors.ivory}"><rect x="4" y="4" width="4" height="4"/><rect x="320" y="4" width="4" height="4"/><rect x="4" y="240" width="4" height="4"/><rect x="320" y="240" width="4" height="4"/></g><g fill="${colors.violet}"><rect x="5" y="5" width="2" height="2"/><rect x="321" y="5" width="2" height="2"/><rect x="5" y="241" width="2" height="2"/><rect x="321" y="241" width="2" height="2"/></g>`)
  }
];

const htmlEscape = (value) => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const dataUri = (content) => `data:image/svg+xml;base64,${Buffer.from(content).toString('base64')}`;
const cssUri = (content) => encodeURIComponent(content).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240" shape-rendering="crispEdges"><rect width="320" height="240" fill="#8f7fe0"/><rect x="0" y="0" width="320" height="240" fill="#6c5ce0" opacity=".18"/><path d="M0 0H320V90H0Z" fill="#2a2147" opacity=".18"/><rect x="212" y="28" width="44" height="44" fill="#ffd36f"/><path d="M0 166 55 112 99 158 146 118 208 174 256 130 320 172V240H0Z" fill="#6fe3d3"/><path d="M0 190 52 158 94 184 148 147 202 188 248 160 320 198V240H0Z" fill="#ffb8e6"/><path d="M0 215 62 195 119 218 185 187 241 213 320 190V240H0Z" fill="#d6b8ef"/><rect x="0" y="232" width="320" height="8" fill="#36476f"/></svg>`;
const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" shape-rendering="crispEdges"><rect width="64" height="64" fill="#b9add9"/><path d="M9 24V16H17V10H47V16H55V24H59V47H53V55H11V48H5V27H9Z" fill="#6c5ce0"/><rect x="18" y="25" width="5" height="5" fill="#16112a"/><rect x="41" y="25" width="5" height="5" fill="#16112a"/><rect x="25" y="39" width="14" height="4" fill="#d97fc6"/><rect x="0" y="56" width="64" height="8" fill="#f3add9"/></svg>`;
const cssRules = [];
for (const candidate of candidates) {
  const rule = `.frame-${candidate.id}{background-image:url("data:image/svg+xml,${cssUri(candidate.svg)}")}`;
  candidate.cssBytes = Buffer.byteLength(rule);
  cssRules.push(rule);
}
const cardHtml = candidates.map((candidate) => `
  <article class="option-card">
    <header class="option-head"><span class="option-number">${candidate.id}</span><div><h2>${htmlEscape(candidate.name)}</h2><p><b>素材</b> ${htmlEscape(candidate.source)}</p><p><b>许可</b> ${htmlEscape(candidate.license)}</p><p class="css-estimate"><b>CSS 估算</b> ${candidate.cssBytes.toLocaleString('en-US')} B · 单份 percent-encoded SVG data URI + 单条 background-image 规则</p></div></header>
    <section class="entity-dialog" data-slot="dialog-content" aria-label="Candidate ${candidate.id}">
      <div data-slot="card" data-size="sm" class="profile-card relative isolate overflow-hidden">
        <div data-slot="card-header" class="card-header"><div class="relative banner-stage">
          <button data-slot="button" data-variant="ghost" class="bg-muted aspect-[4/3] h-auto w-full overflow-hidden rounded-lg border p-0 banner-button" aria-label="Synthetic landscape banner"><span class="relative size-full"><img alt="Synthetic landscape" src="${dataUri(bannerSvg)}"></span></button>
          <div class="frame-overlay frame-${candidate.id}" aria-hidden="true"></div>
          <div class="absolute bottom-3 left-3 z-30 size-16 avatar-wrap"><button data-slot="button" data-variant="ghost" title="Synthetic pixel avatar" class="bg-background/90 relative z-0 size-full overflow-hidden rounded-full p-0 shadow-md border-2 border-white avatar-button"><img alt="" src="${dataUri(avatarSvg)}"></button></div>
        </div></div>
        <div data-slot="card-content" class="card-content"><div data-slot="card-title" class="nameplate"><span class="flex size-4 shrink-0 items-center justify-center"><span class="rounded-full inline-block size-2.5 shrink-0 align-middle" style="background:#f4e05e"></span></span><strong>Example Member</strong></div></div>
      </div>
    </section>
  </article>`).join('\n');
const fixtureCss = `
*{box-sizing:border-box}
html,body{margin:0;height:auto!important;min-height:0!important;overflow:visible!important;background:#16112a;color:#fdf4ff;font:14px/1.4 system-ui,sans-serif}
body{padding:18px 20px 24px}
.board-head{width:100%;margin:0 0 14px;border-bottom:1px solid #6c5ce0;padding:0 0 10px}
h1{margin:0;color:#ffb8e6;font:700 17px/1.2 ui-monospace,monospace;letter-spacing:.03em}
main{height:auto!important;max-height:none!important;overflow:visible!important}
.board-subtitle{margin:4px 0 0;color:#d6b8ef;font:11px/1.35 ui-monospace,monospace}
.options-grid{display:grid;grid-template-columns:repeat(2,370px);gap:14px;align-items:start;height:auto!important;max-height:none!important;overflow:visible!important}
.option-card{width:370px;min-width:0;padding:9px;background:#201936;border:1px solid #6c5ce0;box-shadow:3px 3px 0 #100b1e}
.option-head{display:grid;grid-template-columns:26px minmax(0,1fr);gap:8px;min-height:88px;margin:0 0 8px;align-items:start}
.option-number{display:grid;place-items:center;width:24px;height:24px;margin-top:1px;background:#ffb8e6;color:#16112a;font:700 12px/1 ui-monospace,monospace;border:1px solid #fdf4ff;box-shadow:2px 2px 0 #6c5ce0}
.option-head h2{margin:0 0 4px;color:#fdf4ff;font:700 12px/1.25 ui-monospace,monospace}
.option-head p{margin:2px 0;color:#d6b8ef;font:9px/1.25 ui-monospace,monospace}
.option-head b{color:#ffb8e6;font-weight:700}
.option-head .css-estimate{color:#fdf4ff}
.entity-dialog{position:relative;inset:auto;transform:none;width:346px;max-width:none;max-height:none;overflow:visible;margin:0;padding:0;background:transparent;border:0;box-shadow:none}
.profile-card{display:flex;flex-direction:column;gap:12px;position:relative;isolation:isolate;overflow:hidden;width:346px;margin:0;padding:12px 0;background:#201936;border:1px solid #6c5ce0;box-shadow:none;border-radius:8px}
.card-header{display:block;position:relative;padding:0 12px;margin:0}
.banner-stage{position:relative;width:320px;height:240px;overflow:visible;isolation:isolate}
.banner-button{position:relative;z-index:1;display:block;width:320px;height:240px;overflow:hidden;padding:0;border:1px solid #6c5ce0;border-radius:8px;background:#2a2147;line-height:0;aspect-ratio:4/3}
.banner-button>span{position:relative;display:block;width:100%;height:100%}
.banner-button>span>img{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover}
.frame-overlay{position:absolute;inset:-4px;z-index:20;display:block;width:328px;height:248px;pointer-events:none;image-rendering:pixelated;background-position:center;background-repeat:no-repeat;background-size:100% 100%}
.avatar-wrap{position:absolute;bottom:12px;left:12px;z-index:30;width:64px;height:64px;overflow:visible}
.avatar-button{position:relative;z-index:0;display:block;width:64px;height:64px;overflow:hidden;padding:0;border:2px solid #fff;border-radius:9999px;background:rgba(18,11,30,.9);box-shadow:0 4px 12px rgba(0,0,0,.62)}
.avatar-button>img{display:block;width:100%;height:100%;object-fit:cover}
.card-content{padding:8px 12px 4px}
.nameplate{display:flex;align-items:center;gap:8px;min-height:22px;color:#f2ebff;font-size:13px}
.size-4{width:16px;height:16px;display:flex;align-items:center;justify-content:center;flex:none}
.size-2\\.5{width:10px;height:10px;flex:none}
.rounded-full{border-radius:9999px}
.inline-block{display:inline-block}
.footer-note{margin:12px 0 0;padding-top:8px;border-top:1px solid #6c5ce0;color:#b9add9;font:10px/1.4 ui-monospace,monospace;max-width:754px}
@media(max-width:810px){body{padding:14px}.options-grid{grid-template-columns:370px}}
`;
const pageHtml = `<!doctype html><html lang="zh-CN" class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>R9.6 Banner frame options · NOT WINDOWS</title><style>${fixtureCss}${cssRules.join('\n')}</style></head><body><header class="board-head"><h1>R9.6 · USER BANNER FRAME OPTIONS</h1><p class="board-subtitle">NOT WINDOWS · 同一张虚构像素横幅 / 同一头像与姓名 · overlay 跨过照片按钮外边线 · 1×、2× 输出</p></header><main class="options-grid">${cardHtml}</main><p class="footer-note">挂载证据：UserDialogHeaderMedia 返回现有外层 .relative 包含按钮和头像；按钮本身 overflow-hidden，按钮 ::before / ::after 与图片 span::after 已占用。候选覆盖层在按钮同级 sibling（等效可挂外层 .relative::before），inset:-4px，pointer-events:none，z-index:20；sm CardHeader 左右 padding=12px，Card 根 overflow-hidden，因此 4px overhang 留在卡片内不被裁；头像 z-30 始终在覆盖层上方。该候选无需改布局；若未来清零 CardHeader padding，需要改挂点或让卡片留出至少 4px 内边距。</p></body></html>`;
await fs.writeFile(path.join(out, 'options-board.html'), pageHtml);
await fs.mkdir(path.join(out, 'candidates'), { recursive:true });
for (const candidate of candidates) await fs.writeFile(path.join(out,'candidates',`${candidate.id}-${candidate.slug}.svg`),candidate.svg);
const manifest = {
  fixture:'NOT WINDOWS; same synthetic 320x240 banner/avatar/name and UserDialogHeaderMedia DOM structure for all six candidates',
  appCss:appCssPath,
  themeCss:themeCssPath,
  mount:'Sibling overlay on existing UserDialogHeaderMedia .relative wrapper; inset -4px across button edge; CardHeader inline padding 12px; root Card overflow hidden; avatar z-30 above overlay',
  candidates:candidates.map(({svg,...candidate})=>candidate),
  cssEstimateMethod:'UTF-8 bytes of one minified selector + background-image CSS declaration with a percent-encoded SVG data URI; excludes common frame positioning rules and theme baseline.',
  assetsReviewed:{
    redistributableLace:'scallop-eyelet-frame-navy.svg, scallop-eyelet-trim-navy.svg, scallop-eyelet-trim-teal.svg, wavy-trim-border.svg, lace-divider-simple.svg: assets-report.md says provenance not individually verified; no license metadata in selected SVGs. Visual reference only; do not embed.',
    redistributablePattern:'stitch-loop-frame-1/2.svg embed CC0 1.0 and creator/source metadata; perforated-dot-strip.svg has no clear license/source in metadata, visual reference only.',
    original:'S1/S2 are original project-authored SVG; repo LICENSE GPL-3.0. R5 README explicitly GPL-3.0-only; no third-party paths embedded.',
    artReferences:'sozaino-ribbon-lace-frame.png and aomaterial-jirai-bg-black-ribbon-frame.png used only as visual reference, not included in candidate SVGs.'
  }
};
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');

const browser = await chromium.launch({headless:true});
const runs=[];
try {
  for (const dpr of [1,2]) {
    const page = await browser.newPage({viewport:{width:840,height:900},deviceScaleFactor:dpr});
    const errors=[];
    page.on('pageerror',(error)=>errors.push(error.message));
    await page.setContent(pageHtml,{waitUntil:'domcontentloaded'});
    await page.addStyleTag({content:appCss});
    await page.addStyleTag({content:themeCss});
    await page.addStyleTag({content:fixtureCss+'\n'+cssRules.join('\n')});
    await page.evaluate(()=>document.fonts.ready);
    const layout = await page.evaluate(()=>({
      scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth, scrollHeight:document.documentElement.scrollHeight, bodyHeight:Math.round(document.body.getBoundingClientRect().height), mainHeight:Math.round(document.querySelector('main').getBoundingClientRect().height),
      cards:[...document.querySelectorAll('.option-card')].map((card)=>{
        const rect=(el)=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
        const banner=card.querySelector('.banner-button'), frame=card.querySelector('.frame-overlay'), root=card.querySelector('.profile-card'), avatar=card.querySelector('.avatar-wrap'), avatarImg=card.querySelector('.avatar-button img'), name=card.querySelector('.nameplate');
        const f=frame.getBoundingClientRect(), r=root.getBoundingClientRect();
        return{id:card.querySelector('.option-number').textContent,...rect(card),display:getComputedStyle(card).display,visibility:getComputedStyle(card).visibility,bannerWidth:Math.round(banner.getBoundingClientRect().width),frameWidth:Math.round(f.width),frameOverhang:{left:Math.round(banner.getBoundingClientRect().left-f.left),top:Math.round(banner.getBoundingClientRect().top-f.top),right:Math.round(f.right-banner.getBoundingClientRect().right),bottom:Math.round(f.bottom-banner.getBoundingClientRect().bottom)},frameInsideCard:f.left>=r.left&&f.top>=r.top&&f.right<=r.right&&f.bottom<=r.bottom,nameTop:Math.round(name.getBoundingClientRect().top),frameBottom:Math.round(f.bottom),avatarZ:getComputedStyle(avatar).zIndex,frameZ:getComputedStyle(frame).zIndex,avatarPixelClip:getComputedStyle(avatarImg).clipPath.startsWith('polygon('),framePointerEvents:getComputedStyle(frame).pointerEvents,frameVisible:getComputedStyle(frame).backgroundImage!=='none'};
      })
    }));
    if (layout.cards.length!==6 || layout.scrollWidth>layout.clientWidth+1 || layout.cards.some((c)=>c.bannerWidth!==320 || c.frameWidth!==328 || !c.frameVisible || !c.frameInsideCard || Number(c.avatarZ)<=Number(c.frameZ) || c.frameOverhang.left!==4 || c.frameOverhang.top!==4 || c.frameOverhang.right!==4 || c.frameOverhang.bottom!==4 || c.frameBottom>c.nameTop || c.framePointerEvents!=='none' || !c.avatarPixelClip)) throw new Error(`Candidate board geometry/stacking/clearance failed at ${dpr}x: ${JSON.stringify(layout)}`);
    if(errors.length) throw new Error(`Browser errors at ${dpr}x: ${errors.join('; ')}`);
    await page.screenshot({path:path.join(out,dpr===1?'options-board.png':'options-board-2x.png'),fullPage:true,scale:dpr===1?'css':'device'});
    runs.push({dpr,layout,errors});
    await page.close();
  }
  await fs.writeFile(path.join(out,'render-metrics.json'),JSON.stringify(runs,null,2)+'\n');
} finally {
  await browser.close();
}
console.log(JSON.stringify({out,candidates:manifest.candidates,boards:['options-board.png','options-board-2x.png']},null,2));
