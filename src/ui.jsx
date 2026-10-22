import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { RailMenu } from './rail-menu.jsx';
import { RowMenu } from './menu.jsx';
import { COLORS, STATUSES, defaultMeta, folderPath } from './model.js';

const paths = {
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z',
  chat: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-9.5A8.5 8.5 0 0 1 11.5 3h1a8.5 8.5 0 0 1 8.5 8.5Z',
  plus: 'M12 5v14M5 12h14', chevron: 'm9 5 7 7-7 7', search: 'M21 21l-4.4-4.4M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
  more: 'M5 12h.01M12 12h.01M19 12h.01', star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z',
  sliders: 'M4 7h16M4 17h16M8 4v6M16 14v6', close: 'm6 6 12 12M6 18 18 6',
  check: 'm5 12 4 4L19 6', book: 'M12 6v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v14c-4-1-6 0-9 2-3-2-5-3-9-2Z',
  sun: 'M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  pin: 'm8 3 8 0-1 6 4 4v2h-6v6l-1-2-1 2v-6H5v-2l4-4Z', fork: 'M6 3v12a4 4 0 0 0 4 4h8M6 7h8a4 4 0 0 0 4-4M15 16l3 3-3 3', copy: 'M8 8h12v13H8ZM16 8V3H3v13h5',
  edit: 'm15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14Z', trash: 'M4 7h16M9 3h6l1 4H8ZM6 7l1 14h10l1-14M10 11v6M14 11v6', archive: 'M3 4h18v5H3ZM5 9v12h14V9M10 13h4',
  arrow: 'M5 12h14m-5-5 5 5-5 5', glass: 'M4 5h16l-2 10H6ZM12 15v6M8 21h8',
};
export const Icon = ({ name, size = 16, ...props }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.folder}/></svg>;
export const useSource = source => useSyncExternalStore(source.subscribe, source.getSnapshot, source.getSnapshot);
const parseTags = text => [...new Set(text.split(/[,，;；\n]/).map(t => t.trim()).filter(Boolean))];
const DRAG_TYPE = 'application/x-dsh-liquid-glass';

function Modal({ children, title, close }) {
  const ref = useRef();
  useEffect(() => { const dialog = ref.current; dialog.showModal(); dialog.querySelector('input')?.focus(); return () => { if (dialog.open) dialog.close(); }; }, []);
  return <dialog ref={ref} className="lg-dialog" aria-label={title} onCancel={close} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); } }}>
    <header><div><h2>{title}</h2></div><button className="lg-icon-button" aria-label="关闭" onClick={close}><Icon name="close"/></button></header>{children}
  </dialog>;
}

