import React, { useMemo, useSyncExternalStore } from 'react';
import * as ReactDOM from 'react-dom';
import { createEffortSlider } from './vendor/effort-slider.js';

export function createEffortRuntime() {
  return createEffortSlider(React, ReactDOM);
}

export function EffortSeat({ runtime, context, controller, ...props }) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  const media = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)'), []);
  const reducedMotion = useSyncExternalStore(
    listener => { media?.addEventListener('change', listener); return () => media?.removeEventListener('change', listener); },
    () => media?.matches === true,
    () => false,
  );
  return React.createElement(runtime.__internals.CodexEffortSlider, {
    ...props, __ctx: context, motion: state.state.preferences.motion, reducedMotion,
  });
}

export function installEffortSlider(ctx, controller) {
  const fiber = ctx.inject(['modelDirectories', 'remote', 'remote.session'], scope => {
    scope.effect(() => {
      const runtime = createEffortRuntime();
      runtime.__internals.installStyles();
      const release = scope.slots.inject('conversation.input.right', () => scope.slots.register({
        name: 'conversation.input.right', id: 'liquid-glass-effort-slider', order: 40,
        inject: sessionId => ({ sessionId }),
      }, props => React.createElement(EffortSeat, { ...props, runtime, context: scope, controller })));
      return () => { release(); runtime.dispose(); };
    });
  });
  return () => fiber.dispose();
}
