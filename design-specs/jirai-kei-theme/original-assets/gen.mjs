// Procedurally generates the redrawn source SVGs (round 2).
// Every shape below is computed from a written construction rule; no reference
// image is read, traced or measured. S3/S6/S7 are kept from round 1.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');
const r = (n) => Number(n.toFixed(2));
const pt = (x, y) => `${r(x)} ${r(y)}`;
const svg = (w, h, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"${extra}>${body}</svg>\n`;
// Circle as two arcs; sweep=1 clockwise (filled), sweep=0 counter-clockwise (hole with nonzero).
const circle = (cx, cy, rad, sweep = 1) =>
  `M${pt(cx - rad, cy)}a${r(rad)} ${r(rad)} 0 1 ${sweep} ${r(2 * rad)} 0a${r(rad)} ${r(rad)} 0 1 ${sweep} ${r(-2 * rad)} 0Z`;

// S1 scallop: solid top band + half-ellipse spanning the full period (scallops touch),
// one eyelet hole in each scallop.
const scallop = (w, h, band, hole) => {
  const rx = w / 2, ry = h - band;
  const d = `M0 0H${w}V${band}A${r(rx)} ${r(ry)} 0 0 1 0 ${band}Z` +
    circle(w / 2, band + ry * 0.42, hole, 0);
  return svg(w, h, `<path fill="#000" d="${d}"/>`);
};

// S2 fan lace: band + a fan whose outer rim is made of five small bumps placed on a
// half circle; three radial teardrop holes and a pin hole near the hinge.
const fan = () => {
  const w = 20, h = 12, band = 2, cx = 10, cy = band, R = 8.6, bumps = 5;
  let d = `M0 0H${w}V${band}H${r(cx + R)}`;
  for (let i = 0; i < bumps; i++) {
    const a0 = (i / bumps) * Math.PI, a1 = ((i + 1) / bumps) * Math.PI;
    const p1 = [cx + R * Math.cos(a1), cy + R * Math.sin(a1)];
    const chord = Math.hypot(p1[0] - (cx + R * Math.cos(a0)), p1[1] - (cy + R * Math.sin(a0)));
    d += `A${r(chord / 2)} ${r(chord / 2)} 0 0 1 ${pt(...p1)}`;
  }
  d += `H0Z`;
  for (const deg of [40, 90, 140]) {
    const a = (deg * Math.PI) / 180, dist = 5.2;
    const x = cx + dist * Math.cos(a), y = cy + dist * Math.sin(a);
    // teardrop approximated by a small ellipse aligned to the radius
    const rot = deg - 90;
    d += `M${pt(x, y)}`; // anchor for readability only
    d += ellipsePath(x, y, 0.9, 1.8, rot, 0);
  }
  d += circle(cx, cy + 1.6, 0.75, 0);
  return svg(w, h, `<path fill="#000" d="${d}"/>`);
};
function ellipsePath(cx, cy, rx, ry, rotDeg, sweep) {
  const a = (rotDeg * Math.PI) / 180;
  const dx = ry * Math.sin(a), dy = -ry * Math.cos(a); // top point offset along the rotated major axis
  const top = [cx + dx, cy + dy], bottom = [cx - dx, cy - dy];
  return `M${pt(...top)}A${r(rx)} ${r(ry)} ${r(rotDeg)} 1 ${sweep} ${pt(...bottom)}A${r(rx)} ${r(ry)} ${r(rotDeg)} 1 ${sweep} ${pt(...top)}Z`;
}

// S4 lacing column: two laces zig-zag between eyelets at y=0 and y=16 (continuous across
// tiles); lace A passes over lace B, so B is interrupted at the crossing. Eyelet rings are
// split across the tile edge so vertical repetition reassembles them.
const lacing = () => {
  const w = 16, h = 16, hw = 1.35;
  const band = (x0, y0, x1, y1, t0, t1) => {
    const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
    const nx = -uy * hw, ny = ux * hw;
    const a = [x0 + ux * t0, y0 + uy * t0], b = [x0 + ux * t1, y0 + uy * t1];
    return `M${pt(a[0] + nx, a[1] + ny)}L${pt(b[0] + nx, b[1] + ny)}L${pt(b[0] - nx, b[1] - ny)}L${pt(a[0] - nx, a[1] - ny)}Z`;
  };
  // lace A (over): (2.5,0) -> (13.5,16); lace B (under): (13.5,0) -> (2.5,16)
  const LA = Math.hypot(11, 16);
  const gap = (hw + 0.85) / Math.sin(2 * Math.atan(11 / 16));
  let d = band(2.5, 0, 13.5, 16, -1, LA + 1);
  d += band(13.5, 0, 2.5, 16, -1, LA / 2 - gap);
  d += band(13.5, 0, 2.5, 16, LA / 2 + gap, LA + 1);
  for (const [x, y] of [[2.5, 0], [13.5, 0], [2.5, 16], [13.5, 16]]) {
    d += circle(x, y, 2.1, 1) + circle(x, y, 1.05, 0);
  }
  return svg(w, h, `<path fill="#000" d="${d}"/>`);
};

// S5 lacing end knot: two laces converge, tie a small knot, two loops and two tails.
const knot = () => {
  const loopL = `M12 6C8.6 1.2 3.4 1 3 4.4C2.6 7.6 7.4 8.4 12 6Z` +
    `M10.2 5.6C7.6 3.6 5 3.4 4.8 4.8C4.7 6 7 6.5 10.2 5.6Z`; // inner hole, reverse direction
  const loopR = `M12 6C15.4 1.2 20.6 1 21 4.4C21.4 7.6 16.6 8.4 12 6Z` +
    `M13.8 5.6C17 6.5 19.3 6 19.2 4.8C19 3.4 16.4 3.6 13.8 5.6Z`;
  const tails = `M11 6.6L7.2 15.4L9.4 15L12 8Z M13 6.6L16.8 15.4L14.6 15L12 8Z`;
  const core = `M10.4 4.4H13.6V7.6H10.4Z`;
  return svg(24, 16, `<path fill="#000" fill-rule="evenodd" d="${loopL}${loopR}"/><path fill="#000" d="${tails}${core}"/>`);
};

// S8 pixel heart on a 9x8 grid, offset one cell inside a 12x8 period; highlight layer separate.
const heartRows = ['.XX...XX.', 'XXXX.XXXX', 'XXXXXXXXX', 'XXXXXXXXX', '.XXXXXXX.', '..XXXXX..', '...XXX...', '....X....'];
const runs = (rows, ox) => {
  let d = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      if (row[x] !== 'X') { x++; continue; }
      let e = x; while (row[e] === 'X') e++;
      d += `M${x + ox} ${y}h${e - x}v1h${x - e}Z`; x = e;
    }
  });
  return d;
};
const pixelHeart = () => svg(12, 8, `<path fill="#000" d="${runs(heartRows, 1)}"/>`, ' shape-rendering="crispEdges"');
const pixelHeartHi = () => svg(12, 8, `<path fill="#000" d="M2 1h2v1h-2Z M2 2h1v1h-1Z"/>`, ' shape-rendering="crispEdges"');

