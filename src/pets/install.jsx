import { createCompletionSource } from './completions.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FloatingPet } from './pet.jsx';
import { desktopRequest } from './desktop-client.js';
import { BALANCE_PATH } from './balance.js';

const readBalance = async signal => {
  const response = await fetch(BALANCE_PATH, { headers:{'X-DSH-Liquid-Glass':'1'}, signal });
  if (!response.ok) throw new Error('Balance request failed');
  return response.json();
};

export function installPet({ controller, context }) {
  const host = document.createElement('div'); host.dataset.liquidGlassPet = ''; document.body.append(host);
  const root = createRoot(host);
  const completions = createCompletionSource();
  root.render(<FloatingPet context={context} controller={controller} account={readBalance} completions={completions}/>);
  let checking = false, stopped = false;
  const checkDesktop = async () => {
    const p=controller.getSnapshot().state.preferences;
    if(stopped||checking||!p.petDesktop||!p.petEnabled)return;
    checking=true;
    try { const state=await desktopRequest(); if(!stopped&&!state.running) await controller.mutate({type:'preferences',patch:{petDesktop:false}}); }
    catch { /* A Host restart is retried after the controller reconnects. */ }
    finally { checking=false; }
  };
  const desktopTimer=setInterval(checkDesktop,2000);
  const checkOnFocus=()=>checkDesktop();window.addEventListener('focus',checkOnFocus);
  return () => { stopped=true;clearInterval(desktopTimer);window.removeEventListener('focus',checkOnFocus);completions.dispose(); root.unmount(); host.remove(); };
}
