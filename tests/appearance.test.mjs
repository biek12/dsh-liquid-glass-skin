import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppearanceSource} from '../src/appearance.js';
function fixture(){let snapshot={preference:'light',active:{colorScheme:'light'}};const listeners=new Set(),writes=[];return {listeners,writes,ctx:{on:(_,fn)=>{listeners.add(fn);return()=>listeners.delete(fn);},theme:{getTheme:()=>snapshot,setTheme:mode=>{writes.push(mode);snapshot={preference:mode,active:{colorScheme:mode==='system'?'dark':mode}};for(const fn of listeners)fn();}}},publish:scheme=>{snapshot={...snapshot,active:{colorScheme:scheme}};for(const fn of listeners)fn();}};}
test('one transition holds the old frame across a native dark-light-dark settling sequence',async t=>{
 t.mock.timers.enable({apis:['Date','setTimeout']});
 const f=fixture(),phases=[],doc={body:{dataset:{liquidGlass:'on'}},documentElement:{dataset:{}},startViewTransition:update=>{phases.push('capture-old');const updateCallbackDone=Promise.resolve().then(update);const ready=updateCallbackDone.then(()=>phases.push(`capture-${f.ctx.theme.getTheme().active.colorScheme}`));return {updateCallbackDone,ready,finished:ready,skipTransition(){}};}};
 const source=createAppearanceSource(f.ctx,{doc,quietMs:20,minimumMs:35,maximumMs:150});
 const pending=source.select('system');assert.equal(source.getSnapshot().changing,true);
 assert.equal(source.select('dark'),pending); // rapid repeated input cannot queue conflicting native writes
 await Promise.resolve();t.mock.timers.tick(6);f.publish('light');t.mock.timers.tick(6);f.publish('dark');assert.deepEqual(phases,['capture-old']);
 t.mock.timers.tick(40);
 await pending;assert.deepEqual(phases,['capture-old','capture-dark']);assert.deepEqual(f.writes,['system']);assert.equal(source.getSnapshot().changing,false);assert.equal(doc.documentElement.dataset.lgThemeTransition,undefined);source.dispose();assert.equal(f.listeners.size,0);
});
test('fallback and disposal release settling listeners and never persist a duplicate appearance',async()=>{
 const f=fixture();const source=createAppearanceSource(f.ctx,{quietMs:5,minimumMs:10,maximumMs:30,doc:undefined});
 await source.select('dark');assert.equal(source.getSnapshot().preference,'dark');await source.select('dark');assert.deepEqual(f.writes,['dark']);
 const pending=source.select('system');source.dispose();await pending;assert.equal(f.listeners.size,0);await assert.rejects(()=>source.select('light'));
});
test('native theme rejection releases transition state and reports the error',async()=>{
 const f=fixture();f.ctx.theme.setTheme=()=>{throw new Error('native rejected');};const source=createAppearanceSource(f.ctx,{quietMs:5,minimumMs:10,maximumMs:20});
 await assert.rejects(source.select('dark'),/native rejected/);assert.equal(source.getSnapshot().changing,false);assert.equal(f.listeners.size,1);source.dispose();
});

test('native settings acceptance precedes transition settlement and bypasses optimistic theme writes',async()=>{
 const f=fixture();const nativeAccept=f.ctx.theme.setTheme;let accepted=false, accept;
 const acceptance=new Promise(resolve=>{accept=resolve;});
 f.ctx.theme.setTheme=()=>{throw new Error('Optimistic write must not run');};
 f.ctx.configForms={get:namespace=>{assert.equal(namespace,'ui-theme');return {set:async(field,mode)=>{assert.equal(field,'preference');await acceptance;nativeAccept(mode);accepted=true;return true;}};}};
 const source=createAppearanceSource(f.ctx,{quietMs:5,minimumMs:10,maximumMs:30});const pending=source.select('system');
 assert.equal(accepted,false);assert.equal(source.getSnapshot().changing,true);accept();await pending;assert.equal(source.getSnapshot().preference,'system');source.dispose();
});
