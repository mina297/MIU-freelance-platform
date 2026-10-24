import test from "node:test";
import assert from "node:assert/strict";
import { createProjectStore } from "./projectStore.js";
import { createProposalStore } from "../proposals/proposalStore.js";

const client = {
  status: "authenticated",
  user: {
    id: "lifecycle_client",
    displayName: "Demo Studio",
    role: "client",
    accountStatus: "active",
    verificationStatus: "approved",
  },
};
const project = {
  id: "lifecycle_project",
  clientId: client.user.id,
  title: "A fictional website",
  status: "open",
  createdAt: "2026-10-20T00:00:00Z",
  updatedAt: "2026-10-20T00:00:00Z",
};
const empty = () => ({ orders: [], proposals: [] });

test("closing and cancelling preserve the record and reject repeated or unsupported transitions", () => {
  const store = createProjectStore([project], empty);
  assert.equal(store.transition(project.id, client, "reopen").ok, false);
  const closed = store.transition(project.id, client, "close");
  assert.equal(closed.project.status, "closed");
  assert.equal(closed.project.id, project.id);
  assert.equal(closed.project.createdAt, project.createdAt);
  assert.equal(project.status, "open");
  const snapshot = store.getSnapshot();
  assert.equal(store.transition(project.id, client, "close").ok, false);
  assert.equal(store.getSnapshot(), snapshot);
  assert.equal(
    store.transition(project.id, client, "cancel").project.status,
    "cancelled",
  );
  assert.equal(store.transition(project.id, client, "cancel").ok, false);
  assert.equal(store.transition(project.id, client, "close").ok, false);
  assert.equal(store.update({}, client, project.id).ok, false);
});

test("actions require active ownership and an eligible project state", () => {
  for (const action of ["close", "cancel"]) {
    const store = createProjectStore([project], empty);
    for (const session of [
      null,
      { status: "anonymous", user: null },
      { ...client, status: "expired" },
      { ...client, user: { ...client.user, id: "other_client" } },
      { ...client, user: { ...client.user, role: "student" } },
      { ...client, user: { ...client.user, accountStatus: "suspended" } },
    ])
      assert.equal(store.transition(project.id, session, action).ok, false);
    assert.equal(store.getSnapshot().length, 0);
    assert.equal(store.transition("missing", client, action).ok, false);
    for (const status of ["draft", "selected", "under_review", "cancelled"])
      assert.equal(
        createProjectStore([{ ...project, status }], empty).transition(
          project.id,
          client,
          action,
        ).ok,
        false,
      );
  }
  assert.equal(
    createProjectStore([project], empty).transition(
      project.id,
      { ...client, user: { ...client.user, verificationStatus: "pending" } },
      "close",
    ).ok,
    true,
  );
});

test("orders and accepted proposals block actions and are rechecked at confirmation time", () => {
  let commitments = empty();
  const store = createProjectStore([project], () => commitments);
  assert.equal(store.transitionError(project.id, client, "cancel"), null);
  for (const status of [
    "awaiting_payment",
    "in_progress",
    "completed",
    "cancelled",
  ]) {
    commitments = {
      orders: [{ sourceType: "project", sourceId: project.id, status }],
      proposals: [],
    };
    for (const action of ["close", "cancel"])
      assert.equal(store.transition(project.id, client, action).ok, false);
  }
  commitments = {
    orders: [],
    proposals: [{ projectId: project.id, status: "accepted" }],
  };
  assert.equal(store.transition(project.id, client, "cancel").ok, false);
  assert.equal(store.getSnapshot().length, 0);
  commitments = {
    orders: [{ sourceType: "service", sourceId: project.id }],
    proposals: [{ projectId: project.id, status: "submitted" }],
  };
  assert.equal(store.transition(project.id, client, "cancel").ok, true);
});

test("proposal submission reads the latest status and existing proposals are preserved", () => {
  const store = createProjectStore([project], empty);
  const proposals = createProposalStore(
    (id) => store.getSnapshot().find((record) => record.id === id) ?? project,
  );
  const student = {
    status: "authenticated",
    user: {
      id: "lifecycle_student",
      displayName: "Demo Student",
      role: "student",
      accountStatus: "active",
      verificationStatus: "approved",
    },
  };
  const values = {
    priceEGP: "1200",
    deliveryDays: "10",
    coverMessage: "Fictional proposal",
    attachmentIds: [],
  };
  const existing = proposals.submit(values, project.id, student).proposal;
  store.transition(project.id, client, "close");
  assert.equal(proposals.find(project.id, student.user.id), existing);
  assert.equal(
    proposals.submit(values, project.id, {
      ...student,
      user: { ...student.user, id: "another_student" },
    }).ok,
    false,
  );
  store.transition(project.id, client, "cancel");
  assert.equal(proposals.submit(values, project.id, student).ok, false);
  assert.equal(proposals.find(project.id, student.user.id), existing);
});
