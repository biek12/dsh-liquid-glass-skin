import { readFile, writeFile } from 'node:fs/promises';
const source = await readFile('vendor/dsh-context/lib/client.js', 'utf8');
const loader = 'window.__ModuleLoader__.load(';
const selector = '[data-plugin-package="dsh-context"]';
if (source.split(loader).length !== 2 || source.split(selector).length !== 2) throw new Error('Unexpected upstream context bundle; review its adapter before building.');
const adapted = source.replace(loader, 'capture(').replace(selector, '[data-plugin-package="dsh-super-nexusx"]');
await writeFile('src/vendor/context-client.cjs', 'module.exports = () => { let plugin; const capture = entry => { plugin = entry.factory(require); };\n' + adapted + '\nreturn plugin; };\n');
