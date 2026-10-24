import test from "node:test";
import assert from "node:assert/strict";
import { createOrderWorkspaceStore } from "./orderWorkspaceStore.js";
import { workspaceTimeline } from "./orderWorkspaceModel.js";

const client = {
  status: "authenticated",
  user: {
    id: "client_ws",
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
    id: "student_ws",
    role: "student",
    displayName: "Fictional Student",
    verificationStatus: "pending",
  },
};
const initial = Object.freeze({
  id: "order_ws",
  sourceType: "project",
  clientId: client.user.id,
  studentId: student.user.id,
  status: "in_progress",
  agreedAmountEGP: 3000,
  createdAt: "2000-01-01T00:00:00Z",
});
const values = () => ({
  text: " Fictional coordination note ",
  attachmentIds: ["order_sample_requirements"],
});

test("workspace reads and mutations require current active participants, not merely matching IDs", () => {
  const store = createOrderWorkspaceStore((id) =>
    id === initial.id ? initial : null,
  );
  for (const session of [
    null,
    { status: "anonymous", user: null },
    { ...client, status: "expired" },
    { ...client, user: { ...client.user, id: "foreign" } },
    { ...client, user: { ...client.user, role: "super_admin" } },
    { ...client, user: { ...client.user, role: "student" } },
    { ...student, user: { ...student.user, accountStatus: "suspended" } },
  ]) {
    assert.equal(store.read(initial.id, session), null);
    assert.equal(
      store.saveRequirements(initial.id, values(), session, 0).ok,
      false,
    );
    assert.equal(
      store.sendMessage(initial.id, values(), session, "request").ok,
      false,
    );
  }
  assert.equal(store.read("missing", client), null);
  assert.equal(
    store.sendMessage("missing", values(), client, "request").ok,
    false,
  );
  assert.deepEqual(store.getSnapshot(), []);
});

test("client requirements are versioned, visible to both participants and cannot amend order terms", () => {
  const store = createOrderWorkspaceStore(() => initial);
  const first = store.saveRequirements(
    initial.id,
    { ...values(), status: "completed", agreedAmountEGP: 1, savedBy: "forged" },
    client,
    0,
  );
  assert.equal(first.ok, true);
  assert.equal(first.requirements.text, "Fictional coordination note");
  assert.equal(first.requirements.savedBy, client.user.id);
  assert.equal(first.requirements.version, 1);
  assert.equal(
    store.read(initial.id, student).requirements,
    first.requirements,
  );
  assert.equal(
    store.saveRequirements(
      initial.id,
      { ...values(), text: "Stale overwrite" },
      client,
      0,
    ).ok,
    false,
  );
  assert.equal(
    store.saveRequirements(initial.id, values(), student, 1).ok,
    false,
  );
  assert.equal(
    store.saveRequirements(initial.id, values(), client, 1).duplicate,
    true,
  );
  assert.equal(
    store.saveRequirements(
      initial.id,
      { ...values(), text: "Updated notes" },
      client,
      1,
    ).requirements.version,
    2,
  );
  assert.equal(initial.status, "in_progress");
  assert.equal(initial.agreedAmountEGP, 3000);
  assert.ok(Object.isFrozen(first.requirements.attachmentIds));
});

test("message retries are idempotent per order/sender and only allow safe immutable sample metadata", () => {
  const store = createOrderWorkspaceStore(() => initial);
  const before = store.getSnapshot();
  let updates = 0;
  const stop = store.subscribe(() => updates++);
  const first = store.sendMessage(
    initial.id,
    {
      ...values(),
      senderId: "forged",
      senderRole: "client",
      orderId: "forged",
    },
    student,
    "message-token",
  );
  assert.equal(first.ok, true);
  assert.equal(first.message.senderId, student.user.id);
  assert.equal(first.message.senderRole, "student");
  assert.equal(first.message.orderId, initial.id);
  assert.equal(
    store.sendMessage(initial.id, values(), student, "message-token").message,
    first.message,
  );
  assert.equal(
    store.sendMessage(
      initial.id,
      { ...values(), text: "Different text" },
      student,
      "message-token",
    ).ok,
    false,
  );
  assert.equal(
    store.sendMessage(initial.id, values(), client, "message-token").ok,
    true,
  );
  assert.equal(store.read(initial.id, student).messages.length, 2);
  assert.equal(updates, 2);
  assert.deepEqual(before, []);
  assert.ok(Object.isFrozen(first.message));
  assert.ok(Object.isFrozen(first.message.attachmentIds));
  stop();
});

