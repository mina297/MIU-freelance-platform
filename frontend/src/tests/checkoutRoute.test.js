import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("checkout and client history share authorized service funding across routes", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { default: Router } = await vite.ssrLoadModule("/src/app/router.jsx");
    const { AuthContext } = await vite.ssrLoadModule(
      "/src/contexts/AuthContext.js",
    );
    const { checkoutStore } = await vite.ssrLoadModule(
      "/src/features/checkout/checkoutStore.js",
    );
    const client = {
      status: "authenticated",
      user: {
        id: "client_001",
        displayName: "Nile Studio",
        role: "client",
        accountStatus: "active",
      },
    };
    const render = (path, session = client) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            AuthContext.Provider,
            { value: { session, startDemoSession() {} } },
            React.createElement(Router),
          ),
        ),
      );
    for (const path of ["/Checkout", "/checkout", "/checkout/order_002"]) {
      const html = render(path);
      assert.match(html, /Responsive landing page design/);
      assert.match(html, /Salma Farid/);
      assert.match(html, /2,200/);
      assert.match(html, /1,100/);
      assert.match(html, /Visa/);
      assert.match(html, /Mastercard/);
      assert.match(html, /Apple Pay/);
      assert.match(html, /Review escrow payment/);
      assert.match(html, /Demo checkout/);
      assert.equal((html.match(/<main\b/g) ?? []).length, 1);
    }
    assert.match(
      render("/Checkout", { status: "anonymous", user: null }),
      /Start client demo/,
    );
    assert.doesNotMatch(
      render("/Checkout", {
        ...client,
        user: { ...client.user, role: "student" },
      }),
      /checkout-payment-form/,
    );
    assert.match(
      render("/Checkout", {
        ...client,
        user: { ...client.user, id: "different_client" },
      }),
      /Service order unavailable/,
    );
    assert.match(render("/checkout/missing"), /Service order unavailable/);
    const empty = render("/client/payments");
    assert.match(empty, /No payments yet/);
    assert.match(render("/client/payments/overview"), /Awaiting Payment/);
    const result = checkoutStore.fundInitial({
      orderId: "order_002",
      session: client,
      payment: { method: "visa", cardId: "card_visa", acknowledged: true },
      now: new Date("2026-10-24T12:00:00Z"),
    });
    assert.equal(result.ok, true);
    for (const path of ["/client/payments/overview", "/client/payments"]) {
      const html = render(path);
      assert.match(html, /DEMO-PAY-order_002/);
      assert.match(html, /Partially Paid — Escrow Held/);
      assert.match(html, /Held in Escrow/);
    }
    assert.match(render("/client/payments/overview"), /In Progress/);
    const confirmed = render("/Checkout");
    assert.match(confirmed, /Demo payment confirmed/);
    assert.match(confirmed, /No real payment was made/);
    assert.doesNotMatch(confirmed, /Confirm demo payment/);
    assert.doesNotMatch(
      render("/client/payments", {
        ...client,
        user: { ...client.user, id: "different_client" },
      }),
      /DEMO-PAY-order_002/,
    );
  } finally {
    await vite.close();
  }
});
