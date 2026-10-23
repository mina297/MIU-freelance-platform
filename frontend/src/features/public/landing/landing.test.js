import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { marketplaceData } from "../../../data/fixtures/marketplace.js";
import {
  getLandingDiscovery,
  getServiceStartingPrice,
} from "./discoveryModel.js";

let server;
let LandingPage;
let PublicLayout;

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  ({ default: LandingPage } = await server.ssrLoadModule(
    "/src/features/public/LandingPage.jsx",
  ));
  ({ default: PublicLayout } = await server.ssrLoadModule(
    "/src/layouts/PublicLayout.jsx",
  ));
});

after(async () => server?.close());
const render = (props = {}) =>
  renderToStaticMarkup(createElement(LandingPage, props));

test("discovery exposes open projects and published services without mutating shared records", () => {
  const before = JSON.stringify(marketplaceData);
  const results = getLandingDiscovery({}, marketplaceData);
  assert.equal(results.projects.length, 4);
  assert.equal(results.services.length, 1);
  assert.ok(results.projects.every((project) => project.status === "open"));
  assert.ok(
    results.services.every((service) => service.status === "published"),
  );
  assert.ok(!results.projects.some(({ id }) => id === "project_002"));
  assert.equal(results.projects[0], marketplaceData.projects[0]);
  assert.equal(JSON.stringify(marketplaceData), before);
});

test("keyword and category filters combine across the two marketplace models", () => {
  const results = getLandingDiscovery(
    { query: "  DESIGN  ", categoryId: "graphic_design" },
    marketplaceData,
  );
  assert.deepEqual(
    results.projects.map(({ id }) => id),
    ["project_003"],
  );
  assert.deepEqual(
    results.services.map(({ id }) => id),
    ["service_001"],
  );
  const empty = getLandingDiscovery(
    { query: "nothing-matches-this" },
    marketplaceData,
  );
  assert.equal(empty.projects.length, 0);
  assert.equal(empty.services.length, 0);
});

test("skill-label search reuses shared skill filters, deduplicates, and preserves source order", () => {
  const react = getLandingDiscovery({ query: "React" }, marketplaceData);
  assert.deepEqual(
    react.projects.map(({ id }) => id),
    ["project_001", "project_005"],
  );
  const responsive = getLandingDiscovery(
    { query: "responsive" },
    marketplaceData,
  );
  assert.deepEqual(
    responsive.projects.map(({ id }) => id),
    ["project_001", "project_005"],
  );
  assert.deepEqual(
    responsive.services.map(({ id }) => id),
    ["service_001"],
  );
  const constrained = getLandingDiscovery(
    { query: "React", categoryId: "writing" },
    marketplaceData,
  );
  assert.equal(constrained.projects.length, 0);
});

test("unpublished records are excluded even when their titles or skills match", () => {
  const data = {
    ...marketplaceData,
    services: marketplaceData.services.map((service) => ({
      ...service,
      status: "paused",
    })),
  };
  assert.equal(
    getLandingDiscovery({ query: "Figma" }, data).services.length,
    0,
  );
});

test("service prices come only from linked packages and missing prices stay unknown", () => {
  assert.equal(getServiceStartingPrice("service_001", marketplaceData), 1800);
  assert.equal(getServiceStartingPrice("missing", marketplaceData), null);
  const data = {
    ...marketplaceData,
    servicePackages: [
      ...marketplaceData.servicePackages,
      { id: "test-lower-package", serviceId: "service_001", priceEGP: 1500 },
      {
        id: "test-unrelated-package",
        serviceId: "another-service",
        priceEGP: 1,
      },
    ],
  };
  assert.equal(getServiceStartingPrice("service_001", data), 1500);
});

test("landing content reuses the shell without duplicating main, header, or footer landmarks", () => {
  const page = render();
  assert.equal([...page.matchAll(/<h1\b/g)].length, 1);
  assert.match(page, /Find real work\. Build your reputation\./);
  assert.match(page, /Featured jobs/);
  assert.match(page, /Discover services/);
  assert.match(page, /4 projects and 1 service found/);
  assert.doesNotMatch(page, /<main\b|<header\b|<footer\b/);
  const composed = renderToStaticMarkup(
    createElement(PublicLayout, null, createElement(LandingPage)),
  );
  assert.equal([...composed.matchAll(/<main\b/g)].length, 1);
  assert.equal([...composed.matchAll(/<header\b/g)].length, 1);
  assert.equal([...composed.matchAll(/<footer\b/g)].length, 1);
});

