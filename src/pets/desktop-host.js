import { createServer } from 'node:http';
import { readFile, access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const DESKTOP_PATH = '/plugins/dsh-liquid-glass/v1/desktop';
const send = (res, status, data) => { res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(data)); };
export function createDesktopPet({ stateHandler, read, getBalance, getContext = () => ({}), getCompletions = () => null, assets = new URL('./desktop/', import.meta.url) }) {
  let child, server, lastError = '', closing = false;
  let operations = Promise.resolve();
  const enqueue = task => { const result = operations.then(task); operations = result.catch(()=>{}); return result; };
  const executable = fileURLToPath(new URL('PetCompanion', assets));
  const status = async () => ({ supported: process.platform === 'darwin' && await access(executable).then(()=>true,()=>false), running: !!child, error: lastError });
  const stop = async () => {
    closing = true;
    const old = child; child = null;
    if (old && old.exitCode === null) old.kill('SIGTERM');
    const oldServer = server; server = null;
    oldServer?.closeAllConnections(); if (oldServer) await new Promise(resolve=>oldServer.close(resolve));
    closing = false;
  };
  const start = async () => {
    if (child) return;
    if (!(await status()).supported) throw new Error('当前平台没有可运行的桌面伴随模块');
    const token = randomUUID();
    const authorized = req => {
      const value = Buffer.from(req.headers.authorization?.replace(/^Bearer /,'') ?? ''); const expected = Buffer.from(token);
      return value.length === expected.length && timingSafeEqual(value, expected);
    };
    const js = await readFile(new URL('pet.js',assets),'utf8');
    server = createServer(async (req,res) => {
      const path = new URL(req.url,'http://127.0.0.1').pathname;
      res.setHeader('X-Content-Type-Options','nosniff');
      if (path === '/' && req.method === 'GET') {
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; img-src data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'"});
        res.end('<!doctype html><html><meta charset="UTF-8"><title>DSH 陪伴宠物</title><div id="root"></div><script src="/pet.js"></script></html>'); return;
      }
      if (path === '/pet.js' && req.method === 'GET') { res.writeHead(200, {'Content-Type':'text/javascript','Cache-Control':'no-store'});res.end(js);return; }
      if (!authorized(req)) return send(res,403,{error:'未授权的桌面连接'});
      if (path === '/state') {
        // Reuse the exact revision/write queue used by the DSH window.
        delete req.headers.origin; req.headers['sec-fetch-site']='same-origin';req.headers['x-dsh-liquid-glass']='1';
        return stateHandler(req,res);
      }
      if (path === '/context' && req.method === 'GET') return send(res,200,getContext());
      if (path === '/completions' && req.method === 'GET') return send(res,200,getCompletions());
      if (path === '/balance' && req.method === 'GET') {
        try { return send(res,200,await getBalance()); }
        catch { return send(res,503,{error:'账户余额暂时无法读取'}); }
      }
      send(res,404,{error:'未知桌面请求'});
    });
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    const url = `http://127.0.0.1:${server.address().port}/#${token}`;
    const launched=spawn(executable,[url],{stdio:['ignore','ignore','pipe']});child=launched;lastError='';
    launched.stderr.on('data',()=>{}); // WebKit diagnostics never enter account or chat logs.
    await new Promise((resolve,reject)=>{launched.once('spawn',resolve);launched.once('error',reject);}).catch(async error=>{lastError=error.message;await stop();throw error;});
    launched.once('exit',(code)=>{if(child===launched){child=null;if(!closing&&code)lastError=`桌面窗口已退出（${code}）`;server?.closeAllConnections();server?.close();server=null;}});
  };
  return {
    status, start: () => enqueue(start), stop: () => enqueue(stop),
    sync(preferences) { if(child && (!preferences.petEnabled || !preferences.petDesktop)) void enqueue(stop); },
    async handler(req,res) {
      if(req.headers['x-dsh-liquid-glass']!=='1'||req.headers['sec-fetch-site']==='cross-site')return send(res,403,{error:'请从 DSH 设置访问'});
      if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)return send(res,403,{error:'请求来源不匹配'});}catch{return send(res,403,{error:'请求来源无效'});}}
      if(req.method==='GET')return send(res,200,await status());
      if(req.method!=='POST')return send(res,405,{error:'不支持的请求方式'});
      try {
        const chunks=[];let length=0;for await(const chunk of req){length+=chunk.length;if(length>1024)return send(res,413,{error:'请求过大'});chunks.push(chunk);}
        const {action}=JSON.parse(Buffer.concat(chunks).toString());
        if(action==='start'){if(!read().preferences.petEnabled)throw new Error('请先显示宠物');await enqueue(start);}
        else if(action==='stop')await enqueue(stop);
        else if(action==='recover'){if(child)child.kill('SIGUSR1');}
        else return send(res,400,{error:'未知操作'});
        send(res,200,await status());
      }catch(error){lastError=error.message;send(res,500,{error:error.message});}
    },
  };
}
