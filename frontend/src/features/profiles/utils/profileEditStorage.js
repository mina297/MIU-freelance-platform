import { PROFILE_EDIT_STORAGE_KEY } from "../constants.js";
import { ownsProfile } from "./profileOwnership.js";

export function loadProfileEdits() {
  try {
    const raw = window.sessionStorage.getItem(PROFILE_EDIT_STORAGE_KEY);
    const value = raw ? JSON.parse(raw) : {};
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
}

/**
 * @param {string} profileId
 * @param {Record<string, unknown>} patch
 */
export function saveProfileEdit(profileId, patch, session) {
  if (!ownsProfile(session, profileId, session?.user?.role))
    throw new Error("Only the active profile owner can save changes.");
  const allowed = [
    "displayName",
    "headline",
    "shortBio",
    "aboutParagraphs",
    "location",
    "links",
    "profileImage",
    "profileImageAlt",
    "firstName",
    "skills",
    "availability",
    "languages",
    "rateEGP",
    "organizationName",
  ];
  const safePatch = Object.fromEntries(
    Object.entries(patch).filter(([key]) => allowed.includes(key)),
  );
  const all = loadProfileEdits();
  all[profileId] = { ...(all[profileId] ?? {}), ...safePatch };
  window.sessionStorage.setItem(PROFILE_EDIT_STORAGE_KEY, JSON.stringify(all));
  return all[profileId];
}

export function getProfileEdit(profileId) {
  return loadProfileEdits()[profileId] ?? null;
}
