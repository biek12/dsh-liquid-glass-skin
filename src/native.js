/** Native session operations; none of these change chat contents or start a turn. */
export function createSessionActions(ctx, writeClipboard = copyText) {
  return {
    renameSession: async (id, title) => {
      const result = await ctx.sessions.using(id, { source: 'workspaceOperation' }, ref => ref.binding.session.rename(title));
      if (!result.ok) throw new Error(result.error.message);
    },
    pinSession: id => ctx.uiWorkspace.pinSession(id),
    unpinSession: id => ctx.uiWorkspace.unpinSession(id),
    forkSession: id => ctx.uiWorkspace.forkSession(id, undefined, { allowMigration: false }),
    copySessionId: async id => { if (!await writeClipboard(id)) throw new Error('无法写入剪贴板，请检查系统权限后重试'); },
  };
}
export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
  }
  if (typeof document.execCommand !== 'function') return false;
  const previous = document.activeElement; const node = document.createElement('textarea');
  node.value = text; node.setAttribute('readonly', ''); node.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.append(node);
  try { node.select(); return document.execCommand('copy'); }
  finally { node.remove(); previous?.focus?.({ preventScroll: true }); }
}

/** Native creation preserves real workspace ownership; virtual folder assignment follows once. */
export function createCreationActions(ctx, controller, workspacePicker) {
  return {
    createWorkspace: () => workspacePicker.request(),
    createSession: async (workspaceId, folderId = null) => {
      const id = await ctx.sessions.create({ workspaceId });
      if (!id) throw new Error('创建会话未返回 Session ID');
      try {
        if (folderId !== null) await controller.mutate({ type:'session.move', id, workspaceId, folderId });
      } catch (error) {
        ctx.uiWorkspace.openSession(id);
        throw new Error(`会话已创建，但目录归类未保存：${error.message}`, { cause: error });
      }
      ctx.uiWorkspace.openSession(id); return id;
    },
  };
}
