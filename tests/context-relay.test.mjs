import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createContextRelay } from '../src/context-host.js';
test('context relay rejects cross-origin writes and only relays bounded summaries without storing chat data', async t => {
  const relay = createContextRelay(); const server = createServer(relay.handler);
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  t.after(()=>{server.closeAllConnections();return new Promise(resolve=>server.close(resolve));});
  const url = `http://127.0.0.1:${server.address().port}`;
  const headers = {'X-DSH-Liquid-Glass':'1','Content-Type':'application/json'};
  const summary = {tokens:500,occupancy:50,todayCost:'¥1.00',sessionId:'s1',chat:'must not survive'};
  assert.equal((await fetch(url,{method:'POST',headers:{...headers,Origin:'https://invalid.example'},body:JSON.stringify(summary)})).status,403);
  assert.deepEqual(relay.read(),{});
  assert.equal((await fetch(url,{method:'POST',headers,body:JSON.stringify(summary)})).status,200);
  assert.equal(relay.read().todayCost,'¥1.00'); assert.equal(relay.read().chat,undefined);
  assert.equal((await fetch(url,{method:'POST',headers,body:'x'.repeat(3000)})).status,413);
  assert.equal(relay.read().tokens,500);
});
