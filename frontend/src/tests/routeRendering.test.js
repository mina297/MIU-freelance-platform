import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import {
  filterLandingJobs,
  filterLandingStudents,
} from "../features/public/landingData.js";
import { getTimelineMotion } from "../features/public/timelineMotion.js";

test("scroll timeline reveals and highlights each step as its light reaches the node", () => {
  assert.deepEqual(getTimelineMotion([800, 1200, 1600], 1000), {
    progress: 0,
    activeIndex: -1,
    revealed: [false, false, false],
  });
  const first = getTimelineMotion([600, 1000, 1400], 1000);
  assert.equal(first.progress, 0.1);
  assert.equal(first.activeIndex, 0);
  assert.deepEqual(first.revealed, [true, false, false]);
  const second = getTimelineMotion([200, 600, 1000], 1000);
  assert.equal(second.progress, 0.6);
  assert.equal(second.activeIndex, 1);
  assert.deepEqual(second.revealed, [true, true, false]);
  assert.deepEqual(getTimelineMotion([-500, -100, 300], 1000), {
    progress: 1,
    activeIndex: 2,
    revealed: [true, true, true],
  });
});

test("timeline supports reverse scrolling, viewport changes and collapsed layouts", () => {
  assert.ok(
    getTimelineMotion([0, 400, 800], 1000).progress >
      getTimelineMotion([300, 700, 1100], 1000).progress,
  );
  assert.equal(getTimelineMotion([300, 700, 1100], 500).activeIndex, 0);
  assert.equal(getTimelineMotion([300, 700, 1100], 1200).activeIndex, 1);
  assert.equal(getTimelineMotion([100, 100, 100], 1000).progress, 0);
});

test("extended timeline draws before the first node and finishes beyond the last", () => {
  const beforeFirst = getTimelineMotion([700, 1100, 1500], 1000, 32);
  assert.equal(beforeFirst.progress, 12 / 864);
  assert.equal(beforeFirst.activeIndex, -1);
  const firstNode = getTimelineMotion([680, 1080, 1480], 1000, 32);
  assert.equal(firstNode.progress, 32 / 864);
  assert.equal(firstNode.activeIndex, 0);
  assert.equal(getTimelineMotion([-152, 248, 648], 1000, 32).progress, 1);
});

test("Hire discovery combines student names and skills with categories and empty recovery", () => {
  assert.equal(filterLandingStudents("", "").length, 3);
  assert.equal(
    filterLandingStudents("  REACT  ", "Development")[0].id,
    "landing-omar",
  );
  assert.equal(filterLandingStudents("nour", "Design")[0].id, "landing-nour");
  assert.equal(
    filterLandingStudents("Arabic", "Translation")[0].id,
    "landing-mariam",
  );
  assert.equal(filterLandingStudents("React", "Design").length, 0);
  assert.equal(filterLandingStudents("", "Tutoring").length, 0);
  assert.equal(filterLandingStudents("unknown keyword", "").length, 0);
});

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

test("search example names resolve to their existing job and talent categories", () => {
  assert.equal(
    filterLandingJobs("Software development", "")[0].id,
    "landing-web",
  );
  assert.equal(
    filterLandingStudents("Software development", "")[0].id,
    "landing-omar",
  );
  assert.equal(
    filterLandingStudents("Content writing", "")[0].id,
    "landing-mariam",
  );
  assert.equal(filterLandingJobs("Video editing", "").length, 0);
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
      "Prototype content:",
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
    assert.match(html, /aria-label="Choose Hire or Work"/);
    assert.match(html, /aria-pressed="false">Hire<\/button>/);
    assert.match(html, /aria-pressed="true">Work<\/button>/);
    assert.match(html, /All categories/);
    assert.match(html, /Explore categories/);
    assert.doesNotMatch(html.replace(/<[^>]*>/g, " "), /\bdemo\b/i);
    assert.match(html, /Software development/);
    assert.match(html, /Video editing/);
    assert.match(html, /aria-label="Scroll categories left"/);
    assert.match(html, /aria-label="Scroll categories right"/);
    assert.match(html, /id="landing-category-track"[^>]*tabindex="0"/);
    assert.equal(
      (html.match(/class="landing-category-card"/g) ?? []).length,
      7,
    );
    assert.equal((html.match(/class="landing-step-number"/g) ?? []).length, 3);
    assert.match(html, /<ol class="landing-timeline-list">/);
    assert.doesNotMatch(html, /data-motion-ready="true"/);
    const hero = html.match(
      /<section class="landing-hero"[\s\S]*?<\/section>/,
    )[0];
    assert.doesNotMatch(hero, /landing-category-card/);
    assert.ok(html.indexOf('id="categories-title"') > html.indexOf(hero));
    assert.ok(
      html.indexOf('id="categories-title"') < html.indexOf('id="how-it-works"'),
    );
    assert.match(html, /Hire Talent/);
    assert.match(html, /Find Work/);
    assert.equal((html.match(/aria-expanded="false"/g) ?? []).length, 3);
    assert.match(html, /href="\/#student-talent"/);
    assert.match(html, /href="\/register\?role=student"/);
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
      ["/login", "Sign in"],
      ["/register", "Choose your account role"],
      ["/register?role=student", "Join as a student"],
      ["/register?role=client", "Join as a client"],
      ["/register?role=super_admin", "Choose your account role"],
      ["/register/role", "Choose your account role"],
      ["/forgot-password", "Forgot password"],
      ["/reset-password", "Reset password"],
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
      assert.doesNotMatch(html.replace(/<[^>]*>/g, " "), /\bdemo\b/i);
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
        assert.match(html, /Prototype/);
        assert.match(html, /Resets on refresh/);
        assert.match(html, /class="auth-input"/);
        assert.match(html, /required=""/);
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
