import test from "node:test";
import assert from "node:assert/strict";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { getOrdersByStudent, getProposalsByProject } from "./selectors.js";
import { validateMarketplaceData } from "./validateMarketplaceData.js";

test("the project and service fixture journeys have valid links and totals", () => {
  assert.deepEqual(validateMarketplaceData(marketplaceData), []);
});

test("selectors find linked records without duplicating them", () => {
  assert.deepEqual(getProposalsByProject("project_002").map((item) => item.id), ["proposal_002"]);
  assert.deepEqual(getOrdersByStudent("student_001").map((item) => item.id), ["order_002"]);
});

test("validation reports a broken service order total", () => {
  const changed = {
    ...marketplaceData,
    orders: marketplaceData.orders.map((order) =>
      order.id === "order_002" ? { ...order, agreedAmountEGP: 999 } : order,
    ),
  };
  assert.ok(validateMarketplaceData(changed).includes("order_002: incorrect service total"));
});

test("EGP formatting rejects invalid amounts", () => {
  assert.match(formatEGP(3200), /3,200/);
  assert.throws(() => formatEGP(Number.NaN), TypeError);
});
