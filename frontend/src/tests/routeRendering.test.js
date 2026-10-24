import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("public website routes render real pages in one shell with safe destinations", async () => {
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
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const renderRoute = (path, provider = AuthProvider, value) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            provider,
            value ? { value } : null,
            React.createElement(AppRouter),
          ),
        ),
      );
    for (const [path, text] of [
      ["/", "Find real work. Build your reputation."],
      ["/about", "From university learning to practical experience"],
      ["/how-it-works", "Planned service journey"],
      ["/terms", "not published Terms of Use"],
      ["/privacy", "not a published Privacy Policy"],
      ["/loading-demo", "Interactive loading example"],
      ["/error-demo", "Empty and error states"],
    ]) {
      const html = renderRoute(path);
      assert.ok(html.includes(text), path);
      assert.equal((html.match(/<main\b/g) ?? []).length, 1, path);
      assert.equal((html.match(/<footer\b/g) ?? []).length, 1, path);
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1, path);
      assert.match(html, /miu-public-header/);
      assert.match(html, /Demo session controls/);
      assert.doesNotMatch(
        html,
        /routing placeholder only|href="\/(?:freelancers|help|support\/contact|services\/service_)/,
      );
      if (path === "/" || path === "/how-it-works")
        assert.equal(
          (html.match(/<section class="m4-how-it-works"/g) ?? []).length,
          1,
        );
    }
    const home = renderRoute("/");
    assert.match(home, /href="\/projects\/project_001"/);
    const loggedIn = renderRoute("/", AuthContext.Provider, {
      session: {
        status: "authenticated",
        user: {
          id: "student_002",
          displayName: "Omar Nabil",
          role: "student",
          accountStatus: "active",
          verificationStatus: "approved",
        },
      },
    });
    assert.match(loggedIn, /href="\/student\/dashboard"/);
    assert.match(loggedIn, /My workspace/);
    assert.doesNotMatch(loggedIn, />Log in<|>Sign up</);
    assert.match(renderRoute("/missing-public-page"), /Page not found/);
  } finally {
    await vite.close();
  }
});

test("proposal routes render eligible, unverified, missing, closed, and submitted states", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { default: AppRouter } = await vite.ssrLoadModule(
      "/src/app/router.jsx",
    );
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const { proposalStore } = await vite.ssrLoadModule(
      "/src/features/proposals/proposalStore.js",
    );
    const student = {
      id: "render_test_student",
      displayName: "Demo Student",
      role: "student",
      accountStatus: "active",
      verificationStatus: "approved",
    };
    const renderRoute = (id, user = student) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [`/projects/${id}/propose`] },
          React.createElement(
            AuthContext.Provider,
            {
              value: { session: { status: "authenticated", user } },
            },
            React.createElement(AppRouter),
          ),
        ),
      );
    const open = renderRoute("project_001");
    assert.match(open, /Prepare your proposal/);
    assert.match(open, /Submit demo proposal/);
    assert.match(open, /Sample attachments \(optional\)/);
    assert.match(open, /No real files are uploaded or stored/);
    assert.match(open, /Sample portfolio\.pdf/);
    assert.match(open, /Sample project plan\.pdf/);
    for (const id of ["proposal-price", "proposal-days", "proposal-cover"]) {
      assert.ok(open.includes(`for="${id}"`));
      assert.ok(open.includes(`id="${id}"`));
    }
    assert.match(
      renderRoute("project_001", { ...student, verificationStatus: "pending" }),
      /Student verification is required/,
    );
    const missing = renderRoute("missing");
    assert.match(missing, /Project not found/);
    assert.doesNotMatch(missing, /<form/);
    const closed = renderRoute("project_002");
    assert.match(closed, /Proposals are closed/);
    assert.doesNotMatch(closed, /<form/);
    const result = proposalStore.submit(
      {
        priceEGP: "5500",
        deliveryDays: "14",
        coverMessage: "<script>fictional</script>",
        attachmentIds: ["demo_attachment_plan"],
      },
      "project_001",
      { status: "authenticated", user: student },
    );
    assert.equal(result.ok, true);
    const submitted = renderRoute("project_001");
    assert.match(submitted, /Proposal submitted/);
    assert.match(submitted, /No client was contacted/);
    assert.match(submitted, /Sample project plan\.pdf/);
    assert.match(submitted, /no files were uploaded/i);
    assert.match(submitted, /&lt;script&gt;fictional/);
    assert.doesNotMatch(submitted, /<form/);
    assert.match(
      renderRoute("project_001", { ...student, id: "other_student" }),
      /<form/,
    );
  } finally {
    await vite.close();
  }
});

test("public project routes render marketplace screens, not placeholders", async () => {
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
    const renderRoute = (path) =>
      renderToStaticMarkup(
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
    const catalogueHtml = renderRoute("/projects");
    const detailsHtml = renderRoute("/projects/project_001");

    assert.match(catalogueHtml, /The project marketplace/i);
    assert.match(catalogueHtml, /Projects to explore/i);
    assert.match(catalogueHtml, /Build a responsive event website/i);
    assert.match(detailsHtml, /Scope of work/i);
    assert.match(detailsHtml, /Expected deliverables/i);
    assert.match(detailsHtml, /Browse projects/i);
    for (const html of [catalogueHtml, detailsHtml]) {
      assert.doesNotMatch(html, /routing placeholder only/i);
      assert.doesNotMatch(html, /Phase 1 routing demonstration/i);
    }
  } finally {
    await vite.close();
  }
});

test("all five authentication routes render labeled forms or role selection", async () => {
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
    for (const [path, heading] of [
      ["/login", "Log in"],
      ["/register", "Create a demo account"],
      ["/register/role", "Choose your account role"],
      ["/forgot-password", "Forgot password"],
      ["/reset-password", "Simulated password reset"],
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
      assert.ok(html.includes(heading), path);
      assert.doesNotMatch(html, /routing placeholder only/i);
      if (path !== "/register/role") {
        assert.match(html, /<form/);
        assert.match(html, /<label[^>]+for=/);
        assert.match(html, /Simulated authentication/);
      }
      if (path === "/register") {
        assert.match(html, /value="student"/);
        assert.match(html, /value="client"/);
        assert.doesNotMatch(html, /<option value="super_admin"/);
      }
    }
  } finally {
    await vite.close();
  }
});
