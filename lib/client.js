window.__ModuleLoader__.load({id:"dsh-liquid-glass",factory:(require)=>{var module={exports:{}};var exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react6 = __toESM(require("react"), 1);

// src/ui.jsx
var import_react3 = __toESM(require("react"), 1);

// src/rail-menu.jsx
var import_react2 = __toESM(require("react"), 1);

// src/model.js
var STATUSES = { none: "\u65E0\u72B6\u6001", todo: "\u672A\u5F00\u59CB", doing: "\u8FDB\u884C\u4E2D", done: "\u5DF2\u5B8C\u6210", paused: "\u6401\u7F6E" };
var COLORS = { default: "#8e8e93", blue: "#007aff", purple: "#af52de", pink: "#ff2d55", orange: "#ff9500", green: "#34a853", teal: "#00a5a8" };
var DEFAULT_PREFERENCES = Object.freeze({ theme: true, tree: true, motion: "full", orb: true, statusGlow: true, hoverLine: true, glass: "frosted", density: "comfortable", showTags: true, showCounts: true });
var PRESENTATION_DEFAULTS = Object.fromEntries(Object.entries(DEFAULT_PREFERENCES).filter(([key]) => !["theme", "tree"].includes(key)));
var emptyState = () => ({ version: 1, revision: 0, folders: [], sessions: {}, preferences: { ...DEFAULT_PREFERENCES } });
var safeId = (value) => typeof value === "string" && value.length > 0 && value.length <= 240 && !["__proto__", "constructor", "prototype"].includes(value);
var fail = (message) => {
  throw new Error(message);
};
var text = (value, length, label) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= length ? value.trim() : fail(`${label}\u4E0D\u80FD\u4E3A\u7A7A\uFF0C\u4E14\u6700\u591A ${length} \u4E2A\u5B57\u7B26`);
var validMeta = (item) => {
  if (!(item.status in STATUSES) || !Object.hasOwn(STATUSES, item.status)) fail("\u672A\u77E5\u72B6\u6001");
  if (!Object.hasOwn(COLORS, item.color)) fail("\u672A\u77E5\u989C\u8272");
  if (typeof item.icon !== "string" || item.icon.length > 12) fail("\u56FE\u6807\u6700\u591A 12 \u4E2A\u5B57\u7B26");
  if (typeof item.starred !== "boolean") fail("\u6536\u85CF\u683C\u5F0F\u9519\u8BEF");
  if (!Array.isArray(item.tags) || item.tags.length > 12 || new Set(item.tags).size !== item.tags.length || item.tags.some((t) => typeof t !== "string" || !t.trim() || t.length > 30)) fail("\u6700\u591A 12 \u4E2A\u6807\u7B7E\uFF0C\u6BCF\u4E2A\u6700\u591A 30 \u5B57");
};
var defaultMeta = () => ({ status: "none", color: "default", icon: "", tags: [], starred: false });
function validateState(input) {
  if (!input || input.version !== 1 || !Number.isSafeInteger(input.revision) || input.revision < 0) fail("\u76EE\u5F55\u6570\u636E\u7248\u672C\u4E0D\u6B63\u786E");
  if (!Array.isArray(input.folders) || input.folders.length > 5e3 || !input.sessions || Array.isArray(input.sessions) || typeof input.sessions !== "object" || Object.keys(input.sessions).length > 5e4) fail("\u76EE\u5F55\u6570\u636E\u683C\u5F0F\u4E0D\u6B63\u786E");
  if (typeof input.preferences?.theme !== "boolean" || typeof input.preferences?.tree !== "boolean") fail("\u504F\u597D\u8BBE\u7F6E\u683C\u5F0F\u9519\u8BEF");
  const preferences = { ...DEFAULT_PREFERENCES, ...input.preferences };
  for (const key of ["theme", "tree", "orb", "statusGlow", "hoverLine", "showTags", "showCounts"]) if (typeof preferences[key] !== "boolean") fail("\u504F\u597D\u8BBE\u7F6E\u683C\u5F0F\u9519\u8BEF");
  for (const [key, values] of Object.entries({ motion: ["full", "soft", "off"], glass: ["frosted", "solid"], density: ["comfortable", "compact"] })) if (!values.includes(preferences[key])) fail("\u672A\u77E5\u5916\u89C2\u8BBE\u7F6E");
  const byId = /* @__PURE__ */ new Map();
  for (const folder of input.folders) {
    if (!safeId(folder.id) || !safeId(folder.workspaceId) || byId.has(folder.id)) fail("\u76EE\u5F55 ID \u65E0\u6548\u6216\u91CD\u590D");
    if (folder.parentId !== null && !safeId(folder.parentId)) fail("\u4E0A\u7EA7\u76EE\u5F55\u65E0\u6548");
    if (text(folder.name, 80, "\u76EE\u5F55\u540D\u79F0") !== folder.name) fail("\u76EE\u5F55\u540D\u79F0\u5305\u542B\u9996\u5C3E\u7A7A\u683C");
    if (!Number.isFinite(folder.order)) fail("\u76EE\u5F55\u987A\u5E8F\u65E0\u6548");
    validMeta(folder);
    byId.set(folder.id, folder);
  }
  for (const folder of input.folders) {
    const seen = /* @__PURE__ */ new Set([folder.id]);
    let parentId = folder.parentId;
    while (parentId !== null) {
      const parent = byId.get(parentId);
      if (!parent || parent.workspaceId !== folder.workspaceId) fail("\u4E0A\u7EA7\u76EE\u5F55\u5FC5\u987B\u5728\u540C\u4E00\u5DE5\u4F5C\u533A");
      if (seen.has(parentId)) fail("\u4E0D\u80FD\u5C06\u76EE\u5F55\u79FB\u5165\u81EA\u8EAB\u6216\u5176\u5B50\u76EE\u5F55");
      seen.add(parentId);
      if (seen.size > 64) fail("\u76EE\u5F55\u6700\u591A\u5D4C\u5957 64 \u5C42");
      parentId = parent.parentId;
    }
  }
  for (const [id, item] of Object.entries(input.sessions)) {
    if (!safeId(id) || !safeId(item.workspaceId) || !Number.isFinite(item.order)) fail("\u4F1A\u8BDD\u5F52\u7C7B\u683C\u5F0F\u9519\u8BEF");
    if (item.folderId !== null) {
      const folder = byId.get(item.folderId);
      if (!folder || folder.workspaceId !== item.workspaceId) fail("\u4F1A\u8BDD\u53EA\u80FD\u79FB\u5230\u5F53\u524D\u5DE5\u4F5C\u533A\u7684\u76EE\u5F55");
    }
    validMeta(item);
  }
  return { ...structuredClone(input), preferences };
}
function folderPath(state, id) {
  const path = [];
  const seen = /* @__PURE__ */ new Set();
  while (id) {
    if (seen.has(id)) break;
    seen.add(id);
    const f = state.folders.find((f2) => f2.id === id);
    if (!f) break;
    path.unshift(f.name);
    id = f.parentId;
  }
  return path.join(" / ");
}

// src/menu.jsx
var import_react = __toESM(require("react"), 1);
function placeMenu(anchor, size, viewport) {
  const gap = 7;
  const edge = 8;
  let x = anchor.x;
  let y = anchor.y;
  if (anchor.align === "end") x -= size.width;
  if (y + size.height > viewport.height - edge) y = (anchor.top ?? anchor.y) - size.height - gap;
  return { x: Math.max(edge, Math.min(x, viewport.width - size.width - edge)), y: Math.max(edge, Math.min(y, viewport.height - size.height - edge)) };
}
function RowMenu({ menu, close, children }) {
  const ref = (0, import_react.useRef)();
  (0, import_react.useLayoutEffect)(() => {
    const node = ref.current;
    node.showPopover?.();
    const position = placeMenu(menu.anchor, { width: node.offsetWidth, height: node.offsetHeight }, { width: window.innerWidth, height: window.innerHeight });
    node.style.left = `${position.x}px`;
    node.style.top = `${position.y}px`;
    node.querySelector('[role="menuitem"]')?.focus({ preventScroll: true });
    const dismiss = (event) => {
      if (!node.contains(event.target)) close();
    };
    const scroll = (event) => {
      if (!node.contains(event.target)) close();
    };
    document.addEventListener("pointerdown", dismiss, true);
    document.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", dismiss, true);
      document.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", close);
      node.hidePopover?.();
      if (menu.trigger?.isConnected) menu.trigger.focus({ preventScroll: true });
    };
  }, [menu]);
  const keyboard = (event) => {
    const buttons = [...ref.current.querySelectorAll('[role="menuitem"]:not(:disabled)')];
    const index = buttons.indexOf(document.activeElement);
    if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next]?.focus({ preventScroll: true });
  };
  return /* @__PURE__ */ import_react.default.createElement("div", { ref, popover: "manual", role: "menu", "aria-label": `${menu.title} \u7684\u64CD\u4F5C`, className: "lg-row-menu", onKeyDown: keyboard }, children);
}

// src/rail-menu.jsx
function railChildren(state, catalog, parent) {
  if (!parent) return catalog.map((w) => ({ kind: "workspace", id: w.workspaceId, title: w.title, workspaceId: w.workspaceId, count: w.sessions.length }));
  const workspace = catalog.find((w) => w.workspaceId === parent.workspaceId);
  if (!workspace) return [];
  const folderId = parent.kind === "workspace" ? null : parent.id;
  const folders = state.folders.filter((f) => f.workspaceId === workspace.workspaceId && f.parentId === folderId).sort((a, b) => a.order - b.order).map((f) => ({ ...f, kind: "folder", title: f.name }));
  const sessions = workspace.sessions.filter((s) => (state.sessions[s.id]?.workspaceId === workspace.workspaceId ? state.sessions[s.id].folderId : null) === folderId).map((s, index) => ({ ...s, kind: "session", workspaceId: workspace.workspaceId, order: state.sessions[s.id]?.order ?? index })).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || a.order - b.order);
  return [...sessions.filter((s) => s.pinned), ...folders, ...sessions.filter((s) => !s.pinned)];
}
function RailMenu({ state, catalog, activeId, openSession, createSession, createWorkspace, onNativeView, error }) {
  const [open, setOpen] = (0, import_react2.useState)(false), [path, setPath] = (0, import_react2.useState)([]), [anchor, setAnchor] = (0, import_react2.useState)({ x: 0, y: 0 });
  const [working, setWorking] = (0, import_react2.useState)(false), [failure, setFailure] = (0, import_react2.useState)("");
  const pinnedOpen = (0, import_react2.useRef)(false);
  const trigger = (0, import_react2.useRef)(), popup = (0, import_react2.useRef)(), delay = (0, import_react2.useRef)(), hover = (0, import_react2.useRef)(), focusNext = (0, import_react2.useRef)(null);
  const maxColumns = Math.max(1, Math.min(3, Math.floor(((typeof window === "undefined" ? 800 : window.innerWidth) - 16) / 244)));
  const columns = [{ parent: null, rows: railChildren(state, catalog, null) }];
  for (const entry of path) {
    const parent = columns.at(-1).rows.find((row) => row.id === entry && row.kind !== "session");
    if (!parent) break;
    columns.push({ parent, rows: railChildren(state, catalog, parent) });
  }
  const first = Math.max(0, columns.length - maxColumns);
  const visible = columns.slice(first);
  const cancelClose = () => clearTimeout(delay.current);
  const close = (restore = false) => {
    pinnedOpen.current = false;
    clearTimeout(hover.current);
    cancelClose();
    setOpen(false);
    if (restore) trigger.current?.focus();
  };
  const scheduleClose = () => {
    if (pinnedOpen.current) return;
    clearTimeout(hover.current);
    cancelClose();
    delay.current = setTimeout(() => close(), 320);
  };
  const show = (keyboard2 = false) => {
    if (keyboard2) pinnedOpen.current = true;
    cancelClose();
    const box = trigger.current.getBoundingClientRect();
    setAnchor({ x: box.right + 8, y: box.top, top: box.top });
    if (!open) setPath([]);
    focusNext.current = keyboard2 ? 0 : null;
    setOpen(true);
  };
  const descend = (row, level, keyboard2 = false) => {
    clearTimeout(hover.current);
    if (row.kind === "session") {
      setPath(path.slice(0, level));
      return;
    }
    focusNext.current = keyboard2 ? level + 1 : null;
    setPath([...path.slice(0, level), row.id]);
  };
  (0, import_react2.useEffect)(() => () => {
    clearTimeout(delay.current);
    clearTimeout(hover.current);
  }, []);
  (0, import_react2.useLayoutEffect)(() => {
    if (!open) return;
    const node = popup.current;
    node.showPopover?.();
    const position = placeMenu(anchor, { width: node.offsetWidth, height: node.offsetHeight }, { width: window.innerWidth, height: window.innerHeight });
    node.style.left = `${position.x}px`;
    node.style.top = `${position.y}px`;
    if (focusNext.current !== null) {
      node.querySelector(`[data-level="${focusNext.current}"] [role="menuitem"]`)?.focus({ preventScroll: true });
      focusNext.current = null;
    }
  }, [open, anchor, path, catalog, state]);
  (0, import_react2.useEffect)(() => {
    if (!open) return;
    const dismiss = (e) => {
      if (!popup.current?.contains(e.target) && !trigger.current.contains(e.target)) close();
    };
    const resize = () => close();
    document.addEventListener("pointerdown", dismiss, true);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", dismiss, true);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  const run = async (action, reopenRoot = false) => {
    if (working) return;
    close();
    setWorking(true);
    setFailure("");
    try {
      const result = await action();
      if (reopenRoot && result) {
        setPath([]);
        show(true);
      }
    } catch (error2) {
      setFailure(error2.message);
      setPath([]);
      show(true);
    } finally {
      setWorking(false);
    }
  };
  const back = (level, keyboard2 = false) => {
    focusNext.current = keyboard2 ? Math.max(0, level - 1) : null;
    setPath(path.slice(0, Math.max(0, level - 1)));
  };
  const keyboard = (event, level, row) => {
    const key = event.key;
    if (key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if (key === "Tab") {
      close();
      return;
    }
    if (key === "ArrowRight" && row && row.kind !== "session") {
      event.preventDefault();
      descend(row, level, true);
      return;
    }
    if (key === "ArrowLeft") {
      event.preventDefault();
      if (level) back(level, true);
      else close(true);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;
    event.preventDefault();
    const buttons = [...event.currentTarget.closest(".lg-cascade-column").querySelectorAll('[role="menuitem"]:not(:disabled)')];
    const i = buttons.indexOf(document.activeElement);
    buttons[key === "Home" ? 0 : key === "End" ? buttons.length - 1 : (i + (key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
  };
  return /* @__PURE__ */ import_react2.default.createElement("section", { className: "lg-workspace-rail", "aria-label": "\u5DE5\u4F5C\u533A\u5FEB\u6377\u83DC\u5355" }, /* @__PURE__ */ import_react2.default.createElement("button", { ref: trigger, className: "lg-rail-button", "aria-label": "\u6D4F\u89C8\u5DE5\u4F5C\u533A\u4E0E\u4F1A\u8BDD", "aria-haspopup": "menu", "aria-expanded": open, title: failure || "\u6D4F\u89C8\u5DE5\u4F5C\u533A\u4E0E\u4F1A\u8BDD", disabled: working, onPointerEnter: () => show(), onPointerLeave: scheduleClose, onClick: () => show(true), onKeyDown: (e) => {
    if (["ArrowDown", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      show(true);
    }
  } }, /* @__PURE__ */ import_react2.default.createElement(Icon, { name: "book", size: 20 }), (error || failure) && /* @__PURE__ */ import_react2.default.createElement("i", { className: "lg-rail-error" })), open && /* @__PURE__ */ import_react2.default.createElement("div", { ref: popup, popover: "manual", className: "lg-cascade", "aria-label": "\u5DE5\u4F5C\u533A\u60AC\u6D6E\u76EE\u5F55", onPointerEnter: cancelClose, onPointerLeave: scheduleClose }, visible.map(({ parent, rows }, index) => {
    const level = first + index;
    return /* @__PURE__ */ import_react2.default.createElement("section", { className: "lg-cascade-column", "data-level": level, key: parent?.id ?? "root" }, /* @__PURE__ */ import_react2.default.createElement("header", null, level > 0 && /* @__PURE__ */ import_react2.default.createElement("button", { "aria-label": "\u8FD4\u56DE\u4E0A\u4E00\u7EA7\u76EE\u5F55", onClick: () => back(level) }, /* @__PURE__ */ import_react2.default.createElement(Icon, { name: "chevron", size: 12 })), /* @__PURE__ */ import_react2.default.createElement("span", { title: parent?.title }, parent?.title ?? "\u6211\u7684\u5DE5\u4F5C\u533A"), first > 0 && index === 0 && /* @__PURE__ */ import_react2.default.createElement("button", { "aria-label": "\u8FD4\u56DE\u5168\u90E8\u5DE5\u4F5C\u533A", onClick: () => setPath([]) }, /* @__PURE__ */ import_react2.default.createElement(Icon, { name: "book", size: 13 }))), /* @__PURE__ */ import_react2.default.createElement("div", { role: "menu", "aria-label": parent ? `${parent.title} \u7684\u76EE\u5F55\u4E0E\u4F1A\u8BDD` : "\u5DE5\u4F5C\u533A\u5217\u8868", className: "lg-cascade-list" }, rows.map((row) => /* @__PURE__ */ import_react2.default.createElement("button", { key: row.id, role: "menuitem", "data-cascade-id": row.id, "aria-current": row.kind === "session" && row.id === activeId ? "page" : void 0, "aria-haspopup": row.kind !== "session" ? "menu" : void 0, "aria-expanded": row.kind !== "session" ? path[level] === row.id : void 0, className: path[level] === row.id ? "is-open" : "", title: row.title || "\u65B0\u4F1A\u8BDD", onPointerEnter: () => {
      clearTimeout(hover.current);
      hover.current = setTimeout(() => descend(row, level), 140);
    }, onKeyDown: (e) => keyboard(e, level, row), onClick: () => {
      if (row.kind === "session") {
        close();
        openSession(row.id);
      } else descend(row, level, true);
    } }, /* @__PURE__ */ import_react2.default.createElement("span", { style: { color: COLORS[row.color] ?? "var(--lg-muted)" } }, /* @__PURE__ */ import_react2.default.createElement(Icon, { name: row.kind === "workspace" ? "book" : row.kind === "folder" ? "folder" : "chat" })), /* @__PURE__ */ import_react2.default.createElement("span", null, row.title || "\u65B0\u4F1A\u8BDD"), row.pinned && /* @__PURE__ */ import_react2.default.createElement(Icon, { name: "pin", size: 11 }), " ", row.kind !== "session" && /* @__PURE__ */ import_react2.default.createElement(Icon, { name: "chevron", size: 11 }))), !rows.length && /* @__PURE__ */ import_react2.default.createElement("p", { className: "lg-cascade-empty" }, "\u8FD9\u91CC\u8FD8\u6CA1\u6709\u76EE\u5F55\u6216\u4F1A\u8BDD")), parent && createSession && /* @__PURE__ */ import_react2.default.createElement("footer", null, /* @__PURE__ */ import_react2.default.createElement("button", { role: "menuitem", onKeyDown: (e) => keyboard(e, level), disabled: working, onClick: () => run(() => createSession(parent.workspaceId, parent.kind === "folder" ? parent.id : null)) }, /* @__PURE__ */ import_react2.default.createElement(Icon, { name: "plus", size: 14 }), "\u65B0\u5EFA\u4F1A\u8BDD")), !parent && /* @__PURE__ */ import_react2.default.createElement("footer", null, failure && /* @__PURE__ */ import_react2.default.createElement("p", { role: "alert", className: "lg-cascade-error" }, failure), createWorkspace && /* @__PURE__ */ import_react2.default.createElement("button", { role: "menuitem", disabled: working, onKeyDown: (e) => keyboard(e, level), onClick: () => run(createWorkspace, true) }, /* @__PURE__ */ import_react2.default.createElement(Icon, { name: "plus", size: 14 }), "\u6DFB\u52A0\u5DE5\u4F5C\u533A"), onNativeView && /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("button", { role: "menuitem", onKeyDown: (e) => keyboard(e, level), onClick: () => {
      close();
      onNativeView();
    } }, /* @__PURE__ */ import_react2.default.createElement(Icon, { name: "folder", size: 14 }), "\u66F4\u591A\u5DE5\u4F5C\u533A\u7BA1\u7406"))));
  })));
}

// src/ui.jsx
var paths = {
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",
  chat: "M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-9.5A8.5 8.5 0 0 1 11.5 3h1a8.5 8.5 0 0 1 8.5 8.5Z",
  plus: "M12 5v14M5 12h14",
  chevron: "m9 5 7 7-7 7",
  search: "M21 21l-4.4-4.4M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z",
  sliders: "M4 7h16M4 17h16M8 4v6M16 14v6",
  close: "m6 6 12 12M6 18 18 6",
  check: "m5 12 4 4L19 6",
  book: "M12 6v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v14c-4-1-6 0-9 2-3-2-5-3-9-2Z",
  sun: "M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  pin: "m8 3 8 0-1 6 4 4v2h-6v6l-1-2-1 2v-6H5v-2l4-4Z",
  fork: "M6 3v12a4 4 0 0 0 4 4h8M6 7h8a4 4 0 0 0 4-4M15 16l3 3-3 3",
  copy: "M8 8h12v13H8ZM16 8V3H3v13h5",
  edit: "m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14Z",
  trash: "M4 7h16M9 3h6l1 4H8ZM6 7l1 14h10l1-14M10 11v6M14 11v6",
  archive: "M3 4h18v5H3ZM5 9v12h14V9M10 13h4",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  glass: "M4 5h16l-2 10H6ZM12 15v6M8 21h8"
};
var Icon = ({ name, size = 16, ...props }) => /* @__PURE__ */ import_react3.default.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.65", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...props }, /* @__PURE__ */ import_react3.default.createElement("path", { d: paths[name] || paths.folder }));
var useSource = (source) => (0, import_react3.useSyncExternalStore)(source.subscribe, source.getSnapshot, source.getSnapshot);
var parseTags = (text2) => [...new Set(text2.split(/[,，;；\n]/).map((t) => t.trim()).filter(Boolean))];
var DRAG_TYPE = "application/x-dsh-liquid-glass";
function Modal({ children, title, close }) {
  const ref = (0, import_react3.useRef)();
  (0, import_react3.useEffect)(() => {
    const dialog = ref.current;
    dialog.showModal();
    dialog.querySelector("input")?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);
  return /* @__PURE__ */ import_react3.default.createElement("dialog", { ref, className: "lg-dialog", "aria-label": title, onCancel: close, onClick: (e) => {
    if (e.target === e.currentTarget) {
      const r = e.currentTarget.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
    }
  } }, /* @__PURE__ */ import_react3.default.createElement("header", null, /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("h2", null, title)), /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-icon-button", "aria-label": "\u5173\u95ED", onClick: close }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "close" }))), children);
}
function Editor({ editor, state, controller, close }) {
  const isFolder = editor.kind === "folder";
  const creating = editor.create;
  const initial = creating ? { ...defaultMeta(), name: "", parentId: editor.parentId } : isFolder ? state.folders.find((f) => f.id === editor.id) : state.sessions[editor.id] ?? { ...defaultMeta(), folderId: null };
  const [draft, setDraft] = (0, import_react3.useState)(initial);
  const [tags, setTags] = (0, import_react3.useState)(initial.tags.join("\uFF0C"));
  const [busy, setBusy] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)("");
  const [deleting, setDeleting] = (0, import_react3.useState)(false);
  const patch = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const folders = state.folders.filter((f) => f.workspaceId === editor.workspaceId && (!isFolder || !isDescendant(f.id, editor.id, state)));
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const metadata = { status: draft.status, color: draft.color, icon: draft.icon, starred: draft.starred, tags: parseTags(tags) };
      if (creating) {
        const id = crypto.randomUUID();
        await controller.mutate({ type: "folder.create", id, workspaceId: editor.workspaceId, parentId: draft.parentId, name: draft.name, meta: metadata });
      } else if (isFolder) {
        await controller.mutate({ type: "folder.update", id: editor.id, name: draft.name, parentId: draft.parentId, patch: metadata });
      } else {
        await controller.mutate({ type: "session.update", id: editor.id, workspaceId: editor.workspaceId, folderId: draft.folderId, patch: metadata });
      }
      close();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    setBusy(true);
    try {
      await controller.mutate({ type: "folder.delete", id: editor.id });
      close();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };
  return /* @__PURE__ */ import_react3.default.createElement(Modal, { title: creating ? "\u65B0\u5EFA\u5B50\u76EE\u5F55" : isFolder ? "\u7F16\u8F91\u76EE\u5F55" : "\u4F1A\u8BDD\u6807\u8BB0\u4E0E\u5F52\u7C7B", close: () => {
    if (!busy) close();
  } }, /* @__PURE__ */ import_react3.default.createElement("form", { onSubmit: submit }, isFolder && /* @__PURE__ */ import_react3.default.createElement("label", null, "\u76EE\u5F55\u540D\u79F0", /* @__PURE__ */ import_react3.default.createElement("input", { autoFocus: true, required: true, maxLength: 80, value: draft.name, placeholder: "\u4F8B\u5982\uFF1A\u4EA7\u54C1\u8BBE\u8BA1", onChange: (e) => patch("name", e.target.value) })), !isFolder && /* @__PURE__ */ import_react3.default.createElement("p", { className: "lg-editor-session" }, editor.title), /* @__PURE__ */ import_react3.default.createElement("label", null, isFolder ? "\u4E0A\u7EA7\u76EE\u5F55" : "\u6240\u5728\u76EE\u5F55", /* @__PURE__ */ import_react3.default.createElement("select", { value: (isFolder ? draft.parentId : draft.folderId) ?? "", onChange: (e) => patch(isFolder ? "parentId" : "folderId", e.target.value || null) }, /* @__PURE__ */ import_react3.default.createElement("option", { value: "" }, "\u5DE5\u4F5C\u533A\u6839\u76EE\u5F55"), folders.map((f) => /* @__PURE__ */ import_react3.default.createElement("option", { key: f.id, value: f.id }, folderPath(state, f.id))))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-form-grid" }, /* @__PURE__ */ import_react3.default.createElement("label", null, "\u56FE\u6807 / Emoji", /* @__PURE__ */ import_react3.default.createElement("input", { maxLength: 12, value: draft.icon, placeholder: isFolder ? "\u{1F4C1}" : "\u{1F4AC}", onChange: (e) => patch("icon", e.target.value) })), /* @__PURE__ */ import_react3.default.createElement("label", null, "\u624B\u52A8\u72B6\u6001", /* @__PURE__ */ import_react3.default.createElement("select", { value: draft.status, onChange: (e) => patch("status", e.target.value) }, Object.entries(STATUSES).map(([k, v]) => /* @__PURE__ */ import_react3.default.createElement("option", { key: k, value: k }, v))))), /* @__PURE__ */ import_react3.default.createElement("fieldset", null, /* @__PURE__ */ import_react3.default.createElement("legend", null, "\u6807\u8BB0\u989C\u8272"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-colors" }, Object.entries(COLORS).map(([key, value]) => /* @__PURE__ */ import_react3.default.createElement("button", { key, type: "button", "aria-label": `\u989C\u8272\uFF1A${{ default: "\u7070\u8272", blue: "\u84DD\u8272", purple: "\u7D2B\u8272", pink: "\u7C89\u8272", orange: "\u6A59\u8272", green: "\u7EFF\u8272", teal: "\u9752\u8272" }[key]}`, "aria-pressed": draft.color === key, className: "lg-color", style: { "--swatch": value }, onClick: () => patch("color", key) }, draft.color === key && /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "check", size: 14 }))))), /* @__PURE__ */ import_react3.default.createElement("label", null, "\u6807\u7B7E", /* @__PURE__ */ import_react3.default.createElement("input", { value: tags, placeholder: "\u5DE5\u4F5C\uFF0C\u8BBE\u8BA1\uFF0C\u5F85\u529E", onChange: (e) => setTags(e.target.value) }), /* @__PURE__ */ import_react3.default.createElement("small", null, "\u7528\u9017\u53F7\u5206\u9694\uFF0C\u6700\u591A 12 \u4E2A\uFF1B\u7531\u4F60\u624B\u52A8\u7EF4\u62A4\u3002")), /* @__PURE__ */ import_react3.default.createElement("label", { className: "lg-checkbox" }, /* @__PURE__ */ import_react3.default.createElement("input", { type: "checkbox", checked: draft.starred, onChange: (e) => patch("starred", e.target.checked) }), /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "star" }), "\u6536\u85CF\u6B64", isFolder ? "\u76EE\u5F55" : "\u4F1A\u8BDD"), error && /* @__PURE__ */ import_react3.default.createElement("p", { role: "alert", className: "lg-error" }, error), deleting && /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-delete-note" }, /* @__PURE__ */ import_react3.default.createElement("strong", null, "\u5220\u9664\u201C", initial.name, "\u201D\uFF1F"), /* @__PURE__ */ import_react3.default.createElement("p", null, "\u5B50\u76EE\u5F55\u548C\u4F1A\u8BDD\u4F1A\u79FB\u5230\u4E0A\u4E00\u7EA7\uFF0C\u804A\u5929\u8BB0\u5F55\u4FDD\u7559\u3002"), /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "lg-danger", disabled: busy, onClick: remove }, "\u786E\u8BA4\u5220\u9664\u76EE\u5F55")), /* @__PURE__ */ import_react3.default.createElement("footer", null, isFolder && !creating ? /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "lg-text-button lg-danger", disabled: busy, onClick: () => setDeleting(!deleting) }, "\u5220\u9664\u76EE\u5F55") : /* @__PURE__ */ import_react3.default.createElement("span", null), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "lg-secondary", disabled: busy, onClick: close }, "\u53D6\u6D88"), /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-primary", disabled: busy }, busy ? "\u4FDD\u5B58\u4E2D\u2026" : creating ? "\u521B\u5EFA\u76EE\u5F55" : "\u4FDD\u5B58\u66F4\u6539")))));
}
function NameEditor({ target, rename, close }) {
  const noun = { folder: "\u76EE\u5F55", workspace: "\u5DE5\u4F5C\u533A", session: "\u4F1A\u8BDD" }[target.kind];
  const [title, setTitle] = (0, import_react3.useState)(target.title);
  const [busy, setBusy] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)("");
  return /* @__PURE__ */ import_react3.default.createElement(Modal, { title: `\u91CD\u547D\u540D${noun}`, close: () => {
    if (!busy) close();
  } }, /* @__PURE__ */ import_react3.default.createElement("form", { onSubmit: async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await rename(target.id, title.trim());
      close();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setBusy(false);
    }
  } }, /* @__PURE__ */ import_react3.default.createElement("label", null, noun, "\u540D\u79F0", /* @__PURE__ */ import_react3.default.createElement("input", { required: true, maxLength: target.kind === "session" ? 160 : 80, value: title, onChange: (e) => setTitle(e.target.value) })), error && /* @__PURE__ */ import_react3.default.createElement("p", { role: "alert", className: "lg-error" }, error), /* @__PURE__ */ import_react3.default.createElement("footer", null, /* @__PURE__ */ import_react3.default.createElement("span", null), /* @__PURE__ */ import_react3.default.createElement("div", null, /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", className: "lg-secondary", disabled: busy, onClick: close }, "\u53D6\u6D88"), /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-primary", disabled: busy }, "\u4FDD\u5B58")))));
}
function isDescendant(id, parentId, state) {
  const seen = /* @__PURE__ */ new Set();
  while (id) {
    if (id === parentId) return true;
    if (seen.has(id)) return true;
    seen.add(id);
    id = state.folders.find((f) => f.id === id)?.parentId;
  }
  return false;
}
function FolderTree({ wide = true, expandSidebar, controller, catalog, activeId, openSession, createSession, createWorkspace, onNativeView, renameWorkspace, removeWorkspace, archiveSession, unarchiveSession, renameSession, pinSession, unpinSession, forkSession, copySessionId, storageKey = "dsh.liquid-glass.collapsed.v1" }) {
  const runtime = useSource(controller);
  const state = runtime.state;
  const [query, setQuery] = (0, import_react3.useState)("");
  const [searchOpen, setSearchOpen] = (0, import_react3.useState)(false);
  const [filter, setFilter] = (0, import_react3.useState)("all");
  const [filtersOpen, setFiltersOpen] = (0, import_react3.useState)(false);
  const [statusFilter, setStatusFilter] = (0, import_react3.useState)("all");
  const [tagFilter, setTagFilter] = (0, import_react3.useState)("");
  const [colorFilter, setColorFilter] = (0, import_react3.useState)("all");
  const [editor, setEditor] = (0, import_react3.useState)(null);
  const [menu, setMenu] = (0, import_react3.useState)(null);
  const [deletion, setDeletion] = (0, import_react3.useState)(null);
  const [deleting, setDeleting] = (0, import_react3.useState)(false);
  const [deleteError, setDeleteError] = (0, import_react3.useState)("");
  const [drop, setDrop] = (0, import_react3.useState)(null);
  const [collapsed, setCollapsed] = (0, import_react3.useState)(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  });
  const dragged = (0, import_react3.useRef)(null);
  const dropRef = (0, import_react3.useRef)(null);
  const treeRef = (0, import_react3.useRef)();
  const [notice, setNotice] = (0, import_react3.useState)("");
  (0, import_react3.useEffect)(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);
  const [workspaceRename, setWorkspaceRename] = (0, import_react3.useState)(null);
  const [nativeBusy, setNativeBusy] = (0, import_react3.useState)(false);
  const [undoArchive, setUndoArchive] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(collapsed));
    } catch {
    }
  }, [collapsed, storageKey]);
  (0, import_react3.useEffect)(() => {
    if (!wide) {
      setMenu(null);
      setDrop(null);
      dragged.current = null;
      dropRef.current = null;
    }
  }, [wide]);
  const visibleWorkspaces = new Set(catalog.map((w) => w.workspaceId));
  const visibleSessions = new Set(catalog.flatMap((w) => w.sessions.map((s) => s.id)));
  const tags = [...new Set([...state.folders.filter((f) => visibleWorkspaces.has(f.workspaceId)), ...Object.entries(state.sessions).filter(([id]) => visibleSessions.has(id)).map(([, s]) => s)].flatMap((i) => i.tags))].sort();
  const busy = runtime.loading || runtime.saving || nativeBusy;
  const toggle = (id) => setCollapsed((s) => ({ ...s, [id]: !s[id] }));
  const mutate = async (op) => {
    try {
      await controller.mutate(op);
      setNotice("\u5DF2\u4FDD\u5B58");
    } catch (e) {
      setNotice(e.message);
    }
  };
  const newFolder = (workspaceId, parentId) => {
    setCollapsed((s) => ({ ...s, [parentId ?? workspaceId]: false }));
    setEditor({ kind: "folder", create: true, workspaceId, parentId });
  };
  const showMenu = (event, target, pointer = false) => {
    event.preventDefault();
    event.stopPropagation();
    if (busy) return;
    const trigger = event.currentTarget;
    const rect = trigger.getBoundingClientRect();
    const anchor = pointer && (event.clientX || event.clientY) ? { x: event.clientX, y: event.clientY } : { x: rect.right, y: rect.bottom + 6, top: rect.top, align: "end" };
    setMenu({ ...target, anchor, trigger });
  };
  const requestRemoval = (target) => {
    setDeleteError("");
    setDeletion(target);
    setMenu(null);
  };
  const archive = async (target) => {
    setMenu(null);
    setNativeBusy(true);
    try {
      await archiveSession(target.id);
      setUndoArchive({ id: target.id, title: target.title });
      setNotice("\u4F1A\u8BDD\u5DF2\u5F52\u6863");
    } catch (e) {
      setNotice(e.rpcError?.code === "workspace/session-active" ? "\u6B64\u4F1A\u8BDD\u4ECD\u6709\u5DE5\u4F5C\u6B63\u5728\u8FDB\u884C\uFF0C\u8BF7\u5148\u505C\u6B62\u540E\u518D\u5F52\u6863\u3002" : e.message);
    } finally {
      setNativeBusy(false);
    }
  };
  const runSessionAction = async (action, message) => {
    setMenu(null);
    setNativeBusy(true);
    try {
      await action();
      setNotice(message);
    } catch (e) {
      setNotice(e.message);
    } finally {
      setNativeBusy(false);
    }
  };
  const fork = async (target) => {
    setMenu(null);
    setNativeBusy(true);
    try {
      const childId = await forkSession(target.id);
      if (!childId) throw new Error("\u539F\u751F\u5206\u53C9\u6CA1\u6709\u8FD4\u56DE\u65B0\u4F1A\u8BDD ID");
      const folderId = state.sessions[target.id]?.folderId;
      let message = "\u5DF2\u521B\u5EFA\u5206\u53C9\u4F1A\u8BDD";
      if (folderId) {
        try {
          await controller.mutate({ type: "session.move", id: childId, workspaceId: target.workspaceId, folderId });
        } catch (e) {
          message = `\u5DF2\u521B\u5EFA\u5206\u53C9\uFF0C\u4F46\u76EE\u5F55\u5F52\u7C7B\u672A\u4FDD\u5B58\uFF1A${e.message}`;
        }
      }
      setNotice(message);
      openSession(childId);
    } catch (e) {
      setNotice(e.rpcError?.code === "session/migration-required" ? "\u8BF7\u5148\u6253\u5F00\u6B64\u4F1A\u8BDD\uFF0C\u5B8C\u6210\u539F\u751F\u8FC1\u79FB\u540E\u518D\u5206\u53C9" : e.rpcError?.code === "session/fork-unavailable" ? "\u8BE5\u4F1A\u8BDD\u8FD8\u6CA1\u6709\u53EF\u4F9B\u5206\u53C9\u7684\u5B8C\u6574\u8F6E\u6B21" : e.message);
    } finally {
      setNativeBusy(false);
    }
  };
  const beginSession = async (workspaceId, folderId = null) => {
    setMenu(null);
    setNativeBusy(true);
    try {
      await createSession(workspaceId, folderId);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setNativeBusy(false);
    }
  };
  const addWorkspace = async () => {
    setNativeBusy(true);
    try {
      const workspace = await createWorkspace();
      if (workspace) setCollapsed((s) => ({ ...s, [workspace.workspaceId]: false }));
    } catch (error) {
      setNotice(error.message);
    } finally {
      setNativeBusy(false);
    }
  };
  const match = (item, title) => (!query || `${title} ${item.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())) && (filter !== "starred" || item.starred) && (statusFilter === "all" || item.status === statusFilter) && (!tagFilter || item.tags.includes(tagFilter)) && (colorFilter === "all" || item.color === colorFilter);
  const filtered = query || filter === "starred" || statusFilter !== "all" || tagFilter || colorFilter !== "all";
  const total = catalog.reduce((sum, w) => sum + w.sessions.length, 0);
  const beginDrag = (event, item) => {
    dragged.current = item;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(DRAG_TYPE, JSON.stringify(item));
    setNotice("\u62D6\u5230\u76EE\u5F55\u5185\u5F52\u7C7B\uFF0C\u62D6\u5230\u884C\u95F4\u8C03\u6574\u987A\u5E8F");
  };
  const dropTarget = (event, target) => {
    event.stopPropagation();
    const source = dragged.current;
    if (catalog.find((w) => w.workspaceId === target.workspaceId)?.allowFolders === false) return;
    if (busy || filtered || !source || source.workspaceId !== target.workspaceId || source.id === target.id) return;
    if (source.kind === "folder" && target.kind === "folder" && isDescendant(target.id, source.id, state)) return;
    if (source.kind === "folder" && target.kind === "session") return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientY - rect.top) / rect.height;
    let position = target.kind === "workspace" ? "inside" : ratio < 0.25 ? "before" : target.kind === "folder" && ratio < 0.75 ? "inside" : "after";
    dropRef.current = { ...target, position };
    setDrop(dropRef.current);
  };
  const commitDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const source = dragged.current;
    const target = dropRef.current;
    setDrop(null);
    dropRef.current = null;
    dragged.current = null;
    if (!source || !target || source.workspaceId !== target.workspaceId) return;
    let parentId = target.kind === "workspace" ? null : target.kind === "folder" && target.position === "inside" ? target.id : target.parentId;
    let beforeId = null;
    if (target.position !== "inside" && source.kind === target.kind) {
      const siblings = source.kind === "folder" ? state.folders.filter((f) => f.workspaceId === target.workspaceId && f.parentId === parentId).sort((a, b) => a.order - b.order).map((f) => f.id) : sessionChildren(target.workspaceId, parentId).map((s) => s.id);
      beforeId = target.position === "before" ? target.id : siblings[siblings.indexOf(target.id) + 1] ?? null;
    }
    if (source.kind === "folder") mutate({ type: "folder.move", id: source.id, parentId, beforeId });
    else mutate({ type: "session.move", id: source.id, workspaceId: source.workspaceId, folderId: parentId, beforeId });
    setCollapsed((c) => ({ ...c, [parentId ?? source.workspaceId]: false }));
  };
  const sessionChildren = (workspaceId, folderId) => {
    const workspace = catalog.find((w) => w.workspaceId === workspaceId);
    return (workspace?.sessions ?? []).filter((s) => {
      const record = state.sessions[s.id];
      const assigned = record?.workspaceId === workspaceId && state.folders.some((f) => f.id === record.folderId && f.workspaceId === workspaceId) ? record.folderId : null;
      return assigned === folderId;
    }).map((s, index) => ({ ...s, meta: state.sessions[s.id]?.workspaceId === workspaceId ? state.sessions[s.id] : defaultMeta(), rank: state.sessions[s.id]?.workspaceId === workspaceId ? state.sessions[s.id].order : index })).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || a.rank - b.rank);
  };
  const childFolders = (workspaceId, parentId) => state.folders.filter((f) => f.workspaceId === workspaceId && f.parentId === parentId).sort((a, b) => a.order - b.order);
  const folderMatches = (folder, depth = 0) => depth <= 64 && (match(folder, folder.name) || sessionChildren(folder.workspaceId, folder.id).some((s) => match(s.meta, s.title)) || childFolders(folder.workspaceId, folder.id).some((f) => folderMatches(f, depth + 1)));
  const keyboard = (event) => {
    if (event.target !== event.currentTarget) return;
    const rows = [...treeRef.current.querySelectorAll('[role="treeitem"]')].filter((row2) => !row2.closest("[inert]"));
    const index = rows.indexOf(event.currentTarget);
    const key = event.key;
    if (["ArrowDown", "ArrowUp", "Home", "End", "ArrowLeft", "ArrowRight"].includes(key)) event.preventDefault();
    if (key === "ArrowDown") rows[Math.min(index + 1, rows.length - 1)]?.focus();
    if (key === "ArrowUp") rows[Math.max(0, index - 1)]?.focus();
    if (key === "Home") rows[0]?.focus();
    if (key === "End") rows.at(-1)?.focus();
    if (key === "ArrowRight") {
      if (event.currentTarget.getAttribute("aria-expanded") === "false") event.currentTarget.click();
      else rows[index + 1]?.focus();
    }
    if (key === "ArrowLeft") {
      if (event.currentTarget.getAttribute("aria-expanded") === "true") event.currentTarget.click();
      else {
        const level = +event.currentTarget.getAttribute("aria-level");
        rows.slice(0, index).reverse().find((r) => +r.getAttribute("aria-level") < level)?.focus();
      }
    }
    if (key === "Enter" || key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
    if (key === "F2") {
      event.preventDefault();
      const node = event.currentTarget;
      if (node.dataset.kind !== "workspace" && catalog.find((w) => w.workspaceId === node.dataset.workspace)?.allowFolders !== false) setEditor({ kind: node.dataset.kind, id: node.dataset.id, workspaceId: node.dataset.workspace, title: node.querySelector(".lg-row-text>span").textContent });
    }
    if (key === "Delete" && event.currentTarget.dataset.kind === "folder") {
      event.preventDefault();
      requestRemoval({ kind: "folder", id: event.currentTarget.dataset.id, title: event.currentTarget.querySelector(".lg-row-text>span").textContent });
    }
  };
  const row = ({ item, kind, level, parentId, expanded, count, children, title, meta = defaultMeta() }) => {
    const target = { id: item.id, kind, workspaceId: item.workspaceId, parentId, pinned: !!item.pinned };
    const isActive = kind === "session" && activeId === item.id;
    const editable = catalog.find((w) => w.workspaceId === item.workspaceId)?.allowFolders !== false;
    return /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, { key: item.id }, /* @__PURE__ */ import_react3.default.createElement(
      "div",
      {
        role: "treeitem",
        "aria-level": level,
        "aria-expanded": kind === "session" ? void 0 : expanded,
        "aria-selected": isActive,
        tabIndex: 0,
        "data-id": item.id,
        "data-kind": kind,
        "data-workspace": item.workspaceId,
        className: `lg-tree-row ${isActive ? "is-active" : ""} ${drop?.id === item.id ? `drop-${drop.position}` : ""} ${kind === "workspace" ? "lg-workspace-row" : ""}`,
        style: { "--depth": level - 1, "--row-color": COLORS[meta.color] },
        onKeyDown: keyboard,
        draggable: editable && kind !== "workspace" && !busy && !filtered,
        onDragStart: (e) => beginDrag(e, target),
        onDragEnd: () => {
          dragged.current = null;
          dropRef.current = null;
          setDrop(null);
        },
        onDragOver: (e) => dropTarget(e, target),
        onDrop: commitDrop,
        onContextMenu: (e) => {
          if (editable) showMenu(e, { ...target, title }, true);
        },
        onClick: () => {
          if (kind === "session") openSession(item.id);
          else if (filtered) setNotice("\u6E05\u9664\u7B5B\u9009\u540E\u53EF\u6298\u53E0\u4E0E\u6392\u5E8F\u76EE\u5F55");
          else toggle(item.id);
        }
      },
      kind === "session" && /* @__PURE__ */ import_react3.default.createElement("span", { className: "lg-hover-underline", "aria-hidden": "true" }),
      /* @__PURE__ */ import_react3.default.createElement("span", { className: `lg-chevron ${expanded ? "is-open" : ""}` }, kind !== "session" && /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "chevron", size: 11 })),
      /* @__PURE__ */ import_react3.default.createElement("span", { className: `lg-row-icon ${meta.icon ? "has-emoji" : ""}` }, meta.icon || /* @__PURE__ */ import_react3.default.createElement(Icon, { name: kind === "workspace" ? "book" : kind === "session" ? "chat" : "folder" })),
      /* @__PURE__ */ import_react3.default.createElement("span", { className: "lg-row-text" }, /* @__PURE__ */ import_react3.default.createElement("span", null, title), meta.tags.length > 0 && /* @__PURE__ */ import_react3.default.createElement("small", null, meta.tags.map((t) => `#${t}`).join("  "))),
      item.pinned && kind === "session" && /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "pin", size: 12, className: "lg-pin" }),
      meta.starred && /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "star", size: 11, className: "lg-star" }),
      meta.status !== "none" && /* @__PURE__ */ import_react3.default.createElement("span", { className: `lg-status lg-status-${meta.status}`, title: `\u624B\u52A8\u72B6\u6001\uFF1A${STATUSES[meta.status]}`, "aria-label": `\u624B\u52A8\u72B6\u6001\uFF1A${STATUSES[meta.status]}` }),
      count != null && /* @__PURE__ */ import_react3.default.createElement("span", { className: "lg-count" }, count),
      editable && /* @__PURE__ */ import_react3.default.createElement("span", { className: "lg-row-actions" }, kind !== "session" && /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-icon-button", disabled: busy, title: "\u65B0\u5EFA\u5B50\u76EE\u5F55", "aria-label": `\u5728 ${title} \u4E0B\u65B0\u5EFA\u5B50\u76EE\u5F55`, onClick: (e) => {
        e.stopPropagation();
        newFolder(item.workspaceId, kind === "workspace" ? null : item.id);
      } }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "plus", size: 14 })), /* @__PURE__ */ import_react3.default.createElement("button", { "data-edit": true, className: "lg-icon-button", title: "\u66F4\u591A\u64CD\u4F5C \xB7 \u53F3\u952E", "aria-label": `${title} \u7684\u66F4\u591A\u64CD\u4F5C`, disabled: busy, onClick: (e) => showMenu(e, { ...target, title }) }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "more", size: 15 })))
    ), kind !== "session" && /* @__PURE__ */ import_react3.default.createElement("div", { role: "group", className: `lg-branch ${expanded ? "" : "is-collapsed"}`, "aria-hidden": !expanded, inert: !expanded ? "" : void 0 }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-branch-inner" }, children)));
  };
  const branch = (workspaceId, parentId, level) => {
    if (level > 65) return null;
    const sessions = sessionChildren(workspaceId, parentId).filter((s) => !filtered || match(s.meta, s.title));
    const renderSession = (s) => row({ item: { ...s, workspaceId }, kind: "session", level, parentId, title: s.title || "\u65B0\u4F1A\u8BDD", meta: s.meta });
    return /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, sessions.filter((s) => s.pinned).map(renderSession), childFolders(workspaceId, parentId).filter((f) => !filtered || folderMatches(f)).map((f) => {
      const expanded = !!filtered || !collapsed[f.id];
      const count = sessionChildren(workspaceId, f.id).length;
      return row({ item: f, kind: "folder", level, parentId, title: f.name, meta: f, expanded, count, children: branch(workspaceId, f.id, level + 1) });
    }), sessions.filter((s) => !s.pinned).map(renderSession));
  };
  const clearFilters = () => {
    setQuery("");
    setFilter("all");
    setStatusFilter("all");
    setTagFilter("");
    setColorFilter("all");
  };
  if (!wide) return /* @__PURE__ */ import_react3.default.createElement(RailMenu, { state, catalog, activeId, openSession, createSession, createWorkspace, onNativeView, error: runtime.error });
  return /* @__PURE__ */ import_react3.default.createElement("section", { "data-density": state.preferences.density, "data-show-tags": state.preferences.showTags, "data-show-counts": state.preferences.showCounts, className: "lg-tree", "aria-label": "\u5DE5\u4F5C\u533A\u4E0E\u4F1A\u8BDD\u76EE\u5F55" }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-tree-heading" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "\u6211\u7684\u5DE5\u4F5C\u533A"), /* @__PURE__ */ import_react3.default.createElement("div", null, createWorkspace && /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-icon-button", "aria-label": "\u6DFB\u52A0\u5DE5\u4F5C\u533A", title: "\u6DFB\u52A0\u5DE5\u4F5C\u533A", disabled: busy, onClick: addWorkspace }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "plus" })), /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-icon-button", "aria-label": "\u641C\u7D22\u76EE\u5F55\u4E0E\u4F1A\u8BDD", "aria-expanded": searchOpen, onClick: () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) setQuery("");
  } }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "search", size: 14 })), /* @__PURE__ */ import_react3.default.createElement("button", { className: `lg-icon-button ${filtersOpen ? "is-on" : ""}`, "aria-label": "\u7B5B\u9009\u76EE\u5F55\u4E0E\u4F1A\u8BDD", "aria-expanded": filtersOpen, onClick: () => setFiltersOpen(!filtersOpen) }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "sliders" })), /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-icon-button", "aria-label": "\u5237\u65B0\u76EE\u5F55", title: "\u5237\u65B0\u76EE\u5F55", disabled: busy, onClick: () => controller.refresh() }, /* @__PURE__ */ import_react3.default.createElement("span", { className: "lg-refresh" }, "\u21BB")))), searchOpen && /* @__PURE__ */ import_react3.default.createElement("label", { className: "lg-search" }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "search", size: 14 }), /* @__PURE__ */ import_react3.default.createElement("input", { "aria-label": "\u641C\u7D22\u76EE\u5F55\u3001\u4F1A\u8BDD\u6216\u6807\u7B7E", autoFocus: true, value: query, onChange: (e) => setQuery(e.target.value), placeholder: "\u641C\u7D22\u76EE\u5F55\u3001\u4F1A\u8BDD\u6216\u6807\u7B7E" }), query && /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-icon-button", "aria-label": "\u6E05\u9664\u641C\u7D22", onClick: () => setQuery("") }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "close", size: 12 }))), /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-segments" }, /* @__PURE__ */ import_react3.default.createElement("button", { "aria-pressed": filter === "all", onClick: () => setFilter("all") }, "\u5168\u90E8\u4F1A\u8BDD ", /* @__PURE__ */ import_react3.default.createElement("span", null, total)), /* @__PURE__ */ import_react3.default.createElement("button", { "aria-pressed": filter === "starred", onClick: () => setFilter("starred") }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "star", size: 12 }), "\u6536\u85CF")), filtersOpen && /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-filters" }, /* @__PURE__ */ import_react3.default.createElement("select", { "aria-label": "\u6309\u624B\u52A8\u72B6\u6001\u7B5B\u9009", value: statusFilter, onChange: (e) => setStatusFilter(e.target.value) }, /* @__PURE__ */ import_react3.default.createElement("option", { value: "all" }, "\u5168\u90E8\u72B6\u6001"), Object.entries(STATUSES).map(([k, v]) => /* @__PURE__ */ import_react3.default.createElement("option", { key: k, value: k }, v))), /* @__PURE__ */ import_react3.default.createElement("select", { "aria-label": "\u6309\u6807\u7B7E\u7B5B\u9009", value: tagFilter, onChange: (e) => setTagFilter(e.target.value) }, /* @__PURE__ */ import_react3.default.createElement("option", { value: "" }, "\u5168\u90E8\u6807\u7B7E"), tags.map((tag) => /* @__PURE__ */ import_react3.default.createElement("option", { key: tag }, tag))), /* @__PURE__ */ import_react3.default.createElement("select", { "aria-label": "\u6309\u989C\u8272\u7B5B\u9009", value: colorFilter, onChange: (e) => setColorFilter(e.target.value) }, /* @__PURE__ */ import_react3.default.createElement("option", { value: "all" }, "\u5168\u90E8\u989C\u8272"), Object.keys(COLORS).map((c) => /* @__PURE__ */ import_react3.default.createElement("option", { value: c, key: c }, { default: "\u7070\u8272", blue: "\u84DD\u8272", purple: "\u7D2B\u8272", pink: "\u7C89\u8272", orange: "\u6A59\u8272", green: "\u7EFF\u8272", teal: "\u9752\u8272" }[c])))), filtered && /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-clear-filter", onClick: clearFilters }, "\u6E05\u9664\u7B5B\u9009 \xB7 \u6062\u590D\u5B8C\u6574\u76EE\u5F55"), /* @__PURE__ */ import_react3.default.createElement("div", { ref: treeRef, role: "tree", "aria-label": "\u4F1A\u8BDD\u76EE\u5F55\u6811", "aria-busy": busy, className: "lg-tree-list" }, catalog.map((w) => {
    const expanded = !!filtered || !collapsed[w.workspaceId];
    return row({ item: { id: w.workspaceId, workspaceId: w.workspaceId }, kind: "workspace", level: 1, parentId: null, title: w.title, expanded, count: w.sessions.length, children: /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, branch(w.workspaceId, null, 2), !filtered && w.sessions.length === 0 && childFolders(w.workspaceId, null).length === 0 && /* @__PURE__ */ import_react3.default.createElement("p", { className: "lg-empty-inline" }, "\u5728\u8FD9\u91CC\u65B0\u5EFA\u76EE\u5F55\uFF0C\u6574\u7406\u4F60\u7684\u4F1A\u8BDD"), w.allowFolders !== false && /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-new-session", disabled: busy, onClick: () => beginSession(w.workspaceId) }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "plus", size: 13 }), "\u65B0\u5EFA\u4F1A\u8BDD")) });
  }), !catalog.length && !runtime.loading && /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-empty" }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "book", size: 26 }), /* @__PURE__ */ import_react3.default.createElement("p", null, "\u8FD8\u6CA1\u6709\u5DE5\u4F5C\u533A"), /* @__PURE__ */ import_react3.default.createElement("small", null, "\u9009\u62E9\u672C\u673A\u76EE\u5F55\uFF0C\u5EFA\u7ACB\u4F60\u7684\u5DE5\u4F5C\u533A\u3002"), createWorkspace ? /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-secondary", disabled: busy, onClick: addWorkspace }, "\u6DFB\u52A0\u5DE5\u4F5C\u533A") : onNativeView && /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-secondary", onClick: onNativeView }, "\u6253\u5F00\u539F\u59CB\u76EE\u5F55"))), (runtime.error || notice) && /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-tree-bottom" }, /* @__PURE__ */ import_react3.default.createElement("span", { role: runtime.error ? "alert" : "status" }, runtime.loading ? "\u6B63\u5728\u8BFB\u53D6\u76EE\u5F55\u2026" : runtime.saving ? "\u6B63\u5728\u4FDD\u5B58\u2026" : runtime.error || notice), runtime.error && /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-text-button", onClick: () => controller.refresh() }, "\u91CD\u8BD5")), undoArchive && unarchiveSession && /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-undo" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "\u5DF2\u5F52\u6863\uFF1A", undoArchive.title), /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-text-button", disabled: busy, onClick: async () => {
    setNativeBusy(true);
    try {
      await unarchiveSession(undoArchive.id);
      setUndoArchive(null);
      setNotice("\u5DF2\u6062\u590D\u4F1A\u8BDD");
    } catch (e) {
      setNotice(e.message);
    } finally {
      setNativeBusy(false);
    }
  } }, "\u64A4\u9500")), menu && /* @__PURE__ */ import_react3.default.createElement(RowMenu, { menu, close: () => setMenu(null) }, menu.kind === "session" && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, renameSession && /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => {
    setWorkspaceRename(menu);
    setMenu(null);
  } }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "edit" }), "\u91CD\u547D\u540D\u4F1A\u8BDD"), pinSession && unpinSession && /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => runSessionAction(() => menu.pinned ? unpinSession(menu.id) : pinSession(menu.id), menu.pinned ? "\u5DF2\u53D6\u6D88\u7F6E\u9876" : "\u5DF2\u5728\u539F\u76EE\u5F55\u5185\u7F6E\u9876") }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "pin" }), menu.pinned ? "\u53D6\u6D88\u7F6E\u9876" : "\u7F6E\u9876\u4F1A\u8BDD"), forkSession && /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => fork(menu) }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "fork" }), "\u5206\u53C9\u4F1A\u8BDD"), copySessionId && /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => runSessionAction(() => copySessionId(menu.id), "\u5DF2\u590D\u5236 Session ID") }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "copy" }), "\u590D\u5236 Session ID"), /* @__PURE__ */ import_react3.default.createElement("hr", null)), menu.kind === "folder" && /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => {
    setWorkspaceRename(menu);
    setMenu(null);
  } }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "edit" }), "\u91CD\u547D\u540D\u76EE\u5F55"), menu.kind !== "workspace" && /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => {
    setEditor(menu);
    setMenu(null);
  } }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "sliders" }), "\u6807\u8BB0\u4E0E\u79FB\u52A8", /* @__PURE__ */ import_react3.default.createElement("small", null, "F2")), menu.kind !== "session" && createSession && /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => beginSession(menu.workspaceId, menu.kind === "folder" ? menu.id : null) }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "chat" }), "\u65B0\u5EFA\u4F1A\u8BDD"), menu.kind !== "session" && /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => {
    newFolder(menu.workspaceId, menu.kind === "workspace" ? null : menu.id);
    setMenu(null);
  } }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "plus" }), "\u65B0\u5EFA\u5B50\u76EE\u5F55"), menu.kind === "workspace" && renameWorkspace && /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => {
    setWorkspaceRename(menu);
    setMenu(null);
  } }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "edit" }), "\u91CD\u547D\u540D\u5DE5\u4F5C\u533A"), menu.kind === "workspace" && onNativeView && /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => {
    setMenu(null);
    onNativeView();
  } }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "book" }), "\u66F4\u591A\u5DE5\u4F5C\u533A\u7BA1\u7406"), menu.kind === "session" && archiveSession && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("hr", null), /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => archive(menu) }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "archive" }), "\u5F52\u6863\u4F1A\u8BDD")), (menu.kind === "folder" || menu.kind === "workspace" && removeWorkspace) && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("hr", null), /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", className: "lg-danger", onClick: () => requestRemoval(menu) }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "trash" }), menu.kind === "folder" ? "\u5220\u9664\u76EE\u5F55" : "\u79FB\u9664\u5DE5\u4F5C\u533A"))), deletion && /* @__PURE__ */ import_react3.default.createElement(Modal, { title: `${deletion.kind === "workspace" ? "\u79FB\u9664\u5DE5\u4F5C\u533A" : "\u5220\u9664\u76EE\u5F55"}\u201C${deletion.title}\u201D\uFF1F`, close: () => {
    if (!deleting) setDeletion(null);
  } }, /* @__PURE__ */ import_react3.default.createElement("p", { className: "lg-delete-description" }, deletion.kind === "workspace" ? "\u4ECE\u5DE5\u4F5C\u533A\u5217\u8868\u79FB\u9664\u6B64\u9879\uFF0C\u78C1\u76D8\u6587\u4EF6\u3001\u804A\u5929\u8BB0\u5F55\u53CA\u76EE\u5F55\u6807\u8BB0\u4FDD\u7559\u3002\u4F1A\u8BDD\u4ECD\u53EF\u5728\u539F\u751F\u5DE5\u4F5C\u533A\u7BA1\u7406\u4E2D\u67E5\u770B\u3002" : "\u4EC5\u5220\u9664\u6B64\u76EE\u5F55\u3002\u76F4\u63A5\u5B50\u76EE\u5F55\u548C\u4F1A\u8BDD\u5C06\u79FB\u5230\u4E0A\u4E00\u7EA7\uFF0C\u804A\u5929\u8BB0\u5F55\u4E0E\u6807\u8BB0\u4FDD\u7559\u3002"), deleteError && /* @__PURE__ */ import_react3.default.createElement("p", { role: "alert", className: "lg-error" }, deleteError), /* @__PURE__ */ import_react3.default.createElement("div", { className: "lg-confirm-footer" }, /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-secondary", disabled: deleting, onClick: () => setDeletion(null) }, "\u53D6\u6D88"), /* @__PURE__ */ import_react3.default.createElement("button", { className: "lg-delete-confirm", disabled: deleting, onClick: async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      if (deletion.kind === "workspace") await removeWorkspace(deletion.id);
      else await controller.mutate({ type: "folder.delete", id: deletion.id });
      setDeletion(null);
      setNotice(deletion.kind === "workspace" ? "\u5DE5\u4F5C\u533A\u5DF2\u79FB\u9664\uFF0C\u6587\u4EF6\u548C\u804A\u5929\u8BB0\u5F55\u4FDD\u7559" : "\u76EE\u5F55\u5DF2\u5220\u9664\uFF0C\u4F1A\u8BDD\u5DF2\u4FDD\u7559");
    } catch (e) {
      setDeleteError(e.message);
    } finally {
      setDeleting(false);
    }
  } }, deleting ? "\u6B63\u5728\u5904\u7406\u2026" : deletion.kind === "workspace" ? "\u786E\u8BA4\u79FB\u9664\u5DE5\u4F5C\u533A" : "\u786E\u8BA4\u5220\u9664\u76EE\u5F55"))), workspaceRename && /* @__PURE__ */ import_react3.default.createElement(NameEditor, { target: workspaceRename, rename: workspaceRename.kind === "folder" ? (id, name) => controller.mutate({ type: "folder.rename", id, name }) : workspaceRename.kind === "session" ? renameSession : renameWorkspace, close: () => setWorkspaceRename(null) }), editor && /* @__PURE__ */ import_react3.default.createElement(Editor, { key: `${editor.id ?? "new"}-${editor.parentId}`, editor, state, controller, close: () => setEditor(null) }));
}

