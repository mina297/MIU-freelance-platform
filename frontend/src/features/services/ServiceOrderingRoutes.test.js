import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("service-order configuration is client-only and summaries expose saved terms only to participants", async () => {
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
    const { orderStore } = await vite.ssrLoadModule(
      "/src/features/orders/orderStore.js",
    );
    const { serviceStore } = await vite.ssrLoadModule(
      "/src/features/services/serviceStore.js",
    );
    const { quoteServiceOrder } = await vite.ssrLoadModule(
      "/src/features/services/serviceOrderModel.js",
    );
    const { routeConfig } = await vite.ssrLoadModule("/src/app/routeConfig.js");
    const client = {
      status: "authenticated",
      user: {
        id: "client_001",
        role: "client",
        displayName: "Nile Studio",
        accountStatus: "active",
        verificationStatus: "approved",
      },
    };
    const student = {
      ...client,
      user: {
        ...client.user,
        id: "student_001",
        role: "student",
        displayName: "Salma Farid",
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
    const path = "/services/service_001/order";
    const before = orderStore.getSnapshot();
    const form = render(path);
    for (const text of [
      "Choose a package",
      "Optional extras",
      "Review demo order",
      "Confirm demo order",
      "Keep editing selection",
      "1,800",
      "Landing page",
    ])
      assert.ok(form.includes(text), text);
    assert.equal((form.match(/<main\b/g) ?? []).length, 1);
    assert.match(form, /type="radio"/);
    assert.match(form, /type="checkbox"/);
    assert.match(
      render("/services/service_001"),
      /href="\/services\/service_001\/order"/,
    );
    assert.equal(
      routeConfig.find(({ path }) => path === "/services/:serviceId/order")
        .showInNavigation,
      false,
    );
    for (const session of [
      student,
      { status: "anonymous", user: null },
      { ...client, status: "expired" },
      { ...client, user: { ...client.user, accountStatus: "suspended" } },
    ])
      assert.doesNotMatch(
        render(path, session),
        /Choose your scope|Confirm demo order/,
      );
    assert.match(
      render(path, {
        ...client,
        user: { ...client.user, verificationStatus: "pending" },
      }),
      /verification must be approved/,
    );
    assert.match(
      render("/services/missing/order"),
      /Service ordering unavailable/,
    );
    assert.match(
      render("/services/service_004/order"),
      /Service ordering unavailable/,
    );
    assert.equal(orderStore.getSnapshot(), before); // Rendering/review markup never creates orders.
    const selection = { packageId: "package_001", extraIds: ["extra_001"] };
    const quote = quoteServiceOrder(
      "service_001",
      selection,
      client,
      serviceStore.getSnapshot(),
    );
    const result = orderStore.createFromService(
      "service_001",
      { ...selection, expectedRevision: quote.revision },
      client,
      "route-order",
      serviceStore.getSnapshot,
    );
    assert.equal(result.ok, true);
    const orderPath = `/orders/${result.order.id}`;
    for (const session of [client, student]) {
      const summary = render(orderPath, session);
      assert.match(summary, /Your service order/);
      assert.match(summary, /Awaiting payment/);
      assert.match(summary, /2,200/);
      assert.match(summary, /9 days; work has not started/);
      assert.match(summary, /Saved package terms: Landing page/);
      assert.match(summary, /Additional section/);
      assert.equal((summary.match(/<main\b/g) ?? []).length, 1);
      if (session.user.role === "client")
        assert.ok(summary.includes(`href="/checkout/${result.order.id}"`));
      else assert.doesNotMatch(summary, /href="\/checkout/);
      assert.doesNotMatch(summary, /Pay now|Fund escrow/);
    }
    for (const session of [
      { ...client, user: { ...client.user, id: "other-client" } },
      { ...student, user: { ...student.user, id: "student_002" } },
    ]) {
      const forbidden = render(orderPath, session);
      assert.match(forbidden, /Order unavailable/);
      assert.doesNotMatch(
        forbidden,
        /2,200|Saved package terms|Additional section/,
      );
    }
    assert.match(render("/orders/order_002"), /no historical package snapshot/);
    assert.match(render("/orders/order_001"), /Your project/);
    assert.equal(orderStore.getSnapshot().length, before.length + 1);
  } finally {
    await vite.close();
  }
});
