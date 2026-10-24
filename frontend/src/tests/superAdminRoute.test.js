import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("SuperAdmin preview renders its full shell on direct and case-variant URLs", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { default: AppRouter } = await vite.ssrLoadModule(
      "/src/app/router.jsx",
    );
    const { default: AuthProvider } = await vite.ssrLoadModule(
      "/src/contexts/AuthProvider.jsx",
    );
    for (const path of [
      "/SuperAdmin",
      "/superadmin",
      "/SUPERADMIN",
      "/SuperAdmin?section=finance",
    ]) {
      const html = renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            AuthProvider,
            null,
            React.createElement(AppRouter),
          ),
        ),
      );
      assert.match(html, /admin-center/);
      assert.match(html, /Super Admin sections/);
      assert.match(html, /Financial overview/);
      assert.doesNotMatch(html, /routing placeholder only/);
      assert.doesNotMatch(html, /Development:\s*Switch dashboard/);
      assert.doesNotMatch(html, /dev-dashboard-navigation/);
      assert.doesNotMatch(html, /Simulated session controls/);
    }
  } finally {
    await vite.close();
  }
});
