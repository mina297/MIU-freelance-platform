import test from "node:test";
import assert from "node:assert/strict";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { createOrderStore } from "../orders/orderStore.js";
import { createOrderWorkspaceStore } from "../orders/orderWorkspaceStore.js";
import { deliveryActionError } from "../orders/orderDeliveryModel.js";
import { quoteServiceOrder } from "../services/serviceOrderModel.js";
import { getServiceOrder } from "./checkoutModel.js";
import { createCheckoutStore, clientServiceOrders } from "./checkoutStore.js";

const client = {
  status: "authenticated",
  user: {
    id: "client_001",
    displayName: "Nile Studio",
    role: "client",
    accountStatus: "active",
    verificationStatus: "approved",
  },
};
const payment = { method: "visa", cardId: "card_visa", acknowledged: true };
function setup() {
  const orders = createOrderStore(marketplaceData.orders);
  const checkout = createCheckoutStore(marketplaceData, orders);
  const selection = { packageId: "package_001", extraIds: ["extra_001"] };
  selection.expectedRevision = quoteServiceOrder(
    "service_001",
    selection,
    client,
    marketplaceData,
  ).revision;
  const created = orders.createFromService(
    "service_001",
    selection,
    client,
    "purchase",
    () => marketplaceData,
  );
  assert.equal(created.ok, true);
  const student = {
    ...client,
    user: {
      ...client.user,
      id: created.order.studentId,
      displayName: "Assigned Student",
      role: "student",
    },
  };
  return { orders, checkout, selection, student, id: created.order.id };
}

test("new service order funding commits the receipt and workspace status atomically through delivery and completion", () => {
  const fixturesBefore = JSON.stringify(marketplaceData);
  const { orders, checkout, selection, student, id } = setup();
  const workspace = createOrderWorkspaceStore((orderId) =>
    orders.getSnapshot().find((order) => order.id === orderId),
  );
  const before = orders.getSnapshot();
  const original = before.find((order) => order.id === id);
  const lookup = () =>
    getServiceOrder(id, marketplaceData, checkout.getSnapshot().orders);
  assert.equal(lookup().priceMinor, 220000);
  assert.match(
    deliveryActionError(original, student, "submit", null),
    /Awaiting-payment/,
  );
  let notifications = 0;
  const unsubscribe = checkout.subscribe(() => {
    notifications++;
    const snapshot = checkout.getSnapshot();
    assert.equal(
      snapshot.orders.find((order) => order.id === id).status,
      "in_progress",
    );
    assert.equal(
      snapshot.transactions.filter((item) => item.orderId === id).length,
      1,
    );
  });
  const funded = checkout.fundInitial({
    orderId: id,
    session: client,
    payment,
  });
  assert.equal(funded.ok, true);
  assert.equal(notifications, 1);
  unsubscribe();
  assert.equal(
    before.find((order) => order.id === id).status,
    "awaiting_payment",
  );
  assert.equal(lookup().status, "in_progress");
  assert.equal(
    orders.getSnapshot().find((order) => order.id === id).initialPayment,
    funded.transaction,
  );
  assert.equal(workspace.actionError(id, student, "message"), null);
  assert.notEqual(workspace.read(id, student), null);
  assert.equal(
    deliveryActionError(
      orders.getSnapshot().find((order) => order.id === id),
      student,
      "submit",
      null,
    ),
    null,
  );
  const delivered = orders.submitDelivery(
    id,
    {
      text: "Fictional completed work",
      attachmentIds: ["delivery_sample_work"],
    },
    student,
    null,
    "delivery",
  );
  assert.equal(delivered.ok, true);
  assert.equal(
    clientServiceOrders(checkout.getSnapshot(), client).find(
      (order) => order.id === id,
    ).status,
    "delivered",
  );
  const completed = orders.acceptDelivery(
    id,
    client,
    delivered.delivery.id,
    "accept",
  );
  assert.equal(completed.ok, true);
  assert.equal(lookup().status, "completed");
  assert.equal(
    clientServiceOrders(checkout.getSnapshot(), client).find(
      (order) => order.id === id,
    ).status,
    "completed",
  );
  assert.equal(completed.order.serviceTerms, original.serviceTerms);
  assert.equal(completed.order.initialPayment, funded.transaction);
  assert.equal(funded.transaction.releasedMinor, 0);
  assert.equal(funded.transaction.remainingMinor, 110000);
  assert.equal(
    checkout.fundInitial({ orderId: id, session: client, payment }).duplicate,
    true,
  );
  assert.equal(lookup().status, "completed");
  assert.equal(
    orders.createFromService(
      "service_001",
      selection,
      client,
      "purchase",
      () => marketplaceData,
    ).order.status,
    "completed",
  );
  assert.equal(JSON.stringify(marketplaceData), fixturesBefore);
});

test("checkout preserves saved service terms when live listings change or disappear", () => {
  const { orders, checkout, id } = setup();
  const unavailableListings = {
    ...marketplaceData,
    services: [],
    servicePackages: [],
    serviceExtras: [],
  };
  const order = getServiceOrder(id, unavailableListings, orders.getSnapshot());
  assert.equal(order.title, "Responsive landing page design");
  assert.equal(order.priceMinor, 220000);
  assert.equal(
    order.items.reduce((sum, item) => sum + item.amountMinor, 0),
    order.priceMinor,
  );
  assert.equal(order.deliveryDays, 9);
  assert.equal(
    createCheckoutStore(unavailableListings, orders).fundInitial({
      orderId: id,
      session: client,
      payment,
    }).ok,
    true,
  );
  assert.equal(checkout.getSnapshot().transactions.length, 1);
});

test("invalid IDs, foreign sessions, failed/cancelled payments and invalid data never advance canonical orders", () => {
  const { orders, checkout, student, id } = setup();
  const before = orders.getSnapshot();
  for (const orderId of [
    undefined,
    null,
    "",
    "missing",
    "order_001",
    {},
    123,
  ]) {
    assert.equal(getServiceOrder(orderId, marketplaceData, before), null);
    assert.equal(
      checkout.fundInitial({ orderId, session: client, payment }).ok,
      false,
    );
  }
  for (const session of [
    { status: "anonymous", user: null },
    { ...client, status: "expired" },
    student,
    { ...client, user: { ...client.user, id: "foreign_client" } },
    { ...client, user: { ...client.user, accountStatus: "suspended" } },
  ]) {
    assert.equal(
      checkout.fundInitial({ orderId: id, session, payment }).ok,
      false,
    );
    assert.deepEqual(clientServiceOrders(checkout.getSnapshot(), session), []);
  }
  for (const outcome of ["failure", "cancelled"])
    assert.equal(
      checkout.fundInitial({ orderId: id, session: client, payment, outcome })
        .ok,
      false,
    );
  assert.equal(
    checkout.fundInitial({ orderId: id, session: client, payment: {} }).ok,
    false,
  );
  assert.equal(
    orders.fundServiceOrder(id, client, Object.freeze({ demo: true })).ok,
    false,
  );
  assert.equal(orders.getSnapshot(), before);
  assert.equal(checkout.getSnapshot().transactions.length, 0);
});
