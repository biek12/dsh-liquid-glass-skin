import { build } from 'esbuild';
import { spawn } from 'node:child_process';
await import('./prepare-context.mjs');
await build({ entryPoints: ['tests/ui.test.jsx'], outfile: 'artifacts/ui.test.mjs', bundle: true, packages: 'external', platform: 'node', format: 'esm', target: 'node22', loader: { '.png': 'dataurl', '.webp': 'dataurl', '.css': 'text' } });
const child = spawn(process.execPath, ['--test', 'artifacts/ui.test.mjs'], { stdio: 'inherit' });
child.on('exit', code => { process.exitCode = code ?? 1; });
