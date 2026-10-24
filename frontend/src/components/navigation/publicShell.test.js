import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { MemoryRouter } from "react-router-dom";

let server;
let PublicHeader;
let PublicFooter;
let PublicLayout;
let PublicLink;

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  ({ default: PublicHeader } = await server.ssrLoadModule(
    "/src/components/navigation/PublicHeader.jsx",
  ));
  ({ default: PublicFooter } = await server.ssrLoadModule(
    "/src/components/navigation/PublicFooter.jsx",
  ));
  ({ default: PublicLayout } = await server.ssrLoadModule(
    "/src/layouts/PublicLayout.jsx",
  ));
  ({ default: PublicLink } = await server.ssrLoadModule(
    "/src/components/navigation/PublicLink.jsx",
  ));
});

after(async () => server?.close());

const render = (Component, props, children) =>
  renderToStaticMarkup(createElement(Component, props, children));

// Test-only handover examples use paths already documented in PAGES_AND_ROUTES.
const destinations = {
  projects: "/projects",
  services: "/services",
  howItWorks: "/how-it-works",
  about: "/about",
  login: "/login",
  signup: "/register",
  freelancers: "/freelancers",
  help: "/help",
  contact: "/support/contact",
  privacy: "/privacy",
  terms: "/terms",
};

test("public layout supplies one main landmark and an associated skip target", () => {
  const markup = render(
    PublicLayout,
    {},
    createElement("h1", null, "Page content"),
  );
  assert.equal([...markup.matchAll(/<header\b/g)].length, 1);
  assert.equal([...markup.matchAll(/<main\b/g)].length, 1);
  assert.equal([...markup.matchAll(/<footer\b/g)].length, 1);
  const mainId = markup.match(/<main[^>]* id="([^"]+)"/)?.[1];
  assert.ok(mainId);
  assert.ok(markup.includes(`href="#${mainId}"`));
  assert.match(markup, /tabindex="-1"/);
  assert.match(markup, /<h1>Page content<\/h1>/);
});

test("unconfigured destinations remain text instead of links to absent routes", () => {
  const markup = render(PublicLayout, {}, "Content");
  const hrefs = [...markup.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.ok(hrefs.every((href) => href === "/" || href.startsWith("#")));
  assert.match(markup, /<span[^>]*>Sign up<\/span>/);
  assert.doesNotMatch(markup, /href="#"|javascript:|role="link"|role="menu/);
});

test("links retain native semantics and only mark the exact current destination", () => {
  const markup = render(
    PublicLink,
    { href: "/projects", currentPath: "/projects", className: "example" },
    "Browse Jobs",
  );
  assert.match(markup, /^<a/);
  assert.match(markup, /href="\/projects"/);
  assert.match(markup, /aria-current="page"/);
  assert.match(markup, /miu-public-link example/);
  assert.doesNotMatch(
    render(PublicLink, { href: "/projects", currentPath: "/services" }, "Jobs"),
    /aria-current/,
  );
  assert.match(render(PublicLink, {}, "Unavailable"), /^<span/);
});

test("internal links use the active router and basename, including shell logos", () => {
  const routed = (element) =>
    renderToStaticMarkup(
      createElement(
        MemoryRouter,
        { basename: "/preview", initialEntries: ["/preview/"] },
        element,
      ),
    );
  const markup = routed(
    createElement(PublicLink, { href: "/projects" }, "Projects"),
  );
  assert.match(markup, /href="\/preview\/projects"/);
  assert.match(markup, /data-discover="true"/);
  const shell = routed(
    createElement(
      PublicLayout,
      { destinations: { projects: "/projects" } },
      "Content",
    ),
  );
  assert.equal([...shell.matchAll(/href="\/preview\/?"/g)].length, 2);
  assert.ok(shell.includes('href="/preview/projects"'));
});

test("anchors, external links, downloads and explicit reloads retain native navigation", () => {
  for (const props of [
    { href: "#discovery" },
    { href: "https://example.com/projects" },
    { href: "//example.com/projects" },
    { href: "mailto:demo@example.com" },
    { href: "/sample.pdf", download: "sample.pdf" },
    { href: "/projects", target: "_blank", rel: "noopener" },
    { href: "/projects", reloadDocument: true },
  ]) {
    const markup = renderToStaticMarkup(
      createElement(
        MemoryRouter,
        null,
        createElement(PublicLink, props, "Destination"),
      ),
    );
    assert.ok(markup.includes(`href="${props.href}"`));
    assert.doesNotMatch(markup, /data-discover|reloadDocument|reloaddocument/);
  }
});

test("header renders the visitor navigation without protected account workflows", () => {
  const markup = render(PublicHeader, {
    destinations,
    currentPath: "/services",
  });
  for (const path of [
    "/projects",
    "/services",
    "/about",
    "/how-it-works",
    "/login",
    "/register",
  ]) {
    assert.ok(markup.includes(`href="${path}"`));
  }
  assert.match(
    markup,
    /<a(?=[^>]*href="\/services")(?=[^>]*aria-current="page")[^>]*>/,
  );
  assert.match(markup, /Browse Jobs/);
  assert.match(markup, /How it Works/);
  assert.doesNotMatch(markup, /committee|logout|dashboard|client\/projects/i);
});

test("mobile menu is an initially closed native disclosure with a real controlled panel", () => {
  const markup = render(PublicHeader, { destinations });
  const id = markup.match(/aria-controls="([^"]+)"/)?.[1];
  assert.ok(id);
  assert.ok(markup.includes(`id="${id}"`));
  assert.match(markup, /aria-label="Open navigation"/);
  assert.match(markup, /aria-expanded="false"/);
  assert.match(markup, /type="button"/);
  assert.match(markup, /aria-label="More public navigation" hidden=""/);
  assert.doesNotMatch(markup, /role="dialog"|aria-modal|role="menuitem"/);
});

test("header and footer reuse the existing logo with descriptive text and native proportions", () => {
  for (const Component of [PublicHeader, PublicFooter]) {
    const markup = render(Component, {});
    assert.match(markup, /src="[^"]*miu-anniversary-logo.png"/);
    assert.match(markup, /alt="Misr International University"/);
    assert.match(markup, /width="400" height="200"/);
    assert.doesNotMatch(markup, /figma.com\/api|data:image/);
  }
});

test("footer copy is from the approved frame and unknown policy destinations are not invented", () => {
  const markup = render(PublicFooter, { destinations });
  assert.match(markup, /Real projects\. Proven student talent\./);
  assert.match(
    markup,
    /© 2026 Misr International University\. All rights reserved\./,
  );
  assert.match(markup, /aria-label="Marketplace"/);
  assert.match(markup, /aria-label="Support"/);
  assert.match(markup, /aria-label="Legal information"/);
  assert.match(markup, /href="\/privacy"/);
  assert.match(markup, /href="\/terms"/);
  assert.match(markup, /<span[^>]*>Safety &amp; Trust<\/span>/);
  assert.match(markup, /<span[^>]*>Community Guidelines<\/span>/);
  assert.doesNotMatch(markup, /href="\/(safety|community|guidelines)/);
});

test("layout forwards only supplied navigation destinations to both shell components", () => {
  const markup = render(
    PublicLayout,
    { destinations: { projects: "/projects" }, currentPath: "/projects" },
    "Content",
  );
  assert.ok([...markup.matchAll(/href="\/projects"/g)].length >= 2);
  assert.doesNotMatch(markup, /href="\/services"|href="\/register"/);
  assert.match(markup, /aria-current="page"/);
});
