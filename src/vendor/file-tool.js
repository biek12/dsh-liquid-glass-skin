import { callArgsOf, callString } from "./call-args.js";
function fileToolOperation(toolName) {
  if (toolName === "read") return "read";
  if (toolName === "edit") return "edit";
  if (toolName === "write") return "write";
  return null;
}
function fileName(path) {
  const at = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  return at === -1 ? path : path.slice(at + 1);
}
function fileToolCall(block) {
  if (block.phase !== "start") return null;
  const operation = fileToolOperation(block.name ?? "");
  if (operation === null) return null;
  const args = callArgsOf(block.argsRaw ?? "");
  const path = args === null ? void 0 : callString(args, ["path", "file_path"]);
  if (path === void 0) return null;
  const file = fileName(path);
  if (file === "") return null;
  return { operation, file };
}
export {
  fileName,
  fileToolCall,
  fileToolOperation
};
