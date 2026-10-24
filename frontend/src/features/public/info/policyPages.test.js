import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let server;
let TermsPage;
let PrivacyPage;
let PublicLayout;
before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  ({ default: TermsPage } = await server.ssrLoadModule(
    "/src/features/public/TermsPage.jsx",
  ));
  ({ default: PrivacyPage } = await server.ssrLoadModule(
    "/src/features/public/PrivacyPage.jsx",
  ));
  ({ default: PublicLayout } = await server.ssrLoadModule(
    "/src/layouts/PublicLayout.jsx",
  ));
});
after(async () => server?.close());
const render = (Component, props = {}) =>
  renderToStaticMarkup(createElement(Component, props));

test("both policy pages clearly identify unapproved placeholders at introduction and content", () => {
  for (const Component of [TermsPage, PrivacyPage]) {
    const markup = render(Component);
    assert.match(markup, /Phase 1 page placeholder/);
    assert.match(markup, /Placeholder — awaiting team-approved content/);
    assert.match(
      markup,
      /must supply and approve the final content before publication/,
    );
    assert.match(markup, /Phase 1 preview/);
    assert.match(markup, /no real payments are processed/);
  }
  assert.match(render(TermsPage), /not published Terms of Use/);
  assert.match(render(PrivacyPage), /not a published Privacy Policy/);
});

test("Terms does not invent operative clauses, acceptance or business commitments", () => {
  const markup = render(TermsPage);
  assert.match(markup, /does not establish conditions for using the platform/);
  assert.doesNotMatch(
    markup,
    /by using|you agree|we guarantee|governing law|commission|refund within|arbitration|effective date|last updated/i,
  );
});

test("Privacy does not convert design requirements into claims about actual practices", () => {
  const markup = render(PrivacyPage);
  assert.match(
    markup,
    /does not describe approved data collection, storage, sharing, retention or deletion practices/,
  );
  assert.doesNotMatch(
    markup,
    /we collect|we store|we share|we never|we retain|we delete|we use cookies|\d+ days|effective date|last updated|compliant with/i,
  );
});

test("static policy placeholders add no consent controls, forms, alerts or extra shell landmarks", () => {
  for (const Component of [TermsPage, PrivacyPage]) {
    const markup = render(Component);
    assert.equal((markup.match(/<h1>/g) || []).length, 1);
    assert.match(markup, /miu-card/);
    assert.doesNotMatch(
      markup,
      /<main|<header|<footer|<form|<button|<input|role="alert"|aria-live=/,
    );
    assert.doesNotMatch(markup, /mailto:|tel:|https?:\/\//);
  }
});

test("only supplied cross-page destinations become links; missing routes stay text", () => {
  for (const [Component, key] of [
    [TermsPage, "privacy"],
    [PrivacyPage, "terms"],
  ]) {
    assert.doesNotMatch(render(Component), /<a /);
    const markup = render(Component, {
      destinations: Object.freeze({
        [key]: "/available-policy",
        about: "/available-about",
      }),
    });
    assert.equal((markup.match(/<a /g) || []).length, 2);
    assert.match(markup, /href="\/available-policy"/);
    assert.match(markup, /href="\/available-about"/);
    assert.doesNotMatch(markup, /href="#"|href="\/register"/);
    const partial = render(Component, {
      destinations: { [key]: "/available-policy" },
    });
    assert.equal((partial.match(/<a /g) || []).length, 1);
  }
});

test("placeholder headings have unique matching associations across page instances", () => {
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(TermsPage),
      createElement(PrivacyPage),
      createElement(TermsPage),
    ),
  );
  const ids = [...markup.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const [, id] of markup.matchAll(/aria-labelledby="([^"]+)"/g))
    assert.ok(ids.includes(id));
});

test("PublicLayout supplies one main landmark and skip target for each policy page", () => {
  for (const Component of [TermsPage, PrivacyPage]) {
    const markup = renderToStaticMarkup(
      createElement(PublicLayout, null, createElement(Component)),
    );
    assert.equal((markup.match(/<main /g) || []).length, 1);
    assert.equal((markup.match(/<h1>/g) || []).length, 1);
    assert.match(markup, /Skip to main content/);
  }
});