function Editor({ editor, state, controller, close }) {
  const isFolder = editor.kind === 'folder'; const creating = editor.create;
  const initial = creating ? { ...defaultMeta(), name: '', parentId: editor.parentId } : isFolder ? state.folders.find(f => f.id === editor.id) : state.sessions[editor.id] ?? { ...defaultMeta(), folderId: null };
  const [draft, setDraft] = useState(initial); const [tags, setTags] = useState(initial.tags.join('，'));
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [deleting, setDeleting] = useState(false);
  const patch = (key, value) => setDraft(d => ({ ...d, [key]: value }));
  const folders = state.folders.filter(f => f.workspaceId === editor.workspaceId && (!isFolder || !isDescendant(f.id, editor.id, state)));
  const submit = async event => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const metadata = { status: draft.status, color: draft.color, icon: draft.icon, starred: draft.starred, tags: parseTags(tags) };
      if (creating) {
        const id = crypto.randomUUID();
        // One server operation creates both the folder and its metadata.
        await controller.mutate({ type: 'folder.create', id, workspaceId: editor.workspaceId, parentId: draft.parentId, name: draft.name, meta: metadata });
      } else if (isFolder) {
        await controller.mutate({ type: 'folder.update', id: editor.id, name: draft.name, parentId: draft.parentId, patch: metadata });
      } else {
        await controller.mutate({ type: 'session.update', id: editor.id, workspaceId: editor.workspaceId, folderId: draft.folderId, patch: metadata });
      }
      close();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const remove = async () => { setBusy(true); try { await controller.mutate({ type: 'folder.delete', id: editor.id }); close(); } catch (e) { setError(e.message); setBusy(false); } };
  return <Modal title={creating ? '新建子目录' : isFolder ? '编辑目录' : '会话标记与归类'} close={() => { if (!busy) close(); }}>
    <form onSubmit={submit}>
      {isFolder && <label>目录名称<input autoFocus required maxLength={80} value={draft.name} placeholder="例如：产品设计" onChange={e => patch('name', e.target.value)}/></label>}
      {!isFolder && <p className="lg-editor-session">{editor.title}</p>}
      <label>{isFolder ? '上级目录' : '所在目录'}<select value={(isFolder ? draft.parentId : draft.folderId) ?? ''} onChange={e => patch(isFolder ? 'parentId' : 'folderId', e.target.value || null)}><option value="">工作区根目录</option>{folders.map(f => <option key={f.id} value={f.id}>{folderPath(state, f.id)}</option>)}</select></label>
      <div className="lg-form-grid"><label>图标 / Emoji<input maxLength={12} value={draft.icon} placeholder={isFolder ? '📁' : '💬'} onChange={e => patch('icon', e.target.value)}/></label><label>手动状态<select value={draft.status} onChange={e => patch('status', e.target.value)}>{Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label></div>
      <fieldset><legend>标记颜色</legend><div className="lg-colors">{Object.entries(COLORS).map(([key, value]) => <button key={key} type="button" aria-label={`颜色：${{ default: '灰色', blue: '蓝色', purple: '紫色', pink: '粉色', orange: '橙色', green: '绿色', teal: '青色' }[key]}`} aria-pressed={draft.color === key} className="lg-color" style={{ '--swatch': value }} onClick={() => patch('color', key)}>{draft.color === key && <Icon name="check" size={14}/>}</button>)}</div></fieldset>
      <label>标签<input value={tags} placeholder="工作，设计，待办" onChange={e => setTags(e.target.value)}/><small>用逗号分隔，最多 12 个；由你手动维护。</small></label>
      <label className="lg-checkbox"><input type="checkbox" checked={draft.starred} onChange={e => patch('starred', e.target.checked)}/><Icon name="star"/>收藏此{isFolder ? '目录' : '会话'}</label>
      {error && <p role="alert" className="lg-error">{error}</p>}
      {deleting && <div className="lg-delete-note"><strong>删除“{initial.name}”？</strong><p>子目录和会话会移到上一级，聊天记录保留。</p><button type="button" className="lg-danger" disabled={busy} onClick={remove}>确认删除目录</button></div>}
      <footer>{isFolder && !creating ? <button type="button" className="lg-text-button lg-danger" disabled={busy} onClick={() => setDeleting(!deleting)}>删除目录</button> : <span/>}<div><button type="button" className="lg-secondary" disabled={busy} onClick={close}>取消</button><button className="lg-primary" disabled={busy}>{busy ? '保存中…' : creating ? '创建目录' : '保存更改'}</button></div></footer>
    </form>
  </Modal>;
}
function NameEditor({ target, rename, close }) {
  const noun = ({folder:'目录',workspace:'工作区',session:'会话'})[target.kind];
  const [title, setTitle] = useState(target.title); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  return <Modal title={`重命名${noun}`} close={() => { if (!busy) close(); }}><form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); try { await rename(target.id, title.trim()); close(); } catch (e) { setError(e.message); } finally { setBusy(false); } }}><label>{noun}名称<input required maxLength={target.kind === 'session' ? 160 : 80} value={title} onChange={e => setTitle(e.target.value)}/></label>{error && <p role="alert" className="lg-error">{error}</p>}<footer><span/><div><button type="button" className="lg-secondary" disabled={busy} onClick={close}>取消</button><button className="lg-primary" disabled={busy}>保存</button></div></footer></form></Modal>;
}
function isDescendant(id, parentId, state) {
  const seen = new Set();
  while (id) { if (id === parentId) return true; if (seen.has(id)) return true; seen.add(id); id = state.folders.find(f => f.id === id)?.parentId; }
  return false;
}

