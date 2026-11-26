import { PROFILE_EDIT_STORAGE_KEY } from "../constants.js";
import { ownsProfile } from "./profileOwnership.js";
import { readProfileLocalData } from "./profileLocalStorage.js";

export function loadProfileEdits() {
  try {
    const value = readProfileLocalData(PROFILE_EDIT_STORAGE_KEY);
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
  const all = readProfileLocalData(PROFILE_EDIT_STORAGE_KEY);
  all[profileId] = { ...(all[profileId] ?? {}), ...safePatch };
  window.localStorage.setItem(PROFILE_EDIT_STORAGE_KEY, JSON.stringify(all));
  return all[profileId];
}

export function getProfileEdit(profileId) {
  return loadProfileEdits()[profileId] ?? null;
}
