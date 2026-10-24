import test from "node:test";
import assert from "node:assert/strict";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { publicServiceDetails } from "./serviceDetailsModel.js";
import { startingPackage } from "./serviceCatalogueModel.js";

test("public details allow only published listings and retain matching related data", () => {
  for (const id of ["missing", "service_004"])
    assert.equal(publicServiceDetails(id, marketplaceData), null);
  const draft = {
    ...marketplaceData,
    services: [{ ...marketplaceData.services[0], status: "draft" }],
  };
  assert.equal(publicServiceDetails(draft.services[0].id, draft), null);
  const details = publicServiceDetails("service_001", marketplaceData);
  assert.equal(details.student.id, "student_001");
  assert.deepEqual(
    details.packages.map(({ id }) => id),
    ["package_001", "package_005", "package_006"],
  );
  assert.equal(
    details.packages[0],
    startingPackage("service_001", marketplaceData),
  );
  assert.deepEqual(
    details.extras.map(({ id }) => id),
    ["extra_001"],
  );
});

test("details omit invalid prices, durations and foreign extras without mutating fixtures", () => {
  const before = JSON.stringify(marketplaceData);
  const data = {
    ...marketplaceData,
    servicePackages: [
      ...marketplaceData.servicePackages,
      { id: "bad", serviceId: "service_001", priceEGP: -1, deliveryDays: 1 },
      {
        id: "bad-days",
        serviceId: "service_001",
        priceEGP: 1,
        deliveryDays: 1.5,
      },
    ],
    serviceExtras: [
      ...marketplaceData.serviceExtras,
      {
        id: "bad-price",
        serviceId: "service_001",
        additionalPriceEGP: Infinity,
        additionalDays: 1,
      },
      {
        id: "bad-days",
        serviceId: "service_001",
        additionalPriceEGP: 100,
        additionalDays: -1,
      },
      {
        id: "foreign",
        serviceId: "service_002",
        additionalPriceEGP: 10,
        additionalDays: 1,
      },
      {
        id: "free",
        serviceId: "service_001",
        additionalPriceEGP: 0,
        additionalDays: 0,
      },
    ],
  };
  const result = publicServiceDetails("service_001", data);
  assert.equal(result.packages.length, 3);
  assert.deepEqual(
    result.extras.map(({ id }) => id),
    ["extra_001", "free"],
  );
  assert.equal(JSON.stringify(marketplaceData), before);
  const missing = publicServiceDetails("service_001", {
    ...marketplaceData,
    servicePackages: [],
    serviceExtras: [],
    participants: { ...marketplaceData.participants, students: [] },
  });
  assert.deepEqual(missing.packages, []);
  assert.deepEqual(missing.extras, []);
  assert.equal(missing.student, null);
});
