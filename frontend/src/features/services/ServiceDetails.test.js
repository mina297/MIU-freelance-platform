import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, matchRoutes } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("public service details render one shell, related packages/extras and safe recovery without creating orders", async () => {
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
    const { default: Details } = await vite.ssrLoadModule(
      "/src/features/services/ServiceDetails.jsx",
    );
    const { default: Comparison } = await vite.ssrLoadModule(
      "/src/features/services/ServicePackageComparison.jsx",
    );
    const { marketplaceData: data } = await vite.ssrLoadModule(
      "/src/data/fixtures/marketplace.js",
    );
    const { routeConfig } = await vite.ssrLoadModule("/src/app/routeConfig.js");
    const { orderStore } = await vite.ssrLoadModule(
      "/src/features/orders/orderStore.js",
    );
    const before = orderStore.getSnapshot();
    const route = (id) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [`/services/${id}`] },
          React.createElement(AuthProvider, null, React.createElement(Router)),
        ),
      );
    const html = route("service_001");
    assert.equal((html.match(/<main\b/g) ?? []).length, 1);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.equal((html.match(/<footer\b/g) ?? []).length, 1);
    for (const text of [
      "Responsive landing page design",
      "Salma Farid",
      "Compare the packages",
      "Design with reusable sections",
      "Launch design collection",
      "Additional section",
      "Included deliverables",
      "1,800",
      "2,800",
      "4,200",
      "400",
    ])
      assert.ok(html.includes(text), text);
    assert.match(html, /href="#service-packages"/);
    assert.match(html, /href="\/services"/);
    assert.doesNotMatch(
      html,
      /href="\/checkout|href="\/students|Buy now|Order now|routing placeholder/,
    );
    const config = routeConfig.find(
      ({ path }) => path === "/services/:serviceId",
    );
    assert.equal(config.access, "public");
    assert.equal(config.showInNavigation, false);
    assert.equal(
      matchRoutes(routeConfig, "/services/service_001").at(-1).route.title,
      "Service details",
    );
    const paused = route("service_004");
    const missing = route("not-a-service");
    for (const blocked of [paused, missing]) {
      assert.match(blocked, /Service unavailable/);
      assert.doesNotMatch(
        blocked,
        /Create a student event poster|Poster concept|Compare the packages/,
      );
    }
    const render = (props) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(Details, { serviceId: "service_001", ...props }),
        ),
      );
    const empty = render({
      data: {
        ...data,
        servicePackages: [],
        serviceExtras: [],
        participants: { ...data.participants, students: [] },
      },
    });
    assert.match(empty, /Price unavailable/);
    assert.match(empty, /No valid packages/);
    assert.match(empty, /No optional extras/);
    assert.match(empty, /Student information unavailable/);
    assert.doesNotMatch(
      empty,
      /service-comparison__price|href="#service-packages"/,
    );
    for (const state of ["loading", "error"]) {
      const content = render({ state });
      assert.doesNotMatch(
        content,
        /Responsive landing page design|Launch design collection|Additional section/,
      );
      assert.match(
        content,
        state === "loading"
          ? /Loading service details/
          : /could not be displayed/,
      );
    }
    const escaped = render({
      data: {
        ...data,
        services: data.services.map((service) =>
          service.id === "service_001"
            ? { ...service, title: "<script>fictional</script>" }
            : service,
        ),
      },
    });
    assert.match(escaped, /&lt;script&gt;fictional&lt;\/script&gt;/);
    const packs = data.servicePackages.filter(
      ({ serviceId }) => serviceId === "service_001",
    );
    const tables = renderToStaticMarkup(
      React.createElement(
        "div",
        null,
        React.createElement(Comparison, { packages: packs }),
        React.createElement(Comparison, { packages: packs }),
      ),
    );
    const ids = [...tables.matchAll(/\bid="([^"]+)"/g)].map(
      (match) => match[1],
    );
    assert.equal(new Set(ids).size, ids.length);
    for (const [, headers] of tables.matchAll(/\bheaders="([^"]+)"/g))
      for (const header of headers.split(" ")) assert.ok(ids.includes(header));
    assert.match(tables, /<caption>/);
    assert.match(tables, /scope="col"/);
    assert.match(tables, /scope="row"/);
    assert.match(tables, /tabindex="0"/);
    assert.equal(orderStore.getSnapshot(), before);
  } finally {
    await vite.close();
  }
});
