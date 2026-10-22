import test from 'node:test';
import assert from 'node:assert/strict';
import {createCatalog} from '../src/catalog.js';
test('only workspace-owned primary sessions are counted; unowned child Agents never appear', () => {
  const workspace={items:[{workspaceId:'w',title:'工作区',sessionIds:['main','archived','blank','retained']}],archivedSessionIds:['archived']};
  const sessions={byId:{main:{title:'主会话'},archived:{title:'归档'},blank:{blank:true},retained:{blank:true,retainedBy:{mainView:1}},child:{id:'child',title:'子 Agent'},orphan:{id:'orphan',title:'未归属'}}};
  const catalog=createCatalog(workspace,sessions);
  assert.equal(catalog.length,1); assert.deepEqual(catalog[0].sessions.map(s=>s.id),['main','retained']);
});

test('native pinned identities are projected without duplicating or moving sessions across workspaces', () => {
  const catalog=createCatalog({items:[{workspaceId:'w',sessionIds:['a','b']}],pinnedSessionIds:['b'],archivedSessionIds:[]},{byId:{a:{title:'A'},b:{title:'B'}}});
  assert.deepEqual(catalog[0].sessions,[{id:'a',title:'A',pinned:false},{id:'b',title:'B',pinned:true}]);
});
