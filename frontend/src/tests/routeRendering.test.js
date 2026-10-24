import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import {
  filterLandingJobs,
  filterLandingStudents,
  getStudentShowcase,
  landingStudents,
} from "../features/public/landingData.js";
import { getTimelineMotion } from "../features/public/timelineMotion.js";

test("student showcase centers the highest rating without mutating records and handles filtered results", () => {
  const { orderedStudents, featuredStudentId } =
    getStudentShowcase(landingStudents);
  assert.equal(featuredStudentId, "landing-omar");
  assert.equal(orderedStudents[1].id, featuredStudentId);
  assert.equal(landingStudents[0].id, "landing-nour");
  const changed = landingStudents.map((student) => ({
    ...student,
    rating: student.id === "landing-nour" ? "5.0" : "4.9",
  }));
  assert.equal(
    getStudentShowcase(changed).orderedStudents[1].id,
    "landing-nour",
  );
  assert.equal(
    getStudentShowcase([landingStudents[2]]).featuredStudentId,
    "landing-mariam",
  );
  assert.deepEqual(getStudentShowcase([]), {
    orderedStudents: [],
    featuredStudentId: null,
  });
  assert.equal(
    getStudentShowcase([landingStudents[0], landingStudents[2]])
      .featuredStudentId,
    "landing-mariam",
  );
});

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
      assert.ok(html.replace(/<[^>]*>/g, "").includes(text), text);
    for (const path of [
      "/projects",
      "/services",
      "/login",
      "/register",
      "/register?role=client",
    ])
      assert.ok(html.includes(`href="${path}"`), path);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    const pathways = html.match(/<nav class="landing-pathways"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(pathways, "Homepage offers both marketplace entry paths");
    assert.match(pathways, /href="\/projects"/);
    assert.match(pathways, /href="\/services"/);
    const invitation = html.match(/<section class="landing-invitation"[\s\S]*?<\/section>/)?.[0];
    assert.ok(invitation, "Homepage ends with role-specific registration links");
    assert.match(invitation, /href="\/register\?role=student"/);
    assert.match(invitation, /href="\/register\?role=client"/);
    assert.equal(
      (html.match(/class="landing-section landing-overlap-panel/g) ?? [])
        .length,
      4,
    );
    for (const id of [
      "how-it-works",
      "featured-jobs",
      "student-talent",
      "trust",
    ]) {
      assert.match(
        html,
        new RegExp(`<div id="${id}" class="landing-overlap-backdrop`),
      );
    }
    assert.match(html, /role="search"/);
    assert.match(html, /aria-label="Choose Hire or Work"/);
    assert.match(html, /aria-pressed="false">Hire<\/button>/);
    assert.match(html, /aria-pressed="true">Work<\/button>/);
    assert.match(html, /All categories/);
    assert.match(html, /Explore categories/);
    assert.doesNotMatch(
      html,
      /Phase 1 demo session controls|Simulated session controls|Demo navigation/,
    );
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
    const studentCards = [
      ...html.matchAll(
        /<article class="landing-card landing-student[^"]*"[\s\S]*?<\/article>/g,
      ),
    ].map((match) => match[0]);
    assert.equal(studentCards.length, 3);
    assert.match(studentCards[1], /landing-student-featured/);
    assert.match(studentCards[1], /Omar Hassan/);
    assert.match(studentCards[1], /Highest-rated student in these results/);
  } finally {
    await vite.close();
  }
});

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
      assert.ok(html.replace(/<[^>]*>/g, "").includes(text), path);
      assert.equal((html.match(/<main\b/g) ?? []).length, 1, path);
      assert.equal((html.match(/<footer\b/g) ?? []).length, 1, path);
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1, path);
      assert.match(
        html,
        path === "/" ? /class="public-header"/ : /miu-public-header/,
      );
      assert.doesNotMatch(
        html,
        /Phase 1 demo session controls|Simulated session controls|Demo navigation/,
      );
      assert.doesNotMatch(
        html,
        /routing placeholder only|href="\/services\/service_/,
      );
      if (path === "/how-it-works")
        assert.equal(
          (html.match(/<section class="m4-how-it-works"/g) ?? []).length,
          1,
        );
    }
    const home = renderRoute("/");
    assert.match(home, /href="\/projects"/);
    assert.doesNotMatch(home, /m4-landing|miu-public-footer/);
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
    assert.match(loggedIn, /Sign out/);
    assert.doesNotMatch(
      loggedIn,
      /Simulated session controls|Phase 1 demo session controls/,
    );
    assert.doesNotMatch(loggedIn, />Log in<|>Sign up</);
    for (const role of ["student", "client"]) {
      const dashboard = renderRoute(
        `/${role}/dashboard`,
        AuthContext.Provider,
        {
          session: {
            status: "authenticated",
            user: {
              id: `registered_${role}`,
              displayName: "New account",
              role,
              accountStatus: "active",
              verificationStatus: "pending",
            },
          },
        },
      );
      assert.match(dashboard, /My workspace/);
      assert.match(dashboard, /Sign out/);
      assert.doesNotMatch(
        dashboard,
        /Simulated session controls|Demo navigation|Phase 1 routing demonstration/,
      );
    }
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
