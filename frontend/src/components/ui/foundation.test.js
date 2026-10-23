import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let server;
let Button;
let Card;
let Badge;

before(async () => {
  // Use the installed JSX/CSS pipeline without adding a DOM-test dependency.
  server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  ({ default: Button } = await server.ssrLoadModule(
    "/src/components/ui/Button.jsx",
  ));
  ({ default: Card } = await server.ssrLoadModule(
    "/src/components/ui/Card.jsx",
  ));
  ({ default: Badge } = await server.ssrLoadModule(
    "/src/components/ui/Badge.jsx",
  ));
});

after(async () => {
  await server?.close();
});

const render = (Component, props, children) =>
  renderToStaticMarkup(createElement(Component, props, children));

test("buttons default to a non-submitting native action and preserve form props", () => {
  assert.match(render(Button, {}, "Save"), /type="button"/);
  const submit = render(
    Button,
    { type: "submit", form: "proposal", name: "action", value: "save" },
    "Save",
  );
  assert.match(submit, /type="submit"/);
  assert.match(submit, /form="proposal"/);
  assert.match(submit, /name="action"/);
  assert.match(submit, /value="save"/);
});

test("loading keeps the accessible label, exposes busy state and prevents activation", () => {
  const onClick = () => assert.fail("an unavailable action must not run");
  const element = Button({ loading: true, children: "Save draft", onClick });
  assert.equal(element.props.disabled, true);
  assert.equal(element.props.onClick, undefined);
  const markup = render(Button, { loading: true }, "Save draft");
  assert.match(markup, /aria-busy="true"/);
  assert.match(markup, /disabled=""/);
  assert.match(markup, /Save draft/);
  assert.match(markup, /aria-hidden="true"/);
});

test("disabled buttons suppress the callback while enabled buttons retain it", () => {
  const onClick = () => {};
  assert.equal(Button({ disabled: true, onClick }).props.onClick, undefined);
  assert.equal(Button({ onClick }).props.onClick, onClick);
  assert.doesNotMatch(render(Button, {}, "Save"), /aria-busy|disabled=/);
});

test("button variants support caller labels and fall back safely for unknown variants", () => {
  for (const variant of [
    "primary",
    "secondary",
    "outline",
    "ghost",
    "destructive",
  ]) {
    assert.match(
      render(Button, { variant }, "Action"),
      new RegExp(`miu-button--${variant}`),
    );
  }
  const markup = render(
    Button,
    {
      variant: "unknown",
      "aria-label": "Close preview",
      className: "preview-action",
    },
    "×",
  );
  assert.match(markup, /miu-button--primary/);
  assert.match(markup, /aria-label="Close preview"/);
  assert.match(markup, /preview-action/);
  assert.doesNotMatch(markup, /variant=/);
});

test("cards provide optional semantics without adding interactive behavior", () => {
  const markup = render(
    Card,
    { as: "article", "aria-label": "Summary", className: "summary" },
    "Content",
  );
  assert.match(markup, /^<article/);
  assert.match(markup, /aria-label="Summary"/);
  assert.match(markup, /miu-card summary/);
  assert.doesNotMatch(markup, /tabindex|role="button"/);
  assert.match(
    render(Card, { as: "section", "aria-label": "Details" }, "Content"),
    /^<section/,
  );
  assert.match(render(Card, { as: "button" }, "Content"), /^<div/);
});

test("badges retain explicit text and do not infer workflow rules or live announcements", () => {
  for (const variant of [
    "neutral",
    "success",
    "info",
    "completed",
    "warning",
    "danger",
  ]) {
    const markup = render(Badge, { variant }, "Awaiting review");
    assert.match(markup, new RegExp(`miu-badge--${variant}`));
    assert.match(markup, />Awaiting review<\/span>/);
    assert.doesNotMatch(markup, /role=|aria-live=|variant=/);
  }
  assert.match(
    render(Badge, { variant: "unknown" }, "Custom"),
    /miu-badge--neutral/,
  );
});