// S9 pixel stair zig-zag: 2-unit steps, 1-unit line, period 16.
const zigzag = () => {
  const ys = [2, 3, 4, 5, 5, 4, 3, 2];
  const d = ys.map((y, i) => `M${i * 2} ${y}h2v1h-2Z`).join('');
  return svg(16, 8, `<path fill="#000" d="${d}"/>`, ' shape-rendering="crispEdges"');
};

// S10 dither cloud: union of circles defines the cloud; density falls off outside the
// core and is thresholded with a 4x4 Bayer matrix on 2-unit cells. Horizontal runs merged.
const cloud = () => {
  const W = 64, H = 32, cell = 2;
  const blobs = [[18, 21, 8], [30, 15, 10.5], [43, 18, 9], [52, 23, 6], [30, 24, 8]];
  const bayer = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const lit = [];
  for (let j = 0; j < H / cell; j++) {
    const row = [];
    for (let i = 0; i < W / cell; i++) {
      const x = i * cell + 1, y = j * cell + 1;
      if (y > 29) { row.push(false); continue; } // flat-ish base
      const inside = Math.max(...blobs.map(([bx, by, br]) => br - Math.hypot(x - bx, y - by)));
      const density = Math.min(1, Math.max(0, (inside + 1.5) / 5.5));
      row.push(density > (bayer[j % 4][i % 4] + 0.5) / 16);
    }
    lit.push(row);
  }
  let d = '';
  lit.forEach((row, j) => {
    for (let i = 0; i < row.length;) {
      if (!row[i]) { i++; continue; }
      let e = i; while (row[e]) e++;
      d += `M${i * cell} ${j * cell}h${(e - i) * cell}v${cell}h${-(e - i) * cell}Z`; i = e;
    }
  });
  return svg(W, H, `<path fill="#000" d="${d}"/>`, ' shape-rendering="crispEdges"');
};

