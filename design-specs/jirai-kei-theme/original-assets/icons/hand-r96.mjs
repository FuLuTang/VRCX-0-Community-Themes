// R96 (task-48): Lucide ISC / Feather MIT derivative. Preserve LUCIDE-LICENSE.txt.
// Settings gear redrawn: 8 teeth (4 axis 4x2, 4 diagonal 2x2 steps), 2px ring,
// 6x6 octagonal transparent axle hole. Full D4 symmetry on the 16px grid.
// Replaces the R-batch1 "four bars + flower" settings glyph. Writes src-hand/ only.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { svg } from './hand-r8.mjs';
const root = path.dirname(fileURLToPath(import.meta.url));
export const grids = {
  'settings': [
    '................',
    '......XXXX......',
    '..XX..XXXX..XX..',
    '..XXXXXXXXXXXX..',
    '...XXXXXXXXXX...',
    '...XXX....XXX...',
    '.XXXX......XXXX.',
    '.XXXX......XXXX.',
    '.XXXX......XXXX.',
    '.XXXX......XXXX.',
    '...XXX....XXX...',
    '...XXXXXXXXXX...',
    '..XXXXXXXXXXXX..',
    '..XX..XXXX..XX..',
    '......XXXX......',
    '................',
  ],
};
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await fs.mkdir(path.join(root, 'src-hand'), { recursive: true });
  for (const [name, grid] of Object.entries(grids)) await fs.writeFile(path.join(root, 'src-hand', name + '.svg'), svg(grid));
  console.log('R96 hand overrides:', Object.keys(grids).join(', '));
}
