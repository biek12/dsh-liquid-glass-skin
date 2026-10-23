import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('preview/dist', { recursive: true });
await import('./prepare-native-preview.mjs');
await build({ entryPoints: ['preview/main.jsx'], outfile: 'preview/dist/app.js', bundle: true, platform: 'browser', format: 'esm', loader: { '.css': 'text', '.png': 'dataurl', '.webp': 'dataurl' }, target: 'chrome130' });
await writeFile('preview/dist/index.html', '<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DSH Super Nexusx · DSH 超级工作台交互预览</title></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>');
console.log('Built local DSH preview.');
