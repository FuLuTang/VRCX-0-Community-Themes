import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = here;
const appCssPath = '/home/fulutang/Documents/Github/VRCX-0-jirai/dist/assets/index-Cckb3vVG.css';
const themeBeforePath = '/tmp/jirai-r96-banner-frame/jirai-kei-theme/theme.before.css';
const themeAfterPath = '/tmp/jirai-r96-banner-frame/jirai-kei-theme/theme.css';
const [appCss, beforeCss, afterCss, fixture] = await Promise.all([
  fs.readFile(appCssPath, 'utf8'),
  fs.readFile(themeBeforePath, 'utf8'),
  fs.readFile(themeAfterPath, 'utf8'),
  fs.readFile(path.join(here, 'fixture.html'), 'utf8')
]);
const fixtureCss = fixture.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!fixtureCss) throw new Error('Fixture CSS block missing');
const pageTemplate = fixture.replace(/<style>[\s\S]*?<\/style>/, '<style></style>');
const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#91b8d1"/><stop offset=".56" stop-color="#d7c7dc"/><stop offset="1" stop-color="#f4b9c8"/></linearGradient><linearGradient id="ridge" x2="0" y2="1"><stop stop-color="#778e83"/><stop offset="1" stop-color="#394c51"/></linearGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="2" seed="17"/><feColorMatrix values=".35 0 0 0 .3 .35 0 0 0 .3 .35 0 0 0 .3 0 0 0 .09 0"/></filter></defs><rect width="320" height="240" fill="url(#sky)"/><circle cx="248" cy="54" r="28" fill="#fbe2c2" opacity=".78"/><path d="M0 105Q30 83 58 103T116 98T177 107T239 99T320 108V155H0Z" fill="#c3bbd0" opacity=".62"/><path d="M0 159 44 111 82 149 121 104 164 152 209 112 256 155 291 121 320 144V240H0Z" fill="#83919e"/><path d="M0 178 42 145 78 169 125 135 168 174 214 139 267 178 301 150 320 162V240H0Z" fill="url(#ridge)"/><path d="M0 202Q46 179 89 198T174 196T252 191T320 197V240H0Z" fill="#475a53"/><path d="M0 219Q59 202 114 218T224 214T320 212V240H0Z" fill="#30463f"/><rect width="320" height="240" filter="url(#grain)" opacity=".15"/></svg>`;
const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" shape-rendering="crispEdges"><rect width="64" height="64" fill="#d6b8ef"/><path d="M9 24V16H17V10H47V16H55V24H59V47H53V55H11V48H5V27H9Z" fill="#6c5ce0"/><rect x="18" y="25" width="5" height="5" fill="#16112a"/><rect x="41" y="25" width="5" height="5" fill="#16112a"/><rect x="25" y="39" width="14" height="4" fill="#d97fc6"/><rect x="0" y="56" width="64" height="8" fill="#f3add9"/></svg>`;
const dataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const banner = dataUri(bannerSvg), avatar = dataUri(avatarSvg);
function userCard(id, tierStyle = '') {
  return `<section data-slot="dialog-content" class="entity-dialog" id="${id}-dialog"><div data-slot="card" data-size="sm" class="profile-card relative isolate overflow-hidden"><div data-slot="card-header" class="card-header"><div class="relative banner-stage" id="${id}-stage" ${tierStyle}><button data-slot="button" data-variant="ghost" id="${id}-button" type="button" aria-label="Example Member banner" class="bg-muted aspect-[4/3] h-auto w-full overflow-hidden rounded-lg border p-0 banner-button"><span class="relative size-full"><img alt="Fictional photo-like landscape" src="${banner}"></span></button><div data-slot="avatar-wrap" class="absolute bottom-3 left-3 z-30 size-16 avatar-wrap"><button data-slot="button" id="${id}-avatar-button" type="button" aria-label="Example Member avatar" title="Example Member avatar" class="bg-background/90 relative z-0 size-full overflow-hidden rounded-full p-0 shadow-md border-2 border-white avatar-button"><img alt="" src="${avatar}"></button></div></div></div><div data-slot="card-content" class="card-content"><div data-slot="card-title" class="nameplate"><span class="status-dot" aria-hidden="true"></span><strong id="${id}-name">Example Member</strong></div></div></div></section>`;
}
function decoyCard(id, kind) {
  if (kind === 'avatar') return `<section data-slot="dialog-content" class="entity-dialog" id="${id}-dialog"><div data-slot="card" class="profile-card"><div data-slot="card-header" class="card-header"><div class="relative decoy-stage" id="${id}-stage"><button data-slot="button" type="button" class="bg-muted aspect-[4/3] h-auto w-full overflow-hidden rounded-lg border p-0 banner-button" id="${id}-button"><img alt="Avatar preview" src="${banner}"></button><div class="absolute top-2 right-2">Platforms</div></div></div><div data-slot="card-content" class="card-content"><div class="nameplate">Avatar preview</div></div></div></section>`;
  if (kind === 'world') return `<section data-slot="dialog-content" class="entity-dialog" id="${id}-dialog"><div data-slot="card" class="profile-card"><div data-slot="card-header" class="card-header world-header"><button data-slot="button" type="button" aria-label="World preview" class="bg-muted aspect-[4/3] h-auto w-full overflow-hidden rounded-lg border p-0 banner-button" id="${id}-button"><img alt="World preview" src="${banner}"></button></div><div data-slot="card-content" class="card-content"><div class="nameplate">World preview</div></div></div></section>`;
  return `<section data-slot="dialog-content" class="entity-dialog" id="${id}-dialog"><div data-slot="card" class="profile-card"><div data-slot="card-header" class="card-header"><div class="relative decoy-stage" id="${id}-stage"><button data-slot="button" type="button" aria-label="Group icon" class="bg-muted aspect-square h-auto w-full overflow-hidden rounded-lg border p-0 banner-button" id="${id}-button"><img alt="Group icon" src="${banner}"></button></div></div><div data-slot="card-content" class="card-content"><div class="nameplate">Group preview</div></div></div></section>`;
}
const tokens = {
  __BEFORE_CARD__: userCard('before'),
  __AFTER_CARD__: userCard('after'),
  __TIER1_CARD__: userCard('tier1'),
  __TIER2_CARD__: userCard('tier2', 'style="--r9-banner-stitch-opacity:.72;--r9-banner-hem-opacity:1"'),
  __AVATAR_DECOY__: decoyCard('avatar-decoy', 'avatar'),
  __WORLD_DECOY__: decoyCard('world-decoy', 'world'),
  __GROUP_DECOY__: decoyCard('group-decoy', 'group')
};
let html = pageTemplate;
for (const [key, value] of Object.entries(tokens)) html = html.replace(key, value);
if (/__[A-Z0-9_]+__/.test(html)) throw new Error('Unexpanded fixture placeholder');

