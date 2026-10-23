/** Read the packaged artifact through the installed DSH manager, using only a temporary Profile. */
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const core = process.env.DSH_MODULE_ROOT || '/Applications/DSH Desktop Beta.app/Contents/Resources/app/node_modules/@deepseek-ai';
const { PluginManager } = await import(pathToFileURL(`${core}/dsh-plugin-manager/lib/index.js`));
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const tarball = resolve(`releases/${pkg.name}-${pkg.version}.tgz`);
const temporary = await mkdtemp(join(tmpdir(), 'super-nexusx-bundle-'));
try {
  execFileSync('tar', ['-xzf', tarball, '-C', temporary]);
  const profileDir = join(temporary, 'profile');
  await mkdir(join(profileDir, 'node_modules'), { recursive: true });
  const installAnchor = join(temporary, 'installation.json');
  await writeFile(installAnchor, JSON.stringify({ name: 'isolated-installation', dependencies: {} }));
  const manifestPath = join(profileDir, 'package.json');
  const manifest = { name: 'isolated-profile', private: true, dependencies: {}, dsh: { profile: { bundles: [] } } };
  await writeFile(manifestPath, JSON.stringify(manifest));
  await writeFile(join(profileDir, 'cordis.patch.yml'), `- insert:\n    - id: super-nexusx-local\n      name: ${pathToFileURL(join(temporary, 'package/lib/index.js')).href}\n`);
  await symlink(join(temporary, 'package'), join(profileDir, 'node_modules', pkg.name), 'dir');
  // Invoke the host's real read-only methods; no service or live application is started.
  const manager = {
    profile: { dir: profileDir, installAnchor },
    managementBundles: new Set(),
    ctx: { loader: { entries: () => [] }, get: () => undefined },
  };
  for (const method of ['listBundles', 'declaredRows', 'bundleRows', 'protectsManager']) manager[method] = PluginManager.prototype[method];
  assert.equal((await manager.listBundles()).find(row => row.name === pkg.name), undefined, 'File-only entries are absent from the installed bundle list');
  manifest.dependencies[pkg.name] = `file:${tarball}`;
  manifest.dsh.profile.bundles.push(pkg.name);
  await writeFile(manifestPath, JSON.stringify(manifest));
  const row = (await manager.listBundles()).find(item => item.name === pkg.name);
  assert.ok(row, 'Registered package must appear in installed bundles');
  assert.equal(row.error, undefined);
  assert.equal(row.installed, true);
  assert.equal(row.enabled, true);
  assert.equal(row.version, pkg.version);
  assert.ok(row.meta?.title);
  assert.ok(row.rows.some(item => item.moduleName === pkg.name && item.rowId === 'super-nexusx'));
  await accessPackageFiles(join(temporary, 'package'));
  console.log('PASS: packaged artifact appears in installed DSH bundles with version, locale and correct patch rows; file-only entry does not.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}

async function accessPackageFiles(directory) {
  const { access, readdir } = await import('node:fs/promises');
  for (const file of ['lib/index.js', 'lib/client.js', 'lib/desktop/pet.js', 'lib/notification-chime.wav', 'cordis.patch.yml', 'LICENSE', 'locale/en.json', 'locale/zh.json']) await access(join(directory, file));
  const files = await readdir(directory, { recursive: true });
  assert.ok(!files.some(file => /^(?:node_modules|artifacts|backups|releases)(?:[/\\]|$)|INSTALLATION\.json|\.DS_Store/.test(file)), 'Package excludes local development records');
}
