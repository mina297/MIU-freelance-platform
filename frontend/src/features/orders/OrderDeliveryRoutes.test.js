import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("delivery workspace follows review/revision/completion across roles while lists and private history update", async () => {
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
        id: "student_002",
        role: "student",
        displayName: "Omar Nabil",
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
    const initial = render("/orders/order_001", student);
    assert.match(initial, /Delivery &amp; revisions/);
    assert.match(initial, /Review demo delivery/);
    assert.match(initial, /Sample completed work.pdf/);
    assert.doesNotMatch(initial, /type="file"|download=/);
    assert.equal((initial.match(/<main\b/g) ?? []).length, 1);
    assert.equal((initial.match(/<h1\b/g) ?? []).length, 1);
    const result = orderStore.submitDelivery(
      "order_001",
      {
        text: "<script>fictional delivery</script>",
        attachmentIds: ["delivery_sample_notes"],
      },
      student,
      null,
      "route-first",
    );
    assert.equal(result.ok, true);
    const clientReview = render("/orders/order_001");
    assert.match(clientReview, /Review revision request/);
    assert.match(clientReview, /Accept latest delivery/);
    assert.match(
      clientReview,
      /&lt;script&gt;fictional delivery&lt;\/script&gt;/,
    );
    assert.match(clientReview, /Keep order unchanged/);
    assert.doesNotMatch(clientReview, /<script>fictional delivery/);
    const revised = orderStore.requestRevision(
      "order_001",
      { text: "Clarify the fictional scope notes." },
      client,
      result.delivery.id,
      "route-revise",
    );
    assert.equal(revised.ok, true);
    assert.match(
      render("/orders/order_001", student),
      /Clarify the fictional scope notes/,
    );
    assert.match(render("/orders/order_001", student), /Review demo delivery/);
    const second = orderStore.submitDelivery(
      "order_001",
      { text: "Revised fictional handover", attachmentIds: [] },
      student,
      result.delivery.id,
      "route-second",
    );
    assert.equal(second.ok, true);
    assert.equal(
      orderStore.acceptDelivery(
        "order_001",
        client,
        second.delivery.id,
        "route-accept",
      ).ok,
      true,
    );
    for (const session of [client, student]) {
      const completed = render("/orders/order_001", session);
      assert.match(completed, /Order completed — simulation/);
      assert.match(completed, /Revised fictional handover/);
      assert.match(completed, /Client accepted delivery/);
      assert.doesNotMatch(
        completed,
        /Review demo delivery|Review revision request|>Accept latest delivery<|Send demo message|Save demo requirements/,
      );
    }
    assert.match(render("/client/orders"), /Completed/);
    assert.match(render("/student/orders", student), /Completed/);
    const servicePending = render("/orders/order_002");
    assert.match(servicePending, /Awaiting payment/);
    assert.doesNotMatch(
      servicePending,
      /Review demo delivery|>Accept latest delivery</,
    );
    const stranger = {
      ...student,
      user: { ...student.user, id: "student_001" },
    };
    assert.doesNotMatch(
      render("/orders/order_001", stranger),
      /fictional delivery|Revised fictional handover|Delivery &amp; revisions/,
    );
  } finally {
    await vite.close();
  }
});
