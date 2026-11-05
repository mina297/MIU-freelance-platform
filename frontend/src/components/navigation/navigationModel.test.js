import test from "node:test";
import assert from "node:assert/strict";
import {
  navigationItems,
  usesApplicationNavigation,
  readNavigationLayout,
  saveNavigationLayout,
  NAVIGATION_STORAGE_KEY,
} from "./navigationModel.js";
import { ROLES, getRouteAccess } from "../../features/auth/session.js";
import { routeConfig } from "../../app/routeConfig.js";
const session = (role) => ({
  status: "authenticated",
  user: {
    id: "test",
    displayName: "Test account",
    role,
    accountStatus: "active",
  },
});
test("navigation preference defaults safely and stores only valid placement", () => {
  for (const value of [null, "", "dark", "vertical", "top"])
    assert.equal(readNavigationLayout({ getItem: () => value }), "top");
  assert.equal(readNavigationLayout({ getItem: () => "side" }), "side");
  const blocked = {
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    },
  };
  assert.equal(readNavigationLayout(blocked), "top");
  assert.equal(saveNavigationLayout(blocked, "side"), false);
  assert.equal(readNavigationLayout(undefined), "top");
  const writes = [];
  const storage = { setItem: (...args) => writes.push(args) };
  assert.equal(saveNavigationLayout(storage, "bad"), false);
  saveNavigationLayout(storage, "side");
  assert.deepEqual(writes, [[NAVIGATION_STORAGE_KEY, "side"]]);
});
test("all role links resolve to permitted routes without preview or dynamic paths", () => {
  for (const role of Object.values(ROLES)) {
    const current = session(role);
    const items = navigationItems(current);
    assert.ok(items.length);
    assert.equal(new Set(items.map((item) => item.to)).size, items.length);
    for (const item of items) {
      const route = routeConfig.find((route) => route.path === item.to);
      assert.equal(getRouteAccess(current, route), "allowed");
      assert.ok(!item.to.includes(":"));
      assert.notEqual(route.showInNavigation, false);
    }
    if (role.endsWith("committee"))
      assert.equal(
        items.filter((item) => item.to.startsWith("/committee/")).length,
        1,
      );
  }
});
test("application shell excludes marketing, auth, anonymous and forbidden pages", () => {
  for (const path of [
    "/",
    "/about",
    "/terms",
    "/login",
    "/SuperAdmin",
    "/missing",
  ])
    assert.equal(
      usesApplicationNavigation(session("student"), path),
      false,
      path,
    );
  for (const path of [
    "/projects",
    "/services",
    "/student/dashboard",
    "/student/services/new",
    "/orders/order_1",
  ])
    assert.equal(
      usesApplicationNavigation(session("student"), path),
      true,
      path,
    );
  assert.equal(
    usesApplicationNavigation(session("student"), "/client/dashboard"),
    false,
  );
  assert.equal(
    usesApplicationNavigation({ status: "anonymous" }, "/projects"),
    false,
  );
  assert.equal(
    usesApplicationNavigation(
      { ...session("student"), status: "expired" },
      "/projects",
    ),
    false,
  );
  assert.equal(
    usesApplicationNavigation(
      {
        ...session("student"),
        user: { ...session("student").user, accountStatus: "suspended" },
      },
      "/projects",
    ),
    false,
  );
});
