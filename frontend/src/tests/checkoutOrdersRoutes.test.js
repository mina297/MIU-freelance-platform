import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("created orders open checkout and share funding and completed status across real application routes", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const load = (path) => vite.ssrLoadModule(`/src/${path}`);
    const { default: Router } = await load("app/router.jsx");
    const { AuthContext } = await load("contexts/AuthContext.js");
    const { orderStore } = await load("features/orders/orderStore.js");
    const { checkoutStore } = await load("features/checkout/checkoutStore.js");
    const { quoteServiceOrder } = await load(
      "features/services/serviceOrderModel.js",
    );
    const { marketplaceData } = await load("data/fixtures/marketplace.js");
    const client = {
      status: "authenticated",
      user: {
        id: "client_001",
        displayName: "Nile Studio",
        role: "client",
        accountStatus: "active",
        verificationStatus: "approved",
      },
    };
    const selection = { packageId: "package_001", extraIds: ["extra_001"] };
    selection.expectedRevision = quoteServiceOrder(
      "service_001",
      selection,
      client,
      marketplaceData,
    ).revision;
    const created = orderStore.createFromService(
      "service_001",
      selection,
      client,
      "route-order",
      () => marketplaceData,
    );
    assert.equal(created.ok, true);
    const id = created.order.id;
    const student = {
      ...client,
      user: {
        ...client.user,
        id: created.order.studentId,
        displayName: "Assigned student",
        role: "student",
      },
    };
    const render = (path, session = client) =>
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
    const openCheckout = render(`/checkout/${id}`);
    assert.match(openCheckout, /Review escrow payment/);
    assert.match(openCheckout, /2,200/);
    assert.match(render(`/orders/${id}`), new RegExp(`href="/checkout/${id}"`));
    assert.equal(
      checkoutStore.fundInitial({
        orderId: id,
        session: client,
        payment: { method: "visa", cardId: "card_visa", acknowledged: true },
      }).ok,
      true,
    );
    assert.match(render(`/checkout/${id}`), /Demo payment confirmed/);
    assert.match(render(`/orders/${id}`, student), /in progress/);
    assert.doesNotMatch(
      render(`/orders/${id}`, student),
      /Awaiting-payment orders cannot start work/,
    );
    assert.match(render("/student/orders", student), new RegExp(id));
    assert.match(render("/client/orders"), new RegExp(id));
    assert.match(render("/client/payments/overview"), new RegExp(id));
    const delivery = orderStore.submitDelivery(
      id,
      { text: "Fictional work", attachmentIds: [] },
      student,
      null,
      "submit",
    );
    assert.equal(delivery.ok, true);
    assert.equal(
      orderStore.acceptDelivery(id, client, delivery.delivery.id, "accept").ok,
      true,
    );
    for (const route of [
      `/checkout/${id}`,
      "/client/payments/overview",
      "/client/orders",
    ])
      assert.match(render(route), /Completed/);
    assert.match(render(`/orders/${id}`), /completed/);
    assert.match(render(`/checkout/${id}`), /100% · Delivery accepted/);
    const foreign = { ...client, user: { ...client.user, id: "client_other" } };
    assert.doesNotMatch(render("/client/orders", foreign), new RegExp(id));
    assert.doesNotMatch(
      render("/client/payments/overview", foreign),
      new RegExp(id),
    );
    assert.doesNotMatch(render(`/orders/${id}`, foreign), /Fictional work/);
    assert.match(
      render(`/checkout/${id}`, foreign),
      /Service order unavailable/,
    );
    assert.match(render("/checkout/missing"), /Service order unavailable/);
    assert.match(render("/checkout/order_001"), /Service order unavailable/);
  } finally {
    await vite.close();
  }
});

test("student and client profile/workspace sidebars link to the existing guarded, owner-scoped Orders pages", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: Router } = await vite.ssrLoadModule("/src/app/router.jsx");
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const { orderStore } = await vite.ssrLoadModule(
      "/src/features/orders/orderStore.js",
    );
    const render = (path, session) =>
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
    for (const role of ["student", "client"]) {
      const session = {
        status: "authenticated",
        user: {
          id: `${role}_001`,
          displayName: "Fixture owner",
          role,
          accountStatus: "active",
        },
      };
      const sidebar = render(`/${role}/dashboard`, session).match(
        /<aside\b[\s\S]*?<\/aside>/,
      )?.[0];
      assert.ok(sidebar);
      assert.match(sidebar, new RegExp(`href="/${role}/orders"`));
      assert.match(sidebar, />Orders<|>Orders</);
      const list = render(`/${role}/orders`, session);
      const ownerKey = `${role}Id`;
      for (const order of orderStore.getSnapshot()) {
        if (order[ownerKey] === session.user.id)
          assert.ok(list.includes(`/orders/${order.id}`));
        else assert.ok(!list.includes(`/orders/${order.id}`));
      }
      assert.doesNotMatch(
        render(`/${role}/orders`, { status: "anonymous", user: null }),
        /order-list__body/,
      );
      assert.doesNotMatch(
        render(`/${role}/orders`, {
          ...session,
          user: {
            ...session.user,
            role: role === "student" ? "client" : "student",
          },
        }),
        /order-list__body/,
      );
    }
    const owner = {
      status: "authenticated",
      user: {
        id: "student_001",
        displayName: "Salma Farid",
        role: "student",
        accountStatus: "active",
      },
    };
    assert.match(
      render("/students/student_001", owner),
      /aria-label="Profile workspace"/,
    );
    assert.match(
      render("/students/student_001", owner),
      /href="\/student\/orders"/,
    );
    assert.doesNotMatch(
      render("/students/student_001", { status: "anonymous", user: null }),
      /aria-label="Profile workspace"/,
    );
    assert.doesNotMatch(
      render("/students/student_002", owner),
      /aria-label="Profile workspace"/,
    );
  } finally {
    await vite.close();
  }
});
