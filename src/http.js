import { applyOperation } from './model.js';
export const API_PATH = '/plugins/dsh-liquid-glass/v1/state';
const send = (res, status, value) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(value));
};
/** Revision checks run inside the same queue as the durable write. */
export function createStateHandler({ read, write, catalog }) {
  let tail = Promise.resolve();
  return async (req, res) => {
    if (req.headers['x-dsh-liquid-glass'] !== '1' || req.headers['sec-fetch-site'] === 'cross-site') return send(res, 403, { error: '请从 DSH 界面访问' });
    if (req.headers.origin) {
      try { if (new URL(req.headers.origin).host !== req.headers.host) return send(res, 403, { error: '请求来源不匹配' }); }
      catch { return send(res, 403, { error: '请求来源无效' }); }
    }
    if (req.method === 'GET') return send(res, 200, { state: read() });
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return send(res, 405, { error: '不支持的请求方式' }); }
    if (!req.headers['content-type']?.startsWith('application/json')) return send(res, 415, { error: '需要 JSON 请求' });
    let body;
    try {
      const chunks = []; let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 65536) return send(res, 413, { error: '操作数据过大' });
        chunks.push(chunk);
      }
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch { return send(res, 400, { error: '请求数据格式不正确' }); }
    const commit = async () => {
      try {
        const current = read();
        if (body.revision !== current.revision) return send(res, 409, { error: '目录已在另一窗口更新，请重试', state: current });
        let next;
        try { next = applyOperation(current, body.operation, catalog()); }
        catch (error) { return send(res, 400, { error: error.message }); }
        await write(next);
        send(res, 200, { state: next });
      } catch { send(res, 500, { error: '保存失败，原数据已保留。请重试。' }); }
    };
    const operation = tail.then(commit); tail = operation.catch(() => {}); await operation;
  };
}
