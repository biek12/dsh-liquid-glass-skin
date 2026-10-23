import { BALANCE_PATH, normalizeBalance } from './balance.js';
export { BALANCE_PATH };

/** Both pet surfaces read this Host adapter, using DSH's signed-in account or its API-key credential. */
export function createBalanceReader(ctx, fetcher = fetch) {
  let pending;
  const bounded = (promise, milliseconds) => {
    let timer;
    return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Balance request timed out')), milliseconds); })]).finally(() => clearTimeout(timer));
  };
  const read = async () => {
    const account = ctx.get?.('deepseekAccount');
    let accountFailed = false;
    if (account) {
      try {
        const response = await bounded(account.getBalance({version:'0.2.1-rc.2', locale:'zh_CN', timezoneOffsetSeconds:-new Date().getTimezoneOffset()*60}), 8000);
        const value = normalizeBalance(response);
        accountFailed = response?.status === 'failed';
        if (value) return value;
      } catch { accountFailed = true; }
    }
    const credentials = ctx.get?.('credentials');
    const credential = await credentials?.resolve('DEEPSEEK_API_KEY');
    if (typeof credential?.value !== 'string' || !credential.value) {
      if (accountFailed) throw new Error('Balance request failed');
      return null;
    }
    const result = await fetcher('https://api.deepseek.com/user/balance', {
      headers:{Authorization:`Bearer ${credential.value}`}, signal:AbortSignal.timeout(10000),
    });
    if (!result.ok) throw new Error('Balance request failed');
    return normalizeBalance(await result.json());
  };
  return () => pending ??= read().finally(() => { pending = null; });
}
export function createBalanceHandler(read) {
  return async (req, res) => {
    const send = (status, value) => { res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(value)); };
    if (req.method !== 'GET') return send(405, {});
    if (req.headers['x-dsh-liquid-glass'] !== '1' || req.headers['sec-fetch-site'] === 'cross-site') return send(403, {});
    if (req.headers.origin) { try { if (new URL(req.headers.origin).host !== req.headers.host) return send(403, {}); } catch { return send(403, {}); } }
    try { send(200, await read()); } catch { send(503, {}); }
  };
}
