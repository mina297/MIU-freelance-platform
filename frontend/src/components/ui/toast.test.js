import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let server;
let Toast;
const render = (props = {}) =>
  renderToStaticMarkup(
    createElement(Toast, { message: "Example feedback", ...props }),
  );

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  ({ default: Toast } = await server.ssrLoadModule(
    "/src/components/ui/Toast.jsx",
  ));
});
after(async () => server?.close());

test("toast reuses the foundation and announces text politely without focus capture", () => {
  const markup = render();
  assert.match(markup, /miu-card miu-toast miu-toast--info/);
  assert.match(markup, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(markup, /Information/);
  assert.match(markup, /Example feedback/);
  assert.doesNotMatch(markup, /<button|autofocus|tabindex|role="dialog"/);
});

test("all variants have explicit visible status labels rather than color-only meaning", () => {
  for (const [variant, badge, label] of [
    ["info", "info", "Information"],
    ["success", "success", "Success"],
    ["warning", "warning", "Warning"],
    ["error", "danger", "Error"],
    ["loading", "neutral", "Loading"],
  ]) {
    const markup = render({ variant });
    assert.ok(markup.includes(`miu-toast--${variant}`));
    assert.ok(markup.includes(`miu-badge--${badge}`));
    assert.ok(markup.includes(`>${label}</span>`));
    assert.match(markup, /aria-live="polite"/);
  }
  for (const variant of ["unknown", "constructor", "__proto__", null]) {
    assert.match(render({ variant }), /miu-toast--info/);
  }
});

test("urgent announcements are explicit and off delegates to a single outer announcer", () => {
  assert.match(
    render({ variant: "error", announcement: "assertive" }),
    /role="alert" aria-live="assertive" aria-atomic="true"/,
  );
  assert.doesNotMatch(
    render({ announcement: "off" }),
    /role=|aria-live=|aria-atomic=/,
  );
  assert.match(render({ announcement: "unknown" }), /aria-live="polite"/);
});

test("loading has one live region and a decorative spinner without hiding status as busy", () => {
  const markup = render({ variant: "loading", onDismiss: () => {} });
  assert.equal((markup.match(/role="status"/g) || []).length, 1);
  assert.match(markup, /miu-spinner[^>]*aria-hidden="true"/);
  assert.doesNotMatch(markup, /aria-busy=|disabled=/);
});

test("dismiss control is native, non-submitting, labeled and outside the live content", () => {
  const onDismiss = () => {};
  const markup = render({
    onDismiss,
    dismissLabel: "Dismiss example feedback",
  });
  assert.match(markup, /<button[^>]*type="button"/);
  assert.match(markup, /aria-label="Dismiss example feedback"/);
  assert.match(
    markup,
    /<img[^>]*src="[^"]+"[^>]*alt=""[^>]*aria-hidden="true"/,
  );
  assert.match(markup, /<\/p><\/div><button/);
  assert.doesNotMatch(markup, /disabled=|autofocus|title=/);
  const element = Toast({ message: "Example", onDismiss });
  const button = element.props.children[1];
  assert.equal(button.props.onClick, onDismiss);
  assert.doesNotMatch(render({ onDismiss: true }), /<button/);
});

test("caller copy, long labels and formatting are preserved and safely escaped", () => {
  const text = "Long caller text ".repeat(40) + "<script>";
  const markup = render({
    message: text,
    description: "Caller-formatted EGP 1,250 <example>",
    statusLabel: text,
    className: "consumer-feedback",
  });
  assert.match(markup, /consumer-feedback/);
  assert.match(markup, /EGP 1,250 &lt;example&gt;/);
  assert.equal((markup.match(/&lt;script&gt;/g) || []).length, 2);
  assert.doesNotMatch(
    markup,
    /<script>|verified|payment successful|localStorage/,
  );
});

test("optional description adds no empty paragraph", () => {
  for (const description of [undefined, null, "", " "]) {
    assert.doesNotMatch(render({ description }), /miu-toast__description/);
  }
});

test("invalid caller text fails clearly without exposing raw errors or unnamed controls", () => {
  for (const message of [
    undefined,
    null,
    "",
    " ",
    0,
    {},
    new Error("private"),
  ]) {
    assert.throws(() => render({ message }), /nonempty message string/);
  }
  assert.throws(
    () => render({ description: {} }),
    /description must be a string/,
  );
  for (const statusLabel of ["", " ", 0, {}]) {
    assert.throws(() => render({ statusLabel }), /statusLabel must be/);
  }
  for (const dismissLabel of ["", " ", null, 0]) {
    assert.throws(
      () => render({ onDismiss: () => {}, dismissLabel }),
      /dismissLabel string/,
    );
  }
});
