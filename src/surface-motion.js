const SURFACES = '[data-menu-material], [role="menu"], [role="group"][id$="-menu"], [role="listbox"], [role="tooltip"], [role="dialog"], dialog.lg-dialog, [role="alert"], [style*="--dsh-hover-preview-fade"], .lg-row-menu, .lg-cascade, .lg-cascade-column, .lg-ces-set, .lg-search, .lg-filters, .lg-delete-note, .lg-undo, .lg-tree-bottom, [data-slot="settings.section"] > *';
const BUSY = '[aria-busy="true"], [data-loading="true"], [role="progressbar"]';
const IGNORED = '[data-lg-motion-ghost], .lg-global-loading, [data-conversation-region="chat"], .lg-wait-line';

export function installSurfaceMotion({ controller, appearance, doc = document }) {
  const win = doc.defaultView; const records = new Map(); const busyNodes = new Set(); const animations = new Set(); const ghosts = new Set(); const frames = new Set();
  const scrollPositions = new WeakMap();
  const media = win.matchMedia('(prefers-reduced-motion: reduce)');
  let disposed = false; let showTimer; let hideTimer; let shownAt = 0; let sidebarFrame;
  const enabled = () => !disposed && !media.matches && doc.body.dataset.lgMotion !== 'off';
  const duration = (normal = 200) => doc.body.dataset.lgMotion === 'soft' ? Math.round(normal * .65) : normal;
  const frame = callback => {
    const handle = win.requestAnimationFrame(() => { frames.delete(handle); if (!disposed) callback(); });
    frames.add(handle); return handle;
  };
  const animate = (node, keyframes, time = 200) => {
    if (!enabled() || !node.animate) return;
    const animation = node.animate(keyframes, { duration: duration(time), easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'none' });
    animations.add(animation); animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    return animation;
  };
  const loading = doc.createElement('div');
  loading.className = 'lg-global-loading'; loading.hidden = true; loading.setAttribute('role', 'status');
  loading.setAttribute('aria-label', '正在加载或保存'); loading.innerHTML = '<span class="lg-global-loading-track"></span><span class="lg-global-loading-spinner" aria-hidden="true"></span>';
  doc.body.append(loading);
  const isBusy = () => controller.getSnapshot().loading || controller.getSnapshot().saving || appearance.getSnapshot().changing || [...busyNodes].some(node => {
    if (!node.isConnected || !node.matches(BUSY)) { busyNodes.delete(node); return false; }
    if (node.getAttribute('role') === 'progressbar' && node.hasAttribute('aria-valuenow') && Number(node.getAttribute('aria-valuenow')) >= Number(node.getAttribute('aria-valuemax') ?? 100)) return false;
    return node.getClientRects().length > 0 && win.getComputedStyle(node).visibility !== 'hidden';
  });
  const updateLoading = () => {
    if (disposed) return;
    if (isBusy()) {
      win.clearTimeout(hideTimer); hideTimer = undefined;
      if (loading.hidden && !showTimer) showTimer = win.setTimeout(() => {
        showTimer = undefined;
        if (!disposed && isBusy()) { loading.hidden = false; shownAt = Date.now(); loading.dataset.phase = 'loading'; }
      }, 160);
      else if (!loading.hidden) loading.dataset.phase = 'loading';
    } else {
      win.clearTimeout(showTimer); showTimer = undefined;
      if (!loading.hidden && !hideTimer) hideTimer = win.setTimeout(() => {
        hideTimer = undefined;
        if (isBusy()) return;
        loading.dataset.phase = 'done';
        hideTimer = win.setTimeout(() => { hideTimer = undefined; if (!isBusy()) loading.hidden = true; else updateLoading(); }, enabled() ? duration(180) : 0);
      }, Math.max(0, 260 - (Date.now() - shownAt)));
    }
  };
  const ghost = (node, bounds, style, time = 160, backdrop) => {
    if (!enabled() || !bounds?.width || !bounds?.height) return;
    const layer = doc.createElement('div'); const copy = node.cloneNode(true);
    layer.dataset.lgMotionGhost = ''; layer.setAttribute('aria-hidden', 'true'); layer.inert = true; layer.setAttribute('popover', 'manual');
    layer.style.cssText = `position:fixed!important;inset:auto!important;left:${bounds.left}px!important;top:${bounds.top}px!important;width:${bounds.width}px!important;height:${bounds.height}px!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;overflow:visible!important;pointer-events:none!important;`;
    if (backdrop) { layer.dataset.lgDialogGhost = ''; layer.style.setProperty('--lg-ghost-backdrop', backdrop.backgroundColor); layer.style.setProperty('--lg-ghost-blur', backdrop.backdropFilter); }
    const originals = [node, ...node.querySelectorAll('*')]; const copies = [copy, ...copy.querySelectorAll('*')];
    const scrolling = originals.map((original, index) => ({ copy: copies[index], position: scrollPositions.get(original) })).filter(entry => entry.position);
    for (const item of copies) {
      if (item.matches('script,iframe,object,embed')) { item.remove(); continue; }
      if (item.hasAttribute('data-menu-material')) item.style.anchorName = 'none';
      for (const attribute of [...item.attributes]) if (['id', 'role', 'popover', 'autofocus', 'aria-modal', 'aria-live', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'aria-activedescendant', 'data-shortcut-modal', 'data-menu-material'].includes(attribute.name) || attribute.name.startsWith('on')) item.removeAttribute(attribute.name);
      if (item.matches('input[type="password"]')) { item.value = ''; item.removeAttribute('value'); }
      if (item.matches('dialog')) item.setAttribute('open', '');
    }
    Object.assign(copy.style, style, { position: 'relative', inset: 'auto', left: '0px', top: '0px', margin: '0px', width: `${bounds.width}px`, height: `${bounds.height}px`, maxWidth: 'none', maxHeight: 'none', boxSizing: 'border-box', transform: 'none', translate: 'none', scale: 'none', visibility: 'visible' });
    layer.append(copy); doc.body.append(layer); ghosts.add(layer);
    try { layer.showPopover?.(); } catch { /* Positioned ghost still works without the top layer. */ }
    for (const entry of scrolling) { entry.copy.scrollTop = entry.position.top; entry.copy.scrollLeft = entry.position.left; }
    const animation = animate(layer, [{ opacity: 1 }, { opacity: 0 }], time);
    const remove = () => { layer.remove(); ghosts.delete(layer); };
    if (animation) animation.finished.then(remove, remove); else remove();
  };
  const capture = record => {
    if (!record.root.isConnected || !record.root.getClientRects().length) return false;
    const style = win.getComputedStyle(record.root);
    if (style.visibility === 'hidden' || style.display === 'none') return false;
    record.bounds = record.root.getBoundingClientRect();
    record.style = { display: style.display, color: style.color, font: style.font, gap: style.gap, borderRadius: style.borderRadius, backgroundColor: style.backgroundColor, boxShadow: style.boxShadow };
    if (record.root.matches('dialog')) {
      const backdrop = win.getComputedStyle(record.root, '::backdrop');
      record.backdrop = { backgroundColor: backdrop.backgroundColor, backdropFilter: backdrop.backdropFilter };
    }
    return !!record.bounds.width && !!record.bounds.height;
  };
  const leave = record => {
    if (!record.visible) return;
    record.visible = false;
    if (record.root.style.getPropertyValue('--dsh-toast-hold')) return;
    ghost(record.root, record.bounds, record.style, 160, record.backdrop);
  };
  const reveal = record => {
    if (record.visible || record.root.hasAttribute('data-closing') || !capture(record)) return;
    record.visible = true;
    if (record.kind === 'dialog') {
      animate(record.root, [{ opacity: 0 }, { opacity: 1 }], 220);
      record.animation = animate(record.card, [{ scale: '.975' }, { scale: '1' }], 240);
    } else record.animation = animate(record.root, [{ opacity: 0 }, { opacity: 1 }], record.kind === 'tooltip' ? 140 : 180);
  };
  const resizeObserver = new win.ResizeObserver(entries => {
    for (const entry of entries) {
      const record = [...records.values()].find(candidate => candidate.card === entry.target);
      if (!record) continue;
      const width = entry.target.offsetWidth; const height = entry.target.offsetHeight;
      const previous = record.size; record.size = { width, height };
      if (!width || !height) { leave(record); continue; }
      if (!record.visible) reveal(record);
      if (previous && record.kind === 'dialog' && (Math.abs(previous.width - width) > 1 || Math.abs(previous.height - height) > 1)) {
        const scale = win.getComputedStyle(record.card).scale.split(' ').map(value => Number.parseFloat(value) || 1);
        record.animation?.cancel();
        capture(record);
        record.animation = animate(record.card, [{ scale: `${previous.width * scale[0] / width} ${previous.height * (scale[1] ?? scale[0]) / height}` }, { scale: '1 1' }], 240);
      }
      if (record.kind !== 'dialog') capture(record);
    }
    updateLoading();
  });
  const register = candidate => {
    if (!candidate.isConnected || candidate.closest(IGNORED)) return;
    const isDialog = candidate.matches('[role="dialog"],dialog.lg-dialog');
    const root = isDialog && candidate.parentElement?.matches('[role="presentation"]') ? candidate.parentElement : candidate;
    if (records.has(root)) return;
    const parent = candidate.parentElement?.closest(SURFACES);
    const pane = candidate.matches('[data-slot="settings.section"] > *,.lg-search,.lg-filters,.lg-delete-note,.lg-cascade-column,.lg-ces-set');
    if (!isDialog && parent && !pane && !candidate.matches('[data-menu-material], [role="tooltip"], [style*="--dsh-hover-preview-fade"]')) return;
    if (candidate.matches('[role="menu"]') && !candidate.matches('[data-menu-material],.lg-row-menu') && candidate.getClientRects().length && win.getComputedStyle(candidate).position === 'static' && !candidate.closest('.lg-cascade')) return;
    const kind = isDialog ? 'dialog' : candidate.matches('[role="tooltip"],[style*="--dsh-hover-preview-fade"]') ? 'tooltip' : pane ? 'pane' : 'menu';
    const record = { root, card: candidate, kind, visible: false };
    records.set(root, record); root.dataset.lgSurfaceMotion = kind;
    record.size = { width: candidate.offsetWidth, height: candidate.offsetHeight };
    record.observer = new win.MutationObserver(() => {
      if (!root.isConnected) return;
      if (root.hasAttribute('data-closing')) { record.animation?.cancel(); record.visible = false; return; }
      if (!root.getClientRects().length || win.getComputedStyle(root).visibility === 'hidden') leave(record);
      else { reveal(record); if (kind !== 'dialog') capture(record); }
      updateLoading();
    });
    record.observer.observe(root, { attributes: true, attributeFilter: ['style', 'hidden', 'open', 'class', 'data-closing'] });
    resizeObserver.observe(candidate); reveal(record);
  };
  const scan = node => {
    if (node.nodeType !== 1 || node.closest(IGNORED)) return;
    if (node.matches(SURFACES)) register(node);
    for (const candidate of node.querySelectorAll(SURFACES)) register(candidate);
    if (node.matches(BUSY)) busyNodes.add(node);
    for (const candidate of node.querySelectorAll(BUSY)) if (!candidate.closest(IGNORED)) busyNodes.add(candidate);
  };
  const observer = new win.MutationObserver(mutations => {
    let changed = false; let removed = false;
    for (const mutation of mutations) {
      if (mutation.target.nodeType === 1 && mutation.target.closest(IGNORED)) continue;
      if (mutation.type === 'attributes') {
        if (mutation.target.matches(BUSY)) busyNodes.add(mutation.target); else busyNodes.delete(mutation.target);
        changed = true; continue;
      }
      for (const node of mutation.addedNodes) if (node.nodeType === 1 && !node.closest(IGNORED)) { scan(node); changed = true; }
      if (mutation.removedNodes.length) removed = true;
    }
    if (removed) {
      const detached = [...records].filter(([root]) => !root.isConnected);
      for (const [root, record] of detached) {
        if (detached.some(([ancestor]) => ancestor !== root && ancestor.contains(root))) record.visible = false; else leave(record);
        record.observer.disconnect(); resizeObserver.unobserve(record.card); record.animation?.cancel(); delete root.dataset.lgSurfaceMotion; records.delete(root); changed = true;
      }
    }
    if (changed || removed) updateLoading();
  });
  observer.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-busy', 'data-loading', 'aria-valuenow'] });
  const beforeToggle = event => {
    const record = records.get(event.target);
    if (!record) return;
    if (event.newState === 'closed') leave(record); else frame(() => reveal(record));
  };
  const rememberPosition = () => { for (const record of records.values()) if (record.visible && record.kind !== 'dialog') capture(record); };
  const rememberScroll = event => {
    if (event.target.nodeType !== 1 || event.target.closest(IGNORED)) return;
    scrollPositions.set(event.target, { top: event.target.scrollTop, left: event.target.scrollLeft }); rememberPosition();
  };
  const onMotionChange = () => {
    if (enabled()) return;
    for (const animation of animations) animation.cancel();
    for (const layer of ghosts) layer.remove(); ghosts.clear();
  };
  const preferencesObserver = new win.MutationObserver(onMotionChange);
  preferencesObserver.observe(doc.body, { attributes: true, attributeFilter: ['data-lg-motion'] });
  media.addEventListener('change', onMotionChange);
  doc.addEventListener('beforetoggle', beforeToggle, true);
  doc.addEventListener('pointerdown', rememberPosition, true);
  doc.addEventListener('scroll', rememberScroll, true);
  win.addEventListener('resize', rememberPosition);
  const releaseController = controller.subscribe(updateLoading); const releaseAppearance = appearance.subscribe(updateLoading);
  scan(doc.body); updateLoading();
  return {
    switchWorkspace(update) {
      const outlet = doc.querySelector('[data-slot="sidebar.workspaces"]');
      const region = outlet?.closest('[class$="_regionArea"],[class*="_regionArea "]') ?? doc.querySelector('[class$="_regionArea"],[class*="_regionArea "]') ?? outlet?.parentElement;
      if (!region || !enabled()) { update(); return; }
      const style = win.getComputedStyle(region);
      ghost(region, region.getBoundingClientRect(), { display: style.display, color: style.color, font: style.font }, 180);
      update();
      if (sidebarFrame) { win.cancelAnimationFrame(sidebarFrame); frames.delete(sidebarFrame); }
      sidebarFrame = frame(() => { sidebarFrame = undefined; animate(region, [{ opacity: 0 }, { opacity: 1 }], 220); });
    },
    dispose() {
      disposed = true; observer.disconnect(); preferencesObserver.disconnect(); resizeObserver.disconnect(); releaseController(); releaseAppearance();
      win.clearTimeout(showTimer); win.clearTimeout(hideTimer); for (const handle of frames) win.cancelAnimationFrame(handle);
      media.removeEventListener('change', onMotionChange); doc.removeEventListener('beforetoggle', beforeToggle, true); doc.removeEventListener('pointerdown', rememberPosition, true); doc.removeEventListener('scroll', rememberScroll, true); win.removeEventListener('resize', rememberPosition);
      for (const record of records.values()) { record.observer.disconnect(); delete record.root.dataset.lgSurfaceMotion; }
      for (const animation of animations) animation.cancel(); for (const layer of ghosts) layer.remove();
      records.clear(); animations.clear(); ghosts.clear(); busyNodes.clear(); loading.remove();
    },
  };
}
