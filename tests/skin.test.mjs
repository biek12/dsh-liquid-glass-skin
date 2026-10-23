import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { installSkinChoice, installShellSkin } from '../src/skin.js';
const flush = async () => { await new Promise(resolve => setTimeout(resolve, 0)); };
function fixture(t) {
  const dom = new JSDOM('<!doctype html><body><div class="test_cubeRow"><button class="test_themeCube">浅色</button><button class="test_themeCube">深色</button><button class="test_themeCube" aria-pressed="true">系统</button></div></body>');
  globalThis.MutationObserver = dom.window.MutationObserver;
  let state = { preferences: { theme: true } }; const listeners = new Set();
  const controller = { getSnapshot: () => ({ state, loading: false, saving: false }), subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); }, mutate: async op => { state = { preferences: { ...state.preferences, ...op.patch } }; for (const fn of listeners) fn(); } };
  t.after(() => dom.window.close());
  return { doc: dom.window.document, dom, controller };
}
test('native Appearance and skin choices release each other and unload cleanly', async t => {
  const {doc,controller} = fixture(t); const adapter = installSkinChoice({controller,doc}); t.after(adapter.dispose);
  assert.equal(doc.querySelectorAll('.lg-appearance-choice').length, 1);
  const native = doc.querySelectorAll('.test_themeCube'); let otherEnabled;
  native.forEach(button => button.addEventListener('click', () => { otherEnabled = false; }, true));
  native[0].click(); await flush(); assert.equal(controller.getSnapshot().state.preferences.theme, false);
  otherEnabled = true; doc.querySelector('.lg-appearance-choice').click(); await flush();
  assert.equal(otherEnabled, false); assert.equal(controller.getSnapshot().state.preferences.theme, true);
  const foreign = doc.createElement('button'); foreign.textContent = '其他皮肤'; doc.querySelector('.test_cubeRow').append(foreign);
  foreign.click(); await flush(); assert.equal(controller.getSnapshot().state.preferences.theme, false);
  adapter.dispose(); assert.equal(doc.querySelector('.lg-appearance-choice'), null);
  native[0].click(); await flush(); assert.equal(controller.getSnapshot().state.preferences.theme, false);
});
test('appearance remounts after Settings changes without duplicate buttons', async t => {
  const {doc,controller} = fixture(t); const adapter = installSkinChoice({controller,doc}); t.after(adapter.dispose);
  const old = doc.querySelector('.test_cubeRow'); const next = old.cloneNode(true); next.querySelector('.lg-appearance-choice').remove(); old.replaceWith(next); await flush();
  assert.equal(doc.querySelectorAll('.lg-appearance-choice').length, 1); assert.equal(next.lastElementChild.className, 'lg-appearance-choice');
});
test('native Hero receives owned intro, preserves native composer and fully cleans up', async t => {
  const {doc} = fixture(t); const release = installShellSkin(doc);
  doc.body.insertAdjacentHTML('beforeend', '<div class="native_composerStack"><div class="native_root"><div class="native_stack"><div class="native_headline"><span class="native_fishHitbox"></span></div><div class="native_body"></div></div></div><textarea aria-label="原生输入框"></textarea><button>工作区选择</button></div>');
  await flush(); const composer = doc.querySelector('textarea'); assert.equal(doc.querySelectorAll('.lg-home-intro').length, 1); assert.ok(doc.querySelector('.native_body h1')); assert.equal(doc.querySelector('.lg-home-intro').textContent.includes('LIQUID GLASS'), false);
  doc.body.append(doc.createElement('span')); await flush(); assert.equal(doc.querySelectorAll('.lg-home-intro').length, 1);
  release(); assert.equal(doc.querySelector('.lg-home-intro'), null); assert.equal(doc.querySelector('textarea'), composer);
});
