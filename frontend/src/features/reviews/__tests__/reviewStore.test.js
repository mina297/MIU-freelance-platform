import test from "node:test";
import assert from "node:assert/strict";
import { createReviewStore } from "../reviewStore.js";

const client = {
  status: "authenticated",
  user: {
    id: "client_001",
    role: "client",
    displayName: "Nile Studio",
    accountStatus: "active",
    verificationStatus: "approved",
  },
};
const completed = {
  id: "order_live",
  studentId: "student_002",
  clientId: "client_001",
  status: "completed",
  sourceType: "project",
  sourceId: "project_live",
};
const values = {
  orderId: completed.id,
  rating: 5,
  body: "A fictional review of a completed collaboration.",
};

test("review mutation checks current client ownership, role, status and scoped student", () => {
  const store = createReviewStore(() => [completed]);
  for (const session of [
    null,
    { status: "anonymous", user: null },
    { ...client, status: "expired" },
    { ...client, user: { ...client.user, id: "foreign" } },
    { ...client, user: { ...client.user, role: "student" } },
    { ...client, user: { ...client.user, accountStatus: "suspended" } },
  ]) {
    assert.deepEqual(store.eligibleOrders(session), []);
    assert.equal(store.submit(values, session).ok, false);
  }
  assert.equal(store.submit(values, client, "student_001").ok, false);
  assert.equal(
    store.submit({ ...values, orderId: "m5_sample_order_005" }, client).ok,
    false,
  );
  assert.equal(store.getSnapshot().length, 0);
});

test("both order sources become reviewable only after live completion and duplicates cannot inflate ratings", () => {
  for (const sourceType of ["project", "service"]) {
    let order = { ...completed, sourceType, status: "in_progress" };
    const store = createReviewStore(() => [order]);
    assert.deepEqual(store.eligibleOrders(client), []);
    assert.equal(store.submit(values, client).ok, false);
    order = { ...order, status: "completed" };
    assert.equal(store.eligibleOrders(client, order.studentId).length, 1);
    const first = store.submit(
      { ...values, reviewerClientId: "forged", targetStudentId: "forged" },
      client,
    );
    assert.equal(first.ok, true);
    assert.equal(first.review.reviewerClientId, client.user.id);
    assert.equal(first.review.targetStudentId, completed.studentId);
    assert.ok(Object.isFrozen(first.review));
    assert.equal(store.submit(values, client).ok, false);
    assert.equal(store.getSnapshot().length, 1);
    assert.deepEqual(store.eligibleOrders(client), []);
    assert.equal(createReviewStore(() => [order]).getSnapshot().length, 0);
  }
});

test("stale review selections recheck order lifecycle and reject invalid review payloads atomically", () => {
  let order = completed;
  const store = createReviewStore(() => [order]);
  assert.equal(store.eligibleOrders(client).length, 1);
  order = { ...order, status: "disputed" };
  assert.equal(store.submit(values, client).ok, false);
  order = completed;
  for (const patch of [
    { rating: 2.5 },
    { rating: 0 },
    { rating: NaN },
    { body: "short" },
    { body: "x".repeat(801) },
  ])
    assert.equal(store.submit({ ...values, ...patch }, client).ok, false);
  assert.equal(store.getSnapshot().length, 0);
});
