import test from "node:test";
import assert from "node:assert/strict";
import { mockUsers } from "../data/fixtures/users.js";
import { marketplaceParticipants } from "../data/fixtures/marketplace.js";
import {
  createMockAuthStore,
  validateRegistration,
  passwordError,
  emailError,
} from "../features/auth/mockAuth.js";
import { getLoginDestination } from "../features/auth/navigation.js";
import { routeConfig } from "../app/routeConfig.js";
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

const registration = {
  fullName: "Demo Student",
  email: "student@example.test",
  password: "DemoPass1",
  confirmPassword: "DemoPass1",
  role: ROLES.STUDENT,
};

test("auth email validation requires at least two letters after the final dot", () => {
  for (const email of [
    "svvvvvvvv@miu.c",
    "user@miu.edu.c",
    "user@miu.",
    "user@miu.c1",
  ]) {
    assert.ok(emailError(email), email);
    assert.ok(validateRegistration({ ...registration, email }).email, email);
    const store = createMockAuthStore();
    assert.ok(
      store.login({ email, password: registration.password }).errors.email,
    );
    assert.ok(store.forgotPassword(email).errors.email);
    assert.ok(store.resetPassword({ ...registration, email }).errors.email);
  }
  for (const email of [
    "user@miu.co",
    "user@miu.com",
    "user@miu.edu.eg",
    " USER@MIU.COM ",
  ]) {
    assert.equal(emailError(email), "", email);
  }
});

test("registration validates all fields and rejects privileged or manipulated roles", () => {
  assert.deepEqual(validateRegistration(registration), {});
  const missing = validateRegistration({});
  assert.deepEqual(
    Object.keys(missing).sort(),
    ["fullName", "email", "password", "confirmPassword", "role"].sort(),
  );
  assert.ok(
    validateRegistration({ ...registration, email: "bad email" }).email,
  );
  assert.ok(validateRegistration({ ...registration, fullName: "  " }).fullName);
  assert.ok(
    validateRegistration({ ...registration, confirmPassword: "wrong" })
      .confirmPassword,
  );
  for (const role of [
    ...Object.values(ROLES).filter(
      (role) => !PUBLIC_REGISTRATION_ROLES.includes(role),
    ),
    "unknown",
    "Student",
    { role: "student" },
  ]) {
    const store = createMockAuthStore();
    assert.ok(store.register({ ...registration, role }).errors.role);
    assert.equal(store.login(registration).ok, false);
  }
});

test("password rules enforce length, a letter and a number", () => {
  for (const password of ["", "abc1234", "abcdefgh", "12345678", undefined])
    assert.ok(passwordError(password));
  for (const password of ["abcdefg1", "1234567A", "LongerDemo42!"])
    assert.equal(passwordError(password), "");
});

test("registration to login preserves identity and rejects case-insensitive duplicates", () => {
  for (const role of PUBLIC_REGISTRATION_ROLES) {
    const store = createMockAuthStore(mockUsers);
    const created = store.register({ ...registration, role });
    assert.equal(created.ok, true);
    assert.equal(created.user.role, role);
    assert.equal(created.user.accountStatus, "active");
    assert.equal(created.user.verificationStatus, "pending");
    const loggedIn = store.login({
      email: " STUDENT@EXAMPLE.TEST ",
      password: registration.password,
    });
    assert.deepEqual(loggedIn.user, created.user);
    assert.ok(
      store.register({ ...registration, email: " Student@Example.Test " })
        .errors.email,
    );
    assert.ok(
      store.register({ ...registration, email: "STUDENT_001@EXAMPLE.TEST" })
        .errors.email,
    );
    assert.equal(store.findUser("student_001").displayName, "Salma Farid");
    assert.equal(
      store.login({ ...registration, password: "incorrect" }).ok,
      false,
    );
    assert.equal(store.login({ email: "", password: "" }).ok, false);
  }
});

