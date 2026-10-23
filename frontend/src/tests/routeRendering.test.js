import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { filterLandingJobs } from "../features/public/landingData.js";

test("landing discovery combines trimmed text and category filters with empty recovery", () => {
  assert.equal(filterLandingJobs("", "").length, 3);
  assert.equal(
    filterLandingJobs("  REACT  ", "Development")[0].id,
    "landing-web",
  );
  assert.equal(filterLandingJobs("React", "Design").length, 0);
  assert.equal(filterLandingJobs("", "Tutoring").length, 0);
  assert.equal(filterLandingJobs("unknown keyword", "").length, 0);
});

test("landing route renders Figma sections, safe discovery and existing auth navigation", async () => {
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
    const html = renderToStaticMarkup(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/"] },
        React.createElement(AuthProvider, null, React.createElement(AppRouter)),
      ),
    );
    for (const text of [
      "Find real work. Build your reputation.",
      "How it works",
      "Featured jobs",
      "Top-rated students",
      "Why MIU Freelance",
      "Demo content:",
    ])
      assert.ok(html.includes(text), text);
    for (const path of [
      "/projects",
      "/services",
      "/login",
      "/register",
      "/register?role=client",
    ])
      assert.ok(html.includes(`href="${path}"`), path);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.match(html, /role="search"/);
    assert.match(html, /<label[^>]+for="landing-query"/);
    assert.match(html, /<dialog[^>]+aria-labelledby="preview-title"/);
    assert.doesNotMatch(
      html,
      /routing placeholder only|figma\.com\/api\/mcp\/asset|\/client\/projects\/new/,
    );
    assert.equal((html.match(/class="landing-avatar"/g) ?? []).length, 3);
  } finally {
    await vite.close();
  }
});

test("public project routes render marketplace screens, not placeholders", async () => {
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
      ["/register", "Choose your account role"],
      ["/register?role=student", "Create a student account"],
      ["/register?role=client", "Create a client account"],
      ["/register?role=super_admin", "Choose your account role"],
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
      assert.match(html, /Public navigation/);
      assert.match(html, /href="\/login"[^>]*>Sign In/);
      assert.match(html, /href="\/register"[^>]*>Sign Up/);
      assert.doesNotMatch(
        html,
        /Simulated session controls|Demo navigation|Phase 1 routing demonstration/,
      );
      if (
        !["/register/role", "/register", "/register?role=super_admin"].includes(
          path,
        )
      ) {
        assert.match(html, /<form/);
        assert.match(html, /<label[^>]+for=/);
        assert.match(html, /Simulated authentication/);
      }
      if (path === "/register") {
        assert.match(html, /href="\/register\?role=student"/);
        assert.match(html, /href="\/register\?role=client"/);
        assert.doesNotMatch(html, /<form/);
      }
      if (path === "/login") {
        assert.match(
          html,
          /<\/button><p[^>]*><a[^>]*href="\/forgot-password"[^>]*>Forgot Password\?<\/a>/,
        );
      }
    }
  } finally {
    await vite.close();
  }
});
