/* NOT WINDOWS · verify the selected B fan lace, pixels, junction and 10px half-step. */
/* SUPERSEDED (R9.6c, 2026-10-13): R8.2 "孔眼改粉点" was replaced by the user's directive
   "蕾丝遮罩，描边朝内，洞洞要镂空". The current tile is asserted by lace3-verify.mjs; this R8.2
   pixel spec intentionally no longer matches. Set LACE2_FORCE=1 to run the historical checks anyway. */
if (!process.env.LACE2_FORCE) { console.log('SKIP lace2-verify: superseded by lace3-verify.mjs (R9.6c)'); process.exit(0); }
import fs from 'node:fs/promises';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const runtime = new URL('../../', import.meta.url);
const out = new URL('./', import.meta.url);
const faceHex = '#f9d1e7';
const meatHex = '#d97fc6';
const darkHex = '#16112a';
const referencePath = '/tmp/jirai-r8-brief/live-r82-lace-left-6x.png';
const generated = JSON.parse(await fs.readFile(new URL('lace2-generated.json', import.meta.url), 'utf8'));
const r8Css = await fs.readFile(new URL('../../chrome-r8.css', import.meta.url), 'utf8');
const motionCss = await fs.readFile(new URL('../../motion-r8.css', import.meta.url), 'utf8');
const baseFiles = ['windose-runtime.css', 'window-chrome.css', 'navigation-r7.css', 'motion-r5.css', 'motion-r7.css'];
const baseCss = await Promise.all(baseFiles.map((file) => fs.readFile(new URL(file, runtime), 'utf8')));

function assert(condition, message, evidence = undefined) {
    if (!condition) throw new Error(`${message}${evidence === undefined ? '' : `: ${JSON.stringify(evidence)}`}`);
}
function rgbHex(r, g, b) {
    return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}
