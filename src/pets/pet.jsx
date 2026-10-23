import React, { useEffect, useRef, useState } from 'react';
import { useSource } from '../ui.jsx';
import { PETS } from './catalog.js';
import css from './pet.css';
import { PetSprite } from './animation.jsx';
import { CloudBubble } from './cloud.jsx';
import { countdown, officialRate } from './billing.js';
import { useBalance } from './use-balance.js';
import { formatBalance } from './balance.js';
import { desktopRequest } from './desktop-client.js';

export { css as petCss };
const clamp = value => Math.max(0, Math.min(1, value));
const viewport = () => ({ width: window.innerWidth, height: window.innerHeight });

export function PetSettings({ controller }) {
  const { state, saving, loading } = useSource(controller); const p = state.preferences;
  const [error, setError] = useState('');
  const [desktopStatus, setDesktopStatus] = useState(null), [switching, setSwitching] = useState(false);
  useEffect(() => { let current=true; desktopRequest().then(value=>{if(current)setDesktopStatus(value);},()=>{}); return ()=>{current=false;}; }, []);
  const save = patch => controller.mutate({ type: 'preferences', patch }).then(() => setError('')).catch(e => setError(e.message));
  const chooseDesktop = async enabled => { setSwitching(true); try { await desktopRequest(enabled?'start':'stop'); await controller.mutate({type:'preferences',patch:{petDesktop:enabled}}); setError(''); } catch(e) { if(enabled) desktopRequest('stop').catch(()=>{}); setError(e.message); } finally { setSwitching(false); } };
  return <fieldset className="lg-pet-settings"><legend>陪伴宠物</legend>
    <label className="lg-setting-row"><span>显示宠物<small>鼠标悬停或点击查看宠物的回应与账户信息。</small></span><input type="checkbox" checked={p.petEnabled} disabled={saving || loading} onChange={e => save({ petEnabled: e.target.checked, ...(!e.target.checked ? {petDesktop:false} : {}) })}/></label>
    <label className="lg-setting-row"><span>全桌面陪伴<small>{desktopStatus?.supported ? '独立透明窗口，支持置顶与跨屏拖动；关闭 DSH 后结束。' : '需在 macOS 的 DSH 中加载桌面伴随模块。'}</small></span><input type="checkbox" aria-label="全桌面陪伴" checked={p.petDesktop} disabled={saving || loading || switching || !p.petEnabled || !desktopStatus?.supported} onChange={e=>chooseDesktop(e.target.checked)}/></label>
    <label className="lg-setting-row"><span>任务完成气泡<small>完成时提醒，30 秒内合并；提示会自动收起。</small></span><input type="checkbox" checked={p.petNotify} disabled={saving || loading} onChange={e => save({petNotify:e.target.checked})}/></label>
    <label className="lg-setting-row"><span>完成提示音<small>每批任务轻响一次，多个会话完成时不连响。</small></span><input type="checkbox" checked={p.petSound} disabled={saving || loading || !p.petNotify} onChange={e => save({petSound:e.target.checked})}/></label>
    <div className="lg-pet-choices" role="group" aria-label="选择宠物形象">{PETS.map(pet => <button type="button" key={pet.id} aria-pressed={p.petCharacter === pet.id} disabled={saving || loading} onClick={() => save({ petCharacter: pet.id })}><img src={pet.image} alt=""/><strong>{pet.name}</strong><small>{pet.subtitle}</small></button>)}</div>
    <label className="lg-setting-row"><span>宠物大小<small>透明素材随界面缩放，位置自动保持在可见范围。</small></span><select value={p.petSize} disabled={saving || loading} onChange={e => save({ petSize: e.target.value })}><option value="96">小巧</option><option value="120">标准</option><option value="156">大号</option></select></label>
    <button type="button" className="lg-secondary" disabled={saving || loading} onClick={async () => { await save({ petX: 0.92, petY: 0.86, petEnabled: true }); if(p.petDesktop)desktopRequest('recover').catch(e=>setError(e.message)); }}>找回宠物</button>
    {error && <p role="alert">{error}</p>}
  </fieldset>;
}

