import React, { useEffect, useRef } from 'react';
import { afterPaint } from './dom-schedule.js';
import { buildElement, motionReduced } from './wait-motion.js';
import { startWaitLoader, releaseWaitLoader } from './vendor/wait-loader.js';
import { setSwappingText, releaseSwappingText } from './vendor/swapping-text.js';
import { openTurn, waitStart, wordForPass, WAIT_OVERTIME_MS } from './vendor/wait-state.js';
import { activityWords, THINKING_KEY } from './vendor/turn-activity.js';

const wordsByKey = {
  chatWaitThinking: '正在思考', chatWaitWriting: '正在写回答',
  chatWaitToolCall: '正在准备工具调用', chatWaitTools: '正在调用工具',
  chatWaitReading: '正在读取 {file}', chatWaitEditing: '正在编辑 {file}', chatWaitWritingFile: '正在写入 {file}',
};

function activityText(activity) {
  if (!activity || activity.key === THINKING_KEY) return null;
  if (activity.key === null) return activity.text ?? null;
  const copy = wordsByKey[activity.key];
  return activity.params?.file ? copy?.replace('{file}', activity.params.file) : copy;
}

function durationText(elapsed) {
  const seconds = Math.max(1, Math.floor(elapsed / 1000));
  if (seconds < 60) return `${seconds} 秒`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} 分 ${seconds % 60} 秒`;
  return `${Math.floor(minutes / 60)} 小时 ${minutes % 60} 分 ${seconds % 60} 秒`;
}

function createParts(row, words) {
  const line = buildElement('span', 'lg-wait-line');
  const loader = buildElement('span', 'lg-wait-chat-wait-loader');
  loader.setAttribute('aria-hidden', 'true');
  for (const [name, count] of [['bounce', 3], ['line', 3], ['orbit', 4]]) {
    const lane = buildElement('span', `lg-wait-chat-wait-lane is-${name}`);
    for (let index = 0; index < count; index += 1) lane.append(buildElement('span', 'lg-wait-chat-wait-dot'));
    loader.append(lane);
  }
  const label = buildElement('span', 'lg-wait-label');
  label.setAttribute('role', 'status'); label.setAttribute('aria-live', 'polite'); label.setAttribute('aria-atomic', 'true');
  const clock = buildElement('span', 'lg-wait-clock'); clock.setAttribute('aria-hidden', 'true');
  const badge = buildElement('span', 'lg-wait-badge'); badge.textContent = '暂未响应'; badge.hidden = true;
  line.append(loader, label, clock, badge);
  const icon = words.parentElement.firstElementChild;
  words.after(line);
  return { row, words, icon: icon !== words ? icon : null, line, loader, label, clock, badge, reduced: null };
}

export function attachWaitingLine(ctx, sessionId, root, controller) {
  let target; let unsubscribe; let parts; let row; let cancel; let disposed = false; let warned = false;
  let turnNumber; let wording; let waitBegan;
  const release = () => {
    if (!parts) return;
    releaseSwappingText(parts.label); releaseWaitLoader(parts.loader);
    parts.line.remove(); parts.words.removeAttribute('data-lg-wait-words'); parts.icon?.removeAttribute('data-lg-wait-icon');
    parts.row.removeAttribute('data-lg-wait'); parts = undefined;
  };
  const schedule = () => {
    if (cancel || disposed) return;
    cancel = afterPaint(() => { cancel = undefined; sync(); }, root.ownerDocument.defaultView);
  };
  const sync = () => {
    if (disposed || !root.isConnected || root.getAttribute('data-conversation-session') !== sessionId) { release(); return; }
    try {
      const binding = ctx.sessions.binding(sessionId);
      const fresh = binding ? ctx.uiConversation.binding(sessionId).target('chat') : undefined;
      if (fresh !== target) { unsubscribe?.(); target = fresh; unsubscribe = target?.subscribe(schedule); }
      const snapshot = target?.getSnapshot();
      const turn = snapshot?.timeline?.turns ? openTurn(snapshot) : undefined;
      if (!turn) { release(); row = undefined; turnNumber = undefined; wording = undefined; waitBegan = undefined; return; }
      if (turnNumber !== turn.turn) { turnNumber = turn.turn; wording = undefined; waitBegan = undefined; }
      if (!row?.isConnected || !root.contains(row)) {
        release();
        row = [...root.querySelectorAll('[data-chat-running]')].find(candidate => candidate.closest('[data-conversation-session]') === root);
      }
      if (!row) return;
      const words = row.querySelector(':scope > span > [data-shimmer], :scope > span > [data-text-shimmer]');
      if (!words) { release(); return; }
      if (!parts?.line.isConnected || parts.words !== words) { release(); parts = createParts(row, words); }
      const now = Date.now();
      const activity = activityWords(snapshot, turn, false);
      const said = activityText(activity);
      const pass = wordForPass({ word: said, own: false, detail: null, onCall: activity?.aboutCall === 'generic', host: wordsByKey.chatWaitThinking }, wording, now);
      wording = pass.row;
      setSwappingText(parts.label, pass.word, true);
      parts.label.setAttribute('aria-label', pass.word);
      const clock = turn.start ? durationText(now - turn.start.time) : '';
      if (parts.clock.textContent !== clock) parts.clock.textContent = clock;
      parts.clock.hidden = !turn.start;
      if (activity === null) waitBegan ??= waitStart(turn, now);
      else waitBegan = undefined;
      parts.badge.hidden = waitBegan === undefined || now - waitBegan < WAIT_OVERTIME_MS;
      const reduced = motionReduced();
      if (parts.reduced !== reduced) { releaseWaitLoader(parts.loader); startWaitLoader(parts.loader); parts.reduced = reduced; }
      parts.words.setAttribute('data-lg-wait-words', ''); parts.icon?.setAttribute('data-lg-wait-icon', '');
      row.setAttribute('data-lg-wait', '');
      warned = false;
    } catch (error) {
      release();
      if (!warned) { console.error('[dsh-super-nexusx] waiting line could not attach', error); warned = true; }
    }
  };
  const observer = new MutationObserver(records => {
    if (parts?.line.isConnected && parts.words.isConnected && row?.isConnected) return;
    if (records.some(record => !record.target.closest?.('.lg-wait-line'))) schedule();
  });
  observer.observe(root, { childList: true, subtree: true });
  const timer = window.setInterval(sync, 250);
  const stopPreferences = controller.subscribe(schedule);
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', schedule);
  sync();
  return () => {
    disposed = true; observer.disconnect(); window.clearInterval(timer); cancel?.(); unsubscribe?.(); stopPreferences(); media.removeEventListener('change', schedule);
    release(); target = undefined; wording = undefined;
  };
}

function WaitingAnchor({ context, controller, sessionId }) {
  const anchor = useRef(null);
  useEffect(() => {
    const root = anchor.current?.closest('[data-conversation-session]');
    if (root && typeof sessionId === 'string') return attachWaitingLine(context, sessionId, root, controller);
  }, [context, controller, sessionId]);
  return React.createElement('span', { ref: anchor, hidden: true, 'aria-hidden': 'true', 'data-lg-wait-anchor': '' });
}

export function installWaitingLine(ctx, controller) {
  const fiber = ctx.inject(['uiConversation'], scope => {
    scope.slots.inject('conversation.input.right', () => scope.slots.register({
      name: 'conversation.input.right', id: 'liquid-glass-waiting-line', order: 41,
      inject: sessionId => ({ sessionId }),
    }, props => React.createElement(WaitingAnchor, { ...props, context: scope, controller })));
  });
  return () => fiber.dispose();
}
