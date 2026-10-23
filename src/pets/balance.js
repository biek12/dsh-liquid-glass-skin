/** Account wallets and API-key balances share one display shape. No credentials leave the Host. */
export const BALANCE_PATH = '/plugins/dsh-super-nexusx/v1/balance';
const amount = value => (typeof value === 'number' || typeof value === 'string' && value.trim() !== '') && Number.isFinite(Number(value)) ? Number(value) : null;
export function normalizeBalance(response) {
  const result = response?.ok === true ? response.value : response;
  if (!result) return null;
  if (result.status === 'ready') {
    const currencies = new Map();
    for (const [wallets, field] of [[result.value, 'toppedUp'], [result.bonusWallets, 'granted']]) {
      for (const wallet of Array.isArray(wallets) ? wallets : []) {
        const value = amount(wallet?.balance);
        if (value === null || typeof wallet.currency !== 'string') continue;
        const currency = wallet.currency.toUpperCase();
        const entry = currencies.get(currency) ?? { currency, toppedUp: 0, granted: 0, total: 0 };
        entry[field] += value; entry.total += value; currencies.set(currency, entry);
      }
    }
    return currencies.size ? { balances: [...currencies.values()] } : null;
  }
  const entries = Array.isArray(result.balances) ? result.balances : (Array.isArray(result.balance_infos) ? result.balance_infos : []).map(row => ({ currency:row.currency, total:row.total_balance, granted:row.granted_balance, toppedUp:row.topped_up_balance }));
  const balances = (entries ?? []).filter(row => typeof row?.currency === 'string' && amount(row.total) !== null)
    .map(row => ({ currency:row.currency, total:amount(row.total), granted:amount(row.granted), toppedUp:amount(row.toppedUp) }));
  return balances.length ? { balances } : null;
}
export function formatBalance(balance) {
  return balance?.balances.map(row => `${row.currency === 'CNY' ? '¥' : row.currency === 'USD' ? '$' : row.currency + ' '}${row.total.toFixed(2)}`).join(' / ') ?? '—';
}
