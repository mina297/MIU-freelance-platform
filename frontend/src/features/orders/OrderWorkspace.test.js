import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("both order sources compose one participant-only workspace with shared notes, escaped messages and no real uploads", async () => {
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
    const { orderWorkspaceStore } = await vite.ssrLoadModule(
      "/src/features/orders/orderWorkspaceStore.js",
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
    const omar = {
      ...client,
      user: {
        ...client.user,
        id: "student_002",
        role: "student",
        displayName: "Omar Nabil",
        verificationStatus: "pending",
      },
    };
    const salma = {
      ...omar,
      user: { ...omar.user, id: "student_001", displayName: "Salma Farid" },
    };
    const render = (id, session = client) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [`/orders/${id}`] },
          React.createElement(
            AuthContext.Provider,
            { value: { session } },
            React.createElement(Router),
          ),
        ),
      );
    const before = orderStore.getSnapshot();
    for (const id of ["order_001", "order_002"]) {
      const html = render(id);
      assert.equal((html.match(/<main\b/g) ?? []).length, 1);
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
      for (const text of [
        "Order workspace",
        "Requirements",
        "Messages (0)",
        "Progress &amp; activity",
        "Save demo requirements",
        "Send demo message",
        "Sample requirements.pdf",
        "No real files",
      ])
        assert.ok(html.includes(text), text);
      assert.match(html, /role="tablist"/);
      assert.doesNotMatch(
        html,
        /type="file"|download=|Submit delivery|Pay now|Fund escrow/,
      );
    }
    assert.equal(
      orderWorkspaceStore.saveRequirements(
        "order_001",
        {
          text: "Private fictional project requirements",
          attachmentIds: ["order_sample_reference"],
        },
        client,
        0,
      ).ok,
      true,
    );
    assert.equal(
      orderWorkspaceStore.sendMessage(
        "order_001",
        {
          text: "<script>fictional message</script>",
          attachmentIds: ["order_sample_requirements"],
        },
        omar,
        "route-message",
      ).ok,
      true,
    );
    const studentView = render("order_001", omar);
    assert.match(studentView, /Private fictional project requirements/);
    assert.match(
      studentView,
      /&lt;script&gt;fictional message&lt;\/script&gt;/,
    );
    assert.doesNotMatch(
      studentView,
      /<script>fictional message|Save demo requirements/,
    );
    assert.match(studentView, /Only the owning client/);
    assert.match(render("order_001"), /Demo message added/);
    assert.doesNotMatch(
      render("order_002", salma),
      /Private fictional project requirements|fictional message/,
    );
    for (const session of [
      salma,
      { ...client, user: { ...client.user, id: "foreign_client" } },
      { status: "anonymous", user: null },
      { ...client, status: "expired" },
      { ...client, user: { ...client.user, accountStatus: "suspended" } },
    ])
      assert.doesNotMatch(
        render("order_001", session),
        /Order workspace|Private fictional project requirements|fictional message/,
      );
    assert.equal(
      orderWorkspaceStore.saveRequirements(
        "order_002",
        { text: "Service preparation before funding", attachmentIds: [] },
        client,
        0,
      ).ok,
      true,
    );
    assert.match(
      render("order_002", salma),
      /Service preparation before funding/,
    );
    assert.equal(orderStore.getSnapshot(), before);
  } finally {
    await vite.close();
  }
});
