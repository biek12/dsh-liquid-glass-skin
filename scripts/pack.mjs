import { mkdir, mkdtemp, readFile, writeFile, cp, rename, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { createHash } from 'node:crypto';
import { releaseTarget, releaseName, assertNativeArchitecture } from './lib/release-target.mjs';

const { values } = parseArgs({ options: { arch: { type: 'string', default: process.arch } } });
const target = releaseTarget(values.arch);
if (process.platform !== 'darwin') throw new Error('Complete platform packages require macOS and its SDK; use npm run build for JS-only development');
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const destination = resolve('releases');
const stage = await mkdtemp(join(tmpdir(), 'nexusx-release-'));
const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status})`);
  return result;
};
try {
  run(process.execPath, ['scripts/build.mjs']);
  // Stage only package files. Each target gets a freshly compiled companion, independent of local lib/ contents.
  for (const file of [...pkg.files, 'LICENSE']) {
    await mkdir(join(stage, file, '..'), { recursive: true });
    await cp(file, join(stage, file), { recursive: true });
  }
  const executable = join(stage, 'lib/desktop/PetCompanion');
  await rm(executable, { force: true });
  run(process.execPath, ['scripts/build-desktop.mjs', '--arch', target.arch, '--output', executable]);
  assertNativeArchitecture(await readFile(executable), target.arch);
  const nativeSha256 = createHash('sha256').update(await readFile(executable)).digest('hex');
  const manifest = { ...pkg, os: [target.platform], cpu: [target.arch], files: [...pkg.files, 'BUILD_INFO.json'] };
  // An installed package has no developer scripts to run. In particular, it never recompiles or downloads a pet.
  delete manifest.scripts;
  delete manifest.devDependencies;
  await writeFile(join(stage, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
  await writeFile(join(stage, 'BUILD_INFO.json'), JSON.stringify({ name: pkg.name, version: pkg.version, platform: target.platform, arch: target.arch, minimumMacOS: '13.0', desktopCompanion: { path: 'lib/desktop/PetCompanion', sha256: nativeSha256, native: true } }, null, 2) + '\n');
  const result = run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', stage], { cwd: stage, stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' });
  const packed = JSON.parse(result.stdout)[0];
  await mkdir(destination, { recursive: true });
  const filename = releaseName(pkg, target);
  await rename(join(stage, packed.filename), join(destination, filename));
  console.log(`Packaged ${filename} (full plugin + native desktop companion)`);
} finally {
  await rm(stage, { recursive: true, force: true });
}
