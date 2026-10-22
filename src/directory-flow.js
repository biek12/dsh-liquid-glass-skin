/** Borrow the elected picker occupant into an owned hole, without redeclaring DSH's native hole. */
export const DIRECTORY_FLOW = 'liquid-glass.workspace.directoryFlow';
export const NATIVE_DIRECTORY_FLOW = 'sidebar.workspaces.directoryFlow';
export function installDirectoryFlow(ctx) {
  return ctx.slots.inject(DIRECTORY_FLOW, () => ctx.slots.inject(NATIVE_DIRECTORY_FLOW, () => {
    let previous; let release;
    const sync = () => {
      const current = ctx.slots.entriesOfSlot(NATIVE_DIRECTORY_FLOW)[0];
      if (current === previous) return;
      release?.(); release = undefined; previous = undefined;
      if (!current) return;
      const dispose = ctx.slots.register({ name:DIRECTORY_FLOW,
        ...(current.inject ? {inject:current.inject} : {}),
        ...(current.locale ? {locale:current.locale} : {}),
        ...(current.store ? {store:current.store} : {}),
      }, current.component);
      release = dispose; previous = current;
    };
    const unsubscribe = ctx.slots.subscribe(NATIVE_DIRECTORY_FLOW, sync); sync();
    return () => { unsubscribe(); release?.(); };
  }));
}
