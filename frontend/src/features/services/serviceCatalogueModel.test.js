import test from "node:test";
import assert from "node:assert/strict";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { discoverServices, startingPackage } from "./serviceCatalogueModel.js";

test("public discovery shows only published services with stable newest ordering", () => {
  const before = marketplaceData.services.map(({ id }) => id);
  assert.deepEqual(
    discoverServices({}, marketplaceData).map(({ service }) => service.id),
    ["service_002", "service_003", "service_001"],
  );
  assert.deepEqual(
    marketplaceData.services.map(({ id }) => id),
    before,
  );
  assert.deepEqual(discoverServices({ query: "poster" }, marketplaceData), []);
});

test("service search combines trimmed text, category, skill and starting-price filters", () => {
  const filters = {
    query: "  REACT  ",
    categoryId: "web_development",
    skillId: "react",
    price: "over_3000",
  };
  assert.equal(
    discoverServices(filters, marketplaceData)[0].service.id,
    "service_002",
  );
  for (const change of [
    { categoryId: "writing" },
    { skillId: "figma" },
    { price: "under_1500" },
    { query: "no-such-service" },
  ])
    assert.deepEqual(
      discoverServices({ ...filters, ...change }, marketplaceData),
      [],
    );
});

test("starting price uses the cheapest valid package and its own delivery time, excluding extras", () => {
  const data = {
    ...marketplaceData,
    servicePackages: [
      {
        id: "expensive",
        serviceId: "service_001",
        priceEGP: 4000,
        deliveryDays: 1,
      },
      {
        id: "cheap",
        serviceId: "service_001",
        priceEGP: 1500,
        deliveryDays: 9,
      },
      { id: "invalid", serviceId: "service_001", priceEGP: 1, deliveryDays: 0 },
      {
        id: "invalid-money",
        serviceId: "service_001",
        priceEGP: NaN,
        deliveryDays: 1,
      },
    ],
  };
  assert.equal(startingPackage("service_001", data).id, "cheap");
  assert.equal(startingPackage("service_001", data).deliveryDays, 9);
  assert.equal(startingPackage("missing", data), null);
  assert.equal(
    discoverServices({ price: "1500_3000" }, data)[0].service.id,
    "service_001",
  );
});

test("price boundaries do not overlap and missing prices stay last for numeric sorts", () => {
  const data = {
    ...marketplaceData,
    servicePackages: marketplaceData.servicePackages.map((p) => ({
      ...p,
      priceEGP:
        p.serviceId === "service_001"
          ? 1500
          : p.serviceId === "service_002"
            ? 3000
            : 900,
    })),
  };
  assert.equal(discoverServices({ price: "1500_3000" }, data).length, 2);
  assert.equal(discoverServices({ price: "under_1500" }, data).length, 1);
  assert.equal(discoverServices({ price: "over_3000" }, data).length, 0);
  const missing = {
    ...marketplaceData,
    servicePackages: marketplaceData.servicePackages.filter(
      ({ serviceId }) => serviceId !== "service_001",
    ),
  };
  for (const sort of ["price_low", "price_high", "delivery"])
    assert.equal(
      discoverServices({ sort }, missing).at(-1).service.id,
      "service_001",
    );
  assert.equal(
    discoverServices({ sort: "price_low" }, marketplaceData)[0].service.id,
    "service_003",
  );
  assert.equal(
    discoverServices({ sort: "price_high" }, marketplaceData)[0].service.id,
    "service_002",
  );
  assert.equal(
    discoverServices({ sort: "delivery" }, marketplaceData)[0].service.id,
    "service_003",
  );
});
