import { useEffect, useState } from 'react';
import { normalizeBalance } from './balance.js';

/** Refresh while the card is visible; a transient failure keeps the last successful figure. */
export function useBalance(read, open) {
  const [balance, setBalance] = useState(null);
  useEffect(() => { setBalance(null); }, [read]);
  useEffect(() => {
    let disposed = false, pending = false, retryTimer, request;
    let failures = 0;
    if (!read) return;
    const refresh = async () => {
      if (pending) return;
      pending = true;
      request = new AbortController();
      const timeout = setTimeout(() => request.abort(), 20000);
      try {
        const value = normalizeBalance(await read(request.signal));
        failures = 0;
        if (!disposed) setBalance(value);
      } catch {
        // Quiet retry with backoff. A slow request never blocks closing the bubble.
        if (!disposed) retryTimer = setTimeout(refresh, Math.min(60000, 5000 * 2 ** failures++));
      }
      finally { clearTimeout(timeout); pending = false; }
    };
    if (open) void refresh();
    const timer = open ? setInterval(refresh, 60000) : null;
    return () => { disposed = true; clearInterval(timer); clearTimeout(retryTimer); request?.abort(); };
  }, [read, open]);
  return balance;
}
