import { emptyState, validateState } from './model.js';
import { API_PATH } from './http.js';

export function createController({ fetcher = fetch, initial, persist, poll = true } = {}) {
  let snapshot = { state: initial ?? emptyState(), ready: !!initial, loading: !initial, saving: false, error: '' };
  const listeners = new Set(); const lifetime = new AbortController(); let disposed = false; let sequence = Promise.resolve(); let reading;
  const publish = patch => { if (disposed) return; snapshot = { ...snapshot, ...patch }; for (const listener of listeners) listener(); };
  const request = async (method, body) => {
    const response = await fetcher(API_PATH, {
      method, headers: { 'X-DSH-Liquid-Glass': '1', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.any([lifetime.signal, AbortSignal.timeout(12000)]),
    });
    const result = await response.json();
    if (result.state) {
      const state = validateState(result.state);
      if (state.revision >= snapshot.state.revision) publish({ state, ready: true, loading: false });
    }
    if (!response.ok) throw new Error(result.error || '目录服务暂时不可用');
    if (!result.state) throw new Error('目录服务返回了不完整的数据');
  };
  const refresh = () => {
    if (persist || disposed) return Promise.resolve();
    if (reading) return reading;
    reading = request('GET').then(() => publish({ error: '', loading: false })).catch(error => {
      if (!disposed) publish({ error: error.name === 'TimeoutError' ? '读取目录超时，请重试' : error.message, loading: false });
    }).finally(() => { reading = null; });
    return reading;
  };
  const mutate = operation => {
    const run = async () => {
      if (disposed) throw new Error('目录插件已停用');
      publish({ saving: true, error: '' });
      try {
        if (reading) await reading;
        if (persist) publish({ state: await persist(snapshot.state, operation) });
        else await request('POST', { revision: snapshot.state.revision, operation });
      } catch (error) { publish({ error: error.message }); throw error; }
      finally { publish({ saving: false }); }
    };
    const result = sequence.then(run); sequence = result.catch(() => {}); return result;
  };
  const timer = poll && !persist ? setInterval(() => { if (document.visibilityState === 'visible' && !snapshot.saving) refresh(); }, 15000) : null;
  return {
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); },
    getSnapshot: () => snapshot, refresh, mutate,
    dispose: () => { disposed = true; lifetime.abort(); if (timer) clearInterval(timer); listeners.clear(); },
  };
}
