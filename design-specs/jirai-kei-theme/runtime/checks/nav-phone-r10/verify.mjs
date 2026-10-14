import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/tmp/dsh-theme-tools/node_modules/playwright/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtime = path.resolve(here, '../..');
const sourcePath = path.join(runtime, 'nav-phone-r10.css');
const builtPath = path.join(runtime, 'preview-package/jirai-kei-theme/theme.css');
const gifPath = path.join(here, 'phone-animation-153frames.gif');
const source = await fs.readFile(sourcePath, 'utf8');
const built = await fs.readFile(builtPath, 'utf8');

assert.match(source, /animation:\s*r10-nav-phone-loop 27\.54s steps\(153, end\) infinite,\s*r10-nav-phone-float 8\.6s ease-in-out -2\.3s infinite;/,
  '153 frames must run at 180ms each and float on an independent, phase-offset timeline');
assert.match(source, /@keyframes r10-nav-phone-float\s*\{[\s\S]*?50%\s*\{\s*transform:\s*translateY\(-1px\)/,
  'Slow float keyframes must translate the whole layered canvas upward');
assert(source.includes('@media (prefers-reduced-motion: reduce)') && source.includes('html.reduce-effects'),
  'Both reduced-motion switches must remain present');
assert(built.includes('/* SECTION nav-phone-r10 */\n' + source), 'Preview package has stale nav-phone-r10 CSS');

function inspectGif(buffer) {
  assert(['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6)), 'Unexpected GIF signature');
  const width = buffer.readUInt16LE(6), height = buffer.readUInt16LE(8), packed = buffer[10];
  let offset = 13;
  if (packed & 0x80) offset += 3 * (1 << ((packed & 7) + 1));
  let pendingDelay = null, loop = null;
  const delays = [];
  while (offset < buffer.length) {
    const tag = buffer[offset++];
    if (tag === 0x3b) break;
    if (tag === 0x21) {
      const label = buffer[offset++];
      if (label === 0xf9) {
        assert.equal(buffer[offset++], 4, 'Malformed Graphic Control Extension');
        offset++; // packed flags
        pendingDelay = buffer.readUInt16LE(offset);
        offset += 2;
        offset++; // transparent palette index
        assert.equal(buffer[offset++], 0, 'Malformed Graphic Control Extension terminator');
      } else {
        const size = buffer[offset++];
        let app = '';
        if (label === 0xff) {
          app = buffer.toString('ascii', offset, offset + size);
        }
        offset += size;
        let blocks = [];
        while (buffer[offset] !== 0) {
          const size = buffer[offset++];
          blocks.push(buffer.subarray(offset, offset + size));
          offset += size;
        }
        offset++;
        if (app.startsWith('NETSCAPE') && blocks.length && blocks[0][0] === 1) {
          loop = blocks[0].readUInt16LE(1);
        }
      }
    } else if (tag === 0x2c) {
      offset += 8;
      const localPacked = buffer[offset++];
      if (localPacked & 0x80) offset += 3 * (1 << ((localPacked & 7) + 1));
      offset++; // LZW minimum code size
      while (buffer[offset] !== 0) {
        const size = buffer[offset++];
        offset += size;
      }
      offset++;
      delays.push(pendingDelay);
      pendingDelay = null;
    } else {
      throw new Error(`Unexpected GIF block marker 0x${tag.toString(16)}`);
    }
  }
  return { width, height, frames: delays.length, delays, loop };
}

const gif = inspectGif(await fs.readFile(gifPath));
assert.equal(gif.width, 240);
assert.equal(gif.height, 220);
assert.equal(gif.frames, 153);
assert(gif.delays.every((delay) => delay === 18), 'Every GIF frame must have a 180ms delay');
assert.equal(gif.loop, 0, 'GIF must loop infinitely');

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 400, height: 180 } });
  await page.setContent('<!doctype html><html><body><div data-slot="sidebar" data-state="expanded"><div data-slot="sidebar-inner"></div></div></body></html>');
  await page.addStyleTag({ content: source });
  const snapshot = () => page.evaluate(() => {
    const el = document.querySelector('[data-slot="sidebar-inner"]');
    const style = getComputedStyle(el, '::after');
    return {
      names: style.animationName.split(',').map((value) => value.trim()),
      durations: style.animationDuration.split(',').map((value) => value.trim()),
      delays: style.animationDelay.split(',').map((value) => value.trim()),
      imageLayers: (style.backgroundImage.match(/url\(/g) || []).length,
      transform: style.transform
    };
  });
  const active = await snapshot();
  assert.deepEqual(active.names, ['r10-nav-phone-loop', 'r10-nav-phone-float']);
  assert.deepEqual(active.durations, ['27.54s', '8.6s']);
  assert.deepEqual(active.delays, ['0s', '-2.3s']);
  assert.equal(active.imageLayers, 6, 'All six background layers must stay on one shared canvas');
  assert.notEqual(active.transform, 'none', 'Float must be actively transforming the combined canvas');
  await page.waitForTimeout(2100);
  const drifted = await snapshot();
  assert.notEqual(drifted.transform, active.transform, 'Independent float timeline must move the layered canvas over time');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.deepEqual((await snapshot()).names, ['none'], 'prefers-reduced-motion must stop both timelines');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => document.documentElement.classList.add('reduce-effects'));
  assert.deepEqual((await snapshot()).names, ['none'], 'html.reduce-effects must stop both timelines');
  console.log(JSON.stringify({ result: 'PASS', css: { frames: 153, frameMs: 180, cycleMs: 27540, floatPeriodMs: 8600, floatPhaseMs: -2300, layers: active.imageLayers, transformAtStart: active.transform, transformAfter2100ms: drifted.transform }, gif: { frames: gif.frames, delayMs: 180, durationMs: gif.frames * 180, loop: gif.loop }, reducedMotion: 'both animations stopped' }, null, 2));
} finally {
  await browser.close();
}
