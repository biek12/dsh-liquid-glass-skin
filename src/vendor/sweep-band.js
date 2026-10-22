import { buildElement } from "../wait-motion.js";
const SWEEP_BAND_CLASS = "lg-wait-sweep-band";
const SWEEP_GLYPHS_CLASS = "lg-wait-sweep-glyphs";
function buildSweepBand(text) {
  const band = buildElement("span", SWEEP_BAND_CLASS);
  band.setAttribute("aria-hidden", "true");
  band.inert = true;
  const glyphs = buildElement("span", SWEEP_GLYPHS_CLASS);
  if (text !== null) glyphs.setAttribute("data-text", text);
  band.appendChild(glyphs);
  return { band, glyphs };
}
export {
  SWEEP_BAND_CLASS,
  SWEEP_GLYPHS_CLASS,
  buildSweepBand
};
