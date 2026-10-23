import { createCompletionFeed, COMPLETIONS_PATH } from './pets/completions-host.js';
import { createBalanceReader, createBalanceHandler, BALANCE_PATH } from './pets/account-host.js';
import { createContextRelay, CONTEXT_PATH } from './context-host.js';
import * as contextPlugin from '../vendor/dsh-context/lib/index.js';
export { Config } from '../vendor/dsh-context/lib/index.js';
import { z } from 'zod';
import { emptyState, validateState } from './model.js';
import { API_PATH, createStateHandler } from './http.js';
import { createDesktopPet, DESKTOP_PATH } from './pets/desktop-host.js';

export const name = 'dsh-super-nexusx';
export const inject = ['webServer', 'storageDomain', 'workspaceRegistry'];

/** A public DomainSpec. No changes to DSH's workspace or Session schemas. */
export const domainSpec = {
  name: 'liquid_glass', version: 1, tables: {},
  global: {
    initial: emptyState(),
    schema: z.unknown().transform((value, context) => {
      try { return validateState(value); }
      catch (error) { context.addIssue({ code: 'custom', message: error.message }); return z.NEVER; }
    }),
  },
};
export async function apply(ctx, config = {}) {
  ctx.inject(['sessionProjections'], scope => { scope.plugin(contextPlugin, config); });
  const domain = await ctx.storageDomain.open(domainSpec);
  ctx.effect(() => {
    const getBalance = createBalanceReader(ctx);
    const releaseBalance = ctx.webServer.register({kind:'exact', path:BALANCE_PATH, handler:createBalanceHandler(getBalance)});
    const completions = createCompletionFeed(ctx, () => domain.global.get().preferences);
    const releaseCompletions = ctx.webServer.register({kind:'exact',path:COMPLETIONS_PATH,handler:createBalanceHandler(completions.read)});
    let desktop;
    const contextRelay = createContextRelay();
    const releaseContext = ctx.webServer.register({kind:'exact',path:CONTEXT_PATH,handler:contextRelay.handler});
    const handler = createStateHandler({
      read: () => domain.global.get(),
      write: async next => { await domain.global.set(next); desktop?.sync(next.preferences); },
      catalog: () => ctx.workspaceRegistry.list().map(w => ({ workspaceId: w.id, sessionIds: [...w.sessionIds] })),
    });
    desktop = createDesktopPet({ getContext: contextRelay.read, stateHandler: handler, read: () => domain.global.get(), getBalance, getCompletions:completions.read });
    const disposeDesktopRoute = ctx.webServer.register({ kind:'exact', path:DESKTOP_PATH, handler:desktop.handler });
    const preferences=domain.global.get().preferences;
    if(preferences.petEnabled&&preferences.petDesktop) desktop.start().catch(error=>ctx.logger?.warn(error.message));
    const disposeRoute = ctx.webServer.register({
      kind: 'exact', path: API_PATH,
      handler,
    });
    return async () => { completions.dispose(); releaseCompletions(); releaseContext(); disposeRoute(); disposeDesktopRoute(); releaseBalance(); await desktop.stop(); await domain.close(); };
  }, 'liquid-glass: durable directory metadata and HTTP route');
}
