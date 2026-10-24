import test from "node:test";
import assert from "node:assert/strict";
import { createProposalStore } from "./proposalStore.js";
import { filterClientProposals } from "./clientProposalModel.js";

const client = {
  status: "authenticated",
  user: {
    id: "client_review",
    displayName: "Demo Client",
    role: "client",
    accountStatus: "active",
    verificationStatus: "approved",
  },
};
const seed = [
  {
    id: "first",
    projectId: "project_review",
    studentId: "student_001",
    priceEGP: 5000,
    deliveryDays: 20,
    coverMessage: "Accessible website",
    attachmentIds: [],
    status: "submitted",
    submittedAt: "2026-10-21T00:00:00Z",
    updatedAt: "2026-10-21T00:00:00Z",
  },
  {
    id: "second",
    projectId: "project_review",
    studentId: "student_002",
    priceEGP: 6000,
    deliveryDays: 10,
    coverMessage: "Responsive site",
    attachmentIds: [],
    status: "shortlisted",
    submittedAt: "2026-10-22T00:00:00Z",
    updatedAt: "2026-10-22T00:00:00Z",
  },
];

test("proposal filters combine student names, text and status without mutating source order", () => {
  assert.deepEqual(
    filterClientProposals(seed, { query: "SALMA", status: "submitted" }).map(
      ({ id }) => id,
    ),
    ["first"],
  );
  assert.equal(
    filterClientProposals(seed, { query: "website", status: "shortlisted" })
      .length,
    0,
  );
  assert.deepEqual(
    filterClientProposals(seed, { sort: "price" }).map(({ id }) => id),
    ["first", "second"],
  );
  assert.deepEqual(
    filterClientProposals(seed, { sort: "delivery" }).map(({ id }) => id),
    ["second", "first"],
  );
  assert.deepEqual(
    filterClientProposals(seed).map(({ id }) => id),
    ["second", "first"],
  );
  assert.equal(seed[0].id, "first");
});

test("shortlisting preserves offer data, is idempotent, and updates the student's record", () => {
  const store = createProposalStore(
    () => ({ id: "project_review", clientId: client.user.id, status: "open" }),
    seed,
  );
  let changes = 0;
  const unsubscribe = store.subscribe(() => changes++);
  const before = store.getSnapshot();
  const result = store.shortlist("first", client, true);
  assert.equal(result.ok, true);
  assert.equal(result.proposal.status, "shortlisted");
  assert.equal(result.proposal.priceEGP, 5000);
  assert.equal(result.proposal.submittedAt, seed[0].submittedAt);
  assert.equal(store.find("project_review", "student_001"), result.proposal);
  assert.notEqual(store.getSnapshot(), before);
  assert.equal(seed[0].status, "submitted");
  assert.equal(
    store.shortlist("first", client, true).proposal,
    result.proposal,
  );
  assert.equal(changes, 1);
  assert.equal(
    store.shortlist("first", client, false).proposal.status,
    "submitted",
  );
  unsubscribe();
  store.shortlist("first", client, true);
  assert.equal(changes, 2);
});

test("shortlist updates recheck ownership, role, activity, project status and action value", () => {
  let project = {
    id: "project_review",
    clientId: client.user.id,
    status: "open",
  };
  const store = createProposalStore(() => project, seed);
  for (const session of [
    null,
    { status: "anonymous", user: null },
    { ...client, status: "expired" },
    { ...client, user: { ...client.user, id: "other_client" } },
    { ...client, user: { ...client.user, role: "student" } },
    { ...client, user: { ...client.user, accountStatus: "suspended" } },
  ])
    assert.equal(store.shortlist("first", session, true).ok, false);
  assert.equal(store.shortlist("missing", client, true).ok, false);
  assert.equal(store.shortlist("first", client, "yes").ok, false);
  for (const status of ["closed", "cancelled", "selected"]) {
    project = { ...project, status };
    assert.equal(store.shortlist("first", client, true).ok, false);
  }
  project = { ...project, status: "open" };
  for (const status of ["accepted", "withdrawn", "rejected"]) {
    const terminal = createProposalStore(
      () => project,
      [{ ...seed[0], status }],
    );
    assert.equal(terminal.shortlist("first", client, true).ok, false);
  }
  assert.equal(store.getSnapshot()[0].status, "submitted");
});

test("new submissions join review snapshots; seeded duplicates cannot replace existing offers", () => {
  const project = {
    id: "project_review",
    clientId: client.user.id,
    status: "open",
  };
  const store = createProposalStore(() => project, seed);
  const student = {
    status: "authenticated",
    user: {
      id: "new_student",
      displayName: "Demo Student",
      role: "student",
      accountStatus: "active",
      verificationStatus: "approved",
    },
  };
  const values = {
    priceEGP: "4500",
    deliveryDays: "12",
    coverMessage: "A fictional plan",
    attachmentIds: [],
  };
  assert.equal(store.submit(values, project.id, student).ok, true);
  assert.equal(store.getSnapshot().length, 3);
  const duplicate = store.submit(values, project.id, {
    ...student,
    user: { ...student.user, id: "student_001" },
  });
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.proposal.priceEGP, seed[0].priceEGP);
  assert.equal(store.getSnapshot().length, 3);
});
