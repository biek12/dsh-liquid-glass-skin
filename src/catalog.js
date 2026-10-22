/** The Workspace registry owns the primary conversation list. Unowned Session
 * records include child Agents; they must never be inferred as user chats. */
export function createCatalog(workspaces, sessions) {
  const archived = new Set(workspaces.archivedSessionIds ?? []);
  const pinned = new Set(workspaces.pinnedSessionIds ?? []);
  return workspaces.items.map(w => ({
    workspaceId: w.workspaceId, title: w.title || '默认工作区', path: w.path, sessionIds: w.sessionIds,
    sessions: w.sessionIds.flatMap(id => {
      const session = sessions.byId[id];
      return session && !archived.has(id) && (!session.blank || (session.retainedBy?.mainView ?? 0) > 0)
        ? [{ id, title: session.title || '新会话', pinned: pinned.has(id) }] : [];
    }),
  }));
}
