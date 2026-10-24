import test from "node:test";
import assert from "node:assert/strict";
import {
  escrowBreakdown,
  getServiceOrder,
  isCardExpired,
  validateCheckout,
} from "./checkoutModel.js";
import { marketplaceData } from "../../data/fixtures/marketplace.js";

const now = new Date("2026-10-24T12:00:00Z");
const valid = { method: "visa", cardId: "card_visa", acknowledged: true };
test("checkout joins the existing service, package, extra, freelancer and agreed price", () => {
  const before = JSON.stringify(marketplaceData);
  const order = getServiceOrder("order_002");
  assert.equal(order.priceMinor, 220000);
  assert.equal(order.title, "Responsive landing page design");
  assert.equal(order.freelancer, "Salma Farid");
  assert.equal(order.deliveryDays, 9);
  assert.deepEqual(
    order.items.map((item) => item.amountMinor),
    [180000, 40000],
  );
  assert.equal(order.clientId, "client_001");
  assert.equal(getServiceOrder("missing"), null);
  assert.equal(getServiceOrder("order_001"), null); // Project order is outside this flow.
  assert.equal(JSON.stringify(marketplaceData), before);
});
test("initial funding is 50%, preserves exact minor units and never invents fees", () => {
  assert.deepEqual(escrowBreakdown(220000), {
    priceMinor: 220000,
    initialMinor: 110000,
    remainingMinor: 110000,
    feeMinor: 0,
    dueNowMinor: 110000,
  });
  for (const price of [1, 101, 220001, 999999]) {
    const amounts = escrowBreakdown(price);
    assert.equal(amounts.initialMinor + amounts.remainingMinor, price);
    assert.ok(Math.abs(amounts.initialMinor - amounts.remainingMinor) <= 1);
  }
  for (const price of [0, -1, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1])
    assert.throws(() => escrowBreakdown(price), RangeError);
});
test("payment selection validates brand, saved card and escrow acknowledgement", () => {
  assert.deepEqual(validateCheckout(valid, now), {});
  assert.ok(validateCheckout({ ...valid, cardId: "missing" }, now).card);
  assert.ok(validateCheckout({ ...valid, method: "mastercard" }, now).card);
  assert.deepEqual(
    validateCheckout(
      { ...valid, method: "mastercard", cardId: "card_mastercard" },
      now,
    ),
    {},
  );
  assert.ok(
    validateCheckout({ ...valid, acknowledged: false }, now).acknowledged,
  );
  assert.ok(validateCheckout({ ...valid, method: "wallet" }, now).method);
  assert.deepEqual(
    validateCheckout({ method: "apple_pay", acknowledged: true }, now),
    {},
  );
});
test("new sample card requires populated presets and rejects expired cards", () => {
  const draft = { ...valid, cardId: "new" };
  assert.deepEqual(Object.keys(validateCheckout(draft, now)).sort(), [
    "cvc",
    "expiry",
    "holder",
    "number",
  ]);
  assert.deepEqual(validateCheckout({ ...draft, preset: "valid" }, now), {});
  assert.ok(validateCheckout({ ...draft, preset: "expired" }, now).expiry);
  assert.ok(validateCheckout(valid, new Date("2040-01-01T00:00:00Z")).expiry);
});
test("expiry validates month/year and includes the current month", () => {
  assert.equal(isCardExpired("10/2026", now), false);
  for (const expiry of ["09/2026", "13/2030", "", "1/2030"])
    assert.equal(isCardExpired(expiry, now), true);
});
