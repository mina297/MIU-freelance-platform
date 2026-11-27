import { createMockAuthStore, emailError, normalizeEmail } from "./mockAuth.js";
import { isActiveUser, ROLES, toSessionUser } from "./session.js";

export const LOCAL_ACCOUNTS_KEY = "miu.demo-accounts.v1";
export const DEMO_PASSWORD = "MiuDemo2026!";
export const committeeRoles = Object.freeze({
  verification: ROLES.VERIFICATION,
  marketplace: ROLES.MARKETPLACE,
  finance: ROLES.FINANCE,
  support: ROLES.SUPPORT,
  "ai-quality": ROLES.AI_QUALITY,
});
const storageError =
  "Could not save local accounts. Allow site storage or free up space, then try again.";
const failed = (message) => ({ ok: false, message, errors: { form: message } });

export function browserLocalStorage() {
  try {
    return globalThis.window?.localStorage;
  } catch {
    return undefined;
  }
}

// Local demo credentials only. This does not provide server-side authorization.
async function derive(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: Uint8Array.from(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits));
}
async function credential(password) {
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)));
  return { salt, hash: await derive(password, salt) };
}
function validCredential(value) {
  return (
    value &&
    [value.salt, value.hash].every(
      (a) =>
        Array.isArray(a) &&
        a.every((n) => Number.isInteger(n) && n >= 0 && n <= 255),
    ) &&
    value.salt.length === 16 &&
    value.hash.length === 32
  );
}

