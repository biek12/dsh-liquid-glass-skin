import { z } from 'zod';
import { emptyState, validateState } from './model.js';
import { API_PATH, createStateHandler } from './http.js';

export const name = 'liquid-glass';
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
export async function apply(ctx) {
  const domain = await ctx.storageDomain.open(domainSpec);
  ctx.effect(() => {
    const disposeRoute = ctx.webServer.register({
      kind: 'exact', path: API_PATH,
      handler: createStateHandler({
        read: () => domain.global.get(),
        write: next => domain.global.set(next),
        catalog: () => ctx.workspaceRegistry.list().map(w => ({ workspaceId: w.id, sessionIds: [...w.sessionIds] })),
      }),
    });
    return async () => { disposeRoute(); await domain.close(); };
  }, 'liquid-glass: durable directory metadata and HTTP route');
}
