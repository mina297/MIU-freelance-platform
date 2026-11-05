import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
test("both placements render the same permitted links with one account utility set", async () => {
  const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { default: Shell } = await vite.ssrLoadModule("/src/components/navigation/ApplicationNavigation.jsx");
    const { NavigationContext } = await vite.ssrLoadModule("/src/components/navigation/NavigationContext.js");
    const { AuthContext } = await vite.ssrLoadModule("/src/contexts/AuthContext.js");
    for (const role of ["student", "client", "super_admin", "finance_committee"]) {
      const path = role === "super_admin" ? "/admin" : role === "finance_committee" ? "/committee/finance" : `/${role}/dashboard`;
      const render = layout => renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [path] },
        React.createElement(AuthContext.Provider, { value: { session: { status: "authenticated", user: { id: "test", displayName: "Long account name ".repeat(12), role, accountStatus: "active" } }, logout() {} } },
          React.createElement(NavigationContext.Provider, { value: { layout, setLayout() {} } },
            React.createElement(Shell, null, React.createElement("input", { defaultValue: "Existing draft" }))))));
      const top = render("top"), side = render("side");
      for (const [layout, html] of [["top", top], ["side", side]]) {
        assert.match(html, new RegExp(`data-navigation-layout="${layout}"`));
        assert.match(html, /value="Existing draft"/);
        assert.equal((html.match(/aria-label="Dark mode"/g) ?? []).length, 1);
        assert.equal((html.match(/name="navigation-layout"/g) ?? []).length, 2);
        assert.match(html, /aria-haspopup="dialog"/);
      }
      assert.deepEqual(top.match(/href="[^"]+"/g), side.match(/href="[^"]+"/g));
    }
  } finally { await vite.close(); }
});
