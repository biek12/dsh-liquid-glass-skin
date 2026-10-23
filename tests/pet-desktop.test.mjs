import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {createDesktopPet} from '../src/pets/desktop-host.js';
import {emptyState} from '../src/model.js';

test('desktop control refuses cross-origin and unmarked calls and reports missing native assets without starting a process',async t=>{
 const desktop=createDesktopPet({stateHandler:()=>{},read:emptyState,getBalance:async()=>null,assets:new URL('./missing-desktop/',import.meta.url)});
 const server=createServer(desktop.handler);await new Promise(r=>server.listen(0,'127.0.0.1',r));
 t.after(async()=>{await desktop.stop();server.closeAllConnections();await new Promise(r=>server.close(r));});
 const url=`http://127.0.0.1:${server.address().port}/`,headers={'X-DSH-Liquid-Glass':'1','Content-Type':'application/json'};
 assert.equal((await fetch(url)).status,403);
 assert.equal((await fetch(url,{headers:{...headers,Origin:'https://outside.example'}})).status,403);
 assert.equal((await fetch(url,{headers:{...headers,'Sec-Fetch-Site':'cross-site'}})).status,403);
 const status=await (await fetch(url,{headers})).json();assert.equal(status.supported,false);assert.equal(status.running,false);
 assert.equal((await fetch(url,{headers,method:'POST',body:JSON.stringify({action:'bogus'})})).status,400);
 const start=await fetch(url,{headers,method:'POST',body:JSON.stringify({action:'start'})});assert.equal(start.status,500);assert.match((await start.json()).error,/没有可运行/);
 assert.equal((await desktop.status()).running,false);
 assert.equal((await fetch(url,{headers,method:'POST',body:JSON.stringify({action:'stop'})})).status,200);
});