// src/settings.jsx
var import_react4 = __toESM(require("react"), 1);
function Settings({ controller, skin, appearance }) {
  const runtime = useSource(controller);
  const p = runtime.state.preferences;
  const theme = useSource(appearance);
  const [appearanceError, setAppearanceError] = (0, import_react4.useState)("");
  const busy = runtime.saving || runtime.loading;
  const set = (patch) => controller.mutate({ type: "preferences", patch }).catch(() => {
  });
  const toggle = (key, title, hint, change) => /* @__PURE__ */ import_react4.default.createElement("label", { className: "lg-setting-row", key }, /* @__PURE__ */ import_react4.default.createElement("span", null, title, /* @__PURE__ */ import_react4.default.createElement("small", null, hint)), /* @__PURE__ */ import_react4.default.createElement("input", { type: "checkbox", checked: p[key], disabled: busy, onChange: (e) => change ? change(e.target.checked).catch(() => {
  }) : set({ [key]: e.target.checked }) }));
  const select = (key, title, hint, choices) => /* @__PURE__ */ import_react4.default.createElement("label", { className: "lg-setting-row" }, /* @__PURE__ */ import_react4.default.createElement("span", null, title, /* @__PURE__ */ import_react4.default.createElement("small", null, hint)), /* @__PURE__ */ import_react4.default.createElement("select", { value: p[key], disabled: busy, onChange: (e) => set({ [key]: e.target.value }) }, choices.map(([value, text2]) => /* @__PURE__ */ import_react4.default.createElement("option", { key: value, value }, text2))));
  return /* @__PURE__ */ import_react4.default.createElement("section", { className: "lg-settings", "aria-label": "Liquid Glass \u4E3B\u9898\u8BBE\u7F6E" }, /* @__PURE__ */ import_react4.default.createElement("header", null, /* @__PURE__ */ import_react4.default.createElement(Icon, { name: "glass", size: 22 }), /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("h2", null, "Liquid Glass"), /* @__PURE__ */ import_react4.default.createElement("p", null, "\u5916\u89C2\u8C03\u6574\u5373\u65F6\u751F\u6548\uFF0C\u5E76\u4FDD\u5B58\u5728\u672C\u673A\u3002"))), /* @__PURE__ */ import_react4.default.createElement("fieldset", null, /* @__PURE__ */ import_react4.default.createElement("legend", null, "\u5916\u89C2\u4E0E\u76EE\u5F55"), toggle("theme", "\u542F\u7528\u4E3B\u9898", "\u4F7F\u7528 Liquid Glass \u73BB\u7483\u6750\u8D28\u4E0E\u52A8\u6548\u3002", (value) => skin.choose(value)), /* @__PURE__ */ import_react4.default.createElement("div", { className: "lg-setting-row lg-appearance-row" }, /* @__PURE__ */ import_react4.default.createElement("span", null, "\u5916\u89C2\u6A21\u5F0F", /* @__PURE__ */ import_react4.default.createElement("small", null, "\u4E0E DSH \u5916\u89C2\u540C\u6B65\uFF1B\u8DDF\u968F\u7CFB\u7EDF\u65F6\u81EA\u52A8\u5207\u6362\u3002")), /* @__PURE__ */ import_react4.default.createElement("div", { className: "lg-appearance-modes", role: "group", "aria-label": "\u5916\u89C2\u6A21\u5F0F" }, [["light", "\u660E\u4EAE"], ["dark", "\u6697\u9ED1"], ["system", "\u8DDF\u968F\u7CFB\u7EDF"]].map(([mode, label]) => /* @__PURE__ */ import_react4.default.createElement("button", { type: "button", key: mode, "aria-pressed": theme.preference === mode, disabled: busy || theme.changing, onClick: async () => {
    try {
      await appearance.select(mode);
      setAppearanceError("");
    } catch (error) {
      setAppearanceError(error.message);
    }
  } }, label)))), select("glass", "\u73BB\u7483\u6750\u8D28", "\u4FA7\u680F\u548C\u83DC\u5355\u7684\u900F\u5149\u7A0B\u5EA6\u3002", [["frosted", "\u901A\u900F\u78E8\u7802"], ["solid", "\u5B9E\u8272\u6E05\u6670"]]), toggle("tree", "\u5DE5\u4F5C\u533A\u5B50\u76EE\u5F55", "\u5173\u95ED\u540E\u4F7F\u7528\u539F\u751F\u5DE5\u4F5C\u533A\u89C6\u56FE\uFF0C\u5DF2\u5B58\u5206\u7C7B\u4FDD\u7559\u3002"), select("density", "\u76EE\u5F55\u5BC6\u5EA6", "\u7D27\u51D1\u6A21\u5F0F\u53EF\u5C55\u793A\u66F4\u591A\u4F1A\u8BDD\u3002", [["comfortable", "\u8212\u9002"], ["compact", "\u7D27\u51D1"]]), toggle("showTags", "\u5C55\u793A\u884C\u5185\u6807\u7B7E", "\u53EA\u8C03\u6574\u5C55\u793A\uFF0C\u6807\u7B7E\u548C\u7B5B\u9009\u6761\u4EF6\u4ECD\u4FDD\u7559\u3002"), toggle("showCounts", "\u5C55\u793A\u76EE\u5F55\u4F1A\u8BDD\u6570", "\u63A7\u5236\u76EE\u5F55\u884C\u53F3\u4FA7\u7684\u6570\u91CF\u3002")), /* @__PURE__ */ import_react4.default.createElement("fieldset", null, /* @__PURE__ */ import_react4.default.createElement("legend", null, "\u52A8\u6001\u6548\u679C"), select("motion", "\u52A8\u6548\u5F3A\u5EA6", "\u7CFB\u7EDF\u542F\u7528\u201C\u51CF\u5C11\u52A8\u6001\u6548\u679C\u201D\u65F6\uFF0C\u4F18\u5148\u4F7F\u7528\u9759\u6001\u6548\u679C\u3002", [["full", "\u6D41\u52A8"], ["soft", "\u8F7B\u67D4"], ["off", "\u5173\u95ED"]]), toggle("orb", "\u4E3B\u9875\u5149\u7403", "\u5173\u95ED\u540E\u4E3B\u9875\u4FDD\u7559\u6807\u9898\u4E0E\u8F93\u5165\u6846\u3002"), toggle("statusGlow", "\u601D\u8003\u4E0E\u5DE5\u5177\u72B6\u6001\u626B\u5149", "\u4EC5\u4F5C\u7528\u4E8E\u8FDB\u884C\u4E2D\u7684\u72B6\u6001\u6587\u5B57\u3002"), toggle("hoverLine", "\u4F1A\u8BDD\u60AC\u505C\u5149\u7EBF", "\u5149\u7EBF\u4ECE\u4F1A\u8BDD\u4E0B\u65B9\u4E2D\u95F4\u5411\u4E24\u4FA7\u5C55\u5F00\u3002")), /* @__PURE__ */ import_react4.default.createElement("footer", null, /* @__PURE__ */ import_react4.default.createElement("button", { className: "lg-secondary", disabled: busy, onClick: () => set({ ...PRESENTATION_DEFAULTS }) }, "\u6062\u590D\u5916\u89C2\u9ED8\u8BA4"), /* @__PURE__ */ import_react4.default.createElement("span", { role: "status" }, runtime.saving ? "\u6B63\u5728\u4FDD\u5B58\u2026" : "\u5206\u7C7B\u3001\u6807\u8BB0\u4E0E\u4E3B\u9898\u542F\u7528\u72B6\u6001\u4E0D\u4F1A\u88AB\u91CD\u7F6E\u3002")), runtime.error && /* @__PURE__ */ import_react4.default.createElement("p", { role: "alert", className: "lg-error" }, runtime.error), appearanceError && /* @__PURE__ */ import_react4.default.createElement("p", { role: "alert", className: "lg-error" }, appearanceError));
}
function FooterToggle({ controller, wide = true }) {
  const { state, saving, loading } = useSource(controller);
  const label = state.preferences.tree ? "\u66F4\u591A\u5DE5\u4F5C\u533A\u7BA1\u7406" : "\u8FD4\u56DE\u76EE\u5F55\u6811";
  return /* @__PURE__ */ import_react4.default.createElement("button", { className: `lg-utility-action ${!wide ? "lg-utility-rail" : ""}`, title: label, "aria-label": label, disabled: saving || loading, onClick: () => controller.mutate({ type: "preferences", patch: { tree: !state.preferences.tree } }).catch(() => {
  }) }, /* @__PURE__ */ import_react4.default.createElement(Icon, { name: "folder", size: 16 }), wide && label);
}

