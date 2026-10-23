import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const json = async path => JSON.parse(await readFile(path, 'utf8'));
const pkg = await json('package.json');
const lock = await json('package-lock.json');
const expected = 'dsh-super-nexusx';
assert.equal(pkg.name, expected);
assert.equal(lock.name, expected);
assert.equal(lock.version, pkg.version);
assert.equal(lock.packages[''].version, pkg.version);
assert.equal(pkg.repository.url, `git+https://github.com/biek12/${expected}.git`);
assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml');
assert.equal(pkg.exports['./cordis.patch.yml'], './cordis.patch.yml');
assert.equal(pkg.exports['./locale/*.json'], './locale/*.json');
assert.match(await readFile('cordis.patch.yml', 'utf8'), /name: dsh-super-nexusx\s*$/);
for (const name of ['LICENSE', 'README.md', 'THIRD_PARTY_NOTICES.md', 'locale/en.json', 'locale/zh.json', 'licenses/dsh-context.LICENSE', 'licenses/dsh-claude-style.LICENSE', 'licenses/dsh-codex-effort-slider.LICENSE', 'licenses/transitions.dev.LICENSE', 'vendor/dsh-context/lib/index.js', 'vendor/dsh-context/lib/client.js']) await access(name);
for (const language of ['en', 'zh']) {
  const locale = await json(`locale/${language}.json`);
  assert.ok(locale.meta.title && locale.meta.description);
}
for (const file of ['README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'THIRD_PARTY_NOTICES.md', 'docs/INSTALLATION.md', 'docs/DEVELOPMENT.md']) {
  const source = await readFile(file, 'utf8');
  assert.doesNotMatch(source, /\/Users\/|dsh-liquid-glass-skin|dsh-skin-market-submit/, file);
  for (const match of source.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const link = match[1];
    if (/^(?:[a-z]+:|#)/i.test(link)) continue;
    const base = new URL(`../${file}`, import.meta.url);
    await access(new URL(link.split('#')[0], base));
  }
}
console.log('PASS: package identity, lockfile, bundle, locale, licenses and local documentation links.');
