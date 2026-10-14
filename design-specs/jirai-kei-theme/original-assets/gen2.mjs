// Round-3 pixel motifs (S15-S28) for the jirai-kei theme, drawn for "Windose dark".
// Every motif is hand-drawn below as a character grid: 'X' = one pixel, '.' = empty.
// Nothing here is traced, sampled or measured from a reference image - each shape is
// built only from the written construction noted above it. Layers that must register
// exactly with their base (1-cell outline, concentric heart rings) are derived from the
// same hand-drawn grid instead of being drawn twice.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');

// --- grid helpers -----------------------------------------------------------
const grid = (w, rows) => rows.map((row, y) => {
  if (row.length !== w) throw new Error(`grid: row ${y} has ${row.length} cols, expected ${w}`);
  return row;
});
// the motifs that are meant to be mirror-symmetric about the canvas centre
const assertMirror = (name, rows) => rows.forEach((row, y) => {
  for (let x = 0; x < row.length; x++) {
    if (row[x] !== row[row.length - 1 - x]) throw new Error(`${name}: row ${y} is not mirror-symmetric`);
  }
});
const at = (rows, x, y) =>
  y >= 0 && y < rows.length && x >= 0 && x < rows[y].length && rows[y][x] === 'X';
// erode one cell in the 4-neighbourhood: keep pixels solid on all four sides
const shrink = (rows) => rows.map((row, y) => [...row]
  .map((c, x) => (c === 'X' && at(rows, x - 1, y) && at(rows, x + 1, y) && at(rows, x, y - 1) && at(rows, x, y + 1) ? 'X' : '.'))
  .join(''));
const minus = (a, b) => a.map((row, y) => [...row]
  .map((c, x) => (c === 'X' && b[y][x] !== 'X' ? 'X' : '.'))
  .join(''));
