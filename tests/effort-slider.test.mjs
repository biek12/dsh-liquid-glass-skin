import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';
import { createRoot } from 'react-dom/client';
import { createEffortRuntime, EffortSeat } from '../src/effort-slider.js';
import { createController } from '../src/controller.js';
import { emptyState } from '../src/model.js';

async function fixture(t, { count = 4, motion = 'off', reject = false } = {}) {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'http://localhost', pretendToBeVisual: true });
  for (const key of ['window', 'document', 'HTMLElement', 'localStorage', 'CustomEvent', 'MutationObserver']) globalThis[key] = dom.window[key];
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const runtime = createEffortRuntime();
  runtime.__internals.installStyles();
  const initial = emptyState(); initial.preferences.motion = motion;
  const controller = createController({ initial, poll: false });
  const calls = []; const listeners = new Set();
  const levels = (count === 2 ? ['off', 'high'] : count === 6 ? ['off', 'minimal', 'low', 'medium', 'high', 'max'] : ['off', 'low', 'high', 'max']).map(id => ({ id, name: id[0].toUpperCase() + id.slice(1) }));
  let state = { current: { provider: 'deepseek', model: 'flash', reasoningEffort: 'off' },
    groups: [{ id: 'deepseek', models: [{ id: 'flash', reasoning: { defaultEffort: 'high', efforts: levels } }] }], status: 'ready' };
  const update = next => { state = next; for (const listener of listeners) listener(); };
  const directory = { store: { getSnapshot: () => state, subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); } },
    select: async selection => {
      calls.push(selection);
      if (reject) return { ok: false, error: new Error('selection refused') };
      update({ ...state, current: selection }); return { ok: true };
    } };
  const context = { modelDirectories: { directoryFor: () => directory } };
  const composer = document.createElement('div'); composer.setAttribute('data-composer-card', '');
  composer.innerHTML = '<button aria-haspopup="menu" aria-expanded="true" aria-controls="native-menu"><span>DeepSeek</span><span>Off</span></button><div class="anchor"></div>';
  document.body.append(composer);
  const menu = document.createElement('div'); menu.id = 'native-menu'; menu.setAttribute('role', 'menu');
  menu.innerHTML = '<button role="menuitem"><span>模型</span><span>Flash</span></button><button role="menuitem" style="height:38px;padding-top:4px;padding-bottom:4px"><span>推理等级</span><span class="cellValue">Off</span></button>';
  document.body.append(menu);
  const row = menu.lastElementChild; const originalStyle = row.getAttribute('style');
  const root = createRoot(composer.querySelector('.anchor'));
  await act(async () => root.render(React.createElement(EffortSeat, { runtime, context, controller, sessionId: 'session-one' })));
  const track = () => menu.querySelector('[role="slider"]');
  const unmount = async () => { await act(async () => root.unmount()); runtime.dispose(); };
  t.after(async () => { await unmount(); controller.dispose(); dom.window.close(); });
  const key = async value => act(async () => track().dispatchEvent(new window.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true })));
  const pointer = async (type, clientX, button = 0) => act(async () => {
    const event = new window.MouseEvent(type, { bubbles: true, cancelable: true, clientX, button, buttons: type === 'pointerup' ? 0 : 1 });
    track().dispatchEvent(event);
  });
  return { runtime, context, controller, calls, directory, listeners, menu, row, composer, originalStyle, track, key, pointer, unmount, update, getState: () => state };
}

test('native effort keyboard controls write exact selection and preserve the official menu', async t => {
  const scene = await fixture(t);
  assert.equal(scene.track().getAttribute('aria-valuemax'), '3');
  assert.equal(scene.row.style.height, 'auto');
  assert.equal(scene.row.querySelector('span').textContent, '推理等级');
  await scene.key('End');
  assert.deepEqual(scene.calls.at(-1), { provider: 'deepseek', model: 'flash', reasoningEffort: 'max' });
  assert.equal(scene.track().getAttribute('aria-valuetext'), 'Max');
  assert.equal(scene.menu.querySelectorAll('.lg-ces-star').length, 22);
  assert.equal(scene.menu.querySelector('[data-motion]').dataset.motion, 'none');
  await scene.key('Home');
  assert.equal(scene.calls.at(-1).reasoningEffort, 'off');
  assert.equal(scene.row.querySelector('.cellValue').style.color, '');
  assert.equal(scene.menu.querySelectorAll('.lg-ces-star').length, 0);
});