// src/presentation.js
var fields = { motion: "lgMotion", orb: "lgOrb", statusGlow: "lgStatusGlow", hoverLine: "lgHoverLine", glass: "lgGlass" };
function syncPresentation(preferences, body = document.body) {
  for (const [key, attribute] of Object.entries(fields)) {
    const value = String(preferences[key]);
    if (body.dataset[attribute] !== value) body.dataset[attribute] = value;
  }
}
function clearPresentation(body = document.body) {
  for (const attribute of Object.values(fields)) delete body.dataset[attribute];
}

// src/http.js
var API_PATH = "/plugins/dsh-liquid-glass/v1/state";

// src/controller.js
function createController({ fetcher = fetch, initial, persist, poll = true } = {}) {
  let snapshot = { state: initial ?? emptyState(), ready: !!initial, loading: !initial, saving: false, error: "" };
  const listeners = /* @__PURE__ */ new Set();
  const lifetime = new AbortController();
  let disposed = false;
  let sequence = Promise.resolve();
  let reading;
  const publish = (patch) => {
    if (disposed) return;
    snapshot = { ...snapshot, ...patch };
    for (const listener of listeners) listener();
  };
  const request = async (method, body) => {
    const response = await fetcher(API_PATH, {
      method,
      headers: { "X-DSH-Liquid-Glass": "1", ...body ? { "Content-Type": "application/json" } : {} },
      ...body ? { body: JSON.stringify(body) } : {},
      signal: AbortSignal.any([lifetime.signal, AbortSignal.timeout(12e3)])
    });
    const result = await response.json();
    if (result.state) {
      const state = validateState(result.state);
      if (state.revision >= snapshot.state.revision) publish({ state, ready: true, loading: false });
    }
    if (!response.ok) throw new Error(result.error || "\u76EE\u5F55\u670D\u52A1\u6682\u65F6\u4E0D\u53EF\u7528");
    if (!result.state) throw new Error("\u76EE\u5F55\u670D\u52A1\u8FD4\u56DE\u4E86\u4E0D\u5B8C\u6574\u7684\u6570\u636E");
  };
  const refresh = () => {
    if (persist || disposed) return Promise.resolve();
    if (reading) return reading;
    reading = request("GET").then(() => publish({ error: "", loading: false })).catch((error) => {
      if (!disposed) publish({ error: error.name === "TimeoutError" ? "\u8BFB\u53D6\u76EE\u5F55\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5" : error.message, loading: false });
    }).finally(() => {
      reading = null;
    });
    return reading;
  };
  const mutate = (operation) => {
    const run = async () => {
      if (disposed) throw new Error("\u76EE\u5F55\u63D2\u4EF6\u5DF2\u505C\u7528");
      publish({ saving: true, error: "" });
      try {
        if (reading) await reading;
        if (persist) publish({ state: await persist(snapshot.state, operation) });
        else await request("POST", { revision: snapshot.state.revision, operation });
      } catch (error) {
        publish({ error: error.message });
        throw error;
      } finally {
        publish({ saving: false });
      }
    };
    const result = sequence.then(run);
    sequence = result.catch(() => {
    });
    return result;
  };
  const timer = poll && !persist ? setInterval(() => {
    if (document.visibilityState === "visible" && !snapshot.saving) refresh();
  }, 15e3) : null;
  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    refresh,
    mutate,
    dispose: () => {
      disposed = true;
      lifetime.abort();
      if (timer) clearInterval(timer);
      listeners.clear();
    }
  };
}