export function createLocalAuthStore(
  fixtures = [],
  storage = browserLocalStorage(),
) {
  const seeds = fixtures.map((u) => ({
    ...u,
    email: normalizeEmail(u.email || `${u.id}@example.test`),
  }));
  const revisions = new WeakMap();
  const initial = () => ({
    version: 1,
    users: seeds.map((user) => ({ ...user })),
    credentials: {},
    audit: [],
    settings: { countries: ["Egypt"], audit: [] },
  });
  function read() {
    if (!storage) throw new Error(storageError);
    const raw = storage.getItem(LOCAL_ACCOUNTS_KEY);
    if (!raw) {
      const data = initial();
      revisions.set(data, raw);
      return data;
    }
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(
        "Saved local accounts are damaged. Clear this site's saved data to start again.",
      );
    }
    if (
      data?.version !== 1 ||
      !Array.isArray(data.users) ||
      !data.users.every(
        (u) =>
          u &&
          typeof u.id === "string" &&
          typeof u.displayName === "string" &&
          Object.values(ROLES).includes(u.role) &&
          !emailError(u.email),
      ) ||
      !data.credentials ||
      typeof data.credentials !== "object" ||
      Array.isArray(data.credentials) ||
      !Array.isArray(data.audit) ||
      !Array.isArray(data.settings?.countries) ||
      !Array.isArray(data.settings?.audit)
    )
      throw new Error(
        "Saved local accounts are invalid. Clear this site's saved data to start again.",
      );
    revisions.set(data, raw);
    return data;
  }
  function save(data) {
    if (storage.getItem(LOCAL_ACCOUNTS_KEY) !== revisions.get(data))
      throw new Error("Accounts changed in another tab. Retry the action.");
    storage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(data));
  }
  function admin(data, session) {
    return (
      session.status === "authenticated" &&
      session.user?.role === ROLES.SUPER_ADMIN &&
      data.users.some(
        (u) =>
          u.id === session.user.id &&
          u.role === ROLES.SUPER_ADMIN &&
          isActiveUser(u),
      )
    );
  }
  function audit(data, session, action, target, reason, before, after) {
    data.audit.unshift({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: session.user.displayName,
      action,
      target,
      reason: reason.trim(),
      before,
      after,
      result: "Local preview success",
    });
  }
  async function register(values, google = false) {
    try {
      const data = read();
      const memory = createMockAuthStore(data.users, data.settings);
      const result = google
        ? memory.registerGoogle(values)
        : memory.register(values);
      if (!result.ok) return result;
      data.users = memory.listUsers();
      if (!google)
        data.credentials[result.user.id] = await credential(values.password);
      save(data);
      return result;
    } catch {
      return failed(storageError);
    }
  }
  return {
    getRegistrationSettings() {
      try {
        return read().settings;
      } catch {
        return { countries: ["Egypt"], audit: [] };
      }
    },
    listUsers(session) {
      try {
        const data = read();
        return admin(data, session) ? data.users.map((u) => ({ ...u })) : [];
      } catch {
        return [];
      }
    },
    getAudit(session) {
      try {
        const data = read();
        return admin(data, session) ? data.audit : [];
      } catch {
        return [];
      }
    },
    findUser(id) {
      try {
        const user = read().users.find((u) => u.id === id);
        return user && toSessionUser(user);
      } catch {
        return undefined;
      }
    },
    getPublicProfileUser(id, role) {
      try {
        const user = read().users.find((u) => u.id === id && u.role === role);
        return (
          user && {
            id: user.id,
            role: user.role,
            displayName: user.displayName,
            accountStatus: user.accountStatus,
            verificationStatus: user.verificationStatus,
          }
        );
      } catch {
        return undefined;
      }
    },
    register: (values) => register(values),
    registerGoogle: (values) => register(values, true),
    async login({ email, password }) {
      if (emailError(email) || typeof password !== "string" || !password)
        return failed("Enter a valid email and password.");
      try {
        const data = read();
        const user = data.users.find((u) => u.email === normalizeEmail(email));
        if (!user) return failed("Email or password is incorrect.");
        let saved = data.credentials[user.id];
        // Provisioned fictional seed accounts have a published demo password.
        if (!saved && seeds.some((u) => u.id === user.id)) {
          if (password !== DEMO_PASSWORD)
            return failed("Email or password is incorrect.");
          saved = await credential(password);
          data.credentials[user.id] = saved;
        } else {
          if (!validCredential(saved))
            return failed("Email or password is incorrect.");
          const hash = await derive(password, saved.salt);
          if (!hash.every((n, i) => n === saved.hash[i]))
            return failed("Email or password is incorrect.");
        }
        if (!isActiveUser(user)) return failed("This account is inactive.");
        save(data);
        return { ok: true, user: toSessionUser(user) };
      } catch {
        return failed(storageError);
      }
    },
    forgotPassword: (email) => createMockAuthStore().forgotPassword(email),
    async resetPassword(values) {
      try {
        const data = read();
        const result = createMockAuthStore(data.users).resetPassword(values);
        if (!result.ok) return result;
        const user = data.users.find(
          (u) => u.email === normalizeEmail(values.email),
        );
        data.credentials[user.id] = await credential(values.password);
        save(data);
        return {
          ok: true,
          message:
            "Password saved on this browser. No email ownership or reset token was checked.",
        };
      } catch {
        return failed(storageError);
      }
    },
    updateAccountStatus(session, { target, value, reason }) {
      try {
        const data = read();
        if (!admin(data, session))
          return failed("Only the Super Admin can manage accounts.");
        const user = data.users.find((u) => u.id === target);
        if (
          !user ||
          user.role === ROLES.SUPER_ADMIN ||
          !["active", "suspended", "banned"].includes(value) ||
          user.accountStatus === "banned" ||
          !reason?.trim()
        )
          return failed(
            "Choose an eligible account, status and decision reason.",
          );
        audit(
          data,
          session,
          "Change account status",
          target,
          reason,
          user.accountStatus,
          value,
        );
        user.accountStatus = value;
        save(data);
        return { ok: true };
      } catch {
        return failed(storageError);
      }
    },
    addRegistrationCountry(session, values) {
      try {
        const data = read();
        if (!admin(data, session))
          return failed("Only the Super Admin can add countries.");
        const memory = createMockAuthStore(data.users, data.settings);
        const result = memory.addRegistrationCountry(session, values);
        if (result.ok) {
          data.settings = memory.getRegistrationSettings();
          save(data);
        }
        return result;
      } catch {
        return failed(storageError);
      }
    },
  };
}

export function getLoginDestination(user) {
  if ([ROLES.STUDENT, ROLES.CLIENT].includes(user.role)) return "/profile";
  if (user.role === ROLES.SUPER_ADMIN) return "/admin";
  const committee = Object.entries(committeeRoles).find(
    ([, role]) => role === user.role,
  )?.[0];
  return committee ? `/committee/${committee}` : `/${user.role}/dashboard`;
}
