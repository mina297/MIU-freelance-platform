import test from "node:test";
import assert from "node:assert/strict";
import { setImmediate as nextTurn } from "node:timers/promises";
import { connectHeroPlayback } from "./heroVideoPlayback.js";

function environment() {
  const calls = { play: 0, pause: 0, load: 0 };
  const attributes = new Map();
  const listeners = new Map();
  const video = {
    pause: () => calls.pause++,
    play: () => {
      calls.play++;
      return Promise.resolve();
    },
    load: () => calls.load++,
    getAttribute: (key) => attributes.get(key),
    setAttribute: (key, value) => attributes.set(key, value),
  };
  const page = {
    hidden: false,
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: (name) => listeners.delete(name),
  };
  let observer;
  class Observer {
    constructor(callback) {
      this.callback = callback;
      observer = this;
    }
    observe(element) {
      assert.equal(element, video);
    }
    disconnect() {
      this.disconnected = true;
    }
  }
  const options = { enabled: true, source: "/clip.mp4", page, Observer };
  return {
    video,
    calls,
    attributes,
    listeners,
    page,
    options,
    get observer() {
      return observer;
    },
  };
}

test("hero video never downloads or plays with motion disabled or data saving enabled", () => {
  for (const override of [{ enabled: false }, { saveData: true }]) {
    const env = environment();
    connectHeroPlayback(env.video, { ...env.options, ...override });
    assert.equal(env.calls.play, 0);
    assert.equal(env.calls.load, 0);
    assert.equal(env.attributes.size, 0);
    assert.equal(env.listeners.size, 0);
  }
});

test("hero loads only in view, pauses for hidden tabs and cleans up without replaying", () => {
  const env = environment();
  const cleanup = connectHeroPlayback(env.video, env.options);
  assert.equal(env.calls.load, 0);
  env.observer.callback([{ isIntersecting: true }]);
  assert.equal(env.calls.play, 1);
  assert.equal(env.calls.load, 1);
  env.page.hidden = true;
  env.listeners.get("visibilitychange")();
  assert.equal(env.calls.play, 1);
  env.page.hidden = false;
  env.listeners.get("visibilitychange")();
  assert.equal(env.calls.play, 2);
  assert.equal(env.calls.load, 1);
  env.observer.callback([{ isIntersecting: false }]);
  assert.equal(env.calls.play, 2);
  cleanup();
  assert.ok(env.observer.disconnected);
  assert.equal(env.listeners.size, 0);
  env.observer.callback([{ isIntersecting: true }]);
  assert.equal(env.calls.play, 2);
});

test("hero tolerates denied autoplay and browsers without IntersectionObserver", async () => {
  const env = environment();
  env.video.play = () => Promise.reject(new Error("Autoplay denied"));
  const cleanup = connectHeroPlayback(env.video, {
    ...env.options,
    Observer: undefined,
  });
  assert.equal(env.calls.load, 1);
  await nextTurn();
  cleanup();
});
