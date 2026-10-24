import test from "node:test";
import assert from "node:assert/strict";
import { marketplaceData } from "../../data/fixtures/marketplace.js";
import { createServiceStore } from "./serviceStore.js";
import { validateService, serviceFormValues } from "./serviceFormModel.js";
import { publicServiceDetails } from "./serviceDetailsModel.js";
import { discoverServices } from "./serviceCatalogueModel.js";
import { validateMarketplaceData } from "../marketplace/validateMarketplaceData.js";

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
const pending = {
  ...student,
  user: { ...student.user, verificationStatus: "pending" },
};
const values = () => ({
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
      priceEGP: "1500.50",
      deliveryDays: "5",
    },
  ],
  extras: [
    {
      id: "form-extra",
      title: "Extra section",
      description: "One additional section.",
      additionalPriceEGP: "200",
      additionalDays: "1",
    },
  ],
});

test("complete service drafts stay private; publishing, editing, pausing and removal update public data", () => {
  const source = JSON.stringify(marketplaceData);
  const store = createServiceStore(marketplaceData, () => []);
  const first = store.getSnapshot();
  let notifications = 0;
  const stop = store.subscribe(() => notifications++);
  const created = store.save(values(), pending, null, "create-1");
  assert.equal(created.ok, true);
  assert.equal(created.service.status, "draft");
  assert.equal(
    publicServiceDetails(created.service.id, store.getSnapshot()),
    null,
  );
  assert.ok(
    !discoverServices({}, store.getSnapshot()).some(
      ({ service }) => service.id === created.service.id,
    ),
  );
  assert.equal(
    store.transition(created.service.id, pending, "publish").ok,
    false,
  );
  assert.equal(
    store.transition(created.service.id, student, "publish").ok,
    true,
  );
  assert.ok(publicServiceDetails(created.service.id, store.getSnapshot()));
  const updated = store.save(
    { ...values(), title: "Improved service" },
    student,
    created.service.id,
  );
  assert.equal(updated.service.status, "published");
  assert.equal(
    publicServiceDetails(created.service.id, store.getSnapshot()).service.title,
    "Improved service",
  );
  assert.equal(store.save(values(), pending, created.service.id).ok, false);
  assert.equal(store.transition(created.service.id, pending, "pause").ok, true);
  assert.equal(
    publicServiceDetails(created.service.id, store.getSnapshot()),
    null,
  );
  assert.equal(
    store.transition(created.service.id, student, "publish").ok,
    true,
  );
  assert.equal(
    store.transition(created.service.id, student, "remove").ok,
    true,
  );
  assert.equal(store.findOwned(created.service.id, student), null);
  assert.ok(
    !store
      .getSnapshot()
      .servicePackages.some(
        ({ serviceId }) => serviceId === created.service.id,
      ),
  );
  assert.ok(
    !store
      .getSnapshot()
      .serviceExtras.some(({ serviceId }) => serviceId === created.service.id),
  );
  assert.equal(notifications, 6);
  stop();
  assert.equal(JSON.stringify(marketplaceData), source);
  assert.equal(first.services.length, marketplaceData.services.length);
  assert.deepEqual(validateMarketplaceData(store.getSnapshot()), []);
});

test("service mutations reject wrong roles, foreign records, expired and inactive accounts", () => {
  const store = createServiceStore(marketplaceData, () => []);
  const before = store.getSnapshot();
  for (const session of [
    null,
    { status: "anonymous", user: null },
    { ...student, status: "expired" },
    { ...student, user: { ...student.user, accountStatus: "suspended" } },
    { ...student, user: { ...student.user, role: "client" } },
    { ...student, user: { ...student.user, role: "super_admin" } },
  ]) {
    assert.equal(store.save(values(), session, null, "bad").ok, false);
    assert.equal(store.transition("service_002", session, "remove").ok, false);
    assert.equal(store.findOwned("service_002", session), null);
  }
  assert.equal(store.save(values(), student, "service_001").ok, false);
  assert.equal(store.transition("service_001", student, "pause").ok, false);
  assert.equal(store.save(values(), student, "missing").ok, false);
  assert.equal(store.transition("missing", student, "remove").ok, false);
  assert.equal(store.getSnapshot(), before);
});

