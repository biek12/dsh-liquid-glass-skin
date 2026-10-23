import test from 'node:test';
import assert from 'node:assert/strict';
import { releaseTarget, assertNativeArchitecture } from '../scripts/lib/release-target.mjs';

function executable(cpu) {
  const bytes = Buffer.alloc(32);
  bytes.writeUInt32LE(0xfeedfacf, 0); bytes.writeUInt32LE(cpu, 4); bytes.writeUInt32LE(2, 12);
  return bytes;
}

test('release validation rejects stale binaries from another CPU and non-executable files', () => {
  const intel = executable(0x01000007), apple = executable(0x0100000c);
  assert.doesNotThrow(() => assertNativeArchitecture(intel, 'x64'));
  assert.doesNotThrow(() => assertNativeArchitecture(apple, 'arm64'));
  assert.throws(() => assertNativeArchitecture(intel, 'arm64'), /does not match/);
  assert.throws(() => assertNativeArchitecture(apple, 'x64'), /does not match/);
  assert.throws(() => assertNativeArchitecture(Buffer.alloc(1), 'arm64'), /truncated/);
  assert.throws(() => assertNativeArchitecture(Buffer.alloc(32), 'arm64'), /Mach-O/);
  intel.writeUInt32LE(6, 12);
  assert.throws(() => assertNativeArchitecture(intel, 'x64'), /executable/);
  assert.throws(() => releaseTarget('ia32'), /Unsupported/);
});