export function FolderTree({ wide = true, expandSidebar, controller, catalog, activeId, openSession, createSession, createWorkspace, onNativeView, renameWorkspace, removeWorkspace, archiveSession, unarchiveSession, renameSession, pinSession, unpinSession, forkSession, copySessionId, storageKey = 'dsh.liquid-glass.collapsed.v1' }) {
  const runtime = useSource(controller); const state = runtime.state;
  const [query, setQuery] = useState(''); const [searchOpen, setSearchOpen] = useState(false); const [filter, setFilter] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false); const [statusFilter, setStatusFilter] = useState('all'); const [tagFilter, setTagFilter] = useState(''); const [colorFilter, setColorFilter] = useState('all');
  const [editor, setEditor] = useState(null); const [menu, setMenu] = useState(null); const [deletion, setDeletion] = useState(null); const [deleting, setDeleting] = useState(false); const [deleteError, setDeleteError] = useState(''); const [drop, setDrop] = useState(null);
  const [collapsed, setCollapsed] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { return {}; } });
  const dragged = useRef(null); const dropRef = useRef(null); const treeRef = useRef();
  const [notice, setNotice] = useState('');
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3200); return () => clearTimeout(timer); }, [notice]); const [workspaceRename, setWorkspaceRename] = useState(null); const [nativeBusy, setNativeBusy] = useState(false); const [undoArchive, setUndoArchive] = useState(null);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(collapsed)); } catch {} }, [collapsed, storageKey]);
  useEffect(() => { if (!wide) { setMenu(null); setDrop(null); dragged.current = null; dropRef.current = null; } }, [wide]);
  const visibleWorkspaces = new Set(catalog.map(w => w.workspaceId)); const visibleSessions = new Set(catalog.flatMap(w => w.sessions.map(s => s.id)));
  const tags = [...new Set([...state.folders.filter(f => visibleWorkspaces.has(f.workspaceId)), ...Object.entries(state.sessions).filter(([id]) => visibleSessions.has(id)).map(([, s]) => s)].flatMap(i => i.tags))].sort();
  const busy = runtime.loading || runtime.saving || nativeBusy;
  const toggle = id => setCollapsed(s => ({ ...s, [id]: !s[id] }));
  const mutate = async op => { try { await controller.mutate(op); setNotice('已保存'); } catch (e) { setNotice(e.message); } };
  const newFolder = (workspaceId, parentId) => { setCollapsed(s => ({ ...s, [parentId ?? workspaceId]: false })); setEditor({ kind: 'folder', create: true, workspaceId, parentId }); };
  const showMenu = (event, target, pointer = false) => {
    event.preventDefault(); event.stopPropagation(); if (busy) return;
    const trigger = event.currentTarget; const rect = trigger.getBoundingClientRect();
    const anchor = pointer && (event.clientX || event.clientY) ? { x: event.clientX, y: event.clientY } : { x: rect.right, y: rect.bottom + 6, top: rect.top, align: 'end' };
    setMenu({ ...target, anchor, trigger });
  };
  const requestRemoval = target => { setDeleteError(''); setDeletion(target); setMenu(null); };
  const archive = async target => {
    setMenu(null); setNativeBusy(true);
    try { await archiveSession(target.id); setUndoArchive({ id: target.id, title: target.title }); setNotice('会话已归档'); }
    catch (e) { setNotice(e.rpcError?.code === 'workspace/session-active' ? '此会话仍有工作正在进行，请先停止后再归档。' : e.message); }
    finally { setNativeBusy(false); }
  };
  const runSessionAction = async (action, message) => {
    setMenu(null); setNativeBusy(true);
    try { await action(); setNotice(message); } catch (e) { setNotice(e.message); } finally { setNativeBusy(false); }
  };
  const fork = async target => {
    setMenu(null); setNativeBusy(true);
    try {
      const childId = await forkSession(target.id);
      if (!childId) throw new Error('原生分叉没有返回新会话 ID');
      const folderId = state.sessions[target.id]?.folderId;
      let message = '已创建分叉会话';
      if (folderId) {
        try { await controller.mutate({ type:'session.move', id:childId, workspaceId:target.workspaceId, folderId }); }
        catch (e) { message = `已创建分叉，但目录归类未保存：${e.message}`; }
      }
      setNotice(message); openSession(childId);
    } catch (e) {
      setNotice(e.rpcError?.code === 'session/migration-required' ? '请先打开此会话，完成原生迁移后再分叉' : e.rpcError?.code === 'session/fork-unavailable' ? '该会话还没有可供分叉的完整轮次' : e.message);
    } finally { setNativeBusy(false); }
  };
  const beginSession = async (workspaceId, folderId = null) => {
    setMenu(null); setNativeBusy(true);
    try { await createSession(workspaceId, folderId); } catch (error) { setNotice(error.message); } finally { setNativeBusy(false); }
  };
  const addWorkspace = async () => {
    setNativeBusy(true);
    try { const workspace = await createWorkspace(); if (workspace) setCollapsed(s => ({...s,[workspace.workspaceId]:false})); } catch (error) { setNotice(error.message); } finally { setNativeBusy(false); }
  };
  const match = (item, title) => (!query || `${title} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())) && (filter !== 'starred' || item.starred) && (statusFilter === 'all' || item.status === statusFilter) && (!tagFilter || item.tags.includes(tagFilter)) && (colorFilter === 'all' || item.color === colorFilter);
  const filtered = query || filter === 'starred' || statusFilter !== 'all' || tagFilter || colorFilter !== 'all';
  const total = catalog.reduce((sum, w) => sum + w.sessions.length, 0);
  const beginDrag = (event, item) => { dragged.current = item; event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData(DRAG_TYPE, JSON.stringify(item)); setNotice('拖到目录内归类，拖到行间调整顺序'); };
  const dropTarget = (event, target) => {
    event.stopPropagation(); const source = dragged.current;
    if (catalog.find(w => w.workspaceId === target.workspaceId)?.allowFolders === false) return;
    if (busy || filtered || !source || source.workspaceId !== target.workspaceId || source.id === target.id) return;
    if (source.kind === 'folder' && target.kind === 'folder' && isDescendant(target.id, source.id, state)) return;
    if (source.kind === 'folder' && target.kind === 'session') return;
    event.preventDefault(); event.dataTransfer.dropEffect = 'move';
    const rect = event.currentTarget.getBoundingClientRect(); const ratio = (event.clientY - rect.top) / rect.height;
    let position = target.kind === 'workspace' ? 'inside' : ratio < .25 ? 'before' : target.kind === 'folder' && ratio < .75 ? 'inside' : 'after';
    dropRef.current = { ...target, position }; setDrop(dropRef.current);
  };
  const commitDrop = event => {
    event.preventDefault(); event.stopPropagation(); const source = dragged.current; const target = dropRef.current;
    setDrop(null); dropRef.current = null; dragged.current = null;
    if (!source || !target || source.workspaceId !== target.workspaceId) return;
    let parentId = target.kind === 'workspace' ? null : target.kind === 'folder' && target.position === 'inside' ? target.id : target.parentId;
    let beforeId = null;
    if (target.position !== 'inside' && source.kind === target.kind) {
      const siblings = source.kind === 'folder' ? state.folders.filter(f => f.workspaceId === target.workspaceId && f.parentId === parentId).sort((a, b) => a.order - b.order).map(f => f.id) : sessionChildren(target.workspaceId, parentId).map(s => s.id);
      beforeId = target.position === 'before' ? target.id : siblings[siblings.indexOf(target.id) + 1] ?? null;
    }
    if (source.kind === 'folder') mutate({ type: 'folder.move', id: source.id, parentId, beforeId });
    else mutate({ type: 'session.move', id: source.id, workspaceId: source.workspaceId, folderId: parentId, beforeId });
    setCollapsed(c => ({ ...c, [parentId ?? source.workspaceId]: false }));
  };
  const sessionChildren = (workspaceId, folderId) => {
    const workspace = catalog.find(w => w.workspaceId === workspaceId);
    return (workspace?.sessions ?? []).filter(s => {
      const record = state.sessions[s.id];
      const assigned = record?.workspaceId === workspaceId && state.folders.some(f => f.id === record.folderId && f.workspaceId === workspaceId) ? record.folderId : null;
      return assigned === folderId;
    }).map((s, index) => ({ ...s, meta: state.sessions[s.id]?.workspaceId === workspaceId ? state.sessions[s.id] : defaultMeta(), rank: state.sessions[s.id]?.workspaceId === workspaceId ? state.sessions[s.id].order : index })).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || a.rank - b.rank);
  };
  const childFolders = (workspaceId, parentId) => state.folders.filter(f => f.workspaceId === workspaceId && f.parentId === parentId).sort((a, b) => a.order - b.order);
  const folderMatches = (folder, depth = 0) => depth <= 64 && (match(folder, folder.name) || sessionChildren(folder.workspaceId, folder.id).some(s => match(s.meta, s.title)) || childFolders(folder.workspaceId, folder.id).some(f => folderMatches(f, depth + 1)));
  const keyboard = event => {
    if (event.target !== event.currentTarget) return;
    const rows = [...treeRef.current.querySelectorAll('[role="treeitem"]')].filter(row => !row.closest('[inert]')); const index = rows.indexOf(event.currentTarget);
    const key = event.key;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(key)) event.preventDefault();
    if (key === 'ArrowDown') rows[Math.min(index + 1, rows.length - 1)]?.focus();
    if (key === 'ArrowUp') rows[Math.max(0, index - 1)]?.focus();
    if (key === 'Home') rows[0]?.focus(); if (key === 'End') rows.at(-1)?.focus();
    if (key === 'ArrowRight') { if (event.currentTarget.getAttribute('aria-expanded') === 'false') event.currentTarget.click(); else rows[index + 1]?.focus(); }
    if (key === 'ArrowLeft') {
      if (event.currentTarget.getAttribute('aria-expanded') === 'true') event.currentTarget.click();
      else { const level = +event.currentTarget.getAttribute('aria-level'); rows.slice(0, index).reverse().find(r => +r.getAttribute('aria-level') < level)?.focus(); }
    }
    if (key === 'Enter' || key === ' ') { event.preventDefault(); event.currentTarget.click(); }
    if (key === 'F2') { event.preventDefault(); const node = event.currentTarget; if (node.dataset.kind !== 'workspace' && catalog.find(w => w.workspaceId === node.dataset.workspace)?.allowFolders !== false) setEditor({ kind: node.dataset.kind, id: node.dataset.id, workspaceId: node.dataset.workspace, title: node.querySelector('.lg-row-text>span').textContent }); }
    if (key === 'Delete' && event.currentTarget.dataset.kind === 'folder') { event.preventDefault(); requestRemoval({ kind: 'folder', id: event.currentTarget.dataset.id, title: event.currentTarget.querySelector('.lg-row-text>span').textContent }); }
  };
  const row = ({ item, kind, level, parentId, expanded, count, children, title, meta = defaultMeta() }) => {
    const target = { id: item.id, kind, workspaceId: item.workspaceId, parentId, pinned: !!item.pinned };
    const isActive = kind === 'session' && activeId === item.id;
    const editable = catalog.find(w => w.workspaceId === item.workspaceId)?.allowFolders !== false;
    return <React.Fragment key={item.id}><div role="treeitem" aria-level={level} aria-expanded={kind === 'session' ? undefined : expanded} aria-selected={isActive} tabIndex={0} data-id={item.id} data-kind={kind} data-workspace={item.workspaceId}
      className={`lg-tree-row ${isActive ? 'is-active' : ''} ${drop?.id === item.id ? `drop-${drop.position}` : ''} ${kind === 'workspace' ? 'lg-workspace-row' : ''}`}
      style={{ '--depth': level - 1, '--row-color': COLORS[meta.color] }} onKeyDown={keyboard}
      draggable={editable && kind !== 'workspace' && !busy && !filtered} onDragStart={e => beginDrag(e, target)} onDragEnd={() => { dragged.current = null; dropRef.current = null; setDrop(null); }} onDragOver={e => dropTarget(e, target)} onDrop={commitDrop}
      onContextMenu={e => { if (editable) showMenu(e, { ...target, title }, true); }}
      onClick={() => { if (kind === 'session') openSession(item.id); else if (filtered) setNotice('清除筛选后可折叠与排序目录'); else toggle(item.id); }}>
      {kind === 'session' && <span className="lg-hover-underline" aria-hidden="true"/>}
      <span className={`lg-chevron ${expanded ? 'is-open' : ''}`}>{kind !== 'session' && <Icon name="chevron" size={11}/>}</span>
      <span className={`lg-row-icon ${meta.icon ? 'has-emoji' : ''}`}>{meta.icon || <Icon name={kind === 'workspace' ? 'book' : kind === 'session' ? 'chat' : 'folder'}/>}</span>
      <span className="lg-row-text"><span>{title}</span>{meta.tags.length > 0 && <small>{meta.tags.map(t => `#${t}`).join('  ')}</small>}</span>
      {item.pinned && kind === 'session' && <Icon name="pin" size={12} className="lg-pin"/>}
      {meta.starred && <Icon name="star" size={11} className="lg-star"/>}
      {meta.status !== 'none' && <span className={`lg-status lg-status-${meta.status}`} title={`手动状态：${STATUSES[meta.status]}`} aria-label={`手动状态：${STATUSES[meta.status]}`}/>}
      {count != null && <span className="lg-count">{count}</span>}
      {editable && <span className="lg-row-actions">{kind !== 'session' && <button className="lg-icon-button" disabled={busy} title="新建子目录" aria-label={`在 ${title} 下新建子目录`} onClick={e => { e.stopPropagation(); newFolder(item.workspaceId, kind === 'workspace' ? null : item.id); }}><Icon name="plus" size={14}/></button>}
      <button data-edit className="lg-icon-button" title="更多操作 · 右键" aria-label={`${title} 的更多操作`} disabled={busy} onClick={e => showMenu(e, { ...target, title })}><Icon name="more" size={15}/></button></span>}
    </div>{kind !== 'session' && <div role="group" className={`lg-branch ${expanded ? '' : 'is-collapsed'}`} aria-hidden={!expanded} inert={!expanded ? '' : undefined}><div className="lg-branch-inner">{children}</div></div>}</React.Fragment>;
  };
  const branch = (workspaceId, parentId, level) => {
    if (level > 65) return null;
    const sessions = sessionChildren(workspaceId, parentId).filter(s => !filtered || match(s.meta, s.title));
    const renderSession = s => row({ item: { ...s, workspaceId }, kind: 'session', level, parentId, title: s.title || '新会话', meta: s.meta });
    return <>{sessions.filter(s => s.pinned).map(renderSession)}{childFolders(workspaceId, parentId).filter(f => !filtered || folderMatches(f)).map(f => {
      const expanded = !!filtered || !collapsed[f.id]; const count = sessionChildren(workspaceId, f.id).length;
      return row({ item: f, kind: 'folder', level, parentId, title: f.name, meta: f, expanded, count, children: branch(workspaceId, f.id, level + 1) });
    })}{sessions.filter(s => !s.pinned).map(renderSession)}</>;

  };
  const clearFilters = () => { setQuery(''); setFilter('all'); setStatusFilter('all'); setTagFilter(''); setColorFilter('all'); };
  if (!wide) return <RailMenu state={state} catalog={catalog} activeId={activeId} openSession={openSession} createSession={createSession} createWorkspace={createWorkspace} onNativeView={onNativeView} error={runtime.error}/>;
  return <section data-density={state.preferences.density} data-show-tags={state.preferences.showTags} data-show-counts={state.preferences.showCounts} className="lg-tree" aria-label="工作区与会话目录">
    <div className="lg-tree-heading"><span>我的工作区</span><div>{createWorkspace && <button className="lg-icon-button" aria-label="添加工作区" title="添加工作区" disabled={busy} onClick={addWorkspace}><Icon name="plus"/></button>}<button className="lg-icon-button" aria-label="搜索目录与会话" aria-expanded={searchOpen} onClick={() => { setSearchOpen(!searchOpen); if (searchOpen) setQuery(''); }}><Icon name="search" size={14}/></button><button className={`lg-icon-button ${filtersOpen ? 'is-on' : ''}`} aria-label="筛选目录与会话" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><Icon name="sliders"/></button><button className="lg-icon-button" aria-label="刷新目录" title="刷新目录" disabled={busy} onClick={() => controller.refresh()}><span className="lg-refresh">↻</span></button></div></div>
    {searchOpen && <label className="lg-search"><Icon name="search" size={14}/><input aria-label="搜索目录、会话或标签" autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索目录、会话或标签"/>{query && <button className="lg-icon-button" aria-label="清除搜索" onClick={() => setQuery('')}><Icon name="close" size={12}/></button>}</label>}
    <div className="lg-segments"><button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>全部会话 <span>{total}</span></button><button aria-pressed={filter === 'starred'} onClick={() => setFilter('starred')}><Icon name="star" size={12}/>收藏</button></div>
    {filtersOpen && <div className="lg-filters"><select aria-label="按手动状态筛选" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="all">全部状态</option>{Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select><select aria-label="按标签筛选" value={tagFilter} onChange={e => setTagFilter(e.target.value)}><option value="">全部标签</option>{tags.map(tag => <option key={tag}>{tag}</option>)}</select><select aria-label="按颜色筛选" value={colorFilter} onChange={e => setColorFilter(e.target.value)}><option value="all">全部颜色</option>{Object.keys(COLORS).map(c => <option value={c} key={c}>{({ default: '灰色', blue: '蓝色', purple: '紫色', pink: '粉色', orange: '橙色', green: '绿色', teal: '青色' })[c]}</option>)}</select></div>}
    {filtered && <button className="lg-clear-filter" onClick={clearFilters}>清除筛选 · 恢复完整目录</button>}
    <div ref={treeRef} role="tree" aria-label="会话目录树" aria-busy={busy} className="lg-tree-list">
      {catalog.map(w => {
        const expanded = !!filtered || !collapsed[w.workspaceId];
        return row({ item: { id: w.workspaceId, workspaceId: w.workspaceId }, kind: 'workspace', level: 1, parentId: null, title: w.title, expanded, count: w.sessions.length, children: <>{branch(w.workspaceId, null, 2)}{!filtered && w.sessions.length === 0 && childFolders(w.workspaceId, null).length === 0 && <p className="lg-empty-inline">在这里新建目录，整理你的会话</p>}{w.allowFolders !== false && <button className="lg-new-session" disabled={busy} onClick={() => beginSession(w.workspaceId)}><Icon name="plus" size={13}/>新建会话</button>}</> });
      })}
      {!catalog.length && !runtime.loading && <div className="lg-empty"><Icon name="book" size={26}/><p>还没有工作区</p><small>选择本机目录，建立你的工作区。</small>{createWorkspace ? <button className="lg-secondary" disabled={busy} onClick={addWorkspace}>添加工作区</button> : onNativeView && <button className="lg-secondary" onClick={onNativeView}>打开原始目录</button>}</div>}
    </div>
    {(runtime.error || notice) && <div className="lg-tree-bottom"><span role={runtime.error ? 'alert' : 'status'}>{runtime.loading ? '正在读取目录…' : runtime.saving ? '正在保存…' : runtime.error || notice}</span>{runtime.error && <button className="lg-text-button" onClick={() => controller.refresh()}>重试</button>}</div>}
    {undoArchive && unarchiveSession && <div className="lg-undo"><span>已归档：{undoArchive.title}</span><button className="lg-text-button" disabled={busy} onClick={async () => { setNativeBusy(true); try { await unarchiveSession(undoArchive.id); setUndoArchive(null); setNotice('已恢复会话'); } catch (e) { setNotice(e.message); } finally { setNativeBusy(false); } }}>撤销</button></div>}
    {menu && <RowMenu menu={menu} close={() => setMenu(null)}>
      {menu.kind === 'session' && <>
        {renameSession && <button role="menuitem" onClick={() => { setWorkspaceRename(menu); setMenu(null); }}><Icon name="edit"/>重命名会话</button>}
        {pinSession && unpinSession && <button role="menuitem" onClick={() => runSessionAction(() => menu.pinned ? unpinSession(menu.id) : pinSession(menu.id), menu.pinned ? '已取消置顶' : '已在原目录内置顶')}><Icon name="pin"/>{menu.pinned ? '取消置顶' : '置顶会话'}</button>}
        {forkSession && <button role="menuitem" onClick={() => fork(menu)}><Icon name="fork"/>分叉会话</button>}
        {copySessionId && <button role="menuitem" onClick={() => runSessionAction(() => copySessionId(menu.id), '已复制 Session ID')}><Icon name="copy"/>复制 Session ID</button>}
        <hr/>
      </>}
      {menu.kind === 'folder' && <button role="menuitem" onClick={() => { setWorkspaceRename(menu); setMenu(null); }}><Icon name="edit"/>重命名目录</button>}
      {menu.kind !== 'workspace' && <button role="menuitem" onClick={() => { setEditor(menu); setMenu(null); }}><Icon name="sliders"/>标记与移动<small>F2</small></button>}
      {menu.kind !== 'session' && createSession && <button role="menuitem" onClick={() => beginSession(menu.workspaceId, menu.kind === 'folder' ? menu.id : null)}><Icon name="chat"/>新建会话</button>}
      {menu.kind !== 'session' && <button role="menuitem" onClick={() => { newFolder(menu.workspaceId, menu.kind === 'workspace' ? null : menu.id); setMenu(null); }}><Icon name="plus"/>新建子目录</button>}
      {menu.kind === 'workspace' && renameWorkspace && <button role="menuitem" onClick={() => { setWorkspaceRename(menu); setMenu(null); }}><Icon name="edit"/>重命名工作区</button>}
      {menu.kind === 'workspace' && onNativeView && <button role="menuitem" onClick={() => { setMenu(null); onNativeView(); }}><Icon name="book"/>返回默认</button>}
      {menu.kind === 'session' && archiveSession && <><hr/><button role="menuitem" onClick={() => archive(menu)}><Icon name="archive"/>归档会话</button></>}
      {(menu.kind === 'folder' || menu.kind === 'workspace' && removeWorkspace) && <><hr/><button role="menuitem" className="lg-danger" onClick={() => requestRemoval(menu)}><Icon name="trash"/>{menu.kind === 'folder' ? '删除目录' : '移除工作区'}</button></>}
    </RowMenu>}
    {deletion && <Modal title={`${deletion.kind === 'workspace' ? '移除工作区' : '删除目录'}“${deletion.title}”？`} close={() => { if (!deleting) setDeletion(null); }}><p className="lg-delete-description">{deletion.kind === 'workspace' ? '从工作区列表移除此项，磁盘文件、聊天记录及目录标记保留。会话仍可在原生工作区管理中查看。' : '仅删除此目录。直接子目录和会话将移到上一级，聊天记录与标记保留。'}</p>{deleteError && <p role="alert" className="lg-error">{deleteError}</p>}<div className="lg-confirm-footer"><button className="lg-secondary" disabled={deleting} onClick={() => setDeletion(null)}>取消</button><button className="lg-delete-confirm" disabled={deleting} onClick={async () => { setDeleting(true); setDeleteError(''); try { if (deletion.kind === 'workspace') await removeWorkspace(deletion.id); else await controller.mutate({ type: 'folder.delete', id: deletion.id }); setDeletion(null); setNotice(deletion.kind === 'workspace' ? '工作区已移除，文件和聊天记录保留' : '目录已删除，会话已保留'); } catch (e) { setDeleteError(e.message); } finally { setDeleting(false); } }}>{deleting ? '正在处理…' : deletion.kind === 'workspace' ? '确认移除工作区' : '确认删除目录'}</button></div></Modal>}
    {workspaceRename && <NameEditor target={workspaceRename} rename={workspaceRename.kind === 'folder' ? (id, name) => controller.mutate({ type: 'folder.rename', id, name }) : workspaceRename.kind === 'session' ? renameSession : renameWorkspace} close={() => setWorkspaceRename(null)}/>}
    {editor && <Editor key={`${editor.id ?? 'new'}-${editor.parentId}`} editor={editor} state={state} controller={controller} close={() => setEditor(null)}/>}
  </section>;
}
