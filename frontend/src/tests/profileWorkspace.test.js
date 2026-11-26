import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { navigationItems } from "../components/navigation/navigationModel.js";
import {
  getLoginDestination,
  getRegistrationDestination,
} from "../features/auth/navigation.js";
import { routeConfig } from "../app/routeConfig.js";

test("participant profiles are the landing destination and navigation omits the duplicate profile section", () => {
  for (const role of ["student", "client"]) {
    const user = {
      id: `${role}_001`,
      role,
      displayName: "Profile owner",
      accountStatus: "active",
    };
    assert.equal(getRegistrationDestination(user), "/profile");
    for (const requested of [
      undefined,
      "/student/dashboard",
      "/projects",
      "https://outside.test",
    ])
      assert.equal(
        getLoginDestination(user, requested, routeConfig),
        "/profile",
      );
    assert.ok(
      !navigationItems({ status: "authenticated", user }).some(
        (item) => item.section === "profile",
      ),
    );
  }
  const staff = {
    id: "admin_001",
    role: "super_admin",
    displayName: "Admin",
    accountStatus: "active",
  };
  assert.equal(
    getLoginDestination(staff, "https://outside.test", routeConfig),
    "/admin",
  );
  assert.equal(getLoginDestination(staff, "/profile", routeConfig), "/admin");
  assert.equal(
    getLoginDestination(
      staff,
      "/admin?section=committee-accounts",
      routeConfig,
    ),
    "/admin?section=committee-accounts",
  );
});

test("profile workspace derives the active owner and public preview hides editing controls", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: Router } = await vite.ssrLoadModule("/src/app/router.jsx");
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const render = (
      path,
      role = "student",
      id = `${role}_001`,
      status = "authenticated",
    ) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            AuthContext.Provider,
            {
              value: {
                session: {
                  status,
                  user:
                    status === "authenticated"
                      ? {
                          id,
                          role,
                          displayName: "Profile owner",
                          accountStatus: "active",
                        }
                      : null,
                },
              },
            },
            React.createElement(Router),
          ),
        ),
      );
    for (const role of ["student", "client"]) {
      const own = render("/profile", role);
      assert.match(own, /View public profile/);
      assert.match(own, /Profile settings/);
      assert.equal((own.match(/<main\b/g) ?? []).length, 1);
      assert.match(
        own,
        /href="\/profile"[^>]*class="application-profile-link"|class="application-profile-link"[^>]*href="\/profile"/,
      );
      const preview = render(
        `/${role === "student" ? "students" : "clients"}/${role}_001?view=public`,
        role,
      );
      assert.doesNotMatch(
        preview,
        /class="profile-action[^>]*>.*Profile settings<\/button>/,
      );
      assert.doesNotMatch(preview, />Profile settings<\/span>/);
      assert.doesNotMatch(preview, /<button[^>]*>Add portfolio item<\/button>/);
    }
    const student = render("/profile");
    for (const label of [
      "About Me",
      "Work Stats",
      "Education",
      "Experience",
      "Languages",
    ])
      assert.ok(student.includes(label));
    assert.doesNotMatch(
      student,
      /100%|Ahmed Mohamed|Frontend Developer Intern/,
    );
    assert.doesNotMatch(
      render("/profile", "super_admin", "admin_001"),
      /View public profile/,
    );
    assert.doesNotMatch(
      render("/profile", "student", "student_001", "anonymous"),
      /View public profile/,
    );
    assert.doesNotMatch(
      render("/students/student_002"),
      /class="profile-hero__actions"/,
    );
  } finally {
    await vite.close();
  }
});
