import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = new Map([['/', ['index.html', 'text/html; charset=utf-8']], ['/app.js', ['app.js', 'text/javascript; charset=utf-8']]]);
const server = createServer(async (req, res) => {
  const entry = files.get(new URL(req.url, 'http://localhost').pathname);
  if (!entry) { res.writeHead(404); res.end(); return; }
  try { const content = await readFile(new URL(`../preview/dist/${entry[0]}`, import.meta.url)); res.writeHead(200, { 'Content-Type': entry[1], 'Cache-Control': 'no-store' }); res.end(content); }
  catch { res.writeHead(503); res.end('Run npm run build:preview first.'); }
});
server.listen(4178, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4178'));
