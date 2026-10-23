import React, { useEffect, useRef, useState } from 'react';
import { createRigRenderer, mixPose, samplePose } from './rig.js';
import { createGpuRig } from './rig-gpu.js';
import { startPlayback, frameAt, FRAME_MS } from './playback.js';

const sources = new Map();
function imagePixels(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scratch = document.createElement('canvas'); scratch.width = scratch.height = 256;
      const ctx = scratch.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, 256, 256); resolve(ctx.getImageData(0, 0, 256, 256).data);
    };
    img.onerror = reject; img.src = url;
  });
}
export function loadRig(pet) {
  if (!sources.has(pet.id)) sources.set(pet.id, Promise.all([imagePixels(pet.clips.base), imagePixels(pet.clips.closed)])
    .catch(error => { sources.delete(pet.id); throw error; }));
  return sources.get(pet.id);
}
export function PetSprite({ pet, state = 'idle', motion = 'full', enabled = true, velocity = 0, scrub = null }) {
  const canvas = useRef(null), live = useRef({ state, velocity, enabled, motion, scrub });
  live.current = { state, velocity, enabled, motion, scrub };
  const [reduced, setReduced] = useState(false), [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media?.matches === true), visibility = () => setVisible(!document.hidden);
    sync(); media?.addEventListener('change', sync); document.addEventListener('visibilitychange', visibility);
    return () => { media?.removeEventListener('change', sync); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (!window.CanvasRenderingContext2D) return;
    let disposed = false, stop, gpu, start, currentState, transition, from, pose = samplePose(pet.id, 'idle', 0), smoothedVelocity = 0;
    const node = canvas.current, ctx = node.getContext('2d');
    const pixels = ctx.createImageData(256, 256);
    loadRig(pet).then(([base, closed]) => {
      if (disposed) return;
      gpu = createGpuRig(pet.id, base, closed);
      let render = gpu ? null : createRigRenderer(pet.id, base, closed);
      node.dataset.engine = gpu ? 'webgl' : 'canvas';
      const animated = enabled && !reduced && motion !== 'off' && visible;
      const tick = time => {
        if (disposed) return;
        const options = live.current;
        if (currentState !== options.state) { from = pose; currentState = options.state; transition = time; start = time; }
        {
          smoothedVelocity += (options.velocity - smoothedVelocity) * .22;
          const elapsed = options.scrub ?? (animated ? frameAt((time - start) * (options.motion === 'soft' ? .85 : 1)) * FRAME_MS : 0);
          const target = animated || options.scrub !== null ? samplePose(pet.id, currentState, elapsed, smoothedVelocity, options.scrub ?? time) : samplePose(pet.id, 'idle', 0);
          pose = options.scrub !== null || !animated ? target : mixPose(from, target, (time - transition) / 320);
          if (gpu) {
            try { gpu.draw(pose); ctx.clearRect(0, 0, 256, 256); ctx.drawImage(gpu.canvas, 0, 0); }
            catch { gpu.dispose(); gpu=null; render=createRigRenderer(pet.id,base,closed); node.dataset.engine='canvas'; }
          }
          if (!gpu) { pixels.data.set(render(pose)); ctx.putImageData(pixels, 0, 0); }
          node.dataset.blink = pose.blink.toFixed(3); node.dataset.head = pose.head.toFixed(3);
          node.dataset.frame = String(Math.floor(elapsed / 50)); node.dataset.ready = 'true';
        }

      };
      if (animated && scrub === null) stop = startPlayback({ paint: tick, requestFrame: fn => window.requestAnimationFrame(fn), cancelFrame: id => window.cancelAnimationFrame(id) });
      else tick(0);
    }).catch(() => { if (!disposed) node.dataset.failed = 'true'; });
    return () => { disposed = true; stop?.(); gpu?.dispose(); };
  }, [pet.id, reduced, visible, enabled, motion, scrub, scrub === null ? null : state]);
  return <span className="lg-pet-sprite" role="img" aria-label={`${pet.subtitle} · ${state === 'drag' ? '被提起' : state === 'land' ? '落地' : state === 'hover' ? '回应你' : '待机'}`} data-state={state} data-fps="20" data-renderer="fixed-local-rig">
    <img src={pet.clips.base} alt="" draggable="false"/><canvas key={pet.id} ref={canvas} width="256" height="256"/>
  </span>;
}
