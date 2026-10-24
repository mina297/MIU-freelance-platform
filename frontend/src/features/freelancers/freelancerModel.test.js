import test from "node:test";
import assert from "node:assert/strict";
import { marketplaceData as data } from "../../data/fixtures/marketplace.js";
import { discoverFreelancers } from "./freelancerModel.js";
import { createServiceStore } from "../services/serviceStore.js";

test("directory derives only published providers and does not mutate or expose private account fields", () => {
  const before = JSON.stringify(data);
  const result = discoverFreelancers({}, data);
  assert.deepEqual(
    result.map(({ displayName }) => displayName),
    ["Omar Nabil", "Salma Farid"],
  );
  assert.deepEqual(
    result.map(({ services }) => services.length),
    [1, 2],
  );
  assert.equal(
    result.find(({ id }) => id === "student_001").startingPriceEGP,
    900,
  );
  assert.deepEqual(discoverFreelancers({ query: "poster" }, data), []);
  const privateData = {
    ...data,
    participants: {
      ...data.participants,
      students: data.participants.students.map((person) => ({
        ...person,
        email: "private@example.test",
        verificationStatus: "approved",
      })),
    },
  };
  assert.doesNotMatch(
    JSON.stringify(discoverFreelancers({}, privateData)),
    /private@example|verificationStatus/,
  );
  assert.equal(JSON.stringify(data), before);
});

test("search and filters must match the same published service", () => {
  const result = discoverFreelancers(
    {
      query: "  SALMA  ",
      categoryId: "writing",
      skillId: "content_writing",
      price: "under_1500",
    },
    data,
  );
  assert.equal(result.length, 1);
  assert.deepEqual(
    result[0].services.map(({ service }) => service.id),
    ["service_003"],
  );
  assert.deepEqual(
    result[0].skills.map(({ id }) => id),
    ["content_writing"],
  );
  for (const filters of [
    { categoryId: "writing", skillId: "figma" },
    { query: "salma", price: "over_3000" },
    { price: "invalid" },
    { skillId: "unknown" },
  ])
    assert.deepEqual(discoverFreelancers(filters, data), []);
  assert.equal(
    discoverFreelancers({ query: "  REACT " }, data)[0].id,
    "student_002",
  );
});

test("package price boundaries, missing prices and stable browsing sorts", () => {
  const boundary = {
    ...data,
    servicePackages: data.servicePackages.map((pack) => ({
      ...pack,
      priceEGP:
        pack.serviceId === "service_001"
          ? 1500
          : pack.serviceId === "service_002"
            ? 3000
            : 900,
    })),
  };
  assert.equal(discoverFreelancers({ price: "1500_3000" }, boundary).length, 2);
  assert.equal(
    discoverFreelancers({ price: "under_1500" }, boundary).length,
    1,
  );
  assert.equal(discoverFreelancers({ price: "over_3000" }, boundary).length, 0);
  const missing = {
    ...data,
    servicePackages: data.servicePackages.filter(
      ({ serviceId }) => serviceId === "service_002",
    ),
  };
  assert.equal(
    discoverFreelancers({ sort: "price_low" }, missing).at(-1).startingPriceEGP,
    null,
  );
  assert.equal(discoverFreelancers({ price: "over_3000" }, missing).length, 1);
  for (const sort of ["name_desc", "services", "price_low"])
    assert.equal(discoverFreelancers({ sort }, data)[0].id, "student_001");
  const ties = {
    ...data,
    participants: {
      ...data.participants,
      students: [...data.participants.students]
        .reverse()
        .map((person) => ({ ...person, displayName: "Same Name" })),
    },
  };
  assert.deepEqual(
    discoverFreelancers({}, ties).map(({ id }) => id),
    ["student_001", "student_002"],
  );
});

test("directory follows runtime publishing and pausing without inventing profile records", () => {
  const store = createServiceStore(data, () => []);
  const session = {
    status: "authenticated",
    user: {
      id: "student_new",
      displayName: "Fictional Provider",
      role: "student",
      accountStatus: "active",
      verificationStatus: "approved",
    },
  };
  const created = store.save(
    {
      title: "A fictional React service",
      description: "Clear components and a responsive interface.",
      categoryId: "web_development",
      skillIds: ["react"],
      packages: [
        {
          id: "form-package",
          name: "One screen",
          description: "One responsive screen.",
          includedFeatures: "React components\nResponsive layout",
          priceEGP: "1500",
          deliveryDays: "5",
        },
      ],
      extras: [],
    },
    session,
    null,
    "directory-test",
  );
  assert.equal(created.ok, true);
  const find = () =>
    discoverFreelancers({}, store.getSnapshot()).find(
      ({ id }) => id === session.user.id,
    );
  assert.equal(find(), undefined);
  assert.equal(
    store.transition(created.service.id, session, "publish").ok,
    true,
  );
  assert.equal(find().displayName, "Fictional Provider");
  assert.equal(find().services[0].service.id, created.service.id);
  assert.equal(store.transition(created.service.id, session, "pause").ok, true);
  assert.equal(find(), undefined);
});
