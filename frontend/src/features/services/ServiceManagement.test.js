import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("student management routes protect ownership and expose draft/publish/pause changes in public catalogue and details", async () => {
  const vite = await createServer({
    root: fileURLToPath(new URL("../../../", import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: Router } = await vite.ssrLoadModule("/src/app/router.jsx");
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const { serviceStore } = await vite.ssrLoadModule(
      "/src/features/services/serviceStore.js",
    );
    const { getServiceById, getPackagesByService } = await vite.ssrLoadModule(
      "/src/features/marketplace/selectors.js",
    );
    const { orderStore } = await vite.ssrLoadModule(
      "/src/features/orders/orderStore.js",
    );
    const orders = orderStore.getSnapshot();
    const student = {
      status: "authenticated",
      user: {
        id: "student_002",
        displayName: "Omar Nabil",
        role: "student",
        accountStatus: "active",
        verificationStatus: "approved",
      },
    };
    const render = (path, session = student) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            AuthContext.Provider,
            { value: { session } },
            React.createElement(Router),
          ),
        ),
      );
    const list = render("/student/services");
    assert.match(list, /Build a responsive React interface/);
    assert.doesNotMatch(
      list,
      /Responsive landing page design|Write clear content for your website/,
    );
    assert.equal((list.match(/<main\b/g) ?? []).length, 1);
    assert.match(list, /Keep service unchanged/);
    assert.match(list, /Confirm/);
    const form = render("/student/services/new");
    for (const label of [
      "Service title",
      "Description and scope",
      "Service packages",
      "Add package",
      "Included deliverables",
      "Delivery estimate",
      "Add extra",
      "Preview service",
    ])
      assert.ok(form.includes(label), label);
    assert.equal((form.match(/<form\b/g) ?? []).length, 1);
    assert.equal((form.match(/<main\b/g) ?? []).length, 1);
    assert.match(
      render("/student/services/service_002/edit"),
      /value="Build a responsive React interface"/,
    );
    const foreign = render("/student/services/service_001/edit");
    assert.match(foreign, /Service unavailable for editing/);
    assert.doesNotMatch(
      foreign,
      /Responsive landing page design|1,800|value="1800"/,
    );
    for (const session of [
      { status: "anonymous", user: null },
      { ...student, status: "expired" },
      { ...student, user: { ...student.user, role: "client" } },
      { ...student, user: { ...student.user, accountStatus: "suspended" } },
    ])
      for (const path of [
        "/student/services",
        "/student/services/new",
        "/student/services/service_002/edit",
      ])
        assert.doesNotMatch(
          render(path, session),
          /Share your services|Service essentials|Build a responsive React interface/,
        );
    const values = {
      title: "Private service draft for route test",
      description: "Fictional safe test scope",
      categoryId: "writing",
      skillIds: ["content_writing"],
      packages: [
        {
          id: "new-package",
          name: "Writing scope",
          description: "One introduction",
          includedFeatures: "Introduction\nEditable document",
          priceEGP: "600",
          deliveryDays: "3",
        },
      ],
      extras: [],
    };
    const created = serviceStore.save(values, student, null, "route-create");
    assert.equal(created.ok, true);
    assert.match(
      render("/student/services"),
      /Private service draft for route test/,
    );
    assert.doesNotMatch(
      render("/services"),
      /Private service draft for route test/,
    );
    assert.match(
      render(`/services/${created.service.id}`),
      /Service unavailable/,
    );
    assert.equal(
      serviceStore.transition(created.service.id, student, "publish").ok,
      true,
    );
    assert.match(render("/services"), /Private service draft for route test/);
    assert.match(render(`/services/${created.service.id}`), /Writing scope/);
    assert.equal(getServiceById(created.service.id).status, "published");
    assert.equal(getPackagesByService(created.service.id)[0].priceEGP, 600);
    assert.equal(
      serviceStore.transition(created.service.id, student, "pause").ok,
      true,
    );
    assert.doesNotMatch(
      render("/services"),
      /Private service draft for route test/,
    );
    assert.match(
      render(`/services/${created.service.id}`),
      /Service unavailable/,
    );
    assert.equal(
      serviceStore.transition(created.service.id, student, "remove").ok,
      true,
    );
    assert.equal(getServiceById(created.service.id), null);
    const salma = {
      ...student,
      user: {
        ...student.user,
        id: "student_001",
        verificationStatus: "pending",
      },
    };
    assert.match(
      render("/student/services/service_001/edit", salma),
      /linked to an order/,
    );
    assert.equal(orderStore.getSnapshot(), orders);
  } finally {
    await vite.close();
  }
});
