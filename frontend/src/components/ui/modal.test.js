import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let server;
let Modal;
let Button;

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  ({ default: Modal } = await server.ssrLoadModule(
    "/src/components/ui/Modal.jsx",
  ));
  ({ default: Button } = await server.ssrLoadModule(
    "/src/components/ui/Button.jsx",
  ));
});

after(async () => server?.close());

const render = (props = {}) =>
  renderToStaticMarkup(createElement(Modal, props));

test("modal uses a native dialog named by its visible heading", () => {
  const markup = render({
    title: "Example dialog",
    description: "Example context",
  });
  assert.match(markup, /<dialog/);
  assert.match(markup, /aria-modal="true"/);
  const titleId = markup.match(/aria-labelledby="([^"]+)"/)[1];
  const descriptionId = markup.match(/aria-describedby="([^"]+)"/)[1];
  assert.ok(markup.includes(`<h2 id="${titleId}"`));
  assert.ok(markup.includes(`<p id="${descriptionId}"`));
  assert.match(markup, /Example dialog/);
  assert.match(markup, /Example context/);
});

test("modal does not render a misleading nonmodal open attribute during SSR", () => {
  for (const open of [true, false]) {
    const markup = render({ open, onClose: () => {} });
    assert.doesNotMatch(markup, /<dialog[^>]*\sopen(?:[=>\s])/);
  }
});

test("omitted description and content leave no dangling reference or empty slots", () => {
  const markup = render();
  assert.doesNotMatch(
    markup,
    /aria-describedby|miu-modal__body|miu-modal__actions/,
  );
  assert.match(markup, />Dialog<\/h2>/);
});

test("close control has a local exact-size decorative icon and never submits a form", () => {
  const markup = render({ closeLabel: "Close example" });
  assert.match(
    markup,
    /<button[^>]*aria-label="Close example"[^>]*type="button"/,
  );
  // Vite may inline this small local SVG instead of emitting a separate URL.
  assert.match(
    markup,
    /src="(?:data:image\/svg\+xml,|\/src\/assets\/figma\/modal-close\.svg)/,
  );
  assert.match(markup, /alt="" width="22" height="22"/);
  assert.doesNotMatch(markup, /figma.com|https:\/\//);
});

test("content and caller-owned actions compose without hardcoded marketplace rules", () => {
  const markup = render({
    children: createElement("p", null, "Example content"),
    actions: createElement(Button, { onClick: () => {} }, "Example action"),
  });
  assert.match(markup, /miu-modal__body/);
  assert.match(markup, /Example content/);
  assert.match(markup, /miu-modal__actions/);
  assert.match(markup, /Example action/);
  assert.doesNotMatch(markup, /proposal|EGP|18 days|focus trapped/);
});

test("heading levels and caller classes follow existing component conventions", () => {
  assert.match(
    render({ headingLevel: 3, className: "example" }),
    /class="miu-modal example"/,
  );
  assert.match(render({ headingLevel: 3 }), /<h3/);
  assert.match(render({ headingLevel: 4 }), /<h4/);
  assert.match(render({ headingLevel: 1 }), /<h2/);
});

test("multiple modal instances have independent title and description associations", () => {
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(Modal, {
        title: "First",
        description: "First description",
      }),
      createElement(Modal, {
        title: "Second",
        description: "Second description",
      }),
    ),
  );
  const titles = [...markup.matchAll(/aria-labelledby="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const descriptions = [...markup.matchAll(/aria-describedby="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(new Set([...titles, ...descriptions]).size, 4);
});

test("long text remains intact and HTML text is escaped", () => {
  const markup = render({
    title: "Long title ".repeat(30),
    description: "<script>example</script>",
  });
  assert.match(markup, /Long title /);
  assert.match(markup, /&lt;script&gt;example&lt;\/script&gt;/);
  assert.doesNotMatch(markup, /<script>/);
});

test("opening requires a close callback to avoid an undismissable controlled dialog", () => {
  assert.throws(() => render({ open: true }), /requires an onClose callback/);
});
