import test from "node:test";
import assert from "node:assert/strict";
import { validateProject, clientEligibility } from "./projectCreation.js";
import { createProjectStore, projectStore } from "./projectStore.js";
import { getProjectById, findProjects } from "../marketplace/selectors.js";

const values = {
  title: " Demo event website ",
  description: "A fictional event site.",
  scope: "Build an accessible schedule.",
  deliverables: "Schedule page\n\n Registration form ",
  categoryId: "web_development",
  requiredSkillIds: ["react"],
  budgetEGP: "6000.25",
  deadline: "2099-12-31",
};
const session = {
  status: "authenticated",
  user: {
    id: "creation_test_client",
    displayName: "Demo Studio",
    role: "client",
    accountStatus: "active",
    verificationStatus: "approved",
  },
};

test("project brief requires meaningful text, listed category and unique listed skills", () => {
  assert.deepEqual(validateProject(values), {});
  for (const field of ["title", "description", "scope", "deliverables"]) {
    assert.ok(validateProject({ ...values, [field]: " \n " })[field]);
    assert.ok(validateProject({ ...values, [field]: "x".repeat(6000) })[field]);
  }
  assert.ok(validateProject({ ...values, categoryId: "unknown" }).categoryId);
  for (const requiredSkillIds of [[], ["unknown"], ["react", "react"], null])
    assert.ok(
      validateProject({ ...values, requiredSkillIds }).requiredSkillIds,
    );
});

test("budgets reject nonpositive, unsafe and malformed amounts; dates reject impossible or past days", () => {
  for (const budgetEGP of [
    "0",
    "-1",
    "1e3",
    "1.001",
    "Infinity",
    "",
    "9007199254740991",
  ])
    assert.ok(validateProject({ ...values, budgetEGP }).budgetEGP, budgetEGP);
  for (const deadline of [
    "",
    "2099-02-29",
    "2099-13-01",
    "2026-10-24",
    "2026-10-23",
    "2099-1-1",
  ])
    assert.ok(
      validateProject({ ...values, deadline }, "2026-10-24").deadline,
      deadline,
    );
  assert.equal(
    validateProject({ ...values, deadline: "2028-02-29" }, "2026-10-24")
      .deadline,
    undefined,
  );
});

test("publishing rechecks active approved client access and never trusts submitted ownership", () => {
  const store = createProjectStore();
  for (const candidate of [
    null,
    { ...session, status: "expired" },
    { ...session, user: { ...session.user, role: "student" } },
    { ...session, user: { ...session.user, accountStatus: "suspended" } },
    { ...session, user: { ...session.user, verificationStatus: "pending" } },
  ]) {
    assert.equal(store.publish(values, candidate, "draft1").ok, false);
  }
  assert.equal(store.getSnapshot().length, 0);
  assert.equal(
    clientEligibility({
      ...session,
      user: { ...session.user, verificationStatus: "pending" },
    }),
    null,
  );
  const result = store.publish(
    { ...values, clientId: "other", status: "selected" },
    session,
    "draft1",
  );
  assert.equal(result.project.clientId, session.user.id);
  assert.equal(result.project.status, "open");
  assert.equal(result.project.title, "Demo event website");
  assert.deepEqual(result.project.deliverables, [
    "Schedule page",
    "Registration form",
  ]);
});

test("publish is idempotent per client draft, notifies subscribers, and keeps snapshots immutable", () => {
  const store = createProjectStore();
  const initial = store.getSnapshot();
  let updates = 0;
  const unsubscribe = store.subscribe(() => updates++);
  const first = store.publish(values, session, "draft1");
  assert.equal(store.publish(values, session, "draft1").project, first.project);
  assert.equal(store.getSnapshot().length, 1);
  assert.equal(updates, 1);
  assert.equal(initial.length, 0);
  assert.ok(Object.isFrozen(first.project.requiredSkillIds));
  unsubscribe();
  store.publish(values, session, "draft2");
  assert.equal(updates, 1);
  assert.equal(createProjectStore().getSnapshot().length, 0);
});

test("published projects join the default discovery and details queries without modifying fixture queries", () => {
  const result = projectStore.publish(values, session, "discovery-test");
  assert.equal(getProjectById(result.project.id), result.project);
  assert.ok(
    findProjects({ query: "Demo event", status: "open" }).some(
      ({ id }) => id === result.project.id,
    ),
  );
  assert.equal(getProjectById(result.project.id, { projects: [] }), null);
});
