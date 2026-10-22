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
var import_react8 = __toESM(require("react"), 1);

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
  } }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "book" }), "\u8FD4\u56DE\u9ED8\u8BA4"), menu.kind === "session" && archiveSession && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("hr", null), /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", onClick: () => archive(menu) }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "archive" }), "\u5F52\u6863\u4F1A\u8BDD")), (menu.kind === "folder" || menu.kind === "workspace" && removeWorkspace) && /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("hr", null), /* @__PURE__ */ import_react3.default.createElement("button", { role: "menuitem", className: "lg-danger", onClick: () => requestRemoval(menu) }, /* @__PURE__ */ import_react3.default.createElement(Icon, { name: "trash" }), menu.kind === "folder" ? "\u5220\u9664\u76EE\u5F55" : "\u79FB\u9664\u5DE5\u4F5C\u533A"))), deletion && /* @__PURE__ */ import_react3.default.createElement(Modal, { title: `${deletion.kind === "workspace" ? "\u79FB\u9664\u5DE5\u4F5C\u533A" : "\u5220\u9664\u76EE\u5F55"}\u201C${deletion.title}\u201D\uFF1F`, close: () => {
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
  } }, label)))), select("glass", "\u73BB\u7483\u6750\u8D28", "\u4FA7\u680F\u548C\u83DC\u5355\u7684\u900F\u5149\u7A0B\u5EA6\u3002", [["frosted", "\u901A\u900F\u78E8\u7802"], ["solid", "\u5B9E\u8272\u6E05\u6670"]]), toggle("tree", "\u5DE5\u4F5C\u533A\u5B50\u76EE\u5F55", "\u5173\u95ED\u540E\u4F7F\u7528\u539F\u751F\u5DE5\u4F5C\u533A\u89C6\u56FE\uFF0C\u5DF2\u5B58\u5206\u7C7B\u4FDD\u7559\u3002"), select("density", "\u76EE\u5F55\u5BC6\u5EA6", "\u7D27\u51D1\u6A21\u5F0F\u53EF\u5C55\u793A\u66F4\u591A\u4F1A\u8BDD\u3002", [["comfortable", "\u8212\u9002"], ["compact", "\u7D27\u51D1"]]), toggle("showTags", "\u5C55\u793A\u884C\u5185\u6807\u7B7E", "\u53EA\u8C03\u6574\u5C55\u793A\uFF0C\u6807\u7B7E\u548C\u7B5B\u9009\u6761\u4EF6\u4ECD\u4FDD\u7559\u3002"), toggle("showCounts", "\u5C55\u793A\u76EE\u5F55\u4F1A\u8BDD\u6570", "\u63A7\u5236\u76EE\u5F55\u884C\u53F3\u4FA7\u7684\u6570\u91CF\u3002")), /* @__PURE__ */ import_react4.default.createElement("fieldset", null, /* @__PURE__ */ import_react4.default.createElement("legend", null, "\u52A8\u6001\u6548\u679C"), select("motion", "\u52A8\u6548\u5F3A\u5EA6", "\u7CFB\u7EDF\u542F\u7528\u201C\u51CF\u5C11\u52A8\u6001\u6548\u679C\u201D\u65F6\uFF0C\u4F18\u5148\u4F7F\u7528\u9759\u6001\u6548\u679C\u3002", [["full", "\u6D41\u52A8"], ["soft", "\u8F7B\u67D4"], ["off", "\u5173\u95ED"]]), toggle("orb", "\u4E3B\u9875\u5149\u7403", "\u5173\u95ED\u540E\u4E3B\u9875\u4FDD\u7559\u6807\u9898\u4E0E\u8F93\u5165\u6846\u3002"), toggle("statusGlow", "\u601D\u8003\u4E0E\u5DE5\u5177\u72B6\u6001\u52A8\u6548", "\u63A7\u5236\u7B49\u5F85\u680F\u7684\u6E10\u53D8\u6587\u5B57\u3001\u6587\u5B57\u5207\u6362\u4E0E\u8F6E\u6362\u5706\u70B9\u52A8\u753B\u3002"), toggle("hoverLine", "\u4F1A\u8BDD\u60AC\u505C\u5149\u7EBF", "\u5149\u7EBF\u4ECE\u4F1A\u8BDD\u4E0B\u65B9\u4E2D\u95F4\u5411\u4E24\u4FA7\u5C55\u5F00\u3002")), /* @__PURE__ */ import_react4.default.createElement("footer", null, /* @__PURE__ */ import_react4.default.createElement("button", { className: "lg-secondary", disabled: busy, onClick: () => set({ ...PRESENTATION_DEFAULTS }) }, "\u6062\u590D\u5916\u89C2\u9ED8\u8BA4"), /* @__PURE__ */ import_react4.default.createElement("span", { role: "status" }, runtime.saving ? "\u6B63\u5728\u4FDD\u5B58\u2026" : "\u5206\u7C7B\u3001\u6807\u8BB0\u4E0E\u4E3B\u9898\u542F\u7528\u72B6\u6001\u4E0D\u4F1A\u88AB\u91CD\u7F6E\u3002")), runtime.error && /* @__PURE__ */ import_react4.default.createElement("p", { role: "alert", className: "lg-error" }, runtime.error), appearanceError && /* @__PURE__ */ import_react4.default.createElement("p", { role: "alert", className: "lg-error" }, appearanceError));
}
function FooterToggle({ controller, wide = true }) {
  const { state, saving, loading } = useSource(controller);
  const label = state.preferences.tree ? "\u8FD4\u56DE\u9ED8\u8BA4" : "\u8FD4\u56DE\u76EE\u5F55\u6811";
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
.lg-tree-row[data-kind="session"]:hover>.lg-hover-underline,.lg-tree-row[data-kind="session"]:focus-visible>.lg-hover-underline { transform:scaleX(1); opacity:.9; }
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
body[data-liquid-glass="on"] .lg-ces-set { background:var(--lg-canvas); color:var(--lg-ink); border-color:var(--lg-line); border-radius:14px; backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); }
body[data-liquid-glass="on"] .lg-ces-track { background:var(--lg-line); }
body[data-liquid-glass="on"] :is([role="menu"],[role="group"])[id$="-menu"],body[data-liquid-glass="on"] .lg-ces-set { animation:lg-model-menu-in 180ms ease-out; }
body[data-liquid-glass="on"] :is([role="menu"],[role="group"])[id$="-menu"]>:is(button,[role="group"],[class*="_groups"],[class*="_searchRow"]) { animation:lg-model-pane-in 180ms ease-out; }
body[data-liquid-glass="on"] .lg-ces-inline[data-lg-ces-part="host"] { min-height:30px; }
body[data-liquid-glass="on"] .lg-ces-inline[data-lg-ces-part="root"] { animation:lg-slider-reveal 200ms cubic-bezier(.2,.75,.25,1); }
@keyframes lg-model-menu-in { from { opacity:0; } to { opacity:1; } }
@keyframes lg-model-pane-in { from { opacity:.45; } to { opacity:1; } }
@keyframes lg-slider-reveal { from { opacity:0; clip-path:inset(0 0 100% 0); } to { opacity:1; clip-path:inset(-16px -16px -16px -16px); } }
body[data-liquid-glass="on"][data-lg-motion="off"] :is([id$="-menu"],[id$="-menu"]>*,.lg-ces-inline,.lg-ces-set) { animation:none!important; }
@media(prefers-reduced-motion:reduce) { body[data-liquid-glass="on"] :is([id$="-menu"],[id$="-menu"]>*,.lg-ces-inline,.lg-ces-set) { animation:none!important; } }
`;

// src/status-motion.css
var status_motion_default = `body[data-liquid-glass="on"] {
  --lg-status-wash-layers:
    url("data:image/svg+xml;utf8,<svg viewBox='0 0 67 42' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.88'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.34726 -1.3118e-7 8.6482e-7 0.89585 33.5 21)'><stop stop-color='rgba(0,110,245,1)' offset='0'/><stop stop-color='rgba(0,110,245,0)' offset='1'/></radialGradient></defs></svg>"),
    url("data:image/svg+xml;utf8,<svg viewBox='0 0 67 42' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.5'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-1.3 0.25 -1.2633 -2.7471 33.5 21)'><stop stop-color='rgba(0,110,245,1)' offset='0'/><stop stop-color='rgba(0,110,245,0)' offset='1'/></radialGradient></defs></svg>"),
    url("data:image/svg+xml;utf8,<svg viewBox='0 0 67 42' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.4'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.05 -0.8 0.46018 3.6184 33.5 21)'><stop stop-color='rgba(204,0,167,1)' offset='0'/><stop stop-color='rgba(170,0,204,0)' offset='0.71709'/></radialGradient></defs></svg>"),
    url("data:image/svg+xml;utf8,<svg viewBox='0 0 67 42' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-0.51067 -3.3275e-16 -4.3352e-14 -1.1396 33.5 21)'><stop stop-color='rgba(204,0,167,1)' offset='0'/><stop stop-color='rgba(170,0,204,0)' offset='1'/></radialGradient></defs></svg>"),
    url("data:image/svg+xml;utf8,<svg viewBox='0 0 67 42' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-0.45 -0.75 1.9052 -0.7091 33.5 21)'><stop stop-color='rgba(255,173,85,1)' offset='0'/><stop stop-color='rgba(255,173,85,0)' offset='1'/></radialGradient></defs></svg>"),
    url("data:image/svg+xml;utf8,<svg viewBox='0 0 67 42' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.25 -0.35 -0.4013 3.5959 33.5 21)'><stop stop-color='rgba(0,204,68,1)' offset='0'/><stop stop-color='rgba(0,196,102,0.75)' offset='0.25'/><stop stop-color='rgba(0,187,136,0.5)' offset='0.5'/><stop stop-color='rgba(0,170,204,0)' offset='1'/></radialGradient></defs></svg>"),
    url("data:image/svg+xml;utf8,<svg viewBox='0 0 67 42' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-0.87391 0.73043 -4.1482 -1.9503 33.5 21)'><stop stop-color='rgba(0,170,204,1)' offset='0'/><stop stop-color='rgba(0,170,204,0)' offset='1'/></radialGradient></defs></svg>"),
    linear-gradient(rgb(108, 108, 108) 0%, rgb(216, 216, 216) 100%);
  --lg-status-wash-sizes:
    180% 180%, 180% 180%, 180% 180%, 180% 180%, 180% 180%, 180% 180%, 180% 180%, 100% 100%;
}
@keyframes lg-status-wash-hue {
  from { filter: hue-rotate(0deg) saturate(1.3); }
  to { filter: hue-rotate(-360deg) saturate(1.3); }
}

@keyframes lg-status-wash-drift {
  0%, 100% { background-position: 100% 0%, 0% 50%, 100% 50%, 0% 100%, 0% 0%, 50% 0%, 50% 100%, 0 0; }
  25% { background-position: 100% 100%, 50% 0%, 50% 100%, 0% 0%, 100% 0%, 100% 50%, 0% 50%, 0 0; }
  50% { background-position: 0% 100%, 100% 50%, 0% 50%, 100% 0%, 100% 100%, 50% 100%, 50% 0%, 0 0; }
  75% { background-position: 0% 0%, 50% 100%, 50% 0%, 100% 100%, 0% 100%, 0% 50%, 100% 50%, 0 0; }
}

