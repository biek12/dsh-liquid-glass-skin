import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { releaseTarget, releaseName } from './lib/release-target.mjs';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const checksums = [];
for (const arch of ['arm64', 'x64']) {
  const result = spawnSync(process.execPath, ['scripts/pack.mjs', '--arch', arch], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Release build failed for ${arch}`);
  const filename = releaseName(pkg, releaseTarget(arch));
  checksums.push(`${createHash('sha256').update(await readFile(`releases/${filename}`)).digest('hex')}  ${filename}`);
}
await writeFile('releases/SHA256SUMS', checksums.join('\n') + '\n');
console.log('Built both macOS CPU packages and SHA256SUMS.');
