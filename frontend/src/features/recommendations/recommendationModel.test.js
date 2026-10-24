import test from "node:test";
import assert from "node:assert/strict";
import { marketplaceData as data } from "../../data/fixtures/marketplace.js";
import { recommendMarketplace } from "./recommendationModel.js";
import { createProjectStore, mergeProjects } from "../projects/projectStore.js";

test("recommendations require explicit valid choices and never assume a private profile", () => {
  for (const kind of ["projects", "services", "freelancers"])
    assert.deepEqual(recommendMarketplace({ kind }, data), []);
  for (const preferences of [
    { kind: "unknown", skillIds: ["react"] },
    { kind: "projects", skillIds: ["unknown"] },
    { kind: "services", categoryId: "missing" },
  ])
    assert.deepEqual(recommendMarketplace(preferences, data), []);
});

test("only open projects and published services enter matching; zero overlap is excluded", () => {
  const projects = recommendMarketplace(
    { kind: "projects", skillIds: ["figma"] },
    data,
  );
  assert.deepEqual(
    projects.map(({ id }) => id),
    ["project_003"],
  );
  assert.deepEqual(
    recommendMarketplace(
      { kind: "services", categoryId: "graphic_design" },
      data,
    ).map(({ id }) => id),
    ["service_001"],
  );
  assert.deepEqual(
    recommendMarketplace(
      { kind: "projects", categoryId: "writing", skillIds: ["react"] },
      data,
    ),
    [],
  );
  assert.equal(
    recommendMarketplace({ kind: "services", skillIds: ["react"] }, data)[0].id,
    "service_002",
  );
});

test("overlap reasons count unique selected skills; shared count ranks before name and price", () => {
  const source = JSON.stringify(data);
  const projects = [
    {
      ...data.projects[0],
      id: "a",
      title: "A cheaper partial match",
      budgetEGP: 1,
      requiredSkillIds: ["react"],
    },
    {
      ...data.projects[0],
      id: "b",
      title: "Z full match",
      budgetEGP: 90000,
      requiredSkillIds: ["react", "figma"],
    },
  ];
  const result = recommendMarketplace(
    {
      kind: "projects",
      categoryId: "web_development",
      skillIds: ["react", "react", "figma"],
    },
    { ...data, projects },
  );
  assert.deepEqual(
    result.map(({ id }) => id),
    ["b", "a"],
  );
  assert.equal(result[0].selectedSkillCount, 2);
  assert.deepEqual(
    result[0].matchedSkills.map(({ id }) => id),
    ["react", "figma"],
  );
  assert.equal(result[0].categoryLabel, "Web Development");
  assert.equal(result[1].matchedSkills.length, 1);
  assert.equal(JSON.stringify(data), source);
});

test("category-only suggestions carry no fabricated skills score or confidence percentage", () => {
  const result = recommendMarketplace(
    { kind: "services", categoryId: "writing" },
    data,
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].selectedSkillCount, 0);
  assert.equal(result[0].score, 0);
  assert.deepEqual(result[0].matchedSkills, []);
  assert.equal(result[0].priceEGP, 900);
  assert.equal(result[0].href, "/services/service_003");
});

test("providers match through one service, with its price and link, never combined qualifications", () => {
  const result = recommendMarketplace(
    { kind: "freelancers", skillIds: ["figma", "content_writing"] },
    data,
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].title, "Salma Farid");
  assert.equal(result[0].score, 1);
  assert.equal(result[0].selectedSkillCount, 2);
  assert.equal(result[0].href, "/services/service_001");
  assert.equal(result[0].priceEGP, 1800);
  assert.deepEqual(
    recommendMarketplace(
      { kind: "freelancers", categoryId: "writing", skillIds: ["figma"] },
      data,
    ),
    [],
  );
  const withPrivate = {
    ...data,
    participants: {
      ...data.participants,
      students: data.participants.students.map((person) => ({
        ...person,
        email: "private@example.test",
        verificationStatus: "approved",
        rating: 5,
      })),
    },
  };
  assert.doesNotMatch(
    JSON.stringify(
      recommendMarketplace(
        { kind: "freelancers", skillIds: ["react"] },
        withPrivate,
      ),
    ),
    /private@example|verificationStatus|rating/,
  );
});

test("matching preserves deterministic ID ties and missing prices do not become zero", () => {
  const services = ["z", "a"].map((id) => ({
    ...data.services.find((service) => service.id === "service_001"),
    id,
    title: "Same title",
  }));
  const result = recommendMarketplace(
    { kind: "services", skillIds: ["figma"] },
    { ...data, services },
  );
  assert.deepEqual(
    result.map(({ id }) => id),
    ["a", "z"],
  );
  assert.equal(result[0].priceEGP, null);
});

test("a runtime project close removes the suggestion without changing orders or source fixtures", () => {
  const project = data.projects[0];
  const session = {
    status: "authenticated",
    user: {
      id: project.clientId,
      displayName: "Fictional Client",
      role: "client",
      accountStatus: "active",
      verificationStatus: "approved",
    },
  };
  const store = createProjectStore(data.projects, () => ({
    orders: [],
    proposals: [],
  }));
  const options = { kind: "projects", skillIds: ["react"] };
  assert.ok(
    recommendMarketplace(options, data).some(({ id }) => id === project.id),
  );
  assert.equal(store.transition(project.id, session, "close").ok, true);
  assert.ok(
    !recommendMarketplace(options, {
      ...data,
      projects: mergeProjects(data.projects, store.getSnapshot()),
    }).some(({ id }) => id === project.id),
  );
  assert.equal(project.status, "open");
});
