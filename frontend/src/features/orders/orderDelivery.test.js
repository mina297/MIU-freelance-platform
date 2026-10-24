import test from "node:test";
import assert from "node:assert/strict";
import { createOrderStore } from "./orderStore.js";
import { createOrderWorkspaceStore } from "./orderWorkspaceStore.js";
import { workspaceTimeline } from "./orderWorkspaceModel.js";

const client = {
  status: "authenticated",
  user: {
    id: "client_delivery",
    role: "client",
    displayName: "Fictional Client",
    accountStatus: "active",
    verificationStatus: "approved",
  },
};
const student = {
  ...client,
  user: {
    ...client.user,
    id: "student_delivery",
    role: "student",
    displayName: "Fictional Student",
  },
};
const seed = {
  id: "order_delivery",
  sourceType: "project",
  sourceId: "project_delivery",
  proposalId: "proposal_delivery",
  servicePackageId: null,
  serviceExtraIds: [],
  clientId: client.user.id,
  studentId: student.user.id,
  agreedAmountEGP: 2500,
  deliveryDays: 7,
  status: "in_progress",
  createdAt: "2000-01-01T00:00:00Z",
  completedAt: null,
};
const values = () => ({
  text: " Fictional completed work and handover ",
  attachmentIds: ["delivery_sample_work"],
});

test("project and service delivery cycles retain history and agreed terms through revision/resubmission/completion", () => {
  for (const sourceType of ["project", "service"]) {
    const original = {
      ...seed,
      sourceType,
      serviceTerms:
        sourceType === "service"
          ? Object.freeze({
              packageName: "Saved package",
              packagePriceEGP: 2500,
            })
          : undefined,
    };
    const store = createOrderStore([original]);
    const before = store.getSnapshot();
    const first = store.submitDelivery(
      seed.id,
      {
        ...values(),
        submittedBy: "forged",
        status: "completed",
        agreedAmountEGP: 1,
      },
      student,
      null,
      "first",
    );
    assert.equal(first.ok, true);
    assert.equal(first.order.status, "delivered");
    assert.equal(first.delivery.submittedBy, student.user.id);
    const revision = store.requestRevision(
      seed.id,
      { text: "Clarify the fictional introduction." },
      client,
      first.delivery.id,
      "revision",
    );
    assert.equal(revision.ok, true);
    assert.equal(revision.order.status, "revision_requested");
    assert.equal(revision.delivery.revision.requestedBy, client.user.id);
    const second = store.submitDelivery(
      seed.id,
      { ...values(), text: "Revised fictional handover" },
      student,
      first.delivery.id,
      "second",
    );
    assert.equal(second.ok, true);
    assert.equal(second.order.deliveries.length, 2);
    assert.equal(second.order.deliveries[0].status, "revision_requested");
    const accepted = store.acceptDelivery(
      seed.id,
      client,
      second.delivery.id,
      "accept",
    );
    assert.equal(accepted.ok, true);
    assert.equal(accepted.order.status, "completed");
    assert.ok(accepted.order.completedAt);
    assert.equal(accepted.order.deliveries[1].status, "accepted");
    assert.equal(accepted.order.agreedAmountEGP, seed.agreedAmountEGP);
    assert.equal(accepted.order.deliveryDays, seed.deliveryDays);
    assert.equal(accepted.order.serviceTerms, original.serviceTerms);
    assert.equal(accepted.order.deliveryEvents.length, 4);
    assert.equal(before[0].status, "in_progress");
    assert.equal(original.completedAt, null);
    assert.ok(Object.isFrozen(accepted.order.deliveries));
    assert.ok(Object.isFrozen(accepted.order.deliveries[0].revision));
    assert.ok(Object.isFrozen(accepted.delivery.attachmentIds));
  }
});

test("delivery actions recheck active participant roles and approved demo verification", () => {
  const store = createOrderStore([seed]);
  const before = store.getSnapshot();
  for (const session of [
    null,
    { status: "anonymous", user: null },
    { ...student, status: "expired" },
    { ...student, user: { ...student.user, id: "foreign" } },
    { ...student, user: { ...student.user, accountStatus: "suspended" } },
    { ...student, user: { ...student.user, role: "super_admin" } },
    { ...student, user: { ...student.user, verificationStatus: "pending" } },
    client,
  ])
    assert.equal(
      store.submitDelivery(seed.id, values(), session, null, "bad").ok,
      false,
    );
  assert.equal(
    store.submitDelivery("missing", values(), student, null, "bad").ok,
    false,
  );
  assert.equal(store.getSnapshot(), before);
  const sent = store.submitDelivery(seed.id, values(), student, null, "send");
  assert.equal(
    store.requestRevision(
      seed.id,
      { text: "Changes" },
      student,
      sent.delivery.id,
      "bad",
    ).ok,
    false,
  );
  assert.equal(
    store.acceptDelivery(seed.id, student, sent.delivery.id, "bad").ok,
    false,
  );
  assert.equal(
    store.acceptDelivery(
      seed.id,
      { ...client, user: { ...client.user, verificationStatus: "pending" } },
      sent.delivery.id,
      "bad",
    ).ok,
    false,
  );
});

