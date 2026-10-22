/** Owned attributes only: changing settings never remounts or restarts the hero. */
const fields = { motion: 'lgMotion', orb: 'lgOrb', statusGlow: 'lgStatusGlow', hoverLine: 'lgHoverLine', glass: 'lgGlass' };
export function syncPresentation(preferences, body = document.body) {
  for (const [key, attribute] of Object.entries(fields)) {
    const value = String(preferences[key]);
    if (body.dataset[attribute] !== value) body.dataset[attribute] = value;
  }
}
export function clearPresentation(body = document.body) {
  for (const attribute of Object.values(fields)) delete body.dataset[attribute];
}
