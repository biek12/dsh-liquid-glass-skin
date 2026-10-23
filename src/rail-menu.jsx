import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from './ui.jsx';
import { COLORS, orderedWorkspaces } from './model.js';
import { placeMenu } from './menu.jsx';

/** Project only catalog-owned primary sessions; the quick menu never changes classification. */
export function railChildren(state, catalog, parent) {
  if (!parent) return orderedWorkspaces(catalog, state).map(w => ({kind:'workspace',id:w.workspaceId,title:w.title,workspaceId:w.workspaceId,count:w.sessions.length}));
  const workspace = catalog.find(w => w.workspaceId === parent.workspaceId); if (!workspace) return [];
  const folderId = parent.kind === 'workspace' ? null : parent.id;
  const folders = state.folders.filter(f => f.workspaceId === workspace.workspaceId && f.parentId === folderId).sort((a,b) => a.order-b.order).map(f => ({...f,kind:'folder',title:f.name}));
  const sessions = workspace.sessions.filter(s => (state.sessions[s.id]?.workspaceId === workspace.workspaceId ? state.sessions[s.id].folderId : null) === folderId)
    .map((s,index) => ({...s,kind:'session',workspaceId:workspace.workspaceId,order:state.sessions[s.id]?.order ?? index}))
    .sort((a,b) => Number(!!b.pinned)-Number(!!a.pinned) || a.order-b.order);
  return [...sessions.filter(s=>s.pinned),...folders,...sessions.filter(s=>!s.pinned)];
}
export function RailMenu({ state, catalog, activeId, openSession, createSession, createWorkspace, onNativeView, error }) {
  const [open,setOpen]=useState(false), [path,setPath]=useState([]), [anchor,setAnchor]=useState({x:0,y:0});
  const [working,setWorking]=useState(false),[failure,setFailure]=useState(''); const pinnedOpen=useRef(false);
  const trigger=useRef(), popup=useRef(), delay=useRef(), hover=useRef(), focusNext=useRef(null);
  const maxColumns=Math.max(1,Math.min(3,Math.floor(((typeof window === 'undefined' ? 800 : window.innerWidth)-16)/244)));
  const columns=[{parent:null,rows:railChildren(state,catalog,null)}];
  for(const entry of path){const parent=columns.at(-1).rows.find(row=>row.id===entry && row.kind!=='session');if(!parent)break;columns.push({parent,rows:railChildren(state,catalog,parent)});}
  const first=Math.max(0,columns.length-maxColumns); const visible=columns.slice(first);
  const cancelClose=()=>clearTimeout(delay.current);
  const close=(restore=false)=>{ pinnedOpen.current=false; clearTimeout(hover.current); cancelClose(); setOpen(false); if(restore)trigger.current?.focus(); };
  const scheduleClose=()=>{ if(pinnedOpen.current)return; clearTimeout(hover.current); cancelClose(); delay.current=setTimeout(()=>close(),320); };
  const show=(keyboard=false)=>{ if(keyboard)pinnedOpen.current=true; cancelClose();const box=trigger.current.getBoundingClientRect();setAnchor({x:box.right+8,y:box.top,top:box.top});if(!open)setPath([]);focusNext.current=keyboard?0:null;setOpen(true);};
  const descend=(row,level,keyboard=false)=>{clearTimeout(hover.current);if(row.kind==='session'){setPath(path.slice(0,level));return;}focusNext.current=keyboard?level+1:null;setPath([...path.slice(0,level),row.id]);};
  useEffect(()=>()=>{clearTimeout(delay.current);clearTimeout(hover.current);},[]);
  useLayoutEffect(()=>{
    if(!open)return;const node=popup.current;node.showPopover?.();
    const position=placeMenu(anchor,{width:node.offsetWidth,height:node.offsetHeight},{width:window.innerWidth,height:window.innerHeight});
    node.style.left=`${position.x}px`;node.style.top=`${position.y}px`;
    if(focusNext.current!==null){node.querySelector(`[data-level="${focusNext.current}"] [role="menuitem"]`)?.focus({preventScroll:true});focusNext.current=null;}
  },[open,anchor,path,catalog,state]);
  useEffect(()=>{
    if(!open)return;const dismiss=e=>{if(!popup.current?.contains(e.target)&&!trigger.current.contains(e.target))close();};
    const resize=()=>close();document.addEventListener('pointerdown',dismiss,true);window.addEventListener('resize',resize);
    return()=>{document.removeEventListener('pointerdown',dismiss,true);window.removeEventListener('resize',resize);};
  },[open]);
  const run = async (action, reopenRoot = false) => { if(working)return; close(); setWorking(true); setFailure(''); try { const result = await action(); if (reopenRoot && result) { setPath([]); show(true); } } catch(error){ setFailure(error.message); setPath([]); show(true); } finally {setWorking(false);} };
  const back=(level,keyboard=false)=>{focusNext.current=keyboard?Math.max(0,level-1):null;setPath(path.slice(0,Math.max(0,level-1)));};
  const keyboard=(event,level,row)=>{
    const key=event.key;
    if(key==='Escape'){event.preventDefault();event.stopPropagation();close(true);return;}
    if(key==='Tab'){close();return;}
    if(key==='ArrowRight'&&row&&row.kind!=='session'){event.preventDefault();descend(row,level,true);return;}
    if(key==='ArrowLeft'){event.preventDefault();if(level)back(level,true);else close(true);return;}
    if(!['ArrowDown','ArrowUp','Home','End'].includes(key))return;
    event.preventDefault();const buttons=[...event.currentTarget.closest('.lg-cascade-column').querySelectorAll('[role="menuitem"]:not(:disabled)')];const i=buttons.indexOf(document.activeElement);
    buttons[key==='Home'?0:key==='End'?buttons.length-1:(i+(key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();
  };
  return <section className="lg-workspace-rail" aria-busy={working} aria-label="工作区快捷菜单">
    <button ref={trigger} className="lg-rail-button" aria-label="浏览工作区与会话" aria-haspopup="menu" aria-expanded={open} title={failure || "浏览工作区与会话"} disabled={working} onPointerEnter={()=>show()} onPointerLeave={scheduleClose} onClick={()=>show(true)} onKeyDown={e=>{if(['ArrowDown','ArrowRight'].includes(e.key)){e.preventDefault();show(true);}}}><Icon name="book" size={20}/>{(error||failure)&&<i className="lg-rail-error"/>}</button>
    {open&&<div ref={popup} popover="manual" className="lg-cascade" aria-label="工作区悬浮目录" onPointerEnter={cancelClose} onPointerLeave={scheduleClose}>
      {visible.map(({parent,rows},index)=>{const level=first+index;return <section className="lg-cascade-column" data-level={level} key={parent?.id??'root'}>
        <header>{level>0&&<button aria-label="返回上一级目录" onClick={()=>back(level)}><Icon name="chevron" size={12}/></button>}<span title={parent?.title}>{parent?.title??'我的工作区'}</span>{first>0&&index===0&&<button aria-label="返回全部工作区" onClick={()=>setPath([])}><Icon name="book" size={13}/></button>}</header>
        <div role="menu" aria-label={parent?`${parent.title} 的目录与会话`:'工作区列表'} className="lg-cascade-list">
          {rows.map(row=><button key={row.id} role="menuitem" data-cascade-id={row.id} aria-current={row.kind==='session'&&row.id===activeId?'page':undefined} aria-haspopup={row.kind!=='session'?'menu':undefined} aria-expanded={row.kind!=='session'?path[level]===row.id:undefined} className={path[level]===row.id?'is-open':''} title={row.title||'新会话'} onPointerEnter={()=>{clearTimeout(hover.current);hover.current=setTimeout(()=>descend(row,level),140);}} onKeyDown={e=>keyboard(e,level,row)} onClick={()=>{if(row.kind==='session'){close();openSession(row.id);}else descend(row,level,true);}}>
            <span style={{color:COLORS[row.color]??'var(--lg-muted)'}}><Icon name={row.kind==='workspace'?'book':row.kind==='folder'?'folder':'chat'}/></span><span>{row.title||'新会话'}</span>{row.pinned&&<Icon name="pin" size={11}/>} {row.kind!=='session'&&<Icon name="chevron" size={11}/>}</button>)}
          {!rows.length&&<p className="lg-cascade-empty">这里还没有目录或会话</p>}
        </div>
        {parent&&createSession&&<footer><button role="menuitem" onKeyDown={e=>keyboard(e,level)} disabled={working} onClick={()=>run(()=>createSession(parent.workspaceId,parent.kind==='folder'?parent.id:null))}><Icon name="plus" size={14}/>新建会话</button></footer>}
        {!parent&&<footer>{failure&&<p role="alert" className="lg-cascade-error">{failure}</p>}{createWorkspace&&<button role="menuitem" disabled={working} onKeyDown={e=>keyboard(e,level)} onClick={()=>run(createWorkspace,true)}><Icon name="plus" size={14}/>添加工作区</button>}{onNativeView&&<><button role="menuitem" onKeyDown={e=>keyboard(e,level)} onClick={()=>{close();onNativeView();}}><Icon name="folder" size={14}/>返回默认</button></>}</footer>}
      </section>;})}
    </div>}
  </section>;
}
