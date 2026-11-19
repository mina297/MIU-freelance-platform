import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import {
  createMockAuthStore,
  GOOGLE_PREVIEW_PROFILES,
} from "../features/auth/mockAuth.js";
import {
  INITIAL_SESSION,
  ROLES,
  sessionReducer,
} from "../features/auth/session.js";

const completion = {
  role: ROLES.STUDENT,
  country: "Egypt",
  acceptTerms: true,
  emailSubscription: false,
};

test("Google completion requires country and consent before creating an account", () => {
  const store = createMockAuthStore();
  assert.ok(
    store.registerGoogle({ ...completion, acceptTerms: false }).errors
      .acceptTerms,
  );
  assert.ok(
    store.registerGoogle({ ...completion, country: "Unavailable" }).errors
      .country,
  );
  assert.equal(store.findUser("registered_1"), undefined);
  const result = store.registerGoogle(completion);
  assert.equal(result.ok, true);
  assert.equal(result.user.id, "registered_1");
  assert.equal(result.user.role, ROLES.STUDENT);
  assert.equal(result.user.verificationStatus, "pending");
  assert.equal(
    sessionReducer(INITIAL_SESSION, { type: "start", user: result.user })
      .status,
    "authenticated",
  );
  for (const key of ["password", "token", "email", "acceptTerms"])
    assert.equal(key in result.user, false);
});

test("Google preview uses fixed fictional profiles and never creates privileged accounts", () => {
  const store = createMockAuthStore();
  for (const role of Object.values(ROLES).filter(
    (role) => ![ROLES.STUDENT, ROLES.CLIENT].includes(role),
  )) {
    assert.ok(store.registerGoogle({ ...completion, role }).errors.role);
  }
  for (const role of ["__proto__", "unknown", null])
    assert.equal(store.registerGoogle({ ...completion, role }).ok, false);
  for (const role of [ROLES.STUDENT, ROLES.CLIENT]) {
    const result = store.registerGoogle({
      ...completion,
      role,
      firstName: "Forged",
      email: "real@example.test",
      verificationStatus: "approved",
      accountStatus: "suspended",
      id: "admin_001",
      password: "IgnoredPass1",
    });
    assert.equal(result.ok, true);
    assert.equal(
      result.user.displayName,
      `${GOOGLE_PREVIEW_PROFILES[role].firstName} ${GOOGLE_PREVIEW_PROFILES[role].lastName}`,
    );
    assert.equal(result.user.accountStatus, "active");
    assert.equal(result.user.verificationStatus, "pending");
    assert.notEqual(result.user.id, "admin_001");
    assert.equal(
      store.login({
        email: GOOGLE_PREVIEW_PROFILES[role].email,
        password: "IgnoredPass1",
      }).ok,
      false,
    );
  }
});

test("Google preview rejects duplicate identities and resets with its memory-only store", () => {
  const store = createMockAuthStore();
  assert.equal(store.registerGoogle(completion).ok, true);
  assert.ok(store.registerGoogle(completion).errors.form);
  assert.equal(store.findUser("registered_2"), undefined);
  assert.equal(createMockAuthStore().registerGoogle(completion).ok, true);
  const reserved = createMockAuthStore([
    {
      id: "reserved",
      displayName: "Existing",
      email: GOOGLE_PREVIEW_PROFILES.student.email,
      role: ROLES.CLIENT,
      accountStatus: "active",
      verificationStatus: "approved",
    },
  ]);
  assert.ok(reserved.registerGoogle(completion).errors.form);
  assert.equal(reserved.findUser("reserved").role, ROLES.CLIENT);
});

test("Google completion renders role-aware consent forms with no password or real identity", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { default: AppRouter } = await vite.ssrLoadModule(
      "/src/app/router.jsx",
    );
    const { default: AuthProvider } = await vite.ssrLoadModule(
      "/src/contexts/AuthProvider.jsx",
    );
    const render = (path) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(
            AuthProvider,
            null,
            React.createElement(AppRouter),
          ),
        ),
      );
    for (const role of [ROLES.STUDENT, ROLES.CLIENT]) {
      const html = render(`/register?role=${role}&method=google`);
      assert.match(html, /class="auth-google-identity"/);
      assert.ok(html.includes(GOOGLE_PREVIEW_PROFILES[role].email));
      assert.match(html, /fictional account. No Google connection is made/);
      assert.match(html, /Create my account/);
      assert.match(html, /Use email instead/);
      assert.match(html, /Country/);
      assert.match(html, /name="emailSubscription"/);
      assert.match(
        html,
        /<input(?=[^>]*name="acceptTerms")(?=[^>]*required="")(?![^>]*checked="")[^>]*>/,
      );
      assert.match(html, /href="\/terms#user-agreement"/);
      assert.match(html, /href="\/privacy"/);
      assert.doesNotMatch(html, /name="(?:password|firstName|lastName|email)"/);
      assert.ok(html.includes(`href="/register?role=${role}"`));
    }
    const forbidden = render("/register?role=super_admin&method=google");
    assert.doesNotMatch(forbidden, /class="auth-google-identity"|<form/);
  } finally {
    await vite.close();
  }
});