test("search controls have associated visible labels and only supported category IDs", () => {
  const markup = render();
  assert.match(markup, /role="search"/);
  const inputId = markup.match(/<input[^>]*id="([^"]+)"/)?.[1];
  assert.ok(inputId);
  assert.ok(markup.includes(`for="${inputId}"`));
  assert.match(markup, /Search projects and services/);
  for (const { id } of marketplaceData.categories)
    assert.ok(markup.includes(`value="${id}"`));
  assert.doesNotMatch(
    markup,
    /<option[^>]*value="(?:translation|marketing|video|tutoring)"/,
  );
  for (const label of ["Translation", "Marketing", "Video", "Tutoring"]) {
    assert.match(
      markup,
      new RegExp(`<button[^>]*disabled=""[^>]*>${label}</button>`),
    );
  }
});

test("unregistered navigation is never fabricated, while in-page discovery links resolve", () => {
  const markup = render();
  const hrefs = [...markup.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(hrefs.length, 2);
  for (const href of hrefs) {
    assert.ok(href.startsWith("#"));
    assert.ok(markup.includes(`id="${href.slice(1)}"`));
  }
  assert.match(markup, /<span[^>]*>Post a Job<\/span>/);
  assert.doesNotMatch(markup, /href="#"|href="\/projects/);
});

test("only explicit destination providers create project, service, and profile links", () => {
  const markup = render({
    destinations: { projects: "/projects", services: "/services" },
    getProjectHref: (id) => `/projects/${id}`,
    getServiceHref: (id) => `/services/${id}`,
    getStudentHref: (id) => `/students/${id}`,
  });
  assert.match(markup, /href="\/projects\/project_001"/);
  assert.match(markup, /href="\/services\/service_001"/);
  assert.match(markup, /href="\/students\/student_001"/);
});

test("student examples contain only supplied identities without invented ranking or profile facts", () => {
  const markup = render();
  assert.match(markup, /Salma Farid/);
  assert.match(markup, /Omar Nabil/);
  assert.match(markup, /Meet student talent/);
  assert.match(markup, /Profile details and reviews are unavailable/);
  assert.doesNotMatch(
    markup,
    /Top-rated|Nour El-Sayed|Omar Hassan|Mariam Adel|★|Year [1-5]/,
  );
  assert.doesNotMatch(markup, /<img[^>]*Avatar|4\.9|5\.0/);
});

test("Phase 1 disclosures qualify planned benefits and all displayed prices use EGP", () => {
  const markup = render();
  assert.match(markup, /verification, ratings, and payments are not live/);
  assert.match(markup, /does not verify identities, calculate ratings/);
  assert.equal([...markup.matchAll(/>Planned<\/span>/g)].length, 3);
  assert.match(markup, /EGP/);
  assert.doesNotMatch(markup, /USD|EUR|\$[0-9]/);
  // Vite can inline this tiny local SVG; assert its rendered decorative slot.
  assert.match(markup, /<img[^>]*alt="" width="8" height="8"/);
  assert.doesNotMatch(markup, /figma.com\/api/);
});

test("How It Works is only rendered when the existing component is supplied", () => {
  assert.doesNotMatch(render(), /<h2[^>]*>How [Ii]t [Ww]orks/);
  const markup = render({
    howItWorks: createElement(
      "section",
      { "data-integration": "existing-section" },
      "Existing component slot",
    ),
  });
  assert.match(markup, /data-integration="existing-section"/);
  assert.ok(
    markup.indexOf("Existing component slot") < markup.indexOf("Featured jobs"),
  );
});

test("empty data produces useful empty states without fake records or package amounts", () => {
  const data = {
    ...marketplaceData,
    projects: [],
    services: [],
    participants: { clients: [], students: [] },
  };
  const markup = render({ data });
  assert.match(markup, /No matching projects/);
  assert.match(markup, /No matching services/);
  assert.match(markup, /Student profiles are not available/);
  assert.doesNotMatch(markup, /Salma Farid|EGP\s*\d/);
  const withoutPrices = render({
    data: { ...marketplaceData, servicePackages: [] },
  });
  assert.match(withoutPrices, /Price unavailable/);
});

test("loading and error presentations do not expose stale opportunity cards or pretend to fetch", () => {
  const loading = render({ discoveryState: "loading" });
  assert.match(loading, /aria-busy="true"/);
  assert.match(loading, /Loading opportunities/);
  assert.match(loading, /disabled=""/);
  assert.doesNotMatch(loading, /Build a responsive event website|href="#/);
  const error = render({ discoveryState: "error", onRetry: () => {} });
  assert.match(error, /Discovery is unavailable/);
  assert.match(error, /Try again<\/button>/);
  assert.doesNotMatch(
    error,
    /Build a responsive event website|aria-busy="true"/,
  );
  assert.doesNotMatch(
    render({ discoveryState: "error" }),
    /Try again<\/button>/,
  );
});
