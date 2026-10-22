const WAIT_OVERTIME_MS = 1e4;
function waitStart(turn, now) {
  const wrote = turn.steps.some((step) => {
    const assistant = step.data.get("assistant-step");
    return assistant !== void 0 && assistant.blocks.length > 0;
  });
  return !wrote && turn.start !== void 0 ? turn.start.time : now;
}
function openTurn(snapshot) {
  let found;
  for (const turn of snapshot.timeline.turns.values()) {
    if (turn.status !== "open") continue;
    if (found === void 0 || turn.turn > found.turn) found = turn;
  }
  return found;
}
const WORD_LOCK_MS = 1e3;
function wordForPass(reading, row, now) {
  const waiting = reading.detail !== null ? reading.detail : reading.onCall ? void 0 : row?.pending;
  const held = reading.word === null ? row?.held : reading.own ? reading.word : void 0;
  if (row !== void 0 && now < row.standing.until) {
    return { word: row.standing.word, row: keeps(row.standing, waiting, held) };
  }
  const candidate = waiting ?? reading.word ?? held ?? reading.host;
  const standing = row !== void 0 && row.standing.word === candidate ? row.standing : { word: candidate, until: now + WORD_LOCK_MS };
  return { word: candidate, row: keeps(standing, void 0, held) };
}
function keeps(standing, pending, held) {
  const row = { standing };
  if (pending !== void 0) row.pending = pending;
  if (held !== void 0) row.held = held;
  return row;
}
export {
  WAIT_OVERTIME_MS,
  WORD_LOCK_MS,
  openTurn,
  waitStart,
  wordForPass
};