const browser = await chromium.launch({ headless: true });
const metrics = { appCssPath, themeBeforePath, themeAfterPath, dpr: [], decoys: null, reducedMotion: null };
async function pageWith(themeCss, view, dpr = 1, reducedMotion = 'no-preference', viewportHeight = 900) {
  const page = await browser.newPage({ viewport: { width: 840, height: viewportHeight }, deviceScaleFactor: dpr });
  if (reducedMotion !== 'no-preference') await page.emulateMedia({ reducedMotion });
  page.on('pageerror', error => { throw error; });
  await page.setContent(html.replace('data-view="after"', `data-view="${view}"`), { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ content: appCss });
  await page.addStyleTag({ content: themeCss });
  await page.addStyleTag({ content: fixtureCss });
  await page.evaluate(() => document.fonts.ready);
  return page;
}
try {
  for (const [view, themeCss, name] of [['before', beforeCss, 'before.png'], ['after', afterCss, 'after.png'], ['tiers', afterCss, 'tier-comparison.png'], ['decoys', afterCss, 'decoys.png']]) {
    const page = await pageWith(themeCss, view, 1, 'no-preference', view === 'decoys' ? 900 : 560);
    await page.screenshot({ path: path.join(out, name), fullPage: true, scale: 'css' });
    await page.close();
  }

  for (const dpr of [1, 1.25, 1.5, 2]) {
    const page = await pageWith(afterCss, 'after', dpr);
    const data = await page.evaluate(() => {
      const stage = document.querySelector('#after-stage');
      const button = document.querySelector('#after-button');
      const avatarWrap = document.querySelector('#after-dialog .avatar-wrap');
      const avatarImage = document.querySelector('#after-dialog .avatar-button img');
      const name = document.querySelector('#after-name');
      const card = document.querySelector('#after-dialog .profile-card');
      const rect = el => { const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}; };
      const pseudo = (el, which) => getComputedStyle(el, which);
      const f = pseudo(stage, '::before'), stitch = pseudo(button, '::before'), hem = pseudo(button, '::after'), scallop = pseudo(button.querySelector('span'), '::after');
      return {
        stage: rect(stage), button: rect(button), avatar: rect(avatarWrap), name: rect(name), card: rect(card),
        frame: {content:f.content,left:f.left,right:f.right,top:f.top,bottom:f.bottom,zIndex:f.zIndex,pointerEvents:f.pointerEvents,imageRendering:f.imageRendering,animationName:f.animationName},
        stitch: {zIndex:stitch.zIndex,opacity:stitch.opacity,color:stitch.backgroundColor},
        hem: {zIndex:hem.zIndex,opacity:hem.opacity,color:hem.backgroundColor,height:hem.height},
        scallop: {zIndex:scallop.zIndex,opacity:scallop.opacity,backgroundImage:scallop.backgroundImage},
        avatar: {zIndex:getComputedStyle(avatarWrap).zIndex,clipPath:getComputedStyle(avatarImage).clipPath},
        variables: {stitch:getComputedStyle(stage).getPropertyValue('--r9-banner-stitch-opacity').trim(),hem:getComputedStyle(stage).getPropertyValue('--r9-banner-hem-opacity').trim()},
        scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,
        nameClear:rect(name).y > rect(stage).bottom + 4,
        frameImageDataUri:f.backgroundImage.includes('data:image/svg+xml;base64,'),
        payload: f.backgroundImage.match(/data:image\/svg\+xml;base64,([^"\)]+)/)?.[1] || ''
      };
    });
    const layout = await page.evaluate(() => {
      const stage=document.querySelector('#after-stage'), button=document.querySelector('#after-button');
      const b=button.getBoundingClientRect(), s=stage.getBoundingClientRect();
      return { stageWidth:s.width,stageHeight:s.height,buttonWidth:b.width,buttonHeight:b.height,stageX:s.x,stageY:s.y };
    });
    if (data.stage.width !== 320 || data.stage.height !== 240 || data.button.width !== 320 || data.button.height !== 240) throw new Error(`Unexpected banner geometry at DPR ${dpr}: ${JSON.stringify(layout)}`);
    if (data.frame.content !== '""' || data.frame.left !== '-4px' || data.frame.right !== '-4px' || data.frame.top !== '-4px' || data.frame.bottom !== '-4px' || data.frame.zIndex !== '20' || data.frame.pointerEvents !== 'none' || !data.frameImageDataUri || data.frame.imageRendering !== 'pixelated') throw new Error(`Frame pseudo invalid at DPR ${dpr}: ${JSON.stringify(data.frame)}`);
    if (Number(data.stitch.zIndex) <= Number(data.frame.zIndex) || Number(data.hem.zIndex) <= Number(data.frame.zIndex) || Number(data.scallop.zIndex) <= Number(data.frame.zIndex) || Number(data.avatar.zIndex) <= Number(data.frame.zIndex)) throw new Error(`Original trim/avatar fell below bezel at DPR ${dpr}: ${JSON.stringify({stitch:data.stitch,hem:data.hem,scallop:data.scallop,avatar:data.avatar,frame:data.frame})}`);
    if (!data.avatar.clipPath.startsWith('polygon(') || !data.nameClear || data.scrollWidth > data.clientWidth + 1) throw new Error(`Avatar/name/layout clearance failed at DPR ${dpr}: ${JSON.stringify(data)}`);
    const svgBytes = Buffer.from(data.payload, 'base64').length;
    if (svgBytes > 4096) throw new Error(`Embedded SVG exceeds 4 KiB: ${svgBytes}`);
    const pageBox = await page.locator('#after-stage').boundingBox();
    const frameClip = { x: Math.round(pageBox.x - 8), y: Math.round(pageBox.y - 8), width: Math.round(pageBox.width + 16), height: Math.round(pageBox.height + 16) };
    const imagePath = path.join(out, `dpr-${String(dpr).replace('.', '-')}.png`);
    await page.screenshot({ path: imagePath, clip: frameClip, scale: 'device' });
    if (dpr === 1) {
      await page.evaluate(() => { window.__bannerClicks=0; document.querySelector('#after-button').addEventListener('click',()=>window.__bannerClicks++); });
      const x=pageBox.x+2,y=pageBox.y+pageBox.height/2;
      const hit=await page.evaluate(({x,y})=>{const el=document.elementFromPoint(x,y);return {tag:el?.tagName,id:el?.id,withinButton:!!el?.closest('#after-button')};},{x,y});
      await page.mouse.click(x,y);
      const clicks=await page.evaluate(()=>window.__bannerClicks);
      if (!hit.withinButton || clicks !== 1) throw new Error(`Frame overlay blocks banner click: ${JSON.stringify({hit,clicks})}`);
      data.clickThrough={hit,clicks};
      const decoys=await page.evaluate(()=>{
        const ids=['avatar-decoy-stage','group-decoy-stage'];
        const stages=ids.map(id=>{const el=document.getElementById(id);return{id,exists:!!el,frameApplied:getComputedStyle(el,'::before').backgroundImage!=='none',stitchOpacity:getComputedStyle(el).getPropertyValue('--r9-banner-stitch-opacity').trim(),hemOpacity:getComputedStyle(el).getPropertyValue('--r9-banner-hem-opacity').trim()}});
        const world=document.getElementById('world-decoy-button');
        stages.push({id:'world-decoy-button',exists:!!world,frameApplied:getComputedStyle(world,'::before').backgroundImage!=='none',stitchOpacity:getComputedStyle(world).getPropertyValue('--r9-banner-stitch-opacity').trim(),hemOpacity:getComputedStyle(world).getPropertyValue('--r9-banner-hem-opacity').trim()});
        const target=document.getElementById('after-stage');
        stages.push({id:'user-target',frameApplied:getComputedStyle(target,'::before').backgroundImage!=='none',stitchOpacity:getComputedStyle(target).getPropertyValue('--r9-banner-stitch-opacity').trim(),hemOpacity:getComputedStyle(target).getPropertyValue('--r9-banner-hem-opacity').trim()});
        return stages;
      });
      const untouched=decoys.filter(x=>x.id!=='user-target').every(x=>!x.frameApplied && x.stitchOpacity!=='.52' && x.hemOpacity!=='.96');
      if (!untouched || !decoys.find(x=>x.id==='user-target').frameApplied) throw new Error(`Entity dialog decoy selector leaked: ${JSON.stringify(decoys)}`);
      metrics.decoys=decoys;
      const baselinePage=await pageWith(beforeCss,'before');
      const baseline=await baselinePage.evaluate(()=>{const stage=document.querySelector('#before-stage'),button=document.querySelector('#before-button');const s=stage.getBoundingClientRect(),b=button.getBoundingClientRect();return{stage:{x:s.x,y:s.y,width:s.width,height:s.height},button:{x:b.x,y:b.y,width:b.width,height:b.height},stitchOpacity:getComputedStyle(stage).getPropertyValue('--r9-banner-stitch-opacity').trim(),hemOpacity:getComputedStyle(stage).getPropertyValue('--r9-banner-hem-opacity').trim()}});
      await baselinePage.close();
      metrics.layoutBeforeAfter={baseline,after:{stage:layout,variables:data.variables},unchanged:baseline.stage.width===layout.stageWidth&&baseline.stage.height===layout.stageHeight&&baseline.button.width===layout.buttonWidth&&baseline.button.height===layout.buttonHeight};
      if (!metrics.layoutBeforeAfter.unchanged) throw new Error('Before/after layout dimensions changed');
    }
    metrics.dpr.push({dpr,layout,frame:{content:data.frame.content,left:data.frame.left,right:data.frame.right,top:data.frame.top,bottom:data.frame.bottom,zIndex:data.frame.zIndex,pointerEvents:data.frame.pointerEvents,imageRendering:data.frame.imageRendering,animationName:data.frame.animationName,dataUri:data.frameImageDataUri},stitch:data.stitch,hem:data.hem,scallop:{zIndex:data.scallop.zIndex,opacity:data.scallop.opacity,svgPattern:data.scallop.backgroundImage.includes('data:image/svg+xml')},avatar:{zIndex:data.avatar.zIndex,pixelClip:data.avatar.clipPath.startsWith('polygon(')},variables:data.variables,nameClear:data.nameClear,svgBytes,imagePath,clickThrough:data.clickThrough});
    await page.close();
  }

  const tiersPage=await pageWith(afterCss,'tiers',1);
  metrics.tiers=await tiersPage.evaluate(()=>['tier1','tier2'].map(id=>{const stage=document.getElementById(`${id}-stage`),button=document.getElementById(`${id}-button`);return{id,stitch:Number.parseFloat(getComputedStyle(stage).getPropertyValue('--r9-banner-stitch-opacity')),hem:Number.parseFloat(getComputedStyle(stage).getPropertyValue('--r9-banner-hem-opacity')),frameApplied:getComputedStyle(stage,'::before').backgroundImage!=='none',buttonPseudoZ:getComputedStyle(button,'::before').zIndex}}));
  if(metrics.tiers[0].stitch!==.52||metrics.tiers[0].hem!==.96||metrics.tiers[1].stitch!==.72||metrics.tiers[1].hem!==1||metrics.tiers.some(t=>!t.frameApplied))throw new Error(`Tier comparison mismatch: ${JSON.stringify(metrics.tiers)}`);
  await tiersPage.close();

  const cornerPage=await pageWith(afterCss,'after',4);
  const stageBox=await cornerPage.locator('#after-stage').boundingBox();
  const corners=[
    {name:'top-left',x:stageBox.x-8,y:stageBox.y-8},
    {name:'top-right',x:stageBox.x+stageBox.width-56,y:stageBox.y-8},
    {name:'bottom-left',x:stageBox.x-8,y:stageBox.y+stageBox.height-56},
    {name:'bottom-right',x:stageBox.x+stageBox.width-56,y:stageBox.y+stageBox.height-56}
  ];
  for (const corner of corners) await cornerPage.screenshot({path:path.join(out,`${corner.name}-4x.png`),clip:{x:Math.round(corner.x),y:Math.round(corner.y),width:64,height:64},scale:'device'});
  metrics.cornerCaptures=corners.map(c=>({name:c.name,path:path.join(out,`${c.name}-4x.png`),cssCrop:[64,64],deviceScaleFactor:4,expectedPixels:[256,256]}));
  await cornerPage.close();

  const reduced=await pageWith(afterCss,'after',1,'reduce');
  metrics.reducedMotion=await reduced.evaluate(()=>{const p=getComputedStyle(document.querySelector('#after-stage'),'::before');return{preference:matchMedia('(prefers-reduced-motion: reduce)').matches,animationName:p.animationName,transitionDuration:p.transitionDuration,static:p.animationName==='none'}});
  if (!metrics.reducedMotion.preference || !metrics.reducedMotion.static) throw new Error(`Unexpected frame motion under reduced motion: ${JSON.stringify(metrics.reducedMotion)}`);
  await reduced.close();
} finally {
  await browser.close();
}
await fs.writeFile(path.join(out,'verification.json'),JSON.stringify(metrics,null,2)+'\n');
console.log(JSON.stringify({out,before:path.join(out,'before.png'),after:path.join(out,'after.png'),tierComparison:path.join(out,'tier-comparison.png'),corners:metrics.cornerCaptures,metrics:path.join(out,'verification.json')},null,2));