// character grid -> merged horizontal runs -> one path
const runs = (rows) => {
  let out = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      if (row[x] !== 'X') { x++; continue; }
      let e = x; while (row[e] === 'X') e++;
      // no Z: fill closes each subpath implicitly, which keeps the file smaller
      out += `M${x} ${y}h${e - x}v1h${x - e}`;
      x = e;
    }
  });
  return out;
};
const pathEl = (dd, extra = '') => `<path fill="#000"${extra} d="${dd}"/>`;
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>\n`;
const pixel = (w, h, rows, extra = '') => svg(w, h, pathEl(runs(rows), extra));

// --- S15 wings + cross (32x12) ----------------------------------------------
// Latin cross in the middle: 4-wide shaft over 5 rows with 14-wide arms on its
// second row, so the cross stays dominant. Each side carries a 3-step feather
// wing: each step is 4 cells wide and one row tall, stepping 3 cells further out
// and 1 row up from the step below, the innermost step touching the arm tip.
const s15 = grid(32, [
  '................................',
  '................................',
  '................................',
  'XXXX........................XXXX',
  '...XXXX..................XXXX...',
  '......XXXX....XXXX....XXXX......',
  '.........XXXXXXXXXXXXXX.........',
  '..............XXXX..............',
  '..............XXXX..............',
  '..............XXXX..............',
  '................................',
  '................................',
]);

// --- S16 gem heart (16x16), body + highlight/cut layers ----------------------
// Classic two-lobe heart on a 16x16 grid; the body leaves a 2x2 hole at the upper
// left lobe for the gem highlight. The -hi layer holds that 2x2 highlight plus two
// 45-degree facet lines that meet in the middle of the heart.
const s16Body = grid(16, [
  '................',
  '..XXXX....XXXX..',
  '.XXXXXX..XXXXXX.',
  'XX..XXXXXXXXXXXX',
  'XX..XXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXX',
  '.XXXXXXXXXXXXXX.',
  '..XXXXXXXXXXXX..',
  '...XXXXXXXXXX...',
  '....XXXXXXXX....',
  '.....XXXXXX.....',
  '......XXXX......',
  '.......XX.......',
  '................',
  '................',
]);
// Highlight layer: a 2x2 facet sparkle inside the left lobe plus a 45-degree facet
// line running from it towards the centre of the heart (read as a gemstone facet).
const s16Hi = grid(16, [
  '................',
  '................',
  '...XX...........',
  '...XX...........',
  '.....X..........',
  '......X.........',
  '.......XX.......',
  '........X.......',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

// --- S17 arrow cursor (16x16), solid body + 1-cell outline layer ------------
// Classic pointer: apex at the top-left corner; the head is a solid 45-degree
// wedge (rows 0-9), row 10 is the shoulder, and rows 10-15 keep the 1-cell left
// edge plus a 3-cell shaft sliding back down-left, leaving the wedge notch open.
const s17Arrow = grid(16, [
  'X...............',
  'XX..............',
  'XXX.............',
  'XXXX............',
  'XXXXX...........',
  'XXXXXX..........',
  'XXXXXXX.........',
  'XXXXXXXX........',
  'XXXXXXXXX.......',
  'XXXXXXXXXX......',
  'X.....XXXXX.....',
  'X....XXX........',
  'X...XXX.........',
  'X..XXX..........',
  'X.XXX...........',
  'XXX.............',
]);

// --- S18 hand cursor (16x16), solid body + 1-cell outline layer -------------
// Pointing hand: a 2-cell index finger rising 7 rows into the fist, a knuckle bump
// at the right of the finger root, and two 1-cell slots cut up from the bottom edge
// of the fist so the curled fingers read as separate digits.
const s18Hand = grid(16, [
  '....XX..........',
  '....XX..........',
  '....XX..........',
  '....XX..........',
  '....XX..........',
  '....XX..........',
  '....XX..........',
  '..XXXXXX........',
  '.XXXXXXXX.XX....',
  '.XXXXXXXXXXX....',
  '.XXXXXXXXXXX....',
  '.XXXXXXXXXXX....',
  '..XX.XX.XXX.....',
  '..XX.XX.XXX.....',
  '...X...XXX......',
  '................',
]);

// --- S19 alert badge (12x12) ------------------------------------------------
// Pixel-stepped disc inscribed in the 12x12 grid with a 2-cell exclamation mark
// punched out (bar rows 3-7, dot rows 9-10); punched with fill-rule evenodd.
const s19 = grid(12, [
  '....XXXX....',
  '..XXXXXXXX..',
  '.XXXXXXXXXX.',
  '.XXXX..XXXX.',
  'XXXXX..XXXXX',
  'XXXXX..XXXXX',
  'XXXXX..XXXXX',
  'XXXXX..XXXXX',
  '.XXXXXXXXXX.',
  '.XXXX..XXXX.',
  '..XXX..XXX..',
  '....XXXX....',
]);

// --- S20 burst balloon (24x24) ----------------------------------------------
// 12-point starburst: outer radius 11.5, inner radius 7, first point straight up,
// one point every 30 degrees, rasterised so cell centres inside the polygon are lit.
const s20 = grid(24, [
  '........................',
  '........................',
  '......X....XX....X......',
  '......XX...XX...XX......',
  '.......XX.XXXX.XX.......',
  '.......XXXXXXXXXX.......',
  '..XX...XXXXXXXXXX...XX..',
  '...XXXXXXXXXXXXXXXXXX...',
  '....XXXXXXXXXXXXXXXX....',
  '.....XXXXXXXXXXXXXX.....',
  '....XXXXXXXXXXXXXXXX....',
  '..XXXXXXXXXXXXXXXXXXXX..',
  '..XXXXXXXXXXXXXXXXXXXX..',
  '....XXXXXXXXXXXXXXXX....',
  '.....XXXXXXXXXXXXXX.....',
  '....XXXXXXXXXXXXXXXX....',
  '...XXXXXXXXXXXXXXXXXX...',
  '..XX...XXXXXXXXXX...XX..',
  '.......XXXXXXXXXX.......',
  '.......XX.XXXX.XX.......',
  '......XX...XX...XX......',
  '......X....XX....X......',
  '........................',
  '........................',
]);

// --- S21 pill (12x8) --------------------------------------------------------
// Horizontal capsule: half-round ends (radius 4) with a straight 4-row middle, and
// a 2-cell vertical divider punched out of rows 1-6.
const s21 = grid(12, [
  '..XXXXXXXX..',
  '.XXXX..XXXX.',
  'XXXXX..XXXXX',
  'XXXXX..XXXXX',
  'XXXXX..XXXXX',
  'XXXXX..XXXXX',
  '.XXXX..XXXX.',
  '..XXXXXXXX..',
]);

// --- S22 big heart outline (32x28) -----------------------------------------
// Solid heart built from two radius-8 lobes plus a tapering lower body. The
// delivered shape is its 2-cell outer ring (solid minus twice-eroded) and a
// 1-cell concentric second ring (thrice-eroded minus four-times-eroded).
const s22Solid = grid(32, [
  '................................',
  '.....XXXXXX..........XXXXXX.....',
  '...XXXXXXXXXX......XXXXXXXXXX...',
  '..XXXXXXXXXXXX....XXXXXXXXXXXX..',
  '.XXXXXXXXXXXXXX..XXXXXXXXXXXXXX.',
  '.XXXXXXXXXXXXXX..XXXXXXXXXXXXXX.',
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  '.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.',
  '.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.',
  '..XXXXXXXXXXXXXXXXXXXXXXXXXXXX..',
  '..XXXXXXXXXXXXXXXXXXXXXXXXXXXX..',
  '...XXXXXXXXXXXXXXXXXXXXXXXXXX...',
  '...XXXXXXXXXXXXXXXXXXXXXXXXXX...',
  '....XXXXXXXXXXXXXXXXXXXXXXXX....',
  '.....XXXXXXXXXXXXXXXXXXXXXX.....',
  '.....XXXXXXXXXXXXXXXXXXXXXX.....',
  '......XXXXXXXXXXXXXXXXXXXX......',
  '.......XXXXXXXXXXXXXXXXXX.......',
  '........XXXXXXXXXXXXXXXX........',
  '.........XXXXXXXXXXXXXX.........',
  '.........XXXXXXXXXXXXXX.........',
  '..........XXXXXXXXXXXX..........',
  '............XXXXXXXX............',
  '.............XXXXXX.............',
  '...............XX...............',
]);

// --- S23 sparkle (12x12) ----------------------------------------------------
// Four-point sparkle: vertical arm runs the full 12 rows (long), horizontal arm
// 10 cells (short), a 4-cell waist where they cross, and one diagonal dot in each
// quadrant at (3,3)/(8,3)/(3,8)/(8,8).
const s23 = grid(12, [
  '.....XX.....',
  '.....XX.....',
  '.....XX.....',
  '...X.XX.X...',
  '....XXXX....',
  '.XXXXXXXXXX.',
  '.XXXXXXXXXX.',
  '....XXXX....',
  '...X.XX.X...',
  '.....XX.....',
  '.....XX.....',
  '.....XX.....',
]);

// --- S24 bunny charm (16x20) ------------------------------------------------
// Generic bunny charm, no face: a 4x5 ring with a 2x3 hole standing on the crown,
// two 2-cell-wide ears rising 11 rows beside it, and a 10-cell round head on rows
// 8-17. Ears are 3 rows taller than the ring so the charm silhouette reads bunny.
const s24 = grid(16, [
  '................',
  '.XX..........XX.',
  '.XX..........XX.',
  '.XX...XXXX...XX.',
  '.XX...X..X...XX.',
  '.XX...X..X...XX.',
  '.XX...X..X...XX.',
  '.XX...XXXX...XX.',
  '.XX..XXXXXX..XX.',
  '.XX.XXXXXXXX.XX.',
  '.XXXXXXXXXXXXXX.',
  '.XXXXXXXXXXXXXX.',
  '...XXXXXXXXXX...',
  '...XXXXXXXXXX...',
  '...XXXXXXXXXX...',
  '...XXXXXXXXXX...',
  '....XXXXXXXX....',
  '.....XXXXXX.....',
  '................',
  '................',
]);

// --- S25 ordered dither fade (16x16) ---------------------------------------
// 4x4 Bayer thresholds t = bayer[(y + floor(x/4)) % 4][x % 4], so every row holds
// all 16 threshold values exactly once; the cutoff drops by one per row (16 at the
// top to 1 at the bottom), giving exactly 16-y lit cells per row, solid on top and
// empty at the bottom. Repeats seamlessly along x (period 16).
const s25 = grid(16, [
  'XXXXXXXXXXXXXXXX',
  'XXXXXXXX.XXXXXXX',
  'XXXX.XXXXXXXXX.X',
  '.X.XXXXXXX.XXXXX',
  'XXXXX..XXXXX.X.X',
  '.X.XX.XX.X.XXXXX',
  'X.XX.X.XXXX..X.X',
  '.X.XXXX..X.XX.X.',
  'X.X..X.XX.X..X.X',
  '.X.XX.X....XX.X.',
  'X.X....XX.X..X.X',
  '....X.X..X..X.X.',
  'X.X.....X.X.....',
  '......X.....X.X.',
  '..X.....X.......',
  '....X...........',
]);

// --- S26 checker band (16x8) ------------------------------------------------
// 2-cell checkerboard: cell (i,j) is lit when i+j is even. 16x8 is exactly 8x4
// cells, so it tiles in both directions without a seam.
const s26 = grid(16, [
  'XX..XX..XX..XX..',
  'XX..XX..XX..XX..',
  '..XX..XX..XX..XX',
  '..XX..XX..XX..XX',
  'XX..XX..XX..XX..',
  'XX..XX..XX..XX..',
  '..XX..XX..XX..XX',
  '..XX..XX..XX..XX',
]);

// --- S27 small cloud (24x12) ------------------------------------------------
// Solid cloud: radius-5 centre puff on rows 0-7 with two radius-3.5 side puffs
// tucked in at rows 3-7, all standing on a flat 20-cell base on rows 7-10.
const s27 = grid(24, [
  '..........XXXX..........',
  '........XXXXXXXX........',
  '........XXXXXXXX........',
  '..XXXX.XXXXXXXXXX.XXXX..',
  '.XXXXXXXXXXXXXXXXXXXXXX.',
  '.XXXXXXXXXXXXXXXXXXXXXX.',
  '.XXXXXXXXXXXXXXXXXXXXXX.',
  '.XXXXXXXXXXXXXXXXXXXXXX.',
  '..XXXXXXXXXXXXXXXXXXXX..',
  '..XXXXXXXXXXXXXXXXXXXX..',
  '..XXXXXXXXXXXXXXXXXXXX..',
  '........................',
]);

// --- S28 diamond lattice (16x16) -------------------------------------------
// 1-cell diagonal lattice: a cell is lit when (x+y) mod 8 is 0 or (x-y) mod 8 is 0.
// Period 8 in both axes, so the 16x16 tile repeats without a seam; meant as a
// very low contrast background texture.
const s28 = grid(16, [
  'X.......X.......',
  '.X.....X.X.....X',
  '..X...X...X...X.',
  '...X.X.....X.X..',
  '....X.......X...',
  '...X.X.....X.X..',
  '..X...X...X...X.',
  '.X.....X.X.....X',
  'X.......X.......',
  '.X.....X.X.....X',
  '..X...X...X...X.',
  '...X.X.....X.X..',
  '....X.......X...',
  '...X.X.....X.X..',
  '..X...X...X...X.',
  '.X.....X.X.....X',
]);

for (const [name, rows] of [['s15', s15], ['s19', s19], ['s20', s20], ['s21', s21],
  ['s22Solid', s22Solid], ['s23', s23], ['s24', s24]]) assertMirror(name, rows);

// --- derived layers ---------------------------------------------------------
// one-cell outline of a solid grid: the pixels that touch an empty neighbour
const outline = (rows) => minus(rows, shrink(rows));

const e1 = shrink(s22Solid);
const e2 = shrink(e1);
const e3 = shrink(e2);
const e4 = shrink(e3);
const s22Outer = minus(s22Solid, e2); // 2-cell outer ring
const s22Inner = minus(e3, e4);       // 1-cell concentric second ring

const out = {
  's15-pixel-wings-cross-32x12.svg': pixel(32, 12, s15),
  's16-pixel-gem-heart-16x16.svg': pixel(16, 16, s16Body),
  's16-pixel-gem-heart-hi-16x16.svg': pixel(16, 16, s16Hi),
  // (cursor motifs withdrawn - see provenance.md)
  // (cursor motifs withdrawn - see provenance.md)
  // (cursor motifs withdrawn - see provenance.md)
  // (cursor motifs withdrawn - see provenance.md)
  's19-pixel-alert-badge-12x12.svg': pixel(12, 12, s19, ' fill-rule="evenodd"'),
  's20-pixel-burst-24x24.svg': pixel(24, 24, s20),
  's21-pixel-pill-12x8.svg': pixel(12, 8, s21),
  's22-pixel-big-heart-outline-32x28.svg': svg(32, 28, pathEl(runs(s22Outer) + runs(s22Inner))),
  's23-pixel-sparkle-12x12.svg': pixel(12, 12, s23),
  's24-pixel-bunny-charm-16x20.svg': pixel(16, 20, s24),
  's25-pixel-dither-fade-16x16.svg': pixel(16, 16, s25),
  's26-pixel-checker-band-16x8.svg': pixel(16, 8, s26),
  's27-pixel-cloud-small-24x12.svg': pixel(24, 12, s27),
  's28-pixel-diamond-lattice-16x16.svg': pixel(16, 16, s28),
};

for (const [name, text] of Object.entries(out)) {
  await fs.writeFile(path.join(src, name), text);
  console.log(name.padEnd(44), Buffer.byteLength(text), 'bytes');
}
