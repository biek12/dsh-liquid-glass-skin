import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('lib', { recursive: true });
await mkdir('releases', { recursive: true });
await build({ entryPoints: ['src/host.js'], outfile: 'lib/index.js', bundle: true, platform: 'node', format: 'esm', target: 'node22', sourcemap: true });
await build({
  entryPoints: ['src/client.jsx'], outfile: 'lib/client.js', bundle: true, platform: 'browser', format: 'cjs', target: 'chrome130',
  external: ['react', 'react/jsx-runtime'], loader: { '.css': 'text' }, sourcemap: true,
  banner: { js: 'window.__ModuleLoader__.load({id:"dsh-liquid-glass",factory:(require)=>{var module={exports:{}};var exports=module.exports;' },
  footer: { js: 'return module.exports;}});' },
});
await import('./prepare-native-preview.mjs');
await build({ entryPoints: ['preview/main.jsx'], outfile: 'preview/dist/app.js', bundle: true, platform: 'browser', format: 'esm', loader: { '.css': 'text' }, target: 'chrome130' });
await writeFile('preview/dist/index.html', '<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DSH · Liquid Glass 交互预览</title></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>');
console.log('Built DSH host, client module and interactive preview.');
