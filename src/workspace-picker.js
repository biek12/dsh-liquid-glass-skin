/** Owner of the installed directoryFlow slot: both native and browse occupants share this contract. */
export function createWorkspacePicker({ createWorkspace, available = () => true }) {
  let snapshot = { open: false, busy: false }; let pending; let disposed = false;
  const listeners = new Set();
  const publish = patch => { snapshot = { ...snapshot, ...patch }; for (const fn of listeners) fn(); };
  const finish = (error, result) => {
    const current = pending; pending = undefined; publish({ open:false, busy:false });
    if (current) error ? current.reject(error) : current.resolve(result);
  };
  return {
    getSnapshot: () => snapshot,
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
    request: () => {
      if (disposed) return Promise.reject(new Error('目录选择器已关闭'));
      if (pending) return pending.promise;
      if (!available()) return Promise.reject(new Error('目录选择器尚未就绪，请稍后重试'));
      let resolve, reject; const promise = new Promise((yes,no) => { resolve=yes; reject=no; });
      pending = { promise, resolve, reject }; publish({ open:true, busy:false }); return promise;
    },
    onPicked: async path => {
      if (!pending || snapshot.busy || disposed) return;
      if (typeof path !== 'string' || !path) { finish(new Error('未能获取所选工作区目录')); return; }
      publish({ busy:true });
      try { const workspace = await createWorkspace({ path }); finish(null, workspace); }
      catch (error) { finish(error instanceof Error ? error : new Error(String(error))); }
    },
    onCancel: () => { if (!snapshot.busy) finish(null,null); },
    onError: message => finish(new Error(String(message))),
    dispose: () => { disposed=true; finish(null,null); listeners.clear(); },
  };
}