// src/theme.css
var theme_default = `/* Glass belongs to navigation and controls. Conversation content stays solid. */
:root { --lg-ink:#20232b; --lg-muted:#838892; --lg-faint:#a7abb3; --lg-glass:rgba(249,250,253,.72); --lg-fill:rgba(255,255,255,.65); --lg-hover:rgba(255,255,255,.55); --lg-selected:rgba(255,255,255,.87); --lg-line:rgba(71,85,105,.10); --lg-accent:#007aff; --lg-shadow:0 1px 3px #1d283608,0 8px 24px #1d283607; --lg-canvas:#fafbfc; --lg-card:#fff; }
body[data-ds-dark-theme],body[data-lg-scheme="dark"] { --lg-ink:#e9edf4; --lg-muted:#979dab; --lg-faint:#6f7786; --lg-glass:rgba(33,37,47,.76); --lg-fill:rgba(255,255,255,.055); --lg-hover:rgba(255,255,255,.075); --lg-selected:rgba(255,255,255,.11); --lg-line:rgba(223,233,255,.10); --lg-accent:#66aaff; --lg-shadow:0 1px 4px #0002,0 8px 24px #0001; --lg-canvas:#171a20; --lg-card:#20242c; }
body[data-liquid-glass="on"] { --dsw-specific-sidebar-fill:var(--lg-glass)!important; --dsw-menu-backdrop-filter:blur(24px) saturate(1.4); }
body[data-liquid-glass="on"] [class*="sidebarFrame"],body[data-liquid-glass="on"] [class*="SidebarRoot_root"] { backdrop-filter:blur(28px) saturate(1.35); }
.lg-tree,.lg-dialog,.lg-settings,.lg-footer-action { font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif; color:var(--lg-ink); font-size:13px; box-sizing:border-box; }
.lg-tree *, .lg-dialog *, .lg-settings * { box-sizing:border-box; }
.lg-tree button,.lg-dialog button,.lg-settings button,.lg-footer-action { font:inherit; cursor:pointer; -webkit-tap-highlight-color:transparent; }
.lg-tree button:disabled,.lg-dialog button:disabled { opacity:.45; cursor:wait; }
.lg-tree input,.lg-tree select,.lg-dialog input,.lg-dialog select { font:inherit; color:var(--lg-ink); }
.lg-tree button:focus-visible,.lg-tree [role="treeitem"]:focus-visible,.lg-dialog :focus-visible,.lg-settings button:focus-visible { outline:2px solid var(--lg-accent); outline-offset:2px; }
.lg-tree { display:flex; flex-direction:column; min-height:0; width:100%; height:100%; padding:4px 10px 0; }
.lg-tree-heading { display:flex; align-items:center; justify-content:space-between; padding:6px 9px 12px; font-size:11px; color:var(--lg-muted); font-weight:600; letter-spacing:.06em; }
.lg-tree-heading>div { display:flex; gap:3px; }
.lg-icon-button { border:0; color:var(--lg-muted); background:transparent; width:25px; height:25px; border-radius:7px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; padding:0; }
.lg-icon-button:hover,.lg-icon-button.is-on { background:var(--lg-hover); color:var(--lg-ink); }
.lg-refresh { font-size:19px; line-height:1; font-weight:300; }
.lg-search { display:flex; align-items:center; gap:7px; padding:0 10px; margin:0 5px 13px; height:34px; background:var(--lg-fill); border:1px solid var(--lg-line); box-shadow:0 1px 2px #10182802; border-radius:10px; color:var(--lg-muted); }
.lg-search:focus-within { border-color:var(--lg-accent); }
.lg-search input { width:100%; min-width:0; outline:0; border:0; padding:0; background:none; font-size:11px; }
.lg-search input::placeholder { color:var(--lg-muted); }
.lg-segments { display:flex; gap:4px; padding:3px; background:rgba(130,140,160,.07); border:1px solid var(--lg-line); border-radius:10px; margin:0 5px 15px; }
.lg-segments button { flex:1; display:flex; align-items:center; justify-content:center; gap:5px; padding:6px 2px; border:0; border-radius:7px; background:transparent; color:var(--lg-muted); font-size:11px; }
.lg-segments button[aria-pressed="true"] { background:var(--lg-selected); color:var(--lg-ink); box-shadow:0 1px 4px #00000008; }
.lg-segments button span { font-size:10px; color:var(--lg-muted); margin-left:2px; }
.lg-filters { display:flex; flex-wrap:wrap; gap:5px; margin:0 5px 10px; }
.lg-filters select { font-size:11px; width:calc(50% - 3px); border:1px solid var(--lg-line); border-radius:6px; background:var(--lg-card); padding:6px 3px; }
.lg-clear-filter { border:0; background:none; color:var(--lg-accent); text-align:left; margin:0 6px 10px; padding:0; font-size:11px!important; }
.lg-tree-list { flex:1; min-height:0; overflow:auto; scrollbar-width:thin; scrollbar-color:rgba(140,148,160,.22) transparent; padding:2px 3px 18px; }
.lg-tree-row { position:relative; flex-shrink:0; display:flex; align-items:center; gap:5px; min-height:33px; border:1px solid transparent; border-radius:8px; padding:5px 3px 5px calc(3px + var(--depth)*14px); cursor:pointer; user-select:none; transition:background .15s,border-color .15s; }
.lg-tree-row:hover { background:var(--lg-hover); }
.lg-tree-row.is-active { background:var(--lg-selected); border-color:var(--lg-line); box-shadow:var(--lg-shadow); }
.lg-workspace-row { margin-top:4px; margin-bottom:0; font-size:13px; font-weight:500; color:var(--lg-ink); }
.lg-workspace-row:first-child { margin-top:0; }
.lg-workspace-row .lg-row-icon { color:var(--lg-muted); }
.lg-chevron { width:9px; flex-shrink:0; display:flex; align-items:center; color:var(--lg-faint); }
.lg-chevron svg { transition:transform .15s; }
.lg-chevron.is-open svg { transform:rotate(90deg); }
.lg-row-icon { display:flex; align-items:center; justify-content:center; width:18px; min-width:18px; color:var(--row-color); }
.lg-row-icon.has-emoji { font-size:15px; }
.lg-row-text { display:flex; flex-direction:column; flex:1; min-width:0; gap:3px; line-height:1.45; }
.lg-row-text>span { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.lg-row-text small { font-size:10px; font-weight:400; color:var(--lg-muted); overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
.lg-count { flex:0 0 16px; min-width:16px; text-align:right; color:var(--lg-muted); font-size:11px; font-variant-numeric:tabular-nums; }
.lg-status { display:inline-block; width:6px; height:6px; border-radius:50%; flex-shrink:0; border:1px solid currentColor; color:var(--lg-muted); }
.lg-status-todo { color:#9da3ad; background:transparent; }.lg-status-doing { color:#007aff; background:#007aff; box-shadow:0 0 0 2px #007aff12; }.lg-status-done { color:#34a853; background:#34a853; }.lg-status-paused { color:#e99820; background:#e99820; }
.lg-star { color:#e0a124; flex-shrink:0; }
.lg-new-session { display:flex; align-items:center; gap:6px; border:0; background:none; color:var(--lg-muted); font-size:11px!important; margin:5px 0 12px 35px; padding:5px 0; }
.lg-new-session:hover { color:var(--lg-accent); }
.lg-tree-row.drop-inside { background:#007aff15; border-color:#007aff70; }
.lg-tree-row.drop-before::before,.lg-tree-row.drop-after::after { content:""; position:absolute; left:calc(14px + var(--depth)*15px); right:4px; height:2px; background:var(--lg-accent); border-radius:2px; }
.lg-tree-row.drop-before::before { top:-2px; }.lg-tree-row.drop-after::after { bottom:-2px; }
.lg-tree-bottom { display:flex; align-items:center; gap:6px; padding:10px 6px; min-height:34px; border-top:1px solid var(--lg-line); color:var(--lg-muted); font-size:9px; line-height:1.6; }
.lg-save-indicator { width:4px; height:4px; background:#74a68a; border-radius:50%; flex-shrink:0; }
.lg-empty { text-align:center; padding:30px 10px; color:var(--lg-muted); display:flex; align-items:center; flex-direction:column; gap:10px; }.lg-empty p { margin:0; }.lg-empty small { line-height:1.8; }
.lg-empty-inline { color:var(--lg-muted); font-size:11px; padding:4px 25px; line-height:1.8; }
.lg-dialog { margin:auto; width:min(420px,calc(100vw - 32px)); max-height:calc(100dvh - 48px); overflow:auto; padding:25px; border:1px solid var(--lg-line); background:var(--lg-canvas); border-radius:21px; box-shadow:0 24px 100px #10182830; }
.lg-dialog::backdrop { background:#12192636; }
.lg-dialog header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }.lg-eyebrow { display:block; font-size:9px; letter-spacing:.18em; color:var(--lg-muted); margin-bottom:7px; }.lg-dialog h2 { margin:0; font-size:20px; font-weight:600; letter-spacing:-.04em; }
.lg-dialog label { display:flex; flex-direction:column; gap:7px; font-size:11px; margin-bottom:17px; color:var(--lg-muted); }.lg-dialog input:not([type="checkbox"]),.lg-dialog select { width:100%; background:var(--lg-card); border:1px solid var(--lg-line); border-radius:9px; padding:10px 11px; font-size:13px; outline-offset:2px; }.lg-dialog small { font-size:10px; line-height:1.7; }.lg-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.lg-dialog fieldset { padding:0; border:0; margin:0 0 18px; }.lg-dialog legend { font-size:11px; color:var(--lg-muted); margin-bottom:10px; }.lg-colors { display:flex; gap:13px; }.lg-color { display:flex; align-items:center; justify-content:center; width:27px; height:27px; border:3px solid var(--lg-canvas); border-radius:50%; color:#fff; background:var(--swatch); box-shadow:0 0 0 1px transparent; }.lg-color[aria-pressed="true"] { box-shadow:0 0 0 1.5px var(--swatch); }
.lg-dialog label.lg-checkbox { display:flex; flex-direction:row; align-items:center; color:var(--lg-ink); gap:8px; font-size:12px; }.lg-checkbox input { accent-color:var(--lg-accent); }.lg-checkbox svg { color:#d3a44d; }
.lg-dialog footer { display:flex; justify-content:space-between; align-items:center; margin-top:26px; padding-top:18px; border-top:1px solid var(--lg-line); gap:12px; }.lg-dialog footer>div { display:flex; gap:8px; }
.lg-primary,.lg-secondary { border:1px solid var(--lg-line); border-radius:9px; padding:9px 14px; font:inherit; cursor:pointer; }.lg-primary { color:white; background:#007aff; border-color:#007aff; box-shadow:0 2px 4px #007aff15; }.lg-secondary { background:var(--lg-fill); color:var(--lg-ink); }
.lg-text-button { border:0; background:none; color:var(--lg-accent); padding:0; font:inherit; cursor:pointer; }.lg-danger { color:#e04d50; }.lg-delete-note { background:#ef53500c; border:1px solid #ef535020; border-radius:10px; padding:13px; font-size:12px; }.lg-delete-note p { font-size:11px; color:var(--lg-muted); line-height:1.8; }.lg-delete-note button { border:0; background:none; padding:0; }.lg-error { color:#e04d50; font-size:12px; line-height:1.7; }.lg-editor-session { font-size:14px; line-height:1.8; margin-top:0; }
.lg-settings { padding:16px 0; border-bottom:1px solid var(--lg-line); }.lg-settings header { display:flex; gap:9px; align-items:center; font-weight:600; margin-bottom:14px; }.lg-settings label { display:flex; justify-content:space-between; align-items:center; margin:12px 0; }.lg-settings p { font-size:11px; color:var(--lg-muted); line-height:1.8; }.lg-settings input { accent-color:var(--lg-accent); }.lg-footer-action { display:flex; align-items:center; gap:6px; padding:6px 10px; border:0; border-radius:8px; background:var(--lg-fill); color:var(--lg-muted); font-size:11px; }
@media (prefers-reduced-motion:reduce) { .lg-tree *, .lg-dialog * { transition:none!important; animation:none!important; } }
@media (prefers-reduced-transparency:reduce) { :root { --lg-glass:#f2f4f8; --lg-fill:#f9fafb; --lg-selected:#fff; }body[data-ds-dark-theme],body[data-lg-scheme="dark"] { --lg-glass:#242933; --lg-fill:#2e3541; --lg-selected:#343d4c; }body[data-liquid-glass="on"] { --dsw-menu-backdrop-filter:none; } }
@media (prefers-contrast:more) { :root { --lg-line:#8893a6; --lg-muted:#4b5668; --lg-faint:#647084; }body[data-ds-dark-theme],body[data-lg-scheme="dark"] { --lg-line:#8997ac; --lg-muted:#c1ccdd; --lg-faint:#a9b6ca; } }

/* Native host surfaces: selectors use semantic CSS-module suffixes, never build hashes. */
body[data-liquid-glass="on"] { background:radial-gradient(ellipse at 8% 12%,#b7d8f340,transparent 48%),radial-gradient(ellipse at 95% 90%,#dacbe530,transparent 50%),var(--lg-canvas)!important; }
body[data-liquid-glass="on"] :is([class$="_frame"],[class*="_frame "]):has(>:is([class$="_sidebarCol"],[class*="_sidebarCol "])) { background:transparent!important; padding:0; gap:0; box-sizing:border-box; }
body[data-liquid-glass="on"] :is([class$="_sidebarCol"],[class*="_sidebarCol "]):has(:is([class$="_logoRow"],[class*="_logoRow "])) { background:transparent!important; }
body[data-liquid-glass="on"] :is([class$="_root"],[class*="_root "]):has(>:is([class$="_logoRow"],[class*="_logoRow "])) { background:var(--lg-glass)!important; backdrop-filter:blur(32px) saturate(1.4); border:0; border-radius:0; padding:4px 10px 8px; box-shadow:none; overflow:hidden; }
body[data-liquid-glass="on"] :is([class$="_root"],[class*="_root "]):has(>:is([class$="_logoRow"],[class*="_logoRow "]))>:is([class$="_topStrip"],[class*="_topStrip "]) { height:42px; min-height:36px; margin-top:-4px; background:transparent; }
body[data-liquid-glass="on"] :is([class$="_root"],[class*="_root "]):has(>:is([class$="_logoRow"],[class*="_logoRow "]))>:is([class$="_logoRow"],[class*="_logoRow "]) { height:36px; margin:0 0 6px; padding:2px 5px; background:transparent; }
body[data-liquid-glass="on"] :is([class$="_logoRow"],[class*="_logoRow "]) :is([class$="_brandIdentity"],[class*="_brandIdentity "]) { gap:8px; }
body[data-liquid-glass="on"] :is([class$="_logoRow"],[class*="_logoRow "]) :is([class$="_brandMark"],[class*="_brandMark "]) svg { width:21px; height:21px; }
body[data-liquid-glass="on"] :is([class$="_root"],[class*="_root "]):has(>:is([class$="_logoRow"],[class*="_logoRow "])):not([class*="_collapsed"])>:is([class$="_newSession"],[class*="_newSession "]) { height:35px; min-height:35px; margin:0 4px 10px; padding:5px 10px; background:var(--lg-selected)!important; border:1px solid var(--lg-line); border-radius:11px; box-shadow:var(--lg-shadow); }
body[data-liquid-glass="on"] :is([class$="_root"],[class*="_root "]):has(>:is([class$="_logoRow"],[class*="_logoRow "])):not([class*="_collapsed"])>:is([class$="_panelList"],[class*="_panelList "]) { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:3px; margin:0 2px 10px; padding:4px; border-radius:12px; background:var(--lg-fill); border:1px solid var(--lg-line); }
body[data-liquid-glass="on"] :is([class$="_panelList"],[class*="_panelList "]) [class*="_panelRow"] { width:100%; min-height:32px; gap:6px; margin:0; padding:4px 6px; border-radius:8px; line-height:22px; }
body[data-liquid-glass="on"] :is([class$="_panelList"],[class*="_panelList "]) :is([class$="_panelTitle"],[class*="_panelTitle "]) { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
body[data-liquid-glass="on"] :is([class$="_panelList"],[class*="_panelList "]) :is([class$="_panelGlyph"],[class*="_panelGlyph "]) { flex:0 0 17px; width:17px; height:17px; }
body[data-liquid-glass="on"] :is([class$="_panelList"],[class*="_panelList "]) [class*="_panelActive"] { color:var(--lg-accent)!important; background:var(--lg-selected)!important; box-shadow:0 1px 3px #15294308; }
body[data-liquid-glass="on"] :is([class$="_regionArea"],[class*="_regionArea "]):has(>.lg-tree) { flex:1 1 0%; min-height:100px; margin:0; padding:0; }
body[data-liquid-glass="on"] :is([class$="_footArea"],[class*="_footArea "]):has(:is([class$="_settingsArea"],[class*="_settingsArea "])) { margin-top:2px; padding-top:5px; border-top:1px solid var(--lg-line); }
body[data-liquid-glass="on"] :is([class$="_footerActions"],[class*="_footerActions "]) { gap:2px; }
body[data-liquid-glass="on"] :is([class$="_centerCol"],[class*="_centerCol "]) { border:1px solid var(--lg-line); border-radius:18px; background:var(--lg-canvas)!important; overflow:hidden; }
body[data-liquid-glass="on"] :is([class$="_header"],[class*="_header "]):has(:is([class$="_titleCluster"],[class*="_titleCluster "])) { background:var(--lg-glass); backdrop-filter:blur(24px) saturate(1.2); border-bottom:1px solid var(--lg-line); }
.lg-wordmark { display:inline-flex; align-items:baseline; gap:7px; font-size:15px; font-weight:600; letter-spacing:-.04em; color:var(--lg-ink); }
.lg-wordmark small { color:var(--lg-muted); font-size:10px; font-weight:400; letter-spacing:0; }
.lg-appearance-choice { flex:1 1 180px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; min-height:102px; padding:16px 24px; font:inherit; color:var(--lg-ink); border:1px solid var(--lg-line); background:var(--lg-fill); border-radius:14px; cursor:pointer; }
.lg-appearance-choice[aria-pressed="true"] { border-color:var(--lg-accent); box-shadow:0 0 0 1px var(--lg-accent),0 5px 18px #007aff0c; background:var(--lg-selected); }
body[data-liquid-glass="on"] :is([class$="_headline"],[class*="_headline "]):has(>:is([class$="_fishHitbox"],[class*="_fishHitbox "])) { justify-content:center; gap:0; margin:0; }
body[data-liquid-glass="on"] :is([class$="_headline"],[class*="_headline "]):has(>:is([class$="_fishHitbox"],[class*="_fishHitbox "]))>:is([class$="_titleGroup"],[class*="_titleGroup "]) { display:none; }
body[data-liquid-glass="on"] :is([class$="_fishHitbox"],[class*="_fishHitbox "]):has(.lg-hero-orb) { width:128px; height:128px; display:grid; place-items:center; }
body[data-liquid-glass="on"] :is([class$="_stack"],[class*="_stack "]):has(>:is([class$="_headline"],[class*="_headline "])) { gap:14px; margin-bottom:18px; }
.lg-home-intro { display:none; }body[data-liquid-glass="on"] .lg-home-intro { display:block; text-align:center; max-width:600px; margin:0 auto; }
.lg-home-intro h1 { color:var(--lg-ink); font:500 clamp(27px,3.1vw,38px)/1.55 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif; letter-spacing:-.055em; margin:2px 0 7px; }
.lg-home-intro p { font-size:13px; color:var(--lg-muted); line-height:1.9; margin:0; }
body[data-liquid-glass="on"] :is([class$="_composerHero"],[class*="_composerHero "]) { filter:drop-shadow(0 12px 28px #293c5b08); }
body[data-liquid-glass="on"] :is([class$="_composerStack"],[class*="_composerStack "]) { border-radius:20px; }
body[data-liquid-glass="on"] .lg-tree { padding:0 2px; }.lg-footer-action { width:auto; min-height:24px; margin:2px auto; padding:3px 8px; font-size:10px; background:transparent; }.lg-tree-bottom { padding-top:7px; padding-bottom:7px; min-height:25px; }
/* A mounted group animates both directions; inert removes hidden descendants from keyboard navigation. */
.lg-branch { display:grid; grid-template-rows:1fr; opacity:1; transition:grid-template-rows 220ms cubic-bezier(.2,.75,.25,1),opacity 160ms ease; }
.lg-branch.is-collapsed { grid-template-rows:0fr; opacity:0; }.lg-branch-inner { min-height:0; overflow:hidden; }
.lg-delete-description { line-height:1.9; color:var(--lg-muted); font-size:12px; }.lg-confirm-footer { display:flex; justify-content:flex-end; gap:8px; margin-top:22px; }.lg-delete-confirm { color:white; background:#df5358; border:1px solid #df5358; padding:9px 14px; border-radius:9px; font:inherit; cursor:pointer; }
@media(prefers-reduced-motion:reduce) { .lg-branch { transition:none; } }
@media(prefers-reduced-transparency:reduce) { body[data-liquid-glass="on"] :is([class$="_root"],[class*="_root "]):has(>:is([class$="_logoRow"],[class*="_logoRow "])),body[data-liquid-glass="on"] :is([class$="_header"],[class*="_header "]) { backdrop-filter:none; } }

/* Search unfolds on demand so the workspace list keeps the available height. */
.lg-tree-heading { padding:3px 6px 6px; min-height:32px; flex-shrink:0; }
.lg-search { height:30px; margin-bottom:8px; flex-shrink:0; }.lg-segments { padding:2px; margin-bottom:8px; flex-shrink:0; }
body[data-liquid-glass="on"] :is([class$="_cubeRow"],[class*="_cubeRow "]) { flex-wrap:wrap; }
body[data-liquid-glass="on"] :is([class$="_cubeRow"],[class*="_cubeRow "])>:is([class$="_themeCube"],[class*="_themeCube "])[aria-pressed="true"] { border-color:var(--lg-line); box-shadow:none; }

body[data-liquid-glass="on"] :is([class$="_panelList"],[class*="_panelList "]) [class*="_panelRow"],body[data-liquid-glass="on"] :is([class$="_root"],[class*="_root "])>:is([class$="_newSession"],[class*="_newSession "]) { color:var(--lg-ink); }

/* Fixed action slots: hovering changes paint only, never text width or row geometry. */
.lg-row-actions { display:flex; align-items:center; justify-content:flex-end; flex:0 0 42px; width:42px; gap:0; }
.lg-row-actions .lg-icon-button { display:inline-flex; width:21px; height:23px; opacity:.55; transition:opacity 120ms,background 120ms; }
.lg-row-actions>button:not([data-edit]) { visibility:hidden; pointer-events:none; }
.lg-workspace-row .lg-row-actions>button { visibility:visible; pointer-events:auto; }
.lg-tree-row:hover .lg-icon-button,.lg-tree-row:focus-within .lg-icon-button { opacity:1; visibility:visible; pointer-events:auto; }
.lg-count { display:inline-block; }.lg-row-text { letter-spacing:0; }.lg-workspace-row .lg-row-text { line-height:20px; }
/* The top layer remains nonmodal, with no full-window backdrop. */
.lg-row-menu { position:fixed; inset:auto; margin:0; box-sizing:border-box; width:216px; max-width:calc(100vw - 16px); padding:5px; border:1px solid var(--lg-line); border-radius:12px; background:var(--lg-glass); backdrop-filter:blur(28px) saturate(1.3); color:var(--lg-ink); box-shadow:0 12px 36px #17263b24,0 2px 8px #17263b0c; font:13px/1.4 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif; transform-origin:top left; animation:lg-menu-in 120ms cubic-bezier(.2,.7,.25,1); }
.lg-row-menu:popover-open { display:flex; flex-direction:column; gap:1px; }.lg-row-menu::backdrop { background:transparent; pointer-events:none; }
.lg-row-menu>button { display:flex; align-items:center; gap:9px; min-height:32px; padding:6px 8px; margin:0; border:0; border-radius:7px; background:transparent; color:inherit; font:inherit; text-align:left; cursor:pointer; }
.lg-row-menu>button:hover,.lg-row-menu>button:focus-visible { background:var(--lg-hover); outline:none; }.lg-row-menu>button:focus-visible { box-shadow:inset 0 0 0 1px var(--lg-accent); }
.lg-row-menu>button.lg-danger { color:#d64048; }.lg-row-menu small { margin-left:auto; color:var(--lg-muted); font-size:10px; }.lg-row-menu svg { flex:none; }
.lg-row-menu hr { width:calc(100% - 12px); height:1px; border:0; background:var(--lg-line); margin:4px 6px; }
.lg-undo { display:flex; align-items:center; gap:8px; padding:5px 6px; color:var(--lg-muted); font-size:11px; }.lg-undo>span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }.lg-undo button { flex:none; }
@keyframes lg-menu-in { from { opacity:0; transform:translateY(-3px) scale(.98); } to { opacity:1; transform:none; } }
/* Only the orb and its optical layers move; surrounding layout stays fixed. */
@media(hover:none) { .lg-row-actions>button:not([data-edit]) { visibility:visible; pointer-events:auto; }.lg-row-actions .lg-icon-button { opacity:.8; } }

body[data-liquid-glass="on"] :is([class$="_frame"],[class*="_frame "]):not([data-sidebar-collapsed])>:is([class$="_sidebarCol"],[class*="_sidebarCol "]) { padding:8px 4px 8px 8px; box-sizing:border-box; border:0; }
body[data-liquid-glass="on"] :is([class$="_frame"],[class*="_frame "]):not([data-sidebar-collapsed])>:is([class$="_sidebarCol"],[class*="_sidebarCol "])>:is([class$="_root"],[class*="_root "]) { width:100%!important; }
body[data-liquid-glass="on"] :is([class$="_frame"],[class*="_frame "])>:is([class$="_centerCol"],[class*="_centerCol "]) { margin:8px 8px 8px 4px; }
body[data-liquid-glass="on"] :is([class$="_frame"],[class*="_frame "])[data-sidebar-collapsed]>:is([class$="_centerCol"],[class*="_centerCol "]) { margin-left:8px; }

/* A quiet azure-to-periwinkle line expands from the center, without reflow. */
.lg-hover-underline { position:absolute; left:calc(24px + var(--depth)*14px); right:7px; bottom:0; height:1.5px; border-radius:1px; background:linear-gradient(90deg,transparent,#5db5d6 22%,#718dcc 68%,transparent); opacity:0; transform:scaleX(0); transform-origin:center; transition:transform 280ms cubic-bezier(.2,.75,.2,1),opacity 180ms; pointer-events:none; }
.lg-tree-row[data-kind="session"]:hover,.lg-tree-row[data-kind="session"]:focus-within { background:color-mix(in srgb,var(--lg-accent) 5%,var(--lg-hover)); }
.lg-tree-row[data-kind="session"]:hover>.lg-hover-underline,.lg-tree-row[data-kind="session"]:focus-within>.lg-hover-underline { transform:scaleX(1); opacity:.9; }
body[data-ds-dark-theme] .lg-hover-underline,body[data-lg-scheme="dark"] .lg-hover-underline { background:linear-gradient(90deg,transparent,#76d9ed 22%,#9eafff 68%,transparent); }
.lg-pin { color:var(--lg-accent); flex:none; }
.lg-appearance-orb { display:block; width:27px; height:27px; border-radius:50%; background:conic-gradient(#c4ecf8,#b7c4f2,#ddc9ed,#c4ecf8); box-shadow:inset 0 0 9px #fff9; }
/* A fixed seat contains the floating shell, independently advected fluid fields,
   caustic light and a tilted orbit. The title/composer never move with the orb. */
.lg-orb-stage { position:relative; display:block; width:128px; height:128px; isolation:isolate;  }
.lg-orb-halo { position:absolute; inset:11px; border-radius:50%; background:radial-gradient(circle,#64c9ed46,#93a9ff28 40%,transparent 70%); filter:blur(8px); animation:lg-halo-breathe 5s ease-in-out infinite; pointer-events:none; }
.lg-hero-orb { position:absolute; width:92px; height:92px; left:18px; top:10px; overflow:hidden; border-radius:50%; border:1px solid #c1eeffb0; background:radial-gradient(circle at 32% 23%,#ffffffa0,transparent 46%),radial-gradient(circle at 68% 76%,#688ad783,transparent 65%),#a0d5ef50; box-shadow:inset 1px 2px 9px #ffffffb0,inset -5px -9px 16px #405a9b55,0 0 26px #6aadee26; transform-style:flat; isolation:isolate; animation:lg-orb-levitate 7s cubic-bezier(.45,0,.55,1) infinite; }
.lg-orb-clip { position:absolute; inset:0; overflow:hidden; border-radius:50%; clip-path:circle(50%); isolation:isolate; transform:translateZ(0); transform-style:flat; contain:paint; }
.lg-orb-fluid { position:absolute; width:115%; height:115%; top:-8%; left:-8%; border-radius:42% 58% 62% 38% / 52% 38% 62% 48%; filter:blur(5px); mix-blend-mode:screen; }
.lg-orb-fluid-a { background:conic-gradient(from 30deg,transparent 10%,#25b8e9e0 32%,transparent 56%,#9df7f7b0 78%,transparent); animation:lg-fluid-a 4.8s linear infinite; }
.lg-orb-fluid-b { background:conic-gradient(from 160deg,#a38cf8e0,transparent 30%,#5d8ef4c0 52%,transparent 78%); animation:lg-fluid-b 6.2s linear infinite reverse; }
.lg-orb-fluid-c { width:80%; height:90%; top:5%; left:6%; background:radial-gradient(ellipse at 38% 42%,#d5fff6c0,transparent 62%),conic-gradient(#6388ff00,#8ab6edb0,#efb7ff90,transparent); animation:lg-fluid-c 3.7s ease-in-out infinite; }
.lg-orb-core { position:absolute; inset:23%; border-radius:50%; background:radial-gradient(ellipse,#f2ffffe0,#b1e5ff70 35%,transparent 70%); filter:blur(5px); animation:lg-core-drift 4.4s ease-in-out infinite; mix-blend-mode:screen; }
.lg-orb-caustic { position:absolute; inset:3px; border-radius:50%; border:1px solid #ffffff70; background:conic-gradient(from 0deg,transparent 0 30%,#ffffff80 36%,transparent 43% 71%,#9defff70 80%,transparent 90%); mask-image:radial-gradient(circle,transparent 44%,#000 72%); animation:lg-caustic-turn 5.6s linear infinite; mix-blend-mode:screen; }
.lg-orb-sheen { position:absolute; inset:6px 12px 28px 9px; border-radius:50%; background:linear-gradient(135deg,#ffffffb0,transparent 60%); transform:rotate(-20deg); opacity:.45; pointer-events:none; }
.lg-orb-orbit { position:absolute; width:123px; height:123px; left:2px; top:-5px; border:1px solid #75cde44d; border-left-color:#c5b1ff77; border-right-color:transparent; border-radius:50%; transform:rotateX(64deg) rotateZ(-20deg); animation:lg-orbit-precess 9s linear infinite; pointer-events:none; }
.lg-orb-orbit i { position:absolute; top:13px; right:13px; width:4px; height:4px; border-radius:50%; background:#bbf8ff; box-shadow:0 0 8px 2px #66cfea80; }
.lg-orb-shadow { position:absolute; bottom:7px; left:29px; width:70px; height:9px; border-radius:50%; background:#6389b82c; filter:blur(5px); animation:lg-shadow-breathe 7s ease-in-out infinite; pointer-events:none; }
body[data-ds-dark-theme] .lg-hero-orb,body[data-lg-scheme="dark"] .lg-hero-orb { background:radial-gradient(circle at 28% 18%,#e0ffff66,transparent 38%),#102e64; border-color:#a2dfff80; box-shadow:inset 1px 2px 9px #c8efff88,inset -5px -9px 16px #0b193b80,0 0 30px #448af24d; }
@keyframes lg-orb-levitate { 0%,100% { transform:translate(calc(-4px * var(--lg-drift,1)),calc(2px * var(--lg-drift,1))) rotate(-8deg); } 25% { transform:translate(calc(6px * var(--lg-drift,1)),calc(-11px * var(--lg-drift,1))) rotate(4deg); } 50% { transform:translate(calc(3px * var(--lg-drift,1)),calc(-5px * var(--lg-drift,1))) rotate(10deg); } 75% { transform:translate(calc(-7px * var(--lg-drift,1)),calc(6px * var(--lg-drift,1))) rotate(-3deg); } }
@keyframes lg-fluid-a { 0% { transform:rotate(0deg) translate(5%,-8%) scale(1.15); } 50% { transform:rotate(180deg) translate(-12%,8%) scale(.95,1.2); } 100% { transform:rotate(360deg) translate(5%,-8%) scale(1.15); } }
@keyframes lg-fluid-b { 0% { transform:rotate(0deg) translate(-9%,8%) scale(1.15,.95); } 50% { transform:rotate(180deg) translate(9%,-12%) scale(.95,1.2); } 100% { transform:rotate(360deg) translate(-9%,8%) scale(1.15,.95); } }
@keyframes lg-fluid-c { 0%,100% { transform:translate(-12%,12%) rotate(-25deg) scale(1.1,.8); } 50% { transform:translate(22%,-14%) rotate(100deg) scale(.8,1.3); } }
@keyframes lg-core-drift { 0%,100% { transform:translate(-12%,-15%) scale(.7); opacity:.6; } 50% { transform:translate(24%,22%) scale(1.15,.8); opacity:1; } }
@keyframes lg-caustic-turn { to { transform:rotate(360deg); } }
@keyframes lg-orbit-precess { 0% { transform:rotateX(64deg) rotateY(-12deg) rotateZ(-20deg); } 100% { transform:rotateX(64deg) rotateY(-12deg) rotateZ(340deg); } }
@keyframes lg-halo-breathe { 0%,100% { transform:scale(.9); opacity:.65; } 50% { transform:scale(1.2); opacity:1; } }
@keyframes lg-shadow-breathe { 0%,100% { transform:scaleX(1); opacity:.65; } 35% { transform:scaleX(.65); opacity:.3; } 75% { transform:scaleX(1.1); opacity:.8; } }
/* Claude-like continuous luminance sweep on the host's ACTIVE TextShimmer only.
   Native elapsed clocks, accessible text and completed labels remain intact. */
body[data-liquid-glass="on"] { --lg-live-base:#8a6656; --lg-live-glint:#d7a27f; }
body[data-liquid-glass="on"][data-ds-dark-theme],body[data-liquid-glass="on"][data-lg-scheme="dark"] { --lg-live-base:#a99b93; --lg-live-glint:#fff0de; }
body[data-liquid-glass="on"] [data-conversation-region="chat"] [data-shimmer="true"]> :is([class$="_content"],[class*="_content "]) { color:transparent!important; -webkit-text-fill-color:transparent; background:linear-gradient(105deg,var(--lg-live-base) 0% 28%,var(--lg-live-glint) 43%,var(--lg-live-base) 58% 100%); background-size:260% 100%; background-position:130% 0; background-clip:text; -webkit-background-clip:text; animation:lg-status-glint 2.2s linear infinite; }
body[data-liquid-glass="on"] [data-conversation-region="chat"] [data-shimmer="true"]> :is([class$="_content"],[class*="_content "]) * { color:transparent!important; -webkit-text-fill-color:transparent; }
body[data-liquid-glass="on"] [data-conversation-region="chat"] [data-shimmer="true"]> :is([class$="_decoration"],[class*="_decoration "]) { display:none; }
body[data-liquid-glass="on"] [data-process-activity]:has([data-shimmer="true"]) [data-step-process-icon] { color:var(--lg-live-base); animation:lg-process-breathe 2.2s ease-in-out infinite; }
@keyframes lg-status-glint { from { background-position:130% 0; } to { background-position:-130% 0; } }
@keyframes lg-process-breathe { 0%,100% { opacity:.45; filter:drop-shadow(0 0 0 transparent); } 50% { opacity:1; filter:drop-shadow(0 0 3px #d4a18055); } }
@media(prefers-reduced-motion:reduce) { .lg-orb-stage *,.lg-orb-stage *::before,.lg-orb-stage *::after { animation:none!important; transition:none!important; } body[data-liquid-glass="on"] [data-conversation-region="chat"] [data-shimmer="true"]> :is([class$="_content"],[class*="_content "]) { animation:none; color:var(--lg-live-base)!important; -webkit-text-fill-color:currentColor; background:none; } body[data-liquid-glass="on"] [data-conversation-region="chat"] [data-shimmer="true"]> :is([class$="_content"],[class*="_content "]) * { color:inherit!important; -webkit-text-fill-color:currentColor; } body[data-liquid-glass="on"] [data-step-process-icon] { animation:none!important; } }

.lg-orb-ribbon { position:absolute; width:106%; height:56%; left:-3%; top:20%; border-radius:50%; border:2px solid transparent; border-top-color:#d2ffffc0; border-bottom-color:#74c9ff88; box-shadow:0 -2px 7px #a0eaff40,inset 0 3px 6px #e2ffff33; mix-blend-mode:screen; pointer-events:none; }
.lg-orb-ribbon-a { animation:lg-ribbon-a 4.2s linear infinite; }
.lg-orb-ribbon-b { width:85%; height:104%; top:-2%; left:7%; border-top-color:#d7c8ff99; border-bottom-color:#9dd3ff66; animation:lg-ribbon-b 5.3s linear infinite reverse; }
@keyframes lg-ribbon-a { 0% { transform:rotate(-25deg) rotateY(15deg) translateY(-8%); } 50% { transform:rotate(155deg) rotateY(55deg) translateY(10%); } 100% { transform:rotate(335deg) rotateY(15deg) translateY(-8%); } }
@keyframes lg-ribbon-b { 0% { transform:rotate(20deg) rotateX(30deg); } 50% { transform:rotate(200deg) rotateX(65deg); } 100% { transform:rotate(380deg) rotateX(30deg); } }

/* Compact rail consumes the host's wide=false contract; full tree is never squeezed. */
.lg-workspace-rail { display:flex; justify-content:center; width:100%; flex:1; padding:4px 0; }
.lg-rail-button { position:relative; width:36px; height:36px; padding:0; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--lg-line); border-radius:10px; color:var(--lg-accent); background:var(--lg-fill); cursor:pointer; }
.lg-rail-button:hover,.lg-rail-button:focus-visible { background:var(--lg-selected); outline:2px solid var(--lg-accent); outline-offset:-2px; }
.lg-rail-error { position:absolute; right:3px; top:3px; width:5px; height:5px; background:#df5358; border-radius:50%; }
.lg-footer-action.lg-footer-rail { width:36px; height:36px; padding:0; justify-content:center; flex:none; margin:0; }
body[data-liquid-glass="on"] :is([class$="_root"],[class*="_root "])[class*="_collapsed"]:has(>[class*="_logoRow"]) { padding:4px 10px 8px; }
body[data-liquid-glass="on"] [class*="_collapsed"]>[class*="_logoRow"] { justify-content:center; padding:0; margin-bottom:10px; }
body[data-liquid-glass="on"] [class*="_collapsed"]>[class*="_panelList"] { gap:8px; margin-bottom:8px; }
body[data-liquid-glass="on"] [class*="_collapsed"]>[class*="_panelList"] [class*="_panelRow"] { width:36px; height:36px; min-height:36px; padding:0; justify-content:center; }
.lg-tree[data-density="compact"] .lg-tree-row { min-height:28px; padding-top:3px; padding-bottom:3px; }
.lg-tree[data-show-tags="false"] .lg-row-text small { display:none; }
.lg-tree[data-show-counts="false"] .lg-count { display:none; }
/* Settings live in a native settings.section, with native navigation and scrolling. */
.lg-settings { padding:24px; width:100%; max-width:820px; border:0; }
.lg-settings header { gap:12px; margin-bottom:24px; align-items:flex-start; }
.lg-settings h2 { margin:0; font-size:20px; font-weight:600; }
.lg-settings header p { margin:5px 0 0; }
.lg-settings fieldset { min-width:0; padding:0; border:0; margin:0 0 26px; }
.lg-settings legend { color:var(--lg-muted); font-size:11px; font-weight:600; padding:0 0 6px; }
.lg-settings .lg-setting-row { display:flex; gap:18px; padding:12px 0; margin:0; border-bottom:1px solid var(--lg-line); font-size:13px; }
.lg-setting-row>span { min-width:0; }.lg-setting-row small { display:block; margin-top:5px; font-size:11px; color:var(--lg-muted); line-height:1.6; }
.lg-settings select { font:inherit; color:var(--lg-ink); background:var(--lg-card); border:1px solid var(--lg-line); padding:6px 8px; border-radius:7px; flex:none; max-width:44%; }
.lg-settings input[type="checkbox"] { width:17px; height:17px; flex:none; }
.lg-settings :is(input,select,button):focus-visible { outline:2px solid var(--lg-accent); outline-offset:3px; }
.lg-settings footer { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }.lg-settings footer span { color:var(--lg-muted); font-size:11px; }
/* All opt-outs are scoped to this theme. OS accessibility preferences take priority. */
body[data-liquid-glass="on"][data-lg-glass="solid"] { --lg-glass:var(--lg-card); --dsw-menu-backdrop-filter:none; }
body[data-liquid-glass="on"][data-lg-glass="solid"] :is([class*="_root"]:has(>[class*="_logoRow"]),[class*="_header"]),body[data-lg-glass="solid"] .lg-row-menu { backdrop-filter:none; }
body[data-lg-orb="false"] .lg-orb-stage { display:none; }
body[data-liquid-glass="on"][data-lg-orb="false"] [class*="_fishHitbox"]:has(.lg-orb-stage) { display:none; }
body[data-lg-hover-line="false"] .lg-hover-underline { display:none; }
body[data-lg-motion="soft"] .lg-orb-stage { --lg-drift:.4; }
body[data-lg-motion="soft"] .lg-hero-orb { animation-duration:11s; }
body[data-lg-motion="soft"] .lg-orb-fluid-a { animation-duration:8s; }body[data-lg-motion="soft"] .lg-orb-fluid-b { animation-duration:10s; }body[data-lg-motion="soft"] .lg-orb-fluid-c { animation-duration:7s; }
body[data-lg-motion="soft"] :is(.lg-orb-caustic,.lg-orb-orbit,.lg-orb-ribbon) { animation-duration:12s; }
body[data-lg-motion="off"] :is(.lg-orb-stage *,.lg-tree *,.lg-row-menu) { animation:none!important; transition:none!important; }
body[data-lg-motion="off"] .lg-hover-underline { transform:none; }
body[data-liquid-glass="on"]:is([data-lg-status-glow="false"],[data-lg-motion="off"]) [data-conversation-region="chat"] [data-shimmer="true"]> :is([class$="_content"],[class*="_content "]) { animation:none!important; background:none; color:var(--lg-live-base)!important; -webkit-text-fill-color:currentColor; }
body[data-liquid-glass="on"]:is([data-lg-status-glow="false"],[data-lg-motion="off"]) [data-conversation-region="chat"] [data-shimmer="true"]> :is([class$="_content"],[class*="_content "]) * { color:inherit!important; -webkit-text-fill-color:currentColor; }
body[data-liquid-glass="on"]:is([data-lg-status-glow="false"],[data-lg-motion="off"]) [data-step-process-icon] { animation:none!important; }
@media(prefers-reduced-motion:reduce) { .lg-row-menu { animation:none; }.lg-hover-underline { transition:none; transform:none; } }
body[data-lg-motion="soft"][data-liquid-glass="on"] [data-conversation-region="chat"] [data-shimmer="true"]> :is([class$="_content"],[class*="_content "]) { animation-duration:3.6s; }
.lg-appearance-modes { margin-left:auto; display:flex; flex-wrap:wrap; gap:3px; padding:3px; border:1px solid var(--lg-line); border-radius:9px; background:var(--lg-fill); flex:none; }
.lg-appearance-modes button { border:0; border-radius:6px; padding:6px 9px; color:var(--lg-muted); background:transparent; font:inherit; font-size:12px; white-space:nowrap; }
.lg-appearance-modes button[aria-pressed="true"] { color:var(--lg-ink); background:var(--lg-selected); box-shadow:0 1px 4px #0001; }
.lg-appearance-modes button:hover { color:var(--lg-accent); }.lg-appearance-modes button:disabled { opacity:.5; cursor:wait; }

/* One stable old frame -> one final palette. No intermediate native media-query frames. */
html[data-lg-theme-transition="on"]::view-transition-group(root) { animation-duration:240ms; animation-timing-function:ease-out; }
html[data-lg-theme-transition="on"]::view-transition-old(root),html[data-lg-theme-transition="on"]::view-transition-new(root) { animation-duration:240ms; mix-blend-mode:normal; }
html[data-lg-theme-transition="on"]::view-transition-old(root) { animation:lg-theme-old 240ms ease-out both; }
html[data-lg-theme-transition="on"]::view-transition-new(root) { animation:lg-theme-new 240ms ease-out both; }
@keyframes lg-theme-old { to { opacity:0; } }@keyframes lg-theme-new { from { opacity:0; } }
body[data-liquid-glass="on"][data-ds-dark-theme],body[data-liquid-glass="on"][data-lg-scheme="dark"] { --lg-glass:rgba(23,26,32,.94); }
body[data-liquid-glass="on"] :is([class$="_root"],[class*="_root "]):has(>[class*="_logoRow"])>[class*="_topStrip"] { height:58px; min-height:58px; }
body[data-liquid-glass="on"] :is([class$="_root"],[class*="_root "]):has(>[class*="_logoRow"])>[class*="_logoRow"] { margin-bottom:14px; }
body[data-liquid-glass="on"] [class*="_footerActions"] { flex-direction:column; align-items:stretch; gap:6px; }
.lg-utility-action { box-sizing:border-box; display:flex; align-items:center; justify-content:flex-start; gap:8px; width:calc(100% + 4px); min-height:36px; margin:0 -2px; padding:7px 8px; border:0; border-radius:8px; color:var(--lg-ink); font:14px/22px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif; background:transparent; cursor:pointer; }
.lg-utility-action:hover { background:var(--lg-hover); }.lg-utility-action:focus-visible { outline:2px solid var(--lg-accent); outline-offset:-2px; }.lg-utility-action svg { flex:none; }.lg-utility-action:disabled { opacity:.5; }.lg-utility-action.lg-utility-rail { width:36px; height:36px; margin:0; padding:0; justify-content:center; }
.lg-cascade { position:fixed; inset:auto; margin:0; padding:5px; border:1px solid var(--lg-line); border-radius:13px; background:var(--lg-glass); backdrop-filter:blur(28px) saturate(1.3); box-shadow:0 12px 36px #17263b24; color:var(--lg-ink); font:13px/1.5 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif; max-width:calc(100vw - 16px); }
.lg-cascade:popover-open { display:flex; gap:4px; }.lg-cascade::backdrop { background:transparent; pointer-events:none; }
.lg-cascade-column { display:flex; flex-direction:column; width:234px; max-width:calc(100vw - 28px); max-height:min(66vh,480px); flex:none; min-width:0; }
.lg-cascade-column+section { border-left:1px solid var(--lg-line); padding-left:4px; }
.lg-cascade-column header { display:flex; align-items:center; gap:4px; padding:5px 7px 9px; color:var(--lg-muted); font-size:11px; flex:none; }
.lg-cascade-column header>span { flex:1; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
.lg-cascade-column button { display:flex; align-items:center; gap:8px; width:100%; min-width:0; min-height:33px; padding:6px 8px; color:inherit; background:none; border:0; border-radius:7px; font:inherit; text-align:left; cursor:pointer; }
.lg-cascade-column button>span:first-child { display:flex; flex:none; }.lg-cascade-column button>span:nth-child(2) { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lg-cascade-column button:hover,.lg-cascade-column button:focus-visible,.lg-cascade-column button.is-open { outline:0; background:var(--lg-hover); color:var(--lg-accent); }.lg-cascade-column button:focus-visible { box-shadow:inset 0 0 0 1px var(--lg-accent); }
.lg-cascade-column button[aria-current="page"] { background:var(--lg-selected); }
.lg-cascade-column header button { width:22px; min-height:22px; padding:3px; flex:none; justify-content:center; }.lg-cascade-column header button:first-child svg { transform:rotate(180deg); }
.lg-cascade-list { overflow:auto; min-height:0; flex:1; scrollbar-width:thin; }.lg-cascade-column footer { border-top:1px solid var(--lg-line); margin-top:5px; padding-top:4px; flex:none; font-size:12px; }
.lg-cascade-empty { padding:14px 10px; color:var(--lg-muted); font-size:11px; }
body[data-lg-glass="solid"] .lg-cascade { backdrop-filter:none; background:var(--lg-card); }
@media(prefers-reduced-motion:reduce) { html[data-lg-theme-transition="on"]::view-transition-group(root),html[data-lg-theme-transition="on"]::view-transition-old(root),html[data-lg-theme-transition="on"]::view-transition-new(root) { animation-duration:1ms!important; } }
html:has(body[data-lg-motion="off"])::view-transition-group(root),html:has(body[data-lg-motion="off"])::view-transition-old(root),html:has(body[data-lg-motion="off"])::view-transition-new(root) { animation-duration:1ms!important; }
body[data-liquid-glass="on"] :is([class$="_sidebarCol"],[class*="_sidebarCol "]):has(>[class*="_root"]>[class*="_logoRow"]) { background:var(--lg-glass)!important; }
.lg-cascade-error { margin:5px 8px; color:#d64048; font-size:11px; line-height:1.7; }
.lg-cascade-column button:disabled { opacity:.45; cursor:wait; }
`;

