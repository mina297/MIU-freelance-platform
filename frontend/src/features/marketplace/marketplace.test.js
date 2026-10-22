import test from "node:test";
import assert from "node:assert/strict";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { formatEGP } from "../../utils/formatEGP.js";
import { formatDate } from "../../utils/formatDate.js";
import { PROJECT_STATUS, SERVICE_STATUS } from "./constants.js";
import { findProjects, findServices, getOrdersByStudent, getProposalsByProject } from "./selectors.js";
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

test("validation reports a proposal linked to a missing project", () => {
  const changed = {
    ...marketplaceData,
    proposals: marketplaceData.proposals.map((proposal) =>
      proposal.id === "proposal_001" ? { ...proposal, projectId: "project_missing" } : proposal,
    ),
  };
  assert.ok(validateMarketplaceData(changed).includes("proposal_001: unknown project"));
});

test("EGP formatting rejects invalid amounts", () => {
  assert.match(formatEGP(3200), /3,200/);
  assert.throws(() => formatEGP(Number.NaN), TypeError);
});

test("project filters combine text, category, skill, and status", () => {
  assert.deepEqual(
    findProjects({ query: "  RESPONSIVE ", categoryId: "web_development", skillId: "react", status: PROJECT_STATUS.OPEN }).map((item) => item.id),
    ["project_001"],
  );
  assert.deepEqual(findProjects({ skillId: "unknown" }), []);
  assert.equal(findProjects().length, marketplaceData.projects.length);
});

test("service filters return matches and empty results", () => {
  assert.deepEqual(
    findServices({ query: "landing", skillId: "figma", status: SERVICE_STATUS.PUBLISHED }).map((item) => item.id),
    ["service_001"],
  );
  assert.deepEqual(findServices({ categoryId: "web_development" }), []);
});

test("date formatting preserves the stored calendar day", () => {
  assert.match(formatDate("2026-12-15"), /15/);
  assert.equal(formatDate("2026-12-15"), formatDate("2026-12-15T09:00:00Z"));
  assert.throws(() => formatDate("2026-02-30"), RangeError);
  assert.throws(() => formatDate("tomorrow"), TypeError);
});
