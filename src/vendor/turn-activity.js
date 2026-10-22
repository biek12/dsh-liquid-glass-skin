import { readTurnActivity } from "./read-turn-activity.js";
const BRAND_DEEPSEEK = "deepseek";
import { activityPhrase } from "./activity-phrase.js";
import { callDescription } from "./call-description.js";
import { fileToolCall } from "./file-tool.js";
const THINKING_KEY = "chatWaitThinking";
const ACTIVITY_THINKING = { key: THINKING_KEY };
const ACTIVITY_WRITING = { key: "chatWaitWriting" };
const ACTIVITY_TOOL_CALL = { key: "chatWaitToolCall", aboutCall: "generic" };
const ACTIVITY_TOOLS = { key: "chatWaitTools", aboutCall: "generic" };
function waitingWord(brand, hostWord, skinWord) {
  return brand === BRAND_DEEPSEEK ? hostWord : skinWord;
}
const ACTIVITY_FILE = {
  read: { key: "chatWaitReading", aboutCall: "detail" },
  edit: { key: "chatWaitEditing", aboutCall: "detail" },
  write: { key: "chatWaitWritingFile", aboutCall: "detail" }
};
function activityWords(snapshot, turn, precise) {
  if (snapshot === null || turn === void 0) return null;
  const activity = readTurnActivity(snapshot, turn);
  if (activity === null) return null;
  if (activity.kind === "tools") return precise ? toolWords(activity.call) : ACTIVITY_TOOLS;
  const newest = activity.newest;
  if (newest === "reasoning") {
    if (!precise) return ACTIVITY_THINKING;
    const phrase = reasoningPhrase(activity.assistant);
    return phrase === null ? ACTIVITY_THINKING : { key: null, text: phrase };
  }
  if (newest === "tool-call") return ACTIVITY_TOOL_CALL;
  if (newest === null) return null;
  return ACTIVITY_WRITING;
}
function toolWords(call) {
  const file = fileToolCall(call);
  if (file !== null) return { ...ACTIVITY_FILE[file.operation], params: { file: file.file } };
  const description = callDescription(call);
  if (description !== null) return { key: null, text: description, aboutCall: "detail" };
  return ACTIVITY_TOOLS;
}
function reasoningPhrase(assistant) {
  const blocks = assistant.blocks;
  const newest = blocks.length === 0 ? void 0 : blocks[blocks.length - 1];
  if (newest === void 0 || newest.kind !== "reasoning" || typeof newest.text !== "string") return null;
  return activityPhrase(newest.text);
}
export {
  ACTIVITY_THINKING,
  ACTIVITY_TOOLS,
  ACTIVITY_TOOL_CALL,
  ACTIVITY_WRITING,
  THINKING_KEY,
  activityWords,
  waitingWord
};
