export const PET_FPS = 20;
export const FRAME_MS = 1000 / PET_FPS;
export const frameAt = elapsed => Math.floor(Math.max(0, elapsed) / FRAME_MS);

/** Quantized poses advance by elapsed time, so late paints never slow the action. */
export function startPlayback({ paint, requestFrame, cancelFrame }) {
  let start, handle, previous = 0, disposed = false;
  paint(0);
  const tick = time => {
    if (disposed) return;
    start ??= time;
    const frame = frameAt(time - start);
    if (frame !== previous) { previous = frame; paint(frame * FRAME_MS); }
    handle = requestFrame(tick);
  };
  handle = requestFrame(tick);
  return () => { disposed = true; cancelFrame(handle); };
}
