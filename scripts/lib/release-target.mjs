import assert from 'node:assert/strict';

export function releaseTarget(arch = process.arch) {
  assert.ok(['arm64', 'x64'].includes(arch), `Unsupported macOS CPU architecture: ${arch}`);
  return { platform: 'darwin', arch, swiftTarget: `${arch === 'x64' ? 'x86_64' : arch}-apple-macos13.0` };
}

export function releaseName(pkg, target) {
  return `${pkg.name}-${pkg.version}-${target.platform}-${target.arch}.tgz`;
}

/** Reject stale or mislabeled executables before they can enter a release. */
export function assertNativeArchitecture(bytes, arch) {
  assert.ok(bytes.length >= 32, 'Missing or truncated desktop companion');
  assert.equal(bytes.readUInt32LE(0), 0xfeedfacf, 'Desktop companion must be a thin 64-bit Mach-O executable');
  assert.equal(bytes.readUInt32LE(4), arch === 'arm64' ? 0x0100000c : 0x01000007, `Desktop companion does not match ${arch}`);
  assert.equal(bytes.readUInt32LE(12), 2, 'Desktop companion must be an executable');
}