// src/orb.jsx
var import_react5 = __toESM(require("react"), 1);
function LiquidOrb() {
  return /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-stage", "aria-hidden": "true" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-halo" }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-orbit" }, /* @__PURE__ */ import_react5.default.createElement("i", null)), /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-hero-orb" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-clip" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-fluid lg-orb-fluid-a" }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-fluid lg-orb-fluid-b" }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-fluid lg-orb-fluid-c" }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-core" }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-ribbon lg-orb-ribbon-a" }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-ribbon lg-orb-ribbon-b" }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-caustic" }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-sheen" }))), /* @__PURE__ */ import_react5.default.createElement("span", { className: "lg-orb-shadow" }));
}

// src/native.js
function createSessionActions(ctx, writeClipboard = copyText) {
  return {
    renameSession: async (id, title) => {
      const result = await ctx.sessions.using(id, { source: "workspaceOperation" }, (ref) => ref.binding.session.rename(title));
      if (!result.ok) throw new Error(result.error.message);
    },
    pinSession: (id) => ctx.uiWorkspace.pinSession(id),
    unpinSession: (id) => ctx.uiWorkspace.unpinSession(id),
    forkSession: (id) => ctx.uiWorkspace.forkSession(id, void 0, { allowMigration: false }),
    copySessionId: async (id) => {
      if (!await writeClipboard(id)) throw new Error("\u65E0\u6CD5\u5199\u5165\u526A\u8D34\u677F\uFF0C\u8BF7\u68C0\u67E5\u7CFB\u7EDF\u6743\u9650\u540E\u91CD\u8BD5");
    }
  };
}
async function copyText(text2) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text2);
      return true;
    } catch {
      return false;
    }
  }
  if (typeof document.execCommand !== "function") return false;
  const previous = document.activeElement;
  const node = document.createElement("textarea");
  node.value = text2;
  node.setAttribute("readonly", "");
  node.style.cssText = "position:fixed;left:-9999px;top:0";
  document.body.append(node);
  try {
    node.select();
    return document.execCommand("copy");
  } finally {
    node.remove();
    previous?.focus?.({ preventScroll: true });
  }
}
function createCreationActions(ctx, controller, workspacePicker) {
  return {
    createWorkspace: () => workspacePicker.request(),
    createSession: async (workspaceId, folderId = null) => {
      const id = await ctx.sessions.create({ workspaceId });
      if (!id) throw new Error("\u521B\u5EFA\u4F1A\u8BDD\u672A\u8FD4\u56DE Session ID");
      try {
        if (folderId !== null) await controller.mutate({ type: "session.move", id, workspaceId, folderId });
      } catch (error) {
        ctx.uiWorkspace.openSession(id);
        throw new Error(`\u4F1A\u8BDD\u5DF2\u521B\u5EFA\uFF0C\u4F46\u76EE\u5F55\u5F52\u7C7B\u672A\u4FDD\u5B58\uFF1A${error.message}`);
      }
      ctx.uiWorkspace.openSession(id);
      return id;
    }
  };
}

