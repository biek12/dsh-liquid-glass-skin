/** Integration check against the exact, read-only installed DSH modules. No live profile is changed. */
import { pathToFileURL } from 'node:url';
import { readFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import assert from 'node:assert/strict';
import { apply as applyHost } from '../lib/index.js';
import { API_PATH } from '../src/http.js';

const core = '/Applications/DSH Desktop Beta.app/Contents/Resources/app/node_modules/@deepseek-ai';
const { DomainFacility, defineDomain } = await import(pathToFileURL(`${core}/dsh-storage-domain/lib/index.js`));
const { domainSpec } = await import('../lib/index.js');
defineDomain(domainSpec);
const directory = await mkdtemp(join(tmpdir(), 'dsh-liquid-glass-check-'));
const file = join(directory, 'metadata.json');
let route; let release;
const domainContext = {
  storage: { backend: { get: () => ({ kv: { open: async () => ({
    loadAll: async () => { try { return { global: JSON.parse(await readFile(file, 'utf8')), tables: {} }; } catch (e) { if (e.code !== 'ENOENT') throw e; return { global: null, tables: {} }; } },
    setGlobal: async state => writeFile(file, JSON.stringify(state)), close: async () => {},
  }) } }) } },
  emit: () => {}, logger: console,
};
const facility = new DomainFacility(domainContext, { backend: 'test', routes: {} });
const hostContext = {
  storageDomain: facility,
  workspaceRegistry: { list: () => [{ id: 'runtime-workspace', sessionIds: ['runtime-session'] }] },
  webServer: { register: value => { route = value; return () => { route = undefined; }; } },
  effect: callback => { release = callback(); },
};
const server = createServer((req, res) => route ? route.handler(req, res) : (res.writeHead(404), res.end()));
try {
  await applyHost(hostContext);
  assert.equal(route.path, API_PATH);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}${API_PATH}`;
  const headers = { 'X-DSH-Liquid-Glass': '1', 'Content-Type': 'application/json' };
  const post = async (revision, operation) => { const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ revision, operation }) }); assert.equal(r.status, 200); return (await r.json()).state; };
  await post(0, { type: 'folder.create', id: 'runtime-folder', name: '实际运行时测试', workspaceId: 'runtime-workspace', parentId: null });
  await post(1, { type: 'session.update', id: 'runtime-session', workspaceId: 'runtime-workspace', folderId: 'runtime-folder', patch: { color: 'blue', status: 'doing', tags: ['本地验证'] } });
  await release();
  assert.equal(route, undefined); assert.equal(facility.get('liquid_glass'), undefined);
  await applyHost(hostContext);
  const restored = await (await fetch(url, { headers })).json();
  assert.equal(restored.state.folders[0].name, '实际运行时测试');
  assert.equal(restored.state.sessions['runtime-session'].folderId, 'runtime-folder');
  assert.equal(restored.state.sessions['runtime-session'].status, 'doing');
  await release();
  console.log('PASS: installed DSH DomainSpec, durable writes, host route, reload recovery and disposal.');
} finally {
  server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  await facility.closeAll(); await rm(directory, { recursive: true, force: true });
}
