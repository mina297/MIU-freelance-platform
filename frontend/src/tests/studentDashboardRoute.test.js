import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("student dashboard direct entries retain the shared shell and role guard", async () => {
  const vite = await createServer({
    root: fileURLToPath(new URL("../../", import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: Router } = await vite.ssrLoadModule("/src/app/router.jsx");
    const { AuthContext } = await vite.ssrLoadModule("/src/contexts/AuthContext.js");
    const session = {
      status: "authenticated",
      user: { id: "student_001", role: "student", displayName: "Demo student", accountStatus: "active" },
    };
    const render = (activeSession) => renderToStaticMarkup(
      React.createElement(MemoryRouter, { initialEntries: ["/student/dashboard"] },
        React.createElement(AuthContext.Provider, { value: { session: activeSession } }, React.createElement(Router))),
    );
    for (let entry = 0; entry < 2; entry++) {
      const html = render(session);
      assert.match(html, /Welcome back, Nour/);
      assert.match(html, /miu-public-main/);
      assert.equal((html.match(/class="student-dashboard"/g) ?? []).length, 1);
      assert.doesNotMatch(html, /routing placeholder only/);
    }
    assert.doesNotMatch(render({ status: "anonymous", user: null }), /Welcome back, Nour/);
    assert.doesNotMatch(render({ ...session, user: { ...session.user, role: "client" } }), /Welcome back, Nour/);
  } finally {
    await vite.close();
  }
});
