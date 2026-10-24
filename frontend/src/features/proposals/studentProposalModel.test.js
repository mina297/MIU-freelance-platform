import test from "node:test";
import assert from "node:assert/strict";
import { createProposalStore } from "./proposalStore.js";
import { filterStudentProposals } from "./studentProposalModel.js";

const student = {
  status: "authenticated",
  user: {
    id: "student_management",
    displayName: "Demo Student",
    role: "student",
    accountStatus: "active",
    verificationStatus: "approved",
  },
};
const project = {
  id: "student_project",
  clientId: "client_management",
  title: "A fictional event website",
  status: "open",
};
const seed = [
  {
    id: "owned",
    projectId: project.id,
    studentId: student.user.id,
    priceEGP: 4000,
    deliveryDays: 15,
    coverMessage: "Original offer",
    attachmentIds: [],
    status: "shortlisted",
    submittedAt: "2026-10-21T00:00:00Z",
    updatedAt: "2026-10-21T00:00:00Z",
  },
  {
    id: "another_student",
    projectId: project.id,
    studentId: "other_student",
    priceEGP: 5000,
    deliveryDays: 10,
    coverMessage: "Other private cover",
    attachmentIds: [],
    status: "submitted",
    submittedAt: "2026-10-21T00:00:00Z",
    updatedAt: "2026-10-21T00:00:00Z",
  },
];
const values = {
  priceEGP: "4200.50",
  deliveryDays: "12",
  coverMessage: " Updated offer ",
  attachmentIds: ["demo_attachment_plan"],
};

test("student list filters enforce ownership, combine search/status, and leave source order unchanged", () => {
  const result = filterStudentProposals(
    seed,
    student.user.id,
    { query: "EVENT", status: "shortlisted" },
    () => project,
  );
  assert.deepEqual(
    result.map(({ id }) => id),
    ["owned"],
  );
  assert.equal(
    filterStudentProposals(
      seed,
      student.user.id,
      { query: "Other private", status: "all" },
      () => project,
    ).length,
    0,
  );
  assert.equal(seed[0].id, "owned");
});

test("editing preserves ownership, proposal identity, submission time and shortlist state", () => {
  const store = createProposalStore(
    () => project,
    seed,
    null,
    () => [],
  );
  const result = store.edit(
    "owned",
    {
      ...values,
      id: "forged",
      projectId: "forged",
      studentId: "forged",
      status: "accepted",
      submittedAt: "forged",
    },
    student,
  );
  assert.equal(result.ok, true);
  assert.equal(result.proposal.id, "owned");
  assert.equal(result.proposal.projectId, project.id);
  assert.equal(result.proposal.studentId, student.user.id);
  assert.equal(result.proposal.submittedAt, seed[0].submittedAt);
  assert.equal(result.proposal.status, "shortlisted");
  assert.equal(result.proposal.priceEGP, 4200.5);
  assert.equal(result.proposal.deliveryDays, 12);
  assert.equal(result.proposal.coverMessage, "Updated offer");
  assert.deepEqual(result.proposal.attachmentIds, ["demo_attachment_plan"]);
  assert.ok(Object.isFrozen(result.proposal.attachmentIds));
  assert.equal(seed[0].coverMessage, "Original offer");
  assert.equal(store.getSnapshot().length, 2);
});

test("editing validates all offer fields and attachment metadata without changing failed records", () => {
  const store = createProposalStore(
    () => project,
    seed,
    null,
    () => [],
  );
  const before = store.getSnapshot();
  for (const bad of [
    { priceEGP: "0" },
    { priceEGP: "1.001" },
    { priceEGP: "9007199254740991" },
    { deliveryDays: "1.5" },
    { coverMessage: " " },
    { coverMessage: 42 },
    { attachmentIds: ["unknown"] },
    { attachmentIds: ["demo_attachment_plan", "demo_attachment_plan"] },
  ])
    assert.equal(store.edit("owned", { ...values, ...bad }, student).ok, false);
  assert.equal(store.getSnapshot(), before);
});

test("mutations recheck session ownership, verification, status and newly linked orders", () => {
  let currentProject = project;
  let orders = [];
  const store = createProposalStore(
    () => currentProject,
    seed,
    null,
    () => orders,
  );
  for (const session of [
    null,
    { status: "anonymous", user: null },
    { ...student, status: "expired" },
    { ...student, user: { ...student.user, id: "other_student" } },
    { ...student, user: { ...student.user, role: "client" } },
    { ...student, user: { ...student.user, accountStatus: "suspended" } },
  ]) {
    assert.equal(store.edit("owned", values, session).ok, false);
    assert.equal(store.withdraw("owned", session).ok, false);
    assert.equal(store.findOwned("owned", session), null);
  }
  assert.equal(store.edit("missing", values, student).ok, false);
  assert.equal(store.edit("another_student", values, student).ok, false);
  assert.equal(
    store.edit("owned", values, {
      ...student,
      user: { ...student.user, verificationStatus: "pending" },
    }).ok,
    false,
  );
  for (const status of ["selected", "closed", "cancelled"]) {
    currentProject = { ...project, status };
    assert.equal(store.edit("owned", values, student).ok, false);
    assert.equal(store.withdraw("owned", student).ok, false);
  }
  currentProject = project;
  assert.equal(store.studentActionError("owned", student, "edit"), null);
  orders = [{ sourceType: "project", sourceId: project.id }];
  assert.equal(store.edit("owned", values, student).ok, false);
  assert.equal(store.withdraw("owned", student).ok, false);
});

test("accepted, rejected and withdrawn records cannot be edited or withdrawn", () => {
  for (const status of ["accepted", "rejected", "withdrawn"]) {
    const store = createProposalStore(
      () => project,
      [{ ...seed[0], status }],
      null,
      () => [],
    );
    assert.equal(store.edit("owned", values, student).ok, false);
    assert.equal(store.withdraw("owned", student).ok, false);
  }
  const committed = createProposalStore(
    () => project,
    [seed[0], { ...seed[1], status: "accepted" }],
    null,
    () => [],
  );
  assert.equal(committed.withdraw("owned", student).ok, false);
});

test("withdrawal retains the record, blocks client decisions, and cannot be undone by resubmitting", () => {
  const store = createProposalStore(
    () => project,
    seed,
    null,
    () => [],
  );
  const pending = {
    ...student,
    user: { ...student.user, verificationStatus: "pending" },
  };
  const result = store.withdraw("owned", pending);
  assert.equal(result.ok, true);
  assert.equal(result.proposal.status, "withdrawn");
  assert.equal(result.proposal.submittedAt, seed[0].submittedAt);
  assert.equal(store.getSnapshot().length, 2);
  assert.equal(store.withdraw("owned", student).ok, false);
  const client = {
    status: "authenticated",
    user: { ...student.user, id: project.clientId, role: "client" },
  };
  assert.equal(store.shortlist("owned", client, true).ok, false);
  assert.equal(store.decide("owned", client, "accept").ok, false);
  assert.equal(store.decide("owned", client, "reject").ok, false);
  assert.equal(
    store.submit(values, project.id, student).proposal,
    result.proposal,
  );
  assert.equal(store.find(project.id, student.user.id), result.proposal);
});