body[data-liquid-glass="on"] [data-conversation-region="chat"] :is([data-shimmer="true"],[data-text-shimmer="true"]) > :is([class$="_content"],[class*="_content "]) {
  color:transparent!important;
  -webkit-text-fill-color:transparent;
  background-image:var(--lg-status-wash-layers);
  background-repeat:no-repeat;
  background-size:var(--lg-status-wash-sizes);
  -webkit-background-clip:text;
  background-clip:text;
  animation:lg-status-wash-hue 4000ms linear infinite,lg-status-wash-drift 5000ms ease-in-out infinite;
}
body[data-liquid-glass="on"] [data-conversation-region="chat"] :is([data-shimmer="true"],[data-text-shimmer="true"]) > :is([class$="_content"],[class*="_content "]) * { color:transparent!important; -webkit-text-fill-color:transparent; }
body[data-liquid-glass="on"][data-lg-motion="soft"] [data-conversation-region="chat"] :is([data-shimmer="true"],[data-text-shimmer="true"]) > :is([class$="_content"],[class*="_content "]) { animation-duration:6000ms,7500ms; }
body[data-liquid-glass="on"]:is([data-lg-status-glow="false"],[data-lg-motion="off"]) [data-conversation-region="chat"] :is([data-shimmer="true"],[data-text-shimmer="true"]) > :is([class$="_content"],[class*="_content "]) { animation:none!important; filter:none; background:none; color:var(--lg-muted)!important; -webkit-text-fill-color:currentColor; }
body[data-liquid-glass="on"]:is([data-lg-status-glow="false"],[data-lg-motion="off"]) [data-conversation-region="chat"] :is([data-shimmer="true"],[data-text-shimmer="true"]) > :is([class$="_content"],[class*="_content "]) * { color:inherit!important; -webkit-text-fill-color:currentColor; }
@media(prefers-reduced-motion:reduce) {
body[data-liquid-glass="on"] [data-conversation-region="chat"] :is([data-shimmer="true"],[data-text-shimmer="true"]) > :is([class$="_content"],[class*="_content "]) { animation:none!important; filter:none; }
}
`;

// src/wait-vendor.css
var wait_vendor_default = `body[data-liquid-glass="on"] {
  --lg-wait-duration-swap:150ms;
  --lg-wait-duration-swap-gap:50ms;
  --lg-wait-duration-slide:240ms;
  --lg-wait-period-dot-orbit:2400ms;
  --lg-wait-period-dot-rotate:10s;
  --lg-wait-period-dot-bounce:500ms;
  --lg-wait-period-dot-line:1250ms;
  --lg-wait-ease-standard:ease;
  --lg-wait-ease-in-out:ease-in-out;
  --lg-wait-ease-glide:cubic-bezier(0.22, 0.61, 0.36, 1);
  --lg-wait-ease-harmonic:cubic-bezier(0.37, 0, 0.63, 1);
  --lg-wait-ease-damped-out:cubic-bezier(0.33, 1, 0.68, 1);
  --lg-wait-ease-damped-in:cubic-bezier(0.32, 0, 0.67, 0);
  --lg-wait-distance-travel:8px;
  --lg-wait-blur-soft:2px;
  --lg-wait-scale-dot-mid:0.55;
  --lg-wait-swap-distance:var(--lg-wait-distance-travel);
  --lg-wait-swap-blur:var(--lg-wait-blur-soft);
  --lg-wait-swap-duration:var(--lg-wait-duration-swap);
  --lg-wait-swap-gap:var(--lg-wait-duration-swap-gap);
  --lg-wait-swap-ease:var(--lg-wait-ease-in-out);
}
body[data-liquid-glass="on"] .lg-wait-chat-wait-loader {
  display: none;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-loader {
  display: inline-flex;
  position: relative;
  flex: none;
  width: 18px;
  height: 14px;
  margin-right: 6px;
}

/* The loader carries every motion at once, one lane each, so a change between
   them is a hand-over rather than a redraw: the lane the turn is leaving fades
   its dots out where its own motion has them, and once the last of them has gone
   the lane it is going to fades its dots in where that motion carries them, so
   the box never draws two motions at once (features/chat-wait/wait-loader.ts).
   A lane out of play is taken out of the page, which is what lets the lane
   coming back start its motion from the top. */
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane {
  position: absolute;
  inset: 0;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-resting {
  display: none;
}

/* One dot of a lane. Every dot is built at its lane's own left edge and takes
   its place from the values it carries, so a lane and a line travel with the dot
   and neither is written twice. The colour is the accent in force, so the loader
   follows the palette the reader picked, and a dot is drawn only while its lane
   is in play \u2014 the hand-over brings each one in and takes it out on its own
   moment. */
body[data-liquid-glass="on"] .lg-wait-chat-wait-dot {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--lg-accent);
  transform-origin: 50% 100%;
  opacity: 0;
  /* How far this dot travels to stand on the loader's own centre line, the unit
     direction of the line it walks, and where that line's far end falls \u2014 the
     last of the three is worked out here so the keyframes read it instead of
     writing the geometry out twice. */
  --lg-wait-dot-centre: 0px;
  --lg-wait-dot-line-x: 0;
  --lg-wait-dot-line-y: -1;
  --lg-wait-dot-end-x: calc(var(--lg-wait-dot-centre) + var(--lg-wait-dot-line-x) * var(--lg-wait-distance-travel));
  --lg-wait-dot-end-y: calc((var(--lg-wait-dot-line-y) - 1) * var(--lg-wait-distance-travel));
}

/* The lane in play draws its dots, and the one on its way out keeps drawing them
   until its own fades have taken them; the hand-over's fades sit above these
   declarations and carry each dot between the two. */
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-active .lg-wait-chat-wait-dot,
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-leaving .lg-wait-chat-wait-dot {
  opacity: 1;
}

/* The three lanes the bounce runs in, seven pixels apart; the walk keeps the same
   three places and walks the lines that meet in the middle of them: one straight
   up, one down and to the left, one down and to the right, 120\xB0 apart \u2014 with the
   second of the three walked the other way, so its far end is the one up and to
   the left. */
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-bounce .lg-wait-chat-wait-dot:nth-child(2),
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-line .lg-wait-chat-wait-dot:nth-child(2) {
  left: 7px;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-bounce .lg-wait-chat-wait-dot:nth-child(3),
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-line .lg-wait-chat-wait-dot:nth-child(3) {
  left: 14px;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-line .lg-wait-chat-wait-dot:nth-child(1) {
  --lg-wait-dot-centre: 7px;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-line .lg-wait-chat-wait-dot:nth-child(2) {
  --lg-wait-dot-line-x: -0.866;
  --lg-wait-dot-line-y: -0.5;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-line .lg-wait-chat-wait-dot:nth-child(3) {
  --lg-wait-dot-centre: -7px;
  --lg-wait-dot-line-x: -0.866;
  --lg-wait-dot-line-y: 0.5;
}

/* The third lane: four dots swapping corners. Their centres sit 9.5 \xD7 11.6 apart
   (45 : 55, the dot 0.42 of that spacing, as the reference has it) and each one
   stands on its own corner. A turn of this lane is four runs of one shape: 400ms
   of one pair swapping \u2014 the A run (1 and 4 each walk a quarter of an ellipse
   around the neighbour beside them), then the B run (2 and 3 the same), then the
   A run back and the B run back \u2014 and 200ms of rest after each run, half as long
   as the run itself. The four runs leave every dot where it started, so one turn
   joins the next without a seam. The half-axes of an arc are the neighbour
   spacing itself, which keeps both arcs inside the four dots. Each arc is walked
   on cubic-bezier(0.16, 0.75, 0.29, 0.97): the stops below are that arc read at
   eight even steps of its own angle, placed at the times the curve gives those
   steps, so the straight steps between them run as that curve. Nothing here
   fades: taking a lane in and out of play is the hand-over's own work
   (features/chat-wait/wait-loader.ts). */
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-orbit .lg-wait-chat-wait-dot {
  top: 50%;
  bottom: auto;
  left: 50%;
  margin: -2px 0 0 -2px;
  animation: lg-wait-wait-dot-orbit-1 var(--lg-wait-period-dot-orbit) linear infinite;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-orbit .lg-wait-chat-wait-dot:nth-child(2) {
  animation-name: lg-wait-wait-dot-orbit-2;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-orbit .lg-wait-chat-wait-dot:nth-child(3) {
  animation-name: lg-wait-wait-dot-orbit-4;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-orbit .lg-wait-chat-wait-dot:nth-child(4) {
  animation-name: lg-wait-wait-dot-orbit-3;
}

@keyframes lg-wait-wait-dot-orbit-1 {
  0% { translate: -4.75px -5.8px; }
  0.46% { translate: -4.57px -3.54px; }
  0.97% { translate: -4.03px -1.36px; }
  1.55% { translate: -3.15px 0.64px; }
  2.26% { translate: -1.97px 2.4px; }
  3.21% { translate: -0.53px 3.85px; }
  4.6% { translate: 1.11px 4.92px; }
  7.09% { translate: 2.9px 5.58px; }
  16.67%, 25%, 50% { translate: 4.75px 5.8px; }
  50.46% { translate: 4.57px 3.54px; }
  50.97% { translate: 4.03px 1.36px; }
  51.55% { translate: 3.15px -0.64px; }
  52.26% { translate: 1.97px -2.4px; }
  53.21% { translate: 0.53px -3.85px; }
  54.6% { translate: -1.11px -4.92px; }
  57.09% { translate: -2.9px -5.58px; }
  66.67%, 75%, 100% { translate: -4.75px -5.8px; }
}

@keyframes lg-wait-wait-dot-orbit-2 {
  0%, 25% { translate: 4.75px -5.8px; }
  25.46% { translate: 4.57px -3.54px; }
  25.97% { translate: 4.03px -1.36px; }
  26.55% { translate: 3.15px 0.64px; }
  27.26% { translate: 1.97px 2.4px; }
  28.21% { translate: 0.53px 3.85px; }
  29.6% { translate: -1.11px 4.92px; }
  32.09% { translate: -2.9px 5.58px; }
  41.67%, 50%, 75% { translate: -4.75px 5.8px; }
  75.46% { translate: -4.57px 3.54px; }
  75.97% { translate: -4.03px 1.36px; }
  76.55% { translate: -3.15px -0.64px; }
  77.26% { translate: -1.97px -2.4px; }
  78.21% { translate: -0.53px -3.85px; }
  79.6% { translate: 1.11px -4.92px; }
  82.09% { translate: 2.9px -5.58px; }
  91.67%, 100% { translate: 4.75px -5.8px; }
}

@keyframes lg-wait-wait-dot-orbit-4 {
  0% { translate: 4.75px 5.8px; }
  0.46% { translate: 4.57px 3.54px; }
  0.97% { translate: 4.03px 1.36px; }
  1.55% { translate: 3.15px -0.64px; }
  2.26% { translate: 1.97px -2.4px; }
  3.21% { translate: 0.53px -3.85px; }
  4.6% { translate: -1.11px -4.92px; }
  7.09% { translate: -2.9px -5.58px; }
  16.67%, 25%, 50% { translate: -4.75px -5.8px; }
  50.46% { translate: -4.57px -3.54px; }
  50.97% { translate: -4.03px -1.36px; }
  51.55% { translate: -3.15px 0.64px; }
  52.26% { translate: -1.97px 2.4px; }
  53.21% { translate: -0.53px 3.85px; }
  54.6% { translate: 1.11px 4.92px; }
  57.09% { translate: 2.9px 5.58px; }
  66.67%, 75%, 100% { translate: 4.75px 5.8px; }
}

@keyframes lg-wait-wait-dot-orbit-3 {
  0%, 25% { translate: -4.75px 5.8px; }
  25.46% { translate: -4.57px 3.54px; }
  25.97% { translate: -4.03px 1.36px; }
  26.55% { translate: -3.15px -0.64px; }
  27.26% { translate: -1.97px -2.4px; }
  28.21% { translate: -0.53px -3.85px; }
  29.6% { translate: 1.11px -4.92px; }
  32.09% { translate: 2.9px -5.58px; }
  41.67%, 50%, 75% { translate: 4.75px -5.8px; }
  75.46% { translate: 4.57px -3.54px; }
  75.97% { translate: 4.03px -1.36px; }
  76.55% { translate: 3.15px 0.64px; }
  77.26% { translate: 1.97px 2.4px; }
  78.21% { translate: 0.53px 3.85px; }
  79.6% { translate: -1.11px 4.92px; }
  82.09% { translate: -2.9px 5.58px; }
  91.67%, 100% { translate: -4.75px 5.8px; }
}

/* The bouncing lane, ported from the snippet (docs/THIRD_PARTY_NOTICES.md): the dot
   rests on the loader's floor and the animation lifts it the skin's 8px,
   squashing it against the floor as it leaves; the three start behind each other
   by two and three fifths of the period, which is the wave the snippet makes.
   Every delay is negative and at least one period, so the wave never begins at
   the frame the snippet starts from: the first dot is already on its way down
   from the top and the other two are climbing, which is also where the hand-over
   finds them. */
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-bounce .lg-wait-chat-wait-dot {
  animation: lg-wait-wait-dot var(--lg-wait-period-dot-bounce) var(--lg-wait-ease-standard) infinite alternate;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-bounce .lg-wait-chat-wait-dot:nth-child(1) {
  animation-delay: calc(-1 * var(--lg-wait-period-dot-bounce));
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-bounce .lg-wait-chat-wait-dot:nth-child(2) {
  animation-delay: calc(-3 * var(--lg-wait-period-dot-bounce) / 5);
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-bounce .lg-wait-chat-wait-dot:nth-child(3) {
  animation-delay: calc(-2 * var(--lg-wait-period-dot-bounce) / 5);
}

/* The walking lane: each dot walks its own line through one point, a simple
   harmonic \u2014 at rest at either end and fastest through the middle \u2014 and it is
   the dot's own size at either end, smallest as it crosses the middle, so the
   walking dot never draws larger than the bouncing one. The walk's keyframes
   stand at the two ends only and its size's at the ends and the middle, so every
   stretch between two of them runs end to end on the animation's own curve,
   --lg-wait-ease-harmonic; a curve written into a keyframe would be dropped
   for linear. The three dots stand a third of the period apart, the first a
   quarter in, crossing the middle, and every delay is negative: each is already
   at its own place on its line instead of waiting at an end for its turn. A
   third apart is what keeps the two lines that are mirrors of each other from
   drawing the same motion twice \u2014 a half period would, and so would no offset
   at all. */
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-line .lg-wait-chat-wait-dot {
  animation: lg-wait-wait-dot-line var(--lg-wait-period-dot-line) var(--lg-wait-ease-harmonic) infinite;
  animation-delay: calc(-1 * var(--lg-wait-period-dot-line) / 4);
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-line .lg-wait-chat-wait-dot:nth-child(2) {
  animation-delay: calc(-7 * var(--lg-wait-period-dot-line) / 12);
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-line .lg-wait-chat-wait-dot:nth-child(3) {
  animation-delay: calc(-11 * var(--lg-wait-period-dot-line) / 12);
}

/* What a hand-over needs to know about a lane's own motion, read by
   features/chat-wait/wait-loader.ts: the shares of its keyframes at which a dot
   of it arrives and leaves, and how long one of its fades takes as a share of
   the motion's own turn. The bounce's dot arrives at the top of its hop and
   leaves off the floor the instant it rebounds; the walk's arrives at the middle
   of its line, and leaves at the end it turns at \u2014 a share each, since it
   crosses the middle and turns at an end twice a turn. Which curve each fade
   runs on is the browser half's, read from the token sheet (D9). */
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-bounce {
  --lg-wait-dot-arrives: 1;
  --lg-wait-dot-leaves: 0 1;
  --lg-wait-dot-fade: 0.5;
}

body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-line {
  --lg-wait-dot-arrives: 0.25 0.75;
  --lg-wait-dot-leaves: 0 0.5;
  --lg-wait-dot-fade: 0.25;
}

/* The swapping lane declares where it arrives \u2014 the top of its own turn, which is
   the pose every dot of it already stands on \u2014 so a lane coming into play fades
   its dots in where they are, over an eighth of its turn, and one going out fades
   them where they stand: nothing inside the turn itself fades, the dots only swap
   corners. */
body[data-liquid-glass="on"] .lg-wait-chat-wait-lane.is-orbit {
  --lg-wait-dot-arrives: 0;
  --lg-wait-dot-fade: 0.125;
}

/* The reader's animation choice (D40): the dots hold the frame their motion
   stands on rather than running. The theme presses every skin animation to a
   hundredth of a millisecond but leaves its iteration count alone, so a motion
   that still cycles would strobe instead of settling \u2014 pausing it holds each
   dot at its own phase: the bouncing wave frozen at three heights, the walk at
   its three places. wait-loader.ts lays a change down at once under that
   choice, so no fade of its own is ever on the dots. */
body[data-liquid-glass="on"]:is([data-lg-motion="off"],[data-lg-status-glow="false"]) .lg-wait-chat-wait-lane .lg-wait-chat-wait-dot {
  animation-play-state: paused;
}

/* The dot flattens against the floor as it leaves and rounds out on the way up.
   The stops at two and three fifths are added for the hand-over: they are the
   places the wave's second and third dots stand when the bounce takes over, and
   the arriving table above writes the same two values. The rise runs straight
   between them and eases into the top on the animation's own curve, the way a
   ball leaves the floor quickly and slows at the height of its hop. The
   snippet's own radius stops are left out: on a 4px box every one of them
   clamps to the same curve the dot already carries, so a radius among the
   keyframes would be no part of the motion and would keep the whole animation
   off the compositor, repainting the dot every frame. */
@keyframes lg-wait-wait-dot {
  0% {
    translate: 0 0;
    scale: 1.7 0.25;
    animation-timing-function: linear;
  }

  40% {
    translate: 0 calc(-2 * var(--lg-wait-distance-travel) / 5);
    scale: 1;
    animation-timing-function: linear;
  }

  60% {
    translate: 0 calc(-3 * var(--lg-wait-distance-travel) / 5);
  }

  100% {
    translate: 0 calc(-1 * var(--lg-wait-distance-travel));
  }
}

@keyframes lg-wait-wait-dot-line {
  0%, 100% {
    translate: calc(2 * var(--lg-wait-dot-centre) - var(--lg-wait-dot-end-x))
      calc(-2 * var(--lg-wait-distance-travel) - var(--lg-wait-dot-end-y));
    scale: 1;
  }

  25%, 75% {
    scale: var(--lg-wait-scale-dot-mid);
  }

  50% {
    translate: var(--lg-wait-dot-end-x) var(--lg-wait-dot-end-y);
    scale: 1;
  }
}

/* The words sweep under a highlight band: the host's own TextShimmer, a tinted
   copy of them inside a masked window laid over the words, so the words
   themselves keep their own colour (shared/sweep-band.ts). The band and its
   cadence are the host's \u2014 the period, the steps, the delay, the rest between
   passes (the last third of each), the shimmer tint and the mask \u2014 so the line,
   a running group's header and the host's own rows all sweep as one.

   The wording swaps in place when the turn moves on: the motion itself is
   shared/swapping-text.css, transitions.dev's "Text states swap" composed the
   way its "Thinking states" recipe does it.

   The helper writes the shimmer class on the copy showing the words
   (shared/swapping-text.ts): the label's own box stands taller than the text
   by the swap's travel, and a band read off that box would sweep above the
   glyphs. The reader's animation choice (D40) is the gate: core/prefs.ts
   resolves the setting and the system preference onto the body attribute, and
   the helper reads it at each swap, so the recipe's own media query is not
   repeated. */
/* The label's words can be a clause the model wrote, longer than any state
   word, so it is the label that gives way when the row is narrow: the clock and
   the badge keep their places and the words are cut with an ellipsis inside the
   box (shared/swapping-text.css). */
body[data-liquid-glass="on"] .lg-wait-chat-wait-label {
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
}

/* What the words wear: the band the host's own rows sweep, or the colour wash
   the reader can pick instead (Motion tab). Both paints live in
   shared/motion.css, beside the presets and the periods they read, and are
   written once for the line and for the settings page's preview cards; this
   sheet only says that the copy carrying the words is the box the line paints
   them onto. The reader's animation choice (D40) is the gate there as well. */

/* ---------- A line of words that swaps in place ---------- */
/* transitions.dev's "Text states swap" (MIT), composed the way its "Thinking
   states" recipe does it: the outgoing copy leaves upward through a blur while
   the incoming copy rises from below, both in the box at once, and the outgoing
   copy is taken down once the incoming one has settled (shared/swapping-text.ts).

   The box's width and height belong to the hidden sizer, which is the recipe's
   own arrangement: the copies are out of the flow, so a box holding only them
   would read as empty for the length of the swap and throw every neighbour to
   the left edge and back, and the entering copy rising from below would make
   the box taller while it is still off its mark. The sizer carries the widest
   of the words a swap puts in the box while it runs and comes down onto the
   words standing once it settles (shared/swapping-text.ts), so the clock beside
   the line sits right after them at rest. */

/* The words are the caller's: they can be a clause the model itself wrote,
   longer than any state word and longer than the box may take. The box clips
   what it cannot hold and the copies draw an ellipsis (below), so the wording
   gives way rather than running over what stands beside it. The padding and its
   own negative margin give the clip box room for the swap's travel \u2014 the copies
   move one distance each way \u2014 while the label's layout stays exactly as it
   was. */
/* The values the swap travels \u2014 its distance, blur, duration, its gap and its
   curve \u2014 are the shared ones from shared/motion.css (D9), as motion tokens;
   the box and the copies read them, and a caller that wants a shorter travel
   sets --lg-wait-swap-distance where it uses the label. */
body[data-liquid-glass="on"] .lg-wait-swap-label {
  position: relative;
  display: inline-block;
  overflow: hidden;
  padding: var(--lg-wait-swap-distance) 0;
  margin: calc(var(--lg-wait-swap-distance) * -1) 0;
  /* The box's width is where the clock beside the line stands, so the two
     instants a swap changes it travel instead of jumping: shared/swapping-text.ts
     pins the box at the width it stands at and writes the one it heads for, and
     this carries it there. Between two \`auto\` widths no transition can run,
     which is why the pin exists \u2014 the words standing take the box back the
     moment the move is over. */
  transition: width var(--lg-wait-duration-slide) var(--lg-wait-ease-glide);
}

/* The sizer paints nothing and is never read out; it is the box. Every wording
   a swap carries lies in its one grid cell, so it is as wide as the widest of
   them, and it keeps its own content's width while the box is pinned \u2014 the
   width shared/swapping-text.ts reads for the box to travel to. A label
   narrower than that clips it with the copies. */
body[data-liquid-glass="on"] .lg-wait-swap-sizer {
  display: grid;
  width: max-content;
  visibility: hidden;
  white-space: nowrap;
}

body[data-liquid-glass="on"] .lg-wait-swap-sizer-word {
  grid-area: 1 / 1;
}

/* Every copy lies over the sizer, so the box keeps its size whatever is
   moving inside it. It sits inside the label's padding, which is what the label
   added for the travel: its own box is the one the words are laid out in. */
body[data-liquid-glass="on"] .lg-wait-swap-copy {
  position: absolute;
  inset: var(--lg-wait-swap-distance) 0;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transform: translateY(0);
  filter: blur(0);
  opacity: 1;
  transition:
    transform var(--lg-wait-swap-duration) var(--lg-wait-swap-ease),
    filter var(--lg-wait-swap-duration) var(--lg-wait-swap-ease),
    opacity var(--lg-wait-swap-duration) var(--lg-wait-swap-ease);
  will-change: transform, filter, opacity;
}

body[data-liquid-glass="on"] .lg-wait-swap-copy.is-exit {
  transform: translateY(calc(var(--lg-wait-swap-distance) * -1));
  filter: blur(var(--lg-wait-swap-blur));
  opacity: 0;
}

body[data-liquid-glass="on"] .lg-wait-swap-copy.is-enter-start {
  transition: none;
  transform: translateY(var(--lg-wait-swap-distance));
  filter: blur(var(--lg-wait-swap-blur));
  opacity: 0;
}

/* The reader's animation choice, resolved onto <body> by core/prefs.ts (D40).
   The helper writes the words without a swap on that setting, so this is the
   second net for a swap already in flight when the choice changes \u2014 the copies'
   own motion and the box's travel alike. */
body[data-liquid-glass="on"]:is([data-lg-motion="off"],[data-lg-status-glow="false"]) .lg-wait-swap-copy {
  transition: none;
  transform: none;
  filter: none;
}

body[data-liquid-glass="on"]:is([data-lg-motion="off"],[data-lg-status-glow="false"]) .lg-wait-swap-label {
  transition: none;
}
`;

// src/wait-line.css
var wait_line_default = 'body[data-liquid-glass="on"] [data-lg-wait] :is([data-lg-wait-words],[data-lg-wait-icon]) { display:none; }\nbody[data-liquid-glass="on"] .lg-wait-line { display:inline-flex; align-items:center; min-width:0; max-width:100%; font-size:14px; line-height:24px; white-space:nowrap; }\nbody[data-liquid-glass="on"] .lg-wait-label { min-width:0; color:var(--lg-muted); }\nbody[data-liquid-glass="on"] .lg-wait-clock { flex:none; margin-left:8px; font-size:13px; font-variant-numeric:tabular-nums; color:var(--lg-muted); }\nbody[data-liquid-glass="on"] .lg-wait-badge { flex:none; margin-left:8px; padding:0 6px; border-radius:5px; font-size:11px; line-height:16px; color:var(--dsw-alias-state-warn-label,#a77524); background:color-mix(in srgb,currentColor 12%,transparent); }\nbody[data-liquid-glass="on"] .lg-wait-line [hidden] { display:none; }\nbody[data-liquid-glass="on"] .lg-wait-sweep-band { display:none; }\nbody[data-liquid-glass="on"] .lg-wait-swap-shimmer::before { content:attr(data-text); position:absolute; inset:0; pointer-events:none; background-image:var(--lg-status-wash-layers); background-repeat:no-repeat; background-size:var(--lg-status-wash-sizes); -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent; animation:lg-status-wash-hue 4000ms linear infinite,lg-status-wash-drift 5000ms ease-in-out infinite; }\nbody[data-liquid-glass="on"][data-lg-motion="soft"] .lg-wait-swap-shimmer::before { animation-duration:6000ms,7500ms; }\nbody[data-liquid-glass="on"]:is([data-lg-motion="off"],[data-lg-status-glow="false"]) .lg-wait-swap-shimmer::before { animation:none; }\nbody[data-liquid-glass="on"][data-lg-status-glow="false"] .lg-wait-swap-shimmer::before { display:none; }\n@media(prefers-reduced-motion:reduce) {\n  body[data-liquid-glass="on"] .lg-wait-chat-wait-dot { animation-play-state:paused!important; }\n  body[data-liquid-glass="on"] .lg-wait-swap-copy { transition:none; transform:none; filter:none; }\n  body[data-liquid-glass="on"] .lg-wait-swap-label { transition:none; }\n  body[data-liquid-glass="on"] .lg-wait-swap-shimmer::before { animation:none; }\n}\n';

// src/wait-line.js
var import_react5 = __toESM(require("react"), 1);

// src/dom-schedule.js
function afterPaint(callback, win = window) {
  let timer;
  let frame;
  let cancelled = false;
  const run = () => {
    if (!cancelled) callback();
  };
  if (win.requestAnimationFrame) frame = win.requestAnimationFrame(() => {
    timer = win.setTimeout(run, 0);
  });
  else timer = win.setTimeout(run, 0);
  return () => {
    cancelled = true;
    if (frame !== void 0) win.cancelAnimationFrame(frame);
    if (timer !== void 0) win.clearTimeout(timer);
  };
}
function watchShell(doc, callback) {
  let cancel;
  let disposed = false;
  const schedule = () => {
    if (cancel || disposed) return;
    cancel = afterPaint(() => {
      cancel = void 0;
      if (!disposed) callback();
    }, doc.defaultView);
  };
  const observer = new doc.defaultView.MutationObserver((records) => {
    for (const record of records) {
      const target = record.target.nodeType === 1 ? record.target : record.target.parentElement;
      if (target?.closest('[data-conversation-region="chat"],.lg-tree,.lg-ces-inline,.lg-ces-set')) continue;
      if ([...record.addedNodes, ...record.removedNodes].some((node) => node.nodeType === 1)) {
        schedule();
        break;
      }
    }
  });
  observer.observe(doc.body, { childList: true, subtree: true });
  schedule();
  return () => {
    disposed = true;
    observer.disconnect();
    cancel?.();
  };
}

// src/wait-motion.js
function motionReduced() {
  return document.body.dataset.lgMotion === "off" || document.body.dataset.lgStatusGlow === "false" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function motionValue(token) {
  const value = getComputedStyle(document.body).getPropertyValue(token).trim();
  if (!value) throw new Error(`Missing waiting-line motion token: ${token}`);
  return value;
}
function motionMs(token) {
  const value = motionValue(token);
  const duration = Number.parseFloat(value) * (value.endsWith("ms") ? 1 : 1e3);
  if (!Number.isFinite(duration)) throw new Error(`Invalid waiting-line duration: ${token}`);
  return duration;
}
function motionEase(token) {
  return motionValue(token);
}
function requestFrame({ write }) {
  const frame = window.requestAnimationFrame(write);
  return () => window.cancelAnimationFrame(frame);
}
function observeSize(element, callback) {
  const observer = new ResizeObserver(callback);
  observer.observe(element);
  return () => observer.disconnect();
}
function buildElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// src/vendor/wait-loader.js
var LANES = [
  { motion: "bounce", lane: "is-bounce", dots: 3 },
  { motion: "line", lane: "is-line", dots: 3 },
  { motion: "orbit", lane: "is-orbit", dots: 4 }
];
var ACTIVE = "is-active";
var LEAVING = "is-leaving";
var RESTING = "is-resting";
var FADE = "lg-wait-wait-fade";
var DOT = "lg-wait-chat-wait-dot";
var loaders = /* @__PURE__ */ new WeakMap();
function laneEntry(motion) {
  const entry = LANES.find((one) => one.motion === motion);
  if (entry === void 0) throw new Error(`chat-wait: no lane is built for ${motion} (chat-wait.css)`);
  return entry;
}
function laneOf(loader, motion) {
  const lane = loader.querySelector(`.${laneEntry(motion).lane}`);
  if (lane === null) throw new Error("chat-wait: the loader is missing a lane (chat-wait.css)");
  return lane;
}
function dotsOf(loader, motion) {
  return Array.from(laneOf(loader, motion).querySelectorAll(`.${DOT}`));
}
function place(loader, active, leaving) {
  for (const { motion } of LANES) {
    const lane = laneOf(loader, motion);
    lane.classList.toggle(ACTIVE, motion === active);
    lane.classList.toggle(LEAVING, motion === leaving);
    lane.classList.toggle(RESTING, motion !== active && motion !== leaving);
  }
}
function sharesOf(style, name) {
  return style.getPropertyValue(name).trim().split(/\s+/).filter((one) => one !== "").map(Number);
}
function timingOf(lane) {
  const style = getComputedStyle(lane);
  const fade = Number(style.getPropertyValue("--lg-wait-dot-fade"));
  if (!Number.isFinite(fade) || fade <= 0) throw new Error("chat-wait: a loader lane declares no fade length (chat-wait.css)");
  return {
    arrives: sharesOf(style, "--lg-wait-dot-arrives"),
    leaves: sharesOf(style, "--lg-wait-dot-leaves"),
    fade
  };
}
function shareAt(turn, alternate, time) {
  const passed = Math.floor(time / turn);
  const through = (time - passed * turn) / turn;
  return alternate && passed % 2 === 1 ? 1 - through : through;
}
function waitFor(turn, alternate, from, shares) {
  if (shares.length === 0) return 0;
  const step = 1;
  const cycle = turn * (alternate ? 2 : 1);
  for (let waited = 0; waited <= cycle; waited += step) {
    const share = shareAt(turn, alternate, from + waited);
    if (shares.some((one) => Math.abs(share - one) <= step / turn)) return waited;
  }
  throw new Error(`chat-wait: a loader motion never reaches ${shares.join("/")} (chat-wait.css)`);
}
function fadeDot(dot, ease, lane, leaving) {
  const motion = dot.getAnimations().find((one) => one instanceof CSSAnimation);
  const effect = motion === void 0 ? null : motion.effect;
  const time = motion === void 0 ? null : motion.currentTime;
  if (motion === void 0 || effect === null || time === null) {
    throw new Error("chat-wait: a loader dot carries no motion to hand over (chat-wait.css)");
  }
  const timing = effect.getTiming();
  const turn = typeof timing.duration === "number" ? timing.duration : 0;
  if (turn <= 0) throw new Error("chat-wait: a loader motion has no turn to fade over (chat-wait.css)");
  const alternate = timing.direction === "alternate";
  const active = Number(time) - Number(timing.delay ?? 0);
  return dot.animate(
    leaving ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }],
    {
      duration: turn * lane.fade,
      delay: waitFor(turn, alternate, active, leaving ? lane.leaves : lane.arrives),
      easing: motionEase(ease),
      // Held at both ends: a dot stays at the pose it stands at until its own
      // moment comes, and keeps the value it reached afterwards.
      fill: "both",
      id: FADE
    }
  );
}
function dropFades(loader) {
  for (const dot of loader.querySelectorAll(`.${DOT}`)) {
    for (const one of dot.getAnimations()) if (one.id === FADE) one.cancel();
  }
}
function easesOf(motion, leaving) {
  if (motion === "bounce") return leaving ? "--lg-wait-ease-damped-out" : "--lg-wait-ease-damped-in";
  return leaving ? "--lg-wait-ease-damped-in" : "--lg-wait-ease-damped-out";
}
function arrive(loader, to) {
  place(loader, to, null);
  const timing = timingOf(laneOf(loader, to));
  for (const dot of dotsOf(loader, to)) fadeDot(dot, easesOf(to, false), timing, false);
}
function handOver(loader, state, from, to) {
  dropFades(loader);
  if (motionReduced()) {
    state.motion = to;
    place(loader, to, null);
    return;
  }
  state.motion = to;
  const handOvers = ++state.handOvers;
  if (from === null) {
    arrive(loader, to);
    return;
  }
  place(loader, null, from);
  const timing = timingOf(laneOf(loader, from));
  const fades = dotsOf(loader, from).map((dot) => fadeDot(dot, easesOf(from, true), timing, true));
  void Promise.allSettled(fades.map((one) => one.finished)).then(() => {
    if (!loader.isConnected || loaders.get(loader) !== state || state.handOvers !== handOvers) return;
    arrive(loader, to);
  });
}
function nextMotion(motion) {
  const others = LANES.filter((one) => one.motion !== motion);
  return others[Math.floor(Math.random() * others.length)].motion;
}
function rotate(loader, state) {
  if (state.timer !== null) window.clearTimeout(state.timer);
  const period = motionMs("--lg-wait-period-dot-rotate");
  state.timer = window.setTimeout(() => {
    state.timer = null;
    if (!loader.isConnected) return;
    handOver(loader, state, state.motion, nextMotion(state.motion));
    rotate(loader, state);
  }, period);
}
function startWaitLoader(loader) {
  if (loaders.has(loader)) return;
  const opening = LANES[Math.floor(Math.random() * LANES.length)].motion;
  const state = { motion: opening, timer: null, handOvers: 0 };
  loaders.set(loader, state);
  if (motionReduced()) {
    place(loader, opening, null);
    return;
  }
  handOver(loader, state, null, opening);
  if (!motionReduced()) rotate(loader, state);
}
function releaseWaitLoader(loader) {
  const state = loaders.get(loader);
  if (state === void 0) return;
  if (state.timer !== null) window.clearTimeout(state.timer);
  dropFades(loader);
  loaders.delete(loader);
}

// src/vendor/sweep-band.js
var SWEEP_BAND_CLASS = "lg-wait-sweep-band";
var SWEEP_GLYPHS_CLASS = "lg-wait-sweep-glyphs";
function buildSweepBand(text2) {
  const band = buildElement("span", SWEEP_BAND_CLASS);
  band.setAttribute("aria-hidden", "true");
  band.inert = true;
  const glyphs = buildElement("span", SWEEP_GLYPHS_CLASS);
  if (text2 !== null) glyphs.setAttribute("data-text", text2);
  band.appendChild(glyphs);
  return { band, glyphs };
}

// src/vendor/swapping-text.js
var SIZER_CLASS = "lg-wait-swap-sizer";
var SIZER_WORD_CLASS = "lg-wait-swap-sizer-word";
var COPY_CLASS = "lg-wait-swap-copy";
var swapped = /* @__PURE__ */ new WeakMap();
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
function fillCopy(copy, text2, withShimmer) {
  copy.replaceChildren(text2);
  copy.setAttribute("data-text", text2);
  if (withShimmer) copy.appendChild(buildSweepBand(text2).band);
}
function buildCopy(text2, withShimmer, extraClass = "") {
  const copy = document.createElement("span");
  copy.className = COPY_CLASS + extraClass + (withShimmer ? " lg-wait-swap-shimmer" : "");
  fillCopy(copy, text2, withShimmer);
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
  if (standing.length === unique.length && standing.every((text2, at) => text2 === unique[at])) return false;
  sizer.replaceChildren(...unique.map((text2) => {
    const word = document.createElement("span");
    word.className = SIZER_WORD_CLASS;
    word.textContent = text2;
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
  if (gap > 0) state.enterTimer = window.setTimeout(() => {
    state.enterTimer = null;
    swap.entering.classList.remove("is-enter-start");
  }, gap);
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
function setSwappingText(element, text2, withShimmer = false) {
  const state = stateOf(element);
  const was = element.dataset.text;
  if (state.written && was === text2) return;
  const first = !state.written;
  if (!element.classList.contains("lg-wait-swap-label")) element.classList.add("lg-wait-swap-label");
  state.written = true;
  if (first || motionReduced()) {
    halt(element, state);
    const sizer = sizerOf(element, state);
    const standing = buildCopy(text2, withShimmer);
    while (element.childNodes.length > 1) element.removeChild(element.lastChild);
    element.appendChild(standing);
    element.dataset.text = text2;
    layWords(sizer, [text2]);
    return;
  }
  if (state.swap !== null && state.swap.entering.parentNode === element) {
    fillCopy(state.swap.entering, text2, withShimmer);
    element.dataset.text = text2;
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
  const entering = buildCopy(text2, withShimmer, " is-enter-start");
  entering.setAttribute("aria-hidden", "true");
  element.appendChild(entering);
  element.dataset.text = text2;
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

// src/vendor/wait-state.js
var WAIT_OVERTIME_MS = 1e4;
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
var WORD_LOCK_MS = 1e3;
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

// src/vendor/read-turn-activity.js
function readTurnActivity(snapshot, turn) {
  const step = turn.steps.at(-1);
  const assistant = step?.data.get("assistant-step");
  if (assistant?.status === "running") {
    return { kind: "assistant", assistant, newest: assistant.blocks.at(-1)?.kind ?? null };
  }
  let running;
  for (const call of snapshot.legacy?.runningCalls ?? []) {
    if (call.turn === turn.turn) running = call;
  }
  return running ? { kind: "tools", call: running } : null;
}

// src/vendor/activity-phrase.js
var PHRASE_TAIL_CHARS = 800;
var SENTENCE_MARKS = /[.!?\u2026\u3002\uff01\uff1f]+$/;
var CLOSERS = /[\s"'\u201d\u2019\u300d\u300f\uff09)\]]+$/;
var CLAUSE_END = /[,;:\u2014\u2013)\uff0c\uff1b\uff1a\uff09]/;
var QUOTED = /「[^」]*」|『[^』]*』|“[^”]*”|"[^"]*"/g;
var WORD = /[A-Za-z\u2019']+/g;
var QUALIFIERS = /* @__PURE__ */ new Set(["not", "now", "currently", "still", "just", "already", "again", "simply", "only", "also", "really"]);
var QUALIFIER_LIMIT = 2;
var NOMINAL_ING = /* @__PURE__ */ new Set(["nothing", "anything", "everything", "something", "thing", "morning", "evening"]);
var CONTRACTED_AUX = /['\u2019](m|re|s|ve)$/;
var segmenter = null;
var scannedText = "";
var scannedPhrase = null;
function endedSentences(text2) {
  if (segmenter === null) segmenter = new Intl.Segmenter(void 0, { granularity: "sentence" });
  const sentences = [];
  for (const piece of segmenter.segment(text2)) {
    if (SENTENCE_MARKS.test(piece.segment.replace(CLOSERS, ""))) sentences.push(piece.segment);
  }
  return sentences.reverse();
}
function stripMarkup(text2) {
  return text2.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/`|\*\*|__|~~/g, "");
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
function activityPhrase(text2) {
  if (text2 === scannedText) return scannedPhrase;
  const tail = text2.length <= PHRASE_TAIL_CHARS ? text2 : text2.slice(-PHRASE_TAIL_CHARS);
  scannedText = text2;
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

// src/vendor/call-args.js
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

// src/vendor/call-description.js
function callDescription(block) {
  if (block.phase !== "start") return null;
  const args = callArgsOf(block.argsRaw ?? "");
  const description = args === null ? void 0 : callString(args, ["description"]);
  if (description === void 0) return null;
  const line = description.split("\n", 1)[0].replace(/\s+/g, " ").trim();
  if (line === "") return null;
  return line.charAt(0).toUpperCase() + line.slice(1);
}

// src/vendor/file-tool.js
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

// src/vendor/turn-activity.js
var THINKING_KEY = "chatWaitThinking";
var ACTIVITY_THINKING = { key: THINKING_KEY };
var ACTIVITY_WRITING = { key: "chatWaitWriting" };
var ACTIVITY_TOOL_CALL = { key: "chatWaitToolCall", aboutCall: "generic" };
var ACTIVITY_TOOLS = { key: "chatWaitTools", aboutCall: "generic" };
var ACTIVITY_FILE = {
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

// src/wait-line.js
var wordsByKey = {
  chatWaitThinking: "\u6B63\u5728\u601D\u8003",
  chatWaitWriting: "\u6B63\u5728\u5199\u56DE\u7B54",
  chatWaitToolCall: "\u6B63\u5728\u51C6\u5907\u5DE5\u5177\u8C03\u7528",
  chatWaitTools: "\u6B63\u5728\u8C03\u7528\u5DE5\u5177",
  chatWaitReading: "\u6B63\u5728\u8BFB\u53D6 {file}",
  chatWaitEditing: "\u6B63\u5728\u7F16\u8F91 {file}",
  chatWaitWritingFile: "\u6B63\u5728\u5199\u5165 {file}"
};
function activityText(activity) {
  if (!activity || activity.key === THINKING_KEY) return null;
  if (activity.key === null) return activity.text ?? null;
  const copy = wordsByKey[activity.key];
  return activity.params?.file ? copy?.replace("{file}", activity.params.file) : copy;
}
function durationText(elapsed) {
  const seconds = Math.max(1, Math.floor(elapsed / 1e3));
  if (seconds < 60) return `${seconds} \u79D2`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} \u5206 ${seconds % 60} \u79D2`;
  return `${Math.floor(minutes / 60)} \u5C0F\u65F6 ${minutes % 60} \u5206 ${seconds % 60} \u79D2`;
}
function createParts(row, words) {
  const line = buildElement("span", "lg-wait-line");
  const loader = buildElement("span", "lg-wait-chat-wait-loader");
  loader.setAttribute("aria-hidden", "true");
  for (const [name, count] of [["bounce", 3], ["line", 3], ["orbit", 4]]) {
    const lane = buildElement("span", `lg-wait-chat-wait-lane is-${name}`);
    for (let index = 0; index < count; index += 1) lane.append(buildElement("span", "lg-wait-chat-wait-dot"));
    loader.append(lane);
  }
  const label = buildElement("span", "lg-wait-label");
  label.setAttribute("role", "status");
  label.setAttribute("aria-live", "polite");
  label.setAttribute("aria-atomic", "true");
  const clock = buildElement("span", "lg-wait-clock");
  clock.setAttribute("aria-hidden", "true");
  const badge = buildElement("span", "lg-wait-badge");
  badge.textContent = "\u6682\u672A\u54CD\u5E94";
  badge.hidden = true;
  line.append(loader, label, clock, badge);
  const icon = words.parentElement.firstElementChild;
  words.after(line);
  return { row, words, icon: icon !== words ? icon : null, line, loader, label, clock, badge, reduced: null };
}
function attachWaitingLine(ctx, sessionId, root, controller) {
  let target;
  let unsubscribe;
  let parts;
  let row;
  let cancel;
  let disposed = false;
  let warned = false;
  let turnNumber;
  let wording;
  let waitBegan;
  const release = () => {
    if (!parts) return;
    releaseSwappingText(parts.label);
    releaseWaitLoader(parts.loader);
    parts.line.remove();
    parts.words.removeAttribute("data-lg-wait-words");
    parts.icon?.removeAttribute("data-lg-wait-icon");
    parts.row.removeAttribute("data-lg-wait");
    parts = void 0;
  };
  const schedule = () => {
    if (cancel || disposed) return;
    cancel = afterPaint(() => {
      cancel = void 0;
      sync();
    }, root.ownerDocument.defaultView);
  };
  const sync = () => {
    if (disposed || !root.isConnected || root.getAttribute("data-conversation-session") !== sessionId) {
      release();
      return;
    }
    try {
      const binding = ctx.sessions.binding(sessionId);
      const fresh = binding ? ctx.uiConversation.binding(sessionId).target("chat") : void 0;
      if (fresh !== target) {
        unsubscribe?.();
        target = fresh;
        unsubscribe = target?.subscribe(schedule);
      }
      const snapshot = target?.getSnapshot();
      const turn = snapshot?.timeline?.turns ? openTurn(snapshot) : void 0;
      if (!turn) {
        release();
        row = void 0;
        turnNumber = void 0;
        wording = void 0;
        waitBegan = void 0;
        return;
      }
      if (turnNumber !== turn.turn) {
        turnNumber = turn.turn;
        wording = void 0;
        waitBegan = void 0;
      }
      if (!row?.isConnected || !root.contains(row)) {
        release();
        row = [...root.querySelectorAll("[data-chat-running]")].find((candidate) => candidate.closest("[data-conversation-session]") === root);
      }
      if (!row) return;
      const words = row.querySelector(":scope > span > [data-shimmer], :scope > span > [data-text-shimmer]");
      if (!words) {
        release();
        return;
      }
      if (!parts?.line.isConnected || parts.words !== words) {
        release();
        parts = createParts(row, words);
      }
      const now = Date.now();
      const activity = activityWords(snapshot, turn, false);
      const said = activityText(activity);
      const pass = wordForPass({ word: said, own: false, detail: null, onCall: activity?.aboutCall === "generic", host: wordsByKey.chatWaitThinking }, wording, now);
      wording = pass.row;
      setSwappingText(parts.label, pass.word, true);
      parts.label.setAttribute("aria-label", pass.word);
      const clock = turn.start ? durationText(now - turn.start.time) : "";
      if (parts.clock.textContent !== clock) parts.clock.textContent = clock;
      parts.clock.hidden = !turn.start;
      if (activity === null) waitBegan ??= waitStart(turn, now);
      else waitBegan = void 0;
      parts.badge.hidden = waitBegan === void 0 || now - waitBegan < WAIT_OVERTIME_MS;
      const reduced = motionReduced();
      if (parts.reduced !== reduced) {
        releaseWaitLoader(parts.loader);
        startWaitLoader(parts.loader);
        parts.reduced = reduced;
      }
      parts.words.setAttribute("data-lg-wait-words", "");
      parts.icon?.setAttribute("data-lg-wait-icon", "");
      row.setAttribute("data-lg-wait", "");
      warned = false;
    } catch (error) {
      release();
      if (!warned) {
        console.error("[dsh-liquid-glass] waiting line could not attach", error);
        warned = true;
      }
    }
  };
  const observer = new MutationObserver((records) => {
    if (parts?.line.isConnected && parts.words.isConnected && row?.isConnected) return;
    if (records.some((record) => !record.target.closest?.(".lg-wait-line"))) schedule();
  });
  observer.observe(root, { childList: true, subtree: true });
  const timer = window.setInterval(sync, 250);
  const stopPreferences = controller.subscribe(schedule);
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", schedule);
  sync();
  return () => {
    disposed = true;
    observer.disconnect();
    window.clearInterval(timer);
    cancel?.();
    unsubscribe?.();
    stopPreferences();
    media.removeEventListener("change", schedule);
    release();
    target = void 0;
    wording = void 0;
  };
}
function WaitingAnchor({ context, controller, sessionId }) {
  const anchor = (0, import_react5.useRef)(null);
  (0, import_react5.useEffect)(() => {
    const root = anchor.current?.closest("[data-conversation-session]");
    if (root && typeof sessionId === "string") return attachWaitingLine(context, sessionId, root, controller);
  }, [context, controller, sessionId]);
  return import_react5.default.createElement("span", { ref: anchor, hidden: true, "aria-hidden": "true", "data-lg-wait-anchor": "" });
}
function installWaitingLine(ctx, controller) {
  const fiber = ctx.inject(["uiConversation"], (scope) => {
    scope.slots.inject("conversation.input.right", () => scope.slots.register({
      name: "conversation.input.right",
      id: "liquid-glass-waiting-line",
      order: 41,
      inject: (sessionId) => ({ sessionId })
    }, (props) => import_react5.default.createElement(WaitingAnchor, { ...props, context: scope, controller })));
  });
  return () => fiber.dispose();
}

// src/orb.jsx
var import_react6 = __toESM(require("react"), 1);
function LiquidOrb() {
  return /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-stage", "aria-hidden": "true" }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-halo" }), /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-orbit" }, /* @__PURE__ */ import_react6.default.createElement("i", null)), /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-hero-orb" }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-clip" }, /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-fluid lg-orb-fluid-a" }), /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-fluid lg-orb-fluid-b" }), /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-fluid lg-orb-fluid-c" }), /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-core" }), /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-ribbon lg-orb-ribbon-a" }), /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-ribbon lg-orb-ribbon-b" }), /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-caustic" }), /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-sheen" }))), /* @__PURE__ */ import_react6.default.createElement("span", { className: "lg-orb-shadow" }));
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
    const target = mounted?.isConnected ? { row: mounted.parentElement } : findAppearanceRow(doc);
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
  const releaseObserver = watchShell(doc, sync);
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
      releaseObserver();
      skinObserver.disconnect();
      unsubscribe();
      doc.removeEventListener("click", nativeChoice, true);
      mounted?.remove();
    }
  };
}
function installShellSkin(doc = document) {
  const added = /* @__PURE__ */ new Set();
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
  const releaseObserver = watchShell(doc, sync);
  return () => {
    stopped = true;
    releaseObserver();
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

// src/effort-slider.js
var import_react7 = __toESM(require("react"), 1);
var ReactDOM = __toESM(require("react-dom"), 1);

// src/vendor/effort-slider.js
function createEffortSlider(React9, ReactDOM2) {
  const exports = {};
  var PACKAGE_ID = "dsh-liquid-glass-effort-slider";
  var SLOT_NAME = "conversation.input.right";
  var ENTRY_ID = "liquid-glass-effort-slider";
  var ENTRY_ORDER = 40;
  var ROW_PADDING_BLOCK = "10px";
  var EFFORT_ROW_LABELS = ["\u63A8\u7406\u7B49\u7EA7", "Effort"];
  var COMMIT_THROTTLE_MS = 120;
  var COMMIT_DEADLINE_MS = 1e4;
  var RETRY_DELAYS = [60, 240, 540, 960, 1500, 3e3, 3e3];
  var STYLE_MARKER = PACKAGE_ID;
  var TRACK_HEIGHT = 28;
  var KNOB_SIZE = TRACK_HEIGHT;
  var KNOB_RADIUS = KNOB_SIZE / 2;
  var BASE_SPEEDUP = 4;
  var STARFIELD_DURATION_MEAN = 1.5;
  var STARFIELD_DURATION_SPREAD = 0.08;
  var STARFIELD_MIN = 0.5;
  var GOLDEN_RATIO = 0.6180339887498949;
  var MAX_SPEED_FACTOR = 2;
  var REDUCED_MOTION_SLOWDOWN = 2.6;
  var MIN_HEIGHT_SLOTS = 3;
  var ENERGY_START = 1 / 3;
  var ENERGY_END = 2 / 3;
  var COLOR_BLUE = [77, 147, 248];
  var COLOR_VIOLET = [147, 51, 234];
  var COLOR_DEEP = [76, 29, 149];
  var COLOR_TEXT_VIOLET = [139, 92, 246];
  var FILL_RADIUS = "border-radius:" + KNOB_RADIUS + "px 0 0 " + KNOB_RADIUS + "px";
  var CSS = [
    /* 注入进官方那一行的容器：折行到第二行并铺满整行 */
    ".lg-ces-inline{--lg-ces-accent:var(--dsw-alias-state-business-primary,var(--dsw-static-blue-450,#4d93f8));box-sizing:border-box;flex-basis:100%;width:100%;min-width:0}",
    ".lg-ces-track{position:relative;box-sizing:border-box;height:" + TRACK_HEIGHT + "px;margin-top:2px;border-radius:999px;background:var(--dsw-alias-border-l1,rgba(15,17,21,.08));cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none}",
    ".lg-ces-track:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--lg-ces-accent));outline-offset:2px}",
    ".lg-ces-fill{position:absolute;top:0;bottom:0;left:0;" + FILL_RADIUS + ";pointer-events:none}",
    ".lg-ces-tick{position:absolute;top:50%;width:3px;height:3px;margin:-1.5px 0 0 -1.5px;border-radius:50%;background:rgba(128,128,128,.30);background:color-mix(in srgb,var(--dsw-alias-label-primary,#0f1115) 26%,transparent);pointer-events:none}",
    ".lg-ces-tick[data-on='1']{background:rgba(255,255,255,.5)}",
    /* 旋钮直径 = 轨道高度（"与滑条同宽"）：圆完整地填满管口，不会出现被裁出的平边。 */
    ".lg-ces-knob{position:absolute;top:50%;width:" + KNOB_SIZE + "px;height:" + KNOB_SIZE + "px;margin:" + -KNOB_RADIUS + "px 0 0 " + -KNOB_RADIUS + "px;border-radius:50%;background:#fff;box-shadow:0 1px 5px rgba(0,0,0,.34),0 0 0 .5px rgba(0,0,0,.06);pointer-events:none}",
    ".lg-ces-error{margin-top:6px;font-size:11px;line-height:16px;color:var(--dsw-alias-state-error-primary,#e5484d)}",
    /* ── 最高档能量层（纯视觉：紫色星云 + 星尘粒子 + 扫光）─────────────────
       强度由 `--lg-ces-energy`(0..1) 一个变量驱动：外层只做 opacity/box-shadow，
       所以"渐入"是浏览器合成的颜色插值，不需要 JS 逐帧改样式。
       关掉时把粒子动画 `animation-play-state: paused`，不让 22 个隐形元素白烧 GPU。 */
    ".lg-ces-inline[data-energy='1'] .lg-ces-track{box-shadow:0 0 calc(var(--lg-ces-energy,0) * 16px) rgba(168,85,247,.5)}",
    ".lg-ces-inline[data-energy='0'] .lg-ces-star,.lg-ces-inline[data-energy='0'] .lg-ces-energy__sweep{animation-play-state:paused}",
    /* 能量层只覆盖**已填充那一段**（宽度与填充相同）：档位右边没到的部分不显示能量条。
       左端从 0 起、宽度由内联样式给（= 到旋钮圆心），所以它跟着旋钮一起长。 */
    ".lg-ces-energy{position:absolute;top:0;bottom:0;left:0;" + FILL_RADIUS + ";overflow:hidden;pointer-events:none;opacity:var(--lg-ces-energy,0);transition:opacity .2s ease;background:linear-gradient(90deg,#3b1178 0%,#6d28d9 30%,#9333ea 62%,#c084fc 100%)}",
    /* 星星单独一层：**不跟着星云淡入**（否则 high 档会被星云的 0.5 透明度压得看不见）。
       几何与星云层相同（贴着已填充段、圆角裁切），透明度由内联样式给。 */
    ".lg-ces-stars{position:absolute;top:0;bottom:0;left:0;" + FILL_RADIUS + ";overflow:hidden;pointer-events:none;transition:opacity .2s ease}",
    /* 星空（**所有出现粒子的档位都用这一套**）：外层是**整轨宽度**的轨道
             （它自己在做 -100% 的连续横穿），内层圆点的亮度/大小由 --lg-ces-b 决定（越亮越大）。
             残影只在两端淡出，而那两端在可视区外，所以看起来粒子"从不消失"。

             ⚠️ 时长与相位**直接内联**写在元素上（见组件的 animationDuration / animationDelay），
             不走 CSS 变量：实测把 `animation-delay:var(--lg-ces-delay)` 写在样式表里时，
             真宿主里负相位不生效 —— 结果是"一打开所有星星挤在起点，十几秒后才靠速度差散开"。
             `--lg-ces-b`（亮度/大小）只是不参与动画计时的普通变量，留着没问题。 */
    ".lg-ces-star{position:absolute;left:0;right:0;height:3px;margin-top:-1.5px;pointer-events:none;animation-name:lg-ces-star-sweep;animation-timing-function:linear;animation-iteration-count:infinite}",
    ".lg-ces-star__dot{position:absolute;left:100%;top:0;width:3px;height:3px;margin-left:-1.5px;border-radius:50%;background:#fff;box-shadow:0 0 4px rgba(255,255,255,.85);opacity:var(--lg-ces-b,1);transform:scale(var(--lg-ces-b,1))}",
    "@keyframes lg-ces-star-sweep{0%{transform:translate3d(0,0,0);opacity:0}6%{opacity:1}94%{opacity:1}100%{transform:translate3d(-100%,0,0);opacity:0}}",
    ".lg-ces-energy__sweep{position:absolute;inset:0;background:linear-gradient(100deg,transparent 18%,rgba(255,255,255,.30) 50%,transparent 82%);transform:translateX(100%);animation:lg-ces-sweep 2.4s linear infinite}",
    "@keyframes lg-ces-sweep{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}",
    "body[data-ds-dark-theme] .lg-ces-star__dot{background:#f5f3ff;box-shadow:0 0 5px rgba(216,180,254,.95)}",
    /* 系统要求「减少动态效果」时**放缓**而不是冻住：收起扫光。
       星星的放缓在 JS 里算（时长 × REDUCED_MOTION_SLOWDOWN）—— 不走 CSS 媒体查询，
       因为时长现在是内联的，也免得再引入"变量参与动画计时"这类坑。 */
    "@media (prefers-reduced-motion: reduce){.lg-ces-energy{transition:none}.lg-ces-energy__sweep{display:none}}",
    /* 设置面板（挂在 body 上，样式必须是全局的） */
    ".lg-ces-set{position:fixed;z-index:2147483000;min-width:252px;max-width:340px;padding:10px 12px;border-radius:10px;box-sizing:border-box;background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-pri,#1b1c20);border:1px solid rgba(127,127,127,.28);box-shadow:0 12px 32px rgba(0,0,0,.24);font:13px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif}",
    ".lg-ces-set__title{font-weight:600;margin:0 0 6px 0}",
    ".lg-ces-set__row{font-size:12px;opacity:.72;margin-bottom:8px}",
    ".lg-ces-set__group{display:flex;flex-direction:column;gap:6px;margin-bottom:10px}",
    ".lg-ces-set__group label{display:flex;gap:6px;align-items:center;cursor:pointer}",
    ".lg-ces-set__actions{display:flex;justify-content:space-between;gap:8px}",
    ".lg-ces-set button{cursor:pointer;font:inherit;color:inherit;padding:4px 10px;border-radius:6px;border:1px solid rgba(127,127,127,.35);background:transparent}",
    ".lg-ces-set button:hover{background:rgba(127,127,127,.14)}",
    "body[data-ds-dark-theme] .lg-ces-set{background:var(--dsw-alias-bg-base,#24262c);color:var(--dsw-alias-label-pri,#e8e9ec)}",
    /* 「已到达档位的刻度点」：dim = 与未到达同色；hidden = 隐藏 */
    ".lg-ces-inline[data-motion='none'] .lg-ces-star,.lg-ces-inline[data-motion='none'] .lg-ces-energy__sweep{animation:none}",
    ".lg-ces-inline[data-reached-ticks='dim'] .lg-ces-tick[data-on='1']{background:rgba(128,128,128,.30);background:color-mix(in srgb,var(--dsw-alias-label-primary,#0f1115) 26%,transparent)}",
    ".lg-ces-inline[data-reached-ticks='hidden'] .lg-ces-tick[data-on='1']{display:none}"
  ].join("\n");
  function installStyles() {
    try {
      installSettingsUi();
      if (typeof document === "undefined" || !document.head) return null;
      var existing = document.querySelector('style[data-plugin-css="' + STYLE_MARKER + '"]');
      if (existing) return existing;
      var style = document.createElement("style");
      style.setAttribute("data-plugin-css", STYLE_MARKER);
      style.textContent = CSS;
      document.head.appendChild(style);
      return style;
    } catch (error) {
      return null;
    }
  }
  var __lgCesInstanceSeq = 0;
  var __lgCesOwnerToken = {};
  var __lgCesDecided = false;
  var __lgCesIsOwner = false;
  var __levelsCache = { key: null, levels: [] };
  var __levelsCacheHit = false;
  var SETTINGS_KEY = "dsh-liquid-glass.effort-slider.settings";
  var SETTINGS_EVENT = "dsh-liquid-glass:effort-slider-settings";
  var SETTINGS_VERSION = 3;
  var SETTINGS_SCHEMA = [
    {
      key: "motion",
      kind: "radio",
      group: "\u52A8\u753B\u6548\u679C",
      label: "\u52A8\u753B\u6548\u679C",
      default: "full",
      options: [
        { value: "fast", label: "\u5FEB\u901F\u52A8\u753B" },
        { value: "quick", label: "\u7B80\u6D01\u52A8\u753B" },
        { value: "full", label: "\u5B8C\u6574\u52A8\u753B" }
      ]
    },
    {
      key: "reachedTicks",
      kind: "radio",
      group: "\u5DF2\u5230\u8FBE\u6863\u4F4D\u7684\u523B\u5EA6\u70B9",
      label: "\u523B\u5EA6\u70B9",
      default: "hidden",
      options: [
        { value: "highlight", label: "\u4EAE\u767D\u663E\u793A" },
        { value: "dim", label: "\u4E0E\u672A\u5230\u8FBE\u540C\u8272" },
        { value: "hidden", label: "\u9690\u85CF" }
      ]
    }
  ];
  function schemaDefaults() {
    var schema = typeof SETTINGS_SCHEMA === "undefined" ? [] : SETTINGS_SCHEMA;
    var out = {};
    for (var i = 0; i < schema.length; i += 1) {
      var item = schema[i];
      if (item.default !== void 0) {
        out[item.key] = item.default;
        continue;
      }
      if (item.kind === "radio") out[item.key] = item.options[0].value;
      else if (item.kind === "switch") out[item.key] = true;
      else if (item.kind === "range") out[item.key] = item.scale || 1;
      else out[item.key] = null;
    }
    return out;
  }
  function normalizeSettings(raw) {
    var schema = typeof SETTINGS_SCHEMA === "undefined" ? [] : SETTINGS_SCHEMA;
    var out = schemaDefaults();
    var source = raw && typeof raw === "object" ? raw : {};
    for (var i = 0; i < schema.length; i += 1) {
      var item = schema[i];
      var value = source[item.key];
      if (value === void 0) continue;
      if (item.kind === "radio") {
        for (var j = 0; j < item.options.length; j += 1) {
          if (item.options[j].value === value) {
            out[item.key] = value;
            break;
          }
        }
      } else if (item.kind === "switch") {
        if (typeof value === "boolean") out[item.key] = value;
      } else if (item.kind === "range") {
        var n = typeof value === "number" ? value : parseFloat(value);
        var scale = item.scale || 1;
        if (isFinite(n)) {
          var lo = item.min / scale, hi = item.max / scale;
          out[item.key] = n < lo ? lo : n > hi ? hi : n;
        }
      }
    }
    return out;
  }
  var settingsCache = null;
  var settingsUiState = {
    installed: false,
    panel: null,
    longPressTimer: null,
    longPressOrigin: null,
    anchorEl: null,
    cacheListenerInstalled: false
  };
  function settingsKey() {
    return typeof SETTINGS_KEY === "undefined" ? "dsh-liquid-glass.effort-slider.settings" : SETTINGS_KEY;
  }
  function settingsEventName() {
    return typeof SETTINGS_EVENT === "undefined" ? "dsh-liquid-glass:effort-slider-settings" : SETTINGS_EVENT;
  }
  function cacheGet() {
    return typeof settingsCache === "undefined" ? null : settingsCache;
  }
  function cacheSet(value) {
    if (typeof settingsCache !== "undefined") settingsCache = value;
  }
  function readSettings() {
    var cached = cacheGet();
    if (cached !== null) return cached;
    var raw = null;
    try {
      if (typeof localStorage !== "undefined" && localStorage) raw = localStorage.getItem(settingsKey());
    } catch (error) {
    }
    var parsed = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch (error) {
      parsed = null;
    }
    var expected = typeof SETTINGS_VERSION === "undefined" ? 3 : SETTINGS_VERSION;
    var out = normalizeSettings(parsed);
    out.v = expected;
    if (parsed && typeof parsed === "object" && parsed.v !== expected) {
      try {
        if (typeof localStorage !== "undefined" && localStorage) localStorage.setItem(settingsKey(), JSON.stringify(out));
      } catch (error) {
      }
    }
    cacheSet(out);
    return out;
  }
  function writeSettings(patch) {
    var cur = readSettings();
    var merged = {};
    for (var k in cur) if (Object.prototype.hasOwnProperty.call(cur, k)) merged[k] = cur[k];
    if (patch && typeof patch === "object") {
      for (var k2 in patch) if (Object.prototype.hasOwnProperty.call(patch, k2)) merged[k2] = patch[k2];
    }
    var next = normalizeSettings(merged);
    next.v = typeof SETTINGS_VERSION === "undefined" ? 3 : SETTINGS_VERSION;
    cacheSet(next);
    try {
      if (typeof localStorage !== "undefined" && localStorage) localStorage.setItem(settingsKey(), JSON.stringify(next));
    } catch (error) {
    }
    try {
      if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent === "function") {
        window.dispatchEvent(new CustomEvent(settingsEventName()));
      }
    } catch (error) {
    }
    return next;
  }
  function motionMode() {
    var mode = readSettings().motion;
    return mode === "quick" || mode === "fast" ? mode : "full";
  }
  function motionParamsForMode() {
    var mode = motionMode();
    if (mode === "quick") return MOTION_REDUCED;
    if (mode === "fast") return MOTION_FAST;
    return MOTION;
  }
  function systemReducedMotion() {
    try {
      return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches === true;
    } catch (error) {
      return false;
    }
  }
  var traceBuf = [];
  function tracePush(entry) {
    try {
      traceBuf.push(entry);
      if (traceBuf.length > 400) traceBuf.splice(0, traceBuf.length - 400);
    } catch (error) {
    }
  }
  function traceClear() {
    try {
      traceBuf.length = 0;
    } catch (error) {
    }
  }
  function dumpTrace() {
    try {
      var buf = traceBuf.slice();
      if (buf.length === 0) return "\uFF08\u8FD8\u6CA1\u6709\u8BB0\u5F55\uFF1A\u8BF7\u5148\u5728\u6ED1\u6761\u4E0A\u62D6\u52A8/\u677E\u624B\u51E0\u6B21\uFF0C\u518D\u70B9\u8FD9\u91CC\uFF09";
      var samples = buf.filter(function(e) {
        return e && e.k === "s";
      });
      var jumps = [];
      for (var i = 1; i < samples.length; i += 1) {
        var d = Math.abs((samples[i].shown || 0) - (samples[i - 1].shown || 0));
        if (d > 0.02) jumps.push({ at: i, d: Math.round(d * 1e3) / 10, from: samples[i - 1], to: samples[i] });
      }
      jumps.sort(function(a, b) {
        return b.d - a.d;
      });
      var lines = [];
      lines.push("=== \u6ED1\u6761\u8BCA\u65AD " + (/* @__PURE__ */ new Date()).toISOString() + " ===");
      lines.push("\u8BB0\u5F55 " + buf.length + " \u6761\uFF08\u91C7\u6837 " + samples.length + "\uFF09");
      lines.push("\u52A8\u753B\u6A21\u5F0F = " + readSettings().motion + " ; \u7CFB\u7EDF\u51CF\u5C11\u52A8\u6001 = " + systemReducedMotion());
      lines.push("\u5355\u5E27\u8DF3\u53D8(>2%) \u6B21\u6570: " + jumps.length);
      for (var j = 0; j < Math.min(8, jumps.length); j += 1) {
        var x = jumps[j];
        lines.push("  \u8DF3 " + x.d + "%  " + JSON.stringify({ from: x.from, to: x.to }));
      }
      var rel = buf.filter(function(e) {
        return e && e.k === "release";
      });
      lines.push("\u677E\u624B\u4E8B\u4EF6 " + rel.length + " \u6B21\uFF0C\u6700\u540E 3 \u6B21:");
      for (var r = Math.max(0, rel.length - 3); r < rel.length; r += 1) lines.push("  " + JSON.stringify(rel[r]));
      var evCounts = {};
      for (var ci = 0; ci < buf.length; ci += 1) {
        var kk = buf[ci] && buf[ci].k;
        if (kk) evCounts[kk] = (evCounts[kk] || 0) + 1;
      }
      lines.push("\u4E8B\u4EF6\u8BA1\u6570: " + JSON.stringify(evCounts));
      var marks = [];
      for (var mi = 0; mi < buf.length; mi += 1) {
        if (buf[mi] && buf[mi].k && buf[mi].k !== "s") marks.push(mi);
      }
      for (var mj = Math.max(0, marks.length - 5); mj < marks.length; mj += 1) {
        var mIdx = marks[mj];
        lines.push("=== \u4E8B\u4EF6 " + JSON.stringify(buf[mIdx]));
        for (var mb = Math.max(0, mIdx - 2); mb < mIdx; mb += 1) lines.push("  \u524D " + JSON.stringify(buf[mb]));
        for (var ma = mIdx + 1; ma < Math.min(buf.length, mIdx + 7); ma += 1) lines.push("  \u540E " + JSON.stringify(buf[ma]));
      }
      lines.push("--- \u6700\u540E 120 \u6761\u539F\u59CB\u8BB0\u5F55 ---");
      var tail = buf.slice(-120);
      for (var k = 0; k < tail.length; k += 1) lines.push(JSON.stringify(tail[k]));
      return lines.join("\n");
    } catch (error) {
      return "\u8BCA\u65AD\u751F\u6210\u5931\u8D25: " + String(error && error.message ? error.message : error);
    }
  }
  function renderKind(item, value, esc) {
    var key = item.key;
    if (item.kind === "radio") {
      var opts = "";
      for (var i = 0; i < item.options.length; i += 1) {
        var o = item.options[i];
        opts += '<label><input type="radio" name="lg-ces-' + esc(key) + '" data-lg-ces-key="' + esc(key) + '" value="' + esc(o.value) + '"' + (value === o.value ? " checked" : "") + "> " + esc(o.label) + "</label>";
      }
      return '<div class="lg-ces-set__group" role="radiogroup" aria-label="' + esc(item.group || item.label) + '">' + (item.group ? '<div class="lg-ces-set__row">' + esc(item.group) + "</div>" : "") + opts + "</div>";
    }
    if (item.kind === "switch") {
      return '<div class="lg-ces-set__group"><label><input type="checkbox" data-lg-ces-key="' + esc(key) + '"' + (value === true ? " checked" : "") + "> " + esc(item.label) + "</label></div>";
    }
    if (item.kind === "range") {
      var shown = Math.round((value || 0) * (item.scale || 1));
      return '<div class="lg-ces-set__group"><label class="lg-ces-set__range">' + esc(item.label) + ' <input type="range" data-lg-ces-key="' + esc(key) + '" data-lg-ces-scale="' + esc(item.scale || 1) + '" min="' + esc(item.min) + '" max="' + esc(item.max) + '" step="' + esc(item.step || 1) + '" value="' + esc(shown) + '"> <span data-lg-ces-val="' + esc(key) + '"></span></label></div>';
    }
    return "";
  }
  function disposeSettingsPanel() {
    try {
      if (typeof document === "undefined") return;
      var stale = document.querySelectorAll(".lg-ces-set");
      for (var i = 0; i < stale.length; i += 1) {
        if (stale[i].parentNode) stale[i].parentNode.removeChild(stale[i]);
      }
    } catch (error) {
    }
    settingsUiState.panel = null;
  }
  function buildSettingsPanel() {
    disposeSettingsPanel();
    var esc = function(v) {
      return String(v === void 0 || v === null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };
    var s = readSettings();
    var schema = typeof SETTINGS_SCHEMA === "undefined" ? [] : SETTINGS_SCHEMA;
    var body = "";
    for (var i = 0; i < schema.length; i += 1) body += renderKind(schema[i], s[schema[i].key], esc);
    var panel = document.createElement("div");
    panel.className = "lg-ces-set";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "\u63A8\u7406\u7B49\u7EA7\u6ED1\u6761 \xB7 \u8BBE\u7F6E");
    panel.setAttribute("tabindex", "-1");
    panel.style.display = "none";
    panel.innerHTML = '<div class="lg-ces-set__title">\u6ED1\u6761\u8BBE\u7F6E</div><div class="lg-ces-set__row" data-lg-ces-system></div>' + body + '<div class="lg-ces-set__actions"><button type="button" data-lg-ces-trace>\u590D\u5236\u8BCA\u65AD</button><button type="button" data-lg-ces-reset>\u6062\u590D\u9ED8\u8BA4</button><button type="button" data-lg-ces-close>\u5173\u95ED</button></div>';
    var applyFromInput = function(input) {
      var key = input.getAttribute("data-lg-ces-key");
      if (!key) return;
      var schema2 = typeof SETTINGS_SCHEMA === "undefined" ? [] : SETTINGS_SCHEMA;
      var item = null;
      for (var i2 = 0; i2 < schema2.length; i2 += 1) if (schema2[i2].key === key) {
        item = schema2[i2];
        break;
      }
      if (item === null) return;
      var patch = {};
      if (item.kind === "switch") patch[key] = input.checked === true;
      else if (item.kind === "range") patch[key] = parseFloat(input.value) / (item.scale || 1);
      else patch[key] = input.value;
      writeSettings(patch);
      syncSettingsPanel();
    };
    panel.addEventListener("input", function(event) {
      applyFromInput(event.target);
    });
    panel.addEventListener("click", function(event) {
      var el = event.target;
      if (!el || typeof el.hasAttribute !== "function") return;
      if (el.hasAttribute("data-lg-ces-trace")) {
        var txt = dumpTrace();
        var btn = el;
        try {
          if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(txt);
            btn.textContent = "\u5DF2\u590D\u5236 \u2713";
          } else {
            btn.textContent = "\u65E0\u6CD5\u590D\u5236";
          }
        } catch (error) {
          btn.textContent = "\u65E0\u6CD5\u590D\u5236";
        }
        setTimeout(function() {
          btn.textContent = "\u590D\u5236\u8BCA\u65AD";
        }, 1500);
      }
      if (el.hasAttribute("data-lg-ces-reset")) {
        writeSettings(schemaDefaults());
        syncSettingsPanel();
      }
      if (el.hasAttribute("data-lg-ces-close")) closeSettingsPanel();
    });
    panel.addEventListener("mousedown", function(event) {
      event.stopPropagation();
    });
    document.body.appendChild(panel);
    settingsUiState.panel = panel;
    return panel;
  }
  function syncSettingsPanel() {
    var panel = settingsUiState.panel;
    if (!panel) return;
    var s = readSettings();
    var schema = typeof SETTINGS_SCHEMA === "undefined" ? [] : SETTINGS_SCHEMA;
    for (var i = 0; i < schema.length; i += 1) {
      var item = schema[i];
      var input = panel.querySelector('[data-lg-ces-key="' + item.key + '"]');
      if (item.kind === "radio") {
        var radios = panel.querySelectorAll('[data-lg-ces-key="' + item.key + '"]');
        for (var r = 0; r < radios.length; r += 1) radios[r].checked = radios[r].value === s[item.key];
      } else if (item.kind === "switch" && input) {
        input.checked = s[item.key] === true;
      } else if (item.kind === "range" && input) {
        var shown = String(Math.round((s[item.key] || 0) * (item.scale || 1)));
        if (input.value !== shown) input.value = shown;
        input.disabled = item.dependsOn ? s[item.dependsOn] !== true : false;
        var label = panel.querySelector('[data-lg-ces-val="' + item.key + '"]');
        if (label) label.textContent = input.disabled ? "\u5DF2\u5173\u95ED" : shown + (item.unit || "");
      }
    }
    var sys = panel.querySelector("[data-lg-ces-system]");
    if (sys) sys.textContent = "\u52A8\u6548\u540C\u65F6\u9075\u5FAA Liquid Glass \u52A8\u6548\u8BBE\u7F6E\u4E0E\u7CFB\u7EDF\u51CF\u5C11\u52A8\u6001\u6548\u679C";
  }
  function closeSettingsPanel() {
    var panel = settingsUiState.panel;
    if (!panel || panel.style.display === "none") return;
    panel.style.display = "none";
    try {
      if (settingsUiState.anchorEl && typeof settingsUiState.anchorEl.focus === "function") settingsUiState.anchorEl.focus();
    } catch (error) {
    }
  }
  function openSettingsPanel(rect, anchorEl) {
    try {
      if (typeof document === "undefined" || !document.body) return;
      var panel = buildSettingsPanel();
      syncSettingsPanel();
      panel.style.display = "block";
      settingsUiState.anchorEl = anchorEl || null;
      var width = panel.offsetWidth || 280;
      var height = panel.offsetHeight || 200;
      var x = rect ? rect.left : 40;
      var y = rect ? rect.bottom + 6 : 80;
      var maxX = (window.innerWidth || 1024) - width - 8;
      var maxY = (window.innerHeight || 768) - height - 8;
      panel.style.left = Math.max(8, Math.min(x, maxX)) + "px";
      panel.style.top = Math.max(8, Math.min(y, maxY)) + "px";
      try {
        panel.focus();
      } catch (error) {
      }
    } catch (error) {
    }
  }
  function isOurSlider(node) {
    return !!(node && typeof node.closest === "function" && node.closest(".lg-ces-inline"));
  }
  var settingsListeners = [];
  function listenSettings(target, type, listener, capture) {
    target.addEventListener(type, listener, capture);
    settingsListeners.push(function() {
      target.removeEventListener(type, listener, capture);
    });
  }
  function dispose() {
    settingsListeners.splice(0).forEach(function(release) {
      release();
    });
    clearTimeout(settingsUiState.longPressTimer);
    settingsUiState.panel?.remove();
    document.querySelector('style[data-plugin-css="' + STYLE_MARKER + '"]')?.remove();
    delete document.__lgCesSettingsUiInstalled;
    settingsUiState = { installed: false, panel: null, longPressTimer: null, longPressOrigin: null, anchorEl: null, cacheListenerInstalled: false };
    settingsCache = null;
    traceClear();
  }
  function installSettingsUi() {
    if (typeof document === "undefined" || !document.addEventListener) return;
    if (settingsUiState.installed) return;
    settingsUiState.installed = true;
    if (settingsUiState.cacheListenerInstalled !== true) {
      settingsUiState.cacheListenerInstalled = true;
      try {
        if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
          listenSettings(window, settingsEventName(), function() {
            cacheSet(null);
          });
        }
      } catch (error) {
      }
    }
    if (document.__lgCesSettingsUiInstalled === true) return;
    document.__lgCesSettingsUiInstalled = true;
    listenSettings(document, "contextmenu", function(event) {
      if (!isOurSlider(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      var host = event.target.closest(".lg-ces-inline");
      openSettingsPanel(host.getBoundingClientRect(), host);
    }, true);
    listenSettings(document, "pointerdown", function(event) {
      if (!isOurSlider(event.target)) return;
      var host = event.target.closest(".lg-ces-inline");
      clearTimeout(settingsUiState.longPressTimer);
      settingsUiState.longPressOrigin = { x: event.clientX, y: event.clientY };
      settingsUiState.longPressTimer = setTimeout(function() {
        settingsUiState.longPressTimer = null;
        openSettingsPanel(host.getBoundingClientRect(), host);
      }, 600);
    }, true);
    var cancelLongPress = function() {
      if (!settingsUiState.longPressTimer) return;
      clearTimeout(settingsUiState.longPressTimer);
      settingsUiState.longPressTimer = null;
    };
    listenSettings(document, "pointermove", function(event) {
      var origin = settingsUiState.longPressOrigin;
      if (!origin) return;
      if (Math.abs((event.clientX || 0) - origin.x) > 6 || Math.abs((event.clientY || 0) - origin.y) > 6) cancelLongPress();
    }, true);
    listenSettings(document, "pointerup", cancelLongPress, true);
    listenSettings(document, "pointercancel", cancelLongPress, true);
    listenSettings(document, "keydown", function(event) {
      var isMenuKey = event.shiftKey && event.key === "F10" || event.key === "ContextMenu";
      if (!isMenuKey) return;
      var active = document.activeElement;
      if (!isOurSlider(active)) return;
      event.preventDefault();
      openSettingsPanel(active.getBoundingClientRect(), active);
    }, true);
    listenSettings(document, "keydown", function(event) {
      if (event.key === "Escape") closeSettingsPanel();
    }, true);
    listenSettings(document, "mousedown", function(event) {
      var panel = settingsUiState.panel;
      if (!panel || panel.style.display === "none") return;
      if (panel.contains(event.target)) return;
      if (isOurSlider(event.target)) return;
      closeSettingsPanel();
    }, true);
  }
  var EMPTY_SNAPSHOT = Object.freeze({
    current: null,
    groups: [],
    failures: [],
    status: "idle",
    pending: null,
    error: null,
    retainedEffort: void 0
  });
  function modelOf(state) {
    var current = state && state.current;
    if (!current || typeof current.provider !== "string" || typeof current.model !== "string") return null;
    var groups = state && Array.isArray(state.groups) ? state.groups : [];
    for (var i = 0; i < groups.length; i += 1) {
      var group = groups[i];
      if (!group || group.id !== current.provider) continue;
      var models = Array.isArray(group.models) ? group.models : [];
      for (var j = 0; j < models.length; j += 1) {
        if (models[j] && models[j].id === current.model) return models[j];
      }
    }
    return null;
  }
  function levelsOf(state) {
    var model = modelOf(state);
    var efforts = model && model.reasoning && Array.isArray(model.reasoning.efforts) ? model.reasoning.efforts : [];
    var out = [];
    for (var i = 0; i < efforts.length; i += 1) {
      var effort = efforts[i];
      if (!effort || typeof effort.id !== "string" || effort.id.length === 0) continue;
      out.push({
        id: effort.id,
        name: typeof effort.name === "string" && effort.name.length > 0 ? effort.name : effort.id
      });
    }
    return out;
  }
  function resolveLevels(liveLevels, liveKey, cache) {
    if (liveLevels.length > 0) {
      cache.key = liveKey;
      cache.levels = liveLevels;
      return liveLevels;
    }
    var sameModel = liveKey === null || cache.key === null || liveKey === cache.key;
    if (cache.levels.length > 0 && sameModel) return cache.levels;
    return liveLevels;
  }
  function effectiveEffortId(state) {
    var current = state && state.current;
    if (current && typeof current.reasoningEffort === "string" && current.reasoningEffort.length > 0) {
      return current.reasoningEffort;
    }
    var model = modelOf(state);
    var fallback = model && model.reasoning && model.reasoning.defaultEffort;
    return typeof fallback === "string" && fallback.length > 0 ? fallback : null;
  }
  function indexOfLevel(levels, id) {
    if (typeof id !== "string") return -1;
    for (var i = 0; i < levels.length; i += 1) if (levels[i].id === id) return i;
    return -1;
  }
  function clamp01(value) {
    if (!(value > 0)) return 0;
    return value > 1 ? 1 : value;
  }
  function indexFromPct(pct, count) {
    if (count <= 1) return 0;
    return Math.max(0, Math.min(count - 1, Math.round(clamp01(pct) * (count - 1))));
  }
  function pctFromIndex(index, count) {
    if (count <= 0) return 0;
    if (count === 1) return 1;
    var safe = Math.max(0, Math.min(count - 1, index));
    return safe / (count - 1);
  }
  var DETENT_THIRD = 1 / 3;
  function detentTargetIndex(pos, cur, count, third) {
    if (count <= 1) return 0;
    var th = typeof third === "number" && third > 0 && third < 0.5 ? third : 1 / 3;
    var lo = Math.max(0, Math.min(count - 1, typeof cur === "number" ? cur : 0));
    var p = Math.max(0, Math.min(count - 1, pos));
    if (p >= lo + th) return Math.min(count - 1, Math.max(lo + 1, Math.round(p)));
    if (p <= lo - (1 - th)) return Math.max(0, Math.min(lo - 1, Math.round(p)));
    return lo;
  }
  var MOTION = {
    K: 20,
    // 位置→速度映射增益（1/s）
    A: 120,
    // 刹车斜率（pct/s²）：只作速度上限；反向滑行 ≈ v²/(2A)
    k: 40,
    // 速度跟踪增益（1/s）
    amax: 240,
    // 加速度上限（pct/s²，安全阀）
    vmax: 6,
    // 速度上限（pct/s）
    epsX: 15e-4,
    // 到位判定：位置误差阈值
    epsV: 0.02
    // 到位判定：速度阈值
  };
  var MOTION_REDUCED = {
    K: 40,
    A: 300,
    k: 40,
    amax: 200,
    vmax: 7,
    epsX: 15e-4,
    epsV: 0.02
  };
  var MOTION_FAST = {
    K: 60,
    A: 500,
    k: 60,
    amax: 300,
    vmax: 10,
    epsX: 15e-4,
    epsV: 0.02
  };
  var RELEASE_PROJECT_S = 0;
  var POINTER_SPEED_EMA = 0.4;
  var POINTER_STALE_S = 2 / 60;
  var POINTER_SPEED_TAU = 0.03;
  var MAX_FRAME_DT = 0.05;
  function clampAbs(value, limit) {
    if (value > limit) return limit;
    return value < -limit ? -limit : value;
  }
  function motionStep(m, dt, p) {
    var e = m.target - m.x;
    var vAbs = p.K * Math.abs(e);
    var brake = Math.sqrt(2 * p.A * Math.abs(e));
    if (brake < vAbs) vAbs = brake;
    if (vAbs > p.vmax) vAbs = p.vmax;
    var vDesired = e > 0 ? vAbs : e < 0 ? -vAbs : 0;
    m.a = clampAbs(p.k * (vDesired - m.v), p.amax);
    m.v = clampAbs(m.v + m.a * dt, p.vmax);
    if (e !== 0 && Math.abs(m.v * dt) >= Math.abs(e)) {
      m.x = m.target;
      m.v = 0;
      m.a = 0;
      return m;
    }
    var xRaw = m.x + m.v * dt;
    var xClamped = xRaw < 0 ? 0 : xRaw > 1 ? 1 : xRaw;
    if (xClamped !== xRaw && (xClamped === 0 && m.v < 0 || xClamped === 1 && m.v > 0)) {
      m.v = 0;
      m.a = 0;
    }
    m.x = xClamped;
    if (motionSettled(m, p)) {
      m.x = m.target;
      m.v = 0;
      m.a = 0;
    }
    return m;
  }
  function motionSettled(m, p) {
    return Math.abs(m.target - m.x) < p.epsX && Math.abs(m.v) < p.epsV;
  }
  function decayPointerSpeed(vPtr, sinceS, staleS, tau) {
    if (!(sinceS > staleS)) return vPtr;
    return vPtr * Math.exp(-(sinceS - staleS) / tau);
  }
  function releaseIndexFor(targetPct, vPtr, count) {
    return indexFromPct(clamp01(targetPct + vPtr * RELEASE_PROJECT_S), count);
  }
  function scheduleFrame(cb) {
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      return { raf: true, id: window.requestAnimationFrame(cb) };
    }
    return { raf: false, id: setTimeout(function() {
      cb(nowMs());
    }, 16) };
  }
  function cancelFrame(handle) {
    if (!handle) return;
    if (handle.raf) {
      if (typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(handle.id);
      }
    } else {
      clearTimeout(handle.id);
    }
  }
  function nowMs() {
    return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
  }
  function errorText(error) {
    if (error === null || error === void 0) return "\u6863\u4F4D\u5207\u6362\u5931\u8D25";
    if (typeof error === "string") return error;
    if (typeof error.message === "string" && error.message.length > 0) return error.message;
    if (typeof error.code === "string" && error.code.length > 0) return error.code;
    return String(error);
  }
  var PARTICLES = (function buildParticles() {
    var count = 22;
    var out = [];
    var i;
    for (i = 0; i < count; i += 1) {
      out.push({ y: 0, phase: (i + 1) * GOLDEN_RATIO % 1 });
    }
    var byPhase = [];
    for (i = 0; i < count; i += 1) byPhase.push(i);
    byPhase.sort(function(a, b) {
      return out[a].phase - out[b].phase;
    });
    var slots = null;
    for (var salt = 71; salt < 4e3 && slots === null; salt += 1) {
      var candidate = [];
      for (i = 0; i < count; i += 1) candidate.push(i);
      candidate.sort(function(a, b) {
        var ha = starHash01(a, salt);
        var hb = starHash01(b, salt);
        return ha === hb ? a - b : ha - hb;
      });
      var ok = true;
      for (var k = 1; k < count && ok; k += 1) {
        if (Math.abs(candidate[k] - candidate[k - 1]) < MIN_HEIGHT_SLOTS) ok = false;
      }
      if (ok) slots = candidate;
    }
    if (slots === null) {
      slots = [];
      for (i = 0; i < count; i += 1) slots.push(i * 5 % count);
    }
    for (var rank = 0; rank < count; rank += 1) {
      out[byPhase[rank]].y = 8 + slots[rank] / (count - 1) * 84;
    }
    return out;
  })();
  function mixColor(from, to, t) {
    var k = clamp01(t);
    return [
      Math.round(from[0] + (to[0] - from[0]) * k),
      Math.round(from[1] + (to[1] - from[1]) * k),
      Math.round(from[2] + (to[2] - from[2]) * k)
    ];
  }
  function rgbOf(color) {
    return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
  }
  function fillColorFor(pct) {
    var t = clamp01(pct);
    if (t <= ENERGY_START) return rgbOf(COLOR_BLUE);
    if (t <= ENERGY_END) return rgbOf(mixColor(COLOR_BLUE, COLOR_VIOLET, (t - ENERGY_START) / (ENERGY_END - ENERGY_START)));
    return rgbOf(mixColor(COLOR_VIOLET, COLOR_DEEP, (t - ENERGY_END) / (1 - ENERGY_END)));
  }
  function fillBackgroundFor(pct) {
    return "linear-gradient(90deg, " + rgbOf(COLOR_BLUE) + ", " + fillColorFor(pct) + ")";
  }
  function valueColorFor(pct, level) {
    if (isOffLevel(level)) return "";
    return rgbOf(mixColor(COLOR_BLUE, COLOR_TEXT_VIOLET, energyFor(pct)));
  }
  function isOffLevel(level) {
    if (!level) return false;
    var candidates = [level.id, level.name];
    for (var i = 0; i < candidates.length; i += 1) {
      if (typeof candidates[i] !== "string") continue;
      var flat = candidates[i].replace(/\s+/g, "").toLowerCase();
      if (flat === "off" || flat === "none" || flat === "\u5173\u95ED" || flat === "\u65E0") return true;
    }
    return false;
  }
  function energyFor(pct) {
    return clamp01((clamp01(pct) - ENERGY_START) / (1 - ENERGY_START));
  }
  function speedFor(pct) {
    return Math.min(2, Math.max(0.35, 3 * clamp01(pct) - 1));
  }
  function particleCountFor(pct) {
    return Math.round(energyFor(pct) * PARTICLES.length);
  }
  function starHash01(index, salt) {
    var value = (index + 1) * salt * 2654435761 % 4294967296;
    return (value >>> 8) % 1e3 / 1e3;
  }
  function starBrightnessFor(index) {
    return STARFIELD_MIN + (1 - STARFIELD_MIN) * starHash01(index, 61);
  }
  function starDurationFor(index, speedFactor) {
    var speed = Math.min(MAX_SPEED_FACTOR, Math.max(0.35, typeof speedFactor === "number" ? speedFactor : MAX_SPEED_FACTOR));
    var spread = 1 - STARFIELD_DURATION_SPREAD + 2 * STARFIELD_DURATION_SPREAD * starHash01(index, 29);
    return STARFIELD_DURATION_MEAN * MAX_SPEED_FACTOR / speed * spread;
  }
  function starDelayFor(index, duration) {
    var particle = PARTICLES[index];
    var phase = particle && typeof particle.phase === "number" ? particle.phase : 0;
    var jitter = starHash01(index, 53) * 0.03;
    return -((phase + jitter) % 1) * duration;
  }
  function starCountFor(pct) {
    return particleCountFor(pct);
  }
  function starLayerOpacityFor(pct) {
    return 0.6 + 0.4 * energyFor(pct);
  }
  function knobOffsetOf(pct) {
    var t = Math.round(clamp01(pct) * 1e4) / 1e4;
    return "calc(" + KNOB_RADIUS + "px + " + t + " * (100% - " + KNOB_RADIUS * 2 + "px))";
  }
  function createDirectoryAccess(ctx, sessionId, timers) {
    var listeners = /* @__PURE__ */ new Set();
    var directory = null;
    var unsubscribe = null;
    var last = EMPTY_SNAPSHOT;
    var retryIndex = 0;
    var retryTimer = null;
    var closed = false;
    var lastLoadAt = 0;
    function notify() {
      var current = [];
      listeners.forEach(function(listener) {
        current.push(listener);
      });
      for (var i = 0; i < current.length; i += 1) {
        try {
          current[i]();
        } catch (error) {
        }
      }
    }
    function scheduleRetry() {
      if (closed || retryTimer !== null || retryIndex >= RETRY_DELAYS.length) return;
      var delay = RETRY_DELAYS[retryIndex];
      retryIndex += 1;
      retryTimer = timers.set(function() {
        retryTimer = null;
        if (resolve() !== null) {
          notify();
          return;
        }
        scheduleRetry();
      }, delay);
    }
    function resolve() {
      if (closed) return null;
      var fresh = null;
      try {
        fresh = ctx.modelDirectories.directoryFor(sessionId);
      } catch (error) {
        fresh = null;
      }
      if (!fresh || !fresh.store || typeof fresh.store.getSnapshot !== "function") fresh = null;
      if (fresh === directory) return directory;
      if (unsubscribe !== null) {
        try {
          unsubscribe();
        } catch (error) {
        }
        unsubscribe = null;
      }
      directory = fresh;
      if (directory !== null) {
        retryIndex = 0;
        try {
          unsubscribe = typeof directory.store.subscribe === "function" ? directory.store.subscribe(notify) : null;
        } catch (error) {
          unsubscribe = null;
        }
        kickLoad();
      }
      return directory;
    }
    function kickLoad() {
      if (closed || directory === null || typeof directory.load !== "function") return;
      var now = Date.now();
      if (now - lastLoadAt < 400) return;
      lastLoadAt = now;
      var target = directory;
      try {
        Promise.resolve(target.load()).catch(function() {
        });
      } catch (error) {
      }
    }
    return {
      getSnapshot: function() {
        if (closed) return EMPTY_SNAPSHOT;
        if (directory === null) {
          resolve();
          if (directory === null) scheduleRetry();
        }
        if (directory !== null) {
          try {
            var value = directory.store.getSnapshot();
            if (value && typeof value === "object") last = value;
          } catch (error) {
          }
        }
        return last;
      },
      subscribe: function(listener) {
        if (closed) return function() {
        };
        listeners.add(listener);
        if (directory === null) {
          resolve();
          if (directory === null) scheduleRetry();
        }
        return function() {
          listeners.delete(listener);
        };
      },
      /** 取当前真正可写的目录（load/select 在调用时重新解析，避免用失效实例）。 */
      directory: function() {
        var fresh = resolve();
        return fresh !== null ? fresh : directory;
      },
      load: kickLoad,
      dispose: function() {
        closed = true;
        listeners.clear();
        if (retryTimer !== null) {
          try {
            timers.clear(retryTimer);
          } catch (error) {
          }
          retryTimer = null;
        }
        if (unsubscribe !== null) {
          try {
            unsubscribe();
          } catch (error) {
          }
          unsubscribe = null;
        }
        directory = null;
      }
    };
  }
  function firstSpanText(row) {
    try {
      var spans = row.querySelectorAll("span");
      for (var i = 0; i < spans.length; i += 1) {
        var text2 = spans[i].textContent;
        if (typeof text2 === "string" && text2.length > 0) return text2;
      }
    } catch (error) {
    }
    return "";
  }
  function findValueElement(row) {
    if (!row || typeof row.querySelectorAll !== "function") return null;
    try {
      var byClass = row.querySelectorAll("span[class*='cellValue']");
      if (byClass.length > 0) return byClass[byClass.length - 1];
      var spans = row.querySelectorAll("span");
      var found = null;
      for (var i = 0; i < spans.length; i += 1) {
        var text2 = spans[i].textContent;
        if (typeof text2 === "string" && text2.replace(/\s+/g, "").length > 0) found = spans[i];
      }
      return found;
    } catch (error) {
      return null;
    }
  }
  function findSeatEffort(doc, composer, expectedLabels) {
    if (!doc || !composer || typeof doc.querySelectorAll !== "function") return null;
    var list = typeof expectedLabels === "string" ? [expectedLabels] : expectedLabels;
    if (Object.prototype.toString.call(list) !== "[object Array]") return null;
    var wanted = [];
    for (var n = 0; n < list.length; n += 1) {
      var name = typeof list[n] === "string" ? list[n].replace(/\s+/g, "") : "";
      if (name.length > 0 && wanted.indexOf(name) < 0) wanted.push(name);
    }
    if (wanted.length === 0) return null;
    try {
      var seats = composer.querySelectorAll('button[aria-haspopup="menu"]');
      for (var i = 0; i < seats.length; i += 1) {
        if (!composer.contains(seats[i])) continue;
        var spans = seats[i].querySelectorAll("span");
        for (var j = 0; j < spans.length; j += 1) {
          var text2 = spans[j].textContent;
          if (typeof text2 === "string" && wanted.indexOf(text2.replace(/\s+/g, "")) >= 0) return spans[j];
        }
      }
    } catch (error) {
      return null;
    }
    return null;
  }
  function findEffortRow(doc, composer) {
    if (!doc || !composer || typeof doc.querySelectorAll !== "function") return null;
    var seats = composer.querySelectorAll('button[aria-haspopup="menu"][aria-expanded="true"]');
    var seat = null;
    for (var i = 0; i < seats.length; i += 1) {
      if (composer.contains(seats[i])) {
        seat = seats[i];
        break;
      }
    }
    if (seat === null) return null;
    var menuId = typeof seat.getAttribute === "function" ? seat.getAttribute("aria-controls") : null;
    var menu = menuId && typeof doc.getElementById === "function" ? doc.getElementById(menuId) : null;
    if (!menu) return null;
    var items = menu.querySelectorAll('button[role="menuitem"]');
    if (items.length !== 2) return null;
    for (var j = 0; j < items.length; j += 1) {
      var label = firstSpanText(items[j]);
      for (var k = 0; k < EFFORT_ROW_LABELS.length; k += 1) {
        if (label === EFFORT_ROW_LABELS[k]) return items[j];
      }
    }
    return items[1];
  }
  function createMenuBridge(options) {
    var doc = options.doc;
    var win = options.win;
    var anchor = options.anchor;
    var active = options.active;
    var onChange = options.onChange;
    if (!doc || typeof doc.createElement !== "function") return null;
    var current = null;
    var seat = null;
    var seatColor = "";
    var observer = null;
    var timer = null;
    var disposed = false;
    var cancelScan = null;
    var menuObserver = null;
    var observedMenu = null;
    function scheduleScan() {
      if (cancelScan || disposed) return;
      var cancelled = false;
      cancelScan = function() {
        cancelled = true;
      };
      queueMicrotask(function() {
        cancelScan = null;
        if (!cancelled && !disposed) scan();
      });
    }
    function observeMenu(composer) {
      var trigger = composer && composer.querySelector('button[aria-haspopup="menu"][aria-expanded="true"]');
      var menu = trigger && doc.getElementById(trigger.getAttribute("aria-controls"));
      if (menu === observedMenu) return;
      menuObserver?.disconnect();
      observedMenu = menu;
      if (!menu) return;
      menuObserver = new win.MutationObserver(scheduleScan);
      menuObserver.observe(menu, { childList: true, subtree: true });
    }
    var seatLabels = options.seatLabels;
    function composerOf() {
      var node = anchor();
      if (!node) return null;
      var el = node;
      while (el && el.nodeType === 1) {
        if (typeof el.getAttribute === "function" && el.getAttribute("data-composer-card") !== null) return el;
        el = el.parentNode;
      }
      return null;
    }
    function detach() {
      if (current === null) return;
      var row = current.row;
      var container = current.container;
      try {
        if (container && container.parentNode) container.parentNode.removeChild(container);
      } catch (error) {
      }
      try {
        var previous = current.previous;
        if (row && row.style) {
          row.style.height = previous.height;
          row.style.flexWrap = previous.flexWrap;
          row.style.paddingTop = previous.paddingTop;
          row.style.paddingBottom = previous.paddingBottom;
          row.style.boxShadow = previous.boxShadow;
        }
        if (current.value && current.value.style) current.value.style.color = previous.valueColor;
      } catch (error) {
      }
      current = null;
      onChange(null);
    }
    function releaseSeat() {
      if (seat === null) return;
      try {
        if (seat.el && seat.el.style) seat.el.style.color = seat.previousColor;
      } catch (error) {
      }
      seat = null;
    }
    function syncSeat() {
      var composer = composerOf();
      if (composer === null || active() !== true) {
        releaseSeat();
        return;
      }
      if (seat !== null && seat.el && doc.documentElement && doc.documentElement.contains(seat.el)) {
        if (seatColor && seat.el.style) seat.el.style.color = seatColor;
        return;
      }
      releaseSeat();
      var wanted = typeof seatLabels === "function" ? seatLabels() : null;
      var el = findSeatEffort(doc, composer, wanted);
      if (el === null || !el.style) return;
      seat = { el, previousColor: el.style.color || "" };
      if (seatColor) el.style.color = seatColor;
    }
    function scan() {
      if (disposed) return;
      observeMenu(composerOf());
      try {
        syncSeat();
      } catch (error) {
      }
      try {
        var composer = composerOf();
        if (composer === null || active() !== true) {
          detach();
          return;
        }
        if (current !== null && current.row && doc.documentElement && doc.documentElement.contains(current.row)) return;
        var row = findEffortRow(doc, composer);
        if (row === null) {
          detach();
          return;
        }
        detach();
        var value = findValueElement(row);
        var previous = {
          // 真实 DOM 里未设置的内联属性读作 ""，这里统一成同样的语义，还原时才不会写回
          // 字面量 "undefined"（那在浏览器里是无效值，会把我们的加高留在原地）。
          height: row.style.height || "",
          flexWrap: row.style.flexWrap || "",
          paddingTop: row.style.paddingTop || "",
          paddingBottom: row.style.paddingBottom || "",
          boxShadow: row.style.boxShadow || "",
          // 数值文字原来的内联颜色（通常没设过，读作 ""）
          valueColor: value && value.style ? value.style.color || "" : ""
        };
        row.style.height = "auto";
        row.style.flexWrap = "wrap";
        row.style.paddingTop = ROW_PADDING_BLOCK;
        row.style.paddingBottom = ROW_PADDING_BLOCK;
        var container = doc.createElement("div");
        container.className = "lg-ces-inline";
        container.setAttribute("data-lg-ces-part", "host");
        container.style.minHeight = TRACK_HEIGHT + 2 + "px";
        row.appendChild(container);
        current = { row, container, value, previous };
        onChange(current);
        try {
          win.dispatchEvent(new win.Event("resize"));
        } catch (error) {
        }
      } catch (error) {
        try {
          detach();
        } catch (inner) {
        }
      }
    }
    function start() {
      scan();
      var MO = win && (win.MutationObserver || (typeof MutationObserver === "function" ? MutationObserver : null));
      if (typeof MO === "function") {
        try {
          observer = new MO(scheduleScan);
          observer.observe(doc.body || doc.documentElement, { childList: true });
          var composer = composerOf();
          if (composer) observer.observe(composer, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-expanded", "aria-controls"] });
          return;
        } catch (error) {
          observer = null;
        }
      }
      if (win && typeof win.setInterval === "function") timer = win.setInterval(scan, 400);
    }
    return {
      scan,
      start,
      /** 组件把当前该用的颜色给进来；桥负责在（重新）抓到元素时立刻应用。 */
      setSeatColor: function(color) {
        seatColor = typeof color === "string" ? color : "";
        if (seat !== null && seat.el && seat.el.style) {
          try {
            seat.el.style.color = seatColor;
          } catch (error) {
          }
        }
      },
      dispose: function() {
        disposed = true;
        cancelScan?.();
        menuObserver?.disconnect();
        if (observer !== null) {
          try {
            observer.disconnect();
          } catch (error) {
          }
          observer = null;
        }
        if (timer !== null) {
          try {
            win.clearInterval(timer);
          } catch (error) {
          }
          timer = null;
        }
        releaseSeat();
        detach();
      },
      host: function() {
        return current;
      }
    };
  }
  function CodexEffortSlider(props) {
    var sessionId = typeof props.sessionId === "string" && props.sessionId.length > 0 ? props.sessionId : null;
    var locked = props.locked === true;
    var ctx = props.__ctx;
    var instanceRef = React9.useRef(null);
    if (instanceRef.current === null) instanceRef.current = ++__lgCesInstanceSeq;
    var __lgCesInstanceId = instanceRef.current;
    var levelsCacheRef = React9.useRef({ key: null, levels: [] });
    var reducedMotion = props.reducedMotion === true || props.motion === "off";
    var effectiveReducedMotion = reducedMotion || props.motion === "soft" || motionMode() === "quick";
    var settingsTick = React9.useState(0);
    React9.useEffect(function() {
      installSettingsUi();
      var bump = function() {
        settingsTick[1](function(n2) {
          return n2 + 1;
        });
      };
      if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
        window.addEventListener(settingsEventName(), bump);
      }
      return function() {
        if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
          window.removeEventListener(settingsEventName(), bump);
        }
      };
    }, []);
    var buttonDownRef = React9.useRef(false);
    var effectivePctRef = React9.useRef(0);
    var holdFramesRef = React9.useRef(0);
    var lastCommittedIndexRef = React9.useRef(-1);
    var releaseGenRef = React9.useRef(0);
    var lastValidIndexRef = React9.useRef(0);
    var levelsRef = React9.useRef([]);
    var endDragRef = React9.useRef(null);
    var detentIndexRef = React9.useRef(-1);
    React9.useEffect(function() {
      if (typeof window === "undefined" || typeof window.addEventListener !== "function") return void 0;
      var stopDrag = function() {
        buttonDownRef.current = false;
        if (draggingRef.current && typeof endDragRef.current === "function") endDragRef.current();
      };
      window.addEventListener("pointerup", stopDrag, true);
      window.addEventListener("pointercancel", stopDrag, true);
      return function() {
        window.removeEventListener("pointerup", stopDrag, true);
        window.removeEventListener("pointercancel", stopDrag, true);
      };
    }, []);
    var access = React9.useMemo(
      function() {
        if (sessionId === null || !ctx) return null;
        return createDirectoryAccess(ctx, sessionId, {
          set: function(fn, delay) {
            return setTimeout(fn, delay);
          },
          clear: function(handle) {
            clearTimeout(handle);
          }
        });
      },
      [ctx, sessionId]
    );
    React9.useEffect(function() {
      return function() {
        if (access !== null) access.dispose();
      };
    }, [access]);
    var subscribe = React9.useCallback(
      function(onChange) {
        return access === null ? function() {
        } : access.subscribe(onChange);
      },
      [access]
    );
    var getSnapshot = React9.useCallback(
      function() {
        return access === null ? EMPTY_SNAPSHOT : access.getSnapshot();
      },
      [access]
    );
    var state = React9.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    var liveLevels = levelsOf(state);
    var liveLevelKey = state && state.current && typeof state.current.provider === "string" && typeof state.current.model === "string" ? state.current.provider + "\0" + state.current.model : null;
    var levels = resolveLevels(liveLevels, liveLevelKey, levelsCacheRef.current);
    var levelsCacheUsed = liveLevels.length === 0 && levels.length > 0;
    if (levelsCacheUsed !== __levelsCacheHit) {
      __levelsCacheHit = levelsCacheUsed;
      tracePush({ k: "levels-cache", hit: levelsCacheUsed, n: levels.length, emptyLive: liveLevels.length === 0 });
    }
    var effectiveId = effectiveEffortId(state);
    var committedIndex = indexOfLevel(levels, effectiveId);
    var levelCount = levels.length;
    var draftState = React9.useState(null);
    var draft = draftState[0];
    var setDraft = draftState[1];
    var optimisticState = React9.useState(null);
    var optimistic = optimisticState[0];
    var setOptimistic = optimisticState[1];
    var errorState = React9.useState(null);
    var errorText_ = errorState[0];
    var setError = errorState[1];
    var busyState = React9.useState(false);
    var busy = busyState[0];
    var setBusy = busyState[1];
    var hostState = React9.useState(null);
    var host = hostState[0];
    var setHost = hostState[1];
    var anchorRef = React9.useRef(null);
    var trackRef = React9.useRef(null);
    var optimisticIdRef = React9.useRef(null);
    var draftRef = React9.useRef(null);
    var commitRef = React9.useRef({ timer: null, inFlight: false, queued: null, safetyTimer: null });
    var draggingRef = React9.useRef(false);
    var levelCountRef = React9.useRef(0);
    var seatNamesRef = React9.useRef([]);
    var bridgeRef = React9.useRef(null);
    levelCountRef.current = levelCount;
    levelsRef.current = levels;
    endDragRef.current = endDrag;
    React9.useEffect(function() {
      if (sessionId === null || !ctx) return void 0;
      var bridge = createMenuBridge({
        doc: typeof document === "undefined" ? null : document,
        win: typeof window === "undefined" ? null : window,
        anchor: function() {
          return anchorRef.current;
        },
        active: function() {
          return levelCountRef.current > 0;
        },
        onChange: function(next) {
          setHost(next);
        },
        // 收起态那一行显示的档位名（官方 trigger 里的文字就是它）；给全部名字更抗"官方还没重渲染"
        seatLabels: function() {
          return seatNamesRef.current;
        }
      });
      if (bridge === null) return void 0;
      bridgeRef.current = bridge;
      bridge.start();
      return function() {
        bridgeRef.current = null;
        bridge.dispose();
      };
    }, [ctx, sessionId]);
    React9.useEffect(function() {
      if (bridgeRef.current !== null) bridgeRef.current.scan();
    }, [levelCount]);
    var optimisticId = optimistic !== null && typeof optimistic.id === "string" ? optimistic.id : null;
    var optimisticIndex = optimisticId === null ? -1 : indexOfLevel(levels, optimisticId);
    if (committedIndex >= 0) lastValidIndexRef.current = committedIndex;
    var midIndex = Math.max(0, Math.min(Math.max(0, levelCount - 1), Math.floor((levelCount - 1) / 2)));
    var lastIdx = lastValidIndexRef.current;
    var fallbackIndex = typeof lastIdx === "number" && lastIdx >= 0 && lastIdx < levelCount ? lastIdx : midIndex;
    var effectiveIndex = committedIndex >= 0 ? committedIndex : fallbackIndex;
    if (optimisticIndex >= 0) effectiveIndex = optimisticIndex;
    var effectivePct = pctFromIndex(effectiveIndex, levelCount);
    effectivePctRef.current = effectivePct;
    var effectiveLevel = levels[effectiveIndex] || null;
    var seatNames = [];
    for (var n = 0; n < levels.length; n += 1) {
      if (levels[n] && typeof levels[n].name === "string" && levels[n].name.length > 0) seatNames.push(levels[n].name);
    }
    seatNamesRef.current = seatNames;
    var shownIndex = draft !== null ? draft.index : effectiveIndex;
    var shownPct = draft !== null && typeof draft.pct === "number" ? draft.pct : effectivePct;
    tracePush({ k: "s", inst: __lgCesInstanceId, t: typeof performance !== "undefined" ? Math.round(performance.now()) : 0, shown: Math.round(shownPct * 1e4) / 1e4, eff: Math.round(effectivePct * 1e4) / 1e4, draft: draft === null ? null : Math.round(draft.pct * 1e4) / 1e4, mode: motionMode() });
    var shownLevel = levels[shownIndex] || null;
    var energy = energyFor(shownPct);
    var energyOn = energy > 0;
    var fillBackground = fillBackgroundFor(shownPct);
    var knobOffset = knobOffsetOf(shownPct);
    React9.useEffect(function() {
      if (host === null || !host.row || !host.row.style) return;
      host.row.style.boxShadow = energyOn ? "inset 0 0 0 1px rgba(168,85,247," + (0.16 + 0.34 * energy).toFixed(2) + ")" : "";
    }, [host, energyOn, energy]);
    React9.useEffect(function() {
      if (host === null || !host.value || !host.value.style) return;
      host.value.style.color = valueColorFor(shownPct, shownLevel);
    }, [host, shownPct, shownLevel]);
    React9.useEffect(function() {
      if (bridgeRef.current === null) return;
      bridgeRef.current.setSeatColor(valueColorFor(effectivePct, effectiveLevel));
    }, [levelCount, effectivePct, effectiveLevel]);
    React9.useEffect(function() {
      if (optimisticId !== null && effectiveId === optimisticId) setOptimistic(null);
    }, [effectiveId, optimisticId]);
    React9.useEffect(function() {
      if (optimisticId === null) return void 0;
      var handle = setTimeout(function() {
        if (optimisticIdRef.current === optimisticId) {
          optimisticIdRef.current = null;
          setOptimistic(null);
          setError("\u6863\u4F4D\u5207\u6362\u8D85\u65F6\uFF0C\u5BBF\u4E3B\u672A\u56DE\u62A5\u7ED3\u679C\uFF08\u5DF2\u56DE\u6EDA\u663E\u793A\uFF09");
        }
      }, COMMIT_DEADLINE_MS);
      return function() {
        clearTimeout(handle);
      };
    }, [optimisticId]);
    React9.useEffect(function() {
      return function() {
        var pending = commitRef.current;
        if (pending.timer !== null) {
          clearTimeout(pending.timer);
          pending.timer = null;
        }
        if (pending.safetyTimer !== null) {
          clearTimeout(pending.safetyTimer);
          pending.safetyTimer = null;
        }
        pending.queued = null;
      };
    }, []);
    function currentState() {
      return access === null ? EMPTY_SNAPSHOT : access.getSnapshot();
    }
    function flush() {
      var pending = commitRef.current;
      if (pending.timer !== null) {
        clearTimeout(pending.timer);
        pending.timer = null;
      }
      var levelId = pending.queued;
      pending.queued = null;
      if (pending.safetyTimer !== null) {
        clearTimeout(pending.safetyTimer);
        pending.safetyTimer = null;
      }
      tracePush({ k: "flush", id: levelId });
      if (levelId === null || levelId === void 0 || access === null) return;
      var snapshot = currentState();
      var current = snapshot && snapshot.current;
      if (!current || typeof current.provider !== "string" || typeof current.model !== "string") {
        setError("\u6A21\u578B\u76EE\u5F55\u5C1A\u672A\u5C31\u7EEA\uFF0C\u65E0\u6CD5\u5199\u5165\u6863\u4F4D");
        return;
      }
      if (effectiveEffortId(snapshot) === levelId) {
        tracePush({ k: "flush-skip", id: levelId, why: "dedupe" });
        return;
      }
      var directory = access.directory();
      if (directory === null || typeof directory.select !== "function") {
        setError("\u6A21\u578B\u76EE\u5F55\u4E0D\u53EF\u7528\uFF0C\u6863\u4F4D\u672A\u5199\u5165");
        return;
      }
      pending.inFlight = true;
      optimisticIdRef.current = levelId;
      setOptimistic({ id: levelId });
      setError(null);
      setBusy(true);
      var result;
      try {
        result = directory.select({
          provider: current.provider,
          model: current.model,
          reasoningEffort: levelId
        });
      } catch (error) {
        result = Promise.reject(error);
      }
      Promise.resolve(result).then(
        function(outcome) {
          pending.inFlight = false;
          tracePush({ k: outcome && outcome.ok === false ? "commit-fail" : "commit-ok" });
          if (outcome && outcome.ok === false) {
            optimisticIdRef.current = null;
            setOptimistic(null);
            setError(errorText(outcome.error));
          }
        },
        function(error) {
          pending.inFlight = false;
          optimisticIdRef.current = null;
          setOptimistic(null);
          setError(errorText(error));
        }
      ).then(function() {
        setBusy(false);
        tracePush({ k: "commit-settle", inFlight: pending.inFlight, queued: pending.queued });
        if (pending.queued !== null) flush();
      });
    }
    function requestCommit(levelId, immediate) {
      if (levelId === null || levelId === void 0) return;
      var pending = commitRef.current;
      var snapshot = currentState();
      if (effectiveEffortId(snapshot) === levelId && pending.queued === null && !pending.inFlight) return;
      pending.queued = levelId;
      tracePush({ k: "req", id: levelId, imm: immediate === true, inFlight: pending.inFlight, queued: pending.queued });
      if (pending.inFlight) {
        if (pending.safetyTimer === null) {
          var armSafety = function() {
            pending.safetyTimer = setTimeout(function() {
              pending.safetyTimer = null;
              if (pending.queued === null) return;
              if (pending.inFlight) {
                armSafety();
                return;
              }
              tracePush({ k: "safety-flush", id: pending.queued });
              flush();
            }, 50);
          };
          armSafety();
        }
        return;
      }
      if (immediate === true) {
        flush();
        return;
      }
      if (pending.timer !== null) return;
      pending.timer = setTimeout(function() {
        pending.timer = null;
        flush();
      }, COMMIT_THROTTLE_MS);
    }
    var motionRef = React9.useRef(null);
    var frameRef = React9.useRef(null);
    var lastTsRef = React9.useRef(0);
    var lastPtrPctRef = React9.useRef(null);
    var lastPointerAtRef = React9.useRef(0);
    var snapIndexRef = React9.useRef(null);
    function motionParams() {
      return motionParamsForMode();
    }
    function ensureMotion() {
      if (motionRef.current === null) {
        var x0 = draftRef.current !== null && typeof draftRef.current.pct === "number" ? draftRef.current.pct : shownPct;
        motionRef.current = { x: x0, v: 0, a: 0, target: x0, vPtr: 0 };
      }
      return motionRef.current;
    }
    function draftIndexFor(m) {
      if (draggingRef.current) return indexFromPct(m.x, levelCount);
      return snapIndexRef.current !== null ? snapIndexRef.current : indexFromPct(m.x, levelCount);
    }
    function publishMotion(m) {
      var next = { pct: m.x, index: draftIndexFor(m) };
      var prev = draftRef.current;
      if (prev !== null && prev.pct === next.pct && prev.index === next.index) return;
      draftRef.current = next;
      setDraft(next);
    }
    React9.useEffect(function() {
      var m = motionRef.current;
      if (m === null) return;
      if (draftRef.current !== null) return;
      m.x = effectivePct;
      m.v = 0;
      m.a = 0;
      m.target = effectivePct;
      m.vPtr = 0;
    }, [effectivePct]);
    function startFrames() {
      if (frameRef.current !== null) return;
      lastTsRef.current = nowMs();
      var step = function(ts) {
        frameRef.current = null;
        var m = motionRef.current;
        if (m === null) return;
        var p = motionParams();
        var dt = Math.min(MAX_FRAME_DT, Math.max(1e-3, (ts - lastTsRef.current) / 1e3));
        lastTsRef.current = ts;
        var sincePointer = (ts - lastPointerAtRef.current) / 1e3;
        m.vPtr = decayPointerSpeed(m.vPtr, sincePointer, POINTER_STALE_S, POINTER_SPEED_TAU);
        motionStep(m, dt, p);
        if (motionSettled(m, p)) {
          m.x = m.target;
          m.v = 0;
          m.a = 0;
          if (draggingRef.current) {
            publishMotion(m);
            frameRef.current = scheduleFrame(step);
            return;
          }
          if (Math.abs(effectivePctRef.current - m.target) > 1e-3 && holdFramesRef.current < 45) {
            holdFramesRef.current += 1;
            draftRef.current = { pct: m.target, index: snapIndexRef.current };
            publishMotion(m);
            frameRef.current = scheduleFrame(step);
            return;
          }
          holdFramesRef.current = 0;
          tracePush({ k: "settle-clear", inst: __lgCesInstanceId, dragging: draggingRef.current, mX: Math.round(m.x * 1e4) / 1e4, mTarget: Math.round(m.target * 1e4) / 1e4 });
          draftRef.current = null;
          snapIndexRef.current = null;
          setDraft(null);
          return;
        }
        publishMotion(m);
        frameRef.current = scheduleFrame(step);
      };
      frameRef.current = scheduleFrame(step);
    }
    function jumpTo(targetPct) {
      var m = ensureMotion();
      m.target = targetPct;
      m.x = targetPct;
      m.v = 0;
      m.a = 0;
      m.vPtr = 0;
    }
    function pctAt(clientX) {
      var track = trackRef.current;
      if (!track || typeof track.getBoundingClientRect !== "function") return null;
      var rect = track.getBoundingClientRect();
      var usable = rect.width - KNOB_RADIUS * 2;
      if (!(usable > 0)) return null;
      return clamp01((clientX - rect.left - KNOB_RADIUS) / usable);
    }
    function swallow(event) {
      if (event && typeof event.stopPropagation === "function") event.stopPropagation();
    }
    function moveTo(clientX) {
      if (levelCount === 0) return;
      var pct = pctAt(clientX);
      if (pct === null) return;
      var m = ensureMotion();
      var now = nowMs();
      var dtPtr = (now - lastPointerAtRef.current) / 1e3;
      if (lastPtrPctRef.current !== null && dtPtr > 1e-3) {
        var raw = (pct - lastPtrPctRef.current) / dtPtr;
        m.vPtr = m.vPtr * (1 - POINTER_SPEED_EMA) + clampAbs(raw, MOTION.vmax) * POINTER_SPEED_EMA;
      }
      lastPtrPctRef.current = pct;
      lastPointerAtRef.current = now;
      var fastMode = motionMode() === "fast";
      if (fastMode) {
        var pos = pct * Math.max(1, levelCount - 1);
        var curDetent = detentIndexRef.current;
        if (!(curDetent >= 0)) curDetent = indexFromPct(m.target, levelCount);
        curDetent = detentTargetIndex(pos, curDetent, levelCount, DETENT_THIRD);
        detentIndexRef.current = curDetent;
        m.target = pctFromIndex(curDetent, levelCount);
      } else {
        m.target = pct;
      }
      if (levelCount > 0) {
        var nowIndex = fastMode ? detentIndexRef.current : indexFromPct(pct, levelCount);
        if (nowIndex >= 0 && nowIndex !== lastCommittedIndexRef.current) {
          lastCommittedIndexRef.current = nowIndex;
          requestCommit(levels[nowIndex].id, false);
        }
      }
      if (reducedMotion) {
        jumpTo(m.target);
        draftRef.current = { pct: m.target, index: indexFromPct(m.target, levelCount) };
        setDraft(draftRef.current);
        return;
      }
      startFrames();
    }
    function endDrag() {
      tracePush({ k: "endDrag-enter", inst: __lgCesInstanceId, dragging: draggingRef.current, buttonDown: buttonDownRef.current });
      if (!draggingRef.current) return;
      draggingRef.current = false;
      var m = ensureMotion();
      var levelCountNow = levelCountRef.current;
      var levelsNow = levelsRef.current;
      if (!(levelCountNow > 0) || !levelsNow || levelsNow.length < levelCountNow) {
        tracePush({ k: "release-abort", why: "levelCount=0", mTarget: Math.round(m.target * 1e4) / 1e4 });
        return;
      }
      tracePush({ k: "pre-release", mTarget: Math.round(m.target * 1e4) / 1e4, mX: Math.round(m.x * 1e4) / 1e4, vPtr: Math.round(m.vPtr * 1e3) / 1e3, levelCount: levelCountNow, projS: typeof RELEASE_PROJECT_S === "undefined" ? "undef" : RELEASE_PROJECT_S, idxNow: indexFromPct(m.target, levelCountNow) });
      var idx;
      if (motionMode() === "fast") {
        idx = detentIndexRef.current >= 0 ? detentIndexRef.current : indexFromPct(m.target, levelCountNow);
        idx = Math.max(0, Math.min(levelCountNow - 1, idx));
        m.vPtr = 0;
        m.target = pctFromIndex(idx, levelCountNow);
      } else {
        idx = releaseIndexFor(m.target, m.vPtr, levelCountNow);
        m.vPtr = 0;
        if (reducedMotion) {
          jumpTo(pctFromIndex(idx, levelCountNow));
        } else {
          m.target = pctFromIndex(idx, levelCountNow);
        }
      }
      snapIndexRef.current = idx;
      if (idx >= 0 && idx < levelCountNow) requestCommit(levelsNow[idx].id, true);
      tracePush({ k: "release", idx, x: Math.round(m.x * 1e4) / 1e4, target: Math.round(m.target * 1e4) / 1e4, eff: Math.round(effectivePctRef.current * 1e4) / 1e4, showIdx: snapIndexRef.current });
      if (reducedMotion) {
        draftRef.current = null;
        snapIndexRef.current = null;
        setDraft(null);
        return;
      }
      publishMotion(m);
      startFrames();
    }
    function onTrackPointerDown(event) {
      if (event.button !== void 0 && event.button !== 0) return;
      if (locked || levelCount === 0) return;
      swallow(event);
      draggingRef.current = true;
      buttonDownRef.current = true;
      lastCommittedIndexRef.current = -1;
      detentIndexRef.current = -1;
      if (motionMode() === "fast") {
        var p0 = pctAt(event.clientX);
        if (p0 !== null && levelCount > 0) detentIndexRef.current = indexFromPct(p0, levelCount);
      }
      holdFramesRef.current = 0;
      releaseGenRef.current += 1;
      snapIndexRef.current = null;
      try {
        if (event.currentTarget && typeof event.currentTarget.setPointerCapture === "function" && event.pointerId !== void 0) {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      } catch (error) {
      }
      lastPtrPctRef.current = null;
      moveTo(event.clientX);
    }
    function onTrackPointerMove(event) {
      if (!draggingRef.current) return;
      if (event && event.buttons === 0 && buttonDownRef.current !== true) return;
      swallow(event);
      moveTo(event.clientX);
    }
    function onKeyDown(event) {
      if (locked || levelCount === 0) return;
      var key = event.key;
      var index = draftRef.current !== null ? draftRef.current.index : shownIndex;
      var next = null;
      if (key === "ArrowLeft" || key === "ArrowDown") next = Math.max(0, index - 1);
      else if (key === "ArrowRight" || key === "ArrowUp") next = Math.min(levelCount - 1, index + 1);
      else if (key === "Home") next = 0;
      else if (key === "End") next = levelCount - 1;
      else return;
      swallow(event);
      if (typeof event.preventDefault === "function") event.preventDefault();
      var m = ensureMotion();
      var targetPct = pctFromIndex(next, levelCount);
      if (reducedMotion) {
        jumpTo(targetPct);
        snapIndexRef.current = null;
        draftRef.current = null;
        setDraft(null);
      } else {
        snapIndexRef.current = next;
        m.target = targetPct;
        m.vPtr = 0;
        publishMotion(m);
        startFrames();
      }
      requestCommit(levels[next].id, true);
    }
    React9.useEffect(function() {
      return function() {
        cancelFrame(frameRef.current);
        frameRef.current = null;
      };
    }, []);
    var trackTitle = "\u63A8\u7406\u7B49\u7EA7" + (shownLevel !== null ? "\uFF1A" + shownLevel.name : "");
    if (effectiveReducedMotion) trackTitle += "\uFF08\u7B80\u6D01\u52A8\u753B\uFF1A\u7C92\u5B50\u5DF2\u653E\u7F13\uFF09";
    var tickNodes = [];
    for (var t = 0; t < levelCount; t += 1) {
      tickNodes.push(React9.createElement("span", {
        key: "tick-" + levels[t].id,
        className: "lg-ces-tick",
        "data-lg-ces-part": "tick",
        "data-on": t <= shownIndex ? "1" : "0",
        style: { left: knobOffsetOf(pctFromIndex(t, levelCount)) }
      }));
    }
    var positionSpeed = speedFor(shownPct);
    var starCount = starCountFor(shownPct);
    var starLayerOpacity = starLayerOpacityFor(shownPct);
    var particleNodes = [];
    for (var s = 0; s < starCount; s += 1) {
      var starBrightness = starBrightnessFor(s);
      var starDuration = starDurationFor(s, positionSpeed) * (effectiveReducedMotion ? REDUCED_MOTION_SLOWDOWN : 1);
      particleNodes.push(React9.createElement(
        "span",
        {
          key: "star-" + s,
          className: "lg-ces-star",
          "data-lg-ces-part": "star",
          style: {
            top: PARTICLES[s].y + "%",
            // ⚠️ 时长与**负相位**必须直接内联：写成 CSS 变量时真宿主里相位不生效，
            //    会出现"一打开星星全挤在起点"（见样式表里的注释）。
            animationDuration: starDuration.toFixed(3) + "s",
            animationDelay: starDelayFor(s, starDuration).toFixed(3) + "s"
          }
        },
        React9.createElement("span", {
          className: "lg-ces-star__dot",
          "data-lg-ces-part": "particle",
          // 亮度即大小系数：越亮越大（同时也是不透明度）
          "data-brightness": starBrightness.toFixed(3),
          style: { "--lg-ces-b": starBrightness.toFixed(3) }
        })
      ));
    }
    var ui = null;
    if (host !== null && host.container && levelCount > 0) {
      ui = ReactDOM2.createPortal(
        React9.createElement(
          "div",
          {
            className: "lg-ces-inline",
            "data-lg-ces-part": "root",
            "data-energy": energyOn ? "1" : "0",
            "data-motion": reducedMotion ? "none" : effectiveReducedMotion ? "concise" : "full",
            "data-reached-ticks": readSettings().reachedTicks,
            "data-busy": busy ? "1" : "0",
            style: { "--lg-ces-energy": String(energy) }
          },
          React9.createElement(
            "div",
            {
              ref: trackRef,
              className: "lg-ces-track",
              "data-lg-ces-part": "track",
              role: "slider",
              tabIndex: locked ? -1 : 0,
              "aria-label": "\u63A8\u7406\u7B49\u7EA7",
              "aria-valuemin": 0,
              "aria-valuemax": Math.max(0, levelCount - 1),
              "aria-valuenow": shownIndex,
              "aria-valuetext": shownLevel !== null ? shownLevel.name : "",
              "aria-disabled": locked ? "true" : void 0,
              title: trackTitle,
              onPointerDown: onTrackPointerDown,
              onPointerMove: onTrackPointerMove,
              onPointerUp: endDrag,
              onPointerCancel: endDrag,
              onKeyDown,
              onClick: swallow
            },
            React9.createElement("div", {
              className: "lg-ces-fill",
              "data-lg-ces-part": "fill",
              // 填充宽度 = 到旋钮圆心为止（不是整条轨道）；背景是"左蓝 → 当前位置颜色"的渐变。
              style: { width: knobOffset, background: fillBackground }
            }),
            // 能力层（星云 + 扫光）：透明度 = 能量强度，负责"通电"的渐入。
            React9.createElement(
              "div",
              { className: "lg-ces-energy", "data-lg-ces-part": "energy", style: { width: knobOffset } },
              React9.createElement("div", { className: "lg-ces-energy__sweep", "data-lg-ces-part": "sweep" })
            ),
            // 星星单独一层：不跟星云淡入（否则 high 档星星被星云的 0.5 透明度压得看不见）。
            React9.createElement(
              "div",
              {
                className: "lg-ces-stars",
                "data-lg-ces-part": "stars",
                style: { width: knobOffset, opacity: starLayerOpacity.toFixed(3) }
              },
              particleNodes
            ),
            tickNodes,
            React9.createElement("div", {
              className: "lg-ces-knob",
              "data-lg-ces-part": "knob",
              style: { left: knobOffset }
            })
          ),
          errorText_ !== null ? React9.createElement("div", { className: "lg-ces-error", "data-lg-ces-part": "error", role: "status" }, errorText_) : null
        ),
        host.container
      );
    }
    return React9.createElement("span", {
      ref: anchorRef,
      hidden: true,
      "data-lg-ces-part": "anchor",
      "aria-hidden": "true"
    }, ui);
  }
  var inject2 = ["slots", "sessions", "modelDirectories", "remote", "remote.session"];
  function apply2(ctx) {
    installStyles();
    try {
      ctx.slots.inject(SLOT_NAME, function() {
        return ctx.slots.register(
          {
            name: SLOT_NAME,
            id: ENTRY_ID,
            order: ENTRY_ORDER,
            label: function() {
              return "Reasoning effort";
            },
            // 会话 id 的第二条来路（标准 props 一般已经带了；两条都走 props.sessionId）。
            inject: function(sessionId) {
              return { sessionId };
            }
          },
          function SlotComponent(props) {
            return React9.createElement(CodexEffortSlider, Object.assign({}, props, { __ctx: ctx }));
          }
        );
      });
    } catch (error) {
      try {
        console.error("[codex-effort-slider] \u63D2\u69FD\u6CE8\u518C\u5931\u8D25\uFF0C\u63A7\u4EF6\u4E0D\u4F1A\u51FA\u73B0\uFF1A", error);
      } catch (e) {
      }
    }
  }
  exports.apply = apply2;
  exports.dispose = dispose;
  exports.inject = inject2;
  exports.__internals = {
    CSS,
    SLOT_NAME,
    ENTRY_ID,
    PARTICLES,
    ROW_PADDING_BLOCK,
    EFFORT_ROW_LABELS,
    CodexEffortSlider,
    createMenuBridge,
    findEffortRow,
    firstSpanText,
    levelsOf,
    resolveLevels,
    modelOf,
    effectiveEffortId,
    indexOfLevel,
    indexFromPct,
    pctFromIndex,
    detentTargetIndex,
    DETENT_THIRD,
    energyFor,
    speedFor,
    particleCountFor,
    starCountFor,
    starLayerOpacityFor,
    starBrightnessFor,
    starDurationFor,
    starDelayFor,
    starHash01,
    STARFIELD_DURATION_MEAN,
    STARFIELD_DURATION_SPREAD,
    STARFIELD_MIN,
    GOLDEN_RATIO,
    MAX_SPEED_FACTOR,
    REDUCED_MOTION_SLOWDOWN,
    readSettings,
    writeSettings,
    normalizeSettings,
    schemaDefaults,
    motionMode,
    motionParamsForMode,
    tracePush,
    dumpTrace,
    traceClear,
    installSettingsUi,
    openSettingsPanel,
    SETTINGS_SCHEMA,
    SETTINGS_VERSION,
    SETTINGS_KEY,
    SETTINGS_EVENT,
    MIN_HEIGHT_SLOTS,
    fillColorFor,
    fillBackgroundFor,
    valueColorFor,
    isOffLevel,
    findValueElement,
    findSeatEffort,
    knobOffsetOf,
    KNOB_RADIUS,
    KNOB_SIZE,
    TRACK_HEIGHT,
    BASE_SPEEDUP,
    ENERGY_START,
    ENERGY_END,
    clamp01,
    installStyles,
    // ── 连续运动引擎（导出是为了让测试能注入固定 dt 精确断言）──
    MOTION,
    MOTION_REDUCED,
    MOTION_FAST,
    RELEASE_PROJECT_S,
    POINTER_SPEED_EMA,
    POINTER_STALE_S,
    POINTER_SPEED_TAU,
    motionStep,
    motionSettled,
    decayPointerSpeed,
    releaseIndexFor,
    clampAbs
  };
  return exports;
}

// src/effort-slider.js
function createEffortRuntime() {
  return createEffortSlider(import_react7.default, ReactDOM);
}
function EffortSeat({ runtime, context, controller, ...props }) {
  const state = (0, import_react7.useSyncExternalStore)(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  const media = (0, import_react7.useMemo)(() => window.matchMedia?.("(prefers-reduced-motion: reduce)"), []);
  const reducedMotion = (0, import_react7.useSyncExternalStore)(
    (listener) => {
      media?.addEventListener("change", listener);
      return () => media?.removeEventListener("change", listener);
    },
    () => media?.matches === true,
    () => false
  );
  return import_react7.default.createElement(runtime.__internals.CodexEffortSlider, {
    ...props,
    __ctx: context,
    motion: state.state.preferences.motion,
    reducedMotion
  });
}
function installEffortSlider(ctx, controller) {
  const fiber = ctx.inject(["modelDirectories", "remote", "remote.session"], (scope) => {
    scope.effect(() => {
      const runtime = createEffortRuntime();
      runtime.__internals.installStyles();
      const release = scope.slots.inject("conversation.input.right", () => scope.slots.register({
        name: "conversation.input.right",
        id: "liquid-glass-effort-slider",
        order: 40,
        inject: (sessionId) => ({ sessionId })
      }, (props) => import_react7.default.createElement(EffortSeat, { ...props, runtime, context: scope, controller })));
      return () => {
        release();
        runtime.dispose();
      };
    });
  });
  return () => fiber.dispose();
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
    (0, import_react8.useEffect)(() => () => workspacePicker.onCancel(), []);
    const workspaces = (0, import_react8.useSyncExternalStore)(subscribeWorkspaces, getWorkspaces, getWorkspaces);
    const sessions = (0, import_react8.useSyncExternalStore)(subscribeSessions, getSessions, getSessions);
    const catalog = createCatalog(workspaces, sessions);
    const current = Object.values(sessions.byId).find((s) => (s.retainedBy?.mainView ?? 0) > 0)?.id;
    return /* @__PURE__ */ import_react8.default.createElement(import_react8.default.Fragment, null, /* @__PURE__ */ import_react8.default.createElement(
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
    style.textContent = theme_default + status_motion_default + wait_vendor_default + wait_line_default;
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
    let releaseEffort;
    let releaseWaiting;
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
          releaseEffort = installEffortSlider(ctx, controller);
          releaseWaiting = installWaitingLine(ctx, controller);
          releaseBrands = [
            ctx.slots.inject("sidebar.brand.name", () => ctx.slots.register({ name: "sidebar.brand.name", priority: -20 }, () => /* @__PURE__ */ import_react8.default.createElement("span", { className: "lg-wordmark" }, "DSH ", /* @__PURE__ */ import_react8.default.createElement("small", null, "Liquid Glass")))),
            ctx.slots.inject("conversation.hero.brand.mark", () => ctx.slots.register({ name: "conversation.hero.brand.mark", priority: -20 }, () => /* @__PURE__ */ import_react8.default.createElement(LiquidOrb, null)))
          ];
        } else {
          delete document.body.dataset.liquidGlass;
          releaseTokens?.();
          releaseTokens = void 0;
          releaseShell?.();
          releaseShell = void 0;
          releaseEffort?.();
          releaseEffort = void 0;
          releaseWaiting?.();
          releaseWaiting = void 0;
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
    const releaseSettings = ctx.slots.inject("settings.section", () => ctx.slots.register({ name: "settings.section", id: "liquid-glass", label: () => "Liquid Glass", order: 12 }, () => /* @__PURE__ */ import_react8.default.createElement(Settings, { controller, skin, appearance })));
    const releaseFooter = ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({ name: "sidebar.footer.action", id: "liquid-glass-view", order: Number.MAX_SAFE_INTEGER }, (props) => /* @__PURE__ */ import_react8.default.createElement(FooterToggle, { ...props, controller })));
    controller.refresh().then(() => {
      if (!controller.getSnapshot().error) {
        sync();
        console.info("[dsh-liquid-glass] client 0.8.0 ready");
      }
    });
    return () => {
      unsubscribe();
      releaseTree?.();
      releaseTokens?.();
      releaseShell?.();
      releaseEffort?.();
      releaseWaiting?.();
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
