import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

let server;
let AboutPage;
let HowItWorksPage;
let PublicLayout;
before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  ({ default: AboutPage } = await server.ssrLoadModule(
    "/src/features/public/AboutPage.jsx",
  ));
  ({ default: HowItWorksPage } = await server.ssrLoadModule(
    "/src/features/public/HowItWorksPage.jsx",
  ));
  ({ default: PublicLayout } = await server.ssrLoadModule(
    "/src/layouts/PublicLayout.jsx",
  ));
});
after(async () => server?.close());
const render = (Component, props = {}) =>
  renderToStaticMarkup(createElement(Component, props));

test("both pages provide one title and reuse Cards without nested public shell landmarks", () => {
  for (const Component of [AboutPage, HowItWorksPage]) {
    const markup = render(Component);
    assert.equal((markup.match(/<h1>/g) || []).length, 1);
    assert.doesNotMatch(markup, /<main|<header|<footer|<form|<button/);
    assert.match(markup, /miu-card/);
    assert.match(markup, /aria-label="Explore MIU Freelance"/);
    assert.doesNotMatch(markup, /<a /);
  }
});

test("About describes the documented academic project and both marketplace models", () => {
  const markup = render(AboutPage);
  for (const copy of [
    "About MIU Freelance",
    "Software Engineering project",
    "Projects and proposals",
    "Services and packages",
    "EGP",
    "permitted",
  ])
    assert.ok(markup.includes(copy), copy);
});

test("planned journeys retain roles, proposals, packages and delivery without invented business limits", () => {
  const markup = render(HowItWorksPage);
  assert.equal((markup.match(/<ol>/g) || []).length, 2);
  assert.equal((markup.match(/<li>/g) || []).length, 8);
  for (const copy of [
    "Planned project journey",
    "Planned service journey",
    "accepted proposal",
    "total EGP price",
    "requests revisions",
  ])
    assert.ok(markup.includes(copy), copy);
  assert.doesNotMatch(
    markup,
    /USD|commission|guaranteed|unlimited|automatically approved|real-time payment/i,
  );
});

test("both pages make Phase 1 limitations visible rather than claiming live operations", () => {
  for (const Component of [AboutPage, HowItWorksPage]) {
    const markup = render(Component);
    for (const copy of [
      "Phase 1 preview",
      "planned workflows",
      "verification",
      "simulated",
      "no real payments",
    ])
      assert.ok(markup.includes(copy), copy);
    assert.doesNotMatch(
      markup,
      /role="alert"|aria-live=|verified students|trusted by|university-approved/i,
    );
  }
});

test("links use only supplied destinations, never guessed routes or placeholders", () => {
  const destinations = Object.freeze({
    projects: "/available-projects",
    services: "/available-services",
    about: "/available-about",
    howItWorks: "/available-guide",
  });
  for (const Component of [AboutPage, HowItWorksPage]) {
    const markup = render(Component, { destinations });
    assert.equal((markup.match(/<a /g) || []).length, 3);
    assert.match(markup, /href="\/available-projects"/);
    assert.match(markup, /href="\/available-services"/);
    assert.doesNotMatch(markup, /href="#"|href="\/register"/);
    const partial = render(Component, {
      destinations: { projects: "/available-projects" },
    });
    assert.equal((partial.match(/<a /g) || []).length, 1);
  }
});

test("How It Works accepts the completed section once without recreating it or adding placeholders", () => {
  const slot = createElement(
    "section",
    { "data-existing-section": true },
    "Existing section supplied by integration",
  );
  const markup = render(HowItWorksPage, { howItWorks: slot });
  assert.equal((markup.match(/data-existing-section/g) || []).length, 1);
  assert.ok(
    markup.indexOf("Existing section supplied") <
      markup.indexOf("Planned project journey"),
  );
  for (const howItWorks of [undefined, null, false]) {
    assert.doesNotMatch(
      render(HowItWorksPage, { howItWorks }),
      /data-existing-section|coming soon|missing section|Step 01/,
    );
  }
});

test("card headings have unique matching associations across multiple page instances", () => {
  const markup = renderToStaticMarkup(
    createElement(
      "div",
      null,
      createElement(AboutPage),
      createElement(AboutPage),
      createElement(HowItWorksPage),
    ),
  );
  const ids = [...markup.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const [, id] of markup.matchAll(/aria-labelledby="([^"]+)"/g))
    assert.ok(ids.includes(id));
});

test("PublicLayout composes each page with one main landmark and page heading", () => {
  for (const Component of [AboutPage, HowItWorksPage]) {
    const markup = renderToStaticMarkup(
      createElement(PublicLayout, null, createElement(Component)),
    );
    assert.equal((markup.match(/<main /g) || []).length, 1);
    assert.equal((markup.match(/<h1>/g) || []).length, 1);
    assert.match(markup, /Skip to main content/);
  }
});
