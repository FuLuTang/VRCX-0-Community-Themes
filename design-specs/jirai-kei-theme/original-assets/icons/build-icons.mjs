// Builds dist/jirai-icons.css: replaces every covered lucide <svg> with its pixel glyph via CSS mask.
import fs from 'node:fs/promises'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, process.env.SRC || 'src'), dist = path.join(root, 'dist');
await fs.mkdir(dist, { recursive: true });
const files = (await fs.readdir(src)).filter(f => f.endsWith('.svg')).sort();
// minimal escaping: quoted url() tolerates spaces; only < > # % " need encoding (attribute quotes switched to ')
const enc = s => s.trim().replace(/"/g, "'").replace(/Z/g, '').replace(/%/g, '%25').replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E');
const names = files.map(f => f.slice(0, -4));
const sel = names.map(n => `.lucide-${n}`).join(',');
const license = await fs.readFile(path.join(root, 'LUCIDE-LICENSE.txt'), 'utf8');
let css = `/*! Windose pixel icons — ${names.length} canonical glyphs, Lucide 1.46.0 derivatives.\n${license.replace(/\*\//g, '* /')}\n*/\n`;
css += `svg.lucide:is(${sel}){background-color:currentColor;-webkit-mask:var(--px) center/contain no-repeat;mask:var(--px) center/contain no-repeat}\n`;
css += `svg.lucide:is(${sel})>*{display:none}\n`;
for (const n of names) {
  let file = path.join(root, 'src-hand', n + '.svg'); try { await fs.access(file); } catch { file = path.join(src, n + '.svg'); }
  const svg = (await fs.readFile(file, 'utf8')).trim();
  css += `svg.lucide-${n}{--px:url("data:image/svg+xml,${enc(svg)}")}\n`;
}
css += 'svg.lucide-person-standing{transform:none}\n';
await fs.writeFile(path.join(dist, 'jirai-icons.css'), css);
console.log('icons', names.length, 'css bytes', Buffer.byteLength(css));
