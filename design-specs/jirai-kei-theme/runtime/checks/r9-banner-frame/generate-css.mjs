import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(here, '../../checks/r9-banner-frame-options/candidates/06-perforated-digital-bezel.svg');
const target = path.resolve(here, '../../banner-frame-r96.css');
const svg = (await fs.readFile(source, 'utf8')).trim();
const svgBytes = Buffer.byteLength(svg);
if (svgBytes > 4096) throw new Error(`Frame SVG exceeds 4 KiB: ${svgBytes}`);
if (!/<svg[^>]*width="328"[^>]*height="248"[^>]*shape-rendering="crispEdges"/.test(svg)) {
  throw new Error('Expected the integer 328×248 crispEdges candidate SVG');
}
const image = `url("data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}")`;
const targetSelector = '.entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)';
const buttonSelector = `${targetSelector}>[data-slot="button"][class*="aspect-[4/3]"]`;
const css = `/* SECTION banner-frame-r96 */
${targetSelector}{--r9-banner-stitch-opacity:.52;--r9-banner-hem-opacity:.96;--r96-banner-frame-image:${image}}
${targetSelector}::before{content:"";position:absolute;inset:-4px;z-index:20;pointer-events:none;background:var(--r96-banner-frame-image) center/100% 100% no-repeat;image-rendering:pixelated}
${buttonSelector}::before{z-index:21;background-color:#F3ADD9}
${buttonSelector}::after{z-index:22;background-color:#D97FC6}
${buttonSelector}>span.relative.size-full::after{z-index:23}
`;
await fs.writeFile(target, css);
console.log(JSON.stringify({ target, source, svgBytes, encodedBytes: Buffer.byteLength(image), cssBytes: Buffer.byteLength(css) }, null, 2));