test("forgot-password is simulated and password reset changes only memory", () => {
  const store = createMockAuthStore(mockUsers);
  store.register(registration);
  assert.equal(store.forgotPassword("invalid").ok, false);
  assert.match(
    store.forgotPassword(registration.email).message,
    /no email was sent/,
  );
  assert.equal(store.forgotPassword("unknown@example.test").ok, true);
  assert.equal(
    store.resetPassword({ ...registration, password: "weak" }).ok,
    false,
  );
  assert.equal(
    store.resetPassword({ ...registration, email: "absent@example.test" }).ok,
    false,
  );
  const changed = store.resetPassword({
    ...registration,
    password: "Changed123",
    confirmPassword: "Changed123",
  });
  assert.equal(changed.ok, true);
  assert.match(changed.message, /No secure token/);
  assert.equal(store.login(registration).ok, false);
  assert.equal(
    store.login({ ...registration, password: "Changed123" }).ok,
    true,
  );
  const fresh = createMockAuthStore(mockUsers);
  assert.equal(
    fresh.login({ ...registration, password: "Changed123" }).ok,
    false,
  );
  assert.equal(fresh.findUser("registered_1"), undefined);
  assert.equal(fresh.findUser("student_001").id, "student_001");
  assert.equal(
    store.resetPassword({ ...registration, email: "student_001@example.test" })
      .ok,
    true,
  );
  assert.equal(
    store.login({ ...registration, email: "student_001@example.test" }).ok,
    true,
  );
  assert.equal(
    fresh.login({ ...registration, email: "student_001@example.test" }).ok,
    false,
  );
});

test("account feedback stays concise without demo wording or hiding recovery limits", () => {
  const store = createMockAuthStore(mockUsers);
  const responses = [
    store.login(registration),
    store.forgotPassword(registration.email),
    store.resetPassword(registration),
    store.resetPassword({ ...registration, email: "student_001@example.test" }),
  ];
  for (const response of responses)
    assert.doesNotMatch(JSON.stringify(response), /\bdemo\b/i);
  assert.match(responses[1].message, /Prototype recovery/);
  assert.match(responses[1].message, /no email was sent/);
  assert.match(responses[3].message, /No secure token/);
  assert.match(responses[3].message, /until refresh/);
  for (const user of mockUsers)
    assert.doesNotMatch(user.displayName, /\bdemo\b/i);
});

test("inactive fixtures cannot log in, reset passwords or start sessions", () => {
  for (const accountStatus of ["suspended", "deactivated"]) {
    const fixture = { ...mockUsers[0], accountStatus };
    const store = createMockAuthStore([fixture]);
    const values = { ...registration, email: "student_001@example.test" };
    assert.equal(store.resetPassword(values).ok, false);
    assert.equal(store.login(values).ok, false);
    assert.deepEqual(
      sessionReducer(INITIAL_SESSION, {
        type: "start",
        user: store.findUser(fixture.id),
      }),
      INITIAL_SESSION,
    );
  }
});

test("session records explicitly discard credentials and extra account data", () => {
  const state = sessionReducer(INITIAL_SESSION, {
    type: "start",
    user: {
      ...mockUsers[0],
      password: "private",
      confirmPassword: "private",
      email: "private@example.test",
      token: "private",
    },
  });
  assert.deepEqual(state.user, mockUsers[0]);
  for (const key of ["password", "confirmPassword", "email", "token"])
    assert.equal(key in state.user, false);
});

test("safe return navigation preserves authorized internal targets and rejects unsafe destinations", () => {
  const user = mockUsers[0];
  assert.equal(
    getLoginDestination(user, "/projects?skill=react#results", routeConfig),
    "/projects?skill=react#results",
  );
  for (const from of [
    "https://evil.test",
    "//evil.test",
    "/\\evil.test",
    "/client/dashboard",
    "/admin",
    "/login",
    "/register",
    "/not-real",
    "/session-expired",
    "/%2f%2fevil.test",
    " /projects",
    null,
  ]) {
    assert.equal(
      getLoginDestination(user, from, routeConfig),
      "/student/dashboard",
      String(from),
    );
  }
  for (const fixture of mockUsers) {
    const destination = getLoginDestination(fixture, undefined, routeConfig);
    assert.ok(destination.startsWith("/"));
    assert.notEqual(destination, "/");
  }
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
