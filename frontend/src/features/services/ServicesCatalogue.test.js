import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("services render in the public shell without fabricated destinations; loading/error/empty states suppress cards", async () => {
  const vite = await createServer({
    root: fileURLToPath(new URL("../../../", import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: AppRouter } = await vite.ssrLoadModule(
      "/src/app/router.jsx",
    );
    const { default: AuthProvider } = await vite.ssrLoadModule(
      "/src/contexts/AuthProvider.jsx",
    );
    const { default: Catalogue } = await vite.ssrLoadModule(
      "/src/features/services/ServicesCatalogue.jsx",
    );
    const { marketplaceData: data } = await vite.ssrLoadModule(
      "/src/data/fixtures/marketplace.js",
    );
    const route = renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/services"] },
        React.createElement(AuthProvider, null, React.createElement(AppRouter)),
      ),
    );
    assert.equal((route.match(/<main\b/g) ?? []).length, 1);
    assert.equal((route.match(/<h1\b/g) ?? []).length, 1);
    assert.match(route, /Services to explore/);
    assert.match(route, /3 services found/);
    assert.match(route, /EGP/);
    assert.match(route, /Salma Farid/);
    assert.match(route, /Omar Nabil/);
    assert.match(route, /Preview starting package/);
    assert.match(route, /href="\/services\/service_001"/);
    assert.match(route, /href="\/services\/service_002"/);
    assert.match(route, /aria-controls="service-filters"/);
    assert.doesNotMatch(
      route,
      /Create a student event poster|routing placeholder only|href="\/services\/service_004|href="\/students\/|Buy now/,
    );
    const render = (props) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(Catalogue, props),
        ),
      );
    const loading = render({ state: "loading" });
    assert.match(loading, /Loading service listings/);
    assert.doesNotMatch(loading, /service-card__body/);
    const error = render({ state: "error" });
    assert.match(error, /Services are unavailable/);
    assert.doesNotMatch(error, /service-card__body|Try again/);
    assert.match(render({ state: "error", onRetry: () => {} }), /Try again/);
    const empty = render({ data: { ...data, services: [] } });
    assert.match(empty, /No published services yet/);
    assert.doesNotMatch(empty, /service-card__body/);
    const noPrices = render({ data: { ...data, servicePackages: [] } });
    assert.match(noPrices, /Price unavailable/);
    assert.doesNotMatch(noPrices, /EGP\s*0/);
    const escaped = render({
      data: {
        ...data,
        services: [{ ...data.services[0], title: "<script>test</script>" }],
      },
    });
    assert.match(escaped, /&lt;script&gt;test&lt;\/script&gt;/);
  } finally {
    await vite.close();
  }
});