// src/catalog.js
function createCatalog(workspaces, sessions) {
  const archived = new Set(workspaces.archivedSessionIds ?? []);
  const pinned = new Set(workspaces.pinnedSessionIds ?? []);
  return workspaces.items.map((w) => ({
    workspaceId: w.workspaceId,
    title: w.title || "\u9ED8\u8BA4\u5DE5\u4F5C\u533A",
    path: w.path,
    sessionIds: w.sessionIds,
    sessions: w.sessionIds.flatMap((id) => {
      const session = sessions.byId[id];
      return session && !archived.has(id) && (!session.blank || (session.retainedBy?.mainView ?? 0) > 0) ? [{ id, title: session.title || "\u65B0\u4F1A\u8BDD", pinned: pinned.has(id) }] : [];
    })
  }));
}

// src/skin.js
function findAppearanceRow(doc = document) {
  for (const row of doc.querySelectorAll('[class$="_cubeRow"], [class*="_cubeRow "]')) {
    const buttons = [...row.children].filter((node) => node.tagName === "BUTTON" && [...node.classList].some((c) => c.endsWith("_themeCube")));
    if (buttons.length >= 3) return { row, buttons };
  }
  return null;
}
function installSkinChoice({ controller, doc = document }) {
  let mounted;
  let disposed = false;
  let scheduled = false;
  let selecting = false;
  const enabled = () => controller.getSnapshot().state.preferences.theme;
  const choose = async (value) => {
    if (disposed) return;
    if (value) {
      selecting = true;
      const native = findAppearanceRow(doc);
      const selected = native?.buttons.find((b) => b.getAttribute("aria-pressed") === "true") ?? native?.buttons.at(-1);
      selected?.click();
      selecting = false;
    }
    if (enabled() !== value) await controller.mutate({ type: "preferences", patch: { theme: value } });
  };
  const sync = () => {
    if (disposed) return;
    const target = findAppearanceRow(doc);
    if (!target) {
      mounted?.remove();
      mounted = void 0;
      return;
    }
    if (!mounted) {
      mounted = doc.createElement("button");
      mounted.type = "button";
      mounted.className = "lg-appearance-choice";
      mounted.dataset.plugin = "dsh-liquid-glass";
      mounted.setAttribute("aria-label", "Liquid Glass");
      const icon = doc.createElement("span");
      icon.className = "lg-appearance-orb";
      icon.setAttribute("aria-hidden", "true");
      const label = doc.createElement("span");
      label.textContent = "Liquid Glass";
      mounted.append(icon, label);
      mounted.addEventListener("click", () => {
        choose(true).catch(() => {
        });
      });
    }
    if (mounted.parentElement !== target.row) target.row.append(mounted);
    const pressed = String(enabled());
    if (mounted.getAttribute("aria-pressed") !== pressed) mounted.setAttribute("aria-pressed", pressed);
    mounted.disabled = controller.getSnapshot().loading || controller.getSnapshot().saving;
  };
  const nativeChoice = (event) => {
    const target = event.target?.closest?.("button");
    if (!target || target === mounted || selecting || !enabled()) return;
    const appearance = findAppearanceRow(doc);
    if (appearance?.row.contains(target)) choose(false).catch(() => {
    });
  };
  const observer = new MutationObserver(() => {
    if (!scheduled) {
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        sync();
      });
    }
  });
  observer.observe(doc.body, { childList: true, subtree: true });
  const skinObserver = new MutationObserver((records) => {
    if (selecting || !enabled()) return;
    const foreign = records.some(({ attributeName: name }) => name !== "data-liquid-glass" && name !== "data-ds-dark-theme" && /^data-.*(?:skin|kimino)/i.test(name ?? "") && !["", "false", "off", "none", "native", "0"].includes(doc.body.getAttribute(name) ?? ""));
    if (foreign) choose(false).catch(() => {
    });
  });
  skinObserver.observe(doc.body, { attributes: true });
  doc.addEventListener("click", nativeChoice, true);
  const unsubscribe = controller.subscribe(sync);
  sync();
  return {
    choose,
    dispose: () => {
      disposed = true;
      observer.disconnect();
      skinObserver.disconnect();
      unsubscribe();
      doc.removeEventListener("click", nativeChoice, true);
      mounted?.remove();
    }
  };
}
function installShellSkin(doc = document) {
  const added = /* @__PURE__ */ new Set();
  let queued = false;
  let stopped = false;
  const sync = () => {
    if (stopped) return;
    for (const headline of doc.querySelectorAll('[class$="_headline"], [class*="_headline "]')) {
      if (!headline.querySelector('[class$="_fishHitbox"], [class*="_fishHitbox "]')) continue;
      const stack = headline.parentElement;
      const body = [...stack.children].find((node) => [...node.classList].some((c) => c.endsWith("_body")));
      if (!body || body.querySelector(".lg-home-intro")) continue;
      const intro = doc.createElement("div");
      intro.className = "lg-home-intro";
      const title = doc.createElement("h1");
      title.textContent = "\u8BA9\u60F3\u6CD5\uFF0C\u6E05\u6670\u6D41\u52A8\u3002";
      const subtitle = doc.createElement("p");
      subtitle.textContent = "\u4ECE\u4E00\u4E2A\u95EE\u9898\u5F00\u59CB\uFF0C\u628A\u7075\u611F\u6574\u7406\u6210\u4E0B\u4E00\u6B65\u3002";
      intro.append(title, subtitle);
      body.append(intro);
      added.add(intro);
    }
  };
  const observer = new MutationObserver(() => {
    if (!queued) {
      queued = true;
      queueMicrotask(() => {
        queued = false;
        sync();
      });
    }
  });
  observer.observe(doc.body, { childList: true, subtree: true });
  sync();
  return () => {
    stopped = true;
    observer.disconnect();
    for (const node of added) node.remove();
  };
}

