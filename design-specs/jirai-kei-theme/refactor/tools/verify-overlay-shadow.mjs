import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const styleDir = path.join(root, 'src', 'style');
const literal = 'inset 1px 1px 0 #69557c, inset -1px -1px 0 #7a3f6d, 3px 3px 0 #100b1e';
const variable = 'var(--jk-overlay-raised)';
const files = fs.readdirSync(styleDir, { withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith('.css'))
  .map(entry => path.join(styleDir, entry.name));
const references = [];
const duplicates = [];
const declarations = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/\bbox-shadow\s*:\s*([^;]*);/g)) {
    const line = text.slice(0, match.index).split('\n').length;
    const value = match[1].trim();
    const location = `${path.relative(root, file)}:${line}`;
    declarations.push({ location, value });
    if (value.includes(literal)) duplicates.push(location);
    if (value.includes(variable)) references.push({ location, value });
  }
}

for (const { location, value } of references) console.log(`${location}: box-shadow: ${value};`);
console.log(`Scanned ${declarations.length} box-shadow declarations across ${files.length} style files.`);
console.log(`RESULT: ${references.length} references to ${variable}, ${duplicates.length} literal duplicates remaining`);
if (duplicates.length) {
  console.error(`Literal shadow still present at: ${duplicates.join(', ')}`);
  process.exitCode = 1;
}
if (references.length !== 6) {
  console.error(`Expected 6 references to ${variable}, found ${references.length}`);
  process.exitCode = 1;
}
