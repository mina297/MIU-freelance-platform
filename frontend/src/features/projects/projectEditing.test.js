import test from "node:test";
import assert from "node:assert/strict";
import {
  createProjectStore,
  mergeProjects,
  projectStore,
} from "./projectStore.js";
import { EMPTY_PROJECT, projectFormValues } from "./projectCreation.js";
import { getProjectById, findProjects } from "../marketplace/selectors.js";

const session = {
  status: "authenticated",
  user: {
    id: "edit_client",
    displayName: "Demo Studio",
    role: "client",
    accountStatus: "active",
    verificationStatus: "approved",
  },
};
const pending = {
  ...session,
  user: { ...session.user, verificationStatus: "pending" },
};
const other = { ...session, user: { ...session.user, id: "other_client" } };
const values = {
  ...EMPTY_PROJECT,
  title: "Original title",
  description: "Fictional website",
  scope: "A schedule",
  deliverables: "Schedule page",
  categoryId: "web_development",
  requiredSkillIds: ["react"],
  budgetEGP: "4500",
  deadline: "2099-12-31",
};

test("partial drafts remain private, allow pending clients, and retain only allowlisted form data", () => {
  const store = createProjectStore();
  const draft = store.saveDraft(
    {
      ...EMPTY_PROJECT,
      title: "A first idea",
      clientId: "attacker",
      extra: "ignored",
    },
    pending,
    "draft1",
  );
  assert.equal(draft.ok, true);
  assert.equal(store.getSnapshot().length, 0);
  assert.equal(draft.project.clientId, session.user.id);
  assert.equal(draft.project.values.extra, undefined);
  assert.ok(Object.isFrozen(draft.project.values.requiredSkillIds));
  assert.equal(store.findOwned(draft.project.id, other), null);
  assert.equal(
    store.findOwned(draft.project.id, { status: "anonymous", user: null }),
    null,
  );
  assert.equal(store.findOwned(draft.project.id, pending), draft.project);
  assert.equal(
    store.saveDraft(
      { ...EMPTY_PROJECT, title: "x".repeat(121) },
      pending,
      "draft2",
    ).ok,
    false,
  );
  const resumed = projectFormValues(draft.project);
  resumed.requiredSkillIds.push("react");
  assert.equal(draft.project.values.requiredSkillIds.length, 0);
});

test("saving and publishing a draft preserves identity and removes its private draft representation", () => {
  const store = createProjectStore();
  const first = store.saveDraft(
    { ...EMPTY_PROJECT },
    pending,
    "draft1",
  ).project;
  const second = store.saveDraft(
    { ...values },
    pending,
    "resume-token",
    first.id,
  ).project;
  assert.equal(second.id, first.id);
  assert.equal(store.getWorkspaceSnapshot().length, 1);
  assert.equal(store.update(values, pending, first.id).ok, false);
  assert.equal(
    store.update({ ...values, title: " " }, session, first.id).ok,
    false,
  );
  assert.equal(store.findOwned(first.id, session).status, "draft");
  const published = store.update(values, session, first.id).project;
  assert.equal(published.id, first.id);
  assert.equal(published.createdAt, first.createdAt);
  assert.equal(published.status, "open");
  assert.equal(store.getSnapshot().length, 1);
  assert.equal(store.getWorkspaceSnapshot().length, 1);
  assert.equal(store.saveDraft(values, session, "draft1", first.id).ok, false);
});

test("editing rechecks ownership, activity, verification, validation and editable status", () => {
  const seed = [
    {
      ...values,
      id: "seed-open",
      clientId: session.user.id,
      budgetEGP: 4500,
      deliverables: ["Schedule"],
      status: "open",
      createdAt: "2026-10-01T00:00:00Z",
    },
    {
      ...values,
      id: "selected",
      clientId: session.user.id,
      status: "selected",
    },
  ];
  const store = createProjectStore(seed);
  for (const candidate of [
    other,
    pending,
    { ...session, status: "expired" },
    { ...session, user: { ...session.user, accountStatus: "suspended" } },
    { ...session, user: { ...session.user, role: "student" } },
  ]) {
    assert.equal(store.update(values, candidate, "seed-open").ok, false);
    assert.equal(
      store.saveDraft(values, candidate, "forged", "seed-open").ok,
      false,
    );
  }
  assert.equal(store.update(values, session, "missing").ok, false);
  assert.equal(store.update(values, session, "selected").ok, false);
  const result = store.update(
    {
      ...values,
      title: "Updated title",
      clientId: "other",
      status: "cancelled",
    },
    session,
    "seed-open",
  );
  assert.equal(result.project.clientId, session.user.id);
  assert.equal(result.project.status, "open");
  assert.equal(result.project.createdAt, seed[0].createdAt);
  assert.equal(seed[0].title, "Original title");
  assert.equal(mergeProjects(seed, store.getSnapshot()).length, 2);
});

test("edited fixtures replace originals in discovery and details; drafts never enter public queries", () => {
  const client = { ...session, user: { ...session.user, id: "client_001" } };
  const draft = projectStore.saveDraft(
    { ...EMPTY_PROJECT, title: "Private unpublished idea" },
    client,
    "private-test",
  ).project;
  assert.equal(getProjectById(draft.id), null);
  assert.equal(findProjects({ query: "Private unpublished idea" }).length, 0);
  const updated = projectStore.update(
    { ...values, title: "Edited event website" },
    client,
    "project_001",
  );
  assert.equal(updated.ok, true);
  assert.equal(getProjectById("project_001").title, "Edited event website");
  assert.equal(
    findProjects().filter(({ id }) => id === "project_001").length,
    1,
  );
});
