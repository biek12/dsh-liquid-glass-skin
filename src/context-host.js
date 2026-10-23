export const CONTEXT_PATH = '/plugins/dsh-liquid-glass/v1/context';
export function createContextRelay() {
  let current = {};
  const read = () => Date.now() - (current.updatedAt ?? 0) < 90000 ? current : {};
  const handler = async (req, res) => {
    const send = (status, value) => { res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(value)); };
    if (req.headers['x-dsh-liquid-glass'] !== '1' || req.headers['sec-fetch-site'] === 'cross-site') return send(403, {error:'请从 DSH 界面访问'});
    if (req.headers.origin) { try { if (new URL(req.headers.origin).host !== req.headers.host) return send(403, {}); } catch { return send(403, {}); } }
    if (req.method === 'GET') return send(200, read());
    if (req.method !== 'POST') return send(405, {});
    try {
      let body = ''; for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 2048) return send(413, {}); }
      const input = JSON.parse(body), value = { updatedAt:Date.now() };
      for (const key of ['tokens','occupancy','todayTokens']) value[key] = Number.isFinite(input[key]) && input[key] >= 0 ? input[key] : null;
      for (const key of ['todayCost','sessionCost','sessionId']) value[key] = typeof input[key] === 'string' && input[key].length <= 240 ? input[key] : null;
      current = value; send(200, value);
    } catch { send(400, {error:'上下文摘要无效'}); }
  };
  return { read, handler };
}
