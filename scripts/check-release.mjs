import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { releaseTarget, releaseName, assertNativeArchitecture } from './lib/release-target.mjs';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const sums = await readFile('releases/SHA256SUMS', 'utf8');
for (const arch of ['arm64', 'x64']) {
  const filename = releaseName(pkg, releaseTarget(arch));
  const archive = resolve(`releases/${filename}`);
  assert.ok(sums.includes(`${createHash('sha256').update(await readFile(archive)).digest('hex')}  ${filename}`));
  const temporary = await mkdtemp(join(tmpdir(), 'nexusx-release-check-'));
  try {
    execFileSync('tar', ['-xzf', archive, '-C', temporary]);
    const base = join(temporary, 'package');
    const manifest = JSON.parse(await readFile(join(base, 'package.json'), 'utf8'));
    const info = JSON.parse(await readFile(join(base, 'BUILD_INFO.json'), 'utf8'));
    assert.equal(manifest.name, pkg.name); assert.equal(manifest.version, pkg.version);
    assert.deepEqual(manifest.os, ['darwin']); assert.deepEqual(manifest.cpu, [arch]);
    assert.equal(info.platform, 'darwin'); assert.equal(info.arch, arch); assert.equal(info.version, pkg.version);
    const native = await readFile(join(base, info.desktopCompanion.path));
    assertNativeArchitecture(native, arch);
    assert.equal(createHash('sha256').update(native).digest('hex'), info.desktopCompanion.sha256);
    assert.ok((await stat(join(base, info.desktopCompanion.path))).mode & 0o111, 'Companion must retain executable permissions');
    for (const file of ['lib/index.js', 'lib/client.js', 'lib/desktop/pet.js', 'lib/notification-chime.wav', 'cordis.patch.yml', 'locale/zh.json', 'LICENSE']) assert.ok((await stat(join(base, file))).size > 0);
    assert.equal(manifest.scripts, undefined, 'Installed package must not depend on build hooks');
    console.log(`PASS: ${filename} contains the full plugin, correct native CPU, package constraints and matching checksums.`);
  } finally { await rm(temporary, { recursive: true, force: true }); }
}
