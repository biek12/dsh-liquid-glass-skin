export const COMPLETIONS_PATH = '/plugins/dsh-super-nexusx/v1/completions';

/** Only changed batches publish. Repeated polls cannot extend a bubble's deadline. */
export function createCompletionSource(fetcher = async () => {
  const response = await fetch(COMPLETIONS_PATH, {headers:{'X-DSH-Liquid-Glass':'1'}, signal:AbortSignal.timeout(5000)});
  if (!response.ok) throw new Error('Completion feed unavailable');
  return response.json();
}) {
  let value=null, signature='', stopped=false, pending=false;
  const listeners=new Set();
  const refresh=async()=>{
    if (stopped || pending) return;
    pending=true;
    try {
      const next=await fetcher();
      const valid=next && typeof next.id==='string' && Number.isFinite(next.expiresAt) && Array.isArray(next.items) ? next : null;
      const nextSignature=valid ? `${valid.id}:${valid.count}:${valid.expiresAt}` : '';
      if (!stopped && nextSignature!==signature) { signature=nextSignature; value=valid; listeners.forEach(fn=>fn()); }
    } catch { /* The display timer still closes an existing bubble if the Host disconnects. */ }
    finally { pending=false; }
  };
  void refresh(); const timer=setInterval(refresh,1000);
  return {getSnapshot:()=>value, subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);}, dispose(){stopped=true;clearInterval(timer);listeners.clear();}};
}
