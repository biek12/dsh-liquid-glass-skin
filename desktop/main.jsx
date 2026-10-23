import { createCompletionSource } from '../src/pets/completions.js';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createController } from '../src/controller.js';
import { FloatingPet, petCss } from '../src/pets/pet.jsx';

const token=location.hash.slice(1);
const style=document.createElement('style');style.textContent=petCss+'html,body{margin:0;background:transparent!important;overflow:hidden;}';document.head.append(style);
const native=value=>window.webkit?.messageHandlers?.pet?.postMessage(value);
const call=async(path,options={})=>{
 const result=await fetch(path,{...options,headers:{...options.headers,Authorization:`Bearer ${token}`}});
 if(!result.ok)throw new Error('桌面连接暂时不可用');return result;
};
const controller=createController({poll:false,fetcher:(_,options)=>call('/state',options)});
const account=async signal=>{const response=await call('/balance',{signal});return response.json();};
let insight = {}; const listeners = new Set();
const context = { subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); }, getSnapshot: () => insight };
const completions = createCompletionSource(async()=>{const response=await call('/completions',{signal:AbortSignal.timeout(5000)});return response.json();});
function Companion(){
 useEffect(()=>{
  let failed=0,frame;
  const sync=()=>controller.refresh().then(()=>{const value=controller.getSnapshot();if(value.error){if(++failed>=3)native({kind:'quit'});}else{failed=0;if(!value.state.preferences.petEnabled)native({kind:'quit'});}});
  const syncInsight = () => call('/context').then(r=>r.json()).then(value=>{insight=value;listeners.forEach(fn=>fn());}).catch(()=>{});
  sync(); syncInsight(); const timer=setInterval(()=>{sync();syncInsight();},2000);
  const report=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>native({kind:'hitRects',rects:Array.from(document.querySelectorAll('.lg-pet-body,.lg-pet-cloud:not([data-phase="exit"])')).map(node=>{const r=node.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};})}));};
  const observer=new MutationObserver(report);observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','data-phase']});window.addEventListener('resize',report);report();
  return()=>{clearInterval(timer);cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',report);completions.dispose();controller.dispose();};
 },[]);
 return <FloatingPet controller={controller} account={account} context={context} completions={completions} desktop/>;
}
createRoot(document.getElementById('root')).render(<Companion/>);
