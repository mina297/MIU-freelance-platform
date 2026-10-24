import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("public directory has one shell, safe service links and honest loading/error/empty states", async () => {
  const vite = await createServer({
    root: fileURLToPath(new URL("../../../", import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: Router } = await vite.ssrLoadModule("/src/app/router.jsx");
    const { default: AuthProvider } = await vite.ssrLoadModule(
      "/src/contexts/AuthProvider.jsx",
    );
    const { default: Catalogue } = await vite.ssrLoadModule(
      "/src/features/freelancers/FreelancersCatalogue.jsx",
    );
    const { marketplaceData: data } = await vite.ssrLoadModule(
      "/src/data/fixtures/marketplace.js",
    );
    const route = renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/freelancers"] },
        React.createElement(AuthProvider, null, React.createElement(Router)),
      ),
    );
    for (const tag of ["main", "h1", "footer"])
      assert.equal(
        (route.match(new RegExp(`<${tag}\\b`, "g")) ?? []).length,
        1,
      );
    assert.match(route, /2 providers found/);
    for (const text of [
      "Salma Farid",
      "Omar Nabil",
      "not verified qualifications",
      "not hourly rates",
    ])
      assert.ok(route.includes(text), text);
    for (const id of ["service_001", "service_002", "service_003"])
      assert.ok(route.includes(`href="/services/${id}"`));
    assert.doesNotMatch(
      route,
      /href="\/services\/service_004|routing placeholder only|Create a student event poster/,
    );
    const render = (props) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(Catalogue, props),
        ),
      );
    for (const state of ["loading", "error"]) {
      const html = render({ state });
      assert.doesNotMatch(html, /freelancer-card__top/);
      assert.match(html, /disabled=""/);
    }
    assert.match(render({ state: "error", onRetry: () => {} }), /Try again/);
    assert.doesNotMatch(render({ state: "error" }), /Try again/);
    assert.match(
      render({ data: { ...data, services: [] } }),
      /No published service providers yet/,
    );
    assert.match(
      render({ data: { ...data, servicePackages: [] } }),
      /Price unavailable/,
    );
    const escaped = render({
      data: {
        ...data,
        participants: {
          ...data.participants,
          students: [
            {
              ...data.participants.students[0],
              displayName: "<script>unsafe</script>",
            },
          ],
        },
      },
    });
    assert.match(escaped, /&lt;script&gt;unsafe&lt;\/script&gt;/);
    assert.doesNotMatch(escaped, /<script>unsafe/);
  } finally {
    await vite.close();
  }
});
