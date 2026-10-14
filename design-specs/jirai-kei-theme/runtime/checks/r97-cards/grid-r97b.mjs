/* R9.7b helper: pixel grids for the pill charm (parsed from original-assets cand-3) and the new 16x8 lace,
   plus a compact rectangle encoder (one path per colour, %23-escaped). Used by verify-r97b.mjs. */
import fs from 'node:fs';
export const PILL_SVG = '/home/fulutang/Documents/Github/VRCX-0-Themes-JiraiKeiKuteWin98/design-specs/jirai-kei-theme/original-assets/r97-charm/cand-3-pill.svg';
/* parse 'Mx yhWvHh-W' runs into a W x H grid of colour strings (null = transparent) */
export function parseSvg(src, W = 16, H = 8) {
    const g = Array.from({length: H}, () => Array(W).fill(null));
    for (const [, fill, d] of src.matchAll(/<path fill="([^"]+)" d="([^"]+)"/g))
        for (const [, x, y, w, h] of d.matchAll(/M(\d+) (\d+)h(\d+)v(\d+)h-\d+/g))
            for (let yy = +y; yy < +y + +h; yy++) for (let xx = +x; xx < +x + +w; xx++) g[yy][xx] = fill;
    return g;
}
export const LACE_ASCII = [
    '################',
    '################',
    '################',
    '.##############.',
    '.######..######.',
    '..#####..#####..',
    '...##########...',
    '.....######.....'];
export const laceGrid = () => LACE_ASCII.map((r) => [...r].map((c) => (c === '#' ? '#000' : null)));
/* greedy: horizontal runs, then extend down while the row below has the same run */
export function encode(g, colourAttr = true) {
    const H = g.length, W = g[0].length, used = g.map((r) => r.map(() => false)), by = new Map();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const c = g[y][x]; if (!c || used[y][x]) continue;
        let w = 1; while (x + w < W && g[y][x + w] === c && !used[y][x + w]) w++;
        let h = 1; while (y + h < H && [...Array(w).keys()].every((i) => g[y + h][x + i] === c && !used[y + h][x + i]) && (x === 0 || g[y + h][x - 1] !== c || used[y + h][x - 1]) && (x + w === W || g[y + h][x + w] !== c)) h++;
        for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) used[yy][xx] = true;
        by.set(c, (by.get(c) || '') + `M${x} ${y}h${w}v${h}H${x}`);
    }
    const paths = [...by].map(([c, d]) => `<path${colourAttr ? ` fill='${c.replace('#', '%23')}'` : ''} d='${d}'/>`).join('');
    return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' shape-rendering='crispEdges'>${paths}</svg>`;
}
if (process.argv[1] && process.argv[1].endsWith('grid-r97b.mjs')) {
    const pill = encode(parseSvg(fs.readFileSync(PILL_SVG, 'utf8'))), lace = encode(laceGrid(), false);
    console.log(pill.length, pill); console.log(lace.length, lace);
}
