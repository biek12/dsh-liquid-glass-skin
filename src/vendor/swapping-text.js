import { observeSize } from "../wait-motion.js";
import { requestFrame } from "../wait-motion.js";
import { motionReduced } from "../wait-motion.js";
import { motionMs } from "../wait-motion.js";
import { buildSweepBand } from "./sweep-band.js";
const SIZER_CLASS = "lg-wait-swap-sizer";
const SIZER_WORD_CLASS = "lg-wait-swap-sizer-word";
const COPY_CLASS = "lg-wait-swap-copy";
const swapped = /* @__PURE__ */ new WeakMap();
function stateOf(element) {
  let state = swapped.get(element);
  if (state === void 0) {
    state = { written: false, sizerWidth: null, unobserve: null, swap: null, settle: null, width: null, travel: null, frame: null };
    swapped.set(element, state);
  }
  return state;
}
function wordsIn(element) {
  const texts = [];
  for (const copy of element.querySelectorAll(`.${COPY_CLASS}`)) texts.push(copy.textContent ?? "");
  texts.push(element.dataset.text ?? "");
  return texts;
}
function fillCopy(copy, text, withShimmer) {
  copy.replaceChildren(text);
  copy.setAttribute("data-text", text);
  if (withShimmer) copy.appendChild(buildSweepBand(text).band);
}
function buildCopy(text, withShimmer, extraClass = "") {
  const copy = document.createElement("span");
  copy.className = COPY_CLASS + extraClass + (withShimmer ? " lg-wait-swap-shimmer" : "");
  fillCopy(copy, text, withShimmer);
  return copy;
}
function sizerOf(element, state) {
  const first = element.firstElementChild;
  if (first !== null && first.classList.contains(SIZER_CLASS)) return first;
  const sizer = document.createElement("span");
  sizer.className = SIZER_CLASS;
  sizer.setAttribute("aria-hidden", "true");
  element.textContent = "";
  element.appendChild(sizer);
  state.unobserve?.();
  state.unobserve = observeSize(sizer, (entries) => {
    state.sizerWidth = entries[entries.length - 1].borderBoxSize[0].inlineSize;
    if (state.width !== null) afterRender(element, state);
  });
  return sizer;
}
function layWords(sizer, texts) {
  const unique = [...new Set(texts)];
  const standing = Array.from(sizer.children, (word) => word.textContent ?? "");
  if (standing.length === unique.length && standing.every((text, at) => text === unique[at])) return false;
  sizer.replaceChildren(...unique.map((text) => {
    const word = document.createElement("span");
    word.className = SIZER_WORD_CLASS;
    word.textContent = text;
    return word;
  }));
  return true;
}
function letGo(element, state) {
  if (state.travel !== null) window.clearTimeout(state.travel);
  state.travel = null;
  if (state.width === null) return;
  state.width = null;
  element.style.width = "";
}
function afterRender(element, state) {
  state.frame?.();
  state.frame = requestFrame({
    write() {
      state.frame = requestFrame({
        write() {
          state.frame = null;
          advance(element, state);
        }
      });
    }
  });
}
function holdWords(element, state) {
  const changed = layWords(sizerOf(element, state), wordsIn(element));
  if (changed && state.width === null && state.sizerWidth !== null && !motionReduced()) {
    element.style.width = `${state.sizerWidth}px`;
    state.width = state.sizerWidth;
  }
  afterRender(element, state);
}
function advance(element, state) {
  if (state.swap !== null && !state.swap.moving) startSwap(element, state, state.swap);
  if (state.width === null || state.sizerWidth === null) return;
  const to = state.sizerWidth;
  if (motionReduced()) letGo(element, state);
  else if (state.width === to) {
    if (state.travel === null) letGo(element, state);
  } else {
    element.style.width = `${to}px`;
    state.width = to;
    if (state.travel !== null) window.clearTimeout(state.travel);
    state.travel = window.setTimeout(() => {
      state.travel = null;
      if (state.frame === null) letGo(element, state);
    }, motionMs("--lg-wait-duration-slide"));
  }
}
function startSwap(element, state, swap) {
  swap.moving = true;
  swap.leaving.classList.add("is-exit");
  const gap = motionMs("--lg-wait-duration-swap-gap");
  if (gap > 0) state.enterTimer = window.setTimeout(() => { state.enterTimer = null; swap.entering.classList.remove("is-enter-start"); }, gap);
  else swap.entering.classList.remove("is-enter-start");
  state.settle = window.setTimeout(() => {
    state.settle = null;
    state.swap = null;
    if (!element.isConnected) return;
    swap.leaving.remove();
    holdWords(element, state);
  }, Math.max(motionMs("--lg-wait-duration-swap") + gap, motionMs("--lg-wait-duration-slide")));
}
function halt(element, state) {
  if (state.enterTimer != null) window.clearTimeout(state.enterTimer);
  state.enterTimer = null;
  if (state.settle !== null) window.clearTimeout(state.settle);
  state.settle = null;
  state.frame?.();
  state.frame = null;
  state.swap = null;
  letGo(element, state);
}
function setSwappingText(element, text, withShimmer = false) {
  const state = stateOf(element);
  const was = element.dataset.text;
  if (state.written && was === text) return;
  const first = !state.written;
  if (!element.classList.contains("lg-wait-swap-label")) element.classList.add("lg-wait-swap-label");
  state.written = true;
  if (first || motionReduced()) {
    halt(element, state);
    const sizer = sizerOf(element, state);
    const standing = buildCopy(text, withShimmer);
    while (element.childNodes.length > 1) element.removeChild(element.lastChild);
    element.appendChild(standing);
    element.dataset.text = text;
    layWords(sizer, [text]);
    return;
  }
  if (state.swap !== null && state.swap.entering.parentNode === element) {
    fillCopy(state.swap.entering, text, withShimmer);
    element.dataset.text = text;
    holdWords(element, state);
    return;
  }
  if (state.settle !== null) window.clearTimeout(state.settle);
  state.settle = null;
  const leaving = buildCopy(was ?? "", withShimmer);
  leaving.setAttribute("aria-hidden", "true");
  sizerOf(element, state);
  while (element.childNodes.length > 1) element.removeChild(element.lastChild);
  element.appendChild(leaving);
  const entering = buildCopy(text, withShimmer, " is-enter-start");
  entering.setAttribute("aria-hidden", "true");
  element.appendChild(entering);
  element.dataset.text = text;
  state.swap = { leaving, entering, moving: false };
  holdWords(element, state);
}
function releaseSwappingText(element) {
  const state = swapped.get(element);
  if (state === void 0) return;
  halt(element, state);
  state.unobserve?.();
  swapped.delete(element);
}
export {
  releaseSwappingText,
  setSwappingText
};
