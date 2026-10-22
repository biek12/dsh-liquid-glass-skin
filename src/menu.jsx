import React, { useLayoutEffect, useRef } from 'react';

export function placeMenu(anchor, size, viewport) {
  const gap = 7; const edge = 8;
  let x = anchor.x; let y = anchor.y;
  if (anchor.align === 'end') x -= size.width;
  if (y + size.height > viewport.height - edge) y = (anchor.top ?? anchor.y) - size.height - gap;
  return { x: Math.max(edge, Math.min(x, viewport.width - size.width - edge)), y: Math.max(edge, Math.min(y, viewport.height - size.height - edge)) };
}

/** A nonmodal top-layer popover avoids clipping inside the scrolling tree. */
export function RowMenu({ menu, close, children }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const node = ref.current; node.showPopover?.();
    const position = placeMenu(menu.anchor, { width: node.offsetWidth, height: node.offsetHeight }, { width: window.innerWidth, height: window.innerHeight });
    node.style.left = `${position.x}px`; node.style.top = `${position.y}px`;
    node.querySelector('[role="menuitem"]')?.focus({ preventScroll: true });
    const dismiss = event => { if (!node.contains(event.target)) close(); };
    const scroll = event => { if (!node.contains(event.target)) close(); };
    document.addEventListener('pointerdown', dismiss, true);
    document.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', dismiss, true); document.removeEventListener('scroll', scroll, true); window.removeEventListener('resize', close);
      node.hidePopover?.(); if (menu.trigger?.isConnected) menu.trigger.focus({ preventScroll: true });
    };
  }, [menu]);
  const keyboard = event => {
    const buttons = [...ref.current.querySelectorAll('[role="menuitem"]:not(:disabled)')];
    const index = buttons.indexOf(document.activeElement);
    if (event.key === 'Escape' || event.key === 'Tab') { if (event.key === 'Escape') event.preventDefault(); event.stopPropagation(); close(); return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next]?.focus({ preventScroll: true });
  };
  return <div ref={ref} popover="manual" role="menu" aria-label={`${menu.title} 的操作`} className="lg-row-menu" onKeyDown={keyboard}>{children}</div>;
}
