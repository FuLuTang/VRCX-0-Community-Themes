// build-runtime has one legacy write to runtime/ribbon-heart-charm.svg.
// Suppress it only if its computed content is byte-identical; all package
// artifacts still go to the approved isolated JIRAI_OUT. Do not change builder.
import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
const runtime=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const charm=path.join(runtime,'ribbon-heart-charm.svg'),write=fs.writeFile.bind(fs);
fs.writeFile=async (file,data,...opts)=>{if(path.resolve(String(file))===charm){const existing=await fs.readFile(charm);if(!existing.equals(Buffer.from(data)))throw new Error('Builder attempted charm modification outside task scope');return;}return write(file,data,...opts)};
if(process.env.JIRAI_OUT!=='/tmp/jirai-r9-out-popups/jirai-kei-theme')throw new Error('Set exact isolated JIRAI_OUT');
await import(path.join(runtime,'build-runtime.mjs'));