function luminance(hex) {
    const channels = hex.match(/[0-9a-f]{2}/gi).map((value) => parseInt(value, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function contrast(foreground, background) {
    const a = luminance(foreground);
    const b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
async function pixels(buffer) {
    const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const rows = Array.from({ length: info.height }, (_, y) => Array.from({ length: info.width }, (_, x) => {
        const i = (y * info.width + x) * info.channels;
        return rgbHex(data[i], data[i + 1], data[i + 2]);
    }));
    return { width: info.width, height: info.height, rows };
}
function rowString(row) { return row.join(' '); }
function addBanner(buffer, width, height, label) {
    const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="24"><rect width="100%" height="100%" fill="#100c1b"/><text x="10" y="16" font-family="monospace" font-size="11" fill="#ffe5f2">${label}</text></svg>`);
    return sharp({ create: { width, height: height + 24, channels: 4, background: '#100c1b' } })
        .composite([{ input: svg, left: 0, top: 0 }, { input: buffer, left: 0, top: 24 }]).png().toBuffer();
}

assert(generated.outputDimensions === '20x8' && generated.valleyY === 6, 'Unexpected generated B geometry', generated);
assert(generated.svg.includes('<rect') && !generated.svg.includes('<path'), 'B data SVG must be rect-only', generated.svg);
assert(r8Css.includes(generated.dataUrl), 'CSS tile differs from generator output');
assert(!/@import\s|https?:\/\//i.test(r8Css), 'R8 CSS must not import or request remote resources');
assert(!/\.vrcx-0-statusbar\s*::after/i.test(r8Css), 'R8 must not change the application-owned RGB pseudo-element');
assert(/from\s*\{\s*background-position:\s*0\s+center;\s*\}/.test(motionCss), 'motion-r8 must start the lace at background-position 0');
assert(/to\s*\{\s*background-position:\s*20px\s+center;\s*\}/.test(motionCss), 'motion-r8 must end at one 20px tile period');
assert(/animation\s*:\s*r8-lace-flow\s+4\.8s\s+steps\(2,\s*end\)\s+infinite/.test(motionCss), 'motion-r8 must step through the 10px half-tile');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:#16112a;color:#f2ebff;font-family:system-ui,sans-serif}body{overflow:hidden}
:root{--jk-mask-s1-s:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 8'%3E%3Cpath fill='%23000' d='M0 0H16V2A8 6 0 0 1 0 2ZM6.8 4.52a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0-2.4 0Z'/%3E%3C/svg%3E");--jk-mask-s7-s:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='%23000' d='M6 11 1 6C-1 3 1 0 4 1l2 2 2-2c3-1 5 2 3 5z'/%3E%3C/svg%3E");--status-online:#2ed319;--status-active:#2ed319}
.vrcx-0-app-root{height:100vh;display:flex;flex-direction:column;background:#16112a}
.vrcx-0-titlebar{height:32px;flex:none;display:flex;align-items:center;padding:0 10px;background:#d97fc6;color:#21132d;font-weight:600}
.fixture-content{flex:1;min-height:0;background:#201936;position:relative;padding:20px;color:#b9add9}
.fixture-label{display:inline-block;border:1px solid #6c5ce0;padding:4px 8px;font-size:12px}
.vrcx-0-statusbar{height:25px;flex:none;display:block;padding:0 8px;}
.status-row{height:24px;min-height:24px;display:flex;align-items:center;justify-content:space-between;gap:12px;white-space:nowrap;overflow:hidden}
.status-groups{display:flex;align-items:center;gap:10px}
.status-item{display:flex;align-items:center;gap:5px;font-size:12px;color:#21132d}
.status-dot{width:8px;height:8px;flex:none;border:1px solid #21132d;background:#2ed319}
#lace2-sample-holder{position:absolute;left:420px;top:240px;width:80px;height:40px;pointer-events:none}
#lace2-sample{width:80px;height:25px;margin-top:8px;padding:0}
#lace2-sample>div{height:24px;min-height:24px}
#main-statusbar::after{content:"";position:absolute;top:1px;right:0;bottom:7px;left:auto;width:2px;height:16px;pointer-events:none;background-image:linear-gradient(rgb(255,59,212),rgb(59,226,255),rgb(255,211,52))}
</style></head><body><div class="vrcx-0-app-root">
<header class="vrcx-0-titlebar">VRCX-0-jirai　❤　帮助</header>
<main class="fixture-content"><span class="fixture-label">NOT WINDOWS · R8.2 / B LACE PIXEL FIXTURE</span><p>状态栏样式验证 · 不含真实好友资料</p></main>
<footer id="main-statusbar" class="vrcx-0-statusbar" data-vrcx-0-surface="statusbar"><div class="min-h-6 flex-col status-row"><div class="status-groups"><span class="status-item"><i class="status-dot"></i>服务器状态</span><span class="status-item"><i class="status-dot"></i>实时连接</span><span class="status-item"><i class="status-dot"></i>VRChat</span><span class="status-item"><i class="status-dot" style="background:#a294c8"></i>SteamVR</span></div><span class="status-item">增强型信息抓取　101/101　界面缩放 100%</span></div></footer>
</div><div id="lace2-sample-holder"><div id="lace2-sample" class="vrcx-0-statusbar" data-vrcx-0-surface="statusbar"><div class="min-h-6 flex-col"></div></div></div><style id="lace2-frame-override"></style></body></html>`;

const browser = await chromium.launch({ headless: true });
try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    await page.setContent(html, { waitUntil: 'load' });
    for (const css of baseCss) await page.addStyleTag({ content: css });
    await page.addStyleTag({ content: r8Css });
    await page.addStyleTag({ content: motionCss });
    await page.evaluate(() => document.fonts.ready);

    const state = await page.evaluate(() => {
        const bar = document.querySelector('#main-statusbar');
        const inner = bar.querySelector('.status-row');
        const sample = document.querySelector('#lace2-sample');
        const pseudo = getComputedStyle(bar, '::before');
        const rgb = (color) => color.match(/\d+/g).slice(0, 3).map(Number);
        return {
            faceToken: getComputedStyle(document.documentElement).getPropertyValue('--r8-status-face').trim(),
            barColor: getComputedStyle(bar).backgroundColor,
            innerColor: getComputedStyle(inner).backgroundColor,
            pseudoColor: pseudo.backgroundColor,
            pseudoImage: pseudo.backgroundImage,
            pseudoSize: pseudo.backgroundSize,
            pseudoHeight: pseudo.height,
            pseudoTop: pseudo.top,
            pseudoTransform: pseudo.transform,
            animationName: pseudo.animationName,
            animationDuration: pseudo.animationDuration,
            animationTimingFunction: pseudo.animationTimingFunction,
            statusbarHeight: bar.getBoundingClientRect().height,
            textColor: getComputedStyle(bar.querySelector('.status-item')).color,
            bodyRgb: rgb(getComputedStyle(bar).backgroundColor),
            sampleColor: getComputedStyle(sample).backgroundColor,
            samplePseudoHeight: getComputedStyle(sample, '::before').height,
            lampColors: Array.from(bar.querySelectorAll('.status-dot'), (dot) => getComputedStyle(dot).backgroundColor),
            rgbAfter: getComputedStyle(bar, '::after').backgroundImage
        };
    });
    const textContrast = contrast('#21132d', faceHex);
    assert(state.faceToken === faceHex, 'Status-face token mismatch', state);
    assert(state.barColor === 'rgb(249, 209, 231)' && state.innerColor === state.barColor && state.sampleColor === state.barColor && state.pseudoColor === 'rgba(0, 0, 0, 0)', 'Statusbar fill/token mismatch or pseudo exterior is not transparent', state);
    assert(state.pseudoImage.includes('data:image/svg+xml;base64,') && state.pseudoSize === '20px 8px', 'B repeat paint is missing or has the wrong period', state);
    assert(state.pseudoHeight === '8px' && state.pseudoTop === '-8px' && state.statusbarHeight === 25, 'Protected pseudo/statusbar geometry changed', state);
    assert(state.animationName === 'r8-lace-flow' && state.animationDuration === '4.8s', 'R8 lace animation identity/timing changed', state);
    assert(textContrast >= 4.5, 'Statusbar text contrast below 4.5:1', textContrast);
    assert(state.lampColors.includes('rgb(46, 211, 25)') && state.lampColors.includes('rgb(162, 148, 200)'), 'Semantic lamp colors changed', state.lampColors);
    assert(state.rgbAfter.includes('linear-gradient'), 'Statusbar RGB ::after fixture sentinel changed', state.rgbAfter);

    const sampleBox = await page.locator('#lace2-sample').boundingBox();
    const barBox = await page.locator('#main-statusbar').boundingBox();
    const laceGeometry = await page.evaluate(() => {
        const sample = document.querySelector('#lace2-sample');
        const main = document.querySelector('#main-statusbar');
        const sampleStyle = getComputedStyle(sample);
        const mainStyle = getComputedStyle(main);
        const samplePseudo = getComputedStyle(sample, '::before');
        const mainPseudo = getComputedStyle(main, '::before');
        const sampleRect = sample.getBoundingClientRect();
        const mainRect = main.getBoundingClientRect();
        return {
            sampleTop: sampleRect.top + parseFloat(sampleStyle.borderTopWidth) + parseFloat(samplePseudo.top),
            mainTop: mainRect.top + parseFloat(mainStyle.borderTopWidth) + parseFloat(mainPseudo.top),
            mainBottom: mainRect.bottom
        };
    });
    const frameOverride = page.locator('#lace2-frame-override');
    const setFrame = async (offset) => {
        await frameOverride.evaluate((style, x) => {
            style.textContent = `#lace2-sample::before,#main-statusbar::before{animation:none!important;background-position:${x}px center!important}`;
        }, offset);
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    };
    const captureSample = async (offset) => {
        await setFrame(offset);
        return page.screenshot({ clip: { x: Math.round(sampleBox.x), y: Math.round(laceGeometry.sampleTop), width: 80, height: 16 } });
    };
    const frame0Buffer = await captureSample(0);
    const frame10Buffer = await captureSample(10);
    const frame0 = await pixels(frame0Buffer);
    const frame10 = await pixels(frame10Buffer);
    assert(frame0.width === 80 && frame0.height === 16 && frame10.width === 80 && frame10.height === 16, 'Unexpected 1× sample dimensions', { frame0, frame10 });

    const checksForFrame = (sample, name) => {
        const colors = new Set(sample.rows.flat());
        const phase = name === 'frame10' ? 10 : 0;
        const mask = generated.maskRows.map((row) => [...row]);
        const generatedRows = generated.pixelRows.map((row) => row.split(' ').map((color) => color.toUpperCase()));
        assert(colors.size <= 4, `${name}: palette exceeds four colors`, [...colors]);
        for (let y = 0; y < 8; y += 1) {
            for (let tile = 0; tile < 4; tile += 1) {
                const row = sample.rows[y].slice(tile * 20, (tile + 1) * 20);
                assert(!row.every((color) => color.toLowerCase() === meatHex), `${name}: tile row ${y} is all meat-pink`);
                for (let x = 0; x < 20; x += 1) {
                    const sourceX = (x + phase) % 20;
                    const actual = sample.rows[y][tile * 20 + x];
                    assert(actual === generatedRows[y][sourceX], `${name}: rendered pixel differs from generated mask at (${x},${y})`, { actual, expected: generatedRows[y][sourceX] });
                    if (mask[y][sourceX] === '#' && actual.toLowerCase() === darkHex) {
                        throw new Error(`${name}: dark pixels leaked into the fan silhouette at (${x},${y})`);
                    }
                }
            }
        }
        assert(sample.rows.slice(0, 8).slice(generated.valleyY + 1).flat().every((color) => color.toLowerCase() !== meatHex), `${name}: meat-pink pixels continue below valleyY=${generated.valleyY}`);
        assert(sample.rows[7].every((color) => color.toLowerCase() === faceHex), `${name}: tile bottom row differs from statusbar face`, sample.rows[7]);
        assert(sample.rows.slice(8).every((row) => row.every((color) => color.toLowerCase() === faceHex)), `${name}: a different-color full row remains under the lace`, sample.rows.slice(8));
        for (let y = 0; y < sample.height; y += 1) {
            for (let x = 20; x < sample.width; x += 1) {
                assert(sample.rows[y][x] === sample.rows[y][x % 20], `${name}: 20px repeat seam at (${x},${y})`);
            }
        }
        return { uniqueColors: [...colors].sort(), uniqueColorCount: colors.size, fullMeatRows: 0, darkPixelsInsideSilhouette: 0, meatBelowValley: 0, bottomRow: sample.rows[7], belowLaceRowsUniform: true };
    };
    const frame0Checks = checksForFrame(frame0, 'frame0');
    const frame10Checks = checksForFrame(frame10, 'frame10');
    for (let y = 0; y < 16; y += 1) {
        for (let x = 0; x < 80; x += 1) {
            assert(frame10.rows[y][x] === frame0.rows[y][(x + 10) % 20], `10px frame is not the seamless half-period shift at (${x},${y})`, { at10: frame10.rows[y][x], expected: frame0.rows[y][(x + 10) % 20] });
        }
    }

    const exportBuffer = (sample, label) => `${label} · 1x 20px tile + 8px statusbar, 16 rows\n${sample.rows.map((row, index) => `${String(index).padStart(2, '0')}: ${rowString(row.slice(0, 20))}`).join('\n')}\n`;
    await fs.writeFile(new URL('lace2-pixel-export.txt', out), [
        `NOT WINDOWS · selected B fan-lace · source 20x12 → pseudo 20x8 (${generated.heightHandling})`,
        `measured face=${faceHex}; meat=${meatHex}; valleyY=${generated.valleyY}; animation period=20px, midpoint=10px`,
        exportBuffer(frame0, 'FRAME 0'),
        exportBuffer(frame10, 'FRAME 10')
    ].join('\n'));

    const frameImage = async (offset, filename, label) => {
        await setFrame(offset);
        const crop = await page.screenshot({ clip: { x: Math.round(sampleBox.x), y: Math.round(laceGeometry.sampleTop), width: 80, height: 16 } });
        const enlarged = await sharp(crop).resize(480, 96, { kernel: sharp.kernel.nearest }).png().toBuffer();
        const labeled = await addBanner(enlarged, 480, 96, `NOT WINDOWS · B · background-position ${offset}px · 6x`);
        await fs.writeFile(new URL(filename, out), labeled);
    };
    await frameImage(0, 'lace2-frame-0-6x.png', 'frame0');
    await frameImage(10, 'lace2-frame-10-6x.png', 'frame10');

    await setFrame(0);
    const fullStripHeight = Math.round(laceGeometry.mainBottom - laceGeometry.mainTop);
    const fullStrip = await page.screenshot({ clip: { x: 0, y: Math.round(laceGeometry.mainTop), width: 1280, height: fullStripHeight } });
    const fullLabeled = await addBanner(fullStrip, 1280, fullStripHeight, 'NOT WINDOWS · FULL-WIDTH STATUSBAR · B');
    await fs.writeFile(new URL('lace2-fullwidth-statusbar.png', out), fullLabeled);

    const beforeRaw = await sharp(referencePath).resize(1800, 342, { kernel: sharp.kernel.nearest }).png().toBuffer();
    const afterRaw = await page.screenshot({ clip: { x: 0, y: Math.round(barBox.y - 32), width: 300, height: 57 } });
    const afterRaw6x = await sharp(afterRaw).resize(1800, 342, { kernel: sharp.kernel.nearest }).png().toBuffer();
    const beforeLabeled = await addBanner(beforeRaw, 1800, 342, 'NOT WINDOWS · R8.2 BEFORE');
    const afterLabeled = await addBanner(afterRaw6x, 1800, 342, 'NOT WINDOWS · SELECTED B AFTER');
    const comparison = await sharp({ create: { width: 3600, height: 366, channels: 4, background: '#100c1b' } })
        .composite([{ input: beforeLabeled, left: 0, top: 0 }, { input: afterLabeled, left: 1800, top: 0 }]).png().toBuffer();
    await fs.writeFile(new URL('lace2-r82-vs-b-6x.png', out), comparison);

    const report = {
        fixture: 'NOT WINDOWS · source-shaped R8 statusbar',
        choice: 'B · s2-fan-lace-20x12',
        sourceDimensions: generated.sourceDimensions,
        pseudoHeight: state.pseudoHeight,
        heightHandling: generated.heightHandling,
        semanticMaskRows: generated.maskRows,
        valleyY: generated.valleyY,
        palette: { exterior: '#201936', body: faceHex, meat: meatHex },
        statusbarComputedColors: { root: state.barColor, inner: state.innerColor, pseudo: state.pseudoColor, text: state.textColor },
        contrast: Number(textContrast.toFixed(3)),
        statusbarHeight: state.statusbarHeight,
        animation: { name: state.animationName, duration: state.animationDuration, from: '0px', halfway: '10px', fullPeriod: '20px', css: 'motion-r8.css was read and verified, not modified' },
        generated: { outlinePixels: generated.outlinePixelCount, interiorCutoutPixels: generated.interiorCutoutPixelCount, svgUsesIntegerRects: true, fillUsesStatusFaceToken: true },
        frames: { '0px': frame0Checks, '10px': frame10Checks, exactHalfTileShift: true },
        pixelExport: 'lace2-pixel-export.txt',
        screenshots: ['lace2-frame-0-6x.png', 'lace2-frame-10-6x.png', 'lace2-fullwidth-statusbar.png', 'lace2-r82-vs-b-6x.png']
    };
    await fs.writeFile(new URL('lace2-report.json', out), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    console.log('PASS: B fan lace · ≤4 colors · no dark holes · no bottom outline · 20px tile / 10px half-step · face-token junction');
    await page.close();
} finally {
    await browser.close();
}
