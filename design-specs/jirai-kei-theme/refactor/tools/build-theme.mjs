#!/usr/bin/env node
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const frozenDir = path.join(root, 'src/frozen');
const styleDir = path.join(root, 'src/style');
const defaultOut = path.join(root, 'dist/theme.css');
const forbiddenOut = path.resolve(root, '../runtime/preview-package/jirai-kei-theme/theme.css');
const files = [
  ['frozen', '08-asset-vars.css'],
  ['style', '01-tokens.css'],
  ['frozen', '02-native-icons.css'],
  ['frozen', '04-assets.css'],
  ['frozen', '01-fonts.css'],
  ['frozen', '03-icons.css'],
  ['style', '02-foundation.css'],
  ['style', '03-chrome.css'],
  ['style', '04-group-spacing-and-typography.css'],
  ['style', '05-navigation.css'],
  ['style', '06-panels-and-settings.css'],
  ['frozen', '05-assets-r5.css'],
  ['style', '07-motion-navigation.css'],
  ['frozen', '06-assets-r7.css'],
  ['style', '08-chrome-r7.css'],
  ['style', '09-motion-and-user-surfaces.css'],
  ['style', '10-login-and-dialogs.css'],
  ['style', '11-controls-and-pages.css'],
  ['style', '12-loader-and-forms.css'],
  ['style', '13-toolbar-overlays-and-pages.css'],
  ['style', '14-buttons-and-data.css'],
  ['style', '15-late-components.css'],
  ['style', '16-final-navigation.css'],
  ['frozen', '07-keyframes.css'],
];

let out = defaultOut;
let separators = true;
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '--no-separators') separators = false;
  else if (arg === '--out') {
    if (!process.argv[i + 1] || process.argv[i + 1].startsWith('--')) throw new Error('--out requires a path');
    out = path.resolve(process.cwd(), process.argv[++i]);
  } else throw new Error(`Unknown argument: ${arg}`);
}
out = path.resolve(out);
if (out === forbiddenOut) throw new Error(`Refusing to overwrite protected artifact: ${out}`);

const parts = [];
for (const [kind, file] of files) {
  const dir = kind === 'frozen' ? frozenDir : styleDir;
  parts.push({ file, bytes: await readFile(path.join(dir, file)) });
}
const chunks = [];
for (let i = 0; i < parts.length; i++) {
  if (i && separators) chunks.push(Buffer.from(`/* ==== SECTION ${parts[i].file} ==== */\n`, 'utf8'));
  chunks.push(parts[i].bytes);
}
const result = Buffer.concat(chunks);
await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, result);
console.log(`Wrote ${result.length} bytes to ${out} (${parts.length} sections; separators ${separators ? 'on' : 'off'}).`);
