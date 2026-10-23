import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { normalizeBalance, formatBalance } from '../src/pets/balance.js';
import { createBalanceReader, createBalanceHandler } from '../src/pets/account-host.js';

test('RPC results, bonus-only accounts and real zero balances normalize to the same total', () => {
  const ready = {status:'ready', value:[{currency:'CNY',balance:'3.75'}], bonusWallets:[{currency:'CNY',balance:'1.25'}]};
  assert.equal(formatBalance(normalizeBalance({ok:true,value:ready})), '¥5.00');
  assert.equal(formatBalance(normalizeBalance({...ready,value:[]})), '¥1.25');
  assert.equal(formatBalance(normalizeBalance({...ready,value:[],bonusWallets:[{currency:'CNY',balance:'0'}]})), '¥0.00');
  assert.equal(normalizeBalance({status:'failed'}), null);
  assert.equal(normalizeBalance({status:'ready',value:[],bonusWallets:[]}), null);
});
test('Host account requests share one flight, prefer the signed-in account and redact credentials', async () => {
  let calls=0;
  const read=createBalanceReader({get:name=>name==='deepseekAccount'?{getBalance:async()=>{calls++; return {status:'ready',value:[],bonusWallets:[{currency:'CNY',balance:'8.25'}]};}}:null},()=>{throw Error('Unexpected API-key request');});
  const [a,b]=await Promise.all([read(),read()]);
  assert.equal(calls,1); assert.deepEqual(a,b); assert.equal(formatBalance(a),'¥8.25');
  const keyRead=createBalanceReader({get:name=>name==='credentials'?{resolve:async ref=>{assert.equal(ref,'DEEPSEEK_API_KEY');return {value:'test-secret'};}}:null},async(url,init)=>{
    assert.equal(url,'https://api.deepseek.com/user/balance');assert.equal(init.headers.Authorization,'Bearer test-secret');
    return Response.json({balance_infos:[{currency:'CNY',total_balance:'2.5',granted_balance:'1',topped_up_balance:'1.5'}]});
  });
  const value=await keyRead();assert.equal(formatBalance(value),'¥2.50');assert.ok(!JSON.stringify(value).includes('secret'));
});
test('public pet balance route refuses cross-origin reads before querying the account', async t => {
  let reads=0;const server=createServer(createBalanceHandler(async()=>{reads++;return {balances:[]};}));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>{server.closeAllConnections();return new Promise(resolve=>server.close(resolve));});
  const url=`http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(url)).status,403);
  assert.equal((await fetch(url,{headers:{'X-DSH-Liquid-Glass':'1',Origin:'https://invalid.example'}})).status,403);
  assert.equal(reads,0);
  assert.equal((await fetch(url,{headers:{'X-DSH-Liquid-Glass':'1'}})).status,200);
});
