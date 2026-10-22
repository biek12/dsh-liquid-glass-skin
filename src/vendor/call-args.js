function callArgsOf(argsRaw) {
  let value;
  try {
    value = JSON.parse(argsRaw);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value;
}
function callString(args, keys) {
  for (const key of keys) {
    const value = args[key];
    if (typeof value === "string" && value !== "") return value;
  }
  return void 0;
}
export {
  callArgsOf,
  callString
};
