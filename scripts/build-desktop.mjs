import { mkdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname } from 'node:path';
import { parseArgs } from 'node:util';
import { releaseTarget, assertNativeArchitecture } from './lib/release-target.mjs';

if (process.platform !== 'darwin') throw new Error('macOS desktop releases must be built with the macOS SDK');
const { values } = parseArgs({ options: { arch: { type: 'string', default: process.arch }, output: { type: 'string', default: 'lib/desktop/PetCompanion' } } });
const target = releaseTarget(values.arch);
await mkdir(dirname(values.output), { recursive: true });
const sdk = spawnSync('xcrun', ['--show-sdk-path'], { encoding: 'utf8' });
if (sdk.error) throw sdk.error;
if (sdk.status !== 0) throw new Error(sdk.stderr || 'Could not locate macOS SDK');
const compiler = spawnSync('xcrun', ['swiftc', 'desktop/PetCompanion.swift', '-O', '-sdk', sdk.stdout.trim(), '-target', target.swiftTarget, '-framework', 'AppKit', '-framework', 'WebKit', '-o', values.output], { stdio: 'inherit' });
if (compiler.error) throw compiler.error;
if (compiler.status !== 0) throw new Error(`Swift compiler failed (${compiler.status})`);
assertNativeArchitecture(await readFile(values.output), target.arch);
console.log(`Built macOS ${target.arch} desktop companion: ${values.output}`);
