#!/usr/bin/env node
// 效果展示页（收敛流程第②④步）：用应用真实组件写一个演示 tsx，打包成单文件 html，
// 内嵌应用编译后的 CSS + 完整主题 CSS（<style id="merged-theme">），双击即可在浏览器里看、点、切换。
// 生成的页面也能直接喂给 style-diff.mjs --preview 做前后对比。
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {cli, die, APP, TOOLS, DEFAULT_THEME, sha256, escStyle, fmtBytes} from './common.mjs';

const {opts, rest} = cli({
  usage: `用法：build-preview.mjs <演示.tsx> <输出.html> [选项]
  演示 tsx 里可直接 import '@/ui/shadcn/...' 等应用组件，挂载到 #preview-root；
  页面布局 class（demo-document / demo-samples / demo-sample / demo-stage …）见 tools/preview/stage.css，参考 checks/tabs-visual-preview.tsx。
  例：build-preview.mjs checks/toggle-group-preview.tsx "checks/preview_toggle-group.html"
需要应用已构建（${APP}/dist 存在）。`,
  options: {
    '--theme': {arg: 'CSS', desc: '内嵌哪份完整主题', default: DEFAULT_THEME},
    '--stage-css': {arg: 'CSS', desc: '额外的演示布局 CSS（追加在 stage.css 后）'},
    '--title': {arg: '标题', desc: '页面标题（默认取 tsx 文件名）'},
  },
});
const [entryArg, outArg] = rest;
if (!entryArg || !outArg) die('需要 <演示.tsx> 和 <输出.html>，见 --help');
const entry = path.resolve(entryArg), outFile = path.resolve(outArg);
if (!fs.existsSync(entry)) die(`找不到 ${entry}`);
const dist = path.join(APP, 'dist');
if (!fs.existsSync(path.join(dist, 'index.html'))) die(`应用未构建：${dist}/index.html 不存在（在应用仓库里跑一次 build）`);

const req = createRequire(path.join(APP, 'package.json'));
const {build} = await import(req.resolve('vite'));
const {default: react} = await import(req.resolve('@vitejs/plugin-react'));
const theme = fs.readFileSync(opts.theme, 'utf8');

// App CSS: every stylesheet linked from dist/index.html plus the lazily loaded App-*.css, with local url() inlined.
const index = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const cssPaths = [...index.matchAll(/href="([^"]+\.css)"/g)].map((m) => path.join(dist, m[1].replace(/^\//, '')));
const appCss = fs.readdirSync(path.join(dist, 'assets')).find((n) => /^App-.*\.css$/.test(n));
if (appCss && !cssPaths.includes(path.join(dist, 'assets', appCss))) cssPaths.push(path.join(dist, 'assets', appCss));
const MIME = {'.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp'};
function standalone(file) {
  let css = fs.readFileSync(file, 'utf8');
  const urls = [...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1].replace(/^["']|["']$/g, '')))];
  for (const url of urls) {
    if (/^(data:|https?:|#)/.test(url)) continue;
    const resolved = url.startsWith('/') ? path.join(dist, url.slice(1)) : path.resolve(path.dirname(file), url);
    if (!fs.existsSync(resolved)) die(`应用 CSS 引用的本地资源不存在：${resolved}`);
    css = css.split(url).join(`data:${MIME[path.extname(resolved)] || 'application/octet-stream'};base64,${fs.readFileSync(resolved).toString('base64')}`);
  }
  return css;
}
const baseCss = cssPaths.map(standalone).join('\n');

const result = await build({
  configFile: false, root: APP, logLevel: 'warn',
  define: {'process.env.NODE_ENV': '"production"'},
  plugins: [react()],
  resolve: {alias: {'@': path.join(APP, 'src'), 'lucide-react': req.resolve('lucide-react'), react: path.dirname(req.resolve('react/package.json')), 'react-dom': path.dirname(req.resolve('react-dom/package.json'))}},
  build: {write: false, minify: true, lib: {entry, name: 'Preview', formats: ['iife']}},
});
const js = (Array.isArray(result) ? result : [result]).flatMap((x) => x.output).filter((x) => x.type === 'chunk').map((x) => x.code).join('\n');
let stage = fs.readFileSync(path.join(TOOLS, 'preview/stage.css'), 'utf8');
if (opts['stage-css']) stage += '\n' + fs.readFileSync(opts['stage-css'], 'utf8');
const title = opts.title || path.basename(entry, path.extname(entry));
const html = `<!doctype html><html lang="zh-CN" class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-sha256" content="${sha256(theme)}"><title>${title.replace(/</g, '&lt;')}</title><style id="app-base">${escStyle(baseCss)}</style><style id="merged-theme">${escStyle(theme)}</style><style id="preview-layout">${escStyle(stage)}</style></head><body><div id="preview-root"></div><script>${js.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;
fs.mkdirSync(path.dirname(outFile), {recursive: true});
fs.writeFileSync(outFile, html);
console.log(`已生成 ${outFile}\n  ${fmtBytes(Buffer.byteLength(html))}；主题 ${fmtBytes(Buffer.byteLength(theme))} sha256 ${sha256(theme).slice(0, 16)}…；应用 CSS ${cssPaths.length} 个文件`);
