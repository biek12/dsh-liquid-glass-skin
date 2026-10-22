import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { createEffortRuntime, EffortSeat } from '../src/effort-slider.js';

const choices = {
  2: ['off', 'high'],
  4: ['off', 'low', 'high', 'max'],
  6: ['off', 'minimal', 'low', 'medium', 'high', 'max'],
};
const label = value => value[0].toUpperCase() + value.slice(1);
function createDirectory() {
  const listeners = new Set();
  let count = 4;
  let snapshot;
  const update = effort => {
    snapshot = { current: { provider: 'preview', model: `preview-${count}`, reasoningEffort: effort },
      groups: [{ id: 'preview', models: [{ id: `preview-${count}`, reasoning: { defaultEffort: 'high', efforts: choices[count].map(id => ({ id, name: label(id) })) } }] }], status: 'ready' };
    for (const listener of listeners) listener();
  };
  update('high');
  return {
    store: { getSnapshot: () => snapshot, subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); } },
    select: async selection => { update(selection.reasoningEffort); return { ok: true }; },
    configure: value => { count = value; update('high'); },
  };
}

export function EffortDemo({ controller }) {
  const [runtime] = useState(createEffortRuntime);
  const [directory] = useState(createDirectory);
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const state = useSyncExternalStore(directory.store.subscribe, directory.store.getSnapshot);
  const context = useMemo(() => ({ modelDirectories: { directoryFor: () => directory } }), [directory]);
  useEffect(() => { runtime.__internals.installStyles(); return () => runtime.dispose(); }, [runtime]);
  useEffect(() => {
    if (!open) return;
    const close = event => {
      if (event.key === 'Escape') { setOpen(false); setSubmenu(false); }
      if (event.type === 'pointerdown' && !event.target.closest('.preview-effort-demo,.preview-effort-menu,.lg-ces-set')) setOpen(false);
    };
    document.addEventListener('keydown', close); document.addEventListener('pointerdown', close);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', close); };
  }, [open]);
  const effort = label(state.current.reasoningEffort);
  const levels = state.groups[0].models[0].reasoning.efforts;
  return <section className="preview-effort-demo" data-composer-card>
    <span>推理等级</span><select aria-label="预览模型档位数" onChange={event => directory.configure(Number(event.target.value))} defaultValue="4">{[2, 4, 6].map(count => <option key={count} value={count}>{count} 档模型</option>)}</select>
    <button aria-haspopup="menu" aria-expanded={open} aria-controls="preview-effort-menu" onClick={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      setPosition({ left: Math.max(8, Math.min(rect.left, innerWidth - 328)), top: Math.max(8, rect.top - 150) });
      setOpen(!open); setSubmenu(false);
    }}><span>DeepSeek</span><span>{effort}</span><span>⌃</span></button>
    <EffortSeat runtime={runtime} context={context} controller={controller} sessionId="effort-preview"/>
    {open && createPortal(<div id="preview-effort-menu" role="menu" aria-label="模型设置" className="preview-effort-menu" style={position}>
      {!submenu ? <><button role="menuitem"><span>模型</span><span>DeepSeek</span><span>›</span></button><button role="menuitem" onClick={() => setSubmenu(true)}><span>推理等级</span><span className="cellValue">{effort}</span><span>›</span></button></> : <>
        <button onClick={() => setSubmenu(false)}>‹ 返回</button>{levels.map(level => <button key={level.id} role="menuitemradio" aria-checked={state.current.reasoningEffort === level.id} onClick={() => { directory.select({ reasoningEffort: level.id }); setSubmenu(false); }}><span>{level.name}</span></button>)}
      </>}
    </div>, document.body)}
  </section>;
}
