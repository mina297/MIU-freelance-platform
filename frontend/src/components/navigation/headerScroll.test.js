import test from "node:test";
import assert from "node:assert/strict";
import { watchHeaderScroll } from "./headerScroll.js";

function setup() {
  const target = new EventTarget();
  const header = new EventTarget();
  const attributes = new Set();
  header.offsetHeight = 90;
  header.interacting = false;
  header.matches = () => header.interacting;
  header.removeAttribute = (name) => attributes.delete(name);
  header.toggleAttribute = (name, force) =>
    force ? attributes.add(name) : attributes.delete(name);
  const scroller = { scrollTop: 0, scrollHeight: 2000, clientHeight: 600 };
  const cleanup = watchHeaderScroll(header, scroller, target);
  const scroll = (top) => {
    scroller.scrollTop = top;
    target.dispatchEvent(new Event("scroll"));
  };
  return {
    header,
    scroll,
    cleanup,
    hidden: () => attributes.has("data-scroll-hidden"),
  };
}

test("header stays visible near the top, hides downward and reveals on any upward scroll", () => {
  const { scroll, hidden, cleanup } = setup();
  scroll(40);
  assert.equal(hidden(), false);
  scroll(200);
  assert.equal(hidden(), true);
  scroll(199);
  assert.equal(hidden(), false);
  scroll(300);
  assert.equal(hidden(), true);
  scroll(0);
  assert.equal(hidden(), false);
  cleanup();
});

test("focus and expanded menus keep navigation accessible; cleanup resets route state", () => {
  const { header, scroll, hidden, cleanup } = setup();
  scroll(200);
  header.dispatchEvent(new Event("focusin"));
  assert.equal(hidden(), false);
  header.interacting = true;
  scroll(400);
  assert.equal(hidden(), false);
  header.interacting = false;
  scroll(500);
  assert.equal(hidden(), true);
  cleanup();
  assert.equal(hidden(), false);
  scroll(600);
  assert.equal(hidden(), false);
});

test("overscroll at either boundary does not create a false direction change", () => {
  const { scroll, hidden, cleanup } = setup();
  scroll(-40);
  assert.equal(hidden(), false);
  scroll(1400);
  assert.equal(hidden(), true);
  scroll(1500);
  scroll(1400);
  assert.equal(hidden(), true);
  scroll(1399);
  assert.equal(hidden(), false);
  cleanup();
});
