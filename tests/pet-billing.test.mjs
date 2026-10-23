import test from 'node:test';
import assert from 'node:assert/strict';
import {officialRate,countdown} from '../src/pets/billing.js';

test('official UTC windows switch at their edges and Chinese holidays and weekends are off-peak',()=>{
  const rate=iso=>officialRate(new Date(iso));
  assert.equal(rate('2026-10-23T00:59:59Z').period,'offPeak');
  assert.equal(rate('2026-10-23T01:00:00Z').period,'peak');
  assert.equal(rate('2026-10-23T04:00:00Z').period,'offPeak');
  assert.equal(rate('2026-10-23T06:00:00Z').period,'peak');
  assert.equal(rate('2026-10-23T10:00:00Z').period,'offPeak');
  assert.equal(rate('2026-10-24T02:00:00Z').period,'offPeak');
  assert.equal(rate('2026-10-01T02:00:00Z').period,'offPeak');
  assert.equal(new Date(rate('2026-10-23T10:00:00Z').nextSwitch).toISOString(),'2026-10-26T01:00:00.000Z');
  assert.equal(rate('2027-01-04T02:00:00Z'),null);
  assert.equal(countdown(1000*3661,0),'01:01:01');
});