// src/directory-flow.js
var DIRECTORY_FLOW = "liquid-glass.workspace.directoryFlow";
var NATIVE_DIRECTORY_FLOW = "sidebar.workspaces.directoryFlow";
function installDirectoryFlow(ctx) {
  return ctx.slots.inject(DIRECTORY_FLOW, () => ctx.slots.inject(NATIVE_DIRECTORY_FLOW, () => {
    let previous;
    let release;
    const sync = () => {
      const current = ctx.slots.entriesOfSlot(NATIVE_DIRECTORY_FLOW)[0];
      if (current === previous) return;
      release?.();
      release = void 0;
      previous = void 0;
      if (!current) return;
      const dispose = ctx.slots.register({
        name: DIRECTORY_FLOW,
        ...current.inject ? { inject: current.inject } : {},
        ...current.locale ? { locale: current.locale } : {},
        ...current.store ? { store: current.store } : {}
      }, current.component);
      release = dispose;
      previous = current;
    };
    const unsubscribe = ctx.slots.subscribe(NATIVE_DIRECTORY_FLOW, sync);
    sync();
    return () => {
      unsubscribe();
      release?.();
    };
  }));
}

// src/workspace-picker.js
function createWorkspacePicker({ createWorkspace, available = () => true }) {
  let snapshot = { open: false, busy: false };
  let pending;
  let disposed = false;
  const listeners = /* @__PURE__ */ new Set();
  const publish = (patch) => {
    snapshot = { ...snapshot, ...patch };
    for (const fn of listeners) fn();
  };
  const finish = (error, result) => {
    const current = pending;
    pending = void 0;
    publish({ open: false, busy: false });
    if (current) error ? current.reject(error) : current.resolve(result);
  };
  return {
    getSnapshot: () => snapshot,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    request: () => {
      if (disposed) return Promise.reject(new Error("\u76EE\u5F55\u9009\u62E9\u5668\u5DF2\u5173\u95ED"));
      if (pending) return pending.promise;
      if (!available()) return Promise.reject(new Error("\u76EE\u5F55\u9009\u62E9\u5668\u5C1A\u672A\u5C31\u7EEA\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"));
      let resolve, reject;
      const promise = new Promise((yes, no) => {
        resolve = yes;
        reject = no;
      });
      pending = { promise, resolve, reject };
      publish({ open: true, busy: false });
      return promise;
    },
    onPicked: async (path) => {
      if (!pending || snapshot.busy || disposed) return;
      if (typeof path !== "string" || !path) {
        finish(new Error("\u672A\u80FD\u83B7\u53D6\u6240\u9009\u5DE5\u4F5C\u533A\u76EE\u5F55"));
        return;
      }
      publish({ busy: true });
      try {
        const workspace = await createWorkspace({ path });
        finish(null, workspace);
      } catch (error) {
        finish(error instanceof Error ? error : new Error(String(error)));
      }
    },
    onCancel: () => {
      if (!snapshot.busy) finish(null, null);
    },
    onError: (message) => finish(new Error(String(message))),
    dispose: () => {
      disposed = true;
      finish(null, null);
      listeners.clear();
    }
  };
}

