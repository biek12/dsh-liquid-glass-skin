/** Share DSH's durable preference and system-change events; never keep a second mode. */
export function createAppearanceSource(ctx, { doc = typeof document === 'undefined' ? undefined : document, quietMs = 220, minimumMs = 420, maximumMs = 1800 } = {}) {
  const listeners = new Set(); let changing = false; let snapshot = ctx.theme.getTheme(); let task; let disposed = false; let transition; let cancelSettle;
  const publish = () => { snapshot = { ...ctx.theme.getTheme(), changing }; for (const fn of listeners) fn(); };
  const off = ctx.on('theme/change', publish);
  const settle = () => new Promise(resolve => {
    const started = Date.now(); let timer; let done = false;
    const finish = () => { if (done) return; done = true; clearTimeout(timer); clearTimeout(limit); unlisten(); cancelSettle = undefined; resolve(); };
    const reset = () => { clearTimeout(timer); timer = setTimeout(finish, Math.max(quietMs, minimumMs - (Date.now() - started))); };
    const unlisten = ctx.on('theme/change', reset); const limit = setTimeout(finish, maximumMs); cancelSettle = finish; reset();
  });
  return {
    getSnapshot: () => snapshot,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); },
    select: mode => {
      if (!['light', 'dark', 'system'].includes(mode)) throw new Error('未知外观模式');
      if (disposed) return Promise.reject(new Error('主题设置已关闭'));
      if (task) return task; // The mode control is disabled until the previous native write settles.
      if (ctx.theme.getTheme().preference === mode) return Promise.resolve();
      changing = true; publish();
      const update = async () => {
        const form = ctx.configForms?.get('ui-theme');
        if (form) {
          // Write once through the native settings scope and await Host acceptance.
          // ThemeRuntime adopts that durable snapshot; avoid its optimistic setTheme/media feedback loop.
          if (!await form.set('preference', mode)) throw new Error('外观设置未保存，请重试');
        } else ctx.theme.setTheme(mode);
        await settle();
      };
      task = (async () => {
        try {
          if (doc?.startViewTransition && doc.body?.dataset.liquidGlass === 'on') {
            // Keep the last stable frame visible while Electron changes themeSource and its media query.
            doc.documentElement.dataset.lgThemeTransition = 'on';
            transition = doc.startViewTransition(update);
            transition.ready?.catch(() => {}); // A hidden window may skip the visual transition.
            await transition.updateCallbackDone; await transition.finished.catch(() => {});
          } else await update();
        } finally { cancelSettle?.(); transition = undefined; delete doc?.documentElement?.dataset.lgThemeTransition; changing = false; task = undefined; if (!disposed) publish(); }
      })();
      return task;
    },
    dispose: () => { disposed = true; cancelSettle?.(); transition?.skipTransition(); off(); listeners.clear(); delete doc?.documentElement?.dataset.lgThemeTransition; },
  };
}