// S11 symbol sprinkle (96x96, everything kept clear of tile edges so it repeats cleanly).
const sprinkle = () => {
  const heart = (cx, cy, s) => {
    const k = s / 16;
    const P = (x, y) => pt(cx + (x - 8) * k, cy + (y - 8) * k);
    return `M${P(8, 14.5)}C${P(3, 11)} ${P(0.6, 8)} ${P(0.6, 5.2)}C${P(0.6, 2.4)} ${P(2.8, 0.8)} ${P(5, 0.8)}C${P(6.4, 0.8)} ${P(7.4, 1.6)} ${P(8, 2.8)}` +
      `C${P(8.6, 1.6)} ${P(9.6, 0.8)} ${P(11, 0.8)}C${P(13.2, 0.8)} ${P(15.4, 2.4)} ${P(15.4, 5.2)}C${P(15.4, 8)} ${P(13, 11)} ${P(8, 14.5)}Z`;
  };
  const cross = (cx, cy) => `M${pt(cx - 1.6, cy - 8)}h3.2v4.4h4.2v3.2h-4.2v8.4h-3.2v-8.4h-4.2v-3.2h4.2Z`;
  const bow = (cx, cy) =>
    `M${pt(cx, cy)}C${pt(cx - 3, cy - 6)} ${pt(cx - 9, cy - 5)} ${pt(cx - 8, cy)}C${pt(cx - 9, cy + 5)} ${pt(cx - 3, cy + 6)} ${pt(cx, cy)}Z` +
    `M${pt(cx, cy)}C${pt(cx + 3, cy - 6)} ${pt(cx + 9, cy - 5)} ${pt(cx + 8, cy)}C${pt(cx + 9, cy + 5)} ${pt(cx + 3, cy + 6)} ${pt(cx, cy)}Z` +
    `M${pt(cx - 0.6, cy + 1)}L${pt(cx - 3.6, cy + 7.5)}L${pt(cx - 1.6, cy + 7)}Z M${pt(cx + 0.6, cy + 1)}L${pt(cx + 3.6, cy + 7.5)}L${pt(cx + 1.6, cy + 7)}Z` +
    circle(cx, cy, 1.9, 1);
  const parts = [
    `<path d="${heart(17, 17, 16)}${heart(14, 82, 9)}${heart(84, 30, 7)}${cross(80, 58)}${bow(56, 16)}"/>`,
    // generic bunny: round head + two upright long ears (silhouette, no face)
    `<g><circle cx="34" cy="62" r="6.5"/><ellipse cx="30.5" cy="51.5" rx="2.3" ry="6.4" transform="rotate(-10 30.5 51.5)"/><ellipse cx="37.5" cy="51.5" rx="2.3" ry="6.4" transform="rotate(10 37.5 51.5)"/></g>`,
    // bandage: rounded strip with a pad marked by four pin holes (holes counter-wound)
    `<path transform="rotate(-28 66 82)" d="M${pt(56, 79)}h20a3 3 0 0 1 0 6h-20a3 3 0 0 1 0-6Z${circle(64.6, 81, 0.7, 0)}${circle(67.4, 81, 0.7, 0)}${circle(64.6, 83, 0.7, 0)}${circle(67.4, 83, 0.7, 0)}"/>`,
  ];
  return svg(96, 96, `<g fill="#000">${parts.join('')}</g>`);
};

