const PHRASE_TAIL_CHARS = 800;
const SENTENCE_MARKS = /[.!?\u2026\u3002\uff01\uff1f]+$/;
const CLOSERS = /[\s"'\u201d\u2019\u300d\u300f\uff09)\]]+$/;
const CLAUSE_END = /[,;:\u2014\u2013)\uff0c\uff1b\uff1a\uff09]/;
const QUOTED = /「[^」]*」|『[^』]*』|“[^”]*”|"[^"]*"/g;
const WORD = /[A-Za-z\u2019']+/g;
const QUALIFIERS = /* @__PURE__ */ new Set(["not", "now", "currently", "still", "just", "already", "again", "simply", "only", "also", "really"]);
const QUALIFIER_LIMIT = 2;
const NOMINAL_ING = /* @__PURE__ */ new Set(["nothing", "anything", "everything", "something", "thing", "morning", "evening"]);
const CONTRACTED_AUX = /['\u2019](m|re|s|ve)$/;
let segmenter = null;
let scannedText = "";
let scannedPhrase = null;
function endedSentences(text) {
  if (segmenter === null) segmenter = new Intl.Segmenter(void 0, { granularity: "sentence" });
  const sentences = [];
  for (const piece of segmenter.segment(text)) {
    if (SENTENCE_MARKS.test(piece.segment.replace(CLOSERS, ""))) sentences.push(piece.segment);
  }
  return sentences.reverse();
}
function stripMarkup(text) {
  return text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/`|\*\*|__|~~/g, "");
}
function withoutQuotes(sentence) {
  return sentence.replace(QUOTED, (quoted) => " ".repeat(quoted.length));
}
function isParticiple(token) {
  return /^[a-z]+ing$/i.test(token) && !NOMINAL_ING.has(token.toLowerCase());
}
function auxiliaryOf(token) {
  const lower = token.toLowerCase();
  const contracted = CONTRACTED_AUX.exec(lower);
  const form = contracted === null ? lower : contracted[1];
  if (form === "am" || form === "is" || form === "are" || form === "m" || form === "re") return "present";
  if (form === "have" || form === "has" || form === "had" || form === "ve") return "perfect";
  return form === "s" ? "either" : null;
}
function clauseBody(scanned, sentence, from) {
  const stop = scanned.slice(from).search(CLAUSE_END);
  const end = stop === -1 ? sentence.length : from + stop;
  const body = stripMarkup(sentence.slice(from, end));
  return body.replace(CLOSERS, "").replace(SENTENCE_MARKS, "").replace(/\s+/g, " ").trim();
}
function englishClause(sentence) {
  const scanned = withoutQuotes(sentence);
  const words = [...scanned.matchAll(WORD)].map((match) => ({ text: match[0], end: (match.index ?? 0) + match[0].length }));
  let phrase = null;
  for (let at = 0; at < words.length; at++) {
    const head = auxiliaryOf(words[at].text);
    if (head === null) continue;
    let next = at + 1;
    const aspect = head === "either" ? words[next]?.text.toLowerCase() === "been" ? "perfect" : "present" : head;
    if (aspect === "perfect") {
      if (words[next]?.text.toLowerCase() !== "been") continue;
      next += 1;
    }
    let negated = false;
    let taken = 0;
    while (taken < QUALIFIER_LIMIT && next < words.length && QUALIFIERS.has(words[next].text.toLowerCase())) {
      if (words[next].text.toLowerCase() === "not") negated = true;
      next += 1;
      taken += 1;
    }
    if (negated || next >= words.length || !isParticiple(words[next].text)) continue;
    const participle = words[next].text;
    const body = clauseBody(scanned, sentence, words[next].end);
    phrase = `${participle.charAt(0).toUpperCase()}${participle.slice(1)}${body === "" ? "" : ` ${body}`}`;
  }
  return phrase;
}
function activityPhrase(text) {
  if (text === scannedText) return scannedPhrase;
  const tail = text.length <= PHRASE_TAIL_CHARS ? text : text.slice(-PHRASE_TAIL_CHARS);
  scannedText = text;
  scannedPhrase = null;
  for (const sentence of endedSentences(tail)) {
    const clause = englishClause(sentence);
    if (clause !== null) {
      scannedPhrase = clause;
      break;
    }
  }
  return scannedPhrase;
}
export {
  PHRASE_TAIL_CHARS,
  activityPhrase
};
