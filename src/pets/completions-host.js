import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

export const COMPLETIONS_PATH = '/plugins/dsh-super-nexusx/v1/completions';
const GROUP_MS = 30000, DISPLAY_MS = 12000;

/** Consume committed turn events once on the Host, so windows never duplicate the reminder sound. */
export function createCompletionFeed(ctx, readPreferences) {
  let batch = null, sound;
  const stepped = new Set(), seen = new Set(), children = new Set();
  const disposers = [];
  const rememberChild = info => { if (info?.id) { children.add(info.id); if (children.size > 1000) children.delete(children.values().next().value); } };
  disposers.push(ctx.on('subagent/start', rememberChild), ctx.on('subagent/end', rememberChild));
  const play = () => {
    if (process.platform !== 'darwin') return;
    sound?.kill();
    sound = spawn('/usr/bin/afplay', ['-v', '0.55', fileURLToPath(new URL('./notification-chime.wav', import.meta.url))], {stdio:'ignore'});
    sound.on('error', () => {});
  };
  disposers.push(ctx.on('session/event', (session, event) => {
    if (!session?.id || children.has(session.id)) return;
    const key = `${session.id}:${event.data?.turn}`;
    if (event.type === 'step/start') { stepped.add(key); return; }
    if (event.type !== 'turn/end') return;
    const worked = stepped.delete(key);
    if (!worked || event.data?.reason?.kind !== 'completed' || seen.has(key)) return;
    seen.add(key); if (seen.size > 2000) seen.delete(seen.values().next().value);
    const p = readPreferences();
    if (!p.petEnabled || p.petNotify === false) return;
    let title;
    try { const state = ctx.get('sessionTitle')?.get(session); title = typeof state === 'string' ? state : state?.title; } catch { /* A session without a title still has a readable reminder. */ }
    title = String(title || session.title || session.name || '这次的小任务').replace(/[\r\n\t]/g,' ').slice(0,80);
    const now = Date.now(), fresh = !batch || now - batch.createdAt >= GROUP_MS;
    if (fresh) batch = {id:randomUUID(), createdAt:now, updatedAt:now, expiresAt:now+DISPLAY_MS, count:0, items:[]};
    batch.count++; batch.updatedAt=now;
    batch.expiresAt=Math.min(batch.createdAt+GROUP_MS, now+DISPLAY_MS);
    const previous=batch.items.find(item => item.sessionId===session.id);
    if (previous) { previous.title=title; previous.count++; }
    else batch.items.push({sessionId:session.id,title,count:1});
    // Keep the newest three titles, while preserving the full completion count.
    batch.items=batch.items.slice(-3);
    if (fresh && p.petSound !== false) play();
  }));
  disposers.push(ctx.on('session/disposed', session => {
    for (const key of stepped) if (key.startsWith(`${session.id}:`)) stepped.delete(key);
  }));
  const read = () => batch && Date.now() < batch.expiresAt ? batch : null;
  return { read, dispose() { for (const dispose of disposers) dispose?.(); sound?.kill(); stepped.clear(); seen.clear(); children.clear(); } };
}