const emptyContext = {};
const absentCompletions = { subscribe: () => () => {}, getSnapshot: () => null };
const absentContext = { subscribe: () => () => {}, getSnapshot: () => emptyContext };
export function FloatingPet({ controller, account, context, completions, desktop = false }) {
  const insight = useSource(context ?? absentContext);
  const completionBatch = useSource(completions ?? absentCompletions);
  const [notice, setNotice] = useState(null);
  const runtime = useSource(controller); const p = runtime.state.preferences;
  const pet = PETS.find(item => item.id === p.petCharacter) ?? PETS[0];
  const [screen, setScreen] = useState(viewport); const [dragPosition, setDragPosition] = useState(null);
  const [open, setOpen] = useState(false); const [error, setError] = useState('');
  const balance = useBalance(account, open); const drag = useRef(null); const cardTimer = useRef(); const alive = useRef(true);
  const [greeting, setGreeting] = useState(0);
  const [dragging, setDragging] = useState(false), [landing, setLanding] = useState(false), [velocity, setVelocity] = useState(0), [dragCount, setDragCount] = useState(0);
  const landTimer = useRef(), velocityTimer = useRef();
  const [nativePosition, setNativePosition] = useState({ x: 150, y: 376 });
  const nativeSend = value => window.webkit?.messageHandlers?.pet?.postMessage(value);
  useEffect(() => {
    if (!desktop) return;
    const update = event => {
      const value=event.detail;
      if(value.kind==='position')setNativePosition({x:value.x,y:value.y});
      if(value.kind==='drag'&&value.active){if(drag.current)drag.current.moved=true;setDragging(true);setLanding(false);setDragCount(n=>n+1);setOpen(false);clearTimeout(landTimer.current);}
      if(value.kind==='drag'&&!value.active){drag.current=null;released();}
      if(value.kind==='velocity')setVelocity(value.value);
    };
    window.addEventListener('pet-native',update);nativeSend({kind:'ready'});
    return ()=>window.removeEventListener('pet-native',update);
  }, [desktop]);
  useEffect(()=>{if(desktop)nativeSend({kind:'size',value:Number(p.petSize)});},[desktop,p.petSize]);
  const [visible, setVisible] = useState(!document.hidden);
  const [clock, setClock] = useState(Date.now);
  const rate = officialRate(new Date(clock));
  useEffect(() => { if (!open || !visible) return; setClock(Date.now()); const timer = setInterval(() => setClock(Date.now()), 1000); return () => clearInterval(timer); }, [open, visible]);
  useEffect(() => { const sync = () => setVisible(!document.hidden); document.addEventListener('visibilitychange', sync); return () => document.removeEventListener('visibilitychange', sync); }, []);
  const size = Math.min(Number(p.petSize), Math.max(48, screen.width - 16), Math.max(48, screen.height - 16));
  const spaceX = Math.max(0, screen.width - size - 16); const spaceY = Math.max(0, screen.height - size - 16);
  const position = dragPosition ?? { x: p.petX, y: p.petY };
  const save = patch => controller.mutate({ type: 'preferences', patch }).then(() => { if (alive.current) setError(''); }).catch(e => { if (alive.current) setError(e.message); });
  useEffect(() => { const resize = () => setScreen(viewport()); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, []);
  useEffect(() => { alive.current = true; return () => { alive.current = false; clearTimeout(cardTimer.current); clearTimeout(landTimer.current); clearTimeout(velocityTimer.current); }; }, []);
  useEffect(() => { if (!p.petEnabled) { setOpen(false);  } }, [p.petEnabled]);
  // A real deadline closes the card in both WebKit panels and regular DSH windows.
  const show = () => {
    if (notice || drag.current) return;
    setGreeting(value => value + 1); setOpen(true);
    clearTimeout(cardTimer.current);
    cardTimer.current = setTimeout(() => setOpen(false), 8000);
  };
  useEffect(() => {
    if (!p.petEnabled || p.petNotify === false || !completionBatch || completionBatch.expiresAt <= Date.now()) { setNotice(null); return; }
    setNotice(completionBatch); setOpen(false); clearTimeout(cardTimer.current);
    const timer = setTimeout(() => setNotice(null), Math.max(0, completionBatch.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [completionBatch, p.petEnabled, p.petNotify]);
  const released = () => { setDragging(false); setVelocity(0); setLanding(true); clearTimeout(velocityTimer.current); clearTimeout(landTimer.current); landTimer.current = setTimeout(() => setLanding(false), 1600); };
  const x = desktop ? nativePosition.x : 8 + clamp(position.x) * spaceX, y = desktop ? nativePosition.y : 8 + clamp(position.y) * spaceY;
  const anchor = { x: x + size / 2, top: y, bottom: y + size };
  if (!runtime.ready || !p.petEnabled || (p.petDesktop && !desktop)) return null;
  return <div className="lg-pet" data-dragging={dragging} data-motion={p.motion} style={{ left: Math.round(x), top: Math.round(y), width: size, height: size }} onPointerEnter={show}>
    <button type="button" className="lg-pet-body" aria-label={`${pet.name}，拖动移动，点击查看卡片`} aria-expanded={open || !!notice || dragging || landing} aria-controls="lg-pet-card" onFocus={show}
      onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setNotice(null); } if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); save({ petX: clamp(p.petX + (e.key === 'ArrowRight' ? 20 / Math.max(1, spaceX) : e.key === 'ArrowLeft' ? -20 / Math.max(1, spaceX) : 0)), petY: clamp(p.petY + (e.key === 'ArrowDown' ? 20 / Math.max(1, spaceY) : e.key === 'ArrowUp' ? -20 / Math.max(1, spaceY) : 0)) }); } }}
      onClick={e => { if (e.detail === 0) show(); }}
      onPointerDown={e => { if (e.button !== 0) return; drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, origin: position, moved: false, lastX: e.clientX, time: e.timeStamp }; e.currentTarget.setPointerCapture(e.pointerId); if(desktop)nativeSend({kind:'begin'}); }}
      onPointerMove={e => { if(desktop)return; const d = drag.current; if (!d || d.id !== e.pointerId) return; const dx = e.clientX - d.x; const dy = e.clientY - d.y; if (!d.moved && Math.hypot(dx, dy) > 5) { d.moved = true; setDragging(true); setLanding(false); clearTimeout(landTimer.current); setDragCount(n => n + 1); } if (d.moved) { setVelocity(Math.max(-1, Math.min(1, (e.clientX - d.lastX) / Math.max(16, e.timeStamp - d.time)))); d.lastX = e.clientX; d.time = e.timeStamp; clearTimeout(velocityTimer.current); velocityTimer.current = setTimeout(() => setVelocity(0), 120); setOpen(false);  setDragPosition({ x: clamp(d.origin.x + dx / Math.max(1, spaceX)), y: clamp(d.origin.y + dy / Math.max(1, spaceY)) }); } }}
      onPointerUp={e => { const d = drag.current; if (!d || d.id !== e.pointerId) return; drag.current = null; e.currentTarget.releasePointerCapture(e.pointerId); if(desktop){if(!d.moved)show();return;} if (d.moved) { released(); const next = { petX: clamp(d.origin.x + (e.clientX - d.x) / Math.max(1, spaceX)), petY: clamp(d.origin.y + (e.clientY - d.y) / Math.max(1, spaceY)) }; save(next).finally(() => { if (alive.current) setDragPosition(null); }); } else { show(); } }}
      onPointerCancel={() => { if(desktop)return;drag.current = null; setDragging(false); setLanding(false); setVelocity(0); setDragPosition(null); }} onLostPointerCapture={() => { if(desktop)return;if (drag.current) { drag.current = null; released(); setDragPosition(null); } }}>
      <PetSprite pet={pet} state={dragging ? 'drag' : landing ? 'land' : open || notice ? 'hover' : 'idle'} velocity={velocity} motion={p.motion} enabled={visible}/>
    </button>
    <CloudBubble open={dragging || landing || open || !!notice} compact={dragging || landing} contentKey={dragging?`speech:drag:${dragCount}`:landing?`speech:land:${dragCount}`:notice?`notice:${notice.id}:${notice.count}`:`info:${greeting}`} anchor={anchor} screen={screen} label={dragging || landing ? '宠物的回应' : notice ? '任务完成提醒' : '账户与今日用量'}>
      {dragging || landing ? <p className="lg-pet-drag-speech">{dragging ? pet.dragLines[Math.max(0, dragCount - 1) % pet.dragLines.length] : pet.landLines[Math.max(0, dragCount - 1) % pet.landLines.length]}</p> :
      <div className="lg-pet-card" onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setNotice(null); } }}>
      {notice ? <div className="lg-pet-completion" role="status" aria-live="polite">
        <p className="lg-pet-completion-heading">{notice.count === 1 ? '小任务完成啦 ✨' : `${notice.count} 个小任务，做好啦 ✨`}</p>
        {notice.count === 1 ? <p className="lg-pet-completion-message">「{notice.items[0]?.title}」执行完毕啦，成果等你查收～</p> : <><ul>{notice.items.map(item => <li key={item.sessionId}>「{item.title}」{item.count > 1 ? ` · 完成 ${item.count} 次` : '完成啦'}</li>)}</ul><p className="lg-pet-completion-message">{notice.count > notice.items.reduce((sum,item)=>sum+item.count,0) ? '还有其他任务也完成啦，' : ''}辛苦啦，一起伸个懒腰吧～</p></>}
      </div> : <>
      <p className="lg-pet-dialogue" role="status">{pet.lines[greeting % pet.lines.length]}</p>
      <dl><div><dt>账户余额</dt><dd>{formatBalance(balance)}</dd></div>
      <div><dt>今日用量</dt><dd>{insight.todayTokens == null ? '—' : `${insight.todayTokens.toLocaleString()} tokens`}{insight.todayCost && <small>≈{insight.todayCost}</small>}</dd></div>
      {insight.sessionCost && <div><dt>本会话估算</dt><dd>≈{insight.sessionCost}</dd></div>}
      {rate && <div className="lg-pet-period-row"><dt>Flash / Pro</dt><dd data-period={rate.period}><span className="lg-pet-period" data-period={rate.period}>{rate.period === 'peak' ? '高峰' : '谷时'}</span><span className="lg-pet-countdown" title="距离下个计费时段">{countdown(rate.nextSwitch, clock)}</span></dd></div>}</dl>
      </>}
      {error && <p role="alert">{error}</p>}
      </div>}
    </CloudBubble>
  </div>;
}

