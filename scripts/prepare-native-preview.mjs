// Local QA fixture only. Native CSS is read from this machine's DSH installation,
// excluded from the plugin package and source control.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const core = process.env.DSH_MODULE_ROOT || '/Applications/DSH Desktop Beta.app/Contents/Resources/app/node_modules/@deepseek-ai';
const extract = async (pkg, moduleName) => {
  const source = await readFile(`${core}/${pkg}/lib/client.js`, 'utf8');
  const marker = `var ${moduleName}_module_css_default = `;
  const end = source.indexOf(marker); if (end < 0) throw new Error(`Missing native ${moduleName}`);
  const cssMatches = [...source.slice(0, end).matchAll(/const css(?:\$\d+)? = ("(?:[^"\\]|\\.)*");/g)];
  const css = JSON.parse(cssMatches.at(-1)[1]);
  const start = end + marker.length; const close = source.indexOf('};', start) + 1;
  return { css, classes: JSON.parse(source.slice(start, close)) };
};
const sidebar = await extract('dsh-client-ui-sidebar', 'SidebarRoot');
const frame = await extract('dsh-client-ui-layout', 'AppFrame');
const shimmerCss = await readFile(`${core}/dsh-client-ui-primitives/lib/TextShimmer.module.css`, 'utf8');
const shimmer = { css: shimmerCss.replace(/\.(root|content|text|decoration|sweep|highlight)\b/g, '.nativeShimmer_$1'), classes: Object.fromEntries(['root','content','text','decoration','sweep','highlight'].map(k => [k, `nativeShimmer_${k}`])) };
const hero = await extract('dsh-client-ui-conversation', 'HeroShell');
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/native-shell-fixture.js', `export const sidebar = ${JSON.stringify(sidebar)};\nexport const hero = ${JSON.stringify(hero)};\nexport const frame = ${JSON.stringify(frame)};\nexport const shimmer = ${JSON.stringify(shimmer)};\n`);
