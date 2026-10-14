// Build only the approved preview-package/report, suppress byte-identical legacy SVG write.
import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
const runtime=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');const out=path.join(runtime,'preview-package/jirai-kei-theme'),report=path.join(runtime,'build-report.json'),charm=path.join(runtime,'ribbon-heart-charm.svg');
if(process.env.JIRAI_OUT)throw Error('This wrapper builds the assigned local preview-package only');
const write=fs.writeFile.bind(fs);fs.writeFile=async(file,data,...opts)=>{const target=path.resolve(String(file));if(target===charm){if(!(await fs.readFile(charm)).equals(Buffer.from(data)))throw Error('Out-of-scope legacy charm content differs');return}if(target!==report&&!target.startsWith(out+path.sep))throw Error('Out-of-scope builder write: '+target);return write(file,data,...opts)};
await import(path.join(runtime,'build-runtime.mjs'));
