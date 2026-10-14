// Safe isolated build: the unchanged builder writes one generated charm in runtime/.
// Suppress that write only when it is byte-identical; all package outputs go to /tmp.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const runtime = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const charm = path.join(runtime, 'ribbon-heart-charm.svg');
const write = fs.writeFile.bind(fs);
fs.writeFile = async (file, data, ...opts) => {
  if (path.resolve(String(file)) === charm) {
    const existing = await fs.readFile(charm);
    if (!existing.equals(Buffer.from(data))) throw new Error('Builder attempted out-of-scope charm modification');
    return;
  }
  return write(file, data, ...opts);
};
if (process.env.JIRAI_OUT !== '/tmp/jirai-r10-out-overlays/jirai-kei-theme') {
  throw new Error('Set exact isolated JIRAI_OUT');
}
await import(path.join(runtime, 'build-runtime.mjs'));