test('pointer crossing and release select the latest effort, right click does not change it', async t => {
  const scene = await fixture(t);
  scene.track().getBoundingClientRect = () => ({ left: 0, width: 308, right: 308, top: 0, bottom: 28, height: 28 });
  await scene.pointer('pointerdown', 14);
  await scene.pointer('pointermove', 200);
  await scene.pointer('pointermove', 294);
  await scene.pointer('pointerup', 294);
  assert.equal(scene.calls.at(-1).reasoningEffort, 'max');
  const callCount = scene.calls.length;
  await scene.pointer('pointerdown', 14, 2);
  await scene.pointer('pointerup', 14, 2);
  assert.equal(scene.calls.length, callCount);
});

test('two and six effort models expose their real range and default selection', async t => {
  for (const count of [2, 6]) {
    const scene = await fixture(t, { count });
    assert.equal(Number(scene.track().getAttribute('aria-valuemax')), count - 1);
    await scene.key('End');
    assert.equal(scene.calls.at(-1).reasoningEffort, count === 2 ? 'high' : 'max');
    await scene.unmount();
  }
});

test('selection refusal rolls back and displays the native failure', async t => {
  const scene = await fixture(t, { reject: true });
  await scene.key('End');
  assert.equal(scene.getState().current.reasoningEffort, 'off');
  assert.equal(scene.track().getAttribute('aria-valuenow'), '0');
  assert.ok(scene.menu.querySelector('[role="status"]').textContent.includes('selection refused'));
});

test('model changes never reuse another model effort list', async t => {
  const scene = await fixture(t);
  await act(async () => scene.update({ current: { provider: 'other', model: 'unavailable' }, groups: [] }));
  assert.equal(scene.track(), null);
  assert.equal(scene.row.style.height, '38px');
});

test('settings persist and repeated unload restores row, subscriptions and document handlers', async t => {
  const scene = await fixture(t);
  const menuEvent = () => new window.MouseEvent('contextmenu', { bubbles: true, cancelable: true });
  const first = menuEvent();
  await act(async () => scene.track().dispatchEvent(first));
  assert.equal(first.defaultPrevented, true);
  assert.ok(document.querySelector('.lg-ces-set'));
  await act(async () => scene.runtime.__internals.writeSettings({ motion: 'fast' }));
  assert.equal(JSON.parse(localStorage.getItem('dsh-liquid-glass.effort-slider.settings')).motion, 'fast');
  await scene.unmount();
  assert.equal(scene.listeners.size, 0);
  assert.equal(scene.row.style.height, '38px');
  assert.equal(scene.row.style.paddingTop, '4px');
  assert.equal(scene.row.style.paddingBottom, '4px');
  assert.equal(scene.row.querySelector('.lg-ces-inline'), null);
  assert.equal(document.querySelector('[data-plugin-css]'), null);
  assert.equal(document.querySelector('.lg-ces-set'), null);
  const detached = document.createElement('div'); detached.className = 'lg-ces-inline'; document.body.append(detached);
  const after = menuEvent(); detached.dispatchEvent(after); assert.equal(after.defaultPrevented, false);
  const next = createEffortRuntime(); next.__internals.installStyles();
  assert.equal(next.__internals.readSettings().motion, 'fast');
  const reopened = menuEvent(); detached.dispatchEvent(reopened); assert.equal(reopened.defaultPrevented, true);
  next.dispose();
});

test('continuous motion converges without overshooting its boundaries', () => {
  const runtime = createEffortRuntime(); const internals = runtime.__internals;
  const motion = { x: 0, v: 0, a: 0, target: 1, vPtr: 0 };
  const samples = [];
  for (let frame = 0; frame < 180; frame += 1) { internals.motionStep(motion, 1 / 60, internals.MOTION); samples.push(motion.x); }
  assert.ok(samples.some(value => value > 0 && value < 1));
  assert.ok(samples.every(value => value >= 0 && value <= 1));
  assert.ok(Math.abs(motion.x - 1) < 0.001);
});
