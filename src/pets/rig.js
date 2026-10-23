// All coordinates refer to one immutable 256px reference per character.
// No per-frame crop, bounding-box fitting, scaling, or silhouette centering.
export const RIGS = {
  nori: {
    cycle: 5600, head: [123, 165, 145, 173],
    parts: [[90, 51, 31, 39, 96, 78], [186, 81, 32, 34, 170, 97], [188, 194, 34, 43, 172, 216], [113, 204, 21, 33, 127, 178], [78, 211, 21, 28, 93, 183]],
    eyes: [
      { center: [94, 105], radius: [17, 20], source: [89, 106], sourceRadius: [20, 20], slope: .31 },
      { center: [149, 121], radius: [17, 20], source: [152, 124], sourceRadius: [20, 20], slope: .31 },
    ],
  },
  yuki: {
    cycle: 6700, head: [139, 155, 137, 169],
    parts: [[95, 88, 33, 39, 111, 117], [176, 58, 31, 43, 163, 96], [94, 192, 53, 41, 164, 215], [156, 187, 23, 36, 157, 163], [176, 189, 18, 32, 169, 166]],
    eyes: [
      { center: [127, 116], radius: [16, 16], source: [131, 122], sourceRadius: [20, 17], slope: -.30 },
      { center: [171, 101], radius: [14, 16], source: [179, 104], sourceRadius: [18, 18], slope: -.35 },
    ],
  },
  mizu: {
    cycle: 4800, head: [112, 196, 178, 208],
    parts: [[44, 191, 23, 26, 57, 181], [173, 202, 31, 27, 153, 184], [207, 151, 34, 31, 184, 173], [173, 201, 30, 26, 153, 184], [43, 191, 22, 26, 57, 181]],
    eyes: [
      { center: [54, 158], radius: [11, 15], source: [56, 166], sourceRadius: [13, 17], slope: .28 },
      { center: [121, 169], radius: [15, 16], source: [124, 177], sourceRadius: [18, 17], slope: .10 },
    ],
  },
};
export const POSE_KEYS = ['head', 'earLeft', 'earRight', 'tail', 'paw', 'otherPaw', 'blink', 'reach'];
const smooth = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const pulse = (t, start, duration) => t < start || t > start + duration ? 0 : Math.sin((t - start) / duration * Math.PI) ** 2;
function blinkAt(t, start) {
  t -= start;
  if (t < 0 || t > 270) return 0;
  if (t < 90) return smooth(t / 90);
  if (t < 135) return 1;
  return 1 - smooth((t - 135) / 135);
}
export function samplePose(id, state, elapsed, velocity = 0, animationElapsed = elapsed) {
  const rig = RIGS[id]; const t = Math.max(0, elapsed); const phase = t % rig.cycle;
  const whale = id === 'mizu', fox = id === 'yuki';
  const eyePhase = Math.max(0, animationElapsed) % rig.cycle;
  const blinkStart = fox ? 2200 : 1500;
  const pose = { head: Math.sin(phase / rig.cycle * Math.PI * 2) * (fox ? .085 : whale ? .10 : .075), earLeft: 0, earRight: 0, tail: Math.sin(phase / rig.cycle * Math.PI * 2) * (fox ? .045 : .07), paw: 0, otherPaw: 0, blink: Math.max(blinkAt(eyePhase, blinkStart), blinkAt(eyePhase, blinkStart + 2000)), reach: 0 };
  pose.earLeft = pulse(phase, 3000, 650) * (fox ? -.07 : .055);
  pose.earRight = pulse(phase, 3160, 700) * (fox ? .05 : -.035);
  if (state === 'hover') {
    const greet = pulse(t, 0, fox ? 1600 : 1250);
    pose.head += greet * (fox ? -.15 : whale ? .13 : .14);
    pose.paw = greet * (whale ? -.20 : -.075);
    pose.tail += greet * (fox ? -.055 : .06);
    pose.earLeft += greet * -.035;
    pose.blink = Math.max(pose.blink, blinkAt(t, whale ? 640 : fox ? 900 : 700));
  }
  if (state === 'drag') {
    pose.head += velocity * -.075;
    pose.earLeft = fox ? -.065 : .055;
    pose.earRight = fox ? .045 : -.06;
    pose.tail = Math.sin(t / (whale ? 380 : 520)) * .10 - velocity * .035;
    pose.paw = (whale ? -.15 : -.045) + Math.sin(t / 360) * .025;
    pose.otherPaw = (whale ? .08 : .04) - Math.sin(t / 440) * .025;
    pose.reach = whale ? 2 : fox ? 5 : 13;
    // The independent eye clock continues through long drags and state changes.
  }
  if (state === 'land') {
    pose.paw = pulse(t, 0, 550) * .04;
    pose.otherPaw = -pose.paw;
    pose.tail *= .5;
    pose.blink = Math.max(pose.blink, blinkAt(t, 180));
  }
  return pose;
}
export function mixPose(from, to, progress) {
  const a = smooth(progress);
  return Object.fromEntries(POSE_KEYS.map(key => [key, from[key] + (to[key] - from[key]) * a]));
}
const dimensions = 256;
const fieldsCache = new Map();
function fieldsFor(id) {
  if (fieldsCache.has(id)) return fieldsCache.get(id);
  const rig = RIGS[id]; const fields = [];
  for (let p = 0; p < 6; p++) {
    const field = new Float32Array(dimensions * dimensions * 3);
    for (let y = 0; y < dimensions; y++) for (let x = 0; x < dimensions; x++) {
      let w, px, py;
      if (p === 0) {
        [px, py] = rig.head;
        w = 1 - smooth((y - rig.head[2]) / (rig.head[3] - rig.head[2]));
        // Whale face stays anchored; its fins provide the main movement.
        if (id === 'mizu') w *= .35;
      } else {
        const [cx, cy, rx, ry, ax, ay] = rig.parts[p - 1]; px = ax; py = ay;
        const r = Math.hypot((x - cx) / rx, (y - cy) / ry);
        w = 1 - smooth((r - .25) / .85);
      }
      const pin = id === 'nori' ? [145, 183] : id === 'yuki' ? [149, 176] : [100, 210];
      w *= smooth((Math.hypot(x - pin[0], y - pin[1]) - 7) / 9);
      const i = (y * dimensions + x) * 3;
      field[i] = -(y - py) * w; field[i + 1] = (x - px) * w; field[i + 2] = w;
    }
    fields.push(field);
  }
  fieldsCache.set(id, fields); return fields;
}
// Bilinear samples use premultiplied alpha to avoid dark fringes on moving fur.
function sample(data, x, y, out) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  out.fill(0);
  for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
    const sx = ix + dx, sy = iy + dy;
    if (sx < 0 || sy < 0 || sx >= 256 || sy >= 256) continue;
    const i = (sy * 256 + sx) * 4, w = (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy), a = data[i + 3] / 255;
    for (let c = 0; c < 3; c++) out[c] += data[i + c] * a * w;
    out[3] += a * w;
  }
  if (out[3] > 0) for (let c = 0; c < 3; c++) out[c] /= out[3];
  out[3] *= 255;
}
export function createRigRenderer(id, open, closed) {
  const fields = fieldsFor(id), out = new Uint8ClampedArray(256 * 256 * 4);
  const color = new Float64Array(4), eye = new Float64Array(4), lid = new Float64Array(4);
  return pose => {
    const angles = [pose.head, pose.earLeft, pose.earRight, pose.tail, pose.paw, pose.otherPaw];
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const n = y * 256 + x, i = n * 4, f = n * 3;
      let sx = x, sy = y;
      for (let p = 0; p < 6; p++) { sx -= fields[p][f] * angles[p]; sy -= fields[p][f + 1] * angles[p]; }
      sy -= Math.max(fields[4][f + 2], fields[5][f + 2]) * pose.reach;
      if (sx === x && sy === y) color.set(open.subarray(i, i + 4)); else sample(open, sx, sy, color);
      if (pose.blink > 0) for (const e of RIGS[id].eyes) {
        const dx = sx - e.center[0], dy = sy - e.center[1] - dx * e.slope;
        const r = Math.hypot(dx / e.radius[0], dy / e.radius[1]);
        if (r >= 1) continue;
        const mask = 1 - smooth((r - .78) / .22);
        const aperture = Math.max(.001, 1 - pose.blink);
        const inEye = (1 - smooth((Math.abs(dy) / e.radius[1] - aperture * .78) / .12)) * (1 - smooth((pose.blink - .9) / .1));
        sample(closed, e.source[0] + dx * e.sourceRadius[0] / e.radius[0], e.source[1] + dy * e.sourceRadius[1] / e.radius[1] + dx * e.slope, lid);
        sample(open, sx, e.center[1] + dy / Math.max(.08, aperture) + dx * e.slope, eye);
        // Revealing eyelids occludes the pupil; there is no whole-image dissolve.
        const blend = mask * smooth(pose.blink / .18);
        for (let c = 0; c < 3; c++) color[c] = color[c] * (1 - blend) + (lid[c] * (1 - inEye) + eye[c] * inEye) * blend;
      }
      out.set(color, i);
    }
    return out;
  };
}
