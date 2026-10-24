import test from "node:test";
import assert from "node:assert/strict";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import {
  ownOrders,
  filterOrders,
  orderListStats,
  describeOrder,
} from "./orderListModel.js";

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
const student = {
  ...client,
  user: { ...client.user, id: "student_002", role: "student" },
};

test("order list ownership checks roles, activity and session before joins and statistics", () => {
  assert.deepEqual(
    ownOrders(marketplaceData.orders, student, "student").map(({ id }) => id),
    ["order_001"],
  );
  for (const session of [
    null,
    { status: "anonymous", user: null },
    { ...client, status: "expired" },
    { ...client, user: { ...client.user, role: "super_admin" } },
    { ...client, user: { ...client.user, accountStatus: "suspended" } },
    student,
  ]) {
    assert.deepEqual(ownOrders(marketplaceData.orders, session, "client"), []);
    // Invalid sessions do not even inspect the missing relationship data.
    assert.deepEqual(
      filterOrders(marketplaceData.orders, session, "client", {}, null),
      [],
    );
    assert.equal(
      orderListStats(marketplaceData.orders, session, "client").count,
      0,
    );
  }
  const pending = {
    ...student,
    user: { ...student.user, verificationStatus: "pending" },
  };
  assert.equal(ownOrders(marketplaceData.orders, pending, "student").length, 1);
});

test("order search/status/source combine and cannot match another participant's order", () => {
  const result = filterOrders(
    marketplaceData.orders,
    client,
    "client",
    { query: " SALMA ", status: "awaiting_payment", source: "service" },
    marketplaceData,
  );
  assert.deepEqual(
    result.map(({ order }) => order.id),
    ["order_002"],
  );
  for (const query of ["Salma", "order_002", "Responsive landing"])
    assert.deepEqual(
      filterOrders(
        marketplaceData.orders,
        student,
        "student",
        { query },
        marketplaceData,
      ),
      [],
    );
  assert.equal(
    filterOrders(
      marketplaceData.orders,
      client,
      "client",
      { query: "order_001", source: "service" },
      marketplaceData,
    ).length,
    0,
  );
});

test("order sorting is stable and never mutates source; saved service title/package survives missing listing", () => {
  const ids = marketplaceData.orders.map(({ id }) => id);
  const first = (sort) =>
    filterOrders(
      marketplaceData.orders,
      client,
      "client",
      { sort },
      marketplaceData,
    )[0].order.id;
  assert.equal(first("newest"), "order_002");
  assert.equal(first("oldest"), "order_001");
  assert.equal(first("amount_low"), "order_002");
  assert.equal(first("amount_high"), "order_001");
  assert.deepEqual(
    marketplaceData.orders.map(({ id }) => id),
    ids,
  );
  const saved = {
    ...marketplaceData.orders[1],
    serviceTerms: { serviceTitle: "Saved title", packageName: "Saved package" },
  };
  const missingData = {
    ...marketplaceData,
    services: [],
    projects: [],
    participants: { students: [], clients: [] },
  };
  assert.equal(
    describeOrder(saved, "client", missingData).title,
    "Saved title",
  );
  assert.equal(describeOrder(saved, "client", missingData).titleNote, null);
  assert.equal(
    filterOrders(
      [saved],
      client,
      "client",
      { query: "Saved package" },
      missingData,
    ).length,
    1,
  );
  assert.equal(
    describeOrder(marketplaceData.orders[1], "client", missingData).title,
    "Service unavailable",
  );
  assert.match(
    describeOrder(marketplaceData.orders[1], "client", missingData).titleNote,
    /historical scope/,
  );
  assert.equal(
    describeOrder(marketplaceData.orders[0], "student", missingData).name,
    "Client information unavailable",
  );
  const ties = [
    { ...saved, id: "b" },
    { ...saved, id: "a" },
  ];
  assert.deepEqual(
    filterOrders(ties, client, "client", {}, missingData).map(
      ({ order }) => order.id,
    ),
    ["a", "b"],
  );
});

test("summary amounts use all owned orders across statuses, never another user's value", () => {
  assert.deepEqual(orderListStats(marketplaceData.orders, client, "client"), {
    count: 2,
    awaitingPayment: 1,
    amountEGP: 5400,
  });
  assert.deepEqual(orderListStats(marketplaceData.orders, student, "student"), {
    count: 1,
    awaitingPayment: 0,
    amountEGP: 3200,
  });
  const fractions = [0.1, 0.2].map((amount, index) => ({
    ...marketplaceData.orders[0],
    id: String(index),
    agreedAmountEGP: amount,
  }));
  assert.equal(orderListStats(fractions, student, "student").amountEGP, 0.3);
  assert.equal(
    orderListStats(
      [{ ...fractions[0], agreedAmountEGP: Infinity }],
      student,
      "student",
    ).amountEGP,
    null,
  );
  const huge = fractions.map((order) => ({
    ...order,
    agreedAmountEGP: 50000000000000,
  }));
  assert.equal(orderListStats(huge, student, "student").amountEGP, null);
  assert.equal(orderListStats([], student, "student").amountEGP, 0);
});
