import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(
  new URL("../../../public/app-startup.js", import.meta.url),
  "utf8",
);

function setup() {
  const listeners = new Map();
  const timers = new Map();
  const nodes = new Map();
  let reloads = 0;
  function events(target) {
    return {
      addEventListener(name, fn) {
        listeners.set(`${target}:${name}`, fn);
      },
      removeEventListener(name) {
        listeners.delete(`${target}:${name}`);
      },
    };
  }
  for (const id of [
    "root",
    "miu-app-startup",
    "miu-startup-recovery",
    "miu-startup-retry",
    "miu-startup-status",
    "miu-startup-failure",
    "miu-startup-slow",
  ]) {
    const attrs = new Map();
    nodes.set(id, {
      ...events(id),
      hidden: ["miu-startup-recovery", "miu-startup-failure"].includes(id),
      classList: new Set(),
      removeAttribute(name) {
        attrs.delete(name);
      },
      getAttribute(name) {
        return attrs.get(name) ?? null;
      },
      setAttribute(name, value) {
        attrs.set(name, value);
      },
      querySelector() {
        return null;
      },
      contains() {
        return false;
      },
      remove() {
        nodes.delete(id);
      },
    });
  }
  nodes.get("root").setAttribute("aria-busy", "true");
  vm.runInNewContext(source, {
    document: { getElementById: (id) => nodes.get(id), activeElement: null },
    window: {
      ...events("window"),
      location: {
        reload() {
          reloads++;
        },
      },
    },
    setTimeout(fn, ms) {
      timers.set(ms, fn);
      return ms;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  });
  return {
    nodes,
    timers,
    listeners,
    emit(name, event = {}) {
      listeners.get(`window:${name}`)?.(event);
    },
    get reloads() {
      return reloads;
    },
  };
}

test("startup disappears on the first ready event without waiting for a timer", () => {
  const app = setup();
  app.emit("miu:app-ready");
  assert.equal(app.nodes.has("miu-app-startup"), false);
  assert.equal(app.nodes.get("root").getAttribute("aria-busy"), null);
  assert.equal(app.timers.size, 0);
  assert.equal(app.listeners.size, 0);
  app.emit("miu:app-ready"); // StrictMode's second effect is harmless.
});

test("slow startup offers reload without falsely declaring failure or blocking later readiness", () => {
  const app = setup();
  app.timers.get(15000)();
  assert.equal(app.nodes.get("miu-startup-recovery").hidden, false);
  assert.equal(app.nodes.get("miu-startup-failure").hidden, true);
  app.listeners.get("miu-startup-retry:click")();
  assert.equal(app.reloads, 1);
  app.emit("miu:app-ready");
  assert.equal(app.nodes.has("miu-app-startup"), false);
});

test("render, preload and production module errors expose recovery; unrelated image errors do not", () => {
  for (const event of ["miu:app-error", "vite:preloadError", "error"]) {
    const app = setup();
    app.emit(event, { target: { tagName: "SCRIPT", type: "module" } });
    assert.equal(app.nodes.get("miu-startup-status").hidden, true);
    assert.equal(app.nodes.get("miu-startup-failure").hidden, false);
    assert.equal(app.nodes.get("miu-startup-recovery").hidden, false);
    assert.equal(app.nodes.get("miu-startup-slow").hidden, true);
    assert.equal(app.timers.size, 0);
    assert.ok(app.nodes.get("miu-app-startup").classList.has("is-error"));
  }
  const app = setup();
  app.emit("error", { target: { tagName: "IMG" } });
  assert.equal(app.nodes.get("miu-startup-failure").hidden, true);
});

test("ready restores focus when the disappearing recovery button had keyboard focus", () => {
  const app = setup();
  const heading = app.nodes.get("miu-startup-status");
  let focused = false;
  heading.focus = () => {
    focused = true;
  };
  app.nodes.get("root").querySelector = () => heading;
  app.nodes.get("miu-app-startup").contains = () => true;
  app.emit("miu:app-ready");
  assert.ok(focused);
  assert.equal(heading.getAttribute("tabindex"), null);
});

test("startup copy is available before React, with a no-JavaScript fallback", () => {
  const html = readFileSync(
    new URL("../../../index.html", import.meta.url),
    "utf8",
  );
  assert.ok(
    html.indexOf('id="miu-app-startup"') < html.indexOf('src="/src/main.jsx"'),
  );
  assert.match(html, /Preparing your next chapter/);
  assert.match(html, /نجهّز خطوتك القادمة/);
  assert.match(html, /<noscript>/);
  assert.match(html, /app-startup\.js/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
});
