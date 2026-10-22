import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createStateHandler, API_PATH } from '../src/http.js';
import { createAppearanceSource } from '../src/appearance.js';
import { emptyState } from '../src/model.js';

const core = '/Applications/DSH Desktop Beta.app/Contents/Resources/app/node_modules/@deepseek-ai';
const cordis = await import(pathToFileURL(`${core}/cordis/lib/index.js`));
const slots = await import(pathToFileURL(`${core}/dsh-client-ui-slots/lib/index.js`));
const require = createRequire(import.meta.url);
const modules = new Map([
  ['@deepseek-ai/cordis', cordis], ['@deepseek-ai/dsh-client-ui-slots', slots], ['@deepseek-ai/dsh-client-store', {}],
  ['@deepseek-ai/dsh-client-ui-primitives', {}],
  ...['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'].map(id => [id, require(id)]),
]);
let state = emptyState(); let poll;
const server = createServer(createStateHandler({ read: () => state, write: async value => { state = value; }, catalog: () => [] }));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { pretendToBeVisual: true });
const document = dom.window.document; const body = document.body;
const styles = { get size() { return document.head.querySelectorAll('style[data-plugin="dsh-liquid-glass"]').length; } };
const mediaListeners=new Set(); const media={matches:false,addEventListener:(_,fn)=>mediaListeners.add(fn),removeEventListener:(_,fn)=>mediaListeners.delete(fn)};
const sandbox = vm.createContext({
  matchMedia:()=>media,
  window: { __ModuleLoader__: { load: ({ id, factory }) => modules.set(id, factory(id => { if (!modules.has(id)) throw new Error(`Missing module: ${id}`); return modules.get(id); })) } },
  document, console, AbortController, AbortSignal, structuredClone, MutationObserver: dom.window.MutationObserver, queueMicrotask,
  setTimeout, clearTimeout,
  setInterval: callback => { poll = callback; return 1; }, clearInterval: () => {},
  fetch: (path, options) => fetch(base + path, options),
});
const load = async (path, id) => { vm.runInContext(await readFile(path, 'utf8'), sandbox, { filename: String(path) }); return modules.get(id); };
const { SlotRegistry } = await load(`${core}/dsh-client-ui-renderer/lib/client.js`, '@deepseek-ai/dsh-client-ui-renderer');
const { ThemeRuntime } = await load(`${core}/dsh-client-ui-theme/lib/client.js`, '@deepseek-ai/dsh-client-ui-theme');
const plugin = await load(new URL('../lib/client.js', import.meta.url), 'dsh-liquid-glass');
const ctx = new cordis.Context();
const registry = new SlotRegistry(ctx);
let durableTheme={preference:'system',fontSize:14,codeFontSize:11,terminalFontSize:13,textFontFamily:'',codeFontFamily:'',terminalFontFamily:''}; const themeListeners=new Set();
const themeForm = { getSnapshot: () => ({value:durableTheme}), subscribe: fn => { themeListeners.add(fn); return () => themeListeners.delete(fn); }, set:async (key,value) => { durableTheme={...durableTheme,[key]:value}; for(const fn of themeListeners)fn(); return true; } };
const theme = new ThemeRuntime(ctx, themeForm);
ctx.provide('configForms',{get:()=>themeForm});
ctx.provide('theme', theme);
ctx.provide('workspaces', { list: { getSnapshot: () => ({ items: [], archivedSessionIds: [] }), subscribe: () => () => {} } });
ctx.provide('sessions', { list: { getSnapshot: () => ({ byId: {} }), subscribe: () => () => {} } });
ctx.provide('uiWorkspace', { openSession() {}, startSession() {} });
const native = () => null;
const releaseRoot = registry.register({ name: 'root', children: {
  'sidebar.workspaces': { kind: 'single', scope: 'root' },
  'sidebar.brand.name': { kind: 'single', scope: 'root' },
  'conversation.hero.brand.mark': { kind: 'single', scope: 'root' },
  'sidebar.footer.action': { kind: 'list', scope: 'root' },
  'settings.section': { kind: 'list', scope: 'root' },
  'conversation.input.right': { kind: 'list', scope: 'session' },
} }, native);
const releaseNative = registry.register({ name: 'sidebar.workspaces', children: { 'sidebar.workspaces.directoryFlow': {kind:'single',scope:'root'} } }, native);
const nativePicker = () => null;
const releaseNativePicker=registry.register({name:'sidebar.workspaces.directoryFlow',inject:()=>({pickerKind:'browse'})},nativePicker);
const waitFor = async condition => { const end = Date.now() + 3000; while (!condition()) { if (Date.now() > end) throw new Error('Runtime condition timed out'); await new Promise(resolve => setTimeout(resolve, 20)); } };
let dispose;
try {
  const fiber = ctx.plugin(plugin);
  dispose = () => fiber.dispose();
  await waitFor(() => registry.entriesOfSlot('sidebar.workspaces')[0]?.options.priority === -20);
  assert.equal(registry.entries('sidebar.brand.name').length, 1);
  assert.equal(registry.entries('conversation.hero.brand.mark').length, 1);
  assert.equal(registry.entries('settings.section')[0].options.label(), 'Liquid Glass');
  const treeEntry=registry.entriesOfSlot('sidebar.workspaces')[0];
  assert.equal(treeEntry.children['sidebar.workspaces.directoryFlow'],undefined);
  assert.equal(treeEntry.children['liquid-glass.workspace.directoryFlow'].kind,'single');
  assert.equal(registry.entries('liquid-glass.workspace.directoryFlow')[0].component,nativePicker);
  assert.equal(registry.entries('liquid-glass.workspace.directoryFlow')[0].inject().pickerKind,'browse');
  assert.equal(body.dataset.lgMotion, 'full');
  assert.equal(registry.entries('conversation.input.right').length, 0);
  ctx.provide('remote', {});
  ctx.provide('remote.session', {});
  ctx.provide('modelDirectories', { directoryFor: () => { throw new Error('No preview session'); } });
  await waitFor(() => registry.entries('conversation.input.right').length === 1);
  assert.equal(registry.entries('conversation.input.right')[0].options.id, 'liquid-glass-effort-slider');
  assert.equal(document.querySelectorAll('style[data-plugin-css="dsh-liquid-glass-effort-slider"]').length, 1);
  const appearance=createAppearanceSource(ctx); let themeEvents=0; const offTheme=appearance.subscribe(()=>themeEvents++);
  for(const mode of ['light','dark','system']) { await appearance.select(mode); assert.equal(theme.getTheme().preference,mode); assert.equal(durableTheme.preference,mode); assert.equal(state.preferences.theme,true); }
  media.matches=true; for(const fn of mediaListeners)fn();
  assert.equal(appearance.getSnapshot().preference,'system'); assert.equal(appearance.getSnapshot().active.colorScheme,'dark');
  assert.ok(themeEvents>=3); assert.throws(()=>appearance.select('invalid')); offTheme(); appearance.dispose();
  assert.equal(body.dataset.liquidGlass, 'on'); assert.equal(theme.overrides.size, 1); assert.equal(styles.size, 1);
  assert.equal(registry.entries('sidebar.workspaces').length, 2);
  const update = async patch => {
    const response = await fetch(base + API_PATH, { method: 'POST', headers: { 'X-DSH-Liquid-Glass': '1', 'Content-Type': 'application/json' }, body: JSON.stringify({ revision: state.revision, operation: { type: 'preferences', patch } }) });
    assert.equal(response.status, 200); poll();
  };
  for (let i=0;i<4;i++) {
    await update({tree:false}); await waitFor(()=>registry.entriesOfSlot('sidebar.workspaces')[0]?.component===native);
    assert.equal(registry.entries('liquid-glass.workspace.directoryFlow').length,0);
    assert.equal(registry.entries('sidebar.workspaces.directoryFlow')[0].component,nativePicker);
    await update({tree:true}); await waitFor(()=>registry.entriesOfSlot('sidebar.workspaces')[0]?.options.priority===-20);
    assert.equal(registry.entries('liquid-glass.workspace.directoryFlow').length,1);
    assert.equal(registry.entries('sidebar.workspaces.directoryFlow').length,1);
  }
  await update({ motion: 'off', orb: false });
  await waitFor(() => body.dataset.lgMotion === 'off');
  assert.equal(body.dataset.lgOrb, 'false');
  await update({ tree: false, theme: false });
  await waitFor(() => registry.entriesOfSlot('sidebar.workspaces')[0]?.component === native && theme.overrides.size === 0);
  assert.equal(body.dataset.liquidGlass, undefined);
  await waitFor(() => registry.entries('conversation.input.right').length === 0);
  assert.equal(document.querySelector('style[data-plugin-css="dsh-liquid-glass-effort-slider"]'), null);
  await update({ tree: true, theme: true });
  await waitFor(() => registry.entriesOfSlot('sidebar.workspaces')[0]?.options.priority === -20);
  assert.equal(theme.overrides.size, 1);
  await waitFor(() => registry.entries('conversation.input.right').length === 1);
  await dispose();
  assert.equal(registry.entriesOfSlot('sidebar.workspaces')[0].component, native);
  assert.equal(registry.entries('sidebar.footer.action').length, 0);
  assert.equal(registry.entries('settings.section').length, 0);
  assert.equal(theme.overrides.size, 0); assert.equal(styles.size, 0);
  assert.equal(body.dataset.lgMotion, undefined);
  assert.equal(registry.entries('sidebar.brand.name').length, 0);
  assert.equal(registry.entries('conversation.hero.brand.mark').length, 0);
  assert.equal(registry.entries('conversation.input.right').length, 0);
  assert.equal(document.querySelector('style[data-plugin-css="dsh-liquid-glass-effort-slider"]'), null);
  console.log('PASS: installed DSH SlotRegistry + ThemeRuntime, bundled client loading, native tree fallback, re-enable and complete unload.');
} finally {
  await dispose?.(); releaseNativePicker(); releaseNative(); releaseRoot();
  dom.window.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
}
