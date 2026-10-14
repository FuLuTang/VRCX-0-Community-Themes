// R97 Q5 card-title charm candidates — native integer pixel grids (1 char = 1 px).
// Palette letters map to the theme's existing r5 sticker palette.
export const PAL = {
  o: '#16112a', // ink outline
  P: '#ff7fcf', // hot pink
  p: '#ffb8e6', // light pink
  m: '#d97fc6', // mauve
  s: '#7a3f6d', // shade
  w: '#fdf4ff', // highlight white
  l: '#cdb0e8', // lilac
  v: '#6c5ce0', // violet
  g: '#b9add9', // wing / metal grey
  f: '#8f7fe0', // wing / metal shade
  t: '#6fe3d3', // teal accent
};

// Mirror helper: right half = reversed left half (optionally remapping letters).
const mirror = (rows, remap = {}) => rows.map(r => r + [...r].reverse().map(c => remap[c] ?? c).join(''));

export const CANDIDATES = [
  {
    id: 1, slug: 'pixel-bow', name: '像素蝴蝶结', en: 'Pixel bow',
    source: 'r5/src/bow.svg（24×24 双环蕾丝结，原图描边落在半像素上）→ 24×16 原生重绘',
    used: '否（--r5-bow 0 处引用）',
    rows: mirror([
      '............',
      '.oo.........',
      '.owoo.......',
      '.owPPoo.....',
      '.oPPPPPoo...',
      '.oPPPPPPPooo',
      '.oPPPPPmPopw',
      '.oPPPPmsPopp',
      '.oPPPPPmPopm',
      '.oPPPPPmmooo',
      '.oPPPPmmoopp',
      '.oPmmmoooppo',
      '.ommoo.opmo.',
      '.ooo..opmo..',
      '.....opmo...',
      '.....oooo...',
    ], { w: 'p' }),
  },
  {
    id: 2, slug: 'angel-heart', name: '天使翼心', en: 'Angel-wing heart',
    source: 'r5/src/angel-heart.svg（28×20）→ 24×16 原生重绘',
    used: '否（--r5-angel-heart 0 处引用）',
    rows: null, // composed below (wings under heart)
  },
  {
    id: 3, slug: 'pill', name: '双色药丸', en: 'Two-tone pill',
    source: 'dist/s21-pixel-pill-12x8.svg（单色 12×8 剪影）→ 16×8 双色原生重绘',
    used: '否（--jk-mask-s21 0 处引用）',
    rows: [
      '..oooooooooooo..',
      '.oPwwPPPowwwwwo.',
      'oPwPPPPPowwwwwlo',
      'oPPPPPPPowwwwwlo',
      'oPPPPPPPowwwwwlo',
      'oPPPPPPmowwwwllo',
      '.ommmmmmolllllo.',
      '..oooooooooooo..',
    ],
  },
  {
    id: 4, slug: 'lock-heart', name: '心锁', en: 'Heart padlock',
    source: 'r5/src/lock-heart.svg（20×24）→ 16×16 原生重绘',
    used: '否（--r5-lock-heart 0 处引用）',
    rows: [
      '.....oooooo.....',
      '....oggggggo....',
      '...oggooooffo...',
      '...ogo....ofo...',
      '...ogo....ofo...',
      '..oooooo.ooooo..',
      '.oPPPPPPoPPPPPo.',
      'oPwwPPPPPPPPPPPo',
      'oPwPPPPPPPPPPPmo',
      'oPPPPPPooPPPPPmo',
      'oPPPPPPooPPPPPmo',
      '.oPPPPPPoPPPPmo.',
      '..oPPPPoooPPmo..',
      '...oPPPPPPPmo...',
      '....oPPPPmmo....',
      '.....oooooo.....',
    ],
  },
  {
    id: 5, slug: 'heart-bubble', name: '对话框心', en: '♡ chat bubble',
    source: 'r5/src/bubble.svg（24×20）→ 16×14 原生重绘',
    used: '否（--r5-bubble 0 处引用）',
    rows: [
      '.oooooooooooooo.',
      'ollllllllllllllo',
      'olwwwwwwwwwwwwlo',
      'olwwwPPwwPPwwwlo',
      'olwwwPwPPPPwwwlo',
      'olwwwPPPPPswwwlo',
      'olwwwwPPPswwwwlo',
      'olwwwwwPswwwwwlo',
      'olwwwwwwwwwwwwlo',
      'ollllllllllllllo',
      '.oolloooooooooo.',
      '..olo...........',
      '..oo............',
      '..o.............',
    ],
  },
  {
    id: 6, slug: 'ribbon-cross', name: '缎带十字', en: 'Ribbon cross',
    source: 'r5/src/cross.svg（16×20）→ 12×16 原生重绘',
    used: '否（--r5-cross 0 处引用）',
    rows: [
      '....oooo....',
      '....owvo....',
      '....owvo....',
      '....owvo....',
      'ooooowvooooo',
      'owwwwPPvvvvo',
      'ovvvvPmsssso',
      'ooooovsooooo',
      '....ovso....',
      '....ovso....',
      '....ovso....',
      '....ovso....',
      '....ovso....',
      '....ovso....',
      '....ovso....',
      '....oooo....',
    ],
  },
];

// --- C2 angel heart: 24x16, wings first, heart on top -----------------------
{
  const W = 24, H = 16;
  const g = Array.from({ length: H }, () => Array(W).fill('.'));
  const leftWing = [
    'o.......',
    'oo......',
    'owo.....',
    'owwoo...',
    'owwwwo..',
    'owwwwwo.',
    'oggwwwwo',
    '.ogggwwo',
    'oofggwo.',
    '.offgoo.',
    '..ooo...',
  ];
  const wingTop = 2;
  leftWing.forEach((r, y) => [...r].forEach((c, x) => {
    if (c !== '.') { g[wingTop + y][x] = c; g[wingTop + y][W - 1 - x] = c; }
  }));
  const heart = [
    '..oo..oo..',
    '.oPPooPPo.',
    'oPwPPPPPPo',
    'oPwPPPPPPo',
    'oPPPPPPPmo',
    '.oPPPPPmo.',
    '..oPPPmo..',
    '...oPmo...',
    '....oo....',
  ];
  const hx = 7, hy = 4;
  heart.forEach((r, y) => [...r].forEach((c, x) => { if (c !== '.') g[hy + y][hx + x] = c; }));
  CANDIDATES[1].rows = g.map(r => r.join(''));
}

// SVG: one path per colour, horizontal runs, integer grid, crispEdges.
export function toSvg(rows, title, mono = false) {
  const h = rows.length, w = rows[0].length;
  for (const r of rows) if (r.length !== w) throw new Error(`${title}: ragged row "${r}" (${r.length} != ${w})`);
  const byColor = new Map();
  rows.forEach((r, y) => {
    let x = 0;
    while (x < w) {
      const c = r[x];
      if (c === '.') { x++; continue; }
      let n = 1; while (x + n < w && r[x + n] === c) n++;
      const key = mono ? '#000' : PAL[c];
      if (!key) throw new Error(`${title}: unknown palette letter ${c}`);
      if (!byColor.has(key)) byColor.set(key, []);
      byColor.get(key).push(`M${x} ${y}h${n}v1h-${n}`);
      x += n;
    }
  });
  const paths = [...byColor].map(([fill, d]) => `<path fill="${fill}" d="${d.join('')}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><title>${title}</title>${paths}</svg>`;
}
