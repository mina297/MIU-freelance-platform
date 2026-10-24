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
    assert.match(render("/client/projects"), /Route creation demo/);
    assert.match(render("/client/projects"), /Edit project/);
    const partial = {
      title: "Private route draft",
      description: "",
      scope: "",
      deliverables: "",
      categoryId: "",
      requiredSkillIds: [],
      budgetEGP: "",
      deadline: "",
    };
    const draft = projectStore.saveDraft(
      partial,
      client,
      "route-draft",
    ).project;
    const draftEditor = render(`/client/projects/${draft.id}/edit`);
    assert.match(draftEditor, /value="Private route draft"/);
    assert.match(draftEditor, /Save draft/);
    assert.match(render("/client/projects"), /Private route draft/);
    assert.doesNotMatch(render("/projects"), /Private route draft/);
    assert.match(render(`/projects/${draft.id}`), /Project not found/);
    const foreign = {
      ...client,
      user: { ...client.user, id: "another_client" },
    };
    assert.match(render("/client/projects", foreign), /No projects yet/);
    for (const id of [draft.id, created.project.id, "missing", "project_002"]) {
      const unavailable = render(`/client/projects/${id}/edit`, foreign);
      assert.match(unavailable, /Project unavailable for editing/);
      assert.doesNotMatch(
        unavailable,
        /Private route draft|Route creation demo/,
      );
    }
    assert.match(
      render("/client/projects/project_002/edit"),
      /Project unavailable for editing/,
    );
    const editing = render(`/client/projects/${created.project.id}/edit`);
    assert.match(editing, /Update your project brief/);
    assert.match(editing, /value="Route creation demo"/);
    assert.doesNotMatch(editing, />Save draft</);
    projectStore.update(
      {
        ...partial,
        title: "Updated route creation demo",
        description: "A fictional site",
        scope: "Schedule",
        deliverables: "Schedule page",
        categoryId: "web_development",
        requiredSkillIds: ["react"],
        budgetEGP: "5500",
        deadline: "2099-12-31",
      },
      client,
      created.project.id,
    );
    assert.match(
      render(`/projects/${created.project.id}`),
      /Updated route creation demo/,
    );
    assert.match(render("/projects"), /Updated route creation demo/);
    assert.match(render("/client/projects"), /Close project:/);
    assert.match(
      render("/client/projects"),
      /linked order or accepted proposal/,
    );
    assert.equal(
      projectStore.transition(created.project.id, client, "close").ok,
      true,
    );
    assert.match(
      render(`/projects/${created.project.id}`),
      /Closed — not accepting proposals/,
    );
    assert.doesNotMatch(render("/projects"), /Updated route creation demo/);
    const student = {
      ...client,
      user: { ...client.user, id: "student_002", role: "student" },
    };
    assert.match(
      render(`/projects/${created.project.id}/propose`, student),
      /Proposals are closed/,
    );
    assert.equal(
      projectStore.transition(created.project.id, client, "cancel").ok,
      true,
    );
    assert.match(
      render(`/projects/${created.project.id}`),
      /Cancelled — not accepting proposals/,
    );
    assert.match(
      render(`/client/projects/${created.project.id}/edit`),
      /Project unavailable for editing/,
    );
    assert.equal(
      projectStore.transition("project_002", client, "cancel").ok,
      false,
    );
    for (const id of [
      "project_001",
      "project_003",
      "project_004",
      "project_005",
    ])
      assert.equal(projectStore.transition(id, client, "close").ok, true);
    const emptyCatalogue = render("/projects");
    assert.match(emptyCatalogue, /No open projects right now/);
    assert.doesNotMatch(emptyCatalogue, /Sample brief/);
  } finally {
    await vite.close();
  }
});
