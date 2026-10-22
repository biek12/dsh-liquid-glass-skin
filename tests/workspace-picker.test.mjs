import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorkspacePicker} from '../src/workspace-picker.js';
test('composed browse flow adopts once and stays busy until workspace acceptance',async()=>{
 const calls=[];let accept;const picker=createWorkspacePicker({createWorkspace:input=>{calls.push(input);return new Promise(r=>{accept=r;});}});
 const result=picker.request();assert.equal(picker.request(),result);assert.deepEqual(picker.getSnapshot(),{open:true,busy:false});
 const choosing=picker.onPicked('/Users/test/project');assert.deepEqual(picker.getSnapshot(),{open:true,busy:true});picker.onCancel();await picker.onPicked('/other');assert.equal(calls.length,1);
 accept({workspaceId:'created'});await choosing;assert.deepEqual(await result,{workspaceId:'created'});assert.deepEqual(calls,[{path:'/Users/test/project'}]);assert.equal(picker.getSnapshot().open,false);picker.dispose();
});
test('cancel, directory errors and unavailable occupants never create a workspace',async()=>{
 let calls=0;const picker=createWorkspacePicker({createWorkspace:async()=>{calls++;}});
 const cancel=picker.request();picker.onCancel();assert.equal(await cancel,null);
 const failure=picker.request();const rejected=assert.rejects(failure,/cannot browse/);picker.onError('cannot browse');await rejected;assert.equal(calls,0);picker.dispose();
 const unavailable=createWorkspacePicker({createWorkspace:async()=>{calls++;},available:()=>false});await assert.rejects(unavailable.request(),/尚未就绪/);unavailable.dispose();
});
test('workspace adoption failure and unload settle the requesting UI without stale open flows',async()=>{
 const picker=createWorkspacePicker({createWorkspace:async()=>{throw new Error('create rejected');}});
 const result=picker.request();const rejected=assert.rejects(result,/create rejected/);await picker.onPicked('/project');await rejected;assert.equal(picker.getSnapshot().open,false);
 const pending=picker.request();picker.dispose();assert.equal(await pending,null);await assert.rejects(picker.request(),/已关闭/);
});
