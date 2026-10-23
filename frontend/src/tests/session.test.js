import test from "node:test";
import assert from "node:assert/strict";
import { mockUsers } from "../data/fixtures/users.js";
import { marketplaceParticipants } from "../data/fixtures/marketplace.js";
import {
  INITIAL_SESSION,
  PUBLIC_REGISTRATION_ROLES,
  ROLES,
  sessionReducer,
} from "../features/auth/session.js";

test("demo sessions start, explicitly expire, restart and log out without retaining a user", () => {
  const active = sessionReducer(INITIAL_SESSION, {
    type: "start",
    user: mockUsers[0],
  });
  assert.equal(active.status, "authenticated");
  assert.equal(active.user.id, "student_001");
  assert.notEqual(active.user, mockUsers[0]);
  const expired = sessionReducer(active, { type: "expire" });
  assert.deepEqual(expired, { status: "expired", user: null });
  const restarted = sessionReducer(expired, {
    type: "start",
    user: mockUsers[2],
  });
  assert.equal(restarted.user.role, ROLES.CLIENT);
  assert.deepEqual(
    sessionReducer(restarted, { type: "logout" }),
    INITIAL_SESSION,
  );
  assert.equal(
    sessionReducer(INITIAL_SESSION, { type: "expire" }),
    INITIAL_SESSION,
  );
});

test("invalid accounts cannot start a session or preserve a previous privilege", () => {
  const admin = sessionReducer(INITIAL_SESSION, {
    type: "start",
    user: mockUsers[3],
  });
  for (const user of [
    undefined,
    {},
    ...["suspended", "deactivated"].map((accountStatus) => ({
      ...mockUsers[0],
      accountStatus,
    })),
    { ...mockUsers[0], role: "unknown" },
    { ...mockUsers[0], id: " " },
  ]) {
    assert.deepEqual(
      sessionReducer(admin, { type: "start", user }),
      INITIAL_SESSION,
    );
  }
});

test("account fixtures preserve marketplace references and cover all provisioned roles", () => {
  assert.equal(
    new Set(mockUsers.map((user) => user.id)).size,
    mockUsers.length,
  );
  assert.deepEqual(
    new Set(mockUsers.map((user) => user.role)),
    new Set(Object.values(ROLES)),
  );
  for (const [group, role] of [
    ["students", ROLES.STUDENT],
    ["clients", ROLES.CLIENT],
  ]) {
    for (const participant of marketplaceParticipants[group]) {
      const user = mockUsers.find((account) => account.id === participant.id);
      assert.equal(user?.role, role);
      assert.equal(user?.displayName, participant.displayName);
    }
  }
  assert.deepEqual(PUBLIC_REGISTRATION_ROLES, [ROLES.STUDENT, ROLES.CLIENT]);
});
