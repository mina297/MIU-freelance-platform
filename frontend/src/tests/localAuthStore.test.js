import test from "node:test";
import assert from "node:assert/strict";
import {
  createLocalAuthStore,
  LOCAL_ACCOUNTS_KEY,
  DEMO_PASSWORD,
  getLoginDestination,
  committeeRoles,
} from "../features/auth/localAuthStore.js";
import { mockUsers } from "../data/fixtures/users.js";

function storageMock() {
  const map = new Map();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
  };
}
const values = {
  firstName: "Demo",
  lastName: "Student",
  country: "Egypt",
  acceptTerms: true,
  role: "student",
  email: "demo@miuegypt.edu.eg",
  password: "Fictional123!",
};

test("registration survives store recreation, normalizes duplicate emails and verifies passwords without storing plaintext", async () => {
  const storage = storageMock();
  const first = createLocalAuthStore(mockUsers, storage);
  const result = await first.register(values);
  assert.equal(result.ok, true);
  const serialized = storage.getItem(LOCAL_ACCOUNTS_KEY);
  assert.ok(!serialized.includes(values.password));
  const reload = createLocalAuthStore(mockUsers, storage);
  assert.equal(
    (await reload.login({ email: values.email, password: "Wrong123" })).ok,
    false,
  );
  assert.deepEqual(
    (
      await reload.login({
        email: values.email.toUpperCase(),
        password: values.password,
      })
    ).user,
    result.user,
  );
  assert.equal(
    (
      await reload.register({
        ...values,
        email: ` ${values.email.toUpperCase()} `,
      })
    ).ok,
    false,
  );
  assert.equal(
    reload.getPublicProfileUser(result.user.id, "student").displayName,
    "Demo Student",
  );
  assert.equal(getLoginDestination(result.user), "/profile");
});

test("Super Admin sees registrations, provisions all five roles, and suspension/audit persist", async () => {
  const storage = storageMock();
  const store = createLocalAuthStore(mockUsers, storage);
  const adminLogin = await store.login({
    email: "admin_001@example.test",
    password: DEMO_PASSWORD,
  });
  assert.equal(adminLogin.ok, true);
  const session = { status: "authenticated", user: adminLogin.user };
  const student = await store.register(values);
  assert.ok(store.listUsers(session).some((u) => u.id === student.user.id));
  assert.deepEqual(store.listUsers({ status: "anonymous" }), []);
  const forbidden = await store.createCommitteeAccount(
    { status: "authenticated", user: student.user },
    {},
  );
  assert.equal(forbidden.ok, false);
  for (const [committee, role] of Object.entries(committeeRoles)) {
    const email = `${committee}@example.test`;
    const created = await store.createCommitteeAccount(session, {
      name: "Demo Reviewer",
      email,
      password: "Committee123!",
      committee,
      reason: "Academic demonstration",
    });
    assert.equal(created.ok, true);
    assert.equal(created.user.role, role);
    const reload = createLocalAuthStore(mockUsers, storage);
    const signedIn = await reload.login({ email, password: "Committee123!" });
    assert.equal(signedIn.ok, true);
    assert.equal(getLoginDestination(signedIn.user), `/committee/${committee}`);
    assert.equal(
      reload.updateAccountStatus(session, {
        target: created.user.id,
        value: "suspended",
        reason: "Test suspension",
      }).ok,
      true,
    );
    assert.equal(
      (await store.login({ email, password: "Committee123!" })).ok,
      false,
    );
    assert.equal(
      store.updateAccountStatus(session, {
        target: created.user.id,
        value: "active",
        reason: "Test restoration",
      }).ok,
      true,
    );
  }
  assert.equal(
    createLocalAuthStore(mockUsers, storage).getAudit(session).length,
    15,
  );
  assert.equal(
    (
      await store.register({
        ...values,
        email: "other@example.test",
        role: "super_admin",
      })
    ).ok,
    false,
  );
});

test("seed credentials reject wrong password and recovery persists a replacement", async () => {
  const storage = storageMock();
  const store = createLocalAuthStore(mockUsers, storage);
  assert.equal(
    (
      await store.login({
        email: "admin_001@example.test",
        password: "Wrong123",
      })
    ).ok,
    false,
  );
  assert.equal(
    (
      await store.resetPassword({
        email: "admin_001@example.test",
        password: "Changed123!",
        confirmPassword: "Changed123!",
      })
    ).ok,
    true,
  );
  const reload = createLocalAuthStore(mockUsers, storage);
  assert.equal(
    (
      await reload.login({
        email: "admin_001@example.test",
        password: DEMO_PASSWORD,
      })
    ).ok,
    false,
  );
  assert.equal(
    (
      await reload.login({
        email: "admin_001@example.test",
        password: "Changed123!",
      })
    ).ok,
    true,
  );
  assert.ok(!storage.getItem(LOCAL_ACCOUNTS_KEY).includes("Changed123!"));
});

test("unavailable, full and corrupt storage never report a successful account creation", async () => {
  const unavailable = createLocalAuthStore(mockUsers, null);
  assert.equal((await unavailable.register(values)).ok, false);
  const storage = storageMock();
  storage.setItem(LOCAL_ACCOUNTS_KEY, "{broken");
  assert.equal(
    (await createLocalAuthStore(mockUsers, storage).register(values)).ok,
    false,
  );
  assert.equal(storage.getItem(LOCAL_ACCOUNTS_KEY), "{broken");
  storage.removeItem(LOCAL_ACCOUNTS_KEY);
  storage.setItem = () => {
    throw new Error("QuotaExceededError");
  };
  const full = createLocalAuthStore(mockUsers, storage);
  assert.equal((await full.register(values)).ok, false);
  assert.equal(
    (await full.login({ email: values.email, password: values.password })).ok,
    false,
  );
});

test("public profile shells reload from saved accounts and edits migrate once to localStorage", async () => {
  const localStorage = storageMock();
  const sessionStorage = storageMock();
  const priorWindow = globalThis.window;
  globalThis.window = { localStorage, sessionStorage };
  try {
    const result = await createLocalAuthStore(mockUsers, localStorage).register(
      values,
    );
    const { getRegistrationProfile } =
      await import("../features/profiles/registrationProfiles.js");
    assert.equal(
      getRegistrationProfile(result.user.id, "student").displayName,
      "Demo Student",
    );
    const { PROFILE_EDIT_STORAGE_KEY } =
      await import("../features/profiles/constants.js");
    const { saveProfileEdit, getProfileEdit } =
      await import("../features/profiles/utils/profileEditStorage.js");
    sessionStorage.setItem(
      PROFILE_EDIT_STORAGE_KEY,
      JSON.stringify({ [result.user.id]: { headline: "Legacy demo" } }),
    );
    assert.equal(getProfileEdit(result.user.id).headline, "Legacy demo");
    assert.equal(sessionStorage.getItem(PROFILE_EDIT_STORAGE_KEY), null);
    saveProfileEdit(
      result.user.id,
      { headline: "Saved demo", role: "super_admin" },
      { status: "authenticated", user: result.user },
    );
    window.sessionStorage = storageMock();
    assert.equal(getProfileEdit(result.user.id).headline, "Saved demo");
    assert.equal(getProfileEdit(result.user.id).role, undefined);
  } finally {
    globalThis.window = priorWindow;
  }
});
