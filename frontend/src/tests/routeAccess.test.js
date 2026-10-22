import test from "node:test";
import assert from "node:assert/strict";
import { routeConfig } from "../app/routeConfig.js";
import { mockUsers } from "../data/fixtures/users.js";
import {
  getRouteAccess,
  INITIAL_SESSION,
  ROLES,
} from "../features/auth/session.js";

test("route registry has unique paths, valid roles and one public fallback", () => {
  assert.equal(
    new Set(routeConfig.map((route) => route.path)).size,
    routeConfig.length,
  );
  assert.equal(routeConfig.filter((route) => route.path === "*").length, 1);
  for (const route of routeConfig) {
    assert.ok(["public", "auth", "app", "admin"].includes(route.layout));
    assert.ok(["public", "authenticated", "roles"].includes(route.access));
    if (route.access === "roles") {
      assert.ok(route.roles.length > 0);
      assert.ok(
        route.roles.every((role) => Object.values(ROLES).includes(role)),
      );
    }
  }
});

test("visitors and expired sessions can browse public routes but cannot enter protected routes", () => {
  for (const route of routeConfig) {
    const isPublic = route.access === "public";
    assert.equal(
      getRouteAccess(INITIAL_SESSION, route),
      isPublic ? "allowed" : "login",
    );
    assert.equal(
      getRouteAccess({ status: "expired", user: null }, route),
      isPublic ? "allowed" : "expired",
    );
  }
});

test("students, clients and each committee can enter only their assigned workspace", () => {
  const workspaces = {
    [ROLES.STUDENT]: "/student/dashboard",
    [ROLES.CLIENT]: "/client/dashboard",
    [ROLES.SUPER_ADMIN]: "/admin",
    [ROLES.VERIFICATION]: "/committee/verification",
    [ROLES.MARKETPLACE]: "/committee/marketplace",
    [ROLES.FINANCE]: "/committee/finance",
    [ROLES.SUPPORT]: "/committee/support",
    [ROLES.AI_QUALITY]: "/committee/ai-quality",
  };
  for (const user of mockUsers) {
    for (const [role, path] of Object.entries(workspaces)) {
      const route = routeConfig.find((item) => item.path === path);
      assert.ok(route, `Missing workspace: ${path}`);
      assert.equal(
        getRouteAccess({ status: "authenticated", user }, route),
        user.role === role ? "allowed" : "denied",
        `${user.role}: ${route.path}`,
      );
    }
    for (const path of ["/verify", "/verify/pending", "/notifications"]) {
      const route = routeConfig.find((item) => item.path === path);
      const allowed =
        path === "/notifications" ||
        [ROLES.STUDENT, ROLES.CLIENT].includes(user.role);
      assert.equal(
        getRouteAccess({ status: "authenticated", user }, route),
        allowed ? "allowed" : "denied",
      );
    }
  }
});

test("inactive accounts and unknown roles are denied even in an existing session", () => {
  const protectedRoutes = routeConfig.filter(
    (route) => route.access !== "public",
  );
  for (const user of [
    { ...mockUsers[0], role: "unknown" },
    ...["suspended", "deactivated"].map((accountStatus) => ({
      ...mockUsers[0],
      accountStatus,
    })),
  ]) {
    for (const route of protectedRoutes)
      assert.equal(
        getRouteAccess({ status: "authenticated", user }, route),
        "denied",
      );
  }
  assert.equal(
    getRouteAccess(
      { status: "authenticated", user: mockUsers[0] },
      { access: "unknown" },
    ),
    "denied",
  );
});

test("pending verification does not gate role-level access in Task 01", () => {
  const studentDashboard = routeConfig.find(
    (route) => route.path === "/student/dashboard",
  );
  assert.equal(
    getRouteAccess(
      { status: "authenticated", user: mockUsers[0] },
      studentDashboard,
    ),
    "allowed",
  );
  assert.equal(mockUsers[0].verificationStatus, "pending");
});
