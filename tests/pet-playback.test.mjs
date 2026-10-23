import test from 'node:test';
import assert from 'node:assert/strict';
import { PET_FPS, frameAt, startPlayback } from '../src/pets/playback.js';
import { RIGS, samplePose, mixPose, createRigRenderer } from '../src/pets/rig.js';

test('20fps elapsed-time poses skip late frames and disposal cancels the only scheduler', () => {
  assert.equal(PET_FPS,20); assert.equal(frameAt(49),0); assert.equal(frameAt(50),1);
  let callback, cancelled; const times = [];
  const stop = startPlayback({paint:t=>times.push(t),requestFrame:fn=>{callback=fn;return 7;},cancelFrame:id=>{cancelled=id;}});
  callback(100); callback(125); callback(350);
  assert.deepEqual(times,[0,250]); stop(); assert.equal(cancelled,7);
  callback(500); assert.deepEqual(times,[0,250]);
});
test('blinks close once, reopen, and greetings settle; each idle has a closed loop', () => {
  for(const id of Object.keys(RIGS)){
    const start=id==='yuki'?2200:1500;
    const values=Array.from({length:10},(_,i)=>samplePose(id,'idle',start+i*50).blink);
    assert.equal(values.filter(n=>n===1).length,1);
    assert.equal(values.at(-1),0);
    assert.deepEqual(samplePose(id,'idle',0),samplePose(id,'idle',RIGS[id].cycle));
    for(const [key,value] of Object.entries(samplePose(id,'hover',3000))) assert.ok(Math.abs(value-samplePose(id,'idle',3000)[key])<1e-12);
    const drag=samplePose(id,'drag',800), neutral=samplePose(id,'idle',0);
    for(const [key,value] of Object.entries(drag)) assert.ok(Math.abs(mixPose(drag,neutral,0)[key]-value)<1e-12);
    for(const [key,value] of Object.entries(neutral)) assert.ok(Math.abs(mixPose(drag,neutral,1)[key]-value)<1e-12);
  }
});
test('local deformation leaves the fixed torso untouched through idle, response, drag and release', () => {
  const pixels=new Uint8ClampedArray(256*256*4);
  for(let i=0;i<pixels.length;i++)pixels[i]=(i*71+13)%256;
  for(const id of Object.keys(RIGS)){
    const render=createRigRenderer(id,pixels,pixels),[x,y]=id==='nori'?[145,183]:id==='yuki'?[149,176]:[100,210];
    for(const state of ['idle','hover','drag','land']){
      const frame=render(samplePose(id,state,650,.8));
      for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){
        const i=((y+dy)*256+x+dx)*4;assert.deepEqual(frame.slice(i,i+4),pixels.slice(i,i+4));
      }
    }
  }
});

test('every pet keeps blinking and moving beyond one minute, including across response transitions', () => {
  for (const id of Object.keys(RIGS)) {
    for (const state of ['idle','hover','drag']) {
      for (let second=0;second<90;second+=10) {
        const poses=Array.from({length:200},(_,i)=>samplePose(id,state,second*1000+i*50,0));
        assert.ok(poses.some(p=>p.blink>.9),`${id} ${state} stopped blinking at ${second}s`);
        assert.ok(poses.some(p=>Math.abs(p.head)>.05),`${id} ${state} stopped moving`);
      }
    }
    const time=RIGS[id].cycle*10+(id==='yuki'?2300:1600);
    assert.ok(samplePose(id,'hover',3000,0,time).blink>.9);
  }
});
