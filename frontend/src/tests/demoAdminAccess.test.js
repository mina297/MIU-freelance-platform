import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("existing demo Admin uses prototype reset then normal login and only an active Super Admin can enter /admin", async () => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "silent",
  });
  try {
    const load = (path) => vite.ssrLoadModule(`/src/${path}`);
    const { createMockAuthStore } = await load("features/auth/mockAuth.js");
    const { sessionReducer, INITIAL_SESSION, getRouteAccess } = await load(
      "features/auth/session.js",
    );
    const { mockUsers } = await load("data/fixtures/users.js");
    const { routeConfig } = await load("app/routeConfig.js");
    const { default: Router } = await load("app/router.jsx");
    const { AuthContext } = await load("contexts/AuthContext.js");
    const store = createMockAuthStore(mockUsers);
    const credentials = {
      email: "admin_001@example.test",
      password: "FictionalTest42",
      confirmPassword: "FictionalTest42",
    };
    assert.equal(
      mockUsers.filter((user) => user.role === "super_admin").length,
      1,
    );
    assert.equal(store.login(credentials).ok, false); // No configured initial password.
    assert.equal(store.resetPassword(credentials).ok, true);
    const loggedIn = store.login(credentials);
    assert.equal(loggedIn.ok, true);
    assert.equal(loggedIn.user.id, "admin_001");
    assert.equal(loggedIn.user.role, "super_admin");
    assert.equal("password" in loggedIn.user, false);
    const session = sessionReducer(INITIAL_SESSION, {
      type: "start",
      user: loggedIn.user,
    });
    const adminRoute = routeConfig.find((route) => route.path === "/admin");
    const render = (activeSession) =>
      renderToStaticMarkup(
        React.createElement(
          MemoryRouter,
          { initialEntries: ["/admin"] },
          React.createElement(
            AuthContext.Provider,
            { value: { session: activeSession } },
            React.createElement(Router),
          ),
        ),
      );
    assert.equal(getRouteAccess(session, adminRoute), "allowed");
    assert.match(render(session), /admin-center/);
    assert.equal(
      store.login({ ...credentials, password: "incorrect" }).ok,
      false,
    );
    for (const role of ["student", "client"]) {
      const created = store.register({
        fullName: "Ordinary account",
        email: `${role}@example.test`,
        password: credentials.password,
        confirmPassword: credentials.password,
        role,
      });
      assert.equal(created.ok, true);
      const ordinary = sessionReducer(INITIAL_SESSION, {
        type: "start",
        user: store.login({
          email: `${role}@example.test`,
          password: credentials.password,
        }).user,
      });
      assert.equal(getRouteAccess(ordinary, adminRoute), "denied");
      assert.doesNotMatch(render(ordinary), /admin-center/);
    }
    for (const inactive of [
      INITIAL_SESSION,
      { ...session, status: "expired", user: null },
      { ...session, user: { ...session.user, accountStatus: "suspended" } },
    ]) {
      assert.notEqual(getRouteAccess(inactive, adminRoute), "allowed");
      assert.doesNotMatch(render(inactive), /admin-center/);
    }
    assert.equal(
      store.register({
        fullName: "Forbidden",
        email: "forbidden@example.test",
        password: credentials.password,
        confirmPassword: credentials.password,
        role: "super_admin",
      }).ok,
      false,
    );
    assert.equal(createMockAuthStore(mockUsers).login(credentials).ok, false);
  } finally {
    await vite.close();
  }
});
