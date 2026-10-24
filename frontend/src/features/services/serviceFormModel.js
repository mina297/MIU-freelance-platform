import { isActiveUser, ROLES } from "../auth/session.js";
import {
  marketplaceCategories,
  marketplaceSkills,
} from "../../data/fixtures/marketplace.js";

export function studentServiceAccess(session, publishing = false) {
  if (
    session?.status !== "authenticated" ||
    !isActiveUser(session.user) ||
    session.user.role !== ROLES.STUDENT
  )
    return "An active student account is required.";
  if (publishing && session.user.verificationStatus !== "approved")
    return "Student verification must be approved before publishing or editing a published service.";
  return null;
}

export const newPackageRow = () => ({
  id: `form_${crypto.randomUUID()}`,
  name: "",
  description: "",
  includedFeatures: "",
  priceEGP: "",
  deliveryDays: "",
});
export const newExtraRow = () => ({
  id: `form_${crypto.randomUUID()}`,
  title: "",
  description: "",
  additionalPriceEGP: "",
  additionalDays: "",
});
export const emptyServiceValues = () => ({
  title: "",
  description: "",
  categoryId: "",
  skillIds: [],
  packages: [newPackageRow()],
  extras: [],
});

export function serviceFormValues(service, data) {
  if (!service) return emptyServiceValues();
  return {
    title: service.title,
    description: service.description,
    categoryId: service.categoryId,
    skillIds: [...service.skillIds],
    packages: data.servicePackages
      .filter((pack) => pack.serviceId === service.id)
      .map((pack) => ({
        ...pack,
        includedFeatures: pack.includedFeatures.join("\n"),
        priceEGP: String(pack.priceEGP),
        deliveryDays: String(pack.deliveryDays),
      })),
    extras: data.serviceExtras
      .filter((extra) => extra.serviceId === service.id)
      .map((extra) => ({
        ...extra,
        additionalPriceEGP: String(extra.additionalPriceEGP),
        additionalDays: String(extra.additionalDays),
      })),
  };
}

const money = (value, zero = false) => {
  const text = String(value ?? "").trim();
  const amount = Number(text);
  return (
    /^\d+(\.\d{1,2})?$/.test(text) &&
    Number.isFinite(amount) &&
    amount >= (zero ? 0 : 0.01) &&
    amount <= Number.MAX_SAFE_INTEGER / 100
  );
};
const days = (value, zero = false) =>
  /^\d+$/.test(String(value ?? "").trim()) &&
  Number.isSafeInteger(Number(value)) &&
  Number(value) >= (zero ? 0 : 1);

/** Field limits protect the demo UI; package count/names are not platform policies. */
export function validateService(values) {
  const errors = {};
  function text(value, key, label, limit) {
    if (typeof value !== "string" || !value.trim())
      errors[key] = `${label} is required.`;
    else if (value.length > limit)
      errors[key] = `Use ${limit} characters or fewer.`;
  }
  text(values.title, "title", "Service title", 120);
  text(values.description, "description", "Description", 3000);
  if (!marketplaceCategories.some(({ id }) => id === values.categoryId))
    errors.categoryId = "Choose a listed category.";
  if (
    !Array.isArray(values.skillIds) ||
    !values.skillIds.length ||
    new Set(values.skillIds).size !== values.skillIds.length ||
    values.skillIds.some(
      (id) => !marketplaceSkills.some((skill) => skill.id === id),
    )
  )
    errors.skillIds = "Choose at least one listed skill without duplicates.";
  if (!Array.isArray(values.packages) || !values.packages.length)
    errors.packages = "Add at least one complete package.";
  if (!Array.isArray(values.extras)) errors.extras = "Use a valid extras list.";
  for (const [group, rows] of [
    ["packages", values.packages],
    ["extras", values.extras],
  ]) {
    if (!Array.isArray(rows)) continue;
    if (
      rows.some(
        (row) => !row || typeof row.id !== "string" || !row.id.trim(),
      ) ||
      new Set(rows.map((row) => row?.id)).size !== rows.length
    ) {
      errors[group] =
        "Each row needs a unique identity. Reopen the form and try again.";
      continue;
    }
    rows.forEach((row, index) => {
      const key = `${group}.${index}`;
      text(
        row[group === "packages" ? "name" : "title"],
        `${key}.${group === "packages" ? "name" : "title"}`,
        "Name",
        120,
      );
      text(row.description, `${key}.description`, "Scope", 2000);
      const amountKey =
        group === "packages" ? "priceEGP" : "additionalPriceEGP";
      const daysKey = group === "packages" ? "deliveryDays" : "additionalDays";
      if (!money(row[amountKey], group === "extras"))
        errors[`${key}.${amountKey}`] =
          "Enter a valid EGP amount with up to two decimals; packages must cost more than zero.";
      if (!days(row[daysKey], group === "extras"))
        errors[`${key}.${daysKey}`] =
          "Enter whole days; packages need at least one day and extras may add zero days.";
      if (group === "packages")
        text(
          row.includedFeatures,
          `${key}.includedFeatures`,
          "Included deliverables",
          3000,
        );
    });
  }
  return errors;
}

export const featureLines = (text) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
