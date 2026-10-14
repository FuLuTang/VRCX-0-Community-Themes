// R9+ loader sprite builder.
// Source: NEEDY GIRL OVERDOSE dance animation, GIF/320x240.gif (11 frames, 100 ms
// each, transparent). User confirmed the fan-work redistribution question is settled
// for this project; we still never ship the 320x240.gif itself — only a tightly
// cropped, downscaled, palette-quantised sprite sheet inlined as a data URI, which
// is ~14% of the raw GIF's base64 size and lets CSS own playback (GIF would autoplay
// and could not be stopped by prefers-reduced-motion).
//
// Usage: node tools/build-loader-sprite.mjs <320x240.gif> <out.css-snippet> [48x62|56x72|64x82]
// The size profile is rendered independently from each original GIF frame; no
// previously downscaled sprite sheet is ever enlarged. Default: 56x72.
// Requires sharp via SHARP_MODULE when the default resolution fails.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// SHARP_MODULE points straight at a sharp package directory (same convention as the
// other check scripts in this folder), e.g. /tmp/dsh-theme-tools/node_modules/sharp.
const sharpModule = process.env.SHARP_MODULE;
const sharp = sharpModule ? require(sharpModule) : require('sharp');

// Measured union alpha bounding box of all 11 frames in the 320x240 source,
// padded by 2 px so the hair ribbons never clip mid-swing.
const CROP = { left: 76, top: 26, width: 164, height: 210 };
const FRAME_PROFILES = {
    '48x62': { width: 48, height: 62 },
    '56x72': { width: 56, height: 72 },
    '64x82': { width: 64, height: 82 }
};
const COLOURS = 80;

const [, , sourceArg, outArg, profileArg = '56x72'] = process.argv;
if (!sourceArg || !outArg || !FRAME_PROFILES[profileArg]) {
    console.error('usage: build-loader-sprite.mjs <320x240.gif> <out.css> [48x62|56x72|64x82]');
    process.exit(2);
}
const FRAME = FRAME_PROFILES[profileArg];

const meta = await sharp(sourceArg, { animated: true }).metadata();
const frames = meta.pages;
if (frames !== 11 || meta.delay?.length !== frames || meta.delay.some((delay) => delay !== 100)) {
    throw new Error(`Expected the original 11-frame / 100ms source, got ${frames} frames with delays ${JSON.stringify(meta.delay)}`);
}
const sheetWidth = FRAME.width * frames;

const frameBuffers = [];
for (let index = 0; index < frames; index += 1) {
    frameBuffers.push(
        await sharp(sourceArg, { page: index })
            .extract(CROP)
            .resize(FRAME.width, FRAME.height, { kernel: 'lanczos3' })
            .png()
            .toBuffer()
    );
}

const sheet = await sharp({
    create: {
        width: sheetWidth,
        height: FRAME.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
})
    .composite(
        frameBuffers.map((input, index) => ({
            input,
            left: index * FRAME.width,
            top: 0
        }))
    )
    .png({ palette: true, colours: COLOURS, dither: 0, effort: 10 })
    .toBuffer();

const base64 = sheet.toString('base64');
const scale = 1;
const displayWidth = FRAME.width * scale;
const displayHeight = FRAME.height * scale;
const frameDelayMs = meta.delay[0];
const durationMs = meta.delay.reduce((total, delay) => total + delay, 0);

const css = `/* R9+ page-state loader: cropped 11-frame sprite, played by CSS only.
   Geometry: sprite ${sheetWidth}x${FRAME.height} CSS px (${frames} frames of ${FRAME.width}x${FRAME.height}),
   rendered at ${displayWidth}x${displayHeight} native CSS px (1x; Windows DPI scales the display).
   Playback is CSS-owned so html.reduce-effects and prefers-reduced-motion can
   freeze it on frame 1; an inlined GIF would autoplay regardless. */
:root {
  --jk-loader-sheet: url("data:image/png;base64,${base64}");
  --jk-loader-frame-w: ${FRAME.width}px;
  --jk-loader-frame-h: ${FRAME.height}px;
  --jk-loader-frames: ${frames};
  --jk-loader-duration: ${durationMs}ms;
}

@keyframes jk-loader-dance {
  from { background-position: 0 0; }
  to { background-position: -${sheetWidth * scale}px 0; }
}
`;

writeFileSync(outArg, css);
console.log(
    JSON.stringify(
        {
            frames,
            profile: profileArg,
            frame: FRAME,
            frameDelayMs,
            crop: CROP,
            sheetPixels: `${sheetWidth}x${FRAME.height}`,
            display: `${displayWidth}x${displayHeight}`,
            scale,
            durationMs,
            pngBytes: sheet.length,
            base64Chars: base64.length,
            previousGifBase64Chars: Math.ceil(121377 / 3) * 4,
            out: outArg
        },
        null,
        2
    )
);
