import { watchShell } from './dom-schedule.js';

/** Native Appearance integration, following the host DOM contract used by community skins. */
export function findAppearanceRow(doc = document) {
  for (const row of doc.querySelectorAll('[class$="_cubeRow"], [class*="_cubeRow "]')) {
    const buttons = [...row.children].filter(node => node.tagName === 'BUTTON' && [...node.classList].some(c => c.endsWith('_themeCube')));
    if (buttons.length >= 3) return { row, buttons };
  }
  return null;
}

export function installSkinChoice({ controller, doc = document }) {
  let mounted; let disposed = false; let selecting = false;
  const enabled = () => controller.getSnapshot().state.preferences.theme;
  const choose = async value => {
    if (disposed) return;
    if (value) {
      // Let other skins observe a real native appearance choice and release their presenters.
      selecting = true;
      const native = findAppearanceRow(doc);
      const selected = native?.buttons.find(b => b.getAttribute('aria-pressed') === 'true') ?? native?.buttons.at(-1);
      selected?.click();
      selecting = false;
    }
    if (enabled() !== value) await controller.mutate({ type: 'preferences', patch: { theme: value } });
  };
  const sync = () => {
    if (disposed) return;
    const target = mounted?.isConnected ? { row: mounted.parentElement } : findAppearanceRow(doc);
    if (!target) { mounted?.remove(); mounted = undefined; return; }
    if (!mounted) {
      mounted = doc.createElement('button'); mounted.type = 'button'; mounted.className = 'lg-appearance-choice';
      mounted.dataset.plugin = 'dsh-liquid-glass'; mounted.setAttribute('aria-label', 'Liquid Glass');
      const icon = doc.createElement('span'); icon.className = 'lg-appearance-orb'; icon.setAttribute('aria-hidden', 'true');
      const label = doc.createElement('span'); label.textContent = 'Liquid Glass'; mounted.append(icon, label);
      mounted.addEventListener('click', () => { choose(true).catch(() => {}); });
    }
    if (mounted.parentElement !== target.row) target.row.append(mounted);
    const pressed = String(enabled()); if (mounted.getAttribute('aria-pressed') !== pressed) mounted.setAttribute('aria-pressed', pressed);
    mounted.disabled = controller.getSnapshot().loading || controller.getSnapshot().saving;
  };
  const nativeChoice = event => {
    const target = event.target?.closest?.('button');
    if (!target || target === mounted || selecting || !enabled()) return;
    const appearance = findAppearanceRow(doc);
    if (appearance?.row.contains(target)) choose(false).catch(() => {});
  };
  const releaseObserver = watchShell(doc, sync);
  doc.addEventListener('click', nativeChoice, true);
  const unsubscribe = controller.subscribe(sync); sync();
  return {
    choose,
    dispose: () => { disposed = true; releaseObserver(); unsubscribe(); doc.removeEventListener('click', nativeChoice, true); mounted?.remove(); },
  };
}

/** Small owned additions to the native Hero; native Composer and workspace picker remain intact. */
export function installShellSkin(doc = document) {
  const added = new Set(); let stopped = false;
  const sync = () => {
    if (stopped) return;
    for (const headline of doc.querySelectorAll('[class$="_headline"], [class*="_headline "]')) {
      if (!headline.querySelector('[class$="_fishHitbox"], [class*="_fishHitbox "]')) continue;
      const stack = headline.parentElement;
      const body = [...stack.children].find(node => [...node.classList].some(c => c.endsWith('_body')));
      if (!body || body.querySelector('.lg-home-intro')) continue;
      const intro = doc.createElement('div'); intro.className = 'lg-home-intro';
      const title = doc.createElement('h1'); title.textContent = '让想法，清晰流动。';
      const subtitle = doc.createElement('p'); subtitle.textContent = '从一个问题开始，把灵感整理成下一步。';
      intro.append(title, subtitle); body.append(intro); added.add(intro);
    }
  };
  const releaseObserver = watchShell(doc, sync);
  return () => { stopped = true; releaseObserver(); for (const node of added) node.remove(); };
}
