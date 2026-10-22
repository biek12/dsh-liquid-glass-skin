import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createStateHandler, API_PATH } from '../src/http.js';
import { emptyState } from '../src/model.js';

async function fixture(t, { failing = false } = {}) {
  let state = emptyState(); let writes = 0;
  const handler = createStateHandler({ read: () => state, write: async value => { await new Promise(r => setTimeout(r, 5)); if (failing) throw new Error('disk full'); state = value; writes++; }, catalog: () => [{ workspaceId: 'w', sessionIds: ['s'] }] });
  const server = createServer(handler); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  const url = `http://127.0.0.1:${server.address().port}${API_PATH}`;
  const post = (revision, operation) => fetch(url, { method: 'POST', headers: { 'X-DSH-Liquid-Glass': '1', 'Content-Type': 'application/json' }, body: JSON.stringify({ revision, operation }) });
  return { url, post, state: () => state, writes: () => writes };
}
test('concurrent windows cannot overwrite a newer durable revision', async t => {
  const f = await fixture(t);
  const responses = await Promise.all([f.post(0, { type: 'folder.create', id: 'one', workspaceId: 'w', parentId: null, name: 'one' }), f.post(0, { type: 'folder.create', id: 'two', workspaceId: 'w', parentId: null, name: 'two' })]);
  assert.deepEqual(responses.map(r => r.status).sort(), [200, 409]); assert.equal(f.writes(), 1); assert.equal(f.state().folders.length, 1);
  const conflict = await responses.find(r => r.status === 409).json(); assert.equal(conflict.state.revision, 1);
});
test('a rejected disk write leaves the original metadata untouched', async t => {
  const f = await fixture(t, { failing: true });
  const response = await f.post(0, { type: 'preferences', patch: { theme: false } });
  assert.equal(response.status, 500); assert.equal(f.state().preferences.theme, true); assert.equal(f.state().revision, 0);
});
test('same-origin custom-header requests work and cross-origin writes fail', async t => {
  const f = await fixture(t);
  assert.equal((await fetch(f.url)).status, 403);
  assert.equal((await fetch(f.url, { headers: { 'X-DSH-Liquid-Glass': '1', Origin: 'https://example.com' } })).status, 403);
  const response = await fetch(f.url, { headers: { 'X-DSH-Liquid-Glass': '1' } });
  assert.equal(response.status, 200); assert.equal((await response.json()).state.version, 1);
});
test('invalid operations never create a durable write', async t => {
  const f = await fixture(t); const response = await f.post(0, { type: 'session.move', id: 'foreign', workspaceId: 'w', folderId: null });
  assert.equal(response.status, 400); assert.equal(f.writes(), 0);
});
