import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
await import('./prepare-context.mjs');
await mkdir('lib', { recursive: true });
await mkdir('lib/desktop', { recursive: true });
await import('./prepare-notification-chime.mjs');
await build({ entryPoints: ['src/host.js'], outfile: 'lib/index.js', bundle: true, platform: 'node', format: 'esm', target: 'node22', sourcemap: true });
await build({ entryPoints: ['desktop/main.jsx'], outfile: 'lib/desktop/pet.js', bundle: true, platform: 'browser', format: 'iife', loader: { '.css':'text', '.png':'dataurl', '.webp':'dataurl' }, target:'safari17' });
await build({
  entryPoints: ['src/client.jsx'], outfile: 'lib/client.js', bundle: true, platform: 'browser', format: 'cjs', target: 'chrome130',
  external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', '@deepseek-ai/dsh-client-ui-primitives'], loader: { '.css': 'text', '.png': 'dataurl', '.webp': 'dataurl' }, sourcemap: true,
  banner: { js: 'window.__ModuleLoader__.load({id:"dsh-super-nexusx",factory:(require)=>{var module={exports:{}};var exports=module.exports;' },
  footer: { js: 'return module.exports;}});' },
});
console.log('Built DSH host, client and desktop web assets.');
