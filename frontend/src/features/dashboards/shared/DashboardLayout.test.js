import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";
import {
  applications,
  activeJobs,
  dashboardStudent,
  selectStudentRecords,
} from "../student/studentDashboardModel.js";

test("shared layout validates URL sections, preserves zero badges and renders role-specific shells", async () => {
  const vite = await createServer({
    root: fileURLToPath(new URL("../../../../", import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: Layout } = await vite.ssrLoadModule(
      "/src/features/dashboards/shared/DashboardLayout.jsx",
    );
    const render = (entry, variant = "student") =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [entry] },
          React.createElement(Layout, {
            title: "Dashboard",
            variant,
            defaultSection: "overview",
            mainId: "test-main",
            navItems: [
              { id: "overview", label: "Overview" },
              { id: "jobs", label: "Jobs", badge: 0 },
            ],
            children: ({ activeSection }) =>
              React.createElement("h1", null, activeSection),
          }),
        ),
      );
    assert.match(render("/?section=jobs"), /<h1>jobs<\/h1>/);
    assert.match(render("/?section=jobs"), /class="cd-nav-count">0<\/b>/);
    for (const entry of ["/", "/?section=unknown", "/?section=registration"]) {
      assert.match(render(entry), /<h1>overview<\/h1>/);
    }
    assert.match(
      render("/", "client"),
      /class="student-dashboard client-dashboard"/,
    );
    const admin = render("/", "admin");
    assert.match(admin, /class="ac-sidebar"/);
    assert.match(admin, /href="#test-main"/);
    assert.equal((admin.match(/<main /g) ?? []).length, 1);
  } finally {
    await vite.close();
  }
});

test("student panels preserve fixture values and isolate empty scenarios", async () => {
  const snapshot = JSON.stringify({
    applications,
    activeJobs,
    dashboardStudent,
  });
  assert.equal(selectStudentRecords("sample").rows, applications);
  assert.equal(selectStudentRecords("error").jobs, activeJobs);
  assert.deepEqual(selectStudentRecords("empty"), { rows: [], jobs: [] });
  const vite = await createServer({
    root: fileURLToPath(new URL("../../../../", import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { StudentSectionViews } = await vite.ssrLoadModule(
      "/src/features/dashboards/student/StudentDashboardPanels.jsx",
    );
    const render = (section, scenario) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(StudentSectionViews, {
            section,
            scenario,
            ...selectStudentRecords(scenario),
            setDetail() {},
            navigate() {},
            notifications: true,
            setNotifications() {},
          }),
        ),
      );
    const overview = render("overview", "sample");
    assert.match(overview, /48,000/);
    assert.match(overview, /4\.9/);
    assert.match(overview, /60%/);
    assert.match(overview, /25%/);
    assert.equal((overview.match(/class="sd-table-row"/g) ?? []).length, 6);
    const empty = render("overview", "empty");
    assert.doesNotMatch(empty, /48,000|class="sd-table-row"/);
    assert.match(empty, /No active projects or service orders yet/);
    assert.match(render("settings", "sample"), /checked/);
    assert.doesNotMatch(render("settings", "sample"), /class="sd-table-row"/);
    assert.equal(
      JSON.stringify({ applications, activeJobs, dashboardStudent }),
      snapshot,
    );
  } finally {
    await vite.close();
  }
});
