import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("role-specific order lists show only own live records, safe metrics, recovery states and working detail links", async () => {
  const vite = await createServer({
    root: fileURLToPath(new URL("../../../", import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: Router } = await vite.ssrLoadModule("/src/app/router.jsx");
    const { default: List } = await vite.ssrLoadModule(
      "/src/features/orders/OrdersList.jsx",
    );
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
      user: { ...client.user, id: "student_002", role: "student" },
    };
    const render = (
      path,
      session = client,
      component = React.createElement(Router),
    ) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            AuthContext.Provider,
            { value: { session } },
            component,
          ),
        ),
      );
    const before = orderStore.getSnapshot();
    const clientList = render("/client/orders");
    assert.match(clientList, /Client orders/);
    assert.match(clientList, /5,400/);
    assert.match(clientList, /href="\/orders\/order_001"/);
    assert.match(clientList, /href="\/orders\/order_002"/);
    assert.match(clientList, /not money paid, earned/);
    assert.equal((clientList.match(/<main\b/g) ?? []).length, 1);
    assert.equal((clientList.match(/<h1\b/g) ?? []).length, 1);
    const studentList = render("/student/orders", student);
    assert.match(studentList, /Student orders/);
    assert.match(studentList, /3,200/);
    assert.doesNotMatch(
      studentList,
      /order_002|2,200|5,400|Responsive landing page design/,
    );
    for (const session of [
      student,
      { status: "anonymous", user: null },
      { ...client, status: "expired" },
      { ...client, user: { ...client.user, accountStatus: "suspended" } },
    ])
      assert.doesNotMatch(
        render("/client/orders", session),
        /order_001|order_002|5,400/,
      );
    assert.doesNotMatch(
      render("/student/orders", client),
      /order_001|order_002|5,400/,
    );
    const empty = render("/client/orders", {
      ...client,
      user: { ...client.user, id: "empty-client" },
    });
    assert.match(empty, /No orders yet/);
    assert.doesNotMatch(empty, /order_001|5,400/);
    for (const state of ["loading", "error"]) {
      const screen = render(
        "/client/orders",
        client,
        React.createElement(List, { role: "client", state }),
      );
      assert.doesNotMatch(
        screen,
        /order_001|order_002|5,400|2 of 2 orders shown/,
      );
      assert.match(
        screen,
        state === "loading" ? /Loading your orders/ : /could not be displayed/,
      );
    }
    assert.equal(orderStore.getSnapshot(), before);
    const selection = { packageId: "package_005", extraIds: [] };
    const quote = quoteServiceOrder(
      "service_001",
      selection,
      client,
      serviceStore.getSnapshot(),
    );
    const created = orderStore.createFromService(
      "service_001",
      { ...selection, expectedRevision: quote.revision },
      client,
      "list-test",
      serviceStore.getSnapshot,
    );
    assert.equal(created.ok, true);
    assert.match(render("/client/orders"), new RegExp(created.order.id));
    const salma = {
      ...student,
      user: {
        ...student.user,
        id: "student_001",
        displayName: "Salma Farid",
        verificationStatus: "pending",
      },
    };
    assert.match(
      render("/student/orders", salma),
      new RegExp(created.order.id),
    );
    assert.doesNotMatch(
      render("/student/orders", student),
      new RegExp(created.order.id),
    );
    assert.match(
      render(`/orders/${created.order.id}`),
      /href="\/client\/orders"/,
    );
    assert.match(
      render("/orders/order_001", student),
      /href="\/student\/orders"/,
    );
    assert.equal(orderStore.getSnapshot().length, before.length + 1);
    const { proposalStore } = await vite.ssrLoadModule(
      "/src/features/proposals/proposalStore.js",
    );
    const accepted = proposalStore.decide("proposal_001", client, "accept");
    assert.equal(accepted.ok, true);
    assert.match(render("/client/orders"), new RegExp(accepted.order.id));
    assert.match(
      render("/student/orders", salma),
      new RegExp(accepted.order.id),
    );
    assert.doesNotMatch(
      render("/student/orders", student),
      new RegExp(accepted.order.id),
    );
    assert.equal(orderStore.getSnapshot().length, before.length + 2);
  } finally {
    await vite.close();
  }
});
