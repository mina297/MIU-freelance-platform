import {
  marketplaceCategories,
  marketplaceSkills,
} from "../../data/fixtures/marketplace.js";
import { isActiveUser, ROLES } from "../auth/session.js";

export const EMPTY_PROJECT = Object.freeze({
  title: "",
  description: "",
  scope: "",
  deliverables: "",
  categoryId: "",
  requiredSkillIds: [],
  budgetEGP: "",
  deadline: "",
});

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function clientEligibility(session, publishing = false) {
  if (
    session?.status !== "authenticated" ||
    !isActiveUser(session.user) ||
    session.user.role !== ROLES.CLIENT
  )
    return "An active client session is required.";
  // Account-origin metadata is not yet available in Member 1's session contract.
  if (publishing && session.user.verificationStatus !== "approved")
    return "Client verification is required before publishing this demo project.";
  return null;
}

export function validateProject(values, today = localDate()) {
  const errors = {};
  for (const [name, label, limit] of [
    ["title", "Project title", 120],
    ["description", "Description", 2000],
    ["scope", "Scope of work", 5000],
    ["deliverables", "Deliverables", 3000],
  ]) {
    if (typeof values[name] !== "string" || !values[name].trim())
      errors[name] = `${label} is required.`;
    else if (values[name].length > limit)
      errors[name] = `${label} must be ${limit} characters or fewer.`;
  }
  if (!marketplaceCategories.some(({ id }) => id === values.categoryId))
    errors.categoryId = "Choose a listed category.";
  if (
    !Array.isArray(values.requiredSkillIds) ||
    !values.requiredSkillIds.length ||
    new Set(values.requiredSkillIds).size !== values.requiredSkillIds.length ||
    values.requiredSkillIds.some(
      (id) => !marketplaceSkills.some((skill) => skill.id === id),
    )
  )
    errors.requiredSkillIds =
      "Choose at least one listed skill without duplicates.";
  const amount = String(values.budgetEGP ?? "").trim();
  if (
    !/^\d+(\.\d{1,2})?$/.test(amount) ||
    Number(amount) <= 0 ||
    Number(amount) > Number.MAX_SAFE_INTEGER / 100
  )
    errors.budgetEGP =
      "Enter a positive EGP budget with up to two decimal places.";
  const date = values.deadline;
  const parsed =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00Z`)
      : null;
  if (
    !parsed ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date ||
    date <= today
  )
    errors.deadline = "Choose a valid deadline after today.";
  return errors;
}

export function normalizeProject(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    scope: values.scope.trim(),
    deliverables: values.deliverables
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
    categoryId: values.categoryId,
    requiredSkillIds: [...values.requiredSkillIds],
    budgetEGP: Number(values.budgetEGP),
    deadline: values.deadline,
  };
}
