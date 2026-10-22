import { motionReduced } from "../wait-motion.js";
import { motionEase, motionMs } from "../wait-motion.js";
const LANES = [
  { motion: "bounce", lane: "is-bounce", dots: 3 },
  { motion: "line", lane: "is-line", dots: 3 },
  { motion: "orbit", lane: "is-orbit", dots: 4 }
];
const ACTIVE = "is-active";
const LEAVING = "is-leaving";
const RESTING = "is-resting";
const FADE = "lg-wait-wait-fade";
const DOT = "lg-wait-chat-wait-dot";
const loaders = /* @__PURE__ */ new WeakMap();
function laneEntry(motion) {
  const entry = LANES.find((one) => one.motion === motion);
  if (entry === void 0) throw new Error(`chat-wait: no lane is built for ${motion} (chat-wait.css)`);
  return entry;
}
function laneOf(loader, motion) {
  const lane = loader.querySelector(`.${laneEntry(motion).lane}`);
  if (lane === null) throw new Error("chat-wait: the loader is missing a lane (chat-wait.css)");
  return lane;
}
function dotsOf(loader, motion) {
  return Array.from(laneOf(loader, motion).querySelectorAll(`.${DOT}`));
}
function place(loader, active, leaving) {
  for (const { motion } of LANES) {
    const lane = laneOf(loader, motion);
    lane.classList.toggle(ACTIVE, motion === active);
    lane.classList.toggle(LEAVING, motion === leaving);
    lane.classList.toggle(RESTING, motion !== active && motion !== leaving);
  }
}
function sharesOf(style, name) {
  return style.getPropertyValue(name).trim().split(/\s+/).filter((one) => one !== "").map(Number);
}
function timingOf(lane) {
  const style = getComputedStyle(lane);
  const fade = Number(style.getPropertyValue("--lg-wait-dot-fade"));
  if (!Number.isFinite(fade) || fade <= 0) throw new Error("chat-wait: a loader lane declares no fade length (chat-wait.css)");
  return {
    arrives: sharesOf(style, "--lg-wait-dot-arrives"),
    leaves: sharesOf(style, "--lg-wait-dot-leaves"),
    fade
  };
}
function shareAt(turn, alternate, time) {
  const passed = Math.floor(time / turn);
  const through = (time - passed * turn) / turn;
  return alternate && passed % 2 === 1 ? 1 - through : through;
}
function waitFor(turn, alternate, from, shares) {
  if (shares.length === 0) return 0;
  const step = 1;
  const cycle = turn * (alternate ? 2 : 1);
  for (let waited = 0; waited <= cycle; waited += step) {
    const share = shareAt(turn, alternate, from + waited);
    if (shares.some((one) => Math.abs(share - one) <= step / turn)) return waited;
  }
  throw new Error(`chat-wait: a loader motion never reaches ${shares.join("/")} (chat-wait.css)`);
}
function fadeDot(dot, ease, lane, leaving) {
  const motion = dot.getAnimations().find((one) => one instanceof CSSAnimation);
  const effect = motion === void 0 ? null : motion.effect;
  const time = motion === void 0 ? null : motion.currentTime;
  if (motion === void 0 || effect === null || time === null) {
    throw new Error("chat-wait: a loader dot carries no motion to hand over (chat-wait.css)");
  }
  const timing = effect.getTiming();
  const turn = typeof timing.duration === "number" ? timing.duration : 0;
  if (turn <= 0) throw new Error("chat-wait: a loader motion has no turn to fade over (chat-wait.css)");
  const alternate = timing.direction === "alternate";
  const active = Number(time) - Number(timing.delay ?? 0);
  return dot.animate(
    leaving ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }],
    {
      duration: turn * lane.fade,
      delay: waitFor(turn, alternate, active, leaving ? lane.leaves : lane.arrives),
      easing: motionEase(ease),
      // Held at both ends: a dot stays at the pose it stands at until its own
      // moment comes, and keeps the value it reached afterwards.
      fill: "both",
      id: FADE
    }
  );
}
function dropFades(loader) {
  for (const dot of loader.querySelectorAll(`.${DOT}`)) {
    for (const one of dot.getAnimations()) if (one.id === FADE) one.cancel();
  }
}
function easesOf(motion, leaving) {
  if (motion === "bounce") return leaving ? "--lg-wait-ease-damped-out" : "--lg-wait-ease-damped-in";
  return leaving ? "--lg-wait-ease-damped-in" : "--lg-wait-ease-damped-out";
}
function arrive(loader, to) {
  place(loader, to, null);
  const timing = timingOf(laneOf(loader, to));
  for (const dot of dotsOf(loader, to)) fadeDot(dot, easesOf(to, false), timing, false);
}
function handOver(loader, state, from, to) {
  dropFades(loader);
  if (motionReduced()) { state.motion = to; place(loader, to, null); return; }
  state.motion = to;
  const handOvers = ++state.handOvers;
  if (from === null) {
    arrive(loader, to);
    return;
  }
  place(loader, null, from);
  const timing = timingOf(laneOf(loader, from));
  const fades = dotsOf(loader, from).map((dot) => fadeDot(dot, easesOf(from, true), timing, true));
  void Promise.allSettled(fades.map((one) => one.finished)).then(() => {
    if (!loader.isConnected || loaders.get(loader) !== state || state.handOvers !== handOvers) return;
    arrive(loader, to);
  });
}
function nextMotion(motion) {
  const others = LANES.filter((one) => one.motion !== motion);
  return others[Math.floor(Math.random() * others.length)].motion;
}
function rotate(loader, state) {
  if (state.timer !== null) window.clearTimeout(state.timer);
  const period = motionMs("--lg-wait-period-dot-rotate");
  state.timer = window.setTimeout(() => {
    state.timer = null;
    if (!loader.isConnected) return;
    handOver(loader, state, state.motion, nextMotion(state.motion));
    rotate(loader, state);
  }, period);
}
function startWaitLoader(loader) {
  if (loaders.has(loader)) return;
  const opening = LANES[Math.floor(Math.random() * LANES.length)].motion;
  const state = { motion: opening, timer: null, handOvers: 0 };
  loaders.set(loader, state);
  if (motionReduced()) { place(loader, opening, null); return; }
  handOver(loader, state, null, opening);
  if (!motionReduced()) rotate(loader, state);
}
function releaseWaitLoader(loader) {
  const state = loaders.get(loader);
  if (state === void 0) return;
  if (state.timer !== null) window.clearTimeout(state.timer);
  dropFades(loader);
  loaders.delete(loader);
}
export {
  releaseWaitLoader,
  startWaitLoader
};