test("awaiting payment, funded, terminal and disputed orders cannot bypass lifecycle through delivery", () => {
  for (const status of [
    "awaiting_payment",
    "funded",
    "completed",
    "cancelled",
    "disputed",
    "unknown",
  ]) {
    const store = createOrderStore([{ ...seed, status }]);
    const before = store.getSnapshot();
    assert.equal(
      store.submitDelivery(seed.id, values(), student, null, "attempt").ok,
      false,
    );
    assert.equal(
      store.acceptDelivery(seed.id, client, null, "attempt").ok,
      false,
    );
    assert.equal(
      store.requestRevision(
        seed.id,
        { text: "Changes" },
        client,
        null,
        "attempt",
      ).ok,
      false,
    );
    assert.equal(store.getSnapshot(), before);
  }
});

test("invalid delivery notes/sample IDs and missing confirmation tokens fail atomically", () => {
  const store = createOrderStore([seed]);
  const before = store.getSnapshot();
  for (const invalid of [
    { text: " " },
    { text: 42 },
    { text: "x".repeat(3001) },
    { attachmentIds: ["real-work.zip"] },
    { attachmentIds: ["delivery_sample_work", "delivery_sample_work"] },
    { attachmentIds: null },
  ])
    assert.equal(
      store.submitDelivery(
        seed.id,
        { ...values(), ...invalid },
        student,
        null,
        "bad",
      ).ok,
      false,
    );
  assert.equal(
    store.submitDelivery(seed.id, values(), student, null, "").ok,
    false,
  );
  assert.equal(store.getSnapshot(), before);
  const sent = store.submitDelivery(seed.id, values(), student, null, "send");
  assert.equal(
    store.requestRevision(
      seed.id,
      { text: " " },
      client,
      sent.delivery.id,
      "bad",
    ).ok,
    false,
  );
});

test("duplicate delivery/review confirmations do not add records, and stale reviews cannot target a newer submission", () => {
  const store = createOrderStore([seed]);
  let notifications = 0;
  store.subscribe(() => notifications++);
  const sent = store.submitDelivery(seed.id, values(), student, null, "first");
  assert.equal(
    store.submitDelivery(seed.id, values(), student, null, "first").duplicate,
    true,
  );
  assert.equal(
    store.submitDelivery(
      seed.id,
      { ...values(), text: "Different" },
      student,
      null,
      "first",
    ).ok,
    false,
  );
  assert.equal(
    store.requestRevision(
      seed.id,
      { text: "Changes" },
      client,
      "stale-id",
      "bad",
    ).ok,
    false,
  );
  const revision = store.requestRevision(
    seed.id,
    { text: "Changes" },
    client,
    sent.delivery.id,
    "revise",
  );
  assert.equal(
    store.requestRevision(
      seed.id,
      { text: "Changes" },
      client,
      sent.delivery.id,
      "revise",
    ).duplicate,
    true,
  );
  const second = store.submitDelivery(
    seed.id,
    values(),
    student,
    revision.delivery.id,
    "second",
  );
  assert.equal(
    store.acceptDelivery(seed.id, client, sent.delivery.id, "stale").ok,
    false,
  );
  assert.equal(
    store.acceptDelivery(seed.id, client, second.delivery.id, "accept").ok,
    true,
  );
  assert.equal(
    store.acceptDelivery(seed.id, client, second.delivery.id, "accept")
      .duplicate,
    true,
  );
  assert.equal(
    store.acceptDelivery(
      seed.id,
      client,
      second.delivery.id,
      "new-after-complete",
    ).ok,
    false,
  );
  assert.equal(
    store.submitDelivery(
      seed.id,
      values(),
      student,
      second.delivery.id,
      "after-complete",
    ).ok,
    false,
  );
  assert.equal(notifications, 4);
});

test("completion closes workspace writes and contributes recorded delivery events without funding milestones", () => {
  const orders = createOrderStore([seed]);
  const workspace = createOrderWorkspaceStore((id) =>
    orders.getSnapshot().find((order) => order.id === id),
  );
  const sent = orders.submitDelivery(seed.id, values(), student, null, "one");
  const complete = orders.acceptDelivery(
    seed.id,
    client,
    sent.delivery.id,
    "two",
  );
  assert.equal(
    workspace.sendMessage(
      seed.id,
      { text: "After completion", attachmentIds: [] },
      client,
      "no",
    ).ok,
    false,
  );
  assert.equal(
    workspace.saveRequirements(
      seed.id,
      { text: "After completion", attachmentIds: [] },
      client,
      0,
    ).ok,
    false,
  );
  const events = workspaceTimeline(
    complete.order,
    workspace.read(seed.id, client),
  );
  assert.deepEqual(
    events.map(({ label }) => label),
    [
      "Demo order created",
      "Student submitted demo delivery",
      "Client accepted delivery — demo order completed",
    ],
  );
});
