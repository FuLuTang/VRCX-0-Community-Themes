import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const output = '/tmp/jirai-r96-banner-frame/jirai-kei-theme';
const theme = path.join(output, 'theme.css');
const before = path.join(output, 'theme.before.css');
const source = path.resolve(here, '../../banner-frame-r96.css');
const base = await fs.readFile(theme, 'utf8');
if (base.includes('/* SECTION banner-frame-r96 */')) throw new Error('Isolated theme already contains banner-frame-r96');
await fs.writeFile(before, base);
const section = (await fs.readFile(source, 'utf8')).trim();
if (!section.startsWith('/* SECTION banner-frame-r96 */')) throw new Error('Wrong section marker in source CSS');
await fs.writeFile(theme, `${base.trimEnd()}\n\n${section}\n`);
const built = await fs.readFile(theme, 'utf8');
if (built.split('/* SECTION banner-frame-r96 */').length !== 2) throw new Error('Section append count != 1');
console.log(JSON.stringify({theme, before, source, appendedBytes: Buffer.byteLength(section), markerCount: 1}, null, 2));
