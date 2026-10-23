import test from 'node:test';
import assert from 'node:assert/strict';
import { applyOperation, emptyState, validateState, folderPath } from '../src/model.js';
const catalog = [{ workspaceId: 'a', sessionIds: ['s1', 's2', 's3'] }, { workspaceId: 'b', sessionIds: ['s4'] }];
const run = (state, operation) => applyOperation(state, operation, catalog);
const create = (state, id, parentId = null, workspaceId = 'a') => run(state, { type: 'folder.create', id, workspaceId, parentId, name: id });

test('folders nest under their existing workspace and paths follow renames', () => {
  let state = create(create(emptyState(), 'parent'), 'child', 'parent');
  state = run(state, { type: 'folder.rename', id: 'parent', name: '项目' });
  assert.equal(folderPath(state, 'child'), '项目 / child');
  assert.equal(state.folders[1].workspaceId, 'a');
});
test('cycles, self parenting, missing parents and cross-workspace nesting are rejected without modifying current state', () => {
  const state = create(create(create(emptyState(), 'p'), 'c', 'p'), 'other', null, 'b');
  for (const [id, parentId] of [['p', 'c'], ['p', 'p'], ['p', 'missing'], ['p', 'other']]) {
    const before = JSON.stringify(state);
    assert.throws(() => run(state, { type: 'folder.move', id, parentId }));
    assert.equal(JSON.stringify(state), before);
  }
});
test('moving one session replaces its folder; no duplicate links or working-directory changes exist', () => {
  let state = create(create(emptyState(), 'one'), 'two');
  state = run(state, { type: 'session.move', id: 's1', workspaceId: 'a', folderId: 'one' });
  state = run(state, { type: 'session.move', id: 's1', workspaceId: 'a', folderId: 'two' });
  assert.equal(state.sessions.s1.folderId, 'two');
  assert.equal(Object.keys(state.sessions).filter(id => id === 's1').length, 1);
  assert.equal('cwd' in state.sessions.s1, false);
  assert.throws(() => run(state, { type: 'session.move', id: 's4', workspaceId: 'a', folderId: 'one' }));
});
test('folder order and session order persist through JSON round trips', () => {
  let state = create(create(create(emptyState(), 'one'), 'two'), 'three');
  state = run(state, { type: 'folder.move', id: 'three', parentId: null, beforeId: 'one' });
  assert.deepEqual(state.folders.toSorted((a, b) => a.order - b.order).map(f => f.id), ['three', 'one', 'two']);
  state = run(state, { type: 'session.move', id: 's3', workspaceId: 'a', folderId: null, beforeId: 's1' });
  const restored = validateState(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(Object.entries(restored.sessions).toSorted(([, a], [, b]) => a.order - b.order).map(([id]) => id), ['s3', 's1', 's2']);
});
test('deleting a folder promotes its direct children and sessions and preserves grandchildren', () => {
  let state = create(create(create(emptyState(), 'p'), 'c', 'p'), 'g', 'c');
  state = run(state, { type: 'session.move', id: 's1', workspaceId: 'a', folderId: 'c' });
  state = run(state, { type: 'folder.delete', id: 'c' });
  assert.equal(state.sessions.s1.folderId, 'p');
  assert.equal(state.folders.find(f => f.id === 'g').parentId, 'p');
  assert.equal(state.folders.some(f => f.id === 'c'), false);
});
test('folder editor saves location, title and manual metadata atomically', () => {
  let state = create(create(emptyState(), 'p'), 'c');
  const oldRevision = state.revision;
  state = run(state, { type: 'folder.update', id: 'c', name: '交互', parentId: 'p', patch: { color: 'purple', status: 'doing', tags: ['设计'], icon: '🎨', starred: true } });
  const c = state.folders.find(f => f.id === 'c');
  assert.equal(state.revision, oldRevision + 1); assert.equal(c.parentId, 'p'); assert.equal(c.name, '交互'); assert.equal(c.status, 'doing');
  assert.throws(() => run(state, { type: 'folder.update', id: 'p', name: 'changed', parentId: 'c', patch: {} }));
  assert.equal(state.folders[0].name, 'p');
});
test('session editor preserves manual status across moves and never derives it from agent activity', () => {
  let state = create(emptyState(), 'p');
  state = run(state, { type: 'session.update', id: 's1', workspaceId: 'a', folderId: 'p', patch: { status: 'done', color: 'green', tags: ['已审核'] } });
  state = run(state, { type: 'session.move', id: 's1', workspaceId: 'a', folderId: null });
  assert.equal(state.sessions.s1.status, 'done'); assert.deepEqual(state.sessions.s1.tags, ['已审核']);
});
test('malformed metadata, oversized names and prototype keys cannot cross the persistence boundary', () => {
  const state = create(emptyState(), 'one');
  for (const patch of [{ color: '__proto__' }, { status: 'constructor' }, { tags: Array(13).fill('x') }, { icon: 'x'.repeat(13) }]) assert.throws(() => run(state, { type: 'folder.meta', id: 'one', patch }));
  assert.throws(() => run(state, { type: 'folder.rename', id: 'one', name: 'a'.repeat(81) }));
  assert.throws(() => create(state, '__proto__'));
  assert.throws(() => validateState(null));
  assert.equal({}.polluted, undefined);
});
test('theme and tree preferences are independent and survive serialization', () => {
  let state = run(emptyState(), { type: 'preferences', patch: { theme: false } });
  assert.equal(state.preferences.theme, false); assert.equal(state.preferences.tree, true);
  state = run(state, { type: 'preferences', patch: { tree: false } });
  assert.equal(validateState(JSON.parse(JSON.stringify(state))).preferences.theme, false); assert.equal(state.preferences.tree, false);
});
test('marking an untouched session preserves its position in the host order', () => {
  const state = run(emptyState(), { type: 'session.meta', id: 's1', workspaceId: 'a', patch: { color: 'purple' } });
  assert.equal(state.sessions.s1.order, 0);
});
test('moving a Session to the root through the editor appends after unmarked sessions', () => {
  let state = create(emptyState(), 'one');
  state = run(state, { type: 'session.move', id: 's1', workspaceId: 'a', folderId: 'one' });
  state = run(state, { type: 'session.update', id: 's1', workspaceId: 'a', folderId: null, patch: {} });
  assert.ok(state.sessions.s1.order > state.sessions.s3.order);
});

test('legacy preferences receive presentation defaults without changing classification', () => {
  const old = create(emptyState(), 'one'); old.preferences = { theme:true, tree:false };
  const next = validateState(old);
  assert.equal(next.preferences.motion, 'full'); assert.equal(next.preferences.showTags, true);
  assert.equal(next.preferences.tree, false); assert.deepEqual(next.folders, old.folders);
  assert.deepEqual(old.preferences, {theme:true,tree:false});
});
test('presentation settings validate enums and booleans without touching metadata', () => {
  const state = create(emptyState(), 'one');
  const next = run(state, {type:'preferences',patch:{motion:'soft',orb:false,density:'compact',glass:'solid'}});
  assert.equal(next.preferences.motion,'soft'); assert.equal(next.preferences.orb,false);
  assert.deepEqual(next.folders,state.folders); assert.deepEqual(next.sessions,state.sessions);
  for (const patch of [{motion:'fast'}, {orb:'false'}, {glass:'invisible'}, {density:1}, {showCounts:null}]) assert.throws(() => run(state,{type:'preferences',patch}));
});

test('workspace order migrates legacy states, survives reload and rejects hierarchy writes atomically', () => {
  const state = emptyState(); delete state.workspaceOrder;
  assert.deepEqual(validateState(state).workspaceOrder, []);
  const moved = run(state, {type:'workspace.move',id:'b',beforeId:'a'});
  assert.deepEqual(validateState(JSON.parse(JSON.stringify(moved))).workspaceOrder,['b','a']);
  const before = JSON.stringify(moved);
  assert.throws(()=>run(moved,{type:'workspace.move',id:'b',beforeId:'a',parentId:'folder'}));
  assert.throws(()=>run(moved,{type:'workspace.move',id:'missing',beforeId:'a'}));
  assert.equal(JSON.stringify(moved),before);
});
