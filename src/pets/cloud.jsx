import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { placeBubble } from './bubble-layout.js';

const EXIT_MS=540, TEXT_EXIT_MS=150, MIN_READ_MS=1400;

/** A single presenter owns the cloud; incoming events replace the pending request, never the exiting frame. */
export function CloudBubble({ open, anchor, screen, children, label, id='lg-pet-card', compact=false, contentKey='default' }) {
  const requested=useRef(null), displayed=useRef(null), phaseRef=useRef('hidden');
  const timer=useRef(), frame=useRef(), mounted=useRef(true), enteredAt=useRef(0);
  const [view,setView]=useState(null), [phase,setPhase]=useState('hidden'), [mode,setMode]=useState('full');
  const [height,setHeight]=useState(245), node=useRef(null), layoutRef=useRef(null);
  requested.current={open,children,label,compact,key:contentKey};
  const changePhase=value=>{phaseRef.current=value;setPhase(value);};
  const sameFamily=(a,b)=>a && b && a.compact===b.compact && a.key.split(':')[0]===b.key.split(':')[0];
  const reveal=(request,textOnly=false)=>{
    if (!mounted.current) return;
    if (!request?.open) { displayed.current=null;setView(null);changePhase('hidden');return; }
    const next={...request};displayed.current=next;setView(next);setMode(textOnly?'content':'full');
    enteredAt.current=Date.now();changePhase(textOnly?'content-enter':'enter');
    const raf=window.requestAnimationFrame??(fn=>setTimeout(fn,16));
    frame.current=raf(()=>{frame.current=raf(()=>{if(mounted.current){changePhase('shown');schedule();}});});
  };
  const transition=()=>{
    const next=requested.current, current=displayed.current;
    const textOnly=next?.open && sameFamily(current,next);
    setMode(textOnly?'content':'full');changePhase(textOnly?'content-exit':'exit');
    timer.current=setTimeout(()=>{
      const latest=requested.current;
      // A different family arriving during text exit must finish the cloud exit first.
      if(textOnly && (!latest?.open || !sameFamily(current,latest))){
        setMode('full');changePhase('exit');timer.current=setTimeout(()=>reveal(requested.current),EXIT_MS);
      } else reveal(latest,textOnly);
    },textOnly?TEXT_EXIT_MS:EXIT_MS);
  };
  const schedule=()=>{
    const next=requested.current,current=displayed.current;
    if (!mounted.current || ['exit','content-exit','enter','content-enter'].includes(phaseRef.current)) return;
    clearTimeout(timer.current);
    if (!current) { if(next?.open) reveal(next); return; }
    if (next?.open && current.key===next.key && current.compact===next.compact) return;
    const wait=next?.open?Math.max(0,(current.compact?750:MIN_READ_MS)-(Date.now()-enteredAt.current)):0;
    timer.current=setTimeout(transition,wait);
  };
  useEffect(()=>{schedule();},[open,contentKey,compact]);
  useEffect(()=>()=>{mounted.current=false;clearTimeout(timer.current);(window.cancelAnimationFrame??clearTimeout)(frame.current);},[]);
  // Clock/price updates remain live while this page is visible; once exiting, its exact contents freeze.
  if(view && view.key===contentKey && phase==='shown') displayed.current={...displayed.current,children,label};
  useLayoutEffect(()=>{
    if (!node.current || !view) return;
    const content=node.current.querySelector('.lg-pet-cloud-content');
    const measure=()=>setHeight(Math.ceil((content?.scrollHeight??0)+(view.compact?44:80)));
    measure();const observer=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;
    if(content)observer?.observe(content);
    return()=>observer?.disconnect();
  },[view,children,phase]);
  if (!view) return null;
  const current=displayed.current??view;
  const width=Math.min(view.compact?252:318,screen.width-24);
  const placement=placeBubble({anchor,screen,width,height,preferred:layoutRef.current?.side});
  // Freeze the retiring card so a drag/new notice cannot move the old text while it fades.
  const layout=phase==='exit'&&layoutRef.current?layoutRef.current:placement;
  if(phase!=='exit')layoutRef.current=layout;
  const {side,left,top,height:actualHeight}=layout;
  const tail=Math.max(28,Math.min(layout.width-28,anchor.x-left));
  const tailY=Math.max(30,Math.min(actualHeight-30,(anchor.top+anchor.bottom)/2-top));
  const originX=side==='left'?'100%':side==='right'?'0%':`${tail}px`;
  const originY=side==='above'?'100%':side==='below'?'0%':`${tailY}px`;
  return <section ref={node} id={id} role={view.compact?'status':undefined} aria-label={current.label} className={`lg-pet-cloud ${view.compact?'lg-pet-cloud-compact':''}`} data-phase={phase} data-transition={mode} data-side={side} style={{width:layout.width,left,top,height:actualHeight,'--tail-x':`${tail}px`,'--tail-y':`${tailY}px`,'--cloud-max-height':`${Math.max(1,screen.height-24)}px`,'--cloud-origin-x':originX,'--cloud-origin-y':originY}}>
    <svg className="lg-pet-cloud-shape" viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true"><path d="M14 14 C14 4 26 0 34 8 C42 -2 58 -2 66 8 C77 0 88 4 88 14 C101 14 105 28 96 36 C106 45 106 58 96 65 C104 77 98 89 86 88 C86 100 72 104 64 95 C54 105 39 105 32 95 C20 104 7 98 10 86 C-2 83 -5 67 4 60 C-5 50 -3 36 6 32 C-2 20 4 10 14 14Z"/></svg>
    <svg className="lg-pet-cloud-tail" viewBox="0 0 42 46" aria-hidden="true"><ellipse className="lg-pet-cloud-dot lg-pet-cloud-dot-near" cx="17" cy="10" rx="7.5" ry="5.5"/><ellipse className="lg-pet-cloud-dot lg-pet-cloud-dot-far" cx="27" cy="33" rx="4" ry="3.2"/></svg>
    <div className="lg-pet-cloud-content">{current.children}</div>
  </section>;
}
