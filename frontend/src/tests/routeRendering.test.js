import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("public projects route renders the marketplace catalogue, not a placeholder", async () => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    const { default: AppRouter } = await vite.ssrLoadModule(
      "/src/app/router.jsx",
    );
    const { default: AuthProvider } = await vite.ssrLoadModule(
      "/src/contexts/AuthProvider.jsx",
    );
    const html = renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/projects"] },
        React.createElement(AuthProvider, null, React.createElement(AppRouter)),
      ),
    );

    assert.match(html, /The project marketplace/i);
    assert.match(html, /Projects to explore/i);
    assert.match(html, /Build a responsive event website/i);
    assert.doesNotMatch(html, /routing placeholder only/i);
    assert.doesNotMatch(html, /Phase 1 routing demonstration/i);
  } finally {
    await vite.close();
  }
});
