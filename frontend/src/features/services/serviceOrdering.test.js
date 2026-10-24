import test from "node:test";
import assert from "node:assert/strict";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { quoteServiceOrder } from "./serviceOrderModel.js";
import { createOrderStore } from "../orders/orderStore.js";
import { createServiceStore } from "./serviceStore.js";
import { validateMarketplaceData } from "../marketplace/validateMarketplaceData.js";

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
const selection = { packageId: "package_001", extraIds: ["extra_001"] };
const confirmed = (data = marketplaceData, values = selection) => ({
  ...values,
  expectedRevision: quoteServiceOrder("service_001", values, client, data)
    .revision,
});

test("service quotes combine the selected package and unique extras using EGP cents and additive days", () => {
  const quote = quoteServiceOrder(
    "service_001",
    selection,
    client,
    marketplaceData,
  );
  assert.equal(quote.ok, true);
  assert.equal(quote.amountEGP, 2200);
  assert.equal(quote.deliveryDays, 9);
  assert.equal(quote.terms.packageName, "Landing page");
  assert.equal(
    quoteServiceOrder(
      "service_001",
      { packageId: "package_005", extraIds: [] },
      client,
      marketplaceData,
    ).amountEGP,
    2800,
  );
  const fractional = {
    ...marketplaceData,
    servicePackages: marketplaceData.servicePackages.map((pack) =>
      pack.id === "package_001" ? { ...pack, priceEGP: 0.1 } : pack,
    ),
    serviceExtras: marketplaceData.serviceExtras.map((extra) => ({
      ...extra,
      additionalPriceEGP: 0.2,
      additionalDays: 0,
    })),
  };
  assert.equal(
    quoteServiceOrder("service_001", selection, client, fractional).amountEGP,
    0.3,
  );
  assert.equal(
    quoteServiceOrder("service_001", selection, client, fractional)
      .deliveryDays,
    7,
  );
});

test("quote eligibility rejects wrong roles, pending verification, inactive sessions and self orders", () => {
  for (const session of [
    null,
    { status: "anonymous", user: null },
    { ...client, status: "expired" },
    { ...client, user: { ...client.user, role: "student" } },
    { ...client, user: { ...client.user, role: "super_admin" } },
    { ...client, user: { ...client.user, accountStatus: "suspended" } },
    { ...client, user: { ...client.user, verificationStatus: "pending" } },
    { ...client, user: { ...client.user, id: "student_001" } },
  ])
    assert.equal(
      quoteServiceOrder("service_001", selection, session, marketplaceData).ok,
      false,
    );
});

test("selection validation rejects foreign/missing/duplicate extras, missing packages and unpublished services", () => {
  for (const values of [
    null,
    { packageId: "package_002", extraIds: [] },
    { packageId: "package_001", extraIds: ["missing"] },
    { ...selection, extraIds: ["extra_001", "extra_001"] },
    { ...selection, extraIds: "extra_001" },
  ])
    assert.equal(
      quoteServiceOrder("service_001", values, client, marketplaceData).ok,
      false,
    );
  const foreign = {
    ...marketplaceData,
    serviceExtras: [
      { ...marketplaceData.serviceExtras[0], serviceId: "service_002" },
    ],
  };
  assert.equal(
    quoteServiceOrder("service_001", selection, client, foreign).ok,
    false,
  );
  for (const status of ["draft", "paused"])
    assert.equal(
      quoteServiceOrder("service_001", selection, client, {
        ...marketplaceData,
        services: marketplaceData.services.map((service) => ({
          ...service,
          status,
        })),
      }).ok,
      false,
    );
  assert.equal(
    quoteServiceOrder("missing", selection, client, marketplaceData).ok,
    false,
  );
});

test("invalid money/days and unsafe combined totals fail without inventing a quote", () => {
  for (const change of [
    { priceEGP: -1 },
    { priceEGP: Infinity },
    { priceEGP: 1.001 },
    { deliveryDays: 0 },
    { deliveryDays: 1.5 },
  ]) {
    const data = {
      ...marketplaceData,
      servicePackages: marketplaceData.servicePackages.map((pack) =>
        pack.id === "package_001" ? { ...pack, ...change } : pack,
      ),
    };
    assert.equal(
      quoteServiceOrder("service_001", selection, client, data).ok,
      false,
    );
  }
  for (const change of [
    { additionalPriceEGP: -1 },
    { additionalPriceEGP: NaN },
    { additionalPriceEGP: 0.001 },
    { additionalDays: -1 },
    { additionalDays: 1.5 },
    { additionalDays: Number.MAX_SAFE_INTEGER },
  ])
    assert.equal(
      quoteServiceOrder("service_001", selection, client, {
        ...marketplaceData,
        serviceExtras: marketplaceData.serviceExtras.map((extra) => ({
          ...extra,
          ...change,
        })),
      }).ok,
      false,
    );
  const huge = {
    ...marketplaceData,
    servicePackages: marketplaceData.servicePackages.map((pack) => ({
      ...pack,
      priceEGP: 50000000000000,
    })),
    serviceExtras: marketplaceData.serviceExtras.map((extra) => ({
      ...extra,
      additionalPriceEGP: 50000000000000,
    })),
  };
  assert.equal(
    quoteServiceOrder("service_001", selection, client, huge).ok,
    false,
  );
});

