export function afterPaint(callback, win = window) {
  let timer; let frame; let cancelled = false;
  const run = () => { if (!cancelled) callback(); };
  if (win.requestAnimationFrame) frame = win.requestAnimationFrame(() => { timer = win.setTimeout(run, 0); });
  else timer = win.setTimeout(run, 0);
  return () => { cancelled = true; if (frame !== undefined) win.cancelAnimationFrame(frame); if (timer !== undefined) win.clearTimeout(timer); };
}

export function watchShell(doc, callback) {
  let cancel; let disposed = false;
  const schedule = () => {
    if (cancel || disposed) return;
    cancel = afterPaint(() => { cancel = undefined; if (!disposed) callback(); }, doc.defaultView);
  };
  const observer = new doc.defaultView.MutationObserver(records => {
    for (const record of records) {
      const target = record.target.nodeType === 1 ? record.target : record.target.parentElement;
      if (target?.closest('[data-conversation-region="chat"],.lg-tree,.lg-ces-inline,.lg-ces-set')) continue;
      if ([...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1)) { schedule(); break; }
    }
  });
  observer.observe(doc.body, { childList: true, subtree: true });
  schedule();
  return () => { disposed = true; observer.disconnect(); cancel?.(); };
}
