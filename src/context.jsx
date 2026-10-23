import React, { useSyncExternalStore } from 'react';
import { summarizeContext, priceBook } from './context-data.js';
export { summarizeContext, priceBook } from './context-data.js';

export function installContext(ctx) {
  let value = {}, book = null, stopped = false, relayTimer;
  const listeners = new Set();
  const source = { subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); }, getSnapshot: () => value };
  const update = () => {
    if (stopped) return;
    value = summarizeContext(ctx.sessions.list.getSnapshot(), book);
    listeners.forEach(fn => fn());
    clearTimeout(relayTimer);
    relayTimer = setTimeout(() => { fetch('/plugins/dsh-liquid-glass/v1/context', { method:'POST', headers:{'X-DSH-Liquid-Glass':'1','Content-Type':'application/json'}, body:JSON.stringify(value) }).catch(() => {}); }, 500);
  };
  const off = ctx.sessions.list.subscribe(update);
  const abort = new AbortController();
  let pricing = false;
  const loadPrices = () => {
    if (pricing || book || stopped) return;
    pricing = true;
    fetch('https://models.dev/api.json', { signal:AbortSignal.any([abort.signal, AbortSignal.timeout(12000)]) }).then(r => { if (!r.ok) throw new Error('Price book unavailable'); return r.json(); }).then(data => { if (!stopped) { book = priceBook(data); update(); } }).catch(() => {}).finally(() => { pricing = false; });
  };
  loadPrices();
  // The Insights panel requests this same idempotent backfill when opening older sessions.
  fetch('api/dsh-context/backfill', {method:'POST', signal:abort.signal}).then(response => {
    if (response.ok && !stopped) return ctx.sessions.refresh?.();
  }).catch(() => {});
  const release = ctx.slots.inject('conversation.input.right', () => ctx.slots.register({ name:'conversation.input.right', id:'liquid-glass-context', order:45 }, () => {
    const summary = useSyncExternalStore(source.subscribe, source.getSnapshot, source.getSnapshot);
    return <span className="lg-context-meter" title="上下文占用与费用估算；完整明细见上下文洞察面板">上下文 {summary.occupancy == null ? '待识别' : `${summary.occupancy.toFixed(1)}%`}{summary.sessionCost && ` · ≈${summary.sessionCost}`}</span>;
  }));
  update(); const timer = setInterval(() => { update(); loadPrices(); }, 30000);
  return { ...source, dispose() { stopped=true; abort.abort(); off(); release(); clearInterval(timer); clearTimeout(relayTimer); listeners.clear(); } };
}
