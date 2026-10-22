import { callArgsOf, callString } from "./call-args.js";
function callDescription(block) {
  if (block.phase !== "start") return null;
  const args = callArgsOf(block.argsRaw ?? "");
  const description = args === null ? void 0 : callString(args, ["description"]);
  if (description === void 0) return null;
  const line = description.split("\n", 1)[0].replace(/\s+/g, " ").trim();
  if (line === "") return null;
  return line.charAt(0).toUpperCase() + line.slice(1);
}
export {
  callDescription
};
