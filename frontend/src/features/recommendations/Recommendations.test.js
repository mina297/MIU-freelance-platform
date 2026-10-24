import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("public matching route explains its simulation, requires preferences and retains safe recovery states", async () => {
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
    const { default: Recommendations, RecommendationCard } =
      await vite.ssrLoadModule(
        "/src/features/recommendations/Recommendations.jsx",
      );
    const { recommendMarketplace } = await vite.ssrLoadModule(
      "/src/features/recommendations/recommendationModel.js",
    );
    const { marketplaceData: data } = await vite.ssrLoadModule(
      "/src/data/fixtures/marketplace.js",
    );
    const route = renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/recommendations"] },
        React.createElement(AuthProvider, null, React.createElement(Router)),
      ),
    );
    for (const tag of ["main", "h1", "footer"])
      assert.equal(
        (route.match(new RegExp(`<${tag}\\b`, "g")) ?? []).length,
        1,
      );
    for (const text of [
      "Choose a starting point",
      "does not run an AI model",
      "Skills to match",
      "Prices do not affect ranking",
      "private profile",
    ])
      assert.ok(route.includes(text), text);
    assert.doesNotMatch(
      route,
      /recommendation-card__reason|routing placeholder only/,
    );
    for (const path of [
      "/projects",
      "/services",
      "/freelancers",
      "/recommendations",
    ])
      assert.ok(route.includes(`href="${path}"`));
    const render = (Component, props) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(Component, props),
        ),
      );
    for (const state of ["loading", "error"]) {
      const html = render(Recommendations, { state });
      assert.match(html, /disabled=""/);
      assert.doesNotMatch(
        html,
        /Choose a starting point|recommendation-card__reason/,
      );
    }
    assert.match(
      render(Recommendations, { state: "error", onRetry: () => {} }),
      /Try again/,
    );
    assert.doesNotMatch(
      render(Recommendations, { state: "error" }),
      /Try again/,
    );
    const item = recommendMarketplace(
      { kind: "freelancers", skillIds: ["figma", "react"] },
      data,
    )[0];
    const card = render(RecommendationCard, { item });
    for (const text of [
      "Why this appears",
      "1 of 2",
      "Some selected skills",
      "Helpful",
      "Not relevant",
      'aria-pressed="false"',
      "Explore matched service",
      "EGP",
    ])
      assert.ok(card.includes(text), text);
    assert.doesNotMatch(card, /href="\/students\/|confidence|100%/);
    assert.match(
      render(RecommendationCard, {
        item: { ...item, title: "<script>unsafe</script>", priceEGP: null },
      }),
      /&lt;script&gt;unsafe&lt;\/script&gt;/,
    );
    assert.match(
      render(RecommendationCard, { item: { ...item, priceEGP: null } }),
      /Price unavailable/,
    );
  } finally {
    await vite.close();
  }
});
