import test from 'node:test';
import assert from 'node:assert/strict';
import { createSessionActions } from '../src/native.js';
test('rename retains the source via native using and surfaces native rejection', async () => {
  const calls=[]; const ctx={ sessions:{ using:async (id,options,fn) => {
    calls.push([id,options]); return fn({binding:{session:{rename:async title => {calls.push(title);return {ok:true};}}}});
  }}, uiWorkspace:{} };
  await createSessionActions(ctx).renameSession('session-1','新名称');
  assert.deepEqual(calls,[['session-1',{source:'workspaceOperation'}],'新名称']);
  ctx.sessions.using=async () => ({ok:false,error:{message:'原生重命名失败'}});
  await assert.rejects(createSessionActions(ctx).renameSession('session-1','名称'),/原生重命名失败/);
});
test('pin, unpin, fork and clipboard use exact native identities and preserve migration safeguards', async () => {
  const calls=[]; const ctx={sessions:{},uiWorkspace:{pinSession:async id=>calls.push(['pin',id]),unpinSession:async id=>calls.push(['unpin',id]),forkSession:async (...args)=>{calls.push(['fork',...args]);return 'child';}}};
  const actions=createSessionActions(ctx,async text=>{calls.push(['copy',text]);return true;});
  await actions.pinSession('session-2'); await actions.unpinSession('session-2');
  assert.equal(await actions.forkSession('session-2'),'child'); await actions.copySessionId('session-2');
  assert.deepEqual(calls,[['pin','session-2'],['unpin','session-2'],['fork','session-2',undefined,{allowMigration:false}],['copy','session-2']]);
  await assert.rejects(createSessionActions(ctx,async()=>false).copySessionId('session-2'),/无法写入剪贴板/);
});

test('workspace creation delegates to the composed directory-flow owner',async()=>{
 const {createCreationActions}=await import('../src/native.js');let requested=0;
 const ctx={uiWorkspace:{pickDirectory:()=>{throw new Error('Native-only API must not be called');}}};
 const picker={request:async()=>{requested++;return {workspaceId:'created'};}};
 assert.deepEqual(await createCreationActions(ctx,{},picker).createWorkspace(),{workspaceId:'created'});assert.equal(requested,1);
});
test('creating in any virtual folder assigns the returned native session before opening it',async()=>{
 const {createCreationActions}=await import('../src/native.js');const calls=[];
 const ctx={sessions:{create:async request=>{calls.push(['create',request]);return 'created';}},uiWorkspace:{openSession:id=>calls.push(['open',id])}};
 const controller={mutate:async op=>calls.push(['assign',op])};
 await createCreationActions(ctx,controller).createSession('work','deep-folder');assert.deepEqual(calls,[['create',{workspaceId:'work'}],['assign',{type:'session.move',id:'created',workspaceId:'work',folderId:'deep-folder'}],['open','created']]);
 calls.length=0;controller.mutate=async()=>{throw new Error('write failed');};await assert.rejects(createCreationActions(ctx,controller).createSession('work','deep-folder'),/会话已创建，但目录归类未保存/);assert.deepEqual(calls,[['create',{workspaceId:'work'}],['open','created']]);
});
