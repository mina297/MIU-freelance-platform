import {
  isActiveUser,
  PUBLIC_REGISTRATION_ROLES,
  toSessionUser,
} from "./session.js";

export const normalizeEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";
export const emailError = (email) =>
  /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(normalizeEmail(email))
    ? ""
    : "Enter a valid email address.";
export const passwordError = (password) =>
  typeof password === "string" &&
  password.length >= 8 &&
  /[a-z]/i.test(password) &&
  /[0-9]/.test(password)
    ? ""
    : "Use at least 8 characters, including a letter and a number.";

export function validateRegistration(values) {
  const errors = {};
  if (typeof values.fullName !== "string" || !values.fullName.trim())
    errors.fullName = "Enter your full name.";
  if (emailError(values.email)) errors.email = emailError(values.email);
  if (passwordError(values.password))
    errors.password = passwordError(values.password);
  if (!values.confirmPassword || values.password !== values.confirmPassword)
    errors.confirmPassword = "Passwords must match.";
  if (!PUBLIC_REGISTRATION_ROLES.includes(values.role))
    errors.role = "Choose Student or Client.";
  return errors;
}

/** One store per provider mount. Passwords stay in this private memory-only map. */
export function createMockAuthStore(fixtures = []) {
  const accounts = new Map(
    fixtures.map((user) => [
      user.id,
      {
        ...toSessionUser(user),
        email: normalizeEmail(user.email || `${user.id}@example.test`),
      },
    ]),
  );
  const passwords = new Map();
  let nextId = 1;
  const findByEmail = (email) =>
    [...accounts.values()].find((user) => user.email === normalizeEmail(email));
  return {
    findUser(id) {
      const user = accounts.get(id);
      return user ? toSessionUser(user) : undefined;
    },
    register(values) {
      const errors = validateRegistration(values);
      if (findByEmail(values.email))
        errors.email = "This email address is already in use.";
      if (Object.keys(errors).length) return { ok: false, errors };
      let id;
      do {
        id = `registered_${nextId++}`;
      } while (accounts.has(id));
      const user = {
        id,
        displayName: values.fullName.trim(),
        email: normalizeEmail(values.email),
        role: values.role,
        accountStatus: "active",
        verificationStatus: "pending",
      };
      accounts.set(id, user);
      passwords.set(id, values.password);
      return { ok: true, user: toSessionUser(user) };
    },
    login({ email, password }) {
      const errors = {};
      if (emailError(email)) errors.email = emailError(email);
      if (typeof password !== "string" || !password)
        errors.password = "Enter your password.";
      if (Object.keys(errors).length) return { ok: false, errors };
      const user = findByEmail(email);
      if (
        !user ||
        !passwords.has(user.id) ||
        passwords.get(user.id) !== password
      )
        return {
          ok: false,
          errors: { form: "Email or password is incorrect." },
        };
      if (!isActiveUser(user))
        return {
          ok: false,
          errors: {
            form: "This account is inactive.",
          },
        };
      return { ok: true, user: toSessionUser(user) };
    },
    forgotPassword(email) {
      if (emailError(email))
        return { ok: false, errors: { email: emailError(email) } };
      return {
        ok: true,
        message:
          "Prototype recovery: no email was sent. Use the reset form; no secure reset token is issued.",
      };
    },
    resetPassword({ email, password, confirmPassword }) {
      const errors = {};
      if (emailError(email)) errors.email = emailError(email);
      if (passwordError(password)) errors.password = passwordError(password);
      if (!confirmPassword || password !== confirmPassword)
        errors.confirmPassword = "Passwords must match.";
      if (Object.keys(errors).length) return { ok: false, errors };
      const user = findByEmail(email);
      if (!user)
        return {
          ok: false,
          errors: {
            email: "No account with this email exists in this prototype.",
          },
        };
      if (!isActiveUser(user))
        return {
          ok: false,
          errors: {
            form: "This account is inactive. Its password cannot be changed.",
          },
        };
      passwords.set(user.id, password);
      return {
        ok: true,
        message:
          "Prototype password updated until refresh. No secure token was checked.",
      };
    },
  };
}
