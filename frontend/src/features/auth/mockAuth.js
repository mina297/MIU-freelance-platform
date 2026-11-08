import {
  isActiveUser,
  PUBLIC_REGISTRATION_ROLES,
  ROLES,
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

const initialCountries = Object.freeze(["Egypt"]);

export function validateRegistration(values, countries = initialCountries) {
  const errors = {};
  if (typeof values.firstName !== "string" || !values.firstName.trim())
    errors.firstName = "Enter your first name.";
  if (typeof values.lastName !== "string" || !values.lastName.trim())
    errors.lastName = "Enter your last name.";
  if (!countries.includes(values.country))
    errors.country = "Choose an available country.";
  if (values.acceptTerms !== true)
    errors.acceptTerms = "Accept the terms to create an account.";
  const email = normalizeEmail(values.email);
  const invalidEmail = emailError(email);
  if (invalidEmail) {
    errors.email = invalidEmail;
  } else if (
    values.role === ROLES.STUDENT &&
    !email.endsWith("@miuegypt.edu.eg")
  ) {
    errors.email = "Use your university email ending in @miuegypt.edu.eg.";
  }
  if (passwordError(values.password))
    errors.password = passwordError(values.password);
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
  let settings = { countries: initialCountries, audit: [] };
  let nextId = 1;
  const findByEmail = (email) =>
    [...accounts.values()].find((user) => user.email === normalizeEmail(email));
  return {
    getRegistrationSettings: () => settings,
    addRegistrationCountry(session, { country, reason }) {
      if (
        session.status !== "authenticated" ||
        !isActiveUser(session.user) ||
        session.user.role !== ROLES.SUPER_ADMIN
      ) {
        return {
          ok: false,
          message: "Only the Super Admin can add countries.",
        };
      }
      const name =
        typeof country === "string"
          ? country.trim().normalize("NFC").replace(/\s+/g, " ")
          : "";
      if (name.length > 80 || !/^\p{L}[\p{L}\p{M} .’'()-]*$/u.test(name)) {
        return { ok: false, message: "Enter a country name." };
      }
      if (
        settings.countries.some(
          (item) => item.toLowerCase() === name.toLowerCase(),
        )
      ) {
        return { ok: false, message: "This country is already available." };
      }
      if (typeof reason !== "string" || !reason.trim()) {
        return { ok: false, message: "A decision reason is required." };
      }
      settings = {
        countries: Object.freeze([...settings.countries, name]),
        audit: [
          {
            id: `registration-country-${name}`,
            timestamp: new Date().toISOString(),
            actor: session.user.displayName,
            action: "Add registration country",
            target: name,
            reason: reason.trim(),
            before: "Unavailable",
            after: "Available",
            result: "Simulated success",
          },
          ...settings.audit,
        ],
      };
      return { ok: true, message: "Country added to the sign-up list." };
    },
    findUser(id) {
      const user = accounts.get(id);
      return user ? toSessionUser(user) : undefined;
    },
    register(values) {
      const errors = validateRegistration(values, settings.countries);
      if (!errors.email && findByEmail(values.email))
        errors.email = "This email address is already in use.";
      if (Object.keys(errors).length) return { ok: false, errors };
      let id;
      do {
        id = `registered_${nextId++}`;
      } while (accounts.has(id));
      const firstName = values.firstName.trim();
      const lastName = values.lastName.trim();
      const user = {
        id,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        country: values.country,
        emailSubscription: values.emailSubscription === true,
        acceptTerms: true,
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