test("confirmation rechecks live listing, package price/scope and extras; no stale confirmation creates an order", () => {
  let current = marketplaceData;
  const store = createOrderStore();
  const review = confirmed();
  const before = store.getSnapshot();
  for (const change of [
    {
      services: marketplaceData.services.map((service) =>
        service.id === "service_001"
          ? { ...service, status: "paused" }
          : service,
      ),
    },
    {
      servicePackages: marketplaceData.servicePackages.filter(
        ({ id }) => id !== "package_001",
      ),
    },
    { serviceExtras: [] },
    {
      servicePackages: marketplaceData.servicePackages.map((pack) =>
        pack.id === "package_001" ? { ...pack, priceEGP: 1900 } : pack,
      ),
    },
    {
      servicePackages: marketplaceData.servicePackages.map((pack) =>
        pack.id === "package_001"
          ? { ...pack, description: "Changed scope" }
          : pack,
      ),
    },
  ]) {
    current = { ...marketplaceData, ...change };
    assert.equal(
      store.createFromService(
        "service_001",
        review,
        client,
        "request",
        () => current,
      ).ok,
      false,
    );
    assert.equal(store.getSnapshot(), before);
  }
  current = marketplaceData;
  assert.equal(
    store.createFromService(
      "service_001",
      selection,
      client,
      "request",
      () => current,
    ).ok,
    false,
  );
  assert.equal(
    store.createFromService(
      "service_001",
      review,
      client,
      "request",
      () => current,
    ).ok,
    true,
  );
});

test("confirmation is idempotent, immutable and creates awaiting-payment terms without changing service status", () => {
  const orders = createOrderStore(marketplaceData.orders);
  const services = createServiceStore(marketplaceData, orders.getSnapshot);
  const review = confirmed(services.getSnapshot());
  let notifications = 0;
  orders.subscribe(() => notifications++);
  const result = orders.createFromService(
    "service_001",
    review,
    client,
    "same-request",
    services.getSnapshot,
  );
  assert.equal(result.ok, true);
  assert.equal(result.order.status, "awaiting_payment");
  assert.equal(result.order.sourceType, "service");
  assert.equal(result.order.agreedAmountEGP, 2200);
  assert.equal(result.order.deliveryDays, 9);
  assert.equal(result.order.proposalId, null);
  assert.equal(
    services.getSnapshot().services.find(({ id }) => id === "service_001")
      .status,
    "published",
  );
  assert.equal(
    orders.createFromService(
      "service_001",
      review,
      client,
      "same-request",
      services.getSnapshot,
    ).order,
    result.order,
  );
  assert.equal(notifications, 1);
  assert.equal(
    orders.createFromService(
      "service_001",
      { ...review, extraIds: [] },
      client,
      "same-request",
      services.getSnapshot,
    ).ok,
    false,
  );
  assert.equal(
    orders.createFromService(
      "service_001",
      review,
      client,
      "",
      services.getSnapshot,
    ).ok,
    false,
  );
  assert.equal(
    orders.createFromService("service_001", review, client, "another", null).ok,
    false,
  );
  assert.ok(Object.isFrozen(result.order.serviceTerms));
  assert.ok(Object.isFrozen(result.order.serviceTerms.includedFeatures));
  assert.ok(Object.isFrozen(result.order.serviceTerms.extras[0]));
  assert.deepEqual(
    validateMarketplaceData({
      ...services.getSnapshot(),
      orders: orders.getSnapshot(),
    }),
    [],
  );
});

test("new service orders immediately protect their provider's listing against editing/removal", () => {
  const orders = createOrderStore();
  const services = createServiceStore(marketplaceData, orders.getSnapshot);
  const student = {
    status: "authenticated",
    user: {
      id: "student_002",
      role: "student",
      displayName: "Omar Nabil",
      accountStatus: "active",
      verificationStatus: "approved",
    },
  };
  const values = { packageId: "package_002", extraIds: [] };
  const quote = quoteServiceOrder(
    "service_002",
    values,
    client,
    services.getSnapshot(),
  );
  assert.equal(services.editError("service_002", student), null);
  const order = orders.createFromService(
    "service_002",
    { ...values, expectedRevision: quote.revision },
    client,
    "commitment",
    services.getSnapshot,
  );
  assert.equal(order.ok, true);
  assert.ok(services.editError("service_002", student));
  assert.equal(services.transition("service_002", student, "remove").ok, false);
  assert.equal(services.transition("service_002", student, "pause").ok, true);
  assert.equal(order.order.serviceTerms.packagePriceEGP, 3600);
});