// src/appearance.js
function createAppearanceSource(ctx, { doc = typeof document === "undefined" ? void 0 : document, quietMs = 220, minimumMs = 420, maximumMs = 1800 } = {}) {
  const listeners = /* @__PURE__ */ new Set();
  let changing = false;
  let snapshot = ctx.theme.getTheme();
  let task;
  let disposed = false;
  let transition;
  let cancelSettle;
  const publish = () => {
    snapshot = { ...ctx.theme.getTheme(), changing };
    for (const fn of listeners) fn();
  };
  const off = ctx.on("theme/change", publish);
  const settle = () => new Promise((resolve) => {
    const started = Date.now();
    let timer;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      clearTimeout(limit);
      unlisten();
      cancelSettle = void 0;
      resolve();
    };
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(finish, Math.max(quietMs, minimumMs - (Date.now() - started)));
    };
    const unlisten = ctx.on("theme/change", reset);
    const limit = setTimeout(finish, maximumMs);
    cancelSettle = finish;
    reset();
  });
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    select: (mode) => {
      if (!["light", "dark", "system"].includes(mode)) throw new Error("\u672A\u77E5\u5916\u89C2\u6A21\u5F0F");
      if (disposed) return Promise.reject(new Error("\u4E3B\u9898\u8BBE\u7F6E\u5DF2\u5173\u95ED"));
      if (task) return task;
      if (ctx.theme.getTheme().preference === mode) return Promise.resolve();
      changing = true;
      publish();
      const update = async () => {
        const form = ctx.configForms?.get("ui-theme");
        if (form) {
          if (!await form.set("preference", mode)) throw new Error("\u5916\u89C2\u8BBE\u7F6E\u672A\u4FDD\u5B58\uFF0C\u8BF7\u91CD\u8BD5");
        } else ctx.theme.setTheme(mode);
        await settle();
      };
      task = (async () => {
        try {
          if (doc?.startViewTransition && doc.body?.dataset.liquidGlass === "on") {
            doc.documentElement.dataset.lgThemeTransition = "on";
            transition = doc.startViewTransition(update);
            transition.ready?.catch(() => {
            });
            await transition.updateCallbackDone;
            await transition.finished.catch(() => {
            });
          } else await update();
        } finally {
          cancelSettle?.();
          transition = void 0;
          delete doc?.documentElement?.dataset.lgThemeTransition;
          changing = false;
          task = void 0;
          if (!disposed) publish();
        }
      })();
      return task;
    },
    dispose: () => {
      disposed = true;
      cancelSettle?.();
      transition?.skipTransition();
      off();
      listeners.clear();
      delete doc?.documentElement?.dataset.lgThemeTransition;
    }
  };
}

// src/client.jsx
var inject = ["theme", "slots", "uiWorkspace", "workspaces", "sessions", "configForms"];
var PALETTE = {
  "--dsw-alias-bg-base": { light: "#fafbfc", dark: "#171a20" },
  "--dsw-alias-bg-layer-1": { light: "#fafbfc", dark: "#171a20" },
  "--dsw-alias-bg-layer-2": { light: "#ffffff", dark: "#20242c" },
  "--dsw-specific-sidebar-fill": { light: "rgba(241,244,249,.72)", dark: "rgba(33,37,47,.76)" },
  "--dsw-alias-label-primary": { light: "#20232b", dark: "#e9edf4" },
  "--dsw-alias-label-secondary": { light: "#777f8e", dark: "#979dab" },
  "--dsw-alias-interactive-bg-hover": { light: "rgba(0,0,0,.035)", dark: "rgba(255,255,255,.06)" },
  "--dsw-alias-state-business-primary": { light: "#007aff", dark: "#66aaff" }
};
function createTreeComponent(ctx, controller, workspacePicker) {
  const sessionActions = createSessionActions(ctx);
  const creationActions = createCreationActions(ctx, controller, workspacePicker);
  const workspaceSource = ctx.workspaces.list;
  const sessionSource = ctx.sessions.list;
  const subscribeWorkspaces = (fn) => workspaceSource.subscribe(fn);
  const getWorkspaces = () => workspaceSource.getSnapshot();
  const subscribeSessions = (fn) => sessionSource.subscribe(fn);
  const getSessions = () => sessionSource.getSnapshot();
  return function DshFolderTree({ wide = true, expandSidebar, renderSlot }) {
    const picker = useSource(workspacePicker);
    (0, import_react6.useEffect)(() => () => workspacePicker.onCancel(), []);
    const workspaces = (0, import_react6.useSyncExternalStore)(subscribeWorkspaces, getWorkspaces, getWorkspaces);
    const sessions = (0, import_react6.useSyncExternalStore)(subscribeSessions, getSessions, getSessions);
    const catalog = createCatalog(workspaces, sessions);
    const current = Object.values(sessions.byId).find((s) => (s.retainedBy?.mainView ?? 0) > 0)?.id;
    return /* @__PURE__ */ import_react6.default.createElement(import_react6.default.Fragment, null, /* @__PURE__ */ import_react6.default.createElement(
      FolderTree,
      {
        wide,
        expandSidebar,
        controller,
        catalog,
        activeId: current,
        ...sessionActions,
        ...creationActions,
        openSession: (id) => ctx.uiWorkspace.openSession(id),
        renameWorkspace: (id, title) => ctx.workspaces.rename(id, title),
        removeWorkspace: (id) => ctx.workspaces.delete(id),
        archiveSession: (id) => ctx.uiWorkspace.archiveSession(id),
        unarchiveSession: (id) => ctx.uiWorkspace.unarchiveSession(id),
        onNativeView: () => controller.mutate({ type: "preferences", patch: { tree: false } }).catch(() => {
        })
      }
    ), renderSlot(DIRECTORY_FLOW, { ...picker, onPicked: workspacePicker.onPicked, onCancel: workspacePicker.onCancel, onError: workspacePicker.onError }));
  };
}
function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.plugin = "dsh-liquid-glass";
    style.textContent = theme_default;
    document.head.append(style);
    const controller = createController();
    const workspacePicker = createWorkspacePicker({ createWorkspace: (input) => ctx.workspaces.create(input), available: () => ctx.slots.entries(DIRECTORY_FLOW).length > 0 });
    const releaseDirectoryFlow = installDirectoryFlow(ctx);
    const Tree = createTreeComponent(ctx, controller, workspacePicker);
    const skin = installSkinChoice({ controller });
    const appearance = createAppearanceSource(ctx);
    let releaseTree;
    let releaseTokens;
    let releaseShell;
    let releaseBrands = [];
    let themeEnabled;
    let treeEnabled;
    const sync = () => {
      const runtime = controller.getSnapshot();
      if (!runtime.ready) return;
      const prefs = runtime.state.preferences;
      syncPresentation(prefs);
      if (prefs.theme !== themeEnabled) {
        themeEnabled = prefs.theme;
        if (prefs.theme) {
          document.body.dataset.liquidGlass = "on";
          releaseTokens = ctx.theme.overrideTokens("dsh-liquid-glass", PALETTE);
          releaseShell = installShellSkin();
          releaseBrands = [
            ctx.slots.inject("sidebar.brand.name", () => ctx.slots.register({ name: "sidebar.brand.name", priority: -20 }, () => /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-wordmark" }, "DSH ", /* @__PURE__ */ import_react6.default.createElement("small", null, "Liquid Glass")))),
            ctx.slots.inject("conversation.hero.brand.mark", () => ctx.slots.register({ name: "conversation.hero.brand.mark", priority: -20 }, () => /* @__PURE__ */ import_react6.default.createElement(LiquidOrb, null)))
          ];
        } else {
          delete document.body.dataset.liquidGlass;
          releaseTokens?.();
          releaseTokens = void 0;
          releaseShell?.();
          releaseShell = void 0;
          releaseBrands.forEach((release) => release());
          releaseBrands = [];
        }
      }
      if (prefs.tree !== treeEnabled) {
        if (prefs.tree) {
          releaseTree = ctx.slots.inject("sidebar.workspaces", () => ctx.slots.register({ name: "sidebar.workspaces", priority: -20, children: { [DIRECTORY_FLOW]: { kind: "single", scope: "root" } } }, Tree));
          treeEnabled = true;
        } else {
          releaseTree?.();
          releaseTree = void 0;
          treeEnabled = false;
        }
      }
    };
    const unsubscribe = controller.subscribe(sync);
    const releaseSettings = ctx.slots.inject("settings.section", () => ctx.slots.register({ name: "settings.section", id: "liquid-glass", label: () => "Liquid Glass", order: 12 }, () => /* @__PURE__ */ import_react6.default.createElement(Settings, { controller, skin, appearance })));
    const releaseFooter = ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({ name: "sidebar.footer.action", id: "liquid-glass-view", order: Number.MAX_SAFE_INTEGER }, (props) => /* @__PURE__ */ import_react6.default.createElement(FooterToggle, { ...props, controller })));
    controller.refresh().then(() => {
      if (!controller.getSnapshot().error) {
        sync();
        console.info("[dsh-liquid-glass] client 0.6.3 ready");
      }
    });
    return () => {
      unsubscribe();
      releaseTree?.();
      releaseTokens?.();
      releaseShell?.();
      releaseBrands.forEach((release) => release());
      skin.dispose();
      workspacePicker.dispose();
      releaseDirectoryFlow();
      appearance.dispose();
      releaseSettings();
      releaseFooter();
      controller.dispose();
      delete document.body.dataset.liquidGlass;
      clearPresentation();
      style.remove();
    };
  }, "liquid-glass: theme, folder tree and settings");
}
return module.exports;}});
//# sourceMappingURL=client.js.map
