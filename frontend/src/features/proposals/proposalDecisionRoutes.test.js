import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("decisions connect review, student confirmation, participant order access and cancellation safeguards", async () => {
  const vite = await createServer({
    root: fileURLToPath(new URL("../../../", import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const { default: AppRouter } = await vite.ssrLoadModule(
      "/src/app/router.jsx",
    );
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const { proposalStore } = await vite.ssrLoadModule(
      "/src/features/proposals/proposalStore.js",
    );
    const { projectStore } = await vite.ssrLoadModule(
      "/src/features/projects/projectStore.js",
    );
    const { orderStore } = await vite.ssrLoadModule(
      "/src/features/orders/orderStore.js",
    );
    const { getOrderById } = await vite.ssrLoadModule(
      "/src/features/marketplace/selectors.js",
    );
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
    const student = {
      ...client,
      user: {
        ...client.user,
        id: "student_002",
        displayName: "Omar Nabil",
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
            React.createElement(AppRouter),
          ),
        ),
      );
    const reviewPath = "/client/projects/project_001/proposals";
    assert.match(render(reviewPath), /Accept offer/);
    assert.match(render(reviewPath), /Keep proposal unchanged/);
    assert.match(render(reviewPath), /Confirm rejection/);
    assert.equal(
      proposalStore.decide("proposal_001", client, "reject").ok,
      true,
    );
    assert.match(render(reviewPath), /Rejected/);
    const submitted = proposalStore.submit(
      {
        priceEGP: "6200",
        deliveryDays: "14",
        coverMessage: "Fictional accepted approach",
        attachmentIds: [],
      },
      "project_001",
      student,
    );
    assert.equal(submitted.ok, true);
    const result = proposalStore.decide(
      submitted.proposal.id,
      client,
      "accept",
    );
    assert.equal(result.ok, true);
    const count = orderStore.getSnapshot().length;
    assert.equal(
      proposalStore.decide(submitted.proposal.id, client, "accept").order.id,
      result.order.id,
    );
    assert.equal(orderStore.getSnapshot().length, count);
    assert.equal(getOrderById(result.order.id), result.order);
    const orderPath = `/orders/${result.order.id}`;
    assert.match(render(reviewPath), /View demo order/);
    assert.match(render(orderPath), /Awaiting payment — demo/);
    assert.match(render(orderPath), /6,200/);
    assert.match(render(orderPath), /14 days/);
    assert.match(render(orderPath, student), /6,200/);
    const confirmation = render("/projects/project_001/propose", student);
    assert.match(confirmation, /Accepted/);
    assert.match(confirmation, /View demo order/);
    assert.doesNotMatch(
      render("/projects"),
      /Build a responsive event website/,
    );
    assert.equal(
      projectStore.transition("project_001", client, "cancel").ok,
      false,
    );
    assert.equal(projectStore.update({}, client, "project_001").ok, false);
    for (const session of [
      { ...client, user: { ...client.user, id: "other_client" } },
      { ...student, user: { ...student.user, id: "student_001" } },
    ]) {
      const blocked = render(orderPath, session);
      assert.match(blocked, /Order unavailable/);
      assert.doesNotMatch(blocked, /6,200|Fictional accepted approach/);
    }
    for (const session of [
      { status: "anonymous", user: null },
      { ...client, status: "expired" },
    ])
      assert.doesNotMatch(render(orderPath, session), /6,200/);
    assert.match(render("/orders/missing"), /Order unavailable/);
    assert.match(render("/orders/order_002"), /Your service order/);
  } finally {
    await vite.close();
  }
});