// S12 pixel star: 5-cell plus with one-cell diagonal glints, 8x8, crisp.
const pixelStar = () => svg(8, 8,
  `<path fill="#000" d="M3 1h1v2h-1Z M3 4h1v2h-1Z M1 3h2v1h-2Z M4 3h2v1h-2Z M3 3h1v1h-1Z M1 1h1v1h-1Z M5 5h1v1h-1Z"/>`,
  ' shape-rendering="crispEdges"');
// S13 star field: deterministic LCG scatter of 1-cell dots and 3-cell plus stars on a 64x64 tile,
// kept one cell away from edges so tiles repeat without clipped stars.
const starField = () => {
  let s = 20261011; const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  let d = '';
  for (let i = 0; i < 18; i++) {
    const x = 2 + Math.floor(rnd() * 60), y = 2 + Math.floor(rnd() * 60);
    if (rnd() < 0.28) d += `M${x - 1} ${y}h3v1h-3Z M${x} ${y - 1}h1v1h-1Z M${x} ${y + 1}h1v1h-1Z`;
    else d += `M${x} ${y}h1v1h-1Z`;
  }
  return svg(64, 64, `<path fill="#000" d="${d}"/>`, ' shape-rendering="crispEdges"');
};

// S14 pixel icon set (12x12 grid, drawn row by row) — replacement glyphs for a few key lucide icons.
const icon12 = (rows) => svg(12, 12, `<path fill="#000" d="${runs(rows, 0)}"/>`, ' shape-rendering="crispEdges"');
const icons = {
  bell:   ['.....XX.....','....XXXX....','...XX..XX...','...X....X...','..XX....XX..','..X......X..','..X......X..','.XX......XX.','XXXXXXXXXXXX','............','....XXXX....','.....XX.....'],
  star:   ['.....XX.....','.....XX.....','....XXXX....','XXXXX..XXXXX','.XXX....XXX.','..XX....XX..','..XX....XX..','..X..XX..X..','.XX.XXXX.XX.','.XXXX..XXXX.','.XX......XX.','............'],
  search: ['..XXXXX.....','.XX...XX....','XX.....XX...','X.......X...','X.......X...','X.......X...','XX.....XX...','.XX...XXX...','..XXXXX.XX..','.........XX.','..........XX','...........X'],
  pin:    ['...XXXXXX...','..XX....XX..','.XX......XX.','.X...XX...X.','.X..X..X..X.','.X...XX...X.','.XX......XX.','..XX....XX..','...XX..XX...','....XXXX....','.....XX.....','............'],
  feed:   ['.XX...XX....','XXXX.XXXX...','XXXXXXXXX...','XXXXXXXXX...','.XXXXXXX....','..XXXXX..XX.','...XXX..XXXX','....X...XXXX','.......XXXXX','.......XXXXX','........XXX.','.........X..'],
  gear:   ['.....XX.....','..X.XXXX.X..','.XXXX..XXXX.','..XX....XX..','.XX..XX..XX.','XXX.X..X.XXX','XXX.X..X.XXX','.XX..XX..XX.','..XX....XX..','.XXXX..XXXX.','..X.XXXX.X..','.....XX.....'],
};

const out = {
  ...Object.fromEntries(Object.entries(icons).map(([k, r]) => [`s14-pixel-icon-${k}-12x12.svg`, icon12(r)])),
  's12-pixel-star-8x8.svg': pixelStar(),
  's13-pixel-starfield-64x64.svg': starField(),
  's1-scallop-16x8.svg': scallop(16, 8, 2, 1.2),
  's1-scallop-24x12.svg': scallop(24, 12, 3, 1.8),
  's2-fan-lace-20x12.svg': fan(),
  's4-lacing-column-16x16.svg': lacing(),
  's5-lacing-end-knot-24x16.svg': knot(),
  's8-pixel-heart-body-12x8.svg': pixelHeart(),
  's8-pixel-heart-highlight-12x8.svg': pixelHeartHi(),
  's9-pixel-zigzag-16x8.svg': zigzag(),
  's10-dither-cloud-64x32.svg': cloud(),
  's11-symbol-sprinkle-96x96.svg': sprinkle(),
};
for (const [name, text] of Object.entries(out)) {
  await fs.writeFile(path.join(src, name), text);
  console.log(name.padEnd(36), Buffer.byteLength(text), 'bytes');
}