test("validation rejects malformed text, money, days, skills, packages and extras atomically", () => {
  const store = createServiceStore(marketplaceData, () => []);
  const before = store.getSnapshot();
  for (const change of [
    { title: " " },
    { description: 42 },
    { categoryId: "forged" },
    { skillIds: ["react", "react"] },
    { skillIds: ["forged"] },
    { packages: [] },
    { packages: null },
    { packages: [null] },
    { extras: null },
  ]) {
    assert.equal(
      store.save({ ...values(), ...change }, student, null, "invalid").ok,
      false,
    );
  }
  for (const row of [
    { priceEGP: "0" },
    { priceEGP: "1.001" },
    { priceEGP: "Infinity" },
    { priceEGP: "9007199254740991" },
    { deliveryDays: "0" },
    { deliveryDays: "1.2" },
    { includedFeatures: "\n " },
    { name: "" },
  ]) {
    const invalid = values();
    invalid.packages[0] = { ...invalid.packages[0], ...row };
    assert.equal(store.save(invalid, student, null, "invalid").ok, false);
  }
  for (const row of [
    { additionalPriceEGP: "-1" },
    { additionalDays: "-1" },
    { additionalDays: "1.5" },
  ]) {
    const invalid = values();
    invalid.extras[0] = { ...invalid.extras[0], ...row };
    assert.equal(store.save(invalid, student, null, "invalid").ok, false);
  }
  const duplicated = values();
  duplicated.packages.push({ ...duplicated.packages[0] });
  assert.ok(validateService(duplicated).packages);
  const free = values();
  free.extras[0].additionalPriceEGP = "0";
  free.extras[0].additionalDays = "0";
  assert.deepEqual(validateService(free), {});
  assert.equal(store.getSnapshot(), before);
});

test("order commitments are rechecked before editing/removal while pause preserves existing order terms", () => {
  let orders = [];
  const store = createServiceStore(marketplaceData, () => orders);
  assert.equal(store.editError("service_002", student), null);
  orders = [
    { sourceType: "service", sourceId: "service_002", agreedAmountEGP: 3600 },
  ];
  const before = store.getSnapshot();
  assert.equal(store.save(values(), student, "service_002").ok, false);
  assert.equal(store.transition("service_002", student, "remove").ok, false);
  assert.equal(store.getSnapshot(), before);
  assert.equal(store.transition("service_002", pending, "pause").ok, true);
  assert.equal(store.getSnapshot().servicePackages, before.servicePackages);
  assert.equal(orders[0].agreedAmountEGP, 3600);
});

test("stable ownership and existing child IDs survive edits; foreign IDs and status fields cannot be forged", () => {
  const store = createServiceStore(marketplaceData, () => []);
  const previous = store.findOwned("service_002", student);
  const form = serviceFormValues(previous, store.getSnapshot());
  const packId = form.packages[0].id;
  form.packages.push({
    ...values().packages[0],
    id: "package_001",
    serviceId: "service_001",
  });
  const result = store.save(
    {
      ...form,
      id: "forged",
      studentId: "student_001",
      status: "draft",
      createdAt: "forged",
      portfolioItemIds: ["forged"],
    },
    student,
    previous.id,
  );
  assert.equal(result.ok, true);
  assert.equal(result.service.id, previous.id);
  assert.equal(result.service.studentId, student.user.id);
  assert.equal(result.service.status, "published");
  assert.equal(result.service.createdAt, previous.createdAt);
  assert.deepEqual(result.service.portfolioItemIds, previous.portfolioItemIds);
  const packages = store
    .getSnapshot()
    .servicePackages.filter(({ serviceId }) => serviceId === previous.id);
  assert.equal(packages[0].id, packId);
  assert.notEqual(packages[1].id, "package_001");
  assert.ok(packages.every(({ serviceId }) => serviceId === previous.id));
  assert.ok(Object.isFrozen(packages[0].includedFeatures));
  assert.deepEqual(validateMarketplaceData(store.getSnapshot()), []);
});

test("new submissions are idempotent and runtime students gain only a safe display-name adapter", () => {
  const store = createServiceStore(marketplaceData, () => []);
  const session = {
    ...student,
    user: {
      ...student.user,
      id: "runtime-student",
      displayName: "Fictional Student",
      email: "not-public@example.test",
      password: "not-public",
    },
  };
  assert.equal(store.save(values(), session).ok, false);
  const first = store.save(values(), session, null, "token");
  const repeat = store.save(values(), session, null, "token");
  assert.equal(repeat.service, first.service);
  assert.equal(repeat.duplicate, true);
  assert.deepEqual(
    store
      .getSnapshot()
      .participants.students.find(({ id }) => id === session.user.id),
    { id: session.user.id, displayName: "Fictional Student" },
  );
  assert.equal(store.transition(first.service.id, session, "publish").ok, true);
  assert.equal(
    store.transition(first.service.id, session, "publish").ok,
    false,
  );
  assert.equal(
    store.transition(first.service.id, session, "unknown").ok,
    false,
  );
  assert.equal(store.transition(first.service.id, session, "remove").ok, true);
  assert.equal(store.save(values(), session, null, "token").ok, false);
  assert.deepEqual(validateMarketplaceData(store.getSnapshot()), []);
});
