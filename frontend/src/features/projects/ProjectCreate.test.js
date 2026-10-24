import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("creation route renders the client form, guards other sessions, and exposes published details", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: AppRouter } = await vite.ssrLoadModule(
      "/src/app/router.jsx",
    );
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const { projectStore } = await vite.ssrLoadModule(
      "/src/features/projects/projectStore.js",
    );
    const client = {
      status: "authenticated",
      user: {
        id: "client_001",
        displayName: "Nile Studio",
        role: "client",
        accountStatus: "active",
        verificationStatus: "approved",
      },
    };
    const render = (path, session = client) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            AuthContext.Provider,
            { value: { session } },
            React.createElement(AppRouter),
          ),
        ),
      );
    const html = render("/client/projects/new");
    assert.match(html, /Tell us what you’re building/);
    assert.match(html, /Preview project/);
    assert.match(html, /simulated frontend workflow/);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1);
    for (const field of [
      "title",
      "description",
      "scope",
      "deliverables",
      "categoryId",
      "budgetEGP",
      "deadline",
    ])
      assert.ok(html.includes(`name="${field}"`), field);
    assert.match(html, /name="requiredSkillIds"/);
    assert.match(
      render("/client/projects/new", {
        ...client,
        user: { ...client.user, verificationStatus: "pending" },
      }),
      /Client verification is required/,
    );
    for (const session of [
      { status: "anonymous", user: null },
      { ...client, user: { ...client.user, role: "student" } },
      { ...client, user: { ...client.user, accountStatus: "suspended" } },
    ])
      assert.doesNotMatch(
        render("/client/projects/new", session),
        /Tell us what you’re building/,
      );
    const created = projectStore.publish(
      {
        title: "Route creation demo",
        description: "A fictional accessible website.",
        scope: "A schedule and registration form.",
        deliverables: "Schedule\nRegistration form",
        categoryId: "web_development",
        requiredSkillIds: ["react"],
        budgetEGP: "4500",
        deadline: "2099-12-31",
      },
      client,
      "route-test",
    );
    assert.equal(created.ok, true);
    assert.match(
      render(`/projects/${created.project.id}`),
      /Route creation demo/,
    );
    assert.match(render("/projects"), /Route creation demo/);
    assert.match(render("/projects"), /Post a project/);
  } finally {
    await vite.close();
  }
});
