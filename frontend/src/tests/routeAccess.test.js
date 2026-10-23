import test from "node:test";
import assert from "node:assert/strict";
import { routeConfig } from "../app/routeConfig.js";
import { mockUsers } from "../data/fixtures/users.js";
import { createProposalStore } from "../features/proposals/proposalStore.js";

test("mock submission revalidates eligibility, preserves identity and prevents duplicate records", () => {
  let project = { id: "project_test", status: "open" };
  const store = createProposalStore(() => project);
  const session = {
    status: "authenticated",
    user: mockUsers.find((user) => user.id === "student_002"),
  };
  const values = {
    priceEGP: "900.50",
    deliveryDays: "3",
    coverMessage: "  My approach  ",
  };
  const first = store.submit(values, project.id, session);
  assert.equal(first.ok, true);
  assert.equal(first.proposal.studentId, session.user.id);
  assert.equal(first.proposal.projectId, project.id);
  assert.equal(first.proposal.priceEGP, 900.5);
  assert.equal(first.proposal.coverMessage, "My approach");
  assert.equal(first.proposal.status, "submitted");
  const repeated = store.submit(values, project.id, session);
  assert.equal(repeated.duplicate, true);
  assert.equal(repeated.proposal.id, first.proposal.id);
  assert.equal(store.find(project.id, "other_student"), null);
  assert.equal(
    store.submit({ ...values, priceEGP: "-1" }, project.id, session).ok,
    false,
  );
  assert.equal(
    store.submit(values, project.id, { status: "anonymous", user: null }).ok,
    false,
  );
  project = { ...project, status: "closed" };
  assert.equal(store.submit(values, project.id, session).ok, false);
  assert.equal(createProposalStore().find(project.id, session.user.id), null);
});
import { validateProposal } from "../features/proposals/validateProposal.js";

test("proposal validation checks fields, verified student eligibility and project availability", () => {
  const session = {
    status: "authenticated",
    user: { ...mockUsers[0], role: "student", verificationStatus: "approved" },
  };
  const project = { status: "open" };
  const values = {
    priceEGP: "1200.50",
    deliveryDays: "7",
    coverMessage: "I will build the requested pages.",
  };
  assert.deepEqual(validateProposal(values, project, session), {});
  for (const priceEGP of ["", "0", "-5", "Infinity", "12.345"])
    assert.ok(
      validateProposal({ ...values, priceEGP }, project, session).priceEGP,
    );
  for (const deliveryDays of ["", "0", "1.5", "-1"])
    assert.ok(
      validateProposal({ ...values, deliveryDays }, project, session)
        .deliveryDays,
    );
  assert.ok(
    validateProposal({ ...values, coverMessage: "  " }, project, session)
      .coverMessage,
  );
  assert.ok(validateProposal(values, null, session).project);
  assert.ok(validateProposal(values, { status: "closed" }, session).project);
  assert.ok(
    validateProposal(values, project, { status: "anonymous", user: null })
      .eligibility,
  );
  for (const change of [
    { role: "client" },
    { accountStatus: "suspended" },
    { verificationStatus: "pending" },
  ])
    assert.ok(
      validateProposal(values, project, {
        ...session,
        user: { ...session.user, ...change },
      }).eligibility,
    );
});
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
    assert.ok(
      ["standalone", "public", "auth", "app", "admin"].includes(route.layout),
    );
    assert.ok(["public", "authenticated", "roles"].includes(route.access));
    assert.ok(
      route.showInNavigation === undefined ||
        typeof route.showInNavigation === "boolean",
    );
    if (route.access === "roles") {
      assert.ok(route.roles.length > 0);
      assert.ok(
        route.roles.every((role) => Object.values(ROLES).includes(role)),
      );
    }
  }
});

test("dynamic project details remain routable but are hidden from global navigation", () => {
  const projectDetails = routeConfig.find(
    (route) => route.path === "/projects/:projectId",
  );

  assert.ok(projectDetails);
  assert.equal(projectDetails.access, "public");
  assert.equal(projectDetails.showInNavigation, false);
});

test("proposal entry admits only active students and stays out of navigation", () => {
  const route = routeConfig.find(
    (item) => item.path === "/projects/:projectId/propose",
  );
  assert.ok(route);
  assert.equal(route.showInNavigation, false);
  assert.equal(getRouteAccess(INITIAL_SESSION, route), "login");
  assert.equal(
    getRouteAccess({ status: "expired", user: null }, route),
    "expired",
  );
  for (const user of mockUsers) {
    assert.equal(
      getRouteAccess({ status: "authenticated", user }, route),
      user.role === ROLES.STUDENT ? "allowed" : "denied",
    );
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
