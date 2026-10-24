import test from "node:test";
import assert from "node:assert/strict";
import { createProposalStore } from "./proposalStore.js";
import { createProjectStore } from "../projects/projectStore.js";
import { createOrderStore } from "../orders/orderStore.js";

const client = {
  status: "authenticated",
  user: {
    id: "decision_client",
    displayName: "Demo Client",
    role: "client",
    accountStatus: "active",
    verificationStatus: "approved",
  },
};
const project = {
  id: "decision_project",
  clientId: client.user.id,
  title: "Fictional project",
  status: "open",
  createdAt: "2026-10-20T00:00:00Z",
};
const seed = ["first", "second"].map((id, index) => ({
  id,
  projectId: project.id,
  studentId: `decision_student_${index}`,
  priceEGP: 4000 + index * 1000,
  deliveryDays: 10 + index,
  coverMessage: "Fictional approach",
  attachmentIds: [],
  status: "submitted",
  submittedAt: "2026-10-21T00:00:00Z",
  updatedAt: "2026-10-21T00:00:00Z",
}));
function setup() {
  const orders = createOrderStore();
  const projects = createProjectStore(
    [project],
    () => ({ orders: orders.getSnapshot(), proposals: seed }),
    orders,
  );
  const find = (id) =>
    projects.getWorkspaceSnapshot().find((record) => record.id === id);
  const proposals = createProposalStore(find, seed, projects.acceptProposal);
  return { orders, projects, proposals, find };
}

test("acceptance selects the project and creates exactly one awaiting-payment order with copied terms", () => {
  const { proposals, projects, orders, find } = setup();
  const accepted = proposals.decide("first", client, "accept");
  assert.equal(accepted.ok, true);
  assert.equal(accepted.proposal.status, "accepted");
  assert.equal(find(project.id).status, "selected");
  assert.equal(find(project.id).createdAt, project.createdAt);
  assert.equal(accepted.order.status, "awaiting_payment");
  assert.equal(accepted.order.agreedAmountEGP, 4000);
  assert.equal(accepted.order.deliveryDays, 10);
  assert.equal(accepted.order.clientId, client.user.id);
  assert.equal(accepted.order.studentId, seed[0].studentId);
  assert.equal(accepted.order.proposalId, "first");
  assert.equal(accepted.order.completedAt, null);
  assert.equal(accepted.order.servicePackageId, null);
  assert.deepEqual(accepted.order.serviceExtraIds, []);
  assert.equal(
    proposals.decide("first", client, "accept").order,
    accepted.order,
  );
  assert.equal(orders.getSnapshot().length, 1);
  assert.equal(proposals.decide("second", client, "accept").ok, false);
  assert.equal(proposals.getSnapshot()[1].status, "submitted");
  assert.equal(proposals.decide("first", client, "reject").ok, false);
  assert.equal(projects.transition(project.id, client, "cancel").ok, false);
  assert.equal(projects.transition(project.id, client, "close").ok, false);
  assert.equal(projects.update({}, client, project.id).ok, false);
  assert.equal(project.status, "open");
  assert.equal(seed[0].status, "submitted");
});

test("rejection preserves other offers and creates no order or project state change", () => {
  const { proposals, orders, find } = setup();
  const rejected = proposals.decide("first", client, "reject");
  assert.equal(rejected.proposal.status, "rejected");
  assert.equal(rejected.proposal.submittedAt, seed[0].submittedAt);
  assert.equal(
    proposals.decide("first", client, "reject").proposal,
    rejected.proposal,
  );
  assert.equal(proposals.decide("first", client, "accept").ok, false);
  assert.equal(orders.getSnapshot().length, 0);
  assert.equal(find(project.id).status, "open");
  assert.equal(proposals.getSnapshot()[1].status, "submitted");
});

test("decisions recheck current role, ownership, activity, project state and acceptance verification", () => {
  const { proposals, orders, projects } = setup();
  for (const session of [
    null,
    { status: "anonymous", user: null },
    { ...client, status: "expired" },
    { ...client, user: { ...client.user, id: "other" } },
    { ...client, user: { ...client.user, role: "student" } },
    { ...client, user: { ...client.user, accountStatus: "suspended" } },
  ]) {
    for (const decision of ["accept", "reject"])
      assert.equal(proposals.decide("first", session, decision).ok, false);
  }
  assert.equal(
    proposals.decide(
      "first",
      { ...client, user: { ...client.user, verificationStatus: "pending" } },
      "accept",
    ).ok,
    false,
  );
  assert.equal(proposals.decide("missing", client, "accept").ok, false);
  assert.equal(proposals.decide("first", client, "approve").ok, false);
  projects.transition(project.id, client, "close");
  assert.equal(proposals.decide("first", client, "accept").ok, false);
  assert.equal(proposals.decide("first", client, "reject").ok, false);
  assert.equal(orders.getSnapshot().length, 0);
  assert.equal(proposals.getSnapshot()[0].status, "submitted");
});

test("failed order handoff leaves proposal status unchanged and existing orders block another selection", () => {
  const failed = createProposalStore(
    () => project,
    seed,
    () => ({ ok: false, error: "Simulated unavailable handoff" }),
  );
  assert.equal(failed.decide("first", client, "accept").ok, false);
  assert.equal(failed.getSnapshot()[0].status, "submitted");
  const orders = createOrderStore([
    {
      id: "existing",
      sourceType: "project",
      sourceId: project.id,
      proposalId: "other_proposal",
      clientId: client.user.id,
      studentId: "someone",
      serviceExtraIds: [],
      status: "awaiting_payment",
    },
  ]);
  const projects = createProjectStore([project], null, orders);
  const proposals = createProposalStore(
    () => project,
    seed,
    projects.acceptProposal,
  );
  assert.equal(proposals.decide("first", client, "accept").ok, false);
  assert.equal(proposals.getSnapshot()[0].status, "submitted");
  assert.equal(projects.getWorkspaceSnapshot()[0].status, "open");
  assert.equal(orders.getSnapshot().length, 1);
});