test("invalid text, duplicate/foreign attachment IDs and missing request tokens do not mutate snapshots", () => {
  const store = createOrderWorkspaceStore(() => initial);
  const before = store.getSnapshot();
  for (const change of [
    { text: " " },
    { text: 42 },
    { text: "x".repeat(5001) },
    { attachmentIds: ["real-file.pdf"] },
    { attachmentIds: ["order_sample_reference", "order_sample_reference"] },
    { attachmentIds: "order_sample_reference" },
    { attachmentIds: null },
  ]) {
    assert.equal(
      store.saveRequirements(initial.id, { ...values(), ...change }, client, 0)
        .ok,
      false,
    );
    assert.equal(
      store.sendMessage(initial.id, { ...values(), ...change }, client, "token")
        .ok,
      false,
    );
  }
  assert.equal(
    store.sendMessage(
      initial.id,
      { ...values(), text: "x".repeat(2001) },
      student,
      "token",
    ).ok,
    false,
  );
  assert.equal(store.sendMessage(initial.id, values(), student, "").ok, false);
  assert.equal(store.getSnapshot(), before);
});

test("status changes are rechecked; final orders retain readable history but block new messages/notes", () => {
  let current = {
    ...initial,
    sourceType: "service",
    status: "awaiting_payment",
  };
  const store = createOrderWorkspaceStore(() => current);
  assert.equal(
    store.saveRequirements(initial.id, values(), client, 0).ok,
    true,
  );
  assert.equal(
    store.sendMessage(initial.id, values(), student, "before-payment").ok,
    true,
  );
  assert.equal(current.status, "awaiting_payment");
  for (const status of ["delivered", "disputed"]) {
    current = { ...current, status };
    assert.equal(
      store.saveRequirements(initial.id, values(), client, 1).ok,
      false,
    );
    assert.equal(
      store.sendMessage(initial.id, values(), client, status).ok,
      true,
    );
  }
  for (const status of ["completed", "cancelled", "unknown"]) {
    current = { ...current, status };
    assert.equal(
      store.saveRequirements(initial.id, values(), client, 1).ok,
      false,
    );
    assert.equal(
      store.sendMessage(initial.id, values(), client, status).ok,
      false,
    );
    assert.ok(store.read(initial.id, student));
  }
  current = { ...current, studentId: "reassigned_student" };
  assert.equal(store.read(initial.id, student), null);
  assert.equal(
    store.sendMessage(initial.id, values(), student, "stale-owner").ok,
    false,
  );
});

test("timeline includes only creation and recorded workspace events; messages stay isolated by order", () => {
  const second = {
    ...initial,
    id: "second_order",
    studentId: "second_student",
  };
  const store = createOrderWorkspaceStore((id) =>
    id === initial.id ? initial : id === second.id ? second : null,
  );
  store.saveRequirements(initial.id, values(), client, 0);
  store.sendMessage(initial.id, values(), student, "one");
  const timeline = workspaceTimeline(initial, store.read(initial.id, client));
  assert.deepEqual(
    timeline.map(({ label }) => label),
    [
      "Demo order created",
      "Client requirements notes saved",
      "Demo message added",
    ],
  );
  assert.equal(store.read(second.id, client).messages.length, 0);
  assert.equal(store.read(second.id, student), null);
  const sameTime = {
    requirements: null,
    messages: [],
    events: [
      { id: "z", label: "First update", createdAt: initial.createdAt },
      { id: "a", label: "Second update", createdAt: initial.createdAt },
    ],
  };
  assert.deepEqual(
    workspaceTimeline(initial, sameTime).map(({ label }) => label),
    ["Demo order created", "First update", "Second update"],
  );
  assert.equal(
    store.read(initial.id, {
      ...student,
      user: { ...student.user, id: "second_student" },
    }),
    null,
  );
});
