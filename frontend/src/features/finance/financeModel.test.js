import test from "node:test";
import assert from "node:assert/strict";
import {
  financeOrders,
  financeTransactions,
  financeSummary,
  filterTransactions,
  financeReviewReducer,
  createFinanceReviewState,
} from "./financeModel.js";
const event = {
  type: "review",
  transactionId: "fin_txn_06",
  reason: "Dispute context reviewed.",
  actor: "Demo Finance Reviewer",
  timestamp: "2026-10-23T12:00:00Z",
  eventId: "review_test",
};
test("the ledger reconciles and pending/failed events never count as settled funds", () => {
  assert.deepEqual(financeSummary(financeTransactions), {
    funding: 1700000,
    payouts: 380000,
    revenue: 20000,
    refunds: 0,
    held: 1300000,
    pendingPayouts: 285000,
    pendingRefunds: 250000,
    pendingFees: 15000,
  });
  assert.equal(
    financeSummary(financeTransactions.filter((t) => t.status === "Completed"))
      .held,
    1300000,
  );
  assert.equal(financeSummary([]).held, 0);
});
test("every transaction uses safe integer minor units and an existing order", () => {
  assert.equal(
    new Set(financeTransactions.map((t) => t.id)).size,
    financeTransactions.length,
  );
  for (const transaction of financeTransactions) {
    assert.ok(
      Number.isSafeInteger(transaction.amountMinor) &&
        transaction.amountMinor > 0,
    );
    assert.ok(financeOrders.some((o) => o.id === transaction.orderId));
  }
  const balances = financeOrders.map(
    (o) =>
      financeSummary(financeTransactions.filter((t) => t.orderId === o.id))
        .held,
  );
  assert.deepEqual(balances, [750000, 0, 250000, 300000, 0]);
  assert.equal(
    balances.reduce((a, b) => a + b, 0),
    financeSummary(financeTransactions).held,
  );
});
test("search combines reference/participant/order text, status and event type", () => {
  assert.deepEqual(
    filterTransactions(financeTransactions, {
      query: " DEMO NILE ",
      type: "Payout",
      status: "Completed",
    }).map((t) => t.id),
    ["fin_txn_03"],
  );
  assert.deepEqual(
    filterTransactions(financeTransactions, { query: "DEMO-fin_txn_10" }).map(
      (t) => t.id,
    ),
    ["fin_txn_10"],
  );
  assert.equal(
    filterTransactions(financeTransactions, { query: "missing" }).length,
    0,
  );
});
test("review and escalation record audit events without moving funds or mutating the ledger", () => {
  const ledgerBefore = JSON.stringify(financeTransactions);
  const state = createFinanceReviewState();
  const reviewed = financeReviewReducer(state, event);
  assert.equal(state.audit.length, 0);
  assert.equal(reviewed.reviews.fin_txn_06, "Reviewed");
  assert.equal(reviewed.audit[0].before, "Unreviewed");
  assert.equal(reviewed.audit[0].reason, event.reason);
  assert.equal(financeReviewReducer(reviewed, event), reviewed);
  const escalated = financeReviewReducer(reviewed, {
    ...event,
    type: "escalate",
    eventId: "review_2",
  });
  assert.equal(escalated.audit[0].destination, "Super Admin");
  assert.equal(
    financeReviewReducer(escalated, { ...event, eventId: "review_3" }),
    escalated,
  );
  assert.equal(JSON.stringify(financeTransactions), ledgerBefore);
});
test("invalid, reasonless and completed-record review actions are rejected", () => {
  const state = createFinanceReviewState();
  for (const patch of [
    { type: "release" },
    { reason: " " },
    { transactionId: "fin_txn_01" },
    { transactionId: "missing" },
    { timestamp: "invalid" },
    { actor: "" },
  ])
    assert.equal(financeReviewReducer(state, { ...event, ...patch }), state);
});
