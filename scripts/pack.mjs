import { mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
await mkdir('releases', { recursive: true });
const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['pack', '--pack-destination', 'releases'], { stdio: 'inherit', shell: process.platform === 'win32' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
