export function motionReduced() {
  return document.body.dataset.lgMotion === 'off' || document.body.dataset.lgStatusGlow === 'false' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function motionValue(token) {
  const value = getComputedStyle(document.body).getPropertyValue(token).trim();
  if (!value) throw new Error(`Missing waiting-line motion token: ${token}`);
  return value;
}

export function motionMs(token) {
  const value = motionValue(token);
  const duration = Number.parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
  if (!Number.isFinite(duration)) throw new Error(`Invalid waiting-line duration: ${token}`);
  return duration;
}

export function motionEase(token) {
  return motionValue(token);
}

export function requestFrame({ write }) {
  const frame = window.requestAnimationFrame(write);
  return () => window.cancelAnimationFrame(frame);
}

export function observeSize(element, callback) {
  const observer = new ResizeObserver(callback);
  observer.observe(element);
  return () => observer.disconnect();
}

export function buildElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}
