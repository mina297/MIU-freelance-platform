import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("M5 routes preserve canonical identities, session ownership and actual completed-order review eligibility", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const load = (path) => vite.ssrLoadModule(`/src/${path}`);
    const { default: Router } = await load("app/router.jsx");
    const { AuthContext } = await load("contexts/AuthContext.js");
    const { mockUsers } = await load("data/fixtures/users.js");
    const { marketplaceParticipants } = await load(
      "data/fixtures/marketplace.js",
    );
    const { studentProfiles, clientProfiles } = await load(
      "data/fixtures/profiles.js",
    );
    const { completedOrders: legacyOrders } = await load(
      "data/fixtures/reviews.js",
    );
    const { orderStore } = await load("features/orders/orderStore.js");
    const { reviewStore } = await load("features/reviews/reviewStore.js");
    const { getStudentProfileById } = await load(
      "features/profiles/utils/getStudentProfile.js",
    );
    const { default: ProfileEdit } = await load(
      "features/profiles/ProfileEditPage.jsx",
    );
    const anonymous = { status: "anonymous", user: null };
    const client = {
      status: "authenticated",
      user: mockUsers.find(({ id }) => id === "client_001"),
    };
    const student = {
      status: "authenticated",
      user: mockUsers.find(({ id }) => id === "student_002"),
    };
    const wrap = (element, session, path = "/") =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            AuthContext.Provider,
            { value: { session } },
            element,
          ),
        ),
      );
    const render = (path, session = anonymous) =>
      wrap(React.createElement(Router), session, path);
    for (const [participants, profiles] of [
      [marketplaceParticipants.students, studentProfiles],
      [marketplaceParticipants.clients, clientProfiles],
    ])
      for (const person of participants)
        assert.equal(
          profiles.find(({ id }) => id === person.id).displayName,
          person.displayName,
        );
    assert.ok(
      legacyOrders.every(
        ({ id }) => !orderStore.getSnapshot().some((order) => order.id === id),
      ),
    );
    assert.equal(getStudentProfileById("student_001").profile.verified, false);
    assert.equal(
      getStudentProfileById("student_001").profile.ratingSummary.count,
      0,
    );
    for (const path of [
      "/students/student_001",
      "/clients/client_001",
      "/help",
      "/support/contact",
    ]) {
      const html = render(path);
      assert.equal((html.match(/<main\b/g) ?? []).length, 1, path);
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1, path);
      assert.doesNotMatch(html, /routing placeholder only/);
    }
    assert.match(render("/students/student_001"), /Salma Farid/);
    assert.doesNotMatch(
      render("/students/student_001?tab=reviews"),
      />Leave a review<\/button>|Nour El-Sayed/,
    );
    assert.match(render("/clients/client_001"), /Nile Studio/);
    assert.match(render("/profile/edit", student), /Editing.*student/s);
    assert.match(
      wrap(
        React.createElement(ProfileEdit, {
          profileId: "student_001",
          role: "student",
        }),
        student,
      ),
      /Only the active profile owner/,
    );
    assert.doesNotMatch(
      render("/students/student_001?tab=portfolio", student),
      />Add portfolio item<\/button>/,
    );
    assert.match(
      render("/students/student_002?tab=portfolio", student),
      /Add portfolio item/,
    );
    assert.doesNotMatch(render("/reviews/new", student), /Written feedback/);
    assert.doesNotMatch(render("/profile/edit", anonymous), /Editing student/);
    assert.match(
      render("/reviews/new", client),
      /No completed orders available/,
    );
    const delivery = orderStore.submitDelivery(
      "order_001",
      {
        text: "Fictional completed handover for integration review.",
        attachmentIds: [],
      },
      student,
      null,
      "m5-delivery",
    );
    assert.equal(delivery.ok, true);
    assert.equal(
      orderStore.acceptDelivery(
        "order_001",
        client,
        delivery.delivery.id,
        "m5-accept",
      ).ok,
      true,
    );
    assert.match(render("/orders/order_001", client), /Review completed order/);
    assert.match(
      render("/reviews/new?orderId=order_001", client),
      /Written feedback/,
    );
    const result = reviewStore.submit(
      {
        orderId: "order_001",
        rating: 5,
        body: "<script>Fictional review with escaped content.</script>",
      },
      client,
    );
    assert.equal(result.ok, true);
    assert.equal(
      reviewStore.submit(
        {
          orderId: "order_001",
          rating: 4,
          body: "A second stale form must not add a second review.",
        },
        client,
      ).ok,
      false,
    );
    const profile = render("/students/student_002?tab=reviews");
    assert.match(profile, /&lt;script&gt;Fictional review/);
    assert.doesNotMatch(profile, /<script>Fictional review/);
    assert.equal(
      getStudentProfileById("student_002").profile.ratingSummary.count,
      1,
    );
    assert.match(
      render("/reviews/new", client),
      /No completed orders available/,
    );
  } finally {
    await vite.close();
  }
});
