/* Reproducibly rasterize s2-fan-lace-20x12 into a crisp, paint-only R8 lace tile. */
import fs from 'node:fs/promises';
import sharp from '/tmp/dsh-theme-tools/node_modules/sharp/dist/index.mjs';

const sourceUrl = new URL('../../../original-assets/dist/s2-fan-lace-20x12.svg', import.meta.url);
const sourceSvg = await fs.readFile(sourceUrl, 'utf8');
const sourceWidth = 20;
const sourceHeight = 12;
const tileWidth = 20;
const tileHeight = 8;
const face = '#f9d1e7';
const meat = '#d97fc6';
const dark = '#201936';

// Rasterize the library mask at 1×, threshold alpha, then flip vertically.
const sourceRaster = await sharp(Buffer.from(sourceSvg), { density: 72 })
    .resize(sourceWidth, sourceHeight, { fit: 'fill', kernel: 'nearest' })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
if (sourceRaster.info.width !== sourceWidth || sourceRaster.info.height !== sourceHeight) {
    throw new Error(`Unexpected source raster size: ${sourceRaster.info.width}x${sourceRaster.info.height}`);
}
const flipped = Array.from({ length: sourceHeight }, (_, y) => {
    const sourceY = sourceHeight - 1 - y;
    return Array.from({ length: sourceWidth }, (_, x) => sourceRaster.data[(sourceY * sourceWidth + x) * sourceRaster.info.channels + 3] >= 128);
});

// The library artwork is 12px high but the existing ::before is 8px. Keep the 20px
// period and shrink only by nearest-neighbour row selection, preserving a hard pixel grid.
const rowMap = Array.from({ length: tileHeight }, (_, y) => Math.round((y + 0.5) * sourceHeight / tileHeight - 0.5));
const mask = rowMap.map((sourceY) => flipped[sourceY].slice());

// Find the flat statusbar-facing base; the row immediately above it is the last outer valley.
const firstFullRow = mask.findIndex((row) => row.every(Boolean));
if (firstFullRow <= 0) throw new Error('Could not identify the fan-lace base row');
const valleyY = firstFullRow - 1;

// Mark transparent pixels connected to top/bottom as exterior, with horizontal tile wrapping.
const outside = Array.from({ length: tileHeight }, () => Array(tileWidth).fill(false));
const queue = [];
const enqueue = (x, y) => {
    const wrappedX = (x + tileWidth) % tileWidth;
    if (y < 0 || y >= tileHeight || mask[y][wrappedX] || outside[y][wrappedX]) return;
    outside[y][wrappedX] = true;
    queue.push([wrappedX, y]);
};
for (let x = 0; x < tileWidth; x += 1) {
    enqueue(x, 0);
    enqueue(x, tileHeight - 1);
}
for (let i = 0; i < queue.length; i += 1) {
    const [x, y] = queue[i];
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
}
const holes = mask.map((row, y) => row.map((inside, x) => !inside && !outside[y][x]));
const holesBelowValley = holes.reduce((sum, row, y) => sum + (y > valleyY ? row.filter(Boolean).length : 0), 0);
if (holesBelowValley !== 0) throw new Error(`Interior cutouts extend below the fan valley: ${holesBelowValley}`);

// A 4-neighbour silhouette edge is meat-pink only above the valley. The bar-facing
// base row and all pixels below the valley remain the exact status-face color.
const outline = Array.from({ length: tileHeight }, (_, y) => Array.from({ length: tileWidth }, (_, x) => {
    if (!mask[y][x] || y > valleyY) return false;
    return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some(([nx, ny]) => {
        const wrappedX = (nx + tileWidth) % tileWidth;
        return ny < 0 || ny >= tileHeight || outside[ny][wrappedX];
    });
}));
const meatPixels = outline.map((row, y) => row.map((edge, x) => edge || holes[y][x]));
if (meatPixels.slice(valleyY + 1).some((row) => row.some(Boolean))) {
    throw new Error('Meat-pink pixels remain below the valley');
}

// Encode the body silhouette plus meat-pink contour/cutouts; leave the exterior transparent.
// The existing pseudo keeps scaleY(-1), so serialize inverse rows to render the already-
// flipped upward-facing mask without changing pseudo geometry or height.
const colorRows = mask.map((row, y) => row.map((inside, x) => meatPixels[y][x] ? meat : inside ? face : dark));
const serializedRows = Array.from({ length: tileHeight }, (_, svgY) => colorRows[tileHeight - 1 - svgY]);
const rectsByColor = { [face]: [], [meat]: [] };
for (let y = 0; y < tileHeight; y += 1) {
    let x = 0;
    while (x < tileWidth) {
        const color = serializedRows[y][x];
        if (color === dark) { x += 1; continue; }
        const start = x;
        while (x < tileWidth && serializedRows[y][x] === color) x += 1;
        rectsByColor[color].push(`<rect x="${start}" y="${y}" width="${x - start}" height="1"/>`);
    }
}
if (!mask[tileHeight - 1].every(Boolean) || colorRows[tileHeight - 1].some((color) => color !== face)) {
    throw new Error('Tile bottom row must be fully status-face colored');
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth}" height="${tileHeight}" viewBox="0 0 ${tileWidth} ${tileHeight}" shape-rendering="crispEdges"><g fill="${face}">${rectsByColor[face].join('')}</g><g fill="${meat}">${rectsByColor[meat].join('')}</g></svg>`;
const dataUrl = `url("data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}")`;
const maskRows = mask.map((row) => row.map((inside) => inside ? '#' : '.').join(''));
const generated = {
    source: sourceUrl.pathname,
    sourceDimensions: `${sourceWidth}x${sourceHeight}`,
    rasterScale: '1x alpha raster, threshold >= 128, vertical flip; SVG rows precompensate inherited scaleY(-1)',
    outputDimensions: `${tileWidth}x${tileHeight}`,
    heightHandling: `nearest-neighbour row shrink 12->8; rows ${rowMap.join(',')}`,
    valleyY,
    palette: { exterior: dark, face, meat },
    maskRows,
    pixelRows: colorRows.map((row) => row.map((color) => color.toUpperCase()).join(' ')),
    outlinePixelCount: outline.flat().filter(Boolean).length,
    interiorCutoutPixelCount: holes.flat().filter(Boolean).length,
    svg,
    cssDeclaration: `--r8-lace-tile: ${dataUrl};`,
    dataUrl
};
await fs.writeFile(new URL('lace2-generated.svg', import.meta.url), `${svg}\n`);
await fs.writeFile(new URL('lace2-generated.json', import.meta.url), `${JSON.stringify(generated, null, 2)}\n`);
if (process.argv.includes('--apply-css')) {
    const cssUrl = new URL('../../chrome-r8.css', import.meta.url);
    const css = await fs.readFile(cssUrl, 'utf8');
    const tileLines = css.match(/^\s*--r8-lace-tile\s*:[^\n]*$/gm) ?? [];
    if (tileLines.length !== 1) throw new Error(`Expected one --r8-lace-tile declaration, found ${tileLines.length}`);
    await fs.writeFile(cssUrl, css.replace(tileLines[0], `    ${generated.cssDeclaration}`));
}
console.log(JSON.stringify(generated, null, 2));
