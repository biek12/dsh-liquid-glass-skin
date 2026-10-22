/** Presentation metadata only. Workspace ownership and execution paths remain owned by DSH. */
export const STATUSES = { none: '无状态', todo: '未开始', doing: '进行中', done: '已完成', paused: '搁置' };
export const COLORS = { default: '#8e8e93', blue: '#007aff', purple: '#af52de', pink: '#ff2d55', orange: '#ff9500', green: '#34a853', teal: '#00a5a8' };
export const DEFAULT_PREFERENCES = Object.freeze({ theme: true, tree: true, motion: 'full', orb: true, statusGlow: true, hoverLine: true, glass: 'frosted', density: 'comfortable', showTags: true, showCounts: true });
export const PRESENTATION_DEFAULTS = Object.fromEntries(Object.entries(DEFAULT_PREFERENCES).filter(([key]) => !['theme', 'tree'].includes(key)));
export const emptyState = () => ({ version: 1, revision: 0, folders: [], sessions: {}, preferences: { ...DEFAULT_PREFERENCES } });
const safeId = value => typeof value === 'string' && value.length > 0 && value.length <= 240 && !['__proto__', 'constructor', 'prototype'].includes(value);
const fail = message => { throw new Error(message); };
const text = (value, length, label) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= length ? value.trim() : fail(`${label}不能为空，且最多 ${length} 个字符`);
const validMeta = item => {
  if (!(item.status in STATUSES) || !Object.hasOwn(STATUSES, item.status)) fail('未知状态');
  if (!Object.hasOwn(COLORS, item.color)) fail('未知颜色');
  if (typeof item.icon !== 'string' || item.icon.length > 12) fail('图标最多 12 个字符');
  if (typeof item.starred !== 'boolean') fail('收藏格式错误');
  if (!Array.isArray(item.tags) || item.tags.length > 12 || new Set(item.tags).size !== item.tags.length || item.tags.some(t => typeof t !== 'string' || !t.trim() || t.length > 30)) fail('最多 12 个标签，每个最多 30 字');
};
export const defaultMeta = () => ({ status: 'none', color: 'default', icon: '', tags: [], starred: false });
export function validateState(input) {
  if (!input || input.version !== 1 || !Number.isSafeInteger(input.revision) || input.revision < 0) fail('目录数据版本不正确');
  if (!Array.isArray(input.folders) || input.folders.length > 5000 || !input.sessions || Array.isArray(input.sessions) || typeof input.sessions !== 'object' || Object.keys(input.sessions).length > 50000) fail('目录数据格式不正确');
  if (typeof input.preferences?.theme !== 'boolean' || typeof input.preferences?.tree !== 'boolean') fail('偏好设置格式错误');
  const preferences = { ...DEFAULT_PREFERENCES, ...input.preferences };
  for (const key of ['theme', 'tree', 'orb', 'statusGlow', 'hoverLine', 'showTags', 'showCounts']) if (typeof preferences[key] !== 'boolean') fail('偏好设置格式错误');
  for (const [key, values] of Object.entries({ motion: ['full', 'soft', 'off'], glass: ['frosted', 'solid'], density: ['comfortable', 'compact'] })) if (!values.includes(preferences[key])) fail('未知外观设置');
  const byId = new Map();
  for (const folder of input.folders) {
    if (!safeId(folder.id) || !safeId(folder.workspaceId) || byId.has(folder.id)) fail('目录 ID 无效或重复');
    if (folder.parentId !== null && !safeId(folder.parentId)) fail('上级目录无效');
    if (text(folder.name, 80, '目录名称') !== folder.name) fail('目录名称包含首尾空格');
    if (!Number.isFinite(folder.order)) fail('目录顺序无效');
    validMeta(folder); byId.set(folder.id, folder);
  }
  for (const folder of input.folders) {
    const seen = new Set([folder.id]); let parentId = folder.parentId;
    while (parentId !== null) {
      const parent = byId.get(parentId);
      if (!parent || parent.workspaceId !== folder.workspaceId) fail('上级目录必须在同一工作区');
      if (seen.has(parentId)) fail('不能将目录移入自身或其子目录');
      seen.add(parentId); if (seen.size > 64) fail('目录最多嵌套 64 层');
      parentId = parent.parentId;
    }
  }
  for (const [id, item] of Object.entries(input.sessions)) {
    if (!safeId(id) || !safeId(item.workspaceId) || !Number.isFinite(item.order)) fail('会话归类格式错误');
    if (item.folderId !== null) {
      const folder = byId.get(item.folderId);
      if (!folder || folder.workspaceId !== item.workspaceId) fail('会话只能移到当前工作区的目录');
    }
    validMeta(item);
  }
  return { ...structuredClone(input), preferences };
}
export function folderPath(state, id) {
  const path = []; const seen = new Set();
  while (id) { if (seen.has(id)) break; seen.add(id); const f = state.folders.find(f => f.id === id); if (!f) break; path.unshift(f.name); id = f.parentId; }
  return path.join(' / ');
}
export function applyOperation(current, op, catalog) {
  if (!op || typeof op !== 'object') fail('操作无效');
  const next = structuredClone(current);
  const workspace = id => catalog.find(w => w.workspaceId === id) ?? fail('工作区不存在，请刷新');
  const folder = id => next.folders.find(f => f.id === id) ?? fail('目录不存在，请刷新');
  const parent = (id, workspaceId) => { if (id !== null && folder(id).workspaceId !== workspaceId) fail('不能跨工作区移动目录'); };
  const session = (id, workspaceId) => {
    if (!safeId(id) || !workspace(workspaceId).sessionIds.includes(id)) fail('会话不属于这个工作区');
    const item = next.sessions[id] ??= { ...defaultMeta(), workspaceId, folderId: null, order: workspace(workspaceId).sessionIds.indexOf(id) };
    if (item.workspaceId !== workspaceId) Object.assign(item, { workspaceId, folderId: null, order: workspace(workspaceId).sessionIds.indexOf(id) });
    return item;
  };
  const meta = (item, patch) => {
    if (!patch || typeof patch !== 'object') fail('标记格式错误');
    for (const key of ['status', 'color', 'icon', 'tags', 'starred']) if (Object.hasOwn(patch, key)) item[key] = patch[key];
  };
  const reorder = (item, items, beforeId, getId) => {
    if (beforeId === getId(item)) return;
    const peers = items.filter(f => f !== item).sort((a, b) => a.order - b.order);
    const index = beforeId == null ? peers.length : peers.findIndex(f => getId(f) === beforeId);
    if (index < 0) fail('排序目标已变化，请重试');
    peers.splice(index, 0, item); peers.forEach((f, i) => { f.order = i; });
  };
  switch (op.type) {
    case 'folder.create': {
      workspace(op.workspaceId); parent(op.parentId, op.workspaceId);
      if (!safeId(op.id) || next.folders.some(f => f.id === op.id)) fail('目录 ID 重复或无效');
      const item = { ...defaultMeta(), id: op.id, name: text(op.name, 80, '目录名称'), workspaceId: op.workspaceId, parentId: op.parentId, order: Math.max(-1, ...next.folders.filter(f => f.workspaceId === op.workspaceId && f.parentId === op.parentId).map(f => f.order)) + 1 };
      if (op.meta) meta(item, op.meta);
      next.folders.push(item);
      break;
    }
    case 'folder.update': {
      const item = folder(op.id); workspace(item.workspaceId); parent(op.parentId, item.workspaceId);
      item.name = text(op.name, 80, '目录名称');
      if (item.parentId !== op.parentId) { item.parentId = op.parentId; item.order = Math.max(-1, ...next.folders.filter(f => f.id !== item.id && f.workspaceId === item.workspaceId && f.parentId === op.parentId).map(f => f.order)) + 1; }
      meta(item, op.patch); break;
    }
    case 'folder.rename': folder(op.id).name = text(op.name, 80, '目录名称'); break;
    case 'folder.meta': meta(folder(op.id), op.patch); break;
    case 'folder.move': {
      const item = folder(op.id); workspace(item.workspaceId); parent(op.parentId, item.workspaceId); item.parentId = op.parentId;
      reorder(item, next.folders.filter(f => f.workspaceId === item.workspaceId && f.parentId === item.parentId), op.beforeId, f => f.id); break;
    }
    case 'folder.delete': {
      const item = folder(op.id);
      for (const f of next.folders) if (f.parentId === item.id) f.parentId = item.parentId;
      for (const s of Object.values(next.sessions)) if (s.folderId === item.id) s.folderId = item.parentId;
      next.folders = next.folders.filter(f => f.id !== item.id); break;
    }
    case 'session.move': {
      const item = session(op.id, op.workspaceId); parent(op.folderId, item.workspaceId);
      if (item.workspaceId !== op.workspaceId) fail('不能跨工作区移动会话');
      item.folderId = op.folderId;
      // Materialize sibling order once; untouched sessions retain the host's order.
      workspace(op.workspaceId).sessionIds.forEach((id, index) => {
        if (!Object.hasOwn(next.sessions, id)) next.sessions[id] = { ...defaultMeta(), workspaceId: op.workspaceId, folderId: null, order: index };
      });
      const peers = workspace(op.workspaceId).sessionIds.filter(id => id !== op.id && next.sessions[id]?.folderId === item.folderId).sort((a, b) => next.sessions[a].order - next.sessions[b].order);
      const index = op.beforeId == null ? peers.length : peers.indexOf(op.beforeId);
      if (op.beforeId === op.id) break;
      if (index < 0) fail('排序目标已变化，请重试');
      peers.splice(index, 0, op.id); peers.forEach((id, order) => { next.sessions[id].order = order; }); break;
    }
    case 'session.meta': meta(session(op.id, op.workspaceId), op.patch); break;
    case 'session.update': {
      const item = session(op.id, op.workspaceId); parent(op.folderId, item.workspaceId);
      if (item.folderId !== op.folderId) {
        item.folderId = op.folderId;
        item.order = Math.max(-1, ...workspace(item.workspaceId).sessionIds.flatMap((id, index) => {
          if (id === op.id) return [];
          const record = next.sessions[id]?.workspaceId === item.workspaceId ? next.sessions[id] : undefined;
          return (record?.folderId ?? null) === item.folderId ? [record?.order ?? index] : [];
        })) + 1;
      }
      meta(item, op.patch); break;
    }
    case 'preferences': {
      for (const key of Object.keys(DEFAULT_PREFERENCES)) if (Object.hasOwn(op.patch ?? {}, key)) next.preferences[key] = op.patch[key]; break;
    }
    default: fail('未知目录操作');
  }
  next.revision += 1;
  return validateState(next);
}
