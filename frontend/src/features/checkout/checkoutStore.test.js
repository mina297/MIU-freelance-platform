import test from "node:test";
import assert from "node:assert/strict";
import {
  createCheckoutStore,
  clientServiceOrders,
  clientTransactions,
} from "./checkoutStore.js";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
const session = {
  status: "authenticated",
  user: {
    id: "client_001",
    displayName: "Nile Studio",
    role: "client",
    accountStatus: "active",
  },
};
const payment = { method: "visa", cardId: "card_visa", acknowledged: true };
const args = {
  session,
  payment,
  orderId: "order_002",
  now: new Date("2026-10-24T12:00:00Z"),
};
test("successful initial funding creates one safe transaction and updates shared order views", () => {
  const store = createCheckoutStore(),
    before = JSON.stringify(marketplaceData);
  assert.equal(clientTransactions(store.getSnapshot(), session).length, 0);
  assert.equal(
    clientServiceOrders(store.getSnapshot(), session)[0].status,
    "awaiting_payment",
  );
  const result = store.fundInitial({
    ...args,
    payment: {
      ...payment,
      cardNumber: "discard",
      cvc: "discard",
      apiKey: "discard",
    },
  });
  assert.equal(result.ok, true);
  const txn = result.transaction;
  assert.equal(txn.amountPaidMinor, 110000);
  assert.equal(txn.remainingMinor, 110000);
  assert.equal(txn.escrowHeldMinor, 110000);
  assert.equal(txn.servicePriceMinor, 220000);
  assert.equal(txn.paymentDate, "2026-10-24T12:00:00.000Z");
  assert.equal(txn.paymentStatus, "partially_paid_escrow_held");
  assert.equal(txn.escrowStatus, "held");
  assert.equal(txn.releasedMinor, 0);
  assert.equal(txn.completedAt, null);
  assert.equal(txn.workProgress, 0);
  assert.equal(txn.demo, true);
  for (const field of [
    "cardNumber",
    "number",
    "cvc",
    "apiKey",
    "holder",
    "expiry",
  ])
    assert.equal(field in txn, false);
  assert.equal(
    clientServiceOrders(store.getSnapshot(), session)[0].status,
    "in_progress",
  );
  assert.equal(
    clientServiceOrders(store.getSnapshot(), session)[0].transaction,
    txn,
  );
  assert.equal(clientTransactions(store.getSnapshot(), session)[0], txn);
  assert.equal(JSON.stringify(marketplaceData), before);
  assert.ok(Object.isFrozen(txn));
});
test("repeated confirmations and revisits never charge or create a second transaction", () => {
  const store = createCheckoutStore();
  const first = store.fundInitial(args),
    snapshot = store.getSnapshot();
  for (let i = 0; i < 10; i++) {
    const retry = store.fundInitial(args);
    assert.equal(retry.duplicate, true);
    assert.equal(retry.transaction, first.transaction);
  }
  assert.equal(store.getSnapshot(), snapshot);
  assert.equal(snapshot.transactions.length, 1);
  assert.equal(snapshot.transactions[0].releasedMinor, 0);
});
test("failure, cancellation and validation failure preserve order and history", () => {
  for (const outcome of ["failure", "cancelled"]) {
    const store = createCheckoutStore(),
      snapshot = store.getSnapshot();
    assert.equal(store.fundInitial({ ...args, outcome }).ok, false);
    assert.equal(store.getSnapshot(), snapshot);
    assert.equal(
      clientServiceOrders(snapshot, session)[0].status,
      "awaiting_payment",
    );
    assert.equal(store.fundInitial(args).ok, true);
  }
  const store = createCheckoutStore(),
    snapshot = store.getSnapshot();
  for (const invalid of [
    {},
    { ...payment, acknowledged: false },
    { ...payment, method: "mastercard" },
  ]) {
    assert.equal(
      store.fundInitial({ ...args, payment: invalid }).code,
      "validation",
    );
    assert.equal(store.getSnapshot(), snapshot);
  }
});
test("all access paths enforce active client role and order ownership", () => {
  const store = createCheckoutStore();
  store.fundInitial(args);
  for (const invalid of [
    { status: "anonymous", user: null },
    { ...session, status: "expired" },
    { ...session, user: { ...session.user, role: "student" } },
    { ...session, user: { ...session.user, role: "super_admin" } },
    { ...session, user: { ...session.user, accountStatus: "suspended" } },
    { ...session, user: { ...session.user, id: "client_other" } },
  ]) {
    assert.equal(store.fundInitial({ ...args, session: invalid }).ok, false);
    assert.deepEqual(clientTransactions(store.getSnapshot(), invalid), []);
    assert.deepEqual(clientServiceOrders(store.getSnapshot(), invalid), []);
  }
  for (const orderId of ["missing", "order_001"])
    assert.equal(store.fundInitial({ ...args, orderId }).ok, false);
});
test("Apple Pay is simulated without storing any wallet or card credentials", () => {
  const store = createCheckoutStore();
  const result = store.fundInitial({
    ...args,
    payment: { method: "apple_pay", acknowledged: true },
  });
  assert.equal(result.ok, true);
  assert.equal(result.transaction.last4, null);
  assert.equal(result.transaction.paymentMethod, "apple_pay");
});
test("store subscriptions publish only successful funding and unsubscribe cleanly", () => {
  const store = createCheckoutStore();
  let calls = 0;
  const unsubscribe = store.subscribe(() => calls++);
  store.fundInitial({ ...args, outcome: "failure" });
  assert.equal(calls, 0);
  store.fundInitial(args);
  assert.equal(calls, 1);
  unsubscribe();
  store.fundInitial(args);
  assert.equal(calls, 1);
});
test("non-payable service status cannot be funded", () => {
  const data = {
    ...marketplaceData,
    orders: marketplaceData.orders.map((item) => ({
      ...item,
      status: "completed",
    })),
  };
  assert.equal(createCheckoutStore(data).fundInitial(args).code, "status");
});
